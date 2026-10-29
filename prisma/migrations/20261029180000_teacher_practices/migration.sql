-- Роль преподавателя и практики: группа студентов, набор заданий, итоговая оценка.

-- CreateEnum
CREATE TYPE "practice_grade" AS ENUM ('EXCELLENT', 'GOOD', 'SATISFACTORY', 'UNSATISFACTORY');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "notification_type" ADD VALUE 'PRACTICE_ADDED';
ALTER TYPE "notification_type" ADD VALUE 'PRACTICE_GRADED';

-- AlterEnum
ALTER TYPE "user_role" ADD VALUE 'TEACHER';

-- CreateTable
CREATE TABLE "practices" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(2000),
    "teacher_id" TEXT NOT NULL,
    "starts_at" DATE NOT NULL,
    "ends_at" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "practices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "practice_students" (
    "practice_id" INTEGER NOT NULL,
    "student_id" TEXT NOT NULL,
    "grade" "practice_grade",
    "grade_comment" VARCHAR(2000),
    "graded_at" TIMESTAMP(3),
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "practice_students_pkey" PRIMARY KEY ("practice_id","student_id")
);

-- CreateTable
CREATE TABLE "practice_tasks" (
    "practice_id" INTEGER NOT NULL,
    "task_id" INTEGER NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "practice_tasks_pkey" PRIMARY KEY ("practice_id","task_id")
);

-- CreateIndex
CREATE INDEX "practices_teacher_id_idx" ON "practices"("teacher_id");

-- CreateIndex
CREATE INDEX "practice_students_student_id_idx" ON "practice_students"("student_id");

-- CreateIndex
CREATE INDEX "practice_tasks_task_id_idx" ON "practice_tasks"("task_id");

-- AddForeignKey
ALTER TABLE "practices" ADD CONSTRAINT "practices_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_students" ADD CONSTRAINT "practice_students_practice_id_fkey" FOREIGN KEY ("practice_id") REFERENCES "practices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_students" ADD CONSTRAINT "practice_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_tasks" ADD CONSTRAINT "practice_tasks_practice_id_fkey" FOREIGN KEY ("practice_id") REFERENCES "practices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "practice_tasks" ADD CONSTRAINT "practice_tasks_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

