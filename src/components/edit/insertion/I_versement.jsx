import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import '../../../css/I_conjoint.css'; // Assurez-vous que ce fichier existe et est correctement référencé
import Nom_Fon from "../visuel/Nom_Fon";
import Perso from "../visuel/Perso";
import Lien from "../../../config"; // Remplacez par l'URL de votre backend
import '../../../css/reponses.css';
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import RecuperationCookie from "../../cryptages/RécupérationCookie";
export default function I_versement({ onRefresh,idP,idSa,Click ,promotion,indemnite,tous}) {
  const [contrat, setContrat] = useState([]);
  const [contrat2, setContrat2] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [montant_Ver, setMontantVer] = useState('');
  const [date_Ver, setDateVer] = useState('');
  const [id_P, setIdP] = useState('');
  const [id_Sa, setIdSa] = useState('');
  const [avance, setavance] = useState(0);
  const [remboursement, setremboursement] = useState(0);
  const [nb_mois_avance, setnb_mois_avance] = useState(0);
  const [mois_avance, setmois_avance] = useState('');
  const [vraiSalaire, setVraiSalaire] = useState(0);
  const [isAnswerVisible, setIsAnswerVisible] = useState(false);
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
 
  const handleClose = () => {
    setIdP('')
    setIdSa('')
    setShowModal(false)
    Click()
  };
  const handleShow = () => {
    setIdP(idP)
    setIdSa(idSa)
    setShowModal(true)
    
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/salaire`);
      setContrat(response.data);
      console.log('salaire', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchData2 = async () => {
    try {
      const response = await axios.get(`${Lien}/personnelles`);
      setContrat2(response.data);
      console.log('personnelle', response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  useEffect(() => {
    fetchData();
    fetchData2();
  }, []);

  useEffect(() => {
    if (id_Sa) {
      if(idSa){
        setIdSa(idSa)
      }
      const selectedSalaire = contrat.find((salaire) => salaire.id_S === id_Sa);
      if (selectedSalaire) {
        setVraiSalaire(selectedSalaire.montant_Ver); // Assurez-vous que le montant du salaire est dans `selectedSalaire.montant`
      }
    }
  }, [id_Sa, contrat]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const salaires = await axios.get(`${Lien}/salaire/${id_Sa}`);
      console.log('salaire', salaires.data.vraiSalaire);
      const calculAvance = salaires.data.vraiSalaire * nb_mois_avance;
      const montant = salaires.data.vraiSalaire + calculAvance + tous;
      setMontantVer(salaires.data.vraiSalaire);
      const insert = await axios.post(`${Lien}/versement`, { montant_Ver: montant, date_Ver, id_P:idP, id_Sa, mois_avance, avance: calculAvance, nb_mois_avance });
      console.log('Réponse de la requête POST:', insert.data);
      const modif=await axios.post(`${Lien}/gerer`, {id_P:insert.data.Id_Ver,action:'Insertion du nouveau versement sans remboursement ',id_G});
      onRefresh();
      setDateVer('');
      setMontantVer('');
      setIdP('');
      setmois_avance('');
      setavance(0);
      setnb_mois_avance(0);
      setIdSa('');
      handleClose();
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été insérées avec succès.',
      });
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
      <button className="btn btn-success btn-icon-text" onClick={handleShow} style={{ backgroundColor: '#28a745', color: '#fff' }}>
        Nouveau (+ avance)
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
            INSERTION DU NOUVEAU VERSEMENT
          </Typography>
          <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
        
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
            <div style={{ color: 'Black', textAlign: 'center' }}>
      {/* Handling Indemnity Display */}
      {Array.isArray(indemnite) && indemnite.length > 0 ? (
        indemnite.map((item, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div className="col-sm-6" style={{ marginRight: '10px' }}>
              <TextField
                label="Type d'indemnité"
                value={item.type || ''}
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="col-sm-6">
              <TextField
                label="Montant"
                value={item.montant || ''}
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          </div>
        ))
      ) : indemnite.message ? (
        <div>{indemnite.message}</div>
      ) : (
        <div>Aucune indemnité disponible</div>
      )}

      {/* Handling Promotion Display */}
      {Array.isArray(promotion) && promotion.length > 0 ? (
  promotion.map((promo, index) => {
    const Qualite = promo.promotion?.Type || 'N/A';  // Valeur par défaut "N/A" si Qualite est undefined
    const Montant = promo.promotion?.Montant || 0;  // Valeur par défaut 0 si Augmentation est undefined
    console.log(Qualite, Montant); // Affiche les détails de chaque promotion dans la console

    return (
      <div key={index} style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div className="col-sm-6" style={{ marginRight: '10px' }}>
          <TextField
            label="Type de promotion"
            value={Qualite}
            variant="outlined"
            fullWidth
            type="text"
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
       
        <div className="col-sm-6">
          <TextField
            label="Montant"
            type="number"
            value={Montant}
            variant="outlined"
            fullWidth
            margin="normal"
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
      </div>
    );
  })
) : promotion.message ? (
  <div>{promotion.message}</div>
) : (
  <div>Aucune promotion disponible pour cette année</div>
)}
    </div>
            <div className="form-group ">
                <TextField
                 type="number"
                  fullWidth
                  label="Avance de combien de mois?"
                  id="nb_mois_avance"
                  value={nb_mois_avance}
                  onChange={(e) => setnb_mois_avance(e.target.value)}
                  required
                />
              </div>
           
              
              <div className="form-group ">
                <TextField
                  fullWidth
                  label="Avance de Quel(s) mois?"
                  id="date_Ver"
                  value={mois_avance}
                  onChange={(e) => setmois_avance(e.target.value)}
                />
              </div>
              <div className="form-group ">
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  id="date_Ver"
                  value={date_Ver}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => setDateVer(e.target.value)}
                  required
                />
              </div>
              <div className="form-group ">
                <FormControl fullWidth required>
                  <InputLabel id="contrat-label">Nom du personnel</InputLabel>
                  <Select
                    labelId="contrat-label"
                    id="id_P"
                  value={id_P}
                  onChange={(e) => setIdP(e.target.value)}
                  required
                  >
                    <MenuItem value="">
                      <em>Sélectionnez un employé</em>
                    </MenuItem>
                    {contrat2.map((option) => (
                      <MenuItem key={option.id_P} value={option.id_P}>
                       <Perso id={option.id_P} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="form-group ">
                <FormControl fullWidth required>
                  <InputLabel id="contrat-label">Nom du salaire</InputLabel>
                  <Select
                    labelId="contrat-label"
                    id="id_Sa"
                    value={id_Sa}
                    onChange={(e) => setIdSa(e.target.value)}
                    required
                  >
                    <MenuItem value="">
                      <em>Sélectionnez un salaire</em>
                    </MenuItem>
                    {contrat.map((option) => (
                      <MenuItem key={option.id_S} value={option.id_S}>
                      <Nom_Fon id={option.id_Fon} />
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
