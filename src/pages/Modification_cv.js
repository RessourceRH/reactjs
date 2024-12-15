import React, { useState } from "react";

import { useParams } from "react-router-dom";
import Header from "../components/Header"
import M_cv from "../components/edit/modification/M_cv";


export default function Modification_cv() {
    const {id}=useParams();


    
   return(
    <div className="container-scroller">
<Header/>
<M_cv pers={id}/>
    </div>
   ) 
}