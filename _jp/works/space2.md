---
title: 空間#2
layout: default
parent: Works
nav_order: -2021.1209
---

<!-- prettier-ignore-start -->

# 空間#2
{: .no_toc }

地面の下、水の中にもうひとりの私がいる。
{: .fs-5 .fw-300 }

![](../../../assets/images/works/space2/space2_viewer.jpg)

Interactive video installation
{: .label }
Interactive CG
{: .label .label-green }
Off-axis projection
{: .label .label-green }
Shader
{: .label .label-green }
Point cloud
{: .label .label-green }
Motion sensor
{: .label .label-green }
Depth sensor
{: .label .label-green }
v2021-12-09
{: .label .label-purple }

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
        KinectとUnityで駆動されるリアルタイム・デジタル・画像処理システム<br>
        １チャンエル・デジタル映像プロジェクション
      </dd>
      <dt>素材</dt>
      <dd>暗室、PC、Kinect、プロジェクター</dd>
      <dt>サイズ</dt>
      <dd>可変</dd>
    </dl>
  </dd>
  <dt>使用技術</dt>
  <dd>
    <dl>
      <dt>インタラクティブCG,<br/>Off-axis projection,<br/>Point cloud</dt>
      <dd>Unityおよびそのシェーダー・プログラミング</dd>
      <dt>モーション／深度センサー</dt>
      <dd>Kinect</dd>
    </dl>
  </dd>
  <dt>制作</dt>
  <dd>
    <dl>
      <dt>演出／プログラミング</dt>
      <dd>任意存在</dd>
      <dt>スタッフ</dt>
      <dd>KIM Junyeong, LEE Hojeong</dd>
    </dl>
  </dd>
  <dt>公開</dt>
  <dd>
    <dl>
      <dt>展示</dt>
      <dd><a href="https://art.snu.ac.kr/exgallery/%ea%b9%80%ed%83%9d%eb%af%bc-%eb%94%94%ec%9e%90%ec%9d%b8-%ed%95%99%ec%82%ac/">SNU Design Week 2021（ソウル大学美術大学デザイン学部卒業展示）</a>（<a href="https://www.instagram.com/p/CXC3XytvUHL/">Instagram</a>, <a href="https://vimeo.com/659521474#t=48.641">Vimeo</a>）</dd>
      <dt>随時</dt>
      <dd>
        <dl>
          <dt>デモ動画</dt>
          <dd><a href="https://youtu.be/ftJX44qtPxQ">YouTube</a>（一人称視点の観覧映像）</dd>
          <dt>ソースコード</dt>
          <dd><a href="https://github.com/random-entity/o.art.space2">GitHub</a></dd>
        </dl>
      </dd>
    </dl>
  </dd>
</dl>

## あらすじ

- 鑑賞者が暗室に入ると、床に直径・深さ約3メートルの穴が現れる。穴の中には水が満ちており、その水中には鑑賞者自身が映っている。
  鑑賞者は床下の空間に存在する自分のクローンを、床上の現実世界から見下ろすことになる。
- 投影映像は鑑賞者の動きに反応してリアルタイムに歪み、鑑賞者の視点から常に床下空間が立体的に見えるように構成されている。
- 鑑賞者が動くと水面に波紋が広がる。穴の中心に近づくと水中のクローンは破片化して散り、各々の破片は魚へと変身し水中を泳ぎ回る。

## 画像

{% include scroll_gallery.html images="
  ../../../assets/images/works/space2/space2_diagram_fixed-symmetry.png |
  コンセプト図
  |||||
  ../../../assets/images/works/space2/space2_viewer-none.jpg |
  鑑賞者がいない暗室内部
  |||||
  ../../../assets/images/works/space2/space2_viewer.jpg |
  鑑賞者が穴の中心に立ったとき <br/> 前の写真と比べると映像が変形していることが確認できる。鑑賞者視点で床下空間が立体的に見えるよう変形しているのである。
  |||||
  ../../../assets/images/works/space2/space2_fish-walk.jpg |
  鑑賞者が穴の中心に近づくと水中のクローンが破片化し、各々の破片は魚へと変身する。
  |||||
  ../../../assets/images/works/space2/space2_fish-stand.jpg |
  鑑賞者が真ん中に立つと魚は最大サイズになる。
  |||||
  ../../../assets/images/works/space2/space2_matome.jpg |
  上記デモ動画スチル集
" %}

## 解説

- 本作は、鑑賞者が自己を眺める瞑想的な空間の中で、心理的な重圧とその解放の感覚を体験できるように設計したインスタレーションである。
- 床下空間は内面を映し出す仮想空間として作用する。この仮想空間は床上の現実空間と鑑賞者の身体を共有しながらも、彼を取り巻く環境を異にする。
- 重圧感は、床下の鑑賞者のクローンが閉鎖的な水中空間にいるという知覚によって伝達される。地面に穿たれた円筒状の深い穴と、鑑賞者の動きに反応する水面の波紋がその知覚を可能にする。
- 重圧の解放は、水中のクローンが破片化し魚群へと変身するモーショングラフィックスによって表現される。人間にとって水中は息苦しい空間であるが、魚にとっては自由に泳げる空間である。またこの変身は、身体が分解され自然へ還る生と死の循環を想起させる。
- 鑑賞者と床下クローンの位置は一定の高さ差を保ちながら、水平面上では穴の中心を基準に対称となる。（床上の鑑賞者の位置が $$(x,y,z)$$ であれば、クローンの位置は $$(-x,-y,z-h)$$（$$h$$は定数）となる。）鑑賞者がクローンと水平面上で重なる地点は穴の中心であり（$$(x,y)=(-x,-y) \iff (x,y)=(0,0)$$）、そこに近づくによって変身モーショングラフィックスが活性化する。これは内面との統合が自然への帰化を通して達成されることを示している。

## 技術

- 床面への投影のために短焦点プロジェクターを使用した。
- 鑑賞者が一人ずつ外界から隔離された環境で落ち着いて鑑賞でき、映像が明瞭に見えるよう暗室を建てた。
- インタラクティブCGレンダリングにはUnityを使用した。
- 水中のクローンはKinectが取得した深度情報を用いたpoint cloudレンダリングによって生成された。
- 鑑賞者が動いても床下空間が常に立体的に見えるよう、Kinectが検出した頭部位置とUnity上でのoff-axis projectionプログラミングを用いた。
- [(ソースコード)](https://github.com/random-entity/o.art.space2)

## 参考資料

- [Off-axis projection in Unity - Michel de Brisis](https://medium.com/try-creative-tech/off-axis-projection-in-unity-1572d826541e)
- [Cg Programming/Unity/Projection for Virtual Reality - Wikibooks](https://en.wikibooks.org/wiki/Cg_Programming/Unity/Projection_for_Virtual_Reality)
- [Generalized Perspective Projection - Robert Kooima](https://web.archive.org/web/20241230234113/http://160592857366.free.fr/joe/ebooks/ShareData/Generalized%20Perspective%20Projection.pdf)
- [Waves - Catlike Coding](https://catlikecoding.com/unity/tutorials/flow/waves/)
