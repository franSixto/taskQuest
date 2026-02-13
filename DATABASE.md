# 📊 Database Management & Data Persistence

This document explains how to safely manage your local database and protect against data loss.

## 🎯 Overview

Since we're using SQLite for local development (`file:./dev.db`), data persistence is critical. The setup includes:

- **Automatic backups** before any schema changes
- **Safe migration scripts** that prevent accidental data loss
- **Interactive restore tool** to recover from backups
- **Backup rotation** (keeps last 10 backups)

## 🚀 Safe Migration Workflow

### For Schema Changes (Recommended)

When you need to modify the database schema, use the safe migration command:

```bash
npm run db:migrate -- --name your_migration_name
```

This command will:
1. ✅ Create an automatic backup of your current database
2. ✅ Apply the schema changes safely
3. ✅ Preserve all your data
4. ✅ Store backup file with timestamp in `backups/` directory

**Example:**
```bash
npm run db:migrate -- --name add_new_feature
```

### For Quick Schema Changes (Use Carefully)

If you prefer Prisma's interactive migration tool (⚠️ may reset DB if schema drift detected):

```bash
npm run db:migrate-dev
```

> **Warning**: This uses `prisma migrate dev` which can detect schema drift and RESET your database. Only use this if you understand the risks.

## 💾 Backup & Restore

### View Available Backups

```bash
ls -lah backups/
```

### Restore from Backup

If something goes wrong (or you want to recover lost data):

```bash
npm run db:restore
```

This will:
1. 📋 Show a list of available backups with timestamps
2. 🔍 Display backup details (size, approximate record count)
3. 🔄 Let you select which backup to restore
4. ✅ Restore the database and verify integrity

### Manual Backup & Restore

Backups are standard SQLite files. You can also:

```bash
# Create manual backup
cp dev.db backups/dev.db.backup.$(date +%s)

# Restore specific backup file
cp backups/dev.db.backup.TIMESTAMP dev.db

# View backup details
sqlite3 backups/dev.db.backup.TIMESTAMP ".tables"
```

## 📁 Backup Structure

Backups are auto-created in the `backups/` directory:

```
backups/
├── dev.db.backup.1707251800
├── dev.db.backup.1707252845
├── dev.db.backup.1707253600
└── ... (up to 10 recent backups)
```

**Format:** `dev.db.backup.TIMESTAMP` (Linux timestamp)

## ⚙️ Available Commands

| Command | Purpose | Safety | When to Use |
|---------|---------|--------|-----------|
| `npm run db:migrate -- --name NAME` | Safe schema changes with auto-backup | ✅ High | Every time you change schema |
| `npm run db:migrate-dev` | Interactive Prisma migration | ⚠️ Medium | When you want interactive flow |
| `npm run db:push` | Quick push without migration files | ⚠️ Medium | Never - conflicts with migrate |
| `npm run db:restore` | Interactive backup restore | ✅ Safe | When you need to recover data |
| `npm run db:seed` | Repopulate with seed data | ✅ Safe | Only if you want demo data |
| `npm run db:studio` | Visual database inspector | ✅ Read-only | For data inspection/debugging |

## 🎓 Best Practices

### ✅ DO:

- ✅ Use `npm run db:migrate` for all schema changes
- ✅ Check backups exist before making major changes: `ls backups/`
- ✅ Use `npm run db:restore` if anything looks wrong
- ✅ Keep sensitive data in environment variables, not database
- ✅ Review migrations before committing to git: `git diff prisma/migrations/`

### ❌ DON'T:

- ❌ Manually delete `dev.db` (use backup restore instead)
- ❌ Run `prisma migrate dev` directly (use `npm run db:migrate`)
- ❌ Commit `dev.db` or `backups/` to git
- ❌ Use `touch dev.db` to reset (creates empty file)
- ❌ Ignore warnings from migration scripts

## 🔧 Troubleshooting

### "Cannot create migrations in a production-like environment"

This means Prisma detected you're using a push-based workflow. Solution:

```bash
rm -rf prisma/migrations
npm run db:migrate -- --name init
```

### All my data disappeared after migration!

Don't panic! Restore it:

```bash
npm run db:restore
# Select the backup before the problematic migration
```

### Backup folder is getting large

Oldest backups are automatically rotated (kept: last 10). To manually clean:

```bash
ls -t backups/ | tail -n +11 | xargs -I {} rm backups/{}
```

### SQLite corruption error

Try rebuilding the database:

```bash
npm run db:restore
# Select most recent backup
npm run db:seed  # Optional: reseed demo data
```

## 📖 Schema Change Workflow (Checklist)

Before making schema changes:

- [ ] Ensure no unsaved work in database
- [ ] Run `ls backups/` to verify backup directory exists
- [ ] Review your schema changes in `prisma/schema.prisma`
- [ ] Run `npm run db:migrate -- --name descriptive_name`
- [ ] Verify changes: `npm run db:studio`
- [ ] Test application: `npm run dev`
- [ ] If issues, run `npm run db:restore`

## 📞 Quick Reference

```bash
# Normal development (no schema changes)
npm run dev

# Modify schema and apply changes safely
npm run db:migrate -- --name feature_name

# Accidentally broke things?
npm run db:restore

# View data visually
npm run db:studio

# Reset to seed data
npm run db:seed
```

---

**Last Updated:** February 2025  
**Created for:** Task Manager RPG  
**Database:** SQLite (file:./dev.db)
