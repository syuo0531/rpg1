(()=>{'use strict';
const $=id=>document.getElementById(id), clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),rand=n=>Math.floor(Math.random()*n),pick=a=>a[rand(a.length)];
const KEY='studySurvivor.v1', TYPES={grass:['翠','#73d99c','#2f805e','❧'],fire:['炎','#ff9b61','#ac3d41','♨'],water:['水','#7ac8ff','#3265a5','≋'],lightning:['雷','#f9dc78','#ac802b','ϟ'],psychic:['念','#ccabff','#7553b5','✧'],fighting:['闘','#edbe85','#986345','✦'],dark:['毒','#bc87d8','#6a497e','☾'],dragon:['竜','#ffab8a','#8e4665','♜'],normal:['無','#d3d9b6','#637b70','◇']};
const STAGES=[{name:'若葉の草原',tag:'GREENHAVEN',type:'grass',level:1,desc:'小さなモンスターが群れをなす、最初のフィールド。'},{name:'灼熱の渓谷',tag:'EMBER RIDGE',type:'fire',level:2,desc:'炎の弾幕と高速モンスターが待ち受ける。'},{name:'星明かりの遺跡',tag:'STARFALL RUINS',type:'psychic',level:3,desc:'強敵と巨大ボスがひしめく最終エリア。'}];
const MOVES={grass:'はっぱカッター',fire:'ひのこ',water:'みずでっぽう',lightning:'でんきショック',psychic:'ねんりき',fighting:'いわくだき',dark:'どくばり',dragon:'りゅうのいぶき',normal:'スピードスター'};
// Battle is a streamlined single-type ruleset. Kanto's original dual typings are mapped
// to one of the nine categories in data/kanto.json (not the complete official type chart).
const TYPE_CHART={
 grass:{water:1.6,fire:.65,grass:.65,dragon:.65},
 fire:{grass:1.6,fire:.65,water:.65,dragon:.65},
 water:{fire:1.6,water:.65,grass:.65,dragon:.65},
 lightning:{water:1.6,lightning:.65,grass:.65,dragon:.65},
 psychic:{fighting:1.6,psychic:.65,dark:.65},
 fighting:{dark:1.6,normal:1.6,psychic:.65},
 dark:{psychic:1.6,dark:.65,fighting:.65},
 dragon:{dragon:1.6},normal:{}
};
function effectiveness(attackType,defendType){return TYPE_CHART[attackType]?.[defendType]??1;}
function pokemonMaxHP(s,id,bonus=0){return Math.round(115+(s?.hp||70)*1.35+((state.training[id]||1)-1)*13+(s?.stage||0)*8+bonus);}
function activePokemon(g=game){return g?.team[g.activeIndex]||null;}
function hpLabel(n){return String(Math.max(0,Math.ceil(n)));}
function switchPokemon(index,forced=false){
 const g=game;if(!g||!g.running||g.choosing||page!=='battle')return false;
 const next=g.team[index];if(!next||next.hp<=0||index===g.activeIndex)return false;
 if(!forced&&g.switchCooldown>0){notify('交代は '+g.switchCooldown.toFixed(1)+' 秒後にできます');return false;}
 if(g.paused&&!forced)return false;
 const prev=activePokemon(g);g.activeIndex=index;g.switchCooldown=forced?1.5:2.5;
 g.invuln=Math.max(g.invuln,forced?1:.75);
 next.cd=Math.max(next.cd,.2);g.shots=g.shots.filter(p=>p.ttl>.1);
 g.lastTypeHint=0;
 floatText(g.position.x,g.position.y-60,'GO! '+byId[next.id].name,typeOf(byId[next.id])[1]);
 notify((prev?.hp<=0?'仲間が倒れた！ ':'')+byId[next.id].name+' に交代！');
 updateHUD();return true;
}
function takePlayerDamage(raw,sourceType){
 const g=game,a=activePokemon(g);if(!g?.running||!a||g.invuln>0)return;
 const mult=effectiveness(sourceType,byId[a.id].type);
 const amount=Math.max(1,Math.ceil(raw*mult*g.boost.defense));a.hp=Math.max(0,a.hp-amount);
 g.invuln=.7;
 floatText(g.position.x,g.position.y-39,'-'+amount,mult>1?'#ff8f8a':'#fff0bd');
 if(mult!==1&&g.seconds>g.lastTypeHint){floatText(g.position.x,g.position.y-65,mult>1?'こうかばつぐん！':'こうかいまひとつ','#f7ec9b');g.lastTypeHint=g.seconds+1.35;}
 if(a.hp===0){const reserve=g.team.findIndex((mon,i)=>i!==g.activeIndex&&mon.hp>0);if(reserve>=0)switchPokemon(reserve,true);else finishRun(false);}
}
const UPGRADES=[{id:'power',icon:'⚔',name:'火力アップ',desc:'全員の攻撃ダメージ +25%'},{id:'rate',icon:'ϟ',name:'れんぞく技',desc:'技のクールダウン -17%'},{id:'multi',icon:'✧',name:'拡散攻撃',desc:'同時発射数 +1'},{id:'speed',icon:'➤',name:'かるい足取り',desc:'移動速度 +14%'},{id:'hp',icon:'♥',name:'最大HPアップ',desc:'最大HP +35、HPも回復'},{id:'magnet',icon:'◉',name:'広域回収',desc:'経験値の吸引範囲 +48%'},{id:'orbit',icon:'☄',name:'守護の輪',desc:'周囲を回る攻撃球 +1'},{id:'defense',icon:'⛨',name:'防御強化',desc:'受けるダメージ -13%'},{id:'heal',icon:'✚',name:'応急回復',desc:'HPを70回復する'}];
const FALLBACK_QUESTIONS=[{id:'q1',question:'骨格筋の収縮でCa²⁺が結合するタンパク質は？',choices:['トロポニン','アクチン','ミオシン','チチン'],correct:0,explanation:'カルシウムはトロポニンCに結合します。',subject:'運動生理'},{id:'q2',question:'大腿四頭筋に含まれないのは？',choices:['大腿直筋','外側広筋','大腿二頭筋','中間広筋'],correct:2,explanation:'大腿二頭筋はハムストリングスです。',subject:'解剖学'},{id:'q3',question:'ATPを直接使う筋収縮の構造は？',choices:['ミオシン頭部','筋紡錘','腱器官','筋膜'],correct:0,explanation:'ミオシン頭部のATPaseがATPを分解します。',subject:'運動生理'},{id:'q4',question:'ACLの主な機能は？',choices:['脛骨の前方移動制限','足関節背屈','股関節外転','肩関節外旋'],correct:0,explanation:'ACLは脛骨の前方移動を制動します。',subject:'外傷'},{id:'q5',question:'等尺性筋収縮の特徴は？',choices:['筋長の変化が少ない','必ず関節が曲がる','常に遠心性','筋活動がない'],correct:0,explanation:'等尺性では大きな筋長変化が起こりません。',subject:'運動生理'}];
let species=[],byId={},questions=FALLBACK_QUESTIONS.slice(),currentQ=null,answered=false,selectedAnswer=-1,answerGood=false,studyFilter='all',state=null,page='home',gachaResult=null,dexFilter='all',dexPage=0,teamPick=-1,selectedStage=0,game=null,raf=0,keys=new Set(),toastTimer=null,mousePointer=null;
function initial(){return {version:1,starter:null,owned:{},team:[],tickets:1,dust:100,studied:0,correct:0,credit:0,combo:0,best:0,history:{},reviews:[],questionAdditions:[],training:{},stages:1,clears:0,pity:{r:0,sr:0,lg:0},packsOpened:0,settings:{effects:true}};}
function load(){try{let saved=JSON.parse(localStorage.getItem(KEY));return saved?{...initial(),...saved,history:saved.history||{},owned:saved.owned||{},training:saved.training||{},pity:{r:0,sr:0,lg:0,...saved.pity}}:initial();}catch{return initial()}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}}
function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]))}
function notify(s){let el=$('toast');el.textContent=s;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600)}
function typeOf(s){return TYPES[s.type]||TYPES.normal}function rankName(r){return {N:'NORMAL',U:'UNCOMMON',R:'RARE',SR:'SUPER RARE',LG:'LEGEND'}[r]||r}
// Portable RPG pixel-art sources. Images are fetched on demand rather than redistributed.
// The procedural generator below remains as an offline/failed-network fallback.
const POKE_SPRITE_ROOT='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/';
function pokemonSpriteURL(id){const dex=Number(byId[id]?.dex||id?.replace(/^p/,''));return Number.isInteger(dex)&&dex>0&&dex<=151?POKE_SPRITE_ROOT+dex+'.png':'';}
function spriteTag(id,cls='sprite'){const s=byId[id];if(!s)return '';return `<img class="${cls}" loading="lazy" alt="${escapeHTML(s.name)}" data-pokemon="${s.dex}" src="${spriteURI(id)}">`;}

