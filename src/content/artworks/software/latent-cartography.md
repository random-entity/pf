---
title: { en: Latent Cartography, ko: 잠재 지도학, ja: 潜在のカートグラフィ }
date: 2025-01-20
genre: { en: Generative Software, ko: 제너러티브 소프트웨어, ja: ジェネラティブ・ソフトウェア }
medium: { en: "Browser application, WebGL", ko: "브라우저 애플리케이션, WebGL", ja: "ブラウザアプリケーション、WebGL" }
tools: [TypeScript, WebGL, PyTorch]
tags: [software, generative, ai, realtime]
status: { en: Online, ko: 온라인, ja: 公開中 }
---
::: en
## What It Is
An infinite, navigable map drawn from the latent space of a small image model.
Pan anywhere; the terrain is computed, never stored.

### Architecture
A tiny model runs client-side; tiles are synthesized on demand in WebGL.

## Notes
The rendering pipeline is shared with [[clockwork-bloom]].
:::
::: ko
## 작품 소개
작은 이미지 모델의 잠재 공간에서 그려지는 무한히 탐색 가능한 지도입니다. 어디로든
이동하세요. 지형은 저장되지 않고 매번 계산됩니다.

### 구조
작은 모델이 클라이언트에서 실행되며, 타일은 WebGL에서 필요할 때 합성됩니다.

## 노트
렌더링 파이프라인은 [[clockwork-bloom]] 과 공유합니다.
:::
::: ja
## 作品について
小さな画像モデルの潜在空間から描かれる、無限に探索可能な地図です。どこへでも移動でき、
地形は保存されず常に計算されます。

### アーキテクチャ
小さなモデルがクライアント側で動作し、タイルは WebGL でオンデマンドに合成されます。

## ノート
レンダリングパイプラインは [[clockwork-bloom]] と共有しています。
:::
