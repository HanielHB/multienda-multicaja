-- Migration Script: Replace email with nro_documento in clientes table
-- Run this script on your existing database to update the structure
-- Date: 2026-02-02
-- Description: Changes the clientes table to use nro_documento instead of email

USE `tienda_multicaja`;

-- Step 1: Add nro_documento column
ALTER TABLE `clientes` 
ADD COLUMN `nro_documento` VARCHAR(20) NULL AFTER `nombre`;

-- Step 2: (Optional) Copy email data to nro_documento if you want to preserve it
-- Uncomment the line below if you want to copy existing email values
-- UPDATE `clientes` SET `nro_documento` = `email` WHERE `email` IS NOT NULL;

-- Step 3: Drop the email column
ALTER TABLE `clientes` 
DROP COLUMN `email`;

-- Verification: Check the updated structure
DESCRIBE `clientes`;

-- Expected result:
-- +---------------+--------------+------+-----+---------------------+-------------------+
-- | Field         | Type         | Null | Key | Default             | Extra             |
-- +---------------+--------------+------+-----+---------------------+-------------------+
-- | id            | int          | NO   | PRI | NULL                | auto_increment    |
-- | nombre        | varchar(150) | NO   |     | NULL                |                   |
-- | nro_documento | varchar(20)  | YES  |     | NULL                |                   |
-- | direccion     | text         | YES  |     | NULL                |                   |
-- | celular       | varchar(20)  | YES  |     | NULL                |                   |
-- | created_at    | timestamp    | YES  |     | CURRENT_TIMESTAMP   | DEFAULT_GENERATED |
-- | updated_at    | timestamp    | YES  |     | CURRENT_TIMESTAMP   | ...               |
-- +---------------+--------------+------+-----+---------------------+-------------------+
