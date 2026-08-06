-- CreateTable
CREATE TABLE "Pharmacy" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "rating" TEXT NOT NULL,
    "notes" TEXT,
    "image" TEXT,
    "latitude" REAL NOT NULL,
    "longitude" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
