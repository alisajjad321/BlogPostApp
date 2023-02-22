import { Field, InputType } from "@nestjs/graphql";

@InputType()
export default class ResetPasswordDTO {
    @Field()
    password: string
    @Field()
    verificationCode: string
}