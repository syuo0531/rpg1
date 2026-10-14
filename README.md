# STUDY SURVIVOR v9 — Elite Four, Legendary Trials & Gym Rematches

GitHub Pages game; keep the `studySurvivor.v1` localStorage save key and existing files.

## New modes

- **Pokémon League (Elite Four and Champion)**: unlocks at 8 gym badges, five sequential leader challenges (Lorelei, Bruno, Agatha, Lance and Champion Green), each with several boss Pokémon; record league wins and Hall of Fame count separately.
- **Legendary trials**: Articuno, Zapdos and Moltres require 4 badges; Mewtwo requires 8 badges and at least one Hall of Fame entry. Each trial spawns a powerful legendary boss after 48 seconds. On victory, one legendary post-battle capture attempt using the existing ball inventory; special chance 2.5% Poké / 5% Great / 11% Ultra / 100% Master; shiny chance 1/128 on a successful catch. Legendary bosses do not appear as routine capture candidates elsewhere.
- **Gym leader rematches**: after 8 badges, eight stronger multi-boss challenges, with guaranteed R-or-SR technical machine reward, extra Ultra Balls and a rare Master Ball bonus. First clears/repeats saved independently from original 8 gym badges.

All progress saved in existing localStorage state. Study, quizzes, 151 Pokémon, normal gacha, shines, gacha ball animations, gym progression, dungeon capture, custom learned TMs, switching and icon metadata preserved.

## v10 — RPG14形式の勉強・試験システム（2026-10-14）

「勉強」タブ内に **問題演習／苦手問題／試験モード** を追加。既存の `studySurvivor.v1` セーブデータを引き継ぎます。第2世代ポケモン追加は未実施です。

- **通常演習**: 未回答・苦手問題を優先。正解5問でガチャ券1枚。間違えた問題は復習に登録。問題への画像添付も可能（ブラウザ内に保存）。
- **苦手指定**: 年度・基礎／応用・問題番号を手動指定。 `1,3,8-12` のように範囲登録可。対応するCSVが未登録でも指定内容を保持し、年度ごとの一覧に表示。履歴が3回以上・正答率80%以上・直近正解で自動解除。任意の習得済み指定／解除も可能。
- **模試3種類**: ランダム模試（最大110問）、苦手模試（最大110問）、本番モード（年度／区分の全問題を問題番号順で出題）。**110問未満でも登録問題数を分母とする100%採点**。試験中は解答・解説を非表示とし、終了後に点数・正答率・解説を表示。試験の進行状況はlocalStorageに自動保存。
- **問題CSV／JSONの追加**: 複数ファイルを同時選択可能。年度・基礎／応用区分を取り込み時に指定できます。通常の `question,choices,correct,explanation,subject,year,part,number` 形式と、旧RPG14/Sports形式の `front,back,choice,is_correct,q_num,exam_type,subject,year`（選択肢ごとに1行）を受け付けます。 `2つ選べ` などの複数正解問題にも対応。

## 操作方法

1. 「勉強」タブを開く。
2. 「問題演習」「苦手問題」「試験モード」を上部で切り替える。
3. 苦手登録は年度・区分・番号を入力して「指定する」。登録した年度が一覧に残ります。
4. 試験モードでは形式・年度・区分を選んで受験。最後に採点し、不正解は復習リストへ登録されます。

※問題は端末のlocalStorage内に保存します。容量の大きな画像を大量に添付する場合、ブラウザの保存上限に注意してください。

## v11 — 問題バンクの削除・復元（2026-10-14）

- 「勉強」→「問題バンク」の4番目のタブから、すべての登録問題を表示できます。初期同梱問題と後から追加したCSV/JSON問題を明確に区別します。
- 年度・基礎/応用・種類（初期／追加）・キーワードで絞り込み、**1問ずつ削除／絞り込み結果を一括削除／登録問題を全件削除**できます。すべて確認ダイアログ付きです。
- 初期同梱の問題データは `data/questions.json` を書き換えず、端末内のセーブの `deletedQuestionIds` に非表示状態を保存します。削除後に「初期問題を復元」で元に戻せます。
- ユーザーがCSV/JSONで追加した問題は `questionAdditions` から削除します。再度追加するにはCSV/JSONを取り込み直してください。
- 削除対象の回答履歴、復習履歴、添付画像も整理します。手動の年度・番号苦手指定は保持します。進行中の試験に対象問題が含まれる場合は警告して答案を破棄します。
- 既存のポケモン・ガチャ・バトル・ジム・ゲーム進行およびガチャ券はそのまま維持。**問題を0問にしてもゲームが停止しない**よう対応。
