---
title: 유령극단 "심각한 밤을 보내리" (실내이식판)
parent: Works
layout: default
nav_order: -2022.0324
---

<!-- prettier-ignore-start -->

# 유령극단 "심각한 밤을 보내리"
{: .no_toc }

???
{: .fs-5 .fw-300 }

![](../../../assets/images/works/ghost-theater/exhibition_2.jpg)

Interactive sound installation
{: .label }
Audio signal processing
{: .label .label-green }
3D audio rendering
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
PJRC Teensy
{: .label .label-purple }
C++
{: .label .label-purple }
v2022--
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
      <dd>
        GLPS 헤드폰<span markdown="1">[^1]</span>과 전시 공간 속 스포트라이트로 표시되는 "존"들에 배치된 입체음향 씬으로 구성된 인터랙티브 사운드 설치
      </dd>
    </dl>
  </dd>
  <dt>만든 사람들</dt>
  <dd>
    <dl>
      <dt>출품자</dt>
      <dd>서울오픈미디어 (권병준, 백주홍, 임의존재)</dd>
      <dt>총괄 디렉터,<br />음향</dt>
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
      <dd><a href="http://www.snumoa.org/exhibitions_view.php?exh_id=151">서울대학교 미술관 ⟨튜링 테스트: AI의 사랑 고백⟩ 전 (2022년)</a></dd>
      <dt>상시</dt>
      <dd>
        <dl>
          <dt>소스 코드</dt>
          <dd>
            <a href="https://github.com/random-entity/o.art.ghost-theater-snumoa"
              >GitHub (필자(임의존재) 담당 범위)</a
            >
          </dd>
        </dl>
      </dd>
    </dl>
  </dd>
</dl>

## 줄거리

展示空間に入った観覧者はGLPS ヘッドホンを受け取る。Seoul Open
Media が長い間開発してきたこのヘッドホンは、中に搭載された埋め込み
システムを通じて着用者の頭の位置と向きを認識することができる。それ
にAmbisonic 技術を用い、現実空間に音源が分布しているかのような錯
覚を起こすAR音響を出力する。
展示室内の各「ゾーン」に入ると、当ゾーンの周りに配置されている音
源によるAR音響が流れる。音源には、シリア難民の民謡の音声記録やAI
が作成したスクリプトに基づいた劇のナレーションや電子音楽などが含ま
れており、分離されているように認識されがちな世界らを一つの空間に共
存させる。

## 이미지

{% include scroll_gallery.html images="
  ../../../assets/images/works/ghost-theater/exhibition_1.jpg |
  GLPS Headphones
  |||||
  ../../../assets/images/works/ghost-theater/exhibition_1.jpg |
  床の照明が明るい円形の領域それぞれが、サウンドの「ゾーン」である。
" %}

## 해설

- 전작을 서울대학교 미술관 실내에 옮긴 이식판.
- 그냥 소리가 입체 씬 속에서 들린다, 그게 중요한 것. 이건 내 포트폴리오니까, 내가 어떤 역할을 했는지를 쓰면 된다. 그거면 됨. 원작자가 어떤 망상을 했는지 나는 밝힐 필요 없음.

## 기술

- 앰비소닉
- IMU 센서

---

[^1]:
    특수 개조 헤드폰, KWON Byungjun氏の数々の作品に用いられる特殊制作ヘッドホン。Teensyプロセッサー、Ambisonic音響技術、ジャイロセンサー、GPSまたはLPS
    （ローカル位置認識システム）技術などを用い、現実の空間にもう一つの音響環境を重ね合わせる、いわばAR音響を可能にする。
    앰비소닉
