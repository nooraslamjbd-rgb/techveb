import { cookies } from "next/headers";

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getPasswordHash(): string {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) throw new Error("ADMIN_PASSWORD_HASH env var not set");
  return hash;
}

function getSessionSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET env var not set");
  return secret;
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyPassword(password: string): Promise<boolean> {
  const stored = getPasswordHash();
  const encoder = new TextEncoder();
  const parts = stored.split(":");
  if (parts.length === 2) {
    const [saltHex, hashHex] = parts;
    const salt = Uint8Array.from(saltHex.match(/.{2}/g)!.map((b) => parseInt(b, 16)));
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits"]
    );
    const derivedBits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      256
    );
    const derivedHex = Array.from(new Uint8Array(derivedBits))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return derivedHex === hashHex;
  }
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashHex = Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex === stored;
}

export async function setAdminSession(): Promise<void> {
  const store = await cookies();
  const tokenId = crypto.randomUUID();
  const secret = getSessionSecret();
  const signature = await hmacSign(tokenId, secret);
  const sessionToken = `${tokenId}.${signature}`;
  store.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    const [tokenId, signature] = token.split(".");
    if (!tokenId || !signature) return false;
    const secret = getSessionSecret();
    const expectedSignature = await hmacSign(tokenId, secret);
    return signature === expectedSignature;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const session = store.get(COOKIE_NAME);
  if (!session?.value) return false;
  return verifySessionToken(session.value);
}
