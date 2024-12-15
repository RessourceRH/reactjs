import React, { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import Lien from '../../../config';
import RecuperationCookie from "../../cryptages/RécupérationCookie";
export default function I_promotion({ onrefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [Type, setType] = useState('');
  const [Montant, setMontant] = useState(0);
  const [annee, setAnnee] = useState('');
  const [Opportunite, setOpportunite] = useState('');
  const [Augmentation, setAugmentation] = useState('');
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const insert = await axios.post(`${Lien}/promotion`, { Type, Opportunite, Montant });
      console.log('Réponse de la requête POST:', insert.data);
      const modif=await axios.post(`${Lien}/gerer`, {id_P: insert.data.id_Pro,action:'Insertion du nouveau promotion ',id_G});
      // Réinitialiser les champs du formulaire
      setType('');
      setOpportunite('');
      setMontant('');
      setAnnee('')
      handleClose();
      
      // Afficher un message de succès
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été insérées avec succès.',
      });
      onrefresh();
    } catch (err) {
      console.error(err);
      // Afficher un message d'erreur
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
        Ajouter une nouvelle promotion
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
          <div className="modal-header">
            <Typography
              variant="h6"
              sx={{ color: '#33c92d', textAlign: 'center', fontWeight: 'bold', fontSize: '15px' }}
            >
              INSERTION DE LA NOUVELLE PROMOTION
            </Typography>
            <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
            
              <div className="form-group">
                <TextField
                  fullWidth
                  label="Type  de promotion"
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
                  label="Montant"
                  type="number"
                  value={Montant}
                  onChange={(e) => setMontant(e.target.value)}
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
          </div>
        </Box>
      </Modal>
    </div>
  );
}
