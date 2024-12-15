import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import axios from "axios";
import DataTable from "react-data-table-component";
import {  PictureAsPdf } from '@mui/icons-material';
import jsPDF from "jspdf";
import 'jspdf-autotable';
import Lien from '../config';
import { InputAdornment, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import I_personnelle from "./edit/insertion/I_personnelle";
import M_personnelle from "./edit/modification/M_personnelle";
import Nom_TC from '../components/edit/visuel/Nom_TC'
import RecuperationCookie from "./cryptages/RécupérationCookie";

export default function FetchData() {
  const [personnelles, setPersonnelles] = useState([]);
  const [personnel, setPersonnel] = useState([]);
  const [count, setcount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [filterData, setFilterData] = useState([]);

  
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
       const counts= await axios.get(`${Lien}/script/perso`)
       setcount(counts.data.count)
      
        const response = await axios.get(`${Lien}/personnelles`);
        
        const dataWithAdditionalInfo = await Promise.all(
          response.data.map(async (item) => {
            const fonctionResponse = await axios.get(`${Lien}/fonction/${item.id_Fon}`);
            const serviceResponse = await axios.get(`${Lien}/service/${fonctionResponse.data.Id_Ser}`);
            const directionResponse = await axios.get(`${Lien}/direction/${serviceResponse.data.Id_Dir}`);
            return {
              ...item,
              fonction: fonctionResponse.data,
              service: serviceResponse.data,
              direction: directionResponse.data,
            };
          })
        );
        setPersonnelles(dataWithAdditionalInfo);
        setFilterData(dataWithAdditionalInfo)// Met à jour l'état avec les données récupérées
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const counts= await axios.get(`${Lien}/script/perso`)
      setcount(counts.data.count)
      const response = await axios.get(`${Lien}/personnelles`);
      setPersonnelles(response.data); 
      const dataWithAdditionalInfo = await Promise.all(
        response.data.map(async (item) => {
          const fonctionResponse = await axios.get(`${Lien}/fonction/${item.id_Fon}`);
          const serviceResponse = await axios.get(`${Lien}/service/${fonctionResponse.data.Id_Ser}`);
          const directionResponse = await axios.get(`${Lien}/direction/${fonctionResponse.data.Id_Dir}`);
          
          return {
            ...item,
            fonction: fonctionResponse.data,
            service: serviceResponse.data,
            direction: directionResponse.data,
           
           
          };
        })
      );
     
      setPersonnel(dataWithAdditionalInfo)
      setFilterData(response.data)// Met à jour l'état avec les données récupérées
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleRefresh = () => {
    fetchData();
  };
 
  const data = personnelles.map((user) => { 
   
    return user});
   const columns = [
    {
      name: 'ID',
      selector: (row) => row.id_P,
    },
    {
      name: 'image',
      cell: (row) => (
        <div>
          <img src={`${Lien}/${row.image}`} alt="" width="40px" height="40px" />
        </div>
      ),
      sortable: true,
    },
    
    {
      name: 'Nom',
      selector: (row) => row.nom,
      sortable: true,
    },
   
    {
      name: 'Prenom',
      selector: (row) => row.prenom,
      sortable: true,
    },
    {
      name: 'contrat',
      selector: (row) => <Nom_TC id={row.id_TC}/>,
      sortable: true,
    },
    {
      name: 'Téléphone',
      selector: (row) => row.tel,
      sortable: true,
    },
   
   
    {
      name: 'Action',
      cell: (row) => (
        <M_personnelle pers={{row}} onrefresh={handleRefresh}/>
      ),
      sortable: true,
    }
    
    
       
  ];

  const handleSearch = (event) => {
    const getSearch = event.target.value.toLowerCase();
   

    if (getSearch.length > 0) {
      const searchData = personnelles.filter((item) =>
        item.nom.toLowerCase().includes(getSearch)
      );

      setPersonnelles(searchData);
    } else {
      // Si la recherche est vide, afficher toutes les données d'origine
      setPersonnelles(filterData);
    }
  };
  const PersonnellePDF =async () => {
    if (!personnelles.length) return; // Ensure data is ready before generating PDF
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
      { header: 'ID', dataKey: 'id_P' },
      { header: 'Nom', dataKey: 'nom' },
      { header: 'Prenom', dataKey: 'prenom' },
      { header: 'N° téléphone', dataKey: 'tel' },
      { header: 'Fonction', dataKey: 'fonction' },
      { header: 'Service', dataKey: 'service' },
      { header: 'Direction', dataKey: 'direction' },
    ];
  
    const tableData = personnelles.map(row => ({
      id_P: row.id_P,
      nom: row.nom,
      prenom: row.prenom,
      tel: row.tel,
      fonction: row.fonction.nom_Fon,
      service: row.service.nom_Ser,
      direction: row.direction.nom_Di,
    }));
  
    doc.autoTable({
      columns: columns,
      body: tableData,
      startY: yOffset + 25,
      margin: { horizontal: 10 },
      styles: { fontSize: 10 }, // Default text color
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] }, // Header in black with white text
      showHead: 'firstPage',
    });
  
    doc.setFontSize(18);
    doc.text("Liste des Personnelles ", 20, yOffset+20);
  
    doc.save("Liste_des_personnelles.pdf");
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
              <h4 className="card-title" style={{ color: 'black' }}>LISTE DES PERSONNELLES </h4>
              <p className="card-description">Nombre total: <span style={{fontWeight:'bolder'}}>{`${count}`}</span></p>
       
                
                <I_personnelle onrefresh={handleRefresh}/>
                <div className="col-md-12 mt-3 mb-3">
                    <div className="text-end search-bar">
                      <TextField
                        variant="outlined"
                        placeholder="Rechercher par le Nom du personnel"
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
/>
               
<div className="text-end mt-3">
                    <button className="btn btn-danger" onClick={PersonnellePDF}>
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
