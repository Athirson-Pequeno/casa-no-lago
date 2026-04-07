import { request } from './http';

export function createReservation({ roomId, checkIn, checkOut, token }) {
  return request('/reservas', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      quartoId: roomId,
      diaria: {
        dataInicio: checkIn,
        dataFim: checkOut,
      },
    }),
  });
}
