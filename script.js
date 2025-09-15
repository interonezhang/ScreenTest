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

function chooseDeadPixelMode() {
  const choice = confirm("OK = Auto cycle colors\nCancel = Manual mode (tap to change color)");
  if (choice) {
    startDeadPixelTest(true);
  } else {
    startDeadPixelTest(false);
  }
}

function startDeadPixelTest(autoMode) {
  enterFullscreen();
  const colors = ["black", "white", "red", "green", "blue"];
  let i = 0;
  const testArea = document.getElementById("test-area");
  setupFullscreenArea(testArea);
  showExitHint();

  if (autoMode) {
    const interval = setInterval(() => {
      testArea.style.backgroundColor = colors[i];
      i = (i + 1) % colors.length;
    }, 1000);
    testArea.onclick = () => {
      clearInterval(interval);
      exitTest();
    };
  } else {
    testArea.style.backgroundColor = colors[i];
    testArea.onclick = () => {
      i = (i + 1) % colors.length;
      testArea.style.backgroundColor = colors[i];
    };
    testArea.addEventListener("dblclick", () => exitTest());
  }
}

function startTouchTest() {
  enterFullscreen();
  const testArea = document.getElementById("test-area");
  setupFullscreenArea(testArea);
  testArea.style.backgroundColor = "white";
  testArea.innerHTML = "<p style='text-align:center;margin-top:20%;'>Drag your finger to draw and check touch response.<br>Double-tap anywhere to exit.</p>";
  showExitHint();

  let drawing = false;
  testArea.addEventListener("touchstart", (e) => {
    drawing = true;
    drawDot(e.touches[0].clientX, e.touches[0].clientY, testArea);
  });
  testArea.addEventListener("touchmove", (e) => {
    if (drawing) {
      drawDot(e.touches[0].clientX, e.touches[0].clientY, testArea);
    }
  });
  testArea.addEventListener("touchend", () => {
    drawing = false;
  });
  testArea.addEventListener("dblclick", () => exitTest());
}

function drawDot(x, y, container) {
  const dot = document.createElement("div");
  dot.style.position = "absolute";
  dot.style.width = "8px";
  dot.style.height = "8px";
  dot.style.background = "black";
  dot.style.borderRadius = "50%";
  dot.style.left = x - 4 + "px";
  dot.style.top = y - 4 + "px";
  container.appendChild(dot);
}

function setupFullscreenArea(area) {
  area.style.height = "100vh";
  area.style.width = "100vw";
  area.style.position = "fixed";
  area.style.top = "0";
  area.style.left = "0";
  area.style.zIndex = "9998";
  area.innerHTML = "";
}

function showExitHint() {
  let hint = document.createElement("div");
  hint.id = "exit-hint";
  hint.innerText = "Tap anywhere or double-tap to exit";
  document.body.appendChild(hint);
}

function hideExitHint() {
  const hint = document.getElementById("exit-hint");
  if (hint) hint.remove();
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
  hideExitHint();
  resetTestArea();
}