import React, { useEffect, useState } from "react";
import { Modal, Box, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import axios from "axios";
import Lien from "../../../config";
import Perso from "../visuel/Perso";
import Swal from 'sweetalert2';
import I_versement from "./I_versement";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronDown,faChevronUp} from '@fortawesome/free-solid-svg-icons';
import AvanceDetails from "./details/AvanceDetails"; // Import the new component
import RecuperationCookie from "../../cryptages/RécupérationCookie";
export default function I_vers_avance({ onrefresh }) {
    const secretKey = 'your-secret-key';
    const id_G =parseInt(RecuperationCookie(secretKey,'ID')) ;
    const [showModal, setShowModal] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const [personnelles, setPersonnelles] = useState([]);
    const [nom_personnelles, setnom_Personnelles] = useState({});
    const [id_P, setIdP] = useState('');
    const [id_Sa, setIdSa] = useState(0);
    const [montant_indemnite, setmontant_indemnite] = useState(0);
    const [montant_promotion, setmontant_promotion] = useState(0);
    const [indemnite, setIndemnite] = useState([]);
    const [promotion, setpromotion] = useState([]);
    const [avance, setavance] = useState(0);
    const [tous, setTous] = useState(0);
    const [avance_initial, setavance_initial] = useState(0);
    const [id_Fon, setid_Fon] = useState(0);
    const [montant_Ver, setMontantVer] = useState(0);
    const [mois_avance, setmois_avance] = useState(0);
    const [restes, setreste] = useState(0);
    const [date_Ver, setDateVer] = useState('');
    const [fonction, setfonction] = useState({});
    const [salaire, setsalaire] = useState({});
    const [V_salaire, setv_salaire] = useState(0);
    const [pourcentage_remboursement, setpourcentage_remboursement] = useState(0);
    const [remboursement, setremboursement] = useState(0);
    const [Valeur_avance, setValeur_Avance] = useState(null);
    const [nb_mois_avance, setnb_mois_avance] = useState(0);
    const [showAvanceDetails, setShowAvanceDetails] = useState(false);
    let valeur_total = 0;
    const handleClose = () => {
        setShowModal(false);
        setIdP('');
    }

    const handleShow = () => setShowModal(true);

    const handleClose2 = () => {
        setShowModal2(false);
        resetForm();
    }

    const resetForm = () => {
        setDateVer('');
        setMontantVer(0);
        setIdP('');
        setv_salaire(0);
        setremboursement(0);
        setavance(0);
        setmois_avance(0);
        setIdSa(0);
        setreste(0);
        setpourcentage_remboursement(0);
    };

    useEffect(() => {
        if (id_P) {
            setValeur_Avance(null)
            fetchData(id_P);
        }
    }, [id_P]);

    const fetchData = async (id) => {
        try {
            const [personnelResponse, versementResponse,indemniteResponse,promotionResponse] = await Promise.all([
                axios.get(`${Lien}/personnelles/${id}`),
                axios.get(`${Lien}/versement/personnelle/${id}`),
                axios.get(`${Lien}/indemnite/year/${id}`),
                axios.get(`${Lien}/avoir_promo/year/${id}`),
            ]);

            const personnelData = personnelResponse.data;
            const versementData = versementResponse.data;
            const indemniteData = indemniteResponse.data;
            const promo_avoirData = promotionResponse.data;
            console.log('indemnite',indemniteData,'promo',promo_avoirData)
            setnom_Personnelles(personnelData);
            
            if(promo_avoirData){
              setpromotion(promo_avoirData)
              console.log('promotion',promo_avoirData)
            }
           
            setIndemnite(indemniteData)
            if (versementData) {
                const salaireResponse = await axios.get(`${Lien}/salaire/${versementData.id_Sa}`);
                const fonctionResponse = await axios.get(`${Lien}/fonction/${salaireResponse.data.id_Fon}`);

                setValeur_Avance(versementData);
                console.log('Valeur_avance',Valeur_avance)
                setid_Fon(versementData.id_Fon);
                setIdSa(versementData.id_Sa);
                setavance(versementData.avance);
                setnb_mois_avance(versementData.nb_mois_avance);
                setv_salaire(salaireResponse.data.vraiSalaire);
                setsalaire(salaireResponse.data);
                setfonction(fonctionResponse.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleShow2 = () => {
        setShowModal2(true);
        setShowModal(false);
    };

    const handlePersonnelChange = (e) => {
        setIdP(e.target.value);
    };


    useEffect(() => {
      // Calculer le montant total des augmentations
      let total = 0;
      if (Array.isArray(promotion) && promotion.length > 0) {
        total = promotion.reduce((acc, promo) => {
          const Montant = promo.promotion?.Augmentation || 0;
          return acc + Montant;
        }, 0);
      }
  
      // Mettre à jour l'état avec la valeur totale
      setmontant_promotion(total);
    }, [promotion]);
    
    useEffect(() => {
      // Calculer le montant total des indemnités
      let total = 0;
      if (Array.isArray(indemnite) && indemnite.length > 0) {
        total = indemnite.reduce((acc, item) => {
          const Montant = item.montant || 0;
          return acc + Montant;
        }, 0);
      }
  
      // Mettre à jour l'état avec la valeur totale
      setmontant_indemnite(total);
    }, [indemnite]);

    const tout=()=>{
         const money=montant_indemnite+montant_promotion;
         setTous(money)
    }
    const rembourser = (pourcentage, montant) => {
        const argent = ((pourcentage * montant) / 100).toFixed(2);
        setremboursement(argent);
    }

    const reste = (remboursement, montant) => {
        const argent = montant - remboursement;
        setreste(argent);
    }

    const avance_init = (montant) => {
        const argent = montant * nb_mois_avance;
        setavance_initial(argent);
    }

    const montant_versement = () => {
        const argent = V_salaire - remboursement +tous;
        setMontantVer(argent);
    }

    useEffect(() => {
        avance_init(V_salaire);
    }, [V_salaire, nb_mois_avance]);

    useEffect(() => {
        reste(remboursement, avance);
    }, [remboursement, avance]);

    useEffect(() => {
        rembourser(pourcentage_remboursement, avance);
    }, [pourcentage_remboursement]);

    useEffect(() => {
      tout()
        montant_versement();
    }, [remboursement]);

    const Personnelles = async () => {
        try {
            const response = await axios.get(`${Lien}/personnelles`);
            setPersonnelles(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        Personnelles();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const insert = await axios.post(`${Lien}/versement`, { montant_Ver, date_Ver, id_P, id_Sa, avance: restes, nb_mois_avance: nb_mois_avance, remboursement });
            console.log('Réponse de la requête POST:', insert.data);
            const modif=await axios.post(`${Lien}/gerer`, {id_P:insert.data.Id_Ver,action:'Insertion du nouveau versement avec remboursement ',id_G});
            onrefresh();
            resetForm();
            handleClose2();
            Swal.fire({
                icon: 'success',
                title: 'Succès !',
                text: 'Les données ont été insérées avec succès.',
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: 'error',
                title: 'Erreur !',
                text: 'Une erreur s\'est produite lors de l\'insertion des données.',
            });
        }
    };

    const handlePourcentageChange = (e) => {
        const value = Math.min(100, Math.max(0, e.target.value));
        setpourcentage_remboursement(value);
    }

    const toggleAvanceDetails = () => {
        setValeur_Avance(null)
        fetchData(id_P)
        setShowAvanceDetails(!showAvanceDetails);
        
    }

    return (
        <div>
            <button className="btn btn-outline-primary btn-icon-text" onClick={handleShow}>
                Ajouter un Nouveau Versement
            </button>
            <Modal open={showModal} onClose={handleClose} className="modal-container">
            <Box
          className="modal-content"
          sx={{
            width: '80%',
            maxHeight: '90vh', // Constrain height to make scrollable
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
            position: 'relative', // Allow absolute positioning of close button
            overflowY: 'auto', // Enable vertical scroll inside modal content
          }}
        >
          <div className="modal-header">
          
          <Typography
            variant="h6"
            style={{
              color: '#33c92d',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize:'15px'
            }}
          >
          SELECTION DU NOM DU PERSONNEL
          </Typography>
          <Button onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
                    <div className="modal-body">
        
                        <form >
                        <div className="form-group col-md-12">
                <FormControl fullWidth required>
                  <InputLabel id="id_P">Nom du personnel:</InputLabel>
                  <Select
                    labelId="sexe-label"
                    id="id_P"
                    value={id_P}
                    onChange={(e)=>setIdP(e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Sélectionnez un employé</em>
                    </MenuItem>
                    {personnelles.map((option) => (
                      <MenuItem key={option.id_P} value={option.id_P}>
                       <Perso id={option.id_P} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
                            {/* <div className="form-group">
                                <label htmlFor="id_P">Nom du personnel:</label>
                                <select
                                    className="form-control"
                                    id="id_P"
                                    value={id_P}
                                    onChange={(e)=>setIdP(e.target.value)}
                                    
                                >
                                    <option value="">Sélectionnez un employé</option>
                                    {personnelles.map((personnel) => (
                                        <option key={personnel.id_P} value={personnel.id_P}>
                                            <Perso id={personnel.id_P} />
                                        </option>
                                    ))}
                                </select>
                            </div> */}
                        </form>
                        <span  onClick={toggleAvanceDetails} style={{color:'black'}}>
    {showAvanceDetails ? 'Masquer' : 'Afficher'} les infos sur l'avance
    <FontAwesomeIcon 
        icon={showAvanceDetails ? faChevronUp : faChevronDown} 
        className="menu-arrow custom-icon-size col-md-2" 
    />
</span>

                        {showAvanceDetails && (
                            <AvanceDetails 
                                avance={avance} 
                                avance_initial={avance_initial} 
                                restes={restes} 
                                Valeur_avance={Valeur_avance} 
                            />
                        )}
                    </div>
                  
                    
                       {(Valeur_avance === null || avance == 0)?(
                       <div className="modal-footer ">
                        <I_versement onRefresh={onrefresh} idP={id_P} idSa={id_Sa} Click={handleClose} promotion={promotion} indemnite={indemnite}  tous={tous}/>
                       <button type="button" className="btn btn-secondary btn-icon-text" onClick={handleClose}  style={{ backgroundColor: '#6c757d', color: '#fff' }}>
                Fermer
              </button>
              </div>
                       ):(
                        
                        <div className="modal-footer ">
                        <button className="btn btn-success" onClick={handleShow2}>
                                Nouveau(- avance) 
                            </button>
                            <button type="button" className="btn btn-secondary " onClick={handleClose}  style={{ backgroundColor: '#6c757d', color: '#fff', marginRight: '10px' }}>
                Fermer
              </button>
                        </div>
                       )}
                        

                        
                       
                           
                        
                    
                </Box>
            </Modal>

            <Modal open={showModal2} onClose={handleClose2} className="modal-container">
            <Box
          className="modal-content"
          sx={{
            width: '80%',
            maxHeight: '90vh', // Constrain height to make scrollable
            bgcolor: 'white',
            boxShadow: 24,
            p: 4,
            position: 'relative', // Allow absolute positioning of close button
            overflowY: 'auto', // Enable vertical scroll inside modal content
          }}
        >
          <div className="modal-header">
          
          <Typography
            variant="h6"
            style={{
              color: '#33c92d',
              textAlign: 'center',
              fontWeight: 'bold',
              fontSize:'15px'
            }}
          >
            INSERTION DU NOUVEAU PERSONNELLE
          </Typography>
          <Button onClick={handleClose2} sx={{ position: 'absolute', right: 8, top: 8 }}>×</Button>
          </div>
        
          
                    <div className="modal-body">
                
                        <form onSubmit={handleSubmit}>
                        <div className="form-group ">
                <TextField
                  fullWidth
                  type="text"
                  label="Nom et prénoms:"
                  id="nom_personnelles"
                  value={`${nom_personnelles.nom} ${nom_personnelles.prenom}`}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
              <div style={{ color: 'Black', textAlign: 'center' }}>
      {/* Handling Indemnity Display */}
      {Array.isArray(indemnite) && indemnite.length > 0 ? (
        indemnite.map((item, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <div className="col-sm-6" style={{ marginRight: '10px' }}>
              <TextField
                label="Type d'indemnité"
                value={item.type || ''}
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
            <div className="col-sm-6">
              <TextField
                label="Montant"
                value={item.montant || ''}
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
            </div>
          </div>
        ))
      ) : indemnite.message ? (
        <div>{indemnite.message}</div>
      ) : (
        <div>Aucune indemnité disponible</div>
      )}

      {/* Handling Promotion Display */}
       
{Array.isArray(promotion) && promotion.length > 0 ? (
  <>
    {promotion.map((promo, index) => {
      const Qualite = promo.promotion?.Type || 'N/A';  // Valeur par défaut "N/A" si Qualite est undefined
      const Montant = promo.promotion?.Montant || 0;  // Valeur par défaut 0 si Augmentation est undefined
      
      valeur_total += Montant; // Incrémenter la valeur totale

      console.log(Qualite, Montant, valeur_total); // Afficher les détails de chaque promotion dans la console

      return (
        <div key={index} style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div className="col-sm-6" style={{ marginRight: '10px' }}>
            <TextField
              label="Type de promotion"
              value={Qualite}
              variant="outlined"
              fullWidth
              type="text"
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
         
          <div className="col-sm-6">
            <TextField
              label="Montant"
              type="number"
              value={Montant}
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        </div>
      );
    })}

    {/* Afficher la valeur totale après la boucle */}
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <strong>Montant total des augmentations : {valeur_total}</strong>
    </div>
  </>
) : promotion.message ? (
  <div>{promotion.message}</div>
) : (
  <div style={{padding:'3%',marginBottom:'5%'}}>Aucune promotion disponible pour cette année</div>
)}




    </div>
            
            
                            <div className="form-group row">
                            <div className="form-group col-sm-6 ">
                <TextField
                  fullWidth
                  type="text"
                  label="Nom du salaire"
                  id="fonction"
                value={`salaire du ${fonction.nom_Fon}`}
                readOnly
                />
              </div>
              <div className="form-group col-sm-6 ">
                <TextField
                  fullWidth
                  type="date"
                  label="Date de versement"
                  id="date_Ver"
                  InputLabelProps={{ shrink: true }}
                 value={date_Ver}
                onChange={(e) => setDateVer(e.target.value)}
                required
                />
              </div>
                            </div>
                            
                            <div className="form-group row">
                            <div className="form-group col-sm-4 ">
                <TextField
                  fullWidth
                  type="text"
                  label="Avance initiale"
                  id="avance_initial"
                  value={`${avance_initial} ar`}
                  readOnly
                />
              </div>
              <div className="form-group col-sm-4 ">
                <TextField
                  fullWidth
                  type="text"
                  label="Avance actuelle"
                  id="avance"
                 value={`${avance} ar`}
                readOnly
                />
              </div>
              <div className="form-group col-sm-4 ">
                <TextField
                  fullWidth
                  type="text"
                  label="Restes en ar"
                  id="restes"
                  value={restes}
                  readOnly
                />
              </div>
                               
                              
                            </div>
                            <div className="form-group row">
                            <div className="form-group col-sm-6">
                <TextField
                  fullWidth
                  type="number"
                  label="Le pourcentage de remboursement"
                  id="pourcentage_remboursement"
                value={pourcentage_remboursement}
                onChange={handlePourcentageChange}
                required
                />
              </div>
              <div className="form-group col-sm-6">
                <TextField
                  fullWidth
                  type="text"
                  label="Le montant de remboursement"
                  
                  id="remboursement"
                  value={remboursement}
                  readOnly
                />
              </div>
                                
                                
                            </div>
                            <div className="form-group ">
                <TextField
                  fullWidth
                  type="text"
                  label="Montant total de versement"
                  
                  id="montant_Ver"
                  value={montant_Ver}
                  readOnly
                />
              </div>
                            
                            <div className="modal-footer">
                               <button type="button" className="btn btn-secondary" onClick={handleClose2} style={{ backgroundColor: '#6c757d', color: '#fff', marginRight: '10px' }}>Fermer</button>
                               <button type="submit" className="btn btn-success" style={{ backgroundColor: '#28a745', color: '#fff' }}>Sauvegarder</button>
                            </div>
                        </form>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
