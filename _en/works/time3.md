---
title: Time#3
parent: Selected works
layout: default
nav_order: -2021.102501
---

<!-- prettier-ignore-start -->

# Time#3
{: .no_toc }

The present and the past overlap, and that overlap overlaps again with the future.
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

## Basic Information

<dl>
  <dt>Format</dt>
  <dd>
    <dl>
      <dt>Genre</dt>
      <dd>Interactive video installation</dd>
      <dt>Composition</dt>
      <dd>
        Interactive video projection created by feedback between the projection and a CG system that processes real-time image input from a camera
      </dd>
    </dl>
  </dd>
  <dt>Creators</dt>
  <dd>
    <dl>
      <dt>Exhibitor</dt>
      <dd>Random Entity (team) (random-entity, Hojeong Lee, Minki Cho)</dd>
      <dt>Direction,<br />Programming</dt>
      <dd>random-entity</dd>
      <dt>Staff</dt>
      <dd>Hojeong Lee, Minki Cho</dd>
    </dl>
  </dd>
  <dt>Release</dt>
  <dd>
    <dl>
      <dt>Exhibition</dt>
      <dd><span markdown="1">
        [2021 Seoul National University Art Week: ArtSpace@SNU 2021](https://art.snu.ac.kr/notice/2021-%EC%98%88%EC%88%A0%EC%A3%BC%EA%B0%84-art-spacesnu-%ED%96%89%EC%82%AC-%EC%95%8C%EB%A6%BC/)
      </span></dd>
      <dt>Web</dt>
      <dd>
        <dl>
          <dt>Online exhibition stream</dt>
          <dd><span markdown="1">
            [YouTube](https://youtube.com/playlist?list=PLHd0nQV4yFCttLpyaW8WxbNHLY5K0mgyV&si=C2fMDkA4e8AyUCpZ)
          </span></dd>
        </dl>
      </dd>
    </dl>
  </dd>
  <dt>Source Code</dt>
  <dd><a href="https://github.com/random-entity/o.art.time3">GitHub</a></dd>
</dl>

## Synopsis

- This work was installed on a stairway landing in a public space. The viewer passes between the projection on the wall and the camera on the opposite side. Then, on the wall projection, they see their own image and its echo leading to a cascading video within a video within a video... created by feedback.
- That image appears once again inside the video within the video about 10 seconds later (around the time the viewer goes up or down the stairs and reaches a position where they can see that wall again). It appears in the video within it 20 seconds later, and in the video within that 30 seconds later, repeating this process while fading away like an illusion.
- If one spends more than 10 seconds on the landing, they can experience a bizarre temporal sensation where the present and past overlap, and layers of different times become dizzily intertwined.

<iframe width="560" height="315" src="https://www.youtube.com/embed/D_rsLAvh-H0?si=NczS3TUO8Mb17WaG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Commentary

- This work implements "the past existing like an illusion even within the present" as a video installation artwork.
- Basically, this work is a feedback system that films the wall projection with a camera and projects it back onto the wall, but the video projected on the wall is the average (sum divided by 2) of the current video and the video from 10 seconds ago. As a result, the effect caused by momentary feedback acts like audio reverberation, and the average effect with the past added to the result acts like audio delay. The viewer sees a video where 1/2 of the present, 1/4 of 10 seconds ago, 1/8 of 20 seconds ago, 1/16 of 30 seconds ago, etc., are overlapped.
- By doing so, it implements a video where not only do the present and past overlap in one image, but that overlap itself is repeated again in the future.
- Roughly expressing what this system does as a mathematical formula is as follows. ($$p$$is the projection video,$$c$$is the camera video,$$s$$is the scale down and degradation transformation that converts the original projection video into the video captured by the camera, and$$\oplus r$$ represents the video being overwritten by real objects such as the viewer.)

$$p(t) = \frac{c(t-\epsilon) + c(t-\epsilon-d)}{2}$$

$$c(t) = s(p(t-\epsilon')) \oplus r(t)$$

<iframe width="560" height="315" src="https://www.youtube.com/embed/j2dVTcLCedA?si=vi41cvz9uFctsTUG" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Technology

- A short-throw projector was used to project the video close to the wall so that the image would not be obstructed even if viewers pass by in the space between the camera and the projection wall.
- [EOS Camera Utility](https://www.usa.canon.com/support/eos-utilities) was used to input the video filmed by the camera to the PC in real-time.
- [TouchDesigner](https://derivative.ca/UserGuide/TouchDesigner) was used to real-time render the projection image with the average effect applied.

{% include scroll_gallery.html images="
  ../../../assets/images/works/time3/v.jpg |
  During artwork installation. The person in the center of the projection image is the 10-second past of the person who took this photo.
" %}

## External Links

- [YouTube - ArtSpace@SNU - Artwork introduction](https://youtu.be/j2dVTcLCedA)
- [Instagram - ArtSpace@SNU - Artwork introduction](https://www.instagram.com/tv/CV4RdUsMEr2/)
- [Facebook - ArtSpace@SNU](https://www.facebook.com/snuartspace)
