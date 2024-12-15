import axios from "axios";
import RecuperationCookie from "../cryptages/RécupérationCookie";
import Nav from "../Nav";
import Lien from "../../config";
import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import Nom_G from "./visuel/Nom_G";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import D_gerant_Attente from "./D_gerant_Attente";
import D_gerant_valide from "./D_gerant_valide";
import D_gerant_annule from "./D_gerant_annule";

export default function D_Notif() {
    const secretKey = 'your-secret-key';
    const [filterData, setFilterData] = useState([]);
    const [gerant, setGerant] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [type, setType] = useState([]);
    const id = parseInt(RecuperationCookie(secretKey, 'ID'));
    const [showResponse1, setShowResponse1] = useState(false);
    const [showResponse2, setShowResponse2] = useState(false);
    const [showResponse3, setShowResponse3] = useState(false);

    // Fonction pour basculer l'état de l'affichage
    const toggleResponse1 = () => setShowResponse1(!showResponse1);
    const toggleResponse2 = () => setShowResponse2(!showResponse2);
  const toggleResponse3 = () => setShowResponse3(!showResponse3);

    const admin = async () => {
        const response = await axios.get(`${Lien}/gerant/${id}`);
        setAdmins(response.data);
        setType(response.data.type);
        console.log(response.data.type);
    };

    const Notif = async () => {
        try {
            const response = await axios.get(`${Lien}/gerer`);
            setGerant(response.data);
            setFilterData(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des notifications:", error);
        }
    };

    useEffect(() => {
        Notif();
        admin();
    }, []);

    const columns = [
        {
            name: 'ID',
            selector: (row) => row.id,
            sortable: true,
        },
        {
            name: 'Nom de l\'action',
            selector: (row) => row.action,
            sortable: true,
        },
        {
            name: 'N° du table modifié',
            selector: (row) => row.id_P,
            sortable: true,
        },
        {
            name: 'Nom du Gérant',
            selector: (row) => <Nom_G id={row.id_G} />,
            sortable: true,
        },
    ];

    return (
        <div className="container-fluid page-body-wrapper m-0 p-0">
            <Nav />
            <div className="main-panel">
            {type.nom === "admin" ? (
                 <div className="content-wrapper">
                 <div className="col-lg-12 grid-margin stretch-card">
                     <div className="card">
                         <div className="card-body">
                             <h4 className="card-title" style={{ color: 'black' }}>LES LISTES DES GERANTS</h4>
                             <div>
            {type.nom === "admin" ? (
                <div>
                  
                    
                    {/* Titre 1 avec basculement */}
                    <p className="titre-admin" onClick={toggleResponse1} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                       Liste des gérants en attente 
                        <FontAwesomeIcon icon={showResponse1 ? faChevronUp : faChevronDown} style={{ marginLeft: '10px' }} />
                    </p>
                    {showResponse1 && (
                        <p className="response-admin">
                            <D_gerant_Attente/>
                        </p>
                    )}
                    
                    {/* Titre 2 avec basculement */}
                    <p className="titre-admin" onClick={toggleResponse2} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                       Liste des gérants validés
                        <FontAwesomeIcon icon={showResponse2 ? faChevronUp : faChevronDown} style={{ marginLeft: '10px' }} />
                    </p>
                    {showResponse2 && (
                        <p className="response-admin">
                            
                            <D_gerant_valide/>
                        </p>
                    )}
                    <p className="titre-admin" onClick={toggleResponse3} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        Liste des gérants qui ont une valitation annulé
                        <FontAwesomeIcon icon={showResponse3 ? faChevronUp : faChevronDown} style={{ marginLeft: '10px' }} />
                    </p>
                    {showResponse3 && (
                        <p className="response-admin">
                            <D_gerant_annule/>
                        </p>
                    )}
                </div>
            ) : (
                <div>
                    {/* Contenu pour les utilisateurs normaux */}
                </div>
            )}
        </div>
                         </div>
                         <div>
        
     </div>
                         
                     </div>
                 </div>
                 <footer className="footer">
                     <div className="footer-inner-wrapper">
                        
                     </div>
                 </footer>
             </div>
            ) : (
                <div>
                    {/* Contenu pour les utilisateurs normaux */}
                </div>
            )}
                <div className="content-wrapper">
                    <div className="col-lg-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title" style={{ color: 'black' }}>LES NOTIFICATIONS</h4>
                                <DataTable
                                    columns={columns}
                                    data={gerant}
                                    noDataComponent={<div className="prev">Aucune donnée disponible</div>}
                                    pagination
                                />
                            </div>
             
                            
                        </div>
                    </div>
                    <footer className="footer">
                        <div className="footer-inner-wrapper">
                           
                        </div>
                    </footer>
                </div>
               
         
            </div>
        </div>
    );
}
