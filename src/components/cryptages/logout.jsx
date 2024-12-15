import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const Logout = (cookieName1, cookieName2,cookieName3) => {
  const navigate = useNavigate(); // Moved useNavigate hook here

  // Function to handle logout
  const handleLogout = () => {
    // Supprimer les cookies
    Cookies.remove(cookieName1);
    Cookies.remove(cookieName2);
    Cookies.remove(cookieName3);
    // Rediriger l'utilisateur vers la page de connexion
    navigate('/');

    // Désactiver la navigation vers les pages précédentes
    window.history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  };

  return { handleLogout };
};

export default Logout;
