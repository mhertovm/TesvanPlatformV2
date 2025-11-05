/*
  Warnings:

  - You are about to drop the column `courseLevel` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `courseType` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Course` table. All the data in the column will be lost.
  - You are about to drop the column `studentLimit` on the `Course` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'INPROGRESS', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Course" DROP COLUMN "courseLevel",
DROP COLUMN "courseType",
DROP COLUMN "status",
DROP COLUMN "studentLimit",
ALTER COLUMN "imageUrl" DROP NOT NULL;

-- CreateTable
CREATE TABLE "CourseMeta" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "courseType" TEXT,
    "courseLevel" TEXT,
    "status" "CourseStatus" DEFAULT 'DRAFT',
    "studentLimit" INTEGER,

    CONSTRAINT "CourseMeta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CourseMeta_courseId_key" ON "CourseMeta"("courseId");

-- AddForeignKey
ALTER TABLE "CourseMeta" ADD CONSTRAINT "CourseMeta_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
