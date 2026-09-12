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
    hy: { paused: 'ԴԱԴԱՐ', resume: 'Շարունակելու համար հպիր', sound: 'Ձայն', shot: 'Ռեկորդի նկարը', saved: 'Նկարը պահվեց 📸', rec: 'Ռեկորդ', shop: 'Խանութ', wDaily: 'օրվա մարտահրավեր', wTroph: 'նոր գավաթ', wRec: 'նոր ռեկորդ', gift: 'Բացման նվեր' },
    ru: { paused: 'ПАУЗА', resume: 'Коснись, чтобы продолжить', sound: 'Звук', shot: 'Картинка рекорда', saved: 'Картинка сохранена 📸', rec: 'Рекорд', shop: 'Магазин', wDaily: 'задание дня', wTroph: 'новый кубок', wRec: 'новый рекорд', gift: 'Подарок на старт' },
    en: { paused: 'PAUSED', resume: 'Tap to continue', sound: 'Sound', shot: 'Record picture', saved: 'Picture saved 📸', rec: 'Best', shop: 'Shop', wDaily: 'daily challenge', wTroph: 'new trophy', wRec: 'new record', gift: 'Welcome gift' },
    es: { paused: 'PAUSA', resume: 'Toca para continuar', sound: 'Sonido', shot: 'Imagen del récord', saved: 'Imagen guardada 📸', rec: 'Récord', shop: 'Tienda', wDaily: 'reto del día', wTroph: 'nuevo trofeo', wRec: 'nuevo récord', gift: 'Regalo de bienvenida' },
    fr: { paused: 'PAUSE', resume: 'Touche pour continuer', sound: 'Son', shot: 'Image du record', saved: 'Image enregistrée 📸', rec: 'Record', shop: 'Boutique', wDaily: 'défi du jour', wTroph: 'nouveau trophée', wRec: 'nouveau record', gift: 'Cadeau de bienvenue' },
    de: { paused: 'PAUSE', resume: 'Tippe zum Weitermachen', sound: 'Ton', shot: 'Rekordbild', saved: 'Bild gespeichert 📸', rec: 'Rekord', shop: 'Laden', wDaily: 'Tages-Challenge', wTroph: 'neuer Pokal', wRec: 'neuer Rekord', gift: 'Willkommensgeschenk' },
    ja: { paused: 'ポーズ', resume: 'タップでつづける', sound: '音', shot: 'きろくの画ぞう', saved: '画ぞうをほぞんしたよ 📸', rec: 'ベスト', shop: 'おみせ', wDaily: 'まいにちチャレンジ', wTroph: 'あたらしいトロフィー', wRec: 'しんきろく', gift: 'はじめのプレゼント' },
    zh: { paused: '暂停', resume: '点一下继续', sound: '声音', shot: '纪录图片', saved: '图片已保存 📸', rec: '纪录', shop: '商店', wDaily: '每日挑战', wTroph: '新奖杯', wRec: '新纪录', gift: '开局礼物' },
    it: { paused: 'PAUSA', resume: 'Tocca per continuare', sound: 'Suono', shot: 'Immagine del record', saved: 'Immagine salvata 📸', rec: 'Record', shop: 'Negozio', wDaily: 'sfida del giorno', wTroph: 'nuovo trofeo', wRec: 'nuovo record', gift: 'Regalo di benvenuto' },
    ka: { paused: 'პაუზა', resume: 'შეეხე გასაგრძელებლად', sound: 'ხმა', shot: 'რეკორდის სურათი', saved: 'სურათი შენახულია 📸', rec: 'რეკორდი', shop: 'მაღაზია', wDaily: 'დღის გამოწვევა', wTroph: 'ახალი თასი', wRec: 'ახალი რეკორდი', gift: 'მისალმების საჩუქარი' },
    hi: { paused: 'रुका हुआ', resume: 'जारी रखने के लिए टैप करो', sound: 'आवाज़', shot: 'रिकॉर्ड की तस्वीर', saved: 'तस्वीर सेव हो गई 📸', rec: 'रिकॉर्ड', shop: 'दुकान', wDaily: 'आज की चुनौती', wTroph: 'नई ट्रॉफ़ी', wRec: 'नया रिकॉर्ड', gift: 'स्वागत तोहफ़ा' }
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
    // 🪙 ոսկու պիտակը՝ նույն շերտում, բայց լայնությունն ազատ է
    '#ggBar a#ggCoin{display:flex;align-items:center;gap:3px;height:38px;padding:0 11px;border-radius:12px;',
    'border:2px solid rgba(255,209,102,0.75);background:rgba(20,26,34,0.78);color:#ffd166;text-decoration:none;',
    'font-family:"Arial Rounded MT Bold","Noto Sans Armenian",Arial,sans-serif;font-weight:bold;font-size:0.9rem;line-height:1;white-space:nowrap}',
    '#ggBar a#ggCoin:active{transform:scale(0.94)}',
    '#ggBar a#ggCoin.up{animation:ggCoinPop 0.5s}',
    '@keyframes ggCoinPop{0%{transform:scale(1)}40%{transform:scale(1.25);border-color:#fff}100%{transform:scale(1)}}',
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
    '@keyframes ggFade{to{opacity:0;visibility:hidden}}',
    // 📖 «Ինչպես խաղալ» քարտը — առաջին անգամ մտնողի համար
    '.gg-how[hidden]{display:none!important}',
    '.gg-how{position:fixed;inset:0;z-index:135;background:rgba(10,12,28,0.86);display:flex;align-items:center;',
    'justify-content:center;padding:20px;font-family:"Arial Rounded MT Bold","Noto Sans Armenian",Arial,sans-serif}',
    '.gg-how-card{background:#1d1d3f;border:2px solid #ffd166;border-radius:18px;padding:20px 18px;max-width:340px;width:100%;color:#f5eede}',
    '.gg-how-card h3{margin:0 0 12px;color:#ffd166;font-size:1.1rem;text-align:center}',
    '.gg-how-card ol{margin:0;padding-left:22px;font-size:0.92rem;line-height:1.55}',
    '.gg-how-card li{margin-bottom:6px}',
    '.gg-how-diff{margin:14px 0 14px;text-align:center;font-size:0.82rem;color:#9a9ec7;letter-spacing:1px}',
    '.gg-how-ok{width:100%;padding:12px;border-radius:12px;border:none;background:#ffd166;color:#2e2410;',
    'font-family:inherit;font-weight:bold;font-size:0.95rem;cursor:pointer}',
    // ⭐ աստղիկները քարտի անկյունում
    '.gg-stars{position:absolute;left:8px;bottom:8px;z-index:2;font-size:0.7rem;letter-spacing:1px;',
    'background:rgba(10,12,28,0.7);border-radius:999px;padding:3px 8px;line-height:1}',
    // ▶ շարունակել վերջին խաղը
    '.gg-cont{display:block;margin:0 0 18px;padding:12px 16px;border-radius:14px;text-align:center;text-decoration:none;',
    'background:linear-gradient(90deg,#ffd166,#ffe9a8);color:#2e2410;font-weight:bold;font-size:0.92rem;',
    'font-family:"Arial Rounded MT Bold","Noto Sans Armenian",Arial,sans-serif}'
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

  // ——————————————————————————————————————————————————————
  //  🪙 ՈՍԿԻՆ — ընդհանուր գանձարան ԲՈԼՈՐ խաղերի համար
  //  Արենի միտքն է. «40 խաղը հիմա 40 առանձին կղզի են։ Մեկ ընդհանուր
  //  ոսկի, որ կապում է բոլորը իրար»։
  //    ամեն 10 միավոր ռեկորդից = 1 🪙 · ամեն նոր մակարդակ = 3 🪙
  //    օրվա մարտահրավերը = +20 🪙 · նոր գավաթ = +50 🪙
  //  Ոչ մի խաղի կոդ չենք փոխում — ոսկին ինքն է լսում localStorage-ը։
  // ——————————————————————————————————————————————————————
  var origSet = Storage.prototype.setItem;
  // Ուղիղ կարդալ-գրել՝ առանց մեր թակարդի, որ ոսկին ինքն իրեն չհաշվի
  function rawGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function rawSet(k, v) { try { origSet.call(localStorage, k, String(v)); } catch (e) {} }
  function num(v) { var n = Number(v); return isNaN(n) ? 0 : n; }

  // Ռեկորդի բանալի՞ է. ամեն խաղ իր ռեկորդը պահում է այս ձևով
  function isRec(k) { return typeof k === 'string' && /^(aren-|cat-best)/.test(k) && /(best|level|ends|max)$/.test(k); }
  // Որքա՞ն ոսկի է արժե այս ռեկորդը. մակարդակն ավելի թանկ է, քան մեկ միավորը
  function worth(k, v) {
    if (!(v > 0)) return 0;
    return /(level|ends|max)$/.test(k) ? Math.floor(v) * 3 : Math.floor(v / 10);
  }

  var coins = num(rawGet('gg-coins'));
  var coinsTotal = num(rawGet('gg-coins-total'));
  var own = (rawGet('gg-own') || '').split(',').filter(function (x) { return x; });
  var coinEl = null, giftLater = 0;

  // ——— Առաջին անգամ. հին ռեկորդները նշում ենք «արդեն հաշված» ———
  // Այլապես 38 գավաթը միանգամից 1900 ոսկի կտար ու մեծ նպատակը կկորչեր։
  if (rawGet('gg-coins-init') !== '1') {
    try {
      var olds = [];
      for (var i = 0; i < localStorage.length; i++) olds.push(localStorage.key(i));
      for (var j = 0; j < olds.length; j++) {
        var ok = olds[j];
        if (!isRec(ok)) continue;
        var ov = num(rawGet(ok));
        rawSet('gg-cm-' + ok, worth(ok, ov));
        if (ov > 0) rawSet('gg-t-' + ok, '1');
      }
    } catch (e) {}
    coins = coinsTotal = 100;               // բացման նվեր, որ խանութը դատարկ չլինի
    rawSet('gg-coins', coins);
    rawSet('gg-coins-total', coinsTotal);
    rawSet('gg-coins-init', '1');
    giftLater = 100;
  }

  function paintCoin(pop) {
    if (!coinEl) return;
    coinEl.textContent = '🪙 ' + coins;
    if (pop) {
      coinEl.classList.remove('up');
      void coinEl.offsetWidth;              // որ անիմացիան ամեն անգամ նորից սկսվի
      coinEl.classList.add('up');
    }
  }

  function award(n, why) {
    if (!(n > 0)) return;
    coins += n; coinsTotal += n;
    rawSet('gg-coins', coins);
    rawSet('gg-coins-total', coinsTotal);
    paintCoin(true);
    try { if (navigator.vibrate) navigator.vibrate([18, 40, 40]); } catch (e) {}
    if (document.body) toast('+' + n + ' 🪙' + (why ? ' · ' + why : ''));
  }

  // ——— Ամեն localStorage-ի գրառում անցնում է այստեղից ———
  function coinCheck(k, v) {
    if (typeof k !== 'string' || k.indexOf('gg-') === 0) return;

    // 🌍 օրվա մարտահրավերը. գլխավոր էջն է գրում, երբ կատարված է
    if (/^aren-daily-/.test(k) && String(v) === '1') {
      if (rawGet('gg-d-' + k) !== '1') { rawSet('gg-d-' + k, '1'); award(20, T.wDaily); }
      return;
    }
    if (!isRec(k)) return;

    var val = Number(v);
    if (isNaN(val)) return;
    var n = 0, why = T.wRec;

    // 🏆 նոր գավաթ — առաջին անգամ, որ այս խաղում միավոր ես գրել
    if (val > 0 && rawGet('gg-t-' + k) !== '1') { rawSet('gg-t-' + k, '1'); n += 50; why = T.wTroph; }

    // 🪙 ռեկորդի ոսկին. հաշվում ենք միայն նոր աճը, նույնը երկու անգամ չի վճարվում
    var want = worth(k, val), had = num(rawGet('gg-cm-' + k));
    if (want > had) { rawSet('gg-cm-' + k, want); n += want - had; }

    award(n, why);
  }

  try {
    Storage.prototype.setItem = function (k, v) {
      // 📳 Թրթռոց՝ երբ նոր ռեկորդ է գրվում
      var rec = isRec(k);
      var before = rec ? num(localStorage.getItem(k)) : 0;
      origSet.apply(this, arguments);
      if (rec) {
        var after = Number(v);
        if (!isNaN(after) && after > before) {
          try { if (navigator.vibrate) navigator.vibrate([28, 60, 90]); } catch (e) {}
        }
      }
      try { coinCheck(k, v); } catch (e) {}
    };
  } catch (e) {}

  // ——— 🎨 Կայքի գույնը. խանութից գնված տեսքը ———
  // Գլխավոր էջերը ապրում են CSS փոփոխականներով — դրանք վերևից փոխում ենք։
  var THEMES = {
    gold:  { bg: '#241b06', card: '#3d2e0d', ink: '#fff6df', dim: '#d9c183', accent: '#ffd166', accent2: '#ffe9a8' },
    green: { bg: '#0b2018', card: '#123528', ink: '#e9fff4', dim: '#8fc7ac', accent: '#6ee7b7', accent2: '#c7f9e5' },
    space: { bg: '#05060f', card: '#151b36', ink: '#e8ecff', dim: '#8b93c7', accent: '#a78bfa', accent2: '#67e8f9' }
  };
  function applyTheme(t) {
    var th = THEMES[t], el = document.documentElement;
    ['bg', 'card', 'ink', 'dim', 'accent', 'accent2'].forEach(function (nm) {
      if (th) el.style.setProperty('--' + nm, th[nm]);
      else el.style.removeProperty('--' + nm);
    });
  }
  applyTheme(rawGet('gg-theme') || '');

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

  // 🪙 Ոսկու հաշվիչը. սեղմում ես — գնում ես խանութ։
  // Ինքն իր ճանապարհը գտնում է. cat-jump/run/-ից «../../», գլխավոր էջից՝ «./»։
  var segs = location.pathname.split('/').filter(function (x) { return x && x.indexOf('.html') < 0; });
  var up = segs.length ? new Array(segs.length + 1).join('../') : './';
  // Խաղի էջին պիտակը ՉԵՆՔ դնում — վերևի անկյունը խաղինն է (սրտիկներ, ռեկորդ)։
  // Ոսկին այնտեղ երևում է «+N 🪙» ծանուցումով, հենց վաստակելու պահին։
  if (isPortal && segs[segs.length - 1] !== 'shop') {
    coinEl = document.createElement('a');
    coinEl.id = 'ggCoin';
    coinEl.href = up + 'shop/';
    coinEl.title = T.shop;
    bar.appendChild(coinEl);
    paintCoin(false);
  }

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
  if (giftLater) toast(T.gift + ' +' + giftLater + ' 🪙');

  // Դրսից էլ կարելի է կանչել (թեստերի ու ապագա խաղերի համար)

  // ——————————————————————————————————————————————————————
  //  📖 «ԻՆՉՊԵՍ ԽԱՂԱԼ» · ⭐ ԴԺՎԱՐՈՒԹՅՈՒՆ · ▶ ՇԱՐՈՒՆԱԿԵԼ
  //  Արենի պատվերն է։ Երեք տողը հավաքվում է ընդհանուր բառակազմից,
  //  որ 38 խաղ × 11 լեզու չլինի անհնար բան — ամեն խաղ ընտրում է 3 բանալի։
  // ——————————————————————————————————————————————————————
  var PH = {
    hy: { tap:'Հպիր էկրանին', btn:'Հպիր ներքևի կոճակներին', swipe:'Սահեցրու մատով', drag:'Քաշիր մատով',
          hold:'Պահիր մատդ սեղմած', aim:'Քաշիր ետ ու բաց թող՝ նշան բռնելու համար', steer:'Ձախ ու աջ կոճակներով ուղղիր',
          two:'Երկուսով, մեկ հեռախոսով՝ ամեն մեկն իր կողմը', collect:'Հավաքիր որքան կարող ես',
          avoid:'Խուսափիր խոչընդոտներից', survive:'Ապրիր որքան կարող ես երկար', time:'Ժամանակը սահմանափակ է',
          levels:'Ամեն մակարդակ ավելի դժվար է', match:'Գտիր զույգերը', repeat:'Կրկնիր հերթականությունը',
          build:'Կառուցիր որքան բարձր', think:'Շտապելու կարիք չկա — մտածիր', lives:'Ունես 3 կյանք',
          rec:'Ռեկորդդ ինքն է պահվում', faster:'Որքան առաջ գնաս, այնքան արագ է', rhythm:'Պահիր ռիթմը',
          free:'Ազատ խաղա — հաղթող ու պարտվող չկա' },
    ru: { tap:'Нажимай на экран', btn:'Нажимай на кнопки внизу', swipe:'Проводи пальцем', drag:'Тяни пальцем',
          hold:'Держи палец нажатым', aim:'Оттяни назад и отпусти, чтобы прицелиться', steer:'Управляй кнопками влево-вправо',
          two:'Вдвоём на одном телефоне: каждому своя сторона', collect:'Собери как можно больше',
          avoid:'Уворачивайся от препятствий', survive:'Продержись как можно дольше', time:'Время ограничено',
          levels:'Каждый уровень сложнее', match:'Найди пары', repeat:'Повтори последовательность',
          build:'Строй как можно выше', think:'Спешить некуда — подумай', lives:'У тебя 3 жизни',
          rec:'Рекорд сохраняется сам', faster:'Чем дальше, тем быстрее', rhythm:'Держи ритм',
          free:'Играй свободно — тут нет проигравших' },
    en: { tap:'Tap the screen', btn:'Tap the buttons below', swipe:'Swipe with your finger', drag:'Drag with your finger',
          hold:'Hold your finger down', aim:'Pull back and let go to aim', steer:'Steer with the left and right buttons',
          two:'Two players on one phone, one side each', collect:'Collect as much as you can',
          avoid:'Dodge the obstacles', survive:'Last as long as you can', time:'The clock is running',
          levels:'Every level is harder', match:'Find the pairs', repeat:'Repeat the sequence',
          build:'Build as high as you can', think:'No rush — think it through', lives:'You have 3 lives',
          rec:'Your best score saves itself', faster:'The further you go, the faster it gets', rhythm:'Keep the rhythm',
          free:'Just play — nobody wins or loses' },
    es: { tap:'Toca la pantalla', btn:'Toca los botones de abajo', swipe:'Desliza el dedo', drag:'Arrastra con el dedo',
          hold:'Mantén el dedo pulsado', aim:'Tira hacia atrás y suelta para apuntar', steer:'Dirige con los botones izquierda y derecha',
          two:'Dos jugadores en un móvil, cada uno su lado', collect:'Consigue todo lo que puedas',
          avoid:'Esquiva los obstáculos', survive:'Aguanta lo máximo posible', time:'El tiempo corre',
          levels:'Cada nivel es más difícil', match:'Encuentra las parejas', repeat:'Repite la secuencia',
          build:'Construye lo más alto posible', think:'Sin prisa: piensa', lives:'Tienes 3 vidas',
          rec:'Tu récord se guarda solo', faster:'Cuanto más avanzas, más rápido va', rhythm:'Mantén el ritmo',
          free:'Juega libre: aquí nadie pierde' },
    fr: { tap:'Touche l’écran', btn:'Touche les boutons en bas', swipe:'Glisse le doigt', drag:'Tire avec le doigt',
          hold:'Garde le doigt appuyé', aim:'Tire en arrière et lâche pour viser', steer:'Dirige avec les boutons gauche et droite',
          two:'À deux sur un téléphone, chacun son côté', collect:'Ramasse tout ce que tu peux',
          avoid:'Évite les obstacles', survive:'Tiens le plus longtemps possible', time:'Le temps est compté',
          levels:'Chaque niveau est plus dur', match:'Trouve les paires', repeat:'Répète la séquence',
          build:'Construis le plus haut possible', think:'Rien ne presse — réfléchis', lives:'Tu as 3 vies',
          rec:'Ton record se sauvegarde tout seul', faster:'Plus tu avances, plus ça accélère', rhythm:'Garde le rythme',
          free:'Joue librement — pas de perdant ici' },
    de: { tap:'Tippe auf den Bildschirm', btn:'Tippe auf die Knöpfe unten', swipe:'Wische mit dem Finger', drag:'Zieh mit dem Finger',
          hold:'Halte den Finger gedrückt', aim:'Zieh zurück und lass los zum Zielen', steer:'Lenke mit den Knöpfen links und rechts',
          two:'Zu zweit an einem Handy, jeder eine Seite', collect:'Sammle so viel du kannst',
          avoid:'Weiche den Hindernissen aus', survive:'Halte so lange durch wie möglich', time:'Die Zeit läuft',
          levels:'Jedes Level ist schwerer', match:'Finde die Paare', repeat:'Wiederhole die Reihenfolge',
          build:'Bau so hoch wie möglich', think:'Keine Eile — denk nach', lives:'Du hast 3 Leben',
          rec:'Dein Rekord speichert sich selbst', faster:'Je weiter du kommst, desto schneller wird es', rhythm:'Halte den Rhythmus',
          free:'Spiel einfach — hier verliert niemand' },
    ja: { tap:'がめんをタップ', btn:'したのボタンをタップ', swipe:'ゆびですべらせる', drag:'ゆびでひっぱる',
          hold:'ゆびをおしたままに', aim:'うしろにひっぱってはなすとねらえる', steer:'ひだり・みぎのボタンでうごかす',
          two:'ふたりで1だいのスマホ、それぞれのがわ', collect:'できるだけたくさんあつめよう',
          avoid:'じゃまなものをよけよう', survive:'できるだけながくいきのころう', time:'じかんげんていだよ',
          levels:'レベルごとにむずかしくなる', match:'おなじペアをさがそう', repeat:'じゅんばんをまねしよう',
          build:'できるだけたかくつもう', think:'いそがなくていい、かんがえよう', lives:'ライフは3つ',
          rec:'きろくはじどうでほぞんされる', faster:'すすむほどはやくなる', rhythm:'リズムをキープ',
          free:'じゆうにあそんでね。かちまけはないよ' },
    zh: { tap:'点一下屏幕', btn:'点下面的按钮', swipe:'用手指滑动', drag:'用手指拖',
          hold:'按住不放', aim:'往后拉再放开来瞄准', steer:'用左右按钮控制',
          two:'两个人一部手机，各占一边', collect:'尽量多收集',
          avoid:'躲开障碍', survive:'坚持得越久越好', time:'时间有限',
          levels:'每一关都更难', match:'找出成对的', repeat:'照着顺序重复',
          build:'尽量往高处搭', think:'不用急，慢慢想', lives:'你有 3 条命',
          rec:'纪录会自动保存', faster:'走得越远越快', rhythm:'跟上节奏',
          free:'随便玩，没有输赢' },
    it: { tap:'Tocca lo schermo', btn:'Tocca i pulsanti in basso', swipe:'Scorri col dito', drag:'Trascina col dito',
          hold:'Tieni il dito premuto', aim:'Tira indietro e lascia per mirare', steer:'Guida coi pulsanti sinistra e destra',
          two:'In due su un telefono, ognuno il suo lato', collect:'Raccogli più che puoi',
          avoid:'Schiva gli ostacoli', survive:'Resisti il più a lungo possibile', time:'Il tempo scorre',
          levels:'Ogni livello è più difficile', match:'Trova le coppie', repeat:'Ripeti la sequenza',
          build:'Costruisci più in alto che puoi', think:'Nessuna fretta: ragiona', lives:'Hai 3 vite',
          rec:'Il tuo record si salva da solo', faster:'Più vai avanti, più diventa veloce', rhythm:'Tieni il ritmo',
          free:'Gioca libero: qui nessuno perde' },
    ka: { tap:'შეეხე ეკრანს', btn:'შეეხე ქვედა ღილაკებს', swipe:'გადაასრიალე თითი', drag:'გაათრიე თითით',
          hold:'დააჭირე და გეჭიროს', aim:'გამოქაჩე უკან და გაუშვი დასამიზნებლად', steer:'მართე მარცხენა და მარჯვენა ღილაკებით',
          two:'ორნი ერთ ტელეფონზე, თითოეულს თავისი მხარე', collect:'შეაგროვე რაც შეიძლება მეტი',
          avoid:'აარიდე თავი დაბრკოლებებს', survive:'გაძელი რაც შეიძლება დიდხანს', time:'დრო შეზღუდულია',
          levels:'ყოველი დონე უფრო რთულია', match:'იპოვე წყვილები', repeat:'გაიმეორე თანმიმდევრობა',
          build:'ააშენე რაც შეიძლება მაღლა', think:'აჩქარება არ სჭირდება — იფიქრე', lives:'გაქვს 3 სიცოცხლე',
          rec:'რეკორდი თავად ინახება', faster:'რაც უფრო შორს წახვალ, მით უფრო სწრაფია', rhythm:'დაიცავი რიტმი',
          free:'უბრალოდ ითამაშე — აქ წაგებული არაა' },
    hi: { tap:'स्क्रीन को छुओ', btn:'नीचे के बटन दबाओ', swipe:'उंगली से स्वाइप करो', drag:'उंगली से खींचो',
          hold:'उंगली दबाए रखो', aim:'पीछे खींचकर छोड़ो, निशाना लगेगा', steer:'बाएँ-दाएँ बटन से चलाओ',
          two:'एक फ़ोन पर दो खिलाड़ी, हर एक का अपना हिस्सा', collect:'जितना हो सके इकट्ठा करो',
          avoid:'रुकावटों से बचो', survive:'जितनी देर हो सके टिके रहो', time:'समय सीमित है',
          levels:'हर लेवल और मुश्किल है', match:'जोड़े ढूँढो', repeat:'क्रम दोहराओ',
          build:'जितना ऊँचा हो सके बनाओ', think:'जल्दी नहीं है — सोचो', lives:'तुम्हारे पास 3 जान हैं',
          rec:'तुम्हारा रिकॉर्ड अपने आप सेव होता है', faster:'जितना आगे जाओगे उतना तेज़ होगा', rhythm:'ताल बनाए रखो',
          free:'बस खेलो — यहाँ कोई हारता नहीं' }
  };
  var P = PH[lang] || PH.hy;

  // Ամեն խաղ՝ 3 բանալի ու դժվարության աստղեր (1–3)
  var GAMES = {
    'cat-jump':   { h:['tap','avoid','faster'],        s:1 },
    'city-drive': { h:['steer','collect','levels'],    s:2 },
    'piano':      { h:['tap','free','rhythm'],         s:1 },
    'rocket':     { h:['drag','collect','lives'],      s:2 },
    'memory':     { h:['tap','match','think'],         s:1 },
    'fishing':    { h:['tap','collect','time'],        s:1 },
    'duel':       { h:['two','btn','free'],            s:1 },
    'maze':       { h:['drag','levels','think'],       s:2 },
    'tower':      { h:['tap','build','faster'],        s:2 },
    'moles':      { h:['tap','collect','time'],        s:1 },
    'beat':       { h:['tap','rhythm','rec'],          s:2 },
    'ninja':      { h:['tap','avoid','faster'],        s:2 },
    'men':        { h:['btn','repeat','levels'],       s:2 },
    'runner':     { h:['tap','avoid','faster'],        s:2 },
    'pipes':      { h:['tap','think','levels'],        s:2 },
    'blocks':     { h:['swipe','collect','think'],     s:2 },
    'words':      { h:['tap','think','levels'],        s:2 },
    'drums':      { h:['tap','free','rhythm'],         s:1 },
    'map':        { h:['tap','think','collect'],       s:1 },
    'story':      { h:['tap','think','free'],          s:1 },
    'bridge':     { h:['hold','think','levels'],       s:3 },
    'detective':  { h:['tap','think','time'],          s:2 },
    'elevator':   { h:['tap','collect','faster'],      s:2 },
    'traffic':    { h:['tap','avoid','faster'],        s:3 },
    'garden':     { h:['tap','think','collect'],       s:1 },
    'bank':       { h:['tap','collect','time'],        s:2 },
    'camera':     { h:['tap','collect','think'],       s:1 },
    'wire':       { h:['drag','think','levels'],       s:2 },
    'wind':       { h:['drag','think','levels'],       s:3 },
    'domino':     { h:['tap','think','levels'],        s:2 },
    'copy':       { h:['tap','repeat','levels'],       s:2 },
    'alphabet':   { h:['btn','think','rec'],           s:1 },
    'nardi':      { h:['tap','think','free'],          s:2 },
    'lavash':     { h:['tap','time','faster'],         s:2 },
    'dance':      { h:['btn','repeat','rhythm'],       s:2 },
    'sasuntsi':   { h:['aim','avoid','lives'],         s:3 },
    'rewind':      { h:['btn','think','levels'], s:3 },
    'two':         { h:['tap','avoid','faster'], s:2 },
    'mirror':      { h:['drag','collect','avoid'], s:3 },
    'grow':        { h:['drag','collect','think'], s:2 },
    'silence':     { h:['drag','think','levels'], s:3 },
    'onelife':     { h:['tap','think','levels'], s:3 },
    'slow':        { h:['drag','think','time'], s:2 },
    'swap':        { h:['tap','collect','faster'], s:2 }
  };

  var HOW_T = {
    hy: { t:'Ինչպես խաղալ', ok:'Հասկացա', diff:'Դժվարություն', cont:'▶ Շարունակել՝ ' },
    ru: { t:'Как играть', ok:'Понятно', diff:'Сложность', cont:'▶ Продолжить: ' },
    en: { t:'How to play', ok:'Got it', diff:'Difficulty', cont:'▶ Continue: ' },
    es: { t:'Cómo jugar', ok:'Entendido', diff:'Dificultad', cont:'▶ Seguir: ' },
    fr: { t:'Comment jouer', ok:'Compris', diff:'Difficulté', cont:'▶ Continuer : ' },
    de: { t:'So wird gespielt', ok:'Verstanden', diff:'Schwierigkeit', cont:'▶ Weiter: ' },
    ja: { t:'あそびかた', ok:'わかった', diff:'むずかしさ', cont:'▶ つづきから：' },
    zh: { t:'怎么玩', ok:'知道了', diff:'难度', cont:'▶ 继续：' },
    it: { t:'Come si gioca', ok:'Capito', diff:'Difficoltà', cont:'▶ Continua: ' },
    ka: { t:'როგორ ვითამაშოთ', ok:'გასაგებია', diff:'სირთულე', cont:'▶ გაგრძელება: ' },
    hi: { t:'कैसे खेलें', ok:'समझ गया', diff:'कठिनाई', cont:'▶ जारी रखो: ' }
  };
  var H = HOW_T[lang] || HOW_T.hy;

  // Ո՞ր խաղի էջում ենք — թղթապանակի անունով
  function folderOf(path) {
    var parts = path.split('/').filter(function (x) { return x && x.indexOf('.html') < 0; });
    for (var i = parts.length - 1; i >= 0; i--) if (GAMES[parts[i]]) return parts[i];
    return null;
  }
  var stars = function (n) { return '⭐'.repeat(n) + '☆'.repeat(3 - n); };

  if (!isPortal) {
    // ——— խաղի էջ. հիշում ենք վերջինը ու առաջին անգամ ցույց ենք տալիս կանոնները ———
    var folder = folderOf(location.pathname);
    if (folder) {
      ls.set('aren-last-game', folder);
      var seenKey = 'aren-how-' + folder;
      var box = document.createElement('div');
      box.className = 'gg-how';
      box.innerHTML = '<div class="gg-how-card"><h3></h3><ol></ol>'
        + '<div class="gg-how-diff"></div><button class="gg-how-ok"></button></div>';
      box.querySelector('h3').textContent = H.t;
      var ol = box.querySelector('ol');
      GAMES[folder].h.forEach(function (k) {
        var li = document.createElement('li'); li.textContent = P[k] || k; ol.appendChild(li);
      });
      box.querySelector('.gg-how-diff').textContent = H.diff + ' ' + stars(GAMES[folder].s);
      var okBtn = box.querySelector('.gg-how-ok');
      okBtn.textContent = H.ok;
      var closeHow = function () { box.hidden = true; ls.set(seenKey, '1'); };
      okBtn.addEventListener('pointerdown', function (e) { e.preventDefault(); closeHow(); });
      box.hidden = ls.get(seenKey, '0') === '1';
      document.body.appendChild(box);

      // «?» կոճակը — ուզածդ պահին նորից կարդալու համար
      var qb = document.createElement('button');
      qb.className = 'gg-how-btn'; qb.textContent = '?'; qb.title = H.t;
      qb.addEventListener('pointerdown', function (e) { e.preventDefault(); box.hidden = false; });
      bar.appendChild(qb);
    }
  } else {
    // ——— գլխավոր էջ. աստղիկներ քարտերին ու «շարունակել» կոճակ ———
    var cards = document.querySelectorAll('a.game');
    if (cards.length > 5) {
      Array.prototype.forEach.call(cards, function (a) {
        var f = folderOf(a.getAttribute('href') || '');
        if (!f) return;
        var cov = a.querySelector('.cover');
        if (!cov || cov.querySelector('.gg-stars')) return;
        var sp = document.createElement('span');
        sp.className = 'gg-stars'; sp.textContent = stars(GAMES[f].s);
        cov.appendChild(sp);
      });
      var last = ls.get('aren-last-game', '');
      if (last && GAMES[last]) {
        var card = document.querySelector('a.game[href="./' + last + '/"]');
        var nm = card ? (card.querySelector('h2') ? card.querySelector('h2').textContent.trim() : last) : last;
        var cb = document.createElement('a');
        cb.className = 'gg-cont'; cb.href = './' + last + '/';
        cb.textContent = H.cont + nm;
        var grid = document.querySelector('.grid');
        if (grid && grid.parentNode) grid.parentNode.insertBefore(cb, grid);
      }
    }
  }

  // 🪙 Խանութն ու ապագա խաղերը ոսկու հետ խոսում են այս դռնով
  window.ggCoins = {
    get: function () { return coins; },
    total: function () { return coinsTotal; },
    add: award,
    spend: function (n) {
      if (!(n >= 0) || coins < n) return false;
      coins -= n;
      rawSet('gg-coins', coins);
      paintCoin(true);
      return true;
    },
    owned: function (id) { return own.indexOf(id) >= 0; },
    list: function () { return own.slice(); },
    give: function (id) {
      if (own.indexOf(id) < 0) { own.push(id); rawSet('gg-own', own.join(',')); }
    },
    theme: function (t) { rawSet('gg-theme', t || ''); applyTheme(t || ''); },
    themeNow: function () { return rawGet('gg-theme') || ''; },
    themes: THEMES
  };

  window.ggKit = {
    pause: setPause,
    isPaused: function () { return paused; },
    mute: function (v) { muted = !!v; ls.set('gg-muted', muted ? '1' : '0'); applyMute(); bSound.textContent = muted ? '🔇' : '🔊'; },
    isMuted: function () { return muted; },
    shot: shoot
  };
})();
