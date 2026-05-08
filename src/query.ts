/* mQuery 0.7 (nightly) (8/15/2023, 11:44:12 AM), vitmalina@gmail.com */

type QuerySelector = string | Node | Window | Query | Array<Node | Element> | Iterable<Node | Element> | null | undefined
type QueryContext = Document | Element | ShadowRoot | DocumentFragment

interface EventRecord {
    event: string
    scope: string | undefined
    callback: EventListener
    options: AddEventListenerOptions | boolean | undefined
}

interface MQueryData {
    events?: EventRecord[]
    prevDisplay?: string
    [key: string]: unknown
}

// Extend Node to hold _mQuery data bag
declare global {
    interface Node {
        _mQuery?: MQueryData
    }
}

class Query {
    static version: number = 0.8
    context: QueryContext
    nodes: Node[]
    length: number
    [index: number]: Node

    constructor(selector: QuerySelector, context?: QueryContext) {
        this.context = context ?? document
        let nodes: Node[] = []
        if (Array.isArray(selector)) {
            nodes = selector
        } else if (selector instanceof Node || selector instanceof Window) { // any html element or Window
            nodes = [selector as Node]
        } else if (selector instanceof Query) {
            nodes = selector.nodes
        } else if (typeof selector == 'string') {
            if (typeof (this.context as Element).querySelector != 'function') {
                throw new Error('Invalid context')
            }
            nodes = Array.from((this.context as Element).querySelectorAll(selector))
        } else if (selector == null) {
            nodes = []
        } else {
            // if selector is itterable, then try to create nodes from it, also supports jQuery
            const arr = Array.from(selector ?? [])
            if (typeof selector == 'object' && Array.isArray(arr)) {
                nodes = arr
            } else {
                throw new Error(`Invalid selector "${selector}"`)
            }
        }
        this.nodes = nodes
        this.length = nodes.length
        // map nodes to object properties
        this.each((node, ind) => {
            this[ind] = node
        })
    }

    static _fragment(html: string): DocumentFragment {
        const tmpl = document.createElement('template')
        tmpl.innerHTML = html
        tmpl.content.childNodes.forEach(node => {
            const newNode = Query._scriptConvert(node)
            if (newNode != node) {
                tmpl.content.replaceChild(newNode, node)
            }
        })
        return tmpl.content
    }

    // innerHTML, append, etc. script tags will not be executed unless they are proper script tags
    static _scriptConvert(node: Node): Node {
        const convert = (txtNode: HTMLScriptElement): HTMLScriptElement => {
            const doc = txtNode.ownerDocument
            const scNode = doc.createElement('script')
            scNode.text = txtNode.text
            const attrs = txtNode.attributes
            for (let i = 0; i < attrs.length; i++) {
                const attr = attrs[i]
                if (attr) scNode.setAttribute(attr.name, attr.value)
            }
            return scNode
        }
        if ((node as Element).tagName == 'SCRIPT') {
            node = convert(node as HTMLScriptElement)
        }
        if ((node as Element).querySelectorAll) {
            (node as Element).querySelectorAll('script').forEach(textNode => {
                textNode.parentNode!.replaceChild(convert(textNode as HTMLScriptElement), textNode)
            })
        }
        return node
    }

    static _fixProp(name: string): string {
        const fixes: Record<string, string> = {
            cellpadding: 'cellPadding',
            cellspacing: 'cellSpacing',
            class: 'className',
            colspan: 'colSpan',
            contenteditable: 'contentEditable',
            for: 'htmlFor',
            frameborder: 'frameBorder',
            maxlength: 'maxLength',
            readonly: 'readOnly',
            rowspan: 'rowSpan',
            tabindex: 'tabIndex',
            usemap: 'useMap'
        }
        return fixes[name] ? fixes[name] : name
    }

