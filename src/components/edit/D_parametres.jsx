import axios from "axios";
import RecuperationCookie from "../cryptages/RécupérationCookie";
import Nav from "../Nav";
import Lien from "../../config";
import { useEffect, useState } from "react";
import I_entreprise from "./insertion/I_entreprise";
import { Edit } from '@mui/icons-material';
import { TextField, Button, Grid, Box } from "@mui/material";
import {  IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ImageUpdateEntreprise from "./modification/modif_Entreprise/image_Entreprise";
export default function D_parametres() {
  const secretKey = 'your-secret-key';
  const [gerant, setGerant] = useState([]);
  const [companyInfo, setCompanyInfo] = useState([]);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updateFormValues, setUpdateFormValues] = useState({
    nom: '',
    cp: '',
    adresse: '',
    ville: '',
    date_creation: '',
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const toggleShowOldPassword = () => setShowOldPassword(!showOldPassword);
  const toggleShowNewPassword = () => setShowNewPassword(!showNewPassword);

  const [updateMessage, setUpdateMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  
  const id = parseInt(RecuperationCookie(secretKey, 'ID'), 10);

  const fetchGerant = async () => {
    try {
      const response = await axios.get(`${Lien}/gerant/${id}`);
      setGerant(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des données du gérant:", error);
    }
  };

  const fetchCompanyInfo = async () => {
    try {
      const response = await axios.get(`${Lien}/entreprise`);
      setCompanyInfo(response.data);
     
      if (response.data) {
        setUpdateFormValues({
          nom: response.data[0].nom,
          cp: response.data[0].cp,
          adresse: response.data[0].addresse,
          ville: response.data[0].ville,
          date_creation: response.data[0].date_creation,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données de l'entreprise:", error);
    }
  };

  const handleRefresh = () => {
    fetchCompanyInfo();
  };
  console.log(companyInfo)
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${Lien}/gerant/change-password`, {
        id,
        oldPassword,
        newPassword,
      });

      if (response.data.success) {
        setPasswordMessage("Mot de passe changé avec succès !");
      } else {
        setPasswordMessage(response.data.message || "Ancien mot de passe incorrect.");
      }
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      setPasswordMessage("Une erreur s'est produite lors du changement de mot de passe. Veuillez réessayer.");
    }
  };

  const handleUpdateCompanyInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${Lien}/entreprise/${companyInfo[0].id}`, updateFormValues);
  
      if (response.data.success) {
        setUpdateMessage(response.data.message); // Affiche le message de succès du backend
        handleRefresh(); // Actualise les données après la mise à jour
      } else {
        setUpdateMessage(response.data.message || "Une erreur s'est produite lors de la mise à jour des informations.");
        handleRefresh();
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des informations de l'entreprise:", error);
      setUpdateMessage("Une erreur s'est produite lors de la mise à jour des informations de l'entreprise. Veuillez réessayer.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchGerant();
    fetchCompanyInfo();
  }, []);

  return (
    <div className="container-fluid page-body-wrapper m-0 p-0">
      <Nav />
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title" style={{ color: 'black' }}>LES PARAMÈTRES</h4>

                <Box display="flex" justifyContent="center">
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} md={8}>
                      {companyInfo[0]  ? (
                          <form onSubmit={handleUpdateCompanyInfo}>
                          <h5>Informations sur l'entreprise</h5>
                          {updateMessage && (
                            <p style={{ color: updateMessage.includes('succès') ? 'green' : 'red' }}>{updateMessage}</p>
                          )}
                          <ImageUpdateEntreprise id={companyInfo[0].id}/>
                          <TextField
                            fullWidth
                            margin="normal"
                            label="Nom"
                            name="nom"
                            value={updateFormValues.nom}
                            onChange={handleInputChange}
                            required
                          />
                          <TextField
                            fullWidth
                            margin="normal"
                            label="Code Postal"
                            name="cp"
                            value={updateFormValues.cp}
                            onChange={handleInputChange}
                            required
                          />
                          <TextField
                            fullWidth
                            margin="normal"
                            label="Adresse"
                            name="adresse"
                            value={updateFormValues.adresse}
                            onChange={handleInputChange}
                            required
                          />
                          <TextField
                            fullWidth
                            margin="normal"
                            label="Ville"
                            name="ville"
                            value={updateFormValues.ville}
                            onChange={handleInputChange}
                            required
                          />
                          <TextField
                            fullWidth
                            margin="normal"
                            label="Date de Création"
                            name="date_creation"
                            type="date"
                            value={updateFormValues.date_creation}
                            onChange={handleInputChange}
                            InputLabelProps={{ shrink: true }}
                            required
                          />
                          <Button variant="contained" color="primary" type="submit" fullWidth>
                          <Edit /> Mettre à jour
                          </Button>
                        </form>
                       
                      ) : (
                        <I_entreprise onrefresh={handleRefresh} />
                      )}
                    </Grid>
                  </Grid>
                </Box>

                <Box display="flex" justifyContent="center" marginTop={4}>
                  <Grid container spacing={3} justifyContent="center">
                    <Grid item xs={12} md={8}>
                      <h5>Changer le mot de passe</h5>
                      {passwordMessage && (
                        <p style={{ color: passwordMessage.includes('succès') ? 'green' : 'red' }}>{passwordMessage}</p>
                      )}
                    <form onSubmit={handlePasswordChange}>
     
      {/* Champ pour l'ancien mot de passe */}
      <TextField
        fullWidth
        margin="normal"
        label="Ancien mot de passe"
        type={showOldPassword ? 'text' : 'password'}
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleShowOldPassword}>
                {showOldPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Champ pour le nouveau mot de passe */}
      <TextField
        fullWidth
        margin="normal"
        label="Nouveau mot de passe"
        type={showNewPassword ? 'text' : 'password'}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={toggleShowNewPassword}>
                {showNewPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <Button variant="contained" color="primary" type="submit" fullWidth>
      <Edit />  Changer le mot de passe
      </Button>
    </form>
                    </Grid>
                  </Grid>
                </Box>

              </div>
            </div>
          </div>
          <footer className="footer">
            <div className="footer-inner-wrapper">
              <div className="d-sm-flex justify-content-center justify-content-sm-between">
                <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">Copyright © bootstrapdash.com 2020</span>
                <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center"> Free <a href="https://www.bootstrapdash.com/" target="_blank" rel="noopener noreferrer">Bootstrap dashboard templates</a> from Bootstrapdash.com</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
