import React, { useEffect } from 'react';
import '../../../../css/A_plus_info_perso.css';

export default function A_plus_info_perso({ data, contrat,onrefresh }) {
  const formatDateToText = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('fr-FR', { month: 'long' });
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };
  useEffect(()=>{
    onrefresh()
  })
  
  return (
    <div className="timeline">
      <div className="timeline-card timeline-card-primary card shadow-sm">
        <div className="card-body">
          <div className="h5 mb-1">Information Personnelle<span className="text-muted h6"></span></div>
          <div className="text-muted text-small mb-2">
            {data.id_TC == null || data.id_TC == 0 ? 'Aucun contrat' : `Contrat ${contrat.abreviation}`}
          </div>
          <div className="tous-contenu row">
            <div className="contenu col-md-6">
              <span className="titre-info">Carte d'Identité Nationale (CIN)</span>
              <p className="contenu-perso"><span>N° CIN:</span> {data.cin}</p>
              <p className="contenu-perso"><span>Date de Délivrance:</span> {formatDateToText(data.date_Cin)}</p>
            </div>
            <div className="contenu col-md-6">
              <span className="titre-info">Contacts</span>
              <p className="contenu-perso"><span>Téléphone:</span> {data.tel}</p>
              <p className="contenu-perso"><span>Email:</span> {data.email}</p>
            </div>
            <div className="contenu col-md-6">
              <span className="titre-info">Adresse</span>
              <p className="contenu-perso"><span>CP:</span> {data.cp}</p>
              <p className="contenu-perso"><span>Adresse:</span> {data.adresse}</p>
              <p className="contenu-perso"><span>Ville:</span> {data.ville}</p>
            </div>
            <div className="contenu col-md-6">
              <span className="titre-info">Études</span>
              <p className="contenu-perso"><span>Niveau:</span> {data.niveau_etude}</p>
              <p className="contenu-perso"><span>Diplômes:</span> {data.diplome}</p>
            </div>
            <div className="contenu col-md-6">
              <span className="titre-info">Nationalité(s)</span>
              <p className="contenu-perso"><span>Civilité:</span> {data.civilite}</p>
              <p className="contenu-perso"><span>Nationalité:</span> {data.nationalite}</p>
            </div>
            <div className="contenu col-md-6">
              <span className="titre-info">Naissance</span>
              <p className="contenu-perso"><span>Date de Naissance:</span> {data.DN}</p>
              <p className="contenu-perso"><span>Lieu de Naissance:</span> {data.lieu}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