    _insert(method: string, html: string | Query | Node): Query {
        const nodes: Node[] = []
        const len  = this.length
        if (len < 1) return this
        // TODO: need good unit test coverage for this function
        // any: callback parameter — caller signature varies; query DOM-traversal accepts arbitrary HTMLElement subclasses at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type AnyNodeMethod = Record<string, ((arg: any) => void) | undefined>
        if (typeof html == 'string') {
            this.each(node => {
                const clone = Query._fragment(html as string)
                nodes.push(...clone.childNodes)
                ;(node as unknown as AnyNodeMethod)[method]?.(clone)
            })
        } else if (html instanceof Query) {
            const single = (len == 1) // if inserting into a single container, then move it there
            html.each(el => {
                this.each(node => {
                    // if insert before a single node, just move new one, else clone and move it
                    const clone = (single ? el : el.cloneNode(true)) as Node
                    nodes.push(clone)
                    ;(node as unknown as AnyNodeMethod)[method]?.(clone)
                    Query._scriptConvert(clone)
                })
            })
            if (!single) html.remove()
        } else if (html instanceof Node) { // any HTML element
            this.each(node => {
                // if insert before a single node, just move new one, else clone and move it
                const clone: Node | DocumentFragment = (len === 1 ? html : Query._fragment((html as Element).outerHTML))
                nodes.push(...(len === 1 ? [html as Node] : (clone as DocumentFragment).childNodes))
                ;(node as unknown as AnyNodeMethod)[method]?.(clone)
            })
            if (len > 1) (html as Element).remove()
        } else {
            throw new Error(`Incorrect argument for "${method}(html)". It expects one string argument.`)
        }
        if (method == 'replaceWith') {
            return new Query(nodes, this.context) // must return a new collection
        }
        return this
    }

    _save(node: Node, name: string, value: unknown): void {
        node._mQuery = node._mQuery ?? {}
        if (Array.isArray(value)) {
            (node._mQuery[name] as unknown[]) = (node._mQuery[name] as unknown[]) ?? []
            ;(node._mQuery[name] as unknown[]).push(...value)
        } else if (value != null) {
            node._mQuery[name] = value
        } else {
            delete node._mQuery[name]
        }
    }

    get(index?: number): Node | Node[] | null {
        if (index === undefined || index === null) return this.nodes
        if (index < 0) index = this.length + index
        const node = this[index]
        if (node) {
            return node
        }
        return null
    }

    eq(index: number): Query {
        if (index < 0) index = this.length + index
        const item = this[index]
        const nodes: Node[] = item != null ? [item] : []
        return new Query(nodes, this.context) // must return a new collection
    }

    then(fun: (q: Query) => Query | null | undefined): Query {
        const ret = fun(this)
        return ret != null ? ret : this
    }

    find(selector: string): Query {
        const nodes: Node[] = []
        this.each(node => {
            const nn = Array.from((node as Element).querySelectorAll(selector))
            if (nn.length > 0) {
                nodes.push(...nn)
            }
        })
        return new Query(nodes, this.context) // must return a new collection
    }

    filter(selector: string | Node | ((node: Node) => boolean)): Query {
        const nodes: Node[] = []
        this.each(node => {
            if (node === selector
                || (typeof selector == 'string' && (node as Element).matches && (node as Element).matches(selector))
                || (typeof selector == 'function' && selector(node))
            ) {
                nodes.push(node)
            }
        })
        return new Query(nodes, this.context) // must return a new collection
    }

    next(): Query {
        const nodes: Node[] = []
        this.each(node => {
            const nn = (node as Element).nextElementSibling
            if (nn) { nodes.push(nn) }
        })
        return new Query(nodes, this.context) // must return a new collection
    }

    prev(): Query {
        const nodes: Node[] = []
        this.each(node => {
            const nn = (node as Element).previousElementSibling
            if (nn) { nodes.push(nn)}
        })
        return new Query(nodes, this.context) // must return a new collection
    }

    shadow(selector?: string): Query {
        const nodes: Node[] = []
        this.each(node => {
            // select shadow root if available
            if ((node as Element).shadowRoot) nodes.push((node as Element).shadowRoot!)
        })
        const col = new Query(nodes, this.context)
        return selector ? col.find(selector) : col
    }

    closest(selector: string): Query {
        const nodes: Node[] = []
        this.each(node => {
            const nn = (node as Element).closest(selector)
            if (nn) {
                nodes.push(nn)
            }
        })
        return new Query(nodes, this.context) // must return a new collection
    }

    host(all?: boolean): Query {
        const nodes: Node[] = []
        // find shadow root or body
        const top = (node: Node): Node => {
            if (node.parentNode) {
                return top(node.parentNode)
            } else {
                return node
            }
        }
        const fun = (node: Node) => {
            const nn = top(node)
            nodes.push((nn as ShadowRoot).host ? (nn as ShadowRoot).host : nn)
            if ((nn as ShadowRoot).host && all) fun((nn as ShadowRoot).host)
        }
        this.each(node => {
            fun(node)
        })
        return new Query(nodes, this.context) // must return a new collection
    }

