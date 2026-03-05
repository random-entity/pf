---
title: 幽霊劇団「深刻な夜を過ごそう」（室内移植版）
parent: Selected works
layout: default
nav_order: -2022.0324
---

<!-- prettier-ignore-start -->

# 幽霊劇団「深刻な夜を過ごそう」（室内移植版）
{: .no_toc }

機械の中の幽霊たちが歌う、人間と愛についての詩。
{: .fs-5 .fw-300 }

![](../../../assets/images/works/ghost-theater/zones.jpg)

Interactive sound installation
{: .label }
Audio signal processing
{: .label .label-green }
3D audio effect
{: .label .label-green }
Ambisonics
{: .label .label-green }
AR audio rendering
{: .label .label-green }
Physical computing
{: .label .label-green }
Embedded system
{: .label .label-green }
Microcontroller
{: .label .label-green }
Printed circuit board
{: .label .label-green }
Local positioning system
{: .label .label-green }
IMU sensor
{: .label .label-green }
BNO055
{: .label .label-purple }
PJRC Teensy
{: .label .label-purple }
C++
{: .label .label-purple }
v2022-03-24
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
      <dd>インタラクティブ・サウンド・インスタレーション</dd>
      <dt>構成</dt>
      <dd><span markdown="1">
        鑑賞者が着用するGLPSヘッドホン[^1]と、展示空間内のスポットライトで示される各「領域」に配置された立体音響シーンで構成されるインタラクティブ・サウンド・インスタレーション
      </span></dd>
    </dl>
  </dd>
  <dt>制作陣</dt>
  <dd>
    <dl>
      <dt>出品者</dt>
      <dd>ソウルオープンメディア<span markdown="1">[^2]</span> (クォン・ビョンジュン<span markdown="1">[^3]</span>、ペク・ジュホン、任意存在)</dd>
      <dt>総括ディレクター、<br />ハードウェア設計、<br />音響</dt>
      <dd>クォン・ビョンジュン</dd>
      <dt>ハードウェア設計</dt>
      <dd>ペク・ジュホン</dd>
      <dt>ソフトウェア開発</dt>
      <dd>任意存在（Random Entity）</dd>
    </dl>
  </dd>
  <dt>公開</dt>
  <dd>
    <dl>
      <dt>展示</dt>
      <dd><span markdown="1">
        [ソウル大学美術館 ⟨チューリングテスト：AIの愛の告白⟩ 展](http://www.snumoa.org/exhibitions_view.php?exh_id=151) (2022年)
      </span></dd>
    </dl>
  </dd>
  <dt>ソースコード</dt>
  <dd><span markdown="1">
      [GitHub - 筆者（任意存在）担当範囲](https://github.com/random-entity/o.art.ghost-theater-snumoa)
  </span></dd>
</dl>

## あらすじ

- 展示空間に入った観覧客はGLPSヘッドホン[^1]を着用する。
- 展示空間の床にスポットライトで示された「領域」に鑑賞者が進入すると、まるでその領域を取り囲む仮想の音響空間のシーンに入り込んだかのようなAR（拡張現実）立体音響が再生される。各「領域」ではそれぞれ異なる「演劇」が繰り広げられる。
- 音源には、クォン・ビョンジュン作家がAIと共に作成した演劇を演じる声優たちの音声ナレーション、クォン・ビョンジュン作家がサウンドアーティスト、ミュージシャン、電子楽器研究者として作曲した音響および音楽などが含まれる。
- 鑑賞者が「領域」に入っていない時は、最も近い「領域」から鐘の音が聞こえ、鑑賞者を「領域」へと導く。
- 鑑賞者は、現実の展示空間には見えない「幽霊劇団」の歌を、GLPSヘッドホンによって展開されるAR音響領域の中で鑑賞する。

{% include scroll_gallery.html images="
  ../../../assets/images/works/ghost-theater/exhibition_1.jpg |
  展示空間の壁に掛けられたGLPSヘッドホン
  |||||
  ../../../assets/images/works/ghost-theater/exhibition_2.jpg |
  各「領域」は、展示空間の床の明るい円形スポットライトによって示される。
  |||||
  ../../../assets/images/works/ghost-theater/listening.jpg |
  「領域」内での鑑賞
  |||||
  ../../../assets/images/works/ghost-theater/som.jpg |
  展示の設営中
" %}

## 解説

- 本作は、クォン・ビョンジュン作家が元来野外作品として演出していた作品[⟨幽霊劇団「深刻な夜を過ごそう」⟩](https://byungjun.pe.kr/works/we-will-have-a-serious-night)をソウル大学美術館の室内に圧縮して展示した室内移植版である。韓屋村や農村など野外の多様な場所で繰り広げられていたロボットたちの演劇と歌を美術館室内の展示空間の中で再構成するため、本室内移植版のために開発されたGLPSヘッドホン[^1]バージョンには、鑑賞者が仮想の音響的空間の中に入り込んでいるように知覚させるリアルタイム立体音響効果機能が追加された。これにより、同じ展示会内の他の作品が展示されている現実の空間の中に隠れている、もう一つの「幽霊」のような音響空間レイヤーを重畳させる。

## 技術

### 概要

- GLPSヘッドホン[^1]は、鑑賞者の位置と頭の向きを認識し、そのデータに基づいてリアルタイムで立体音響効果処理された音響を出力する。

### 詳細

- GLPSヘッドホンのハードウェア:
  - GLPSヘッドホンは、既製品のヘッドホンの電子回路に、[PJRC Teensy]をマイクロプロセッサとして搭載したPCBを追加装着することで作られる。
  - GLPSヘッドホンを着用した鑑賞者の頭の向きを認識するためにIMUセンサー（[Adafruit BNO055]）が使用された。
  - 展示空間内のGLPSヘッドホンの位置を認識するためにカスタムLPSシステム（[DW1000]など）が使用された。LPSシステムは、GLPSヘッドホンに組み込まれたLPSモジュール基板（[DW1000]）から展示空間内の3つの固定された地点（アンカー）に設置されたLPSモジュール基板（[DW1000]）までの距離を測定し、三辺測量法を通じて鑑賞者の位置を計算する。
  - 音源オーディオファイルを保存し読み込むためにmicroSDカードが使用された。
- **GLPSヘッドホンのソフトウェア**:
  - LPSシステムから得た位置情報を基に、鑑賞者がどの「領域」にも入っていなければ鐘の音を、いずれかの「領域」に入っていればその「領域」に合った音響が再生されるようにした。
  - IMUセンサーから得た鑑賞者の頭の向きを基に立体音響効果を出すため、[Ambisonics]形式のオーディオ信号を方向に合わせてデコードしたり、複数のモノラルオーディオが特定の地点に分布した点音源のように聞こえるようパン（pan）するオーディオ信号処理をプログラミングした。
  - 以上の機能を実行するプログラムは、[Teensy SDK]と[Teensy オーディオ SDK]を活用してC++で作成され、GLPSヘッドホンの組み込みシステムの[Teensy]にアップロードされた。

### 筆者（任意存在）が担当した範囲

- 筆者（任意存在）が担当した部分は、GLPSヘッドホンの組み込みシステムのためのソフトウェア開発[（ソースコード）](https://github.com/random-entity/o.art.ghost-theater-snumoa)である。
- 詳細セクションに作成したリストの筆者担当項目のルートは**太字**になっている。

## 外部リンク

- [YouTube - ソウル特別市美術館協議会 - 展示紹介映像](https://youtu.be/euUhxTG8qOQ)
- [クォン・ビョンジュン作家ウェブサイト - 幽霊劇団「深刻な夜を過ごそう」（洪東貯水池）](https://byungjun.pe.kr/works/we-will-have-a-serious-night)

---

[^1]: クォン・ビョンジュン／ソウルオープンメディアの作品の多くに使用される特殊改造ヘッドホン。組み込みシステム内のPJRC TeensyマイクロコントローラやGPSまたはLPS（local positioning system）モジュールなどによって動作し、各作品の用途に合わせて部品が追加され、ソフトウェアがプログラミングされる。

[^2]: クォン・ビョンジュン作家が主導するメディアアート作品制作チーム。

[^3]: (1971–) サウンド、ロボット、パフォーマンスなどをメディアとする韓国の現代美術家。2024年国立現代美術館「今年の作家賞 2023」受賞。(参照: [作家ウェブサイト](https://byungjun.pe.kr/))

[PJRC Teensy]: https://www.pjrc.com/teensy-4-0/
[Teensy]: https://www.pjrc.com/teensy-4-0/
[Adafruit BNO055]: https://learn.adafruit.com/adafruit-bno055-absolute-orientation-sensor/overview
[DW1000]: https://www.qorvo.com/products/p/DW1000
[Ambisonics]: https://en.wikipedia.org/wiki/Ambisonics
[Teensy SDK]: https://www.pjrc.com/teensy/td_download.html
[Teensy オーディオ SDK]: https://github.com/PaulStoffregen/Audio
