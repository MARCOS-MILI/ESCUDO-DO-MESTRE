/* Escudo do Mestre. Uma página só, abas por #hash simples (#mesa, #npcs, #npc-kunz). */
(function () {
  'use strict';

  var D = window.Dados;
  var NPCS = window.NPCS, GRUPOS = window.GRUPOS, STATUS = window.STATUS;

  /* ---------------------------------------------------------------- utilidades */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var norm = function (s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };

  var mem = {};
  var store = {
    get: function (k, d) {
      try {
        var v = localStorage.getItem('esc:' + k);
        if (v !== null) return JSON.parse(v);
      } catch (e) { /* sem armazenamento */ }
      return k in mem ? mem[k] : d;
    },
    set: function (k, v) {
      mem[k] = v;
      try { localStorage.setItem('esc:' + k, JSON.stringify(v)); } catch (e) { /* ok */ }
    },
    del: function (k) {
      delete mem[k];
      try { localStorage.removeItem('esc:' + k); } catch (e) { /* ok */ }
    },
    all: function () {
      var o = {}, k;
      for (k in mem) o[k] = mem[k];
      try {
        for (var i = 0; i < localStorage.length; i++) {
          k = localStorage.key(i);
          if (k && k.indexOf('esc:') === 0) o[k.slice(4)] = JSON.parse(localStorage.getItem(k));
        }
      } catch (e) { /* ok */ }
      return o;
    }
  };

  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg; t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 1800);
  }

  function copy(text, msg) {
    var done = function () { toast(msg || 'Copiado'); };
    var fallback = function () {
      try {
        var ta = document.createElement('textarea');
        ta.value = text; ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
        document.body.appendChild(ta);
        ta.select(); ta.setSelectionRange(0, text.length);
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (ok) { done(); return; }
      } catch (e) { /* cai pra caixa */ }
      sheet('<h3>Copia daqui</h3><p class="small muted">O navegador não deixou copiar sozinho. Segura o texto e copia.</p>' +
        '<textarea class="field" id="cb" readonly rows="6">' + esc(text) + '</textarea>');
      var t = $('#cb'); if (t) t.select();
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
        return;
      }
    } catch (e) { /* cai */ }
    fallback();
  }

  var layer = $('#layer');
  function setLayer(id, html) {
    var old = document.getElementById(id);
    if (old) old.remove();
    if (html) layer.insertAdjacentHTML('beforeend', html);
    lockScroll();
  }
  function lockScroll() {
    document.body.style.overflow = layer.children.length ? 'hidden' : '';
  }
  function closeLayer(id) { setLayer(id, null); }

  function sheet(inner) {
    setLayer('m-sheet',
      '<div class="sheet" id="m-sheet" data-act="sheet-bg"><div class="sheet-in" role="dialog" aria-modal="true">' +
      inner + '<div class="row" style="margin-top:14px"><button class="btn gold" type="button" data-act="sheet-x">Fechar</button></div></div></div>');
  }

  function openImg(src, title) {
    setLayer('m-img',
      '<div class="lightbox" id="m-img"><div class="bar2"><span class="lab">' + esc(title || '') + '</span><span class="row">' +
      '<button class="btn sm" type="button" data-act="zoomtoggle">Ampliar</button>' +
      '<button class="btn sm gold" type="button" data-act="img-x">Fechar</button></span></div>' +
      '<div class="vp"><img src="' + esc(src) + '" alt="' + esc(title || 'Imagem') + '"></div></div>');
  }

  /* ---------------------------------------------------------------- endereços */
  function slash(u) { u = String(u || '').trim(); return u && u.slice(-1) !== '/' ? u + '/' : u; }
  // Endereço deste site, tirado da própria barra do navegador (não depende de maiúscula ou minúscula).
  function escudoBase() { return location.href.replace(/[?#].*$/, '').replace(/[^/]*$/, ''); }
  function liveBase() { return slash(store.get('cfg:live', window.CFG.base)); }
  // Imagens que vão pros jogadores saem do site dos jogadores (pasta pecas/), nunca deste site,
  // pra o endereço do Escudo não aparecer em nenhum link que vai pra mesa.
  function imgUrl(arq) { return liveBase() + 'pecas/' + arq; }
  // Imagens só do mestre (cartões de NPC, mapa do mestre) continuam saindo daqui.
  function ownUrl(rel) { return escudoBase() + rel; }
  function extractCode(s) {
    s = String(s || '').trim();
    var m = s.match(/[?&]j=([^&#\s]+)/);
    return m ? m[1] : s;
  }

  /* ---------------------------------------------------------------- abas */
  var TABS = [
    ['mesa', 'Mesa'], ['regras', 'Regras'], ['dados', 'Dados'], ['npcs', 'NPCs'], ['enigmas', 'Enigmas'],
    ['jogadores', 'Jogadores'], ['mapas', 'Mapas'], ['links', 'Links'], ['notas', 'Notas']
  ];
  var current = null;
  var view = $('#view');

  $('#tabs').innerHTML = TABS.map(function (t) {
    return '<a href="#' + t[0] + '" data-t="' + t[0] + '">' + t[1] + '</a>';
  }).join('');

  function route() {
    var h = (location.hash || '').slice(1);
    var tab = current || store.get('tab', 'mesa');
    var npc = null;
    if (h.indexOf('npc-') === 0) { tab = 'npcs'; npc = h.slice(4); }
    else if (TABS.some(function (t) { return t[0] === h; })) tab = h;
    if (!TABS.some(function (t) { return t[0] === tab; })) tab = 'mesa';
    if (tab !== current) {
      current = tab; store.set('tab', tab);
      render();
      window.scrollTo(0, 0);
    }
    if (npc && NPCS.some(function (n) { return n.slug === npc; })) openNpc(npc);
    else closeLayer('m-npc');
  }

  function render() {
    view.innerHTML = VIEWS[current]();
    if (AFTER[current]) AFTER[current]();
    $$('#tabs a').forEach(function (a) {
      if (a.dataset.t === current) {
        a.setAttribute('aria-current', 'page');
        try { a.scrollIntoView({ inline: 'center', block: 'nearest' }); } catch (e) { /* ok */ }
      } else a.removeAttribute('aria-current');
    });
  }

  /* ---------------------------------------------------------------- MESA */
  var clock = store.get('clock', { run: false, acc: 0, t0: 0 });
  function clockMs() { return clock.acc + (clock.run ? Date.now() - clock.t0 : 0); }
  function fmtClock(ms) {
    var s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
    var p = function (n) { return (n < 10 ? '0' : '') + n; };
    return (h ? h + ':' : '') + p(m) + ':' + p(x);
  }
  setInterval(function () {
    var c = $('#clk');
    if (c) c.textContent = fmtClock(clockMs());
  }, 500);

  function radioIdx(h) {
    var idx = -1;
    window.RADIO.forEach(function (r, i) { if (r[0] <= h) idx = i; });
    return idx;
  }
  function radioHtml() {
    var h = store.get('hora', 18);
    var idx = radioIdx(h);
    var R = window.RADIO;
    var agora = idx >= 0
      ? '<b>' + R[idx][0] + 'h</b> ' + esc(R[idx][1]) + '. ' + esc(R[idx][2])
      : 'Ainda antes do primeiro programa (12h).';
    var prox = R[idx + 1] ? 'Depois, às <b>' + R[idx + 1][0] + 'h</b>: ' + esc(R[idx + 1][1]) + '.' : 'Esse é o último bloco da rádio.';
    return '<div class="row sp"><div><div class="lab">Hora na história</div><div class="big-n">' + h + '<small>h</small></div></div>' +
      '<div class="row"><button class="btn" type="button" data-act="hora" data-d="-1" aria-label="Uma hora antes">&minus; 1h</button>' +
      '<button class="btn gold" type="button" data-act="hora" data-d="1" aria-label="Uma hora depois">+ 1h</button></div></div>' +
      '<div class="agora">' + agora + '<br><span class="muted">' + prox + '</span></div>' +
      '<div class="tw"><table><thead><tr><th>Hora</th><th>Na grade</th><th>O que acontece</th></tr></thead><tbody>' +
      R.map(function (r, i) {
        return '<tr class="' + (i < idx ? 'past' : i === idx ? 'now' : '') + '"><td class="n">' + r[0] + 'h</td><td>' + esc(r[1]) + '</td><td>' + esc(r[2]) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function cenaAtual() {
    var C = window.CENAS;
    for (var i = 0; i < C.length; i++) if (!store.get('cena:' + C[i].id, false)) return C[i];
    return null;
  }

  function accHtml(id, titulo, sub, corpo, extra) {
    return '<div class="acc' + (extra || '') + '" data-id="' + id + '"><button class="acc-h" type="button" data-act="acc" aria-expanded="false">' +
      '<span class="t">' + titulo + '</span><span class="ar" aria-hidden="true">&rsaquo;</span><span class="s">' + sub + '</span></button>' +
      '<div class="acc-b" hidden>' + corpo + '</div></div>';
  }

  function viewMesa() {
    var C = window.CENAS;
    var feitas = C.filter(function (c) { return store.get('cena:' + c.id, false); }).length;
    var cenas = C.map(function (c, i) {
      var ok = store.get('cena:' + c.id, false);
      return '<div class="acc' + (ok ? ' done' : '') + '" data-id="' + c.id + '"><div class="cena-h">' +
        '<label class="ck"><input type="checkbox" data-chg="cena" data-id="' + c.id + '"' + (ok ? ' checked' : '') + ' aria-label="Cena ' + (i + 1) + ' feita"></label>' +
        '<button class="acc-h" type="button" data-act="acc" aria-expanded="false"><span class="t">' + (i + 1) + '. ' + c.titulo + '</span>' +
        '<span class="ar" aria-hidden="true">&rsaquo;</span><span class="s"><span class="dur">' + c.dur + '</span> &middot; ' + c.resumo + '</span></button></div>' +
        '<div class="acc-b" hidden><ul class="ul">' + c.itens.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>' +
        '<div class="free"><b>Pista de graça</b>' + c.graca + '</div></div></div>';
    }).join('');
    var pend = window.PENDENCIAS.map(function (p, i) {
      return '<li><label class="row" style="flex-wrap:nowrap;gap:10px;align-items:flex-start"><input type="checkbox" style="width:22px;height:22px;accent-color:var(--gold);flex:none;margin-top:3px" data-chg="pend" data-i="' + i + '"' +
        (store.get('pend:' + i, false) ? ' checked' : '') + '><span>' + p + '</span></label></li>';
    }).join('');
    return '<h2>Mesa de hoje</h2><p class="lead">O que você precisa ver durante a sessão: hora, rádio, as cinco cenas e o socorro.</p>' +
      '<div class="clock">' +
      '<div class="card"><h3>Cronômetro da sessão</h3><div class="big-n" id="clk">' + fmtClock(clockMs()) + '</div>' +
      '<div class="row" style="margin-top:12px"><button class="btn gold" type="button" data-act="clock-toggle" id="clk-b">' + (clock.run ? 'Pausar' : 'Iniciar') + '</button>' +
      '<button class="btn" type="button" data-act="clock-reset">Zerar</button></div></div>' +
      '<div class="card"><h3>Cenas feitas</h3><div class="big-n" id="prog-n">' + feitas + '<small> de ' + C.length + '</small></div>' +
      '<div class="bar" style="margin-top:12px"><i id="prog-b" style="width:' + (feitas / C.length * 100) + '%"></i></div>' +
      '<p class="small muted" style="margin:10px 0 0">Marca a caixinha da cena quando terminar. O botão Travou? mostra a pista de graça da próxima.</p></div></div>' +
      '<div class="stack" style="margin-top:14px">' +
      '<div class="card"><h3>Rádio e hora da história</h3><div id="radio-box">' + radioHtml() + '</div></div>' +
      '<div><h3 style="margin-top:6px">Roteiro em cinco cenas</h3>' + cenas + '</div>' +
      '<div class="card"><h3>Se travar</h3><ul class="ul">' + window.TRAVOU.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div>' +
      '<div class="card"><h3>Antes da sessão</h3><ul class="ul" style="list-style:none;padding:0">' + pend + '</ul></div>' +
      '<div class="card"><h3>Pano de fundo de 1978</h3><ul class="ul">' + window.FATOS.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div>' +
      '</div>';
  }

  /* ---------------------------------------------------------------- REGRAS */
  var PENAL = [
    ['1 e 2', 'Vexame', 'O personagem passa vergonha ou se atrapalha de um jeito engraçado na cena.'],
    ['3', 'Atributo cai', 'O atributo do teste cai um passo até o fim da cena.'],
    ['4', 'Perde PV', 'Perde 1d4 PV.'],
    ['5', 'Perde PD', 'Perde 1d4 PD.'],
    ['6', 'Perde item', 'Perde um item (o mestre escolhe qual).'],
    ['7 e 8', 'Nada', 'Escapou. Só o teste falhou.']
  ];

  function viewRegras() {
    var dts = '<div class="tw"><table><thead><tr><th>DT</th><th>Nível</th><th>Pra que serve</th></tr></thead><tbody>' +
      window.DTS.map(function (r) { return '<tr><td class="n">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<p class="small muted" style="margin:8px 0 0">Só 7 (padrão) e 10 (difícil) vêm do guia. Os outros são escala sugerida.</p>';
    var acc = window.REGRAS.map(function (r) {
      return '<div class="acc" data-rule="' + r.id + '"><button class="acc-h" type="button" data-act="acc" aria-expanded="false"><span class="t">' + r.titulo +
        '</span><span class="ar" aria-hidden="true">&rsaquo;</span><span class="s">' + r.resumo + '</span></button><div class="acc-b" hidden><ul class="ul">' +
        r.itens.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul></div></div>';
    }).join('');
    var pen = '<div class="tw"><table><thead><tr><th>d8</th><th>Efeito</th><th>Detalhe</th></tr></thead><tbody>' +
      PENAL.map(function (r) { return '<tr><td class="n">' + r[0] + '</td><td>' + r[1] + '</td><td>' + r[2] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
      '<p class="small muted" style="margin:8px 0 0">O guia lista as seis consequências mas não diz qual número é qual. Essa ordem é sugestão. A aba Dados rola isso pra você.</p>';
    return '<h2>Regras</h2><p class="lead">O playtest de Ordem 2 resumido pra consulta rápida. Toque pra abrir. Procure por palavra.</p>' +
      '<div class="stack"><div class="card"><h3>Tabela de DT</h3>' + dts + '</div>' +
      '<div class="row"><input class="field" style="flex:1 1 220px" id="rq" type="search" placeholder="Buscar: pavor, ajudar, crítico, fechadura" data-in="regra" aria-label="Buscar regra">' +
      '<button class="btn" type="button" data-act="openall">Abrir tudo</button><button class="btn" type="button" data-act="closeall">Fechar tudo</button></div>' +
      '<div id="regras-list">' + acc + '</div>' +
      '<div class="card"><h3>Penalidade de falha crítica (sugestão)</h3>' + pen + '</div></div>';
  }

  /* ---------------------------------------------------------------- DADOS */
  var FACES = [4, 6, 8, 10, 12];
  var T = store.get('teste', { attr: 6, skill: 6, extras: [], pavor: 0, dt: 7 });
  var hist = store.get('hist', []);
  var Q = { n: 1 };
  var F = { n: 2, faces: 6, max: 6, secret: [], tries: 0, log: [], status: '', show: false, sons: false, crime: 6 };
  var lastResult = null;

  function chipRow(act, vals, sel, fmt) {
    return '<div class="chips">' + vals.map(function (v) {
      return '<button class="chip" type="button" data-act="' + act + '" data-v="' + v + '" aria-pressed="' + (sel === v) + '">' + (fmt ? fmt(v) : 'd' + v) + '</button>';
    }).join('') + '</div>';
  }

  function testeHtml() {
    var total = 2 + T.extras.length;
    var extras = '<div class="chips">' + T.extras.map(function (v, i) {
      return '<button class="chip" type="button" data-act="del-extra" data-i="' + i + '" aria-pressed="true" aria-label="Tirar dado extra d' + v + '">+d' + v + ' &times;</button>';
    }).join('') +
      (total < 4 ? FACES.map(function (v) {
        return '<button class="chip" type="button" data-act="add-extra" data-v="' + v + '" aria-pressed="false">+ d' + v + '</button>';
      }).join('') : '<span class="small muted">Limite de 4 dados rolados.</span>') + '</div>';
    var dtChips = '<div class="chips scroll">' + [6, 7, 8, 9, 10, 11, 12, 13].map(function (v) {
      var tag = v === 7 ? ' padrão' : v === 10 ? ' difícil' : '';
      return '<button class="chip" type="button" data-act="set-dt" data-v="' + v + '" aria-pressed="' + (T.dt === v) + '">' + v + tag + '</button>';
    }).join('') + '</div>';
    return '<div class="stack">' +
      '<div><div class="lab">Dado do atributo</div>' + chipRow('set-attr', FACES, T.attr) + '</div>' +
      '<div><div class="lab">Dado da perícia</div>' + chipRow('set-skill', FACES, T.skill) + '</div>' +
      '<div><div class="lab">Dados extras (bônus, relação, ajuda)</div>' + extras + '</div>' +
      '<div><div class="lab">Dado de pavor (só quem está com medo)</div>' +
      chipRow('set-pavor', [0].concat(FACES), T.pavor, function (v) { return v ? 'd' + v : 'Sem'; }) + '</div>' +
      '<div><div class="lab">DT</div>' + dtChips + '</div>' +
      '<button class="btn gold big" type="button" data-act="rolar">Rolar</button></div>';
  }

  function facesDoTeste() { return [T.attr, T.skill].concat(T.extras); }

  var chanceCache = {};
  function distrib(faces, pav) {
    var key = faces.join(',') + '|' + pav;
    if (chanceCache[key]) return chanceCache[key];
    var n = faces.length, hist2 = {}, critS = 0, N = 0, vals = new Array(n);
    function rec(i, p) {
      if (i === n) {
        N++;
        var r = D.avalia(vals, p);
        if (r.crit === 'sucesso') critS++;
        else if (!r.crit) hist2[r.total] = (hist2[r.total] || 0) + 1;
        return;
      }
      for (var v = 1; v <= faces[i]; v++) { vals[i] = v; rec(i + 1, p); }
    }
    if (pav) { for (var p = 1; p <= pav; p++) rec(0, p); } else rec(0, null);
    var out = { N: N, critS: critS, hist: hist2 };
    chanceCache[key] = out;
    return out;
  }
  function chancePass(dist, dt) {
    var ok = dist.critS;
    for (var k in dist.hist) if (Number(k) >= dt) ok += dist.hist[k];
    return ok / dist.N;
  }
  var chanceTimer;
  function chanceRender() {
    var box = $('#chance');
    if (!box) return;
    box.innerHTML = '<p class="small muted">Calculando&hellip;</p>';
    clearTimeout(chanceTimer);
    chanceTimer = setTimeout(function () {
      var box2 = $('#chance');
      if (!box2) return;
      var dist = distrib(facesDoTeste(), T.pavor || 0);
      var cur = Math.round(chancePass(dist, T.dt) * 100);
      box2.innerHTML = '<div class="row sp"><div><div class="lab">Na DT ' + T.dt + '</div><div class="big-n">' + cur + '<small>%</small></div></div>' +
        '<div class="small muted" style="max-width:26ch">Conta os críticos' + (T.pavor ? ' e o pavor' : '') + '. Soma os 3 maiores dados.</div></div>' +
        '<div style="margin-top:8px">' + [6, 7, 8, 9, 10, 11, 12, 13].map(function (dt) {
          var p = Math.round(chancePass(dist, dt) * 100);
          return '<div class="chance-row' + (dt === T.dt ? ' cur' : '') + '"><b>' + dt + '</b><div class="bar"><i style="width:' + p + '%"></i></div><span>' + p + '%</span></div>';
        }).join('') + '</div>';
    }, 20);
  }

  function resultHtml(r, dt) {
    var vivos = r.ativos.map(function (a, i) { return { i: i, v: a.v, an: a.anulado }; })
      .filter(function (x) { return !x.an; }).sort(function (a, b) { return b.v - a.v; });
    var soma = {};
    vivos.slice(0, 3).forEach(function (x) { soma[x.i] = true; });
    var dice = r.ativos.map(function (a, i) {
      return '<span class="die ' + (a.anulado ? 'anul' : soma[i] ? 'soma' : 'fora') + '">' + a.v + '<small>d' + r.faces[i] + '</small></span>';
    }).join('');
    if (r.pavor != null) dice += '<span class="die pav" title="Dado de pavor">' + r.pavor + '<small>pav d' + r.pavorFaces + '</small></span>';
    var cls, tit, sub;
    if (r.crit === 'sucesso') { cls = 'crit-s'; tit = 'Sucesso crítico'; sub = 'Dois dados iguais de 6 pra cima. Passa sozinho, qualquer que seja a DT.'; }
    else if (r.crit === 'falha') { cls = 'crit-f'; tit = 'Falha crítica'; sub = 'Todos os dados em 1. Falha sozinha. Role a penalidade (botão abaixo).'; }
    else if (r.crit === 'falha-pavor') { cls = 'crit-f'; tit = 'Falha crítica pelo pavor'; sub = 'O dado de pavor anulou todos os dados do teste.'; }
    else if (r.total >= dt) { cls = 'pass'; tit = 'Passou: ' + r.total + ' contra DT ' + dt; sub = 'Sobrou ' + (r.total - dt) + '.'; }
    else { cls = 'fail'; tit = 'Falhou: ' + r.total + ' contra DT ' + dt; sub = 'Faltou ' + (dt - r.total) + '. Falhar pra frente: dá um custo, não trava a cena.'; }
    var extra = '';
    if (r.crit !== 'falha-pavor') extra += '<div class="small muted">RA ' + r.ra + ' &middot; RB ' + r.rb + ' (dano de arma = RA + modificador)</div>';
    if (r.ativos.length > 3) extra += '<div class="small muted">Só os 3 maiores somam. Os tracejados ficaram de fora.</div>';
    if (r.pavorAcabou) extra += '<div class="small" style="color:var(--ok)">O dado de pavor saiu 1: o medo acaba.</div>';
    if (r.pavor != null && r.ativos.some(function (a) { return a.anulado; }) && r.crit !== 'falha-pavor') extra += '<div class="small muted">Os riscados foram anulados pelo pavor.</div>';
    return '<div class="dice-row">' + dice + '</div><div class="verdict ' + cls + '">' + tit + '<small>' + sub + '</small></div>' + extra +
      (r.crit === 'falha' || r.crit === 'falha-pavor' ? '<div style="margin-top:10px"><button class="btn red" type="button" data-act="penal">Rolar penalidade (d8)</button></div>' : '');
  }

  function pushHist(txt, cls) {
    hist.unshift({ t: txt, c: cls || '' });
    hist = hist.slice(0, 12);
    store.set('hist', hist);
    var h = $('#hist');
    if (h) h.innerHTML = histHtml();
  }
  function histHtml() {
    if (!hist.length) return '<p class="small muted">As rolagens aparecem aqui.</p>';
    return '<div class="hist">' + hist.map(function (h) { return '<div class="' + h.c + '">' + esc(h.t) + '</div>'; }).join('') + '</div>' +
      '<div style="margin-top:8px"><button class="btn sm" type="button" data-act="hist-clear">Limpar histórico</button></div>';
  }

  function quickHtml() {
    return '<div class="row" style="margin-bottom:10px"><span class="lab">Quantidade</span>' +
      '<button class="btn sm" type="button" data-act="quick-n" data-d="-1" aria-label="Menos um dado">&minus;</button><b style="font:400 24px var(--f-display);min-width:24px;text-align:center">' + Q.n + '</b>' +
      '<button class="btn sm" type="button" data-act="quick-n" data-d="1" aria-label="Mais um dado">+</button></div>' +
      '<div class="chips">' + [4, 6, 8, 10, 12, 20, 100].map(function (f) {
        return '<button class="chip" type="button" data-act="quick" data-f="' + f + '" aria-pressed="false">' + Q.n + 'd' + f + '</button>';
      }).join('') + '</div><div id="quick-out" class="small" style="margin-top:10px" aria-live="polite"></div>';
  }

  function fechHtml() {
    var secret = F.secret.length
      ? '<div class="small" style="margin-top:8px">Senha: ' + (F.show ? '<b>' + F.secret.join(' &middot; ') + '</b>' : '<span class="muted">escondida</span>') + '</div>' : '';
    var guess = F.secret.length && !F.status
      ? '<div class="guess">' + F.secret.map(function (_, i) {
        return '<input class="field" inputmode="numeric" data-g="' + i + '" aria-label="Dado ' + (i + 1) + '" placeholder="' + (i + 1) + 'º">';
      }).join('') + '<button class="btn gold" type="button" data-act="fech-check">Conferir</button></div>' : '';
    var st = F.status === 'abriu' ? '<div class="verdict pass">Abriu<small>Em ' + F.tries + ' tentativa' + (F.tries > 1 ? 's' : '') + '.</small></div>'
      : F.status === 'estragou' ? '<div class="verdict fail">Estragou<small>Passou de ' + F.max + ' tentativas. Só abre na força: gasta 1 PV e Atletismo contra a DT do objeto.</small></div>' : '';
    var crimeN = { 4: 1, 6: 2, 8: 3, 10: 4, 12: 5 }[F.crime];
    return '<div class="stack">' +
      '<div class="row"><span class="lab">Dados</span>' + [1, 2, 3, 4].map(function (v) {
        return '<button class="chip" type="button" data-act="fech-n" data-v="' + v + '" aria-pressed="' + (F.n === v) + '">' + v + '</button>';
      }).join('') + '<span class="lab" style="margin-left:8px">Faces</span>' + [6, 8, 10].map(function (v) {
        return '<button class="chip" type="button" data-act="fech-faces" data-v="' + v + '" aria-pressed="' + (F.faces === v) + '">d' + v + '</button>';
      }).join('') + '</div>' +
      '<div class="row"><span class="lab">Máx. de tentativas</span>' +
      '<button class="btn sm" type="button" data-act="fech-max" data-d="-1" aria-label="Menos tentativas">&minus;</button><b style="font:400 22px var(--f-display);min-width:22px;text-align:center">' + F.max + '</b>' +
      '<button class="btn sm" type="button" data-act="fech-max" data-d="1" aria-label="Mais tentativas">+</button>' +
      '<label class="row small" style="margin-left:8px"><input type="checkbox" data-chg="fech-sons"' + (F.sons ? ' checked' : '') + ' style="width:20px;height:20px;accent-color:var(--gold)"> usar sons (tic, toc, click)</label></div>' +
      '<div><div class="lab">Dado de Crime do jogador: tentativas por rodada</div>' + chipRow('fech-crime', FACES, F.crime) +
      '<div class="small muted" style="margin-top:6px">d' + F.crime + ' dá ' + crimeN + ' tentativa' + (crimeN > 1 ? 's' : '') + ' por rodada.</div></div>' +
      '<div class="row"><button class="btn gold" type="button" data-act="fech-new">Nova fechadura</button>' +
      (F.secret.length ? '<button class="btn" type="button" data-act="fech-show">' + (F.show ? 'Esconder senha' : 'Ver senha') + '</button>' : '') + '</div>' +
      secret + guess + st +
      (F.log.length ? '<div class="lock-log">' + F.log.map(function (l) { return '<div>' + l + '</div>'; }).join('') + '</div>' : '') +
      '<p class="small muted" style="margin:0">' + (F.sons ? 'tic = o seu dado está acima da senha &middot; toc = abaixo &middot; click = exato.' : 'alto = o seu dado está acima da senha &middot; baixo = abaixo &middot; exato = acertou. (Leitura sugerida: o guia não diz qual lado é "alto".)') + '</p></div>';
  }

  function viewDados() {
    return '<h2>Dados</h2><p class="lead">Teste de verdade do playtest: atributo + perícia + extras, contra a DT. Mostra a chance antes de rolar.</p>' +
      '<div class="grid2"><div class="stack">' +
      '<div class="card"><h3>Teste</h3><div id="teste">' + testeHtml() + '</div></div>' +
      '<div class="card" id="res-card" ' + (lastResult ? '' : 'hidden') + '><h3>Resultado</h3><div id="res">' + (lastResult ? resultHtml(lastResult.r, lastResult.dt) : '') + '</div></div>' +
      '<div class="card"><h3>Chance de passar</h3><div id="chance"></div></div></div>' +
      '<div class="stack">' +
      '<div class="card"><h3>Dados soltos</h3><div id="quick">' + quickHtml() + '</div></div>' +
      '<div class="card"><h3>Fechadura</h3><div id="fech">' + fechHtml() + '</div></div>' +
      '<div class="card"><h3>Últimas rolagens</h3><div id="hist">' + histHtml() + '</div></div></div></div>';
  }

  function doRoll() {
    var r = D.rola(facesDoTeste(), T.pavor || null);
    lastResult = { r: r, dt: T.dt };
    $('#res-card').hidden = false;
    $('#res').innerHTML = resultHtml(r, T.dt);
    var ok = D.passou(r, T.dt);
    var nomes = r.faces.map(function (f, i) { return 'd' + f + '=' + r.valores[i]; }).join(' ');
    var fim = r.crit === 'sucesso' ? 'crítico de sucesso' : r.crit === 'falha' ? 'crítico de falha' : r.crit === 'falha-pavor' ? 'falha pelo pavor' : r.total + ' contra DT ' + T.dt;
    pushHist(nomes + (r.pavor != null ? ' pavor=' + r.pavor : '') + ' → ' + fim + (ok ? ': passou' : ': falhou'), ok ? 'p' : 'f');
    var rc = $('#res-card'); if (rc && rc.scrollIntoView) { try { rc.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch (e) { /* ok */ } }
  }

  /* ---------------------------------------------------------------- NPCS */
  var NF = { g: 'todos', s: 'todos', q: '' };

  function npcCard(n) {
    var g = GRUPOS[n.grupo] || ['', '#555'];
    var st = STATUS[n.st] || ['', 'neutro'];
    var ini = n.nome.split(' ').filter(function (w) { return w.length > 2; }).slice(0, 2).map(function (w) { return w[0]; }).join('');
    return '<button class="npc" type="button" data-act="npc-open" data-slug="' + n.slug + '" style="--gc:' + g[1] + '">' +
      '<span class="ph">' + (n.img ? '<img src="img/npc/' + n.slug + '-t.webp" loading="lazy" decoding="async" alt="">' : '<span class="ini">' + esc(ini) + '</span>') + '</span>' +
      '<span class="nm">' + esc(n.nome) + '</span><span class="pp">' + esc(n.papel) + '</span>' +
      '<span class="ft"><span class="gtag">' + g[0] + '</span><span class="pill ' + st[1] + '">' + st[0] + '</span></span></button>';
  }
  function npcList() {
    var q = norm(NF.q);
    return NPCS.filter(function (n) {
      if (NF.g !== 'todos' && n.grupo !== NF.g) return false;
      if (NF.s !== 'todos' && n.st !== NF.s) return false;
      if (q && norm(n.nome + ' ' + n.papel).indexOf(q) < 0) return false;
      return true;
    });
  }
  function npcFiltersHtml() {
    var gs = [['todos', 'Todos']].concat(Object.keys(GRUPOS).map(function (k) { return [k, GRUPOS[k][0]]; }));
    var ss = [['todos', 'Qualquer estado']].concat(Object.keys(STATUS).map(function (k) { return [k, STATUS[k][0]]; }));
    return '<div class="chips scroll">' + gs.map(function (g) {
      return '<button class="chip" type="button" data-act="gfilter" data-v="' + g[0] + '" aria-pressed="' + (NF.g === g[0]) + '">' + g[1] + '</button>';
    }).join('') + '</div><div class="chips scroll">' + ss.map(function (s) {
      return '<button class="chip" type="button" data-act="sfilter" data-v="' + s[0] + '" aria-pressed="' + (NF.s === s[0]) + '">' + s[1] + '</button>';
    }).join('') + '</div>';
  }
  function npcGridHtml() {
    var l = npcList();
    return l.length ? l.map(npcCard).join('') : '<p class="muted">Nenhum NPC com esse filtro.</p>';
  }
  function viewNpcs() {
    return '<h2>NPCs</h2><p class="lead">' + NPCS.length + ' pessoas da cidade. Toque no cartão pra abrir a ficha, ver o rosto e controlar o PV.</p>' +
      '<div class="toolbar"><input class="field" id="nq" type="search" placeholder="Buscar por nome ou papel" data-in="npcq" aria-label="Buscar NPC" value="' + esc(NF.q) + '">' +
      '<div id="nfilters" class="stack" style="gap:8px">' + npcFiltersHtml() + '</div>' +
      '<div class="row"><button class="btn" type="button" data-act="quem">Quem é quem: todos os rostos numa folha</button></div></div>' +
      '<div class="npc-grid" id="ngrid">' + npcGridHtml() + '</div>';
  }

  function pvInfo(n) {
    var max = parseInt(n.stats && n.stats[0], 10);
    return isNaN(max) ? null : max;
  }
  function pvHtml(n) {
    var max = pvInfo(n);
    if (max === null) return '';
    var cur = store.get('pv:' + n.slug, max);
    return '<div class="card"><h3>PV</h3><div class="pv"><button class="btn" type="button" data-act="pv" data-slug="' + n.slug + '" data-d="-1" aria-label="Tirar 1 PV">&minus;</button>' +
      '<div class="v' + (cur <= 0 ? ' low' : '') + '" id="pv-v">' + cur + '<small style="font-size:20px;color:var(--mut)"> / ' + max + '</small></div>' +
      '<button class="btn" type="button" data-act="pv" data-slug="' + n.slug + '" data-d="1" aria-label="Pôr 1 PV">+</button>' +
      '<button class="btn sm" type="button" data-act="pv-reset" data-slug="' + n.slug + '">Cheio</button></div>' +
      '<p class="small muted" id="pv-msg" style="margin:8px 0 0">' + (cur <= 0 ? 'Zerou: fora de combate. Se for um NPC importante, teste de lesão (Físico + Vigor, DT 7).' : 'A vida fica salva só neste aparelho.') + '</p></div>';
  }

  function openNpc(slug) {
    var i = NPCS.findIndex(function (n) { return n.slug === slug; });
    if (i < 0) return;
    var n = NPCS[i], len = NPCS.length;
    var prev = NPCS[(i - 1 + len) % len], next = NPCS[(i + 1) % len];
    var g = GRUPOS[n.grupo] || ['', '#555'], st = STATUS[n.st] || ['', 'neutro'];
    var rot = ['PV', 'Físico', 'Mente', 'Emoção'];
    var stats = n.stats && n.stats.length
      ? '<div class="stats">' + n.stats.map(function (v, k) { return '<div class="stat"><b>' + esc(v) + '</b><span>' + rot[k] + '</span></div>'; }).join('') + '</div>' : '';
    var blocos = (n.blocos || []).map(function (b) {
      return '<div class="blk"><div class="lab">' + esc(b[0]) + '</div><p>' + esc(b[1]) + '</p></div>';
    }).join('');
    var html = '<div class="modal" id="m-npc" role="dialog" aria-modal="true" aria-label="' + esc(n.nome) + '"><div class="modal-in">' +
      '<div class="modal-bar"><button class="btn sm" type="button" data-act="npc-go" data-slug="' + prev.slug + '" aria-label="NPC anterior: ' + esc(prev.nome) + '">&lsaquo;</button>' +
      '<div class="tt">' + esc(n.nome) + '</div>' +
      '<button class="btn sm" type="button" data-act="npc-go" data-slug="' + next.slug + '" aria-label="Próximo NPC: ' + esc(next.nome) + '">&rsaquo;</button>' +
      '<button class="btn sm gold" type="button" data-act="npc-close">Fechar</button></div>' +
      '<div class="modal-body">' +
      (n.img ? '<img class="cardimg" src="img/npc/' + n.slug + '.webp" alt="Cartão de ' + esc(n.nome) + '" data-act="zoom" data-src="img/npc/' + n.slug + '.webp" data-title="' + esc(n.nome) + '">'
        : '<div class="card muted">Esse NPC ainda não tem imagem. A ficha em texto está logo abaixo.</div>') +
      '<div class="row"><span class="gtag" style="--gc:' + g[1] + '">' + g[0] + '</span><span class="pill ' + st[1] + '">' + st[0] + '</span><span class="muted small">' + esc(n.papel) + '</span></div>' +
      stats + (n.per ? '<div class="small muted">' + esc(n.per) + '</div>' : '') + pvHtml(n) + blocos +
      (n.nota ? '<div class="blk"><div class="lab">Nota</div><p>' + esc(n.nota) + '</p></div>' : '') +
      (n.onde ? '<div class="blk"><div class="lab">Onde achar</div><p>' + esc(n.onde) + '</p></div>' : '') +
      '<div><div class="lab" style="margin-bottom:6px">Suas anotações sobre ' + esc(n.nome.split(' ')[0]) + '</div>' +
      '<textarea class="field" data-in="npcnote" data-slug="' + n.slug + '" placeholder="O que os jogadores já descobriram, o que ele prometeu&hellip;" aria-label="Anotações">' + esc(store.get('npcnote:' + n.slug, '')) + '</textarea></div>' +
      (n.img ? '<div class="row"><button class="btn" type="button" data-act="copy-own" data-rel="img/npc/' + n.slug + '.webp">Copiar link da imagem</button><span class="pill so">só mestre</span></div>' : '') +
      '</div></div></div>';
    setLayer('m-npc', html);
  }

  /* ---------------------------------------------------------------- ENIGMAS */
  function listHtml(arr) { return '<ul class="ul">' + arr.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>'; }
  function pecaThumb(slug) {
    var p = window.PECAS.filter(function (x) { return x[0] === slug; })[0];
    if (!p) return '';
    return '<div class="th"><img src="img/pecas/' + slug + '-t.webp" loading="lazy" alt="' + esc(p[1]) + '" data-act="zoom" data-src="img/pecas/' + slug + '.webp" data-title="' + esc(p[1]) + '">' +
      '<div class="nm">' + esc(p[1]) + '</div></div>';
  }
  function enigmaBody(e) {
    var s = '<div class="stack">' +
      '<button class="spoil" type="button" data-act="reveal" data-id="' + e.id + '" id="sp-' + e.id + '">Toque pra ver a resposta</button>' +
      '<div class="ans" id="ans-' + e.id + '" hidden>' + e.resposta + '</div>' +
      '<p style="margin:0">' + e.resumo + '</p>';
    if (e.pistas && e.pistas.length) {
      s += '<div><div class="lab">Pistas por perícia</div><div class="tw"><table><thead><tr><th>Perícia</th><th>DT</th><th>O que revela</th></tr></thead><tbody>' +
        e.pistas.map(function (p) { return '<tr><td>' + p[0] + '</td><td class="n">' + p[1] + '</td><td>' + p[2] + '</td></tr>'; }).join('') + '</tbody></table></div>' +
        '<div class="free"><b>Regra de graça</b>Se o jogador diz o dado da perícia (d6 vale 6, d8 vale 8), ele recebe sem rolar todas as pistas com DT até esse número.</div></div>';
    }
    if (e.datas) {
      s += '<div><div class="lab">Datas de estreia (e a posição na parede)</div><div class="tw"><table><thead><tr><th>Filme</th><th>Estreia</th><th>Posição</th></tr></thead><tbody>' +
        e.datas.map(function (d) { return '<tr><td>' + d[0] + '</td><td>' + d[1] + '</td><td class="n">' + d[2] + '</td></tr>'; }).join('') + '</tbody></table></div></div>';
    }
    if (e.socorro && e.socorro.length) s += '<div><div class="lab">Socorro (se travar, pode custar 1 PD)</div>' + listHtml(e.socorro) + '</div>';
    if (e.mesa && e.mesa.length) s += '<div><div class="lab">Na mesa (coisa de verdade)</div>' + listHtml(e.mesa) + '</div>';
    if (e.notas && e.notas.length) s += '<div><div class="lab">Notas</div>' + listHtml(e.notas) + '</div>';
    if (e.pecas && e.pecas.length) s += '<div><div class="lab">Peças deste enigma</div><div class="thumbs">' + e.pecas.map(pecaThumb).join('') + '</div></div>';
    return s + '</div>';
  }
  function viewEnigmas() {
    var acc = window.ENIGMAS.map(function (e) {
      return accHtml(e.id, e.num + '. ' + e.titulo, e.quando, enigmaBody(e));
    }).join('');
    var term = window.TERMINAL.map(function (t, i) {
      return '<div class="lk"><div class="row sp"><b>' + t[0] + '</b><span class="pill">' + t[1] + '</span></div><div class="msg">' + esc(t[2]) + '</div>' +
        '<div><button class="btn sm" type="button" data-act="copy-term" data-i="' + i + '">Copiar texto</button></div></div>';
    }).join('');
    return '<h2>Enigmas</h2><p class="lead">Na primeira sessão só entra o dos cartazes (CORTE). Cabine e lata ficam pra segunda. As respostas ficam escondidas até você tocar.</p>' +
      '<div class="stack"><div>' + acc + '</div>' +
      '<div class="card"><h3>Arquivos do terminal</h3><p class="small muted" style="margin-top:0">Texto sugerido pra criar em terminal.html?mestre. A senha do terminal é a que você definiu lá.</p><div class="stack" style="gap:10px">' + term + '</div></div></div>';
  }

  /* ---------------------------------------------------------------- JOGADORES */
  function jogCard(j) {
    return '<div class="card"><h2 style="font-size:30px">' + j.nome + '</h2>' +
      '<div class="small muted">' + j.idade + ' anos &middot; ' + j.perfil + ' &middot; ' + j.atrib + '</div>' +
      '<p>' + j.resumo + '</p>' +
      '<div class="lab">O que ele sabe</div><p>' + j.sabe + '</p>' +
      '<div class="lab">Motivo de estar na cidade</div><p>' + j.motivo + '</p>' +
      '<div class="lab">Habilidades (gastam PD)</div><ul class="ul">' + j.habilidades.map(function (h) { return '<li><b>' + h[0] + '.</b> ' + h[1] + '</li>'; }).join('') + '</ul>' +
      '<div class="lab" style="margin-top:12px">Heranças (liberam com provas da família)</div><ul class="ul">' + j.heranca.map(function (h) { return '<li><b>' + h[0] + '.</b> ' + h[1] + '</li>'; }).join('') + '</ul></div>';
  }
  function famCard(f) {
    return '<div class="card"><h3>Família ' + f.titulo + '</h3>' +
      '<div class="lab">O que o jogador sabe</div><p>' + f.sabe + '</p>' +
      '<button class="spoil" type="button" data-act="reveal" data-id="f-' + f.id + '" id="sp-f-' + f.id + '">Toque pra ver a verdade (só mestre)</button>' +
      '<div class="ans" id="ans-f-' + f.id + '" hidden>' + f.verdade + '</div>' +
      '<div class="lab" style="margin-top:14px">Três camadas de descoberta</div><ul class="ul">' + f.camadas.map(function (c) { return '<li><b>' + c[0] + '.</b> ' + c[1] + '</li>'; }).join('') + '</ul>' +
      '<div class="lab" style="margin-top:12px">Na sessão</div><p>' + f.sessao + '</p></div>';
  }
  function viewJogadores() {
    return '<h2>Jogadores</h2><p class="lead">Abel e Thomas lado a lado, mais a verdade por trás de cada família. A verdade fica escondida até você tocar.</p>' +
      '<div class="grid2">' + window.JOGADORES.map(jogCard).join('') + '</div>' +
      '<div class="grid2" style="margin-top:14px">' + window.FAMILIAS.map(famCard).join('') + '</div>' +
      '<p class="small muted">Os links das fichas de cada um estão na aba Links.</p>';
  }

  /* ---------------------------------------------------------------- MAPAS */
  function lugaresHtml(q) {
    q = norm(q || '');
    var l = window.LUGARES.filter(function (x) { return !q || norm(x[1] + ' ' + x[2]).indexOf(q) >= 0; });
    return l.length ? l.map(function (x) {
      return '<div class="pl"><b>' + x[0] + '</b><div>' + esc(x[1]) + (x[2] ? '<span class="w">' + esc(x[2]) + '</span>' : '') + '</div></div>';
    }).join('') : '<p class="muted">Nada com esse nome.</p>';
  }
  function viewMapas() {
    var maps = window.MAPAS.map(function (m) {
      return '<div class="card"><div class="row sp"><h3 style="margin:0">' + m[1] + '</h3><span class="pill ' + (m[2] === 'jogador' ? 'pode' : 'so') + '">' + (m[2] === 'jogador' ? 'pode mandar' : 'só mestre') + '</span></div>' +
        '<img src="img/mapas/' + m[0] + '-t.webp" loading="lazy" alt="Mapa: ' + esc(m[1]) + '" style="margin-top:10px;border-radius:4px;border:1px solid var(--line);cursor:zoom-in;width:100%" data-act="zoom" data-src="img/mapas/' + m[0] + '.webp" data-title="Mapa: ' + esc(m[1]) + '">' +
        '<p class="small muted" style="margin:10px 0">' + m[3] + '</p>' +
        '<div class="row"><button class="btn sm" type="button" data-act="zoom" data-src="img/mapas/' + m[0] + '.webp" data-title="Mapa: ' + esc(m[1]) + '">Ver grande</button>' +
        (m[2] === 'jogador'
          ? '<button class="btn sm" type="button" data-act="copy-url" data-rel="mapa-' + m[0] + '.webp">Copiar link</button></div></div>'
          : '<button class="btn sm" type="button" data-act="copy-own" data-rel="img/mapas/' + m[0] + '.webp">Copiar link (só mestre)</button></div></div>');
    }).join('');
    return '<h2>Mapas</h2><p class="lead">Três pranchas de Coxilha Seca. Toca na imagem pra ver grande e dar zoom.</p>' +
      '<div class="grid2">' + maps + '</div>' +
      '<div class="grid2" style="margin-top:14px"><div class="card"><h3>Lugares (' + window.LUGARES.length + ')</h3>' +
      '<input class="field" id="lq" type="search" placeholder="Buscar lugar ou pessoa" data-in="lugar" aria-label="Buscar lugar"><div id="lugares" style="margin-top:8px">' + lugaresHtml('') + '</div></div>' +
      '<div class="stack"><div class="card"><h3>Bloqueios e pontos militares</h3><div class="stack" style="gap:6px">' + window.BLOQUEIOS.map(function (b) {
        return '<div class="pl"><b>' + b[0] + '</b><div>' + b[1] + '</div></div>';
      }).join('') + '</div></div>' +
      '<div class="card"><h3>Dicas pra mesa</h3>' + listHtml(window.DICAS_MAPA) + '</div></div></div>';
  }

  /* ---------------------------------------------------------------- LINKS */
  function linkRow(label, url, tag, extra) {
    return '<div class="lk"><div class="row sp"><b>' + label + '</b>' + (tag ? '<span class="pill ' + tag[0] + '">' + tag[1] + '</span>' : '') + '</div>' +
      '<code>' + esc(url) + '</code><div class="row"><button class="btn sm gold" type="button" data-act="copy-text" data-txt="' + esc(url) + '">Copiar</button>' +
      '<a class="btn sm" href="' + esc(url) + '" target="_blank" rel="noopener">Abrir</a>' + (extra || '') + '</div></div>';
  }
  function fichaUrl(who) {
    var c = extractCode(store.get('code:' + who, ''));
    return liveBase() + 'ficha.html' + (c ? '?j=' + c : '');
  }
  function msgText(kind) {
    var quando = String(store.get('quando', '')).trim();
    var q = quando ? ' (' + quando + ')' : '';
    var ficha = function (who) { return fichaUrl(who); };
    if (kind === 'abel') return 'Abel, essa é a sua ficha da Sessão das Oito:\n' + ficha('abel') + '\n\nO link é só seu. Salva ele no celular, que a ficha fica lá e eu vejo o que você muda.';
    if (kind === 'thomas') return 'Thomas, essa é a sua ficha da Sessão das Oito:\n' + ficha('thomas') + '\n\nO link é só seu. Salva ele no celular, que a ficha fica lá e eu vejo o que você muda.';
    if (kind === 'sessao') return 'Sessão das Oito' + q + '.\nQuadro de investigação: ' + liveBase() + 'index.html\nTerminal: ' + liveBase() + 'terminal.html\nFicha: o link que mandei pra cada um. Chega com a ficha aberta e o celular carregado.';
    return 'Na hora da sessão, deixa o som ligado e presta atenção no fundo do que tocar. Às vezes tem mais coisa escondida do que parece.';
  }
  function msgCard(titulo, kind) {
    return '<div class="lk"><b>' + titulo + '</b><div class="msg" id="msg-' + kind + '">' + esc(msgText(kind)) + '</div>' +
      '<div><button class="btn sm gold" type="button" data-act="copy-msg" data-k="' + kind + '">Copiar mensagem</button></div></div>';
  }
  function viewLinks() {
    var L = liveBase();
    var vivos = linkRow('Quadro de investigação', L + 'index.html', ['pode', 'pode mandar']) +
      linkRow('Terminal', L + 'terminal.html', ['pode', 'pode mandar']) +
      linkRow('Ficha do Abel', fichaUrl('abel'), ['pode', 'só pro Abel']) +
      linkRow('Ficha do Thomas', fichaUrl('thomas'), ['pode', 'só pro Thomas']) +
      linkRow('Fichas (visão do mestre)', L + 'ficha.html?mestre', ['so', 'só mestre']) +
      linkRow('Terminal (visão do mestre)', L + 'terminal.html?mestre', ['so', 'só mestre']);
    var pecas = window.PECAS.filter(function (p) { return p[2] === 'jogador'; });
    var mapas = window.MAPAS.filter(function (m) { return m[2] === 'jogador'; });
    var thumbs = pecas.map(function (p) {
      return '<div class="th"><img src="img/pecas/' + p[0] + '-t.webp" loading="lazy" alt="' + esc(p[1]) + '" data-act="zoom" data-src="img/pecas/' + p[0] + '.webp" data-title="' + esc(p[1]) + '">' +
        '<div class="nm">' + esc(p[1]) + '<br><span class="muted">' + esc(p[3]) + '</span></div>' +
        '<button class="btn sm gold" type="button" data-act="copy-url" data-rel="' + p[0] + '.webp">Copiar link</button></div>';
    }).join('') + mapas.map(function (m) {
      return '<div class="th"><img src="img/mapas/' + m[0] + '-t.webp" loading="lazy" alt="' + esc(m[1]) + '" data-act="zoom" data-src="img/mapas/' + m[0] + '.webp" data-title="Mapa: ' + esc(m[1]) + '">' +
        '<div class="nm">Mapa: ' + esc(m[1]) + '</div><button class="btn sm gold" type="button" data-act="copy-url" data-rel="mapa-' + m[0] + '.webp">Copiar link</button></div>';
    }).join('');
    return '<h2>Links</h2><p class="lead">Tudo que você copia e manda pros jogadores, sem procurar. O que é segredo fica marcado.</p>' +
      '<div class="stack">' +
      '<div class="card"><h3>Endereços base</h3><div class="stack" style="gap:10px">' +
      '<div><label class="lab" for="cfg-live">Site da sessão (quadro, ficha, terminal e imagens dos jogadores)</label><input class="field" id="cfg-live" data-in="cfg-live" value="' + esc(L) + '" autocapitalize="off" autocomplete="off" spellcheck="false"></div>' +
      '<p class="small muted" style="margin:0">As imagens que vão pros jogadores ficam na pasta pecas/ desse site. Assim nenhum link que vai pra mesa mostra o endereço do Escudo.</p></div></div>' +
      '<div class="card"><h3>Códigos das fichas</h3><p class="small muted" style="margin-top:0">Cola aqui o link inteiro de cada jogador (ou só o código depois de j=). Fica salvo neste aparelho e entra nos links abaixo. Eu não consigo ler esses códigos.</p>' +
      '<div class="grid2"><div><label class="lab" for="code-abel">Abel</label><input class="field" id="code-abel" data-in="code" data-who="abel" value="' + esc(store.get('code:abel', '')) + '" placeholder="cole o link ou código" autocapitalize="off" autocomplete="off" spellcheck="false"></div>' +
      '<div><label class="lab" for="code-thomas">Thomas</label><input class="field" id="code-thomas" data-in="code" data-who="thomas" value="' + esc(store.get('code:thomas', '')) + '" placeholder="cole o link ou código" autocapitalize="off" autocomplete="off" spellcheck="false"></div></div></div>' +
      '<div class="card"><h3>Site ao vivo</h3><div class="stack" id="vivos" style="gap:10px">' + vivos + '</div></div>' +
      '<div class="card"><h3>Mensagens prontas</h3><div class="stack" style="gap:10px">' +
      '<div><label class="lab" for="quando">Dia e hora da sessão (entra na mensagem)</label><input class="field" id="quando" data-in="quando" value="' + esc(store.get('quando', '')) + '" placeholder="ex.: sábado, 20h"></div>' +
      '<div id="msgs" class="stack" style="gap:10px">' + msgCard('Ficha do Abel', 'abel') + msgCard('Ficha do Thomas', 'thomas') + msgCard('Convite com todos os links', 'sessao') + msgCard('Aviso do rádio', 'radio') + '</div></div></div>' +
      '<div class="card"><h3>Imagens que podem ir pros jogadores</h3><p class="small muted" style="margin-top:0">Cada botão copia o link da imagem no tamanho de tela (WebP). Os cartões dos NPCs e o mapa do mestre não estão aqui porque têm segredo.</p>' +
      '<div class="thumbs">' + thumbs + '</div>' +
      '<div style="margin-top:12px"><button class="btn" type="button" data-act="copy-all">Copiar a lista de todos os links acima</button></div></div>' +
      '<div class="card"><h3>Senhas</h3><p class="small" style="margin:0">Eu não vejo nenhuma. Existem três: a do quadro (mestre), a das fichas e do terminal (mestre) e a do terminal dos jogadores. Como redefinir cada uma está na Cola dos enigmas (documento em Docs, no Claude).</p></div>' +
      '<div class="card"><h3>Aviso do repositório</h3><p class="small" style="margin:0">O repositório é público. Quem achar o endereço enxerga tudo, inclusive os cartões dos NPCs e as respostas dos enigmas. Não mande o endereço deste site pros jogadores. Os links das imagens acima já saem do site dos jogadores, então podem ir sem medo.</p></div>' +
      '</div>';
  }

  /* ---------------------------------------------------------------- NOTAS */
  function viewNotas() {
    var n = store.get('notas', '');
    return '<h2>Notas</h2><p class="lead">Escreve à vontade. Salva sozinho neste aparelho. Antes de trocar de aparelho, copia o backup.</p>' +
      '<div class="stack"><div class="card"><textarea class="field" id="notas" style="min-height:300px" data-in="notas" placeholder="O que os jogadores fizeram, o que prometeram, ideias pra segunda sessão&hellip;" aria-label="Notas da sessão">' + esc(n) + '</textarea>' +
      '<div class="row sp" style="margin-top:8px"><span class="small muted" id="notas-n">' + n.length + ' caracteres</span>' +
      '<span class="row"><button class="btn sm" type="button" data-act="notas-copy">Copiar notas</button><button class="btn sm red" type="button" data-act="notas-clear" id="nclear">Apagar</button></span></div></div>' +
      '<div class="card"><h3>Backup</h3><p class="small muted" style="margin-top:0">Guarda as notas, as anotações dos NPCs, o PV, as cenas marcadas e os códigos das fichas.</p>' +
      '<div class="row"><button class="btn" type="button" data-act="backup-copy">Copiar backup</button></div>' +
      '<label class="lab" for="restore" style="display:block;margin-top:12px">Restaurar backup (cola aqui)</label>' +
      '<textarea class="field" id="restore" style="min-height:90px" placeholder="{...}" spellcheck="false"></textarea>' +
      '<div style="margin-top:8px"><button class="btn" type="button" data-act="backup-restore">Restaurar</button></div></div></div>';
  }

  var VIEWS = {
    mesa: viewMesa, regras: viewRegras, dados: viewDados, npcs: viewNpcs, enigmas: viewEnigmas,
    jogadores: viewJogadores, mapas: viewMapas, links: viewLinks, notas: viewNotas
  };
  var AFTER = { dados: chanceRender };

  /* ---------------------------------------------------------------- ações */
  var ACT = {
    acc: function (b) {
      var acc = b.closest('.acc'), body = $('.acc-b', acc);
      var open = body.hidden;
      body.hidden = !open;
      acc.classList.toggle('open', open);
      b.setAttribute('aria-expanded', open ? 'true' : 'false');
    },
    openall: function () { $$('#regras-list .acc').forEach(function (a) { if (!a.hidden) { $('.acc-b', a).hidden = false; a.classList.add('open'); } }); },
    closeall: function () { $$('#regras-list .acc').forEach(function (a) { $('.acc-b', a).hidden = true; a.classList.remove('open'); }); },
    reveal: function (b) {
      var a = document.getElementById('ans-' + b.dataset.id);
      if (!a) return;
      a.hidden = !a.hidden;
      b.textContent = a.hidden ? (b.id.indexOf('sp-f-') === 0 ? 'Toque pra ver a verdade (só mestre)' : 'Toque pra ver a resposta') : 'Esconder';
    },
    travou: function () {
      var c = cenaAtual();
      var cena = c
        ? '<div class="free"><b>Cena agora: ' + c.titulo + '</b>' + c.graca + '</div>'
        : '<p class="muted">Todas as cenas estão marcadas como feitas.</p>';
      var falantes = ['zeca', 'seu-nonato', 'dona-nair'].map(function (s) {
        var n = NPCS.filter(function (x) { return x.slug === s; })[0];
        return n ? '<a class="btn sm" href="#npc-' + s + '" data-act="sheet-x">' + esc(n.nome) + '</a>' : '';
      }).join('');
      sheet('<h3>Travou? Calma.</h3>' + cena + window.TRAVOU.slice(0, 4).map(function (t) { return '<p style="margin:8px 0">' + t + '</p>'; }).join('') +
        '<div class="lab" style="margin:12px 0 6px">NPCs que sempre têm uma pista</div><div class="row">' + falantes + '</div>');
    },
    'sheet-x': function () { closeLayer('m-sheet'); },
    'sheet-bg': function (b, e) { if (e.target === b) closeLayer('m-sheet'); },
    'clock-toggle': function () {
      if (clock.run) { clock.acc += Date.now() - clock.t0; clock.run = false; }
      else { clock.t0 = Date.now(); clock.run = true; }
      store.set('clock', clock);
      var bt = $('#clk-b'); if (bt) bt.textContent = clock.run ? 'Pausar' : 'Iniciar';
    },
    'clock-reset': function () {
      clock = { run: false, acc: 0, t0: 0 }; store.set('clock', clock);
      var c = $('#clk'); if (c) c.textContent = fmtClock(0);
      var bt = $('#clk-b'); if (bt) bt.textContent = 'Iniciar';
    },
    hora: function (b) {
      var h = Math.max(11, Math.min(24, store.get('hora', 18) + Number(b.dataset.d)));
      store.set('hora', h);
      $('#radio-box').innerHTML = radioHtml();
    },

    'set-attr': function (b) { T.attr = Number(b.dataset.v); testeChanged(); },
    'set-skill': function (b) { T.skill = Number(b.dataset.v); testeChanged(); },
    'add-extra': function (b) { if (T.extras.length < 2) T.extras.push(Number(b.dataset.v)); testeChanged(); },
    'del-extra': function (b) { T.extras.splice(Number(b.dataset.i), 1); testeChanged(); },
    'set-pavor': function (b) { T.pavor = Number(b.dataset.v); testeChanged(); },
    'set-dt': function (b) { T.dt = Number(b.dataset.v); testeChanged(); },
    rolar: doRoll,
    penal: function () {
      var d = D.aleatorio(8);
      var linha = PENAL.filter(function (p) { return p[0].split(' e ').indexOf(String(d)) >= 0; })[0];
      var det = linha[1];
      if (d === 4) det = 'Perde ' + D.aleatorio(4) + ' PV';
      if (d === 5) det = 'Perde ' + D.aleatorio(4) + ' PD';
      var txt = 'Penalidade d8 = ' + d + ': ' + det + '. ' + linha[2];
      $('#res').insertAdjacentHTML('beforeend', '<div class="verdict fail" style="margin-top:10px">' + esc(det) + '<small>d8 = ' + d + '. ' + esc(linha[2]) + ' (ordem sugerida)</small></div>');
      pushHist(txt, 'f');
    },
    'quick-n': function (b) { Q.n = Math.max(1, Math.min(8, Q.n + Number(b.dataset.d))); $('#quick').innerHTML = quickHtml(); },
    quick: function (b) {
      var f = Number(b.dataset.f), vs = [], s = 0;
      for (var i = 0; i < Q.n; i++) { var v = D.aleatorio(f); vs.push(v); s += v; }
      var out = Q.n + 'd' + f + ': ' + vs.join(' + ') + (Q.n > 1 ? ' = ' + s : '');
      $('#quick-out').innerHTML = '<b style="font:400 28px var(--f-display)">' + (Q.n > 1 ? s : vs[0]) + '</b> <span class="muted">' + esc(out) + '</span>';
      pushHist(out, '');
    },
    'hist-clear': function () { hist = []; store.set('hist', hist); $('#hist').innerHTML = histHtml(); },

    'fech-n': function (b) { F.n = Number(b.dataset.v); fechReset(); },
    'fech-faces': function (b) { F.faces = Number(b.dataset.v); fechReset(); },
    'fech-max': function (b) { F.max = Math.max(1, Math.min(12, F.max + Number(b.dataset.d))); fechRedraw(); },
    'fech-crime': function (b) { F.crime = Number(b.dataset.v); fechRedraw(); },
    'fech-new': function () {
      F.secret = []; for (var i = 0; i < F.n; i++) F.secret.push(D.aleatorio(F.faces));
      F.tries = 0; F.log = []; F.status = ''; F.show = false; fechRedraw();
    },
    'fech-show': function () { F.show = !F.show; fechRedraw(); },
    'fech-check': function () {
      var inputs = $$('#fech [data-g]');
      var g = inputs.map(function (i) { return parseInt(i.value, 10); });
      if (g.some(function (v) { return isNaN(v) || v < 1 || v > F.faces; })) { toast('Põe um número de 1 a ' + F.faces + ' em cada dado.'); return; }
      F.tries++;
      var names = F.sons ? ['tic', 'toc', 'click'] : ['alto', 'baixo', 'exato'];
      var res = g.map(function (v, i) { return v === F.secret[i] ? names[2] : v > F.secret[i] ? names[0] : names[1]; });
      var exact = res.every(function (r) { return r === names[2]; });
      F.log.unshift('#' + F.tries + ' &nbsp; ' + g.join(' &middot; ') + ' &rarr; ' + res.join(' &middot; '));
      if (exact) F.status = 'abriu'; else if (F.tries >= F.max) F.status = 'estragou';
      fechRedraw();
    },

    gfilter: function (b) { NF.g = b.dataset.v; npcRefresh(); },
    sfilter: function (b) { NF.s = b.dataset.v; npcRefresh(); },
    'npc-open': function (b) { location.hash = 'npc-' + b.dataset.slug; },
    'npc-go': function (b) { location.hash = 'npc-' + b.dataset.slug; },
    'npc-close': function () { location.hash = 'npcs'; },
    quem: function () { openImg('img/quem-e-quem.webp', 'Quem é quem'); },
    pv: function (b) {
      var n = NPCS.filter(function (x) { return x.slug === b.dataset.slug; })[0], max = pvInfo(n);
      var cur = Math.max(0, Math.min(max, store.get('pv:' + n.slug, max) + Number(b.dataset.d)));
      store.set('pv:' + n.slug, cur); pvRedraw(n);
    },
    'pv-reset': function (b) {
      var n = NPCS.filter(function (x) { return x.slug === b.dataset.slug; })[0];
      store.del('pv:' + n.slug); pvRedraw(n);
    },

    zoom: function (b) { openImg(b.dataset.src, b.dataset.title); },
    zoomtoggle: function (b) { var l = $('#m-img'); l.classList.toggle('zoom'); b.textContent = l.classList.contains('zoom') ? 'Ajustar' : 'Ampliar'; },
    'img-x': function () { closeLayer('m-img'); },

    'copy-text': function (b) { copy(b.dataset.txt); },
    'copy-url': function (b) { copy(imgUrl(b.dataset.rel), 'Link copiado'); },
    'copy-own': function (b) { copy(ownUrl(b.dataset.rel), 'Link copiado (só mestre)'); },
    'copy-term': function (b) { copy(window.TERMINAL[Number(b.dataset.i)][2]); },
    'copy-msg': function (b) { copy(msgText(b.dataset.k), 'Mensagem copiada'); },
    'copy-all': function () {
      var linhas = [];
      window.PECAS.filter(function (p) { return p[2] === 'jogador'; }).forEach(function (p) { linhas.push(p[1] + ': ' + imgUrl(p[0] + '.webp')); });
      window.MAPAS.filter(function (m) { return m[2] === 'jogador'; }).forEach(function (m) { linhas.push('Mapa ' + m[1] + ': ' + imgUrl('mapa-' + m[0] + '.webp')); });
      copy(linhas.join('\n'), 'Lista copiada');
    },

    'notas-copy': function () { copy(store.get('notas', ''), 'Notas copiadas'); },
    'notas-clear': function (b) {
      if (b.dataset.sure === '1') { store.set('notas', ''); $('#notas').value = ''; $('#notas-n').textContent = '0 caracteres'; b.textContent = 'Apagar'; b.dataset.sure = ''; toast('Notas apagadas'); }
      else { b.dataset.sure = '1'; b.textContent = 'Tem certeza?'; setTimeout(function () { if (b.isConnected) { b.dataset.sure = ''; b.textContent = 'Apagar'; } }, 3000); }
    },
    'backup-copy': function () { copy(JSON.stringify(store.all()), 'Backup copiado'); },
    'backup-restore': function () {
      var raw = $('#restore').value.trim();
      try {
        var o = JSON.parse(raw);
        if (!o || typeof o !== 'object' || Array.isArray(o)) throw new Error('formato');
        Object.keys(o).forEach(function (k) { store.set(k, o[k]); });
        clock = store.get('clock', clock); hist = store.get('hist', hist); T = store.get('teste', T);
        toast('Backup restaurado'); render();
      } catch (e) { toast('Esse texto não é um backup válido.'); }
    }
  };

  function testeChanged() {
    store.set('teste', T);
    $('#teste').innerHTML = testeHtml();
    chanceRender();
  }
  function fechRedraw() { $('#fech').innerHTML = fechHtml(); }
  function fechReset() { F.secret = []; F.tries = 0; F.log = []; F.status = ''; F.show = false; fechRedraw(); }
  function npcRefresh() {
    $('#nfilters').innerHTML = npcFiltersHtml();
    $('#ngrid').innerHTML = npcGridHtml();
  }
  function pvRedraw(n) {
    var max = pvInfo(n), cur = store.get('pv:' + n.slug, max);
    var v = $('#pv-v');
    v.className = 'v' + (cur <= 0 ? ' low' : '');
    v.innerHTML = cur + '<small style="font-size:20px;color:var(--mut)"> / ' + max + '</small>';
    $('#pv-msg').textContent = cur <= 0 ? 'Zerou: fora de combate. Se for um NPC importante, teste de lesão (Físico + Vigor, DT 7).' : 'A vida fica salva só neste aparelho.';
  }

  var CHG = {
    cena: function (b) {
      store.set('cena:' + b.dataset.id, b.checked);
      var acc = b.closest('.acc'); acc.classList.toggle('done', b.checked);
      var f = window.CENAS.filter(function (c) { return store.get('cena:' + c.id, false); }).length;
      $('#prog-n').innerHTML = f + '<small> de ' + window.CENAS.length + '</small>';
      $('#prog-b').style.width = (f / window.CENAS.length * 100) + '%';
    },
    pend: function (b) { store.set('pend:' + b.dataset.i, b.checked); },
    'fech-sons': function (b) { F.sons = b.checked; fechRedraw(); }
  };

  var INP = {
    regra: function (b) {
      var q = norm(b.value.trim());
      $$('#regras-list .acc').forEach(function (a) {
        var hit = !q || norm(a.textContent).indexOf(q) >= 0;
        a.hidden = !hit;
        if (q && hit) { $('.acc-b', a).hidden = false; a.classList.add('open'); }
        if (!q) { $('.acc-b', a).hidden = true; a.classList.remove('open'); }
      });
    },
    npcq: function (b) { NF.q = b.value; $('#ngrid').innerHTML = npcGridHtml(); },
    npcnote: function (b) { store.set('npcnote:' + b.dataset.slug, b.value); },
    lugar: function (b) { $('#lugares').innerHTML = lugaresHtml(b.value); },
    notas: function (b) { store.set('notas', b.value); $('#notas-n').textContent = b.value.length + ' caracteres'; },
    'cfg-live': function (b) { store.set('cfg:live', b.value.trim()); refreshLinks(); },
    code: function (b) { store.set('code:' + b.dataset.who, b.value.trim()); refreshLinks(); },
    quando: function (b) { store.set('quando', b.value); refreshMsgs(); }
  };
  function refreshLinks() {
    var L = liveBase();
    var v = $('#vivos');
    if (v) {
      v.innerHTML = linkRow('Quadro de investigação', L + 'index.html', ['pode', 'pode mandar']) +
        linkRow('Terminal', L + 'terminal.html', ['pode', 'pode mandar']) +
        linkRow('Ficha do Abel', fichaUrl('abel'), ['pode', 'só pro Abel']) +
        linkRow('Ficha do Thomas', fichaUrl('thomas'), ['pode', 'só pro Thomas']) +
        linkRow('Fichas (visão do mestre)', L + 'ficha.html?mestre', ['so', 'só mestre']) +
        linkRow('Terminal (visão do mestre)', L + 'terminal.html?mestre', ['so', 'só mestre']);
    }
    refreshMsgs();
  }
  function refreshMsgs() {
    ['abel', 'thomas', 'sessao', 'radio'].forEach(function (k) {
      var m = $('#msg-' + k); if (m) m.textContent = msgText(k);
    });
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-act]');
    if (!b) return;
    var fn = ACT[b.dataset.act];
    if (fn) fn(b, e);
  });
  document.addEventListener('change', function (e) {
    var b = e.target.closest('[data-chg]');
    if (b && CHG[b.dataset.chg]) CHG[b.dataset.chg](b, e);
  });
  document.addEventListener('input', function (e) {
    var b = e.target.closest('[data-in]');
    if (b && INP[b.dataset.in]) INP[b.dataset.in](b, e);
  });
  document.addEventListener('keydown', function (e) {
    var tag = (e.target.tagName || '').toLowerCase();
    if (e.key === 'Escape') {
      if ($('#m-sheet')) closeLayer('m-sheet');
      else if ($('#m-img')) closeLayer('m-img');
      else if ($('#m-npc')) location.hash = 'npcs';
    } else if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && $('#m-npc') && !$('#m-img') && tag !== 'input' && tag !== 'textarea') {
      var cur = (location.hash || '').slice(5);
      var i = NPCS.findIndex(function (n) { return n.slug === cur; });
      if (i >= 0) location.hash = 'npc-' + NPCS[(i + (e.key === 'ArrowRight' ? 1 : -1) + NPCS.length) % NPCS.length].slug;
    }
  });
  window.addEventListener('hashchange', route);

  route();
  if (!current) { current = 'mesa'; render(); }
})();
