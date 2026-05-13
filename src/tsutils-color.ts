/**
 * Part of TsUi 2.0 library — color cluster sub-module
 *  - Extracted from src/tsutils.ts by v2.1 SDD refactor (Phase 2)
 *  - No dependencies on TsBase, TsUtils, or any other sub-module (L1 DAG leaf)
 *  - All exports are plain functions — no default export
 *
 * 4-space indent (project convention for sub-modules).
 */

/** RGB(A) color as returned by parseColor() */
export interface TsColorRgb {
    r: number
    g: number
    b: number
    a: number
}

/**
 * Parse a color string (hex, RGB, RGBA) into a TsColorRgb object.
 * Returns null for unrecognised input (word colors, empty strings, etc.).
 */
export function parseColor(str: string | null | undefined): TsColorRgb | null {
    if (typeof str !== 'string') return null; else str = str.trim().toUpperCase()
    if (str[0] === '#') str = str.substr(1)
    let color: TsColorRgb = { r: 0, g: 0, b: 0, a: 1 }
    if (str.length === 3) {
        const s0 = str[0] ?? '0', s1 = str[1] ?? '0', s2 = str[2] ?? '0'
        color = {
            r: parseInt(s0 + s0, 16),
            g: parseInt(s1 + s1, 16),
            b: parseInt(s2 + s2, 16),
            a: 1
        }
    } else if (str.length === 6) {
        color = {
            r: parseInt(str.substr(0, 2), 16),
            g: parseInt(str.substr(2, 2), 16),
            b: parseInt(str.substr(4, 2), 16),
            a: 1
        }
    } else if (str.length === 8) {
        color = {
            r: parseInt(str.substr(0, 2), 16),
            g: parseInt(str.substr(2, 2), 16),
            b: parseInt(str.substr(4, 2), 16),
            a: Math.round(parseInt(str.substr(6, 2), 16) / 255 * 100) / 100 // alpha channel 0-1
        }
    } else if (str.length > 4 && str.substr(0, 4) === 'RGB(') {
        const tmp = str.replace('RGB', '').replace(/\(/g, '').replace(/\)/g, '').split(',')
        color   = {
            r: parseInt(tmp[0] ?? '0', 10),
            g: parseInt(tmp[1] ?? '0', 10),
            b: parseInt(tmp[2] ?? '0', 10),
            a: 1
        }
    } else if (str.length > 5 && str.substr(0, 5) === 'RGBA(') {
        const tmp = str.replace('RGBA', '').replace(/\(/g, '').replace(/\)/g, '').split(',')
        color   = {
            r: parseInt(tmp[0] ?? '0', 10),
            g: parseInt(tmp[1] ?? '0', 10),
            b: parseInt(tmp[2] ?? '0', 10),
            a: parseFloat(tmp[3] ?? '1')
        }
    } else {
        // word color
        return null
    }
    return color
}

/**
 * Compute WCAG contrast ratio between two color strings.
 * Returns a string formatted to 2 decimal places (e.g. "21.00").
 * Uses local parseColor — NOT TsUtils.parseColor (N3 fix: no back-edge in DAG).
 */
export function colorContrast(color1: string, color2: string): string {
    const lum1 = calcLumens(color1)
    const lum2 = calcLumens(color2)
    const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)
    return ratio.toFixed(2)

    function calcLumens(color: string): number {
        const { r, g, b } = parseColor(color) ?? { r: 0, g: 0, b: 0, a: 1 }
        const gamma = 2.2
        const normR = r / 255
        const normG = g / 255
        const normB = b / 255
        const sR = (normR <= 0.03928) ? normR / 12.92 : Math.pow((normR + 0.055) / 1.055, gamma)
        const sG = (normG <= 0.03928) ? normG / 12.92 : Math.pow((normG + 0.055) / 1.055, gamma)
        const sB = (normB <= 0.03928) ? normB / 12.92 : Math.pow((normB + 0.055) / 1.055, gamma)
        return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB
    }
}

/**
 * Convert HSV to RGB.
 * Scales: h=0..360, s=0..100, v=0..100.
 * Dual-form: accepts either (h, s, v, a?) or a single object {h, s, v, a?}.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hsv2rgb(h: any, s?: any, v?: any, a?: any): { r: number; g: number; b: number; a: number } { // any: overloaded — first arg can be {h,s,v,a} object or a number
    let r: number | undefined, g: number | undefined, b: number | undefined
    // typeof detection (not arguments.length): delegator pattern always forwards 4 args, so length-based dispatch breaks object-form callers
    if (typeof h === 'object' && h !== null) {
        s = h.s; v = h.v; a = h.a; h = h.h
    }
    h = h / 360
    s = s / 100
    v = v / 100
    const i = Math.floor(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break
        case 1: r = q, g = v, b = p; break
        case 2: r = p, g = v, b = t; break
        case 3: r = p, g = q, b = v; break
        case 4: r = t, g = p, b = v; break
        case 5: r = v, g = p, b = q; break
    }
    return {
        r: Math.round((r ?? 0) * 255),
        g: Math.round((g ?? 0) * 255),
        b: Math.round((b ?? 0) * 255),
        a: (a != null ? a : 1)
    }
}

/**
 * Convert RGB to HSV.
 * Scales: r/g/b=0..255; returns h=0..360, s=0..100, v=0..100.
 * Dual-form: accepts either (r, g, b, a?) or a single object {r, g, b, a?}.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function rgb2hsv(r: any, g?: any, b?: any, a?: any): { h: number; s: number; v: number; a: number } { // any: overloaded — first arg can be {r,g,b,a} object or a number
    // typeof detection (not arguments.length): delegator pattern always forwards 4 args, so length-based dispatch breaks object-form callers
    if (typeof r === 'object' && r !== null) {
        g = r.g; b = r.b; a = r.a; r = r.r
    }
    const max = Math.max(r, g, b), min = Math.min(r, g, b),
        d = max - min
    let h: number | undefined
    const s = (max === 0 ? 0 : d / max),
        v = max / 255
    switch (max) {
        case min: h = 0; break
        case r: h = (g - b) + d * (g < b ? 6: 0); h /= 6 * d; break
        case g: h = (b - r) + d * 2; h /= 6 * d; break
        case b: h = (r - g) + d * 4; h /= 6 * d; break
    }
    return {
        h: Math.round((h ?? 0) * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100),
        a: (a != null ? a : 1)
    }
}
