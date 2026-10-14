(()=>{'use strict';
const $=id=>document.getElementById(id), clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a),rand=n=>Math.floor(Math.random()*n),pick=a=>a[rand(a.length)];
const KEY='studySurvivor.v1', TYPES={grass:['翠','#73d99c','#2f805e','❧'],fire:['炎','#ff9b61','#ac3d41','♨'],water:['水','#7ac8ff','#3265a5','≋'],lightning:['雷','#f9dc78','#ac802b','ϟ'],psychic:['念','#ccabff','#7553b5','✧'],fighting:['闘','#edbe85','#986345','✦'],dark:['毒','#bc87d8','#6a497e','☾'],dragon:['竜','#ffab8a','#8e4665','♜'],normal:['無','#d3d9b6','#637b70','◇']};
const STAGES=[
 {name:'若葉の草原',tag:'GREENHAVEN',type:'grass',level:1,boss:'p003',desc:'草むらを突破する最初のダンジョン。'},
 {name:'灼熱の渓谷',tag:'EMBER RIDGE',type:'fire',level:2,boss:'p006',desc:'炎の弾幕が飛び交う火山地帯。'},
 {name:'星明かりの遺跡',tag:'STARFALL RUINS',type:'psychic',level:3,boss:'p150',desc:'念の力を秘めた遺跡。'},
 {name:'凍てつく雪山',tag:'FROST RIDGE',type:'water',level:4,boss:'p131',desc:'吹雪と氷の敵が行く手を塞ぐ。'},
 {name:'トキワ深緑洞窟',tag:'VERIDIAN CAVERN',type:'grass',level:5,boss:'p068',desc:'巨大な岩と格闘タイプが待つ深層。'},
 {name:'海鳴りの孤島',tag:'AZURE ISLAND',type:'water',level:6,boss:'p130',desc:'海流と水生ポケモンに囲まれる。'},
 {name:'紫毒の湿原',tag:'TOXIC MARSH',type:'dark',level:7,boss:'p094',desc:'毒霧と亡霊が漂う高難度エリア。'},
 {name:'天空の古代神殿',tag:'SKY SHRINE',type:'dragon',level:8,boss:'p149',desc:'最終ダンジョン。竜の猛攻を突破せよ。'}
];
const GYMS=[
 {name:'ニビジム',leader:'タケシ',badge:'グレーバッジ',type:'fighting',roster:[74,95],hint:'岩のように固い防御。みず・くさが有利。'},
 {name:'ハナダジム',leader:'カスミ',badge:'ブルーバッジ',type:'water',roster:[120,121],hint:'素早い水の技。くさ・でんきで対抗。'},
 {name:'クチバジム',leader:'マチス',badge:'オレンジバッジ',type:'lightning',roster:[100,26],hint:'高速の電撃弾幕。交代のタイミングに注意。'},
 {name:'タマムシジム',leader:'エリカ',badge:'レインボーバッジ',type:'grass',roster:[70,114,45],hint:'くさタイプの包囲攻撃。ほのおで押し切ろう。'},
 {name:'セキチクジム',leader:'キョウ',badge:'ピンクバッジ',type:'dark',roster:[109,110,89],hint:'どくタイプの連射が増える。'},
 {name:'ヤマブキジム',leader:'ナツメ',badge:'ゴールドバッジ',type:'psychic',roster:[64,122,65],hint:'エスパーの弾幕。3連戦の耐久力が必要。'},
 {name:'グレンジム',leader:'カツラ',badge:'クリムゾンバッジ',type:'fire',roster:[78,59,126],hint:'炎の高火力連戦。みずで立ち向かおう。'},
 {name:'トキワジム',leader:'サカキ',badge:'グリーンバッジ',type:'fighting',roster:[51,31,34,112],hint:'最難関・4連戦。高速の敵、強い弾幕、巨体のサイドン。'}
];
// Endgame modes use independent progress and never overwrite the original gym badges.
const LEAGUE=[
 {name:'四天王 カンナ',short:'カンナ',tag:'ELITE 01',type:'water',stage:3,roster:[87,91,131],desc:'こおり・みずの耐久戦。３体の強敵が連続で現れる。'},
 {name:'四天王 シバ',short:'シバ',tag:'ELITE 02',type:'fighting',stage:4,roster:[95,107,68],desc:'格闘の突進と岩の弾幕。技の射程と交代を活かそう。'},
 {name:'四天王 キクコ',short:'キクコ',tag:'ELITE 03',type:'dark',stage:6,roster:[93,94,94],desc:'毒・ゴーストの連射。範囲攻撃の対策が必要。'},
 {name:'四天王 ワタル',short:'ワタル',tag:'ELITE 04',type:'dragon',stage:7,roster:[130,148,149,149],desc:'竜の大技が続く４連戦。防御と火力が試される。'},
 {name:'チャンピオン グリーン',short:'グリーン',tag:'CHAMPION',type:'psychic',stage:7,roster:[18,65,103,59,130,9],desc:'最終決戦・６体連戦。殿堂入りへの最後の関門。'}
];
const LEGENDS=[
 {name:'氷霧の双子島',tag:'FROZEN SHRINE',id:'p144',stage:3,unlockBadges:4,desc:'フリーザーを追う氷の特別ダンジョン。',type:'water',minions:[86,87,90,91,124]},
 {name:'雷鳴の発電所',tag:'THUNDER PLANT',id:'p145',stage:2,unlockBadges:4,desc:'サンダーの雷撃が降り注ぐ発電施設。',type:'lightning',minions:[81,82,100,101,125]},
 {name:'炎翼の火山島',tag:'FIRE ISLAND',id:'p146',stage:1,unlockBadges:4,desc:'ファイヤーが棲む火口に挑む。',type:'fire',minions:[37,38,58,59,77,78]},
 {name:'最深部 ハナダの洞窟',tag:'CERULEAN DEPTHS',id:'p150',stage:7,unlockBadges:8,needChampion:true,desc:'殿堂入り後に出現するミュウツーの深層。',type:'psychic',minions:[63,64,65,94,97,122]}
];
const CHALLENGE_MODES=new Set(['gym','rematch','league']);
function isBossChallenge(g){return !!g&&CHALLENGE_MODES.has(g.mode);}
function challengeRoster(g){const roster=g.mode==='league'?LEAGUE[g.challengeIndex].roster:GYMS[g.gymIndex].roster;return g.mode==='rematch'?[...roster,roster[roster.length-1]]:roster;}
function modeTitle(g){return g.mode==='gym'?'ジムリーダー戦':g.mode==='rematch'?'強化ジムリーダー戦':g.mode==='league'?'ポケモンリーグ':g.mode==='legend'?'伝説の試練':'ポケモン サバイバル';}
function endgameName(g){return g.mode==='gym'||g.mode==='rematch'?GYMS[g.gymIndex].leader:g.mode==='league'?LEAGUE[g.challengeIndex].short:g.mode==='legend'?byId[LEGENDS[g.legendIndex].id].name:'ダンジョン';}
function legendaryUnlocked(n){const entry=LEGENDS[n];return !!entry&&(state.gymBadges||0)>=entry.unlockBadges&&(!entry.needChampion||(state.hallOfFame||0)>0);}
function addTMByTier(tier='R'){const items=TM_LIST.filter(t=>t.rarity===tier);const tm=pick(items);if(!tm)return null;state.tms[tm.id]=(state.tms[tm.id]||0)+1;return tm;}
const CAPTURE_BALLS={
 poke:{name:'モンスターボール',rate:.18,styleKey:'poke',desc:'基本の捕獲ボール'},
 great:{name:'スーパーボール',rate:.34,styleKey:'great',desc:'捕獲率アップ'},
 ultra:{name:'ハイパーボール',rate:.54,styleKey:'ultra',desc:'さらに捕獲率アップ'},
 master:{name:'マスターボール',rate:1,styleKey:'master',desc:'野生ポケモンを確定捕獲'}
};
const GACHA_BALLS={
 N:{name:'ノーマル召喚ボール',className:'rank-n',styleKey:'gacha-n'},
 U:{name:'エメラルド召喚ボール',className:'rank-u',styleKey:'gacha-u'},
 R:{name:'サファイア召喚ボール',className:'rank-r',styleKey:'gacha-r'},
 SR:{name:'オーロラ召喚ボール',className:'rank-sr',styleKey:'gacha-sr'},
 LG:{name:'レジェンド召喚ボール',className:'rank-lg',styleKey:'gacha-lg'}
};
let gachaAnimating=false,gachaAnimationTimer=0;let gachaShiny=false;
const SHINY_GACHA_RATE=1/512,SHINY_CAPTURE_RATE=1/256;
function gymEffectiveness(attackerType,defender,g){
 const regular=effectiveness(attackerType,byId[defender.id].type);
 if(g?.mode!=='gym'&&g?.mode!=='rematch')return regular;
 const good=[['grass','water'],['grass','lightning'],['fighting'],['fire'],['psychic'],['dark'],['water'],['grass','water']][g.gymIndex]||[];
 if(good.includes(attackerType))return 1.6;
 return regular;
}

function shinyCount(id){return state?.shinies?.[id]||0;}
function equippedShiny(id){return !!state?.shinyEquipped?.[id]&&shinyCount(id)>0;}
function grantShiny(id,source){state.shinies[id]=(state.shinies[id]||0)+1;state.shinySources[source]=(state.shinySources[source]||0)+1;}
function toggleShiny(id){if(!shinyCount(id))return notify('このポケモンの色違いを持っていません');state.shinyEquipped[id]=!state.shinyEquipped[id];save();monDetail(id);render();}

function captureStock(){return state.balls||(state.balls={poke:5,great:0,ultra:0,master:0});}
function addSource(id,kind){state.sources??={gacha:{},wild:{}};const group=state.sources[kind]||(state.sources[kind]={});group[id]=(group[id]||0)+1;}
// Capture takes place only in the post-battle reward modal. No aiming controls in combat.
function captureChance(ballKey,mon,g=game){
 if(ballKey==='master')return 1;
 if(g?.mode==='legend'&&g?.outcomeWin){return {poke:.025,great:.05,ultra:.11}[ballKey]||.025;}
 const rank={N:1,U:.85,R:.64,SR:.42,LG:.2}[mon.rarity]||1;
 const battled=g?.outcomeWin?1.1:1;
 const effort=1+Math.min(100,g?.kills||0)/230;
 return Math.min(.92,Math.max(.025,CAPTURE_BALLS[ballKey].rate*2.05*rank*battled*effort));
}
function chooseCaptureCandidates(g,win){
 if(g.mode==='legend')return win?[LEGENDS[g.legendIndex].id]:[];
 if(isBossChallenge(g))return [];
 const found=Object.entries(g.defeatedSpecies||{}).filter(([id,n])=>n>0&&byId[id]).map(([id])=>byId[id]);
 const shuffled=[...found].sort(()=>Math.random()-.5);
 // Distinct candidates only from monsters actually defeated this round; bosses excluded.
 return shuffled.slice(0,win?3:2).map(s=>s.id);
}
function capturePanelHTML(g){
 const c=g.captureChance;
 if(!c||!c.options.length)return '<p class="capture-quiet">今回は捕獲できる野生ポケモンがいませんでした。</p>';
 const selected=byId[c.selected]||byId[c.options[0]];
 const result=c.result;
 const animation=c.animating;
 return `<section class="post-capture-zone" aria-label="クリア後の捕獲チャンス">
  <div class="post-capture-title"><span>✦ ${g.mode==='legend'?'LEGENDARY ENCOUNTER':'BONUS ENCOUNTER'}</span><h3>${g.mode==='legend'?'伝説ポケモン捕獲チャンス！':'捕獲チャンス！'}</h3><p>${g.mode==='legend'?'強敵を倒して伝説ポケモンと遭遇！捕獲率は低いが、色違いの可能性も。':'今回倒した野生ポケモンから1匹を選ぼう。'} ボールを1個消費して一度だけ挑戦。</p></div>
  ${!c.attempted?`<div class="post-capture-choices">${c.options.map(id=>{const mon=byId[id];return `<button class="post-capture-mon ${id===c.selected?'chosen':''}" data-act="capturePick:${id}">${spriteTag(id,'post-capture-sprite')}<strong>${escapeHTML(mon.name)}</strong><small>${typeOf(mon)[0]} / ${rankName(mon.rarity)}</small></button>`}).join('')}</div>
   <div class="post-capture-ball-list">${Object.entries(CAPTURE_BALLS).map(([key,ball])=>`<button class="post-ball-choice" data-act="captureAfter:${key}" ${(captureStock()[key]||0)<1?'disabled':''}>${pixelBallHTML(ball.styleKey,ball.name,'post-capture-pixelball')}<b>${ball.name}</b><small>×${captureStock()[key]||0}</small><span class="capture-odds">${Math.round(captureChance(key,selected,g)*100)}%</span></button>`).join('')}</div>
   <small class="capture-hint">確率はボール性能・ポケモンの希少度・戦闘実績によって決まります。マスターボールは100%。</small>`:
   `<div class="post-capture-anim ${animation?'is-shaking':result?.success?'is-caught':'is-escaped'}">
      <div class="post-mon-anim">${spriteTag(selected.id,'post-capture-sprite',!!result?.shiny)}</div>
      ${pixelBallHTML(CAPTURE_BALLS[c.ball].styleKey,CAPTURE_BALLS[c.ball].name,'post-battle-ball')}
      <strong>${animation?'つかまえる…':result?.success?(result.shiny?'✦ 色違いの '+selected.name+' をゲット！':selected.name+' をゲット！'):selected.name+' は逃げてしまった…'}</strong>
      ${animation?`${button('演出をスキップ','captureSkip','btn secondary tiny')}`:`<small>${result?.success?'図鑑と所持一覧に追加しました。':'ボールを1個消費しました。次のバトルに挑もう。'}</small>`}
    </div>`}
 </section>`;
}
function rewardModalHTML(g){
 const win=g.outcomeWin,abandon=g.outcomeAbandon;
 const special=isBossChallenge(g)||g.mode==='legend';
 const display=modeTitle(g),name=endgameName(g);
 const hasCapture=!abandon&&(g.mode==='dungeon'||g.mode==='legend');
 const detail=win?(g.mode==='gym'?GYMS[g.gymIndex].badge+'を獲得！':g.mode==='rematch'?'強化ジム撃破！':g.mode==='league'?(g.challengeIndex===4?'殿堂入り！':'四天王を突破！'):g.mode==='legend'?'伝説ポケモンを撃破！':'次のダンジョンを解放！'):'再挑戦してチームを鍛えよう。';
 return `<div class="result-layout"><div class="result-stars">${win?'✦ ✦ ✦':abandon?'◇':'✧'}</div>
  <div class="eyebrow">${win?display+' CLEAR':abandon?'RETREAT':'GAME OVER'}</div>
  <h2>${win?(special?escapeHTML(name)+' に勝利！':'ボス撃破！'):abandon?'探索を終了':'冒険はここまで'}</h2>
  <div class="stats"><div class="stat"><small>撃破数</small><b>${g.kills}</b></div><div class="stat"><small>ランク</small><b>${g.level}</b></div><div class="stat"><small>素材</small><b>+${g.rewardDust||0}</b></div></div>
  <p class="sub">${detail}${win?' ガチャ券 +1':''}</p>
  ${!abandon?`<div class="ball-reward">ボール報酬：${Object.entries(g.ballRewards||{}).filter(([k,v])=>v>0).map(([k,v])=>`<span class="ball-reward-item">${pixelBallHTML(CAPTURE_BALLS[k].styleKey,CAPTURE_BALLS[k].name,'reward-ball')}<b>${CAPTURE_BALLS[k].name}</b> ×${v}</span>`).join('')||'なし'}</div>`:''}
  ${g.tmReward?`<div class="tm-win">⚙ わざマシン獲得！ <b>${escapeHTML(g.tmReward.name)}</b>（${g.tmReward.rarity}）</div>`:''}
  ${win&&g.mode==='gym'?`<div class="gym-victory">🏅 ${GYMS[g.gymIndex].badge}を獲得！</div>`:''}
  ${win&&g.mode==='league'?`<div class="gym-victory">${g.challengeIndex===4?'🏆 CHAMPION / 殿堂入り':'✦ LEAGUE CLEAR'}　${g.challengeIndex===4?'チャンピオンを倒した！':'次の四天王が解放！'}</div>`:''}
  ${win&&g.mode==='rematch'?`<div class="gym-victory">✧ 強化${GYMS[g.gymIndex].name}撃破！ 再戦記録に保存しました。</div>`:''}
  ${win&&g.mode==='legend'?`<div class="gym-victory">✧ ${escapeHTML(name)}の捕獲チャンスが解放！</div>`:''}
  ${hasCapture?capturePanelHTML(g):''}
  ${button('冒険メニューへ','endResult','btn gold wide',g.captureChance?.animating?'disabled':'')}
 </div>`;
}
function refreshRewardModal(g=game){if(!g||g.running)return;modal(rewardModalHTML(g));hydrateSprites();}
function chooseCaptureTarget(id){const c=game?.captureChance;if(!c||c.attempted||!c.options.includes(id))return;c.selected=id;refreshRewardModal();}
function postBattleCapture(ballKey){
 const g=game,c=g?.captureChance;if(!g||g.running||!c||c.attempted||!c.options.length)return;
 if(!CAPTURE_BALLS[ballKey]||(captureStock()[ballKey]||0)<1){notify('ボールがありません');return;}
 const target=byId[c.selected];if(!target)return;
 captureStock()[ballKey]--;c.ball=ballKey;c.attempted=true;c.animating=true;
 const success=Math.random()<captureChance(ballKey,target,g);c.result={success,id:target.id};
 if(success){const shiny=Math.random()<(g.mode==='legend'?1/128:SHINY_CAPTURE_RATE);c.result.shiny=shiny;if(shiny)grantShiny(target.id,'wild');state.owned[target.id]=(state.owned[target.id]||0)+1;addSource(target.id,'wild');g.captures=(g.captures||0)+1;}
 save();refreshRewardModal();
 c.animationTimer=setTimeout(()=>finishCaptureAnimation(g),2400);
}
function finishCaptureAnimation(g=game){if(!g?.captureChance?.animating)return;const c=g.captureChance;c.animating=false;clearTimeout(c.animationTimer);if(game===g)refreshRewardModal();}
function rewardCaptureBalls(g,win,abandon){
 const rewards={poke:0,great:0,ultra:0,master:0};if(abandon)return rewards;
 if(win){rewards.poke=2+g.stage;rewards.great=g.stage>=4?2:g.stage>=1?1:0;
   if(g.stage>=4)rewards.ultra=2;else if(g.stage>=2)rewards.ultra=1;
   else if(Math.random()<(g.stage===1?.42:.18))rewards.ultra++;
   if(Math.random()<(g.stage>=7?.035:g.stage>=5?.025:g.stage>=2?.012:g.stage===1?.008:.002))rewards.master++;
 }else if(g.kills>=12){rewards.poke=1;}
 const stock=captureStock();for(const [key,value] of Object.entries(rewards))stock[key]=(stock[key]||0)+value;
 return rewards;
}
function pixelBallSVG(kind='poke'){
 const palettes={
  poke:{top:'#e23b3b',topShade:'#b62626',bottom:'#f7f7f2',bottomShade:'#cfd6d8',line:'#202a33',button:'#f5f3ef',buttonShade:'#aeb7bc',accent:'#ffffff'},
  great:{top:'#2a60d8',topShade:'#173a8d',bottom:'#f6f5ef',bottomShade:'#cad5db',line:'#1c2730',button:'#f5f3ef',buttonShade:'#adb7bd',accent:'#d95353'},
  ultra:{top:'#20242d',topShade:'#090d13',bottom:'#f2f2e9',bottomShade:'#c8d0d5',line:'#171f26',button:'#f7f2c5',buttonShade:'#9da8b2',accent:'#f2cf43'},
  master:{top:'#8f52d7',topShade:'#6031a3',bottom:'#f6f6f0',bottomShade:'#cad0d5',line:'#221a2b',button:'#f7f4ee',buttonShade:'#afb6c0',accent:'#ec8ddb'},
  'gacha-n':{top:'#f26f59',topShade:'#be3e2d',bottom:'#fff6e0',bottomShade:'#d9cfb4',line:'#31243b',button:'#fff8f1',buttonShade:'#bfc4cb',accent:'#ffe277'},
  'gacha-u':{top:'#34a77d',topShade:'#20664d',bottom:'#ecfff1',bottomShade:'#c0d8c7',line:'#17332a',button:'#fffdfa',buttonShade:'#b5c8be',accent:'#aaf7d2'},
  'gacha-r':{top:'#3e77f0',topShade:'#2546ad',bottom:'#effaff',bottomShade:'#bfd0df',line:'#1a2840',button:'#fffdf9',buttonShade:'#b9c3cf',accent:'#8fdfff'},
  'gacha-sr':{top:'#af63f0',topShade:'#6c35a6',bottom:'#fff0ff',bottomShade:'#dcc6e8',line:'#321d42',button:'#fffaf8',buttonShade:'#c6bed2',accent:'#ffb8ff'},
  'gacha-lg':{top:'#f4c84e',topShade:'#ad7d18',bottom:'#fdeeff',bottomShade:'#d9bfd8',line:'#3f2633',button:'#fffdf6',buttonShade:'#cfc8bb',accent:'#fff2a1'}
 };
 const p=palettes[kind]||palettes.poke;
 const rows=[[7,10],[5,12],[4,13],[3,14],[2,15],[2,15],[1,16],[1,16],[1,16],[1,16],[2,15],[2,15],[3,14],[4,13],[5,12],[7,10]];
 const rect=(x,y,w,h,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"/>`;
 const topRows=new Set([1,2,3,4,5,6,7]);
 let out='';
 rows.forEach(([a,b],i)=>{const y=i+1; out+=rect(a,y,b-a+1,1,p.line); if(b-a>1){
   let fill= topRows.has(y)?p.top:(y>=10?p.bottom:p.line); 
   if(y===8||y===9) fill=p.line;
   out+=rect(a+1,y,Math.max(0,b-a-1),1,fill);
 }});
 // simple shading
 [[3,4],[4,4],[5,5],[6,5],[4,5],[5,6]].forEach(([x,y])=> out+=rect(x,y,1,1,p.accent));
 [[10,12],[11,12],[12,11],[12,12],[11,13]].forEach(([x,y])=> out+=rect(x,y,1,1,topRows.has(y)?p.topShade:p.bottomShade));
 // belt highlight
 out+=rect(2,8,5,1,'#485561'); out+=rect(11,8,5,1,'#485561');
 // center button
 out+=rect(6,7,6,4,p.line); out+=rect(7,8,4,2,p.button); out+=rect(8,8,2,1,'#ffffff'); out+=rect(10,9,1,1,p.buttonShade);
 // species markers
 if(kind==='great') {out+=rect(4,3,2,2,p.accent); out+=rect(12,3,2,2,p.accent);}
 if(kind==='ultra') {out+=rect(3,2,3,1,p.accent); out+=rect(12,2,3,1,p.accent); out+=rect(5,3,2,1,p.accent); out+=rect(11,3,2,1,p.accent); out+=rect(7,4,4,2,p.accent);} 
 if(kind==='master') {out+=rect(4,3,2,2,p.accent); out+=rect(12,3,2,2,p.accent); out+=rect(6,2,6,1,p.accent); out+=rect(7,3,1,2,'#ffffff'); out+=rect(10,3,1,2,'#ffffff'); out+=rect(8,4,2,1,'#ffffff');}
 if(kind==='gacha-u') {out+=rect(5,3,2,1,p.accent); out+=rect(10,3,2,1,p.accent); out+=rect(7,4,4,1,p.accent);} 
 if(kind==='gacha-r') {out+=rect(4,3,2,2,p.accent); out+=rect(12,3,2,2,p.accent);}
 if(kind==='gacha-sr') {out+=rect(5,2,1,1,p.accent); out+=rect(10,2,1,1,p.accent); out+=rect(6,3,4,1,p.accent);} 
 if(kind==='gacha-lg') {out+=rect(4,2,10,1,p.accent); out+=rect(5,3,8,1,p.accent);}
 return `<svg viewBox="0 0 18 18" class="pixel-ball-svg" aria-hidden="true" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">${out}</svg>`;
}
function pixelBallHTML(kind,label,classes=''){
 return `<span class="pixel-ball ${classes}" role="img" aria-label="${escapeHTML(label)}">${pixelBallSVG(kind)}</span>`;
}
function summonBallHTML(rarity,animated=false){const spec=GACHA_BALLS[rarity]||GACHA_BALLS.N;
 return pixelBallHTML(spec.styleKey,spec.name,`summon-ball ${spec.className} ${animated?'summon-ball-active':''}`);
}
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
// TM catalog: field effects are shared with the survivor projectile engine.
// Moves are intentionally not straight power upgrades: speed, range and utility matter.
const TM_LIST=[
 {id:'tm01',name:'でんこうせっか',type:'normal',rarity:'N',power:.77,rate:.56,speed:1.25,range:370,desc:'素早い連射。移動型の敵に有効。'},
 {id:'tm02',name:'スピードスター',type:'normal',rarity:'U',power:.75,rate:.88,shots:3,spread:.36,desc:'3方向に星を放つ。'},
 {id:'tm03',name:'はっぱカッター',type:'grass',rarity:'N',power:1.02,rate:.9,pierce:2,desc:'葉っぱが敵2体まで貫通。'},
 {id:'tm04',name:'エナジーボール',type:'grass',rarity:'R',power:1.32,rate:1.33,splash:51,desc:'着弾時に周囲の敵も巻き込む。'},
 {id:'tm05',name:'ひのこ',type:'fire',rarity:'N',power:.94,rate:.79,desc:'素早い炎の弾を飛ばす。'},
 {id:'tm06',name:'かえんほうしゃ',type:'fire',rarity:'R',power:1.17,rate:1.13,pierce:3,range:330,desc:'直線上の敵を貫通する炎。'},
 {id:'tm07',name:'だいもんじ',type:'fire',rarity:'SR',power:1.76,rate:1.78,splash:74,desc:'高威力の大きな爆発。発動は遅い。'},
 {id:'tm08',name:'みずでっぽう',type:'water',rarity:'N',power:.96,rate:.85,desc:'取り回しのよい水の弾。'},
 {id:'tm09',name:'バブルこうせん',type:'water',rarity:'U',power:.94,rate:1,slow:.65,desc:'命中すると敵の移動速度を低下。'},
 {id:'tm10',name:'ハイドロポンプ',type:'water',rarity:'SR',power:1.64,rate:1.57,pierce:4,desc:'高威力で複数体を貫通。'},
 {id:'tm11',name:'でんきショック',type:'lightning',rarity:'N',power:.85,rate:.74,slow:.8,desc:'素早い放電で敵の動きを鈍らせる。'},
 {id:'tm12',name:'10まんボルト',type:'lightning',rarity:'R',power:1.38,rate:1.35,splash:48,desc:'着弾点に稲妻が広がる。'},
 {id:'tm13',name:'サイコキネシス',type:'psychic',rarity:'R',power:1.34,rate:1.24,pierce:3,desc:'念力が敵を貫通。'},
 {id:'tm14',name:'いわなだれ',type:'fighting',rarity:'U',power:1.21,rate:1.2,splash:55,slow:.55,desc:'岩を落として範囲攻撃＋鈍足。'},
 {id:'tm15',name:'インファイト',type:'fighting',rarity:'R',power:1.65,rate:1.12,range:245,speed:.85,desc:'射程は短いが高威力。'},
 {id:'tm16',name:'どくばり',type:'dark',rarity:'N',power:.9,rate:.8,slow:.8,desc:'毒タイプの素早い一撃。'},
 {id:'tm17',name:'ヘドロばくだん',type:'dark',rarity:'R',power:1.24,rate:1.37,splash:63,slow:.5,desc:'毒の範囲攻撃で敵を遅くする。'},
 {id:'tm18',name:'りゅうのはどう',type:'dragon',rarity:'SR',power:1.56,rate:1.38,pierce:4,desc:'強力な竜の波動が敵を貫く。'}
];
const TM_BY_ID=Object.fromEntries(TM_LIST.map(x=>[x.id,x]));
const TM_COMPAT={
 grass:['grass','normal','dark'],fire:['fire','normal','fighting','dragon'],water:['water','normal','psychic'],
 lightning:['lightning','normal','fighting'],psychic:['psychic','normal','dark'],fighting:['fighting','normal','dark'],
 dark:['dark','normal','psychic'],dragon:['dragon','normal','fire','water','lightning'],normal:['normal','fighting']
};
// Every owned Pokemon has its own learnset. Learned moves can be re-equipped without consuming another TM.
function tmCanLearn(pokemon,tm){if(!pokemon||!tm)return false;return TM_COMPAT[pokemon.type]?.includes(tm.type)||false;}
function defaultMove(s){return {id:'default',name:MOVES[s.type]||'たいあたり',type:s.type,power:1,rate:1};}
function moveFor(id){const s=byId[id],key=state?.equippedMoves?.[id],tm=TM_BY_ID[key];return tm&&state?.learnedMoves?.[id]?.includes(tm.id)&&tmCanLearn(s,tm)?tm:defaultMove(s);}
function tmRandom(stage=0){const pool=TM_LIST.filter(tm=>tm.rarity!=='SR'||stage>=1);let r=Math.random(),tier=r<.59?'N':r<.86?'U':r<.975?'R':'SR';let choices=pool.filter(tm=>tm.rarity===tier);return pick(choices.length?choices:pool);}
function grantTM(source,stage=0){const tm=tmRandom(stage);state.tms[tm.id]=(state.tms[tm.id]||0)+1;save();return tm;}
function tmCount(){return Object.values(state.tms||{}).reduce((a,b)=>a+Math.max(0,b||0),0);}
function learnTM(pokeId,tmId){const s=byId[pokeId],tm=TM_BY_ID[tmId];if(!state.owned[pokeId]||!tmCanLearn(s,tm))return notify('このポケモンは覚えられません');if((state.learnedMoves[pokeId]||[]).includes(tmId))return equipTM(pokeId,tmId);if(!(state.tms[tmId]>0))return notify('わざマシンがありません');state.tms[tmId]--;state.learnedMoves[pokeId]??=[];state.learnedMoves[pokeId].push(tmId);state.equippedMoves[pokeId]=tmId;save();render();notify(s.name+' は '+tm.name+' を覚えた！');}
function equipTM(pokeId,tmId){const s=byId[pokeId];if(!state.owned[pokeId]||!s)return;if(tmId!=='default'&&(!(state.learnedMoves[pokeId]||[]).includes(tmId)||!tmCanLearn(s,TM_BY_ID[tmId])))return notify('まだ覚えていない技です');if(tmId==='default')delete state.equippedMoves[pokeId];else state.equippedMoves[pokeId]=tmId;save();render();notify(s.name+' の使用技を変更！');}
function machine(){if(!state.starter)return home();const mon=state.team.filter(id=>state.owned[id]).concat(species.filter(s=>state.owned[s.id]&&!state.team.includes(s.id)).map(s=>s.id));
 const poke=byId[tmSelectedPokemon]&&state.owned[tmSelectedPokemon]?tmSelectedPokemon:mon[0];tmSelectedPokemon=poke||null;
 const s=byId[poke],equipped=s?moveFor(poke):null,learned=(state.learnedMoves[poke]||[]).filter(id=>TM_BY_ID[id]);
 return `${heading('TECHNICAL MACHINE','わざマシン / 技変更','バトル報酬とポケモンガチャのボーナスで入手。覚えた技はいつでも付け替え可能。')}
 <div class="panel"><div class="row spread"><b>TMバッグ</b><span class="pill">所持 ${tmCount()}個 / ${TM_LIST.length}種類</span></div><p class="sub">同じわざマシンでも複数のポケモンに教えられます（1匹に教えるごとに1個消費）。</p>
 <div class="tm-pokemon-picker">${mon.map(id=>`<button class="tm-poke ${poke===id?'active':''}" data-act="tmSelect:${id}">${spriteTag(id)}<small>${escapeHTML(byId[id].name)}</small></button>`).join('')}</div></div>
 ${s?`<section class="panel section"><div class="row spread"><h2>${escapeHTML(s.name)} の技</h2><span class="pill">${typeOf(s)[0]}タイプ</span></div><p class="sub">今の技：<strong>${escapeHTML(equipped.name)}</strong>（${typeOf({type:equipped.type})[0]}）</p><div class="tm-list">${[defaultMove(s),...learned.map(id=>TM_BY_ID[id])].map(tm=>`<div class="tm-row"><span class="tm-icon" style="--tmc:${typeOf({type:tm.type})[1]}">${typeOf({type:tm.type})[3]}</span><div><b>${escapeHTML(tm.name)}</b><small>${typeOf({type:tm.type})[0]} / ${tm.power||1}倍 / 速度 ${Math.round(100/(tm.rate||1))}%</small></div>${button(equipped.id===tm.id?'使用中':'装備する','tmEquip:'+poke+':'+tm.id,'btn tiny secondary',equipped.id===tm.id?'disabled':'')}</div>`).join('')}</div></section>`:''}
 <section class="panel section"><h2>バッグのわざマシン</h2><div class="tm-list">${TM_LIST.map(tm=>{const count=state.tms[tm.id]||0,known=learned.includes(tm.id),compatible=tmCanLearn(s,tm);return `<div class="tm-row ${!compatible?'incompatible':''}"><span class="tm-icon" style="--tmc:${typeOf({type:tm.type})[1]}">${typeOf({type:tm.type})[3]}</span><div><b>TM ${tm.id.slice(2)}　${escapeHTML(tm.name)}</b><small>${typeOf({type:tm.type})[0]} / ${tm.rarity} / ${escapeHTML(tm.desc)}</small><small>所持 ${count} 個${!compatible?' · このポケモンは覚えられない':known?' · 習得済み':''}</small></div>${button(known?'装備':count&&compatible?'覚える':'不可',known?'tmEquip:'+poke+':'+tm.id:'tmLearn:'+poke+':'+tm.id,'btn tiny '+(known?'secondary':'gold'),(!compatible||!known&&!count)?'disabled':'')}</div>`}).join('')}</div></section>`;
}
const UPGRADES=[{id:'power',icon:'⚔',name:'火力アップ',desc:'全員の攻撃ダメージ +25%'},{id:'rate',icon:'ϟ',name:'れんぞく技',desc:'技のクールダウン -17%'},{id:'multi',icon:'✧',name:'拡散攻撃',desc:'同時発射数 +1'},{id:'speed',icon:'➤',name:'かるい足取り',desc:'移動速度 +14%'},{id:'hp',icon:'♥',name:'最大HPアップ',desc:'最大HP +35、HPも回復'},{id:'magnet',icon:'◉',name:'広域回収',desc:'経験値の吸引範囲 +48%'},{id:'orbit',icon:'☄',name:'守護の輪',desc:'周囲を回る攻撃球 +1'},{id:'defense',icon:'⛨',name:'防御強化',desc:'受けるダメージ -13%'},{id:'heal',icon:'✚',name:'応急回復',desc:'HPを70回復する'}];
const FALLBACK_QUESTIONS=[{id:'q1',question:'骨格筋の収縮でCa²⁺が結合するタンパク質は？',choices:['トロポニン','アクチン','ミオシン','チチン'],correct:0,explanation:'カルシウムはトロポニンCに結合します。',subject:'運動生理'},{id:'q2',question:'大腿四頭筋に含まれないのは？',choices:['大腿直筋','外側広筋','大腿二頭筋','中間広筋'],correct:2,explanation:'大腿二頭筋はハムストリングスです。',subject:'解剖学'},{id:'q3',question:'ATPを直接使う筋収縮の構造は？',choices:['ミオシン頭部','筋紡錘','腱器官','筋膜'],correct:0,explanation:'ミオシン頭部のATPaseがATPを分解します。',subject:'運動生理'},{id:'q4',question:'ACLの主な機能は？',choices:['脛骨の前方移動制限','足関節背屈','股関節外転','肩関節外旋'],correct:0,explanation:'ACLは脛骨の前方移動を制動します。',subject:'外傷'},{id:'q5',question:'等尺性筋収縮の特徴は？',choices:['筋長の変化が少ない','必ず関節が曲がる','常に遠心性','筋活動がない'],correct:0,explanation:'等尺性では大きな筋長変化が起こりません。',subject:'運動生理'}];
let species=[],byId={},questions=FALLBACK_QUESTIONS.slice(),currentQ=null,answered=false,selectedAnswer=-1,answerGood=false,studyFilter='all',state=null,page='home',gachaResult=null,dexFilter='all',dexPage=0,teamPick=-1,selectedStage=0,game=null,raf=0,keys=new Set(),toastTimer=null,mousePointer=null,tmSelectedPokemon=null,gachaBonusTM=null,studyView='practice',examSettings={mode:'random',year:'all',part:'all'},examResult=null,importYear='',importPart='基礎',manualYear='',manualPart='基礎',manualNumbers='';
function initial(){return {version:1,starter:null,owned:{},team:[],tickets:1,dust:100,studied:0,correct:0,credit:0,combo:0,best:0,history:{},reviews:[],questionAdditions:[],questionImages:{},manualWeak:[],examDraft:null,examHistory:[],training:{},stages:1,clears:0,pity:{r:0,sr:0,lg:0},packsOpened:0,tms:{},learnedMoves:{},equippedMoves:{},balls:{poke:5,great:0,ultra:0,master:0},sources:{gacha:{},wild:{}},shinies:{},shinyEquipped:{},shinySources:{gacha:0,wild:0},gymBadges:0,gymRematches:{},leagueWins:0,hallOfFame:0,legendClears:{},settings:{effects:true}};}
function load(){try{let saved=JSON.parse(localStorage.getItem(KEY));return saved?{...initial(),...saved,history:saved.history||{},manualWeak:saved.manualWeak||[],questionImages:saved.questionImages||{},examDraft:saved.examDraft||null,examHistory:saved.examHistory||[],owned:saved.owned||{},training:saved.training||{},tms:saved.tms||{},learnedMoves:saved.learnedMoves||{},equippedMoves:saved.equippedMoves||{},balls:{poke:0,great:0,ultra:0,master:0,...(saved.balls||{poke:5})},sources:{gacha:{...saved.sources?.gacha},wild:{...saved.sources?.wild}},shinies:saved.shinies||{},shinyEquipped:saved.shinyEquipped||{},shinySources:{gacha:0,wild:0,...saved.shinySources},gymBadges:saved.gymBadges||0,gymRematches:saved.gymRematches||{},leagueWins:saved.leagueWins||0,hallOfFame:saved.hallOfFame||0,legendClears:saved.legendClears||{},pity:{r:0,sr:0,lg:0,...saved.pity}}:initial();}catch{return initial()}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}}
function escapeHTML(s){return String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]))}
function notify(s){let el=$('toast');el.textContent=s;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2600)}
function typeOf(s){return TYPES[s.type]||TYPES.normal}function rankName(r){return {N:'NORMAL',U:'UNCOMMON',R:'RARE',SR:'SUPER RARE',LG:'LEGEND'}[r]||r}
// Portable RPG pixel-art sources. Images are fetched on demand rather than redistributed.
// The procedural generator below remains as an offline/failed-network fallback.
const POKE_SPRITE_ROOT='https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iv/heartgold-soulsilver/';
function pokemonSpriteURL(id,shiny=false){const dex=Number(byId[id]?.dex||id?.replace(/^p/,''));return Number.isInteger(dex)&&dex>0&&dex<=151?POKE_SPRITE_ROOT+(shiny?'shiny/':'')+dex+'.png':'';}
function spriteTag(id,cls='sprite',forceShiny){const s=byId[id];if(!s)return '';const shiny=forceShiny===undefined?equippedShiny(id):!!forceShiny;return `<img class="${cls} ${shiny?'is-shiny':''}" loading="lazy" alt="${escapeHTML(s.name)}${shiny?' 色違い':''}" data-pokemon="${s.dex}" data-shiny="${shiny?'1':'0'}" src="${spriteURI(id)}">`;}

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
let line=state.team.map(id=>spriteTag(id)).join('');return `<section class="hero"><div class="hero-copy"><div class="eyebrow">POKÉ SURVIVAL × STUDY</div><h1>知識で仲間を集め<br><b>群れを突破せよ。</b></h1><p>勉強5問でガチャ1回。初代151匹を集めて3匹編成し、見下ろし型のサバイバルバトルへ出撃。</p><div class="row">${button('⚔ 今すぐ冒険へ','go:battle','btn gold')}${button('✎ 勉強してガチャ獲得','go:study','btn secondary')}</div></div><div class="hero-art"><div class="hero-team">${line}</div><div class="hero-caption">KANTO PARTNER TEAM <span>● ● ●</span></div></div></section><div class="stats"><div class="stat"><small>ポケモン図鑑</small><b>${Object.keys(state.owned).filter(k=>state.owned[k]>0).length} / 151</b></div><div class="stat"><small>勉強の正解数</small><b>${state.correct}</b></div><div class="stat"><small>ステージ攻略</small><b>${state.clears}</b></div><div class="stat"><small>ジムバッジ</small><b>${state.gymBadges||0}/8</b></div></div><div class="section-head section"><h2>冒険を進める</h2><span class="eyebrow">GAME LOOP</span></div><div class="grid"><div class="tile"><div class="tile-icon">✎</div><h3>STUDY</h3><p>正解を積み重ねてガチャ権を獲得。苦手問題を克服しよう。</p>${button('問題を解く','go:study','btn secondary wide')}</div><div class="tile"><div class="tile-icon">◈</div><h3>MONSTER GACHA</h3><p>専用のレア別ボールで1匹召喚。野生捕獲とは別の入手ルート。</p>${button('ガチャを引く','go:pack','btn secondary wide')}</div><div class="tile"><div class="tile-icon">⚔</div><h3>SURVIVAL</h3><p>野生ポケモンへボールを投げて捕獲。ボス報酬でボールを入手！</p>${button('エリア選択','go:battle','btn secondary wide')}</div><div class="tile"><div class="tile-icon">🏅</div><h3>KANTO GYMS</h3><p>8人のジムリーダーに挑戦してバッジを集めよう！</p>${button('8ジムへ挑戦','go:gym','btn secondary wide')}</div><div class="tile"><div class="tile-icon">🏆</div><h3>ENDGAME</h3><p>四天王・チャンピオン・強化ジム戦。８バッジで解放。</p>${button('リーグへ','go:gym','btn secondary wide')}</div><div class="tile"><div class="tile-icon">✦</div><h3>LEGENDARY TRIALS</h3><p>伝説ポケモン４体に挑む特別ダンジョン。</p>${button('伝説の試練へ','go:battle','btn secondary wide')}</div></div>`}
function normalizePart(v){const t=String(v||'').trim().toLowerCase();if(['基礎','basic','base','a','基礎科目'].includes(t))return '基礎';if(['応用','applied','advanced','b','応用科目'].includes(t))return '応用';return '共通';}
function normalizeYear(v){return String(v??'').trim().replace(/年度$|年$/,'').replace(/^令和/,'R');}
function normalizeNumber(v){const t=String(v??'').trim();const m=t.match(/(\d+)\s*$/);return m?String(Number(m[1])):'';}
function questionKey(q){return normalizeYear(q.year)+'|'+normalizePart(q.part)+'|'+normalizeNumber(q.number);}
function matchesManual(q,m){return normalizeYear(q.year)===normalizeYear(m.year)&&normalizeNumber(q.number)===normalizeNumber(m.number)&&(normalizePart(q.part)===normalizePart(m.part)||normalizePart(q.part)==='共通'||normalizePart(m.part)==='共通');}
function isManualWeak(q){return (state.manualWeak||[]).some(m=>matchesManual(q,m));}
function isWeak(q){return state.reviews.includes(q.id)||isManualWeak(q);}
function weakList(){return questions.filter(isWeak);}
function studyYears(){const ys=[...new Set([...questions.map(q=>normalizeYear(q.year)),...(state.manualWeak||[]).map(m=>normalizeYear(m.year))].filter(Boolean))];return ys.sort((a,b)=>Number(b)-Number(a)||b.localeCompare(a,'ja'));}
function masteryCheck(q,h,correct){if(!correct)return false;const mastery=h.seen>=3&&h.correct/h.seen>=.8&&h.lastCorrect===true;if(mastery){state.reviews=state.reviews.filter(id=>id!==q.id);state.manualWeak=(state.manualWeak||[]).filter(m=>!matchesManual(q,m));}return mastery;}
function currentPracticePool(){if(studyFilter==='review')return weakList();return questions;}
function normalQ(q,i){
 if(!q||!q.question)return null;
 let choices=q.choices??q.options??q.selections;
 if(typeof choices==='string'){try{choices=JSON.parse(choices);}catch{choices=choices.split('|').map(v=>v.trim());}}
 if(!Array.isArray(choices)||choices.length<2)return null;
 let correct=q.correct??q.answer??q.correct_index??0;
 if(typeof correct==='string'&&/^\d+$/.test(correct.trim()))correct=Number(correct);
 else if(typeof correct==='string')correct=choices.indexOf(correct);
 if(!Number.isInteger(correct)||correct<0||correct>=choices.length)return null;
 const year=normalizeYear(q.year??q.exam_year??q.年度),part=normalizePart(q.part??q.section??q.exam_part??q.区分);
 const number=normalizeNumber(q.number??q.question_number??q.questionNo??q.no??q.問題番号);
 const id=String(q.id||((year&&number)?`yr-${year}-${part}-${number}`:`import-${i}-${String(q.question).slice(0,18)}`));
 return {id,question:String(q.question),choices:choices.map(String),correct,explanation:String(q.explanation||q.commentary||''),subject:String(q.subject||q.科目||'追加問題'),year,part,number,difficulty:q.difficulty||1,image:(String(q.image||'').startsWith('data:image/'))?String(q.image):''};
}
function nextQuestion(){
 const list=currentPracticePool();if(!list.length){currentQ=null;answered=false;return;}
 const weights=list.map(q=>isWeak(q)?8:!state.history[q.id]?7:1);
 let sum=weights.reduce((a,b)=>a+b,0),v=Math.random()*sum,idx=0;
 while(idx<list.length-1&&(v-=weights[idx])>=0)idx++;
 if(list.length>1&&currentQ?.id===list[idx].id)idx=(idx+1)%list.length;
 currentQ=list[idx];answered=false;selectedAnswer=-1;answerGood=false;
}
function studyImage(q){const url=state.questionImages?.[q.id]||q.image||'';return /^data:image\/(png|jpeg|webp|gif);base64,/.test(url)?`<img class="study-question-image" src="${url}" alt="問題に付属する画像" loading="lazy">`:'';}
function studyQuestionLabel(q){return `${q.year?escapeHTML(q.year+'年度')+' / ':''}${escapeHTML(q.part||'共通')}${q.number?' / 問'+escapeHTML(q.number):''} / ${escapeHTML(q.subject)}`;}
function practicePanel(){
 if(!currentQ)nextQuestion();
 const q=currentQ;
 const answers=q?q.choices.map((v,i)=>`<button class="choice ${answered?(i===q.correct?'correct':i===selectedAnswer?'wrong':''):''}" data-act="answer:${i}" ${answered?'disabled':''}><span>${String.fromCharCode(65+i)}</span>${escapeHTML(v)}</button>`).join(''):'';
 const reviewCount=weakList().length;
 return `<div class="cols"><div class="panel">${q?`<div class="row spread"><span class="kicker">${studyQuestionLabel(q)}</span><span class="pill">COMBO ×${state.combo}</span></div><div class="question">${escapeHTML(q.question)}</div>${studyImage(q)}<div class="choices">${answers}</div>${answered?`<div class="feedback"><b style="color:${answerGood?'var(--jade)':'var(--rose)'}">${answerGood?'正解！':'不正解・復習に登録'}</b><div>${escapeHTML(q.explanation)}</div></div>${button('次の問題 →','nextQuestion','btn wide')}`:''}<div class="study-inline-actions">${button(isManualWeak(q)?'★ 苦手指定中（解除）':'☆ この問題を苦手に指定','weakCurrent','btn secondary tiny')}${button('苦手を復習','practiceReview','btn secondary tiny')}</div><label class="study-image-upload">問題画像を追加 <input id="studyImageFile" type="file" accept="image/*"></label>`:`<h2>復習する問題がありません</h2><p class="sub">間違えた問題、または手動で登録した問題がここに出ます。</p>${button('すべての問題へ','practiceAll','btn wide')}`}</div><aside class="panel"><div class="eyebrow">GACHA PROGRESS</div><h2>あと ${5-state.credit} 問でガチャ1回</h2><div class="bar"><span style="width:${state.credit*20}%"></span></div><p class="sub">正解：${state.correct} / 回答：${state.studied}<br>未回答：${questions.filter(q=>!(state.history[q.id]?.seen)).length}問 / 苦手：${reviewCount}問</p><div class="row">${button('通常出題','studyAll',`btn tiny ${studyFilter==='all'?'':'secondary'}`)}${button('苦手優先','studyReview',`btn tiny ${studyFilter==='review'?'':'secondary'}`)}</div><hr class="study-divider"><h3>問題バンク追加</h3><p class="sub">CSV/JSONで問題を追加。CSVの列は question,choices,correct,explanation,subject,year,part,number,difficulty。choicesは | 区切りも可。</p><div class="study-import-meta"><label>年度<input id="importYear" placeholder="例 2021" value="${escapeHTML(importYear)}" inputmode="numeric"></label><label>区分<select id="importPart"><option value="基礎" ${importPart==='基礎'?'selected':''}>基礎</option><option value="応用" ${importPart==='応用'?'selected':''}>応用</option><option value="共通" ${importPart==='共通'?'selected':''}>共通</option></select></label></div><input id="questionFile" class="upload" type="file" multiple accept=".csv,.json,text/csv,application/json"><p class="data-note">CSVに年度・区分がある場合はそちらを優先。問題番号はnumber列を使います。</p></aside></div>`;
}
function weakPanel(){
 const manual=state.manualWeak||[],weak=weakList(),ys=studyYears();
 const grouped=[...new Set([...ys,...manual.map(m=>normalizeYear(m.year))])];
 const manualRows=grouped.map(year=>{const all=manual.filter(m=>normalizeYear(m.year)===year);const matched=weak.filter(q=>normalizeYear(q.year)===year);if(!all.length&&!matched.length)return '';return `<section class="study-weak-group"><h3>${escapeHTML(year)}年度 <small>指定${all.length}件 / 対象${matched.length}問</small></h3>${all.map(m=>{const count=questions.filter(q=>matchesManual(q,m)).length;return `<div class="study-weak-entry"><span>${escapeHTML(m.part)}・問${escapeHTML(m.number)} <small>${count?'収録 '+count+'問':'未収録（CSV追加後に反映）'}</small></span>${button('解除','weakRemove:'+encodeURIComponent(questionKey(m)),'btn secondary tiny')}</div>`}).join('')}</section>`}).join('');
 const automatic=weak.filter(q=>state.reviews.includes(q.id));
 return `<div class="panel"><h2>手動で苦手問題を登録</h2><p class="sub">年度・区分・問題番号を指定。まだCSVが入っていない年度も登録・表示できます。</p><div class="study-manual-input"><label>年度<input id="manualYear" inputmode="numeric" placeholder="2021" value="${escapeHTML(manualYear)}"></label><label>区分<select id="manualPart"><option value="基礎" ${manualPart==='基礎'?'selected':''}>基礎</option><option value="応用" ${manualPart==='応用'?'selected':''}>応用</option><option value="共通" ${manualPart==='共通'?'selected':''}>共通</option></select></label><label>問題番号<input id="manualNumbers" placeholder="1, 2, 5-10" value="${escapeHTML(manualNumbers)}"></label>${button('指定する','weakAdd','btn gold')}</div><p class="data-note">回答3回以上・正答率80%以上・直近正解で習得済みとなり、自動的にリストから外れます。手動での解除も可能。</p><div class="study-weak-summary"><b>苦手 ${weak.length}問</b><span>手動指定 ${manual.length}件</span><span>未登録問題 ${manual.filter(m=>!questions.some(q=>matchesManual(q,m))).length}件</span></div>${button('苦手だけ復習する','practiceReview','btn gold')}${button('苦手模試に挑む','examWeakMode','btn secondary')}</div><div class="panel section"><h2>年度別の苦手リスト</h2>${manualRows||'<p class="sub">手動指定はありません。</p>'}<h3>間違えた問題</h3><div class="study-weak-rows">${automatic.slice(0,80).map(q=>`<div class="study-weak-entry"><span>${studyQuestionLabel(q)}<small>${escapeHTML(q.question.slice(0,65))}</small></span>${button('習得済み','weakMaster:'+encodeURIComponent(q.id),'btn secondary tiny')}</div>`).join('')||'<p class="sub">まだありません。</p>'}</div></div>`;
}
function examQuestionPanel(){
 const ex=state.examDraft;
 if(!ex)return '';
 const q=questions.find(q=>q.id===ex.ids[ex.index]);
 if(!q)return `<div class="panel">問題が見つかりません。CSVを読み込み直してください。${button('試験終了','examAbandon','btn secondary')}</div>`;
 const chosen=ex.answers[ex.index],answeredCount=ex.answers.filter(n=>Number.isInteger(n)).length;
 return `<div class="panel"><div class="row spread"><span class="eyebrow">${escapeHTML(ex.mode)} / ${escapeHTML(ex.year)} / ${escapeHTML(ex.part)}</span><span class="pill">問題 ${ex.index+1}/${ex.ids.length}</span></div><div class="bar"><span style="width:${100*answeredCount/ex.ids.length}%"></span></div><p class="sub">回答済み ${answeredCount} / 未回答 ${ex.ids.length-answeredCount}　※正解・解説は終了後に表示</p><div class="kicker">${studyQuestionLabel(q)}</div><div class="question">${escapeHTML(q.question)}</div>${studyImage(q)}<div class="choices">${q.choices.map((c,i)=>`<button class="choice ${chosen===i?'study-picked':''}" data-act="examPick:${i}"><span>${String.fromCharCode(65+i)}</span>${escapeHTML(c)}</button>`).join('')}</div><div class="study-exam-nav">${button('← 前の問題','examPrev','btn secondary',ex.index===0?'disabled':'')}${button('次の問題 →','examNext','btn secondary',ex.index===ex.ids.length-1?'disabled':'')}${button('試験を終了・採点','examFinish','btn gold')}</div><p class="data-note">途中でページを移動しても答案は自動保存されます。</p></div>`;
}
function examResultPanel(){
 const result=examResult;if(!result)return '';
 return `<div class="panel"><div class="eyebrow">EXAM RESULT / ${escapeHTML(result.mode)}</div><h2>${result.correct}/${result.total} 点 <small>正答率 ${result.percent}%</small></h2><div class="bar"><span style="width:${result.percent}%"></span></div><p class="sub">未回答 ${result.unanswered}問 / ガチャ券 +${result.tickets}枚 / 不正解は復習問題へ登録しました。</p><div class="row">${button('もう一度受験','examClearResult','btn gold')}${button('苦手を復習','practiceReview','btn secondary')}</div><h3 class="section">解答・解説</h3><div class="study-exam-review">${result.items.map((item,i)=>`<div class="study-review-item ${item.correct?'right':'wrong'}"><b>問${i+1} ${item.correct?'○':'×'} ${escapeHTML(item.question.question.slice(0,95))}</b><small>${studyQuestionLabel(item.question)}</small><p>自分の解答：${Number.isInteger(item.answer)?escapeHTML(item.question.choices[item.answer]):'未回答'} / 正解：${escapeHTML(item.question.choices[item.question.correct])}</p><p>${escapeHTML(item.question.explanation)}</p></div>`).join('')}</div></div>`;
}
function examPanel(){
 if(examResult)return examResultPanel();
 if(state.examDraft)return examQuestionPanel();
 const ys=studyYears(),mode=examSettings.mode,opts=ys.map(y=>`<option value="${escapeHTML(y)}" ${examSettings.year===y?'selected':''}>${escapeHTML(y)}年度</option>`).join('');
 return `<div class="panel"><div class="eyebrow">MOCK EXAM</div><h2>試験モード</h2><p class="sub">試験中は正解を表示せず、最後に一括採点。登録問題数が110問未満ならある問題だけで受験できる。</p><div class="study-mode-grid">${[['random','ランダム模試','最大110問をランダム出題'],['weak','苦手模試','苦手登録済みを優先'],['real','本番モード','年度・区分の問題番号順']].map(([id,name,desc])=>`<button class="study-mode-card ${mode===id?'selected':''}" data-act="examMode:${id}"><b>${name}</b><small>${desc}</small></button>`).join('')}</div><div class="study-exam-config"><label>年度<select data-exam-field="year"><option value="all" ${examSettings.year==='all'?'selected':''}>全年度</option>${opts}</select></label><label>区分<select data-exam-field="part"><option value="all" ${examSettings.part==='all'?'selected':''}>基礎＋応用</option><option value="基礎" ${examSettings.part==='基礎'?'selected':''}>基礎</option><option value="応用" ${examSettings.part==='応用'?'selected':''}>応用</option><option value="共通" ${examSettings.part==='共通'?'selected':''}>共通</option></select></label></div><p class="data-note">本番モードでは「年度」を選び、その年度の収録問題すべてを番号順に出題。出題数を満点として100%換算します。</p>${button('試験を開始','examStart','btn gold wide')}<h3 class="section">試験履歴</h3>${(state.examHistory||[]).slice(0,12).map(x=>`<div class="study-exam-history"><span>${escapeHTML(x.date)} / ${escapeHTML(x.mode)} / ${escapeHTML(x.year)} ${escapeHTML(x.part)}</span><b>${x.correct}/${x.total} (${x.percent}%)</b></div>`).join('')||'<p class="sub">受験履歴はまだありません。</p>'}</div>`;
}
function study(){
 return `${heading('STUDY / EXAM ENGINE','勉強・試験・苦手管理','未回答・苦手を優先して学習。試験の採点結果も育成に反映。')}<div class="study-nav">${[['practice','問題演習'],['weak','苦手問題'],['exam','試験モード']].map(([p,label])=>`<button class="${studyView===p?'active':''}" data-act="studyTab:${p}">${label}</button>`).join('')}</div>${studyView==='weak'?weakPanel():studyView==='exam'?examPanel():practicePanel()}`;
}
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
 if(gachaAnimating)return notify('召喚演出中です');if(state.tickets<=0)return notify('ガチャ券が足りません');
 state.tickets--;
 gachaResult=drawGacha();gachaShiny=Math.random()<SHINY_GACHA_RATE;if(gachaShiny)grantShiny(gachaResult.id,'gacha');
 state.packsOpened++;
 state.owned[gachaResult.id]=(state.owned[gachaResult.id]||0)+1;addSource(gachaResult.id,'gacha');
 gachaBonusTM=Math.random()<.20?grantTM('gacha',1):null;
 gachaAnimating=!!state.settings?.effects;clearTimeout(gachaAnimationTimer);save();setPage('pack');
 if(gachaAnimating)gachaAnimationTimer=setTimeout(()=>{gachaAnimating=false;if(page==='pack')render();},1750);
 notify(gachaResult.rarity==='LG'?'✦ LEGEND！ 伝説の仲間を獲得！':'新しい仲間を1匹獲得！');
}
function pack(){
 const pity=state.pity;
 return `${heading('MONSTER SUMMON / KANTO','ポケモンガチャ','5問正解で1回。1回につき仲間が1匹登場。レア保証なし。')}
 <div class="gacha-banner"><div class="gacha-copy"><span class="eyebrow">KANTO GENERATION 01</span><h2 class="page-title">151 SUMMON</h2><p>初代151匹の中から1匹を召喚！<br>仲間が増えるほど編成の幅が広がる。</p><div class="row">${button('✦ 召喚ボールを開く','pullGacha','btn gold',state.tickets<1||gachaAnimating?'disabled':'')}<span class="pill">ガチャ券 ${state.tickets} 枚</span></div></div><div class="gacha-machine" aria-hidden="true">${summonBallHTML(gachaResult?.rarity||'N',gachaAnimating)}</div></div>
 ${gachaResult?`<section class="section summon-result rarity-${gachaResult.rarity}"><div class="eyebrow">SUMMON RESULT · 1 MONSTER</div><div class="summon-reveal ${gachaAnimating?'reveal-pending':''}"><div class="reveal-halo"></div><div class="gacha-ball-open">${summonBallHTML(gachaResult.rarity,gachaAnimating)}</div>${spriteTag(gachaResult.id,'summon-sprite',gachaShiny)}<div class="summon-description"><div class="eyebrow">#${String(gachaResult.dex).padStart(3,'0')} · ${typeOf(gachaResult)[0]}タイプ</div><h2>${escapeHTML(gachaResult.name)}</h2><strong class="summon-rank">${rankName(gachaResult.rarity)}</strong>${gachaShiny?'<div class="shiny-won">✦ 色違い出現！ ✦</div>':''}<p class="source-tag gacha-source">✦ ガチャ産 / ${GACHA_BALLS[gachaResult.rarity].name}</p><p>所持 ${state.owned[gachaResult.id]}匹</p>${button('編成する','go:team','btn secondary')}${gachaBonusTM?`<div class="gacha-tm-bonus">✦ おまけ：わざマシン「${escapeHTML(gachaBonusTM.name)}」をゲット！ ${button('確認','go:tm','btn tiny gold')}</div>`:''}</div></div></section>`:''}
 <div class="panel section"><p class="sub">ガチャ専用召喚ボールはレアごとに5種類。野生捕獲に使うボールとは別物です。</p><p class="sub">ガチャは必ずポケモン1匹。20%の確率でわざマシンが追加でもらえます。 ${button('わざマシンを見る','go:tm','btn secondary tiny')}</p><h3>ガチャ排出率</h3><p class="sub">N 72% / U 20% / R 6% / SR 1.6% / LG 0.4%。レア確定枠はありません。</p><p class="data-note">救済：10回以内にR以上、30回以内にSR以上、100回以内にLG。ガチャ回数 ${state.packsOpened} 回 / カウンター：R ${pity.r}/10、SR ${pity.sr}/30、LG ${pity.lg}/100</p></div>`;
}
function rankColor(r){return {N:'#b8c8b8',U:'#7fd9e1',R:'#82aeff',SR:'#d19eff',LG:'#ffe19b'}[r]}
function team(){if(!state.starter)return home();let owned=species.filter(s=>state.owned[s.id]);return `${heading('MONSTER MANAGEMENT','チーム編成','戦うのは1匹だけ。3匹を編成し、バトル中に好きなタイミングで交代できます。')}<div class="panel"><h2>出撃チーム <small class="sub">(${state.team.length}/3)</small></h2><div class="team-slots">${[0,1,2].map(i=>{let id=state.team[i],s=byId[id];return `<button class="slot" data-act="pickSlot:${i}">${s?`${spriteTag(id)}<strong>${s.name}</strong><small>育成 LV ${state.training[id]||1} / ${typeOf(s)[0]}</small>`:`<strong>＋</strong><small>仲間を選択</small>`}</button>`}).join('')}</div><p class="data-note">最初の1匹を操作。控えの2匹は攻撃せずHPを温存します。バトル中の交代で相性を活かそう。</p>${button('⚙ わざマシンで技を変更','go:tm','btn secondary wide')}</div><div class="section-head section"><h2>所持ポケモン (${owned.length})</h2><span class="eyebrow">TAP TO SELECT</span></div><div class="pokemon-grid">${owned.sort((a,b)=>a.dex-b.dex).map(s=>monCard(s,true)).join('')}</div>`}
function monCard(s,ownedOnly=false){let has=state.owned[s.id]||0,sel=state.team.includes(s.id);return `<button class="mon-card ${has?'':'missing'} ${sel?'selected':''}" data-act="mon:${s.id}" ${!has?'disabled':''}><span class="rank" style="border-color:${rankColor(s.rarity)};color:${rankColor(s.rarity)}">${s.rarity}</span>${spriteTag(s.id)}${shinyCount(s.id)?'<span class="shiny-mark">✦ 色違い ×'+shinyCount(s.id)+'</span>':''}<strong>${has?escapeHTML(s.name):'???'}</strong><small>#${String(s.dex).padStart(3,'0')} ${has?`×${has} / Lv${state.training[s.id]||1}`:'未発見'}</small></button>`}
function monDetail(id){let s=byId[id];if(!s||!state.owned[id])return;let lv=state.training[id]||1,cost=lv*18,orig=species.find(t=>t.from===id);modal(`<div class="row" style="gap:18px">${spriteTag(id)}<div><div class="eyebrow">DEX #${String(s.dex).padStart(3,'0')} / ${rankName(s.rarity)}</div><h2>${escapeHTML(s.name)}</h2><p class="sub">${typeOf(s)[0]}タイプ / 育成Lv${lv} / 所持${state.owned[id]}匹</p>${shinyCount(id)?`<p class="shiny-detail">✦ 色違いを ${shinyCount(id)}匹所持 / ${equippedShiny(id)?'色違いを使用中':'通常色を使用中'}</p>${button(equippedShiny(id)?'通常色で出撃':'色違いで出撃','shinyToggle:'+id,'btn gold tiny')}`:''}<p class="sub">入手元：✦ガチャ ${state.sources?.gacha?.[id]||0}匹 / ●野生捕獲 ${state.sources?.wild?.[id]||0}匹${state.owned[id]>(state.sources?.gacha?.[id]||0)+(state.sources?.wild?.[id]||0)?' / 以前の所持・進化':''}</p></div></div><div class="panel"><div class="row spread"><b>基礎HP ${s.hp}</b><b>攻撃 ${s.attack}</b></div><p class="sub">現在の技：${escapeHTML(moveFor(id).name)}。わざマシンで攻撃範囲・属性・連射速度を変更できます。</p>${orig?`<p class="sub">進化先：${orig.name}（戦闘中にレベルアップして進化）</p>`:''}</div><div class="row section">${button(`✧ ${cost} で育成Lv+1`,'train:'+id,'btn gold',state.dust<cost?'disabled':'')}${button(state.team.includes(id)?'編成中':'チームに入れる','addTeam:'+id,'btn secondary')}</div>${button('わざマシン','tmGo:'+id,'btn secondary')}${button('閉じる','closeModal','btn secondary wide')}`)}
function dex(){const filtered=species.filter(s=>dexFilter==='all'||dexFilter==='owned'&&state.owned[s.id]||s.type===dexFilter),count=Math.ceil(filtered.length/36);dexPage=clamp(dexPage,0,Math.max(0,count-1));const list=filtered.slice(dexPage*36,dexPage*36+36);let have=species.filter(s=>state.owned[s.id]).length;return `${heading('KANTO POKEDEX','初代151匹図鑑','未発見はシルエット表示。集めた仲間で自分だけのチームを作ろう。')}<div class="panel"><div class="row spread"><div><div class="eyebrow">DISCOVERED</div><h2 style="font-size:31px;margin:3px 0">${have} <small style="color:var(--muted)">/ 151</small></h2></div><div class="pill">${Math.round(have/151*100)}% COMPLETE</div></div><div class="bar"><span style="width:${have/151*100}%"></span></div><div class="controls">${[['all','すべて'],['owned','所持'],...Object.entries(TYPES).map(([k,v])=>[k,v[0]])].map(([k,v])=>`<button class="control ${dexFilter===k?'active':''}" data-act="dexFilter:${k}">${v}</button>`).join('')}</div><div class="pokemon-grid">${list.map(s=>monCard(s)).join('')}</div><div class="row spread section">${button('← 前へ','dexPrev','btn secondary tiny',dexPage===0?'disabled':'')}<span class="sub">${dexPage+1} / ${Math.max(count,1)}ページ</span>${button('次へ →','dexNext','btn secondary tiny',dexPage>=count-1?'disabled':'')}</div></div><p class="data-note section">非公式・非商用の学習用ファンプロトタイプです。ポケモンの名称は各権利者の商標です。懐かしいポケモンのゲームスプライトを外部参照し、接続できない場合は独自の仮描画に切り替わります。</p>`}
function battle(){if(game){return `<div class="game-shell"><div class="game-hud"><div><div class="eyebrow">${game.mode==='gym'||game.mode==='rematch'?'GYM · '+escapeHTML(GYMS[game.gymIndex].leader):game.mode==='league'?'LEAGUE · '+escapeHTML(LEAGUE[game.challengeIndex].tag):game.mode==='legend'?'LEGEND · '+escapeHTML(LEGENDS[game.legendIndex].tag):'KANTO · '+escapeHTML(STAGES[game.stage].tag)}</div><strong>${modeTitle(game)}</strong> <small>移動：WASD / 方向キー / タッチスライド</small></div>${button(game.paused?'▶ 再開':'Ⅱ 一時停止','pause','btn secondary tiny')}</div><div class="game-canvas-wrap" id="canvasWrap"><canvas id="battleCanvas" class="game-canvas" width="960" height="600" aria-label="サバイバル対戦フィールド"></canvas><div class="game-top"><div><div class="healthline"><span><span id="activeName">ポケモン</span> ♥ <span id="hpText"></span></span><span id="runLevel"></span></div><div class="bar"><span id="hpFill"></span></div><div style="height:6px;background:#345163;margin-top:5px;border-radius:4px;overflow:hidden"><span id="xpFill" style="display:block;width:0;height:100%;background:#e6c77a"></span></div></div><div><span id="runTimer">00:00</span><div style="font-size:10px;color:#a3d0b4">撃破 <span id="runKills">0</span> / WAVE <span id="runWave">1</span>${isBossChallenge(game)?` <span class="gym-hud-badge" id="gymWave">BOSS ${Math.min(game.gymBossKills+1,challengeRoster(game).length)} / ${challengeRoster(game).length}</span>`:''}</div></div></div><div id="pauseOverlay" class="game-paused" hidden><div class="panel"><h2>PAUSED</h2>${button('▶ 冒険を再開','pause','btn wide')}${button('冒険を終了','leaveRun','btn danger wide','style="margin-top:10px"')}</div></div></div><div class="switch-panel"><div class="switch-heading"><span>手持ちポケモン / 1匹ずつ召喚</span><small id="switchTimer">交代可能</small></div><div class="switch-slots">${game.team.map((a,i)=>`<button class="switch-mon ${i===game.activeIndex?'selected':''}" data-act="swap:${i}" data-switch="${i}" aria-label="${escapeHTML(byId[a.id].name)}に交代"><span class="switch-img">${spriteTag(a.id)}</span><span class="switch-meta"><b>${escapeHTML(byId[a.id].name)}</b><small>${typeOf(byId[a.id])[0]} / ${moveFor(a.id).name}</small><span class="switch-hp-bg"><span class="switch-hp-fill" style="width:${Math.max(0,100*a.hp/a.maxHp)}%"></span></span><small class="switch-hp-text">${hpLabel(a.hp)} / ${a.maxHp}</small></span></button>`).join('')}</div></div><div class="game-bottom"><span id="activeMove">⚔ ${escapeHTML(moveFor(activePokemon(game).id).name)}</span><span id="targetTypeHint">敵のタイプを見て交代！</span></div><p class="game-help">ボールはバトル報酬で獲得。捕獲はバトル終了後に挑戦できます。手持ちをタップして交代（PCは1〜3キー）。相性が有利な技は1.6倍、不利な技は0.65倍。控えのHPは温存されます。</p></div>`}
return `${heading('SELECT STAGE','サバイバルに出撃','フィールドを自由に移動し、群れを倒してレベルアップ。ボス討伐で次のステージが開放されます。')}<div class="stage-grid">${STAGES.map((st,i)=>`<button class="stage ${i<state.stages?'active':'locked'}" data-act="stage:${i}" ${i>=state.stages?'disabled':''}><span class="eyebrow">STAGE 0${i+1} / ${escapeHTML(st.tag)}</span><b>${i>=state.stages?'🔒 ':''}${escapeHTML(st.name)}</b><small>${escapeHTML(st.desc)}</small></button>`).join('')}</div><div class="panel section"><h2>出撃パーティ</h2><div class="team-slots">${state.team.map(id=>`<div class="slot">${spriteTag(id)}<strong>${byId[id].name}</strong><small>${equippedShiny(id)?'✦ 色違い / ':''}育成 Lv ${state.training[id]||1}</small></div>`).join('')}</div><div class="row section">${button('⚔ 出撃する','beginRun:'+selectedStage,'btn gold')}${button('チーム変更','go:team','btn secondary')}<span class="pill">${STAGES[selectedStage]?.name}</span></div></div><section class="endgame-block section"><div class="challenge-head"><span class="eyebrow">LEGENDARY DUNGEONS</span><h2>伝説ポケモンの試練</h2><p>4バッジで三鳥のダンジョンを解放。ミュウツーは8バッジと殿堂入りが条件。ボス撃破後に1回だけ捕獲でき、色違い確率は捕獲成功時1/128。</p></div><div class="endgame-grid">${LEGENDS.map((entry,i)=>{const unlocked=legendaryUnlocked(i),clears=state.legendClears?.[i]||0;return `<article class="endgame-card legend-card ${unlocked?'':'locked'} ${i===3?'champion':''}"><span class="eyebrow">${entry.tag}</span><div class="legend-art">${spriteTag(entry.id,'legend-sprite')}</div><h3>${entry.name}</h3><strong>${byId[entry.id].name}</strong><p>${entry.desc}</p><div class="row spread"><small>${clears?'✓ 撃破 '+clears+'回':unlocked?'挑戦可能':'🔒 '+(entry.needChampion?'殿堂入りが必要':'バッジ4個が必要')}</small>${button('出撃する','startLegend:'+i,'btn gold tiny',!unlocked?'disabled':'')}</div></article>`}).join('')}</div></section>`}
const POKEMON_ASSETS=new Map();
function hydrateSprites(){document.querySelectorAll('img[data-pokemon]').forEach(el=>{const dex=Number(el.dataset.pokemon),shiny=el.dataset.shiny==='1',key=dex+'-'+(shiny?'s':'n');let rec=POKEMON_ASSETS.get(key);if(rec?.ok){el.src=rec.src;return;}if(rec)return;const id='p'+String(dex).padStart(3,'0'),src=pokemonSpriteURL(id,shiny);if(!src)return;rec={ok:false,src};POKEMON_ASSETS.set(key,rec);const img=new Image();img.onload=()=>{rec.ok=true;document.querySelectorAll('img[data-pokemon="'+dex+'"][data-shiny="'+(shiny?'1':'0')+'"]').forEach(node=>{if(node.isConnected)node.src=src});};img.onerror=()=>{rec.failed=true};img.src=src;})}

function gym(){if(!state.starter)return home();const have=state.gymBadges||0;
 const leagueWins=Math.min(5,state.leagueWins||0),rematchCount=Object.keys(state.gymRematches||{}).length;
 return `${heading('KANTO GYM CHALLENGE','カントー8ジム','バッジを集めて四天王・チャンピオン戦を解放しよう。')}
 <div class="gym-progress"><strong>獲得バッジ ${have} / 8</strong><div class="gym-badge-strip">${GYMS.map((entry,i)=>`<span class="gym-medal ${i<have?'won':''}" title="${entry.badge}">${i<have?'◆':'◇'}</span>`).join('')}</div></div>
 <div class="gym-grid">${GYMS.map((entry,i)=>{const unlocked=i<=have,cleared=i<have;return `<article class="gym-card ${unlocked?'':'gym-locked'} ${cleared?'gym-cleared':''} ${i===7?'final-gym':''}"><div class="gym-card-top"><span>GYM ${String(i+1).padStart(2,'0')}</span><span>${cleared?'◆ CLEAR':unlocked?'CHALLENGE':'🔒 LOCKED'}</span></div><div class="gym-leader-icon">${['🪨','💧','⚡','🌿','☠','🔮','🔥','♛'][i]}</div><h3>${entry.name}</h3><strong class="gym-leader-name">${entry.leader}</strong><p>${entry.hint}</p><div class="gym-opponent-preview">${entry.roster.map(n=>spriteTag('p'+String(n).padStart(3,'0'),'gym-mini')).join('')}</div><div class="gym-footer"><span>${entry.badge}</span>${button(cleared?'再挑戦':i===7?'最終ジムへ':'挑戦する','startGym:'+i,'btn gold tiny',!unlocked?'disabled':'')}</div></article>`}).join('')}</div>
 <section class="endgame-block section" id="leaguePanel"><div class="challenge-head"><span class="eyebrow">POKÉMON LEAGUE</span><h2>四天王＆チャンピオン</h2><p>8個のバッジで解放。四天王4人を順番に倒し、最後にチャンピオンへ。手持ち3匹のHP管理・タイプ相性・技を使い分けよう。</p><strong>進行 ${leagueWins} / 5　${state.hallOfFame?'🏆 殿堂入り ×'+state.hallOfFame:''}</strong></div>
 <div class="endgame-grid">${LEAGUE.map((entry,i)=>{const unlocked=have===8&&i<=leagueWins,won=i<leagueWins;return `<article class="endgame-card ${unlocked?'':'locked'} ${i===4?'champion':''}"><span class="eyebrow">${entry.tag} · ${typeOf({type:entry.type})[0]}</span><h3>${entry.name}</h3><div class="endgame-roster">${entry.roster.map(n=>spriteTag('p'+String(n).padStart(3,'0'),'gym-mini')).join('')}</div><p>${entry.desc}</p><div class="row spread"><small>${won?'✓ CLEAR':unlocked?'挑戦可能':'🔒 未解放'}</small>${button(won?'再挑戦':i===4?'殿堂入りを目指す':'挑戦する','startLeague:'+i,'btn gold tiny',!unlocked?'disabled':'')}</div></article>`}).join('')}</div></section>
 <section class="endgame-block section" id="rematchPanel"><div class="challenge-head"><span class="eyebrow">GYM LEADER REMATCH</span><h2>強化ジムリーダー再戦</h2><p>8ジム制覇後に解放。通常ジムより高HP・高速の弾幕・長い連戦。勝利報酬はレア以上のわざマシンとハイパーボール。</p><strong>再戦撃破 ${rematchCount} / 8</strong></div>
 <div class="rematch-grid">${GYMS.map((entry,i)=>`<div class="rematch-item"><span class="rematch-medal">${(state.gymRematches||{})[i]?'◆':'◇'}</span><div><strong>${entry.leader}</strong><small>${entry.badge} / 強化${entry.roster.length+1}連戦</small></div>${button('再戦する','startRematch:'+i,'btn secondary tiny',have<8?'disabled':'')}</div>`).join('')}</div></section>`;
}
function render(){resources();$('main').innerHTML=({home,study,pack,team,battle,dex,tm:machine,gym}[page]||home)();hydrateSprites();if(page==='battle'&&game){attachCanvas();updateHUD();const overlay=$('pauseOverlay');if(overlay)overlay.hidden=!game.paused;}if(page==='study'){let inp=$('questionFile');inp?.addEventListener('change',e=>questionImport(e.target.files[0]),{once:true});}}
// ----- Real-time survivor battle -----
function startRun(stage,gymIndex=null,challenge=null){if(!state.team.length)return notify('編成から仲間を選択してください');if(!challenge&&gymIndex===null&&stage>=state.stages)return notify('まだ解放されていないダンジョンです');
 if(challenge){if(challenge.mode==='league'&&((state.gymBadges||0)<8||challenge.index>(state.leagueWins||0)||challenge.index<0||challenge.index>=LEAGUE.length))return notify('まだリーグに挑戦できません');
 if(challenge.mode==='rematch'&&((state.gymBadges||0)<8||challenge.index<0||challenge.index>=8))return notify('8個のバッジを先に集めよう');
 if(challenge.mode==='legend'&&!legendaryUnlocked(challenge.index))return notify('伝説のダンジョンの解放条件を満たしていません');}
 selectedStage=stage;const mobile=matchMedia('(max-width:540px)').matches;game={running:true,paused:false,choosing:false,stage,seconds:0,level:1,xp:0,xpNeed:6,activeIndex:0,switchCooldown:0,lastTypeHint:0,invuln:0,position:{x:0,y:0},vx:0,vy:0,kills:0,spawn:0,boss:false,bossDead:false,boost:{power:1,rate:1,multi:0,speed:1,magnet:1,orbit:0,defense:1},team:state.team.map((id,i)=>({id,x:0,y:0,cd:0.2,idx:i,shiny:equippedShiny(id),maxHp:pokemonMaxHP(byId[id],id),hp:pokemonMaxHP(byId[id],id)})),enemies:[],shots:[],drops:[],particles:[],floats:[],bossShots:[],camera:{x:0,y:0},lastFrame:0,autoPaused:false,terrainCache:null,joy:{active:false,id:null,bx:0,by:0,dx:0,dy:0},mobile,w:mobile?720:960,h:mobile?960:600,evolutionMilestones:new Set(),enemyUid:0,encountered:{},defeatedSpecies:{},captureChance:null,captures:0,capturedNames:[],mode:challenge?.mode||(gymIndex===null?'dungeon':'gym'),difficulty:challenge?.mode==='league'?7+challenge.index*1.4:challenge?.mode==='rematch'?8+challenge.index*1.2:challenge?.mode==='legend'?7+challenge.index*2:gymIndex??stage,gymIndex:challenge?.mode==='rematch'?challenge.index:gymIndex,challengeIndex:challenge?.mode==='league'?challenge.index:null,legendIndex:challenge?.mode==='legend'?challenge.index:null,gymBossKills:0,bossWarning:0};page='battle';render();cancelAnimationFrame(raf);raf=requestAnimationFrame(frame)}
function attachCanvas(){const canvas=$('battleCanvas');if(!canvas||!game)return;canvas.width=game.w;canvas.height=game.h;const point=(evt)=>{let b=canvas.getBoundingClientRect();return {x:(evt.clientX-b.left)*canvas.width/b.width,y:(evt.clientY-b.top)*canvas.height/b.height}};canvas.onpointerdown=e=>{if(game.paused)return;let p=point(e);game.joy={active:true,id:e.pointerId,bx:p.x,by:p.y,dx:0,dy:0,t0:performance.now()};try{canvas.setPointerCapture(e.pointerId)}catch(_){/* Some synthetic and legacy touch events lack capture */}};canvas.onpointermove=e=>{if(!game.joy.active||game.joy.id!==e.pointerId)return;let p=point(e),j=game.joy,dx=p.x-j.bx,dy=p.y-j.by,l=Math.hypot(dx,dy),s=Math.min(1,l/74);j.dx=l?dx/l*s:0;j.dy=l?dy/l*s:0};canvas.onpointerup=canvas.onpointercancel=e=>{if(game.joy.id===e.pointerId)game.joy.active=false;};}
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
 const target=nearby[0];if(target){const s=byId[a.id],move=moveFor(a.id),stab=move.type===s.type?1.13:1;
 const base=(s.attack*.33+12)*(1+((state.training[a.id]||1)-1)*.1)*g.boost.power*(move.power||1)*stab;
 const ang=Math.atan2(target.y-a.y,target.x-a.x),num=Math.min(8,1+g.boost.multi+(move.shots||1)-1);
 for(let h=0;h<num;h++){const theta=ang+(h-(num-1)/2)*(move.spread||.16),speed=355*(move.speed||1);g.shots.push({x:a.x,y:a.y,vx:Math.cos(theta)*speed,vy:Math.sin(theta)*speed,ttl:(move.range||455)/speed,damage:base,rad:move.splash?11:move.type==='dragon'?10:7,type:move.type,pierce:move.pierce||1,splash:move.splash||0,slow:move.slow||0,hit:new Set()})}
 a.cd=Math.max(.17,(1.02-(s.stage||0)*.04)*g.boost.rate*(move.rate||1));
 }}}

