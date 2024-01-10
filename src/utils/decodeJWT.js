export default async function decodeJWT(jwtToken) {
  const parts = jwtToken.split(".");

  const headerBuffer = Buffer.from(parts[0], "base64");
  const payloadBuffer = Buffer.from(parts[1], "base64");
  const signatureBuffer = Buffer.from(parts[2], "base64");

  const header = JSON.parse(headerBuffer.toString());
  const payload = JSON.parse(payloadBuffer.toString());
  const signature = signatureBuffer.toString();

  const jwt = { header, payload, signature };

  return jwt;
}
