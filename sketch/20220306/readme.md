## 目的
スケッチを新規作成するときに、前回のファイル構成をできるだけそのまま利用できるようにする。

## 問題点と修正内容
- sketch.jsでスケッチごとに修正する部分が多い。
	- sketch.jsには基本的に直接コードを書かないようなルールとして、ballに関する初期化、更新及び描画は全てball.jsに記載するようにした。
	- testは書かないようにして、throwでエラーハンドリングする構成にした。
- tonejsを利用する場合としない場合でguiや初期化の内容が異なる。
	- guiの引数にboolean値のsound及びseqを追加して、それぞれがtrueの時のみ必要な初期化を行うようにした。
- paramsは共通する部分とsketch固有のパラメータが混在する。
	- gui.jsをparams.jsに統合した。
	- sketch固有のパラメータはball.jsなどで追加するようにし、params.jsはutilフォルダに移動して使いまわせるようにした。
	- 以前はconsole.assert()を用いてデバッグしていたが、そこまでは不要に感じている。ballsオブジェクトを適切にモニターできれば十分である。ただし、balls[1].pos.xのように階層が深くなってしまっているため工夫が必要である。
	- オブジェクトを再帰的に評価できないか？

## デバッグの流れ
undefindであればエラーを投げる。update関数内で定義すると速度が低下するので、print debug内で定義する。
すべての変数をprint debugする必要はないので必要な変数飲みを選ぶ。
textasticのコンソールだと長文は確認しづらいため、<debug>DOMを作成して表示させる。


## スケッチを新規作成するときの流れ
1. 前回のフォルダを複製して、フォルダ名を日付に変更する。
1. 特有のファイル(ballなど)を削除し、sketch.jsのballを含む行を削除する。
1. tonejsを利用する場合はhtmlで読み込み（コメントアウトを削除し）、sketch.jsのsynth変数の設定のコメントアウトを削除し、guiの引数をtrueに修正する。


## ファイル構成
- sketch.html（共通）
- sketch.js（共通）
- synth.js（共通/tonejs使用時のみ）
- ball.js（スケッチ固有）

## ball.jsに含まれる関数
- params.ballの初期化
- params.ballのgui設定
- ballの初期化
- ballの更新
- ballの描画
