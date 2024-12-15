import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import 'datatables.net';
import Lien from "../../../../../config";
import axios from "axios";
import Nom_Conge from "../../Nom_Conge";
import Modif_conge from "../../../modification/modif_cv/Modif_conge";

export default function Info_conge({ info }) {
 

  // Convert the info object into an array for DataTable
  const data = info.map((user)=>{
  console.log('conge1',info)
 return   user})
  const columns = [
    { name: "ID", selector: (row) => row.id_ac, sortable: true },
    { name: "Type de conge", selector: (row) =><Nom_Conge id={row.id_Cong}/> , sortable: true },
    { name: "Nb total", selector: (row) => row.nb_total_conge, sortable: true },
    { name: "Nb éxpiré", selector: (row) => row.nb_conge_fait, sortable: true },
    { name: "Nb restant", selector: (row) => row.nb_conge_restant, sortable: true },
    { name: "Action", selector: (row) =><Modif_conge pers={row} /> , sortable: true },
  ];
 
  return (
    <div>
      <DataTable
        columns={columns}
        data={data}
        noDataComponent={<div className="prev">Aucune donnée disponible</div>}
        pagination
      />
    </div>
  );
}
