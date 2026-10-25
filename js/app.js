const VILL = ["Noche de paz", "Campana sobre campana", "El tamborilero", "Burrito sabanero"];
const secciones = [{id: "inicio", nombre: "Inicio"}, {id: "oi", nombre: "Oración inicial"}]
  .concat(DIAS.map((d, i) => ({id: "d" + i, nombre: "Día " + (i + 1)})))
  .concat([{id: "gozos", nombre: "Gozos"}, {id: "of", nombre: "Oración final"}]);
const $ = s => document.querySelector(s);
const p = t => t.split("\n").map(x => `<p>${x}</p>`).join("");
const bloque = (t, c, cls = "") => `<section class="bloque ${cls}"><h3>${t}</h3>${c}</section>`;
const canto = n => { const t = VILL[n % 4], l = LETRAS[t]; return bloque("Villancico", `<p>Cantemos juntos: <strong>${t}</strong></p>` + (l ? `<p>${l}</p>` : ""), "canto"); };
const gozos = () => bloque("Gozos", `<p class="coro">${GOZOS.coro}</p>` + p(GOZOS.estrofas.join("\n")));
let actual = Number(localStorage.getItem("novena") || 0);

function vistaDia(i) {
  const d = DIAS[i];
  return `<h2 class="titulo">Día ${i + 1}</h2><p class="tema">${d.tema}</p>` +
    bloque("Monición inicial", p(d.monicion)) + canto(i) +
    bloque("Oración inicial", p(d.oracion)) +
    bloque("Miremos la vida", p(d.vida)) + canto(i + 1) +
    bloque("Cita bíblica", `<p class="cita">${d.cita[1]}<small>${d.cita[0]} · Palabra del Señor.</small></p>`) +
    bloque("Reflexión", p(d.reflexion)) +
    bloque("Dialoguemos", `<ul>${d.dialogo.map(q => `<li>${q}</li>`).join("")}</ul>`) +
    bloque("Compromiso", p(d.compromiso)) + gozos() +
    bloque("Oración final", p(ORACION_FINAL)) + canto(i + 2);
}

function vista(s) {
  if (s.id === "inicio") return `<div class="portada"><img src="img/estrella.svg" alt="Estrella de Belén"><h2>Novena de Navidad</h2><p>Nueve noches para encontrarnos en familia y esperar a Jesús. Del 16 al 24 de diciembre.</p><p>Toquen “Siguiente” para comenzar.</p></div>`;
  if (s.id === "oi") return `<h2 class="titulo">Oración inicial</h2><p class="tema">Para todos los días</p>` + bloque("Oración", p(ORACION_INICIAL));
  if (s.id === "gozos") return `<h2 class="titulo">Gozos</h2>` + gozos();
  if (s.id === "of") return `<h2 class="titulo">Oración final</h2>` + bloque("Oración", p(ORACION_FINAL)) + canto(0);
  return vistaDia(Number(s.id.slice(1)));
}

function ir(n) {
  actual = Math.max(0, Math.min(secciones.length - 1, n));
  localStorage.setItem("novena", actual);
  $("#contenido").innerHTML = vista(secciones[actual]);
  document.querySelectorAll("#menu button").forEach((b, i) => b.classList.toggle("on", i === actual));
  $("#menu .on").scrollIntoView({inline: "center", block: "nearest"});
  $("#progreso").style.width = (actual / (secciones.length - 1)) * 100 + "%";
  $("#ant").disabled = actual === 0;
  $("#sig").disabled = actual === secciones.length - 1;
  window.scrollTo({top: 0});
}

$("#menu").innerHTML = secciones.map((s, i) => `<button data-i="${i}">${s.nombre}</button>`).join("");
$("#menu").onclick = e => e.target.dataset.i && ir(+e.target.dataset.i);
$("#ant").onclick = () => ir(actual - 1);
$("#sig").onclick = () => ir(actual + 1);
ir(actual);
