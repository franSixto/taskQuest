#!/usr/bin/env node

/**
 * Safe Database Migration Script
 * 
 * Este script realiza migraciones de forma segura:
 * 1. Hace backup de la BD actual
 * 2. Aplica los cambios del schema con `prisma db push`
 * 3. Si algo falla, permite restaurar desde el backup
 * 
 * Uso: npm run db:migrate-safe
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DB_PATH = path.join(__dirname, '../', 'dev.db');
const BACKUP_DIR = path.join(__dirname, '../', '.db-backups');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
const BACKUP_PATH = path.join(BACKUP_DIR, `dev.db.backup.${TIMESTAMP}`);

console.log('🛡️  Iniciando migración segura de la base de datos');
console.log(`📦 Directorio actual: ${__dirname}`);

// Crear directorio de backups si no existe
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  console.log(`📁 Creado directorio de backups: ${BACKUP_DIR}`);
}

try {
  // Paso 1: Backup
  if (fs.existsSync(DB_PATH)) {
    console.log(`\n📤 Haciendo backup de la BD...`);
    fs.copyFileSync(DB_PATH, BACKUP_PATH);
    console.log(`✅ Backup guardado en: ${BACKUP_PATH}`);
    
    // Limpiar backups antiguos (mantener solo últimos 10)
    const backups = fs.readdirSync(BACKUP_DIR)
      .sort()
      .reverse();
    if (backups.length > 10) {
      console.log(`🧹 Limpiando backups antiguos...`);
      for (let i = 10; i < backups.length; i++) {
        fs.unlinkSync(path.join(BACKUP_DIR, backups[i]));
      }
      console.log(`✅ Mantuvimos los últimos 10 backups`);
    }
  } else {
    console.log(`⚠️  BD no existe aún, se creará nueva`);
  }

  // Paso 2: Aplicar migraciones con db push (no destructivo)
  console.log(`\n🔄 Aplicando cambios del schema con 'prisma db push'...`);
  try {
    execSync('npx prisma db push --skip-generate', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '../')
    });
    console.log(`✅ Schema actualizado exitosamente`);
  } catch (error) {
    console.error(`❌ Error al aplicar cambios del schema`);
    throw error;
  }

  // Paso 3: Regenerar Prisma Client
  console.log(`\n🔨 Regenerando Prisma Client...`);
  execSync('npx prisma generate', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '../')
  });
  console.log(`✅ Prisma Client regenerado`);

  console.log(`\n✨ ¡Migración completada exitosamente!`);
  console.log(`📊 Tu BD y datos están seguros`);
  console.log(`💾 Backup disponible en: ${BACKUP_PATH}`);

} catch (error) {
  console.error(`\n❌ Error durante la migración`);
  console.error(error.message);
  
  if (fs.existsSync(BACKUP_PATH)) {
    console.error(`\n🆘 ¿Quieres restaurar desde el backup? (manual)`);
    console.error(`   cp ${BACKUP_PATH} ${DB_PATH}`);
  }
  
  process.exit(1);
}
