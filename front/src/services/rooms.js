import { request } from './http';
import { mapRoomFromApi } from '../utils/roomMapper';

export async function getRooms() {
  const rooms = await request('/quartos');
  return rooms.map(mapRoomFromApi);
}

function buildRoomPayload({ title, imageUrl, dailyRate }) {
  const nextImage = imageUrl?.trim();

  return {
    titulo: title.trim(),
    fotos: nextImage ? [nextImage] : [],
    valorDiaria: Number(dailyRate),
  };
}

export function createRoom({ title, imageUrl, dailyRate, token }) {
  return request('/quartos', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(buildRoomPayload({ title, imageUrl, dailyRate })),
  });
}

export function updateRoom({ roomId, title, imageUrl, dailyRate, token }) {
  return request(`/quartos/${roomId}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(buildRoomPayload({ title, imageUrl, dailyRate })),
  });
}

export function deleteRoom({ roomId, token }) {
  return request(`/quartos/${roomId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
