import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import Lien from '../../../../config';
import { Edit } from '@mui/icons-material';
import RecuperationCookie from "../../../cryptages/RécupérationCookie";
import { Grid, Button, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
export default function Modif_nom({ pers }) {
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const [contrat, setContrat] = useState({});
  const [nomInsertion, setNomInsertion] = useState('');
  const [prenom, setPrenom] = useState('');
  const [id_Fon, setIdFon] = useState(0);
  const [fonctionOptions, setFonctionOptions] = useState([]);
  const [editData, setEditData] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/personnelles/${pers}`);
      setContrat(response.data);
      setEditData(response.data);
      setNomInsertion(response.data.nom);
      setPrenom(response.data.prenom);
      setIdFon(response.data.id_Fon);
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

  useEffect(() => {
    fetchData();
    fetchFonctionOptions();
  }, [pers]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const updatedData = { ...editData, nom: nomInsertion, prenom, id_Fon };
    try {
      const response = await axios.put(`${Lien}/personnelles/nom/${pers}`, updatedData);
      const modif=await axios.post(`${Lien}/gerer`, {id_P:contrat.id_P,action:'Modification du nom du personnelle ',id_G});
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

  return (
    <div className="col-md-6">
      <form onSubmit={handleSaveChanges}>
        <div className="row">
        <div className="form-group col-md-6">
                <TextField
                  fullWidth
                  type="TEXT"
                  label="Nom"
                  value={nomInsertion}
                  onChange={(e) => setNomInsertion(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <TextField
                  fullWidth
                  type="TEXT"
                  label="Prénom"
                  value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
                />
              </div>
         
        </div>
        
        <div className="row">
        <div className="form-group col-md-12">
                <FormControl fullWidth required>
                  <InputLabel id="id_Fon-label">Nom du Fonction</InputLabel>
                  <Select
                    labelId="id_Fon-label"
                    value={id_Fon}
                    onChange={(e) => setIdFon(e.target.value)}
                    required
                  >
                    <MenuItem value="">
                      <em>Sélectionnez une fonction</em>
                    </MenuItem>
                    {fonctionOptions.map((option) => (
                      <MenuItem key={option.Id_Fon} value={option.Id_Fon}>
                        {option.nom_Fon}
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
    </div>
  );
}
