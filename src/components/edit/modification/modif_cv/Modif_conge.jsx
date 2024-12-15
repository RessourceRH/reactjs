import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, TextField, Button,Box,Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { Edit, Delete } from '@mui/icons-material';
import Lien from "../../../../config";

export default function Modif_conge({ pers }) {
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [id_Cong, setid_Cong] = useState(0);
  const [nb_total_conge, setnb_total_conge] = useState(0);
  const [nb_conge_fait, setnb_conge_fait] = useState(0);
  const [nb_conge_restant, setnb_conge_restant] = useState(0);
  const [date_debut_conge, setdate_debut_conge] = useState('');
  const [date_fin_conge, setdate_fin_conge] = useState('');
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

  const handleEdit = (personne) => {
    setEditData(personne);
    setid_Cong(personne.id_Cong);
    setnb_conge_fait(personne.nb_conge_fait);
    setnb_total_conge(personne.nb_total_conge);
    setnb_conge_restant(personne.nb_conge_restant);
    setdate_debut_conge(personne.date_debut_conge);
    setdate_fin_conge(personne.date_fin_conge);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

  const getDureeConge = async (id) => {
    try {
      const response = await axios.get(`${Lien}/conge/${id}`);
      return response.data.duree_cong;
    } catch (error) {
      console.error('Error fetching duree:', error);
      return 0;
    }
  };

  const handleSaveChanges = async () => {
    try {
      const duree = await getDureeConge(id_Cong);
      const nb_total_conge_calculated = duree;
      const nb_conge_restant_calculated = nb_total_conge_calculated - nb_conge_fait;

      const updatedData = {
        ...editData,
        id_Cong,
        nb_total_conge: nb_total_conge_calculated,
        nb_conge_fait,
        nb_conge_restant: nb_conge_restant_calculated,
        date_debut_conge,
        date_fin_conge,
        id_P: pers.id_P
      };

      const response = await axios.put(`${Lien}/avoir_conge/${editData.id_ac}`, updatedData);
      console.log('Réponse de la requête PUT:', response.data);
      handleCloseModal();

      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été modifiées avec succès.',
      });
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
          const response = await axios.delete(`${Lien}/avoir_conge/${id}`);
          console.log('Réponse de la requête DELETE:', response.data);
          Swal.fire({
            icon: 'success',
            title: 'Succès !',
            text: 'Les données ont été supprimées avec succès.',
          });
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
        <button className="btn btn-secondary col-md-6" onClick={() => handleDelete(pers.id_S)}>
          <Delete />
        </button>
      </div>

      {editData && (
        <Modal open={true} onClose={handleCloseModal} className="modal-container">
           <Box
         className="modal-content"
          sx={{
            width: '80%',
            maxHeight: '90vh',
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
            position: 'relative',
            overflowY: 'auto',
          }}
        >
             <div className="modal-header">
            <Typography
              variant="h6"
              sx={{ color: '#33c92d', textAlign: 'center', fontWeight: 'bold', fontSize: '15px' }}
            >
              MODIFICATION DU  CONGE QUE LE PERSONNEL A EU
            </Typography>
            <Button onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
            
            <div className="modal-body">
              <form>
                <div className="form-group">
                  <TextField
                    select
                    label="Type de Congé"
                    fullWidth
                    id="Id_Cong"
                    value={id_Cong}
                    onChange={(e) => setid_Cong(e.target.value)}
                    required
                    SelectProps={{ native: true }}
                  >
                    <option value="">Sélectionnez un congé</option>
                    {contrat.map((direction) => (
                      <option key={direction.id_C} value={direction.id_C}>
                        {direction.Type_C} {direction.id_C}
                      </option>
                    ))}
                  </TextField>
                </div>
                <div className="form-group">
                  <TextField
                    label="Nombre total de congé"
                    type="number"
                    fullWidth
                    id="nb_total_conge"
                    value={nb_total_conge}
                    onChange={(e) => setnb_total_conge(e.target.value)}
                    required
                    InputProps={{ readOnly: true }}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    label="Nombre de congé fait"
                    type="number"
                    fullWidth
                    id="nb_conge_fait"
                    value={nb_conge_fait}
                    onChange={(e) => setnb_conge_fait(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <TextField
                    label="Nombre de congé restant"
                    type="number"
                    fullWidth
                    id="nb_conge_restant"
                    value={nb_conge_restant}
                    onChange={(e) => setnb_conge_restant(e.target.value)}
                    required
                    InputProps={{ readOnly: true }}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    label="Date du début du congé"
                    type="date"
                    fullWidth
                    id="date_debut_conge"
                    value={date_debut_conge}
                    onChange={(e) => setdate_debut_conge(e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </div>
                <div className="form-group">
                  <TextField
                    label="Date de fin du congé"
                    type="date"
                    fullWidth
                    id="date_fin_conge"
                    value={date_fin_conge}
                    onChange={(e) => setdate_fin_conge(e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
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
