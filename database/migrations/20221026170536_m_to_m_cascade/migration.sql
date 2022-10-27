-- DropForeignKey
ALTER TABLE "posts_categories" DROP CONSTRAINT "posts_categories_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "posts_categories" DROP CONSTRAINT "posts_categories_postId_fkey";

-- DropForeignKey
ALTER TABLE "posts_tags" DROP CONSTRAINT "posts_tags_postId_fkey";

-- DropForeignKey
ALTER TABLE "posts_tags" DROP CONSTRAINT "posts_tags_tagId_fkey";

-- AddForeignKey
ALTER TABLE "posts_tags" ADD CONSTRAINT "posts_tags_postId_fkey" FOREIGN KEY ("postId") REFERENCES "maps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts_tags" ADD CONSTRAINT "posts_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts_categories" ADD CONSTRAINT "posts_categories_postId_fkey" FOREIGN KEY ("postId") REFERENCES "maps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts_categories" ADD CONSTRAINT "posts_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
