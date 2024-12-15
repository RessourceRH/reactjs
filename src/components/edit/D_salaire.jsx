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
import I_salaire from "./insertion/I_salaire";
import M_salaire from "./modification/M_salaire";

import Nom_Fon from "./visuel/Nom_Fon";
import Nom_TC from "./visuel/Nom_TC";
import RecuperationCookie from "../cryptages/RécupérationCookie";

export default function D_salaire() {
  const [salaire, setSalaire] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nomModification, setNomModification] = useState('');
  const [dateNomModification, setDateNomModification] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [count, setcount] = useState(0);
  

  const fetchData = async () => {
    try {
      const counts= await axios.get(`${Lien}/script/salaire`)
       setcount(counts.data.counts)
      const response = await axios.get(`${Lien}/salaire`);
      setSalaire(response.data);
      setFilterData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
console.log('salaire',salaire)
 
  const handleRefresh = () => {
    fetchData();
  };
 

  const data = salaire.map((user) => user);
  const columns = [
    {
      name: 'ID',
      selector: (row) => row.id_S,
    },
    {
      name: 'Nom del\'emploi',
      selector: (row) => <Nom_Fon id={row.id_Fon}/>,
      sortable: true,
    },
    {
      name: 'Nom du contrat',
      selector: (row) => <Nom_TC id={row.id_TC}/>,
      sortable: true,
    },
    {
      name: 'Salaire de base',
      selector: (row) => row.salaire_b,
      sortable: true,
    },
    {
      name: 'Salaire net',
      selector: (row) => row.vraiSalaire,
      sortable: true,
    },
    {
      name: "Action",
      cell: (user) => (
        <div>
          <M_salaire pers={user} onrefresh={handleRefresh}/>
        </div>
      )
    },
  ];

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    const searchInt = parseInt(searchValue);

    if (!isNaN(searchInt)) {
      const searchData = filterData.filter((item) =>
        item.id_Fon === searchInt
      );
      setSalaire(searchData);
    } else if (searchValue === '') {
      setSalaire(filterData);
    } else {
      setSalaire([]);
    }
  };
  const generatePDF = async() => {
    if (!salaire.length) return; // Ensure data is ready before generating PDF
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
      { header: 'ID', dataKey: 'id_S' },
      { header: 'salaire de base', dataKey: 'salaire_b' },
      { header: 'assurance', dataKey: 'assurance' },
      { header: 'cnaps', dataKey: 'cnaps' },
      { header: 'retraite', dataKey: 'retraite' },
      { header: 'salaire net', dataKey: 'vraiSalaire' }
    ];

    const tableData = salaire.map(row => ({
      id_S: row.id_S,
      salaire_b: row.salaire_b, // Extracted data
      assurance: row.assurance,
      cnaps: row.cnaps,
      retraite: row.retraite,
      vraiSalaire: row.vraiSalaire,
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
    doc.text("Liste des types de salaires", 14,  yOffset+20);

    doc.save("Liste_Salaires.pdf");
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
                <h4 className="card-title" style={{color:'black'}}>LISTE DES SALAIRES</h4>
                <p className="card-description">Nombres totales: <span style={{fontWeight:'bolder'}}>{`${count}`}</span></p>
                < I_salaire onrefresh={handleRefresh}/>

                <div className="col-md-12 mt-3 mb-3">
                    <div className="text-end search-bar">
                      <TextField
                        variant="outlined"
                        placeholder="Rechercher par le N° du fonction"
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
