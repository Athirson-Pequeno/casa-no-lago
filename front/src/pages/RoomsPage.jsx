import { useNavigate } from 'react-router-dom';
import { ReservationModal } from '../components/home/ReservationModal';
import { RoomsCatalogSection } from '../components/home/RoomsCatalogSection';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { useRoomsCatalog } from '../hooks/useRoomsCatalog';
import '../styles/home.css';

export function RoomsPage() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const {
    feedbackMessage,
    handleCloseReservationModal,
    handleReservationSubmit,
    handleReserve,
    selectedRoom,
    status,
    submittedFilters,
    visibleRooms,
  } = useRoomsCatalog({
    isAuthenticated,
    onRequireLogin: () => navigate('/login'),
    token,
    withAvailabilityFilter: false,
  });

  return (
    <div className="home-page rooms-page">
      <Navbar />

      <main className="rooms-page__main">
        <section className="rooms-page__intro">
          <p className="rooms-page__eyebrow">Catalogo completo</p>
          <h1 className="rooms-page__title">Todos os quartos</h1>
        </section>

        <RoomsCatalogSection
          feedbackMessage={feedbackMessage}
          heading="Nossos quartos"
          onReserve={handleReserve}
          rooms={visibleRooms}
          status={status}
        />
      </main>

      <Footer />

      {selectedRoom ? (
        <ReservationModal
          room={selectedRoom}
          initialDates={submittedFilters}
          onClose={handleCloseReservationModal}
          onSubmit={handleReservationSubmit}
        />
      ) : null}
    </div>
  );
}
