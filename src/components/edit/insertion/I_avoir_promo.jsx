import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material'; 
import Swal from 'sweetalert2';
import '../../../css/I_conjoint.css'; // Assurez-vous de créer et de référencer ce fichier CSS
import Lien from "../../../config";
import Perso from "../visuel/Perso";
import RecuperationCookie from "../../cryptages/RécupérationCookie";

export default function I_avoir_promo({onrefresh}) {
  const [promo, setPromo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [id_Pro, setid_Pro] = useState('');
  const [id_P, setid_P] = useState('');
  const [personnelles, setPersonnelles] = useState([]);
  const [date_pro, setdate_pro] = useState('');
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/promotion`);
      setPromo(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const Personnelle = async () => {
    try {
      const response = await axios.get(`${Lien}/personnelles`);
      setPersonnelles(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    Personnelle();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const insert = await axios.post(`${Lien}/avoir_promo`, { id_Pro, id_P, date_pro });
      console.log('Réponse de la requête POST:', insert.data);
      const modif=await axios.post(`${Lien}/gerer`, {id_P:insert.data.id_A,action:'Insrtion d\'une personnelle qui a eu un promotion ',id_G});
      setdate_pro('');
      setid_Pro('');
      setid_P('');
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
      <button className="btn btn-outline-primary" onClick={handleShow}>
        Insertion du nouveau promotion pour un Personnel
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
              DONNER UNE PROMOTION
            </Typography>
            <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="form-group col-md-12">
                <FormControl fullWidth required>
                  <InputLabel id="personnel-label">Nom du personnel</InputLabel>
                  <Select
                    labelId="personnel-label"
                    id="personnel"
                    value={id_P}
                    onChange={(e) => setid_P(e.target.value)}
                    required
                  >
                    <MenuItem value="">
                      <em>Sélectionnez une personne</em>
                    </MenuItem>
                    {personnelles.map((option) => (
                      <MenuItem key={option.id_P} value={option.id_P.toString()}>
                        <Perso id={option.id_P} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="form-group col-md-12">
                <FormControl fullWidth required>
                  <InputLabel id="promo-label">Type de Promotions</InputLabel>
                  <Select
                    labelId="promo-label"
                    id="promo"
                    value={id_Pro}
                    onChange={(e) => setid_Pro(e.target.value)}
                    required
                  >
                    <MenuItem value="">
                      <em>Sélectionnez une promotion</em>
                    </MenuItem>
                    {promo.map((option) => (
                      <MenuItem key={option.id_Pro} value={option.id_Pro.toString()}>
                        {option.Type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="form-group col-md-12">
                <TextField
                  fullWidth
                  type="date"
                  label="Date de Promotion"
                  value={date_pro}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setdate_pro(e.target.value)}
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
