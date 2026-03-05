---
title: デジタル梅花砲
parent: Selected works
layout: default
nav_order: -2023.1006
---

<!-- prettier-ignore-start -->

# デジタル梅花砲[^1]
{: .no_toc }

デジタルアートとして皆の目の前に再現された、正祖（チョンジョ）の華城行幸当時の梅花砲。
{: .fs-5 .fw-300 }

![](../../../assets/images/works/suwonhwaseong/main_name-cut.jpg)

Interactive video installation
{: .label }
Interactive CG
{: .label .label-green }
Webcam
{: .label .label-green }
Real-time video processing
{: .label .label-green }
LED cube display
{: .label .label-green }
Processing
{: .label .label-purple }
v2023-10-06
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
      <dd>インタラクティブ映像インスタレーション</dd>
      <dt>構成</dt>
      <dd>
        幅・奥行・高さ約2メートルのLEDキューブディスプレイで再生され、周囲の観覧客の動きに反応するインタラクティブ映像インスタレーション
      </dd>
    </dl>
  </dd>
  <dt>制作陣</dt>
  <dd>
    <dl>
      <dt>出品者</dt>
      <dd>ヘガン<span markdown="1">[^2]</span>、任意存在</dd>
      <dt>アニメーション</dt>
      <dd>ヘガン</dd>
      <dt>ソフトウェア開発</dt>
      <dd>任意存在</dd>
      <dt>コミッション</dt>
      <dd>水原文化財団</dd>
    </dl>
  </dd>
  <dt>公開</dt>
  <dd>
    <dl>
      <dt>イベント</dt>
      <dd><span markdown="1">
        [2023 文化遺産メディアアート水原華城](https://www.swcf.or.kr/hlfl/?p=10) - メディアグラウンド
      </span></dd>
    </dl>
  </dd>
  <dt>ソースコード</dt>
  <dd><span markdown="1">
    [GitHub - 私（任意存在）担当範囲](https://github.com/random-entity/o.w.suwonhwaseong)
  </span></dd>
</dl>

## あらすじ

- 水原華城の国弓体験場の芝生に、幅・奥行・高さ約2メートルのLEDキューブが設置されている。
- LEDキューブの側面4面には、螺鈿（らでん）で描かれた伝統的な韓国画のデジタルイラストレーションが、夕暮れの暗闇の中で玲瓏たる色彩を放ちながら再生される。
- 観覧客がキューブに近づくと、絵の中で梅花砲が打ち上げられ、炸裂する。

{% include scroll_gallery.html images="
  ../../../assets/images/works/suwonhwaseong/IMG_5496.JPG |
  2023 文化遺産メディアアート水原華城「メディアグラウンド」展示風景
  |||||
  ../../../assets/images/works/suwonhwaseong/IMG_5489.JPG |
  2023 文化遺産メディアアート水原華城「メディアグラウンド」展示風景
" %}

## 解説

- 2023年の⟨文化遺産メディアアート水原華城⟩は、「水原華城へ行幸する正祖大王と彼を歓迎する民衆が一つになった[行幸（王のお出かけ）](https://encykorea.aks.ac.kr/Article/E0076462)を現代の多彩な光で描き出す」というコンセプトで企画された、水原華城の文化遺産を活用した公共公演および展示フェスティバルである。
- 大韓民国宝物第1430号⟨華城行幸図屏風⟩は、朝鮮時代で最も盛大な祝宴であった[正祖の1795年の華城行幸](https://en.wikipedia.org/wiki/Hwaseong_Fortress#The_1795_Eight_Days_Parade)を描いた8曲の屏風絵であり、このうち[⟨得中亭御射図⟩](https://en.wikipedia.org/wiki/Hwaseong_Fortress#/media/File:Blue6-Haenghaeng-deugjungjeongeosa.jpg)が本作のテーマとなった。
- [本作のアニメーション](https://www.instagram.com/p/CySyq06LRCA/)は、⟨得中亭御射図⟩に描かれた得中亭での梅花砲を、螺鈿素材の韓国画アニメーションで表現したものである。観覧客の接近に反応して梅花砲が炸裂するインタラクティブアニメーションは、原作に描かれているように広場で皆が共に集まって楽しんだ梅花砲の風習を再現している。

{% include scroll_gallery.html images="
  https://upload.wikimedia.org/wikipedia/commons/e/ea/Blue6-Haenghaeng-deugjungjeongeosa.jpg |
  梅花砲が描かれた⟨得中亭御射図⟩
  |||||
  ../../../assets/images/works/suwonhwaseong/IMG_5381.jpeg |
  LEDキューブ設置中
" %}

## 技術

- LEDキューブに接近する観覧客に反応して梅花砲のアニメーションを再生するインタラクティブCGシステムのために、LEDキューブの側面4面の上部にそれぞれ設置された4台のウェブカメラと[Processing]を使用した。[Processing]スケッチは、ウェブカメラの画像を処理して画面内の観覧客の動きを検知し、これに反応して梅花砲のアニメーションを再生する。

## 外部リンク

- [Instagram - ヘガン作家 - 作品紹介ポスト](https://www.instagram.com/p/CyP-OaOLp6w)
- [YouTube - 水原文化観光TV - イベントトレーラー](https://youtu.be/SvUiZ4-Wfps)
- [YouTube - 水原文化観光TV - イベントハイライト](https://youtu.be/kyW14W-CWt8)
- [水原華城観光ウェブサイト - イベント紹介](https://www.visitsuwon.or.kr/base/board/read?boardManagementNo=12&boardNo=301&searchCategory=&page=1&searchType=&searchWord=&menuLevel=3&menuNo=38)
- [水原文化財団 プレスリリース](https://www.swcf.or.kr/?p=120&viewMode=view&idx=53614)
- [水原特例市 プレスリリース](https://www.suwon.go.kr/web/board/BD_board.view.do?bbsCd=1043&seq=20231010101202464)
- [水原特例市 公式ブログ](https://blog.naver.com/suwonloves/223227677322)
- [京畿新聞 記事](https://www.kgnews.co.kr/news/article.html?no=769353)
- [ウリ文化新聞 記事](https://www.koya-culture.com/news/article.html?no=142482)

---

[^1]: 朝鮮時代の花火の一種。梅の花のような形で弾けて咲くという意味を持つ名前である。

[^2]: デジタルフォーマットで伝統的な韓国画を描くイラストレーター。（[Instagram](https://www.instagram.com/hyyekang)）

[Processing]: https://processing.org/