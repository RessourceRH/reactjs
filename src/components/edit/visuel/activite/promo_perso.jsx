import { useEffect } from "react";
import Lien from "../../../../config";
import axios from "axios";
import { useState } from "react";
import I_avoir_promo from "../../insertion/I_avoir_promo";
import Info_promo from "./info/Info_promo";
export default function Promo_perso({idP,promo}){
    //console.log('idP2',idP.id_P)
    const id=idP.id_P;
   
    return(
        <div className="timeline">
      <div className="timeline-card timeline-card-success card shadow-sm">
        <div className="card-body">
          <div className="h5 mb-1">Ses Promotions<span className="text-muted h6"></span></div>
          <div className="text-muted text-small mb-2">2011 - 2013</div>
          
            <Info_promo info={promo}/>
        </div>
      </div>
    </div>
    )

}