import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm'
import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Comment } from 'src/comments/comments.model'
import { User } from 'src/users/user.model'

@ObjectType()
@Entity()
export class Blog {
    @Field(type => Int)
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Field()
    @Column()
    title: string

    @Field()
    @Column()
    blog: string

    @Field()
    @CreateDateColumn()
    uploadedDate: Date
    
    @Field()
    @UpdateDateColumn()
    lastEdited: Date

    @Field(() => User)
    @ManyToOne(() => User, user => user.blogs, {
        onDelete: "CASCADE"
    })
    user: User

    @Field(() => [Comment], { nullable: true })
    @OneToMany(() => Comment, comment => comment.blog)
    comments: Comment[]
}