/* STUDY BURST TCG — procedural original pixel card illustrations. No remote assets. */
(()=>{'use strict';const cache=new Map();
const pal={fire:['#ff5a48','#ffae61','#ffe4a0','#631e37','#22101c'],water:['#358af9','#64ddff','#e1fbff','#164675','#10243f'],nature:['#40b56c','#a5f78b','#edffd0','#205848','#0c2e29'],light:['#e5b86e','#fff1b0','#fff9e5','#795b69','#282845'],dark:['#9455e1','#dd9cfb','#f9dfff','#483071','#171330']};
const rgb=(hex)=>[1,3,5].map(k=>parseInt(hex.slice(k,k+2),16));
function sprite(c){if(cache.has(c.id))return cache.get(c.id);const canvas=document.createElement('canvas');canvas.width=160;canvas.height=210;const g=canvas.getContext('2d');if(!g)return '';g.scale(2,2);g.imageSmoothingEnabled=false;const [main,bright,light,shade,deep]=pal[c.civ];let seed=Array.from(c.id).reduce((a,v)=>Math.imul(a^v.charCodeAt(0),16777619),2166136261)|0;function r(){seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return(seed>>>0)/4294967296;}
const p=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)));};
const poly=(coords,col)=>{g.fillStyle=col;g.beginPath();g.moveTo(coords[0],coords[1]);for(let i=2;i<coords.length;i+=2)g.lineTo(coords[i],coords[i+1]);g.closePath();g.fill()};
const line=(x,y,x2,y2,col,w=1)=>{g.strokeStyle=col;g.lineWidth=w;g.beginPath();g.moveTo(Math.round(x)+.5,Math.round(y)+.5);g.lineTo(Math.round(x2)+.5,Math.round(y2)+.5);g.stroke()};
const ellipse=(x,y,rx,ry,color)=>{g.fillStyle=color;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill()};
const glow=(x,y,rad,color)=>{const grad=g.createRadialGradient(x,y,2,x,y,rad);grad.addColorStop(0,color+'cc');grad.addColorStop(.4,color+'32');grad.addColorStop(1,color+'00');g.fillStyle=grad;g.fillRect(x-rad,y-rad,rad*2,rad*2);};
// Painted multi-plane dungeon scenery: pixel steps, distant spires, mist, highlights.
const bg=g.createLinearGradient(0,0,40,105);bg.addColorStop(0,deep);bg.addColorStop(.44,shade);bg.addColorStop(.62,'#111b35');bg.addColorStop(1,'#060d19');g.fillStyle=bg;g.fillRect(0,0,80,105);
glow(45,41,47,main);poly([0,76,13,56,20,68,35,54,50,68,71,46,80,65,80,105,0,105],'#080e20a8');for(let k=0;k<7;k++){let x=(r()*80)|0;poly([x,72,x+3,42+r()*20,x+7,72],deep+'bb');}
for(let i=0;i<180;i++){let x=r()*80|0,y=r()*100|0,s=r()<.08?2:1;p(x,y,s,s,r()<.20?light+'99':r()<.32?main+'80':'#d7dff020');}
for(let i=0;i<9;i++){let x=r()*80|0,y=r()*105|0;line(x,y,x-4,y+9,main+'44');}
// Heroic silhouette types, one of several designs, each with class-specific details.
const name=c.name;const spell=c.type==='spell';const dragon=/竜|ドラグ|皇|覇海|バシリスク|原初|トカゲ|龍|龍神/.test(name);const beast=/獣|狼|犬|蛇|馬|芽|角|捕食|巨腕/.test(name);const caster=/師|導|賢|魔|精|詠|灯火|巫|潮騒/.test(name);const knight=/戦士|騎|衛|兵|守護|機神|番人|拳士|傭兵|鎧/.test(name);const plant=c.civ==='nature'&&(!dragon&&!beast);const cx=40,cy=56;
// Cinematic bloom / signature glyph behind monster.
glow(41,52,38,bright);g.strokeStyle=light+'33';g.lineWidth=.65;g.beginPath();g.ellipse(40,56,29,37,-.12,0,Math.PI*2);g.stroke();for(let i=0;i<12;i++){const a=i*Math.PI/6;let x=40+Math.cos(a)*32,y=55+Math.sin(a)*36;line(x,y,x+Math.cos(a)*3,y+Math.sin(a)*3,light+'8b',1);}
const outline='#070c19';
if(spell){
  // Geometric spell mandala with shards and arcane spokes.
  poly([40,14,55,37,69,52,53,67,41,87,26,68,12,53,28,35],outline);
  poly([40,20,52,38,62,51,51,66,40,80,28,65,18,52,30,38],main);
  poly([41,27,56,51,40,73,24,51],bright);poly([40,35,51,52,40,67,29,52],light);
  poly([40,31,45,45,55,50,45,57,40,75,34,57,26,51,35,45],bright+'b5');
  for(let i=0;i<25;i++){let a=i*2*Math.PI/25;const d=20+(i%5)*2;p(40+Math.cos(a)*d,52+Math.sin(a)*d,2,2,i%2?light:bright);}
  for(let i=0;i<7;i++){let x=10+r()*60,y=18+r()*68;poly([x,y-5,x+3,y,x,y+8,x-3,y],light+'dc');}
}else if(dragon){
  // Winged dragon: serrated wings, plated breast, large horned head and tail.
  poly([28,58,9,29,6,57,15,47,3,78,24,69,32,74],outline);
  poly([24,58,10,35,11,54,20,48,10,72,27,66],main);
  poly([51,57,70,27,76,56,66,49,79,76,57,68,46,73],outline);
  poly([54,57,70,33,70,55,62,47,72,70,51,67],main);
  poly([49,68,64,76,74,66,69,83,60,90,48,80],outline);
  poly([51,67,65,78,70,77,61,86,54,79],shade);
  ellipse(39,64,18,23,outline);ellipse(39,63,15,20,main);
  poly([31,47,45,44,54,55,47,79,31,82,24,63],bright);
  for(let j=0;j<5;j++){poly([29,56+j*5,40,61+j*5,50,55+j*5,44,63+j*5,35,65+j*5],j%2?shade:light+'a4');}
  poly([24,34,29,25,48,23,57,35,53,51,34,53,21,46],outline);
  poly([25,34,32,28,47,27,54,35,49,47,32,47,24,42],main);
  poly([27,29,20,13,34,20,36,30],light);poly([44,27,54,10,53,32],bright);
  poly([45,38,55,36,57,42,46,44],shade);p(29,36,6,3,light);p(45,35,6,3,light);p(31,36,3,3,outline);p(47,35,3,3,outline);p(47,44,6,2,outline);
  for(let z=0;z<3;z++){poly([25+z*10,47,28+z*10,54,32+z*10,46],light);}
  poly([24,74,19,88,28,90,35,76],outline);poly([45,75,49,89,57,90,55,76],outline);
  for(let z=0;z<3;z++)p(18+z*18,89,6,2,light);
}else if(beast){
  // Fanged four-legged beast with ruffled spine and elemental mane.
  poly([15,63,8,47,3,48,7,74,18,72],outline);
  poly([12,57,17,51,23,44,30,51,36,43,42,48,52,44,57,54,65,60,58,69,20,75],outline);
  poly([13,61,24,49,30,56,37,48,45,54,52,48,60,63,49,70,19,70],main);
  poly([19,55,29,56,33,61,50,58,45,69,24,67],bright);
  poly([40,44,43,26,50,33,54,23,60,35,64,39,65,52,57,57],outline);
  poly([43,44,48,31,53,36,57,29,60,38,62,52,54,54],main);
  poly([51,47,69,42,72,50,61,58,51,54],outline);
  poly([53,47,65,45,67,50,60,53,52,52],bright);
  p(58,46,4,3,light);p(60,47,2,2,outline);p(66,52,3,3,outline);
  for(let z=0;z<3;z++)poly([64+z*2,56,65+z*2,60,67+z*2,56],light);
  poly([23,70,20,88,29,90,33,71],outline);poly([46,70,46,88,56,90,53,69],outline);
  for(let z=0;z<3;z++){p(19+z*5,88,3,3,light);p(46+z*4,88,3,3,light);}
}else if(caster){
  // Arcane mage with mantle, glowing staff, crystal.
  poly([25,42,16,76,23,91,55,91,62,75,53,42],outline);
  poly([27,43,21,77,27,86,51,86,57,76,51,43],main);
  poly([34,46,30,83,48,82,45,47],shade);poly([32,41,28,30,32,22,48,22,53,33,49,43],outline);
  poly([31,30,39,22,48,30,47,39,31,39],bright);
  poly([18,35,39,13,62,36,55,40,21,42],outline);
  poly([22,34,38,16,57,34,53,38,24,39],main);
  p(34,31,4,3,light);p(44,31,4,3,light);p(36,31,2,2,outline);p(46,31,2,2,outline);
  poly([18,48,8,55,16,62,24,52],outline);poly([52,49,62,54,56,62,49,54],outline);
  line(66,21,67,86,outline,5);line(66,22,67,84,bright,2);
  poly([66,11,75,22,66,33,57,22],light);poly([66,16,71,23,65,29,61,22],main);
  for(let i=0;i<16;i++){let a=i*Math.PI/8;const d=10+i%3*4;p(66+Math.cos(a)*d,22+Math.sin(a)*d,2,2,light);}
}else if(knight){
  // Ornate armored champion with shoulder pauldrons and a large weapon.
  poly([25,48,16,40,8,81,34,92,58,87,55,43],outline);poly([25,47,20,45,15,76,31,86,54,83,52,46],shade);
  poly([22,45,31,35,49,35,59,44,53,56,24,58],outline);poly([24,44,33,38,48,38,56,45,50,55,26,55],main);
  poly([32,41,45,40,49,52,40,61,31,52],bright);
  poly([25,26,28,18,47,18,54,27,49,39,29,39],outline);
  poly([27,27,31,21,45,21,52,27,47,36,30,36],main);
  p(31,28,17,3,light);p(33,29,14,2,outline);poly([39,17,48,6,51,18,43,23],light);
  poly([24,53,17,66,23,77,33,64],main);poly([49,52,61,61,54,77,46,64],main);
  poly([27,64,23,89,34,89,38,65],outline);poly([43,65,47,89,57,88,53,63],outline);
  // Sword or halberd.
  poly([61,17,66,8,70,17,67,62,63,62],light);p(58,60,15,5,main);p(64,65,3,22,bright);
  for(let i=0;i<7;i++)p(31+(i%3)*6,47+Math.floor(i/3)*7,3,2,light+'bd');
}else{
  // Ancient golem / amorphous guardian.
  poly([24,22,49,22,62,35,58,67,51,86,25,87,18,63,13,35],outline);
  poly([25,24,48,24,59,37,55,65,50,82,27,83,20,62,17,36],main);
  poly([21,38,36,31,51,38,48,58,31,64],bright);
  p(30,43,6,4,light);p(44,43,5,4,light);p(33,45,2,3,outline);p(46,45,2,3,outline);
  for(let j=0;j<7;j++){let x=20+r()*35|0,y=28+r()*43|0;p(x,y,5,3,j%2?shade:light+'97');}
  poly([20,72,16,90,32,91,35,74],outline);poly([43,73,45,92,62,90,57,72],outline);
}
// Directional highlights and foreground motes; stronger for rarer cards.
for(let i=0;i<32;i++){let x=15+r()*48|0,y=25+r()*66|0;if(r()<.50)p(x,y,1+r()*2|0,1,r()<.45?bright:light+'95');}
for(let i=0;i<(c.rarity==='N'?9:c.rarity==='U'?15:28);i++){let x=r()*80|0,y=20+r()*79|0;p(x,y,1+r()*2|0,1,r()<.6?bright+'c5':light+'d3');}
if(c.rarity==='LG'||c.rarity==='SEC'){for(let z=0;z<9;z++){let a=z*Math.PI/4.5,x=40+Math.cos(a)*34,y=52+Math.sin(a)*40;poly([x,y-3,x+2,y,x,y+3,x-2,y],light);}}
if(c.rarity==='SEC'){for(let i=0;i<16;i++){const x=r()*80|0,y=r()*105|0;p(x,y,3,1,['#ff88ec','#9ff8ff','#fff1ad'][i%3]);}}
// Sharp vignette and a thin environment border to complement new chrome framing.
const vg=g.createLinearGradient(0,0,0,105);vg.addColorStop(0,'#03061188');vg.addColorStop(.18,'#00000000');vg.addColorStop(.76,'#00000000');vg.addColorStop(1,'#020614c9');g.fillStyle=vg;g.fillRect(0,0,80,105);
const out=canvas.toDataURL('image/png');cache.set(c.id,out);return out;}
window.STUDY_CARD_ART=sprite;
})();