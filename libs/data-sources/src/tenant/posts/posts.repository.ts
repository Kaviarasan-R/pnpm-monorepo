import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Post } from './post.entity';
import { TENANT_CONNECTION } from '../../constants';

@Injectable()
export class PostsRepository {
  public readonly repo: Repository<Post>;

  constructor(
    @Inject(TENANT_CONNECTION)
    private readonly dataSource: DataSource,
  ) {
    this.repo = this.dataSource.getRepository(Post);
  }

  findAll(): Promise<Post[]> {
    return this.repo.find();
  }

  findOne(id: number): Promise<Post | null> {
    return this.repo.findOneBy({ id });
  }
}
