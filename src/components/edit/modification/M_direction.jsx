import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Box, Button, Typography, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { Edit, Delete } from '@mui/icons-material';
import RecuperationCookie from "../../cryptages/RécupérationCookie";
import Lien from '../../../config';

export default function M_direction({ pers, onrefresh }) {
  const secretKey = 'your-secret-key';
  const id_G = parseInt(RecuperationCookie(secretKey, 'ID'));
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nom_Di, setNom_Di] = useState('');
  const [editData, setEditData] = useState(null);

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

  const handleEdit = (personne) => {
    setEditData(personne);
    setNom_Di(personne.nom_Di);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    const updatedData = { ...editData, nom_Di: nom_Di };
    try {
      const response = await axios.put(`${Lien}/direction/${editData.Id_Di}`, updatedData);
      console.log('Réponse de la requête PUT:', response.data);
      await axios.post(`${Lien}/gerer`, { id_P: editData.Id_Di, action: 'Modification du direction', id_G });
      handleCloseModal();
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été modifiées avec succès.',
      });
      onrefresh();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur !',
        text: 'Une erreur s\'est produite lors de la modification des données.',
      });
    }
  };

  const handleDelete = async (id) => {
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
          const response = await axios.delete(`${Lien}/direction/${id}`);
          console.log('Réponse de la requête DELETE:', response.data);
          setContrat(prevContrat => prevContrat.filter(item => item.Id_Di !== id));
          Swal.fire({
            icon: 'success',
            title: 'Succès !',
            text: 'Les données ont été supprimées avec succès.',
          });
          onrefresh();
        } catch (error) {
          console.error('Erreur lors de la suppression des données:', error);
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
        <button className="btn btn-secondary col-md-6" onClick={() => handleDelete(pers.Id_Fon)}>
          <Delete />
        </button>
      </div>

      {editData && (
        <Modal open={showModal} onClose={handleCloseModal} className="modal-container">
          <Box sx={{
            width: '80%',
            maxHeight: '90vh', // Constrain height to make scrollable
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
            position: 'relative', // Allow absolute positioning of close button
            overflowY: 'auto', // Enable vertical scroll inside modal content
          }}>
            <div className="modal-header">
            <Typography variant="h6" 
            style={{
              color: '#33c92d',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize:'15px'
            }}
            gutterBottom>
              Modifier le Direction
            </Typography>
            <Button onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
            </div>
           
            <TextField
              label="Nom du Direction"
              fullWidth
              variant="outlined"
              value={nom_Di}
              onChange={(e) => setNom_Di(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
             <div className="modal-footer">
                       <button type="button" className="btn btn-secondary" onClick={handleCloseModal} style={{ backgroundColor: '#6c757d', color: '#fff', marginRight: '10px' }}>Fermer</button>
                      <button type="submit" className="btn btn-success" onClick={handleSaveChanges} style={{ backgroundColor: '#28a745', color: '#fff' }}> Modifier</button>
                      </div>
          </Box>
        </Modal>
      )}
    </div>
  );
}
