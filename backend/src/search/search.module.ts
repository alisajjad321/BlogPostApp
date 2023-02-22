import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './search.service';
import * as fs from 'fs'
import { join } from 'path';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: configService.get('ELASTICSEARCH_PASSWORD'),
        },
        maxRetries: configService.get('ELASTICSEARCH_MAX_RETRIES'),
        requestTimeout: configService.get('ELASTICSEARCH_REQ_TIMEOUT'),
        tls: {
          ca: fs.readFileSync(join(process.cwd(), './src/ca/ca.crt')),
          rejectUnauthorized: false
        }
      }),
      inject: [ConfigService],
    })
  ],
  providers: [SearchService],
  exports: [SearchService]
})
export class SearchModule implements OnModuleInit {
  constructor (private readonly searchService: SearchService) {}

  public async onModuleInit() {
    await this.searchService.createIndex();
  }
}
