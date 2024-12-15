import Cookies from 'js-cookie';
import CryptoJS from 'crypto-js';

const RecuperationCookie = (secretKey, cookieName) => {
  const encryptedUsername = Cookies.get(cookieName);
 // console.log('encryptedUsername',encryptedUsername)
  if (!encryptedUsername) {
    console.error('No encrypted username found in cookie.');
    return null;
  }

  const bytes = CryptoJS.AES.decrypt(encryptedUsername, secretKey);
  const decryptedUsername = bytes.toString(CryptoJS.enc.Utf8);

  if (!decryptedUsername) {
    console.error('Decryption failed: Decrypted username is empty.');
    return null;
  }

 // console.log('Decrypted Username:', decryptedUsername);  // Log pour débogage
  return decryptedUsername;
};

export default RecuperationCookie;
