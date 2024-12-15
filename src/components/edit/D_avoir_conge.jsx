import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import axios from "axios";
import { Modal } from '@mui/material';
import Swal from 'sweetalert2';
import { Visibility, Edit, Delete, PictureAsPdf } from '@mui/icons-material';
import DataTable from 'react-data-table-component';
import $ from 'jquery';
import 'datatables.net';
import jsPDF from 'jspdf';
  import 'jspdf-autotable';
import Lien from '../../config';
import { InputAdornment, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

import Perso from "./visuel/Perso";
import Nom_Conge from "./visuel/Nom_Conge";
import I_avoir_conge from "./insertion/I_avoir_conge";
import Modif_conge from "./modification/modif_cv/Modif_conge";
import RecuperationCookie from "../cryptages/RécupérationCookie";

export default function D_avoir_conge() {
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nomModification, setNomModification] = useState('');
  const [date_C, setDate_C] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [count, setcount] = useState(0);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);


  const fetchData = async () => {
    try {
      const counts = await axios.get(`${Lien}/script/avConge`);
      setcount(counts.data.count)
      const response = await axios.get(`${Lien}/avoir_conge`);
      
      
      const dataWithAdditionalInfo = await Promise.all(
        response.data.map(async (item) => {
          const persoResponse = await axios.get(`${Lien}/personnelles/${item.id_P}`);
          const congeResponse = await axios.get(`${Lien}/conge/${item.id_Cong}`);
          return {
            ...item,
            personnel: persoResponse.data,
            conge: congeResponse.data,
          };
        })
      );
      setContrat(dataWithAdditionalInfo);
      setFilterData(dataWithAdditionalInfo);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

 
 

  const data = contrat.map((user) => user);
  const columns = [
    {
      name: 'ID',
      selector: (row) => row.id_ac,
      sortable: true,
    },
    {
      name: 'type de congé',
      selector: (row) => <Nom_Conge id={row.id_Cong}/>,
      sortable: true,
    },
    {
      name: 'Nom du personnelle',
      selector: (row) => <Perso id={row.id_P}/>,
      sortable: true,
    },
    {
      name: 'Nb total (jours)',
      selector: (row) => row.nb_total_conge,
      sortable: true,
    },
    {
      name: 'Nb congé expiré (jours)',
      selector: (row) => row.nb_conge_fait,
      sortable: true,
    },
    {
      name: 'Nb congé restant (jours)',
      selector: (row) => row.nb_conge_restant,
      sortable: true,
    },
    { name: "Action", selector: (row) =><Modif_conge pers={row} /> , sortable: true },
  ];

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    const searchInt = parseInt(searchValue);

    if (!isNaN(searchInt)) {
      const searchData = filterData.filter((item) =>
        item.id_P === searchInt
      );
      setContrat(searchData);
    } else if (searchValue === '') {
      setContrat(filterData);
    } else {
      setContrat([]);
    }
  };
  const generatePDF = async() => {
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
      { header: 'ID', dataKey: 'id_ac' },
      { header: 'Nom P.', dataKey: 'id_P' },
      { header: 'type de congé', dataKey: 'id_Cong' },
      { header: 'Nb total', dataKey: 'nb_total_conge' },
      { header: 'congé éxpiré', dataKey: 'nb_conge_fait' },
      { header: 'congé restant', dataKey: 'nb_conge_restant' },
      { header: 'date du début', dataKey: 'date_debut_conge' },
      { header: 'date du fin', dataKey: 'date_fin_conge' }
    ];
  
    const tableData = contrat.map(row => ({
      id_ac: row.id_ac,
      id_P:  `${row.personnel.nom} ${row.personnel.prenom}`, // Extracted data
      id_Cong: row.conge.Type_C,
      nb_total_conge: row.nb_total_conge,
      nb_conge_fait: row.nb_conge_fait,
      nb_conge_restant: row.nb_conge_restant,
      date_debut_conge: row.date_debut_conge,
      date_fin_conge: row.date_fin_conge,
    }));
  
    doc.autoTable({
      columns: columns,
      body: tableData,
      startY: yOffset+25,
      margin: { horizontal: 10 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }, // Header in black with white text
      alternateRowStyles: { fillColor: [239, 239, 239] },
      showHead: 'firstPage',
    });
  
    doc.setFontSize(18);
    doc.text("Liste des congés eu par les Personnelles", 14, yOffset+20);
  
    doc.save("Liste_des_conges_eu.pdf");
  };
  
  return (
    <div className="container-fluid page-body-wrapper m-0 p-0">
      <Nav />
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title" style={{ color: 'black' }}>LISTE DES PERSONNES QUI ONT EU UN CONGE</h4>
                <p className="card-description">Nombre total: <span style={{fontWeight:'bolder'}}>{`${count}`}</span></p>
                <I_avoir_conge/>
                <div className="col-md-12 mt-3 mb-3">
                    <div className="text-end search-bar">
                      <TextField
                        variant="outlined"
                        placeholder="Rechercher par le N° du personnel"
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
                  noDataComponent={<div className="prev">Aucune donnée disponible</div>}
                  pagination
                />
                  <div className="text-end mt-3">
                    <button className="btn btn-danger" onClick={generatePDF}>
                      <PictureAsPdf /> Générer PDF
                    </button>
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
