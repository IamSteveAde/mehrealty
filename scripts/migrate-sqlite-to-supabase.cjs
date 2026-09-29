const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");
const { PrismaClient } = require("@prisma/client");

const sqlitePath = path.join(__dirname, "../prisma/dev.db");

if (!fs.existsSync(sqlitePath)) {
  throw new Error(`SQLite database not found: ${sqlitePath}`);
}

if (!process.env.DATABASE_URL?.startsWith("postgresql://") &&
    !process.env.DATABASE_URL?.startsWith("postgres://")) {
  throw new Error("DATABASE_URL must point to Supabase PostgreSQL.");
}

const sqlite = new Database(sqlitePath, {
  readonly: true,
  fileMustExist: true,
});

const prisma = new PrismaClient();

function getRows(table) {
  return sqlite.prepare(`SELECT * FROM "${table}"`).all();
}

function toDate(value) {
  if (value instanceof Date) return value;

  if (typeof value === "number") {
    return new Date(value);
  }

  if (typeof value === "string") {
    const numeric = Number(value);

    if (/^\d+$/.test(value)) {
      return new Date(
        numeric < 100000000000 ? numeric * 1000 : numeric
      );
    }

    return new Date(value);
  }

  throw new Error(`Invalid date: ${value}`);
}

function toBoolean(value) {
  return value === true || value === 1 || value === "1";
}

async function migrate() {
  const projects = getRows("Project");
  const posts = getRows("Post");
  const settings = getRows("Setting");
  const users = getRows("User");

  console.log("SQLite records found:");
  console.log({
    projects: projects.length,
    posts: posts.length,
    settings: settings.length,
    users: users.length,
  });

  for (const row of projects) {
    await prisma.project.upsert({
      where: { id: row.id },
      create: {
        ...row,
        featured: toBoolean(row.featured),
        published: toBoolean(row.published),
        createdAt: toDate(row.createdAt),
        updatedAt: toDate(row.updatedAt),
      },
      update: {
        ...row,
        featured: toBoolean(row.featured),
        published: toBoolean(row.published),
        createdAt: toDate(row.createdAt),
        updatedAt: toDate(row.updatedAt),
      },
    });
  }

  for (const row of posts) {
    await prisma.post.upsert({
      where: { id: row.id },
      create: {
        ...row,
        published: toBoolean(row.published),
        createdAt: toDate(row.createdAt),
        updatedAt: toDate(row.updatedAt),
      },
      update: {
        ...row,
        published: toBoolean(row.published),
        createdAt: toDate(row.createdAt),
        updatedAt: toDate(row.updatedAt),
      },
    });
  }

  for (const row of settings) {
    await prisma.setting.upsert({
      where: { key: row.key },
      create: row,
      update: { value: row.value },
    });
  }

  for (const row of users) {
    if (!/^\$2[aby]\$\d{2}\$|^\$argon2(?:id|i|d)\$/.test(row.password)) {
      console.warn(
        `Skipping user ${row.email}: password hash format not recognised.`
      );
      continue;
    }

    await prisma.user.upsert({
      where: { id: row.id },
      create: {
        id: row.id,
        email: row.email,
        password: row.password,
        createdAt: toDate(row.createdAt),
      },
      update: {},
    });
  }

  console.log("Migration completed.");
}

migrate()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    sqlite.close();
    await prisma.$disconnect();
  });