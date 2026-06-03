---
title: { en: "The Lessons of Shin Myung-Sook", ko: "신명숙의 가르침", ja: "シン・ミョンスクの教え" }
tagline:
  en: "The gestures of a traditional music master revived through humanoid mediumship, and its mechanical limitations."
  ko: "휴머노이드 영매술로 되살린 전통 음악 명인의 몸짓과 그 기계적 한계."
  ja: "ヒューマノイドの降霊術で蘇らせた伝統音楽の名人の身振りと、その機械的限界。"
releases:
  - { "2024 Gwangju Biennale Symposium": "2024-09-07" }
  - { "Forum IMPACT 2024 – Théâtre de Liège": "2024-11-14" }
type: Group work
genre: ["Robot dance", "Mechanical theater", "Stage performance"]
tags: ["Physical computing", "Servomotor", "Differential joint", "UDP network", "3D printing", "Video feedback"]
tools: ["mjbots moteus", "Raspberry Pi", "C++", "Pure Data"]
source: "[GitHub](https://github.com/random-entity/o.art.gf3)"
---
::: en
![](images/works/gf3/live-stills/3.jpg)

## Basic information

- **Format**
  - Genre: Robot dance, Robot performance
  - Composition: 1 GF3[^1] unit, real-time wired robot control system, robot choreography data, voice interview and musical sound recording of Shin Myung-sook[^2], video projection, and an approx. 10-minute robot performance based on video feedback
- **Creators**
  - Exhibitor: Byungjun Kwon[^3]
  - General Director, Hardware Design, Sound: Byungjun Kwon
  - Robot Choreography: Yoojin Lee
  - Robot Design, Robot Maintenance: Jumi Lee
  - Software Development, Robot Operation: random-entity
  - Staff: Minho Lee, Garam Choi
