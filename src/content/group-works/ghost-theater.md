---
title: { en: "Ghost Theater \"We Will Have a Serious Night\" (Indoor Version)", ko: "유령극단 \"심각한 밤을 보내리\" (실내이식판)", ja: "幽霊劇団「深刻な夜を過ごそう」（室内移植版）" }
tagline:
  en: "A poem about humans and love sung by ghosts in the machine."
  ko: "기계 속 유령들이 노래하는 인간과 사랑에 대한 시."
  ja: "機械の中の幽霊たちが歌う、人間と愛についての詩。"
date: "2022-03-24 : SNUMOA – Turing Test: AI's Declaration of Love"
type: Group work
genre: ["Interactive sound installation"]
tags: ["Audio signal processing", "3D audio effect", "Ambisonics", "AR audio rendering", "Physical computing", "Embedded system", "Microcontroller", "Printed circuit board", "Local positioning system", "IMU sensor"]
tools: ["BNO055", "PJRC Teensy", "C++"]
source: https://github.com/random-entity/o.art.ghost-theater-snumoa
---
::: en
![](images/works/ghost-theater/zones.jpg)

## Basic information

- **Format**
  - Genre: Interactive sound installation
  - Composition: An interactive sound installation consisting of GLPS headphones[^1] worn by the listener, and 3D audio scenes placed in each of the "zones" marked by spotlights in the exhibition space.
- **Creators**
  - Exhibitor: Seoul Open Media[^2] (Byungjun Kwon[^3], Juhong Baek, random-entity)
  - General Director, Hardware Design, Sound: Byungjun Kwon
  - Hardware Design: Juhong Baek
  - Software Development: random-entity
