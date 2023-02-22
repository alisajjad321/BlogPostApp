import { UseGuards } from '@nestjs/common';
import { Args, Context, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Comment } from 'src/comments/comments.model';
import { CommentsService } from 'src/comments/comments.service';
import { SearchService } from 'src/search/search.service';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import { Blog } from './blog.model';
import { BlogsService } from './blogs.service';
import CreateBlogDTO from './dto/createBlog.dto';
import SearchDTO from './dto/search.dto';

@Resolver(of => Blog)
export class BlogsResolver {
    constructor (
        private readonly blogsService: BlogsService,
        private readonly usersService: UsersService,
        private readonly commentsService: CommentsService,
        private readonly searchService: SearchService
    ) {}

    @Query(returns => [SearchDTO])
    async searchBlogs (@Args('searchStr') searchStr: string) {
        const res = await this.searchService.search(searchStr)
        return res.results
    }

    @Query(returns => [Blog])
    async getBlogs () {
        return await this.blogsService.getAll()
    }
    
    @Query(returns => Blog)
    async getBlogById (@Args('bid', { type: () => Int }) bid: number) {
        return await this.blogsService.getBlogById(bid)
    }
    
    @Query(returns => [Blog])
    async getBlogByUserId (@Args('uid', { type: () => Int }) uid: number) {
        return await this.blogsService.getBlogsByUserId(uid)
    }
    
    @ResolveField(returns => User)
    async user (@Parent() blog: Blog) {
        return await this.usersService.getUserByBlog(blog.id)
    }
    
    @ResolveField(returns => [Comment])
    async comments (@Parent() blog: Blog) {
        return await this.commentsService.getCommentsByBlogId(blog.id)
    }
    
    @Mutation(returns => Blog)
    @UseGuards(JwtAuthGuard)
    async createBlog (@Args('createBlogDTO') createBlogDTO: CreateBlogDTO, @Context() context) {
        const newBlog = await this.blogsService.createBlog(createBlogDTO, context.req.user)
        newBlog.user = await this.usersService.getUserById(newBlog.user.id)
        const { id, title, blog, user } = newBlog
        await this.searchService.insertData({
            id,
            title,
            blog,
            userId: user.id,
            firstName: user.firstName,
            lastName: user.lastName
        })
        return newBlog
    }
    
    @Mutation(returns => Blog)
    @UseGuards(JwtAuthGuard)
    async updateBlog (@Args('bid', { type: () => Int }) bid: number, @Args('createBlogDTO') createBlogDTO: CreateBlogDTO, @Context() context) {
        const updatedBlog = await this.blogsService.updateBlog(bid, createBlogDTO, context.req.user)
        const { id, title, blog } = updatedBlog
        await this.searchService.updateData({
            id,
            title,
            blog
        })
        return updatedBlog
    }
    
    @Mutation(returns => String)
    @UseGuards(JwtAuthGuard)
    async deleteBlog (@Args('bid', { type: () => Int }) bid: number, @Context() context) {
        const res = await this.blogsService.deleteBlog(bid, context.req.user)
        await this.searchService.deleteData(bid)
        return res
    }
}
