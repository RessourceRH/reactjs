import React from 'react';
import DataTable from 'react-data-table-component';

export default function A_Salaire({ data }) {
  // Define the columns for the DataTable
  const columns = [
    {
      name: 'ID Versement',
      selector: row => row.Id_Ver,
      sortable: true,
    },
    {
      name: 'Montant Versement',
      selector: row => `${row.montant_Ver} ar`,
      sortable: true,
    },
    {
      name: 'Date Versement',
      selector: row => new Date(row.date_Ver).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Avance',
      selector: row => row.avance ? `${row.avance} ar` : 'N/A',
      sortable: true,
    },
    {
      name: 'Remboursement',
      selector: row => row.remboursement ? `${row.remboursement} ar` : 'N/A',
      sortable: true,
    },
    {
      name: 'Mois Avance',
      selector: row => row.mois_avance || 'N/A',
      sortable: true,
    },
    {
      name: 'Nombre de Mois Avance',
      selector: row => row.nb_mois_avance,
      sortable: true,
    },
    {
      name: 'Date Création',
      selector: row => new Date(row.createdAt).toLocaleDateString(),
      sortable: true,
    },
    {
      name: 'Date Mise à Jour',
      selector: row => new Date(row.updatedAt).toLocaleDateString(),
      sortable: true,
    },
  ];

  return (
    <div>
      <DataTable
        title="Détails des Versements"
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
}
