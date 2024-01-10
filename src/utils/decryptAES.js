import CryptoJS from "crypto-js";

export default function decryptAES(cipherText) {
  const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
  const INITIAL_VECTOR = import.meta.env.VITE_INITIAL_VECTOR;

  const cipherParams = CryptoJS.lib.CipherParams.create({
    ciphertext: CryptoJS.enc.Base64.parse(cipherText),
  });

  const decrypted = CryptoJS.AES.decrypt(
    cipherParams,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv: CryptoJS.enc.Utf8.parse(INITIAL_VECTOR),
    },
  );

  const decipheredText = decrypted.toString(CryptoJS.enc.Utf8);

  return decipheredText;
}
