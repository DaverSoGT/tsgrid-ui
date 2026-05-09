/* w2ui 2.0.x (nightly) (5/8/2026, 4:14:04 PM) (c) http://w2ui.com, vitmalina@gmail.com */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index-legacy.ts
var index_legacy_exports = {};
__export(index_legacy_exports, {
  Dialog: () => Dialog,
  Tooltip: () => Tooltip,
  query: () => query2,
  w2alert: () => w2alert,
  w2base: () => w2base,
  w2color: () => w2color,
  w2confirm: () => w2confirm,
  w2date: () => w2date,
  w2event: () => w2event,
  w2field: () => w2field,
  w2form: () => w2form,
  w2grid: () => w2grid,
  w2layout: () => w2layout,
  w2locale: () => w2locale,
  w2menu: () => w2menu,
  w2popup: () => w2popup,
  w2prompt: () => w2prompt,
  w2sidebar: () => w2sidebar,
  w2tabs: () => w2tabs,
  w2toolbar: () => w2toolbar,
  w2tooltip: () => w2tooltip,
  w2ui: () => w2ui,
  w2utils: () => w2utils
});

// src/w2locale.ts
var w2locale = {
  "locale": "en-US",
  "dateFormat": "m/d/yyyy",
  "timeFormat": "hh:mi pm",
  "datetimeFormat": "m/d/yyyy|hh:mi pm",
  "currencyPrefix": "$",
  "currencySuffix": "",
  "currencyPrecision": 2,
  "groupSymbol": ",",
  // aka "thousands separator"
  "decimalSymbol": ".",
  "shortmonths": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  "fullmonths": ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  "shortdays": ["M", "T", "W", "T", "F", "S", "S"],
  "fulldays": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  "weekStarts": "S",
  // can be "M" for Monday or "S" for Sunday
  // phrases used in w2ui, should be empty for original language
  // keep these up-to-date and in sorted order
  // value = "---" to easier see what to translate
  "phrases": {
    "${count} letters or more...": "---",
    "Add new record": "---",
    "Add New": "---",
    "Advanced Search": "---",
    "after": "---",
    "AJAX error. See console for more details.": "---",
    "All Fields": "---",
    "All": "---",
    "Any": "---",
    "Are you sure you want to delete ${count} ${records}?": "---",
    "Attach files by dragging and dropping or Click to Select": "---",
    "before": "---",
    "begins with": "---",
    "begins": "---",
    "between": "---",
    "buffered": "---",
    "Cancel": "---",
    "Close": "---",
    "Column": "---",
    "Confirmation": "---",
    "contains": "---",
    "Copied": "---",
    "Copy to clipboard": "---",
    "Current Date & Time": "---",
    "Delete selected records": "---",
    "Delete": "---",
    'Do you want to delete search item "${item}"?': "---",
    "Edit selected record": "---",
    "Edit": "---",
    "Empty list": "---",
    "ends with": "---",
    "ends": "---",
    "Field should be at least ${count} characters.": "---",
    "Hide": "---",
    "in": "---",
    "is not": "---",
    "is": "---",
    "less than": "---",
    "Line #": "---",
    "Load ${count} more...": "---",
    "Loading...": "---",
    "Maximum number of files is ${count}": "---",
    "Maximum total size is ${count}": "---",
    "Modified": "---",
    "more than": "---",
    "Multiple Fields": "---",
    "Name": "---",
    "No items found": "---",
    "No matches": "---",
    "No": "---",
    "none": "---",
    "Not a float": "---",
    "Not a hex number": "---",
    "Not a valid date": "---",
    "Not a valid email": "---",
    "Not alpha-numeric": "---",
    "Not an integer": "---",
    "Not in money format": "---",
    "not in": "---",
    "Notification": "---",
    "of": "---",
    "Ok": "---",
    "Opacity": "---",
    "Record ID": "---",
    "record": "---",
    "records": "---",
    "Refreshing...": "---",
    "RegEx": "---",
    "regex": "---",
    "Reload data in the list": "---",
    "Remove": "---",
    "Remove This Field": "---",
    "Request aborted.": "---",
    "Required field": "---",
    "Reset": "---",
    "Restore Default State": "---",
    "Returned data is not in valid JSON format.": "---",
    "Save changed records": "---",
    "Save Grid State": "---",
    "Save": "---",
    "Saved Searches": "---",
    "Saving...": "---",
    "Search took ${count} seconds": "---",
    "Search": "---",
    "Select Hour": "---",
    "Select Minute": "---",
    "selected": "---",
    "Server Response ${count} seconds": "---",
    "Show/hide columns": "---",
    "Show": "---",
    "Size": "---",
    "Skip": "---",
    "Sorting took ${count} seconds": "---",
    "Type to search...": "---",
    "Type": "---",
    "Yes": "---",
    "Yesterday": "---",
    "Your remote data source record count has changed, reloading from the first record.": "---"
  }
};

// src/query.ts
var Query = class _Query {
  static version = 0.8;
  context;
  nodes;
  length;
  constructor(selector, context) {
    this.context = context ?? document;
    let nodes = [];
    if (Array.isArray(selector)) {
      nodes = selector;
    } else if (selector instanceof Node || selector instanceof Window) {
      nodes = [selector];
    } else if (selector instanceof _Query) {
      nodes = selector.nodes;
    } else if (typeof selector == "string") {
      if (typeof this.context.querySelector != "function") {
        throw new Error("Invalid context");
      }
      nodes = Array.from(this.context.querySelectorAll(selector));
    } else if (selector == null) {
      nodes = [];
    } else {
      const arr = Array.from(selector ?? []);
      if (typeof selector == "object" && Array.isArray(arr)) {
        nodes = arr;
      } else {
        throw new Error(`Invalid selector "${selector}"`);
      }
    }
    this.nodes = nodes;
    this.length = nodes.length;
    this.each((node, ind) => {
      this[ind] = node;
    });
  }
  static _fragment(html) {
    const tmpl = document.createElement("template");
    tmpl.innerHTML = html;
    tmpl.content.childNodes.forEach((node) => {
      const newNode = _Query._scriptConvert(node);
      if (newNode != node) {
        tmpl.content.replaceChild(newNode, node);
      }
    });
    return tmpl.content;
  }
  // innerHTML, append, etc. script tags will not be executed unless they are proper script tags
  static _scriptConvert(node) {
    const convert = (txtNode) => {
      const doc = txtNode.ownerDocument;
      const scNode = doc.createElement("script");
      scNode.text = txtNode.text;
      const attrs = txtNode.attributes;
      for (let i = 0; i < attrs.length; i++) {
        const attr = attrs[i];
        if (attr) scNode.setAttribute(attr.name, attr.value);
      }
      return scNode;
    };
    if (node.tagName == "SCRIPT") {
      node = convert(node);
    }
    if (node.querySelectorAll) {
      node.querySelectorAll("script").forEach((textNode) => {
        textNode.parentNode.replaceChild(convert(textNode), textNode);
      });
    }
    return node;
  }
  static _fixProp(name) {
    const fixes = {
      cellpadding: "cellPadding",
      cellspacing: "cellSpacing",
      class: "className",
      colspan: "colSpan",
      contenteditable: "contentEditable",
      for: "htmlFor",
      frameborder: "frameBorder",
      maxlength: "maxLength",
      readonly: "readOnly",
      rowspan: "rowSpan",
      tabindex: "tabIndex",
      usemap: "useMap"
    };
    return fixes[name] ? fixes[name] : name;
  }
  _insert(method, html) {
    const nodes = [];
    const len = this.length;
    if (len < 1) return this;
    if (typeof html == "string") {
      this.each((node) => {
        const clone = _Query._fragment(html);
        nodes.push(...clone.childNodes);
        node[method]?.(clone);
      });
    } else if (html instanceof _Query) {
      const single = len == 1;
      html.each((el) => {
        this.each((node) => {
          const clone = single ? el : el.cloneNode(true);
          nodes.push(clone);
          node[method]?.(clone);
          _Query._scriptConvert(clone);
        });
      });
      if (!single) html.remove();
    } else if (html instanceof Node) {
      this.each((node) => {
        const clone = len === 1 ? html : _Query._fragment(html.outerHTML);
        nodes.push(...len === 1 ? [html] : clone.childNodes);
        node[method]?.(clone);
      });
      if (len > 1) html.remove();
    } else {
      throw new Error(`Incorrect argument for "${method}(html)". It expects one string argument.`);
    }
    if (method == "replaceWith") {
      return new _Query(nodes, this.context);
    }
    return this;
  }
  _save(node, name, value) {
    node._mQuery = node._mQuery ?? {};
    if (Array.isArray(value)) {
      node._mQuery[name] = node._mQuery[name] ?? [];
      node._mQuery[name].push(...value);
    } else if (value != null) {
      node._mQuery[name] = value;
    } else {
      delete node._mQuery[name];
    }
  }
  get(index) {
    if (index === void 0 || index === null) return this.nodes;
    if (index < 0) index = this.length + index;
    const node = this[index];
    if (node) {
      return node;
    }
    return null;
  }
  eq(index) {
    if (index < 0) index = this.length + index;
    const item = this[index];
    const nodes = item != null ? [item] : [];
    return new _Query(nodes, this.context);
  }
  then(fun) {
    const ret = fun(this);
    return ret != null ? ret : this;
  }
  find(selector) {
    const nodes = [];
    this.each((node) => {
      const nn = Array.from(node.querySelectorAll(selector));
      if (nn.length > 0) {
        nodes.push(...nn);
      }
    });
    return new _Query(nodes, this.context);
  }
  filter(selector) {
    const nodes = [];
    this.each((node) => {
      if (node === selector || typeof selector == "string" && node.matches && node.matches(selector) || typeof selector == "function" && selector(node)) {
        nodes.push(node);
      }
    });
    return new _Query(nodes, this.context);
  }
  next() {
    const nodes = [];
    this.each((node) => {
      const nn = node.nextElementSibling;
      if (nn) {
        nodes.push(nn);
      }
    });
    return new _Query(nodes, this.context);
  }
  prev() {
    const nodes = [];
    this.each((node) => {
      const nn = node.previousElementSibling;
      if (nn) {
        nodes.push(nn);
      }
    });
    return new _Query(nodes, this.context);
  }
  shadow(selector) {
    const nodes = [];
    this.each((node) => {
      if (node.shadowRoot) nodes.push(node.shadowRoot);
    });
    const col = new _Query(nodes, this.context);
    return selector ? col.find(selector) : col;
  }
  closest(selector) {
    const nodes = [];
    this.each((node) => {
      const nn = node.closest(selector);
      if (nn) {
        nodes.push(nn);
      }
    });
    return new _Query(nodes, this.context);
  }
  host(all) {
    const nodes = [];
    const top = (node) => {
      if (node.parentNode) {
        return top(node.parentNode);
      } else {
        return node;
      }
    };
    const fun = (node) => {
      const nn = top(node);
      nodes.push(nn.host ? nn.host : nn);
      if (nn.host && all) fun(nn.host);
    };
    this.each((node) => {
      fun(node);
    });
    return new _Query(nodes, this.context);
  }
  parent(selector) {
    return this.parents(selector, true);
  }
  parents(selector, firstOnly) {
    const nodes = [];
    const add = (node) => {
      if (nodes.indexOf(node) == -1) {
        nodes.push(node);
      }
      if (!firstOnly && node.parentNode) {
        return add(node.parentNode);
      }
    };
    this.each((node) => {
      if (node.parentNode) add(node.parentNode);
    });
    const col = new _Query(nodes, this.context);
    return selector ? col.filter(selector) : col;
  }
  add(more) {
    const nodes = more instanceof _Query ? more.nodes : Array.isArray(more) ? more : [more];
    return new _Query(this.nodes.concat(nodes), this.context);
  }
  each(func) {
    this.nodes.forEach((node, ind) => {
      func(node, ind, this);
    });
    return this;
  }
  append(html) {
    return this._insert("append", html);
  }
  prepend(html) {
    return this._insert("prepend", html);
  }
  after(html) {
    return this._insert("after", html);
  }
  before(html) {
    return this._insert("before", html);
  }
  replace(html) {
    return this._insert("replaceWith", html);
  }
  remove() {
    this.each((node) => {
      node.remove();
    });
    return this;
  }
  css(key, value) {
    let css = typeof key === "object" ? key : {};
    const len = arguments.length;
    if (len === 0 || len === 1 && typeof key == "string") {
      if (this[0]) {
        const st = this[0].style;
        if (typeof key == "string") {
          const pri = st.getPropertyPriority(key);
          return st.getPropertyValue(key) + (pri ? "!" + pri : "");
        } else {
          return Object.fromEntries(
            this[0].style.cssText.split(";").filter((a) => !!a).map((a) => {
              return a.split(":").map((a2) => a2.trim());
            })
          );
        }
      } else {
        return void 0;
      }
    } else {
      if (typeof key != "object") {
        css = {};
        css[key] = value;
      }
      this.each((el) => {
        Object.keys(css).forEach((key2) => {
          const imp = String(css[key2]).toLowerCase().includes("!important") ? "important" : "";
          el.style.setProperty(key2, String(css[key2]).replace(/\!important/i, ""), imp);
        });
      });
      return this;
    }
  }
  addClass(classes) {
    this.toggleClass(classes, true);
    return this;
  }
  removeClass(classes) {
    this.toggleClass(classes, false);
    return this;
  }
  toggleClass(classes, force) {
    if (typeof classes == "string") classes = classes.split(/[,\s]+/);
    this.each((node) => {
      let classes2 = classes;
      if (classes2 == null && force === false) classes2 = Array.from(node.classList);
      if (classes2) {
        classes2.forEach((className) => {
          if (className !== "") {
            let act = "toggle";
            if (force != null) act = force ? "add" : "remove";
            node.classList[act](className);
          }
        });
      }
    });
    return this;
  }
  hasClass(classes) {
    if (typeof classes == "string") classes = classes.split(/[,\s]+/);
    if (classes == null && this.length > 0) {
      return Array.from(this[0].classList);
    }
    let ret = false;
    this.each((node) => {
      ret = ret || classes.every((className) => {
        return Array.from(node.classList ?? []).includes(className);
      });
    });
    return ret;
  }
  on(events, optionsOrCallback, callback) {
    let options = void 0;
    if (typeof optionsOrCallback == "function") {
      callback = optionsOrCallback;
      options = void 0;
    } else {
      options = optionsOrCallback;
    }
    let delegate;
    if (options?.delegate) {
      delegate = options.delegate;
      delete options.delegate;
    }
    const eventsStr = events.split(/[,\s]+/);
    eventsStr.forEach((eventName) => {
      const parts = String(eventName).toLowerCase().split(".");
      const event2 = parts[0] ?? "";
      const scope = parts[1];
      let cb = callback;
      if (delegate) {
        const fun = cb;
        cb = (evt) => {
          const parent = query(evt.target).parents(delegate);
          if (parent.length > 0) {
            evt["delegate"] = parent[0];
          } else {
            evt["delegate"] = evt.target;
          }
          if (evt.target.matches(delegate) || parent.length > 0) {
            fun(evt);
          }
        };
      }
      this.each((node) => {
        this._save(node, "events", [{ event: event2, scope, callback: cb, options }]);
        node.addEventListener(event2, cb, options);
      });
    });
    return this;
  }
  off(events, options, callback) {
    if (typeof options == "function") {
      callback = options;
      options = void 0;
    }
    const eventsStr = (events ?? "").split(/[,\s]+/);
    eventsStr.forEach((eventName) => {
      const offParts = String(eventName).toLowerCase().split(".");
      const event2 = offParts[0] ?? "";
      const scope = offParts[1];
      this.each((node) => {
        if (Array.isArray(node._mQuery?.events)) {
          for (let i = node._mQuery.events.length - 1; i >= 0; i--) {
            const evt = node._mQuery.events[i];
            if (!evt) continue;
            if (scope == null || scope === "") {
              if ((evt.event == event2 || event2 === "") && (evt.callback == callback || callback == null)) {
                node.removeEventListener(evt.event, evt.callback, evt.options);
                node._mQuery.events.splice(i, 1);
              }
            } else {
              if ((evt.event == event2 || event2 === "") && evt.scope == scope) {
                node.removeEventListener(evt.event, evt.callback, evt.options);
                node._mQuery.events.splice(i, 1);
              }
            }
          }
        }
      });
    });
    return this;
  }
  trigger(name, options) {
    let event2;
    const mevent = ["click", "dblclick", "mousedown", "mouseup", "mousemove"];
    const kevent = ["keydown", "keyup", "keypress"];
    if (name instanceof Event) {
      event2 = name;
    } else if (mevent.includes(name)) {
      event2 = new MouseEvent(name, options);
    } else if (kevent.includes(name)) {
      event2 = new KeyboardEvent(name, options);
    } else {
      event2 = new Event(name, options);
    }
    this.each((node) => {
      node.dispatchEvent(event2);
    });
    return this;
  }
  attr(name, value) {
    if (value === void 0 && typeof name == "string") {
      return this[0] ? this[0].getAttribute(name) ?? void 0 : void 0;
    } else {
      let obj = {};
      if (typeof name == "object") obj = name;
      else obj[name] = value;
      this.each((node) => {
        Object.entries(obj).forEach(([nm, val]) => {
          node.setAttribute(nm, val);
        });
      });
      return this;
    }
  }
  removeAttr(...attrs) {
    this.each((node) => {
      attrs.forEach((attr) => {
        node.removeAttribute(attr);
      });
    });
    return this;
  }
  prop(name, value) {
    if (value === void 0 && typeof name == "string") {
      return this[0] ? this[0][name] : void 0;
    } else {
      let obj = {};
      if (typeof name == "object") obj = name;
      else obj[name] = value;
      this.each((node) => {
        Object.entries(obj).forEach(([nm, val]) => {
          const prop = _Query._fixProp(nm);
          node[prop] = val;
          if (prop == "innerHTML") {
            _Query._scriptConvert(node);
          }
        });
      });
      return this;
    }
  }
  removeProp(...props) {
    this.each((node) => {
      props.forEach((prop) => {
        delete node[_Query._fixProp(prop)];
      });
    });
    return this;
  }
  data(key, value) {
    if (key instanceof Object && !(typeof key === "string")) {
      Object.entries(key).forEach((item) => {
        this.data(item[0], item[1]);
      });
      return;
    }
    if (key && typeof key === "string" && key.indexOf("-") != -1) {
      console.error(`Key "${key}" contains "-" (dash). Dashes are not allowed in property names. Use camelCase instead.`);
    }
    if (arguments.length < 2) {
      if (this[0]) {
        const data = Object.assign({}, this[0].dataset);
        Object.keys(data).forEach((k) => {
          const v = data[k];
          if (v.startsWith("[") || v.startsWith("{")) {
            try {
              data[k] = JSON.parse(v);
            } catch (e) {
            }
          }
        });
        return key ? data[key] : data;
      } else {
        return void 0;
      }
    } else {
      this.each((node) => {
        if (value != null) {
          node.dataset[key] = value instanceof Object ? JSON.stringify(value) : value;
        } else {
          delete node.dataset[key];
        }
      });
      return this;
    }
  }
  removeData(key) {
    if (typeof key == "string") key = key.split(/[,\s]+/);
    this.each((node) => {
      key.forEach((k) => {
        delete node.dataset[k];
      });
    });
    return this;
  }
  show() {
    return this.toggle(true);
  }
  hide() {
    return this.toggle(false);
  }
  toggle(force) {
    return this.each((node) => {
      const prev = node.style.display;
      const dsp = getComputedStyle(node).display;
      const isHidden = prev == "none" || dsp == "none";
      if (isHidden && (force == null || force === true)) {
        const def = node instanceof HTMLTableRowElement ? "table-row" : node instanceof HTMLTableCellElement ? "table-cell" : "block";
        node.style.display = node._mQuery?.prevDisplay ?? (prev == dsp && dsp != "none" ? "" : def);
        this._save(node, "prevDisplay", null);
      }
      if (!isHidden && (force == null || force === false)) {
        if (dsp != "none") this._save(node, "prevDisplay", dsp);
        node.style.setProperty("display", "none");
      }
    });
  }
  empty() {
    return this.html("");
  }
  html(html) {
    if (html instanceof HTMLElement) {
      return this.empty().append(html);
    } else {
      return this.prop("innerHTML", html);
    }
  }
  text(text) {
    return this.prop("textContent", text);
  }
  val(value) {
    return this.prop("value", value);
  }
  change() {
    return this.trigger("change");
  }
  click() {
    return this.trigger("click");
  }
};
var query = function(selector, context) {
  if (typeof selector == "function") {
    const fn = selector;
    if (document.readyState == "complete") {
      fn();
    } else {
      window.addEventListener("load", fn);
    }
  } else {
    return new Query(selector, context);
  }
};
query.html = (str) => {
  const frag = Query._fragment(str);
  return query(frag.children, frag);
};
query.version = Query.version;

// src/w2utils.ts
var query2 = query;
var w2ui = {};
var Utils = class {
  version;
  tmp;
  settings;
  i18nCompare;
  hasLocalStorage;
  isMac;
  isMobile;
  isIOS;
  isAndroid;
  isSafari;
  isFirefox;
  formatters;
  constructor() {
    this.version = "2.0.x";
    this.tmp = {};
    this.settings = this.extend({}, {
      "dataType": "JSON",
      // can be HTTP, JSON, RESTFULL (case sensitive)
      "dateStartYear": 1950,
      // start year for date-picker
      "dateEndYear": 2030,
      // end year for date picker
      "macButtonOrder": false,
      // if true, Yes on the right side
      "warnNoPhrase": false
      // call console.warn if lang() encounters a missing phrase
    }, w2locale, { phrases: null }), // if there are no phrases, then it is original language
    this.i18nCompare = Intl.Collator().compare;
    this.hasLocalStorage = testLocalStorage();
    this.isMac = /Mac/i.test(navigator.platform);
    this.isMobile = /(iphone|ipod|mobile|android)/i.test(navigator.userAgent);
    this.isIOS = /(iphone|ipod|ipad)/i.test(navigator.platform);
    this.isAndroid = /(android)/i.test(navigator.userAgent);
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    this.isFirefox = /(Firefox)/i.test(navigator.userAgent);
    this.formatters = {
      "number"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        let params = extra.params;
        if (parseInt(String(params)) > 20) params = 20;
        if (parseInt(String(params)) < 0) params = 0;
        if (value == null || value === "") return "";
        return w2utils.formatNumber(parseFloat(String(value)), params, true);
      },
      "float"(record, extra) {
        return w2utils.formatters["number"]?.(record, extra) ?? "";
      },
      "int"(record, extra) {
        return w2utils.formatters["number"]?.(record, extra) ?? "";
      },
      "money"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        if (value == null || value === "") return "";
        const data = w2utils.formatNumber(Number(value), w2utils.settings.currencyPrecision, true);
        return (w2utils.settings.currencyPrefix || "") + data + (w2utils.settings.currencySuffix || "");
      },
      "currency"(record, extra) {
        return w2utils.formatters["money"]?.(record, extra) ?? "";
      },
      "percent"(record, extra) {
        if (extra == void 0) extra = record;
        const { value, params } = extra;
        if (value == null || value === "") return "";
        return w2utils.formatNumber(value, params || 1) + "%";
      },
      "size"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        if (value == null || value === "") return "";
        return String(w2utils.formatSize(parseInt(String(value))));
      },
      "date"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        let params = extra.params;
        if (params === "") params = w2utils.settings.dateFormat;
        if (value == null || value === 0 || value === "") return "";
        let dt = w2utils.isDateTime(value, params ?? null, true);
        if (dt === false) dt = w2utils.isDate(value, params ?? null, true);
        const dtStr = dt instanceof Date ? dt : "";
        return '<span title="' + dtStr + '">' + w2utils.formatDate(dt instanceof Date ? dt : void 0, params) + "</span>";
      },
      "datetime"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        let params = extra.params;
        if (params === "") params = w2utils.settings.datetimeFormat;
        if (value == null || value === 0 || value === "") return "";
        let dt = w2utils.isDateTime(value, params ?? null, true);
        if (dt === false) dt = w2utils.isDate(value, params ?? null, true);
        const dtStr = dt instanceof Date ? dt : "";
        return '<span title="' + dtStr + '">' + w2utils.formatDateTime(dt instanceof Date ? dt : void 0, params) + "</span>";
      },
      "time"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        let params = extra.params;
        if (params === "") params = w2utils.settings.timeFormat;
        if (params === "h12") params = "hh:mi pm";
        if (params === "h24") params = "h24:mi";
        if (value == null || value === 0 || value === "") return "";
        let dt = w2utils.isDateTime(value, params ?? null, true);
        if (dt === false) dt = w2utils.isDate(value, params ?? null, true);
        const dtStr = dt instanceof Date ? dt : "";
        return '<span title="' + dtStr + '">' + w2utils.formatTime(value, params) + "</span>";
      },
      "timestamp"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        let params = extra.params;
        if (params === "") params = w2utils.settings.datetimeFormat;
        if (value == null || value === 0 || value === "") return "";
        let dt = w2utils.isDateTime(value, params ?? null, true);
        if (dt === false) dt = w2utils.isDate(value, params ?? null, true);
        return dt instanceof Date ? dt.toString() : "";
      },
      "gmt"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        let params = extra.params;
        if (params === "") params = w2utils.settings.datetimeFormat;
        if (value == null || value === 0 || value === "") return "";
        let dt = w2utils.isDateTime(value, params ?? null, true);
        if (dt === false) dt = w2utils.isDate(value, params ?? null, true);
        return dt instanceof Date ? dt.toUTCString() : "";
      },
      "age"(record, extra) {
        if (extra == void 0) extra = record;
        const { value, params } = extra;
        if (value == null || value === 0 || value === "") return "";
        let dt = w2utils.isDateTime(value, null, true);
        if (dt === false) dt = w2utils.isDate(value, null, true);
        const dtStr = dt instanceof Date ? dt : "";
        return '<span title="' + dtStr + '">' + w2utils.age(value) + (params ? " " + params : "") + "</span>";
      },
      "interval"(record, extra) {
        if (extra == void 0) extra = record;
        const { value, params } = extra;
        if (value == null || value === 0 || value === "") return "";
        return w2utils.interval(Number(value)) + (params ? " " + params : "");
      },
      "toggle"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        return value ? w2utils.lang("Yes") : "";
      },
      "password"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        let ret = "";
        if (!value) return ret;
        const strVal = String(value);
        for (let i = 0; i < strVal.length; i++) {
          ret += "*";
        }
        return ret;
      }
    };
    return;
    function testLocalStorage() {
      const str = "w2ui_test";
      try {
        localStorage.setItem(str, str);
        localStorage.removeItem(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
  isBin(val) {
    const re = /^[0-1]+$/;
    return re.test(String(val));
  }
  isInt(val) {
    const re = /^[-+]?[0-9]+$/;
    return re.test(String(val));
  }
  isFloat(val) {
    if (typeof val === "string") {
      val = val.replace(new RegExp(this.settings.groupSymbol, "g"), "").replace(this.settings.decimalSymbol, ".");
    }
    return (typeof val === "number" || typeof val === "string" && val !== "") && !isNaN(Number(val));
  }
  isMoney(val) {
    if (typeof val === "object" || val === "") return false;
    if (this.isFloat(val)) return true;
    const se = this.settings;
    const re = new RegExp("^" + (se.currencyPrefix ? "\\" + se.currencyPrefix + "?" : "") + "[-+]?" + (se.currencyPrefix ? "\\" + se.currencyPrefix + "?" : "") + "[0-9]*[\\" + se.decimalSymbol + "]?[0-9]+" + (se.currencySuffix ? "\\" + se.currencySuffix + "?" : "") + "$", "i");
    if (typeof val === "string") {
      val = val.replace(new RegExp(se.groupSymbol, "g"), "");
    }
    return re.test(String(val));
  }
  isHex(val) {
    const re = /^(0x)?[0-9a-fA-F]+$/;
    return re.test(String(val));
  }
  isAlphaNumeric(val) {
    const re = /^[a-zA-Z0-9_-]+$/;
    return re.test(String(val));
  }
  isEmail(val) {
    const email = /^[a-zA-Z0-9._%\-+]+@[а-яА-Яa-zA-Z0-9.-]+\.[а-яА-Яa-zA-Z]+$/;
    return email.test(String(val));
  }
  isIpAddress(val) {
    const re = new RegExp("^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$");
    return re.test(String(val));
  }
  isDate(val, format, retDate) {
    if (!val) return false;
    let dt = "Invalid Date";
    let month, day, year;
    if (format == null) format = this.settings.dateFormat;
    if (val instanceof Date) {
      year = val.getFullYear();
      month = val.getMonth() + 1;
      day = val.getDate();
    } else if (typeof val === "number" || typeof val === "string" && parseInt(val) == val && parseInt(val) > 0) {
      const d = new Date(parseInt(String(val)));
      year = d.getFullYear();
      month = d.getMonth() + 1;
      day = d.getDate();
    } else {
      let strVal = String(val);
      if (new RegExp("mon", "ig").test(format)) {
        format = format.replace(/month/ig, "m").replace(/mon/ig, "m").replace(/dd/ig, "d").replace(/[, ]/ig, "/").replace(/\/\//g, "/").toLowerCase();
        strVal = strVal.replace(/[, ]/ig, "/").replace(/\/\//g, "/").toLowerCase();
        for (let m = 0, len = this.settings.fullmonths.length; m < len; m++) {
          const t = this.settings.fullmonths[m] ?? "";
          strVal = strVal.replace(new RegExp(t, "ig"), String(m + 1)).replace(new RegExp(t.substr(0, 3), "ig"), String(m + 1));
        }
      }
      const tmp = strVal.replace(/-/g, "/").replace(/\./g, "/").toLowerCase().split("/");
      const tmp2 = format.replace(/-/g, "/").replace(/\./g, "/").toLowerCase();
      if (tmp2 === "mm/dd/yyyy") {
        month = tmp[0];
        day = tmp[1];
        year = tmp[2];
      }
      if (tmp2 === "m/d/yyyy") {
        month = tmp[0];
        day = tmp[1];
        year = tmp[2];
      }
      if (tmp2 === "dd/mm/yyyy") {
        month = tmp[1];
        day = tmp[0];
        year = tmp[2];
      }
      if (tmp2 === "d/m/yyyy") {
        month = tmp[1];
        day = tmp[0];
        year = tmp[2];
      }
      if (tmp2 === "yyyy/dd/mm") {
        month = tmp[2];
        day = tmp[1];
        year = tmp[0];
      }
      if (tmp2 === "yyyy/d/m") {
        month = tmp[2];
        day = tmp[1];
        year = tmp[0];
      }
      if (tmp2 === "yyyy/mm/dd") {
        month = tmp[1];
        day = tmp[2];
        year = tmp[0];
      }
      if (tmp2 === "yyyy/m/d") {
        month = tmp[1];
        day = tmp[2];
        year = tmp[0];
      }
      if (tmp2 === "mm/dd/yy") {
        month = tmp[0];
        day = tmp[1];
        year = tmp[2];
      }
      if (tmp2 === "m/d/yy") {
        month = tmp[0];
        day = tmp[1];
        year = parseInt(tmp[2] ?? "0") + 1900;
      }
      if (tmp2 === "dd/mm/yy") {
        month = tmp[1];
        day = tmp[0];
        year = parseInt(tmp[2] ?? "0") + 1900;
      }
      if (tmp2 === "d/m/yy") {
        month = tmp[1];
        day = tmp[0];
        year = parseInt(tmp[2] ?? "0") + 1900;
      }
      if (tmp2 === "yy/dd/mm") {
        month = tmp[2];
        day = tmp[1];
        year = parseInt(tmp[0] ?? "0") + 1900;
      }
      if (tmp2 === "yy/d/m") {
        month = tmp[2];
        day = tmp[1];
        year = parseInt(tmp[0] ?? "0") + 1900;
      }
      if (tmp2 === "yy/mm/dd") {
        month = tmp[1];
        day = tmp[2];
        year = parseInt(tmp[0] ?? "0") + 1900;
      }
      if (tmp2 === "yy/m/d") {
        month = tmp[1];
        day = tmp[2];
        year = parseInt(tmp[0] ?? "0") + 1900;
      }
    }
    if (!this.isInt(year)) return false;
    if (!this.isInt(month)) return false;
    if (!this.isInt(day)) return false;
    const numYear = +(year ?? 0);
    const numMonth = +(month ?? 0);
    const numDay = +(day ?? 0);
    dt = new Date(numYear, numMonth - 1, numDay);
    dt.setFullYear(numYear);
    if (numMonth == null) return false;
    if (String(dt) === "Invalid Date") return false;
    if (dt.getMonth() + 1 !== numMonth || dt.getDate() !== numDay || dt.getFullYear() !== numYear) return false;
    if (retDate === true) return dt;
    else return true;
  }
  isTime(val, retTime) {
    if (val == null) return false;
    let max;
    let strVal = String(val).toUpperCase();
    const am = strVal.indexOf("AM") >= 0;
    const pm = strVal.indexOf("PM") >= 0;
    const ampm = pm || am;
    if (ampm) max = 12;
    else max = 24;
    strVal = strVal.replace("AM", "").replace("PM", "").trim();
    const tmp = strVal.split(":");
    const tmp0 = tmp[0] ?? "", tmp1 = tmp[1] ?? "", tmp2 = tmp[2] ?? "";
    let h = parseInt(tmp0 || "0");
    const m = parseInt(tmp1 || "0"), s = parseInt(tmp2 || "0");
    if ((!ampm || tmp.length !== 1) && tmp.length !== 2 && tmp.length !== 3) {
      return false;
    }
    if (tmp0 === "" || h < 0 || h > max || !this.isInt(tmp0) || tmp0.length > 2) {
      return false;
    }
    if (tmp.length > 1 && (tmp1 === "" || m < 0 || m > 59 || !this.isInt(tmp1) || tmp1.length !== 2)) {
      return false;
    }
    if (tmp.length > 2 && (tmp2 === "" || s < 0 || s > 59 || !this.isInt(tmp2) || tmp2.length !== 2)) {
      return false;
    }
    if (!ampm && max === h && (m !== 0 || s !== 0)) {
      return false;
    }
    if (ampm && tmp.length === 1 && h === 0) {
      return false;
    }
    if (retTime === true) {
      if (pm && h !== 12) h += 12;
      if (am && h === 12) h += 12;
      return {
        hours: h,
        minutes: m,
        seconds: s
      };
    }
    return true;
  }
  isDateTime(val, format, retDate) {
    if (val instanceof Date) {
      if (retDate !== true) return true;
      return val;
    }
    const intVal = parseInt(String(val));
    if (intVal === val) {
      if (intVal < 0) return false;
      else if (retDate !== true) return true;
      else return new Date(intVal);
    }
    const strVal = String(val);
    const tmp = strVal.indexOf(" ");
    if (tmp < 0) {
      if (strVal.indexOf("T") < 0 || String(new Date(strVal)) == "Invalid Date") return false;
      else if (retDate !== true) return true;
      else return new Date(strVal);
    } else {
      if (format == null) format = this.settings.datetimeFormat;
      const formats = format.split("|");
      const values = [strVal.substr(0, tmp), strVal.substr(tmp).trim()];
      if (formats[0] != null) formats[0] = formats[0].trim();
      if (formats[1]) formats[1] = formats[1].trim();
      const tmp1 = this.isDate(values[0], formats[0], true);
      const tmp2 = this.isTime(values[1], true);
      if (tmp1 !== false && tmp2 !== false) {
        if (retDate !== true) return true;
        const dt1 = tmp1;
        const t2 = tmp2;
        dt1.setHours(t2.hours);
        dt1.setMinutes(t2.minutes);
        dt1.setSeconds(t2.seconds);
        return dt1;
      } else {
        return false;
      }
    }
  }
  age(dateStr) {
    let d1;
    if (dateStr === "" || dateStr == null) return "";
    if (dateStr instanceof Date) {
      d1 = dateStr;
    } else if (typeof dateStr === "number" || typeof dateStr === "string" && parseInt(dateStr) == dateStr && parseInt(dateStr) > 0) {
      d1 = new Date(parseInt(String(dateStr)));
    } else {
      d1 = new Date(String(dateStr));
    }
    if (String(d1) === "Invalid Date") return "";
    const d2 = /* @__PURE__ */ new Date();
    const sec = (d2.getTime() - d1.getTime()) / 1e3;
    let amount = 0;
    let type = "";
    if (sec < 0) {
      amount = 0;
      type = "sec";
    } else if (sec < 60) {
      amount = Math.floor(sec);
      type = "sec";
      if (sec < 0) {
        amount = 0;
        type = "sec";
      }
    } else if (sec < 60 * 60) {
      amount = Math.floor(sec / 60);
      type = "min";
    } else if (sec < 24 * 60 * 60) {
      amount = Math.floor(sec / 60 / 60);
      type = "hour";
    } else if (sec < 30 * 24 * 60 * 60) {
      amount = Math.floor(sec / 24 / 60 / 60);
      type = "day";
    } else if (sec < 365 * 24 * 60 * 60) {
      amount = Math.floor(sec / 30 / 24 / 60 / 60 * 10) / 10;
      type = "month";
    } else if (sec < 365 * 4 * 24 * 60 * 60) {
      amount = Math.floor(sec / 365 / 24 / 60 / 60 * 10) / 10;
      type = "year";
    } else if (sec >= 365 * 4 * 24 * 60 * 60) {
      amount = Math.floor(sec / 365.25 / 24 / 60 / 60 * 10) / 10;
      type = "year";
    }
    return amount + " " + type + (amount > 1 ? "s" : "");
  }
  interval(value) {
    let ret = "";
    if (value < 100) {
      ret = "< 0.01 sec";
    } else if (value < 1e3) {
      ret = Math.floor(value / 10) / 100 + " sec";
    } else if (value < 1e4) {
      ret = Math.floor(value / 100) / 10 + " sec";
    } else if (value < 6e4) {
      ret = Math.floor(value / 1e3) + " secs";
    } else if (value < 36e5) {
      ret = Math.floor(value / 6e4) + " mins";
    } else if (value < 864e5) {
      ret = Math.floor(value / 36e5 * 10) / 10 + " hours";
    } else if (value < 2628e6) {
      ret = Math.floor(value / 864e5 * 10) / 10 + " days";
    } else if (value < 31536e6) {
      ret = Math.floor(value / 2628e6 * 10) / 10 + " months";
    } else {
      ret = Math.floor(value / 31536e5) / 10 + " years";
    }
    return ret;
  }
  date(dateStr) {
    if (dateStr === "" || dateStr == null || typeof dateStr === "object" && !dateStr.getMonth) return "";
    let d1 = new Date(dateStr);
    if (this.isInt(dateStr)) d1 = new Date(Number(dateStr));
    if (String(d1) === "Invalid Date") return "";
    const months = this.settings.shortmonths;
    const d2 = /* @__PURE__ */ new Date();
    const d3 = /* @__PURE__ */ new Date();
    d3.setTime(d3.getTime() - 864e5);
    const dd1 = months[d1.getMonth()] + " " + d1.getDate() + ", " + d1.getFullYear();
    const dd2 = months[d2.getMonth()] + " " + d2.getDate() + ", " + d2.getFullYear();
    const dd3 = months[d3.getMonth()] + " " + d3.getDate() + ", " + d3.getFullYear();
    const time = d1.getHours() - (d1.getHours() > 12 ? 12 : 0) + ":" + (d1.getMinutes() < 10 ? "0" : "") + d1.getMinutes() + " " + (d1.getHours() >= 12 ? "pm" : "am");
    const time2 = d1.getHours() - (d1.getHours() > 12 ? 12 : 0) + ":" + (d1.getMinutes() < 10 ? "0" : "") + d1.getMinutes() + ":" + (d1.getSeconds() < 10 ? "0" : "") + d1.getSeconds() + " " + (d1.getHours() >= 12 ? "pm" : "am");
    let dsp = dd1;
    if (dd1 === dd2) dsp = time;
    if (dd1 === dd3) dsp = this.lang("Yesterday");
    return '<span title="' + dd1 + " " + time2 + '">' + dsp + "</span>";
  }
  formatSize(sizeStr) {
    if (!this.isFloat(sizeStr) || sizeStr === "") return "";
    const num = parseFloat(String(sizeStr));
    if (num === 0) return 0;
    const sizes = ["Bt", "KB", "MB", "GB", "TB", "PB", "EB", "ZB"];
    const i = parseInt(String(Math.floor(Math.log(num) / Math.log(1024))));
    return (Math.floor(num / Math.pow(1024, i) * 10) / 10).toFixed(i === 0 ? 0 : 1) + " " + (sizes[i] || "??");
  }
  formatNumber(val, fraction, useGrouping) {
    if (val == null || val === "" || typeof val === "object") return "";
    const options = {
      minimumFractionDigits: fraction != null ? parseInt(String(fraction)) : void 0,
      maximumFractionDigits: fraction != null ? parseInt(String(fraction)) : void 0,
      useGrouping: !!useGrouping
    };
    if (fraction == null || Number(fraction) < 0) {
      options.minimumFractionDigits = 0;
      options.maximumFractionDigits = 20;
    }
    return parseFloat(String(val)).toLocaleString(this.settings.locale, options);
  }
  formatDate(dateStr, format) {
    if (!format) format = this.settings.dateFormat;
    if (dateStr === "" || dateStr == null || typeof dateStr === "object" && !dateStr.getMonth) return "";
    let dt = new Date(dateStr);
    if (this.isInt(dateStr)) dt = new Date(Number(dateStr));
    if (String(dt) === "Invalid Date") return "";
    const year = dt.getFullYear();
    const month = dt.getMonth();
    const date = dt.getDate();
    return format.toLowerCase().replace("month", this.settings.fullmonths[month] ?? "").replace("mon", this.settings.shortmonths[month] ?? "").replace(/yyyy/g, ("000" + year).slice(-4)).replace(/yyy/g, ("000" + year).slice(-4)).replace(/yy/g, ("0" + year).slice(-2)).replace(/(^|[^a-z$])y/g, "$1" + year).replace(/mm/g, ("0" + (month + 1)).slice(-2)).replace(/dd/g, ("0" + date).slice(-2)).replace(/th/g, date == 1 ? "st" : "th").replace(/th/g, date == 2 ? "nd" : "th").replace(/th/g, date == 3 ? "rd" : "th").replace(/(^|[^a-z$])m/g, "$1" + (month + 1)).replace(/(^|[^a-z$])d/g, "$1" + date);
  }
  formatTime(dateStr, format) {
    if (!format) format = this.settings.timeFormat;
    if (dateStr === "" || dateStr == null || typeof dateStr === "object" && !dateStr.getMonth) return "";
    let dt = new Date(dateStr);
    if (this.isInt(dateStr)) dt = new Date(Number(dateStr));
    if (this.isTime(dateStr)) {
      const tmp = this.isTime(dateStr, true);
      dt = /* @__PURE__ */ new Date();
      dt.setHours(tmp.hours);
      dt.setMinutes(tmp.minutes);
    }
    if (String(dt) === "Invalid Date") return "";
    if (format == "h12") format = "hh:mi pm";
    let type = "am";
    let hour = dt.getHours();
    const h24 = dt.getHours();
    let min = dt.getMinutes();
    let sec = dt.getSeconds();
    if (min < 10) min = "0" + min;
    if (sec < 10) sec = "0" + sec;
    if (format.indexOf("am") !== -1 || format.indexOf("pm") !== -1) {
      if (hour >= 12) type = "pm";
      if (hour > 12) hour = hour - 12;
      if (hour === 0) hour = 12;
    }
    const hourStr = String(hour);
    const minStr = String(min);
    const secStr = String(sec);
    const h24Str = String(h24);
    return format.toLowerCase().replace("am", type).replace("pm", type).replace("hhh", Number(hour) < 10 ? "0" + hourStr : hourStr).replace("hh24", h24 < 10 ? "0" + h24Str : h24Str).replace("h24", h24Str).replace("hh", hourStr).replace("mm", minStr).replace("mi", minStr).replace("ss", secStr).replace(/(^|[^a-z$])h/g, "$1" + hourStr).replace(/(^|[^a-z$])m/g, "$1" + minStr).replace(/(^|[^a-z$])s/g, "$1" + secStr);
  }
  formatDateTime(dateStr, format) {
    let fmt;
    if (dateStr === "" || dateStr == null || typeof dateStr === "object" && !dateStr.getMonth) return "";
    if (typeof format !== "string") {
      fmt = [this.settings.dateFormat, this.settings.timeFormat];
    } else {
      fmt = format.split("|");
      if (fmt[0] != null) fmt[0] = fmt[0].trim();
      fmt[1] = fmt.length > 1 ? (fmt[1] ?? "").trim() : this.settings.timeFormat;
    }
    if (fmt[1] === "h12") fmt[1] = "h:m pm";
    if (fmt[1] === "h24") fmt[1] = "h24:m";
    return this.formatDate(dateStr, fmt[0]) + " " + this.formatTime(dateStr, fmt[1]);
  }
  stripSpaces(html) {
    if (html == null) return html;
    switch (typeof html) {
      case "number":
        break;
      case "string":
        html = String(html).replace(/(?:\r\n|\r|\n)/g, " ").replace(/\s\s+/g, " ").trim();
        break;
      case "object":
        if (Array.isArray(html)) {
          const arr = this.extend([], html);
          arr.forEach((key, ind) => {
            arr[ind] = this.stripSpaces(key);
          });
          return arr;
        } else {
          const obj = this.extend({}, html);
          Object.keys(obj).forEach((key) => {
            obj[key] = this.stripSpaces(obj[key]);
          });
          return obj;
        }
    }
    return html;
  }
  stripTags(html) {
    if (html == null) return html;
    switch (typeof html) {
      case "number":
        break;
      case "string":
        html = String(html).replace(/<(?:[^>=]|='[^']*'|="[^"]*"|=[^'"][^\s>]*)*>/ig, "");
        break;
      case "object":
        if (Array.isArray(html)) {
          const arr = this.extend([], html);
          arr.forEach((key, ind) => {
            arr[ind] = this.stripTags(key);
          });
          return arr;
        } else {
          const obj = this.extend({}, html);
          Object.keys(obj).forEach((key) => {
            obj[key] = this.stripTags(obj[key]);
          });
          return obj;
        }
    }
    return html;
  }
  encodeTags(html) {
    if (html == null) return html;
    switch (typeof html) {
      case "number":
        break;
      case "string":
        html = String(html).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
        break;
      case "object":
        if (Array.isArray(html)) {
          const arr = this.extend([], html);
          arr.forEach((key, ind) => {
            arr[ind] = this.encodeTags(key);
          });
          return arr;
        } else {
          const obj = this.extend({}, html);
          Object.keys(obj).forEach((key) => {
            obj[key] = this.encodeTags(obj[key]);
          });
          return obj;
        }
    }
    return html;
  }
  decodeTags(html) {
    if (html == null) return html;
    switch (typeof html) {
      case "number":
        break;
      case "string":
        html = String(html).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
        break;
      case "object":
        if (Array.isArray(html)) {
          const arr = this.extend([], html);
          arr.forEach((key, ind) => {
            arr[ind] = this.decodeTags(key);
          });
          return arr;
        } else {
          const obj = this.extend({}, html);
          Object.keys(obj).forEach((key) => {
            obj[key] = this.decodeTags(obj[key]);
          });
          return obj;
        }
    }
    return html;
  }
  escapeId(id) {
    if (id === "" || id == null) return "";
    const re = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g;
    return (id + "").replace(re, (ch, asCodePoint) => {
      if (asCodePoint) {
        if (ch === "\0") return "\uFFFD";
        return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
      }
      return "\\" + ch;
    });
  }
  unescapeId(id) {
    if (id === "" || id == null) return "";
    const re = /\\[\da-fA-F]{1,6}[\x20\t\r\n\f]?|\\([^\r\n\f])/g;
    return id.replace(re, (escape, nonHex) => {
      const high = parseInt("0x" + escape.slice(1), 16) - 65536;
      return nonHex ? nonHex : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
    });
  }
  base64encode(str) {
    const utf8Bytes = new TextEncoder().encode(str);
    let binaryString = "";
    for (const byte of utf8Bytes) {
      binaryString += String.fromCharCode(byte);
    }
    return btoa(binaryString);
  }
  base64decode(encodedStr) {
    const binaryString = atob(encodedStr);
    const utf8Bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      utf8Bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder().decode(utf8Bytes);
  }
  async sha256(str) {
    const utf8 = new TextEncoder().encode(str);
    return crypto.subtle.digest("SHA-256", utf8).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((bytes) => bytes.toString(16).padStart(2, "0")).join("");
    });
  }
  transition(div_old, div_new, type, callBack) {
    return new Promise((resolve, _reject) => {
      const styles = getComputedStyle(div_old);
      const width = parseInt(styles.width);
      const height = parseInt(styles.height);
      const time = 0.5;
      if (!div_old || !div_new) {
        console.log("ERROR: Cannot do transition when one of the divs is null");
        return;
      }
      ;
      div_old.parentNode.style.cssText += "perspective: 900px; overflow: hidden;";
      div_old.style.cssText += "; position: absolute; z-index: 1019; backface-visibility: hidden";
      div_new.style.cssText += "; position: absolute; z-index: 1020; backface-visibility: hidden";
      switch (type) {
        case "slide-left":
          div_old.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)";
          div_new.style.cssText += "overflow: hidden; transform: translate3d(" + width + "px, 0, 0)";
          query2(div_new).show();
          setTimeout(() => {
            div_new.style.cssText += "transition: " + time + "s; transform: translate3d(0, 0, 0)";
            div_old.style.cssText += "transition: " + time + "s; transform: translate3d(-" + width + "px, 0, 0)";
          }, 1);
          break;
        case "slide-right":
          div_old.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)";
          div_new.style.cssText += "overflow: hidden; transform: translate3d(-" + width + "px, 0, 0)";
          query2(div_new).show();
          setTimeout(() => {
            div_new.style.cssText += "transition: " + time + "s; transform: translate3d(0px, 0, 0)";
            div_old.style.cssText += "transition: " + time + "s; transform: translate3d(" + width + "px, 0, 0)";
          }, 1);
          break;
        case "slide-down":
          div_old.style.cssText += "overflow: hidden; z-index: 1; transform: translate3d(0, 0, 0)";
          div_new.style.cssText += "overflow: hidden; z-index: 0; transform: translate3d(0, 0, 0)";
          query2(div_new).show();
          setTimeout(() => {
            div_new.style.cssText += "transition: " + time + "s; transform: translate3d(0, 0, 0)";
            div_old.style.cssText += "transition: " + time + "s; transform: translate3d(0, " + height + "px, 0)";
          }, 1);
          break;
        case "slide-up":
          div_old.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)";
          div_new.style.cssText += "overflow: hidden; transform: translate3d(0, " + height + "px, 0)";
          query2(div_new).show();
          setTimeout(() => {
            div_new.style.cssText += "transition: " + time + "s; transform: translate3d(0, 0, 0)";
            div_old.style.cssText += "transition: " + time + "s; transform: translate3d(0, 0, 0)";
          }, 1);
          break;
        case "flip-left":
          div_old.style.cssText += "overflow: hidden; transform: rotateY(0deg)";
          div_new.style.cssText += "overflow: hidden; transform: rotateY(-180deg)";
          query2(div_new).show();
          setTimeout(() => {
            div_new.style.cssText += "transition: " + time + "s; transform: rotateY(0deg)";
            div_old.style.cssText += "transition: " + time + "s; transform: rotateY(180deg)";
          }, 1);
          break;
        case "flip-right":
          div_old.style.cssText += "overflow: hidden; transform: rotateY(0deg)";
          div_new.style.cssText += "overflow: hidden; transform: rotateY(180deg)";
          query2(div_new).show();
          setTimeout(() => {
            div_new.style.cssText += "transition: " + time + "s; transform: rotateY(0deg)";
            div_old.style.cssText += "transition: " + time + "s; transform: rotateY(-180deg)";
          }, 1);
          break;
        case "flip-down":
          div_old.style.cssText += "overflow: hidden; transform: rotateX(0deg)";
          div_new.style.cssText += "overflow: hidden; transform: rotateX(180deg)";
          query2(div_new).show();
          setTimeout(() => {
            div_new.style.cssText += "transition: " + time + "s; transform: rotateX(0deg)";
            div_old.style.cssText += "transition: " + time + "s; transform: rotateX(-180deg)";
          }, 1);
          break;
        case "flip-up":
          div_old.style.cssText += "overflow: hidden; transform: rotateX(0deg)";
          div_new.style.cssText += "overflow: hidden; transform: rotateX(-180deg)";
          query2(div_new).show();
          setTimeout(() => {
            div_new.style.cssText += "transition: " + time + "s; transform: rotateX(0deg)";
            div_old.style.cssText += "transition: " + time + "s; transform: rotateX(180deg)";
          }, 1);
          break;
        case "pop-in":
          div_old.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)";
          div_new.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(.8); opacity: 0;";
          query2(div_new).show();
          setTimeout(() => {
            div_new.style.cssText += "transition: " + time + "s; transform: scale(1); opacity: 1;";
            div_old.style.cssText += "transition: " + time + "s;";
          }, 1);
          break;
        case "pop-out":
          div_old.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(1); opacity: 1;";
          div_new.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); opacity: 0;";
          query2(div_new).show();
          setTimeout(() => {
            div_new.style.cssText += "transition: " + time + "s; opacity: 1;";
            div_old.style.cssText += "transition: " + time + "s; transform: scale(1.7); opacity: 0;";
          }, 1);
          break;
        default:
          div_old.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)";
          div_new.style.cssText += "overflow: hidden; translate3d(0, 0, 0); opacity: 0;";
          query2(div_new).show();
          setTimeout(() => {
            div_new.style.cssText += "transition: " + time + "s; opacity: 1;";
            div_old.style.cssText += "transition: " + time + "s";
          }, 1);
          break;
      }
      setTimeout(() => {
        if (type === "slide-down") {
          query2(div_old).css("z-index", "1019");
          query2(div_new).css("z-index", "1020");
        }
        if (div_new) {
          ;
          query2(div_new).css({ "opacity": "1" }).css({ "transition": "", "transform": "" });
        }
        if (div_old) {
          ;
          query2(div_old).css({ "opacity": "1" }).css({ "transition": "", "transform": "" });
        }
        if (typeof callBack === "function") callBack();
        resolve();
      }, time * 1e3);
    });
  }
  lock(box, options = {}, ...rest) {
    if (box == null) return;
    let opts = typeof options === "string" ? { msg: options } : { ...options };
    if (rest[0] != null) {
      opts.spinner = rest[0];
    }
    opts = this.extend({ spinner: false }, opts);
    let boxSel = box;
    if (box?.[0] instanceof Node) {
      boxSel = Array.isArray(box) ? box : box.get();
    }
    if (!opts.msg && opts.msg !== 0) opts.msg = "";
    this.unlock(boxSel);
    const el = query2(boxSel).get(0);
    const pWidth = el.scrollWidth;
    const pHeight = el.scrollHeight;
    let style = `height: ${pHeight}px; width: ${pWidth}px`;
    if (el.tagName == "BODY") {
      style = "position: fixed; right: 0; bottom: 0;";
    }
    query2(boxSel).prepend(
      `<div class="w2ui-lock" style="${style}"></div><div class="w2ui-lock-msg"></div>`
    );
    const $lock = query2(boxSel).find(".w2ui-lock");
    const $mess = query2(boxSel).find(".w2ui-lock-msg");
    if (!opts.msg) {
      $mess.css({
        "background-color": "transparent",
        "background-image": "none",
        "border": "0px",
        "box-shadow": "none"
      });
    }
    if (opts.spinner === true) {
      opts.msg = `<div class="w2ui-spinner" ${!opts.msg ? 'style="width: 35px; height: 35px"' : ""}></div>` + opts.msg;
    }
    if (opts.msg) {
      ;
      $mess.html(String(opts.msg)).css("display", "block");
    } else {
      $mess.remove();
    }
    if (opts.opacity != null) {
      $lock.css("opacity", String(opts.opacity));
    }
    $lock.css({ display: "block" });
    if (opts.bgColor) {
      $lock.css({ "background-color": opts.bgColor });
    }
    const styles = getComputedStyle($lock.get(0));
    const opacity = styles.opacity ?? 0.15;
    $lock.on("mousedown", function() {
      if (typeof opts.onClick == "function") {
        opts.onClick();
      } else {
        $lock.css({
          "transition": ".2s",
          "opacity": String(Number(opacity) * 1.5)
        });
      }
    }).on("mouseup", function() {
      if (typeof opts.onClick !== "function") {
        $lock.css({
          "transition": ".2s",
          "opacity": String(opacity)
        });
      }
    }).on("mousewheel", function(event2) {
      if (event2) {
        event2.stopPropagation();
        event2.preventDefault();
      }
    });
  }
  unlock(box, speed) {
    if (box == null) return;
    const prevBox = box;
    clearTimeout(prevBox["_prevUnlock"]);
    let boxSel = box;
    if (box?.[0] instanceof Node) {
      boxSel = Array.isArray(box) ? box : box.get();
    }
    if (this.isInt(speed) && (speed ?? 0) > 0) {
      query2(boxSel).find(".w2ui-lock").css({
        transition: (speed ?? 0) / 1e3 + "s",
        opacity: 0
      });
      const _box = query2(boxSel).get(0);
      clearTimeout(_box["_prevUnlock"]);
      _box["_prevUnlock"] = setTimeout(() => {
        query2(boxSel).find(".w2ui-lock").remove();
      }, speed);
      query2(boxSel).find(".w2ui-lock-msg").remove();
    } else {
      query2(boxSel).find(".w2ui-lock").remove();
      query2(boxSel).find(".w2ui-lock-msg").remove();
    }
  }
  /**
   * Opens a context message, similar in parameters as w2popup.open()
   *
   * Sample Calls
   * w2utils.message({ box: '#div', text: 'message' }).ok(() => {})
   * w2utils.message({ box: '#div', text: 'message', width: 300 }).ok(() => {})
   * w2utils.message({ box: '#div', text: 'message', actions: ['Save'] }).Save(() => {})
   *
   * Used in w2grid, w2form, w2layout (should be in w2popup too)
   * should be called with .call(...) method
   *
   * @param where = {
   *      box,     // where to open
   *      after,   // title if any, adds title heights
   *      param    // additional parameters, used in layouts for panel
   * }
   * @param options {
   *      width,      // (int), width in px, if negative, then it is maxWidth - width
   *      height,     // (int), height in px, if negative, then it is maxHeight - height
   *      text,       // centered text
   *      body,       // body of the message
   *      buttons,    // buttons of the message
   *      html,       // if body & buttons are not defined, then html is the entire message
   *      focus,      // int or id with a selector, default is 0
   *      hideOn,     // ['esc', 'click'], default is ['esc']
   *      actions,    // array of actions (only if buttons is not defined)
   *      onOpen,     // event when opened
   *      onClose,    // event when closed
   *      onAction,   // event on action
   * }
   */
  message(where, options) {
    let closeTimer, openTimer, edata;
    let msgBase = {};
    const removeLast = () => {
      const msgs = query2(where?.box).find(".w2ui-message");
      if (msgs.length == 0) return;
      msgBase = msgs.get(0)["_msg_options"] || {};
      if (typeof msgBase?.close == "function") {
        msgBase.close();
      }
    };
    const closeComplete = (options2) => {
      const msgBoxEl = options2["box"];
      const focus = msgBoxEl?.["_msg_prevFocus"];
      if (query2(where.box).find(".w2ui-message").length <= 1) {
        if (where.owner) {
          where.owner.unlock?.(where.param, 150);
        } else {
          this.unlock(where.box, 150);
        }
      } else {
        query2(where.box).find(`#w2ui-message-${where.owner?.name}-${options2["msgIndex"] - 1}`).css("z-index", "1500");
      }
      if (focus) {
        const msg = query2(focus).closest(".w2ui-message");
        if (msg.length > 0) {
          const opt = msg.get(0)["_msg_options"];
          opt["setFocus"](focus);
        } else {
          focus.focus();
        }
      } else {
        if (typeof where.owner?.focus == "function") where.owner.focus();
      }
      query2(options2["box"]).remove();
      if (options2["msgIndex"] === 0) {
        const tmp = options2["tmp"];
        head.css("z-index", tmp.zIndex);
        query2(where.box).css("overflow", tmp.overflow);
      }
      if (options2["trigger"]) {
        ;
        edata?.["finish"]?.();
      }
    };
    if (typeof options == "string" || typeof options == "number") {
      msgBase = {
        width: String(options).length < 300 ? 350 : 550,
        height: String(options).length < 300 ? 170 : 250,
        text: String(options)
      };
    } else if (arguments.length == 1 || options == null) {
      msgBase = where;
    } else {
      msgBase = options ?? {};
    }
    if ((msgBase.text === "" || msgBase.text == null) && (msgBase.body === "" || msgBase.body == null)) {
      removeLast();
      return;
    }
    if (msgBase.text != null) msgBase.body = `<div class="w2ui-centered w2ui-msg-text">${msgBase.text}</div>`;
    if (msgBase.width == null) msgBase.width = 350;
    if (msgBase.height == null) msgBase.height = 170;
    if (msgBase.hideOn == null) msgBase.hideOn = ["esc"];
    msgBase.cancelAction ??= "Ok";
    if (msgBase.on == null) {
      const opts = msgBase;
      msgBase = new w2base();
      w2utils.extend(msgBase, opts);
    }
    const msgOpts = msgBase;
    msgOpts["on"]("open", (event2) => {
      w2utils.bindEvents(query2(msgOpts["box"]).find(".w2ui-eaction"), msgOpts);
      const detail = event2["detail"];
      query2(detail["box"]).find("button, input, textarea, [name=hidden-first]").off(".message").on("keydown.message", function(evt) {
        const keyEvt = evt;
        if (keyEvt.keyCode == 27 && msgOpts["hideOn"].includes("esc")) {
          if (msgOpts["cancelAction"]) {
            ;
            msgOpts["action"](msgOpts["cancelAction"]);
          } else {
            ;
            msgOpts["close"]();
          }
        }
      });
      setTimeout(() => msgOpts["setFocus"](msgOpts["focus"]), 300);
    });
    msgOpts["off"](".prom");
    const prom = {
      self: msgBase,
      action(callBack) {
        ;
        msgOpts["on"]("action.prom", callBack);
        return prom;
      },
      close(callBack) {
        ;
        msgOpts["on"]("close.prom", callBack);
        return prom;
      },
      open(callBack) {
        ;
        msgOpts["on"]("open.prom", callBack);
        return prom;
      },
      then(callBack) {
        ;
        msgOpts["on"]("open:after.prom", callBack);
        return prom;
      }
    };
    if (msgBase.actions == null && msgBase.buttons == null && msgBase.html == null) {
      msgBase.actions = { Ok(event2) {
        event2["detail"]?.["self"]?.["close"]?.();
      } };
    }
    ;
    msgOpts["off"](".buttons");
    if (msgBase.actions != null) {
      msgBase.buttons = "";
      Object.keys(msgBase.actions).forEach((action) => {
        const handler = msgBase.actions[action];
        let btnAction = action;
        if (typeof handler == "function") {
          msgBase.buttons += `<button class="w2ui-btn w2ui-eaction" data-click='["action","${action}","event"]' name="${action}">${action}</button>`;
        }
        if (typeof handler == "object" && handler !== null) {
          const h = handler;
          msgBase.buttons += `<button class="w2ui-btn w2ui-eaction ${h["class"] || ""}" name="${action}" data-click='["action","${action}","event"]'
                        style="${h["style"] ?? ""}" ${h["attrs"] ?? ""}>${h["text"] || action}</button>`;
          btnAction = Array.isArray(msgBase.actions) ? String(h["text"]) : action;
        }
        if (typeof handler == "string") {
          msgBase.buttons += `<button class="w2ui-btn w2ui-eaction" name="${handler}" data-click='["action","${handler}","event"]'>${handler}</button>`;
          btnAction = handler;
        }
        if (typeof btnAction == "string") {
          btnAction = (btnAction[0] ?? "").toLowerCase() + btnAction.substr(1).replace(/\s+/g, "");
        }
        prom[btnAction] = function(callBack) {
          ;
          msgOpts["on"]("action.buttons", (event2) => {
            const detail = event2["detail"];
            const act = String(detail["action"]);
            const target = (act[0] ?? "").toLowerCase() + act.substr(1).replace(/\s+/g, "");
            if (target == btnAction) callBack(event2);
          });
          return prom;
        };
      });
    }
    ;
    ["html", "body", "buttons"].forEach((param) => {
      msgBase[param] = String(msgBase[param] ?? "").trim();
    });
    if (msgBase.body !== "" || msgBase.buttons !== "") {
      msgBase.html = `
                <div class="w2ui-message-body">${msgBase.body || ""}</div>
                <div class="w2ui-message-buttons">${msgBase.buttons || ""}</div>
            `;
    }
    let styles = getComputedStyle(query2(where.box).get(0));
    const pWidth = parseFloat(styles.width);
    const pHeight = parseFloat(styles.height);
    let titleHeight = 0;
    if (query2(where.after).length > 0) {
      styles = getComputedStyle(query2(where.after).get(0));
      titleHeight = parseInt(styles.display != "none" ? styles.height : "0");
    }
    if ((msgBase.width ?? 0) > pWidth) msgBase.width = pWidth - 10;
    if ((msgBase.height ?? 0) > pHeight - titleHeight) msgBase.height = pHeight - 10 - titleHeight;
    if (msgBase.width != null) msgBase.originalWidth = msgBase.width;
    if (msgBase.height != null) msgBase.originalHeight = msgBase.height;
    if (parseInt(String(msgBase.width)) < 0) msgBase.width = pWidth + (msgBase.width ?? 0);
    if (parseInt(String(msgBase.width)) < 10) msgBase.width = 10;
    if (parseInt(String(msgBase.height)) < 0) msgBase.height = pHeight + (msgBase.height ?? 0) - titleHeight;
    if (parseInt(String(msgBase.height)) < 10) msgBase.height = 10;
    if ((msgBase.originalHeight ?? 0) < 0) msgBase.height = pHeight + (msgBase.originalHeight ?? 0) - titleHeight;
    if ((msgBase.originalWidth ?? 0) < 0) msgBase.width = pWidth + (msgBase.originalWidth ?? 0) * 2;
    const head = query2(where.box).find(where.after);
    if (!msgBase.tmp) {
      msgBase.tmp = {
        zIndex: String(head.css("z-index")),
        overflow: styles.overflow
      };
    }
    if (msgBase.html === "" && msgBase.body === "" && msgBase.buttons === "") {
      removeLast();
    } else {
      msgBase.msgIndex = query2(where.box).find(".w2ui-message").length;
      if (msgBase.msgIndex === 0 && typeof this.lock == "function") {
        query2(where.box).css("overflow", "hidden");
        if (where.owner) {
          ;
          where.owner.lock?.(where.param);
        } else {
          this.lock(where.box);
        }
      }
      query2(where.box).find(".w2ui-message").css("z-index", "1390");
      head.css("z-index", "1501");
      const content = `
                <div id="w2ui-message-${where.owner?.name}-${msgBase.msgIndex}" class="w2ui-message" data-mousedown="stop"
                    style="z-index: 1500; left: ${(pWidth - (msgBase.width ?? 0)) / 2}px; top: ${titleHeight}px;
                        width: ${msgBase.width}px; height: ${msgBase.height}px; transform: translateY(-${msgBase.height}px)"
                    ${(msgBase.hideOn ?? []).includes("click") ? where.param ? `data-click='["message", "${where.param}"]` : 'data-click="message"' : ""}>
                    <span name="hidden-first" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
                    ${msgBase.html}
                    <span name="hidden-last" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
                </div>`;
      if (query2(where.after).length > 0) {
        query2(where.box).find(where.after).after(content);
      } else {
        query2(where.box).prepend(content);
      }
      msgBase.box = query2(where.box).find(`#w2ui-message-${where.owner?.name}-${msgBase.msgIndex}`)[0];
      w2utils.bindEvents(msgBase.box, this);
      query2(msgBase.box).addClass("animating");
      msgBase.box["_msg_options"] = msgBase;
      msgBase.box["_msg_prevFocus"] = document.activeElement;
      setTimeout(() => {
        edata = msgOpts["trigger"]("open", { target: this["name"], box: msgBase.box, self: msgBase });
        const edataR = edata;
        if (edataR["isCancelled"] === true) {
          query2(where.box).find(`#w2ui-message-${where.owner?.name}-${msgBase.msgIndex}`).remove();
          if (msgBase.msgIndex === 0) {
            head.css("z-index", msgBase.tmp.zIndex);
            query2(where.box).css("overflow", msgBase.tmp.overflow);
          }
          return;
        }
        query2(msgBase.box).css({
          transition: "0.3s",
          transform: "translateY(0px)"
        });
      }, 0);
      openTimer = setTimeout(() => {
        query2(where.box).find(`#w2ui-message-${where.owner?.name}-${msgBase.msgIndex}`).removeClass("animating").css({ "transition": "0s" });
        edata?.["finish"]?.();
      }, 300);
    }
    msgBase.action = (action, event2) => {
      let click = msgBase.actions?.[action];
      if (click instanceof Object && click["onClick"]) click = click["onClick"];
      const edata2 = msgOpts["trigger"]("action", {
        target: this["name"],
        action,
        self: msgBase,
        originalEvent: event2,
        value: msgBase.input ? msgBase.input.value : null
      });
      const edataR = edata2;
      if (edataR["isCancelled"] === true) return;
      if (typeof click === "function") click(edata2);
      edataR["finish"]?.();
    };
    msgBase.close = () => {
      edata = msgOpts["trigger"]("close", { target: "self", box: msgBase.box, self: msgBase });
      const edataR = edata;
      if (edataR["isCancelled"] === true) return;
      clearTimeout(openTimer);
      if (query2(msgBase.box).hasClass("animating")) {
        clearTimeout(closeTimer);
        closeComplete(msgOpts);
        return;
      }
      query2(msgBase.box).addClass("w2ui-closing animating").css({
        "transition": "0.15s",
        "transform": "translateY(-" + msgBase.height + "px)"
      });
      if ((msgBase.msgIndex ?? 0) !== 0) {
        query2(where.box).find(`#w2ui-message-${where.owner?.name}-${(msgBase.msgIndex ?? 1) - 1}`).css("z-index", "1499");
      }
      closeTimer = setTimeout(() => {
        closeComplete(msgOpts);
      }, 150);
    };
    msgBase.setFocus = (focus) => {
      const cnt = query2(where.box).find(".w2ui-message").length - 1;
      const box = query2(where.box).find(`#w2ui-message-${where.owner?.name}-${cnt}`);
      const sel = "input, button, select, textarea, [contentEditable], .w2ui-input";
      if (focus != null) {
        const el = typeof focus === "string" ? box.find(sel).filter(focus).get(0) : box.find(sel).get(focus);
        el?.focus();
      } else {
        box.find("[name=hidden-first]").get(0)?.focus();
      }
      query2(where.box).find(".w2ui-message").find(sel + ",[name=hidden-first],[name=hidden-last]").off(".keep-focus");
      query2(box).find(sel + ",[name=hidden-first],[name=hidden-last]").on("blur.keep-focus", function(_event) {
        setTimeout(() => {
          const focus2 = document.activeElement;
          const inside = focus2 != null && query2(box).find(sel).filter(focus2).length > 0;
          const name = query2(focus2).attr("name");
          if (!inside && focus2 && focus2 !== document.body) {
            query2(box).find(sel).get(0)?.focus();
          }
          if (name == "hidden-last") {
            query2(box).find(sel).get(0)?.focus();
          }
          if (name == "hidden-first") {
            query2(box).find(sel).get(-1)?.focus();
          }
        }, 1);
      });
    };
    return prom;
  }
  alert(where, options) {
    return this.message(where, options);
  }
  /**
   * Shows a prompt as a context message. It will use same where: { box: ... } as w2utils.message() function
   * but it will have options similar to w2prompt dialog
   *
   * Example:
   *  - w2utils.conrirm({
   *       box: '#custom',
   *       text: 'Some message'
   *    })
   *    .yes(event => console.log(event))
   */
  confirm(where, options) {
    let msgOpts = {};
    if (["string", "number"].includes(typeof options)) {
      msgOpts = { text: options };
    } else if (arguments.length == 1) {
      msgOpts = where;
    } else {
      msgOpts = options ?? {};
    }
    w2utils.normButtons(msgOpts, { yes: "Yes", no: "No" });
    msgOpts["cancelAction"] ??= "No";
    const prom = w2utils.message(where, msgOpts);
    if (prom) {
      prom.action((event2) => {
        const d = event2["detail"];
        const self = d?.["self"];
        self?.["close"]?.();
      });
    }
    return prom;
  }
  /**
   * Shows a prompt as a context message. It will use same where: { box: ... } as w2utils.message() function
   * but it will have options similar to w2prompt dialog
   *
   * Example:
   *  - w2utils.prompt({
   *       box: '#custom',
   *       label: 'Enter Name',
   *       textarea: false,
   *       attrs: 'style="border: 1px solid red"'
   *    })
   *    .ok(event => console.log(event))
   */
  prompt(where, options) {
    let msgOpts = {};
    if (["string", "number"].includes(typeof options)) {
      msgOpts = { label: options };
    } else if (arguments.length == 1) {
      msgOpts = where;
    } else {
      msgOpts = options ?? {};
    }
    msgOpts["cancelAction"] ??= "Cancel";
    if (msgOpts["label"]) {
      msgOpts["focus"] = 0;
      msgOpts["body"] = msgOpts["textarea"] ? `<div class="w2ui-prompt textarea">
                     <div>${msgOpts["label"]}</div>
                     <textarea id="w2prompt" class="w2ui-input" ${msgOpts["attrs"] ?? ""}
                        data-keydown="keydown|event" data-keyup="change|event"></textarea>
                   </div>` : `<div class="w2ui-prompt w2ui-centered">
                     <label>${msgOpts["label"]}&nbsp;</label>
                     <input id="w2prompt" class="w2ui-input" ${msgOpts["attrs"] ?? ""}
                        data-keydown="keydown|event" data-keyup="change|event">
                   </div>`;
    }
    w2utils.normButtons(msgOpts, { ok: w2utils.lang("Ok"), cancel: w2utils.lang("Cancel") });
    const prom = w2utils.message(where, msgOpts);
    if (prom) {
      prom.change = function(callBack) {
        const selfR = prom.self;
        selfR?.["on"]?.("change.prom", callBack);
        return prom;
      };
      prom.action((event2) => {
        const d = event2["detail"];
        const self = d?.["self"];
        self?.["close"]?.();
      }).then((event2) => {
        const d = event2["detail"];
        (d?.["self"])["input"] = query2(d?.["box"]).find("#w2prompt").get(0);
        query2(d?.["box"]).find("#w2prompt").on("keydown", (evt) => {
          if (evt.keyCode == 13 && evt.shiftKey === false) {
            evt.preventDefault();
          }
        }).on("keyup", (evt) => {
          const self = d?.["self"];
          const edata = self?.["trigger"]?.("change", { value: evt.target.value, input: evt.target, originalEvent: evt });
          if (evt.keyCode == 13 && evt.shiftKey === false) {
            ;
            self?.["action"]?.("Ok", evt);
          }
          ;
          edata?.["finish"]?.();
        });
      });
    }
    return prom;
  }
  /**
   * Normalizes yes, no buttons for confirmation dialog
   *
   * @param {*} options
   * @returns  options
   */
  normButtons(options, btn) {
    options["actions"] = options["actions"] ?? {};
    const btns = Object.keys(btn);
    btns.forEach((name) => {
      const action = options["btn_" + name];
      if (action) {
        btn[name] = {
          text: w2utils.lang(String(action["text"] ?? btn[name] ?? "")),
          class: action["class"] ?? "",
          style: action["style"] ?? "",
          attrs: action["attrs"] ?? ""
        };
        delete options["btn_" + name];
      }
      ;
      ["text", "class", "style", "attrs"].forEach((suffix) => {
        if (options[name + "_" + suffix]) {
          if (typeof btn[name] == "string") {
            btn[name] = { text: btn[name] };
          }
          ;
          btn[name][suffix] = options[name + "_" + suffix];
          delete options[name + "_" + suffix];
        }
      });
    });
    if (btns.includes("yes") && btns.includes("no")) {
      if (w2utils.settings.macButtonOrder) {
        w2utils.extend(options["actions"], { no: btn["no"], yes: btn["yes"] });
      } else {
        w2utils.extend(options["actions"], { yes: btn["yes"], no: btn["no"] });
      }
    }
    if (btns.includes("ok") && btns.includes("cancel")) {
      if (w2utils.settings.macButtonOrder) {
        w2utils.extend(options["actions"], { cancel: btn["cancel"], ok: btn["ok"] });
      } else {
        w2utils.extend(options["actions"], { ok: btn["ok"], cancel: btn["cancel"] });
      }
    }
    return options;
  }
  /**
   * Shows small notification message at the bottom of the page, or containter that you specify
   * in options.where (could be element or a selector)
   *
   * w2utils.notify('Document saved')
   * w2utils.notify('Mesage sent ${udon}', { actions: { undo: function () {...} }})
   *
   * @param {String/Object} options can be {
   *      text: string,       // message, can be html
   *      where: el/selector, // element or selector where to show, default is document.body
   *      timeout: int,       // timeout when to hide, if 0 - indefinite
   *      error: boolean,     // add error clases
   *      class: string,      // additional class strings
   *      actions: object     // object with action functions, it should correspot to templated text: '... ${action} ...'
   *  }
   * @returns promise
   */
  notify(text, options) {
    return new Promise((resolve) => {
      let opts = options ?? {};
      let textStr = "";
      if (typeof text == "object") {
        opts = text;
        textStr = String(opts["text"] ?? "");
      } else {
        textStr = String(text ?? "");
      }
      opts["where"] ??= document.body;
      opts["timeout"] ??= 15e3;
      if (typeof this.tmp["notify_resolve"] == "function") {
        ;
        this.tmp["notify_resolve"]();
        query2(this.tmp["notify_where"]).find("#w2ui-notify").remove();
      }
      this.tmp["notify_resolve"] = resolve;
      this.tmp["notify_where"] = opts["where"];
      clearTimeout(this.tmp["notify_timer"]);
      if (textStr) {
        if (typeof opts["actions"] == "object") {
          const actions = {};
          Object.keys(opts["actions"]).forEach((action) => {
            actions[action] = `<a class="w2ui-notify-link" value="${action}">${action}</a>`;
          });
          textStr = this.execTemplate(textStr, actions);
        }
        const html = `
                    <div id="w2ui-notify" style="${opts["where"] == document.body ? "position: fixed" : ""}">
                        <div class="${opts["class"] ?? ""} ${opts["error"] ? "w2ui-notify-error" : ""} ${opts["success"] ? "w2ui-notify-success" : ""}">
                            ${textStr}
                            <span class="w2ui-notify-close w2ui-icon-cross"></span>
                        </div>
                    </div>`;
        query2(opts["where"]).append(html);
        query2(opts["where"]).find("#w2ui-notify").find(".w2ui-notify-close").on("click", (_event) => {
          query2(opts["where"]).find("#w2ui-notify").remove();
          resolve();
        });
        if (opts["actions"]) {
          query2(opts["where"]).find("#w2ui-notify .w2ui-notify-link").on("click", (event2) => {
            const value = query2(event2.target).attr("value") ?? "";
            opts["actions"][value]();
            query2(opts["where"]).find("#w2ui-notify").remove();
            resolve();
          });
        }
        if (opts["timeout"] > 0) {
          this.tmp["notify_timer"] = setTimeout(() => {
            query2(opts["where"]).find("#w2ui-notify").remove();
            resolve();
          }, opts["timeout"]);
        }
      }
    });
  }
  getSize(el, type) {
    const $el = query2(el);
    let ret = 0;
    if ($el.length > 0) {
      const styles = getComputedStyle($el[0]);
      switch (type) {
        case "width":
          ret = parseFloat(styles.width);
          if (styles.width === "auto") ret = 0;
          break;
        case "height":
          ret = parseFloat(styles.height);
          if (styles.height === "auto") ret = 0;
          break;
        default:
          ret = parseFloat(String(styles[type] ?? "")) || 0;
          break;
      }
    }
    return ret;
  }
  getStrDimentions(str, styles, raw) {
    let div = query2("body > #_tmp_width");
    if (div.length === 0) {
      query2("body").append('<div id="_tmp_width" style="position: absolute; top: -9000px;"></div>');
      div = query2("body > #_tmp_width");
    }
    if (raw === void 0 && str.trim().startsWith("<") && str.trim().endsWith(">")) {
      raw = true;
    }
    ;
    div.html(raw ? str : this.encodeTags(str ?? "")).attr("style", `position: absolute; top: -9000px; ${styles || ""}`);
    const width = div[0].clientWidth;
    const height = div[0].clientHeight;
    div.html("");
    return { width, height };
  }
  getStrWidth(str, styles, raw) {
    return this.getStrDimentions(str, styles, raw).width;
  }
  getStrHeight(str, styles, raw) {
    return this.getStrDimentions(str, styles, raw).height;
  }
  execTemplate(str, replace_obj) {
    if (typeof str !== "string" || !replace_obj || typeof replace_obj !== "object") {
      return str;
    }
    return str.replace(/\${([^}]+)?}/g, function(_$1, $2) {
      return replace_obj[$2] || $2;
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  marker(el, items, options = { onlyFirst: false, wholeWord: false, isRegex: false }) {
    options.tag ??= "span";
    options.class ??= "w2ui-marker";
    options.raplace = (matched) => `<${options.tag} class="${options.class}">${matched}</${options.tag}>`;
    const isRegexSearch = options.isRegex || false;
    if (!Array.isArray(items)) {
      if (items != null && items !== "") {
        items = [items];
      } else {
        items = [];
      }
    }
    if (typeof el == "string") {
      _clearMerkers(el);
      items.forEach((item) => {
        if (isRegexSearch) {
          try {
            const flags = "i" + (!options.onlyFirst ? "g" : "");
            const regex = new RegExp(item, flags);
            el = el.replace(regex, options.raplace);
          } catch (e) {
            console.error("Invalid regular expression:", e);
            el = _replace(el, item, options.raplace);
          }
        } else {
          el = _replace(el, item, options.raplace);
        }
      });
    } else {
      query2(el).each((el2) => {
        _clearMerkers(el2);
        if (isRegexSearch) {
          items.forEach((pattern) => {
            try {
              let getTextNodes2 = function(node) {
                if (node.nodeType === 3) {
                  textNodes.push(node);
                } else if (node.nodeType === 1) {
                  if (node.tagName !== "SCRIPT" && node.tagName !== "STYLE") {
                    for (let i = 0; i < node.childNodes.length; i++) {
                      getTextNodes2(node.childNodes[i]);
                    }
                  }
                }
              };
              var getTextNodes = getTextNodes2;
              let flags = "i";
              if (!options.onlyFirst) {
                flags += "g";
              }
              if (options.wholeWord) {
                pattern = "\b" + pattern + "\b";
              }
              const regex = new RegExp(pattern, flags);
              const textNodes = [];
              getTextNodes2(el2);
              textNodes.forEach((textNode) => {
                const text = textNode.nodeValue;
                const matches = [];
                let match;
                if (options.onlyFirst) {
                  match = regex.exec(text);
                  if (match) matches.push({
                    index: match.index,
                    text: match[0]
                  });
                } else {
                  while ((match = regex.exec(text)) !== null) {
                    matches.push({
                      index: match.index,
                      text: match[0]
                    });
                  }
                }
                if (matches.length > 0) {
                  const parent = textNode.parentNode;
                  const fragment = document.createDocumentFragment();
                  let lastIndex = 0;
                  matches.forEach((match2) => {
                    if (match2.index > lastIndex) {
                      fragment.appendChild(document.createTextNode(
                        text.substring(lastIndex, match2.index)
                      ));
                    }
                    const span = document.createElement(options.tag);
                    span.className = options.class;
                    span.appendChild(document.createTextNode(match2.text));
                    fragment.appendChild(span);
                    lastIndex = match2.index + match2.text.length;
                  });
                  if (lastIndex < text.length) {
                    fragment.appendChild(document.createTextNode(
                      text.substring(lastIndex)
                    ));
                  }
                  parent.replaceChild(fragment, textNode);
                }
              });
            } catch (e) {
              console.error("Invalid regular expression:", e);
              el2.innerHTML = _replace(el2.innerHTML, pattern, options.raplace);
            }
          });
        } else {
          items.forEach((item) => {
            ;
            el2.innerHTML = _replace(el2.innerHTML, item, options.raplace);
          });
        }
      });
    }
    return el;
    function _replace(html, term, replaceWith) {
      const ww = options.wholeWord;
      if (typeof term !== "string") term = String(term);
      term = term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").replace(/&/g, "&amp;").replace(/</g, "&gt;").replace(/>/g, "&lt;");
      const regex = new RegExp((ww ? "\\b" : "") + term + (ww ? "\\b" : "") + "(?![^<]*>)", "i" + (!options.onlyFirst ? "g" : ""));
      return html = html.replace(regex, replaceWith);
    }
    function _clearMerkers(el2) {
      const markerRE = new RegExp(`<${options.tag}[^>]*class=["']${options.class.replace(/-/g, "\\-")}["'][^>]*>([\\s\\S]*?)<\\/${options.tag}>`, "ig");
      if (typeof el2 == "string") {
        while (el2.indexOf(`<${options.tag} class="${options.class}"`) !== -1) {
          el2 = el2.replace(markerRE, "$1");
        }
      } else {
        while (el2.innerHTML.indexOf(`<${options.tag} class="${options.class}"`) !== -1) {
          el2.innerHTML = el2.innerHTML.replace(markerRE, "$1");
        }
      }
    }
  }
  lang(phrase, params) {
    if (!phrase || this.settings.phrases == null || typeof phrase !== "string" || "<=>=".includes(phrase)) {
      return this.execTemplate(phrase, params);
    }
    let translation = this.settings.phrases[phrase];
    if (translation == null) {
      translation = phrase;
      if (this.settings.warnNoPhrase) {
        if (!this.settings.missing) {
          this.settings.missing = {};
        }
        this.settings.missing[phrase] = "---";
        this.settings.phrases[phrase] = "---";
        console.log(
          `Missing translation for "%c${phrase}%c", see %c w2utils.settings.phrases %c with value "---"`,
          "color: orange",
          "",
          "color: #999",
          ""
        );
      }
    } else if (translation === "---" && !this.settings.warnNoPhrase) {
      translation = phrase;
    }
    if (translation === "---") {
      translation = `<span ${this.tooltip(phrase)}>---</span>`;
    }
    return this.execTemplate(translation, params);
  }
  locale(locale, keepPhrases, noMerge) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(locale)) {
        this.settings.phrases = {};
        const proms = [];
        const files = {};
        const localeArr = locale;
        localeArr.forEach((file, ind) => {
          if (file.length === 5) {
            file = "locale/" + file.toLowerCase() + ".json";
            localeArr[ind] = file;
          }
          proms.push(this.locale(file, true, false));
        });
        Promise.allSettled(proms).then((res) => {
          res.forEach((r) => {
            if (r.value) files[r.value.file] = r.value.data;
          });
          localeArr.forEach((file) => {
            this.settings = this.extend({}, this.settings, files[file]);
          });
          resolve();
        });
        return;
      }
      if (!locale) locale = "en-us";
      if (typeof locale === "object") {
        this.settings = this.extend({}, this.settings, w2locale, locale);
        return;
      }
      let localeStr = locale;
      if (localeStr.length === 5) {
        localeStr = "locale/" + localeStr.toLowerCase() + ".json";
      }
      fetch(localeStr, { method: "GET" }).then((res) => res.json()).then((data) => {
        if (noMerge !== true) {
          if (keepPhrases) {
            this.settings = this.extend({}, this.settings, data);
          } else {
            this.settings = this.extend({}, this.settings, w2locale, { phrases: {} }, data);
          }
        }
        resolve({ file: localeStr, data });
      }).catch((err) => {
        console.log("ERROR: Cannot load locale " + localeStr);
        reject(err);
      });
    });
  }
  scrollBarSize() {
    if (this.tmp["scrollBarSize"]) return this.tmp["scrollBarSize"];
    const html = `
            <div id="_scrollbar_width" style="position: absolute; top: -300px; width: 100px; height: 100px; overflow-y: scroll;">
                <div style="height: 120px">1</div>
            </div>
        `;
    query2("body").append(html);
    this.tmp["scrollBarSize"] = 100 - query2("#_scrollbar_width > div")[0].clientWidth;
    query2("#_scrollbar_width").remove();
    return this.tmp["scrollBarSize"];
  }
  checkName(name) {
    if (name == null) {
      console.log('ERROR: Property "name" is required but not supplied.');
      return false;
    }
    if (w2ui[name] != null) {
      console.log(`ERROR: Object named "${name}" is already registered as w2ui.${name}.`);
      return false;
    }
    if (!this.isAlphaNumeric(name)) {
      console.log('ERROR: Property "name" has to be alpha-numeric (a-z, 0-9, dash and underscore).');
      return false;
    }
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkUniqueId(id, items, desc, obj) {
    if (!Array.isArray(items)) items = [items];
    let isUnique = true;
    items.forEach((item) => {
      if (item.id === id) {
        console.log(`ERROR: The item id="${id}" is not unique within the ${desc} "${obj}".`, items);
        isUnique = false;
      }
    });
    return isUnique;
  }
  /**
   * Takes an object and encodes it into params string to be passed as a url
   * { a: 1, b: 'str'}                => "a=1&b=str"
   * { a: 1, b: { c: 2 }}             => "a=1&b[c]=2"
   * { a: 1, b: {c: { k: 'dfdf' } } } => "a=1&b[c][k]=dfdf"
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  encodeParams(obj, prefix = "") {
    let str = "";
    Object.keys(obj).forEach((key) => {
      if (str != "") str += "&";
      if (typeof obj[key] == "object") {
        str += this.encodeParams(obj[key], prefix + key + (prefix ? "]" : "") + "[");
      } else {
        str += `${prefix}${key}${prefix ? "]" : ""}=${obj[key]}`;
      }
    });
    return str;
  }
  parseRoute(route) {
    const keys = [];
    const path = route.replace(/\/\(/g, "(?:/").replace(/\+/g, "__plus__").replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, (_, slash, format, key, capture, optional) => {
      keys.push({ name: key, optional: !!optional });
      slash = slash || "";
      return "" + (optional ? "" : slash) + "(?:" + (optional ? slash : "") + (format || "") + (capture || (format && "([^/.]+?)" || "([^/]+?)")) + ")" + (optional || "");
    }).replace(/([\/.])/g, "\\$1").replace(/__plus__/g, "(.+)").replace(/\*/g, "(.*)");
    return {
      path: new RegExp("^" + path + "$", "i"),
      keys
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCursorPosition(input) {
    if (input == null) return null;
    let caretOffset = 0;
    const doc = input.ownerDocument || input.document;
    const win = doc.defaultView || doc.parentWindow;
    let sel;
    if (["INPUT", "TEXTAREA"].includes(input.tagName)) {
      caretOffset = input.selectionStart;
    } else {
      if (win.getSelection) {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          const preCaretRange = range.cloneRange();
          preCaretRange.selectNodeContents(input);
          preCaretRange.setEnd(range.endContainer, range.endOffset);
          caretOffset = preCaretRange.toString().length;
        }
      } else if ((sel = doc.selection) && sel.type !== "Control") {
        const textRange = sel.createRange();
        const preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(input);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
      }
    }
    return caretOffset;
  }
  setCursorPosition(input, pos, posEnd) {
    if (input == null) return;
    const range = document.createRange();
    let el = null;
    const sel = window.getSelection();
    if (["INPUT", "TEXTAREA"].includes(input.tagName)) {
      ;
      input.setSelectionRange(pos, posEnd ?? pos);
    } else {
      for (let i = 0; i < input.childNodes.length; i++) {
        let tmp = String(query2(input.childNodes[i]).text());
        if (input.childNodes[i].tagName) {
          tmp = String(query2(input.childNodes[i]).html());
          tmp = tmp.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&nbsp;/g, " ");
        }
        if (pos <= tmp.length) {
          el = input.childNodes[i] ?? null;
          if (el != null && el.childNodes && el.childNodes.length > 0) el = el.childNodes[0] ?? null;
          if (el != null && el.childNodes && el.childNodes.length > 0) el = el.childNodes[0] ?? null;
          break;
        } else {
          pos -= tmp.length;
        }
      }
      if (el == null) return;
      const elLen = el.length ?? 0;
      if (pos > elLen) pos = elLen;
      range.setStart(el, pos);
      if (posEnd) {
        range.setEnd(el, posEnd);
      } else {
        range.collapse(true);
      }
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }
  parseColor(str) {
    if (typeof str !== "string") return null;
    else str = str.trim().toUpperCase();
    if (str[0] === "#") str = str.substr(1);
    let color = { r: 0, g: 0, b: 0, a: 1 };
    if (str.length === 3) {
      const s0 = str[0] ?? "0", s1 = str[1] ?? "0", s2 = str[2] ?? "0";
      color = {
        r: parseInt(s0 + s0, 16),
        g: parseInt(s1 + s1, 16),
        b: parseInt(s2 + s2, 16),
        a: 1
      };
    } else if (str.length === 6) {
      color = {
        r: parseInt(str.substr(0, 2), 16),
        g: parseInt(str.substr(2, 2), 16),
        b: parseInt(str.substr(4, 2), 16),
        a: 1
      };
    } else if (str.length === 8) {
      color = {
        r: parseInt(str.substr(0, 2), 16),
        g: parseInt(str.substr(2, 2), 16),
        b: parseInt(str.substr(4, 2), 16),
        a: Math.round(parseInt(str.substr(6, 2), 16) / 255 * 100) / 100
        // alpha channel 0-1
      };
    } else if (str.length > 4 && str.substr(0, 4) === "RGB(") {
      const tmp = str.replace("RGB", "").replace(/\(/g, "").replace(/\)/g, "").split(",");
      color = {
        r: parseInt(tmp[0] ?? "0", 10),
        g: parseInt(tmp[1] ?? "0", 10),
        b: parseInt(tmp[2] ?? "0", 10),
        a: 1
      };
    } else if (str.length > 5 && str.substr(0, 5) === "RGBA(") {
      const tmp = str.replace("RGBA", "").replace(/\(/g, "").replace(/\)/g, "").split(",");
      color = {
        r: parseInt(tmp[0] ?? "0", 10),
        g: parseInt(tmp[1] ?? "0", 10),
        b: parseInt(tmp[2] ?? "0", 10),
        a: parseFloat(tmp[3] ?? "1")
      };
    } else {
      return null;
    }
    return color;
  }
  colorContrast(color1, color2) {
    const lum1 = calcLumens(color1);
    const lum2 = calcLumens(color2);
    const ratio = (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
    return ratio.toFixed(2);
    function calcLumens(color) {
      const { r, g, b } = w2utils.parseColor(color) ?? { r: 0, g: 0, b: 0, a: 1 };
      const gamma = 2.2;
      const normR = r / 255;
      const normG = g / 255;
      const normB = b / 255;
      const sR = normR <= 0.03928 ? normR / 12.92 : Math.pow((normR + 0.055) / 1.055, gamma);
      const sG = normG <= 0.03928 ? normG / 12.92 : Math.pow((normG + 0.055) / 1.055, gamma);
      const sB = normB <= 0.03928 ? normB / 12.92 : Math.pow((normB + 0.055) / 1.055, gamma);
      return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
    }
  }
  // h=0..360, s=0..100, v=0..100
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hsv2rgb(h, s, v, a) {
    let r, g, b;
    if (arguments.length === 1) {
      s = h.s;
      v = h.v;
      a = h.a;
      h = h.h;
    }
    h = h / 360;
    s = s / 100;
    v = v / 100;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v, g = t, b = p;
        break;
      case 1:
        r = q, g = v, b = p;
        break;
      case 2:
        r = p, g = v, b = t;
        break;
      case 3:
        r = p, g = q, b = v;
        break;
      case 4:
        r = t, g = p, b = v;
        break;
      case 5:
        r = v, g = p, b = q;
        break;
    }
    return {
      r: Math.round((r ?? 0) * 255),
      g: Math.round((g ?? 0) * 255),
      b: Math.round((b ?? 0) * 255),
      a: a != null ? a : 1
    };
  }
  // r=0..255, g=0..255, b=0..255
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rgb2hsv(r, g, b, a) {
    if (arguments.length === 1) {
      g = r.g;
      b = r.b;
      a = r.a;
      r = r.r;
    }
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let h;
    const s = max === 0 ? 0 : d / max, v = max / 255;
    switch (max) {
      case min:
        h = 0;
        break;
      case r:
        h = g - b + d * (g < b ? 6 : 0);
        h /= 6 * d;
        break;
      case g:
        h = b - r + d * 2;
        h /= 6 * d;
        break;
      case b:
        h = r - g + d * 4;
        h /= 6 * d;
        break;
    }
    return {
      h: Math.round((h ?? 0) * 360),
      s: Math.round(s * 100),
      v: Math.round(v * 100),
      a: a != null ? a : 1
    };
  }
  tooltip(html, options) {
    let showOn = "mouseenter";
    let hideOn = "mouseleave";
    let opts = options ?? {};
    if (typeof html == "object") {
      opts = html;
    }
    if (typeof html == "string") {
      opts = { ...opts, html };
    }
    if (opts["showOn"]) {
      showOn = opts["showOn"];
      delete opts["showOn"];
    }
    if (opts["hideOn"]) {
      hideOn = opts["hideOn"];
      delete opts["hideOn"];
    }
    if (!opts["name"]) opts["name"] = "no-name";
    const actions = ` on${showOn}="w2tooltip.show(this, JSON.parse(w2utils.base64decode('${this.base64encode(JSON.stringify(opts))}')))" on${hideOn}="w2tooltip.hide('${opts["name"]}')"`;
    return actions;
  }
  // determins if it is plain Object, not DOM element, nor a function, event, etc.
  isPlainObject(value) {
    if (value == null) {
      return false;
    }
    if (Object.prototype.toString.call(value) !== "[object Object]") {
      return false;
    }
    if (value.constructor === void 0) {
      return true;
    }
    const proto = Object.getPrototypeOf(value);
    return proto === null || proto === Object.prototype;
  }
  /**
   * Deep copy of an object or an array. Function, events and HTML elements will not be cloned,
   * you can choose to include them or not, by default they are included.
   * You can also exclude certain elements from final object if used with options: { exclude }
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clone(obj, options) {
    const opts = Object.assign({ functions: true, elements: true, events: true, exclude: [], parent: "" }, options ?? {});
    if (Array.isArray(obj)) {
      const arr = Array.from(obj);
      arr.forEach((value, ind) => {
        arr[ind] = this.clone(value, { functions: opts.functions, elements: opts.elements, events: opts.events, exclude: opts.exclude, parent: opts.parent + "[]" });
      });
      return arr;
    } else if (this.isPlainObject(obj)) {
      const ret = {};
      Object.assign(ret, obj);
      if (Array.isArray(opts.exclude)) {
        opts.exclude.forEach((key) => {
          delete ret[key];
        });
      }
      Object.keys(ret).forEach((key) => {
        if (typeof opts.exclude == "function" && opts.exclude(key, { obj, parent: opts.parent })) {
          ret[key] = void 0;
        } else {
          ret[key] = this.clone(ret[key], { functions: opts.functions, elements: opts.elements, events: opts.events, exclude: opts.exclude, parent: opts.parent + (opts.parent ? "." : "") + key });
        }
        if (ret[key] === void 0) delete ret[key];
      });
      return ret;
    } else {
      if (obj instanceof Function && !opts.functions || obj instanceof Node && !opts.elements || obj instanceof Event && !opts.events) {
        return void 0;
      } else {
        return obj;
      }
    }
  }
  /**
   * Deep extend an object, if an array, it overwrrites it, cloning objects in the process
   * target, source1, source2, ...
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extend(target, source, ...rest) {
    if (Array.isArray(target)) {
      if (Array.isArray(source)) {
        target.splice(0, target.length);
        source.forEach((s) => {
          target.push(this.clone(s));
        });
      } else {
        throw new Error("Arrays can be extended with arrays only");
      }
    } else if (target instanceof Node || target instanceof Event) {
      throw new Error("HTML elmenents and events cannot be extended");
    } else if (target && typeof target == "object" && source != null) {
      if (typeof source != "object") {
        throw new Error("Object can be extended with other objects only.");
      }
      Object.keys(source).forEach((key) => {
        if (target[key] != null && typeof target[key] == "object" && source[key] != null && typeof source[key] == "object") {
          const src = this.clone(source[key]);
          if (target[key] instanceof Node || target[key] instanceof Event) {
            target[key] = src;
          } else {
            if (Array.isArray(target[key]) && this.isPlainObject(src)) {
              target[key] = {};
            }
            this.extend(target[key], src);
          }
        } else {
          target[key] = this.clone(source[key]);
        }
      });
    } else if (source != null) {
      throw new Error("Object is not extendable, only {} or [] can be extended.");
    }
    if (rest.length > 0) {
      for (let i = 0; i < rest.length; i++) {
        this.extend(target, rest[i]);
      }
    }
    return target;
  }
  /*
   * @author     Lauri Rooden (https://github.com/litejs/natural-compare-lite)
   * @license    MIT License
   */
  naturalCompare(a, b) {
    let i = 0, codeA = 0, codeB = 1, posA = 0, posB = 0;
    const alphabet = String["alphabet"];
    function getCode(str, pos, code) {
      if (code) {
        for (i = pos; code = getCode(str, i), code < 76 && code > 65; ) ++i;
        return +str.slice(pos - 1, i);
      }
      let c = alphabet ? alphabet.indexOf(str.charAt(pos)) : -1;
      return c > -1 ? c + 76 : (c = str.charCodeAt(pos) || 0, c < 45 || c > 127) ? c : c < 46 ? 65 : c < 48 ? c - 1 : c < 58 ? c + 18 : c < 65 ? c - 11 : c < 91 ? c + 11 : c < 97 ? c - 37 : c < 123 ? c + 5 : c - 63;
    }
    const aStr = "" + a, bStr = "" + b;
    if (aStr != bStr) for (; codeB; ) {
      codeA = getCode(aStr, posA++);
      codeB = getCode(bStr, posB++);
      if (codeA < 76 && codeB < 76 && codeA > 66 && codeB > 66) {
        codeA = getCode(aStr, posA, posA);
        codeB = getCode(bStr, posB, posA = i);
        posB = i;
      }
      if (codeA != codeB) return codeA < codeB ? -1 : 1;
    }
    return 0;
  }
  /**
   * Takes a menu (used in drop downs, context menu, field: list/combo/enum) and normalizes it to the common structure, which
   * is { id: ..., text: ... }. In options you can pass { itemMap: { id: 'id_field', text: 'text_field' }} that will be used
   * to find out id and text fields.
   */
  normMenu(menu, options = {}) {
    if (Array.isArray(menu)) {
      menu.forEach((it, m) => {
        if (typeof it === "string" || typeof it === "number") {
          menu[m] = { id: it, text: String(it) };
        } else if (it != null) {
          if (options.itemMap != null) {
            let val = w2utils.getNested(it, options.itemMap.id);
            if (options.itemMap.id != null && val != null) {
              it.id = val;
            }
            val = w2utils.getNested(it, options.itemMap.text);
            if (options.itemMap.text != null && val) {
              it.text = val;
            }
          }
          if (it.caption != null && it.text == null) it.text = it.caption;
          if (it.text != null && it.id == null) it.id = it.text;
          if (it.text == null && it.id != null) it.text = it.id;
        } else {
          menu[m] = { id: null, text: "null" };
        }
      });
      return menu;
    } else if (typeof menu === "function") {
      const newMenu = menu.call(this, menu, options);
      return w2utils.normMenu.call(this, newMenu, options);
    } else if (typeof menu === "object" && menu !== null) {
      const menuObj = menu;
      return Object.keys(menuObj).map((key) => {
        return { id: key, text: String(menuObj[key] ?? "") };
      });
    }
  }
  /**
   * Takes Url object and fetchOptions and changes it in place applying selected user dataType. Since
   * dataType is in w2utils. This method is used in grid, form and tooltip to prepare fetch parameters
   */
  prepareParams(url, fetchOptions, options = {}) {
    const dataType = options?.["dataType"] ?? w2utils.settings.dataType;
    let postParams = fetchOptions["body"];
    fetchOptions["method"] = String(fetchOptions["method"]).toUpperCase();
    switch (dataType) {
      /**
       * Will submit GET, POST, PUT, DELETE
       * - if GET - it will be in URL
       * - if POST, PUT, DELETE it will be JSON encoded
       */
      case "RESTFULL":
      case "RESTFULJSON": {
        if (["POST", "PUT", "DELETE"].includes(String(fetchOptions["method"]))) {
          ;
          fetchOptions["headers"]["Content-Type"] = "application/json";
        }
        if (String(fetchOptions["method"]) == "GET") {
          if (dataType == "RESTFULLJSON") {
            postParams = { request: postParams };
          }
          body2params();
        }
        break;
      }
      /**
       * Will submit either GET or POST and
       * - if POST it will be JSON encoded
       * - if GET it will be in URL
       * - if HTTPJSON and GET then it will be JSON encoded
       */
      case "HTTP":
      case "HTTPJSON":
      case "JSON": {
        if (String(fetchOptions["method"]) == "GET") {
          if (dataType == "JSON" || dataType === "HTTPJSON") {
            postParams = { request: postParams };
          }
          body2params();
        } else {
          ;
          fetchOptions["headers"]["Content-Type"] = "application/json";
          fetchOptions["method"] = "POST";
        }
        break;
      }
      default: {
        if (typeof dataType == "function") {
          fetchOptions = dataType(url, fetchOptions, options);
        } else {
          console.log(`ERROR: Unsupported dataType "${dataType}". Supported types are JSON (default), HTTP, RESTFULL. For backward compatibility HTTPJSON is same as JSON. RESTULFLJSON will encode GET request as JSON.`);
        }
      }
    }
    if (fetchOptions["body"] != null) {
      fetchOptions["body"] = typeof fetchOptions["body"] == "string" ? fetchOptions["body"] : JSON.stringify(fetchOptions["body"]);
    }
    return fetchOptions;
    function body2params() {
      const pp = postParams;
      Object.keys(pp).forEach((key) => {
        let param = pp[key];
        if (typeof param == "object") param = JSON.stringify(param);
        url.searchParams.append(key, String(param ?? ""));
      });
      delete fetchOptions["body"];
    }
  }
  bindEvents(selector, subject) {
    const selectorR = selector;
    if (selectorR?.["length"] == 0) return;
    let normalizedSelector = selector;
    if (selectorR?.[0] instanceof Node) {
      normalizedSelector = Array.isArray(selector) ? selector : selector.get();
    }
    ;
    query2(normalizedSelector).each((el) => {
      const actions = query2(el).data();
      Object.keys(actions).forEach((name) => {
        const events = [
          "click",
          "dblclick",
          "mouseenter",
          "mouseleave",
          "mouseover",
          "mouseout",
          "mousedown",
          "mousemove",
          "mouseup",
          "contextmenu",
          "focus",
          "focusin",
          "focusout",
          "blur",
          "input",
          "change",
          "keydown",
          "keyup",
          "keypress"
        ];
        if (events.indexOf(String(name).toLowerCase()) == -1) {
          return;
        }
        let params = Array.isArray(actions[name]) ? actions[name] : [actions[name]];
        if (typeof actions[name] == "string") {
          params = actions[name].split("|").map((key) => {
            let val = key;
            if (key === "true") val = true;
            if (key === "false") val = false;
            if (key === "undefined") val = void 0;
            if (key === "null") val = null;
            if (typeof val === "string" && parseFloat(val) == val) val = parseFloat(val);
            const quotes = ["'", '"', "`"];
            if (typeof val == "string" && quotes.includes(val[0] ?? "") && quotes.includes(val[val.length - 1] ?? "")) {
              val = val.substring(1, val.length - 1);
            }
            return val;
          });
        }
        const method = String(params[0]);
        params = params.slice(1);
        query2(el).off(name + ".w2utils-bind").on(name + ".w2utils-bind", function(event2) {
          switch (method) {
            case "alert":
              alert(params[0]);
              break;
            case "stop":
              event2.stopPropagation();
              break;
            case "prevent":
              event2.preventDefault();
              break;
            case "stopPrevent":
              event2.stopPropagation();
              event2.preventDefault();
              return false;
              break;
            default:
              if (subject[method] == null) {
                throw new Error(`Cannot dispatch event as the method "${method}" does not exist.`);
              }
              ;
              subject[method](...params.map((key, _ind) => {
                switch (String(key).toLowerCase()) {
                  case "event":
                    return event2;
                  case "this":
                    return this;
                  default:
                    return key;
                }
              }));
          }
        });
      });
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debounce(func, wait = 250) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    };
  }
  async wait(time = 0) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), time);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getNested(obj, prop) {
    let val;
    try {
      val = obj;
      const tmp = String(prop).split(".");
      for (let i = 0; i < tmp.length; i++) {
        val = val[tmp[i] ?? ""];
      }
    } catch (event2) {
      val = void 0;
    }
    return val;
  }
};
var w2utils = new Utils();

// src/w2base.ts
var w2ui2 = w2ui;
var w2event = class {
  type;
  // assigned via Object.assign in constructor
  detail;
  // assigned via Object.assign in constructor
  owner;
  // assigned via Object.assign in constructor
  target;
  phase;
  // assigned via Object.assign in constructor
  object;
  execute;
  // assigned via Object.assign in constructor
  isStopped;
  // assigned via Object.assign in constructor
  isCancelled;
  // assigned via Object.assign in constructor
  onComplete;
  // assigned via Object.assign in constructor
  listeners;
  // assigned via Object.assign in constructor
  complete;
  _resolve;
  _reject;
  constructor(owner, edata) {
    Object.assign(this, {
      type: edata.type ?? null,
      detail: edata,
      owner,
      target: edata.target ?? null,
      phase: edata.phase ?? "before",
      object: edata.object ?? null,
      execute: null,
      isStopped: false,
      isCancelled: false,
      onComplete: null,
      listeners: []
    });
    delete edata.type;
    delete edata.target;
    delete edata.object;
    this.complete = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
    this.complete.catch(() => {
    });
  }
  finish(detail) {
    if (detail) {
      w2utils.extend(this.detail, detail);
    }
    this.phase = "after";
    this.owner.trigger.call(this.owner, this);
  }
  done(func) {
    this.listeners.push(func);
  }
  preventDefault() {
    this._reject();
    this.isCancelled = true;
  }
  stopPropagation() {
    this.isStopped = true;
  }
};
var w2base = class {
  activeEvents = [];
  listeners = [];
  debug = false;
  name;
  box;
  /**
   * Initializes base object for w2ui, registers it with w2ui object
   *
   * @param {string} name  - name of the object
   * @returns
   */
  constructor(name) {
    this.activeEvents = [];
    this.listeners = [];
    if (typeof name !== "undefined") {
      if (!w2utils.checkName(name)) return;
      w2ui2[name] = this;
    }
    this.debug = false;
  }
  /**
   * Adds event listener, supports event phase and event scoping
   *
   * @param {*} edata - an object or string, if string "eventName:phase.scope"
   * @param {*} handler
   * @returns itself
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  on(events, handler) {
    if (typeof events == "string") {
      events = events.split(/[,\s]+/);
    } else {
      events = [events];
    }
    events.forEach((edata) => {
      const name = typeof edata == "string" ? edata : edata.type + ":" + edata.execute + "." + edata.scope;
      if (typeof edata == "string") {
        const [eventName, scope] = edata.split(".");
        const [type, execute] = (eventName ?? "").replace(":complete", ":after").replace(":done", ":after").split(":");
        edata = { type, execute: execute ?? "before", scope };
      }
      edata = w2utils.extend({ type: null, execute: "before", onComplete: null }, edata);
      if (!edata.type) {
        console.log("ERROR: You must specify event type when calling .on() method of " + this.name);
        return;
      }
      if (!handler) {
        console.log("ERROR: You must specify event handler function when calling .on() method of " + this.name);
        return;
      }
      if (!Array.isArray(this.listeners)) this.listeners = [];
      this.listeners.push({ name, edata, handler });
      if (this.debug) {
        console.log("w2base: add event", { name, edata, handler });
      }
    });
    return this;
  }
  /**
   * Removes event listener, supports event phase and event scoping
   *
   * @param {*} edata - an object or string, if string "eventName:phase.scope"
   * @param {*} handler
   * @returns itself
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  off(events, handler) {
    if (typeof events == "string") {
      events = events.split(/[,\s]+/);
    } else {
      events = [events];
    }
    events.forEach((edata) => {
      const name = typeof edata == "string" ? edata : edata.type + ":" + edata.execute + "." + edata.scope;
      if (typeof edata == "string") {
        const [eventName, scope] = edata.split(".");
        const [type, execute] = (eventName ?? "").replace(":complete", ":after").replace(":done", ":after").split(":");
        edata = { type: type || "*", execute: execute || "", scope: scope || "" };
      }
      edata = w2utils.extend({ type: null, execute: null, onComplete: null }, edata);
      if (!edata.type && !edata.scope) {
        console.log("ERROR: You must specify event type when calling .off() method of " + this.name);
        return;
      }
      if (!handler) {
        handler = void 0;
      }
      let count = 0;
      this.listeners = this.listeners.filter((curr) => {
        if ((edata.type === "*" || edata.type === curr.edata.type) && (edata.execute === "" || edata.execute === curr.edata.execute) && (edata.scope === "" || edata.scope === curr.edata.scope) && (edata.handler == null || edata.handler === curr.edata.handler)) {
          count++;
          return false;
        } else {
          return true;
        }
      });
      if (this.debug) {
        console.log(`w2base: remove event (${count})`, { name, edata, handler });
      }
    });
    return this;
  }
  /**
   * Triggers even listeners for a specific event, loops through this.listeners
   *
   * @param {Object} edata - Object
   * @returns modified edata
   *
   * NOTE: `edata` is typed as `any` here intentionally. The method mutates the argument
   * from W2EventData into a w2event mid-execution. Runtime type mutation is inherent
   * to the event dispatch pattern. Phase 6 strict tighten will revisit this.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trigger(eventName, edataIn) {
    let edata;
    if (arguments.length == 1) {
      if (typeof eventName == "string") {
        edata = { type: eventName, target: this };
      } else {
        edata = eventName;
      }
    } else {
      edata = edataIn;
      edata.type = eventName;
      edata.target = edata.target ?? this;
    }
    if (w2utils.isPlainObject(edata) && edata.phase == "after") {
      edata = this.activeEvents.find((event2) => {
        if (event2.type == edata.type && event2.target == edata.target) {
          return true;
        }
        return false;
      });
      if (!edata) {
        console.log(`ERROR: Cannot find even handler for "${edata?.type}" on "${edata?.target}".`);
        return edata;
      }
      console.log(`NOTICE: This syntax "edata.trigger({ phase: 'after' })" is outdated. Use edata.finish() instead.`);
    } else if (!(edata instanceof w2event)) {
      edata = new w2event(this, edata);
      this.activeEvents.push(edata);
    }
    let args, fun, tmp;
    if (!Array.isArray(this.listeners)) this.listeners = [];
    if (this.debug) {
      console.log(`w2base: trigger "${edata.type}:${edata.phase}"`, edata);
    }
    for (let h = this.listeners.length - 1; h >= 0; h--) {
      const item = this.listeners[h];
      if (item != null && (item.edata.type === edata.type || item.edata.type === "*") && (item.edata["target"] === edata.target || item.edata["target"] == null) && (item.edata.execute === edata.phase || item.edata.execute === "*" || item.edata["phase"] === "*")) {
        Object.keys(item.edata).forEach((key) => {
          if (edata[key] == null && item.edata[key] != null) {
            edata[key] = item.edata[key];
          }
        });
        args = [];
        tmp = new RegExp(/\((.*?)\)/).exec(String(item.handler).split("=>")[0] ?? "");
        if (tmp) args = (tmp[1] ?? "").split(/\s*,\s*/);
        if (args.length === 2) {
          item.handler.call(this, edata.target, edata);
          if (this.debug) console.log(" - call (old)", item.handler);
        } else {
          item.handler.call(this, edata);
          if (this.debug) console.log(" - call", item.handler);
        }
        if (edata.isStopped === true || edata.stop === true) return edata;
      }
    }
    const funName = "on" + edata.type.substr(0, 1).toUpperCase() + edata.type.substr(1);
    if (edata.phase === "before" && typeof this[funName] === "function") {
      fun = this[funName];
      args = [];
      tmp = new RegExp(/\((.*?)\)/).exec(String(fun).split("=>")[0] ?? "");
      if (tmp) args = (tmp[1] ?? "").split(/\s*,\s*/);
      if (args.length === 2) {
        fun.call(this, edata.target, edata);
        if (this.debug) console.log(" - call: on[Event] (old)", fun);
      } else {
        fun.call(this, edata);
        if (this.debug) console.log(" - call: on[Event]", fun);
      }
      if (edata.isStopped === true || edata.stop === true) return edata;
    }
    if (edata.object != null && edata.phase === "before" && typeof edata.object[funName] === "function") {
      fun = edata.object[funName];
      args = [];
      tmp = new RegExp(/\((.*?)\)/).exec(String(fun).split("=>")[0] ?? "");
      if (tmp) args = (tmp[1] ?? "").split(/\s*,\s*/);
      if (args.length === 2) {
        fun.call(this, edata.target, edata);
        if (this.debug) console.log(" - call: edata.object (old)", fun);
      } else {
        fun.call(this, edata);
        if (this.debug) console.log(" - call: edata.object", fun);
      }
      if (edata.isStopped === true || edata.stop === true) return edata;
    }
    if (edata.phase === "after") {
      if (typeof edata.onComplete === "function") edata.onComplete.call(this, edata);
      for (let i = 0; i < edata.listeners.length; i++) {
        if (typeof edata.listeners[i] === "function") {
          edata.listeners[i].call(this, edata);
          if (this.debug) console.log(" - call: done", fun);
        }
      }
      edata._resolve(edata);
      if (this.debug) {
        console.log(`w2base: trigger "${edata.type}:${edata.phase}"`, edata);
      }
      const ind = this.activeEvents.indexOf(edata);
      if (ind !== -1) this.activeEvents.splice(ind, 1);
    }
    return edata;
  }
  /**
   * This method renders component into the box. It is overwritten in descendents and in this base
   * component it is empty.
   */
  render(_box) {
  }
  /**
   * Removes all classes that start with w2ui-* and sets box to null. It is needed so that control will
   * release the box to be used for other widgets
   */
  unmount() {
    const edata = this.trigger("unmount", { target: this.name });
    if (edata.isCancelled) {
      return;
    }
    const remove = [];
    if (this.box instanceof HTMLElement) {
      this.box.classList.forEach((cl) => {
        if (cl.startsWith("w2ui-")) remove.push(cl);
      });
    }
    query2(this.box).off().removeClass(remove).removeAttr("name").html("");
    this.box = null;
    edata.finish();
  }
};

// src/w2popup.ts
var query3 = query;
var Dialog = class extends w2base {
  defaults;
  options;
  status;
  tmp;
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
   * - w2popup.open('ddd').ok(() => { w2popup.close() })
   * - w2popup.open('ddd', { height: 120 }).ok(() => { w2popup.close() })
   * - w2popup.open({ body: 'text', title: 'caption', actions: ["Close"] }).close(() => { w2popup.close() })
   * - w2popup.open({ body: 'text', title: 'caption', actions: { Close() { w2popup.close() }} })
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  open(options, extraOptions) {
    const self = this;
    if (this.status == "closing" || query3("#w2ui-popup").hasClass("animating")) {
      this.close(true);
    }
    const old_options = this.options;
    if (["string", "number"].includes(typeof options)) {
      options = w2utils.extend({
        title: "Notification",
        body: `<div class="w2ui-centered">${options}</div>`,
        actions: { Ok() {
          self.close();
        } },
        cancelAction: "ok"
      }, extraOptions ?? {});
    }
    if (options.text != null) options.body = `<div class="w2ui-centered w2ui-msg-text">${options.text}</div>`;
    options = Object.assign({}, this.defaults, old_options, { title: "", body: "" }, options, { maximized: false });
    this.options = options;
    if (query3("#w2ui-popup").length === 0) {
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
          options.buttons += `<button class="w2ui-btn w2ui-eaction" name="${action}" data-click='["action","${action}","event"]'>${action}</button>`;
        }
        if (typeof handler == "object") {
          options.buttons += `<button class="w2ui-btn w2ui-eaction ${handler.class || ""}" name="${action}" data-click='["action","${action}","event"]'
                        style="${handler.style}" ${handler.attrs}>${handler.text || action}</button>`;
          btnAction = Array.isArray(options.actions) ? handler.text : action;
        }
        if (typeof handler == "string") {
          if (handler.trim().startsWith("<")) {
            btnAction = "none";
            options.buttons += handler;
          } else {
            btnAction = (handler[0] ?? "").toLowerCase() + handler.substr(1).replace(/\s+/g, "");
            options.buttons += `<button class="w2ui-btn w2ui-eaction" name="${action}" data-click='["action","${btnAction}","event"]'>${handler}</button>`;
          }
        }
        if (typeof btnAction == "string") {
          btnAction = (btnAction[0] ?? "").toLowerCase() + btnAction.substr(1).replace(/\s+/g, "");
        }
        prom[btnAction] = function(callBack) {
          self.on("action.buttons", (event2) => {
            const target = (event2.detail.action[0] ?? "").toLowerCase() + event2.detail.action.substr(1).replace(/\s+/g, "");
            if (target == btnAction) callBack(event2);
          });
          return prom;
        };
      });
    }
    let titleBtns = "";
    if (options.showClose) {
      titleBtns += `<div class="w2ui-popup-button w2ui-popup-close">
                        <span class="w2ui-icon w2ui-icon-cross w2ui-eaction" data-mousedown="stop" data-click="close"></span>
                    </div>`;
    }
    if (options.showMax) {
      titleBtns += `<div class="w2ui-popup-button w2ui-popup-max">
                        <span class="w2ui-icon w2ui-icon-box w2ui-eaction" data-mousedown="stop" data-click="toggle"></span>
                    </div>`;
    }
    if (query3("#w2ui-popup").length === 0) {
      edata = this.trigger("open", { target: "popup", present: false });
      if (edata.isCancelled === true) return;
      this.status = "opening";
      if (options.blockPage) {
        w2utils.lock(document.body, {
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
      msg = `<div id="w2ui-popup" class="w2ui-popup w2ui-anim-open animating ${!options.blockPage ? "w2ui-non-blocking" : ""}" style="${w2utils.stripSpaces(styles)}"></div>`;
      query3("body").append(msg);
      query3("#w2ui-popup")[0]._w2popup = {
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
                <div class="w2ui-popup-title-btns">${titleBtns}</div>
                <div class="w2ui-popup-title" style="${!options.title ? "display: none" : ""}"></div>
                <div class="w2ui-box" style="${styles}">
                    <div class="w2ui-popup-body ${!options.title || " w2ui-popup-no-title"}
                        ${!options.buttons || " w2ui-popup-no-buttons"}" style="${options.style}">
                    </div>
                </div>
                <div class="w2ui-popup-buttons" style="${!options.buttons ? "display: none" : ""}"></div>
                <div class="w2ui-popup-resizer resize-point resize-icon"></div>
                <span name="hidden-last" tabindex="0" style="position: absolute; top: -100px"></span>
            `;
      query3("#w2ui-popup").html(msg);
      if (options.title) query3("#w2ui-popup .w2ui-popup-title").append(w2utils.lang(options.title));
      if (options.buttons) query3("#w2ui-popup .w2ui-popup-buttons").append(options.buttons);
      if (options.body) query3("#w2ui-popup .w2ui-popup-body").append(options.body);
      setTimeout(() => {
        ;
        query3("#w2ui-popup").css("transition", options.speed + "s").removeClass("w2ui-anim-open");
        w2utils.bindEvents("#w2ui-popup .w2ui-eaction", this);
        query3("#w2ui-popup").find(".w2ui-popup-body").show();
        this._promCreated();
      }, 1);
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this.status = "open";
        self.setFocus(options.focus);
        edata.finish();
        this._promOpened();
        query3("#w2ui-popup").removeClass("animating");
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
      const cloned = query3("#w2ui-popup .w2ui-box").get(0).cloneNode(true);
      query3(cloned).removeClass("w2ui-box").addClass("w2ui-box-temp").find(".w2ui-popup-body").empty().append(options.body);
      query3("#w2ui-popup .w2ui-box").after(cloned);
      if (options.buttons) {
        ;
        query3("#w2ui-popup .w2ui-popup-buttons").show().html("").append(options.buttons);
        query3("#w2ui-popup .w2ui-popup-body").removeClass("w2ui-popup-no-buttons");
        query3("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("bottom", "");
      } else {
        query3("#w2ui-popup .w2ui-popup-buttons").hide().html("");
        query3("#w2ui-popup .w2ui-popup-body").addClass("w2ui-popup-no-buttons");
        query3("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("bottom", "0px");
      }
      if (options.title) {
        query3("#w2ui-popup .w2ui-popup-title").show().html(w2utils.lang(options.title));
        query3("#w2ui-popup .w2ui-popup-body").removeClass("w2ui-popup-no-title");
        query3("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("top", "");
      } else {
        query3("#w2ui-popup .w2ui-popup-title").hide().html("");
        query3("#w2ui-popup .w2ui-popup-body").addClass("w2ui-popup-no-title");
        query3("#w2ui-popup .w2ui-box, #w2ui-popup .w2ui-box-temp").css("top", "0px");
      }
      if (titleBtns) {
        query3("#w2ui-popup .w2ui-popup-title-btns").show().html(titleBtns);
      } else {
        query3("#w2ui-popup .w2ui-popup-title-btns").hide();
      }
      const div_old = query3("#w2ui-popup .w2ui-box")[0];
      const div_new = query3("#w2ui-popup .w2ui-box-temp")[0];
      query3("#w2ui-popup").addClass("animating");
      w2utils.transition(div_old, div_new, options.transition, () => {
        query3(div_old).remove();
        query3(div_new).removeClass("w2ui-box-temp").addClass("w2ui-box");
        const $body = query3(div_new).find(".w2ui-popup-body");
        if ($body.length == 1) {
          $body[0].style.cssText = options.style;
          $body.show();
        }
        self.setFocus(options.focus);
        query3("#w2ui-popup").removeClass("animating");
      });
      this.status = "open";
      edata.finish();
      w2utils.bindEvents("#w2ui-popup .w2ui-eaction", this);
      query3("#w2ui-popup").find(".w2ui-popup-body").show();
    }
    if (options.openMaximized) {
      this.max();
    }
    options._last_focus = document.activeElement;
    if (options.keyboard) {
      query3(document.body).off(".w2popup").on("keydown.w2popup", (event2) => {
        this.keydown(event2);
      });
    }
    query3(window).on("resize", this.handleResize);
    const tmp = {
      changing: false,
      mvMove,
      mvStop
    };
    query3("#w2ui-popup .w2ui-popup-title").off("mousedown").on("mousedown", function(event2) {
      if (!self.options.maximized) mvStart(event2);
    });
    if (options.resizable) {
      query3("#w2ui-popup .w2ui-popup-resizer").show();
      query3("#w2ui-popup .w2ui-popup-resizer").off("mousedown").on("mousedown", (event2) => {
        mvStart(event2, true);
      });
    } else {
      query3("#w2ui-popup .w2ui-popup-resizer").hide();
    }
    return prom;
    function mvStart(evt, resizer) {
      if (!evt) evt = window.event;
      self.status = resizer ? "resizing" : "moving";
      const rect = query3("#w2ui-popup").get(0).getBoundingClientRect();
      Object.assign(tmp, {
        changing: true,
        isLocked: query3("#w2ui-popup > .w2ui-lock").length == 1 ? true : false,
        x: evt.screenX,
        y: evt.screenY,
        pos_x: rect.x,
        pos_y: rect.y,
        width: rect.width,
        height: rect.height
      });
      if (!tmp.isLocked) self.lock({ opacity: 0 });
      query3(document.body).on("mousemove.w2ui-popup", tmp.mvMove).on("mouseup.w2ui-popup", tmp.mvStop);
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
        query3("#w2ui-popup").css({
          "transition": "none",
          "transform": "translate3d(" + tmp.div_x + "px, " + tmp.div_y + "px, 0px)"
        });
        self.options.moved = true;
      } else {
        query3("#w2ui-popup").css({
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
        query3("#w2ui-popup").css({
          "left": tmp.pos_x + tmp.div_x + "px",
          "top": tmp.pos_y + tmp.div_y + "px"
        }).css({
          "transition": "none",
          "transform": "translate3d(0px, 0px, 0px)"
        });
      } else {
        query3("#w2ui-popup").css({
          transition: "none",
          width: tmp.width + tmp.div_x + "px",
          height: tmp.height + tmp.div_y + "px"
        });
        self.resizeMessages();
      }
      tmp.changing = false;
      self.status = "open";
      query3(document.body).off(".w2ui-popup");
      if (!tmp.isLocked) self.unlock();
    }
  }
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  template(data, id, options = {}) {
    let html;
    try {
      html = query3(data);
    } catch (e) {
      html = query.html(data);
    }
    if (id) html = html.filter("#" + id);
    Object.assign(options, {
      width: parseInt(query3(html).css("width")),
      height: parseInt(query3(html).css("height")),
      title: query3(html).find("[rel=title]").html(),
      body: query3(html).find("[rel=body]").html(),
      buttons: query3(html).find("[rel=buttons]").html(),
      style: query3(html).find("[rel=body]").get(0).style.cssText
    });
    return this.open(options);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action(action, event2) {
    let click = this.options.actions?.[action];
    if (click instanceof Object && click.onClick) click = click.onClick;
    const edata = this.trigger("action", {
      action,
      target: "popup",
      self: this,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      originalEvent: event2,
      value: this["input"] ? this["input"].value : null
    });
    if (edata.isCancelled === true) return;
    if (typeof click === "function") click.call(this, event2);
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keydown(event2) {
    if (this.options && !this.options.keyboard) return;
    const edata = this.trigger("keydown", { target: "popup", originalEvent: event2 });
    if (edata.isCancelled === true) return;
    switch (event2.keyCode) {
      case 27:
        event2.preventDefault();
        if (query3("#w2ui-popup .w2ui-message").length == 0) {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  close(immediate) {
    const edata = this.trigger("close", { target: "popup" });
    if (edata.isCancelled === true) return;
    const cleanUp = () => {
      query3("#w2ui-popup").remove();
      if (this.options._last_focus) this.options._last_focus.focus();
      this.status = "closed";
      this.options = {};
      edata.finish();
      this._promClosed();
    };
    if (query3("#w2ui-popup").length === 0 || this.status == "closed") {
      return;
    }
    if (this.status == "opening") {
      immediate = true;
    }
    if (this.status == "closing" && immediate === true) {
      cleanUp();
      clearTimeout(this.tmp["closingTimer"]);
      w2utils.unlock(document.body, 0);
      return;
    }
    this.status = "closing";
    query3("#w2ui-popup").css("transition", this.options.speed + "s").addClass("w2ui-anim-close animating");
    w2utils.unlock(document.body, 300);
    this._promClosing();
    if (immediate) {
      cleanUp();
    } else {
      this.tmp["closingTimer"] = setTimeout(cleanUp, (this.options.speed ?? 0.3) * 1e3);
    }
    if (this.options.keyboard) {
      query3(document.body).off("keydown", this.keydown);
    }
    query3(window).off("resize", this.handleResize);
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
    const rect = query3("#w2ui-popup").get(0).getBoundingClientRect();
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
    query3("#w2ui-popup .w2ui-popup-title").html("");
    query3("#w2ui-popup .w2ui-popup-body").html("");
    query3("#w2ui-popup .w2ui-popup-buttons").html("");
  }
  reset() {
    this.open(this.defaults);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message(options) {
    return w2utils.message({
      owner: this,
      box: query3("#w2ui-popup").get(0),
      after: ".w2ui-popup-title"
    }, options);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  confirm(options) {
    return w2utils.confirm({
      owner: this,
      box: query3("#w2ui-popup").get(0),
      after: ".w2ui-popup-title"
    }, options);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFocus(focus) {
    const box = query3("#w2ui-popup");
    const sel = "input, button, select, textarea, [contentEditable], [tabindex], .w2ui-input";
    if (focus != null) {
      const el = isNaN(focus) ? box.find(sel).filter(focus).filter(":not([name=hidden-first])").get(0) : box.find(sel).filter(":not([name=hidden-first])").get(focus);
      el?.focus();
    } else {
      const el = box.find("[name=hidden-first]").get(0);
      if (el) el.focus();
    }
    query3(box).find(sel).off(".keep-focus").on("blur.keep-focus", function(_event) {
      setTimeout(() => {
        const focus2 = document.activeElement;
        const inside = query3(box).find(sel).filter(focus2).length > 0;
        const name = query3(focus2).attr("name");
        if (!inside && focus2 && focus2 !== document.body) {
          query3(box).find(sel).get(0)?.focus();
        }
        if (name == "hidden-last") {
          query3(box).find(sel).get(1)?.focus();
        }
        if (name == "hidden-first") {
          query3(box).find(sel).get(-2)?.focus();
        }
      }, 1);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lock(msg, showSpinner) {
    w2utils.lock(query3("#w2ui-popup"), msg, showSpinner);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unlock(speed) {
    w2utils.unlock(query3("#w2ui-popup"), speed);
  }
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
      query3("#w2ui-popup").css({
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resize(newWidth, newHeight, callBack) {
    return new Promise((resolve) => {
      const self = this;
      if (this.options.speed == null) this.options.speed = 0;
      const { top, left, width, height } = this.center(newWidth, newHeight);
      const speed = this.options.speed;
      query3("#w2ui-popup").css({
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
    query3("#w2ui-popup .w2ui-message").each((node) => {
      const msg = node;
      const mopt = msg._msg_options;
      const popup = query3("#w2ui-popup");
      if (parseInt(mopt.width) < 10) mopt.width = 10;
      if (parseInt(mopt.height) < 10) mopt.height = 10;
      const rect = popup[0].getBoundingClientRect();
      const titleHeight = popup.find(".w2ui-popup-title")[0].clientHeight;
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
      query3(msg).css({
        left: (pWidth - mopt.width) / 2 + "px",
        width: mopt.width + "px",
        height: mopt.height + "px"
      });
    });
  }
};
function w2alert(msg, title, callBack) {
  let prom;
  const options = {
    title: w2utils.lang(title ?? "Notification"),
    body: `<div class="w2ui-centered w2ui-msg-text">${msg}</div>`,
    showClose: false,
    actions: { ok: w2utils.lang("Ok") },
    cancelAction: "ok"
  };
  if (query3("#w2ui-popup").length > 0 && w2popup.status != "closing") {
    prom = w2popup.message(options);
  } else {
    prom = w2popup.open(options);
  }
  prom["ok"]((event2) => {
    if (typeof event2.detail.self?.close == "function") {
      event2.detail.self.close();
    }
    if (typeof callBack == "function") callBack();
  });
  return prom;
}
function w2confirm(msg, title, callBack) {
  let prom;
  let options = msg;
  if (["string", "number"].includes(typeof options)) {
    options = { msg: options };
  }
  if (options.msg) {
    options.body = `<div class="w2ui-centered w2ui-msg-text">${options.msg}</div>`, delete options.msg;
  }
  if (typeof title == "function" && callBack == null) {
    callBack = title;
    title = void 0;
  }
  w2utils.extend(options, {
    title: w2utils.lang(title ?? options.title ?? "Confirmation"),
    showClose: false,
    modal: true,
    cancelAction: "no"
  });
  if (callBack == null && options.callBack != null) {
    callBack = options.callBack;
  }
  w2utils.normButtons(options, { yes: w2utils.lang("Yes"), no: w2utils.lang("No") });
  if (query3("#w2ui-popup").length > 0 && w2popup.status != "closing") {
    prom = w2popup.message(options);
  } else {
    prom = w2popup.open(options);
  }
  prom.self.off(".confirm").on("action:after.confirm", (event2) => {
    if (typeof event2.detail.self?.close == "function") {
      event2.detail.self.close();
    }
    if (typeof callBack == "function") callBack(event2.detail.action);
  });
  return prom;
}
function w2prompt(label, title, callBack) {
  let prom;
  let options = label;
  if (["string", "number"].includes(typeof options)) {
    options = { label: options };
  }
  if (options.label) {
    options.focus = 0;
    options.body = options.textarea ? `<div class="w2ui-prompt textarea">
                 <div>${options.label}</div>
                 <textarea id="w2prompt" class="w2ui-input" ${options.attrs ?? ""}
                    data-keydown="keydown|event" data-keyup="change|event"></textarea>
               </div>` : `<div class="w2ui-prompt w2ui-centered">
                 <label>${options.label}</label>
                 <input id="w2prompt" class="w2ui-input" ${options.attrs ?? ""}
                    data-keydown="keydown|event" data-keyup="change|event">
               </div>`;
  }
  w2utils.extend(options, {
    title: w2utils.lang(title ?? options.title ?? "Notification"),
    showClose: false,
    modal: true,
    cancelAction: "cancel"
  });
  w2utils.normButtons(options, { ok: w2utils.lang("Ok"), cancel: w2utils.lang("Cancel") });
  if (query3("#w2ui-popup").length > 0 && w2popup.status != "closing") {
    prom = w2popup.message(options);
  } else {
    prom = w2popup.open(options);
  }
  if (prom.self.box) {
    prom.self["input"] = query3(prom.self.box).find("#w2prompt").get(0);
  } else {
    prom.self["input"] = query3("#w2ui-popup .w2ui-popup-body #w2prompt").get(0);
  }
  if (options.value != null) {
    prom.self["input"].value = options.value;
    prom.self["input"].select();
  }
  prom.change = function(callback) {
    prom.self.on("change", callback);
    return this;
  };
  prom.self.off(".prompt").on("open:after.prompt", (event2) => {
    const box = event2.detail.box ? event2.detail.box : query3("#w2ui-popup .w2ui-popup-body").get(0);
    w2utils.bindEvents(query3(box).find("#w2prompt"), {
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
    query3(box).find(".w2ui-eaction").trigger("keyup");
  }).on("action:after.prompt", (event2) => {
    if (typeof event2.detail.self?.close == "function") {
      event2.detail.self.close();
    }
    if (typeof callBack == "function") callBack(event2.detail.action);
  });
  return prom;
}
var w2popup = new Dialog();

// src/w2tooltip.ts
var query4 = query;
var Tooltip = class _Tooltip {
  // no need to extend w2base, as each individual tooltip extends it
  static active = {};
  defaults;
  // any: setColor is assigned dynamically inside ColorTooltip.initControls closure
  setColor;
  // optional hook — overridden in subclasses; declared as method stub to allow subclass override
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
      // add class for w2ui-tooltip-body
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
  trigger(event2, data) {
    if (arguments.length == 2) {
      const type = event2;
      event2 = data;
      data.type = type;
    }
    if (event2.overlay) {
      return event2.overlay.trigger(event2);
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
    options = w2utils.extend({}, this.defaults, options || {});
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
      overlay = new w2base();
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
      query4(anchor).off(`.${scope}`).on(`${options.autoShowOn}.${scope}`, (event2) => {
        self.show(overlay.name);
        event2.stopPropagation();
      });
      delete options.autoShowOn;
      options._keep = true;
    }
    if (options.autoHideOn) {
      const scope = "autoHide-" + overlay.name;
      query4(anchor).off(`.${scope}`).on(`${options.autoHideOn}.${scope}`, (event2) => {
        self.hide(overlay.name);
        event2.stopPropagation();
      });
      delete options.autoHideOn;
      options._keep = true;
    }
    overlay.off(".attach");
    const ret = {
      overlay,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      then: (callback) => {
        overlay.on("show:after.attach", (event2) => {
          callback(event2);
        });
        return ret;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      show: (callback) => {
        overlay.on("show.attach", (event2) => {
          callback(event2);
        });
        return ret;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hide: (callback) => {
        overlay.on("hide.attach", (event2) => {
          callback(event2);
        });
        return ret;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      update: (callback) => {
        overlay.on("update.attach", (event2) => {
          callback(event2);
        });
        return ret;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      move: (callback) => {
        overlay.on("move.attach", (event2) => {
          callback(event2);
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
      query4(ret.overlay.anchor).off(".autoShow-" + ret.overlay.name).off(".autoHide-" + ret.overlay.name);
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
      options.maxWidth = w2utils.getStrWidth(options.html, "", true);
    }
    if (options.maxWidth && w2utils.getStrWidth(options.html, "", true) >= options.maxWidth) {
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
      query4(overlay.box).find(".w2ui-overlay-body").attr("style", (options.style || "") + "; " + overlayStyles).removeClass(null).addClass("w2ui-overlay-body " + options.class + (options.draggable ? " w2ui-draggable" : "")).html(options.html);
      this.resize(overlay.name);
    } else {
      edata = this.trigger("show", { target: name, overlay });
      if (edata.isCancelled === true) return;
      query4("body").append(
        // pointer-events will be re-enabled leter
        `<div id="${overlay.id}" name="${name}" style="display: none; pointer-events: none" class="w2ui-overlay"
                        data-click="stop" data-focusin="stop">
                    <style></style>
                    <div class="w2ui-overlay-body w2ui-eaction ${options.class} ${options.draggable ? "w2ui-draggable" : ""}"
                            style="${options.style || ""}; ${overlayStyles}" ${options.draggable ? 'data-mousedown="startDrag|event"' : ""}>
                        ${options.html}
                    </div>
                </div>`
      );
      overlay.box = query4("#" + w2utils.escapeId(overlay.id))[0];
      overlay.displayed = true;
      const names = query4(overlay.anchor).data("tooltipName") ?? [];
      names.push(name);
      query4(overlay.anchor).data("tooltipName", names);
      w2utils.bindEvents(overlay.box, {});
      overlay.tmp.originalCSS = "";
      if (query4(overlay.anchor).length > 0) {
        overlay.tmp.originalCSS = query4(overlay.anchor)[0].style.cssText;
      }
      this.resize(overlay.name);
    }
    if (options.anchorStyle) {
      overlay.anchor.style.cssText += ";" + options.anchorStyle;
    }
    if (options.anchorClass) {
      if (!(options.anchorClass == "w2ui-focus" && overlay.anchor == document.body)) {
        query4(overlay.anchor).addClass(options.anchorClass);
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
    query4(overlay.box).show();
    overlay.tmp.observeTooltipResize.observe(overlay.box);
    overlay.tmp.observeAnchorResize.observe(overlay.anchor);
    overlay.tmp.observeAnchorMove.observe(overlay.anchor, { attributes: true });
    _Tooltip.observeRemove.observe(document.body, { subtree: true, childList: true });
    query4(overlay.box).css("opacity", 1).find(".w2ui-overlay-body").html(options.html);
    setTimeout(() => {
      query4(overlay.box).css({ "pointer-events": "auto" }).data("ready", "yes");
    }, 100);
    w2utils.bindEvents(query4(overlay.box).find(".w2ui-eaction"), this);
    delete overlay.needsUpdate;
    overlay.box.overlay = overlay;
    query4(overlay.box).off("mousedown.w2ui-bringfront").on("mousedown.w2ui-bringfront", () => {
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
      query4(queryEl).off(`.${scope}`).on(`scroll.${scope}`, (_event) => {
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
      const $anchor = query4(overlay.anchor);
      const scope = "tooltip-" + overlay.name;
      query4("html").off(`.${scope}`);
      if (options.hideOn.includes("doc-click")) {
        if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
          $anchor.off(`.${scope}-doc`).on(`click.${scope}-doc`, (event2) => {
            event2.stopPropagation();
          });
        }
        query4("html").on(`click.${scope}`, hide);
      }
      if (options.hideOn.includes("tooltip-click")) {
        query4(overlay.box).off(`click.${scope}`).on(`click.${scope}`, hide);
      }
      if (options.hideOn.includes("focus-change") || options.hideOn.includes("blur")) {
        query4("html").on(`focusin.${scope}`, (_e) => {
          if (document.activeElement != overlay.anchor) {
            self.hide(overlay.name);
          }
        });
      }
      if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
        $anchor.off(`.${scope}`);
        options.hideOn.forEach((event2) => {
          if (["doc-click", "focus-change", "blur"].indexOf(event2) == -1) {
            $anchor.on(`${event2}.${scope}`, { once: true }, hide);
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
      const names2 = query4(name).data("tooltipName") ?? [];
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
    query4("html").off(`.${scope}`);
    query4(document).off(`.${scope}`);
    overlay.box?.remove();
    overlay.box = null;
    overlay.displayed = false;
    const names = query4(overlay.anchor).data("tooltipName") ?? [];
    const ind = names.indexOf(overlay.name);
    if (ind != -1) names.splice(names.indexOf(overlay.name), 1);
    if (names.length == 0) {
      query4(overlay.anchor).removeData("tooltipName");
    } else {
      query4(overlay.anchor).data("tooltipName", names);
    }
    if (overlay.options.anchorStyle) {
      overlay.anchor.style.cssText = overlay.tmp.originalCSS;
    }
    query4(overlay.anchor).off(`.${scope}`).removeClass(overlay.options.anchorClass);
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
    const qBox = query4(overlay.box).css({
      left: pos.left + "px",
      top: pos.top + "px"
    });
    qBox.then((q) => {
      if (pos.width != null) {
        q.css("width", pos.width + "px").find(".w2ui-overlay-body").css("width", "100%");
      }
      if (pos.height != null) {
        q.css("height", pos.height + "px").find(".w2ui-overlay-body").css("height", "100%");
      }
      return q;
    }).find(".w2ui-overlay-body").removeClass("w2ui-arrow-right w2ui-arrow-left w2ui-arrow-top w2ui-arrow-bottom").addClass(pos.arrow.class).closest(".w2ui-overlay").find("style:first-child").text(pos.arrow.style);
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
      query4(overlay.box).css({ width: "", height: "", scroll: "auto" });
    }
    const scrollSize = w2utils.scrollBarSize();
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
    const min_width = w2utils.getStrWidth(options.html, "", true);
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
      arrow.class = anchor.arrow ? anchor.arrow : `w2ui-arrow-${pos}`;
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
        arrow.style = w2utils.stripSpaces(`#${overlay.id} .w2ui-overlay-body:after,
                            #${overlay.id} .w2ui-overlay-body:before {
                                --tip-size: ${arrowSize}px;
                                margin-${aType}: ${arrow.offset}px;
                            }`);
      }
    }
  }
  /**
   * Move overlay node to the end of its parent (typically body) so it stacks above other .w2ui-overlay siblings
   * without relying on z-index. No-op if it is already the last element child.
   */
  bringOverlayToFront(overlay) {
    if (!overlay || !overlay.box || !overlay.box.parentNode || !overlay.box.nextElementSibling) {
      return;
    }
    overlay.box.parentNode.appendChild(overlay.box);
  }
  startDrag(event2) {
    if (event2.preventDefault) {
      event2.preventDefault();
    }
    const el = query4(event2.target).closest(".w2ui-overlay");
    const overlay = el[0]?.overlay;
    if (overlay) {
      this.bringOverlayToFront(overlay);
    }
    const initial = {
      el,
      x: parseFloat(el.css("left")),
      // any: css(string) returns string when reading a property
      y: parseFloat(el.css("top")),
      pageX: event2.pageX,
      pageY: event2.pageY,
      moved: false,
      _removed: false
    };
    query4(document).off(".w2ui-drag").on("selectstart.w2ui-drag, dragstart.w2ui-drag", (e) => e.preventDefault()).find("body").addClass("w2ui-overlay-dragging");
    query4("html").off(".w2color").on("mousemove.w2color", mouseMove).on("mouseup.w2color", mouseUp);
    function mouseUp(_event) {
      query4("html").off(".w2color");
      query4(document).off("selectstart.w2ui-drag");
      query4(document).off("dragstart.w2ui-drag");
      query4(document.body).removeClass("w2ui-overlay-dragging");
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
    function mouseMove(event3) {
      const divX = event3.pageX - initial.pageX;
      const divY = event3.pageY - initial.pageY;
      if (Math.abs(divX) > 3 || Math.abs(divY) > 3) {
        initial.moved = true;
      }
      initial.el.css({
        left: initial.x + divX + "px",
        top: initial.y + divY + "px"
      });
      if (!initial._removed) {
        initial._removed = true;
        initial.el.find(":scope > .w2ui-overlay-body").removeClass("w2ui-arrow-right w2ui-arrow-left w2ui-arrow-top w2ui-arrow-bottom");
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
    this.defaults = w2utils.extend({}, this.defaults, {
      advanced: false,
      transparent: true,
      position: "top|bottom",
      class: "w2ui-white",
      color: "",
      updateInput: true,
      arrowSize: 12,
      autoResize: false,
      anchorClass: "w2ui-focus",
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
    options = w2utils.extend({}, this.defaults, options || {});
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
    overlay.on("show.attach", (event2) => {
      const overlay2 = event2.detail.overlay;
      const anchor2 = overlay2.anchor;
      const options2 = overlay2.options;
      if (["INPUT", "TEXTAREA"].includes(anchor2.tagName) && !options2.color && anchor2.value) {
        overlay2.tmp["initColor"] = anchor2.value;
      }
      delete overlay2.newColor;
    });
    overlay.on("show:after.attach", (_event) => {
      if (ret.overlay?.box) {
        const actions = query4(ret.overlay.box).find(".w2ui-eaction");
        w2utils.bindEvents(actions, this);
        this.initControls(ret.overlay);
      }
    });
    overlay.on("update:after.attach", (_event) => {
      if (ret.overlay?.box) {
        const actions = query4(ret.overlay.box).find(".w2ui-eaction");
        w2utils.bindEvents(actions, this);
        this.initControls(ret.overlay);
      }
    });
    overlay.on("hide.attach", (event2) => {
      const overlay2 = event2.detail.overlay;
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
      overlay.on("liveUpdate.attach", (event2) => {
        callback(event2);
      });
      return ret;
    };
    ret.select = (callback) => {
      overlay.on("select.attach", (event2) => {
        callback(event2);
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
      this.index = (query4(target).attr("index") ?? "").split(":").map(Number);
      name = query4(target).closest(".w2ui-overlay").attr("name");
    }
    const overlay = this.get(name);
    const edata = this.trigger("liveUpdate", { color, target: name, overlay, param: name });
    if (edata.isCancelled === true) return;
    if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName) && overlay.options.updateInput) {
      query4(overlay.anchor).val(color);
    }
    overlay.newColor = color;
    query4(overlay.box).find(".w2ui-color.w2ui-selected").removeClass("w2ui-selected");
    if (target) {
      query4(target).addClass("w2ui-selected");
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
      name = query4(name.target).closest(".w2ui-overlay").attr("name");
    }
    const overlay = this.get(name);
    const tab = query4(overlay.box).find(`.w2ui-color-tab:nth-child(${index})`);
    query4(overlay.box).find(".w2ui-color-tab").removeClass("w2ui-selected");
    query4(tab).addClass("w2ui-selected");
    query4(overlay.box).find(".w2ui-tab-content").hide().closest(".w2ui-colors").find(".tab-" + index).show();
  }
  // generate HTML with color pallent and controls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getColorHTML(name, options) {
    let html = `
            <div class="w2ui-colors-header w2ui-eaction" data-mousedown="startDrag|event">
                Colors
            </div>
            <div class="w2ui-colors">
                <div class="w2ui-tab-content tab-1">`;
    for (let i = 0; i < this.palette.length; i++) {
      html += '<div class="w2ui-color-row">';
      for (let j = 0; j < (this.palette[i]?.length ?? 0); j++) {
        const color = this.palette[i][j];
        let border = "";
        if (color === "FFFFFF") border = "; border: 1px solid #efefef";
        html += `
                    <div class="w2ui-color w2ui-eaction ${color === "TRANSPARENT" ? "w2ui-no-color" : ""} ${options.color == color ? "w2ui-selected" : ""}"
                        style="background-color: #${color + border};" name="${color}" index="${i}:${j}"
                        data-mousedown="select|'${color}'|event" data-mouseup="hide|${name}">&nbsp;
                    </div>`;
      }
      html += "</div>";
      if (i < 2) html += '<div style="height: 8px"></div>';
    }
    html += `
            <div style="height: 8px"></div>
            <div class="w2ui-colors-custom">
                ${this.getCustomColorsHTML(name)}
            </div>`;
    html += "</div>";
    html += `
            <div class="w2ui-tab-content tab-2" style="display: none">
                <div class="color-info">
                    <div class="color-preview-bg"><div class="color-preview"></div><div class="color-original"></div></div>
                    <div class="color-part">
                        <span>H</span> <input class="w2ui-input" name="h" maxlength="3" max="360" tabindex="101">
                        <span>R</span> <input class="w2ui-input" name="r" maxlength="3" max="255" tabindex="104">
                    </div>
                    <div class="color-part">
                        <span>S</span> <input class="w2ui-input" name="s" maxlength="3" max="100" tabindex="102">
                        <span>G</span> <input class="w2ui-input" name="g" maxlength="3" max="255" tabindex="105">
                    </div>
                    <div class="color-part">
                        <span>V</span> <input class="w2ui-input" name="v" maxlength="3" max="100" tabindex="103">
                        <span>B</span> <input class="w2ui-input" name="b" maxlength="3" max="255" tabindex="106">
                    </div>
                    <div class="color-part opacity">
                        <span>${w2utils.lang("Opacity")}</span>
                        <input class="w2ui-input" name="a" maxlength="5" max="1" tabindex="107">
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
                    <input class="w2ui-input final" name="hex" tabindex="107" style="width: 70px" readonly>
                    <div class="w2ui-color w2ui-color-picker w2ui-eaction" data-click="pickAndUse|${name}">
                        <span class="w2ui-icon w2ui-icon-eye-dropper"></span>
                    </div>
                </div>
            </div>`;
    html += `
            <div class="w2ui-color-tabs">
                <div class="w2ui-color-tab w2ui-selected w2ui-eaction" data-click="tabClick|1|event|this"><span class="w2ui-icon w2ui-icon-colors"></span></div>
                <div class="w2ui-color-tab w2ui-eaction" data-click="tabClick|2|event|this"><span class="w2ui-icon w2ui-icon-settings"></span></div>
                <div style="padding: 5px; width: 100%; text-align: right;">
                    ${typeof options.html == "string" ? options.html : ""}
                </div>
            </div>`;
    return html;
  }
  getCustomColorsHTML(name) {
    const options = this.get(name)?.options;
    let html = '<div class="w2ui-color-row" style="min-height: 21px">';
    _ColorTooltip.custom_colors.forEach((color, i) => {
      let border = "";
      if (color === "FFFFFF") border = "; border: 1px solid #efefef";
      html += `
                <div class="w2ui-color w2ui-eaction ${color === "TRANSPARENT" ? "w2ui-no-color" : ""} ${options.color == color ? "w2ui-selected" : ""}"
                    style="background-color: #${color + border};" name="${color}" index="c:${i}"
                    data-mousedown="select|'${color}'|event" data-mouseup="hide|${name}">&nbsp;
                </div>`;
    });
    html += `
                <div class="w2ui-color w2ui-color-picker w2ui-eaction" data-click="pickAndSelect|${name}|event">
                    <span class="w2ui-icon w2ui-icon-eye-dropper"></span>
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
    let rgb = w2utils.parseColor(color);
    if (rgb == null) {
      rgb = { r: 140, g: 150, b: 160, a: 1 };
    }
    let hsv = w2utils.rgb2hsv(rgb);
    if (options.advanced === true) {
      this.tabClick(2, overlay.name);
    }
    setColor(hsv, true, color ?? "");
    query4(overlay.box).off(".w2color").on("contextmenu.w2color", (event2) => {
      event2.preventDefault();
    }).find("input").off(".w2color").on("change.w2color", (event2) => {
      const el = query4(event2.target);
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
        hsv = w2utils.rgb2hsv(rgb);
      } else if (["h", "s", "v"].indexOf(name) !== -1) {
        color2[name] = val;
      }
      setColor(color2, true);
    });
    query4(overlay.box).find(".color-original").off(".w2color").on("click.w2color", (event2) => {
      const tmp = w2utils.parseColor(query4(event2.target).css("background-color"));
      if (tmp != null) {
        rgb = tmp;
        hsv = w2utils.rgb2hsv(rgb);
        setColor(hsv, true);
      }
    });
    const mDown = `${!w2utils.isMobile ? "mousedown" : "touchstart"}.w2color`;
    const mUp = `${!w2utils.isMobile ? "mouseup" : "touchend"}.w2color`;
    const mMove = `${!w2utils.isMobile ? "mousemove" : "touchmove"}.w2color`;
    query4(overlay.box).find(".palette, .rainbow, .alpha").off(".w2color").on(`${mDown}.w2color`, mouseDown);
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
      rgb = w2utils.hsv2rgb(hsv);
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
      query4(overlay.box).find(".color-preview").css("background-color", "#" + newColor);
      query4(overlay.box).find("input").each((el) => {
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
        query4(overlay.box).find(".color-original").css("background-color", "#" + color3);
        query4(overlay.box).find(".w2ui-color.w2ui-selected").removeClass("w2ui-selected");
        query4(overlay.box).find(`.w2ui-colors [name="${color3}"], .w2ui-colors [name="${initial2}"]`).addClass("w2ui-selected");
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
      const el1 = query4(overlay.box).find(".palette .value1");
      const el2 = query4(overlay.box).find(".rainbow .value2");
      const el3 = query4(overlay.box).find(".alpha .value2");
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
      const cl = w2utils.hsv2rgb(hsv.h, 100, 100);
      const rgb2 = `${cl.r},${cl.g},${cl.b}`;
      query4(overlay.box).find(".palette").css("background-image", `linear-gradient(90deg, rgba(${rgb2},0) 0%, rgba(${rgb2},1) 100%)`);
    }
    function mouseDown(event2) {
      const el = query4(this).find(".value1, .value2");
      const offset = el.prop("clientWidth") / 2;
      if (el.hasClass("move-x")) el.css({ left: event2.offsetX - offset + "px" });
      if (el.hasClass("move-y")) el.css({ top: event2.offsetY - offset + "px" });
      initial = {
        el,
        x: event2.pageX,
        y: event2.pageY,
        width: el.prop("parentNode").clientWidth,
        height: el.prop("parentNode").clientHeight,
        left: parseInt(el.css("left")),
        top: parseInt(el.css("top"))
      };
      mouseMove(event2);
      query4("html").off(".w2color").on(mMove, mouseMove).on(mUp, mouseUp);
    }
    function mouseUp(_event) {
      query4("html").off(".w2color");
    }
    function mouseMove(event2) {
      const el = initial.el;
      const divX = event2.pageX - initial.x;
      const divY = event2.pageY - initial.y;
      let newX = initial.left + divX;
      let newY = initial.top + divY;
      const offset = el.prop("clientWidth") / 2;
      if (newX < -offset) newX = -offset;
      if (newY < -offset) newY = -offset;
      if (newX > initial.width - offset) newX = initial.width - offset;
      if (newY > initial.height - offset) newY = initial.height - offset;
      if (el.hasClass("move-x")) el.css({ left: newX + "px" });
      if (el.hasClass("move-y")) el.css({ top: newY + "px" });
      const name = query4(el.get(0).parentNode).attr("name");
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async pickAndSelect(name, event2) {
    const color = await this.pickColor();
    if (typeof color == "string" && color.substr(0, 1) == "#" && [7, 9].includes(color.length)) {
      this.addCustomColor(color, name);
      const cnt = query4(event2.target).closest(".w2ui-colors-custom");
      cnt.html(this.getCustomColorsHTML(name));
      w2utils.bindEvents(cnt.find(".w2ui-eaction"), this);
      this.select(color.substr(1), name);
    }
  }
  async pickAndUse(_name) {
    const color = await this.pickColor();
    if (typeof color == "string" && color.substr(0, 1) == "#" && [7, 9].includes(color.length)) {
      const hsv = w2utils.rgb2hsv(w2utils.parseColor(color));
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
    this.defaults = w2utils.extend({}, this.defaults, {
      type: "normal",
      // can be normal, radio, check
      items: [],
      selected: null,
      // current selected
      render: null,
      spinner: false,
      msgNoItems: w2utils.lang("No items found"),
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
      class: "w2ui-white",
      anchorClass: "w2ui-focus",
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
    options = w2utils.extend({}, this.defaults, options || {});
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
    options.items = w2utils.normMenu(options.items, options);
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
        const actions = query4(ret.overlay.box).find(".w2ui-eaction");
        if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
          overlay.tmp._new_search = false;
          query4(overlay.anchor).on("input.search-trigger", () => {
            overlay.tmp._new_search = true;
            query4(overlay.anchor).off("input.search-trigger");
          });
        }
        w2utils.bindEvents(actions, this);
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
      query4(overlay.box).find(".w2ui-selected").each((el) => {
        el.click();
      });
    };
    overlay.on("hide:after.attach", (_event) => {
      w2tooltip.hide(overlay.name + "-tooltip");
    });
    ret.select = (callback) => {
      overlay.on("select.attach", (event2) => {
        callback(event2);
      });
      return ret;
    };
    ret.remove = (callback) => {
      overlay.on("remove.attach", (event2) => {
        callback(event2);
      });
      return ret;
    };
    ret.subMenu = (callback) => {
      overlay.on("subMenu.attach", (event2) => {
        callback(event2);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initControls(overlay) {
    let mdown = "mousedown";
    let mclick = "click";
    if (w2utils.isMobile) {
      mdown = "touchstart";
      mclick = "touchend";
    }
    query4(overlay.box).find(".w2ui-menu:not(.w2ui-sub-menu)").off(".w2menu").on("contextmenu.w2menu", (event2) => {
      event2.preventDefault();
    }).on(`${mdown}.w2menu`, { delegate: ".w2ui-menu-item" }, (event2) => {
      const dt = event2.delegate.dataset;
      const parents = query4(event2.delegate).closest(".w2ui-menu").data("parents");
      this.menuDown(overlay, event2, dt.index, parents);
      if (w2utils.isMobile) {
        event2.preventDefault();
      }
    }).on(`${mclick}.w2menu`, { delegate: ".w2ui-menu-item" }, (event2) => {
      const dt = event2.delegate.dataset;
      const parents = query4(event2.delegate).closest(".w2ui-menu").data("parents");
      this.menuClick(overlay, event2, parseInt(dt["index"] ?? "0"), parents);
    }).find(".w2ui-menu-item").off(".w2menu").on("mouseEnter.w2menu", (event2) => {
      const dt = event2.target.dataset;
      const item = overlay.options.items[dt["index"] ?? ""];
      const edata = this.trigger("mouseEnter", { overlay, item, originalEvent: event2 });
      if (edata.isCancelled) {
        return;
      }
      const tooltip = item?.tooltip;
      if (tooltip && dt["hassubmenu"] != "yes") {
        this.showTooltip(overlay.name, { tooltip, anchor: event2.target });
      }
      const _menu = query4(event2.target).closest(".w2ui-menu").get(0);
      if (_menu._evt && _menu._evt.target != event2.target) {
        this.closeSubMenu(_menu._evt);
      }
      if (dt["hassubmenu"] == "yes") {
        const _evt = {
          index: parseInt(dt["index"] ?? "0"),
          parents: _menu.dataset.parents !== "" ? _menu.dataset.parents.split("-").map((ind) => parseInt(ind)) : [],
          target: event2.target,
          originalEvent: event2,
          overlay
        };
        _menu._evt = _evt;
        this.openSubMenu(_evt);
      }
      edata.finish();
    }).on("mouseLeave.w2menu", (event2) => {
      const dt = event2.target.dataset;
      const item = overlay.options.items[dt["index"] ?? ""];
      const edata = this.trigger("mouseLeave", { overlay, item, originalEvent: event2 });
      if (edata.isCancelled) {
        return;
      }
      w2tooltip.hide(overlay.name + "-tooltip");
      edata.finish();
    }).find(".menu-help").off(".w2menu").on("mouseEnter.w2menu", (event2) => {
      const target = event2.target;
      const dt = target.parentNode?.parentNode;
      const tooltip = overlay.options.items[dt.dataset?.index]?.help;
      if (tooltip) {
        w2tooltip.show({
          name: overlay.name + "-help-tp",
          anchor: event2.target,
          html: tooltip,
          position: "right|left",
          hideOn: ["doc-click"]
        });
      }
    }).on("mouseLeave.w2menu", (_event) => {
      w2tooltip.hide(overlay.name + "-help-tp");
    });
    if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
      query4(overlay.anchor).off(".w2menu").on("input.w2menu", (_event) => {
      }).on("keyup.w2menu", (event2) => {
        event2._searchType = "filter";
        this.keyUp(overlay, event2);
      });
    }
    if (overlay.options.search) {
      query4(overlay.box).find("#menu-search").off(".w2menu").on("keyup.w2menu", (event2) => {
        event2._searchType = "search";
        this.keyUp(overlay, event2);
      });
    }
  }
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
    index = w2utils.isInt(index) ? parseInt(index) : 0;
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
            <div class="w2ui-menu">
                <div class="w2ui-no-items">
                    <div class="w2ui-spinner"></div>
                    ${w2utils.lang("Loading...")}
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
                <div class="w2ui-menu-search">
                    <span class="w2ui-icon w2ui-icon-search"></span>
                    <input id="menu-search" class="w2ui-input" type="text"/>
                </div>`;
      items.forEach((item) => item.hidden = false);
    }
    if (options.topHTML) {
      topHTML += `<div class="w2ui-menu-top">${options.topHTML}</div>`;
    }
    let menu_html = `
            ${topHTML}
            <div class="w2ui-menu" style="${options.menuStyle}" data-parents="${parents.join("-")}">
        `;
    items.forEach((mitem, f) => {
      icon = mitem.icon;
      const index = (parents.length > 0 ? parents.join("-") + "-" : "") + f;
      if (icon == null) icon = null;
      if (["radio", "check"].includes(options.type) && !Array.isArray(mitem.items) && mitem.group !== false) {
        if (mitem.checked === true) icon = "w2ui-icon-check";
        else icon = "w2ui-icon-empty";
      }
      if (mitem.hidden !== true) {
        let txt = mitem.text;
        let icon_dsp = "";
        if (typeof options.render === "function") txt = options.render(mitem, options);
        if (typeof txt == "function") txt = txt(mitem, options);
        if (icon) {
          const first = String(icon).trim().slice(0, 1);
          if (first == "#") {
            icon = `<span class="w2ui-icon w2ui-icon-empty" style="background-color: ${icon}"></span>`;
          } else if (first !== "<") {
            icon = `<span class="w2ui-icon ${icon}"></span>`;
          }
          icon_dsp = `<div class="menu-icon">${icon}</div>`;
        }
        if (mitem.removable == null && mitem.remove != null) {
          mitem.removable = mitem.remove;
        }
        if (mitem.type !== "break" && txt != null && txt !== "" && String(txt).substr(0, 2) != "--") {
          const classes = ["w2ui-menu-item"];
          if (options.altRows == true) {
            classes.push(count % 2 === 0 ? "w2ui-even" : "w2ui-odd");
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
          if (mitem.disabled === true) classes.push("w2ui-disabled");
          if (mitem._noSearchInside === true) classes.push("w2ui-no-search-inside");
          menu_html += `
                        <div index="${index}" class="${classes.join(" ")}" style="${mitem.style ? mitem.style : ""}"
                            data-index="${f}" data-hasSubmenu="${mitem.items != null ? "yes" : ""}">
                                <div style="width: ${parseInt(mitem.indent ?? 0)}px"></div>
                                ${icon_dsp}
                                <div class="menu-text" colspan="${colspan}">${w2utils.lang(txt)}</div>
                                <div class="menu-extra">${mitem.extra ?? ""}${count_dsp}</div>
                        </div>`;
          count++;
        } else {
          const divText = (txt ?? "").replace(/^-+/g, "");
          menu_html += `
                        <div index="${index}" class="w2ui-menu-divider ${divText != "" ? "has-text" : ""}">
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
                <div class="w2ui-no-items">
                    ${w2utils.lang(msg)}
                </div>`;
    }
    menu_html += "</div>";
    return menu_html;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  openSubMenu(event2) {
    const anchor = query4(event2.originalEvent.target).get(0);
    const { overlay } = event2;
    const { items } = overlay.options;
    const mitem = items[event2.index];
    let _items = [];
    if (typeof mitem.items == "function") {
      _items = mitem.items(mitem);
    } else if (Array.isArray(mitem.items)) {
      _items = mitem.items;
    }
    const prev = w2menu.get(overlay.name + "-submenu");
    if (prev) {
      prev.hide();
    }
    query4(event2.target).addClass("expanded");
    w2menu.show({
      name: overlay.name + "-submenu",
      anchor,
      items: _items,
      class: overlay.options.class + " " + mitem.overlay?.class,
      offsetX: -7,
      arrowSize: 0,
      parentOverlay: overlay,
      parents: [...event2.parents, event2.index],
      position: "right|left",
      hideOn: ["doc-click", "select"]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).hide((_evt) => {
      query4(event2.target).removeClass("expanded");
    });
    setTimeout(() => {
      query4("#w2overlay-" + overlay.name + "-submenu").on("mouseenter", (event3) => {
        event3.target._keepSubOpen = true;
      }).on("mouseleave", (event3) => {
        event3.target._keepSubOpen = false;
      });
    }, 10);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  closeSubMenu(event2) {
    const { overlay } = event2;
    if (event2.target._keepSubOpen !== true) {
      const prev = w2menu.get(overlay.name + "-submenu");
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
    const view = query4(overlay.box).find(".w2ui-overlay-body").get(0);
    const search = query4(overlay.box).find(".w2ui-menu-search, .w2ui-menu-top").get(0);
    query4(overlay.box).find(".w2ui-menu-item.w2ui-selected").removeClass("w2ui-selected");
    const el = query4(overlay.box).find(`.w2ui-menu-item[index="${overlay.selected}"]`).addClass("w2ui-selected").get(0);
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
    w2tooltip.hide(overlay.name + "-tooltip");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showTooltip(name, options) {
    const overlay = Tooltip.active[name.replace(/[\s\.#]/g, "_")];
    if (!overlay || !overlay.displayed) return;
    const anchor = options?.anchor ?? query4(overlay.box).find(`.w2ui-menu-item[index="${overlay.selected}"]`).get(0);
    const tooltip = options?.tooltip ?? (overlay.selected != null ? overlay.options.items?.[overlay.selected]?.tooltip : void 0);
    if (tooltip) {
      const html = tooltip.html ?? tooltip;
      w2tooltip.show(Object.assign({
        name: overlay.name + "-tooltip",
        anchor,
        html,
        position: "right|left",
        hideOn: ["doc-click"],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onShow(event2) {
          overlay.self.trigger("tooltip", { overlay, action: "show", originalEvent: event2 });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onHide(event2) {
          overlay.self.trigger("tooltip", { overlay, action: "hide", originalEvent: event2 });
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
    w2tooltip.hide(overlay.name + "-tooltip");
    query4(overlay.box).find(".w2ui-no-items").hide();
    query4(overlay.box).find(".w2ui-menu-item, .w2ui-menu-divider").each((el) => {
      const cur = this.getCurrent(name, el.getAttribute("index"));
      if (cur.item?.hidden) {
        query4(el).hide();
      } else {
        const search = overlay.tmp?.["search"];
        if (overlay.options.markSearch) {
          w2utils.marker(el, search, { onlyFirst: overlay.options.match == "begins" });
        }
        query4(el).show();
      }
    });
    query4(overlay.box).find(".w2ui-sub-menu").each((sub) => {
      const hasItems = query4(sub).find(".w2ui-menu-item").get().some((el) => {
        return el.style.display != "none" ? true : false;
      });
      const parent = this.getCurrent(name, sub.dataset?.parent);
      if (parent.item.expanded) {
        if (!hasItems) {
          query4(sub).parent().hide();
        } else {
          query4(sub).parent().show();
        }
      }
    });
    if (overlay.tmp["searchCount"] == 0 || (overlay.options?.items?.length ?? 0) == 0) {
      if (query4(overlay.box).find(".w2ui-no-items").length == 0) {
        query4(overlay.box).find(".w2ui-menu:not(.w2ui-sub-menu)").append(`
                    <div class="w2ui-no-items">
                        ${w2utils.lang(overlay.options.msgNoItems)}
                    </div>`);
      }
      query4(overlay.box).find(".w2ui-no-items").show();
    }
  }
  /**
   * Loops through the items and markes item.hidden = true for those that need to be hidden, and item.hidden = false
   * for those that are visible. Return a promise (since items can be on the server) with the number of visible items.
   */
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
      let msg = w2utils.lang("Loading...");
      if (search.length < (options.minLength ?? 0) && remote.emptySet !== true) {
        msg = w2utils.lang("${count} letters or more...", { count: String(options.minLength) });
        proceed = false;
        if (search === "") {
          msg = w2utils.lang(options.msgSearch);
        }
        if ((options.items?.length ?? 0) > 0) {
          this.update(name, []);
          this.applyFilter(name, null, search);
        }
      }
      query4(overlay.box).find(".w2ui-no-items").html(msg);
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
        const fetchOptions = w2utils.prepareParams(url, {
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
          resolve(w2utils.normMenu(data.records, data));
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuDown(overlay, event2, index, parents) {
    const options = overlay.options;
    let items = options.items;
    const icon = query4(event2.delegate).find(".w2ui-icon");
    const menu = query4(event2.target).closest(".w2ui-menu:not(.w2ui-sub-menu)");
    if (typeof items == "function") {
      items = items({ overlay, index, parents, event: event2 });
    }
    const item = items[index];
    if (item == null || item.disabled) {
      return;
    }
    const uncheck = (items2, parent) => {
      items2.forEach((other, ind) => {
        if (other.id == item.id) return;
        if (other.group === item.group && other.checked) {
          menu.find(`.w2ui-menu-item[index="${(parent ? parent + "-" : "") + ind}"] .w2ui-icon`).removeClass("w2ui-icon-check").addClass("w2ui-icon-empty");
          items2[ind].checked = false;
        }
        if (Array.isArray(other.items)) {
          uncheck(other.items, ind);
        }
      });
    };
    if ((options.type === "check" || options.type === "radio") && item.group !== false && !query4(event2.target).hasClass("menu-remove") && !query4(event2.target).hasClass("menu-help") && !query4(event2.target).closest(".w2ui-menu-item").hasClass("has-sub-menu")) {
      item.checked = options.type == "radio" ? true : !item.checked;
      if (item.checked) {
        if (options.type === "radio") {
          query4(event2.target).closest(".w2ui-menu").find(".w2ui-icon").removeClass("w2ui-icon-check").addClass("w2ui-icon-empty");
        }
        if (options.type === "check" && item.group != null) {
          uncheck(options.items);
        }
        icon.removeClass("w2ui-icon-empty").addClass("w2ui-icon-check");
      } else if (options.type === "check") {
        icon.removeClass("w2ui-icon-check").addClass("w2ui-icon-empty");
      }
    }
    if (!query4(event2.target).hasClass("menu-remove") && !query4(event2.target).hasClass("menu-help")) {
      menu.find(".w2ui-menu-item").removeClass("w2ui-selected");
      if (!query4(event2.delegate).hasClass("has-sub-menu")) {
        query4(event2.delegate).addClass("w2ui-selected");
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuClick(overlay, event2, index, parents) {
    const options = overlay.options;
    let items = options.items;
    const $item = query4(event2.delegate).closest(".w2ui-menu-item");
    let keepOpen = options.hideOn.includes("select") ? false : true;
    if (event2.shiftKey || event2.metaKey || event2.ctrlKey) {
      keepOpen = true;
    }
    if (typeof items == "function") {
      items = items({ overlay, index, parents, event: event2 });
    }
    const item = items[index];
    if (!item || item.disabled && !query4(event2.target).hasClass("menu-remove")) {
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
    if (query4(event2.target).hasClass("menu-remove")) {
      edata = topOverlay.trigger("remove", {
        originalEvent: event2,
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
      const name = $item.closest(".w2ui-overlay").attr("name");
      overlay.self.update(name, items2);
    } else if ($item.hasClass("has-sub-menu")) {
      edata = topOverlay.trigger("subMenu", {
        originalEvent: event2,
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
        originalEvent: event2,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyUp(overlay, event2) {
    const options = overlay.options;
    const search = event2.target.value;
    let filter = true;
    let refreshIndex = false;
    switch (event2.keyCode) {
      case 46:
      // delete
      case 8: {
        if (search === "" && !overlay.displayed) filter = false;
        break;
      }
      case 13: {
        if (!overlay.displayed || !overlay.selected) return;
        const { index, parents } = this.getCurrent(overlay.name);
        event2.delegate = query4(overlay.box).find(".w2ui-selected").get(0);
        this.menuClick(overlay, event2, parseInt(String(index)), parents);
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
          event2.delegate = query4(overlay.box).find(`.w2ui-menu-item[index="${index}"]`).get(0);
          overlay.selected = index;
          this.menuClick(overlay, event2, parseInt(String(index)), parents);
        }
        filter = false;
        break;
      }
      case 39: {
        if (!overlay.displayed) return;
        const { item, index, parents } = this.getCurrent(overlay.name);
        if (Array.isArray(item?.items) && item.items.length > 0 && !item.expanded) {
          event2.delegate = query4(overlay.box).find(".w2ui-selected").get(0);
          this.menuClick(overlay, event2, parseInt(String(index)), parents);
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
        event2.preventDefault();
        break;
      }
      case 40: {
        if (!overlay.displayed) {
          break;
        }
        overlay.next();
        filter = false;
        event2.preventDefault();
        break;
      }
    }
    if (filter && overlay.displayed && (options.filter && event2._searchType == "filter" || options.search && event2._searchType == "search")) {
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
    this.defaults = w2utils.extend({}, this.defaults, {
      position: "top|bottom",
      class: "w2ui-calendar",
      type: "date",
      // can be date/time/datetime
      value: "",
      // initial date (in w2utils.settings format)
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
      anchorClass: "w2ui-focus",
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
    options = w2utils.extend({}, this.defaults, options || {});
    if (prevHideOn) {
      options.hideOn = prevHideOn;
    }
    if (!options.format) {
      const df = w2utils.settings.dateFormat;
      const tf = w2utils.settings.timeFormat;
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
    overlay.on("show.attach", (event2) => {
      const overlay2 = event2.detail.overlay;
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
    overlay.on("hide.attach", (event2) => {
      const overlay2 = event2.detail.overlay;
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
      overlay.on("select.attach", (event2) => {
        callback(event2);
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
      query4(overlay.box).find(".w2ui-overlay-body").html(cal.html);
      this.initControls(overlay);
    };
    const checkJump = (event2, dblclick) => {
      query4(event2.target).parent().find(".w2ui-jump-month, .w2ui-jump-year").removeClass("w2ui-selected");
      query4(event2.target).addClass("w2ui-selected");
      const dt = /* @__PURE__ */ new Date();
      let { jumpMonth, jumpYear } = overlay.tmp;
      if (dblclick) {
        if (jumpYear == null) jumpYear = dt.getFullYear();
        if (jumpMonth == null) jumpMonth = dt.getMonth() + 1;
      }
      if (jumpMonth && jumpYear) {
        const cal = this.getMonthHTML(options, jumpMonth, jumpYear);
        Object.assign(overlay.tmp, cal);
        query4(overlay.box).find(".w2ui-overlay-body").html(cal.html);
        overlay.tmp.jump = false;
        this.initControls(overlay);
      }
    };
    query4(overlay.box).find(".w2ui-cal-title").off(".calendar").on("click.calendar", (event2) => {
      if (options.draggable && overlay.tmp?.moved) {
        event2.stopPropagation();
        return;
      }
      Object.assign(overlay.tmp, { jumpYear: null, jumpMonth: null });
      if (overlay.tmp.jump) {
        const { month, year } = overlay.tmp;
        const cal = this.getMonthHTML(options, month, year);
        query4(overlay.box).find(".w2ui-overlay-body").html(cal.html);
        overlay.tmp.jump = false;
      } else {
        query4(overlay.box).find(".w2ui-overlay-body .w2ui-cal-days").replace(this.getYearHTML());
        const el = query4(overlay.box).find(`[name="${overlay.tmp.year}"]`).get(0);
        if (el) el.scrollIntoView(true);
        overlay.tmp.jump = true;
      }
      this.initControls(overlay);
      event2.stopPropagation();
    }).find(".w2ui-cal-previous").off(".calendar").on("click.calendar", (event2) => {
      moveMonth(-1);
      event2.stopPropagation();
    }).parent().find(".w2ui-cal-next").off(".calendar").on("click.calendar", (event2) => {
      moveMonth(1);
      event2.stopPropagation();
    });
    query4(overlay.box).find(".w2ui-cal-now").off(".calendar").on("click.calendar", (_event) => {
      if (options.type == "datetime") {
        if (overlay.newDate) {
          overlay.newValue = w2utils.formatTime(/* @__PURE__ */ new Date(), options.format.split("|")[1]);
        } else {
          overlay.newValue = w2utils.formatDateTime(/* @__PURE__ */ new Date(), options.format);
        }
      } else if (options.type == "date") {
        overlay.newValue = w2utils.formatDate(/* @__PURE__ */ new Date(), options.format);
      } else if (options.type == "time") {
        overlay.newValue = w2utils.formatTime(/* @__PURE__ */ new Date(), options.format);
      }
      this.hide(overlay.name);
    });
    query4(overlay.box).off(".calendar").on("contextmenu.calendar", (event2) => {
      event2.preventDefault();
    }).on("click.calendar", { delegate: ".w2ui-day.w2ui-date" }, (event2) => {
      if (options.type == "datetime") {
        overlay.newDate = query4(event2.target).attr("date");
        query4(overlay.box).find(".w2ui-overlay-body").html(this.getHourHTML(overlay.options).html);
        this.initControls(overlay);
      } else {
        overlay.newValue = query4(event2.target).attr("date");
        this.hide(overlay.name);
      }
    }).on("click.calendar", { delegate: ".w2ui-jump-month" }, (event2) => {
      overlay.tmp.jumpMonth = parseInt(query4(event2.target).attr("name") ?? "0");
      checkJump(event2);
    }).on("dblclick.calendar", { delegate: ".w2ui-jump-month" }, (event2) => {
      overlay.tmp.jumpMonth = parseInt(query4(event2.target).attr("name") ?? "0");
      checkJump(event2, true);
    }).on("click.calendar", { delegate: ".w2ui-jump-year" }, (event2) => {
      overlay.tmp.jumpYear = parseInt(query4(event2.target).attr("name") ?? "0");
      checkJump(event2);
    }).on("dblclick.calendar", { delegate: ".w2ui-jump-year" }, (event2) => {
      overlay.tmp.jumpYear = parseInt(query4(event2.target).attr("name") ?? "0");
      checkJump(event2, true);
    }).on("click.calendar", { delegate: ".w2ui-time.hour" }, (event2) => {
      const hour = Number(query4(event2.target).attr("hour"));
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
        query4(overlay.box).find(".w2ui-overlay-body").html(html);
        this.initControls(overlay);
      }
    }).on("click.calendar", { delegate: ".w2ui-time.min" }, (event2) => {
      const hour = Math.floor((this.str2min(overlay.newValue) ?? 0) / 60);
      const time = hour * 60 + parseInt(query4(event2.target).attr("min"));
      overlay.newValue = this.min2str(time, options.format);
      this.hide(overlay.name);
    });
    w2utils.bindEvents(query4(overlay.box).find(".w2ui-eaction"), this);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMonthHTML(options, month, year) {
    const days = w2utils.settings.fulldays.slice();
    const sdays = w2utils.settings.shortdays.slice();
    if (w2utils.settings.weekStarts !== "M") {
      days.unshift(days.pop());
      sdays.unshift(sdays.pop());
    }
    let DT = /* @__PURE__ */ new Date();
    const dayLengthMil = 1e3 * 60 * 60 * 24;
    const selected = options.type === "datetime" ? w2utils.isDateTime(options.value, options.format, true) : w2utils.isDate(options.value, options.format, true);
    const selected_dsp = w2utils.formatDate(selected);
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
    const st = w2utils.settings.weekStarts;
    for (let i = 0; i < sdays.length; i++) {
      const isSat = st == "M" && i == 5 || st != "M" && i == 6 ? true : false;
      const isSun = st == "M" && i == 6 || st != "M" && i == 0 ? true : false;
      weekDaysHeaderHTML += `<div class="w2ui-day w2ui-weekday ${isSat ? "w2ui-sunday" : ""} ${isSun ? "w2ui-saturday" : ""}">${sdays[i]}</div>`;
    }
    const calTitleClass = "w2ui-cal-title" + (options.draggable ? " w2ui-eaction w2ui-draggable" : "");
    const calTitleData = options.draggable ? ' data-mousedown="startDrag|event"' : "";
    let html = `
            <div class="${calTitleClass}"${calTitleData}>
                <div class="w2ui-cal-previous w2ui-eaction" data-mousedown="stop">
                    <div></div>
                </div>
                <div class="w2ui-cal-next w2ui-eaction" data-mousedown="stop">
                    <div></div>
                </div>
                ${w2utils.settings.fullmonths[month - 1]}, ${year}
                <span class="arrow-down"></span>
            </div>
            <div class="w2ui-cal-days">
                ${weekDaysHeaderHTML}
        `;
    DT = new Date(year, month - 1, 1);
    DT = new Date(DT.getTime() + dayLengthMil * 0.5);
    let weekDayOffset = DT.getDay();
    if (w2utils.settings.weekStarts == "M") {
      weekDayOffset = weekDayOffset > 0 ? weekDayOffset - 1 : 6;
    }
    DT = new Date(DT.getTime() - weekDayOffset * dayLengthMil);
    const DaySat = 6, DaySun = 0;
    for (let ci = 0; ci < 42; ci++) {
      const className = [];
      const dt = `${DT.getFullYear()}/${DT.getMonth() + 1}/${DT.getDate()}`;
      if (DT.getDay() === DaySat) className.push("w2ui-saturday");
      if (DT.getDay() === DaySun) className.push("w2ui-sunday");
      if (DT.getMonth() + 1 !== month) className.push("outside");
      if (dt == this.today) className.push("w2ui-today");
      const dspDay = DT.getDate();
      let col = "";
      let bgcol = "";
      let tmp_dt, tmp_dt_fmt;
      if (options.type === "datetime") {
        tmp_dt = w2utils.formatDateTime(dt, options.format);
        tmp_dt_fmt = w2utils.formatDate(dt, w2utils.settings.dateFormat);
      } else {
        tmp_dt = w2utils.formatDate(dt, options.format);
        tmp_dt_fmt = tmp_dt;
      }
      if (options.colored && options.colored[tmp_dt_fmt] !== void 0) {
        const tmp = options.colored[tmp_dt_fmt].split("|");
        bgcol = "background-color: " + tmp[0] + ";";
        col = "color: " + tmp[1] + ";";
      }
      html += `<div class="w2ui-day ${this.inRange(tmp_dt, options, true) ? "w2ui-date " + (tmp_dt_fmt == selected_dsp ? "w2ui-selected" : "") : "w2ui-blocked"} ${className.join(" ")}"
                       style="${col + bgcol}" date="${tmp_dt_fmt}" data-date="${DT.getTime()}">
                            ${dspDay}
                    </div>`;
      DT = new Date(DT.getTime() + dayLengthMil);
    }
    html += "</div>";
    if (options.btnNow) {
      const label = w2utils.lang("Today" + (options.type == "datetime" ? " & Now" : ""));
      html += `<div class="w2ui-cal-now">${label}</div>`;
    }
    return { html, month, year };
  }
  getYearHTML() {
    let mhtml = "";
    let yhtml = "";
    for (let m = 0; m < w2utils.settings.fullmonths.length; m++) {
      mhtml += `<div class="w2ui-jump-month" name="${m + 1}">${w2utils.settings.shortmonths[m]}</div>`;
    }
    for (let y = w2utils.settings.dateStartYear; y <= w2utils.settings.dateEndYear; y++) {
      yhtml += `<div class="w2ui-jump-year" name="${y}">${y}</div>`;
    }
    return `<div class="w2ui-cal-jump">
            <div id="w2ui-jump-month">${mhtml}</div>
            <div id="w2ui-jump-year">${yhtml}</div>
        </div>`;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getHourHTML(options) {
    options = options ?? {};
    if (!options.format) options.format = w2utils.settings.timeFormat;
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
        const dt = w2utils.isDateTime(value, options.format, true);
        const fm = options.format.split("|")[0].trim();
        tm1 = w2utils.formatDate(dt, fm) + " " + tm1;
        tm2 = w2utils.formatDate(dt, fm) + " " + tm2;
      }
      const valid = this.inRange(tm1, options) || this.inRange(tm2, options);
      tmp[Math.floor(a / 8)] += `<span hour="${a}"
                class="hour ${valid ? "w2ui-time " : "w2ui-blocked"}">${time}</span>`;
    }
    const timeTitleClass = "w2ui-time-title" + (options.draggable ? " w2ui-eaction w2ui-draggable" : "");
    const timeTitleData = options.draggable ? ' data-mousedown="startDrag|event"' : "";
    const html = `<div class="w2ui-calendar">
            <div class="${timeTitleClass}"${timeTitleData}>${w2utils.lang("Select Hour")}</div>
            <div class="w2ui-cal-time">
                <div class="w2ui-cal-column">${tmp[0]}</div>
                <div class="w2ui-cal-column">${tmp[1]}</div>
                <div class="w2ui-cal-column">${tmp[2]}</div>
            </div>
            ${options.btnNow ? `<div class="w2ui-cal-now">${w2utils.lang("Now")}</div>` : ""}
        </div>`;
    return { html };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getMinHTML(hour, options) {
    if (hour == null) hour = 0;
    options = options ?? {};
    if (!options.format) options.format = w2utils.settings.timeFormat;
    const h24 = options.format.indexOf("h24") > -1;
    const value = options.value ? options.value : options.anchor ? options.anchor.value : "";
    const tmp = [];
    for (let a = 0; a < 60; a += 5) {
      const time = (hour > 12 && !h24 ? hour - 12 : hour) + ":" + (a < 10 ? 0 : "") + a + " " + (!h24 ? hour < 12 ? "am" : "pm" : "");
      let tm = time;
      const ind = a < 20 ? 0 : a < 40 ? 1 : 2;
      if (!tmp[ind]) tmp[ind] = "";
      if (options.type === "datetime") {
        const dt = w2utils.isDateTime(value, options.format, true);
        const fm = options.format.split("|")[0].trim();
        tm = w2utils.formatDate(dt, fm) + " " + tm;
      }
      tmp[ind] += `<span min="${a}" class="min ${this.inRange(tm, options) ? "w2ui-time " : "w2ui-blocked"}">${time}</span>`;
    }
    const timeTitleClass = "w2ui-time-title" + (options.draggable ? " w2ui-eaction w2ui-draggable" : "");
    const timeTitleData = options.draggable ? ' data-mousedown="startDrag|event"' : "";
    const html = `<div class="w2ui-calendar">
            <div class="${timeTitleClass}"${timeTitleData}>${w2utils.lang("Select Minute")}</div>
            <div class="w2ui-cal-time">
                <div class="w2ui-cal-column">${tmp[0]}</div>
                <div class="w2ui-cal-column">${tmp[1]}</div>
                <div class="w2ui-cal-column">${tmp[2]}</div>
            </div>
            ${options.btnNow ? `<div class="w2ui-cal-now">${w2utils.lang("Now")}</div>` : ""}
        </div>`;
    return { html };
  }
  // checks if date is in range (loost at start, end, blockDates, blockWeekdays)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inRange(str, options, dateOnly) {
    let inRange = false;
    if (options.type === "date") {
      const dt = w2utils.isDate(str, options.format, true);
      if (dt) {
        if (options.start || options.end) {
          const st = typeof options.start === "string" ? options.start : query4(options.start).val();
          const en = typeof options.end === "string" ? options.end : query4(options.end).val();
          let start = w2utils.isDate(st, options.format, true);
          let end = w2utils.isDate(en, options.format, true);
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
      const dt = w2utils.isDateTime(str, options.format, true);
      if (dt) {
        const format = options.format.split("|").map((format2) => format2.trim());
        if (dateOnly) {
          const date = w2utils.formatDate(dt, format[0]);
          const opts = w2utils.extend({}, options, { type: "date", format: format[0] });
          if (this.inRange(date, opts)) inRange = true;
        } else {
          const time = w2utils.formatTime(dt, format[1]);
          const opts = { type: "time", format: format[1], start: options.startTime, end: options.endTime };
          if (this.inRange(time, opts)) inRange = true;
        }
      }
    }
    return inRange;
  }
  // converts time into number of minutes since midnight -- '11:50am' => 710
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  min2str(time, format) {
    let ret = "";
    if (time >= 24 * 60) time = time % (24 * 60);
    if (time < 0) time = 24 * 60 + time;
    const hour = Math.floor(time / 60);
    const min = (time % 60 < 10 ? "0" : "") + time % 60;
    if (!format) {
      format = w2utils.settings.timeFormat;
    }
    if (format.indexOf("h24") !== -1) {
      ret = hour + ":" + min;
    } else {
      ret = (hour <= 12 ? hour : hour - 12) + ":" + min + " " + (hour >= 12 ? "pm" : "am");
    }
    return ret;
  }
};
var w2tooltip = new Tooltip();
var w2menu = new MenuTooltip();
var w2color = new ColorTooltip();
var w2date = new DateTooltip();

// src/w2field.ts
var query5 = query;
var w2menu2 = w2menu;
var w2color2 = w2color;
var w2date2 = w2date;
var w2tooltip2 = w2tooltip;
var w2field = class extends w2base {
  el;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selected;
  // any: can be null, an object (list), or an array (enum/file)
  helpers;
  type;
  options;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick;
  // any: event callback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onAdd;
  // any: event callback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onNew;
  // any: event callback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRemove;
  // any: event callback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMouseEnter;
  // any: event callback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMouseLeave;
  // any: event callback
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onScroll;
  // any: event callback
  tmp;
  constructor(type, options) {
    super();
    if (typeof type == "string" && options == null) {
      options = { type };
    }
    if (typeof type == "object" && options == null) {
      options = w2utils.clone(type);
    }
    if (typeof type == "string" && typeof options == "object") {
      options.type = type;
    }
    const opts = options;
    opts.type = String(opts.type).toLowerCase();
    this.el = opts.el ?? null;
    this.selected = null;
    this.helpers = {};
    this.type = opts.type ?? "text";
    this.options = w2utils.clone(opts);
    this.onClick = opts.onClick ?? null;
    this.onAdd = opts.onAdd ?? null;
    this.onNew = opts.onNew ?? null;
    this.onRemove = opts.onRemove ?? null;
    this.onMouseEnter = opts.onMouseEnter ?? null;
    this.onMouseLeave = opts.onMouseLeave ?? null;
    this.onScroll = opts.onScroll ?? null;
    this.tmp = {};
    delete this.options.type;
    delete this.options.onClick;
    delete this.options.onMouseEnter;
    delete this.options.onMouseLeave;
    delete this.options.onScroll;
    if (this.el) {
      this.render(this.el);
    }
  }
  render(el) {
    if (!(el instanceof HTMLElement)) {
      console.log("ERROR: Cannot init w2field on empty subject");
      return;
    }
    const fieldEl = el;
    fieldEl._w2field?.reset?.();
    fieldEl._w2field = this;
    this.el = fieldEl;
    this.init();
  }
  init() {
    let options = this.options;
    let defaults;
    if (this.el == null || !["INPUT", "TEXTAREA"].includes(this.el.tagName.toUpperCase())) {
      console.log("ERROR: w2field could only be applied to INPUT or TEXTAREA.", this.el);
      return;
    }
    const _fieldEl = this.el;
    switch (this.type) {
      case "text":
      case "int":
      case "float":
      case "money":
      case "currency":
      case "percent":
      case "alphanumeric":
      case "bin":
      case "hex": {
        defaults = {
          min: null,
          max: null,
          step: 1,
          autoFormat: true,
          autoCorrect: true,
          currency: {
            prefix: w2utils.settings.currencyPrefix,
            suffix: w2utils.settings.currencySuffix,
            precision: w2utils.settings.currencyPrecision
          },
          decimalSymbol: w2utils.settings.decimalSymbol,
          groupSymbol: w2utils.settings.groupSymbol,
          arrows: false,
          keyboard: true,
          precision: null,
          prefix: "",
          suffix: ""
        };
        this.options = w2utils.extend({}, defaults, options);
        options = this.options;
        options.numberRE = new RegExp("[" + options.groupSymbol + "]", "g");
        options.moneyRE = new RegExp("[" + options.currency.prefix + options.currency.suffix + options.groupSymbol + "]", "g");
        options.percentRE = new RegExp("[" + options.groupSymbol + "%]", "g");
        if (["text", "alphanumeric", "hex", "bin"].includes(this.type)) {
          options.arrows = false;
          options.keyboard = false;
        }
        break;
      }
      case "color": {
        const size = parseInt(getComputedStyle(this.el)["font-size"] ?? "12") || 12;
        defaults = {
          prefix: "#",
          suffix: `<div style="width: ${size}px; height: ${size}px; margin-top: -2px;
                                    position: relative; top: 50%; transform: translateY(-50%);">&#160;</div>`,
          arrows: false,
          advanced: null,
          // open advanced by default
          transparent: true
        };
        this.options = w2utils.extend({}, defaults, options);
        options = this.options;
        break;
      }
      case "date": {
        defaults = {
          format: w2utils.settings.dateFormat,
          // date format
          keyboard: true,
          // if true, allows to select date with format
          autoCorrect: true,
          // correc date or shows the error
          start: null,
          // first date allowed to select
          end: null,
          // last date allowed to select
          blockDates: [],
          // array of blocked dates
          blockWeekdays: [],
          // blocked weekdays 0 - sunday, 1 - monday, etc
          colored: {},
          // ex: { '3/13/2022': 'bg-color|text-color' }
          btnNow: true
          // if true, displays Now button
        };
        this.options = w2utils.extend({ type: "date" }, defaults, options);
        options = this.options;
        if (query5(this.el).attr("placeholder") == null) {
          query5(this.el).attr("placeholder", options.format);
        }
        break;
      }
      case "time": {
        defaults = {
          format: w2utils.settings.timeFormat,
          keyboard: true,
          autoCorrect: true,
          start: null,
          end: null,
          btnNow: true,
          noMinutes: false
        };
        this.options = w2utils.extend({ type: "time" }, defaults, options);
        options = this.options;
        if (query5(this.el).attr("placeholder") == null) {
          query5(this.el).attr("placeholder", options.format);
        }
        break;
      }
      case "datetime": {
        defaults = {
          format: w2utils.settings.dateFormat + "|" + w2utils.settings.timeFormat,
          keyboard: true,
          autoCorrect: true,
          start: null,
          end: null,
          startTime: null,
          endTime: null,
          blockDates: [],
          // array of blocked dates
          blockWeekdays: [],
          // blocked weekdays 0 - sunday, 1 - monday, etc
          colored: {},
          // ex: { '3/13/2022': 'bg-color|text-color' }
          btnNow: true,
          noMinutes: false
        };
        this.options = w2utils.extend({ type: "datetime" }, defaults, options);
        options = this.options;
        if (query5(this.el).attr("placeholder") == null) {
          query5(this.el).attr("placeholder", options.placeholder || options.format);
        }
        break;
      }
      case "list":
      case "combo": {
        defaults = {
          items: [],
          // array of items, can be a function
          selected: {},
          // selected item
          itemMap: null,
          // can be { id: 'id', text: 'text' } to specify field mapping for an item
          match: "begins",
          // ['contains', 'is', 'begins', 'ends']
          filter: true,
          // weather to filter at all
          compare: null,
          // compare function for filtering
          prefix: "",
          // prefix for input
          suffix: "",
          // sufix for input
          icon: null,
          // icon class for selected item
          iconStyle: "",
          // icon style for selected item
          // -- remote items --
          url: null,
          // remove data source for items
          method: null,
          // default comes from w2utils.settings.dataType
          postData: {},
          // additional data to submit to URL
          recId: null,
          // map retrieved data from url to id, can be string or function
          recText: null,
          // map retrieved data from url to text, can be string or function
          debounce: 250,
          // number of ms to wait before sending server call on search
          minLength: 1,
          // min number of chars when trigger search
          cacheMax: 250,
          // -- drop items --
          renderDrop: null,
          // render function for drop down item
          maxDropHeight: 350,
          // max height for drop down menu
          maxDropWidth: null,
          // if null then auto set
          minDropWidth: null,
          // if null then auto set
          // -- misc --
          markSearch: false,
          // if true, highlights search phrase
          align: "both",
          // align with the input ['left', 'right', 'both', 'none']
          altRows: true,
          // alternate row color for drop itesm
          openOnFocus: false,
          // if true, shows drop items on focus
          hideSelected: false,
          // hide selected item from drop down
          msgNoItems: "No matches",
          msgSearch: "Type to search...",
          // -- events --
          onSearch: null,
          // when search needs to be performed
          onRequest: null,
          // when request is submitted
          onLoad: null,
          // when data is received
          onError: null
          // when data fails to load due to server error
        };
        if (typeof options.items == "function") {
          options._items_fun = options.items;
        }
        options.items = w2utils.normMenu.call(this, options.items, options);
        if (this.type === "list") {
          query5(this.el).addClass("w2ui-select");
          if (!w2utils.isPlainObject(options.selected) && Array.isArray(options.items)) {
            options.items.forEach((item) => {
              if (item && item.id === options.selected) {
                options.selected = w2utils.clone(item);
              }
            });
          }
        }
        options = w2utils.extend({}, defaults, options);
        const valid = ["is", "begins", "contains", "ends"];
        if (!valid.includes(options.match)) {
          console.log(`ERROR: invalid value "${options.match}" for option.match. It should be one of following: ${valid.join(", ")}.`);
        }
        this.options = options;
        if (!w2utils.isPlainObject(options.selected)) options.selected = {};
        this.selected = options.selected;
        query5(this.el).attr("autocapitalize", "off").attr("autocomplete", "off").attr("autocorrect", "off").attr("spellcheck", "false");
        if (options.selected.text != null) {
          query5(this.el).val(options.selected.text);
        }
        break;
      }
      case "enum": {
        defaults = {
          items: [],
          // id, text, tooltip, icon
          selected: [],
          itemMap: null,
          // can be { id: 'id', text: 'text' } to specify field mapping for an item
          max: 0,
          // max number of selected items, 0 - unlimited
          match: "begins",
          // ['contains', 'is', 'begins', 'ends']
          filter: true,
          // if true, will apply filtering
          compare: null,
          // compare function for filtering
          // -- remote items --
          url: null,
          // remove source for items
          method: null,
          // default httpMethod
          postData: {},
          recId: null,
          // map retrieved data from url to id, can be string or function
          recText: null,
          // map retrieved data from url to text, can be string or function
          debounce: 250,
          // number of ms to wait before sending server call on search
          minLength: 1,
          // min number of chars when trigger search
          cacheMax: 250,
          // -- item and drop items --
          maxItemWidth: 250,
          // max width for a single item
          maxDropHeight: 350,
          // max height for drop down menu
          maxDropWidth: null,
          // if null then auto set
          renderItem: null,
          // render selected item
          renderDrop: null,
          // render function for drop down item
          // -- misc --
          style: "",
          // style for container div
          openOnFocus: false,
          // if true, opens drop down on focus
          markSearch: false,
          // if true, highlights search phrase
          align: "both",
          // align with the input ['left', 'right', 'both', 'none']
          altRows: true,
          // if ture, will use alternate row colors
          hideSelected: true,
          // hide selected items from drop down
          msgNoItems: "No matches",
          msgSearch: "Type to search...",
          // -- events --
          onAdd: null,
          // when item is selected from drop down
          onNew: null,
          // when new item should be added
          onRemove: null,
          // when item is removed
          onSearch: null,
          // when search is triggered
          onClick: null,
          // when item is clicked
          onRequest: null,
          // when data is requested
          onLoad: null,
          // when data is received
          onError: null,
          // when data fails to load due to server error
          onScroll: null,
          // when div with selected items is scrolled
          onMouseEnter: null,
          // when mouse enters item
          onMouseLeave: null
          // when mouse leaves item
        };
        options = w2utils.extend({}, defaults, options, { suffix: "" });
        if (typeof options.items == "function") {
          options._items_fun = options.items;
        }
        const valid = ["is", "begins", "contains", "ends"];
        if (!valid.includes(options.match)) {
          console.log(`ERROR: invalid value "${options.match}" for option.match. It should be one of following: ${valid.join(", ")}.`);
        }
        options.items = w2utils.normMenu.call(this, options.items, options);
        options.selected = w2utils.normMenu.call(this, options.selected, options);
        this.options = options;
        if (!Array.isArray(options.selected)) options.selected = [];
        this.selected = options.selected;
        break;
      }
      case "file": {
        defaults = {
          selected: [],
          // array of selected files
          max: 0,
          // max number of selected files, 0 - unlim
          maxSize: 0,
          // max size of all files, 0 - unlimited
          maxFileSize: 0,
          // max size of a single file, 0 -unlimited
          renderItem: null,
          // render function fo the selected item
          // -- misc --
          maxItemWidth: 250,
          // max width for a single item
          maxDropHeight: 350,
          // max height for drop down menu
          maxDropWidth: null,
          // if null then auto set
          readContent: true,
          // if true, it will readAsDataURL content of the file
          showErrors: true,
          // if not true, will show errors
          align: "both",
          // align with the input ['left', 'right', 'both', 'none']
          altRows: true,
          // alternate row color for drop itesm
          style: "",
          // style for container div
          // -- events --
          onClick: null,
          // when item is clicked
          onAdd: null,
          // when item is added
          onRemove: null,
          // when item is removed
          onMouseEnter: null,
          // when item is mouse over
          onMouseLeave: null
          // when item is mouse out
        };
        options = w2utils.extend({}, defaults, options);
        this.options = options;
        if (!Array.isArray(options.selected)) options.selected = [];
        this.selected = options.selected;
        if (query5(this.el).attr("placeholder") == null) {
          query5(this.el).attr("placeholder", w2utils.lang("Attach files by dragging and dropping or Click to Select"));
        }
        break;
      }
      default: {
        console.log(`ERROR: field type "${this.type}" is not supported.`);
        break;
      }
    }
    const $elInit = query5(this.el);
    $elInit.css("box-sizing", "border-box");
    $elInit.addClass("w2field w2ui-input").off(".w2field").on("change.w2field", (event2) => {
      this.change(event2);
    }).on("click.w2field", (event2) => {
      this.click(event2);
    }).on("focus.w2field", (event2) => {
      this.focus(event2);
    }).on("blur.w2field", (event2) => {
      if (this.type !== "list") this.blur(event2);
    }).on("keydown.w2field", (event2) => {
      this.keyDown(event2);
    }).on("keyup.w2field", (event2) => {
      this.keyUp(event2);
    });
    this.addPrefix();
    this.addSuffix();
    this.addSearch();
    this.addMultiSearch();
    this.change(new Event("change"));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get() {
    let ret;
    if (["list", "enum", "file"].indexOf(this.type) !== -1) {
      ret = this.selected;
    } else {
      ret = query5(this.el).val();
    }
    return ret;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(val, append) {
    if (["list", "enum", "file"].indexOf(this.type) !== -1) {
      const overlay = w2menu2.get(this.el.id + "_menu");
      overlay?.hide();
      if (this.type !== "list" && append) {
        if (!Array.isArray(this.selected)) this.selected = [];
        this.selected.push(val);
        if (overlay) overlay.options.selected = this.selected;
        query5(this.el).trigger("input").trigger("change");
      } else {
        if (val == null) val = [];
        const it = this.type === "enum" && !Array.isArray(val) ? [val] : val;
        this.selected = it;
        query5(this.el).trigger("input").trigger("change");
      }
      this.refresh();
    } else {
      query5(this.el).val(val);
    }
  }
  setIndex(ind, append) {
    if (["list", "enum"].indexOf(this.type) !== -1) {
      const overlay = w2menu2.get(this.el.id + "_menu");
      overlay?.hide();
      const items = this.options.items;
      if (items && items[ind]) {
        if (this.type == "list") {
          this.selected = items[ind];
        }
        if (this.type == "enum") {
          if (!append) this.selected = [];
          this.selected.push(items[ind]);
        }
        if (overlay) overlay.options.selected = this.selected;
        query5(this.el).trigger("input").trigger("change");
        this.refresh();
        return true;
      }
    }
    return false;
  }
  refresh() {
    const options = this.options;
    const time = Date.now();
    const styles = getComputedStyle(this.el);
    if (this.type == "color") {
      let color = this.el.value;
      if (color.substr(0, 1) != "#" && color.substr(0, 3) != "rgb") {
        color = "#" + color;
      }
      query5(this.helpers.suffix).find(":scope > div").css("background-color", color);
    }
    if (this.type == "list") {
      if (this.helpers.prefix) query5(this.helpers.prefix).hide();
      if (!this.helpers.search) return Date.now() - time;
      if (this.selected == null && options.icon) {
        options.prefix = `
                    <span class="w2ui-icon ${options.icon} "style="cursor: pointer; font-size: 14px;
                        display: inline-block; margin-top: -1px; color: #7F98AD; ${options.iconStyle}">
                    </span>`;
        this.addPrefix();
      } else {
        options.prefix = "";
        this.addPrefix();
      }
      const focus = query5(this.helpers.search_focus);
      const icon = query5(focus.get(0).previousElementSibling);
      focus.css({ outline: "none" });
      if (focus.val() === "") {
        focus.css("opacity", 0);
        icon.css("opacity", 0);
        if (this.selected?.id != null) {
          const text = this.selected.text;
          const ind = this.findItemIndex(options.items, this.selected.id);
          if (text != null) {
            ;
            query5(this.el).val(w2utils.lang(text)).data({
              selected: text,
              selectedIndex: ind[0]
            });
          }
        } else {
          this.el.value = "";
          query5(this.el).removeData("selected selectedIndex");
        }
      } else {
        focus.css("opacity", 1);
        icon.css("opacity", 1);
        query5(this.el).val("");
        setTimeout(() => {
          if (this.helpers.prefix) query5(this.helpers.prefix).hide();
          if (options.icon) {
            focus.css("margin-left", "17px");
            query5(this.helpers.search).find(".w2ui-icon-search").addClass("show-search");
          } else {
            focus.css("margin-left", "0px");
            query5(this.helpers.search).find(".w2ui-icon-search").removeClass("show-search");
          }
        }, 1);
      }
      if (query5(this.el).prop("readOnly") || query5(this.el).prop("disabled")) {
        setTimeout(() => {
          if (this.helpers.prefix) query5(this.helpers.prefix).css("opacity", "0.6");
          if (this.helpers.suffix) query5(this.helpers.suffix).css("opacity", "0.6");
        }, 1);
      } else {
        setTimeout(() => {
          if (this.helpers.prefix) query5(this.helpers.prefix).css("opacity", "1");
          if (this.helpers.suffix) query5(this.helpers.suffix).css("opacity", "1");
        }, 1);
      }
    }
    const div = this.helpers.multi;
    if (["enum", "file"].includes(this.type) && div) {
      let html = "";
      if (Array.isArray(this.selected)) {
        this.selected.forEach((it, ind) => {
          if (it == null) return;
          html += `
                        <div class="li-item" index="${ind}" style="max-width: ${parseInt(options.maxItemWidth)}px; ${it.style ? it.style : ""}">
                        ${typeof options.renderItem === "function" ? options.renderItem(it, ind, `<div class="w2ui-list-remove" index="${ind}">&#160;&#160;</div>`) : `
                               ${it.icon ? `<span class="w2ui-icon ${it.icon}"></span>` : ""}
                               <div class="w2ui-list-remove" index="${ind}">&#160;&#160;</div>
                               ${(this.type === "enum" ? it.text : it.name) ?? it.id ?? it}
                               ${it.size ? `<span class="file-size"> - ${w2utils.formatSize(it.size)}</span>` : ""}
                            `}
                        </div>`;
        });
      }
      const ul = div.find(".w2ui-multi-items");
      if (options.style) {
        div.attr("style", div.attr("style") + ";" + options.style);
      }
      query5(this.el).css("z-index", "-1");
      if (query5(this.el).prop("readOnly") || query5(this.el).prop("disabled")) {
        setTimeout(() => {
          div.get(0).scrollTop = 0;
          div.addClass("w2ui-readonly").find(".li-item").css("opacity", "0.9");
          div.find(".li-item").parent().find(".li-search").hide().find("input").prop("readOnly", true).closest(".w2ui-multi-items").find(".w2ui-list-remove").hide();
        }, 1);
      } else {
        setTimeout(() => {
          div.removeClass("w2ui-readonly").find(".li-item").css("opacity", "1");
          div.find(".li-item").parent().find(".li-search").show().find("input").prop("readOnly", false).closest(".w2ui-multi-items").find(".w2ui-list-remove").show();
        }, 1);
      }
      if (this.selected?.length > 0) {
        query5(this.el).attr("placeholder", "");
      }
      div.find(".w2ui-enum-placeholder").remove();
      ul.find(".li-item").remove();
      if (html !== "") {
        ul.prepend(html);
      } else if (query5(this.el).attr("placeholder") != null && div.find("input").val() === "") {
        const style = w2utils.stripSpaces(`
                    padding-top: ${styles["padding-top"]};
                    padding-left: ${styles["padding-left"]};
                    box-sizing: ${styles["box-sizing"]};
                    line-height: ${styles["line-height"]};
                    font-size: ${styles["font-size"]};
                    font-family: ${styles["font-family"]};
                `);
        div.prepend(`<div class="w2ui-enum-placeholder" style="${style}">${query5(this.el).attr("placeholder")}</div>`);
      }
      div.off(".w2item").on("scroll.w2item", (event2) => {
        const edata = this.trigger("scroll", { target: this.el, originalEvent: event2 });
        if (edata.isCancelled === true) return;
        w2tooltip2.hide(this.el.id + "_preview");
        edata.finish();
      }).find(".li-item").on("click.w2item", (event2) => {
        const mouseEvent = event2;
        const target = query5(mouseEvent.target).closest(".li-item");
        const index = target.attr("index");
        const item = index != null ? this.selected[Number(index)] : void 0;
        if (query5(target).hasClass("li-search")) return;
        mouseEvent.stopPropagation();
        let edata;
        if (query5(mouseEvent.target).hasClass("w2ui-list-remove")) {
          if (query5(this.el).prop("readOnly") || query5(this.el).prop("disabled")) return;
          edata = this.trigger("remove", { target: this.el, originalEvent: mouseEvent, item });
          if (edata.isCancelled === true) return;
          const transfer = new DataTransfer();
          const input = query5(mouseEvent.target).closest(".w2ui-list").find("input.file-input").get(0);
          if (input) {
            Array.from(input.files ?? []).filter((f) => f.name != item.name).forEach((f) => transfer.items.add(f));
            input.files = transfer.files;
          }
          if (index != null) this.selected.splice(Number(index), 1);
          query5(this.el).trigger("input").trigger("change");
          query5(mouseEvent.target).remove();
        } else {
          edata = this.trigger("click", { target: this.el, originalEvent: mouseEvent.originalEvent, item });
          if (edata.isCancelled === true) return;
          let preview = item.tooltip;
          if (this.type === "file") {
            if (/image/i.test(item.type)) {
              preview = `
                                    <div class="w2ui-file-preview">
                                        <img src="${item.content ? "data:" + item.type + ";base64," + item.content : ""}"
                                            style="max-width: 300px">
                                    </div>`;
            }
            preview += `
                                <div class="w2ui-file-info">
                                    <div class="file-caption">${w2utils.lang("Name")}:</div>
                                    <div class="file-value">${item.name}</div>
                                    <div class="file-caption">${w2utils.lang("Size")}:</div>
                                    <div class="file-value">${w2utils.formatSize(item.size)}</div>
                                    <div class="file-caption">${w2utils.lang("Type")}:</div>
                                    <div class="file-value file-type">${item.type}</div>
                                    <div class="file-caption">${w2utils.lang("Modified")}:</div>
                                    <div class="file-value">${w2utils.date(item.modified)}</div>
                                </div>`;
          }
          if (preview) {
            const name = this.el.id + "_preview";
            w2tooltip2.show({
              name,
              anchor: target.get(0),
              html: preview,
              hideOn: ["doc-click"],
              class: ""
            }).show((_event) => {
              const $img = query5(`#w2overlay-${name} img`);
              $img.on("load", function(_event2) {
                const w = this.clientWidth;
                const h = this.clientHeight;
                if (w < 300 && h < 300) return;
                if (w >= h && w > 300) query5(this).css("width", "300px");
                if (w < h && h > 300) query5(this).css("height", "300px");
              }).on("error", function(_event2) {
                this.style.display = "none";
              });
            });
          }
        }
        edata.finish();
      }).on("mouseenter.w2item", (event2) => {
        const mouseEvent = event2;
        const target = query5(mouseEvent.target).closest(".li-item");
        if (query5(target).hasClass("li-search")) return;
        const idx = query5(mouseEvent.target).attr("index");
        const item = idx != null ? this.selected[Number(idx)] : void 0;
        const edata = this.trigger("mouseEnter", { target: this.el, originalEvent: mouseEvent, item });
        if (edata.isCancelled === true) return;
        edata.finish();
      }).on("mouseleave.w2item", (event2) => {
        const mouseEvent = event2;
        const target = query5(mouseEvent.target).closest(".li-item");
        if (query5(target).hasClass("li-search")) return;
        const idx = query5(mouseEvent.target).attr("index");
        const item = idx != null ? this.selected[Number(idx)] : void 0;
        const edata = this.trigger("mouseLeave", { target: this.el, originalEvent: mouseEvent, item });
        if (edata.isCancelled === true) return;
        edata.finish();
      });
      if (this.type === "enum") {
        const search = this.helpers.multi?.find("input");
        search?.css({ width: "15px" });
      } else {
        this.helpers.multi?.find(".li-search").hide();
      }
      this.resize();
    }
    return Date.now() - time;
  }
  // resizing width of list, enum, file controls
  resize() {
    const width = this.el.clientWidth;
    const styles = getComputedStyle(this.el);
    const focus = this.helpers.search;
    const multi = this.helpers.multi;
    const suffix = this.helpers.suffix;
    const prefix = this.helpers.prefix;
    if (focus) {
      query5(focus).css("width", width);
    }
    if (multi) {
      query5(multi).css("width", width - parseInt(styles["margin-left"], 10) - parseInt(styles["margin-right"], 10));
    }
    if (suffix) {
      this.addSuffix();
    }
    if (prefix) {
      this.addPrefix();
    }
    const div = this.helpers.multi;
    if (["enum", "file"].includes(this.type) && div) {
      query5(this.el).css("height", "");
      let cntHeight = query5(div).find(":scope div.w2ui-multi-items").get(0).clientHeight + 5;
      if (cntHeight < 20) cntHeight = 20;
      if (this.tmp["max-height"] != null && cntHeight > this.tmp["max-height"]) {
        cntHeight = this.tmp["max-height"] ?? cntHeight;
      }
      if (this.tmp["min-height"] != null && cntHeight < this.tmp["min-height"]) {
        cntHeight = this.tmp["min-height"] ?? cntHeight;
      }
      const inpHeight = w2utils.getSize(this.el, "height") - 2;
      if (inpHeight > cntHeight) cntHeight = inpHeight;
      query5(div).css({
        "height": cntHeight + "px",
        overflow: cntHeight == this.tmp["max-height"] ? "auto" : "hidden"
      });
      query5(div).css("height", cntHeight + "px");
      query5(this.el).css({ "height": cntHeight + "px" });
    }
    this.tmp.current_width = width;
  }
  reset() {
    if (this.tmp != null) {
      query5(this.el).css("height", "");
      ["padding-left", "padding-right", "background-color", "border-color"].forEach((prop) => {
        if (this.tmp && this.tmp["old-" + prop] != null) {
          query5(this.el).css(prop, this.tmp["old-" + prop]);
          delete this.tmp["old-" + prop];
        }
      });
      clearInterval(this.tmp.sizeTimer);
    }
    ;
    query5(this.el).val(this.clean(query5(this.el).val())).removeClass("w2field w2ui-input").removeData("selected selectedIndex").off(".w2field");
    Object.keys(this.helpers).forEach((key) => {
      query5(this.helpers[key]).remove();
    });
    this.helpers = {};
    delete this.el._w2field;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clean(val) {
    if (typeof val === "number") {
      return val;
    }
    const options = this.options;
    val = String(val).trim();
    if (["int", "float", "money", "currency", "percent"].includes(this.type)) {
      if (typeof val === "string") {
        if (options.autoFormat) {
          if (["money", "currency"].includes(this.type)) {
            val = String(val).replace(options.moneyRE, "");
          }
          if (this.type === "percent") {
            val = String(val).replace(options.percentRE, "");
          }
          if (["int", "float"].includes(this.type)) {
            val = String(val).replace(options.numberRE, "");
          }
        }
        const esc_gsroupSymbol = options.groupSymbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const esc_decimalSymbol = options.decimalSymbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        val = val.replace(/\s+/g, "").replace(new RegExp(esc_gsroupSymbol, "g"), "").replace(new RegExp(esc_decimalSymbol, "g"), ".");
      }
      if (val !== "" && w2utils.isFloat(val)) val = Number(val);
      else val = "";
    }
    return val;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  format(val) {
    const options = this.options;
    if (options.autoFormat && val !== "") {
      switch (this.type) {
        case "money":
        case "currency":
          val = w2utils.formatNumber(val, options.currency.precision, true);
          if (val !== "") val = options.currency.prefix + val + options.currency.suffix;
          break;
        case "percent":
          val = w2utils.formatNumber(val, options.precision, true);
          if (val !== "") val += "%";
          break;
        case "float":
          val = w2utils.formatNumber(val, options.precision, true);
          break;
        case "int":
          val = w2utils.formatNumber(val, 0, true);
          break;
      }
      const group = 1e3.toLocaleString(w2utils.settings.locale, { useGrouping: true }).slice(1, 2);
      if (group !== this.options.groupSymbol) {
        val = val.replaceAll(group, this.options.groupSymbol);
      }
    }
    return val;
  }
  change(event2) {
    if (["int", "float", "money", "currency", "percent"].indexOf(this.type) !== -1) {
      const val = query5(this.el).val();
      const new_val = this.format(this.clean(query5(this.el).val()));
      if (val !== "" && val != new_val) {
        query5(this.el).val(new_val);
        event2.stopPropagation();
        event2.preventDefault();
        return false;
      }
    }
    if (this.type === "color") {
      let color = query5(this.el).val();
      if (color.substr(0, 3).toLowerCase() !== "rgb") {
        color = "#" + color;
        const len = query5(this.el).val().length;
        if (len !== 8 && len !== 6 && len !== 3) color = "";
      }
      const next = query5(this.el).get(0).nextElementSibling;
      query5(next).find("div").css("background-color", color);
      if (query5(this.el).hasClass("has-focus")) {
        this.updateOverlay();
      }
    }
    if (["list", "enum", "file"].indexOf(this.type) !== -1) {
      this.refresh();
    }
    if (["date", "time", "datetime"].indexOf(this.type) !== -1) {
      let tmp = parseInt(this.el.value);
      if (w2utils.isInt(this.el.value) && tmp > 3e3) {
        if (this.type === "time") tmp = w2utils.formatTime(new Date(tmp), this.options.format);
        if (this.type === "date") tmp = w2utils.formatDate(new Date(tmp), this.options.format);
        if (this.type === "datetime") tmp = w2utils.formatDateTime(new Date(tmp), this.options.format);
        query5(this.el).val(String(tmp)).trigger("input").trigger("change");
      }
    }
  }
  click(event2) {
    if (["list", "combo", "enum"].includes(this.type)) {
      if (!query5(this.el).hasClass("has-focus")) {
        this.focus(event2);
      }
      if (this.type == "list" || this.type == "combo") {
        if (!this.tmp.openedOnFocus) {
          const name = this.el.id + "_menu";
          const overlay = w2menu2.get(name);
          if (overlay?.displayed) {
            w2menu2.hide(name);
          } else {
            this.updateOverlay();
          }
        }
        delete this.tmp.openedOnFocus;
        if (this.type == "list") {
          event2.stopPropagation();
        }
      }
      if (this.type == "enum") {
        this.updateOverlay();
      }
    }
    if (["date", "time", "datetime", "color"].includes(this.type)) {
      this.updateOverlay();
    }
  }
  focus(event2) {
    if (this.type == "list" && document.activeElement == this.el) {
      this.helpers.search_focus?.focus();
      if (event2.showMenu !== false && this.options.openOnFocus !== false && query5(this.el).hasClass("has-focus") && !this.tmp.overlay?.overlay?.displayed) {
        setTimeout(() => {
          this.tmp.openedOnFocus = true;
          this.updateOverlay();
        }, 0);
      }
      return;
    }
    if (["color", "date", "time", "datetime"].indexOf(this.type) !== -1) {
      if (query5(this.el).prop("readOnly") || query5(this.el).prop("disabled")) return;
      this.updateOverlay();
    }
    if (["list", "combo", "enum"].indexOf(this.type) !== -1) {
      if (query5(this.el).prop("readOnly") || query5(this.el).prop("disabled")) {
        query5(this.el).addClass("has-focus");
        return;
      }
      if (typeof this.options._items_fun == "function") {
        ;
        this.options.items = w2utils.normMenu.call(this, this.options._items_fun, this.options);
      }
      if (this.helpers.search) {
        const search = this.helpers.search_focus;
        if (search) {
          search.value = "";
          search.select();
        }
      }
      if (this.type == "enum") {
        const search = query5(this.el.previousElementSibling).find(".li-search input").get(0);
        if (document.activeElement !== search) {
          search.focus();
        }
      }
      this.resize();
      if (event2.showMenu !== false && this.options.openOnFocus !== false && query5(this.el).hasClass("has-focus") && !this.tmp.overlay?.overlay?.displayed) {
        setTimeout(() => {
          this.tmp.openedOnFocus = true;
          this.updateOverlay();
        }, 0);
      }
    }
    if (this.type == "file") {
      const prev = query5(this.el).get(0).previousElementSibling;
      query5(prev).addClass("has-focus");
    }
    query5(this.el).addClass("has-focus");
  }
  blur(_event) {
    const val = query5(this.el).val().trim();
    query5(this.el).removeClass("has-focus");
    if (["int", "float", "money", "currency", "percent"].includes(this.type)) {
      if (val !== "") {
        let newVal = val;
        let error = "";
        if (!this.isStrValid(val)) {
          newVal = "";
        } else {
          const rVal = this.clean(val);
          const options = this.options;
          if (options.min != null && rVal < options.min) {
            newVal = options.min;
            error = `Should be >= ${options.min}`;
          }
          if (options.max != null && rVal > options.max) {
            newVal = options.max;
            error = `Should be <= ${options.max}`;
          }
        }
        if (this.options.autoCorrect) {
          ;
          query5(this.el).val(newVal).trigger("input").trigger("change");
          if (error) {
            w2tooltip2.show({
              name: this.el.id + "_error",
              anchor: this.el,
              html: error
            });
            setTimeout(() => {
              w2tooltip2.hide(this.el.id + "_error");
            }, 3e3);
          }
        }
      }
    }
    if (["date", "time", "datetime"].includes(this.type) && this.options.autoCorrect) {
      if (val !== "") {
        const check = this.type == "date" ? w2utils.isDate : this.type == "time" ? w2utils.isTime : w2utils.isDateTime;
        if (!w2date2.inRange(this.el.value, this.options) || !check.bind(w2utils)(this.el.value, this.options.format)) {
          ;
          query5(this.el).val("").trigger("input").trigger("change");
        }
      }
    }
    if (this.type === "enum") {
      ;
      query5(this.helpers.multi).find("input").val("").css("width", "15px");
    }
    if (this.type == "file") {
      const prev = this.el.previousElementSibling;
      query5(prev).removeClass("has-focus");
    }
    if (this.type === "list") {
      this.el.value = this.selected?.text ?? "";
    }
  }
  keyDown(event2, extra) {
    const options = this.options;
    const key = event2.keyCode || extra && extra.keyCode;
    let cancel = false;
    let val, inc, daymil, dt, newValue, newDT;
    if (["int", "float", "money", "currency", "percent", "hex", "bin", "color", "alphanumeric"].includes(this.type)) {
      if (!event2.metaKey && !event2.ctrlKey && !event2.altKey) {
        if (!this.isStrValid(event2.key ?? "1", true) && // valid & is not arrows, dot, comma, etc keys
        ![9, 8, 13, 27, 37, 38, 39, 40, 46].includes(event2.keyCode)) {
          event2.preventDefault();
          if (event2.stopPropagation) event2.stopPropagation();
          else event2.cancelBubble = true;
          return false;
        }
      }
    }
    if (["int", "float", "money", "currency", "percent"].includes(this.type)) {
      if (!options.keyboard || query5(this.el).prop("readOnly") || query5(this.el).prop("disabled")) return;
      val = parseFloat(query5(this.el).val().replace(options.moneyRE, "")) || 0;
      inc = options.step;
      if (event2.ctrlKey || event2.metaKey) inc = options.step * 10;
      switch (key) {
        case 38:
          if (event2.shiftKey) break;
          newValue = val + inc <= options.max || options.max == null ? Number((val + inc).toFixed(12)) : options.max;
          query5(this.el).val(String(newValue)).trigger("input").trigger("change");
          cancel = true;
          break;
        case 40:
          if (event2.shiftKey) break;
          newValue = val - inc >= options.min || options.min == null ? Number((val - inc).toFixed(12)) : options.min;
          query5(this.el).val(String(newValue)).trigger("input").trigger("change");
          cancel = true;
          break;
      }
      if (cancel) {
        event2.preventDefault();
        this.moveCaret2end();
      }
    }
    if (["date", "datetime"].includes(this.type)) {
      if (!options.keyboard || query5(this.el).prop("readOnly") || query5(this.el).prop("disabled")) return;
      const is = (this.type == "date" ? w2utils.isDate : w2utils.isDateTime).bind(w2utils);
      const format = (this.type == "date" ? w2utils.formatDate : w2utils.formatDateTime).bind(w2utils);
      daymil = 24 * 60 * 60 * 1e3;
      inc = 1;
      if (event2.ctrlKey || event2.metaKey) inc = 10;
      dt = is(query5(this.el).val(), options.format, true);
      if (!dt) {
        dt = /* @__PURE__ */ new Date();
        daymil = 0;
      }
      switch (key) {
        case 38:
          if (event2.shiftKey) break;
          if (inc == 10) {
            dt.setMonth(dt.getMonth() + 1);
          } else {
            dt.setTime(dt.getTime() + daymil);
          }
          newDT = format(dt.getTime(), options.format);
          query5(this.el).val(newDT).trigger("input").trigger("change");
          cancel = true;
          break;
        case 40:
          if (event2.shiftKey) break;
          if (inc == 10) {
            dt.setMonth(dt.getMonth() - 1);
          } else {
            dt.setTime(dt.getTime() - daymil);
          }
          newDT = format(dt.getTime(), options.format);
          query5(this.el).val(newDT).trigger("input").trigger("change");
          cancel = true;
          break;
      }
      if (cancel) {
        event2.preventDefault();
        this.moveCaret2end();
        this.updateOverlay();
      }
    }
    if (this.type === "time") {
      if (!options.keyboard || query5(this.el).prop("readOnly") || query5(this.el).prop("disabled")) return;
      inc = event2.ctrlKey || event2.metaKey ? 60 : 1;
      val = query5(this.el).val();
      let time = w2date2.str2min(val) || w2date2.str2min((/* @__PURE__ */ new Date()).getHours() + ":" + ((/* @__PURE__ */ new Date()).getMinutes() - 1));
      switch (key) {
        case 38:
          if (event2.shiftKey) break;
          time += inc;
          cancel = true;
          break;
        case 40:
          if (event2.shiftKey) break;
          time -= inc;
          cancel = true;
          break;
      }
      if (cancel) {
        event2.preventDefault();
        query5(this.el).val(w2date2.min2str(time)).trigger("input").trigger("change");
        this.moveCaret2end();
      }
    }
    if (["list", "enum"].includes(this.type)) {
      switch (key) {
        case 8:
        // delete
        case 46:
          if (this.type == "list") {
            const search = query5(this.helpers.search_focus);
            if (search.val() == "") {
              const edata = this.trigger("remove", { target: this.el, originalEvent: event2, item: this.selected });
              if (edata.isCancelled === true) return;
              this.selected = null;
              w2menu2.hide(this.el.id + "_menu");
              query5(this.el).val("").trigger("input").trigger("change");
              edata.finish();
            }
          } else {
            const search = query5(this.helpers.multi).find("input");
            if (search.val() == "") {
              const edata = this.trigger("remove", { target: this.el, originalEvent: event2, item: this.selected[this.selected.length - 1] });
              if (edata.isCancelled === true) return;
              w2menu2.hide(this.el.id + "_menu");
              this.selected.pop();
              const overlay = w2menu2.get(this.el.id + "_menu");
              if (overlay) overlay.options.selected = this.selected;
              this.refresh();
              edata.finish();
            }
          }
          break;
        case 9:
        // tab key
        case 16:
          w2menu2.hide(this.el.id + "_menu");
          break;
        case 27:
          w2menu2.hide(this.el.id + "_menu");
          this.refresh();
          break;
        default: {
        }
      }
    }
  }
  keyUp(event2) {
    if (this.type == "list") {
      const search = query5(this.helpers.search_focus);
      if (search.val() !== "") {
        query5(this.el).attr("placeholder", "");
      } else {
        query5(this.el).attr("placeholder", this.tmp.pholder);
      }
      if (event2.keyCode == 13) {
        setTimeout(() => {
          search.val("");
          w2menu2.hide(this.el.id + "_menu");
          this.refresh();
        }, 1);
      }
      if ([38, 40].includes(event2.keyCode) && !this.tmp.overlay?.overlay?.displayed) {
        this.updateOverlay();
      }
      this.refresh();
    }
    if (this.type == "combo") {
      if (![9, 16, 27].includes(event2.keyCode) && this.options.openOnFocus !== true) {
        this.updateOverlay();
      }
      if ([38, 40].includes(event2.keyCode) && !this.tmp.overlay?.overlay?.displayed) {
        this.updateOverlay();
      }
    }
    if (this.type == "enum") {
      const search = this.helpers.multi?.find("input");
      const styles = getComputedStyle(search?.get(0));
      const width = w2utils.getStrWidth(
        search?.val(),
        `font-family: ${styles["font-family"]}; font-size: ${styles["font-size"]};`,
        void 0
      );
      search?.css({ width: width + 15 + "px" });
      this.resize();
      if ([8, 46, 9, 16, 27].includes(event2.keyCode)) {
        if (this.tmp.overlay?.overlay?.displayed) {
          w2menu2.hide(this.el.id + "_menu");
        }
      } else {
        this.updateOverlay();
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findItemIndex(items, id, parents) {
    let inds = [];
    if (!parents) parents = [];
    if (["list", "combo", "enum"].includes(this.type) && this.options.url) {
      const overlay = w2menu2.get(this.el.id + "_menu");
      if (overlay) {
        items = overlay.options.items;
        this.options.items = items;
      }
    }
    items.forEach((item, ind) => {
      if (item.id === id) {
        inds = parents.concat([ind]);
        this.options.index = [ind];
      }
      if (inds.length == 0 && item.items && item.items.length > 0) {
        parents.push(ind);
        inds = this.findItemIndex(item.items, id, parents);
        parents.pop();
      }
    });
    return inds;
  }
  updateOverlay(_indexOnly) {
    const options = this.options;
    let params;
    if (this.type === "color") {
      if (query5(this.el).prop("readOnly") || query5(this.el).prop("disabled")) return;
      w2color2.show(w2utils.extend({
        name: this.el.id + "_color",
        anchor: this.el,
        transparent: options.transparent,
        advanced: options.advanced,
        color: this.el.value,
        liveUpdate: true
      }, this.options)).select((event2) => {
        const color = event2.detail.color;
        query5(this.el).val(color).trigger("input").trigger("change");
      }).liveUpdate((event2) => {
        const color = event2.detail.color;
        query5(this.helpers.suffix).find(":scope > div").css("background-color", "#" + color);
      });
    }
    if (["list", "combo", "enum"].includes(this.type)) {
      let el = this.el;
      let input = this.el;
      if (this.type === "enum") {
        el = this.helpers.multi?.get(0) ?? this.el;
        input = query5(el).find("input").get(0) ?? this.el;
      }
      if (this.type === "list") {
        const sel = this.selected;
        if (w2utils.isPlainObject(sel) && Object.keys(sel).length > 0) {
          const ind = this.findItemIndex(options.items, sel.id);
          if (ind.length > 0) {
            options.index = ind;
          }
        }
        input = this.helpers.search_focus ?? this.el;
      }
      if (query5(this.el).hasClass("has-focus") && !this.el.readOnly && !this.el.disabled) {
        params = w2utils.extend({}, options, {
          name: this.el.id + "_menu",
          anchor: input,
          selected: this.selected,
          search: false,
          render: options.renderDrop,
          anchorClass: "",
          offsetY: 5,
          maxHeight: options.maxDropHeight,
          // TODO: check
          maxWidth: options.maxDropWidth,
          // TODO: check
          minWidth: options.minDropWidth
          // TODO: check
        });
        this.tmp.overlay = w2menu2.show(params).select((event2) => {
          if (["list", "combo"].includes(this.type)) {
            this.selected = event2.detail.item;
            query5(input).val("");
            query5(this.el).val(this.selected.text).trigger("input").trigger("change");
            this.focus({ showMenu: false });
          } else {
            const selected = this.selected;
            const newItem = event2.detail?.item;
            if (newItem) {
              const edata = this.trigger("add", { target: this.el, item: newItem, originalEvent: event2 });
              if (edata.isCancelled === true) return;
              if (selected.length >= options.max && options.max > 0) selected.pop();
              delete newItem.hidden;
              selected.push(newItem);
              query5(this.el).trigger("input").trigger("change");
              query5(this.helpers.multi).find("input").val("");
              const overlay = w2menu2.get(this.el.id + "_menu");
              if (overlay) overlay.options.selected = this.selected;
              edata.finish();
            }
          }
        });
      }
    }
    if (["date", "time", "datetime"].includes(this.type)) {
      if (query5(this.el).prop("readOnly") || query5(this.el).prop("disabled")) return;
      w2date2.show(w2utils.extend({
        name: this.el.id + "_date",
        anchor: this.el,
        value: this.el.value
      }, this.options)).select((event2) => {
        const date = event2.detail.date;
        if (date != null) {
          ;
          query5(this.el).val(date).trigger("input").trigger("change");
        }
      });
    }
  }
  /*
  *  INTERNAL FUNCTIONS
  */
  isStrValid(ch, loose) {
    let isValid = true;
    switch (this.type) {
      case "int":
        if (loose && ["-", this.options.groupSymbol].includes(ch)) {
          isValid = true;
        } else {
          isValid = w2utils.isInt(ch.replace(this.options.numberRE, ""));
        }
        break;
      case "percent":
        ch = ch.replace(/%/g, "");
      // falls through to float
      case "float":
        if (loose && ["-", "", this.options.decimalSymbol, this.options.groupSymbol].includes(ch)) {
          isValid = true;
        } else {
          isValid = w2utils.isFloat(ch.replace(this.options.numberRE, ""));
        }
        break;
      case "money":
      case "currency":
        if (loose && [
          "-",
          this.options.decimalSymbol,
          this.options.groupSymbol,
          this.options.currency.prefix,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.options.currency.suffix
        ].includes(ch)) {
          isValid = true;
        } else {
          isValid = w2utils.isFloat(ch.replace(this.options.moneyRE, ""));
        }
        break;
      case "bin":
        isValid = w2utils.isBin(ch);
        break;
      case "color":
      case "hex":
        isValid = w2utils.isHex(ch);
        break;
      case "alphanumeric":
        isValid = w2utils.isAlphaNumeric(ch);
        break;
    }
    return isValid;
  }
  addPrefix() {
    if (!this.options.prefix) {
      return;
    }
    const styles = getComputedStyle(this.el);
    if (this.tmp["old-padding-left"] == null) {
      this.tmp["old-padding-left"] = styles["padding-left"];
    }
    if (this.helpers.prefix) query5(this.helpers.prefix).remove();
    query5(this.el).before(`<div class="w2ui-field-helper">${this.options.prefix}</div>`);
    const helper = query5(this.el).get(0).previousElementSibling;
    query5(helper).css({
      "color": styles["color"],
      "font-family": styles["font-family"],
      "font-size": styles["font-size"],
      "height": this.el.clientHeight + "px",
      "padding-top": parseInt(styles["padding-top"], 10) + 1 + "px",
      "padding-bottom": parseInt(styles["padding-bottom"], 10) - 1 + "px",
      "padding-left": this.tmp["old-padding-left"] ?? "",
      "padding-right": 0,
      "margin-top": parseInt(styles["margin-top"], 10) + "px",
      "margin-bottom": parseInt(styles["margin-bottom"], 10) + "px",
      "margin-left": styles["margin-left"],
      "margin-right": 0,
      "z-index": 1,
      "display": "inline-flex",
      "align-items": "center"
    });
    query5(this.el).css("padding-left", helper.clientWidth + "px !important");
    this.helpers.prefix = helper;
  }
  addSuffix() {
    if (!this.options.suffix && !this.options.arrows) {
      return;
    }
    const styles = getComputedStyle(this.el);
    if (this.tmp["old-padding-right"] == null) {
      this.tmp["old-padding-right"] = styles["padding-right"];
    }
    let pr = parseInt(styles["padding-right"] || "0");
    if (this.options.arrows) {
      if (this.helpers.arrows) query5(this.helpers.arrows).remove();
      query5(this.el).after(
        '<div class="w2ui-field-helper" style="border: 1px solid transparent">&#160;    <div class="w2ui-field-up" type="up">        <div class="arrow-up" type="up"></div>    </div>    <div class="w2ui-field-down" type="down">        <div class="arrow-down" type="down"></div>    </div></div>'
      );
      const arrowHelper = query5(this.el).get(0).nextElementSibling;
      const $arrowHelper = query5(arrowHelper);
      $arrowHelper.css({
        "color": styles["color"],
        "font-family": styles["font-family"],
        "font-size": styles["font-size"],
        "height": this.el.clientHeight + "px",
        "padding": 0,
        "margin-top": parseInt(styles["margin-top"], 10) + 1 + "px",
        "margin-bottom": 0,
        "border-left": "1px solid silver",
        "width": "16px",
        "transform": "translateX(-100%)"
      });
      $arrowHelper.on("mousedown", (event2) => {
        const mouseEvent = event2;
        if (query5(mouseEvent.target).hasClass("arrow-up")) {
          this.keyDown(mouseEvent, { keyCode: 38 });
        }
        if (query5(mouseEvent.target).hasClass("arrow-down")) {
          this.keyDown(mouseEvent, { keyCode: 40 });
        }
      });
      pr += arrowHelper.clientWidth;
      query5(this.el).css("padding-right", pr + "px !important");
      this.helpers.arrows = arrowHelper;
    }
    if (this.options.suffix !== "") {
      if (this.helpers.suffix) query5(this.helpers.suffix).remove();
      query5(this.el).after(`<div class="w2ui-field-helper">${this.options.suffix}</div>`);
      const suffixHelper = query5(this.el).get(0).nextElementSibling;
      query5(suffixHelper).css({
        "color": styles["color"],
        "font-family": styles["font-family"],
        "font-size": styles["font-size"],
        "height": this.el.clientHeight + "px",
        "padding-top": styles["padding-top"],
        "padding-bottom": styles["padding-bottom"],
        "padding-left": 0,
        "padding-right": styles["padding-right"],
        "margin-top": parseInt(styles["margin-top"], 10) + 2 + "px",
        "margin-bottom": parseInt(styles["margin-bottom"], 10) + 1 + "px",
        "transform": "translateX(-100%)"
      });
      query5(this.el).css("padding-right", suffixHelper.clientWidth + "px !important");
      this.helpers.suffix = suffixHelper;
    }
  }
  // Only used for list
  addSearch() {
    if (this.type !== "list") return;
    if (this.helpers.search) query5(this.helpers.search).remove();
    let tabIndex = parseInt(query5(this.el).attr("tabIndex"));
    if (!isNaN(tabIndex) && tabIndex !== -1) this.tmp["old-tabIndex"] = tabIndex;
    if (this.tmp["old-tabIndex"]) tabIndex = this.tmp["old-tabIndex"];
    if (tabIndex == null || isNaN(tabIndex)) tabIndex = 0;
    let searchId = "";
    if (query5(this.el).attr("id") != null) {
      searchId = 'id="' + query5(this.el).attr("id") + '_search"';
    }
    const html = `
            <div class="w2ui-field-helper">
                <span class="w2ui-icon w2ui-icon-search"></span>
                <input ${searchId} type="text" tabIndex="${tabIndex}" ${query5(this.el).prop("readOnly") ? "readonly" : ""}
                    autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"/>
            </div>`;
    query5(this.el).attr("tabindex", String(-1)).before(html);
    const helper = query5(this.el).get(0).previousElementSibling;
    this.helpers.search = helper;
    this.helpers.search_focus = query5(helper).find("input").get(0);
    const styles = getComputedStyle(this.el);
    const $helperSearch = query5(helper);
    $helperSearch.css({
      width: this.el.clientWidth + "px",
      "margin-top": styles["margin-top"],
      "margin-left": styles["margin-left"],
      "margin-bottom": styles["margin-bottom"],
      "margin-right": styles["margin-right"]
    });
    $helperSearch.find("input").css({
      cursor: "default",
      width: "100%",
      opacity: 1,
      padding: styles["padding"],
      margin: styles["margin"],
      border: "1px solid transparent",
      "background-color": "transparent"
    });
    query5(helper).find("input").off(".w2ui-helper").on("focus.w2ui-helper", (event2) => {
      const focusEvent = event2;
      query5(focusEvent.target).val("");
      this.tmp.pholder = query5(this.el).attr("placeholder") ?? "";
      this.focus(focusEvent);
      focusEvent.stopPropagation();
    }).on("blur.w2ui-helper", (event2) => {
      const focusEvent = event2;
      query5(focusEvent.target).val("");
      if (this.tmp.pholder != null) query5(this.el).attr("placeholder", this.tmp.pholder);
      this.blur(focusEvent);
      focusEvent.stopPropagation();
    }).on("keydown.w2ui-helper", (event2) => {
      this.keyDown(event2);
    }).on("keyup.w2ui-helper", (event2) => {
      this.keyUp(event2);
    });
    query5(helper).off(".w2ui-helper").on("click.w2ui-helper", (_event) => {
      query5(helper).find("input").get(0).focus();
    });
  }
  // Used in enum/file
  addMultiSearch() {
    if (!["enum", "file"].includes(this.type)) {
      return;
    }
    query5(this.helpers.multi).remove();
    let html = "";
    const styles = getComputedStyle(this.el);
    const margin = w2utils.stripSpaces(`
            margin-top: 0px;
            margin-bottom: 0px;
            margin-left: ${styles["margin-left"]};
            margin-right: ${styles["margin-right"]};
            width: ${w2utils.getSize(this.el, "width") - parseInt(styles["margin-left"], 10) - parseInt(styles["margin-right"], 10)}px;
        `);
    if (this.tmp["min-height"] == null) {
      const min = this.tmp["min-height"] = parseInt((styles["min-height"] != "none" ? styles["min-height"] : "0") || "0");
      const current = parseInt(styles["height"]);
      this.tmp["min-height"] = Math.max(min, current);
    }
    if (this.tmp["max-height"] == null && styles["max-height"] != "none") {
      this.tmp["max-height"] = parseInt(styles["max-height"]);
    }
    let searchId = "";
    if (query5(this.el).attr("id") != null) {
      searchId = `id="${query5(this.el).attr("id")}_search"`;
    }
    let tabIndex = parseInt(query5(this.el).attr("tabIndex"));
    if (!isNaN(tabIndex) && tabIndex !== -1) this.tmp["old-tabIndex"] = tabIndex;
    if (this.tmp["old-tabIndex"]) tabIndex = this.tmp["old-tabIndex"];
    if (tabIndex == null || isNaN(tabIndex)) tabIndex = 0;
    if (this.type === "enum") {
      html = `
            <div class="w2ui-field-helper w2ui-list" style="${margin}">
                <div class="w2ui-multi-items">
                    <div class="li-search">
                        <input ${searchId} type="text" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                            tabindex="${tabIndex}"
                            ${query5(this.el).prop("readOnly") ? "readonly" : ""}
                            ${query5(this.el).prop("disabled") ? "disabled" : ""}>
                    </div>
                </div>
            </div>`;
    }
    if (this.type === "file") {
      html = `
            <div class="w2ui-field-helper w2ui-list" style="${margin}">
                <div class="w2ui-multi-file">
                    <input name="attachment" class="file-input" type="file" tabindex="-1"'
                        style="width: 100%; height: 100%; opacity: 0" title=""
                        ${this.options.max !== 1 ? "multiple" : ""}
                        ${query5(this.el).prop("readOnly") || query5(this.el).prop("disabled") ? "disabled" : ""}
                        ${query5(this.el).attr("accept") ? ' accept="' + query5(this.el).attr("accept") + '"' : ""}>
                </div>
                <div class="w2ui-multi-items">
                    <div class="li-search" style="display: none">
                        <input ${searchId} type="text" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                            tabindex="${tabIndex}"
                            ${query5(this.el).prop("readOnly") ? "readonly" : ""}
                            ${query5(this.el).prop("disabled") ? "disabled" : ""}>
                    </div>
                </div>
            </div>`;
    }
    this.tmp["old-background-color"] = styles["background-color"];
    this.tmp["old-border-color"] = styles["border-color"];
    query5(this.el).before(html).css({
      "border-color": "transparent",
      "background-color": "transparent"
    });
    const div = query5(this.el.previousElementSibling);
    this.helpers.multi = div;
    query5(this.el).attr("tabindex", String(-1));
    div.on("mousedown", (event2) => {
      query5(event2.target).addClass("has-focus");
    }).on("mouseup", (event2) => {
      query5(event2.target).removeClass("has-focus");
    }).on("click", (event2) => {
      this.focus(event2);
      this.updateOverlay();
    });
    div.find("input:not(.file-input)").on("click", (event2) => {
      this.click(event2);
    }).on("focus", (event2) => {
      this.focus(event2);
    }).on("blur", (event2) => {
      this.blur(event2);
    }).on("keydown", (event2) => {
      this.keyDown(event2);
    }).on("keyup", (event2) => {
      this.keyUp(event2);
    });
    if (this.type === "file") {
      div.find("input.file-input").off(".drag").on("click.drag", (event2) => {
        const mouseEvent = event2;
        mouseEvent.stopPropagation();
        if (query5(this.el).prop("readOnly") || query5(this.el).prop("disabled")) return;
        this.focus(mouseEvent);
      }).on("dragenter.drag", (_event) => {
        if (query5(this.el).prop("readOnly") || query5(this.el).prop("disabled")) return;
        div.addClass("w2ui-file-dragover");
      }).on("dragleave.drag", (_event) => {
        if (query5(this.el).prop("readOnly") || query5(this.el).prop("disabled")) return;
        div.removeClass("w2ui-file-dragover");
      }).on("drop.drag", (event2) => {
        const dragEvent = event2;
        if (query5(this.el).prop("readOnly") || query5(this.el).prop("disabled")) return;
        div.removeClass("w2ui-file-dragover");
        const files = Array.from(dragEvent.dataTransfer?.files ?? []);
        files.forEach((file) => {
          this.addFile(file);
        });
        this.focus(dragEvent);
        dragEvent.preventDefault();
        dragEvent.stopPropagation();
      }).on("dragover.drag", (event2) => {
        const dragEvent = event2;
        dragEvent.preventDefault();
        dragEvent.stopPropagation();
      }).on("change.drag", (event2) => {
        const target = event2.target;
        if (target.files != null) {
          Array.from(target.files).forEach((file) => {
            this.addFile(file);
          });
        }
        this.focus(event2);
      });
    }
    this.refresh();
  }
  addFile(file) {
    const options = this.options;
    const selected = this.selected;
    const newItem = {
      name: file.name,
      type: file.type,
      modified: new Date(file.lastModified),
      size: file.size,
      content: null,
      file
    };
    let size = 0;
    let cnt = 0;
    const errors = [];
    if (Array.isArray(selected)) {
      selected.forEach((item) => {
        if (item.name == file.name && item.size == file.size) {
          errors.push(w2utils.lang('The file "${name}" (${size}) is already added.', {
            name: file.name,
            size: String(w2utils.formatSize(file.size))
          }));
        }
        size += item.size;
        cnt++;
      });
    }
    if (options.maxFileSize !== 0 && newItem.size > options.maxFileSize) {
      errors.push(w2utils.lang("Maximum file size is ${size}", { size: String(w2utils.formatSize(options.maxFileSize)) }));
    }
    if (options.maxSize !== 0 && size + newItem.size > options.maxSize) {
      errors.push(w2utils.lang("Maximum total size is ${size}", { size: String(w2utils.formatSize(options.maxSize)) }));
    }
    if (options.max !== 0 && cnt >= options.max) {
      errors.push(w2utils.lang("Maximum number of files is ${count}", { count: options.max }));
    }
    const edata = this.trigger("add", { target: this.el, file: newItem, total: cnt, totalSize: size, errors });
    if (edata.isCancelled === true) return;
    if (errors.length > 0) {
      if (options.showErrors) {
        w2tooltip2.show({
          anchor: this.el,
          html: "Errors: " + errors.join("<br>"),
          hideOn: ["input", "doc-click"]
        });
      }
      console.log("ERRORS (while adding files): ", errors);
      return;
    }
    selected.push(newItem);
    if (typeof FileReader !== "undefined" && options.readContent === true) {
      const reader = new FileReader();
      reader.onload = (event2) => {
        const fl = event2.target?.result ?? "";
        const ind = fl.indexOf(",");
        newItem.content = fl.substr(ind + 1);
        this.refresh();
        query5(this.el).trigger("input").trigger("change");
        edata.finish();
      };
      reader.readAsDataURL(file);
    } else {
      this.refresh();
      query5(this.el).trigger("input").trigger("change");
      edata.finish();
    }
  }
  // move cursror to end
  moveCaret2end() {
    setTimeout(() => {
      this.el.setSelectionRange(this.el.value.length, this.el.value.length);
    }, 0);
  }
};

// src/w2tabs.ts
var query6 = query;
var w2tabs = class extends w2base {
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
    if (typeof this.box == "string") this.box = query6(this.box).get(0);
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
      if (!w2utils.checkUniqueId(tab.id, this.tabs, "tabs", this.name)) return;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remove(...ids) {
    let effected = 0;
    ids.forEach((it) => {
      const tab = this.get(it);
      if (!tab) return;
      effected++;
      this.tabs.splice(this.get(tab.id, true), 1);
      query6(this.box).find(`#tabs_${this.name}_tab_${w2utils.escapeId(tab.id)}`).remove();
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
    w2utils.extend(this.tabs[index], tab);
    this.refresh(id);
    return true;
  }
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
  dragMove(event2) {
    if (!this.last.reordering) return;
    const self = this;
    const info = this.last.moving;
    const tab = this.tabs[info.index];
    const next = _find(info.index, 1);
    const prev = _find(info.index, -1);
    const $el = query6(this.box).find("#tabs_" + this.name + "_tab_" + w2utils.escapeId(tab.id));
    if (info.divX > 0 && next) {
      const $nextEl = query6(this.box).find("#tabs_" + this.name + "_tab_" + w2utils.escapeId(next.id));
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
          x: event2.pageX + width1,
          left: info.left + info.divX + width1
        });
        return;
      }
    }
    if (info.divX < 0 && prev) {
      const $prevEl = query6(this.box).find("#tabs_" + this.name + "_tab_" + w2utils.escapeId(prev.id));
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
          x: event2.pageX - width1,
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
  mouseAction(action, id, event2) {
    const tab = this.get(id);
    const edata = this.trigger("mouse" + action, { target: id, tab, object: tab, originalEvent: event2 });
    if (edata.isCancelled === true || tab?.disabled || tab?.hidden) return;
    switch (action) {
      case "Enter":
        this.tooltipShow(id);
        break;
      case "Leave":
        this.tooltipHide(id);
        break;
      case "Down":
        this.initReorder(id, event2);
        break;
      case "Up":
        break;
    }
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltipShow(id) {
    const tab = this.get(id);
    const el = query6(this.box).find("#tabs_" + this.name + "_tab_" + w2utils.escapeId(id)).get(0);
    if (this.tooltip == null || tab?.disabled || this.last.reordering) {
      return;
    }
    const pos = this.tooltip;
    let txt = tab?.tooltip;
    if (typeof txt == "function") txt = txt.call(this, tab);
    w2tooltip.show({
      anchor: el,
      name: this.name + "_tooltip",
      html: txt,
      position: pos
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltipHide(_id) {
    if (this.tooltip == null) return;
    w2tooltip.hide(this.name + "_tooltip");
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
      closable = `<div class="w2ui-tab-close w2ui-eaction ${this.active === tab.id ? "active" : ""}"
                data-mousedown="stop" data-mouseup="clickClose|${tab.id}|event">
            </div>`;
    }
    let icon = "";
    if (tab.icon) {
      icon = `<span class="w2ui-tab-icon ${tab.icon}"></span>`;
    }
    return `
            <div id="tabs_${this.name}_tab_${tab.id}" style="${addStyle} ${tab.style}"
                class="w2ui-tab w2ui-eaction ${this.active === tab.id ? "active" : ""} ${tab.closable ? "closable" : ""} ${tab.class ? tab.class : ""}"
                data-mouseenter="mouseAction|Enter|${tab.id}|event]"
                data-mouseleave="mouseAction|Leave|${tab.id}|event]"
                data-mousedown="mouseAction|Down|${tab.id}|event"
                data-mouseup="mouseAction|Up|${tab.id}|event"
                data-click="click|${tab.id}|event">
                    ${icon + w2utils.lang(text) + closable}
            </div>`;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refresh(id) {
    const time = Date.now();
    if (this.flow == "up") {
      query6(this.box).addClass("w2ui-tabs-up");
    } else {
      query6(this.box).removeClass("w2ui-tabs-up");
    }
    const edata = this.trigger("refresh", { target: id != null ? id : this.name, object: this.get(id) });
    if (edata.isCancelled === true) return;
    if (id == null) {
      for (let i = 0; i < this.tabs.length; i++) {
        this.refresh(this.tabs[i].id);
      }
    } else {
      const selector = "#tabs_" + this.name + "_tab_" + w2utils.escapeId(id);
      const $tab = query6(this.box).find(selector);
      const tabHTML = this.getTabHTML(id);
      if ($tab.length === 0) {
        if (tabHTML) query6(this.box).find("#tabs_" + this.name + "_right").before(tabHTML);
      } else {
        if (query6(this.box).find(".tab-animate-insert").length == 0) {
          if (tabHTML) $tab.replace(tabHTML);
        }
      }
      w2utils.bindEvents(query6(this.box).find(`${selector}, ${selector} .w2ui-eaction`), this);
    }
    query6(this.box).find("#tabs_" + this.name + "_right").html(this.right);
    edata.finish();
    return Date.now() - time;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render(box) {
    const time = Date.now();
    if (typeof box == "string") box = query6(box).get(0);
    const edata = this.trigger("render", { target: this.name, box: box ?? this.box });
    if (edata.isCancelled === true) return;
    if (box != null) {
      this.unmount();
      this.box = box;
    }
    if (!this.box) return false;
    const html = `
            <div class="w2ui-tabs-line"></div>
            <div class="w2ui-scroll-wrapper w2ui-eaction" data-mousedown="resize">
                <div id="tabs_${this.name}_right" class="w2ui-tabs-right">${this.right}</div>
            </div>
            <div class="w2ui-scroll-left w2ui-eaction" data-click='["scroll","left"]'></div>
            <div class="w2ui-scroll-right w2ui-eaction" data-click='["scroll","right"]'></div>`;
    query6(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-tabs").html(html);
    if (query6(this.box).length > 0) {
      query6(this.box)[0].style.cssText += this.style;
    }
    w2utils.bindEvents(query6(this.box).find(".w2ui-eaction"), this);
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
  initReorder(id, event2) {
    if (!this.reorder) return;
    const self = this;
    const $tab = query6(this.box).find("#tabs_" + this.name + "_tab_" + w2utils.escapeId(id));
    const tabIndex = this.get(id, true);
    const $ghost = query6($tab.get(0).cloneNode(true));
    let edata;
    $ghost.attr("id", "#tabs_" + this.name + "_tab_ghost");
    this.last.moving = {
      index: tabIndex,
      indexFrom: tabIndex,
      $tab,
      $ghost,
      divX: 0,
      left: $tab.get(0).getBoundingClientRect().left,
      parentX: query6(this.box).get(0).getBoundingClientRect().left,
      x: event2.pageX,
      opacity: $tab.css("opacity")
    };
    query6(document).off(".w2uiTabReorder").on("mousemove.w2uiTabReorder", function(event3) {
      const mouseEvent = event3;
      if (!self.last.reordering) {
        edata = self.trigger("reorder", { target: self.tabs[tabIndex].id, indexFrom: tabIndex, tab: self.tabs[tabIndex] });
        if (edata.isCancelled === true) return;
        w2tooltip.hide(self.name + "_tooltip");
        self.last.reordering = true;
        $ghost.addClass("moving");
        $ghost.css({
          "pointer-events": "none",
          "position": "absolute",
          "left": $tab.get(0).getBoundingClientRect().left
        });
        $tab.css("opacity", 0);
        query6(self.box).find(".w2ui-scroll-wrapper").append($ghost.get(0));
        query6(self.box).find(".w2ui-tab-close").hide();
      }
      self.last.moving.divX = mouseEvent.pageX - self.last.moving.x;
      $ghost.css("left", self.last.moving.left - self.last.moving.parentX + self.last.moving.divX + "px");
      self.dragMove(mouseEvent);
    }).on("mouseup.w2uiTabReorder", function() {
      query6(document).off(".w2uiTabReorder");
      $ghost.css({
        "transition": "0.1s",
        "left": self.last.moving.$tab.get(0).getBoundingClientRect().left - self.last.moving.parentX
      });
      query6(self.box).find(".w2ui-tab-close").show();
      $ghost.remove();
      $tab.css({ opacity: self.last.moving.opacity });
      if (self.last.reordering) {
        edata.finish({ indexTo: self.last.moving.index });
      }
      self.last.reordering = false;
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scroll(direction, instant) {
    return new Promise((resolve, _reject) => {
      const scrollBox = query6(this.box).find(".w2ui-scroll-wrapper");
      const scrollBoxEl = scrollBox.get(0);
      const scrollLeft = scrollBoxEl.scrollLeft;
      const right = scrollBox.find(".w2ui-tabs-right").get(0);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollIntoView(id, instant) {
    return new Promise((resolve, _reject) => {
      if (id == null) id = this.active;
      const tab = this.get(id);
      if (tab == null) return;
      const tabEl = query6(this.box).find("#tabs_" + this.name + "_tab_" + w2utils.escapeId(id)).get(0);
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
      const box = query6(this.box);
      box.find(".w2ui-scroll-left, .w2ui-scroll-right").hide();
      const scrollBox = box.find(".w2ui-scroll-wrapper").get(0);
      const $right = box.find(".w2ui-tabs-right");
      const boxWidth = box.get(0).getBoundingClientRect().width;
      const itemsWidth = $right.length > 0 ? $right[0].offsetLeft + $right[0].clientWidth : 0;
      if (boxWidth < itemsWidth) {
        if (scrollBox.scrollLeft > 0) {
          box.find(".w2ui-scroll-left").show();
        }
        if (boxWidth < itemsWidth - scrollBox.scrollLeft) {
          box.find(".w2ui-scroll-right").show();
        }
      }
    }
    edata.finish();
    return Date.now() - time;
  }
  destroy() {
    const edata = this.trigger("destroy", { target: this.name });
    if (edata.isCancelled === true) return;
    if (query6(this.box).find("#tabs_" + this.name + "_right").length > 0) {
      this.unmount();
    }
    delete w2ui[this.name];
    edata.finish();
  }
  unmount() {
    super.unmount();
    this.last.observeResize?.disconnect();
  }
  // ===================================================
  // -- Internal Event Handlers
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  click(id, event2) {
    if (event2 && query6(event2.target).hasClass("w2ui-tab-close")) {
      return;
    }
    const tab = this.get(id);
    if (tab == null || tab.disabled || this.last.reordering) return false;
    const edata = this.trigger("click", { target: id, tab, object: tab, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    query6(this.box).find("#tabs_" + this.name + "_tab_" + w2utils.escapeId(this.active)).removeClass("active");
    this.active = tab.id;
    query6(this.box).find("#tabs_" + this.name + "_tab_" + w2utils.escapeId(this.active)).addClass("active");
    if (typeof tab.route == "string") {
      let route = tab.route !== "" ? String("/" + tab.route).replace(/\/{2,}/g, "/") : "";
      const info = w2utils.parseRoute(route);
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
  clickClose(id, event2) {
    const tab = this.get(id);
    if (tab == null || tab.disabled) return false;
    const edata = this.trigger("close", { target: id, object: tab, tab, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    this.animateClose(id).then(() => {
      this.remove(id);
      edata.finish();
      this.refresh();
    });
    event2?.stopPropagation();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animateClose(id) {
    return new Promise((resolve, _reject) => {
      const $tab = query6(this.box).find("#tabs_" + this.name + "_tab_" + w2utils.escapeId(id));
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
      let $before = query6(this.box).find("#tabs_" + this.name + "_tab_" + w2utils.escapeId(id));
      const tabHTML = this.getTabHTML(tab.id);
      const $tab = query.html(tabHTML);
      if ($before.length == 0) {
        $before = query6(this.box).find("#tabs_tabs_right");
        $before.before($tab);
        this.resize();
      } else {
        $tab.css({ opacity: 0 });
        query6(this.box).find("#tabs_tabs_right").before($tab.get(0));
        const $tmp = query6(this.box).find("#" + $tab.attr("id"));
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

// src/w2toolbar.ts
var query7 = query;
var w2toolbar = class extends w2base {
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
      // w2toolbar.tooltip should be
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
    this._refresh = ({ effected, resize, refreshTooltip }) => {
      const options2 = this.last.pendingRefresh;
      options2.ids ??= [];
      options2.ids.push(...effected);
      Object.assign(options2, { resize, refreshTooltip });
      this._refreshDebounced();
    };
    this._refreshDebounced = w2utils.debounce(() => {
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
    if (typeof this.box == "string") this.box = query7(this.box).get(0);
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
      if (item.type == null) {
        console.log('ERROR: The parameter "type" is required but not supplied.', item);
        return;
      }
      if (!w2utils.checkUniqueId(item.id, this.items, "toolbar", this.name)) return;
      const newItem = w2utils.extend({}, this.item_template, item);
      if (newItem.type == "group" && Array.isArray(newItem.items)) {
        newItem.items.forEach((_it, ind) => {
          newItem.items[ind] = w2utils.extend({}, this.item_template, newItem.items[ind]);
        });
      }
      if (newItem.type == "menu-check") {
        if (!Array.isArray(newItem.selected)) newItem.selected = [];
        if (Array.isArray(newItem.items)) {
          newItem.items.forEach((it) => {
            if (typeof it === "string") {
              it = arr[idx] = { id: it, text: it };
            }
            if (it.checked && !newItem.selected.includes(it.id)) newItem.selected.push(it.id);
            if (!it.checked && newItem.selected.includes(it.id)) it.checked = true;
            if (it.checked == null) it.checked = false;
          });
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
        this.items = this.items.slice(0, middle).concat([newItem], this.items.slice(middle));
      }
      newItem.line = newItem.line ?? 1;
      if (skipRefresh !== true) this.refresh(newItem.id);
    });
    if (skipRefresh !== true) this.resize();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remove(...args) {
    let effected = 0;
    args.forEach((item) => {
      const it = this.get(item);
      if (!it || String(item).indexOf(":") != -1) return;
      effected++;
      query7(this.box).find("#tb_" + this.name + "_item_" + w2utils.escapeId(it.id)).remove();
      const ind = this.get(it.id, true);
      if (ind != null) this.items.splice(ind, 1);
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
        if (sub != null) return sub;
      }
    }
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCount(id, count, className, style) {
    const btn = query7(this.box).find(`#tb_${this.name}_item_${w2utils.escapeId(id)} .w2ui-tb-count > span`);
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
      this.setCount(id, count, className, style);
    }
  }
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  uncheck(...args) {
    const effected = [];
    args.forEach((item) => {
      const it = this.get(item);
      if (!it || String(item).indexOf(":") != -1) return;
      if (["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(it.type) && it.checked) {
        w2tooltip.hide(this.name + "-drop");
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  click(id, event2) {
    const tmp = String(id).split(":");
    const it = this.get(tmp[0]);
    let items = it && it.items ? w2utils.normMenu.call(this, it.items, it) : [];
    if (tmp.length > 1) {
      const subItem = this.get(id);
      if (subItem && !subItem.disabled) {
        this.menuClick({ name: this.name, item: it, subItem, originalEvent: event2 });
      }
      return;
    }
    if (it && !it.disabled) {
      const edata = this.trigger("click", {
        target: id != null ? id : this.name,
        item: it,
        object: it,
        originalEvent: event2
      });
      if (edata.isCancelled === true) return;
      items = it && it.items ? w2utils.normMenu.call(this, it.items, it) : [];
      const btn = "#tb_" + this.name + "_item_" + w2utils.escapeId(it.id);
      query7(this.box).find(btn).removeClass("down");
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
        query7(this.box).find(btn).addClass("checked");
      }
      if (["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(it.type)) {
        this.tooltipHide(id);
        if (it.checked) {
          w2tooltip.hide(this.name + "-drop");
          return;
        } else {
          const overlay = w2tooltip.get(this.name + "-drop");
          if (overlay?.displayed) overlay.hide();
          overlay?.listeners?.splice(0);
          setTimeout(() => {
            const hideDrop = (id2, _btn) => {
              return () => {
                this.set(id2, { checked: false });
              };
            };
            const el = query7(this.box).find("#tb_" + this.name + "_item_" + w2utils.escapeId(it.id));
            if (!w2utils.isPlainObject(it.overlay)) it.overlay = {};
            if (it.type == "drop") {
              ;
              w2tooltip.show(w2utils.extend({
                html: it.html,
                class: "w2ui-white",
                hideOn: ["doc-click"]
              }, it.overlay, {
                anchor: el[0],
                name: this.name + "-drop",
                data: { item: it, btn }
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
              w2menu.show(w2utils.extend({
                items,
                selected: -1,
                align: it.text ? "left" : "none"
                // if there is no text, then no alignent
              }, it.overlay, {
                type: menuType,
                name: this.name + "-drop",
                anchor: el[0],
                data: { item: it, btn }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              })).hide(hideDrop(it.id, btn)).remove((event3) => {
                this.menuClick({
                  name: this.name,
                  remove: true,
                  item: it,
                  subItem: event3.detail.item,
                  originalEvent: event3
                });
              }).select((event3) => {
                this.menuClick({
                  name: this.name,
                  item: it,
                  subItem: event3.detail.item,
                  originalEvent: event3
                });
              });
            }
            if (["color", "text-color"].includes(it.type)) {
              ;
              w2color.show(w2utils.extend({
                color: it.color
              }, it.overlay, {
                anchor: el[0],
                name: this.name + "-drop",
                data: { item: it, btn }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              })).hide(hideDrop(it.id, btn)).liveUpdate((event3) => {
                const edata2 = this.trigger("liveUpdate", { name: this.name, item: it, color: event3.detail.color });
                edata2.finish();
              }).select((event3) => {
                if (event3.detail.color != null) {
                  this.colorClick({ name: this.name, item: it, color: event3.detail.color });
                }
              });
            }
          }, 0);
        }
      }
      if (["check", "menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(it.type)) {
        it.checked = !it.checked;
        if (it.checked) {
          query7(this.box).find(btn).addClass("checked");
        } else {
          query7(this.box).find(btn).removeClass("checked");
        }
      }
      if (it.route) {
        let route = String("/" + it.route).replace(/\/{2,}/g, "/");
        const info = w2utils.parseRoute(route);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scroll(direction, line, instant) {
    return new Promise((resolve, _reject) => {
      const scrollBox = query7(this.box).find(`.w2ui-tb-line:nth-child(${line}) .w2ui-scroll-wrapper`);
      const scrollBoxEl = scrollBox.get(0);
      const scrollLeft = scrollBoxEl.scrollLeft;
      const right = scrollBox.find(".w2ui-tb-right").get(0);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render(box) {
    const time = Date.now();
    if (typeof box == "string") box = query7(box).get(0);
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
                    <div class="w2ui-tb-line">
                        <div class="w2ui-scroll-wrapper w2ui-eaction" data-mousedown="resize">
                            <div class="w2ui-tb-right">${this.right[line - 1] ?? ""}</div>
                        </div>
                        <div class="w2ui-scroll-left w2ui-eaction" data-click='["scroll", "left", "${line}"]'></div>
                        <div class="w2ui-scroll-right w2ui-eaction" data-click='["scroll", "right", "${line}"]'></div>
                    </div>
                `;
      }
      it.line = line;
    }
    query7(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-toolbar").html(html);
    if (query7(this.box).length > 0) {
      query7(this.box)[0].style.cssText += this["style"];
    }
    w2utils.bindEvents(query7(this.box).find(".w2ui-tb-line .w2ui-eaction"), this);
    this.last.observeResize = new ResizeObserver(() => {
      this.resize();
    });
    this.last.observeResize.observe(this.box);
    this.refresh();
    this.resize();
    edata.finish();
    return Date.now() - time;
  }
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
    const selector = `#tb_${this.name}_item_${w2utils.escapeId(it.id)}`;
    const btn = query7(this.box).find(selector);
    const html = this.getItemHTML(it);
    this.tooltipHide(id);
    if (it.type == "spacer") {
      query7(this.box).find(`.w2ui-tb-line:nth-child(${it.line ?? 1})`).find(".w2ui-tb-right").css("width", "auto");
    }
    if (btn.length === 0) {
      const next = parseInt(this.get(id, true)) + 1;
      let $next = query7(this.box).find(`#tb_${this.name}_item_${w2utils.escapeId(this.items[next] ? this.items[next].id : "--")}`);
      if ($next.length == 0) {
        $next = query7(this.box).find(`.w2ui-tb-line:nth-child(${it.line}`).find(".w2ui-tb-right").before(html);
      } else {
        $next.after(html);
      }
      w2utils.bindEvents(query7(this.box).find(`${selector}, ${selector} .w2ui-eaction`), this);
    } else {
      query7(this.box).find(selector).replace(query.html(html));
      const newBtn = query7(this.box).find(selector);
      w2utils.bindEvents(newBtn, this);
      w2utils.bindEvents(newBtn.find(".w2ui-eaction"), this);
      const overlays = w2tooltip.get(true);
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
      w2menu.update(this.name + "-drop", items);
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
    query7(this.box).find(".w2ui-tb-line").each((el) => {
      const box = query7(el);
      box.find(".w2ui-scroll-left, .w2ui-scroll-right").hide();
      const scrollBox = box.find(".w2ui-scroll-wrapper").get(0);
      const $right = box.find(".w2ui-tb-right");
      const boxWidth = box.get(0).getBoundingClientRect().width;
      const itemsWidth = $right.length > 0 ? $right[0].offsetLeft + $right[0].clientWidth : 0;
      if (boxWidth < itemsWidth) {
        if (scrollBox.scrollLeft > 0) {
          box.find(".w2ui-scroll-left").show();
        }
        if (boxWidth < itemsWidth - scrollBox.scrollLeft) {
          box.find(".w2ui-scroll-right").show();
        }
      }
    });
    edata.finish();
    return Date.now() - time;
  }
  destroy() {
    const edata = this.trigger("destroy", { target: this.name });
    if (edata.isCancelled === true) return;
    if (query7(this.box).find(".w2ui-scroll-wrapper").length > 0) {
      this.unmount();
    }
    delete w2ui[this.name];
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
      icon = `<div class="w2ui-tb-icon">${icon}</div>`;
    }
    const classes = ["w2ui-tb-button", "w2ui-eaction"];
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
          text = `<span class="w2ui-tb-color-box" style="background-color: ${item.color != null ? item.color : "#fff"}"></span>
                           ${item.text ? `<div style="margin-left: 17px;">${w2utils.lang(item.text)}</div>` : ""}`;
        }
        if (item.type == "text-color") {
          const color = item.color != null ? item.color : "#444";
          let bcolor = item.backColor;
          if (item.backColor === true) {
            bcolor = "#fff";
            if (Number(w2utils.colorContrast("#fff", color)) < 2) {
              bcolor = "#555";
            }
          }
          text = `<span style="color: ${color}">${item.text ? w2utils.lang(item.text) : item.backColor ? `<b style="background-color: ${bcolor ?? "transparent"}; padding: 2px 5px; border-radius: 3px;">Ab</b>` : "<b>Ab</b>"}</span>`;
        }
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
                        ${text != "" && text != null || item.count != null || arrow ? `<div class="w2ui-tb-text" style="${item.type != "label" ? item.style ?? "" : ""}; ${!text ? "padding-left: 0; margin-left: 23px;" : ""}">
                                    ${w2utils.lang(text)}
                                    ${item.count != null ? w2utils.stripSpaces(`
                                            <span class="w2ui-tb-count">
                                                <span class="${this.last.badge[item.id] ? this.last.badge[item.id].className ?? "" : ""}"
                                                        style="${this.last.badge[item.id] ? this.last.badge[item.id].style ?? "" : ""}">${item.count}</span>
                                            </span>`) : ""}
                                    ${arrow ? `<span class="w2ui-tb-down" ${!text && !item.count ? 'style="margin-left: -3px"' : ""}><span></span></span>` : ""}
                                </div>` : ""}
                    </div>
                `;
        break;
      }
      case "break": {
        html = `<div id="tb_${this.name}_item_${item.id}" class="w2ui-tb-break"
                            style="${item.hidden ? "display: none" : ""}; ${item.style ? item.style : ""}">
                            &#160;
                        </div>`;
        break;
      }
      case "spacer": {
        html = `<div id="tb_${this.name}_item_${item.id}" class="w2ui-tb-spacer"
                            style="${item.hidden ? "display: none" : ""}; ${item.style ? item.style : ""}">
                        </div>`;
        break;
      }
      case "html": {
        html = `<div id="tb_${this.name}_item_${item.id}" class="w2ui-tb-html ${classes.join(" ")}"
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
        html = `<div id="tb_${this.name}_item_${item.id}" class="w2ui-tb-input w2ui-eaction ${classes.join(" ")}"
                            style="${item.hidden ? "display: none" : ""}; ${item.style ? item.style : ""}"
                        >
                            <span class="w2ui-input-label">${item.text ?? ""}</span>
                            ${item.input?.spinner ? `<span class="w2ui-spinner-dec w2ui-eaction" data-click='["spinner", "${item.id}", "dec", "event"]'> \u2013 </span>` : ""}
                            <input class="w2ui-toolbar-input w2ui-eaction ${item.input?.spinner ? "w2ui-has-spinner" : ""}"
                                ${ph ? `placeholder="${ph}"` : ""} style="${item.input?.style ?? ""}"
                                value="${val ?? ""}${item.input?.suffix ?? ""}" ${item.input?.attrs ?? ""}
                                data-input='["change", "${item.id}", "this", true]'
                                data-change='["change", "${item.id}", "this"]'
                                data-keydown='["spinner", "${item.id}", "key", "event"]'
                                data-mouseenter='["mouseAction", "event", "this", "Enter", "${item.id}"]'
                                data-mouseleave='["mouseAction", "event", "this", "Leave", "${item.id}"]'
                            >
                            ${item.input?.spinner ? `<span class="w2ui-spinner-inc w2ui-eaction" data-click='["spinner", "${item.id}", "inc", "event"]'> + </span>` : ""}
                        </div>`;
        break;
      }
      case "group": {
        html = `<div id="tb_${this.name}_item_${item.id}" class="w2ui-tb-group"
                    style="display: flex; ${item.hidden ? "display: none" : ""}; ${item.style ? item.style : ""}">`;
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
  spinner(id, action, event2) {
    const it = this.get(id);
    let inc = 0;
    const edata = this.trigger("keyDown", { id, item: it, originalEvent: event2 });
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
          if (event2.shiftKey || event2.metaKey) mult = 10;
          if (event2.altKey) mult = 0.1;
          switch (event2.key) {
            case "ArrowUp": {
              inc = (it.input?.step ?? 1) * mult;
              event2.preventDefault();
              break;
            }
            case "ArrowDown": {
              inc = -(it.input?.step ?? 1) * mult;
              event2.preventDefault();
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change(id, value, dynamic) {
    const it = this.get(id);
    const input = query7(this.box).find("#tb_" + this.name + "_item_" + w2utils.escapeId(id)).find("input.w2ui-toolbar-input");
    if (value instanceof HTMLInputElement) {
      value = value.value;
    }
    if (value == null) value = input.val();
    if (it.input?.spinner || it.input?.min != null || it.input?.max != null || it.input?.step != null) {
      value = parseFloat(value);
    }
    if (it.input?.suffix != null && String(value).substr(-it.input.suffix.length) == it.input.suffix) {
      value = String(value).substr(0, value.length - it.input.suffix.length);
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
    const el = query7(this.box).find("#tb_" + this.name + "_item_" + w2utils.escapeId(id)).get(0);
    const item = this.get(id);
    const overlay = typeof this.tooltip == "string" ? { position: this.tooltip } : this.tooltip;
    let txt = item.tooltip;
    if (typeof txt == "function") txt = txt.call(this, item);
    if (["menu", "menu-radio", "menu-check", "drop", "color", "text-color"].includes(item.type) && item.checked == true) {
      return;
    }
    w2tooltip.show({
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
    w2tooltip.hide(this.name + "-tooltip");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuClick(event2) {
    if (event2.item && !event2.item.disabled) {
      const edata = this.trigger(event2.remove !== true ? "click" : "remove", {
        target: event2.item.id + ":" + event2.subItem.id,
        item: event2.item,
        subItem: event2.subItem,
        originalEvent: event2.originalEvent
      });
      if (edata.isCancelled === true) return;
      const it = event2.subItem;
      const item = this.get(event2.item.id);
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
        const info = w2utils.parseRoute(route);
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
      this.refresh(event2.item.id);
      edata.finish();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  colorClick(event2) {
    if (event2.item && !event2.item.disabled) {
      const edata = this.trigger("click", { target: event2.item.id, item: event2.item, color: event2.color, final: true });
      if (edata.isCancelled === true) return;
      event2.item.color = event2.color;
      this.refresh(event2.item.id);
      edata.finish();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mouseAction(event2, target, action, id) {
    const btn = this.get(id);
    const edata = this.trigger("mouse" + action, { target: id, item: btn, object: btn, originalEvent: event2 });
    if (edata.isCancelled === true || btn.disabled || btn.hidden) return;
    switch (action) {
      case "Enter":
        if (!["label", "input"].includes(btn.type)) {
          query7(target).addClass("over");
        }
        this.tooltipShow(id);
        break;
      case "Leave":
        if (!["label", "input"].includes(btn.type)) {
          query7(target).removeClass("over down");
        }
        this.tooltipHide(id);
        break;
      case "Down":
        if (!["label", "input"].includes(btn.type)) {
          query7(target).addClass("down");
        }
        break;
      case "Up":
        if (!["label", "input"].includes(btn.type)) {
          query7(target).removeClass("down");
        }
        break;
    }
    edata.finish();
  }
};

// src/w2form.ts
var w2tooltip3 = w2tooltip;
var query8 = query;
var w2form = class extends w2base {
  header;
  url;
  method;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routeData;
  // any: route params are user-supplied
  formURL;
  formHTML;
  page;
  pageStyle;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recid;
  // any: recid can be string, number, or null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields;
  // any: field definitions vary by type
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions;
  // any: action can be function or object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  record;
  // any: record values depend on field definitions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  original;
  dataType;
  saveCleanRecord;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postData;
  // any: user-defined post data
  httpHeaders;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolbar;
  // any: w2toolbar instance or config object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tabs;
  // any: w2tabs instance or config object
  style;
  focus;
  autosize;
  nestedFields;
  tabindexBase;
  isGenerated;
  last;
  onRequest;
  onLoad;
  onValidate;
  onSubmit;
  onProgress;
  onSave;
  onChange;
  onInput;
  onRender;
  onRefresh;
  onResize;
  onDestroy;
  onAction;
  onToolbar;
  onError;
  msgRefresh;
  msgSaving;
  msgServerError;
  ALL_TYPES;
  LIST_TYPES;
  W2FIELD_TYPES;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options) {
    super(options["name"]);
    this.name = "";
    this.header = "";
    this.box = null;
    this.url = "";
    this.method = null;
    this.routeData = {};
    this.formURL = "";
    this.formHTML = "";
    this.page = 0;
    this.pageStyle = "";
    this.recid = null;
    this.fields = [];
    this.actions = {};
    this.record = {};
    this.original = null;
    this.dataType = null;
    this.saveCleanRecord = true;
    this.postData = {};
    this.httpHeaders = {};
    this["toolbar"] = {};
    this["tabs"] = {};
    this.style = "";
    this.focus = 0;
    this.autosize = true;
    this.nestedFields = true;
    this.tabindexBase = 0;
    this.isGenerated = false;
    this.last = {
      fetchCtrl: null,
      // last fetch AbortController
      fetchOptions: null,
      // last fetch options
      errors: []
    };
    this.onRequest = null;
    this.onLoad = null;
    this.onValidate = null;
    this.onSubmit = null;
    this.onProgress = null;
    this.onSave = null;
    this.onChange = null;
    this.onInput = null;
    this.onRender = null;
    this.onRefresh = null;
    this.onResize = null;
    this.onDestroy = null;
    this.onAction = null;
    this.onToolbar = null;
    this.onError = null;
    this.msgRefresh = "Loading...";
    this.msgSaving = "Saving...";
    this.msgServerError = "Server error";
    this.ALL_TYPES = [
      "text",
      "textarea",
      "email",
      "pass",
      "password",
      "int",
      "float",
      "money",
      "currency",
      "percent",
      "hex",
      "alphanumeric",
      "color",
      "date",
      "time",
      "datetime",
      "toggle",
      "checkbox",
      "radio",
      "check",
      "checks",
      "list",
      "combo",
      "enum",
      "file",
      "select",
      "switch",
      "map",
      "array",
      "div",
      "custom",
      "html",
      "empty",
      "columns"
    ];
    this.LIST_TYPES = ["select", "radio", "check", "checks", "list", "combo", "enum", "switch"];
    this.W2FIELD_TYPES = [
      "int",
      "float",
      "money",
      "currency",
      "percent",
      "hex",
      "alphanumeric",
      "color",
      "date",
      "time",
      "datetime",
      "list",
      "combo",
      "enum",
      "file"
    ];
    w2utils.extend(this, options);
    const record = options["record"];
    const original = options["original"];
    const fields = options["fields"];
    const toolbar = options["toolbar"];
    let tabs = options["tabs"];
    Object.assign(this, { record: {}, original: null, fields: [], tabs: {}, toolbar: {}, handlers: [] });
    if (fields) {
      const sub = _processFields(fields);
      this.fields = sub.fields;
      if (!tabs && sub.tabs.length > 0) {
        tabs = sub.tabs;
      }
    }
    if (Array.isArray(tabs)) {
      w2utils.extend(this.tabs, { tabs: [] });
      for (let t = 0; t < tabs.length; t++) {
        const tmp = tabs[t];
        if (typeof tmp === "object") {
          this.tabs.tabs.push(tmp);
          if (tmp.active === true) {
            this.tabs.active = tmp.id;
          }
        } else {
          this.tabs.tabs.push({ id: tmp, text: tmp });
        }
      }
    } else {
      w2utils.extend(this.tabs, tabs);
    }
    w2utils.extend(this.toolbar, toolbar);
    for (const p in record) {
      if (w2utils.isPlainObject(record[p])) {
        this.record[p] = w2utils.clone(record[p]);
      } else {
        this.record[p] = record[p];
      }
    }
    for (const p in original) {
      if (this.original == null) this.original = {};
      if (w2utils.isPlainObject(original[p])) {
        this.original[p] = w2utils.clone(original[p]);
      } else {
        this.original[p] = original[p];
      }
    }
    if (this.formURL !== "") {
      fetch(this.formURL).then((resp) => resp.text()).then((text) => {
        this.formHTML = text;
        this.isGenerated = true;
        if (this.box) this.render(this.box);
      });
    } else if (!this.formURL && !this.formHTML) {
      this.formHTML = this.generateHTML();
      this.isGenerated = true;
    } else if (this.formHTML) {
      this.isGenerated = true;
    }
    if (typeof this.box == "string") this.box = query8(this.box).get(0);
    if (this.box) this.render(this.box);
    function _processFields(fields2) {
      const newFields = [];
      const tabs2 = [];
      if (w2utils.isPlainObject(fields2)) {
        let _process3 = function(fld) {
          const ignore = ["html"];
          if (fld.html == null) fld.html = {};
          Object.keys(fld).forEach(((key) => {
            if (ignore.includes(key)) return;
            if ([
              "label",
              "attr",
              "style",
              "text",
              "span",
              "page",
              "column",
              "anchor",
              "group",
              "groupStyle",
              "groupTitleStyle",
              "groupCollapsible"
            ].includes(key)) {
              fld.html[key] = fld[key];
              delete fld[key];
            }
          }));
          return fld;
        }, _process22 = function(fld, fld2) {
          const ignore = ["style", "html"];
          Object.keys(fld).forEach(((key) => {
            if (ignore.includes(key)) return;
            if (["span", "column", "attr", "text", "label"].includes(key)) {
              if (fld[key] && !fld2.html[key]) {
                fld2.html[key] = fld[key];
              }
            }
          }));
        };
        var _process = _process3, _process2 = _process22;
        const tmp = fields2;
        fields2 = [];
        Object.keys(tmp).forEach((key) => {
          const fld = tmp[key];
          if (fld.type == "group") {
            fld.text = key;
            if (w2utils.isPlainObject(fld.fields)) {
              const tmp2 = fld.fields;
              fld.fields = [];
              Object.keys(tmp2).forEach((key2) => {
                const fld2 = tmp2[key2];
                fld2.field = key2;
                fld.fields.push(_process3(fld2));
              });
            }
            fields2.push(fld);
          } else if (fld.type == "tab") {
            const tab = { id: key, text: key };
            if (fld.style) {
              tab.style = fld.style;
            }
            tabs2.push(tab);
            const sub = _processFields(fld.fields).fields;
            sub.forEach((fld2) => {
              fld2.html = fld2.html || {};
              fld2.html.page = tabs2.length - 1;
              _process22(fld, fld2);
            });
            fields2.push(...sub);
          } else {
            fld.field = key;
            fields2.push(_process3(fld));
          }
        });
      }
      fields2.forEach((field) => {
        if (field.type == "group") {
          const group = {
            group: field.text || "",
            groupStyle: field.style || "",
            groupTitleStyle: field.titleStyle || "",
            groupCollapsible: field.collapsible === true ? true : false
          };
          if (Array.isArray(field.fields)) {
            field.fields.forEach((gfield) => {
              const fld = w2utils.clone(gfield);
              if (fld.html == null) fld.html = {};
              w2utils.extend(fld.html, group);
              ["span", "column", "attr", "label", "page"].forEach((key) => {
                if (fld.html[key] == null && field[key] != null) {
                  fld.html[key] = field[key];
                }
              });
              if (fld.field == null && fld.name != null) {
                console.log("NOTICE: form field.name property is deprecated, please use field.field. Field ->", field);
                fld.field = fld.name;
              }
              newFields.push(fld);
            });
          }
        } else {
          const fld = w2utils.clone(field);
          if (fld.field == null && fld.name != null) {
            console.log("NOTICE: form field.name property is deprecated, please use field.field. Field ->", field);
            fld.field = fld.name;
          }
          newFields.push(fld);
        }
      });
      return { fields: newFields, tabs: tabs2 };
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(field, returnIndex) {
    if (arguments.length === 0) {
      const all = [];
      for (let f1 = 0; f1 < this.fields.length; f1++) {
        if (this.fields[f1].field != null) all.push(this.fields[f1].field);
      }
      return all;
    } else {
      for (let f2 = 0; f2 < this.fields.length; f2++) {
        if (this.fields[f2].field == field) {
          if (returnIndex === true) return f2;
          else return this.fields[f2];
        }
      }
      return null;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(field, obj) {
    for (let f = 0; f < this.fields.length; f++) {
      if (this.fields[f].field == field) {
        w2utils.extend(this.fields[f], obj);
        delete this.fields[f].w2field;
        this.refresh(field);
        return true;
      }
    }
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getValue(field, original) {
    if (this.nestedFields) {
      let val = void 0;
      try {
        const rec = original === true ? this.original : this.record;
        val = String(field).split(".").reduce((rec2, i) => {
          return rec2[i];
        }, rec);
      } catch (_event) {
      }
      return val;
    } else {
      return this.record[field];
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue(field, value, noRefresh) {
    if (value === "" || value == null || Array.isArray(value) && value.length === 0 || w2utils.isPlainObject(value) && Object.keys(value).length == 0) {
      value = null;
    }
    if (this.nestedFields) {
      try {
        let rec = this.record;
        String(field).split(".").map((fld, i, arr) => {
          if (arr.length - 1 !== i) {
            if (rec[fld]) rec = rec[fld];
            else {
              rec[fld] = {};
              rec = rec[fld];
            }
          } else {
            rec[fld] = value;
          }
        });
        if (!noRefresh) this.setFieldValue(field, value);
        return true;
      } catch (_event) {
        return false;
      }
    } else {
      this.record[field] = value;
      if (!noRefresh) this.setFieldValue(field, value);
      return true;
    }
  }
  rememberOriginal() {
    if (this.original == null) {
      if (Object.keys(this.record).length > 0) {
        this.original = w2utils.clone(this.record);
      } else {
        this.original = {};
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFieldValue(name) {
    const field = this.get(name);
    if (field == null) return void 0;
    const el = field.el;
    let previous = this.getValue(name);
    const original = this.getValue(name, true);
    let current = el.value;
    if (["int", "float", "percent", "money", "currency"].includes(field.type)) {
      current = field.w2field.clean(current);
    }
    if (["radio"].includes(field.type)) {
      const selected2 = query8(el).closest(".w2ui-field-group").find("input:checked").get(0);
      if (selected2) {
        const item = field.options.items[query8(selected2).data("index")];
        current = item.id;
      } else {
        current = null;
      }
    }
    if (["toggle", "checkbox"].includes(field.type)) {
      current = el.checked;
    }
    if (["check", "checks"].includes(field.type)) {
      current = [];
      const selected2 = query8(el).closest(".w2ui-field-group").find("input:checked");
      if (selected2.length > 0) {
        selected2.each((node) => {
          const el2 = node;
          const item = field.options.items[query8(el2).data("index")];
          current.push(item.id);
        });
      }
      if (!Array.isArray(previous)) previous = [];
    }
    const selected = field.w2field?.selected;
    if (["list", "enum", "file"].includes(field.type) && selected) {
      const nv = selected;
      const cv = previous;
      if (Array.isArray(nv)) {
        current = [];
        for (let i = 0; i < nv.length; i++) current[i] = w2utils.clone(nv[i]);
      }
      if (Array.isArray(cv)) {
        previous = [];
        for (let i = 0; i < cv.length; i++) previous[i] = w2utils.clone(cv[i]);
      }
      if (w2utils.isPlainObject(nv)) {
        current = w2utils.clone(nv);
      }
      if (w2utils.isPlainObject(cv)) {
        previous = w2utils.clone(cv);
      }
    }
    if (["map", "array"].includes(field.type)) {
      current = field.type == "map" ? {} : [];
      field.$el.parent().find(".w2ui-map-field").each((div, _ind) => {
        const key = query8(div).find(".w2ui-map.key").val();
        const value = query8(div).find(".w2ui-map.value").val();
        if (typeof field.html?.render == "function") {
          current[_ind] ??= {};
          query8(div).find("input, textarea").each((node) => {
            const inp = node;
            const name2 = inp.dataset["name"] ?? inp["name"];
            if (name2 != null && name2 != "") {
              current[_ind][name2] = ["checkbox", "radio"].includes(inp.type) ? inp.checked : inp.value;
            }
          });
        } else if (field.type == "map") {
          current[key] = value;
        } else {
          current.push(value);
        }
      });
    }
    return { current, previous, original };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findItem(item, items) {
    return items.find((it) => it.id === item || it.id === item?.id);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFieldValue(name, value) {
    const field = this.get(name);
    if (field == null) return;
    const el = field.el;
    switch (field.type) {
      case "toggle":
      case "checkbox": {
        el.checked = value ? true : false;
        break;
      }
      case "radio": {
        value = value?.id ?? value;
        const inputs = query8(el).closest(".w2ui-field-group").find("input");
        const items = field.options.items;
        items.forEach((it, ind) => {
          const input = inputs.filter(`[data-index="${ind}"]`);
          if (it.id === value) {
            input.prop("checked", true);
          } else {
            input.prop("checked", false);
          }
          if (it.hidden === true) {
            input.closest(".w2ui-field-item").hide();
          } else {
            input.closest(".w2ui-field-item").show();
          }
        });
        break;
      }
      case "check":
      case "checks": {
        if (!Array.isArray(value)) {
          if (value != null) {
            value = [value];
          } else {
            value = [];
          }
        }
        value = value.map((val) => val?.id ?? val);
        const inputs = query8(el).closest("div.w2ui-field-group").find("input");
        const items = field.options.items;
        items.forEach((it, ind) => {
          const input = inputs.filter(`[data-index="${ind}"]`);
          input.prop("checked", value.includes(it.id) ? true : false);
          if (it.hidden === true) {
            input.closest(".w2ui-field-item").hide();
          } else {
            input.closest(".w2ui-field-item").show();
          }
        });
        break;
      }
      case "list":
      case "combo": {
        let item = value;
        const map = field.options?.itemMap;
        if (item?.id == null && Array.isArray(field.options?.items)) {
          field.options.items.forEach((it) => {
            const val = w2utils.getNested(it, map?.id ?? "id");
            if (val === value) item = it;
          });
        }
        if (item?.id != null && item?.text == null && Array.isArray(field.options?.items)) {
          field.options.items.forEach((it) => {
            const id = w2utils.getNested(it, map?.id ?? "id");
            if (id === item.id) {
              item.text = w2utils.getNested(it, map.text ?? "text");
            }
          });
        }
        if (item != value) {
          this.setValue(field.name, item, true);
        }
        if (field.type == "list") {
          field.w2field.selected = item;
          field.w2field.refresh();
        } else {
          el.value = item?.text ?? value;
        }
        break;
      }
      case "switch": {
        el.value = value;
        field.toolbar.uncheck(...field.toolbar.get());
        field.toolbar.check(value);
        break;
      }
      case "enum":
      case "file": {
        if (!Array.isArray(value)) {
          value = value != null ? [value] : [];
        }
        const items = [...value];
        let updated = false;
        items.forEach((item, ind) => {
          if (item?.id == null && Array.isArray(field.options.items)) {
            field.options.items.forEach((it) => {
              if (it.id == item) {
                items[ind] = it;
                updated = true;
              }
            });
          }
        });
        if (updated) {
          this.setValue(field.name, items, true);
        }
        field.w2field.selected = items;
        field.w2field.refresh();
        break;
      }
      case "map":
      case "array": {
        if (field.type == "map" && (value == null || !w2utils.isPlainObject(value))) {
          this.setValue(field.field, {}, true);
          value = this.getValue(field.field);
        }
        if (field.type == "array" && (value == null || !Array.isArray(value))) {
          this.setValue(field.field, [], true);
          value = this.getValue(field.field);
        }
        const container = query8(field.el).parent().find(".w2ui-map-container");
        field.el.mapRefresh(value, container);
        break;
      }
      case "div":
      case "custom": {
        query8(el).html(value);
        break;
      }
      case "color": {
        el.value = value ?? "";
        field.w2field.refresh();
        break;
      }
      case "html":
      case "empty":
        break;
      default:
        if (value != null && el._w2field?.format) {
          const obj = el._w2field;
          value = obj.format(obj.clean(value));
        }
        el.value = value ?? "";
        break;
    }
    this.fields.forEach((fld) => {
      if (fld?.options?.parentList != null) {
        let updated;
        let values = this.getValue(fld.options.parentList);
        if (Array.isArray(values)) {
          values = values.map((vv) => vv.id);
        } else {
          values = values?.id != null ? [values.id] : [];
        }
        fld.options?.items?.forEach?.((item) => {
          const parent = w2utils.getNested(item, fld.options.parentField ?? "parentId");
          if (parent == null) {
            return;
          }
          const possible = w2utils.clone(Array.isArray(parent) ? parent : [parent]);
          possible.unshift("");
          const includes = values.some((item2) => possible.includes(item2));
          if (includes && item.hidden === true) {
            item.hidden = false;
            updated = true;
          } else if (!includes && item.hidden !== true) {
            item.hidden = true;
            updated = true;
          }
        });
        if (updated) {
          let value2 = this.getValue(fld.field);
          if (value2?.id != null) value2 = value2.id;
          if (fld.type == "enum") {
            const valid = fld.options.items.filter((it) => !it.hidden).map((it) => it.id);
            let values2 = this.getValue(fld.field);
            if (!Array.isArray(values2)) values2 = [values2];
            values2 = values2.map((it) => {
              if (typeof it == "string" || typeof it == "number") {
                it = fld.options.items.find((ii) => ii.id == it);
              }
              return it;
            });
            const new_values = values2.filter((it) => valid.includes(it.id));
            this.setValue(fld.field, new_values, true);
          } else {
            fld.options.items.forEach((it) => {
              if (it.id == value2 && it.hidden) {
                this.setValue(fld.field, null, true);
              }
            });
          }
          this.set(fld.field, { items: fld.options.items });
        }
      }
    });
  }
  show(...args) {
    const effected = [];
    for (let a = 0; a < args.length; a++) {
      const fld = this.get(args[a]);
      if (fld && fld.hidden) {
        fld.hidden = false;
        effected.push(fld.field);
      }
    }
    if (effected.length > 0) this.refresh(...effected);
    this.updateEmptyGroups();
    return effected;
  }
  hide(...args) {
    const effected = [];
    for (let a = 0; a < args.length; a++) {
      const fld = this.get(args[a]);
      if (fld && !fld.hidden) {
        fld.hidden = true;
        effected.push(fld.field);
      }
    }
    if (effected.length > 0) this.refresh(...effected);
    this.updateEmptyGroups();
    return effected;
  }
  enable(...args) {
    const effected = [];
    for (let a = 0; a < args.length; a++) {
      const fld = this.get(args[a]);
      if (fld && fld.disabled) {
        fld.disabled = false;
        effected.push(fld.field);
      }
    }
    if (effected.length > 0) this.refresh(...effected);
    return effected;
  }
  disable(...args) {
    const effected = [];
    for (let a = 0; a < args.length; a++) {
      const fld = this.get(args[a]);
      if (fld && !fld.disabled) {
        fld.disabled = true;
        effected.push(fld.field);
      }
    }
    if (effected.length > 0) this.refresh(...effected);
    return effected;
  }
  updateEmptyGroups() {
    query8(this.box).find(".w2ui-group").each((node) => {
      const group = node;
      if (isHidden(query8(group).find(".w2ui-field"))) {
        query8(group).hide();
      } else {
        query8(group).show();
      }
    });
    function isHidden($els) {
      let flag = true;
      $els.each((node) => {
        const el = node;
        if (el.style.display != "none") flag = false;
      });
      return flag;
    }
  }
  hideGroup(groupName) {
    const fields = [];
    let current = "";
    this.fields.forEach((fld) => {
      if (fld.html.group != null && fld.html.group !== "") {
        current = String(fld.html.group).toLowerCase();
      }
      if (groupName.toLowerCase() == current) {
        fields.push(fld.field);
      }
    });
    this.hide(...fields);
    this.resize();
  }
  showGroup(groupName) {
    const fields = [];
    let current = "";
    this.fields.forEach((fld) => {
      if (fld.html.group != null && fld.html.group !== "") {
        current = String(fld.html.group).toLowerCase();
      }
      if (groupName.toLowerCase() == current) {
        fields.push(fld.field);
      }
    });
    this.show(...fields);
    this.resize();
  }
  /**
   * When user clicks on group title, it will toggle the group (collapse or expand it).
   */
  toggleGroup(groupName, show) {
    const el = query8(this.box).find('.w2ui-group-title[data-group="' + w2utils.base64encode(groupName) + '"]');
    if (el.length === 0) return;
    const el_next = query8(el.prop("nextElementSibling"));
    if (typeof show === "undefined") {
      show = el_next.css("display") == "none";
    }
    if (show) {
      el_next.show();
      el.find("span").addClass("w2ui-icon-collapse").removeClass("w2ui-icon-expand");
    } else {
      el_next.hide();
      el.find("span").addClass("w2ui-icon-expand").removeClass("w2ui-icon-collapse");
    }
  }
  change(...args) {
    args.forEach((field) => {
      const tmp = this.get(field);
      if (tmp.$el) tmp.$el.change();
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reload(callBack) {
    const url = typeof this.url !== "object" ? this.url : this.url.get;
    if (url && this.recid != null) {
      return this.request(callBack);
    } else {
      if (typeof callBack === "function") callBack();
      return new Promise((resolve) => {
        resolve(void 0);
      });
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clear(...args) {
    if (args.length != 0) {
      args.forEach((field) => {
        let rec = this.record;
        String(field).split(".").map((fld, i, arr) => {
          if (arr.length - 1 !== i) rec = rec[fld];
          else delete rec[fld];
        });
        this.refresh(field);
      });
    } else {
      this.recid = null;
      this.record = {};
      this.original = null;
      this.refresh();
      this.hideErrors();
    }
  }
  error(msg) {
    const edata = this.trigger("error", {
      target: this.name,
      message: msg,
      fetchCtrl: this.last.fetchCtrl,
      fetchOptions: this.last.fetchOptions
    });
    if (edata.isCancelled === true) return;
    setTimeout(() => {
      this.message(msg);
    }, 1);
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message(options) {
    return w2utils.message({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      owner: this,
      // any: w2form has [key:string]:any but TS can't verify lock/unlock signature match
      box: this.box,
      after: ".w2ui-form-header"
    }, options);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  confirm(options) {
    return w2utils.confirm({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      owner: this,
      // any: same as message() above
      box: this.box,
      after: ".w2ui-form-header"
    }, options);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(showErrors) {
    if (showErrors == null) showErrors = true;
    const errors = [];
    for (let f = 0; f < this.fields.length; f++) {
      const field = this.fields[f];
      if (field.type == "columns" || field.field == null) {
        continue;
      }
      if (this.getValue(field.field) == null) this.setValue(field.field, "");
      if (["int", "float", "currency", "money"].includes(field.type)) {
        const val2 = this.getValue(field.field);
        const min = field.options.min;
        const max = field.options.max;
        if (min != null && val2 != null && val2 < min) {
          errors.push({ field, error: w2utils.lang("Should be more than ${min}", { min }) });
        }
        if (max != null && val2 != null && val2 > max) {
          errors.push({ field, error: w2utils.lang("Should be less than ${max}", { max }) });
        }
      }
      switch (field.type) {
        case "alphanumeric":
          if (this.getValue(field.field) && !w2utils.isAlphaNumeric(this.getValue(field.field))) {
            errors.push({ field, error: w2utils.lang("Not alpha-numeric") });
          }
          break;
        case "int":
          if (this.getValue(field.field) && !w2utils.isInt(this.getValue(field.field))) {
            errors.push({ field, error: w2utils.lang("Not an integer") });
          }
          break;
        case "percent":
        case "float":
          if (this.getValue(field.field) && !w2utils.isFloat(this.getValue(field.field))) {
            errors.push({ field, error: w2utils.lang("Not a float") });
          }
          break;
        case "currency":
        case "money":
          if (this.getValue(field.field) && !w2utils.isMoney(this.getValue(field.field))) {
            errors.push({ field, error: w2utils.lang("Not in money format") });
          }
          break;
        case "color":
        case "hex":
          if (this.getValue(field.field) && !w2utils.isHex(this.getValue(field.field))) {
            errors.push({ field, error: w2utils.lang("Not a hex number") });
          }
          break;
        case "email":
          if (this.getValue(field.field) && !w2utils.isEmail(this.getValue(field.field))) {
            errors.push({ field, error: w2utils.lang("Not a valid email") });
          }
          break;
        case "checkbox":
          if (this.getValue(field.field) == true) {
            this.setValue(field.field, true);
          } else {
            this.setValue(field.field, false);
          }
          break;
        case "date":
          if (!field.options.format) field.options.format = w2utils.settings.dateFormat;
          if (this.getValue(field.field) && !w2utils.isDate(this.getValue(field.field), field.options.format)) {
            errors.push({ field, error: w2utils.lang("Not a valid date") + ": " + field.options.format });
          }
          break;
        case "list":
        case "combo":
        case "switch":
          break;
        case "enum":
          break;
      }
      const val = this.getValue(field.field);
      if (field.hidden !== true && field.required && !["div", "custom", "html", "empty"].includes(field.type) && (val == null || val === "" || Array.isArray(val) && val.length === 0 || w2utils.isPlainObject(val) && Object.keys(val).length == 0)) {
        errors.push({ field, error: w2utils.lang("Required field") });
      }
      if (field.hidden !== true && field.options?.minLength > 0 && !["enum", "list", "combo"].includes(field.type) && (val == null || val.length < field.options.minLength)) {
        errors.push({ field, error: w2utils.lang(
          "Field should be at least ${count} characters.",
          { count: field.options.minLength }
        ) });
      }
    }
    const edata = this.trigger("validate", { target: this.name, errors });
    if (edata.isCancelled === true) return;
    this.last.errors = errors;
    if (showErrors) this.showErrors();
    edata.finish();
    return errors;
  }
  showErrors() {
    const errors = this.last.errors;
    if (errors.length <= 0) return;
    this.goto(errors[0].field.page);
    query8(errors[0].field.$el).parents(".w2ui-field").get(0).scrollIntoView({ block: "nearest", inline: "nearest" });
    errors.forEach((error) => {
      const opt = w2utils.extend({
        anchorClass: "w2ui-error",
        class: "w2ui-light",
        position: "right|left",
        hideOn: ["input", "tooltip-click"]
      }, error.options);
      if (error.field == null) return;
      let anchor = error.field.el;
      if (error.field.type === "radio") {
        anchor = query8(error.field.el).closest("div").get(0);
      } else if (["enum", "file"].includes(error.field.type)) {
      }
      w2tooltip3.show(w2utils.extend({
        anchor,
        name: `${this.name}-${error.field.field}-error`,
        html: error.error
      }, opt));
    });
    this.last.errorsShown = true;
    query8(errors[0].field.$el).parents(".w2ui-page").off(".hideErrors").on("scroll.hideErrors", (_evt) => {
      if (this.last.errorsShown) {
        this.showErrors();
      }
    });
  }
  hideErrors() {
    this.last.errorsShown = false;
    this.fields.forEach((field) => {
      w2tooltip3.hide(`${this.name}-${field.field}-error`);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getChanges() {
    let diff = {};
    if (this.original != null && typeof this.original == "object" && Object.keys(this.record).length !== 0) {
      diff = doDiff(this.record, this.original, {});
    }
    return diff;
    function doDiff(record, original, result) {
      if (Array.isArray(record) && Array.isArray(original)) {
        while (record.length < original.length) {
          record.push(null);
        }
      }
      for (const i in record) {
        if (record[i] != null && typeof record[i] === "object") {
          result[i] = doDiff(record[i], original[i] || {}, {});
          if (!result[i] || Object.keys(result[i]).length == 0 && Object.keys(original[i].length == 0)) delete result[i];
        } else if (record[i] != original[i] || record[i] == null && original[i] != null) {
          result[i] = record[i];
        }
      }
      return Object.keys(result).length != 0 ? result : null;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCleanRecord(strict) {
    const data = w2utils.clone(this.record);
    this.fields.forEach((fld) => {
      if (fld.type == "columns" || fld.field == null) {
        return;
      }
      if (["list", "combo", "enum"].includes(fld.type)) {
        const tmp = { nestedFields: true, record: data };
        const val = this.getValue.call(tmp, fld.field);
        if (w2utils.isPlainObject(val) && val.id != null) {
          this.setValue.call(tmp, fld.field, val.id);
        }
        if (Array.isArray(val)) {
          val.forEach((item, ind) => {
            if (w2utils.isPlainObject(item) && item.id) {
              val[ind] = item.id;
            }
          });
        }
      }
      if (fld.type == "map") {
        const tmp = { nestedFields: true, record: data };
        const val = this.getValue.call(tmp, fld.field);
        if (val._order) delete val._order;
      }
      if (fld.type == "file") {
        const tmp = { nestedFields: true, record: data };
        const val = this.getValue.call(tmp, fld.field) ?? [];
        val.forEach((v) => {
          delete v.file;
          delete v.modified;
        });
        this.setValue.call(tmp, fld.field, val);
      }
    });
    if (strict === true) {
      Object.keys(data).forEach((key) => {
        if (!this.get(key)) delete data[key];
      });
    }
    return data;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request(postData, callBack) {
    const self = this;
    let resolve, reject;
    const responseProm = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    if (typeof postData === "function") {
      callBack = postData;
      postData = null;
    }
    if (postData == null) postData = {};
    if (!this.url || typeof this.url === "object" && !this.url.get) return;
    const params = {};
    params.action = "get";
    params.recid = this.recid;
    params.name = this.name;
    w2utils.extend(params, this.postData);
    w2utils.extend(params, postData);
    const edata = this.trigger("request", {
      target: this.name,
      url: this.url,
      httpMethod: "GET",
      postData: params,
      httpHeaders: this.httpHeaders
    });
    if (edata.isCancelled === true) return;
    this.record = {};
    this.original = null;
    this.lock(w2utils.lang(this.msgRefresh));
    let url = edata.detail["url"];
    if (typeof url === "object" && url.get) url = url.get;
    if (this.last.fetchCtrl) try {
      this.last.fetchCtrl.abort();
    } catch (_e) {
    }
    if (Object.keys(this.routeData).length != 0) {
      const info = w2utils.parseRoute(url);
      if (info.keys.length > 0) {
        for (let k = 0; k < info.keys.length; k++) {
          const routeKey = info.keys[k];
          if (routeKey == null || this.routeData[routeKey.name] == null) continue;
          url = url.replace(new RegExp(":" + routeKey.name, "g"), this.routeData[routeKey.name]);
        }
      }
    }
    url = new URL(url, location.href);
    const fetchOptions = w2utils.prepareParams(url, {
      method: edata.detail["httpMethod"],
      headers: edata.detail["httpHeaders"],
      body: edata.detail["postData"]
    }, { dataType: this.dataType, caller: this, action: "request" });
    this.last.fetchCtrl = new AbortController();
    fetchOptions["signal"] = this.last.fetchCtrl.signal;
    this.last.fetchOptions = fetchOptions;
    fetch(url, fetchOptions).catch(processError).then((resp) => {
      if (resp?.status != 200) {
        if (resp) processError(resp);
        return;
      }
      resp.json().catch(processError).then((data) => {
        const edata2 = self.trigger("load", {
          target: self.name,
          fetchCtrl: self.last.fetchCtrl,
          fetchOptions: self.last.fetchOptions,
          data
        });
        if (edata2.isCancelled === true) return;
        if (data.error == null && data.status === "error") {
          data.error = true;
        }
        if (!data.record) {
          Object.assign(data, { record: w2utils.clone(data) });
        }
        if (data.error === true) {
          self.error(w2utils.lang(data.message ?? self.msgServerError));
        } else {
          self.record = w2utils.clone(data.record);
        }
        self.unlock();
        edata2.finish();
        self.refresh();
        self.setFocus();
        if (typeof callBack === "function") callBack(data);
        resolve(data);
      });
    });
    edata.finish();
    return responseProm;
    function processError(response) {
      if (response.name === "AbortError") {
        return;
      }
      self.unlock();
      const edata2 = self.trigger("error", { response, fetchCtrl: self.last.fetchCtrl, fetchOptions: self.last.fetchOptions });
      if (edata2.isCancelled === true) return;
      if (response.status && response.status != 200) {
        self.error(response.status + ": " + response.statusText);
      } else {
        console.log(
          "ERROR: Server request failed.",
          response,
          ". ",
          "Expected Response:",
          { error: false, record: { field1: 1, field2: "item" } },
          "OR:",
          { error: true, message: "Error description" }
        );
        self.error(String(response));
      }
      edata2.finish();
      reject(response);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  submit(postData, callBack) {
    return this.save(postData, callBack);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(postData, callBack) {
    const self = this;
    let resolve, reject;
    const saveProm = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    if (typeof postData === "function") {
      callBack = postData;
      postData = null;
    }
    const errors = self.validate(true);
    if ((errors?.length ?? 0) !== 0) return;
    if (postData == null) postData = {};
    if (!self.url || typeof self.url === "object" && !self.url.save) {
      console.log("ERROR: Form cannot be saved because no url is defined.");
      return;
    }
    self.lock(w2utils.lang(self.msgSaving) + ' <span id="' + self.name + '_progress"></span>');
    const params = {};
    params.action = "save";
    params.recid = self.recid;
    params.name = self.name;
    w2utils.extend(params, self.postData);
    w2utils.extend(params, postData);
    params.record = w2utils.clone(self.saveCleanRecord ? self.getCleanRecord() : self.record);
    const edata = self.trigger("submit", {
      target: self.name,
      url: self.url,
      httpMethod: this.method ?? "POST",
      postData: params,
      httpHeaders: self.httpHeaders
    });
    if (edata.isCancelled === true) return;
    let url = edata.detail["url"];
    if (typeof url === "object" && url.save) url = url.save;
    if (self.last.fetchCtrl) self.last.fetchCtrl.abort();
    if (Object.keys(self.routeData).length > 0) {
      const info = w2utils.parseRoute(url);
      if (info.keys.length > 0) {
        for (let k = 0; k < info.keys.length; k++) {
          const routeKey = info.keys[k];
          if (routeKey == null || self.routeData[routeKey.name] == null) continue;
          url = url.replace(new RegExp(":" + routeKey.name, "g"), self.routeData[routeKey.name]);
        }
      }
    }
    url = new URL(url, location.href);
    const fetchOptions = w2utils.prepareParams(url, {
      method: edata.detail["httpMethod"],
      headers: edata.detail["httpHeaders"],
      body: edata.detail["postData"]
    }, { dataType: this.dataType, caller: this, action: "save" });
    this.last.fetchCtrl = new AbortController();
    fetchOptions["signal"] = this.last.fetchCtrl.signal;
    this.last.fetchOptions = fetchOptions;
    fetch(url, fetchOptions).catch(processError).then((resp) => {
      self.unlock();
      if (resp?.status != 200) {
        processError(resp ?? {});
        return;
      }
      resp.json().catch(processError).then((data) => {
        const edata2 = self.trigger("save", {
          target: self.name,
          fetchCtrl: self.last.fetchCtrl,
          fetchOptions: self.last.fetchOptions,
          data
        });
        if (edata2.isCancelled === true) return;
        if (data.error === true) {
          self.error(w2utils.lang(data.message ?? self.msgServerError));
        } else {
          self.original = null;
        }
        edata2.finish();
        self.refresh();
        if (typeof callBack === "function") callBack(data);
        resolve(data);
      });
    });
    edata.finish();
    return saveProm;
    function processError(response) {
      if (response?.name === "AbortError") {
        return;
      }
      self.unlock();
      const edata2 = self.trigger("error", { response, fetchCtrl: self.last.fetchCtrl, fetchOptions: self.last.fetchOptions });
      if (edata2.isCancelled === true) return;
      if (response.status && response.status != 200) {
        response.json().then((data) => {
          self.error(response.status + ": " + (data.message || response.statusText));
        }).catch(() => {
          self.error(response.status + ": " + response.statusText);
        });
      } else {
        console.log(
          "ERROR: Server request failed.",
          response,
          ". ",
          "Expected Response:",
          { error: false, record: { field1: 1, field2: "item" } },
          "OR:",
          { error: true, message: "Error description" }
        );
        self.error(String(response));
      }
      edata2.finish();
      reject();
    }
  }
  lock(msg, showSpinner) {
    w2utils.lock(this.box, msg, showSpinner);
  }
  unlock(speed) {
    const box = this.box;
    w2utils.unlock(box, speed);
  }
  lockPage(page, msg, spinner) {
    const $page = query8(this.box).find(".page-" + page);
    if ($page.length) {
      w2utils.lock($page, msg, spinner);
      return true;
    }
    return false;
  }
  unlockPage(page, speed) {
    const $page = query8(this.box).find(".page-" + page);
    if ($page.length) {
      w2utils.unlock($page, speed);
      return true;
    }
    return false;
  }
  goto(page) {
    if (this.page === page) return;
    if (page != null) this.page = page;
    if (query8(this.box).data("autoSize") === true) {
      query8(this.box).get(0).clientHeight = 0;
    }
    this.refresh();
  }
  generateHTML() {
    const pages = [];
    let group = "";
    let page;
    let column;
    let tabindex;
    let tabindex_str;
    for (let f = 0; f < this.fields.length; f++) {
      let html2 = "";
      tabindex = this.tabindexBase + f + 1;
      tabindex_str = ' tabindex="' + tabindex + '"';
      const field = this.fields[f];
      if (field.html == null) field.html = {};
      if (typeof field.html == "string") {
        field.html = {
          html: field.html,
          span: 0,
          attr: "tabindex"
        };
        tabindex_str = "";
      }
      if (field.options == null) field.options = {};
      if (field.html.caption != null && field.html.label == null) {
        console.log("NOTICE: form field.html.caption property is deprecated, please use field.html.label. Field ->", field);
        field.html.label = field.html.caption;
      }
      if (field.html.label == null) field.html.label = field.field;
      if (field.html.anchor != null && field.html.span == null) {
        field.html.span = "";
      }
      field.html = w2utils.extend({ label: "", span: 6, attr: "", text: "", style: "", page: 0, column: 0 }, field.html);
      if (page == null) page = field.html.page;
      if (column == null) column = field.html.column;
      let input = `<input id="${field.field}" name="${field.field}" class="w2ui-input ${field.html.class ?? ""}" type="text" ${field.html.attr + tabindex_str}>`;
      switch (field.type) {
        case "pass":
        case "password":
          input = input.replace('type="text"', 'type="password"');
          break;
        case "checkbox": {
          input = `
                        <label class="w2ui-box-label">
                            <input id="${field.field}" name="${field.field}" class="w2ui-input ${field.html.class ?? ""}" type="checkbox" ${field.html.attr + tabindex_str}>
                            <span>${field.html.label}</span>
                        </label>`;
          break;
        }
        case "check":
        case "checks": {
          if (field.options.items == null && field.html.items != null) field.options.items = field.html.items;
          let items = field.options.items;
          input = `<div class="w2ui-field-group" ${field.html.attr}>`;
          if (!Array.isArray(items)) items = [];
          if (items.length > 0) {
            items = w2utils.normMenu.call(this, items, field.options);
          }
          for (let i = 0; i < items.length; i++) {
            input += `
                            <div class="w2ui-field-item">
                                <label class="w2ui-box-label">
                                    <input id="${field.field + i}" name="${field.field}" class="w2ui-input ${field.html.class ?? ""}" type="checkbox"
                                        ${tabindex_str} data-value="${items[i].id}" data-index="${i}">
                                    <span>&#160;${items[i].text}</span>
                                </label>
                            </div>`;
          }
          input += "</div>";
          break;
        }
        case "radio": {
          input = `<div class="w2ui-field-group"${field.html.attr}>`;
          if (field.options.items == null && field.html.items != null) field.options.items = field.html.items;
          let items = field.options.items;
          if (!Array.isArray(items)) items = [];
          if (items.length > 0) {
            items = w2utils.normMenu.call(this, items, field.options);
          }
          for (let i = 0; i < items.length; i++) {
            input += `
                            <div class="w2ui-field-item">
                                <label class="w2ui-box-label">
                                    <input id="${field.field + i}" name="${field.field}" class="w2ui-input ${field.html.class ?? ""}" type="radio"
                                        ${i === 0 ? tabindex_str : ""}
                                        data-value="${items[i].id}" data-index="${i}">
                                    <span>&#160;${items[i].text}</span>
                                </label>
                            </div>`;
          }
          input += "</div>";
          break;
        }
        case "select": {
          input = `<select id="${field.field}" name="${field.field}" class="w2ui-input ${field.html.class ?? ""}" ${field.html.attr + tabindex_str}>`;
          if (field.options.items == null && field.html.items != null) field.options.items = field.html.items;
          let items = field.options.items;
          if (!Array.isArray(items)) items = [];
          if (items.length > 0) {
            items = w2utils.normMenu.call(this, items, field.options);
          }
          for (let i = 0; i < items.length; i++) {
            input += `<option value="${items[i].id}">${items[i].text}</option>`;
          }
          input += "</select>";
          break;
        }
        case "switch": {
          input = `
                        <div>
                            <div id="${field.field}-tb" class="w2ui-form-switch ${field.html.class ?? ""}" ${field.html.attr}></div>
                            <input id="${field.field}" name="${field.field}" ${tabindex_str} class="w2ui-input"
                                style="position: absolute; right: 0px; margin-top: -30px; width: 1px; padding: 0; opacity: 0">
                            <span style="position: absolute; margin-top: -2px;">${field.html.text ?? ""}</span>
                        </div>
                        `;
          break;
        }
        case "textarea":
          input = `<textarea id="${field.field}" name="${field.field}" class="w2ui-input ${field.html.class ?? ""}" ${field.html.attr + tabindex_str}></textarea>`;
          break;
        case "toggle":
          input = `<input id="${field.field}" name="${field.field}" class="w2ui-input w2ui-toggle  ${field.html.class ?? ""}"
                                type="checkbox" ${field.html.attr + tabindex_str}>
                            <div><div></div></div>`;
          break;
        case "map":
        case "array":
          field.html.key = field.html.key || {};
          field.html.value = field.html.value || {};
          field.html.tabindex = tabindex;
          field.html.tabindex_str = tabindex_str;
          input = '<span style="float: right">' + (field.html.text || "") + '</span><input id="' + field.field + '" name="' + field.field + '" type="hidden" ' + field.html.attr + tabindex_str + '><div class="w2ui-map-container"></div>';
          break;
        case "div":
        case "custom":
          input = `<div id="${field.field}" name="${field.field}" ${field.html.attr + tabindex_str} class="w2ui-input ${field.html.class ?? ""}">` + (field && field.html && field.html.html ? field.html.html : "") + "</div>";
          break;
        case "html":
        case "empty":
          input = `<div id="${field.field}" name="${field.field}" ${field.html.attr + tabindex_str} class="w2ui-input ${field.html.class ?? ""}">` + (field && field.html ? (field.html.html || "") + (field.html.text || "") : "") + "</div>";
          break;
      }
      if (group !== "") {
        if (page != field.html.page || column != field.html.column || field.html.group && group != field.html.group) {
          pages[page][column] += "\n   </div>\n  </div>";
          group = "";
        }
      }
      if (field.html.group && group != field.html.group) {
        let collapsible = "";
        if (field.html.groupCollapsible) {
          collapsible = '<span class="w2ui-icon-collapse" style="width: 15px; display: inline-block; position: relative; top: -2px;"></span>';
        }
        html2 += '\n <div class="w2ui-group">\n   <div class="w2ui-group-title w2ui-eaction" style="' + (field.html.groupTitleStyle || "") + "; " + (collapsible != "" ? "cursor: pointer; user-select: none" : "") + '"' + (collapsible != "" ? 'data-group="' + w2utils.base64encode(field.html.group) + '"' : "") + (collapsible != "" ? 'data-click="toggleGroup|' + field.html.group + '"' : "") + ">" + collapsible + w2utils.lang(field.html.group) + '</div>\n   <div class="w2ui-group-fields" style="' + (field.html.groupStyle || "") + '">';
        group = field.html.group;
      }
      if (field.type == "columns") {
        html2 += `<div class="w2ui-field-columns" style="${field.style ?? ""}">`;
        field.columns.forEach((col) => {
          html2 += `<div style="${col.style}"> ${col.content} </div>`;
        });
        html2 += "</div>";
      } else if (field.html.col_anchor != null) {
        let span = field.html.span != null ? "w2ui-span" + field.html.span : "";
        if (field.html.span == -1) span = "w2ui-span-none";
        let label = `
                    <label ${span == "none" ? ' style="display: none"' : ""}>
                        ${w2utils.lang(field.type != "checkbox" ? field.html.label : field.html.text)}
                    </label>`;
        if (!field.html.label) label = "";
        const text = field.type != "array" && field.type != "map" ? w2utils.lang(field.type != "checkbox" ? field.html.text : "") : "";
        pages[field.html.page].anchors ??= {};
        pages[field.html.page].anchors[field.html.col_anchor] = `
                    <div class="w2ui-field ${span}" style="${(field.hidden ? "display: none;" : "") + field.html.style}">
                        ${label}
                        ${["empty", "switch", "radio", "check", "checks"].includes(field.type) ? input : `<div>${input + text}</div>`}
                    </div>`;
      } else if (field.html.anchor != null) {
        const span = field.html.span != null ? "w2ui-span" + field.html.span : "w2ui-span0";
        let label = w2utils.lang(field.type != "checkbox" ? field.html.label : field.html.text, true);
        const text = w2utils.lang(field.type != "checkbox" ? field.html.text : "");
        if (field.html.span == -1) {
          label = `<span style="position: absolute"> <span class="w2ui-anchor-span-none w2ui-inline-label"> ${label} </span> </span>`;
        } else {
          label = `<span class="w2ui-inline-label"> ${label} </span>`;
        }
        pages[field.html.page].anchors ??= {};
        pages[field.html.page].anchors[field.html.anchor] = `
                    <div class="w2ui-field w2ui-field-inline ${span}" style="${(field.hidden ? "display: none;" : "") + field.html.style}">
                        ${field.type === "empty" || field.type == "switch" ? input : ` <div>
                                    ${label} ${input} ${text}
                                </div>`}
                    </div>`;
      } else {
        let span = field.html.span != null ? "w2ui-span" + field.html.span : "";
        if (field.html.span == -1) span = "w2ui-span-none";
        let label = `
                    <label ${span == "none" ? ' style="display: none"' : ""}>
                        ${w2utils.lang(field.type != "checkbox" ? field.html.label : field.html.text)}
                    </label>`;
        if (!field.html.label) label = "";
        const text = field.type != "array" && field.type != "map" ? w2utils.lang(field.type != "checkbox" ? field.html.text : "") : "";
        html2 += `
                    <div class="w2ui-field ${span}" style="${(field.hidden ? "display: none;" : "") + field.html.style}">
                        ${label}
                        ${["empty", "switch", "radio", "check", "checks"].includes(field.type) ? input : `<div>${input + text}</div>`}
                    </div>`;
      }
      if (pages[field.html.page] == null) pages[field.html.page] = {};
      if (pages[field.html.page][field.html.column] == null) pages[field.html.page][field.html.column] = "";
      pages[field.html.page][field.html.column] += html2;
      page = field.html.page;
      column = field.html.column;
    }
    if (group !== "") pages[page][column] += "\n   </div>\n  </div>";
    if (this.tabs.tabs) {
      for (let i = 0; i < this.tabs.tabs.length; i++) if (pages[i] == null) pages[i] = [];
    }
    let buttons = "";
    if (Object.keys(this.actions).length > 0) {
      buttons += '\n<div class="w2ui-buttons">';
      tabindex = this.tabindexBase + this.fields.length + 1;
      for (const a in this.actions) {
        const act = this.actions[a];
        const info = { text: "", style: "", "class": "" };
        if (w2utils.isPlainObject(act)) {
          if (act.text == null && act.caption != null) {
            console.log("NOTICE: form action.caption property is deprecated, please use action.text. Action ->", act);
            act.text = act.caption;
          }
          if (act.text) info.text = act.text;
          if (act.style) info.style = act.style;
          if (act.class) info.class = act.class;
        } else {
          info.text = a;
          if (["save", "update", "create"].includes(a.toLowerCase())) info.class = "w2ui-btn-blue";
          else info.class = "";
        }
        buttons += '\n    <button name="' + a + '" class="w2ui-btn ' + info.class + '" style="' + info.style + '" tabindex="' + tabindex + '">' + w2utils.lang(info.text) + "</button>";
        tabindex++;
      }
      buttons += "\n</div>";
    }
    let html = "";
    for (let p = 0; p < pages.length; p++) {
      html += '<div class="w2ui-page page-' + p + '" style="' + (p !== 0 ? "display: none;" : "") + this.pageStyle + '">';
      if (!pages[p]) {
        console.log(`ERROR: Page ${p} does not exist`);
        return false;
      }
      if (pages[p].before) {
        html += pages[p].before;
      }
      html += '<div class="w2ui-column-container">';
      Object.keys(pages[p]).sort().forEach((c, _ind) => {
        if (c == String(parseInt(c))) {
          html += '<div class="w2ui-column col-' + c + '">' + (pages[p][c] || "") + "\n</div>";
        }
      });
      html += "\n</div>";
      if (pages[p].after) {
        html += pages[p].after;
      }
      html += "\n</div>";
      if (pages[p].anchors) {
        Object.keys(pages[p].anchors).forEach((key, _ind) => {
          html = html.replace(key, pages[p].anchors[key]);
        });
      }
    }
    html += buttons;
    return html;
  }
  action(action, event2) {
    const act = this.actions[action];
    let click = act;
    if (w2utils.isPlainObject(act) && act.onClick) click = act.onClick;
    const edata = this.trigger("action", { target: action, action: act, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    if (typeof click === "function") click.call(this, event2);
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAction(action) {
    const ret = query8(this.box).find('.w2ui-buttons button[name="' + action + '"]');
    if (ret.length === 0) {
      console.log('ERROR: Action "' + action + '" not found. Valid actions are: ' + Object.keys(this.actions).join(", "));
    }
    return ret;
  }
  actionHide(action) {
    this.getAction(action).hide();
  }
  actionShow(action) {
    this.getAction(action).show();
  }
  actionDisable(action) {
    this.getAction(action).prop("disabled", true);
  }
  actionEnable(action) {
    this.getAction(action).prop("disabled", false);
  }
  resize() {
    const self = this;
    const edata = this.trigger("resize", { target: this.name });
    if (edata.isCancelled === true) return;
    if (this.box != null) {
      let resizeElements2 = function() {
        const headerHeight2 = self.header !== "" ? w2utils.getSize(header, "height") : 0;
        const tbHeight2 = Array.isArray(self.toolbar?.items) && self.toolbar?.items?.length > 0 ? w2utils.getSize(toolbar, "height") : 0;
        const tabsHeight2 = Array.isArray(self.tabs?.tabs) && self.tabs?.tabs?.length > 0 ? w2utils.getSize(tabs, "height") : 0;
        toolbar.css({ top: headerHeight2 + "px" });
        tabs.css({ top: headerHeight2 + tbHeight2 + "px" });
        page.css({
          top: headerHeight2 + tbHeight2 + tabsHeight2 + "px",
          bottom: (buttons.length > 0 ? w2utils.getSize(buttons, "height") : 0) + "px"
        });
        return { headerHeight: headerHeight2, tbHeight: tbHeight2, tabsHeight: tabsHeight2 };
      };
      var resizeElements = resizeElements2;
      const header = query8(this.box).find(":scope > div .w2ui-form-header");
      const toolbar = query8(this.box).find(":scope > div .w2ui-form-toolbar");
      const tabs = query8(this.box).find(":scope > div .w2ui-form-tabs");
      const page = query8(this.box).find(":scope > div .w2ui-page");
      const dpage = query8(this.box).find(":scope > div .w2ui-page.page-" + this.page + " > div");
      const buttons = query8(this.box).find(":scope > div .w2ui-buttons");
      const { headerHeight, tbHeight, tabsHeight } = resizeElements2();
      if (this.autosize) {
        const cHeight = query8(this.box).get(0).clientHeight;
        if (cHeight === 0 || query8(this.box).data("autosize") == "yes") {
          query8(this.box).css({
            height: headerHeight + tbHeight + tabsHeight + 15 + (page.length > 0 ? w2utils.getSize(dpage, "height") : 0) + (buttons.length > 0 ? w2utils.getSize(buttons, "height") : 0) + "px"
          });
          query8(this.box).data("autosize", "yes");
        }
        resizeElements2();
      }
      this.tabs?.resize?.();
      this.toolbar?.resize?.();
      this.fields.forEach((field) => {
        if (field.type == "switch") {
          field.toolbar?.resize?.();
        }
      });
    }
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refresh(...args) {
    const time = Date.now();
    const self = this;
    if (!this.box) return 0;
    if (!this.isGenerated || !query8(this.box).html()) return 0;
    const edata = this.trigger("refresh", { target: this.name, page: this.page, field: args[0], fields: args });
    if (edata.isCancelled === true) return 0;
    let fields = Array.from(this.fields.keys());
    if (args.length > 0) {
      fields = args.map((fld, _ind) => {
        if (typeof fld != "string") console.log("ERROR: Arguments in refresh functions should be field names");
        return this.get(fld, true);
      }).filter((fld, _ind) => {
        if (fld != null) return true;
        else return false;
      });
    } else {
      query8(this.box).find("input, textarea, select").each((node) => {
        const el = node;
        const name = query8(el).attr("name") != null ? query8(el).attr("name") : query8(el).attr("id");
        const field = this.get(name);
        if (field) {
          const div = query8(el).closest(".w2ui-page");
          if (div.length > 0) {
            for (let i = 0; i < 100; i++) {
              if (div.hasClass("page-" + i)) {
                field.page = i;
                break;
              }
            }
          }
        }
      });
      query8(this.box).find(".w2ui-page").hide();
      query8(this.box).find(".w2ui-page.page-" + this.page).show();
      query8(this.box).find(".w2ui-form-header").html(w2utils.lang(this.header));
      if (typeof this.tabs === "object" && Array.isArray(this.tabs.tabs) && this.tabs.tabs.length > 0) {
        query8(this.box).find("#form_" + this.name + "_tabs").show();
        this.tabs.active = this.tabs.tabs[this.page].id;
        this.tabs.refresh();
      } else {
        query8(this.box).find("#form_" + this.name + "_tabs").hide();
      }
      if (typeof this.toolbar === "object" && Array.isArray(this.toolbar.items) && this.toolbar.items.length > 0) {
        query8(this.box).find("#form_" + this.name + "_toolbar").show();
        this.toolbar.refresh();
      } else {
        query8(this.box).find("#form_" + this.name + "_toolbar").hide();
      }
    }
    for (let f = 0; f < fields.length; f++) {
      const fieldIdx = fields[f];
      if (fieldIdx == null) continue;
      const field = this.fields[fieldIdx];
      if (field == null) continue;
      if (field.name == null && field.field != null) field.name = field.field;
      if (field.field == null && field.name != null) field.field = field.name;
      field.$el = query8(this.box).find(`[name='${String(field.name).replace(/\\/g, "\\\\")}']`);
      field.el = field.$el.get(0);
      if (field.el) field.el.id = field.name;
      if (field.w2field) {
        field.w2field.reset();
      }
      field.$el.off(".w2form").on("change.w2form", function(event2) {
        const value = self.getFieldValue(field.field);
        if (value == null) return;
        if (["enum", "file"].includes(field.type)) {
          const helper = field.w2field?.helpers?.multi;
          query8(helper).removeClass("w2ui-error");
        }
        if (this._previous != null) {
          value.previous = this._previous;
          delete this._previous;
        }
        const edata2 = self.trigger("change", { target: this.name, field: this.name, value, originalEvent: event2 });
        if (edata2.isCancelled === true) return;
        self.setValue(this.name, value.current);
        edata2.finish();
      }).on("input.w2form", function(event2) {
        self.rememberOriginal();
        const value = self.getFieldValue(field.field);
        if (value == null) return;
        if (this._previous == null) {
          this._previous = value.previous;
        }
        const edata2 = self.trigger("input", { target: self.name, field, value, originalEvent: event2 });
        if (edata2.isCancelled === true) return;
        self.setValue(this.name, value.current, true);
        edata2.finish();
      });
      if (field.required) {
        field.$el.closest(".w2ui-field").addClass("w2ui-required");
      } else {
        field.$el.closest(".w2ui-field").removeClass("w2ui-required");
      }
      if (field.disabled != null) {
        if (field.disabled) {
          if (field.$el.data("tabIndex") == null) {
            field.$el.data("tabIndex", field.$el.prop("tabIndex"));
          }
          field.$el.prop("disabled", true).prop("tabIndex", -1).closest(".w2ui-field").addClass("w2ui-disabled");
        } else {
          field.$el.prop("disabled", false).prop("tabIndex", field.$el.data("tabIndex") ?? field.$el.prop("tabIndex") ?? 0).closest(".w2ui-field").removeClass("w2ui-disabled");
        }
      }
      let tmp = field.el;
      if (!tmp) tmp = query8(this.box).find("#" + field.field);
      if (field.hidden) {
        query8(tmp).closest(".w2ui-field").hide();
      } else {
        query8(tmp).closest(".w2ui-field").show();
      }
    }
    query8(this.box).find("button, input[type=button]").each((node) => {
      const el = node;
      query8(el).off("click").on("click", function(event2) {
        let action = this.value;
        if (this.id) action = this.id;
        if (this["name"]) action = this["name"];
        self.action(action, event2);
      });
    });
    for (let f = 0; f < fields.length; f++) {
      const fieldIdx2 = fields[f];
      if (fieldIdx2 == null) continue;
      const field = this.fields[fieldIdx2];
      if (field == null) continue;
      if (!field.el) continue;
      if (!field.$el.hasClass("w2ui-input")) field.$el.addClass("w2ui-input");
      field.type = String(field.type).toLowerCase();
      if (!field.options) field.options = {};
      if (this.LIST_TYPES.includes(field.type)) {
        const items = field.options.items;
        if (items == null) field.options.items = [];
        if (field.type == "switch") {
          items.forEach((item, ind) => {
            return items[ind] = typeof item != "object" ? { id: item, text: item } : item;
          });
        } else {
          field.options.items = w2utils.normMenu.call(this, items ?? [], field.options);
        }
      }
      if (field.type == "switch") {
        if (field.toolbar) {
          ;
          w2ui[this.name + "_" + field.name + "_tb"].destroy();
        }
        field.options?.items?.forEach?.((it) => it.text == null ? it.text = "" : "");
        const items = w2utils.normMenu.call(this, field.options.items, field.options) ?? [];
        items.forEach((item) => item.type ??= "radio");
        field.toolbar = new w2toolbar({
          box: field.$el.prev().get(0),
          name: this.name + "_" + field.name + "_tb",
          items,
          onClick(event2) {
            self.rememberOriginal();
            const value = self.getFieldValue(field.name);
            if (value == null) return;
            value.current = event2.detail["item"].id;
            const edata2 = self.trigger("change", { target: field.name, field: field.name, value, originalEvent: event2 });
            if (edata2.isCancelled === true) {
              return;
            }
            self.record[field.name] = value.current;
            self.setFieldValue(field.name, value.current);
            edata2.finish();
          }
        });
        field.$el.prev().addClass("w2ui-form-switch");
        field.toolbar.resize();
        field.$el.off(".form-input").on("focus.form-input", (event2) => {
          const ind = field.toolbar.get(field.$el.val(), true);
          query8(event2.target).prop("_index", ind);
          query8(field.toolbar.box).addClass("w2ui-tb-focus");
        }).on("blur.form-input", (event2) => {
          query8(event2.target).removeProp("_index");
          query8(`#${field.name}-tb .w2ui-tb-button`).removeClass("over");
          query8(field.toolbar.box).removeClass("w2ui-tb-focus");
        }).on("keydown.form-input", (event2) => {
          let ind = query8(event2.target).prop("_index");
          switch (event2.key) {
            case "ArrowLeft": {
              if (ind > 0) ind--;
              query8(`#${field.name}-tb .w2ui-tb-button`).removeClass("over").eq(ind).addClass("over");
              query8(event2.target).prop("_index", ind);
              break;
            }
            case "ArrowRight": {
              if (ind < field.toolbar.items.length - 1) ind++;
              query8(`#${field.name}-tb .w2ui-tb-button`).removeClass("over").eq(ind).addClass("over");
              query8(event2.target).prop("_index", ind);
              break;
            }
          }
          if (event2.keyCode == 32 || event2.keyCode == 13) {
            self.rememberOriginal();
            const value = self.getFieldValue(field.name);
            if (value == null) return;
            const tbItem = field.toolbar.items[ind];
            value.current = tbItem?.id;
            const edata2 = self.trigger("change", { target: field.name, field: field.name, value, originalEvent: event2 });
            if (edata2.isCancelled === true) {
              return;
            }
            self.record[field.name] = value.current;
            self.setFieldValue(field.name, value.current);
            edata2.finish();
            query8(`#${field.name}-tb .w2ui-tb-button`).removeClass("over");
          }
          if (!event2.metaKey && !event2.ctrlKey && event2.keyCode != 9) {
            event2.preventDefault();
          }
        });
      }
      if (field.type == "select") {
        const items = field.options.items;
        let options = "";
        items.forEach((item) => {
          options += `<option value="${item.id}">${item.text}</option>`;
        });
        field.$el.html(options);
      }
      if (this.W2FIELD_TYPES.includes(field.type)) {
        field.w2field = field.w2field ?? new w2field(w2utils.extend({}, field.options, { type: field.type }));
        field.w2field.render(field.el);
      }
      if (["map", "array"].includes(field.type)) {
        (function(obj, field2) {
          field2.el.mapAdd = function(field3, div, cnt, empty) {
            const attr = (field3.disabled ? " readOnly " : "") + (field3.html.tabindex_str || "");
            let html = `<input type="text" ${(field3.html.value.attr ?? "") + attr} class="w2ui-input ${field3.html.class ?? ""} w2ui-map value">${field3.html.value.text || ""}`;
            if (typeof field3.html.render == "function") {
              html = field3.html.render.call(self, { empty: empty === true, ind: cnt, field: field3, div });
              if (!field3.el._errorDisplayed) {
                query.html(html).filter("input, textarea").each((node) => {
                  const inp = node;
                  const name = inp.dataset["name"] ?? inp["name"];
                  if (name == null || name == "") {
                    console.log(
                      `ERROR: All inputs of the field %c"${field3.name}"%c must have name attribute defined. No name for %c${inp.outerHTML}`,
                      "color: blue",
                      "",
                      "color: red"
                    );
                  }
                });
                field3.el._errorDisplayed = true;
              }
            } else if (field3.type == "map") {
              html = `<input type="text" ${(field3.html.key.attr ?? "") + attr} class="w2ui-input ${field3.html.class ?? ""} w2ui-map key">
                                ${field3.html.key.text || ""}
                            ` + html;
            }
            div.append(`<div class="w2ui-map-field" style="margin-bottom: 5px" data-index="${cnt}">${html}</div>`);
            if (typeof field3.html.render == "function") {
              const box = div.find(`[data-index="${cnt}"]`);
              box.find("input, textarea").each((el) => {
                if (query8(el).attr("tabindex") == null) {
                  query8(el).attr("tabindex", field3.html.tabindex);
                }
              });
              if (typeof field3.html.onRefresh == "function") {
                field3.html.onRefresh.call(self, { index: cnt, empty, box: box.get(0) });
              }
            }
          };
          field2.el.mapRefresh = function(map, div) {
            let keys = [], $k, $v;
            if (field2.type == "map") {
              if (!w2utils.isPlainObject(map)) map = {};
              if (map._order == null) map._order = Object.keys(map);
              keys = map._order;
            }
            if (field2.type == "array") {
              if (!Array.isArray(map)) map = [];
              keys = map.map((item, ind) => {
                return ind;
              });
            }
            div.find(".w2ui-map-field").remove();
            for (let ind = 0; ind < keys.length; ind++) {
              const key = keys[ind];
              let fld = div.find(`div[data-index='${ind}']`);
              if (fld.length == 0) {
                field2.el.mapAdd(field2, div, ind);
                fld = div.find(`div[data-index='${ind}']`);
              }
              fld.attr("data-key", key);
              if (typeof field2.html?.render == "function") {
                const val = map[key];
                fld.find("input, textarea").each((node) => {
                  const inp = node;
                  const name = inp.dataset["name"] ?? inp["name"];
                  if (inp.type == "checkbox") {
                    inp.checked = val[name] ?? false;
                  } else if (inp.type == "radio") {
                    inp.checked = val[name] ?? false;
                  } else {
                    inp.value = val[name] ?? "";
                  }
                });
              } else {
                $k = fld.find(".w2ui-map.key");
                $v = fld.find(".w2ui-map.value");
                let val = map[key];
                if (field2.type == "array") {
                  const tmp = map.filter((it) => {
                    return it?.key == key ? true : false;
                  });
                  if (tmp.length > 0) val = tmp[0].value;
                }
                $k.val(key);
                $v.val(val);
                if (field2.disabled === true || field2.disabled === false) {
                  $k.prop("readOnly", field2.disabled ? true : false);
                  $v.prop("readOnly", field2.disabled ? true : false);
                }
              }
              if (typeof field2.html.onRefresh == "function") {
                field2.html.onRefresh.call(self, { index: ind, box: div.find(`[data-index="${ind}"]`).get(0) });
              }
            }
            if (typeof field2.html.render == "function") {
              $v = div.find(".w2ui-map-field:last-child input:first-child");
            }
            const cnt = keys.length;
            const curr = div.find(`div[data-index='${cnt}']`);
            if (curr.length === 0 && (!$k || $k.val() != "" || $v.val() != "") && !($k && ($k.prop("readOnly") === true || $k.prop("disabled") === true))) {
              field2.el.mapAdd(field2, div, cnt, true);
            }
            if (field2.disabled === true || field2.disabled === false) {
              curr.find(".key").prop("readOnly", field2.disabled ? true : false);
              curr.find(".value").prop("readOnly", field2.disabled ? true : false);
            }
            let lastKey = null;
            const container = query8(field2.el).get(0)?.nextSibling;
            query8(container).off(".mapChange").on("mouseup.mapChange", { delegate: "input, textarea" }, function(event2) {
              if (document.activeElement != event2.target) {
                event2.target.focus();
              }
            }).on("keyup.mapChange", { delegate: "input, textarea" }, function(event2) {
              const kbdEvent = event2;
              const $div = query8(kbdEvent.target).closest(".w2ui-map-field");
              const next = $div.get(0).nextElementSibling;
              const prev = $div.get(0).previousElementSibling;
              const className = query8(kbdEvent.target).hasClass("key") ? "key" : "value";
              if (kbdEvent.keyCode == 38 && prev) {
                query8(prev).find(`input.${className}, textarea.${className}, input[name="${kbdEvent.target["name"]}"] textarea[name="${kbdEvent.target["name"]}"]`).get(0)?.select();
                kbdEvent.preventDefault();
              }
              if (kbdEvent.keyCode == 40 && next) {
                ;
                kbdEvent.target.blur();
                const next2 = $div.get(0).nextElementSibling;
                query8(next2).find(`input.${className}, textarea.${className}, input[name="${kbdEvent.target["name"]}"] textarea[name="${kbdEvent.target["name"]}"]`).get(0)?.select();
                kbdEvent.preventDefault();
              }
            }).on("keydown.mapChange", { delegate: "input, textarea" }, function(_event) {
              const event2 = _event;
              lastKey = null;
              if (event2.keyCode == 9) {
                lastKey = "tab";
              }
              if (event2.keyCode == 13) {
                lastKey = "enter";
              }
              if (event2.keyCode == 38 || event2.keyCode == 40) {
                lastKey = event2.keyCode == 38 ? "up" : "down";
                event2.preventDefault();
              }
            }).on("input.mapChange", { delegate: "input, textarea" }, function(event2) {
              const fld = query8(event2.target).closest("div.w2ui-map-field");
              const cnt2 = fld.data("index");
              const next = fld.get(0).nextElementSibling;
              let isEmpty = true;
              query8(fld).find("input, textarea").each((node) => {
                const el = node;
                if (!["checkbox", "button"].includes(el.type) && el.value != "") isEmpty = false;
              });
              let isNextEmpty = true;
              query8(next).find("input, textarea").each((node) => {
                const el = node;
                if (!["checkbox", "button"].includes(el.type) && el.value != "") isNextEmpty = false;
              });
              if (!isEmpty && !next) {
                field2.el.mapAdd(field2, div, parseInt(cnt2) + 1, true);
              } else if (isEmpty && next && isNextEmpty) {
                query8(next).remove();
              }
            }).on("change.mapChange", { delegate: "input, textarea" }, function(_event) {
              const event2 = _event;
              self.rememberOriginal();
              const _fieldValue = self.getFieldValue(field2.field);
              if (_fieldValue == null) return;
              let { current, previous, original } = _fieldValue;
              const $cnt = query8(event2.target).closest(".w2ui-map-container");
              if (typeof field2.html?.render == "function") {
                current = current.filter((kk) => {
                  const val = [...new Set(Object.values(kk).filter((vv) => typeof vv != "boolean"))];
                  return !(val.length == 0 || val.length == 1 && val[0] === "");
                });
              } else if (field2.type == "map") {
                current._order = [];
                $cnt.find(".w2ui-map.key").each((node) => {
                  current._order.push(node.value);
                });
                current._order = current._order.filter((k) => k !== "");
                delete current[""];
              } else if (field2.type == "array") {
                current = current.filter((k) => k !== "");
              }
              const edata2 = self.trigger("change", {
                target: field2.field,
                field: field2.field,
                originalEvent: event2,
                value: { current, previous, original }
              });
              if (edata2.isCancelled === true) {
                return;
              }
              let index;
              let className = "";
              const cnt2 = query8(event2.target).closest(".w2ui-map-container");
              if (field2.type == "array" || lastKey == "tab") {
                cnt2.find("input, textarea").each((node, ind) => {
                  if (node == event2.target) index = ind;
                });
              } else {
                className = query8(event2.target).hasClass("key") ? ".key" : ".value";
                cnt2.find("input" + className + ", textarea" + className).each((node, ind) => {
                  if (node == event2.target) index = ind;
                });
              }
              self.setValue(field2.field, current);
              let el;
              const safeIdx = index ?? 0;
              if (lastKey == "tab") {
                el = cnt2.find("input, textarea").get(safeIdx + 1);
              } else if (lastKey == "enter" && cnt2.find("input.value, textarea.value").length > 0) {
                if (className == ".key") {
                  el = cnt2.find("input.key, textarea.key").get(safeIdx + 1);
                } else {
                  el = cnt2.find("input.value, textarea.value").get(safeIdx + 1);
                }
                if (el == null) {
                  el = cnt2.find("input, textarea").get(safeIdx + (event2.shiftKey ? -1 : 1));
                }
              } else {
                el = cnt2.find("input" + className + ", textarea" + className).eq(safeIdx + (lastKey == "up" ? -1 : 1)).get(0);
              }
              if (el) {
                el.focus();
                el.select();
              }
              edata2.finish();
            });
          };
        })(this, field);
      }
      this.setFieldValue(field.field, this.getValue(field.name));
    }
    edata.finish();
    this.resize();
    return Date.now() - time;
  }
  render(box) {
    const time = Date.now();
    const self = this;
    if (typeof box == "string") box = query8(box).get(0);
    const edata = this.trigger("render", { target: this.name, box: box ?? this.box });
    if (edata.isCancelled === true) return;
    if (box != null) {
      this.unmount();
      this.box = box;
    }
    if (!this.isGenerated && !this.formHTML) return;
    if (!this.box) return;
    const html = '<div class="w2ui-form-box">' + (this.header !== "" ? '<div class="w2ui-form-header">' + w2utils.lang(this.header) + "</div>" : "") + '    <div id="form_' + this.name + '_toolbar" class="w2ui-form-toolbar" style="display: none"></div>    <div id="form_' + this.name + '_tabs" class="w2ui-form-tabs" style="display: none"></div>' + this.formHTML + "</div>";
    query8(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-form").html(html);
    if (query8(this.box).length > 0) query8(this.box).get(0).style.cssText += this.style;
    w2utils.bindEvents(query8(this.box).find(".w2ui-eaction"), this);
    if (typeof this.toolbar.render !== "function") {
      this.toolbar = new w2toolbar(w2utils.extend({}, this.toolbar, { name: this.name + "_toolbar", owner: this }));
      this.toolbar.on("click", function(event2) {
        const edata2 = self.trigger("toolbar", { target: event2.target, originalEvent: event2 });
        if (edata2.isCancelled === true) return;
        edata2.finish();
      });
    }
    if (typeof this.toolbar === "object" && typeof this.toolbar.render === "function") {
      this.toolbar.render(query8(this.box).find("#form_" + this.name + "_toolbar").get(0));
    }
    if (typeof this.tabs.render !== "function") {
      this.tabs = new w2tabs(w2utils.extend({}, this.tabs, { name: this.name + "_tabs", owner: this, active: this.tabs.active }));
      this.tabs.on("click", function(event2) {
        self.goto(this.get(event2.target, true));
      });
    }
    if (typeof this.tabs === "object" && typeof this.tabs.render === "function") {
      this.tabs.render(query8(this.box).find("#form_" + this.name + "_tabs").get(0));
      if (this.tabs.active) this.tabs.click(this.tabs.active);
    }
    edata.finish();
    this.resize();
    const url = typeof this.url !== "object" ? this.url : this.url.get;
    if (url && this.recid != null) {
      ;
      this.request().catch((_error) => this.refresh());
    } else {
      this.refresh();
    }
    this.last.observeResize = new ResizeObserver(() => {
      this.resize();
    });
    this.last.observeResize.observe(this.box);
    if (this.focus != -1) {
      let setCount = 0;
      const setFocus = () => {
        if (query8(self.box).find("input, select, textarea").length > 0) {
          self.setFocus();
        } else {
          setCount++;
          if (setCount < 20) setTimeout(setFocus, 50);
        }
      };
      setFocus();
    }
    return Date.now() - time;
  }
  unmount() {
    super.unmount();
    this.tabs?.unmount?.();
    this.toolbar?.unmount?.();
    this.last.observeResize?.disconnect();
  }
  destroy() {
    const edata = this.trigger("destroy", { target: this.name });
    if (edata.isCancelled === true) return;
    this.tabs?.destroy?.();
    this.toolbar?.destroy?.();
    if (query8(this.box).find("#form_" + this.name + "_tabs").length > 0) {
      this.unmount();
    }
    this.last.observeResize?.disconnect();
    delete w2ui[this.name];
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFocus(focus) {
    if (typeof focus === "undefined") {
      focus = this.focus;
    }
    let $input;
    if (w2utils.isInt(focus)) {
      if (focus < 0) {
        return;
      }
      const inputs = query8(this.box).find("div:not(.w2ui-field-helper) > input, select, textarea, div > label:nth-child(1) > [type=radio]").filter(":not(.file-input)");
      while (inputs.get(focus)?.offsetParent == null && inputs.length > focus) {
        focus++;
      }
      if (inputs.get(focus)) {
        $input = query8(inputs.get(focus));
      }
    } else if (typeof focus === "string") {
      $input = query8(this.box).find(`[name='${focus}']`);
    }
    if ($input?.length > 0) {
      $input.get(0).focus();
    }
    return $input;
  }
};

// src/w2grid.ts
var query9 = query;
var w2menu3 = w2menu;
var w2tooltip4 = w2tooltip;
var w2grid = class extends w2base {
  columns;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnGroups;
  // any: column group shapes — span/text/main/style; minimal typing for T5.2
  records;
  summary;
  searches;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolbar;
  // any: w2toolbar instance or config object
  ranges;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contextMenu;
  // any: context menu item shapes
  searchMap;
  searchData;
  sortMap;
  sortData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  savedSearches;
  // any: saved search objects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  defaultSearches;
  // any: default search objects
  groupBy;
  total;
  recid;
  hierarchyColumn;
  last;
  header;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  url;
  // any: url can be string or {get,save,remove,...} object; duck-typed with ?.get ?? url pattern
  limit;
  offset;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postData;
  // any: user-supplied post data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  routeData;
  // any: route params
  httpHeaders;
  show;
  stateId;
  hasFocus;
  autoLoad;
  fixedBody;
  recordHeight;
  lineNumberWidth;
  keyboard;
  selectType;
  liveSearch;
  multiSearch;
  multiSelect;
  multiSort;
  reorderColumns;
  reorderRows;
  showExtraOnSearch;
  markSearch;
  columnTooltip;
  disableCVS;
  nestedFields;
  vs_start;
  vs_extra;
  style;
  tabIndex;
  dataType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parser;
  // any: parser transforms arbitrary server response
  advanceOnEdit;
  useLocalStorage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  colTemplate;
  // any: column template default values
  stateColProps;
  msgDelete;
  msgNotJSON;
  msgHTTPError;
  msgServerError;
  msgRefresh;
  msgNeedReload;
  msgEmpty;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  buttons;
  // any: toolbar button definitions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  operators;
  // any: operator list items vary by type
  defaultOperator;
  operatorsMap;
  // event handlers
  onAdd;
  onEdit;
  onRequest;
  onLoad;
  onDelete;
  onSave;
  onSelect;
  onClick;
  onDblClick;
  onContextMenu;
  onContextMenuClick;
  onColumnClick;
  onColumnDblClick;
  onColumnContextMenu;
  onColumnResize;
  onColumnAutoResize;
  onSort;
  onSearch;
  onSearchOpen;
  onSearchClose;
  onChange;
  onRestore;
  onExpand;
  onCollapse;
  onError;
  onKeydown;
  onToolbar;
  onColumnOnOff;
  onCopy;
  onPaste;
  onSelectionExtend;
  onEditField;
  onRender;
  onRefresh;
  onReload;
  onResize;
  onDestroy;
  onStateSave;
  onStateRestore;
  onFocus;
  onBlur;
  onReorderRow;
  onSearchSave;
  onSearchRemove;
  onSearchSelect;
  onColumnSelect;
  onColumnDragStart;
  onColumnDragEnd;
  onResizerDblClick;
  onMouseEnter;
  onMouseLeave;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options) {
    super(options["name"]);
    this.name = "";
    this.box = null;
    this.columns = [];
    this.columnGroups = [];
    this.records = [];
    this.summary = [];
    this.searches = [];
    this.toolbar = {};
    this.ranges = [];
    this.contextMenu = [];
    this.searchMap = {};
    this.searchData = [];
    this.sortMap = {};
    this.sortData = [];
    this.savedSearches = [];
    this.defaultSearches = [];
    this.groupBy = null;
    this.total = 0;
    this.recid = null;
    this.hierarchyColumn = 0;
    this.last = {
      field: "",
      // last search field, e.g. 'all'
      label: "",
      // last search field label, e.g. 'All Fields'
      logic: "AND",
      // last search logic, e.g. 'AND' or 'OR'
      search: "",
      // last search text
      searchIds: [],
      // last search IDs
      selection: {
        // last selection details
        indexes: [],
        columns: {}
      },
      saved_sel: null,
      // last result of selectionSave()
      multi: false,
      // last multi flag, true when searching for multiple fields
      fetch: {
        action: "",
        // last fetch command, e.g. 'load'
        offset: null,
        // last fetch offset, integer
        start: 0,
        // timestamp of start of last fetch request
        response: 0,
        // time it took to complete the last fetch request in seconds
        options: null,
        controller: null,
        loaded: false,
        // data is loaded from the server
        hasMore: false
        // flag to indicate if there are more items to pull from the server
      },
      vscroll: {
        scrollTop: 0,
        // last scrollTop position
        scrollLeft: 0,
        // last scrollLeft position
        recIndStart: null,
        // record index for first record in DOM
        recIndEnd: null,
        // record index for last record in DOM
        colIndStart: 0,
        // for column virtual scrolling
        colIndEnd: 0,
        // for column virtual scrolling
        pull_more: false,
        pull_refresh: true,
        show_extra: 0
        // last show extra for virtual scrolling
      },
      sel_ind: null,
      // last selected cell index
      sel_col: null,
      // last selected column
      sel_type: null,
      // last selection type, e.g. 'click' or 'key'
      sel_recid: null,
      // last selected record id
      idCache: {},
      // object, id cache for get()
      move: null,
      // object, move details
      cancelClick: null,
      // boolean flag to indicate if the click event should be ignored, set during mouseMove()
      inEditMode: false,
      // flag to indicate if we're currently in edit mode during inline editing
      _edit: null,
      // object with details on the last edited cell, { value, index, column, recid }
      kbd_timer: null,
      // last id of blur() timer
      marker_timer: null,
      // last id of markSearch() timer
      click_time: null,
      // timestamp of last click
      click_recid: null,
      // last clicked record id
      bubbleEl: null,
      // last bubble element
      colResizing: false,
      // flag to indicate that a column is currently being resized
      tmp: null,
      // object with last column resizing details
      copy_event: null,
      // last copy event
      userSelect: "",
      // last user select type, e.g. 'text'
      columnDrag: false,
      // false or an object with a remove() method
      state: null,
      // last grid state
      toolbar_height: 0,
      // height of grid's toolbar
      groupBy_links: {}
      // map of group links used in conjuntction with groupBy
    };
    this.header = "";
    this.url = "";
    this.limit = 100;
    this.offset = 0;
    this.postData = {};
    this.routeData = {};
    this.httpHeaders = {};
    this.show = {
      header: false,
      toolbar: false,
      footer: false,
      columnMenu: true,
      columnHeaders: true,
      lineNumbers: false,
      expandColumn: false,
      selectColumn: false,
      emptyRecords: true,
      toolbarReload: true,
      toolbarColumns: false,
      toolbarSearch: true,
      toolbarAdd: false,
      toolbarEdit: false,
      toolbarDelete: false,
      toolbarSave: false,
      searchAll: true,
      searchLogic: true,
      searchHiddenMsg: false,
      searchSave: true,
      statusRange: true,
      statusBuffered: false,
      statusRecordID: true,
      statusSelection: true,
      statusResponse: true,
      statusSort: false,
      statusSearch: false,
      recordTitles: false,
      selectionBorder: true,
      selectionResizer: true,
      skipRecords: true,
      saveRestoreState: true
    };
    this.stateId = null;
    this.hasFocus = false;
    this.autoLoad = true;
    this.fixedBody = true;
    this.recordHeight = w2utils.settings?.["recordHeight"] ?? 32;
    this.lineNumberWidth = 34;
    this.keyboard = true;
    this.selectType = "row";
    this.liveSearch = false;
    this.multiSearch = true;
    this.multiSelect = true;
    this.multiSort = true;
    this.reorderColumns = false;
    this.reorderRows = false;
    this.showExtraOnSearch = 0;
    this.markSearch = true;
    this.columnTooltip = "top|bottom";
    this.disableCVS = false;
    this.nestedFields = true;
    this.vs_start = 150;
    this.vs_extra = 5;
    this.style = "";
    this.tabIndex = null;
    this.dataType = null;
    this.parser = null;
    this.advanceOnEdit = true;
    this.useLocalStorage = true;
    this.colTemplate = {
      text: "",
      // column text (can be a function)
      field: "",
      // field name to map the column to a record
      size: null,
      // size of column in px or %
      min: 20,
      // minimum width of column in px
      max: null,
      // maximum width of column in px
      gridMinWidth: null,
      // minimum width of the grid when column is visible
      sizeCorrected: null,
      // read only, corrected size (see explanation below)
      sizeCalculated: null,
      // read only, size in px (see explanation below)
      sizeOriginal: null,
      // size as defined
      sizeType: null,
      // px or %
      hidden: false,
      // indicates if column is hidden
      sortable: false,
      // indicates if column is sortable
      sortMode: null,
      // sort mode ('default'|'natural'|'i18n') or custom compare function
      searchable: false,
      // bool/string: int,float,date,... or an object to create search field
      resizable: true,
      // indicates if column is resizable
      hideable: true,
      // indicates if column can be hidden
      autoResize: null,
      // indicates if column can be auto-resized by double clicking on the resizer
      attr: "",
      // string that will be inside the <td ... attr> tag
      style: "",
      // additional style for the td tag
      render: null,
      // string or render function
      title: null,
      // string or function for the title property for the column cells
      tooltip: null,
      // string for the title property for the column header
      editable: {},
      // editable object (see explanation below)
      frozen: false,
      // indicates if the column is fixed to the left
      info: null,
      // info bubble, can be bool/object
      clipboardCopy: false
      // if true (or string or function), it will display clipboard copy icon
    };
    this.stateColProps = {
      text: false,
      field: true,
      size: true,
      min: false,
      max: false,
      gridMinWidth: false,
      sizeCorrected: false,
      sizeCalculated: true,
      sizeOriginal: true,
      sizeType: true,
      hidden: true,
      sortable: false,
      sortMode: true,
      searchable: false,
      resizable: false,
      hideable: false,
      autoResize: false,
      attr: false,
      style: false,
      render: false,
      title: false,
      tooltip: false,
      editable: false,
      frozen: true,
      info: false,
      clipboardCopy: false
    };
    this.msgDelete = "Are you sure you want to delete ${count} ${records}?";
    this.msgNotJSON = "Returned data is not in valid JSON format.";
    this.msgHTTPError = "HTTP error. See console for more details.";
    this.msgServerError = "Server error";
    this.msgRefresh = "Refreshing...";
    this.msgNeedReload = "Your remote data source record count has changed, reloading from the first record.";
    this.msgEmpty = "";
    this.buttons = {
      "reload": { type: "button", id: "w2ui-reload", icon: "w2ui-icon-reload", tooltip: w2utils.lang("Reload data in the list") },
      "columns": {
        type: "menu-check",
        id: "w2ui-column-on-off",
        icon: "w2ui-icon-columns",
        tooltip: w2utils.lang("Show/hide columns"),
        overlay: { align: "none" }
      },
      "search": {
        type: "html",
        id: "w2ui-search",
        html: '<div class="w2ui-icon w2ui-icon-search w2ui-search-down w2ui-action" data-click="searchShowFields"></div>'
      },
      "add": { type: "button", id: "w2ui-add", text: "Add New", tooltip: w2utils.lang("Add new record"), icon: "w2ui-icon-plus" },
      "edit": { type: "button", id: "w2ui-edit", text: "Edit", tooltip: w2utils.lang("Edit selected record"), icon: "w2ui-icon-pencil", batch: 1, disabled: true },
      "delete": { type: "button", id: "w2ui-delete", text: "Delete", tooltip: w2utils.lang("Delete selected records"), icon: "w2ui-icon-cross", batch: true, disabled: true },
      "save": { type: "button", id: "w2ui-save", text: "Save", tooltip: w2utils.lang("Save changed records"), icon: "w2ui-icon-check" }
    };
    this.operators = {
      // for search fields
      "text": ["is", "begins", "contains", "ends", "is not"],
      // could have "in" and "not in"
      "number": ["=", "between", ">", "<", ">=", "<=", "!="],
      "date": ["is", { oper: "less", text: "before" }, { oper: "more", text: "since" }, "between"],
      "list": ["is"],
      "hex": ["is", "between"],
      "color": ["is", "begins", "contains", "ends"],
      "enum": ["in", "not in"]
      // -- all possible
      // "text"    : ['is', 'begins', 'contains', 'ends'],
      // "number"  : ['is', 'between', 'less', 'more', 'null', 'not null'],
      // "list"    : ['is', 'null', 'not null'],
      // "enum"    : ['in', 'not in', 'null', 'not null']
    };
    this.defaultOperator = {
      "text": "begins",
      "number": "=",
      "date": "is",
      "list": "is",
      "enum": "in",
      "hex": "begins",
      "color": "begins"
    };
    this.operatorsMap = {
      "text": "text",
      "int": "number",
      "float": "number",
      "money": "number",
      "currency": "number",
      "percent": "number",
      "hex": "hex",
      "alphanumeric": "text",
      "color": "color",
      "date": "date",
      "time": "date",
      "datetime": "date",
      "list": "list",
      "combo": "text",
      "enum": "enum",
      "file": "enum",
      "select": "list",
      "radio": "list",
      "checkbox": "list",
      "toggle": "list"
    };
    this.onAdd = null;
    this.onEdit = null;
    this.onRequest = null;
    this.onLoad = null;
    this.onDelete = null;
    this.onSave = null;
    this.onSelect = null;
    this.onClick = null;
    this.onDblClick = null;
    this.onContextMenu = null;
    this.onContextMenuClick = null;
    this.onColumnClick = null;
    this.onColumnDblClick = null;
    this.onColumnContextMenu = null;
    this.onColumnResize = null;
    this.onColumnAutoResize = null;
    this.onSort = null;
    this.onSearch = null;
    this.onSearchOpen = null;
    this.onSearchClose = null;
    this.onChange = null;
    this.onRestore = null;
    this.onExpand = null;
    this.onCollapse = null;
    this.onError = null;
    this.onKeydown = null;
    this.onToolbar = null;
    this.onColumnOnOff = null;
    this.onCopy = null;
    this.onPaste = null;
    this.onSelectionExtend = null;
    this.onEditField = null;
    this.onRender = null;
    this.onRefresh = null;
    this.onReload = null;
    this.onResize = null;
    this.onDestroy = null;
    this.onStateSave = null;
    this.onStateRestore = null;
    this.onFocus = null;
    this.onBlur = null;
    this.onReorderRow = null;
    this.onSearchSave = null;
    this.onSearchRemove = null;
    this.onSearchSelect = null;
    this.onColumnSelect = null;
    this.onColumnDragStart = null;
    this.onColumnDragEnd = null;
    this.onResizerDblClick = null;
    this.onMouseEnter = null;
    this.onMouseLeave = null;
    w2utils.extend(this, options);
    if (Array.isArray(this.records)) {
      const remove = [];
      this.records.forEach((rec, ind) => {
        if (this.recid != null && rec[this.recid] != null) {
          rec.recid = rec[this.recid];
        }
        if (rec.recid == null) {
          console.log("ERROR: Cannot add records without recid. (obj: " + this.name + ")");
        }
        if (rec.w2ui?.summary === true) {
          this.summary.push(rec);
          remove.push(ind);
        }
      });
      remove.sort();
      for (let t = remove.length - 1; t >= 0; t--) {
        this.records.splice(remove[t], 1);
      }
      this.processGroupBy();
    }
    if (Array.isArray(this.columns)) {
      this.columns.forEach((col, ind) => {
        col = w2utils.extend({}, this.colTemplate, col);
        this.columns[ind] = col;
        const search = col.searchable;
        if (search == null || search === false || this.getSearch(col.field) != null) return;
        if (w2utils.isPlainObject(search)) {
          this.addSearch(w2utils.extend({ field: col.field, label: col.text, type: "text" }, search));
        } else {
          let stype = col.searchable;
          let attr = "";
          if (col.searchable === true) {
            stype = "text";
            attr = 'size="20"';
          }
          this.addSearch({ field: col.field, label: col.text, type: stype, attr });
        }
      });
    }
    if (Array.isArray(this.defaultSearches)) {
      this.defaultSearches.forEach((search, ind) => {
        search.id = "default-" + ind;
        search.icon ??= "w2ui-icon-search";
      });
    }
    const data = this.cache("searches");
    if (Array.isArray(data)) {
      data.forEach((search) => {
        this.savedSearches.push({
          id: search.id ?? "none",
          text: search.text ?? "none",
          icon: "w2ui-icon-search",
          remove: true,
          logic: search.logic ?? "AND",
          data: search.data ?? []
        });
      });
    }
    this.initToolbar();
    if (typeof this.box == "string") this.box = query9(this.box).get(0);
    if (this.box) this.render(this.box);
  }
  add(record, first) {
    if (!Array.isArray(record)) record = [record];
    let added = 0;
    for (let i = 0; i < record.length; i++) {
      const rec = record[i];
      if (this.recid != null && rec[this.recid] != null) {
        rec.recid = rec[this.recid];
      }
      if (rec.recid == null) {
        console.log("ERROR: Cannot add record without recid. (obj: " + this.name + ")");
        continue;
      }
      if (rec.w2ui?.summary === true) {
        if (first) this.summary.unshift(rec);
        else this.summary.push(rec);
      } else {
        if (first) this.records.unshift(rec);
        else this.records.push(rec);
      }
      added++;
    }
    this.processGroupBy();
    const url = this.url?.get ?? this.url;
    if (!url) {
      this.total = this.records.length;
      this.localSort(false, true);
      this.localSearch();
      const indStart = this.records.length - record.length;
      const indEnd = indStart + record.length;
      if ((this.last.vscroll.recIndStart ?? 0) <= indEnd && (this.last.vscroll.recIndEnd ?? 0) >= indStart) {
        this.refresh();
      } else {
        query9(this.box).find("#grid_" + this.name + "_footer .w2ui-footer-right .w2ui-total").html(w2utils.formatNumber(this.total));
      }
    } else {
      this.refresh();
    }
    return added;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  find(obj, returnIndex, displayedOnly) {
    if (obj == null) obj = {};
    const recs = [];
    let hasDots = false;
    for (const o in obj) if (String(o).indexOf(".") != -1) hasDots = true;
    const start = displayedOnly ? this.last.vscroll.recIndStart ?? 0 : 0;
    let end = displayedOnly ? (this.last.vscroll.recIndEnd ?? this.records.length) + 1 : this.records.length;
    if (end > this.records.length) end = this.records.length;
    for (let i = start; i < end; i++) {
      const rec_i = this.records[i];
      let match = true;
      for (const o in obj) {
        let val = rec_i[o];
        if (hasDots && String(o).indexOf(".") != -1) val = this.parseField(rec_i, o);
        if (obj[o] == "not-null") {
          if (val == null || val === "") match = false;
        } else {
          if (obj[o] != val) match = false;
        }
      }
      if (match && returnIndex !== true) recs.push(rec_i.recid);
      if (match && returnIndex === true) recs.push(i);
    }
    return recs;
  }
  // does not delete existing, but overrides on top of it
  // Overload: set(recid, record, noRefresh?) or set(record, noRefresh?) — shifts args when recid is object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(recid, record, noRefresh) {
    if (typeof recid == "object" && recid !== null) {
      noRefresh = record;
      record = recid;
      recid = null;
    }
    if (recid == null) {
      for (let i = 0; i < this.records.length; i++) {
        w2utils.extend(this.records[i], record);
      }
      if (noRefresh !== true) this.refresh();
    } else {
      const ind = this.get(recid, true);
      if (ind == null) return false;
      const isSummary = this.records[ind]?.recid == recid ? false : true;
      if (isSummary) {
        w2utils.extend(this.summary[ind], record);
      } else {
        w2utils.extend(this.records[ind], record);
      }
      if (noRefresh !== true) this.refreshRow(recid, ind);
    }
    this.processGroupBy();
    return true;
  }
  // replaces existing record
  replace(recid, record, noRefresh) {
    const ind = this.get(recid, true);
    if (ind == null) return false;
    const isSummary = this.records[ind]?.recid == recid ? false : true;
    if (isSummary) {
      this.summary[ind] = record;
    } else {
      this.records[ind] = record;
    }
    if (noRefresh !== true) this.refreshRow(recid, ind);
    this.processGroupBy();
    return true;
  }
  get(recid, returnIndex) {
    if (Array.isArray(recid)) {
      const recs = [];
      for (let i = 0; i < recid.length; i++) {
        const v = this.get(recid[i], returnIndex);
        if (v !== null)
          recs.push(v);
      }
      return recs;
    } else {
      let idCache = this.last.idCache;
      if (!idCache) {
        this.last.idCache = idCache = {};
      }
      let i = idCache[recid];
      if (typeof i === "number") {
        if (i >= 0 && i < this.records.length && this.records[i].recid == recid) {
          if (returnIndex === true) return i;
          else return this.records[i];
        }
        i = ~i;
        if (i >= 0 && i < this.summary.length && this.summary[i].recid == recid) {
          if (returnIndex === true) return i;
          else return this.summary[i];
        }
        this.last.idCache = idCache = {};
      }
      for (let i2 = 0; i2 < this.records.length; i2++) {
        if (this.records[i2].recid == recid) {
          idCache[recid] = i2;
          if (returnIndex === true) return i2;
          else return this.records[i2];
        }
      }
      for (let i2 = 0; i2 < this.summary.length; i2++) {
        if (this.summary[i2].recid == recid) {
          idCache[recid] = ~i2;
          if (returnIndex === true) return i2;
          else return this.summary[i2];
        }
      }
      return null;
    }
  }
  getFirst(offset) {
    if (this.records.length == 0) return null;
    let rec = this.records[0] ?? null;
    const tmp = this.last.searchIds;
    if (this.searchData.length > 0) {
      if (Array.isArray(tmp) && tmp.length > 0) {
        rec = this.records[tmp[offset || 0]] ?? null;
      } else {
        rec = null;
      }
    }
    return rec;
  }
  remove(...recids) {
    let removed = 0;
    for (let a = 0; a < recids.length; a++) {
      for (let r = this.records.length - 1; r >= 0; r--) {
        if (this.records[r].recid == recids[a]) {
          this.records.splice(r, 1);
          removed++;
        }
      }
      for (let r = this.summary.length - 1; r >= 0; r--) {
        if (this.summary[r].recid == recids[a]) {
          this.summary.splice(r, 1);
          removed++;
        }
      }
    }
    const url = this.url?.get ?? this.url;
    if (!url) {
      this.localSort(false, true);
      this.localSearch();
      this.total = this.records.length;
    }
    this.refresh();
    return removed;
  }
  /**
   * If there is a this.groupBy, then process all records with that in mind. It will remember groups in this.last.groupBy_links, that
   * needs to be cleared when record is cleared
   */
  processGroupBy() {
    if (this.groupBy == null) return;
    const groupBy = this.groupBy;
    const new_records = [];
    this.records.forEach((rec) => {
      const group = rec[groupBy.field];
      if (group != null) {
        if (this.last.groupBy_links[group] == null) {
          const gr = { recid: "group-" + group, group, w2ui: { ...groupBy, children: [] } };
          this.last.groupBy_links[group] = gr;
          delete gr.w2ui["field"];
          new_records.push(gr);
        }
        rec[groupBy.field] = "";
        this.last.groupBy_links[group].w2ui.children.push(rec);
      }
    });
    this.records = new_records;
    if (this.total !== -1) {
      this.total = this.records.length;
    }
  }
  /** Add one or more columns. If `columns` is omitted, `before` is treated as the column(s) to append. */
  // any: `before` is reassigned inside the body (number | string → number); TS can't narrow post-assignment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addColumn(before, columns) {
    let added = 0;
    if (columns === void 0) {
      columns = before;
      before = this.columns.length;
    } else {
      if (typeof before == "string") before = this.getColumn(before, true);
      if (before == null) before = this.columns.length;
    }
    if (!Array.isArray(columns)) columns = [columns];
    for (let i = 0; i < columns.length; i++) {
      const col = w2utils.extend({}, this.colTemplate, columns[i]);
      this.columns.splice(before, 0, col);
      if (columns[i].searchable) {
        let stype = columns[i].searchable;
        let attr = "";
        if (columns[i].searchable === true) {
          stype = "text";
          attr = 'size="20"';
        }
        this.addSearch({ field: columns[i].field, label: columns[i].text, type: stype, attr });
      }
      before++;
      added++;
    }
    this.refresh();
    return added;
  }
  removeColumn(...fields) {
    let removed = 0;
    for (let a = 0; a < fields.length; a++) {
      const field_a = fields[a];
      for (let r = this.columns.length - 1; r >= 0; r--) {
        if (this.columns[r].field == field_a) {
          if (this.columns[r].searchable) this.removeSearch(field_a);
          this.columns.splice(r, 1);
          removed++;
        }
      }
    }
    this.refresh();
    return removed;
  }
  getColumn(field, returnIndex) {
    if (field === void 0) {
      const ret = [];
      for (let i = 0; i < this.columns.length; i++) ret.push(this.columns[i].field);
      return ret;
    }
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].field == field) {
        if (returnIndex === true) return i;
        else return this.columns[i];
      }
    }
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateColumn(fields, updates) {
    let effected = 0;
    fields = Array.isArray(fields) ? fields : [fields];
    fields.forEach((colName) => {
      this.columns.forEach((col) => {
        if (col.field == colName) {
          const _updates = w2utils.clone(updates);
          Object.keys(_updates).forEach((key) => {
            if (typeof _updates[key] == "function") {
              _updates[key] = _updates[key](col);
            }
            if (col[key] != _updates[key]) effected++;
          });
          w2utils.extend(col, _updates);
        }
      });
    });
    if (effected > 0) {
      this.refresh();
    }
    return effected;
  }
  toggleColumn(...fields) {
    return this.updateColumn(fields, { hidden(col) {
      return !col.hidden;
    } });
  }
  showColumn(...fields) {
    return this.updateColumn(fields, { hidden: false });
  }
  hideColumn(...fields) {
    return this.updateColumn(fields, { hidden: true });
  }
  /** Add one or more search fields. If `search` is omitted, `before` is treated as the search(es) to append. */
  // any: `before` is reassigned inside the body (number | string → number); TS can't narrow post-assignment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addSearch(before, search) {
    let added = 0;
    if (search === void 0) {
      search = before;
      before = this.searches.length;
    } else {
      if (typeof before == "string") before = this.getSearch(before, true);
      if (before == null) before = this.searches.length;
    }
    if (!Array.isArray(search)) search = [search];
    for (let i = 0; i < search.length; i++) {
      this.searches.splice(before, 0, search[i]);
      before++;
      added++;
    }
    this.searchClose();
    return added;
  }
  removeSearch(...fields) {
    let removed = 0;
    for (let a = 0; a < fields.length; a++) {
      const field_a = fields[a];
      for (let r = this.searches.length - 1; r >= 0; r--) {
        if (this.searches[r].field == field_a) {
          this.searches.splice(r, 1);
          removed++;
        }
      }
    }
    this.searchClose();
    return removed;
  }
  getSearch(field, returnIndex) {
    if (field === void 0) {
      const ret = [];
      for (let i = 0; i < this.searches.length; i++) ret.push(this.searches[i].field);
      return ret;
    }
    for (let i = 0; i < this.searches.length; i++) {
      if (this.searches[i].field == field) {
        if (returnIndex === true) return i;
        else return this.searches[i];
      }
    }
    return null;
  }
  toggleSearch(...fields) {
    let effected = 0;
    for (let a = 0; a < fields.length; a++) {
      const field_a = fields[a];
      for (let r = this.searches.length - 1; r >= 0; r--) {
        if (this.searches[r].field == field_a) {
          this.searches[r].hidden = !this.searches[r].hidden;
          effected++;
        }
      }
    }
    this.searchClose();
    return effected;
  }
  showSearch(...fields) {
    let shown = 0;
    for (let a = 0; a < fields.length; a++) {
      const field_a = fields[a];
      for (let r = this.searches.length - 1; r >= 0; r--) {
        if (this.searches[r].field == field_a && this.searches[r].hidden !== false) {
          this.searches[r].hidden = false;
          shown++;
        }
      }
    }
    this.searchClose();
    return shown;
  }
  hideSearch(...fields) {
    let hidden = 0;
    for (let a = 0; a < fields.length; a++) {
      const field_a = fields[a];
      for (let r = this.searches.length - 1; r >= 0; r--) {
        if (this.searches[r].field == field_a && this.searches[r].hidden !== true) {
          this.searches[r].hidden = true;
          hidden++;
        }
      }
    }
    this.searchClose();
    return hidden;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSearchData(field) {
    for (let i = 0; i < this.searchData.length; i++) {
      if (this.searchData[i].field == field) return this.searchData[i];
    }
    return null;
  }
  localSort(silent, noResetRefresh) {
    const obj = this;
    const url = this.url?.get ?? this.url;
    if (url) {
      console.log("ERROR: grid.localSort can only be used on local data source, grid.url should be empty.");
      return 0;
    }
    if (Object.keys(this.sortData).length === 0) {
      const os = this.last.originalSort;
      if (os) {
        this.records.sort((a, b) => {
          const aInd = os.indexOf(a.recid);
          const bInd = os.indexOf(b.recid);
          return aInd > bInd ? 1 : -1;
        });
      }
      return 0;
    }
    let time = Date.now();
    this.selectionSave();
    this.prepareData();
    if (!noResetRefresh) {
      this.reset();
    }
    for (let i = 0; i < this.sortData.length; i++) {
      const sortItem = this.sortData[i];
      const column = this.getColumn(sortItem.field);
      if (!column) return;
      if (typeof column.render == "string") {
        const renderType = column.render.split(":")[0] ?? "";
        if (["date", "age"].indexOf(renderType) != -1) {
          sortItem.field_ = column.field + "_";
        }
        if (["time"].indexOf(renderType) != -1) {
          sortItem.field_ = column.field + "_";
        }
      }
    }
    preparePaths();
    this.records.sort((a, b) => {
      return compareRecordPaths(a, b);
    });
    cleanupPaths();
    this.selectionRestore(noResetRefresh);
    time = Date.now() - time;
    if (silent !== true && this.show.statusSort) {
      setTimeout(() => {
        this.status(w2utils.lang("Sorting took ${count} seconds", { count: time / 1e3 }));
      }, 10);
    }
    return time;
    function preparePaths() {
      for (let i = 0; i < obj.records.length; i++) {
        const rec = obj.records[i];
        if (rec.w2ui?.parent_recid != null) {
          rec.w2ui["_path"] = getRecordPath(rec);
        }
      }
    }
    function cleanupPaths() {
      for (let i = 0; i < obj.records.length; i++) {
        const rec = obj.records[i];
        if (rec.w2ui?.parent_recid != null) {
          rec.w2ui["_path"] = null;
        }
      }
    }
    function compareRecordPaths(a, b) {
      if ((!a.w2ui || a.w2ui.parent_recid == null) && (!b.w2ui || b.w2ui.parent_recid == null)) {
        return compareRecords(a, b);
      }
      const pa = getRecordPath(a);
      const pb = getRecordPath(b);
      for (let i = 0; i < Math.min(pa.length, pb.length); i++) {
        const diff = compareRecords(pa[i], pb[i]);
        if (diff !== 0) return diff;
      }
      if (pa.length > pb.length) return 1;
      if (pa.length < pb.length) return -1;
      console.log("ERROR: two paths should not be equal.");
      return 0;
    }
    function getRecordPath(rec) {
      if (!rec.w2ui || rec.w2ui.parent_recid == null) return [rec];
      if (rec.w2ui["_path"])
        return rec.w2ui["_path"];
      const subrec = obj.get(rec.w2ui.parent_recid);
      if (!subrec) {
        console.log("ERROR: no parent record: " + rec.w2ui.parent_recid);
        return [rec];
      }
      return getRecordPath(subrec).concat(rec);
    }
    function compareRecords(a, b) {
      if (a === b) return 0;
      for (let i = 0; i < obj.sortData.length; i++) {
        const sortItem = obj.sortData[i];
        const fld = sortItem.field;
        const sortFld = sortItem.field_ ? sortItem.field_ : fld;
        let aa = a[sortFld];
        let bb = b[sortFld];
        if (String(fld).indexOf(".") != -1) {
          aa = obj.parseField(a, sortFld);
          bb = obj.parseField(b, sortFld);
        }
        const col = obj.getColumn(fld);
        if (col && col["editable"] && Object.keys(col["editable"]).length > 0) {
          if (w2utils.isPlainObject(aa) && aa.text) aa = aa.text;
          if (w2utils.isPlainObject(bb) && bb.text) bb = bb.text;
        }
        const ret2 = compareCells(aa, bb, i, sortItem.direction, col?.sortMode || "default");
        if (ret2 !== 0) return ret2;
      }
      const ret = compareCells(a.recid, b.recid, -1, "asc");
      return ret;
    }
    function compareCells(aa, bb, i, direction, sortMode) {
      if (aa === bb)
        return 0;
      const dir = direction.toLowerCase() === "asc" ? 1 : -1;
      if (typeof sortMode == "function") {
        return sortMode(aa, bb) * dir;
      }
      if ((aa == null || aa === "") && (bb != null && bb !== ""))
        return 1;
      if (aa != null && aa !== "" && (bb == null || bb === ""))
        return -1;
      if (typeof aa != typeof bb)
        return typeof aa > typeof bb ? dir : -dir;
      if (aa.constructor.name != bb.constructor.name)
        return aa.constructor.name > bb.constructor.name ? dir : -dir;
      if (aa && typeof aa == "object")
        aa = aa.valueOf();
      if (bb && typeof bb == "object")
        bb = bb.valueOf();
      const defaultToString = {}.toString;
      if (aa && typeof aa == "object" && aa.toString != defaultToString)
        aa = String(aa);
      if (bb && typeof bb == "object" && bb.toString != defaultToString)
        bb = String(bb);
      if (typeof aa == "string")
        aa = aa.toLowerCase().trim();
      if (typeof bb == "string")
        bb = bb.toLowerCase().trim();
      switch (sortMode) {
        case "natural":
          sortMode = w2utils.naturalCompare;
          break;
        case "i18n":
          sortMode = w2utils.i18nCompare;
          break;
      }
      if (typeof sortMode == "function") {
        return sortMode(aa, bb) * dir;
      }
      if (aa > bb)
        return dir;
      if (aa < bb)
        return -dir;
      return 0;
    }
  }
  localSearch(silent) {
    const obj = this;
    const url = this.url?.get ?? this.url;
    if (url) {
      console.log("ERROR: grid.localSearch can only be used on local data source, grid.url should be empty.");
      return;
    }
    let time = Date.now();
    const defaultToString = {}.toString;
    const duplicateMap = {};
    this.total = this.records.length;
    this.last.searchIds = [];
    this.prepareData();
    if (this.searchData.length > 0 && !url) {
      this.total = 0;
      for (let i = 0; i < this.records.length; i++) {
        const rec = this.records[i];
        const match = searchRecord(rec);
        if (match) {
          if (rec?.w2ui) addParent(rec.w2ui.parent_recid ?? null);
          if (this.showExtraOnSearch > 0) {
            let before = this.showExtraOnSearch;
            let after = this.showExtraOnSearch;
            if (i < before) before = i;
            if (i + after > this.records.length) after = this.records.length - i;
            if (before > 0) {
              for (let j = i - before; j < i; j++) {
                if (this.last.searchIds.indexOf(j) < 0)
                  this.last.searchIds.push(j);
              }
            }
            if (this.last.searchIds.indexOf(i) < 0) this.last.searchIds.push(i);
            if (after > 0) {
              for (let j = i + 1; j <= i + after; j++) {
                if (this.last.searchIds.indexOf(j) < 0) this.last.searchIds.push(j);
              }
            }
          } else {
            this.last.searchIds.push(i);
          }
        }
      }
      this.total = this.last.searchIds.length;
    }
    time = Date.now() - time;
    if (silent !== true && this.show.statusSearch) {
      setTimeout(() => {
        this.status(w2utils.lang("Search took ${count} seconds", { count: time / 1e3 }));
      }, 10);
    }
    return time;
    function searchRecord(rec) {
      let fl = 0, val1, val2, val3, tmp;
      let orEqual = false;
      for (let j = 0; j < obj.searchData.length; j++) {
        const sdata = obj.searchData[j];
        if (sdata == null) continue;
        let search = obj.getSearch(sdata.field);
        if (search == null) search = { field: sdata.field, type: sdata.type };
        const val1b = rec.w2ui?.["changes"]?.[search.field] ?? obj.parseField(rec, search.field);
        val1 = val1b != null && (typeof val1b != "object" || val1b.toString != defaultToString) ? String(val1b).toLowerCase() : "";
        if (sdata["value"] != null) {
          if (!Array.isArray(sdata["value"])) {
            val2 = String(sdata["value"]).toLowerCase();
          } else {
            val2 = sdata["value"][0];
            val3 = sdata["value"][1];
          }
        }
        switch (sdata["operator"]) {
          case "=":
          case "is":
            if (val1b == sdata["value"] || String(val1b) == sdata["value"]) fl++;
            else if (search.type == "date") {
              tmp = obj.parseField(rec, search.field + "_") instanceof Date ? obj.parseField(rec, search.field + "_") : obj.parseField(rec, search.field);
              val1 = w2utils.formatDate(tmp, "yyyy-mm-dd");
              val2 = w2utils.formatDate(w2utils.isDate(val2, w2utils.settings.dateFormat, true), "yyyy-mm-dd");
              if (val1 == val2) fl++;
            } else if (search.type == "time") {
              tmp = obj.parseField(rec, search.field + "_") instanceof Date ? obj.parseField(rec, search.field + "_") : obj.parseField(rec, search.field);
              val1 = w2utils.formatTime(tmp, "hh24:mi");
              val2 = w2utils.formatTime(val2, "hh24:mi");
              if (val1 == val2) fl++;
            } else if (search.type == "datetime") {
              tmp = obj.parseField(rec, search.field + "_") instanceof Date ? obj.parseField(rec, search.field + "_") : obj.parseField(rec, search.field);
              val1 = w2utils.formatDateTime(tmp, "yyyy-mm-dd|hh24:mm:ss");
              val2 = w2utils.formatDateTime(w2utils.isDateTime(val2, w2utils.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss");
              if (val1 == val2) fl++;
            }
            break;
          case "is not":
          case "!=":
            if (val1b != sdata["value"] && String(val1b) != sdata["value"]) fl++;
            break;
          case "between":
            if (["int", "float", "money", "currency", "percent"].indexOf(search.type) != -1) {
              if (parseFloat(obj.parseField(rec, search.field)) >= parseFloat(val2) && parseFloat(obj.parseField(rec, search.field)) <= parseFloat(val3)) fl++;
            } else if (search.type == "date") {
              tmp = obj.parseField(rec, search.field + "_") instanceof Date ? obj.parseField(rec, search.field + "_") : obj.parseField(rec, search.field);
              val1 = w2utils.isDate(tmp, w2utils.settings.dateFormat, true);
              val2 = w2utils.isDate(val2, w2utils.settings.dateFormat, true);
              val3 = w2utils.isDate(val3, w2utils.settings.dateFormat, true);
              if (val3 instanceof Date) val3 = new Date(val3.getTime() + 864e5);
              if (val1 >= val2 && val1 < val3) fl++;
            } else if (search.type == "time") {
              val1 = obj.parseField(rec, search.field + "_") instanceof Date ? obj.parseField(rec, search.field + "_") : obj.parseField(rec, search.field);
              val2 = w2utils.isTime(val2, true);
              val3 = w2utils.isTime(val3, true);
              const t2 = val2;
              const t3 = val3;
              val2 = (/* @__PURE__ */ new Date()).setHours(t2.hours, t2.minutes, t2.seconds ? t2.seconds : 0, 0);
              val3 = (/* @__PURE__ */ new Date()).setHours(t3.hours, t3.minutes, t3.seconds ? t3.seconds : 0, 0);
              if (val1 >= val2 && val1 < val3) fl++;
            } else if (search.type == "datetime") {
              val1 = obj.parseField(rec, search.field + "_") instanceof Date ? obj.parseField(rec, search.field + "_") : obj.parseField(rec, search.field);
              val2 = w2utils.isDateTime(val2, w2utils.settings.datetimeFormat, true);
              val3 = w2utils.isDateTime(val3, w2utils.settings.datetimeFormat, true);
              if (val3 instanceof Date) val3 = new Date(val3.getTime() + 864e5);
              if (val1 >= val2 && val1 < val3) fl++;
            }
            break;
          case "<=":
            orEqual = true;
          case "<":
          case "less":
            if (["int", "float", "money", "currency", "percent"].indexOf(search.type) != -1) {
              val1 = parseFloat(obj.parseField(rec, search.field));
              val2 = parseFloat(sdata["value"]);
              if (val1 < val2 || orEqual && val1 === val2) fl++;
            } else if (search.type == "date") {
              tmp = obj.parseField(rec, search.field + "_") instanceof Date ? obj.parseField(rec, search.field + "_") : obj.parseField(rec, search.field);
              val1 = w2utils.isDate(tmp, w2utils.settings.dateFormat, true);
              val2 = w2utils.isDate(val2, w2utils.settings.dateFormat, true);
              if (val1 < val2 || orEqual && val1 === val2) fl++;
            } else if (search.type == "time") {
              tmp = obj.parseField(rec, search.field + "_") instanceof Date ? obj.parseField(rec, search.field + "_") : obj.parseField(rec, search.field);
              val1 = w2utils.formatTime(tmp, "hh24:mi");
              val2 = w2utils.formatTime(val2, "hh24:mi");
              if (val1 < val2 || orEqual && val1 === val2) fl++;
            } else if (search.type == "datetime") {
              tmp = obj.parseField(rec, search.field + "_") instanceof Date ? obj.parseField(rec, search.field + "_") : obj.parseField(rec, search.field);
              val1 = w2utils.formatDateTime(tmp, "yyyy-mm-dd|hh24:mm:ss");
              val2 = w2utils.formatDateTime(w2utils.isDateTime(val2, w2utils.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss");
              if (val1.length == val2.length && (val1 < val2 || orEqual && val1 === val2)) fl++;
            }
            break;
          case ">=":
            orEqual = true;
          case ">":
          case "more":
            if (["int", "float", "money", "currency", "percent"].indexOf(search.type) != -1) {
              val1 = parseFloat(obj.parseField(rec, search.field));
              val2 = parseFloat(sdata["value"]);
              if (val1 > val2 || orEqual && val1 === val2) fl++;
            } else if (search.type == "date") {
              tmp = obj.parseField(rec, search.field + "_") instanceof Date ? obj.parseField(rec, search.field + "_") : obj.parseField(rec, search.field);
              val1 = w2utils.isDate(tmp, w2utils.settings.dateFormat, true);
              val2 = w2utils.isDate(val2, w2utils.settings.dateFormat, true);
              if (val1 > val2 || orEqual && val1 === val2) fl++;
            } else if (search.type == "time") {
              tmp = obj.parseField(rec, search.field + "_") instanceof Date ? obj.parseField(rec, search.field + "_") : obj.parseField(rec, search.field);
              val1 = w2utils.formatTime(tmp, "hh24:mi");
              val2 = w2utils.formatTime(val2, "hh24:mi");
              if (val1 > val2 || orEqual && val1 === val2) fl++;
            } else if (search.type == "datetime") {
              tmp = obj.parseField(rec, search.field + "_") instanceof Date ? obj.parseField(rec, search.field + "_") : obj.parseField(rec, search.field);
              val1 = w2utils.formatDateTime(tmp, "yyyy-mm-dd|hh24:mm:ss");
              val2 = w2utils.formatDateTime(w2utils.isDateTime(val2, w2utils.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss");
              if (val1.length == val2.length && (val1 > val2 || orEqual && val1 === val2)) fl++;
            }
            break;
          case "in":
            tmp = sdata["value"];
            if (sdata["svalue"]) tmp = sdata["svalue"];
            if (tmp.indexOf(w2utils.isFloat(val1b) ? parseFloat(val1b) : val1b) !== -1 || tmp.indexOf(val1) !== -1 && val1 !== "") fl++;
            break;
          case "not in":
            tmp = sdata["value"];
            if (sdata["svalue"]) tmp = sdata["svalue"];
            if (!(tmp.indexOf(w2utils.isFloat(val1b) ? parseFloat(val1b) : val1b) !== -1 || tmp.indexOf(val1) !== -1 && val1 !== "")) fl++;
            break;
          case "begins":
          case "begins with":
            if (val1.indexOf(val2) === 0) fl++;
            break;
          case "contains":
            if (val1.indexOf(val2) >= 0) fl++;
            break;
          case "null":
            if (obj.parseField(rec, search.field) == null) fl++;
            break;
          case "not null":
            if (obj.parseField(rec, search.field) != null) fl++;
            break;
          case "ends":
          case "ends with":
            const lastIndex = val1.lastIndexOf(val2);
            if (lastIndex !== -1 && lastIndex == val1.length - val2.length) fl++;
            break;
        }
      }
      if (obj.last.logic == "OR" && fl !== 0 || obj.last.logic == "AND" && fl == obj.searchData.length) {
        return true;
      }
      if (rec.w2ui?.children && rec.w2ui?.expanded !== true) {
        for (let r = 0; r < rec.w2ui.children.length; r++) {
          const subRec = rec.w2ui.children[r];
          if (searchRecord(subRec)) {
            return true;
          }
        }
      }
      return false;
    }
    function addParent(recid) {
      if (recid == null) return;
      const i = obj.get(recid, true);
      if (i == null || duplicateMap[recid] || obj.last.searchIds.includes(i)) {
        return;
      }
      duplicateMap[recid] = true;
      const rec = obj.records[i];
      if (rec?.w2ui) {
        addParent(rec.w2ui.parent_recid ?? null);
      }
      obj.last.searchIds.push(i);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRangeData(range, extra) {
    const rec1 = this.get(range[0].recid, true) ?? 0;
    const rec2 = this.get(range[1].recid, true) ?? 0;
    const col1 = range[0].column;
    const col2 = range[1].column;
    const res = [];
    if (col1 == col2) {
      for (let r = Math.min(rec1, rec2); r <= Math.max(rec1, rec2); r++) {
        const record = this.records[r];
        const dt = record[this.columns[col1].field] || null;
        if (extra !== true) {
          res.push(dt);
        } else {
          res.push({ data: dt, column: col1, index: r, record });
        }
      }
    } else if (rec1 == rec2) {
      const record = this.records[rec1];
      for (let i = Math.min(col1, col2); i <= Math.max(col1, col2); i++) {
        const dt = record[this.columns[i].field] || null;
        if (extra !== true) {
          res.push(dt);
        } else {
          res.push({ data: dt, column: i, index: rec1, record });
        }
      }
    } else {
      for (let r = Math.min(rec1, rec2); r <= Math.max(rec1, rec2); r++) {
        const record = this.records[r];
        const rowData = [];
        res.push(rowData);
        for (let i = Math.min(col1, col2); i <= Math.max(col1, col2); i++) {
          const dt = record[this.columns[i].field];
          if (extra !== true) {
            rowData.push(dt);
          } else {
            rowData.push({ data: dt, column: i, index: r, record });
          }
        }
      }
    }
    return res;
  }
  // any: addRange accepts string 'selection' shorthand, single range object, or array of ranges
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addRange(rangesInput) {
    let added = 0, first, last;
    if (this.selectType == "row") return added;
    const ranges = !Array.isArray(rangesInput) ? [rangesInput] : rangesInput;
    for (let i = 0; i < ranges.length; i++) {
      if (typeof ranges[i] != "object") ranges[i] = { name: "selection" };
      if (ranges[i].name == "selection") {
        if (this.show.selectionBorder === false) continue;
        const sel = this.getSelection();
        if (sel.length === 0) {
          this.removeRange("selection");
          continue;
        } else {
          first = sel[0];
          last = sel[sel.length - 1];
        }
      } else {
        first = ranges[i].range[0];
        last = ranges[i].range[1];
      }
      if (first) {
        const rg = {
          name: ranges[i].name,
          range: [{ recid: first.recid, column: first.column }, { recid: last.recid, column: last.column }],
          style: ranges[i].style || "",
          class: ranges[i].class
        };
        let ind = false;
        for (let j = 0; j < this.ranges.length; j++) if (this.ranges[j].name == ranges[i].name) {
          ind = j;
          break;
        }
        if (ind !== false) {
          this.ranges[ind] = rg;
        } else {
          this.ranges.push(rg);
        }
        added++;
      }
    }
    this.refreshRanges();
    return added;
  }
  removeRange(...names) {
    let removed = 0;
    for (let a = 0; a < names.length; a++) {
      const name = names[a];
      query9(this.box).find("#grid_" + this.name + "_" + name).remove();
      query9(this.box).find("#grid_" + this.name + "_f" + name).remove();
      for (let r = this.ranges.length - 1; r >= 0; r--) {
        if (this.ranges[r].name == name) {
          this.ranges.splice(r, 1);
          removed++;
        }
      }
    }
    return removed;
  }
  refreshRanges() {
    if (this.ranges.length === 0) return;
    const self = this;
    let range;
    const time = Date.now();
    const rec1 = query9(this.box).find(`#grid_${this.name}_frecords`);
    const rec2 = query9(this.box).find(`#grid_${this.name}_records`);
    for (let i = 0; i < this.ranges.length; i++) {
      const rg = this.ranges[i];
      let first = rg.range[0];
      let last = rg.range[1];
      if (first.index == null) {
        const fi = this.get(first.recid, true);
        if (fi != null) first.index = fi;
      }
      if (last.index == null) {
        const li = this.get(last.recid, true);
        if (li != null) last.index = li;
      }
      if (first.index != null && last.index != null && first.index > last.index) {
        const tmp3 = first;
        first = last;
        last = tmp3;
      }
      let td1 = query9(this.box).find("#grid_" + this.name + "_rec_" + w2utils.escapeId(first.recid) + ' td[col="' + first.column + '"]');
      let td2 = query9(this.box).find("#grid_" + this.name + "_rec_" + w2utils.escapeId(last.recid) + ' td[col="' + last.column + '"]');
      let td1f = query9(this.box).find("#grid_" + this.name + "_frec_" + w2utils.escapeId(first.recid) + ' td[col="' + first.column + '"]');
      let td2f = query9(this.box).find("#grid_" + this.name + "_frec_" + w2utils.escapeId(last.recid) + ' td[col="' + last.column + '"]');
      let _lastColumn = last.column;
      if (first.column < this.last.vscroll.colIndStart && last.column > this.last.vscroll.colIndStart) {
        td1 = query9(this.box).find("#grid_" + this.name + "_rec_" + w2utils.escapeId(first.recid) + ' td[col="start"]');
      }
      if (first.column < this.last.vscroll.colIndEnd && last.column > this.last.vscroll.colIndEnd) {
        td2 = query9(this.box).find("#grid_" + this.name + "_rec_" + w2utils.escapeId(last.recid) + ' td[col="end"]');
        _lastColumn = "end";
      }
      const index_top = parseInt(query9(this.box).find("#grid_" + this.name + "_rec_top").next().attr("index"));
      const index_bottom = parseInt(query9(this.box).find("#grid_" + this.name + "_rec_bottom").prev().attr("index"));
      const index_ftop = parseInt(query9(this.box).find("#grid_" + this.name + "_frec_top").next().attr("index"));
      const index_fbottom = parseInt(query9(this.box).find("#grid_" + this.name + "_frec_bottom").prev().attr("index"));
      if (td1.length === 0 && first.index < index_top && last.index > index_top) {
        td1 = query9(this.box).find("#grid_" + this.name + "_rec_top").next().find('td[col="' + first.column + '"]');
      }
      if (td2.length === 0 && last.index > index_bottom && first.index < index_bottom) {
        td2 = query9(this.box).find("#grid_" + this.name + "_rec_bottom").prev().find('td[col="' + _lastColumn + '"]');
      }
      if (td1f.length === 0 && first.index < index_ftop && last.index > index_ftop) {
        td1f = query9(this.box).find("#grid_" + this.name + "_frec_top").next().find('td[col="' + first.column + '"]');
      }
      if (td2f.length === 0 && last.index > index_fbottom && first.index < index_fbottom) {
        td2f = query9(this.box).find("#grid_" + this.name + "_frec_bottom").prev().find('td[col="' + last.column + '"]');
      }
      const edit = query9(this.box).find("#grid_" + this.name + "_editable");
      const tmp = edit.find(".w2ui-input");
      const tmp_ind = tmp.attr("index");
      const tmp1 = this.records[tmp_ind]?.recid;
      const tmp2 = tmp.attr("column");
      if (rg.name == "selection" && rg.range[0].recid == tmp1 && rg.range[0].column == tmp2) continue;
      range = query9(this.box).find("#grid_" + this.name + "_f" + rg.name);
      if (td1f.length > 0 || td2f.length > 0) {
        if (range.length === 0) {
          rec1.append('<div id="grid_' + this.name + "_f" + rg.name + '" class="w2ui-selection" style="' + rg.style + '">' + (rg.name == "selection" && this.show.selectionResizer ? '<div id="grid_' + this.name + '_resizer" class="w2ui-selection-resizer"></div>' : "") + "</div>");
          range = query9(this.box).find("#grid_" + this.name + "_f" + rg.name);
        } else {
          range.attr("style", rg.style);
          range.find(".w2ui-selection-resizer").show();
        }
        if (td2f.length === 0) {
          td2f = query9(this.box).find("#grid_" + this.name + "_frec_" + w2utils.escapeId(last.recid) + " td:last-child");
          if (td2f.length === 0) td2f = query9(this.box).find("#grid_" + this.name + "_frec_bottom td:first-child");
          range.css("border-right", "0px");
          range.find(".w2ui-selection-resizer").hide();
        }
        if (first.recid != null && last.recid != null && td1f.length > 0 && td2f.length > 0) {
          const style = getComputedStyle(td2f[0]);
          const top1 = td1f.prop("offsetTop") - td1f.prop("scrollTop");
          const left1 = td1f.prop("offsetLeft") + td1f.prop("scrollLeft");
          const top2 = td2f.prop("offsetTop") - td2f.prop("scrollTop");
          const left2 = td2f.prop("offsetLeft") + td2f.prop("scrollLeft");
          range.show().css({
            top: (top1 > 0 ? top1 : 0) + "px",
            left: (left1 > 0 ? left1 : 0) + "px",
            width: left2 - left1 + parseFloat(style.width) - 1 + "px",
            height: top2 - top1 + parseFloat(style.height) - 1 + "px"
          });
        } else {
          range.hide();
        }
      } else {
        range.hide();
      }
      range = query9(this.box).find("#grid_" + this.name + "_" + rg.name);
      if (td1.length > 0 || td2.length > 0) {
        if (range.length === 0) {
          rec2.append(`
                        <div id="grid_${this.name}_${rg.name}" class="w2ui-selection ${rg.class ?? ""}" style="${rg.style}">
                            ${rg.name == "selection" && this.show.selectionResizer ? `<div id="grid_${this.name}_resizer" class="w2ui-selection-resizer"></div>` : ""}
                        </div>
                    `);
          range = query9(this.box).find("#grid_" + this.name + "_" + rg.name);
        } else {
          range.attr("style", rg.style);
        }
        if (td1.length === 0) {
          td1 = query9(this.box).find("#grid_" + this.name + "_rec_" + w2utils.escapeId(first.recid) + " td:first-child");
          if (td1.length === 0) td1 = query9(this.box).find("#grid_" + this.name + "_rec_top td:first-child");
        }
        if (td2f.length !== 0) {
          range.css("border-left", "0px");
        }
        if (first.recid != null && last.recid != null && td1.length > 0 && td2.length > 0) {
          const style = getComputedStyle(td2[0]);
          const top1 = td1.prop("offsetTop") - td1.prop("scrollTop");
          const left1 = td1.prop("offsetLeft") + td1.prop("scrollLeft");
          const top2 = td2.prop("offsetTop") - td2.prop("scrollTop");
          const left2 = td2.prop("offsetLeft") + td2.prop("scrollLeft");
          range.show().css({
            top: (top1 > 0 ? top1 : 0) + "px",
            left: (left1 > 0 ? left1 : 0) + "px",
            width: left2 - left1 + parseFloat(style.width) - 1 + "px",
            height: top2 - top1 + parseFloat(style.height) - 1 + "px"
          });
        } else {
          range.hide();
        }
      } else {
        range.hide();
      }
    }
    query9(this.box).find(".w2ui-selection-resizer").off(".resizer").on("mousedown.resizer", mouseStart).on("dblclick.resizer", (event2) => {
      const edata2 = this.trigger("resizerDblClick", { target: this.name, originalEvent: event2 });
      if (edata2.isCancelled === true) return;
      edata2.finish();
    });
    let edata;
    const detail = { target: this.name, originalRange: null, newRange: null };
    const letters = "abcdefghijklmnopqrstuvwxyz";
    return Date.now() - time;
    function mouseStart(event2) {
      const sel = self.getSelection();
      const first = sel[0];
      const last = sel[sel.length - 1];
      self.last.move = {
        type: "expand",
        x: event2.screenX,
        y: event2.screenY,
        divX: 0,
        divY: 0,
        index: first.index,
        recid: first.recid,
        column: first.column,
        name: letters[first.column] + (first.index + 1) + ":" + letters[last.column] + (last.index + 1),
        originalRange: [w2utils.clone(first), w2utils.clone(last)],
        newRange: [w2utils.clone(first), w2utils.clone(last)]
      };
      detail.originalName = self.last.move.name;
      detail.originalRange = self.last.move.originalRange;
      query9("body").off(".w2ui-" + self.name).on("mousemove.w2ui-" + self.name, mouseMove).on("mouseup.w2ui-" + self.name, mouseStop);
      event2.preventDefault();
    }
    function mouseMove(event2) {
      const mv = self.last.move;
      if (!mv || mv.type != "expand") return;
      mv.divX = event2.screenX - mv.x;
      mv.divY = event2.screenY - mv.y;
      let column;
      let tmp = event2.target;
      if (tmp.tagName.toUpperCase() != "TD") tmp = query9(tmp).closest("td")[0];
      if (query9(tmp).attr("col") != null) column = parseInt(query9(tmp).attr("col"));
      if (column == null) {
        return;
      }
      tmp = query9(tmp).closest("tr")[0];
      const index = parseInt(query9(tmp).attr("index"));
      const recid = self.records[index]?.recid;
      if (mv.newRange[1].recid == recid && mv.newRange[1].column == column) {
        return;
      }
      const prevNewRange = w2utils.clone(mv.newRange);
      mv.newRange = [{ recid: mv.recid, index: mv.index, column: mv.column }, { recid, index, column }];
      detail.newName = letters[mv.column] + (mv.index + 1) + ":" + letters[column] + (index + 1);
      detail.newRange = w2utils.clone(mv.newRange);
      edata = self.trigger("selectionExtend", detail);
      if (edata.isCancelled === true) {
        mv.newRange = prevNewRange;
        detail.newRange = prevNewRange;
        return;
      } else {
        self.addRange({
          name: "selection-expand",
          range: mv.newRange,
          class: "w2ui-selection-expand"
        });
      }
    }
    function mouseStop(_event) {
      self.removeRange("selection-expand");
      query9("body").off(".w2ui-" + self.name);
      if (self.last.move?.type == "expand" && edata.finish) {
        edata.finish();
      }
      delete self.last.move;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select(...selectArgs) {
    if (selectArgs.length === 0) return 0;
    let selected = 0;
    const sel = this.last.selection;
    if (!this.multiSelect) this.selectNone(true);
    let args = selectArgs.slice();
    if (Array.isArray(args[0])) args = args[0];
    args = args.filter((aa) => {
      const recid = aa?.recid ?? aa;
      const index = aa?.index ?? this.get(recid, true);
      const rec = this.records[index];
      if (rec?.w2ui?.selectable === false) {
        return false;
      }
      if (typeof aa === "object") {
        aa.index ??= index;
      }
      return true;
    });
    const tmp = { target: this.name };
    if (args.length == 1) {
      tmp.multiple = false;
      if (w2utils.isPlainObject(args[0])) {
        tmp.clicked = {
          recid: args[0].recid,
          column: args[0].column
        };
      } else {
        tmp.recid = args[0];
      }
    } else {
      tmp.multiple = true;
      tmp.clicked = { recids: args };
    }
    if (this.compareSelection(args).select.length == 0) {
      return;
    }
    const edata = this.trigger("select", tmp);
    if (edata.isCancelled === true) return 0;
    if (this.selectType == "row") {
      for (let a = 0; a < args.length; a++) {
        const recid = typeof args[a] == "object" ? args[a].recid : args[a];
        const index = this.get(recid, true);
        if (index == null) continue;
        let recEl1 = null;
        let recEl2 = null;
        if (this.searchData.length !== 0 || index + 1 >= (this.last.vscroll.recIndStart ?? 0) && index + 1 <= (this.last.vscroll.recIndEnd ?? 0)) {
          recEl1 = query9(this.box).find("#grid_" + this.name + "_frec_" + w2utils.escapeId(recid));
          recEl2 = query9(this.box).find("#grid_" + this.name + "_rec_" + w2utils.escapeId(recid));
        }
        if (this.selectType == "row") {
          if (sel.indexes.indexOf(index) != -1) continue;
          sel.indexes.push(index);
          if (recEl1 && recEl2) {
            recEl1.addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected");
            recEl2.addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected");
            recEl1.find(".w2ui-grid-select-check").prop("checked", true);
          }
          selected++;
        }
      }
    } else {
      const new_sel = {};
      for (let a = 0; a < args.length; a++) {
        const recid = typeof args[a] == "object" ? args[a].recid : args[a];
        const column = typeof args[a] == "object" ? args[a].column : null;
        new_sel[recid] = new_sel[recid] || [];
        if (Array.isArray(column)) {
          new_sel[recid] = column;
        } else if (w2utils.isInt(column)) {
          new_sel[recid].push(column);
        } else {
          for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].hidden) continue;
            new_sel[recid].push(i);
          }
        }
      }
      const col_sel = [];
      for (const recid in new_sel) {
        const index = this.get(recid, true);
        if (index == null) continue;
        let recEl1 = null;
        let recEl2 = null;
        if (index + 1 >= (this.last.vscroll.recIndStart ?? 0) && index + 1 <= (this.last.vscroll.recIndEnd ?? 0)) {
          recEl1 = query9(this.box).find("#grid_" + this.name + "_rec_" + w2utils.escapeId(recid));
          recEl2 = query9(this.box).find("#grid_" + this.name + "_frec_" + w2utils.escapeId(recid));
        }
        const s = sel.columns[index] || [];
        if (sel.indexes.indexOf(index) == -1) {
          sel.indexes.push(index);
        }
        const new_sel_recid = new_sel[recid];
        for (let t = 0; t < new_sel_recid.length; t++) {
          if (s.indexOf(new_sel_recid[t]) == -1) s.push(new_sel_recid[t]);
        }
        s.sort((a, b) => {
          return a - b;
        });
        for (let t = 0; t < new_sel_recid.length; t++) {
          const col = new_sel_recid[t];
          if (col_sel.indexOf(col) == -1) col_sel.push(col);
          if (recEl1) {
            recEl1.find("#grid_" + this.name + "_data_" + index + "_" + col).addClass("w2ui-selected");
            recEl1.find(".w2ui-col-number").addClass("w2ui-row-selected");
            recEl1.find(".w2ui-grid-select-check").prop("checked", true);
          }
          if (recEl2) {
            recEl2.find("#grid_" + this.name + "_data_" + index + "_" + col).addClass("w2ui-selected");
            recEl2.find(".w2ui-col-number").addClass("w2ui-row-selected");
            recEl2.find(".w2ui-grid-select-check").prop("checked", true);
          }
          selected++;
        }
        sel.columns[index] = s;
      }
      for (let c = 0; c < col_sel.length; c++) {
        query9(this.box).find("#grid_" + this.name + "_column_" + col_sel[c] + " .w2ui-col-header").addClass("w2ui-col-selected");
      }
    }
    sel.indexes.sort((a, b) => {
      return a - b;
    });
    const areAllSelected = this.records.length > 0 && sel.indexes.length == this.records.length, areAllSearchedSelected = sel.indexes.length > 0 && this.searchData.length !== 0 && sel.indexes.length == this.last.searchIds.length;
    if (areAllSelected || areAllSearchedSelected) {
      query9(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true);
    } else {
      query9(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false);
    }
    this.status();
    this.addRange("selection");
    this.updateToolbar(sel, areAllSelected);
    edata.finish();
    return selected;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unselect(...unselectArgs) {
    let unselected = 0;
    const sel = this.last.selection;
    let args = unselectArgs.slice();
    if (Array.isArray(args[0])) args = args[0];
    const tmp = { target: this.name };
    if (args.length == 1) {
      tmp.multiple = false;
      if (w2utils.isPlainObject(args[0])) {
        tmp.clicked = {
          recid: args[0].recid,
          column: args[0].column
        };
      } else {
        tmp.clicked = { recid: args[0] };
      }
    } else {
      tmp.multiple = true;
      tmp.recids = args;
    }
    if (this.compareSelection(args).unselect.length == 0) {
      return 0;
    }
    const edata = this.trigger("select", tmp);
    if (edata.isCancelled === true) return 0;
    for (let a = 0; a < args.length; a++) {
      const recid = typeof args[a] == "object" ? args[a].recid : args[a];
      const record = this.get(recid);
      if (record == null) continue;
      const index = this.get(record.recid, true) ?? -1;
      const recEl1 = query9(this.box).find("#grid_" + this.name + "_frec_" + w2utils.escapeId(recid));
      const recEl2 = query9(this.box).find("#grid_" + this.name + "_rec_" + w2utils.escapeId(recid));
      if (this.selectType == "row") {
        if (sel.indexes.indexOf(index) == -1) continue;
        sel.indexes.splice(sel.indexes.indexOf(index), 1);
        recEl1.removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected");
        recEl2.removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected");
        if (recEl1.length != 0) {
          recEl1[0].style.cssText = "height: " + this.recordHeight + "px; " + recEl1.attr("custom_style");
          recEl2[0].style.cssText = "height: " + this.recordHeight + "px; " + recEl2.attr("custom_style");
        }
        recEl1.find(".w2ui-grid-select-check").prop("checked", false);
        unselected++;
      } else {
        const col = args[a].column;
        if (!w2utils.isInt(col)) {
          const cols = [];
          for (let i = 0; i < this.columns.length; i++) {
            if (this.columns[i].hidden) continue;
            cols.push({ recid, column: i });
          }
          return this.unselect(cols);
        }
        const s = sel.columns[index];
        if (!Array.isArray(s) || s.indexOf(col) == -1) continue;
        s.splice(s.indexOf(col), 1);
        query9(this.box).find(`#grid_${this.name}_rec_${w2utils.escapeId(recid)} > td[col="${col}"]`).removeClass("w2ui-selected w2ui-inactive");
        query9(this.box).find(`#grid_${this.name}_frec_${w2utils.escapeId(recid)} > td[col="${col}"]`).removeClass("w2ui-selected w2ui-inactive");
        let isColSelected = false;
        let isRowSelected = false;
        const tmp2 = this.getSelection();
        for (let i = 0; i < tmp2.length; i++) {
          if (tmp2[i].column == col) isColSelected = true;
          if (tmp2[i].recid == recid) isRowSelected = true;
        }
        if (!isColSelected) {
          query9(this.box).find(`.w2ui-grid-columns td[col="${col}"] .w2ui-col-header, .w2ui-grid-fcolumns td[col="${col}"] .w2ui-col-header`).removeClass("w2ui-col-selected");
        }
        if (!isRowSelected) {
          query9(this.box).find("#grid_" + this.name + "_frec_" + w2utils.escapeId(recid)).find(".w2ui-col-number").removeClass("w2ui-row-selected");
        }
        unselected++;
        if (s.length === 0) {
          delete sel.columns[index];
          sel.indexes.splice(sel.indexes.indexOf(index), 1);
          recEl1.find(".w2ui-grid-select-check").prop("checked", false);
        }
      }
    }
    const areAllSelected = this.records.length > 0 && sel.indexes.length == this.records.length, areAllSearchedSelected = sel.indexes.length > 0 && this.searchData.length !== 0 && sel.indexes.length == this.last.searchIds.length;
    if (areAllSelected || areAllSearchedSelected) {
      query9(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true);
    } else {
      query9(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false);
    }
    this.status();
    this.addRange("selection");
    this.updateToolbar(sel, areAllSelected);
    edata.finish();
    return unselected;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compareSelection(newSel) {
    const sel = this.getSelection();
    const select = [];
    const unselect = [];
    if (this.selectType == "row") {
      newSel.forEach((sel2, ind) => {
        if (typeof sel2 == "object") newSel[ind] = sel2.recid;
      });
      for (let i = 0; i < newSel.length; i++) {
        if (!sel.includes(newSel[i])) {
          select.push(newSel[i]);
        }
      }
      for (let i = 0; i < newSel.length; i++) {
        if (sel.includes(newSel[i])) {
          unselect.push(newSel[i]);
        }
      }
    } else {
      for (let ns = 0; ns < newSel.length; ns++) {
        let flag = false;
        for (let s = 0; s < sel.length; s++) if (newSel[ns].recid == sel[s].recid && newSel[ns].column == sel[s].column) flag = true;
        if (!flag) select.push({ recid: newSel[ns].recid, column: newSel[ns].column });
      }
      for (let s = 0; s < sel.length; s++) {
        let flag = false;
        for (let ns = 0; ns < newSel.length; ns++) if (newSel[ns].recid == sel[s].recid && newSel[ns].column == sel[s].column) flag = true;
        if (!flag) unselect.push({ recid: sel[s].recid, column: sel[s].column });
      }
    }
    return { select, unselect };
  }
  selectAll() {
    const time = Date.now();
    if (this.multiSelect === false) return;
    const url = this.url?.get ?? this.url;
    let sel = w2utils.clone(this.last.selection);
    const cols = [];
    for (let i = 0; i < this.columns.length; i++) cols.push(i);
    sel.indexes = [];
    if (!url && this.searchData.length !== 0) {
      for (let i = 0; i < this.last.searchIds.length; i++) {
        sel.indexes.push(this.last.searchIds[i]);
        if (this.selectType != "row") sel.columns[this.last.searchIds[i]] = cols.slice();
      }
    } else {
      let buffered = this.records.length;
      if (this.searchData.length != 0 && !url) buffered = this.last.searchIds.length;
      for (let i = 0; i < buffered; i++) {
        sel.indexes.push(i);
        if (this.selectType != "row") sel.columns[i] = cols.slice();
      }
    }
    const edata = this.trigger("select", { target: this.name, multiple: true, all: true, clicked: sel });
    if (edata.isCancelled === true) return;
    this.last.selection = sel;
    if (this.selectType == "row") {
      query9(this.box).find(".w2ui-grid-records tr:not(.w2ui-empty-record)").addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected");
      query9(this.box).find(".w2ui-grid-frecords tr:not(.w2ui-empty-record)").addClass("w2ui-selected").find(".w2ui-col-number").addClass("w2ui-row-selected");
      query9(this.box).find("input.w2ui-grid-select-check").prop("checked", true);
    } else {
      query9(this.box).find(".w2ui-grid-columns td .w2ui-col-header, .w2ui-grid-fcolumns td .w2ui-col-header").addClass("w2ui-col-selected");
      query9(this.box).find(".w2ui-grid-records tr .w2ui-col-number").addClass("w2ui-row-selected");
      query9(this.box).find(".w2ui-grid-records tr:not(.w2ui-empty-record)").find(".w2ui-grid-data:not(.w2ui-col-select)").addClass("w2ui-selected");
      query9(this.box).find(".w2ui-grid-frecords tr .w2ui-col-number").addClass("w2ui-row-selected");
      query9(this.box).find(".w2ui-grid-frecords tr:not(.w2ui-empty-record)").find(".w2ui-grid-data:not(.w2ui-col-select)").addClass("w2ui-selected");
      query9(this.box).find("input.w2ui-grid-select-check").prop("checked", true);
    }
    sel = this.getSelection(true);
    this.addRange("selection");
    query9(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true);
    this.status();
    this.updateToolbar({ indexes: sel }, true);
    edata.finish();
    return Date.now() - time;
  }
  selectNone(skipEvent) {
    const time = Date.now();
    let edata;
    if (!skipEvent) {
      edata = this.trigger("select", { target: this.name, clicked: [] });
      if (edata.isCancelled === true) return;
    }
    const sel = this.last.selection;
    if (this.selectType == "row") {
      query9(this.box).find(".w2ui-grid-records tr.w2ui-selected").removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected");
      query9(this.box).find(".w2ui-grid-frecords tr.w2ui-selected").removeClass("w2ui-selected w2ui-inactive").find(".w2ui-col-number").removeClass("w2ui-row-selected");
      query9(this.box).find("input.w2ui-grid-select-check").prop("checked", false);
    } else {
      query9(this.box).find(".w2ui-grid-columns td .w2ui-col-header, .w2ui-grid-fcolumns td .w2ui-col-header").removeClass("w2ui-col-selected");
      query9(this.box).find(".w2ui-grid-records tr .w2ui-col-number").removeClass("w2ui-row-selected");
      query9(this.box).find(".w2ui-grid-frecords tr .w2ui-col-number").removeClass("w2ui-row-selected");
      query9(this.box).find(".w2ui-grid-data.w2ui-selected").removeClass("w2ui-selected w2ui-inactive");
      query9(this.box).find("input.w2ui-grid-select-check").prop("checked", false);
    }
    sel.indexes = [];
    sel.columns = {};
    this.removeRange("selection");
    query9(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false);
    this.status();
    this.updateToolbar(sel, false);
    if (!skipEvent) {
      edata.finish();
    }
    return Date.now() - time;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateToolbar(sel, _areAllSelected) {
    const obj = this;
    const cnt = sel && sel.indexes ? sel.indexes.length : 0;
    if (!this.toolbar.render) {
      return;
    }
    this.toolbar.items.forEach((item) => {
      _checkItem(item, "");
      if (Array.isArray(item.items)) {
        item.items.forEach((it) => {
          _checkItem(it, item.id + ":");
        });
      }
    });
    if (this.show.toolbarSave) {
      if (this.getChanges().length > 0) {
        this.toolbar.enable("w2ui-save");
      } else {
        this.toolbar.disable("w2ui-save");
      }
    }
    function _checkItem(item, prefix) {
      if (item.batch != null) {
        let enabled = false;
        if (item.batch === true) {
          if (cnt > 0) enabled = true;
        } else if (typeof item.batch == "number") {
          if (cnt === item.batch) enabled = true;
        } else if (typeof item.batch == "function") {
          enabled = item.batch({ cnt, sel });
        }
        if (enabled) {
          obj.toolbar.enable(prefix + item.id);
        } else {
          obj.toolbar.disable(prefix + item.id);
        }
      }
    }
  }
  // any: row-select returns (string|number)[], cell-select returns W2GridCellSelection[] — runtime branching
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSelection(returnIndex) {
    const ret = [];
    const sel = this.last.selection;
    if (this.selectType == "row") {
      for (let i = 0; i < sel.indexes.length; i++) {
        const idx = sel.indexes[i];
        if (!this.records[idx]) continue;
        if (returnIndex === true) ret.push(idx);
        else ret.push(this.records[idx].recid);
      }
      return ret;
    } else {
      for (let i = 0; i < sel.indexes.length; i++) {
        const idx = sel.indexes[i];
        const cols = sel.columns[idx] ?? [];
        if (!this.records[idx]) continue;
        for (let j = 0; j < cols.length; j++) {
          ret.push({ recid: this.records[idx].recid, index: idx, column: cols[j] });
        }
      }
      return ret;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search(field, value) {
    const url = this.url?.get ?? this.url;
    const searchData = [];
    let last_multi = this.last.multi;
    let last_logic = this.last.logic;
    let last_field = this.last.field;
    let last_search = this.last.search;
    let hasHiddenSearches = false;
    const overlay = query9(`#w2overlay-${this.name}-search-overlay`);
    if (value === "") value = null;
    for (let i = 0; i < this.searches.length; i++) {
      const srch_i = this.searches[i];
      if (!srch_i.hidden || srch_i.value == null) continue;
      searchData.push({
        field: srch_i.field,
        operator: srch_i.operator || "is",
        type: srch_i.type,
        value: srch_i.value || ""
      });
      hasHiddenSearches = true;
    }
    if (field === void 0 && overlay.length === 0) {
      if (this.multiSearch) {
        field = this.searchData;
        value = this.last.logic;
      } else {
        field = this.last.field;
        value = this.last.search;
      }
    }
    if (field === void 0 && overlay.length !== 0) {
      this.focus();
      last_logic = overlay.find(`#grid_${this.name}_logic`).val();
      last_search = "";
      for (let i = 0; i < this.searches.length; i++) {
        const search = this.searches[i];
        const operator = overlay.find("#grid_" + this.name + "_operator_" + i).val();
        const field1 = overlay.find("#grid_" + this.name + "_field_" + i);
        const field2 = overlay.find("#grid_" + this.name + "_field2_" + i);
        let value1 = field1.val();
        let value2 = field2.val();
        let svalue = null;
        let text = null;
        if (["int", "float", "money", "currency", "percent"].indexOf(search.type) != -1) {
          const fld1 = field1[0]._w2field;
          const fld2 = field2[0]._w2field;
          if (fld1) value1 = fld1.clean(value1);
          if (fld2) value2 = fld2.clean(value2);
        }
        if (["list", "enum"].indexOf(search.type) != -1 || ["in", "not in"].indexOf(operator) != -1) {
          value1 = field1[0]._w2field.selected || {};
          if (Array.isArray(value1)) {
            svalue = [];
            for (let j = 0; j < value1.length; j++) {
              svalue.push(w2utils.isFloat(value1[j].id) ? parseFloat(value1[j].id) : String(value1[j].id).toLowerCase());
              delete value1[j].hidden;
            }
            if (Object.keys(value1).length === 0) value1 = "";
          } else {
            text = value1.text || "";
            value1 = value1.id || "";
          }
        }
        if (value1 !== "" && value1 != null || value2 != null && value2 !== "") {
          const tmp = {
            field: search.field,
            type: search.type,
            operator
          };
          if (operator == "between") {
            w2utils.extend(tmp, { value: [value1, value2] });
          } else if (operator == "in" && typeof value1 == "string") {
            w2utils.extend(tmp, { value: value1.split(",") });
          } else if (operator == "not in" && typeof value1 == "string") {
            w2utils.extend(tmp, { value: value1.split(",") });
          } else {
            w2utils.extend(tmp, { value: value1 });
          }
          if (svalue) w2utils.extend(tmp, { svalue });
          if (text) w2utils.extend(tmp, { text });
          try {
            if (search.type == "date" && operator == "between") {
              tmp.value[0] = value1;
              tmp.value[1] = value2;
            }
            if (search.type == "date" && operator == "is") {
              tmp.value = value1;
            }
          } catch (e) {
          }
          searchData.push(tmp);
          last_multi = true;
        }
      }
    }
    if (typeof field == "string") {
      if (value === void 0) {
        value = field;
        field = "all";
      }
      last_field = field;
      last_search = value;
      last_multi = false;
      last_logic = hasHiddenSearches ? "AND" : "OR";
      if (value != null) {
        if (field.toLowerCase() == "all") {
          if (this.searches.length > 0) {
            for (let i = 0; i < this.searches.length; i++) {
              const search = this.searches[i];
              if (search.type == "text" || search.type == "alphanumeric" && w2utils.isAlphaNumeric(value) || search.type == "int" && w2utils.isInt(value) || search.type == "float" && w2utils.isFloat(value) || search.type == "percent" && w2utils.isFloat(value) || (search.type == "hex" || search.type == "color") && w2utils.isHex(value) || search.type == "currency" && w2utils.isMoney(value) || search.type == "money" && w2utils.isMoney(value) || search.type == "date" && w2utils.isDate(value) || search.type == "time" && w2utils.isTime(value) || search.type == "datetime" && w2utils.isDateTime(value) || search.type == "datetime" && w2utils.isDate(value) || search.type == "enum" && w2utils.isAlphaNumeric(value) || search.type == "list" && w2utils.isAlphaNumeric(value)) {
                const def = this.defaultOperator[this.operatorsMap[search.type]];
                const tmp = {
                  field: search.field,
                  type: search.type,
                  operator: search.operator != null ? search.operator : def,
                  value
                };
                if (String(value).trim() != "") searchData.push(tmp);
              }
              if (["int", "float", "money", "currency", "percent"].indexOf(search.type) != -1) {
                const t = String(value).trim().split("-").map((v) => v.trim()).filter((v) => w2utils.isFloat(v));
                if (t.length == 2) {
                  const tmp = {
                    field: search.field,
                    type: search.type,
                    operator: "between",
                    value: [t[0], t[1]]
                  };
                  searchData.push(tmp);
                }
              }
              if (["list", "enum"].indexOf(search.type) != -1) {
                const new_values = [];
                if (search.options == null) search.options = {};
                if (!Array.isArray(search.options["items"])) search.options["items"] = [];
                for (let j = 0; j < search.options["items"]; j++) {
                  const tmp = search.options["items"][j];
                  try {
                    const re = new RegExp(value, "i");
                    if (re.test(tmp)) new_values.push(j);
                    if (tmp.text && re.test(tmp.text)) new_values.push(tmp.id);
                  } catch (e) {
                  }
                }
                if (new_values.length > 0) {
                  const tmp = {
                    field: search.field,
                    type: search.type,
                    operator: search.operator != null ? search.operator : "in",
                    value: new_values
                  };
                  searchData.push(tmp);
                }
              }
            }
          } else {
            for (let i = 0; i < this.columns.length; i++) {
              const tmp = {
                field: this.columns[i].field,
                type: "text",
                operator: this.defaultOperator["text"],
                value
              };
              searchData.push(tmp);
            }
          }
          if (searchData.length == 0) {
            const tmp = {
              field: "All",
              type: "text",
              operator: this.defaultOperator["text"],
              value
            };
            searchData.push(tmp);
          }
        } else {
          const el = overlay.find("#grid_" + this.name + "_search_all");
          let search = this.getSearch(field);
          if (search == null) search = { field, type: "text" };
          if (search.field == field) this.last.label = search.label ?? "";
          if (value !== "") {
            let op = this.defaultOperator[this.operatorsMap[search.type]];
            let val = value;
            if (["date", "time", "datetime"].indexOf(search.type) != -1) op = "is";
            if (["list", "enum"].indexOf(search.type) != -1) {
              op = "is";
              const tmp2 = el._w2field?.get();
              if (tmp2 && Object.keys(tmp2).length > 0) val = tmp2.id;
              else val = "";
            }
            if (search.type == "int" && value !== "") {
              op = "is";
              if (String(value).indexOf("-") != -1) {
                const tmp2 = value.split("-");
                if (tmp2.length == 2) {
                  op = "between";
                  val = [parseInt(tmp2[0]), parseInt(tmp2[1])];
                }
              }
              if (String(value).indexOf(",") != -1) {
                const tmp2 = value.split(",");
                op = "in";
                val = [];
                for (let i = 0; i < tmp2.length; i++) val.push(tmp2[i]);
              }
            }
            if (search.operator != null) op = search.operator;
            const tmp = {
              field: search.field,
              type: search.type,
              operator: op,
              value: val
            };
            searchData.push(tmp);
          }
        }
      }
    }
    if (Array.isArray(field)) {
      let logic = "AND";
      if (typeof value == "string") {
        const upperLogic = value.toUpperCase();
        if (upperLogic === "OR" || upperLogic === "AND") logic = upperLogic;
      }
      last_search = "";
      last_multi = true;
      last_logic = logic;
      for (let i = 0; i < field.length; i++) {
        const data = field[i];
        if (typeof data.value == "number" && data.operator == null) data.operator = this.defaultOperator["number"];
        if (typeof data.value == "string" && data.operator == null) data.operator = this.defaultOperator["text"];
        if (Array.isArray(data.value) && data.operator == null) data.operator = this.defaultOperator["enum"];
        if (w2utils.isDate(data.value) && data.operator == null) data.operator = this.defaultOperator["date"];
        searchData.push(data);
      }
    }
    const edata = this.trigger("search", {
      target: this.name,
      multi: field === void 0 ? true : false,
      searchField: field ? field : "multi",
      searchValue: field ? value : "multi",
      searchData,
      searchLogic: last_logic
    });
    if (edata.isCancelled === true) return;
    this.searchData = edata.detail["searchData"];
    this.last.field = last_field;
    this.last.search = last_search;
    this.last.multi = last_multi;
    this.last.logic = edata.detail["searchLogic"];
    this.last.vscroll.scrollTop = 0;
    this.last.vscroll.scrollLeft = 0;
    this.last.selection.indexes = [];
    this.last.selection.columns = {};
    this.searchClose();
    if (url) {
      this.last.fetch.offset = 0;
      this.reload();
    } else {
      this.localSearch();
      this.refresh();
    }
    edata.finish();
  }
  // open advanced search popover
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchOpen(options = {}) {
    if (!this.box) return;
    if (this.searches.length === 0) return;
    const edata = this.trigger("searchOpen", { target: this.name });
    if (edata.isCancelled === true) {
      return;
    }
    const $btn = query9(this.toolbar.box).find(".w2ui-grid-search-input .w2ui-search-drop");
    $btn.addClass("checked");
    w2tooltip4.show({
      name: this.name + "-search-overlay",
      anchor: query9(this.box).find("#grid_" + this.name + "_search_all").get(0),
      position: "bottom|top",
      html: this.getSearchesHTML(),
      align: "left",
      arrowSize: 12,
      class: "w2ui-grid-search-advanced",
      hideOn: ["doc-click"],
      ...options?.overlay ?? {}
    }).then((_event) => {
      this.initSearches();
      this.last["search_opened"] = true;
      const overlay = query9(`#w2overlay-${this.name}-search-overlay`);
      overlay.data("gridName", this.name).off(".grid-search").on("click.grid-search", (event2) => {
        overlay.find("input, select").each((el) => {
          const names = query9(el).data("tooltipName");
          if (names) names.forEach((name) => {
            w2tooltip4.hide(name);
          });
        });
        console.log(event2.target);
        if (!query9(event2.target).hasClass("w2ui-saved-searches")) {
          w2tooltip4.hide(this.name + "-search-suggest");
        }
      });
      w2utils.bindEvents(overlay.find("select, input, button"), this);
      const sfields = query9(`#w2overlay-${this.name}-search-overlay *[rel=search]`);
      if (sfields.length > 0) sfields[0].focus();
      edata.finish();
    }).hide((_event) => {
      const edata2 = this.trigger("searchClose", { target: this.name });
      if (edata2.isCancelled === true) {
        return;
      }
      $btn.removeClass("checked");
      this.last["search_opened"] = false;
      edata2.finish();
    });
  }
  searchClose() {
    w2tooltip4.hide(this.name + "-search-overlay");
  }
  // if clicked on a field in the search strip
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchFieldTooltip(ind, sd_ind, el) {
    const sf = this.searches[ind];
    const sd = this.searchData[sd_ind];
    if (sd == null || sf == null) return;
    let oper = sd.operator;
    if (oper == "more" && sd.type == "date") oper = "since";
    if (oper == "less" && sd.type == "date") oper = "before";
    let options = "";
    let val = sd.value;
    if (Array.isArray(sd.value)) {
      sd.value.forEach((opt) => {
        options += `<span class="value">${opt.text || opt}</span>`;
      });
      if (sd.type == "date") {
        options = "";
        sd.value.forEach((opt) => {
          options += `<span class="value">${w2utils.formatDate(opt)}</span>`;
        });
      }
    } else {
      if (sd.type == "date") {
        val = w2utils.formatDateTime(val);
      }
    }
    w2tooltip4.hide(this.name + "-search-props");
    w2tooltip4.show({
      name: this.name + "-search-props",
      anchor: el,
      class: "w2ui-white",
      hideOn: "doc-click",
      html: `
                <div class="w2ui-grid-search-single">
                    <span class="field">${sf.label ?? ""}</span>
                    <span class="operator">${w2utils.lang(oper)}</span>
                    ${Array.isArray(sd.value) ? `${options}` : `<span class="value">${val}</span>`}
                    <div class="buttons">
                        <button id="remove" class="w2ui-btn">${w2utils.lang("Remove This Field")}</button>
                    </div>
                </div>`
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).then((event2) => {
      query9(event2.detail.overlay.box).find("#remove").on("click", () => {
        this.searchData.splice(sd_ind, 1);
        this.reload();
        this.localSearch();
        w2tooltip4.hide(this.name + "-search-props");
      });
    });
  }
  // drop down with save searches
  searchSuggest(imediate, forceHide, anchor) {
    clearTimeout(this.last.kbd_timer ?? void 0);
    clearTimeout(this.last["overlay_timer"]);
    this.searchShowFields(true);
    if (anchor == null) this.searchClose();
    if (forceHide === true || anchor != null && query9(`#w2overlay-${this.name}-search-suggest`).length > 0) {
      w2tooltip4.hide(this.name + "-search-suggest");
      return;
    }
    if (query9(`#w2overlay-${this.name}-search-suggest`).length > 0) {
      return;
    }
    if (!imediate) {
      this.last["overlay_timer"] = setTimeout(() => {
        this.searchSuggest(true);
      }, 100);
      return;
    }
    const el = anchor ?? query9(this.box).find(`#grid_${this.name}_search_all`).get(0);
    const searches = [
      ...this.defaultSearches ?? [],
      ...this.defaultSearches?.length > 0 && this.savedSearches?.length > 0 ? ["--"] : [],
      ...this.savedSearches ?? []
    ];
    if (Array.isArray(searches) && searches.length > 0) {
      w2menu3.show({
        name: this.name + "-search-suggest",
        anchor: el,
        align: anchor != null ? "left" : "both",
        items: searches,
        selected: false,
        filter: true,
        hideOn: ["doc-click", "sleect", "remove"],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        render(item) {
          let ret = item.text;
          if (item.isDefault) ret = `<b>${ret}</b>`;
          return ret;
        }
      }).select((event2) => {
        const edata = this.trigger("searchSelect", {
          target: this.name,
          index: event2.detail.index,
          item: event2.detail.item
        });
        if (edata.isCancelled === true) {
          event2.preventDefault();
          return;
        }
        event2.detail.overlay.hide();
        this.last.logic = event2.detail.item.logic || "AND";
        this.last.search = "";
        this.last.label = "[Multiple Fields]";
        this.searchData = w2utils.clone(event2.detail.item.data);
        this["searchSelected"] = w2utils.clone(event2.detail.item, { exclude: ["icon", "remove"] });
        this.reload();
        edata.finish();
      }).remove((event2) => {
        const item = event2.detail.item;
        const edata = this.trigger("searchRemove", { target: this.name, index: event2.detail.index, item });
        if (edata.isCancelled === true) {
          event2.preventDefault();
          return;
        }
        queueMicrotask(() => event2.detail.overlay.hide());
        w2tooltip4.hide(this.name + "-search-overlay");
        this.confirm(w2utils.lang('Do you want to delete search "${item}"?', { item: item.text })).yes((evt) => {
          const search = this.savedSearches.findIndex((s) => s.id == item.id ? true : false);
          if (search !== -1) {
            this.savedSearches.splice(search, 1);
          }
          this.cacheSave("searches", this.savedSearches.map((s) => w2utils.clone(s, { exclude: ["remove", "icon"] })));
          evt.detail.self.close();
          edata.finish();
        }).no((evt) => {
          evt.detail.self.close();
        });
      });
    }
  }
  searchSave() {
    let value = "";
    if (this["searchSelected"]) {
      value = this["searchSelected"].text;
    }
    const ind = this.savedSearches.findIndex((s) => {
      return s.id == this["searchSelected"]?.id ? true : false;
    });
    const edata = this.trigger("searchSave", { target: this.name, saveLocalStorage: true });
    if (edata.isCancelled === true) return;
    this.message({
      width: 350,
      height: 150,
      body: `<div class="w2ui-grid-save-search">
                        <span>${w2utils.lang(ind != -1 ? "Update Search" : "Save New Search")}</span>
                        <input class="search-name w2ui-input" placeholder="${w2utils.lang("Search name")}">
                   </div>`,
      buttons: `
                <button id="grid-search-cancel" class="w2ui-btn">${w2utils.lang("Cancel")}</button>
                <button id="grid-search-save" class="w2ui-btn w2ui-btn-blue" ${String(value).trim() == "" ? "disabled" : ""}>${w2utils.lang("Save")}</button>
            `
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    })?.open(async (event2) => {
      query9(event2.detail.box).find("input, button").eq(0).val(value);
      await event2.complete;
      query9(event2.detail.box).find("#grid-search-cancel").on("click", () => {
        this.message();
      });
      query9(event2.detail.box).find("#grid-search-save").on("click", () => {
        const input = query9(event2.detail.box).find(".w2ui-message .search-name");
        const name = input.val();
        if (this["searchSelected"] && ind != -1) {
          Object.assign(this.savedSearches[ind], {
            id: name,
            text: name,
            logic: this.last.logic,
            data: w2utils.clone(this.searchData)
          });
        } else {
          this.savedSearches.push({
            id: name,
            text: name,
            icon: "w2ui-icon-search",
            remove: true,
            logic: this.last.logic,
            data: this.searchData
          });
        }
        this.cacheSave("searches", this.savedSearches.map((s) => w2utils.clone(s, { exclude: ["remove", "icon"] })));
        this.message();
        if (this["searchSelected"]) {
          this["searchSelected"].text = name;
          query9(this.box).find(`#grid_${this.name}_search_name .name-text`).html(name);
        } else {
          this["searchSelected"] = {
            text: name,
            logic: this.last.logic,
            data: w2utils.clone(this.searchData)
          };
          query9(event2.detail.box).find(`#grid_${this.name}_search_all`).val(" ").prop("readOnly", true);
          query9(event2.detail.box).find(`#grid_${this.name}_search_name`).show().find(".name-text").html(name);
        }
        edata.finish({ name });
      });
      await w2utils.wait(100);
      query9(event2.detail.box).find("input, button").off(".message").on("keydown.message", (evt) => {
        const val = String(query9(event2.detail.box).find(".w2ui-message-body input").val()).trim();
        if (evt.keyCode == 13 && val != "") {
          query9(event2.detail.box).find("#grid-search-save").trigger("click");
        }
        if (evt.keyCode == 27) {
          this.message();
        }
      }).eq(0).on("input.message", (_evt) => {
        const $save = query9(event2.detail.box).closest(".w2ui-message").find("#grid-search-save");
        if (String(query9(event2.detail.box).val()).trim() === "") {
          $save.prop("disabled", true);
        } else {
          $save.prop("disabled", false);
        }
      }).get(0).focus();
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cache(type) {
    if (w2utils.hasLocalStorage && this.useLocalStorage) {
      try {
        const data = JSON.parse(localStorage["w2ui"] || "{}");
        data[this.stateId || this.name] ??= {};
        return data[this.stateId || this.name][type];
      } catch (e) {
      }
    }
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cacheSave(type, value) {
    if (w2utils.hasLocalStorage && this.useLocalStorage) {
      try {
        const data = JSON.parse(localStorage["w2ui"] || "{}");
        data[this.stateId || this.name] ??= {};
        data[this.stateId || this.name][type] = value;
        localStorage["w2ui"] = JSON.stringify(data);
        return true;
      } catch (e) {
        delete localStorage["w2ui"];
      }
    }
    return false;
  }
  searchReset(noReload) {
    const searchData = [];
    let hasHiddenSearches = false;
    for (let i = 0; i < this.searches.length; i++) {
      const srch_r = this.searches[i];
      if (!srch_r.hidden || srch_r.value == null) continue;
      searchData.push({
        field: srch_r.field,
        operator: srch_r.operator || "is",
        type: srch_r.type,
        value: srch_r.value || ""
      });
      hasHiddenSearches = true;
    }
    const edata = this.trigger("search", { reset: true, target: this.name, searchData });
    if (edata.isCancelled === true) return;
    const input = query9(this.box).find("#grid_" + this.name + "_search_all");
    this.searchData = edata.detail["searchData"];
    this["searchSelected"] = null;
    this.last.search = "";
    this.last.logic = hasHiddenSearches ? "AND" : this.last.logic;
    if (this.multiSearch) {
      input.next().show();
    } else {
      input.next().hide();
    }
    this.last.multi = false;
    this.last.fetch.offset = 0;
    this.last.vscroll.scrollTop = 0;
    this.last.vscroll.scrollLeft = 0;
    this.last.selection.indexes = [];
    this.last.selection.columns = {};
    this.searchClose();
    const all = input.val("").get(0);
    if (all?._w2field) {
      all._w2field.reset();
    }
    if (!noReload) {
      this.reload();
    }
    edata.finish();
  }
  searchShowFields(forceHide) {
    if (forceHide === true) {
      w2tooltip4.hide(this.name + "-search-fields");
      return;
    }
    const items = [];
    for (let s = -1; s < this.searches.length; s++) {
      let search = this.searches[s];
      const sField = search ? search.field : null;
      const column = sField != null ? this.getColumn(sField) : null;
      let disabled = false;
      let tooltip = null;
      if (this.show.searchHiddenMsg == true && s != -1 && (column == null || column.hidden === true && column.hideable !== false)) {
        disabled = true;
        tooltip = w2utils.lang(`This column ${column == null ? "does not exist" : "is hidden"}`);
      }
      if (s == -1) {
        if (!this.multiSearch || !this.show.searchAll) continue;
        search = { field: "all", label: "All Fields", type: "text" };
      } else {
        if (column != null && column.hideable === false) continue;
        if (search == null) continue;
        if (search.hidden === true) {
          tooltip = w2utils.lang("This column is hidden");
          if (search["simple"] === false) continue;
        }
      }
      if (search == null) continue;
      if (search.label == null && search["caption"] != null) {
        console.log("NOTICE: grid search.caption property is deprecated, please use search.label. Search ->", search);
        search.label = search["caption"];
      }
      items.push({
        id: search.field,
        text: w2utils.lang(search.label ?? ""),
        search,
        tooltip,
        disabled,
        checked: search.field == this.last.field
      });
    }
    w2menu3.show({
      type: "radio",
      name: this.name + "-search-fields",
      anchor: query9(this.box).find("#grid_" + this.name + "_search_name").parent().find(".w2ui-search-down").get(0),
      items,
      align: "none",
      hideOn: ["doc-click", "select"]
    }).select((event2) => {
      this.searchInitInput(event2.detail.item.search.field);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchInitInput(field, _value) {
    let search;
    const el = query9(this.box).find("#grid_" + this.name + "_search_all");
    if (field == "all") {
      search = { field: "all", label: w2utils.lang("All Fields") };
    } else {
      search = this.getSearch(field);
      if (search == null) return;
    }
    if (this.last.search != "") {
      this.last.label = search.label ?? "";
      this.search(search.field, this.last.search);
    } else {
      this.last.field = search.field;
      this.last.label = search.label ?? "";
    }
    el.attr("placeholder", w2utils.lang("Search") + " " + w2utils.lang(search.label || search["caption"] || search.field, true));
    if (this["searchSelected"]) {
      query9(this.box).find(`#grid_${this.name}_search_all`).val(" ").prop("readOnly", true);
      query9(this.box).find(`#grid_${this.name}_search_name`).show().find(".name-text").html(this["searchSelected"].text);
    } else {
      query9(this.box).find(`#grid_${this.name}_search_all`).prop("readOnly", false);
      query9(this.box).find(`#grid_${this.name}_search_name`).hide().find(".name-text").html("");
    }
  }
  // clears records and related params
  clear(noRefresh) {
    this.total = 0;
    this.records = [];
    this.summary = [];
    this.last.fetch.offset = 0;
    this.last.idCache = {};
    this.last.selection = { indexes: [], columns: {} };
    this.last.groupBy_links = {};
    this.reset(true);
    if (!noRefresh) this.refresh();
  }
  // clears scroll position, selection, ranges
  reset(noRefresh) {
    this.last.vscroll.scrollTop = 0;
    this.last.vscroll.scrollLeft = 0;
    this.last.vscroll.recIndStart = null;
    this.last.vscroll.recIndEnd = null;
    query9(this.box).find(`#grid_${this.name}_records`).prop("scrollTop", 0);
    if (!noRefresh) this.refresh();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  skip(offset, callBack) {
    const url = this.url?.get ?? this.url;
    if (url) {
      this.offset = parseInt(offset);
      if (this.offset > this.total) this.offset = this.total - this.limit;
      if (this.offset < 0 || !w2utils.isInt(this.offset)) this.offset = 0;
      this.clear(true);
      this.reload(callBack);
    } else {
      console.log("ERROR: grid.skip() can only be called when you have remote data source.");
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  load(url, callBack) {
    if (url == null) {
      console.log('ERROR: You need to provide url argument when calling .load() method of "' + this.name + '" object.');
      return new Promise((resolve, reject) => {
        reject();
      });
    }
    this.clear(true);
    return this.request("load", {}, url, callBack);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reload(callBack) {
    const grid = this;
    const url = this.url?.get ?? this.url;
    grid.selectionSave();
    if (url) {
      return this.load(url, () => {
        grid.selectionRestore();
        if (typeof callBack == "function") callBack();
      });
    } else {
      this.reset(true);
      this.localSearch();
      this.selectionRestore();
      if (typeof callBack == "function") callBack({ status: "success" });
      return new Promise((resolve) => {
        resolve();
      });
    }
  }
  // any: url can be string, { get, save, remove } object, URL instance, or null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request(action, postData, url, callBack) {
    const self = this;
    let resolve, reject;
    const requestProm = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    if (postData == null) postData = {};
    if (!url) url = this.url;
    if (!url) return new Promise((resolve2, reject2) => {
      reject2();
    });
    if (!w2utils.isInt(this.offset)) this.offset = 0;
    if (!w2utils.isInt(this.last.fetch.offset)) this.last.fetch.offset = 0;
    let edata;
    const params = {
      limit: this.limit,
      offset: this.offset + this.last.fetch.offset,
      searchLogic: this.last.logic,
      search: this.searchData.map((search) => {
        const _search = w2utils.clone(search);
        if (this.searchMap && this.searchMap[_search.field]) _search.field = this.searchMap[_search.field];
        return _search;
      }),
      sort: this.sortData.map((sort) => {
        const _sort = w2utils.clone(sort);
        if (this.sortMap && this.sortMap[_sort.field]) _sort.field = this.sortMap[_sort.field];
        return _sort;
      })
    };
    if (this.searchData.length === 0) {
      delete params.search;
      delete params.searchLogic;
    }
    if (this.sortData.length === 0) {
      delete params.sort;
    }
    w2utils.extend(params, this.postData);
    w2utils.extend(params, postData);
    if (action == "delete" || action == "save") {
      delete params.limit;
      delete params.offset;
      params.action = action;
      if (action == "delete") {
        params[this.recid || "recid"] = this.getSelection();
      }
    }
    if (action == "load") {
      edata = this.trigger("request", {
        target: this.name,
        url,
        postData: params,
        httpMethod: "GET",
        httpHeaders: this.httpHeaders
      });
      if (edata.isCancelled === true) return new Promise((resolve2, reject2) => {
        reject2();
      });
    } else {
      edata = { detail: {
        url,
        postData: params,
        httpMethod: action == "save" ? "PUT" : "DELETE",
        httpHeaders: this.httpHeaders
      } };
    }
    if (this.last.fetch.offset === 0) {
      this.lock(w2utils.lang(this.msgRefresh), true);
    }
    if (this.last.fetch.controller) try {
      this.last.fetch.controller.abort();
    } catch (e) {
    }
    url = edata.detail.url;
    switch (action) {
      case "save":
        if (url?.save) url = url.save;
        break;
      case "delete":
        if (url?.remove) url = url.remove;
        break;
      default:
        url = url?.get ?? url;
    }
    if (Object.keys(this.routeData).length > 0) {
      const info = w2utils.parseRoute(url);
      if (info.keys.length > 0) {
        for (let k = 0; k < info.keys.length; k++) {
          const key_k = info.keys[k];
          if (this.routeData[key_k.name] == null) continue;
          url = url.replace(new RegExp(":" + key_k.name, "g"), this.routeData[key_k.name]);
        }
      }
    }
    url = new URL(url, location.href);
    const fetchOptions = w2utils.prepareParams(url, {
      method: edata.detail.httpMethod,
      headers: edata.detail.httpHeaders,
      body: edata.detail.postData
    }, { dataType: this.dataType, caller: this, action });
    Object.assign(this.last.fetch, {
      action,
      options: fetchOptions,
      controller: new AbortController(),
      start: Date.now(),
      loaded: false
    });
    fetchOptions["signal"] = this.last.fetch.controller.signal;
    fetch(url, fetchOptions).catch(processError).then((resp) => {
      if (resp == null) return;
      if (resp?.status != 200) {
        processError(resp ?? {});
        return;
      }
      resp.json().catch(processError).then((data) => {
        this.requestComplete(data ?? {}, action, callBack, resolve, reject);
      }).finally(() => self.unlock());
    });
    if (action == "load") {
      edata.finish();
    }
    return requestProm;
    function processError(response) {
      if (response?.name === "AbortError") {
        return;
      }
      self.unlock();
      const edata2 = self.trigger("error", { response, lastFetch: self.last.fetch });
      if (edata2.isCancelled === true) return;
      if (response.status && response.status != 200) {
        response.json().then((data) => {
          self.error(response.status + ": " + (data.message || response.statusText));
        }).catch(() => {
          self.error(response.status + ": " + response.statusText);
        });
      } else {
        console.log(
          "ERROR: Server communication failed.",
          "\n   EXPECTED:",
          { total: 5, records: [{ recid: 1, field: "value" }] },
          "\n         OR:",
          { error: true, message: "error message" }
        );
        self.requestComplete({ error: true, message: w2utils.lang(self.msgHTTPError), response }, action, callBack, resolve, reject);
      }
      edata2.finish();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestComplete(data, action, callBack, resolve, reject) {
    let error = data.error ?? false;
    if (data.error == null && data.status === "error") error = true;
    this.last.fetch.response = (Date.now() - this.last.fetch.start) / 1e3;
    setTimeout(() => {
      if (this.show.statusResponse) {
        this.status(w2utils.lang("Server Response ${count} seconds", { count: this.last.fetch.response }));
      }
    }, 10);
    this.last.vscroll.pull_more = false;
    this.last.vscroll.pull_refresh = true;
    let event_name = "load";
    if (this.last.fetch.action == "save") event_name = "save";
    if (this.last.fetch.action == "delete") event_name = "delete";
    const edata = this.trigger(event_name, { target: this.name, error, data, lastFetch: this.last.fetch });
    if (edata.isCancelled === true) {
      reject();
      return;
    }
    if (!error) {
      if (typeof this.parser == "function") {
        data = this.parser(data);
        if (typeof data != "object") {
          console.log("ERROR: Your parser did not return proper object");
        }
      } else {
        if (data == null) {
          data = {
            error: true,
            message: w2utils.lang(this.msgNotJSON)
          };
        } else if (Array.isArray(data)) {
          data = {
            error,
            records: data,
            total: data.length
          };
        }
      }
      if (action == "load") {
        if (data.total == null) data.total = -1;
        if (data.records == null) {
          data.records = [];
          this.last.groupBy_links = {};
        }
        if (data.records.length == this.limit) {
          const loaded = this.records.length + data.records.length;
          this.last.fetch.hasMore = loaded == this.total ? false : true;
        } else {
          this.last.fetch.hasMore = false;
          this.total = this.offset + (this.last.fetch.offset ?? 0) + data.records.length;
        }
        if (!this.last.fetch.hasMore) {
          query9(this.box).find("#grid_" + this.name + "_rec_more, #grid_" + this.name + "_frec_more").hide();
        }
        if (this.last.fetch.offset === 0) {
          this.records = [];
          this.summary = [];
          this.last.groupBy_links = {};
        } else {
          if (data.total != -1 && parseInt(String(data.total)) != this.total) {
            const grid = this;
            this.message(w2utils.lang(this.msgNeedReload)).ok(() => {
              delete grid.last.fetch.offset;
              grid.reload();
            });
            return new Promise((resolve2) => {
              resolve2();
            });
          }
        }
        if (w2utils.isInt(data.total)) this.total = parseInt(data.total);
        if (data.records) {
          data.records.forEach((rec) => {
            if (this.recid) {
              rec.recid = this.parseField(rec, this.recid);
            }
            if (rec.recid == null) {
              rec.recid = "recid-" + this.records.length;
            }
            if (rec.w2ui?.summary === true) {
              this.summary.push(rec);
            } else {
              this.records.push(rec);
            }
          });
        }
        if (data.groupBy != null) {
          this.groupBy = data.groupBy;
        }
        this.processGroupBy();
        if (data.summary) {
          this.summary = [];
          data.summary.forEach((rec) => {
            if (this.recid) {
              rec.recid = this.parseField(rec, this.recid);
            }
            if (rec.recid == null) {
              rec.recid = "recid-" + this.summary.length;
            }
            this.summary.push(rec);
          });
        }
      } else if (action == "delete") {
        this.reset();
        return this.reload();
      }
    } else {
      this.error(w2utils.lang(data.message || this.msgServerError));
      reject(data);
    }
    const url = this.url?.get ?? this.url;
    if (!url) {
      this.localSort();
      this.localSearch();
    }
    this.total = parseInt(String(this.total));
    if (this.last.fetch.offset === 0) {
      this.refresh();
    } else {
      this.scroll();
      this.resize();
    }
    if (typeof callBack == "function") callBack(data);
    resolve(data);
    edata.finish();
    this.last.fetch.loaded = true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(msg) {
    const edata = this.trigger("error", { target: this.name, message: msg });
    if (edata.isCancelled === true) {
      return;
    }
    this.message(msg);
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getChanges(recordsBase) {
    const changes = [];
    if (typeof recordsBase == "undefined") {
      recordsBase = this.records;
    }
    for (let r = 0; r < recordsBase.length; r++) {
      const rec = recordsBase[r];
      if (rec?.w2ui) {
        if (rec.w2ui["changes"] != null) {
          const obj = {};
          obj[this.recid || "recid"] = rec.recid;
          changes.push(w2utils.extend(obj, rec.w2ui["changes"]));
        }
        if (rec.w2ui.expanded !== true && rec.w2ui.children && rec.w2ui.children.length) {
          changes.push(...this.getChanges(rec.w2ui.children));
        }
      }
    }
    return changes;
  }
  mergeChanges() {
    const changes = this.getChanges();
    for (let c = 0; c < changes.length; c++) {
      const change_c = changes[c];
      const record = this.get(change_c[this.recid || "recid"]);
      if (record == null) continue;
      for (const s in change_c) {
        if (s == "recid" || this.recid && s == this.recid) continue;
        if (typeof change_c[s] === "object") change_c[s] = change_c[s].text;
        try {
          _setValue(record, s, change_c[s]);
        } catch (e) {
          console.log("ERROR: Cannot merge. ", e?.message || "", e);
        }
        if (record.w2ui) delete record.w2ui["changes"];
      }
    }
    this.refresh();
    function _setValue(obj, field, value) {
      const fld = field.split(".");
      if (fld.length == 1) {
        obj[field] = value;
      } else {
        obj = obj[fld[0]];
        fld.shift();
        _setValue(obj, fld.join("."), value);
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(callBack) {
    const changes = this.getChanges();
    const url = this.url?.save ?? this.url;
    const edata = this.trigger("save", { target: this.name, changes });
    if (edata.isCancelled === true) return;
    if (url) {
      this.request(
        "save",
        { "changes": edata.detail["changes"] },
        null,
        (data) => {
          if (!data.error) {
            this.mergeChanges();
          }
          edata.finish();
          if (typeof callBack == "function") callBack(data);
        }
      );
    } else {
      this.mergeChanges();
      edata.finish();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editField(recid, column, value, event2) {
    const self = this;
    if (this.last.inEditMode === true) {
      if (event2 && event2.keyCode == 13) {
        const { index: index2, column: column2, value: value2 } = this.last._edit;
        this.editChange({ type: "custom", value: value2 }, index2, column2, event2);
        this.editDone(index2, column2, event2);
      } else {
        const input2 = query9(this.box).find("div.w2ui-edit-box .w2ui-input");
        if (input2.length > 0) {
          if (input2.get(0).tagName == "DIV") {
            input2.text(input2.text() + value);
            w2utils.setCursorPosition(input2.get(0), input2.text().length);
          } else {
            input2.val(input2.val() + value);
            w2utils.setCursorPosition(input2.get(0), input2.val().length);
          }
        }
      }
      return;
    }
    const index = this.get(recid, true);
    if (index == null) return;
    const edit = this.getCellEditable(index, column);
    if (!edit || ["checkbox", "check"].includes(edit.type)) return;
    const rec = this.records[index];
    const col = this.columns[column];
    const prefix = col.frozen === true ? "_f" : "_";
    if (["enum", "file"].indexOf(edit.type) != -1) {
      console.log('ERROR: input types "enum" and "file" are not supported in inline editing.');
      return;
    }
    const edata = this.trigger("editField", { target: this.name, recid, column, value, index, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    value = edata.detail["value"];
    this.last.inEditMode = true;
    this.last["editColumn"] = column;
    this.last._edit = { value, index, column, recid };
    this.selectNone(true);
    this.select({ recid, column });
    const tr = query9(this.box).find("#grid_" + this.name + prefix + "rec_" + w2utils.escapeId(recid));
    let div = tr.find('[col="' + column + '"] > div');
    this.last._edit["tr"] = tr;
    this.last._edit["div"] = div;
    query9(this.box).find("div.w2ui-edit-box").remove();
    if (this.selectType != "row") {
      query9(this.box).find("#grid_" + this.name + prefix + "selection").attr("id", "grid_" + this.name + "_editable").removeClass("w2ui-selection").addClass("w2ui-edit-box").prepend('<div style="position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;"></div>').find(".w2ui-selection-resizer").remove();
      div = query9(this.box).find("#grid_" + this.name + "_editable > div:first-child");
    }
    edit.attr = edit.attr ?? "";
    edit.text = edit.text ?? "";
    edit.style = edit.style ?? "";
    edit.items = edit.items ?? [];
    let val = rec.w2ui?.["changes"]?.[col.field] != null ? w2utils.stripTags(rec.w2ui["changes"][col.field]) : w2utils.stripTags(self.parseField(rec, col.field));
    if (val == null) val = "";
    let prevValue = typeof val != "object" ? val : "";
    if (edata.detail["prevValue"] != null) prevValue = edata.detail["prevValue"];
    if (value != null) val = value;
    let addStyle = col.style != null ? col.style + ";" : "";
    if (typeof col.render == "string") {
      const tmp = col.render.replace("|", ":").split(":");
      if (["number", "int", "float", "money", "currency", "percent", "size"].includes(tmp[0] ?? "")) {
        addStyle += "text-align: right;";
      }
    }
    if (edit.items.length > 0 && !w2utils.isPlainObject(edit.items[0])) {
      edit.items = w2utils.normMenu(edit.items, edit);
    }
    let input;
    const dropTypes = ["date", "time", "datetime", "color", "list", "combo"];
    const styles = getComputedStyle(tr.find('[col="' + column + '"] > div').get(0));
    const font = `font-family: ${styles.getPropertyValue("font-family")}; font-size: ${styles.getPropertyValue("font-size")};`;
    switch (edit.type) {
      case "div": {
        div.addClass("w2ui-editable").html(w2utils.stripSpaces(`<div id="grid_${this.name}_edit_${recid}_${column}" class="w2ui-input w2ui-focus"
                        contenteditable autocorrect="off" autocomplete="off" spellcheck="false"
                        style="${font + addStyle + edit.style}"
                        field="${col.field}" recid="${recid}" column="${column}" ${edit.attr}>
                    </div>${edit.text}`));
        input = div.find("div.w2ui-input").get(0);
        input.innerText = typeof val != "object" ? val : "";
        if (value != null) {
          w2utils.setCursorPosition(input, input.innerText.length);
        } else {
          w2utils.setCursorPosition(input, 0, input.innerText.length);
        }
        break;
      }
      default: {
        div.addClass("w2ui-editable").html(w2utils.stripSpaces(`<input id="grid_${this.name}_edit_${recid}_${column}" class="w2ui-input"
                        autocorrect="off" autocomplete="off" spellcheck="false" type="text"
                        style="${font + addStyle + edit.style}"
                        field="${col.field}" recid="${recid}" column="${column}" ${edit.attr}>${edit.text}`));
        input = div.find("input").get(0);
        if (edit.type == "number") {
          val = w2utils.formatNumber(val);
        }
        if (edit.type == "date") {
          val = w2utils.formatDate(w2utils.isDate(val, edit.format, true) || /* @__PURE__ */ new Date(), edit.format);
        }
        input.value = typeof val != "object" ? val : "";
        const doHide = (event3) => {
          const escKey = this.last._edit?.["escKey"];
          let selected = false;
          const name = query9(input).data("tooltipName");
          if (name && w2tooltip4.get(name[0])?.selected != null) {
            selected = true;
          }
          if (this.last.inEditMode && !escKey && dropTypes.includes(edit.type) && (event3.detail.overlay.anchor?.id == this.last._edit?.["input"]?.id || edit.type == "list")) {
            this.editChange();
            this.editDone(void 0, void 0, { keyCode: selected ? 13 : 0 });
          }
        };
        new w2field(w2utils.extend({}, edit, {
          el: input,
          selected: val,
          onSelect: doHide,
          onHide: doHide
        }));
        if (value == null && input) {
          input.select();
        }
      }
    }
    Object.assign(this.last._edit, { input, edit });
    query9(input).off(".w2ui-editable").on("blur.w2ui-editable", (event3) => {
      if (this.last.inEditMode) {
        const type = this.last._edit?.["edit"]?.type;
        const name = query9(input).data("tooltipName");
        const et = event3.target;
        if (name && dropTypes.includes(type) || et?._keepOpen === true) {
          delete et._keepOpen;
          return;
        }
        this.editChange(input, index, column, event3);
        this.editDone();
      }
    }).on("mousedown.w2ui-editable", (event3) => {
      event3.stopPropagation();
    }).on("click.w2ui-editable", (event3) => {
      expand.call(input, event3);
    }).on("paste.w2ui-editable", (event3) => {
      event3.preventDefault();
      const text = event3.clipboardData.getData("text/plain");
      document.execCommand("insertHTML", false, text);
    }).on("keyup.w2ui-editable", (event3) => {
      expand.call(input, event3);
    }).on("keydown.w2ui-editable", (event3) => {
      const kev = event3;
      switch (kev.keyCode) {
        case 8:
          if (edit.type == "list" && !input._w2field) {
            kev.preventDefault();
          }
          break;
        case 9:
        case 13:
          kev.preventDefault();
          break;
        case 27:
          const name = query9(input).data("tooltipName");
          if (name && name.length > 0) {
            if (this.last._edit) this.last._edit["escKey"] = true;
            w2tooltip4.hide(name[0]);
            kev.preventDefault();
            return;
          }
          kev.stopPropagation();
          break;
      }
      setTimeout(() => {
        switch (kev.keyCode) {
          case 9: {
            const next = kev.shiftKey ? self.prevCell(index, column, true) : self.nextCell(index, column, true);
            if (next != null) {
              const recid2 = self.records[next.index].recid;
              this.editChange(input, index, column, event3);
              this.editDone(index, column, event3);
              if (self.selectType != "row") {
                self.selectNone(true);
                self.select({ recid: recid2, column: next.colIndex });
              } else {
                self.editField(recid2, next.colIndex, null, event3);
              }
              if (event3.preventDefault) event3.preventDefault();
            }
            break;
          }
          case 13: {
            let selected = false;
            const name = query9(input).data("tooltipName");
            if (name && w2tooltip4.get(name[0]).selected != null) {
              selected = true;
            }
            if ((!name || !selected) && input._keepOpen !== true) {
              this.editChange(input, index, column, event3);
              this.editDone(index, column, event3);
            } else {
              delete input._keepOpen;
            }
            break;
          }
          case 27: {
            if (this.last._edit) this.last._edit["escKey"] = false;
            let old = self.parseField(rec, col.field);
            if (rec.w2ui?.["changes"]?.[col.field] != null) old = rec.w2ui["changes"][col.field];
            if (input._prevValue != null) old = input._prevValue;
            if (input.tagName == "DIV") {
              input.innerText = old != null ? old : "";
            } else {
              input.value = old != null ? old : "";
            }
            this.editDone(index, column, event3);
            setTimeout(() => {
              self.select({ recid, column });
            }, 1);
            break;
          }
        }
        expand(input);
      }, 1);
    });
    if (input) input._prevValue = prevValue;
    if (edit.type != "list") {
      setTimeout(() => {
        if (!this.last.inEditMode) return;
        if (input) {
          input.focus();
          clearTimeout(this.last.kbd_timer ?? void 0);
          input.resize = expand;
          expand(input);
        }
      }, 50);
    }
    edata.finish({ input });
    return;
    function expand(input2) {
      try {
        const styles2 = getComputedStyle(input2);
        const val2 = input2.tagName.toUpperCase() == "DIV" ? input2.innerText : input2.value;
        const editBox = query9(self.box).find("#grid_" + self.name + "_editable").get(0);
        const style = `font-family: ${styles2.getPropertyValue("font-family")}; font-size: ${styles2.getPropertyValue("font-size")}; white-space: no-wrap;`;
        const width = w2utils.getStrWidth(val2, style);
        if (width + 20 > editBox.clientWidth) {
          query9(editBox).css("width", width + 20 + "px");
        }
      } catch (e) {
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editChange(input, index, column, event2) {
    input = input ?? this.last._edit?.["input"];
    index = index ?? this.last._edit?.["index"];
    column = column ?? this.last._edit?.["column"];
    event2 = event2 ?? {};
    const summary = index < 0;
    index = index < 0 ? -index - 1 : index;
    const records = summary ? this.summary : this.records;
    const rec = records[index];
    const col = this.columns[column];
    let new_val = input?.tagName == "DIV" ? input.innerText : input.value;
    const fld = input._w2field;
    if (fld) {
      if (fld.type == "list") {
        new_val = fld.selected;
      }
      if (new_val == null || Object.keys(new_val).length === 0) new_val = "";
      if (!w2utils.isPlainObject(new_val)) new_val = fld.clean(new_val);
    }
    if (input.type == "checkbox") {
      if (rec.w2ui?.["editable"] === false) input.checked = !input.checked;
      new_val = input.checked;
    }
    const old_val = this.parseField(rec, col.field);
    const prev_val = rec.w2ui?.["changes"] && rec.w2ui["changes"].hasOwnProperty(col.field) ? rec.w2ui["changes"][col.field] : old_val;
    let edata = {
      target: this.name,
      input,
      recid: rec.recid,
      index,
      column,
      originalEvent: event2,
      value: {
        new: new_val,
        previous: prev_val,
        original: old_val
      }
    };
    if (event2.target?._prevValue != null) edata.value.previous = event2.target._prevValue;
    let count = 0;
    while (count < 20) {
      count++;
      new_val = edata.value.new;
      if (typeof new_val != "object" && String(old_val) != String(new_val) || typeof new_val == "object" && new_val && new_val.id != old_val && (typeof old_val != "object" || old_val == null || new_val.id != old_val.id)) {
        edata = this.trigger("change", edata);
        if (edata.isCancelled !== true) {
          if (new_val !== edata.detail.value.new) {
            continue;
          }
          if ((edata.detail.value.new === "" || edata.detail.value.new == null) && (prev_val === "" || prev_val == null)) {
          } else {
            rec.w2ui = rec.w2ui ?? {};
            rec.w2ui["changes"] = rec.w2ui["changes"] ?? {};
            rec.w2ui["changes"][col.field] = edata.detail.value.new;
          }
          edata.finish();
        }
      } else {
        edata = this.trigger("restore", edata);
        if (edata.isCancelled !== true) {
          if (new_val !== edata.detail.value.new) {
            continue;
          }
          if (rec.w2ui?.["changes"]) {
            delete rec.w2ui["changes"][col.field];
            if (Object.keys(rec.w2ui["changes"]).length === 0) {
              delete rec.w2ui["changes"];
            }
          }
          edata.finish();
        }
      }
      break;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editDone(index, column, event2) {
    index = index ?? this.last._edit?.["index"];
    column = column ?? this.last._edit?.["column"];
    event2 = event2 ?? {};
    if (this.advanceOnEdit && event2.keyCode == 13) {
      const next = event2.shiftKey ? this.prevRow(index, column, 1) ?? index : this.nextRow(index, column, 1) ?? index;
      setTimeout(() => {
        if (this.selectType != "row") {
          this.selectNone(true);
          this.select({ recid: this.records[next].recid, column });
        } else {
          this.editField(this.records[next].recid, column, null, event2);
        }
      }, 1);
    }
    const summary = index < 0;
    const cell = query9(this.last._edit?.["tr"]).find('[col="' + column + '"]');
    const rec = this.records[index];
    const col = this.columns[column];
    this.last.inEditMode = false;
    this.last._edit = null;
    if (!summary) {
      if (rec.w2ui?.["changes"]?.[col.field] != null) {
        cell.addClass("w2ui-changed");
      } else {
        cell.removeClass("w2ui-changed");
      }
      cell.replace(this.getCellHTML(index, column, summary));
    }
    query9(this.box).find("div.w2ui-edit-box").remove();
    this.updateToolbar();
    setTimeout(() => {
      const input = query9(this.box).find(`#grid_${this.name}_focus`).get(0);
      if (document.activeElement !== input && !this.last.inEditMode) {
        input.focus();
      }
    }, 10);
  }
  "delete"(force) {
    const edata = this.trigger("delete", { target: this.name, force });
    if (force) this.message();
    if (edata.isCancelled === true) return;
    force = edata.detail["force"];
    const recs = this.getSelection();
    if (recs.length === 0) return;
    if (this.msgDelete != "" && !force) {
      ;
      this.confirm({
        text: w2utils.lang(this.msgDelete, {
          count: recs.length,
          records: w2utils.lang(recs.length == 1 ? "record" : "records")
        }),
        width: 380,
        height: 170,
        yes_text: w2utils.lang("Delete"),
        yes_class: "w2ui-btn-red",
        no_text: w2utils.lang("Cancel")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }).yes((event2) => {
        event2.detail.self.close();
        this.delete(true);
      }).no((event2) => {
        event2.detail.self.close();
      });
      return;
    }
    const url = this.url?.remove ?? this.url;
    if (url) {
      this.request("delete");
    } else {
      if (typeof recs[0] != "object") {
        this.selectNone();
        this.remove(...recs);
      } else {
        for (let r = 0; r < recs.length; r++) {
          const rr = recs[r];
          const fld = this.columns[rr.column].field;
          const ind = this.get(rr.recid, true);
          const rec = ind != null ? this.records[ind] : null;
          if (ind != null && fld != "recid" && rec != null) {
            this.records[ind][fld] = "";
            if (rec.w2ui?.["changes"]) delete rec.w2ui["changes"][fld];
          }
        }
        this.update();
      }
    }
    edata.finish();
  }
  // any: recid can be string|number (row select) or {recid, column} object (cell select)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  click(recid, event2) {
    const time = Date.now();
    let column = null;
    if (this.last.cancelClick == true || event2 && event2.altKey) return;
    if (typeof recid == "object" && recid !== null) {
      column = recid.column;
      recid = recid.recid;
    }
    if (event2 == null) event2 = {};
    if (time - this.last.click_time < 350 && this.last.click_recid == recid && event2.type == "click") {
      this.dblClick(recid, event2);
      return;
    }
    if (this.last.bubbleEl) {
      this.last.bubbleEl = null;
    }
    this.last.click_time = time;
    const last_recid = this.last.click_recid;
    this.last.click_recid = recid;
    if (column == null && event2.target) {
      let trg = event2.target;
      if (trg.tagName != "TD") trg = query9(trg).closest("td")[0];
      if (query9(trg).attr("col") != null) column = parseInt(query9(trg).attr("col"));
    }
    const index = this.get(recid, true);
    const rec = index != null ? this.records[index] : null;
    if (rec?.w2ui?.selectable === false && (rec?.w2ui?.children?.length ?? 0) > 0) {
      if (!query9(event2.target).hasClass("w2ui-show-children")) {
        this.toggle(recid);
        return;
      }
    }
    const edata = this.trigger("click", { target: this.name, recid, column, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    const sel = this.getSelection();
    query9(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false);
    const ind = this.get(recid, true);
    const selectColumns = [];
    this.last.sel_ind = ind;
    this.last.sel_col = column;
    this.last.sel_recid = recid;
    this.last.sel_type = "click";
    let start = 0, end = 0, t1 = 0, t2 = 0;
    if (event2.shiftKey && sel.length > 0 && this.multiSelect) {
      if (sel[0].recid) {
        start = this.get(sel[0].recid, true) ?? 0;
        end = this.get(recid, true) ?? 0;
        if (column > sel[0].column) {
          t1 = sel[0].column;
          t2 = column;
        } else {
          t1 = column;
          t2 = sel[0].column;
        }
        for (let c = t1; c <= t2; c++) selectColumns.push(c);
      } else {
        start = last_recid != null ? this.get(last_recid, true) ?? 0 : 0;
        end = this.get(recid, true) ?? 0;
      }
      const sel_add = [];
      if (start > end) {
        const tmp = start;
        start = end;
        end = tmp;
      }
      const url = this.url?.get ?? this.url;
      for (let i = start; i <= end; i++) {
        if (this.searchData.length > 0 && !url && !this.last.searchIds.includes(i)) continue;
        if (this.selectType == "row") {
          sel_add.push(this.records[i].recid);
        } else {
          for (let sc = 0; sc < selectColumns.length; sc++) {
            sel_add.push({ recid: this.records[i].recid, column: selectColumns[sc] });
          }
        }
      }
      this.select(sel_add);
    } else {
      const last = this.last.selection;
      let flag = last.indexes.indexOf(ind ?? -1) != -1 ? true : false;
      let fselect = false;
      if (query9(event2.target).closest("td").hasClass("w2ui-col-select")) fselect = true;
      if ((!event2.ctrlKey && !event2.shiftKey && !event2.metaKey && !fselect || !this.multiSelect) && !this["showSelectColumn"]) {
        if (this.selectType != "row" && !last.columns[ind ?? -1]?.includes(column)) {
          flag = false;
        }
        if (flag === true && sel.length == 1) {
          this.unselect({ recid, column });
        } else {
          this.selectNone(true);
          this.select({ recid, column });
        }
      } else {
        if (this.selectType != "row") flag = false;
        if (flag === true) {
          this.unselect({ recid, column });
        } else {
          this.select({ recid, column });
        }
      }
    }
    this.status();
    this.initResize();
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnClick(field, event2) {
    if (this.last.colResizing === true) {
      return;
    }
    let edata = this.trigger("columnClick", { target: this.name, field, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    if (this.selectType == "row") {
      const column = this.getColumn(field);
      if (column && column.sortable) this.sort(field, null, event2 && (event2.ctrlKey || event2.metaKey || event2.shiftKey) ? true : false);
      if (edata.detail["field"] == "line-number") {
        if (this.getSelection().length >= this.records.length) {
          this.selectNone();
        } else {
          this.selectAll();
        }
      }
    } else {
      if (event2.altKey) {
        const column = this.getColumn(field);
        if (column && column.sortable) this.sort(field, null, event2 && (event2.ctrlKey || event2.metaKey || event2.shiftKey) ? true : false);
      }
      if (edata.detail["field"] == "line-number") {
        if (this.getSelection().length >= this.records.length) {
          this.selectNone();
        } else {
          this.selectAll();
        }
      } else {
        if (!event2.shiftKey && !event2.metaKey && !event2.ctrlKey) {
          this.selectNone(true);
        }
        const tmp = this.getSelection();
        const column = this.getColumn(edata.detail["field"], true) ?? 0;
        const sel = [];
        const cols = [];
        if (tmp.length != 0 && event2.shiftKey) {
          let start = column;
          let end = tmp[0].column;
          if (start > end) {
            start = tmp[0].column;
            end = column;
          }
          for (let i = start; i <= end; i++) cols.push(i);
        } else {
          cols.push(column);
        }
        edata = this.trigger("columnSelect", { target: this.name, columns: cols });
        if (edata.isCancelled !== true) {
          for (let i = 0; i < this.records.length; i++) {
            sel.push({ recid: this.records[i].recid, column: cols });
          }
          this.select(sel);
        }
        edata.finish();
      }
    }
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnDblClick(field, event2) {
    const edata = this.trigger("columnDblClick", { target: this.name, field, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnContextMenu(field, event2) {
    const edata = this.trigger("columnContextMenu", { target: this.name, field, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    w2menu3.show({
      type: "check",
      contextMenu: true,
      originalEvent: event2,
      items: this.initColumnOnOff()
    }).then(() => {
      query9("#w2overlay-context-menu .w2ui-grid-skip").off(".w2ui-grid").on("click.w2ui-grid", (evt) => {
        evt.stopPropagation();
      }).on("keypress", (evt) => {
        if (evt.keyCode == 13) {
          this.skip(evt.target.value);
          this.toolbar.click("w2ui-column-on-off");
        }
      });
    }).select((event3) => {
      const id = event3.detail.item.id;
      if (["w2ui-stateSave", "w2ui-stateReset"].includes(id)) {
        this[id.substring(5)]();
      } else if (id == "w2ui-skip") {
      } else {
        this.columnOnOff(event3, event3.detail.item.id);
      }
      clearTimeout(this.last.kbd_timer ?? void 0);
    });
    clearTimeout(this.last.kbd_timer ?? void 0);
    event2.preventDefault();
    edata.finish();
  }
  // if called w/o arguments, then will resize all columns
  columnAutoSize(colIndex) {
    if (colIndex === void 0) {
      this.columns.forEach((col2, i) => this.columnAutoSize(i));
      return;
    }
    const col = this.columns[colIndex];
    const el = query9(`#grid_${this.name}_column_${colIndex} .w2ui-col-header`)[0];
    if (col["autoResize"] === false || col.hidden === true || !el) {
      return true;
    }
    const style = getComputedStyle(el);
    let maxWidth = w2utils.getStrWidth(el.innerHTML, `font-family: ${style.fontFamily}; font-size: ${style.fontSize}`, true) + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + 4;
    query9(this.box).find(`.w2ui-grid-records td[col="${colIndex}"] > div`, this.box).each((el2) => {
      const htmlEl = el2;
      const style2 = getComputedStyle(htmlEl);
      const width = w2utils.getStrWidth(htmlEl.innerHTML, `font-family: ${style2.fontFamily}; font-size: ${style2.fontSize}`, true) + parseFloat(style2.paddingLeft) + parseFloat(style2.paddingRight) + 4;
      if (maxWidth < width) {
        maxWidth = width;
      }
    });
    const edata = this.trigger("columnAutoResize", { maxWidth, originalEvent: event, target: this.name, column: col });
    if (edata.isCancelled === true) {
      return;
    }
    if (maxWidth > 0) {
      if (col.sizeOriginal == null) col.sizeOriginal = col.size ?? "";
      col.size = Math.min(Math.abs(maxWidth), col.max || Infinity) + "px";
      this.resizeRecords();
      this.resizeRecords();
      this.scroll();
    }
    edata.finish();
  }
  columnAutoSizeAll() {
    this.columns.forEach((col, ind) => this.columnAutoSize(ind));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  focus(event2) {
    const edata = this.trigger("focus", { target: this.name, originalEvent: event2 });
    if (edata.isCancelled === true) return false;
    this.hasFocus = true;
    query9(this.box).removeClass("w2ui-inactive").find(".w2ui-inactive").removeClass("w2ui-inactive");
    setTimeout(() => {
      const txt = query9(this.box).find(`#grid_${this.name}_focus`).get(0);
      if (txt && document.activeElement != txt) {
        txt.focus();
      }
    }, 10);
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blur(event2) {
    const edata = this.trigger("blur", { target: this.name, originalEvent: event2 });
    if (edata.isCancelled === true) return false;
    this.hasFocus = false;
    query9(this.box).addClass("w2ui-inactive").find(".w2ui-selected").addClass("w2ui-inactive");
    query9(this.box).find(".w2ui-selection").addClass("w2ui-inactive");
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keydown(event2) {
    const obj = this;
    const url = this.url?.get ?? this.url;
    if (obj.keyboard !== true) return;
    const edata = obj.trigger("keydown", { target: obj.name, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    if (query9(this.box).find(".w2ui-message").length > 0) {
      if (event2.keyCode == 27) this.message();
      return;
    }
    let empty = false;
    const records = query9(obj.box).find("#grid_" + obj.name + "_records");
    const sel = obj.getSelection();
    if (sel.length === 0) empty = true;
    let recid = sel[0] || null;
    let columns = [];
    let recid2 = sel[sel.length - 1];
    if (typeof recid == "object" && recid != null) {
      recid = sel[0].recid;
      columns = [];
      let ii = 0;
      while (true) {
        if (!sel[ii] || sel[ii].recid != recid) break;
        columns.push(sel[ii].column);
        ii++;
      }
      recid2 = sel[sel.length - 1].recid;
    }
    const ind = obj.get(recid, true) ?? -1;
    const ind2 = obj.get(recid2, true) ?? -1;
    const recEL = query9(obj.box).find(`#grid_${obj.name}_rec_${ind >= 0 ? w2utils.escapeId(obj.records[ind].recid) : "none"}`);
    const pageSize = Math.floor(records[0].clientHeight / obj.recordHeight);
    let cancel = false;
    const key = event2.keyCode;
    const shiftKey = event2.shiftKey;
    switch (key) {
      case 8:
      // backspace
      case 46: {
        obj.delete();
        cancel = true;
        event2.stopPropagation();
        break;
      }
      case 27: {
        if (obj.last.move?.type) {
          delete obj.last.move;
          obj.removeRange("selection-preview");
          obj.removeRange("selection-expand");
          cancel = true;
        } else {
          obj.selectNone();
          cancel = true;
        }
        break;
      }
      case 65: {
        if (!event2.metaKey && !event2.ctrlKey) break;
        obj.selectAll();
        cancel = true;
        break;
      }
      case 13: {
        if (this.selectType == "row" && obj.show.expandColumn === true) {
          if (recEL.length <= 0) break;
          obj.toggle(recid, event2);
          cancel = true;
        } else {
          for (let c = 0; c < this.columns.length; c++) {
            const edit = this.getCellEditable(ind, c);
            if (edit) {
              columns.push(c);
              break;
            }
          }
          if (this.selectType == "row" && this.last._edit && this.last._edit["column"]) {
            columns = [this.last._edit["column"]];
          }
          if (columns.length > 0) {
            obj.editField(recid, columns[0] ?? this.last["editColumn"], null, event2);
            cancel = true;
          }
        }
        break;
      }
      case 37: {
        moveLeft();
        break;
      }
      case 39: {
        moveRight();
        break;
      }
      case 33: {
        moveUp(pageSize);
        break;
      }
      case 34: {
        moveDown(pageSize);
        break;
      }
      case 35: {
        moveDown(-1);
        break;
      }
      case 36: {
        moveUp(-1);
        break;
      }
      case 38: {
        moveUp(event2.metaKey || event2.ctrlKey ? -1 : 1);
        break;
      }
      case 40: {
        moveDown(event2.metaKey || event2.ctrlKey ? -1 : 1);
        break;
      }
      // copy & paste
      case 17:
      // ctrl key
      case 91: {
        if (empty) break;
        if (w2utils.isSafari) {
          obj.last.copy_event = obj.copy(false, event2);
          const focus = query9(obj.box).find("#grid_" + obj.name + "_focus");
          focus.val(obj.last.copy_event.detail.text);
          focus[0].select();
        }
        break;
      }
      case 67: {
        if (event2.metaKey || event2.ctrlKey) {
          if (w2utils.isSafari) {
            obj.copy(obj.last.copy_event, event2);
          } else {
            obj.last.copy_event = obj.copy(false, event2);
            const focus = query9(obj.box).find("#grid_" + obj.name + "_focus");
            focus.val(obj.last.copy_event.detail.text);
            focus[0].select();
            obj.copy(obj.last.copy_event, event2);
          }
        }
        break;
      }
      case 88: {
        if (empty) break;
        if (event2.ctrlKey || event2.metaKey) {
          if (w2utils.isSafari) {
            obj.copy(obj.last.copy_event, event2);
          } else {
            obj.last.copy_event = obj.copy(false, event2);
            const focus = query9(obj.box).find("#grid_" + obj.name + "_focus");
            focus.val(obj.last.copy_event.detail.text);
            focus[0].select();
            obj.copy(obj.last.copy_event, event2);
          }
        }
        break;
      }
    }
    const tmp = [32, 187, 189, 192, 219, 220, 221, 186, 222, 188, 190, 191];
    for (let i = 48; i <= 111; i++) tmp.push(i);
    if (tmp.indexOf(key) != -1 && !event2.ctrlKey && !event2.metaKey && !cancel) {
      if (columns.length === 0) columns.push(0);
      cancel = false;
      setTimeout(() => {
        const focus = query9(obj.box).find("#grid_" + obj.name + "_focus");
        const key2 = focus.val();
        focus.val("");
        obj.editField(recid, columns[0], key2, event2);
      }, 1);
    }
    if (cancel) {
      if (event2.preventDefault) event2.preventDefault();
    }
    edata.finish();
    function moveLeft() {
      if (empty) {
        selectTopRecord();
        return;
      }
      if (obj.selectType == "row") {
        if (recEL.length <= 0) return;
        const tmp2 = obj.records[ind].w2ui || {};
        if (tmp2 && tmp2.parent_recid != null && (!Array.isArray(tmp2.children) || tmp2.children.length === 0 || !tmp2.expanded)) {
          obj.unselect(recid);
          obj.collapse(tmp2.parent_recid, event2);
          obj.select(tmp2.parent_recid);
        } else {
          obj.collapse(recid, event2);
        }
      } else {
        const prevCell = obj.prevCell(ind, columns[0]);
        let prevCol = prevCell?.index != ind ? null : prevCell?.colIndex ?? null;
        if (!shiftKey && prevCol == null) {
          obj.selectNone(true);
          prevCol = 0;
        }
        if (prevCol != null) {
          if (shiftKey && obj.multiSelect) {
            if (tmpUnselect()) return;
            const tmp2 = [];
            const newSel = [];
            const unSel = [];
            if (columns.indexOf(obj.last.sel_col) === 0 && columns.length > 1) {
              for (let i = 0; i < sel.length; i++) {
                if (tmp2.indexOf(sel[i].recid) == -1) tmp2.push(sel[i].recid);
                unSel.push({ recid: sel[i].recid, column: columns[columns.length - 1] });
              }
              obj.unselect(unSel);
              obj.scrollIntoView(ind, columns[columns.length - 1], true);
            } else {
              for (let i = 0; i < sel.length; i++) {
                if (tmp2.indexOf(sel[i].recid) == -1) tmp2.push(sel[i].recid);
                newSel.push({ recid: sel[i].recid, column: prevCol });
              }
              obj.select(newSel);
              obj.scrollIntoView(ind, prevCol, true);
            }
          } else {
            obj.click({ recid, column: prevCol }, event2);
            obj.scrollIntoView(ind, prevCol, true);
          }
        } else {
          if (!shiftKey) {
            obj.selectNone(true);
          }
        }
      }
      cancel = true;
    }
    function moveRight() {
      if (empty) {
        selectTopRecord();
        return;
      }
      if (obj.selectType == "row") {
        if (recEL.length <= 0) return;
        obj.expand(recid, event2);
      } else {
        const nextCell = obj.nextCell(ind, columns[columns.length - 1]);
        let nextCol = nextCell?.index != ind ? null : nextCell?.colIndex ?? null;
        if (!shiftKey && nextCol == null) {
          obj.selectNone(true);
          nextCol = obj.columns.length - 1;
        }
        if (nextCol != null) {
          if (shiftKey && key == 39 && obj.multiSelect) {
            if (tmpUnselect()) return;
            const tmp2 = [];
            const newSel = [];
            const unSel = [];
            if (columns.indexOf(obj.last.sel_col) == columns.length - 1 && columns.length > 1) {
              for (let i = 0; i < sel.length; i++) {
                if (tmp2.indexOf(sel[i].recid) == -1) tmp2.push(sel[i].recid);
                unSel.push({ recid: sel[i].recid, column: columns[0] });
              }
              obj.unselect(unSel);
              obj.scrollIntoView(ind, columns[0], true);
            } else {
              for (let i = 0; i < sel.length; i++) {
                if (tmp2.indexOf(sel[i].recid) == -1) tmp2.push(sel[i].recid);
                newSel.push({ recid: sel[i].recid, column: nextCol });
              }
              obj.select(newSel);
              obj.scrollIntoView(ind, nextCol, true);
            }
          } else {
            obj.click({ recid, column: nextCol }, event2);
            obj.scrollIntoView(ind, nextCol, true);
          }
        } else {
          if (!shiftKey) {
            obj.selectNone(true);
          }
        }
      }
      cancel = true;
    }
    function moveUp(numRows) {
      if (empty) selectTopRecord();
      if (recEL.length <= 0) return;
      let prev = obj.prevRow(ind, obj.selectType == "row" ? 0 : sel[0].column, numRows);
      if (!shiftKey && prev == null) {
        if (obj.searchData.length != 0 && !url) {
          prev = obj.last.searchIds[0] ?? null;
        } else {
          prev = 0;
        }
      }
      if (prev != null) {
        if (shiftKey && obj.multiSelect) {
          if (tmpUnselect()) return;
          const sel_ind = obj.last.sel_ind ?? -1;
          if (obj.selectType == "row") {
            if (sel_ind > prev && sel_ind != ind2) {
              obj.unselect(obj.records[ind2].recid);
            } else {
              obj.select(obj.records[prev].recid);
            }
          } else {
            if (sel_ind > prev && sel_ind != ind2) {
              prev = ind2;
              const tmp2 = [];
              for (let c = 0; c < columns.length; c++) tmp2.push({ recid: obj.records[prev].recid, column: columns[c] });
              obj.unselect(tmp2);
            } else {
              const tmp2 = [];
              for (let c = 0; c < columns.length; c++) tmp2.push({ recid: obj.records[prev].recid, column: columns[c] });
              obj.select(tmp2);
            }
          }
        } else {
          obj.selectNone(true);
          obj.click({ recid: obj.records[prev].recid, column: columns[0] }, event2);
        }
        obj.scrollIntoView(prev, void 0, true, numRows != 1);
        if (event2.preventDefault) event2.preventDefault();
      } else {
        if (!shiftKey) {
          obj.selectNone(true);
        }
      }
    }
    function moveDown(numRows) {
      if (empty) selectTopRecord();
      if (recEL.length <= 0) return;
      let next = obj.nextRow(ind2, obj.selectType == "row" ? 0 : sel[0].column, numRows);
      if (!shiftKey && next == null) {
        if (obj.searchData.length != 0 && !url) {
          next = obj.last.searchIds[obj.last.searchIds.length - 1] ?? null;
        } else {
          next = obj.records.length - 1;
        }
      }
      if (next != null) {
        if (shiftKey && obj.multiSelect) {
          if (tmpUnselect()) return;
          const sel_ind = obj.last.sel_ind ?? -1;
          if (obj.selectType == "row") {
            if (sel_ind < next && sel_ind != ind) {
              obj.unselect(obj.records[ind].recid);
            } else {
              obj.select(obj.records[next].recid);
            }
          } else {
            if (sel_ind < next && sel_ind != ind) {
              next = ind;
              const tmp2 = [];
              for (let c = 0; c < columns.length; c++) tmp2.push({ recid: obj.records[next].recid, column: columns[c] });
              obj.unselect(tmp2);
            } else {
              const tmp2 = [];
              for (let c = 0; c < columns.length; c++) tmp2.push({ recid: obj.records[next].recid, column: columns[c] });
              obj.select(tmp2);
            }
          }
        } else {
          obj.selectNone(true);
          obj.click({ recid: obj.records[next].recid, column: columns[0] }, event2);
        }
        obj.scrollIntoView(next, void 0, true, numRows != 1);
        cancel = true;
      } else {
        if (!shiftKey) {
          obj.selectNone(true);
        }
      }
    }
    function selectTopRecord() {
      if (!obj.records || obj.records.length === 0) return;
      let ind3 = Math.floor(records[0].scrollTop / obj.recordHeight) + 1;
      if (!obj.records[ind3] || ind3 < 2) ind3 = 0;
      if (typeof obj.records[ind3] === "undefined") return;
      obj.select({ recid: obj.records[ind3].recid, column: 0 });
    }
    function tmpUnselect() {
      if (obj.last.sel_type != "click") return false;
      if (obj.selectType != "row") {
        obj.last.sel_type = "key";
        if (sel.length > 1) {
          for (let s = 0; s < sel.length; s++) {
            if (sel[s].recid == obj.last.sel_recid && sel[s].column == obj.last.sel_col) {
              sel.splice(s, 1);
              break;
            }
          }
          obj.unselect(sel);
          return true;
        }
        return false;
      } else {
        obj.last.sel_type = "key";
        if (sel.length > 1) {
          sel.splice(sel.indexOf(obj.records[obj.last.sel_ind ?? 0].recid), 1);
          obj.unselect(sel);
          return true;
        }
        return false;
      }
    }
  }
  scrollIntoView(ind, column, instant, recTop) {
    let buffered = this.records.length;
    if (this.searchData.length != 0 && !this.url) buffered = this.last.searchIds.length;
    if (buffered === 0) return;
    if (ind == null) {
      const sel = this.getSelection();
      if (sel.length === 0) return;
      if (w2utils.isPlainObject(sel[0])) {
        ind = sel[0].index;
        column = sel[0].column;
      } else {
        ind = this.get(sel[0], true);
      }
    }
    const records = query9(this.box).find(`#grid_${this.name}_records`);
    const recWidth = records[0].clientWidth;
    const recHeight = records[0].clientHeight;
    const recSTop = records[0].scrollTop;
    const recSLeft = records[0].scrollLeft;
    const len = this.last.searchIds.length;
    if (len > 0) ind = this.last.searchIds.indexOf(ind ?? 0);
    records.css({ "scroll-behavior": instant ? "auto" : "smooth" });
    if (recHeight < this.recordHeight * (len > 0 ? len : buffered) && records.length > 0) {
      const t1 = Math.floor(recSTop / this.recordHeight);
      const t2 = t1 + Math.floor(recHeight / this.recordHeight);
      if (ind == t1) {
        records.prop("scrollTop", recSTop - recHeight / 1.3);
      }
      if (ind == t2) {
        records.prop("scrollTop", recSTop + recHeight / 1.3);
      }
      if ((ind ?? 0) < t1 || (ind ?? 0) > t2) {
        records.prop("scrollTop", ((ind ?? 0) - 1) * this.recordHeight);
      }
      if (recTop === true) {
        records.prop("scrollTop", (ind ?? 0) * this.recordHeight);
      }
    }
    if (column != null) {
      let x1 = 0;
      let x2 = 0;
      const sb = w2utils.scrollBarSize();
      for (let i = 0; i <= column; i++) {
        const col = this.columns[i];
        if (col.frozen || col.hidden) continue;
        x1 = x2;
        x2 += parseInt(col.sizeCalculated ?? "0");
      }
      if (recWidth < x2 - recSLeft) {
        records.prop("scrollLeft", x1 - sb);
      } else if (x1 < recSLeft) {
        records.prop("scrollLeft", x2 - recWidth + sb * 2);
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollToColumn(field) {
    if (field == null)
      return;
    let sWidth = 0;
    let found = false;
    for (let i = 0; i < this.columns.length; i++) {
      const col = this.columns[i];
      if (col.field == field) {
        found = true;
        break;
      }
      if (col.frozen || col.hidden)
        continue;
      const cSize = parseInt(col.sizeCalculated ? col.sizeCalculated : String(col.size ?? 0));
      sWidth += cSize;
    }
    if (!found)
      return;
    this.last.vscroll.scrollLeft = sWidth + 1;
    this.scroll();
  }
  // any: recid can be string|number (row select) or {recid, column} object (cell select)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dblClick(recid, event2) {
    let column = null;
    if (typeof recid == "object" && recid !== null) {
      column = recid.column;
      recid = recid.recid;
    }
    if (event2 == null) event2 = {};
    if (column == null && event2.target) {
      let tmp = event2.target;
      if (tmp.tagName.toUpperCase() != "TD") tmp = query9(tmp).closest("td")[0];
      column = parseInt(query9(tmp).attr("col"));
    }
    const index = this.get(recid, true);
    const rec = index != null ? this.records[index] : null;
    const edata = this.trigger("dblClick", { target: this.name, recid, column, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    this.selectNone(true);
    const edit = index != null ? this.getCellEditable(index, column) : null;
    if (edit) {
      this.editField(recid, column, null, event2);
    } else {
      this.select({ recid, column });
      if (this.show.expandColumn || rec && rec.w2ui && Array.isArray(rec.w2ui.children)) this.toggle(recid);
    }
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showContextMenu(event2, options) {
    const { recid, index, column } = options;
    if (this.last.userSelect == "text") return;
    if (event2 == null) {
      event2 = { offsetX: 0, offsetY: 0, target: query9(this.box).find(`#grid_${this.name}_rec_${recid}`)[0] };
    }
    if (event2.offsetX == null) {
      event2.offsetX = event2.layerX - event2.target.offsetLeft;
      event2.offsetY = event2.layerY - event2.target.offsetTop;
    }
    const sel = this.getSelection();
    if (this.selectType == "row") {
      if (recid != null && sel.indexOf(recid) == -1) {
        this.click(recid);
      }
    } else {
      let sel_col = false;
      let sel_row = false;
      let sel_cell = false;
      sel.forEach((rec) => {
        if (rec.recid == recid) sel_row = true;
        if (rec.column == column) sel_col = true;
        if (rec.recid == recid && rec.column == column) sel_cell = true;
      });
      if (!sel_row && recid != null && column === null) this.click({ recid });
      if (!sel_col && recid === null && column != null) this.columnClick(this.columns[column].field, event2);
      if (!sel_cell && recid != null && column != null) this.click({ recid, column });
    }
    const edata = this.trigger("contextMenu", { target: this.name, originalEvent: event2, recid, index, column });
    if (edata.isCancelled === true) return;
    if (this.contextMenu?.length > 0) {
      w2menu3.show({
        contextMenu: true,
        originalEvent: event2,
        items: this.contextMenu
      }).select((event3) => {
        clearTimeout(this.last.kbd_timer ?? void 0);
        this.contextMenuClick(recid ?? "", column ?? null, event3);
      });
    }
    event2.preventDefault();
    clearTimeout(this.last.kbd_timer ?? void 0);
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contextMenuClick(recid, column, event2) {
    const edata = this.trigger("contextMenuClick", {
      target: this.name,
      recid,
      column,
      originalEvent: event2.detail.originalEvent,
      menuEvent: event2,
      menuIndex: event2.detail.index,
      menuItem: event2.detail.item
    });
    if (edata.isCancelled === true) return;
    edata.finish();
  }
  toggle(recid, _event) {
    const rec = this.get(recid);
    if (rec == null) return;
    rec.w2ui = rec.w2ui ?? {};
    if (rec.w2ui.expanded === true) {
      return this.collapse(recid);
    } else {
      return this.expand(recid);
    }
  }
  /**
   * When record is expaned, then w2ui.children of the record is copied into this.records and this.total is updated. It will
   * also set w2ui._copeid = true, so it would not copy it again.
   *
   * There is also updateExpaned() that is called in this.refresh()
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expand(recid, noRefresh) {
    const ind = this.get(recid, true);
    if (ind == null) return false;
    const rec = this.records[ind];
    rec.w2ui = rec.w2ui ?? {};
    const id = w2utils.escapeId(recid);
    const children = rec.w2ui.children;
    let edata;
    if (Array.isArray(children)) {
      if (rec.w2ui.expanded === true || children.length === 0) return false;
      edata = this.trigger("expand", { target: this.name, recid });
      if (edata.isCancelled === true) return false;
      rec.w2ui.expanded = true;
      rec.w2ui["_copied"] = true;
      children.forEach((child) => {
        child.w2ui = child.w2ui ?? {};
        child.w2ui.parent_recid = rec.recid;
        if (child.w2ui.children == null) child.w2ui.children = [];
      });
      this.records.splice(ind + 1, 0, ...children);
      if (this.total !== -1) {
        this.total += children.length;
      }
      const url = this.url?.get ?? this.url;
      if (!url) {
        this.localSort(true, true);
        if (this.searchData.length > 0) {
          this.localSearch(true);
        }
      }
      if (noRefresh !== true) this.refresh();
      edata.finish();
    } else {
      if (query9(this.box).find("#grid_" + this.name + "_rec_" + id + "_expanded_row").length > 0 || this.show.expandColumn !== true) return false;
      if (rec.w2ui.expanded == "none") return false;
      query9(this.box).find("#grid_" + this.name + "_rec_" + id).after(
        `<tr id="grid_${this.name}_rec_${recid}_expanded_row" class="w2ui-expanded-row">
                    <td colspan="100" class="w2ui-expanded2">
                        <div id="grid_${this.name}_rec_${recid}_expanded"></div>
                    </td>
                    <td class="w2ui-grid-data-last"></td>
                </tr>`
      );
      query9(this.box).find("#grid_" + this.name + "_frec_" + id).after(
        `<tr id="grid_${this.name}_frec_${recid}_expanded_row" class="w2ui-expanded-row">
                    ${this.show.lineNumbers ? '<td class="w2ui-col-number"></td>' : ""}
                    <td class="w2ui-grid-data w2ui-expanded1" colspan="100">
                       <div id="grid_${this.name}_frec_${recid}_expanded"></div>
                    </td>
                </tr>`
      );
      edata = this.trigger("expand", {
        target: this.name,
        recid,
        box_id: "grid_" + this.name + "_rec_" + recid + "_expanded",
        fbox_id: "grid_" + this.name + "_frec_" + recid + "_expanded"
      });
      if (edata.isCancelled === true) {
        query9(this.box).find("#grid_" + this.name + "_rec_" + id + "_expanded_row").remove();
        query9(this.box).find("#grid_" + this.name + "_frec_" + id + "_expanded_row").remove();
        return false;
      }
      const row1 = query9(this.box).find("#grid_" + this.name + "_rec_" + recid + "_expanded");
      const row2 = query9(this.box).find("#grid_" + this.name + "_frec_" + recid + "_expanded");
      const innerHeight = row1.find(":scope div:first-child")[0]?.clientHeight ?? 50;
      if (row1[0].clientHeight < innerHeight) {
        row1.css({ height: innerHeight + "px" });
      }
      if (row2[0].clientHeight < innerHeight) {
        row2.css({ height: innerHeight + "px" });
      }
      query9(this.box).find("#grid_" + this.name + "_rec_" + id).attr("expanded", "yes").addClass("w2ui-expanded");
      query9(this.box).find("#grid_" + this.name + "_frec_" + id).attr("expanded", "yes").addClass("w2ui-expanded");
      query9(this.box).find("#grid_" + this.name + "_cell_" + this.get(recid, true) + "_expand div").html("-");
      rec.w2ui.expanded = true;
      edata.finish();
      this.resizeRecords();
    }
    this.selectNone();
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collapse(recid, noRefresh) {
    const ind = this.get(recid, true);
    if (ind == null) return false;
    const rec = this.records[ind];
    rec.w2ui = rec.w2ui || {};
    const id = w2utils.escapeId(recid);
    const children = rec.w2ui.children;
    let edata;
    if (Array.isArray(children)) {
      if (rec.w2ui.expanded !== true) return false;
      edata = this.trigger("collapse", { target: this.name, recid });
      if (edata.isCancelled === true) return false;
      clearExpanded(rec);
      const stops = [];
      for (let r = rec; r != null; r = r.w2ui?.parent_recid != null ? this.get(r.w2ui.parent_recid) : null)
        stops.push(r.w2ui?.parent_recid);
      const start = ind + 1;
      let end = start;
      while (true) {
        if (this.records.length <= end + 1 || this.records[end + 1].w2ui == null || stops.indexOf(this.records[end + 1].w2ui.parent_recid) >= 0) {
          break;
        }
        end++;
      }
      this.records.splice(start, end - start + 1);
      if (this.total !== -1) {
        this.total -= end - start + 1;
      }
      const url = this.url?.get ?? this.url;
      if (!url) {
        if (this.searchData.length > 0) {
          this.localSearch(true);
        }
      }
      if (noRefresh !== true) this.refresh();
      edata.finish();
    } else {
      if (query9(this.box).find("#grid_" + this.name + "_rec_" + id + "_expanded_row").length === 0 || this.show.expandColumn !== true) return false;
      edata = this.trigger("collapse", {
        target: this.name,
        recid,
        box_id: "grid_" + this.name + "_rec_" + recid + "_expanded",
        fbox_id: "grid_" + this.name + "_frec_" + recid + "_expanded"
      });
      if (edata.isCancelled === true) return false;
      query9(this.box).find("#grid_" + this.name + "_rec_" + id).removeAttr("expanded").removeClass("w2ui-expanded");
      query9(this.box).find("#grid_" + this.name + "_frec_" + id).removeAttr("expanded").removeClass("w2ui-expanded");
      query9(this.box).find("#grid_" + this.name + "_cell_" + this.get(recid, true) + "_expand div").html("+");
      query9(this.box).find("#grid_" + this.name + "_rec_" + id + "_expanded").css("height", "0px");
      query9(this.box).find("#grid_" + this.name + "_frec_" + id + "_expanded").css("height", "0px");
      setTimeout(() => {
        query9(this.box).find("#grid_" + this.name + "_rec_" + id + "_expanded_row").remove();
        query9(this.box).find("#grid_" + this.name + "_frec_" + id + "_expanded_row").remove();
        if (rec.w2ui) rec.w2ui.expanded = false;
        edata.finish();
        this.resizeRecords();
      }, 300);
    }
    this.selectNone();
    return true;
    function clearExpanded(rec2) {
      rec2.w2ui.expanded = false;
      rec2.w2ui["_copied"] = false;
      for (let i = 0; i < rec2.w2ui.children.length; i++) {
        const subRec = rec2.w2ui.children[i];
        if (subRec.w2ui?.expanded) {
          clearExpanded(subRec);
        }
      }
    }
  }
  updateExpanded() {
    let updated = false;
    for (let ind = this.records.length - 1; ind >= 0; ind--) {
      const rec = this.records[ind];
      const children = rec.w2ui?.children;
      if (rec.w2ui?.expanded === true && (children?.length ?? 0) > 0 && !rec.w2ui["_copied"]) {
        rec.w2ui["_copied"] = true;
        children.forEach((child) => {
          child.w2ui ??= {};
          child.w2ui.parent_recid = rec.recid;
          child.w2ui.children ??= [];
        });
        this.records.splice(ind + 1, 0, ...children);
        if (this.total !== -1) {
          this.total += children.length;
        }
        updated = true;
      }
    }
    if (updated) {
      const url = this.url?.get ?? this.url;
      if (!url) {
        this.localSort(true, true);
        if (this.searchData.length > 0) {
          this.localSearch(true);
        }
      }
    }
  }
  sort(field, direction, multiField) {
    const edata = this.trigger("sort", { target: this.name, field, direction, multiField });
    if (edata.isCancelled === true) return;
    if (field != null) {
      let sortIndex = this.sortData.length;
      for (let s = 0; s < this.sortData.length; s++) {
        if (this.sortData[s].field == field) {
          sortIndex = s;
          break;
        }
      }
      if (direction == null) {
        direction = this.sortData[sortIndex]?.direction;
        if (direction == null) {
          if (this.last.originalSort == null) {
            this.last.originalSort = this.records.map((rec) => rec.recid);
          }
          direction = "asc";
        } else {
          switch (direction.toLowerCase()) {
            case "asc": {
              direction = "desc";
              break;
            }
            case "desc": {
              direction = "";
              break;
            }
            default: {
              direction = "asc";
              break;
            }
          }
        }
      }
      if (multiField != true) {
        this.sortData = [];
        sortIndex = 0;
      }
      if (direction === "") {
        this.sortData.splice(sortIndex, 1);
      } else {
        this.sortData[sortIndex] ??= {};
        Object.assign(this.sortData[sortIndex], { field, direction });
      }
    } else {
      this.sortData = [];
    }
    const url = this.url?.get ?? this.url;
    if (!url) {
      this.localSort(false, true);
      if (this.searchData.length > 0) this.localSearch(true);
      this.last.vscroll.scrollTop = 0;
      query9(this.box).find(`#grid_${this.name}_records`).prop("scrollTop", 0);
      edata.finish({ direction });
      this.refresh();
    } else {
      edata.finish({ direction });
      this.last.fetch.offset = 0;
      this.reload();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  copy(flag, oEvent) {
    if (w2utils.isPlainObject(flag)) {
      flag.finish();
      return flag.text;
    }
    const sel = this.getSelection();
    if (sel.length === 0) return "";
    let text = "";
    if (typeof sel[0] == "object") {
      let minCol = sel[0].column;
      let maxCol = sel[0].column;
      const recs = [];
      for (let s = 0; s < sel.length; s++) {
        if (sel[s].column < minCol) minCol = sel[s].column;
        if (sel[s].column > maxCol) maxCol = sel[s].column;
        if (recs.indexOf(sel[s].index) == -1) recs.push(sel[s].index);
      }
      recs.sort((a, b) => {
        return a - b;
      });
      for (let r = 0; r < recs.length; r++) {
        const ind = recs[r];
        for (let c = minCol; c <= maxCol; c++) {
          const col = this.columns[c];
          if (col.hidden === true) continue;
          text += this.getCellCopy(ind, c) + "	";
        }
        text = text.substr(0, text.length - 1);
        text += "\n";
      }
    } else {
      for (let c = 0; c < this.columns.length; c++) {
        const col = this.columns[c];
        if (col.hidden === true) continue;
        let colName = col.text ? col.text : col.field;
        if (col.text && col.text.length < 3 && col.tooltip) colName = col.tooltip;
        text += '"' + w2utils.stripTags(colName) + '"	';
      }
      text = text.substr(0, text.length - 1);
      text += "\n";
      for (let s = 0; s < sel.length; s++) {
        const ind = this.get(sel[s], true);
        for (let c = 0; c < this.columns.length; c++) {
          const col = this.columns[c];
          if (col.hidden === true) continue;
          text += '"' + this.getCellCopy(ind, c) + '"	';
        }
        text = text.substr(0, text.length - 1);
        text += "\n";
      }
    }
    text = text.substr(0, text.length - 1);
    let edata;
    if (flag == null) {
      edata = this.trigger("copy", {
        target: this.name,
        text,
        cut: oEvent.keyCode == 88 ? true : false,
        originalEvent: oEvent
      });
      if (edata.isCancelled === true) return "";
      text = edata.detail["text"];
      edata.finish();
      return text;
    } else if (flag === false) {
      edata = this.trigger("copy", {
        target: this.name,
        text,
        cut: oEvent.keyCode == 88 ? true : false,
        originalEvent: oEvent
      });
      if (edata.isCancelled === true) return "";
      text = edata.detail["text"];
      return edata;
    }
  }
  /**
   * Gets value to be copied to the clipboard
   * @param ind index of the record
   * @param col_ind index of the column
   * @returns the displayed value of the field's record associated with the cell
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCellCopy(ind, col_ind) {
    return w2utils.stripTags(this.getCellHTML(ind, col_ind));
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paste(text, event2) {
    const sel = this.getSelection();
    let ind = this.get(sel[0].recid, true) ?? 0;
    const col = sel[0].column;
    const edata = this.trigger("paste", { target: this.name, text, index: ind, column: col, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    let pasteText = edata.detail["text"];
    if (this.selectType == "row" || sel.length === 0) {
      console.log("ERROR: You can paste only if grid.selectType = 'cell' and when at least one cell selected.");
      edata.finish();
      return;
    }
    if (typeof pasteText !== "object") {
      const newSel = [];
      pasteText = pasteText.split("\n");
      for (let t = 0; t < pasteText.length; t++) {
        const tmp = pasteText[t].split("	");
        let cnt = 0;
        const rec = this.records[ind];
        const cols = [];
        if (rec == null) continue;
        for (let dt = 0; dt < tmp.length; dt++) {
          if (!this.columns[col + cnt]) continue;
          setCellPaste(rec, this.columns[col + cnt].field, tmp[dt]);
          cols.push(col + cnt);
          cnt++;
        }
        for (let c = 0; c < cols.length; c++) newSel.push({ recid: rec.recid, column: cols[c] });
        ind++;
      }
      this.selectNone(true);
      this.select(newSel);
    } else {
      this.selectNone(true);
      this.select([{ recid: this.records[ind].recid, column: col }]);
    }
    this.refresh();
    edata.finish();
    function setCellPaste(rec, field, paste) {
      rec.w2ui = rec.w2ui ?? {};
      rec.w2ui["changes"] = rec.w2ui["changes"] || {};
      rec.w2ui["changes"][field] = paste;
    }
  }
  // ==================================================
  // --- Common functions
  resize() {
    const time = Date.now();
    if (!this.box || query9(this.box).attr("name") != this.name) return;
    const edata = this.trigger("resize", { target: this.name });
    if (edata.isCancelled === true) return;
    if (this.box != null) {
      this.resizeBoxes();
      this.resizeRecords();
    }
    edata.finish();
    return Date.now() - time;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update({ cells, fullCellRefresh, ignoreColumns } = {}) {
    const time = Date.now();
    const self = this;
    if (this.box == null) return 0;
    if (Array.isArray(cells)) {
      for (let i = 0; i < cells.length; i++) {
        const index = cells[i].index;
        const column = cells[i].column;
        if (index < 0) continue;
        if (index == null || column == null) {
          console.log("ERROR: Wrong argument for grid.update({ cells }), cells should be [{ index: X, column: Y }, ...]");
          continue;
        }
        const rec = this.records[index] ?? {};
        rec.w2ui = rec.w2ui ?? {};
        rec.w2ui["_update"] = rec.w2ui["_update"] ?? { cells: [] };
        let row1 = rec.w2ui["_update"].row1;
        let row2 = rec.w2ui["_update"].row2;
        if (row1 == null || !row1.isConnected || row2 == null || !row2.isColSelected) {
          row1 = this.box.querySelector(`#grid_${this.name}_rec_${w2utils.escapeId(rec.recid)}`);
          row2 = this.box.querySelector(`#grid_${this.name}_frec_${w2utils.escapeId(rec.recid)}`);
          rec.w2ui["_update"].row1 = row1;
          rec.w2ui["_update"].row2 = row2;
        }
        _update(rec, row1, row2, index, column);
      }
    } else {
      for (let i = (this.last.vscroll.recIndStart ?? 0) - 1; i <= (this.last.vscroll.recIndEnd ?? 0); i++) {
        let index = i;
        if (this.last.searchIds.length > 0) {
          index = this.last.searchIds[i] ?? i;
        } else {
          index = i;
        }
        const rec = this.records[index];
        if (index < 0 || rec == null) continue;
        rec.w2ui = rec.w2ui ?? {};
        rec.w2ui["_update"] = rec.w2ui["_update"] ?? { cells: [] };
        let row1 = rec.w2ui["_update"].row1;
        let row2 = rec.w2ui["_update"].row2;
        if (row1 == null || !row1.isConnected || row2 == null || !row2.isColSelected) {
          row1 = this.box.querySelector(`#grid_${this.name}_rec_${w2utils.escapeId(rec.recid)}`);
          row2 = this.box.querySelector(`#grid_${this.name}_frec_${w2utils.escapeId(rec.recid)}`);
          rec.w2ui["_update"].row1 = row1;
          rec.w2ui["_update"].row2 = row2;
        }
        for (let column = 0; column < this.columns.length; column++) {
          _update(rec, row1, row2, index, column);
        }
      }
    }
    return Date.now() - time;
    function _update(rec, row1, row2, index, column) {
      const pcol = self.columns[column];
      if (Array.isArray(ignoreColumns) && (ignoreColumns.includes(column) || ignoreColumns.includes(pcol?.field))) {
        return;
      }
      let cell = rec.w2ui["_update"].cells[column];
      if (cell == null || !cell.isConnected) {
        cell = self.box.querySelector(`#grid_${self.name}_data_${index}_${column}`);
        rec.w2ui["_update"].cells[column] = cell;
      }
      if (cell == null) return;
      if (fullCellRefresh) {
        query9(cell).replace(self.getCellHTML(index, column, false));
        cell = self.box.querySelector(`#grid_${self.name}_data_${index}_${column}`);
        rec.w2ui["_update"].cells[column] = cell;
      } else {
        const div = cell.children[0];
        const { value, style, className } = self.getCellValue(index, column, false, true);
        if (div.innerHTML != value) {
          div.innerHTML = value;
        }
        if (style != "" && cell.style.cssText != style) {
          cell.style.cssText = style;
        }
        if (className != "") {
          const ignore = ["w2ui-grid-data"];
          const remove = [];
          const add = className.split(" ").filter((cl) => !!cl);
          cell.classList.forEach((cl) => {
            if (!ignore.includes(cl)) remove.push(cl);
          });
          cell.classList.remove(...remove);
          cell.classList.add(...add);
        }
      }
      if (self.columns[column]?.style && self.columns[column]?.style != cell.style.cssText) {
        cell.style.cssText = self.columns[column]?.style ?? "";
      }
      if (rec.w2ui.class != null) {
        if (typeof rec.w2ui.class == "string") {
          const ignore = ["w2ui-odd", "w2ui-even", "w2ui-record"];
          const remove = [];
          const add = rec["w2ui"]["class"].split(" ").filter((cl) => !!cl);
          if (row1 && row2) {
            row1.classList.forEach((cl) => {
              if (!ignore.includes(cl)) remove.push(cl);
            });
            row1.classList.remove(...remove);
            row1.classList.add(...add);
            row2.classList.remove(...remove);
            row2.classList.add(...add);
          }
        }
        if (w2utils.isPlainObject(rec.w2ui.class) && typeof rec.w2ui.class[pcol?.field ?? ""] == "string") {
          const ignore = ["w2ui-grid-data"];
          const remove = [];
          const add = rec["w2ui"]["class"][pcol.field].split(" ").filter((cl) => !!cl);
          cell.classList.forEach((cl) => {
            if (!ignore.includes(cl)) remove.push(cl);
          });
          cell.classList.remove(...remove);
          cell.classList.add(...add);
        }
      }
      if (rec.w2ui.style != null || rec.w2ui.styles != null) {
        if (row1 && row2 && typeof rec.w2ui.style == "string" && row1.style.cssText !== rec.w2ui.style) {
          row1.style.cssText = "height: " + self.recordHeight + "px;" + rec.w2ui.style;
          row1.setAttribute("custom_style", rec.w2ui.style);
          row2.style.cssText = "height: " + self.recordHeight + "px;" + rec.w2ui.style;
          row2.setAttribute("custom_style", rec.w2ui.style);
        }
        if (rec.w2ui.styles == null) {
          rec.w2ui.styles = rec.w2ui.style;
        }
        if (w2utils.isPlainObject(rec.w2ui.styles) && typeof rec.w2ui.styles[pcol?.field ?? ""] == "string" && cell.style.cssText !== rec.w2ui.styles[pcol?.field ?? ""]) {
          cell.style.cssText = rec.w2ui.styles[pcol.field];
        }
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refreshCell(recid, field) {
    const index = this.get(recid, true);
    const col_ind = this.getColumn(field, true);
    if (index == null || col_ind == null) return false;
    const isSummary = this.records[index] && this.records[index].recid == recid ? false : true;
    const cell = query9(this.box).find(`${isSummary ? ".w2ui-grid-summary " : ""}#grid_${this.name}_data_${index}_${col_ind}`);
    if (cell.length == 0) return false;
    cell.replace(this.getCellHTML(index, col_ind, isSummary));
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refreshRow(recid, ind = null) {
    let tr1 = query9(this.box).find("#grid_" + this.name + "_frec_" + w2utils.escapeId(recid));
    let tr2 = query9(this.box).find("#grid_" + this.name + "_rec_" + w2utils.escapeId(recid));
    if (tr1.length > 0) {
      if (ind == null) ind = this.get(recid, true);
      const line = tr1.attr("line");
      const isSummary = this.records[ind] && this.records[ind].recid == recid ? false : true;
      const url = this.url?.get ?? this.url;
      if (this.searchData.length > 0 && !url) {
        for (let s = 0; s < this.last.searchIds.length; s++) if (this.last.searchIds[s] == ind) ind = s;
      }
      const rec_html = this.getRecordHTML(ind, line, isSummary);
      tr1.replace(rec_html[0]);
      tr2.replace(rec_html[1]);
      let st = this.records[ind].w2ui ? this.records[ind].w2ui["style"] : "";
      if (typeof st == "string") {
        tr1 = query9(this.box).find("#grid_" + this.name + "_frec_" + w2utils.escapeId(recid));
        tr2 = query9(this.box).find("#grid_" + this.name + "_rec_" + w2utils.escapeId(recid));
        tr1.attr("custom_style", st);
        tr2.attr("custom_style", st);
        if (tr1.hasClass("w2ui-selected")) {
          st = st.replace("background-color", "none");
        }
        tr1[0].style.cssText = "height: " + this.recordHeight + "px;" + st;
        tr2[0].style.cssText = "height: " + this.recordHeight + "px;" + st;
      }
      if (isSummary) {
        this.resize();
      }
      return true;
    }
    return false;
  }
  refresh() {
    const time = Date.now();
    const url = this.url?.get ?? this.url;
    if (this.total <= 0 && !url && this.searchData.length === 0) {
      this.total = this.records.length;
    }
    if (!this.box) return;
    const edata = this.trigger("refresh", { target: this.name });
    if (edata.isCancelled === true) return;
    if (this.show.header) {
      query9(this.box).find(`#grid_${this.name}_header`).html(w2utils.lang(this.header) + "&#160;").show();
    } else {
      query9(this.box).find(`#grid_${this.name}_header`).hide();
    }
    if (this.show.toolbar) {
      query9(this.box).find("#grid_" + this.name + "_toolbar").show();
    } else {
      query9(this.box).find("#grid_" + this.name + "_toolbar").hide();
    }
    this.searchClose();
    const getFirstSearchField = () => {
      let tmp = 0;
      while (tmp < this.searches.length && (this.searches[tmp].hidden || this.searches[tmp]["simple"] === false)) {
        tmp++;
      }
      if (tmp >= this.searches.length) return { field: "", label: "" };
      return this.searches[tmp];
    };
    if (!this.multiSearch && this.last.field == "all") {
      const fld = getFirstSearchField();
      this.last.field = fld.field;
      this.last.label = fld.label ?? "";
    }
    if (this.last.field == "all" && !this.show.searchAll) {
      this.last.field = "";
    }
    if (!this.last.field) {
      if (this.show.searchAll) {
        this.last.field = "all";
        this.last.label = "All Fields";
      } else {
        const fld = getFirstSearchField();
        this.last.field = fld.field;
        this.last.label = fld.label ?? "";
      }
    }
    const sInput = query9(this.box).find("#grid_" + this.name + "_search_all");
    for (let ss = 0; ss < this.searches.length; ss++) {
      if (this.searches[ss].field == this.last.field) {
        this.last.label = this.searches[ss].label ?? "";
      }
    }
    if (this.last.multi) {
      sInput.attr("placeholder", "[" + w2utils.lang("Multiple Fields") + "]");
    } else {
      sInput.attr("placeholder", w2utils.lang("Search") + " " + w2utils.lang(this.last.label, true));
    }
    if (sInput.val() != this.last.search) {
      let val = this.last.search;
      const tmp = sInput._w2field;
      if (tmp) val = tmp.format(val);
      sInput.val(val);
    }
    this.refreshSearch();
    this.refreshBody();
    if (this.show.footer) {
      query9(this.box).find(`#grid_${this.name}_footer`).html(this.getFooterHTML()).show();
    } else {
      query9(this.box).find(`#grid_${this.name}_footer`).hide();
    }
    const sel = this.last.selection, areAllSelected = this.records.length > 0 && sel.indexes.length == this.records.length, areAllSearchedSelected = sel.indexes.length > 0 && this.searchData.length !== 0 && sel.indexes.length == this.last.searchIds.length;
    if (areAllSelected || areAllSearchedSelected) {
      query9(this.box).find("#grid_" + this.name + "_check_all").prop("checked", true);
    } else {
      query9(this.box).find("#grid_" + this.name + "_check_all").prop("checked", false);
    }
    this.status();
    const rows = this.find({ "w2ui.expanded": true }, true, true);
    for (let r = 0; r < rows.length; r++) {
      const tmp = this.records[rows[r]].w2ui;
      if (tmp && !Array.isArray(tmp.children)) {
        tmp.expanded = false;
      }
    }
    if (this.markSearch) {
      setTimeout(() => {
        const search = [];
        for (let s = 0; s < this.searchData.length; s++) {
          const sdata = this.searchData[s];
          const fld = this.getSearch(sdata.field);
          if (!fld || fld.hidden) continue;
          const ind = this.getColumn(sdata.field, true);
          search.push({ field: sdata.field, search: sdata["value"], col: ind });
        }
        if (search.length > 0) {
          search.forEach((item) => {
            const el = query9(this.box).find('td[col="' + item.col + '"]:not(.w2ui-head)');
            w2utils.marker(el, item.search);
          });
        }
      }, 50);
    }
    this.updateToolbar(this.last.selection);
    edata.finish();
    this.resize();
    this.addRange("selection");
    setTimeout(() => {
      this.resize();
      this.scroll();
    }, 1);
    if (this.reorderColumns && !this.last.columnDrag) {
      this.last.columnDrag = this.initColumnDrag();
    } else if (!this.reorderColumns && this.last.columnDrag) {
      this.last.columnDrag.remove();
    }
    return Date.now() - time;
  }
  refreshSearch() {
    if (this.multiSearch && this.searchData.length > 0) {
      if (query9(this.box).find(".w2ui-grid-searches").length == 0) {
        query9(this.box).find(".w2ui-grid-toolbar").css("height", this.last.toolbar_height + 35 + "px").append(`<div id="grid_${this.name}_searches" class="w2ui-grid-searches"></div>`);
      }
      let searches = `
                <span id="grid_${this.name}_search_logic" class="w2ui-grid-search-logic"></span>
                <div class="grid-search-line"></div>`;
      this.searchData.forEach((sd, sd_ind) => {
        const ind = this.getSearch(sd.field, true);
        const sf = ind != null ? this.searches[ind] : null;
        let display;
        if (sf?.type == "enum" && Array.isArray(sd.value)) {
          display = `<span class="grid-search-count">${sd.value.length}</span>`;
        } else if (sf?.type == "list") {
          display = !!sd.text && sd.text !== sd.value ? `: ${sd.text}` : `: ${sd.value}`;
        } else {
          display = `: ${sd.value}`;
        }
        if (sf && sf.type == "date") {
          if (sd.operator == "between") {
            let dsp1 = sd.value[0];
            let dsp2 = sd.value[1];
            if (Number(dsp1) === dsp1) {
              dsp1 = w2utils.formatDate(dsp1);
            }
            if (Number(dsp2) === dsp2) {
              dsp2 = w2utils.formatDate(dsp2);
            }
            display = `: ${dsp1} - ${dsp2}`;
          } else {
            let dsp = sd.value;
            if (Number(dsp) == dsp) {
              dsp = w2utils.formatDate(dsp);
            }
            let oper = sd.operator;
            if (oper == "more") oper = "since";
            if (oper == "less") oper = "before";
            if (oper.substr(0, 5) == "more:") {
              oper = "since";
            }
            if (oper == "null") dsp = "";
            if (oper == "not null") dsp = "";
            display = `: ${oper} ${dsp}`;
          }
        }
        searches += `<span class="w2ui-action" data-click="searchFieldTooltip|${ind}|${sd_ind}|this">
                    ${sf ? sf.label ?? sf.field : sd.field}
                    ${display}
                    <span class="icon-chevron-down"></span>
                </span>`;
      });
      searches += `
                ${this.show.searchSave ? `<div class="grid-search-line"></div>
                       <button class="w2ui-btn grid-search-btn" data-click="searchSave" type="button">${w2utils.lang("Save")}</button>
                      ` : ""}
                <button class="w2ui-btn grid-search-btn btn-remove" type="button"
                    data-click="searchReset">X</button>
            `;
      query9(this.box).find(`#grid_${this.name}_searches`).html(searches);
      query9(this.box).find(`#grid_${this.name}_search_logic`).html(w2utils.lang(this.last.logic == "AND" ? "All" : "Any"));
    } else {
      query9(this.box).find(".w2ui-grid-toolbar").css("height", this.last.toolbar_height + "px").find(".w2ui-grid-searches").remove();
    }
    if (this["searchSelected"]) {
      query9(this.box).find(`#grid_${this.name}_search_all`).val(" ").prop("readOnly", true);
      query9(this.box).find(`#grid_${this.name}_search_name`).show().find(".name-text").html(this["searchSelected"].text);
    } else {
      query9(this.box).find(`#grid_${this.name}_search_all`).prop("readOnly", false);
      query9(this.box).find(`#grid_${this.name}_search_name`).hide().find(".name-text").html("");
    }
    w2utils.bindEvents(query9(this.box).find(`#grid_${this.name}_searches .w2ui-action, #grid_${this.name}_searches button`), this);
  }
  refreshBody() {
    this.updateExpanded();
    this.scroll();
    const recHTML = this.getRecordsHTML();
    const colHTML = this.getColumnsHTML();
    const bodyHTML = '<div id="grid_' + this.name + '_frecords" class="w2ui-grid-frecords" style="margin-bottom: ' + (w2utils.scrollBarSize() - 1) + 'px;">' + recHTML[0] + '</div><div id="grid_' + this.name + '_records" class="w2ui-grid-records">' + recHTML[1] + '</div><div id="grid_' + this.name + '_scroll1" class="w2ui-grid-scroll1" style="height: ' + w2utils.scrollBarSize() + 'px"></div><div id="grid_' + this.name + '_fcolumns" class="w2ui-grid-fcolumns">    <table><tbody>' + colHTML[0] + '</tbody></table></div><div id="grid_' + this.name + '_columns" class="w2ui-grid-columns">    <table><tbody>' + colHTML[1] + `</tbody></table></div><div class="w2ui-intersection-marker" style="display: none; height: ${this.recordHeight - 5}px">
               <div class="top-marker"></div>
               <div class="bottom-marker"></div>
            </div>`;
    const gridBody = query9(this.box).find(`#grid_${this.name}_body`, this.box).html(bodyHTML);
    const records = query9(this.box).find(`#grid_${this.name}_records`, this.box);
    const frecords = query9(this.box).find(`#grid_${this.name}_frecords`, this.box);
    if (this.selectType == "row") {
      records.on("mouseover mouseout", { delegate: "tr" }, (event2) => {
        const ind = query9(event2.delegate).attr("index");
        const recid = this.records[ind]?.recid;
        query9(this.box).find(`#grid_${this.name}_frec_${w2utils.escapeId(recid)}`).toggleClass("w2ui-record-hover", event2.type == "mouseover");
      });
      frecords.on("mouseover mouseout", { delegate: "tr" }, (event2) => {
        const ind = query9(event2.delegate).attr("index");
        const recid = this.records[ind]?.recid;
        query9(this.box).find(`#grid_${this.name}_rec_${w2utils.escapeId(recid)}`).toggleClass("w2ui-record-hover", event2.type == "mouseover");
      });
    }
    if (w2utils.isMobile) {
      records.append(frecords).on("click", { delegate: "tr" }, (event2) => {
        const index = query9(event2.delegate).attr("index");
        const recid = this.records[index]?.recid;
        this.click(recid, event2);
      }).on("touchstart", { delegate: "tr" }, (event2) => {
        const index = query9(event2.delegate).attr("index");
        const recid = this.records[index]?.recid;
        if (this.last["mobile_touch"] && Date.now() - this.last["mobile_touch"] < 350) {
          event2.preventDefault();
          this.dblClick(recid, event2);
        }
        this.last["mobile_touch"] = Date.now();
        setTimeout(() => this.last["mobile_touch"] = null, 350);
      }).on("contextmenu", { delegate: "tr" }, (event2) => {
        const index = parseInt(query9(event2.delegate).attr("index"));
        const recid = this.records[index]?.recid;
        const td = query9(event2.target).closest("td");
        const column = td.attr("col") ? parseInt(td.attr("col")) : void 0;
        const ctxOpts = { index };
        if (recid != null) ctxOpts.recid = recid;
        if (column != null) ctxOpts.column = column;
        this.showContextMenu(event2, ctxOpts);
      });
    } else {
      records.add(frecords).on("click", { delegate: "tr" }, (event2) => {
        const index = query9(event2.delegate).attr("index");
        const recid = this.records[index]?.recid;
        if (recid != "-none-" && !this.last.inEditMode) {
          this.click(recid, event2);
        }
      }).on("contextmenu", { delegate: "tr" }, (event2) => {
        const index = parseInt(query9(event2.delegate).attr("index"));
        const recid = this.records[index]?.recid;
        const td = query9(event2.target).closest("td");
        const column = td.attr("col") ? parseInt(td.attr("col")) : void 0;
        const ctxOpts = { index };
        if (recid != null) ctxOpts.recid = recid;
        if (column != null) ctxOpts.column = column;
        this.showContextMenu(event2, ctxOpts);
      }).on("mouseover", { delegate: "tr" }, (event2) => {
        this.last["rec_out"] = false;
        const index = query9(event2.delegate).attr("index");
        const recid = this.records[index]?.recid;
        if (index !== this.last["rec_over"]) {
          this.last["rec_over"] = index;
          setTimeout(() => {
            delete this.last["rec_out"];
            const edata = this.trigger("mouseEnter", { target: this.name, originalEvent: event2, index, recid });
            edata.finish();
          });
        }
      }).on("mouseout", { delegate: "tr" }, (event2) => {
        const index = query9(event2.delegate).attr("index");
        const recid = this.records[index]?.recid;
        this.last["rec_out"] = true;
        setTimeout(() => {
          const recLeave = () => {
            const edata = this.trigger("mouseLeave", { target: this.name, originalEvent: event2, index, recid });
            edata.finish();
          };
          if (index !== this.last["rec_over"]) {
            recLeave();
          }
          setTimeout(() => {
            if (this.last["rec_out"]) {
              delete this.last["rec_out"];
              delete this.last["rec_over"];
              recLeave();
            }
          });
        });
      });
    }
    gridBody.data("scroll", { lastDelta: 0, lastTime: 0 }).find(".w2ui-grid-frecords").on("mousewheel DOMMouseScroll ", (event2) => {
      event2.preventDefault();
      const scroll = gridBody.data("scroll");
      const container = gridBody.find(".w2ui-grid-records");
      let amount = typeof event2.wheelDelta != "undefined" ? -event2.wheelDelta : event2.detail || event2.deltaY;
      const newScrollTop = container.prop("scrollTop");
      scroll.lastDelta += amount;
      amount = Math.round(scroll.lastDelta);
      gridBody.data("scroll", scroll);
      container.get(0).scroll({ top: newScrollTop + amount, behavior: "smooth" });
    });
    records.off(".body-global").on("scroll.body-global", { delegate: ".w2ui-grid-records" }, (event2) => {
      this.scroll(event2);
    });
    query9(this.box).find(".w2ui-grid-body").off(".body-global").on("click.body-global dblclick.body-global contextmenu.body-global", { delegate: "td.w2ui-head" }, (event2) => {
      const col_ind = parseInt(query9(event2.delegate).attr("col"));
      const col = this.columns[col_ind] ?? { field: String(col_ind) };
      switch (event2.type) {
        case "click":
          this.columnClick(col.field, event2);
          break;
        case "dblclick":
          this.columnDblClick(col.field, event2);
          break;
        case "contextmenu":
          if (this.show.columnMenu) {
            this.columnContextMenu(col.field, event2);
          } else {
            this.showContextMenu(event2, { column: col_ind ?? void 0 });
          }
          break;
      }
    }).on("mouseover.body-global", { delegate: ".w2ui-col-header" }, (event2) => {
      const col = query9(event2.delegate).parent().attr("col");
      this.columnTooltipShow(col, event2);
      query9(event2.delegate).off(".tooltip").on("mouseleave.tooltip", () => {
        this.columnTooltipHide(col, event2);
      });
    }).on("click.body-global", { delegate: "input.w2ui-select-all" }, (event2) => {
      if (event2.delegate.checked) {
        this.selectAll();
      } else {
        this.selectNone();
      }
      event2.stopPropagation();
      clearTimeout(this.last.kbd_timer ?? void 0);
    }).on("click.body-global", { delegate: ".w2ui-show-children, .w2ui-col-expand" }, (event2) => {
      event2.stopPropagation();
      const ind = query9(event2.target).parents("tr").attr("index");
      this.toggle(this.records[ind].recid);
    }).on("click.body-global mouseover.body-global", { delegate: ".w2ui-info" }, (event2) => {
      const td = query9(event2.delegate).closest("td");
      const tr = td.parent();
      const col = this.columns[td.attr("col")];
      const isSummary = tr.parents(".w2ui-grid-body").hasClass("w2ui-grid-summary");
      if (["mouseenter", "mouseover"].includes(col?.["info"]?.showOn?.toLowerCase()) && event2.type == "mouseover") {
        this.showBubble(parseInt(tr.attr("index")), parseInt(td.attr("col")), isSummary).then(() => {
          query9(event2.delegate).off(".tooltip").on("mouseleave.tooltip", () => {
            w2tooltip4.hide(this.name + "-bubble");
          });
        });
      } else if (event2.type == "click") {
        w2tooltip4.hide(this.name + "-bubble");
        this.showBubble(parseInt(tr.attr("index")), parseInt(td.attr("col")), isSummary);
      }
    }).on("mouseover.body-global", { delegate: ".w2ui-clipboard-copy" }, (event2) => {
      if (event2.delegate._tooltipShow) return;
      const td = query9(event2.delegate).parent();
      const tr = td.parent();
      const col = this.columns[td.attr("col")];
      const isSummary = tr.parents(".w2ui-grid-body").hasClass("w2ui-grid-summary");
      w2tooltip4.show({
        name: this.name + "-bubble",
        anchor: event2.delegate,
        html: w2utils.lang(typeof col?.clipboardCopy == "string" ? col.clipboardCopy : "Copy to clipboard"),
        position: "top|bottom",
        offsetY: -2
      }).hide((_evt) => {
        event2.delegate._tooltipShow = false;
        query9(event2.delegate).off(".tooltip");
      });
      query9(event2.delegate).off(".tooltip").on("mouseleave.tooltip", (_evt) => {
        w2tooltip4.hide(this.name + "-bubble");
      }).on("click.tooltip", (evt) => {
        evt.stopPropagation();
        w2tooltip4.update(this.name + "-bubble", w2utils.lang("Copied"));
        this.clipboardCopy(tr.attr("index"), td.attr("col"), isSummary);
      });
      event2.delegate._tooltipShow = true;
    }).on("click.body-global", { delegate: ".w2ui-editable-checkbox" }, (event2) => {
      const dt = query9(event2.delegate).data();
      this.editChange.call(this, event2.delegate, dt.changeind, dt.colind, event2);
      this.updateToolbar();
    });
    if (this.records.length === 0 && this.msgEmpty) {
      query9(this.box).find(`#grid_${this.name}_body`).append(`<div id="grid_${this.name}_empty_msg" class="w2ui-grid-empty-msg"><div>${w2utils.lang(this.msgEmpty)}</div></div>`);
    } else if (query9(this.box).find(`#grid_${this.name}_empty_msg`).length > 0) {
      query9(this.box).find(`#grid_${this.name}_empty_msg`).remove();
    }
    if (this.summary.length > 0) {
      const sumHTML = this.getSummaryHTML();
      query9(this.box).find(`#grid_${this.name}_fsummary`).html(sumHTML?.[0] ?? "").show();
      query9(this.box).find(`#grid_${this.name}_summary`).html(sumHTML?.[1] ?? "").show();
    } else {
      query9(this.box).find(`#grid_${this.name}_fsummary`).hide();
      query9(this.box).find(`#grid_${this.name}_summary`).hide();
    }
  }
  render(box) {
    const time = Date.now();
    const obj = this;
    if (typeof box == "string") box = query9(box).get(0);
    const edata = this.trigger("render", { target: this.name, box: box ?? this.box });
    if (edata.isCancelled === true) return;
    if (box != null) {
      this.unmount();
      this.box = box;
    }
    if (!this.box) return;
    const url = this.url?.get ?? this.url;
    this.reset(true);
    query9(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-grid w2ui-inactive").html('<div class="w2ui-grid-box">    <div id="grid_' + this.name + '_header" class="w2ui-grid-header"></div>    <div id="grid_' + this.name + '_toolbar" class="w2ui-grid-toolbar"></div>    <div id="grid_' + this.name + '_body" class="w2ui-grid-body"></div>    <div id="grid_' + this.name + '_fsummary" class="w2ui-grid-body w2ui-grid-summary"></div>    <div id="grid_' + this.name + '_summary" class="w2ui-grid-body w2ui-grid-summary"></div>    <div id="grid_' + this.name + '_footer" class="w2ui-grid-footer"></div>    <textarea id="grid_' + this.name + '_focus" class="w2ui-grid-focus-input" ' + (this.tabIndex ? 'tabindex="' + this.tabIndex + '"' : "") + (w2utils.isMobile ? "readonly" : "") + "></textarea></div>");
    if (this.selectType != "row") query9(this.box).addClass("w2ui-ss");
    if (query9(this.box).length > 0) query9(this.box)[0].style.cssText += this.style;
    const tb_box = query9(this.box).find(`#grid_${this.name}_toolbar`);
    if (this.toolbar != null) this.toolbar.render(tb_box[0]);
    this.last.toolbar_height = tb_box.prop("offsetHeight");
    if (this.last.field && this.last.field != "all") {
      const sd = this.searchData;
      setTimeout(() => {
        this.searchInitInput(this.last.field, sd.length == 1 ? sd[0].value : null);
      }, 1);
    }
    query9(this.box).find(`#grid_${this.name}_footer`).html(this.getFooterHTML());
    if (!this.last.state) this.last.state = this.stateSave(true);
    this.stateRestore();
    if (url) {
      this.clear();
      this.refresh();
    }
    let hasHiddenSearches = false;
    for (let i = 0; i < this.searches.length; i++) {
      if (this.searches[i].hidden) {
        hasHiddenSearches = true;
        break;
      }
    }
    if (hasHiddenSearches) {
      this.searchReset(false);
      if (!url) setTimeout(() => {
        this.searchReset();
      }, 1);
    } else {
      this.reload();
    }
    query9(this.box).find(`#grid_${this.name}_focus`).on("focus", (_event) => {
      clearTimeout(this.last.kbd_timer ?? void 0);
      if (!this.hasFocus) this.focus();
    }).on("blur", (_event) => {
      clearTimeout(this.last.kbd_timer ?? void 0);
      this.last.kbd_timer = setTimeout(() => {
        if (this.hasFocus) {
          this.blur();
        }
      }, 100);
    }).on("paste", (event2) => {
      const cd = event2.clipboardData ? event2.clipboardData : null;
      if (cd) {
        let items = cd.items;
        if (items.length == 2) {
          if (items.length == 2 && items[1].kind == "file") {
            items = [items[1]];
          }
          if (items.length == 2 && items[0].type == "text/plain" && items[1].type == "text/html") {
            items = [items[1]];
          }
        }
        let items2send = [];
        for (const index in items) {
          const item = items[index];
          if (item.kind === "file") {
            const file = item.getAsFile();
            items2send.push({ kind: "file", data: file });
          } else if (item.kind === "string" && (item.type === "text/plain" || item.type === "text/html")) {
            event2.preventDefault();
            let text = cd.getData("text/plain");
            if (text.indexOf("\r") != -1 && text.indexOf("\n") == -1) {
              text = text.replace(/\r/g, "\n");
            }
            items2send.push({ kind: item.type == "text/html" ? "html" : "text", data: text });
          }
        }
        if (items2send.length === 1 && items2send[0].kind != "file") {
          items2send = items2send[0].data;
        }
        ;
        w2ui[this.name].paste(items2send, event2);
        event2.preventDefault();
      }
    }).on("keydown", function(event2) {
      ;
      w2ui[obj.name].keydown.call(w2ui[obj.name], event2);
    });
    let edataCol;
    query9(this.box).off("mousedown.mouseStart").on("mousedown.mouseStart", mouseStart);
    this.updateToolbar();
    edata.finish();
    this.last["observeResize"] = new ResizeObserver(() => {
      this.resize();
      this.scroll();
    });
    this.last["observeResize"].observe(this.box);
    return Date.now() - time;
    function mouseStart(event2) {
      if (event2.which != 1) return;
      if (obj.last.userSelect == "text") {
        obj.last.userSelect = "";
        query9(obj.box).find(".w2ui-grid-body").css("user-select", "none");
      }
      if (obj.selectType == "row" && (query9(event2.target).parents().hasClass("w2ui-head") || query9(event2.target).hasClass("w2ui-head"))) return;
      if (obj.last.move && obj.last.move.type == "expand") return;
      if (event2.altKey) {
        query9(obj.box).find(".w2ui-grid-body").css("user-select", "text");
        obj.selectNone();
        obj.last.move = { type: "text-select" };
        obj.last.userSelect = "text";
      } else {
        let tmp = event2.target;
        const pos = {
          x: event2.offsetX - 10,
          y: event2.offsetY - 10
        };
        let tmps = false;
        while (tmp) {
          if (tmp.classList && tmp.classList.contains("w2ui-grid")) break;
          if (tmp.tagName && tmp.tagName.toUpperCase() == "TD") tmps = true;
          if (tmp.tagName && tmp.tagName.toUpperCase() != "TR" && tmps == true) {
            pos.x += tmp.offsetLeft;
            pos.y += tmp.offsetTop;
          }
          tmp = tmp.parentNode;
        }
        const index = query9(event2.target).parents("tr").attr("index");
        const recid = obj.records[index]?.recid;
        if (obj.selectType == "cell" && !event2.shiftKey) {
          let column1 = parseInt(query9(event2.target).closest("td").attr("col"));
          let column2 = column1;
          if (isNaN(column1)) {
            column1 = 0;
            column2 = obj.columns.length - 1;
          }
          obj.addRange({
            name: "selection-preview",
            range: [{ recid, column: column1 }, { recid, column: column2 }],
            class: "w2ui-selection-preview"
          });
        }
        obj.last.move = {
          x: event2.screenX,
          y: event2.screenY,
          divX: 0,
          divY: 0,
          focusX: pos.x,
          focusY: pos.y,
          recid,
          column: parseInt(event2.target.tagName.toUpperCase() == "TD" ? query9(event2.target).attr("col") : query9(event2.target).parents("td").attr("col")),
          type: "select",
          ghost: false,
          start: true
        };
        if (obj.last.move.recid == null && obj.records.length > 0) {
          obj.last.move.type = "select-column";
          const column = parseInt(query9(event2.target).closest("td").attr("col"));
          const start = obj.records[0].recid;
          const end = obj.records[obj.records.length - 1].recid;
          obj.addRange({
            name: "selection-preview",
            range: [{ recid: start, column }, { recid: end, column }],
            class: "w2ui-selection-preview"
          });
        }
        const target = event2.target;
        const $input = query9(obj.box).find("#grid_" + obj.name + "_focus");
        if (obj.last.move) {
          let sLeft = obj.last.move.focusX;
          let sTop = obj.last.move.focusY;
          const $owner = query9(target).parents("table").parent();
          if ($owner.hasClass("w2ui-grid-records") || $owner.hasClass("w2ui-grid-frecords") || $owner.hasClass("w2ui-grid-columns") || $owner.hasClass("w2ui-grid-fcolumns") || $owner.hasClass("w2ui-grid-summary")) {
            sLeft = obj.last.move.focusX - query9(obj.box).find("#grid_" + obj.name + "_records").prop("scrollLeft");
            sTop = obj.last.move.focusY - query9(obj.box).find("#grid_" + obj.name + "_records").prop("scrollTop");
          }
          if (query9(target).hasClass("w2ui-grid-footer") || query9(target).parents("div.w2ui-grid-footer").length > 0) {
            sTop = query9(obj.box).find("#grid_" + obj.name + "_footer").get(0).offsetTop;
          }
          if ($owner.hasClass("w2ui-scroll-wrapper") && $owner.parent().hasClass("w2ui-toolbar")) {
            sLeft = obj.last.move.focusX - $owner.prop("scrollLeft");
          }
          $input.css({
            left: sLeft - 10,
            top: sTop
          });
        }
        setTimeout(() => {
          if (!obj.last.inEditMode) {
            if (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)) {
              target.focus();
            } else {
              if ($input.get(0) !== document.activeElement) $input.get(0)?.focus({ preventScroll: true });
            }
          }
        }, 50);
        if (!obj.multiSelect && !obj.reorderRows && obj.last.move.type == "drag") {
          delete obj.last.move;
        }
      }
      if (obj.reorderRows == true) {
        let el = event2.target;
        if (el.tagName.toUpperCase() != "TD") el = query9(el).parents("td")[0];
        if (query9(el).hasClass("w2ui-col-number") || query9(el).hasClass("w2ui-col-order")) {
          let sel = obj.getSelection();
          if (sel.length > 0 && typeof sel[0] == "object") {
            obj.select([...new Set(sel.map((r) => r.recid))]);
            sel = [...new Set(obj.getSelection().map((r) => r.recid))];
          }
          if (sel.indexOf(obj.last.move.recid) == -1) {
            obj.selectNone();
            obj.select([obj.last.move.recid]);
            sel = [obj.last.move.recid];
          }
          const new_sel = [];
          const selectExpandedChildren = (recid) => {
            const rec = obj.get(recid);
            if (rec?.w2ui?.children) {
              rec.w2ui.children.forEach((c) => {
                const child_rec = obj.get(c.recid);
                if (!child_rec) return;
                new_sel.push(c.recid);
                selectExpandedChildren(c.recid);
              });
            }
          };
          sel.forEach((recid) => selectExpandedChildren(recid));
          sel = [...sel, ...new_sel];
          obj.last.move.reorder = true;
          const eColor = query9(obj.box).find(".w2ui-even.w2ui-empty-record").css("background-color");
          const oColor = query9(obj.box).find(".w2ui-odd.w2ui-empty-record").css("background-color");
          query9(obj.box).find(".w2ui-even td").filter(":not(.w2ui-col-number)").css("background-color", eColor);
          query9(obj.box).find(".w2ui-odd td").filter(":not(.w2ui-col-number)").css("background-color", oColor);
          const mv = obj.last.move;
          const recs = query9(obj.box).find(".w2ui-grid-records");
          if (!mv["ghost"]) {
            const rows = sel.map((r) => query9(obj.box).find(`#grid_${obj.name}_rec_${r}`));
            const tmp = rows[0].parents("table").find("tr:first-child").get(0).cloneNode(true);
            mv.offsetY = event2.offsetY;
            mv.from = sel;
            mv.pos = { top: rows[0].get(0).offsetTop - 1, left: rows[rows.length - 1].get(0).offsetLeft };
            mv["ghost"] = query9(rows.map((row) => row.get(0).cloneNode(true)));
            mv["ghost"].removeAttr("id");
            mv["ghost"].find("td").css({
              "border-top": "1px solid silver",
              "border-bottom": "1px solid silver"
            });
            rows.forEach((row) => {
              row.find("td").remove();
              row.append(`<td colspan="1000"><div class="w2ui-reorder-empty" style="height: ${obj.recordHeight - 2}px"></div></td>`);
            });
            recs.append('<div id="grid_' + obj.name + '_ghost_line" style="position: absolute; z-index: 999999; pointer-events: none; width: 100%;"></div>');
            recs.append('<table id="grid_' + obj.name + '_ghost" style="position: absolute; z-index: 999998; opacity: 0.9; pointer-events: none;"></table>');
            query9(obj.box).find("#grid_" + obj.name + "_ghost").append(tmp).append(mv["ghost"]);
          }
          const ghost = query9(obj.box).find("#grid_" + obj.name + "_ghost");
          ghost.css({
            top: mv.pos.top + "px",
            left: mv.pos.left + "px"
          });
        } else {
          obj.last.move.reorder = false;
        }
      }
      query9(document).on("mousemove.w2ui-" + obj.name, mouseMove).on("mouseup.w2ui-" + obj.name, mouseStop);
      event2.stopPropagation();
    }
    function mouseMove(event2) {
      if (!event2.target.tagName) {
        return;
      }
      const mv = obj.last.move;
      if (!mv || !["select", "select-column"].includes(mv.type)) return;
      mv.divX = event2.screenX - mv.x;
      mv.divY = event2.screenY - mv.y;
      if (Math.abs(mv.divX) <= 1 && Math.abs(mv.divY) <= 1) return;
      obj.last.cancelClick = true;
      if (obj.reorderRows == true && obj.last.move.reorder) {
        const tmp = query9(event2.target).parents("tr");
        const ind2 = tmp.attr("index");
        let recid2 = obj.records[ind2]?.recid;
        if (recid2 == "-none-" || recid2 == null) recid2 = "bottom";
        if (mv.from.indexOf(recid2) == -1) {
          const row2 = query9(obj.box).find("#grid_" + obj.name + "_rec_" + recid2);
          query9(obj.box).find(".insert-before");
          row2.addClass("insert-before");
          mv.lastY = event2.screenY;
          mv.to = recid2;
          const pos = { top: row2.get(0)?.offsetTop, left: row2.get(0)?.offsetLeft };
          const ghost_line = query9(obj.box).find("#grid_" + obj.name + "_ghost_line");
          if (pos) {
            ghost_line.css({
              top: pos.top + "px",
              left: mv.pos.left + "px",
              "border-top": "2px solid #769EFC"
            });
          } else {
            ghost_line.css({
              "border-top": "2px solid transparent"
            });
          }
        }
        const ghost = query9(obj.box).find("#grid_" + obj.name + "_ghost");
        ghost.css({
          top: mv.pos.top + mv.divY + "px",
          left: mv.pos.left + "px"
        });
        return;
      }
      if (obj.selectType == "row" && mv.start && mv.recid) {
        obj.selectNone();
        mv.start = false;
      }
      const newSel = [];
      const ind = event2.target.tagName.toUpperCase() == "TR" ? query9(event2.target).attr("index") : query9(event2.target).parents("tr").attr("index");
      const recid = obj.records[ind]?.recid;
      if (recid == null) {
        if (obj.selectType == "row") return;
        if (obj.last.move && obj.last.move.type == "select") return;
        const col = parseInt(query9(event2.target).parents("td").attr("col"));
        if (isNaN(col)) {
          obj.removeRange("column-selection");
          query9(obj.box).find(".w2ui-grid-columns .w2ui-col-header, .w2ui-grid-fcolumns .w2ui-col-header").removeClass("w2ui-col-selected");
          query9(obj.box).find(".w2ui-col-number").removeClass("w2ui-row-selected");
          delete mv.colRange;
        } else {
          let newRange = col + "-" + col;
          if (mv.column < col) newRange = mv.column + "-" + col;
          if (mv.column > col) newRange = col + "-" + mv.column;
          const cols = [];
          const tmp = newRange.split("-");
          for (let ii = parseInt(tmp[0] ?? "0"); ii <= parseInt(tmp[1] ?? "0"); ii++) {
            cols.push(ii);
          }
          if (mv.colRange != newRange && mv.type == "select-column") {
            edataCol = obj.trigger("columnSelect", { target: obj.name, columns: cols });
            if (edataCol.isCancelled !== true) {
              mv.colRange = newRange;
              const start = obj.records[0].recid;
              const end = obj.records[obj.records.length - 1].recid;
              obj.addRange({
                name: "selection-preview",
                range: [{ recid: start, column: tmp[0] }, { recid: end, column: tmp[1] }],
                class: "w2ui-selection-preview"
              });
            }
          }
        }
      } else {
        let ind1 = obj.get(mv.recid, true);
        if (ind1 == null || obj.records[ind1] && obj.records[ind1].recid != mv.recid) return;
        let ind2 = obj.get(recid, true);
        if (ind2 == null) return;
        let col1 = parseInt(mv.column);
        let col2 = parseInt(event2.target.tagName.toUpperCase() == "TD" ? query9(event2.target).attr("col") : query9(event2.target).parents("td").attr("col"));
        if (isNaN(col1) && isNaN(col2)) {
          col1 = 0;
          col2 = obj.columns.length - 1;
        }
        if (ind1 > ind2) {
          const tmp2 = ind1;
          ind1 = ind2;
          ind2 = tmp2;
        }
        const tmp = "ind1:" + ind1 + ",ind2;" + ind2 + ",col1:" + col1 + ",col2:" + col2;
        if (mv.range == tmp) return;
        mv.range = tmp;
        for (let i = ind1; i <= ind2; i++) {
          if (obj.last.searchIds.length > 0 && obj.last.searchIds.indexOf(i) == -1) continue;
          if (obj.selectType != "row") {
            if (col1 > col2) {
              const tmp2 = col1;
              col1 = col2;
              col2 = tmp2;
            }
            for (let c = col1; c <= col2; c++) {
              if (obj.columns[c].hidden) continue;
              newSel.push({ recid: obj.records[i].recid, column: c });
            }
          } else {
            newSel.push(obj.records[i].recid);
          }
        }
        if (obj.selectType != "row") {
          const start = newSel[0];
          const end = newSel[newSel.length - 1];
          obj.addRange({
            name: "selection-preview",
            range: [{ recid: start?.recid, column: start?.column }, { recid: end?.recid, column: end?.column }],
            class: "w2ui-selection-preview"
          });
          mv.newRange = newSel;
        } else {
          if (obj.multiSelect) {
            const sel = obj.getSelection();
            for (let ns = 0; ns < newSel.length; ns++) {
              if (sel.indexOf(newSel[ns]) == -1) obj.select(newSel[ns]);
            }
            for (let s = 0; s < sel.length; s++) {
              if (newSel.indexOf(sel[s]) == -1) obj.unselect(sel[s]);
            }
          }
        }
      }
    }
    function mouseStop(event2) {
      const mv = obj.last.move;
      setTimeout(() => {
        obj.last.cancelClick = null;
      }, 1);
      if (query9(event2.target).parents().hasClass(".w2ui-head") || query9(event2.target).hasClass(".w2ui-head")) return;
      obj.removeRange("selection-preview");
      if (mv && ["select", "select-column"].includes(mv.type)) {
        if (mv.colRange != null && edataCol.isCancelled !== true) {
          const tmp = mv.colRange.split("-");
          const sel = [];
          for (let i = 0; i < obj.records.length; i++) {
            const cols = [];
            for (let j = parseInt(tmp[0]); j <= parseInt(tmp[1]); j++) cols.push(j);
            sel.push({ recid: obj.records[i].recid, column: cols });
          }
          edataCol.finish();
          obj.selectNone(true);
          obj.select(sel);
        } else if (mv.newRange != null) {
          obj.selectNone(true);
          obj.select(...mv.newRange);
        }
        if (obj.reorderRows == true && obj.last.move.reorder) {
          if (mv.to != null) {
            const edata2 = obj.trigger("reorderRow", { target: obj.name, recid: mv.from, moveBefore: mv.to });
            if (edata2.isCancelled === true) {
              resetRowReorder();
              delete obj.last.move;
              return;
            }
            const ind1 = mv.from.map((recid) => obj.get(recid, true));
            let ind2 = obj.get(mv.to, true);
            if (mv.to == "bottom") ind2 = obj.records.length;
            const tmp = ind1.map((ind) => obj.records[ind]);
            if (ind1 != null && ind2 != null) {
              obj.records.splice(ind1[0], ind1.length);
              if (ind1[0] > ind2) {
                obj.records.splice(ind2, 0, ...tmp);
              } else {
                obj.records.splice(ind2 - 1, 0, ...tmp);
              }
            }
            obj.sortData = [];
            query9(obj.box).find(`#grid_${obj.name}_columns .w2ui-col-header`).removeClass("w2ui-col-sorted");
            resetRowReorder();
            obj.selectNone(true);
            obj.select(mv.from);
            edata2.finish();
          } else {
            resetRowReorder();
          }
        }
      }
      delete obj.last.move;
      query9(document).off(".w2ui-" + obj.name);
    }
    function resetRowReorder() {
      query9(obj.box).find(`#grid_${obj.name}_ghost`).remove();
      query9(obj.box).find(`#grid_${obj.name}_ghost_line`).remove();
      obj.refresh();
      delete obj.last.move;
    }
  }
  unmount() {
    super.unmount();
    this.toolbar?.unmount();
    this.last["observeResize"]?.disconnect();
  }
  destroy() {
    const edata = this.trigger("destroy", { target: this.name });
    if (edata.isCancelled === true) return;
    this.toolbar?.destroy?.();
    if (query9(this.box).find(`#grid_${this.name}_body`).length > 0) {
      this.unmount();
    }
    delete w2ui[this.name];
    edata.finish();
  }
  // ===========================================
  // --- Internal Functions
  initColumnOnOff() {
    const items = [
      { id: "line-numbers", text: "Line #", checked: this.show.lineNumbers }
    ];
    for (let c = 0; c < this.columns.length; c++) {
      const col = this.columns[c];
      let text = col.text;
      if (col.hideable === false) continue;
      if (!text && col.tooltip) text = col.tooltip;
      if (!text) text = "- column " + (c + 1) + " -";
      items.push({ id: col.field, text: w2utils.stripTags(text), checked: !col.hidden });
    }
    const url = this.url?.get ?? this.url;
    if (url && this.show.skipRecords || this.show.saveRestoreState) {
      items.push({ text: "--" });
    }
    if (this.show.skipRecords) {
      const skip = w2utils.lang("Skip") + `<input id="${this.name}_skip" type="text" class="w2ui-input w2ui-grid-skip" value="${this.offset}">` + w2utils.lang("records");
      items.push({ id: "w2ui-skip", text: skip, group: false, icon: "w2ui-icon-empty" });
    }
    if (this.show.saveRestoreState) {
      items.push(
        { id: "w2ui-stateSave", text: w2utils.lang("Save Grid State"), icon: "w2ui-icon-empty", group: false },
        { id: "w2ui-stateReset", text: w2utils.lang("Restore Default State"), icon: "w2ui-icon-empty", group: false }
      );
    }
    const selected = [];
    items.forEach((item) => {
      item.text = w2utils.lang(item.text);
      if (item.checked) selected.push(item.id);
    });
    this.toolbar.set("w2ui-column-on-off", { selected, items });
    return items;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initColumnDrag(_box) {
    if (this.columnGroups && this.columnGroups.length) {
      throw "Draggable columns are not currently supported with column groups.";
    }
    const self = this;
    let dragData = {
      pressed: false,
      targetPos: null,
      columnHead: null
    };
    const hasInvalidClass = (target, lastColumn) => {
      const iClass = ["w2ui-col-number", "w2ui-col-expand", "w2ui-col-select"];
      if (lastColumn !== true) iClass.push("w2ui-head-last");
      for (let i = 0; i < iClass.length; i++) {
        if (query9(target).closest(".w2ui-head").hasClass(iClass[i])) {
          return true;
        }
      }
      return false;
    };
    query9(self.box).off(".colDrag").on("mousedown.colDrag", dragColStart);
    function dragColStart(event2) {
      if (dragData.pressed || dragData["numberPreColumnsPresent"] === 0 || event2.button !== 0) return;
      const preColHeadersSelector = ".w2ui-head.w2ui-col-number, .w2ui-head.w2ui-col-expand, .w2ui-head.w2ui-col-select";
      if (!query9(event2.target).parents().hasClass("w2ui-head") || hasInvalidClass(event2.target)) return;
      dragData.pressed = true;
      dragData["initialX"] = event2.pageX;
      dragData["initialY"] = event2.pageY;
      dragData["numberPreColumnsPresent"] = query9(self.box).find(preColHeadersSelector).length;
      const origColumn = dragData.columnHead = query9(event2.target).closest(".w2ui-head");
      const origColumnNumber = dragData["originalPos"] = parseInt(origColumn.attr("col"), 10);
      const edata = self.trigger("columnDragStart", { originalEvent: event2, origColumnNumber, target: origColumn[0] });
      if (edata.isCancelled === true) return false;
      const columns = dragData["columns"] = query9(self.box).find(".w2ui-head:not(.w2ui-head-last)");
      query9(document).on("mouseup.colDrag", dragColEnd);
      query9(document).on("mousemove.colDrag", dragColOver);
      const col = self.columns[dragData["originalPos"]];
      const colText = w2utils.lang(typeof col.text == "function" ? col.text(col) : col.text);
      dragData["ghost"] = query.html(`<span col="${dragData["originalPos"]}">${colText}</span>`)[0];
      query9(document.body).append(dragData["ghost"]);
      query9(dragData["ghost"]).css({
        display: "none",
        left: event2.pageX,
        top: event2.pageY,
        opacity: 1,
        margin: "3px 0 0 20px",
        padding: "3px",
        "background-color": "white",
        position: "fixed",
        "z-index": 999999
      }).addClass(".w2ui-grid-ghost");
      dragData["offsets"] = [];
      for (let i = 0, l = columns.length; i < l; i++) {
        const rect = columns[i].getBoundingClientRect();
        dragData["offsets"].push(rect.left);
      }
      edata.finish();
    }
    function dragColOver(event2) {
      if (!dragData.pressed || !dragData.columnHead) return;
      const cursorX = event2.pageX;
      const cursorY = event2.pageY;
      if (!hasInvalidClass(event2.target, true)) {
        markIntersection(event2);
      }
      trackGhost(cursorX, cursorY);
    }
    function dragColEnd(event2) {
      if (!dragData.pressed || !dragData.columnHead) return;
      dragData.pressed = false;
      let target;
      const finish = () => {
        const ghosts = query9(self.box).find(".w2ui-grid-ghost");
        query9(self.box).find(".w2ui-intersection-marker").hide();
        query9(dragData["ghost"]).remove();
        ghosts.remove();
        query9(document).off(".colDrag");
        dragData = {};
      };
      if (event2.pageX == dragData["initialX"] && event2.pageY == dragData["initialY"]) {
        self.columnClick(self.columns[dragData["originalPos"]].field, event2);
        finish();
        return;
      }
      const edata = self.trigger("columnDragEnd", { originalEvent: event2, target: dragData.columnHead[0], dragData });
      if (edata.isCancelled === true) return false;
      const selected = self.columns[dragData["originalPos"]];
      const columnConfig = self.columns;
      if (dragData["originalPos"] != dragData.targetPos && dragData.targetPos != null) {
        columnConfig.splice(dragData.targetPos, 0, w2utils.clone(selected));
        columnConfig.splice(columnConfig.indexOf(selected), 1);
      }
      finish();
      self.refresh();
      edata.finish({ targetColumn: (target ?? 1) - 1 });
    }
    function markIntersection(event2) {
      if (query9(event2.target).closest("td").length == 0) {
        return;
      }
      const td = query9(event2.target).closest("td");
      const newPos = td.hasClass("w2ui-head-last") ? self.columns.length : parseInt(td.attr("col"));
      if (dragData.targetPos != newPos) {
        const rect1 = query9(self.box).find(".w2ui-grid-body").get(0).getBoundingClientRect();
        const rect2 = query9(event2.target).closest("td").get(0).getBoundingClientRect();
        query9(self.box).find(".w2ui-intersection-marker").show().css({
          left: rect2.left - rect1.left + "px",
          height: rect2.height + "px"
        });
        dragData.targetPos = newPos;
      }
      return;
    }
    function trackGhost(cursorX, cursorY) {
      query9(dragData["ghost"]).css({
        left: cursorX - 10 + "px",
        top: cursorY - 10 + "px"
      }).show();
    }
    return {
      remove() {
        query9(self.box).off(".colDrag");
        self.last.columnDrag = false;
      }
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnOnOff(event2, field) {
    const edata = this.trigger("columnOnOff", { target: this.name, field, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    const rows = this.find({ "w2ui.expanded": true }, true);
    for (let r = 0; r < rows.length; r++) {
      const tmp = this.records[r].w2ui;
      if (tmp && !Array.isArray(tmp.children)) {
        this.records[r].w2ui.expanded = false;
      }
    }
    if (field == "line-numbers") {
      this.show.lineNumbers = !this.show.lineNumbers;
      this.refresh();
    } else {
      const col = this.getColumn(field);
      if (col != null && col.hidden) {
        this.showColumn(col.field);
      } else if (col != null) {
        this.hideColumn(col.field);
      }
    }
    edata.finish();
  }
  initToolbar() {
    if (this.toolbar.render != null) {
      return;
    }
    let tb_items = this.toolbar.items || [];
    this.toolbar.items = [];
    this.toolbar = new w2toolbar(w2utils.extend({}, this.toolbar, { name: this.name + "_toolbar", owner: this }));
    if (this.show.toolbarReload) {
      this.toolbar.items.push(w2utils.extend({}, this.buttons["reload"]));
    }
    if (this.show.toolbarColumns) {
      this.toolbar.items.push(w2utils.extend({}, this.buttons["columns"]));
    }
    if (this.show.toolbarSearch) {
      const html = `
                <div class="w2ui-grid-search-input">
                    ${this.buttons["search"].html}
                    <div id="grid_${this.name}_search_name" class="w2ui-grid-search-name">
                        <span class="name-icon w2ui-icon-search"></span>
                        <span class="name-text"></span>
                        <span class="name-cross w2ui-action" data-click="searchReset">x</span>
                    </div>
                    <input type="text" id="grid_${this.name}_search_all" class="w2ui-search-all" tabindex="-1"
                        autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                        placeholder="${w2utils.lang(this.last.label, true)}" value="${this.last.search}"
                        data-focus="searchSuggest" data-click="stop"
                    >
                    <div class="w2ui-search-drop w2ui-action" data-click="searchOpen"
                            style="${this.multiSearch ? "" : "display: none"}">
                        <span class="w2ui-icon-drop"></span>
                    </div>
                </div>`;
      this.toolbar.items.push({
        id: "w2ui-search",
        type: "html",
        html,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onRefresh: async (event2) => {
          await event2.complete;
          const input = query9(this.box).find(`#grid_${this.name}_search_all`);
          w2utils.bindEvents(query9(this.box).find(`#grid_${this.name}_search_all, .w2ui-action`), this);
          const slowSearch = w2utils.debounce((event3) => {
            const val = event3.target.value;
            if (this.liveSearch && this.last["liveText"] != val) {
              this.last["liveText"] = val;
              this.search(this.last.field, val);
            }
          }, 250);
          input.on("blur", () => {
            this.last["liveText"] = "";
          }).on("keyup", (event3) => {
            switch (event3.keyCode) {
              case 40: {
                this.searchSuggest(true);
                break;
              }
              case 38: {
                this.searchSuggest(true, true);
                break;
              }
              case 13: {
                w2menu3.hide(this.name + "-search-suggest");
                this.search(this.last.field, event3.target.value);
                break;
              }
              default: {
                slowSearch(event3);
                break;
              }
            }
          });
        }
      });
    }
    if (Array.isArray(tb_items)) {
      const ids = tb_items.map((item) => item.id);
      if (this.show.toolbarAdd && !ids.includes(this.buttons["add"].id)) {
        this.toolbar.items.push(w2utils.extend({}, this.buttons["add"]));
      }
      if (this.show.toolbarEdit && !ids.includes(this.buttons["edit"].id)) {
        this.toolbar.items.push(w2utils.extend({}, this.buttons["edit"]));
      }
      if (this.show.toolbarDelete && !ids.includes(this.buttons["delete"].id)) {
        this.toolbar.items.push(w2utils.extend({}, this.buttons["delete"]));
      }
      if (this.show.toolbarSave && !ids.includes(this.buttons["save"].id)) {
        if (this.show.toolbarAdd || this.show.toolbarDelete || this.show.toolbarEdit) {
          this.toolbar.items.push({ type: "break", id: "w2ui-break2" });
        }
        this.toolbar.items.push(w2utils.extend({}, this.buttons["save"]));
      }
      tb_items = tb_items.map((item) => this.buttons[item.name] ? w2utils.extend({}, this.buttons[item.name], item) : item);
    }
    this.toolbar.items.push(...tb_items);
    this.toolbar.on("click", (event2) => {
      const edata = this.trigger("toolbar", { target: event2.target, originalEvent: event2 });
      if (edata.isCancelled === true) return;
      let edata2;
      switch (event2.detail.item.id) {
        case "w2ui-reload":
          edata2 = this.trigger("reload", { target: this.name });
          if (edata2.isCancelled === true) return false;
          this.reload();
          edata2.finish();
          break;
        case "w2ui-column-on-off":
          if (event2.detail.subItem) {
            const id = event2.detail.subItem.id;
            if (["w2ui-stateSave", "w2ui-stateReset"].includes(id)) {
              this[id.substring(5)]();
            } else if (id == "w2ui-skip") {
            } else {
              this.columnOnOff(event2, event2.detail.subItem.id);
            }
          } else {
            this.initColumnOnOff();
            setTimeout(() => {
              query9(`#w2overlay-${this.name}_toolbar-drop .w2ui-grid-skip`).off(".w2ui-grid").on("click.w2ui-grid", (evt) => {
                evt.stopPropagation();
              }).on("keypress", (evt) => {
                if (evt.keyCode == 13) {
                  this.skip(evt.target.value);
                  this.toolbar.click("w2ui-column-on-off");
                }
              });
            }, 100);
          }
          break;
        case "w2ui-add":
          edata2 = this.trigger("add", { target: this.name, recid: null });
          if (edata2.isCancelled === true) return false;
          edata2.finish();
          break;
        case "w2ui-edit": {
          const sel = this.getSelection();
          let recid = null;
          if (sel.length == 1) recid = sel[0];
          edata2 = this.trigger("edit", { target: this.name, recid });
          if (edata2.isCancelled === true) return false;
          edata2.finish();
          break;
        }
        case "w2ui-delete":
          this.delete();
          break;
        case "w2ui-save":
          this.save();
          break;
      }
      edata.finish();
    });
    this.toolbar.on("refresh", (event2) => {
      if (event2.target == "w2ui-search") {
        const sd = this.searchData;
        setTimeout(() => {
          this.searchInitInput(this.last.field, sd.length == 1 ? sd[0].value : null);
        }, 1);
      }
    });
  }
  initResize() {
    const obj = this;
    query9(this.box).find(".w2ui-resizer").off(".grid-col-resize").on("click.grid-col-resize", function(event2) {
      event2.stopPropagation();
      event2.preventDefault();
    }).on("mousedown.grid-col-resize", function(event2) {
      const mev = event2;
      if (!mev) return;
      obj.last.colResizing = true;
      obj.last.tmp = {
        x: mev.screenX,
        y: mev.screenY,
        gx: mev.screenX,
        gy: mev.screenY,
        col: parseInt(query9(this).attr("name"))
        // 'this' is the DOM element
      };
      obj.last.tmp.tds = query9(obj.box).find("#grid_" + obj.name + '_body table tr:first-child td[col="' + obj.last.tmp.col + '"]');
      mev.stopPropagation();
      mev.preventDefault();
      for (let c = 0; c < obj.columns.length; c++) {
        if (obj.columns[c].hidden) continue;
        if (obj.columns[c].sizeOriginal == null) obj.columns[c].sizeOriginal = obj.columns[c].size ?? "";
        obj.columns[c].size = obj.columns[c].sizeCalculated ?? "";
      }
      const edata = obj.trigger("columnResize", {
        target: obj.name,
        resizeBy: 0,
        originalEvent: mev,
        column: obj.last.tmp.col,
        field: obj.columns[obj.last.tmp.col].field
      });
      let timer;
      const mouseMove = function(event3) {
        if (obj.last.colResizing != true) return;
        if (!event3) event3 = window.event;
        const edata2 = obj.trigger("columnResizeMove", w2utils.extend(edata.detail, { resizeBy: event3.screenX - obj.last.tmp.gx, originalEvent: event3 }));
        if (edata2.isCancelled === true) {
          return;
        }
        obj.last.tmp.x = event3.screenX - obj.last.tmp.x;
        obj.last.tmp.y = event3.screenY - obj.last.tmp.y;
        const newWidth = parseInt(String(obj.columns[obj.last.tmp.col].size ?? 0)) + obj.last.tmp.x + "px";
        obj.columns[obj.last.tmp.col].size = newWidth;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
          obj.resizeRecords();
          obj.scroll();
        }, 100);
        obj.last.tmp.tds.css({ width: newWidth });
        obj.last.tmp.x = event3.screenX;
        obj.last.tmp.y = event3.screenY;
        edata2.finish();
      };
      const mouseUp = function(event3) {
        query9(document).off(".grid-col-resize");
        obj.resizeRecords();
        obj.scroll();
        edata.finish({ originalEvent: event3 });
        setTimeout(() => {
          obj.last.colResizing = false;
        }, 1);
      };
      query9(document).off(".grid-col-resize").on("mousemove.grid-col-resize", mouseMove).on("mouseup.grid-col-resize", mouseUp);
    }).on("dblclick.grid-col-resize", function(event2) {
      const ind = parseInt(query9(this).attr("name"));
      obj.columnAutoSize(ind);
      event2.stopPropagation();
      event2.preventDefault();
    }).each((el) => {
      const td = query9(el).get(0).parentNode;
      query9(el).css({
        "height": td.clientHeight + "px",
        "margin-left": td.clientWidth - 3 + "px"
      });
    });
  }
  resizeBoxes() {
    const header = query9(this.box).find(`#grid_${this.name}_header`);
    const toolbar = query9(this.box).find(`#grid_${this.name}_toolbar`);
    const fsummary = query9(this.box).find(`#grid_${this.name}_fsummary`);
    const summary = query9(this.box).find(`#grid_${this.name}_summary`);
    const footer = query9(this.box).find(`#grid_${this.name}_footer`);
    const body = query9(this.box).find(`#grid_${this.name}_body`);
    if (this.show.header) {
      header.css({
        top: "0px",
        left: "0px",
        right: "0px"
      });
    }
    if (this.show.toolbar) {
      toolbar.css({
        top: 0 + (this.show.header ? w2utils.getSize(header, "height") : 0) + "px",
        left: "0px",
        right: "0px"
      });
    }
    if (this.summary.length > 0) {
      fsummary.css({
        bottom: 0 + (this.show.footer ? w2utils.getSize(footer, "height") : 0) + "px"
      });
      summary.css({
        bottom: 0 + (this.show.footer ? w2utils.getSize(footer, "height") : 0) + "px",
        right: "0px"
      });
    }
    if (this.show.footer) {
      footer.css({
        bottom: "0px",
        left: "0px",
        right: "0px"
      });
    }
    body.css({
      top: 0 + (this.show.header ? w2utils.getSize(header, "height") : 0) + (this.show.toolbar ? w2utils.getSize(toolbar, "height") : 0) + "px",
      bottom: 0 + (this.show.footer ? w2utils.getSize(footer, "height") : 0) + (this.summary.length > 0 ? w2utils.getSize(summary, "height") : 0) + "px",
      left: "0px",
      right: "0px"
    });
  }
  resizeRecords() {
    const obj = this;
    query9(this.box).find(".w2ui-empty-record").remove();
    const box = query9(this.box);
    const grid = query9(this.box).find(":scope > div.w2ui-grid-box");
    const header = query9(this.box).find(`#grid_${this.name}_header`);
    const toolbar = query9(this.box).find(`#grid_${this.name}_toolbar`);
    const summary = query9(this.box).find(`#grid_${this.name}_summary`);
    const fsummary = query9(this.box).find(`#grid_${this.name}_fsummary`);
    const footer = query9(this.box).find(`#grid_${this.name}_footer`);
    const body = query9(this.box).find(`#grid_${this.name}_body`);
    const columns = query9(this.box).find(`#grid_${this.name}_columns`);
    const fcolumns = query9(this.box).find(`#grid_${this.name}_fcolumns`);
    const records = query9(this.box).find(`#grid_${this.name}_records`);
    const frecords = query9(this.box).find(`#grid_${this.name}_frecords`);
    const scroll1 = query9(this.box).find(`#grid_${this.name}_scroll1`);
    let lineNumberWidth = String(this.total).length * 8 + 10;
    if (lineNumberWidth < 34) lineNumberWidth = 34;
    if (this.lineNumberWidth != null) lineNumberWidth = this.lineNumberWidth;
    let bodyOverflowX = false;
    let bodyOverflowY = false;
    let sWidth = 0;
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].frozen || this.columns[i].hidden) continue;
      const cSize = parseInt(this.columns[i].sizeCalculated ? this.columns[i].sizeCalculated : String(this.columns[i].size ?? 0));
      sWidth += cSize;
    }
    if (records[0]?.clientWidth < sWidth) bodyOverflowX = true;
    if (body[0]?.clientHeight - (columns[0]?.clientHeight ?? 0) < (query9(records).find(":scope > table")[0]?.clientHeight ?? 0) + (bodyOverflowX ? w2utils.scrollBarSize() : 0)) {
      bodyOverflowY = true;
    }
    if (!this.fixedBody) {
      const bodyHeight = w2utils.getSize(columns, "height") + w2utils.getSize(query9(this.box).find("#grid_" + this.name + "_records table"), "height") + (bodyOverflowX ? w2utils.scrollBarSize() : 0);
      const calculatedHeight = bodyHeight + (this.show.header ? w2utils.getSize(header, "height") : 0) + (this.show.toolbar ? w2utils.getSize(toolbar, "height") : 0) + (summary.css("display") != "none" ? w2utils.getSize(summary, "height") : 0) + (this.show.footer ? w2utils.getSize(footer, "height") : 0);
      grid.css("height", calculatedHeight + "px");
      body.css("height", bodyHeight + "px");
      box.css("height", w2utils.getSize(grid, "height") + "px");
    } else {
      const calculatedHeight = grid[0]?.clientHeight - (this.show.header ? w2utils.getSize(header, "height") : 0) - (this.show.toolbar ? w2utils.getSize(toolbar, "height") : 0) - (summary.css("display") != "none" ? w2utils.getSize(summary, "height") : 0) - (this.show.footer ? w2utils.getSize(footer, "height") : 0);
      body.css("height", calculatedHeight + "px");
    }
    let buffered = this.records.length;
    const url = this.url?.get ?? this.url;
    if (this.searchData.length != 0 && !url) buffered = this.last.searchIds.length;
    if (!this.fixedBody) {
      bodyOverflowY = false;
    }
    if (bodyOverflowX || bodyOverflowY) {
      columns.find(":scope > table > tbody > tr:nth-child(1) td.w2ui-head-last").css("width", w2utils.scrollBarSize() + "px").show();
      records.css({
        top: (this.columnGroups.length > 0 && this.show.columns ? 1 : 0) + w2utils.getSize(columns, "height") + "px",
        "-webkit-overflow-scrolling": "touch",
        "overflow-x": bodyOverflowX ? "auto" : "hidden",
        "overflow-y": bodyOverflowY ? "auto" : "hidden"
      });
    } else {
      columns.find(":scope > table > tbody > tr:nth-child(1) td.w2ui-head-last").hide();
      records.css({
        top: (this.columnGroups.length > 0 && this.show.columns ? 1 : 0) + w2utils.getSize(columns, "height") + "px",
        overflow: "hidden"
      });
      if (records.length > 0) {
        this.last.vscroll.scrollTop = 0;
        this.last.vscroll.scrollLeft = 0;
      }
    }
    if (bodyOverflowX) {
      frecords.css("margin-bottom", w2utils.scrollBarSize() + "px");
      scroll1.show();
    } else {
      frecords.css("margin-bottom", 0);
      scroll1.hide();
    }
    frecords.css({ overflow: "hidden", top: records.css("top") });
    if (this.show.emptyRecords && !bodyOverflowY) {
      let max = Math.floor((records[0]?.clientHeight ?? 0) / this.recordHeight) - 1;
      let leftover = 0;
      if (records[0]) leftover = records[0].scrollHeight - max * this.recordHeight;
      if (leftover >= this.recordHeight) {
        leftover -= this.recordHeight;
        max++;
      }
      if (this.fixedBody) {
        for (let di = buffered; di < max; di++) {
          addEmptyRow(di, this.recordHeight, this);
        }
        addEmptyRow(max, leftover, this);
      }
    }
    function addEmptyRow(row, height, grid2) {
      let html1 = "";
      let html2 = "";
      let htmlp = "";
      html1 += '<tr class="' + (row % 2 ? "w2ui-even" : "w2ui-odd") + ' w2ui-empty-record" recid="-none-" style="height: ' + height + 'px">';
      html2 += '<tr class="' + (row % 2 ? "w2ui-even" : "w2ui-odd") + ' w2ui-empty-record" recid="-none-" style="height: ' + height + 'px">';
      if (grid2.show.lineNumbers) html1 += '<td class="w2ui-col-number"></td>';
      if (grid2.show.selectColumn) html1 += '<td class="w2ui-grid-data w2ui-col-select"></td>';
      if (grid2.show.expandColumn) html1 += '<td class="w2ui-grid-data w2ui-col-expand"></td>';
      html2 += '<td class="w2ui-grid-data-spacer" col="start" style="border-right: 0"></td>';
      if (grid2.reorderRows) html2 += '<td class="w2ui-grid-data w2ui-col-order" col="order"></td>';
      for (let j = 0; j < grid2.columns.length; j++) {
        const col = grid2.columns[j];
        if ((col.hidden || j < grid2.last.vscroll.colIndStart || j > grid2.last.vscroll.colIndEnd) && !col.frozen) continue;
        htmlp = '<td class="w2ui-grid-data" ' + (col.attr != null ? col.attr : "") + ' col="' + j + '"></td>';
        if (col.frozen) html1 += htmlp;
        else html2 += htmlp;
      }
      html1 += '<td class="w2ui-grid-data-last"></td> </tr>';
      html2 += '<td class="w2ui-grid-data-last" col="end"></td> </tr>';
      query9(grid2.box).find("#grid_" + grid2.name + "_frecords > table").append(html1);
      query9(grid2.box).find("#grid_" + grid2.name + "_records > table").append(html2);
    }
    let width_box, percent;
    if (body.length > 0) {
      let width_max = parseInt(body[0].clientWidth) - (bodyOverflowY ? w2utils.scrollBarSize() : 0) - (this.show.lineNumbers ? lineNumberWidth : 0) - (this.reorderRows ? 26 : 0) - (this.show.selectColumn ? 26 : 0) - (this.show.expandColumn ? 26 : 0) - 1;
      width_box = width_max;
      percent = 0;
      let restart = false;
      for (let i = 0; i < this.columns.length; i++) {
        const col = this.columns[i];
        if ((col.gridMinWidth ?? 0) > 0) {
          if ((col.gridMinWidth ?? 0) > width_box && col.hidden !== true) {
            col.hidden = true;
            restart = true;
          }
          if ((col.gridMinWidth ?? 0) < width_box && col.hidden === true) {
            col.hidden = false;
            restart = true;
          }
        }
      }
      if (restart === true) {
        this.refresh();
        return;
      }
      for (let i = 0; i < this.columns.length; i++) {
        const col = this.columns[i];
        if (col.hidden) continue;
        const sizeStr = String(col.size ?? 0);
        if (sizeStr.substr(sizeStr.length - 2).toLowerCase() == "px") {
          width_max -= parseFloat(sizeStr);
          col.sizeCalculated = sizeStr;
          col.sizeType = "px";
        } else {
          percent += parseFloat(sizeStr);
          col.sizeType = "%";
          delete col["sizeCorrected"];
        }
      }
      if (percent != 100 && percent > 0) {
        for (let i = 0; i < this.columns.length; i++) {
          const col = this.columns[i];
          if (col.hidden) continue;
          if (col.sizeType == "%") {
            col["sizeCorrected"] = Math.round(parseFloat(String(col.size ?? 0)) * 100 * 100 / percent) / 100 + "%";
          }
        }
      }
      for (let i = 0; i < this.columns.length; i++) {
        const col = this.columns[i];
        if (col.hidden) continue;
        if (col.sizeType == "%") {
          if (col["sizeCorrected"] != null) {
            col.sizeCalculated = Math.floor(width_max * parseFloat(String(col["sizeCorrected"])) / 100) - 1 + "px";
          } else {
            col.sizeCalculated = Math.floor(width_max * parseFloat(String(col.size ?? 0)) / 100) - 1 + "px";
          }
        }
      }
    }
    let width_cols = 0;
    for (let i = 0; i < this.columns.length; i++) {
      const col = this.columns[i];
      if (col.hidden) continue;
      if (col.min == null) col.min = 20;
      if (parseInt(col.sizeCalculated ?? "0") < col.min) col.sizeCalculated = col.min + "px";
      if (col.max != null && parseInt(col.sizeCalculated ?? "0") > col.max) col.sizeCalculated = col.max + "px";
      width_cols += parseInt(col.sizeCalculated ?? "0");
    }
    let width_diff = parseInt(width_box) - width_cols;
    if (width_diff > 0 && percent > 0) {
      let i = 0;
      while (true) {
        const col = this.columns[i];
        if (col == null) {
          i = 0;
          continue;
        }
        if (col.hidden || col.sizeType == "px") {
          i++;
          continue;
        }
        col.sizeCalculated = parseInt(col.sizeCalculated ?? "0") + 1 + "px";
        width_diff--;
        if (width_diff === 0) break;
        i++;
      }
    } else if (width_diff > 0) {
      columns.find(":scope > table > tbody > tr:nth-child(1) td.w2ui-head-last").css("width", w2utils.scrollBarSize() + "px").show();
    }
    let fwidth = 1;
    if (this.show.lineNumbers) fwidth += lineNumberWidth;
    if (this.show.selectColumn) fwidth += 26;
    if (this.show.expandColumn) fwidth += 26;
    for (let i = 0; i < this.columns.length; i++) {
      if (this.columns[i].hidden) continue;
      if (this.columns[i].frozen) fwidth += parseInt(this.columns[i].sizeCalculated ?? "0");
    }
    fcolumns.css("width", fwidth + "px");
    frecords.css("width", fwidth + "px");
    fsummary.css("width", fwidth + "px");
    scroll1.css("width", fwidth + "px");
    columns.css({ left: fwidth + "px", "padding-left": "0.5px" });
    records.css({ left: fwidth + "px" });
    summary.css({ left: fwidth + "px" });
    columns.find(":scope > table > tbody > tr:nth-child(1) td").add(fcolumns.find(":scope > table > tbody > tr:nth-child(1) td")).each((el) => {
      if (query9(el).hasClass("w2ui-col-number")) {
        query9(el).css("width", lineNumberWidth + "px");
      }
      const ind = query9(el).attr("col");
      if (ind != null) {
        if (ind == "start") {
          let width = 0;
          for (let i = 0; i < (obj.last.vscroll.colIndStart ?? 0); i++) {
            if (!obj.columns[i] || obj.columns[i].frozen || obj.columns[i].hidden) continue;
            width += parseInt(obj.columns[i].sizeCalculated ?? "0");
          }
          query9(el).css("width", width + "px");
        }
        if (obj.columns[ind]) query9(el).css("width", obj.columns[ind].sizeCalculated ?? "");
      }
      if (query9(el).hasClass("w2ui-head-last")) {
        if ((obj.last.vscroll.colIndEnd ?? 0) + 1 < obj.columns.length) {
          let width = 0;
          for (let i = (obj.last.vscroll.colIndEnd ?? 0) + 1; i < obj.columns.length; i++) {
            if (!obj.columns[i] || obj.columns[i].frozen || obj.columns[i].hidden) continue;
            width += parseInt(obj.columns[i].sizeCalculated ?? "0");
          }
          query9(el).css("width", width + "px");
        } else {
          query9(el).css("width", w2utils.scrollBarSize() + (width_diff > 0 && percent === 0 ? width_diff : 0) + "px");
        }
      }
    });
    if (columns.find(":scope > table > tbody > tr").length == 3) {
      columns.find(":scope > table > tbody > tr:nth-child(1) td").add(fcolumns.find(":scope > table > tbody > tr:nth-child(1) td")).html("").css({
        "height": "0",
        "border": "0",
        "padding": "0",
        "margin": "0"
      });
    }
    records.find(":scope > table > tbody > tr:nth-child(1) td").add(frecords.find(":scope > table > tbody > tr:nth-child(1) td")).each((el) => {
      if (query9(el).hasClass("w2ui-col-number")) {
        query9(el).css("width", lineNumberWidth + "px");
      }
      const ind = query9(el).attr("col");
      if (ind != null) {
        if (ind == "start") {
          let width = 0;
          for (let i = 0; i < (obj.last.vscroll.colIndStart ?? 0); i++) {
            if (!obj.columns[i] || obj.columns[i].frozen || obj.columns[i].hidden) continue;
            width += parseInt(obj.columns[i].sizeCalculated ?? "0");
          }
          query9(el).css("width", width + "px");
        }
        if (obj.columns[ind]) query9(el).css("width", obj.columns[ind].sizeCalculated ?? "");
      }
      if (query9(el).hasClass("w2ui-grid-data-last") && query9(el).parents(".w2ui-grid-frecords").length === 0) {
        if ((obj.last.vscroll.colIndEnd ?? 0) + 1 < obj.columns.length) {
          let width = 0;
          for (let i = (obj.last.vscroll.colIndEnd ?? 0) + 1; i < obj.columns.length; i++) {
            if (!obj.columns[i] || obj.columns[i].frozen || obj.columns[i].hidden) continue;
            width += parseInt(obj.columns[i].sizeCalculated ?? "0");
          }
          query9(el).css("width", width + "px");
        } else {
          query9(el).css("width", (width_diff > 0 && percent === 0 ? width_diff : 0) + "px");
        }
      }
    });
    summary.find(":scope > table > tbody > tr:nth-child(1) td").add(fsummary.find(":scope > table > tbody > tr:nth-child(1) td")).each((el) => {
      if (query9(el).hasClass("w2ui-col-number")) {
        query9(el).css("width", lineNumberWidth + "px");
      }
      const ind = query9(el).attr("col");
      if (ind != null) {
        if (ind == "start") {
          let width = 0;
          for (let i = 0; i < (obj.last.vscroll.colIndStart ?? 0); i++) {
            if (!obj.columns[i] || obj.columns[i].frozen || obj.columns[i].hidden) continue;
            width += parseInt(obj.columns[i].sizeCalculated ?? "0");
          }
          query9(el).css("width", width + "px");
        }
        if (obj.columns[ind]) query9(el).css("width", obj.columns[ind].sizeCalculated ?? "");
      }
      if (query9(el).hasClass("w2ui-grid-data-last") && query9(el).parents(".w2ui-grid-frecords").length === 0) {
        query9(el).css("width", w2utils.scrollBarSize() + (width_diff > 0 && percent === 0 ? width_diff : 0) + "px");
      }
    });
    this.initResize();
    this.refreshRanges();
    if ((this.last.vscroll.scrollTop || this.last.vscroll.scrollLeft) && records.length > 0) {
      columns.prop("scrollLeft", this.last.vscroll.scrollLeft);
      records.prop("scrollTop", this.last.vscroll.scrollTop);
      records.prop("scrollLeft", this.last.vscroll.scrollLeft);
    }
    columns.css("will-change", "scroll-position");
  }
  getSearchesHTML() {
    let html = `
            <div class="search-title">
                ${w2utils.lang("Advanced Search")}
                ${this.savedSearches?.length > 0 ? `<button class="w2ui-btn w2ui-saved-searches" data-click="searchSuggest|true|false|this">Saved Searches (${this.savedSearches?.length ?? 0})</button>` : ""}
                <span class="search-logic" style="${this.show.searchLogic ? "" : "display: none"}">
                    <select id="grid_${this.name}_logic" class="w2ui-input">
                        <option value="AND" ${this.last.logic == "AND" ? "selected" : ""}>${w2utils.lang("All")}</option>
                        <option value="OR" ${this.last.logic == "OR" ? "selected" : ""}>${w2utils.lang("Any")}</option>
                    </select>
                </span>
            </div>
        `;
    const columns = [];
    let col_ind = 0;
    columns.push('<div><table cellspacing="0"><tbody>');
    for (let i = 0; i < this.searches.length; i++) {
      const s = this.searches[i];
      s.type = String(s.type).toLowerCase();
      if (s.hidden) continue;
      if (s.type == "new-column") {
        columns[col_ind] += "</tbody></table></div>";
        columns.push('<div><table cellspacing="0"><tbody>');
        col_ind++;
        continue;
      }
      if (s.attr == null) s.attr = "";
      if (s.text == null) s.text = "";
      if (s.style == null) s.style = "";
      if (s.type == null) s.type = "text";
      if (s.label == null && s["caption"] != null) {
        console.log("NOTICE: grid search.caption property is deprecated, please use search.label. Search ->", s);
        s.label = s["caption"];
      }
      const operator = `
                <select id="grid_${this.name}_operator_${i}" class="w2ui-input" data-change="initOperator|${i}">
                    ${this.getOperators(s.type, s.operators)}
                </select>
            `;
      columns[col_ind] += `<tr>
                        <td class="caption">${w2utils.lang(s.label ?? s.field) || ""}</td>
                        <td class="operator">${operator}</td>
                        <td class="value">`;
      let tmpStyle;
      switch (s.type) {
        case "text":
        case "alphanumeric":
        case "hex":
        case "color":
        case "list":
        case "combo":
        case "enum":
          tmpStyle = "width: 250px;";
          if (["hex", "color"].indexOf(s.type) != -1) tmpStyle = "width: 90px;";
          columns[col_ind] += `<input rel="search" type="text" id="grid_${this.name}_field_${i}" name="${s.field}"
                               class="w2ui-input" style="${tmpStyle + s.style}" ${s.attr}>`;
          break;
        case "int":
        case "float":
        case "money":
        case "currency":
        case "percent":
        case "date":
        case "time":
        case "datetime":
          tmpStyle = "width: 90px;";
          if (s.type == "datetime") tmpStyle = "width: 140px;";
          columns[col_ind] += `<input id="grid_${this.name}_field_${i}" name="${s.field}" ${s.attr} rel="search" type="text"
                                class="w2ui-input" style="${tmpStyle + s.style}">
                            <span id="grid_${this.name}_range_${i}" style="display: none">&#160;-&#160;&#160;
                                <input rel="search" type="text" class="w2ui-input" style="${tmpStyle + s.style}" id="grid_${this.name}_field2_${i}" name="${s.field}" ${s.attr}>
                            </span>`;
          break;
        case "select":
          columns[col_ind] += `<select rel="search" class="w2ui-input" style="${s.style}" id="grid_${this.name}_field_${i}"
                                name="${s.field}" ${s.attr}></select>`;
          break;
      }
      columns[col_ind] += s.text + "    </td></tr>";
    }
    columns[col_ind] += "</tbody></table></div>";
    html += `
            <div class="search-body">
                ${columns.join("")}
            </div>
            <div class="search-bottom actions">
                <button type="button" class="w2ui-btn close-btn" data-click="searchClose">${w2utils.lang("Close")}</button>
                <div style="float: right; display: inline">
                    <button type="button" class="w2ui-btn" data-click="searchReset">${w2utils.lang("Reset")}</button>
                    <button type="button" class="w2ui-btn w2ui-btn-blue" data-click="search">${w2utils.lang("Search")}</button>
                </div>
            </div>
        `;
    return html;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOperators(type, opers) {
    let operators = this.operators[this.operatorsMap[type] ?? ""] || [];
    if (opers != null && Array.isArray(opers)) {
      operators = opers;
    }
    let html = "";
    operators.forEach((oper) => {
      let displayText = oper;
      let operValue = oper;
      if (Array.isArray(oper)) {
        displayText = oper[1];
        operValue = oper[0];
      } else if (w2utils.isPlainObject(oper)) {
        displayText = oper.text;
        operValue = oper.oper;
      }
      if (displayText == null) displayText = oper;
      html += `<option  value="${operValue}">${w2utils.lang(displayText)}</option>
`;
    });
    return html;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initOperator(ind) {
    let options;
    const search = this.searches[ind];
    const sdata = this.getSearchData(search.field);
    const overlay = query9(`#w2overlay-${this.name}-search-overlay`);
    const $rng = overlay.find(`#grid_${this.name}_range_${ind}`);
    const $fld1 = overlay.find(`#grid_${this.name}_field_${ind}`);
    const $fld2 = overlay.find(`#grid_${this.name}_field2_${ind}`);
    const $oper = overlay.find(`#grid_${this.name}_operator_${ind}`);
    const oper = $oper.val();
    $fld1.show();
    $rng.hide();
    switch (oper) {
      case "between":
        $rng.css("display", "inline");
        break;
      case "null":
      case "not null":
        $fld1.hide();
        $fld1.val(oper);
        $fld1.trigger("change");
        break;
    }
    switch (search.type) {
      case "text":
      case "alphanumeric":
        const fld = $fld1[0]._w2field;
        if (fld) {
          fld.reset();
        }
        break;
      case "int":
      case "float":
      case "hex":
      case "color":
      case "money":
      case "currency":
      case "percent":
      case "date":
      case "time":
      case "datetime":
        if (!$fld1[0]._w2field) {
          new w2field(search.type, { el: $fld1[0], ...search.options });
          new w2field(search.type, { el: $fld2[0], ...search.options });
          setTimeout(() => {
            $fld1.trigger("keydown");
            $fld2.trigger("keydown");
          }, 1);
        }
        break;
      case "list":
      case "combo":
      case "enum":
        options = search.options ?? {};
        if (search.type == "list") options["selected"] = {};
        if (search.type == "enum") options["selected"] = [];
        if (sdata) options["selected"] = sdata["value"];
        if (!$fld1[0]._w2field) {
          const fld2 = new w2field(search.type, {
            el: $fld1[0],
            ...options,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onSelect: async (event2) => {
              await event2.complete;
              this.initSearchLists(search.field);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onRemove: async (event2) => {
              await event2.complete;
              this.initSearchLists(search.field);
            }
          });
          if (sdata && sdata["text"] != null) {
            fld2.set({ id: sdata["value"], text: sdata["text"] });
          }
          search["_w2field"] = fld2;
        }
        break;
      case "select":
        options = '<option value="">--</option>';
        const searchOpts = search.options ?? {};
        for (let i = 0; i < searchOpts["items"].length; i++) {
          const si = searchOpts["items"][i];
          if (w2utils.isPlainObject(searchOpts["items"][i])) {
            let val = si.id;
            let txt = si.text;
            if (val == null && si.value != null) val = si.value;
            if (txt == null && si.text != null) txt = si.text;
            if (val == null) val = "";
            options += '<option value="' + val + '">' + txt + "</option>";
          } else {
            options += '<option value="' + si + '">' + si + "</option>";
          }
        }
        $fld1.html(options);
        break;
    }
    this.initSearchLists();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initSearchLists(changedField) {
    const fields = this.getSearch();
    fields.forEach((field) => {
      const search = this.getSearch(field);
      if (search != null && search.options?.["parentList"] != null) {
        const parent = this.getSearch(search.options["parentList"]);
        if (parent == null) return;
        let values = this.getSearch(parent.field)?.["_w2field"]?.get();
        if (Array.isArray(values)) {
          values = values.map((vv) => vv.id);
        } else {
          values = values?.id != null ? [values.id] : [];
        }
        search["_w2field"]?.options?.items?.forEach?.((item) => {
          const parent2 = w2utils.getNested(item, search?.options?.["parentField"] ?? "parentId");
          if (parent2 == null) {
            return;
          }
          const possible = w2utils.clone(Array.isArray(parent2) ? parent2 : [parent2]);
          possible.unshift("");
          const includes = values.some((item2) => possible.includes(item2));
          if (includes && item.hidden === true) {
            item.hidden = false;
          } else if (!includes && item.hidden !== true) {
            item.hidden = true;
          }
        });
      }
    });
    if (changedField != null) {
      fields.forEach((field) => {
        const search = this.getSearch(field);
        if (search != null && search.options?.["parentList"] == changedField) {
          const fld = search["_w2field"];
          const items = fld.options.items.filter((it) => !it.hidden).map((it) => it.id);
          if (fld.type == "list" && !items.includes(fld.get()?.id)) {
            fld.set(null);
          }
          if (fld.type == "enum") {
            const new_sel = fld.get()?.filter((it) => items.includes(it.id));
            fld.set(new_sel || []);
          }
        }
      });
    }
  }
  initSearches() {
    const overlay = query9(`#w2overlay-${this.name}-search-overlay`);
    for (let ind = 0; ind < this.searches.length; ind++) {
      const search = this.searches[ind];
      const sdata = this.getSearchData(search.field);
      search.type = String(search.type).toLowerCase();
      if (search.type == "new-column") {
        continue;
      }
      if (typeof search.options != "object") search.options = {};
      let operator = search.operator;
      let operators = [...this.operators[this.operatorsMap[search.type] ?? ""] ?? []];
      if (search.operators) operators = [...search.operators];
      if (w2utils.isPlainObject(operator)) operator = operator.oper;
      operators.forEach((oper, ind2) => {
        if (w2utils.isPlainObject(oper)) operators[ind2] = oper.oper;
      });
      if (sdata && sdata["operator"]) {
        operator = sdata["operator"];
      }
      const def = this.defaultOperator[this.operatorsMap[search.type] ?? ""];
      if (operators.indexOf(operator) == -1) {
        operator = def;
      }
      overlay.find(`#grid_${this.name}_operator_${ind}`).val(operator);
      this.initOperator(ind);
      const $fld1 = overlay.find(`#grid_${this.name}_field_${ind}`);
      const $fld2 = overlay.find(`#grid_${this.name}_field2_${ind}`);
      if (sdata != null) {
        if (!Array.isArray(sdata["value"])) {
          if (sdata["value"] != null) $fld1.val(sdata["value"]).trigger("change");
        } else {
          if (["in", "not in"].includes(sdata["operator"])) {
            $fld1[0]._w2field.set(sdata["value"]);
          } else {
            $fld1.val(sdata["value"][0]).trigger("change");
            $fld2.val(sdata["value"][1]).trigger("change");
          }
        }
      }
    }
    overlay.find(".w2ui-grid-search-advanced *[rel=search]").on("keypress", (evnt) => {
      if (evnt.keyCode == 13) {
        this.search();
        w2tooltip4.hide(this.name + "-search-overlay");
      }
    });
  }
  getColumnsHTML() {
    const self = this;
    let html1 = "";
    let html2 = "";
    if (this.show.columnHeaders) {
      if (this.columnGroups.length > 0) {
        const tmp1 = getColumns(true);
        const tmp2 = getGroups();
        const tmp3 = getColumns(false);
        html1 = (tmp1[0] ?? "") + (tmp2[0] ?? "") + (tmp3[0] ?? "");
        html2 = (tmp1[1] ?? "") + (tmp2[1] ?? "") + (tmp3[1] ?? "");
      } else {
        const tmp = getColumns(true);
        html1 = tmp[0] ?? "";
        html2 = tmp[1] ?? "";
      }
    }
    return [html1, html2];
    function getGroups() {
      let html12 = "<tr>";
      let html22 = "<tr>";
      let tmpf = "";
      const tmp = self.columnGroups.length - 1;
      if (self.columnGroups[tmp].text == null && self.columnGroups[tmp]["caption"] != null) {
        console.log("NOTICE: grid columnGroup.caption property is deprecated, please use columnGroup.text. Group -> ", self.columnGroups[tmp]);
        self.columnGroups[tmp].text = self.columnGroups[tmp]["caption"];
      }
      if (self.columnGroups[self.columnGroups.length - 1].text != "") self.columnGroups.push({ text: "" });
      if (self.show.lineNumbers) {
        html12 += '<td class="w2ui-head w2ui-col-number" col="line-number">    <div>&#160;</div></td>';
      }
      if (self.show.selectColumn) {
        html12 += '<td class="w2ui-head w2ui-col-select" col="select">    <div style="height: 25px">&#160;</div></td>';
      }
      if (self.show.expandColumn) {
        html12 += '<td class="w2ui-head w2ui-col-expand" col="expand">    <div style="height: 25px">&#160;</div></td>';
      }
      let ii = 0;
      html22 += `<td id="grid_${self.name}_column_start" class="w2ui-head" col="start" style="border-right: 0"></td>`;
      if (self.reorderRows) {
        html22 += '<td class="w2ui-head w2ui-col-order" col="order">    <div style="height: 25px">&#160;</div></td>';
      }
      for (let i = 0; i < self.columnGroups.length; i++) {
        const colg = self.columnGroups[i];
        const col = self.columns[ii] ?? {};
        if (colg.colspan != null) colg.span = colg.colspan;
        if (colg.span == null || colg.span != parseInt(colg.span)) colg.span = 1;
        if (col.text == null && col["caption"] != null) {
          console.log("NOTICE: grid column.caption property is deprecated, please use column.text. Column ->", col);
          col.text = col["caption"];
        }
        let colspan = 0;
        for (let jj = ii; jj < ii + colg.span; jj++) {
          if (self.columns[jj] && !self.columns[jj].hidden) {
            colspan++;
          }
        }
        if (i == self.columnGroups.length - 1) {
          colspan = 100;
        }
        if (colspan <= 0) {
        } else if (colg.main === true) {
          let sortStyle = "";
          for (let si = 0; si < self.sortData.length; si++) {
            if (self.sortData[si].field == col.field) {
              if ((self.sortData[si].direction || "").toLowerCase() === "asc") sortStyle = "w2ui-sort-up";
              if ((self.sortData[si].direction || "").toLowerCase() === "desc") sortStyle = "w2ui-sort-down";
            }
          }
          let resizer = "";
          if (col.resizable !== false) {
            resizer = `<div class="w2ui-resizer" name="${ii}"></div>`;
          }
          const text = w2utils.lang(typeof col.text == "function" ? col.text(col) : col.text);
          tmpf = `<td id="grid_${self.name}_column_${ii}" class="w2ui-head ${sortStyle}" col="${ii}"     rowspan="2" colspan="${colspan}">` + resizer + `    <div class="w2ui-col-group w2ui-col-header ${sortStyle ? "w2ui-col-sorted" : ""}">        <div class="${sortStyle}"></div>` + (!text ? "&#160;" : text) + "    </div></td>";
          if (col && col.frozen) html12 += tmpf;
          else html22 += tmpf;
        } else {
          const gText = w2utils.lang(typeof colg.text == "function" ? colg.text(colg) : colg.text);
          tmpf = `<td id="grid_${self.name}_column_${ii}" class="w2ui-head" col="${ii}" colspan="${colspan}">    <div class="w2ui-col-group" style="${colg.style ?? ""}">${!gText ? "&#160;" : gText}</div></td>`;
          if (col && col.frozen) html12 += tmpf;
          else html22 += tmpf;
        }
        ii += colg.span;
      }
      html12 += "<td></td></tr>";
      html22 += `<td id="grid_${self.name}_column_end" class="w2ui-head" col="end"></td></tr>`;
      return [html12, html22];
    }
    function getColumns(main) {
      let html12 = "<tr>";
      let html22 = "<tr>";
      if (self.show.lineNumbers) {
        html12 += '<td class="w2ui-head w2ui-col-number" col="line-number">    <div>#</div></td>';
      }
      if (self.show.selectColumn) {
        html12 += `<td class="w2ui-head w2ui-col-select" col="select">    <div>        <input type="checkbox" id="grid_${self.name}_check_all" class="w2ui-select-all" tabindex="-1"            style="${self.multiSelect == false ? "display: none;" : ""}"        >    </div></td>`;
      }
      if (self.show.expandColumn) {
        html12 += '<td class="w2ui-head w2ui-col-expand" col="expand">    <div>&#160;</div></td>';
      }
      let ii = 0;
      let id = 0;
      let colg;
      html22 += `<td id="grid_${self.name}_column_start" class="w2ui-head" col="start" style="border-right: 0"></td>`;
      if (self.reorderRows) {
        html22 += '<td class="w2ui-head w2ui-col-order" col="order">    <div>&#160;</div></td>';
      }
      for (let i = 0; i < self.columns.length; i++) {
        const col = self.columns[i];
        if (col.text == null && col["caption"] != null) {
          console.log("NOTICE: grid column.caption property is deprecated, please use column.text. Column -> ", col);
          col.text = col["caption"];
        }
        if (col.size == null) col.size = "100%";
        if (i == id) {
          colg = self.columnGroups[ii++] || {};
          id = id + colg.span;
        }
        if ((i < (self.last.vscroll.colIndStart ?? 0) || i > (self.last.vscroll.colIndEnd ?? Infinity)) && !col.frozen)
          continue;
        if (col.hidden)
          continue;
        if (colg.main !== true || main) {
          const colCellHTML = self.getColumnCellHTML(i);
          if (col && col.frozen) html12 += colCellHTML;
          else html22 += colCellHTML;
        }
      }
      html12 += '<td class="w2ui-head w2ui-head-last"><div>&#160;</div></td>';
      html22 += '<td class="w2ui-head w2ui-head-last" col="end"><div>&#160;</div></td>';
      html12 += "</tr>";
      html22 += "</tr>";
      return [html12, html22];
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getColumnCellHTML(i) {
    const col = this.columns[i];
    if (col == null) return "";
    const reorderCols = this.reorderColumns && (!this.columnGroups || !this.columnGroups.length) ? " w2ui-col-reorderable " : "";
    let sortStyle = "";
    for (let si = 0; si < this.sortData.length; si++) {
      if (this.sortData[si].field == col.field) {
        if ((this.sortData[si].direction || "").toLowerCase() === "asc") sortStyle = "w2ui-sort-up";
        if ((this.sortData[si].direction || "").toLowerCase() === "desc") sortStyle = "w2ui-sort-down";
      }
    }
    const tmp = this.last.selection.columns;
    let selected = false;
    for (const t in tmp) {
      for (let si = 0; si < tmp[t].length; si++) {
        if (tmp[t][si] == i) selected = true;
      }
    }
    const text = w2utils.lang(typeof col.text == "function" ? col.text(col) : col.text);
    const html = '<td id="grid_' + this.name + "_column_" + i + '" col="' + i + '" class="w2ui-head ' + sortStyle + reorderCols + '">' + (col.resizable !== false ? '<div class="w2ui-resizer" name="' + i + '"></div>' : "") + '    <div class="w2ui-col-header ' + (sortStyle ? "w2ui-col-sorted" : "") + " " + (selected ? "w2ui-col-selected" : "") + '">        <div class="' + sortStyle + '"></div>' + (!text ? "&#160;" : text) + "    </div></td>";
    return html;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnTooltipShow(ind, _event) {
    const $el = query9(this.box).find("#grid_" + this.name + "_column_" + ind);
    const item = this.columns[ind];
    const pos = this.columnTooltip;
    w2tooltip4.show({
      name: this.name + "-column-tooltip",
      anchor: $el.get(0),
      html: item?.tooltip,
      position: pos
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnTooltipHide(_ind, _event) {
    w2tooltip4.hide(this.name + "-column-tooltip");
  }
  getRecordsHTML() {
    let buffered = this.records.length;
    const url = this.url?.get ?? this.url;
    if (this.searchData.length != 0 && !url) buffered = this.last.searchIds.length;
    if (buffered > this.vs_start) this.last.vscroll.show_extra = this.vs_extra;
    else this.last.vscroll.show_extra = this.vs_start;
    const records = query9(this.box).find(`#grid_${this.name}_records`);
    let limit = Math.floor((records.get(0)?.clientHeight || 0) / this.recordHeight) + this.last.vscroll.show_extra + 1;
    if (limit < this.vs_start) {
      limit = this.vs_start;
    }
    if (!this.fixedBody || limit > buffered) limit = buffered;
    let rec_html = this.getRecordHTML(-1, 0);
    let html1 = "<table><tbody>" + rec_html[0];
    let html2 = "<table><tbody>" + rec_html[1];
    html1 += '<tr id="grid_' + this.name + '_frec_top" line="top" style="height: 0px">    <td colspan="2000"></td></tr>';
    html2 += '<tr id="grid_' + this.name + '_rec_top" line="top" style="height: 0px">    <td colspan="2000"></td></tr>';
    for (let i = 0; i < limit; i++) {
      rec_html = this.getRecordHTML(i, i + 1);
      html1 += rec_html[0];
      html2 += rec_html[1];
    }
    const h2 = (buffered - limit) * this.recordHeight;
    html1 += '<tr id="grid_' + this.name + '_frec_bottom" rec="bottom" line="bottom" style="height: ' + h2 + 'px; vertical-align: top">    <td colspan="2000" style="border: 0"></td></tr><tr id="grid_' + this.name + '_frec_more" style="display: none; ">    <td colspan="2000" class="w2ui-load-more"></td></tr></tbody></table>';
    html2 += '<tr id="grid_' + this.name + '_rec_bottom" rec="bottom" line="bottom" style="height: ' + h2 + 'px; vertical-align: top">    <td colspan="2000" style="border: 0"></td></tr><tr id="grid_' + this.name + '_rec_more" style="display: none">    <td colspan="2000" class="w2ui-load-more"></td></tr></tbody></table>';
    this.last.vscroll.recIndStart = 0;
    this.last.vscroll.recIndEnd = limit;
    return [html1, html2];
  }
  getSummaryHTML() {
    if (this.summary.length === 0) return;
    let rec_html = this.getRecordHTML(-1, 0);
    let html1 = "<table><tbody>" + rec_html[0];
    let html2 = "<table><tbody>" + rec_html[1];
    for (let i = 0; i < this.summary.length; i++) {
      rec_html = this.getRecordHTML(i, i + 1, true);
      html1 += rec_html[0];
      html2 += rec_html[1];
    }
    html1 += "</tbody></table>";
    html2 += "</tbody></table>";
    return [html1, html2];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scroll(event2) {
    const obj = this;
    const url = this.url?.get ?? this.url;
    const records = query9(this.box).find(`#grid_${this.name}_records`);
    const frecords = query9(this.box).find(`#grid_${this.name}_frecords`);
    if (event2) {
      const sTop = event2.target.scrollTop;
      const sLeft = event2.target.scrollLeft;
      this.last.vscroll.scrollTop = sTop;
      this.last.vscroll.scrollLeft = sLeft;
      const cols = query9(this.box).find(`#grid_${this.name}_columns`)[0];
      const summary = query9(this.box).find(`#grid_${this.name}_summary`)[0];
      if (cols) cols.scrollLeft = sLeft;
      if (summary) summary.scrollLeft = sLeft;
      if (frecords[0]) frecords[0].scrollTop = sTop;
    }
    if (this.last.bubbleEl) {
      w2tooltip4.hide(this.name + "-bubble");
      this.last.bubbleEl = null;
    }
    let colStart = null;
    let colEnd = null;
    if (this.disableCVS || this.columnGroups.length > 0) {
      colStart = 0;
      colEnd = this.columns.length - 1;
    } else {
      const sWidth = records.prop("clientWidth");
      let cLeft = 0;
      for (let i = 0; i < this.columns.length; i++) {
        if (this.columns[i].frozen || this.columns[i].hidden) continue;
        const cSize = parseInt(this.columns[i].sizeCalculated ? this.columns[i].sizeCalculated : String(this.columns[i].size ?? 0));
        if (cLeft + cSize + 30 > this.last.vscroll.scrollLeft && colStart == null) colStart = i;
        if (cLeft + cSize - 30 > this.last.vscroll.scrollLeft + sWidth && colEnd == null) colEnd = i;
        cLeft += cSize;
      }
      if (colEnd == null) colEnd = this.columns.length - 1;
    }
    if (colStart != null) {
      if (colStart < 0) colStart = 0;
      if (colEnd < 0) colEnd = 0;
      if (colStart == colEnd) {
        if (colStart > 0) colStart--;
        else colEnd++;
      }
      if (colStart != this.last.vscroll.colIndStart || colEnd != this.last.vscroll.colIndEnd) {
        const $box = query9(this.box);
        const deltaStart = Math.abs(colStart - this.last.vscroll.colIndStart);
        const deltaEnd = Math.abs(colEnd - this.last.vscroll.colIndEnd);
        if (deltaStart < 5 && deltaEnd < 5) {
          const $cfirst = $box.find(`.w2ui-grid-columns #grid_${this.name}_column_start`);
          const $clast = $box.find(".w2ui-grid-columns .w2ui-head-last");
          const $rfirst = $box.find(`#grid_${this.name}_records .w2ui-grid-data-spacer`);
          const $rlast = $box.find(`#grid_${this.name}_records .w2ui-grid-data-last`);
          const $sfirst = $box.find(`#grid_${this.name}_summary .w2ui-grid-data-spacer`);
          const $slast = $box.find(`#grid_${this.name}_summary .w2ui-grid-data-last`);
          if (colStart > this.last.vscroll.colIndStart) {
            for (let i = this.last.vscroll.colIndStart; i < colStart; i++) {
              $box.find("#grid_" + this.name + "_columns #grid_" + this.name + "_column_" + i).remove();
              $box.find("#grid_" + this.name + '_records td[col="' + i + '"]').remove();
              $box.find("#grid_" + this.name + '_summary td[col="' + i + '"]').remove();
            }
          }
          if (colEnd < this.last.vscroll.colIndEnd) {
            for (let i = this.last.vscroll.colIndEnd; i > colEnd; i--) {
              $box.find("#grid_" + this.name + "_columns #grid_" + this.name + "_column_" + i).remove();
              $box.find("#grid_" + this.name + '_records td[col="' + i + '"]').remove();
              $box.find("#grid_" + this.name + '_summary td[col="' + i + '"]').remove();
            }
          }
          if (colStart < this.last.vscroll.colIndStart) {
            for (let i = (this.last.vscroll.colIndStart ?? 0) - 1; i >= colStart; i--) {
              if (this.columns[i] && (this.columns[i].frozen || this.columns[i].hidden)) continue;
              $cfirst.after(this.getColumnCellHTML(i));
              $rfirst.each((el) => {
                const index = query9(el).parent().attr("index");
                let td = '<td class="w2ui-grid-data" col="' + i + '" style="height: 0px"></td>';
                if (index != null) td = this.getCellHTML(parseInt(index), i, false);
                query9(el).after(td);
              });
              $sfirst.each((el) => {
                const index = query9(el).parent().attr("index");
                let td = '<td class="w2ui-grid-data" col="' + i + '" style="height: 0px"></td>';
                if (index != null) td = this.getCellHTML(parseInt(index), i, true);
                query9(el).after(td);
              });
            }
          }
          if (colEnd > this.last.vscroll.colIndEnd) {
            for (let i = (this.last.vscroll.colIndEnd ?? 0) + 1; i <= colEnd; i++) {
              if (this.columns[i] && (this.columns[i].frozen || this.columns[i].hidden)) continue;
              $clast.before(this.getColumnCellHTML(i));
              $rlast.each((el) => {
                const index = query9(el).parent().attr("index");
                let td = '<td class="w2ui-grid-data" col="' + i + '" style="height: 0px"></td>';
                if (index != null) td = this.getCellHTML(parseInt(index), i, false);
                query9(el).before(td);
              });
              $slast.each((el) => {
                const index = query9(el).parent().attr("index") || -1;
                const td = this.getCellHTML(parseInt(index), i, true);
                query9(el).before(td);
              });
            }
          }
          this.last.vscroll.colIndStart = colStart;
          this.last.vscroll.colIndEnd = colEnd;
          this.resizeRecords();
        } else {
          this.last.vscroll.colIndStart = colStart;
          this.last.vscroll.colIndEnd = colEnd;
          const colHTML = this.getColumnsHTML();
          const recHTML = this.getRecordsHTML();
          const sumHTML = this.getSummaryHTML();
          const $columns = $box.find(`#grid_${this.name}_columns`);
          const $records = $box.find(`#grid_${this.name}_records`);
          const $frecords = $box.find(`#grid_${this.name}_frecords`);
          const $summary = $box.find(`#grid_${this.name}_summary`);
          $columns.find("tbody").html(colHTML[1]);
          $frecords.html(recHTML[0]);
          $records.prepend(recHTML[1]);
          if (sumHTML != null) $summary.html(sumHTML[1]);
          setTimeout(() => {
            $records.find(":scope > table").filter(":not(table:first-child)").remove();
            if ($summary[0]) $summary[0].scrollLeft = this.last.vscroll.scrollLeft;
          }, 1);
          this.resizeRecords();
        }
      }
    }
    let buffered = this.records.length;
    if (buffered > this.total && this.total !== -1) buffered = this.total;
    if (this.searchData.length != 0 && !url) buffered = this.last.searchIds.length;
    if (buffered === 0 || records.length === 0 || records.prop("clientHeight") === 0) return;
    if (buffered > this.vs_start) this.last.vscroll.show_extra = this.vs_extra;
    else this.last.vscroll.show_extra = this.vs_start;
    let t1 = Math.round(records.prop("scrollTop") / this.recordHeight + 1);
    let t2 = t1 + (Math.round(records.prop("clientHeight") / this.recordHeight) - 1);
    if (t1 > buffered) t1 = buffered;
    if (t2 >= buffered - 1) t2 = buffered;
    query9(this.box).find("#grid_" + this.name + "_footer .w2ui-footer-right").html(
      (this.show.statusRange ? w2utils.formatNumber(this.offset + t1) + "-" + w2utils.formatNumber(this.offset + t2) + (this.total != -1 ? " " + w2utils.lang("of") + ' <span class="w2ui-total">' + w2utils.formatNumber(this.total) + "</span>" : "") : "") + (url && this.show.statusBuffered ? " (" + w2utils.lang("buffered") + ' <span class="w2ui-buffered">' + w2utils.formatNumber(buffered) + "</span>" + (this.offset > 0 ? ', skip <span class="w2ui-skip">' + w2utils.formatNumber(this.offset) : "") + "</span>)" : "")
    );
    if (!url && (!this.fixedBody || this.total != -1 && this.total <= this.vs_start)) return;
    let start = Math.floor(records.prop("scrollTop") / this.recordHeight) - this.last.vscroll.show_extra;
    let end = start + Math.floor(records.prop("clientHeight") / this.recordHeight) + this.last.vscroll.show_extra * 2 + 1;
    if (start < 1) start = 1;
    if (end > this.total && this.total != -1) end = this.total;
    const tr1 = records.find("#grid_" + this.name + "_rec_top");
    const tr2 = records.find("#grid_" + this.name + "_rec_bottom");
    const tr1f = frecords.find("#grid_" + this.name + "_frec_top");
    const tr2f = frecords.find("#grid_" + this.name + "_frec_bottom");
    if (String(tr1.next().prop("id")).indexOf("_expanded_row") != -1) {
      tr1.next().remove();
      tr1f.next().remove();
    }
    if (this.total > end && String(tr2.prev().prop("id")).indexOf("_expanded_row") != -1) {
      tr2.prev().remove();
      tr2f.prev().remove();
    }
    const first = parseInt(tr1.next().attr("line"));
    const last = parseInt(tr2.prev().attr("line"));
    let tmp, tmp1, tmp2, rec_start, rec_html;
    if (first <= start || first == 1 || this.last.vscroll.pull_refresh) {
      if (end <= last + this.last.vscroll.show_extra - 2 && end != this.total) return;
      this.last.vscroll.pull_refresh = false;
      while (true) {
        tmp1 = frecords.find("#grid_" + this.name + "_frec_top").next();
        tmp2 = records.find("#grid_" + this.name + "_rec_top").next();
        if (tmp2.attr("line") == "bottom") break;
        if (parseInt(tmp2.attr("line")) < start) {
          tmp1.remove();
          tmp2.remove();
        } else {
          break;
        }
      }
      tmp = records.find("#grid_" + this.name + "_rec_bottom").prev();
      rec_start = tmp.attr("line");
      if (rec_start == "top") rec_start = start;
      for (let i = parseInt(rec_start) + 1; i <= end; i++) {
        if (!this.records[i - 1]) continue;
        tmp2 = this.records[i - 1].w2ui;
        if (tmp2 && !Array.isArray(tmp2.children)) {
          tmp2.expanded = false;
        }
        rec_html = this.getRecordHTML(i - 1, i);
        tr2.before(rec_html[1]);
        tr2f.before(rec_html[0]);
      }
      markSearch();
      setTimeout(() => {
        this.refreshRanges();
      }, 0);
    } else {
      if (start >= first - this.last.vscroll.show_extra + 2 && start > 1) return;
      while (true) {
        tmp1 = frecords.find("#grid_" + this.name + "_frec_bottom").prev();
        tmp2 = records.find("#grid_" + this.name + "_rec_bottom").prev();
        if (tmp2.attr("line") == "top") break;
        if (parseInt(tmp2.attr("line")) > end) {
          tmp1.remove();
          tmp2.remove();
        } else {
          break;
        }
      }
      tmp = records.find("#grid_" + this.name + "_rec_top").next();
      rec_start = tmp.attr("line");
      if (rec_start == "bottom") rec_start = end;
      for (let i = parseInt(rec_start) - 1; i >= start; i--) {
        if (!this.records[i - 1]) continue;
        tmp2 = this.records[i - 1].w2ui;
        if (tmp2 && !Array.isArray(tmp2.children)) {
          tmp2.expanded = false;
        }
        rec_html = this.getRecordHTML(i - 1, i);
        tr1.after(rec_html[1]);
        tr1f.after(rec_html[0]);
      }
      markSearch();
      setTimeout(() => {
        this.refreshRanges();
      }, 0);
    }
    const h1 = (start - 1) * this.recordHeight;
    let h2 = (buffered - end) * this.recordHeight;
    if (h2 < 0) h2 = 0;
    tr1.css("height", h1 + "px");
    tr1f.css("height", h1 + "px");
    tr2.css("height", h2 + "px");
    tr2f.css("height", h2 + "px");
    this.last.vscroll.recIndStart = start;
    this.last.vscroll.recIndEnd = end;
    const s = Math.floor(records.prop("scrollTop") / this.recordHeight);
    const e = s + Math.floor(records.prop("clientHeight") / this.recordHeight);
    if (e + 10 > buffered && this.last.vscroll.pull_more !== true && (buffered < this.total - this.offset || this.total == -1 && this.last.fetch.hasMore)) {
      if (this.autoLoad === true) {
        this.last.vscroll.pull_more = true;
        this.last.fetch.offset = (this.last.fetch.offset ?? 0) + this.limit;
        this.request("load");
      }
      const more = query9(this.box).find("#grid_" + this.name + "_rec_more, #grid_" + this.name + "_frec_more");
      more.show().eq(1).off(".load-more").on("click.load-more", function() {
        query9(this).find("td").html('<div><div style="width: 20px; height: 20px;" class="w2ui-spinner"></div></div>');
        obj.last.vscroll.pull_more = true;
        obj.last.fetch.offset = (obj.last.fetch.offset ?? 0) + obj.limit;
        obj.request("load");
      }).find("td").html(
        obj.autoLoad ? '<div><div style="width: 20px; height: 20px;" class="w2ui-spinner"></div></div>' : '<div style="padding-top: 15px">' + w2utils.lang("Load ${count} more...", { count: obj.limit }) + "</div>"
      );
    }
    function markSearch() {
      if (!obj.markSearch) return;
      clearTimeout(obj.last.marker_timer ?? void 0);
      obj.last.marker_timer = setTimeout(() => {
        const search = [];
        for (let s2 = 0; s2 < obj.searchData.length; s2++) {
          const sdata = obj.searchData[s2];
          const fld = obj.getSearch(sdata.field);
          if (!fld || fld.hidden) continue;
          const ind = obj.getColumn(sdata.field, true);
          search.push({ field: sdata.field, search: sdata["value"], col: ind });
        }
        if (search.length > 0) {
          search.forEach((item) => {
            const el = query9(obj.box).find('td[col="' + item.col + '"]:not(.w2ui-head)');
            w2utils.marker(el, item.search);
          });
        }
      }, 50);
    }
  }
  getRecordHTML(ind, lineNum, summary) {
    let tmph = "";
    let rec_html1 = "";
    let rec_html2 = "";
    const sel = this.last.selection;
    let record;
    if (ind == -1) {
      rec_html1 += '<tr line="0">';
      rec_html2 += '<tr line="0">';
      if (this.show.lineNumbers) rec_html1 += '<td class="w2ui-col-number" style="height: 0px"></td>';
      if (this.show.selectColumn) rec_html1 += '<td class="w2ui-col-select" style="height: 0px"></td>';
      if (this.show.expandColumn) rec_html1 += '<td class="w2ui-col-expand" style="height: 0px"></td>';
      rec_html2 += '<td class="w2ui-grid-data w2ui-grid-data-spacer" col="start" style="height: 0px; width: 0px"></td>';
      if (this.reorderRows) rec_html2 += '<td class="w2ui-col-order" style="height: 0px"></td>';
      for (let i = 0; i < this.columns.length; i++) {
        const col = this.columns[i];
        tmph = '<td class="w2ui-grid-data" col="' + i + '" style="height: 0px;"></td>';
        if (col.frozen && !col.hidden) {
          rec_html1 += tmph;
        } else {
          if (col.hidden || i < this.last.vscroll.colIndStart || i > this.last.vscroll.colIndEnd) continue;
          rec_html2 += tmph;
        }
      }
      rec_html1 += '<td class="w2ui-grid-data-last" style="height: 0px"></td>';
      rec_html2 += '<td class="w2ui-grid-data-last" col="end" style="height: 0px"></td>';
      rec_html1 += "</tr>";
      rec_html2 += "</tr>";
      return [rec_html1, rec_html2];
    }
    const url = this.url?.get ?? this.url;
    if (summary !== true) {
      if (this.searchData.length > 0 && !url) {
        if (ind >= this.last.searchIds.length) return "";
        ind = this.last.searchIds[ind] ?? ind;
        record = this.records[ind];
      } else {
        if (ind >= this.records.length) return "";
        record = this.records[ind];
      }
    } else {
      if (ind >= this.summary.length) return "";
      record = this.summary[ind];
    }
    if (!record) return "";
    if (record.recid == null && this.recid != null) {
      const rid = this.parseField(record, this.recid);
      if (rid != null) record.recid = rid;
    }
    let isRowSelected = false;
    if (sel.indexes.indexOf(ind) != -1) isRowSelected = true;
    let rec_style = record.w2ui ? record.w2ui["style"] : "";
    if (rec_style == null || typeof rec_style != "string") rec_style = "";
    let rec_class = record.w2ui ? record.w2ui["class"] : "";
    if (rec_class == null || typeof rec_class != "string") rec_class = "";
    rec_html1 += '<tr id="grid_' + this.name + "_frec_" + record.recid + '" recid="' + record.recid + '" line="' + lineNum + '" index="' + ind + '"  class="' + (lineNum % 2 === 0 ? "w2ui-even" : "w2ui-odd") + " w2ui-record " + rec_class + (isRowSelected && this.selectType == "row" ? " w2ui-selected" : "") + (record.w2ui && record.w2ui["editable"] === false ? " w2ui-no-edit" : "") + (record.w2ui && record.w2ui.expanded === true ? " w2ui-expanded" : "") + '"  style="height: ' + this.recordHeight + "px; " + (!isRowSelected && rec_style != "" ? rec_style : rec_style.replace("background-color", "none")) + '" ' + (rec_style != "" ? 'custom_style="' + rec_style + '"' : "") + ">";
    rec_html2 += '<tr id="grid_' + this.name + "_rec_" + record.recid + '" recid="' + record.recid + '" line="' + lineNum + '" index="' + ind + '"  class="' + (lineNum % 2 === 0 ? "w2ui-even" : "w2ui-odd") + " w2ui-record " + rec_class + (isRowSelected && this.selectType == "row" ? " w2ui-selected" : "") + (record.w2ui && record.w2ui["editable"] === false ? " w2ui-no-edit" : "") + (record.w2ui && record.w2ui.expanded === true ? " w2ui-expanded" : "") + '"  style="height: ' + this.recordHeight + "px; " + (!isRowSelected && rec_style != "" ? rec_style : rec_style.replace("background-color", "none")) + '" ' + (rec_style != "" ? 'custom_style="' + rec_style + '"' : "") + ">";
    if (this.show.lineNumbers) {
      rec_html1 += '<td id="grid_' + this.name + "_cell_" + ind + "_number" + (summary ? "_s" : "") + '"    class="w2ui-col-number ' + (isRowSelected ? " w2ui-row-selected" : "") + '"' + (this.reorderRows ? ' style="cursor: move"' : "") + ">" + (summary !== true ? this.getLineHTML(lineNum) : "") + "</td>";
    }
    if (this.show.selectColumn) {
      rec_html1 += '<td id="grid_' + this.name + "_cell_" + ind + "_select" + (summary ? "_s" : "") + '" class="w2ui-grid-data w2ui-col-select">' + (summary !== true && !(record.w2ui && record.w2ui["hideCheckBox"] === true) ? '    <div>        <input class="w2ui-grid-select-check" type="checkbox" tabindex="-1" ' + (isRowSelected ? 'checked="checked"' : "") + ' style="pointer-events: none"/>    </div>' : "") + "</td>";
    }
    if (this.show.expandColumn) {
      let tmp_img = "";
      if (record.w2ui?.expanded === true) tmp_img = "-";
      else tmp_img = "+";
      if (record.w2ui?.expanded == "none" || !Array.isArray(record.w2ui?.children) || !record.w2ui?.children.length) tmp_img = "+";
      if (record.w2ui?.expanded == "spinner") tmp_img = '<div class="w2ui-spinner" style="width: 16px; margin: -2px 2px;"></div>';
      rec_html1 += '<td id="grid_' + this.name + "_cell_" + ind + "_expand" + (summary ? "_s" : "") + '" class="w2ui-grid-data w2ui-col-expand">' + (summary !== true ? `<div>${tmp_img}</div>` : "") + "</td>";
    }
    rec_html2 += '<td class="w2ui-grid-data-spacer" col="start" style="border-right: 0"></td>';
    if (this.reorderRows) {
      rec_html2 += '<td id="grid_' + this.name + "_cell_" + ind + "_order" + (summary ? "_s" : "") + '" class="w2ui-grid-data w2ui-col-order" col="order">' + (summary !== true ? '<div title="Drag to reorder">&nbsp;</div>' : "") + "</td>";
    }
    let col_ind = 0;
    let col_skip = 0;
    while (true) {
      let col_span = 1;
      const col = this.columns[col_ind];
      if (col == null) break;
      if (col.hidden) {
        col_ind++;
        if (col_skip > 0) col_skip--;
        continue;
      }
      if (col_skip > 0) {
        col_ind++;
        if (this.columns[col_ind] == null) break;
        record.w2ui["colspan"][this.columns[col_ind - 1].field] = 0;
        col_skip--;
        continue;
      } else if (record.w2ui) {
        const tmp1 = record.w2ui["colspan"];
        const tmp2 = this.columns[col_ind].field;
        if (tmp1 && tmp1[tmp2] === 0) {
          delete tmp1[tmp2];
        }
      }
      if ((col_ind < (this.last.vscroll.colIndStart ?? 0) || col_ind > (this.last.vscroll.colIndEnd ?? Infinity)) && !col.frozen) {
        col_ind++;
        continue;
      }
      if (record.w2ui) {
        if (typeof record.w2ui["colspan"] == "object") {
          const span = parseInt(record.w2ui["colspan"][col.field]) || null;
          if (span != null && span > 1) {
            let hcnt = 0;
            for (let i = col_ind; i < col_ind + span; i++) {
              if (i >= this.columns.length) break;
              if (this.columns[i].hidden) hcnt++;
            }
            col_span = span - hcnt;
            col_skip = span - 1;
          }
        }
      }
      const rec_cell = this.getCellHTML(ind, col_ind, summary, col_span);
      if (col.frozen) rec_html1 += rec_cell;
      else rec_html2 += rec_cell;
      col_ind++;
    }
    rec_html1 += '<td class="w2ui-grid-data-last"></td>';
    rec_html2 += '<td class="w2ui-grid-data-last" col="end"></td>';
    rec_html1 += "</tr>";
    rec_html2 += "</tr>";
    return [rec_html1, rec_html2];
  }
  getLineHTML(lineNum) {
    return "<div>" + lineNum + "</div>";
  }
  getCellHTML(ind, col_ind, summary, col_span) {
    const obj = this;
    const col = this.columns[col_ind];
    if (col == null) return "";
    const record = summary !== true ? this.records[ind] : this.summary[ind];
    let { value, style, className, attr, divAttr, title } = this.getCellValue(ind, col_ind, summary, true);
    const edit = ind !== -1 ? this.getCellEditable(ind, col_ind) : "";
    let divStyle = "max-height: " + this.recordHeight + "px;" + (col.clipboardCopy ? "margin-right: 20px" : "");
    const isChanged = !summary && record?.w2ui?.["changes"] && record.w2ui["changes"][col.field] != null;
    const sel = this.last.selection;
    let isRowSelected = false;
    let infoBubble = "";
    if (sel.indexes.indexOf(ind) != -1) isRowSelected = true;
    if (col_span == null) {
      if (record?.w2ui?.["colspan"] && record.w2ui["colspan"][col.field]) {
        col_span = record.w2ui["colspan"][col.field];
      } else {
        col_span = 1;
      }
    }
    if (col_ind === this.hierarchyColumn && Array.isArray(record?.w2ui?.children)) {
      let level = 0;
      let subrec = record.w2ui.parent_recid != null ? this.get(record.w2ui.parent_recid, true) : null;
      while (true) {
        if (subrec != null) {
          level++;
          const tmp = this.records[subrec].w2ui;
          if (tmp != null && tmp.parent_recid != null) {
            subrec = this.get(tmp.parent_recid, true);
          } else {
            break;
          }
        } else {
          break;
        }
      }
      if (record.w2ui.parent_recid) {
        for (let i = 0; i < level; i++) {
          infoBubble += '<span class="w2ui-show-children w2ui-icon-empty"></span>';
        }
      }
      const className2 = record.w2ui?.children?.length > 0 ? record.w2ui.expanded ? "w2ui-icon-collapse" : "w2ui-icon-expand" : "w2ui-icon-empty";
      if (record.w2ui?.children?.length > 0) {
        infoBubble += `<span class="w2ui-show-children ${className2}"></span>`;
      }
    }
    if (col["info"] === true) col["info"] = {};
    if (col["info"] != null) {
      let infoIcon = "w2ui-icon-info";
      if (typeof col["info"].icon == "function") {
        infoIcon = col["info"].icon(record, { self: this, index: ind, colIndex: col_ind, summary: !!summary });
      } else if (typeof col["info"].icon == "object") {
        infoIcon = col["info"].icon[this.parseField(record, col.field)] || "";
      } else if (typeof col["info"].icon == "string") {
        infoIcon = col["info"].icon;
      }
      let infoStyle = col["info"].style || "";
      if (typeof col["info"].style == "function") {
        infoStyle = col["info"].style(record, { self: this, index: ind, colIndex: col_ind, summary: !!summary });
      } else if (typeof col["info"].style == "object") {
        infoStyle = col["info"].style[this.parseField(record, col.field)] || "";
      } else if (typeof col["info"].style == "string") {
        infoStyle = col["info"].style;
      }
      infoBubble += `<span class="w2ui-info ${infoIcon}" style="${infoStyle}"></span>`;
    }
    let data = value;
    if (edit && ["checkbox", "check"].indexOf(edit.type) != -1) {
      const changeInd = summary ? -(ind + 1) : ind;
      divStyle += "text-align: center;";
      data = `<input tabindex="-1" type="checkbox" class="w2ui-editable-checkbox"
                            data-changeInd="${changeInd}" data-colInd="${col_ind}" ${data ? 'checked="checked"' : ""}>`;
      infoBubble = "";
    }
    data = `<div style="${divStyle}" ${getTitle(data, title)} ${divAttr}>${infoBubble}${String(data)}</div>`;
    if (data == null) data = "";
    if (typeof col.render == "string") {
      const tmp = col.render.replace("|", ":").split(":");
      if (["number", "int", "float", "money", "currency", "percent", "size"].includes(tmp[0])) {
        style += "text-align: right;";
      }
    }
    if (record?.w2ui) {
      if (record.w2ui.styles == null) {
        record.w2ui.styles = record.w2ui["style"];
      }
      if (typeof record.w2ui.styles == "object") {
        if (typeof record.w2ui.styles[col_ind] == "string") style += record.w2ui.styles[col_ind] + ";";
        if (typeof record.w2ui.styles[col.field] == "string") style += record.w2ui.styles[col.field] + ";";
      }
      if (typeof record.w2ui["class"] == "object") {
        if (typeof record.w2ui["class"][col_ind] == "string") className += record.w2ui["class"][col_ind] + " ";
        if (typeof record.w2ui["class"][col.field] == "string") className += record.w2ui["class"][col.field] + " ";
      }
    }
    let isCellSelected = false;
    if (isRowSelected && sel.columns[ind]?.includes(col_ind)) isCellSelected = true;
    let clipboardIcon;
    if (col.clipboardCopy) {
      clipboardIcon = '<span class="w2ui-clipboard-copy w2ui-icon-paste"></span>';
    }
    data = '<td class="w2ui-grid-data' + (isCellSelected ? " w2ui-selected" : "") + " " + className + (isChanged ? " w2ui-changed" : "") + '"    id="grid_' + this.name + "_data_" + ind + "_" + col_ind + '" col="' + col_ind + '"    style="' + style + (col.style != null ? col.style : "") + '" ' + (col.attr != null ? col.attr : "") + attr + ((col_span ?? 0) > 1 ? 'colspan="' + col_span + '"' : "") + ">" + data + (clipboardIcon && w2utils.stripTags(data) ? clipboardIcon : "") + "</td>";
    if (ind === -1 && summary === true) {
      data = '<td class="w2ui-grid-data" col="' + col_ind + '" style="height: 0px; ' + style + '" ' + ((col_span ?? 0) > 1 ? 'colspan="' + col_span + '"' : "") + "></td>";
    }
    return data;
    function getTitle(cellData, title2) {
      if (title2 === void 0 && obj.show.recordTitles) {
        if (col["title"] != null) {
          if (typeof col["title"] == "function") {
            title2 = col["title"].call(obj, record, { self: obj, index: ind, colIndex: col_ind, summary: !!summary });
          }
          if (typeof col["title"] == "string") title2 = col["title"];
        } else {
          title2 = w2utils.stripTags(String(cellData).replace(/"/g, "''"));
        }
      }
      return title2 != null ? 'title="' + String(title2) + '"' : "";
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clipboardCopy(ind, col_ind, summary) {
    const rec = summary ? this.summary[ind] : this.records[ind];
    const col = this.columns[col_ind];
    let txt = col ? this.parseField(rec, col.field) : "";
    if (col && typeof col.clipboardCopy == "function") {
      txt = col.clipboardCopy(rec, { self: this, index: ind, colIndex: col_ind, summary: !!summary });
    }
    query9(this.box).find("#grid_" + this.name + "_focus").text(txt).get(0).select();
    document.execCommand("copy");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showBubble(ind, col_ind, summary) {
    const info = this.columns[col_ind]?.["info"];
    if (!info) return;
    let html = "";
    const rec = this.records[ind];
    const el = query9(this.box).find(`${summary ? ".w2ui-grid-summary" : ""} #grid_${this.name}_data_${ind}_${col_ind} .w2ui-info`);
    if (this.last.bubbleEl) {
      w2tooltip4.hide(this.name + "-bubble");
    }
    this.last.bubbleEl = el;
    if (info.fields == null) {
      info.fields = [];
      for (let i = 0; i < this.columns.length; i++) {
        const col = this.columns[i];
        info.fields.push(col.field + (typeof col.render == "string" ? ":" + col.render : ""));
      }
    }
    let fields = info.fields;
    if (typeof fields == "function") {
      fields = fields(rec, { self: this, index: ind, colIndex: col_ind, summary: !!summary });
    }
    if (typeof info.render == "function") {
      html = info.render(rec, { self: this, index: ind, colIndex: col_ind, summary: !!summary });
    } else if (Array.isArray(fields)) {
      html = '<table cellpadding="0" cellspacing="0">';
      for (let i = 0; i < fields.length; i++) {
        const tmp = String(fields[i]).split(":");
        if (tmp[0] == "" || tmp[0] == "-" || tmp[0] == "--" || tmp[0] == "---") {
          html += '<tr><td colspan=2><div style="border-top: ' + (tmp[0] == "" ? "0" : "1") + 'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>';
          continue;
        }
        let col = this.getColumn(tmp[0] ?? "");
        if (col == null) col = { field: tmp[0] ?? "", text: tmp[0] ?? "", caption: tmp[0] };
        let val = col ? this.parseField(rec, col.field) : "";
        if (rec?.w2ui?.["changes"]?.[col.field] != null) {
          val = rec.w2ui["changes"][col.field];
        }
        if (tmp.length > 1) {
          if (w2utils.formatters[tmp[1] ?? ""]) {
            const extra = {
              self: this,
              value: val,
              params: tmp[2] || null,
              field: this.columns[col_ind].field,
              index: ind,
              colIndex: col_ind
            };
            val = w2utils.formatters[tmp[1]].call(this, rec, extra);
          } else {
            console.log('ERROR: w2utils.formatters["' + tmp[1] + '"] does not exists.');
          }
        }
        if (typeof val == "object" && val.text != null) val = val.text;
        if (info.showEmpty !== true && (val == null || val == "")) continue;
        if (info.maxLength != null && typeof val == "string" && val.length > info.maxLength) val = val.substr(0, info.maxLength) + "...";
        html += "<tr><td>" + col.text + "</td><td>" + ((val === 0 ? "0" : val) || "") + "</td></tr>";
      }
      html += "</table>";
    } else if (w2utils.isPlainObject(fields)) {
      html = '<table cellpadding="0" cellspacing="0">';
      for (const caption in fields) {
        const fld = fields[caption];
        if (fld == "" || fld == "-" || fld == "--" || fld == "---") {
          html += '<tr><td colspan=2><div style="border-top: ' + (fld == "" ? "0" : "1") + 'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>';
          continue;
        }
        const tmp = String(fld).split(":");
        let col = this.getColumn(tmp[0] ?? "");
        if (col == null) col = { field: tmp[0] ?? "", text: tmp[0] ?? "", caption: tmp[0] };
        let val = col ? this.parseField(rec, col.field) : "";
        if (rec?.w2ui?.["changes"]?.[col.field] != null) {
          val = rec.w2ui["changes"][col.field];
        }
        if (tmp.length > 1) {
          if (w2utils.formatters[tmp[1] ?? ""]) {
            const extra = {
              self: this,
              value: val,
              params: tmp[2] || null,
              field: this.columns[col_ind].field,
              index: ind,
              colIndex: col_ind
            };
            val = w2utils.formatters[tmp[1]].call(this, rec, extra);
          } else {
            console.log('ERROR: w2utils.formatters["' + tmp[1] + '"] does not exists.');
          }
        }
        if (typeof fld == "function") {
          val = fld(rec, { self: this, index: ind, colIndex: col_ind, summary: !!summary });
        }
        if (val?.text != null) val = val.text;
        if (info.showEmpty !== true && (val == null || val == "")) continue;
        if (info.maxLength != null && typeof val == "string" && val.length > info.maxLength) val = val.substr(0, info.maxLength) + "...";
        html += "<tr><td>" + caption + "</td><td>" + ((val === 0 ? "0" : val) || "") + "</td></tr>";
      }
      html += "</table>";
    }
    return w2tooltip4.show(w2utils.extend({
      name: this.name + "-bubble",
      html,
      anchor: el.get(0),
      position: "top|bottom",
      class: "w2ui-info-bubble",
      style: "",
      hideOn: ["doc-click"]
    }, info.options ?? {})).hide(() => [
      this.last.bubbleEl = null
    ]);
  }
  // return null or the editable object if the given cell is editable
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCellEditable(ind, col_ind) {
    const col = this.columns[col_ind];
    const rec = this.records[ind];
    if (!rec || !col) return null;
    let edit = rec.w2ui ? rec.w2ui["editable"] : null;
    if (edit === false) return null;
    if (edit == null || edit === true) {
      edit = Object.keys(col["editable"] ?? {}).length > 0 ? col["editable"] : null;
      if (typeof col["editable"] === "function") {
        const value = this.getCellValue(ind, col_ind, false);
        edit = col["editable"].call(this, rec, { self: this, value, index: ind, colIndex: col_ind });
      }
    }
    return edit;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCellValue(ind, col_ind, summary, extra) {
    const col = this.columns[col_ind];
    const record = summary !== true ? this.records[ind] : this.summary[ind];
    let value = this.parseField(record, col.field);
    let className = "", style = "", attr = "", divAttr = "";
    let title;
    if (record?.w2ui?.["changes"]?.[col.field] != null) {
      value = record.w2ui["changes"][col.field];
    }
    if (col.render != null && ind !== -1) {
      let render = col.render;
      let params;
      if (typeof render == "string") {
        const tmp = render.toLowerCase().replace("|", ":").split(":");
        let func = w2utils.formatters[tmp[0] ?? ""];
        if (col["options"] && col["options"].autoFormat === false) {
          func = void 0;
        }
        render = func;
        params = tmp[1];
      }
      if (typeof render == "function" && record != null) {
        let html;
        try {
          html = render.call(this, record, {
            // any: unified call for both formatter and column render
            self: this,
            value,
            params,
            field: this.columns[col_ind].field,
            index: ind,
            colIndex: col_ind,
            summary: !!summary
          });
        } catch (e) {
          throw new Error(`Render function for column "${col.field}" in grid "${this.name}": -- ` + e.message);
        }
        if (html != null && typeof html == "object" && typeof html != "function") {
          if (html.id != null && html.text != null) {
            value = html.text;
          } else if (typeof html.html == "string" || typeof html.html == "number") {
            value = String(html.html ?? "").trim();
          } else {
            value = "";
            console.log(
              "ERROR: render function should return a primitive or an object of the following structure.",
              { html: "", attr: "", style: "", class: "", divAttr: "" },
              "... but it returned:",
              html
            );
          }
          attr = html.attr ?? "";
          style = html.style ?? "";
          className = html.class ?? "";
          divAttr = html.divAttr ?? "";
          title = html.title;
        } else {
          value = String(html || "").trim();
        }
      }
      if (typeof render == "object") {
        const tmp = render[value];
        if (tmp != null && tmp !== "") {
          value = tmp;
        }
      }
    }
    if (value == null) value = "";
    return !extra ? value : { value, attr, style, className, divAttr, title };
  }
  getFooterHTML() {
    return '<div>    <div class="w2ui-footer-left"></div>    <div class="w2ui-footer-right"></div>    <div class="w2ui-footer-center"></div></div>';
  }
  status(msg) {
    if (msg != null) {
      query9(this.box).find(`#grid_${this.name}_footer`).find(".w2ui-footer-left").html(msg);
    } else {
      let msgLeft = "";
      const sel = this.getSelection();
      if (sel.length > 0) {
        if (this.show.statusSelection && sel.length > 1) {
          msgLeft = String(sel.length).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + w2utils.settings.groupSymbol) + " " + w2utils.lang("selected");
        }
        if (this.show.statusRecordID && sel.length == 1) {
          let tmp = sel[0];
          if (typeof tmp == "object") tmp = tmp.recid + ", " + w2utils.lang("Column") + ": " + tmp.column;
          msgLeft = w2utils.lang("Record ID") + ": " + tmp + " ";
        }
      }
      query9(this.box).find("#grid_" + this.name + "_footer .w2ui-footer-left").html(msgLeft);
    }
  }
  lock(msg, showSpinner) {
    const args = [this.box, msg, showSpinner];
    setTimeout(() => {
      query9(this.box).find("#grid_" + this.name + "_empty_msg").remove();
      w2utils.lock(...args);
    }, 10);
  }
  unlock(speed) {
    setTimeout(() => {
      if (query9(this.box).find(".w2ui-message").hasClass("w2ui-closing")) return;
      w2utils.unlock(this.box, speed);
    }, 25);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateSave(returnOnly) {
    const state = {
      // any: state blob is serialized JSON
      columns: [],
      show: w2utils.clone(this.show),
      last: {
        search: this.last.search,
        multi: this.last.multi,
        logic: this.last.logic,
        label: this.last.label,
        field: this.last.field,
        scrollTop: this.last.vscroll.scrollTop,
        scrollLeft: this.last.vscroll.scrollLeft
      },
      sortData: [],
      searchData: []
    };
    let prop_val;
    for (let i = 0; i < this.columns.length; i++) {
      const col = this.columns[i];
      const col_save_obj = {};
      Object.keys(this.stateColProps).forEach((prop, _idx) => {
        if (this.stateColProps[prop]) {
          if (col[prop] !== void 0) {
            prop_val = col[prop];
          } else {
            prop_val = this.colTemplate[prop] || null;
          }
          col_save_obj[prop] = prop_val;
        }
      });
      state.columns.push(col_save_obj);
    }
    for (let i = 0; i < this.sortData.length; i++) state.sortData.push(w2utils.clone(this.sortData[i]));
    for (let i = 0; i < this.searchData.length; i++) state.searchData.push(w2utils.clone(this.searchData[i]));
    const edata = this.trigger("stateSave", { target: this.name, state });
    if (edata.isCancelled === true) {
      return;
    }
    if (returnOnly !== true) {
      this.cacheSave("state", state);
    }
    edata.finish();
    return state;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateRestore(newState) {
    const url = this.url?.get ?? this.url;
    if (!newState) {
      newState = this.cache("state");
    }
    const edata = this.trigger("stateRestore", { target: this.name, state: newState });
    if (edata.isCancelled === true) {
      return;
    }
    if (w2utils.isPlainObject(newState)) {
      w2utils.extend(this.show, newState.show ?? {});
      w2utils.extend(this.last, newState.last ?? {});
      const sTop = this.last.vscroll.scrollTop;
      const sLeft = this.last.vscroll.scrollLeft;
      for (let c = 0; c < newState.columns?.length; c++) {
        const tmp = newState.columns[c];
        const col_index = this.getColumn(tmp.field, true);
        if (col_index !== null) {
          w2utils.extend(this.columns[col_index], tmp);
          if (c !== col_index) this.columns.splice(c, 0, this.columns.splice(col_index, 1)[0]);
        }
      }
      this.sortData.splice(0, this.sortData.length);
      for (let c = 0; c < newState.sortData?.length; c++) {
        this.sortData.push(newState.sortData[c]);
      }
      this.searchData.splice(0, this.searchData.length);
      for (let c = 0; c < newState.searchData?.length; c++) {
        this.searchData.push(newState.searchData[c]);
      }
      setTimeout(() => {
        if (!url) {
          if (this.sortData.length > 0) this.localSort();
          if (this.searchData.length > 0) this.localSearch();
        }
        this.last.vscroll.scrollTop = sTop;
        this.last.vscroll.scrollLeft = sLeft;
        this.refresh();
      }, 1);
      console.log(`INFO (w2ui): state restored for "${this.name}"`);
    }
    edata.finish();
    return true;
  }
  stateReset() {
    this.stateRestore(this.last.state);
    this.cacheSave("state", null);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseField(obj, field) {
    let val;
    if (this.nestedFields) {
      val = w2utils.getNested(obj, field);
    } else {
      val = obj?.[field];
    }
    return val != null ? val : "";
  }
  prepareData() {
    const obj = this;
    for (let r = 0; r < this.records.length; r++) {
      const rec = this.records[r];
      prepareRecord(rec);
    }
    function prepareRecord(rec) {
      for (let c = 0; c < obj.columns.length; c++) {
        const column = obj.columns[c];
        if (rec[column.field] == null || typeof column.render != "string") continue;
        if (["number", "int", "float", "money", "currency", "percent"].indexOf(column.render.split(":")[0] ?? "") != -1) {
          if (typeof rec[column.field] != "number") rec[column.field] = parseFloat(rec[column.field]);
        }
        if (["date", "age"].indexOf(column.render.split(":")[0] ?? "") != -1) {
          if (!rec[column.field + "_"]) {
            let dt = rec[column.field];
            if (w2utils.isInt(dt)) dt = parseInt(dt);
            rec[column.field + "_"] = new Date(dt);
          }
        }
        if (["time"].indexOf(column.render) != -1) {
          if (w2utils.isTime(rec[column.field])) {
            const tmp = w2utils.isTime(rec[column.field], true);
            const dt = /* @__PURE__ */ new Date();
            dt.setHours(tmp.hours, tmp.minutes, tmp.seconds ? tmp.seconds : 0, 0);
            if (!rec[column.field + "_"]) rec[column.field + "_"] = dt;
          } else {
            let tmp = rec[column.field];
            if (w2utils.isInt(tmp)) tmp = parseInt(tmp);
            tmp = tmp != null ? new Date(tmp) : /* @__PURE__ */ new Date();
            const dt = /* @__PURE__ */ new Date();
            dt.setHours(tmp.getHours(), tmp.getMinutes(), tmp.getSeconds(), 0);
            if (!rec[column.field + "_"]) rec[column.field + "_"] = dt;
          }
        }
      }
      if (rec.w2ui?.children && rec.w2ui?.expanded !== true) {
        for (let r = 0; r < rec.w2ui.children.length; r++) {
          const subRec = rec.w2ui.children[r];
          prepareRecord(subRec);
        }
      }
    }
  }
  nextCell(index, col_ind, editable) {
    const check = col_ind + 1;
    if (check >= this.columns.length) {
      const nextIdx = this.nextRow(index);
      return nextIdx == null ? null : this.nextCell(nextIdx, -1, editable);
    }
    const tmp = this.records[index]?.w2ui;
    const col = this.columns[check];
    const span = tmp && tmp["colspan"] && col != null && !isNaN(tmp["colspan"][col.field]) ? parseInt(tmp["colspan"][col.field]) : 1;
    if (col == null) return null;
    if (col && col.hidden || span === 0) return this.nextCell(index, check, editable);
    if (editable) {
      const edit = this.getCellEditable(index, check);
      if (edit == null || ["checkbox", "check"].indexOf(edit.type) != -1) {
        return this.nextCell(index, check, editable);
      }
    }
    return { index, colIndex: check };
  }
  prevCell(index, col_ind, editable) {
    const check = col_ind - 1;
    if (check < 0) {
      const prevIdx = this.prevRow(index);
      return prevIdx == null ? null : this.prevCell(prevIdx, this.columns.length, editable);
    }
    if (check < 0) return null;
    const tmp = this.records[index]?.w2ui;
    const col = this.columns[check];
    const span = tmp && tmp["colspan"] && col != null && !isNaN(tmp["colspan"][col.field]) ? parseInt(tmp["colspan"][col.field]) : 1;
    if (col == null) return null;
    if (col && col.hidden || span === 0) return this.prevCell(index, check, editable);
    if (editable) {
      const edit = this.getCellEditable(index, check);
      if (edit == null || ["checkbox", "check"].indexOf(edit.type) != -1) {
        return this.prevCell(index, check, editable);
      }
    }
    return { index, colIndex: check };
  }
  nextRow(ind, col_ind, numRows) {
    const sids = this.last.searchIds;
    let ret = null;
    if (numRows == null) numRows = 1;
    if (numRows == -1) {
      return this.records.length - 1;
    }
    if (ind + numRows < this.records.length && sids.length === 0 || sids.length > 0 && ind < (sids[sids.length - numRows] ?? 0)) {
      ind += numRows;
      if (sids.length > 0) while (true) {
        if (sids.includes(ind) || ind > this.records.length) break;
        ind += numRows;
      }
      const tmp = this.records[ind]?.w2ui;
      const col = col_ind != null ? this.columns[col_ind] : void 0;
      const span = tmp && tmp["colspan"] && col != null && !isNaN(tmp["colspan"][col.field]) ? parseInt(tmp["colspan"][col.field]) : 1;
      if (span === 0 || tmp?.selectable === false) {
        ret = this.nextRow(ind, col_ind, numRows);
      } else {
        ret = ind;
      }
    }
    return ret;
  }
  prevRow(ind, col_ind, numRows) {
    const sids = this.last.searchIds;
    let ret = null;
    if (numRows == null) numRows = 1;
    if (numRows == -1) {
      return 0;
    }
    if (ind - numRows >= 0 && sids.length === 0 || sids.length > 0 && ind > (sids[0] ?? 0)) {
      ind -= numRows;
      if (sids.length > 0) while (true) {
        if (sids.includes(ind) || ind < 0) break;
        ind -= numRows;
      }
      const tmp = this.records[ind]?.w2ui;
      const col = col_ind != null ? this.columns[col_ind] : void 0;
      const span = tmp && tmp["colspan"] && col != null && !isNaN(tmp["colspan"][col.field]) ? parseInt(tmp["colspan"][col.field]) : 1;
      if (span === 0 || tmp?.selectable === false) {
        ret = this.prevRow(ind, col_ind, numRows);
        if (ret == null) ret = ind;
      } else {
        ret = ind;
      }
    }
    return ret;
  }
  selectionSave() {
    this.last.saved_sel = this.getSelection();
    return this.last.saved_sel;
  }
  selectionRestore(noRefresh) {
    const time = Date.now();
    this.last.selection = { indexes: [], columns: {} };
    const sel = this.last.selection;
    const lst = this.last.saved_sel;
    if (lst) for (let i = 0; i < lst.length; i++) {
      if (w2utils.isPlainObject(lst[i])) {
        const tmp = this.get(lst[i].recid, true);
        if (tmp != null) {
          if (sel.indexes.indexOf(tmp) == -1) sel.indexes.push(tmp);
          if (!sel.columns[tmp]) sel.columns[tmp] = [];
          sel.columns[tmp].push(lst[i].column);
        }
      } else {
        const tmp = this.get(lst[i], true);
        if (tmp != null) sel.indexes.push(tmp);
      }
    }
    delete this.last.saved_sel;
    if (noRefresh !== true) this.refresh();
    return Date.now() - time;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message(options) {
    return w2utils.message({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      owner: this,
      // any: w2grid.lock signature differs from owner.lock type
      box: this.box,
      after: ".w2ui-grid-header"
    }, options);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  confirm(options) {
    return w2utils.confirm({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      owner: this,
      // any: w2grid.lock signature differs from owner.lock type
      box: this.box,
      after: ".w2ui-grid-header"
    }, options);
  }
};

// src/w2layout.ts
var query10 = query;
var w2ui3 = w2ui;
var w2panels = ["top", "left", "main", "preview", "right", "bottom"];
var w2layout = class extends w2base {
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
  // any: w2base dynamic event handlers
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
      this.panels[ind] = w2utils.extend({}, this.panel_template, panel);
      if (w2utils.isPlainObject(panel.tabs) || Array.isArray(panel.tabs)) initTabs(this, panel.type);
      if (w2utils.isPlainObject(panel.toolbar) || Array.isArray(panel.toolbar)) initToolbar(this, panel.type);
    });
    w2panels.forEach((tab) => {
      if (this.get(tab) != null) return;
      this.panels.push(w2utils.extend({}, this.panel_template, { type: tab, hidden: tab !== "main", size: 50 }));
    });
    if (typeof this.box == "string") this.box = query10(this.box).get(0);
    if (this.box) this.render(this.box);
    function initTabs(object, panel, tabs) {
      const pan = panel != null ? object.get(panel) : null;
      if (pan != null && tabs == null) tabs = pan.tabs;
      if (pan == null || tabs == null) return false;
      if (Array.isArray(tabs)) tabs = { tabs };
      const name = object.name + "_" + (panel ?? "") + "_tabs";
      if (w2ui3[name]) w2ui3[name].destroy();
      pan.tabs = new w2tabs(w2utils.extend({}, tabs, { owner: object, name: object.name + "_" + (panel ?? "") + "_tabs" }));
      pan.show.tabs = true;
      return true;
    }
    function initToolbar(object, panel, toolbar) {
      const pan = panel != null ? object.get(panel) : null;
      if (pan != null && toolbar == null) toolbar = pan.toolbar;
      if (pan == null || toolbar == null) return false;
      if (Array.isArray(toolbar)) toolbar = { items: toolbar };
      const name = object.name + "_" + (panel ?? "") + "_toolbar";
      if (w2ui3[name]) w2ui3[name].destroy();
      pan.toolbar = new w2toolbar(w2utils.extend({}, toolbar, { owner: object, name: object.name + "_" + (panel ?? "") + "_toolbar" }));
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
      query10(this.box).find("#layout_" + this.name + "_panel_css").html("<style>" + data + "</style>");
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
    const current = query10(this.box).find(pname + '> [data-role="panel-content"]');
    let panelTop = 0;
    if (current.length > 0) {
      ;
      query10(this.box).find(pname).get(0).scrollTop = 0;
      panelTop = query10(current).css("top");
    }
    if (typeof p.html.unmount == "function") p.html.unmount();
    current.addClass("w2ui-panel-content");
    current.removeAttr("style");
    this.resizeBoxes(panel);
    if (p.html === "") {
      p.html = data;
      this.refresh(panel);
    } else {
      p.html = data;
      if (!p.hidden) {
        if (transition != null && transition !== "") {
          query10(this.box).addClass("animating");
          const div1 = query10(this.box).find(pname + '> [data-role="panel-content"]');
          div1.after('<div class="w2ui-panel-content new-panel" data-role="panel-content" style="' + div1[0].style.cssText + '"></div>');
          const div2 = query10(this.box).find(pname + '> [data-role="panel-content"].new-panel');
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
              style1 = "left: -" + w2utils.getSize(query10(this.box), "width") + "px";
              style2 = "left: 0px";
              break;
            case "slide-right":
              style1 = "left: " + w2utils.getSize(query10(this.box), "width") + "px";
              style2 = "left: 0px";
              break;
            case "slide-down":
              style1 = "top: -" + w2utils.getSize(query10(this.box), "height") + "px";
              style2 = "top: " + panelTop + "px";
              break;
            case "slide-up":
              style1 = "top: " + w2utils.getSize(query10(this.box), "height") + "px";
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
            query10(this.box).removeClass("animating");
            div1.remove();
            div2.removeClass("new-panel current");
            query10(this.box).find(pname + '> [data-role="panel-content"]').css({ "cssText": "" });
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
    const box = query10(this.box).find("#layout_" + this.name + "_panel_" + p.type);
    const oldOverflow = box.css("overflow");
    box.css("overflow", "hidden");
    const prom = w2utils.message({
      owner: this,
      // any: query().get(0) returns Node|Node[]; panel element is HTMLElement
      box: box.get(0),
      after: ".w2ui-panel-title",
      param: panel
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
    const box = query10(this.box).find("#layout_" + this.name + "_panel_" + p.type);
    const oldOverflow = box.css("overflow");
    box.css("overflow", "hidden");
    const prom = w2utils.confirm({
      owner: this,
      // any: query().get(0) returns Node|Node[]; panel element is HTMLElement
      box: box.get(0),
      after: ".w2ui-panel-title",
      param: panel
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
    query10(this.box).find(":scope > div > .w2ui-panel").css("transition", instant !== true ? ".2s" : "0s");
    setTimeout(() => {
      this.set(panel, { size });
    }, 1);
    setTimeout(() => {
      query10(this.box).find(":scope > div > .w2ui-panel").css("transition", "0s");
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
      query10(this.box).find("#layout_" + this.name + "_panel_" + panel).css({ "opacity": "1" });
      edata.finish();
      this.resize();
    } else {
      query10(this.box).addClass("animating");
      query10(this.box).find("#layout_" + this.name + "_panel_" + panel).css({ "opacity": "0" });
      query10(this.box).find(":scope > div > .w2ui-panel").css("transition", ".2s");
      setTimeout(() => {
        this.resize();
      }, 1);
      setTimeout(() => {
        query10(this.box).find("#layout_" + this.name + "_panel_" + panel).css({ "opacity": "1" });
      }, 250);
      setTimeout(() => {
        query10(this.box).find(":scope > div > .w2ui-panel").css("transition", "0s");
        query10(this.box).removeClass("animating");
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
      query10(this.box).find("#layout_" + this.name + "_panel_" + panel).css({ "opacity": "0" });
      edata.finish();
      this.resize();
    } else {
      query10(this.box).addClass("animating");
      query10(this.box).find(":scope > div > .w2ui-panel").css("transition", ".2s");
      query10(this.box).find("#layout_" + this.name + "_panel_" + panel).css({ "opacity": "0" });
      setTimeout(() => {
        this.resize();
      }, 1);
      setTimeout(() => {
        query10(this.box).find(":scope > div > .w2ui-panel").css("transition", "0s");
        query10(this.box).removeClass("animating");
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
    w2utils.extend(this.panels[ind], options);
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
    const el = query10(this.box).find("#layout_" + this.name + "_panel_" + panel + '> [data-role="panel-content"]');
    if (el.length != 1) return null;
    return el[0];
  }
  hideToolbar(panel) {
    const pan = this.get(panel);
    if (!pan) return;
    pan.show.toolbar = false;
    query10(this.box).find(`#layout_${this.name}_panel_${panel} > [data-role="panel-toolbar"]`).hide();
    this.resize();
  }
  showToolbar(panel) {
    const pan = this.get(panel);
    if (!pan) return;
    pan.show.toolbar = true;
    query10(this.box).find(`#layout_${this.name}_panel_${panel} > [data-role="panel-toolbar"]`).show();
    this.resize();
  }
  toggleToolbar(panel) {
    const pan = this.get(panel);
    if (!pan) return;
    if (pan.show.toolbar) this.hideToolbar(panel);
    else this.showToolbar(panel);
  }
  assignToolbar(panel, toolbar) {
    if (typeof toolbar == "string" && w2ui3[toolbar] != null) toolbar = w2ui3[toolbar];
    const pan = this.get(panel);
    pan.toolbar = toolbar;
    const tmp = query10(this.box).find(panel + '> [data-role="panel-toolbar"]');
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
    query10(this.box).find("#layout_" + this.name + "_panel_" + panel + '> [data-role="panel-tabs"]').hide();
    this.resize();
  }
  showTabs(panel) {
    const pan = this.get(panel);
    if (!pan) return;
    pan.show.tabs = true;
    query10(this.box).find("#layout_" + this.name + "_panel_" + panel + '> [data-role="panel-tabs"]').show();
    this.resize();
  }
  toggleTabs(panel) {
    const pan = this.get(panel);
    if (!pan) return;
    if (pan.show.tabs) this.hideTabs(panel);
    else this.showTabs(panel);
  }
  assignTabs(panel, tabs) {
    if (typeof tabs == "string" && w2ui3[tabs] != null) tabs = w2ui3[tabs];
    const pan = this.get(panel);
    pan.tabs = tabs;
    const tmp = query10(this.box).find(panel + '> [data-role="panel-tabs"]');
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
    if (typeof box == "string") box = query10(box).get(0);
    const edata = this.trigger("render", { target: this.name, box: box ?? this.box });
    if (edata.isCancelled === true) return;
    if (box != null) {
      this.unmount();
      this.box = box;
    }
    if (!this.box) return false;
    query10(this.box).attr("name", this.name).addClass("w2ui-layout").html("<div></div>");
    if (query10(this.box).length > 0) {
      ;
      query10(this.box)[0].style.cssText += this.style;
    }
    for (let p1 = 0; p1 < w2panels.length; p1++) {
      const html = '<div id="layout_' + this.name + "_panel_" + w2panels[p1] + '" class="w2ui-panel">    <div class="w2ui-panel-title"></div>    <div class="w2ui-panel-tabs" data-role="panel-tabs"></div>    <div class="w2ui-panel-toolbar" data-role="panel-toolbar"></div>    <div class="w2ui-panel-content" data-role="panel-content"></div></div><div id="layout_' + this.name + "_resizer_" + w2panels[p1] + '" class="w2ui-resizer"></div>';
      query10(this.box).find(":scope > div").append(html);
    }
    query10(this.box).find(":scope > div").append('<div id="layout_' + this.name + '_panel_css" style="position: absolute; top: 10000px;"></div>');
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
      query10(document).off("mousemove", self.last["events"].mouseMove).on("mousemove", self.last["events"].mouseMove);
      query10(document).off("mouseup", self.last["events"].mouseUp).on("mouseup", self.last["events"].mouseUp);
      self.last["resize"] = {
        type,
        x: evnt.screenX,
        y: evnt.screenY,
        diff_x: 0,
        diff_y: 0,
        value: 0
      };
      w2panels.forEach((panel) => {
        const $tmp = query10(self.el(panel)).find(".w2ui-lock");
        if ($tmp.length > 0) {
          $tmp.data("locked", "yes");
        } else {
          self.lock(panel, { opacity: 0 });
        }
      });
      const el = query10(self.box).find("#layout_" + self.name + "_resizer_" + type).get(0);
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
      query10(document).off("mousemove", self.last["events"].mouseMove);
      query10(document).off("mouseup", self.last["events"].mouseUp);
      if (self.last["resize"] == null) return;
      w2panels.forEach((panel) => {
        const $tmp = query10(self.el(panel)).find(".w2ui-lock");
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
        const width = w2utils.getSize(query10(self.box), "width");
        const height = w2utils.getSize(query10(self.box), "height");
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
      query10(self.box).find("#layout_" + self.name + "_resizer_" + self.last["resize"].type).removeClass(null).addClass("active");
      query10(self.box).find("#layout_" + self.name + "_resizer_" + self.last["resize"].type).removeClass("active");
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
      const p = query10(self.box).find("#layout_" + self.name + "_resizer_" + tmp.type);
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
    if (w2ui3[this.name] == null) return false;
    this.panels.forEach((panel) => {
      ;
      panel.tabs?.destroy?.();
      panel.toolbar?.destroy?.();
    });
    if (query10(this.box).find("#layout_" + this.name + "_panel_main").length > 0) {
      this.unmount();
    }
    delete w2ui3[this.name];
    edata.finish();
    if (this.last["events"] && this.last["events"].resize) {
      query10(window).off("resize", this.last["events"].resize);
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
      query10(self.box).find(pname).css({ display: p.hidden ? "none" : "block" });
      if (p.resizable) {
        query10(self.box).find(rname).show();
      } else {
        query10(self.box).find(rname).hide();
      }
      if (typeof p.html == "object" && typeof p.html.render === "function") {
        ;
        p.html.box = query10(self.box).find(pname + '> [data-role="panel-content"]')[0];
        setTimeout(() => {
          if (query10(self.box).find(pname + '> [data-role="panel-content"]').length > 0) {
            const $content = query10(self.box).find(pname + '> [data-role="panel-content"]').removeClass(null).removeAttr("name").addClass("w2ui-panel-content");
            $content.css("overflow", p.overflow)[0].style.cssText += ";" + p.style;
          }
          if (p.html && typeof p.html.render == "function") {
            ;
            p.html.render();
          }
        }, 1);
      } else {
        if (query10(self.box).find(pname + '> [data-role="panel-content"]').length > 0) {
          const $content = query10(self.box).find(pname + '> [data-role="panel-content"]').removeClass(null).removeAttr("name").addClass("w2ui-panel-content");
          $content.html(p.html).css("overflow", p.overflow)[0].style.cssText += ";" + p.style;
        }
      }
      let tmp = query10(self.box).find(pname + '> [data-role="panel-tabs"]');
      if (p.show.tabs) {
        if (tmp.attr("name") != p.tabs?.name && p.tabs != null) {
          ;
          p.tabs.render(tmp.get(0));
        } else {
          ;
          p.tabs.refresh();
        }
        tmp.addClass("w2ui-panel-tabs");
      } else {
        ;
        tmp.html("").removeAttr("name").removeClass(null);
        tmp.css("display", "none").hide();
      }
      tmp = query10(self.box).find(pname + '> [data-role="panel-toolbar"]');
      if (p.show.toolbar) {
        if (tmp.attr("name") != p.toolbar?.name && p.toolbar != null) {
          ;
          p.toolbar.render(tmp.get(0));
        } else {
          ;
          p.toolbar.refresh();
        }
        tmp.addClass("w2ui-panel-toolbar");
      } else {
        ;
        tmp.html("").removeAttr("name").removeClass(null);
        tmp.css("display", "none").hide();
      }
      tmp = query10(self.box).find(pname + "> .w2ui-panel-title");
      if (p.title) {
        ;
        tmp.html(p.title).show();
      } else {
        ;
        tmp.html("").hide();
      }
    } else {
      if (query10(self.box).find("#layout_" + self.name + "_panel_main").length === 0) {
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
    const width = w2utils.getSize(query10(this.box), "width");
    const height = w2utils.getSize(query10(this.box), "height");
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
      query10(this.box).find("#layout_" + this.name + "_panel_top").css({
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
        query10(this.box).find("#layout_" + this.name + "_resizer_top").css({
          "display": "block",
          "left": l + "px",
          "top": t + "px",
          "width": w + "px",
          "height": h + "px",
          "cursor": "ns-resize"
        }).off("mousedown").on("mousedown", function(event2) {
          event2.preventDefault();
          const edata2 = self.trigger("resizerClick", { target: "top", originalEvent: event2 });
          if (edata2.isCancelled === true) return;
          w2ui3[self.name].last.events.resizeStart("top", event2);
          edata2.finish();
          return false;
        });
      }
    } else {
      query10(this.box).find("#layout_" + this.name + "_panel_top").hide();
      query10(this.box).find("#layout_" + this.name + "_resizer_top").hide();
    }
    if (pleft != null && pleft.hidden !== true) {
      l = 0;
      t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0);
      w = pleft.sizeCalculated;
      h = height - (stop ? ptop.sizeCalculated + this.padding : 0) - (sbottom ? pbottom.sizeCalculated + this.padding : 0);
      query10(this.box).find("#layout_" + this.name + "_panel_left").css({
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
        query10(this.box).find("#layout_" + this.name + "_resizer_left").css({
          "display": "block",
          "left": l + "px",
          "top": t + "px",
          "width": w + "px",
          "height": h + "px",
          "cursor": "ew-resize"
        }).off("mousedown").on("mousedown", function(event2) {
          event2.preventDefault();
          const edata2 = self.trigger("resizerClick", { target: "left", originalEvent: event2 });
          if (edata2.isCancelled === true) return;
          w2ui3[self.name].last.events.resizeStart("left", event2);
          edata2.finish();
          return false;
        });
      }
    } else {
      query10(this.box).find("#layout_" + this.name + "_panel_left").hide();
      query10(this.box).find("#layout_" + this.name + "_resizer_left").hide();
    }
    if (pright != null && pright.hidden !== true) {
      l = width - pright.sizeCalculated;
      t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0);
      w = pright.sizeCalculated;
      h = height - (stop ? ptop.sizeCalculated + this.padding : 0) - (sbottom ? pbottom.sizeCalculated + this.padding : 0);
      query10(this.box).find("#layout_" + this.name + "_panel_right").css({
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
        query10(this.box).find("#layout_" + this.name + "_resizer_right").css({
          "display": "block",
          "left": l + "px",
          "top": t + "px",
          "width": w + "px",
          "height": h + "px",
          "cursor": "ew-resize"
        }).off("mousedown").on("mousedown", function(event2) {
          event2.preventDefault();
          const edata2 = self.trigger("resizerClick", { target: "right", originalEvent: event2 });
          if (edata2.isCancelled === true) return;
          w2ui3[self.name].last.events.resizeStart("right", event2);
          edata2.finish();
          return false;
        });
      }
    } else {
      query10(this.box).find("#layout_" + this.name + "_panel_right").hide();
      query10(this.box).find("#layout_" + this.name + "_resizer_right").hide();
    }
    if (pbottom != null && pbottom.hidden !== true) {
      l = 0;
      t = height - pbottom.sizeCalculated;
      w = width;
      h = pbottom.sizeCalculated;
      query10(this.box).find("#layout_" + this.name + "_panel_bottom").css({
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
        query10(this.box).find("#layout_" + this.name + "_resizer_bottom").css({
          "display": "block",
          "left": l + "px",
          "top": t + "px",
          "width": w + "px",
          "height": h + "px",
          "cursor": "ns-resize"
        }).off("mousedown").on("mousedown", function(event2) {
          event2.preventDefault();
          const edata2 = self.trigger("resizerClick", { target: "bottom", originalEvent: event2 });
          if (edata2.isCancelled === true) return;
          w2ui3[self.name].last.events.resizeStart("bottom", event2);
          edata2.finish();
          return false;
        });
      }
    } else {
      query10(this.box).find("#layout_" + this.name + "_panel_bottom").hide();
      query10(this.box).find("#layout_" + this.name + "_resizer_bottom").hide();
    }
    l = 0 + (sleft ? pleft.sizeCalculated + this.padding : 0);
    t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0);
    w = width - (sleft ? pleft.sizeCalculated + this.padding : 0) - (sright ? pright.sizeCalculated + this.padding : 0);
    h = height - (stop ? ptop.sizeCalculated + this.padding : 0) - (sbottom ? pbottom.sizeCalculated + this.padding : 0) - (sprev ? pprev.sizeCalculated + this.padding : 0);
    query10(this.box).find("#layout_" + this.name + "_panel_main").css({
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
      query10(this.box).find("#layout_" + this.name + "_panel_preview").css({
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
        query10(this.box).find("#layout_" + this.name + "_resizer_preview").css({
          "display": "block",
          "left": l + "px",
          "top": t + "px",
          "width": w + "px",
          "height": h + "px",
          "cursor": "ns-resize"
        }).off("mousedown").on("mousedown", function(event2) {
          event2.preventDefault();
          const edata2 = self.trigger("resizerClick", { target: "preview", originalEvent: event2 });
          if (edata2.isCancelled === true) return;
          w2ui3[self.name].last.events.resizeStart("preview", event2);
          edata2.finish();
          return false;
        });
      }
    } else {
      query10(this.box).find("#layout_" + this.name + "_panel_preview").hide();
      query10(this.box).find("#layout_" + this.name + "_resizer_preview").hide();
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
          const el = query10(this.box).find(tmp2 + ".w2ui-panel-title").css({ top: topHeight + "px", display: "block" });
          topHeight += w2utils.getSize(el, "height");
        }
        if (pan.show.tabs) {
          const el = query10(this.box).find(tmp2 + '[data-role="panel-tabs"]').css({ top: topHeight + "px", display: "block" });
          topHeight += w2utils.getSize(el, "height");
        }
        if (pan.show.toolbar) {
          const el = query10(this.box).find(tmp2 + '[data-role="panel-toolbar"]').css({ top: topHeight + "px", display: "block" });
          topHeight += w2utils.getSize(el, "height");
        }
      }
      query10(this.box).find(tmp2 + '[data-role="panel-content"]').css({
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
    w2utils.lock("#layout_" + this.name + "_panel_" + panel, msg, showSpinner);
  }
  unlock(panel, speed) {
    if (w2panels.indexOf(panel) == -1) {
      console.log("ERROR: First parameter needs to be the a valid panel name.");
      return;
    }
    const nm = "#layout_" + this.name + "_panel_" + panel;
    w2utils.unlock(nm, speed);
  }
};

// src/w2sidebar.ts
var query11 = query;
var w2sidebar = class extends w2base {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodes;
  // any: sidebar node tree has dynamic shape
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selected;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  img;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon;
  style;
  hasFocus;
  flat;
  flatButton;
  keyboard;
  editable;
  reorder;
  tabIndex;
  routeData;
  multi;
  skipRefresh;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  last;
  // any: accumulates move, renaming, observeResize
  node_template;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(options) {
    super(options.name);
    this.name = "";
    this.box = null;
    this["sidebar"] = null;
    this["parent"] = null;
    this.nodes = [];
    this["menu"] = [];
    this.routeData = {};
    this.selected = null;
    this.icon = null;
    this.style = "";
    this["topHTML"] = "";
    this["bottomHTML"] = "";
    this.multi = false;
    this.editable = false;
    this.reorder = false;
    this.flatButton = false;
    this.keyboard = true;
    this.flat = false;
    this.hasFocus = false;
    this["levelPadding"] = 12;
    this["toggleAlign"] = "right";
    this.skipRefresh = false;
    this.tabIndex = null;
    this["handle"] = { width: 0, style: "", text: "", tooltip: "" };
    this["badge"] = null;
    this["onClick"] = null;
    this["onSelect"] = null;
    this["onUnselect"] = null;
    this["onDblClick"] = null;
    this["onMouseEnter"] = null;
    this["onMouseLeave"] = null;
    this["onContextMenu"] = null;
    this["onMenuClick"] = null;
    this["onExpand"] = null;
    this["onCollapse"] = null;
    this["onKeydown"] = null;
    this["onRender"] = null;
    this["onRefresh"] = null;
    this["onResize"] = null;
    this["onDestroy"] = null;
    this["onFocus"] = null;
    this["onBlur"] = null;
    this["onFlat"] = null;
    this["onEdit"] = null;
    this["onRename"] = null;
    this["onReorder"] = null;
    this["onDragStart"] = null;
    this["onDragOver"] = null;
    this.node_template = {
      id: null,
      text: "",
      order: null,
      count: null,
      icon: null,
      nodes: [],
      style: "",
      // additional style for subitems
      route: null,
      selected: false,
      expanded: false,
      hidden: false,
      disabled: false,
      group: false,
      // if true, it will build as a group
      groupShowHide: true,
      collapsible: false,
      plus: false,
      // if true, plus will be shown even if there is no sub nodes
      childOffset: 0,
      // events
      onClick: null,
      onDblClick: null,
      onContextMenu: null,
      onExpand: null,
      onCollapse: null,
      // internal
      parent: null,
      // node object
      sidebar: null
    };
    this.last = {
      badge: {},
      renaming: false,
      move: null
      // object, move details
    };
    const nodes = options.nodes;
    delete options.nodes;
    Object.assign(this, options);
    if (Array.isArray(nodes)) this.add(nodes);
    options.nodes = nodes;
    if (typeof this.box == "string") this.box = query11(this.box).get(0);
    if (this.box) this.render(this.box);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  add(parent, nodes) {
    if (nodes === void 0) {
      nodes = parent;
      parent = this;
    }
    if (typeof parent == "string") parent = this.get(parent);
    if (parent == null || parent == "") parent = this;
    return this.insert(parent, null, nodes);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  insert(parent, before, nodes) {
    let txt, ind, tmp, node, nd;
    if (nodes === void 0 && typeof parent == "string") {
      nodes = before;
      before = parent;
      if (before != null) {
        ind = this.get(before);
        if (ind == null) {
          if (!Array.isArray(nodes)) nodes = [nodes];
          if (nodes[0].caption != null && nodes[0].text == null) {
            console.log("NOTICE: sidebar node.caption property is deprecated, please use node.text. Node -> ", nodes[0]);
            nodes[0].text = nodes[0].caption;
          }
          txt = nodes[0].text;
          console.log('ERROR: Cannot insert node "' + txt + '" because cannot find node "' + before + '" to insert before.');
          return null;
        }
        parent = this.get(before).parent;
      } else {
        parent = this;
      }
    }
    if (typeof parent == "string") parent = this.get(parent);
    if (parent == null || parent == "") parent = this;
    if (!Array.isArray(nodes)) nodes = [nodes];
    for (let o = 0; o < nodes.length; o++) {
      node = nodes[o];
      if (node.caption != null && node.text == null) {
        console.log("NOTICE: sidebar node.caption property is deprecated, please use node.text");
        node.text = node.caption;
      }
      if (typeof node.id == null) {
        txt = node.text;
        console.log('ERROR: Cannot insert node "' + txt + '" because it has no id.');
        continue;
      }
      if (this.get(this, node.id) != null) {
        console.log("ERROR: Cannot insert node with id=" + node.id + " (text: " + node.text + ") because another node with the same id already exists.");
        continue;
      }
      tmp = Object.assign({}, this.node_template, node);
      tmp.sidebar = this;
      tmp.parent = parent;
      nd = tmp.nodes || [];
      tmp.nodes = [];
      if (before == null) {
        parent.nodes.push(tmp);
      } else {
        ind = this.get(parent, before, true);
        if (ind == null) {
          console.log('ERROR: Cannot insert node "' + node.text + '" because cannot find node "' + before + '" to insert before.');
          return null;
        }
        parent.nodes.splice(ind, 0, tmp);
      }
      if (nd.length > 0) {
        this.insert(tmp, null, nd);
      }
    }
    if (!this.skipRefresh) this.refresh(parent.id);
    return tmp;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remove(...args) {
    let effected = 0;
    let lastNode = null;
    args.forEach((arg) => {
      const node = this.get(arg);
      if (node == null) return;
      if (this.selected != null) {
        if (Array.isArray(this.selected)) {
          this.selected.splice(this.selected.indexOf(node.id), 1);
        } else if (this.selected === node.id) {
          this.selected = null;
        }
      }
      const ind = this.get(node.parent, arg, true);
      if (ind == null) return;
      if (node.parent.nodes[ind].selected) node["sidebar"].unselect(node.id);
      node.parent.nodes.splice(ind, 1);
      node.parent.collapsible = node.parent.nodes.length > 0;
      lastNode = node;
      effected++;
    });
    if (!this.skipRefresh) {
      if (effected > 0 && arguments.length == 1 && lastNode != null) this.refresh(lastNode.parent.id);
      else this.refresh();
    }
    return effected;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(parent, id, node) {
    if (node === void 0) {
      node = id;
      id = parent;
      parent = this;
    }
    if (typeof parent == "string") parent = this.get(parent);
    if (parent.nodes == null) return null;
    for (let i = 0; i < parent.nodes.length; i++) {
      if (parent.nodes[i].id === id) {
        const res = this.update(id, node);
        if (Object.keys(res).length != 0) {
          const nodes = node.nodes;
          w2utils.extend(parent.nodes[i], node, nodes != null ? { nodes: [] } : {});
          if (nodes != null) {
            this.add(parent.nodes[i], nodes);
          }
          if (!this.skipRefresh) this.refresh(id);
        }
        return true;
      } else {
        const rv = this.set(parent.nodes[i], id, node);
        if (rv) return true;
      }
    }
    return false;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get(parent, id, returnIndex) {
    if (arguments.length === 0) {
      const all = [];
      const tmp = this.find({});
      for (let t = 0; t < tmp.length; t++) {
        if (tmp[t].id != null) all.push(tmp[t].id);
      }
      return all;
    } else {
      if (arguments.length == 1 || arguments.length == 2 && id === true) {
        returnIndex = id;
        id = parent;
        parent = this;
      }
      if (typeof parent == "string") parent = this.get(parent);
      if (parent.nodes == null) return null;
      for (let i = 0; i < parent.nodes.length; i++) {
        if (parent.nodes[i].id == id) {
          if (returnIndex === true) return i;
          else return parent.nodes[i];
        } else {
          const rv = this.get(parent.nodes[i], id, returnIndex);
          if (rv || rv === 0) return rv;
        }
      }
      return null;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCount(id, count, options = {}) {
    const node = this.get(id);
    if (node.group) {
      console.log(`Node "${id}" is a group and groups cannot have counts or badges.`);
      return;
    }
    this.last.badge[id] = {
      className: options.className ?? "",
      style: options.style ?? ""
    };
    const btn = query11(this.box).find(`#node_${w2utils.escapeId(id)} .w2ui-node-badge`);
    if (btn.length > 0) {
      const $cnt = btn.removeClass(null).addClass(`w2ui-node-badge ${options.className ?? "w2ui-node-count"}`).text(count);
      $cnt.get(0).style.cssText = options.style || "";
      const item = this.get(id);
      item.count = count;
    } else if (!options.noRepeat) {
      this.set(id, { count });
      options.noRepeat = true;
      queueMicrotask(() => this.setCount(id, count, options));
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  find(parent, params, results) {
    if (arguments.length == 1) {
      params = parent;
      parent = this;
    }
    if (!results) results = [];
    if (typeof parent == "string") parent = this.get(parent);
    if (parent.nodes == null) return results;
    for (let i = 0; i < parent.nodes.length; i++) {
      let match = true;
      for (const prop in params) {
        if (parent.nodes[i][prop] != params[prop]) match = false;
      }
      if (match) results.push(parent.nodes[i]);
      if (parent.nodes[i].nodes.length > 0) results = this.find(parent.nodes[i], params, results);
    }
    return results;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sort(options, nodes) {
    if (!options || typeof options != "object") options = {};
    if (options.foldersFirst == null) options.foldersFirst = true;
    if (options.caseSensitive == null) options.caseSensitive = false;
    if (options.reverse == null) options.reverse = false;
    if (nodes == null) {
      nodes = this.nodes;
    }
    nodes.sort((a, b) => {
      const isAfolder = a.nodes && a.nodes.length > 0;
      const isBfolder = b.nodes && b.nodes.length > 0;
      if (options.foldersFirst === false || !isAfolder && !isBfolder || isAfolder && isBfolder) {
        let aText = a.text;
        let bText = b.text;
        if (a.order != null) aText = a.order;
        if (b.order != null) bText = b.order;
        if (!options.caseSensitive) {
          aText = aText.toLowerCase();
          bText = bText.toLowerCase();
        }
        const cmp = w2utils.naturalCompare(aText, bText);
        return (cmp === 1 || cmp === -1) & (options.reverse ? 1 : 0) ? -cmp : cmp;
      }
      if (isAfolder && !isBfolder) {
        return !options.reverse ? -1 : 1;
      }
      if (!isAfolder && isBfolder) {
        return !options.reverse ? 1 : -1;
      }
    });
    nodes.forEach((node) => {
      if (node.nodes && node.nodes.length > 0) {
        this.sort(options, node.nodes);
      }
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  each(fn, nodes) {
    if (nodes == null) nodes = this.nodes;
    nodes.forEach((node) => {
      fn.call(this, node);
      if (node.nodes && node.nodes.length > 0) {
        this.each(fn, node.nodes);
      }
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search(str, compare = null) {
    let count = 0;
    const str2 = str.toLowerCase();
    this.each((node) => {
      let match = false;
      if (typeof compare == "function") {
        match = compare(str, node);
      } else {
        match = !(node.text.toLowerCase().indexOf(str2) === -1);
      }
      if (match) {
        count++;
        showParents(node);
        node.hidden = false;
      } else {
        node.hidden = true;
      }
    });
    this.refresh();
    return count;
    function showParents(node) {
      if (node.parent) {
        node.parent.hidden = false;
        showParents(node.parent);
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  show(...args) {
    const effected = [];
    args.forEach((it) => {
      const node = this.get(it);
      if (node == null || node.hidden === false) return;
      node.hidden = false;
      effected.push(node.id);
    });
    if (effected.length > 0) {
      if (args.length == 1) this.refresh(args[0]);
      else this.refresh();
    }
    return effected;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hide(...args) {
    const effected = [];
    args.forEach((it) => {
      const node = this.get(it);
      if (node == null || node.hidden === true) return;
      node.hidden = true;
      effected.push(node.id);
    });
    if (effected.length > 0) {
      if (args.length == 1) this.refresh(args[0]);
      else this.refresh();
    }
    return effected;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enable(...args) {
    const effected = [];
    args.forEach((it) => {
      const node = this.get(it);
      if (node == null || node.disabled === false) return;
      node.disabled = false;
      effected.push(node.id);
    });
    if (effected.length > 0) {
      if (args.length == 1) this.refresh(args[0]);
      else this.refresh();
    }
    return effected;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  disable(...args) {
    const effected = [];
    args.forEach((it) => {
      const node = this.get(it);
      if (node == null || node.disabled === true) return;
      node.disabled = true;
      if (node.selected) this.unselect(node.id);
      effected.push(node.id);
    });
    if (effected.length > 0) {
      if (args.length == 1) this.refresh(args[0]);
      else this.refresh();
    }
    return effected;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select(id) {
    if (Array.isArray(id)) {
      [...id].forEach((id2) => this.select(id2));
      return;
    }
    const new_node = this.get(id);
    if (!new_node) return false;
    const edata = this.trigger("select", { target: id, id, node: new_node });
    if (edata.isCancelled === true) {
      return true;
    }
    if (!this.multi && this.selected == id && new_node.selected) {
      return false;
    } else {
      this.find({ selected: true }).forEach((nd) => nd.selected = false);
    }
    const $el = query11(this.box).find("#node_" + w2utils.escapeId(id));
    $el.addClass("w2ui-selected").find(".w2ui-icon").addClass("w2ui-icon-selected");
    if ($el.length > 0) {
      if (!this.inView(id)) this.scrollIntoView(id);
    }
    new_node.selected = true;
    if (this.multi) {
      if (!Array.isArray(this.selected)) {
        this.selected = this.selected ? [this.selected] : [];
      }
      this.selected.push(id);
    } else {
      this.selected = this.multi ? [id] : id;
    }
    edata.finish();
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unselect(id) {
    if (arguments.length === 0) {
      id = this.selected;
    }
    if (Array.isArray(id)) {
      [...id].forEach((id2) => this.unselect(id2));
      return;
    }
    const current = this.get(id);
    if (!current) return false;
    const edata = this.trigger("unselect", { target: id, id, node: current });
    if (edata.isCancelled === true) {
      return true;
    }
    current.selected = false;
    query11(this.box).find("#node_" + w2utils.escapeId(id)).removeClass("w2ui-selected").find(".w2ui-icon").removeClass("w2ui-icon-selected");
    if (typeof this.selected == "string" && this.selected == id) {
      this.selected = null;
    }
    if (this.multi && Array.isArray(this.selected)) {
      const ind = this.selected.indexOf(id);
      if (ind != -1) this.selected.splice(ind, 1);
    }
    edata.finish();
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toggle(id) {
    const nd = this.get(id);
    if (nd == null) return false;
    if (nd.plus) {
      this.set(id, { plus: false });
      this.expand(id);
      this.refresh(id);
      return;
    }
    if (nd.nodes.length === 0) return false;
    if (!nd.collapsible) return false;
    if (this.get(id).expanded) return this.collapse(id);
    else return this.expand(id);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collapse(id) {
    const nd = this.get(id);
    if (nd == null) return false;
    const edata = this.trigger("collapse", { target: id, object: nd, node: nd });
    if (edata.isCancelled === true) return;
    query11(this.box).find("#node_" + w2utils.escapeId(id) + "_sub").hide();
    query11(this.box).find("#node_" + w2utils.escapeId(id) + " .w2ui-expanded").removeClass("w2ui-expanded").addClass("w2ui-collapsed");
    nd.expanded = false;
    edata.finish();
    this.refresh(id);
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expand(id) {
    const nd = this.get(id);
    const edata = this.trigger("expand", { target: id, object: nd, node: nd });
    if (edata.isCancelled === true) return;
    query11(this.box).find("#node_" + w2utils.escapeId(id) + "_sub").show();
    query11(this.box).find("#node_" + w2utils.escapeId(id) + " .w2ui-collapsed").removeClass("w2ui-collapsed").addClass("w2ui-expanded");
    nd.expanded = true;
    edata.finish();
    this.refresh(id);
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collapseAll(parent) {
    if (parent == null) parent = this;
    if (typeof parent == "string") parent = this.get(parent);
    if (parent.nodes == null) return false;
    for (let i = 0; i < parent.nodes.length; i++) {
      if (parent.nodes[i].expanded === true) parent.nodes[i].expanded = false;
      if (parent.nodes[i].nodes && parent.nodes[i].nodes.length > 0) this.collapseAll(parent.nodes[i]);
    }
    this.refresh(parent.id);
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expandAll(parent) {
    if (parent == null) parent = this;
    if (typeof parent == "string") parent = this.get(parent);
    if (parent.nodes == null) return false;
    for (let i = 0; i < parent.nodes.length; i++) {
      if (parent.nodes[i].expanded === false) parent.nodes[i].expanded = true;
      if (parent.nodes[i].nodes && parent.nodes[i].nodes.length > 0) this.expandAll(parent.nodes[i]);
    }
    this.refresh(parent.id);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expandParents(id) {
    const node = this.get(id);
    if (node == null) return false;
    if (node.parent) {
      if (!node.parent.expanded) {
        node.parent.expanded = true;
        this.refresh(node.parent.id);
      }
      this.expandParents(node.parent.id);
    }
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  click(id, event2) {
    const nd = this.get(id);
    if (nd == null) return;
    if (nd.disabled || nd.group) {
      const edata = this.trigger("click", { target: id, originalEvent: event2, node: nd, object: nd });
      edata.finish();
      return;
    }
    const newNode = query11(this.box).find("#node_" + w2utils.escapeId(id));
    newNode.addClass("w2ui-selected").find(".w2ui-icon").addClass("w2ui-icon-selected");
    setTimeout(() => {
      const edata = this.trigger("click", { target: id, originalEvent: event2, node: nd, object: nd });
      if (edata.isCancelled === true) {
        newNode.removeClass("w2ui-selected").find(".w2ui-icon").removeClass("w2ui-icon-selected");
        return;
      }
      if (this.multi) {
        const mev = event2;
        const isShift = mev?.shiftKey ?? false;
        const isCtrl = (mev?.ctrlKey || mev?.metaKey) ?? false;
        if (typeof this.selected == "string") {
          this.selected = [this.selected];
        }
        if (isCtrl && !isShift) {
          if (this.selected?.includes(id)) {
            this.unselect(id);
            return;
          } else {
            this.select(id);
          }
        } else if (!isCtrl && isShift) {
          const chain = this.getChain();
          const ind1 = Math.min(this.selected.map((sel) => chain.indexOf(sel)));
          const ind2 = chain.indexOf(id);
          for (let i = Math.min(ind1, ind2); i < chain.length && i <= Math.max(ind1, ind2); i++) {
            const node = this.get(chain[i]);
            if (!this.selected.includes(chain[i]) && node.hidden != true) {
              this.select(chain[i]);
            }
          }
        } else {
          const ids = this.selected?.filter((sid) => sid != id && this.selected.includes(sid));
          this.unselect(ids);
          if (!this.selected?.includes(id)) {
            this.select(id);
          }
        }
      } else if (this.selected !== id) {
        if (this.selected != null) this.unselect(this.selected);
        this.select(id);
        if (typeof nd.route == "string") {
          let route = nd.route !== "" ? String("/" + nd.route).replace(/\/{2,}/g, "/") : "";
          const info = w2utils.parseRoute(route);
          if (info.keys.length > 0) {
            for (let k = 0; k < info.keys.length; k++) {
              const routeKey = info.keys[k];
              if (routeKey == null) continue;
              if (this.routeData[routeKey.name] == null) continue;
              route = route.replace(new RegExp(":" + routeKey.name, "g"), this.routeData[routeKey.name]);
            }
          }
          setTimeout(() => {
            window.location.hash = route;
          }, 1);
        }
        if (this.flat) {
          let _getItems2 = function(nodes) {
            const items2 = nodes.map((it) => {
              const items3 = it.nodes.length > 0 ? _getItems2(it.nodes) : null;
              return { id: it.id, text: it.text, icon: it.icon, items: items3 };
            });
            return items2;
          };
          var _getItems = _getItems2;
          const items = _getItems2(nd.nodes);
          if (items.length > 0) {
            this.flatMenu(newNode, items);
          }
        }
      }
      edata.finish();
    }, 1);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  flatMenu(el, items) {
    const self = this;
    const $el = query11(el).find(".w2ui-node-data");
    w2menu.show({
      // any: query().get(0) returns Node|Node[]; anchor is always HTMLElement in flat menu context
      anchor: $el.get(0),
      name: this.name + "_flat-menu",
      items,
      // class: 'w2ui-dark',
      position: "right|left",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSelect(event2) {
        self.unselect();
        self.click(event2.detail.item.id, event2.detail.originalEvent);
      },
      onHide(_event) {
        self.unselect();
      }
    });
    w2tooltip.hide(this.name + "_tooltip");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  focus(event2) {
    const edata = this.trigger("focus", { target: this.name, originalEvent: event2 });
    if (edata.isCancelled === true) return false;
    this.hasFocus = true;
    query11(this.box).find(".w2ui-sidebar-body").addClass("w2ui-focus");
    setTimeout(() => {
      const input = query11(this.box).find("#sidebar_" + this.name + "_focus").get(0);
      if (document.activeElement != input) input.focus();
    }, 10);
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blur(event2) {
    const edata = this.trigger("blur", { target: this.name, originalEvent: event2 });
    if (edata.isCancelled === true) return false;
    this.hasFocus = false;
    query11(this.box).find(".w2ui-sidebar-body").removeClass("w2ui-focus");
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  next(node, noSubs) {
    if (node == null) return null;
    const parent = node.parent;
    const ind = this.get(node.id, true);
    let nextNode = null;
    if (node.expanded && node.nodes.length > 0 && noSubs !== true) {
      const nd = node.nodes[0] ?? null;
      if (nd == null) {
        nextNode = null;
      } else if (nd.hidden || nd.disabled || nd.group) {
        nextNode = this.next(nd);
      } else {
        nextNode = nd;
      }
    } else {
      if (parent && ind + 1 < parent.nodes.length) {
        nextNode = parent.nodes[ind + 1] ?? null;
      } else {
        nextNode = this.next(parent, true);
      }
    }
    if (nextNode != null && (nextNode.hidden || nextNode.disabled || nextNode.group)) nextNode = this.next(nextNode);
    return nextNode;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prev(node) {
    if (node == null) return null;
    const parent = node.parent;
    const ind = this.get(node.id, true);
    const lastChild = (node2) => {
      if (node2.expanded && node2.nodes.length > 0) {
        const nd = node2.nodes[node2.nodes.length - 1] ?? null;
        if (nd == null) return node2;
        if (nd.hidden || nd.disabled || nd.group) return this.prev(nd);
        else return lastChild(nd);
      }
      return node2;
    };
    const prevNodeSource = ind > 0 ? parent.nodes[ind - 1] : null;
    let prevNode = ind > 0 && prevNodeSource != null ? lastChild(prevNodeSource) : parent;
    if (prevNode != null && (prevNode.hidden || prevNode.disabled || prevNode.group)) prevNode = this.prev(prevNode);
    return prevNode;
  }
  // returns ids of expanded elements as a flat array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getChain(nodes, options = {}) {
    options.returnDisabled ??= false;
    options.returnGroups ??= false;
    const ids = [];
    if (nodes == null) nodes = this.nodes;
    nodes.forEach((node) => {
      if (!node.disabled && !node.group || node.disabled && options.returnDisabled || node.group && options.returnGroups) {
        ids.push(node.id);
      }
      if (Array.isArray(node.nodes) && node.expanded) {
        ids.push(...this.getChain(node.nodes, options));
      }
    });
    return ids;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keydown(event2) {
    const self = this;
    const first = Array.isArray(this.selected) ? this.selected[0] : this.selected;
    let nd = this.get(first);
    if (this.keyboard !== true) return;
    if (!nd) nd = this.nodes[0] ?? null;
    if (event2.keyCode == 27) {
      const mv = this.last.move;
      if (mv?.reorder && mv?.moved) {
        mv.restore();
        return;
      }
    }
    const edata = this.trigger("keydown", { target: this.name, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    if (event2.keyCode == 13 || event2.keyCode == 32) {
      if (event2.keyCode == 13 && this.editable && !event2.ctrlKey && !event2.metaKey) {
        this.edit(first);
      } else {
        if (nd.nodes.length > 0) {
          this.toggle(first);
        }
      }
    }
    if (event2.keyCode == 37) {
      if (nd.nodes.length > 0 && nd.expanded) {
        this.collapse(first);
      } else {
        selectNode(nd.parent);
        if (!nd.parent.group) this.collapse(nd.parent.id);
      }
    }
    if (event2.keyCode == 39) {
      if ((nd.nodes.length > 0 || nd.plus) && !nd.expanded) this.expand(first);
    }
    if (event2.keyCode == 38) {
      if (this.get(first) == null) {
        selectNode(this.nodes[0] || null);
      } else {
        selectNode(neighbor(nd, this.prev));
      }
    }
    if (event2.keyCode == 40) {
      if (this.get(first) == null) {
        selectNode(this.nodes[0] || null);
      } else {
        selectNode(neighbor(nd, this.next));
      }
    }
    if ([13, 32, 37, 38, 39, 40].includes(event2.keyCode)) {
      if (event2.preventDefault) event2.preventDefault();
      if (event2.stopPropagation) event2.stopPropagation();
    }
    edata.finish();
    function selectNode(node, event3) {
      if (node != null && !node.hidden && !node.disabled && !node.group) {
        self.click(node.id, event3);
        if (!self.inView(node.id)) self.scrollIntoView(node.id);
      }
    }
    function neighbor(node, neighborFunc) {
      node = neighborFunc.call(self, node);
      while (node != null && (node.hidden || node.disabled)) {
        if (node.group) break;
        else node = neighborFunc(node);
      }
      return node;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inView(id) {
    const item = query11(this.box).find("#node_" + w2utils.escapeId(id)).get(0);
    if (!item) {
      return false;
    }
    const div = query11(this.box).find(".w2ui-sidebar-body").get(0);
    if (!div) return false;
    if (item.offsetTop < div.scrollTop || item.offsetTop + item.clientHeight > div.clientHeight + div.scrollTop) {
      return false;
    }
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollIntoView(id, instant) {
    return new Promise((resolve) => {
      if (id == null) id = Array.isArray(this.selected) ? this.selected[0] : this.selected;
      const nd = this.get(id);
      if (nd == null) return;
      const item = query11(this.box).find("#node_" + w2utils.escapeId(id)).get(0);
      if (item) item.scrollIntoView({ block: "center", inline: "center", behavior: instant ? "auto" : "smooth" });
      setTimeout(() => {
        this.resize();
        resolve();
      }, instant ? 0 : 500);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dblClick(id, event2) {
    const nd = this.get(id);
    const edata = this.trigger("dblClick", { target: id, originalEvent: event2, object: nd });
    if (edata.isCancelled === true) return;
    if (this.editable) {
      this.edit(id);
    } else if (!this.flat) {
      this.toggle(id);
    }
    edata.finish();
  }
  /**
   * This is needed for not reorder
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mouseDown(id, event2) {
    const self = this;
    if (this.reorder) {
      this.last.move = {
        x: event2.screenX,
        y: event2.screenY,
        divX: 0,
        divY: 0,
        reorder: true,
        moved: false
      };
      const mv = this.last.move;
      const body = query11(this.box).find(".w2ui-sidebar-body");
      if (!mv.ghost) {
        const node = query11(this.box).find(`#node_${w2utils.escapeId(id)}`);
        mv.offsetY = event2.offsetY;
        mv.target = id;
        const nodeEl = node.get(0);
        mv.pos = { top: nodeEl.offsetTop - 1, left: nodeEl.offsetLeft };
        const clone = query11(node.find(".w2ui-node-data").get(0).cloneNode(true));
        mv.node = node;
        mv.nodeSub = node.next();
        body.append('<div id="sidebar_' + this.name + '_ghost" class="w2ui-node w2ui-ghost"></div>');
        query11(this.box).find("#sidebar_" + this.name + "_ghost").append(clone);
        mv.ghost = query11(this.box).find("#sidebar_" + this.name + "_ghost");
        mv.ghost.css({ display: "none" });
        mv.restore = () => {
          mv.resetReorder();
          this.refresh();
        };
        mv.resetReorder = () => {
          this.last.move = null;
          query11(this.box).find(`#sidebar_${this.name}_ghost`).remove();
          query11(document).off(`.w2ui-${this.name}-reorder`);
        };
      }
      query11(document).on(`mousemove.w2ui-${this.name}-reorder`, _mouseMove).on(`mouseup.w2ui-${this.name}-reorder`, _mouseStop);
    }
    function _mouseMove(event3) {
      if (!event3.target.tagName) {
        return;
      }
      const mv = self.last.move;
      mv.divX = event3.screenX - mv.x;
      mv.divY = event3.screenY - mv.y;
      if (Math.abs(mv.divX) <= 1 && Math.abs(mv.divY) <= 1) return;
      if (self.reorder == true && mv.reorder && !mv.moved) {
        const edata = self.trigger("dragStart", { target: mv.target, moved: true, node: self.get(mv.target), mv, originalEvent: event3 });
        if (edata.isCancelled === true) {
          mv.restore();
          return;
        }
        const rect = mv.node.get(0).getBoundingClientRect();
        mv.moved = true;
        mv.node.html("").removeAttr("id", "data-id").addClass("w2ui-reorder-empty").css({ height: rect.height + "px" });
        if (mv.node.next().css("display") !== "none") {
          const rect2 = mv.node.next().get(0).getBoundingClientRect();
          mv.node.next().html('<div class="w2ui-reorder-empty-sub"></div>').css({ height: rect2.height + "px" });
        }
        mv.ghost.css({ display: "block" });
        edata.finish();
      }
      mv.ghost.css({
        top: mv.pos.top + mv.divY + "px",
        left: 0
      });
      const over = query11(event3.target).closest(".w2ui-node, .w2ui-node-group");
      const id2 = over.attr("data-id");
      if (query11(event3.target).hasClass("w2ui-sidebar-body") && event3.layerY > 5 && !mv.append) {
        const edata = self.trigger("dragOver", { target: mv.target, append: true, mv, originalEvent: event3 });
        if (edata.isCancelled === true) {
          return;
        }
        mv.ghost.before(mv.node);
        mv.ghost.before(mv.nodeSub);
        mv.append = true;
        mv.moveBefore = null;
        edata.finish();
      } else if (id2 != null && id2 != mv.moveBefore) {
        mv.append = false;
        mv.moveBefore = id2;
        const edata = self.trigger("dragOver", { target: mv.target, moveBefore: id2, mv, originalEvent: event3 });
        if (edata.isCancelled === true) {
          return;
        }
        const el = query11(self.box).find(`#node_${w2utils.escapeId(id2)}`);
        el.before(mv.node);
        el.before(mv.nodeSub);
        edata.finish();
      }
    }
    function _mouseStop(event3) {
      const mv = self.last.move;
      mv.resetReorder();
      if (mv.moved) {
        if (mv.moveBefore != null && mv.target != mv.moveBefore || mv.append) {
          const edata = self.trigger("reorder", { target: mv.target, moveBefore: mv.moveBefore, append: mv.append, originalEvent: event3 });
          if (edata.isCancelled === true) {
            self.refresh();
            return;
          }
          const target = self.get(mv.target);
          const targetInd = target.parent.nodes.indexOf(target);
          const cut = target.parent.nodes.splice(targetInd, 1);
          if (mv.append) {
            self.nodes.push(...cut);
            cut.forEach((nd) => nd.parent = self);
          } else {
            const before = self.get(mv.moveBefore);
            const beforeInd = before.parent.nodes.indexOf(before);
            cut.forEach((nd) => nd.parent = before.parent);
            before.parent.nodes.splice(beforeInd, 0, ...cut);
          }
          self.refresh();
          edata.finish();
        } else {
          self.refresh();
        }
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  edit(id) {
    const self = this;
    const node = query11(this.box).find("#node_" + w2utils.escapeId(id));
    const text = node.find(".w2ui-node-text");
    const edata = this.trigger("edit", { target: id, el: node, textEl: text });
    if (edata.isCancelled === true) {
      return;
    }
    this.last.renaming = true;
    node.addClass("w2ui-editing");
    text.addClass("w2ui-focus").css("pointer-events", "all").attr("contenteditable", w2utils.isFirefox ? "true" : "plaintext-only").on("blur.node-editing", (_event) => {
      setTimeout(_rename, 0);
    }).on("keydown.node-editing", (event2) => {
      const kbdEvent = event2;
      if (kbdEvent.keyCode == 13) _rename(kbdEvent);
      if (kbdEvent.keyCode == 27) _rename(kbdEvent, true);
    });
    text.get(0).focus();
    const original = text.text();
    w2utils.setCursorPosition(text[0], 0, text.text().length);
    edata.finish();
    return text.get(0);
    function _rename(event2, cancel) {
      const renameTo = text.text();
      node.removeClass("w2ui-editing");
      text.removeClass("w2ui-focus").css("pointer-events", "none").removeAttr("contenteditable").off(".node-editing");
      if (!cancel && self.last.renaming && original !== renameTo) {
        const edata2 = self.trigger("rename", { target: id, text_previous: original, text_new: renameTo, originalEvent: event2 });
        if (edata2.isCancelled === true) {
          text.text(original);
          self.last.renaming = false;
          self.focus();
          return;
        }
        self.set(id, { text: renameTo });
        edata2.finish();
      }
      if (cancel) {
        self.set(id, { text: original });
      }
      self.last.renaming = false;
      self.focus();
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contextMenu(id, event2) {
    const nd = this.get(id);
    if (Array.isArray(this.selected)) {
      if (!this.selected.includes(id)) this.click(id);
    } else {
      if (id != this.selected) this.click(id);
    }
    const edata = this.trigger("contextMenu", { target: id, originalEvent: event2, object: nd, allowOnDisabled: false });
    if (edata.isCancelled === true) return;
    if (nd.disabled && !edata.detail["allowOnDisabled"]) return;
    if (this["menu"].length > 0) {
      w2menu.hide(this.name + "_menu");
      const menuAttach = w2menu.show({
        name: this.name + "_menu",
        anchor: document.body,
        contextMenu: true,
        items: this["menu"],
        originalEvent: event2
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      });
      menuAttach?.select?.((evt) => {
        this.menuClick(id, evt.detail);
      });
    }
    if (event2.preventDefault) event2.preventDefault();
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuClick(itemId, detail = {}) {
    const edata = this.trigger("menuClick", { target: itemId, ...detail });
    if (edata.isCancelled === true) return;
    edata.finish();
  }
  goFlat() {
    const edata = this.trigger("flat", { goFlat: !this.flat });
    if (edata.isCancelled === true) return;
    this.flat = !this.flat;
    this.refresh();
    if (this.flat) {
      this.nodes.forEach((node) => {
        if (!node.group) {
          this.collapse(node.id);
          this.collapseAll(node.id);
        }
      });
      this.unselect();
    } else {
      this.nodes.forEach((node) => {
        if (!node.group) {
          this.expand(node.id);
          this.expandAll(node.id);
        }
      });
    }
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render(box) {
    const time = Date.now();
    const obj = this;
    if (typeof box == "string") box = query11(box).get(0);
    const edata = this.trigger("render", { target: this.name, box: box ?? this.box });
    if (edata.isCancelled === true) return;
    if (box != null) {
      this.unmount();
      this.box = box;
    }
    if (!this.box) return;
    query11(this.box).attr("name", this.name).addClass("w2ui-reset w2ui-sidebar").html(`<div>
                <div class="w2ui-sidebar-top"></div>
                <input id="sidebar_${this.name}_focus" ${this.tabIndex ? 'tabindex="' + this.tabIndex + '"' : ""}
                    style="position: absolute; top: 0; right: 1px; width: 1px; z-index: -1; opacity: 0"
                    ${w2utils.isMobile ? "readonly" : ""}/>
                <div class="w2ui-sidebar-body"></div>
                <div class="w2ui-sidebar-bottom"></div>
            </div>`);
    const boxEl3 = query11(this.box).get(0);
    const rect = boxEl3.getBoundingClientRect();
    query11(this.box).find(":scope > div").css({
      width: rect.width + "px",
      height: rect.height + "px"
    });
    boxEl3.style.cssText += this.style;
    let kbd_timer;
    query11(this.box).find("#sidebar_" + this.name + "_focus").on("focus", function(event2) {
      clearTimeout(kbd_timer);
      if (!obj.hasFocus) obj.focus(event2);
    }).on("blur", function(event2) {
      kbd_timer = setTimeout(() => {
        if (obj.hasFocus) {
          obj.blur(event2);
        }
      }, 100);
    }).on("keydown", function(event2) {
      const w2obj = w2ui[obj.name];
      w2obj?.keydown?.call(w2obj, event2);
    });
    query11(this.box).off("mousedown").on("mousedown", function(event2) {
      setTimeout(() => {
        if (["INPUT", "TEXTAREA", "SELECT"].indexOf(event2.target?.tagName?.toUpperCase()) == -1) {
          const $input = query11(obj.box).find("#sidebar_" + obj.name + "_focus");
          const inputEl = $input.get(0);
          if (document.activeElement != inputEl && $input.length > 0) {
            inputEl?.focus();
          }
        }
      }, 1);
    });
    const flatHTML = `<div class="w2ui-flat w2ui-flat-${this.flat ? "right" : "left"}" ${this.flatButton == false ? 'style="display: none"' : ""}></div>`;
    if (this["topHTML"] !== "" || flatHTML !== "") {
      query11(this.box).find(".w2ui-sidebar-top").html(this["topHTML"] + flatHTML);
      query11(this.box).find(".w2ui-sidebar-body").css("top", query11(this.box).find(".w2ui-sidebar-top").get(0)?.clientHeight + "px");
      query11(this.box).find(".w2ui-flat").off("click").on("click", (_event) => {
        this.goFlat();
      });
    }
    if (this["bottomHTML"] !== "") {
      query11(this.box).find(".w2ui-sidebar-bottom").html(this["bottomHTML"]);
      query11(this.box).find(".w2ui-sidebar-body").css("bottom", query11(this.box).find(".w2ui-sidebar-bottom").get(0)?.clientHeight + "px");
    }
    this.last.observeResize = new ResizeObserver(() => {
      this.resize();
    });
    this.last.observeResize.observe(this.box);
    edata.finish();
    this.refresh();
    return Date.now() - time;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update(id, options = {}) {
    const nd = this.get(id);
    let level;
    if (nd) {
      const $el = query11(this.box).find("#node_" + w2utils.escapeId(nd.id));
      if (nd.group) {
        if (options.text) {
          nd.text = options.text;
          $el.find(".w2ui-group-text").replace(typeof nd.text == "function" ? nd.text.call(this, nd) : '<span class="w2ui-group-text">' + nd.text + "</span>");
          delete options.text;
        }
        if (options.class) {
          nd.class = options.class;
          level = $el.data("level");
          $el.get(0).className = "w2ui-node-group w2ui-level-" + level + (nd.class ? " " + nd.class : "");
          delete options.class;
        }
        if (options.style) {
          nd.style = options.style;
          const nextEl = $el.get(0).nextElementSibling;
          if (nextEl) nextEl.setAttribute("style", nd.style + ";" + (!nd.hidden && nd.expanded ? "" : "display: none;"));
          delete options.style;
        }
      } else {
        if (options.icon) {
          const $icon = $el.find(".w2ui-node-image > span");
          if ($icon.length > 0) {
            nd.icon = options.icon;
            $icon[0].className = typeof nd.icon == "function" ? nd.icon.call(this, nd) : nd.icon;
            delete options.icon;
          }
        }
        if (options.count != null) {
          nd.count = options.count;
          let txt = nd.count ?? this["badge"]?.text;
          const style = this["badge"]?.style;
          const last = this.last.badge[nd.id];
          if (typeof txt == "function") txt = txt.call(this, nd, level);
          $el.find(".w2ui-node-badge").html(txt).attr("style", `${style}; ${last?.style ?? ""}`);
          if ($el.find(".w2ui-node-badge").length > 0) delete options.count;
        }
        if (options.class && $el.length > 0) {
          nd.class = options.class;
          level = $el.data("level");
          $el[0].className = "w2ui-node w2ui-level-" + level + (nd.selected ? " w2ui-selected" : "") + (nd.disabled ? " w2ui-disabled" : "") + (nd.class ? " " + nd.class : "");
          delete options.class;
        }
        if (options.text != null) {
          nd.text = options.text;
          $el.find(".w2ui-node-text").html(typeof nd.text == "function" ? nd.text.call(this, nd) : nd.text);
          delete options.text;
        }
        if (options.style && $el.length > 0) {
          const $txt = $el.find(".w2ui-node-text");
          nd.style = options.style;
          $txt[0].setAttribute("style", nd.style);
          delete options.style;
        }
      }
    }
    return options;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refresh(id, options = {}) {
    if (this.box == null) return;
    const body = query11(this.box).find(":scope > div > .w2ui-sidebar-body").get(0);
    const { scrollTop, scrollLeft } = body ?? {};
    const time = Date.now();
    const edata = this.trigger("refresh", {
      target: id != null ? id : this.name,
      nodeId: id != null ? id : null,
      fullRefresh: id != null ? false : true
    });
    if (edata.isCancelled === true) return;
    if (this.flatButton == true) {
      query11(this.box).find(".w2ui-sidebar-top .w2ui-flat").show().removeClass("w2ui-flat-left w2ui-flat-right").addClass(` w2ui-flat-${this.flat ? "right" : "left"}`);
    } else {
      query11(this.box).find(".w2ui-sidebar-top .w2ui-flat").hide();
    }
    const boxEl2 = query11(this.box).get(0);
    query11(this.box).find(":scope > div").removeClass("w2ui-sidebar-flat").addClass(this.flat ? "w2ui-sidebar-flat" : "").css({
      width: (boxEl2?.clientWidth ?? 0) + "px",
      height: (boxEl2?.clientHeight ?? 0) + "px"
    });
    if (this.nodes.length > 0 && this.nodes[0].parent == null) {
      const tmp = this.nodes;
      this.nodes = [];
      this.add(this, tmp);
    }
    const obj = this;
    let node;
    let nodeSubId;
    if (id == null) {
      node = this;
      nodeSubId = ".w2ui-sidebar-body";
    } else {
      node = this.get(id);
      if (node == null) return;
      nodeSubId = "#node_" + w2utils.escapeId(node.id) + "_sub";
    }
    const nodeId = "#node_" + w2utils.escapeId(node.id);
    let nodeHTML;
    if (node !== this) {
      nodeHTML = getNodeHTML(node);
      query11(this.box).find(nodeId).before('<div id="sidebar_' + this.name + '_tmp"></div>');
      query11(this.box).find(nodeId).remove();
      query11(this.box).find(nodeSubId).remove();
      query11(this.box).find("#sidebar_" + this.name + "_tmp").before(nodeHTML);
      query11(this.box).find("#sidebar_" + this.name + "_tmp").remove();
    }
    const div = query11(this.box).find(":scope > div").get(0);
    const scroll = {
      top: div?.scrollTop,
      left: div?.scrollLeft
    };
    const cnt = node == this ? query11(this.box).find(":scope > div > .w2ui-sidebar-body") : query11(body).find(nodeSubId);
    cnt.html("");
    for (let i = 0; i < node.nodes.length; i++) {
      const subNode = node.nodes[i];
      nodeHTML = getNodeHTML(subNode);
      cnt.append(nodeHTML);
      if (subNode.nodes.length !== 0) {
        this.refresh(subNode.id, { recursive: true });
      } else {
        const edata2 = this.trigger("refresh", { target: subNode.id });
        if (edata2.isCancelled === true) return;
        edata2.finish();
      }
    }
    if (div) {
      div.scrollTop = scroll.top ?? 0;
      div.scrollLeft = scroll.left ?? 0;
    }
    if (!options.recursive) {
      const els = query11(this.box).find(`${nodeId}, ${nodeId} .w2ui-eaction, ${nodeSubId} .w2ui-eaction`);
      w2utils.bindEvents(els, this);
      query11(body).prop({ scrollLeft, scrollTop });
    }
    edata.finish();
    return Date.now() - time;
    function getNodeHTML(nd) {
      let html = "";
      let icon = nd.icon;
      if (icon == null) icon = obj.icon;
      let tmp = nd.parent;
      let level = 0;
      while (tmp && tmp.parent != null) {
        tmp = tmp.parent;
        level++;
      }
      if (nd.caption != null && nd.text == null) nd.text = nd.caption;
      if (nd.caption != null) {
        console.log("NOTICE: sidebar node.caption property is deprecated, please use node.text. Node -> ", nd);
        nd.text = nd.caption;
      }
      if (Array.isArray(nd.nodes) && nd.nodes.length > 0) nd.collapsible = true;
      if (nd.group) {
        let text = w2utils.lang(typeof nd.text == "function" ? nd.text.call(obj, nd, level) : nd.text);
        if (String(text).substr(0, 5) != "<span") {
          text = `<span class="w2ui-group-text">${text}</span>`;
        }
        html = `
                    <div id="node_${nd.id}" data-id="${nd.id}" data-level="${level}" style="${nd.hidden ? "display: none" : ""}"
                        class="w2ui-node-group w2ui-level-${level} ${nd.class ? nd.class : ""} w2ui-eaction"
                        data-click="toggle|${nd.id}"
                        data-contextmenu="contextMenu|${nd.id}|event"
                        data-mouseenter="showPlus|this|inherit"
                        data-mouseleave="showPlus|this|transparent">
                        ${nd.groupShowHide && nd.collapsible ? `<span>${!nd.hidden && nd.expanded ? w2utils.lang("Hide") : w2utils.lang("Show")}</span>` : "<span></span>"} ${text}
                    </div>
                    <div class="w2ui-node-sub" id="node_${nd.id}_sub" style="${nd.style}; ${!nd.hidden && nd.expanded ? "" : "display: none;"}">
                </div>`;
        if (obj.flat) {
          html = `
                        <div class="w2ui-node-group" id="node_${nd.id}" data-id="${nd.id}"><span>&#160;</span></div>
                        <div id="node_${nd.id}_sub" style="${nd.style}; ${!nd.hidden && nd.expanded ? "" : "display: none;"}"></div>`;
        }
      } else {
        if (nd.selected && !nd.disabled) {
          if (obj.multi) {
            obj.selected ??= [];
            if (!obj.selected.includes(nd.id)) {
              obj.selected.push(nd.id);
            }
          } else {
            obj.selected = nd.id;
          }
        }
        let image = "";
        if (icon) {
          if (icon instanceof Object) {
            const text2 = typeof icon.text == "function" ? icon.text.call(obj, nd, level) ?? "" : icon.text;
            image = `
                            <div class="w2ui-node-image w2ui-eaction" style="${obj.icon.style ?? ""}; pointer-events: all"
                                data-mouseEnter="mouseAction|Enter|this|${nd.id}|event|icon"
                                data-mouseLeave="mouseAction|Leave|this|${nd.id}|event|icon"
                                data-click="mouseAction|click|this|${nd.id}|event|icon">
                                    ${text2}
                            </div>
                        `;
          } else {
            image = `
                            <div class="w2ui-node-image">
                                <span class="${typeof icon == "function" ? icon.call(obj, nd, level) : icon}"></span>
                            </div>`;
          }
        }
        let expand = "";
        let counts = "";
        if (obj["badge"] != null || nd.count != null) {
          let txt = nd.count ?? obj["badge"]?.text;
          const style = obj["badge"]?.style;
          const last = obj.last.badge[nd.id];
          if (typeof txt == "function") txt = txt.call(obj, nd, level);
          if (txt || txt === 0) {
            counts = `
                            <div class="w2ui-node-badge w2ui-eaction ${nd.count != null ? "w2ui-node-count" : ""} ${last?.className ?? ""}"
                                style="${style ?? ""};${last?.style ?? ""}"
                                data-mouseEnter="mouseAction|Enter|this|${nd.id}|event|badge"
                                data-mouseLeave="mouseAction|Leave|this|${nd.id}|event|badge"
                                data-click="mouseAction|click|this|${nd.id}|event|badge"
                            >
                                ${txt}
                            </div>`;
          }
        }
        const classes = ["w2ui-node", `w2ui-level-${level}`, "w2ui-eaction"];
        if (nd.selected) classes.push("w2ui-selected");
        if (nd.disabled) classes.push("w2ui-disabled");
        if (nd.class) classes.push(nd.class);
        if (nd.collapsible === true) {
          const toggleClasses = ["w2ui-sb-toggle", "w2ui-eaction", nd.expanded ? "w2ui-expanded" : "w2ui-collapsed"];
          if (obj["toggleAlign"] == "left") toggleClasses.push("w2ui-left-toggle");
          expand = `<div class="${toggleClasses.join(" ")}" data-click="toggle|${nd.id}"><span></span></div>`;
          classes.push("w2ui-has-children");
        }
        const text = w2utils.lang(typeof nd.text == "function" ? nd.text.call(obj, nd, level) : nd.text);
        let nodeOffset = nd.parent?.childOffset ?? 0;
        if (level === 0 && nd.collapsible === true && obj["toggleAlign"] == "left") {
          nodeOffset += 12;
        }
        html = `
                    <div id="node_${nd.id}" class="${classes.join(" ")}" data-id="${nd.id}" data-level="${level}"
                        style="${nd.hidden ? "display: none;" : ""}"
                        data-click="click|${nd.id}|event"
                        data-dblclick="dblClick|${nd.id}|event"
                        data-mouseDown="mouseDown|${nd.id}|event"
                        data-contextmenu="contextMenu|${nd.id}|event"
                        data-mouseEnter="mouseAction|Enter|this|${nd.id}|event"
                        data-mouseLeave="mouseAction|Leave|this|${nd.id}|event"
                    >
                        ${obj["handle"].text ? `<div class="w2ui-node-handle w2ui-eaction" style="width: ${obj["handle"].width}px; ${obj["handle"].style}"
                                    data-mouseEnter="mouseAction|Enter|this|${nd.id}|event|handle"
                                    data-mouseLeave="mouseAction|Leave|this|${nd.id}|event|handle"
                                    data-click="mouseAction|click|this|${nd.id}|event|handle"
                                >
                                   ${typeof obj["handle"].text == "function" ? obj["handle"].text.call(obj, nd, level) ?? "" : obj["handle"].text}
                              </div>` : ""}
                      <div class="w2ui-node-data" style="margin-left: ${level * obj["levelPadding"] + nodeOffset + obj["handle"].width}px">
                            ${expand} ${image} ${counts}
                            <div class="w2ui-node-text ${!image ? "no-icon" : ""}" style="${nd.style || ""}">${text}</div>
                       </div>
                    </div>
                    <div class="w2ui-node-sub" id="node_${nd.id}_sub" style="${nd.style}; ${!nd.hidden && nd.expanded ? "" : "display: none;"}"></div>`;
        if (obj.flat) {
          html = `
                        <div id="node_${nd.id}" class="${classes.join(" ")} w2ui-node-flat" data-id="${nd.id}" style="${nd.hidden ? "display: none;" : ""}"
                            data-click="click|${nd.id}|event"
                            data-dblclick="dblClick|${nd.id}|event"
                            data-contextmenu="contextMenu|${nd.id}|event"
                            data-mouseEnter="mouseAction|Enter|this|${nd.id}|event|tooltip"
                            data-mouseLeave="mouseAction|Leave|this|${nd.id}|event|tooltip"
                        >
                            <div class="w2ui-node-data">${image}</div>
                        </div>
                        <div class="w2ui-node-sub" id="node_${nd.id}_sub" style="${nd.style}; ${!nd.hidden && nd.expanded ? "" : "display: none;"}"></div>`;
        }
      }
      return html;
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mouseAction(action, anchor, nodeId, event2, type) {
    let edata;
    const node = this.get(nodeId);
    if (type == null) {
      edata = this.trigger("mouse" + action, { target: node.id, node, originalEvent: event2 });
    }
    if (type == "tooltip") {
      const text = w2utils.lang(typeof node.text == "function" ? node.text.call(this, node) : node.text);
      let tooltip = text + (node.count != null ? ' - <span class="w2ui-node-badge w2ui-node-count">' + node.count + "</span>" : "");
      if (action == "Leave" || this.selected == node.id) tooltip = "";
      this.tooltip(anchor, tooltip);
    }
    if (type == "handle") {
      if (action == "click") {
        const onClick = this["handle"].onClick;
        if (typeof onClick == "function") {
          onClick.call(this, node, event2);
        }
      } else {
        let tooltip = this["handle"].tooltip;
        if (typeof tooltip == "function") {
          tooltip = tooltip.call(this, node, event2);
        }
        if (action == "Leave") tooltip = "";
        this.otherTooltip(anchor, tooltip);
      }
    }
    if (type == "icon") {
      if (action == "click") {
        const onClick = this.icon.onClick;
        if (typeof onClick == "function") {
          onClick.call(this, node, event2);
        }
      } else {
        let tooltip = this.icon.tooltip;
        if (typeof tooltip == "function") {
          tooltip = tooltip.call(this, node, event2);
        }
        if (action == "Leave") tooltip = "";
        this.otherTooltip(anchor, tooltip);
      }
    }
    if (type == "badge") {
      if (action == "click") {
        const onClick = this["badge"]?.onClick;
        if (typeof onClick == "function") {
          onClick.call(this, node, event2);
        }
      } else {
        let tooltip = this["badge"]?.tooltip;
        if (typeof tooltip == "function") {
          tooltip = tooltip.call(this, node, event2);
        }
        if (action == "Leave") tooltip = "";
        this.otherTooltip(anchor, tooltip);
      }
    }
    edata?.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip(el, text) {
    const $el = query11(el).find(".w2ui-node-data");
    if (text !== "") {
      w2tooltip.show({
        // any: query().get(0) returns Node|Node[]; sidebar node-data element is always HTMLElement
        anchor: $el.get(0),
        name: this.name + "_tooltip",
        html: text,
        position: "right|left"
      });
    } else {
      w2tooltip.hide(this.name + "_tooltip");
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  otherTooltip(el, text) {
    if (text !== "") {
      w2tooltip.show({
        anchor: el,
        name: this.name + "_tooltip",
        html: text,
        position: "top|bottom"
      });
    } else {
      w2tooltip.hide(this.name + "_tooltip");
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showPlus(el, color) {
    query11(el).find("span:nth-child(1)").css("color", color);
  }
  resize() {
    const time = Date.now();
    const edata = this.trigger("resize", { target: this.name });
    if (edata.isCancelled === true) return;
    if (this.box != null) {
      const boxEl = query11(this.box).get(0);
      const rect = boxEl.getBoundingClientRect();
      query11(this.box).css("overflow", "hidden");
      query11(this.box).find(":scope > div").css({
        width: rect.width + "px",
        height: rect.height + "px"
      });
    }
    edata.finish();
    return Date.now() - time;
  }
  destroy() {
    const edata = this.trigger("destroy", { target: this.name });
    if (edata.isCancelled === true) return;
    if (query11(this.box).find(".w2ui-sidebar-body").length > 0) {
      this.unmount();
    }
    delete w2ui[this.name];
    edata.finish();
  }
  unmount() {
    super.unmount();
    this.last.observeResize?.disconnect();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lock(msg, showSpinner) {
    w2utils.lock(this.box, msg, showSpinner);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unlock(speed) {
    w2utils.unlock(this.box, speed);
  }
};

// src/w2compat.ts
var w2uiRegistry = w2ui;
(function($) {
  const w2globals = function() {
    const exports2 = {
      w2ui,
      w2utils,
      query,
      w2locale,
      w2event,
      w2base,
      w2popup,
      w2alert,
      w2confirm,
      w2prompt,
      Dialog,
      w2tooltip,
      w2menu,
      w2color,
      w2date,
      Tooltip,
      w2toolbar,
      w2sidebar,
      w2tabs,
      w2layout,
      w2grid,
      w2form,
      w2field
    };
    Object.keys(exports2).forEach((key) => {
      ;
      window[key] = exports2[key];
    });
  };
  const param = String(void 0).split("?")[1] || "";
  if (param == "globals" || param.substr(0, 8) == "globals=") {
    w2globals();
  }
  if (!$) return;
  $.w2globals = w2globals;
  $.fn["w2render"] = function(name) {
    if (this.length > 0) {
      if (typeof name === "string" && w2uiRegistry[name]) w2uiRegistry[name].render(this[0]);
      if (typeof name === "object") name.render(this[0]);
    }
  };
  $.fn["w2destroy"] = function(name) {
    if (!name && this.length > 0) name = this.attr("name");
    if (typeof name === "string" && w2uiRegistry[name] != null) w2uiRegistry[name].destroy();
    if (typeof name === "object") name.destroy();
  };
  $.fn["w2field"] = function(type, options) {
    if (arguments.length === 0) {
      return this.data("w2field");
    }
    return this.each((_index, el) => {
      let obj = $(el).data("w2field");
      if (obj == null) {
        obj = new w2field(type, options);
        obj.render(el);
      } else {
        obj = new w2field(type, options);
        obj.render(el);
      }
    });
  };
  $.fn["w2form"] = function(options, ...args) {
    return proc.call(this, options, "w2form", ...args);
  };
  $.fn["w2grid"] = function(options, ...args) {
    return proc.call(this, options, "w2grid", ...args);
  };
  $.fn["w2layout"] = function(options, ...args) {
    return proc.call(this, options, "w2layout", ...args);
  };
  $.fn["w2sidebar"] = function(options, ...args) {
    return proc.call(this, options, "w2sidebar", ...args);
  };
  $.fn["w2tabs"] = function(options, ...args) {
    return proc.call(this, options, "w2tabs", ...args);
  };
  $.fn["w2toolbar"] = function(options, ...args) {
    return proc.call(this, options, "w2toolbar", ...args);
  };
  function proc(options, type, ...args) {
    if ($.isPlainObject(options)) {
      let obj = null;
      if (type == "w2form") {
        obj = new w2form(options);
        if (this.find(".w2ui-field").length > 0) {
          obj.formHTML = this.html();
        }
      }
      if (type == "w2grid") obj = new w2grid(options);
      if (type == "w2layout") obj = new w2layout(options);
      if (type == "w2sidebar") obj = new w2sidebar(options);
      if (type == "w2tabs") obj = new w2tabs(options);
      if (type == "w2toolbar") obj = new w2toolbar(options);
      if (this.length !== 0 && obj) {
        obj.render(this[0]);
      }
      return obj;
    } else {
      const widgetName = this.attr("name") ?? "";
      const obj = w2uiRegistry[widgetName];
      if (!obj) return null;
      if (args.length > 0 || typeof options === "string") {
        if (options && obj[options]) obj[options].apply(obj, args);
        return this;
      } else {
        return obj;
      }
    }
  }
  $.fn["w2popup"] = function(options) {
    if (this.length > 0) {
      w2popup.template(this[0], null, options);
    } else if (options.url) {
      w2popup.load(options);
    }
  };
  $.fn["w2marker"] = function(...args) {
    let str = Array.from(args);
    if (Array.isArray(str[0])) str = str[0];
    return this.each((_index, el) => {
      w2utils.marker(el, str);
    });
  };
  $.fn["w2tag"] = function(text, options) {
    return this.each((_index, el) => {
      if (text == null && options == null) {
        w2tooltip.hide();
        return;
      }
      let mergedOptions = {};
      if (typeof text == "object" && text != null) {
        mergedOptions = text;
      } else {
        mergedOptions = options ?? {};
        mergedOptions["html"] = text;
      }
      w2tooltip.show({ anchor: el, ...mergedOptions });
    });
  };
  $.fn["w2overlay"] = function(html, options) {
    return this.each((_index, el) => {
      if (html == null && options == null) {
        w2tooltip.hide();
        return;
      }
      let mergedOptions = options ?? {};
      if (typeof html == "object" && html != null) {
        mergedOptions = html;
      } else {
        mergedOptions["html"] = html;
      }
      Object.assign(mergedOptions, {
        class: "w2ui-white",
        hideOn: ["doc-click"]
      });
      w2tooltip.show({ anchor: el, ...mergedOptions });
    });
  };
  $.fn["w2menu"] = function(menu, options) {
    return this.each((_index, el) => {
      let mergedOptions = options ?? {};
      if (typeof menu == "object" && !Array.isArray(menu)) {
        mergedOptions = menu;
      } else {
        mergedOptions["items"] = menu;
      }
      w2menu.show({ anchor: el, ...mergedOptions });
    });
  };
  $.fn["w2color"] = function(options, callBack) {
    return this.each((_index, el) => {
      const tooltip = w2color.show({ anchor: el, ...options });
      if (typeof callBack == "function") {
        tooltip.select(callBack);
      }
    });
  };
})(window["jQuery"]);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Dialog,
  Tooltip,
  query,
  w2alert,
  w2base,
  w2color,
  w2confirm,
  w2date,
  w2event,
  w2field,
  w2form,
  w2grid,
  w2layout,
  w2locale,
  w2menu,
  w2popup,
  w2prompt,
  w2sidebar,
  w2tabs,
  w2toolbar,
  w2tooltip,
  w2ui,
  w2utils
});


// Compatibility with CommonJS and AMD modules
!(function(global, w2ui) {
if (typeof define == 'function' && define.amd) {
    return define(() => w2ui)
}
if (typeof exports != 'undefined') {
    if (typeof module != 'undefined' && module.exports) {
        return exports = module.exports = w2ui
    }
    global = exports
}
if (global) {
    Object.keys(w2ui).forEach(key => {
        global[key] = w2ui[key]
    })
}
})(self, {
    w2ui, w2utils, query, w2locale, w2event, w2base,
    w2popup, w2alert, w2confirm, w2prompt, Dialog,
    w2tooltip, w2menu, w2color, w2date, Tooltip,
    w2toolbar, w2sidebar, w2tabs, w2layout, w2grid, w2form, w2field
});
