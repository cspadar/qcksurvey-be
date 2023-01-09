import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Prisma } from '@prisma/client';

// TODO: Try to make data typesafety... keyof Prisma.User ???

export const User = createParamDecorator(
    (data: "id" | "email", ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = request.user;
        return data ? user[data] : user;
    },
);