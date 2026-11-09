# Community colour themes for Bläck Studio

[Bläck Studio](https://blackstudio.app) offers this list by default, under Settings → Theme → Find more themes. It's
marked as not official. A theme is only colours and font names, so it can't run anything.

```
themes/<id>.json   a theme
themes.json        the list the app reads
```

## Adding a theme

Add `themes/<id>.json`, then run `npm run list` and commit both. It checks that the theme sets only supported colours, and
that the text has enough contrast.

```json
{
  "name": "Harbour",
  "author": "You",
  "homepage": "https://example.com/harbour",
  "scheme": "dark",
  "pair": "user-community-harbour-light",
  "colors": { "bg": "#10151c", "panel": "#161d26", "paper": "#161d26", "paper-text": "#d8dee9", "text": "#d8dee9", "muted": "#8b96a5", "accent": "#e0a458", "accent-ink": "#10151c" }
}
```

- `pair` is the theme that View → Light or Dark Theme switches to. A theme from this list has the id
  `user-community-<id>`. If the writer doesn't have the pair, Bläck Studio uses its built-in theme for the other scheme.
- Any colour you leave out comes from Bläck Studio's built-in dark or light theme. The colours in the example are
  required, because they're checked for contrast.
- Credit whoever made the palette in `author` and `homepage`, and only add a palette whose licence allows it.
