export const handleArrayBuffer = async (req) => {
  const payload = await req.arrayBuffer().then((buffer) => {
    const uint8Array = new Uint8Array(buffer);
    const string = decodeURI(String.fromCharCode.apply(null, uint8Array));

    return JSON.parse(string);
  });

  return payload;
};