    parent(selector?: string): Query {
        return this.parents(selector, true)
    }

    parents(selector?: string, firstOnly?: boolean): Query {
        const nodes: Node[] = []
        const add = (node: Node) => {
            if (nodes.indexOf(node) == -1) {
                nodes.push(node)
            }
            if (!firstOnly && node.parentNode) {
                return add(node.parentNode)
            }
        }
        this.each(node => {
            if (node.parentNode) add(node.parentNode)
        })
        const col = new Query(nodes, this.context)
        return selector ? col.filter(selector) : col
    }

    add(more: Query | Node | Node[]): Query {
        const nodes = more instanceof Query ? more.nodes : (Array.isArray(more) ? more : [more])
        return new Query(this.nodes.concat(nodes), this.context) // must return a new collection
    }

    each(func: (node: Node, ind: number, col: Query) => void): Query {
        this.nodes.forEach((node, ind) => { func(node, ind, this) })
        return this
    }

    append(html: string | Query | Node): Query {
        return this._insert('append', html)
    }

    prepend(html: string | Query | Node): Query {
        return this._insert('prepend', html)
    }

    after(html: string | Query | Node): Query {
        return this._insert('after', html)
    }

    before(html: string | Query | Node): Query {
        return this._insert('before', html)
    }

    replace(html: string | Query | Node): Query {
        return this._insert('replaceWith', html)
    }

    remove(): Query {
        // remove from dom, but keep in current query
        this.each(node => { (node as Element).remove() })
        return this
    }

    css(key?: string | Record<string, string | number>, value?: string | number): string | Record<string, string> | undefined | Query {
        let css: Record<string, string | number> = typeof key === 'object' ? key : {}
        const len = arguments.length
        if (len === 0 || (len === 1 && typeof key == 'string')) {
            if (this[0]) {
                const st = (this[0] as HTMLElement).style
                // do not do computedStyleMap as it is not what on immediate element
                if (typeof key == 'string') {
                    const pri = st.getPropertyPriority(key)
                    return st.getPropertyValue(key) + (pri ? '!' + pri : '')
                } else {
                    return Object.fromEntries(
                        (this[0] as HTMLElement).style.cssText
                            .split(';')
                            .filter(a => !!a) // filter non-empty
                            .map(a => {
                                return a.split(':').map(a => a.trim()) // trim strings
                            })
                    )
                }
            } else {
                return undefined
            }
        } else {
            if (typeof key != 'object') {
                css = {}
                css[key as string] = value as string | number
            }
            this.each((el) => {
                Object.keys(css).forEach(key => {
                    const imp = String(css[key]).toLowerCase().includes('!important') ? 'important' : ''
                    ;(el as HTMLElement).style.setProperty(key, String(css[key]).replace(/\!important/i, ''), imp)
                })
            })
            return this
        }
    }

    addClass(classes: string): Query {
        this.toggleClass(classes, true)
        return this
    }

    removeClass(classes: string | string[] | null): Query {
        this.toggleClass(classes, false)
        return this
    }

    toggleClass(classes: string | string[] | null, force?: boolean): Query {
        // split by comma or space
        if (typeof classes == 'string') classes = classes.split(/[,\s]+/)
        this.each(node => {
            let classes2: string[] | null = classes as string[] | null
            // if not defined, remove all classes
            if (classes2 == null && force === false) classes2 = Array.from((node as Element).classList)
            if (classes2) {
                classes2.forEach(className => {
                    if (className !== '') {
                        let act: 'toggle' | 'add' | 'remove' = 'toggle'
                        if (force != null) act = force ? 'add' : 'remove'
                        ;(node as Element).classList[act](className)
                    }
                })
            }
        })
        return this
    }

    hasClass(classes: string | string[] | null): boolean | string[] {
        // split by comma or space
        if (typeof classes == 'string') classes = classes.split(/[,\s]+/)
        if (classes == null && this.length > 0) {
            return Array.from((this[0] as Element).classList)
        }
        let ret = false
        this.each(node => {
            ret = ret || (classes as string[]).every(className => {
                return Array.from((node as Element).classList ?? []).includes(className)
            })
        })
        return ret
    }

