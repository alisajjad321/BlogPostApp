import { Field, InputType } from "@nestjs/graphql"

@InputType()
export default class CommentDTO {
    @Field()
    comment: string
    @Field()
    blogId: number
    @Field({ nullable: true })
    parentId: number
}