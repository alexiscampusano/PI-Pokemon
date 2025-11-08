import redis from '../config/redis';
import { PokemonAttributes } from '../types';

const CACHE_TTL = 60 * 60 * 24; // 24 hours in seconds
const CACHE_KEY_PREFIX = 'pokemon:';
const CACHE_KEY_ALL = 'pokemon:all';

export class CacheService {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await redis.get(`${CACHE_KEY_PREFIX}${key}`);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl: number = CACHE_TTL): Promise<void> {
    try {
      await redis.setex(`${CACHE_KEY_PREFIX}${key}`, ttl, JSON.stringify(value));
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await redis.del(`${CACHE_KEY_PREFIX}${key}`);
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await redis.keys(`${CACHE_KEY_PREFIX}*`);
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } catch (error) {
      console.error('Cache clear error:', error);
    }
  }

  async getAllPokemons(): Promise<PokemonAttributes[] | null> {
    return this.get<PokemonAttributes[]>(CACHE_KEY_ALL);
  }

  async setAllPokemons(pokemons: PokemonAttributes[]): Promise<void> {
    await this.set(CACHE_KEY_ALL, pokemons, CACHE_TTL);
  }

  async clearAllPokemons(): Promise<void> {
    await this.delete(CACHE_KEY_ALL);
  }
}

export default new CacheService();

