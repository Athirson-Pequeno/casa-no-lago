import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createRoom, deleteRoom, getRooms, updateRoom } from '../services/rooms';
import '../styles/admin.css';

const initialForm = {
  title: '',
  imageUrl: '',
  dailyRate: '',
};

export function AdminRoomsPage() {
  const { token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingRoomId, setEditingRoomId] = useState('');
  const [status, setStatus] = useState({
    loading: true,
    error: '',
    success: '',
  });

  useEffect(() => {
    loadRooms();
  }, []);

  async function loadRooms() {
    setStatus((current) => ({
      ...current,
      loading: true,
      error: '',
    }));

    try {
      const nextRooms = await getRooms();
      setRooms(nextRooms);
      setStatus((current) => ({
        ...current,
        loading: false,
      }));
    } catch (error) {
      setStatus({
        loading: false,
        error: error.message || 'Nao foi possivel carregar os quartos.',
        success: '',
      });
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingRoomId('');
  }

  function handleEdit(room) {
    setEditingRoomId(room.id);
    setForm({
      title: room.title,
      imageUrl: room.imageUrl || '',
      dailyRate: String(room.dailyRate || ''),
    });
    setStatus((current) => ({
      ...current,
      error: '',
      success: '',
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus((current) => ({
      ...current,
      error: '',
      success: '',
    }));

    try {
      if (editingRoomId) {
        await updateRoom({
          roomId: editingRoomId,
          title: form.title,
          imageUrl: form.imageUrl,
          dailyRate: form.dailyRate,
          token,
        });
      } else {
        await createRoom({
          title: form.title,
          imageUrl: form.imageUrl,
          dailyRate: form.dailyRate,
          token,
        });
      }

      await loadRooms();
      setStatus((current) => ({
        ...current,
        success: editingRoomId
          ? 'Quarto atualizado com sucesso.'
          : 'Quarto criado com sucesso.',
      }));
      resetForm();
    } catch (error) {
      setStatus((current) => ({
        ...current,
        error: error.message || 'Nao foi possivel salvar o quarto.',
      }));
    }
  }

  async function handleDelete(room) {
    setStatus((current) => ({
      ...current,
      error: '',
      success: '',
    }));

    try {
      await deleteRoom({ roomId: room.id, token });
      await loadRooms();
      setStatus((current) => ({
        ...current,
        success: 'Quarto excluido com sucesso.',
      }));

      if (editingRoomId === room.id) {
        resetForm();
      }
    } catch (error) {
      setStatus((current) => ({
        ...current,
        error: error.message || 'Nao foi possivel excluir o quarto.',
      }));
    }
  }

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <header className="admin-header">
          <div>
            <p className="admin-eyebrow">Area administrativa</p>
            <h1>Painel Administrativo</h1>
            <p className="admin-subtitle">
              Gerencie os quartos publicados e mantenha o catalogo atualizado.
            </p>
          </div>

          <Link className="admin-back" to="/">
            Voltar para o site
          </Link>
        </header>

        <section className="admin-grid">
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2>{editingRoomId ? 'Editar quarto' : 'Novo quarto'}</h2>

            <label className="admin-field">
              <span>Titulo do quarto</span>
              <input name="title" value={form.title} onChange={handleChange} required />
            </label>

            <label className="admin-field">
              <span>Foto principal</span>
              <input
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://"
              />
            </label>

            <label className="admin-field">
              <span>Valor da diaria</span>
              <input
                name="dailyRate"
                type="number"
                min="1"
                step="0.01"
                value={form.dailyRate}
                onChange={handleChange}
                required
              />
            </label>

            {status.error ? <p className="admin-feedback admin-feedback--error">{status.error}</p> : null}
            {status.success ? (
              <p className="admin-feedback admin-feedback--success">{status.success}</p>
            ) : null}

            <div className="admin-actions">
              <button className="admin-button admin-button--primary" type="submit">
                {editingRoomId ? 'Salvar alteracoes' : 'Adicionar quarto'}
              </button>

              {editingRoomId ? (
                <button className="admin-button" type="button" onClick={resetForm}>
                  Cancelar edicao
                </button>
              ) : null}
            </div>
          </form>

          <section className="admin-list" aria-label="Lista administrativa de quartos">
            <div className="admin-list__header">
              <h2>Quartos cadastrados</h2>
              <span>{rooms.length} itens</span>
            </div>

            {status.loading ? <p>Carregando quartos...</p> : null}

            {!status.loading ? (
              <div className="admin-cards">
                {rooms.map((room) => (
                  <article className="admin-room-card" key={room.id}>
                    <div>
                      <h3>{room.title}</h3>
                      <p>{room.dailyRateLabel} por noite</p>
                      <small>{room.type}</small>
                    </div>

                    <div className="admin-room-card__actions">
                      <button type="button" onClick={() => handleEdit(room)}>
                        {`Editar ${room.title}`}
                      </button>
                      <button type="button" onClick={() => handleDelete(room)}>
                        {`Excluir ${room.title}`}
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </section>
        </section>
      </section>
    </main>
  );
}
