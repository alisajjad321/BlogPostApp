import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm'
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Blog } from 'src/blogs/blog.model'
import { User } from 'src/users/user.model'

@ObjectType()
@Entity()
export class Comment {
    @Field(type => Int)
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Field()
    @Column()
    comment: string

    @Field()
    @CreateDateColumn()
    uploadedDate: Date
    
    @Field()
    @UpdateDateColumn()
    lastEdited: Date

    @Field(() => Blog)
    @ManyToOne(() => Blog, blog => blog.comments, {
        onDelete: "CASCADE"
    })
    blog: Blog
    
    @Field(() => User)
    @ManyToOne(() => User, user => user.comments, {
        onDelete: "CASCADE"
    })
    user: User
    
    @Field(() => Comment, { nullable: true })
    @ManyToOne(() => Comment, comment => comment.children, {
        onDelete: "CASCADE"
    })
    parent: Comment
    
    @Field(() => [Comment], { nullable: true })
    @OneToMany(() => Comment, comment => comment.parent)
    children: Comment[]
}