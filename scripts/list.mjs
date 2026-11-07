// Builds themes.json, which lists each theme's address, SHA-256 hash and preview colours.
//
//   npm run list     check every theme and write themes.json (commit it)
//   npm run verify   check every theme, and check that themes.json is up to date
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const RAW = 'https://raw.githubusercontent.com/black-community/themes/main'
const ID = /^[a-z0-9][a-z0-9-]{0,63}$/
const HEX = /^#[0-9a-f]{6}$/i
/** The colours a theme is allowed to set. Keep this in step with src/lib/userThemes.ts in the app. */
const TOKENS = ['bg', 'bg-sunken', 'panel', 'panel-2', 'elevated', 'hover', 'active', 'border', 'border-soft', 'border-strong', 'text', 'text-2', 'muted', 'faint', 'accent', 'accent-hover', 'accent-ink', 'accent-soft', 'accent-line', 'danger', 'danger-soft', 'success', 'info', 'paper', 'paper-text', 'comment', 'comment-active']
const PREVIEW = ['bg', 'panel', 'border', 'faint', 'accent', 'paper', 'paper-text']
/** Minimum contrast: 4.5:1 for body text, and 3:1 for labels and text on the accent colour. */
const CONTRAST = [['paper-text', 'paper', 4.5], ['text', 'panel', 4.5], ['text', 'bg', 4.5], ['muted', 'panel', 3], ['accent-ink', 'accent', 3]]

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const problems = []
const entries = readdirSync(path.join(root, 'themes'))
  .filter((f) => f.endsWith('.json'))
  .sort()
  .map((file) => {
    const raw = readFileSync(path.join(root, 'themes', file))
    const id = file.slice(0, -'.json'.length)
    const theme = JSON.parse(raw.toString('utf8'))
    const fail = (why) => problems.push(`themes/${file}: ${why}`)
    if (!ID.test(id)) fail('The file name must use only lower-case letters, numbers and dashes.')
    if (!theme.name) fail('The theme needs a name.')
    if (theme.scheme !== 'dark' && theme.scheme !== 'light') fail('scheme must be "dark" or "light".')
    for (const [token, value] of Object.entries(theme.colors ?? {})) {
      if (!TOKENS.includes(token)) fail(`Themes can't set the colour ${token}.`)
      if (!/^#[0-9a-f]{3,8}$/i.test(value)) fail(`${token} must be a hex colour.`)
    }
    for (const [a, b, least] of CONTRAST) {
      const [x, y] = [theme.colors?.[a], theme.colors?.[b]]
      if (!HEX.test(x ?? '') || !HEX.test(y ?? '')) fail(`${a} and ${b} are required, in #rrggbb format.`)
      else if (contrast(x, y) < least) fail(`The contrast of ${a} on ${b} is ${contrast(x, y).toFixed(2)}:1, but must be at least ${least}:1.`)
    }
    return {
      id,
      name: theme.name,
      author: theme.author ?? '',
      ...(theme.homepage ? { homepage: theme.homepage } : {}),
      scheme: theme.scheme,
      url: `${RAW}/themes/${file}`,
      sha256: createHash('sha256').update(raw).digest('hex'),
      size: raw.length,
      preview: Object.fromEntries(PREVIEW.map((token) => [token, theme.colors?.[token]])),
    }
  })

const list = `${JSON.stringify({ name: 'Bläck Studio community', themes: entries }, null, 2)}\n`
const listFile = path.join(root, 'themes.json')
if (problems.length) {
  for (const p of problems) console.error(`✗ ${p}`)
  process.exit(1)
}
if (process.argv.includes('--check')) {
  if (!existsSync(listFile) || readFileSync(listFile, 'utf8') !== list) {
    console.error('✗ themes.json is out of date. Run npm run list.')
    process.exit(1)
  }
  console.log(`✓ ${entries.length} themes`)
} else {
  writeFileSync(listFile, list)
  console.log(`✓ themes.json: ${entries.length} themes`)
}
