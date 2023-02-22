import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local'
import { AuthService } from "./auth.service";


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor (private readonly authService: AuthService) {
        super({
            usernameField: 'email'
        })
    }
    
    validate = async (email: string, password: string) => {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException("User not authorized. Incorrect email or password");
        }
        return user;
    }
}