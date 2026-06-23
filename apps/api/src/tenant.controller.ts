import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PostsRepository } from '@boilerplate/data-sources';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Tenants')
@Controller('tenants')
export class TenantController {
  constructor(private readonly postsRepo: PostsRepository) {}

  @Get('posts')
  @ApiOperation({ summary: 'Get all posts' })
  @ApiResponse({
    status: 200,
    description: 'Returns all posts for the current tenant',
  })
  getPosts() {
    return this.postsRepo.repo.find();
  }

  @Get('posts/:id')
  @ApiOperation({ summary: 'Get a post by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Returns the post' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  getPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsRepo.findOne(id);
  }
}
