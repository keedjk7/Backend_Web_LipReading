import { Injectable, StreamableFile } from '@nestjs/common';
import * as fs from 'fs';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { join, extname } from 'path';
import * as path from 'path';

@Injectable()
export class FileHandleService {

    // deleteFile
    async deleteFile(filePath: string): Promise<{ status: string }> {
        return new Promise((resolve, reject) => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ status: '200 OK' });
                }
            });
        });
    }

    // saveFileFromData
    async saveFileFromFormData(file: Express.Multer.File, destinationPath: string): Promise<string> {
        console.log('saving')
        // Check if the file is saved to disk (file.path exists)
        if (file.path) {
          const filePath = path.join(destinationPath, file.originalname);
      
          try {
            // If you want to move the file, use fs.promises.rename
            await fs.promises.rename(file.path, filePath);
            return filePath;
          } catch (error) {
            throw new Error(`Failed to save file: ${error.message}`);
          }
        } else {
          throw new Error('File path is missing. Make sure to configure multer properly.');
        }
      }



    // return File to Download
    async downloadFile(filePath: string, res: Response): Promise<StreamableFile | string> {
        const fileExtension = extname(filePath).toLowerCase();

        let contentType = 'application/octet-stream';

        if (this.isImageFile(fileExtension)) {
            contentType = this.getImageContentType(fileExtension);
        } else if (this.isVideoFile(fileExtension)) {
            contentType = this.getVideoContentType(fileExtension);
        }

        const file = createReadStream(filePath);

        res.set({
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="file${fileExtension}"`,
        });

        return new StreamableFile(file);
    }

    private isImageFile(fileExtension: string): boolean {
        return ['.jpg', '.jpeg', '.png', '.gif'].includes(fileExtension);
    }

    private getImageContentType(fileExtension: string): string {
        if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
            return 'image/jpeg';
        } else if (fileExtension === '.png') {
            return 'image/png';
        } else if (fileExtension === '.gif') {
            return 'image/gif';
        }

        return 'application/octet-stream'; // Default content type for unknown image files
    }

    private isVideoFile(fileExtension: string): boolean {
        return ['.mp4', '.avi', '.mkv', '.mpg'].includes(fileExtension);
    }

    private getVideoContentType(fileExtension: string): string {
        if (fileExtension === '.mp4') {
            return 'video/mp4';
        } else if (fileExtension === '.avi') {
            return 'video/x-msvideo';
        } else if (fileExtension === '.mkv') {
            return 'video/x-matroska';
        } else if (fileExtension === '.mpg') {
            return 'video/mpeg';
        }

        return 'application/octet-stream'; // Default content type for unknown video files
    }
}

