---
title: 시간#3
parent: Selected works
layout: default
nav_order: -2021.102501
---

<!-- prettier-ignore-start -->

# 시간#3
{: .no_toc }

현재와 과거가 중첩되고, 그 중첩이 다시 미래와 중첩된다.
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

## 기본 정보

<dl>
  <dt>형식</dt>
  <dd>
    <dl>
      <dt>장르</dt>
      <dd>인터랙티브 영상 설치</dd>
      <dt>구성</dt>
      <dd>
        카메라로부터의 실시간 화상 입력을 처리하는 CG 시스템과 프로젝션 간의 피드백에 의한 인터랙티브 영상 프로젝션
      </dd>
    </dl>
  </dd>
  <dt>만든 사람들</dt>
  <dd>
    <dl>
      <dt>출품자</dt>
      <dd>임의존재(팀) (임의존재, 이호정, 조민기)</dd>
      <dt>연출,<br />프로그래밍</dt>
      <dd>임의존재</dd>
      <dt>스태프</dt>
      <dd>이호정, 조민기</dd>
    </dl>
  </dd>
  <dt>공개</dt>
  <dd>
    <dl>
      <dt>전시</dt>
      <dd><span markdown="1">
        [2021년 서울대학교 예술주간: ArtSpace@SNU 2021](https://art.snu.ac.kr/notice/2021-%EC%98%88%EC%88%A0%EC%A3%BC%EA%B0%84-art-spacesnu-%ED%96%89%EC%82%AC-%EC%95%8C%EB%A6%BC/)
      </span></dd>
      <dt>웹</dt>
      <dd>
        <dl>
          <dt>온라인 전시 스트림</dt>
          <dd><span markdown="1">
            [YouTube](https://youtube.com/playlist?list=PLHd0nQV4yFCttLpyaW8WxbNHLY5K0mgyV&si=C2fMDkA4e8AyUCpZ)
          </span></dd>
        </dl>
      </dd>
    </dl>
  </dd>
  <dt>소스 코드</dt>
  <dd><a href="https://github.com/random-entity/o.art.time3">GitHub</a></dd>
</dl>

## 줄거리

- 본작은 공공장소의 층계참에 설치되었다. 감상자는 벽의 프로젝션과 반대편의 카메라 사이를 지나간다. 그러면 벽의 프로젝션에 자신의 모습 및 피드백에 의한 연쇄되는 영상 속 영상 속 영상...으로 이어지는 그 메아리가 보인다.
- 그 화상은 약 10초 후(감상자가 계단을 오르거나 내려가 재차 그 벽을 볼 수 있는 위치에 갔을 때 쯤), 영상 속 영상 속에서 또 한 번 나타난다. 20초 후에는 또 그 속의 영상에, 30초 후에는 또 그 속의 영상에 나타나는 과정이 반복됨과 함께 환영처럼 희미해져 간다.
- 층계참에서 10초 이상을 보내게 되면, 현재와 과거가 중첩되어 서로 다른 시간의 레이어들이 어지럽게 얽히는 기묘한 시간적 감각을 체험할 수 있다.

<iframe width="560" height="315" src="https://www.youtube.com/embed/D_rsLAvh-H0?si=NczS3TUO8Mb17WaG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 해설

- 본작은 '현재 속에도 환영처럼 존재하는 과거'를 영상 설치 작품으로서 구현한다.
- 본작은 기본적으로 벽의 프로젝션을 카메라로 촬영하고, 그것을 다시 벽에 투영하는 피드백 시스템이지만, 벽에 투사되는 영상은 현재의 영상과 10초 전 영상의 평균(더해서 2로 나눈 것)이다. 그 결과 순간적 피드백에 의한 효과는 마치 음향의 리버브 (reverberation) 같은 효과를 내고, 그 결과에 추가된 과거와의 평균 효과는 마치 음향의 딜레이 (delay) 같은 효과를 낸다. 감상자는 현재의 1/2, 10초 전의 1/4, 20초 전의 1/8, 30초 전의 1/16, … 등이 겹쳐진 영상을 보게 된다.
- 그럼으로써 현재와 과거가 한 화상 속에 겹치는 것은 물론, 그 겹침 자체가 미래에 다시 반복되어 가는 영상을 구현한다.
- 이 시스템이 하는 일을 대략적으로 수식으로서 표현하면 다음과 같다. ($$p$$는 프로젝션 영상, $$c$$는 카메라 영상, $$s$$는 프로젝션 영상 원본을 카메라가 캡쳐한 영상으로 변환하는 축소 및 열화 변환, $$\oplus r$$은 감상자 등 현실의 사물에 의해 영상이 덮어씌워지는 것을 나타낸다.)

$$p(t) = \frac{c(t-\epsilon) + c(t-\epsilon-d)}{2}$$

$$c(t) = s(p(t-\epsilon')) \oplus r(t)$$

<iframe width="560" height="315" src="https://www.youtube.com/embed/j2dVTcLCedA?si=vi41cvz9uFctsTUG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## 기술

- 벽과 가까이에서 벽에 영상을 투사하여 카메라와 프로젝션 영상 사이의 공간에서 감상자가 지나다녀도 영상에 방해를 받지 않기 위해 단초점 프로젝터를 사용했다.
- 카메라가 촬영하는 영상을 실시간으로 PC에 입력하기 위해 [EOS Camera Utility](https://www.usa.canon.com/support/eos-utilities)를 사용했다.
- 평균 효과가 적용된 프로젝션 화상을 실시간 렌더링하기 위해 [TouchDesigner](https://derivative.ca/UserGuide/TouchDesigner)를 사용했다.

{% include scroll_gallery.html images="
  ../../../assets/images/works/time3/v.jpg |
  작품 설치 중. 프로젝션 화상 중앙의 사람은 본 사진을 찍은 사람의 10초 전 과거다.
" %}

## 외부 링크

- [YouTube - ArtSpace@SNU - 작품 소개](https://youtu.be/j2dVTcLCedA)
- [Instagram - ArtSpace@SNU - 작품 소개](https://www.instagram.com/tv/CV4RdUsMEr2/)
- [Facebook - ArtSpace@SNU](https://www.facebook.com/snuartspace)
