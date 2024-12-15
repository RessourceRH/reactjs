import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Box, Button, Typography, TextField, MenuItem } from '@mui/material';
import Swal from 'sweetalert2';
import { Edit, Delete } from '@mui/icons-material';
import Lien from '../../../config';
import RecuperationCookie from "../../cryptages/RécupérationCookie";

export default function M_fonction({ pers, onrefresh }) {
  const secretKey = 'your-secret-key';
  const id_G = parseInt(RecuperationCookie(secretKey, 'ID'));
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nom_Fon, setNom_Fon] = useState('');
  const [Id_Ser, setIdSer] = useState('');
  const [Id_Dir, setId_Dir] = useState('');
  const [directions, setDirections] = useState([]);
  const [services, setServices] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchDirections = async () => {
    try {
      const response = await axios.get(`${Lien}/direction`);
      setDirections(response.data);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${Lien}/service`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchDirections();
    fetchServices();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/fonction`);
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
    setIdSer(personne.Id_Ser);
    setNom_Fon(personne.nom_Fon);
    setId_Dir(personne.Id_Dir);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    const updatedData = { ...editData, nom_Fon, Id_Ser };
    try {
      const response = await axios.put(`${Lien}/fonction/${editData.Id_Fon}`, updatedData);
      await axios.post(`${Lien}/gerer`, { id_P: editData.Id_Fon, action: 'Modification du fonction', id_G });
      handleCloseModal();
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été modifiées avec succès.',
      });
      onrefresh();
    } catch (error) {
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
          await axios.delete(`${Lien}/fonction/${id}`);
          setContrat(prevContrat => prevContrat.filter(item => item.Id_Fon !== id));
          Swal.fire({
            icon: 'success',
            title: 'Succès !',
            text: 'Les données ont été supprimées avec succès.',
          });
          onrefresh();
        } catch (error) {
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
            maxHeight: '90vh',
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
            position: 'relative',
            overflowY: 'auto',
          }}>
            <Typography variant="h6" style={{ color: '#33c92d', textAlign: 'center', fontWeight: 'bold', fontSize: '15px' }} gutterBottom>
              Modifier le Fonction
            </Typography>
            <Button onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>

            <TextField
              label="Nom du Fonction"
              fullWidth
              variant="outlined"
              value={nom_Fon}
              onChange={(e) => setNom_Fon(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
          
            <TextField
              label="Nom du Service"
              select
              fullWidth
              variant="outlined"
              value={Id_Ser}
              onChange={(e) => setIdSer(e.target.value)}
              required
              sx={{ mb: 2 }}
            >
              <MenuItem value="">
                <em>Sélectionnez un service</em>
              </MenuItem>
              {services.map(service => (
                <MenuItem key={service.Id_Ser} value={service.Id_Ser}>
                  {service.nom_Ser}
                </MenuItem>
              ))}
            </TextField>

            <div className="modal-footer">
            <div className="modal-footer">
                       <button type="button" className="btn btn-secondary" onClick={handleCloseModal} style={{ backgroundColor: '#6c757d', color: '#fff', marginRight: '10px' }}>Fermer</button>
                      <button type="submit" className="btn btn-success" onClick={handleSaveChanges} style={{ backgroundColor: '#28a745', color: '#fff' }}> Modifier</button>
                      </div>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
}
