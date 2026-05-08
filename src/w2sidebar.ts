/**
 * Part of w2ui 2.0 library
 *  - Dependencies: mQuery, w2utils, w2base, w2tooltip, w2menu
 *
 * == TODO ==
 *  - dbl click should be like it is in grid (with timer not HTML dbl click event)
 *  - node.style is misleading - should be there to apply color for example
 *  - node.plus - is not working
 *
 * == 2.0 changes
 *  - remove jQuery dependency
 *  - deprecarted obj.img, node.img
 *  - CSP - fixed inline events
 *  - observeResize for the box
 *  - search(..., compare) - comparison function
 *  - editable = true
 *  - edit(id) - new method
 *  - onEdit, onRename - new events
 *  - reorder = true - to allow reorder
 *  - mouseDown - for reorder
 *  - onReorder, onDragStart, onDragOver - events
 *  - this.mutlti - for multi select (ctrl for one at a time and shift for range)
 *  - onSelect, onUnselect - new events
 *  - prev(), next(), getChain()
 */

import { w2base } from './w2base.js'
import { w2ui, w2utils } from './w2utils.js'
import { query as _queryRaw, Query } from './query.js'
import { w2tooltip, w2menu } from './w2tooltip.js'
// any: query() returns Query|void; cast once here for clean chaining
const query = _queryRaw as (selector: unknown, context?: unknown) => Query

// ---------------------------------------------------------------------------
// Option shapes for public methods
// ---------------------------------------------------------------------------

/** Options accepted by refresh() */
interface W2SidebarRefreshOptions {
    recursive?: boolean
}

/** Options accepted by update() — mirrors node property names that can be updated in-place */
interface W2SidebarUpdateOptions {
    icon?: string | ((nd: unknown, level: number) => string) | null
    class?: string | null
    style?: string | null
    text?: string | ((nd: unknown, level: number) => string) | null
    count?: number | string | null
    [key: string]: unknown // remaining props returned as-is
}

/** Options accepted by setCount() */
interface W2SidebarSetCountOptions {
    className?: string
    style?: string
    noRepeat?: boolean
}

/** Options for find() */
interface W2SidebarFindOptions {
    returnDisabled?: boolean
    returnGroups?: boolean
    [key: string]: unknown
}

/** Options for sort() */
interface W2SidebarSortOptions {
    foldersFirst?: boolean
    caseSensitive?: boolean
    reverse?: boolean
    [key: string]: unknown
}

