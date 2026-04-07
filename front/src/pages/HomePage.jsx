import { useEffect, useMemo, useState } from 'react';
import { Footer } from '../components/layout/Footer';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/home/HeroSection';
import { RoomGrid } from '../components/home/RoomGrid';
import { RoomSearchBar } from '../components/home/RoomSearchBar';
import { getRooms } from '../services/rooms';
import { buildInclusiveDateRange, hasDateConflict } from '../utils/dateRange';
import '../styles/home.css';

const initialFilters = {
  checkIn: '',
  checkOut: '',
};

export function HomePage() {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [submittedFilters, setSubmittedFilters] = useState(initialFilters);
  const [status, setStatus] = useState({
    loading: true,
    error: '',
  });

  useEffect(() => {
    let isMounted = true;

    async function loadRooms() {
      try {
        const response = await getRooms();

        if (!isMounted) {
          return;
        }

        setRooms(response);
        setStatus({ loading: false, error: '' });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setStatus({
          loading: false,
          error: error.message || 'Nao foi possivel carregar os quartos.',
        });
      }
    }

    loadRooms();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleFilterChange(event) {
    const { name, value } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleFilterSubmit(event) {
    event.preventDefault();
    setSubmittedFilters(filters);
  }

  const visibleRooms = useMemo(() => {
    const selectedRange = buildInclusiveDateRange(
      submittedFilters.checkIn,
      submittedFilters.checkOut,
    );

    if (selectedRange.length === 0) {
      return rooms;
    }

    return rooms.filter((room) => !hasDateConflict(room.bookedDates, selectedRange));
  }, [rooms, submittedFilters]);

  return (
    <div className="home-page">
      <Navbar />
      <main>
        <HeroSection />

        <section className="home-page__content">
          <div className="container">
            <RoomSearchBar
              filters={filters}
              onChange={handleFilterChange}
              onSubmit={handleFilterSubmit}
            />

            {status.loading ? (
              <p className="home-page__status">Carregando acomodações...</p>
            ) : null}

            {status.error ? (
              <p className="home-page__status home-page__status--error" role="alert">
                {status.error}
              </p>
            ) : null}

            {!status.loading && !status.error ? (
              <section id="acomodacoes" aria-label="Lista de quartos">
                <RoomGrid rooms={visibleRooms} />
              </section>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
