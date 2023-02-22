import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Blog } from 'src/blogs/blog.model'
import { Comment } from 'src/comments/comments.model'

@ObjectType()
@Entity()
export class User {
    @Field(type => Int)
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Field()
    @Column()
    firstName: string

    @Field()
    @Column()
    lastName: string

    @Field()
    @Column()
    email: string

    @Column()
    password: string

    @Field(() => [Blog], { nullable: true })
    @OneToMany(() => Blog, blog => blog.user)
    blogs: Blog[]
    
    @Field(() => [Comment], { nullable: true })
    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[]
    
    @Column({nullable: true})
    verificationCode: string
    
    @Column({nullable: true})
    verificationExpiry: Date
}