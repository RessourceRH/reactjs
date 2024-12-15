import React, {useState } from "react";
import axios from "axios";
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import Swal from 'sweetalert2';
import DataTable from 'react-data-table-component';
import 'datatables.net';
import Lien from '../../../config';
import '../../../css/I_conjoint.css'; // Assurez-vous de créer et de référencer ce fichier CSS
import RecuperationCookie from "../../cryptages/RécupérationCookie";

export default function I_conjoint({idP,onrefresh}) {
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [profession, setProfession] = useState('');
  const [lieu_T, setLieuT] = useState('');
  const [tel, setTel] = useState('');
  const [nom, setNom] = useState('');
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const insertResponse = await axios.post(`${Lien}/conjoint`, { nom, profession, lieu_T, tel });
      console.log('Réponse de la requête POST:', insertResponse.data);
      
      const newRecordId = insertResponse.data.id_Conj; // Supposons que l'ID est retourné dans insertResponse.data.id
      
      // Mise à jour avec l'ID récupéré
      const updateResponse = await axios.put(`${Lien}/personnelles/conjoint/${idP}`, { id_Conj: newRecordId });
      console.log('Réponse de la requête PUT:', updateResponse.data);
      const modif=await axios.post(`${Lien}/gerer`, {id_P:newRecordId,action:'insertion du nouveau conjoint',id_G});
      setNom('');

      setProfession('');
      setLieuT('');
      setTel('');
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
      <button className="btn btn-success" onClick={handleShow}>
        Ajouter
      </button>
      <Modal open={showModal} onClose={handleClose} className="modal-container">
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
            INSERTION DE L'INFO SUR SON CONJOINT
          </Typography>
          <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
        
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
            <div className="form-group ">
                <TextField
                  fullWidth
                   type="text"
                  label="Nom et Prenoms"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>
              <div className="form-group ">
                <TextField
                  fullWidth
                   type="text"
                  label="Profession"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  required
                />
              </div>
              <div className="form-group ">
                <TextField
                  fullWidth
                  type="text"
                  label="Lieu de travail"
                  value={lieu_T}
                  onChange={(e) => setLieuT(e.target.value)}
                  required
                />
              </div>
              <div className="form-group ">
                <TextField
                  fullWidth
                  label="N° Téléphone"
                  value={tel}
                  type="tel"
                  onChange={(e) => setTel(e.target.value)}
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
