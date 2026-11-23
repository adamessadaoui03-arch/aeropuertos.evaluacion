import { AppError } from '../errors/AppError.js';
import { parseId } from './commonValidator.js';

export function parseUserId(rawUserId) {
  return parseId(rawUserId);
}

export function parseLimit(rawN) {
  if (rawN === undefined) {
    return null;
  }

  if (typeof rawN !== 'string' || !/^[1-9]\d*$/.test(rawN.trim())) {
    throw new AppError(422, 'VALIDATION_ERROR', 'El parámetro n debe ser un entero positivo.');
  }

  return Number(rawN.trim());
}