- **Release**
  - Performance: [2024 Gwangju Biennale Symposium ⟨New Echoes: Art and Technology in the Anthropocene Epoch⟩](https://www.gwangjubiennale.org/gb/Board/11766/detailView.do)
  - Exhibition: [Forum IMPACT 2024 - Théâtre de Liège (Belgium)](https://theatredeliege.be/en/evenement/on-the-birds-day-2/)[^4]
  - Web: [YouTube - Gwangju Biennale Foundation - Performance recording](https://youtu.be/vXlX81ujGVM)
- **Source code**: [GitHub - Scope in charge of the author (random-entity)](https://github.com/random-entity/o.art.gf3)

## Synopsis

### Gwangju Biennale Symposium Performance

- A 2002 voice interview recording of the late Gayageum Sanjo master Shin Myung-sook[^2], who passed away in 2018, plays through the auditorium speakers. The interview details how she learned to play the gayageum from her master as a child, the differences between Western musical notation and traditional oral/aural transmission methods, and the negative impact this difference has on modern performers.
- Standing on the auditorium stage, the upper-body humanoid GF3[^1] makes gestures as if it were speaking the interview, acting as if it has become Master Shin Myung-sook herself.
- After the interview scene ends, GF3 begins to dance to the gayageum music played and sung by Master Shin Myung-sook. Video feedback of the scene is projected onto the auditorium screen in real-time.
- As the dance progresses into intense movements, GF3's internal parts break down, and its body movements become tangled and deadlocked. Eventually, the power turns off, and the performance concludes.

[Performance recording](https://youtu.be/vXlX81ujGVM)

### Forum IMPACT 2024 Exhibition

- Excluding the "shutdown due to breakdown and deadlock" segment, GF3's dance movements were exhibited at the ⟨On The Birds' Day / Byungjun Kwon Solo Exhibition⟩ during Forum IMPACT 2024, alongside various other dancing robot works created by artist Byungjun Kwon.

![](images/works/gf3/live-stills/IMG_2964.jpeg)
*Forum IMPACT exhibition installation in progress*

![](images/works/gf3/live-stills/IMG_2968_still.jpg)
*Forum IMPACT exhibition*

## Commentary

- Artist Byungjun Kwon has been creating handmade robot works that reflect the social role of robots as human companions or as alienated beings. The unstable, trembling movements that emerge precisely because these robots are made by human hands—rather than being precise industrial robots—hold the power to subvert conventional ideas about the relationship between humans and robots.
- GF3[^1] is the most human-like among the robots developed by Kwon's team. Its role in this work was as a medium for a traditional music master, someone who is being forgotten in modern society due to technological advancement and globalization. The status of the handmade robot GF3, an alienated existence in a society of modern robots boasting high technology, mirrors that of the traditional music master. For a brief moment, GF3 becomes Master Shin Myung-sook[^2], regurgitating the critique that the original sound and spirit of Gayageum Sanjo are disappearing due to the universalization of Western musical notation, and then dances to her playing and singing.
- Unlike industrial robots that remain intact even after repeating the same movement tens of thousands of times, GF3, which contains many 3D-printed parts, is not robust and wears out easily. However, that non-mechanical nature is GF3's essence. Even so, the production team did not intend for GF3 to break down during the performance at the Gwangju Biennale Symposium. On the contrary, numerous tests and improvements were made beforehand to ensure GF3 would finish the performance without breaking down. When GF3 broke down during the performance, the author (random-entity) was personally disappointed, but it also became a positive outcome in that it could be interpreted as expressing the mechanical limitations of the mediumship meant to revive a traditional music master through a machine. At Forum IMPACT about two months later, an upgraded version with improved mechanical stability was operated, allowing GF3's movements to be exhibited for over a week without major breakdowns.

## Technology

### Overview

- GF3 is moved by servomotor control.
- The Commander system issues choreography instructions to GF3, and the Monitor system receives status reports from GF3 and displays them visually.
- The Sensor system recognizes the gear output angular position of each joint, motor temperature, and more.
- The Wired communication system allows GF3, the sensor system, and the commander/monitor systems to exchange information.
- GF3 receives choreography instructions from the Commander system, physically executes the algorithm of the choreography, and prioritizes handling any malfunctions when they occur.

### Details

- GF3's[^1] mechanical engineering structure:
  - For the joints mounted on GF3's neck, shoulders, and elbows, gears succeeding the "differential joint" previously developed and used by Byungjun Kwon's team were used. A "differential joint" is an application of a [differential structure](<https://en.wikipedia.org/wiki/Differential_(mechanical_device)>) that implements a 2-DOF joint through a combination of two opposing servomotors. In addition to the differential joint, a separate servomotor and standard gear were added to the shoulder to enable 3-DOF movement. [mjbots mj5208](https://mjbots.com/products/mj5208) and [mjbots moteus](https://mjbots.com/products/moteus-r4-11) were used as the servomotors and controllers to move the above joints.
  - A standard gear was used for the wrist joint to implement a 1-DOF joint with one servomotor.
  - The fingers are moved by winding or unwinding wires connected between each fingertip of the 3D-printed hand and five small servomotors mounted on the back of the hand, allowing the joints to bend flexibly.
  - The entire body of GF3 was designed to be assembled from 3D-printed parts as well as metal/electrical/electronic components.
- **GF3's operation algorithm**:
  - All of GF3's movements are reduced to a sequence of "poses." A "pose" is a combination of the angular positions of each rotation axis of each joint from its zero point. GF3 executes a "pose command" by adjusting the angular position of every rotation axis from the current pose to the target pose.
  - The speed at which each servomotor must rotate to reach the target angular position based on the gear output is calculated based on the internal properties of each gear.
- **Sensor system**:
  - Magnets and external encoders mounted on the gear output rotation axis were used so that choreography could be planned and poses commanded based on the gear output.
  - Values provided by the [mjbots moteus SDK](https://github.com/mjbots/moteus/tree/main/lib/cpp/mjbots/moteus) were used to monitor in real-time states that cause failures, such as servomotor overheating or wiring disconnection.
- **Commander/Monitor system and Wired communication system**:
  - Because GF3 was designed as a robot performing alone on stage, a commander/monitor system was needed to remotely transmit commands to GF3 and monitor its status.
  - A [Pure Data](https://puredata.info/) patch (including custom objects written in C) supporting real-time control via GUI was used as the commander/monitor system.
  - A UDP network was used as the wired communication system between the commander/monitor system and GF3's embedded system.
- GF3's embedded system (Hardware):
  - A Raspberry Pi attached to GF3's back was used to comprehensively manage communication with the 14 [mjbots moteus](https://mjbots.com/products/moteus-r4-11) servomotor controllers mounted on GF3, 2 microcontrollers controlling the 5 small servomotors mounted on both hands, and the commander/monitor system.
- **GF3's embedded system (Software)**:
  - A C++ script was written to allow the aforementioned Raspberry Pi to drive GF3 while communicating with all servomotor controllers, microcontrollers, and the commander/monitor system.
- Choreography:
  - The choreographer's role was to compose the sequence of poses that GF3 would perform during the 10-minute performance time. The choreography composition process was carried out by saving each pose as a "pose preset" and saving the time intervals between consecutive pose presets as a "pose sequence."
- Performance cues:
  - A [Pure Data](https://puredata.info/) patch that manages the cues for the entire performance was used to pre-designate the timing for sound, video projections such as subtitles or camera screens on the screen, and the start and end times of each of GF3's movements.
- **Real-time robot operation**:
  - An operator personnel was needed to control the robot in real-time from behind the stage to monitor system failures such as servomotor overheating or wiring disconnections, and to improvise when GF3 became unable to operate.

### Scope in charge of the author (random-entity)

- The parts handled by the author (random-entity) are the GF3 operation algorithm logic, the software development of all the aforementioned electronic systems (communication system, commander/monitor system, GF3's embedded system) [(Source Code)](https://github.com/random-entity/o.art.gf3), and the real-time robot operation during the performance.
- The root items in the list in the Details section that the author was in charge of are marked in **bold text**.

## External links

- [Artist Byungjun Kwon's Homepage - BYUNGJUN KWON SOLO EXHIBITION (Forum IMPACT)](https://byungjun.pe.kr/works/byungjun-kwon-solo-exhibition-2024)

[^1]: A robot imitating the upper human body, developed through multiple version upgrades over a long period under the leadership of artist Byungjun Kwon. It moves by controlling servomotors mounted on the joints of the neck, shoulders, elbows, wrists, and fingers.

[^2]: (1940–2018) Holder of Busan Intangible Cultural Heritage No. 8 ⟨Kang Tae-hong Style Gayageum Sanjo⟩. She studied gayageum under Master Kang Tae-hong from the age of 14. As Kang Tae-hong's last disciple, she dedicated her entire life to carrying on and promoting the techniques and spirit of the Kang Tae-hong style Gayageum Sanjo. [(Reference: Busan Ilbo)](https://www.busan.com/view/busan/view.php?code=20180323000141)

[^3]: (1971–) A Korean contemporary artist who uses sound, robots, performances, etc., as media. Winner of the "Korea Artist Prize 2023" from the National Museum of Modern and Contemporary Art, Korea. (Reference: [Artist Website](https://byungjun.pe.kr/))

[^4]: An international contemporary dance festival focused on the relationship between performing arts and new technologies, hosted by Théâtre de Liège in Belgium, against a backdrop of cooperation in various fields such as culture, research, education, and business. (Reference: [Théâtre de Liège Website - About Forum IMPACT](https://theatredeliege.be/en/festival-archives/forum-impact/))
:::
::: ko
![](images/works/gf3/live-stills/3.jpg)

## 기본 정보

- **형식**
  - 장르: 로봇 무용, 로봇 퍼포먼스
  - 구성: GF3[^1] 1대, 실시간 유선 로봇 제어 시스템, 로봇 안무 데이터, 신명숙[^2]의 인터뷰 음성 및 연주 음향 기록, 영상 프로젝션 및 피드백에 의한 약 10분 간의 로봇 퍼포먼스 작품
- **만든 사람들**
  - 출품자: 권병준[^3]
  - 총괄 디렉터, 하드웨어 설계, 음향: 권병준
  - 로봇 안무: 이유진
  - 로봇 디자인, 로봇 메인터넌스: 이주미
  - 소프트웨어 개발, 로봇 오퍼레이션: 임의존재
  - 스태프: 이민호, 최가람
- **공개**
  - 공연: [2024년 광주비엔날레 심포지엄 ⟨새로운 울림: 인류세 시대의 예술과 기술⟩](https://www.gwangjubiennale.org/gb/Board/11766/detailView.do)
  - 전시: [Forum IMPACT 2024 - Théâtre de Liège (벨기에)](https://theatredeliege.be/en/evenement/on-the-birds-day-2/)[^4]
  - 웹: [YouTube - 재단법인 광주비엔날레 - 공연 기록 영상](https://youtu.be/vXlX81ujGVM)
- **소스 코드**: [GitHub - 필자(임의존재) 담당 범위](https://github.com/random-entity/o.art.gf3)

## 줄거리

### 광주비엔날레 심포지엄 퍼포먼스

- 2018년 별세한 가야금산조 명인 신명숙[^2] 선생의 2002년 인터뷰 음성 기록이 오디토리움 스피커를 통해 재생된다. 인터뷰에는 어린 시절 스승으로부터 가야금 연주를 어떻게 전수받았는지, 그리고 서양의 기보법과 전통적인 구전/구술 중심의 전승 방식이 어떻게 다른지, 그 차이가 현대 연주자들에게 어떠한 악영향을 미치고 있는지에 대한 내용이 담겨 있다.
- 오디토리움 무대 위에 서 있는 상반신 휴머노이드 GF3[^1]는 마치 자신이 신명숙 선생이 된 것처럼 인터뷰를 말하는 제스처를 취한다.
- 인터뷰 씬이 끝나면, 신명숙 선생이 연주하며 노래하는 가야금 음악에 맞추어 GF3는 춤을 추기 시작한다. 오디토리움 스크린에는 그 장면의 영상 피드백이 실시간으로 투사된다.
- 춤사위가 격렬한 움직임으로 진행됨에 따라, GF3의 내부 부품은 파손되고, 몸동작은 엉켜 교착된다. 결국 전원이 꺼지며 퍼포먼스는 종료된다.

[공연 기록 영상](https://youtu.be/vXlX81ujGVM)

### Forum IMPACT 2024 전시

- GF3의 춤동작은 '파손과 교착에 의한 종료' 부분을 제외하고 Forum IMPACT 2024의 ⟨On The Birds' Day / Byungjun Kwon Solo Exhibition⟩ 전에서, 권병준 작가가 만들어 온 다양한 무용 로봇 작품들과 함께 전시되었다.

![](images/works/gf3/live-stills/IMG_2964.jpeg)
*Forum IMPACT 전시 설치 중*

![](images/works/gf3/live-stills/IMG_2968_still.jpg)
*Forum IMPACT 전시*

## 해설

- 권병준 작가는 인간의 동료로서의, 혹은 소외된 존재로서의 로봇의 사회적 역할을 비추어 보는 수제 로봇 작품을 만들어 왔다. 정밀한 공업용 로봇이 아닌 사람의 손으로 만든 로봇이기에야말로 나타나는 불안정하고 덜덜 떨리는 움직임은, 인간과 로봇의 관계에 대한 기성 관념을 전복하는 힘을 갖고 있다.
- GF3[^1]는 권병준 작가 팀이 개발한 로봇들 중 가장 인간과 가까운 형태다. 그러한 GF3의 본작에서의 역할은, 기술 발달과 글로벌화에 의해 현대 사회에서 잊혀져 가고 있는 전통 음악 명인의 영매였다. 고도의 기술력을 자랑하는 현대 로봇들의 사회 속에서 소외된 존재인 수제 로봇 GF3의 지위는, 전통 음악 명인의 그것과 닮아 있다. GF3는 잠시 동안이나마 신명숙[^2] 선생이 되어, 서양식 기보법의 보편화에 의해 가야금산조 본래의 소리와 정신이 사라져 가고 있다는 비판을 다시금 토해내고는, 그의 연주와 노래에 맞춰 춤을 춘다.
- 수 만 번 같은 동작을 반복해도 끄떡 없는 공업용 로봇과 달리, 3D 프린트한 부품을 다량 포함하는 GF3는 견고하지 않고 쉽게 마모된다. 그러나 그 비-기계성이 GF3의 본질이다. 그러나 그렇다고 하더라도, 광주비엔날레 심포지엄에서 GF3가 퍼포먼스 도중에 고장나는 것은 제작 팀이 의도하지 않은 일이었다. 오히려 GF3가 고장 없이 퍼포먼스를 마치게끔 사전에 수많은 테스트와 개선 작업을 거쳤다. GF3가 퍼포먼스 도중에 고장을 일으켰을 당시 필자(임의존재)는 개인적으로 실망했지만, 기계로 전통 음악 명인을 되살리는 영매술의 기계적 한계를 표현한 것으로도 해석할 수 있다는 점에서 좋은 일이 되기도 했다. 약 두 달 뒤의 Forum IMPACT에서는 기계적 안정성을 개선한 버전을 구동하여 별다른 고장 없이 일주일 이상의 기간 동안 GF3의 움직임을 전시할 수 있었다.

## 기술

### 개요

- GF3는 서보모터 제어에 의해 움직인다.
- 커맨더 시스템은 GF3에게 안무 지시를 내리고, 모니터 시스템은 GF3부터 그의 상태를 보고 받아 시각적으로 표시한다.
- 센서 시스템은 각 관절의 기어 출력 각위치와 모터 온도 등을 인식한다.
- 유선 통신 시스템은 GF3와 센서 시스템, 그리고 커맨더/모니터 시스템이 정보를 주고받을 수 있게 한다.
- GF3는 커맨더 시스템으로부터 안무를 지시 받고, 안무의 알고리즘을 물리적으로 실행하면서, 오작동 발생 시에는 그것을 우선적으로 처리한다.

### 상세

- GF3[^1]의 기계공학적 구조:
  - GF3의 목, 어깨, 팔꿈치에 장착된 관절로서는, 이전부터 권병준 작가 팀이 개발하고 사용해 온 "디퍼렌셜 관절"을 계승한 기어를 사용했다. "디퍼렌셜 관절"이란 [디퍼렌셜 구조](<https://en.wikipedia.org/wiki/Differential_(mechanical_device)>)를 응용하여 마주보는 2대의 서보모터의 조합으로 2-DOF 관절을 구현한 것이다. 어깨에는 디퍼렌셜 관절 외에 별도의 서보모터 및 일반 기어를 추가해 3-DOF 움직임을 가능케 했다. 이상의 관절을 움직이는 서보모터 및 컨트롤러로는 [mjbots mj5208](https://mjbots.com/products/mj5208) 및 [mjbots moteus](https://mjbots.com/products/moteus-r4-11)를 사용했다.
  - 손목 관절에는 일반 기어를 사용해 1대의 서보모터로 1-DOF 관절을 구현했다.
  - 손가락은, 관절부가 유연하게 꺾일 수 있도록 3D 프린트 된 손의 각 손가락 끝과 손등에 장착된 5대의 소형 서보모터 사이에 연결된 와이어를 감거나 풂으로써 움직인다.
  - GF3의 본체 전체는 3D 프린팅된 부품들과 금속/전기/전자 부품들로부터 조립될 수 있도록 설계했다.
- **GF3의 동작 알고리즘**:
  - GF3의 모든 동작은 "포즈"의 시퀀스로 환원된다. "포즈"란 각 관절의 각 회전축의 영점으로부터의 각위치의 조합이다. GF3는 현재 포즈로부터 목표하는 포즈로 모든 회전축의 각위치를 조정함으로써 "포즈 커맨드"를 실행한다.
  - 기어 출력을 기준으로 목표하는 각위치에 도달하기 위해 각 서보모터가 어떤 속도로 회전해야 하는지는 각 기어의 내부적 성질을 바탕으로 계산된다.
- **센서 시스템**:
  - 기어 출력을 기준으로 안무를 짜고 포즈를 커맨드할 수 있도록 기어 출력 회전축에 장착된 자석 및 외부 인코더를 사용했다.
  - 서보모터 과열 혹은 배선 탈선 등 장해를 일으키는 상태를 실시간으로 모니터 할 수 있도록 [mjbots moteus SDK](https://github.com/mjbots/moteus/tree/main/lib/cpp/mjbots/moteus)에서 제공하는 값들을 사용했다.
- **커맨더/모니터 시스템과 유선 통신 시스템**:
  - GF3는 홀로 무대에 서서 퍼포먼스를 하는 로봇으로서 기획되었기 때문에, 원격으로 GF3에게 커맨드를 송신하고 GF3의 상태를 모니터 할 수 있는 커맨더/모니터 시스템이 필요했다.
  - 커맨더/모니터 시스템으로는 GUI를 통한 실시간 제어를 지원하는 [Pure Data](https://puredata.info/) 패치(C로 작성한 커스텀 오브젝트 포함)를 사용했다.
  - 커맨더/모니터 시스템과 GF3의 임베디드 시스템 사이의 유선 통신 시스템으로는 UDP 네트워크를 사용했다.
- GF3의 임베디드 시스템 (하드웨어):
  - GF3에 장착된 14개의 [mjbots moteus](https://mjbots.com/products/moteus-r4-11) 서보모터 컨트롤러 및 양손에 장착된 5개의 소형 서보모터를 제어하는 2개의 마이크로컨트롤러, 그리고 커맨더/모니터 시스템과의 통신을 종합적으로 관리하기 위해 GF3의 등에 라즈베리 파이를 부착해 사용했다.
- **GF3의 임베디드 시스템 (소프트웨어)**:
  - 상술한 라즈베리 파이가 모든 서보모터 컨트롤러와 마이크로컨트롤러 및 커맨더/모니터 시스템과 통신하면서 GF3를 구동시키도록 하는 C++ 스크립트를 작성했다.
- 안무:
  - 안무가의 역할은 공연 시간 10분 동안 GF3가 수행할 포즈의 시퀀스를 구성하는 일이었다. 안무의 구성 작업은 각 포즈를 "포즈 프리셋"으로서 저장하고, 연속되는 포즈 프리셋 사이의 시간 간격을 "포즈 시퀀스"로서 저장함으로써 이루어진다.
- 퍼포먼스 큐:
  - 퍼포먼스 진행 시 음향, 자막이나 카메라 화면 등 스크린에의 영상 프로젝션, 그리고 GF3의 각 동작이 시작되고 끝나는 시간을 사전에 지정해놓기 위해, 퍼포먼스 전체의 큐를 관리하는 [Pure Data](https://puredata.info/) 패치를 사용했다.
- **실시간 로봇 오퍼레이션**:
  - 서보모터 과열 혹은 배선 탈선 등 시스템 장해를 모니터 하고, GF3가 구동 불능 상태가 되었을 때 즉흥적으로 대처하기 위해, 무대 뒤에서 실시간으로 로봇을 제어할 수 있는 오퍼레이터 인력이 필요했다.

### 필자(임의존재)가 담당한 범위

- 필자(임의존재)가 담당한 부분은 GF3 동작 알고리즘 로직 및 상기한 모든 전자 시스템(통신 시스템, 커맨더/모니터 시스템, GF3의 임베디드 시스템)의 소프트웨어 개발 [(소스 코드)](https://github.com/random-entity/o.art.gf3), 그리고 공연 시의 실시간 로봇 오퍼레이션이다.
- 상세 섹션에 작성한 리스트의 필자 담당 항목 루트는 **볼드체 문자**로 되어 있다.

## 외부 링크

- [권병준 작가 홈페이지 - BYUNGJUN KWON SOLO EXHIBITION (Forum IMPACT)](https://byungjun.pe.kr/works/byungjun-kwon-solo-exhibition-2024)

[^1]: 권병준 작가의 주도 하에 장기간 여러 버전 업그레이드를 거치며 개발되어 온, 인체 상반신을 모방한 로봇. 목, 어깨, 팔꿈치, 손목, 손가락의 관절에 장착된 서보모터를 제어함으로써 움직인다.

[^2]: (1940–2018) 부산시 지정 무형문화재 제8호 ⟨강태홍류 가야금산조⟩ 예능보유자. 14세부터 강태홍 선생에게서 가야금을 사사했다. 강태홍의 마지막 제자로서, 전 생애에 걸쳐 강태홍류 가야금산조의 기술과 정신을 이어가고 알리는 데에 매진했다. [(참조: 부산일보)](https://www.busan.com/view/busan/view.php?code=20180323000141)

[^3]: (1971–) 사운드, 로봇, 퍼포먼스 등을 미디어로 하는 한국의 현대미술가. 2024년 국립현대미술관 "올해의 작가상 2023" 수상. (참조: [작가 웹사이트](https://byungjun.pe.kr/))

[^4]: 문화, 연구, 교육, 기업 등 각 분야의 협력을 배경으로, 벨기에 Théâtre de Liège가 개최하는, 무대예술과 새로운 테크놀로지의 관계에 초점을 둔 현대무용 국제예술제. (참조: [Théâtre de Liège 웹사이트 - Forum IMPACT 소개](https://theatredeliege.be/en/festival-archives/forum-impact/))
:::
::: ja
![](images/works/gf3/live-stills/3.jpg)

## 基本情報

- **形式**
  - ジャンル: ロボット舞踊、ロボットパフォーマンス
  - 構成: GF3[^1] 1台、リアルタイム有線ロボット制御システム、ロボット振付データ、シン・ミョンスク[^2]のインタビュー音声および演奏音源記録、映像プロジェクションおよびフィードバックによる約10分間のロボットパフォーマンス作品
- **制作陣**
  - 出品者: KWON Byungjun[^3]
  - 総括ディレクター、ハードウェア設計、音響: KWON Byungjun
  - ロボット振付: LEE Yujin
  - ロボットデザイン、ロボットメンテナンス: LEE Jumi
  - ソフトウェア開発、ロボットオペレーション: 任意存在
  - スタッフ: LEE Minho、CHOI Garam
- **公開**
  - 公演: [2024年光州ビエンナーレ・シンポジウム ⟨新しい響き：人新世時代の芸術と技術⟩](https://www.gwangjubiennale.org/gb/Board/11766/detailView.do)
  - 展示: [Forum IMPACT 2024 - Théâtre de Liège (ベルギー)](https://theatredeliege.be/en/evenement/on-the-birds-day-2/)[^4]
  - Web: [YouTube - 財団法人光州ビエンナーレ - 公演記録映像](https://youtu.be/vXlX81ujGVM)
- **ソースコード**: [GitHub - 私(任意存在)担当範囲](https://github.com/random-entity/o.art.gf3)

## あらすじ

### 光州ビエンナーレ・シンポジウム パフォーマンス

- 2018年に逝去した伽倻琴散調（カヤグムサンジョ）の名人、シン・ミョンスク[^2]先生の2002年のインタビュー音声記録がオーディトリアムのスピーカーから再生される。インタビューには、幼い頃に師匠から伽倻琴の演奏をどのように伝授されたか、そして西洋の記譜法と伝統的な口伝・口述中心の伝承方式がどのように異なるか、その違いが現代の演奏者たちにどのような悪影響を及ぼしているかについて語られている。
- オーディトリアムのステージ上に立っている上半身ヒューマノイドGF3[^1]は、まるで自分がシン・ミョンスク先生になったかのように、インタビューを語るジェスチャーをとる。
- インタビューのシーンが終わると、シン・ミョンスク先生が演奏し歌う伽倻琴の音楽に合わせて、GF3は踊り始める。オーディトリアムのスクリーンには、そのシーンの映像フィードバックがリアルタイムで投影される。
- 舞が激しい動きへと進行するにつれて、GF3の内部部品は破損し、体の動きは絡まり膠着する。最終的に電源が切れ、パフォーマンスは終了する。

[公演記録映像](https://youtu.be/vXlX81ujGVM)

### Forum IMPACT 2024 展示

- GF3のダンスの動きは、「破損と膠着による終了」部分を除き、Forum IMPACT 2024の⟨On The Birds' Day / Byungjun Kwon Solo Exhibition⟩展にて、KWON Byungjun作家が制作してきた多様な舞踊ロボット作品とともに展示された。

![](images/works/gf3/live-stills/IMG_2964.jpeg)
*Forum IMPACT 展示設営中*

![](images/works/gf3/live-stills/IMG_2968_still.jpg)
*Forum IMPACT 展示*

## 解説

- KWON Byungjun作家は、人間の仲間としての、あるいは疎外された存在としてのロボットの社会的役割を映し出す手作りロボット作品を制作してきた。精密な工業用ロボットではなく、人間の手で作られたロボットだからこそ現れる不安定で震える動きは、人間とロボットの関係に対する既成観念を転覆させる力を持っている。
- GF3[^1]は、KWON Byungjun作家チームが開発したロボットの中で最も人間に近い形をしている。そのようなGF3の本作における役割は、技術の発達とグローバル化によって現代社会で忘れ去られつつある伝統音楽の名人の霊媒であった。高度な技術力を誇る現代のロボット社会の中で疎外された存在である手作りロボットGF3の地位は、伝統音楽の名人のそれと似ている。GF3は、一時的ではあるがシン・ミョンスク[^2]先生となり、西洋式記譜法の普遍化によって伽倻琴散調本来の音と精神が消えつつあるという批判を改めて吐き出し、彼女の演奏と歌に合わせて踊る。
- 何万回同じ動作を繰り返してもびくともしない工業用ロボットとは異なり、3Dプリントされた部品を多量に含むGF3は堅牢ではなく摩耗しやすい。しかし、その非機械性こそがGF3の本質である。とはいえ、光州ビエンナーレ・シンポジウムでGF3がパフォーマンス中に故障することは、制作チームが意図したものではなかった。むしろ、GF3が故障なくパフォーマンスを終えられるよう、事前に数多くのテストと改善作業を経ていた。GF3がパフォーマンス中に故障を起こした当時、私（任意存在）は個人的に失望したが、機械で伝統音楽の名人を蘇らせる降霊術の機械的限界を表現したものとも解釈できるという点で、結果的に良いことにもなった。約2ヶ月後のForum IMPACTでは、機械的安定性を改善したバージョンを稼働させ、特に故障することなく1週間以上の期間、GF3の動きを展示することができた。

## 技術

### 概要

- GF3はサーボモーターの制御によって動く。
- コマンダーシステムはGF3に振付を指示し、モニターシステムはGF3からその状態の報告を受けて視覚的に表示する。
- センサーシステムは各関節のギア出力角位置やモーター温度などを認識する。
- 有線通信システムは、GF3とセンサーシステム、そしてコマンダー/モニターシステムが情報をやり取りできるようにする。
- GF3はコマンダーシステムから振付の指示を受け、振付のアルゴリズムを物理的に実行しながら、誤作動発生時にはそれを優先的に処理する。

### 詳細

- GF3[^1]の機械工学的構造:
  - GF3の首、肩、肘に装着された関節としては、以前からKWON Byungjun作家チームが開発し使用してきた「ディファレンシャル関節」を継承したギアを使用した。「ディファレンシャル関節」とは、[ディファレンシャル構造](<https://en.wikipedia.org/wiki/Differential_(mechanical_device)>)を応用し、向かい合う2台のサーボモーターの組み合わせで2-DOF（自由度）関節を実装したものである。肩にはディファレンシャル関節の他に別途サーボモーターおよび一般ギアを追加し、3-DOFの動きを可能にした。以上の関節を動かすサーボモーターおよびコントローラーとしては、[mjbots mj5208](https://mjbots.com/products/mj5208)および[mjbots moteus](https://mjbots.com/products/moteus-r4-11)を使用した。
  - 手首の関節には一般ギアを使用し、1台のサーボモーターで1-DOF関節を実装した。
  - 指は、関節部が柔軟に曲がるよう、3Dプリントされた手の各指先と手の甲に装着された5台の小型サーボモーター間に接続されたワイヤーを巻き取ったり緩めたりすることで動く。
  - GF3の本体全体は、3Dプリントされた部品と金属・電気・電子部品から組み立てられるように設計した。
- **GF3の動作アルゴリズム**:
  - GF3のすべての動作は「ポーズ」のシーケンスに還元される。「ポーズ」とは、各関節の各回転軸のゼロ点からの角位置の組み合わせである。GF3は、現在のポーズから目標とするポーズへすべての回転軸の角位置を調整することで「ポーズコマンド」を実行する。
  - ギア出力を基準に、目標とする角位置に到達するために各サーボモーターがどのような速度で回転すべきかは、各ギアの内部的性質に基づいて計算される。
- **センサーシステム**:
  - ギア出力を基準に振付を構成し、ポーズをコマンドできるよう、ギア出力回転軸に装着された磁石および外部エンコーダーを使用した。
  - サーボモーターの過熱や配線の脱線など、障害を引き起こす状態をリアルタイムでモニターできるよう、[mjbots moteus SDK](https://github.com/mjbots/moteus/tree/main/lib/cpp/mjbots/moteus)で提供される値を使用した。
- **コマンダー/モニターシステムと有線通信システム**:
  - GF3は一人でステージに立ってパフォーマンスをするロボットとして企画されたため、遠隔でGF3にコマンドを送信し、GF3の状態をモニターできるコマンダー/モニターシステムが必要だった。
  - コマンダー/モニターシステムとしては、GUIを通じたリアルタイム制御を支援する[Pure Data](https://puredata.info/)パッチ（C言語で作成したカスタムオブジェクトを含む）を使用した。
  - コマンダー/モニターシステムとGF3の組み込みシステム間の有線通信システムとしてはUDPネットワークを使用した。
- GF3の組み込みシステム (ハードウェア):
  - GF3に装着された14個の[mjbots moteus](https://mjbots.com/products/moteus-r4-11)サーボモーターコントローラーおよび両手に装着された5個の小型サーボモーターを制御する2個のマイクロコントローラー、そしてコマンダー/モニターシステムとの通信を総合的に管理するため、GF3の背中にRaspberry Piを取り付けて使用した。
- **GF3の組み込みシステム (ソフトウェア)**:
  - 上述のRaspberry Piが、すべてのサーボモーターコントローラーとマイクロコントローラーおよびコマンダー/モニターシステムと通信しながらGF3を駆動させるようにするC++スクリプトを作成した。
- 振付:
  - 振付師の役割は、公演時間10分の間にGF3が遂行するポーズのシーケンスを構成することだった。振付の構成作業は、各ポーズを「ポーズプリセット」として保存し、連続するポーズプリセット間の時間間隔を「ポーズシーケンス」として保存することで行われる。
- パフォーマンスキュー:
  - パフォーマンス進行時、音響、字幕やカメラ画面などのスクリーンへの映像プロジェクション、そしてGF3の各動作が始まり終わる時間を事前に指定しておくため、パフォーマンス全体のキューを管理する[Pure Data](https://puredata.info/)パッチを使用した。
- **リアルタイムロボットオペレーション**:
  - サーボモーターの過熱や配線の脱線などのシステム障害をモニターし、GF3が駆動不能状態になった時に即興で対処するため、舞台裏でリアルタイムにロボットを制御できるオペレーター人員が必要だった。

### 私（任意存在）が担当した範囲

- 私（任意存在）が担当した部分は、GF3動作アルゴリズムのロジック、および上記のすべての電子システム（通信システム、コマンダー/モニターシステム、GF3の組み込みシステム）のソフトウェア開発 [(ソースコード)](https://github.com/random-entity/o.art.gf3)、そして公演時のリアルタイムロボットオペレーションである。
- 詳細セクションに作成したリストの私担当項目のルートは**太字**になっている。

## 外部リンク

- [KWON Byungjun作家ホームページ - BYUNGJUN KWON SOLO EXHIBITION (Forum IMPACT)](https://byungjun.pe.kr/works/byungjun-kwon-solo-exhibition-2024)

[^1]: KWON Byungjun作家の主導のもと、長期間にわたり複数のバージョンアップグレードを経て開発されてきた、人体の上半身を模倣したロボット。首、肩、肘、手首、指の関節に装着されたサーボモーターを制御することで動く。

[^2]: (1940–2018) 釜山市指定無形文化財第8号 ⟨カン・テホン流伽倻琴散調⟩ 技能保持者。14歳からカン・テホン先生に伽倻琴を師事した。カン・テホンの最後の弟子として、生涯にわたりカン・テホン流伽倻琴散調の技術と精神を受け継ぎ、広めることに邁進した。[(参照: 釜山日報)](https://www.busan.com/view/busan/view.php?code=20180323000141)

[^3]: (1971–) サウンド、ロボット、パフォーマンスなどをメディアとする韓国の現代美術家。2024年国立現代美術館「今年の作家賞 2023」受賞。(参照: [作家ウェブサイト](https://byungjun.pe.kr/))

[^4]: 文化、研究、教育、企業など各分野の協力を背景に、ベルギーのThéâtre de Liègeが開催する、舞台芸術と新しいテクノロジーの関係に焦点を当てた現代舞踊の国際芸術祭。(参照: [Théâtre de Liège ウェブサイト - Forum IMPACT 紹介](https://theatredeliege.be/en/festival-archives/forum-impact/))
:::
