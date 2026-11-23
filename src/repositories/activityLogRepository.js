import { pool } from '../config/database.js';

const SELECT_LOG = `
  SELECT id, user_id AS userId, created_at AS createdAt,
         method, path, status_code AS statusCode
    FROM activity_logs`;

export async function create({ userId, method, path, statusCode }) {
  const [result] = await pool.query(
    `INSERT INTO activity_logs (user_id, method, path, status_code)
     VALUES (?, ?, ?, ?)`,
    [userId, method, path, statusCode]
  );
  return { id: result.insertId, userId, method, path, statusCode };
}

export async function findByUserId(userId, limit = null) {
  if (limit !== null && limit !== undefined) {
    const safeLimit = Number(limit);
    if (!Number.isInteger(safeLimit) || safeLimit <= 0) {
      throw new Error('Límite de registros no válido.');
    }
    const [rows] = await pool.query(
      `${SELECT_LOG} WHERE user_id = ? ORDER BY id DESC LIMIT ${safeLimit}`,
      [userId]
    );
    return rows;
  }

  const [rows] = await pool.query(
    `${SELECT_LOG} WHERE user_id = ? ORDER BY id DESC`,
    [userId]
  );
  return rows;
}