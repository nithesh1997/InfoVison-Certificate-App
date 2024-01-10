import decodeJWT from "./decodeJWT";

const MAGIC_WORD = "UserDetails";

export default async function whoAmI(TOKEN) {
  const { payload } = await decodeJWT(TOKEN);

  const roles =
    payload[MAGIC_WORD].authorities?.map(({ authority }) => authority) ?? [];

  return {
    id: payload[MAGIC_WORD]?.id ?? null,
    isAuthenticated: true,
    userDisplayName: payload[MAGIC_WORD]?.displayname ?? "Unknown",
    username: payload[MAGIC_WORD]?.username ?? "unknown",
    email: payload[MAGIC_WORD]?.email ?? "unknown",
    role: roles.includes("ROLE_ADMIN") ? "Administrator" : "User",
    preferences: {
      isSuper: roles.includes("ROLE_ADMIN"),
      issuedAt: payload.iat ?? Date.now() / 1000,
      expirationTime: payload.exp ?? Date.now() / 1000 + 7200,
    },
  };
}
