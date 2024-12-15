import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import 'datatables.net';
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material'; 
import Lien from '../../../config';
import RecuperationCookie from "../../cryptages/RécupérationCookie";
export default function I_Fonction({onrefresh}) {
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nom_Fon, setNom_Fon] = useState('');
  const [Id_Ser, setIdSer] = useState('');
  const [Id_Dir, setId_Dir] = useState('');
  const [directions, setDirections] = useState([]);
  const [services, setServices] = useState([]);
  
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const fetchDirections = async () => {
    try {
      const response = await axios.get(`${Lien}/direction`);
      setDirections(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${Lien}/service`);
      setServices(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchServices();
    fetchDirections()
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ser = await axios.get(`${Lien}/service/${Id_Ser}`);
     
      const insert = await axios.post(`${Lien}/fonction`, { nom_Fon, Id_Ser, Id_Dir:ser.data.Id_Dir });
      console.log('Response from POST request:', insert.data);
      const modif=await axios.post(`${Lien}/gerer`, {id_P:insert.data.id_Fon,action:'Insertion du fonction ',id_G});
      setIdSer('')
      setNom_Fon('')
      handleClose();
      // Display SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été insérées avec succès.',
      });
      onrefresh()
    } catch (err) {
      console.error(err);
      // Display SweetAlert error message
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
        Ajouter un nouveau fonction
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
             INSERTION DU NOUVEAU FONCTION
            </Typography>
            <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
            <div className="form-group col-md-12">
                <TextField
                  fullWidth
                  type="text"
                  label="Nom du Fonction"
                  value={nom_Fon}
                  onChange={(e) => setNom_Fon(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-12">
                <FormControl fullWidth required>
                  <InputLabel id="fonction-label">Nom de l'emploi</InputLabel>
                  <Select
                    labelId="fonction-label"
                    id="fonction"
                    value={Id_Ser}
                  onChange={(e) => setIdSer(e.target.value)}
                  required
                  >
                    <MenuItem value="">
                      <em>Sélectionnez une fonction</em>
                    </MenuItem>
                    {services.map((option) => (
                      <MenuItem key={option.Id_Ser} value={option.Id_Ser}>
                        {option.nom_Ser}
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
