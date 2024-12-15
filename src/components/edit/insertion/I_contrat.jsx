import React, {  useState } from "react";

import axios from "axios";
import Swal from 'sweetalert2';

import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import RecuperationCookie from "../../cryptages/RécupérationCookie";

import Lien from '../../../config';

export default function I_contrat({onrefresh}) {
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nomInsertion, setNomInsertion] = useState('');
  const [abreviation, setabreviation] = useState('');
  const [dateNomInsertion, setDateNomInsertion] = useState('');

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const insert = await axios.post(`${Lien}/typeC`, { nom: nomInsertion, date_nom: dateNomInsertion ,abreviation:abreviation.toLocaleUpperCase()});
      console.log('Réponse de la requête POST:', insert.data);
      const modif=await axios.post(`${Lien}/gerer`, {id_P: insert.data.id,action:'Insertion du Contrat',id_G});
      setNomInsertion('');
      setDateNomInsertion('');
      setabreviation('')
      handleClose();
      // Afficher une alerte SweetAlert pour indiquer que l'insertion a réussi
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été insérées avec succès.',
      });
      onrefresh()
    } catch (err) {
      console.error(err);
      // Afficher une alerte SweetAlert pour indiquer qu'il y a eu une erreur lors de l'insertion
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
                  Ajouter un nouveau type de contrat
                </button>

                <Modal open={showModal} onClose={handleClose} className="modal-container">
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
            INSERTION DU NOUVEAU TYPE DE CONTRAT
          </Typography>
          <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
                    </div>
                    <form onSubmit={handleSubmit}>
                      <div className="modal-body">
                     
                        <div className="form-group ">
                <TextField
                  fullWidth
                  type="TEXT"
                  label="Nom du contrat"
                  value={nomInsertion}
                            onChange={(e) => setNomInsertion(e.target.value)}
                            required
                />
              </div>
              <div className="form-group ">
                <TextField
                  fullWidth
                  type="tel"
                  label="Abréviation "
                  value={abreviation}
                  onChange={(e) => setabreviation(e.target.value)} 
                  required
                />
              </div>
              <div className="form-group ">
                <TextField
                  fullWidth
                  type="date"
                  label="date d'insertion"
                  InputLabelProps={{ shrink: true }}
                  value={dateNomInsertion}
                            onChange={(e) => setDateNomInsertion(e.target.value)}
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
