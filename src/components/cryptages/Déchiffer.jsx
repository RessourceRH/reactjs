import CryptoJS from 'crypto-js';

const Décrypter = (encryptedData, secretKey) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedData) {
     // console.error('Decryption failed: Decrypted data is empty.');
      return null;
    }

   // console.log('Decrypted Data (raw):', decryptedData);  // Log pour voir les données brutes déchiffrées

    const parsedData = JSON.parse(decryptedData);
    //console.log('Parsed Data:', parsedData);  // Log pour voir les données parsées
    
    return parsedData;
  } catch (error) {
    console.error('Error during decryption or parsing:', error.message);
    return null;
  }
};

export default Décrypter;
