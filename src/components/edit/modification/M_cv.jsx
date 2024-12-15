import React, { useEffect, useState } from "react";

import axios from "axios";
import { Modal } from '@mui/material';
import Swal from 'sweetalert2';
import { Visibility, Edit, Delete } from '@mui/icons-material';
import DataTable from 'react-data-table-component';
import $ from 'jquery';
import 'datatables.net';



import Lien from '../../../config';
import Nav from "../../Nav";
import Image from "./modif_cv/image";
import Modif_tous from "./modif_cv/Modif_tous";
import Modif_Conjoint from "./modif_cv/Modif_Conjoint";
import Modif_nom from "./modif_cv/Modif_nom";


export default function M_cv({pers}) {

  return (
    <div>
        
        <div >
      <div className="container-fluid page-body-wrapper m-0 p-0">
        <Nav />
        <div className="main-panel">
          <div className="content-wrapper">
          <div className="col-lg-12 grid-margin stretch-card" >
            <div className="card">
              <div className="card-body">
                <h4 className="card-title" style={{color:'#33c92d',textAlign:'center'}}>MODIFIER LES INFORMATIONS DU PERSONNELLES</h4>
                <div className="row">
                <Image pers={pers} className='col-md-8' />
                <Modif_nom pers={pers} className='col-md-4' />
                </div>
             
             <p className="card-description bg-secondary text-white" style={{margin:'2%',padding:'1%'}}>INFORMATION PERSONNELLES</p>
             <Modif_tous pers={pers}  />
             <p className="card-description bg-secondary text-white" style={{margin:'2%',padding:'1%'}}>INFORMATION DE SON CONJOINT</p>
             <Modif_Conjoint pers={pers}  />
     
              
              </div>
            </div>
          </div>
          <footer className="footer">
            <div className="footer-inner-wraper">
              <div className="d-sm-flex justify-content-center justify-content-sm-between">
                <span className="text-muted d-block text-center text-sm-left d-sm-inline-block">Copyright © bootstrapdash.com 2020</span>
                <span className="float-none float-sm-right d-block mt-1 mt-sm-0 text-center"> Free <a href="https://www.bootstrapdash.com/" target="_blank">Bootstrap dashboard templates</a> from Bootstrapdash.com</span>
              </div>
            </div>
          </footer>
          </div>
         
        </div>
      </div>
    </div>
     
           
          
    </div>
  );
}
