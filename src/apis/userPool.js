import { CognitoUserPool, CookieStorage } from "amazon-cognito-identity-js";
import { config } from "../config";

export default new CognitoUserPool({
  Region: config.region,
  MandatorySignIn: config.mandatorySignIn,
  UserPoolId: config.userPoolId,
  ClientId: config.clientId,
  Storage: new CookieStorage({
    domain: config.domain,
    path: config.cookiePath,
    expires: config.cookieExpiration,
    secure: config.secure,
  }),
});
