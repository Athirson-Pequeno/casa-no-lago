import { useNavigate } from 'react-router-dom';
import { ReservationModal } from '../components/home/ReservationModal';
import { HeroSection } from '../components/home/HeroSection';
import { RoomsCatalogSection } from '../components/home/RoomsCatalogSection';
import { RoomSearchBar } from '../components/home/RoomSearchBar';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { useRoomsCatalog } from '../hooks/useRoomsCatalog';
import '../styles/home.css';

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  const {
    feedbackMessage,
    filters,
    handleCloseReservationModal,
    handleFilterChange,
    handleFilterSubmit,
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
  });

  return (
    <div className="home-page">
      <Navbar />

      <main>
        <HeroSection />
        <RoomSearchBar filters={filters} onChange={handleFilterChange} onSubmit={handleFilterSubmit} />
        <RoomsCatalogSection
          feedbackMessage={feedbackMessage}
          onReserve={handleReserve}
          previewLimit={3}
          rooms={visibleRooms}
          showAllLink
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
