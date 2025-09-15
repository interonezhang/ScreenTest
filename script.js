const translations = {
  en: {
    welcome: "Welcome to Screen Detector",
    subtitle: "Easily test your device screen for dead pixels and touch issues.",
    deadPixelBtn: "Dead Pixel Test",
    touchTestBtn: "Touch Test",
  },
  hi: {
    welcome: "स्क्रीन डिटेक्टर में आपका स्वागत है",
    subtitle: "अपने डिवाइस की स्क्रीन को डेड पिक्सल और टच समस्याओं के लिए आसानी से जांचें।",
    deadPixelBtn: "डेड पिक्सल परीक्षण",
    touchTestBtn: "टच परीक्षण",
  },
  id: {
    welcome: "Selamat datang di Screen Detector",
    subtitle: "Uji layar perangkat Anda dengan mudah untuk pixel mati dan masalah sentuh.",
    deadPixelBtn: "Tes Pixel Mati",
    touchTestBtn: "Tes Sentuh",
  },
  pt: {
    welcome: "Bem-vindo ao Screen Detector",
    subtitle: "Teste facilmente a tela do seu dispositivo para pixels mortos e problemas de toque.",
    deadPixelBtn: "Teste de Pixel Morto",
    touchTestBtn: "Teste de Toque",
  },
};

function setLanguage(lang) {
  document.getElementById("welcome-text").textContent = translations[lang].welcome;
  document.getElementById("subtitle-text").textContent = translations[lang].subtitle;
  document.getElementById("dead-pixel-btn").textContent = translations[lang].deadPixelBtn;
  document.getElementById("touch-test-btn").textContent = translations[lang].touchTestBtn;
}

function startDeadPixelTest() {
  enterFullscreen();
  const colors = ["black", "white", "red", "green", "blue"];
  let i = 0;
  const testArea = document.getElementById("test-area");
  testArea.style.height = "100vh";
  testArea.style.width = "100vw";
  testArea.style.position = "fixed";
  testArea.style.top = "0";
  testArea.style.left = "0";
  const interval = setInterval(() => {
    testArea.style.backgroundColor = colors[i];
    i = (i + 1) % colors.length;
  }, 1000);
  testArea.onclick = () => {
    clearInterval(interval);
    exitFullscreen();
    resetTestArea();
  };
}

function startTouchTest() {
  enterFullscreen();
  const testArea = document.getElementById("test-area");
  testArea.style.height = "100vh";
  testArea.style.width = "100vw";
  testArea.style.position = "fixed";
  testArea.style.top = "0";
  testArea.style.left = "0";
  testArea.style.backgroundColor = "white";
  testArea.innerHTML = "<p style='text-align:center;margin-top:20%;'>Touch the screen to see marks</p>";
  testArea.onclick = () => exitTest();
  testArea.addEventListener("touchstart", (e) => {
    const dot = document.createElement("div");
    dot.style.position = "absolute";
    dot.style.width = "20px";
    dot.style.height = "20px";
    dot.style.background = "black";
    dot.style.borderRadius = "50%";
    dot.style.left = e.touches[0].clientX - 10 + "px";
    dot.style.top = e.touches[0].clientY - 10 + "px";
    testArea.appendChild(dot);
  });
}

function enterFullscreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
}

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  }
}

function resetTestArea() {
  const testArea = document.getElementById("test-area");
  testArea.removeAttribute("style");
  testArea.innerHTML = "";
}

function exitTest() {
  exitFullscreen();
  resetTestArea();
}