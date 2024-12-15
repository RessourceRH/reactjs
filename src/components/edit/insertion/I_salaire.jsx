import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import 'datatables.net';
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material'; 
import Lien from '../../../config';
//import '../../../css/I_conjoint.css';
import RecuperationCookie from "../../cryptages/RécupérationCookie";
export default function I_salaire({ idP ,onrefresh}) {
  console.log('idP', idP);
  const [fonctionOptions2, setFonctionOptions2] = useState([]);
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const [contrat2, setContrat2] = useState([]);
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [id_Fon, setId_Fon] = useState(0); // Ensure consistent naming
  const [salaire_b, setSalaire_b] = useState(0);
  const [date_versement, setdate_versement] = useState('');
  const [assurance, setassurance] = useState(0);
  const [cnaps, setCnaps] = useState(0);
  const [id_TC, setIdTC] = useState(0);
  const [retraite, setRetraite] = useState(0);
  const [vraiSalaire, setVraiSalaire] = useState(0);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/fonction`);
      setContrat(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchData2 = async () => {
    try {
      const response = await axios.get(`${Lien}/personnelles`);
      setContrat2(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchFonctionOptions2 = async () => {
    try {
      const response = await axios.get(`${Lien}/typeC`);
      setFonctionOptions2(response.data);
    } catch (error) {
      console.error('Error fetching fonction options:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchData2();
    fetchFonctionOptions2();
  }, []);

  useEffect(() => {
    const calculateVraiSalaire = () => {
      const totalDeductions = parseFloat(assurance) + parseFloat(cnaps) + parseFloat(retraite);
      const vraiSalaire = parseFloat(salaire_b) - totalDeductions;
      setVraiSalaire(vraiSalaire);
    };

    calculateVraiSalaire();
  }, [salaire_b, assurance, cnaps, retraite]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const insert = await axios.post(`${Lien}/salaire`, { id_Fon, salaire_b, date_versement, assurance, cnaps, retraite, vraiSalaire,id_TC });
      console.log('Réponse de la requête POST:', insert.data);
      const modif=await axios.post(`${Lien}/gerer`, {id_P:insert.data.id_S,action:'insertion du Salaire',id_G});
      setId_Fon(0); // Ensure consistent naming
      setVraiSalaire(0);
      setSalaire_b(0);
      setIdTC(0);
      setdate_versement('');
      setassurance(0);
      setCnaps(0);
      setRetraite(0);
      handleClose();
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été insérées et mises à jour avec succès.',
      });
      onrefresh()
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Erreur !',
        text: 'Une erreur s\'est produite lors de l\'insertion ou de la mise à jour des données.',
      });
    }
  };

  return (
    <div>
      <button className="btn btn-outline-primary" onClick={handleShow}>
        Ajouter un nouveau Salaire
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
              INSERTION DU NOUVEAU SALAIRE
            </Typography>
            <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
            <div className="form-group col-md-12">
                <FormControl fullWidth required>
                  <InputLabel id="fonction-label">Nom de l'emploi</InputLabel>
                  <Select
                    labelId="fonction-label"
                    id="fonction"
                    value={id_Fon}
                    onChange={(e) => setId_Fon(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Sélectionnez une fonction</em>
                    </MenuItem>
                    {contrat.map((option) => (
                      <MenuItem key={option.Id_Fon} value={option.Id_Fon}>
                        {option.nom_Fon}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="form-group col-md-12">
                <FormControl fullWidth required>
                  <InputLabel id="contrat-label">Type de contrat</InputLabel>
                  <Select
                    labelId="contrat-label"
                    id="contrat"
                    value={id_TC}
                    onChange={(e) => setIdTC(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Sélectionnez un contrat</em>
                    </MenuItem>
                    {fonctionOptions2.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.abreviation}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="row">
              <div className="form-group col-md-6">
                <TextField
                  fullWidth
                  type="number"
                  label="Salaire de base"
                  value={salaire_b}
                  onChange={(e) => setSalaire_b(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <TextField
                  fullWidth
                  type="number"
                  label="Assurance"
                  value={assurance}
                  onChange={(e) => setassurance(e.target.value)}
                  required
                />
              </div>
              </div>
         
              
            
              <div className="row">
              <div className="form-group col-md-6">
                <TextField
                  fullWidth
                  type="number"
                  label="Cnaps"
                  value={cnaps}
                  onChange={(e) => setCnaps(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <TextField
                  fullWidth
                  type="number"
                  label="Retraite"
                  value={retraite}
                  onChange={(e) => setRetraite(e.target.value)}
                  required
                />
              </div>
             
              </div>
              <div className="form-group col-md-12">
                <TextField
                  fullWidth
                  type="number"
                  label="Vrai Salaire"
                  value={vraiSalaire}
                  aria-readonly
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
