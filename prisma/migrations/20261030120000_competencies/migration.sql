-- CreateTable
CREATE TABLE "competencies" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(40) NOT NULL,
    "name_ru" VARCHAR(60) NOT NULL,
    "name_en" VARCHAR(60) NOT NULL,

    CONSTRAINT "competencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TaskCompetencies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_TaskCompetencies_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_StudentInterests" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StudentInterests_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "competencies_code_key" ON "competencies"("code");

-- CreateIndex
CREATE INDEX "_TaskCompetencies_B_index" ON "_TaskCompetencies"("B");

-- CreateIndex
CREATE INDEX "_StudentInterests_B_index" ON "_StudentInterests"("B");

-- AddForeignKey
ALTER TABLE "_TaskCompetencies" ADD CONSTRAINT "_TaskCompetencies_A_fkey" FOREIGN KEY ("A") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TaskCompetencies" ADD CONSTRAINT "_TaskCompetencies_B_fkey" FOREIGN KEY ("B") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentInterests" ADD CONSTRAINT "_StudentInterests_A_fkey" FOREIGN KEY ("A") REFERENCES "competencies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentInterests" ADD CONSTRAINT "_StudentInterests_B_fkey" FOREIGN KEY ("B") REFERENCES "student_profiles"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

