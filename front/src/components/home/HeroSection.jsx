function HomeHeroBackground() {
  return (
    <svg
      className="hero-bg"
      viewBox="0 0 1440 520"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="1440" height="520" fill="#d6e8d6" />
      <ellipse cx="200" cy="420" rx="340" ry="130" fill="#b8d4b0" />
      <ellipse cx="700" cy="440" rx="400" ry="120" fill="#a8c8a0" />
      <ellipse cx="1200" cy="430" rx="360" ry="125" fill="#b8d4b0" />
      <rect x="0" y="370" width="1440" height="150" fill="#7fb3c8" opacity=".6" />
      <rect x="0" y="390" width="1440" height="130" fill="#6aa3b8" opacity=".5" />
      <line x1="100" y1="405" x2="300" y2="405" stroke="#fff" strokeWidth="1.5" opacity=".3" />
      <line x1="500" y1="415" x2="750" y2="415" stroke="#fff" strokeWidth="1.5" opacity=".3" />
      <line x1="900" y1="408" x2="1100" y2="408" stroke="#fff" strokeWidth="1.5" opacity=".3" />
      <line x1="200" y1="425" x2="450" y2="425" stroke="#fff" strokeWidth="1" opacity=".2" />
      <line x1="700" y1="430" x2="950" y2="430" stroke="#fff" strokeWidth="1" opacity=".2" />
      <rect x="620" y="270" width="200" height="110" fill="#f0e6d8" rx="4" />
      <polygon points="600,275 720,200 840,275" fill="#8b6a52" />
      <rect x="680" y="320" width="40" height="60" fill="#6b4f3a" rx="2" />
      <rect x="635" y="285" width="35" height="30" fill="#a8c8d8" rx="3" />
      <rect x="690" y="285" width="35" height="30" fill="#a8c8d8" rx="3" />
      <rect x="745" y="285" width="35" height="30" fill="#a8c8d8" rx="3" />
      <rect x="690" y="378" width="8" height="40" fill="#8b6a52" />
      <rect x="730" y="378" width="8" height="40" fill="#8b6a52" />
      <rect x="685" y="372" width="60" height="8" fill="#a08060" rx="2" />
      <rect x="480" y="300" width="10" height="75" fill="#5a4030" />
      <ellipse cx="485" cy="285" rx="32" ry="40" fill="#4a7a50" />
      <ellipse cx="485" cy="270" rx="22" ry="30" fill="#5a8a60" />
      <rect x="540" y="310" width="9" height="65" fill="#5a4030" />
      <ellipse cx="544" cy="295" rx="28" ry="36" fill="#3a6a40" />
      <rect x="930" y="295" width="10" height="80" fill="#5a4030" />
      <ellipse cx="935" cy="278" rx="34" ry="42" fill="#4a7a50" />
      <ellipse cx="935" cy="262" rx="24" ry="32" fill="#5a8a60" />
      <rect x="880" y="308" width="9" height="67" fill="#5a4030" />
      <ellipse cx="884" cy="293" rx="28" ry="36" fill="#3a6a40" />
      <ellipse cx="180" cy="80" rx="80" ry="30" fill="#fff" opacity=".55" />
      <ellipse cx="240" cy="72" rx="55" ry="25" fill="#fff" opacity=".5" />
      <ellipse cx="130" cy="85" rx="45" ry="20" fill="#fff" opacity=".45" />
      <ellipse cx="1100" cy="90" rx="90" ry="32" fill="#fff" opacity=".5" />
      <ellipse cx="1170" cy="82" rx="60" ry="26" fill="#fff" opacity=".45" />
      <circle cx="1300" cy="70" r="48" fill="#f5d78e" opacity=".7" />
      <circle cx="1300" cy="70" r="36" fill="#f0c860" opacity=".6" />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="hero">
      <HomeHeroBackground />
      <div className="hero-overlay" />
      <div className="hero-content">
        <p className="hero-eyebrow">✦ Bem-vindo a sua estadia ✦</p>
        <h1 className="hero-title">
          Casa do <em>Lago</em>
        </h1>
        <p className="hero-sub">Momentos de paz a beira d'agua.</p>
        <p className="hero-sub">Reserve o seu quarto e desfrute da tranquilidade.</p>
      </div>
    </section>
  );
}
