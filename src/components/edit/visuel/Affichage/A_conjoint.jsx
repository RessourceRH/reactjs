import axios from "axios";
import { useEffect, useState } from "react";
import Lien from "../../../../config";

export default function A_conjoint({data}){
    
    const [contrat, setContrat] = useState([]);
    const fetchData = async () => {
        try {
          const response = await axios.get(`${Lien}/conjoint/${data.id_Conj}`);
          setContrat(response.data);
        
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, []);
    return(
        <div>
           <div className="row">
            <div className="col-md-4">Nom: {contrat.nom}</div>
            <div className="col-md-8"></div>
        </div>
        <div className="row">
            <div className="col-md-4">Proffession: {contrat.profession}</div>
            <div className="col-md-8"></div>
        </div>
        <div className="row">
            <div className="col-md-4">Lieu de travail: {contrat.lieu_T}</div>
            <div className="col-md-8"></div>
        </div>
        <div className="row">
            <div className="col-md-4">N°: {contrat.tel}</div>
            <div className="col-md-8"></div>
        </div>
        </div>
    )
}