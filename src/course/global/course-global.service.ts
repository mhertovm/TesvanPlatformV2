import { Injectable } from '@nestjs/common';
import { CourseService } from '../course.service';

@Injectable()
export class CourseGlobalService {
  constructor(private readonly courseService: CourseService) {}

  findAll() {
    const courses = this.courseService.findAll();
    return courses;
  }

  findOne(id: number) {
    return this.courseService.findOne(id);
  }
}