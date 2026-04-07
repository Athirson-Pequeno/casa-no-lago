import { useEffect, useMemo, useState } from 'react';
import { demoRooms } from '../mocks/demoRooms';
import { createReservation } from '../services/reservations';
import { getRooms } from '../services/rooms';
import { buildInclusiveDateRange, hasDateConflict } from '../utils/dateRange';

const initialFilters = {
  checkIn: '',
  checkOut: '',
  type: '',
};

function shouldUseDemoRooms(error) {
  const message = (error?.message || '').toLowerCase();

  return (
    message.includes('failed to fetch')
    || message.includes('networkerror')
    || message.includes('resposta inesperada')
    || message.includes('resposta json invalida')
  );
}

export function useRoomsCatalog({
  isAuthenticated,
  onRequireLogin,
  token,
  withAvailabilityFilter = true,
}) {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [submittedFilters, setSubmittedFilters] = useState(initialFilters);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [status, setStatus] = useState({
    loading: true,
    error: '',
  });

  useEffect(() => {
    let isMounted = true;
    const nextFilters = initialFilters;

    setFilters(nextFilters);
    setSubmittedFilters(nextFilters);

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

        if (shouldUseDemoRooms(error)) {
          setRooms(demoRooms);
          setFeedbackMessage(
            'Exibindo um catalogo demonstrativo enquanto a API local nao responde.',
          );
          setStatus({ loading: false, error: '' });
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
  }, [withAvailabilityFilter]);

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

  function handleReserve(room) {
    setFeedbackMessage('');

    if (!isAuthenticated || !token) {
      onRequireLogin();
      return;
    }

    setSelectedRoom(room);
  }

  function handleCloseReservationModal() {
    setSelectedRoom(null);
  }

  async function handleReservationSubmit(values) {
    await createReservation({
      roomId: selectedRoom.id,
      checkIn: values.checkIn,
      checkOut: values.checkOut,
      token,
    });

    const reservedDates = buildInclusiveDateRange(values.checkIn, values.checkOut);

    setRooms((current) =>
      current.map((room) =>
        room.id === selectedRoom.id
          ? {
              ...room,
              bookedDates: [...room.bookedDates, ...reservedDates],
              available: false,
              isRented: true,
            }
          : room,
      ),
    );
    setFeedbackMessage('Reserva criada com sucesso.');
    setSelectedRoom(null);
  }

  const visibleRooms = useMemo(() => {
    if (!withAvailabilityFilter) {
      return rooms;
    }

    const selectedRange = buildInclusiveDateRange(
      submittedFilters.checkIn,
      submittedFilters.checkOut,
    );
    const typeFilteredRooms = submittedFilters.type
      ? rooms.filter((room) => room.type === submittedFilters.type)
      : rooms;

    if (selectedRange.length === 0) {
      return typeFilteredRooms;
    }

    return typeFilteredRooms.filter((room) => !hasDateConflict(room.bookedDates, selectedRange));
  }, [rooms, submittedFilters, withAvailabilityFilter]);

  return {
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
  };
}