g.spawn-=dt;if(g.spawn<=0&&g.enemies.length<105){let count=(g.seconds<4?3:1+Math.floor(g.seconds/23))+g.stage;count=Math.min(9,count);for(let i=0;i<count;i++)spawnEnemy();g.spawn=Math.max(.27,.92-g.seconds/220)}if(!g.boss&&g.seconds>=(isBossChallenge(g)?22:g.mode==='legend'?48:66)){spawnBoss();g.boss=true;notify('⚠ 大型ボスが出現！')}
for(let e of g.enemies){const d=Math.hypot(g.position.x-e.x,g.position.y-e.y)||1,move=(e.boss?26+g.stage*5:Math.min(70,38+g.seconds*.33+g.stage*7))*(g.seconds<(e.slowUntil||0)?(e.slowFactor||1):1);e.x+=(g.position.x-e.x)/d*move*dt;e.y+=(g.position.y-e.y)/d*move*dt;e.anim+=dt;if(d<e.size*.66+19&&g.invuln<=0){takePlayerDamage(e.boss?26:13+g.stage*3,byId[e.id].type);if(!g.running)return}if(e.boss){e.skill-=dt;if(e.skill<=0){const volley=isBossChallenge(g)?Math.min(20,7+Math.round(g.difficulty*1.7)):g.mode==='legend'?16+Math.floor(g.legendIndex*1.1):9;for(let j=0;j<volley;j++){let theta=j/volley*Math.PI*2+g.seconds*.7;g.bossShots.push({x:e.x,y:e.y,vx:Math.cos(theta)*(130+(g.difficulty||0)*8),vy:Math.sin(theta)*(130+(g.difficulty||0)*8),ttl:3,type:byId[e.id].type})}e.skill=isBossChallenge(g)?Math.max(1.35,3.3-g.difficulty*.17):g.mode==='legend'?Math.max(1.7,2.75-g.legendIndex*.22):3.8}}}
for(let p of g.shots){p.x+=p.vx*dt;p.y+=p.vy*dt;p.ttl-=dt;for(let e of g.enemies){if(p.hit.has(e.uid)||e.hp<=0)continue;if(Math.hypot(e.x-p.x,e.y-p.y)<e.size*.48+p.rad){p.hit.add(e.uid);
 const mult=gymEffectiveness(p.type,e,g),damage=Math.max(1,Math.round(p.damage*mult));e.hp-=damage;
 if(p.slow){e.slowUntil=Math.max(e.slowUntil||0,g.seconds+1.8);e.slowFactor=Math.min(e.slowFactor||1,p.slow);}
 floatText(e.x,e.y-16,(mult>1?'↗':mult<1?'↘':'')+damage,mult>1?'#fff18b':mult<1?'#a7d7e8':'#faf0ad');
 if(mult!==1&&g.seconds>g.lastTypeHint){floatText(e.x,e.y-38,mult>1?'ばつぐん！':'いまひとつ','#f3ebbf');g.lastTypeHint=g.seconds+.85;}
 if(e.hp<=0)killEnemy(e);
 if(p.splash){for(const other of g.enemies){if(other===e||other.hp<=0||Math.hypot(other.x-e.x,other.y-e.y)>p.splash)continue;const areaDmg=Math.max(1,Math.round(p.damage*.52*gymEffectiveness(p.type,other,g)));other.hp-=areaDmg;if(p.slow){other.slowUntil=g.seconds+1.8;other.slowFactor=p.slow;}if(other.hp<=0)killEnemy(other);}}
 p.pierce--;if(p.pierce<=0){p.ttl=0;break;}}}}
