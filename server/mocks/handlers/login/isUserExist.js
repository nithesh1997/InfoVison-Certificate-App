export function isUserExist(username, mockPayload) {
  const isUserAvailable = mockPayload.filter((payload) => {
    return payload.username === username;
  });

  if (isUserAvailable.length) {
    return;
  } else {
    return "Provided username is not available.";
  }
}
