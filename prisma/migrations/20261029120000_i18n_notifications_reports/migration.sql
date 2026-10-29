-- Язык пользователя, уведомления «тип + параметры» вместо готового текста,
-- отметка последнего еженедельного отчёта работодателю.

-- CreateEnum
CREATE TYPE "locale" AS ENUM ('ru', 'en');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('TASK_ON_MODERATION', 'TASK_EDITED', 'TASK_PUBLISHED', 'TASK_RETURNED', 'APPLICATION_RECEIVED', 'APPLICATION_ACCEPTED', 'APPLICATION_DECLINED', 'SOLUTION_RECEIVED', 'SOLUTION_RESUBMITTED', 'SOLUTION_ACCEPTED', 'SOLUTION_CHANGES_REQUESTED', 'SOLUTION_REJECTED', 'ORGANIZATION_VERIFIED', 'ORGANIZATION_REJECTED');

-- AlterTable
ALTER TABLE "employer_profiles" ADD COLUMN     "last_report_sent_at" TIMESTAMP(3);

-- Старые уведомления хранили готовый текст на одном языке — у них нет типа, перевести их нельзя.
-- На момент миграции в базе только тестовые данные, поэтому просто удаляем их.
DELETE FROM "notifications";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "body",
DROP COLUMN "title",
ADD COLUMN     "params" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "type" "notification_type" NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "locale" "locale" NOT NULL DEFAULT 'ru';
