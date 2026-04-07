export function RoomCard({ room }) {
  return (
    <article className="room-card">
      <div className="room-card__image" aria-hidden="true">
        {room.imageUrl ? (
          <img src={room.imageUrl} alt="" />
        ) : (
          <div className="room-card__image-placeholder">Sem foto</div>
        )}
      </div>

      <div className="room-card__content">
        <div className="room-card__header">
          <h2>{room.title}</h2>
          <p>{room.dailyRateLabel} / noite</p>
        </div>

        {room.tags.length > 0 ? (
          <ul className="room-card__tags" aria-label={`Diferenciais de ${room.title}`}>
            {room.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
