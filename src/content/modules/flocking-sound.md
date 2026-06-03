---
title: { en: "Flocking sound", ko: "새떼의 소리", ja: "群れの音" }
credits:
  - base code: "[\"Flocking\" by Daniel Shiffman](https://processing.org/examples/flocking.html)"
  - base algorithm: "[Craig Reynolds' \"Boids\" algorithm](https://en.wikipedia.org/wiki/Boids)"
releases:
  - { event: "[GitHub public repository](https://github.com/random-entity/o.mod.flocking-sound_processing)", date: "2025-09-29", version: "v.0" }
  - { event: "[YouTube Live](https://youtu.be/MBg5GFYua7Y)", date: "2025-09-29", version: "v.0" }
type: Module
genre: ["Synthesizer", "Generative music"]
tags: ["Additive synthesis", "Alternative physics", "Simulation", "Boids", "Artificial life", "Automata"]
tools: ["Processing"]
source: "[GitHub](https://github.com/random-entity/o.mod.flocking-sound_processing)"
---
[Video](https://youtu.be/MBg5GFYua7Y)
::: en
- This module is a meditation-music generator and a synthesizer created by adding sound and GUI parameter controls to Daniel Shiffman's classic Processing sketch, which implements Craig Reynolds' classic "Boids" algorithm.
- Each "Boid" is equipped with a sine wave oscillator, and its frequency is determined by the Boid's heading (direction). Depending on the mode selection, the frequency can have continuous values or discrete values within a specific musical scale.
  - For details, refer to the [README](https://github.com/random-entity/o.mod.flocking-sound_processing?tab=readme-ov-file).
- Rougly speaking, this module has aspects of additive synthesis in the sense that its sound output is sum of numerous sine waves, as well as aspects of granular synthesis in the sense that small elements each with random offset form an aggregate to produce sound. Also in discrete frequency mode, it has aspects of (a massive) polyphonic music where harmony progresses by an emergent algorithm.
:::
::: ko
- Craig Reynolds의 ["Boids" 알고리즘](https://en.wikipedia.org/wiki/Boids)을 프로그래밍 한 [Daniel Shiffman의 Processing 스케치](https://processing.org/examples/flocking.html)에, 사운드 모듈과 GUI를 통한 알고리즘 파라미터 조작 기능을 추가하여 만든 명상 음악 생성기이자 신세사이저다.
- 각 "Boid"에는 사인파 오실레이터가 장착되고, 그 주파수는 Boid의 방향에 의해 결정된다. 주파수는 모드 선택에 따라 연속적인 값을 가질 수도, 특정 스케일의 이산적인 값을 가질 수도 있다.
  - 상세한 내용은 [README](https://github.com/random-entity/o.mod.flocking-sound_processing?tab=readme-ov-file#how-it-works-and-how-to-use) 참조.
- 수많은 사인파의 합에 의해 이루어진다는 점에서 똑같지는 않지만 additive synthesis의 면모를, 작은 요소가 집합체를 이루어 소리를 낸다는 점에서 똑같지는 않지만 granular synthesis의 면모를, 그리고 이산 주파수 모드에서는 창발적 알고리즘에 의해 화성이 진행되는 거대 폴리포닉 음악의 면모를 갖는다고 할 수 있다.
:::
::: ja
- Craig Reynoldsの「Boids」アルゴリズムをプログラミングしたDaniel ShiffmanのProcessingスケッチに、サウンドモジュールとGUIを通じたアルゴリズムのパラメーター操作機能を追加して作成した瞑想音楽ジェネレーターであり、シンセサイザーである。
- 各「Boid」にはサイン波オシレーターが搭載され、その周波数はBoidの方向（heading）によって決定される。周波数はモード選択によって連続的な値を持つことも、特定のスケールの離散的な値を持つこともできる。
  - 詳細については[README](https://github.com/random-entity/o.mod.flocking-sound_processing?tab=readme-ov-file#how-it-works-and-how-to-use)を参照。
- 無数のサイン波の和によって成り立つという点で（全く同じではないが）加算合成（additive synthesis）の側面を、小さな要素が集合体をなして音を出すという点で（全く同じではないが）グラニュラーシンセシス（granular synthesis）の側面を、そして離散周波数モードでは創発的アルゴリズムによって和音が進行する巨大なポリフォニック音楽の側面を持っていると言える。
:::
