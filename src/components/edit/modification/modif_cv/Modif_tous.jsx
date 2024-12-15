import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import Lien from '../../../../config';
import { Edit } from '@mui/icons-material';
import RecuperationCookie from "../../../cryptages/RécupérationCookie";
import {Grid,TextField, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';

export default function Modif_tous({ pers }) {
  const secretKey = 'your-secret-key';
  const id_G = parseInt(RecuperationCookie(secretKey, 'ID'));
  const [contrat, setContrat] = useState({});
  const [fonctionOptions, setFonctionOptions] = useState([]);
  const [fonctionOptions2, setFonctionOptions2] = useState([]);
  const [formValues, setFormValues] = useState({
    civilite: '',
    DN: '',
    cin: '',
    date_Cin: '',
    cp: '',
    nb_enf_fille: 0,
    nb_enf_garçon: 0,
    diplome: '',
    prenom: '',
    niveau_etude: '',
    adresse: '',
    ville: '',
    id_TC: '',
    id_Fon: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${Lien}/personnelles/${pers}`);
        setContrat(response.data);
        if (response.data) {
          setFormValues({
            civilite: response.data.civilite,
            DN: response.data.DN,
            cin: response.data.cin,
            date_Cin: response.data.date_Cin,
            cp: response.data.cp,
            nb_enf_fille: response.data.nb_enf_fille,
            nb_enf_garçon: response.data.nb_enf_garçon,
            diplome: response.data.diplome,
            prenom: response.data.prenom,
            niveau_etude: response.data.niveau_etude,
            adresse: response.data.adresse,
            ville: response.data.ville,
            id_TC: response.data.id_TC,
          });
        }
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
        const response = await axios.get(`${Lien}/typeC`);
        setFonctionOptions2(response.data);
      } catch (error) {
        console.error('Error fetching fonction options:', error);
      }
    };

    fetchData();
    fetchFonctionOptions();
    fetchFonctionOptions2();
  }, [pers]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const updatedData = { ...contrat, ...formValues };
    try {
      await axios.put(`${Lien}/personnelles/tous/${pers}`, updatedData);
      await axios.post(`${Lien}/gerer`, {
        id_P: contrat.id_P,
        action: 'Modification du presque tous les infos du personnelle',
        id_G,
      });
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été modifiées avec succès.',
      });
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
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSaveChanges}>
      <div className="row">
        <div className="form-group col-md-6">
          <TextField
            fullWidth
            type="text"
            label="Civilité"
            name="civilite"
            value={formValues.civilite}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group col-md-6">
          <TextField
            fullWidth
            type="date"
            label="Date de Naissance"
            name="DN"
            value={formValues.DN}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </div>
        <div className="form-group col-md-6">
          <TextField
            fullWidth
            type="text"
            label="CIN"
            name="cin"
            value={formValues.cin}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group col-md-6">
          <TextField
            fullWidth
            type="date"
            label="Date de délivrance du CIN"
            name="date_Cin"
            value={formValues.date_Cin}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
            required
          />
        </div>
        <div className="form-group col-md-6">
          <TextField
            fullWidth
            type="text"
            label="Code Postal"
            name="cp"
            value={formValues.cp}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group col-md-6">
          <TextField
            fullWidth
            type="number"
            label="Nombre d'enfants filles"
            name="nb_enf_fille"
            value={formValues.nb_enf_fille}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group col-md-6">
          <TextField
            fullWidth
            type="number"
            label="Nombre d'enfants garçons"
            name="nb_enf_garçon"
            value={formValues.nb_enf_garçon}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group col-md-6">
          <TextField
            fullWidth
            type="text"
            label="Diplôme"
            name="diplome"
            value={formValues.diplome}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group col-md-6">
          <TextField
            fullWidth
            type="text"
            label="Niveau d'Étude"
            name="niveau_etude"
            value={formValues.niveau_etude}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group col-md-6">
          <TextField
            fullWidth
            type="text"
            label="Adresse"
            name="adresse"
            value={formValues.adresse}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group col-md-6">
          <TextField
            fullWidth
            type="text"
            label="Ville"
            name="ville"
            value={formValues.ville}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group col-md-6">
          <FormControl fullWidth required>
            <InputLabel id="contrat-label">Type de contrat</InputLabel>
            <Select
              labelId="contrat-label"
              name="id_TC"
              value={formValues.id_TC}
              onChange={handleInputChange}
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
      </div>
    </form>
  );
}
