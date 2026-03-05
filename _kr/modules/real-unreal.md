---
title: 현실-비현실 연속체
parent: Modules
layout: default
---

# 현실-비현실 연속체

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
  <dt>소스 코드</dt>
  <dd><span markdown="1">
    [GitHub](https://github.com/random-entity/o.mod.real-unreal-continuum)
  </span></dd>
</dl>

- 입력 오디오 파일의 스펙트로그램을 기하학적으로 변형시킨 뒤, 그 변형된 결과를 스펙트로그램으로 하는 소리를 출력하는 오디오 이펙트.
  - 스펙트로그램의 변형은 주파수 축의 두 지점을 핸들로 하여, 핸들을 움직였을 때 각 구간(0부터 핸들1까지, 핸들1부터 핸들2까지, 핸들2부터 20kHz까지)이 원본으로부터 선형으로 늘어나거나 압축하는 방식이다.
- 본 패치에서 플레이어도 MIDI 신호 혹은 마우스로 두 핸들을 조작할 수 있고, 컴퓨터도 두 핸들을 랜덤하게 조작할 수 있다.
- 본 모듈을 이용한 2019년 퍼포먼스는 "컴퓨터의 랜덤한 핸들 조작을 상쇄하기 위해 퍼포머가 청각만을 이용해 핸들을 컴퓨터와 반대로 움직이려 한다"는 지시 하에 이루어졌다.
- 본 모듈은 '현실적인 소리'와 '비현실적인 소리' 사이의 연속적인 변환의 한 가지로서 고안되었고, 따라서 상기 퍼포먼스에서는 입력 오디오 파일로서 새들이 우는 숲 속에서 녹음된 소리를 사용했다.
