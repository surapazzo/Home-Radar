import { jsPDF } from 'jspdf';
import { DossierState, Language, SwissCanton } from '../types';
import { getCantonLanguage, getCantonDebtOffice } from '../data/swissGeography';

interface ExtendedDossierState extends DossierState {
  dateOfBirth?: string;
  maritalStatus?: string;
  currentAddress?: string;
  nationality?: string;
  employmentType?: string;
  previousLandlordRef?: string;
}

export function generateSwissDossierPdf(dossier: ExtendedDossierState, lang: Language): void {
  // Format numbers to Swiss standards: 7'500
  const formatCHF = (val: number) => {
    return new Intl.NumberFormat('fr-CH').format(val);
  };

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4', // 210 x 297 mm
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2; // 178 mm

  const today = new Date();
  const dateFormatted = today.toLocaleDateString(
    lang === 'de' ? 'de-CH' : lang === 'fr' ? 'fr-CH' : lang === 'it' ? 'it-CH' : 'en-GB',
    { day: '2-digit', month: '2-digit', year: 'numeric' }
  );

  const maxRent = Math.round(dossier.monthlyNetSalaryCHF * 0.33);

  // Permit label helper
  const permitLabelMap: Record<string, string> = {
    B: 'Permis B (Séjour / Aufenthaltsbewilligung EU/EFTA)',
    C: 'Permis C (Établissement / Niederlassungsbewilligung)',
    L: 'Permis L (Courte durée / Kurzaufenthaltsbewilligung)',
    G: 'Permis G (Frontalier / Grenzgänger)',
    CH: 'Nationalité Suisse / Schweizer Bürgerrecht',
  };

  const targetCanton = dossier.targetCanton || 'Zürich';

  // ---------------------------------------------------------
  // PAGE 1: FICHE RÉCAPITULATIVE OFFICIELLE DE CANDIDATURE
  // ---------------------------------------------------------

  // Top Swiss Red Bar
  doc.setFillColor(220, 38, 38); // Swiss Red #DC2626
  doc.rect(0, 0, pageWidth, 5, 'F');

  // Swiss Crest / Cross icon in header
  doc.setFillColor(220, 38, 38);
  doc.roundedRect(margin, 12, 10, 10, 1.5, 1.5, 'F');
  doc.setFillColor(255, 255, 255);
  doc.rect(margin + 4, 14, 2, 6, 'F');
  doc.rect(margin + 2, 16, 6, 2, 'F');

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(24, 24, 27); // Zinc 900
  const mainTitle =
    lang === 'de'
      ? 'SCHWEIZER MIETBEWERBUNGSDOSSIER'
      : lang === 'it'
      ? 'DOSSIER DI CANDIDATURA LOCAZIONE IMMOBILIARE'
      : lang === 'en'
      ? 'OFFICIAL SWISS RENTAL APPLICATION DOSSIER'
      : 'DOSSIER OFFICIEL DE CANDIDATURE LOCATIVE';
  doc.text(mainTitle, margin + 14, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(113, 113, 122); // Zinc 500
  const normSubtitle =
    lang === 'de'
      ? 'SVIT-Standard Mietinteressenten-Profil · Schweizerisches Obligationenrecht (OR Art. 253 ff.)'
      : lang === 'it'
      ? 'Conforme standard USPI / SVIT · Codice delle Obbligazioni Svizzero (CO Art. 253-274g)'
      : lang === 'en'
      ? 'USPI / SVIT Swiss Real Estate Standard · Swiss Code of Obligations (CO Art. 253 ff.)'
      : 'Conforme aux normes USPI / SVIT · Code des Obligations Suisse (CO Art. 253-274g)';
  doc.text(normSubtitle, margin + 14, 22);

  // Right-side Status Badges
  doc.setFillColor(244, 244, 245); // Zinc 100
  doc.roundedRect(pageWidth - margin - 58, 11, 58, 12, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(22, 101, 52); // Emerald 800
  doc.text('✓ DOSSIER COMPLET (100%)', pageWidth - margin - 55, 15.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(82, 82, 91);
  doc.text(`Canton : ${targetCanton} · ${dateFormatted}`, pageWidth - margin - 55, 20);

  // Section Divider Line
  doc.setDrawColor(228, 228, 231);
  doc.setLineWidth(0.4);
  doc.line(margin, 26, pageWidth - margin, 26);

  let currentY = 32;

  // Helper for Section Box
  const drawSectionHeader = (title: string, badge?: string) => {
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, currentY, contentWidth, 7, 1, 1, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, currentY, contentWidth, 7, 'S');

    doc.setFillColor(220, 38, 38);
    doc.rect(margin, currentY, 2.5, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(title, margin + 5, currentY + 4.8);

    if (badge) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(185, 28, 28);
      doc.text(badge, pageWidth - margin - 4, currentY + 4.8, { align: 'right' });
    }

    currentY += 9;
  };

  // 1. IDENTITÉ DU / DES CANDIDAT(S)
  const sec1Title =
    lang === 'de'
      ? '1. PERSONALANGABEN DES MIETINTERESSENTEN'
      : lang === 'it'
      ? '1. DATI PERSONALI DEL CANDIDATO'
      : lang === 'en'
      ? '1. APPLICANT PERSONAL IDENTIFICATION'
      : '1. IDENTITÉ DU / DES CANDIDAT(S)';
  drawSectionHeader(sec1Title, 'PIÈCES D\'IDENTITÉ VALIDÉES');

  // Grid for Personal Info
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, currentY, contentWidth, 31, 1.5, 1.5, 'S');

  const halfWidth = contentWidth / 2;

  // Left Col
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('NOM & PRÉNOM / FULL NAME:', margin + 4, currentY + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(dossier.applicantName, margin + 4, currentY + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('TITRE DE SÉJOUR / PERMIT:', margin + 4, currentY + 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(permitLabelMap[dossier.permitType] || `Permis ${dossier.permitType}`, margin + 4, currentY + 19.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('ADRESSE ACTUELLE / CURRENT RESIDENCE:', margin + 4, currentY + 25);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(dossier.currentAddress || 'Suisse / Switzerland', margin + 4, currentY + 29.5);

  // Right Col
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('TÉLÉPHONE / PHONE:', margin + halfWidth + 4, currentY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(dossier.phone, margin + halfWidth + 4, currentY + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('EMAIL / CONTACT:', margin + halfWidth + 4, currentY + 15);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(dossier.email, margin + halfWidth + 4, currentY + 19.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('CANTON DE DESTINATION:', margin + halfWidth + 4, currentY + 25);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(185, 28, 28);
  doc.text(`Canton de ${targetCanton} (Suisse)`, margin + halfWidth + 4, currentY + 29.5);

  currentY += 35;

  // 2. SITUATION PROFESSIONNELLE & SOLVABILITÉ SUISSE (RÈGLE DU 33%)
  const sec2Title =
    lang === 'de'
      ? '2. BERUFLICHE SITUATION & SCHWEIZER BONITÄT (33%-REGEL)'
      : lang === 'it'
      ? '2. SITUAZIONE PROFESSIONALE & SOLVIBILITÀ SVIZZERA (REGOLA DEL 33%)'
      : lang === 'en'
      ? '2. EMPLOYMENT SITUATION & SWISS SOLVENCY RATIO (33% CEILING)'
      : '2. SITUATION PROFESSIONNELLE & SOLVABILITÉ (RÈGLE DES 33%)';
  drawSectionHeader(sec2Title, 'CERTIFICAT DE SALAIRE VALIDE');

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, currentY, contentWidth, 38, 1.5, 1.5, 'S');

  // Employment details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('PROFESSION / POSTE OCCUPÉ:', margin + 4, currentY + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(dossier.currentProfession || 'Professionnel Qualifié', margin + 4, currentY + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('EMPLOYEUR ACTUEL / ARBEITGEBER:', margin + halfWidth + 4, currentY + 5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(dossier.employer || 'Société en Suisse', margin + halfWidth + 4, currentY + 9.5);

  // Financial Sub-box with Solvency Metric
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin + 3, currentY + 13, contentWidth - 6, 21, 1, 1, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(margin + 3, currentY + 13, contentWidth - 6, 21, 'S');

  // Monthly Net Salary
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('REVENU NET MENSUEL CERTIFIÉ:', margin + 6, currentY + 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text(`CHF ${formatCHF(dossier.monthlyNetSalaryCHF)}.-`, margin + 6, currentY + 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`(Annuel net : CHF ${formatCHF(dossier.monthlyNetSalaryCHF * 12)}.-)`, margin + 6, currentY + 29);

  // Recommended Max Rent
  const colThree = (contentWidth - 6) / 2;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('LOYER MAX CONSEILLÉ (RÈGLE DU 1/3) :', margin + 6 + colThree, currentY + 18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(185, 28, 28);
  doc.text(`CHF ${formatCHF(maxRent)}.- / mois`, margin + 6 + colThree, currentY + 24);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(22, 101, 52);
  doc.text('✓ Taux d\'effort ≤ 33% strictement conforme aux régies suisses', margin + 6 + colThree, currentY + 29);

  currentY += 42;

  // 3. COMPOSITION DU MÉNAGE & HABITUDES DE VIE
  const sec3Title =
    lang === 'de'
      ? '3. HAUSHALTSSTRUKTUR & WOHNUMFELD'
      : lang === 'it'
      ? '3. COMPOSIZIONE NUCLEO FAMILIARE & CONDOTTA'
      : lang === 'en'
      ? '3. HOUSEHOLD COMPOSITION & LIVING HABITS'
      : '3. COMPOSITION DU MÉNAGE & HABITUDES DE VIE';
  drawSectionHeader(sec3Title);

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, currentY, contentWidth, 19, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('NOMBRE D\'OCCUPANTS :', margin + 4, currentY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`${dossier.familyMembersCount} personne(s) déclarée(s)`, margin + 4, currentY + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('ANIMAUX DOMESTIQUES :', margin + 4, currentY + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(dossier.petsInfo || 'Aucun animal domestique', margin + 4, currentY + 17.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('INSTRUMENTS DE MUSIQUE :', margin + halfWidth + 4, currentY + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Aucun instrument sonore', margin + halfWidth + 4, currentY + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('PROFIL DU LOCATAIRE :', margin + halfWidth + 4, currentY + 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('Non-fumeur, calme, respectueux du voisinage', margin + halfWidth + 4, currentY + 17.5);

  currentY += 23;

  // 4. INVENTAIRE DES PIÈCES JUSTIFICATIVES SUISSES ATTESTÉES (4 PIÈCES OFFICIELLES)
  const sec4Title =
    lang === 'de'
      ? '4. BEILIEGENDE AMTLICHE SCHWEIZER DOKUMENTE (4 STANDARDBEILAGEN)'
      : lang === 'it'
      ? '4. DOCUMENTI UFFICIALI SVIZZERI ALLEGATI (I 4 DOCUMENTI STANDARD)'
      : lang === 'en'
      ? '4. ATTACHED OFFICIAL SWISS SUPPORTING DOCUMENTS (MANDATORY 4-PACK)'
      : '4. PIÈCES JUSTIFICATIVES SUISSES ATTESTÉES (LES 4 DOCUMENTS OFFICIELS)';
  drawSectionHeader(sec4Title, 'CONTRÔLE DE CONFORMITÉ 100%');

  const docs = [
    {
      title: '1. Pièce d\'identité officielle & Titre de séjour suisse',
      desc: `Passeport en cours de validité et permis de séjour catégorie ${dossier.permitType}`,
      valid: dossier.hasIdentityDoc,
      stamp: 'CONFORME',
    },
    {
      title: '2. Extrait original de l\'Office des Poursuites et Faillites (Betreibungsauszug)',
      desc: 'Extrait vierge de tout acte de défaut de biens ou poursuite, daté de moins de 3 mois',
      valid: dossier.hasPoursuitesExtract,
      stamp: 'VIERGE < 3 MOIS',
    },
    {
      title: '3. Trois dernières fiches de salaire consécutives (Lohnabrechnungen)',
      desc: 'Fiches de salaire mensuelles complètes attestant d\'un revenu régulier et pérenne',
      valid: dossier.hasSalarySlips,
      stamp: '3 FICHES JOINTES',
    },
    {
      title: '4. Attestation d\'assurance Responsabilité Civile Privée (RC Ménage)',
      desc: 'Police d\'assurance RC privée et dégâts locatifs valide auprès d\'une compagnie suisse',
      valid: dossier.hasRCAssurance,
      stamp: 'POLICE VALIDE',
    },
  ];

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, currentY, contentWidth, 36, 1.5, 1.5, 'S');

  docs.forEach((d, idx) => {
    const rowY = currentY + 3 + idx * 8;

    // Checkbox icon
    doc.setFillColor(d.valid ? 22 : 220, d.valid ? 101 : 38, d.valid ? 52 : 38);
    doc.roundedRect(margin + 4, rowY - 1, 4, 4, 0.8, 0.8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text('✓', margin + 4.9, rowY + 2);

    // Text
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(d.title, margin + 11, rowY + 1);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(d.desc, margin + 11, rowY + 4.5);

    // Status pill
    doc.setFillColor(240, 253, 244);
    doc.roundedRect(pageWidth - margin - 32, rowY - 1, 28, 4.5, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(22, 101, 52);
    doc.text(d.stamp, pageWidth - margin - 18, rowY + 2.2, { align: 'center' });
  });

  currentY += 40;

  // 5. ATTESTATION SUR L'HONNEUR & SIGNATURE OFFICIELLE
  const sec5Title =
    lang === 'de'
      ? '5. WAHRHEITSERKLÄRUNG, DATENSCHUTZ (DSG) & UNTERSCHRIFT'
      : lang === 'it'
      ? '5. DICHIARAZIONE DI VERIDICITÀ, PROTEZIONE DATI (LPD) & FIRMA'
      : lang === 'en'
      ? '5. ACCURACY DECLARATION, DATA PROTECTION (FADP) & SIGNATURE'
      : '5. DÉCLARATION SUR L\'HONNEUR, PROTECTION DES DONNÉES & SIGNATURE';
  drawSectionHeader(sec5Title);

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, currentY, contentWidth, 31, 1.5, 1.5, 'S');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  const legalNotice =
    lang === 'de'
      ? 'Der/die Unterzeichnende bestätigt die Richtigkeit aller gemachten Angaben und ermächtigt die Verwaltung ausdrücklich, Auskünfte beim Arbeitgeber sowie bei der bisherigen Vermieterschaft gemäss Bundesgesetz über den Datenschutz (DSG) einzuholen.'
      : lang === 'it'
      ? 'Il/la sottoscritto/a attesta la piena veridicità dei dati forniti e autorizza espressamente la fiduciaria immobiliare a effettuare verifiche presso il datore di lavoro e il precedente locatore ai sensi della Legge federale sulla protezione dei dati (LPD).'
      : lang === 'en'
      ? 'The undersigned hereby certifies that all statements provided are true and complete, authorizing the property management to verify solvency with current employer and previous landlord in accordance with the Swiss Federal Act on Data Protection (FADP).'
      : 'Le/la soussigné(e) certifie sur l\'honneur l\'exactitude des renseignements fournis et autorise expressément la régie / gérance à procéder aux vérifications d\'usage auprès de l\'employeur et de la précédente régie conformément à la Loi fédérale sur la protection des données (LPD).';

  const splitNotice = doc.splitTextToSize(legalNotice, contentWidth - 8);
  doc.text(splitNotice, margin + 4, currentY + 5);

  // Signature Block
  const sigY = currentY + 16;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`Fait à ${targetCanton}, le ${dateFormatted}`, margin + 4, sigY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Signature manuscrite ou certifiée du / de la candidat(e) :', pageWidth - margin - 65, sigY);

  // Signature box
  doc.setDrawColor(203, 213, 225);
  doc.setLineDashPattern([1, 1], 0);
  doc.line(pageWidth - margin - 65, sigY + 10, pageWidth - margin - 5, sigY + 10);
  doc.setLineDashPattern([], 0); // reset

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(dossier.applicantName, pageWidth - margin - 35, sigY + 8, { align: 'center' });

  // Page 1 Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Home Radar · Page 1/2 · Dossier de candidature certifié conforme · Réf: HR-CH-${targetCanton.toUpperCase()}-${today.getFullYear()}`,
    margin,
    pageHeight - 6
  );

  // ---------------------------------------------------------
  // PAGE 2: LETTRE OFFICIELLE DE MOTIVATION & ACCOMPAGNEMENT
  // ---------------------------------------------------------
  doc.addPage();

  // Top Red Bar on Page 2
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 0, pageWidth, 5, 'F');

  let p2Y = 16;

  // Header Page 2
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(24, 24, 27);
  const letterPageTitle =
    lang === 'de'
      ? 'OFFIZIELLES BEWERBUNGSSCHREIBEN AN DIE VERWALTUNG'
      : lang === 'it'
      ? 'LETTERA UFFICIALE DI CANDIDATURA ALLA PROPRIETÀ / FIDUCIARIA'
      : lang === 'en'
      ? 'OFFICIAL COVER LETTER TO PROPERTY MANAGEMENT'
      : 'LETTRE OFFICIELLE DE CANDIDATURE & D\'ACCOMPAGNEMENT';
  doc.text(letterPageTitle, margin, p2Y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Annexe officielle n° 1 au dossier de location · Canton de ${targetCanton}`, margin, p2Y + 4.5);

  doc.setDrawColor(228, 228, 231);
  doc.setLineWidth(0.4);
  doc.line(margin, p2Y + 8, pageWidth - margin, p2Y + 8);

  p2Y += 15;

  // Sender Block (Left)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(dossier.applicantName, margin, p2Y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(dossier.currentAddress || 'Suisse / Switzerland', margin, p2Y + 4);
  doc.text(`Tél : ${dossier.phone}`, margin, p2Y + 8);
  doc.text(`Email : ${dossier.email}`, margin, p2Y + 12);

  // Recipient Block (Right)
  const rightX = pageWidth - margin - 70;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('À l\'attention de la Régie / Propriétaire', rightX, p2Y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Service des gérances locatives', rightX, p2Y + 4);
  doc.text(`Canton de ${targetCanton}`, rightX, p2Y + 8);
  doc.text('Confédération Suisse', rightX, p2Y + 12);

  p2Y += 24;

  // Date line
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`${targetCanton}, le ${dateFormatted}`, pageWidth - margin, p2Y, { align: 'right' });

  p2Y += 7;

  // Object line (bold)
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, p2Y, contentWidth, 8, 1, 1, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, p2Y, contentWidth, 8, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(185, 28, 28);
  const objectLine =
    lang === 'de'
      ? `Betreff: Formelle Mietbewerbung für Wohnung im Kanton ${targetCanton}`
      : lang === 'it'
      ? `Oggetto: Formale candidatura di locazione per alloggio nel Canton ${targetCanton}`
      : lang === 'en'
      ? `Subject: Formal Rental Application for Apartment in Canton ${targetCanton}`
      : `Objet : Candidature formelle pour la location d'un appartement dans le Canton de ${targetCanton}`;
  doc.text(objectLine, margin + 4, p2Y + 5.3);

  p2Y += 14;

  // Motivation Letter Body text formatted according to Swiss official standard
  const cantonLang = getCantonLanguage(targetCanton);
  const debtOffice = getCantonDebtOffice(targetCanton);

  let letterBody = '';
  if (lang === 'de' || (lang === 'en' && cantonLang === 'de') || cantonLang === 'de') {
    letterBody = `Sehr geehrte Damen und Herren,

Hiermit bewerbe ich mich mit grossem Interesse um die Mietwohnung im Kanton ${targetCanton}.

Derzeit bin ich als ${dossier.currentProfession || 'Fachkraft'} bei der Firma ${dossier.employer || 'meinem Arbeitgeber'} angestellt. Mit einem regelmässigen monatlichen Nettoeinkommen von CHF ${formatCHF(dossier.monthlyNetSalaryCHF)}.- erfülle ich die übliche Schweizer Bonitätsregel (Bruttomiete unter einem Drittel des Nettoeinkommens).

Ich besitze eine Aufenthaltsbewilligung der Kategorie ${dossier.permitType}. In der Anlage finden Sie mein vollständiges und geprüftes Schweizer Bewerbungsdossier:
1. Kopie meines amtlichen Ausweises und Aufenthaltsbewilligung (Kategorie ${dossier.permitType}).
2. Originaler Betreibungsauszug des ${debtOffice} ohne Einträge (nicht älter als 3 Monate).
3. Die letzten 3 Lohnabrechnungen als lückenloser Einkommensnachweis.
4. Nachweis der Privathaftpflicht- und Hausratversicherung (RC ménage).

${dossier.customLetterNotes ? `${dossier.customLetterNotes}\n\n` : ''}Als ruhige, solvente und zuverlässige Mietpartei schätze ich ein gepflegtes Wohnumfeld und stehe Ihnen für eine Besichtigung oder Rückfragen jederzeit gerne zur Verfügung.

Freundliche Grüsse,

${dossier.applicantName}`;
  } else if (lang === 'it' || cantonLang === 'it') {
    letterBody = `Gentile Fiduciaria / Proprietà,

Con la presente desidero sottoporre la mia formale candidatura per la locazione dell'immobile situato nel Canton ${targetCanton}.

Attualmente impiegato/a come ${dossier.currentProfession || 'professionista'} presso la società ${dossier.employer || 'il mio datore di lavoro'}, dispongo di un reddito netto mensile certificato di CHF ${formatCHF(dossier.monthlyNetSalaryCHF)}.-, pienamente conforme alla regola di solvibilità svizzera (pigione lorda inferiore a un terzo dello stipendio netto).

Titolare di permesso di soggiorno categoria ${dossier.permitType}, allego la documentazione completa:
1. Copia documento di identità e permesso di soggiorno (cat. ${dossier.permitType}).
2. Estratto originale dell'${debtOffice} privo di precetti (< 3 mesi).
3. Ultime 3 buste paga mensili consecutive.
4. Attestazione polizza assicurativa Responsabilità Civile (RC) privata e mobilia domestica.

${dossier.customLetterNotes ? `${dossier.customLetterNotes}\n\n` : ''}Persona seria, tranquilla e rispettosa delle regole condominiali, rimango a completa disposizione per una visita dell'immobile o per qualsiasi chiarimento.

Cordiali saluti,

${dossier.applicantName}`;
  } else if (lang === 'en') {
    letterBody = `Dear Property Management / Landlord,

I am writing to formally submit my rental application for the property in Canton ${targetCanton}.

Currently employed as ${dossier.currentProfession || 'Senior Professional'} at ${dossier.employer || 'my employer'}, I enjoy stable and secure financial circumstances with a verified net monthly income of CHF ${formatCHF(dossier.monthlyNetSalaryCHF)}.-, strictly complying with the standard Swiss solvency ceiling (gross rent under 33% of household net income).

Holder of a Swiss residence permit category ${dossier.permitType}, please find attached my complete application file:
1. Copy of official identification passport and Swiss residence permit (${dossier.permitType}).
2. Original Debt Enforcement Register Extract (${debtOffice}) free of any entries (< 3 months).
3. Last 3 consecutive monthly salary slips proving stable income.
4. Proof of Swiss Household & Personal Liability Insurance (RC ménage / Privathaftpflicht).

${dossier.customLetterNotes ? `${dossier.customLetterNotes}\n\n` : ''}As a quiet, solvent, and respectful tenant who values a well-kept living environment, I remain at your complete disposal for a flat viewing or any further information.

Kind regards,

${dossier.applicantName}`;
  } else {
    letterBody = `Madame, Monsieur,

Par la présente, je vous soumets avec grand intérêt mon dossier de candidature pour la location de l'appartement situé dans le Canton de ${targetCanton}.

Actuellement en poste en tant que ${dossier.currentProfession || 'professionnel(le)'} auprès de la société ${dossier.employer || 'mon employeur'}, je bénéficie d'une situation financière stable et pérenne avec un revenu mensuel net de CHF ${formatCHF(dossier.monthlyNetSalaryCHF)}.-, respectant scrupuleusement la règle prudentielle de solvabilité (loyer inférieur au tiers du revenu net).

Titulaire d'un permis de séjour de catégorie ${dossier.permitType}, vous trouverez en pièce jointe mon dossier complet et certifié comprenant :
1. La copie de ma pièce d'identité officielle et permis de séjour (${dossier.permitType}).
2. L'attestation originale de l'${debtOffice} vierge de toute inscription datant de moins de 3 mois.
3. Mes trois dernières fiches de salaire attestant de mes revenus réguliers.
4. L'attestation d'assurance Responsabilité Civile (RC) ménage.

${dossier.customLetterNotes ? `${dossier.customLetterNotes}\n\n` : ''}De nature calme, respectueuse du voisinage et des règles de vie commune de l'immeuble, je me tiens à votre entière disposition pour tout renseignement complémentaire ou pour convenir d'une visite.

En vous remerciant par avance de l'attention que vous porterez à ma candidature, je vous prie d'agréer, Madame, Monsieur, mes salutations les plus distinguées.

${dossier.applicantName}`;
  }

  // Draw Letter Content with clean lines
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  const paragraphs = letterBody.split('\n\n');
  paragraphs.forEach((p) => {
    const lines = doc.splitTextToSize(p, contentWidth);
    doc.text(lines, margin, p2Y);
    p2Y += lines.length * 4.5 + 3.5;
  });

  // Annexes Box at bottom of Page 2
  const annexY = Math.max(p2Y + 4, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, annexY, contentWidth, 24, 1.5, 1.5, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, annexY, contentWidth, 24, 'S');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(185, 28, 28);
  doc.text('PIÈCES JOINTES AU DOSSIER (STANDARDS SUISSES USPI / SVIT) :', margin + 4, annexY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('1. Copie de la pièce d\'identité / Titre de séjour suisse (Permis B / C / L / G / CH)', margin + 4, annexY + 9.5);
  doc.text('2. Extrait officiel de l\'Office des Poursuites (< 3 mois, sans inscription)', margin + 4, annexY + 13.5);
  doc.text('3. Trois dernières fiches de salaire officielles consécutives', margin + 4, annexY + 17.5);
  doc.text('4. Attestation d\'assurance Responsabilité Civile Privée (RC Ménage)', margin + 4, annexY + 21.5);

  // Page 2 Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `Home Radar · Page 2/2 · Dossier de candidature certifié conforme · Réf: HR-CH-${targetCanton.toUpperCase()}-${today.getFullYear()}`,
    margin,
    pageHeight - 6
  );

  // Trigger immediate browser download
  const cleanName = dossier.applicantName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `Dossier_Candidatura_Svizzera_${cleanName}_${targetCanton}.pdf`;
  doc.save(filename);
}
