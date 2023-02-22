import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/login.dto';
import { UserDTO } from './dto/user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Resolver()
export class AuthResolver {
    constructor (private readonly authService: AuthService) {}

    @Mutation(returns => String)
    @UseGuards(LocalAuthGuard)
    async login (@Args('loginDTO') loginDTO: LoginDTO, @Context() context) {
        const token = await this.authService.login(context.user)
        return token
    }
}