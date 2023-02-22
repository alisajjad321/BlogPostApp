import { Field, InputType } from "@nestjs/graphql"

@InputType()
export default class CreateBlogDTO {
    @Field()
    title: string
    @Field()
    blog: string
}