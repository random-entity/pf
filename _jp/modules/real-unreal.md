---
title: 現実-非現実連続体
parent: Modules
layout: default
---

# 現実-非現実連続体

<iframe width="560" height="315" src="https://www.youtube.com/embed/YdwL-U4VsLM?si=qiSaCvdrbkYXpo5U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Audio effect
{: .label }
Spectral warping
{: .label .label-green }
FFT
{: .label .label-green }
Max/MSP
{: .label .label-purple }
v2019
{: .label .label-yellow }

<dl>
  <dt>ソースコード</dt>
  <dd><span markdown="1">
    [GitHub](https://github.com/random-entity/o.mod.real-unreal-continuum)
  </span></dd>
</dl>

- 入力オーディオファイルのスペクトログラムを幾何学的に変形させた後、その変形された結果をスペクトログラムとする音を出力するオーディオエフェクト。
  - スペクトログラムの変形は、周波数軸の2つのポイントをハンドルとし、ハンドルを動かしたときに各区間（0からハンドル1まで、ハンドル1からハンドル2まで、ハンドル2から20kHzまで）がオリジナルから線形に伸張または圧縮される方式である。
- 本パッチでは、プレイヤーもMIDI信号またはマウスで2つのハンドルを操作でき、コンピューターも2つのハンドルをランダムに操作できる。
- 本モジュールを利用した2019年のパフォーマンスは、「コンピューターのランダムなハンドル操作を相殺するために、パフォーマーは聴覚だけを頼りにハンドルをコンピューターと逆方向に動かそうとする」という指示の下で行われた。
- 本モジュールは「現実的な音」と「非現実的な音」の間の連続的な変換の一つとして考案され、そのため上記のパフォーマンスでは、入力オーディオファイルとして鳥が鳴く森の中で録音された音を使用した。
