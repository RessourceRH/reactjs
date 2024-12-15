import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import RecuperationCookie from '../../../cryptages/RécupérationCookie';
import Lien from '../../../../config';
const generatePDF = async (row) => {
  const doc = new jsPDF();
  const secretKey = 'your-secret-key';

  // Fetch manager's and company information
  const id = parseInt(RecuperationCookie(secretKey, 'ID'));
  let managerName = '';
  let companyData = {
    name: '',
    address: '',
    postalCode: '',
    city: '',
    creationDate: ''
  };
  let companyLogo = ''; // Placeholder for image data
  let promotion=[];
  let indemnite=[];
  if (id) {
    try {
      const managerResponse = await axios.get(`${Lien}/gerant/${id}`);
      const companyResponse = await axios.get(`${Lien}/entreprise/${1}`);
      const promotionResponse= await axios.get(`${Lien}/avoir_promo/year/${row.personnel.id_P}`);
      const indemniteResponse = await axios.get(`${Lien}/indemnite/year/${row.personnel.id_P}`);
      // Set company data
      managerName = managerResponse.data.nom_complet;
      companyData.name = companyResponse.data.nom;
      companyData.address = companyResponse.data.addresse || '';
      companyData.postalCode = companyResponse.data.cp || '';
      companyData.city = companyResponse.data.ville || '';
      companyData.creationDate = companyResponse.data.date_creation ? new Date(companyResponse.data.date_creation).toLocaleDateString() : '';
      promotion=promotionResponse.data
      indemnite=indemniteResponse.data
      // Set company logo (if available)
      companyLogo = `${Lien}/${companyResponse.data.image}` || ''; // Assuming logo is a URL or base64 image
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  console.log(row.personnel)

  // Define header styles
  const headStyles = { fillColor: [0, 0, 0], textColor: [255, 255, 255] };

  // Header
  const header = async () => {
    doc.setFontSize(16);
  
    // Add company logo
    if (companyLogo) {
      try {
        const response = await fetch(companyLogo);
        if (!response.ok) throw new Error('Failed to fetch image');
  
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          doc.addImage(reader.result, 'PNG', 20, 10, 50, 20); // Adjust the coordinates and size as needed
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error loading image:', error);
      }
    }
  
    // Add company details
    doc.setFontSize(14);
    doc.text(`Entreprise: ${companyData.name}`, 20, 40);
    doc.setFontSize(12);
    doc.text(`Adresse: ${companyData.address}`, 20, 50);
    doc.text(`Code Postal: ${companyData.postalCode}`, 20, 60);
    doc.text(`Ville: ${companyData.city}`, 20, 70);
    doc.text(`Date de Création: ${companyData.creationDate}`, 20, 80);
    // Removed manager name from the footer
  };
  
  console.log(row.direction)

  // Footer
  const footer = (pageNumber) => {
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    doc.text(`Page ${pageNumber} de ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, {
      align: 'center'
    });
  };

  const addPageContent = (pageNumber) => {
    header();
    footer(pageNumber);
  };

  // Calculate CNaPS rate
  const cnapsRate = ((row.salaire.cnaps / row.salaire.salaire_b) * 100).toFixed(2) + '%';

  await header();

  const dateVer = new Date(row.date_Ver);
const mois = dateVer.toLocaleString('fr-FR', { month: 'long' }); // Extrait le mois en français

doc.setFontSize(12);
doc.text("Bulletin de Paie N°", 150, 22);
doc.text(`${row.Id_Ver}`, 190, 22); // Assuming 56 is the bulletin number
doc.text(`Mois:  ${mois}`, 150, 28); // Affiche le mois extrait
doc.text(`Paiement: ${row.date_Ver}`, 150, 34);
doc.text("en Espèces", 150, 40);

  // Personal info
  doc.text("Information sur le personnel", 20, 100);
  doc.setFontSize(10);
  doc.text("Type de contrat:", 20, 110);
  doc.text(`${row.contrat.abreviation || ''}`, 50, 110);

  doc.text("N° Matricule:", 20, 120);
  doc.text(`${row.personnel.id_P}`, 45, 120);

  doc.text("Nom:", 80, 120);
  doc.text(`${row.personnel.nom || ''}`, 95, 120);

  doc.text("Prénom:", 120, 120);
  doc.text(`${row.personnel.prenom || ''}`, 150, 120);

  doc.text("N° CIN:", 20, 130);
  doc.text(`${row.personnel.cin}`, 45, 130);

  doc.text("Date CIN:", 80, 130);
  doc.text(`${row.personnel.date_cin || ''}`, 95, 130);

  doc.text("Civilité:", 120, 130);
  doc.text(`${row.personnel.civilite || ''}`, 135, 130);

  doc.text("Fonction:", 20, 140);
  doc.text(`${row.fonction.nom_Fon}`, 45, 140);

  doc.text("Direction:", 80, 140);
  doc.text(`${row.direction.nom_Di || ''}`, 95, 140);

  doc.text("Service:", 120, 140);
  doc.text(`${row.service.nom_Ser || ''}`, 135, 140);

  doc.autoTable({
    startY: 160,
    head: [['Nombres', 'Salaire de base']],
    body: [[
      '1.0 Mensuelle',
      `${row.salaire.salaire_b} ar`
    ]],
    theme: 'grid',
    headStyles
  });

  const promotionRows = promotion.map((promo, index) => {

    return [
      `${promo.promotion.Type || ''} (promotion) `,          // Promotion label
      '1.0 Mensuelle',                   // Example value for number
      `${promo.promotion.Montant || '0'} ar`,      // Rémunération
      `${promo.promotion.Montant|| '0'} ar`,      // Montant unitaire
      `${promo.promotion.Montant || '0'} ar`       // Montant total
    ];
  });

  const indemniteRows = indemnite.map((promo, index) => {
   
      return [
        `${promo.type || ''} (indémnité)`,          // Promotion label
        '1.0 Mensuelle',                   // Example value for number
        `${promo.montant || '0'} ar`,      // Rémunération
        `${promo.montant || '0'} ar`,      // Montant unitaire
        `${promo.montant  || '0'} ar`       // Montant total
      ];
    });
  
  // If there are no promotions, add a default row
  if (promotionRows.length === 0) {
    promotionRows.push(['Aucune promotion', '', '', '', '']);
  }
  if (indemniteRows.length === 0) {
    promotionRows.push(['Aucune indémnité', '', '', '', '']);
  }
  doc.text("Avantages (Indemnité)", 20, doc.autoTable.previous.finalY + 10);
  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 15,
    head: [['Libellé', 'Nombres', 'Rémunération', 'Montant unitaire', 'Montant total']],
    body: [
     
       
        ...promotionRows,
        ...indemniteRows,
      [
        'Avance',
        `${row.nb_mois_avance || '0'} Mensuelle(s)`,
        `${row.avance || '0'} ar`,
        `${row.avance || '0'} ar`,
        `${row.avance || '0'} ar`
      ]
    ],
    theme: 'grid',
    headStyles
  });

  doc.text("Retenues", 20, doc.autoTable.previous.finalY + 10);
  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 15,
    head: [['Types', 'Taux', 'Salaire Brut', 'Montant']],
    body: [[
      'CNaPS',
      cnapsRate,
      `${row.salaire.salaire_b || '0'} ar`,
      `${row.salaire.cnaps || '0'} ar`
    ]],
    theme: 'grid',
    headStyles
  });

  doc.text("Autres retenues", 20, doc.autoTable.previous.finalY + 10);
  doc.autoTable({
    startY: doc.autoTable.previous.finalY + 15,
    head: [['Types', 'Montant']],
    body: [
      ['Assurance', `${row.salaire.assurance || '0'} ar`],
      ['Retraite', `${row.salaire.retraite || '0'} ar`],
      ['Remboursement',  `${row.remboursement || '0'} ar`]
    ],
    theme: 'grid',
    headStyles
  });

  doc.text("Salaire BRUT", 20, doc.autoTable.previous.finalY + 10);
  doc.text(`${row.salaire.salaire_b} ar`, 50, doc.autoTable.previous.finalY + 10);
  doc.text("Salaire NET", 120, doc.autoTable.previous.finalY + 10);
  doc.text(`${row.montant_Ver} ar`, 150, doc.autoTable.previous.finalY + 10);

  // Add footer without manager name
  const pageCount = doc.internal.getNumberOfPages();
  doc.internal.pages.forEach((page, index) => {
    doc.setPage(index + 1);
    footer(index + 1);
  });

  doc.save(`Paiement_${row.Id_Ver}.pdf`);
};

export default generatePDF;
