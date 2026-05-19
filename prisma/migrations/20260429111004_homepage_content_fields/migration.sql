-- CreateTable
CREATE TABLE "home_page_content" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "pathname" TEXT NOT NULL,
    "alt" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_page_content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "home_page_content_sortOrder_idx" ON "home_page_content"("sortOrder");
