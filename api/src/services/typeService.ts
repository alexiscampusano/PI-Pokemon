import { Type } from '../db';
import { fetchTypesFromAPI } from '../utils/apiService';

export class TypeService {
  async getAll() {
    const typesFromAPI = await fetchTypesFromAPI();

    for (const typeName of typesFromAPI) {
      await Type.findOrCreate({
        where: { name: typeName },
      });
    }

    const allTypes = await Type.findAll({
      order: [['name', 'ASC']],
    });

    return allTypes;
  }
}

export default new TypeService();
