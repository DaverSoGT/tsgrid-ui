import {
  lazySingleton
} from "./chunks/chunk-EQK6JAHT.js";
import {
  TsUtils
} from "./chunks/chunk-4ANPVTBJ.js";
import {
  boxIcon,
  crossIcon
} from "./chunks/chunk-OITJCF5M.js";
import "./chunks/chunk-IYF3Q7GX.js";
import {
  TsBase,
  query
} from "./chunks/chunk-RR7PNBCO.js";

// src/tspopup.ts
var query2 = query;
var TsDialog = class extends TsBase {
  defaults;
  options;
  status;
  tmp;
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleResize;
  _promCreated;
  _promOpened;
  _promClosing;
  _promClosed;
  _timer;
  constructor() {
    super();
    this.defaults = {
      title: "",
      text: "",
      // just a text (will be centered)
      body: "",
      buttons: "",
      width: 450,
      height: 250,
      focus: null,
      // brings focus to the element, can be a number or selector
      actions: null,
      // actions object
      style: "",
      // style of the message div
      speed: 0.3,
      blockPage: true,
      modal: false,
      maximized: false,
      // this is a flag to show the state - to open the popup maximized use openMaximized instead
      keyboard: true,
      // will close popup on esc if not modal
      showClose: true,
      showMax: false,
      resizable: false,
      transition: null,
      openMaximized: false,
      moved: false
    };
    this.name = "popup";
    this.status = "closed";
    this["onOpen"] = null;
    this["onClose"] = null;
    this["onMax"] = null;
    this["onMin"] = null;
    this["onToggle"] = null;
    this["onKeydown"] = null;
    this["onAction"] = null;
    this["onMove"] = null;
    this.tmp = {};
    this.handleResize = (_event) => {
      if (!this.options.moved) {
        this.center(void 0, void 0, true);
      }
    };
  }
  /**
   * Sample calls
   * - TsPopup.open('ddd').ok(() => { TsPopup.close() })
   * - TsPopup.open('ddd', { height: 120 }).ok(() => { TsPopup.close() })
   * - TsPopup.open({ body: 'text', title: 'caption', actions: ["Close"] }).close(() => { TsPopup.close() })
   * - TsPopup.open({ body: 'text', title: 'caption', actions: { Close() { TsPopup.close() }} })
   */
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  open(options, extraOptions) {
    const self = this;
    if (this.status == "closing" || query2("#tsg-popup").hasClass("animating")) {
      this.close(true);
    }
    const old_options = this.options;
    if (["string", "number"].includes(typeof options)) {
      options = TsUtils.extend({
        title: "Notification",
        body: `<div class="tsg-centered">${options}</div>`,
        actions: { Ok() {
          self.close();
        } },
        cancelAction: "ok"
      }, extraOptions ?? {});
    }
    if (options.text != null) options.body = `<div class="tsg-centered tsg-msg-text">${options.text}</div>`;
    options = Object.assign({}, this.defaults, old_options, { title: "", body: "" }, options, { maximized: false });
    this.options = options;
    if (query2("#tsg-popup").length === 0) {
      this.off("*");
      Object.keys(this).forEach((key) => {
        if (key.startsWith("on") && key != "on") this[key] = null;
      });
    }
    Object.keys(options).forEach((key) => {
      if (key.startsWith("on") && key != "on" && options[key]) {
        this[key] = options[key];
      }
    });
    options.width = parseInt(options.width);
    options.height = parseInt(options.height);
    let edata, msg;
    const { top, left, width, height } = this.center();
    if (options.width > width) options.width = width;
    if (options.height > height) options.height = height;
    const prom = {
      self: this,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      action(callBack) {
        self.on("action.prom", callBack);
        return prom;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      close(callBack) {
        self.on("close.prom", callBack);
        return prom;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      then(callBack) {
        self.on("open:after.prom", callBack);
        return prom;
      }
    };
    if (options.actions != null && !options.buttons) {
      options.buttons = "";
      Object.keys(options.actions).forEach((action) => {
        const handler = options.actions[action];
        let btnAction = action;
        if (typeof handler == "function") {
          options.buttons += `<button class="tsg-btn tsg-eaction" name="${action}" data-click='["action","${action}","event"]'>${action}</button>`;
        }
        if (typeof handler == "object") {
          options.buttons += `<button class="tsg-btn tsg-eaction ${handler.class || ""}" name="${action}" data-click='["action","${action}","event"]'
                        style="${handler.style}" ${handler.attrs}>${handler.text || action}</button>`;
          btnAction = Array.isArray(options.actions) ? handler.text : action;
        }
        if (typeof handler == "string") {
          if (handler.trim().startsWith("<")) {
            btnAction = "none";
            options.buttons += handler;
          } else {
            btnAction = (handler[0] ?? "").toLowerCase() + handler.substr(1).replace(/\s+/g, "");
            options.buttons += `<button class="tsg-btn tsg-eaction" name="${action}" data-click='["action","${btnAction}","event"]'>${handler}</button>`;
          }
        }
        if (typeof btnAction == "string") {
          btnAction = (btnAction[0] ?? "").toLowerCase() + btnAction.substr(1).replace(/\s+/g, "");
        }
        prom[btnAction] = function(callBack) {
          self.on("action.buttons", (event) => {
            const target = (event.detail.action[0] ?? "").toLowerCase() + event.detail.action.substr(1).replace(/\s+/g, "");
            if (target == btnAction) callBack(event);
          });
          return prom;
        };
      });
    }
    let titleBtns = "";
    if (options.showClose) {
      titleBtns += `<div class="tsg-popup-button tsg-popup-close">
                        <span class="tsg-icon tsg-eaction" data-mousedown="stop" data-click="close">${crossIcon({ label: "Close" })}</span>
                    </div>`;
    }
    if (options.showMax) {
      titleBtns += `<div class="tsg-popup-button tsg-popup-max">
                        <span class="tsg-icon tsg-eaction" data-mousedown="stop" data-click="toggle">${boxIcon({ label: "Toggle size" })}</span>
                    </div>`;
    }
    if (query2("#tsg-popup").length === 0) {
      edata = this.trigger("open", { target: "popup", present: false });
      if (edata.isCancelled === true) return;
      this.status = "opening";
      if (options.blockPage) {
        TsUtils.lock(document.body, {
          opacity: 0.3,
          ...options.modal ? {} : { onClick: () => {
            this.close();
          } }
        });
      }
      let styles = `
                left: ${left}px;
                top: ${top}px;
                width: ${parseInt(options.width)}px;
                height: ${parseInt(options.height)}px;
                transition: ${options.speed}s
            `;
      msg = `<div id="tsg-popup" class="tsg-popup tsg-anim-open animating ${!options.blockPage ? "tsg-non-blocking" : ""}" style="${TsUtils.stripSpaces(styles)}"></div>`;
      query2("body").append(msg);
      query2("#tsg-popup")[0]._w2popup = {
        self: this,
        created: new Promise((resolve) => {
          this._promCreated = resolve;
        }),
        opened: new Promise((resolve) => {
          this._promOpened = resolve;
        }),
        closing: new Promise((resolve) => {
          this._promClosing = resolve;
        }),
        closed: new Promise((resolve) => {
          this._promClosed = resolve;
        })
      };
      styles = `${!options.title ? "top: 0px !important;" : ""} ${!options.buttons ? "bottom: 0px !important;" : ""}`;
      msg = `
                <span name="hidden-first" tabindex="0" style="position: absolute; top: -100px"></span>
                <div class="tsg-popup-title-btns">${titleBtns}</div>
                <div class="tsg-popup-title" style="${!options.title ? "display: none" : ""}"></div>
                <div class="tsg-box" style="${styles}">
                    <div class="tsg-popup-body ${!options.title || " tsg-popup-no-title"}
                        ${!options.buttons || " tsg-popup-no-buttons"}" style="${options.style}">
                    </div>
                </div>
                <div class="tsg-popup-buttons" style="${!options.buttons ? "display: none" : ""}"></div>
                <div class="tsg-popup-resizer resize-point resize-icon"></div>
                <span name="hidden-last" tabindex="0" style="position: absolute; top: -100px"></span>
            `;
      query2("#tsg-popup").html(msg);
      if (options.title) query2("#tsg-popup .tsg-popup-title").append(TsUtils.lang(options.title));
      if (options.buttons) query2("#tsg-popup .tsg-popup-buttons").append(options.buttons);
      if (options.body) query2("#tsg-popup .tsg-popup-body").append(options.body);
      setTimeout(() => {
        ;
        query2("#tsg-popup").css("transition", options.speed + "s").removeClass("tsg-anim-open");
        TsUtils.bindEvents("#tsg-popup .tsg-eaction", this);
        query2("#tsg-popup").find(".tsg-popup-body").show();
        this._promCreated();
      }, 1);
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this.status = "open";
        self.setFocus(options.focus);
        edata.finish();
        this._promOpened();
        query2("#tsg-popup").removeClass("animating");
      }, options.speed * 1e3);
    } else {
      edata = this.trigger("open", { target: "popup", present: true });
      if (edata.isCancelled === true) return;
      this.status = "opening";
      if (old_options != null) {
        if (!old_options.maximized && (old_options.width != options.width || old_options.height != options.height)) {
          this.resize(options.width, options.height);
        }
        options.prevSize = options.width + "px:" + options.height + "px";
        options.maximized = old_options.maximized;
      }
      const cloned = query2("#tsg-popup .tsg-box").get(0).cloneNode(true);
      query2(cloned).removeClass("tsg-box").addClass("tsg-box-temp").find(".tsg-popup-body").empty().append(options.body);
      query2("#tsg-popup .tsg-box").after(cloned);
      if (options.buttons) {
        ;
        query2("#tsg-popup .tsg-popup-buttons").show().html("").append(options.buttons);
        query2("#tsg-popup .tsg-popup-body").removeClass("tsg-popup-no-buttons");
        query2("#tsg-popup .tsg-box, #tsg-popup .tsg-box-temp").css("bottom", "");
      } else {
        query2("#tsg-popup .tsg-popup-buttons").hide().html("");
        query2("#tsg-popup .tsg-popup-body").addClass("tsg-popup-no-buttons");
        query2("#tsg-popup .tsg-box, #tsg-popup .tsg-box-temp").css("bottom", "0px");
      }
      if (options.title) {
        query2("#tsg-popup .tsg-popup-title").show().html(TsUtils.lang(options.title));
        query2("#tsg-popup .tsg-popup-body").removeClass("tsg-popup-no-title");
        query2("#tsg-popup .tsg-box, #tsg-popup .tsg-box-temp").css("top", "");
      } else {
        query2("#tsg-popup .tsg-popup-title").hide().html("");
        query2("#tsg-popup .tsg-popup-body").addClass("tsg-popup-no-title");
        query2("#tsg-popup .tsg-box, #tsg-popup .tsg-box-temp").css("top", "0px");
      }
      if (titleBtns) {
        query2("#tsg-popup .tsg-popup-title-btns").show().html(titleBtns);
      } else {
        query2("#tsg-popup .tsg-popup-title-btns").hide();
      }
      const div_old = query2("#tsg-popup .tsg-box")[0];
      const div_new = query2("#tsg-popup .tsg-box-temp")[0];
      query2("#tsg-popup").addClass("animating");
      TsUtils.transition(div_old, div_new, options.transition, () => {
        query2(div_old).remove();
        query2(div_new).removeClass("tsg-box-temp").addClass("tsg-box");
        const $body = query2(div_new).find(".tsg-popup-body");
        if ($body.length == 1) {
          $body[0].style.cssText = options.style;
          $body.show();
        }
        self.setFocus(options.focus);
        query2("#tsg-popup").removeClass("animating");
      });
      this.status = "open";
      edata.finish();
      TsUtils.bindEvents("#tsg-popup .tsg-eaction", this);
      query2("#tsg-popup").find(".tsg-popup-body").show();
    }
    if (options.openMaximized) {
      this.max();
    }
    options._last_focus = document.activeElement;
    if (options.keyboard) {
      query2(document.body).off(".TsPopup").on("keydown.TsPopup", (event) => {
        this.keydown(event);
      });
    }
    query2(window).on("resize", this.handleResize);
    const tmp = {
      changing: false,
      mvMove,
      mvStop
    };
    query2("#tsg-popup .tsg-popup-title").off("mousedown").on("mousedown", function(event) {
      if (!self.options.maximized) mvStart(event);
    });
    if (options.resizable) {
      query2("#tsg-popup .tsg-popup-resizer").show();
      query2("#tsg-popup .tsg-popup-resizer").off("mousedown").on("mousedown", (event) => {
        mvStart(event, true);
      });
    } else {
      query2("#tsg-popup .tsg-popup-resizer").hide();
    }
    return prom;
    function mvStart(evt, resizer) {
      if (!evt) evt = window.event;
      self.status = resizer ? "resizing" : "moving";
      const rect = query2("#tsg-popup").get(0).getBoundingClientRect();
      Object.assign(tmp, {
        changing: true,
        isLocked: query2("#tsg-popup > .tsg-lock").length == 1 ? true : false,
        x: evt.screenX,
        y: evt.screenY,
        pos_x: rect.x,
        pos_y: rect.y,
        width: rect.width,
        height: rect.height
      });
      if (!tmp.isLocked) self.lock({ opacity: 0 });
      query2(document.body).on("mousemove.tsg-popup", tmp.mvMove).on("mouseup.tsg-popup", tmp.mvStop);
      if (evt.stopPropagation) evt.stopPropagation();
      else evt.cancelBubble = true;
      if (evt.preventDefault) evt.preventDefault();
      else return false;
    }
    function mvMove(evt) {
      if (tmp.changing != true) return;
      if (!evt) evt = window.event;
      tmp.div_x = evt.screenX - tmp.x;
      tmp.div_y = evt.screenY - tmp.y;
      const edata2 = self.trigger("move", { target: "popup", div_x: tmp.div_x, div_y: tmp.div_y, originalEvent: evt });
      if (edata2.isCancelled === true) return;
      if (self.status == "moving") {
        query2("#tsg-popup").css({
          "transition": "none",
          "transform": "translate3d(" + tmp.div_x + "px, " + tmp.div_y + "px, 0px)"
        });
        self.options.moved = true;
      } else {
        query2("#tsg-popup").css({
          transition: "none",
          width: tmp.width + tmp.div_x + "px",
          height: tmp.height + tmp.div_y + "px"
        });
      }
      edata2.finish();
    }
    function mvStop(evt) {
      if (tmp.changing != true) return;
      if (!evt) evt = window.event;
      tmp.div_x = evt.screenX - tmp.x;
      tmp.div_y = evt.screenY - tmp.y;
      if (self.status == "moving") {
        ;
        query2("#tsg-popup").css({
          "left": tmp.pos_x + tmp.div_x + "px",
          "top": tmp.pos_y + tmp.div_y + "px"
        }).css({
          "transition": "none",
          "transform": "translate3d(0px, 0px, 0px)"
        });
      } else {
        query2("#tsg-popup").css({
          transition: "none",
          width: tmp.width + tmp.div_x + "px",
          height: tmp.height + tmp.div_y + "px"
        });
        self.resizeMessages();
      }
      tmp.changing = false;
      self.status = "open";
      query2(document.body).off(".tsg-popup");
      if (!tmp.isLocked) self.unlock();
    }
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  load(options) {
    return new Promise((resolve, reject) => {
      if (typeof options == "string") {
        options = { url: options };
      }
      if (options.url == null) {
        console.log("ERROR: The url is not defined.");
        reject("The url is not defined");
        return;
      }
      this.status = "loading";
      const [url, selector] = String(options.url).split("#");
      if (url) {
        fetch(url).then((res) => res.text()).then((html) => {
          resolve(this.template(html, selector, options));
        });
      }
    });
  }
  // any: parameter typed any — runtime dispatch by call site; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template(data, id, options = {}) {
    let html;
    try {
      html = query2(data);
    } catch (e) {
      html = query.html(data);
    }
    if (id) html = html.filter("#" + id);
    Object.assign(options, {
      width: parseInt(query2(html).css("width")),
      height: parseInt(query2(html).css("height")),
      title: query2(html).find("[rel=title]").html(),
      body: query2(html).find("[rel=body]").html(),
      buttons: query2(html).find("[rel=buttons]").html(),
      style: query2(html).find("[rel=body]").get(0).style.cssText
    });
    return this.open(options);
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action(action, event) {
    let click = this.options.actions?.[action];
    if (click instanceof Object && click.onClick) click = click.onClick;
    const edata = this.trigger("action", {
      action,
      target: "popup",
      self: this,
      // any: cast-to-any for dynamic dispatch; TsPopup options accept untyped user payloads at runtime
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      originalEvent: event,
      value: this["input"] ? this["input"].value : null
    });
    if (edata.isCancelled === true) return;
    if (typeof click === "function") click.call(this, event);
    edata.finish();
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keydown(event) {
    if (this.options && !this.options.keyboard) return;
    const edata = this.trigger("keydown", { target: "popup", originalEvent: event });
    if (edata.isCancelled === true) return;
    switch (event.keyCode) {
      case 27:
        event.preventDefault();
        if (query2("#tsg-popup .tsg-message").length == 0) {
          if (this.options.cancelAction) {
            this.action(this.options.cancelAction);
          } else {
            this.close();
          }
        }
        break;
    }
    edata.finish();
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  close(immediate) {
    const edata = this.trigger("close", { target: "popup" });
    if (edata.isCancelled === true) return;
    const cleanUp = () => {
      query2("#tsg-popup").remove();
      if (this.options._last_focus) this.options._last_focus.focus();
      this.status = "closed";
      this.options = {};
      edata.finish();
      this._promClosed();
    };
    if (query2("#tsg-popup").length === 0 || this.status == "closed") {
      return;
    }
    if (this.status == "opening") {
      immediate = true;
    }
    if (this.status == "closing" && immediate === true) {
      cleanUp();
      clearTimeout(this.tmp["closingTimer"]);
      TsUtils.unlock(document.body, 0);
      return;
    }
    this.status = "closing";
    query2("#tsg-popup").css("transition", this.options.speed + "s").addClass("tsg-anim-close animating");
    TsUtils.unlock(document.body, 300);
    this._promClosing();
    if (immediate) {
      cleanUp();
    } else {
      this.tmp["closingTimer"] = setTimeout(cleanUp, (this.options.speed ?? 0.3) * 1e3);
    }
    if (this.options.keyboard) {
      query2(document.body).off("keydown", this.keydown);
    }
    query2(window).off("resize", this.handleResize);
  }
  toggle() {
    const edata = this.trigger("toggle", { target: "popup" });
    if (edata.isCancelled === true) return;
    if (this.options.maximized === true) this.min();
    else this.max();
    setTimeout(() => {
      edata.finish();
    }, (this.options.speed ?? 0.3) * 1e3 + 50);
  }
  max() {
    if (this.options.maximized === true) return;
    const edata = this.trigger("max", { target: "popup" });
    if (edata.isCancelled === true) return;
    this.status = "resizing";
    const rect = query2("#tsg-popup").get(0).getBoundingClientRect();
    this.options.prevSize = rect.width + ":" + rect.height;
    this.resize(1e4, 1e4, () => {
      this.status = "open";
      this.options.maximized = true;
      edata.finish();
    });
  }
  min() {
    if (this.options.maximized !== true) return;
    const size = (this.options.prevSize ?? "").split(":");
    const edata = this.trigger("min", { target: "popup" });
    if (edata.isCancelled === true) return;
    this.status = "resizing";
    this.options.maximized = false;
    this.resize(parseInt(size[0] ?? "0"), parseInt(size[1] ?? "0"), () => {
      this.status = "open";
      this.options.prevSize = null;
      edata.finish();
    });
  }
  clear() {
    query2("#tsg-popup .tsg-popup-title").html("");
    query2("#tsg-popup .tsg-popup-body").html("");
    query2("#tsg-popup .tsg-popup-buttons").html("");
  }
  reset() {
    this.open(this.defaults);
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message(options) {
    return TsUtils.message({
      owner: this,
      box: query2("#tsg-popup").get(0),
      after: ".tsg-popup-title"
    }, options);
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  confirm(options) {
    return TsUtils.confirm({
      owner: this,
      box: query2("#tsg-popup").get(0),
      after: ".tsg-popup-title"
    }, options);
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFocus(focus) {
    const box = query2("#tsg-popup");
    const sel = "input, button, select, textarea, [contentEditable], [tabindex], .tsg-input";
    if (focus != null) {
      const el = isNaN(focus) ? box.find(sel).filter(focus).filter(":not([name=hidden-first])").get(0) : box.find(sel).filter(":not([name=hidden-first])").get(focus);
      el?.focus();
    } else {
      const el = box.find("[name=hidden-first]").get(0);
      if (el) el.focus();
    }
    query2(box).find(sel).off(".keep-focus").on("blur.keep-focus", function(_event) {
      setTimeout(() => {
        const focus2 = document.activeElement;
        const inside = query2(box).find(sel).filter(focus2).length > 0;
        const name = query2(focus2).attr("name");
        if (!inside && focus2 && focus2 !== document.body) {
          query2(box).find(sel).get(0)?.focus();
        }
        if (name == "hidden-last") {
          query2(box).find(sel).get(1)?.focus();
        }
        if (name == "hidden-first") {
          query2(box).find(sel).get(-2)?.focus();
        }
      }, 1);
    });
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lock(msg, showSpinner) {
    TsUtils.lock(query2("#tsg-popup"), msg, showSpinner);
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unlock(speed) {
    TsUtils.unlock(query2("#tsg-popup"), speed);
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  center(width, height, force) {
    let maxW, maxH;
    if (window.innerHeight == void 0) {
      maxW = Math.floor(document.documentElement.offsetWidth);
      maxH = Math.floor(document.documentElement.offsetHeight);
    } else {
      maxW = Math.floor(window.innerWidth);
      maxH = Math.floor(window.innerHeight);
    }
    width = parseInt(width ?? this.options.width);
    height = parseInt(height ?? this.options.height);
    if (this.options.maximized === true) {
      width = maxW;
      height = maxH;
    }
    if (maxW - 10 < width) width = maxW - 10;
    if (maxH - 10 < height) height = maxH - 10;
    const top = (maxH - height) / 3;
    const left = (maxW - width) / 2;
    if (force) {
      query2("#tsg-popup").css({
        "transition": "none",
        "top": top + "px",
        "left": left + "px",
        "width": width + "px",
        "height": height + "px"
      });
      this.resizeMessages();
    }
    return { top, left, width, height };
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resize(newWidth, newHeight, callBack) {
    return new Promise((resolve) => {
      const self = this;
      if (this.options.speed == null) this.options.speed = 0;
      const { top, left, width, height } = this.center(newWidth, newHeight);
      const speed = this.options.speed;
      query2("#tsg-popup").css({
        "transition": `${speed}s width, ${speed}s height, ${speed}s left, ${speed}s top`,
        "top": top + "px",
        "left": left + "px",
        "width": width + "px",
        "height": height + "px"
      });
      const tmp_int = setInterval(() => {
        self.resizeMessages();
      }, 10);
      setTimeout(() => {
        clearInterval(tmp_int);
        self.resizeMessages();
        if (typeof callBack == "function") callBack();
        resolve(void 0);
      }, this.options.speed * 1e3 + 50);
    });
  }
  // internal function
  resizeMessages() {
    query2("#tsg-popup .tsg-message").each((node) => {
      const msg = node;
      const mopt = msg._msg_options;
      const popup = query2("#tsg-popup");
      if (parseInt(mopt.width) < 10) mopt.width = 10;
      if (parseInt(mopt.height) < 10) mopt.height = 10;
      const rect = popup[0].getBoundingClientRect();
      const titleHeight = popup.find(".tsg-popup-title")[0].clientHeight;
      const pWidth = Math.floor(rect.width);
      const pHeight = Math.floor(rect.height);
      mopt.width = mopt.originalWidth;
      if (mopt.width > pWidth - 10) {
        mopt.width = pWidth - 10;
      }
      mopt.height = mopt.originalHeight;
      if (mopt.height > pHeight - titleHeight - 5) {
        mopt.height = pHeight - titleHeight - 5;
      }
      if (mopt.originalHeight < 0) mopt.height = pHeight + mopt.originalHeight - titleHeight;
      if (mopt.originalWidth < 0) mopt.width = pWidth + mopt.originalWidth * 2;
      query2(msg).css({
        left: (pWidth - mopt.width) / 2 + "px",
        width: mopt.width + "px",
        height: mopt.height + "px"
      });
    });
  }
};
function TsAlert(msg, title, callBack) {
  let prom;
  const options = {
    title: TsUtils.lang(title ?? "Notification"),
    body: `<div class="tsg-centered tsg-msg-text">${msg}</div>`,
    showClose: false,
    actions: { ok: TsUtils.lang("Ok") },
    cancelAction: "ok"
  };
  if (query2("#tsg-popup").length > 0 && TsPopup.status != "closing") {
    prom = TsPopup.message(options);
  } else {
    prom = TsPopup.open(options);
  }
  prom["ok"]((event) => {
    if (typeof event.detail.self?.close == "function") {
      event.detail.self.close();
    }
    if (typeof callBack == "function") callBack();
  });
  return prom;
}
function TsConfirm(msg, title, callBack) {
  let prom;
  let options = msg;
  if (["string", "number"].includes(typeof options)) {
    options = { msg: options };
  }
  if (options.msg) {
    options.body = `<div class="tsg-centered tsg-msg-text">${options.msg}</div>`, delete options.msg;
  }
  if (typeof title == "function" && callBack == null) {
    callBack = title;
    title = void 0;
  }
  TsUtils.extend(options, {
    title: TsUtils.lang(title ?? options.title ?? "Confirmation"),
    showClose: false,
    modal: true,
    cancelAction: "no"
  });
  if (callBack == null && options.callBack != null) {
    callBack = options.callBack;
  }
  TsUtils.normButtons(options, { yes: TsUtils.lang("Yes"), no: TsUtils.lang("No") });
  if (query2("#tsg-popup").length > 0 && TsPopup.status != "closing") {
    prom = TsPopup.message(options);
  } else {
    prom = TsPopup.open(options);
  }
  prom.self.off(".confirm").on("action:after.confirm", (event) => {
    if (typeof event.detail.self?.close == "function") {
      event.detail.self.close();
    }
    if (typeof callBack == "function") callBack(event.detail.action);
  });
  return prom;
}
function TsPrompt(label, title, callBack) {
  let prom;
  let options = label;
  if (["string", "number"].includes(typeof options)) {
    options = { label: options };
  }
  if (options.label) {
    options.focus = 0;
    options.body = options.textarea ? `<div class="tsg-prompt textarea">
                 <div>${options.label}</div>
                 <textarea id="TsPrompt" class="tsg-input" ${options.attrs ?? ""}
                    data-keydown="keydown|event" data-keyup="change|event"></textarea>
               </div>` : `<div class="tsg-prompt tsg-centered">
                 <label>${options.label}</label>
                 <input id="TsPrompt" class="tsg-input" ${options.attrs ?? ""}
                    data-keydown="keydown|event" data-keyup="change|event">
               </div>`;
  }
  TsUtils.extend(options, {
    title: TsUtils.lang(title ?? options.title ?? "Notification"),
    showClose: false,
    modal: true,
    cancelAction: "cancel"
  });
  TsUtils.normButtons(options, { ok: TsUtils.lang("Ok"), cancel: TsUtils.lang("Cancel") });
  if (query2("#tsg-popup").length > 0 && TsPopup.status != "closing") {
    prom = TsPopup.message(options);
  } else {
    prom = TsPopup.open(options);
  }
  if (prom.self.box) {
    prom.self["input"] = query2(prom.self.box).find("#TsPrompt").get(0);
  } else {
    prom.self["input"] = query2("#tsg-popup .tsg-popup-body #TsPrompt").get(0);
  }
  if (options.value != null) {
    prom.self["input"].value = options.value;
    prom.self["input"].select();
  }
  prom.change = function(callback) {
    prom.self.on("change", callback);
    return this;
  };
  prom.self.off(".prompt").on("open:after.prompt", (event) => {
    const box = event.detail.box ? event.detail.box : query2("#tsg-popup .tsg-popup-body").get(0);
    TsUtils.bindEvents(query2(box).find("#TsPrompt"), {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      keydown(evt) {
        if (evt.keyCode == 27) evt.stopPropagation();
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      change(evt) {
        const edata = prom.self.trigger("change", { target: "prompt", originalEvent: evt });
        if (edata.isCancelled === true) return;
        if (evt.keyCode == 13 && (evt.ctrlKey || evt.metaKey || evt.target.tagName != "TEXTAREA")) {
          prom.self.action("Ok", evt);
        }
        if (evt.keyCode == 27) {
          prom.self.action("Cancel", evt);
        }
        edata.finish();
      }
    });
    query2(box).find(".tsg-eaction").trigger("keyup");
  }).on("action:after.prompt", (event) => {
    if (typeof event.detail.self?.close == "function") {
      event.detail.self.close();
    }
    if (typeof callBack == "function") callBack(event.detail.action);
  });
  return prom;
}
var _TsDialogCtorCount = 0;
var TsPopup = lazySingleton(() => {
  _TsDialogCtorCount++;
  return new TsDialog();
}, TsDialog);
var __test_internals = {
  get tsDialogCtorCount() {
    return _TsDialogCtorCount;
  },
  reset() {
    _TsDialogCtorCount = 0;
  }
};
export {
  TsAlert,
  TsConfirm,
  TsDialog,
  TsPopup,
  TsPrompt,
  __test_internals
};
//# sourceMappingURL=popup.es6.js.map