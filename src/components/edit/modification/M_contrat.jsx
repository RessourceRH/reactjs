import React, { useEffect, useState } from "react";

import axios from "axios";
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import Swal from 'sweetalert2';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import DataTable from 'react-data-table-component';
import $ from 'jquery';
import 'datatables.net';



import Lien from '../../../config';
import RecuperationCookie from "../../cryptages/RécupérationCookie";

export default function M_contrat({pers,onrefresh}) {
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nomModification, setNomModification] = useState('');
  const [dateNomModification, setDateNomModification] = useState('');
  const [abreviation, setabreviation] = useState('');
  const [editData, setEditData] = useState(null);



  
  

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
    setabreviation(personne.abreviation)
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

 
  
  

  const handleSaveChanges = async () => {
    const updatedData = { ...editData, nom: nomModification, date_nom: dateNomModification };
    try {
      const response = await axios.put(`${Lien}/typeC/${editData.id}`, updatedData);
      console.log('Réponse de la requête PUT:', response.data);
      const modif=await axios.post(`${Lien}/gerer`, {id_P:pers.id,action:'modification du contrat',id_G});
      handleCloseModal();
      // Afficher une alerte SweetAlert pour indiquer que la modification a réussi
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été modifiées avec succès.',
      });
      onrefresh()
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
          onrefresh()
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
   
  
    
  


  return (
    <div>
         <div className="row">
         <button className="btn btn-success col-md-6" onClick={() => handleEdit(pers)}>
              <Edit />
            </button>
            <button className="btn btn-secondary col-md-6" onClick={() => handleDelete(pers.id)}>
              <Delete />
            </button>
         </div>
               
                {editData && (
                  <Modal open={true} onClose={handleCloseModal} className="modal-container">
                    <div className="modal-content">
                    <div className="modal-header">
                    <Typography
            variant="h6"
            style={{
              color: '#33c92d',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize:'15px'
            }}
          >
            MODIFICATION DU  TYPE DE CONTRAT
          </Typography>
          <Button onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
                    </div>
                      <div className="modal-body">
                     <form >
                        <div className="form-group ">
                <TextField
                  fullWidth
                  type="TEXT"
                  label="Nom du contrat"
                  value={nomModification}
                            onChange={(e) => setNomModification(e.target.value)}
                            required
                />
              </div>
              <div className="form-group ">
                <TextField
                  fullWidth
                  type="tel"
                  label="Abréviation "
                  value={abreviation}
                  onChange={(e) => setabreviation(e.target.value)} 
                  required
                />
              </div>
              <div className="form-group ">
                <TextField
                  fullWidth
                  type="date"
                  label="date d'insertion"
                  InputLabelProps={{ shrink: true }}
                  value={dateNomModification}
                            onChange={(e) => setDateNomModification(e.target.value)}
                            required
                />
              </div>      
              </form>    
                      </div>
                      <div className="modal-footer">
                       
                       <button type="button" className="btn btn-secondary" onClick={handleCloseModal} style={{ backgroundColor: '#6c757d', color: '#fff', marginRight: '10px' }}>
               Fermer
             </button>
             <button type="submit" className="btn btn-success" onClick={handleSaveChanges} style={{ backgroundColor: '#28a745', color: '#fff' }}>
               Modifier
             </button>
                      </div>
                    </div>
                  </Modal>
                )}

     
           
          
    </div>
  );
}
