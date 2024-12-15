import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { TextField, Button, Grid, CircularProgress, Box } from '@mui/material';
import { Edit } from '@mui/icons-material';
import RecuperationCookie from "../../../cryptages/RécupérationCookie";
import Lien from '../../../../config';

export default function Modif_Conjoint({ pers }) {
  const secretKey = 'your-secret-key';
  const id_G = parseInt(RecuperationCookie(secretKey, 'ID'));

  const [formValues, setFormValues] = useState({
    nom: '',
    profession: '',
    lieu_T: '',
    tel: '',
  });
  const [loading, setLoading] = useState(true);

  // URLs Constants
  const PERSONNEL_URL = `${Lien}/personnelles/${pers}`;
  const CONJOINT_URL = `${Lien}/conjoint`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const personnelResponse = await axios.get(PERSONNEL_URL);
        const personnelData = personnelResponse.data;

        if (personnelData.id_Conj) {
          const conjointResponse = await axios.get(`${CONJOINT_URL}/${personnelData.id_Conj}`);
          const conjointData = conjointResponse.data;

          setFormValues({
            nom: conjointData.nom || '',
            profession: conjointData.profession || '',
            lieu_T: conjointData.lieu_T || '',
            tel: conjointData.tel || '',
          });
        } else {
          setFormValues({
            nom: '',
            profession: '',
            lieu_T: '',
            tel: '',
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de récupérer les informations du conjoint.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [PERSONNEL_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation simple des champs requis
    const { nom, profession, lieu_T, tel } = formValues;
    if (!nom || !profession || !lieu_T || !tel) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs manquants',
        text: 'Veuillez remplir tous les champs requis.',
      });
      setLoading(false);
      return;
    }

    try {
      const personnelResponse = await axios.get(PERSONNEL_URL);
      const personnelData = personnelResponse.data;

      if (personnelData.id_Conj) {
        // Mise à jour des informations du conjoint existant
        await axios.put(`${CONJOINT_URL}/${personnelData.id_Conj}`, formValues);
      } else {
        // Création d'un nouveau conjoint et mise à jour du personnel
        const newConjointResponse = await axios.post(CONJOINT_URL, formValues);
        const newConjointId = newConjointResponse.data.id;

        await axios.put(PERSONNEL_URL, { id_Conj: newConjointId });
      }

      // Enregistrement de l'action de modification
      await axios.post(`${Lien}/gerer`, {
        id_P: personnelData.id_P,
        action: 'Modification des informations du conjoint',
        id_G,
      });

      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Les informations du conjoint ont été mises à jour avec succès.',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la mise à jour des informations.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <form onSubmit={handleSaveChanges}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Nom et Prénoms"
            name="nom"
            value={formValues.nom}
            onChange={handleInputChange}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Profession"
            name="profession"
            value={formValues.profession}
            onChange={handleInputChange}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Lieu de Travail"
            name="lieu_T"
            value={formValues.lieu_T}
            onChange={handleInputChange}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="N° Téléphone"
            name="tel"
            value={formValues.tel}
            onChange={handleInputChange}
            required
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            startIcon={<Edit />}
          >
            Enregistrer les modifications
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
