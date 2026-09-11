// ——————————————————————————————————————————————————————————
//  GOLDEN KIT ⚙️ — ընդհանուր գործիքակազմ ԲՈԼՈՐ խաղերի համար
//  Արենի պատվերն է. մեկ ֆայլ, որ ամեն խաղում նույն բանն աշխատի։
//    ⏸️  Esc-ով (կամ կոճակով) դադար
//    🔊  Ձայնի կոճակ մեկ տեղից — անջատածդ հիշվում է բոլոր խաղերում
//    📳  Հեռախոսը թրթռում է, երբ նոր ռեկորդ ես դնում
//    📸  Ռեկորդի նկարը պահելու կոճակ
//    🐱  Բեռնման էկրան՝ պտտվող ոսկե կատվով
//  Ոչ մի խաղի կոդ չենք փոխում — ամեն ինչ դրսից է միանում։
// ——————————————————————————————————————————————————————————
(function () {
  'use strict';
  if (window.__ggKit) return;
  window.__ggKit = true;

  // Էջի տեսակը գրված է հենց script-ի պիտակի վրա — ամենահուսալի ձևն է
  var selfTag = document.currentScript || document.querySelector('script[src*="gg-kit.js"]');
  var isPortal = !selfTag || selfTag.getAttribute('data-kind') !== 'game';
  var ls = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var lang = ls.get('gg-lang', 'hy');
  var TR = {
    hy: { paused: 'ԴԱԴԱՐ', resume: 'Շարունակելու համար հպիր', sound: 'Ձայն', shot: 'Ռեկորդի նկարը', saved: 'Նկարը պահվեց 📸', rec: 'Ռեկորդ' },
    ru: { paused: 'ПАУЗА', resume: 'Коснись, чтобы продолжить', sound: 'Звук', shot: 'Картинка рекорда', saved: 'Картинка сохранена 📸', rec: 'Рекорд' },
    en: { paused: 'PAUSED', resume: 'Tap to continue', sound: 'Sound', shot: 'Record picture', saved: 'Picture saved 📸', rec: 'Best' },
    es: { paused: 'PAUSA', resume: 'Toca para continuar', sound: 'Sonido', shot: 'Imagen del récord', saved: 'Imagen guardada 📸', rec: 'Récord' },
    fr: { paused: 'PAUSE', resume: 'Touche pour continuer', sound: 'Son', shot: 'Image du record', saved: 'Image enregistrée 📸', rec: 'Record' },
    de: { paused: 'PAUSE', resume: 'Tippe zum Weitermachen', sound: 'Ton', shot: 'Rekordbild', saved: 'Bild gespeichert 📸', rec: 'Rekord' },
    ja: { paused: 'ポーズ', resume: 'タップでつづける', sound: '音', shot: 'きろくの画ぞう', saved: '画ぞうをほぞんしたよ 📸', rec: 'ベスト' },
    zh: { paused: '暂停', resume: '点一下继续', sound: '声音', shot: '纪录图片', saved: '图片已保存 📸', rec: '纪录' },
    it: { paused: 'PAUSA', resume: 'Tocca per continuare', sound: 'Suono', shot: 'Immagine del record', saved: 'Immagine salvata 📸', rec: 'Record' },
    ka: { paused: 'პაუზა', resume: 'შეეხე გასაგრძელებლად', sound: 'ხმა', shot: 'რეკორდის სურათი', saved: 'სურათი შენახულია 📸', rec: 'რეკორდი' },
    hi: { paused: 'रुका हुआ', resume: 'जारी रखने के लिए टैप करो', sound: 'आवाज़', shot: 'रिकॉर्ड की तस्वीर', saved: 'तस्वीर सेव हो गई 📸', rec: 'रिकॉर्ड' }
  };
  var T = TR[lang] || TR.hy;

  // ——— Ոճերը ———
  var css = document.createElement('style');
  css.textContent = [
    '#ggBar{position:fixed;top:10px;right:10px;z-index:120;display:flex;gap:6px}',
    '#ggBar button{font-family:inherit;font-size:1rem;width:38px;height:38px;border-radius:12px;',
    'border:2px solid rgba(255,255,255,0.4);background:rgba(20,26,34,0.75);color:#f5eede;cursor:pointer;padding:0;line-height:1}',
    '#ggBar button:active{transform:scale(0.92)}',
    '#ggBar button.off{opacity:0.55}',
    '#ggPause[hidden],#ggBar[hidden],#ggLoad[hidden],#ggToast[hidden]{display:none!important}',
    '#ggPause{position:fixed;inset:0;z-index:130;background:rgba(10,12,28,0.82);display:flex;flex-direction:column;',
    'align-items:center;justify-content:center;gap:10px;color:#f5eede;font-family:"Arial Rounded MT Bold","Noto Sans Armenian",Arial,sans-serif}',
    '#ggPause .t{color:#ffd166;font-weight:bold;font-size:clamp(1.6rem,8vw,2.4rem);letter-spacing:0.12em}',
    '#ggPause .s{color:#9a9ec7;font-size:0.9rem}',
    '#ggToast{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:140;background:#ffd166;color:#2e2410;',
    'font-weight:bold;padding:10px 18px;border-radius:999px;font-size:0.88rem;font-family:"Arial Rounded MT Bold","Noto Sans Armenian",Arial,sans-serif}',
    '#ggLoad{position:fixed;inset:0;z-index:150;background:#12122b;display:flex;align-items:center;justify-content:center}',
    '#ggLoad svg{width:96px;height:96px;animation:ggSpin 1.1s linear infinite}',
    '@keyframes ggSpin{to{transform:rotate(360deg)}}',
    '#ggLoad.out{animation:ggFade 0.32s forwards}',
    '@keyframes ggFade{to{opacity:0;visibility:hidden}}'
  ].join('');
  document.head.appendChild(css);

  // ——— 🐱 Բեռնման էկրանը՝ պտտվող ոսկե կատու ———
  var load = document.createElement('div');
  load.id = 'ggLoad';
  load.innerHTML = '<svg viewBox="0 0 60 60" aria-hidden="true">' +
    '<circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,209,102,0.22)" stroke-width="4"/>' +
    '<path d="M30 4 a26 26 0 0 1 26 26" fill="none" stroke="#ffd166" stroke-width="4" stroke-linecap="round"/>' +
    '<g transform="translate(30,30)">' +
    '<ellipse cx="0" cy="4" rx="11" ry="7" fill="#f28c3b"/>' +
    '<circle cx="5" cy="-4" r="7" fill="#f28c3b"/>' +
    '<path d="M0 -9 L-1 -16 L4 -12 Z" fill="#f28c3b"/>' +
    '<path d="M9 -11 L13 -16 L13 -8 Z" fill="#f28c3b"/>' +
    '<circle cx="3" cy="-5" r="1.3" fill="#23405c"/><circle cx="8" cy="-5" r="1.3" fill="#23405c"/>' +
    '<circle cx="6" cy="-1" r="1.1" fill="#ff8fa3"/>' +
    '<path d="M-10 6 q-7 -1 -7 -9" stroke="#f28c3b" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
    '</g></svg>';
  (document.body || document.documentElement).appendChild(load);
  function hideLoad() {
    if (!load.parentNode) return;
    load.classList.add('out');
    setTimeout(function () { if (load.parentNode) load.remove(); }, 360);
  }
  if (document.readyState === 'complete') setTimeout(hideLoad, 380);
  else window.addEventListener('load', function () { setTimeout(hideLoad, 380); });
  setTimeout(hideLoad, 2600);   // ապահովագրություն՝ երբեք չկախվի

  // ——— 🔊 Ձայնը՝ մեկ կոճակ բոլոր խաղերի համար ———
  // Բոլոր խաղերն օգտագործում են Web Audio. կտրում ենք հենց արմատից՝
  // ամեն նոր AudioContext-ի ելքը անցնում է մեր «գլխավոր ձայնի» միջով։
  var muted = ls.get('gg-muted', '0') === '1';
  var masters = [];
  var AC = window.AudioContext || window.webkitAudioContext;
  if (AC) {
    var Patched = function () {
      var ctx = new AC();
      try {
        var g = ctx.createGain();
        g.gain.value = muted ? 0 : 1;
        g.connect(ctx.destination);
        masters.push(g);
        Object.defineProperty(ctx, 'destination', { get: function () { return g; } });
      } catch (e) {}
      return ctx;
    };
    Patched.prototype = AC.prototype;
    window.AudioContext = Patched;
    if (window.webkitAudioContext) window.webkitAudioContext = Patched;
  }
  function applyMute() {
    for (var i = 0; i < masters.length; i++) {
      try { masters[i].gain.value = muted ? 0 : 1; } catch (e) {}
    }
  }

  // ——— 📳 Թրթռոց՝ երբ նոր ռեկորդ է գրվում ———
  // Չենք կարող ամեն խաղում «հաղթանակը» ճանաչել, բայց ամեն խաղ ռեկորդը
  // պահում է localStorage-ում. հենց թիվը մեծանում է — ուրեմն հաղթել ես 🎉
  try {
    var origSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      var isRec = typeof k === 'string' && /^(aren-|cat-best)/.test(k) &&
                  /(best|level|ends)$/.test(k);
      var before = isRec ? Number(origSet.call && localStorage.getItem(k)) : 0;
      origSet.apply(this, arguments);
      if (isRec) {
        var after = Number(v);
        if (!isNaN(after) && after > (isNaN(before) ? 0 : before)) {
          try { if (navigator.vibrate) navigator.vibrate([28, 60, 90]); } catch (e) {}
        }
      }
    };
  } catch (e) {}

  // ——— Փոքրիկ ծանուցում ———
  function toast(txt) {
    var t = document.createElement('div');
    t.id = 'ggToast';
    t.textContent = txt;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2000);
  }

  // ——— 📸 Ռեկորդի նկարը ———
  // Խաղի կանվասը (եթե կա) դնում ենք ոսկե շրջանակի մեջ, վրան՝ ռեկորդը։
  function bestOfPage() {
    var best = null;
    try {
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (!/^(aren-|cat-best)/.test(k) || !/(best|level|ends)$/.test(k)) continue;
        var slug = location.pathname.replace(/\/index\.html?$/, '').split('/').filter(Boolean).pop() || '';
        if (slug && (k.indexOf(slug) >= 0 || (slug === 'run' && k === 'cat-best'))) {
          best = { k: k, v: localStorage.getItem(k) };
          break;
        }
      }
    } catch (e) {}
    return best;
  }
  function shoot() {
    var src = document.querySelector('canvas');
    var W = 720, H = 900;
    var out = document.createElement('canvas');
    out.width = W; out.height = H;
    var c = out.getContext('2d');
    c.fillStyle = '#12122b'; c.fillRect(0, 0, W, H);
    c.strokeStyle = '#ffd166'; c.lineWidth = 10;
    c.strokeRect(18, 18, W - 36, H - 36);
    // վերնագիր
    c.fillStyle = '#ffd166';
    c.font = 'bold 44px "Arial Rounded MT Bold","Noto Sans Armenian",Arial,sans-serif';
    c.textAlign = 'center';
    c.fillText('GOLDEN GAMES', W / 2, 92);
    // խաղի պատկերը
    var top = 130, boxH = 470;
    if (src && src.width > 0 && src.height > 0) {
      var r = Math.min((W - 100) / src.width, boxH / src.height);
      var dw = src.width * r, dh = src.height * r;
      try { c.drawImage(src, (W - dw) / 2, top + (boxH - dh) / 2, dw, dh); } catch (e) {}
    }
    // ռեկորդը
    var b = bestOfPage();
    var name = (document.title || '').replace(/\s+$/, '');
    c.fillStyle = '#eef0ff';
    c.font = 'bold 40px "Arial Rounded MT Bold","Noto Sans Armenian",Arial,sans-serif';
    c.fillText(name, W / 2, top + boxH + 70);
    if (b) {
      c.fillStyle = '#ffd166';
      c.font = 'bold 72px "Arial Rounded MT Bold","Noto Sans Armenian",Arial,sans-serif';
      c.fillText(T.rec + ': ' + b.v, W / 2, top + boxH + 160);
    }
    c.fillStyle = '#9a9ec7';
    c.font = '28px "Arial Rounded MT Bold","Noto Sans Armenian",Arial,sans-serif';
    c.fillText('aren-alpha.vercel.app', W / 2, H - 56);

    try {
      var a = document.createElement('a');
      a.download = 'golden-games.png';
      a.href = out.toDataURL('image/png');
      document.body.appendChild(a);
      a.click();
      a.remove();
      toast(T.saved);
    } catch (e) {}
  }

  // ——— ⏸️ Դադարը ———
  // Խաղերը նկարում են requestAnimationFrame-ով. դադարի ժամանակ
  // պահում ենք կանչերը ու հետո միանգամից բաց թողնում։
  var paused = false, queue = [];
  var rafOrig = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = function (cb) {
    if (paused) { queue.push(cb); return -1; }
    return rafOrig(cb);
  };
  var pauseEl = document.createElement('div');
  pauseEl.id = 'ggPause';
  pauseEl.hidden = true;
  pauseEl.innerHTML = '<div class="t"></div><div class="s"></div>';
  (document.body || document.documentElement).appendChild(pauseEl);
  pauseEl.querySelector('.t').textContent = T.paused;
  pauseEl.querySelector('.s').textContent = T.resume;
  function setPause(on) {
    if (on === paused) return;
    paused = on;
    pauseEl.hidden = !on;
    if (!on) {
      var q = queue; queue = [];
      for (var i = 0; i < q.length; i++) rafOrig(q[i]);
    }
    var pb = document.getElementById('ggPauseBtn');
    if (pb) pb.textContent = on ? '▶' : '⏸';
  }
  pauseEl.addEventListener('pointerdown', function () { setPause(false); });
  window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.code === 'Escape') { e.preventDefault(); setPause(!paused); }
  });

  // ——— Կոճակների շերտը ———
  var bar = document.createElement('div');
  bar.id = 'ggBar';
  var bSound = document.createElement('button');
  bSound.id = 'ggSoundBtn';
  bSound.title = T.sound;
  bSound.textContent = muted ? '🔇' : '🔊';
  if (muted) bSound.className = 'off';
  bSound.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    muted = !muted;
    ls.set('gg-muted', muted ? '1' : '0');
    bSound.textContent = muted ? '🔇' : '🔊';
    bSound.className = muted ? 'off' : '';
    applyMute();
  });
  bar.appendChild(bSound);

  if (!isPortal) {
    var bPause = document.createElement('button');
    bPause.id = 'ggPauseBtn';
    bPause.textContent = '⏸';
    bPause.addEventListener('pointerdown', function (e) { e.preventDefault(); setPause(!paused); });
    bar.appendChild(bPause);

    var bShot = document.createElement('button');
    bShot.id = 'ggShotBtn';
    bShot.title = T.shot;
    bShot.textContent = '📸';
    bShot.addEventListener('pointerdown', function (e) { e.preventDefault(); shoot(); });
    bar.appendChild(bShot);
  }
  (document.body || document.documentElement).appendChild(bar);

  // Դրսից էլ կարելի է կանչել (թեստերի ու ապագա խաղերի համար)
  window.ggKit = {
    pause: setPause,
    isPaused: function () { return paused; },
    mute: function (v) { muted = !!v; ls.set('gg-muted', muted ? '1' : '0'); applyMute(); bSound.textContent = muted ? '🔇' : '🔊'; },
    isMuted: function () { return muted; },
    shot: shoot
  };
})();