g.shots=g.shots.filter(x=>x.ttl>0).slice(-220);g.enemies=g.enemies.filter(e=>e.hp>0);for(let p of g.bossShots){p.x+=p.vx*dt;p.y+=p.vy*dt;p.ttl-=dt;if(Math.hypot(p.x-g.position.x,p.y-g.position.y)<21&&g.invuln<=0){takePlayerDamage(17+(isBossChallenge(g)?Math.round(g.difficulty*3):g.mode==='legend'?g.legendIndex*6+6:0),p.type||STAGES[g.stage].type);p.ttl=0;if(!g.running)return}}g.bossShots=g.bossShots.filter(p=>p.ttl>0);
for(let p of g.drops){let dx=g.position.x-p.x,dy=g.position.y-p.y,d=Math.hypot(dx,dy)||1;if(d<85*g.boost.magnet){p.x+=dx/d*Math.min(d,220*dt);p.y+=dy/d*Math.min(d,220*dt)}if(d<26){g.xp+=p.value;p.dead=true}}g.drops=g.drops.filter(x=>!x.dead).slice(-120);if(g.xp>=g.xpNeed&&!g.choosing){g.xp-=g.xpNeed;g.level++;g.xpNeed=6+g.level*4;levelUp();}
if(g.boost.orbit>0){for(let e of g.enemies){let ang=Math.atan2(e.y-g.position.y,e.x-g.position.x);for(let j=0;j<g.boost.orbit;j++){let theta=g.seconds*(1.9)+j*Math.PI*2/g.boost.orbit,orbX=g.position.x+Math.cos(theta)*78,orbY=g.position.y+Math.sin(theta)*78;if(Math.hypot(e.x-orbX,e.y-orbY)<e.size*.5+12&&Math.random()<dt*6){e.hp-=20*g.boost.power*gymEffectiveness(byId[activePokemon(g).id].type,e,g);if(e.hp<=0)killEnemy(e)}}}}
for(let a of g.particles){a.x+=a.vx*dt;a.y+=a.vy*dt;a.ttl-=dt}g.particles=g.particles.filter(x=>x.ttl>0).slice(-110);for(let x of g.floats){x.y-=25*dt;x.ttl-=dt}g.floats=g.floats.filter(x=>x.ttl>0).slice(-70);if(g.bossDead){finishRun(true)}}
function spawnEnemy(){let g=game,angle=rnd(0,Math.PI*2),range=rnd(220,315),pool=(g.mode==='gym'||g.mode==='rematch')?GYMS[g.gymIndex].roster:g.mode==='league'?LEAGUE[g.challengeIndex].roster:g.mode==='legend'?LEGENDS[g.legendIndex].minions:g.stage===0?[10,13,16,19,21,29,41,43,46,48]:g.stage===1?[4,5,37,58,66,74,77,95,109]:g.stage===2?[63,92,93,94,96,100,123,124,125,142]:g.stage===3?[86,87,90,91,124,131,54,55]:g.stage===4?[66,67,74,75,95,104,105]:g.stage===5?[72,73,98,99,116,117,118,119,129]:g.stage===6?[23,24,41,42,88,89,92,93,109]:[142,143,146,147,148,149],id='p'+String(pick(pool)).padStart(3,'0'),s=byId[id],size=57+(s.stage||0)*9;g.encountered[id]=(g.encountered[id]||0)+1;g.enemies.push({uid:++g.enemyUid,id,x:g.position.x+Math.cos(angle)*range,y:g.position.y+Math.sin(angle)*range,hp:Math.round((78+g.seconds*.55+g.stage*22+(isBossChallenge(g)?g.difficulty*14:g.mode==='legend'?g.difficulty*12:0))*(s.rarity==='R'?1.4:1)),maxHp:Math.round((78+g.seconds*.55+g.stage*22+(isBossChallenge(g)?g.difficulty*14:g.mode==='legend'?g.difficulty*12:0))*(s.rarity==='R'?1.4:1)),size,boss:false,anim:rnd(0,10)})}
function spawnBoss(){let g=game,id,hp;
 if(isBossChallenge(g)){
  const roster=challengeRoster(g),index=Math.min(g.gymBossKills,roster.length-1);
  id='p'+String(roster[index]).padStart(3,'0');
  hp=Math.round(430+g.difficulty*240+index*185+(g.mode==='rematch'?500:0)+(g.mode==='league'&&g.challengeIndex===4?650:0));
  g.bossWarning=g.seconds+1;notify('⚠ '+endgameName(g)+' の '+byId[id].name+' が登場！');
 }else if(g.mode==='legend'){
  id=LEGENDS[g.legendIndex].id;
  hp=Math.round(3600+g.legendIndex*1900+(g.legendIndex===3?2100:0));
  g.bossWarning=g.seconds+1;notify('✦ 伝説の '+byId[id].name+' が出現！');
 }else {id=STAGES[g.stage].boss;hp=1100+g.stage*610;}
 g.enemies.push({uid:++g.enemyUid,id,x:g.position.x+340,y:g.position.y-145,hp,maxHp:hp,size:g.mode==='legend'?160:isBossChallenge(g)?116:148,boss:true,anim:0,skill:2.2});
}
function killEnemy(e){
 if(e.dead)return;e.dead=true;e.hp=0;game.kills++;
 if(!e.boss)game.defeatedSpecies[e.id]=(game.defeatedSpecies[e.id]||0)+1;
 if(e.boss){if(isBossChallenge(game)){
  game.gymBossKills++;
  if(game.gymBossKills>=challengeRoster(game).length)game.bossDead=true;
  else {game.bossShots=[];spawnBoss();}
 }else game.bossDead=true;}
 game.drops.push({x:e.x,y:e.y,value:e.boss?18:1+(e.size>50?1:0)});
 for(let i=0;i<4;i++)game.particles.push({x:e.x,y:e.y,vx:rnd(-90,90),vy:rnd(-90,90),ttl:rnd(.3,.7),color:typeOf(byId[e.id])[1]});
}
function floatText(x,y,t,color){game.floats.push({x,y,txt:String(t),ttl:.55,color})}
function levelUp(){let g=game;g.choosing=true;g.paused=true;let available=[...UPGRADES].sort(()=>Math.random()-.5).slice(0,3);modal(`<div class="eyebrow">LEVEL UP / ${g.level}</div><h2>新しい力を選択</h2><p class="sub">知識と経験を力に変えて、残りの群れを突破しよう。</p><div class="reward-options">${available.map(x=>`<button class="reward" data-act="upgrade:${x.id}"><span>${x.icon}</span><b>${x.name}</b><small>${x.desc}</small></button>`).join('')}</div><p class="data-note">1つ選ぶとすぐに戦闘を再開します。</p>`)}
function evolveInRun(){let g=game;if(!g||!g.running)return;
 const a=activePokemon(g);if(!a)return;const origin=byId[a.id],next=species.find(x=>x.from===origin.id);
 if(next&&(origin.stage===0?g.level>=6:g.level>=12)&&!g.evolutionMilestones.has(a.idx+':'+a.id)){
  g.evolutionMilestones.add(a.idx+':'+a.id);
  const fraction=a.maxHp>0?a.hp/a.maxHp:1;if(a.shiny){grantShiny(next.id,'wild');state.shinyEquipped[next.id]=true;}a.id=next.id;const inherited=(state.learnedMoves[origin.id]||[]).filter(id=>tmCanLearn(next,TM_BY_ID[id]));state.learnedMoves[next.id]=[...new Set([...(state.learnedMoves[next.id]||[]),...inherited])];const currentTM=state.equippedMoves[origin.id];if(currentTM&&inherited.includes(currentTM))state.equippedMoves[next.id]=currentTM;a.maxHp=pokemonMaxHP(next,next.id,g.boost.hpBonus||0);a.hp=Math.max(1,Math.round(a.maxHp*fraction));
  state.owned[next.id]=(state.owned[next.id]||0)+1;state.training[next.id]=Math.max(state.training[next.id]||1,Math.floor((state.training[origin.id]||1)*.7));
  save();notify(origin.name+' → '+next.name+' に進化！');updateHUD();
 }}
