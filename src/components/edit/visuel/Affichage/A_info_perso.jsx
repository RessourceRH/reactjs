import React from "react";

export default function A_info_perso({ data, contrat }) {
  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const calculateWorkDuration = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    
    const years = now.getFullYear() - start.getFullYear();
    const months = now.getMonth() - start.getMonth();
    const days = now.getDate() - start.getDate();

    let duration = "";

    if (years > 0) {
      duration += `${years} année${years > 1 ? 's' : ''}`;
    }

    if (months > 0) {
      if (duration) duration += ", ";
      duration += `${months} mois`;
    }

    if (days > 0) {
      if (duration) duration += " et ";
      duration += `${days} jour${days > 1 ? 's' : ''}`;
    }

    return duration;
  };

  const age = calculateAge(data.DN);
  const workDuration = calculateWorkDuration(data.date_DF);
  const hasChildren = (data.nb_enf_fille || 0) > 0 || (data.nb_enf_garçon || 0) > 0;
  const maritalStatus = data.id_Conj ? 'en couple' : 'célibataire';
  const childrenStatus = hasChildren ? 'et a des enfants' : 'et sans enfants';
  const contratInfo = contrat.id ? `un contrat ${contrat.nom}` : 'aucun contrat';

  return (
    <div className="about-section pt-4 px-3 px-lg-4 mt-1">
      <div className="row">
        <div className="col-md-12">
          <h2 className="h3 mb-3">À propos</h2>
          <p>
            Agé(e) de {age} ans, il (elle) a {data.diplome}, est {maritalStatus}, {childrenStatus}, ayant une nationalité {data.nationalite || ''},
            <br />
            il (elle) travaille depuis {workDuration}, et a {contratInfo}.
          </p>
        </div>
      </div>
    </div>
  );
}
