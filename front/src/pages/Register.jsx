import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../lib/api.js'
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

function Field({ label, id, type = 'text', placeholder, value, onChange, icon, right }) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.inputWrap}>
        {icon && <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{icon}</svg>}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          style={icon ? {} : { paddingLeft: 14 }}
        />
        {right}
      </div>
    </div>
  )
}

export default function Register() {
  const navigate = useNavigate()

  const [name,            setName]            = useState('')
  const [email,           setEmail]           = useState('')
  const [telefone,        setTelefone]        = useState('')
  const [cpf,             setCpf]             = useState('')
  const [password,        setPassword]        = useState('')
  const [confirmpassword, setConfirmpassword] = useState('')
  const [showPw,          setShowPw]          = useState(false)
  const [showPw2,         setShowPw2]         = useState(false)
  const [error,           setError]           = useState('')
  const [loading,         setLoading]         = useState(false)
  const [success,         setSuccess]         = useState(false)

  async function handleRegister() {
    setError('')
    if (!name)            return setError('Informe o nome.')
    if (!email)           return setError('Informe o e-mail.')
    if (!telefone)        return setError('Informe o telefone.')
    if (!cpf)             return setError('Informe o CPF.')
    if (!password)        return setError('Informe a senha.')
    if (!confirmpassword) return setError('Confirme a senha.')

    setLoading(true)
    const { ok, data } = await api.post('/auth/register', {
      name,
      email,
      telefone: telefone.replace(/\D/g, ''),
      cpf: cpf.replace(/\D/g, ''),
      password,
      confirmpassword,
    })
    setLoading(false)

    if (ok) {
      setSuccess(true)
      setTimeout(() => navigate('/login'), 1800)
    } else {
      setError(data.message || data.msg || 'Erro ao criar conta.')
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleRegister()
  }

  const eyeBtn = (show, setShow) => (
    <button
      type="button"
      className={styles.togglePw}
      aria-label="Mostrar senha"
      onClick={() => setShow(v => !v)}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {show ? EYE_CLOSED : EYE_OPEN}
      </svg>
    </button>
  )

  return (
    <div className={styles.page}>

      {/* PAINEL ESQUERDO — mesma ilustração do Login */}
      <div className={styles.panelLeft}>
        <svg className={styles.scene} viewBox="0 0 720 900" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
          <defs>
            <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#a8c8e8"/>
              <stop offset="100%" stopColor="#d6e8d6"/>
            </linearGradient>
          </defs>
          <rect width="720" height="900" fill="url(#sky2)"/>
          <ellipse cx="120" cy="700" rx="300" ry="180" fill="#7aaa7a" opacity=".6"/>
          <ellipse cx="600" cy="720" rx="320" ry="170" fill="#6a9a6a" opacity=".6"/>
          <ellipse cx="360" cy="750" rx="400" ry="160" fill="#5a8a5a" opacity=".5"/>
          <rect x="0" y="680" width="720" height="220" fill="#5a9ab8" opacity=".55"/>
          <rect x="0" y="710" width="720" height="190" fill="#4a8aaa" opacity=".45"/>
          <rect x="270" y="520" width="180" height="170" rx="4" fill="#f0e6d8"/>
          <polygon points="250,528 360,440 470,528" fill="#7a5a42"/>
          <rect x="285" y="540" width="55" height="45" rx="4" fill="#8ab8cc" opacity=".8"/>
          <rect x="380" y="540" width="55" height="45" rx="4" fill="#8ab8cc" opacity=".8"/>
          <rect x="330" y="615" width="40" height="75" rx="3" fill="#5a3a28"/>
          <rect x="150" y="560" width="10" height="130" fill="#4a3020"/>
          <ellipse cx="155" cy="540" rx="40" ry="50" fill="#3a6a3a"/>
          <rect x="545" y="555" width="10" height="135" fill="#4a3020"/>
          <ellipse cx="550" cy="534" rx="42" ry="52" fill="#3a6a3a"/>
          <circle cx="620" cy="130" r="55" fill="#f5d78e" opacity=".6"/>
          <circle cx="620" cy="130" r="40" fill="#f0c860" opacity=".5"/>
        </svg>
        <div className={styles.panelOverlay}/>
        <div className={styles.panelQuote}>
          <cite>Casa do Lago — crie sua conta e reserve agora</cite>
        </div>
      </div>

      {/* PAINEL DIREITO — formulário de cadastro */}
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

          <h1 className={styles.heading}>Criar conta</h1>
          <p className={styles.subtitle}>Preencha os dados para se registrar</p>

          <Field
            label="Nome completo" id="name" placeholder="Seu nome"
            value={name} onChange={setName}
            icon={<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>}
          />

          <Field
            label="E-mail" id="email" type="email" placeholder="seu@email.com"
            value={email} onChange={setEmail}
            icon={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field
              label="Telefone (com DDD)" id="telefone" placeholder="11999998888"
              value={telefone} onChange={setTelefone}
              icon={<><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6.58 6.58l.96-.88a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></>}
            />
            <Field
              label="CPF (só números)" id="cpf" placeholder="00000000000"
              value={cpf} onChange={setCpf}
              icon={<><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></>}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Senha</label>
            <div className={styles.inputWrap}>
              <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="password" type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={handleKey}
              />
              {eyeBtn(showPw, setShowPw)}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmpassword">Confirmar senha</label>
            <div className={styles.inputWrap}>
              <svg className={styles.icon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="confirmpassword" type={showPw2 ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmpassword} onChange={e => setConfirmpassword(e.target.value)}
                onKeyDown={handleKey}
              />
              {eyeBtn(showPw2, setShowPw2)}
            </div>
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <button
            className={`${styles.btnLogin} ${loading ? styles.loading : ''}`}
            type="button"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? <span className={styles.spinner}/> : <span>Criar conta</span>}
          </button>

          <div className={styles.divider}>ou</div>

          <div className={styles.registerRow}>
            Já tem conta? <Link to="/login">Entrar</Link>
          </div>
        </div>
      </div>

      {success && (
        <div className={`${styles.toast} ${styles.toastShow}`}>
          ✓ Conta criada! Redirecionando para o login...
        </div>
      )}
    </div>
  )
}
