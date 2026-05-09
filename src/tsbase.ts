/**
 * Part of TsUi 2.0 library
 *  - Dependencies: TsUtils
 *  - on/off/trigger methods id not showing in help
 *  - refactored with event object
 *
 * Chanes in 2.0.+
 * - added unmount that cleans up the box
 *
 */

import { TsUtils, query } from './tsutils.js'
// TsUi is a plain object registry; typed as Record to allow dynamic name-keyed assignment.
import { TsUi as _w2uiRegistry } from './tsutils.js'
const TsUi = _w2uiRegistry as Record<string, unknown>

interface TsEventData {
    type?: string | null
    target?: unknown
    phase?: string
    object?: unknown
    [key: string]: unknown
}

interface TsEventListener {
    name: string
    edata: {
        type: string | null
        execute: string
        onComplete: null
        scope?: string
        handler?: unknown
        [key: string]: unknown
    }
    handler: Function // eslint-disable-line @typescript-eslint/ban-types
}

class TsEvent {
    type!: string | null        // assigned via Object.assign in constructor
    detail!: TsEventData        // assigned via Object.assign in constructor
    owner!: TsBase              // assigned via Object.assign in constructor
    target: unknown
    phase!: string              // assigned via Object.assign in constructor
    object: unknown
    execute!: null              // assigned via Object.assign in constructor
    isStopped!: boolean         // assigned via Object.assign in constructor
    isCancelled!: boolean       // assigned via Object.assign in constructor
    onComplete!: ((edata: TsEvent) => void) | null  // assigned via Object.assign in constructor
    listeners!: Array<(edata: TsEvent) => void>     // assigned via Object.assign in constructor
    complete: Promise<TsEvent>
    _resolve!: (value: TsEvent) => void
    _reject!: (reason?: unknown) => void

    constructor(owner: TsBase, edata: TsEventData) {
        Object.assign(this, {
            type: edata.type ?? null,
            detail: edata,
            owner,
            target: edata.target ?? null,
            phase: edata.phase ?? 'before',
            object: edata.object ?? null,
            execute: null,
            isStopped: false,
            isCancelled: false,
            onComplete: null,
            listeners: []
        })
        delete edata.type
        delete edata.target
        delete edata.object
        this.complete = new Promise((resolve, reject) => {
            this._resolve = resolve
            this._reject = reject
        })
        // needed empty catch function so that promise will not show error in the console
        this.complete.catch(() => {})
    }

    finish(detail?: Partial<TsEventData>): void {
        if (detail) {
            TsUtils.extend(this.detail, detail)
        }
        this.phase = 'after'
        this.owner.trigger.call(this.owner, this)
    }

    done(func: (edata: TsEvent) => void): void {
        this.listeners.push(func)
    }

    preventDefault(): void {
        this._reject()
        this.isCancelled = true
    }

    stopPropagation(): void {
        this.isStopped = true
    }
}

class TsBase {
    activeEvents: TsEvent[] = []
    listeners: TsEventListener[] = []
    debug: boolean = false
    name?: string
    box?: HTMLElement | null
    [key: string]: unknown

    /**
     * Initializes base object for TsUi, registers it with TsUi object
     *
     * @param {string} name  - name of the object
     * @returns
     */
    constructor(name?: string) {
        this.activeEvents = [] // events that are currently processing
        this.listeners = [] // event listeners
        // register globally
        if (typeof name !== 'undefined') {
            if (!TsUtils.checkName(name)) return
            TsUi[name] = this
        }
        this.debug = false // if true, will trigger all events
    }

