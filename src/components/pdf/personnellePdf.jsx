import jsPDF from "jspdf";
import 'jspdf-autotable';

const PersonnellePDF = (data) => {
    if (!data.length) return; // Ensure data is ready before generating PDF
    const doc = new jsPDF();
    const columns = [
      { header: 'ID', dataKey: 'id_P' },
      { header: 'Nom', dataKey: 'nom' },
      { header: 'Prenom', dataKey: 'prenom' },
      { header: 'N° téléphone', dataKey: 'tel' },
      { header: 'Fonction', dataKey: 'fonction' },
      { header: 'Service', dataKey: 'service' },
      { header: 'Direction', dataKey: 'direction' },
    ];

    const tableData = data.map(row => ({
        id_P: row.id_P,
        nom: row.nom,
        prenom: row.prenom,
        tel: row.tel,
        fonction: row.email,
        service: row.adresse,
        direction: row.ville,
    }));

    doc.autoTable({
      columns: columns,
      body: tableData,
      startY: 20,
      margin: { horizontal: 10 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }, // Entête en noir avec texte en blanc
      alternateRowStyles: { fillColor: [239, 239, 239] },
      showHead: 'firstPage',
    });

    doc.setFontSize(18);
    doc.text("Liste des Personnelles ", 14, 15);

    doc.save("Liste_des_personnelles.pdf");
};

export default PersonnellePDF;
