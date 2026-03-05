---
title: 時間#3
parent: Selected works
layout: default
nav_order: -2021.102501
---

<!-- prettier-ignore-start -->

# 時間#3
{: .no_toc }

現在と過去が重なり合い、その重なりが再び未来と重なり合う。
{: .fs-5 .fw-300 }

![](../../../assets/images/works/time3/demo-video-stills/1.png)

Interactive video installation
{: .label }
Real-time video processing
{: .label .label-green }
Video feedback
{: .label .label-green }
Fractal video
{: .label .label-green }
Video projection
{: .label .label-green }
TouchDesigner
{: .label .label-purple }
EOS Camera Utility
{: .label .label-purple }
v2021-10-25
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
        カメラからのリアルタイム画像入力を処理するCGシステムとプロジェクション間のフィードバックによるインタラクティブ映像プロジェクション
      </dd>
    </dl>
  </dd>
  <dt>制作陣</dt>
  <dd>
    <dl>
      <dt>出品者</dt>
      <dd>任意存在（チーム）（任意存在、イ・ホジョン、チョ・ミンギ）</dd>
      <dt>演出、<br />プログラミング</dt>
      <dd>任意存在（Random Entity）</dd>
      <dt>スタッフ</dt>
      <dd>イ・ホジョン、チョ・ミンギ</dd>
    </dl>
  </dd>
  <dt>公開</dt>
  <dd>
    <dl>
      <dt>展示</dt>
      <dd><span markdown="1">
        [2021年ソウル大学芸術週間：ArtSpace@SNU 2021](https://art.snu.ac.kr/notice/2021-%EC%98%88%EC%88%A0%EC%A3%BC%EA%B0%84-art-spacesnu-%ED%96%89%EC%82%AC-%EC%95%8C%EB%A6%BC/)
      </span></dd>
      <dt>Web</dt>
      <dd>
        <dl>
          <dt>オンライン展示ストリーム</dt>
          <dd><span markdown="1">
            [YouTube](https://youtube.com/playlist?list=PLHd0nQV4yFCttLpyaW8WxbNHLY5K0mgyV&si=C2fMDkA4e8AyUCpZ)
          </span></dd>
        </dl>
      </dd>
    </dl>
  </dd>
  <dt>ソースコード</dt>
  <dd><a href="https://github.com/random-entity/o.art.time3">GitHub</a></dd>
</dl>

## あらすじ

- 本作は公共の場の踊り場に設置された。鑑賞者は壁のプロジェクションと反対側のカメラの間を通り過ぎる。すると壁のプロジェクションに自身の姿およびフィードバックによる連鎖的な映像の中の映像の中の映像...へと繋がるそのこだまが見える。
- その画像は約10秒後（鑑賞者が階段を上り下りして再びその壁を見ることができる位置に来た頃）、映像の中の映像の中で再び現れる。20秒後にはさらにその中の映像に、30秒後にはさらにその中の映像に現れる過程が繰り返されるとともに、幻影のようにかすんでいく。
- 踊り場で10秒以上過ごすと、現在と過去が重なり合い、異なる時間のレイヤーが目まぐるしく絡み合う奇妙な時間的感覚を体験できる。

<iframe width="560" height="315" src="https://www.youtube.com/embed/D_rsLAvh-H0?si=NczS3TUO8Mb17WaG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 解説

- 本作は「現在の中にも幻影のように存在する過去」を映像インスタレーション作品として実装する。
- 本作は基本的に壁のプロジェクションをカメラで撮影し、それを再び壁に投影するフィードバックシステムであるが、壁に投影される映像は現在の映像と10秒前の映像の平均（足して2で割ったもの）である。その結果、瞬間的なフィードバックによる効果はまるで音響のリバーブ（reverberation）のような効果を生み出し、その結果に追加された過去との平均効果はまるで音響のディレイ（delay）のような効果を生み出す。鑑賞者は現在の1/2、10秒前の1/4、20秒前の1/8、30秒前の1/16などが重なり合った映像を見ることになる。
- これにより、現在と過去が一つの画像の中で重なり合うのはもちろん、その重なり自体が未来に再び繰り返されていく映像を実装する。
- このシステムが行うことをおおまかに数式として表現すると次のようになる。（$$p$$はプロジェクション映像、$$c$$はカメラ映像、$$s$$はプロジェクション映像のオリジナルをカメラがキャプチャした映像に変換する縮小および劣化変換、$$\oplus r$$は鑑賞者など現実の事物によって映像が上書きされることを表す。）

$$p(t) = \frac{c(t-\epsilon) + c(t-\epsilon-d)}{2}$$

$$c(t) = s(p(t-\epsilon')) \oplus r(t)$$

<iframe width="560" height="315" src="https://www.youtube.com/embed/j2dVTcLCedA?si=vi41cvz9uFctsTUG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 技術

- 壁の近くから壁に映像を投影し、カメラとプロジェクション映像の間の空間を鑑賞者が通り過ぎても映像が遮られないようにするため、短焦点プロジェクターを使用した。
- カメラが撮影する映像をリアルタイムでPCに入力するため、[EOS Camera Utility](https://www.usa.canon.com/support/eos-utilities)を使用した。
- 平均効果が適用されたプロジェクション画像をリアルタイムレンダリングするため、[TouchDesigner](https://derivative.ca/UserGuide/TouchDesigner)を使用した。

{% include scroll_gallery.html images="
  ../../../assets/images/works/time3/v.jpg |
  作品設置中。プロジェクション画像の中央の人は、この写真を撮った人の10秒前の過去である。
" %}

## 外部リンク

- [YouTube - ArtSpace@SNU - 作品紹介](https://youtu.be/j2dVTcLCedA)
- [Instagram - ArtSpace@SNU - 作品紹介](https://www.instagram.com/tv/CV4RdUsMEr2/)
- [Facebook - ArtSpace@SNU](https://www.facebook.com/snuartspace)
