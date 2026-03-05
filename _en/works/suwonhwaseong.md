---
title: Digital Maehwapo
parent: Selected works
layout: default
nav_order: -2023.1006
---

<!-- prettier-ignore-start -->

# Digital Maehwapo[^1]
{: .no_toc }

The Maehwapo from King Jeongjo's procession to Hwaseong, recreated before everyone's eyes as digital art.
{: .fs-5 .fw-300 }

![](../../../assets/images/works/suwonhwaseong/main_name-cut.jpg)

Interactive video installation
{: .label }
Interactive CG
{: .label .label-green }
Webcam
{: .label .label-green }
Real-time video processing
{: .label .label-green }
LED cube display
{: .label .label-green }
Processing
{: .label .label-purple }
v2023-10-06
{: .label .label-yellow }

## Table of Contents
{: .no_toc .text-delta }

- TOC
{:toc}

<!-- prettier-ignore-end -->

## Basic Information

<dl>
  <dt>Format</dt>
  <dd>
    <dl>
      <dt>Genre</dt>
      <dd>Interactive video installation</dd>
      <dt>Composition</dt>
      <dd>
        An interactive video installation played on an LED cube display measuring approximately 2 meters in width, depth, and height, which reacts to the movements of surrounding visitors.
      </dd>
    </dl>
  </dd>
  <dt>Creators</dt>
  <dd>
    <dl>
      <dt>Exhibitor</dt>
      <dd>Hyekang<span markdown="1">[^2]</span>, Random Entity</dd>
      <dt>Animation</dt>
      <dd>Hyekang</dd>
      <dt>Software Development</dt>
      <dd>Random Entity</dd>
      <dt>Commission</dt>
      <dd>Suwon Cultural Foundation</dd>
    </dl>
  </dd>
  <dt>Release</dt>
  <dd>
    <dl>
      <dt>Event</dt>
      <dd><span markdown="1">
        [2023 Suwon Hwaseong Media Art](https://www.swcf.or.kr/hlfl/?p=10) - Media Ground
      </span></dd>
    </dl>
  </dd>
  <dt>Source Code</dt>
  <dd><span markdown="1">
    [GitHub - Scope in charge of the author (Random Entity)](https://github.com/random-entity/o.w.suwonhwaseong)
  </span></dd>
</dl>

## Synopsis

- An LED cube measuring approximately 2 meters in width, depth, and height is installed on the grass of the Suwon Hwaseong Traditional Archery Field.
- On the four side panels of the LED cube, a digital illustration of a traditional Korean painting drawn with mother-of-pearl plays, sparkling with brilliant colors in the evening darkness.
- When visitors approach the cube, Maehwapo (plum blossom fireworks) shoot up and explode within the painting.

{% include scroll_gallery.html images="
  ../../../assets/images/works/suwonhwaseong/IMG_5496.JPG |
  2023 Suwon Hwaseong Media Art “Media Ground” exhibition scene
  |||||
  ../../../assets/images/works/suwonhwaseong/IMG_5489.JPG |
  2023 Suwon Hwaseong Media Art “Media Ground” exhibition scene
" %}

## Commentary

- The 2023 ⟨Suwon Hwaseong Media Art⟩ is a public performance and exhibition festival utilizing the cultural heritage of Suwon Hwaseong Fortress, planned with the concept of "depicting the [Haenghaeng (royal procession)](https://encykorea.aks.ac.kr/Article/E0076462), where King Jeongjo, marching to Suwon Hwaseong, and the people welcoming him came together, using diverse modern lights."
- South Korean Treasure No. 1430, the ⟨Hwaseong Haenghaengdo (Screen of the Royal Procession to Hwaseong)⟩, is an 8-panel folding screen depicting [King Jeongjo's 1795 procession to Hwaseong](https://en.wikipedia.org/wiki/Hwaseong_Fortress#The_1795_Eight_Days_Parade), which was the grandest royal banquet of the Joseon Dynasty. Among these panels, the [⟨Deukjungjeong Eosado (The King Shooting Arrows at Deukjungjeong Pavilion)⟩](https://en.wikipedia.org/wiki/Hwaseong_Fortress#/media/File:Blue6-Haenghaeng-deugjungjeongeosa.jpg) served as the theme for this work.
- [The animation of this work](https://www.instagram.com/p/CySyq06LRCA/) expresses the Maehwapo at Deukjungjeong Pavilion depicted in ⟨Deukjungjeong Eosado⟩ as a Korean painting animation using mother-of-pearl textures. The interactive animation, where fireworks explode in response to the approach of visitors, recreates the custom of Maehwapo, where everyone gathered together in the plaza to enjoy, as depicted in the original painting.

{% include scroll_gallery.html images="
  https://upload.wikimedia.org/wikipedia/commons/e/ea/Blue6-Haenghaeng-deugjungjeongeosa.jpg |
  ⟨Deukjungjeong Eosado⟩ depicting Maehwapo
  |||||
  ../../../assets/images/works/suwonhwaseong/IMG_5381.jpeg |
  During the LED cube installation
" %}

## Technology

- For the interactive CG system that plays the Maehwapo animation in response to visitors approaching the LED cube, four webcams and [Processing] were used, with one webcam installed at the top of each of the four side panels of the LED cube. The [Processing] sketch processes the webcam images to detect the movements of visitors within the frame and plays the Maehwapo animation in response.

## External Links

- [Instagram - Artist Hyekang - Artwork introduction post](https://www.instagram.com/p/CyP-OaOLp6w)
- [YouTube - Suwon Culture & Tourism TV - Event trailer](https://youtu.be/SvUiZ4-Wfps)
- [YouTube - Suwon Culture & Tourism TV - Event highlights](https://youtu.be/kyW14W-CWt8)
- [Suwon Hwaseong Tourism Website - Event introduction](https://www.visitsuwon.or.kr/base/board/read?boardManagementNo=12&boardNo=301&searchCategory=&page=1&searchType=&searchWord=&menuLevel=3&menuNo=38)
- [Suwon Cultural Foundation Press Release](https://www.swcf.or.kr/?p=120&viewMode=view&idx=53614)
- [Suwon Special City Press Release](https://www.suwon.go.kr/web/board/BD_board.view.do?bbsCd=1043&seq=20231010101202464)
- [Suwon Special City Official Blog](https://blog.naver.com/suwonloves/223227677322)
- [Gyeonggi Shinmun Article](https://www.kgnews.co.kr/news/article.html?no=769353)
- [Woorimunhwa Shinmun Article](https://www.koya-culture.com/news/article.html?no=142482)

---

[^1]: A type of firework from the Joseon Dynasty. The name implies that it explodes and blooms in the shape of plum blossoms (Maehwa).

[^2]: An illustrator who draws traditional Korean paintings in digital format. ([Instagram](https://www.instagram.com/hyyekang))

[Processing]: https://processing.org/
