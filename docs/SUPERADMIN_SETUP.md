# Superadmin User Creation Guide

This guide explains how to create a superadmin user in the Neon database for the Santa Monica Burgers admin panel.

## Database Schema Overview

The project uses PostgreSQL via Neon database with the following admin structure:

- **Table**: `admin_users`
- **Roles**: `admin`, `super_admin`
- **Authentication**: Password hashing with bcryptjs
- **Session Management**: Secure token-based sessions

## Prerequisites

1. **Neon Database Access**: You need access to your Neon database console
2. **Database URL**: Ensure `DATABASE_URL` is set in your environment variables
3. **Drizzle CLI**: Available via `npm run db:studio` for GUI access

## Method 1: Using Neon Database Console (Recommended)

### Step 1: Access Neon Console

1. Go to [Neon Console](https://console.neon.tech/)
2. Navigate to your project
3. Click on "SQL Editor" or use the "Query" tab

### Step 2: Generate Password Hash

First, you need to hash your desired password. Use this Node.js script locally:

```javascript
// Run this in a Node.js environment or create a temporary script
const bcrypt = require('bcryptjs');

const password = 'your-secure-password-here';
const saltRounds = 12;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) console.error(err);
  else console.log('Hashed password:', hash);
});
```

Or use the synchronous version:
```javascript
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your-secure-password-here', 12);
console.log(hash);
```

### Step 3: Insert Superadmin User

Execute this SQL query in the Neon console (replace the values):

```sql
INSERT INTO admin_users (
  id,
  email,
  name,
  password_hash,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'superadmin@santamonicaburgers.com',
  'Super Administrator',
  '$2a$12$your-hashed-password-here',
  'super_admin',
  true,
  NOW(),
  NOW()
);
```

### Step 4: Verify Creation

```sql
SELECT id, email, name, role, is_active, created_at 
FROM admin_users 
WHERE role = 'super_admin';
```

## Method 2: Using Drizzle Studio

### Step 1: Open Drizzle Studio
```bash
npm run db:studio
```

### Step 2: Navigate to admin_users Table

1. Open your browser to the Drizzle Studio URL (usually `https://local.drizzle.studio`)
2. Select the `admin_users` table

### Step 3: Insert New Record

Click "Add new record" and fill in:
- **id**: Leave empty (auto-generated UUID)
- **email**: `superadmin@santamonicaburgers.com`
- **name**: `Super Administrator`
- **password_hash**: Your bcrypt-hashed password
- **role**: `super_admin`
- **is_active**: `true`
- **created_at**: Current timestamp
- **updated_at**: Current timestamp

## Method 3: Using Database Seed Script

Create a seed script for automated superadmin creation:

### Step 1: Create Seed Script

Create `scripts/create-superadmin.js`:

```javascript
const { drizzle } = require('drizzle-orm/neon-serverless');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const bcrypt = require('bcryptjs');
const { adminUsers } = require('../src/lib/db/schema');

// Configure for serverless
neonConfig.fetchConnectionCache = true;

async function createSuperadmin() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  const email = process.argv[2] || 'superadmin@santamonicaburgers.com';
  const password = process.argv[3] || 'ChangeMeNow123!';
  const name = process.argv[4] || 'Super Administrator';

  try {
    // Check if superadmin already exists
    const existing = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email))
      .limit(1);

    if (existing.length > 0) {
      console.log('❌ Superadmin with this email already exists');
      process.exit(1);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Insert superadmin
    const result = await db
      .insert(adminUsers)
      .values({
        email,
        name,
        passwordHash,
        role: 'super_admin',
        isActive: true,
      })
      .returning();

    console.log('✅ Superadmin created successfully:');
    console.log(`   ID: ${result[0].id}`);
    console.log(`   Email: ${result[0].email}`);
    console.log(`   Name: ${result[0].name}`);
    console.log(`   Role: ${result[0].role}`);
    
    console.log('\n🔐 Login credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');

  } catch (error) {
    console.error('❌ Error creating superadmin:', error);
  } finally {
    await pool.end();
  }
}

createSuperadmin();
```

### Step 2: Add Script to package.json

Add this script to your `package.json`:

```json
{
  "scripts": {
    "create-superadmin": "node scripts/create-superadmin.js"
  }
}
```

### Step 3: Run the Script

```bash
# With default values
npm run create-superadmin

# With custom values
npm run create-superadmin your-email@domain.com your-password "Your Name"
```

## Method 4: Using Vercel CLI with Database Connection

If your app is deployed on Vercel, you can use the Vercel CLI to access your database:

### Step 1: Install and Login to Vercel CLI

```bash
npm i -g vercel
vercel login
```

### Step 2: Link Your Project

```bash
vercel link
```

### Step 3: Access Environment Variables

```bash
vercel env pull .env.local
```

### Step 4: Run Local Script with Production Database

Use the seed script method above with your production database URL.

## Security Best Practices

1. **Strong Password**: Use a complex password with at least 12 characters
2. **Unique Email**: Use a dedicated email address for the superadmin
3. **Change Default Password**: Always change the password after first login
4. **Regular Rotation**: Rotate superadmin passwords periodically
5. **Audit Logging**: Monitor superadmin access in your application logs

## Accessing the Admin Panel

After creating the superadmin user, you can access the admin panel at:

- **Spanish (Default)**: `https://yourdomain.com/es/admin/login`
- **English**: `https://yourdomain.com/en/admin/login`

## Troubleshooting

### Password Hash Issues
- Ensure you're using bcryptjs version 2.4.3 or compatible
- Use salt rounds of 10-12 for good security/performance balance
- Verify the hash starts with `$2a$` or `$2b$`

### Database Connection Issues
- Verify `DATABASE_URL` is correctly set
- Check Neon database is active and not paused
- Ensure IP allowlist includes your connection source

### Login Issues
- Verify the user `is_active` is set to `true`
- Check that the role is exactly `super_admin` (not `superadmin`)
- Ensure password hash matches exactly

## Role Permissions

Currently supported roles:
- **admin**: Basic admin access
- **super_admin**: Full administrative access

The role field in the database should be exactly `super_admin` for superuser privileges.

## Verification Query

To verify your superadmin was created correctly:

```sql
SELECT 
  id,
  email,
  name,
  role,
  is_active,
  created_at,
  LENGTH(password_hash) as hash_length
FROM admin_users 
WHERE role = 'super_admin'
ORDER BY created_at DESC;
```

The `password_hash` should be approximately 60 characters long for bcrypt hashes.