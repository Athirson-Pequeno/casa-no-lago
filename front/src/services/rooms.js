import { request } from './http';
import { mapRoomFromApi } from '../utils/roomMapper';

export async function getRooms() {
  const rooms = await request('/quartos');
  return rooms.map(mapRoomFromApi);
}
