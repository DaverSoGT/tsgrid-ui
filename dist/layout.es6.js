import {
  TsTabs
} from "./chunks/chunk-CTTY5Y5D.js";
import {
  TsToolbar
} from "./chunks/chunk-4ZUXM5YY.js";
import "./chunks/chunk-G5ZE37KO.js";
import "./chunks/chunk-EQK6JAHT.js";
import {
  TsUtils
} from "./chunks/chunk-UDGOHP3E.js";
import "./chunks/chunk-OITJCF5M.js";
import "./chunks/chunk-IYF3Q7GX.js";
import {
  TsBase,
  TsUi,
  query
} from "./chunks/chunk-W7JZO7EX.js";

// src/tslayout.ts
var query2 = query;
var _TsUiRegistry = () => TsUi;
var w2panels = ["top", "left", "main", "preview", "right", "bottom"];
var TsLayout = class extends TsBase {
  panels;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  last;
  // any: accumulates resize state, observeResize, events dict
  padding;
  resizer;
  style;
  onShow;
  onHide;
  onResizing;
  onResizerClick;
  onRender;
  onRefresh;
  onChange;
  onResize;
  onDestroy;
  panel_template;
  // any: TsBase dynamic event handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options) {
    super(options.name);
    this.box = null;
    this.name = "";
    this.panels = [];
    this.last = {};
    this.padding = 1;
    this.resizer = 4;
    this.style = "";
    this.onShow = null;
    this.onHide = null;
    this.onResizing = null;
    this.onResizerClick = null;
    this.onRender = null;
    this.onRefresh = null;
    this.onChange = null;
    this.onResize = null;
    this.onDestroy = null;
    this.panel_template = {
      type: null,
      // left, right, top, bottom
      title: "",
      size: 100,
      // width or height depending on panel name
      minSize: 20,
      maxSize: false,
      hidden: false,
      resizable: false,
      overflow: "auto",
      style: "",
      html: "",
      // can be String or Object with .render(box) method
      tabs: null,
      toolbar: null,
      width: null,
      // read only
      height: null,
      // read only
      show: {
        toolbar: false,
        tabs: false
      },
      removed: null,
      // function to call when content is overwritten
      onRefresh: null,
      onShow: null,
      onHide: null
    };
    Object.assign(this, options);
    if (!Array.isArray(this.panels)) this.panels = [];
    this.panels.forEach((panel, ind) => {
      this.panels[ind] = TsUtils.extend({}, this.panel_template, panel);
      if (TsUtils.isPlainObject(panel.tabs) || Array.isArray(panel.tabs)) initTabs(this, panel.type);
      if (TsUtils.isPlainObject(panel.toolbar) || Array.isArray(panel.toolbar)) initToolbar(this, panel.type);
    });
    w2panels.forEach((tab) => {
      if (this.get(tab) != null) return;
      this.panels.push(TsUtils.extend({}, this.panel_template, { type: tab, hidden: tab !== "main", size: 50 }));
    });
    if (typeof this.box == "string") this.box = query2(this.box).get(0);
    if (this.box) this.render(this.box);
    function initTabs(object, panel, tabs) {
      const pan = panel != null ? object.get(panel) : null;
      if (pan != null && tabs == null) tabs = pan.tabs;
      if (pan == null || tabs == null) return false;
      if (Array.isArray(tabs)) tabs = { tabs };
      const name = object.name + "_" + (panel ?? "") + "_tabs";
      if (_TsUiRegistry()[name]) _TsUiRegistry()[name].destroy();
      pan.tabs = new TsTabs(TsUtils.extend({}, tabs, { owner: object, name: object.name + "_" + (panel ?? "") + "_tabs" }));
      pan.show.tabs = true;
      return true;
    }
    function initToolbar(object, panel, toolbar) {
      const pan = panel != null ? object.get(panel) : null;
      if (pan != null && toolbar == null) toolbar = pan.toolbar;
      if (pan == null || toolbar == null) return false;
      if (Array.isArray(toolbar)) toolbar = { items: toolbar };
      const name = object.name + "_" + (panel ?? "") + "_toolbar";
      if (_TsUiRegistry()[name]) _TsUiRegistry()[name].destroy();
      pan.toolbar = new TsToolbar(TsUtils.extend({}, toolbar, { owner: object, name: object.name + "_" + (panel ?? "") + "_toolbar" }));
      pan.show.toolbar = true;
      return true;
    }
  }
  html(panel, data, transition) {
    const p = this.get(panel);
    const promise = {
      panel,
      html: p.html,
      error: false,
      cancelled: false,
      removed(cb) {
        if (typeof cb == "function") {
          p.removed = cb;
        }
      }
    };
    if (typeof p.removed == "function") {
      p.removed({ panel, html: p.html, html_new: data, transition: transition || "none" });
      p.removed = null;
    }
    if (panel == "css") {
      query2(this.box).find("#layout_" + this.name + "_panel_css").html("<style>" + data + "</style>");
      promise.status = true;
      return promise;
    }
    if (p == null) {
      console.log("ERROR: incorrect panel name. Panel name can be main, left, right, top, bottom, preview or css");
      promise.error = true;
      return promise;
    }
    if (data == null) {
      return promise;
    }
    const edata = this.trigger("change", { target: panel, panel: p, html_new: data, transition });
    if (edata.isCancelled === true) {
      promise.cancelled = true;
      return promise;
    }
    const pname = "#layout_" + this.name + "_panel_" + p.type;
    const current = query2(this.box).find(pname + '> [data-role="panel-content"]');
    let panelTop = 0;
    if (current.length > 0) {
      ;
      query2(this.box).find(pname).get(0).scrollTop = 0;
      panelTop = query2(current).css("top");
    }
    if (typeof p.html.unmount == "function") p.html.unmount();
    current.addClass("tsg-panel-content");
    current.removeAttr("style");
    this.resizeBoxes(panel);
    if (p.html === "") {
      p.html = data;
      this.refresh(panel);
    } else {
      p.html = data;
      if (!p.hidden) {
        if (transition != null && transition !== "") {
          query2(this.box).addClass("animating");
          const div1 = query2(this.box).find(pname + '> [data-role="panel-content"]');
          div1.after('<div class="tsg-panel-content new-panel" data-role="panel-content" style="' + div1[0].style.cssText + '"></div>');
          const div2 = query2(this.box).find(pname + '> [data-role="panel-content"].new-panel');
          div1.css("top", panelTop);
          div2.css("top", panelTop);
          if (typeof data == "object") {
            data.box = div2[0];
            data.render();
          } else {
            div2.hide().html(data);
          }
          let style1, style2;
          switch (transition) {
            case "slide-left":
              style1 = "left: -" + TsUtils.getSize(query2(this.box), "width") + "px";
              style2 = "left: 0px";
              break;
            case "slide-right":
              style1 = "left: " + TsUtils.getSize(query2(this.box), "width") + "px";
              style2 = "left: 0px";
              break;
            case "slide-down":
              style1 = "top: -" + TsUtils.getSize(query2(this.box), "height") + "px";
              style2 = "top: " + panelTop + "px";
              break;
            case "slide-up":
              style1 = "top: " + TsUtils.getSize(query2(this.box), "height") + "px";
              style2 = "top: " + panelTop + "px";
              break;
            case "flip-left":
              style1 = "transform: rotate(90deg)";
              style2 = "transform: rotate(0deg)";
              break;
            case "flip-right":
              style1 = "transform: rotate(-90deg)";
              style2 = "transform: rotate(0deg)";
              break;
            case "flip-down":
              style1 = "transform: rotate(-180deg)";
              style2 = "transform: rotate(0deg)";
              break;
            case "flip-up":
              style1 = "transform: rotate(180deg)";
              style2 = "transform: rotate(0deg)";
              break;
            case "pop-in":
              style1 = "transform: scale(.5); opacity: 0;";
              style2 = "transform: scale(1); opacity: 1;";
              break;
            case "pop-out":
              style1 = "transform: scale(1); opacity: 1;";
              style2 = "transform: scale(.5); opacity: 0;";
              break;
            default:
              style1 = "";
              style2 = "";
          }
          div1.addClass("previous").css({ "cssText": "transition: .5s; " + style1 });
          div2.addClass("current").css({ "cssText": "transition: .5s; " + style2 });
          setTimeout(() => {
            query2(this.box).removeClass("animating");
            div1.remove();
            div2.removeClass("new-panel current");
            query2(this.box).find(pname + '> [data-role="panel-content"]').css({ "cssText": "" });
            edata.finish();
          }, 500);
        } else {
          this.refresh(panel);
          edata.finish();
        }
      } else {
        edata.finish();
      }
    }
    return promise;
  }
  message(panel, options) {
    const p = this.get(panel);
    const box = query2(this.box).find("#layout_" + this.name + "_panel_" + p.type);
    const oldOverflow = box.css("overflow");
    box.css("overflow", "hidden");
    const prom = TsUtils.message({
      owner: this,
      // any: query().get(0) returns Node|Node[]; panel element is HTMLElement
      box: box.get(0),
      after: ".tsg-panel-title",
      param: panel
      // any: cast-to-any for dynamic dispatch; TsLayout panel shape is user-defined at runtime
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, options);
    if (prom) {
      prom.self.on("close:after", () => {
        box.css("overflow", oldOverflow);
      });
    }
    return prom;
  }
  confirm(panel, options) {
    const p = this.get(panel);
    const box = query2(this.box).find("#layout_" + this.name + "_panel_" + p.type);
    const oldOverflow = box.css("overflow");
    box.css("overflow", "hidden");
    const prom = TsUtils.confirm({
      owner: this,
      // any: query().get(0) returns Node|Node[]; panel element is HTMLElement
      box: box.get(0),
      after: ".tsg-panel-title",
      param: panel
      // any: cast-to-any for dynamic dispatch; TsLayout panel shape is user-defined at runtime
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }, options);
    if (prom) {
      prom.self.on("close:after", () => {
        box.css("overflow", oldOverflow);
      });
    }
    return prom;
  }
  load(panel, url, transition) {
    return new Promise((resolve, reject) => {
      if ((panel == "css" || this.get(panel) != null) && url != null) {
        fetch(url).then((resp) => resp.text()).then((text) => {
          this.resize();
          resolve(this.html(panel, text, transition));
        });
      } else {
        reject();
      }
    });
  }
  sizeTo(panel, size, instant) {
    const pan = this.get(panel);
    if (pan == null) return false;
    query2(this.box).find(":scope > div > .tsg-panel").css("transition", instant !== true ? ".2s" : "0s");
    setTimeout(() => {
      this.set(panel, { size });
    }, 1);
    setTimeout(() => {
      query2(this.box).find(":scope > div > .tsg-panel").css("transition", "0s");
      this.resize();
    }, 300);
    return true;
  }
  show(panel, immediate) {
    const edata = this.trigger("show", { target: panel, thisect: this.get(panel), immediate });
    if (edata.isCancelled === true) return;
    const p = this.get(panel);
    if (p == null) return false;
    p.hidden = false;
    if (immediate === true) {
      query2(this.box).find("#layout_" + this.name + "_panel_" + panel).css({ "opacity": "1" });
      edata.finish();
      this.resize();
    } else {
      query2(this.box).addClass("animating");
      query2(this.box).find("#layout_" + this.name + "_panel_" + panel).css({ "opacity": "0" });
      query2(this.box).find(":scope > div > .tsg-panel").css("transition", ".2s");
      setTimeout(() => {
        this.resize();
      }, 1);
      setTimeout(() => {
        query2(this.box).find("#layout_" + this.name + "_panel_" + panel).css({ "opacity": "1" });
      }, 250);
      setTimeout(() => {
        query2(this.box).find(":scope > div > .tsg-panel").css("transition", "0s");
        query2(this.box).removeClass("animating");
        edata.finish();
        this.resize();
      }, 300);
    }
    return true;
  }
  hide(panel, immediate) {
    const edata = this.trigger("hide", { target: panel, object: this.get(panel), immediate });
    if (edata.isCancelled === true) return;
    const p = this.get(panel);
    if (p == null) return false;
    p.hidden = true;
    if (immediate === true) {
      query2(this.box).find("#layout_" + this.name + "_panel_" + panel).css({ "opacity": "0" });
      edata.finish();
      this.resize();
    } else {
      query2(this.box).addClass("animating");
      query2(this.box).find(":scope > div > .tsg-panel").css("transition", ".2s");
      query2(this.box).find("#layout_" + this.name + "_panel_" + panel).css({ "opacity": "0" });
      setTimeout(() => {
        this.resize();
      }, 1);
      setTimeout(() => {
        query2(this.box).find(":scope > div > .tsg-panel").css("transition", "0s");
        query2(this.box).removeClass("animating");
        edata.finish();
        this.resize();
      }, 300);
    }
    return true;
  }
  toggle(panel, immediate) {
    const p = this.get(panel);
    if (p == null) return false;
    if (p.hidden) return this.show(panel, immediate);
    else return this.hide(panel, immediate);
  }
  set(panel, options) {
    const ind = this.get(panel, true);
    if (ind == null) return false;
    TsUtils.extend(this.panels[ind], options);
    if (options.html != null || options.resizable != null) {
      this.refresh(panel);
    }
    this.resize();
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(panel, returnIndex) {
    for (let p = 0; p < this.panels.length; p++) {
      const pan = this.panels[p];
      if (pan != null && pan.type == panel) {
        if (returnIndex === true) return p;
        else return pan;
      }
    }
    return null;
  }
  el(panel) {
    const el = query2(this.box).find("#layout_" + this.name + "_panel_" + panel + '> [data-role="panel-content"]');
    if (el.length != 1) return null;
    return el[0];
  }
  hideToolbar(panel) {
    const pan = this.get(panel);
    if (!pan) return;
    pan.show.toolbar = false;
    query2(this.box).find(`#layout_${this.name}_panel_${panel} > [data-role="panel-toolbar"]`).hide();
    this.resize();
  }
  showToolbar(panel) {
    const pan = this.get(panel);
    if (!pan) return;
    pan.show.toolbar = true;
    query2(this.box).find(`#layout_${this.name}_panel_${panel} > [data-role="panel-toolbar"]`).show();
    this.resize();
  }
  toggleToolbar(panel) {
    const pan = this.get(panel);
    if (!pan) return;
    if (pan.show.toolbar) this.hideToolbar(panel);
    else this.showToolbar(panel);
  }
  assignToolbar(panel, toolbar) {
    if (typeof toolbar == "string" && _TsUiRegistry()[toolbar] != null) toolbar = _TsUiRegistry()[toolbar];
    const pan = this.get(panel);
    pan.toolbar = toolbar;
    const tmp = query2(this.box).find(panel + '> [data-role="panel-toolbar"]');
    if (pan.toolbar != null) {
      if (tmp.attr("name") != pan.toolbar.name) {
        ;
        pan.toolbar.render(tmp.get(0));
      } else if (pan.toolbar != null) {
        ;
        pan.toolbar.refresh();
      }
      if (typeof toolbar != "string" && toolbar) toolbar["owner"] = this;
      this.showToolbar(panel);
      this.refresh(panel);
    } else {
      tmp.html("");
      this.hideToolbar(panel);
    }
  }
  hideTabs(panel) {
    const pan = this.get(panel);
    if (!pan) return;
    pan.show.tabs = false;
    query2(this.box).find("#layout_" + this.name + "_panel_" + panel + '> [data-role="panel-tabs"]').hide();
    this.resize();
  }
  showTabs(panel) {
    const pan = this.get(panel);
    if (!pan) return;
    pan.show.tabs = true;
    query2(this.box).find("#layout_" + this.name + "_panel_" + panel + '> [data-role="panel-tabs"]').show();
    this.resize();
  }
  toggleTabs(panel) {
    const pan = this.get(panel);
    if (!pan) return;
    if (pan.show.tabs) this.hideTabs(panel);
    else this.showTabs(panel);
  }
  assignTabs(panel, tabs) {
    if (typeof tabs == "string" && _TsUiRegistry()[tabs] != null) tabs = _TsUiRegistry()[tabs];
    const pan = this.get(panel);
    pan.tabs = tabs;
    const tmp = query2(this.box).find(panel + '> [data-role="panel-tabs"]');
    if (pan.tabs != null) {
      if (tmp.attr("name") != pan.tabs.name) {
        ;
        pan.tabs.render(tmp.get(0));
      } else if (pan.tabs != null) {
        ;
        pan.tabs.refresh();
      }
      if (typeof tabs != "string" && tabs) tabs["owner"] = this;
      this.showTabs(panel);
      this.refresh(panel);
    } else {
      tmp.html("");
      this.hideTabs(panel);
    }
  }
  render(box) {
    const time = Date.now();
    const self = this;
    if (typeof box == "string") box = query2(box).get(0);
    const edata = this.trigger("render", { target: this.name, box: box ?? this.box });
    if (edata.isCancelled === true) return;
    if (box != null) {
      this.unmount();
      this.box = box;
    }
    if (!this.box) return false;
    query2(this.box).attr("name", this.name).addClass("tsg-layout").html("<div></div>");
    if (query2(this.box).length > 0) {
      ;
      query2(this.box)[0].style.cssText += this.style;
    }
    for (let p1 = 0; p1 < w2panels.length; p1++) {
      const html = '<div id="layout_' + this.name + "_panel_" + w2panels[p1] + '" class="tsg-panel">    <div class="tsg-panel-title"></div>    <div class="tsg-panel-tabs" data-role="panel-tabs"></div>    <div class="tsg-panel-toolbar" data-role="panel-toolbar"></div>    <div class="tsg-panel-content" data-role="panel-content"></div></div><div id="layout_' + this.name + "_resizer_" + w2panels[p1] + '" class="tsg-resizer"></div>';
      query2(this.box).find(":scope > div").append(html);
    }
    query2(this.box).find(":scope > div").append('<div id="layout_' + this.name + '_panel_css" style="position: absolute; top: 10000px;"></div>');
    this.refresh();
    this.last["observeResize"] = new ResizeObserver(() => {
      this.resize();
    });
    this.last["observeResize"].observe(this.box);
    edata.finish();
    setTimeout(() => {
      self.last["events"] = { resizeStart, mouseMove, mouseUp };
      this.resize();
    }, 0);
    return Date.now() - time;
    function resizeStart(type, evnt) {
      if (!self.box) return;
      if (!evnt) evnt = window.event;
      query2(document).off("mousemove", self.last["events"].mouseMove).on("mousemove", self.last["events"].mouseMove);
      query2(document).off("mouseup", self.last["events"].mouseUp).on("mouseup", self.last["events"].mouseUp);
      self.last["resize"] = {
        type,
        x: evnt.screenX,
        y: evnt.screenY,
        diff_x: 0,
        diff_y: 0,
        value: 0
      };
      w2panels.forEach((panel) => {
        const $tmp = query2(self.el(panel)).find(".tsg-lock");
        if ($tmp.length > 0) {
          $tmp.data("locked", "yes");
        } else {
          self.lock(panel, { opacity: 0 });
        }
      });
      const el = query2(self.box).find("#layout_" + self.name + "_resizer_" + type).get(0);
      if (type == "left" || type == "right") {
        self.last["resize"].value = parseInt(el.style.left);
      }
      if (type == "top" || type == "preview" || type == "bottom") {
        self.last["resize"].value = parseInt(el.style.top);
      }
    }
    function mouseUp(evnt) {
      if (!self.box) return;
      if (!evnt) evnt = window.event;
      query2(document).off("mousemove", self.last["events"].mouseMove);
      query2(document).off("mouseup", self.last["events"].mouseUp);
      if (self.last["resize"] == null) return;
      w2panels.forEach((panel) => {
        const $tmp = query2(self.el(panel)).find(".tsg-lock");
        if ($tmp.data("locked") == "yes") {
          $tmp.removeData("locked");
        } else {
          self.unlock(panel);
        }
      });
      if (self.last["diff_x"] !== 0 || self.last["resize"].diff_y !== 0) {
        const ptop = self.get("top");
        const pbottom = self.get("bottom");
        const panel = self.get(self.last["resize"].type);
        const width = TsUtils.getSize(query2(self.box), "width");
        const height = TsUtils.getSize(query2(self.box), "height");
        const str = String(panel.size);
        let ns, nd;
        switch (self.last["resize"].type) {
          case "top":
            ns = parseInt(panel.sizeCalculated) + self.last["resize"].diff_y;
            nd = 0;
            break;
          case "bottom":
            ns = parseInt(panel.sizeCalculated) - self.last["resize"].diff_y;
            nd = 0;
            break;
          case "preview":
            ns = parseInt(panel.sizeCalculated) - self.last["resize"].diff_y;
            nd = (ptop && !ptop.hidden ? ptop.sizeCalculated : 0) + (pbottom && !pbottom.hidden ? pbottom.sizeCalculated : 0);
            break;
          case "left":
            ns = parseInt(panel.sizeCalculated) + self.last["resize"].diff_x;
            nd = 0;
            break;
          case "right":
            ns = parseInt(panel.sizeCalculated) - self.last["resize"].diff_x;
            nd = 0;
            break;
          default:
            ns = 0;
            nd = 0;
        }
        if (str.substr(str.length - 1) == "%") {
          panel.size = Math.floor(ns * 100 / (panel.type == "left" || panel.type == "right" ? width : height - nd) * 100) / 100 + "%";
        } else {
          if (String(panel.size).substr(0, 1) == "-") {
            panel.size = parseInt(panel.size) - panel.sizeCalculated + ns;
          } else {
            panel.size = ns;
          }
        }
        self.resize();
      }
      query2(self.box).find("#layout_" + self.name + "_resizer_" + self.last["resize"].type).removeClass(null).addClass("active");
      query2(self.box).find("#layout_" + self.name + "_resizer_" + self.last["resize"].type).removeClass("active");
      delete self.last["resize"];
    }
    function mouseMove(evnt) {
      if (!self.box) return;
      if (!evnt) evnt = window.event;
      if (self.last["resize"] == null) return;
      const panel = self.get(self.last["resize"].type);
      const tmp = self.last["resize"];
      const edata2 = self.trigger("resizing", {
        target: self.name,
        object: panel,
        originalEvent: evnt,
        panel: tmp ? tmp.type : "all",
        diff_x: tmp ? tmp.diff_x : 0,
        diff_y: tmp ? tmp.diff_y : 0
      });
      if (edata2.isCancelled === true) return;
      const p = query2(self.box).find("#layout_" + self.name + "_resizer_" + tmp.type);
      const resize_x = evnt.screenX - tmp.x;
      const resize_y = evnt.screenY - tmp.y;
      const mainPanel = self.get("main");
      if (!p.hasClass("active")) p.addClass("active");
      let adjusted_x = resize_x;
      let adjusted_y = resize_y;
      switch (tmp.type) {
        case "left":
          if (panel.minSize - adjusted_x > panel.width) {
            adjusted_x = panel.minSize - panel.width;
          }
          if (panel.maxSize && panel.width + adjusted_x > panel.maxSize) {
            adjusted_x = panel.maxSize - panel.width;
          }
          if (mainPanel.minSize + adjusted_x > mainPanel.width) {
            adjusted_x = mainPanel.width - mainPanel.minSize;
          }
          break;
        case "right":
          if (panel.minSize + adjusted_x > panel.width) {
            adjusted_x = panel.width - panel.minSize;
          }
          if (panel.maxSize && panel.width - adjusted_x > panel.maxSize) {
            adjusted_x = panel.width - panel.maxSize;
          }
          if (mainPanel.minSize - adjusted_x > mainPanel.width) {
            adjusted_x = mainPanel.minSize - mainPanel.width;
          }
          break;
        case "top":
          if (panel.minSize - adjusted_y > panel.height) {
            adjusted_y = panel.minSize - panel.height;
          }
          if (panel.maxSize && panel.height + adjusted_y > panel.maxSize) {
            adjusted_y = panel.maxSize - panel.height;
          }
          if (mainPanel.minSize + adjusted_y > mainPanel.height) {
            adjusted_y = mainPanel.height - mainPanel.minSize;
          }
          break;
        case "preview":
        case "bottom":
          if (panel.minSize + adjusted_y > panel.height) {
            adjusted_y = panel.height - panel.minSize;
          }
          if (panel.maxSize && panel.height - adjusted_y > panel.maxSize) {
            adjusted_y = panel.height - panel.maxSize;
          }
          if (mainPanel.minSize - adjusted_y > mainPanel.height) {
            adjusted_y = mainPanel.minSize - mainPanel.height;
          }
          break;
      }
      tmp.diff_x = adjusted_x;
      tmp.diff_y = adjusted_y;
      switch (tmp.type) {
        case "top":
        case "preview":
        case "bottom":
          tmp.diff_x = 0;
          if (p.length > 0) p[0].style.top = tmp.value + tmp.diff_y + "px";
          break;
        case "left":
        case "right":
          tmp.diff_y = 0;
          if (p.length > 0) p[0].style.left = tmp.value + tmp.diff_x + "px";
          break;
      }
      edata2.finish();
    }
  }
  unmount() {
    super.unmount();
    this.panels.forEach((panel) => {
      ;
      panel.tabs?.unmount?.();
      panel.toolbar?.unmount?.();
    });
    this.last["observeResize"]?.disconnect();
  }
  destroy() {
    const edata = this.trigger("destroy", { target: this.name });
    if (edata.isCancelled === true) return;
    if (_TsUiRegistry()[this.name] == null) return false;
    this.panels.forEach((panel) => {
      ;
      panel.tabs?.destroy?.();
      panel.toolbar?.destroy?.();
    });
    if (query2(this.box).find("#layout_" + this.name + "_panel_main").length > 0) {
      this.unmount();
    }
    delete _TsUiRegistry()[this.name];
    edata.finish();
    if (this.last["events"] && this.last["events"].resize) {
      query2(window).off("resize", this.last["events"].resize);
    }
    return true;
  }
  refresh(panel) {
    const self = this;
    const time = Date.now();
    const edata = self.trigger("refresh", { target: panel != null ? panel : self.name, object: panel != null ? self.get(panel) : null });
    if (edata.isCancelled === true) return;
    if (typeof panel == "string") {
      const p = self.get(panel);
      if (p == null) return;
      const pname = "#layout_" + self.name + "_panel_" + p.type;
      const rname = "#layout_" + self.name + "_resizer_" + p.type;
      query2(self.box).find(pname).css({ display: p.hidden ? "none" : "block" });
      if (p.resizable) {
        query2(self.box).find(rname).show();
      } else {
        query2(self.box).find(rname).hide();
      }
      if (typeof p.html == "object" && typeof p.html.render === "function") {
        ;
        p.html.box = query2(self.box).find(pname + '> [data-role="panel-content"]')[0];
        setTimeout(() => {
          if (query2(self.box).find(pname + '> [data-role="panel-content"]').length > 0) {
            const $content = query2(self.box).find(pname + '> [data-role="panel-content"]').removeClass(null).removeAttr("name").addClass("tsg-panel-content");
            $content.css("overflow", p.overflow)[0].style.cssText += ";" + p.style;
          }
          if (p.html && typeof p.html.render == "function") {
            ;
            p.html.render();
          }
        }, 1);
      } else {
        if (query2(self.box).find(pname + '> [data-role="panel-content"]').length > 0) {
          const $content = query2(self.box).find(pname + '> [data-role="panel-content"]').removeClass(null).removeAttr("name").addClass("tsg-panel-content");
          $content.html(p.html).css("overflow", p.overflow)[0].style.cssText += ";" + p.style;
        }
      }
      let tmp = query2(self.box).find(pname + '> [data-role="panel-tabs"]');
      if (p.show.tabs) {
        if (tmp.attr("name") != p.tabs?.name && p.tabs != null) {
          ;
          p.tabs.render(tmp.get(0));
        } else {
          ;
          p.tabs.refresh();
        }
        tmp.addClass("tsg-panel-tabs");
      } else {
        ;
        tmp.html("").removeAttr("name").removeClass(null);
        tmp.css("display", "none").hide();
      }
      tmp = query2(self.box).find(pname + '> [data-role="panel-toolbar"]');
      if (p.show.toolbar) {
        if (tmp.attr("name") != p.toolbar?.name && p.toolbar != null) {
          ;
          p.toolbar.render(tmp.get(0));
        } else {
          ;
          p.toolbar.refresh();
        }
        tmp.addClass("tsg-panel-toolbar");
      } else {
        ;
        tmp.html("").removeAttr("name").removeClass(null);
        tmp.css("display", "none").hide();
      }
      tmp = query2(self.box).find(pname + "> .tsg-panel-title");
      if (p.title) {
        ;
        tmp.html(p.title).show();
      } else {
        ;
        tmp.html("").hide();
      }
    } else {
      if (query2(self.box).find("#layout_" + self.name + "_panel_main").length === 0) {
        self.render();
        return;
      }
      self.resize();
      for (let p1 = 0; p1 < this.panels.length; p1++) {
        const p = this.panels[p1];
        if (p != null) self.refresh(p.type ?? void 0);
      }
    }
    edata.finish();
    return Date.now() - time;
  }
  resize() {
    if (!this.box) return false;
    const time = Date.now();
    const tmp = this.last["resize"];
    const edata = this.trigger("resize", {
      target: this.name,
      panel: tmp ? tmp.type : "all",
      diff_x: tmp ? tmp.diff_x : 0,
      diff_y: tmp ? tmp.diff_y : 0
    });
    if (edata.isCancelled === true) return;
    if (this.padding < 0) this.padding = 0;
    const width = TsUtils.getSize(query2(this.box), "width");
    const height = TsUtils.getSize(query2(this.box), "height");
    const self = this;
    const pmain = this.get("main");
    const pprev = this.get("preview");
    const pleft = this.get("left");
    const pright = this.get("right");
    const ptop = this.get("top");
    const pbottom = this.get("bottom");
    const sprev = pprev != null && pprev.hidden !== true ? true : false;
    const sleft = pleft != null && pleft.hidden !== true ? true : false;
    const sright = pright != null && pright.hidden !== true ? true : false;
    const stop = ptop != null && ptop.hidden !== true ? true : false;
    const sbottom = pbottom != null && pbottom.hidden !== true ? true : false;
    let l, t, w, h;
    for (let p = 0; p < w2panels.length; p++) {
      const panelType = w2panels[p];
      if (panelType == null || panelType === "main") continue;
      const panTmp = this.get(panelType);
      if (!panTmp) continue;
      const str = String(panTmp.size || 0);
      if (str.substr(str.length - 1) == "%") {
        let tmph = height;
        if (panTmp.type == "preview") {
          tmph = tmph - (ptop && !ptop.hidden ? ptop.sizeCalculated : 0) - (pbottom && !pbottom.hidden ? pbottom.sizeCalculated : 0);
        }
        panTmp.sizeCalculated = parseInt(String((panTmp.type == "left" || panTmp.type == "right" ? width : tmph) * parseFloat(panTmp.size) / 100));
      } else {
        panTmp.sizeCalculated = parseInt(panTmp.size);
      }
      panTmp.sizeCalculated = Math.max(panTmp.sizeCalculated, parseInt(panTmp.minSize));
    }
    if (parseInt(pright.size) < 0) {
      if (sleft && parseInt(pleft.size) < 0) {
        console.log("ERROR: you cannot have both left panel.size and right panel.size be negative.");
      } else {
        pright.sizeCalculated = width - (sleft ? pleft.sizeCalculated : 0) + parseInt(pright.size);
      }
    }
    if (parseInt(pleft.size) < 0) {
      if (sright && parseInt(pright.size) < 0) {
        console.log("ERROR: you cannot have both left panel.size and right panel.size be negative.");
      } else {
        pleft.sizeCalculated = width - (sright ? pright.sizeCalculated : 0) + parseInt(pleft.size);
      }
    }
    if (parseInt(pprev.size) < 0) {
      pprev.sizeCalculated = height + parseInt(pprev.size);
      if (pprev.sizeCalculated > height) pprev.sizeCalculated = height;
    }
    if (ptop != null && ptop.hidden !== true) {
      l = 0;
      t = 0;
      w = width;
      h = ptop.sizeCalculated;
      query2(this.box).find("#layout_" + this.name + "_panel_top").css({
        "display": "block",
        "left": l + "px",
        "top": t + "px",
        "width": w + "px",
        "height": h + "px"
      });
      ptop.width = w;
      ptop.height = h;
      if (ptop.resizable) {
        t = ptop.sizeCalculated - (this.padding === 0 ? this.resizer : 0);
        h = this.resizer > this.padding ? this.resizer : this.padding;
        query2(this.box).find("#layout_" + this.name + "_resizer_top").css({
          "display": "block",
          "left": l + "px",
          "top": t + "px",
          "width": w + "px",
          "height": h + "px",
          "cursor": "ns-resize"
        }).off("mousedown").on("mousedown", function(event) {
          event.preventDefault();
          const edata2 = self.trigger("resizerClick", { target: "top", originalEvent: event });
          if (edata2.isCancelled === true) return;
          _TsUiRegistry()[self.name].last.events.resizeStart("top", event);
          edata2.finish();
          return false;
        });
      }
    } else {
      query2(this.box).find("#layout_" + this.name + "_panel_top").hide();
      query2(this.box).find("#layout_" + this.name + "_resizer_top").hide();
    }
    if (pleft != null && pleft.hidden !== true) {
      l = 0;
      t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0);
      w = pleft.sizeCalculated;
      h = height - (stop ? ptop.sizeCalculated + this.padding : 0) - (sbottom ? pbottom.sizeCalculated + this.padding : 0);
      query2(this.box).find("#layout_" + this.name + "_panel_left").css({
        "display": "block",
        "left": l + "px",
        "top": t + "px",
        "width": w + "px",
        "height": h + "px"
      });
      pleft.width = w;
      pleft.height = h;
      if (pleft.resizable) {
        l = pleft.sizeCalculated - (this.padding === 0 ? this.resizer : 0);
        w = this.resizer > this.padding ? this.resizer : this.padding;
        query2(this.box).find("#layout_" + this.name + "_resizer_left").css({
          "display": "block",
          "left": l + "px",
          "top": t + "px",
          "width": w + "px",
          "height": h + "px",
          "cursor": "ew-resize"
        }).off("mousedown").on("mousedown", function(event) {
          event.preventDefault();
          const edata2 = self.trigger("resizerClick", { target: "left", originalEvent: event });
          if (edata2.isCancelled === true) return;
          _TsUiRegistry()[self.name].last.events.resizeStart("left", event);
          edata2.finish();
          return false;
        });
      }
    } else {
      query2(this.box).find("#layout_" + this.name + "_panel_left").hide();
      query2(this.box).find("#layout_" + this.name + "_resizer_left").hide();
    }
    if (pright != null && pright.hidden !== true) {
      l = width - pright.sizeCalculated;
      t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0);
      w = pright.sizeCalculated;
      h = height - (stop ? ptop.sizeCalculated + this.padding : 0) - (sbottom ? pbottom.sizeCalculated + this.padding : 0);
      query2(this.box).find("#layout_" + this.name + "_panel_right").css({
        "display": "block",
        "left": l + "px",
        "top": t + "px",
        "width": w + "px",
        "height": h + "px"
      });
      pright.width = w;
      pright.height = h;
      if (pright.resizable) {
        l = l - this.padding;
        w = this.resizer > this.padding ? this.resizer : this.padding;
        query2(this.box).find("#layout_" + this.name + "_resizer_right").css({
          "display": "block",
          "left": l + "px",
          "top": t + "px",
          "width": w + "px",
          "height": h + "px",
          "cursor": "ew-resize"
        }).off("mousedown").on("mousedown", function(event) {
          event.preventDefault();
          const edata2 = self.trigger("resizerClick", { target: "right", originalEvent: event });
          if (edata2.isCancelled === true) return;
          _TsUiRegistry()[self.name].last.events.resizeStart("right", event);
          edata2.finish();
          return false;
        });
      }
    } else {
      query2(this.box).find("#layout_" + this.name + "_panel_right").hide();
      query2(this.box).find("#layout_" + this.name + "_resizer_right").hide();
    }
    if (pbottom != null && pbottom.hidden !== true) {
      l = 0;
      t = height - pbottom.sizeCalculated;
      w = width;
      h = pbottom.sizeCalculated;
      query2(this.box).find("#layout_" + this.name + "_panel_bottom").css({
        "display": "block",
        "left": l + "px",
        "top": t + "px",
        "width": w + "px",
        "height": h + "px"
      });
      pbottom.width = w;
      pbottom.height = h;
      if (pbottom.resizable) {
        t = t - (this.padding === 0 ? 0 : this.padding);
        h = this.resizer > this.padding ? this.resizer : this.padding;
        query2(this.box).find("#layout_" + this.name + "_resizer_bottom").css({
          "display": "block",
          "left": l + "px",
          "top": t + "px",
          "width": w + "px",
          "height": h + "px",
          "cursor": "ns-resize"
        }).off("mousedown").on("mousedown", function(event) {
          event.preventDefault();
          const edata2 = self.trigger("resizerClick", { target: "bottom", originalEvent: event });
          if (edata2.isCancelled === true) return;
          _TsUiRegistry()[self.name].last.events.resizeStart("bottom", event);
          edata2.finish();
          return false;
        });
      }
    } else {
      query2(this.box).find("#layout_" + this.name + "_panel_bottom").hide();
      query2(this.box).find("#layout_" + this.name + "_resizer_bottom").hide();
    }
    l = 0 + (sleft ? pleft.sizeCalculated + this.padding : 0);
    t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0);
    w = width - (sleft ? pleft.sizeCalculated + this.padding : 0) - (sright ? pright.sizeCalculated + this.padding : 0);
    h = height - (stop ? ptop.sizeCalculated + this.padding : 0) - (sbottom ? pbottom.sizeCalculated + this.padding : 0) - (sprev ? pprev.sizeCalculated + this.padding : 0);
    query2(this.box).find("#layout_" + this.name + "_panel_main").css({
      "display": "block",
      "left": l + "px",
      "top": t + "px",
      "width": w + "px",
      "height": h + "px"
    });
    pmain.width = w;
    pmain.height = h;
    if (pprev != null && pprev.hidden !== true) {
      l = 0 + (sleft ? pleft.sizeCalculated + this.padding : 0);
      t = height - (sbottom ? pbottom.sizeCalculated + this.padding : 0) - pprev.sizeCalculated;
      w = width - (sleft ? pleft.sizeCalculated + this.padding : 0) - (sright ? pright.sizeCalculated + this.padding : 0);
      h = pprev.sizeCalculated;
      query2(this.box).find("#layout_" + this.name + "_panel_preview").css({
        "display": "block",
        "left": l + "px",
        "top": t + "px",
        "width": w + "px",
        "height": h + "px"
      });
      pprev.width = w;
      pprev.height = h;
      if (pprev.resizable) {
        t = t - (this.padding === 0 ? 0 : this.padding);
        h = this.resizer > this.padding ? this.resizer : this.padding;
        query2(this.box).find("#layout_" + this.name + "_resizer_preview").css({
          "display": "block",
          "left": l + "px",
          "top": t + "px",
          "width": w + "px",
          "height": h + "px",
          "cursor": "ns-resize"
        }).off("mousedown").on("mousedown", function(event) {
          event.preventDefault();
          const edata2 = self.trigger("resizerClick", { target: "preview", originalEvent: event });
          if (edata2.isCancelled === true) return;
          _TsUiRegistry()[self.name].last.events.resizeStart("preview", event);
          edata2.finish();
          return false;
        });
      }
    } else {
      query2(this.box).find("#layout_" + this.name + "_panel_preview").hide();
      query2(this.box).find("#layout_" + this.name + "_resizer_preview").hide();
    }
    this.resizeBoxes();
    edata.finish();
    return Date.now() - time;
  }
  resizeBoxes(panel) {
    const panels = w2panels;
    if (!panel && typeof panel == "string") panels.slice();
    panels.forEach((pname, ind) => {
      const pan = w2panels[ind] != null ? this.get(w2panels[ind]) : null;
      const tmp2 = `#layout_${this.name}_panel_${pname} > `;
      let topHeight = 0;
      if (pan) {
        if (pan.title) {
          const el = query2(this.box).find(tmp2 + ".tsg-panel-title").css({ top: topHeight + "px", display: "block" });
          topHeight += TsUtils.getSize(el, "height");
        }
        if (pan.show.tabs) {
          const el = query2(this.box).find(tmp2 + '[data-role="panel-tabs"]').css({ top: topHeight + "px", display: "block" });
          topHeight += TsUtils.getSize(el, "height");
        }
        if (pan.show.toolbar) {
          const el = query2(this.box).find(tmp2 + '[data-role="panel-toolbar"]').css({ top: topHeight + "px", display: "block" });
          topHeight += TsUtils.getSize(el, "height");
        }
      }
      query2(this.box).find(tmp2 + '[data-role="panel-content"]').css({
        display: "block",
        top: topHeight + "px"
      });
    });
  }
  lock(panel, msg, showSpinner) {
    if (w2panels.indexOf(panel) == -1) {
      console.log("ERROR: First parameter needs to be the a valid panel name.");
      return;
    }
    TsUtils.lock("#layout_" + this.name + "_panel_" + panel, msg, showSpinner);
  }
  unlock(panel, speed) {
    if (w2panels.indexOf(panel) == -1) {
      console.log("ERROR: First parameter needs to be the a valid panel name.");
      return;
    }
    const nm = "#layout_" + this.name + "_panel_" + panel;
    TsUtils.unlock(nm, speed);
  }
};
export {
  TsLayout
};
//# sourceMappingURL=layout.es6.js.map