import { useEffect, useId, useState } from 'react';

function buildInitialValues(initialDates) {
  return {
    guestName: '',
    checkIn: initialDates?.checkIn || '',
    checkOut: initialDates?.checkOut || '',
  };
}

export function ReservationModal({ room, initialDates, onClose, onSubmit }) {
  const titleId = useId();
  const [values, setValues] = useState(() => buildInitialValues(initialDates));
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setValues(buildInitialValues(initialDates));
    setError('');
    setIsSubmitting(false);
  }, [initialDates, room]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } catch (submitError) {
      setError(submitError.message || 'Nao foi possivel criar a reserva.');
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay open" role="presentation" onClick={onClose}>
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="modal"
        role="dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId}>Reservar {room.title}</h2>
        <p className="modal-sub">{room.dailyRateLabel}/noite - confirme os dados abaixo.</p>

        <form className="reservation-modal__form" onSubmit={handleSubmit}>
          <label className="modal-field">
            <span>Nome completo</span>
            <input
              name="guestName"
              type="text"
              value={values.guestName}
              onChange={handleChange}
              placeholder="Seu nome"
            />
          </label>

          <div className="modal-dates">
            <label className="modal-field">
              <span>Check-in</span>
              <input name="checkIn" type="date" value={values.checkIn} onChange={handleChange} required />
            </label>

            <label className="modal-field">
              <span>Check-out</span>
              <input
                name="checkOut"
                type="date"
                value={values.checkOut}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          {error ? (
            <p className="reservation-modal__error" role="alert">
              {error}
            </p>
          ) : null}

          <div className="modal-actions">
            <button className="btn-cancel" type="button" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn-confirm" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Confirmando...' : 'Confirmar reserva'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
