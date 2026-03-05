---
title: 空間#1
parent: Selected works
layout: default
nav_order: -2021.1031
---

<!-- prettier-ignore-start -->

# 空間#1
{: .no_toc }

前へ進んでいるのか、それとも足踏みをしているのか。
{: .fs-5 .fw-300 }

![](../../../assets/images/works/space1/demo-video-stills/main.png)

Video game
{: .label }
Interactive CG
{: .label .label-green }
Shader programming
{: .label .label-green }
Unity
{: .label .label-purple }
v2021-10-31
{: .label .label-yellow }

## Table of Contents
{: .no_toc .text-delta }

- TOC
{:toc}

<!-- prettier-ignore-end -->

## 基本情報

<dl>
  <dt>形式</dt>   
  <dd>
    <dl>
      <dt>ジャンル</dt>
      <dd>ビデオゲーム、アートゲーム</dd>
      <dt>構成</dt>
      <dd>
        PC、モニター、キーボード、マウスで駆動する1人称視点のビデオゲーム;<br />キーボードの上/下またはW/Sキーで移動、マウスで視点操作
      </dd>
    </dl>
  </dd>
  <dt>制作陣</dt>
  <dd>
    <dl>
      <dt>演出、<br>プログラミング</dt>
      <dd>任意存在（Random Entity）</dd>
    </dl>
  </dd>
  <dt>公開</dt>
  <dd>
    <dl>
      <dt>Web</dt>
      <dd>
      <dl>
        <dt>配布</dt>
        <dd><a href="https://public-random-entities.itch.io/space1">itch.io</a></dd>
        <dt>デモ映像</dt>
        <dd><a href="https://youtu.be/KZ1KfgGF4T0">YouTube</a></dd>
      </dl>
      </dd>
    </dl>
  </dd>
  <dt>ソースコード</dt>
  <dd><a href="https://github.com/random-entity/o.art.space1">GitHub</a></dd>
</dl>

## あらすじ

- ゲームワールドの中には、大地と空、直線に伸びる一本の道、そして道に沿って前方に位置する長方形のビルとその玄関ドアが見える。
- プレイヤーはキーボードの上/下またはW/Sキーで、直線の道に沿ってビルに向かって前進したり、反対方向に後退したりできる。視点の方向はマウスに追従する。一般的なFPSゲームと同じ操作法だが、シューティング要素はなく、移動は1次元上でのみ可能である。
- プレイヤーがビルに近づくにつれて、目に見えるビルの大きさは大きくなり、やがて空全体を覆い尽くす。すると、ビルの玄関ドアに見えていた長方形が新しいビルになり、その新しいビルに再び長方形の玄関ドアが現れる。
- その新しいビルに近づくと、再びそのビルは空になり、その玄関ドアは新しいビルになる。
- この過程が繰り返されるにつれて、空、ビル、ドアの色も順次循環する。
- 全4つのフェーズが循環し、各フェーズの配色は、1日を4等分した午前6時、正午、午後6時、深夜に対応する。
- 後退してもフェーズが逆順に循環するだけで、構造は同じである。
- プレイヤーは、有限に見えるが部分と全体との類似性によって無限に拡張するフラクタル的な空間の中に永遠に閉じ込められることになる。

<iframe width="560" height="315" src="https://www.youtube.com/embed/KZ1KfgGF4T0?si=66SXqeOp1aMeS-ZY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

{% include scroll_gallery.html images="
  ../../../assets/images/works/space1/demo-video-stills/1.png |
  正午フェーズ
  |||||
  ../../../assets/images/works/space1/demo-video-stills/2.png |
  午後6時フェーズ
  |||||
  ../../../assets/images/works/space1/demo-video-stills/3.png |
  深夜フェーズ
  |||||
  ../../../assets/images/works/space1/demo-video-stills/4.png |
  午前6時フェーズ
  |||||
  ../../../assets/images/works/space1/hand-drawing.jpeg |
  コンセプトドローイング
" %}

## 解説

- 本作は、筆者（任意存在）の作品に頻繁に登場するフラクタル的/反復的な世界観をゲーム内の空間として実装し、プレイヤーが主体的にその構造を探索できるようにしたものである。
- 空っぽのゲームワールドの中に唯一そびえ立つビルは、プレイヤーに「目的地」として認識される。しかし、プレイヤーがビルに近づくほど、それは到達不可能な背景（空）へと変化し、その中に隠されていたもう一つの「目的地」（ビル）が現れる。これは、目的に向かって前進することが、すなわち次の目的の生成であり、次のフェーズの同じ局面へと繋がることを表現している。
- したがって本作は、絶えず目的に向かって進もうとする人間と、人間の目的や流れる時間とは関係なく、万物が恒常性維持の循環へと回帰する自然の構造に対する比喩として作用する。
- ミニマルな造形と平面的（フラット）な彩色を利用し、プレイヤーが各要素のディテールよりもゲーム内の空間の構造自体に集中できるようにした。

## 技術

- 1人称視点で特殊な空間内を移動しながら探索できる仮想環境を作るため、FPSゲームのような操作法を選択し、実装にはゲームエンジンUnityおよびそのシェーダープログラミングを使用した。
- 実際のところ、ゲームワールド内でのプレイヤーの位置は固定されているが、ビルオブジェクトのメッシュが長方形から空を覆う円柱へと連続的に変形していくことによって、プレイヤーはビルに近づいていると知覚することになるのである。メッシュの連続的な変形をはじめ、窓や雲の点滅などはシェーダープログラミングによって実装され、GPUリソースを活用する。
- 「Unlit」マテリアルによるレンダリングは、ゲームワールド全体がまるで色紙を切り抜いて作られたかのように見える平面的な彩色のために使用された。