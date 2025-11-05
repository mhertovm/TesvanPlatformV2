/*
  Warnings:

  - You are about to drop the `Groups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Groups" DROP CONSTRAINT "Groups_courseId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Groups" DROP CONSTRAINT "Groups_userId_fkey";

-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "studentLimit" INTEGER;

-- DropTable
DROP TABLE "public"."Groups";

-- CreateTable
CREATE TABLE "CourseStudents" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CourseStudents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseStudents" ADD CONSTRAINT "CourseStudents_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseStudents" ADD CONSTRAINT "CourseStudents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
