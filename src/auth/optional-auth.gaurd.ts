import { AuthGuard } from "@nestjs/passport";

export class OptionalAuthGuard extends AuthGuard('jwt') {
  handleRequest(error, user, info, context) {
    return user;
  }
}