import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Swal from 'sweetalert2';
import Lien from '../../../config';
import '../../../css/I_conjoint.css'; 
import Perso from "../visuel/Perso";
import RecuperationCookie from "../../cryptages/RécupérationCookie";

export default function I_avoir_conge() {
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const [conge, setConge] = useState([]);
  const [personnelles, setPersonnelles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [id_Cong, setid_Cong] = useState('');
  const [id_P, setid_P] = useState('');
  const [nb_conge_fait, setnb_conge_fait] = useState('');
  const [date_debut_conge, setdate_debut_conge] = useState('');
  const [date_fin_conge, setdate_fin_conge] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const congeResponse = await axios.get(`${Lien}/conge`);
        const personnelleResponse = await axios.get(`${Lien}/personnelles/cdi`);
        setConge(congeResponse.data);
        setPersonnelles(personnelleResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${Lien}/avoir_conge`, {
        idP: id_P,
        id_Cong,
        nb_conge_fait,
        date_debut_conge,
        date_fin_conge,
      });
      const modif=await axios.post(`${Lien}/gerer`, {id_P:response.data.id_ac,action:'Insertion du personnelle qui a eu un nouveau Congé ',id_G});
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été insérées avec succès.',
      });
  
      // Réinitialiser les champs
      setid_Cong(0);
      setid_P(0);
      setdate_debut_conge('');
      setdate_fin_conge('');
      setnb_conge_fait(0);
      handleClose();
    } catch (error) {
      
      handleClose();
      if (error.response && error.response.status === 400) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur !',
          text: error.response.data.message,
        });
      } else {
       
        Swal.fire({
          icon: 'error',
          title: 'Erreur !',
          text: 'Une erreur s\'est produite lors de l\'insertion des données.',
        });
      }
    }
  };
  

  return (
    <div>
      <button
        className="btn btn-outline-primary"
        onClick={handleShow}
      >
        Insertion du nouveau congé pour un Personnel
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
              style={{
                color: '#33c92d',
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: '15px'
              }}
            >
              DONNER UN CONGE
            </Typography>
            <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group col-md-12">
                <FormControl fullWidth required>
                  <InputLabel id="personnelle-label">Nom du personnel</InputLabel>
                  <Select
                    labelId="personnelle-label"
                    value={id_P}
                    onChange={(e) => setid_P(e.target.value)}
                    required
                  >
                    <MenuItem value="">
                      <em>Sélectionnez une personne</em>
                    </MenuItem>
                    {personnelles.map((option) => (
                      <MenuItem key={option.id_P} value={option.id_P}>
                        <Perso id={option.id_P} /> {option.id_P}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="form-group col-md-12">
                <FormControl fullWidth required>
                  <InputLabel id="conge-label">Type de Congé</InputLabel>
                  <Select
                    labelId="conge-label"
                    value={id_Cong}
                    onChange={(e) => setid_Cong(e.target.value)}
                    required
                  >
                    <MenuItem value="">
                      <em>Sélectionnez un type de congé</em>
                    </MenuItem>
                    {conge.map((option) => (
                      <MenuItem key={option.id_C} value={option.id_C}>
                        congé de {option.Type_C} de {option.duree_cong} jours
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="form-group col-md-12">
                <TextField
                  fullWidth
                  type="number"
                  label="Nombre de jours de congé"
                  value={nb_conge_fait}
                  onChange={(e) => setnb_conge_fait(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-12">
                <TextField
                  fullWidth
                  type="date"
                  label="Date de début du congé"
                  value={date_debut_conge}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setdate_debut_conge(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-12">
                <TextField
                  fullWidth
                  type="date"
                  label="Date de fin du congé"
                  value={date_fin_conge}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setdate_fin_conge(e.target.value)}
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
