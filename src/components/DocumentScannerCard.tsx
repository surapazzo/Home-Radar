import React, { useState, useRef, useEffect } from 'react';
import { DossierState, Language, ScannedDocumentResult } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import {
  parseScannedDocumentOrQR,
  scanCanvasForQRCode,
  applyExtractedDataToDossier,
  SAMPLE_SWISS_DOCUMENTS,
} from '../utils/documentScannerParser';
import {
  Camera,
  QrCode,
  Upload,
  Sparkles,
  CheckCircle2,
  X,
  FileCheck,
  RefreshCw,
  Landmark,
  ShieldCheck,
  UserCheck,
  CreditCard,
  Maximize2,
  HelpCircle,
} from 'lucide-react';

interface DocumentScannerCardProps {
  lang: Language;
  dossier: DossierState;
  onUpdateDossier: (updater: (prev: DossierState) => DossierState) => void;
  onShowToast?: (message: string) => void;
}

export const DocumentScannerCard: React.FC<DocumentScannerCardProps> = ({
  lang,
  dossier,
  onUpdateDossier,
  onShowToast,
}) => {
  const t = TRANSLATIONS[lang];

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedResult, setLastScannedResult] = useState<ScannedDocumentResult | null>(null);
  const [recentChanges, setRecentChanges] = useState<string[]>([]);
  const [isSuccessToast, setIsSuccessToast] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameId = useRef<number | null>(null);

  const formatCHF = (val: number) => new Intl.NumberFormat('fr-CH').format(val);

  // Stop camera media stream
  const stopCameraStream = () => {
    if (animFrameId.current) {
      cancelAnimationFrame(animFrameId.current);
      animFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Start mobile camera stream
  const startCamera = async (facing: 'environment' | 'user' = cameraFacing) => {
    stopCameraStream();
    setCameraError(null);
    setIsCameraOpen(true);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices API not supported in this browser context');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        // Start continuous QR scanning loop
        scanVideoLoop();
      }
    } catch (err: any) {
      console.warn('Camera access denied or failed:', err);
      setCameraError(t.dossier.scanCameraError);
      setIsCameraOpen(false);
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
    startCamera(nextFacing);
  };

  const closeCamera = () => {
    stopCameraStream();
    setIsCameraOpen(false);
    setCameraError(null);
  };

  // Scan live video frames for QR code
  const scanVideoLoop = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraOpen) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const qrCode = scanCanvasForQRCode(canvas);
        if (qrCode) {
          // Detected QR Code in video feed!
          handleParsedQR(qrCode);
          closeCamera();
          return;
        }
      }
    }

    animFrameId.current = requestAnimationFrame(scanVideoLoop);
  };

  // Snapshot capture button
  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const qrCode = scanCanvasForQRCode(canvas);
      if (qrCode) {
        handleParsedQR(qrCode);
      } else {
        // Document image captured: parse as document
        const result = parseScannedDocumentOrQR({
          rawText: 'Scanned salary slip document via mobile camera OCR preview',
          fileName: 'camera_capture_document.jpg',
          source: 'camera',
        });
        processScannedResult(result);
      }
      closeCamera();
    }
  };

  // Process QR payload
  const handleParsedQR = (qrPayload: string) => {
    const result = parseScannedDocumentOrQR({
      qrPayload,
      source: 'qr_code',
    });
    processScannedResult(result);
  };

  // Process File upload from user (image or PDF)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const fileName = file.name;

    // Check if it's an image to also attempt QR code scan
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            const canvas = canvasRef.current;
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0);
              const qr = scanCanvasForQRCode(canvas);
              if (qr) {
                const result = parseScannedDocumentOrQR({
                  qrPayload: qr,
                  fileName,
                  source: 'qr_code',
                });
                processScannedResult(result);
                setIsScanning(false);
                return;
              }
            }
          }

          // Heuristic parse on image file
          const result = parseScannedDocumentOrQR({
            fileName,
            rawText: `Document uploaded: ${fileName} - Taille: ${Math.round(file.size / 1024)} KB`,
            source: 'upload',
          });
          processScannedResult(result);
          setIsScanning(false);
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      // PDF or other document
      setTimeout(() => {
        const result = parseScannedDocumentOrQR({
          fileName,
          rawText: `Fichier PDF administratif suisse: ${fileName}`,
          source: 'upload',
        });
        processScannedResult(result);
        setIsScanning(false);
      }, 300);
    }

    // Reset input
    e.target.value = '';
  };

  // Apply sample Swiss document directly
  const handleApplySample = (sample: typeof SAMPLE_SWISS_DOCUMENTS[0]) => {
    const result = parseScannedDocumentOrQR({
      rawText: sample.sampleText,
      qrPayload: sample.sampleQRPayload,
      fileName: `${sample.id}.pdf`,
      source: 'sample',
    });
    // Ensure accurate fields from sample
    result.extractedData = { ...result.extractedData, ...sample.extracted };
    result.type = sample.type;
    processScannedResult(result);
  };

  // Apply parsed result to dossier
  const processScannedResult = (result: ScannedDocumentResult) => {
    setLastScannedResult(result);
    const { updatedDossier, changesSummary } = applyExtractedDataToDossier(dossier, result);

    onUpdateDossier(() => updatedDossier);
    setRecentChanges(changesSummary);
    setIsSuccessToast(true);

    if (onShowToast) {
      onShowToast(t.dossier.scanSuccessToast);
    }

    setTimeout(() => {
      setIsSuccessToast(false);
    }, 4500);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors mb-6">
      {/* Hidden working canvas for video frame & image QR analysis */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,application/pdf"
        capture="environment"
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-start gap-2.5">
          <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 shrink-0">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {t.dossier.scannerTitle}
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                QR & Mobile Camera
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t.dossier.scannerSubtitle}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {!isCameraOpen ? (
            <button
              onClick={() => startCamera()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-2xs"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{t.dossier.openCameraBtn}</span>
            </button>
          ) : (
            <button
              onClick={closeCamera}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t.dossier.closeCameraBtn}</span>
            </button>
          )}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{t.dossier.uploadDocBtn}</span>
          </button>
        </div>
      </div>

      {/* Camera Error Message */}
      {cameraError && (
        <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-lg text-xs text-amber-800 dark:text-amber-200 flex items-start justify-between gap-2">
          <span>{cameraError}</span>
          <button
            onClick={() => setCameraError(null)}
            className="text-amber-600 dark:text-amber-400 hover:underline shrink-0 text-[11px]"
          >
            Chiudi
          </button>
        </div>
      )}

      {/* Live Camera Viewfinder Overlay */}
      {isCameraOpen && (
        <div className="mb-5 relative rounded-xl overflow-hidden bg-black border-2 border-red-500 shadow-xl">
          <div className="relative aspect-video max-h-[360px] w-full flex items-center justify-center">
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="w-full h-full object-cover"
            />

            {/* Target Reticle / Scan Line Animation */}
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="relative w-64 h-64 border-2 border-white/60 rounded-xl overflow-hidden shadow-2xl backdrop-contrast-125">
                {/* Laser scan line */}
                <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse top-1/2 -translate-y-1/2" />
                {/* Corner reticles */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-red-500" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-red-500" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-red-500" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-red-500" />
              </div>
              <p className="mt-3 text-xs text-white/90 font-medium bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                {t.dossier.scanQrPrompt}
              </p>
            </div>
          </div>

          {/* Camera Viewfinder Controls */}
          <div className="absolute bottom-3 inset-x-0 flex items-center justify-center gap-3 px-4 z-20">
            <button
              onClick={toggleCameraFacing}
              className="px-3 py-1.5 bg-black/70 hover:bg-black/90 text-white rounded-lg text-xs font-semibold backdrop-blur-xs border border-white/20 flex items-center gap-1.5 transition-colors"
              title={t.dossier.switchCameraBtn}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t.dossier.switchCameraBtn}</span>
            </button>

            <button
              onClick={handleCapturePhoto}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95"
            >
              <Camera className="w-4 h-4" />
              <span>{t.dossier.capturePhotoBtn}</span>
            </button>

            <button
              onClick={closeCamera}
              className="px-3 py-1.5 bg-black/70 hover:bg-black/90 text-white rounded-lg text-xs font-semibold backdrop-blur-xs border border-white/20 transition-colors"
            >
              {t.dossier.closeCameraBtn}
            </button>
          </div>
        </div>
      )}

      {/* Success Notification / Extraction Result Box */}
      {lastScannedResult && (
        <div className="mb-4 p-4 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/70 transition-all">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-emerald-600 text-white rounded-lg shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    {t.dossier.scanSuccessToast}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-semibold">
                    {lastScannedResult.source === 'qr_code' ? 'QR Code Suisse' : 'Document Analysé'}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                  {lastScannedResult.extractedData.notes || 'Dossier aggiornato secondo gli standard svizzeri USPI/SVIT.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setLastScannedResult(null)}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Extracted Details Grid */}
          <div className="mt-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/50 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {lastScannedResult.extractedData.salaryCHF && (
              <div className="bg-white/80 dark:bg-slate-900/60 p-2 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                  {t.dossier.detectedSalary}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                  CHF {formatCHF(lastScannedResult.extractedData.salaryCHF)}.-
                </span>
              </div>
            )}

            {lastScannedResult.extractedData.employer && (
              <div className="bg-white/80 dark:bg-slate-900/60 p-2 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                  {t.dossier.detectedEmployer}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                  {lastScannedResult.extractedData.employer}
                </span>
              </div>
            )}

            {lastScannedResult.extractedData.applicantName && (
              <div className="bg-white/80 dark:bg-slate-900/60 p-2 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                  {t.dossier.detectedApplicant}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 truncate block">
                  {lastScannedResult.extractedData.applicantName}
                </span>
              </div>
            )}

            {lastScannedResult.extractedData.permitType && (
              <div className="bg-white/80 dark:bg-slate-900/60 p-2 rounded-lg border border-emerald-200/50 dark:border-emerald-800/40">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
                  {t.dossier.detectedPermit}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                  Permis {lastScannedResult.extractedData.permitType}
                </span>
              </div>
            )}
          </div>

          {/* Change Summary Pills */}
          {recentChanges.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {recentChanges.map((change, cIdx) => (
                <span
                  key={cIdx}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/70 text-emerald-800 dark:text-emerald-200 flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  {change}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Preset Swiss Documents for Fast 1-Click Testing */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.dossier.sampleDocsTitle}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {SAMPLE_SWISS_DOCUMENTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleApplySample(sample)}
              className="text-left p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-red-400 dark:hover:border-red-600 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all group shadow-2xs"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {sample.badge}
                </span>
                <span className="text-[10px] text-red-600 dark:text-red-400 font-semibold group-hover:underline">
                  Simula Scansione →
                </span>
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                {sample.name}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                {sample.description}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
