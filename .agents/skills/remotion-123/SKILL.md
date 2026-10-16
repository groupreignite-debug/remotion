---
name: remotion-123
description: One-command Remotion helper. Use when the user invokes /remotion-123 followed by any Remotion request (create, edit, preview, caption, or render a video) and route it to the right Remotion skill.
---

# Remotion 123

Treat everything the user typed after `/remotion-123` as the request. If nothing was typed, ask what they want to make or change.

## 1. Pick the skill

Load the matching skill and follow it:

| Request                                     | Skill                                                        |
| ------------------------------------------- | ------------------------------------------------------------ |
| Make, create, or build a new video          | [remotion-create](../remotion-create/SKILL.md)               |
| Edit or write composition code              | [remotion-markup](../remotion-markup/SKILL.md)               |
| Captions, subtitles, transcription          | [remotion-captions](../remotion-captions/SKILL.md)           |
| Maps, routes, geographic animations         | [remotion-maps](../remotion-maps/SKILL.md)                   |
| Trim, crop, or inspect media files          | [remotion-multimedia](../remotion-multimedia/SKILL.md)       |
| Preview in the Studio                       | [remotion-studio](../remotion-studio/SKILL.md)               |
| Export or render to a file                  | [remotion-render](../remotion-render/SKILL.md)               |
| Upgrade Remotion packages                   | [remotion-upgrade](../remotion-upgrade/SKILL.md)             |
| Build an app around Remotion                | [remotion-saas](../remotion-saas/SKILL.md)                   |
| An API question                             | [remotion-docs](../remotion-docs/SKILL.md)                   |
| Anything else, or unsure                    | [remotion-best-practices](../remotion-best-practices/SKILL.md) |

## 2. Do it in three steps

1. **Build**: make the change with the chosen skill. Don't overwrite edits the user made outside the conversation.
2. **Preview**: open the result in Remotion Studio so the user can see it. Don't render a file unless they explicitly ask for one.
3. **Report**: say in a few lines what changed, which composition to look at, and how to render it (`bunx remotion render <comp-id>`).
