---
title: { en: "Space#2", ko: "공간#2", ja: "空間#2" }
tagline:
  en: "Beneath the ground, underwater, there is another me."
  ko: "땅 밑, 물속에 또 하나의 내가 있다."
  ja: "地下、水の中にもう一人の私がいる。"
releases:
  - { event: "SNU Design Week 2021", date: "2021-12-09" }
type: Personal work
genre: ["Interactive video installation"]
tags: ["Interactive CG", "Shader programming", "Off-axis projection", "Point cloud rendering", "Video projection", "Motion sensor", "Depth sensor"]
tools: ["Unity", "Kinect"]
---
::: en
![](images/works/space2/space2_viewer.jpg)

## Basic information

- **Format**
  - Genre: Interactive video installation
  - Composition: Interactive CG rendering system reflecting motion/depth sensor data and interactive video projection on the darkroom floor by a projector
- **Creators**
  - Direction, Programming: random-entity
  - Staff: KIM Junyoung, LEE Hojeong
- **Release**
  - Exhibition: [SNU Design Week](https://snudesignweek.com/)[^1] 2021 (Seoul National University College of Fine Arts, Department of Design Graduation Exhibition)
  - Web
    - Demo Video: [YouTube — 1st person POV viewing video](https://youtu.be/ftJX44qtPxQ)
- **Source Code**: [GitHub (excluding high-capacity assets)](https://github.com/random-entity/o.art.space2), [Google Drive (including all assets)](https://drive.google.com/file/d/112Rpy9AwwKdn4x6iE0SvC2Z2Ior7JZGa)

## Synopsis

- When the viewer enters the darkroom, a hole about 3 meters in diameter and depth is seen on the floor. The hole is filled with water, and the viewer sees themselves in the water. The viewer ends up looking down at their clone in the space beneath the floor from the real world above the floor.
- The projection video distorts in real-time in response to the viewer's movements, configured so that the space beneath the floor always appears three-dimensional from the viewer's perspective.
- When the viewer moves, waves ripple across the water's surface. Approaching the center of the hole, the viewer's clone in the water fragments and scatters, and each fragment transforms into a fish swimming around in the water.

[Video](https://youtu.be/ftJX44qtPxQ)

![](images/works/space2/space2_viewer-none.jpg)
*Inside the darkroom when there is no viewer*

![](images/works/space2/space2_viewer.jpg)
*When the viewer is at the center of the hole; Compared to the previous photo, it can be seen that the video is distorted. It is distorted so that the space beneath the floor appears three-dimensional from the viewer's perspective.*

![](images/works/space2/space2_fish-walk.jpg)
*When the viewer approaches the center of the hole, the clone underwater fragments and scatters, and each fragment transforms into a fish.*

![](images/works/space2/space2_fish-stand.jpg)
*When the viewer stands exactly at the center of the hole, the fish reach their maximum size.*

![](images/works/space2/space2_matome.jpg)
*Collection of stills from the demo video above*

![](images/works/space2/space2_diagram_fixed-symmetry.png)
*Concept diagram (Illustration: LEE Hojeong)*

## Commentary

- This work is a video installation designed for viewers to experience the feeling of psychological pressure and its release within a meditative space where they observe themselves.
- The space beneath the floor acts as a virtual space reflecting the inner self. This virtual space shares the viewer's physical body and the real space above the floor, but features a different surrounding environment.
- The psychological pressure is conveyed by making the viewer perceive that their clone beneath the floor is in a closed underwater space. The deep cylindrical hole dug into the ground and the ripples on the water surface reacting to the viewer's movements make this perception possible.
- The release of pressure is expressed through motion graphics where the viewer's clone in the water fragments and transforms into a school of fish. For humans, underwater is a suffocating space, but for fish, it is a space to swim freely. Also, this transformation evokes the cyclical process of life and death, where the body decomposes and returns to nature.
- The positions of the viewer and the clone beneath the floor maintain a constant height difference and remain symmetrical with respect to the center of the hole on the horizontal plane. (That is, if the floor is the $$xy$$plane and the center of the hole is the origin, and the viewer's position is$$(x,y,z)$$, the clone's position is $$(-x,-y,z-h)$$(where$$h$$ is a constant).) The point where the viewer and the clone overlap on the horizontal plane is the center of the hole ($$(x,y)=(-x,-y) \iff (x,y)=(0,0)$$), and the transformation motion graphic is activated when approaching this point. This expresses that integration with the inner self is achieved through a return to nature.

## Technology

- A projector was used to project the video onto the floor.
- A darkroom was built so that viewers could enter an isolated environment one by one to view it calmly, and to ensure the projection was clearly visible.
- Kinect and Unity were used for the interactive CG rendering system reflecting motion/depth sensor data.
  - To make the space beneath the floor always appear three-dimensional from the viewer's perspective in response to their movements, the viewer's head position data extracted via the Kinect SDK and the off-axis projection programming of the Unity camera component were used.
  - The viewer's clone in the hole was created using point cloud rendering in Unity and its shader programming, utilizing the viewer's depth data read by the Kinect.
  - The continuous transformation from the clone to a school of fish and the motion graphics of the fish swimming were also created using Unity and its shader programming.

### References

- [Off-axis projection in Unity — Michel de Brisis](https://medium.com/try-creative-tech/off-axis-projection-in-unity-1572d826541e)
- [Cg Programming/Unity/Projection for Virtual Reality — Wikibooks](https://en.wikibooks.org/wiki/Cg_Programming/Unity/Projection_for_Virtual_Reality)
- [Generalized Perspective Projection — Robert Kooima](https://web.archive.org/web/20241230234113/http://160592857366.free.fr/joe/ebooks/ShareData/Generalized%20Perspective%20Projection.pdf)
- [Waves — Catlike Coding](https://catlikecoding.com/unity/tutorials/flow/waves/)
- [Kinect v2 のデプス画像をそのままの解像度で点群としてUnityで表示する — いずみはら あつし](https://izmiz.hateblo.jp/entry/2017/12/30/003542)
- [Point cloud rendering with Unity — Ahmad Erfani](https://bootcamp.uxdesign.cc/point-cloud-rendering-with-unity-1a07345eb27a)

## External Links

- [Vimeo — SNU Design — Exhibition introduction](https://vimeo.com/659521474#t=48.641)
- [Instagram — SNU Design Week — Artwork introduction](https://www.instagram.com/p/CXC3XytvUHL/)
- [Seoul National University College of Fine Arts Website — Graduation work information](https://art.snu.ac.kr/exgallery/%ea%b9%80%ed%83%9d%eb%af%bc-%eb%94%94%ec%9e%90%ec%9d%b8-%ed%95%99%ec%82%ac/)

[^1]: The website for the 2021 edition is currently inaccessible. [The cover screen of the "online exhibition website" at the time can be viewed via the Wayback Machine](https://web.archive.org/web/20220116184406/https://snudesignweek.com/).
:::
::: ko
![](images/works/space2/space2_viewer.jpg)

## 기본 정보

- **형식**
  - 장르: 인터랙티브 영상 설치
  - 구성: 모션/깊이 센서 데이터를 반영하는 인터랙티브 CG 렌더링 시스템과 프로젝터에 의한 암실 바닥에의 인터랙티브 영상 프로젝션
- **만든 사람들**
  - 연출, 프로그래밍: 임의존재
  - 스태프: 김준영, 이호정
- **공개**
  - 전시: [SNU Design Week](https://snudesignweek.com/)[^1] 2021 (서울대학교 미술대학 디자인학부 졸업전시)
  - 웹
    - 데모 영상: [YouTube — 1인칭 시점 관람 영상](https://youtu.be/ftJX44qtPxQ)
- **소스 코드**: [GitHub (고용량 애셋 미포함)](https://github.com/random-entity/o.art.space2), [Google Drive (모든 애셋 포함)](https://drive.google.com/file/d/112Rpy9AwwKdn4x6iE0SvC2Z2Ior7JZGa)

## 줄거리

- 감상자가 암실에 들어가면 바닥에 직경과 깊이 약 3미터의 구멍이 보인다. 구멍 속에는 물이 차 있고, 물속에는 감상자 자신이 보인다. 감상자는 바닥 밑의 공간 속 자신의 클론을 바닥 위의 현실 세계로부터 내려다 보게 되는 것이다.
- 프로젝션 영상은 감상자의 움직임에 반응하여 실시간으로 왜곡되어, 감상자의 시점에서 항상 바닥 밑의 공간이 입체적으로 보이도록 구성되어 있다.
- 감상자가 움직이면 수면에 파동이 퍼진다. 구멍의 중앙에 다가가면 물속의 감상자 클론은 파편화 되어 흩어지고, 각 파편은 물고기로 변신하여 물속을 헤엄쳐 돌아다닌다.

[Video](https://youtu.be/ftJX44qtPxQ)

![](images/works/space2/space2_viewer-none.jpg)
*감상자가 없을 때의 암실 내부*

![](images/works/space2/space2_viewer.jpg)
*감상자가 구멍 중앙에 있을 때; 앞의 사진과 비교했을 때, 영상이 변형되어 있음을 확인할 수 있다. 감상자의 시점에서 바닥 밑 공간이 입체적으로 보이도록 변형된 것이다.*

![](images/works/space2/space2_fish-walk.jpg)
*감상자가 구멍 중앙에 근접하면 물밑의 감상자 클론이 파편화 되어 흩어지고 각 파편은 물고기로 변신한다.*

![](images/works/space2/space2_fish-stand.jpg)
*감상자가 구멍 정중앙에 섰을 때 물고기들은 최대 사이즈가 된다.*

![](images/works/space2/space2_matome.jpg)
*상기 데모 영상 스틸 모음*

![](images/works/space2/space2_diagram_fixed-symmetry.png)
*컨셉 다이어그램 (일러스트레이션: 이호정)*

## 해설

- 본작은 감상자가 스스로를 바라보는 명상적 공간 속에서, 심리적 중압감 및 그 해소의 감각을 체험할 수 있도록 설계한 영상 설치 작품이다.
- 바닥 밑의 공간은 내면을 비추는 가상의 공간으로서 작용한다. 이 가상의 공간은, 바닥 위의 현실 공간과 감상자의 신체를 공유하면서도, 그를 둘러싼 환경을 달리 한다.
- 중압감은 바닥 밑 감상자의 클론이 폐쇄적인 수중 공간 속에 있음을 지각시킴으로써 전달된다. 땅에 파인 원통형의 깊은 구멍과, 감상자의 움직임에 반응하는 수면의 파동은, 이러한 지각을 가능케 한다.
- 중압감의 해소는 물속의 감상자 클론이 파편화 되어 물고기 떼로 변신하는 모션그래픽을 통해 표현된다. 인간에게 물속은 숨 막히는 공간이지만, 물고기들에게는 자유로이 헤엄칠 수 있는 공간이다. 또한 이 변신은, 신체가 분해되어 자연으로 돌아가는 생과 사의 순환 과정을 연상시킨다.
- 감상자와 바닥 밑의 감상자 클론의 위치는 일정한 높이 차를 유지한 채, 수평 평면 상에서는 구멍의 중심을 기준으로 대칭을 유지한다. (즉 바닥을 $$xy$$ 평면으로, 구멍의 중심을 원점으로 뒀을 때, 감상자의 위치가 $$(x,y,z)$$라면 클론의 위치는 $$(-x,-y,z-h)$$ ($$h$$는 상수)인 것이다.) 감상자가 클론과 수평 평면 상에서 겹치는 지점은 구멍의 중심이고 ($$(x,y)=(-x,-y) \iff (x,y)=(0,0)$$), 이 지점에 근접할 때 변신 모션그래픽이 활성화 된다. 이는 내면과의 통합이 자연으로의 귀화를 통해 이루어짐을 표현한다.

## 기술

- 바닥에 영상을 투사하기 위해 프로젝터를 사용했다.
- 감상자가 한 명 씩 외부와 격리된 환경에 들어와 차분히 감상할 수 있도록, 그리고 영상이 잘 보이도록 암실을 지었다.
- 모션/깊이 센서 데이터를 반영하는 인터랙티브 CG 렌더링 시스템에 Kinect와 Unity를 사용했다.
  - 감상자의 움직임에 반응하여 그의 시점에서 바닥 밑 공간이 항상 입체적으로 보이게 하기 위해, Kinect SDK를 통해 추출한 감상자의 머리 위치 정보와, Unity 카메라 컴포넌트의 off-axis projection 프로그래밍을 사용했다.
  - 구멍 속 감상자의 클론은 Kinect가 읽은 감상자의 깊이 정보를 이용해 Unity 및 그 셰이더 프로그래밍에 의한 point cloud 렌더링으로 만들었다.
  - 클론에서 물고기 떼로의 연속적 변신 및 물고기 떼가 헤엄치는 모션그래픽 또한 Unity 및 그 셰이더 프로그래밍으로 만들었다.

### 참고 자료

- [Off-axis projection in Unity — Michel de Brisis](https://medium.com/try-creative-tech/off-axis-projection-in-unity-1572d826541e)
- [Cg Programming/Unity/Projection for Virtual Reality — Wikibooks](https://en.wikibooks.org/wiki/Cg_Programming/Unity/Projection_for_Virtual_Reality)
- [Generalized Perspective Projection — Robert Kooima](https://web.archive.org/web/20241230234113/http://160592857366.free.fr/joe/ebooks/ShareData/Generalized%20Perspective%20Projection.pdf)
- [Waves — Catlike Coding](https://catlikecoding.com/unity/tutorials/flow/waves/)
- [Kinect v2 のデプス画像をそのままの解像度で点群としてUnityで表示する — いずみはら あつし](https://izmiz.hateblo.jp/entry/2017/12/30/003542)
- [Point cloud rendering with Unity — Ahmad Erfani](https://bootcamp.uxdesign.cc/point-cloud-rendering-with-unity-1a07345eb27a)

## 외부 링크

- [Vimeo — SNU Design — 전시 소개](https://vimeo.com/659521474#t=48.641)
- [Instagram — SNU Design Week — 작품 소개](https://www.instagram.com/p/CXC3XytvUHL/)
- [서울대학교 미술대학 웹사이트 — 졸업작품 정보](https://art.snu.ac.kr/exgallery/%ea%b9%80%ed%83%9d%eb%af%bc-%eb%94%94%ec%9e%90%ec%9d%b8-%ed%95%99%ec%82%ac/)

[^1]: 2021년 에디션의 웹사이트는 현재 접근 불가하다. [Wayback Machine을 통해 당시 "온라인 전시 웹사이트"의 표지 화면은 볼 수 있다](https://web.archive.org/web/20220116184406/https://snudesignweek.com/).
:::
::: ja
![](images/works/space2/space2_viewer.jpg)

## 基本情報

- **形式**
  - ジャンル: インタラクティブ映像インスタレーション
  - 構成: モーション/深度センサーのデータを反映するインタラクティブCGレンダリングシステムと、プロジェクターによる暗室の床へのインタラクティブ映像プロジェクション
- **制作陣**
  - 演出、プログラミング: 任意存在
  - スタッフ: KIM Junyeong、LEE Hojeong
- **公開**
  - 展示: [SNU Design Week](https://snudesignweek.com/)[^1] 2021（ソウル大学美術大学デザイン学部 卒業展示）
  - Web
    - デモ映像: [YouTube — 1人称視点 観覧映像](https://youtu.be/ftJX44qtPxQ)
- **ソースコード**: [GitHub（大容量アセット非包含）](https://github.com/random-entity/o.art.space2)、[Google Drive（全アセット包含）](https://drive.google.com/file/d/112Rpy9AwwKdn4x6iE0SvC2Z2Ior7JZGa)

## あらすじ

- 鑑賞者が暗室に入ると、床に直径と深さ約3メートルの穴が見える。穴の中には水が満たされており、水の中には鑑賞者自身が見える。鑑賞者は、床の下の空間にいる自身のクローンを、床の上の現実世界から見下ろすことになるのである。
- プロジェクション映像は鑑賞者の動きに反応してリアルタイムに歪み、鑑賞者の視点から常に床の下の空間が立体的に見えるように構成されている。
- 鑑賞者が動くと水面に波紋が広がる。穴の中央に近づくと、水の中の鑑賞者のクローンは断片化して散らばり、各断片は魚に変身して水中を泳ぎ回る。

[Video](https://youtu.be/ftJX44qtPxQ)

![](images/works/space2/space2_viewer-none.jpg)
*鑑賞者がいない時の暗室内部*

![](images/works/space2/space2_viewer.jpg)
*鑑賞者が穴の中央にいる時; 前の写真と比較すると、映像が変形していることが確認できる。鑑賞者の視点から床の下の空間が立体的に見えるように変形されたのである。*

![](images/works/space2/space2_fish-walk.jpg)
*鑑賞者が穴の中央に近づくと、水底の鑑賞者のクローンが断片化して散らばり、各断片は魚に変身する。*

![](images/works/space2/space2_fish-stand.jpg)
*鑑賞者が穴のちょうど中央に立った時、魚たちは最大サイズになる。*

![](images/works/space2/space2_matome.jpg)
*上記デモ映像のスチール集*

![](images/works/space2/space2_diagram_fixed-symmetry.png)
*コンセプトダイアグラム（イラストレーション：イ・ホジョン）*

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

- [Off-axis projection in Unity — Michel de Brisis](https://medium.com/try-creative-tech/off-axis-projection-in-unity-1572d826541e)
- [Cg Programming/Unity/Projection for Virtual Reality — Wikibooks](https://en.wikibooks.org/wiki/Cg_Programming/Unity/Projection_for_Virtual_Reality)
- [Generalized Perspective Projection — Robert Kooima](https://web.archive.org/web/20241230234113/http://160592857366.free.fr/joe/ebooks/ShareData/Generalized%20Perspective%20Projection.pdf)
- [Waves — Catlike Coding](https://catlikecoding.com/unity/tutorials/flow/waves/)
- [Kinect v2 のデプス画像をそのままの解像度で点群としてUnityで表示する — いずみはら あつし](https://izmiz.hateblo.jp/entry/2017/12/30/003542)
- [Point cloud rendering with Unity — Ahmad Erfani](https://bootcamp.uxdesign.cc/point-cloud-rendering-with-unity-1a07345eb27a)

## 外部リンク

- [Vimeo — SNU Design — 展示紹介](https://vimeo.com/659521474#t=48.641)
- [Instagram — SNU Design Week — 作品紹介](https://www.instagram.com/p/CXC3XytvUHL/)
- [ソウル大学美術大学ウェブサイト — 卒業作品情報](https://art.snu.ac.kr/exgallery/%ea%b9%80%ed%83%9d%eb%af%bc-%eb%94%94%ec%9e%90%ec%9d%b8-%ed%95%99%ec%82%ac/)

[^1]: 2021年エディションのウェブサイトは現在アクセス不可である。[Wayback Machineを通じて当時の「オンライン展示ウェブサイト」の表紙画面は見ることができる](https://web.archive.org/web/20220116184406/https://snudesignweek.com/)。
:::

---

:::en
## Synopsis

When you enter the dark room, you see a hole about three meters in diameter in the floor. Water has collected inside it, in which the viewer themselves is reflected (from a viewpoint looking down on oneself from the ceiling). The projected image reacts in real time to the position of the viewer's head and distorts, so that from the viewer's vantage the world beneath the floor always appears three-dimensional. When the viewer moves, ripples spread across the water's surface. The closer the viewer approaches the center of the hole, the more the underwater figure of the viewer fragments and transforms into swimming fish.

## Commentary

For me, the sensation of depression resembles the feeling of being submerged underwater. Adopting the motifs of a well and of metamorphosis, and using off-axis projection and point cloud techniques, I created a meditative space in which one gazes from the ground at one's own underwater self. Next, I hope to make works that apply fractal spaces — in which there is, beneath the world below the floor, yet another world-below-the-floor's-world-below-the-floor — and the fact that off-axis projection can produce its illusion of depth for only one viewer at a time.
:::

:::ko
## 줄거리

암실에 들어가면, 바닥에 지름 3미터 정도의 구멍이 보인다. 그 안에는 물이 고여 있고, (천장에서 자신을 내려다보는 시점에서의) 관람자 자신이 비친다. 프로젝션 이미지는 관람자의 머리 위치에 반응해 실시간으로 일그러지며, 관람자의 시점에서는 늘 바닥 아래 세계가 입체적으로 보이는 듯한 착각을 일으킨다. 관람자가 움직이면 수면에 파동이 퍼진다. 관람자가 구멍의 중앙에 가까이 갈수록, 물속 관람자의 모습은 파편화되어 헤엄치는 물고기들로 변신해 간다.

## 해설

우울의 감각은 내게 물속에 잠겨 있는 듯한 기분과 닮아 있다. 우물과 변신의 모티프를 채용하고, Off-axis projection 기술과 point cloud 기술을 사용해, 지면에서 물속의 자신을 바라보는 명상적 공간을 제작했다. 다음에는 바닥 아래 세계의 아래에 또 바닥 아래 세계의 바닥 아래 세계가 있기도 한 프랙탈 공간이나, Off-axis projection은 한 명의 관람자에게만 입체감의 착각을 일으킬 수 있다는 점을 응용한 작품을 만들고 싶다.
:::

:::ja
## あらすじ

暗室に入ると、床に直径3メートルほどの穴が見える。その中には水が溜まっており、（天井から自身を見下ろす視点での）観覧者自身が映し出される。プロジェクション画像は観覧者の頭の位置に反応しリアルタイムで歪み、鑑賞者の視点からはいつも床下の世界が立体的に見えるような錯覚を起こす。観覧者が動くと水面に波動が広がる。鑑賞者が穴の中央に近づくほど、水中の観覧者の姿は破片化し、泳ぐ魚たちへと変身していく。

## 解説

憂鬱の感覚は私にとって水中に沈んでいるような気持ちに似ているものである。井戸と変身のモチーフを採用し、Off-axis projection技術とpoint cloud技術を用いて、地面から水中の自身を眺める瞑想的空間を制作した。今度は床下の世界の下にさらに床下の世界の床下の世界があったりするフラクタル空間や、Off-axis projectionは一人の鑑賞者にしか立体感の錯覚を起こせないことを応用した作品を作りたいと思っている。
:::

:::en
## Gallery
:::
:::ko
## 갤러리
:::
:::ja
## ギャラリー
:::

![](images/works/space2/odt1.jpg)

![](images/works/space2/odt2.jpg)

![](images/works/space2/odt3.jpg)

![](images/works/space2/odt4.jpg)
