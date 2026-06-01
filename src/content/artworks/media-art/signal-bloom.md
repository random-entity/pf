---
title: { en: Signal Bloom, ko: 시그널 블룸, ja: シグナル・ブルーム }
date:
  - "2024-08-31 : Premiere online"
  - "2024-11-01 ~ 2024-11-05 : Seoul Performing Arts Festival"
  - "2024-12-01 ~ 2024-12-05 : FORUM IMPACT 2024"
genre:
  - { en: Media Art, ko: 미디어 아트, ja: メディアアート }
  - { en: Video Art, ko: 비디오 아트, ja: ビデオアート }
medium: { en: "Audio-reactive projection, two channels", ko: "오디오 반응형 영상, 2채널", ja: "オーディオ反応型プロジェクション、2チャンネル" }
dimensions: { width: 600, height: 240, unit: cm }
tools: [TouchDesigner, GLSL]
tags: [media-art, audio, video, generative, realtime]
---
::: en
## Overview
A wall-sized projection that blooms in response to live sound. The audio engine
is shared with [[spectral-drift]].

### Shaders
Each frequency band drives a reaction-diffusion field rendered in GLSL.

## Installation Notes
Calibrate the microphone gain before opening; see [[proximity-garden]] for the
sensor rig.
:::
::: ko
## 개요
라이브 사운드에 반응해 피어나는 벽면 크기의 영상입니다. 오디오 엔진은
[[spectral-drift]] 와 공유합니다.

### 셰이더
각 주파수 대역이 GLSL로 렌더링되는 반응-확산 필드를 구동합니다.

## 설치 노트
개막 전 마이크 게인을 보정하세요. 센서 장치는 [[proximity-garden]] 를 참고하세요.
:::
::: ja
## 概要
ライブ音に反応して咲く壁面サイズのプロジェクションです。オーディオエンジンは
[[spectral-drift]] と共有しています。

### シェーダー
各周波数帯域が GLSL でレンダリングされる反応拡散場を駆動します。

## 設置メモ
開場前にマイクのゲインを調整してください。センサー機構は [[proximity-garden]] を参照。
:::
