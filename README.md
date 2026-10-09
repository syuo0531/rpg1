# STUDY FORGE: INFINITE ABYSS — RPG1 Pixel Edition

勉強 × 収集 × ハクスラ × ダンジョン探索のブラウザRPGです。外部ライブラリや外部画像URLなしで動作します。

## 遊び方

- STUDY：問題を解いてEXP・Gold・Forge Energyを獲得。5問正解ごとに宝箱を入手。間違えた問題は復習に登録。
- BATTLE：問題正解で攻撃、防御で被ダメージを軽減、3FEでバーストを使用。強攻撃は敵の予告表示で確認。討伐後にモンスター捕獲も可能。
- FORGE：武器・防具・秘宝・英雄を作成・召喚。装備中の武器は最大+10まで強化。
- COLLECTION：武器・防具・モンスター・英雄・秘宝の五大図鑑。所持アイテムを選んで装備・編成。
- HOME：クエスト進行、宝箱、EXP、現在の冒険状況。

## 問題追加

STUDYタブの「ファイルを読み込む」からCSVまたはJSONを追加可能。問題はブラウザのlocalStorageに保存されます。CSVヘッダーは以下です：

```csv
id,question,choices,correct,explanation,subject,year,difficulty
ex001,筋収縮のATPは？,"[""ATP"",""DNA"",""ADP"",""RNA""]",0,ATPを利用します,運動生理,2025,1
```

- `choices` はJSON形式の配列文字列、または `選択肢A|選択肢B|選択肢C` で記述可能。
- `correct` は **0始まりの選択肢位置**（0、1、2、3…）または英字（A、B、C、D…）を使用。
- `difficulty` は1〜3。
- `data/questions.json` を編集して固定問題を増やすことも可能。

## 構成

```
index.html
style.css
script.js
data/questions.json
```

## 保存・デプロイ

GitHub Pagesで公開可能。セーブキーは`studyForge.infiniteAbyss.v1`。旧版の保存データは読み込みません。HOME末尾の「セーブ初期化」から新バージョンのデータだけ消去できます。別端末への引継ぎやクラウドセーブは未実装です。

## ゲームバランス

鍛造の基本抽選確率は Common 48%、Uncommon 30%、Rare 15%、Epic 5%、Legendary 1.7%、Mythic 0.3%。40回でLegendary以上、200回でMythicを保証するカウンターを共有。所持している英雄・モンスターを重複入手した時は魂の欠片へ変換。将来アップデートで追加クラフト用途を予定。

ゲームとしての初期版です。500種図鑑やマルチプレイ、技の多様化などは今後の追加対象です。