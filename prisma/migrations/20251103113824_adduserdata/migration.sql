/*
  Warnings:

  - You are about to drop the column `username` on the `pendingRepo` table. All the data in the column will be lost.
  - Made the column `lastName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "public"."pendingRepo_username_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "QABackground" BOOLEAN,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "englishLevel" TEXT,
ALTER COLUMN "lastName" SET NOT NULL;

-- AlterTable
ALTER TABLE "pendingRepo" DROP COLUMN "username",
ADD COLUMN     "QABackground" BOOLEAN,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "englishLevel" TEXT,
ADD COLUMN     "phone" TEXT;
