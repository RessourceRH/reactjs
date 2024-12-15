import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import axios from "axios";
import { Modal } from '@mui/material';
import Swal from 'sweetalert2';
import { Visibility, Edit, Delete, PictureAsPdf } from '@mui/icons-material';
import DataTable from 'react-data-table-component';
import 'datatables.net';
import jsPDF from 'jspdf';
import { InputAdornment, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RecuperationCookie from "../cryptages/RécupérationCookie";
import 'jspdf-autotable';
import Lien from '../../config';
import I_sexe from "./insertion/I_sexe";
import M_sexe from "./modification/M_sexe";

export default function D_sexe() {
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [count, setcount] = useState(0);

  

  const fetchData = async () => {
    try {
      const counts = await axios.get(`${Lien}/sexe/count`);
      const response = await axios.get(`${Lien}/sexe`);
      setContrat(response.data);
      setFilterData(response.data);
      setcount(counts.data.count)
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
      selector: (row) => row.id_Se,
    },
    {
      name: 'Genre',
      selector: (row) => row.genre_S,
      sortable: true,
    },
    {
      name: "Action",
      cell: (user) => (
        <div>
          <M_sexe pers={user} onrefresh={handleRefresh}/>
        </div>
      )
    },
  ];

  const handleSearch = (event) => {
    const getSearch = event.target.value.toLowerCase();
    if (getSearch.length > 0) {
      const searchData = filterData.filter((item) =>
        item.genre_S.toLowerCase().includes(getSearch)
      );
      setContrat(searchData);
    } else {
      setContrat(filterData);
    }
  };
  const generatePDF =async () => {
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
      { header: 'ID', dataKey: 'id_Se' },
      { header: 'Genre', dataKey: 'genre_S' }
    ];

    const tableData = contrat.map(row => ({
      id_Se: row.id_Se,
      genre_S: row.genre_S,
     // Extracted data
      
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
    doc.text("Liste des types Genres", 14,  yOffset+20);

    doc.save("Liste_des_types_de_genres.pdf");
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
                  <h4 className="card-title" style={{color:'black'}}>LISTE DES GENRES</h4>
                  <p className="card-description">Nombre total de types de Genres: <span style={{fontWeight:'bolder'}}>{`${count}`}</span></p>
                  <I_sexe onrefresh={handleRefresh}/>

                  <div className="col-md-12 mt-3 mb-3">
                    <div className="text-end search-bar">
                      <TextField
                        variant="outlined"
                        placeholder="Rechercher par le Genre"
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
