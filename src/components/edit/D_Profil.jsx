import { TextField, Typography } from '@mui/material';
import Nav from '../Nav';
import { useState, useEffect } from 'react';
import Lien from '../../config';
import RecuperationCookie from '../cryptages/RécupérationCookie';
import axios from 'axios';
import ImageUpdateGerant from './modification/modif_Gerant/image_gerant';

export default function D_Profil() {
  const secretKey = 'your-secret-key';
  const [gerant, setGerant] = useState({
    nom_complet: '',
    nom_U: '',
    email: '',
    image: '',
  });
  const [feedbackMessage, setFeedbackMessage] = useState(null); // State for storing messages with type
  const id = parseInt(RecuperationCookie(secretKey, 'ID'), 10);

  const Gerant = async () => {
    try {
      const response = await axios.get(`${Lien}/gerant/${id}`);
      setGerant(response.data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      setFeedbackMessage({ type: 'error', message: "Erreur lors de la récupération des données de profil." });
    }
  };

  useEffect(() => {
    Gerant();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGerant((prevGerant) => ({
      ...prevGerant,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFeedbackMessage(null); // Clear any previous message
      const res = await axios.put(`${Lien}/gerant/${id}`, gerant);
      if (res.status === 200) {
        setFeedbackMessage({ type: 'success', message: 'Modification avec succès' });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response && error.response.data.message) {
        setFeedbackMessage({ type: 'error', message: `Erreur: ${error.response.data.message}` });
      } else {
        setFeedbackMessage({ type: 'error', message: `Erreur: ${error.message}` });
      }
    }
  };

  return (
    <div className="container-fluid page-body-wrapper m-0 p-0">
      <Nav />
      <div className="main-panel">
        <div className="content-wrapper">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title" style={{ color: 'black' }}>VOTRE PROFIL</h4>
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                  <div className="row">
                    <div className="col-md-4">
                    {/* <img
  src={`${Lien}/${gerant.image}`}
  alt="Profile"
  style={{
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: 'none',
  }}
/> */}
<ImageUpdateGerant id={id}/>



                      
                    </div>
                    <div className="col-md-8">
                      {feedbackMessage && (
                        <Typography 
                          variant="body2" 
                          style={{ 
                            marginTop: '10px', 
                            color: feedbackMessage.type === 'success' ? 'green' : 'red' 
                          }}
                        >
                          {feedbackMessage.message}
                        </Typography>
                      )}
                      <TextField
                        label="Nom et Prénoms"
                        name="nom_complet"
                        value={gerant.nom_complet}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Nom d'utilisateur"
                        name="nom_U"
                        value={gerant.nom_U}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      />
                      <TextField
                        label="Email"
                        name="email"
                        value={gerant.email}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                      />
                      <button 
                        type="submit" 
                        className="btn btn-success" 
                        style={{ backgroundColor: '#28a745', color: '#fff' }}>
                        Modifier
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <footer className="footer">
            <div className="footer-inner-wraper">
              <div className="d-sm-flex justify-content-center justify-content-sm-between">
                <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">
                  Copyright © bootstrapdash.com 2020
                </span>
                <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center">
                  Free <a href="https://www.bootstrapdash.com/" target="_blank" rel="noopener noreferrer">Bootstrap dashboard templates</a> from Bootstrapdash.com
                </span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
