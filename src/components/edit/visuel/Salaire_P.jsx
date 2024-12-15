import React, { useEffect, useState } from "react";
import axios from "axios";
import Lien from "../../../config";
import I_salaire from "../insertion/I_salaire";
import A_salaire from "./Affichage/A_salaire";

export default function Salaire_P({ id }) {
  const [contrat, setContrat] = useState([]);
  const [message, setMessage] = useState('');

  const fetchData = async () => {
    try {
      if (!id.id_P) {
        setContrat([]);
        setMessage('');
      } else {
        const response = await axios.get(`${Lien}/versement/versement_personnel/${id.id_P}`);
        if (response.data.data && response.data.data.length === 0) {
          setContrat([]);
          setMessage('Aucun versement pour ce personnel');
        } else {
          setContrat(response.data);
          setMessage('');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage('Une erreur est survenue lors de la récupération des données.');
    }
  };

  useEffect(() => {
    if (id.id_P) {
      fetchData();
    }
  }, [id.id_P]);

  return (
    <div className="timeline">
      <div className="timeline-card timeline-card-success card shadow-sm">
        <div className="card-body">
          <div className="h5 mb-1">Ses versements <span className="text-muted h6"></span></div>
          <div className="text-muted text-small mb-2">2011 - 2013</div>
          {message ? (
            <div>
              <p>{message}</p>
            </div>
          ) : (
            <A_salaire data={contrat} />
          )}
        </div>
      </div>
    </div>
  );
}
