import { Injectable, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import CreateBlogDTO from './dto/createBlog.dto';
import { InjectRepository } from '@nestjs/typeorm'
import { Blog } from './blog.model';
import { And, Like, Repository } from 'typeorm'
import LoggedinUser from './dto/loggedinUser.dto';

@Injectable()
export class BlogsService {
    constructor(@InjectRepository(Blog) private blogsRepo: Repository<Blog>) {}
    
    async searchBlogs (searchStr: string): Promise<Blog[]> {
        const strArr = searchStr.trim().split(" ")
        const blogs = await this.blogsRepo.find({
            where: [
                { title: Like(`%${searchStr}%`) },
                { blog: Like(`%${searchStr}%`) },
                strArr[1] ?
                {user:  {
                    firstName: Like(`%${strArr[0]}%`),
                    lastName: And(Like(`%${strArr[1]}%`))
                }} :
                {user: [ 
                    {firstName: Like(`%${strArr[0]}%`)},
                    {lastName: Like(`%${strArr[0]}%`)}
                ]}
            ]
        })
        if(!blogs && blogs.length < 1){
            throw new NotFoundException("No blogs")
        }
        return blogs
    }
    
    async getAll (): Promise<Blog[]> {
        const blogs = await this.blogsRepo.find()
        if(!blogs && blogs.length < 1){
            throw new NotFoundException("No blogs")
        }
        return blogs
    }
    
    async getBlogById (id: number): Promise<Blog> {
        const blog = await this.blogsRepo.findOneBy({ id })
        if(!blog){
            throw new NotFoundException("Can not find this blog")
        }
        return blog
    }
    
    async getBlogsByUserId (id: number): Promise<Blog[]> {
        const blogs = await this.blogsRepo.find({
            where: {
                user: {
                    id
                }
            }
        })
        if(!blogs || blogs.length < 1){
            throw new NotFoundException("There are no blogs by this user")
        }
        return blogs
    }
    
    async createBlog (createBlogDTO: CreateBlogDTO, user: LoggedinUser): Promise<Blog> {
        const newBlog = await this.blogsRepo.save(
            this.blogsRepo.create({
                ...createBlogDTO,
                user: {
                    id: user.userId
                }
            })
        )
        return newBlog
    }
    
    async updateBlog (id: number, createBlogDTO: CreateBlogDTO, user: LoggedinUser): Promise<Blog> {
        const identifiedBlog = await this.blogsRepo.findOne({
            where: {
                id
            },
            loadRelationIds: {
                relations: ['user'],
                disableMixedMap: true
            }
        })

        if(!identifiedBlog){
            throw new NotFoundException("Specified blog does not exist")
        }
        
        if(identifiedBlog.user.id !== user.userId) {
            throw new UnauthorizedException("You are not authorized to update this blog")
        }

        identifiedBlog.title = createBlogDTO.title
        identifiedBlog.blog = createBlogDTO.blog

        return await this.blogsRepo.save(identifiedBlog)
    }
    
    async deleteBlog (id: number, user: LoggedinUser): Promise<string> {
        const identifiedBlog = await this.blogsRepo.findOne({
            where: {
                id
            },
            loadRelationIds: {
                relations: ['user'],
                disableMixedMap: true
            }
        })

        if(!identifiedBlog){
            throw new NotFoundException("Specified blog does not exist")
        }
        
        if(identifiedBlog.user.id !== user.userId) {
            throw new UnauthorizedException("You are not authorized to delete this blog")
        }

        const delRec = await this.blogsRepo.delete(id)
        if(!delRec){
            throw new InternalServerErrorException()
        }
        return "deleted"
    }
}
