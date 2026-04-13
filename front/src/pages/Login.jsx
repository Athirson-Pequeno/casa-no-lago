import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api, saveAuth } from '../lib/api.js'
import styles from './Login.module.css'

const EYE_OPEN = (
  <>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </>
)

const EYE_CLOSED = (
  <>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </>
)

export default function Login() {
  const navigate = useNavigate()

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)

  async function handleLogin() {
    setError('')
    if (!email)    return setError('Informe o e-mail.')
    if (!password) return setError('Informe a senha.')

    setLoading(true)
    const { ok, data } = await api.post('/auth/login', { email, password })
    setLoading(false)

    if (ok) {
      saveAuth(data.token, data.nome || data.name)
      setSuccess(true)
      setTimeout(() => navigate('/'), 1800)
    } else {
      setError(data.message || data.msg || 'Credenciais inválidas. Tente novamente!')
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className={styles.page}>

      {/* PAINEL ESQUERDO — ilustração */}
      <div className={styles.panelLeft}>
        <svg className={styles.scene} viewBox="0 0 720 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a8c8e8"/>
              <stop offset="100%" stopColor="#d6e8d6"/>
            </linearGradient>
          </defs>
          <rect width="720" height="900" fill="url(#sky)"/>
          <ellipse cx="120" cy="700" rx="300" ry="180" fill="#7aaa7a" opacity=".6"/>
          <ellipse cx="600" cy="720" rx="320" ry="170" fill="#6a9a6a" opacity=".6"/>
          <ellipse cx="360" cy="750" rx="400" ry="160" fill="#5a8a5a" opacity=".5"/>
          <rect x="0" y="680" width="720" height="220" fill="#5a9ab8" opacity=".55"/>
          <rect x="0" y="710" width="720" height="190" fill="#4a8aaa" opacity=".45"/>
          <line x1="60"  y1="730" x2="220" y2="730" stroke="#fff" strokeWidth="1.5" opacity=".25"/>
          <line x1="300" y1="745" x2="520" y2="745" stroke="#fff" strokeWidth="1.5" opacity=".25"/>
          <line x1="580" y1="735" x2="700" y2="735" stroke="#fff" strokeWidth="1"   opacity=".2"/>
          <line x1="100" y1="760" x2="300" y2="760" stroke="#fff" strokeWidth="1"   opacity=".18"/>
          <rect x="270" y="520" width="180" height="170" rx="4" fill="#f0e6d8"/>
          <polygon points="250,528 360,440 470,528" fill="#7a5a42"/>
          <rect x="285" y="540" width="55" height="45" rx="4" fill="#8ab8cc" opacity=".8"/>
          <rect x="380" y="540" width="55" height="45" rx="4" fill="#8ab8cc" opacity=".8"/>
          <rect x="330" y="615" width="40" height="75" rx="3" fill="#5a3a28"/>
          <rect x="345" y="688" width="8"  height="50" fill="#8b6a52"/>
          <rect x="375" y="688" width="8"  height="50" fill="#8b6a52"/>
          <rect x="338" y="682" width="52" height="9"  rx="2" fill="#a08060"/>
          <rect x="150" y="560" width="10" height="130" fill="#4a3020"/>
          <ellipse cx="155" cy="540" rx="40" ry="50" fill="#3a6a3a"/>
          <ellipse cx="155" cy="518" rx="28" ry="36" fill="#4a7a4a"/>
          <rect x="545" y="555" width="10" height="135" fill="#4a3020"/>
          <ellipse cx="550" cy="534" rx="42" ry="52" fill="#3a6a3a"/>
          <ellipse cx="550" cy="510" rx="30" ry="38" fill="#4a7a4a"/>
          <ellipse cx="120" cy="120" rx="90" ry="34" fill="#fff" opacity=".5"/>
          <ellipse cx="560" cy="100" rx="100" ry="36" fill="#fff" opacity=".45"/>
          <circle cx="620" cy="130" r="55" fill="#f5d78e" opacity=".6"/>
          <circle cx="620" cy="130" r="40" fill="#f0c860" opacity=".5"/>
        </svg>
        <div className={styles.panelOverlay}/>
        <div className={styles.panelQuote}>
          <cite>Casa do Lago — sua estadia à beira d'água</cite>
        </div>
      </div>

      {/* PAINEL DIREITO — formulário */}
      <div className={styles.panelRight}>
        <div className={styles.formBox}>

          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#f7f4ef" strokeWidth="1.8">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <div className={styles.logoText}>Casa do <span>Lago</span></div>
          </Link>

          <h1 className={styles.heading}>Bem-vindo</h1>
          <p className={styles.subtitle}>Entre com suas credenciais para continuar</p>

          {/* EMAIL */}
          <div className={styles.field}>
            <label htmlFor="email">E-mail</label>
            <div className={styles.inputWrap}>
              <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={handleKey}
              />
            </div>
          </div>

          {/* SENHA */}
          <div className={styles.field}>
            <label htmlFor="password">Senha</label>
            <div className={styles.inputWrap}>
              <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="password"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKey}
              />
              <button
                type="button"
                className={styles.togglePw}
                aria-label="Mostrar senha"
                onClick={() => setShowPw(v => !v)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPw ? EYE_CLOSED : EYE_OPEN}
                </svg>
              </button>
            </div>
          </div>

          {/* ERRO */}
          {error && <div className={styles.errorMsg}>{error}</div>}

          <div className={styles.forgot}><a href="#">Esqueceu a senha?</a></div>

          <button
            className={`${styles.btnLogin} ${loading ? styles.loading : ''}`}
            type="button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading
              ? <span className={styles.spinner}/>
              : <span>Entrar</span>
            }
          </button>

          <div className={styles.divider}>ou</div>

          <div className={styles.registerRow}>
            Não tem conta? <a href="#">Criar conta</a>
          </div>
        </div>
      </div>

      {/* TOAST de sucesso */}
      {success && (
        <div className={`${styles.toast} ${styles.toastShow}`}>
          ✓ Login realizado com sucesso!
        </div>
      )}
    </div>
  )
}
