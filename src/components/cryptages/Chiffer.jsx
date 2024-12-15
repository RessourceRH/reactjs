import CryptoJS from 'crypto-js';

const Chiffer = (username, secretKey) => {
  // Créer un objet avec le nom d'utilisateur et le mot de passe

  
  // Convertir l'objet en chaîne JSON et le chiffrer avec AES
  const encryptedData = CryptoJS.AES.encrypt(username, secretKey).toString();
  
 // console.log('Encrypted Data:', encryptedData);  // Log pour débogage
  return encryptedData;
};

export default Chiffer;
