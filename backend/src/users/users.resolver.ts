import { BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import CreateUserDTO from './dto/createUser.dto';
import ResetPasswordDTO from './dto/resetPassword.dto';
import { User } from './user.model';
import { UsersService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
    constructor (private readonly usersService: UsersService) {}

    @Query(returns => [User])
    async getAllUsers () {
        return await this.usersService.getAll()
    }
    
    @Query(returns => User)
    async getUserById (@Args('uid', { type: () => Int }) uid: number) {
        return await this.usersService.getUserById(uid)
    }

    @Mutation(returns =>  User)
    @UsePipes(ValidationPipe)
    async signup (@Args('createUserDTO') createUserDTO: CreateUserDTO){
        return await this.usersService.signup(createUserDTO)
    }
    
    @Mutation(returns =>  String)
    async forgotPassword (@Args('email') email: string){
        const isSuccessfull = await this.usersService.forgotPassword(email)
        if(!isSuccessfull){
            throw new BadRequestException("Process failed")
        }

        return "A verification email has been sent. Kindly confirm."
    }
    
    @Mutation(returns =>  User)
    async resetPassword (@Args('resetPasswordDTO') resetPasswordDTO: ResetPasswordDTO){
        const user = await this.usersService.resetPassword(resetPasswordDTO)
        if(!user){
            throw new BadRequestException("Process failed")
        }

        return user
    }
}