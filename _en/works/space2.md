---
title: Space#2
parent: Selected works
layout: default
nav_order: -2021.1209
---

<!-- prettier-ignore-start -->

# Space#2
{: .no_toc }

Beneath the ground, underwater, there is another me.
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

## Basic Information

<dl>
  <dt>Format</dt>
  <dd>
    <dl>
      <dt>Genre</dt>
      <dd>Interactive video installation</dd>
      <dt>Composition</dt>
      <dd>
        Interactive CG rendering system reflecting motion/depth sensor data and interactive video projection on the darkroom floor by a projector
      </dd>
    </dl>
  </dd>
  <dt>Creators</dt>
  <dd>
    <dl>
      <dt>Direction,<br />Programming</dt>
      <dd>random-entity</dd>
      <dt>Staff</dt>
      <dd>Junyoung Kim, Hojeong Lee</dd>
    </dl>
  </dd>
  <dt>Release</dt>
  <dd>
    <dl>
      <dt>Exhibition</dt>
      <dd><span markdown="1">
        [SNU Design Week](https://snudesignweek.com/)[^1] 2021 (Seoul National University College of Fine Arts, Department of Design Graduation Exhibition)
      </span></dd>
      <dt>Web</dt>
      <dd>
        <dl>
          <dt>Demo Video</dt>
          <dd><span markdown="1">
            [YouTube - 1st person POV viewing video](https://youtu.be/ftJX44qtPxQ)
          </span></dd>
        </dl>
      </dd>
    </dl>
  </dd>
  <dt>Source Code</dt>
  <dd><span markdown="1">
    [GitHub (excluding high-capacity assets)](https://github.com/random-entity/o.art.space2), [Google Drive (including all assets)](https://drive.google.com/file/d/112Rpy9AwwKdn4x6iE0SvC2Z2Ior7JZGa)
  </span></dd>
</dl>

## Synopsis

- When the viewer enters the darkroom, a hole about 3 meters in diameter and depth is seen on the floor. The hole is filled with water, and the viewer sees themselves in the water. The viewer ends up looking down at their clone in the space beneath the floor from the real world above the floor.
- The projection video distorts in real-time in response to the viewer's movements, configured so that the space beneath the floor always appears three-dimensional from the viewer's perspective.
- When the viewer moves, waves ripple across the water's surface. Approaching the center of the hole, the viewer's clone in the water fragments and scatters, and each fragment transforms into a fish swimming around in the water.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ftJX44qtPxQ?si=QPL5JpZo8lpI7RE-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

{% include scroll_gallery.html images="
  ../../../assets/images/works/space2/space2_viewer-none.jpg |
  Inside the darkroom when there is no viewer
  |||||
  ../../../assets/images/works/space2/space2_viewer.jpg |
  When the viewer is at the center of the hole <br/> Compared to the previous photo, it can be seen that the video is distorted. It is distorted so that the space beneath the floor appears three-dimensional from the viewer's perspective.
  |||||
  ../../../assets/images/works/space2/space2_fish-walk.jpg |
  When the viewer approaches the center of the hole, the clone underwater fragments and scatters, and each fragment transforms into a fish.
  |||||
  ../../../assets/images/works/space2/space2_fish-stand.jpg |
  When the viewer stands exactly at the center of the hole, the fish reach their maximum size.
  |||||
  ../../../assets/images/works/space2/space2_matome.jpg |
  Collection of stills from the demo video above
  |||||
  ../../../assets/images/works/space2/space2_diagram_fixed-symmetry.png |
  Concept diagram (Illustration: Hojeong Lee)
" %}

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

- [Off-axis projection in Unity - Michel de Brisis](https://medium.com/try-creative-tech/off-axis-projection-in-unity-1572d826541e)
- [Cg Programming/Unity/Projection for Virtual Reality - Wikibooks](https://en.wikibooks.org/wiki/Cg_Programming/Unity/Projection_for_Virtual_Reality)
- [Generalized Perspective Projection - Robert Kooima](https://web.archive.org/web/20241230234113/http://160592857366.free.fr/joe/ebooks/ShareData/Generalized%20Perspective%20Projection.pdf)
- [Waves - Catlike Coding](https://catlikecoding.com/unity/tutorials/flow/waves/)
- [Kinect v2 のデプス画像をそのままの解像度で点群としてUnityで表示する - いずみはら あつし](https://izmiz.hateblo.jp/entry/2017/12/30/003542)
- [Point cloud rendering with Unity - Ahmad Erfani](https://bootcamp.uxdesign.cc/point-cloud-rendering-with-unity-1a07345eb27a)

## External Links

- [Vimeo - SNU Design - Exhibition introduction](https://vimeo.com/659521474#t=48.641)
- [Instagram - SNU Design Week - Artwork introduction](https://www.instagram.com/p/CXC3XytvUHL/)
- [Seoul National University College of Fine Arts Website - Graduation work information](https://art.snu.ac.kr/exgallery/%ea%b9%80%ed%83%9d%eb%af%bc-%eb%94%94%ec%9e%90%ec%9d%b8-%ed%95%99%ec%82%ac/)

---

[^1]: The website for the 2021 edition is currently inaccessible. [The cover screen of the "online exhibition website" at the time can be viewed via the Wayback Machine](https://web.archive.org/web/20220116184406/https://snudesignweek.com/).
