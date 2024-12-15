import React, { useEffect, useState } from "react";
import axios from "axios";

import {  PictureAsPdf } from '@mui/icons-material';
import DataTable from 'react-data-table-component';

import 'datatables.net';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { InputAdornment, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import RecuperationCookie from "../cryptages/RécupérationCookie";
import Lien from '../../config';

import M_Gerant_Supprimer from "./modification/M_Gerant_Supprimer";

export default function D_gerant_annule() {
  const [contrat, setContrat] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [count, setcount] = useState(0);

 

  

  const fetchData = async () => {
    try {
      const counts = await axios.get(`${Lien}/script/gerant_annule`);
      setcount(counts.data.count)
      const response = await axios.get(`${Lien}/gerant/annule`);
      setContrat(response.data);
      setFilterData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);




const data = contrat.map((user) => user);
   const columns = [
    {
      name: 'ID',
      selector: (row) => row.id_G,
    },
    {
      name: 'Nom et prenoms',
      selector: (row) => row.nom_complet,
      sortable: true,
    },
    {
      name: 'Nom d\'utilisateur',
      selector: (row) => row.nom_U,
      sortable: true,
    },
    {
        name: 'email',
        selector: (row) => row.email,
        sortable: true,
      },
    {
      name: 'Genre',
      selector: (row) => row.sexe,
      sortable: true,
    },
    {
        name: 'Type de gérant',
        selector: (row) => row.type.nom,
        sortable: true,
      },
    {
        name: "Action",
        cell: (user) => (
          <div>
           
            <M_Gerant_Supprimer pers={user} onrefresh={handleRefresh}/>
            
          </div>
        )
      },
       
  ]; const handleRefresh = () => {
    fetchData();
  };

  const handleSearch = (event) => {
    const getSearch = event.target.value.toLowerCase();
   

    if (getSearch.length > 0) {
      const searchData = contrat.filter((item) =>
        item.nom_U.toLowerCase().includes(getSearch)
      );

      setContrat(searchData);
    } else {
      // Si la recherche est vide, afficher toutes les données d'origine
      setContrat(filterData);
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
        doc.text(`Entreprise: ${companieName || ''}`, 16, yOffset);
        yOffset += 7; // Add space after company name
    }
    if (companyAddress) {
        doc.text(`Adresse: ${companyAddress || ''}`, 16, yOffset);
        yOffset += 7; // Add space after address
    }
    if (managerName) {
        doc.text(`Gérant: ${managerName || ''}`, 16, yOffset);
        yOffset += 10; // Add more space before table
    }
    const columns = [
      { header: 'ID', dataKey: 'id' },
      { header: 'Nom et prenoms', dataKey: 'nom_complet' },
      { header: 'Sexe', dataKey: 'sexe' },
      { header: 'Email', dataKey: 'email' }
    ];

    const tableData = contrat.map(row => ({
      id: row.id_G,
      nom_complet: row.nom_complet,
      nom_U: row.nom_U, // Extracted data
      sexe: row.sexe,
      email: row.email,
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
    doc.text("Liste des gerants qui ont été annulés", 14, yOffset+20);

    doc.save("Liste_des_gerants_qui_ont_ete_annule.pdf");
  };
 
  return (
    
              <div className="card-body">
                <h4 className="card-title" style={{color:'black'}}>LISTE DES GERANTS DONT LA VALIDATION EST ANNULE</h4>
                <p className="card-description">Nombre total : <span style={{fontWeight:'bolder'}}>{`${count}`}</span></p>
               

                <div className="col-md-12 mt-3 mb-3">
                    <div className="text-end search-bar">
                      <TextField
                        variant="outlined"
                        placeholder="Rechercher par le nom du personnel"
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
  noDataComponent={<div className="prev">Aucune donnée disponible</div>}   pagination
/>
              
<div className="text-end mt-3">
                    <button className="btn btn-danger" onClick={generatePDF}>
                      <PictureAsPdf /> Générer PDF
                    </button>
                  </div>
                  </div>
                
         
  );
}
