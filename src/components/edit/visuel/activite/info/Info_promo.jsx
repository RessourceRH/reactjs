import React, { useState, useEffect } from "react";
import DataTable from 'react-data-table-component';
import axios from "axios";

import Nom_Promo from "../../Nom_Promo";
import Modif_Promo from "../../../modification/modif_cv/Modif_Promo";
import Lien from "../../../../../config";

export default function Info_promo({ info }) {
  

   // Add 'id' to dependency array to run when 'id' changes

  // Log formatted data for debugging
 // console.log('view', Promo);

  // Define the columns for the DataTable
  const columns = [
    { name: "ID", selector: (row) => row.id_A, sortable: true },
    { name: "Nom de l'emploi", selector: (row) =><Nom_Promo id={row.id_Pro}/> , sortable: true },
    { name: "Type", selector: (row) => row.date_pro, sortable: true },
    { name: "Date de création", selector: (row) => row.createdAt, sortable: true },
    { name: "Date de mise à jour", selector: (row) => row.updatedAt, sortable: true },
  
  ];

  return (
    <div>
      <DataTable
        columns={columns}
        data={info}
        noDataComponent={<div className="prev">Aucune donnée disponible</div>}
        pagination
      />
    </div>
  );
}
