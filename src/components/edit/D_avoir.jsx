import React, { useEffect, useState } from "react";
import Nav from "../Nav";
import axios from "axios";
import { Modal } from '@mui/material';
import Swal from 'sweetalert2';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import DataTable from 'react-data-table-component';
import $ from 'jquery';
import 'datatables.net';
import { InputAdornment, TextField, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Lien from '../../config';
import I_contrat from "./insertion/I_contrat";
import M_contrat from "./modification/M_contrat";
import I_conjoint from "./insertion/I_conjoint";
import M_conjoint from "./modification/M_conjoint";

export default function D_avoir() {
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nomModification, setNomModification] = useState('');
  const [dateNomModification, setDateNomModification] = useState('');
  const [filterData, setFilterData] = useState([]);
  const [editData, setEditData] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const fetchData = async () => {
    try {
      const counts = await axios.get(`${Lien}/avoir/count`);
      const response = await axios.get(`${Lien}/conjoint`);
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
      selector: (row) => row.id_Conj,
    },
    {
      name: 'Nom',
      selector: (row) => row.nom,
      sortable: true,
    },
    {
      name: 'Profession',
      selector: (row) => row.profession,
      sortable: true,
    },
    {
      name: 'Lieu de travail',
      selector: (row) => row.lieu_T,
      sortable: true,
    },
    {
      name: 'Téléphone',
      selector: (row) => row.tel,
      sortable: true,
    },
    {
      name: "Action",
      cell: (user) => (
        <div>
          <M_conjoint pers={user} />
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
 
  return (
    <div>
      <div className="container-fluid page-body-wrapper m-0 p-0">
        <Nav />
        <div className="main-panel">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title" style={{color:'black'}}></h4>
                <p className="card-description">LISTE DES CONJOINTS</p>
                <I_conjoint />

                <div className="col-md-12 mt-3 mb-3">
                  <div className="text-end">
                    <input type="text" onChange={handleSearch} />
                  </div>
                </div>
     
                <DataTable
                  columns={columns}
                  data={data}
                  noDataComponent={<div>Aucune donnée disponible</div>}
                />
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
