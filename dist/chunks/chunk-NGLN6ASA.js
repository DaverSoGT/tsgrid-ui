import {
  TsTooltip
} from "./chunk-CY5IZW4T.js";
import {
  TsUtils
} from "./chunk-P6ULV2YX.js";
import {
  TsBase,
  TsUi,
  query
} from "./chunk-DXZJHS4M.js";

// src/tstabs.ts
var query2 = query;
var TsTabs = class extends TsBase {
  // any: targeted-any per typing_policy; TsTabs tab item shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  active;
  reorder;
  flow;
  tooltip;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tabs;
  // any: tab objects have dynamic shape
  routeData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  last;
  // any: accumulates reordering state, observeResize, moving bag
  right;
  style;
  tab_template;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options) {
    super(options.name);
    this.box = null;
    this.name = "";
    this.active = null;
    this.reorder = false;
    this.flow = "down";
    this.tooltip = "top|left";
    this.tabs = [];
    this.routeData = {};
    this.last = {};
    this.right = "";
    this.style = "";
    this["onClick"] = null;
    this["onMouseEnter"] = null;
    this["onMouseLeave"] = null;
    this["onMouseDown"] = null;
    this["onMouseUp"] = null;
    this["onClose"] = null;
    this["onRender"] = null;
    this["onRefresh"] = null;
    this["onResize"] = null;
    this["onDestroy"] = null;
    this.tab_template = {
      id: null,
      text: null,
      icon: null,
      route: null,
      hidden: false,
      disabled: false,
      closable: false,
      tooltip: null,
      style: "",
      onClick: null,
      onRefresh: null,
      onClose: null
    };
    const tabs = options.tabs;
    delete options.tabs;
    Object.assign(this, options);
    if (Array.isArray(tabs)) this.add(tabs);
    options.tabs = tabs;
    if (typeof this.box == "string") this.box = query2(this.box).get(0);
    if (this.box) this.render(this.box);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  add(tab) {
    return this.insert(null, tab);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  insert(id, tabs) {
    if (!Array.isArray(tabs)) tabs = [tabs];
    const proms = [];
    tabs.forEach((tab) => {
      if (tab.id == null) {
        console.log(`ERROR: The parameter "id" is required but not supplied. (obj: ${this.name})`);
        return;
      }
      if (!TsUtils.checkUniqueId(tab.id, this.tabs, "tabs", this.name)) return;
      const it = Object.assign({}, this.tab_template, tab);
      if (id == null) {
        this.tabs.push(it);
        proms.push(this.animateInsert(null, it));
      } else {
        const middle = this.get(id, true);
        const before = this.tabs[middle].id;
        this.tabs.splice(middle, 0, it);
        proms.push(this.animateInsert(before, it));
      }
    });
    return Promise.all(proms);
  }
  // any: array of heterogeneous runtime values; TsTabs tab item shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remove(...ids) {
    let effected = 0;
    ids.forEach((it) => {
      const tab = this.get(it);
      if (!tab) return;
      effected++;
      this.tabs.splice(this.get(tab.id, true), 1);
      query2(this.box).find(`#tabs_${this.name}_tab_${TsUtils.escapeId(tab.id)}`).remove();
    });
    this.resize();
    return effected;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select(id) {
    if (this.active == id || this.get(id) == null) return false;
    this.active = id;
    this.refresh();
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(id, tab) {
    const index = this.get(id, true);
    if (index == null) return false;
    TsUtils.extend(this.tabs[index], tab);
    this.refresh(id);
    return true;
  }
  // any: parameter typed any — runtime dispatch by call site; TsTabs tab item shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(id, returnIndex) {
    if (arguments.length === 0) {
      const all = [];
      for (let i1 = 0; i1 < this.tabs.length; i1++) {
        if (this.tabs[i1].id != null) {
          all.push(this.tabs[i1].id);
        }
      }
      return all;
    } else {
      for (let i2 = 0; i2 < this.tabs.length; i2++) {
        if (this.tabs[i2].id == id) {
          return returnIndex === true ? i2 : this.tabs[i2];
        }
      }
    }
    return null;
  }
  // any: array of heterogeneous runtime values; TsTabs tab item shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  show(...ids) {
    const effected = [];
    ids.forEach((it) => {
      const tab = this.get(it);
      if (!tab || tab.hidden === false) return;
      tab.hidden = false;
      effected.push(tab.id);
    });
    setTimeout(() => {
      effected.forEach((it) => {
        this.refresh(it);
        this.resize();
      });
    }, 15);
    return effected;
  }
  // any: array of heterogeneous runtime values; TsTabs tab item shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hide(...ids) {
    const effected = [];
    ids.forEach((it) => {
      const tab = this.get(it);
      if (!tab || tab.hidden === true) return;
      tab.hidden = true;
      effected.push(tab.id);
    });
    setTimeout(() => {
      effected.forEach((it) => {
        this.refresh(it);
        this.resize();
      });
    }, 15);
    return effected;
  }
  // any: array of heterogeneous runtime values; TsTabs tab item shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enable(...ids) {
    const effected = [];
    ids.forEach((it) => {
      const tab = this.get(it);
      if (!tab || tab.disabled === false) return;
      tab.disabled = false;
      effected.push(tab.id);
    });
    setTimeout(() => {
      effected.forEach((it) => {
        this.refresh(it);
      });
    }, 15);
    return effected;
  }
  // any: array of heterogeneous runtime values; TsTabs tab item shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disable(...ids) {
    const effected = [];
    ids.forEach((it) => {
      const tab = this.get(it);
      if (!tab || tab.disabled === true) return;
      tab.disabled = true;
      effected.push(tab.id);
    });
    setTimeout(() => {
      effected.forEach((it) => {
        this.refresh(it);
      });
    }, 15);
    return effected;
  }
  dragMove(event) {
    if (!this.last.reordering) return;
    const self = this;
    const info = this.last.moving;
    const tab = this.tabs[info.index];
    const next = _find(info.index, 1);
    const prev = _find(info.index, -1);
    const $el = query2(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(tab.id));
    if (info.divX > 0 && next) {
      const $nextEl = query2(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(next.id));
      let width1 = $el.get(0).clientWidth;
      let width2 = $nextEl.get(0).clientWidth;
      if (width1 < width2) {
        width1 = Math.floor(width1 / 3);
        width2 = width2 - width1;
      } else {
        width1 = Math.floor(width2 / 3);
        width2 = width2 - width1;
      }
      if (info.divX > width2) {
        const index = this.tabs.indexOf(next);
        this.tabs.splice(info.index, 0, this.tabs.splice(index, 1)[0]);
        info.$tab.before($nextEl.get(0));
        info.$tab.css("opacity", 0);
        Object.assign(this.last.moving, {
          index,
          divX: -width1,
          x: event.pageX + width1,
          left: info.left + info.divX + width1
        });
        return;
      }
    }
    if (info.divX < 0 && prev) {
      const $prevEl = query2(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(prev.id));
      let width1 = $el.get(0).clientWidth;
      let width2 = $prevEl.get(0).clientWidth;
      if (width1 < width2) {
        width1 = Math.floor(width1 / 3);
        width2 = width2 - width1;
      } else {
        width1 = Math.floor(width2 / 3);
        width2 = width2 - width1;
      }
      if (Math.abs(info.divX) > width2) {
        const index = this.tabs.indexOf(prev);
        this.tabs.splice(info.index, 0, this.tabs.splice(index, 1)[0]);
        $prevEl.before(info.$tab);
        info.$tab.css("opacity", 0);
        Object.assign(info, {
          index,
          divX: width1,
          x: event.pageX - width1,
          left: info.left + info.divX - width1
        });
        return;
      }
    }
    function _find(ind, inc) {
      ind += inc;
      const tab2 = self.tabs[ind];
      if (tab2 && tab2.hidden) {
        return _find(ind, inc);
      }
      return tab2;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mouseAction(action, id, event) {
    const tab = this.get(id);
    const edata = this.trigger("mouse" + action, { target: id, tab, object: tab, originalEvent: event });
    if (edata.isCancelled === true || tab?.disabled || tab?.hidden) return;
    switch (action) {
      case "Enter":
        this.tooltipShow(id);
        break;
      case "Leave":
        this.tooltipHide(id);
        break;
      case "Down":
        this.initReorder(id, event);
        break;
      case "Up":
        break;
    }
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltipShow(id) {
    const tab = this.get(id);
    const el = query2(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(id)).get(0);
    if (this.tooltip == null || tab?.disabled || this.last.reordering) {
      return;
    }
    const pos = this.tooltip;
    let txt = tab?.tooltip;
    if (typeof txt == "function") txt = txt.call(this, tab);
    TsTooltip.show({
      anchor: el,
      name: this.name + "_tooltip",
      html: txt,
      position: pos
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltipHide(_id) {
    if (this.tooltip == null) return;
    TsTooltip.hide(this.name + "_tooltip");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getTabHTML(id) {
    const index = this.get(id, true);
    const tab = this.tabs[index];
    if (tab == null) return false;
    if (tab.text == null && tab.caption != null) tab.text = tab.caption;
    if (tab.tooltip == null && tab.hint != null) tab.tooltip = tab.hint;
    if (tab.caption != null) {
      console.log("NOTICE: tabs tab.caption property is deprecated, please use tab.text. Tab -> ", tab);
    }
    if (tab.hint != null) {
      console.log("NOTICE: tabs tab.hint property is deprecated, please use tab.tooltip. Tab -> ", tab);
    }
    let text = tab.text;
    if (typeof text == "function") text = text.call(this, tab);
    if (text == null) text = "";
    let closable = "";
    let addStyle = "";
    if (tab.hidden) {
      addStyle += "display: none;";
    }
    if (tab.disabled) {
      addStyle += "opacity: 0.2;";
    }
    if (tab.closable && !tab.disabled) {
      closable = `<div class="tsg-tab-close tsg-eaction ${this.active === tab.id ? "active" : ""}"
                data-mousedown="stop" data-mouseup="clickClose|${tab.id}|event">
            </div>`;
    }
    let icon = "";
    if (tab.icon) {
      icon = `<span class="tsg-tab-icon ${tab.icon}"></span>`;
    }
    return `
            <div id="tabs_${this.name}_tab_${tab.id}" style="${addStyle} ${tab.style}"
                class="tsg-tab tsg-eaction ${this.active === tab.id ? "active" : ""} ${tab.closable ? "closable" : ""} ${tab.class ? tab.class : ""}"
                data-mouseenter="mouseAction|Enter|${tab.id}|event]"
                data-mouseleave="mouseAction|Leave|${tab.id}|event]"
                data-mousedown="mouseAction|Down|${tab.id}|event"
                data-mouseup="mouseAction|Up|${tab.id}|event"
                data-click="click|${tab.id}|event">
                    ${icon + TsUtils.lang(text) + closable}
            </div>`;
  }
  // any: callback parameter — caller signature varies; TsTabs tab item shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refresh(id) {
    const time = Date.now();
    if (this.flow == "up") {
      query2(this.box).addClass("tsg-tabs-up");
    } else {
      query2(this.box).removeClass("tsg-tabs-up");
    }
    const edata = this.trigger("refresh", { target: id != null ? id : this.name, object: this.get(id) });
    if (edata.isCancelled === true) return;
    if (id == null) {
      for (let i = 0; i < this.tabs.length; i++) {
        this.refresh(this.tabs[i].id);
      }
    } else {
      const selector = "#tabs_" + this.name + "_tab_" + TsUtils.escapeId(id);
      const $tab = query2(this.box).find(selector);
      const tabHTML = this.getTabHTML(id);
      if ($tab.length === 0) {
        if (tabHTML) query2(this.box).find("#tabs_" + this.name + "_right").before(tabHTML);
      } else {
        if (query2(this.box).find(".tab-animate-insert").length == 0) {
          if (tabHTML) $tab.replace(tabHTML);
        }
      }
      TsUtils.bindEvents(query2(this.box).find(`${selector}, ${selector} .tsg-eaction`), this);
    }
    query2(this.box).find("#tabs_" + this.name + "_right").html(this.right);
    edata.finish();
    return Date.now() - time;
  }
  // any: callback parameter — caller signature varies; TsTabs tab item shape is user-defined at runtime
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
    if (!this.box) return false;
    const html = `
            <div class="tsg-tabs-line"></div>
            <div class="tsg-scroll-wrapper tsg-eaction" data-mousedown="resize">
                <div id="tabs_${this.name}_right" class="tsg-tabs-right">${this.right}</div>
            </div>
            <div class="tsg-scroll-left tsg-eaction" data-click='["scroll","left"]'></div>
            <div class="tsg-scroll-right tsg-eaction" data-click='["scroll","right"]'></div>`;
    query2(this.box).attr("name", this.name).addClass("tsg-reset tsg-tabs").html(html);
    if (query2(this.box).length > 0) {
      query2(this.box)[0].style.cssText += this.style;
    }
    TsUtils.bindEvents(query2(this.box).find(".tsg-eaction"), this);
    this.last.observeResize = new ResizeObserver(() => {
      this.resize();
    });
    this.last.observeResize.observe(this.box);
    edata.finish();
    this.refresh();
    this.resize();
    return Date.now() - time;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initReorder(id, event) {
    if (!this.reorder) return;
    const self = this;
    const $tab = query2(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(id));
    const tabIndex = this.get(id, true);
    const $ghost = query2($tab.get(0).cloneNode(true));
    let edata;
    $ghost.attr("id", "#tabs_" + this.name + "_tab_ghost");
    this.last.moving = {
      index: tabIndex,
      indexFrom: tabIndex,
      $tab,
      $ghost,
      divX: 0,
      left: $tab.get(0).getBoundingClientRect().left,
      parentX: query2(this.box).get(0).getBoundingClientRect().left,
      x: event.pageX,
      opacity: $tab.css("opacity")
    };
    query2(document).off(".w2uiTabReorder").on("mousemove.w2uiTabReorder", function(event2) {
      const mouseEvent = event2;
      if (!self.last.reordering) {
        edata = self.trigger("reorder", { target: self.tabs[tabIndex].id, indexFrom: tabIndex, tab: self.tabs[tabIndex] });
        if (edata.isCancelled === true) return;
        TsTooltip.hide(self.name + "_tooltip");
        self.last.reordering = true;
        $ghost.addClass("moving");
        $ghost.css({
          "pointer-events": "none",
          "position": "absolute",
          "left": $tab.get(0).getBoundingClientRect().left
        });
        $tab.css("opacity", 0);
        query2(self.box).find(".tsg-scroll-wrapper").append($ghost.get(0));
        query2(self.box).find(".tsg-tab-close").hide();
      }
      self.last.moving.divX = mouseEvent.pageX - self.last.moving.x;
      $ghost.css("left", self.last.moving.left - self.last.moving.parentX + self.last.moving.divX + "px");
      self.dragMove(mouseEvent);
    }).on("mouseup.w2uiTabReorder", function() {
      query2(document).off(".w2uiTabReorder");
      $ghost.css({
        "transition": "0.1s",
        "left": self.last.moving.$tab.get(0).getBoundingClientRect().left - self.last.moving.parentX
      });
      query2(self.box).find(".tsg-tab-close").show();
      $ghost.remove();
      $tab.css({ opacity: self.last.moving.opacity });
      if (self.last.reordering) {
        edata.finish({ indexTo: self.last.moving.index });
      }
      self.last.reordering = false;
    });
  }
  // any: callback parameter — caller signature varies; TsTabs tab item shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scroll(direction, instant) {
    return new Promise((resolve, _reject) => {
      const scrollBox = query2(this.box).find(".tsg-scroll-wrapper");
      const scrollBoxEl = scrollBox.get(0);
      const scrollLeft = scrollBoxEl.scrollLeft;
      const right = scrollBox.find(".tsg-tabs-right").get(0);
      const width1 = scrollBox.parent().get(0).getBoundingClientRect().width;
      const width2 = scrollLeft + right.offsetLeft + right.clientWidth;
      switch (direction) {
        case "left": {
          let scroll = scrollLeft - width1 + 50;
          if (scroll <= 0) scroll = 0;
          scrollBoxEl.scrollTo({ top: 0, left: scroll, behavior: instant ? "auto" : "smooth" });
          break;
        }
        case "right": {
          let scroll = scrollLeft + width1 - 50;
          if (scroll >= width2 - width1) scroll = width2 - width1;
          scrollBoxEl.scrollTo({ top: 0, left: scroll, behavior: instant ? "auto" : "smooth" });
          break;
        }
      }
      setTimeout(() => {
        this.resize();
        resolve();
      }, instant ? 0 : 350);
    });
  }
  // any: callback parameter — caller signature varies; TsTabs tab item shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollIntoView(id, instant) {
    return new Promise((resolve, _reject) => {
      if (id == null) id = this.active;
      const tab = this.get(id);
      if (tab == null) return;
      const tabEl = query2(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(id)).get(0);
      tabEl.scrollIntoView({ block: "start", inline: "center", behavior: instant ? "auto" : "smooth" });
      setTimeout(() => {
        this.resize();
        resolve();
      }, instant ? 0 : 500);
    });
  }
  resize() {
    const time = Date.now();
    if (this.box == null) return;
    const edata = this.trigger("resize", { target: this.name });
    if (edata.isCancelled === true) return;
    if (this.box != null) {
      const box = query2(this.box);
      box.find(".tsg-scroll-left, .tsg-scroll-right").hide();
      const scrollBox = box.find(".tsg-scroll-wrapper").get(0);
      const $right = box.find(".tsg-tabs-right");
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
    }
    edata.finish();
    return Date.now() - time;
  }
  destroy() {
    const edata = this.trigger("destroy", { target: this.name });
    if (edata.isCancelled === true) return;
    if (query2(this.box).find("#tabs_" + this.name + "_right").length > 0) {
      this.unmount();
    }
    delete TsUi[this.name];
    edata.finish();
  }
  unmount() {
    super.unmount();
    this.last.observeResize?.disconnect();
  }
  // ===================================================
  // -- Internal Event Handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  click(id, event) {
    if (event && query2(event.target).hasClass("tsg-tab-close")) {
      return;
    }
    const tab = this.get(id);
    if (tab == null || tab.disabled || this.last.reordering) return false;
    const edata = this.trigger("click", { target: id, tab, object: tab, originalEvent: event });
    if (edata.isCancelled === true) return;
    query2(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(this.active)).removeClass("active");
    this.active = tab.id;
    query2(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(this.active)).addClass("active");
    if (typeof tab.route == "string") {
      let route = tab.route !== "" ? String("/" + tab.route).replace(/\/{2,}/g, "/") : "";
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
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clickClose(id, event) {
    const tab = this.get(id);
    if (tab == null || tab.disabled) return false;
    const edata = this.trigger("close", { target: id, object: tab, tab, originalEvent: event });
    if (edata.isCancelled === true) return;
    this.animateClose(id).then(() => {
      this.remove(id);
      edata.finish();
      this.refresh();
    });
    event?.stopPropagation();
  }
  // any: callback parameter — caller signature varies; TsTabs tab item shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animateClose(id) {
    return new Promise((resolve, _reject) => {
      const $tab = query2(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(id));
      const width = $tab.get(0).clientWidth || 0;
      const anim = `<div class="tab-animate-close" style="display: inline-block; flex-shrink: 0; width: ${width}px; transition: width 0.25s"></div>`;
      const $anim = $tab.replace(anim);
      setTimeout(() => {
        $anim.css({ width: "0px" });
      }, 1);
      setTimeout(() => {
        $anim.remove();
        this.resize();
        resolve();
      }, 500);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animateInsert(id, tab) {
    return new Promise((resolve, _reject) => {
      let $before = query2(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(id));
      const tabHTML = this.getTabHTML(tab.id);
      const $tab = query.html(tabHTML);
      if ($before.length == 0) {
        $before = query2(this.box).find("#tabs_tabs_right");
        $before.before($tab);
        this.resize();
      } else {
        $tab.css({ opacity: 0 });
        query2(this.box).find("#tabs_tabs_right").before($tab.get(0));
        const $tmp = query2(this.box).find("#" + $tab.attr("id"));
        const width = $tmp.get(0)?.clientWidth ?? 0;
        const $anim = query.html('<div class="tab-animate-insert" style="flex-shrink: 0; width: 0; transition: width 0.25s"></div>');
        $before.before($anim);
        $tab.hide();
        $anim.before($tab[0]);
        setTimeout(() => {
          $anim.css({ width: width + "px" });
        }, 1);
        setTimeout(() => {
          $anim.remove();
          $tab.css({ opacity: 1 }).show();
          this.refresh(tab.id);
          this.resize();
          resolve();
        }, 500);
      }
    });
  }
};

export {
  TsTabs
};
//# sourceMappingURL=chunk-NGLN6ASA.js.map