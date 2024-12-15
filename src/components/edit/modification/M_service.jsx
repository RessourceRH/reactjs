import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Box, Button, Typography, TextField, MenuItem } from '@mui/material';
import Swal from 'sweetalert2';
import { Edit, Delete } from '@mui/icons-material';
import Lien from '../../../config';
import RecuperationCookie from "../../cryptages/RécupérationCookie";

export default function M_service({ pers, onrefresh }) {
  const secretKey = 'your-secret-key';
  const id_G = parseInt(RecuperationCookie(secretKey, 'ID'));
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nom_Ser, setNom_Ser] = useState('');
  const [Id_Dir, setId_Dir] = useState('');
  const [directions, setDirections] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/conge`);
      setContrat(response.data);
      const response2 = await axios.get(`${Lien}/direction`);
      setDirections(response2.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (personne) => {
    setEditData(personne);
    setId_Dir(personne.Id_Dir);
    setNom_Ser(personne.nom_Ser);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    const updatedData = { ...editData, nom_Ser, Id_Dir };
    try {
      const response = await axios.put(`${Lien}/service/${editData.Id_Ser}`, updatedData);
      console.log('Réponse de la requête PUT:', response.data);
      const modif = await axios.post(`${Lien}/gerer`, { id_P: response.data.Id_Ser, action: 'Modification du service', id_G });
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
          const response = await axios.delete(`${Lien}/service/${id}`);
          console.log('Réponse de la requête DELETE:', response.data);
          setContrat(prevContrat => prevContrat.filter(item => item.Id_Ser !== id));
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
        <button className="btn btn-secondary col-md-6" onClick={() => handleDelete(pers.Id_Ser)}>
          <Delete />
        </button>
      </div>

      {editData && (
        <Modal open={showModal} onClose={handleCloseModal} className="modal-container">
          <Box sx={{
            width: '80%',
            maxHeight: '90vh',
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
            position: 'relative',
            overflowY: 'auto',
          }}>
            <div className="modal-header">
              <Typography variant="h6" style={{
                color: '#33c92d',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '15px'
              }} gutterBottom>
                Modifier le Service
              </Typography>
              <Button onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
            </div>
            <TextField
              label="Nom du Service"
              fullWidth
              variant="outlined"
              value={nom_Ser}
              onChange={(e) => setNom_Ser(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              select
              label="Nom de la Direction"
              fullWidth
              variant="outlined"
              value={Id_Dir}
              onChange={(e) => setId_Dir(e.target.value)}
              required
              sx={{ mb: 2 }}
            >
              <MenuItem value="">
                Sélectionnez une direction
              </MenuItem>
              {directions.map(direction => (
                <MenuItem key={direction.Id_Di} value={direction.Id_Di}>
                  {direction.nom_Di}
                </MenuItem>
              ))}
            </TextField>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal} style={{ backgroundColor: '#6c757d', color: '#fff', marginRight: '10px' }}>Fermer</button>
              <button type="button" className="btn btn-success" onClick={handleSaveChanges} style={{ backgroundColor: '#28a745', color: '#fff' }}>Modifier</button>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
}
