import axios from "axios";
import Lien from "../config";
import { useState, useEffect } from "react";
import StockageCookie from "../components/cryptages/StockageCookie";
import { useNavigate } from "react-router-dom";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login() {
  const [nom_U, setNom_U] = useState('');
  const [MDP, setMDP] = useState('');
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe
  const [res, setRes] = useState([]);
  const [error, setError] = useState('');
  const [entreprise, setEntreprise] = useState(null); // État pour stocker les données de l'entreprise
  const secretKey = 'your-secret-key';
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les informations de l'entreprise
    const fetchEntreprise = async () => {
      try {
        const response = await axios.get(`${Lien}/entreprise`);
        setEntreprise(response.data[0]);
        console.log(response.data[0])
      } catch (err) {
        console.error("Erreur lors de la récupération des données de l'entreprise", err);
      }
    };
    fetchEntreprise();
  }, []);

  const fetchData = async () => {
    try {
      const gerants = await axios.post(`${Lien}/gerant/login`, { nom_U, MDP });
      setRes(gerants.data);

      if (gerants.data && gerants.data.user ) {
        if(gerants.data.user.validation == 1){
          StockageCookie(`${gerants.data.user.nom_U}`, secretKey, 'usename');
          StockageCookie(`${gerants.data.user.id_G}`, secretKey, 'ID');
          StockageCookie(`${gerants.data.user.image}`, secretKey, 'image');
          navigate('/acceuil');
        }else{
          setError('  utilisateur non validé ou en attente de validation.');
        }
       
      } else {
        setError('Mot de passe incorrect ou utilisateur non trouvé ou  utilisateur non validé.');
      }
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la connexion. Veuillez réessayer.');
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword); // Fonction pour afficher/masquer le mot de passe

  return (
    <div className="container-scroller">
      <div className="container-fluid page-body-wrapper full-page-wrapper">
        <div className="content-wrapper d-flex align-items-center auth">
          <div className="row flex-grow">
            <div className="col-lg-4 mx-auto">
              <div className="auth-form-light text-left p-5">

                {/* Affichage du logo et nom de l'entreprise si disponible */}
                {entreprise && (
  <div className="d-flex align-items-center mb-4" style={{ justifyContent: 'flex-start' }}>
    {entreprise.image && (
      <img
        src={`${Lien}/${entreprise.image}`}
        alt="Logo de l'entreprise"
        style={{ width: '50px', height: 'auto', marginRight: '15px' }} // Ajout d'un marginRight pour espacer l'image du texte
      />
    )}
    <h4 style={{ color: 'black', margin: 0 }}>{entreprise.nom}</h4>
  </div>
)}


                <h4 style={{ color: 'black' }}>Bonjour ! Commencez ici</h4>
                <h6 className="font-weight-light" style={{ color: 'black' }}>Connectez-vous pour continuer.</h6>

                {error && <div className="alert alert-danger">{error}</div>}

                <form className="pt-3">
                  <div className="form-group">
                    <TextField
                      label="Nom d'utilisateur"
                      variant="outlined"
                      fullWidth
                      value={nom_U}
                      onChange={(e) => setNom_U(e.target.value)}
                      style={{ color: 'black' }}
                    />
                  </div>
                  <div className="form-group">
                    <TextField
                      label="Mot de passe"
                      variant="outlined"
                      fullWidth
                      type={showPassword ? 'text' : 'password'}
                      value={MDP}
                      onChange={(e) => setMDP(e.target.value)}
                      style={{ color: 'black' }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={handleClickShowPassword} edge="end">
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </div>
                </form>

                <div className="mt-3">
                  <button
                    className="btn btn-block btn-success btn-lg font-weight-medium auth-form-btn"
                    onClick={fetchData}
                    style={{ backgroundColor: 'green', color: 'white' }}
                  >
                    SE CONNECTER
                  </button>
                </div>
              </div>
              <div className="text-center mt-4 font-weight-light">
                <span style={{ color: 'black' }}>Vous n'avez pas de compte ? </span>
                <a href="/inscription" className="text-primary">Créer un compte</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
