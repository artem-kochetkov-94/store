/*
  Warnings:

  - Added the required column `description` to the `ProductModel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProductModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "count" INTEGER NOT NULL
);
INSERT INTO "new_ProductModel" ("count", "id", "title") SELECT "count", "id", "title" FROM "ProductModel";
DROP TABLE "ProductModel";
ALTER TABLE "new_ProductModel" RENAME TO "ProductModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
