var t = []; var c = 10; var f = 20; var px = 3; var py = 0;
var fm = [[[1,1,1,1]], [[1,1],[1,1]], [[1,1,1],[0,1,0]], [[1,1,0],[0,1,1]], [[1,1,1],[1,0,0]]];
var pz; var gd = null; var pts = 0; var nv = 1; var mon = 0; var rec = 0;
var sk = "Madera"; var pl = ["#D2B48C", "#BC8F8F", "#DEB887", "#CD853F", "#A0522D"]; 
var fAct = 0; var nse, flt, env, part = [];

function setup() {
  createCanvas(200, 500);
  mon = parseInt(localStorage.getItem("monedas")) || 0;
  rec = parseInt(localStorage.getItem("highScore")) || 0;
  for (var i = 0; i < f; i++) { t[i] = new Array(c).fill(0); }
  
  nse = new p5.Noise('white');
  flt = new p5.BandPass();
  env = new p5.Env();
  nse.disconnect(); nse.connect(flt);
  flt.set(400, 10); 
  env.setADSR(0.01, 0.05, 0.1, 0.1);
  env.setRange(0.5, 0);
  nse.start();
  nueva();
}

function draw() {
  background(pl[fAct % pl.length]);
  
  if (frameCount % Math.max(10, 60 - (nv * 5)) === 0) {
    flt.set(400 + (nv * 100), 10); 
    env.play(nse);
  }
  
  if (frameCount % Math.max(5, 30 - Math.floor(nv * 0.5)) === 0) { if (!mov(0, 1)) fijar(); }
  
  for (var i = 0; i < f; i++) { for (var j = 0; j < c; j++) { if (t[i][j]) dib(j * 20, i * 20); } }
  for (var i = 0; i < pz.length; i++) { for (var j = 0; j < pz[i].length; j++) { if (pz[i][j]) dib((px + j) * 20, (py + i) * 20); } }
  for (let i = part.length - 1; i >= 0; i--) { part[i].upd(); part[i].sho(); if (part[i].fin()) part.splice(i, 1); }
  
  fill(50); noStroke(); rect(0, 400, 200, 100);
  fill(255); textSize(11); text("Pts: "+pts+" Lvl: "+nv, 10, 420);
  text("Mon: "+mon+" Skin: "+sk, 10, 440); text("IZQ-ROT-HOLD-DER", 10, 460);
}

function dib(x, y) {
  strokeWeight(1);
  if (sk === "Madera") { fill(139, 69, 19); stroke(100, 40, 10); rect(x, y, 20, 20); }
  else if (sk === "Piedra") { fill(120); stroke(80); rect(x, y, 20, 20); }
  else { fill(255, 215, 0); stroke(200, 150, 0); rect(x, y, 20, 20); }
}

function fijar() {
  for (var i = 0; i < pz.length; i++) { for (var j = 0; j < pz[i].length; j++) { if (pz[i][j]) t[py + i][px + j] = 1; } }
  if (pts > rec) { rec = pts; localStorage.setItem("highScore", rec); }
  bor(); nueva();
  if (!mov(0, 0)) { noLoop(); alert("¡Game Over! Nivel alcanzado: " + nv); }
}

function bor() {
  for (var i = f - 1; i >= 0; i--) {
    if (t[i].every(function(v){return v==1;})) {
      t.splice(i, 1); t.unshift(new Array(c).fill(0));
      for(let n=0; n<5; n++) part.push(new Part(i*20));
      pts += 10; mon += 1; 
      if (pts >= nv * 100) { nv++; }
      localStorage.setItem("monedas", mon); i++;
    }
  }
}

class Part {
  constructor(y) { this.x = 100; this.y = y; this.a = 255; }
  upd() { this.a -= 10; }
  sho() { noStroke(); fill(255, this.a); ellipse(this.x, this.y, 5); }
  fin() { return this.a < 0; }
}

function touchStarted() {
  if (mouseY > 400) {
    if (mouseX < 50) mov(-1, 0); else if (mouseX < 100) rot();
    else if (mouseX < 150) hld(); else if (mouseX < 200) mov(1, 0);
    if (mouseY > 470) { if (mon >= 20) sk = "Oro"; else if (mon >= 5) sk = "Piedra"; }
  } return false;
}

function rot() { var r = pz[0].map(function(v, i) { return pz.map(function(row) { return row[i]; }).reverse(); }); var a = pz; pz = r; if (!mov(0, 0)) pz = a; }
function mov(dx, dy) {
  for (var i = 0; i < pz.length; i++) { for (var j = 0; j < pz[i].length; j++) { if (pz[i][j]) { var nx = px + j + dx; var ny = py + i + dy; if (nx < 0 || nx >= c || ny >= f || (ny >= 0 && t[ny][nx])) return false; } } }
  px += dx; py += dy; return true;
}
function nueva() { pz = fm[Math.floor(Math.random() * fm.length)]; px = 3; py = 0; }
function hld() { if (gd === null) { gd = pz; nueva(); } else { var tmp = pz; pz = gd; gd = tmp; px = 3; py = 0; } }
