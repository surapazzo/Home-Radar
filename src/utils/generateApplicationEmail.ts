import { Listing, DossierState, Language } from '../types';

export type EmailTone = 'formal' | 'personal' | 'direct';

export interface ApplicationEmailDraft {
  subject: string;
  body: string;
  language: 'fr' | 'de' | 'it' | 'en';
  tone: EmailTone;
  mailtoUrl: string;
}

export function generateApplicationEmail(
  listing: Listing,
  dossier: DossierState,
  emailLang: 'fr' | 'de' | 'it' | 'en',
  tone: EmailTone = 'formal'
): ApplicationEmailDraft {
  const formatCHF = (val: number) =>
    new Intl.NumberFormat('fr-CH').format(val).replace(/[\u202F\u00A0\s]/g, "'");

  const applicant = dossier.applicantName || 'Candidat';
  const phone = dossier.phone || '+41 79 000 00 00';
  const email = dossier.email || 'candidat@email.ch';
  const profession = dossier.currentProfession || 'Professionnel';
  const employer = dossier.employer || 'Entreprise en Suisse';
  const salary = dossier.monthlyNetSalaryCHF || 7000;
  const rent = listing.rentTotalCHF;
  const ratio = Math.round((rent / salary) * 100);

  // Address and property details
  const roomsStr = `${listing.rooms} ${emailLang === 'de' ? 'Zimmer' : emailLang === 'fr' ? 'pièces' : emailLang === 'it' ? 'locali' : 'rooms'}`;
  const addressStr = `${listing.address}, ${listing.postalCode} ${listing.city}`;

  let subject = '';
  let body = '';

  if (emailLang === 'fr') {
    // FRENCH (Suisse romande - Vaud, Genève, Neuchâtel, Fribourg, Valais)
    if (listing.isRepriseDeBail || tone === 'personal') {
      subject = `Candidature reprise de bail · Appartement ${roomsStr} à ${listing.city} (${listing.address}) - ${applicant}`;
      body = `Bonjour,

Je fais suite à votre annonce concernant la reprise de bail de l'appartement de ${roomsStr} situé ${addressStr} (loyer CHF ${formatCHF(rent)}.- charges comprises).

Très intéressé(e) par ce logement, je souhaite vous présenter ma candidature immédiate. Je suis actuellement ${profession} au sein de la société ${employer}.

Mon profil financier est parfaitement solvable et stable :
• Revenu net mensuel : CHF ${formatCHF(salary)}.- (ratio loyer/revenu : ${ratio}%, conforme à la règle des 33% des régies suisses)
• Titre de séjour / Nationalité : Permis ${dossier.permitType || 'B'}
${dossier.hasGuarantor ? `• Caution / Garant solvable en Suisse : CHF ${formatCHF(dossier.guarantorMonthlySalaryCHF)}.- net/mois\n` : ''}
Mon dossier de candidature complet et à jour est d'ores et déjà prêt à être transmis :
✓ 3 dernières fiches de salaire officielles
✓ Extrait récent vierge du Registre des poursuites (< 3 mois)
✓ Attestation d'assurance RC ménage privée
✓ Copie recto-verso de la pièce d'identité / permis de séjour

Je me tiens à votre entière disposition pour convenir d'un rendez-vous de visite selon vos disponibilités.

Je vous remercie chaleureusement pour votre attention et vous adresse mes meilleures salutations.

${applicant}
📞 ${phone}
✉️ ${email}
${dossier.currentAddress ? `📍 ${dossier.currentAddress}` : ''}`;
    } else if (tone === 'direct') {
      subject = `Dossier de candidature · ${roomsStr} à ${listing.city} - CHF ${formatCHF(rent)} cc - ${applicant}`;
      body = `Madame, Monsieur,

Par la présente, je vous transmets ma candidature pour la location de l'appartement de ${roomsStr} situé à l'adresse suivante :
${addressStr} (Réf. annonce : ${listing.id} - CHF ${formatCHF(rent)}.- / mois charges comprises).

Synthèse du dossier candidat :
• Candidat : ${applicant}
• Poste : ${profession} chez ${employer} (CDI)
• Revenu net : CHF ${formatCHF(salary)}.- / mois (solvabilité : ${ratio}%)
• Permis : ${dossier.permitType || 'B'}
• Pièces justificatives complètes : Fiches de salaire, extrait de l'Office des poursuites vierge, police RC et pièce d'identité disponibles immédiatement.

Restant à votre disposition pour toute visite ou complément d'information.

Salutations distinguées,

${applicant}
${phone} · ${email}`;
    } else {
      // Formal Régie standard
      subject = `Candidature location · Appartement ${roomsStr} à ${listing.city} (${listing.address}) - ${applicant}`;
      body = `Madame, Monsieur,

Je me permets de vous contacter afin de vous soumettre ma candidature pour l'appartement de ${roomsStr} situé au ${addressStr}, proposé au loyer mensuel de CHF ${formatCHF(rent)}.- charges comprises.

Actuellement ${profession} auprès de ${employer}, je dispose d'une situation financière stable et pérenne avec un revenu mensuel net de CHF ${formatCHF(salary)}.-. Le montant du loyer représente ${ratio}% de mon salaire net, respectant ainsi scrupuleusement la règle des 33% et les exigences de solvabilité de l'USPI.

${dossier.hasGuarantor ? `De plus, je dispose d'un garant solvable domicilié en Suisse avec un revenu de CHF ${formatCHF(dossier.guarantorMonthlySalaryCHF)}.-.\n` : ''}${dossier.customLetterNotes ? `${dossier.customLetterNotes}\n\n` : ''}Mon dossier complet et conforme aux standards suisses comprend l'ensemble des pièces requises :
• Extrait officiel du Registre des poursuites vierge datant de moins de 3 mois ;
• Trois dernières fiches de salaire consécutives ;
• Attestation d'assurance responsabilité civile privée (RC ménage) avec couverture locataire ;
• Copie de ma pièce d'identité et de mon titre de séjour (Permis ${dossier.permitType || 'B'}).

Je reste à votre entière disposition pour effectuer une visite des lieux et pour vous faire parvenir tout document complémentaire.

Dans l'attente de votre réponse, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${applicant}
Téléphone : ${phone}
Courriel : ${email}
${dossier.currentAddress ? `Adresse actuelle : ${dossier.currentAddress}` : ''}`;
    }
  } else if (emailLang === 'de') {
    // GERMAN (Deutschschweiz - Zürich, Bern, Basel, Luzern, Zug, St. Gallen)
    if (listing.isRepriseDeBail || tone === 'personal') {
      subject = `Bewerbung Nachmiete · ${roomsStr}-Wohnung in ${listing.city} (${listing.address}) - ${applicant}`;
      body = `Guten Tag,

ich beziehe mich auf Ihr Inserat bezüglich der Nachmiete für die ${roomsStr}-Wohnung an der Adresse ${addressStr} (Mietzins CHF ${formatCHF(rent)}.- inkl. NK).

Die Wohnung gefällt mir ausserordentlich gut und ich möchte mich hiermit offiziell als solventer Nachmieter bewerben. Ich bin als ${profession} bei ${employer} fest angestellt.

Meine Eckdaten:
• Nettoeinkommen: CHF ${formatCHF(salary)}.- / Monat (Mietzinsanteil: ${ratio}%, entspricht den SVIT-Richtlinien < 33%)
• Aufenthaltsstatus: Bewilligung ${dossier.permitType || 'B'}
${dossier.hasGuarantor ? `• Solvente Bürgschaft in der Schweiz vorhanden (CHF ${formatCHF(dossier.guarantorMonthlySalaryCHF)}.-)\n` : ''}
Mein Bewerbungsdossier ist lückenlos vorbereitet:
✓ Aktueller Betreibungsauszug ohne Einträge (< 3 Monate)
✓ Die letzten 3 Lohnabrechnungen
✓ Privathaftpflichtversicherungsnachweis (inkl. Mieterschäden)
✓ Ausweiskopie / Bewilligung

Gerne stehe ich kurzfristig für einen Besichtigungstermin zur Verfügung.

Beste Grüsse,

${applicant}
📞 ${phone}
✉️ ${email}`;
    } else {
      subject = `Wohnungsbewerbung · ${roomsStr}-Wohnung in ${listing.city} (${listing.address}) - ${applicant}`;
      body = `Sehr geehrte Damen und Herren,

mit grossem Interesse bewerbe ich mich für die ${roomsStr}-Wohnung an der Adresse ${addressStr} zu einem monatlichen Bruttomietzins von CHF ${formatCHF(rent)}.-.

Ich bin als ${profession} bei ${employer} in ungekündigter Festanstellung tätig und verfüge über ein gesichertes monatliches Nettoeinkommen von CHF ${formatCHF(salary)}.-. Der Mietzins beläuft sich auf ${ratio}% meines Nettoeinkommens und erfüllt somit vollumfänglich die SVIT-Solvenzkriterien.

${dossier.customLetterNotes ? `${dossier.customLetterNotes}\n\n` : ''}Mein Bewerbungsdossier liegt vollständig vor und beinhaltet:
• Amtlichen Betreibungsauszug ohne Einträge (jünger als 3 Monate)
• Die letzten 3 Lohnabrechnungen
• Nachweis der Privathaftpflichtversicherung (inkl. Mieterschäden)
• Kopie des Personalausweises / der Aufenthaltsbewilligung (${dossier.permitType || 'B'})

Über die Gelegenheit zu einer persönlichen Besichtigung würde ich mich sehr freuen.

Freundliche Grüsse

${applicant}
Telefon: ${phone}
E-Mail: ${email}
${dossier.currentAddress ? `Wohnadresse: ${dossier.currentAddress}` : ''}`;
    }
  } else if (emailLang === 'it') {
    // ITALIAN (Ticino, Grigioni italiano)
    subject = `Candidatura locazione · Appartamento ${roomsStr} a ${listing.city} (${listing.address}) - ${applicant}`;
    body = `Gentile Agenzia / Proprietario,

con la presente desidero sottoporre la mia candidatura formale per l'appartamento di ${roomsStr} situato in ${addressStr}, con canone mensile lordo di CHF ${formatCHF(rent)}.- spese incluse.

Lavoro attualmente come ${profession} presso ${employer}. Dispongo di una situazione lavorativa e finanziaria stabile con un reddito netto mensile di CHF ${formatCHF(salary)}.-. Il canone di locazione rappresenta il ${ratio}% del mio stipendio netto, pienamente conforme alla regola del 33% applicata dalle fiduciarie svizzere.

${dossier.hasGuarantor ? `A maggior tutela, è disponibile un garante solvente in Svizzera con reddito di CHF ${formatCHF(dossier.guarantorMonthlySalaryCHF)}.-.\n` : ''}${dossier.customLetterNotes ? `${dossier.customLetterNotes}\n\n` : ''}Il mio dossier di candidatura completo e conforme agli standard USPI/SVIT comprende:
✓ Estratto ufficiale dell'Ufficio Esecuzioni e Fallimenti recente e vergine (< 3 mesi);
✓ Ultime 3 buste paga consecutive;
✓ Polizza assicurativa RC privata e mobilia domestica con clausola locatario;
✓ Copia documento di identità / Titolo di soggiorno (Permesso ${dossier.permitType || 'B'}).

Resto a vostra completa disposizione per un sopralluogo e per l'inoltro dei documenti in formato digitale o cartaceo.

Ringraziando per l'attenzione, porgo cordiali saluti.

${applicant}
Telefono: ${phone}
Email: ${email}
${dossier.currentAddress ? `Indirizzo: ${dossier.currentAddress}` : ''}`;
  } else {
    // ENGLISH
    subject = `Rental Application · ${roomsStr} apartment in ${listing.city} (${listing.address}) - ${applicant}`;
    body = `Dear Property Manager / Landlord,

I am writing to formally submit my rental application for the ${roomsStr} apartment located at ${addressStr}, advertised at CHF ${formatCHF(rent)}.- per month including utilities.

I am employed as ${profession} at ${employer} on a permanent contract. My monthly net income is CHF ${formatCHF(salary)}.-, which means the rent represents ${ratio}% of my income, comfortably within standard Swiss solvency guidelines (< 33%).

${dossier.hasGuarantor ? `Additionally, a solvent Swiss guarantor with CHF ${formatCHF(dossier.guarantorMonthlySalaryCHF)}.- monthly salary is available if requested.\n` : ''}${dossier.customLetterNotes ? `${dossier.customLetterNotes}\n\n` : ''}My complete Swiss application dossier is ready for immediate review:
• Official debt enforcement register extract (clean, under 3 months old)
• Last 3 consecutive monthly salary slips
• Private third-party liability insurance policy (RC ménage)
• Copy of identity document and Swiss residence permit (${dossier.permitType || 'B'})

I am available at your convenience for a viewing of the apartment.

Thank you very much for your time and consideration.

Best regards,

${applicant}
Phone: ${phone}
Email: ${email}
${dossier.currentAddress ? `Address: ${dossier.currentAddress}` : ''}`;
  }

  // Construct mailto link
  const recipient = listing.contactInfo.includes('@')
    ? listing.contactInfo.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)?.[0] || ''
    : '';
  const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return {
    subject,
    body,
    language: emailLang,
    tone,
    mailtoUrl,
  };
}
