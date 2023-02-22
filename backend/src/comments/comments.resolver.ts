import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import { Comment } from './comments.model';
import { CommentsService } from './comments.service';
import CommentDTO from './dto/comment.dto';

@Resolver(of => Comment)
export class CommentsResolver {
    constructor (
        private readonly commentsService: CommentsService,
        private readonly usersService: UsersService
    ) {}

    @Query(returns => Comment)
    async getCommentById (@Args('cid', { type: () => Int }) cid: number) {
        return await this.commentsService.getCommentById(cid)
    }
    
    @ResolveField(returns => User)
    async user (@Parent() comment: Comment) {
        return await this.usersService.getUserByComment(comment.id)
    }
    
    @ResolveField(returns => Comment)
    async parent (@Parent() comment: Comment) {
        return await this.commentsService.getParentComment(comment.id)
    }
    
    @ResolveField(returns => [Comment])
    async children (@Parent() comment: Comment) {
        return await this.commentsService.getChildComments(comment.id)
    }
    
    @Mutation(returns => Comment)
    @UseGuards(JwtAuthGuard)
    async createComment (@Args('commentDTO') commentDTO: CommentDTO, @Context() context) {
        return await this.commentsService.createComment(commentDTO, context.req.user)
    }

    @Mutation(returns => Comment)
    @UseGuards(JwtAuthGuard)
    async updateComment (@Args('cid', { type: () => Int }) cid: number, @Args('comment') comment: string, @Context() context) {
        return await this.commentsService.updateComment(cid, comment, context.req.user)
    }
    
    @Mutation(returns => String)
    @UseGuards(JwtAuthGuard)
    async deleteComment (@Args('cid', { type: () => Int }) cid: number, @Context() context) {
        return await this.commentsService.deleteComment(cid, context.req.user)
    }
}
