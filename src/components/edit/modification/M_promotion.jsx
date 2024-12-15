import React, { useEffect, useState } from "react";

import axios from "axios";
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import Swal from 'sweetalert2';
import {  Edit, Delete } from '@mui/icons-material';




import Lien from '../../../config';
import RecuperationCookie from "../../cryptages/RécupérationCookie";

export default function M_promotion({pers,onrefresh}) {
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [Type, setType] = useState('');
  const [Opportunite, setOpportunite] = useState('');
  const [Montant, setMontant] = useState(0);
  const [editData, setEditData] = useState(null);
  const [annee, setAnnee] = useState('');
 
  
  

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/promotion`);
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
    setType(personne.Type)
    setOpportunite(personne.Opportunite);
    setAnnee(personne.annee);
    setMontant(personne.Montant);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

 
  
  

  const handleSaveChanges = async () => {
    const updatedData = { ...editData,Type, Opportunite,Montant };
    try {
        console.log('editData',editData.id_C)
      const response = await axios.put(`${Lien}/promotion/${editData.id_Pro}`, updatedData);
      console.log('Réponse de la requête PUT:', response.data);
      const modif=await axios.post(`${Lien}/gerer`, {id_P:pers.id_Pro,action:'modification du promotion',id_G});
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
            console.log(id)
            const suppr=await axios.post(`${Lien}/gerer`, {id_P:pers.id_Pro,action:'suppression du promotion',id_G});
          const response = await axios.delete(`${Lien}/promotion/${pers.id_Pro}`);
          console.log('Réponse de la requête DELETE:', response.data);
         
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
           MODIFICATION DE L'INFO SUR UN PROMOTION
          </Typography>
          <Button onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
                      <div className="modal-body">
            <form >
          
              <div className="form-group">
                <TextField
                  fullWidth
                  label="Type du promotion"
                  value={Type}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <TextField
                  fullWidth
                  label="Opportunité"
                  value={Opportunite}
                  onChange={(e) => setOpportunite(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <TextField
                  fullWidth
                  label="Augmentation"
                  type="number"
                  value={Montant}
                  onChange={(e) => setMontant(e.target.value)}
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
