import React from 'react';
import CryptoJS from 'crypto-js';

export default function Crypto() {
  let encryptData = CryptoJS.AES.encrypt(
    'this is your text!!',
    'myKey'
  ).toString();
  let bytes = CryptoJS.AES.decrypt(encryptData, 'myKey');
  let decryptData = bytes.toString(CryptoJS.enc.Utf8);
  return (
    <>
      <p>Encrypted Text:</p>
      {encryptData}
      <p>Decrypted Text:</p>
      {decryptData}
    </>
  );
}