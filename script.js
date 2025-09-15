// main script (depends on i18n.js)
(function(){
  // helpers
  function setLanguage(lang) {
    try { localStorage.setItem('preferredLang', lang); } catch(e){}
    window.i18n.apply(lang);
    // update exit hint if present
    const hint = document.getElementById('exit-hint');
    if (hint) hint.textContent = window.i18n.t('exitHint');
  }

  function initLanguage() {
    const saved = (function(){ try { return localStorage.getItem('preferredLang'); } catch(e){ return null; }})();
    const lang = saved || window.i18n.detectPreferred();
    setLanguage(lang);
  }

  // DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    // init language first
    initLanguage();

    // wire up language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    // buttons
    document.getElementById('dead-pixel-btn').addEventListener('click', chooseDeadPixelMode);
    document.getElementById('touch-test-btn').addEventListener('click', startTouchTest);

    // allow ESC to exit
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') exitTest(); });
  });

  // --- dead pixel test ---
  function chooseDeadPixelMode(){
    const msg = window.i18n.t('chooseModeConfirm');
    const ok = confirm(msg);
    startDeadPixelTest(ok);
  }

  function startDeadPixelTest(autoMode){
    enterFullscreen();
    const colors = ['black','white','red','green','blue'];
    let i = 0;
    const area = document.getElementById('test-area');
    setupFullscreenArea(area);
    area.style.background = colors[i];
    showExitHint();

    let intervalId = null;
    function cleanup(){
      if (intervalId) { clearInterval(intervalId); intervalId = null; }
      exitTest();
    }

    if (autoMode){
      intervalId = setInterval(()=>{ i = (i+1) % colors.length; area.style.background = colors[i]; }, 1000);
      area.onclick = () => { if (intervalId) { clearInterval(intervalId); intervalId=null; area.onclick = null; } exitTest(); };
    } else {
      // manual mode: tap to advance color; double-click to exit
      area.onclick = () => { i = (i+1) % colors.length; area.style.background = colors[i]; };
      // support double-tap (dblclick)
      area.ondblclick = () => exitTest();
    }
  }

  // --- touch test ---
  let _touchHandlers = null;
  function startTouchTest(){
    enterFullscreen();
    const area = document.getElementById('test-area');
    setupFullscreenArea(area);
    showExitHint();

    // create canvas full-screen
    area.innerHTML = '';
    const canvas = document.createElement('canvas');
    canvas.id = 'touch-canvas';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    area.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    ctx.lineWidth = 10;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#0070f3';

    let drawing = false;

    const pointerDown = (ev) => {
      ev.preventDefault();
      drawing = true;
      const x = ev.clientX;
      const y = ev.clientY;
      ctx.beginPath();
      ctx.moveTo(x, y);
    };
    const pointerMove = (ev) => {
      if (!drawing) return;
      ev.preventDefault();
      const x = ev.clientX; const y = ev.clientY;
      ctx.lineTo(x,y);
      ctx.stroke();
    };
    const pointerUp = (ev)=>{ drawing = false; };

    canvas.addEventListener('pointerdown', pointerDown);
    canvas.addEventListener('pointermove', pointerMove);
    canvas.addEventListener('pointerup', pointerUp);
    canvas.addEventListener('pointercancel', pointerUp);
    canvas.addEventListener('dblclick', ()=> exitTest());

    _touchHandlers = { canvas, pointerDown, pointerMove, pointerUp };
  }

  // utilities
  function setupFullscreenArea(area){
    area.classList.add('fullscreen-area');
    area.innerHTML = '';
    // keep ad-area handled separately (it will be hidden by fullscreen-area)
  }

  function resetTestArea(){
    const area = document.getElementById('test-area');
    // remove potential handlers
    if (_touchHandlers){
      try{
        _touchHandlers.canvas.removeEventListener('pointerdown', _touchHandlers.pointerDown);
        _touchHandlers.canvas.removeEventListener('pointermove', _touchHandlers.pointerMove);
        _touchHandlers.canvas.removeEventListener('pointerup', _touchHandlers.pointerUp);
        _touchHandlers.canvas.removeEventListener('pointercancel', _touchHandlers.pointerUp);
      } catch(e){}
      _touchHandlers = null;
    }
    area.classList.remove('fullscreen-area');
    area.removeAttribute('style');
    area.innerHTML = '';
  }

  function showExitHint(){
    hideExitHint();
    const hint = document.createElement('div');
    hint.id = 'exit-hint';
    hint.textContent = window.i18n.t('exitHint');
    document.body.appendChild(hint);
  }
  function hideExitHint(){
    const h = document.getElementById('exit-hint'); if (h) h.remove();
  }

  function enterFullscreen(){
    const el = document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen().catch(()=>{});
  }
  function exitFullscreen(){
    if (document.exitFullscreen) document.exitFullscreen().catch(()=>{});
  }

  function exitTest(){
    exitFullscreen();
    hideExitHint();
    resetTestArea();
  }

  // expose for debugging
  window.exitTest = exitTest;
})();