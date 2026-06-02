---
title: { en: "Birdwatcher", ko: "Birdwatcher", ja: "Birdwatcher" }
date: 2019-01-01
type: Module
genre: ["Synthesizer", "Generative music"]
tags: ["FM synthesis", "Random number generator"]
tools: ["Max/MSP"]
source: https://github.com/random-entity/o.mod.birdwatcher
---
::: en
[Video](https://youtu.be/l5oGVmwtssM)

- When the switch is turned on, the synthesizer is triggered at irregular time intervals, producing sound that lasts for about 0.5 to 4 seconds.
- It is a synthesizer where the oscillators of FM synthesis (composed of sine, saw, and square waveforms) are arranged in a 3x3 matrix (left side of the patch), with each oscillator acting as the modulator for the oscillators to its right and below.
- The envelope of each oscillator controls not only the amplitude of the oscillator but also the depth of the FM (frequency modulation). Therefore, the dynamics and timbre change together.
- An LFO matrix with a structure similar to the FM matrix (right side of the patch) also controls the modulation depth of each FM in the FM matrix.
- The envelopes of the FM oscillators and LFOs can be drawn by the user in the form of a breakpoint function and saved as presets.
- All other parameter values (rhythm, frequency ratios of the FM oscillators, mix gain of each FM oscillator's output, etc.) change randomly (gradually or abruptly) with each trigger.
- Due to the deeply layered modulation and parameter randomization, fragments of sound with unpredictable and complex timbres appear and disappear in an endless loop.
- Even if the listener loses interest in the repetition of similar sounds, if they wait a moment, an unexpected and interesting sound will emerge again. However, that sound will never repeat exactly the same way twice.
- This was considered similar to birdwatching—the activity of trying to capture the sight of a mysterious bird that is unpredictable but will appear at some moment—hence the name "Birdwatcher".
:::
::: ko
[Video](https://youtu.be/l5oGVmwtssM)

- 스위치를 켜면 불규칙한 시간 간격으로 신세사이저가 발동되어 0.5~4초 정도의 소리가 이어진다.
- FM 신세시스(frequency modulation synthesis)의 오실레이터들(sine, saw, square 파형으로 구성)을 3x3 행렬로 배치하여 (패치 왼쪽), 각 오실레이터가 그 오른쪽과 밑의 오실레이터의 모듈레이터가 되도록 한 신세사이저다.
- 각 오실레이더의 엔벨롭(envelope)는 오실레이터의 진폭(amplitude) 뿐만 아니라 FM(frequency modulation)의 정도(depth) 또한 조절한다. 따라서 다이나믹스와 음색이 같이 변화한다.
- FM 행렬과 유사한 구조의 LFO 행렬 (패치 오른쪽) 또한 FM 행렬의 각 FM의 정도(modulation depth)를 조절한다.
- FM 오실레이터 및 LFO의 엔벨롭은 유저가 breakpoint function 형식으로 그릴 수 있고, 프리셋으로서 저장할 수 있다.
- 그 외의 모든 파라미터(리듬, FM 오실레이터들의 주파수 비율, 각 FM 오실레이터 출력의 믹스 게인 등) 값은 각 발동마다 (서서히 혹은 급격하게) 랜덤하게 바뀐다.
- 겹겹이 쌓인 모듈레이션의 레이어와 파라미터 랜더마이제이션에 의해, 예측불가하고 복잡한 음색의 소리의 단편이 나타났다가 사라지기를 끝없이 반복한다.
- 비슷한 소리의 반복에 청자의 흥미가 떨어지더라도, 잠시 기다리고 있으면 다시 예상치 못 했던 흥미로운 소리가 나온다. 하지만 그 소리는 두 번 다시는 똑같이 반복되지 않는다.
- 이는 마치 예측불가하지만 어떤 순간에인가 나타날 신비로운 새의 모습을 포착하기 위한 야조 관찰 활동과 비슷하다고 여겨, "Birdwatcher"라는 이름을 붙였다.
:::
::: ja
[Video](https://youtu.be/l5oGVmwtssM)

- スイッチを入れると、不規則な時間間隔でシンセサイザーが発動し、0.5〜4秒ほどの音が続く。
- FMシンセシス（frequency modulation synthesis）のオシレーター群（sine、saw、square波形で構成）を3x3のマトリックス状に配置し（パッチ左側）、各オシレーターがその右および下のオシレーターのモジュレーターとなるようにしたシンセサイザーである。
- 各オシレーターのエンベロープ（envelope）は、オシレーターの振幅（amplitude）だけでなく、FM（frequency modulation）の深さ（depth）も制御する。したがって、ダイナミクスと音色が共に変化する。
- FMマトリックスと類似した構造のLFOマトリックス（パッチ右側）も、FMマトリックスの各FMの変調の深さ（modulation depth）を制御する。
- FMオシレーターおよびLFOのエンベロープは、ユーザーがブレークポイント関数（breakpoint function）の形式で描くことができ、プリセットとして保存できる。
- その他のすべてのパラメーター（リズム、FMオシレーターの周波数比、各FMオシレーター出力のミックスゲインなど）の値は、各発動ごとに（徐々に、あるいは急激に）ランダムに変化する。
- 幾重にも重なったモジュレーションのレイヤーとパラメーターのランダマイゼーションにより、予測不可能で複雑な音色の音の断片が現れては消えることを果てしなく繰り返す。
- 似たような音の繰り返しに聴取者が興味を失っても、しばらく待っていれば再び予想外の興味深い音が出てくる。しかし、その音が二度と同じように繰り返されることはない。
- これはまるで、予測不可能だがいつかの瞬間に現れる神秘的な鳥の姿を捉えるための野鳥観察活動に似ていると考え、「Birdwatcher」という名前を付けた。
:::
