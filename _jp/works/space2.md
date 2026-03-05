---
title: 空間#2
parent: Selected works
layout: default
nav_order: -2021.1209
---

<!-- prettier-ignore-start -->

# 空間#2
{: .no_toc }

地下、水の中にもう一人の私がいる。
{: .fs-5 .fw-300 }

![](../../../assets/images/works/space2/space2_viewer.jpg)

Interactive video installation
{: .label }
Interactive CG
{: .label .label-green }
Shader programming
{: .label .label-green }
Off-axis projection
{: .label .label-green }
Point cloud rendering
{: .label .label-green }
Video projection
{: .label .label-green }
Motion sensor
{: .label .label-green }
Depth sensor
{: .label .label-green }
Unity
{: .label .label-purple }
Kinect
{: .label .label-purple }
v2021-12-09
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
        モーション/深度センサーのデータを反映するインタラクティブCGレンダリングシステムと、プロジェクターによる暗室の床へのインタラクティブ映像プロジェクション
      </dd>
    </dl>
  </dd>
  <dt>制作陣</dt>
  <dd>
    <dl>
      <dt>演出、<br />プログラミング</dt>
      <dd>任意存在</dd>
      <dt>スタッフ</dt>
      <dd>KIM Junyeong、LEE Hojeong</dd>
    </dl>
  </dd>
  <dt>公開</dt>
  <dd>
    <dl>
      <dt>展示</dt>
      <dd><span markdown="1">
        [SNU Design Week](https://snudesignweek.com/)[^1] 2021（ソウル大学美術大学デザイン学部 卒業展示）
      </span></dd>
      <dt>Web</dt>
      <dd>
        <dl>
          <dt>デモ映像</dt>
          <dd><span markdown="1">
            [YouTube - 1人称視点 観覧映像](https://youtu.be/ftJX44qtPxQ)
          </span></dd>
        </dl>
      </dd>
    </dl>
  </dd>
  <dt>ソースコード</dt>
  <dd><span markdown="1">
    [GitHub（大容量アセット非包含）](https://github.com/random-entity/o.art.space2)、[Google Drive（全アセット包含）](https://drive.google.com/file/d/112Rpy9AwwKdn4x6iE0SvC2Z2Ior7JZGa)
  </span></dd>
</dl>

## あらすじ

- 鑑賞者が暗室に入ると、床に直径と深さ約3メートルの穴が見える。穴の中には水が満たされており、水の中には鑑賞者自身が見える。鑑賞者は、床の下の空間にいる自身のクローンを、床の上の現実世界から見下ろすことになるのである。
- プロジェクション映像は鑑賞者の動きに反応してリアルタイムに歪み、鑑賞者の視点から常に床の下の空間が立体的に見えるように構成されている。
- 鑑賞者が動くと水面に波紋が広がる。穴の中央に近づくと、水の中の鑑賞者のクローンは断片化して散らばり、各断片は魚に変身して水中を泳ぎ回る。

<iframe width="560" height="315" src="https://www.youtube.com/embed/ftJX44qtPxQ?si=QPL5JpZo8lpI7RE-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

{% include scroll_gallery.html images="
  ../../../assets/images/works/space2/space2_viewer-none.jpg |
  鑑賞者がいない時の暗室内部
  |||||
  ../../../assets/images/works/space2/space2_viewer.jpg |
  鑑賞者が穴の中央にいる時 <br/> 前の写真と比較すると、映像が変形していることが確認できる。鑑賞者の視点から床の下の空間が立体的に見えるように変形されたのである。
  |||||
  ../../../assets/images/works/space2/space2_fish-walk.jpg |
  鑑賞者が穴の中央に近づくと、水底の鑑賞者のクローンが断片化して散らばり、各断片は魚に変身する。
  |||||
  ../../../assets/images/works/space2/space2_fish-stand.jpg |
  鑑賞者が穴のちょうど中央に立った時、魚たちは最大サイズになる。
  |||||
  ../../../assets/images/works/space2/space2_matome.jpg |
  上記デモ映像のスチール集
  |||||
  ../../../assets/images/works/space2/space2_diagram_fixed-symmetry.png |
  コンセプトダイアグラム（イラストレーション：イ・ホジョン）
" %}

## 解説

- 本作は、鑑賞者が自らを見つめる瞑想的な空間の中で、心理的重圧感およびその解消の感覚を体験できるように設計した映像インスタレーション作品である。
- 床の下の空間は、内面を映し出す仮想の空間として作用する。この仮想の空間は、床の上の現実空間と鑑賞者の身体を共有しながらも、彼を取り巻く環境を異にする。
- 重圧感は、床の下の鑑賞者のクローンが閉鎖的な水中空間にいることを知覚させることによって伝達される。地面に掘られた円筒形の深い穴と、鑑賞者の動きに反応する水面の波紋が、このような知覚を可能にする。
- 重圧感の解消は、水の中の鑑賞者のクローンが断片化して魚の群れに変身するモーショングラフィックスを通じて表現される。人間にとって水中は息苦しい空間だが、魚たちにとっては自由に泳ぎ回れる空間である。また、この変身は、身体が分解されて自然へと還る生と死の循環過程を連想させる。
- 鑑賞者と床の下の鑑賞者のクローンの位置は、一定の高さの差を維持したまま、水平平面上では穴の中心を基準に対称を維持する。（すなわち、床を$$xy$$平面とし、穴の中心を原点とした時、鑑賞者の位置が$$(x,y,z)$$であれば、クローンの位置は$$(-x,-y,z-h)$$（$$h$$は定数）となるのである。）鑑賞者がクローンと水平平面上で重なる地点は穴の中心であり（$$(x,y)=(-x,-y) \iff (x,y)=(0,0)$$）、この地点に近づく時、変身モーショングラフィックスが活性化される。これは、内面との統合が自然への帰化を通じてなされることを表現している。

## 技術

- 床に映像を投影するためにプロジェクターを使用した。
- 鑑賞者が一人ずつ外部と隔離された環境に入って落ち着いて鑑賞できるように、そして映像がよく見えるように暗室を作った。
- モーション/深度センサーのデータを反映するインタラクティブCGレンダリングシステムにKinectとUnityを使用した。
  - 鑑賞者の動きに反応し、彼の視点から床の下の空間が常に立体的に見えるようにするため、Kinect SDKを通じて抽出した鑑賞者の頭の位置情報と、Unityのカメラコンポーネントのoff-axis projectionプログラミングを使用した。
  - 穴の中の鑑賞者のクローンは、Kinectが読み取った鑑賞者の深度情報を利用し、Unityおよびそのシェーダープログラミングによるpoint cloudレンダリングで作成した。
  - クローンから魚の群れへの連続的な変身、および魚の群れが泳ぐモーショングラフィックスも、Unityおよびそのシェーダープログラミングで作成した。

### 参考資料

- [Off-axis projection in Unity - Michel de Brisis](https://medium.com/try-creative-tech/off-axis-projection-in-unity-1572d826541e)
- [Cg Programming/Unity/Projection for Virtual Reality - Wikibooks](https://en.wikibooks.org/wiki/Cg_Programming/Unity/Projection_for_Virtual_Reality)
- [Generalized Perspective Projection - Robert Kooima](https://web.archive.org/web/20241230234113/http://160592857366.free.fr/joe/ebooks/ShareData/Generalized%20Perspective%20Projection.pdf)
- [Waves - Catlike Coding](https://catlikecoding.com/unity/tutorials/flow/waves/)
- [Kinect v2 のデプス画像をそのままの解像度で点群としてUnityで表示する - いずみはら あつし](https://izmiz.hateblo.jp/entry/2017/12/30/003542)
- [Point cloud rendering with Unity - Ahmad Erfani](https://bootcamp.uxdesign.cc/point-cloud-rendering-with-unity-1a07345eb27a)

## 外部リンク

- [Vimeo - SNU Design - 展示紹介](https://vimeo.com/659521474#t=48.641)
- [Instagram - SNU Design Week - 作品紹介](https://www.instagram.com/p/CXC3XytvUHL/)
- [ソウル大学美術大学ウェブサイト - 卒業作品情報](https://art.snu.ac.kr/exgallery/%ea%b9%80%ed%83%9d%eb%af%bc-%eb%94%94%ec%9e%90%ec%9d%b8-%ed%95%99%ec%82%ac/)

---

[^1]: 2021年エディションのウェブサイトは現在アクセス不可である。[Wayback Machineを通じて当時の「オンライン展示ウェブサイト」の表紙画面は見ることができる](https://web.archive.org/web/20220116184406/https://snudesignweek.com/)。