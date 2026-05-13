/**
 * TsUtils marker sub-module — extracted pure functions for highlight/marker
 * Part of tsutils v2.1 SDD decomposition (Phase 6)
 * No default export. 4-space indent.
 */

import { query as _query, Query } from './query.js'
// Cast query to always return Query — same pattern as tsutils.ts line 48
// any: selector parameter is heterogeneous at call sites (string, Element, etc.)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const query = _query as (selector: any, context?: any) => Query

/** Options for TsUtils.marker() */
interface _W2MarkerOptions {
    onlyFirst?: boolean
    wholeWord?: boolean
    isRegex?: boolean
    tag?: string
    class?: string
    raplace?: (matched: string) => string
}

// any: el is string or HTMLElement; runtime-checked via typeof
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _clearMarkers(el: any, options: _W2MarkerOptions) {
    // options.class is always set (??= 'tsg-marker') before this helper is called — non-null assertion is safe
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const markerRE = new RegExp(`<${options.tag}[^>]*class=["']${options.class!.replace(/-/g, '\\-')}["'][^>]*>([\\s\\S]*?)<\\/${options.tag}>`, 'ig')
    if (typeof el == 'string') {
        while (el.indexOf(`<${options.tag} class="${options.class}"`) !== -1) {
            el = el.replace(markerRE, '$1') // unmark
        }
    } else {
        while (el.innerHTML.indexOf(`<${options.tag} class="${options.class}"`) !== -1) {
            el.innerHTML = el.innerHTML.replace(markerRE, '$1') // unmark
        }
    }
}

// any: _replace is an internal helper operating on raw HTML strings; terms are dynamic
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function _replace(html: any, term: any, replaceWith: any, options: _W2MarkerOptions) {
    const ww = options.wholeWord
    if (typeof term !== 'string') term = String(term)
    // escape regex special chars
    term = term
        .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&gt;')
        .replace(/>/g, '&lt;')
    // only outside tags
    // and only outside of quotes
    // let regex = new RegExp((ww ? '\\b' : '') + term + (ww ? '\\b' : '') + '(?=([a-z-0-9]+="[^"]*")*?[^"]+$)' + '(?!([^<]+)?>)', 'i' + (!options.onlyFirst ? 'g' : ''))
    // -- the one above would not match inside html tags
    const regex = new RegExp((ww ? '\\b' : '') + term + (ww ? '\\b' : '') + '(?![^<]*>)', 'i' + (!options.onlyFirst ? 'g' : ''))
    return html = html.replace(regex, replaceWith)
}

// any: parameter typed any — runtime dispatch by call site; TsUtils helper accepts heterogeneous runtime input
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function marker(el: any, items: any, options: any = { onlyFirst: false, wholeWord: false, isRegex: false}) {
    options.tag ??= 'span'
    options.class ??= 'tsg-marker'
    // any: matched is the regex capture group — dynamic string from DOM text
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options.raplace = (matched: any) => `<${options.tag} class="${options.class}">${matched}</${options.tag}>`

    const isRegexSearch = options.isRegex || false
    if (!Array.isArray(items)) {
        if (items != null && items !== '') {
            items = [items]
        } else {
            items = []
        }
    }
    if (typeof el == 'string') {
        _clearMarkers(el, options)
        // any: items is a mixed array of string/regex passed dynamically via marker() api
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        items.forEach((item: any) => {
            if (isRegexSearch) {
                // For regex searches with string elements
                try {
                    const flags = 'i' + (!options.onlyFirst ? 'g' : '')
                    const regex = new RegExp(item, flags)
                    el = el.replace(regex, options.raplace)
                } catch (e) {
                    console.error('Invalid regular expression:', e)
                    // Fallback to standard replace
                    el = _replace(el, item, options.raplace, options)
                }
            } else {
                // Standard string replace
                el = _replace(el, item, options.raplace, options)
            }
        })
    } else {
        // any: query.each() gives Node at runtime; el is HTMLElement — cast at use sites
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query(el).each((el: any) => {
            _clearMarkers(el, options)
            if (isRegexSearch) {
                // For regex searches, use DOM traversal approach
                // any: pattern is string|regex from dynamic items array
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items.forEach((pattern: any) => {
                    try {
                        let flags = 'i' // Always case-insensitive
                        if (!options.onlyFirst) {
                            flags += 'g' // Add 'g' for global unless onlyFirst is true
                        }
                        if (options.wholeWord) {
                            // If wholeWord is true, wrap the pattern with word boundary markers
                            pattern = '\b' + pattern + '\b'
                        }

                        const regex = new RegExp(pattern, flags)

                        // Get all text nodes
                        // any: DOM walker for arbitrary node tree — nodeType/tagName/childNodes are dynamic
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const textNodes: any[] = []
                        // any: callback parameter — caller signature varies; TsUtils helper accepts heterogeneous runtime input
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        function getTextNodes(node: any) {
                            if (node.nodeType === 3) { // Text node
                                textNodes.push(node)
                            } else if (node.nodeType === 1) { // Element node
                                // Skip script and style tags
                                if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
                                    for (let i = 0; i < node.childNodes.length; i++) {
                                        getTextNodes(node.childNodes[i])
                                    }
                                }
                            }
                        }

                        getTextNodes(el)

                        // Process each text node
                        textNodes.forEach(textNode => {
                            const text = textNode.nodeValue
                            const matches = []
                            let match

                            // Find all matches
                            if (options.onlyFirst) {
                                match = regex.exec(text)
                                if (match) matches.push({
                                    index: match.index,
                                    text: match[0]
                                })
                            } else {
                                while ((match = regex.exec(text)) !== null) {
                                    matches.push({
                                        index: match.index,
                                        text: match[0]
                                    })
                                }
                            }

                            // Apply highlighting
                            if (matches.length > 0) {
                                const parent = textNode.parentNode
                                const fragment = document.createDocumentFragment()
                                let lastIndex = 0

                                matches.forEach(match => {
                                    // Add text before match
                                    if (match.index > lastIndex) {
                                        fragment.appendChild(document.createTextNode(
                                            text.substring(lastIndex, match.index)
                                        ))
                                    }

                                    // Add highlighted match
                                    const span = document.createElement(options.tag)
                                    span.className = options.class
                                    span.appendChild(document.createTextNode(match.text))
                                    fragment.appendChild(span)

                                    lastIndex = match.index + match.text.length
                                })

                                // Add remaining text
                                if (lastIndex < text.length) {
                                    fragment.appendChild(document.createTextNode(
                                        text.substring(lastIndex)
                                    ))
                                }

                                // Replace the text node with our fragment
                                parent.replaceChild(fragment, textNode)
                            }
                        })
                    } catch (e) {
                        console.error('Invalid regular expression:', e)
                        // Fallback to standard innerHTML replace
                        // any: el from query.each() is Node; cast to HTMLElement for innerHTML
                        ;(el as HTMLElement).innerHTML = _replace((el as HTMLElement).innerHTML, pattern, options.raplace, options)
                    }
                })
            } else {
                // Standard innerHTML replace for non-regex
                // any: item from dynamic items array
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                items.forEach((item: any) => {
                    ;(el as HTMLElement).innerHTML = _replace((el as HTMLElement).innerHTML, item, options.raplace, options)
                })
            }
        })
    }
    return el
}
