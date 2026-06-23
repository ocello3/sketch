# overview
シンプルな構成
wavのloopでeq、音量、panで調整
物理シミュレートではなく、形と動きの単純化
wavの解析を描画にフィードバック

回転するらせん
フェルマー螺旋：r = a * sqrt (theta)
縦に短い長方形と長い長方形
長方形の高さはFFT

# todo
再生スピードを調整できるようにする

# done
wavを再生するコードを書く
再生するwavをきめる
wavが再生できるか確認する
eqをかけてみて、tweakpaneで操作する - gain
eqをかけてみて、tweakpaneで操作する - freq - 対数変換
fftのコードを書く
eqをFilterに書き直す
螺旋を回転させる
resonanceは半径の大きさ
cutoffは[0]のx座標
resとfreqが想定を超えている気がするので修正する