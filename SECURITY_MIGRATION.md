# Security Migration Guide

This document outlines the database migrations needed for the security improvements.

## Required Database Changes

### 1. Update Admin Sessions Table
```sql
-- Add new columns to admin_sessions table
ALTER TABLE admin_sessions 
ADD COLUMN ip_address VARCHAR(45),
ADD COLUMN user_agent TEXT,
ADD COLUMN last_access_at TIMESTAMP DEFAULT NOW();

-- Update existing sessions to have last_access_at
UPDATE admin_sessions SET last_access_at = created_at WHERE last_access_at IS NULL;
```

### 2. Create Rate Limiting Table
```sql
-- Create rate limiting table
CREATE TABLE rate_limiting (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255) NOT NULL,
  action VARCHAR(50) NOT NULL,
  attempts INTEGER DEFAULT 1 NOT NULL,
  last_attempt TIMESTAMP DEFAULT NOW() NOT NULL,
  locked_until TIMESTAMP,
  UNIQUE(identifier, action)
);
```

## Running Migrations

### Using Drizzle
```bash
# Push schema changes to database
npm run db:push

# Or generate and run migrations
npx drizzle-kit generate
npx drizzle-kit migrate
```

### Manual Migration
If you prefer to run SQL manually:
1. Connect to your PostgreSQL database
2. Run the SQL commands above
3. Verify tables are created correctly

## Post-Migration Steps

1. **Test Authentication**: Verify admin login still works
2. **Test Rate Limiting**: Try multiple failed login attempts
3. **Monitor Logs**: Check for any security-related warnings
4. **Set up Cleanup Job**: Schedule periodic session cleanup

## Security Features Added

- **Secure Token Generation**: Uses Web Crypto API instead of Math.random()
- **Rate Limiting**: IP and email-based login attempt limiting
- **Session Binding**: Sessions tied to IP and User-Agent
- **Security Headers**: Added comprehensive security headers
- **Session Cleanup**: Automatic cleanup of expired sessions
- **Session Invalidation**: Compromised sessions are automatically deleted

## Monitoring

Monitor these logs for security events:
- Failed login attempts exceeding rate limits
- Session binding validation failures
- Token generation issues
- Database errors in security functions