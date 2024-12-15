import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import axios from "axios";
import { PictureAsPdf } from '@mui/icons-material';
import DataTable from 'react-data-table-component';
import 'datatables.net';
import jsPDF from 'jspdf';
  import 'jspdf-autotable';
import Lien from '../../config';
import { InputAdornment, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RecuperationCookie from "../cryptages/RécupérationCookie";
import M_service from "./modification/M_service";
import I_service from "./insertion/I_service";
import Nom_Di from "./visuel/Nom_Dir";

export default function D_service() {
  const [services, setServices] = useState([]);
  const [directions, setDirections] = useState([]);
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
      const counts = await axios.get(`${Lien}/script/service`);
      setcount(counts.data.count)
      const response = await axios.get(`${Lien}/service`);
      setServices(response.data);
      setFilterData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDirections = async () => {
    try {
      const response = await axios.get(`${Lien}/direction`);
      // Assuming the response data is encapsulated like [0: {attribut: 'valeur'}]
      const directionsArray = response.data[0] ? Object.values(response.data[0]) : [];
      setDirections(directionsArray);
      console.log('Directions:', directionsArray);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDirections();
  }, []);
  const handleRefresh = () => {
    fetchData();
  };
  const handleEdit = (service) => {
    setEditData(service);
    setNomModification(service.nom_Ser);
    setDate_C(service.date_C);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

  const getDirectionName = (id) => {
    const direction = directions.find(dir => dir.Id_Dir === id);
    return direction ? direction.nom_Dir : "Unknown Direction";
  };

  const columns = [
    {
      name: 'ID',
      selector: (row) => row.Id_Ser,
    },
    {
      name: 'Nom du Service',
      selector: (row) => row.nom_Ser,
      sortable: true,
    },
    {
      name: 'Nom de la Direction',
      selector: row => <Nom_Di id={row.Id_Dir} />,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <M_service pers={row} onrefresh={handleRefresh} />
        </div>
      ),
    },
  ];

  const handleSearch = (event) => {
    const searchValue = event.target.value.toLowerCase();

    if (searchValue.length > 0) {
      const searchData = services.filter((item) =>
        item.nom_Ser.toLowerCase().includes(searchValue)
      );

      setServices(searchData);
    } else {
      // Si la recherche est vide, afficher toutes les données d'origine
      setServices(filterData);
    }
  };
  
  const generatePDF = async() => {
    if (!services.length) return; // Ensure data is ready before generating PDF
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
      { header: 'ID', dataKey: 'Id_Ser' },
      { header: 'Nom du Service', dataKey: 'nom_Ser' }
    ];

    const tableData = services.map(row => ({
      Id_Ser: row.Id_Ser,
      nom_Ser: row.nom_Ser, // Extracted data
      
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
    doc.text("Liste des Services", 14,  yOffset+20);

    doc.save("Liste_Services.pdf");
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
                <h4 className="card-title" style={{color:'black'}}>LISTES DES SERVICES</h4>
                <p className="card-description">Nombre total de services: <span style={{fontWeight:'bolder'}}>{`${count}`}</span></p>
                 
                  <I_service onrefresh={handleRefresh}/>

                  <div className="col-md-12 mt-3 mb-3">
                    <div className="text-end search-bar">
                      <TextField
                        variant="outlined"
                        placeholder="Rechercher par le nom du service"
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
                    data={services}
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
    </div>
  );
}
