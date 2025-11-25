/**
 * Database helper utilities for E2E tests
 * These functions allow tests to manipulate database state
 */

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "",
  max: 5,
  connectionTimeoutMillis: 50000,
});

/**
 * Desactiva todos los perfiles de menú dentro de una transacción.
 * Si algo falla, se hace rollback automático.
 */
export async function deactivateAllMenuProfiles(): Promise<number> {
  console.log("Url de la base de datos:", process.env.DATABASE_URL);
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const result = await client.query(
      'UPDATE menu_profiles SET is_active = false'
    );
    
    await client.query('COMMIT');
    
    return result.rowCount || 0;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Activate the default menu profile (to show menu items)
 */
export async function activateDefaultMenuProfile(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('UPDATE menu_profiles SET is_active = true WHERE is_default = true');
    console.log("Default menu profile activated.");
  } finally {
    console.log("Releasing database client.");
    client.release();
  }
}

/**
 * Clear all menu items (alternative approach to show Coming Soon)
 */
export async function clearAllMenuItems(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('DELETE FROM menu_profile_items');
  } finally {
    client.release();
  }
}

/**
 * Restore menu items by re-running the seed script
 * This is useful if you cleared items and need to restore them
 */
export async function restoreMenuItems(): Promise<void> {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);

  await execAsync('npm run db:seed');
}

/**
 * Mark all menu items as unavailable
 */
export async function markAllMenuItemsUnavailable(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('UPDATE menu_items SET is_available = false');
  } finally {
    client.release();
  }
}

/**
 * Mark all menu items as available
 */
export async function markAllMenuItemsAvailable(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query('UPDATE menu_items SET is_available = true');
  } finally {
    client.release();
  }
}

/**
 * Get count of active menu profiles
 */
export async function getActiveMenuProfilesCount(): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT COUNT(*) FROM menu_profiles WHERE is_active = true');
    return parseInt(result.rows[0].count);
  } finally {
    client.release();
  }
}

/**
 * Get count of available menu items in active profiles
 */
export async function getAvailableMenuItemsCount(): Promise<number> {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT COUNT(DISTINCT mi.id)
      FROM menu_items mi
      INNER JOIN menu_profile_items mpi ON mi.id = mpi.menu_item_id
      INNER JOIN menu_profiles mp ON mpi.menu_profile_id = mp.id
      WHERE mi.is_available = true AND mp.is_active = true
    `);
    return parseInt(result.rows[0].count);
  } finally {
    client.release();
  }
}

/**
 * Close the database pool (call this in global teardown if needed)
 */
export async function closeDatabasePool(): Promise<void> {
  await pool.end();
}
