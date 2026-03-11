import { AuthService } from "@tt/data-access";
import { canActivateAuth } from "./lib/auth/access.guard";
import { authTokenInterceptor } from "./lib/auth/auth.interceptor";

export * from './lib/feature-login'

export {
  canActivateAuth,
  authTokenInterceptor,
  AuthService
}
