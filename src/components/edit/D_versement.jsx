import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import axios from "axios";
import { Modal } from '@mui/material';
import Swal from 'sweetalert2';
import { PictureAsPdf } from '@mui/icons-material';
import { InputAdornment, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DataTable from 'react-data-table-component';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

import Lien from '../../config';
import M_versement from "./modification/M_versement";
import Nom_Fon from "./visuel/Nom_Fon";
import Perso from "./visuel/Perso";
import I_vers_avance from "./insertion/I_vers_avance";
import RecuperationCookie from "../cryptages/RécupérationCookie";

export default function D_versement() {
  const [contrat, setContrat] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [count, setcount] = useState(0);

  const fetchData = async () => {
    try {
      const counts = await axios.get(`${Lien}/versement/count`);
      const response = await axios.get(`${Lien}/versement`);
      const dataWithAdditionalInfo = await Promise.all(
        response.data.map(async (item) => {
          const persoResponse = await axios.get(`${Lien}/personnelles/${item.id_P}`);
          const salaireResponse = await axios.get(`${Lien}/salaire/${item.id_Sa}`);
          const fonctionResponse = await axios.get(`${Lien}/fonction/${salaireResponse.data.id_Fon}`);
          const promotionResponse = await axios.get(`${Lien}/avoir_promo/personnelle/${persoResponse.data.id_P}`);
          const entrepriseResponse = await axios.get(`${Lien}/entreprise`);
          const contratResponse = await axios.get(`${Lien}/typeC/${persoResponse.data.id_TC}`);
          const directionResponse = await axios.get(`${Lien}/direction/${fonctionResponse.data.Id_Dir}`);
          const serviceResponse = await axios.get(`${Lien}/service/${fonctionResponse.data.Id_Ser}`);
          console.log(contratResponse.data)
          return {
            ...item,
            personnel: persoResponse.data,
            salaire: salaireResponse.data,
            fonction: fonctionResponse.data,
           promotion:promotionResponse.data,
           Entreprise:entrepriseResponse.data ,
           contrat:contratResponse.data,
           direction:directionResponse.data ,
           service:serviceResponse.data
          };
        })
      );
      setContrat(dataWithAdditionalInfo);
      setFilterData(dataWithAdditionalInfo);
      setcount(counts.data.count)
      console.log('dataWithAdditionalInfo',dataWithAdditionalInfo)
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

  const columns = [
    {
      name: 'ID',
      selector: (row) => row.Id_Ver,
      sortable: true,
    },
    {
      name: 'Nom du Personnel',
      selector: (row) => <Perso id={row.id_P} />,
      sortable: true,
    },
    {
      name: 'Salaire',
      selector: (row) => <Nom_Fon id={row.fonction.Id_Fon} />,
      sortable: true,
    },
    {
      name: 'Montant en Ar',
      selector: (row) => row.montant_Ver,
      sortable: true,
    },
    {
      name: 'Date de Versement',
      selector: (row) => row.date_Ver,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <M_versement pers={row} onRefresh={handleRefresh} />
        </div>
      ),
    },
  ];

  const handleSearch = (event) => {
    const getSearch = event.target.value.toLowerCase();

    if (getSearch.length > 0) {
      const searchData = filterData.filter((item) =>
        item.id_P.toString().includes(getSearch)
      );
      setContrat(searchData);
    } else {
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
        { header: 'ID', dataKey: 'Id_Ver' },
        { header: 'Nom du Personnel', dataKey: 'nomPersonnel' },
        { header: 'Salaire', dataKey: 'salaire' },
        { header: 'Montant en Ar', dataKey: 'montant_Ver' },
        { header: 'Date de Versement', dataKey: 'date_Ver' }
    ];
  
    const tableData = contrat.map(row => ({
        Id_Ver: row.Id_Ver,
        nomPersonnel: `${row.personnel.nom} ${row.personnel.prenom}`, // Extracted data
        salaire: `Salaire d'un(e) ${row.fonction.nom_Fon}`, // Extracted data
        montant_Ver: row.montant_Ver,
        date_Ver: row.date_Ver
    }));
  
    // Move table lower by increasing startY
    doc.autoTable({
        columns: columns,
        body: tableData,
        startY: yOffset + 25, // Increase offset to move table lower
        margin: { horizontal: 10 },
        styles: { fontSize: 10, textColor: [0, 0, 0] }, // Set text color to black
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
        alternateRowStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }, // Light gray alternate rows with black text
        showHead: 'firstPage',
    });
  
    doc.setFontSize(18);
    doc.text("Liste des Versements", 20, 55); // Title remains in place
  
    doc.save("versements.pdf");
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
                  <h4 className="card-title" >LISTE DES VERSEMENTS</h4>
                  
                  <p className="card-description">Nombre total de versements : {`${count}`}</p>
                  <I_vers_avance onrefresh={handleRefresh}/>

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
                    data={contrat}
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
