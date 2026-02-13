#!/usr/bin/env node

/**
 * Database Backup Restore Script
 * 
 * Permite ver y restaurar backups de la BD
 * Uso: npm run db:restore
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const DB_PATH = path.join(__dirname, '../', 'dev.db');
const BACKUP_DIR = path.join(__dirname, '../', '.db-backups');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('📦 Backups disponibles:\n');

if (!fs.existsSync(BACKUP_DIR)) {
  console.log('❌ No hay backups guardados aún');
  rl.close();
  process.exit(0);
}

const backups = fs.readdirSync(BACKUP_DIR)
  .filter(f => f.startsWith('dev.db.backup'))
  .sort()
  .reverse();

if (backups.length === 0) {
  console.log('❌ No hay backups guardados aún');
  rl.close();
  process.exit(0);
}

backups.forEach((backup, index) => {
  const fullPath = path.join(BACKUP_DIR, backup);
  const stats = fs.statSync(fullPath);
  const size = (stats.size / 1024).toFixed(2);
  console.log(`${index + 1}. ${backup} (${size} KB)`);
});

rl.question('\n¿Qué backup quieres restaurar? (número o Ctrl+C para salir): ', (answer) => {
  const index = parseInt(answer) - 1;
  
  if (index < 0 || index >= backups.length) {
    console.log('❌ Opción inválida');
    rl.close();
    process.exit(1);
  }

  const selectedBackup = path.join(BACKUP_DIR, backups[index]);
  
  rl.question(`\n⚠️  Esto sobrescribirá tu BD actual. ¿Estás seguro? (s/n): `, (confirm) => {
    if (confirm.toLowerCase() === 's') {
      try {
        // Hacer backup de la BD actual antes de restaurar
        if (fs.existsSync(DB_PATH)) {
          const currentBackup = path.join(BACKUP_DIR, `dev.db.backup.before-restore.${new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)}`);
          fs.copyFileSync(DB_PATH, currentBackup);
          console.log(`📤 BD actual guardada como backup en: ${currentBackup}`);
        }

        // Restaurar el backup seleccionado
        fs.copyFileSync(selectedBackup, DB_PATH);
        console.log(`✅ ¡BD restaurada exitosamente!`);
        console.log(`📊 Backup usado: ${backups[index]}`);
      } catch (error) {
        console.error(`❌ Error al restaurar: ${error.message}`);
        process.exit(1);
      }
    } else {
      console.log('❌ Operación cancelada');
    }
    rl.close();
  });
});
