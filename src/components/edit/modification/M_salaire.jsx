import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import Swal from 'sweetalert2';
import { Edit, Delete } from '@mui/icons-material';
import 'datatables.net';
import Lien from '../../../config';
import '../../../css/I_conjoint.css';
import RecuperationCookie from "../../cryptages/RécupérationCookie";
export default function M_salaire({ pers ,onrefresh}) {
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const [fonctionOptions2, setFonctionOptions2] = useState([]);
  const [id_TC, setIdTC] = useState(0);
  const [contrat, setContrat] = useState([]);
  const [contrat2, setContrat2] = useState([]);
  const [contrat3, setContrat3] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [nom_Emp, setNom_emp] = useState('');
  const [id_Fon, setId_Fon] = useState(0);
  const [salaire_b, setSalaire_b] = useState(0);
  const [duree_s, setDuree_s] = useState('');
  const [assurance, setAssurance] = useState(0);
  const [cnaps, setCnaps] = useState(0);
  const [retraite, setRetraite] = useState(0);
  const [editData, setEditData] = useState(null);
  const [vraiSalaire, setVraiSalaire] = useState(0);

  useEffect(() => {
    const calculateVraiSalaire = () => {
      const totalDeductions = parseFloat(assurance) + parseFloat(cnaps) + parseFloat(retraite);
      const vraiSalaire = parseFloat(salaire_b) - totalDeductions;
      setVraiSalaire(vraiSalaire);
    };

    calculateVraiSalaire();
  }, [salaire_b, assurance, cnaps, retraite]);

  const fetchData = async () => {
    try {
      const [response1, response2, response3, response4] = await Promise.all([
        axios.get(`${Lien}/typeC`),
        axios.get(`${Lien}/fonction`),
        axios.get(`${Lien}/personnelles`),
        axios.get(`${Lien}/typeC`)
      ]);
      setContrat(response1.data);
      setContrat2(response2.data);
      setContrat3(response3.data);
      setFonctionOptions2(response4.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (personne) => {
    setEditData(personne);
    setId_Fon(personne.id_Fon);
    setNom_emp(personne.nom_Emp);
    setSalaire_b(personne.salaire_b);
    setAssurance(personne.assurance);
    setCnaps(personne.cnaps);
    setRetraite(personne.retraite);
    setIdTC(personne.id_TC);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    const updatedData = { ...editData, id_Fon, salaire_b, duree_s, assurance, cnaps, retraite, vraiSalaire, id_TC };
    try {
      const response = await axios.put(`${Lien}/salaire/${editData.id_S}`, updatedData);
      const modif=await axios.post(`${Lien}/gerer`, {id_P:editData.id_S,action:'modification du Salaire',id_G});
      handleCloseModal();
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été modifiées avec succès.',
      });
      onrefresh()
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur !',
        text: 'Une erreur s\'est produite lors de la modification des données.',
      });
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer ces données ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const suppr=await axios.post(`${Lien}/gerer`, {id_P:pers.id_S,action:'suppression du Salaire',id_G});
          await axios.delete(`${Lien}/salaire/${pers.id_S}`);
          setContrat(prevContrat => prevContrat.filter(item => item.id_S !== id));
          Swal.fire({
            icon: 'success',
            title: 'Succès !',
            text: 'Les données ont été supprimées avec succès.',
          });
          onrefresh()
        } catch (error) {
          console.error('Erreur lors de la suppression des données:', error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur !',
            text: 'Une erreur s\'est produite lors de la suppression des données.',
          });
        }
      }
    });
  };

  return (
    <div>
      <div className="row">
        <button className="btn btn-success col-md-6" onClick={() => handleEdit(pers)}>
          <Edit />
        </button>
        <button className="btn btn-secondary col-md-6" onClick={() => handleDelete(pers.id_S)}>
          <Delete />
        </button>
      </div>
      {editData && (
        <Modal open={true} onClose={handleCloseModal} className="modal-container">
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
              MODIFICATION DU  SALAIRE
            </Typography>
            <Button onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
            
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
                    {contrat2.map((option) => (
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
                  onChange={(e) => setAssurance(e.target.value)}
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
                       <button type="button" className="btn btn-secondary" onClick={handleCloseModal} style={{ backgroundColor: '#6c757d', color: '#fff', marginRight: '10px' }}>Fermer</button>
                      <button type="submit" className="btn btn-success" onClick={handleSaveChanges} style={{ backgroundColor: '#28a745', color: '#fff' }}> Sauvegarder</button>
                      </div>
          </Box>
        </Modal>
      )}
    </div>
  );
}