class w2sidebar extends w2base {
    declare box: HTMLElement | null
    declare name: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nodes: any[] // any: sidebar node tree has dynamic shape
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    selected: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    img: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any
    style: string
    hasFocus: boolean
    flat: boolean
    flatButton: boolean
    keyboard: boolean
    editable: boolean
    reorder: boolean
    tabIndex: number | null
    routeData: Record<string, unknown>
    multi: boolean
    skipRefresh: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    last: any // any: accumulates move, renaming, observeResize
    node_template: Record<string, unknown>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(options: any) { // any: options bag — mixed type at construction time
        super(options.name)
        this.name          = ''
        this.box           = null
        this['sidebar']    = null
        this['parent']     = null
        this.nodes         = [] // Sidebar child nodes
        this['menu']       = []
        this.routeData     = {} // data for dynamic routes
        this.selected      = null // current selected node (readonly)
        this.icon          = null
        this.style         = ''
        this['topHTML']    = ''
        this['bottomHTML'] = ''
        this.multi         = false
        this.editable      = false
        this.reorder       = false
        this.flatButton    = false
        this.keyboard      = true
        this.flat          = false
        this.hasFocus      = false
        this['levelPadding'] = 12
        this['toggleAlign']  = 'right' // can be left or right
        this.skipRefresh   = false
        this.tabIndex      = null // will only be set if > 0 and not null
        this['handle']        = { width: 0, style: '', text: '', tooltip: '' }
        this['badge']         = null
        this['onClick']       = null // Fire when user click on Node Text
        this['onSelect']      = null
        this['onUnselect']    = null
        this['onDblClick']    = null // Fire when user dbl clicks
        this['onMouseEnter']  = null // mouse enter/leave over an item
        this['onMouseLeave']  = null
        this['onContextMenu'] = null
        this['onMenuClick']   = null // when context menu item selected
        this['onExpand']      = null // Fire when node expands
        this['onCollapse']    = null // Fire when node collapses
        this['onKeydown']     = null
        this['onRender']      = null
        this['onRefresh']     = null
        this['onResize']      = null
        this['onDestroy']     = null
        this['onFocus']       = null
        this['onBlur']        = null
        this['onFlat']        = null
        this['onEdit']        = null
        this['onRename']      = null
        this['onReorder']     = null
        this['onDragStart']   = null
        this['onDragOver']    = null
        this.node_template = {
            id: null,
            text: '',
            order: null,
            count: null,
            icon: null,
            nodes: [],
            style: '', // additional style for subitems
            route: null,
            selected: false,
            expanded: false,
            hidden: false,
            disabled: false,
            group: false, // if true, it will build as a group
            groupShowHide: true,
            collapsible: false,
            plus: false, // if true, plus will be shown even if there is no sub nodes
            childOffset: 0,
            // events
            onClick: null,
            onDblClick: null,
            onContextMenu: null,
            onExpand: null,
            onCollapse: null,
            // internal
            parent: null, // node object
            sidebar: null
        }
        this.last = {
            badge: {},
            renaming: false,
            move: null,     // object, move details
        }
        const nodes = options.nodes
        delete options.nodes
        // mix in options
        Object.assign(this, options)
        // add item via method to makes sure item_template is applied
        if (Array.isArray(nodes)) this.add(nodes)
        // need to reassign back to keep it in config
        options.nodes = nodes

        // render if box specified
        // any: query().get(0) returns Node|Node[]; box selector always resolves to HTMLElement
        if (typeof this.box == 'string') this.box = query(this.box).get(0) as HTMLElement
        if (this.box) this.render(this.box)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    add(parent?: any, nodes?: any) {
        if (nodes === undefined) {
            // need to be in reverse order
            nodes  = parent
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            parent = this
        }
        if (typeof parent == 'string') parent = this.get(parent)
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        if (parent == null || parent == '') parent = this
        return this.insert(parent, null, nodes)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    insert(parent?: any, before?: any, nodes?: any) {
        let txt, ind, tmp, node, nd
        if (nodes === undefined && typeof parent == 'string') {
            // need to be in reverse order
            nodes  = before
            before = parent
            if (before != null) {
                ind = this.get(before)
                if (ind == null) {
                    if (!Array.isArray(nodes)) nodes = [nodes]
                    if (nodes[0].caption != null && nodes[0].text == null) {
                        console.log('NOTICE: sidebar node.caption property is deprecated, please use node.text. Node -> ', nodes[0])
                        nodes[0].text = nodes[0].caption
                    }
                    txt = nodes[0].text
                    console.log('ERROR: Cannot insert node "'+ txt +'" because cannot find node "'+ before +'" to insert before.')
                    return null
                }
                parent = this.get(before).parent
            } else {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                parent = this
            }
        }
        if (typeof parent == 'string') parent = this.get(parent)
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        if (parent == null || parent == '') parent = this
        if (!Array.isArray(nodes)) nodes = [nodes]
        for (let o = 0; o < nodes.length; o++) {
            node = nodes[o]
            if (node.caption != null && node.text == null) {
                console.log('NOTICE: sidebar node.caption property is deprecated, please use node.text')
                node.text = node.caption
            }
            if (typeof node.id == null) {
                txt = node.text
                console.log('ERROR: Cannot insert node "'+ txt +'" because it has no id.')
                continue
            }
            if (this.get(this, node.id) != null) {
                console.log('ERROR: Cannot insert node with id='+ node.id +' (text: '+ node.text + ') because another node with the same id already exists.')
                continue
            }
            tmp         = Object.assign({}, this.node_template, node)
            tmp.sidebar = this
            tmp.parent  = parent
            nd          = tmp.nodes || []
            tmp.nodes   = [] // very important to re-init empty nodes array
            if (before == null) { // append to the end
                parent.nodes.push(tmp)
            } else {
                ind = this.get(parent, before, true)
                if (ind == null) {
                    console.log('ERROR: Cannot insert node "'+ node.text +'" because cannot find node "'+ before +'" to insert before.')
                    return null
                }
                parent.nodes.splice(ind, 0, tmp)
            }
            if (nd.length > 0) {
                this.insert(tmp, null, nd)
            }
        }
        if (!this.skipRefresh) this.refresh(parent.id)
        return tmp
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    remove(...args: any[]) { // multiple arguments
        let effected = 0
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let lastNode: any = null // any: node objects have dynamic shape; tracks last removed for refresh
        args.forEach(arg => {
            const node = this.get(arg)
            if (node == null) return
            if (this.selected != null) {
                if (Array.isArray(this.selected)) {
                    this.selected.splice(this.selected.indexOf(node.id), 1)
                } else if (this.selected === node.id) {
                    this.selected = null
                }
            }
            const ind = this.get(node.parent, arg, true)
            if (ind == null) return
            if (node.parent.nodes[ind].selected) node['sidebar'].unselect(node.id)
            node.parent.nodes.splice(ind, 1)
            node.parent.collapsible = node.parent.nodes.length > 0
            lastNode = node
            effected++
        })
        if (!this.skipRefresh) {
            if (effected > 0 && arguments.length == 1 && lastNode != null) this.refresh(lastNode.parent.id); else this.refresh()
        }
        return effected
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    set(parent?: any, id?: any, node?: any) {
        if (node === undefined) {
            // need to be in reverse order
            node   = id
            id     = parent
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            parent = this
        }
        // searches all nested nodes
        if (typeof parent == 'string') parent = this.get(parent)
        if (parent.nodes == null) return null
        for (let i = 0; i < parent.nodes.length; i++) {
            if (parent.nodes[i].id === id) {
                // see if quick update is possible
                const res = this.update(id, node)
                if (Object.keys(res).length != 0) {
                    // make sure nodes inserted correctly
                    const nodes = node.nodes
                    w2utils.extend(parent.nodes[i], node, (nodes != null ? { nodes: [] } : {}))
                    if (nodes != null) {
                        this.add(parent.nodes[i], nodes)
                    }
                    if (!this.skipRefresh) this.refresh(id)
                }
                return true
            } else {
                const rv = this.set(parent.nodes[i], id, node)
                if (rv) return true
            }
        }
        return false
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(parent?: any, id?: any, returnIndex?: any): any { // can be just called get(id) or get(id, true)
        if (arguments.length === 0) {
            const all = []
            const tmp = this.find({})
            for (let t = 0; t < tmp.length; t++) {
                if (tmp[t].id != null) all.push(tmp[t].id)
            }
            return all
        } else {
            if (arguments.length == 1 || (arguments.length == 2 && id === true) ) {
                // need to be in reverse order
                returnIndex = id
                id          = parent
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                parent      = this
            }
            // searches all nested nodes
            if (typeof parent == 'string') parent = this.get(parent)
            if (parent.nodes == null) return null
            for (let i = 0; i < parent.nodes.length; i++) {
                if (parent.nodes[i].id == id) {
                    if (returnIndex === true) return i; else return parent.nodes[i]
                } else {
                    const rv = this.get(parent.nodes[i], id, returnIndex)
                    if (rv || rv === 0) return rv
                }
            }
            return null
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setCount(id: any, count: any, options: W2SidebarSetCountOptions = {}) { // any: node id + count are runtime-typed
        const node = this.get(id)
        if (node.group) {
            console.log(`Node "${id}" is a group and groups cannot have counts or badges.`)
            return
        }
        this.last.badge[id] = {
            className: options.className ?? '',
            style: options.style ?? ''
        }
        const btn = query(this.box).find(`#node_${w2utils.escapeId(id)} .w2ui-node-badge`)
        if (btn.length > 0) {
            // any: query().text(val) returns unknown|Query; setter always returns Query here
            const $cnt = (btn.removeClass(null)
                .addClass(`w2ui-node-badge ${options.className ?? 'w2ui-node-count'}`)
                .text(count) as unknown as Query)
            // any: query().get(0) returns Node|Node[]; badge button is always HTMLElement
            ;($cnt.get(0) as HTMLElement).style.cssText = options.style || ''
            const item = this.get(id)
            item.count = count
        } else if (!options.noRepeat) {
            this.set(id, { count })
            options.noRepeat = true
            queueMicrotask(() => this.setCount(id, count, options)) // to update styles
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    find(parent?: any, params?: any, results?: any): any { // can be just called find({ selected: true })
        // TODO: rewrite with this.each()
        if (arguments.length == 1) {
            // need to be in reverse order
            params = parent
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            parent = this
        }
        if (!results) results = []
        // searches all nested nodes
        if (typeof parent == 'string') parent = this.get(parent)
        if (parent.nodes == null) return results
        for (let i = 0; i < parent.nodes.length; i++) {
            let match = true
            for (const prop in params) { // params is an object
                if (parent.nodes[i][prop] != params[prop]) match = false
            }
            if (match) results.push(parent.nodes[i])
            if (parent.nodes[i].nodes.length > 0) results = this.find(parent.nodes[i], params, results)
        }
        return results
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sort(options: W2SidebarSortOptions | null | undefined, nodes?: any) { // any: recursive call passes node subtree of unknown shape
        // default options
        if (!options || typeof options != 'object') options = {}
        if (options.foldersFirst == null) options.foldersFirst = true
        if (options.caseSensitive == null) options.caseSensitive = false
        if (options.reverse == null) options.reverse = false

        if (nodes == null) {
            nodes = this.nodes
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nodes.sort((a: any, b: any) => { // any: node objects have dynamic shape
            // folders first
            const isAfolder = (a.nodes && a.nodes.length > 0)
            const isBfolder = (b.nodes && b.nodes.length > 0)
            // both folder or both not folders
            if (options.foldersFirst === false || (!isAfolder && !isBfolder) || (isAfolder && isBfolder)) {
                let aText = a.text
                let bText = b.text
                if (a.order != null) aText = a.order
                if (b.order != null) bText = b.order
                if (!options.caseSensitive) {
                    aText = aText.toLowerCase()
                    bText = bText.toLowerCase()
                }
                const cmp = w2utils.naturalCompare(aText, bText)
                // any: bitwise-AND on boolean mirrors original JS behavior (truthy = reversed)
                return ((cmp === 1 || cmp === -1) as unknown as number) & (options.reverse ? 1 : 0) ? -cmp : cmp
            }
            if (isAfolder && !isBfolder) {
                return !options.reverse ? -1 : 1
            }
            if (!isAfolder && isBfolder) {
                return !options.reverse ? 1 : -1
            }
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nodes.forEach((node: any) => { // any: node objects have dynamic shape
            if (node.nodes && node.nodes.length > 0) {
                this.sort(options, node.nodes)
            }
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    each(fn: any, nodes?: any) { // any: fn is a user-supplied callback; nodes is a dynamic node array
        if (nodes == null) nodes = this.nodes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nodes.forEach((node: any) => { // any: node objects have dynamic shape
            fn.call(this, node)
            if (node.nodes && node.nodes.length > 0) {
                this.each(fn, node.nodes)
            }
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    search(str: any, compare: any = null) { // any: str is searched text; compare is an optional user callback
        let count = 0
        const str2  = str.toLowerCase()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.each((node: any) => { // any: node objects have dynamic shape
            let match = false
            if (typeof compare == 'function') {
                match = compare(str, node)
            } else {
                match = !(node.text.toLowerCase().indexOf(str2) === -1)
            }
            if (match) {
                count++
                showParents(node)
                node.hidden = false
            } else {
                node.hidden = true
            }
        })
        this.refresh()
        return count

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function showParents(node: any): void { // any: node objects have dynamic shape
            if (node.parent) {
                node.parent.hidden = false
                showParents(node.parent)
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    show(...args: any[]) { // multiple arguments
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const effected: any[] = [] // any: node ids can be string|number at runtime
        args.forEach(it => {
            const node = this.get(it)
            if (node == null || node.hidden === false) return
            node.hidden = false
            effected.push(node.id)
        })
        if (effected.length > 0) {
            if (args.length == 1) this.refresh(args[0]); else this.refresh()
        }
        return effected
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hide(...args: any[]) { // multiple arguments
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const effected: any[] = [] // any: node ids can be string|number at runtime
        args.forEach(it => {
            const node = this.get(it)
            if (node == null || node.hidden === true) return
            node.hidden = true
            effected.push(node.id)
        })
        if (effected.length > 0) {
            if (args.length == 1) this.refresh(args[0]); else this.refresh()
        }
        return effected
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    enable(...args: any[]) { // multiple arguments
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const effected: any[] = [] // any: node ids can be string|number at runtime
        args.forEach(it => {
            const node = this.get(it)
            if (node == null || node.disabled === false) return
            node.disabled = false
            effected.push(node.id)
        })
        if (effected.length > 0) {
            if (args.length == 1) this.refresh(args[0]); else this.refresh()
        }
        return effected
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    disable(...args: any[]) { // multiple arguments
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const effected: any[] = [] // any: node ids can be string|number at runtime
        args.forEach(it => {
            const node = this.get(it)
            if (node == null || node.disabled === true) return
            node.disabled = true
            if (node.selected) this.unselect(node.id)
            effected.push(node.id)
        })
        if (effected.length > 0) {
            if (args.length == 1) this.refresh(args[0]); else this.refresh()
        }
        return effected
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    select(id: any) { // any: node id is string|number at runtime
        if (Array.isArray(id)) {
            [...id].forEach(id => this.select(id))
            return
        }
        const new_node = this.get(id)
        if (!new_node) return false
        // event before
        const edata = this.trigger('select', { target: id, id, node: new_node })
        if (edata.isCancelled === true) {
            return true
        }
        // if already selected
        if (!this.multi && this.selected == id && new_node.selected) {
            return false
        } else {
            // unselect all previously selected nodes
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.find({ selected: true }).forEach((nd: any) => nd.selected = false) // any: node objects have dynamic shape
        }
        const $el = query(this.box).find('#node_'+ w2utils.escapeId(id))
        $el.addClass('w2ui-selected')
            .find('.w2ui-icon')
            .addClass('w2ui-icon-selected')
        if ($el.length > 0) {
            if (!this.inView(id)) this.scrollIntoView(id)
        }
        new_node.selected = true
        if (this.multi) {
            if (!Array.isArray(this.selected)) {
                this.selected = this.selected ? [this.selected] : []
            }
            this.selected.push(id)
        } else {
            this.selected = this.multi ? [id] : id
        }
        edata.finish()
        return true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unselect(id?: any) { // any: node id is string|number at runtime; optional to unselect all
        // if no arguments provided, unselect selected node
        if (arguments.length === 0) {
            id = this.selected
        }
        if (Array.isArray(id)) {
            [...id].forEach(id => this.unselect(id))
            return
        }
        const current = this.get(id)
        if (!current) return false
        // event before
        const edata = this.trigger('unselect', { target: id, id, node: current })
        if (edata.isCancelled === true) {
            return true
        }
        current.selected = false
        query(this.box).find('#node_'+ w2utils.escapeId(id))
            .removeClass('w2ui-selected')
            .find('.w2ui-icon').removeClass('w2ui-icon-selected')
        if (typeof this.selected == 'string' && this.selected == id) {
            this.selected = null
        }
        if (this.multi && Array.isArray(this.selected)) {
            const ind = this.selected.indexOf(id)
            if (ind != -1) this.selected.splice(ind, 1)
        }
        edata.finish()
        return true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toggle(id: any) { // any: node id is string|number at runtime
        const nd = this.get(id)
        if (nd == null) return false
        if (nd.plus) {
            this.set(id, { plus: false })
            this.expand(id)
            this.refresh(id)
            return
        }
        if (nd.nodes.length === 0) return false
        if (!nd.collapsible) return false
        if (this.get(id).expanded) return this.collapse(id); else return this.expand(id)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collapse(id: any) { // any: node id is string|number at runtime
        const nd = this.get(id)
        if (nd == null) return false
        // event before
        const edata = this.trigger('collapse', { target: id, object: nd, node: nd })
        if (edata.isCancelled === true) return
        // default action
        query(this.box).find('#node_'+ w2utils.escapeId(id) +'_sub').hide()
        query(this.box).find('#node_'+ w2utils.escapeId(id) +' .w2ui-expanded')
            .removeClass('w2ui-expanded')
            .addClass('w2ui-collapsed')
        nd.expanded = false
        // event after
        edata.finish()
        this.refresh(id)
        return true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expand(id: any) { // any: node id is string|number at runtime
        const nd = this.get(id)
        // event before
        const edata = this.trigger('expand', { target: id, object: nd, node: nd })
        if (edata.isCancelled === true) return
        // default action
        query(this.box).find('#node_'+ w2utils.escapeId(id) +'_sub')
            .show()
        query(this.box).find('#node_'+ w2utils.escapeId(id) +' .w2ui-collapsed')
            .removeClass('w2ui-collapsed')
            .addClass('w2ui-expanded')
        nd.expanded = true
        // event after
        edata.finish()
        this.refresh(id)
        return true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collapseAll(parent?: any) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        if (parent == null) parent = this
        if (typeof parent == 'string') parent = this.get(parent)
        if (parent.nodes == null) return false
        for (let i = 0; i < parent.nodes.length; i++) {
            if (parent.nodes[i].expanded === true) parent.nodes[i].expanded = false
            if (parent.nodes[i].nodes && parent.nodes[i].nodes.length > 0) this.collapseAll(parent.nodes[i])
        }
        this.refresh(parent.id)
        return true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expandAll(parent?: any) {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        if (parent == null) parent = this
        if (typeof parent == 'string') parent = this.get(parent)
        if (parent.nodes == null) return false
        for (let i = 0; i < parent.nodes.length; i++) {
            if (parent.nodes[i].expanded === false) parent.nodes[i].expanded = true
            if (parent.nodes[i].nodes && parent.nodes[i].nodes.length > 0) this.expandAll(parent.nodes[i])
        }
        this.refresh(parent.id)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expandParents(id: any) { // any: node id is string|number at runtime
        const node = this.get(id)
        if (node == null) return false
        if (node.parent) {
            if (!node.parent.expanded) {
                node.parent.expanded = true
                this.refresh(node.parent.id)
            }
            this.expandParents(node.parent.id)
        }
        return true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    click(id: any, event?: any) { // any: id is string|number; event may be MouseEvent|TouchEvent at runtime
        const nd  = this.get(id)
        if (nd == null) return
        if (nd.disabled || nd.group) {
            // even if disabled, it should still emit click event
            const edata = this.trigger('click', { target: id, originalEvent: event, node: nd, object: nd })
            edata.finish()
            return
        }
        // select new one
        const newNode = query(this.box).find('#node_'+ w2utils.escapeId(id))
        newNode.addClass('w2ui-selected').find('.w2ui-icon').addClass('w2ui-icon-selected')
        // need timeout to allow rendering
        setTimeout(() => {
            // event before
            const edata = this.trigger('click', { target: id, originalEvent: event, node: nd, object: nd })
            if (edata.isCancelled === true) {
                // restore selection
                newNode.removeClass('w2ui-selected').find('.w2ui-icon').removeClass('w2ui-icon-selected')
                return
            }
            // default action
            if (this.multi) {
                /**
                 * Multi select with shift or ctrl/meta
                 */
                // any: Event may be MouseEvent at runtime; shiftKey/ctrlKey/metaKey are MouseEvent properties
                const mev     = event as MouseEvent | undefined
                const isShift = mev?.shiftKey ?? false
                const isCtrl  = (mev?.ctrlKey || mev?.metaKey) ?? false
                if (typeof this.selected == 'string') {
                    this.selected = [this.selected]
                }
                if (isCtrl && !isShift) { // only Ctrl
                    if (this.selected?.includes(id)) {
                        this.unselect(id)
                        return
                    } else {
                        this.select(id)
                    }
                } else if (!isCtrl && isShift) { // only Shift
                    // select range in between
                    const chain = this.getChain()
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const ind1 = Math.min(this.selected.map((sel: any) => chain.indexOf(sel))) // any: selected ids are string|number; first item in selection
                    const ind2 = chain.indexOf(id)
                    for (let i = Math.min(ind1, ind2); i < chain.length && i <= Math.max(ind1, ind2); i++) {
                        const node = this.get(chain[i])
                        if (!this.selected.includes(chain[i]) && node.hidden != true) {
                            this.select(chain[i])
                        }
                    }

                } else { // neither
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const ids = this.selected?.filter((sid: any) => sid != id && this.selected.includes(sid)) // any: selected ids are string|number
                    this.unselect(ids)
                    // only select if it is not selected
                    if (!this.selected?.includes(id)) {
                        this.select(id)
                    }
                }

            } else if (this.selected !== id) {
                /**
                 * Single selection at a time
                 */
                if (this.selected != null) this.unselect(this.selected)
                this.select(id)
                // route processing
                if (typeof nd.route == 'string') {
                    let route = nd.route !== '' ? String('/'+ nd.route).replace(/\/{2,}/g, '/') : ''
                    const info  = w2utils.parseRoute(route)
                    if (info.keys.length > 0) {
                        for (let k = 0; k < info.keys.length; k++) {
                            const routeKey = info.keys[k]
                            if (routeKey == null) continue
                            if (this.routeData[routeKey.name] == null) continue
                            // any: routeData values are runtime strings; declared as unknown for safety
                            route = route.replace((new RegExp(':'+ routeKey.name, 'g')), this.routeData[routeKey.name] as string)
                        }
                    }
                    setTimeout(() => { window.location.hash = route }, 1)
                }
                // if sidebar is flat - show menu
                if (this.flat) {
                    const items = _getItems(nd.nodes)
                    if (items.length > 0) {
                        this.flatMenu(newNode, items)
                    }

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    function _getItems(nodes: any): any { // any: node objects have dynamic shape
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const items = nodes.map((it: any) => { // any: node objects have dynamic shape
                            const items = it.nodes.length > 0 ? _getItems(it.nodes) : null
                            return { id: it.id, text: it.text, icon: it.icon, items }
                        })
                        return items
                    }
                }
            }
            // event after
            edata.finish()
        }, 1)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    flatMenu(el: any, items: any) { // any: el is query-wrapped element; items is dynamic node menu array
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        const $el = query(el).find('.w2ui-node-data')
        w2menu.show({
            // any: query().get(0) returns Node|Node[]; anchor is always HTMLElement in flat menu context
            anchor: $el.get(0) as HTMLElement,
            name: this.name + '_flat-menu',
            items,
            // class: 'w2ui-dark',
            position: 'right|left',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSelect(event: any) { // any: w2menu select event detail has dynamic shape
                self.unselect()
                self.click(event.detail.item.id, event.detail.originalEvent)
            },
            onHide(_event) {
                self.unselect()
            }
        })
        w2tooltip.hide(this.name + '_tooltip')
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    focus(event?: any) { // any: event may be FocusEvent|MouseEvent at runtime
        // event before
        const edata = this.trigger('focus', { target: this.name, originalEvent: event })
        if (edata.isCancelled === true) return false
        // default behaviour
        this.hasFocus = true
        query(this.box).find('.w2ui-sidebar-body').addClass('w2ui-focus')
        setTimeout(() => {
            const input = query(this.box).find('#sidebar_'+ this.name + '_focus').get(0) as HTMLElement
            if (document.activeElement != input) input.focus()
        }, 10)
        // event after
        edata.finish()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    blur(event: any) { // any: event may be FocusEvent|MouseEvent at runtime
        // event before
        const edata = this.trigger('blur', { target: this.name, originalEvent: event })
        if (edata.isCancelled === true) return false
        // default behaviour
        this.hasFocus = false
        query(this.box).find('.w2ui-sidebar-body').removeClass('w2ui-focus')
        // event after
        edata.finish()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    next(node: any, noSubs?: any): any { // any: node objects have dynamic shape; return is node or null
        if (node == null) return null
        const parent = node.parent
        const ind = this.get(node.id, true)
        let nextNode = null
        // jump inside
        if (node.expanded && node.nodes.length > 0 && noSubs !== true) {
            const nd = node.nodes[0] ?? null
            if (nd == null) { nextNode = null } else if (nd.hidden || nd.disabled || nd.group) { nextNode = this.next(nd) } else { nextNode = nd }
        } else {
            if (parent && ind + 1 < parent.nodes.length) {
                nextNode = parent.nodes[ind + 1] ?? null
            } else {
                nextNode = this.next(parent, true) // jump to the parent
            }
        }
        if (nextNode != null && (nextNode.hidden || nextNode.disabled || nextNode.group)) nextNode = this.next(nextNode)
        return nextNode
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    prev(node: any): any { // any: node objects have dynamic shape; return is node or null
        if (node == null) return null
        const parent = node.parent
        const ind = this.get(node.id, true)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const lastChild = (node: any): any => { // any: node objects have dynamic shape
            if (node.expanded && node.nodes.length > 0) {
                const nd = node.nodes[node.nodes.length - 1] ?? null
                if (nd == null) return node
                if (nd.hidden || nd.disabled || nd.group) return this.prev(nd); else return lastChild(nd)
            }
            return node
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const prevNodeSource: any = (ind > 0) ? parent.nodes[ind - 1] : null // any: node from index access
        let prevNode = (ind > 0 && prevNodeSource != null) ? lastChild(prevNodeSource) : parent
        if (prevNode != null && (prevNode.hidden || prevNode.disabled || prevNode.group)) prevNode = this.prev(prevNode)
        return prevNode
    }

    // returns ids of expanded elements as a flat array
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getChain(nodes?: any, options: W2SidebarFindOptions = {}): any[] { // any: nodes is dynamic node array; returns id array
        options.returnDisabled ??= false
        options.returnGroups ??= false
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const ids: any[] = [] // any: node ids can be string|number at runtime
        if (nodes == null) nodes = this.nodes
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        nodes.forEach((node: any) => { // any: node objects have dynamic shape
            // can skip disabled if needed
            if ((!node.disabled && !node.group) || (node.disabled && options.returnDisabled) || (node.group && options.returnGroups)) {
                ids.push(node.id)
            }
            if (Array.isArray(node.nodes) && node.expanded) {
                ids.push(...this.getChain(node.nodes, options))
            }
        })
        return ids
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keydown(event: any) { // any: KeyboardEvent in practice but dispatched via w2ui bindEvents as generic Event
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        const first = Array.isArray(this.selected) ? this.selected[0] : this.selected
        let nd  = this.get(first)
        if (this.keyboard !== true) return
        if (!nd) nd = this.nodes[0] ?? null
        // if user hits esc and there is active move
        if (event.keyCode == 27) {
            const mv = this.last.move
            if (mv?.reorder && mv?.moved) {
                mv.restore()
                return
            }
        }
        // trigger event
        const edata = this.trigger('keydown', { target: this.name, originalEvent: event })
        if (edata.isCancelled === true) return
        // default behaviour
        if (event.keyCode == 13 || event.keyCode == 32) { // enter or space
            if (event.keyCode == 13 && this.editable && !event.ctrlKey && !event.metaKey) {
                this.edit(first)
            } else {
                if (nd.nodes.length > 0) {
                    this.toggle(first)
                }
            }
        }
        if (event.keyCode == 37) { // left
            if (nd.nodes.length > 0 && nd.expanded) {
                this.collapse(first)
            } else {
                selectNode(nd.parent)
                if (!nd.parent.group) this.collapse(nd.parent.id)
            }
        }
        if (event.keyCode == 39) { // right
            if ((nd.nodes.length > 0 || nd.plus) && !nd.expanded) this.expand(first)
        }
        if (event.keyCode == 38) { // up
            if (this.get(first) == null) {
                selectNode(this.nodes[0] || null)
            } else {
                selectNode(neighbor(nd, this.prev))
            }
        }
        if (event.keyCode == 40) { // down
            if (this.get(first) == null) {
                selectNode(this.nodes[0] || null)
            } else {
                selectNode(neighbor(nd, this.next))
            }
        }
        // cancel event if needed
        if ([13, 32, 37, 38, 39, 40].includes(event.keyCode)) {
            if (event.preventDefault) event.preventDefault()
            if (event.stopPropagation) event.stopPropagation()
        }
        // event after
        edata.finish()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function selectNode(node: any, event?: any) { // any: node object has dynamic shape; event may be any Event subtype
            if (node != null && !node.hidden && !node.disabled && !node.group) {
                self.click(node.id, event)
                if (!self.inView(node.id)) self.scrollIntoView(node.id)
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function neighbor(node: any, neighborFunc: any): any { // any: node object and neighborFunc have dynamic shape
            node = neighborFunc.call(self, node)
            while (node != null && (node.hidden || node.disabled)) {
                if (node.group) break; else node = neighborFunc(node)
            }
            return node
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inView(id: any) { // any: node id is string|number at runtime
        // any: query().get(0) returns Node|Node[]; sidebar nodes are always HTMLElement
        const item = query(this.box).find('#node_'+ w2utils.escapeId(id)).get(0) as HTMLElement | undefined
        if (!item) {
            return false
        }
        const div = query(this.box).find('.w2ui-sidebar-body').get(0) as HTMLElement | undefined
        if (!div) return false
        if (item.offsetTop < div.scrollTop || (item.offsetTop + item.clientHeight > div.clientHeight + div.scrollTop)) {
            return false
        }
        return true
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scrollIntoView(id?: any, instant?: any) { // any: id is string|number; instant is boolean-ish
        return new Promise<void>((resolve) => {
            if (id == null) id = Array.isArray(this.selected) ? this.selected[0] : this.selected
            const nd = this.get(id)
            if (nd == null) return
            // any: query().get(0) returns Node|Node[]; sidebar node is always HTMLElement
            const item = query(this.box).find('#node_'+ w2utils.escapeId(id)).get(0) as HTMLElement | undefined
            if (item) item.scrollIntoView({ block: 'center', inline: 'center', behavior: instant ? 'auto' : 'smooth' })
            setTimeout(() => { this.resize(); resolve() }, instant ? 0 : 500)
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dblClick(id: any, event: any) { // any: id is string|number; event may be MouseEvent|TouchEvent at runtime
        const nd = this.get(id)
        // event before
        const edata = this.trigger('dblClick', { target: id, originalEvent: event, object: nd })
        if (edata.isCancelled === true) return
        // default action
        if (this.editable) {
            this.edit(id)
        } else if (!this.flat) {
            this.toggle(id)
        }
        // event after
        edata.finish()
    }

    /**
     * This is needed for not reorder
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mouseDown(id: any, event: any) { // any: id is string|number; event may be MouseEvent|TouchEvent at runtime
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        if (this.reorder) {
            this.last.move = {
                x: event.screenX,
                y: event.screenY,
                divX: 0,
                divY: 0,
                reorder: true,
                moved: false
            }
            // display empty record and ghost record
            const mv = this.last.move
            const body = query(this.box).find('.w2ui-sidebar-body')
            if (!mv.ghost) {
                const node = query(this.box).find(`#node_${w2utils.escapeId(id)}`)
                mv.offsetY = event.offsetY
                mv.target = id
                // any: query().get(0) returns Node|Node[]; sidebar node is always HTMLElement
                const nodeEl = node.get(0) as HTMLElement
                mv.pos = { top: nodeEl.offsetTop - 1, left: nodeEl.offsetLeft }
                // ghost content
                // any: query().get(0) returns Node; it has cloneNode as all Nodes do
                const clone = query((node.find('.w2ui-node-data').get(0) as Node).cloneNode(true))
                mv.node = node
                mv.nodeSub = node.next()
                body.append('<div id="sidebar_'+ this.name + '_ghost" class="w2ui-node w2ui-ghost"></div>')
                query(this.box).find('#sidebar_'+ this.name + '_ghost').append(clone)
                mv.ghost = query(this.box).find('#sidebar_'+ this.name + '_ghost')
                mv.ghost.css({ display: 'none' })
                mv.restore = () => {
                    mv.resetReorder()
                    this.refresh()
                }
                mv.resetReorder = () => {
                    this.last.move = null
                    query(this.box).find(`#sidebar_${this.name}_ghost`).remove()
                    query(document).off(`.w2ui-${this.name}-reorder`)
                }
            }
            // add mouse move and stop events
            query(document)
                .on(`mousemove.w2ui-${this.name}-reorder`, _mouseMove)
                .on(`mouseup.w2ui-${this.name}-reorder`, _mouseStop)
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function _mouseMove(event: any) { // any: event is MouseEvent at runtime but bound as generic EventListener
            if (!event.target.tagName) {
                // element has no tagName - most likely the target is the #document itself
                // this can happen is you click+drag and move the mouse out of the DOM area,
                // e.g. into the browser's toolbar area
                return
            }
            const mv = self.last.move
            mv.divX = (event.screenX - mv.x)
            mv.divY = (event.screenY - mv.y)
            if (Math.abs(mv.divX) <= 1 && Math.abs(mv.divY) <= 1) return // only if moved more then 1px

            if (self.reorder == true && mv.reorder && !mv.moved) {
                const edata = self.trigger('dragStart', { target: mv.target, moved: true, node: self.get(mv.target), mv, originalEvent: event })
                if (edata.isCancelled === true) {
                    mv.restore()
                    return
                }
                const rect = mv.node.get(0).getBoundingClientRect()
                mv.moved = true
                mv.node.html('')
                    .removeAttr('id', 'data-id')
                    .addClass('w2ui-reorder-empty')
                    .css({ height: rect.height + 'px' })
                // if there are children
                if (mv.node.next().css('display') !== 'none') {
                    const rect = mv.node.next().get(0).getBoundingClientRect()
                    mv.node.next()
                        .html('<div class="w2ui-reorder-empty-sub"></div>')
                        .css({ height: rect.height + 'px' })
                }
                mv.ghost.css({ display: 'block' })
                // event after
                edata.finish()
            }
            // move ghost mode
            mv.ghost.css({
                top: (mv.pos.top + mv.divY) + 'px',
                left: 0
            })
            const over = query(event.target).closest('.w2ui-node, .w2ui-node-group')
            const id = over.attr('data-id')
            // append to the end
            if (query(event.target).hasClass('w2ui-sidebar-body') && event.layerY > 5 && !mv.append) {
                const edata = self.trigger('dragOver', { target: mv.target, append: true, mv, originalEvent: event })
                if (edata.isCancelled === true) {
                    return
                }
                mv.ghost.before(mv.node)
                mv.ghost.before(mv.nodeSub)
                mv.append = true
                mv.moveBefore = null
                // event after
                edata.finish()
            } else if (id != null && id != mv.moveBefore) {
                mv.append = false
                mv.moveBefore = id
                // reorder nodes
                const edata = self.trigger('dragOver', { target: mv.target, moveBefore: id, mv, originalEvent: event })
                if (edata.isCancelled === true) {
                    return
                }
                const el = query(self.box).find(`#node_${w2utils.escapeId(id)}`)
                el.before(mv.node)
                el.before(mv.nodeSub)
                // event after
                edata.finish()
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function _mouseStop(event: any) { // any: event is MouseEvent at runtime but bound as generic EventListener
            const mv = self.last.move
            mv.resetReorder()
            if (mv.moved) {
                if (((mv.moveBefore != null && mv.target != mv.moveBefore) || mv.append)) {
                    const edata = self.trigger('reorder', { target: mv.target, moveBefore: mv.moveBefore, append: mv.append, originalEvent: event })
                    if (edata.isCancelled === true) {
                        self.refresh()
                        return
                    }
                    // remove
                    const target = self.get(mv.target)
                    const targetInd = target.parent.nodes.indexOf(target)
                    const cut = target.parent.nodes.splice(targetInd, 1)
                    // insert
                    if (mv.append) {
                        self.nodes.push(...cut)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        cut.forEach((nd: any) => nd.parent = self) // any: cut nodes have dynamic shape
                    } else {
                        const before = self.get(mv.moveBefore)
                        const beforeInd = before.parent.nodes.indexOf(before)
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        cut.forEach((nd: any) => nd.parent = before.parent) // any: cut nodes have dynamic shape
                        before.parent.nodes.splice(beforeInd, 0, ...cut)
                    }
                    // refresh
                    self.refresh()
                    // event after
                    edata.finish()
                } else {
                    self.refresh()
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    edit(id: any) { // any: node id is string|number at runtime
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const self = this
        const node = query(this.box).find('#node_'+ w2utils.escapeId(id))
        const text = node.find('.w2ui-node-text')
        // event before
        const edata = this.trigger('edit', { target: id, el: node, textEl: text })
        if (edata.isCancelled === true) {
            return
        }
        this.last.renaming = true
        node.addClass('w2ui-editing')
        // any: css(key,val) and attr(name,val) overloads return string|Query; cast for chaining
        ;((text.addClass('w2ui-focus')
            .css('pointer-events', 'all') as unknown as Query)
            .attr('contenteditable', w2utils.isFirefox ? 'true' : 'plaintext-only') as unknown as Query)
            .on('blur.node-editing', (_event) => {
                // timeout is needed to add to the end of the event loop
                setTimeout(_rename, 0)
            })
            .on('keydown.node-editing', (event: Event) => {
                const kbdEvent = event as KeyboardEvent
                if (kbdEvent.keyCode == 13) _rename(kbdEvent)
                if (kbdEvent.keyCode == 27) _rename(kbdEvent, true)
            })
        // any: query().get(0) returns Node|Node[]; text contenteditable node is always HTMLElement
        ;(text.get(0) as HTMLElement).focus()

        const original = text.text() as string
        // any: query()[0] returns Node; text node is HTMLElement; text.text() returns unknown at runtime
        w2utils.setCursorPosition(text[0] as HTMLElement, 0, (text.text() as string).length)
        // event after
        edata.finish()

        return text.get(0) // return editable input

        function _rename(event?: KeyboardEvent | Event, cancel?: boolean) {
            // any: text() returns unknown; rename text is always a string at runtime
            const renameTo = text.text() as string
            node.removeClass('w2ui-editing')
            // any: css(key, value) overload returns string|Record|Query; cast to Query for chaining
            ;(text.removeClass('w2ui-focus')
                .css('pointer-events', 'none') as unknown as Query)
                .removeAttr('contenteditable')
                .off('.node-editing')
            // send event if it was not cancelled
            if (!cancel && self.last.renaming && original !== renameTo) {
                const edata = self.trigger('rename', { target: id, text_previous: original, text_new: renameTo, originalEvent: event })
                if (edata.isCancelled === true) {
                    text.text(original)
                    self.last.renaming = false
                    self.focus()
                    return
                }
                self.set(id, { text: renameTo })
                edata.finish()
            }
            if (cancel) {
                self.set(id, { text: original })
            }
            self.last.renaming = false
            self.focus()
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    contextMenu(id: any, event: any) { // any: id is string|number; event may be MouseEvent|ContextMenuEvent at runtime
        const nd = this.get(id)
        if (Array.isArray(this.selected)) {
            if (!this.selected.includes(id)) this.click(id)
        } else {
            if (id != this.selected) this.click(id)
        }
        // event before
        const edata = this.trigger('contextMenu', { target: id, originalEvent: event, object: nd, allowOnDisabled: false })
        if (edata.isCancelled === true) return
        // default action
        // any: allowOnDisabled is a custom event field stored in detail (W2EventData allows [key: string]: unknown)
        if (nd.disabled && !edata.detail['allowOnDisabled']) return
        if (this['menu'].length > 0) {
            w2menu.hide(this.name + '_menu') // hide previous if any needed when other item's menu is shown
            // any: w2menu.show() returns AttachReturn|{overlay}; select exists on AttachReturn only
            const menuAttach = w2menu.show({
                name: this.name + '_menu',
                anchor: document.body,
                contextMenu: true,
                items: this['menu'],
                originalEvent: event
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any // any: AttachReturn not exported from w2tooltip; select is optional on it
            menuAttach?.select?.((evt: unknown) => {
                this.menuClick(id, (evt as { detail: unknown }).detail)
            })
        }
        // prevent default context menu
        if (event.preventDefault) event.preventDefault()
        // event after
        edata.finish()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    menuClick(itemId: any, detail: any = {}) { // any: itemId is string|number; detail is event detail object
        // event before
        const edata = this.trigger('menuClick', { target: itemId, ...detail })
        if (edata.isCancelled === true) return
        // default action
        // -- empty
        // event after
        edata.finish()
    }

    goFlat() {
        // event before
        const edata = this.trigger('flat', { goFlat: !this.flat })
        if (edata.isCancelled === true) return
        // default action
        this.flat = !this.flat
        this.refresh()
        if (this.flat) {
            // collapse all unless it is a group
            this.nodes.forEach(node => {
                if (!node.group) {
                    this.collapse(node.id)
                    this.collapseAll(node.id) // sub items too
                }
            })
            this.unselect() // unselects all
        } else {
            // expand all unless it is a group
            this.nodes.forEach(node => {
                if (!node.group) {
                    this.expand(node.id)
                    this.expandAll(node.id) // sub items too
                }
            })
        }
        // event after
        edata.finish()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    override render(box?: any) { // any: box is HTMLElement|string|null at runtime
        const time = Date.now()
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const obj  = this
        if (typeof box == 'string') box = query(box).get(0) as HTMLElement
        // event before
        const edata = this.trigger('render', { target: this.name, box: box ?? this.box })
        if (edata.isCancelled === true) return
        // default action
        if (box != null) {
            this.unmount() // clean previous control
            this.box = box
        }
        if (!this.box) return
        query(this.box)
            .attr('name', this.name)
            .addClass('w2ui-reset w2ui-sidebar')
            .html(`<div>
                <div class="w2ui-sidebar-top"></div>
                <input id="sidebar_${this.name}_focus" ${(this.tabIndex ? 'tabindex="' + this.tabIndex + '"' : '')}
                    style="position: absolute; top: 0; right: 1px; width: 1px; z-index: -1; opacity: 0"
                    ${(w2utils.isMobile ? 'readonly' : '')}/>
                <div class="w2ui-sidebar-body"></div>
                <div class="w2ui-sidebar-bottom"></div>
            </div>`)
        // any: query().get(0) returns Node|Node[]; box is always HTMLElement when rendering
        const boxEl3 = query(this.box).get(0) as HTMLElement
        const rect = boxEl3.getBoundingClientRect()
        query(this.box).find(':scope > div').css({
            width  : rect.width + 'px',
            height : rect.height + 'px'
        })
        boxEl3.style.cssText += this.style
        // focus
        let kbd_timer: ReturnType<typeof setTimeout> | undefined
        query(this.box).find('#sidebar_'+ this.name + '_focus')
            .on('focus', function(event) {
                clearTimeout(kbd_timer)
                if (!obj.hasFocus) obj.focus(event)
            })
            .on('blur', function(event) {
                kbd_timer = setTimeout(() => {
                    if (obj.hasFocus) { obj.blur(event) }
                }, 100)
            })
            .on('keydown', function(event) {
                // any: w2ui is Record<string,unknown>; keydown is a method on the registered sidebar
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const w2obj = w2ui[obj.name] as any // any: w2ui registry value is dynamic
                w2obj?.keydown?.call(w2obj, event)
            })
        query(this.box).off('mousedown')
            .on('mousedown', function(event) {
                // set focus to sidebar
                setTimeout(() => {
                    // if input then do not focus
                    // any: event.target is EventTarget; tagName exists on HTMLElement
                    if (['INPUT', 'TEXTAREA', 'SELECT'].indexOf((event.target as HTMLElement)?.tagName?.toUpperCase()) == -1) {
                        const $input = query(obj.box).find('#sidebar_'+ obj.name + '_focus')
                        // any: query().get(0) returns Node|Node[]; focus input is always HTMLElement
                        const inputEl = $input.get(0) as HTMLElement | undefined
                        if (document.activeElement != inputEl && $input.length > 0) {
                            inputEl?.focus()
                        }
                    }
                }, 1)
            })
        /**
         * FlatHTML is always present and in .refresh() it is just refreshed. However topHTML and buttomHTML should be here
         * because it should never be refreshed, as it could create recursive refresh loop
         */
        const flatHTML = `<div class="w2ui-flat w2ui-flat-${(this.flat ? 'right' : 'left')}" ${this.flatButton == false ? 'style="display: none"' : ''}></div>`
        if (this['topHTML'] !== '' || flatHTML !== '') {
            query(this.box).find('.w2ui-sidebar-top').html(this['topHTML'] + flatHTML)
            query(this.box).find('.w2ui-sidebar-body')
                // any: query().get(0) returns Node|Node[]; sidebar-top element is always HTMLElement
                .css('top', (query(this.box).find('.w2ui-sidebar-top').get(0) as HTMLElement | undefined)?.clientHeight + 'px')
            query(this.box).find('.w2ui-flat')
                .off('click')
                .on('click', _event => { this.goFlat() })
        }
        if (this['bottomHTML'] !== '') {
            query(this.box).find('.w2ui-sidebar-bottom').html(this['bottomHTML'])
            query(this.box).find('.w2ui-sidebar-body')
                // any: query().get(0) returns Node|Node[]; sidebar-bottom element is always HTMLElement
                .css('bottom', (query(this.box).find('.w2ui-sidebar-bottom').get(0) as HTMLElement | undefined)?.clientHeight + 'px')
        }

        // observe div resize
        this.last.observeResize = new ResizeObserver(() => { this.resize() })
        this.last.observeResize.observe(this.box)
        // event after
        edata.finish()
        // ---
        this.refresh()
        return Date.now() - time
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    update(id: any, options: W2SidebarUpdateOptions = {}) { // any: node id is string|number at runtime
        // quick function to refresh just this item (not sub nodes)
        //  - icon, class, style, text, count
        const nd = this.get(id)
        let level
        if (nd) {
            const $el = query(this.box).find('#node_'+ w2utils.escapeId(nd.id))
            if (nd.group) {
                if (options.text) {
                    nd.text = options.text
                    $el.find('.w2ui-group-text').replace(typeof nd.text == 'function'
                        ? nd.text.call(this, nd)
                        : '<span class="w2ui-group-text">'+ nd.text +'</span>')
                    delete options.text
                }
                if (options.class) {
                    nd.class = options.class
                    level = $el.data('level')
                    // any: query().get(0) returns Node|Node[]; sidebar node element is always HTMLElement
                    ;($el.get(0) as HTMLElement).className = 'w2ui-node-group w2ui-level-'+ level +(nd.class ? ' ' + nd.class : '')
                    delete options.class
                }
                if (options.style) {
                    nd.style = options.style
                    // any: query().get(0) returns Node|Node[]; sidebar node element is always HTMLElement
                    const nextEl = ($el.get(0) as HTMLElement).nextElementSibling as HTMLElement | null
                    if (nextEl) nextEl.setAttribute('style', nd.style +';'+ (!nd.hidden && nd.expanded ? '' : 'display: none;'))
                    delete options.style
                }
            } else {
                if (options.icon) {
                    const $icon = $el.find('.w2ui-node-image > span')
                    if ($icon.length > 0) {
                        nd.icon = options.icon
                        // any: query()[0] returns Node; sidebar icon span is always HTMLElement
                        ;($icon[0] as HTMLElement).className = (typeof nd.icon == 'function' ? nd.icon.call(this, nd) : nd.icon)
                        delete options.icon
                    }
                }
                if (options.count != null) {
                    nd.count = options.count
                    // update counts
                    let txt = nd.count ?? this['badge']?.text
                    const style = this['badge']?.style
                    const last = this.last.badge[nd.id]
                    if (typeof txt == 'function') txt = txt.call(this, nd, level)
                    // any: .html(val) returns Query|string; cast to Query for chaining .attr()
                    ;($el.find('.w2ui-node-badge')
                        .html(txt) as unknown as Query)
                        .attr('style', `${style}; ${last?.style ?? ''}`)
                    if ($el.find('.w2ui-node-badge').length > 0) delete options.count
                }
                if (options.class && $el.length > 0) {
                    nd.class = options.class
                    level = $el.data('level')
                    // any: query()[0] returns Node; sidebar node element is always HTMLElement
                    ;($el[0] as HTMLElement).className = 'w2ui-node w2ui-level-'+ level + (nd.selected ? ' w2ui-selected' : '') + (nd.disabled ? ' w2ui-disabled' : '') + (nd.class ? ' ' + nd.class : '')
                    delete options.class
                }
                if (options.text != null) {
                    nd.text = options.text
                    $el.find('.w2ui-node-text').html(typeof nd.text == 'function' ? nd.text.call(this, nd) : nd.text)
                    delete options.text
                }
                if (options.style && $el.length > 0) {
                    const $txt = $el.find('.w2ui-node-text')
                    nd.style = options.style
                    // any: query()[0] returns Node; sidebar node text element is always HTMLElement
                    ;($txt[0] as HTMLElement).setAttribute('style', nd.style)
                    delete options.style
                }
            }
        }
        // return what was not set
        return options
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    refresh(id?: any, options: W2SidebarRefreshOptions = {}) { // any: node id is string|number at runtime
        if (this.box == null) return
        // any: query().get(0) returns Node|Node[]; sidebar body is always HTMLElement
        const body = query(this.box).find(':scope > div > .w2ui-sidebar-body').get(0) as HTMLElement | undefined
        const { scrollTop, scrollLeft } = body ?? {}
        const time = Date.now()
        // event before
        const edata = this.trigger('refresh', {
            target: (id != null ? id : this.name),
            nodeId: (id != null ? id : null),
            fullRefresh: (id != null ? false : true)
        })
        if (edata.isCancelled === true) return
        if (this.flatButton == true) {
            query(this.box).find('.w2ui-sidebar-top .w2ui-flat').show()
                .removeClass('w2ui-flat-left w2ui-flat-right')
                .addClass(` w2ui-flat-${(this.flat ? 'right' : 'left')}`)

        } else {
            query(this.box).find('.w2ui-sidebar-top .w2ui-flat').hide()
        }
        // default action
        // any: query().get(0) returns Node|Node[]; box is always HTMLElement at this point
        const boxEl2 = query(this.box).get(0) as HTMLElement | undefined
        query(this.box).find(':scope > div').removeClass('w2ui-sidebar-flat').addClass(this.flat ? 'w2ui-sidebar-flat' : '').css({
            width : (boxEl2?.clientWidth ?? 0) + 'px',
            height: (boxEl2?.clientHeight ?? 0) + 'px'
        })
        // if no parent - reset nodes
        if (this.nodes.length > 0 && this.nodes[0].parent == null) {
            const tmp    = this.nodes
            this.nodes = []
            this.add(this, tmp)
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const obj = this
        let node
        let nodeSubId
        if (id == null) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            node = this
            nodeSubId = '.w2ui-sidebar-body'
        } else {
            node = this.get(id)
            if (node == null) return
            nodeSubId = '#node_'+ w2utils.escapeId(node.id) + '_sub'
        }
        const nodeId = '#node_'+ w2utils.escapeId(node.id)
        let nodeHTML
        if (node !== this) {
            nodeHTML = getNodeHTML(node)
            query(this.box).find(nodeId).before('<div id="sidebar_'+ this.name + '_tmp"></div>')
            query(this.box).find(nodeId).remove()
            query(this.box).find(nodeSubId).remove()
            query(this.box).find('#sidebar_'+ this.name + '_tmp').before(nodeHTML)
            query(this.box).find('#sidebar_'+ this.name + '_tmp').remove()
        }
        // remember scroll position
        // any: query().get(0) returns Node|Node[]; sidebar div is always HTMLElement
        const div = query(this.box).find(':scope > div').get(0) as HTMLElement | undefined
        const scroll = {
            top: div?.scrollTop,
            left: div?.scrollLeft
        }
        // refresh sub nodes
        const cnt = node == this
            ? query(this.box).find(':scope > div > .w2ui-sidebar-body')
            : query(body).find(nodeSubId)
        cnt.html('')
        for (let i = 0; i < node.nodes.length; i++) {
            const subNode = node.nodes[i]
            nodeHTML = getNodeHTML(subNode)
            cnt.append(nodeHTML)
            if (subNode.nodes.length !== 0) {
                // TODO: here
                this.refresh(subNode.id, { recursive: true, })
            } else {
                // trigger event
                const edata2 = this.trigger('refresh', { target: subNode.id })
                if (edata2.isCancelled === true) return
                // event after
                edata2.finish()
            }
        }
        // reset scroll
        if (div) {
            div.scrollTop = scroll.top ?? 0
            div.scrollLeft = scroll.left ?? 0
        }
        // bind events
        if (!options.recursive) {
            const els = query(this.box).find(`${nodeId}, ${nodeId} .w2ui-eaction, ${nodeSubId} .w2ui-eaction`)
            w2utils.bindEvents(els, this)
            // restore scroll position
            query(body).prop({ scrollLeft, scrollTop })
        }
        // event after
        edata.finish()
        return Date.now() - time

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function getNodeHTML(nd: any): string { // any: sidebar node objects have dynamic shape
            let html = ''
            let icon = nd.icon
            if (icon == null) icon = obj.icon
            // -- find out level
            let tmp   = nd.parent
            let level = 0
            while (tmp && tmp.parent != null) {
                // if (tmp.group) level--;
                tmp = tmp.parent
                level++
            }
            if (nd.caption != null && nd.text == null) nd.text = nd.caption
            if (nd.caption != null) {
                console.log('NOTICE: sidebar node.caption property is deprecated, please use node.text. Node -> ', nd)
                nd.text = nd.caption
            }
            if (Array.isArray(nd.nodes) && nd.nodes.length > 0) nd.collapsible = true
            if (nd.group) {
                let text = w2utils.lang(typeof nd.text == 'function' ? nd.text.call(obj, nd, level) : nd.text)
                if (String(text).substr(0, 5) != '<span') {
                    text = `<span class="w2ui-group-text">${text}</span>`
                }
                html = `
                    <div id="node_${nd.id}" data-id="${nd.id}" data-level="${level}" style="${nd.hidden ? 'display: none' : ''}"
                        class="w2ui-node-group w2ui-level-${level} ${nd.class ? nd.class : ''} w2ui-eaction"
                        data-click="toggle|${nd.id}"
                        data-contextmenu="contextMenu|${nd.id}|event"
                        data-mouseenter="showPlus|this|inherit"
                        data-mouseleave="showPlus|this|transparent">
                        ${nd.groupShowHide && nd.collapsible
                            ? `<span>${!nd.hidden && nd.expanded ? w2utils.lang('Hide') : w2utils.lang('Show')}</span>`
                            : '<span></span>'
                        } ${text}
                    </div>
                    <div class="w2ui-node-sub" id="node_${nd.id}_sub" style="${nd.style}; ${!nd.hidden && nd.expanded ? '' : 'display: none;'}">
                </div>`
                if (obj.flat) {
                    html = `
                        <div class="w2ui-node-group" id="node_${nd.id}" data-id="${nd.id}"><span>&#160;</span></div>
                        <div id="node_${nd.id}_sub" style="${nd.style}; ${!nd.hidden && nd.expanded ? '' : 'display: none;'}"></div>`
                }
            } else {
                if (nd.selected && !nd.disabled) {
                    if (obj.multi) {
                        obj.selected ??= []
                        if (!obj.selected.includes(nd.id)) {
                            obj.selected.push(nd.id)
                        }
                    } else {
                        obj.selected = nd.id
                    }
                }
                // icon or image
                let image = ''
                if (icon) {
                    if (icon instanceof Object) {
                        const text = (typeof icon.text == 'function' ? (icon.text.call(obj, nd, level) ?? '') : icon.text)
                        image = `
                            <div class="w2ui-node-image w2ui-eaction" style="${obj.icon.style ?? ''}; pointer-events: all"
                                data-mouseEnter="mouseAction|Enter|this|${nd.id}|event|icon"
                                data-mouseLeave="mouseAction|Leave|this|${nd.id}|event|icon"
                                data-click="mouseAction|click|this|${nd.id}|event|icon">
                                    ${text}
                            </div>
                        `
                    } else {
                        image = `
                            <div class="w2ui-node-image">
                                <span class="${typeof icon == 'function' ? icon.call(obj, nd, level) : icon}"></span>
                            </div>`
                    }
                }
                let expand = ''
                let counts = ''
                if (obj['badge'] != null || nd.count != null) {
                    let txt = nd.count ?? obj['badge']?.text
                    const style = obj['badge']?.style
                    const last = obj.last.badge[nd.id]
                    if (typeof txt == 'function') txt = txt.call(obj, nd, level)
                    if (txt || txt === 0) { // can be number 0
                        counts = `
                            <div class="w2ui-node-badge w2ui-eaction ${nd.count != null ? 'w2ui-node-count' : ''} ${last?.className ?? ''}"
                                style="${style ?? ''};${last?.style ?? ''}"
                                data-mouseEnter="mouseAction|Enter|this|${nd.id}|event|badge"
                                data-mouseLeave="mouseAction|Leave|this|${nd.id}|event|badge"
                                data-click="mouseAction|click|this|${nd.id}|event|badge"
                            >
                                ${txt}
                            </div>`
                    }
                }
                // array with classes
                const classes = ['w2ui-node', `w2ui-level-${level}`, 'w2ui-eaction']
                if (nd.selected) classes.push('w2ui-selected')
                if (nd.disabled) classes.push('w2ui-disabled')
                if (nd.class) classes.push(nd.class)
                // collapsible
                if (nd.collapsible === true) {
                    const toggleClasses = ['w2ui-sb-toggle', 'w2ui-eaction', (nd.expanded ? 'w2ui-expanded' : 'w2ui-collapsed')]
                    if (obj['toggleAlign'] == 'left') toggleClasses.push('w2ui-left-toggle')
                    expand = `<div class="${toggleClasses.join(' ')}" data-click="toggle|${nd.id}"><span></span></div>`
                    classes.push('w2ui-has-children')
                }
                const text = w2utils.lang(typeof nd.text == 'function' ? nd.text.call(obj, nd, level) : nd.text)
                let nodeOffset = nd.parent?.childOffset ?? 0
                if (level === 0 && nd.collapsible === true && obj['toggleAlign'] == 'left') {
                    nodeOffset += 12
                }
                html = `
                    <div id="node_${nd.id}" class="${classes.join(' ')}" data-id="${nd.id}" data-level="${level}"
                        style="${nd.hidden ? 'display: none;' : ''}"
                        data-click="click|${nd.id}|event"
                        data-dblclick="dblClick|${nd.id}|event"
                        data-mouseDown="mouseDown|${nd.id}|event"
                        data-contextmenu="contextMenu|${nd.id}|event"
                        data-mouseEnter="mouseAction|Enter|this|${nd.id}|event"
                        data-mouseLeave="mouseAction|Leave|this|${nd.id}|event"
                    >
                        ${obj['handle'].text
                            ? `<div class="w2ui-node-handle w2ui-eaction" style="width: ${obj['handle'].width}px; ${obj['handle'].style}"
                                    data-mouseEnter="mouseAction|Enter|this|${nd.id}|event|handle"
                                    data-mouseLeave="mouseAction|Leave|this|${nd.id}|event|handle"
                                    data-click="mouseAction|click|this|${nd.id}|event|handle"
                                >
                                   ${typeof obj['handle'].text == 'function' ? obj['handle'].text.call(obj, nd, level) ?? '' : obj['handle'].text}
                              </div>`
                            : ''
                        }
                      <div class="w2ui-node-data" style="margin-left: ${(level * obj['levelPadding']) + nodeOffset + obj['handle'].width}px">
                            ${expand} ${image} ${counts}
                            <div class="w2ui-node-text ${!image ? 'no-icon' : ''}" style="${nd.style || ''}">${text}</div>
                       </div>
                    </div>
                    <div class="w2ui-node-sub" id="node_${nd.id}_sub" style="${nd.style}; ${!nd.hidden && nd.expanded ? '' : 'display: none;'}"></div>`
                if (obj.flat) {
                    html = `
                        <div id="node_${nd.id}" class="${classes.join(' ')} w2ui-node-flat" data-id="${nd.id}" style="${nd.hidden ? 'display: none;' : ''}"
                            data-click="click|${nd.id}|event"
                            data-dblclick="dblClick|${nd.id}|event"
                            data-contextmenu="contextMenu|${nd.id}|event"
                            data-mouseEnter="mouseAction|Enter|this|${nd.id}|event|tooltip"
                            data-mouseLeave="mouseAction|Leave|this|${nd.id}|event|tooltip"
                        >
                            <div class="w2ui-node-data">${image}</div>
                        </div>
                        <div class="w2ui-node-sub" id="node_${nd.id}_sub" style="${nd.style}; ${!nd.hidden && nd.expanded ? '' : 'display: none;'}"></div>`
                }
            }
            return html
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mouseAction(action: any, anchor: any, nodeId: any, event: any, type: any) { // any: all params are runtime-typed event handler args
        let edata
        const node = this.get(nodeId)
        if (type == null) {
            edata = this.trigger('mouse' + action, { target: node.id, node, originalEvent: event })
        }
        if (type == 'tooltip') {
            // this tooltip shows for flat sidebars
            const text = w2utils.lang(typeof node.text == 'function' ? node.text.call(this, node) : node.text)
            let tooltip = text + (node.count != null
                ? ' - <span class="w2ui-node-badge w2ui-node-count">'+ node.count +'</span>'
                : '')
            if (action == 'Leave' || this.selected == node.id) tooltip = ''
            this.tooltip(anchor, tooltip)
        }
        if (type == 'handle') {
            if (action == 'click') {
                const onClick = this['handle'].onClick
                if (typeof onClick == 'function') {
                    onClick.call(this, node, event)
                }
            } else {
                let tooltip = this['handle'].tooltip
                if (typeof tooltip == 'function') {
                    tooltip = tooltip.call(this, node, event)
                }
                if (action == 'Leave') tooltip = ''
                this.otherTooltip(anchor, tooltip)
            }
        }
        if (type == 'icon') {
            if (action == 'click') {
                const onClick = this.icon.onClick
                if (typeof onClick == 'function') {
                    onClick.call(this, node, event)
                }
            } else {
                let tooltip = this.icon.tooltip
                if (typeof tooltip == 'function') {
                    tooltip = tooltip.call(this, node, event)
                }
                if (action == 'Leave') tooltip = ''
                this.otherTooltip(anchor, tooltip)
            }
        }
        if (type == 'badge') {
            if (action == 'click') {
                const onClick = this['badge']?.onClick
                if (typeof onClick == 'function') {
                    onClick.call(this, node, event)
                }
            } else {
                let tooltip = this['badge']?.tooltip
                if (typeof tooltip == 'function') {
                    tooltip = tooltip.call(this, node, event)
                }
                if (action == 'Leave') tooltip = ''
                this.otherTooltip(anchor, tooltip)
            }
        }
        edata?.finish()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tooltip(el: any, text: any) { // any: el is query-wrapped element; text is string|number at runtime
        const $el = query(el).find('.w2ui-node-data')
        if (text !== '') {
            w2tooltip.show({
                // any: query().get(0) returns Node|Node[]; sidebar node-data element is always HTMLElement
                anchor: $el.get(0) as HTMLElement,
                name: this.name + '_tooltip',
                html: text,
                position: 'right|left'
            })
        } else {
            w2tooltip.hide(this.name + '_tooltip')
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    otherTooltip(el: any, text: any) { // any: el is query-wrapped element; text is string|number at runtime
        if (text !== '') {
            w2tooltip.show({
                anchor: el,
                name: this.name + '_tooltip',
                html: text,
                position: 'top|bottom'
            })
        } else {
            w2tooltip.hide(this.name + '_tooltip')
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    showPlus(el: any, color: any) { // any: el is query-wrapped element; color is CSS color string
        query(el).find('span:nth-child(1)').css('color', color)
    }

    resize() {
        const time = Date.now()
        // event before
        const edata = this.trigger('resize', { target: this.name })
        if (edata.isCancelled === true) return
        // default action
        if (this.box != null) {
            // any: query().get(0) returns Node|Node[]; box is always a real HTMLElement here
            const boxEl = query(this.box).get(0) as HTMLElement
            const rect = boxEl.getBoundingClientRect()
            query(this.box).css('overflow', 'hidden') // container should have no overflow
            query(this.box).find(':scope > div').css({
                width  : rect.width + 'px',
                height : rect.height + 'px'
            })
        }
        // event after
        edata.finish()
        return Date.now() - time
    }

    destroy() {
        // event before
        const edata = this.trigger('destroy', { target: this.name })
        if (edata.isCancelled === true) return
        // clean up
        if (query(this.box).find('.w2ui-sidebar-body').length > 0) {
            this.unmount()
        }
        delete w2ui[this.name]
        // event after
        edata.finish()
    }

    override unmount() {
        super.unmount()
        this.last.observeResize?.disconnect()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    lock(msg?: any, showSpinner?: any) {
        w2utils.lock(this.box, msg, showSpinner)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    unlock(speed: any) { // any: speed is numeric ms at runtime
        w2utils.unlock(this.box, speed)
    }
}
export { w2sidebar }
