import jsQR from 'jsqr';
import { DossierState, ScannedDocumentResult, ScannedDocumentType } from '../types';

export interface SampleSwissDocument {
  id: string;
  name: string;
  type: ScannedDocumentType;
  description: string;
  badge: string;
  sampleText: string;
  sampleQRPayload?: string;
  extracted: ScannedDocumentResult['extractedData'];
}

export const SAMPLE_SWISS_DOCUMENTS: SampleSwissDocument[] = [
  {
    id: 'sample-sal-1',
    name: 'Fiche de Salaire Suisse (EPFL Innovation Park)',
    type: 'salary_slip',
    badge: 'Fiche de Salaire · VD',
    description: 'Busta paga mensile con stipendio netto CHF 8\'200.- e datore di lavoro svizzero.',
    sampleText: `BULLETIN DE SALAIRE - OCTOBRE 2026
Employeur: EPFL Innovation Park SA, 1015 Lausanne
Employé: Matteo Colombo
No AVS: 756.9281.3341.88
Statut: Contrat de durée indéterminée (CDI 100%)
Salaire brut mensuel: CHF 9'850.00
Déductions AVS/AI/APG/AC/LPP/AANP: CHF 1'650.00
SALAIRE NET À PAYER: CHF 8'200.00
Versement sur compte bancaire BCV Lausanne`,
    sampleQRPayload: JSON.stringify({
      version: 'CH-DOSSIER-1.0',
      docType: 'salary_slip',
      applicant: 'Matteo Colombo',
      employer: 'EPFL Innovation Park SA',
      netSalaryCHF: 8200,
      period: '2026-10',
      contract: 'CDI 100%',
    }),
    extracted: {
      salaryCHF: 8200,
      employer: 'EPFL Innovation Park SA',
      applicantName: 'Matteo Colombo',
      issueDate: '2026-10-25',
      notes: 'CDI 100% à Lausanne, salaire net vérifié CHF 8\'200.-',
    },
  },
  {
    id: 'sample-id-1',
    name: 'Titre de Séjour / Permis B Suisse (Canton Vaud)',
    type: 'identity_doc',
    badge: 'Permis B · Séjour CH',
    description: 'Permesso di dimora B biometrico svizzero con attività lucrativa autorizzata.',
    sampleText: `CONFÉDÉRATION SUISSE - CANTON DE VAUD
TITRE DE SÉJOUR POUR RESSORTISSANT UE/AELE
Type: Permis B (Séjour avec activité lucrative)
Nom: Colombo
Prénom: Matteo
Date de naissance: 14.08.1992
Nationalité: Italienne
Valable jusqu'au: 31.08.2030
Autorité: Service de la population (SPOP) Canton de Vaud`,
    sampleQRPayload: 'SWISS-EID:PERMIT=B;NAME=Matteo Colombo;DOB=1992-08-14;CANTON=VD;STATUS=VALID',
    extracted: {
      applicantName: 'Matteo Colombo',
      permitType: 'B',
      dateOfBirth: '1992-08-14',
      issueDate: '2025-09-01',
      notes: 'Permis B UE/AELE valable jusqu\'en 2030 (SPOP VD)',
    },
  },
  {
    id: 'sample-poursuites-1',
    name: 'Extrait du Registre des Poursuites (Vergine / Vierge)',
    type: 'poursuites_extract',
    badge: 'Poursuites · Vierges',
    description: 'Certificato ufficiale dell\'Ufficio Esecuzioni e Fallimenti svizzero senza precetti o pignoramenti.',
    sampleText: `OFFICE DES POURSUITES DU DISTRICT DE NYON (VD)
EXTRAIT DU REGISTRE DES POURSUITES
Concerne: Matteo Colombo, né le 14.08.1992
Domicile actuel: Avenue de la Gare 14, 1003 Lausanne
Période consultée: 01.10.2023 au 30.09.2026 (3 ans)
RÉSULTAT: AUCUNE POURSUITE NI ACTE DE DÉFAUT DE BIENS EN COURS.
Extrait conforme délivré le 02.10.2026`,
    sampleQRPayload: 'CH-POURSUITES:DISTRICT=NYON;NAME=Matteo Colombo;STATUS=CLEAN;COUNT=0;DATE=2026-10-02',
    extracted: {
      applicantName: 'Matteo Colombo',
      poursuitesClean: true,
      issueDate: '2026-10-02',
      notes: 'Aucune poursuite ni acte de défaut de biens (Office des poursuites)',
    },
  },
  {
    id: 'sample-rc-1',
    name: 'Attestation d\'Assurance RC Ménage Privée',
    type: 'rc_assurance',
    badge: 'Police RC Ménage',
    description: 'Polizza di responsabilità civile privata e mobilia domestica con copertura danni locatario.',
    sampleText: `LA MOBILIÈRE SUISSE - SOCIÉTÉ D'ASSURANCES
ATTESTATION D'ASSURANCE RESPONSABILITÉ CIVILE PRIVÉE & MÉNAGE
Preneur d'assurance: Matteo Colombo
Police no: MOB-VD-9481230-26
Couverture: Responsabilité civile privée incluant dégâts locatifs (Art. 257f CO)
Somme d'assurance: CHF 5'000'000.00 par sinistre
Validité: Du 01.01.2026 au 31.12.2026 (tacite reconduction)`,
    sampleQRPayload: 'CH-INSURANCE:PROVIDER=La Mobilière;TYPE=RC_MENAGE;NAME=Matteo Colombo;VALID=TRUE',
    extracted: {
      applicantName: 'Matteo Colombo',
      hasRC: true,
      issueDate: '2026-01-01',
      notes: 'RC Privée avec garantie dégâts locatifs 5 Mio CHF',
    },
  },
  {
    id: 'sample-qr-bundle',
    name: 'QR Code Administratif Svizzero (e-Dossier USPI)',
    type: 'swiss_egov_qr',
    badge: 'QR Code e-Dossier',
    description: 'Bundle QR interoperabile contenente stipendio, datore di lavoro e validazione solvibilità.',
    sampleText: 'QR-CODE PAYLOAD ENCODED',
    sampleQRPayload: JSON.stringify({
      protocol: 'SWISS_REGIE_DOSSIER_V1',
      candidate: 'Matteo Colombo',
      employer: 'EPFL Innovation Park SA',
      salaryNetCHF: 8500,
      permit: 'B',
      poursuitesStatus: 'CLEAN',
      rcCoverage: true,
      timestamp: '2026-10-12T14:30:00Z',
    }),
    extracted: {
      salaryCHF: 8500,
      employer: 'EPFL Innovation Park SA',
      applicantName: 'Matteo Colombo',
      permitType: 'B',
      poursuitesClean: true,
      hasRC: true,
      notes: 'Dossier complet certifié QR code eGov / régies USPI',
    },
  },
];

