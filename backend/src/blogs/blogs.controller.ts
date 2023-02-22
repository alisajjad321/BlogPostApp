import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BlogsService } from './blogs.service';
import CreateBlogDTO from './dto/createBlog.dto';

@Controller('blogs')
export class BlogsController {
    constructor (private readonly blogsService: BlogsService) {}

    @Get('/:bid')
    async getById (@Param('bid') bid: number, @Res() res) {
        const blog = await this.blogsService.getBlogById(bid)
        res.status(HttpStatus.OK).json(blog)
    }
    
    @Get('/user/:uid')
    async getByUserId (@Param('uid') uid: number, @Res() res) {
        const blogs = await this.blogsService.getBlogsByUserId(uid)
        res.status(HttpStatus.OK).json(blogs)
    }
    
    @Post()
    @UseGuards(JwtAuthGuard)
    async create (@Res() res, @Body() createBlogDTO: CreateBlogDTO, @Req() req) {
        const newBlog = await this.blogsService.createBlog(createBlogDTO, req.user)
        res.status(HttpStatus.CREATED).json(newBlog)
    }
    
    @Put('/:bid')
    @UseGuards(JwtAuthGuard)
    async update (@Param('bid') bid: number, @Res() res, @Body() createBlogDTO: CreateBlogDTO, @Req() req) {
        const updatedBlog = await this.blogsService.updateBlog(bid, createBlogDTO, req.user)
        res.status(HttpStatus.OK).json(updatedBlog)
    }
    
    @Delete('/:bid')
    @UseGuards(JwtAuthGuard)
    async delete (@Param('bid') bid: number, @Res() res, @Req() req) {
        await this.blogsService.deleteBlog(bid, req.user)
        res.status(HttpStatus.OK).json("Blog deleted")
    }
}
