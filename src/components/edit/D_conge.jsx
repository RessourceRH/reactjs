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
import I_conge from "./insertion/I_conge";
import M_conge from "./modification/M_conge";
import RecuperationCookie from "../cryptages/RécupérationCookie";
import { InputAdornment, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
export default function D_conge() {
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
      const counts= await axios.get(`${Lien}/script/conge`)
       setcount(counts.data.count)
      const response = await axios.get(`${Lien}/conge`);
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
      selector: (row) => row.id_C,
    },
    {
      name: 'type de congé',
      selector: (row) => row.Type_C,
      sortable: true,
    },
    {
      name: 'Durée de congé (jours)',
      selector: (row) => row.duree_cong,
      sortable: true,
    },
   
   
    {
      name: "Action",
      cell: (user) => (
        <div>
          <M_conge pers={user} onrefresh={handleRefresh} />
        </div>
      )
    },
  ];

  const handleSearch = (event) => {
    const getSearch = event.target.value.toLowerCase();

    if (getSearch.length > 0) {
      const searchData = contrat.filter((item) =>
        item.nom.toLowerCase().includes(getSearch)
      );

      setContrat(searchData);
    } else {
      // Si la recherche est vide, afficher toutes les données d'origine
      setContrat(filterData);
    }
  };  
  const CongePDF = async() => {
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
      { header: 'ID', dataKey: 'id_C' },
      { header: 'Type de contrat', dataKey: 'Type_C' },
      { header: 'Durée du Congé', dataKey: 'duree_cong' },
    ];

    const tableData = contrat.map(row => ({
        id_C: row.id_C,
      Type_C: row.Type_C,
      duree_cong: row.duree_cong
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
    doc.text("Liste des Types de Congés", 14, yOffset+20);

    doc.save("type_conge.pdf");
  };
  return (
   
      <div className="container-fluid page-body-wrapper m-0 p-0">
        <Nav />
        <div className="main-panel">
          <div className="content-wrapper">
          <div className="col-lg-12 grid-margin stretch-card" >
            <div className="card">
              <div className="card-body">
                <h4 className="card-title" style={{color:'black'}}>LISTE DES TYPES CONGES</h4>
                <p className="card-description">Nombre total: <span style={{fontWeight:'bolder'}}>{`${count}`}</span></p>
                <I_conge onrefresh={handleRefresh}/>

                <div className="col-md-12 mt-3 mb-3">
                    <div className="text-end search-bar">
                      <TextField
                        variant="outlined"
                        placeholder="Rechercher par le nom du Congé"
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
                    <button className="btn btn-danger" onClick={CongePDF}>
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
