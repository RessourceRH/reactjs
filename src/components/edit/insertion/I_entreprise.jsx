import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import Lien from '../../../config';


export default function I_entreprise({onrefresh}) {
  const [companyInfo, setCompanyInfo] = useState({
    nom: '',
    addresse: '',
    cp: '',
    ville: '',
    date_creation: '',
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo({
      ...companyInfo,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('image', image);
    Object.keys(companyInfo).forEach((key) => {
      formData.append(key, companyInfo[key]);
    });

    try {
      const response = await axios.post(`${Lien}/entreprise`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        onrefresh()
        alert('Company information added successfully!');
        
       
      }
    } catch (error) {
      console.error('Error adding company information:', error);
      alert('Error adding company information. Please try again.');
    }
  };

  return (
  
          <Container>
            <Typography variant="h4" style={{ color: 'black', marginBottom: '20px' }}>
             Insertion des informations du nouveau companie
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Nom de l'entreprise"
                name="nom"
                value={companyInfo.nom}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Addresse"
                name="addresse"
                value={companyInfo.addresse}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Code Postal"
                name="cp"
                value={companyInfo.cp}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Ville"
                name="ville"
                value={companyInfo.ville}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Date de création"
                type='date'
                name="date_creation"
                value={companyInfo.date_creation}
                onChange={handleChange}
               
                
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                margin="normal"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                style={{ margin: '20px 0' }}
              />
              <Button type="submit" variant="contained" color="primary">
                Sauvegarder
              </Button>
            </form>
          </Container>
      
  );
}
