import { Body, Controller, Get, HttpStatus, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import CreateUserDTO from './dto/createUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor (private readonly userService: UsersService) {}

    @Post('/signup')
    @UsePipes(ValidationPipe)
    async signup (@Res() res, @Body() createUserDTO: CreateUserDTO) {
        const newUser = await this.userService.signup(createUserDTO)
        res.status(HttpStatus.CREATED).json({ newUser })
    }
}
