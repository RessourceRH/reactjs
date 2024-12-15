import jsPDF from 'jspdf';

export function GeneratePDF_perso(pers, contrat, versement, promotions,fonction,service,direction) {
  const doc = new jsPDF();
 
  // Titre du document
  doc.setFontSize(18);
  doc.text(`Informations du Personnel  ${pers.nom || ''}  ${pers.prenom || ''}`, 20, 20);

  // Informations du personnel
  doc.setFontSize(14);
  doc.text(`Noms et Prenoms `, 20, 30);
  doc.setFontSize(12);
  doc.text(`Nom: ${pers.nom || ''}`, 20, 40);
  doc.text(`Prénom: ${pers.prenom || ''}`, 20, 50);
  doc.setFontSize(14);
  doc.text(`Contact `, 20, 60);
  doc.setFontSize(12);
  doc.text(`N° téléphone: ${pers.tel || ''}`, 20, 70);
  doc.text(`Email: ${pers.email || ''}`, 20, 80);
  doc.setFontSize(14);
  doc.text(`Adresse `, 20, 90);
  doc.setFontSize(12);
  doc.text(`Adresse: ${pers.adresse || ''}`, 20, 100);
  doc.text(`Ville: ${pers.ville || ''}`, 20, 110);
  doc.text(`Code postal: ${pers.cp || ''}`, 20, 120);
  doc.setFontSize(14);
  doc.text(`Naissance `, 80, 30);
  doc.setFontSize(12);
  doc.text(`Date de Naissance: ${pers.DN || ''}`, 80, 40);
  doc.text(`Lieu de Naissance: ${pers.lieu || ''}`, 80, 50);
  doc.setFontSize(14);
  doc.text(`CIN `, 80, 60);
  doc.setFontSize(12);
  doc.text(`N° CIN: ${pers.cin || ''}`, 80, 70);
  doc.text(`Date CIN: ${pers.date_Cin || ''}`, 80, 80);
  doc.setFontSize(14);
 
  doc.text(`Fonction`, 80, 90);
  doc.setFontSize(12);
  doc.text(`Date du début du fonction: ${pers.date_DF || ''}`, 80, 100);
  doc.text(`Fonction: ${fonction || ''}`, 80, 110);
  doc.text(`Service: ${service|| ''}`, 80, 120);
  doc.text(`Direction: ${direction || ''}`, 80, 130);
  // Informations du contrat

  if (contrat) {
    doc.setFontSize(14);
    doc.text(`Type de contrat:`, 20, 80);
    doc.setFontSize(12);
    doc.text(`Contrat: ${contrat.nom || ''}`, 20, 90);
    
  }

  // Informations sur les versements
  if (versement && versement.length > 0) {
    doc.text('Versements:', 20, 80);
    versement.forEach((ver, index) => {
      doc.text(`Montant: ${ver.montant_Ver} | Date: ${ver.date_Ver}`, 20, 90 + index * 10);
    });
  }

  // Informations sur les promotions
  if (promotions && promotions.length > 0) {
    doc.text('Promotions:', 20, 100 + versement.length * 10);
    promotions.forEach((pro, index) => {
      doc.text(`Promotion: ${pro.nom} | Date: ${pro.date}`, 20, 110 + versement.length * 10 + index * 10);
    });
  }

  // Sauvegarde le PDF
  doc.save(`info_perso_${pers.nom}.pdf`);
}
