import React, { useEffect, useState } from "react";

import axios from "axios";
import Lien from "../../../config";
import I_conjoint from "../insertion/I_conjoint";
import A_conjoint from "./Affichage/A_conjoint";
export default function Conjoint_P({id,onrefresh}){
    const [contrat, setContrat] = useState([]);
   
    const fetchData = async () => {
        try {
            if(id.id_Conj == null){
                setContrat([])
            }
            else{
                const response = await axios.get(`${Lien}/conjoint/${id.id_Conj}`);
                setContrat(response.data);
            }
         
        
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      useEffect(() => {
        fetchData();
      }, []);
    return(
        <div className="timeline">
        <div className="timeline-card timeline-card-primary card shadow-sm">
          <div className="card-body">
            <div className="h5 mb-1">Son Conjoint <span className="text-muted h6"></span></div>
            <div className="text-muted text-small mb-2">May, 2015 - Present</div>
            {id.id_Conj == null ?(
                <div>
                 
                <p>Aucun information</p>
                <I_conjoint idP={id.id_P} onrefresh={onrefresh}/>
               </div>
            ):(
               <A_conjoint data={id}/>
            )}
          
          </div>
        </div>
       
     
      </div>
    )
}