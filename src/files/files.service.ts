import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {

  constructor(private readonly configService: ConfigService) { }


  async createFile(file: any): Promise<string> {
    try {
      const extname = path.extname(file.originalname);
      const host = process.env.HOST
      const fileName = uuid.v4() + extname;
      const filePath = path.resolve('uploads');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return `${host}/files/${fileName}`;
    } catch (error) {
      throw new HttpException(
        'Faylni yozishda xatolik yoki rasm aniqlanmadi',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createFileWithSlug(file: any, slug: string): Promise<string> {
    try {
      const extname = path.extname(file.originalname);
      const host = process.env.HOST
      const fileName = slug + extname;
      const filePath = path.resolve('uploads');
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      fs.writeFileSync(path.join(filePath, fileName), file.buffer);
      return `${host}/files/${fileName}`;
    } catch (error) {
      throw new HttpException(
        'Faylni yozishda xatolik yoki rasm aniqlanmadi',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    if (!fileName) {
      return;
    }
    const filenomi = this.getFileNameFromUrl(fileName)
    // const filePath = path.resolve(__dirname, '..', `static/${filenomi}`);
    const filePath = path.resolve('uploads', `${filenomi}`);
    fs.unlink(filePath, (err) => {

    });
  }

  private getFileNameFromUrl(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 1];
  }
}
