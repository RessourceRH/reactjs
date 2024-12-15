import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import axios from "axios";
import {  PictureAsPdf } from '@mui/icons-material';
import DataTable from 'react-data-table-component';
import 'datatables.net';
import { InputAdornment, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import RecuperationCookie from "../cryptages/RécupérationCookie";
import Lien from '../../config';
import I_indemnite from "./insertion/I_indemnite";
import Perso from "./visuel/Perso";
import M_indemnite from "./modification/M_indemnites";

export default function D_indemnite() {
  const [contrat, setContrat] = useState([]);
  const [filterData, setFilterData] = useState([]);
 
  const [count, setcount] = useState(0);
  

  

  const fetchData = async () => {
    try {
      const counts = await axios.get(`${Lien}/script/indemnite`);
      setcount(counts.data.count);

      const response = await axios.get(`${Lien}/indemnite`);
      const personnelResponse = await axios.get(`${Lien}/personnelles`);

      const dataWithAdditionalInfo = response.data.map((item) => {
        const personnel = personnelResponse.data.find(p => p.id_P === item.Id_P);
        return {
          ...item,
          personnel,
        };
      });

      setContrat(dataWithAdditionalInfo);
      setFilterData(dataWithAdditionalInfo);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRefresh = () => {
    fetchData();
  };

const data = contrat.map((user) => user);
   const columns = [
    {
      name: 'ID',
      selector: (row) => row.Id_In,
    },
    {
      name: 'type d\'indémnité',
      selector: (row) => row.type,
      sortable: true,
    },
    {
        name: 'Montant',
        selector: (row) =>row.montant ,
        sortable: true,
      },
      {
        name: 'Année',
        selector: (row) => row.annee,
        sortable: true,
      },
      {
        name: 'Nom du Personnel',
        selector: (row) => <Perso id={row.Id_P}/>,
        sortable: true,
      },
    {
        name: "Action",
        cell: (user) => (
          <div>
           
            <M_indemnite pers={user} onrefresh={handleRefresh}/>
            
          </div>
        )
      },
       
  ];

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm) {
      const searchData = filterData.filter((item) =>
        item.type.toLowerCase().includes(searchTerm)
      );
      setContrat(searchData);
    } else {
      setContrat(filterData);
    }
  };

  const generatePDF = async() => {
    if (!contrat.length) return;
    const doc = new jsPDF();
    const secretKey = 'your-secret-key';
    
    // Fetch manager's information from the cookie
    const id = parseInt(RecuperationCookie(secretKey, 'ID'));
    let managerName = '';
    let companieName = '';
    let companyAddress = '';
    if (id) {
        try {
            const managerResponse = await axios.get(`${Lien}/gerant/${id}`);
            const companieResponse = await axios.get(`${Lien}/entreprise/${1}`);
            console.log(companieResponse.data)
            managerName = managerResponse.data.nom_complet;
            companieName = companieResponse.data.nom;
            companyAddress = companieResponse.data.addresse || '';
        } catch (error) {
            console.error('Error fetching manager data:', error);
        }
    }
  
    // Adding the company and manager info if available
    let yOffset = 15;
    doc.setFontSize(12);
    if (companieName) {
        doc.text(`Entreprise: ${companieName}`, 16, yOffset);
        yOffset += 7; // Add space after company name
    }
    if (companyAddress) {
        doc.text(`Adresse: ${companyAddress}`, 16, yOffset);
        yOffset += 7; // Add space after address
    }
    if (managerName) {
        doc.text(`Gérant: ${managerName}`, 16, yOffset);
        yOffset += 10; // Add more space before table
    }
    const columns = [
      { header: 'ID', dataKey: 'Id_In' },
      { header: 'Type d\'indemnité', dataKey: 'type' },
      { header: 'Montant', dataKey: 'montant' },
      { header: 'Année', dataKey: 'annee' },
      { header: 'Nom du Personnel', dataKey: 'perso' },
    ];

    const tableData = contrat.map(row => ({
      Id_In: row.Id_In,
      type: row.type,
      montant: row.montant,
      annee: row.annee,
      perso: `${row.personnel.nom} ${row.personnel.prenom}`,
    }));

    doc.autoTable({
      columns: columns,
      body: tableData,
      startY: yOffset+25,
      margin: { horizontal: 10 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [239, 239, 239] },
      showHead: 'firstPage',
    });

    doc.setFontSize(18);
    doc.text("Liste des Indemnités", 14, yOffset+20);
    doc.save("Liste_Indemnites.pdf");
  };
  return (
    <div>
      <div className="container-fluid page-body-wrapper m-0 p-0">
        <Nav />
        <div className="main-panel">
          <div className="content-wrapper">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title" style={{color:'black'}}>LISTE DES INDEMNITES</h4>
                <p className="card-description">Nombre total des indemnintés: <span style={{fontWeight:'bolder'}}>{`${count}`}</span></p>
               <I_indemnite onrefresh={handleRefresh}/>

               <div className="col-md-12 mt-3 mb-3">
                    <div className="text-end search-bar">
                      <TextField
                        variant="outlined"
                        placeholder="Rechercher par le Type d'indemnite"
                        onChange={handleSearch}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton>
                                <SearchIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        style={{
                          width: '40%',
                        }}
                      />
                    </div>
                  </div>
     
              <DataTable
 
  columns={columns}
  data={data}
  noDataComponent={<div className="prev">Aucune donnée disponible</div>}  pagination
/>
<div className="text-end mt-3">
                    <button className="btn btn-danger" onClick={generatePDF}>
                      <PictureAsPdf /> Générer PDF
                    </button>
                  </div>
              </div>
                
            </div>
          </div>
          </div>

          <footer className="footer">
            <div className="footer-inner-wraper">
              <div className="d-sm-flex justify-content-center justify-content-sm-between">
                <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">Copyright © bootstrapdash.com 2020</span>
                <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center"> Free <a href="https://www.bootstrapdash.com/" target="_blank">Bootstrap dashboard templates</a> from Bootstrapdash.com</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
