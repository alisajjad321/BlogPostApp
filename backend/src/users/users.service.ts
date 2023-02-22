import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { genSalt, hash } from 'bcrypt';
import { LessThan, Not, Repository } from 'typeorm'
import { v4 } from 'uuid';
import CreateUserDTO from './dto/createUser.dto';
import ResetPasswordDTO from './dto/resetPassword.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
    constructor (@InjectRepository(User) private readonly usersRepo: Repository<User>) {}
    
    async getAll (): Promise<User[]> {
        return await this.usersRepo.find()
    }
    
    async getUserByEmail (email: string): Promise<User> {
        return await this.usersRepo.findOne({
            where: {
                email
            }
        })
    }
    
    async getUserById (id: number): Promise<User> {
        return await this.usersRepo.findOneBy({ id })
    }
    
    async getUserByBlog (id: number): Promise<User> {
        return await this.usersRepo.findOneBy({ 
            blogs: {
                id
            }
        })
    }
    
    async getUserByComment (id: number): Promise<User> {
        return await this.usersRepo.findOneBy({ 
            comments: {
                id
            }
        })
    }
    
    async signup (createUserDTO: CreateUserDTO): Promise<User> {
        const user = await this.getUserByEmail(createUserDTO.email)
        if(user){
            throw new UnauthorizedException("Invalid email. User already exists")
        }
        
        const salt = await genSalt(12)
        const hashedPassword = await hash(createUserDTO.password, salt)

        const newUser = this.usersRepo.create({
            ...createUserDTO,
            password: hashedPassword
        })

        return await this.usersRepo.save(newUser)
    }
    
    async forgotPassword (email: string): Promise<boolean> {
        let user = await this.getUserByEmail(email)
        if(!user){
            throw new NotFoundException("Can not find this user")
        }

        const expTime = new Date()
        expTime.setDate(expTime.getDate() + 1)

        user.verificationCode = v4()
        user.verificationExpiry = expTime
        await this.usersRepo.save(user)

        return true
    }
    
    async resetPassword (resetPasswordDTO: ResetPasswordDTO): Promise<User> {
        const { verificationCode, password } = resetPasswordDTO
        let user = await this.usersRepo.findOne({
            where: {
                verificationCode,
                verificationExpiry: Not(LessThan(new Date()))
            }
        })
        if(!user){
            throw new UnauthorizedException("You are not authorized to perform this action")
        }

        const salt = await genSalt(12)
        const hashedPassword = await hash(password, salt)
        user.verificationCode = null
        user.verificationExpiry = null
        user.password = hashedPassword
        user = await this.usersRepo.save(user)

        return user
    }
}
