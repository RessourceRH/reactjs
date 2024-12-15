import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';

import Swal from 'sweetalert2';
import Lien from '../../../config';
import RecuperationCookie from "../../cryptages/RécupérationCookie";

export default function I_personnelle({ onrefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [nomInsertion, setNomInsertion] = useState('');
  const [prenom, setPrenom] = useState('');
  const [DN, setDN] = useState('');
  const [lieu, setLieu] = useState('');
  const [tel, setTel] = useState('');
  const [nationalite, setNationalite] = useState('');
  const [date_Cin, setDateCin] = useState('');
  const [cp, setCp] = useState('');
  const [id_Se, setId_Se] = useState('');
  const [diplome, setDiplome] = useState('');
  const [id_Fon, setid_Fon] = useState('');
  const [adresse, setAdresse] = useState('');
  const [ville, setVille] = useState('');
  const [id_TC, setid_TC] = useState('');
  const [image, setImage] = useState(null);
  const [date_DF, setdate_DF] = useState('');
  const [sexe, setSexe] = useState([]);
  const [fonction, setFonction] = useState([]);
  const [contrats, setContrats] = useState([]);
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sexeRes, fonctionRes, contratRes] = await Promise.all([
          axios.get(`${Lien}/sexe`),
          axios.get(`${Lien}/fonction`),
          axios.get(`${Lien}/typeC`)
        ]);
        setSexe(sexeRes.data);
        setFonction(fonctionRes.data);
        setContrats(contratRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nom', nomInsertion);
    formData.append('prenom', prenom);
    formData.append('id_TC', id_TC);
    formData.append('lieu', lieu);
    formData.append('tel', tel);
    formData.append('nationalite', nationalite);
    formData.append('cp', cp);
    formData.append('id_Fon', id_Fon);
    formData.append('DN', DN);
    formData.append('adresse', adresse);
    formData.append('ville', ville);
    formData.append('id_Se', id_Se);
    formData.append('date_DF', date_DF);
    formData.append('image', image);

    try {
      const insert = await axios.post(`${Lien}/personnelles`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      console.log('Réponse de la requête POST:', insert.data);
      const modif=await axios.post(`${Lien}/gerer`, {id_P: insert.data.id_P,action:'insertion d\'un nouveau personnelle ',id_G});
      setNomInsertion('');
      setAdresse('')
      setid_TC('')
      setDiplome('')
      setdate_DF('')
      setImage('')
      setDateCin('')
      setCp('')
      setDN('')
      setid_Fon('')
      setLieu('')
      setNationalite('')
      setPrenom('')
      setTel('')
      setId_Se('')
      handleClose();
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été insérées avec succès.',
      });
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
      
      <button className="btn btn-outline-primary" onClick={handleShow} >
      Ajouter un nouveau Personnelle
      </button>
      <Modal
        open={showModal}
        onClose={handleClose}
        className="modal-container"
       
      >
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
            INSERTION DU NOUVEAU PERSONNELLE
          </Typography>
          <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
        
          
          <form onSubmit={handleSubmit}>
            {/* Form content remains unchanged */}
            <div className="row modal-body"  style={{overflow:'auto'}}>
              <div className="form-group col-md-12">
                <TextField
                  fullWidth
                  type="file"
                  label="Image"
                  onChange={(e) => setImage(e.target.files[0])}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <TextField
                  fullWidth
                  label="Nom"
                  value={nomInsertion}
                  onChange={(e) => setNomInsertion(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <TextField
                  fullWidth
                  label="Prénom"
                  value={prenom}
                  onChange={(e) => setPrenom(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <TextField
                  fullWidth
                  type="date"
                  label="Date de Naissance"
                  value={DN}
                  onChange={(e) => setDN(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <TextField
                  fullWidth
                  label="Lieu de naissance"
                  value={lieu}
                  onChange={(e) => setLieu(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <TextField
                  fullWidth
                  type="tel"
                  label="N° Téléphone"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <TextField
                  fullWidth
                  label="Adresse"
                  value={adresse}
                  onChange={(e) => setAdresse(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <TextField
                  fullWidth
                  label="Ville"
                  value={ville}
                  onChange={(e) => setVille(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <FormControl fullWidth required>
                  <InputLabel id="sexe-label">Genre</InputLabel>
                  <Select
                    labelId="sexe-label"
                    id="sexe"
                    value={id_Se}
                    onChange={(e) => setId_Se(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Sélectionnez un genre</em>
                    </MenuItem>
                    {sexe.map((option) => (
                      <MenuItem key={option.id_Se} value={option.id_Se}>
                        {option.genre_S}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="form-group col-md-6">
                <TextField
                  fullWidth
                  type="date"
                  label="Date du début du fonction"
                  value={date_DF}
                  onChange={(e) => setdate_DF(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <FormControl fullWidth required>
                  <InputLabel id="contrat-label">Type de contrat</InputLabel>
                  <Select
                    labelId="contrat-label"
                    id="contrat"
                    value={id_TC}
                    onChange={(e) => setid_TC(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Sélectionnez un contrat</em>
                    </MenuItem>
                    {contrats.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.abreviation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="form-group col-md-12">
                <FormControl fullWidth required>
                  <InputLabel id="fonction-label">Fonction</InputLabel>
                  <Select
                    labelId="fonction-label"
                    id="fonction"
                    value={id_Fon}
                    onChange={(e) => setid_Fon(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Sélectionnez une fonction</em>
                    </MenuItem>
                    {fonction.map((option) => (
                      <MenuItem key={option.Id_Fon} value={option.Id_Fon}>
                        {option.nom_Fon}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
            <hr style={{ marginTop: '20px' }} />
            <div className="modal-footer" style={{ marginTop: '20px' }}>
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
