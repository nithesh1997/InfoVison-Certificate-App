export const payload = {
  success: {
    id: "6596b1c53fd4895f70478c82",
    type: "Windows CA",
    host: "https://192.168.120.80:8445",
    caName: "WindowsCertificateAuthority",
    username: "Administrator",
    password: "pXZaBiw22oGd347K4KHutw==",
    domain: "invisinet.local",
    workstation: null,
  },
  failure: {
    limitReached: {
      timestamp: "2024-01-07T02:40:55.820+00:00",
      message: "Reached maximum limit of CertificateConfig rows",
      status: 400,
      error: "Bad Request",
      path: "/certmgtmongodb/certificateconfig",
    },
  },
};
