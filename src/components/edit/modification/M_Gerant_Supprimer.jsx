import React, {  useState } from "react";

import axios from "axios";
import Swal from 'sweetalert2';
import {  Delete } from '@mui/icons-material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDeleteLeft } from "@fortawesome/free-solid-svg-icons";

import Lien from '../../../config';
import RecuperationCookie from "../../cryptages/RécupérationCookie";


export default function M_Gerant_Supprimer({pers,onrefresh}) {
  const [contrat, setContrat] = useState([]);
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;

  const handleDelete = async (id) => {
    // Afficher une boîte de dialogue de confirmation avec SweetAlert
    Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer ces données ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try { 
        await axios.post(`${Lien}/gerer`, {id_P:pers.id_G,action:`suppression du Gerant N°${pers.id_G}`,id_G});
          const response = await axios.delete(`${Lien}/conjoint/${pers.id_Conj}`);
          console.log('Réponse de la requête DELETE:', response.data);
          setContrat(prevContrat => prevContrat.filter(item => item.id !== id));
          // Afficher une alerte SweetAlert pour indiquer que la suppression a réussi
          Swal.fire({
            icon: 'success',
            title: 'Succès !',
            text: 'Les données ont été supprimées avec succès.',
          });
          onrefresh()
        } catch (error) {
          console.error('Erreur lors de la suppression des données:', error);
          // Afficher une alerte SweetAlert pour indiquer qu'il y a eu une erreur lors de la suppression
          Swal.fire({
            icon: 'error',
            title: 'Erreur !',
            text: 'Une erreur s\'est produite lors de la suppression des données.',
          });
        }
      }
    });
  };
   
  
    
  


  return (
    <div>
         <div className="row">
         
            <button className="btn btn-secondary col-md-12" onClick={() => handleDelete(pers.id_G)}>
              <FontAwesomeIcon icon={faDeleteLeft} />
            </button>
         </div>
               
            
     
           
          
    </div>
  );
}
