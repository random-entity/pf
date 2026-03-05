---
title: Ghost Theater "We Will Have a Serious Night" (Indoor Version)
parent: Selected works
layout: default
nav_order: -2022.0324
---

<!-- prettier-ignore-start -->

# Ghost Theater "We Will Have a Serious Night" (Indoor Version)
{: .no_toc }

A poem about humans and love sung by ghosts in the machine.
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

## Basic Information

<dl>
  <dt>Format</dt>
  <dd>
    <dl>
      <dt>Genre</dt>
      <dd>Interactive sound installation</dd>
      <dt>Composition</dt>
      <dd><span markdown="1">
        An interactive sound installation consisting of GLPS headphones[^1] worn by the listener, and 3D audio scenes placed in each of the "zones" marked by spotlights in the exhibition space.
      </span></dd>
    </dl>
  </dd>
  <dt>Creators</dt>
  <dd>
    <dl>
      <dt>Exhibitor</dt>
      <dd>Seoul Open Media<span markdown="1">[^2]</span> (Byungjun Kwon<span markdown="1">[^3]</span>, Juhong Baek, Random Entity)</dd>
      <dt>General Director,<br />Hardware Design,<br />Sound</dt>
      <dd>Byungjun Kwon</dd>
      <dt>Hardware Design</dt>
      <dd>Juhong Baek</dd>
      <dt>Software Development</dt>
      <dd>Random Entity</dd>
    </dl>
  </dd>
  <dt>Release</dt>
  <dd>
    <dl>
      <dt>Exhibition</dt>
      <dd><span markdown="1">
        [Seoul National University Museum of Art ⟨Turing Test: AI's Declaration of Love⟩](http://www.snumoa.org/exhibitions_view.php?exh_id=151) (2022)
      </span></dd>
    </dl>
  </dd>
  <dt>Source Code</dt>
  <dd><span markdown="1">
      [GitHub - Scope in charge of the author (Random Entity)](https://github.com/random-entity/o.art.ghost-theater-snumoa)
  </span></dd>
</dl>

## Synopsis

- Visitors entering the exhibition space wear GLPS headphones[^1].
- When a listener enters a "zone" marked by a spotlight on the floor of the exhibition space, AR (augmented reality) 3D audio is played, making them feel as if they have entered a scene in a virtual acoustic space surrounding that zone. A different "play" unfolds in each "zone".
- The sound sources include voice narrations by voice actors performing a play written by artist Byungjun Kwon together with an AI, as well as sounds and music composed by artist Byungjun Kwon as a sound artist, musician, and electronic musical instrument researcher.
- When the listener is not inside a "zone," a bell sound rings from the nearest "zone" to guide them toward it.
- The listener appreciates the songs of the "Ghost Theater," which are invisible in the physical exhibition space, within the AR acoustic zones unfolded by the GLPS headphones.

{% include scroll_gallery.html images="
  ../../../assets/images/works/ghost-theater/exhibition_1.jpg |
  GLPS headphones hanging on the wall of the exhibition space
  |||||
  ../../../assets/images/works/ghost-theater/exhibition_2.jpg |
  Each “zone” is indicated by a bright circular spotlight on the floor of the exhibition space.
  |||||
  ../../../assets/images/works/ghost-theater/listening.jpg |
  Listening inside a “zone”
  |||||
  ../../../assets/images/works/ghost-theater/som.jpg |
  During exhibition installation
" %}

## Commentary

- This work is an indoor version of the piece [⟨Ghost Theater "We Will Have a Serious Night"⟩](https://byungjun.pe.kr/works/we-will-have-a-serious-night), which artist Byungjun Kwon had previously directed as an outdoor work, compressed and exhibited inside the Seoul National University Museum of Art. In order to reconstruct the plays and songs of the robots that unfolded in various outdoor locations—such as Hanok villages or farming communities—within an indoor museum exhibition space, a real-time 3D audio effect function was added to the GLPS headphone[^1] version developed for this indoor port. This function makes listeners perceive themselves as being inside a virtual acoustic space. By doing so, it overlays another "ghost-like" acoustic space layer that hides within the real space where other works in the same exhibition are displayed.

## Technology

### Overview

- The GLPS headphones[^1] recognize the listener's location and head orientation, and based on that data, output sound processed with real-time 3D audio effects.

### Details

- Hardware of the GLPS headphones:
  - The GLPS headphones are made by additionally attaching a PCB with a [PJRC Teensy] as a microprocessor to the electronic circuit of off-the-shelf headphones.
  - An IMU sensor ([Adafruit BNO055]) was used to recognize the head orientation of the listener wearing the GLPS headphones.
  - A custom LPS system ([DW1000], etc.) was used to recognize the location of the GLPS headphones within the exhibition space. The LPS system measures the distance from the LPS module board ([DW1000]) embedded in the GLPS headphones to LPS module boards ([DW1000]) installed at 3 fixed points (anchors) in the exhibition space, calculating the listener's location through trilateration.
  - A microSD card was used to store and load sound source audio files.
- **Software of the GLPS headphones**:
  - Based on the location information obtained from the LPS system, if the listener is not in any "zone," a bell sound is played, and if they are in a "zone," the audio fitting for that "zone" is played.
  - To create a 3D audio effect based on the listener's head orientation obtained from the IMU sensor, audio signal processing was programmed to decode audio signals in the [Ambisonics] format according to the orientation, or to pan multiple mono audios so they sound like point sound sources distributed at specific locations.
  - The program performing the above functions was written in C++ utilizing the [Teensy SDK] and [Teensy Audio SDK], and was uploaded to the [Teensy] of the GLPS headphones' embedded system.

### Scope in charge of the author (Random Entity)

- The part the author (Random Entity) was in charge of is the software development for the embedded system of the GLPS headphones [(Source Code)](https://github.com/random-entity/o.art.ghost-theater-snumoa).
- The root items in the list in the Details section that the author was in charge of are marked in **bold text**.

## External Links

- [YouTube - Seoul Council of Art Museums - Exhibition Introduction Video](https://youtu.be/euUhxTG8qOQ)
- [Artist Byungjun Kwon's Website - Ghost Theater "We Will Have a Serious Night" (Hongdong Reservoir)](https://byungjun.pe.kr/works/we-will-have-a-serious-night)

---

[^1]: Specially modified headphones used in many works by Byungjun Kwon/Seoul Open Media. They operate using a PJRC Teensy microcontroller and a GPS or LPS (local positioning system) module within the embedded system, with parts added and software programmed to suit the purpose of each work.

[^2]: A media art production team led by artist Byungjun Kwon.

[^3]: (1971–) A Korean contemporary artist who uses sound, robots, performances, etc., as media. Winner of the "Korea Artist Prize 2023" from the National Museum of Modern and Contemporary Art, Korea. (Reference: [Artist Website](https://byungjun.pe.kr/))

[PJRC Teensy]: https://www.pjrc.com/teensy-4-0/
[Teensy]: https://www.pjrc.com/teensy-4-0/
[Adafruit BNO055]: https://learn.adafruit.com/adafruit-bno055-absolute-orientation-sensor/overview
[DW1000]: https://www.qorvo.com/products/p/DW1000
[Ambisonics]: https://en.wikipedia.org/wiki/Ambisonics
[Teensy SDK]: https://www.pjrc.com/teensy/td_download.html
[Teensy Audio SDK]: https://github.com/PaulStoffregen/Audio