    /**
     * Adds event listener, supports event phase and event scoping
     *
     * @param {*} edata - an object or string, if string "eventName:phase.scope"
     * @param {*} handler
     * @returns itself
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    on(events: string | TsEventData | Array<string | TsEventData>, handler: Function): this {
        if (typeof events == 'string') {
            events = events.split(/[,\s]+/) // separate by comma or space
        } else {
            events = [events as string | TsEventData]
        }
        // any: callback parameter — caller signature varies; TsBase event payload is widget-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (events as Array<any>).forEach((edata: any) => {
            const name = typeof edata == 'string' ? edata : (edata.type + ':' + edata.execute + '.' + edata.scope)
            if (typeof edata == 'string') {
                const [eventName, scope] = edata.split('.')
                const [type, execute] = (eventName ?? '').replace(':complete', ':after').replace(':done', ':after').split(':')
                edata = { type, execute: execute ?? 'before', scope }
            }
            edata = TsUtils.extend({ type: null, execute: 'before', onComplete: null }, edata)
            // errors
            if (!edata.type) { console.log('ERROR: You must specify event type when calling .on() method of '+ this.name); return }
            if (!handler) { console.log('ERROR: You must specify event handler function when calling .on() method of '+ this.name); return }
            if (!Array.isArray(this.listeners)) this.listeners = []
            this.listeners.push({ name, edata, handler } as TsEventListener)
            if (this.debug) {
                console.log('TsBase: add event', { name, edata, handler })
            }
        })
        return this
    }

    /**
     * Removes event listener, supports event phase and event scoping
     *
     * @param {*} edata - an object or string, if string "eventName:phase.scope"
     * @param {*} handler
     * @returns itself
     */
    // eslint-disable-next-line @typescript-eslint/ban-types
    off(events: string | TsEventData | Array<string | TsEventData>, handler?: Function): this {
        if (typeof events == 'string') {
            events = events.split(/[,\s]+/) // separate by comma or space
        } else {
            events = [events as string | TsEventData]
        }
        // any: callback parameter — caller signature varies; TsBase event payload is widget-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (events as Array<any>).forEach((edata: any) => {
            const name = typeof edata == 'string' ? edata : (edata.type + ':' + edata.execute + '.' + edata.scope)
            if (typeof edata == 'string') {
                const [eventName, scope] = edata.split('.')
                const [type, execute] = (eventName ?? '').replace(':complete', ':after').replace(':done', ':after').split(':')
                edata = { type: type || '*', execute: execute || '', scope: scope || '' }
            }
            edata = TsUtils.extend({ type: null, execute: null, onComplete: null }, edata)
            // errors
            if (!edata.type && !edata.scope) { console.log('ERROR: You must specify event type when calling .off() method of '+ this.name); return }
            if (!handler) { handler = undefined }
            let count = 0
            // remove listener
            this.listeners = this.listeners.filter(curr => {
                if ( (edata.type === '*' || edata.type === curr.edata.type)
                    && (edata.execute === '' || edata.execute === curr.edata.execute)
                    && (edata.scope === '' || edata.scope === curr.edata.scope)
                    && (edata.handler == null || edata.handler === curr.edata.handler)
                ) {
                    count++ // how many listeners removed
                    return false
                } else {
                    return true
                }
            })
            if (this.debug) {
                console.log(`TsBase: remove event (${count})`, { name, edata, handler })
            }
        })
        return this // needed for chaining
    }

    /**
     * Triggers even listeners for a specific event, loops through this.listeners
     *
     * @param {Object} edata - Object
     * @returns modified edata
     *
     * NOTE: `edata` is typed as `any` here intentionally. The method mutates the argument
     * from TsEventData into a TsEvent mid-execution. Runtime type mutation is inherent
     * to the event dispatch pattern. Phase 6 strict tighten will revisit this.
     */
    // any: targeted-any per typing_policy; TsBase event payload is widget-defined at runtime
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    trigger(eventName: string | TsEventData | TsEvent, edataIn?: TsEventData): TsEvent {
        // any: targeted-any per typing_policy; TsBase event payload is widget-defined at runtime
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let edata: any
        if (arguments.length == 1) {
            if (typeof eventName == 'string') {
                edata = { type: eventName, target: this }
            } else {
                edata = eventName
            }
        } else {
            edata = edataIn
            edata.type = eventName
            edata.target = edata.target ?? this
        }
        if (TsUtils.isPlainObject(edata) && edata.phase == 'after') {
            // find event
            edata = this.activeEvents.find((event: TsEvent) => {
                if (event.type == edata.type && event.target == edata.target) {
                    return true
                }
                return false
            })
            if (!edata) {
                console.log(`ERROR: Cannot find even handler for "${edata?.type}" on "${edata?.target}".`)
                return edata
            }
            console.log('NOTICE: This syntax "edata.trigger({ phase: \'after\' })" is outdated. Use edata.finish() instead.')
        } else if (!(edata instanceof TsEvent)) {
            edata = new TsEvent(this, edata)
            this.activeEvents.push(edata)
        }
        // eslint-disable-next-line @typescript-eslint/ban-types
        let args: string[], fun: Function | undefined, tmp: RegExpExecArray | null
        if (!Array.isArray(this.listeners)) this.listeners = []
        if (this.debug) {
            console.log(`TsBase: trigger "${edata.type}:${edata.phase}"`, edata)
        }
        // process events in REVERSE order
        for (let h = this.listeners.length-1; h >= 0; h--) {
            const item = this.listeners[h]
            if (item != null && (item.edata.type === edata.type || item.edata.type === '*') &&
                (item.edata['target'] === edata.target || item.edata['target'] == null) &&
                (item.edata.execute === edata.phase || item.edata.execute === '*' || item.edata['phase'] === '*'))
            {
                // add extra params if there
                Object.keys(item.edata).forEach(key => {
                    if (edata[key] == null && item.edata[key] != null) {
                        edata[key] = item.edata[key]
                    }
                })
                // check handler arguments
                args = []
                tmp  = new RegExp(/\((.*?)\)/).exec(String(item.handler).split('=>')[0] ?? '')
                if (tmp) args = (tmp[1] ?? '').split(/\s*,\s*/)
                if (args.length === 2) {
                    item.handler.call(this, edata.target, edata) // old way for back compatibility
                    if (this.debug) console.log(' - call (old)', item.handler)
                } else {
                    item.handler.call(this, edata) // new way
                    if (this.debug) console.log(' - call', item.handler)
                }
                if (edata.isStopped === true || edata.stop === true) return edata // back compatibility edata.stop === true
            }
        }
        // main object events
        const funName = 'on' + edata.type.substr(0,1).toUpperCase() + edata.type.substr(1)
        if (edata.phase === 'before' && typeof (this as Record<string, unknown>)[funName] === 'function') {
            fun = (this as Record<string, unknown>)[funName] as Function // eslint-disable-line @typescript-eslint/ban-types
            // check handler arguments
            args = []
            tmp  = new RegExp(/\((.*?)\)/).exec(String(fun).split('=>')[0] ?? '')
            if (tmp) args = (tmp[1] ?? '').split(/\s*,\s*/)
            if (args.length === 2) {
                fun.call(this, edata.target, edata) // old way for back compatibility
                if (this.debug) console.log(' - call: on[Event] (old)', fun)
            } else {
                fun.call(this, edata) // new way
                if (this.debug) console.log(' - call: on[Event]', fun)
            }
            if (edata.isStopped === true || edata.stop === true) return edata // back compatibility edata.stop === true
        }
        // item object events
        if (edata.object != null && edata.phase === 'before' && typeof (edata.object as Record<string, unknown>)[funName] === 'function') {
            fun = (edata.object as Record<string, unknown>)[funName] as Function // eslint-disable-line @typescript-eslint/ban-types
            // check handler arguments
            args = []
            tmp  = new RegExp(/\((.*?)\)/).exec(String(fun).split('=>')[0] ?? '')
            if (tmp) args = (tmp[1] ?? '').split(/\s*,\s*/)
            if (args.length === 2) {
                fun.call(this, edata.target, edata) // old way for back compatibility
                if (this.debug) console.log(' - call: edata.object (old)', fun)
            } else {
                fun.call(this, edata) // new way
                if (this.debug) console.log(' - call: edata.object', fun)
            }
            if (edata.isStopped === true || edata.stop === true) return edata
        }
        // execute onComplete
        if (edata.phase === 'after') {
            if (typeof edata.onComplete === 'function') edata.onComplete.call(this, edata)
            for (let i = 0; i < edata.listeners.length; i++) {
                if (typeof edata.listeners[i] === 'function') {
                    edata.listeners[i].call(this, edata)
                    if (this.debug) console.log(' - call: done', fun)
                }
            }
            edata._resolve(edata)
            if (this.debug) {
                console.log(`TsBase: trigger "${edata.type}:${edata.phase}"`, edata)
            }
            // clean up activeEvents
            const ind = this.activeEvents.indexOf(edata)
            if (ind !== -1) this.activeEvents.splice(ind, 1)
        }
        return edata
    }

    /**
     * This method renders component into the box. It is overwritten in descendents and in this base
     * component it is empty.
     */
    render(_box?: HTMLElement | string | null): void {
        // intentionally left blank
    }

    /**
     * Removes all classes that start with tsg-* and sets box to null. It is needed so that control will
     * release the box to be used for other widgets
     */
    unmount(): void {
        const edata = this.trigger('unmount', { target: this.name })
        if (edata.isCancelled) {
            return
        }
        const remove: string[] = []
        // find classes that start with "tsg-*"
        if (this.box instanceof HTMLElement) {
            this.box.classList.forEach(cl => {
                if (cl.startsWith('tsg-')) remove.push(cl)
            })
        }
        query(this.box)
            .off() // removes all events attached to this box previously
            .removeClass(remove)
            .removeAttr('name')
            .html('')
        this.box = null
        // event after
        edata.finish()
    }
}
export { TsEvent, TsBase }
export type { TsEventData, TsEventListener }
