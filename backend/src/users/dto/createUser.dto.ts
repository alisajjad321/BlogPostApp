import { Field, InputType } from "@nestjs/graphql"
import { IsEmail, MinLength } from "class-validator"

@InputType()
export default class CreateUserDTO {
    @Field()
    firstName: string
    @Field()
    lastName: string
    @Field()
    @IsEmail()
    email: string
    @Field()
    @MinLength(6)
    password: string
}