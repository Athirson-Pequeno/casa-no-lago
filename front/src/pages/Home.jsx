import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import { api, getUser, isTokenValid } from '../lib/api.js'
import styles from './Home.module.css'

// ── Dados mock (fallback se API offline) ──────────────────────────────────────
const QUARTOS_MOCK = [
  { _id: '1', nome: 'Quarto Vista Lago',    tipo: 'standard', preco: 280, descricao: 'Ampla janela com vista direta para o lago. Ambiente sereno e aconchegante.', disponivel: true,  capacidade: 2, wifi: true,  cafe: true  },
  { _id: '2', nome: 'Suíte do Bosque',      tipo: 'suite',    preco: 480, descricao: 'Rodeada de árvores, com banheira de hidromassagem e varanda privativa.',    disponivel: true,  capacidade: 2, wifi: true,  cafe: true  },
  { _id: '3', nome: 'Quarto Família',        tipo: 'standard', preco: 360, descricao: 'Espaçoso com duas camas de casal, perfeito para famílias.',                  disponivel: false, capacidade: 4, wifi: true,  cafe: false },
  { _id: '4', nome: 'Suíte Master Lago',    tipo: 'luxo',     preco: 680, descricao: 'Nossa suíte mais exclusiva, deck privativo sobre a água do lago.',           disponivel: true,  capacidade: 2, wifi: true,  cafe: true  },
  { _id: '5', nome: 'Quarto Jardim',         tipo: 'standard', preco: 240, descricao: 'Charmoso quarto com vista para o jardim da propriedade.',                    disponivel: true,  capacidade: 2, wifi: true,  cafe: false },
  { _id: '6', nome: 'Cabana do Pôr do Sol', tipo: 'luxo',     preco: 560, descricao: 'Cabana independente com lareira e vista panorâmica para o entardecer.',       disponivel: false, capacidade: 2, wifi: true,  cafe: true  },
]

const THUMB_COLORS = [
  { wall:'#d6e4f0', floor:'#c8a87a', accent:'#7fb3c8' },
  { wall:'#e8ddd0', floor:'#8b7a5a', accent:'#6a9a60' },
  { wall:'#f0e8d8', floor:'#a08060', accent:'#c8a070' },
  { wall:'#d0dce8', floor:'#7a6a50', accent:'#5a8aaa' },
  { wall:'#e0edd8', floor:'#9a8a6a', accent:'#7aaa6a' },
  { wall:'#ecddd0', floor:'#8a7060', accent:'#c89050' },
]

// ── SVG thumbnail de quarto ───────────────────────────────────────────────────
function RoomThumb({ index, disponivel }) {
  const c = THUMB_COLORS[index % THUMB_COLORS.length]
  return (
    <svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" style={{ width:'100%', height:'100%', transition:'transform .4s ease' }}>
      <rect width="360" height="200" fill={c.wall}/>
      <rect x="0" y="140" width="360" height="60" fill={c.floor}/>
      <rect x="80" y="60" width="200" height="120" rx="4" fill="#fff" opacity=".4"/>
      <rect x="95" y="75" width="80" height="60" rx="6" fill={c.accent} opacity=".7"/>
      <rect x="185" y="75" width="80" height="60" rx="6" fill={c.accent} opacity=".5"/>
      <rect x="130" y="140" width="100" height="40" rx="4" fill={c.floor} opacity=".8"/>
      <circle cx="290" cy="50" r="28" fill="#f5d78e" opacity=".5"/>
      <rect x="20" y="100" width="50" height="80" rx="3" fill={c.accent} opacity=".4"/>
      {!disponivel && <rect width="360" height="200" fill="rgba(0,0,0,.2)"/>}
    </svg>
  )
}

// ── Card de quarto ────────────────────────────────────────────────────────────
function RoomCard({ quarto, index, onReservar }) {
  return (
    <div className={styles.roomCard} style={{ animationDelay: `${0.05 + index * 0.07}s` }}>
      <div className={styles.roomThumb}>
        <RoomThumb index={index} disponivel={quarto.disponivel} />
        <span className={`${styles.roomBadge} ${quarto.disponivel ? styles.badgeDisp : styles.badgeRes}`}>
          {quarto.disponivel ? 'Disponível' : 'Reservado'}
        </span>
      </div>
      <div className={styles.roomBody}>
        <div className={styles.roomName}>{quarto.nome}</div>
        <div className={styles.roomDesc}>{quarto.descricao}</div>
        <div className={styles.roomMeta}>
          <div className={styles.amenities}>
            <span className={styles.amenity}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              {quarto.capacidade}
            </span>
            {quarto.wifi && (
              <span className={styles.amenity}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>
                </svg>
                Wi-Fi
              </span>
            )}
            {quarto.cafe && (
              <span className={styles.amenity}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                  <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                </svg>
                Café
              </span>
            )}
          </div>
          <div className={styles.roomPrice}>
            <div className={styles.priceVal}>R$ {quarto.preco}</div>
            <div className={styles.priceLabel}>/noite</div>
          </div>
        </div>
        <button
          className={styles.btnReservar}
          disabled={!quarto.disponivel}
          onClick={() => onReservar(quarto)}
        >
          {quarto.disponivel ? 'Reservar agora' : 'Indisponível'}
        </button>
      </div>
    </div>
  )
}

