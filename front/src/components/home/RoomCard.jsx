function RoomThumb({ room }) {
  const palettes = {
    standard: { wall: '#d6e4f0', floor: '#c8a87a', accent: '#7fb3c8' },
    suite: { wall: '#e8ddd0', floor: '#8b7a5a', accent: '#6a9a60' },
    luxo: { wall: '#f0e8d8', floor: '#a08060', accent: '#c8a070' },
  };
  const palette = palettes[room.type] || palettes.standard;

  return (
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect width="360" height="200" fill={palette.wall} />
      <rect x="0" y="140" width="360" height="60" fill={palette.floor} />
      <rect x="80" y="60" width="200" height="120" rx="4" fill="#fff" opacity=".4" />
      <rect x="95" y="75" width="80" height="60" rx="6" fill={palette.accent} opacity=".7" />
      <rect x="185" y="75" width="80" height="60" rx="6" fill={palette.accent} opacity=".5" />
      <rect x="130" y="140" width="100" height="40" rx="4" fill={palette.floor} opacity=".8" />
      <circle cx="290" cy="50" r="28" fill="#f5d78e" opacity=".5" />
      <rect x="20" y="100" width="50" height="80" rx="3" fill={palette.accent} opacity=".4" />
      {!room.available ? <rect width="360" height="200" fill="rgba(0,0,0,.2)" /> : null}
    </svg>
  );
}

export function RoomCard({ room, onReserve }) {
  return (
    <article className="room-card">
      <div className="room-thumb">
        {room.imageUrl ? <img src={room.imageUrl} alt="" /> : <RoomThumb room={room} />}
        <span className={`room-badge ${room.available ? 'badge-disponivel' : 'badge-reservado'}`}>
          {room.available ? 'Disponivel' : 'Reservado'}
        </span>
      </div>

      <div className="room-body">
        <h2 className="room-name">{room.title}</h2>
        <p className="room-desc">{room.description}</p>

        <div className="room-meta">
          <div className="room-amenities">
            <span className="amenity">{room.amenities.capacity} hospedes</span>
            {room.amenities.wifi ? <span className="amenity">Wi-Fi</span> : null}
            {room.amenities.breakfast ? <span className="amenity">Cafe</span> : null}
          </div>

          <div className="room-price">
            <div className="price-val">{room.dailyRateLabel}</div>
            <div className="price-label">/ noite</div>
          </div>
        </div>

        <button
          className="btn-reservar"
          type="button"
          onClick={() => onReserve(room)}
          aria-label={`Reservar ${room.title}`}
          disabled={!room.available}
        >
          {room.available ? 'Reservar' : 'Indisponivel'}
        </button>
      </div>
    </article>
  );
}
