import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export default class SearchDTO {
    @Field(type => Int)
    id: number
    @Field()
    title: string
    @Field()
    blog: string
    @Field(type => Int)
    userId: number
    @Field()
    firstName: string
    @Field()
    lastName: string
}