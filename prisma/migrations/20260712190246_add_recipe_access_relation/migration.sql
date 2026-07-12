-- AddForeignKey
ALTER TABLE "RecipeAccess" ADD CONSTRAINT "RecipeAccess_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
