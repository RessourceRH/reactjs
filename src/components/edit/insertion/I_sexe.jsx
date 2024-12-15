import React, { useEffect, useState } from "react";

import axios from "axios";
import { Modal, Box, TextField, Button, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import DataTable from 'react-data-table-component';
import $ from 'jquery';
import 'datatables.net';



import Lien from '../../../config';
import RecuperationCookie from "../../cryptages/RécupérationCookie";

export default function I_sexe({onrefresh}) {
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [genre_S, setGenre] = useState('');
  

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const insert = await axios.post(`${Lien}/sexe`, {genre_S});
      console.log('Réponse de la requête POST:', insert.data);
      const modif=await axios.post(`${Lien}/gerer`, {id_P:insert.data.id_Se,action:'Insertion du nouveau genre ',id_G});
      setGenre('');
    
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
                  Ajouter un nouveau Genre
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
            INSERTION D'UN NOUVEAU GENRE
            </Typography>
            <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
                  
                   
                    <form onSubmit={handleSubmit}>
                      <div className="modal-body">
                      <div className="form-group">
                <TextField
                  fullWidth
                  label="Genre"
                  value={genre_S}
                            onChange={(e) => setGenre(e.target.value)}
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
