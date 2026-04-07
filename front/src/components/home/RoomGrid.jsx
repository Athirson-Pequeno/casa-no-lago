import { RoomCard } from './RoomCard';

export function RoomGrid({ rooms, onReserve }) {
  if (rooms.length === 0) {
    return (
      <div className="room-grid__empty">
        <p>Nenhum quarto disponivel para o periodo selecionado.</p>
      </div>
    );
  }

  return (
    <div className="rooms-grid">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onReserve={onReserve} />
      ))}
    </div>
  );
}
