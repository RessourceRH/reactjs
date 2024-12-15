import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material'; 
import Swal from 'sweetalert2';
import { Edit, Delete } from '@mui/icons-material';
import Lien from '../../../config';
import RecuperationCookie from "../../cryptages/RécupérationCookie";
import Perso from "../visuel/Perso";

export default function M_indemnite({ pers, onrefresh }) {
  const secretKey = 'your-secret-key';
  const id_G = parseInt(RecuperationCookie(secretKey, 'ID'));
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('');
    const [montant, setMontant] = useState('');
    const [annee, setAnnee] = useState('');
    const [Id_P, setId_P] = useState('');
  const [personnelle, setPersonnelle] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchPersonnelle = async () => {
    try {
      const response = await axios.get(`${Lien}/personnelles`);
      setPersonnelle(response.data);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

 

  useEffect(() => {
    fetchPersonnelle();
   
  }, []);



  const handleEdit = (personne) => {
    setEditData(personne);
    setType(personne.type);
    setMontant(personne.montant);
    setAnnee(personne.annee);
    setId_P(personne.Id_P);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    const updatedData = { ...editData, type, montant,annee,Id_P };
    try {
      const response = await axios.put(`${Lien}/indemnite/${editData.Id_In}`, updatedData);
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
          await axios.delete(`${Lien}/indemnite/${id}`);
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
        <button className="btn btn-secondary col-md-6" onClick={() => handleDelete(pers.Id_In)}>
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
              Modifier l'indemnité
            </Typography>
            <Button onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>

            <div className="form-group col-md-12">
                <TextField
                  fullWidth
                  type="text"
                  label="Type d'indemnité"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
              </div>

              {/* Champ pour `montant` */}
              <div className="form-group col-md-12">
                <TextField
                  fullWidth
                  type="number"
                  label="Montant"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  required
                />
              </div>

              {/* Champ pour `annee` */}
              <div className="form-group col-md-12">
                <TextField
                  fullWidth
                  type="text"
                  label="Année"
                  value={annee}
                  onChange={(e) => setAnnee(e.target.value)}
                  required
                />
              </div>

              <div className="form-group col-md-12">
                <FormControl fullWidth required>
                <InputLabel id="personnelle-label">Sélectionnez le personnel</InputLabel>
                  <Select
                    labelId="personnelle-label"
                    id="personnelle"
                    value={Id_P}
                    onChange={(e) => setId_P(e.target.value)}
                    required
                  >
                    <MenuItem value="">
                      <em>Sélectionnez un personnel</em>
                    </MenuItem>
                    {personnelle.map((option) => (
                      <MenuItem key={option.id_P} value={option.id_P}>
                        <Perso id={option.id_P}/>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>

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
