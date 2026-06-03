---
title: { en: "Space#1", ko: "공간#1", ja: "空間#1" }
tagline:
  en: "Am I moving forward, or am I walking in place?"
  ko: "앞으로 가고 있는 것인가, 제자리걸음 하고 있는 것인가."
  ja: "前へ進んでいるのか、それとも足踏みをしているのか。"
releases:
  - "2021-10-31"
type: Personal work
genre: ["Video game"]
tags: ["Interactive CG", "Shader programming"]
tools: ["Unity"]
source: https://github.com/random-entity/o.art.space1
---
::: en
![](images/works/space1/demo-video-stills/main.png)

## Basic information

- **Format**
  - Genre: Video game, Art game
  - Composition: 1st-person POV video game running on PC, monitor, keyboard, and mouse; Movement with Up/Down or W/S keys, gaze control with mouse
- **Creators**
  - Direction, Programming: random-entity
- **Release**
  - Web
    - Distribution: [itch.io](https://public-random-entities.itch.io/space1)
    - Demo video: [YouTube](https://youtu.be/KZ1KfgGF4T0)
- **Source Code**: [GitHub](https://github.com/random-entity/o.art.space1)

## Synopsis

- In the game world, the ground, the sky, a single straight path, and a rectangular building with its entrance door located ahead along the path can be seen.
- The player can move forward toward the building or backward in the opposite direction along the straight path using the Up/Down or W/S keys on the keyboard. The gaze direction follows the mouse. It uses the same controls as a typical FPS game, but there is no shooting, and movement is only possible in one dimension.
- As the player approaches the building, the visible size of the building grows, eventually covering the entire sky. Then, the rectangle that appeared to be the building's entrance door becomes a new building, and a rectangular entrance door appears in that new building again.
- Approaching that new building, it becomes the sky again, and its entrance door becomes a new building.
- As this process repeats, the colors of the sky, building, and door also cycle sequentially.
- A total of 4 phases cycle, and the color scheme of each phase corresponds to 6 AM, noon, 6 PM, and midnight, dividing a day into four.
- Even if the player moves backward, the phases only cycle in reverse order, but the structure remains the same.
- The player becomes forever trapped in a fractal space that appears finite but expands infinitely due to the similarity between the parts and the whole.

[Video](https://youtu.be/KZ1KfgGF4T0)

![](images/works/space1/demo-video-stills/1.png)
*Noon phase*

![](images/works/space1/demo-video-stills/2.png)
*6 PM phase*

![](images/works/space1/demo-video-stills/3.png)
*Midnight phase*

![](images/works/space1/demo-video-stills/4.png)
*6 AM phase*

![](images/works/space1/hand-drawing.jpeg)
*Concept drawing*

## Commentary

- This work implements the fractal/repetitive worldview frequently appearing in the author's (random-entity's) works as a space within a game, allowing the player to independently explore its structure.
- The only building rising in the empty game world is perceived by the player as a 'destination'. However, as the player approaches the building, it transforms into an unreachable background (sky), and another 'destination' (building) hidden within it appears. This expresses that moving forward toward a goal leads directly to the creation of the next goal, transitioning to the same phase of the next stage.
- Thus, this work acts as a metaphor for humans constantly striving towards goals, and the structure of nature where all things return to a cycle of maintaining homeostasis, regardless of human goals or passing time.
- By using minimalist forms and flat coloring, the player is encouraged to focus on the structure of the space in the game itself rather than the details of each element.

## Technology

- To create a virtual environment that can be explored while moving through a special space from a first-person perspective, controls similar to an FPS game were chosen, and the game engine Unity and its shader programming were used for implementation.
- In reality, the player's position within the game world is fixed, but the player perceives that they are approaching the building as the mesh of the building object continuously deforms from a rectangle into a cylinder covering the sky. The continuous deformation of the mesh, as well as the blinking of windows and clouds, are implemented by shader programming, utilizing GPU resources.
- Rendering by "Unlit" material was used for flat coloring that makes the entire game world look as if it were made by cutting out colored paper.
:::
::: ko
![](images/works/space1/demo-video-stills/main.png)

## 기본 정보

- **형식**
  - 장르: 비디오게임, 아트 게임
  - 구성: PC, 모니터, 키보드, 마우스로 구동되는 1인칭 시점 비디오게임; 키보드 상/하 또는 W/S 키로 이동, 마우스로 시선 조작
- **만든 사람들**
  - 연출, 프로그래밍: 임의존재
- **공개**
  - 웹
    - 배포: [itch.io](https://public-random-entities.itch.io/space1)
    - 데모 영상: [YouTube](https://youtu.be/KZ1KfgGF4T0)
- **소스 코드**: [GitHub](https://github.com/random-entity/o.art.space1)

## 줄거리

- 게임 월드 속에는 땅과 하늘, 직선으로 뻗은 하나의 길, 그리고 길을 따라 전방에 위치한 직사각형의 빌딩과 그 현관 문이 보인다.
- 플레이어는 키보드 상/하 혹은 W/S 키로 직선형 길을 따라 빌딩 쪽으로 전진하거나 반대 방향으로 후진할 수 있다. 시선 방향은 마우스를 따라간다. 일반적인 FPS 게임과 같은 조작법이지만, 슈팅은 없고, 이동은 1차원 상에서만 가능한 것이다.
- 플레이어가 빌딩에 다가갈수록 눈에 보이는 빌딩의 크기는 커지고, 이내 하늘 전체를 뒤덮는다. 그러자 빌딩의 현관 문으로 보였던 직사각형이 새로운 빌딩이 되고, 그 새로운 빌딩에 다시 직사각형의 현관 문이 생긴다.
- 그 새로운 빌딩에 다가가면 다시 그 빌딩은 하늘이 되고 그 현관 문은 새로운 빌딩이 된다.
- 이러한 과정이 반복됨에 따라, 하늘, 빌딩, 문의 색상도 순차적으로 순환한다.
- 총 4가지의 페이즈가 순환되며, 각 페이즈의 배색은 하루를 4등분한 아침 6시, 정오, 저녁 6시, 자정에 대응한다.
- 후진을 해도 페이즈를 역순으로 순환할 뿐 구조는 동일하다.
- 플레이어는 유한해 보이지만 부분과 전체의 유사성에 의해 무한히 확장하는 프랙탈적 공간 속에 영원히 갇히게 된다.

[Video](https://youtu.be/KZ1KfgGF4T0)

![](images/works/space1/demo-video-stills/1.png)
*정오 페이즈*

![](images/works/space1/demo-video-stills/2.png)
*오후 6시 페이즈*

![](images/works/space1/demo-video-stills/3.png)
*자정 페이즈*

![](images/works/space1/demo-video-stills/4.png)
*오전 6시 페이즈*

![](images/works/space1/hand-drawing.jpeg)
*컨셉 드로잉*

## 해설

- 본작은 필자(임의존재)의 작품에 자주 등장하는 프랙탈적/반복적 세계관을 게임 속 공간으로서 구현해, 플레이어가 그 구조를 주체적으로 탐사할 수 있게 한 것이다.
- 텅 비어 있는 게임 월드 속에 유일하게 솟아 있는 빌딩은 플레이어에게 '목적지'로서 인식된다. 그러나 플레이어가 빌딩에 접근할수록 그것은 도달할 수 없는 배경(하늘)으로 변화하고, 그 속에 숨겨져 있던 또 다른 '목적지'(빌딩)가 나타난다. 이는 목적을 향한 전진이 곧 다음 목적의 생성으로, 다음 페이즈의 동일한 국면으로 이어짐을 표현한다.
- 그리하여 본작은 끊임없이 목적을 향해 나아가려는 인간과, 인간의 목적이나 흘러가는 시간과는 관계 없이 만물이 항상성 유지의 순환으로 회귀하는 자연의 구조에 대한 비유로서 작용한다.
- 미니멀한 조형과 평면적인 채색을 이용해 플레이어가 각 요소의 디테일보다 게임 속 공간의 구조 자체에 집중할 수 있도록 했다.

## 기술

- 1인칭 시점에서 특수한 공간 속을 이동하면서 탐사할 수 있는 가상의 환경을 만들기 위해 FPS 게임과 같은 조작법을 선택했고, 구현에 게임 엔진 Unity 및 그 셰이더 프로그래밍을 사용했다.
- 사실 게임 월드 내 플레이어의 위치는 고정되어 있지만, 빌딩 오브젝트의 메쉬가 직사각형에서 하늘을 뒤덮는 원기둥으로 연속적으로 변형되어 감에 의해 플레이어는 빌딩에 다가가고 있다고 지각하게 되는 것이다. 메쉬의 연속적 변형을 비롯해 창문과 구름의 점멸 등은 셰이더 프로그래밍에 의해 구현되어 GPU 자원을 활용한다.
- "Unlit" material에 의한 렌더링은 게임 월드 전체를 마치 색종이를 오려 만든 것 같이 보이게 하는 평면적 채색을 위해 사용되었다.
:::
::: ja
![](images/works/space1/demo-video-stills/main.png)

## 基本情報

- **形式**
  - ジャンル: ビデオゲーム、アートゲーム
  - 構成: PC、モニター、キーボード、マウスで駆動する1人称視点のビデオゲーム; キーボードの上/下またはW/Sキーで移動、マウスで視点操作
- **制作陣**
  - 演出、プログラミング: 任意存在
- **公開**
  - Web
    - 配布: [itch.io](https://public-random-entities.itch.io/space1)
    - デモ映像: [YouTube](https://youtu.be/KZ1KfgGF4T0)
- **ソースコード**: [GitHub](https://github.com/random-entity/o.art.space1)

## あらすじ

- ゲームワールドの中には、大地と空、直線に伸びる一本の道、そして道に沿って前方に位置する長方形のビルとその玄関ドアが見える。
- プレイヤーはキーボードの上/下またはW/Sキーで、直線の道に沿ってビルに向かって前進したり、反対方向に後退したりできる。視点の方向はマウスに追従する。一般的なFPSゲームと同じ操作法だが、シューティング要素はなく、移動は1次元上でのみ可能である。
- プレイヤーがビルに近づくにつれて、目に見えるビルの大きさは大きくなり、やがて空全体を覆い尽くす。すると、ビルの玄関ドアに見えていた長方形が新しいビルになり、その新しいビルに再び長方形の玄関ドアが現れる。
- その新しいビルに近づくと、再びそのビルは空になり、その玄関ドアは新しいビルになる。
- この過程が繰り返されるにつれて、空、ビル、ドアの色も順次循環する。
- 全4つのフェーズが循環し、各フェーズの配色は、1日を4等分した午前6時、正午、午後6時、深夜に対応する。
- 後退してもフェーズが逆順に循環するだけで、構造は同じである。
- プレイヤーは、有限に見えるが部分と全体との類似性によって無限に拡張するフラクタル的な空間の中に永遠に閉じ込められることになる。

[Video](https://youtu.be/KZ1KfgGF4T0)

![](images/works/space1/demo-video-stills/1.png)
*正午フェーズ*

![](images/works/space1/demo-video-stills/2.png)
*午後6時フェーズ*

![](images/works/space1/demo-video-stills/3.png)
*深夜フェーズ*

![](images/works/space1/demo-video-stills/4.png)
*午前6時フェーズ*

![](images/works/space1/hand-drawing.jpeg)
*コンセプトドローイング*

## 解説

- 本作は、私（任意存在）の作品に頻繁に登場するフラクタル的/反復的な世界観をゲーム内の空間として実装し、プレイヤーが主体的にその構造を探索できるようにしたものである。
- 空っぽのゲームワールドの中に唯一そびえ立つビルは、プレイヤーに「目的地」として認識される。しかし、プレイヤーがビルに近づくほど、それは到達不可能な背景（空）へと変化し、その中に隠されていたもう一つの「目的地」（ビル）が現れる。これは、目的に向かって前進することが、すなわち次の目的の生成であり、次のフェーズの同じ局面へと繋がることを表現している。
- したがって本作は、絶えず目的に向かって進もうとする人間と、人間の目的や流れる時間とは関係なく、万物が恒常性維持の循環へと回帰する自然の構造に対する比喩として作用する。
- ミニマルな造形と平面的（フラット）な彩色を利用し、プレイヤーが各要素のディテールよりもゲーム内の空間の構造自体に集中できるようにした。

## 技術

- 1人称視点で特殊な空間内を移動しながら探索できる仮想環境を作るため、FPSゲームのような操作法を選択し、実装にはゲームエンジンUnityおよびそのシェーダープログラミングを使用した。
- 実際のところ、ゲームワールド内でのプレイヤーの位置は固定されているが、ビルオブジェクトのメッシュが長方形から空を覆う円柱へと連続的に変形していくことによって、プレイヤーはビルに近づいていると知覚することになるのである。メッシュの連続的な変形をはじめ、窓や雲の点滅などはシェーダープログラミングによって実装され、GPUリソースを活用する。
- 「Unlit」マテリアルによるレンダリングは、ゲームワールド全体がまるで色紙を切り抜いて作られたかのように見える平面的な彩色のために使用された。
:::
