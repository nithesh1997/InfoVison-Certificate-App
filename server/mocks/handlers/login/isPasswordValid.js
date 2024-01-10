export function isPasswordValid(username, password, mockPayload) {
  const [profile] = mockPayload.filter(
    (payload) => payload.username === username,
  );

  if (profile && profile.password === password) {
    return;
  } else {
    return "Username or Password is Incorrect. Please Verify the Credentials and Try Again.";
  }
}
