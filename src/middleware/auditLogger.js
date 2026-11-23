import jwt from 'jsonwebtoken';
import { create as createActivityLog } from '../repositories/activityLogRepository.js';
import { findById as findUserById } from '../repositories/userRepository.js';

function getPathWithoutQuery(req) {
  const rawUrl = req.originalUrl || req.url || '/';
  return rawUrl.split('?')[0] || '/';
}

async function resolveUserFromRequest(req) {
  if (req.user?.id) {
    return req.user;
  }

  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  if (scheme !== 'Bearer' || !token || !process.env.JWT_SECRET) {
    return null;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    const user = await findUserById(Number(payload.sub));
    return user ?? null;
  } catch {
    return null;
  }
}

export function auditLogger(req, res, next) {
  res.on('finish', async () => {
    try {
      const user = await resolveUserFromRequest(req);
      if (!user?.id) {
        return;
      }

      await createActivityLog({
        userId: user.id,
        method: req.method,
        path: getPathWithoutQuery(req),
        statusCode: res.statusCode,
      });
    } catch (err) {
      console.error('Error al registrar actividad:', err.message);
    }
  });

  next();
}