    on(events: string, options: AddEventListenerOptions | EventListener | { delegate?: string } | undefined, callback?: EventListener): Query
    on(events: string, callback: EventListener): Query
    on(events: string, optionsOrCallback: AddEventListenerOptions | EventListener | { delegate?: string } | undefined, callback?: EventListener): Query {
        let options: AddEventListenerOptions | boolean | undefined = undefined
        if (typeof optionsOrCallback == 'function') {
            callback = optionsOrCallback as EventListener
            options = undefined
        } else {
            options = optionsOrCallback as AddEventListenerOptions | undefined
        }
        let delegate: string | undefined
        if ((options as { delegate?: string })?.delegate) {
            delegate = (options as { delegate?: string }).delegate
            delete (options as { delegate?: string }).delegate // not to pass to addEventListener
        }
        const eventsStr = events.split(/[,\s]+/) // separate by comma or space
        eventsStr.forEach(eventName => {
            const parts = String(eventName).toLowerCase().split('.')
            const event = parts[0] ?? ''
            const scope = parts[1]
            let cb = callback!
            if (delegate) {
                const fun = cb
                cb = (evt: Event) => {
                    // event.target or any ancestors match delegate selector
                    const parent = (query(evt.target as Element) as Query).parents(delegate)
                    if (parent.length > 0) { (evt as unknown as Record<string, unknown>)['delegate'] = parent[0] } else { (evt as unknown as Record<string, unknown>)['delegate'] = evt.target }
                    if ((evt.target as Element).matches(delegate!) || parent.length > 0) {
                        fun(evt)
                    }
                }
            }
            this.each(node => {
                this._save(node, 'events', [{ event, scope, callback: cb, options }])
                node.addEventListener(event, cb, options as AddEventListenerOptions)
            })
        })
        return this
    }

    off(events?: string, options?: AddEventListenerOptions | EventListener, callback?: EventListener): Query {
        if (typeof options == 'function') {
            callback = options as EventListener
            options = undefined
        }
        const eventsStr = (events ?? '').split(/[,\s]+/) // separate by comma or space
        eventsStr.forEach(eventName => {
            const offParts = String(eventName).toLowerCase().split('.')
            const event = offParts[0] ?? ''
            const scope = offParts[1]
            this.each(node => {
                if (Array.isArray(node._mQuery?.events)) {
                    for (let i = node._mQuery!.events!.length - 1; i >= 0; i--) {
                        const evt = node._mQuery!.events![i]
                        if (!evt) continue
                        if (scope == null || scope === '') {
                            // if no scope, has to be exact match
                            if ((evt.event == event || event === '') && (evt.callback == callback || callback == null)) {
                                node.removeEventListener(evt.event, evt.callback, evt.options as AddEventListenerOptions)
                                node._mQuery!.events!.splice(i, 1)
                            }
                        } else {
                            if ((evt.event == event || event === '') && evt.scope == scope) {
                                node.removeEventListener(evt.event, evt.callback, evt.options as AddEventListenerOptions)
                                node._mQuery!.events!.splice(i, 1)
                            }
                        }
                    }
                }
            })
        })
        return this
    }

    trigger(name: string | Event | CustomEvent, options?: EventInit): Query {
        let event: Event
        const mevent = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove']
        const kevent = ['keydown', 'keyup', 'keypress']
        if (name instanceof Event) {
            // MouseEvent and KeyboardEvent are instances of Event, no need to explicitly add
            event = name
        } else if (mevent.includes(name)) {
            event = new MouseEvent(name, options as MouseEventInit)
        } else if (kevent.includes(name)) {
            event = new KeyboardEvent(name, options as KeyboardEventInit)
        } else {
            event = new Event(name, options)
        }
        this.each(node => { node.dispatchEvent(event) })
        return this
    }

    attr(name: string): string | undefined
    attr(name: string | Record<string, string>, value?: string): Query
    attr(name: string | Record<string, string>, value?: string): string | undefined | Query {
        if (value === undefined && typeof name == 'string') {
            return this[0] ? (this[0] as Element).getAttribute(name) ?? undefined : undefined
        } else {
            let obj: Record<string, string> = {}
            if (typeof name == 'object') obj = name; else obj[name] = value!
            this.each(node => {
                Object.entries(obj).forEach(([nm, val]) => { (node as Element).setAttribute(nm, val) })
            })
            return this
        }
    }

    removeAttr(...attrs: string[]): Query {
        this.each(node => {
            attrs.forEach(attr => {
                (node as Element).removeAttribute(attr)
            })
        })
        return this
    }

