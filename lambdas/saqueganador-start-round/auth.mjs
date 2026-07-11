// Cognito JWT verification for public Lambda Function URLs (AuthType: NONE).
//
// These functions are reachable by anyone on the internet, so the handler itself
// must authenticate the caller. We verify the RS256 signature of a Cognito access
// or id token against the User Pool's published JWKS, with no external npm
// dependency (uses node:crypto, available on the nodejs22.x runtime).
//
// Required environment variable: USER_POOL_ID (e.g. us-east-1_1zv8qzlMB).
// Optional: APP_CLIENT_ID to also pin the token's audience/client_id.
import crypto from 'node:crypto';

export class AuthError extends Error {
  constructor(message, statusCode = 401) {
    super(message);
    this.name = 'AuthError';
    this.statusCode = statusCode;
  }
}

const REGION = process.env.AWS_REGION || 'us-east-1';
const USER_POOL_ID = process.env.USER_POOL_ID;
const APP_CLIENT_ID = process.env.APP_CLIENT_ID; // optional
const issuer = () => `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;

const JWKS_TTL_MS = 60 * 60 * 1000;
let jwksCache = null;
let jwksAt = 0;

async function getSigningKey(kid) {
  const now = Date.now();
  if (!jwksCache || now - jwksAt > JWKS_TTL_MS) {
    const res = await fetch(`${issuer()}/.well-known/jwks.json`);
    if (!res.ok) throw new AuthError('Unable to fetch signing keys', 500);
    const body = await res.json();
    jwksCache = {};
    for (const k of body.keys) jwksCache[k.kid] = k;
    jwksAt = now;
  }
  return jwksCache[kid];
}

const decode = (segment) => {
  try {
    return JSON.parse(Buffer.from(segment, 'base64url').toString('utf8'));
  } catch {
    throw new AuthError('Malformed token', 401);
  }
};

export function getBearerToken(event) {
  const h = event.headers || {};
  const raw = h.authorization || h.Authorization;
  if (!raw) return null;
  const m = /^Bearer\s+(.+)$/i.exec(raw.trim());
  return m ? m[1] : raw.trim();
}

export async function verifyToken(token) {
  if (!USER_POOL_ID) throw new AuthError('Auth not configured (USER_POOL_ID missing)', 500);
  if (!token) throw new AuthError('Missing bearer token', 401);

  const parts = token.split('.');
  if (parts.length !== 3) throw new AuthError('Malformed token', 401);

  const header = decode(parts[0]);
  if (header.alg !== 'RS256') throw new AuthError('Unexpected token algorithm', 401);

  const jwk = await getSigningKey(header.kid);
  if (!jwk) throw new AuthError('Unknown signing key', 401);

  const pub = crypto.createPublicKey({ key: jwk, format: 'jwk' });
  const verified = crypto.verify(
    'RSA-SHA256',
    Buffer.from(`${parts[0]}.${parts[1]}`),
    pub,
    Buffer.from(parts[2], 'base64url'),
  );
  if (!verified) throw new AuthError('Invalid token signature', 401);

  const claims = decode(parts[1]);
  const now = Math.floor(Date.now() / 1000);
  if (!claims.exp || now >= claims.exp) throw new AuthError('Token expired', 401);
  if (claims.nbf && now < claims.nbf) throw new AuthError('Token not yet valid', 401);
  if (claims.iss !== issuer()) throw new AuthError('Invalid token issuer', 401);
  if (claims.token_use !== 'id' && claims.token_use !== 'access') {
    throw new AuthError('Invalid token use', 401);
  }
  if (APP_CLIENT_ID) {
    const aud = claims.aud || claims.client_id;
    if (aud !== APP_CLIENT_ID) throw new AuthError('Invalid token audience', 401);
  }
  return claims;
}

// Returns the authenticated caller's Cognito sub, or throws AuthError.
export async function requireUser(event) {
  const claims = await verifyToken(getBearerToken(event));
  return claims.sub;
}

// Returns the caller's sub if they are listed in the tournament admins, else throws.
export async function requireAdmin(event, admins) {
  const sub = await requireUser(event);
  if (!Array.isArray(admins) || !admins.includes(sub)) {
    throw new AuthError('Administrator privileges required', 403);
  }
  return sub;
}
