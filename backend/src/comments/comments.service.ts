import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import LoggedinUser from 'src/blogs/dto/loggedinUser.dto';
import { IsNull, Repository } from 'typeorm'
import { Comment } from './comments.model';
import CommentDTO from './dto/comment.dto';

@Injectable()
export class CommentsService {
    constructor (@InjectRepository(Comment) private commentsRepo: Repository<Comment>) {}

    async getCommentById (id: number): Promise<Comment> {
        return await this.commentsRepo.findOneBy({ id })
    }
    
    async getCommentsByBlogId (id: number): Promise<Comment[]> {
        return await this.commentsRepo.find({
            where: {
                blog: {
                    id
                }
            }
        })
    }

    async getParentComment (id: number): Promise<Comment> {
        return await this.commentsRepo.findOne({
            where: {
                children: {
                    id
                }
            }
        })
    }
    
    async getChildComments (id: number): Promise<Comment[]> {
        return await this.commentsRepo.find({
            where: {
                parent: {
                    id
                }
            }
        })
    }

    async createComment (commentDTO: CommentDTO, user: LoggedinUser): Promise<Comment> {
        const { comment, blogId, parentId } = commentDTO
        let newComment = this.commentsRepo.create({
            comment,
            blog: {
                id: blogId
            },
            user: {
                id: user.userId
            }
        })
        if(parentId){
            newComment.parent = new Comment()
            newComment.parent.id = parentId
        }

        return await this.commentsRepo.save(newComment)
    }

    async updateComment (id: number, comment: string, user: LoggedinUser): Promise<Comment> {
        const identifiedComment = await this.commentsRepo.findOne({
            where: {
                id
            },
            loadRelationIds: {
                relations: ['user'],
                disableMixedMap: true
            }
        })

        if(!identifiedComment){
            throw new NotFoundException("Can not find this comment")
        }
        
        if(identifiedComment.user.id !== user.userId){
            throw new UnauthorizedException("You are not authorized to delete this comment")
        }

        identifiedComment.comment = comment
        return await this.commentsRepo.save(identifiedComment)
    }
    
    async deleteComment (id: number, user: LoggedinUser): Promise<string> {
        const identifiedComment = await this.commentsRepo.findOne({
            where: {
                id
            },
            loadRelationIds: {
                relations: ['user'],
                disableMixedMap: true
            }
        })

        if(!identifiedComment){
            throw new NotFoundException("Can not find this comment")
        }
        
        if(identifiedComment.user.id !== user.userId){
            throw new UnauthorizedException("You are not authorized to delete this comment")
        }

        const delRec = await this.commentsRepo.delete(id)
        if(!delRec) {
            throw new InternalServerErrorException()
        }
        return "deleted"
    }
}
