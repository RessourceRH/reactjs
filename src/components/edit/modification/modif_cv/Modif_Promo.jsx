import React, { useEffect, useState } from "react";

import axios from "axios";
import { Modal } from '@mui/material';
import Swal from 'sweetalert2';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import DataTable from 'react-data-table-component';
import $ from 'jquery';
import 'datatables.net';
import Lien from "../../../../config";
import RecuperationCookie from "../../../cryptages/RécupérationCookie";



export default function Modif_Promo({pers}) {
  const secretKey = 'your-secret-key';
  const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
  const [contrat, setContrat] = useState([]);
  const [promo, setPromo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [id_Pro, setid_Pro] = useState('');
  const [date_pro, setdate_pro] = useState('');
  const [Type_C, setType_C] = useState('');
  const [editData, setEditData] = useState(null);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  
  

  const fetchData = async () => {
    try {
      const response = await axios.get(`${Lien}/promotion`);
      setPromo(response.data);
     
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  console.log(pers)
 
  const handleEdit = (personne) => {
    setEditData(personne);
    setid_Pro(personne.id_Pro)
    setdate_pro(personne.date_pro);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

 
  
  

  const handleSaveChanges = async () => {
    const updatedData = { ...editData, id_Pro,date_pro };
    try {
        console.log('editData',editData.id_A)
      const response = await axios.put(`${Lien}/avoir_promo/${editData.id_A}`, updatedData);
      console.log('Réponse de la requête PUT:', response.data);
      const modif=await axios.post(`${Lien}/gerer`, {id_P:response.data.id_P,action:'Modification du promotion que les personnes ont eu ',id_G});
      handleCloseModal();
      // Afficher une alerte SweetAlert pour indiquer que la modification a réussi
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été modifiées avec succès.',
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error);
      // Afficher une alerte SweetAlert pour indiquer qu'il y a eu une erreur lors de la modification
      Swal.fire({
        icon: 'error',
        title: 'Erreur !',
        text: 'Une erreur s\'est produite lors de la modification des données.',
      });
    }
  };

 
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
          const response = await axios.delete(`${Lien}/avoir_promo/${id}`);
          console.log('Réponse de la requête DELETE:', response.data);
          setContrat(prevContrat => prevContrat.filter(item => item.id !== id));
          // Afficher une alerte SweetAlert pour indiquer que la suppression a réussi
          Swal.fire({
            icon: 'success',
            title: 'Succès !',
            text: 'Les données ont été supprimées avec succès.',
          });
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
         <button className="btn btn-success col-md-6" onClick={() => handleEdit(pers)}>
              <Edit />
            </button>
            <button className="btn btn-secondary col-md-6" onClick={() => handleDelete(pers.id_A)}>
              <Delete />
            </button>
         </div>
               
                {editData && (
                  <Modal open={true} onClose={handleCloseModal} className="modal-container">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Modifier le contrat</h5>
                        <button type="button" className="close" onClick={handleCloseModal}>
                          <span aria-hidden="true">&times;</span>
                        </button>
                      </div>
                      <form >
                      <div className="modal-body">
              <div className="form-group">
                <label htmlFor="Id_Dir">Type de Promotion:</label>
                <select
                  className="form-control"
                  id="Id_Dir"
                  value={id_Pro}
                  onChange={(e) => setid_Pro(e.target.value)}
                  required
                >
                  <option value="">Sélectionnez une promotion</option>
                  {promo.map(direction => (
                    <option key={direction.id_Pro} value={direction.id_Pro}>
                      {direction.Qualite}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="date_pro">Date de promotion:</label>
                <input
                  type="date"
                  className="form-control"
                  id="date_pro"
                  value={date_pro}
                  onChange={(e) => setdate_pro(e.target.value)}
                  required
                />
              </div>
            </div>
                      </form>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                          Fermer
                        </button>
                        <button type="button" className="btn btn-primary" onClick={handleSaveChanges}>
                          Sauvegarder
                        </button>
                      </div>
                    </div>
                  </Modal>
                )}

     
           
          
    </div>
  );
}
