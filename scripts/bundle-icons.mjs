#!/usr/bin/env node
/**
 * Scans the codebase for all mdi:xxx icon references, fetches their SVG data
 * from the Iconify API, and generates an inline SVG Icon component that renders
 * with zero runtime — no async loading, no flicker.
 *
 * Usage:  node scripts/bundle-icons.mjs
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

const ROOT = process.cwd()
const OUT = join(ROOT, 'components', 'icons.tsx')
const SKIP = new Set(['node_modules', '.next', '.git', 'dist', '.turbo'])

function walk(dir, exts, results = []) {
    for (const name of readdirSync(dir)) {
        if (SKIP.has(name)) continue
        const full = join(dir, name)
        const stat = statSync(full)
        if (stat.isDirectory()) walk(full, exts, results)
        else if (exts.some(e => full.endsWith(e))) results.push(full)
    }
    return results
}

const files = walk(ROOT, ['.tsx', '.ts', '.json', '.js'])
const pattern = /["']mdi:([a-z0-9-]+)["']/g
const icons = new Set()

for (const file of files) {
    const src = readFileSync(file, 'utf-8')
    let m
    while ((m = pattern.exec(src)) !== null) icons.add(m[1])
}

const sorted = [...icons].sort()
console.log(`Found ${sorted.length} unique MDI icons`)

const url = `https://api.iconify.design/mdi.json?icons=${sorted.join(',')}`
console.log('Fetching from Iconify API…')
const res = await fetch(url)
if (!res.ok) throw new Error(`API returned ${res.status}`)
const data = await res.json()

const missing = sorted.filter(name => !data.icons?.[name])
if (missing.length) {
    console.warn(`⚠ Missing icons: ${missing.join(', ')}`)
}

const entries = Object.entries(data.icons)
    .map(([name, { body }]) => `    'mdi:${name}': '${body.replace(/'/g, "\\'")}',`)
    .join('\n')

const ts = `// Auto-generated inline SVG icon component — do not edit.
// Re-run:  node scripts/bundle-icons.mjs
// ${Object.keys(data.icons).length} icons bundled from MDI

import React from 'react'

const SVG_BODY: Record<string, string> = {
${entries}
}

interface IconProps extends React.SVGProps<SVGSVGElement> {
    icon: string
}

export function Icon({ icon, className, ...rest }: IconProps) {
    const body = SVG_BODY[icon]
    if (!body) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(\`[Icon] Unknown icon: "\${icon}". Run: node scripts/bundle-icons.mjs\`)
        }
        return null
    }
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            aria-hidden
            className={className}
            {...rest}
            dangerouslySetInnerHTML={{ __html: body }}
        />
    )
}
`

writeFileSync(OUT, ts, 'utf-8')
console.log(`✓ Generated ${OUT} (${Object.keys(data.icons).length} icons)`)
