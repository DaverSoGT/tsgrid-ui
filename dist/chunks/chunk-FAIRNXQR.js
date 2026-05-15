import {
  lazySingleton
} from "./chunk-EQK6JAHT.js";
import {
  TsUtils
} from "./chunk-3NYH6545.js";
import {
  TsBase,
  query
} from "./chunk-DXZJHS4M.js";

// src/tstooltip.ts
var query2 = query;
var Tooltip = class _Tooltip {
  // no need to extend TsBase, as each individual tooltip extends it
  static active = {};
  defaults;
  // any: setColor is assigned dynamically inside ColorTooltip.initControls closure
  setColor;
  // optional hook — overridden in subclasses; declared as method stub to allow subclass override
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initControls(_overlay) {
  }
  constructor() {
    this.defaults = {
      name: null,
      // name for the overlay, otherwise input id is used
      html: "",
      // text or html
      style: "",
      // additional style for the overlay
      class: "",
      // add class for tsg-tooltip-body
      position: "top|bottom",
      // can be left, right, top, bottom
      draggable: false,
      // if true, then tooltip can be move with mouse
      align: "",
      // can be: both, both:XX left, right, both, top, bottom
      anchor: null,
      // element it is attached to, if anchor is body, then it is context menu
      contextMenu: false,
      // if true, then it is context menu
      anchorClass: "",
      // add class for anchor when tooltip is shown
      anchorStyle: "",
      // add style for anchor when tooltip is shown
      autoShow: false,
      // if autoShow true, then tooltip will show on mouseEnter and hide on mouseLeave
      autoShowOn: null,
      // when options.autoShow = true, mouse event to show on
      autoHideOn: null,
      // when options.autoShow = true, mouse event to hide on
      arrowSize: 8,
      // size of the carret
      screenMargin: 2,
      // min margin from screen to tooltip
      autoResize: true,
      // auto resize based on content size and available size
      margin: 1,
      // distance from the anchor
      offsetX: 0,
      // delta for left coordinate
      offsetY: 0,
      // delta for top coordinate
      maxWidth: null,
      // max width
      maxHeight: null,
      // max height
      hideOn: null,
      // events when to hide tooltip, ['doc-click', 'tooltip-click', 'focus-change', 'select', 'item-remove', ... or any standard event on the anchor],
      onThen: null,
      // called when displayed
      onShow: null,
      // callBack when shown
      onHide: null,
      // callBack when hidden
      onUpdate: null,
      // callback when tooltip gets updated
      onMove: null
      // callback when tooltip is moved
    };
  }
  static observeRemove = new MutationObserver((_mutations) => {
    let cnt = 0;
    Object.keys(_Tooltip.active).forEach((name) => {
      const overlay = _Tooltip.active[name];
      if (overlay?.displayed) {
        if (!overlay.anchor || !overlay.anchor.isConnected) {
          overlay.hide();
        } else {
          cnt++;
        }
      }
    });
    if (cnt === 0) {
      _Tooltip.observeRemove.disconnect();
    }
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger(event, data) {
    if (arguments.length == 2) {
      const type = event;
      event = data;
      data.type = type;
    }
    if (event.overlay) {
      return event.overlay.trigger(event);
    } else {
      console.log("ERROR: cannot find overlay where to trigger events");
      return { finish: () => {
      } };
    }
  }
  get(name) {
    if (arguments.length == 0) {
      return Object.keys(_Tooltip.active);
    } else if (name === true) {
      return _Tooltip.active;
    } else {
      return _Tooltip.active[(name ?? "").replace(/[\s\.#]/g, "_")];
    }
  }
  attach(anchorArg, textArg) {
    let anchor = anchorArg;
    let text = textArg;
    let options;
    let overlay;
    const self = this;
    if (arguments.length == 0) {
      return;
    } else if (arguments.length == 1 && anchor instanceof Object) {
      options = anchor;
      anchor = options.anchor;
    } else if (arguments.length === 2 && typeof text === "string") {
      options = { anchor, html: text };
      text = options.html;
    } else if (arguments.length === 2 && text != null && typeof text === "object") {
      options = text;
      text = options.html;
    }
    options = TsUtils.extend({}, this.defaults, options || {});
    if (!text && options.text) text = options.text;
    if (!text && options.html) text = options.html;
    delete options.anchor;
    let name = options.name ? options.name : anchor?.id;
    if (anchor == document || anchor == null) {
      anchor = document.body;
    }
    if (options.contextMenu) {
      anchor = document.body;
      name = name ?? "context-menu";
    }
    if (!name) {
      name = "noname-" + Object.keys(_Tooltip.active).length;
      console.log("NOTICE: name property is not defined for tooltip, could lead to too many instances");
    }
    name = name.replace(/[\s\.#]/g, "_");
    if (_Tooltip.active[name]) {
      overlay = _Tooltip.active[name];
      overlay.prevOptions = overlay.options;
      overlay.options = options;
      overlay.anchor = anchor;
      if (overlay.prevOptions.html != overlay.options.html || overlay.prevOptions.class != overlay.options.class || overlay.prevOptions.style != overlay.options.style) {
        overlay.needsUpdate = true;
      }
      options = overlay.options;
      Object.keys(overlay).forEach((key) => {
        const val = overlay[key];
        if (key.startsWith("on") && typeof val == "function") {
          delete overlay[key];
        }
      });
    } else {
      overlay = new TsBase();
      Object.assign(overlay, {
        id: "w2overlay-" + name,
        name,
        options,
        anchor,
        self,
        displayed: false,
        tmp: {
          observeTooltipResize: new ResizeObserver(() => {
            this.resize(overlay.name);
          }),
          observeAnchorResize: new ResizeObserver(() => {
            this.resize(overlay.name);
          }),
          observeAnchorMove: new MutationObserver((mutations) => {
            const target = mutations[0].target;
            const currRect = target.getBoundingClientRect();
            const lastRect = target._lastBoundingRect;
            if (!target._lastBoundingRect) {
              target._lastBoundingRect = currRect;
            } else if (currRect.left !== lastRect.left || currRect.top !== lastRect.top) {
              this.resize(overlay.name);
              target._lastBoundingRect = currRect;
            }
          })
        },
        hide() {
          self.hide(name);
        }
      });
      _Tooltip.active[name] = overlay;
    }
    Object.keys(overlay.options).forEach((key) => {
      const val = overlay.options[key];
      if (key.startsWith("on") && typeof val == "function") {
        overlay[key] = val;
        delete overlay.options[key];
      }
    });
    if (options.autoShow === true) {
      options.autoShowOn = options.autoShowOn ?? "mouseenter";
      options.autoHideOn = options.autoHideOn ?? "mouseleave";
      options.autoShow = false;
      options._keep = true;
    }
    if (options.autoShowOn) {
      const scope = "autoShow-" + overlay.name;
      query2(anchor).off(`.${scope}`).on(`${options.autoShowOn}.${scope}`, (event) => {
        self.show(overlay.name);
        event.stopPropagation();
      });
      delete options.autoShowOn;
      options._keep = true;
    }
    if (options.autoHideOn) {
      const scope = "autoHide-" + overlay.name;
      query2(anchor).off(`.${scope}`).on(`${options.autoHideOn}.${scope}`, (event) => {
        self.hide(overlay.name);
        event.stopPropagation();
      });
      delete options.autoHideOn;
      options._keep = true;
    }
    overlay.off(".attach");
    const ret = {
      overlay,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      then: (callback) => {
        overlay.on("show:after.attach", (event) => {
          callback(event);
        });
        return ret;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      show: (callback) => {
        overlay.on("show.attach", (event) => {
          callback(event);
        });
        return ret;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hide: (callback) => {
        overlay.on("hide.attach", (event) => {
          callback(event);
        });
        return ret;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      update: (callback) => {
        overlay.on("update.attach", (event) => {
          callback(event);
        });
        return ret;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      move: (callback) => {
        overlay.on("move.attach", (event) => {
          callback(event);
        });
        return ret;
      }
    };
    return ret;
  }
  update(name, html) {
    const overlay = _Tooltip.active[name];
    if (overlay) {
      overlay.needsUpdate = true;
      overlay.options.html = html;
      this.show(name);
    } else {
      console.log(`Tooltip "${name}" is not displayed. Cannot update it.`);
    }
  }
  show(name, extraOptions) {
    if (name instanceof HTMLElement || name instanceof Object) {
      let options2 = name;
      if (name instanceof HTMLElement) {
        options2 = extraOptions || {};
        options2.anchor = name;
      }
      const ret = this.attach(options2);
      ret.overlay.tmp.hidden = false;
      query2(ret.overlay.anchor).off(".autoShow-" + ret.overlay.name).off(".autoHide-" + ret.overlay.name);
      setTimeout(() => {
        if (!ret.overlay.tmp.hidden) {
          this.show(ret.overlay.name);
          if (this.initControls) {
            this.initControls(ret.overlay);
          }
        }
      }, 1);
      return ret;
    }
    let edata;
    const self = this;
    const overlay = _Tooltip.active[name.replace(/[\s\.#]/g, "_")];
    if (!overlay) return;
    const options = overlay.options;
    if (!overlay || overlay.displayed && !overlay.needsUpdate) {
      this.resize(overlay?.name);
      return;
    }
    const position = options.position.split("|");
    const isVertical = ["top", "bottom"].includes(position[0]);
    let overlayStyles = options.align == "both" && isVertical ? "" : "white-space: nowrap;";
    if (options.maxWidth == null && /^<div[^>]*style=["'][^"']*max-width[^"']*["'][^>]*>/i.test(options.html?.trim?.() ?? "")) {
      options.maxWidth = TsUtils.getStrWidth(options.html, "", true);
    }
    if (options.maxWidth && TsUtils.getStrWidth(options.html, "", true) >= options.maxWidth) {
      overlayStyles = "width: " + options.maxWidth + "px; white-space: inherit; overflow: auto;";
    }
    overlayStyles += " max-height: " + (options.maxHeight ? options.maxHeight : window.innerHeight - 4) + "px;";
    if (options.html === "" || options.html == null) {
      self.hide(name);
      return;
    } else if (overlay.box) {
      edata = this.trigger("update", { target: name, overlay });
      if (edata.isCancelled === true) {
        if (overlay.prevOptions) {
          overlay.options = overlay.prevOptions;
          delete overlay.prevOptions;
        }
        return;
      }
      query2(overlay.box).find(".tsg-overlay-body").attr("style", (options.style || "") + "; " + overlayStyles).removeClass(null).addClass("tsg-overlay-body " + options.class + (options.draggable ? " tsg-draggable" : "")).html(options.html);
      this.resize(overlay.name);
    } else {
      edata = this.trigger("show", { target: name, overlay });
      if (edata.isCancelled === true) return;
      query2("body").append(
        // pointer-events will be re-enabled leter
        `<div id="${overlay.id}" name="${name}" style="display: none; pointer-events: none" class="tsg-overlay"
                        data-click="stop" data-focusin="stop">
                    <style></style>
                    <div class="tsg-overlay-body tsg-eaction ${options.class} ${options.draggable ? "tsg-draggable" : ""}"
                            style="${options.style || ""}; ${overlayStyles}" ${options.draggable ? 'data-mousedown="startDrag|event"' : ""}>
                        ${options.html}
                    </div>
                </div>`
      );
      overlay.box = query2("#" + TsUtils.escapeId(overlay.id))[0];
      overlay.displayed = true;
      const names = query2(overlay.anchor).data("tooltipName") ?? [];
      names.push(name);
      query2(overlay.anchor).data("tooltipName", names);
      TsUtils.bindEvents(overlay.box, {});
      overlay.tmp.originalCSS = "";
      if (query2(overlay.anchor).length > 0) {
        overlay.tmp.originalCSS = query2(overlay.anchor)[0].style.cssText;
      }
      this.resize(overlay.name);
    }
    if (options.anchorStyle) {
      overlay.anchor.style.cssText += ";" + options.anchorStyle;
    }
    if (options.anchorClass) {
      if (!(options.anchorClass == "tsg-focus" && overlay.anchor == document.body)) {
        query2(overlay.anchor).addClass(options.anchorClass);
      }
    }
    if (typeof options.hideOn == "string") options.hideOn = [options.hideOn];
    if (!Array.isArray(options.hideOn)) options.hideOn = [];
    Object.assign(overlay.tmp, {
      scrollLeft: document.body.scrollLeft,
      scrollTop: document.body.scrollTop
    });
    addHideEvents();
    addWatchEvents(document.body);
    query2(overlay.box).show();
    overlay.tmp.observeTooltipResize.observe(overlay.box);
    overlay.tmp.observeAnchorResize.observe(overlay.anchor);
    overlay.tmp.observeAnchorMove.observe(overlay.anchor, { attributes: true });
    _Tooltip.observeRemove.observe(document.body, { subtree: true, childList: true });
    query2(overlay.box).css("opacity", 1).find(".tsg-overlay-body").html(options.html);
    setTimeout(() => {
      query2(overlay.box).css({ "pointer-events": "auto" }).data("ready", "yes");
    }, 100);
    TsUtils.bindEvents(query2(overlay.box).find(".tsg-eaction"), this);
    delete overlay.needsUpdate;
    overlay.box.overlay = overlay;
    query2(overlay.box).off("mousedown.tsg-bringfront").on("mousedown.tsg-bringfront", () => {
      self.bringOverlayToFront(overlay);
    });
    if (edata) edata.finish();
    return { overlay };
    function addWatchEvents(el) {
      const scope = "tooltip-" + overlay.name;
      let queryEl = el;
      if (el.tagName == "BODY") {
        queryEl = el.ownerDocument;
      }
      query2(queryEl).off(`.${scope}`).on(`scroll.${scope}`, (_event) => {
        Object.assign(overlay.tmp, {
          scrollLeft: el.scrollLeft,
          scrollTop: el.scrollTop
        });
        self.resize(overlay.name);
      });
    }
    function addHideEvents() {
      const hide = (_event) => {
        self.hide(overlay.name);
      };
      const $anchor = query2(overlay.anchor);
      const scope = "tooltip-" + overlay.name;
      query2("html").off(`.${scope}`);
      if (options.hideOn.includes("doc-click")) {
        if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
          $anchor.off(`.${scope}-doc`).on(`click.${scope}-doc`, (event) => {
            event.stopPropagation();
          });
        }
        query2("html").on(`click.${scope}`, hide);
      }
      if (options.hideOn.includes("tooltip-click")) {
        query2(overlay.box).off(`click.${scope}`).on(`click.${scope}`, hide);
      }
      if (options.hideOn.includes("focus-change") || options.hideOn.includes("blur")) {
        query2("html").on(`focusin.${scope}`, (_e) => {
          if (document.activeElement != overlay.anchor) {
            self.hide(overlay.name);
          }
        });
      }
      if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
        $anchor.off(`.${scope}`);
        options.hideOn.forEach((event) => {
          if (["doc-click", "focus-change", "blur"].indexOf(event) == -1) {
            $anchor.on(`${event}.${scope}`, { once: true }, hide);
          }
        });
      }
    }
  }
  hide(name) {
    let overlay;
    if (arguments.length == 0) {
      Object.keys(_Tooltip.active).forEach((name2) => {
        this.hide(name2);
      });
      return;
    }
    if (name instanceof HTMLElement) {
      const names2 = query2(name).data("tooltipName") ?? [];
      names2.forEach((name2) => {
        this.hide(name2);
      });
      return;
    }
    if (typeof name == "string") {
      name = name.replace(/[\s\.#]/g, "_");
      overlay = _Tooltip.active[name];
    }
    if (overlay?.tmp) overlay.tmp.hidden = true;
    if (!overlay || !overlay.box) return;
    const edata = this.trigger("hide", { target: name, overlay });
    if (edata.isCancelled === true) return;
    if (!overlay.options._keep) delete _Tooltip.active[name];
    const scope = "tooltip-" + overlay.name;
    overlay.tmp.observeTooltipResize?.disconnect();
    overlay.tmp.observeAnchorResize?.disconnect();
    overlay.tmp.observeAnchorMove?.disconnect();
    let cnt = 0;
    Object.keys(_Tooltip.active).forEach((key) => {
      const overlay2 = _Tooltip.active[key];
      if (overlay2?.displayed) {
        cnt++;
      }
    });
    if (cnt == 0) {
      _Tooltip.observeRemove.disconnect();
    }
    query2("html").off(`.${scope}`);
    query2(document).off(`.${scope}`);
    overlay.box?.remove();
    overlay.box = null;
    overlay.displayed = false;
    const names = query2(overlay.anchor).data("tooltipName") ?? [];
    const ind = names.indexOf(overlay.name);
    if (ind != -1) names.splice(names.indexOf(overlay.name), 1);
    if (names.length == 0) {
      query2(overlay.anchor).removeData("tooltipName");
    } else {
      query2(overlay.anchor).data("tooltipName", names);
    }
    if (overlay.options.anchorStyle) {
      overlay.anchor.style.cssText = overlay.tmp.originalCSS;
    }
    query2(overlay.anchor).off(`.${scope}`).removeClass(overlay.options.anchorClass);
    if (overlay.options.url) {
      overlay.options.items.splice(0);
      overlay.tmp.remote.hasMore = true;
      overlay.tmp.remote.search = null;
    }
    edata.finish();
  }
  resize(name) {
    const state = { moved: false, resize: false };
    if (arguments.length == 0) {
      Object.keys(_Tooltip.active).forEach((key) => {
        const overlay2 = _Tooltip.active[key];
        if (overlay2.displayed) this.resize(overlay2.name);
      });
      return { multiple: true };
    }
    const overlay = _Tooltip.active[(name ?? "").replace(/[\s\.#]/g, "_")];
    const pos = this.getPosition(overlay.name);
    const newPos = pos.left + "x" + pos.top;
    const newSize = pos.width + "x" + pos.height;
    let edata1, edata2;
    if (overlay.tmp.lastPos != newPos) {
      edata1 = this.trigger("move", { target: name, overlay, pos });
      state.moved = true;
    }
    if (overlay.tmp.lastSize != newSize) {
      edata2 = this.trigger("resize", { target: name, overlay, pos });
      state.moved = true;
    }
    const qBox = query2(overlay.box).css({
      left: pos.left + "px",
      top: pos.top + "px"
    });
    qBox.then((q) => {
      if (pos.width != null) {
        q.css("width", pos.width + "px").find(".tsg-overlay-body").css("width", "100%");
      }
      if (pos.height != null) {
        q.css("height", pos.height + "px").find(".tsg-overlay-body").css("height", "100%");
      }
      return q;
    }).find(".tsg-overlay-body").removeClass("tsg-arrow-right tsg-arrow-left tsg-arrow-top tsg-arrow-bottom").addClass(pos.arrow.class).closest(".tsg-overlay").find("style:first-child").text(pos.arrow.style);
    if (overlay.tmp.lastPos != newPos && edata1) {
      overlay.tmp.lastPos = newPos;
      edata1.finish();
    }
    if (overlay.tmp.lastSize != newSize && edata2) {
      overlay.tmp.lastSize = newSize;
      edata2.finish();
    }
    return state;
  }
  getPosition(name) {
    const overlay = _Tooltip.active[name.replace(/[\s\.#]/g, "_")];
    if (!overlay || !overlay.box) {
      return;
    }
    const options = overlay.options;
    if (overlay.tmp.resizedY || overlay.tmp.resizedX) {
      query2(overlay.box).css({ width: "", height: "", scroll: "auto" });
    }
    const scrollSize = TsUtils.scrollBarSize();
    const hasScrollBarX = !(document.body.scrollWidth == document.body.clientWidth);
    const hasScrollBarY = !(document.body.scrollHeight == document.body.clientHeight);
    const max = {
      width: window.innerWidth - (hasScrollBarY ? scrollSize : 0),
      height: window.innerHeight - (hasScrollBarX ? scrollSize : 0)
    };
    const position = options.position == "auto" ? "top|bottom|right|left".split("|") : Array.isArray(options.position) ? options.position : options.position.split("|");
    const isVertical = ["top", "bottom"].includes(position[0]);
    const content = overlay.box.getBoundingClientRect();
    let anchor = overlay.anchor?.getBoundingClientRect?.();
    const min_width = TsUtils.getStrWidth(options.html, "", true);
    if (content.width < min_width) content.width = min_width;
    if (overlay.anchor == document.body) {
      let evt = options.originalEvent;
      while (evt?.originalEvent) {
        evt = evt.originalEvent;
      }
      const { x, y, width: width2, height: height2 } = evt ?? { x: options.x, y: options.y, width: 0, height: 10 };
      anchor = {
        left: x - (options.contextMenu ? 4 : 0),
        top: y - (options.contextMenu ? 4 : 0),
        width: width2 ?? 0,
        height: height2 ?? 10,
        arrow: options.contextMenu ? "none" : null
      };
    }
    let arrowSize = options.arrowSize;
    if (anchor.arrow == "none") arrowSize = 0;
    if (isNaN(arrowSize)) arrowSize = this.defaults.arrowSize;
    const available = {
      // tipsize adjustment should be here, not in max.width/max.height
      top: anchor.top - arrowSize,
      bottom: max.height - arrowSize - (anchor.top + anchor.height) - (hasScrollBarX ? scrollSize : 0) - 2,
      left: anchor.left,
      right: max.width - (anchor.left + anchor.width) + (hasScrollBarY ? scrollSize : 0)
    };
    if (content.width < 22) content.width = 22;
    if (content.height < 14) content.height = 14;
    let left, top, width, height;
    let found = "";
    const arrow = {
      offset: 0,
      class: "",
      style: `#${overlay.id} { --tip-size: ${arrowSize}px; }`
    };
    const adjust = { left: 0, top: 0 };
    const bestFit = { posX: "", x: 0, posY: "", y: 0 };
    position.forEach((pos) => {
      const avail = available[pos] ?? 0;
      if (["top", "bottom"].includes(pos)) {
        if (!found && content.height + arrowSize / 1.893 < avail) {
          found = pos;
        }
        if (avail > bestFit.y) {
          Object.assign(bestFit, { posY: pos, y: avail });
        }
      }
      if (["left", "right"].includes(pos)) {
        if (!found && content.width + arrowSize / 1.893 < avail) {
          found = pos;
        }
        if (avail > bestFit.x) {
          Object.assign(bestFit, { posX: pos, x: avail });
        }
      }
    });
    if (!found) {
      if (isVertical) {
        found = bestFit.posY;
      } else {
        found = bestFit.posX;
      }
    }
    if (options.autoResize) {
      if (["top", "bottom"].includes(found)) {
        const availFound = available[found] ?? 0;
        if (content.height > availFound) {
          height = availFound;
          overlay.tmp.resizedY = true;
        } else {
          overlay.tmp.resizedY = false;
        }
      }
      if (["left", "right"].includes(found)) {
        const availFound = available[found] ?? 0;
        if (content.width > availFound) {
          width = availFound;
          overlay.tmp.resizedX = true;
        } else {
          overlay.tmp.resizedX = false;
        }
      }
    }
    usePosition(found);
    if (isVertical) anchorAlignment();
    top = (top ?? 0) + parseFloat(String(options.offsetY * (found == "top" ? -1 : 1)));
    left = (left ?? 0) + parseFloat(String(options.offsetX * (found == "left" ? -1 : 1)));
    screenAdjust();
    const extraTop = found == "top" ? -options.margin : found == "bottom" ? options.margin : 0;
    const extraLeft = found == "left" ? -options.margin : found == "right" ? options.margin : 0;
    top = Math.floor(((top ?? 0) + parseFloat(extraTop)) * 100) / 100;
    left = Math.floor(((left ?? 0) + parseFloat(extraLeft)) * 100) / 100;
    const retPos = { left: left ?? 0, top: top ?? 0, arrow, adjust, pos: found };
    if (width != null) retPos.width = width;
    if (height != null) retPos.height = height;
    return retPos;
    function usePosition(pos) {
      arrow.class = anchor.arrow ? anchor.arrow : `tsg-arrow-${pos}`;
      switch (pos) {
        case "top": {
          left = anchor.left + (anchor.width - (width ?? content.width)) / 2;
          top = anchor.top - (height ?? content.height) - arrowSize / 1.5 + 1;
          break;
        }
        case "bottom": {
          left = anchor.left + (anchor.width - (width ?? content.width)) / 2;
          top = anchor.top + anchor.height + arrowSize / 1.25 + 1;
          break;
        }
        case "left": {
          left = anchor.left - (width ?? content.width) - arrowSize / 1.2 - 1;
          top = anchor.top + (anchor.height - (height ?? content.height)) / 2;
          break;
        }
        case "right": {
          left = anchor.left + anchor.width + arrowSize / 1.2 + 1;
          top = anchor.top + (anchor.height - (height ?? content.height)) / 2;
          break;
        }
      }
    }
    function anchorAlignment() {
      if (options.align == "left") {
        adjust.left = anchor.left - (left ?? 0);
        left = anchor.left;
      }
      if (options.align == "right") {
        adjust.left = anchor.left + anchor.width - (width ?? content.width) - (left ?? 0);
        left = anchor.left + anchor.width - (width ?? content.width);
      }
      if (["top", "bottom"].includes(found) && options.align.startsWith("both")) {
        const minWidth = options.align.split(":")[1] ?? 50;
        if (anchor.width >= minWidth) {
          left = anchor.left;
          width = anchor.width;
        }
      }
      if (options.align == "top") {
        adjust.top = anchor.top - (top ?? 0);
        top = anchor.top;
      }
      if (options.align == "bottom") {
        adjust.top = anchor.top + anchor.height - (height ?? content.height) - (top ?? 0);
        top = anchor.top + anchor.height - (height ?? content.height);
      }
      if (["left", "right"].includes(found) && options.align.startsWith("both")) {
        const minHeight = options.align.split(":")[1] ?? 50;
        if (anchor.height >= minHeight) {
          top = anchor.top;
          height = anchor.height;
        }
      }
    }
    function screenAdjust() {
      let adjustArrow;
      if (["left", "right"].includes(options.align) && anchor.width < (width ?? content.width) || ["top", "bottom"].includes(options.align) && anchor.height < (height ?? content.height)) {
        adjustArrow = true;
      }
      const minLeft = found == "right" ? arrowSize : options.screenMargin;
      const minTop = found == "bottom" ? arrowSize : options.screenMargin;
      const maxLeft = max.width - (width ?? content.width) - (found == "left" ? arrowSize : options.screenMargin);
      const maxTop = max.height - (height ?? content.height) - (found == "top" ? arrowSize : options.screenMargin) + 3;
      if (["top", "bottom"].includes(found) || options.autoResize) {
        if ((left ?? 0) < minLeft) {
          adjustArrow = true;
          adjust.left -= left ?? 0;
          left = minLeft;
        }
        if ((left ?? 0) > maxLeft) {
          adjustArrow = true;
          adjust.left -= (left ?? 0) - maxLeft;
          left = (left ?? 0) + maxLeft - (left ?? 0);
        }
      }
      if (["left", "right"].includes(found) || options.autoResize) {
        if ((top ?? 0) < minTop) {
          adjustArrow = true;
          adjust.top -= top ?? 0;
          top = minTop;
        }
        if ((top ?? 0) > maxTop) {
          adjustArrow = true;
          adjust.top -= (top ?? 0) - maxTop;
          top = (top ?? 0) + maxTop - (top ?? 0);
        }
      }
      if (adjustArrow) {
        const aType = isVertical ? "left" : "top";
        const sType = isVertical ? "width" : "height";
        arrow.offset = -adjust[aType];
        const maxOffset = content[sType] / 2 - arrowSize;
        if (Math.abs(arrow.offset) > maxOffset + arrowSize) {
          arrow.class = "";
        }
        if (Math.abs(arrow.offset) > maxOffset) {
          arrow.offset = arrow.offset < 0 ? -maxOffset : maxOffset;
        }
        arrow.style = TsUtils.stripSpaces(`#${overlay.id} .tsg-overlay-body:after,
                            #${overlay.id} .tsg-overlay-body:before {
                                --tip-size: ${arrowSize}px;
                                margin-${aType}: ${arrow.offset}px;
                            }`);
      }
    }
  }
  /**
   * Move overlay node to the end of its parent (typically body) so it stacks above other .tsg-overlay siblings
   * without relying on z-index. No-op if it is already the last element child.
   */
  bringOverlayToFront(overlay) {
    if (!overlay || !overlay.box || !overlay.box.parentNode || !overlay.box.nextElementSibling) {
      return;
    }
    overlay.box.parentNode.appendChild(overlay.box);
  }
  startDrag(event) {
    if (event.preventDefault) {
      event.preventDefault();
    }
    const el = query2(event.target).closest(".tsg-overlay");
    const overlay = el[0]?.overlay;
    if (overlay) {
      this.bringOverlayToFront(overlay);
    }
    const initial = {
      el,
      x: parseFloat(el.css("left")),
      // any: css(string) returns string when reading a property
      y: parseFloat(el.css("top")),
      pageX: event.pageX,
      pageY: event.pageY,
      moved: false,
      _removed: false
    };
    query2(document).off(".tsg-drag").on("selectstart.tsg-drag, dragstart.tsg-drag", (e) => e.preventDefault()).find("body").addClass("tsg-overlay-dragging");
    query2("html").off(".TsColor").on("mousemove.TsColor", mouseMove).on("mouseup.TsColor", mouseUp);
    function mouseUp(_event) {
      query2("html").off(".TsColor");
      query2(document).off("selectstart.tsg-drag");
      query2(document).off("dragstart.tsg-drag");
      query2(document.body).removeClass("tsg-overlay-dragging");
      if (initial["moved"]) {
        const ov = initial.el[0] && initial.el[0].overlay;
        if (ov) {
          if (!ov.tmp) ov.tmp = {};
          ov.tmp["moved"] = true;
          clearTimeout(ov.tmp["_movedClearTimer"]);
          ov.tmp["_movedClearTimer"] = setTimeout(() => {
            if (ov.tmp) {
              delete ov.tmp["moved"];
              delete ov.tmp["_movedClearTimer"];
            }
          }, 400);
        }
      }
    }
    function mouseMove(event2) {
      const divX = event2.pageX - initial.pageX;
      const divY = event2.pageY - initial.pageY;
      if (Math.abs(divX) > 3 || Math.abs(divY) > 3) {
        initial.moved = true;
      }
      initial.el.css({
        left: initial.x + divX + "px",
        top: initial.y + divY + "px"
      });
      if (!initial._removed) {
        initial._removed = true;
        initial.el.find(":scope > .tsg-overlay-body").removeClass("tsg-arrow-right tsg-arrow-left tsg-arrow-top tsg-arrow-bottom");
      }
    }
  }
};
var ColorTooltip = class _ColorTooltip extends Tooltip {
  static custom_colors = [];
  palette;
  // any: index tracks keyboard position in the palette grid; tuple [row, col]
  index;
  constructor() {
    super();
    this.palette = [
      ["000000", "333333", "555555", "777777", "888888", "999999", "AAAAAA", "CCCCCC", "DDDDDD", "EEEEEE", "F7F7F7", "FFFFFF"],
      ["FF011B", "FF9838", "FFC300", "FFFD59", "86FF14", "14FF7A", "2EFFFC", "2693FF", "006CE7", "9B24F4", "FF21F5", "FF0099"],
      ["FFEAEA", "FCEFE1", "FCF4DC", "FFFECF", "EBFFD9", "D9FFE9", "E0FFFF", "E8F4FF", "ECF4FC", "EAE6F4", "FFF5FE", "FCF0F7"],
      ["F4CCCC", "FCE5CD", "FFF1C2", "FFFDA1", "D5FCB1", "B5F7D0", "BFFFFF", "D6ECFF", "CFE2F3", "D9D1E9", "FFE3FD", "FFD9F0"],
      ["EA9899", "F9CB9C", "FFE48C", "F7F56F", "B9F77E", "84F0B1", "83F7F7", "B5DAFF", "9FC5E8", "B4A7D6", "FAB9F6", "FFADDE"],
      ["E06666", "F6B26B", "DEB737", "E0DE51", "8FDB48", "52D189", "4EDEDB", "76ACE3", "6FA8DC", "8E7CC3", "E07EDA", "F26DBD"],
      ["CC0814", "E69138", "AB8816", "B5B20E", "6BAB30", "27A85F", "1BA8A6", "3C81C7", "3D85C6", "674EA7", "A14F9D", "BF4990"],
      ["99050C", "B45F17", "80650E", "737103", "395E14", "10783D", "13615E", "094785", "0A5394", "351C75", "780172", "782C5A"]
    ];
    this.defaults = TsUtils.extend({}, this.defaults, {
      advanced: false,
      transparent: true,
      position: "top|bottom",
      class: "tsg-white",
      color: "",
      updateInput: true,
      arrowSize: 12,
      autoResize: false,
      anchorClass: "tsg-focus",
      autoShowOn: "focus",
      hideOn: ["doc-click", "focus-change"],
      onSelect: null,
      onLiveUpdate: null
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attach(anchor, text) {
    let options;
    if (arguments.length == 1 && anchor instanceof Object) {
      options = anchor;
      anchor = options.anchor;
    } else if (arguments.length === 2 && text != null && typeof text === "object") {
      options = text;
      options.anchor = anchor;
    }
    const prevHideOn = options.hideOn;
    options = TsUtils.extend({}, this.defaults, options || {});
    if (prevHideOn) {
      options.hideOn = prevHideOn;
    }
    options.style += "; padding: 0;";
    if (options.transparent && this.palette[0][1] == "333333") {
      this.palette[0].splice(1, 1);
      this.palette[0].push("TRANSPARENT");
    }
    if (!options.transparent && this.palette[0][1] != "333333") {
      this.palette[0].splice(1, 0, "333333");
      this.palette[0].pop();
    }
    if (options.color) options.color = String(options.color).toUpperCase();
    if (typeof options.color === "string" && options.color.substr(0, 1) === "#") options.color = options.color.substr(1);
    this.index = [-1, -1];
    const ret = super.attach(options);
    const overlay = ret.overlay;
    overlay.options.html = this.getColorHTML(overlay.name, options);
    overlay.on("show.attach", (event) => {
      const overlay2 = event.detail.overlay;
      const anchor2 = overlay2.anchor;
      const options2 = overlay2.options;
      if (["INPUT", "TEXTAREA"].includes(anchor2.tagName) && !options2.color && anchor2.value) {
        overlay2.tmp["initColor"] = anchor2.value;
      }
      delete overlay2.newColor;
    });
    overlay.on("show:after.attach", (_event) => {
      if (ret.overlay?.box) {
        const actions = query2(ret.overlay.box).find(".tsg-eaction");
        TsUtils.bindEvents(actions, this);
        this.initControls(ret.overlay);
      }
    });
    overlay.on("update:after.attach", (_event) => {
      if (ret.overlay?.box) {
        const actions = query2(ret.overlay.box).find(".tsg-eaction");
        TsUtils.bindEvents(actions, this);
        this.initControls(ret.overlay);
      }
    });
    overlay.on("hide.attach", (event) => {
      const overlay2 = event.detail.overlay;
      const anchor2 = overlay2.anchor;
      const color = overlay2.newColor ?? overlay2.options.color ?? "";
      if (color !== "") {
        if (["INPUT", "TEXTAREA"].includes(anchor2.tagName) && anchor2.value != color && overlay2.options.updateInput) {
          anchor2.value = color;
        }
        const edata = this.trigger("select", { color, target: overlay2.name, overlay: overlay2 });
        if (edata.isCancelled === true) return;
        edata.finish();
      }
    });
    ret.liveUpdate = (callback) => {
      overlay.on("liveUpdate.attach", (event) => {
        callback(event);
      });
      return ret;
    };
    ret.select = (callback) => {
      overlay.on("select.attach", (event) => {
        callback(event);
      });
      return ret;
    };
    return ret;
  }
  // regular panel handler, adds selection class
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select(color, name) {
    let target;
    this.index = [-1, -1];
    if (typeof name != "string") {
      target = name.target;
      this.index = (query2(target).attr("index") ?? "").split(":").map(Number);
      name = query2(target).closest(".tsg-overlay").attr("name");
    }
    const overlay = this.get(name);
    const edata = this.trigger("liveUpdate", { color, target: name, overlay, param: name });
    if (edata.isCancelled === true) return;
    if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName) && overlay.options.updateInput) {
      query2(overlay.anchor).val(color);
    }
    overlay.newColor = color;
    query2(overlay.box).find(".tsg-color.tsg-selected").removeClass("tsg-selected");
    if (target) {
      query2(target).addClass("tsg-selected");
    }
    edata.finish();
  }
  // used for keyboard navigation, if any
  nextColor(direction) {
    const pal = this.palette;
    switch (direction) {
      case "up":
        this.index[0]--;
        break;
      case "down":
        this.index[0]++;
        break;
      case "right":
        this.index[1]++;
        break;
      case "left":
        this.index[1]--;
        break;
    }
    if (this.index[0] < 0) this.index[0] = 0;
    if (this.index[0] > pal.length - 2) this.index[0] = pal.length - 2;
    if (this.index[1] < 0) this.index[1] = 0;
    if (this.index[1] > (pal[0]?.length ?? 0) - 1) this.index[1] = (pal[0]?.length ?? 1) - 1;
    return pal[this.index[0]]?.[this.index[1]];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tabClick(index, name) {
    if (typeof name != "string") {
      name = query2(name.target).closest(".tsg-overlay").attr("name");
    }
    const overlay = this.get(name);
    const tab = query2(overlay.box).find(`.tsg-color-tab:nth-child(${index})`);
    query2(overlay.box).find(".tsg-color-tab").removeClass("tsg-selected");
    query2(tab).addClass("tsg-selected");
    query2(overlay.box).find(".tsg-tab-content").hide().closest(".tsg-colors").find(".tab-" + index).show();
  }
  // generate HTML with color pallent and controls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getColorHTML(name, options) {
    let html = `
            <div class="tsg-colors-header tsg-eaction" data-mousedown="startDrag|event">
                Colors
            </div>
            <div class="tsg-colors">
                <div class="tsg-tab-content tab-1">`;
    for (let i = 0; i < this.palette.length; i++) {
      html += '<div class="tsg-color-row">';
      for (let j = 0; j < (this.palette[i]?.length ?? 0); j++) {
        const color = this.palette[i][j];
        let border = "";
        if (color === "FFFFFF") border = "; border: 1px solid #efefef";
        html += `
                    <div class="tsg-color tsg-eaction ${color === "TRANSPARENT" ? "tsg-no-color" : ""} ${options.color == color ? "tsg-selected" : ""}"
                        style="background-color: #${color + border};" name="${color}" index="${i}:${j}"
                        data-mousedown="select|'${color}'|event" data-mouseup="hide|${name}">&nbsp;
                    </div>`;
      }
      html += "</div>";
      if (i < 2) html += '<div style="height: 8px"></div>';
    }
    html += `
            <div style="height: 8px"></div>
            <div class="tsg-colors-custom">
                ${this.getCustomColorsHTML(name)}
            </div>`;
    html += "</div>";
    html += `
            <div class="tsg-tab-content tab-2" style="display: none">
                <div class="color-info">
                    <div class="color-preview-bg"><div class="color-preview"></div><div class="color-original"></div></div>
                    <div class="color-part">
                        <span>H</span> <input class="tsg-input" name="h" maxlength="3" max="360" tabindex="101">
                        <span>R</span> <input class="tsg-input" name="r" maxlength="3" max="255" tabindex="104">
                    </div>
                    <div class="color-part">
                        <span>S</span> <input class="tsg-input" name="s" maxlength="3" max="100" tabindex="102">
                        <span>G</span> <input class="tsg-input" name="g" maxlength="3" max="255" tabindex="105">
                    </div>
                    <div class="color-part">
                        <span>V</span> <input class="tsg-input" name="v" maxlength="3" max="100" tabindex="103">
                        <span>B</span> <input class="tsg-input" name="b" maxlength="3" max="255" tabindex="106">
                    </div>
                    <div class="color-part opacity">
                        <span>${TsUtils.lang("Opacity")}</span>
                        <input class="tsg-input" name="a" maxlength="5" max="1" tabindex="107">
                    </div>
                </div>
                <div class="palette" name="palette">
                    <div class="palette-bg"></div>
                    <div class="value1 move-x move-y"></div>
                </div>
                <div class="rainbow" name="rainbow">
                    <div class="value2 move-x"></div>
                </div>
                <div class="alpha" name="alpha">
                    <div class="alpha-bg"></div>
                    <div class="value2 move-x"></div>
                </div>
                <div class="final" name="final">
                    <span style="text-align: right"> Hex </span>
                    <input class="tsg-input final" name="hex" tabindex="107" style="width: 70px" readonly>
                    <div class="tsg-color tsg-color-picker tsg-eaction" data-click="pickAndUse|${name}">
                        <span class="tsg-icon tsg-icon-eye-dropper"></span>
                    </div>
                </div>
            </div>`;
    html += `
            <div class="tsg-color-tabs">
                <div class="tsg-color-tab tsg-selected tsg-eaction" data-click="tabClick|1|event|this"><span class="tsg-icon tsg-icon-colors"></span></div>
                <div class="tsg-color-tab tsg-eaction" data-click="tabClick|2|event|this"><span class="tsg-icon tsg-icon-settings"></span></div>
                <div style="padding: 5px; width: 100%; text-align: right;">
                    ${typeof options.html == "string" ? options.html : ""}
                </div>
            </div>`;
    return html;
  }
  getCustomColorsHTML(name) {
    const options = this.get(name)?.options;
    let html = '<div class="tsg-color-row" style="min-height: 21px">';
    _ColorTooltip.custom_colors.forEach((color, i) => {
      let border = "";
      if (color === "FFFFFF") border = "; border: 1px solid #efefef";
      html += `
                <div class="tsg-color tsg-eaction ${color === "TRANSPARENT" ? "tsg-no-color" : ""} ${options.color == color ? "tsg-selected" : ""}"
                    style="background-color: #${color + border};" name="${color}" index="c:${i}"
                    data-mousedown="select|'${color}'|event" data-mouseup="hide|${name}">&nbsp;
                </div>`;
    });
    html += `
                <div class="tsg-color tsg-color-picker tsg-eaction" data-click="pickAndSelect|${name}|event">
                    <span class="tsg-icon tsg-icon-eye-dropper"></span>
                </div>
            </div>`;
    return html;
  }
  // bind advanced tab controls
  initControls(overlay) {
    let initial;
    const self = this;
    const options = overlay.options;
    const color = options.color || overlay.tmp["initColor"];
    let rgb = TsUtils.parseColor(color);
    if (rgb == null) {
      rgb = { r: 140, g: 150, b: 160, a: 1 };
    }
    let hsv = TsUtils.rgb2hsv(rgb);
    if (options.advanced === true) {
      this.tabClick(2, overlay.name);
    }
    setColor(hsv, true, color ?? "");
    query2(overlay.box).off(".TsColor").on("contextmenu.TsColor", (event) => {
      event.preventDefault();
    }).find("input").off(".TsColor").on("change.TsColor", (event) => {
      const el = query2(event.target);
      let val = parseFloat(el.val());
      const max = parseFloat(el.attr("max"));
      if (isNaN(val)) {
        val = 0;
        el.val(0);
      }
      if (max > 1) val = parseInt(String(val));
      if (max > 0 && val > max) {
        el.val(max);
        val = max;
      }
      if (val < 0) {
        el.val(0);
        val = 0;
      }
      const name = el.attr("name");
      const color2 = {};
      if (["r", "g", "b", "a"].indexOf(name) !== -1) {
        rgb[name] = val;
        hsv = TsUtils.rgb2hsv(rgb);
      } else if (["h", "s", "v"].indexOf(name) !== -1) {
        color2[name] = val;
      }
      setColor(color2, true);
    });
    query2(overlay.box).find(".color-original").off(".TsColor").on("click.TsColor", (event) => {
      const tmp = TsUtils.parseColor(query2(event.target).css("background-color"));
      if (tmp != null) {
        rgb = tmp;
        hsv = TsUtils.rgb2hsv(rgb);
        setColor(hsv, true);
      }
    });
    const mDown = `${!TsUtils.isMobile ? "mousedown" : "touchstart"}.TsColor`;
    const mUp = `${!TsUtils.isMobile ? "mouseup" : "touchend"}.TsColor`;
    const mMove = `${!TsUtils.isMobile ? "mousemove" : "touchmove"}.TsColor`;
    query2(overlay.box).find(".palette, .rainbow, .alpha").off(".TsColor").on(`${mDown}.TsColor`, mouseDown);
    this.setColor = setColor;
    return;
    function setColor(color2, fullUpdate, initial2) {
      if (color2.h != null) hsv.h = color2.h;
      if (color2.s != null) hsv.s = color2.s;
      if (color2.v != null) hsv.v = color2.v;
      if (color2.a != null) {
        rgb.a = color2.a;
        hsv.a = color2.a;
      }
      rgb = TsUtils.hsv2rgb(hsv);
      const rgba = "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + rgb.a + ")";
      const cl = [
        Number(rgb.r).toString(16).toUpperCase(),
        Number(rgb.g).toString(16).toUpperCase(),
        Number(rgb.b).toString(16).toUpperCase(),
        Math.round(Number(rgb.a) * 255).toString(16).toUpperCase()
      ];
      cl.forEach((item, ind) => {
        if (item.length === 1) cl[ind] = "0" + item;
      });
      let newColor = cl[0] + cl[1] + cl[2] + cl[3];
      if (rgb.a === 1) {
        newColor = cl[0] + cl[1] + cl[2];
      }
      query2(overlay.box).find(".color-preview").css("background-color", "#" + newColor);
      query2(overlay.box).find("input").each((el) => {
        if (el.name) {
          if (rgb[el.name] != null) el.value = String(rgb[el.name]);
          if (hsv[el.name] != null) el.value = String(hsv[el.name]);
          if (el.name === "a") el.value = String(rgb.a);
          if (el.name == "hex") el.value = newColor;
          if (el.name == "rgb") el.value = rgba;
        }
      });
      if (initial2 != null) {
        const color3 = overlay.tmp["initColor"] || newColor;
        query2(overlay.box).find(".color-original").css("background-color", "#" + color3);
        query2(overlay.box).find(".tsg-color.tsg-selected").removeClass("tsg-selected");
        query2(overlay.box).find(`.tsg-colors [name="${color3}"], .tsg-colors [name="${initial2}"]`).addClass("tsg-selected");
        if (newColor.length == 8) {
          self.tabClick(2, overlay.name);
        }
      } else {
        self.select(newColor, overlay.name);
      }
      if (fullUpdate) {
        updateSliders();
        refreshPalette();
      }
    }
    function updateSliders() {
      const el1 = query2(overlay.box).find(".palette .value1");
      const el2 = query2(overlay.box).find(".rainbow .value2");
      const el3 = query2(overlay.box).find(".alpha .value2");
      if (!el1[0] || !el2[0] || !el3[0]) return;
      const offset1 = el1[0].clientWidth / 2;
      const offset2 = el2[0].clientWidth / 2;
      el1.css({
        "left": hsv.s * 150 / 100 - offset1 + "px",
        "top": (100 - hsv.v) * 125 / 100 - offset1 + "px"
      });
      el2.css("left", hsv.h / (360 / 150) - offset2 + "px");
      el3.css("left", rgb.a * 150 - offset2 + "px");
    }
    function refreshPalette() {
      const cl = TsUtils.hsv2rgb(hsv.h, 100, 100);
      const rgb2 = `${cl.r},${cl.g},${cl.b}`;
      query2(overlay.box).find(".palette").css("background-image", `linear-gradient(90deg, rgba(${rgb2},0) 0%, rgba(${rgb2},1) 100%)`);
    }
    function mouseDown(event) {
      const el = query2(this).find(".value1, .value2");
      const offset = el.prop("clientWidth") / 2;
      if (el.hasClass("move-x")) el.css({ left: event.offsetX - offset + "px" });
      if (el.hasClass("move-y")) el.css({ top: event.offsetY - offset + "px" });
      initial = {
        el,
        x: event.pageX,
        y: event.pageY,
        width: el.prop("parentNode").clientWidth,
        height: el.prop("parentNode").clientHeight,
        left: parseInt(el.css("left")),
        top: parseInt(el.css("top"))
      };
      mouseMove(event);
      query2("html").off(".TsColor").on(mMove, mouseMove).on(mUp, mouseUp);
    }
    function mouseUp(_event) {
      query2("html").off(".TsColor");
    }
    function mouseMove(event) {
      const el = initial.el;
      const divX = event.pageX - initial.x;
      const divY = event.pageY - initial.y;
      let newX = initial.left + divX;
      let newY = initial.top + divY;
      const offset = el.prop("clientWidth") / 2;
      if (newX < -offset) newX = -offset;
      if (newY < -offset) newY = -offset;
      if (newX > initial.width - offset) newX = initial.width - offset;
      if (newY > initial.height - offset) newY = initial.height - offset;
      if (el.hasClass("move-x")) el.css({ left: newX + "px" });
      if (el.hasClass("move-y")) el.css({ top: newY + "px" });
      const name = query2(el.get(0).parentNode).attr("name");
      const x = parseInt(el.css("left")) + offset;
      const y = parseInt(el.css("top")) + offset;
      if (name === "palette") {
        setColor({
          s: Math.round(x / initial.width * 100),
          v: Math.round(100 - y / initial.height * 100)
        });
      }
      if (name === "rainbow") {
        const h = Math.round(360 / 150 * x);
        setColor({ h });
        refreshPalette();
      }
      if (name === "alpha") {
        setColor({ a: parseFloat(Number(x / 150).toFixed(2)) });
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addCustomColor(color, _name) {
    if (typeof color == "string" && color.substr(0, 1) == "#" && [7, 9].includes(color.length)) {
      color = color.substr(1).toUpperCase();
      const custom = _ColorTooltip.custom_colors;
      if (custom.includes(color)) {
        custom.splice(custom.indexOf(color), 1);
      }
      if (custom.length >= 5) {
        custom.pop();
      }
      custom.unshift(color);
    }
    return color;
  }
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async pickAndSelect(name, event) {
    const color = await this.pickColor();
    if (typeof color == "string" && color.substr(0, 1) == "#" && [7, 9].includes(color.length)) {
      this.addCustomColor(color, name);
      const cnt = query2(event.target).closest(".tsg-colors-custom");
      cnt.html(this.getCustomColorsHTML(name));
      TsUtils.bindEvents(cnt.find(".tsg-eaction"), this);
      this.select(color.substr(1), name);
    }
  }
  async pickAndUse(_name) {
    const color = await this.pickColor();
    if (typeof color == "string" && color.substr(0, 1) == "#" && [7, 9].includes(color.length)) {
      const hsv = TsUtils.rgb2hsv(TsUtils.parseColor(color));
      this.setColor(hsv, true);
    }
  }
  async pickColor() {
    const win = window;
    if (!win.EyeDropper) {
      console.error("EyeDropper API is not supported in this browser.");
      return;
    }
    const eyeDropper = new win.EyeDropper();
    try {
      const result = await eyeDropper.open();
      return result.sRGBHex;
    } catch (err) {
      console.error("Error picking color:", err);
    }
    return "";
  }
};
var MenuTooltip = class extends Tooltip {
  constructor() {
    super();
    this.defaults = TsUtils.extend({}, this.defaults, {
      type: "normal",
      // can be normal, radio, check
      items: [],
      selected: null,
      // current selected
      render: null,
      spinner: false,
      msgNoItems: TsUtils.lang("No items found"),
      topHTML: "",
      menuStyle: "",
      search: false,
      // search input inside tooltip
      filter: false,
      // will apply filter, if anchor is INPUT or TEXTAREA
      match: "contains",
      // is, begins, ends, contains, regexp
      markSearch: false,
      prefilter: false,
      altRows: false,
      arrowSize: 10,
      align: "left",
      position: "bottom|top",
      class: "tsg-white",
      anchorClass: "tsg-focus",
      autoShowOn: "focus",
      hideOn: ["doc-click", "focus-change", "select"],
      // also can 'item-remove'
      onSelect: null,
      onSubMenu: null,
      onRemove: null,
      onTooltip: null,
      onMouseEnter: null,
      onMouseLeave: null
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attach(anchor, text) {
    let options;
    if (arguments.length == 1 && anchor instanceof Object) {
      options = anchor;
      anchor = options.anchor;
    } else if (arguments.length === 2 && text != null && typeof text === "object") {
      options = text;
      options.anchor = anchor;
    }
    const prevHideOn = options.hideOn;
    options = TsUtils.extend({}, this.defaults, options || {});
    if (prevHideOn) {
      options.hideOn = prevHideOn;
    }
    options.style += "; padding: 0;";
    if (options.items == null) {
      options.items = [];
    }
    if (options.cacheMax <= 0) {
      console.log(`The option "cacheMax" is ${options.cacheMax} but should be more than 0`);
    }
    options.items = TsUtils.normMenu(options.items, options);
    options.html = this.getMenuHTML(options);
    const ret = super.attach(options);
    const overlay = ret.overlay;
    overlay.on("show:after.attach, update:after.attach", (_event) => {
      if (ret.overlay?.box) {
        let search = "";
        overlay.selected = overlay.options.selected;
        const index = overlay.anchor.dataset?.selectedIndex;
        if (overlay.options.selected !== false && overlay.options.selected !== -1 || index != null) {
          if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
            search = overlay.anchor.value;
            overlay.selected = null;
            if (index != null) {
              overlay.selected = index;
            }
          }
        }
        const actions = query2(ret.overlay.box).find(".tsg-eaction");
        if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
          overlay.tmp._new_search = false;
          query2(overlay.anchor).on("input.search-trigger", () => {
            overlay.tmp._new_search = true;
            query2(overlay.anchor).off("input.search-trigger");
          });
        }
        TsUtils.bindEvents(actions, this);
        this.applyFilter(overlay.name, null, search, void 0).then((data) => {
          if (!Tooltip.active[overlay.name]?.displayed) {
            return;
          }
          this.getActiveChain(overlay.name, options.items);
          overlay.tmp.searchCount = data.count;
          overlay.tmp.search = data.search;
          if (options.prefilter || search !== "") {
            if (data.count === 0 || !this.getActiveChain(overlay.name, options.items).includes(overlay.selected)) {
              overlay.selected = null;
            }
            this.refreshSearch(overlay.name);
          }
          this.initControls(ret.overlay);
          this.refreshIndex(overlay.name, true);
        });
      }
    });
    overlay.next = () => {
      const chain = this.getActiveChain(overlay.name);
      if (overlay.selected == null || String(overlay.selected).length == 0) {
        overlay.selected = chain[0];
      } else {
        const ind = chain.indexOf(String(overlay.selected));
        if (ind == -1) {
          overlay.selected = chain[0];
        }
        if (ind < chain.length - 1) {
          overlay.selected = chain[ind + 1];
        }
      }
      this.refreshIndex(overlay.name);
      this.showTooltip(overlay.name);
    };
    overlay.prev = () => {
      const chain = this.getActiveChain(overlay.name);
      if (overlay.selected == null || String(overlay.selected).length == 0) {
        overlay.selected = chain[chain.length - 1];
      } else {
        const ind = chain.indexOf(String(overlay.selected));
        if (ind == -1) {
          overlay.selected = chain[chain.length - 1];
        }
        if (ind > 0) {
          overlay.selected = chain[ind - 1];
        }
      }
      this.refreshIndex(overlay.name);
      this.showTooltip(overlay.name);
    };
    overlay.click = () => {
      query2(overlay.box).find(".tsg-selected").each((el) => {
        el.click();
      });
    };
    overlay.on("hide:after.attach", (_event) => {
      TsTooltip.hide(overlay.name + "-tooltip");
    });
    ret.select = (callback) => {
      overlay.on("select.attach", (event) => {
        callback(event);
      });
      return ret;
    };
    ret.remove = (callback) => {
      overlay.on("remove.attach", (event) => {
        callback(event);
      });
      return ret;
    };
    ret.subMenu = (callback) => {
      overlay.on("subMenu.attach", (event) => {
        callback(event);
      });
      return ret;
    };
    return ret;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update(name, items) {
    const overlay = Tooltip.active[name];
    if (overlay) {
      const options = overlay.options;
      if (options.items != items) {
        options.items = items;
      }
      const menuHTML = this.getMenuHTML(options);
      if (options.html != menuHTML) {
        options.html = menuHTML;
        overlay.needsUpdate = true;
        this.show(name);
      }
    } else {
      console.log(`Tooltip "${name}" is not displayed. Cannot update it.`);
    }
  }
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initControls(overlay) {
    let mdown = "mousedown";
    let mclick = "click";
    if (TsUtils.isMobile) {
      mdown = "touchstart";
      mclick = "touchend";
    }
    query2(overlay.box).find(".tsg-menu:not(.tsg-sub-menu)").off(".TsMenu").on("contextmenu.TsMenu", (event) => {
      event.preventDefault();
    }).on(`${mdown}.TsMenu`, { delegate: ".tsg-menu-item" }, (event) => {
      const dt = event.delegate.dataset;
      const parents = query2(event.delegate).closest(".tsg-menu").data("parents");
      this.menuDown(overlay, event, dt.index, parents);
      if (TsUtils.isMobile) {
        event.preventDefault();
      }
    }).on(`${mclick}.TsMenu`, { delegate: ".tsg-menu-item" }, (event) => {
      const dt = event.delegate.dataset;
      const parents = query2(event.delegate).closest(".tsg-menu").data("parents");
      this.menuClick(overlay, event, parseInt(dt["index"] ?? "0"), parents);
    }).find(".tsg-menu-item").off(".TsMenu").on("mouseEnter.TsMenu", (event) => {
      const dt = event.target.dataset;
      const item = overlay.options.items[dt["index"] ?? ""];
      const edata = this.trigger("mouseEnter", { overlay, item, originalEvent: event });
      if (edata.isCancelled) {
        return;
      }
      const tooltip = item?.tooltip;
      if (tooltip && dt["hassubmenu"] != "yes") {
        this.showTooltip(overlay.name, { tooltip, anchor: event.target });
      }
      const _menu = query2(event.target).closest(".tsg-menu").get(0);
      if (_menu._evt && _menu._evt.target != event.target) {
        this.closeSubMenu(_menu._evt);
      }
      if (dt["hassubmenu"] == "yes") {
        const _evt = {
          index: parseInt(dt["index"] ?? "0"),
          parents: _menu.dataset.parents !== "" ? _menu.dataset.parents.split("-").map((ind) => parseInt(ind)) : [],
          target: event.target,
          originalEvent: event,
          overlay
        };
        _menu._evt = _evt;
        this.openSubMenu(_evt);
      }
      edata.finish();
    }).on("mouseLeave.TsMenu", (event) => {
      const dt = event.target.dataset;
      const item = overlay.options.items[dt["index"] ?? ""];
      const edata = this.trigger("mouseLeave", { overlay, item, originalEvent: event });
      if (edata.isCancelled) {
        return;
      }
      TsTooltip.hide(overlay.name + "-tooltip");
      edata.finish();
    }).find(".menu-help").off(".TsMenu").on("mouseEnter.TsMenu", (event) => {
      const target = event.target;
      const dt = target.parentNode?.parentNode;
      const tooltip = overlay.options.items[dt.dataset?.index]?.help;
      if (tooltip) {
        TsTooltip.show({
          name: overlay.name + "-help-tp",
          anchor: event.target,
          html: tooltip,
          position: "right|left",
          hideOn: ["doc-click"]
        });
      }
    }).on("mouseLeave.TsMenu", (_event) => {
      TsTooltip.hide(overlay.name + "-help-tp");
    });
    if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
      query2(overlay.anchor).off(".TsMenu").on("input.TsMenu", (_event) => {
      }).on("keyup.TsMenu", (event) => {
        event._searchType = "filter";
        this.keyUp(overlay, event);
      });
    }
    if (overlay.options.search) {
      query2(overlay.box).find("#menu-search").off(".TsMenu").on("keyup.TsMenu", (event) => {
        event._searchType = "search";
        this.keyUp(overlay, event);
      });
    }
  }
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCurrent(name, id) {
    const overlay = Tooltip.active[name.replace(/[\s\.#]/g, "_")];
    const options = overlay.options;
    const selected = String(id ? id : overlay.selected || "").split("-");
    if (selected?.[0] === "") {
      selected.shift();
    }
    const last = selected.length - 1;
    let index = selected[last];
    const parents = selected.slice(0, selected.length - 1).join("-");
    index = TsUtils.isInt(index) ? parseInt(index) : 0;
    let items = options.items;
    selected.forEach((id2, ind) => {
      if (ind < selected.length - 1) {
        items = items[id2].items;
      }
    });
    return { last, index, items, item: items?.[index], parents };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMenuHTML(options) {
    if (options.spinner) {
      return `
            <div class="tsg-menu">
                <div class="tsg-no-items">
                    <div class="tsg-spinner"></div>
                    ${TsUtils.lang("Loading...")}
                </div>
            </div>`;
    }
    const parents = options.parents ?? [];
    let items = options.items;
    if (!Array.isArray(items)) items = [];
    let count = 0;
    let icon = null;
    let topHTML = "";
    if (options.search) {
      topHTML += `
                <div class="tsg-menu-search">
                    <span class="tsg-icon tsg-icon-search"></span>
                    <input id="menu-search" class="tsg-input" type="text"/>
                </div>`;
      items.forEach((item) => item.hidden = false);
    }
    if (options.topHTML) {
      topHTML += `<div class="tsg-menu-top">${options.topHTML}</div>`;
    }
    let menu_html = `
            ${topHTML}
            <div class="tsg-menu" style="${options.menuStyle}" data-parents="${parents.join("-")}">
        `;
    items.forEach((mitem, f) => {
      icon = mitem.icon;
      const index = (parents.length > 0 ? parents.join("-") + "-" : "") + f;
      if (icon == null) icon = null;
      if (["radio", "check"].includes(options.type) && !Array.isArray(mitem.items) && mitem.group !== false) {
        if (mitem.checked === true) icon = "tsg-icon-check";
        else icon = "tsg-icon-empty";
      }
      if (mitem.hidden !== true) {
        let txt = mitem.text;
        let icon_dsp = "";
        if (typeof options.render === "function") txt = options.render(mitem, options);
        if (typeof txt == "function") txt = txt(mitem, options);
        if (icon) {
          const first = String(icon).trim().slice(0, 1);
          if (first == "#") {
            icon = `<span class="tsg-icon tsg-icon-empty" style="background-color: ${icon}"></span>`;
          } else if (first !== "<") {
            icon = `<span class="tsg-icon ${icon}"></span>`;
          }
          icon_dsp = `<div class="menu-icon">${icon}</div>`;
        }
        if (mitem.removable == null && mitem.remove != null) {
          mitem.removable = mitem.remove;
        }
        if (mitem.type !== "break" && txt != null && txt !== "" && String(txt).substr(0, 2) != "--") {
          const classes = ["tsg-menu-item"];
          if (options.altRows == true) {
            classes.push(count % 2 === 0 ? "tsg-even" : "tsg-odd");
          }
          let colspan = 1;
          if (icon_dsp === "") colspan++;
          if (mitem.count == null && mitem.hotkey == null && mitem.removable !== true && mitem.items == null) colspan++;
          if (mitem.tooltip == null && mitem.hint != null) mitem.tooltip = mitem.hint;
          let count_dsp = "";
          if (mitem.removable === true) {
            count_dsp = '<span class="menu-remove">x</span>';
          } else if (mitem.items != null) {
            classes.push("has-sub-menu");
            count_dsp = '<span style="background-color: transparent; border: transparent; box-shadow: none;"></span>';
          } else {
            if (mitem.count != null) count_dsp += "<span>" + mitem.count + "</span>";
            if (mitem.hotkey != null) count_dsp += '<span class="menu-hotkey">' + mitem.hotkey + "</span>";
            if (mitem.help != null) count_dsp += '<span class="menu-help">?</span>';
          }
          if (mitem.disabled === true) classes.push("tsg-disabled");
          if (mitem._noSearchInside === true) classes.push("tsg-no-search-inside");
          menu_html += `
                        <div index="${index}" class="${classes.join(" ")}" style="${mitem.style ? mitem.style : ""}"
                            data-index="${f}" data-hasSubmenu="${mitem.items != null ? "yes" : ""}">
                                <div style="width: ${parseInt(mitem.indent ?? 0)}px"></div>
                                ${icon_dsp}
                                <div class="menu-text" colspan="${colspan}">${TsUtils.lang(txt)}</div>
                                <div class="menu-extra">${mitem.extra ?? ""}${count_dsp}</div>
                        </div>`;
          count++;
        } else {
          const divText = (txt ?? "").replace(/^-+/g, "");
          menu_html += `
                        <div index="${index}" class="tsg-menu-divider ${divText != "" ? "has-text" : ""}">
                            <div class="line"></div>
                            ${divText ? `<div class="text">${divText}</div>` : ""}
                        </div>`;
        }
      }
      items[f] = mitem;
    });
    if (count === 0 && options.msgNoItems) {
      const overlay = Tooltip.active[options.name.replace(/[\s\.#]/g, "_")];
      const remote = overlay?.tmp["remote"];
      let msg = options.msgNoItems;
      if (options.url) {
        if (count == 0 && remote?.hasMore === false) {
          msg = options.msgNoItems;
        } else {
          msg = options.msgSearch;
        }
      }
      menu_html += `
                <div class="tsg-no-items">
                    ${TsUtils.lang(msg)}
                </div>`;
    }
    menu_html += "</div>";
    return menu_html;
  }
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openSubMenu(event) {
    const anchor = query2(event.originalEvent.target).get(0);
    const { overlay } = event;
    const { items } = overlay.options;
    const mitem = items[event.index];
    let _items = [];
    if (typeof mitem.items == "function") {
      _items = mitem.items(mitem);
    } else if (Array.isArray(mitem.items)) {
      _items = mitem.items;
    }
    const prev = TsMenu.get(overlay.name + "-submenu");
    if (prev) {
      prev.hide();
    }
    query2(event.target).addClass("expanded");
    TsMenu.show({
      name: overlay.name + "-submenu",
      anchor,
      items: _items,
      class: overlay.options.class + " " + mitem.overlay?.class,
      offsetX: -7,
      arrowSize: 0,
      parentOverlay: overlay,
      parents: [...event.parents, event.index],
      position: "right|left",
      hideOn: ["doc-click", "select"]
      // any: cast-to-any for dynamic dispatch; TsTooltip overlay options merge from multiple user sources at runtime
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).hide((_evt) => {
      query2(event.target).removeClass("expanded");
    });
    setTimeout(() => {
      query2("#w2overlay-" + overlay.name + "-submenu").on("mouseenter", (event2) => {
        event2.target._keepSubOpen = true;
      }).on("mouseleave", (event2) => {
        event2.target._keepSubOpen = false;
      });
    }, 10);
  }
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  closeSubMenu(event) {
    const { overlay } = event;
    if (event.target._keepSubOpen !== true) {
      const prev = TsMenu.get(overlay.name + "-submenu");
      if (prev) {
        prev.hide();
      }
    }
  }
  // Refreshed only selected item highligh, used in keyboard navigation
  refreshIndex(name, instant) {
    const overlay = Tooltip.active[name.replace(/[\s\.#]/g, "_")];
    if (!overlay) return;
    if (!overlay.displayed) {
      this.show(overlay.name);
    }
    const view = query2(overlay.box).find(".tsg-overlay-body").get(0);
    const search = query2(overlay.box).find(".tsg-menu-search, .tsg-menu-top").get(0);
    query2(overlay.box).find(".tsg-menu-item.tsg-selected").removeClass("tsg-selected");
    const el = query2(overlay.box).find(`.tsg-menu-item[index="${overlay.selected}"]`).addClass("tsg-selected").get(0);
    if (el) {
      if (el.offsetTop + el.clientHeight > view.clientHeight + view.scrollTop) {
        el.scrollIntoView({
          behavior: instant ? "instant" : "smooth",
          block: instant ? "center" : "start",
          inline: instant ? "center" : "start"
        });
      }
      if (el.offsetTop < view.scrollTop + (search ? search.clientHeight : 0)) {
        el.scrollIntoView({
          behavior: instant ? "instant" : "smooth",
          block: instant ? "center" : "end",
          inline: instant ? "center" : "end"
        });
      }
    }
    TsTooltip.hide(overlay.name + "-tooltip");
  }
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showTooltip(name, options) {
    const overlay = Tooltip.active[name.replace(/[\s\.#]/g, "_")];
    if (!overlay || !overlay.displayed) return;
    const anchor = options?.anchor ?? query2(overlay.box).find(`.tsg-menu-item[index="${overlay.selected}"]`).get(0);
    const tooltip = options?.tooltip ?? (overlay.selected != null ? overlay.options.items?.[overlay.selected]?.tooltip : void 0);
    if (tooltip) {
      const html = tooltip.html ?? tooltip;
      TsTooltip.show(Object.assign({
        name: overlay.name + "-tooltip",
        anchor,
        html,
        position: "right|left",
        hideOn: ["doc-click"],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onShow(event) {
          overlay.self.trigger("tooltip", { overlay, action: "show", originalEvent: event });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onHide(event) {
          overlay.self.trigger("tooltip", { overlay, action: "hide", originalEvent: event });
        }
      }, typeof tooltip == "object" && tooltip != null ? tooltip : {}));
    }
  }
  // show/hide searched items
  refreshSearch(name) {
    const overlay = Tooltip.active[name.replace(/[\s\.#]/g, "_")];
    if (!overlay) return;
    if (!overlay.displayed) {
      this.show(overlay.name);
    }
    TsTooltip.hide(overlay.name + "-tooltip");
    query2(overlay.box).find(".tsg-no-items").hide();
    query2(overlay.box).find(".tsg-menu-item, .tsg-menu-divider").each((el) => {
      const cur = this.getCurrent(name, el.getAttribute("index"));
      if (cur.item?.hidden) {
        query2(el).hide();
      } else {
        const search = overlay.tmp?.["search"];
        if (overlay.options.markSearch) {
          TsUtils.marker(el, search, { onlyFirst: overlay.options.match == "begins" });
        }
        query2(el).show();
      }
    });
    query2(overlay.box).find(".tsg-sub-menu").each((sub) => {
      const hasItems = query2(sub).find(".tsg-menu-item").get().some((el) => {
        return el.style.display != "none" ? true : false;
      });
      const parent = this.getCurrent(name, sub.dataset?.parent);
      if (parent.item.expanded) {
        if (!hasItems) {
          query2(sub).parent().hide();
        } else {
          query2(sub).parent().show();
        }
      }
    });
    if (overlay.tmp["searchCount"] == 0 || (overlay.options?.items?.length ?? 0) == 0) {
      if (query2(overlay.box).find(".tsg-no-items").length == 0) {
        query2(overlay.box).find(".tsg-menu:not(.tsg-sub-menu)").append(`
                    <div class="tsg-no-items">
                        ${TsUtils.lang(overlay.options.msgNoItems)}
                    </div>`);
      }
      query2(overlay.box).find(".tsg-no-items").show();
    }
  }
  /**
   * Loops through the items and markes item.hidden = true for those that need to be hidden, and item.hidden = false
   * for those that are visible. Return a promise (since items can be on the server) with the number of visible items.
   */
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applyFilter(name, items, search, debounce) {
    let count = 0;
    const overlay = Tooltip.active[name.replace(/[\s\.#]/g, "_")];
    const options = overlay.options;
    let resolve, reject;
    const prom = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    if (overlay.tmp["_skip_filter"] === true) {
      return prom;
    }
    if (search == null) {
      if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
        search = overlay.anchor.value;
      } else {
        search = "";
      }
    }
    if (overlay.tmp["_new_search"] === false) {
      search = "";
    }
    let selectedIds = [];
    if (options.selected) {
      if (Array.isArray(options.selected)) {
        selectedIds = options.selected.map((item) => {
          return item?.id ?? item;
        });
      } else if (options.selected?.id) {
        selectedIds = [options.selected.id];
      }
    }
    overlay.tmp["activeChain"] = null;
    const remote = overlay.tmp["remote"] ?? { hasMore: true, emptySet: false, search: null, cached: -1 };
    if (remote.hasMore == false) {
      const len = remote.hasMore_search.length;
      if (search.substr(0, len) != remote.hasMore_search) {
        remote.hasMore = true;
      }
    }
    if (items == null && options.url && remote.hasMore && remote.search !== search) {
      let proceed = true;
      let msg = TsUtils.lang("Loading...");
      if (search.length < (options.minLength ?? 0) && remote.emptySet !== true) {
        msg = TsUtils.lang("${count} letters or more...", { count: String(options.minLength) });
        proceed = false;
        if (search === "") {
          msg = TsUtils.lang(options.msgSearch);
        }
        if ((options.items?.length ?? 0) > 0) {
          this.update(name, []);
          this.applyFilter(name, null, search);
        }
      }
      query2(overlay.box).find(".tsg-no-items").html(msg);
      remote.search = search;
      options.items = [];
      overlay.tmp["remote"] = remote;
      if (proceed) {
        this.request(overlay, search, debounce).then((remoteItems) => {
          overlay.tmp["_skip_filter"] = true;
          this.update(name, remoteItems);
          delete overlay.tmp["_skip_filter"];
          overlay.tmp["_new_search"] = true;
          this.applyFilter(name, remoteItems, search).then((data) => {
            this.getActiveChain(overlay.name, options.items);
            overlay.tmp["searchCount"] = data.count;
            overlay.tmp["search"] = data.search;
            if (options.prefilter || search !== "") {
              if (data.count === 0 || !this.getActiveChain(overlay.name, options.items).includes(overlay.selected)) {
                overlay.selected = null;
              }
              this.refreshSearch(overlay.name);
            }
            this.initControls(overlay);
            this.refreshIndex(overlay.name, true);
            resolve(data);
          });
        }).catch((error) => {
          console.log("Server Request error", error);
        });
      }
      return prom;
    }
    let edata;
    if (items == null) {
      edata = this.trigger("search", { search, overlay, prom, resolve, reject });
      if (edata.isCancelled === true) {
        return prom;
      }
    }
    if (items == null) {
      items = overlay.options.items;
    }
    if (options.filter === false) {
      resolve({ count: -1, search });
      return prom;
    }
    items.forEach((item) => {
      if (options.match == "regex") {
        try {
          const re = new RegExp(search, "i");
          if (re.test(item.text) || item.text === "...") {
            item.hidden = false;
          } else {
            item.hidden = true;
          }
        } catch (e) {
        }
      } else {
        let prefix = "";
        let suffix = "";
        if (["is", "begins", "begins with"].indexOf(options.match ?? "") !== -1) prefix = "^";
        if (["is", "ends", "ends with"].indexOf(options.match ?? "") !== -1) suffix = "$";
        try {
          const re = new RegExp(prefix + search + suffix, "i");
          if (re.test(item.text) || item.text === "...") {
            item.hidden = false;
          } else {
            item.hidden = true;
          }
        } catch (e) {
        }
      }
      if (options.hideSelected && selectedIds.includes(item.id)) {
        item.hidden = true;
      }
      if (Array.isArray(item.items) && item.items.length > 0) {
        delete item._noSearchInside;
        this.applyFilter(name, item.items, search).then((data) => {
          const subCount = data.count;
          if (subCount > 0) {
            count += subCount;
            if (item.hidden) item._noSearchInside = true;
            if (search) item.expanded = true;
            item.hidden = false;
          }
        });
      }
      if (item.hidden !== true) count++;
    });
    resolve({ count, search });
    edata?.finish();
    return prom;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request(overlay, search, debounce) {
    const options = overlay.options;
    const remote = overlay.tmp["remote"];
    let resolve, reject;
    if (options.items.length === 0 && remote.cached !== 0 || remote.cached == options.cacheMax && search.length > remote.search.length || search.length >= remote.search.length && search.substr(0, remote.search.length) !== remote.search || search.length < remote.search.length) {
      if (remote.controller) {
        remote.controller.abort();
      }
      remote.loading = true;
      clearTimeout(remote.timeout);
      remote.timeout = setTimeout(() => {
        let url = options.url;
        const postData = { search, max: options.cacheMax };
        Object.assign(postData, options.postData);
        const edata = this.trigger("request", {
          search,
          overlay,
          url,
          postData,
          httpMethod: options.method ?? "GET",
          httpHeaders: {}
        });
        if (edata.isCancelled === true) return;
        const detail = edata.detail;
        url = new URL(detail["url"], location.href);
        const fetchOptions = TsUtils.prepareParams(url, {
          method: detail["httpMethod"],
          headers: detail["httpHeaders"],
          body: detail["postData"]
        }, { caller: this, overlay, search });
        remote.controller = new AbortController();
        fetchOptions["signal"] = remote.controller.signal;
        fetch(url, fetchOptions).then((resp) => resp.json()).then((data) => {
          remote.controller = null;
          const edata2 = overlay.trigger("load", { search: postData.search, overlay, data });
          if (edata2.isCancelled === true) return;
          data = edata2.detail.data;
          if (typeof data === "string") data = JSON.parse(data);
          if (Array.isArray(data)) {
            data = { records: data };
          }
          if (data.records == null && data.items != null) {
            data.records = data.items;
            delete data.items;
          }
          if (!data.error && data.records == null) {
            data.records = [];
          }
          if (!Array.isArray(data.records)) {
            console.error(
              "ERROR: server did not return proper JSON data structure",
              "\n",
              " - it should return",
              { records: [{ id: 1, text: "item" }] },
              "\n",
              " - or just an array ",
              [{ id: 1, text: "item" }],
              "\n",
              " - or if errorr ",
              { error: true, message: "error message" }
            );
            return;
          }
          if (data.records.length >= options.cacheMax) {
            data.records.splice(options.cacheMax, data.records.length);
            remote.hasMore = true;
          } else {
            remote.hasMore = false;
            remote.hasMore_search = search;
          }
          if (options.recId == null && options.recid != null) options.recId = options.recid;
          if (options.recId || options.recText) {
            data.records.forEach((item) => {
              if (typeof options.recId === "string") item.id = item[options.recId];
              if (typeof options.recId === "function") item.id = options.recId(item);
              if (typeof options.recText === "string") item.text = item[options.recText];
              if (typeof options.recText === "function") item.text = options.recText(item);
            });
          }
          remote.loading = false;
          remote.search = search;
          remote.cached = data.records.length == 0 ? -1 : data.records.length;
          remote.lastError = "";
          remote.emptySet = search === "" && data.records.length === 0 ? true : false;
          edata2.finish();
          resolve(TsUtils.normMenu(data.records, data));
        }).catch((error) => {
          const edata2 = this.trigger("error", { overlay, search, error });
          if (edata2.isCancelled === true) return;
          if (error?.name !== "AbortError") {
            console.error(
              "ERROR: Server communication failed.",
              "\n",
              " - it should return",
              { records: [{ id: 1, text: "item" }] },
              "\n",
              " - or just an array ",
              [{ id: 1, text: "item" }],
              "\n",
              " - or if errorr ",
              { error: true, message: "error message" }
            );
          }
          remote.loading = false;
          remote.search = "";
          remote.cached = -1;
          remote.emptySet = true;
          remote.lastError = edata2.detail["error"] || "Server communication failed";
          options.items = [];
          edata2.finish();
          reject();
        });
        edata.finish();
      }, debounce ? options.debounce ?? 350 : 0);
    }
    return new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
  }
  /**
   * Builds an array of item ids that sequencial order for navigation with up/down keys. Skips hidden and disabled items
   * and goes into nested structures. It will remember last active chain in 'overlay.tmp.activeChain'
   */
  // any: parameter typed any — runtime dispatch by call site; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getActiveChain(name, items, parents = [], res = [], noSave) {
    const overlay = Tooltip.active[name.replace(/[\s\.#]/g, "_")];
    if (overlay.tmp["activeChain"] != null) {
      return overlay.tmp["activeChain"];
    }
    if (items == null) items = overlay.options.items;
    items.forEach((item, ind) => {
      if (!item.hidden && !item.disabled && !item?.text?.startsWith?.("--")) {
        res.push(parents.concat([ind]).join("-"));
        if (Array.isArray(item.items) && item.items.length > 0 && item.expanded) {
          parents.push(ind);
          this.getActiveChain(name, item.items, parents, res, true);
          parents.pop();
        }
      }
    });
    if (noSave == null) {
      overlay.tmp["activeChain"] = res;
    }
    return res;
  }
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuDown(overlay, event, index, parents) {
    const options = overlay.options;
    let items = options.items;
    const icon = query2(event.delegate).find(".tsg-icon");
    const menu = query2(event.target).closest(".tsg-menu:not(.tsg-sub-menu)");
    if (typeof items == "function") {
      items = items({ overlay, index, parents, event });
    }
    const item = items[index];
    if (item == null || item.disabled) {
      return;
    }
    const uncheck = (items2, parent) => {
      items2.forEach((other, ind) => {
        if (other.id == item.id) return;
        if (other.group === item.group && other.checked) {
          menu.find(`.tsg-menu-item[index="${(parent ? parent + "-" : "") + ind}"] .tsg-icon`).removeClass("tsg-icon-check").addClass("tsg-icon-empty");
          items2[ind].checked = false;
        }
        if (Array.isArray(other.items)) {
          uncheck(other.items, ind);
        }
      });
    };
    if ((options.type === "check" || options.type === "radio") && item.group !== false && !query2(event.target).hasClass("menu-remove") && !query2(event.target).hasClass("menu-help") && !query2(event.target).closest(".tsg-menu-item").hasClass("has-sub-menu")) {
      item.checked = options.type == "radio" ? true : !item.checked;
      if (item.checked) {
        if (options.type === "radio") {
          query2(event.target).closest(".tsg-menu").find(".tsg-icon").removeClass("tsg-icon-check").addClass("tsg-icon-empty");
        }
        if (options.type === "check" && item.group != null) {
          uncheck(options.items);
        }
        icon.removeClass("tsg-icon-empty").addClass("tsg-icon-check");
      } else if (options.type === "check") {
        icon.removeClass("tsg-icon-check").addClass("tsg-icon-empty");
      }
    }
    if (!query2(event.target).hasClass("menu-remove") && !query2(event.target).hasClass("menu-help")) {
      menu.find(".tsg-menu-item").removeClass("tsg-selected");
      if (!query2(event.delegate).hasClass("has-sub-menu")) {
        query2(event.delegate).addClass("tsg-selected");
      }
    }
  }
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuClick(overlay, event, index, parents) {
    const options = overlay.options;
    let items = options.items;
    const $item = query2(event.delegate).closest(".tsg-menu-item");
    let keepOpen = options.hideOn.includes("select") ? false : true;
    if (event.shiftKey || event.metaKey || event.ctrlKey) {
      keepOpen = true;
    }
    if (typeof items == "function") {
      items = items({ overlay, index, parents, event });
    }
    const item = items[index];
    if (!item || item.disabled && !query2(event.target).hasClass("menu-remove")) {
      return;
    }
    let edata;
    const overlays = [overlay];
    let topOverlay = overlay;
    let parentOverlay;
    while (topOverlay.options.parentOverlay) {
      topOverlay = topOverlay.options.parentOverlay;
      parentOverlay ??= topOverlay;
      overlays.push(topOverlay);
    }
    if (query2(event.target).hasClass("menu-remove")) {
      edata = topOverlay.trigger("remove", {
        originalEvent: event,
        target: overlay.name,
        overlay,
        topOverlay,
        parentOverlay,
        item,
        index,
        el: $item[0],
        parents
      });
      if (edata.isCancelled === true) {
        return;
      }
      const items2 = options.items;
      const ind = items2.findIndex((it) => it.id == item.id);
      if (ind != -1) {
        const tmp = items2.splice(ind, 1);
        if (overlay.options.parents) {
          const pind = overlay.options.parents[overlay.options.parents.length - 1];
          const pitems = parentOverlay.options.items[pind].items;
          if (pitems[ind].id == tmp[0].id) {
            pitems.splice(ind, 1);
          }
        }
      }
      keepOpen = !options.hideOn.includes("item-remove");
      const name = $item.closest(".tsg-overlay").attr("name");
      overlay.self.update(name, items2);
    } else if ($item.hasClass("has-sub-menu")) {
      edata = topOverlay.trigger("subMenu", {
        originalEvent: event,
        target: overlay.name,
        overlay,
        topOverlay,
        parentOverlay,
        item,
        index,
        el: $item[0],
        parents
      });
      if (edata.isCancelled === true) {
        return;
      }
      keepOpen = true;
    } else {
      const selected = this.findChecked(options.items);
      const a_index = $item.attr("index");
      overlay.selected = isNaN(Number(a_index)) ? a_index : parseInt(a_index);
      edata = topOverlay.trigger("select", {
        originalEvent: event,
        target: overlay.name,
        overlay,
        topOverlay,
        parentOverlay,
        item,
        index,
        selected,
        keepOpen,
        el: $item[0],
        parents
      });
      if (edata.isCancelled === true) {
        return;
      }
      if (item.keepOpen != null) {
        keepOpen = item.keepOpen;
      }
      if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
        overlay.anchor.dataset.selected = item.id;
        overlay.anchor.dataset.selectedIndex = overlay.selected;
      }
    }
    if (!keepOpen) {
      overlays.forEach((overlay2) => this.hide(overlay2.name));
    }
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findChecked(items) {
    let found = [];
    items.forEach((item) => {
      if (item.checked) found.push(item);
      if (Array.isArray(item.items)) {
        found = found.concat(this.findChecked(item.items));
      }
    });
    return found;
  }
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyUp(overlay, event) {
    const options = overlay.options;
    const search = event.target.value;
    let filter = true;
    let refreshIndex = false;
    switch (event.keyCode) {
      case 46:
      // delete
      case 8: {
        if (search === "" && !overlay.displayed) filter = false;
        break;
      }
      case 13: {
        if (!overlay.displayed || !overlay.selected) return;
        const { index, parents } = this.getCurrent(overlay.name);
        event.delegate = query2(overlay.box).find(".tsg-selected").get(0);
        this.menuClick(overlay, event, parseInt(String(index)), parents);
        filter = false;
        break;
      }
      case 27: {
        filter = false;
        if (overlay.displayed) {
          this.hide(overlay.name);
        } else {
          const el = overlay.anchor;
          if (["INPUT", "TEXTAREA"].includes(el.tagName)) {
            el.value = "";
            delete el.dataset.selected;
            delete el.dataset.selectedIndex;
          }
        }
        break;
      }
      case 37: {
        if (!overlay.displayed) return;
        let { item, index, parents } = this.getCurrent(overlay.name);
        if (parents) {
          item = options.items[parseInt(parents)];
          index = parseInt(parents);
          parents = "";
          refreshIndex = true;
        }
        if (Array.isArray(item?.items) && item.items.length > 0 && item.expanded) {
          event.delegate = query2(overlay.box).find(`.tsg-menu-item[index="${index}"]`).get(0);
          overlay.selected = index;
          this.menuClick(overlay, event, parseInt(String(index)), parents);
        }
        filter = false;
        break;
      }
      case 39: {
        if (!overlay.displayed) return;
        const { item, index, parents } = this.getCurrent(overlay.name);
        if (Array.isArray(item?.items) && item.items.length > 0 && !item.expanded) {
          event.delegate = query2(overlay.box).find(".tsg-selected").get(0);
          this.menuClick(overlay, event, parseInt(String(index)), parents);
        }
        filter = false;
        break;
      }
      case 38: {
        if (!overlay.displayed) {
          break;
        }
        overlay.prev();
        filter = false;
        event.preventDefault();
        break;
      }
      case 40: {
        if (!overlay.displayed) {
          break;
        }
        overlay.next();
        filter = false;
        event.preventDefault();
        break;
      }
    }
    if (filter && overlay.displayed && (options.filter && event._searchType == "filter" || options.search && event._searchType == "search")) {
      this.applyFilter(overlay.name, null, search, true).then((data) => {
        overlay.tmp.searchCount = data.count;
        overlay.tmp.search = data.search;
        if (data.count === 0 || !this.getActiveChain(overlay.name).includes(overlay.selected)) {
          overlay.selected = null;
        }
        this.refreshSearch(overlay.name);
      });
    }
    if (refreshIndex) {
      this.refreshIndex(overlay.name);
    }
  }
};
var DateTooltip = class extends Tooltip {
  daysCount;
  today;
  constructor() {
    super();
    const td = /* @__PURE__ */ new Date();
    this.daysCount = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.today = td.getFullYear() + "/" + (Number(td.getMonth()) + 1) + "/" + td.getDate();
    this.defaults = TsUtils.extend({}, this.defaults, {
      position: "top|bottom",
      class: "tsg-calendar",
      type: "date",
      // can be date/time/datetime
      value: "",
      // initial date (in TsUtils.settings format)
      format: "",
      start: null,
      end: null,
      btnNow: false,
      blockDates: [],
      // array of blocked dates
      blockWeekdays: [],
      // blocked weekdays 0 - sunday, 1 - monday, etc
      colored: {},
      // ex: { '3/13/2022': 'bg-color|text-color' }
      arrowSize: 12,
      autoResize: false,
      anchorClass: "tsg-focus",
      autoShowOn: "focus",
      hideOn: ["doc-click", "focus-change"],
      onSelect: null
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attach(anchor, text) {
    let options;
    if (arguments.length == 1 && anchor instanceof Object) {
      options = anchor;
      anchor = options.anchor;
    } else if (arguments.length === 2 && text != null && typeof text === "object") {
      options = text;
      options.anchor = anchor;
    }
    const prevHideOn = options.hideOn;
    options = TsUtils.extend({}, this.defaults, options || {});
    if (prevHideOn) {
      options.hideOn = prevHideOn;
    }
    if (!options.format) {
      const df = TsUtils.settings.dateFormat;
      const tf = TsUtils.settings.timeFormat;
      if (options.type == "date") {
        options.format = df;
      } else if (options.type == "time") {
        options.format = tf;
      } else {
        options.format = df + "|" + tf;
      }
    }
    const cal = options.type == "time" ? this.getHourHTML(options) : this.getMonthHTML(options, void 0, void 0);
    options.style += "; padding: 0;";
    options.html = cal.html;
    const ret = super.attach(options);
    const overlay = ret.overlay;
    Object.assign(overlay.tmp, cal);
    overlay.on("show.attach", (event) => {
      const overlay2 = event.detail.overlay;
      const anchor2 = overlay2.anchor;
      const options2 = overlay2.options;
      if (["INPUT", "TEXTAREA"].includes(anchor2.tagName) && !options2.value && anchor2.value) {
        overlay2.tmp.initValue = anchor2.value;
      }
      delete overlay2.newValue;
      delete overlay2.newDate;
    });
    overlay.on("show:after.attach", (_event) => {
      if (ret.overlay?.box) {
        this.initControls(ret.overlay);
      }
    });
    overlay.on("update:after.attach", (_event) => {
      if (ret.overlay?.box) {
        this.initControls(ret.overlay);
      }
    });
    overlay.on("hide.attach", (event) => {
      const overlay2 = event.detail.overlay;
      const anchor2 = overlay2.anchor;
      if (overlay2.newValue != null) {
        if (overlay2.newDate) {
          overlay2.newValue = overlay2.newDate + " " + overlay2.newValue;
        }
        if (["INPUT", "TEXTAREA"].includes(anchor2.tagName) && anchor2.value != overlay2.newValue) {
          anchor2.value = overlay2.newValue;
        }
        const edata = this.trigger("select", { date: overlay2.newValue, target: overlay2.name, overlay: overlay2 });
        if (edata.isCancelled === true) return;
        edata.finish();
      }
    });
    ret.select = (callback) => {
      overlay.on("select.attach", (event) => {
        callback(event);
      });
      return ret;
    };
    return ret;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initControls(overlay) {
    const options = overlay.options;
    const moveMonth = (inc) => {
      let { month, year } = overlay.tmp;
      month += inc;
      if (month > 12) {
        month = 1;
        year++;
      }
      if (month < 1) {
        month = 12;
        year--;
      }
      const cal = this.getMonthHTML(options, month, year);
      Object.assign(overlay.tmp, cal);
      query2(overlay.box).find(".tsg-overlay-body").html(cal.html);
      this.initControls(overlay);
    };
    const checkJump = (event, dblclick) => {
      query2(event.target).parent().find(".tsg-jump-month, .tsg-jump-year").removeClass("tsg-selected");
      query2(event.target).addClass("tsg-selected");
      const dt = /* @__PURE__ */ new Date();
      let { jumpMonth, jumpYear } = overlay.tmp;
      if (dblclick) {
        if (jumpYear == null) jumpYear = dt.getFullYear();
        if (jumpMonth == null) jumpMonth = dt.getMonth() + 1;
      }
      if (jumpMonth && jumpYear) {
        const cal = this.getMonthHTML(options, jumpMonth, jumpYear);
        Object.assign(overlay.tmp, cal);
        query2(overlay.box).find(".tsg-overlay-body").html(cal.html);
        overlay.tmp.jump = false;
        this.initControls(overlay);
      }
    };
    query2(overlay.box).find(".tsg-cal-title").off(".calendar").on("click.calendar", (event) => {
      if (options.draggable && overlay.tmp?.moved) {
        event.stopPropagation();
        return;
      }
      Object.assign(overlay.tmp, { jumpYear: null, jumpMonth: null });
      if (overlay.tmp.jump) {
        const { month, year } = overlay.tmp;
        const cal = this.getMonthHTML(options, month, year);
        query2(overlay.box).find(".tsg-overlay-body").html(cal.html);
        overlay.tmp.jump = false;
      } else {
        query2(overlay.box).find(".tsg-overlay-body .tsg-cal-days").replace(this.getYearHTML());
        const el = query2(overlay.box).find(`[name="${overlay.tmp.year}"]`).get(0);
        if (el) el.scrollIntoView(true);
        overlay.tmp.jump = true;
      }
      this.initControls(overlay);
      event.stopPropagation();
    }).find(".tsg-cal-previous").off(".calendar").on("click.calendar", (event) => {
      moveMonth(-1);
      event.stopPropagation();
    }).parent().find(".tsg-cal-next").off(".calendar").on("click.calendar", (event) => {
      moveMonth(1);
      event.stopPropagation();
    });
    query2(overlay.box).find(".tsg-cal-now").off(".calendar").on("click.calendar", (_event) => {
      if (options.type == "datetime") {
        if (overlay.newDate) {
          overlay.newValue = TsUtils.formatTime(/* @__PURE__ */ new Date(), options.format.split("|")[1]);
        } else {
          overlay.newValue = TsUtils.formatDateTime(/* @__PURE__ */ new Date(), options.format);
        }
      } else if (options.type == "date") {
        overlay.newValue = TsUtils.formatDate(/* @__PURE__ */ new Date(), options.format);
      } else if (options.type == "time") {
        overlay.newValue = TsUtils.formatTime(/* @__PURE__ */ new Date(), options.format);
      }
      this.hide(overlay.name);
    });
    query2(overlay.box).off(".calendar").on("contextmenu.calendar", (event) => {
      event.preventDefault();
    }).on("click.calendar", { delegate: ".tsg-day.tsg-date" }, (event) => {
      if (options.type == "datetime") {
        overlay.newDate = query2(event.target).attr("date");
        query2(overlay.box).find(".tsg-overlay-body").html(this.getHourHTML(overlay.options).html);
        this.initControls(overlay);
      } else {
        overlay.newValue = query2(event.target).attr("date");
        this.hide(overlay.name);
      }
    }).on("click.calendar", { delegate: ".tsg-jump-month" }, (event) => {
      overlay.tmp.jumpMonth = parseInt(query2(event.target).attr("name") ?? "0");
      checkJump(event);
    }).on("dblclick.calendar", { delegate: ".tsg-jump-month" }, (event) => {
      overlay.tmp.jumpMonth = parseInt(query2(event.target).attr("name") ?? "0");
      checkJump(event, true);
    }).on("click.calendar", { delegate: ".tsg-jump-year" }, (event) => {
      overlay.tmp.jumpYear = parseInt(query2(event.target).attr("name") ?? "0");
      checkJump(event);
    }).on("dblclick.calendar", { delegate: ".tsg-jump-year" }, (event) => {
      overlay.tmp.jumpYear = parseInt(query2(event.target).attr("name") ?? "0");
      checkJump(event, true);
    }).on("click.calendar", { delegate: ".tsg-time.hour" }, (event) => {
      const hour = Number(query2(event.target).attr("hour"));
      let min = (this.str2min(options.value) ?? 0) % 60;
      if (overlay.tmp.initValue && !options.value) {
        min = (this.str2min(overlay.tmp.initValue) ?? 0) % 60;
      }
      if (options.noMinutes) {
        overlay.newValue = this.min2str(hour * 60, options.format);
        this.hide(overlay.name);
      } else {
        overlay.newValue = hour + ":" + min;
        const html = this.getMinHTML(hour, options).html;
        query2(overlay.box).find(".tsg-overlay-body").html(html);
        this.initControls(overlay);
      }
    }).on("click.calendar", { delegate: ".tsg-time.min" }, (event) => {
      const hour = Math.floor((this.str2min(overlay.newValue) ?? 0) / 60);
      const time = hour * 60 + parseInt(query2(event.target).attr("min"));
      overlay.newValue = this.min2str(time, options.format);
      this.hide(overlay.name);
    });
    TsUtils.bindEvents(query2(overlay.box).find(".tsg-eaction"), this);
  }
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMonthHTML(options, month, year) {
    const days = TsUtils.settings.fulldays.slice();
    const sdays = TsUtils.settings.shortdays.slice();
    if (TsUtils.settings.weekStarts !== "M") {
      days.unshift(days.pop());
      sdays.unshift(sdays.pop());
    }
    let DT = /* @__PURE__ */ new Date();
    const dayLengthMil = 1e3 * 60 * 60 * 24;
    const selected = options.type === "datetime" ? TsUtils.isDateTime(options.value, options.format, true) : TsUtils.isDate(options.value, options.format, true);
    const selected_dsp = TsUtils.formatDate(selected);
    if (month == null || year == null) {
      const selDate = selected instanceof Date ? selected : DT;
      year = selDate.getFullYear();
      month = selDate.getMonth() + 1;
    }
    if (month > 12) {
      month -= 12;
      year++;
    }
    if (month < 1 || month === 0) {
      month += 12;
      year--;
    }
    if (year / 4 == Math.floor(year / 4)) {
      this.daysCount[1] = 29;
    } else {
      this.daysCount[1] = 28;
    }
    options.current = month + "/" + year;
    let weekDaysHeaderHTML = "";
    const st = TsUtils.settings.weekStarts;
    for (let i = 0; i < sdays.length; i++) {
      const isSat = st == "M" && i == 5 || st != "M" && i == 6 ? true : false;
      const isSun = st == "M" && i == 6 || st != "M" && i == 0 ? true : false;
      weekDaysHeaderHTML += `<div class="tsg-day tsg-weekday ${isSat ? "tsg-sunday" : ""} ${isSun ? "tsg-saturday" : ""}">${sdays[i]}</div>`;
    }
    const calTitleClass = "tsg-cal-title" + (options.draggable ? " tsg-eaction tsg-draggable" : "");
    const calTitleData = options.draggable ? ' data-mousedown="startDrag|event"' : "";
    let html = `
            <div class="${calTitleClass}"${calTitleData}>
                <div class="tsg-cal-previous tsg-eaction" data-mousedown="stop">
                    <div></div>
                </div>
                <div class="tsg-cal-next tsg-eaction" data-mousedown="stop">
                    <div></div>
                </div>
                ${TsUtils.settings.fullmonths[month - 1]}, ${year}
                <span class="arrow-down"></span>
            </div>
            <div class="tsg-cal-days">
                ${weekDaysHeaderHTML}
        `;
    DT = new Date(year, month - 1, 1);
    DT = new Date(DT.getTime() + dayLengthMil * 0.5);
    let weekDayOffset = DT.getDay();
    if (TsUtils.settings.weekStarts == "M") {
      weekDayOffset = weekDayOffset > 0 ? weekDayOffset - 1 : 6;
    }
    DT = new Date(DT.getTime() - weekDayOffset * dayLengthMil);
    const DaySat = 6, DaySun = 0;
    for (let ci = 0; ci < 42; ci++) {
      const className = [];
      const dt = `${DT.getFullYear()}/${DT.getMonth() + 1}/${DT.getDate()}`;
      if (DT.getDay() === DaySat) className.push("tsg-saturday");
      if (DT.getDay() === DaySun) className.push("tsg-sunday");
      if (DT.getMonth() + 1 !== month) className.push("outside");
      if (dt == this.today) className.push("tsg-today");
      const dspDay = DT.getDate();
      let col = "";
      let bgcol = "";
      let tmp_dt, tmp_dt_fmt;
      if (options.type === "datetime") {
        tmp_dt = TsUtils.formatDateTime(dt, options.format);
        tmp_dt_fmt = TsUtils.formatDate(dt, TsUtils.settings.dateFormat);
      } else {
        tmp_dt = TsUtils.formatDate(dt, options.format);
        tmp_dt_fmt = tmp_dt;
      }
      if (options.colored && options.colored[tmp_dt_fmt] !== void 0) {
        const tmp = options.colored[tmp_dt_fmt].split("|");
        bgcol = "background-color: " + tmp[0] + ";";
        col = "color: " + tmp[1] + ";";
      }
      html += `<div class="tsg-day ${this.inRange(tmp_dt, options, true) ? "tsg-date " + (tmp_dt_fmt == selected_dsp ? "tsg-selected" : "") : "tsg-blocked"} ${className.join(" ")}"
                       style="${col + bgcol}" date="${tmp_dt_fmt}" data-date="${DT.getTime()}">
                            ${dspDay}
                    </div>`;
      DT = new Date(DT.getTime() + dayLengthMil);
    }
    html += "</div>";
    if (options.btnNow) {
      const label = TsUtils.lang("Today" + (options.type == "datetime" ? " & Now" : ""));
      html += `<div class="tsg-cal-now">${label}</div>`;
    }
    return { html, month, year };
  }
  getYearHTML() {
    let mhtml = "";
    let yhtml = "";
    for (let m = 0; m < TsUtils.settings.fullmonths.length; m++) {
      mhtml += `<div class="tsg-jump-month" name="${m + 1}">${TsUtils.settings.shortmonths[m]}</div>`;
    }
    for (let y = TsUtils.settings.dateStartYear; y <= TsUtils.settings.dateEndYear; y++) {
      yhtml += `<div class="tsg-jump-year" name="${y}">${y}</div>`;
    }
    return `<div class="tsg-cal-jump">
            <div id="tsg-jump-month">${mhtml}</div>
            <div id="tsg-jump-year">${yhtml}</div>
        </div>`;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getHourHTML(options) {
    options = options ?? {};
    if (!options.format) options.format = TsUtils.settings.timeFormat;
    const h24 = options.format.indexOf("h24") > -1;
    const value = options.value ? options.value : options.anchor ? options.anchor.value : "";
    const tmp = [];
    for (let a = 0; a < 24; a++) {
      let time = (a >= 12 && !h24 ? a - 12 : a) + ":00" + (!h24 ? a < 12 ? " am" : " pm" : "");
      if (a == 12 && !h24) time = "12:00 pm";
      if (!tmp[Math.floor(a / 8)]) tmp[Math.floor(a / 8)] = "";
      let tm1 = this.min2str(this.str2min(time) ?? 0);
      let tm2 = this.min2str((this.str2min(time) ?? 0) + 59);
      if (options.type === "datetime") {
        const dt = TsUtils.isDateTime(value, options.format, true);
        const fm = options.format.split("|")[0].trim();
        tm1 = TsUtils.formatDate(dt, fm) + " " + tm1;
        tm2 = TsUtils.formatDate(dt, fm) + " " + tm2;
      }
      const valid = this.inRange(tm1, options) || this.inRange(tm2, options);
      tmp[Math.floor(a / 8)] += `<span hour="${a}"
                class="hour ${valid ? "tsg-time " : "tsg-blocked"}">${time}</span>`;
    }
    const timeTitleClass = "tsg-time-title" + (options.draggable ? " tsg-eaction tsg-draggable" : "");
    const timeTitleData = options.draggable ? ' data-mousedown="startDrag|event"' : "";
    const html = `<div class="tsg-calendar">
            <div class="${timeTitleClass}"${timeTitleData}>${TsUtils.lang("Select Hour")}</div>
            <div class="tsg-cal-time">
                <div class="tsg-cal-column">${tmp[0]}</div>
                <div class="tsg-cal-column">${tmp[1]}</div>
                <div class="tsg-cal-column">${tmp[2]}</div>
            </div>
            ${options.btnNow ? `<div class="tsg-cal-now">${TsUtils.lang("Now")}</div>` : ""}
        </div>`;
    return { html };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMinHTML(hour, options) {
    if (hour == null) hour = 0;
    options = options ?? {};
    if (!options.format) options.format = TsUtils.settings.timeFormat;
    const h24 = options.format.indexOf("h24") > -1;
    const value = options.value ? options.value : options.anchor ? options.anchor.value : "";
    const tmp = [];
    for (let a = 0; a < 60; a += 5) {
      const time = (hour > 12 && !h24 ? hour - 12 : hour) + ":" + (a < 10 ? 0 : "") + a + " " + (!h24 ? hour < 12 ? "am" : "pm" : "");
      let tm = time;
      const ind = a < 20 ? 0 : a < 40 ? 1 : 2;
      if (!tmp[ind]) tmp[ind] = "";
      if (options.type === "datetime") {
        const dt = TsUtils.isDateTime(value, options.format, true);
        const fm = options.format.split("|")[0].trim();
        tm = TsUtils.formatDate(dt, fm) + " " + tm;
      }
      tmp[ind] += `<span min="${a}" class="min ${this.inRange(tm, options) ? "tsg-time " : "tsg-blocked"}">${time}</span>`;
    }
    const timeTitleClass = "tsg-time-title" + (options.draggable ? " tsg-eaction tsg-draggable" : "");
    const timeTitleData = options.draggable ? ' data-mousedown="startDrag|event"' : "";
    const html = `<div class="tsg-calendar">
            <div class="${timeTitleClass}"${timeTitleData}>${TsUtils.lang("Select Minute")}</div>
            <div class="tsg-cal-time">
                <div class="tsg-cal-column">${tmp[0]}</div>
                <div class="tsg-cal-column">${tmp[1]}</div>
                <div class="tsg-cal-column">${tmp[2]}</div>
            </div>
            ${options.btnNow ? `<div class="tsg-cal-now">${TsUtils.lang("Now")}</div>` : ""}
        </div>`;
    return { html };
  }
  // checks if date is in range (loost at start, end, blockDates, blockWeekdays)
  // any: parameter typed any — runtime dispatch by call site; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inRange(str, options, dateOnly) {
    let inRange = false;
    if (options.type === "date") {
      const dt = TsUtils.isDate(str, options.format, true);
      if (dt) {
        if (options.start || options.end) {
          const st = typeof options.start === "string" ? options.start : query2(options.start).val();
          const en = typeof options.end === "string" ? options.end : query2(options.end).val();
          let start = TsUtils.isDate(st, options.format, true);
          let end = TsUtils.isDate(en, options.format, true);
          const dtDate = dt instanceof Date ? dt : /* @__PURE__ */ new Date();
          const current = new Date(dtDate);
          if (!start) start = current;
          if (!end) end = current;
          if (current >= start && current <= end) inRange = true;
        } else {
          inRange = true;
        }
        if (Array.isArray(options.blockDates) && options.blockDates.includes(str)) inRange = false;
        if (Array.isArray(options.blockWeekdays) && options.blockWeekdays.includes((dt instanceof Date ? dt : /* @__PURE__ */ new Date()).getDay())) inRange = false;
      }
    } else if (options.type === "time") {
      if (options.start || options.end) {
        const tm = this.str2min(str) ?? 0;
        let tm1 = this.str2min(options.start) ?? tm;
        let tm2 = this.str2min(options.end) ?? tm;
        if (!tm1) tm1 = tm;
        if (!tm2) tm2 = tm;
        if (tm >= tm1 && tm <= tm2) inRange = true;
      } else {
        inRange = true;
      }
    } else if (options.type === "datetime") {
      const dt = TsUtils.isDateTime(str, options.format, true);
      if (dt) {
        const format = options.format.split("|").map((format2) => format2.trim());
        if (dateOnly) {
          const date = TsUtils.formatDate(dt, format[0]);
          const opts = TsUtils.extend({}, options, { type: "date", format: format[0] });
          if (this.inRange(date, opts)) inRange = true;
        } else {
          const time = TsUtils.formatTime(dt, format[1]);
          const opts = { type: "time", format: format[1], start: options.startTime, end: options.endTime };
          if (this.inRange(time, opts)) inRange = true;
        }
      }
    }
    return inRange;
  }
  // converts time into number of minutes since midnight -- '11:50am' => 710
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  str2min(str) {
    if (typeof str !== "string") return null;
    const tmp = str.split(":");
    if (tmp.length === 2) {
      tmp[0] = parseInt(tmp[0]);
      tmp[1] = parseInt(tmp[1]);
      if (str.indexOf("pm") !== -1 && tmp[0] !== 12) tmp[0] += 12;
      if (str.includes("am") && tmp[0] == 12) tmp[0] = 0;
    } else {
      return null;
    }
    return tmp[0] * 60 + tmp[1];
  }
  // converts minutes since midnight into time str -- 710 => '11:50am'
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  min2str(time, format) {
    let ret = "";
    if (time >= 24 * 60) time = time % (24 * 60);
    if (time < 0) time = 24 * 60 + time;
    const hour = Math.floor(time / 60);
    const min = (time % 60 < 10 ? "0" : "") + time % 60;
    if (!format) {
      format = TsUtils.settings.timeFormat;
    }
    if (format.indexOf("h24") !== -1) {
      ret = hour + ":" + min;
    } else {
      ret = (hour <= 12 ? hour : hour - 12) + ":" + min + " " + (hour >= 12 ? "pm" : "am");
    }
    return ret;
  }
};
var _tooltipCtorCount = 0;
var _menuCtorCount = 0;
var _colorCtorCount = 0;
var _dateCtorCount = 0;
var TsTooltip = lazySingleton(() => {
  _tooltipCtorCount++;
  return new Tooltip();
}, Tooltip);
var TsMenu = lazySingleton(() => {
  _menuCtorCount++;
  return new MenuTooltip();
}, MenuTooltip);
var TsColor = lazySingleton(() => {
  _colorCtorCount++;
  return new ColorTooltip();
}, ColorTooltip);
var TsDate = lazySingleton(() => {
  _dateCtorCount++;
  return new DateTooltip();
}, DateTooltip);
var __test_internals = {
  get tooltipCtorCount() {
    return _tooltipCtorCount;
  },
  get menuCtorCount() {
    return _menuCtorCount;
  },
  get colorCtorCount() {
    return _colorCtorCount;
  },
  get dateCtorCount() {
    return _dateCtorCount;
  },
  reset() {
    _tooltipCtorCount = 0;
    _menuCtorCount = 0;
    _colorCtorCount = 0;
    _dateCtorCount = 0;
  }
};

export {
  Tooltip,
  TsTooltip,
  TsMenu,
  TsColor,
  TsDate,
  __test_internals
};
//# sourceMappingURL=chunk-FAIRNXQR.js.map