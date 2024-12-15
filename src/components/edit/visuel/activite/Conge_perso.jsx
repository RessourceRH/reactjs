import { useEffect } from "react";
import Lien from "../../../../config";
import axios from "axios";
import { useState } from "react";
import I_avoir_conge from "../../insertion/I_avoir_conge";
import Info_conge from "./info/Info_conge";

export default function Conge_perso({idP,conge}){
  
    
    return(
        <div className="timeline">
        <div className="timeline-card timeline-card-success card shadow-sm">
          <div className="card-body">
            <div className="h5 mb-1">Ses Congé(e)s<span className="text-muted h6"></span></div>
            <div className="text-muted text-small mb-2">2011 - 2013</div>
            
            <Info_conge info={conge}/>
          </div>
        </div>
      </div>
    )
}