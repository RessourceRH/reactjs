import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { Edit } from '@mui/icons-material';
import Lien from '../../../../config';

export default function ImageUpdateGerant({ id }) {
  const [image, setImage] = useState(null);
  const [contrat, setContrat] = useState({});
  const fileInputRef = useRef(null);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/gerant/${id}`);
      setContrat(response.data);
      setImage(response.data.image);
      console.log(response.data.image);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);

    try {
      await axios.put(`${Lien}/gerant/image/${contrat.id_G}`, formData, {
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
            width={'150px'} 
            height={'200px'} 
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
          
        </form>
        <div className="col-md-3 mb-8" style={{display:'inline-block'}}>
            <button onClick={handleSaveChanges} className="btn btn-warning" style={{border:'rgb(40, 167, 6)',backgroundColor:'rgb(40, 167, 6)'}}>
              <Edit />
            </button>
          </div>
      </div>
    </div>
  );
}
