import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, isTokenValid } from '../lib/api.js'
import styles from './Admin.module.css'

function useAdmin() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!isTokenValid()) { navigate('/login'); return }
    api.get('/reservas').then(({ status }) => {
      if (status === 403) navigate('/')
      else setReady(true)
    })
  }, [navigate])

  return ready
}

function StatCard({ label, value, color }) {
  return (
    <div className={styles.statCard} style={{ borderTopColor: color }}>
      <div className={styles.statVal}>{value ?? '—'}</div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  )
}

function Modal({ title, onClose, children }) {
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>{title}</h3>
          <button className={styles.modalClose} onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t) }, [onDone])
  return <div className={styles.toast}>{msg}</div>
}

export default function Admin() {
  const ready = useAdmin()

  const [tab, setTab]           = useState('dashboard')
  const [quartos, setQuartos]   = useState([])
  const [reservas, setReservas] = useState([])
  const [clientes, setClientes] = useState([])
  const [tags, setTags]         = useState([])
  const [toast, setToast]       = useState(null)
  const [loading, setLoading]   = useState(false)

  const [quartoModal, setQuartoModal] = useState(null)
  const [tagModal, setTagModal]       = useState(false)
  const [tagVincModal, setTagVincModal] = useState(null)

  const notify = msg => setToast(msg)

  const loadAll = useCallback(async () => {
    setLoading(true)
    const [q, r, c, t] = await Promise.all([
      api.get('/quartos'),
      api.get('/reservas'),
      api.get('/clientes'),
      api.get('/tags'),
    ])
    if (q.ok) setQuartos(q.data)
    if (r.ok) setReservas(r.data)
    if (c.ok) setClientes(c.data)
    if (t.ok) setTags(t.data)
    setLoading(false)
  }, [])

  useEffect(() => { if (ready) loadAll() }, [ready, loadAll])

  if (!ready) return null

  return (
    <div className={styles.page}>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.logo}>Casa do <span>Lago</span></Link>
        <nav className={styles.nav}>
          {['dashboard','quartos','reservas','clientes','tags'].map(t => (
            <button
              key={t}
              className={`${styles.navBtn} ${tab === t ? styles.active : ''}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </nav>
        <Link to="/" className={styles.backLink}>← Voltar ao site</Link>
      </aside>

      <main className={styles.main}>
        <div className={styles.topbar}>
          <h1 className={styles.pageTitle}>Painel Admin</h1>
        </div>

        {tab === 'dashboard' && (
          <Dashboard quartos={quartos} reservas={reservas} clientes={clientes} loading={loading} />
        )}
        {tab === 'quartos' && (
          <Quartos
            quartos={quartos} tags={tags}
            onNew={() => setQuartoModal({})}
            onEdit={q => setQuartoModal(q)}
            onVincTag={q => setTagVincModal(q)}
            onDelete={async q => {
              if (!confirm(`Deletar "${q.titulo}"?`)) return
              const { ok, data } = await api.delete(`/quartos/${q._id}`)
              if (ok) { notify('Quarto deletado.'); loadAll() }
              else notify(data.erro || 'Erro ao deletar.')
            }}
          />
        )}
        {tab === 'reservas' && (
          <Reservas
            reservas={reservas}
            onDelete={async r => {
              if (!confirm('Cancelar esta reserva?')) return
              const { ok, data } = await api.delete(`/reservas/${r._id}`)
              if (ok) { notify('Reserva cancelada.'); loadAll() }
              else notify(data.erro || 'Erro ao cancelar.')
            }}
          />
        )}
        {tab === 'clientes' && (
          <Clientes
            clientes={clientes}
            onDelete={async c => {
              if (!confirm('Deletar este cliente?')) return
              const { ok, data } = await api.delete(`/clientes/${c._id}`)
              if (ok) { notify('Cliente deletado.'); loadAll() }
              else notify(data.erro || 'Erro ao deletar.')
            }}
          />
        )}
        {tab === 'tags' && (
          <Tags
            tags={tags}
            onNew={() => setTagModal(true)}
            onDelete={async t => {
              if (!confirm(`Deletar tag "${t.nome}"?`)) return
              const { ok, data } = await api.delete(`/tags/${t._id}`)
              if (ok) { notify('Tag deletada.'); loadAll() }
              else notify(data.erro || 'Erro ao deletar.')
            }}
          />
        )}
      </main>

      {quartoModal !== null && (
        <QuartoModal
          quarto={quartoModal}
          onClose={() => setQuartoModal(null)}
          onSave={async body => {
            const isEdit = !!quartoModal._id
            const { ok, data } = isEdit
              ? await api.put(`/quartos/${quartoModal._id}`, body)
              : await api.post('/quartos', body)
            if (ok) { notify(isEdit ? 'Quarto atualizado.' : 'Quarto criado.'); setQuartoModal(null); loadAll() }
            else notify(data.erro || 'Erro ao salvar.')
          }}
        />
      )}

      {tagModal && (
        <TagModal
          onClose={() => setTagModal(false)}
          onSave={async nome => {
            const { ok, data } = await api.post('/tags', { nome })
            if (ok) { notify('Tag criada.'); setTagModal(false); loadAll() }
            else notify(data.erro || 'Erro ao criar tag.')
          }}
        />
      )}

      {tagVincModal && (
        <TagVincModal
          quarto={tagVincModal}
          tags={tags}
          onClose={() => setTagVincModal(null)}
          onAdd={async tagId => {
            const { ok, data } = await api.post('/tags/adicionar', { quartoId: tagVincModal._id, tagId })
            if (ok) { notify('Tag vinculada.'); loadAll() }
            else notify(data.erro || 'Erro.')
          }}
          onRemove={async tagId => {
            const { ok, data } = await api.post('/tags/remover', { quartoId: tagVincModal._id, tagId })
            if (ok) { notify('Tag removida.'); loadAll() }
            else notify(data.erro || 'Erro.')
          }}
        />
      )}

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  )
}

function Dashboard({ quartos, reservas, clientes, loading }) {
  const disponiveis = quartos.filter(q => !q.estaAlugado).length
  const valorTotal  = reservas.reduce((s, r) => s + (r.diaria?.valor || 0), 0)

  return (
    <div>
      <div className={styles.statsGrid}>
        <StatCard label="Quartos"     value={loading ? '…' : quartos.length}   color="var(--green)" />
        <StatCard label="Disponíveis" value={loading ? '…' : disponiveis}       color="var(--green-lt)" />
        <StatCard label="Reservas"    value={loading ? '…' : reservas.length}   color="var(--brown)" />
        <StatCard label="Clientes"    value={loading ? '…' : clientes.length}   color="var(--brown-lt)" />
        <StatCard label="Receita total" value={loading ? '…' : `R$ ${valorTotal.toLocaleString('pt-BR')}`} color="var(--green)" />
      </div>

      <Section title="Últimas reservas">
        <table className={styles.table}>
          <thead><tr><th>Cliente</th><th>Quarto</th><th>Check-in</th><th>Check-out</th><th>Valor</th></tr></thead>
          <tbody>
            {reservas.slice(0, 8).map(r => (
              <tr key={r._id}>
                <td>{r.cliente?.user?.name || '—'}</td>
                <td>{r.quarto?.titulo || '—'}</td>
                <td>{r.diaria?.dataInicio ? new Date(r.diaria.dataInicio).toLocaleDateString('pt-BR') : '—'}</td>
                <td>{r.diaria?.dataFim    ? new Date(r.diaria.dataFim).toLocaleDateString('pt-BR')    : '—'}</td>
                <td>R$ {r.diaria?.valor?.toLocaleString('pt-BR') || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  )
}

function Quartos({ quartos, tags, onNew, onEdit, onDelete, onVincTag }) {
  return (
    <Section title="Quartos">
      <button className={styles.btnPrimary} onClick={onNew}>+ Novo quarto</button>
      <table className={styles.table}>
        <thead><tr><th>Título</th><th>Tipo</th><th>Diária</th><th>Status</th><th>Tags</th><th>Ações</th></tr></thead>
        <tbody>
          {quartos.map(q => (
            <tr key={q._id}>
              <td>{q.titulo}</td>
              <td>{q.tipo || '—'}</td>
              <td>R$ {q.valorDiaria}</td>
              <td><span className={q.estaAlugado ? styles.badgeBusy : styles.badgeFree}>{q.estaAlugado ? 'Ocupado' : 'Livre'}</span></td>
              <td className={styles.tagsList}>{(q.tags || []).map(t => <span key={t._id} className={styles.tag}>{t.nome}</span>)}</td>
              <td className={styles.actions}>
                <button className={styles.btnSm} onClick={() => onEdit(q)}>Editar</button>
                <button className={styles.btnSm} onClick={() => onVincTag(q)}>Tags</button>
                <button className={`${styles.btnSm} ${styles.btnDanger}`} onClick={() => onDelete(q)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}

function Reservas({ reservas, onDelete }) {
  return (
    <Section title="Reservas">
      <table className={styles.table}>
        <thead><tr><th>Cliente</th><th>E-mail</th><th>Quarto</th><th>Check-in</th><th>Check-out</th><th>Valor</th><th>Ações</th></tr></thead>
        <tbody>
          {reservas.map(r => (
            <tr key={r._id}>
              <td>{r.cliente?.user?.name || '—'}</td>
              <td>{r.cliente?.user?.email || '—'}</td>
              <td>{r.quarto?.titulo || '—'}</td>
              <td>{r.diaria?.dataInicio ? new Date(r.diaria.dataInicio).toLocaleDateString('pt-BR') : '—'}</td>
              <td>{r.diaria?.dataFim    ? new Date(r.diaria.dataFim).toLocaleDateString('pt-BR')    : '—'}</td>
              <td>R$ {r.diaria?.valor?.toLocaleString('pt-BR') || '—'}</td>
              <td>
                <button className={`${styles.btnSm} ${styles.btnDanger}`} onClick={() => onDelete(r)}>Cancelar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}

function Clientes({ clientes, onDelete }) {
  return (
    <Section title="Clientes">
      <table className={styles.table}>
        <thead><tr><th>Nome</th><th>E-mail</th><th>CPF</th><th>Telefone</th><th>Reservas</th><th>Ações</th></tr></thead>
        <tbody>
          {clientes.map(c => (
            <tr key={c._id}>
              <td>{c.user?.name || '—'}</td>
              <td>{c.user?.email || '—'}</td>
              <td>{c.cpf || '—'}</td>
              <td>{c.telefone || '—'}</td>
              <td>{c.reservas?.length || 0}</td>
              <td>
                <button
                  className={`${styles.btnSm} ${styles.btnDanger}`}
                  onClick={() => onDelete(c)}
                  disabled={c.reservas?.length > 0}
                  title={c.reservas?.length > 0 ? 'Cliente com reservas ativas' : ''}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}

function Tags({ tags, onNew, onDelete }) {
  return (
    <Section title="Tags">
      <button className={styles.btnPrimary} onClick={onNew}>+ Nova tag</button>
      <table className={styles.table}>
        <thead><tr><th>Nome</th><th>Quartos vinculados</th><th>Ações</th></tr></thead>
        <tbody>
          {tags.map(t => (
            <tr key={t._id}>
              <td><span className={styles.tag}>{t.nome}</span></td>
              <td>{t.quartos?.length || 0}</td>
              <td>
                <button className={`${styles.btnSm} ${styles.btnDanger}`} onClick={() => onDelete(t)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  )
}

function QuartoModal({ quarto, onClose, onSave }) {
  const [titulo,      setTitulo]      = useState(quarto.titulo      || '')
  const [descricao,   setDescricao]   = useState(quarto.descricao   || '')
  const [tipo,        setTipo]        = useState(quarto.tipo        || 'standard')
  const [capacidade,  setCapacidade]  = useState(quarto.capacidade  || 2)
  const [valorDiaria, setValorDiaria] = useState(quarto.valorDiaria || '')
  const [wifi,        setWifi]        = useState(quarto.wifi  ?? true)
  const [cafe,        setCafe]        = useState(quarto.cafe  ?? false)
  const [loading,     setLoading]     = useState(false)

  async function handleSave() {
    if (!titulo || !valorDiaria) return alert('Título e valor são obrigatórios.')
    setLoading(true)
    await onSave({ titulo, descricao, tipo, capacidade: Number(capacidade), valorDiaria: Number(valorDiaria), wifi, cafe })
    setLoading(false)
  }

  return (
    <Modal title={quarto._id ? 'Editar quarto' : 'Novo quarto'} onClose={onClose}>
      <div className={styles.formGrid}>
        <div className={styles.field}>
          <label>Título</label>
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Nome do quarto" />
        </div>
        <div className={styles.field}>
          <label>Tipo</label>
          <select value={tipo} onChange={e => setTipo(e.target.value)}>
            <option value="standard">Standard</option>
            <option value="suite">Suíte</option>
            <option value="luxo">Luxo</option>
          </select>
        </div>
        <div className={styles.field}>
          <label>Valor da diária (R$)</label>
          <input type="number" value={valorDiaria} onChange={e => setValorDiaria(e.target.value)} placeholder="0.00" />
        </div>
        <div className={styles.field}>
          <label>Capacidade</label>
          <input type="number" value={capacidade} onChange={e => setCapacidade(e.target.value)} min={1} />
        </div>
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label>Descrição</label>
          <textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={3} placeholder="Descreva o quarto..." />
        </div>
        <div className={styles.checkRow}>
          <label><input type="checkbox" checked={wifi} onChange={e => setWifi(e.target.checked)} /> Wi-Fi</label>
          <label><input type="checkbox" checked={cafe} onChange={e => setCafe(e.target.checked)} /> Café da manhã</label>
        </div>
      </div>
      <div className={styles.modalActions}>
        <button className={styles.btnSecondary} onClick={onClose}>Cancelar</button>
        <button className={styles.btnPrimary} onClick={handleSave} disabled={loading}>{loading ? 'Salvando...' : 'Salvar'}</button>
      </div>
    </Modal>
  )
}

function TagModal({ onClose, onSave }) {
  const [nome, setNome]       = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    if (!nome.trim()) return alert('Informe o nome da tag.')
    setLoading(true)
    await onSave(nome.trim())
    setLoading(false)
  }

  return (
    <Modal title="Nova tag" onClose={onClose}>
      <div className={styles.formGrid}>
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label>Nome</label>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Hidromassagem" onKeyDown={e => e.key === 'Enter' && handleSave()} />
        </div>
      </div>
      <div className={styles.modalActions}>
        <button className={styles.btnSecondary} onClick={onClose}>Cancelar</button>
        <button className={styles.btnPrimary} onClick={handleSave} disabled={loading}>{loading ? 'Criando...' : 'Criar'}</button>
      </div>
    </Modal>
  )
}

function TagVincModal({ quarto, tags, onClose, onAdd, onRemove }) {
  const quartoTagIds = (quarto.tags || []).map(t => t._id || t)

  return (
    <Modal title={`Tags — ${quarto.titulo}`} onClose={onClose}>
      <div className={styles.tagVincList}>
        {tags.map(t => {
          const vinculada = quartoTagIds.includes(t._id)
          return (
            <div key={t._id} className={styles.tagVincItem}>
              <span className={styles.tag}>{t.nome}</span>
              {vinculada
                ? <button className={`${styles.btnSm} ${styles.btnDanger}`} onClick={() => onRemove(t._id)}>Remover</button>
                : <button className={styles.btnSm} onClick={() => onAdd(t._id)}>Vincular</button>
              }
            </div>
          )
        })}
        {tags.length === 0 && <p className={styles.empty}>Nenhuma tag cadastrada.</p>}
      </div>
      <div className={styles.modalActions}>
        <button className={styles.btnSecondary} onClick={onClose}>Fechar</button>
      </div>
    </Modal>
  )
}
