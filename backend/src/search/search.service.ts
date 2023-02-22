import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import ElasticInsertBlogDTO from './dto/elasticInsertBlog.dto';
import ElasticUpdateBlogDTO from './dto/elasticUpdateBlog.dto';

@Injectable()
export class SearchService {
    constructor (private readonly esService: ElasticsearchService, private readonly configService: ConfigService) {}
    
    public async createIndex() {
        try {
            const index: string = this.configService.get('ELASTICSEARCH_INDEX');
            const checkIndex = await this.esService.indices.exists({ index });
            if (!checkIndex) {
                try{
                    const abc = await this.esService.indices.create({
                        index,
                        mappings: {
                            properties: {
                                id: { type: 'integer' },
                                title: { type: 'text' },
                                blog: { type: 'text' },
                                userId: { type: 'integer' },
                                firstName: { type: 'text' },
                                lastName: { type: 'text' }
                            }
                        }
                    })
                } catch (err) {
                    console.log(err)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
    
    public async insertData(document: ElasticInsertBlogDTO) {
        try {
            const index: string = this.configService.get('ELASTICSEARCH_INDEX');
            await this.esService.index({
                index,
                document
            })
            await this.esService.indices.refresh({ index })
        } catch (err) {
            console.log(err)
        }
    }
    
    public async updateData(document: ElasticUpdateBlogDTO) {
        try {
            const index: string = this.configService.get('ELASTICSEARCH_INDEX');
            const { id, title, blog } = document
            await this.esService.updateByQuery({
                index,
                query: {
                    match: {
                        id
                    }
                },
                script: `ctx._source.title='${title}';ctx._source.blog='${blog}'`
            })
            await this.esService.indices.refresh({ index })
        } catch (err) {
            console.log(err)
        }
    }
    
    public async deleteData(id: number) {
        try {
            const index: string = this.configService.get('ELASTICSEARCH_INDEX');
            await this.esService.deleteByQuery({
                index,
                query: {
                    match: {
                        id
                    }
                }
            })
            await this.esService.indices.refresh({ index })
        } catch (err) {
            console.log(err)
        }
    }
    
    async search(query: string) {
        let results: Array<any> = [];
        const response = await this.esService.search({
            index: this.configService.get('ELASTICSEARCH_INDEX'),
            query: {
                multi_match: {
                    query,
                    type: 'cross_fields',
                    fields: [
                        'title',
                        'blog',
                        'firstName',
                        'lastName',
                    ],
                    operator: 'or'
                }
            }
        });
        const { hits, total } = response.hits;
        hits.map((item) => {
            results.push(item._source);
        });
        return { results, total: total };
    }
}
