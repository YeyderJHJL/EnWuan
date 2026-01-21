import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    // DecodedIdToken has uid property
    if (user && user.uid) {
      return user.uid;
    }
    
    // Fallback if user not set
    return null;
  },
);