// ── Modal de reserva ──────────────────────────────────────────────────────────
function ReservaModal({ quarto, checkinPadrao, checkoutPadrao, onClose, onSuccess }) {
  const [checkin, setCheckin] = useState(checkinPadrao)
  const [checkout, setCheckout] = useState(checkoutPadrao)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function confirmar() {
    if (!checkin)  return alert('Informe a data de check-in.')
    if (!checkout) return alert('Informe a data de check-out.')
    if (!isTokenValid()) return navigate('/login')

    setLoading(true)
    const { ok, data } = await api.post('/reservas', {
      quartoId: quarto._id,
      diaria: { dataInicio: checkin, dataFim: checkout },
    })
    setLoading(false)

    if (ok) {
      onSuccess(`✓ Reserva de "${quarto.nome}" confirmada!`)
      onClose()
    } else {
      alert(data.message || data.msg || 'Erro ao realizar reserva.')
    }
  }

  // fechar ao clicar no overlay
  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={`${styles.modalOverlay} ${styles.modalOpen}`} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <h2>{quarto.nome}</h2>
        <p className={styles.modalSub}>R$ {quarto.preco}/noite — confirme os dados abaixo.</p>

        <div className={styles.modalDates}>
          <div className={styles.modalField}>
            <label>Check-in</label>
            <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} />
          </div>
          <div className={styles.modalField}>
            <label>Check-out</label>
            <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} />
          </div>
        </div>

        <div className={styles.modalActions}>
          <button className={styles.btnCancel} onClick={onClose}>Cancelar</button>
          <button className={styles.btnConfirm} onClick={confirmar} disabled={loading}>
            {loading ? 'Aguarde...' : 'Confirmar Reserva'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Página Home ───────────────────────────────────────────────────────────────
export default function Home() {
  const hoje   = new Date()
  const amanha = new Date(hoje); amanha.setDate(amanha.getDate() + 1)
  const fmt    = d => d.toISOString().split('T')[0]

  const [quartos,  setQuartos]  = useState([])
  const [loading,  setLoading]  = useState(true)
  const [checkin,  setCheckin]  = useState(fmt(hoje))
  const [checkout, setCheckout] = useState(fmt(amanha))
  const [tipo,     setTipo]     = useState('')
  const [modal,    setModal]    = useState(null)   // quarto selecionado
  const [toast,    setToast]    = useState(null)   // msg do toast

  async function buscarQuartos() {
    setLoading(true)
    const params = new URLSearchParams()
    if (checkin)  params.append('checkin',  checkin)
    if (checkout) params.append('checkout', checkout)
    if (tipo)     params.append('tipo',     tipo)

    const { ok, data } = await api.get(`/quartos?${params}`)
    if (ok && Array.isArray(data)) {
      setQuartos(data)
    } else {
      setQuartos(QUARTOS_MOCK) // fallback mock
    }
    setLoading(false)
  }

  useEffect(() => { buscarQuartos() }, []) // eslint-disable-line

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const total     = quartos.length
  const disponiveis = quartos.filter(q => q.disponivel).length
  const reservados  = total - disponiveis

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className={styles.hero}>
        <svg className={styles.heroBg} viewBox="0 0 1440 520" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <rect width="1440" height="520" fill="#d6e8d6"/>
          <ellipse cx="200" cy="420" rx="340" ry="130" fill="#b8d4b0"/>
          <ellipse cx="700" cy="440" rx="400" ry="120" fill="#a8c8a0"/>
          <ellipse cx="1200" cy="430" rx="360" ry="125" fill="#b8d4b0"/>
          <rect x="0" y="370" width="1440" height="150" fill="#7fb3c8" opacity=".6"/>
          <rect x="0" y="390" width="1440" height="130" fill="#6aa3b8" opacity=".5"/>
          <line x1="100" y1="405" x2="300" y2="405" stroke="#fff" strokeWidth="1.5" opacity=".3"/>
          <line x1="500" y1="415" x2="750" y2="415" stroke="#fff" strokeWidth="1.5" opacity=".3"/>
          <line x1="900" y1="408" x2="1100" y2="408" stroke="#fff" strokeWidth="1.5" opacity=".3"/>
          <rect x="620" y="270" width="200" height="110" fill="#f0e6d8" rx="4"/>
          <polygon points="600,275 720,200 840,275" fill="#8b6a52"/>
          <rect x="680" y="320" width="40" height="60" fill="#6b4f3a" rx="2"/>
          <rect x="635" y="285" width="35" height="30" fill="#a8c8d8" rx="3"/>
          <rect x="690" y="285" width="35" height="30" fill="#a8c8d8" rx="3"/>
          <rect x="745" y="285" width="35" height="30" fill="#a8c8d8" rx="3"/>
          <rect x="690" y="378" width="8" height="40" fill="#8b6a52"/>
          <rect x="730" y="378" width="8" height="40" fill="#8b6a52"/>
          <rect x="685" y="372" width="60" height="8" fill="#a08060" rx="2"/>
          <rect x="480" y="300" width="10" height="75" fill="#5a4030"/>
          <ellipse cx="485" cy="285" rx="32" ry="40" fill="#4a7a50"/>
          <rect x="930" y="295" width="10" height="80" fill="#5a4030"/>
          <ellipse cx="935" cy="278" rx="34" ry="42" fill="#4a7a50"/>
          <ellipse cx="120" cy="80" rx="80" ry="30" fill="#fff" opacity=".55"/>
          <ellipse cx="1100" cy="90" rx="90" ry="32" fill="#fff" opacity=".5"/>
          <circle cx="1300" cy="70" r="48" fill="#f5d78e" opacity=".7"/>
          <circle cx="1300" cy="70" r="36" fill="#f0c860" opacity=".6"/>
        </svg>
        <div className={styles.heroOverlay}/>
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>✦ Bem-vindo à sua estadia ✦</p>
          <h1 className={styles.heroTitle}>Casa do <em>Lago</em></h1>
          <p className={styles.heroSub}>Momentos de paz à beira d'água.</p>
          <p className={styles.heroSub}>Reserve o seu quarto e desfrute da tranquilidade.</p>
        </div>
      </section>

      {/* BARRA DE BUSCA */}
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <div className={styles.searchField}>
            <label>Check-in</label>
            <input type="date" value={checkin} onChange={e => setCheckin(e.target.value)} />
          </div>
          <div className={styles.searchField}>
            <label>Check-out</label>
            <input type="date" value={checkout} onChange={e => setCheckout(e.target.value)} />
          </div>
          <div className={styles.searchField}>
            <label>Tipo</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)}>
              <option value="">Todos os quartos</option>
              <option value="standard">Standard</option>
              <option value="luxo">Luxo</option>
              <option value="suite">Suíte</option>
            </select>
          </div>
          <button className={styles.btnSearch} onClick={buscarQuartos}>Buscar</button>
        </div>
      </div>

      {/* SEÇÃO QUARTOS */}
      <section className={styles.section} id="quartos">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Nossos <span>quartos</span></h2>
          <a href="#quartos" className={styles.sectionLink}>Ver todos</a>
        </div>

        {loading ? (
          <div className={styles.roomsGrid}>
            {[1,2,3].map(i => (
              <div key={i} className={styles.roomCard}>
                <div className={`${styles.roomThumb} ${styles.skeleton}`} style={{ height: 200 }} />
                <div className={styles.roomBody}>
                  <div className={`${styles.skeleton}`} style={{ height: 22, width: '60%', borderRadius: 6, marginBottom: 10 }} />
                  <div className={`${styles.skeleton}`} style={{ height: 14, width: '90%', borderRadius: 4, marginBottom: 6 }} />
                  <div className={`${styles.skeleton}`} style={{ height: 14, width: '70%', borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.roomsGrid}>
            {quartos.map((q, i) => (
              <RoomCard key={q._id} quarto={q} index={i} onReservar={setModal} />
            ))}
          </div>
        )}

        {/* STATS */}
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <div className={styles.statNum}>{loading ? '—' : total}</div>
            <div className={styles.statLabel}>Quartos</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>{loading ? '—' : disponiveis}</div>
            <div className={styles.statLabel}>Disponíveis</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.statNum}>{loading ? '—' : reservados}</div>
            <div className={styles.statLabel}>Reservados</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerLogo}>Casa do Lago</div>
        <div className={styles.footerCopy}>© 2025 Casa do Lago. Todos os direitos reservados.</div>
      </footer>

      {/* MODAL */}
      {modal && (
        <ReservaModal
          quarto={modal}
          checkinPadrao={checkin}
          checkoutPadrao={checkout}
          onClose={() => setModal(null)}
          onSuccess={msg => { showToast(msg); buscarQuartos() }}
        />
      )}

      {/* TOAST */}
      {toast && <div className={`${styles.toast} ${styles.toastShow}`}>{toast}</div>}
    </>
  )
}
