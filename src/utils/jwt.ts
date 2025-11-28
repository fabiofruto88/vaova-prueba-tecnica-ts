import { TOKEN_EXPIRATION, TOKEN_SECRET } from "./constants";

export const generateToken = (userId: string, email: string): string => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      userId,
      email,
      iat: Date.now(),
      exp: Date.now() + TOKEN_EXPIRATION,
    })
  );
  const signature = btoa(`${header}.${payload}.${TOKEN_SECRET}`);
  return `${header}.${payload}.${signature}`;
};

export const generateRefreshToken = (): string => {
  return btoa(`${Date.now()}-${Math.random()}-${TOKEN_SECRET}`);
};
