# Supported quiz / interactive activity types

Treat types 14–16 as game/assessment modes that can wrap a core interaction rather than separate duplicated engines.

| ID | Type | HTML interaction | Reveal representation | Notes |
|---|---|---|---|---|
| 01 | Single Choice | one radio selection | highlight approved option | Only one answer |
| 02 | Multiple Response | checkboxes | highlight all approved answers | support exact set evaluation |
| 03 | True/False | two exclusive choices | highlight approved choice | no duplicate feedback |
| 04 | Fill in Blank | input; normalize per approved rule | show approved answer | accepted variants must be defined |
| 05 | Image Hotspot | click/tap location | show approved zone(s) | normalized coordinates for scaling; accessible alternative |
| 06 | Drag and Drop | draggable cards/targets | show correct placements | touch/keyboard alternatives |
| 07 | Sequence / Ordering | reorder steps | show approved order | drag or up/down buttons |
| 08 | Matching Pairs | pair elements | show mapped pairs | support multiple pairing UIs |
| 09 | Image Comparison | choose proper/improper | highlight approved choice(s) | no inventing visual diagnosis |
| 10 | Branching Decision | choice navigates to outcome | Storyline controls branching/feedback | explicit consequences |
| 11 | Hazard Identification | multi-hotspot/selection | mark approved hazard locations | zones must be approved |
| 12 | Timed Challenge | selection/action with timer | reveal per underlying type | pause/timeout policy specified |
| 13 | Multi-Step Simulation | several linked interactions | reveal per stage or at end | independent checkpoints |
| 14 | Life-Based Quiz | base type + life meter scoring | reveal per base type | Storyline deducts life once |
| 15 | Reward-Based Quiz | base type + star scoring | reveal per base type | Storyline awards once |
| 16 | Level Completion | composite challenge | summary/approved result | Storyline controls progression |

**Every type:** configurable canvas, consistent typography/UI, rounded corners, lock/revisit behavior, Storyline feedback, independent documentation, assets and exports. Implement only types needed by approved curriculum; list does not mandate inventing content.
