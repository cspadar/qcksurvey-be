import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private config: ConfigService
    ) { }

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
        return this.signToken(user.id, user.email);
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

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: string, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }

        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: this.config.get('JWT_SECRET')
        });

        return {
            access_token: token
        }
    }
}
