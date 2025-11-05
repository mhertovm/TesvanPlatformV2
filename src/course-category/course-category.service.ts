import { Injectable } from '@nestjs/common';
import { CreateCourseCategoryDto } from './dto/create-course-category.dto';
import { UpdateCourseCategoryDto } from './dto/update-course-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CourseCategoryService {
  constructor(private readonly db: PrismaService) { }
  create(createCourseCategoryDto: CreateCourseCategoryDto) {
    return this.db.courseCategories.create({
      data: createCourseCategoryDto,
    });
  }

  findAll() {
    return this.db.courseCategories.findMany({
      include: { courses: true },
    });
  }

  findOne(id: number) {
    return this.db.courseCategories.findUnique({
      where: { id },
      include: { courses: true },
    });
  }

  update(id: number, updateCourseCategoryDto: UpdateCourseCategoryDto) {
    return this.db.courseCategories.update({
      where: { id },
      data: updateCourseCategoryDto,
    });
  }

  async remove(id: number) {
    const relatedCourses = await this.db.course.findMany({
      where: { categoryId: id },
    });

    if (relatedCourses.length > 0) {
      throw new Error('Cannot delete category because it has related courses');
    }

    return this.db.courseCategories.delete({
      where: { id },
    });
  }
}
