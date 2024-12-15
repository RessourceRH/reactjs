import jsPDF from "jspdf";
import 'jspdf-autotable';

const CongePDF = (data) => {
    if (!data.length) return; // Ensure data is ready before generating PDF
    const doc = new jsPDF();
    const columns = [
      { header: 'ID', dataKey: 'id_C' },
      { header: 'Type de contrat', dataKey: 'Type_C' },
      { header: 'Durée du Congé', dataKey: 'duree_cong' },
    ];

    const tableData = data.map(row => ({
        id_C: row.id_C,
        Type_C: row.Type_C,
        duree_cong: row.duree_cong,
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
    doc.text("Liste des Types de Congés", 14, 15);

    doc.save("type_conge.pdf");
};

export default CongePDF;
