---
title: Space#1
parent: Selected works
layout: default
nav_order: -2021.1031
---

<!-- prettier-ignore-start -->

# Space#1
{: .no_toc }

Am I moving forward, or am I walking in place?
{: .fs-5 .fw-300 }

![](../../../assets/images/works/space1/demo-video-stills/main.png)

Video game
{: .label }
Interactive CG
{: .label .label-green }
Shader programming
{: .label .label-green }
Unity
{: .label .label-purple }
v2021-10-31
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
      <dd>Video game, Art game</dd>
      <dt>Composition</dt>
      <dd>
        1st-person POV video game running on PC, monitor, keyboard, and mouse;<br />Movement with Up/Down or W/S keys, gaze control with mouse
      </dd>
    </dl>
  </dd>
  <dt>Creators</dt>
  <dd>
    <dl>
      <dt>Direction,<br>Programming</dt>
      <dd>Random Entity</dd>
    </dl>
  </dd>
  <dt>Release</dt>
  <dd>
    <dl>
      <dt>Web</dt>
      <dd>
      <dl>
        <dt>Distribution</dt>
        <dd><a href="https://public-random-entities.itch.io/space1">itch.io</a></dd>
        <dt>Demo video</dt>
        <dd><a href="https://youtu.be/KZ1KfgGF4T0">YouTube</a></dd>
      </dl>
      </dd>
    </dl>
  </dd>
  <dt>Source Code</dt>
  <dd><a href="https://github.com/random-entity/o.art.space1">GitHub</a></dd>
</dl>

## Synopsis

- In the game world, the ground, the sky, a single straight path, and a rectangular building with its entrance door located ahead along the path can be seen.
- The player can move forward toward the building or backward in the opposite direction along the straight path using the Up/Down or W/S keys on the keyboard. The gaze direction follows the mouse. It uses the same controls as a typical FPS game, but there is no shooting, and movement is only possible in one dimension.
- As the player approaches the building, the visible size of the building grows, eventually covering the entire sky. Then, the rectangle that appeared to be the building's entrance door becomes a new building, and a rectangular entrance door appears in that new building again.
- Approaching that new building, it becomes the sky again, and its entrance door becomes a new building.
- As this process repeats, the colors of the sky, building, and door also cycle sequentially.
- A total of 4 phases cycle, and the color scheme of each phase corresponds to 6 AM, noon, 6 PM, and midnight, dividing a day into four.
- Even if the player moves backward, the phases only cycle in reverse order, but the structure remains the same.
- The player becomes forever trapped in a fractal space that appears finite but expands infinitely due to the similarity between the parts and the whole.

<iframe width="560" height="315" src="https://www.youtube.com/embed/KZ1KfgGF4T0?si=66SXqeOp1aMeS-ZY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

{% include scroll_gallery.html images="
  ../../../assets/images/works/space1/demo-video-stills/1.png |
  Noon phase
  |||||
  ../../../assets/images/works/space1/demo-video-stills/2.png |
  6 PM phase
  |||||
  ../../../assets/images/works/space1/demo-video-stills/3.png |
  Midnight phase
  |||||
  ../../../assets/images/works/space1/demo-video-stills/4.png |
  6 AM phase
  |||||
  ../../../assets/images/works/space1/hand-drawing.jpeg |
  Concept drawing
" %}

## Commentary

- This work implements the fractal/repetitive worldview frequently appearing in the author's (Random Entity's) works as a space within a game, allowing the player to independently explore its structure.
- The only building rising in the empty game world is perceived by the player as a 'destination'. However, as the player approaches the building, it transforms into an unreachable background (sky), and another 'destination' (building) hidden within it appears. This expresses that moving forward toward a goal leads directly to the creation of the next goal, transitioning to the same phase of the next stage.
- Thus, this work acts as a metaphor for humans constantly striving towards goals, and the structure of nature where all things return to a cycle of maintaining homeostasis, regardless of human goals or passing time.
- By using minimalist forms and flat coloring, the player is encouraged to focus on the structure of the space in the game itself rather than the details of each element.

## Technology

- To create a virtual environment that can be explored while moving through a special space from a first-person perspective, controls similar to an FPS game were chosen, and the game engine Unity and its shader programming were used for implementation.
- In reality, the player's position within the game world is fixed, but the player perceives that they are approaching the building as the mesh of the building object continuously deforms from a rectangle into a cylinder covering the sky. The continuous deformation of the mesh, as well as the blinking of windows and clouds, are implemented by shader programming, utilizing GPU resources.
- Rendering by "Unlit" material was used for flat coloring that makes the entire game world look as if it were made by cutting out colored paper.
