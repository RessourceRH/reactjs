import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Box, Button, Typography,TextField, Select, MenuItem, FormControl, InputLabel, IconButton  } from '@mui/material';
import Swal from 'sweetalert2';
import { Visibility, Edit, Delete,PictureAsPdf } from '@mui/icons-material';
import DataTable from 'react-data-table-component';
import 'datatables.net';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Lien from '../../../config';
import Perso from "../visuel/Perso";
import Nom_Fon from "../visuel/Nom_Fon";
import generatePDF from "./pdf/Generatepdf";
export default function M_versement({ pers,onRefresh  }) {
  const [contrat, setContrat] = useState([]);
  const [contrat3, setContrat3] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [montant_Ver, setmontant_Ver] = useState('');
  const [date_Ver, setdate_Ver] = useState('');
  const [id_P, setid_P] = useState(0);
  const [id_Sa, setid_Sa] = useState(0);
  const [contrat2, setContrat2] = useState([]);
  const [directions, setDirections] = useState([]);
  const [services, setServices] = useState([]);
  const [editData, setEditData] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

 

  const fetchData3= async () => {
    try {
      const response = await axios.get(`${Lien}/fonction`);
      setContrat3(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/salaire`);
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

  useEffect(() => {
    fetchData();
    fetchData2();
    fetchData3();
  }, []);


  useEffect(() => {
    fetchData();
  }, []);

  const handleEdit = (personne) => {
    setEditData(personne);
    setmontant_Ver(personne.montant_Ver);
    
    // Convertir la date si nécessaire
    const formattedDate = new Date(personne.date_Ver).toISOString().split('T')[0];
    setdate_Ver(formattedDate);
  
    setid_P(personne.id_P);
    setid_Sa(personne.id_Sa);
    setShowModal(true);
  };
  

  const handleGeneratePDF = (row) => {
    generatePDF(row);
  };
 

  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

  const handleSaveChanges = async () => {
    const updatedData = { ...editData, montant_Ver, date_Ver, id_P,id_Sa };
    try {
      console.log('editData', pers);
      const response = await axios.put(`${Lien}/versement/${editData.Id_Ver}`, updatedData);
      console.log('Réponse de la requête PUT:', response.data);
      setContrat(prevContrat => prevContrat.map(item => item.Id_Fon === editData.Id_Fon ? updatedData : item));
      handleCloseModal();
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été modifiées avec succès.',
      });
      onRefresh ()
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
          const response = await axios.delete(`${Lien}/versement/${id}`);
          console.log('Réponse de la requête DELETE:', response.data);
          setContrat(prevContrat => prevContrat.filter(item => item.Id_Fon !== id));
          Swal.fire({
            icon: 'success',
            title: 'Succès !',
            text: 'Les données ont été supprimées avec succès.',
          });
          onRefresh ()
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
        <button className="btn btn-success col-md-4" onClick={() => handleEdit(pers)}>
          <Edit />
        </button>
        <button className="btn btn-secondary col-md-4" onClick={() => handleDelete(pers.Id_Ver)}>
          <Delete />
        </button>
        <button className="col-md-4 btn btn-warning" onClick={() => handleGeneratePDF(pers)}>
            <PictureAsPdf />
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
              VOIR LE  VERSEMENT
            </Typography>
            <Button onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
            
          
              <form>
              <div className="modal-body">
              <div className="form-group ">
                <TextField
                  fullWidth
                  type="number"
                  label="Montant versé"
                  id="nom"
                  value={montant_Ver}
                  onChange={(e) => setmontant_Ver(e.target.value)}
                  readOnly
                />
              </div>
              <div className="form-group ">
                <TextField
                  fullWidth
                  type="date"
                  label="Montant versé"
                  id="nom"
                  value={date_Ver}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setdate_Ver(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <FormControl fullWidth required>
                  <InputLabel id="contrat-label">Nom du personnel</InputLabel>
                  <Select
                    labelId="contrat-label"
                    nom='id_P'
                    value={id_P}
                    onChange={(e) => setid_P(e.target.value)}
                    required
                  >
                    <MenuItem value="">
                      <em>Sélectionnez un Personnel</em>
                    </MenuItem>
                    {contrat2.map((option) => (
                      <MenuItem key={option.id_P} value={option.id_P}>
                       <Perso id={option.id_P}/>  
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="form-group">
                <FormControl fullWidth required>
                  <InputLabel id="contrat-label">Nom du salaire</InputLabel>
                  <Select
                    labelId="contrat-label"
                    nom='id_Sa'
                    id="id_Sa"
                    value={id_Sa}
                    onChange={(e) => setid_Sa(e.target.value)}
                    readOnly
                  >
                    <MenuItem value="">
                      <em>Sélectionnez un salaire</em>
                    </MenuItem>
                    {contrat3.map((option) => (
                      <MenuItem key={option.Id_Fon} value={option.Id_Fon}>
                       <Nom_Fon id={option.Id_Fon}/>   
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              
             
             
            
            </div>
              </form>
           
            <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal} style={{ backgroundColor: '#6c757d', color: '#fff', marginRight: '10px' }}>
                Fermer
              </button>
              <button type="submit" className="btn btn-success" onClick={handleSaveChanges} style={{ backgroundColor: '#28a745', color: '#fff' }}>
               Modifier
             </button>
            </div>
          </Box>
        </Modal>
      )}
    </div>
  );
}
