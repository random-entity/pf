<!--
GLOBAL FOOTNOTE / GLOSSARY SOURCE
=================================

Shared footnote definitions, reusable across every work in the site.

Authoring is identical to a page-local footnote DEFINITION:

    [^label]: Definition text. Markdown links, **bold**, and [[wikilinks]] work.

There is NO special reference syntax. A normal footnote reference in any work —
in the body OR in a frontmatter value — automatically falls back to this file:

    Some term[^label]

Resolution order for any `[^label]` reference:
  1. a page-local `[^label]:` definition, if the page has one (it OVERRIDES the
     glossary — a page can redefine a shared term);
  2. otherwise the definition in THIS file (current language → English → any);
  3. otherwise the reference is left unresolved.

Glossary footnotes render and number exactly like page-local ones and are merged
into the same per-page footnotes list.

Translations use the same `::: en|ko|ja` fences as page content. A definition
written OUTSIDE any fence is shared across all languages.

This file also holds the shared URL MAP. A link whose target starts with `^` is
a reference resolved by label, page-local first then here:

    [Boids on Wikipedia](^wiki-boids)

    (^wiki-boids): https://en.wikipedia.org/wiki/Boids

A URL ref produces a normal external link (no marker / list entry) and composes
with the multi-link syntax: [text](^a)(^b) yields one ↗ per resolved URL.

(To later back this with a real external repository, replace the `glossary/`
directory with a git submodule — the import in src/lib/glossary.js is unchanged.)
-->

## Footnotes (multi-lingual)

:::en
[^rotc]: A robot theater company (robot dance production team) founded in 2024 by artist KWON Byungjun with the support of Art Korea Lab.
[^kwon]: (1971–) A contemporary Korean artist whose media include sound, robots, and performance. Winner of the "Korea Artist Prize 2023" by the National Museum of Modern and Contemporary Art, Korea. (Reference: [Artist's Website](https://byungjun.pe.kr/))
:::
::: ko
[^rotc]: 권병준 작가가 아트코리아랩의 지원으로 2024년 창립한 로봇 극단 (로봇 무용 작품 제작 팀).
[^kwon]: (1971–) 사운드, 로봇, 퍼포먼스 등을 미디어로 하는 한국의 현대미술가. 2024년 국립현대미술관 "올해의 작가상 2023" 수상. (참조: [작가 웹사이트](https://byungjun.pe.kr/))
:::
::: ja
[^rotc]: KWON Byungjun作家がアートコリアラボの支援により2024年に創立したロボット劇団(ロボット舞踊作品制作チーム)。
[^kwon]: (1971–) サウンド、ロボット、パフォーマンスなどをメディアとする韓国の現代美術家。2024年 国立現代美術館「今年の作家賞 2023」受賞。(参照: [作家ウェブサイト](https://byungjun.pe.kr/))
:::

## Footnotes (mono-lingual)

## URLs (multi-lingual)

## URLs (mono-lingual)

(^theatre-de-liege): https://theatredeliege.be/en/
(^impact): https://theatredeliege.be/en/festival-archives/forum-impact/
(^spaf): http://spaf.or.kr/
(^platform-l): https://platform-l.org/
(^teensy4): https://www.pjrc.com/teensy-4-0/
(^moteus-r4): https://mjbots.com/products/moteus-r4-11
(^xbee3): https://www.digi.com/products/embedded-systems/digi-xbee/rf-modules/2-4-ghz-rf-modules/xbee3-zigbee-3
(^pure-data): https://puredata.info/
(^processing): https://processing.org/
