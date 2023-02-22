import { Controller, Post, Res, Body, HttpStatus, Get, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CommentsService } from './comments.service';
import CommentDTO from './dto/comment.dto';

@Controller('comments')
export class CommentsController {
    constructor (private readonly commentsService: CommentsService) {}
    
    @Post()
    @UseGuards(JwtAuthGuard)
    async create (@Res() res, @Body() commentDTO: CommentDTO, @Req() req) {
        const newComment = await this.commentsService.createComment(commentDTO, req.user)
        res.status(HttpStatus.CREATED).json({ newComment })
    }
    
    @Get('/:bid')
    async GetByBlogId (@Param('bid') bid: number, @Res() res) {
        const comments = await this.commentsService.getCommentsByBlogId(bid)
        res.status(HttpStatus.OK).json({ comments })
    }
}
