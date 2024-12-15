import React, { useEffect, useState, startTransition } from "react";
import axios from "axios";
import { Modal } from '@mui/material';
import Swal from 'sweetalert2';
import { Visibility, Edit, Delete, PictureAsPdf } from '@mui/icons-material';


import 'datatables.net';
import { Link } from 'react-router-dom';
import Lien from '../../../config';

export default function M_personnelle({ pers }) {
  const [contrat, setContrat] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  const [Type_C, setType_C] = useState('');
  const [editData, setEditData] = useState(null);



  const fetchData = async () => {
    try {
      
      const response = await axios.get(`${Lien}/personnelles`);
      startTransition(() => {
        setContrat(response.data);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

 

  const handleEdit = (personne) => {
    setEditData(personne);
    setType_C(personne.Type_C);
   
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

 

  const handleDelete = async (id) => {
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
          const response = await axios.delete(`${Lien}/personnelles/${id}`);
          console.log('Réponse de la requête DELETE:', response.data);
          startTransition(() => {
            setContrat(prevContrat => prevContrat.filter(item => item.id !== id));
          });
          Swal.fire({
            icon: 'success',
            title: 'Succès !',
            text: 'Les données ont été supprimées avec succès.',
          });
        } catch (error) {
          console.error('Erreur lors de la suppression des données:', error);
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
        <Link to={`/apropos/${pers.row.id_P}`} className="btn btn-success col-md-6">
          <Edit />
        </Link>
        <button className="btn btn-secondary col-md-6" onClick={() => handleDelete(pers.row.id_P)}>
          <Delete />
        </button>
       
      </div>

    </div>
  );
}
