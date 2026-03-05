---
title: 새떼의 소리
parent: Modules
layout: default
---

# 새떼의 소리

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
  <dt>소스 코드</dt>
  <dd><span markdown="1">
    [GitHub](https://github.com/random-entity/o.mod.flocking-sound_processing)
  </span></dd>
  <dt>근간 코드</dt>
  <dd><span markdown="1">
    ["Flocking" by Daniel Shiffman](https://processing.org/examples/flocking.html)
  </span></dd>
</dl>

- Craig Reynolds의 ["Boids" 알고리즘](https://en.wikipedia.org/wiki/Boids)을 프로그래밍 한 [Daniel Shiffman의 Processing 스케치](https://processing.org/examples/flocking.html)에, 사운드 모듈과 GUI를 통한 알고리즘 파라미터 조작 기능을 추가하여 만든 명상 음악 생성기이자 신세사이저다.
- 각 "Boid"에는 사인파 오실레이터가 장착되고, 그 주파수는 Boid의 방향에 의해 결정된다. 주파수는 모드 선택에 따라 연속적인 값을 가질 수도, 특정 스케일의 이산적인 값을 가질 수도 있다.
  - 상세한 내용은 [README](https://github.com/random-entity/o.mod.flocking-sound_processing?tab=readme-ov-file#how-it-works-and-how-to-use) 참조.
- 수많은 사인파의 합에 의해 이루어진다는 점에서 똑같지는 않지만 additive synthesis의 면모를, 작은 요소가 집합체를 이루어 소리를 낸다는 점에서 똑같지는 않지만 granular synthesis의 면모를, 그리고 이산 주파수 모드에서는 창발적 알고리즘에 의해 화성이 진행되는 거대 폴리포닉 음악의 면모를 갖는다고 할 수 있다.
