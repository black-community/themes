# Colour themes for Bläck Studio, from the community

[Bläck Studio](https://blackstudio.app) offers this list by default, under Settings → Theme → Find more themes. It's
marked as not official. A theme is only colours and font names, so it can't run anything.

```
themes/<id>.json   a theme
themes.json        the list the app reads
```

## Adding a theme

Add `themes/<id>.json`, then run `npm run list` and commit both. It checks the colours are ones a theme can set, and
that the text is readable.

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

- `pair` is the theme View → Toggle Theme goes to. A theme from this list has the id `user-community-<id>`. If the
  writer doesn't have the pair, Bläck Studio uses its own theme in the other light.
- Any colour you leave out comes from Bläck Studio's own dark or light. The readable ones in the example are required.
- Credit whoever made the palette, in `author` and `homepage`, and only add one its licence allows.
