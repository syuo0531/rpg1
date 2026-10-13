/* Original STUDY BURST card catalogue: no licensed cards or artwork. */
window.TCG_CARDS = (()=>{
const CIVS={
 fire:{name:'焔',color:'#f16c50',light:'#ffc47a',icon:'✶',labels:['小隊','獣','戦士','火霊','竜'],bg:'#54273d'},
 water:{name:'潮',color:'#67baec',light:'#b8f3ff',icon:'≋',labels:['精霊','術士','機兵','幻獣'],bg:'#1d416c'},
 nature:{name:'翠',color:'#78d59a',light:'#c2ffaf',icon:'❈',labels:['樹人','獣','竜','精霊'],bg:'#205246'},
 light:{name:'聖',color:'#e5ca78',light:'#fff4c0',icon:'✦',labels:['天使','守護者','聖獣','騎士'],bg:'#5b4a49'},
 dark:{name:'冥',color:'#a78cff',light:'#edd5ff',icon:'☾',labels:['魔族','影獣','死霊','幻術士'],bg:'#392f69'}
};
const roster={
 fire:[
 ['火花の幼竜',1,1000,'N','creature','',false],['炎牙の猟犬',2,2000,'N','creature','rush',false],['紅槍の傭兵',3,3000,'N','creature','',true],['溶岩の拳士',4,4000,'U','creature','onBurn',false],['焔刃の騎竜',5,6000,'R','creature','double',false],['爆炎のバシリスク',6,6500,'R','creature','onBurn',false],['紅蓮戦鬼ヴァルド',7,8500,'SR','creature','double',false],['滅火皇ドラグオン',9,12000,'LG','creature','triple',false],
 ['瞬炎の矢',2,0,'N','spell','damageSmall',true],['紅の連鎖',3,0,'U','spell','draw',false],['業火の裁き',5,0,'R','spell','destroyWeak',true],['凱歌の炎陣',6,0,'SR','spell','boostAll',false],
 ['紅刃の進化剣士',4,6000,'R','evolution','double',false],['煉獄王レーヴァ',8,11000,'SR','evolution','double',false], ['火砦の守護獣',3,4000,'U','creature','blocker',false], ['不死鳥の伝令',4,3500,'R','creature','onBurn',true]
 ],
 water:[
 ['水晶の小精',1,1000,'N','creature','',false],['潮騒の導師',2,1500,'N','creature','onDraw',false],['泡影の海蛇',3,3000,'N','creature','',true],['青波の護衛',4,4500,'U','creature','blocker',false],['蒼穹の観測者',5,5500,'R','creature','onDraw',false],['深潮の巨兵',6,7000,'R','creature','onBounce',false],['時潮の賢者ネリス',7,8000,'SR','creature','onDraw',false],['海皇竜アビスラ',9,11500,'LG','creature','double',false],
 ['海流の知恵',2,0,'N','spell','draw',false],['泡沫の解放',3,0,'U','spell','bounce',true],['水鏡の策略',4,0,'R','spell','drawTwo',true],['氷河の封印',6,0,'SR','spell','tapAll',false],
 ['深層の進化蛇',4,5500,'R','evolution','onDraw',false],['蒼雷の覇海王',8,11000,'SR','evolution','double',false], ['泡壁の番兵',2,2000,'N','creature','blocker',false], ['蒼月の使い鳥',4,4000,'U','creature','onDraw',true]
 ],
 nature:[
 ['若葉の芽獣',1,1000,'N','creature','',false],['森駆けの小狼',2,2000,'N','creature','',true],['大樹の番人',3,3000,'N','creature','onMana',false],['緑岩の巨腕',4,5000,'U','creature','',false],['風森の角竜',5,6000,'R','creature','double',false],['密林の古兵',6,7000,'R','creature','onMana',false],['巨根王ドリアード',7,9000,'SR','creature','double',false],['原初竜グランシード',9,12500,'LG','creature','triple',false],
 ['大地の呼吸',2,0,'N','spell','mana',false],['豊穣の儀式',3,0,'U','spell','mana',true],['獣王の躍動',5,0,'R','spell','boostAll',false],['森羅の祝福',6,0,'SR','spell','manaTwo',false],
 ['巨樹の進化獣',4,6500,'R','evolution','double',false],['百獣王グランドル',8,11000,'SR','evolution','double',false], ['樹壁の鎧亀',3,3500,'U','creature','blocker',false], ['芽吹きの獣王',5,6000,'R','creature','onMana',true]
 ],
 light:[
 ['暁の灯火精',1,1000,'N','creature','',false],['光壁の衛兵',2,2500,'N','creature','blocker',false],['白盾の天馬',3,3000,'N','creature','blocker',true],['神殿の弓兵',4,4000,'U','creature','',false],['光輪の守護者',5,6000,'R','creature','onShield',false],['輝石の聖獣',6,7000,'R','creature','blocker',false],['裁光天使セレナ',7,8000,'SR','creature','onShield',false],['天煌機神ルミナス',9,12000,'LG','creature','double',false],
 ['光壁の加護',2,0,'N','spell','tapEnemy',true],['守護の誓約',3,0,'U','spell','shield',false],['暁の浄化',4,0,'R','spell','destroyWeak',true],['天啓の守陣',6,0,'SR','spell','shieldTwo',false],
 ['聖翼の進化騎士',4,6000,'R','evolution','blocker',false],['神聖皇アイリス',8,11500,'SR','evolution','double',false], ['虹盾の騎士',4,5000,'U','creature','blocker',true], ['光冠の救援者',5,4500,'R','creature','onShield',true]
 ],
 dark:[
 ['夜闇の小鬼',1,1000,'N','creature','',false],['影縫いの使い魔',2,2000,'N','creature','',true],['墓守の戦士',3,3000,'N','creature','onGrave',false],['亡霊の騎兵',4,4000,'U','creature','onBurn',false],['黒曜の魔導師',5,6000,'R','creature','onGrave',false],['冥府の捕食竜',6,7000,'R','creature','onBurn',false],['暗黒侯ヴェスパー',7,8500,'SR','creature','double',false],['終末帝ノクターン',9,12000,'LG','creature','triple',false],
 ['夜の契約',2,0,'N','spell','graveReturn',false],['影縛りの術',3,0,'U','spell','tapEnemy',true],['冥府の断罪',5,0,'R','spell','destroyWeak',true],['輪廻の詠唱',6,0,'SR','spell','graveReturn',true],
 ['冥鎧の進化獣',4,6500,'R','evolution','double',false],['月蝕皇ノスフェラ',8,11000,'SR','evolution','double',false], ['黒曜の盾魔',3,3000,'U','creature','blocker',false], ['奈落の使徒',5,5000,'R','creature','onBurn',true]
 ]
};
const flavor={rush:'速攻：召喚したターンから攻撃可能',blocker:'守護：相手の攻撃を止められる',double:'ダブルブレイク：シールドを2枚破壊',triple:'トリプルブレイク：シールドを3枚破壊',onDraw:'召喚時：カードを1枚引く',onMana:'召喚時：山札上から1枚マナへ',onBurn:'召喚時：相手のパワー2000以下のクリーチャーを1体破壊',onBounce:'召喚時：相手のクリーチャー1体を手札へ戻す',onShield:'召喚時：山札から1枚をシールドに追加',onGrave:'召喚時：墓地からクリーチャーを1枚手札へ',damageSmall:'相手のパワー2000以下のクリーチャー1体を破壊',destroyWeak:'相手のパワー5000以下のクリーチャー1体を破壊',draw:'カードを1枚引く',drawTwo:'カードを2枚引く',bounce:'相手クリーチャー1体を手札へ戻す',tapAll:'相手クリーチャーをすべてタップ',tapEnemy:'相手クリーチャー1体をタップ',mana:'山札上から1枚をマナへ置く',manaTwo:'山札上から2枚をマナへ置く',shield:'山札上から1枚をシールドへ追加',shieldTwo:'山札上から2枚をシールドへ追加',boostAll:'自分の全クリーチャーのパワーをこのターン+2000',graveReturn:'自分の墓地のクリーチャーを1枚手札へ戻す'};
const out=[];for(const [civ,arr] of Object.entries(roster)){
 arr.forEach((row,i)=>{const [name,cost,power,rarity,type,ability,trigger]=row;out.push({id:`${civ}-${String(i+1).padStart(2,'0')}`,name,civ,cost,power,rarity,type,ability,trigger,description:(type==='evolution'?'進化：同じ文明のクリーチャー1体の上に置く。 ':'')+(flavor[ability]||'効果なし')+(trigger?' / シールドトリガー：シールドから出た時、呪文は無料で使用・クリーチャーは無料召喚':'')});});
}
for(const legendary of out.filter(c=>c.rarity==='LG')){
 const alt={...legendary,id:legendary.id+'-secret',name:legendary.name+'・煌装',rarity:'SEC',secret:true,
 description:legendary.description+' / SECRETホログラム仕様'};
 out.push(alt);
}
return {CIVS,CARDS:out,byId:Object.fromEntries(out.map(c=>[c.id,c])),rarities:['N','U','R','SR','LG','SEC'],flavor};
})();