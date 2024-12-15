import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const StockageCookie = (username, secretKey, cookieName) => {
  const encryptedUsername = CryptoJS.AES.encrypt(username, secretKey).toString();
  //console.log('Setting cookie with encrypted username:', encryptedUsername);  // Log pour débogage
  Cookies.set(cookieName, encryptedUsername, { expires: 7 }); // Cookie expire dans 7 jours
};

export default StockageCookie;
