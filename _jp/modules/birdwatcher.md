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
  <dt>ソースコード</dt>
  <dd><span markdown="1">
    [GitHub](https://github.com/random-entity/o.mod.birdwatcher)
  </span></dd>
</dl>

- スイッチを入れると、不規則な時間間隔でシンセサイザーが発動し、0.5〜4秒ほどの音が続く。
- FMシンセシス（frequency modulation synthesis）のオシレーター群（sine、saw、square波形で構成）を3x3のマトリックス状に配置し（パッチ左側）、各オシレーターがその右および下のオシレーターのモジュレーターとなるようにしたシンセサイザーである。
- 各オシレーターのエンベロープ（envelope）は、オシレーターの振幅（amplitude）だけでなく、FM（frequency modulation）の深さ（depth）も制御する。したがって、ダイナミクスと音色が共に変化する。
- FMマトリックスと類似した構造のLFOマトリックス（パッチ右側）も、FMマトリックスの各FMの変調の深さ（modulation depth）を制御する。
- FMオシレーターおよびLFOのエンベロープは、ユーザーがブレークポイント関数（breakpoint function）の形式で描くことができ、プリセットとして保存できる。
- その他のすべてのパラメーター（リズム、FMオシレーターの周波数比、各FMオシレーター出力のミックスゲインなど）の値は、各発動ごとに（徐々に、あるいは急激に）ランダムに変化する。
- 幾重にも重なったモジュレーションのレイヤーとパラメーターのランダマイゼーションにより、予測不可能で複雑な音色の音の断片が現れては消えることを果てしなく繰り返す。
- 似たような音の繰り返しに聴取者が興味を失っても、しばらく待っていれば再び予想外の興味深い音が出てくる。しかし、その音が二度と同じように繰り返されることはない。
- これはまるで、予測不可能だがいつかの瞬間に現れる神秘的な鳥の姿を捉えるための野鳥観察活動に似ていると考え、「Birdwatcher」という名前を付けた。
