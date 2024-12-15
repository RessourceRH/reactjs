import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Box, Button, TextField,Typography, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import Swal from 'sweetalert2';
import 'datatables.net';
import Lien from '../../../config';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faPlus, faPrint } from '@fortawesome/free-solid-svg-icons';
import { GeneratePDF_perso } from "./pdf/GeneratePDF_perso";
export default function M_info_perso({ pers ,contrats,versement, promotion,fonction,service,direction,onrefresh}) {
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    cin: '',
    niveau_etude: '',
    date_Cin: '',
    civilite: '',
    date_Cin:'',
    IDP: 0,
    cp: '',
    nb_enf_fille: 0,
    nb_enf_garçon: 0,
    diplome: '',
    email:'',
    
  });
  const [fonctionOptions, setFonctionOptions] = useState([]);
  const [fonctionOptions2, setFonctionOptions2] = useState([]);
  const [editData, setEditData] = useState([]);
console.log('versement,promotion',versement,promotion)
  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/personnelles`);
      setContrat(response.data[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchFonctionOptions = async () => {
    try {
      const response = await axios.get(`${Lien}/fonction`);
      setFonctionOptions(response.data);
    } catch (error) {
      console.error('Error fetching fonction options:', error);
    }
  };

  const fetchFonctionOptions2 = async () => {
    try {
      const response = await axios.get(`${Lien}/TypeC`);
      setFonctionOptions2(response.data);
    } catch (error) {
      console.error('Error fetching type de contrat options:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchFonctionOptions2();
    fetchFonctionOptions();
  }, []);

  const handleEdit = (contrat) => {
    setEditData(contrat);
    setFormData({
      cin: contrat.cin,
      niveau_etude: contrat.niveau_etude,
      date_Cin: contrat.date_Cin,
      civilite: contrat.civilite,
      IDP: contrat.id_P,
      cp: contrat.cp,
      nb_enf_fille: contrat.nb_enf_fille,
      nb_enf_garçon: contrat.nb_enf_garçon,
      diplome: contrat.diplome,
      fonct: contrat.fonct,
      direction: contrat.direction,
      service: contrat.service,
      email: contrat.email
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditData(null);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(`${Lien}/personnelles/${pers.id_P}`, formData);
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


  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const renderTextField = (label, id, type = 'text', required = true) => (
    <div className="form-group col-md-6">
      <TextField
        fullWidth
        label={label}
        id={id}
        type={type}
        value={formData[id]}
        onChange={handleInputChange}
        required={required}
        variant="outlined"
      />
    </div>
  );

const handlePrint = () => {
  
  GeneratePDF_perso(pers, contrats, versement, promotion,fonction,service,direction);
};
  

  return (
    <div>
      <div className="d-print-none" data-aos="fade-left" data-aos-delay="200">
        <div className="btn-group" role="group" aria-label="Basic example">
          <Button
            component={Link}
            to={`/modification/${pers.id_P}`}
            color="success"
            variant="contained"
            style={{backgroundColor:'red',border:'red'}}
            startIcon={<FontAwesomeIcon icon={faEdit} />}
          >
            Modifier
          </Button>
          <Button
            onClick={() => handleEdit(pers)}
            color="secondary"
            
            variant="contained"
            style={{backgroundColor:'gray',border:'gray'}}
            startIcon={<FontAwesomeIcon icon={faPlus} />}
          >
            Ajouter plus d'info
          </Button>
          <Button
         onClick={handlePrint}
        color="success"
        variant="contained"
        style={{ backgroundColor: 'red', border: 'red' }}
        startIcon={<FontAwesomeIcon icon={faPrint} />}
      >
        Imprimer ses infos
      </Button>
        </div>
      </div>

      {/* Modal, visible seulement quand `showModal` est `true` */}
      <Modal open={showModal} onClose={handleCloseModal} className="modal-container">
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
             AJOUTER PLUS D'INFORMATION
            </Typography>
            <Button onClick={handleCloseModal} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
         
          <div className="modal-body">
            <form className="row">
              {renderTextField('Nationalité', 'nationalite')}
              {renderTextField('CIN', 'cin')}
              {renderTextField('Date d\'émission du CIN', 'date_Cin', 'date')}
              {renderTextField('Civilité', 'civilite')}
              {renderTextField('Email', 'email', 'email')}
              {renderTextField('Code postal', 'cp')}
              {renderTextField('Nombres d\'enfants filles', 'nb_enf_fille', 'number')}
              {renderTextField('Nombres d\'enfants garçons', 'nb_enf_garçon', 'number')}
              {renderTextField('Diplômes obtenus', 'diplome')}
              {renderTextField('Niveau d\'étude', 'niveau_etude')}
           
            </form>
          </div>
          <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={handleCloseModal} style={{ backgroundColor: '#6c757d', color: '#fff', marginRight: '10px' }}>
                Fermer
              </button>
              <button onClick={handleSaveChanges} className="btn btn-success" style={{ backgroundColor: '#28a745', color: '#fff' }}>
                Sauvegarder
              </button>
           
          </div>
        </Box>
      </Modal>
    </div>
  );
}
