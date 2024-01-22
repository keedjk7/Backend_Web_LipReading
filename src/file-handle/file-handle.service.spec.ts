import { Test, TestingModule } from '@nestjs/testing';
import { FileHandleService } from './file-handle.service';

describe('FileHandleService', () => {
  let service: FileHandleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileHandleService],
    }).compile();

    service = module.get<FileHandleService>(FileHandleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
