import React, { useEffect, useState } from "react";

import axios from "axios";

import Swal from 'sweetalert2';
import {Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';



import Lien from '../../../config';
import RecuperationCookie from "../../cryptages/RécupérationCookie";


export default function M_conge({pers,onrefresh}) {
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [duree_cong, setduree_cong] = useState(0);
  const [Type_C, setType_C] = useState('');
  const [editData, setEditData] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  
  

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/conge`);
      setContrat(response.data);
     
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  console.log(pers)
 
  const handleEdit = (personne) => {
    setEditData(personne);
    setType_C(personne.Type_C)
    setduree_cong(personne.duree_cong);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

 
  
  

  const handleSaveChanges = async () => {
    const updatedData = { ...editData, duree_cong:duree_cong,Type_C };
    try {
        console.log('editData',editData.id_C)
      const response = await axios.put(`${Lien}/conge/${editData.id_C}`, updatedData);
      console.log('Réponse de la requête PUT:', response.data);
      const modif=await axios.post(`${Lien}/gerer`, {id_P:pers.id_C,action:'modification du Congé',id_G});
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
          const suppr=await axios.post(`${Lien}/gerer`, {id_P:pers.id,action:'suppression du congé',id_G});
          const response = await axios.delete(`${Lien}/conge/${id}`);
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
            <button className="btn btn-secondary col-md-6" onClick={() => handleDelete(pers.id_C)}>
              <Delete />
            </button>
         </div>
               
                {editData && (
                  <Modal open={true} onClose={handleCloseModal} className="modal-container">
                    <Box
          className="modal-content"
          sx={{
            width: '80%',
            maxHeight: '90vh', // Constrain height to make scrollable
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
            position: 'relative', // Allow absolute positioning of close button
            overflowY: 'auto', // Enable vertical scroll inside modal content
          }}
        >
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
           MODIFICATION DU CONGE
          </Typography>
          <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
                      <div className="modal-body">
                        <form>
                        <div className="form-group">
              <TextField
                fullWidth
                label="Type de congé"
                value={Type_C}
                onChange={(e) => setType_C(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <TextField
                fullWidth
                type="number"
                label="Durée du congé"
                value={duree_cong}
                onChange={(e) => setduree_cong(e.target.value)}
                required
              />
            </div>
                          
                        </form>
                      </div>
                      <div className="modal-footer">
                       <button type="button" className="btn btn-secondary" onClick={handleCloseModal} style={{ backgroundColor: '#6c757d', color: '#fff', marginRight: '10px' }}>Fermer</button>
                       <button type="submit" className="btn btn-success" onClick={handleSaveChanges} style={{ backgroundColor: '#28a745', color: '#fff' }}> Sauvegarder</button>
                      </div>
                    </Box>
                  </Modal>
                )}

     
           
          
    </div>
  );
}