const spriteCache=new Map();function seedHash(n){n=(n^61)^(n>>>16);n=Math.imul(n,9);n=n^(n>>>4);n=Math.imul(n,0x27d4eb2d);return(n^(n>>>15))>>>0;}
function spriteURI(id){if(spriteCache.has(id))return spriteCache.get(id);const s=byId[id];if(!s)return '';let colors=typeOf(s),c=document.createElement('canvas');c.width=c.height=32;const x=c.getContext('2d');x.imageSmoothingEnabled=false;let n=s.dex,body=colors[1],dark=colors[2];const p=(color,rx,ry,w,h)=>{x.fillStyle=color;x.fillRect(rx,ry,w,h)};
// Species-specific preview silhouettes, not scans/tracings of Pokémon game sprite tiles.
if([1,2,3,4,5,6,7,8,9,25,39,52,94,133,150,151].includes(n)){
const poly=(color,points)=>{x.fillStyle=color;x.beginPath();x.moveTo(points[0][0],points[0][1]);points.slice(1).forEach(v=>x.lineTo(...v));x.closePath();x.fill()};
const eye=(ex,ey,color='#192a30')=>{p(color,ex,ey,3,4);p('#ffffff',ex,ey,1,2)};
p('#2447454a',6,27,21,3);
if([1,2,3].includes(n)){const huge=n===3;p('#214447',6,15,23,11);p('#69a8a0',5,13,22,14);p('#459489',7,12,19,13);p('#8eceb2',10,13,8,4);for(const j of [8,21]){p('#386c6b',j,24,5,5);p('#76b4a3',j+1,24,4,3)}poly('#316a47',[[10,15],[12,6],[16,2],[21,5],[24,14]]);poly('#4c9f59',[[8,14],[12,4],[17,5],[22,2],[25,14]]);p('#b9ed79',17,8,3,5);p('#376b51',12,8,3,4);eye(7,17,'#c74f68');eye(21,17,'#c74f68');p('#2f5965',13,23,6,1);if(huge){p('#edb780',11,4,9,4);p('#dd7b74',14,2,4,7)}}
if([4,5,6].includes(n)){const big=n===6;if(big){poly('#286c8a',[[11,12],[1,6],[1,21],[11,24]]);poly('#3480a0',[[20,13],[31,6],[31,24],[22,25]])}p('#7d483b',14,9,13,19);p('#f48b4e',12,7,13,18);p('#ffb16e',8,12,13,13);p('#ffc780',10,21,10,3);p('#9e553e',10,25,5,5);p('#a25038',20,25,5,5);p('#f1b377',11,25,4,4);p('#ec9950',21,25,4,4);poly('#954839',[[22,17],[29,14],[29,9],[31,14],[30,20],[23,23]]);p('#ffdb78',27,8,4,5);p('#ff814b',26,7,4,4);p('#ffe79a',27,8,2,4);eye(11,14);p('#fbd5a5',11,20,6,2);}
if([7,8,9].includes(n)){const big=n===9;p('#9e6e48',9,8,19,20);p('#d09c5f',10,9,16,18);p('#6f5144',12,10,12,15);p('#c9a171',14,10,10,11);p('#457fa8',4,15,8,12);p('#6ab7d1',5,14,9,13);p('#74bee0',13,16,11,12);p('#d5ecdf',13,18,9,7);p('#327ca5',8,25,6,4);p('#327ca5',20,25,6,4);p('#7ac9e0',8,24,6,4);p('#7ac9e0',20,24,6,4);if(big){p('#5a6870',12,7,3,13);p('#cfd7d4',12,4,6,9);p('#5a6870',24,8,4,12);p('#ced8d5',24,5,5,9)}eye(7,16);p('#2c7588',6,22,4,2)}
if(n===25){p('#8b6036',5,5,6,14);p('#eed151',6,5,5,13);p('#242936',5,4,5,6);p('#8b6036',22,4,5,15);p('#f4d557',23,5,4,14);p('#23293d',24,4,4,6);p('#8b6a36',7,13,21,14);p('#f8d75a',6,12,21,14);p('#f9e99b',8,14,15,5);p('#f2cb50',10,24,5,5);p('#f2cb50',22,24,5,5);eye(10,18);eye(21,18);p('#e97872',6,22,5,4);p('#e97872',23,22,4,4);p('#342c32',16,22,3,2);poly('#d3a34c',[[26,18],[31,17],[28,21],[31,23],[28,27],[23,26]]);}
if(n===39){p('#b964ab',7,11,21,17);p('#eaa5cc',5,10,22,17);p('#ffd9df',9,13,13,8);p('#c074ad',7,6,8,8);p('#e994c9',10,5,7,9);p('#c074ad',22,6,6,8);eye(10,17,'#27669c');eye(21,17,'#27669c');p('#c96185',16,23,4,2);p('#d48aba',6,24,6,4);p('#d48aba',24,24,5,4)}
if(n===52){p('#dba759',8,8,20,19);p('#f0d4a3',9,9,17,16);p('#8a594b',8,6,5,9);p('#8a594b',22,6,5,9);p('#f9d271',9,7,4,8);p('#f9d271',23,7,3,8);p('#eec376',12,5,10,7);p('#cca35a',15,2,5,8);eye(11,17);eye(22,17);p('#be6557',17,23,3,2);p('#9c704d',7,24,5,4);p('#9c704d',22,24,5,4)}
if(n===94){p('#402e67',5,10,23,17);p('#6b52ab',6,10,22,17);poly('#584197',[[7,14],[8,3],[16,13]]);poly('#7254ad',[[21,13],[28,4],[27,17]]);p('#866dc0',10,11,15,8);p('#553e8f',6,24,7,5);p('#563f8d',23,24,7,5);p('#db615d',10,16,5,3);p('#db615d',21,16,5,3);p('#f5f4df',12,24,15,3);for(let i=12;i<26;i+=4)p('#4c365e',i,24,1,3)}
if(n===133){p('#634635',8,10,21,17);p('#b47c54',8,10,19,16);poly('#50392f',[[8,15],[6,1],[16,11]]);poly('#895d43',[[7,10],[8,4],[14,12]]);poly('#50392f',[[20,11],[28,1],[28,17]]);poly('#916344',[[22,12],[27,5],[26,17]]);p('#f4ddae',7,20,18,8);p('#d8b98e',10,22,15,6);p('#d19b6e',10,26,6,3);p('#a56a50',21,25,6,4);eye(12,15);eye(22,15);p('#55362e',17,20,3,2)}
if(n===150||n===151){const a=n===150;p('#5c599e',9,13,18,17);p(a?'#b1a2cf':'#f0c7db',10,a?8:11,17,17);p('#c8bde0',13,5,12,10);p('#896fbb',10,2,7,8);p('#8f72bf',23,2,6,9);p('#ede6ed',14,8,8,5);eye(13,15,'#536089');eye(23,15,'#536089');poly('#b995cf',[[23,20],[30,23],[30,29],[24,31],[22,28],[28,26]]);p('#9f8ebd',10,24,6,5);p('#9f8ebd',22,24,6,5)}
const url=c.toDataURL('image/png');spriteCache.set(id,url);return url;
}

 // Deterministic original mini-sprites, never copying licensed artwork; visible silhouette and detailed shading vary per species.
let form=n%7;const horn=n%3,wing=(s.stage>0&&n%4!==0)||form===5,tail=n%5!==2,wide=form===4,round=form===0;
p('#1b322f77',6,27,21,3);if(tail){p(dark,22,18,6,3);p(body,25,15,4,5);p('#fff9cb77',27,14,2,2)}
if(wing){p(dark,2,12,9,12);p(dark,22,12,8,12);p(body,3,10,8,11);p(body,23,10,6,11);p('#ffffff55',4,12,3,5);p('#ffffff55',25,13,2,5)}
if(form===1||form===5){p(dark,10,4,4,10);p(dark,19,4,4,10);p(body,11,5,3,10);p(body,20,5,3,10)}
if(horn===0){p('#e2c9a7',8,5,3,6);p('#e2c9a7',22,5,3,6)}
if(horn===1){p(dark,11,3,4,7);p(dark,19,3,4,7)}
p(dark,8,11,17,17);p(body,7,10,18+(wide?2:0),16);p(body,10,7,13,9);p('#ffffff30',10,11,11,2);p('#fffbe5a1',11,18,11,8);
if(round){p(body,5,16,4,8);p(body,24,16,4,8)}else {p(dark,5,19,4,7);p(dark,24,19,4,7);p(body,6,18,4,6);p(body,23,18,4,6)}
p(dark,10,25,5,4);p(dark,19,25,5,4);p(body,11,24,4,4);p(body,19,24,4,4);
p('#132128',11,14,4,4);p('#132128',20,14,4,4);p('#fff8de',12,14,2,2);p('#fff8de',21,14,2,2);p('#a04c58',16,19,3,2);p('#00000028',12,23,10,2);
if(s.type==='lightning'){p('#fff8b0',5,8,4,3);p('#fff8b0',25,5,3,5)}if(s.type==='grass'){p('#70ec82',14,3,4,6);p('#23783f',18,4,4,4)}if(s.type==='fire'){p('#fff4ad',14,4,3,5);p('#f96a45',18,2,4,8)}if(s.type==='psychic'){p('#f7cafc',15,5,4,4);p('#6d55cf',8,10,4,2)}if(s.type==='dragon'){p('#f5dfac',8,5,3,5);p('#f5dfac',23,5,3,5)}if(s.type==='dark'){p('#d9b9e7',7,9,4,3);p('#583f8b',23,8,4,3)}
// Tiny unique flecks and rim lights: make otherwise similar pixel bodies feel individually collectible.
let hash=seedHash(n);for(let i=0;i<6;i++){let px=9+(hash%15),py=11+((hash>>>5)%13);hash=seedHash(hash+i+3);p(i%2?'#14262148':'#ffffff36',px,py,i%3===0?2:1,1)}
let url=c.toDataURL('image/png');spriteCache.set(id,url);return url;}
function setPage(p){if(game&&p!=='battle'&&game.running){game.paused=true;game.autoPaused=false;}page=p;$('main').classList.toggle('ingame',p==='battle'&&!!game);document.querySelectorAll('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===p));render();scrollTo({top:0,behavior:'instant'})}
function resources(){$('ticketCount').textContent=state.tickets;$('dustCount').textContent=state.dust}
function heading(k,t,d=''){return `<div class="eyebrow">${k}</div><h1 class="page-title">${t}</h1>${d?`<p class="sub">${d}</p>`:''}`}
function button(label,action,cl='btn',attrs=''){return `<button class="${cl}" data-act="${action}" ${attrs}>${label}</button>`}
function modal(html){$('modalPanel').innerHTML=html;$('modal').hidden=false}function closeModal(){if(game?.choosing)return; $('modal').hidden=true}
function beginStarter(id){if(state.starter)return;state.starter=id;state.owned={[id]:1,p016:1,p019:1};state.team=[id,'p016','p019'].filter((x,i,a)=>a.indexOf(x)===i);state.training[id]=1;save();setPage('home');notify(`${byId[id].name}が仲間になった！`)}
function home(){if(!state.starter){return `<div class="eyebrow">KANTO REGION · ROUTE 01</div><h1 class="page-title">最初のパートナーを選ぼう</h1><p class="sub">1匹を操作して自動攻撃。勉強で新しいポケモンを集め、3匹を戦闘中に交代しよう。</p><div class="grid">${[1,4,7].map(n=>{let s=species[n-1];return `<div class="tile" style="text-align:center">${spriteTag(s.id,'sprite')}<h3>${s.name}</h3><p>${typeOf(s)[0]}タイプ / 最初の仲間</p>${button('このポケモンで始める','starter:'+s.id,'btn wide')}</div>`}).join('')}</div><p class="data-note">※非公式ファン制作の学習用プロトタイプ。ポケモンの画像は外部スプライト参照。取得できない場合は独自の代替画像が表示されます。</p>`}
let line=state.team.map(id=>spriteTag(id)).join('');return `<section class="hero"><div class="hero-copy"><div class="eyebrow">POKÉ SURVIVAL × STUDY</div><h1>知識で仲間を集め<br><b>群れを突破せよ。</b></h1><p>勉強5問でガチャ1回。初代151匹を集めて3匹編成し、見下ろし型のサバイバルバトルへ出撃。</p><div class="row">${button('⚔ 今すぐ冒険へ','go:battle','btn gold')}${button('✎ 勉強してガチャ獲得','go:study','btn secondary')}</div></div><div class="hero-art"><div class="hero-team">${line}</div><div class="hero-caption">KANTO PARTNER TEAM <span>● ● ●</span></div></div></section><div class="stats"><div class="stat"><small>ポケモン図鑑</small><b>${Object.keys(state.owned).filter(k=>state.owned[k]>0).length} / 151</b></div><div class="stat"><small>勉強の正解数</small><b>${state.correct}</b></div><div class="stat"><small>ステージ攻略</small><b>${state.clears}</b></div></div><div class="section-head section"><h2>冒険を進める</h2><span class="eyebrow">GAME LOOP</span></div><div class="grid"><div class="tile"><div class="tile-icon">✎</div><h3>STUDY</h3><p>正解を積み重ねてガチャ権を獲得。苦手問題を克服しよう。</p>${button('問題を解く','go:study','btn secondary wide')}</div><div class="tile"><div class="tile-icon">◈</div><h3>MONSTER GACHA</h3><p>初代151匹から1回につき1匹召喚。レア保証なし。</p>${button('ガチャを引く','go:pack','btn secondary wide')}</div><div class="tile"><div class="tile-icon">⚔</div><h3>SURVIVAL</h3><p>3匹で群れを突破し、経験値と進化を駆使してボスを倒そう。</p>${button('エリア選択','go:battle','btn secondary wide')}</div></div>`}
function normalQ(q,i){if(!q||!q.question)return null;let choices=q.choices;if(typeof choices==='string'){try{choices=JSON.parse(choices)}catch{choices=choices.split('|').map(x=>x.trim())}}if(!Array.isArray(choices)||choices.length<2)return null;let correct=q.correct??q.answer??0;if(typeof correct==='string'&&/^\d+$/.test(correct.trim()))correct=Number(correct);else if(typeof correct==='string')correct=choices.indexOf(correct);if(!Number.isInteger(correct)||correct<0||correct>=choices.length)return null;return {id:String(q.id||`import-${i}-${q.question.slice(0,12)}`),question:String(q.question),choices:choices.map(String),correct,explanation:String(q.explanation||''),subject:String(q.subject||'追加問題'),year:q.year||'',difficulty:q.difficulty||1}}
function nextQuestion(){let list=studyFilter==='review'?questions.filter(q=>state.reviews.includes(q.id)):questions;if(!list.length)list=questions;const weights=list.map(q=>state.reviews.includes(q.id)?6:!state.history[q.id]?5:1);let total=weights.reduce((a,b)=>a+b,0),r=Math.random()*total,idx=0;while(idx<list.length-1&&(r-=weights[idx])>=0)idx++;if(list.length>1&&currentQ?.id===list[idx].id)idx=(idx+1)%list.length;currentQ=list[idx];answered=false;selectedAnswer=-1;answerGood=false}
function study(){if(!currentQ)nextQuestion();let q=currentQ;const ans=currentQ.choices.map((c,i)=>`<button class="choice ${answered?(i===q.correct?'correct':i===selectedAnswer?'wrong':''):''}" data-act="answer:${i}" ${answered?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${escapeHTML(c)}</button>`).join('');return `${heading('KNOWLEDGE ENGINE','勉強でガチャを引こう','5問正解でガチャ1回。正答・復習は自動保存されます。')}<div class="cols"><div class="panel"><div class="row spread"><span class="kicker">${escapeHTML(q.subject)} / ${escapeHTML(q.year||'学習')}</span><span class="pill">COMBO ×${state.combo}</span></div><div class="question">${escapeHTML(q.question)}</div><div class="choices">${ans}</div>${answered?`<div class="feedback"><b style="color:${answerGood?'var(--jade)':'var(--rose)'}">${answerGood?'正解！':'不正解・復習に登録'}</b><div>${escapeHTML(q.explanation)}</div></div>${button('次の問題 →','nextQuestion','btn wide')}`:''}</div><aside class="panel"><div class="eyebrow">GACHA PROGRESS</div><h2>あと ${5-state.credit} 問でガチャ1回</h2><div class="bar"><span style="width:${state.credit*20}%"></span></div><p class="sub">正解：${state.correct} / 回答：${state.studied}<br>復習問題：${state.reviews.length}問</p><div class="row">${button('すべての問題','studyAll',`btn tiny ${studyFilter==='all'?'':'secondary'}`)}${button('復習優先','studyReview',`btn tiny ${studyFilter==='review'?'':'secondary'}`)}</div><hr style="border:0;border-top:1px solid var(--line);margin:20px 0"><h3>問題バンク追加</h3><p class="sub">CSV/JSONから自分の問題を追加できます。列：question,choices,correct,explanation,subject,year,difficulty</p><input id="questionFile" class="upload" type="file" accept=".csv,.json,text/csv,application/json"><p class="data-note">端末内のブラウザに保存されます。</p></aside></div>`}
function answer(i){if(answered||!currentQ)return;answered=true;selectedAnswer=i;answerGood=i===currentQ.correct;state.studied++;let h=state.history[currentQ.id]||{seen:0,correct:0};h.seen++;if(answerGood){h.correct++;state.correct++;state.combo++;state.best=Math.max(state.combo,state.best);state.credit++;if(state.reviews.includes(currentQ.id))state.reviews=state.reviews.filter(id=>id!==currentQ.id);if(state.credit>=5){state.credit-=5;state.tickets++;notify('◈ GACHA TICKET +1！')}else notify(`正解！ あと${5-state.credit}問でガチャ`);}else{state.combo=0;if(!state.reviews.includes(currentQ.id))state.reviews.push(currentQ.id);}state.history[currentQ.id]=h;save();render()}
function parseCSV(s){let rows=[],row=[],cur='',quote=false;for(let i=0;i<s.length;i++){let c=s[i];if(c==='"'){if(quote&&s[i+1]==='"'){cur+='"';i++}else quote=!quote}else if(c===','&&!quote){row.push(cur);cur=''}else if((c==='\n'||c==='\r')&&!quote){if(c==='\r'&&s[i+1]==='\n')i++;row.push(cur);if(row.some(v=>v.trim()))rows.push(row);row=[];cur=''}else cur+=c;}row.push(cur);if(row.some(v=>v.trim()))rows.push(row);let cols=rows.shift()?.map(x=>x.trim().toLowerCase())||[];return rows.map(r=>Object.fromEntries(cols.map((k,i)=>[k,r[i]||''])))}
async function questionImport(file){try{let s=await file.text(),raw=file.name.toLowerCase().endsWith('.json')?JSON.parse(s):parseCSV(s);if(!Array.isArray(raw))raw=raw.questions||[];let newQ=raw.map(normalQ).filter(Boolean);if(!newQ.length)throw new Error('有効な問題がありません');let seen=new Set(questions.map(q=>q.id));let n=0;for(const q of newQ){if(seen.has(q.id))continue;seen.add(q.id);questions.push(q);state.questionAdditions.push(q);n++}save();notify(`${n}問を追加しました`);nextQuestion();render()}catch(e){notify('問題を読み込めません：'+e.message)}}
const DROPS=[['N',72],['U',20],['R',6],['SR',1.6],['LG',.4]];
function roll(){let v=Math.random()*100;for(const [r,p] of DROPS){v-=p;if(v<0)return r;}return 'N';}
// One ticket = one Pokémon. Pity counters are counted per pull, not per card.
function drawGacha(){
 const pity=state.pity||(state.pity={r:0,sr:0,lg:0});
 pity.r++;pity.sr++;pity.lg++;
 let rarity=roll();
 if(pity.lg>=100)rarity='LG';
 else if(pity.sr>=30&&!['SR','LG'].includes(rarity))rarity='SR';
 else if(pity.r>=10&&!['R','SR','LG'].includes(rarity))rarity='R';
 const pool=species.filter(s=>s.rarity===rarity);
 const chosen=pick(pool.length?pool:species);
 if(['R','SR','LG'].includes(chosen.rarity))pity.r=0;
 if(['SR','LG'].includes(chosen.rarity))pity.sr=0;
 if(chosen.rarity==='LG')pity.lg=0;
 return chosen;
}
function pullGacha(){
 if(!state.starter)return notify('まず最初の仲間を選ぼう');
 if(state.tickets<=0)return notify('ガチャ券が足りません');
 state.tickets--;
 gachaResult=drawGacha();
 state.packsOpened++;
 state.owned[gachaResult.id]=(state.owned[gachaResult.id]||0)+1;
 save();setPage('pack');
 notify(gachaResult.rarity==='LG'?'✦ LEGEND！ 伝説の仲間を獲得！':'新しい仲間を1匹獲得！');
}
function pack(){
 const pity=state.pity;
 return `${heading('MONSTER SUMMON / KANTO','ポケモンガチャ','5問正解で1回。1回につき仲間が1匹登場。レア保証なし。')}
 <div class="gacha-banner"><div class="gacha-copy"><span class="eyebrow">KANTO GENERATION 01</span><h2 class="page-title">151 SUMMON</h2><p>初代151匹の中から1匹を召喚！<br>仲間が増えるほど編成の幅が広がる。</p><div class="row">${button('✦ ガチャを1回引く','pullGacha','btn gold',state.tickets<1?'disabled':'')}<span class="pill">ガチャ券 ${state.tickets} 枚</span></div></div><div class="gacha-machine" aria-hidden="true"><span class="gacha-orbit orbit-a"></span><span class="gacha-orbit orbit-b"></span><span class="gacha-core">◈</span><span class="gacha-spark sp-a">✦</span><span class="gacha-spark sp-b">✧</span></div></div>
 ${gachaResult?`<section class="section summon-result rarity-${gachaResult.rarity}"><div class="eyebrow">SUMMON RESULT · 1 MONSTER</div><div class="summon-reveal"><div class="reveal-halo"></div>${spriteTag(gachaResult.id,'summon-sprite')}<div class="summon-description"><div class="eyebrow">#${String(gachaResult.dex).padStart(3,'0')} · ${typeOf(gachaResult)[0]}タイプ</div><h2>${escapeHTML(gachaResult.name)}</h2><strong class="summon-rank">${rankName(gachaResult.rarity)}</strong><p>所持 ${state.owned[gachaResult.id]}匹</p>${button('編成する','go:team','btn secondary')}</div></div></section>`:''}
 <div class="panel section"><h3>ガチャ排出率</h3><p class="sub">N 72% / U 20% / R 6% / SR 1.6% / LG 0.4%。レア確定枠はありません。</p><p class="data-note">救済：10回以内にR以上、30回以内にSR以上、100回以内にLG。ガチャ回数 ${state.packsOpened} 回 / カウンター：R ${pity.r}/10、SR ${pity.sr}/30、LG ${pity.lg}/100</p></div>`;
}
function rankColor(r){return {N:'#b8c8b8',U:'#7fd9e1',R:'#82aeff',SR:'#d19eff',LG:'#ffe19b'}[r]}
function team(){if(!state.starter)return home();let owned=species.filter(s=>state.owned[s.id]);return `${heading('MONSTER MANAGEMENT','チーム編成','戦うのは1匹だけ。3匹を編成し、バトル中に好きなタイミングで交代できます。')}<div class="panel"><h2>出撃チーム <small class="sub">(${state.team.length}/3)</small></h2><div class="team-slots">${[0,1,2].map(i=>{let id=state.team[i],s=byId[id];return `<button class="slot" data-act="pickSlot:${i}">${s?`${spriteTag(id)}<strong>${s.name}</strong><small>育成 LV ${state.training[id]||1} / ${typeOf(s)[0]}</small>`:`<strong>＋</strong><small>仲間を選択</small>`}</button>`}).join('')}</div><p class="data-note">最初の1匹を操作。控えの2匹は攻撃せずHPを温存します。バトル中の交代で相性を活かそう。</p></div><div class="section-head section"><h2>所持ポケモン (${owned.length})</h2><span class="eyebrow">TAP TO SELECT</span></div><div class="pokemon-grid">${owned.sort((a,b)=>a.dex-b.dex).map(s=>monCard(s,true)).join('')}</div>`}
function monCard(s,ownedOnly=false){let has=state.owned[s.id]||0,sel=state.team.includes(s.id);return `<button class="mon-card ${has?'':'missing'} ${sel?'selected':''}" data-act="mon:${s.id}" ${!has?'disabled':''}><span class="rank" style="border-color:${rankColor(s.rarity)};color:${rankColor(s.rarity)}">${s.rarity}</span>${spriteTag(s.id)}<strong>${has?escapeHTML(s.name):'???'}</strong><small>#${String(s.dex).padStart(3,'0')} ${has?`×${has} / Lv${state.training[s.id]||1}`:'未発見'}</small></button>`}
function monDetail(id){let s=byId[id];if(!s||!state.owned[id])return;let lv=state.training[id]||1,cost=lv*18,orig=species.find(t=>t.from===id);modal(`<div class="row" style="gap:18px">${spriteTag(id)}<div><div class="eyebrow">DEX #${String(s.dex).padStart(3,'0')} / ${rankName(s.rarity)}</div><h2>${escapeHTML(s.name)}</h2><p class="sub">${typeOf(s)[0]}タイプ / 育成Lv${lv} / 所持${state.owned[id]}匹</p></div></div><div class="panel"><div class="row spread"><b>基礎HP ${s.hp}</b><b>攻撃 ${s.attack}</b></div><p class="sub">バトルに出るほど活躍。素材を使うと出撃時の火力が上がります。</p>${orig?`<p class="sub">進化先：${orig.name}（戦闘中にレベルアップして進化）</p>`:''}</div><div class="row section">${button(`✧ ${cost} で育成Lv+1`,'train:'+id,'btn gold',state.dust<cost?'disabled':'')}${button(state.team.includes(id)?'編成中':'チームに入れる','addTeam:'+id,'btn secondary')}</div>${button('閉じる','closeModal','btn secondary wide')}`)}
function dex(){const filtered=species.filter(s=>dexFilter==='all'||dexFilter==='owned'&&state.owned[s.id]||s.type===dexFilter),count=Math.ceil(filtered.length/36);dexPage=clamp(dexPage,0,Math.max(0,count-1));const list=filtered.slice(dexPage*36,dexPage*36+36);let have=species.filter(s=>state.owned[s.id]).length;return `${heading('KANTO POKEDEX','初代151匹図鑑','未発見はシルエット表示。集めた仲間で自分だけのチームを作ろう。')}<div class="panel"><div class="row spread"><div><div class="eyebrow">DISCOVERED</div><h2 style="font-size:31px;margin:3px 0">${have} <small style="color:var(--muted)">/ 151</small></h2></div><div class="pill">${Math.round(have/151*100)}% COMPLETE</div></div><div class="bar"><span style="width:${have/151*100}%"></span></div><div class="controls">${[['all','すべて'],['owned','所持'],...Object.entries(TYPES).map(([k,v])=>[k,v[0]])].map(([k,v])=>`<button class="control ${dexFilter===k?'active':''}" data-act="dexFilter:${k}">${v}</button>`).join('')}</div><div class="pokemon-grid">${list.map(s=>monCard(s)).join('')}</div><div class="row spread section">${button('← 前へ','dexPrev','btn secondary tiny',dexPage===0?'disabled':'')}<span class="sub">${dexPage+1} / ${Math.max(count,1)}ページ</span>${button('次へ →','dexNext','btn secondary tiny',dexPage>=count-1?'disabled':'')}</div></div><p class="data-note section">非公式・非商用の学習用ファンプロトタイプです。ポケモンの名称は各権利者の商標です。懐かしいポケモンのゲームスプライトを外部参照し、接続できない場合は独自の仮描画に切り替わります。</p>`}
function battle(){if(game){return `<div class="game-shell"><div class="game-hud"><div><div class="eyebrow">KANTO · ${escapeHTML(STAGES[game.stage].tag)}</div><strong>ポケモン サバイバル</strong> <small>移動：WASD / 方向キー / タッチスライド</small></div>${button(game.paused?'▶ 再開':'Ⅱ 一時停止','pause','btn secondary tiny')}</div><div class="game-canvas-wrap" id="canvasWrap"><canvas id="battleCanvas" class="game-canvas" width="960" height="600" aria-label="サバイバル対戦フィールド"></canvas><div class="game-top"><div><div class="healthline"><span><span id="activeName">ポケモン</span> ♥ <span id="hpText"></span></span><span id="runLevel"></span></div><div class="bar"><span id="hpFill"></span></div><div style="height:6px;background:#345163;margin-top:5px;border-radius:4px;overflow:hidden"><span id="xpFill" style="display:block;width:0;height:100%;background:#e6c77a"></span></div></div><div><span id="runTimer">00:00</span><div style="font-size:10px;color:#a3d0b4">撃破 <span id="runKills">0</span> / WAVE <span id="runWave">1</span></div></div></div><div id="pauseOverlay" class="game-paused" hidden><div class="panel"><h2>PAUSED</h2>${button('▶ 冒険を再開','pause','btn wide')}${button('冒険を終了','leaveRun','btn danger wide','style="margin-top:10px"')}</div></div></div><div class="switch-panel"><div class="switch-heading"><span>手持ちポケモン / 1匹ずつ召喚</span><small id="switchTimer">交代可能</small></div><div class="switch-slots">${game.team.map((a,i)=>`<button class="switch-mon ${i===game.activeIndex?'selected':''}" data-act="swap:${i}" data-switch="${i}" aria-label="${escapeHTML(byId[a.id].name)}に交代"><span class="switch-img">${spriteTag(a.id)}</span><span class="switch-meta"><b>${escapeHTML(byId[a.id].name)}</b><small>${typeOf(byId[a.id])[0]} / ${MOVES[byId[a.id].type]||'たいあたり'}</small><span class="switch-hp-bg"><span class="switch-hp-fill" style="width:${Math.max(0,100*a.hp/a.maxHp)}%"></span></span><small class="switch-hp-text">${hpLabel(a.hp)} / ${a.maxHp}</small></span></button>`).join('')}</div></div><div class="game-bottom"><span id="activeMove">⚔ ${MOVES[byId[activePokemon(game).id].type]}</span><span id="targetTypeHint">敵のタイプを見て交代！</span></div><p class="game-help">手持ちをタップして交代（PCは1〜3キー）。相性が有利な技は1.6倍、不利な技は0.65倍。控えのHPは温存されます。</p></div>`}
return `${heading('SELECT STAGE','サバイバルに出撃','フィールドを自由に移動し、群れを倒してレベルアップ。ボス討伐で次のステージが開放されます。')}<div class="stage-grid">${STAGES.map((st,i)=>`<button class="stage ${i<state.stages?'active':'locked'}" data-act="stage:${i}" ${i>=state.stages?'disabled':''}><span class="eyebrow">STAGE 0${i+1} / ${escapeHTML(st.tag)}</span><b>${i>=state.stages?'🔒 ':''}${escapeHTML(st.name)}</b><small>${escapeHTML(st.desc)}</small></button>`).join('')}</div><div class="panel section"><h2>出撃パーティ</h2><div class="team-slots">${state.team.map(id=>`<div class="slot">${spriteTag(id)}<strong>${byId[id].name}</strong><small>育成 Lv ${state.training[id]||1}</small></div>`).join('')}</div><div class="row section">${button('⚔ 出撃する','beginRun:'+selectedStage,'btn gold')}${button('チーム変更','go:team','btn secondary')}<span class="pill">${STAGES[selectedStage]?.name}</span></div></div>`}
const POKEMON_ASSETS=new Map();
function hydrateSprites(){document.querySelectorAll('img[data-pokemon]').forEach(el=>{let n=Number(el.dataset.pokemon),rec=POKEMON_ASSETS.get(n);if(rec?.ok){el.src=rec.src;return;}if(rec)return;const id='p'+String(n).padStart(3,'0'),src=pokemonSpriteURL(id);if(!src)return;rec={ok:false,src};POKEMON_ASSETS.set(n,rec);const img=new Image();img.onload=()=>{rec.ok=true;document.querySelectorAll('img[data-pokemon="'+n+'"]').forEach(el=>{if(el.isConnected)el.src=src})};img.onerror=()=>{rec.failed=true};img.src=src;})}
function render(){resources();$('main').innerHTML=({home,study,pack,team,battle,dex}[page]||home)();hydrateSprites();if(page==='battle'&&game){attachCanvas();updateHUD();const overlay=$('pauseOverlay');if(overlay)overlay.hidden=!game.paused;}if(page==='study'){let inp=$('questionFile');inp?.addEventListener('change',e=>questionImport(e.target.files[0]),{once:true});}}
// ----- Real-time survivor battle -----
function startRun(stage){if(!state.team.length)return notify('編成から仲間を選択してください');selectedStage=stage;const mobile=matchMedia('(max-width:540px)').matches;game={running:true,paused:false,choosing:false,stage,seconds:0,level:1,xp:0,xpNeed:6,activeIndex:0,switchCooldown:0,lastTypeHint:0,invuln:0,position:{x:0,y:0},vx:0,vy:0,kills:0,spawn:0,boss:false,bossDead:false,boost:{power:1,rate:1,multi:0,speed:1,magnet:1,orbit:0,defense:1},team:state.team.map((id,i)=>({id,x:0,y:0,cd:0.2,idx:i,maxHp:pokemonMaxHP(byId[id],id),hp:pokemonMaxHP(byId[id],id)})),enemies:[],shots:[],drops:[],particles:[],floats:[],bossShots:[],camera:{x:0,y:0},lastFrame:0,autoPaused:false,terrainCache:null,joy:{active:false,id:null,bx:0,by:0,dx:0,dy:0},mobile,w:mobile?720:960,h:mobile?960:600,evolutionMilestones:new Set(),enemyUid:0};page='battle';render();cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)}
function attachCanvas(){const canvas=$('battleCanvas');if(!canvas||!game)return;canvas.width=game.w;canvas.height=game.h;const point=(evt)=>{let b=canvas.getBoundingClientRect();return {x:(evt.clientX-b.left)*canvas.width/b.width,y:(evt.clientY-b.top)*canvas.height/b.height}};canvas.onpointerdown=e=>{if(game.paused)return;let p=point(e);game.joy={active:true,id:e.pointerId,bx:p.x,by:p.y,dx:0,dy:0};try{canvas.setPointerCapture(e.pointerId)}catch(_){/* Some synthetic and legacy touch events lack capture */}};canvas.onpointermove=e=>{if(!game.joy.active||game.joy.id!==e.pointerId)return;let p=point(e),j=game.joy,dx=p.x-j.bx,dy=p.y-j.by,l=Math.hypot(dx,dy),s=Math.min(1,l/74);j.dx=l?dx/l*s:0;j.dy=l?dy/l*s:0};canvas.onpointerup=canvas.onpointercancel=e=>{if(game.joy.id===e.pointerId)game.joy.active=false};}
function frame(t){
 if(!game?.running)return;
 raf=requestAnimationFrame(frame);
 const g=game;
 if(g.lastFrame&&t-g.lastFrame<32)return; // stable ~30fps on mobile / Safari
 const dt=g.lastFrame?Math.min(.05,(t-g.lastFrame)/1000):.033;
 g.lastFrame=t;
 try{
  if(!g.paused&&!g.choosing)update(dt);
  if(game!==g||!g.running)return;
  draw();updateHUD();
 }catch(err){
  console.error('Battle frame error',err);
  g.paused=true;
  const overlay=$('pauseOverlay');if(overlay)overlay.hidden=false;
  notify('描画エラーが発生しました。再開してください。');
 }
}
function direction(){let kx=(keys.has('ArrowRight')||keys.has('d')?1:0)-(keys.has('ArrowLeft')||keys.has('a')?1:0),ky=(keys.has('ArrowDown')||keys.has('s')?1:0)-(keys.has('ArrowUp')||keys.has('w')?1:0);if(!kx&&!ky&&game.joy.active){kx=game.joy.dx;ky=game.joy.dy}let m=Math.hypot(kx,ky);return m>1?[kx/m,ky/m]:[kx,ky]}
function update(dt){const g=game;g.seconds+=dt;g.invuln=Math.max(0,g.invuln-dt);g.switchCooldown=Math.max(0,g.switchCooldown-dt);const [dx,dy]=direction(),spd=175*g.boost.speed;g.position.x+=dx*spd*dt;g.position.y+=dy*spd*dt;g.camera.x=g.position.x;g.camera.y=g.position.y;
// Only the active Pokémon appears and attacks. The other two remain in reserve.
const a=activePokemon(g);if(a&&a.hp>0){a.x=g.position.x;a.y=g.position.y;a.cd-=dt;
 if(a.cd<=0){const nearby=g.enemies.filter(e=>e.hp>0&&Math.hypot(e.x-a.x,e.y-a.y)<455).sort((u,v)=>(u.x-a.x)**2+(u.y-a.y)**2-(v.x-a.x)**2-(v.y-a.y)**2);
 const target=nearby[0];if(target){const s=byId[a.id],base=(s.attack*.33+12)*(1+((state.training[a.id]||1)-1)*.1)*g.boost.power;
 const ang=Math.atan2(target.y-a.y,target.x-a.x),num=1+g.boost.multi;
 for(let h=0;h<num;h++){const theta=ang+(h-(num-1)/2)*.16;g.shots.push({x:a.x,y:a.y,vx:Math.cos(theta)*355,vy:Math.sin(theta)*355,ttl:1.28,damage:base,rad:s.type==='dragon'?10:7,type:s.type,hit:new Set()})}
 a.cd=Math.max(.17,(1.02-(s.stage||0)*.04)*g.boost.rate);
 }}}

g.spawn-=dt;if(g.spawn<=0&&g.enemies.length<105){let count=(g.seconds<4?3:1+Math.floor(g.seconds/23))+g.stage;for(let i=0;i<count;i++)spawnEnemy();g.spawn=Math.max(.27,.92-g.seconds/220)}if(!g.boss&&g.seconds>=66){spawnBoss();g.boss=true;notify('⚠ 大型ボスが出現！')}
for(let e of g.enemies){const d=Math.hypot(g.position.x-e.x,g.position.y-e.y)||1,move=e.boss?26+g.stage*5:Math.min(70,38+g.seconds*.33+g.stage*7);e.x+=(g.position.x-e.x)/d*move*dt;e.y+=(g.position.y-e.y)/d*move*dt;e.anim+=dt;if(d<e.size*.66+19&&g.invuln<=0){takePlayerDamage(e.boss?26:13+g.stage*3,byId[e.id].type);if(!g.running)return}if(e.boss){e.skill-=dt;if(e.skill<=0){for(let j=0;j<9;j++){let theta=j/9*Math.PI*2+g.seconds*.7;g.bossShots.push({x:e.x,y:e.y,vx:Math.cos(theta)*130,vy:Math.sin(theta)*130,ttl:3})}e.skill=3.8}}}
for(let p of g.shots){p.x+=p.vx*dt;p.y+=p.vy*dt;p.ttl-=dt;for(let e of g.enemies){if(p.hit.has(e.uid)||e.hp<=0)continue;if(Math.hypot(e.x-p.x,e.y-p.y)<e.size*.48+p.rad){p.hit.add(e.uid);
 const mult=effectiveness(p.type,byId[e.id].type),damage=Math.max(1,Math.round(p.damage*mult));e.hp-=damage;
 floatText(e.x,e.y-16,(mult>1?'↗':mult<1?'↘':'')+damage,mult>1?'#fff18b':mult<1?'#a7d7e8':'#faf0ad');
 if(mult!==1&&g.seconds>g.lastTypeHint){floatText(e.x,e.y-38,mult>1?'ばつぐん！':'いまひとつ','#f3ebbf');g.lastTypeHint=g.seconds+.85;}
 if(e.hp<=0)killEnemy(e);p.ttl-=.17;break}}}
g.shots=g.shots.filter(x=>x.ttl>0).slice(-220);g.enemies=g.enemies.filter(e=>e.hp>0);for(let p of g.bossShots){p.x+=p.vx*dt;p.y+=p.vy*dt;p.ttl-=dt;if(Math.hypot(p.x-g.position.x,p.y-g.position.y)<21&&g.invuln<=0){takePlayerDamage(17,byId[['p003','p006','p150'][g.stage]].type);p.ttl=0;if(!g.running)return}}g.bossShots=g.bossShots.filter(p=>p.ttl>0);
for(let p of g.drops){let dx=g.position.x-p.x,dy=g.position.y-p.y,d=Math.hypot(dx,dy)||1;if(d<85*g.boost.magnet){p.x+=dx/d*Math.min(d,220*dt);p.y+=dy/d*Math.min(d,220*dt)}if(d<26){g.xp+=p.value;p.dead=true}}g.drops=g.drops.filter(x=>!x.dead).slice(-120);if(g.xp>=g.xpNeed&&!g.choosing){g.xp-=g.xpNeed;g.level++;g.xpNeed=6+g.level*4;levelUp();}
if(g.boost.orbit>0){for(let e of g.enemies){let ang=Math.atan2(e.y-g.position.y,e.x-g.position.x);for(let j=0;j<g.boost.orbit;j++){let theta=g.seconds*(1.9)+j*Math.PI*2/g.boost.orbit,orbX=g.position.x+Math.cos(theta)*78,orbY=g.position.y+Math.sin(theta)*78;if(Math.hypot(e.x-orbX,e.y-orbY)<e.size*.5+12&&Math.random()<dt*6){e.hp-=20*g.boost.power*effectiveness(byId[activePokemon(g).id].type,byId[e.id].type);if(e.hp<=0)killEnemy(e)}}}}
for(let a of g.particles){a.x+=a.vx*dt;a.y+=a.vy*dt;a.ttl-=dt}g.particles=g.particles.filter(x=>x.ttl>0).slice(-110);for(let x of g.floats){x.y-=25*dt;x.ttl-=dt}g.floats=g.floats.filter(x=>x.ttl>0).slice(-70);if(g.bossDead){finishRun(true)}}
function spawnEnemy(){let g=game,angle=rnd(0,Math.PI*2),range=rnd(220,315),pool=g.stage===0?[10,13,16,19,21,29,41,43,46,48]:g.stage===1?[4,5,37,58,66,74,77,95,109]:[63,92,93,94,96,100,123,124,125,142],id='p'+String(pick(pool)).padStart(3,'0'),s=byId[id],size=57+(s.stage||0)*9;g.enemies.push({uid:++g.enemyUid,id,x:g.position.x+Math.cos(angle)*range,y:g.position.y+Math.sin(angle)*range,hp:(25+g.seconds*.5+g.stage*19)*(s.rarity==='R'?1.4:1),maxHp:100,size,boss:false,anim:rnd(0,10)})}
function spawnBoss(){let g=game,id=['p003','p006','p150'][g.stage],hp=1100+g.stage*690;g.enemies.push({uid:++g.enemyUid,id,x:g.position.x+350,y:g.position.y-150,hp,maxHp:hp,size:148,boss:true,anim:0,skill:2})}
function killEnemy(e){if(e.dead)return;e.dead=true;e.hp=0;game.kills++;if(e.boss)game.bossDead=true;game.drops.push({x:e.x,y:e.y,value:e.boss?18:1+(e.size>50?1:0)});for(let i=0;i<4;i++)game.particles.push({x:e.x,y:e.y,vx:rnd(-90,90),vy:rnd(-90,90),ttl:rnd(.3,.7),color:typeOf(byId[e.id])[1]});}
function floatText(x,y,t,color){game.floats.push({x,y,txt:String(t),ttl:.55,color})}
function levelUp(){let g=game;g.choosing=true;g.paused=true;let available=[...UPGRADES].sort(()=>Math.random()-.5).slice(0,3);modal(`<div class="eyebrow">LEVEL UP / ${g.level}</div><h2>新しい力を選択</h2><p class="sub">知識と経験を力に変えて、残りの群れを突破しよう。</p><div class="reward-options">${available.map(x=>`<button class="reward" data-act="upgrade:${x.id}"><span>${x.icon}</span><b>${x.name}</b><small>${x.desc}</small></button>`).join('')}</div><p class="data-note">1つ選ぶとすぐに戦闘を再開します。</p>`)}
function evolveInRun(){let g=game;if(!g||!g.running)return;
 const a=activePokemon(g);if(!a)return;const origin=byId[a.id],next=species.find(x=>x.from===origin.id);
 if(next&&(origin.stage===0?g.level>=6:g.level>=12)&&!g.evolutionMilestones.has(a.idx+':'+a.id)){
  g.evolutionMilestones.add(a.idx+':'+a.id);
  const fraction=a.maxHp>0?a.hp/a.maxHp:1;a.id=next.id;a.maxHp=pokemonMaxHP(next,next.id,g.boost.hpBonus||0);a.hp=Math.max(1,Math.round(a.maxHp*fraction));
  state.owned[next.id]=(state.owned[next.id]||0)+1;state.training[next.id]=Math.max(state.training[next.id]||1,Math.floor((state.training[origin.id]||1)*.7));
  save();notify(origin.name+' → '+next.name+' に進化！');updateHUD();
 }}
function chooseUpgrade(id){if(!game?.choosing)return;let g=game;switch(id){case 'power':g.boost.power*=1.25;break;case 'rate':g.boost.rate*=.83;break;case 'multi':g.boost.multi=Math.min(4,g.boost.multi+1);break;case 'speed':g.boost.speed*=1.14;break;case 'hp':g.boost.hpBonus=(g.boost.hpBonus||0)+35;for(const p of g.team){p.maxHp+=35;if(p.hp>0)p.hp+=35;}break;case 'magnet':g.boost.magnet*=1.48;break;case 'orbit':g.boost.orbit=Math.min(5,g.boost.orbit+1);break;case 'defense':g.boost.defense*=.87;break;case 'heal':{const p=activePokemon(g);if(p)p.hp=Math.min(p.maxHp,p.hp+70);break;}}g.choosing=false;g.paused=false;$('modal').hidden=true;evolveInRun();updateHUD()}
function gamePause(){if(!game)return; if(game.choosing)return;game.paused=!game.paused;game.autoPaused=false;game.lastFrame=0;let pause=$('pauseOverlay');if(pause)pause.hidden=!game.paused;let b=document.querySelector('[data-act="pause"]');if(b)b.textContent=game.paused?'▶ 再開':'Ⅱ 一時停止'}
function finishRun(win,abandon=false){if(!game)return;let g=game;if(!g.running)return;g.running=false;g.paused=true;cancelAnimationFrame(raf);keys.clear();let gain=abandon?0:Math.floor(g.kills/7)+(win?80:12),ticket=win?1:0;if(!abandon){state.dust+=gain;state.tickets+=ticket;if(win){state.clears++;state.stages=Math.max(state.stages,Math.min(3,g.stage+2));}save()}modal(`<div style="text-align:center"><div class="result-stars">${win?'✦ ✦ ✦':abandon?'◇':'✧'}</div><div class="eyebrow">${win?'STAGE CLEAR':abandon?'RETREAT':'GAME OVER'}</div><h2>${win?'ボス撃破！':abandon?'探索を終了':'冒険はここまで'}</h2><div class="stats"><div class="stat"><small>撃破数</small><b>${g.kills}</b></div><div class="stat"><small>ランク</small><b>${g.level}</b></div><div class="stat"><small>素材</small><b>+${gain}</b></div></div><p class="sub">${win?'✦ ガチャ券 +1 / 次のステージを開放！':'チームを育成して、また挑戦しよう。'}</p>${button('冒険メニューへ','endResult','btn gold wide')}</div>`)}
function draw(){let g=game,canvas=$('battleCanvas');if(!canvas)return;let c=canvas.getContext('2d',{alpha:false});c.imageSmoothingEnabled=false;let w=g.w,h=g.h,ox=w/2-g.camera.x,oy=h/2-g.camera.y;drawCachedTerrain(c,g,ox,oy);function screen(x,y){return {x:x+ox,y:y+oy}}
// XP crystals, then enemies, allies, abilities on top
for(let gem of g.drops){let p=screen(gem.x,gem.y);c.fillStyle='#36c0ff';c.beginPath();c.moveTo(p.x,p.y-7);c.lineTo(p.x+5,p.y);c.lineTo(p.x,p.y+7);c.lineTo(p.x-5,p.y);c.fill();c.fillStyle='#d4f8ff';c.fillRect(p.x-1,p.y-4,2,4)}
for(let e of g.enemies){let p=screen(e.x,e.y);if(p.x<-140||p.x>w+140||p.y<-140||p.y>h+140)continue;let sz=e.size,cx=p.x-sz/2,cy=p.y-sz/2+Math.sin(e.anim*4)*2;c.fillStyle='#09261988';c.beginPath();c.ellipse(p.x,p.y+sz*.35,sz*.4,sz*.11,0,0,Math.PI*2);c.fill();{let img=getSprite(e.id);if(img.complete&&img.naturalWidth)c.drawImage(img,cx,cy,sz,sz);}if(e.boss){c.fillStyle='#080f15bb';c.fillRect(p.x-64,p.y-77,128,11);c.fillStyle='#ff6583';c.fillRect(p.x-62,p.y-75,124*Math.max(0,e.hp/e.maxHp),7);c.fillStyle='#ffdfa4';c.font='bold 13px system-ui';c.textAlign='center';c.fillText('BOSS',p.x,p.y-83)}}
for(let shot of g.shots){let p=screen(shot.x,shot.y);drawTechnique(c,p.x,p.y,shot)}
for(let shot of g.bossShots){let p=screen(shot.x,shot.y);drawTechnique(c,p.x,p.y,{type:'psychic',rad:11,vx:shot.vx,vy:shot.vy})}
{const a=activePokemon(g),p=screen(g.position.x,g.position.y),sz=99;
 c.fillStyle='#061b18aa';c.beginPath();c.ellipse(p.x,p.y+sz*.3,sz*.32,sz*.11,0,0,7);c.fill();
 c.strokeStyle=typeOf(byId[a.id])[1];c.lineWidth=3;c.beginPath();c.arc(p.x,p.y+12,46,0,7);c.stroke();
 c.save();if(g.invuln>0)c.globalAlpha=.6+Math.sin(g.seconds*35)*.28;
 const img=getSprite(a.id);if(img.complete&&img.naturalWidth)c.drawImage(img,p.x-sz/2,p.y-sz/2,sz,sz);c.restore();
 c.fillStyle='#f6fff8';c.font='bold 14px system-ui';c.textAlign='center';c.fillText(byId[a.id].name,p.x,p.y-sz*.57);
}
for(let k=0;k<g.boost.orbit;k++){let a=g.seconds*1.9+k*Math.PI*2/g.boost.orbit,p=screen(g.position.x+Math.cos(a)*78,g.position.y+Math.sin(a)*78);c.fillStyle='#f9d26c';c.beginPath();c.arc(p.x,p.y,13,0,7);c.fill();c.fillStyle='#fff4bc';c.fillRect(p.x-3,p.y-3,6,6)}
for(let p of g.particles){let q=screen(p.x,p.y);c.globalAlpha=Math.min(1,p.ttl*2);c.fillStyle=p.color;c.fillRect(q.x,q.y,5,5)}c.globalAlpha=1;for(let f of g.floats){let p=screen(f.x,f.y);c.globalAlpha=Math.min(1,f.ttl*2);c.font='bold 16px system-ui';c.lineWidth=3;c.strokeStyle='#18322e';c.textAlign='center';c.strokeText(f.txt,p.x,p.y);c.fillStyle=f.color;c.fillText(f.txt,p.x,p.y)}c.globalAlpha=1;
if(g.joy.active){let j=g.joy;c.strokeStyle='#ddfffaaa';c.lineWidth=4;c.fillStyle='#071b1e77';c.beginPath();c.arc(j.bx,j.by,70,0,7);c.fill();c.stroke();c.fillStyle='#8eeec7bb';c.beginPath();c.arc(j.bx+j.dx*52,j.by+j.dy*52,27,0,7);c.fill()}}
function drawTechnique(c,x,y,p){const t=p.type||'normal',color=TYPES[t]?.[1]||'#fff';c.save();c.translate(Math.round(x),Math.round(y));c.rotate(Math.atan2(p.vy||0,p.vx||1));c.shadowColor=color;c.shadowBlur=7;c.lineWidth=3;c.strokeStyle='#244557';c.fillStyle=color;
if(t==='grass'){c.beginPath();c.ellipse(0,0,13,6,-.3,0,Math.PI*2);c.fill();c.strokeStyle='#e8ffc8';c.lineWidth=2;c.beginPath();c.moveTo(-9,3);c.lineTo(11,-3);c.stroke();}
else if(t==='fire'||t==='dragon'){c.fillStyle=t==='dragon'?'#f7a3ed':'#f16838';c.beginPath();c.moveTo(16,0);c.lineTo(-5,-11);c.lineTo(-1,-3);c.lineTo(-15,-7);c.lineTo(-12,6);c.lineTo(-3,9);c.closePath();c.fill();c.fillStyle='#ffe58b';c.fillRect(-3,-3,10,6);}
else if(t==='water'){c.fillStyle='#52c5fa';c.beginPath();c.moveTo(15,0);c.bezierCurveTo(-5,-16,-11,-9,-11,0);c.bezierCurveTo(-11,11,7,10,15,0);c.fill();c.fillStyle='#f0fffb';c.fillRect(1,-4,5,2);}
else if(t==='lightning'){c.fillStyle='#ffe759';c.beginPath();c.moveTo(-12,-10);c.lineTo(3,-10);c.lineTo(-1,-3);c.lineTo(13,-3);c.lineTo(-4,12);c.lineTo(-1,2);c.lineTo(-12,2);c.closePath();c.fill();}
else if(t==='psychic'||t==='dark'){c.fillStyle=t==='dark'?'#a773cb':'#f7a4e8';c.beginPath();for(let i=0;i<10;i++){let a=i*Math.PI/5-.3,r=i%2?6:13;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath();c.fill();}
else {c.fillRect(-9,-9,18,18);c.fillStyle='#fffbe0';c.fillRect(-4,-4,8,8);}
c.restore()}
const IMG_CACHE=new Map();function getSprite(id){if(IMG_CACHE.has(id))return IMG_CACHE.get(id);const fallback=new Image();fallback.src=spriteURI(id);IMG_CACHE.set(id,fallback);let src=pokemonSpriteURL(id);if(src){let img=new Image();img.decoding='async';img.onload=()=>IMG_CACHE.set(id,img);img.src=src;}return fallback}
function drawTerrain(c,g,ox,oy){const w=g.w,h=g.h,sz=48,st=g.stage;let palettes=[['#82bb66','#78b15c','#eacb8c','#b49465','#277d55','#3d965c','#b8dd81'],['#e2a56b','#d99458','#c48d64','#916349','#7c7c69','#a89a75','#e8c28c'],['#6b9b9c','#628d93','#aba8a0','#8b8b85','#356574','#598390','#b4d1c5']];const [base,alt,path,dark,bush,leaf,bright]=palettes[st];c.fillStyle=base;c.fillRect(0,0,w,h);const left=Math.floor(-ox/sz)-1,right=Math.ceil((w-ox)/sz)+1,top=Math.floor(-oy/sz)-1,bottom=Math.ceil((h-oy)/sz)+1;
function pixel(x,y,c0,dx,dy,ww,hh){c.fillStyle=c0;c.fillRect(Math.round(x+dx),Math.round(y+dy),ww,hh)}
for(let ty=top;ty<=bottom;ty++)for(let tx=left;tx<=right;tx++){
 const x=tx*sz+ox,y=ty*sz+oy,wx=tx*sz+24,wy=ty*sz+24,v=seedHash((tx*73856093)^(ty*19349663)^((st+1)*503));
 const route=st===0?Math.abs(wy-Math.sin(wx/310)*95)<46:st===1?Math.abs(wy-Math.cos(wx/275)*84)<54:Math.abs(wy-Math.sin(wx/290)*78)<66;
 c.fillStyle=route?path:v%6<3?base:alt;c.fillRect(Math.round(x),Math.round(y),sz+1,sz+1);
 if(route){if(v%4===0){pixel(x,y,dark,v%35+5,v%28+10,4,2);pixel(x,y,bright,(v>>>4)%33+4,(v>>>6)%32+5,7,2)}if(st===2){pixel(x,y,'#657f82',0,0,48,2);pixel(x,y,'#557378',0,0,2,48);if(v%3===0)pixel(x,y,'#e8dbbd',26,24,8,3)}continue;}
 // Gen III/IV-inspired natural field tiles; never sample/copy a game map.
 if(st===0){const moss=v%7;
 if(moss===0||moss===1){for(let k=0;k<3;k++){const ax=8+((v>>>(k*5))%29),ay=8+((v>>>(k*4+1))%26);pixel(x,y,'#4d9953',ax,ay,3,8);pixel(x,y,'#a5d877',ax-4,ay+3,10,3);pixel(x,y,'#358753',ax+4,ay+1,3,7)}}
 else if(moss===2){pixel(x,y,'#5c9f50',18,17,4,11);pixel(x,y,'#a8df80',13,21,14,3);pixel(x,y,'#35824a',25,19,3,7)}
 else if(moss===3){const flower=(v%2)?'#ffed91':'#f5abcc';pixel(x,y,'#4c8b54',24,20,2,9);pixel(x,y,flower,20,15,10,7);pixel(x,y,'#fdf4c0',24,17,3,3)}
 else {pixel(x,y,'#94c570',9,35,5,2);pixel(x,y,'#488f56',32,8,4,2)}
 }else if(st===1){if(v%3===0){pixel(x,y,'#7e6853',10,18,20,13);pixel(x,y,'#c2a087',10,17,12,4);pixel(x,y,'#ae8266',25,25,6,4)}if(v%4===0){pixel(x,y,'#cf6647',8,8,6,3);pixel(x,y,'#f5d28b',9,5,3,4)}}
 else {if(v%3===0){pixel(x,y,'#2e6472',13,6,22,26);pixel(x,y,'#659497',10,10,24,18);pixel(x,y,'#b1d4c7',13,11,8,4)}if(v%5===0)pixel(x,y,'#a9d3cc',36,35,7,3)}
 // Bushes, miniature trees and boulders anchored in map space.
 if(v%31===0){const bx=8,by=5;pixel(x,y,'#1a634e',bx+4,by+8,30,28);pixel(x,y,bush,bx+2,by+2,30,29);pixel(x,y,leaf,bx+6,by+4,21,9);pixel(x,y,bright,bx+5,by+12,8,4);pixel(x,y,'#205b48',bx+24,by+17,7,9);pixel(x,y,'#29594a',bx+14,by+30,7,8)}
 else if(v%37===0){pixel(x,y,'#72887b',12,18,25,20);pixel(x,y,'#b5c1a6',12,18,15,5);pixel(x,y,'#536c66',29,29,7,6)}
}}

// Cache the pixel-art ground as an overscanned bitmap; recompute only after moving ~1 tile.
function drawCachedTerrain(context,g,ox,oy){
 const pad=96;
 let cache=g.terrainCache;
 if(!cache||Math.abs(ox-cache.ox)>64||Math.abs(oy-cache.oy)>64){
  const canvas=document.createElement('canvas');canvas.width=g.w+pad*2;canvas.height=g.h+pad*2;
  const ctx=canvas.getContext('2d',{alpha:false});
  drawTerrain(ctx,{w:canvas.width,h:canvas.height,stage:g.stage},ox+pad,oy+pad);
  cache={canvas,ox,oy};g.terrainCache=cache;
 }
 context.drawImage(cache.canvas,Math.round(ox-cache.ox)-pad,Math.round(oy-cache.oy)-pad);
}
function updateHUD(){if(!game)return;const g=game,a=activePokemon(g);if(!a)return;
 const el=(id,t)=>{let n=$(id);if(n&&n.textContent!==String(t))n.textContent=t};
 el('activeName',byId[a.id].name);el('hpText',hpLabel(a.hp)+'/'+a.maxHp);el('runLevel','LV '+g.level);
 el('runTimer',String(Math.floor(g.seconds/60)).padStart(2,'0')+':'+String(Math.floor(g.seconds%60)).padStart(2,'0'));
 el('runKills',g.kills);el('runWave',Math.min(4,1+Math.floor(g.seconds/22)));
 const hp=$('hpFill'),xp=$('xpFill');if(hp)hp.style.width=Math.max(0,a.hp/a.maxHp*100)+'%';if(xp)xp.style.width=Math.min(100,g.xp/g.xpNeed*100)+'%';
 el('switchTimer',g.switchCooldown>.05?'交代まで '+g.switchCooldown.toFixed(1)+'秒':'交代可能');
 el('activeMove','⚔ '+MOVES[byId[a.id].type]);
 const nearest=g.enemies.reduce((best,e)=>{const d=(e.x-g.position.x)**2+(e.y-g.position.y)**2;return d<best.d?{d,e}:best},{d:Infinity,e:null}).e;
 if(nearest){const target=byId[nearest.id],multi=effectiveness(byId[a.id].type,target.type);
 el('targetTypeHint',typeOf(target)[0]+'タイプの敵　'+(multi>1?'◎ ばつぐん':multi<1?'△ いまひとつ':'○ ふつう'));}
 else el('targetTypeHint','敵のタイプを見て交代！');
 document.querySelectorAll('[data-switch]').forEach(btn=>{
  const index=Number(btn.dataset.switch),mon=g.team[index],selected=index===g.activeIndex;
  btn.classList.toggle('selected',selected);btn.classList.toggle('fainted',mon.hp<=0);
  btn.disabled=selected||mon.hp<=0||g.paused||g.choosing||g.switchCooldown>.05||!g.running;
  const fill=btn.querySelector('.switch-hp-fill');if(fill)fill.style.width=Math.max(0,mon.hp/mon.maxHp*100)+'%';
  const txt=btn.querySelector('.switch-hp-text');if(txt)txt.textContent=hpLabel(mon.hp)+' / '+mon.maxHp;
  const label=btn.querySelector('.switch-meta b');if(label&&label.textContent!==byId[mon.id].name){label.textContent=byId[mon.id].name;const img=btn.querySelector('img[data-pokemon]');if(img){img.dataset.pokemon=String(byId[mon.id].dex);img.src=spriteURI(mon.id);hydrateSprites();}}
 });
}
function selectTeam(id,slot){if(!state.owned[id])return;let old=state.team.indexOf(id);if(old>=0){if(slot===undefined){notify('すでに編成しています');return;}state.team.splice(old,1)}let i=slot===undefined?state.team.length:Math.min(slot,state.team.length);if(i>=3)return notify('チームは3匹までです。入れ替える枠をタップしてください');if(slot!==undefined&&state.team[i])state.team.splice(i,1,id);else state.team.splice(i,0,id);state.team=state.team.slice(0,3);save();render();notify('パーティを更新しました')}
function onAction(act){let [cmd,...args]=act.split(':'),param=args.join(':');if(cmd==='go'){setPage(param);return}if(cmd==='starter')return beginStarter(param);if(cmd==='answer')return answer(+param);if(cmd==='nextQuestion'){nextQuestion();render();return}if(cmd==='studyAll'||cmd==='studyReview'){studyFilter=cmd==='studyAll'?'all':'review';nextQuestion();render();return}if(cmd==='pullGacha')return pullGacha();if(cmd==='stage'){selectedStage=+param;render();return}if(cmd==='beginRun')return startRun(+param);if(cmd==='pickSlot'){teamPick=+param;modal(`<h2>枠 ${teamPick+1} の仲間を選択</h2><div class="pokemon-grid">${species.filter(s=>state.owned[s.id]).map(s=>`<button class="mon-card" data-act="assign:${s.id}">${spriteTag(s.id)}<strong>${s.name}</strong></button>`).join('')}</div>${button('閉じる','closeModal','btn secondary wide')}`);return}if(cmd==='assign'){selectTeam(param,teamPick);$('modal').hidden=true;return}if(cmd==='mon'){monDetail(param);return}if(cmd==='addTeam'){selectTeam(param,undefined);$('modal').hidden=true;return}if(cmd==='train'){let n=state.training[param]||1,cost=n*18;if(state.dust<cost)return;state.dust-=cost;state.training[param]=n+1;save();monDetail(param);render();return}if(cmd==='dexFilter'){dexFilter=param;dexPage=0;render();return}if(cmd==='dexPrev'){dexPage--;render();return}if(cmd==='dexNext'){dexPage++;render();return}if(cmd==='swap'){switchPokemon(Number(param));return}if(cmd==='pause'){gamePause();return}if(cmd==='upgrade'){chooseUpgrade(param);return}if(cmd==='leaveRun'){finishRun(false,true);return}if(cmd==='endResult'){$('modal').hidden=true;game=null;setPage('battle');return}if(cmd==='closeModal'){$('modal').hidden=true;return}}
function setupEvents(){document.addEventListener('error',e=>{if(e.target instanceof HTMLImageElement&&e.target.hasAttribute('data-pokemon')&&!e.target.dataset.fallback){e.target.dataset.fallback='1';e.target.src=spriteURI('p'+String(e.target.dataset.pokemon).padStart(3,'0'));}},true);document.addEventListener('click',e=>{let el=e.target.closest('[data-act]');if(el&&!el.disabled){onAction(el.dataset.act);return}let nav=e.target.closest('[data-page]');if(nav){if(game?.running&&!game.paused&&page==='battle'){game.paused=true}setPage(nav.dataset.page)}if(e.target.matches('[data-close]'))closeModal()});$('logoHome').onclick=()=>setPage('home');window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key.length===1?e.key.toLowerCase():e.key);if(page==='battle'&&game?.running&&!game.choosing&&['1','2','3'].includes(e.key)){switchPokemon(Number(e.key)-1);return}if(e.key==='Escape'&&game?.running&&!game.choosing)gamePause()});window.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));window.addEventListener('blur',()=>{keys.clear()});document.addEventListener('visibilitychange',()=>{if(!game?.running)return;if(document.hidden){if(!game.paused&&!game.choosing){game.paused=true;game.autoPaused=true;}keys.clear();}else if(game.autoPaused&&page==='battle'&&!game.choosing){game.autoPaused=false;game.paused=false;game.lastFrame=0;}const o=$('pauseOverlay');if(o)o.hidden=!game.paused;})}
async function init(){state=load();try{const [a,b]=await Promise.all([fetch('./data/kanto.json').then(r=>r.ok?r.json():Promise.reject('dex')),fetch('./data/questions.json').then(r=>r.ok?r.json():Promise.reject('questions'))]);species=a.filter(x=>x.id&&x.dex<=151);questions=b.map(normalQ).filter(Boolean);if(!questions.length)questions=FALLBACK_QUESTIONS.slice()}catch(e){console.warn('Local data unavailable, trying defaults',e);species=window.KANTO_FALLBACK||[];}if(!species.length){$('main').innerHTML='<div class="panel"><h2>ゲームデータを読み込めませんでした</h2><p>GitHub PagesまたはローカルHTTPサーバーで開いてください。</p></div>';return}byId=Object.fromEntries(species.map(x=>[x.id,x]));let sids=new Set(questions.map(q=>q.id));for(const q of state.questionAdditions){if(!sids.has(q.id)){questions.push(q);sids.add(q.id)}}setupEvents();nextQuestion();render();if(location.search.includes('debug=1'))window.SURVIVOR_DEBUG={get game(){return game},get state(){return state},get question(){return currentQ},startRun,finishRun,drawGacha,evolveInRun,chooseUpgrade,update,answer,setPage,species,switchPokemon,takePlayerDamage,effectiveness,showRun:()=>game};}
init().catch(e=>{console.error(e);$('main').textContent='起動エラー：再読み込みしてください。'});
})();