/*
  Warnings:

  - Added the required column `userId` to the `maps` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "maps" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "maps" ADD CONSTRAINT "maps_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
