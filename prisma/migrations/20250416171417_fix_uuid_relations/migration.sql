/*
  Warnings:

  - The primary key for the `ApprovalRequest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `approvedById` column on the `ApprovalRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ApprovalSetting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Expense` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `FuelRefill` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Nozzle` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Station` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `StoreSale` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Tank` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `TankReconciliation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `stationId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `id` on the `ApprovalRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stationId` on the `ApprovalRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `requestedById` on the `ApprovalRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `ApprovalSetting` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stationId` on the `ApprovalSetting` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Employee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stationId` on the `Employee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Expense` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stationId` on the `Expense` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `FuelRefill` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tankId` on the `FuelRefill` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stationId` on the `FuelRefill` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Nozzle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tankId` on the `Nozzle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stationId` on the `Nozzle` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stationId` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Station` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `StoreSale` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `StoreSale` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stationId` on the `StoreSale` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Tank` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stationId` on the `Tank` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `TankReconciliation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tankId` on the `TankReconciliation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `stationId` on the `TankReconciliation` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ApprovalRequest" DROP CONSTRAINT "ApprovalRequest_approvedById_fkey";

-- DropForeignKey
ALTER TABLE "ApprovalRequest" DROP CONSTRAINT "ApprovalRequest_requestedById_fkey";

-- DropForeignKey
ALTER TABLE "ApprovalRequest" DROP CONSTRAINT "ApprovalRequest_stationId_fkey";

-- DropForeignKey
ALTER TABLE "ApprovalSetting" DROP CONSTRAINT "ApprovalSetting_stationId_fkey";

-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_stationId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_stationId_fkey";

-- DropForeignKey
ALTER TABLE "FuelRefill" DROP CONSTRAINT "FuelRefill_stationId_fkey";

-- DropForeignKey
ALTER TABLE "FuelRefill" DROP CONSTRAINT "FuelRefill_tankId_fkey";

-- DropForeignKey
ALTER TABLE "Nozzle" DROP CONSTRAINT "Nozzle_stationId_fkey";

-- DropForeignKey
ALTER TABLE "Nozzle" DROP CONSTRAINT "Nozzle_tankId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_stationId_fkey";

-- DropForeignKey
ALTER TABLE "StoreSale" DROP CONSTRAINT "StoreSale_productId_fkey";

-- DropForeignKey
ALTER TABLE "StoreSale" DROP CONSTRAINT "StoreSale_stationId_fkey";

-- DropForeignKey
ALTER TABLE "Tank" DROP CONSTRAINT "Tank_stationId_fkey";

-- DropForeignKey
ALTER TABLE "TankReconciliation" DROP CONSTRAINT "TankReconciliation_stationId_fkey";

-- DropForeignKey
ALTER TABLE "TankReconciliation" DROP CONSTRAINT "TankReconciliation_tankId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_stationId_fkey";

-- AlterTable
ALTER TABLE "ApprovalRequest" DROP CONSTRAINT "ApprovalRequest_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "stationId",
ADD COLUMN     "stationId" UUID NOT NULL,
DROP COLUMN "requestedById",
ADD COLUMN     "requestedById" UUID NOT NULL,
DROP COLUMN "approvedById",
ADD COLUMN     "approvedById" UUID,
ADD CONSTRAINT "ApprovalRequest_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ApprovalSetting" DROP CONSTRAINT "ApprovalSetting_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "stationId",
ADD COLUMN     "stationId" UUID NOT NULL,
ADD CONSTRAINT "ApprovalSetting_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "stationId",
ADD COLUMN     "stationId" UUID NOT NULL,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "stationId",
ADD COLUMN     "stationId" UUID NOT NULL,
ADD CONSTRAINT "Expense_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "FuelRefill" DROP CONSTRAINT "FuelRefill_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "tankId",
ADD COLUMN     "tankId" UUID NOT NULL,
DROP COLUMN "stationId",
ADD COLUMN     "stationId" UUID NOT NULL,
ADD CONSTRAINT "FuelRefill_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Nozzle" DROP CONSTRAINT "Nozzle_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "tankId",
ADD COLUMN     "tankId" UUID NOT NULL,
DROP COLUMN "stationId",
ADD COLUMN     "stationId" UUID NOT NULL,
ADD CONSTRAINT "Nozzle_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "stationId",
ADD COLUMN     "stationId" UUID NOT NULL,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Station" DROP CONSTRAINT "Station_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Station_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "StoreSale" DROP CONSTRAINT "StoreSale_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "productId",
ADD COLUMN     "productId" UUID NOT NULL,
DROP COLUMN "stationId",
ADD COLUMN     "stationId" UUID NOT NULL,
ADD CONSTRAINT "StoreSale_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Tank" DROP CONSTRAINT "Tank_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "stationId",
ADD COLUMN     "stationId" UUID NOT NULL,
ADD CONSTRAINT "Tank_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TankReconciliation" DROP CONSTRAINT "TankReconciliation_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "tankId",
ADD COLUMN     "tankId" UUID NOT NULL,
DROP COLUMN "stationId",
ADD COLUMN     "stationId" UUID NOT NULL,
ADD CONSTRAINT "TankReconciliation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "stationId",
ADD COLUMN     "stationId" UUID,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tank" ADD CONSTRAINT "Tank_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nozzle" ADD CONSTRAINT "Nozzle_tankId_fkey" FOREIGN KEY ("tankId") REFERENCES "Tank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nozzle" ADD CONSTRAINT "Nozzle_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalSetting" ADD CONSTRAINT "ApprovalSetting_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalRequest" ADD CONSTRAINT "ApprovalRequest_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelRefill" ADD CONSTRAINT "FuelRefill_tankId_fkey" FOREIGN KEY ("tankId") REFERENCES "Tank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelRefill" ADD CONSTRAINT "FuelRefill_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TankReconciliation" ADD CONSTRAINT "TankReconciliation_tankId_fkey" FOREIGN KEY ("tankId") REFERENCES "Tank"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TankReconciliation" ADD CONSTRAINT "TankReconciliation_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreSale" ADD CONSTRAINT "StoreSale_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreSale" ADD CONSTRAINT "StoreSale_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
