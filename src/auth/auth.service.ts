import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }
    async signup(dto: AuthDto) {
        const hash = await argon.hash(dto.password);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                hash: hash,
                firstName: 'John',
                lastName: 'Doe'
            }
        })
        delete user.hash;
        return user;
    }

    async signin(dto: AuthDto) {
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        });
        if (!user) {
            throw new ForbiddenException('User doesn not exists!')
        }
        const pwMatch = await argon.verify(user.hash, dto.password);
        if (!pwMatch) {
            throw new ForbiddenException('Wrong password!')
        }
        delete user.hash;
        return user;
    }
}
