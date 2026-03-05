---
title: "Real-unreal continuum"
parent: Modules
layout: default
---

# Real-unreal continuum

<iframe width="560" height="315" src="https://www.youtube.com/embed/YdwL-U4VsLM?si=qiSaCvdrbkYXpo5U" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Audio effect
{: .label }
Spectral warping
{: .label .label-green }
FFT
{: .label .label-green }
Max/MSP
{: .label .label-purple }
v2019
{: .label .label-yellow }

<dl>
  <dt>Source Code</dt>
  <dd><span markdown="1">
    [GitHub](https://github.com/random-entity/o.mod.real-unreal-continuum)
  </span></dd>
</dl>

- An audio effect that geometrically warps the spectrogram of an input audio file and then outputs sound using the warped result as its spectrogram.
  - The warping of the spectrogram uses two points on the frequency axis as handles; when the handles are moved, each section (from 0 to handle 1, from handle 1 to handle 2, from handle 2 to 20kHz) linearly expands or compresses from the original.
- In this patch, the player can also manipulate the two handles with MIDI signals or a mouse, and the computer can also manipulate the two handles randomly.
- A 2019 performance using this module was conducted under the instruction: "To counteract the computer's random handle manipulations, the performer attempts to move the handles in the opposite direction of the computer using only their sense of hearing."
- This module was devised as a type of continuous transformation between 'realistic sounds' and 'unrealistic sounds', and therefore, in the aforementioned performance, sounds recorded in a forest with birds singing were used as the input audio file.
