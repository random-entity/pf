---
title: 群れの音
parent: Modules
layout: default
---

# 群れの音

<iframe width="560" height="315" src="https://www.youtube.com/embed/MBg5GFYua7Y?si=9GWY-AjQ1KuQfXDa" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Synthesizer
{: .label }
Generative music
{: .label }
Additive synthesis
{: .label .label-green }
Boids
{: .label .label-green }
Artificial life
{: .label .label-green }
Automata
{: .label .label-green }
Processing
{: .label .label-purple }
v2025-09-29
{: .label .label-yellow }

<dl>
  <dt>ソースコード</dt>
  <dd><span markdown="1">
    [GitHub](https://github.com/random-entity/o.mod.flocking-sound_processing)
  </span></dd>
  <dt>ベースコード</dt>
  <dd><span markdown="1">
    ["Flocking" by Daniel Shiffman](https://processing.org/examples/flocking.html)
  </span></dd>
</dl>

- Craig Reynoldsの「Boids」アルゴリズムをプログラミングしたDaniel ShiffmanのProcessingスケッチに、サウンドモジュールとGUIを通じたアルゴリズムのパラメーター操作機能を追加して作成した瞑想音楽ジェネレーターであり、シンセサイザーである。
- 各「Boid」にはサイン波オシレーターが搭載され、その周波数はBoidの方向（heading）によって決定される。周波数はモード選択によって連続的な値を持つことも、特定のスケールの離散的な値を持つこともできる。
  - 詳細については[README](https://github.com/random-entity/o.mod.flocking-sound_processing?tab=readme-ov-file#how-it-works-and-how-to-use)を参照。
- 無数のサイン波の和によって成り立つという点で（全く同じではないが）加算合成（additive synthesis）の側面を、小さな要素が集合体をなして音を出すという点で（全く同じではないが）グラニュラーシンセシス（granular synthesis）の側面を、そして離散周波数モードでは創発的アルゴリズムによって和音が進行する巨大なポリフォニック音楽の側面を持っていると言える。
