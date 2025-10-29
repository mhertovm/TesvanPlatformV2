-- CreateTable
CREATE TABLE "pendingRepo" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "gender" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "otpCode" INTEGER,
    "otpSendMax" INTEGER NOT NULL DEFAULT 3,
    "otpCheckMax" INTEGER NOT NULL DEFAULT 3,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pendingRepo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pendingRepo_username_key" ON "pendingRepo"("username");

-- CreateIndex
CREATE UNIQUE INDEX "pendingRepo_email_key" ON "pendingRepo"("email");