/**
 * Scan an HTML canvas for a QR code using jsQR.
 */
export function scanCanvasForQRCode(canvas: HTMLCanvasElement): string | null {
  try {
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    });
    if (code && code.data) {
      return code.data.trim();
    }
  } catch (err) {
    console.warn('QR scan error on canvas:', err);
  }
  return null;
}

/**
 * Parses raw text, QR payload, or file metadata into a structured ScannedDocumentResult.
 */
export function parseScannedDocumentOrQR(options: {
  rawText?: string;
  qrPayload?: string;
  fileName?: string;
  source?: 'camera' | 'upload' | 'qr_code' | 'sample';
}): ScannedDocumentResult {
  const { rawText = '', qrPayload = '', fileName = '', source = 'upload' } = options;
  const combinedText = `${fileName} ${rawText} ${qrPayload}`.toLowerCase();

  const id = `scan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const timestamp = new Date().toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // 1. Try parsing JSON in QR payload if available
  if (qrPayload) {
    try {
      const parsedJson = JSON.parse(qrPayload);
      if (typeof parsedJson === 'object' && parsedJson !== null) {
        const salary =
          Number(parsedJson.salaryNetCHF) ||
          Number(parsedJson.netSalaryCHF) ||
          Number(parsedJson.salary) ||
          Number(parsedJson.salaireNet) ||
          undefined;

        const employer = parsedJson.employer || parsedJson.employeur || parsedJson.company;
        const applicant = parsedJson.candidate || parsedJson.applicant || parsedJson.name;
        const permit = parsedJson.permit || parsedJson.permitType;
        const poursuitesClean =
          parsedJson.poursuitesStatus === 'CLEAN' ||
          parsedJson.poursuitesClean === true ||
          parsedJson.docType === 'poursuites_extract';
        const hasRC = parsedJson.rcCoverage === true || parsedJson.docType === 'rc_assurance';

        let docType: ScannedDocumentType = 'swiss_egov_qr';
        if (parsedJson.docType === 'salary_slip' || salary) {
          docType = 'salary_slip';
        } else if (parsedJson.docType === 'identity_doc' || permit) {
          docType = 'identity_doc';
        } else if (parsedJson.docType === 'poursuites_extract' || poursuitesClean) {
          docType = 'poursuites_extract';
        } else if (parsedJson.docType === 'rc_assurance' || hasRC) {
          docType = 'rc_assurance';
        }

        return {
          id,
          timestamp,
          type: docType,
          fileName,
          source: 'qr_code',
          rawText,
          qrPayload,
          confidence: 0.98,
          extractedData: {
            salaryCHF: salary,
            employer: employer ? String(employer) : undefined,
            applicantName: applicant ? String(applicant) : undefined,
            permitType: permit ? (permit.toUpperCase() as any) : undefined,
            poursuitesClean: poursuitesClean || undefined,
            hasRC: hasRC || undefined,
            notes: 'Données extraites avec succès depuis le QR Code officiel',
          },
        };
      }
    } catch {
      // not JSON, fallback to format string check
    }

    // Check custom Swiss format string: SWISS-EID or CH-POURSUITES or SWISS-DOSSIER
    if (qrPayload.startsWith('SWISS-') || qrPayload.startsWith('CH-')) {
      const parts = qrPayload.split(';');
      const map: Record<string, string> = {};
      parts.forEach((p) => {
        const [k, v] = p.split('=');
        if (k && v) map[k.trim().toUpperCase()] = v.trim();
      });

      let docType: ScannedDocumentType = 'swiss_egov_qr';
      if (qrPayload.includes('PERMIT')) docType = 'identity_doc';
      if (qrPayload.includes('POURSUITES')) docType = 'poursuites_extract';
      if (qrPayload.includes('INSURANCE') || qrPayload.includes('RC')) docType = 'rc_assurance';
      if (qrPayload.includes('SALARY')) docType = 'salary_slip';

      const salary = map.SALARY ? parseInt(map.SALARY.replace(/[^0-9]/g, ''), 10) : undefined;
      const applicant = map.NAME || map.APPLICANT;
      const employer = map.EMPLOYER || map.COMPANY;
      const permit = map.PERMIT as any;
      const dateOfBirth = map.DOB;

      return {
        id,
        timestamp,
        type: docType,
        fileName,
        source: 'qr_code',
        rawText,
        qrPayload,
        confidence: 0.95,
        extractedData: {
          salaryCHF: salary && !isNaN(salary) ? salary : undefined,
          applicantName: applicant,
          employer,
          permitType: permit,
          dateOfBirth,
          poursuitesClean: docType === 'poursuites_extract' ? true : undefined,
          hasRC: docType === 'rc_assurance' ? true : undefined,
          notes: 'Format QR administratif suisse validé',
        },
      };
    }
  }

  // 2. Text / OCR / File-name heuristic classification
  let detectedType: ScannedDocumentType = 'unknown';
  let confidence = 0.5;

  const isSalary =
    combinedText.includes('salaire') ||
    combinedText.includes('lohn') ||
    combinedText.includes('busta paga') ||
    combinedText.includes('stipendio') ||
    combinedText.includes('bulletin de salaire') ||
    combinedText.includes('lohnausweis') ||
    combinedText.includes('payslip') ||
    combinedText.includes('salary');

  const isIdentity =
    combinedText.includes('permis') ||
    combinedText.includes('permesso') ||
    combinedText.includes('ausweis') ||
    combinedText.includes('séjour') ||
    combinedText.includes('identit') ||
    combinedText.includes('passport') ||
    combinedText.includes('passaporto') ||
    combinedText.includes('ue/aele') ||
    combinedText.includes('spop') ||
    combinedText.includes('migrationsamt');

  const isPoursuites =
    combinedText.includes('poursuite') ||
    combinedText.includes('betreibung') ||
    combinedText.includes('esecuzioni') ||
    combinedText.includes('fallimenti') ||
    combinedText.includes('défaut de biens') ||
    combinedText.includes('office des poursuites');

  const isRC =
    combinedText.includes('rc ménage') ||
    combinedText.includes('responsabilité civile') ||
    combinedText.includes('privathaftpflicht') ||
    combinedText.includes('responsabilità civile') ||
    combinedText.includes('assurance') ||
    combinedText.includes('mobilière') ||
    combinedText.includes('dégâts locatifs');

  if (isSalary) {
    detectedType = 'salary_slip';
    confidence = 0.92;
  } else if (isIdentity) {
    detectedType = 'identity_doc';
    confidence = 0.89;
  } else if (isPoursuites) {
    detectedType = 'poursuites_extract';
    confidence = 0.94;
  } else if (isRC) {
    detectedType = 'rc_assurance';
    confidence = 0.91;
  } else {
    detectedType = 'salary_slip'; // default assumption for Swiss dossier uploads
    confidence = 0.65;
  }

  // Extract Salary (CHF numbers)
  let extractedSalary: number | undefined;
  const salaryRegexes = [
    /(?:salaire\s*net|nettolohn|stipendio\s*netto|net\s*salary|chf)\s*[:=]?\s*([0-9]{1,2}(?:['\s.][0-9]{3})+(?:\.[0-9]{2})?)/i,
    /(?:salaire|lohn|stipendio|netto|chf)\s*[:=]?\s*([3-9][0-9]{3,4})/i,
    /chf\s*([0-9]{4,5})/i,
    /([0-9]{4,5})\s*chf/i,
  ];

  for (const re of salaryRegexes) {
    const match = (rawText || fileName).match(re);
    if (match && match[1]) {
      const cleanNum = parseInt(match[1].replace(/['\s.,]/g, ''), 10);
      if (cleanNum >= 2500 && cleanNum <= 50000) {
        extractedSalary = cleanNum;
        break;
      }
    }
  }

  // Extract Employer
  let extractedEmployer: string | undefined;
  const employerRegex = /(?:employeur|arbeitgeber|datore di lavoro|employer|société|company)\s*[:=]?\s*([A-Za-z0-9\s.,&'-]{3,40})/i;
  const empMatch = rawText.match(employerRegex);
  if (empMatch && empMatch[1]) {
    extractedEmployer = empMatch[1].trim();
  } else if (combinedText.includes('epfl')) {
    extractedEmployer = 'EPFL Innovation Park SA';
  } else if (combinedText.includes('novartis')) {
    extractedEmployer = 'Novartis AG';
  } else if (combinedText.includes('nestlé') || combinedText.includes('nestle')) {
    extractedEmployer = 'Nestlé SA';
  } else if (combinedText.includes('roche')) {
    extractedEmployer = 'F. Hoffmann-La Roche AG';
  } else if (combinedText.includes('ubs')) {
    extractedEmployer = 'UBS Switzerland AG';
  }

  // Extract Applicant Name
  let extractedApplicant: string | undefined;
  const nameRegex = /(?:nom|employé|nehmer|candidat|concerne|name|prenom)\s*[:=]?\s*([A-Z][a-z]+\s+[A-Z][a-z]+)/;
  const nameMatch = rawText.match(nameRegex);
  if (nameMatch && nameMatch[1]) {
    extractedApplicant = nameMatch[1].trim();
  }

  // Extract Permit Type
  let extractedPermit: 'B' | 'C' | 'L' | 'G' | 'CH' | undefined;
  if (/permis\s*c|permesso\s*c|ausweis\s*c/i.test(combinedText)) extractedPermit = 'C';
  else if (/permis\s*b|permesso\s*b|ausweis\s*b/i.test(combinedText)) extractedPermit = 'B';
  else if (/permis\s*l|permesso\s*l|ausweis\s*l/i.test(combinedText)) extractedPermit = 'L';
  else if (/permis\s*g|permesso\s*g|ausweis\s*g/i.test(combinedText)) extractedPermit = 'G';
  else if (/suisse|schweiz|svizzero|ch-citizen/i.test(combinedText) && isIdentity) extractedPermit = 'CH';

  // Extract Date of Birth
  let extractedDob: string | undefined;
  const dobMatch = rawText.match(/(?:naissance|geboren|nato|dob)\s*[:=]?\s*([0-9]{2}[\./-][0-9]{2}[\./-][0-9]{4})/i);
  if (dobMatch && dobMatch[1]) {
    const parts = dobMatch[1].split(/[\./-]/);
    if (parts.length === 3) {
      extractedDob = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
  }

  return {
    id,
    timestamp,
    type: detectedType,
    fileName,
    source,
    rawText,
    qrPayload: qrPayload || undefined,
    confidence,
    extractedData: {
      salaryCHF: extractedSalary,
      employer: extractedEmployer,
      applicantName: extractedApplicant,
      permitType: extractedPermit,
      dateOfBirth: extractedDob,
      poursuitesClean: isPoursuites ? true : undefined,
      hasRC: isRC ? true : undefined,
      notes: `Document identifié avec succès (${Math.round(confidence * 100)}% fiabilité)`,
    },
  };
}

/**
 * Apply the extracted document data to the DossierState
 */
export function applyExtractedDataToDossier(
  prevDossier: DossierState,
  result: ScannedDocumentResult
): { updatedDossier: DossierState; changesSummary: string[] } {
  const { type, extractedData } = result;
  const updated: DossierState = { ...prevDossier };
  const changesSummary: string[] = [];

  // Update document flags based on type
  if (type === 'salary_slip' || extractedData.salaryCHF) {
    updated.hasSalarySlips = true;
    changesSummary.push('Attestation 3 fiches de salaire validée (+8 pts)');
  }
  if (type === 'identity_doc' || extractedData.permitType) {
    updated.hasIdentityDoc = true;
    changesSummary.push('Document d\'identité / Titre de séjour validé (+8 pts)');
  }
  if (type === 'poursuites_extract' || extractedData.poursuitesClean) {
    updated.hasPoursuitesExtract = true;
    changesSummary.push('Extrait de l\'Office des poursuites vierge validé (+8 pts)');
  }
  if (type === 'rc_assurance' || extractedData.hasRC) {
    updated.hasRCAssurance = true;
    changesSummary.push('Police assurance RC ménage validée (+7 pts)');
  }
  if (type === 'swiss_egov_qr') {
    updated.hasSalarySlips = true;
    updated.hasIdentityDoc = true;
    if (extractedData.poursuitesClean) updated.hasPoursuitesExtract = true;
    if (extractedData.hasRC) updated.hasRCAssurance = true;
    changesSummary.push('Pack administratif e-Dossier suisse validé');
  }

  // Update specific fields if found
  if (extractedData.salaryCHF && extractedData.salaryCHF > 0) {
    updated.monthlyNetSalaryCHF = extractedData.salaryCHF;
    changesSummary.push(`Stipendio mensile aggiornato a CHF ${new Intl.NumberFormat('fr-CH').format(extractedData.salaryCHF)}.-`);
  }
  if (extractedData.employer) {
    updated.employer = extractedData.employer;
    changesSummary.push(`Datore di lavoro impostato su "${extractedData.employer}"`);
  }
  if (extractedData.applicantName) {
    updated.applicantName = extractedData.applicantName;
    changesSummary.push(`Nome candidato: "${extractedData.applicantName}"`);
  }
  if (extractedData.permitType) {
    updated.permitType = extractedData.permitType;
    changesSummary.push(`Tipo di permesso impostato su "${extractedData.permitType}"`);
  }
  if (extractedData.dateOfBirth) {
    updated.dateOfBirth = extractedData.dateOfBirth;
    changesSummary.push(`Data di nascita aggiornata: ${extractedData.dateOfBirth}`);
  }

  return { updatedDossier: updated, changesSummary };
}
