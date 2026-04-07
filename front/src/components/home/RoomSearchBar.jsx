export function RoomSearchBar({ filters, onChange, onSubmit }) {
  return (
    <form className="room-search-bar" onSubmit={onSubmit}>
      <div className="room-search-bar__field">
        <label htmlFor="check-in">Check-in</label>
        <input
          id="check-in"
          name="checkIn"
          type="date"
          value={filters.checkIn}
          onChange={onChange}
        />
      </div>

      <div className="room-search-bar__field">
        <label htmlFor="check-out">Check-out</label>
        <input
          id="check-out"
          name="checkOut"
          type="date"
          value={filters.checkOut}
          onChange={onChange}
        />
      </div>

      <button className="room-search-bar__button" type="submit">
        Buscar disponibilidade
      </button>
    </form>
  );
}
