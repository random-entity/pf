title: Flocking sound
parent: Modules
layout: default

---

# Flocking sound

<iframe width="560" height="315" src="https://www.youtube.com/embed/MBg5GFYua7Y?si=9GWY-AjQ1KuQfXDa" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Synthesizer
{: .label }
Generative music
{: .label }
Additive synthesis
{: .label .label-green }
Boids
{: .label .label-green }
Artificial life
{: .label .label-green }
Automata
{: .label .label-green }
Processing
{: .label .label-purple }
v2025-09-29
{: .label .label-yellow }

<dl>
  <dt>Source Code</dt>
  <dd><span markdown="1">
    [GitHub](https://github.com/random-entity/o.mod.flocking-sound_processing)
  </span></dd>
  <dt>Base Code</dt>
  <dd><span markdown="1">
    ["Flocking" by Daniel Shiffman](https://processing.org/examples/flocking.html)
  </span></dd>
</dl>

- It is a meditation music generator and synthesizer created by adding a sound module and algorithm parameter control functions via GUI to Daniel Shiffman's Processing sketch, which programmed Craig Reynolds' "Boids" algorithm.
- Each "Boid" is equipped with a sine wave oscillator, and its frequency is determined by the Boid's heading (direction). Depending on the mode selection, the frequency can have continuous values or discrete values of a specific scale.
  - For details, refer to the [README](https://github.com/random-entity/o.mod.flocking-sound_processing?tab=readme-ov-file#how-it-works-and-how-to-use).
- It can be said to have aspects of additive synthesis in that it is composed of the sum of numerous sine waves (though not exactly the same), aspects of granular synthesis in that small elements form an aggregate to produce sound (though not exactly the same), and in discrete frequency mode, aspects of massive polyphonic music where harmony progresses by an emergent algorithm.
