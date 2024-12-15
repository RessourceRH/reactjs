import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import axios from "axios";
import {  PictureAsPdf } from '@mui/icons-material';
import DataTable from 'react-data-table-component';
import 'datatables.net';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Lien from '../../config';
import { InputAdornment, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import I_promotion from "./insertion/I_promotion";
import M_promotion from "./modification/M_promotion";
import RecuperationCookie from "../cryptages/RécupérationCookie";
export default function D_promotion() {
  
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nomModification, setNomModification] = useState('');
  const [dateNomModification, setDateNomModification] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [count, setcount] = useState(0);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const fetchData = async () => {
    try {
      const counts = await axios.get(`${Lien}/script/promotion`);
      setcount(counts.data.count)
      const response = await axios.get(`${Lien}/promotion`);
      setContrat(response.data);
      setFilterData(response.data);
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
      selector: (row) => row.id_Pro,
    },
    {
      name: 'Type de promotion',
      selector: (row) => row.Type,
      sortable: true,
    },
    {
      name: 'Opportunité',
      selector: (row) => row.Opportunite,
      sortable: true,
    },
    {
      name: 'Montant',
      selector: (row) => row.Montant,
      sortable: true,
    },
    
    {
      name: "Action",
      cell: (user) => (
        <div>
          <M_promotion pers={user} onrefresh={handleRefresh}/>
        </div>
      )
    },
  ];

  const handleSearch = (event) => {
    const getSearch = event.target.value.toLowerCase();

    if (getSearch.length > 0) {
      const searchData = contrat.filter((item) =>
        item.Type.toLowerCase().includes(getSearch)
      );

      setContrat(searchData);
    } else {
      // Si la recherche est vide, afficher toutes les données d'origine
      setContrat(filterData);
    }
  };  
  const generatePDF = async () => {
    if (!contrat.length) return; // Ensure data is ready before generating PDF
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
      { header: 'ID', dataKey: 'id_Pro' },
      { header: 'Type', dataKey: 'Type' },
      { header: 'Opportunité', dataKey: 'Opportunite' },
      { header: 'Montant', dataKey: 'Montant' }
    ];

    const tableData = contrat.map(row => ({
      id_Pro: row.id_Pro,
      Type: row.Type, // Extracted data
      Opportunite: row.Opportunite,
      Montant: row.Montant,
    }));

    doc.autoTable({
      columns: columns,
      body: tableData,
      startY:  yOffset+25,
      margin: { horizontal: 10 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [239, 239, 239] },
      showHead: 'firstPage',
    });

    doc.setFontSize(18);
    doc.text("Liste des Types de promotions", 14,  yOffset+20);

    doc.save("Liste_des_types_de_promotion.pdf");
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
                <h4 className="card-title" style={{color:'black'}}>LISTE DES PROMOTIONS</h4>
                <p className="card-description">Nombre total de promotions: <span style={{fontWeight:'bolder'}}>{`${count}`}</span></p>
                <I_promotion onrefresh={handleRefresh}/>

                <div className="col-md-12 mt-3 mb-3">
                    <div className="text-end search-bar">
                      <TextField
                        variant="outlined"
                        placeholder="Rechercher par le Type de promo"
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
