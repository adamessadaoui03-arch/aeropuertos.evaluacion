import { AppError } from '../errors/AppError.js';
import { parseLimit, parseUserId } from '../validators/logValidator.js';
import { findById as findUserById } from '../repositories/userRepository.js';
import { findByUserId as findLogsByUserId } from '../repositories/activityLogRepository.js';

export async function getUserActivityLogs(req, res, next) {
  try {
    const userId = parseUserId(req.params.userId);
    const limit = parseLimit(req.query.n);

    const user = await findUserById(userId);
    if (!user) {
      throw new AppError(404, 'NOT_FOUND', 'Usuario no encontrado.');
    }

    const logs = await findLogsByUserId(userId, limit);
    return res.status(200).json(logs);
  } catch (err) {
    return next(err);
  }
}