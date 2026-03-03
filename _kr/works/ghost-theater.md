---
title: 유령극단 "심각한 밤을 보내리" (실내이식판)
parent: Selected works
layout: default
nav_order: -2022.0324
---

<!-- prettier-ignore-start -->

# 유령극단 “심각한 밤을 보내리” (실내이식판)
{: .no_toc }

기계 속 유령들이 노래하는 인간과 사랑에 대한 시.
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

## 기본 정보

<dl>
  <dt>형식</dt>
  <dd>
    <dl>
      <dt>장르</dt>
      <dd>인터랙티브 사운드 설치</dd>
      <dt>구성</dt>
      <dd><span markdown="1">
        감상자가 착용하는 GLPS 헤드폰[^1]과, 전시 공간 속 스포트라이트로 표시되는 “영역”들 각각에 배치된 입체음향 씬들로 구성된 인터랙티브 사운드 설치
      </span></dd>
    </dl>
  </dd>
  <dt>만든 사람들</dt>
  <dd>
    <dl>
      <dt>출품자</dt>
      <dd>서울오픈미디어<span markdown="1">[^2]</span> (권병준<span markdown="1">[^3]</span>, 백주홍, 임의존재)</dd>
      <dt>총괄 디렉터,<br />하드웨어 설계<br />음향</dt>
      <dd>권병준</dd>
      <dt>하드웨어 설계</dt>
      <dd>백주홍</dd>
      <dt>소프트웨어 개발</dt>
      <dd>임의존재</dd>
    </dl>
  </dd>
  <dt>공개</dt>
  <dd>
    <dl>
      <dt>전시</dt>
      <dd><span markdown="1">
        [서울대학교 미술관 ⟨튜링 테스트: AI의 사랑 고백⟩ 전](http://www.snumoa.org/exhibitions_view.php?exh_id=151) (2022년)
      </span></dd>
    </dl>
  </dd>
  <dt>소스 코드</dt>
  <dd><span markdown="1">
      [GitHub - 필자(임의존재) 담당 범위](https://github.com/random-entity/o.art.ghost-theater-snumoa)
  </span></dd>
</dl>

## 줄거리

- 전시 공간에 들어선 관람객은 GLPS 헤드폰[^1]을 착용한다.
- 전시 공간 바닥의 스포트라이트로 표시된 "영역"에 감상자가 진입하면, 마치 해당 영역을 둘러싼 가상의 음향 공간의 씬 속에 들어온 것 같은 AR (augmented reality) 입체음향이 재생된다. 각 "영역"에서는 서로 다른 "연극"이 펼쳐진다.
- 음원에는, 권병준 작가가 AI와 함께 작성한 연극을 연기하는 성우들의 음성 나레이션, 권병준 작가가 사운드 아티스트, 뮤지션, 전자악기 연구자로서 작곡한 음향 및 음악 등이 포함된다.
- 감상자가 "영역"에 들어있지 않을 때에는 그와 가장 가까운 "영역"으로부터 종소리가 들려와, 그를 "영역"으로 안내한다.
- 감상자는 현실의 전시 공간에서는 보이지 않는 "유령극단"의 노래를, GLPS 헤드폰에 의해 펼쳐지는 AR 음향 영역들 속에서 감상한다.

{% include scroll_gallery.html images="
  ../../../assets/images/works/ghost-theater/exhibition_1.jpg |
  전시 공간의 벽에 걸린 GLPS 헤드폰
  |||||
  ../../../assets/images/works/ghost-theater/exhibition_2.jpg |
  각 “영역”은 전시 공간 바닥의 밝은 원형 스포트라이트에 의해 표시된다.
  |||||
  ../../../assets/images/works/ghost-theater/listening.jpg |
  “영역” 속에서의 감상
  |||||
  ../../../assets/images/works/ghost-theater/som.jpg |
  전시 설치 중
" %}

## 해설

- 본작은 권병준 작가가 기존에 야외 작품으로서 연출했던 작품 [⟨유령극단 "심각한 밤을 보내리"⟩](https://byungjun.pe.kr/works/we-will-have-a-serious-night)를 서울대학교 미술관 실내에 압축하여 전시한 실내이식판이다. 한옥마을이나 농촌 등 야외의 다양한 장소에서 펼쳐지던 로봇들의 연극과 노래를 미술관 실내의 전시 공간 속에서 재구성하기 위해, 본 실내이식판을 위해 개발된 GLPS 헤드폰[^1] 버전에는 감상자로 하여금 가상의 음향적 공간 속에 들어와 있는 것처럼 지각시키는 실시간 입체음향 효과 기능이 추가되었다. 그럼으로써 같은 전시회 내의 다른 작품들이 전시되어 있는 현실의 공간 속에 숨어있는, 또 하나의 "유령"과 같은 음향 공간 레이어를 중첩시킨다.

## 기술

### 개오

- GLPS 헤드폰[^1]은 감상자의 위치와 머리 방향을 인식하여, 그 데이터를 바탕으로 실시간으로 입체음향 효과 처리된 음향을 출력한다.

### 상세

- GLPS 헤드폰의 하드웨어:
  - GLPS 헤드폰은 기성 헤드폰의 전자회로에 [PJRC Teensy]를 마이크로프로세서로 두는 PCB를 추가 장착함으로써 만들어진다.
  - GLPS 헤드폰을 착용한 감상자의 머리 방향을 인식하기 위해 IMU 센서([Adafruit BNO055])가 사용되었다.
  - 전시 공간 내 GLPS 헤드폰의 위치를 인식하기 위해 커스텀 LPS 시스템([DW1000] 등)이 사용되었다. LPS 시스템은 GLPS 헤드폰에 임베드 된 LPS 모듈 기판([DW1000])으로부터 전시 공간 내의 3개의 고정된 지점(앵커)에 설치된 LPS 모듈 기판([DW1000])까지의 거리를 측정해 삼변측량법을 통해 감상자의 위치를 계산한다.
  - 음원 오디오 파일을 저장하고 로드하기 위해 microSD 카드가 사용되었다.
- **GLPS 헤드폰의 소프트웨어**:
  - LPS 시스템으로부터 얻은 위치 정보를 바탕으로, 감상자가 어떤 "영역"에도 들어가 있지 않으면 종소리를, 어떤 "영역"에 들어가 있다면 그 "영역"에 맞는 음향이 재생되도록 했다.
  - IMU 센서로부터 얻은 감상자의 머리 방향을 바탕으로 입체음향 효과를 내기 위해, [Ambisonics] 형식의 오디오 신호를 방향에 맞게 디코딩 하거나, 복수의 모노 오디오가 특정 지점들에 분포한 점 음원들처럼 들리도록 팬(pan) 하는 오디오 신호 처리를 프로그래밍했다.
  - 이상의 기능을 수행하는 프로그램은 [Teensy SDK]와 [Teensy 오디오 SDK]를 활용해 C++로 작성되어, GLPS 헤드폰 임베디드 시스템의 [Teensy]에 업로드되었다.

### 필자(임의존재)가 담당한 범위

- 필자(임의존재)가 담당한 부분은 GLPS 헤드폰의 임베디드 시스템을 위한 소프트웨어 개발[(소스 코드)](https://github.com/random-entity/o.art.ghost-theater-snumoa)이다.
- 상세 섹션에 작성한 리스트의 필자 담당 항목 루트는 **볼드체 문자**로 되어 있다.

## 외부 링크

- [YouTube - 서울특별시미술관협의회 - 전시 소개 영상](https://youtu.be/euUhxTG8qOQ)
- [권병준 작가 웹사이트 - 유령극단 "심각한 밤을 보내리" (홍동저수지)](https://byungjun.pe.kr/works/we-will-have-a-serious-night)

---

[^1]: 권병준/서울오픈미디어의 작품 다수에 사용되는 특수 개조 헤드폰. 임베디드 시스템 속 PJRC Teensy 마이크로컨트롤러 및 GPS 혹은 LPS (local positioning system) 모듈 등에 의해 작동하며, 각 작품의 용도에 맞게 부품이 추가되고 소프트웨어가 프로그래밍된다.

[^2]: 권병준 작가가 주도하는 미디어아트 작품 제작 팀.

[^3]: (1971–) 사운드, 로봇, 퍼포먼스 등을 미디어로 하는 한국의 현대미술가. 2024년 국립현대미술관 "올해의 작가상 2023" 수상. (참조: [작가 웹사이트](https://byungjun.pe.kr/))

[PJRC Teensy]: https://www.pjrc.com/teensy-4-0/
[Teensy]: https://www.pjrc.com/teensy-4-0/
[Adafruit BNO055]: https://learn.adafruit.com/adafruit-bno055-absolute-orientation-sensor/overview
[DW1000]: https://www.qorvo.com/products/p/DW1000
[Ambisonics]: https://en.wikipedia.org/wiki/Ambisonics
[Teensy SDK]: https://www.pjrc.com/teensy/td_download.html
[Teensy 오디오 SDK]: https://github.com/PaulStoffregen/Audio
