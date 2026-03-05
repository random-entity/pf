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
  <dt>소스 코드</dt>
  <dd><span markdown="1">
    [GitHub](https://github.com/random-entity/o.mod.birdwatcher)
  </span></dd>
</dl>

- 스위치를 켜면 불규칙한 시간 간격으로 신세사이저가 발동되어 0.5~4초 정도의 소리가 이어진다.
- FM 신세시스(frequency modulation synthesis)의 오실레이터들(sine, saw, square 파형으로 구성)을 3x3 행렬로 배치하여 (패치 왼쪽), 각 오실레이터가 그 오른쪽과 밑의 오실레이터의 모듈레이터가 되도록 한 신세사이저다.
- 각 오실레이더의 엔벨롭(envelope)는 오실레이터의 진폭(amplitude) 뿐만 아니라 FM(frequency modulation)의 정도(depth) 또한 조절한다. 따라서 다이나믹스와 음색이 같이 변화한다.
- FM 행렬과 유사한 구조의 LFO 행렬 (패치 오른쪽) 또한 FM 행렬의 각 FM의 정도(modulation depth)를 조절한다.
- FM 오실레이터 및 LFO의 엔벨롭은 유저가 breakpoint function 형식으로 그릴 수 있고, 프리셋으로서 저장할 수 있다.
- 그 외의 모든 파라미터(리듬, FM 오실레이터들의 주파수 비율, 각 FM 오실레이터 출력의 믹스 게인 등) 값은 각 발동마다 (서서히 혹은 급격하게) 랜덤하게 바뀐다.
- 겹겹이 쌓인 모듈레이션의 레이어와 파라미터 랜더마이제이션에 의해, 예측불가하고 복잡한 음색의 소리의 단편이 나타났다가 사라지기를 끝없이 반복한다.
- 비슷한 소리의 반복에 청자의 흥미가 떨어지더라도, 잠시 기다리고 있으면 다시 예상치 못 했던 흥미로운 소리가 나온다. 하지만 그 소리는 두 번 다시는 똑같이 반복되지 않는다.
- 이는 마치 예측불가하지만 어떤 순간에인가 나타날 신비로운 새의 모습을 포착하기 위한 야조 관찰 활동과 비슷하다고 여겨, "Birdwatcher"라는 이름을 붙였다.
