import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class UserDTO{
    constructor (objDTO: UserDTO) {
        this.userId = objDTO.userId
        this.email = objDTO.email
    }

    @Field()
    userId: number

    @Field()
    email: string
}