---
title: Space#2
layout: default
parent: Works
nav_order: -2021.1209
---

<!-- prettier-ignore-start -->

# Space#2
{: .no_toc }

There is another self beneath the ground, underwater.
{: .fs-5 .fw-300 }

![](../../../assets/images/works/space2/space2_viewer.jpg)

Interactive video installation
{: .label }
Interactive CG
{: .label .label-green }
Off-axis projection
{: .label .label-green }
Point cloud
{: .label .label-green }
Motion sensor
{: .label .label-green }
Depth sensor
{: .label .label-green }
v2021-12-09
{: .label .label-purple }

## Table of Contents
{: .no_toc .text-delta }

- TOC
{:toc}

<!-- prettier-ignore-end -->

## Basic Information

<dl>
  <dt>Format</dt>
  <dd>Interactive video installation</dd>
  <dt>Technology Used</dt>
  <dd>
    <dl>
      <dt>Interactive CG,<br/>Off-axis projection,<br/>Point cloud</dt>
      <dd>Unity and its shader programming</dd>
      <dt>Motion/Depth sensor</dt>
      <dd>Kinect</dd>
    </dl>
  </dd>
  <dt>Creators</dt>
  <dd>
    <dl>
      <dt>Direction/Programming</dt>
      <dd>random-entity</dd>
      <dt>Staff</dt>
      <dd>Junyoung Kim, Hojung Lee</dd>
    </dl>
  </dd>
  <dt>Shown</dt>
  <dd>
    <dl>
      <dt>Exhibition</dt>
      <dd><a href="https://art.snu.ac.kr/exgallery/%ea%b9%80%ed%83%9d%eb%af%bc-%eb%94%94%ec%9e%90%ec%9d%b8-%ed%95%99%ec%82%ac/">SNU Design Week 2021 (Graduation Exhibition of Design Department, Seoul National University College of Fine Arts)</a> (<a href="https://www.instagram.com/p/CXC3XytvUHL/">Instagram</a>, <a href="https://vimeo.com/659521474#t=48.641">Vimeo</a>)</dd>
      <dt>Permanent</dt>
      <dd>
        <dl>
          <dt>Demo video</dt>
          <dd><a href="https://youtu.be/ftJX44qtPxQ">YouTube</a> (first-person viewing footage)</dd>
          <dt>Source code</dt>
          <dd><a href="https://github.com/random-entity/proj.art.space2">GitHub</a></dd>
        </dl>
      </dd>
    </dl>
  </dd>
</dl>

## Synopsis

- When the viewer enters the dark room, a hole about 3 meters in diameter and depth appears on the floor. The hole is filled with water, and beneath the surface, the viewer sees themself.
  The viewer looks down at their own clone inside the underground space from the reality above.
- The projected image reacts to the viewer’s movement and is distorted in realtime, ensuring that the underground space always appears stereoscopic from the viewer’s perspective.
- As the viewer moves, ripples spread across the water surface. When approaching the center of the hole, the underwater clone fragments and disperses, and each fragment transforms into a fish swimming around.

## Images

{% include scroll_gallery.html images="
  ../../../assets/images/works/space2/space2_diagram_fixed-symmetry.png |
  Concept diagram
  |||||
  ../../../assets/images/works/space2/space2_viewer-none.jpg |
  Interior of the dark room without a viewer
  |||||
  ../../../assets/images/works/space2/space2_viewer.jpg |
  When the viewer stands at the center of the hole <br/> Compared to the previous photo, the projection is visibly distorted. It is transformed so that the underground space appears stereoscopic from the viewer’s perspective.
  |||||
  ../../../assets/images/works/space2/space2_fish-walk.jpg |
  When the viewer approaches the center, the underwater clone fragments and each fragment transforms into a fish.
  |||||
  ../../../assets/images/works/space2/space2_fish-stand.jpg |
  When the viewer stands exactly at the center, the fish reach their maximum size.
  |||||
  ../../../assets/images/works/space2/space2_matome.jpg |
  Collection of stills from the aforementioned demo video
" %}

## Commentary

- This work is a space designed to evoke the sensation of psychological pressure and its release.
- The underground space functions as a virtual space reflecting the inner self. Although it shares the same body and coordinates with the reality above, it constructs a different surrounding environment.
- The sense of pressure is conveyed through the perception of the viewer’s clone trapped underwater in an enclosed space. The deep cylindrical hole carved into the ground and the rippling surface responding to the viewer’s motion enable this perception.
- The release of pressure is expressed through motion graphics in which the underwater clone fragments and transforms into a school of fish.
  For humans, water is a suffocating space, but for fish, it is a space of freedom.
  This transformation also evokes the cycle of life and death, where the body decomposes and returns to nature.
- The positions of the viewer and the underground clone maintain a constant height difference, while remaining symmetric around the center of the hole on the horizontal plane.
  (That is, if the viewer’s position is $$(x,y,z)$$, then the clone’s position is $$(-x,-y,z-h)$$ where $$h$$ is constant.)
  The only point where they overlap horizontally is the center of the hole ($$(x,y)=(0,0)$$), and approaching this point triggers the transformation motion graphics.
  This expresses the integration of the inner self through a return to nature.

## Technology

- A short-throw projector was used to project the image onto the floor.
- A dark room was built so that each viewer could enter in isolation, calmly experience the work, and clearly see the projection.
- Unity was used for interactive CG rendering.
- The underwater clone was created through point cloud rendering using depth data captured by Kinect.
- To ensure the underground space always appears stereoscopic from the viewer’s perspective even while moving, Kinect was used to track head position, combined with off-axis projection programming in Unity.
- [(Source Code)](https://github.com/random-entity/proj.art.space2)

### References
- [Off-axis projection in Unity - Michel de Brisis](https://medium.com/try-creative-tech/off-axis-projection-in-unity-1572d826541e)
- [Cg Programming/Unity/Projection for Virtual Reality](https://en.wikibooks.org/wiki/Cg_Programming/Unity/Projection_for_Virtual_Reality)
- [Generalized Perspective Projection - Robert Kooima](https://web.archive.org/web/20241230234113/http://160592857366.free.fr/joe/ebooks/ShareData/Generalized%20Perspective%20Projection.pdf)
