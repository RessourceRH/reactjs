import React, { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import Lien from '../../../config';

export default function I_conge({ onrefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [Type_C, setType_C] = useState('');
  const [duree_cong, setduree_cong] = useState('');

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const insert = await axios.post(`${Lien}/conge`, { duree_cong, Type_C });
      console.log('Réponse de la requête POST:', insert.data);
      setType_C('');
      setduree_cong('');
      handleClose();

      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été insérées avec succès.',
      })
      
      onrefresh();
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur !',
        text: 'Une erreur s\'est produite lors de l\'insertion des données.',
      });
    }
  };

  return (
    <div>
                      <button className="btn btn-outline-primary" onClick={handleShow}>
                      Ajouter un nouveau type de Congé
                </button>
      

      <Modal open={showModal} onClose={handleClose} className="modal-container">
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
               <Typography
            variant="h6"
            style={{
              color: '#33c92d',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize: '15px',
              marginBottom: '20px',
            }}
          >
            INSERTION DU NOUVEAU CONGÉ
          </Typography>
        
          <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
     
          

          <form onSubmit={handleSubmit}>
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

            <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleClose} style={{ backgroundColor: '#6c757d', color: '#fff', marginRight: '10px' }}>
                Fermer
              </button>
              <button type="submit" className="btn btn-success" style={{ backgroundColor: '#28a745', color: '#fff' }}>
                Sauvegarder
              </button>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
