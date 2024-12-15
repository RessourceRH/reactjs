import React, { useEffect, useState } from "react";

import axios from "axios";
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Swal from 'sweetalert2';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";


import Lien from '../../../config';
import RecuperationCookie from "../../cryptages/RécupérationCookie";


export default function M_Gerant({pers,onrefresh}) {
  const [contrat, setContrat] = useState([]);
  const secretKey = 'your-secret-key';
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState('en attente');
  const [validation, setValidation] = useState(0);
  const [id_T, setid_T] = useState(2);
  const [type, setType] = useState([]);
  const [nom, setNom] = useState('');
  const [adresse, setAddresse] = useState('');
  const [sexe, setSexe] = useState('');
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const [editData, setEditData] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  
  

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/typeC`);
      setContrat(response.data);
      const response2 = await axios.get(`${Lien}/type`);
      setType(response2.data);
     
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  

 
  const handleEdit = (personne) => {
    setEditData(personne);
    setValidation(personne.validation);
    console.log(personne.validation)
    setid_T(personne.id_T);
    setNom(personne.nom_complet)
    setAddresse(personne.adresse)
    setSexe(personne.sexe)
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

 
  
  

  const handleSaveChanges = async () => {
    const updatedData = { ...editData, id_T };
    try {
        console.log(pers.id_G)
      const response = await axios.put(`${Lien}/gerant/update_type_gerant/${pers.id_G}`, updatedData);
      console.log('Réponse de la requête PUT:', response.data);
      await axios.post(`${Lien}/gerer`, {id_P:pers.id_G,action:`modification du Gerant N° ${pers.id_G}`,id_G});
      handleCloseModal();
      // Afficher une alerte SweetAlert pour indiquer que la modification a réussi
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été modifiées avec succès.',
      });
      onrefresh()
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error);
      // Afficher une alerte SweetAlert pour indiquer qu'il y a eu une erreur lors de la modification
      Swal.fire({
        icon: 'error',
        title: 'Erreur !',
        text: 'Une erreur s\'est produite lors de la modification des données.',
      });
    }
  };


   
  
    
  


  return (
    <div>
         
         <button className="btn btn-success " onClick={() => handleEdit(pers)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
            
         
               
                {editData && (
                  <Modal open={true} onClose={handleCloseModal} className="modal-container">
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
           MODIFICATION DES AUTORISATIONS SUR LES GERANTS
          </Typography>
          <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
                      <div className="modal-body">
                   
           
            <div className="form-group ">
                <TextField
                  fullWidth
                   type="text"
                  label="Nom et Prenoms"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  InputProps={{ readOnly: true }}
                  required
                />
              </div>
              <div className="form-group ">
                <TextField
                  fullWidth
                   type="text"
                  label="adresse"
                  value={adresse}
                  onChange={(e) => setAddresse(e.target.value)}
                  InputProps={{ readOnly: true }}
                  required
                />
              </div>
              <div className="form-group ">
                <TextField
                  fullWidth
                  type="text"
                  label="Genre"
                  value={sexe}
                  onChange={(e) => setSexe(e.target.value)}
                  InputProps={{ readOnly: true }}
                  required
                />
              </div>
              <div className="form-group ">
                <FormControl fullWidth required>
                  <InputLabel id="contrat-label">Type de Gerant</InputLabel>
                  <Select
                    labelId="contrat-label"
                    id="contrat"
                    value={id_T}
                    onChange={(e) => setid_T(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Sélectionnez un type de gerant</em>
                    </MenuItem>
                    {type.map((option) => (
                      <MenuItem key={option.id_T} value={option.id_T}>
                        {option.nom}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
             
            </div>
                      <div className="modal-footer">
                       <button type="button" className="btn btn-secondary" onClick={handleCloseModal} style={{ backgroundColor: '#6c757d', color: '#fff', marginRight: '10px' }}>Fermer</button>
                      <button type="submit" className="btn btn-success" onClick={handleSaveChanges} style={{ backgroundColor: '#28a745', color: '#fff' }}> Sauvegarder</button>
                      </div>
                    </Box>
                  </Modal>
                )}

     
           
          
    </div>
  );
}