function chooseUpgrade(id){if(!game?.choosing)return;let g=game;switch(id){case 'power':g.boost.power*=1.25;break;case 'rate':g.boost.rate*=.83;break;case 'multi':g.boost.multi=Math.min(4,g.boost.multi+1);break;case 'speed':g.boost.speed*=1.14;break;case 'hp':g.boost.hpBonus=(g.boost.hpBonus||0)+35;for(const p of g.team){p.maxHp+=35;if(p.hp>0)p.hp+=35;}break;case 'magnet':g.boost.magnet*=1.48;break;case 'orbit':g.boost.orbit=Math.min(5,g.boost.orbit+1);break;case 'defense':g.boost.defense*=.87;break;case 'heal':{const p=activePokemon(g);if(p)p.hp=Math.min(p.maxHp,p.hp+70);break;}}g.choosing=false;g.paused=false;$('modal').hidden=true;evolveInRun();updateHUD()}
function gamePause(){if(!game)return; if(game.choosing)return;game.paused=!game.paused;game.autoPaused=false;game.lastFrame=0;let pause=$('pauseOverlay');if(pause)pause.hidden=!game.paused;let b=document.querySelector('[data-act="pause"]');if(b)b.textContent=game.paused?'▶ 再開':'Ⅱ 一時停止'}
function finishRun(win,abandon=false){
 if(!game)return;const g=game;if(!g.running)return;
 g.running=false;g.paused=true;cancelAnimationFrame(raf);keys.clear();
 const bonus=g.mode==='league'?220+g.challengeIndex*110:g.mode==='rematch'?210+g.gymIndex*65:g.mode==='legend'?170+g.legendIndex*90:g.mode==='gym'?120+g.gymIndex*55:80;
 const gain=abandon?0:Math.floor(g.kills/7)+(win?bonus:12),ticket=win?1:0;
 g.rewardDust=gain;g.outcomeWin=win;g.outcomeAbandon=abandon;
 g.ballRewards=rewardCaptureBalls(g,win,abandon);g.tmReward=null;
 if(!abandon){
  state.dust+=gain;state.tickets+=ticket;
  if(win&&g.mode==='rematch'){
   g.tmReward=addTMByTier(Math.random()<.18?'SR':'R');
   state.gymRematches[g.gymIndex]=(state.gymRematches[g.gymIndex]||0)+1;
   state.balls.ultra=(state.balls.ultra||0)+2;
   if(Math.random()<.012)state.balls.master=(state.balls.master||0)+1;
  }else if(win&&g.mode==='league'){
   g.tmReward=addTMByTier(g.challengeIndex===4?'SR':Math.random()<.16?'SR':'R');
   state.leagueWins=Math.max(state.leagueWins||0,g.challengeIndex+1);
   if(g.challengeIndex===4){const firstHall=(state.hallOfFame||0)===0;state.hallOfFame=(state.hallOfFame||0)+1;if(firstHall)state.balls.master=(state.balls.master||0)+1;else state.balls.ultra=(state.balls.ultra||0)+2;}
   else state.balls.ultra=(state.balls.ultra||0)+2;
  }else if(win&&g.mode==='legend'){
   state.legendClears[g.legendIndex]=(state.legendClears[g.legendIndex]||0)+1;
   if(Math.random()<.35)g.tmReward=addTMByTier('SR');
   state.balls.ultra=(state.balls.ultra||0)+1;
  }else if((win&&Math.random()<.65)||(!win&&g.kills>=30&&Math.random()<.12))g.tmReward=grantTM('battle',g.stage);
  if(win){state.clears++;if(g.mode==='gym'){
    state.gymBadges=Math.max(state.gymBadges,g.gymIndex+1);
    state.balls.great=(state.balls.great||0)+2;
    state.balls.ultra=(state.balls.ultra||0)+(g.gymIndex>=3?2:1);
   }else if(g.mode==='dungeon')state.stages=Math.max(state.stages,Math.min(STAGES.length,g.stage+2));}
  const choices=(isBossChallenge(g)?[]:chooseCaptureCandidates(g,win));
  g.captureChance={options:choices,selected:choices[0]||null,attempted:false,animating:false,result:null,ball:null};
  save();
 }
 refreshRewardModal(g);
}
function draw(){let g=game,canvas=$('battleCanvas');if(!canvas)return;let c=canvas.getContext('2d',{alpha:false});c.imageSmoothingEnabled=false;let w=g.w,h=g.h,ox=w/2-g.camera.x,oy=h/2-g.camera.y;drawCachedTerrain(c,g,ox,oy);function screen(x,y){return {x:x+ox,y:y+oy}}
// XP crystals, then enemies, allies, abilities on top
for(let gem of g.drops){let p=screen(gem.x,gem.y);c.fillStyle='#36c0ff';c.beginPath();c.moveTo(p.x,p.y-7);c.lineTo(p.x+5,p.y);c.lineTo(p.x,p.y+7);c.lineTo(p.x-5,p.y);c.fill();c.fillStyle='#d4f8ff';c.fillRect(p.x-1,p.y-4,2,4)}
for(let e of g.enemies){let p=screen(e.x,e.y);if(p.x<-140||p.x>w+140||p.y<-140||p.y>h+140)continue;let sz=e.size,cx=p.x-sz/2,cy=p.y-sz/2+Math.sin(e.anim*4)*2;c.fillStyle='#09261988';c.beginPath();c.ellipse(p.x,p.y+sz*.35,sz*.4,sz*.11,0,0,Math.PI*2);c.fill();{let img=getSprite(e.id);if(img.complete&&img.naturalWidth)c.drawImage(img,cx,cy,sz,sz);}if(!e.boss&&e.uid===g.captureTargetUid){c.strokeStyle='#ffe3a0';c.lineWidth=4;c.beginPath();c.arc(p.x,p.y,sz*.62,0,Math.PI*2);c.stroke();c.fillStyle='#102a33df';c.fillRect(p.x-31,p.y-sz*.58-11,62,7);c.fillStyle='#6ef5af';c.fillRect(p.x-30,p.y-sz*.58-10,60*Math.max(0,e.hp/e.maxHp),5);}if(e.boss){c.fillStyle='#080f15bb';c.fillRect(p.x-64,p.y-77,128,11);c.fillStyle='#ff6583';c.fillRect(p.x-62,p.y-75,124*Math.max(0,e.hp/e.maxHp),7);c.fillStyle='#ffdfa4';c.font='bold 13px system-ui';c.textAlign='center';c.fillText('BOSS',p.x,p.y-83)}}
for(let shot of g.shots){let p=screen(shot.x,shot.y);drawTechnique(c,p.x,p.y,shot)}
for(let shot of g.bossShots){let p=screen(shot.x,shot.y);drawTechnique(c,p.x,p.y,{type:shot.type||'psychic',rad:11,vx:shot.vx,vy:shot.vy})}
{const a=activePokemon(g),p=screen(g.position.x,g.position.y),sz=99;
 c.fillStyle='#061b18aa';c.beginPath();c.ellipse(p.x,p.y+sz*.3,sz*.32,sz*.11,0,0,7);c.fill();
 c.strokeStyle=typeOf(byId[a.id])[1];c.lineWidth=3;c.beginPath();c.arc(p.x,p.y+12,46,0,7);c.stroke();
 c.save();if(g.invuln>0)c.globalAlpha=.6+Math.sin(g.seconds*35)*.28;
 const img=getSprite(a.id,a.shiny);if(img.complete&&img.naturalWidth)c.drawImage(img,p.x-sz/2,p.y-sz/2,sz,sz);c.restore();
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
const IMG_CACHE=new Map();function getSprite(id,shiny=false){const key=id+(shiny?':shiny':'');if(IMG_CACHE.has(key))return IMG_CACHE.get(key);const fallback=new Image();fallback.src=spriteURI(id);IMG_CACHE.set(key,fallback);const src=pokemonSpriteURL(id,shiny);if(src){const img=new Image();img.decoding='async';img.onload=()=>IMG_CACHE.set(key,img);img.src=src;}return fallback}
function drawTerrain(c,g,ox,oy){const w=g.w,h=g.h,sz=48,st=g.stage;let palettes=[['#82bb66','#78b15c','#eacb8c','#b49465','#277d55','#3d965c','#b8dd81'],['#e2a56b','#d99458','#c48d64','#916349','#7c7c69','#a89a75','#e8c28c'],['#6b9b9c','#628d93','#aba8a0','#8b8b85','#356574','#598390','#b4d1c5'],['#abc4d7','#9fb7ca','#dfe8e8','#7d929f','#7b9bb8','#b3d9e5','#f5faf3'],['#758f5e','#6d875c','#c4b08e','#665e47','#356a4d','#4f9c62','#a1be77'],['#5c9aab','#4c8ba6','#d1cbae','#7e929a','#24657b','#3a92a9','#a9e1da'],['#84729b','#75648a','#9d919c','#5b516b','#55406c','#765891','#c4a9d0'],['#e1c69f','#cfb282','#e6d7bc','#a18767','#80755c','#ada073','#f1deb9']];const [base,alt,path,dark,bush,leaf,bright]=palettes[st];c.fillStyle=base;c.fillRect(0,0,w,h);const left=Math.floor(-ox/sz)-1,right=Math.ceil((w-ox)/sz)+1,top=Math.floor(-oy/sz)-1,bottom=Math.ceil((h-oy)/sz)+1;
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
 if(isBossChallenge(g))el('gymWave',endgameName(g)+' / BOSS '+Math.min(challengeRoster(g).length,g.gymBossKills+1)+' / '+challengeRoster(g).length);el('runKills',g.kills);el('runWave',Math.min(4,1+Math.floor(g.seconds/22)));
 const hp=$('hpFill'),xp=$('xpFill');if(hp)hp.style.width=Math.max(0,a.hp/a.maxHp*100)+'%';if(xp)xp.style.width=Math.min(100,g.xp/g.xpNeed*100)+'%';
 el('switchTimer',g.switchCooldown>.05?'交代まで '+g.switchCooldown.toFixed(1)+'秒':'交代可能');
 el('activeMove','⚔ '+moveFor(a.id).name);
 const nearest=g.enemies.reduce((best,e)=>{const d=(e.x-g.position.x)**2+(e.y-g.position.y)**2;return d<best.d?{d,e}:best},{d:Infinity,e:null}).e;
 if(nearest){const target=byId[nearest.id],multi=effectiveness(moveFor(a.id).type,target.type);
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
function onAction(act){let [cmd,...args]=act.split(':'),param=args.join(':');if(cmd==='go'){setPage(param);return}if(cmd==='tmSelect'){tmSelectedPokemon=param;render();return}if(cmd==='tmGo'){tmSelectedPokemon=param;$('modal').hidden=true;setPage('tm');return}if(cmd==='tmLearn'){const [poke,tm]=args;learnTM(poke,tm);return}if(cmd==='tmEquip'){const [poke,tm]=args;equipTM(poke,tm);return}if(cmd==='starter')return beginStarter(param);if(cmd==='answer')return answer(+param);if(cmd==='nextQuestion'){nextQuestion();render();return}if(cmd==='studyAll'||cmd==='studyReview'){studyFilter=cmd==='studyAll'?'all':'review';nextQuestion();render();return}if(cmd==='pullGacha')return pullGacha();if(cmd==='skipReveal'){gachaAnimating=false;clearTimeout(gachaAnimationTimer);render();return;}if(cmd==='capturePick')return chooseCaptureTarget(param);if(cmd==='captureAfter')return postBattleCapture(param);if(cmd==='captureSkip')return finishCaptureAnimation();if(cmd==='startLeague'){const n=Number(param);if(n<0||n>=LEAGUE.length||(state.gymBadges||0)!==8||n>(state.leagueWins||0))return notify('四天王は順番に挑戦してください');return startRun(LEAGUE[n].stage,null,{mode:'league',index:n});}
 if(cmd==='startLegend'){const n=Number(param);if(!legendaryUnlocked(n))return notify('バッジ／殿堂入りの条件を満たしてください');return startRun(LEGENDS[n].stage,null,{mode:'legend',index:n});}
 if(cmd==='startRematch'){const n=Number(param);if((state.gymBadges||0)<8||n<0||n>=8)return notify('8個のバッジが必要です');return startRun(Math.min(7,n),n,{mode:'rematch',index:n});}
 if(cmd==='startGym'){const n=+param;if(n>(state.gymBadges||0)||n<0||n>=8)return notify('前のジムをクリアしてください');return startRun(Math.min(7,n),n)}if(cmd==='shinyToggle')return toggleShiny(param);if(cmd==='stage'){selectedStage=+param;render();return}if(cmd==='beginRun')return startRun(+param);if(cmd==='pickSlot'){teamPick=+param;modal(`<h2>枠 ${teamPick+1} の仲間を選択</h2><div class="pokemon-grid">${species.filter(s=>state.owned[s.id]).map(s=>`<button class="mon-card" data-act="assign:${s.id}">${spriteTag(s.id)}<strong>${s.name}</strong></button>`).join('')}</div>${button('閉じる','closeModal','btn secondary wide')}`);return}if(cmd==='assign'){selectTeam(param,teamPick);$('modal').hidden=true;return}if(cmd==='mon'){monDetail(param);return}if(cmd==='addTeam'){selectTeam(param,undefined);$('modal').hidden=true;return}if(cmd==='train'){let n=state.training[param]||1,cost=n*18;if(state.dust<cost)return;state.dust-=cost;state.training[param]=n+1;save();monDetail(param);render();return}if(cmd==='dexFilter'){dexFilter=param;dexPage=0;render();return}if(cmd==='dexPrev'){dexPage--;render();return}if(cmd==='dexNext'){dexPage++;render();return}if(cmd==='swap'){switchPokemon(Number(param));return}if(cmd==='pause'){gamePause();return}if(cmd==='upgrade'){chooseUpgrade(param);return}if(cmd==='leaveRun'){finishRun(false,true);return}if(cmd==='endResult'){const cameFromGym=['gym','rematch','league'].includes(game?.mode);$('modal').hidden=true;game=null;setPage(cameFromGym?'gym':'battle');return}if(cmd==='closeModal'){$('modal').hidden=true;return}}
function setupEvents(){document.addEventListener('error',e=>{if(e.target instanceof HTMLImageElement&&e.target.hasAttribute('data-pokemon')&&!e.target.dataset.fallback){e.target.dataset.fallback='1';e.target.src=spriteURI('p'+String(e.target.dataset.pokemon).padStart(3,'0'));}},true);document.addEventListener('click',e=>{let el=e.target.closest('[data-act]');if(el&&!el.disabled){onAction(el.dataset.act);return}let nav=e.target.closest('[data-page]');if(nav){if(game?.running&&!game.paused&&page==='battle'){game.paused=true}setPage(nav.dataset.page)}if(e.target.matches('[data-close]'))closeModal()});$('logoHome').onclick=()=>setPage('home');window.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key.length===1?e.key.toLowerCase():e.key);if(page==='battle'&&game?.running&&!game.choosing&&['1','2','3'].includes(e.key)){switchPokemon(Number(e.key)-1);return}if(e.key==='Escape'&&game?.running&&!game.choosing)gamePause()});window.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));window.addEventListener('blur',()=>{keys.clear()});document.addEventListener('visibilitychange',()=>{if(!game?.running)return;if(document.hidden){if(!game.paused&&!game.choosing){game.paused=true;game.autoPaused=true;}keys.clear();}else if(game.autoPaused&&page==='battle'&&!game.choosing){game.autoPaused=false;game.paused=false;game.lastFrame=0;}const o=$('pauseOverlay');if(o)o.hidden=!game.paused;})}
async function init(){state=load();try{const [a,b]=await Promise.all([fetch('./data/kanto.json').then(r=>r.ok?r.json():Promise.reject('dex')),fetch('./data/questions.json').then(r=>r.ok?r.json():Promise.reject('questions'))]);species=a.filter(x=>x.id&&x.dex<=151);questions=b.map(normalQ).filter(Boolean);if(!questions.length)questions=FALLBACK_QUESTIONS.slice()}catch(e){console.warn('Local data unavailable, trying defaults',e);species=window.KANTO_FALLBACK||[];}if(!species.length){$('main').innerHTML='<div class="panel"><h2>ゲームデータを読み込めませんでした</h2><p>GitHub PagesまたはローカルHTTPサーバーで開いてください。</p></div>';return}byId=Object.fromEntries(species.map(x=>[x.id,x]));if(!state.tmWelcomeGiven){state.tms.tm01=(state.tms.tm01||0)+1;state.tmWelcomeGiven=true;save();}let sids=new Set(questions.map(q=>q.id));for(const q of state.questionAdditions){if(!sids.has(q.id)){questions.push(q);sids.add(q.id)}}setupEvents();nextQuestion();render();if(location.search.includes('debug=1'))window.SURVIVOR_DEBUG={GYMS,STAGES,LEAGUE,LEGENDS,legendaryUnlocked,isBossChallenge,challengeRoster,grantShiny,toggleShiny,shinyCount,gym,gymEffectiveness,spawnBoss,killEnemy,get game(){return game},get state(){return state},get question(){return currentQ},startRun,finishRun,drawGacha,evolveInRun,chooseUpgrade,update,answer,setPage,species,switchPokemon,takePlayerDamage,effectiveness,TM_LIST,moveFor,tmCanLearn,learnTM,equipTM,grantTM,machine,captureStock,captureChance,postBattleCapture,chooseCaptureTarget,finishCaptureAnimation,chooseCaptureCandidates,rewardCaptureBalls,showRun:()=>game};}
init().catch(e=>{console.error(e);$('main').textContent='起動エラー：再読み込みしてください。'});
})();