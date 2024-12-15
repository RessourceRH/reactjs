import { useState, useEffect } from "react";
import Lien from "../../../config";
import axios from "axios";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function I_inscription() {
  const [nom_complet, setNomComplet] = useState('');
  const [nom_U, setNomU] = useState('');
  const [email, setEmail] = useState('');
  const [MDP, setMDP] = useState('');
  const [CMDP, setCMDP] = useState('');
  const [adresse, setAdresse] = useState('');
  const [sexe, setSexe] = useState('');
  const [status, setStatus] = useState('en attente');
  const [validation, setValidation] = useState(0);
  const [id_T, setid_T] = useState(2);
  const [image, setImage] = useState(null);
  const [entreprise, setEntreprise] = useState(null); // Entreprise data
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchEntreprise = async () => {
      try {
        const response = await axios.get(`${Lien}/entreprise`);
        setEntreprise(response.data[0]);
      } catch (err) {
        console.error("Erreur lors de la récupération des informations de l'entreprise:", err);
      }
    };

    fetchEntreprise();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (MDP !== CMDP) {
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const checkUser = await axios.get(`${Lien}/gerant/nom_U/${nom_U}`);

      if (checkUser.data.exists) {
        setErrorMessage("Le nom d'utilisateur existe déjà.");
        return;
      }

      const formData = new FormData();
      formData.append('nom_complet', nom_complet);
      formData.append('nom_U', nom_U);
      formData.append('email', email);
      formData.append('sexe', sexe);
      formData.append('adresse', adresse);
      formData.append('MDP', MDP);
      formData.append('image', image);
      formData.append('status', status);
      formData.append('validation', validation);
      formData.append('id_T', id_T);

      await axios.post(`${Lien}/gerant`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSuccessMessage("Les données ont été insérées avec succès.");

      setNomComplet('');
      setNomU('');
      setEmail('');
      setMDP('');
      setCMDP('');
      setAdresse('');
      setSexe('');
      setImage(null);
      setErrorMessage('');
    } catch (err) {
      console.error(err);
      setErrorMessage("Une erreur s'est produite lors de l'insertion des données.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="row flex-grow">
      <div className="col-lg-4 mx-auto">
        <div className="auth-form-light text-left p-5">
          {entreprise && (
            <div className="d-flex align-items-center mb-4">
              {entreprise.image && (
                <img
                  src={`${Lien}/${entreprise.image}`}
                  alt="Logo de l'entreprise"
                  style={{ width: '50px', height: '50px', marginRight: '10px' }}
                />
              )}
              <h4 style={{ color: 'black' }}>{entreprise.nom}</h4>
            </div>
          )}

          <h4 style={{ color: 'black' }}>Vous êtes nouveau ici ?</h4>
          <h6 className="font-weight-light" style={{ color: 'black' }}>
            L'inscription est facile. Cela ne prend que quelques étapes.
          </h6>

          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          <form className="pt-3" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nom Complet"
              variant="outlined"
              value={nom_complet}
              onChange={(e) => setNomComplet(e.target.value)}
              required
              margin="normal"
            />
            <div className="row">
              <div className="form-group col-md-8">
                <TextField
                  fullWidth
                  label="Nom d'Utilisateur"
                  variant="outlined"
                  value={nom_U}
                  onChange={(e) => setNomU(e.target.value)}
                  required
                  margin="normal"
                />
              </div>
              <div className="form-group col-md-4">
                <TextField
                  fullWidth
                  select
                  label="Genre"
                  variant="outlined"
                  value={sexe}
                  onChange={(e) => setSexe(e.target.value)}
                  SelectProps={{
                    native: true,
                  }}
                  required
                  margin="normal"
                >
                  <option value="">Genre</option>
                  <option value="Féminin">Féminin</option>
                  <option value="Masculin">Masculin</option>
                  <option value="Autre">Autre</option>
                </TextField>
              </div>
            </div>

            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              label="Adresse"
              variant="outlined"
              value={adresse}
              onChange={(e) => setAdresse(e.target.value)}
              required
              margin="normal"
            />

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Mot de passe"
              variant="outlined"
              value={MDP}
              onChange={(e) => setMDP(e.target.value)}
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              label="Confirmer le Mot de passe"
              variant="outlined"
              value={CMDP}
              onChange={(e) => setCMDP(e.target.value)}
              required
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={togglePasswordVisibility}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type="file"
              variant="outlined"
              onChange={handleImageChange}
              required
              margin="normal"
            />

           
            <div className="mt-3">
              <button
                type="submit"
                className="btn btn-block btn-success btn-lg font-weight-medium auth-form-btn"
                style={{ backgroundColor: 'green', color: 'white' }}
              >
                S'INSCRIRE
              </button>
            </div>
            <div className="text-center mt-4 font-weight-light">
              <span style={{ color: 'black' }}>Vous avez déjà un compte ? </span>
              <a href="/" className="text-primary">Se connecter</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