- **Release**
  - Exhibition: [Seoul National University Museum of Art ⟨Turing Test: AI's Declaration of Love⟩](http://www.snumoa.org/exhibitions_view.php?exh_id=151) (2022)
- **Source code**: [GitHub - Scope in charge of the author (random-entity)](https://github.com/random-entity/o.art.ghost-theater-snumoa)

## Synopsis

- Visitors entering the exhibition space wear GLPS headphones[^1].
- When a listener enters a "zone" marked by a spotlight on the floor of the exhibition space, AR (augmented reality) 3D audio is played, making them feel as if they have entered a scene in a virtual acoustic space surrounding that zone. A different "play" unfolds in each "zone".
- The sound sources include voice narrations by voice actors performing a play written by artist Byungjun Kwon together with an AI, as well as sounds and music composed by artist Byungjun Kwon as a sound artist, musician, and electronic musical instrument researcher.
- When the listener is not inside a "zone," a bell sound rings from the nearest "zone" to guide them toward it.
- The listener appreciates the songs of the "Ghost Theater," which are invisible in the physical exhibition space, within the AR acoustic zones unfolded by the GLPS headphones.

![](images/works/ghost-theater/exhibition_1.jpg)
*GLPS headphones hanging on the wall of the exhibition space*

![](images/works/ghost-theater/exhibition_2.jpg)
*Each "zone" is indicated by a bright circular spotlight on the floor of the exhibition space.*

![](images/works/ghost-theater/listening.jpg)
*Listening inside a "zone"*

![](images/works/ghost-theater/som.jpg)
*During exhibition installation*

## Commentary

- This work is an indoor version of the piece [⟨Ghost Theater "We Will Have a Serious Night"⟩](https://byungjun.pe.kr/works/we-will-have-a-serious-night), which artist Byungjun Kwon had previously directed as an outdoor work, compressed and exhibited inside the Seoul National University Museum of Art. In order to reconstruct the plays and songs of the robots that unfolded in various outdoor locations—such as Hanok villages or farming communities—within an indoor museum exhibition space, a real-time 3D audio effect function was added to the GLPS headphone[^1] version developed for this indoor port. This function makes listeners perceive themselves as being inside a virtual acoustic space. By doing so, it overlays another "ghost-like" acoustic space layer that hides within the real space where other works in the same exhibition are displayed.

## Technology

### Overview

- The GLPS headphones[^1] recognize the listener's location and head orientation, and based on that data, output sound processed with real-time 3D audio effects.

### Details

- Hardware of the GLPS headphones:
  - The GLPS headphones are made by additionally attaching a PCB with a [PJRC Teensy](https://www.pjrc.com/teensy-4-0/) as a microcontroller to the electronic circuit of off-the-shelf headphones.
  - An IMU sensor ([Adafruit BNO055](https://learn.adafruit.com/adafruit-bno055-absolute-orientation-sensor/overview)) was used to recognize the head orientation of the listener wearing the GLPS headphones.
  - A custom LPS system ([DW1000](https://www.qorvo.com/products/p/DW1000), etc.) was used to recognize the location of the GLPS headphones within the exhibition space. The LPS system measures the distance from the LPS module board ([DW1000](https://www.qorvo.com/products/p/DW1000)) embedded in the GLPS headphones to LPS module boards ([DW1000](https://www.qorvo.com/products/p/DW1000)) installed at 3 fixed points (anchors) in the exhibition space, calculating the listener's location through trilateration.
  - A microSD card was used to store and load sound source audio files.
- **Software of the GLPS headphones**:
  - Based on the location information obtained from the LPS system, if the listener is not in any "zone," a bell sound is played, and if they are in a "zone," the audio fitting for that "zone" is played.
  - To create a 3D audio effect based on the listener's head orientation obtained from the IMU sensor, audio signal processing was programmed to decode audio signals in the [Ambisonics](https://en.wikipedia.org/wiki/Ambisonics) format according to the orientation, or to pan multiple mono audios so they sound like point sound sources distributed at specific locations.
  - The program performing the above functions was written in C++ utilizing the [Teensy SDK](https://www.pjrc.com/teensy/td_download.html) and [Teensy Audio SDK](https://github.com/PaulStoffregen/Audio), and was uploaded to the [Teensy](https://www.pjrc.com/teensy-4-0/) of the GLPS headphones' embedded system.

### Scope in charge of the author (random-entity)

- The part the author (random-entity) was in charge of is the software development for the embedded system of the GLPS headphones [(Source Code)](https://github.com/random-entity/o.art.ghost-theater-snumoa).
- The root items in the list in the Details section that the author was in charge of are marked in **bold text**.

## External links

- [YouTube - Seoul Council of Art Museums - Exhibition Introduction Video](https://youtu.be/euUhxTG8qOQ)
- [Artist Byungjun Kwon's Website - Ghost Theater "We Will Have a Serious Night" (Hongdong Reservoir)](https://byungjun.pe.kr/works/we-will-have-a-serious-night)

[^1]: Specially modified headphones used in many works by Byungjun Kwon/Seoul Open Media. They operate using a PJRC Teensy microcontroller and a GPS or LPS (local positioning system) module within the embedded system, with parts added and software programmed to suit the purpose of each work.

[^2]: A media art production team led by artist Byungjun Kwon.

[^3]: (1971–) A Korean contemporary artist who uses sound, robots, performances, etc., as media. Winner of the "Korea Artist Prize 2023" from the National Museum of Modern and Contemporary Art, Korea. (Reference: [Artist Website](https://byungjun.pe.kr/))
:::
::: ko
![](images/works/ghost-theater/zones.jpg)

## 기본 정보

- **형식**
  - 장르: 인터랙티브 사운드 설치
  - 구성: 감상자가 착용하는 GLPS 헤드폰[^1]과, 전시 공간 속 스포트라이트로 표시되는 "영역"들 각각에 배치된 입체음향 씬들로 구성된 인터랙티브 사운드 설치
- **만든 사람들**
  - 출품자: 서울오픈미디어[^2] (권병준[^3], 백주홍, 임의존재)
  - 총괄 디렉터, 하드웨어 설계 음향: 권병준
  - 하드웨어 설계: 백주홍
  - 소프트웨어 개발: 임의존재
- **공개**
  - 전시: [서울대학교 미술관 ⟨튜링 테스트: AI의 사랑 고백⟩ 전](http://www.snumoa.org/exhibitions_view.php?exh_id=151) (2022년)
- **소스 코드**: [GitHub - 필자(임의존재) 담당 범위](https://github.com/random-entity/o.art.ghost-theater-snumoa)

## 줄거리

- 전시 공간에 들어선 관람객은 GLPS 헤드폰[^1]을 착용한다.
- 전시 공간 바닥의 스포트라이트로 표시된 "영역"에 감상자가 진입하면, 마치 해당 영역을 둘러싼 가상의 음향 공간의 씬 속에 들어온 것 같은 AR (augmented reality) 입체음향이 재생된다. 각 "영역"에서는 서로 다른 "연극"이 펼쳐진다.
- 음원에는, 권병준 작가가 AI와 함께 작성한 연극을 연기하는 성우들의 음성 나레이션, 권병준 작가가 사운드 아티스트, 뮤지션, 전자악기 연구자로서 작곡한 음향 및 음악 등이 포함된다.
- 감상자가 "영역"에 들어있지 않을 때에는 그와 가장 가까운 "영역"으로부터 종소리가 들려와, 그를 "영역"으로 안내한다.
- 감상자는 현실의 전시 공간에서는 보이지 않는 "유령극단"의 노래를, GLPS 헤드폰에 의해 펼쳐지는 AR 음향 영역들 속에서 감상한다.

![](images/works/ghost-theater/exhibition_1.jpg)
*전시 공간의 벽에 걸린 GLPS 헤드폰*

![](images/works/ghost-theater/exhibition_2.jpg)
*각 "영역"은 전시 공간 바닥의 밝은 원형 스포트라이트에 의해 표시된다.*

![](images/works/ghost-theater/listening.jpg)
*"영역" 속에서의 감상*

![](images/works/ghost-theater/som.jpg)
*전시 설치 중*

## 해설

- 본작은 권병준 작가가 기존에 야외 작품으로서 연출했던 작품 [⟨유령극단 "심각한 밤을 보내리"⟩](https://byungjun.pe.kr/works/we-will-have-a-serious-night)를 서울대학교 미술관 실내에 압축하여 전시한 실내이식판이다. 한옥마을이나 농촌 등 야외의 다양한 장소에서 펼쳐지던 로봇들의 연극과 노래를 미술관 실내의 전시 공간 속에서 재구성하기 위해, 본 실내이식판을 위해 개발된 GLPS 헤드폰[^1] 버전에는 감상자로 하여금 가상의 음향적 공간 속에 들어와 있는 것처럼 지각시키는 실시간 입체음향 효과 기능이 추가되었다. 그럼으로써 같은 전시회 내의 다른 작품들이 전시되어 있는 현실의 공간 속에 숨어있는, 또 하나의 "유령"과 같은 음향 공간 레이어를 중첩시킨다.

## 기술

### 개오

- GLPS 헤드폰[^1]은 감상자의 위치와 머리 방향을 인식하여, 그 데이터를 바탕으로 실시간으로 입체음향 효과 처리된 음향을 출력한다.

### 상세

- GLPS 헤드폰의 하드웨어:
  - GLPS 헤드폰은 기성 헤드폰의 전자회로에 [PJRC Teensy](https://www.pjrc.com/teensy-4-0/)를 마이크로컨트롤러로 두는 PCB를 추가 장착함으로써 만들어진다.
  - GLPS 헤드폰을 착용한 감상자의 머리 방향을 인식하기 위해 IMU 센서([Adafruit BNO055](https://learn.adafruit.com/adafruit-bno055-absolute-orientation-sensor/overview))가 사용되었다.
  - 전시 공간 내 GLPS 헤드폰의 위치를 인식하기 위해 커스텀 LPS 시스템([DW1000](https://www.qorvo.com/products/p/DW1000) 등)이 사용되었다. LPS 시스템은 GLPS 헤드폰에 임베드 된 LPS 모듈 기판([DW1000](https://www.qorvo.com/products/p/DW1000))으로부터 전시 공간 내의 3개의 고정된 지점(앵커)에 설치된 LPS 모듈 기판([DW1000](https://www.qorvo.com/products/p/DW1000))까지의 거리를 측정해 삼변측량법을 통해 감상자의 위치를 계산한다.
  - 음원 오디오 파일을 저장하고 로드하기 위해 microSD 카드가 사용되었다.
- **GLPS 헤드폰의 소프트웨어**:
  - LPS 시스템으로부터 얻은 위치 정보를 바탕으로, 감상자가 어떤 "영역"에도 들어가 있지 않으면 종소리를, 어떤 "영역"에 들어가 있다면 그 "영역"에 맞는 음향이 재생되도록 했다.
  - IMU 센서로부터 얻은 감상자의 머리 방향을 바탕으로 입체음향 효과를 내기 위해, [Ambisonics](https://en.wikipedia.org/wiki/Ambisonics) 형식의 오디오 신호를 방향에 맞게 디코딩 하거나, 복수의 모노 오디오가 특정 지점들에 분포한 점 음원들처럼 들리도록 팬(pan) 하는 오디오 신호 처리를 프로그래밍했다.
  - 이상의 기능을 수행하는 프로그램은 [Teensy SDK](https://www.pjrc.com/teensy/td_download.html)와 [Teensy 오디오 SDK](https://github.com/PaulStoffregen/Audio)를 활용해 C++로 작성되어, GLPS 헤드폰 임베디드 시스템의 [Teensy](https://www.pjrc.com/teensy-4-0/)에 업로드되었다.

### 필자(임의존재)가 담당한 범위

- 필자(임의존재)가 담당한 부분은 GLPS 헤드폰의 임베디드 시스템을 위한 소프트웨어 개발[(소스 코드)](https://github.com/random-entity/o.art.ghost-theater-snumoa)이다.
- 상세 섹션에 작성한 리스트의 필자 담당 항목 루트는 **볼드체 문자**로 되어 있다.

## 외부 링크

- [YouTube - 서울특별시미술관협의회 - 전시 소개 영상](https://youtu.be/euUhxTG8qOQ)
- [권병준 작가 웹사이트 - 유령극단 "심각한 밤을 보내리" (홍동저수지)](https://byungjun.pe.kr/works/we-will-have-a-serious-night)

[^1]: 권병준/서울오픈미디어의 작품 다수에 사용되는 특수 개조 헤드폰. 임베디드 시스템 속 PJRC Teensy 마이크로컨트롤러 및 GPS 혹은 LPS (local positioning system) 모듈 등에 의해 작동하며, 각 작품의 용도에 맞게 부품이 추가되고 소프트웨어가 프로그래밍된다.

[^2]: 권병준 작가가 주도하는 미디어아트 작품 제작 팀.

[^3]: (1971–) 사운드, 로봇, 퍼포먼스 등을 미디어로 하는 한국의 현대미술가. 2024년 국립현대미술관 "올해의 작가상 2023" 수상. (참조: [작가 웹사이트](https://byungjun.pe.kr/))
:::
::: ja
![](images/works/ghost-theater/zones.jpg)

## 基本情報

- **形式**
  - ジャンル: インタラクティブ・サウンド・インスタレーション
  - 構成: 鑑賞者が着用するGLPSヘッドホン[^1]と、展示空間内のスポットライトで示される各「領域」に配置された立体音響シーンで構成されるインタラクティブ・サウンド・インスタレーション
- **制作陣**
  - 出品者: Seoul Open Media[^2] (KWON Byungjun[^3]、BAEK Juhong、任意存在)
  - 総括ディレクター、ハードウェア設計、音響: KWON Byungjun
  - ハードウェア設計: BAEK Juhong
  - ソフトウェア開発: 任意存在
- **公開**
  - 展示: [ソウル大学美術館 ⟨チューリングテスト：AIの愛の告白⟩ 展](http://www.snumoa.org/exhibitions_view.php?exh_id=151) (2022年)
- **ソースコード**: [GitHub - 私（任意存在）担当範囲](https://github.com/random-entity/o.art.ghost-theater-snumoa)

## あらすじ

- 展示空間に入った観覧客はGLPSヘッドホン[^1]を着用する。
- 展示空間の床にスポットライトで示された「領域」に鑑賞者が進入すると、まるでその領域を取り囲む仮想の音響空間のシーンに入り込んだかのようなAR（拡張現実）立体音響が再生される。各「領域」ではそれぞれ異なる「演劇」が繰り広げられる。
- 音源には、KWON Byungjun作家がAIと共に作成した演劇を演じる声優たちの音声ナレーション、KWON Byungjun作家がサウンドアーティスト、ミュージシャン、電子楽器研究者として作曲した音響および音楽などが含まれる。
- 鑑賞者が「領域」に入っていない時は、最も近い「領域」から鐘の音が聞こえ、鑑賞者を「領域」へと導く。
- 鑑賞者は、現実の展示空間には見えない「幽霊劇団」の歌を、GLPSヘッドホンによって展開されるAR音響領域の中で鑑賞する。

![](images/works/ghost-theater/exhibition_1.jpg)
*展示空間の壁に掛けられたGLPSヘッドホン*

![](images/works/ghost-theater/exhibition_2.jpg)
*各「領域」は、展示空間の床の明るい円形スポットライトによって示される。*

![](images/works/ghost-theater/listening.jpg)
*「領域」内での鑑賞*

![](images/works/ghost-theater/som.jpg)
*展示の設営中*

## 解説

- 本作は、KWON Byungjun作家が元来野外作品として演出していた作品[⟨幽霊劇団「深刻な夜を過ごそう」⟩](https://byungjun.pe.kr/works/we-will-have-a-serious-night)をソウル大学美術館の室内に圧縮して展示した室内移植版である。韓屋村や農村など野外の多様な場所で繰り広げられていたロボットたちの演劇と歌を美術館室内の展示空間の中で再構成するため、本室内移植版のために開発されたGLPSヘッドホン[^1]バージョンには、鑑賞者が仮想の音響的空間の中に入り込んでいるように知覚させるリアルタイム立体音響効果機能が追加された。これにより、同じ展示会内の他の作品が展示されている現実の空間の中に隠れている、もう一つの「幽霊」のような音響空間レイヤーを重畳させる。

## 技術

### 概要

- GLPSヘッドホン[^1]は、鑑賞者の位置と頭の向きを認識し、そのデータに基づいてリアルタイムで立体音響効果処理された音響を出力する。

### 詳細

- GLPSヘッドホンのハードウェア:
  - GLPSヘッドホンは、既製品のヘッドホンの電子回路に、[PJRC Teensy](https://www.pjrc.com/teensy-4-0/)をマイクロコントローラとして搭載したPCBを追加装着することで作られる。
  - GLPSヘッドホンを着用した鑑賞者の頭の向きを認識するためにIMUセンサー（[Adafruit BNO055](https://learn.adafruit.com/adafruit-bno055-absolute-orientation-sensor/overview)）が使用された。
  - 展示空間内のGLPSヘッドホンの位置を認識するためにカスタムLPSシステム（[DW1000](https://www.qorvo.com/products/p/DW1000)など）が使用された。LPSシステムは、GLPSヘッドホンに組み込まれたLPSモジュール基板（[DW1000](https://www.qorvo.com/products/p/DW1000)）から展示空間内の3つの固定された地点（アンカー）に設置されたLPSモジュール基板（[DW1000](https://www.qorvo.com/products/p/DW1000)）までの距離を測定し、三辺測量法を通じて鑑賞者の位置を計算する。
  - 音源オーディオファイルを保存し読み込むためにmicroSDカードが使用された。
- **GLPSヘッドホンのソフトウェア**:
  - LPSシステムから得た位置情報を基に、鑑賞者がどの「領域」にも入っていなければ鐘の音を、いずれかの「領域」に入っていればその「領域」に合った音響が再生されるようにした。
  - IMUセンサーから得た鑑賞者の頭の向きを基に立体音響効果を出すため、[Ambisonics](https://en.wikipedia.org/wiki/Ambisonics)形式のオーディオ信号を方向に合わせてデコードしたり、複数のモノラルオーディオが特定の地点に分布した点音源のように聞こえるようパン（pan）するオーディオ信号処理をプログラミングした。
  - 以上の機能を実行するプログラムは、[Teensy SDK](https://www.pjrc.com/teensy/td_download.html)と[Teensy オーディオ SDK](https://github.com/PaulStoffregen/Audio)を活用してC++で作成され、GLPSヘッドホンの組み込みシステムの[Teensy](https://www.pjrc.com/teensy-4-0/)にアップロードされた。

### 私（任意存在）が担当した範囲

- 私（任意存在）が担当した部分は、GLPSヘッドホンの組み込みシステムのためのソフトウェア開発[（ソースコード）](https://github.com/random-entity/o.art.ghost-theater-snumoa)である。
- 詳細セクションに作成したリストの私担当項目のルートは**太字**になっている。

## 外部リンク

- [YouTube - ソウル特別市美術館協議会 - 展示紹介映像](https://youtu.be/euUhxTG8qOQ)
- [KWON Byungjun作家ウェブサイト - 幽霊劇団「深刻な夜を過ごそう」（洪東貯水池）](https://byungjun.pe.kr/works/we-will-have-a-serious-night)

[^1]: KWON Byungjun／Seoul Open Mediaの作品の多くに使用される特殊改造ヘッドホン。組み込みシステム内のPJRC TeensyマイクロコントローラやGPSまたはLPS（local positioning system）モジュールなどによって動作し、各作品の用途に合わせて部品が追加され、ソフトウェアがプログラミングされる。

[^2]: KWON Byungjun作家が主導するメディアアート作品制作チーム。

[^3]: (1971–) サウンド、ロボット、パフォーマンスなどをメディアとする韓国の現代美術家。2024年国立現代美術館「今年の作家賞 2023」受賞。(参照: [作家ウェブサイト](https://byungjun.pe.kr/))
:::
