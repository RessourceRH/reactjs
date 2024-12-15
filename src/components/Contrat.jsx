import React, { useEffect, useState } from "react";
import Nav from "./Nav";
import axios from "axios";
import { Modal } from '@mui/material';
import Swal from 'sweetalert2';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import DataTable from 'react-data-table-component';
import $ from 'jquery';
import 'datatables.net';



import Lien from '../config';

export default function Contrat() {
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nomInsertion, setNomInsertion] = useState('');
  const [dateNomInsertion, setDateNomInsertion] = useState('');
  const [nomModification, setNomModification] = useState('');
  const [dateNomModification, setDateNomModification] = useState('');

  const [editData, setEditData] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  // useEffect(() => {
  //   // Initialise DataTables
  //   $(document).ready(() => {
  //     $('#table').DataTable();
  //   });
  // }, [contrat]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const insert = await axios.post(`${Lien}/typeC`, { nom: nomInsertion, date_nom: dateNomInsertion });
      console.log('Réponse de la requête POST:', insert.data);
      setNomInsertion('');
      setDateNomInsertion('');
      handleClose();
      // Afficher une alerte SweetAlert pour indiquer que l'insertion a réussi
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été insérées avec succès.',
      });
    } catch (err) {
      console.error(err);
      // Afficher une alerte SweetAlert pour indiquer qu'il y a eu une erreur lors de l'insertion
      Swal.fire({
        icon: 'error',
        title: 'Erreur !',
        text: 'Une erreur s\'est produite lors de l\'insertion des données.',
      });
    }
  };
  

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/typeC`);
      setContrat(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (personne) => {
    setEditData(personne);
    setNomModification(personne.nom);
    setDateNomModification(personne.date_nom);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    // Afficher une boîte de dialogue de confirmation avec SweetAlert
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer ces données ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${Lien}/typeC/${id}`);
          console.log('Réponse de la requête DELETE:', response.data);
          setContrat(prevContrat => prevContrat.filter(item => item.id !== id));
          // Afficher une alerte SweetAlert pour indiquer que la suppression a réussi
          Swal.fire({
            icon: 'success',
            title: 'Succès !',
            text: 'Les données ont été supprimées avec succès.',
          });
        } catch (error) {
          console.error('Erreur lors de la suppression des données:', error);
          // Afficher une alerte SweetAlert pour indiquer qu'il y a eu une erreur lors de la suppression
          Swal.fire({
            icon: 'error',
            title: 'Erreur !',
            text: 'Une erreur s\'est produite lors de la suppression des données.',
          });
        }
      }
    });
  };
  
  

  const handleSaveChanges = async () => {
    const updatedData = { ...editData, nom: nomModification, date_nom: dateNomModification };
    try {
      const response = await axios.put(`${Lien}/typeC/${editData.id}`, updatedData);
      console.log('Réponse de la requête PUT:', response.data);
      setContrat(prevContrat => prevContrat.map(item => item.id === editData.id ? updatedData : item));
      handleCloseModal();
      // Afficher une alerte SweetAlert pour indiquer que la modification a réussi
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été modifiées avec succès.',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error);
      // Afficher une alerte SweetAlert pour indiquer qu'il y a eu une erreur lors de la modification
      Swal.fire({
        icon: 'error',
        title: 'Erreur !',
        text: 'Une erreur s\'est produite lors de la modification des données.',
      });
    }
  };
// const data = contrat.map((user) => user.row);
  //  const columns = [
  //   {
  //     name: 'ID',
  //     selector: (row) => row.id,
  //   },
  //   {
  //     name: 'Nom',
  //     selector: (row) => row.nom,
  //     sortable: true,
  //   },
  //   {
  //     name: 'date',
  //     selector: (row) => row.date_nom,
  //     sortable: true,
  //   },];

  
  // const columns = [
  //   { name: "ID", selector: (user) => user.id },
  //   { name: "Nom du contrat", selector: (user) => user.nom, sortable: true },
  //   { name: "Date du contrat", selector: (user) => user.type, sortable: true },
  //   { name: "Nom de l'Entreprise", selector: (user) => user.date_nom, sortable: true },
  // {
  //   name: "Action",
  //   cell: (user) => (
  //     <div>
  //       <button className="btn btn-primary" onClick={() => handleEdit(user)}>
  //         <Edit />
  //       </button>
  //       <button className="btn btn-secondary" onClick={() => handleDelete(user.id)}>
  //         <Delete />
  //       </button>
  //     </div>
  //   )
  // },
   
  
    
  // ];

    // const data = contrat.map((user) => user.row);
 


  return (
    <div>
      <div className="container-fluid page-body-wrapper m-0 p-0">
        <Nav />
        <div className="main-panel">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title" style={{color:'black'}}></h4>
                <p className="card-description">LISTE DES CONTRATS</p>
               
                <button className="btn btn-primary" onClick={handleShow}>
                  Ajouter
                </button>

                <Modal open={showModal} onClose={handleClose} className="modal-container">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Titre du Modal</h5>
                      <button type="button" className="close" onClick={handleClose}>
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="modal-body">
                        <div className="form-group">
                          <label htmlFor="nom">Nom</label>
                          <input
                            type="text"
                            className="form-control"
                            id="nom"
                            value={nomInsertion}
                            onChange={(e) => setNomInsertion(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="date_nom">Date Nom</label>
                          <input
                            type="date"
                            className="form-control"
                            id="date_nom"
                            value={dateNomInsertion}
                            onChange={(e) => setDateNomInsertion(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                          Fermer
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Sauvegarder
                        </button>
                      </div>
                    </form>
                  </div>
                </Modal>

                <table id="table"  className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nom du contrat</th>
                      <th>Date du contrat</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contrat.map((personne, index) => (
                      <tr key={index}>
                        <td>{personne.id}</td>
                        <td>{personne.nom}</td>
                        <td>{personne.date_nom}</td>
                        <td>
                          <button className="btn btn-primary" onClick={() => handleEdit(personne)}>
                            <Edit />
                          </button>
                          <button className="btn btn-secondary" onClick={()=>handleDelete(personne.id)}>
                          <Delete />
                          </button>
                          
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {editData && (
                  <Modal open={true} onClose={handleCloseModal} className="modal-container">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Modifier le contrat</h5>
                        <button type="button" className="close" onClick={handleCloseModal}>
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="form-group">
                            <label htmlFor="edit_nom">Nom du contrat</label>
                            <input
                              type="text"
                              className="form-control"
                              id="edit_nom"
                              value={nomModification}
                              onChange={(e) => setNomModification(e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label htmlFor="edit_date_nom">Date du contrat</label>
                            <input
  type="date"
  className="form-control"
  id="edit_date_nom"
  value={dateNomModification ? new Date(dateNomModification).toISOString().split('T')[0] : ''}
  onChange={(e) => setDateNomModification(e.target.value)}
/>

                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                          Fermer
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                          Sauvegarder
                        </button>
                      </div>
                    </div>
                  </Modal>
                )}

              {/* <DataTable
  title="Tableau de données"
  columns={columns}
  data={data}
/> */}
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
