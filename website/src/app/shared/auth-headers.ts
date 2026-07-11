import { HttpHeaders } from "@angular/common/http";
import { Auth } from "aws-amplify";

// Builds an Authorization header carrying the current Cognito ID token, for the
// backend Lambda Function URLs that now require an authenticated caller
// (team-save and the admin actions). Throws if there is no valid session.
export async function authHeaders(): Promise<HttpHeaders> {
  const session = await Auth.currentSession();
  const jwt = session.getIdToken().getJwtToken();
  return new HttpHeaders({ Authorization: `Bearer ${jwt}` });
}
