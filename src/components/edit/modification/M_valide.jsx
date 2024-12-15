import React from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import Lien from '../../../config';
import RecuperationCookie from "../../cryptages/RécupérationCookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons"; // Importer l'icône faCheck sans cercle

export default function M_valide({ pers, onrefresh }) {
  const secretKey = 'your-secret-key';
  const id_G = parseInt(RecuperationCookie(secretKey, 'ID'));
  const status = 'validé';
  const validation = true;

  const handleSaveChanges = async () => {
    try {
      // Mettre à jour les données avec le statut validé
      const updatedData = { validation, status };
      await axios.put(`${Lien}/gerant/action/${pers.id_G}`, updatedData);

      // Enregistrer l'action de validation
      await axios.post(`${Lien}/gerer`, { id_P: pers.id_G, action: `Validation du Gérant N° ${pers.id_G}`, id_G });

      // Afficher une alerte de succès
      Swal.fire({
        icon: 'success',
        title: 'Succès !',
        text: 'Les données ont été modifiées avec succès.',
      });

      // Rafraîchir les données après la mise à jour
      onrefresh();
    } catch (error) {
      console.error('Erreur lors de la mise à jour des données:', error);

      // Afficher une alerte d'erreur
      Swal.fire({
        icon: 'error',
        title: 'Erreur !',
        text: 'Une erreur s\'est produite lors de la modification des données.',
      });
    }
  };

  return (
    <button className="btn btn-primary" onClick={handleSaveChanges}>
      <FontAwesomeIcon icon={faCheck} /> {/* Icône de validation sans cercle */}
    </button>
  );
}
