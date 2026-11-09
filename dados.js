/* Regras de dados do playtest de Ordem 2, em funções puras (testáveis no node).
   Teste: soma o dado do atributo, o da perícia e os extras. Passa se o total for >= DT.
   Crítico: 2 ou mais dados iguais com valor 6 ou mais passa sozinho. Todos em 1 falha sozinho.
   Dado de pavor: rola junto, não soma, anula os dados do teste menores que ele. Anulou todos: falha crítica.
   Limite do playtest: 4 dados rolados e 3 somados. Aqui soma os 3 maiores. */
(function (raiz) {
  var PASSOS = [4, 6, 8, 10, 12];

  function passo(faces, delta) {
    var i = PASSOS.indexOf(faces);
    if (i < 0) return faces;
    return PASSOS[Math.max(0, Math.min(PASSOS.length - 1, i + delta))];
  }

  function aleatorio(n) {
    if (raiz.__rng) return raiz.__rng(n);
    var a = new Uint32Array(1);
    var lim = Math.floor(4294967296 / n) * n;
    do { raiz.crypto.getRandomValues(a); } while (a[0] >= lim);
    return (a[0] % n) + 1;
  }

  // valores: array de números já rolados, na mesma ordem de faces. pavor: valor do dado de pavor ou null.
  function avalia(valores, pavor) {
    var ativos = valores.map(function (v) { return { v: v, anulado: pavor != null && v < pavor }; });
    var vivos = ativos.filter(function (d) { return !d.anulado; });
    var r = { ativos: ativos, pavor: pavor, total: 0, ra: null, rb: null, crit: null, somados: [] };
    if (pavor != null && vivos.length === 0) { r.crit = 'falha-pavor'; return r; }
    var vals = vivos.map(function (d) { return d.v; }).sort(function (a, b) { return b - a; });
    r.somados = vals.slice(0, 3);
    r.total = r.somados.reduce(function (s, x) { return s + x; }, 0);
    r.ra = vals[0];
    r.rb = vals[vals.length - 1];
    var cont = {};
    vals.forEach(function (v) { cont[v] = (cont[v] || 0) + 1; });
    var iguais = Object.keys(cont).some(function (k) { return cont[k] >= 2 && Number(k) >= 6; });
    if (iguais) r.crit = 'sucesso';
    else if (valores.length >= 2 && vals.every(function (v) { return v === 1; })) r.crit = 'falha';
    return r;
  }

  function passou(r, dt) {
    if (r.crit === 'sucesso') return true;
    if (r.crit === 'falha' || r.crit === 'falha-pavor') return false;
    return r.total >= dt;
  }

  // rola: faces = [d, d, ...] dados do teste, pavorFaces = d ou null
  function rola(faces, pavorFaces) {
    var valores = faces.map(function (f) { return aleatorio(f); });
    var pv = pavorFaces ? aleatorio(pavorFaces) : null;
    var r = avalia(valores, pv);
    r.faces = faces.slice();
    r.valores = valores;
    r.pavorFaces = pavorFaces || null;
    r.pavorAcabou = pv === 1;
    return r;
  }

  // Chance exata de passar, enumerando todas as combinações.
  function chance(faces, dt, pavorFaces) {
    var n = faces.length;
    var total = 0, ok = 0;
    var valores = new Array(n);
    function rec(i, pav) {
      if (i === n) {
        total++;
        if (passou(avalia(valores, pav), dt)) ok++;
        return;
      }
      for (var v = 1; v <= faces[i]; v++) { valores[i] = v; rec(i + 1, pav); }
    }
    if (pavorFaces) {
      for (var p = 1; p <= pavorFaces; p++) rec(0, p);
    } else {
      rec(0, null);
    }
    return total ? ok / total : 0;
  }

  var API = { PASSOS: PASSOS, passo: passo, aleatorio: aleatorio, avalia: avalia, passou: passou, rola: rola, chance: chance };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else raiz.Dados = API;
})(typeof window !== 'undefined' ? window : globalThis);