    prop(name: string): unknown
    prop(name: string | Record<string, unknown>, value?: unknown): Query
    prop(name: string | Record<string, unknown>, value?: unknown): unknown | Query {
        if (value === undefined && typeof name == 'string') {
            return this[0] ? (this[0] as unknown as Record<string, unknown>)[name] : undefined
        } else {
            let obj: Record<string, unknown> = {}
            if (typeof name == 'object') obj = name; else obj[name] = value
            this.each(node => {
                Object.entries(obj).forEach(([nm, val]) => {
                    const prop = Query._fixProp(nm)
                    ;(node as unknown as Record<string, unknown>)[prop] = val
                    if (prop == 'innerHTML') {
                        Query._scriptConvert(node)
                    }
                })
            })
            return this
        }
    }

    removeProp(...props: string[]): Query {
        this.each(node => {
            props.forEach(prop => { delete (node as unknown as Record<string, unknown>)[Query._fixProp(prop)] })
        })
        return this
    }

    data(key?: string | Record<string, unknown>, value?: unknown): unknown | Query {
        if (key instanceof Object && !(typeof key === 'string')) {
            Object.entries(key as Record<string, unknown>).forEach(item => { this.data(item[0], item[1]) })
            return
        }
        if (key && typeof key === 'string' && key.indexOf('-') != -1) {
            console.error(`Key "${key}" contains "-" (dash). Dashes are not allowed in property names. Use camelCase instead.`)
        }
        if (arguments.length < 2) {
            if (this[0]) {
                const data: Record<string, unknown> = Object.assign({}, (this[0] as HTMLElement).dataset)
                Object.keys(data).forEach(k => {
                    const v = data[k] as string
                    if (v.startsWith('[') || v.startsWith('{')) {
                        try { data[k] = JSON.parse(v) } catch (e) {}
                    }
                })
                return key ? data[key as string] : data
            } else {
                return undefined
            }
        } else {
            this.each(node => {
                if (value != null) {
                    (node as HTMLElement).dataset[key as string] = value instanceof Object ? JSON.stringify(value) : value as string
                } else {
                    delete (node as HTMLElement).dataset[key as string]
                }
            })
            return this
        }
    }

    removeData(key: string | string[]): Query {
        if (typeof key == 'string') key = key.split(/[,\s]+/)
        this.each(node => {
            (key as string[]).forEach(k => { delete (node as HTMLElement).dataset[k] })
        })
        return this
    }

    show(): Query {
        return this.toggle(true)
    }

    hide(): Query {
        return this.toggle(false)
    }

    toggle(force?: boolean): Query {
        return this.each(node => {
            const prev = (node as HTMLElement).style.display
            const dsp  = getComputedStyle(node as Element).display
            const isHidden = (prev == 'none' || dsp == 'none')
            if (isHidden && (force == null || force === true)) { // show
                const def = node instanceof HTMLTableRowElement
                    ? 'table-row'
                    : node instanceof HTMLTableCellElement
                        ? 'table-cell'
                        : 'block'
                ;(node as HTMLElement).style.display = (node._mQuery?.prevDisplay as string) ?? (prev == dsp && dsp != 'none' ? '' : def)
                this._save(node, 'prevDisplay', null)
            }
            if (!isHidden && (force == null || force === false)) { // hide
                if (dsp != 'none') this._save(node, 'prevDisplay', dsp)
                ;(node as HTMLElement).style.setProperty('display', 'none')
            }
        })
    }

    empty(): Query {
        return this.html('') as Query
    }

    html(html?: string | HTMLElement): string | Query | undefined {
        if (html instanceof HTMLElement) {
            return (this.empty() as Query).append(html)
        } else {
            return this.prop('innerHTML', html) as Query
        }
    }

    text(text?: string): unknown | Query {
        return this.prop('textContent', text)
    }

    val(value?: string): unknown | Query {
        return this.prop('value', value) // must be prop
    }

    change(): Query {
        return this.trigger('change')
    }

    click(): Query {
        return this.trigger('click')
    }
}

// create a new object each time
const query = function (selector: QuerySelector | (() => void), context?: QueryContext): Query | void {
    // if a function, use as onload event
    if (typeof selector == 'function') {
        const fn = selector as () => void
        if (document.readyState == 'complete') {
            fn()
        } else {
            window.addEventListener('load', fn as EventListenerOrEventListenerObject)
        }
    } else {
        return new Query(selector, context)
    }
}
// str -> doc-fragment
query.html = (str: string): Query => { const frag = Query._fragment(str); return query(frag.children, frag) as Query }
query.version = Query.version
export { query as $, query as default, query, Query }
