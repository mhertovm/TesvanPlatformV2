import { Injectable } from '@nestjs/common';
import { CourseService } from '../course.service';

@Injectable()
export class CourseGlobalService {
  constructor(private readonly courseService: CourseService) { }

  findAll(take: number, skip: number, language: string) {
    const courses = this.courseService.findAll(take, skip, language);
    return courses;
  }

  findOne(id: number, language: string) {
    return this.courseService.findOne(id, language);
  }
}