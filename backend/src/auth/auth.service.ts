import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { UserDTO } from './dto/user.dto';

@Injectable()
export class AuthService {
    constructor (private readonly usersService: UsersService, private readonly jwtService: JwtService) {}

    async validateUser (email: string, password: string): Promise<UserDTO> {
        const user = await this.usersService.getUserByEmail( email );
        if (!user){
            return null
        }

        const passwordValid = await compare(password, user.password)
        if (!passwordValid) {
            return null
        }
        
        return new UserDTO ({
            userId: user.id,
            email: user.email
        })
    }
    
    async login (user: UserDTO): Promise<string> {
        const payload = { email: user.email, userId: user.userId }
        return await this.jwtService.signAsync(payload)
    }
}
