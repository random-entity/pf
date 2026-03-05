---
title: Birdwatcher
parent: Modules
layout: default
---

# Birdwatcher

<iframe width="560" height="315" src="https://www.youtube.com/embed/l5oGVmwtssM?si=Xx2ratTtwYOxAqnB" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Synthesizer
{: .label }
Generative music
{: .label }
FM synthesis
{: .label .label-green }
Random number generator
{: .label .label-green }
Max/MSP
{: .label .label-purple }
v2019
{: .label .label-yellow }

<dl>
  <dt>Source Code</dt>
  <dd><span markdown="1">
    [GitHub](https://github.com/random-entity/o.mod.birdwatcher)
  </span></dd>
</dl>

- When the switch is turned on, the synthesizer is triggered at irregular time intervals, producing sound that lasts for about 0.5 to 4 seconds.
- It is a synthesizer where the oscillators of FM synthesis (composed of sine, saw, and square waveforms) are arranged in a 3x3 matrix (left side of the patch), with each oscillator acting as the modulator for the oscillators to its right and below.
- The envelope of each oscillator controls not only the amplitude of the oscillator but also the depth of the FM (frequency modulation). Therefore, the dynamics and timbre change together.
- An LFO matrix with a structure similar to the FM matrix (right side of the patch) also controls the modulation depth of each FM in the FM matrix.
- The envelopes of the FM oscillators and LFOs can be drawn by the user in the form of a breakpoint function and saved as presets.
- All other parameter values (rhythm, frequency ratios of the FM oscillators, mix gain of each FM oscillator's output, etc.) change randomly (gradually or abruptly) with each trigger.
- Due to the deeply layered modulation and parameter randomization, fragments of sound with unpredictable and complex timbres appear and disappear in an endless loop.
- Even if the listener loses interest in the repetition of similar sounds, if they wait a moment, an unexpected and interesting sound will emerge again. However, that sound will never repeat exactly the same way twice.
- This was considered similar to birdwatching—the activity of trying to capture the sight of a mysterious bird that is unpredictable but will appear at some moment—hence the name "Birdwatcher".
