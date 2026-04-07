import { useEffect, useId, useRef, useState } from 'react';

const roomTypeOptions = [
  { value: '', label: 'Todos os quartos' },
  { value: 'standard', label: 'Standard' },
  { value: 'luxo', label: 'Luxo' },
  { value: 'suite', label: 'Suite' },
];

export function RoomSearchBar({ filters, onChange, onSubmit }) {
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const typeButtonRef = useRef(null);
  const typeMenuRef = useRef(null);
  const typeListboxId = useId();
  const selectedTypeLabel = roomTypeOptions.find((option) => option.value === filters.type)?.label
    || roomTypeOptions[0].label;

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        typeButtonRef.current?.contains(event.target)
        || typeMenuRef.current?.contains(event.target)
      ) {
        return;
      }

      setIsTypeMenuOpen(false);
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsTypeMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function handleTypeSelect(value) {
    onChange({
      target: {
        name: 'type',
        value,
      },
    });
    setIsTypeMenuOpen(false);
  }

  return (
    <div className="search-section">
      <form className="search-bar" onSubmit={onSubmit}>
        <div className="search-field">
          <label htmlFor="check-in">Check-in</label>
          <input
            id="check-in"
            name="checkIn"
            type="date"
            value={filters.checkIn}
            onChange={onChange}
          />
        </div>

        <div className="search-field">
          <label htmlFor="check-out">Check-out</label>
          <input
            id="check-out"
            name="checkOut"
            type="date"
            value={filters.checkOut}
            onChange={onChange}
          />
        </div>

        <div className="search-field search-field--dropdown">
          <span className="search-field__label">Tipo</span>
          <button
            ref={typeButtonRef}
            aria-controls={typeListboxId}
            aria-expanded={isTypeMenuOpen}
            aria-haspopup="listbox"
            className="search-select-button"
            type="button"
            onClick={() => setIsTypeMenuOpen((current) => !current)}
          >
            <span>{selectedTypeLabel}</span>
          </button>

          {isTypeMenuOpen ? (
            <div ref={typeMenuRef} className="search-select-panel">
              <ul aria-label="Tipo de quarto" className="search-select-options" id={typeListboxId} role="listbox">
                {roomTypeOptions.map((option) => (
                  <li key={option.value || 'all'} role="presentation">
                    <button
                      aria-selected={filters.type === option.value}
                      className={`search-select-option ${
                        filters.type === option.value ? 'search-select-option--active' : ''
                      }`}
                      role="option"
                      type="button"
                      onClick={() => handleTypeSelect(option.value)}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <button className="btn-search" type="submit" aria-label="Buscar disponibilidade">
          Buscar
        </button>
      </form>
    </div>
  );
}
