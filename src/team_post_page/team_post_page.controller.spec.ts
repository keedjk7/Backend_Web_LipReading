import { Test, TestingModule } from '@nestjs/testing';
import { TeamPostPageController } from './team_post_page.controller';
import { TeamPostPageService } from './team_post_page.service';

describe('TeamPostPageController', () => {
  let controller: TeamPostPageController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamPostPageController],
      providers: [TeamPostPageService],
    }).compile();

    controller = module.get<TeamPostPageController>(TeamPostPageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
