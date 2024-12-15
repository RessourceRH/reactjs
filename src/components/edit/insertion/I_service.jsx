import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import 'datatables.net';
import Lien from '../../../config';
import '../../../css/I_conjoint.css';
import RecuperationCookie from "../../cryptages/RécupérationCookie"; // Assurez-vous de créer et de référencer ce fichier CSS
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material'; 
export default function I_service({onrefresh}) {
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const [showModal, setShowModal] = useState(false);
  const [nom_Ser, setNom_Ser] = useState('');
  const [Id_Dir, setId_Dir] = useState('');
  const [directions, setDirections] = useState([]);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/direction`);
      setDirections(response.data);
      console.log(response.data)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const insert = await axios.post(`${Lien}/service`, { nom_Ser, Id_Dir });
      console.log('Réponse de la requête POST:', insert.data);
      const modif=await axios.post(`${Lien}/gerer`, {id_P: insert.data.Id_Ser,action:'insertion du du nouveau service ',id_G});
      setId_Dir('');
      setNom_Ser('');
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
        Ajouter un nouveau Service
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
              INSERTION DU NOUVEAU SERVICE
            </Typography>
            <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
         
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
            <div className="form-group col-md-12">
                <TextField
                  fullWidth
                  type="text"
                  label="Nom du Service"
                  value={nom_Ser}
                  onChange={(e) => setNom_Ser(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-12">
                <FormControl fullWidth required>
                  <InputLabel id="dir-label">Nom du Direction</InputLabel>
                  <Select
                    labelId="dir-label"
                    id="Id_Dir"
                    value={Id_Dir}
                    onChange={(e) => setId_Dir(e.target.value)}
                    required
                  >
                    <MenuItem value="">
                      <em>Sélectionnez une direction</em>
                    </MenuItem>
                    {directions.map((option) => (
                      <MenuItem key={option.Id_Di} value={option.Id_Di}>
                        {option.nom_Di}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
