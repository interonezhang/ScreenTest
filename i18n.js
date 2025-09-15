// i18n helper (exposes window.i18n)
window.i18n = (function(){
  const translations = {
    en: {
      welcome: "Welcome to Screen Detector",
      subtitle: "Easily test your device screen for dead pixels and touch issues.",
      guide: "👉 Choose a test below to start checking your screen.",
      deadPixelBtn: "Dead Pixel Test",
      touchTestBtn: "Touch Test",
      exitHint: "Tap anywhere or press ESC to exit",
      chooseModeConfirm: "Press OK for Auto cycle colors (changes every second).\nPress Cancel for Manual mode (tap to change color).",
      startManualTip: "Tap to change color; double-tap to exit",
      startAutoTip: "Auto cycling colors; tap to stop",
    },
    hi: {
      welcome: "स्क्रीन डिटेक्टर में आपका स्वागत है",
      subtitle: "अपने डिवाइस की स्क्रीन को डेड पिक्सल और टच समस्याओं के लिए आसानीसे जांचें।",
      guide: "👉 नीचे दिए गए परीक्षण में से एक चुनें और जांच शुरू करें।",
      deadPixelBtn: "डेड पिक्सल परीक्षण",
      touchTestBtn: "टच परीक्षण",
      exitHint: "बाहर निकलने के लिए कहीं भी टैप करें या ESC दबाएँ",
      chooseModeConfirm: "OK दबाएँ: स्वतः रंग बदलते रहेंगे (प्रति सेकंड).\nCancel दबाएँ: मैनुअल मोड (रंग बदलने के लिए टैप करें).",
      startManualTip: "रंग बदलने के लिए टैप करें; बाहर निकलने के लिए डबल-टैप",
      startAutoTip: "रंग स्वतः बदलेंगे; रोकने के लिए टैप करें",
    },
    id: {
      welcome: "Selamat datang di Screen Detector",
      subtitle: "Uji layar perangkat Anda dengan mudah untuk pixel mati dan masalah sentuh.",
      guide: "👉 Pilih tes di bawah ini untuk mulai memeriksa layar Anda.",
      deadPixelBtn: "Tes Piksel Mati",
      touchTestBtn: "Tes Sentuh",
      exitHint: "Ketuk di mana saja atau tekan ESC untuk keluar",
      chooseModeConfirm: "Tekan OK untuk Mode Auto (berganti warna setiap detik).\nTekan Batal untuk Mode Manual (ketuk untuk ganti warna).",
      startManualTip: "Ketuk untuk ganti warna; ketuk dua kali untuk keluar",
      startAutoTip: "Warna berganti otomatis; ketuk untuk berhenti",
    },
    pt: {
      welcome: "Bem-vindo ao Detector de Tela",
      subtitle: "Teste facilmente a tela do seu dispositivo para pixels mortos e problemas de toque.",
      guide: "👉 Escolha um teste abaixo para começar a verificar sua tela.",
      deadPixelBtn: "Teste de Pixel Morto",
      touchTestBtn: "Teste de Toque",
      exitHint: "Toque em qualquer lugar ou pressione ESC para sair",
      chooseModeConfirm: "Pressione OK para modo automático (muda de cor a cada segundo).\nPressione Cancelar para modo manual (toque para mudar a cor).",
      startManualTip: "Toque para mudar a cor; toque duas vezes para sair",
      startAutoTip: "Cores alternam automaticamente; toque para parar",
    }
  };

  const supported = Object.keys(translations);
  let current = 'en';

  function detectPreferred() {
    // first check navigator.languages (array), then navigator.language
    const nav = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || navigator.userLanguage || 'en'];
    for (let lang of nav) {
      if (!lang) continue;
      const code = lang.split('-')[0].toLowerCase();
      if (supported.includes(code)) return code;
    }
    return 'en';
  }

  function apply(lang) {
    if (!supported.includes(lang)) lang = 'en';
    current = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (translations[lang] && translations[lang][key]) el.textContent = translations[lang][key];
    });
    // update active language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      if (btn.dataset.lang === lang) btn.classList.add('active'); else btn.classList.remove('active');
    });
  }

  function t(key) { return (translations[current] && translations[current][key]) || (translations['en'] && translations['en'][key]) || ''; }

  return { translations, supported, detectPreferred, apply, t, get current(){return current;} };
})();