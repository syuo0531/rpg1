/* Unofficial fan-made card extension. Pokémon names belong to their respective owners.
   Dex numbers 001–151 are stable. No Pokémon sprite image files are distributed here.
   Sprites are requested from PokeAPI's public sprite repository and have a local-render fallback. */
(()=>{'use strict';
const BASE=window.TCG_CARDS;
if(!BASE)throw Error('Load cards.js before pokemon.js');
const names=`フシギダネ フシギソウ フシギバナ ヒトカゲ リザード リザードン ゼニガメ カメール カメックス キャタピー トランセル バタフリー ビードル コクーン スピアー ポッポ ピジョン ピジョット コラッタ ラッタ オニスズメ オニドリル アーボ アーボック ピカチュウ ライチュウ サンド サンドパン ニドラン♀ ニドリーナ ニドクイン ニドラン♂ ニドリーノ ニドキング ピッピ ピクシー ロコン キュウコン プリン プクリン ズバット ゴルバット ナゾノクサ クサイハナ ラフレシア パラス パラセクト コンパン モルフォン ディグダ ダグトリオ ニャース ペルシアン コダック ゴルダック マンキー オコリザル ガーディ ウインディ ニョロモ ニョロゾ ニョロボン ケーシィ ユンゲラー フーディン ワンリキー ゴーリキー カイリキー マダツボミ ウツドン ウツボット メノクラゲ ドククラゲ イシツブテ ゴローン ゴローニャ ポニータ ギャロップ ヤドン ヤドラン コイル レアコイル カモネギ ドードー ドードリオ パウワウ ジュゴン ベトベター ベトベトン シェルダー パルシェン ゴース ゴースト ゲンガー イワーク スリープ スリーパー クラブ キングラー ビリリダマ マルマイン タマタマ ナッシー カラカラ ガラガラ サワムラー エビワラー ベロリンガ ドガース マタドガス サイホーン サイドン ラッキー モンジャラ ガルーラ タッツー シードラ トサキント アズマオウ ヒトデマン スターミー バリヤード ストライク ルージュラ エレブー ブーバー カイロス ケンタロス コイキング ギャラドス ラプラス メタモン イーブイ シャワーズ サンダース ブースター ポリゴン オムナイト オムスター カブト カブトプス プテラ カビゴン フリーザー サンダー ファイヤー ミニリュウ ハクリュー カイリュー ミュウツー ミュウ`.split(/\s+/);
if(names.length!==151)throw Error(`Kanto Pokémon count must be 151, received ${names.length}`);
// Original five-civilization rule set: map each Pokémon's primary battling theme.
const types={
 fire:'4 5 6 37 38 58 59 77 78 126 136 146',
 water:'7 8 9 54 55 60 61 62 72 73 79 80 86 87 90 91 98 99 116 117 118 119 120 121 129 130 131 134 138 139 140 141',
 nature:'1 2 3 10 11 12 13 14 15 27 28 43 44 45 46 47 48 49 50 51 69 70 71 74 75 76 95 102 103 104 105 111 112 114 123 127 128 142',
 dark:'23 24 29 30 31 32 33 34 41 42 88 89 92 93 94 109 110 150',
 light:'16 17 18 19 20 21 22 25 26 35 36 39 40 52 53 56 57 63 64 65 66 67 68 81 82 83 84 85 96 97 100 101 106 107 108 113 115 122 124 125 132 133 135 137 143 144 145 147 148 149 151'
};
const civByNum={};for(const [civ,list] of Object.entries(types))for(const n of list.split(' ').map(Number)){if(civByNum[n])throw Error(`Duplicate species type ${n}`);civByNum[n]=civ;}
for(let i=1;i<=151;i++)if(!civByNum[i])throw Error(`Missing species type ${i}`);
const specialLegends=new Set([144,145,146,150]);const mythical=new Set([151]);
const superRare=new Set([3,6,9,59,65,68,76,94,130,131,143,149]);
const rares=new Set([12,15,18,24,26,28,31,34,36,38,40,42,45,47,49,55,57,62,73,78,80,82,85,89,91,97,99,101,103,105,112,115,119,123,125,134,136,142]);
const uncommons=new Set([2,5,8,11,14,17,20,22,25,30,33,37,44,46,48,54,56,58,61,63,64,67,70,72,75,79,81,83,86,88,93,95,98,100,102,104,108,109,111,113,116,118,120,122,126,138]);
const abilities={
 blocker:new Set([3,9,11,14,28,31,34,36,40,47,68,75,76,80,82,87,91,95,103,105,111,112,113,115,131,139,143]),
 rush:new Set([6,18,20,22,25,26,38,42,51,53,57,59,65,78,85,99,101,123,125,135]),
 double:new Set([3,6,9,15,18,31,34,38,45,59,62,65,68,71,73,76,80,94,103,112,115,130,131,134,135,136,142,143,149]),
 triple:new Set([144,145,146,150,151]),
 onDraw:new Set([12,36,39,40,49,52,54,55,63,64,65,79,80,96,97,102,113,120,121,124,132,133,137,151]),
 onMana:new Set([2,3,43,44,45,46,47,69,70,71,74,75,76,102,103,114,147,148]),
 onBurn:new Set([5,6,15,24,26,38,42,49,58,59,78,89,94,99,101,105,110,125,126,136,146,150]),
 onBounce:new Set([9,55,62,72,73,87,91,117,119,121,131,134]),
 onShield:new Set([9,26,31,35,36,40,83,115,122,143,144]),
 onGrave:new Set([23,24,48,49,88,89,92,93,94,109,110,150])
};
const stage2=new Set([2,5,8,11,14,17,20,22,24,26,28,30,33,36,38,40,42,44,47,49,51,53,55,57,59,61,64,67,70,73,75,78,80,82,85,87,89,91,93,97,99,101,103,105,110,112,117,119,121,130,134,135,136,139,141,148]);
const cardDesc=BASE.flavor;
const added=names.map((name,i)=>{
 const dex=i+1,civ=civByNum[dex];
 const rarity=mythical.has(dex)?'SEC':specialLegends.has(dex)?'LG':superRare.has(dex)?'SR':rares.has(dex)?'R':uncommons.has(dex)?'U':'N';
 const stage=mythical.has(dex)||specialLegends.has(dex)?3:superRare.has(dex)?2:stage2.has(dex)?1:0;
 let cost=Math.min(9,Math.max(1,1+stage*2+(dex%5===0?1:0)+(rarity==='R'?1:rarity==='SR'?2:['LG','SEC'].includes(rarity)?3:0)));
 let power=Math.max(1000,Math.min(14500, (cost*1050+((dex*791)%4)*500+stage*450) /500|0)*500);
 // Fossils, evolved legends and rare finishers become more demanding to deploy.
 if(dex===129) {cost=1;power=1000;}if(dex===150){cost=9;power=13000;}if(dex===151){cost=9;power=12500;}
 let ability='';for(const label of ['triple','double','blocker','rush','onDraw','onMana','onBurn','onBounce','onShield','onGrave'])if(abilities[label]?.has(dex)){ability=label;break;}
 // Regular Pokémon with an on-play effect should still behave normally when summoned.
 const trigger=rarity!=='LG'&&rarity!=='SEC'&&(dex%13===0||[12,25,35,60,81,104,113].includes(dex));
 return {id:`pk-${String(dex).padStart(3,'0')}`,dex,pokemon:true,name,civ,cost,power,rarity,type:'creature',ability,trigger,
   description:`全国図鑑 No.${String(dex).padStart(3,'0')}｜${BASE.CIVS[civ].name}文明。${cardDesc[ability]||'特殊能力なし'}${trigger?' / シールドトリガー：無料で召喚できる':''}`,
   picture:`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dex}.png`
 };
});
BASE.CARDS.push(...added);for(const c of added)BASE.byId[c.id]=c;
window.STUDY_POKEMON_KANTO={cards:added,first:1,last:151};
})();