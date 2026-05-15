import {
  TsColor,
  TsMenu,
  TsTooltip
} from "./chunk-OFASTA2A.js";
import {
  TsUtils
} from "./chunk-3NYH6545.js";
import {
  TsBase,
  TsUi,
  query
} from "./chunk-DXZJHS4M.js";

// src/tstoolbar.ts
var query2 = query;
var TsToolbar = class extends TsBase {
  routeData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items;
  // any: toolbar items have dynamic shape
  right;
  tooltip;
  item_template;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  last;
  // any: accumulates badge, pendingRefresh, etc.
  // any: callback parameter — caller signature varies; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _refresh;
  _refreshDebounced;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options) {
    super(options.name);
    this.box = null;
    this.name = "";
    this.routeData = {};
    this.items = [];
    this.right = "";
    this.tooltip = "top|left";
    this["onClick"] = null;
    this["onChange"] = null;
    this["onMouseDown"] = null;
    this["onMouseUp"] = null;
    this["onMouseEnter"] = null;
    this["onMouseLeave"] = null;
    this["onRender"] = null;
    this["onRefresh"] = null;
    this["onResize"] = null;
    this["onDestroy"] = null;
    this["onLiveUpdate"] = null;
    this.item_template = {
      id: null,
      // command to be sent to all event handlers
      type: "button",
      // button, check, radio, drop, menu, menu-radio, menu-check, break, html, label, input spacer
      text: null,
      html: "",
      tooltip: null,
      // TsToolbar.tooltip should be
      count: null,
      hidden: false,
      disabled: false,
      checked: false,
      // used for radio buttons
      icon: null,
      route: null,
      // if not null, it is route to go
      arrow: null,
      // arrow down for drop/menu types
      style: null,
      // extra css style for caption
      group: null,
      // used for radio buttons
      items: null,
      // for type menu* it is an array of items in the menu
      selected: null,
      // used for menu-check, menu-radio
      color: null,
      // color value - used in color pickers
      backColor: null,
      // background color value for color pickter
      overlay: {
        // additional options for overlay
        anchorClass: ""
      },
      onClick: null,
      onRefresh: null
    };
    this.last = {
      badge: {},
      pendingRefresh: {}
      // what should be refreshed with a debounce
    };
    this._refresh = ({ effected, resize, refreshTooltip, hideTooltip }) => {
      const options2 = this.last.pendingRefresh;
      options2.ids ??= [];
      options2.ids.push(...effected);
      Object.assign(options2, { resize, refreshTooltip, hideTooltip });
      this._refreshDebounced();
    };
    this._refreshDebounced = TsUtils.debounce(() => {
      const options2 = this.last.pendingRefresh;
      new Set(options2.ids).forEach((id) => {
        this.refresh(id);
        if (options2.hideTooltip) this.tooltipHide(id);
      });
      if (options2.resize) this.resize();
      this.last.pendingRefresh = {};
    }, 15);
    const items = options.items;
    delete options.items;
    Object.assign(this, options);
    if (Array.isArray(items)) this.add(items, true);
    options.items = items;
    if (typeof this.box == "string") this.box = query2(this.box).get(0);
    if (this.box) this.render(this.box);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  add(items, skipRefresh) {
    this.insert(null, items, skipRefresh);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  insert(id, items, skipRefresh) {
    if (!Array.isArray(items)) items = [items];
    items.forEach((item, idx, arr) => {
      if (typeof item === "string") {
        item = arr[idx] = { id: item, text: item };
      }
      const valid = [
        "button",
        "check",
        "radio",
        "drop",
        "menu",
        "menu-radio",
        "menu-check",
        "color",
        "text-color",
        "html",
        "label",
        "input",
        "group",
        "break",
        "spacer",
        "new-line"
      ];
      if (!valid.includes(String(item.type))) {
        console.log('ERROR: The parameter "type" should be one of the following:', valid, `, but ${item.type} is supplied.`, item);
        return;
      }
      if (item.id == null && !["break", "spacer", "new-line"].includes(item.type)) {
        console.log('ERROR: The parameter "id" is required but not supplied.', item);
        return;
      }
      if (!TsUtils.checkUniqueId(item.id, this.items, "toolbar", this.name)) return;
      const newItem = TsUtils.extend({}, this.item_template, item);
      if (newItem.type == "group" && Array.isArray(newItem.items)) {
        newItem.items.forEach((_it, ind) => {
          newItem.items[ind] = TsUtils.extend({}, this.item_template, newItem.items[ind]);
        });
      }
      if (newItem.type == "menu-check") {
        if (!Array.isArray(newItem.selected)) newItem.selected = [];
        if (Array.isArray(newItem.items)) {
          newItem.items.forEach((it, idx2, arr2) => {
            if (typeof it === "string") {
              it = arr2[idx2] = { id: it, text: it };
            }
            if (it.checked && !newItem.selected.includes(it.id)) newItem.selected.push(it.id);
            if (!it.checked && newItem.selected.includes(it.id)) it.checked = true;
            if (it.checked == null) it.checked = false;
          });
        } else if (typeof newItem.items === "function") {
          const materialized = newItem.items(newItem);
          if (Array.isArray(materialized)) {
            materialized.forEach((it) => {
              if (it && it.checked && !newItem.selected.includes(it.id)) newItem.selected.push(it.id);
            });
          }
        }
      } else if (newItem.type == "menu-radio") {
        if (Array.isArray(newItem.items)) {
          newItem.items.forEach((it, idx2, arr2) => {
            if (typeof it === "string") {
              it = arr2[idx2] = { id: it, text: it };
            }
            if (it.checked && newItem.selected == null) newItem.selected = it.id;
            else it.checked = false;
            if (!it.checked && newItem.selected == it.id) it.checked = true;
            if (it.checked == null) it.checked = false;
          });
        }
      }
      if (id == null) {
        this.items.push(newItem);
      } else {
        const middle = this.get(id, true);
        if (middle == null) {
          console.warn(`TsToolbar: insert anchor id "${id}" not found; appending instead.`);
          this.items.push(newItem);
        } else {
          this.items = this.items.slice(0, middle).concat([newItem], this.items.slice(middle));
        }
      }
      newItem.line = newItem.line ?? 1;
      if (skipRefresh !== true) this.refresh(newItem.id);
    });
    if (skipRefresh !== true) this.resize();
  }
  // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remove(...args) {
    let effected = 0;
    args.forEach((item) => {
      const it = this.get(item);
      if (!it || String(item).indexOf(":") != -1) return;
      effected++;
      query2(this.box).find("#tb_" + this.name + "_item_" + TsUtils.escapeId(it.id)).remove();
      const ind = this.get(it.id, true);
      if (ind != null) {
        const top = this.items[ind];
        if (top.id === it.id) {
          this.items.splice(ind, 1);
        } else if (top.type === "group" && Array.isArray(top.items)) {
          const subIdx = top.items.findIndex((s) => s && s.id === it.id);
          if (subIdx !== -1) top.items.splice(subIdx, 1);
        }
      }
    });
    this.resize();
    return effected;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(id, newOptions) {
    const item = this.get(id);
    if (item == null) return false;
    Object.assign(item, newOptions);
    this.refresh(String(id).split(":")[0]);
    return true;
  }
  // any: parameter typed any — runtime dispatch by call site; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(id, returnIndex, items) {
    if (arguments.length === 0) {
      const all = [];
      for (let i1 = 0; i1 < this.items.length; i1++) {
        const it = this.items[i1];
        if (it.id != null) all.push(it.id);
        if (it.type == "group") {
          for (let i2 = 0; i2 < it.items.length; i2++) {
            if (it.items[i2].id != null) all.push(it.items[i2].id);
          }
        }
      }
      return all;
    }
    const tmp = String(id).split(":");
    if (items == null) items = this.items;
    for (let i1 = 0; i1 < items.length; i1++) {
      const it = items[i1];
      if (["menu", "menu-radio", "menu-check"].includes(it.type) && tmp.length == 2 && it.id == tmp[0]) {
        let subItems = it.items;
        if (typeof subItems == "function") subItems = subItems(this);
        for (let i = 0; i < subItems.length; i++) {
          const item = subItems[i];
          if (item.id == tmp[1] || item.id == null && item.text == tmp[1]) {
            if (returnIndex == true) return i;
            else return item;
          }
          if (Array.isArray(item.items)) {
            for (let j = 0; j < item.items.length; j++) {
              if (item.items[j].id == tmp[1] || item.items[j].id == null && item.items[j].text == tmp[1]) {
                if (returnIndex == true) return i;
                else return item.items[j];
              }
            }
          }
        }
      } else if (it.id == tmp[0]) {
        if (returnIndex == true) return i1;
        else return it;
      } else if (it.type == "group") {
        const sub = this.get(id, returnIndex, it.items);
        if (sub != null) {
          if (returnIndex === true) return i1;
          return sub;
        }
      }
    }
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCount(id, count, className, style) {
    const btn = query2(this.box).find(`#tb_${this.name}_item_${TsUtils.escapeId(id)} .tsg-tb-count > span`);
    if (btn.length > 0) {
      btn.removeClass(null).addClass(className ?? "").text(count);
      btn.get(0).style.cssText = style ?? "";
      this.last.badge[id] = {
        className: className ?? "",
        style: style ?? ""
      };
      const item = this.get(id);
      item.count = count;
    } else {
      this.set(id, { count });
      const after = query2(this.box).find(`#tb_${this.name}_item_${TsUtils.escapeId(id)} .tsg-tb-count > span`);
      if (after.length === 0) return;
      this.setCount(id, count, className, style);
    }
  }
  // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  show(...args) {
    const effected = [];
    args.forEach((item) => {
      const it = this.get(item);
      if (!it) return;
      it.hidden = false;
      effected.push(String(item).split(":")[0]);
      if (it.type == "group") {
        it.items.forEach((itm) => this.show(itm.id));
      }
    });
    this._refresh({ effected, resize: true });
    return effected;
  }
  // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hide(...args) {
    const effected = [];
    args.forEach((item) => {
      const it = this.get(item);
      if (!it) return;
      it.hidden = true;
      effected.push(String(item).split(":")[0]);
      if (it.type == "group") {
        it.items.forEach((itm) => this.hide(itm.id));
      }
    });
    this._refresh({ effected, hideTooltip: true, resize: true });
    return effected;
  }
  // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enable(...args) {
    const effected = [];
    args.forEach((item) => {
      const it = this.get(item);
      if (!it) return;
      if (it.type == "group") {
        it.items.forEach((itm) => this.enable(itm.id));
      } else {
        it.disabled = false;
        effected.push(String(item).split(":")[0]);
      }
    });
    this._refresh({ effected });
    return effected;
  }
  // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disable(...args) {
    const effected = [];
    args.forEach((item) => {
      const it = this.get(item);
      if (!it) return;
      if (it.type == "group") {
        it.items.forEach((itm) => this.disable(itm.id));
      } else {
        it.disabled = true;
        effected.push(String(item).split(":")[0]);
      }
    });
    this._refresh({ effected, hideTooltip: true });
    return effected;
  }
  // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  check(...args) {
    const effected = [];
    args.forEach((item) => {
      const it = this.get(item);
      if (!it || String(item).indexOf(":") != -1) return;
      if (it.type == "group") {
        it.items.forEach((itm) => this.check(itm.id));
      } else {
        it.checked = true;
        effected.push(String(item).split(":")[0]);
      }
    });
    this._refresh({ effected });
    return effected;
  }
  // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uncheck(...args) {
    const effected = [];
    args.forEach((item) => {
      const it = this.get(item);
      if (!it || String(item).indexOf(":") != -1) return;
      if (["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(it.type) && it.checked) {
        TsTooltip.hide(this.name + "-drop");
      }
      if (it.type == "group") {
        it.items.forEach((itm) => this.uncheck(itm.id));
      } else {
        it.checked = false;
        effected.push(String(item).split(":")[0]);
      }
    });
    this._refresh({ effected });
    return effected;
  }
  /**
   * Toggle the `checked` state of one or more items.
   *
   * State management only — does NOT fire events (no `onClick`, no `onChange`)
   * and does NOT open drop / menu / color overlays. For full UI interaction
   * including opening pickers, call `click(id)` instead.
   *
   * Per-item behaviour:
   *   - button / check / html / spacer / break: flips `it.checked`.
   *   - drop / menu / menu-radio / menu-check / color / text-color: if currently
   *     checked, closes the toolbar's `-drop` overlay via `TsTooltip.hide` before
   *     flipping. Same overlay-close path as `uncheck()`. Never opens overlays.
   *   - radio: emits `console.warn` and is skipped (would leave the group with
   *     no checked member). Use `check()` / `uncheck()` for radios.
   *   - group: recurses into `it.items` and toggles each child individually; the
   *     group container itself is never in the effected list.
   *   - sub-id with `:` notation: skipped (same guard as siblings).
   *   - missing id: silently skipped.
   *
   * @param args  ids of items to toggle. Varargs, independent per id.
   * @returns     array of ids whose checked state actually flipped. Never `undefined`.
   */
  // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggle(...args) {
    const effected = [];
    args.flat().forEach((item) => {
      const it = this.get(item);
      if (!it || String(item).indexOf(":") != -1) return;
      if (it.type == "radio") {
        console.warn(`TsToolbar.toggle: radio items are not supported, use check()/uncheck() instead. Item: ${item}`);
        return;
      }
      if (it.type == "group") {
        const childIds = it.items.map((itm) => itm.id);
        const childEffected = this.toggle(...childIds);
        effected.push(...childEffected);
        return;
      }
      const newChecked = !it.checked;
      if (["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(it.type) && it.checked) {
        TsTooltip.hide(this.name + "-drop");
      }
      it.checked = newChecked;
      effected.push(String(item).split(":")[0]);
    });
    this._refresh({ effected });
    return effected;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  click(id, event) {
    const tmp = String(id).split(":");
    const it = this.get(tmp[0]);
    let items = it && it.items ? TsUtils.normMenu.call(this, it.items, it) : [];
    if (tmp.length > 1) {
      const subItem = this.get(id);
      if (subItem && !subItem.disabled) {
        this.menuClick({ name: this.name, item: it, subItem, originalEvent: event });
      }
      return;
    }
    if (it && !it.disabled) {
      const edata = this.trigger("click", {
        target: id != null ? id : this.name,
        item: it,
        object: it,
        originalEvent: event
      });
      if (edata.isCancelled === true) return;
      items = it && it.items ? TsUtils.normMenu.call(this, it.items, it) : [];
      const btn = "#tb_" + this.name + "_item_" + TsUtils.escapeId(it.id);
      query2(this.box).find(btn).removeClass("down");
      if (it.type == "radio") {
        for (let i = 0; i < this.items.length; i++) {
          const itt = this.items[i];
          if (itt.type == "group") {
            for (let i1 = 0; i1 < itt.items.length; i1++) {
              const itt1 = itt.items[i1];
              if (itt1 == null || itt1.id == it.id || itt1.type !== "radio") continue;
              if (itt1.group == it.group && itt1.checked) {
                itt1.checked = false;
                this.refresh(itt1.id);
              }
            }
          }
          if (itt == null || itt.id == it.id || itt.type !== "radio") continue;
          if (itt.group == it.group && itt.checked) {
            itt.checked = false;
            this.refresh(itt.id);
          }
        }
        it.checked = true;
        query2(this.box).find(btn).addClass("checked");
      }
      if (["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(it.type)) {
        this.tooltipHide(id);
        if (it.checked) {
          TsTooltip.hide(this.name + "-drop");
          return;
        } else {
          const overlay = TsTooltip.get(this.name + "-drop");
          if (overlay?.displayed) overlay.hide();
          overlay?.listeners?.splice(0);
          setTimeout(() => {
            const hideDrop = (id2, _btn) => {
              return () => {
                this.set(id2, { checked: false });
              };
            };
            const el = query2(this.box).find("#tb_" + this.name + "_item_" + TsUtils.escapeId(it.id));
            if (!TsUtils.isPlainObject(it.overlay)) it.overlay = {};
            if (it.type == "drop") {
              ;
              TsTooltip.show(TsUtils.extend({
                html: it.html,
                class: "tsg-white",
                hideOn: ["doc-click"]
              }, it.overlay, {
                anchor: el[0],
                name: this.name + "-drop",
                data: { item: it, btn }
                // any: cast-to-any for dynamic dispatch; TsToolbar item shape varies by `type` at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              })).hide(hideDrop(it.id, btn));
            }
            if (["menu", "menu-radio", "menu-check"].includes(it.type)) {
              let menuType = "normal";
              if (it.type == "menu-radio") {
                menuType = "radio";
                items?.forEach((item) => {
                  if (it.selected == item.id) item["checked"] = true;
                  else item["checked"] = false;
                });
              }
              if (it.type == "menu-check") {
                menuType = "check";
                items?.forEach((item) => {
                  if (Array.isArray(it.selected) && it.selected.includes(item.id)) item["checked"] = true;
                  else item["checked"] = false;
                });
              }
              ;
              TsMenu.show(TsUtils.extend({
                items,
                selected: -1,
                align: it.text ? "left" : "none"
                // if there is no text, then no alignent
              }, it.overlay, {
                type: menuType,
                name: this.name + "-drop",
                anchor: el[0],
                data: { item: it, btn }
                // any: cast-to-any for dynamic dispatch; TsToolbar item shape varies by `type` at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              })).hide(hideDrop(it.id, btn)).remove((event2) => {
                this.menuClick({
                  name: this.name,
                  remove: true,
                  item: it,
                  subItem: event2.detail.item,
                  originalEvent: event2
                });
              }).select((event2) => {
                this.menuClick({
                  name: this.name,
                  item: it,
                  subItem: event2.detail.item,
                  originalEvent: event2
                });
              });
            }
            if (["color", "text-color"].includes(it.type)) {
              ;
              TsColor.show(TsUtils.extend({
                color: it.color
              }, it.overlay, {
                anchor: el[0],
                name: this.name + "-drop",
                data: { item: it, btn }
                // any: cast-to-any for dynamic dispatch; TsToolbar item shape varies by `type` at runtime
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              })).hide(hideDrop(it.id, btn)).liveUpdate((event2) => {
                const edata2 = this.trigger("liveUpdate", { name: this.name, item: it, color: event2.detail.color });
                edata2.finish();
              }).select((event2) => {
                if (event2.detail.color != null) {
                  this.colorClick({ name: this.name, item: it, color: event2.detail.color });
                }
              });
            }
          }, 0);
        }
      }
      if (["check", "menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(it.type)) {
        it.checked = !it.checked;
        if (it.checked) {
          query2(this.box).find(btn).addClass("checked");
        } else {
          query2(this.box).find(btn).removeClass("checked");
        }
      }
      if (it.route) {
        let route = String("/" + it.route).replace(/\/{2,}/g, "/");
        const info = TsUtils.parseRoute(route);
        if (info.keys.length > 0) {
          for (let k = 0; k < info.keys.length; k++) {
            const key = info.keys[k];
            if (key == null) continue;
            route = route.replace(new RegExp(":" + key.name, "g"), this.routeData[key.name]);
          }
        }
        setTimeout(() => {
          window.location.hash = route;
        }, 1);
      }
      this.tooltipShow(id);
      edata.finish();
    }
  }
  // any: callback parameter — caller signature varies; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scroll(direction, line, instant) {
    return new Promise((resolve, _reject) => {
      const scrollBox = query2(this.box).find(`.tsg-tb-line:nth-child(${line}) .tsg-scroll-wrapper`);
      const scrollBoxEl = scrollBox.get(0);
      const scrollLeft = scrollBoxEl.scrollLeft;
      const right = scrollBox.find(".tsg-tb-right").get(0);
      const width1 = scrollBox.parent().get(0).getBoundingClientRect().width;
      const width2 = scrollLeft + right.offsetLeft + right.clientWidth;
      switch (direction) {
        case "left": {
          let scrollPos = scrollLeft - width1 + 50;
          if (scrollPos <= 0) scrollPos = 0;
          scrollBoxEl.scrollTo({ top: 0, left: scrollPos, behavior: instant ? "auto" : "smooth" });
          break;
        }
        case "right": {
          let scrollPos = scrollLeft + width1 - 50;
          if (scrollPos >= width2 - width1) scrollPos = width2 - width1;
          scrollBoxEl.scrollTo({ top: 0, left: scrollPos, behavior: instant ? "auto" : "smooth" });
          break;
        }
      }
      setTimeout(() => {
        this.resize();
        resolve();
      }, instant ? 0 : 600);
    });
  }
  // any: callback parameter — caller signature varies; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render(box) {
    const time = Date.now();
    if (typeof box == "string") box = query2(box).get(0);
    const edata = this.trigger("render", { target: this.name, box: box ?? this.box });
    if (edata.isCancelled === true) return;
    if (box != null) {
      this.unmount();
      this.box = box;
    }
    if (!this.box) return;
    if (!Array.isArray(this.right)) {
      this.right = [this.right];
    }
    let html = "";
    let line = 0;
    for (let i = 0; i < this.items.length; i++) {
      const it = this.items[i];
      if (it == null) continue;
      if (it.id == null) it.id = "item_" + i;
      if (it.caption != null) {
        console.log("NOTICE: toolbar item.caption property is deprecated, please use item.text. Item -> ", it);
      }
      if (it.hint != null) {
        console.log("NOTICE: toolbar item.hint property is deprecated, please use item.tooltip. Item -> ", it);
      }
      if (i === 0 || it.type == "new-line") {
        line++;
        html += `
                    <div class="tsg-tb-line">
                        <div class="tsg-scroll-wrapper tsg-eaction" data-mousedown="resize">
                            <div class="tsg-tb-right">${this.right[line - 1] ?? ""}</div>
                        </div>
                        <div class="tsg-scroll-left tsg-eaction" data-click='["scroll", "left", "${line}"]'></div>
                        <div class="tsg-scroll-right tsg-eaction" data-click='["scroll", "right", "${line}"]'></div>
                    </div>
                `;
      }
      it.line = line;
    }
    query2(this.box).attr("name", this.name).addClass("tsg-reset tsg-toolbar").html(html);
    if (query2(this.box).length > 0) {
      query2(this.box)[0].style.cssText += this["style"];
    }
    TsUtils.bindEvents(query2(this.box).find(".tsg-tb-line .tsg-eaction"), this);
    this.last.observeResize = new ResizeObserver(() => {
      this.resize();
    });
    this.last.observeResize.observe(this.box);
    this.refresh();
    this.resize();
    edata.finish();
    return Date.now() - time;
  }
  // any: callback parameter — caller signature varies; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refresh(id) {
    const time = Date.now();
    const edata = this.trigger("refresh", { target: id != null ? id : this.name, item: this.get(id) });
    if (edata.isCancelled === true) return;
    let edata2;
    if (id == null) {
      for (let i = 0; i < this.items.length; i++) {
        const it1 = this.items[i];
        if (it1.id == null) it1.id = "item_" + i;
        this.refresh(it1.id);
      }
      return;
    }
    const it = this.get(id);
    if (it == null) return false;
    if (typeof it.onRefresh == "function") {
      edata2 = this.trigger("refresh", { target: id, item: it, object: it });
      if (edata2.isCancelled === true) return;
    }
    const selector = `#tb_${this.name}_item_${TsUtils.escapeId(it.id)}`;
    const btn = query2(this.box).find(selector);
    const html = this.getItemHTML(it);
    this.tooltipHide(id);
    if (it.type == "spacer") {
      query2(this.box).find(`.tsg-tb-line:nth-child(${it.line ?? 1})`).find(".tsg-tb-right").css("width", "auto");
    }
    if (btn.length === 0) {
      const next = parseInt(this.get(id, true)) + 1;
      let $next = query2(this.box).find(`#tb_${this.name}_item_${TsUtils.escapeId(this.items[next] ? this.items[next].id : "--")}`);
      if ($next.length == 0) {
        $next = query2(this.box).find(`.tsg-tb-line:nth-child(${it.line})`).find(".tsg-tb-right").before(html);
      } else {
        $next.after(html);
      }
      TsUtils.bindEvents(query2(this.box).find(`${selector}, ${selector} .tsg-eaction`), this);
    } else {
      query2(this.box).find(selector).replace(query.html(html));
      const newBtn = query2(this.box).find(selector);
      TsUtils.bindEvents(newBtn, this);
      TsUtils.bindEvents(newBtn.find(".tsg-eaction"), this);
      const overlays = TsTooltip.get(true);
      if (overlays != null) Object.keys(overlays).forEach((key) => {
        if (overlays[key]?.anchor == btn.get(0)) {
          overlays[key].anchor = newBtn.get(0);
        }
      });
    }
    if (["menu", "menu-radio", "menu-check"].includes(it.type) && it.checked) {
      const selected = Array.isArray(it.selected) ? it.selected : [it.selected];
      const items = typeof it.items == "function" ? it.items(it) : [...it.items];
      items.forEach((item) => {
        if (selected.includes(item.id)) item.checked = true;
        else item.checked = false;
      });
      TsMenu.update(this.name + "-drop", items);
    }
    if (typeof it.onRefresh == "function") {
      edata2.finish();
    }
    edata.finish();
    return Date.now() - time;
  }
  resize() {
    const time = Date.now();
    const edata = this.trigger("resize", { target: this.name });
    if (edata.isCancelled === true) return;
    query2(this.box).find(".tsg-tb-line").each((el) => {
      const box = query2(el);
      box.find(".tsg-scroll-left, .tsg-scroll-right").hide();
      const scrollBox = box.find(".tsg-scroll-wrapper").get(0);
      const $right = box.find(".tsg-tb-right");
      const boxWidth = box.get(0).getBoundingClientRect().width;
      const itemsWidth = $right.length > 0 ? $right[0].offsetLeft + $right[0].clientWidth : 0;
      if (boxWidth < itemsWidth) {
        if (scrollBox.scrollLeft > 0) {
          box.find(".tsg-scroll-left").show();
        }
        if (boxWidth < itemsWidth - scrollBox.scrollLeft) {
          box.find(".tsg-scroll-right").show();
        }
      }
    });
    edata.finish();
    return Date.now() - time;
  }
  destroy() {
    const edata = this.trigger("destroy", { target: this.name });
    if (edata.isCancelled === true) return;
    TsTooltip.hide(this.name + "-tooltip");
    TsTooltip.hide(this.name + "-drop");
    if (query2(this.box).find(".tsg-scroll-wrapper").length > 0) {
      this.unmount();
    }
    delete TsUi[this.name];
    edata.finish();
  }
  unmount() {
    super.unmount();
    this.last.observeResize?.disconnect();
  }
  // ========================================
  // --- Internal Functions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getItemHTML(item) {
    let html = "";
    if (item.caption != null && item.text == null) item.text = item.caption;
    if (item.text == null) item.text = "";
    if (item.tooltip == null && item.hint != null) item.tooltip = item.hint;
    if (item.tooltip == null) item.tooltip = "";
    if (typeof item.get !== "function" && (Array.isArray(item.items) || typeof item.items == "function")) {
      item.get = function get(id) {
        let tmp = item.items;
        if (typeof tmp == "function") tmp = item.items(item);
        return tmp.find((it) => it.id == id ? true : false);
      };
    }
    let icon = "";
    let text = typeof item.text == "function" ? item.text.call(this, item) : item.text;
    if (item.icon) {
      icon = item.icon;
      if (typeof item.icon == "function") {
        icon = item.icon.call(this, item);
      }
      if (String(icon).slice(0, 1) !== "<") {
        icon = `<span class="${icon}" ${item.icon_style ? `style="${item.icon_style}"` : ""}></span>`;
      }
      icon = `<div class="tsg-tb-icon">${icon}</div>`;
    }
    const classes = ["tsg-tb-button", "tsg-eaction"];
    if (item.checked) classes.push("checked");
    if (item.disabled) classes.push("disabled");
    if (item.hidden) classes.push("hidden");
    if (!icon) classes.push("no-icon");
    switch (item.type) {
      case "color":
      case "text-color":
        if (typeof item.color == "string") {
          if (item.color.slice(0, 1) == "#") item.color = item.color.slice(1);
          if ([3, 6, 8].includes(item.color.length)) item.color = "#" + item.color;
        }
        if (item.type == "color") {
          text = `<span class="tsg-tb-color-box" style="background-color: ${item.color != null ? item.color : "#fff"}"></span>
                           ${item.text ? `<div style="margin-left: 17px;">${TsUtils.lang(item.text)}</div>` : ""}`;
        }
        if (item.type == "text-color") {
          const color = item.color != null ? item.color : "#444";
          let bcolor = item.backColor;
          if (item.backColor === true) {
            bcolor = "#fff";
            if (TsUtils.colorContrastValue("#fff", color) < 2) {
              bcolor = "#555";
            }
          }
          text = `<span style="color: ${color}">${item.text ? TsUtils.lang(item.text) : item.backColor ? `<b style="background-color: ${bcolor ?? "transparent"}; padding: 2px 5px; border-radius: 3px;">Ab</b>` : "<b>Ab</b>"}</span>`;
        }
      // falls through
      case "menu":
      case "menu-check":
      case "menu-radio":
      case "button":
      case "check":
      case "radio":
      case "label":
      case "drop": {
        const arrow = item.arrow === true || item.arrow !== false && ["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(item.type);
        html = `
                    <div id="tb_${this.name}_item_${item.id}" class="${classes.join(" ")} ${item.class ? item.class : ""}"
                        style="${item.hidden ? "display: none;" : ""} ${item.type == "label" ? (item.style ?? "") + ";" : ""}"
                        ${!item.disabled ? `data-click='["click","${item.id}", "event"]'
                               data-mouseenter='["mouseAction", "event", "this", "Enter", "${item.id}"]'
                               data-mouseleave='["mouseAction", "event", "this", "Leave", "${item.id}"]'
                               data-mousedown='["mouseAction", "event", "this", "Down", "${item.id}"]'
                               data-mouseup='["mouseAction", "event", "this", "Up", "${item.id}"]'` : ""}
                    >
                        ${icon}
                        ${text != "" && text != null || item.count != null || arrow ? `<div class="tsg-tb-text" style="${item.type != "label" ? item.style ?? "" : ""}; ${!text ? "padding-left: 0; margin-left: 23px;" : ""}">
                                    ${TsUtils.lang(text)}
                                    ${item.count != null ? TsUtils.stripSpaces(`
                                            <span class="tsg-tb-count">
                                                <span class="${this.last.badge[item.id] ? this.last.badge[item.id].className ?? "" : ""}"
                                                        style="${this.last.badge[item.id] ? this.last.badge[item.id].style ?? "" : ""}">${item.count}</span>
                                            </span>`) : ""}
                                    ${arrow ? `<span class="tsg-tb-down" ${!text && !item.count ? 'style="margin-left: -3px"' : ""}><span></span></span>` : ""}
                                </div>` : ""}
                    </div>
                `;
        break;
      }
      case "break": {
        html = `<div id="tb_${this.name}_item_${item.id}" class="tsg-tb-break"
                            style="${item.hidden ? "display: none" : ""}; ${item.style ? item.style : ""}">
                            &#160;
                        </div>`;
        break;
      }
      case "spacer": {
        html = `<div id="tb_${this.name}_item_${item.id}" class="tsg-tb-spacer"
                            style="${item.hidden ? "display: none" : ""}; ${item.style ? item.style : ""}">
                        </div>`;
        break;
      }
      case "html": {
        html = `<div id="tb_${this.name}_item_${item.id}" class="tsg-tb-html ${classes.join(" ")}"
                            style="${item.hidden ? "display: none" : ""}; ${item.style ? item.style : ""}">
                            ${typeof item.html == "function" ? item.html.call(this, item) : item.html}
                        </div>`;
        break;
      }
      case "input": {
        const ph = item.placeholder;
        let val = item.value;
        if (item.spinner && typeof item.spinner == "object") {
          item.input ??= {};
          Object.assign(item.input, item.spinner, { spinner: true });
        }
        if (val != null && String(val).trim() !== "" && item.input?.spinner) {
          const step = item.input?.step ?? 1;
          const prec = item.input?.precision ?? String(step).split(".")[1]?.length ?? 0;
          val = isNaN(val) ? val : Number(val).toFixed(prec);
        }
        html = `<div id="tb_${this.name}_item_${item.id}" class="tsg-tb-input tsg-eaction ${classes.join(" ")}"
                            style="${item.hidden ? "display: none" : ""}; ${item.style ? item.style : ""}"
                        >
                            <span class="tsg-input-label">${item.text ?? ""}</span>
                            ${item.input?.spinner ? `<span class="tsg-spinner-dec tsg-eaction" data-click='["spinner", "${item.id}", "dec", "event"]'> \u2013 </span>` : ""}
                            <input class="tsg-toolbar-input tsg-eaction ${item.input?.spinner ? "tsg-has-spinner" : ""}"
                                ${ph ? `placeholder="${ph}"` : ""} style="${item.input?.style ?? ""}"
                                value="${val ?? ""}${item.input?.suffix ?? ""}" ${item.input?.attrs ?? ""}
                                data-input='["change", "${item.id}", "this", true]'
                                data-change='["change", "${item.id}", "this"]'
                                data-keydown='["spinner", "${item.id}", "key", "event"]'
                                data-mouseenter='["mouseAction", "event", "this", "Enter", "${item.id}"]'
                                data-mouseleave='["mouseAction", "event", "this", "Leave", "${item.id}"]'
                            >
                            ${item.input?.spinner ? `<span class="tsg-spinner-inc tsg-eaction" data-click='["spinner", "${item.id}", "inc", "event"]'> + </span>` : ""}
                        </div>`;
        break;
      }
      case "group": {
        html = `<div id="tb_${this.name}_item_${item.id}" class="tsg-tb-group"
                    style="display: ${item.hidden ? "none" : "flex"}; ${item.style ? item.style : ""}">`;
        if (Array.isArray(item.items)) {
          item.items.forEach((it) => {
            html += this.getItemHTML(it);
          });
        } else {
          console.log("ERROR: toolbar group is empty");
        }
        html += "</div>";
      }
    }
    return html;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  spinner(id, action, event) {
    const it = this.get(id);
    let inc = 0;
    const edata = this.trigger("keyDown", { id, item: it, originalEvent: event });
    switch (action) {
      case "inc": {
        inc = it.input?.step ?? 1;
        break;
      }
      case "dec": {
        inc = -(it.input?.step ?? 1);
        break;
      }
      case "key": {
        if (it.input?.spinner || it.input?.step != null) {
          let mult = 1;
          if (event.shiftKey || event.metaKey) mult = 10;
          if (event.altKey) mult = 0.1;
          switch (event.key) {
            case "ArrowUp": {
              inc = (it.input?.step ?? 1) * mult;
              event.preventDefault();
              break;
            }
            case "ArrowDown": {
              inc = -(it.input?.step ?? 1) * mult;
              event.preventDefault();
              break;
            }
          }
        }
        break;
      }
    }
    if (inc !== 0) {
      this.change(id, parseFloat(it.value ?? 0) + inc);
    }
    edata.finish();
  }
  // any: callback parameter — caller signature varies; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change(id, value, dynamic) {
    const it = this.get(id);
    const input = query2(this.box).find("#tb_" + this.name + "_item_" + TsUtils.escapeId(id)).find("input.tsg-toolbar-input");
    if (value instanceof HTMLInputElement) {
      value = value.value;
    }
    if (value == null) value = input.val();
    if (it.input?.spinner || it.input?.min != null || it.input?.max != null || it.input?.step != null) {
      value = parseFloat(value);
    }
    if (it.input?.suffix != null) {
      const strValue = String(value);
      if (strValue.substr(-it.input.suffix.length) == it.input.suffix) {
        value = strValue.substr(0, strValue.length - it.input.suffix.length);
      }
    }
    if (it.input?.min != null && it.input.min > value) {
      value = it.input.min;
    }
    if (it.input?.max != null && it.input.max < value) {
      value = it.input.max;
    }
    if (it.input?.step != null) {
      if (isNaN(value)) value = it.input.min ?? 0;
      const step = it.input.step ?? 1;
      const prec = it.input.precision ?? String(step).split(".")[1]?.length ?? 0;
      value = Number(value).toFixed(prec);
    }
    const edata = this.trigger(dynamic ? "input" : "change", { target: id, id, value, item: it });
    if (edata.isCancelled) {
      return;
    }
    it.value = value;
    let suffix = "";
    if (it.input?.suffix != null && String(value).substr(-it.input.suffix.length) != it.input.suffix) {
      suffix = it.input.suffix;
    }
    if (!dynamic) input.val(value + suffix);
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltipShow(id) {
    if (this.tooltip == null) return;
    const el = query2(this.box).find("#tb_" + this.name + "_item_" + TsUtils.escapeId(id)).get(0);
    const item = this.get(id);
    const overlay = typeof this.tooltip == "string" ? { position: this.tooltip } : this.tooltip;
    let txt = item.tooltip;
    if (typeof txt == "function") txt = txt.call(this, item);
    if (["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(item.type) && item.checked == true) {
      return;
    }
    TsTooltip.show({
      anchor: el,
      name: this.name + "-tooltip",
      html: txt,
      ...overlay
    });
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltipHide(_id) {
    if (this.tooltip == null) return;
    TsTooltip.hide(this.name + "-tooltip");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuClick(event) {
    if (event.item && !event.item.disabled) {
      const edata = this.trigger(event.remove !== true ? "click" : "remove", {
        target: event.item.id + ":" + event.subItem.id,
        item: event.item,
        subItem: event.subItem,
        originalEvent: event.originalEvent
      });
      if (edata.isCancelled === true) return;
      const it = event.subItem;
      const item = this.get(event.item.id);
      let items = item.items;
      if (typeof items == "function") items = item.items();
      if (item.type == "menu") {
        item.selected = it.id;
      }
      if (item.type == "menu-radio") {
        item.selected = it.id;
        if (Array.isArray(items)) {
          items.forEach((item2) => {
            if (item2.checked === true) delete item2.checked;
            if (Array.isArray(item2.items)) {
              item2.items.forEach((item3) => {
                if (item3.checked === true) delete item3.checked;
              });
            }
          });
        }
        it.checked = true;
      }
      if (item.type == "menu-check") {
        if (!Array.isArray(item.selected)) item.selected = [];
        if (it.group == null) {
          const ind = item.selected.indexOf(it.id);
          if (ind == -1) {
            item.selected.push(it.id);
            it.checked = true;
          } else {
            item.selected.splice(ind, 1);
            it.checked = false;
          }
        } else if (it.group === false) {
        } else {
          const unchecked = [];
          const ind = item.selected.indexOf(it.id);
          const checkNested = (items2) => {
            items2.forEach((sub) => {
              if (sub.group === it.group) {
                const ind2 = item.selected.indexOf(sub.id);
                if (ind2 != -1) {
                  if (sub.id != it.id) unchecked.push(sub.id);
                  item.selected.splice(ind2, 1);
                }
              }
              if (Array.isArray(sub.items)) checkNested(sub.items);
            });
          };
          checkNested(items);
          if (ind == -1) {
            item.selected.push(it.id);
            it.checked = true;
          }
        }
      }
      if (typeof it.route == "string") {
        let route = it.route !== "" ? String("/" + it.route).replace(/\/{2,}/g, "/") : "";
        const info = TsUtils.parseRoute(route);
        if (info.keys.length > 0) {
          for (let k = 0; k < info.keys.length; k++) {
            const key = info.keys[k];
            if (key == null || this.routeData[key.name] == null) continue;
            route = route.replace(new RegExp(":" + key.name, "g"), this.routeData[key.name]);
          }
        }
        setTimeout(() => {
          window.location.hash = route;
        }, 1);
      }
      this.refresh(event.item.id);
      edata.finish();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  colorClick(event) {
    if (event.item && !event.item.disabled) {
      const edata = this.trigger("click", { target: event.item.id, item: event.item, color: event.color, final: true });
      if (edata.isCancelled === true) return;
      event.item.color = event.color;
      this.refresh(event.item.id);
      edata.finish();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mouseAction(event, target, action, id) {
    const btn = this.get(id);
    const edata = this.trigger("mouse" + action, { target: id, item: btn, object: btn, originalEvent: event });
    if (edata.isCancelled === true || btn.disabled || btn.hidden) {
      edata.finish();
      return;
    }
    switch (action) {
      case "Enter":
        if (!["label", "input"].includes(btn.type)) {
          query2(target).addClass("over");
        }
        this.tooltipShow(id);
        break;
      case "Leave":
        if (!["label", "input"].includes(btn.type)) {
          query2(target).removeClass("over down");
        }
        this.tooltipHide(id);
        break;
      case "Down":
        if (!["label", "input"].includes(btn.type)) {
          query2(target).addClass("down");
        }
        break;
      case "Up":
        if (!["label", "input"].includes(btn.type)) {
          query2(target).removeClass("down");
        }
        break;
    }
    edata.finish();
  }
};

export {
  TsToolbar
};
//# sourceMappingURL=chunk-EVZMMVXO.js.map