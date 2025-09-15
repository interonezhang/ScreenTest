
(function(){
  // language and UI init
  const langSelector = document.getElementById('lang-selector');
  const available = Object.keys(translations);

  function populateLangSelector(){
    available.forEach(code => {
      const opt = document.createElement('option');
      opt.value = code;
      opt.textContent = (translations[code].title) ? translations[code].title + ` (${code.toUpperCase()})` : code.toUpperCase();
      langSelector.appendChild(opt);
    });
  }

  function detectPreferred(){
    try{
      const nav = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || navigator.userLanguage || 'en'];
      for (let lang of nav){
        if (!lang) continue;
        const code = lang.split('-')[0].toLowerCase();
        if (available.includes(code)) return code;
      }
    }catch(e){}
    return 'en';
  }

  function applyLang(code){
    const t = translations[code] || translations['en'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key]) el.textContent = t[key];
    });
    // set selector visually
    langSelector.value = code;
    try{ localStorage.setItem('preferredLang', code); }catch(e){}
  }

  populateLangSelector();
  const saved = (function(){ try{ return localStorage.getItem('preferredLang'); }catch(e){ return null } })();
  const defaultLang = saved || detectPreferred();
  applyLang(defaultLang);

  langSelector.addEventListener('change', (e)=> applyLang(e.target.value));

  // resolution & refresh rate
  const resEl = document.getElementById('resolution-value');
  const refEl = document.getElementById('refresh-value');
  function updateResolution(){ resEl.textContent = window.screen.width + ' x ' + window.screen.height + ' @ DPR ' + (window.devicePixelRatio || 1); }
  updateResolution();

  // measure FPS / refresh approximate
  (function measureFPS(){
    let frames = 0; let last = performance.now();
    function loop(now){
      frames++;
      if (now - last >= 1000){
        refEl.textContent = Math.round(frames);
        frames = 0; last = now;
      }
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  })();

  // tests
  const deadBtn = document.getElementById('dead-pixel-btn');
  const touchBtn = document.getElementById('touch-test-btn');

  function createOverlay(bg){
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.style.background = bg || '#000';
    overlay.tabIndex = 0;
    // exit hint (top-left)
    const hint = document.createElement('div');
    hint.className = 'exit-hint';
    hint.textContent = translations[(langSelector.value)].exitHint || translations['en'].exitHint;
    overlay.appendChild(hint);
    return {overlay, hint};
  }

  function startDeadPixelTest(){
    const mode = confirm(translations[langSelector.value].modePrompt || translations['en'].modePrompt) ? 'auto':'manual';
    const colors = ['#000000','#FFFFFF','#FF0000','#00FF00','#0000FF'];
    let idx = 0; let interval = null;
    const {overlay, hint} = createOverlay(colors[idx]);
    // top tip, placed below exit hint
    const topTip = document.createElement('div');
    topTip.className = 'top-tip';
    topTip.textContent = (mode==='auto') ? translations[langSelector.value].topTipAuto : translations[langSelector.value].topTipManual;
    overlay.appendChild(topTip);

    document.body.appendChild(overlay);
    // ensure fullscreen when possible
    try{ document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(()=>{}); }catch(e){}
    let firstInteraction = true;

    function hideHintOnce(){
      if (firstInteraction){
        firstInteraction = false;
        if (hint && hint.parentNode) hint.style.display = 'none';
        if (topTip && topTip.parentNode) topTip.style.display = 'none';
      }
    }

    if (mode==='auto'){
      interval = setInterval(()=>{
        idx = (idx+1) % colors.length;
        overlay.style.background = colors[idx];
      },1000);
      overlay.addEventListener('click', function onClick(){
        hideHintOnce();
        // clicking stops auto mode and exits on next double click or ESC
        if (interval){ clearInterval(interval); interval = null; }
      });
    } else {
      overlay.addEventListener('click', function onClick(){
        hideHintOnce();
        idx = (idx+1) % colors.length;
        overlay.style.background = colors[idx];
      });
      overlay.addEventListener('dblclick', exitOverlay);
    }

    function exitOverlay(){
      try{ if (interval) clearInterval(interval); }catch(e){}
      try{ document.exitFullscreen && document.exitFullscreen().catch(()=>{}); }catch(e){}
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }

    // ESC to exit
    function escHandler(e){
      if (e.key === 'Escape') { exitOverlay(); document.removeEventListener('keydown', escHandler); }
    }
    document.addEventListener('keydown', escHandler);

    // also remove when focus lost? not necessary
  }

  function startTouchTest(){
    const {overlay, hint} = createOverlay('#ffffff');
    const topTip = document.createElement('div');
    topTip.className = 'top-tip';
    topTip.textContent = translations[langSelector.value].topTipManual || translations['en'].topTipManual;
    overlay.appendChild(topTip);

    // create canvas fullscreen
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.touchAction = 'none';
    overlay.appendChild(canvas);
    document.body.appendChild(overlay);

    try{ document.documentElement.requestFullscreen && document.documentElement.requestFullscreen().catch(()=>{}); }catch(e){}

    const ctx = canvas.getContext('2d');
    ctx.scale(devicePixelRatio, devicePixelRatio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#0b79d0';

    const pointers = new Map();
    let firstInteraction = true;

    function hideHintOnce(){
      if (firstInteraction){
        firstInteraction = false;
        if (hint && hint.parentNode) hint.style.display = 'none';
        if (topTip && topTip.parentNode) topTip.style.display = 'none';
      }
    }

    function onPointerDown(e){
      hideHintOnce();
      canvas.setPointerCapture(e.pointerId);
      pointers.set(e.pointerId, {x:e.clientX, y:e.clientY});
      ctx.beginPath();
      ctx.moveTo(e.clientX, e.clientY);
    }
    function onPointerMove(e){
      if (!pointers.has(e.pointerId)) return;
      const last = pointers.get(e.pointerId);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
      pointers.set(e.pointerId, {x:e.clientX, y:e.clientY});
    }
    function onPointerUp(e){
      if (pointers.has(e.pointerId)) pointers.delete(e.pointerId);
      try{ canvas.releasePointerCapture(e.pointerId); }catch(e){}
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    // exit handlers
    function exitAll(){
      try{ document.exitFullscreen && document.exitFullscreen().catch(()=>{}); }catch(e){}
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      document.removeEventListener('keydown', escHandler);
    }
    function escHandler(e){ if (e.key==='Escape') exitAll(); }
    document.addEventListener('keydown', escHandler);

    // double-tap to exit
    canvas.addEventListener('dblclick', exitAll);
  }

  deadBtn.addEventListener('click', startDeadPixelTest);
  touchBtn.addEventListener('click', startTouchTest);

})();
