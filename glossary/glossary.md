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

(To later back this with a real external repository, replace the `glossary/`
directory with a git submodule — the import in src/lib/glossary.js is unchanged.)
-->

::: en
[^boids]: An artificial-life program created by Craig Reynolds in 1986 that simulates the flocking behaviour of birds; each "boid" follows only simple local rules (separation, alignment, cohesion).
:::

::: ko
[^boids]: 크레이그 레이놀즈가 1986년에 만든 인공 생명 프로그램으로, 새 떼의 군집 행동을 시뮬레이션한다. 각 "보이드"는 단순한 국소 규칙(분리·정렬·응집)만을 따른다.
:::

::: ja
[^boids]: クレイグ・レイノルズが1986年に作成した人工生命プログラムで、鳥の群れの群集行動をシミュレートする。各「ボイド」は単純な局所ルール（分離・整列・結合）のみに従う。
:::
