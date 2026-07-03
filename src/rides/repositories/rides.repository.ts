import { Ride } from '../types/ride';
import { db } from '../../db/in-memory.db';

// Репозиторий (DAL) отвечает ТОЛЬКО за доступ к данным поездок в in-memory-хранилище.
export const ridesRepository = {
  findAll(): Ride[] {
    return db.rides;
  },

  findById(id: number): Ride | null {
    return db.rides.find((r) => r.id === id) ?? null;
  },

  // Принимает доменные поля без id (id генерируем здесь) и возвращает созданную поездку.
  create(newRide: Omit<Ride, 'id'>): Ride {
    const lastRide = db.rides[db.rides.length - 1];
    const created: Ride = {
      id: lastRide ? lastRide.id + 1 : 1,
      ...newRide,
    };

    db.rides.push(created);
    return created;
  },
};
