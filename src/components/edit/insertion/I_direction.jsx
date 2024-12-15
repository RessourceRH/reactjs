import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material'; 
import 'datatables.net';
import Lien from '../../../config';
import '../../../css/I_conjoint.css'; // Assurez-vous de créer et de référencer ce fichier CSS
import RecuperationCookie from "../../cryptages/RécupérationCookie";
export default function I_direction({onrefresh}) {
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nom_Di, setNom_Di] = useState('');
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const insert = await axios.post(`${Lien}/direction`, { nom_Di});
      console.log('Réponse de la requête POST:', insert.data);
      const modif=await axios.post(`${Lien}/gerer`, {id_P:insert.data.Id_Di,action:'Ajout d\'un nouveau direction',id_G});
      setNom_Di('');
      handleClose();
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été insérées avec succès.',
      });
      onrefresh()
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
      <button className="btn btn-outline-primary" onClick={handleShow} >
        Ajouter une  nouvelle Direction
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
              INSERTION DU NOUVEAU DIRECTION
            </Typography>
            <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
            <div className="form-group col-md-12">
                <TextField
                  fullWidth
                  type="text"
                  label="Nom du Direction"
                  value={nom_Di}
                  onChange={(e) => setNom_Di(e.target.value)}
                  required
                />
              </div>
              
            
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
