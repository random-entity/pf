---
title: { en: Swarm Études, ko: 군집 연습곡, ja: 群れのエチュード }
date: 2025-04-02
genre: { en: Robotic Art, ko: 로봇 아트, ja: ロボットアート }
medium: { en: "32 wheeled robots, infrared mesh", ko: "32대의 바퀴 로봇, 적외선 메시", ja: "32台の車輪型ロボット、赤外線メッシュ" }
hardware: { robots: 32, radio: ESP-NOW }
tools: [ESP32, MicroPython, Rust]
tags: [robotics, kinetic, microcontroller, swarm, realtime]
---
::: en
## Idea
Thirty-two small robots negotiate a shared score, each one a voice in a moving
counterpoint.

### Firmware
Each ESP32 runs the same rules; global form is emergent. The sensing approach
extends [[proximity-garden]].

## Choreography
Three études of increasing density. The soundtrack is generated live, à la
[[spectral-drift]].
:::
::: ko
## 아이디어
32대의 작은 로봇이 공유된 악보를 협상하며, 각각이 움직이는 대위법 속의 한 성부가 됩니다.

### 펌웨어
모든 ESP32가 동일한 규칙을 실행하고, 전체 형태는 창발적으로 나타납니다. 센싱 방식은
[[proximity-garden]] 를 확장한 것입니다.

## 안무
밀도가 점점 높아지는 세 개의 연습곡입니다. 사운드트랙은 [[spectral-drift]] 처럼
실시간으로 생성됩니다.
:::
::: ja
## アイデア
32台の小型ロボットが共有スコアを交渉し、それぞれが動く対位法の一声となります。

### ファームウェア
すべての ESP32 が同じ規則を実行し、全体の形は創発的に現れます。センシング手法は
[[proximity-garden]] を拡張したものです。

## 振付
密度を増していく三つのエチュード。サウンドトラックは [[spectral-drift]] のように
ライブ生成されます。
:::
