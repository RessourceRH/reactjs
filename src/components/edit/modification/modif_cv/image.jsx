import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { Edit } from '@mui/icons-material';
import Lien from '../../../../config';
import {Grid,Button } from '@mui/material';
export default function ImageUpdate({ pers }) {
  const [image, setImage] = useState(null);
  const [contrat, setContrat] = useState({});
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/personnelles/${pers}`);
      setContrat(response.data);
      setImage(response.data.image);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pers]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);

    try {
      await axios.put(`${Lien}/personnelles/image/${contrat.id_P}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'L\'image a été modifiée avec succès.',
      });
     
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'image:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur !',
        text: 'Une erreur s\'est produite lors de la modification de l\'image.',
      });
    }
  };

  return (
    <div className="image_modif col-md-6">
      <div className="img">
        <form className="row" onSubmit={handleSaveChanges}>
          <img 
            src={`${Lien}/${image}`} 
            alt="image" 
            width={'100px'} 
            height={'150px'} 
            style={{ backgroundColor: 'grey',borderRadius:'10%', padding: '1%', marginLeft: '1%', borderRadius: '10%', }} 
            className="col-md-6"
            onClick={() => fileInputRef.current.click()} // Trigger file input click on image click
          />
          <div className="form-group col-md-3">
            <div className="input-group" style={{display:'none'}}>
              <label className="input-group-text" htmlFor="image">
                Image
              </label>
              <input
                type="file"
                className="form-control"
                id="image"
                ref={fileInputRef} // Reference to the file input
                onChange={(e) => setImage(e.target.files[0])}
                required
                style={{ display: 'none' }} // Hide the file input
              />
            </div>
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
        </form>
      </div>
    </div>
  );
}
