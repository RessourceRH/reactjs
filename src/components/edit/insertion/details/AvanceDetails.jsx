import React from "react";

const AvanceDetails = ({ avance, avance_initial, restes, Valeur_avance }) => {
    if (Valeur_avance === null) {
        console.log('Valeur_avance',Valeur_avance)
        return <p style={{color:'black'}}>Aucune avance existante</p>;
    }
    console.log('Valeur_avance',Valeur_avance)
    return (
        <div style={{color:'black'}}>
            <h5>Informations sur l'avance</h5>
            <p>Avance actuelle : {avance} ar</p>
            <p>Avance initiale : {avance_initial} ar</p>
            <p>Reste de l'avance : {restes} ar</p>
        </div>
    );
};

export default AvanceDetails;
