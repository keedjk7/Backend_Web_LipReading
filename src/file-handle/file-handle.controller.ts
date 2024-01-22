import { Controller } from '@nestjs/common';
import { FileHandleService } from './file-handle.service';

@Controller('file-handle')
export class FileHandleController {
  constructor(private readonly fileHandleService: FileHandleService) {}
}
