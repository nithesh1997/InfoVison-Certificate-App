import CryptoJS from "crypto-js";

export default function encryptAES(decipherText) {
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
  const INITIAL_VECTOR = import.meta.env.VITE_INITIAL_VECTOR;

  const encrypted = CryptoJS.AES.encrypt(
    decipherText,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv: CryptoJS.enc.Utf8.parse(INITIAL_VECTOR),
    },
  );

  const cipherText = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

  return cipherText;
}
