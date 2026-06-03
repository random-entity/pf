---
title: { en: "Time#3", ko: "시간#3", ja: "時間#3" }
tagline:
  en: "The present and the past overlap, and that overlap overlaps again with the future."
  ko: "현재와 과거가 중첩되고, 그 중첩이 다시 미래와 중첩된다."
  ja: "現在と過去が重なり合い、その重なりが再び未来と重なり合う。"
releases:
  - { "ArtSpace@SNU 2021": "2021-10-25" }
type: Personal work
genre: ["Interactive video installation"]
tags: ["Real-time video processing", "Video feedback", "Fractal video", "Video projection"]
tools: ["TouchDesigner", "EOS Camera Utility"]
source: "[GitHub](https://github.com/random-entity/o.art.time3)"
---
::: en
![](images/works/time3/demo-video-stills/1.png)

## Basic information

- **Format**
  - Genre: Interactive video installation
  - Composition: Interactive video projection created by feedback between the projection and a CG system that processes real-time image input from a camera
- **Creators**
  - Exhibitor: Random Entity (team) (random-entity, Hojeong Lee, Minki Cho)
  - Direction, Programming: random-entity
  - Staff: Hojeong Lee, Minki Cho
- **Release**
  - Exhibition: [2021 Seoul National University Art Week: ArtSpace@SNU 2021](https://art.snu.ac.kr/notice/2021-%EC%98%88%EC%88%A0%EC%A3%BC%EA%B0%84-art-spacesnu-%ED%96%89%EC%82%AC-%EC%95%8C%EB%A6%BC/)
  - Web
    - Online exhibition stream: [YouTube](https://youtube.com/playlist?list=PLHd0nQV4yFCttLpyaW8WxbNHLY5K0mgyV&si=C2fMDkA4e8AyUCpZ)
- **Source code**: [GitHub](https://github.com/random-entity/o.art.time3)

## Synopsis

- This work was installed on a stairway landing in a public space. The viewer passes between the projection on the wall and the camera on the opposite side. Then, on the wall projection, they see their own image and its echo leading to a cascading video within a video within a video... created by feedback.
- That image appears once again inside the video within the video about 10 seconds later (around the time the viewer goes up or down the stairs and reaches a position where they can see that wall again). It appears in the video within it 20 seconds later, and in the video within that 30 seconds later, repeating this process while fading away like an illusion.
- If one spends more than 10 seconds on the landing, they can experience a bizarre temporal sensation where the present and past overlap, and layers of different times become dizzily intertwined.

[Video](https://youtu.be/D_rsLAvh-H0)

## Commentary

- This work implements "the past existing like an illusion even within the present" as a video installation artwork.
- Basically, this work is a feedback system that films the wall projection with a camera and projects it back onto the wall, but the video projected on the wall is the average (sum divided by 2) of the current video and the video from 10 seconds ago. As a result, the effect caused by momentary feedback acts like audio reverberation, and the average effect with the past added to the result acts like audio delay. The viewer sees a video where 1/2 of the present, 1/4 of 10 seconds ago, 1/8 of 20 seconds ago, 1/16 of 30 seconds ago, etc., are overlapped.
- By doing so, it implements a video where not only do the present and past overlap in one image, but that overlap itself is repeated again in the future.
- Roughly expressing what this system does as a mathematical formula is as follows. ($$p$$is the projection video,$$c$$is the camera video,$$s$$is the scale down and degradation transformation that converts the original projection video into the video captured by the camera, and$$\oplus r$$ represents the video being overwritten by real objects such as the viewer.)

$$p(t) = \frac{c(t-\epsilon) + c(t-\epsilon-d)}{2}$$

$$c(t) = s(p(t-\epsilon')) \oplus r(t)$$

[Video](https://youtu.be/j2dVTcLCedA)

## Technology

- A short-throw projector was used to project the video close to the wall so that the image would not be obstructed even if viewers pass by in the space between the camera and the projection wall.
- [EOS Camera Utility](https://www.usa.canon.com/support/eos-utilities) was used to input the video filmed by the camera to the PC in real-time.
- [TouchDesigner](https://derivative.ca/UserGuide/TouchDesigner) was used to real-time render the projection image with the average effect applied.

![](images/works/time3/v.jpg)
*During artwork installation. The person in the center of the projection image is the 10-second past of the person who took this photo.*

## External links

- [YouTube - ArtSpace@SNU - Artwork introduction](https://youtu.be/j2dVTcLCedA)
- [Instagram - ArtSpace@SNU - Artwork introduction](https://www.instagram.com/tv/CV4RdUsMEr2/)
- [Facebook - ArtSpace@SNU](https://www.facebook.com/snuartspace)
:::
::: ko
![](images/works/time3/demo-video-stills/1.png)

## 기본 정보

- **형식**
  - 장르: 인터랙티브 영상 설치
  - 구성: 카메라로부터의 실시간 화상 입력을 처리하는 CG 시스템과 프로젝션 간의 피드백에 의한 인터랙티브 영상 프로젝션
- **만든 사람들**
  - 출품자: 임의존재(팀) (임의존재, 이호정, 조민기)
  - 연출, 프로그래밍: 임의존재
  - 스태프: 이호정, 조민기
- **공개**
  - 전시: [2021년 서울대학교 예술주간: ArtSpace@SNU 2021](https://art.snu.ac.kr/notice/2021-%EC%98%88%EC%88%A0%EC%A3%BC%EA%B0%84-art-spacesnu-%ED%96%89%EC%82%AC-%EC%95%8C%EB%A6%BC/)
  - 웹
    - 온라인 전시 스트림: [YouTube](https://youtube.com/playlist?list=PLHd0nQV4yFCttLpyaW8WxbNHLY5K0mgyV&si=C2fMDkA4e8AyUCpZ)
- **소스 코드**: [GitHub](https://github.com/random-entity/o.art.time3)

## 줄거리

- 본작은 공공장소의 층계참에 설치되었다. 감상자는 벽의 프로젝션과 반대편의 카메라 사이를 지나간다. 그러면 벽의 프로젝션에 자신의 모습 및 피드백에 의한 연쇄되는 영상 속 영상 속 영상...으로 이어지는 그 메아리가 보인다.
- 그 화상은 약 10초 후(감상자가 계단을 오르거나 내려가 재차 그 벽을 볼 수 있는 위치에 갔을 때 쯤), 영상 속 영상 속에서 또 한 번 나타난다. 20초 후에는 또 그 속의 영상에, 30초 후에는 또 그 속의 영상에 나타나는 과정이 반복됨과 함께 환영처럼 희미해져 간다.
- 층계참에서 10초 이상을 보내게 되면, 현재와 과거가 중첩되어 서로 다른 시간의 레이어들이 어지럽게 얽히는 기묘한 시간적 감각을 체험할 수 있다.

[Video](https://youtu.be/D_rsLAvh-H0)

## 해설

- 본작은 '현재 속에도 환영처럼 존재하는 과거'를 영상 설치 작품으로서 구현한다.
- 본작은 기본적으로 벽의 프로젝션을 카메라로 촬영하고, 그것을 다시 벽에 투영하는 피드백 시스템이지만, 벽에 투사되는 영상은 현재의 영상과 10초 전 영상의 평균(더해서 2로 나눈 것)이다. 그 결과 순간적 피드백에 의한 효과는 마치 음향의 리버브 (reverberation) 같은 효과를 내고, 그 결과에 추가된 과거와의 평균 효과는 마치 음향의 딜레이 (delay) 같은 효과를 낸다. 감상자는 현재의 1/2, 10초 전의 1/4, 20초 전의 1/8, 30초 전의 1/16, … 등이 겹쳐진 영상을 보게 된다.
- 그럼으로써 현재와 과거가 한 화상 속에 겹치는 것은 물론, 그 겹침 자체가 미래에 다시 반복되어 가는 영상을 구현한다.
- 이 시스템이 하는 일을 대략적으로 수식으로서 표현하면 다음과 같다. ($$p$$는 프로젝션 영상, $$c$$는 카메라 영상, $$s$$는 프로젝션 영상 원본을 카메라가 캡쳐한 영상으로 변환하는 축소 및 열화 변환, $$\oplus r$$은 감상자 등 현실의 사물에 의해 영상이 덮어씌워지는 것을 나타낸다.)

$$p(t) = \frac{c(t-\epsilon) + c(t-\epsilon-d)}{2}$$

$$c(t) = s(p(t-\epsilon')) \oplus r(t)$$

[Video](https://youtu.be/j2dVTcLCedA)

## 기술

- 벽과 가까이에서 벽에 영상을 투사하여 카메라와 프로젝션 영상 사이의 공간에서 감상자가 지나다녀도 영상에 방해를 받지 않기 위해 단초점 프로젝터를 사용했다.
- 카메라가 촬영하는 영상을 실시간으로 PC에 입력하기 위해 [EOS Camera Utility](https://www.usa.canon.com/support/eos-utilities)를 사용했다.
- 평균 효과가 적용된 프로젝션 화상을 실시간 렌더링하기 위해 [TouchDesigner](https://derivative.ca/UserGuide/TouchDesigner)를 사용했다.

![](images/works/time3/v.jpg)
*작품 설치 중. 프로젝션 화상 중앙의 사람은 본 사진을 찍은 사람의 10초 전 과거다.*

## 외부 링크

- [YouTube - ArtSpace@SNU - 작품 소개](https://youtu.be/j2dVTcLCedA)
- [Instagram - ArtSpace@SNU - 작품 소개](https://www.instagram.com/tv/CV4RdUsMEr2/)
- [Facebook - ArtSpace@SNU](https://www.facebook.com/snuartspace)
:::
::: ja
![](images/works/time3/demo-video-stills/1.png)

## 基本情報

- **形式**
  - ジャンル: インタラクティブ映像インスタレーション
  - 構成: カメラからのリアルタイム画像入力を処理するCGシステムとプロジェクション間のフィードバックによるインタラクティブ映像プロジェクション
- **制作陣**
  - 出品者: 任意存在（チーム）（任意存在、イ・ホジョン、チョ・ミンギ）
  - 演出、プログラミング: 任意存在
  - スタッフ: LEE Hojeong、CHO Minki
- **公開**
  - 展示: [2021年ソウル大学芸術週間：ArtSpace@SNU 2021](https://art.snu.ac.kr/notice/2021-%EC%98%88%EC%88%A0%EC%A3%BC%EA%B0%84-art-spacesnu-%ED%96%89%EC%82%AC-%EC%95%8C%EB%A6%BC/)
  - Web
    - オンライン展示ストリーム: [YouTube](https://youtube.com/playlist?list=PLHd0nQV4yFCttLpyaW8WxbNHLY5K0mgyV&si=C2fMDkA4e8AyUCpZ)
- **ソースコード**: [GitHub](https://github.com/random-entity/o.art.time3)

## あらすじ

- 本作は公共の場の踊り場に設置された。鑑賞者は壁のプロジェクションと反対側のカメラの間を通り過ぎる。すると壁のプロジェクションに自身の姿およびフィードバックによる連鎖的な映像の中の映像の中の映像...へと繋がるそのこだまが見える。
- その画像は約10秒後（鑑賞者が階段を上り下りして再びその壁を見ることができる位置に来た頃）、映像の中の映像の中で再び現れる。20秒後にはさらにその中の映像に、30秒後にはさらにその中の映像に現れる過程が繰り返されるとともに、幻影のようにかすんでいく。
- 踊り場で10秒以上過ごすと、現在と過去が重なり合い、異なる時間のレイヤーが目まぐるしく絡み合う奇妙な時間的感覚を体験できる。

[Video](https://youtu.be/D_rsLAvh-H0)

## 解説

- 本作は「現在の中にも幻影のように存在する過去」を映像インスタレーション作品として実装する。
- 本作は基本的に壁のプロジェクションをカメラで撮影し、それを再び壁に投影するフィードバックシステムであるが、壁に投影される映像は現在の映像と10秒前の映像の平均（足して2で割ったもの）である。その結果、瞬間的なフィードバックによる効果はまるで音響のリバーブ（reverberation）のような効果を生み出し、その結果に追加された過去との平均効果はまるで音響のディレイ（delay）のような効果を生み出す。鑑賞者は現在の1/2、10秒前の1/4、20秒前の1/8、30秒前の1/16などが重なり合った映像を見ることになる。
- これにより、現在と過去が一つの画像の中で重なり合うのはもちろん、その重なり自体が未来に再び繰り返されていく映像を実装する。
- このシステムが行うことをおおまかに数式として表現すると次のようになる。（$$p$$はプロジェクション映像、$$c$$はカメラ映像、$$s$$はプロジェクション映像のオリジナルをカメラがキャプチャした映像に変換する縮小および劣化変換、$$\oplus r$$は鑑賞者など現実の事物によって映像が上書きされることを表す。）

$$p(t) = \frac{c(t-\epsilon) + c(t-\epsilon-d)}{2}$$

$$c(t) = s(p(t-\epsilon')) \oplus r(t)$$

[Video](https://youtu.be/j2dVTcLCedA)

## 技術

- 壁の近くから壁に映像を投影し、カメラとプロジェクション映像の間の空間を鑑賞者が通り過ぎても映像が遮られないようにするため、短焦点プロジェクターを使用した。
- カメラが撮影する映像をリアルタイムでPCに入力するため、[EOS Camera Utility](https://www.usa.canon.com/support/eos-utilities)を使用した。
- 平均効果が適用されたプロジェクション画像をリアルタイムレンダリングするため、[TouchDesigner](https://derivative.ca/UserGuide/TouchDesigner)を使用した。

![](images/works/time3/v.jpg)
*作品設置中。プロジェクション画像の中央の人は、この写真を撮った人の10秒前の過去である。*

## 外部リンク

- [YouTube - ArtSpace@SNU - 作品紹介](https://youtu.be/j2dVTcLCedA)
- [Instagram - ArtSpace@SNU - 作品紹介](https://www.instagram.com/tv/CV4RdUsMEr2/)
- [Facebook - ArtSpace@SNU](https://www.facebook.com/snuartspace)
:::
