-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pharmacy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "chain" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "openingHours" TEXT,
    "rating" TEXT,
    "notes" TEXT,
    "image" TEXT,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Pharmacy" ("address", "createdAt", "id", "image", "latitude", "longitude", "name", "notes", "phone", "rating") SELECT "address", "createdAt", "id", "image", "latitude", "longitude", "name", "notes", "phone", "rating" FROM "Pharmacy";
DROP TABLE "Pharmacy";
ALTER TABLE "new_Pharmacy" RENAME TO "Pharmacy";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
