import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import 'datatables.net';
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material'; 
import Lien from '../../../config';
import RecuperationCookie from "../../cryptages/RécupérationCookie";
import Perso from "../visuel/Perso";
export default function I_indemnite({onrefresh}) {
    const secretKey = 'your-secret-key';
    const id_G = parseInt(RecuperationCookie(secretKey, 'ID'));
    
    // State pour les données du formulaire
    const [type, setType] = useState('');
    const [montant, setMontant] = useState('');
    const [annee, setAnnee] = useState('');
    const [Id_P, setId_P] = useState('');
    
    const [personnelle, setPersonnelle] = useState([]);
    const [showModal, setShowModal] = useState(false);
  
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
  
    // Récupération des données des `Personnelle`
    const fetchPersonnelle = async () => {
      try {
        const response = await axios.get(`${Lien}/personnelles`);
        setPersonnelle(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des personnels:', error);
      }
    };
  
    useEffect(() => {
      fetchPersonnelle();
    }, []);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const insert = await axios.post(`${Lien}/indemnite`, { type, montant, annee, Id_P });
        console.log('Réponse de la requête POST:', insert.data);
  
        // Log l'action d'insertion dans `gerer`
        await axios.post(`${Lien}/gerer`, { id_P: insert.data.Id_In, action: 'Insertion d\'indemnité', id_G });
  
        // Réinitialiser les champs
        setType('');
        setMontant('');
        setAnnee('');
        setId_P('');
  
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
        Ajouter une nouvelle Indemnité
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
              INSERTION D'UNE NOUVELLE INDEMNITÉ
            </Typography>
            <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
          {/* Champ pour `type` */}
          <div className="form-group col-md-12">
                <TextField
                  fullWidth
                  type="text"
                  label="Type d'indemnité"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                />
              </div>

              {/* Champ pour `montant` */}
              <div className="form-group col-md-12">
                <TextField
                  fullWidth
                  type="number"
                  label="Montant"
                  value={montant}
                  onChange={(e) => setMontant(e.target.value)}
                  required
                />
              </div>

              {/* Champ pour `annee` */}
              <div className="form-group col-md-12">
                <TextField
                  fullWidth
                  type="text"
                  label="Année"
                  value={annee}
                  onChange={(e) => setAnnee(e.target.value)}
                  required
                />
              </div>

              <div className="form-group col-md-12">
                <FormControl fullWidth required>
                <InputLabel id="personnelle-label">Sélectionnez le personnel</InputLabel>
                  <Select
                    labelId="personnelle-label"
                    id="personnelle"
                    value={Id_P}
                    onChange={(e) => setId_P(e.target.value)}
                    required
                  >
                    <MenuItem value="">
                      <em>Sélectionnez un personnel</em>
                    </MenuItem>
                    {personnelle.map((option) => (
                      <MenuItem key={option.id_P} value={option.id_P}>
                        <Perso id={option.id_P}/>
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
