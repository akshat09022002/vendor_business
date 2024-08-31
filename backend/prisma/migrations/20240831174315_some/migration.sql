/*
  Warnings:

  - Changed the type of `dob` on the `Customer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `anniversery` on the `Customer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "dob",
ADD COLUMN     "dob" TIMESTAMP(3) NOT NULL,
DROP COLUMN "anniversery",
ADD COLUMN     "anniversery" TIMESTAMP(3) NOT NULL;
