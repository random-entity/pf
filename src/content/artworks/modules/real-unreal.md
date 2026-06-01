---
title: { en: "Real-unreal continuum", ko: 현실-비현실 연속체, ja: 現実-非現実連続体 }
date: 2019-01-01
genre: [Audio effect]
tags: [Spectral warping, FFT]
tools: [Max/MSP]
source: https://github.com/random-entity/o.mod.real-unreal-continuum
---
::: en
[Video](https://youtu.be/YdwL-U4VsLM)

- An audio effect that geometrically warps the spectrogram of an input audio file and then outputs sound using the warped result as its spectrogram.
  - The warping of the spectrogram uses two points on the frequency axis as handles; when the handles are moved, each section (from 0 to handle 1, from handle 1 to handle 2, from handle 2 to 20kHz) linearly expands or compresses from the original.
- In this patch, the player can also manipulate the two handles with MIDI signals or a mouse, and the computer can also manipulate the two handles randomly.
- A 2019 performance using this module was conducted under the instruction: "To counteract the computer's random handle manipulations, the performer attempts to move the handles in the opposite direction of the computer using only their sense of hearing."
- This module was devised as a type of continuous transformation between 'realistic sounds' and 'unrealistic sounds', and therefore, in the aforementioned performance, sounds recorded in a forest with birds singing were used as the input audio file.
:::
::: ko
[Video](https://youtu.be/YdwL-U4VsLM)

- 입력 오디오 파일의 스펙트로그램을 기하학적으로 변형시킨 뒤, 그 변형된 결과를 스펙트로그램으로 하는 소리를 출력하는 오디오 이펙트.
  - 스펙트로그램의 변형은 주파수 축의 두 지점을 핸들로 하여, 핸들을 움직였을 때 각 구간(0부터 핸들1까지, 핸들1부터 핸들2까지, 핸들2부터 20kHz까지)이 원본으로부터 선형으로 늘어나거나 압축하는 방식이다.
- 본 패치에서 플레이어도 MIDI 신호 혹은 마우스로 두 핸들을 조작할 수 있고, 컴퓨터도 두 핸들을 랜덤하게 조작할 수 있다.
- 본 모듈을 이용한 2019년 퍼포먼스는 "컴퓨터의 랜덤한 핸들 조작을 상쇄하기 위해 퍼포머가 청각만을 이용해 핸들을 컴퓨터와 반대로 움직이려 한다"는 지시 하에 이루어졌다.
- 본 모듈은 '현실적인 소리'와 '비현실적인 소리' 사이의 연속적인 변환의 한 가지로서 고안되었고, 따라서 상기 퍼포먼스에서는 입력 오디오 파일로서 새들이 우는 숲 속에서 녹음된 소리를 사용했다.
:::
::: ja
[Video](https://youtu.be/YdwL-U4VsLM)

- 入力オーディオファイルのスペクトログラムを幾何学的に変形させた後、その変形された結果をスペクトログラムとする音を出力するオーディオエフェクト。
  - スペクトログラムの変形は、周波数軸の2つのポイントをハンドルとし、ハンドルを動かしたときに各区間（0からハンドル1まで、ハンドル1からハンドル2まで、ハンドル2から20kHzまで）がオリジナルから線形に伸張または圧縮される方式である。
- 本パッチでは、プレイヤーもMIDI信号またはマウスで2つのハンドルを操作でき、コンピューターも2つのハンドルをランダムに操作できる。
- 本モジュールを利用した2019年のパフォーマンスは、「コンピューターのランダムなハンドル操作を相殺するために、パフォーマーは聴覚だけを頼りにハンドルをコンピューターと逆方向に動かそうとする」という指示の下で行われた。
- 本モジュールは「現実的な音」と「非現実的な音」の間の連続的な変換の一つとして考案され、そのため上記のパフォーマンスでは、入力オーディオファイルとして鳥が鳴く森の中で録音された音を使用した。
:::
