import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { Blog } from './blog.model';
import { BlogsResolver } from './blogs.resolver';
import { CommentsModule } from 'src/comments/comments.module';
import { UsersModule } from 'src/users/users.module';
import { SearchModule } from 'src/search/search.module';

@Module({
    imports: [TypeOrmModule.forFeature([Blog]), UsersModule, CommentsModule, SearchModule],
    providers: [BlogsService, BlogsResolver]
})
export class BlogsModule {}
