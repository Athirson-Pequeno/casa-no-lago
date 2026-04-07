import { Link } from 'react-router-dom';
import { RoomGrid } from './RoomGrid';
import { sortRoomsByNewest } from '../../utils/roomSort';

export function RoomsCatalogSection({
  feedbackMessage,
  heading = 'Nossos quartos',
  id = 'quartos',
  onReserve,
  previewLimit = null,
  rooms,
  showAllLink = false,
  status,
}) {
  const orderedRooms = sortRoomsByNewest(rooms);
  const visibleRooms = previewLimit ? orderedRooms.slice(0, previewLimit) : orderedRooms;
  const totalRooms = orderedRooms.length;
  const availableRooms = orderedRooms.filter((room) => room.available).length;
  const reservedRooms = totalRooms - availableRooms;

  return (
    <section className="section room-catalog" id={id} aria-label="Lista de quartos">
      <div className="section-header room-catalog__header">
        <h2 className="section-title">{heading.split(' ')[0]} <span>{heading.split(' ').slice(1).join(' ')}</span></h2>
        {showAllLink ? (
          <Link className="section-link section-link--pill" to="/quartos">
            Ver todos
          </Link>
        ) : null}
      </div>

      {status.loading ? <p className="home-page__status">Carregando acomodacoes...</p> : null}

      {status.error ? (
        <p className="home-page__status home-page__status--error" role="alert">
          {status.error}
        </p>
      ) : null}

      {feedbackMessage ? (
        <p
          className={`home-page__status ${
            feedbackMessage.includes('catalogo demonstrativo')
              ? 'home-page__status--info'
              : 'home-page__status--success'
          }`}
        >
          {feedbackMessage}
        </p>
      ) : null}

      {!status.loading && !status.error ? (
        <>
          <div className="stats-row room-catalog__stats">
            <div className="stat">
              <div className="stat-num">{totalRooms}</div>
              <div className="stat-label">Quartos</div>
            </div>
            <div className="stat">
              <div className="stat-num">{availableRooms}</div>
              <div className="stat-label">Disponiveis</div>
            </div>
            <div className="stat">
              <div className="stat-num">{reservedRooms}</div>
              <div className="stat-label">Reservados</div>
            </div>
          </div>

          <RoomGrid rooms={visibleRooms} onReserve={onReserve} />
        </>
      ) : null}
    </section>
  );
}
