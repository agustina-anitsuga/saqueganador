import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUserSession,
  ISignUpResult,
} from 'amazon-cognito-identity-js';
import { cognitoConfig } from '@/config/env';
import { cognitoStorage } from '@/config/cognitoStorage';

// Pure-JS Cognito auth (amazon-cognito-identity-js) so it runs in Expo Go.
// Uses the same user pool + SRP flow as the website. No native modules.
const userPool = new CognitoUserPool({
  UserPoolId: cognitoConfig.userPoolId,
  ClientId: cognitoConfig.userPoolClientId,
  Storage: cognitoStorage as never,
});

function newCognitoUser(username: string): CognitoUser {
  return new CognitoUser({ Username: username, Pool: userPool, Storage: cognitoStorage as never });
}

export interface AuthUser {
  username: string;
  userId: string;
  sub: string;
  preferredUsername: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, username: string, password: string) => Promise<boolean>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Extract identity claims from the ID token so we can match whatever id the
// teams/ranking backend uses.
function identityFromSession(session: CognitoUserSession, fallback: string): AuthUser {
  try {
    const payload = session.getIdToken().decodePayload() as Record<string, unknown>;
    const username = (payload['cognito:username'] as string) || fallback;
    return {
      username,
      userId: username,
      sub: (payload['sub'] as string) || '',
      preferredUsername: (payload['preferred_username'] as string) || '',
    };
  } catch {
    return { username: fallback, userId: fallback, sub: '', preferredUsername: '' };
  }
}

function currentSession(): Promise<AuthUser | null> {
  return new Promise((resolve) => {
    const cu = userPool.getCurrentUser();
    if (!cu) {
      resolve(null);
      return;
    }
    cu.getSession((err: Error | null, session: CognitoUserSession | null) => {
      if (err || !session || !session.isValid()) {
        resolve(null);
      } else {
        resolve(identityFromSession(session, cu.getUsername()));
      }
    });
  });
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const s = await currentSession();
    setUser(s);
    setLoading(false);
  }, []);

  useEffect(() => {
    (async () => {
      await cognitoStorage.hydrate();
      await refresh();
    })();
  }, [refresh]);

  const signIn = useCallback(
    (email: string, password: string) =>
      new Promise<void>((resolve, reject) => {
        const cu = newCognitoUser(email);
        const details = new AuthenticationDetails({ Username: email, Password: password });
        cu.authenticateUser(details, {
          onSuccess: (session) => {
            setUser(identityFromSession(session, cu.getUsername()));
            setLoading(false);
            resolve();
          },
          onFailure: (err) => reject(err),
        });
      }),
    [],
  );

  const signUp = useCallback(
    (email: string, username: string, password: string) =>
      new Promise<boolean>((resolve, reject) => {
        const attributes = [
          new CognitoUserAttribute({ Name: 'email', Value: email }),
          new CognitoUserAttribute({ Name: 'preferred_username', Value: username }),
        ];
        userPool.signUp(email, password, attributes, [], (err, result?: ISignUpResult) => {
          if (err) reject(err);
          else resolve(!!result?.userConfirmed);
        });
      }),
    [],
  );

  const confirmSignUp = useCallback(
    (email: string, code: string) =>
      new Promise<void>((resolve, reject) => {
        const cu = newCognitoUser(email);
        cu.confirmRegistration(code, true, (err) => {
          if (err) reject(err);
          else resolve();
        });
      }),
    [],
  );

  const signOut = useCallback(async () => {
    const cu = userPool.getCurrentUser();
    if (cu) cu.signOut();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, refresh, signIn, signUp, confirmSignUp, signOut }),
    [user, loading, refresh, signIn, signUp, confirmSignUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
