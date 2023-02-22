import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { secret } from './constants'
import { JwtStrategy } from './jwt.strategy';
import { AuthResolver } from './auth.resolver';

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret,
            signOptions: {
                expiresIn: '1h'
            }
        })
    ],
    providers: [AuthService, LocalStrategy, JwtStrategy, AuthResolver]
})
export class AuthModule {}
