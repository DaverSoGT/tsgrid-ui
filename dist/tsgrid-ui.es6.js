// src/tslocale.ts
var TsLocale = {
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
  // phrases used in TsUi, should be empty for original language
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
        const clone2 = _Query._fragment(html);
        nodes.push(...clone2.childNodes);
        node[method]?.(clone2);
      });
    } else if (html instanceof _Query) {
      const single = len == 1;
      html.each((el) => {
        this.each((node) => {
          const clone2 = single ? el : el.cloneNode(true);
          nodes.push(clone2);
          node[method]?.(clone2);
          _Query._scriptConvert(clone2);
        });
      });
      if (!single) html.remove();
    } else if (html instanceof Node) {
      this.each((node) => {
        const clone2 = len === 1 ? html : _Query._fragment(html.outerHTML);
        nodes.push(...len === 1 ? [html] : clone2.childNodes);
        node[method]?.(clone2);
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
    const add2 = (node) => {
      if (nodes.indexOf(node) == -1) {
        nodes.push(node);
      }
      if (!firstOnly && node.parentNode) {
        return add2(node.parentNode);
      }
    };
    this.each((node) => {
      if (node.parentNode) add2(node.parentNode);
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

// src/tsutils-type-guards.ts
function isBin(val) {
  const re = /^[0-1]+$/;
  return re.test(String(val));
}
function isInt(val) {
  const re = /^[-+]?[0-9]+$/;
  return re.test(String(val));
}
function isFloat(val, settings) {
  if (typeof val === "string") {
    val = val.replace(new RegExp(settings.groupSymbol, "g"), "").replace(settings.decimalSymbol, ".");
  }
  return (typeof val === "number" || typeof val === "string" && val !== "") && !isNaN(Number(val));
}
function isMoney(val, settings) {
  if (typeof val === "object" || val === "") return false;
  if (isFloat(val, settings)) return true;
  const se = settings;
  const re = new RegExp("^" + (se.currencyPrefix ? "\\" + se.currencyPrefix + "?" : "") + "[-+]?" + (se.currencyPrefix ? "\\" + se.currencyPrefix + "?" : "") + "[0-9]*[\\" + se.decimalSymbol + "]?[0-9]+" + (se.currencySuffix ? "\\" + se.currencySuffix + "?" : "") + "$", "i");
  if (typeof val === "string") {
    val = val.replace(new RegExp(se.groupSymbol, "g"), "");
  }
  return re.test(String(val));
}
function isHex(val) {
  const re = /^(0x)?[0-9a-fA-F]+$/;
  return re.test(String(val));
}
function isAlphaNumeric(val) {
  const re = /^[a-zA-Z0-9_-]+$/;
  return re.test(String(val));
}
function isEmail(val) {
  const email = /^[a-zA-Z0-9._%\-+]+@[а-яА-Яa-zA-Z0-9.-]+\.[а-яА-Яa-zA-Z]+$/;
  return email.test(String(val));
}
function isIpAddress(val) {
  const re = new RegExp("^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?).){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$");
  return re.test(String(val));
}
function isPlainObject(value) {
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

// src/tsutils-color.ts
function parseColor(str) {
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
function colorContrastValue(color1, color2) {
  const lum1 = calcLumens(color1);
  const lum2 = calcLumens(color2);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  function calcLumens(color) {
    const { r, g, b } = parseColor(color) ?? { r: 0, g: 0, b: 0, a: 1 };
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
function colorContrast(color1, color2) {
  return colorContrastValue(color1, color2).toFixed(2);
}
function hsv2rgb(h, s, v, a) {
  let r, g, b;
  if (typeof h === "object" && h !== null) {
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
function rgb2hsv(r, g, b, a) {
  if (typeof r === "object" && r !== null) {
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

// src/tsutils-data.ts
function clone(obj, options) {
  const opts = Object.assign(
    { functions: true, elements: true, events: true, exclude: [], parent: "" },
    options ?? {}
  );
  if (Array.isArray(obj)) {
    const arr = Array.from(obj);
    arr.forEach((value, ind) => {
      arr[ind] = clone(value, { functions: opts.functions, elements: opts.elements, events: opts.events, exclude: opts.exclude, parent: opts.parent + "[]" });
    });
    return arr;
  } else if (isPlainObject(obj)) {
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
        ret[key] = clone(ret[key], { functions: opts.functions, elements: opts.elements, events: opts.events, exclude: opts.exclude, parent: opts.parent + (opts.parent ? "." : "") + key });
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
function extend(target, source, ...rest) {
  if (Array.isArray(target)) {
    if (Array.isArray(source)) {
      target.splice(0, target.length);
      source.forEach((s) => {
        target.push(clone(s));
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
        const src = clone(source[key]);
        if (target[key] instanceof Node || target[key] instanceof Event) {
          target[key] = src;
        } else {
          if (Array.isArray(target[key]) && isPlainObject(src)) {
            target[key] = {};
          }
          extend(target[key], src);
        }
      } else {
        target[key] = clone(source[key]);
      }
    });
  } else if (source != null) {
    throw new Error("Object is not extendable, only {} or [] can be extended.");
  }
  if (rest.length > 0) {
    for (let i = 0; i < rest.length; i++) {
      extend(target, rest[i]);
    }
  }
  return target;
}
function naturalCompare(a, b) {
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
function getNested(obj, prop) {
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
function normMenu(menu, options = {}) {
  if (Array.isArray(menu)) {
    menu.forEach((it, m) => {
      if (typeof it === "string" || typeof it === "number") {
        menu[m] = { id: it, text: String(it) };
      } else if (it != null) {
        if (options.itemMap != null) {
          let val = getNested(it, options.itemMap.id);
          if (options.itemMap.id != null && val != null) {
            it.id = val;
          }
          val = getNested(it, options.itemMap.text);
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
    const newMenu = menu(menu, options);
    return normMenu(newMenu, options);
  } else if (typeof menu === "object" && menu !== null) {
    const menuObj = menu;
    return Object.keys(menuObj).map((key) => {
      return { id: key, text: String(menuObj[key] ?? "") };
    });
  }
}
function encodeParams(obj, prefix = "") {
  let str = "";
  Object.keys(obj).forEach((key) => {
    if (str != "") str += "&";
    if (typeof obj[key] == "object") {
      str += encodeParams(obj[key], prefix + key + (prefix ? "]" : "") + "[");
    } else {
      str += `${prefix}${key}${prefix ? "]" : ""}=${obj[key]}`;
    }
  });
  return str;
}
function prepareParams(url, fetchOptions, options, defaultDataType) {
  const dataType = options?.["dataType"] ?? defaultDataType;
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
function parseRoute(route) {
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
function debounce(func, wait2 = 250) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, wait2);
  };
}
async function wait(time = 0) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });
}

// src/tsutils-string.ts
function stripSpaces(html) {
  if (html == null) return html;
  switch (typeof html) {
    case "number":
      break;
    case "string":
      html = String(html).replace(/(?:\r\n|\r|\n)/g, " ").replace(/\s\s+/g, " ").trim();
      break;
    case "object":
      if (Array.isArray(html)) {
        const arr = extend([], html);
        arr.forEach((key, ind) => {
          arr[ind] = stripSpaces(key);
        });
        return arr;
      } else {
        const obj = extend({}, html);
        Object.keys(obj).forEach((key) => {
          obj[key] = stripSpaces(obj[key]);
        });
        return obj;
      }
  }
  return html;
}
function stripTags(html) {
  if (html == null) return html;
  switch (typeof html) {
    case "number":
      break;
    case "string":
      html = String(html).replace(/<(?:[^>=]|='[^']*'|="[^"]*"|=[^'"][^\s>]*)*>/ig, "");
      break;
    case "object":
      if (Array.isArray(html)) {
        const arr = extend([], html);
        arr.forEach((key, ind) => {
          arr[ind] = stripTags(key);
        });
        return arr;
      } else {
        const obj = extend({}, html);
        Object.keys(obj).forEach((key) => {
          obj[key] = stripTags(obj[key]);
        });
        return obj;
      }
  }
  return html;
}
function encodeTags(html) {
  if (html == null) return html;
  switch (typeof html) {
    case "number":
      break;
    case "string":
      html = String(html).replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
      break;
    case "object":
      if (Array.isArray(html)) {
        const arr = extend([], html);
        arr.forEach((key, ind) => {
          arr[ind] = encodeTags(key);
        });
        return arr;
      } else {
        const obj = extend({}, html);
        Object.keys(obj).forEach((key) => {
          obj[key] = encodeTags(obj[key]);
        });
        return obj;
      }
  }
  return html;
}
function decodeTags(html) {
  if (html == null) return html;
  switch (typeof html) {
    case "number":
      break;
    case "string":
      html = String(html).replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&quot;/g, '"').replace(/&amp;/g, "&");
      break;
    case "object":
      if (Array.isArray(html)) {
        const arr = extend([], html);
        arr.forEach((key, ind) => {
          arr[ind] = decodeTags(key);
        });
        return arr;
      } else {
        const obj = extend({}, html);
        Object.keys(obj).forEach((key) => {
          obj[key] = decodeTags(obj[key]);
        });
        return obj;
      }
  }
  return html;
}
function escapeId(id) {
  if (id === "" || id == null) return "";
  const re = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-￿\w-]/g;
  return (id + "").replace(re, (ch, asCodePoint) => {
    if (asCodePoint) {
      if (ch === "\0") return "\uFFFD";
      return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
    }
    return "\\" + ch;
  });
}
function unescapeId(id) {
  if (id === "" || id == null) return "";
  const re = /\\[\da-fA-F]{1,6}[\x20\t\r\n\f]?|\\([^\r\n\f])/g;
  return id.replace(re, (escape, nonHex) => {
    const high = parseInt("0x" + escape.slice(1), 16) - 65536;
    return nonHex ? nonHex : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
  });
}
function base64encode(str) {
  const utf8Bytes = new TextEncoder().encode(str);
  let binaryString = "";
  for (const byte of utf8Bytes) {
    binaryString += String.fromCharCode(byte);
  }
  return btoa(binaryString);
}
function base64decode(encodedStr) {
  const binaryString = atob(encodedStr);
  const utf8Bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    utf8Bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder().decode(utf8Bytes);
}
async function sha256(str) {
  const utf8 = new TextEncoder().encode(str);
  return crypto.subtle.digest("SHA-256", utf8).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((bytes) => bytes.toString(16).padStart(2, "0")).join("");
  });
}
function execTemplate(str, replace_obj) {
  if (typeof str !== "string" || !replace_obj || typeof replace_obj !== "object") {
    return str;
  }
  return str.replace(/\${([^}]+)?}/g, function(_$1, $2) {
    return replace_obj[$2] || $2;
  });
}

// src/tsutils-marker.ts
var query2 = query;
function _clearMarkers(el, options) {
  const markerRE = new RegExp(`<${options.tag}[^>]*class=["']${options.class.replace(/-/g, "\\-")}["'][^>]*>([\\s\\S]*?)<\\/${options.tag}>`, "ig");
  if (typeof el == "string") {
    while (el.indexOf(`<${options.tag} class="${options.class}"`) !== -1) {
      el = el.replace(markerRE, "$1");
    }
  } else {
    while (el.innerHTML.indexOf(`<${options.tag} class="${options.class}"`) !== -1) {
      el.innerHTML = el.innerHTML.replace(markerRE, "$1");
    }
  }
}
function _replace(html, term, replaceWith, options) {
  const ww = options.wholeWord;
  if (typeof term !== "string") term = String(term);
  term = term.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").replace(/&/g, "&amp;").replace(/</g, "&gt;").replace(/>/g, "&lt;");
  const regex = new RegExp((ww ? "\\b" : "") + term + (ww ? "\\b" : "") + "(?![^<]*>)", "i" + (!options.onlyFirst ? "g" : ""));
  return html = html.replace(regex, replaceWith);
}
function marker(el, items, options = { onlyFirst: false, wholeWord: false, isRegex: false }) {
  options.tag ??= "span";
  options.class ??= "tsg-marker";
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
    _clearMarkers(el, options);
    items.forEach((item) => {
      if (isRegexSearch) {
        try {
          const flags = "i" + (!options.onlyFirst ? "g" : "");
          const regex = new RegExp(item, flags);
          el = el.replace(regex, options.raplace);
        } catch (e) {
          console.error("Invalid regular expression:", e);
          el = _replace(el, item, options.raplace, options);
        }
      } else {
        el = _replace(el, item, options.raplace, options);
      }
    });
  } else {
    query2(el).each((el2) => {
      _clearMarkers(el2, options);
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
            el2.innerHTML = _replace(el2.innerHTML, pattern, options.raplace, options);
          }
        });
      } else {
        items.forEach((item) => {
          ;
          el2.innerHTML = _replace(el2.innerHTML, item, options.raplace, options);
        });
      }
    });
  }
  return el;
}

// src/tsutils-registry.ts
var TsUi = {};
function checkName(name) {
  if (name == null) {
    console.log('ERROR: Property "name" is required but not supplied.');
    return false;
  }
  if (TsUi[name] != null) {
    console.log(`ERROR: Object named "${name}" is already registered as TsUi.${name}.`);
    return false;
  }
  if (!isAlphaNumeric(name)) {
    console.log('ERROR: Property "name" has to be alpha-numeric (a-z, 0-9, dash and underscore).');
    return false;
  }
  return true;
}

// src/tsutils-notify.ts
var query3 = query;
function notify(text, options, deps) {
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
    if (typeof deps.tmpSlot["notify_resolve"] == "function") {
      ;
      deps.tmpSlot["notify_resolve"]();
      query3(deps.tmpSlot["notify_where"]).find("#tsg-notify").remove();
    }
    deps.tmpSlot["notify_resolve"] = resolve;
    deps.tmpSlot["notify_where"] = opts["where"];
    clearTimeout(deps.tmpSlot["notify_timer"]);
    const where = opts["where"];
    if (textStr) {
      if (typeof opts["actions"] == "object") {
        const actions = {};
        Object.keys(opts["actions"]).forEach((action) => {
          actions[action] = `<a class="tsg-notify-link" value="${action}">${action}</a>`;
        });
        textStr = deps.execTemplate(textStr, actions);
      }
      const html = `
                    <div id="tsg-notify" style="${where == document.body ? "position: fixed" : ""}">
                        <div class="${opts["class"] ?? ""} ${opts["error"] ? "tsg-notify-error" : ""} ${opts["success"] ? "tsg-notify-success" : ""}">
                            ${textStr}
                            <span class="tsg-notify-close tsg-icon-cross"></span>
                        </div>
                    </div>`;
      query3(where).append(html);
      query3(where).find("#tsg-notify").find(".tsg-notify-close").on("click", (_event) => {
        query3(where).find("#tsg-notify").remove();
        resolve();
      });
      if (opts["actions"]) {
        query3(where).find("#tsg-notify .tsg-notify-link").on("click", (event2) => {
          const value = query3(event2.target).attr("value") ?? "";
          opts["actions"][value]();
          query3(where).find("#tsg-notify").remove();
          resolve();
        });
      }
      if (opts["timeout"] > 0) {
        deps.tmpSlot["notify_timer"] = setTimeout(() => {
          query3(where).find("#tsg-notify").remove();
          resolve();
        }, opts["timeout"]);
      }
    }
  });
}

// src/tsbase.ts
var query4 = query;
var TsEvent = class {
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
      extend(this.detail, detail);
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
function toSafeEvent(event2) {
  if (typeof event2 !== "object" || event2 === null) {
    return { type: null, phase: "before", detail: {}, isStopped: false, isCancelled: false };
  }
  const ev = event2;
  return {
    type: typeof ev["type"] === "string" ? ev["type"] : null,
    phase: typeof ev["phase"] === "string" ? ev["phase"] : "before",
    detail: ev["detail"] ?? {},
    isStopped: ev["isStopped"] === true,
    isCancelled: ev["isCancelled"] === true
  };
}
var TsBase = class {
  activeEvents = [];
  listeners = [];
  debug = false;
  name;
  box;
  /**
   * Initializes base object for TsUi, registers it with TsUi object
   *
   * @param {string} name  - name of the object
   * @returns
   */
  constructor(name) {
    this.activeEvents = [];
    this.listeners = [];
    if (typeof name !== "undefined") {
      if (!checkName(name)) return;
      TsUi[name] = this;
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
      edata = extend({ type: null, execute: "before", onComplete: null }, edata);
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
        console.log("TsBase: add event", { name, edata, handler });
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
      edata = extend({ type: null, execute: null, onComplete: null }, edata);
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
        console.log(`TsBase: remove event (${count})`, { name, edata, handler });
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
   * from TsEventData into a TsEvent mid-execution. Runtime type mutation is inherent
   * to the event dispatch pattern. Phase 6 strict tighten will revisit this.
   */
  // any: targeted-any per typing_policy; TsBase event payload is widget-defined at runtime
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
    if (isPlainObject(edata) && edata.phase == "after") {
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
    } else if (!(edata instanceof TsEvent)) {
      edata = new TsEvent(this, edata);
      this.activeEvents.push(edata);
    }
    let args, fun, tmp;
    if (!Array.isArray(this.listeners)) this.listeners = [];
    if (this.debug) {
      console.log(`TsBase: trigger "${edata.type}:${edata.phase}"`, edata);
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
        console.log(`TsBase: trigger "${edata.type}:${edata.phase}"`, edata);
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
   * Removes all classes that start with tsg-* and sets box to null. It is needed so that control will
   * release the box to be used for other widgets
   */
  unmount() {
    const edata = this.trigger("unmount", { target: this.name });
    if (edata.isCancelled) {
      return;
    }
    const remove2 = [];
    if (this.box instanceof HTMLElement) {
      this.box.classList.forEach((cl) => {
        if (cl.startsWith("tsg-")) remove2.push(cl);
      });
    }
    query4(this.box).off().removeClass(remove2).removeAttr("name").html("");
    this.box = null;
    edata.finish();
  }
};

// src/tsutils-message.ts
var query5 = query;
function normButtons(options, btn, deps) {
  options["actions"] = options["actions"] ?? {};
  const btns = Object.keys(btn);
  btns.forEach((name) => {
    const action = options["btn_" + name];
    if (action) {
      btn[name] = {
        text: deps.lang(String(action["text"] ?? btn[name] ?? "")),
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
    if (deps.settings.macButtonOrder) {
      deps.extend(options["actions"], { no: btn["no"], yes: btn["yes"] });
    } else {
      deps.extend(options["actions"], { yes: btn["yes"], no: btn["no"] });
    }
  }
  if (btns.includes("ok") && btns.includes("cancel")) {
    if (deps.settings.macButtonOrder) {
      deps.extend(options["actions"], { cancel: btn["cancel"], ok: btn["ok"] });
    } else {
      deps.extend(options["actions"], { ok: btn["ok"], cancel: btn["cancel"] });
    }
  }
  return options;
}
function _message(where, options, deps) {
  let closeTimer, openTimer, edata;
  let msgBase = {};
  const removeLast = () => {
    const msgs = query5(where?.box).find(".tsg-message");
    if (msgs.length == 0) return;
    msgBase = msgs.get(0)["_msg_options"] || {};
    if (typeof msgBase?.close == "function") {
      msgBase.close();
    }
  };
  const closeComplete = (options2) => {
    const msgBoxEl = options2["box"];
    const focus2 = msgBoxEl?.["_msg_prevFocus"];
    if (query5(where.box).find(".tsg-message").length <= 1) {
      if (where.owner) {
        where.owner.unlock?.(where.param, 150);
      } else {
        deps.unlock(where.box, 150);
      }
    } else {
      query5(where.box).find(`#tsg-message-${where.owner?.name}-${options2["msgIndex"] - 1}`).css("z-index", "1500");
    }
    if (focus2) {
      const msg = query5(focus2).closest(".tsg-message");
      if (msg.length > 0) {
        const opt = msg.get(0)["_msg_options"];
        opt["setFocus"](focus2);
      } else {
        focus2.focus();
      }
    } else {
      if (typeof where.owner?.focus == "function") where.owner.focus();
    }
    query5(options2["box"]).remove();
    if (options2["msgIndex"] === 0) {
      const tmp = options2["tmp"];
      head.css("z-index", tmp.zIndex);
      query5(where.box).css("overflow", tmp.overflow);
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
  } else if (options == null) {
    msgBase = where;
  } else {
    msgBase = options ?? {};
  }
  if ((msgBase.text === "" || msgBase.text == null) && (msgBase.body === "" || msgBase.body == null)) {
    removeLast();
    return;
  }
  if (msgBase.text != null) msgBase.body = `<div class="tsg-centered tsg-msg-text">${msgBase.text}</div>`;
  if (msgBase.width == null) msgBase.width = 350;
  if (msgBase.height == null) msgBase.height = 170;
  if (msgBase.hideOn == null) msgBase.hideOn = ["esc"];
  msgBase.cancelAction ??= "Ok";
  if (msgBase.on == null) {
    const opts = msgBase;
    msgBase = new TsBase();
    deps.extend(msgBase, opts);
  }
  const msgOpts = msgBase;
  msgOpts["on"]("open", (event2) => {
    deps.bindEvents(query5(msgOpts["box"]).find(".tsg-eaction"), msgOpts);
    const detail = event2["detail"];
    query5(detail["box"]).find("button, input, textarea, [name=hidden-first]").off(".message").on("keydown.message", function(evt) {
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
        msgBase.buttons += `<button class="tsg-btn tsg-eaction" data-click='["action","${action}","event"]' name="${action}">${action}</button>`;
      }
      if (typeof handler == "object" && handler !== null) {
        const h = handler;
        msgBase.buttons += `<button class="tsg-btn tsg-eaction ${h["class"] || ""}" name="${action}" data-click='["action","${action}","event"]'
                    style="${h["style"] ?? ""}" ${h["attrs"] ?? ""}>${h["text"] || action}</button>`;
        btnAction = Array.isArray(msgBase.actions) ? String(h["text"]) : action;
      }
      if (typeof handler == "string") {
        msgBase.buttons += `<button class="tsg-btn tsg-eaction" name="${handler}" data-click='["action","${handler}","event"]'>${handler}</button>`;
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
            <div class="tsg-message-body">${msgBase.body || ""}</div>
            <div class="tsg-message-buttons">${msgBase.buttons || ""}</div>
        `;
  }
  let styles = getComputedStyle(query5(where.box).get(0));
  const pWidth = parseFloat(styles.width);
  const pHeight = parseFloat(styles.height);
  let titleHeight = 0;
  if (query5(where.after).length > 0) {
    styles = getComputedStyle(query5(where.after).get(0));
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
  const head = query5(where.box).find(where.after);
  if (!msgBase.tmp) {
    msgBase.tmp = {
      zIndex: String(head.css("z-index")),
      overflow: styles.overflow
    };
  }
  if (msgBase.html === "" && msgBase.body === "" && msgBase.buttons === "") {
    removeLast();
  } else {
    msgBase.msgIndex = query5(where.box).find(".tsg-message").length;
    if (msgBase.msgIndex === 0 && typeof deps.lock == "function") {
      query5(where.box).css("overflow", "hidden");
      if (where.owner) {
        ;
        where.owner.lock?.(where.param);
      } else {
        deps.lock(where.box);
      }
    }
    query5(where.box).find(".tsg-message").css("z-index", "1390");
    head.css("z-index", "1501");
    const content = `
            <div id="tsg-message-${where.owner?.name}-${msgBase.msgIndex}" class="tsg-message" data-mousedown="stop"
                style="z-index: 1500; left: ${(pWidth - (msgBase.width ?? 0)) / 2}px; top: ${titleHeight}px;
                    width: ${msgBase.width}px; height: ${msgBase.height}px; transform: translateY(-${msgBase.height}px)"
                ${(msgBase.hideOn ?? []).includes("click") ? where.param ? `data-click='["message", "${where.param}"]` : 'data-click="message"' : ""}>
                <span name="hidden-first" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
                ${msgBase.html}
                <span name="hidden-last" tabindex="0" style="position: absolute; top: 0; outline: none"></span>
            </div>`;
    if (query5(where.after).length > 0) {
      query5(where.box).find(where.after).after(content);
    } else {
      query5(where.box).prepend(content);
    }
    msgBase.box = query5(where.box).find(`#tsg-message-${where.owner?.name}-${msgBase.msgIndex}`)[0];
    deps.bindEvents(msgBase.box, deps.self);
    query5(msgBase.box).addClass("animating");
    msgBase.box["_msg_options"] = msgBase;
    msgBase.box["_msg_prevFocus"] = document.activeElement;
    setTimeout(() => {
      edata = msgOpts["trigger"]("open", { target: deps.ownerName, box: msgBase.box, self: msgBase });
      const edataR = edata;
      if (edataR["isCancelled"] === true) {
        query5(where.box).find(`#tsg-message-${where.owner?.name}-${msgBase.msgIndex}`).remove();
        if (msgBase.msgIndex === 0) {
          head.css("z-index", msgBase.tmp.zIndex);
          query5(where.box).css("overflow", msgBase.tmp.overflow);
        }
        return;
      }
      query5(msgBase.box).css({
        transition: "0.3s",
        transform: "translateY(0px)"
      });
    }, 0);
    openTimer = setTimeout(() => {
      query5(where.box).find(`#tsg-message-${where.owner?.name}-${msgBase.msgIndex}`).removeClass("animating").css({ "transition": "0s" });
      edata?.["finish"]?.();
    }, 300);
  }
  msgBase.action = (action, event2) => {
    let click2 = msgBase.actions?.[action];
    if (click2 instanceof Object && click2["onClick"]) click2 = click2["onClick"];
    const edata2 = msgOpts["trigger"]("action", {
      target: deps.ownerName,
      action,
      self: msgBase,
      originalEvent: event2,
      value: msgBase.input ? msgBase.input.value : null
    });
    const edataR = edata2;
    if (edataR["isCancelled"] === true) return;
    if (typeof click2 === "function") click2(edata2);
    edataR["finish"]?.();
  };
  msgBase.close = () => {
    edata = msgOpts["trigger"]("close", { target: "self", box: msgBase.box, self: msgBase });
    const edataR = edata;
    if (edataR["isCancelled"] === true) return;
    clearTimeout(openTimer);
    if (query5(msgBase.box).hasClass("animating")) {
      clearTimeout(closeTimer);
      closeComplete(msgOpts);
      return;
    }
    query5(msgBase.box).addClass("tsg-closing animating").css({
      "transition": "0.15s",
      "transform": "translateY(-" + msgBase.height + "px)"
    });
    if ((msgBase.msgIndex ?? 0) !== 0) {
      query5(where.box).find(`#tsg-message-${where.owner?.name}-${(msgBase.msgIndex ?? 1) - 1}`).css("z-index", "1499");
    }
    closeTimer = setTimeout(() => {
      closeComplete(msgOpts);
    }, 150);
  };
  msgBase.setFocus = (focus2) => {
    const cnt = query5(where.box).find(".tsg-message").length - 1;
    const box = query5(where.box).find(`#tsg-message-${where.owner?.name}-${cnt}`);
    const sel = "input, button, select, textarea, [contentEditable], .tsg-input";
    if (focus2 != null) {
      const el = typeof focus2 === "string" ? box.find(sel).filter(focus2).get(0) : box.find(sel).get(focus2);
      el?.focus();
    } else {
      box.find("[name=hidden-first]").get(0)?.focus();
    }
    query5(where.box).find(".tsg-message").find(sel + ",[name=hidden-first],[name=hidden-last]").off(".keep-focus");
    query5(box).find(sel + ",[name=hidden-first],[name=hidden-last]").on("blur.keep-focus", function(_event) {
      setTimeout(() => {
        const focus3 = document.activeElement;
        const inside = focus3 != null && query5(box).find(sel).filter(focus3).length > 0;
        const name = query5(focus3).attr("name");
        if (!inside && focus3 && focus3 !== document.body) {
          query5(box).find(sel).get(0)?.focus();
        }
        if (name == "hidden-last") {
          query5(box).find(sel).get(0)?.focus();
        }
        if (name == "hidden-first") {
          query5(box).find(sel).get(-1)?.focus();
        }
      }, 1);
    });
  };
  return prom;
}
function _alert(where, options, deps) {
  return _message(where, options, deps);
}
function _confirm(where, options, deps) {
  let msgOpts = {};
  if (["string", "number"].includes(typeof options)) {
    msgOpts = { text: options };
  } else if (options == null) {
    msgOpts = where;
  } else {
    msgOpts = options ?? {};
  }
  deps.normButtons(msgOpts, { yes: "Yes", no: "No" });
  msgOpts["cancelAction"] ??= "No";
  const prom = deps.message(where, msgOpts);
  if (prom) {
    prom.action((event2) => {
      const d = event2["detail"];
      const self = d?.["self"];
      self?.["close"]?.();
    });
  }
  return prom;
}
function _prompt(where, options, deps) {
  let msgOpts = {};
  if (["string", "number"].includes(typeof options)) {
    msgOpts = { label: options };
  } else if (options == null) {
    msgOpts = where;
  } else {
    msgOpts = options ?? {};
  }
  msgOpts["cancelAction"] ??= "Cancel";
  if (msgOpts["label"]) {
    msgOpts["focus"] = 0;
    msgOpts["body"] = msgOpts["textarea"] ? `<div class="tsg-prompt textarea">
                     <div>${msgOpts["label"]}</div>
                     <textarea id="TsPrompt" class="tsg-input" ${msgOpts["attrs"] ?? ""}
                        data-keydown="keydown|event" data-keyup="change|event"></textarea>
                   </div>` : `<div class="tsg-prompt tsg-centered">
                     <label>${msgOpts["label"]}&nbsp;</label>
                     <input id="TsPrompt" class="tsg-input" ${msgOpts["attrs"] ?? ""}
                        data-keydown="keydown|event" data-keyup="change|event">
                   </div>`;
  }
  deps.normButtons(msgOpts, { ok: deps.lang("Ok"), cancel: deps.lang("Cancel") });
  const prom = deps.message(where, msgOpts);
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
      (d?.["self"])["input"] = query5(d?.["box"]).find("#TsPrompt").get(0);
      query5(d?.["box"]).find("#TsPrompt").on("keydown", (evt) => {
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

// src/tsutils-dom.ts
var query6 = query;
function transition(divOld, divNew, type, callBack) {
  return new Promise((resolve, _reject) => {
    const styles = getComputedStyle(divOld);
    const width = parseInt(styles.width);
    const height = parseInt(styles.height);
    const time = 0.5;
    if (!divOld || !divNew) {
      console.log("ERROR: Cannot do transition when one of the divs is null");
      return;
    }
    ;
    divOld.parentNode.style.cssText += "perspective: 900px; overflow: hidden;";
    divOld.style.cssText += "; position: absolute; z-index: 1019; backface-visibility: hidden";
    divNew.style.cssText += "; position: absolute; z-index: 1020; backface-visibility: hidden";
    switch (type) {
      case "slide-left":
        divOld.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)";
        divNew.style.cssText += "overflow: hidden; transform: translate3d(" + width + "px, 0, 0)";
        query6(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: translate3d(0, 0, 0)";
          divOld.style.cssText += "transition: " + time + "s; transform: translate3d(-" + width + "px, 0, 0)";
        }, 1);
        break;
      case "slide-right":
        divOld.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)";
        divNew.style.cssText += "overflow: hidden; transform: translate3d(-" + width + "px, 0, 0)";
        query6(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: translate3d(0px, 0, 0)";
          divOld.style.cssText += "transition: " + time + "s; transform: translate3d(" + width + "px, 0, 0)";
        }, 1);
        break;
      case "slide-down":
        divOld.style.cssText += "overflow: hidden; z-index: 1; transform: translate3d(0, 0, 0)";
        divNew.style.cssText += "overflow: hidden; z-index: 0; transform: translate3d(0, 0, 0)";
        query6(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: translate3d(0, 0, 0)";
          divOld.style.cssText += "transition: " + time + "s; transform: translate3d(0, " + height + "px, 0)";
        }, 1);
        break;
      case "slide-up":
        divOld.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)";
        divNew.style.cssText += "overflow: hidden; transform: translate3d(0, " + height + "px, 0)";
        query6(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: translate3d(0, 0, 0)";
          divOld.style.cssText += "transition: " + time + "s; transform: translate3d(0, 0, 0)";
        }, 1);
        break;
      case "flip-left":
        divOld.style.cssText += "overflow: hidden; transform: rotateY(0deg)";
        divNew.style.cssText += "overflow: hidden; transform: rotateY(-180deg)";
        query6(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: rotateY(0deg)";
          divOld.style.cssText += "transition: " + time + "s; transform: rotateY(180deg)";
        }, 1);
        break;
      case "flip-right":
        divOld.style.cssText += "overflow: hidden; transform: rotateY(0deg)";
        divNew.style.cssText += "overflow: hidden; transform: rotateY(180deg)";
        query6(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: rotateY(0deg)";
          divOld.style.cssText += "transition: " + time + "s; transform: rotateY(-180deg)";
        }, 1);
        break;
      case "flip-down":
        divOld.style.cssText += "overflow: hidden; transform: rotateX(0deg)";
        divNew.style.cssText += "overflow: hidden; transform: rotateX(180deg)";
        query6(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: rotateX(0deg)";
          divOld.style.cssText += "transition: " + time + "s; transform: rotateX(-180deg)";
        }, 1);
        break;
      case "flip-up":
        divOld.style.cssText += "overflow: hidden; transform: rotateX(0deg)";
        divNew.style.cssText += "overflow: hidden; transform: rotateX(-180deg)";
        query6(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: rotateX(0deg)";
          divOld.style.cssText += "transition: " + time + "s; transform: rotateX(180deg)";
        }, 1);
        break;
      case "pop-in":
        divOld.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)";
        divNew.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(.8); opacity: 0;";
        query6(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: scale(1); opacity: 1;";
          divOld.style.cssText += "transition: " + time + "s;";
        }, 1);
        break;
      case "pop-out":
        divOld.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(1); opacity: 1;";
        divNew.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); opacity: 0;";
        query6(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; opacity: 1;";
          divOld.style.cssText += "transition: " + time + "s; transform: scale(1.7); opacity: 0;";
        }, 1);
        break;
      default:
        divOld.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)";
        divNew.style.cssText += "overflow: hidden; translate3d(0, 0, 0); opacity: 0;";
        query6(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; opacity: 1;";
          divOld.style.cssText += "transition: " + time + "s";
        }, 1);
        break;
    }
    setTimeout(() => {
      if (type === "slide-down") {
        query6(divOld).css("z-index", "1019");
        query6(divNew).css("z-index", "1020");
      }
      if (divNew) {
        ;
        query6(divNew).css({ "opacity": "1" }).css({ "transition": "", "transform": "" });
      }
      if (divOld) {
        ;
        query6(divOld).css({ "opacity": "1" }).css({ "transition": "", "transform": "" });
      }
      if (typeof callBack === "function") callBack();
      resolve();
    }, time * 1e3);
  });
}
function lock(box, options = {}, ...rest) {
  if (box == null) return;
  let opts = typeof options === "string" ? { msg: options } : { ...options };
  if (rest[0] != null) {
    opts.spinner = rest[0];
  }
  opts = extend({ spinner: false }, opts);
  let boxSel = box;
  if (box?.[0] instanceof Node) {
    boxSel = Array.isArray(box) ? box : box.get();
  }
  if (!opts.msg && opts.msg !== 0) opts.msg = "";
  unlock(boxSel);
  const el = query6(boxSel).get(0);
  const pWidth = el.scrollWidth;
  const pHeight = el.scrollHeight;
  let style = `height: ${pHeight}px; width: ${pWidth}px`;
  if (el.tagName == "BODY") {
    style = "position: fixed; right: 0; bottom: 0;";
  }
  query6(boxSel).prepend(
    `<div class="tsg-lock" style="${style}"></div><div class="tsg-lock-msg"></div>`
  );
  const $lock = query6(boxSel).find(".tsg-lock");
  const $mess = query6(boxSel).find(".tsg-lock-msg");
  if (!opts.msg) {
    $mess.css({
      "background-color": "transparent",
      "background-image": "none",
      "border": "0px",
      "box-shadow": "none"
    });
  }
  if (opts.spinner === true) {
    opts.msg = `<div class="tsg-spinner" ${!opts.msg ? 'style="width: 35px; height: 35px"' : ""}></div>` + opts.msg;
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
function unlock(box, speed) {
  if (box == null) return;
  const prevBox = box;
  clearTimeout(prevBox["_prevUnlock"]);
  let boxSel = box;
  if (box?.[0] instanceof Node) {
    boxSel = Array.isArray(box) ? box : box.get();
  }
  if (isInt(speed) && (speed ?? 0) > 0) {
    query6(boxSel).find(".tsg-lock").css({
      transition: (speed ?? 0) / 1e3 + "s",
      opacity: 0
    });
    const _box = query6(boxSel).get(0);
    clearTimeout(_box["_prevUnlock"]);
    _box["_prevUnlock"] = setTimeout(() => {
      query6(boxSel).find(".tsg-lock").remove();
    }, speed);
    query6(boxSel).find(".tsg-lock-msg").remove();
  } else {
    query6(boxSel).find(".tsg-lock").remove();
    query6(boxSel).find(".tsg-lock-msg").remove();
  }
}
function getSize(el, type) {
  const $el = query6(el);
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
function getStrDimentions(str, styles, raw) {
  let div = query6("body > #_tmp_width");
  if (div.length === 0) {
    query6("body").append('<div id="_tmp_width" style="position: absolute; top: -9000px;"></div>');
    div = query6("body > #_tmp_width");
  }
  if (raw === void 0 && str.trim().startsWith("<") && str.trim().endsWith(">")) {
    raw = true;
  }
  ;
  div.html(raw ? str : encodeTags(str ?? "")).attr("style", `position: absolute; top: -9000px; ${styles || ""}`);
  const width = div[0].clientWidth;
  const height = div[0].clientHeight;
  div.html("");
  return { width, height };
}
function bindEvents(selector, subject) {
  const selectorR = selector;
  if (selectorR?.["length"] == 0) return;
  let normalizedSelector = selector;
  if (selectorR?.[0] instanceof Node) {
    normalizedSelector = Array.isArray(selector) ? selector : selector.get();
  }
  ;
  query6(normalizedSelector).each((el) => {
    const actions = query6(el).data();
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
      query6(el).off(name + ".TsUtils-bind").on(name + ".TsUtils-bind", function(event2) {
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

// src/tsutils-datetime.ts
function _isDate(val, format, retDate, settings) {
  if (!val) return false;
  let dt = "Invalid Date";
  let month, day, year;
  if (format == null) format = settings.dateFormat;
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
      for (let m = 0, len = settings.fullmonths.length; m < len; m++) {
        const t = settings.fullmonths[m] ?? "";
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
  if (!isInt(year)) return false;
  if (!isInt(month)) return false;
  if (!isInt(day)) return false;
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
function _isTime(val, retTime) {
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
  if (tmp0 === "" || h < 0 || h > max || !isInt(tmp0) || tmp0.length > 2) {
    return false;
  }
  if (tmp.length > 1 && (tmp1 === "" || m < 0 || m > 59 || !isInt(tmp1) || tmp1.length !== 2)) {
    return false;
  }
  if (tmp.length > 2 && (tmp2 === "" || s < 0 || s > 59 || !isInt(tmp2) || tmp2.length !== 2)) {
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
function _isDateTime(val, format, retDate, settings) {
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
    if (format == null) format = settings.datetimeFormat;
    const formats = format.split("|");
    const values = [strVal.substr(0, tmp), strVal.substr(tmp).trim()];
    if (formats[0] != null) formats[0] = formats[0].trim();
    if (formats[1]) formats[1] = formats[1].trim();
    const tmp1 = _isDate(values[0], formats[0], true, settings);
    const tmp2 = _isTime(values[1], true);
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
function _age(dateStr) {
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
function _interval(value) {
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
function _formatDate(dateStr, format, settings) {
  if (!format) format = settings.dateFormat;
  if (dateStr === "" || dateStr == null || typeof dateStr === "object" && !dateStr.getMonth) return "";
  let dt = new Date(dateStr);
  if (isInt(dateStr)) dt = new Date(Number(dateStr));
  if (String(dt) === "Invalid Date") return "";
  const year = dt.getFullYear();
  const month = dt.getMonth();
  const date = dt.getDate();
  return format.toLowerCase().replace("month", settings.fullmonths[month] ?? "").replace("mon", settings.shortmonths[month] ?? "").replace(/yyyy/g, ("000" + year).slice(-4)).replace(/yyy/g, ("000" + year).slice(-4)).replace(/yy/g, ("0" + year).slice(-2)).replace(/(^|[^a-z$])y/g, "$1" + year).replace(/mm/g, ("0" + (month + 1)).slice(-2)).replace(/dd/g, ("0" + date).slice(-2)).replace(/th/g, date == 1 ? "st" : "th").replace(/th/g, date == 2 ? "nd" : "th").replace(/th/g, date == 3 ? "rd" : "th").replace(/(^|[^a-z$])m/g, "$1" + (month + 1)).replace(/(^|[^a-z$])d/g, "$1" + date);
}
function _formatTime(dateStr, format, settings) {
  if (!format) format = settings.timeFormat;
  if (dateStr === "" || dateStr == null || typeof dateStr === "object" && !dateStr.getMonth) return "";
  let dt = new Date(dateStr);
  if (isInt(dateStr)) dt = new Date(Number(dateStr));
  if (_isTime(dateStr)) {
    const tmp = _isTime(dateStr, true);
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
function _formatDateTime(dateStr, format, settings) {
  let fmt;
  if (dateStr === "" || dateStr == null || typeof dateStr === "object" && !dateStr.getMonth) return "";
  if (typeof format !== "string") {
    fmt = [settings.dateFormat, settings.timeFormat];
  } else {
    fmt = format.split("|");
    if (fmt[0] != null) fmt[0] = fmt[0].trim();
    fmt[1] = fmt.length > 1 ? (fmt[1] ?? "").trim() : settings.timeFormat;
  }
  if (fmt[1] === "h12") fmt[1] = "h:m pm";
  if (fmt[1] === "h24") fmt[1] = "h24:m";
  return _formatDate(dateStr, fmt[0], settings) + " " + _formatTime(dateStr, fmt[1], settings);
}

// src/tsutils.ts
var query7 = query;
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
    }, TsLocale, { phrases: null }), // if there are no phrases, then it is original language
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
        return TsUtils.formatNumber(parseFloat(String(value)), params, true);
      },
      "float"(record, extra) {
        return TsUtils.formatters["number"]?.(record, extra) ?? "";
      },
      "int"(record, extra) {
        return TsUtils.formatters["number"]?.(record, extra) ?? "";
      },
      "money"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        if (value == null || value === "") return "";
        const data = TsUtils.formatNumber(Number(value), TsUtils.settings.currencyPrecision, true);
        return (TsUtils.settings.currencyPrefix || "") + data + (TsUtils.settings.currencySuffix || "");
      },
      "currency"(record, extra) {
        return TsUtils.formatters["money"]?.(record, extra) ?? "";
      },
      "percent"(record, extra) {
        if (extra == void 0) extra = record;
        const { value, params } = extra;
        if (value == null || value === "") return "";
        return TsUtils.formatNumber(value, params || 1) + "%";
      },
      "size"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        if (value == null || value === "") return "";
        return String(TsUtils.formatSize(parseInt(String(value))));
      },
      "date"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        let params = extra.params;
        if (params === "") params = TsUtils.settings.dateFormat;
        if (value == null || value === 0 || value === "") return "";
        let dt = TsUtils.isDateTime(value, params ?? null, true);
        if (dt === false) dt = TsUtils.isDate(value, params ?? null, true);
        const dtStr = dt instanceof Date ? dt : "";
        return '<span title="' + dtStr + '">' + TsUtils.formatDate(dt instanceof Date ? dt : void 0, params) + "</span>";
      },
      "datetime"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        let params = extra.params;
        if (params === "") params = TsUtils.settings.datetimeFormat;
        if (value == null || value === 0 || value === "") return "";
        let dt = TsUtils.isDateTime(value, params ?? null, true);
        if (dt === false) dt = TsUtils.isDate(value, params ?? null, true);
        const dtStr = dt instanceof Date ? dt : "";
        return '<span title="' + dtStr + '">' + TsUtils.formatDateTime(dt instanceof Date ? dt : void 0, params) + "</span>";
      },
      "time"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        let params = extra.params;
        if (params === "") params = TsUtils.settings.timeFormat;
        if (params === "h12") params = "hh:mi pm";
        if (params === "h24") params = "h24:mi";
        if (value == null || value === 0 || value === "") return "";
        let dt = TsUtils.isDateTime(value, params ?? null, true);
        if (dt === false) dt = TsUtils.isDate(value, params ?? null, true);
        const dtStr = dt instanceof Date ? dt : "";
        return '<span title="' + dtStr + '">' + TsUtils.formatTime(value, params) + "</span>";
      },
      "timestamp"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        let params = extra.params;
        if (params === "") params = TsUtils.settings.datetimeFormat;
        if (value == null || value === 0 || value === "") return "";
        let dt = TsUtils.isDateTime(value, params ?? null, true);
        if (dt === false) dt = TsUtils.isDate(value, params ?? null, true);
        return dt instanceof Date ? dt.toString() : "";
      },
      "gmt"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        let params = extra.params;
        if (params === "") params = TsUtils.settings.datetimeFormat;
        if (value == null || value === 0 || value === "") return "";
        let dt = TsUtils.isDateTime(value, params ?? null, true);
        if (dt === false) dt = TsUtils.isDate(value, params ?? null, true);
        return dt instanceof Date ? dt.toUTCString() : "";
      },
      "age"(record, extra) {
        if (extra == void 0) extra = record;
        const { value, params } = extra;
        if (value == null || value === 0 || value === "") return "";
        let dt = TsUtils.isDateTime(value, null, true);
        if (dt === false) dt = TsUtils.isDate(value, null, true);
        const dtStr = dt instanceof Date ? dt : "";
        return '<span title="' + dtStr + '">' + TsUtils.age(value) + (params ? " " + params : "") + "</span>";
      },
      "interval"(record, extra) {
        if (extra == void 0) extra = record;
        const { value, params } = extra;
        if (value == null || value === 0 || value === "") return "";
        return TsUtils.interval(Number(value)) + (params ? " " + params : "");
      },
      "toggle"(record, extra) {
        if (extra == void 0) extra = record;
        const { value } = extra;
        return value ? TsUtils.lang("Yes") : "";
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
    return isBin(val);
  }
  isInt(val) {
    return isInt(val);
  }
  isFloat(val) {
    return isFloat(val, this.settings);
  }
  isMoney(val) {
    return isMoney(val, this.settings);
  }
  isHex(val) {
    return isHex(val);
  }
  isAlphaNumeric(val) {
    return isAlphaNumeric(val);
  }
  isEmail(val) {
    return isEmail(val);
  }
  isIpAddress(val) {
    return isIpAddress(val);
  }
  isDate(val, format, retDate) {
    return _isDate(val, format, retDate, this.settings);
  }
  isTime(val, retTime) {
    return _isTime(val, retTime);
  }
  isDateTime(val, format, retDate) {
    return _isDateTime(val, format, retDate, this.settings);
  }
  age(dateStr) {
    return _age(dateStr);
  }
  interval(value) {
    return _interval(value);
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
    return _formatDate(dateStr, format, this.settings);
  }
  formatTime(dateStr, format) {
    return _formatTime(dateStr, format, this.settings);
  }
  formatDateTime(dateStr, format) {
    return _formatDateTime(dateStr, format, this.settings);
  }
  stripSpaces(html) {
    return stripSpaces(html);
  }
  stripTags(html) {
    return stripTags(html);
  }
  encodeTags(html) {
    return encodeTags(html);
  }
  decodeTags(html) {
    return decodeTags(html);
  }
  escapeId(id) {
    return escapeId(id);
  }
  unescapeId(id) {
    return unescapeId(id);
  }
  base64encode(str) {
    return base64encode(str);
  }
  base64decode(encodedStr) {
    return base64decode(encodedStr);
  }
  sha256(str) {
    return sha256(str);
  }
  transition(div_old, div_new, type, callBack) {
    return transition(div_old, div_new, type, callBack);
  }
  lock(box, options = {}, ...rest) {
    return lock(box, options, ...rest);
  }
  unlock(box, speed) {
    return unlock(box, speed);
  }
  /**
   * Constructs the MessageDeps object for the _message() delegator.
   * Called once per message() invocation — captures `this` at call time.
   * Per design §C.5 / §C.2.
   * @internal
   */
  _msgDeps() {
    return {
      extend,
      bindEvents: (s, subj) => this.bindEvents(s, subj),
      lock: (box, opts) => this.lock(box, opts),
      unlock: (box, speed) => this.unlock(box, speed),
      // any: 'name' is set dynamically on widget instances (TsGrid, TsForm, etc.) at runtime
      ownerName: this["name"],
      self: this
    };
  }
  /**
   * Constructs the ConfirmDeps object for the _confirm() delegator.
   * Per design §C.3.
   * normButtons closure: uses inline lambda that binds this.lang and this.settings
   * at call time — preserving the call-time timing semantics (design §C.3 caveat).
   * @internal
   */
  _confirmDeps() {
    return {
      extend,
      normButtons: (opts, btn) => normButtons(opts, btn, { extend, lang: this.lang.bind(this), settings: this.settings }),
      message: (w, o) => this.message(w, o),
      settings: this.settings,
      lang: this.lang.bind(this)
    };
  }
  /**
   * Constructs the PromptDeps object for the _prompt() delegator.
   * Per design §C.3.
   * lang is bound at call time so deps.lang('Ok') uses current locale.
   * @internal
   */
  _promptDeps() {
    return {
      extend,
      normButtons: (opts, btn) => normButtons(opts, btn, { extend, lang: this.lang.bind(this), settings: this.settings }),
      message: (w, o) => this.message(w, o),
      settings: this.settings,
      lang: this.lang.bind(this)
    };
  }
  /**
   * Opens a context message, similar in parameters as TsPopup.open()
   *
   * Sample Calls
   * TsUtils.message({ box: '#div', text: 'message' }).ok(() => {})
   * TsUtils.message({ box: '#div', text: 'message', width: 300 }).ok(() => {})
   * TsUtils.message({ box: '#div', text: 'message', actions: ['Save'] }).Save(() => {})
   *
   * Used in TsGrid, TsForm, TsLayout (should be in TsPopup too)
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
    return _message(where, options, this._msgDeps());
  }
  alert(where, options) {
    return _alert(where, options, this._msgDeps());
  }
  /**
   * Shows a prompt as a context message. It will use same where: { box: ... } as TsUtils.message() function
   * but it will have options similar to TsPrompt dialog
   *
   * Example:
   *  - TsUtils.conrirm({
   *       box: '#custom',
   *       text: 'Some message'
   *    })
   *    .yes(event => console.log(event))
   */
  confirm(where, options) {
    return _confirm(where, options, this._confirmDeps());
  }
  /**
   * Shows a prompt as a context message. It will use same where: { box: ... } as TsUtils.message() function
   * but it will have options similar to TsPrompt dialog
   *
   * Example:
   *  - TsUtils.prompt({
   *       box: '#custom',
   *       label: 'Enter Name',
   *       textarea: false,
   *       attrs: 'style="border: 1px solid red"'
   *    })
   *    .ok(event => console.log(event))
   */
  prompt(where, options) {
    return _prompt(where, options, this._promptDeps());
  }
  /**
   * Normalizes yes, no buttons for confirmation dialog
   *
   * @param {*} options
   * @returns  options
   */
  normButtons(options, btn) {
    return normButtons(options, btn, {
      extend,
      lang: this.lang.bind(this),
      settings: this.settings
    });
  }
  /**
   * Shows small notification message at the bottom of the page, or containter that you specify
   * in options.where (could be element or a selector)
   *
   * TsUtils.notify('Document saved')
   * TsUtils.notify('Mesage sent ${udon}', { actions: { undo: function () {...} }})
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
    return notify(text, options, { execTemplate: this.execTemplate.bind(this), tmpSlot: this.tmp });
  }
  getSize(el, type) {
    return getSize(el, type);
  }
  getStrDimentions(str, styles, raw) {
    return getStrDimentions(str, styles, raw);
  }
  getStrWidth(str, styles, raw) {
    return this.getStrDimentions(str, styles, raw).width;
  }
  getStrHeight(str, styles, raw) {
    return this.getStrDimentions(str, styles, raw).height;
  }
  // any: targeted-any per typing_policy; TsUtils helper accepts heterogeneous runtime input
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  execTemplate(str, replace_obj) {
    return execTemplate(str, replace_obj);
  }
  // any: parameter typed any — runtime dispatch by call site; TsUtils helper accepts heterogeneous runtime input
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  marker(el, items, options) {
    return marker(el, items, options);
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
          `Missing translation for "%c${phrase}%c", see %c TsUtils.settings.phrases %c with value "---"`,
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
        this.settings = this.extend({}, this.settings, TsLocale, locale);
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
            this.settings = this.extend({}, this.settings, TsLocale, { phrases: {} }, data);
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
    query7("body").append(html);
    this.tmp["scrollBarSize"] = 100 - query7("#_scrollbar_width > div")[0].clientWidth;
    query7("#_scrollbar_width").remove();
    return this.tmp["scrollBarSize"];
  }
  checkName(name) {
    return checkName(name);
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
    return encodeParams(obj, prefix);
  }
  parseRoute(route) {
    return parseRoute(route);
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
        let tmp = String(query7(input.childNodes[i]).text());
        if (input.childNodes[i].tagName) {
          tmp = String(query7(input.childNodes[i]).html());
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
    return parseColor(str);
  }
  colorContrast(color1, color2) {
    return colorContrast(color1, color2);
  }
  colorContrastValue(color1, color2) {
    return colorContrastValue(color1, color2);
  }
  // h=0..360, s=0..100, v=0..100
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hsv2rgb(h, s, v, a) {
    return hsv2rgb(h, s, v, a);
  }
  // any: overloaded dual-form delegator
  // r=0..255, g=0..255, b=0..255
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rgb2hsv(r, g, b, a) {
    return rgb2hsv(r, g, b, a);
  }
  // any: overloaded dual-form delegator
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
    const actions = ` on${showOn}="TsTooltip.show(this, JSON.parse(TsUtils.base64decode('${this.base64encode(JSON.stringify(opts))}')))" on${hideOn}="TsTooltip.hide('${opts["name"]}')"`;
    return actions;
  }
  // determins if it is plain Object, not DOM element, nor a function, event, etc.
  isPlainObject(value) {
    return isPlainObject(value);
  }
  /**
   * Deep copy of an object or an array. Function, events and HTML elements will not be cloned,
   * you can choose to include them or not, by default they are included.
   * You can also exclude certain elements from final object if used with options: { exclude }
   */
  // any: return type any — caller narrows by code path; TsUtils helper accepts heterogeneous runtime input
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clone(obj, options) {
    return clone(obj, options);
  }
  /**
   * Deep extend an object, if an array, it overwrrites it, cloning objects in the process
   * target, source1, source2, ...
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extend(target, source, ...rest) {
    return extend(target, source, ...rest);
  }
  // any: generic deep-extend; arbitrary object shapes at runtime
  /*
   * @author     Lauri Rooden (https://github.com/litejs/natural-compare-lite)
   * @license    MIT License
   */
  naturalCompare(a, b) {
    return naturalCompare(a, b);
  }
  /**
   * Takes a menu (used in drop downs, context menu, field: list/combo/enum) and normalizes it to the common structure, which
   * is { id: ..., text: ... }. In options you can pass { itemMap: { id: 'id_field', text: 'text_field' }} that will be used
   * to find out id and text fields.
   */
  normMenu(menu, options = {}) {
    return normMenu(menu, options);
  }
  /**
   * Takes Url object and fetchOptions and changes it in place applying selected user dataType. Since
   * dataType is in TsUtils. This method is used in grid, form and tooltip to prepare fetch parameters
   */
  prepareParams(url, fetchOptions, options = {}) {
    return prepareParams(url, fetchOptions, options, TsUtils.settings.dataType);
  }
  bindEvents(selector, subject) {
    return bindEvents(selector, subject);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debounce(func, wait2 = 250) {
    return debounce(func, wait2);
  }
  async wait(time = 0) {
    return wait(time);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getNested(obj, prop) {
    return getNested(obj, prop);
  }
};
var TsUtils = new Utils();

// src/tspopup.ts
var query8 = query;
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
    if (this.status == "closing" || query8("#tsg-popup").hasClass("animating")) {
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
    if (query8("#tsg-popup").length === 0) {
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
      titleBtns += `<div class="tsg-popup-button tsg-popup-close">
                        <span class="tsg-icon tsg-icon-cross tsg-eaction" data-mousedown="stop" data-click="close"></span>
                    </div>`;
    }
    if (options.showMax) {
      titleBtns += `<div class="tsg-popup-button tsg-popup-max">
                        <span class="tsg-icon tsg-icon-box tsg-eaction" data-mousedown="stop" data-click="toggle"></span>
                    </div>`;
    }
    if (query8("#tsg-popup").length === 0) {
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
      query8("body").append(msg);
      query8("#tsg-popup")[0]._w2popup = {
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
      query8("#tsg-popup").html(msg);
      if (options.title) query8("#tsg-popup .tsg-popup-title").append(TsUtils.lang(options.title));
      if (options.buttons) query8("#tsg-popup .tsg-popup-buttons").append(options.buttons);
      if (options.body) query8("#tsg-popup .tsg-popup-body").append(options.body);
      setTimeout(() => {
        ;
        query8("#tsg-popup").css("transition", options.speed + "s").removeClass("tsg-anim-open");
        TsUtils.bindEvents("#tsg-popup .tsg-eaction", this);
        query8("#tsg-popup").find(".tsg-popup-body").show();
        this._promCreated();
      }, 1);
      clearTimeout(this._timer);
      this._timer = setTimeout(() => {
        this.status = "open";
        self.setFocus(options.focus);
        edata.finish();
        this._promOpened();
        query8("#tsg-popup").removeClass("animating");
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
      const cloned = query8("#tsg-popup .tsg-box").get(0).cloneNode(true);
      query8(cloned).removeClass("tsg-box").addClass("tsg-box-temp").find(".tsg-popup-body").empty().append(options.body);
      query8("#tsg-popup .tsg-box").after(cloned);
      if (options.buttons) {
        ;
        query8("#tsg-popup .tsg-popup-buttons").show().html("").append(options.buttons);
        query8("#tsg-popup .tsg-popup-body").removeClass("tsg-popup-no-buttons");
        query8("#tsg-popup .tsg-box, #tsg-popup .tsg-box-temp").css("bottom", "");
      } else {
        query8("#tsg-popup .tsg-popup-buttons").hide().html("");
        query8("#tsg-popup .tsg-popup-body").addClass("tsg-popup-no-buttons");
        query8("#tsg-popup .tsg-box, #tsg-popup .tsg-box-temp").css("bottom", "0px");
      }
      if (options.title) {
        query8("#tsg-popup .tsg-popup-title").show().html(TsUtils.lang(options.title));
        query8("#tsg-popup .tsg-popup-body").removeClass("tsg-popup-no-title");
        query8("#tsg-popup .tsg-box, #tsg-popup .tsg-box-temp").css("top", "");
      } else {
        query8("#tsg-popup .tsg-popup-title").hide().html("");
        query8("#tsg-popup .tsg-popup-body").addClass("tsg-popup-no-title");
        query8("#tsg-popup .tsg-box, #tsg-popup .tsg-box-temp").css("top", "0px");
      }
      if (titleBtns) {
        query8("#tsg-popup .tsg-popup-title-btns").show().html(titleBtns);
      } else {
        query8("#tsg-popup .tsg-popup-title-btns").hide();
      }
      const div_old = query8("#tsg-popup .tsg-box")[0];
      const div_new = query8("#tsg-popup .tsg-box-temp")[0];
      query8("#tsg-popup").addClass("animating");
      TsUtils.transition(div_old, div_new, options.transition, () => {
        query8(div_old).remove();
        query8(div_new).removeClass("tsg-box-temp").addClass("tsg-box");
        const $body = query8(div_new).find(".tsg-popup-body");
        if ($body.length == 1) {
          $body[0].style.cssText = options.style;
          $body.show();
        }
        self.setFocus(options.focus);
        query8("#tsg-popup").removeClass("animating");
      });
      this.status = "open";
      edata.finish();
      TsUtils.bindEvents("#tsg-popup .tsg-eaction", this);
      query8("#tsg-popup").find(".tsg-popup-body").show();
    }
    if (options.openMaximized) {
      this.max();
    }
    options._last_focus = document.activeElement;
    if (options.keyboard) {
      query8(document.body).off(".TsPopup").on("keydown.TsPopup", (event2) => {
        this.keydown(event2);
      });
    }
    query8(window).on("resize", this.handleResize);
    const tmp = {
      changing: false,
      mvMove,
      mvStop
    };
    query8("#tsg-popup .tsg-popup-title").off("mousedown").on("mousedown", function(event2) {
      if (!self.options.maximized) mvStart(event2);
    });
    if (options.resizable) {
      query8("#tsg-popup .tsg-popup-resizer").show();
      query8("#tsg-popup .tsg-popup-resizer").off("mousedown").on("mousedown", (event2) => {
        mvStart(event2, true);
      });
    } else {
      query8("#tsg-popup .tsg-popup-resizer").hide();
    }
    return prom;
    function mvStart(evt, resizer) {
      if (!evt) evt = window.event;
      self.status = resizer ? "resizing" : "moving";
      const rect = query8("#tsg-popup").get(0).getBoundingClientRect();
      Object.assign(tmp, {
        changing: true,
        isLocked: query8("#tsg-popup > .tsg-lock").length == 1 ? true : false,
        x: evt.screenX,
        y: evt.screenY,
        pos_x: rect.x,
        pos_y: rect.y,
        width: rect.width,
        height: rect.height
      });
      if (!tmp.isLocked) self.lock({ opacity: 0 });
      query8(document.body).on("mousemove.tsg-popup", tmp.mvMove).on("mouseup.tsg-popup", tmp.mvStop);
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
        query8("#tsg-popup").css({
          "transition": "none",
          "transform": "translate3d(" + tmp.div_x + "px, " + tmp.div_y + "px, 0px)"
        });
        self.options.moved = true;
      } else {
        query8("#tsg-popup").css({
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
        query8("#tsg-popup").css({
          "left": tmp.pos_x + tmp.div_x + "px",
          "top": tmp.pos_y + tmp.div_y + "px"
        }).css({
          "transition": "none",
          "transform": "translate3d(0px, 0px, 0px)"
        });
      } else {
        query8("#tsg-popup").css({
          transition: "none",
          width: tmp.width + tmp.div_x + "px",
          height: tmp.height + tmp.div_y + "px"
        });
        self.resizeMessages();
      }
      tmp.changing = false;
      self.status = "open";
      query8(document.body).off(".tsg-popup");
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
      html = query8(data);
    } catch (e) {
      html = query.html(data);
    }
    if (id) html = html.filter("#" + id);
    Object.assign(options, {
      width: parseInt(query8(html).css("width")),
      height: parseInt(query8(html).css("height")),
      title: query8(html).find("[rel=title]").html(),
      body: query8(html).find("[rel=body]").html(),
      buttons: query8(html).find("[rel=buttons]").html(),
      style: query8(html).find("[rel=body]").get(0).style.cssText
    });
    return this.open(options);
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action(action, event2) {
    let click2 = this.options.actions?.[action];
    if (click2 instanceof Object && click2.onClick) click2 = click2.onClick;
    const edata = this.trigger("action", {
      action,
      target: "popup",
      self: this,
      // any: cast-to-any for dynamic dispatch; TsPopup options accept untyped user payloads at runtime
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      originalEvent: event2,
      value: this["input"] ? this["input"].value : null
    });
    if (edata.isCancelled === true) return;
    if (typeof click2 === "function") click2.call(this, event2);
    edata.finish();
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keydown(event2) {
    if (this.options && !this.options.keyboard) return;
    const edata = this.trigger("keydown", { target: "popup", originalEvent: event2 });
    if (edata.isCancelled === true) return;
    switch (event2.keyCode) {
      case 27:
        event2.preventDefault();
        if (query8("#tsg-popup .tsg-message").length == 0) {
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
      query8("#tsg-popup").remove();
      if (this.options._last_focus) this.options._last_focus.focus();
      this.status = "closed";
      this.options = {};
      edata.finish();
      this._promClosed();
    };
    if (query8("#tsg-popup").length === 0 || this.status == "closed") {
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
    query8("#tsg-popup").css("transition", this.options.speed + "s").addClass("tsg-anim-close animating");
    TsUtils.unlock(document.body, 300);
    this._promClosing();
    if (immediate) {
      cleanUp();
    } else {
      this.tmp["closingTimer"] = setTimeout(cleanUp, (this.options.speed ?? 0.3) * 1e3);
    }
    if (this.options.keyboard) {
      query8(document.body).off("keydown", this.keydown);
    }
    query8(window).off("resize", this.handleResize);
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
    const rect = query8("#tsg-popup").get(0).getBoundingClientRect();
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
    query8("#tsg-popup .tsg-popup-title").html("");
    query8("#tsg-popup .tsg-popup-body").html("");
    query8("#tsg-popup .tsg-popup-buttons").html("");
  }
  reset() {
    this.open(this.defaults);
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message(options) {
    return TsUtils.message({
      owner: this,
      box: query8("#tsg-popup").get(0),
      after: ".tsg-popup-title"
    }, options);
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  confirm(options) {
    return TsUtils.confirm({
      owner: this,
      box: query8("#tsg-popup").get(0),
      after: ".tsg-popup-title"
    }, options);
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFocus(focus2) {
    const box = query8("#tsg-popup");
    const sel = "input, button, select, textarea, [contentEditable], [tabindex], .tsg-input";
    if (focus2 != null) {
      const el = isNaN(focus2) ? box.find(sel).filter(focus2).filter(":not([name=hidden-first])").get(0) : box.find(sel).filter(":not([name=hidden-first])").get(focus2);
      el?.focus();
    } else {
      const el = box.find("[name=hidden-first]").get(0);
      if (el) el.focus();
    }
    query8(box).find(sel).off(".keep-focus").on("blur.keep-focus", function(_event) {
      setTimeout(() => {
        const focus3 = document.activeElement;
        const inside = query8(box).find(sel).filter(focus3).length > 0;
        const name = query8(focus3).attr("name");
        if (!inside && focus3 && focus3 !== document.body) {
          query8(box).find(sel).get(0)?.focus();
        }
        if (name == "hidden-last") {
          query8(box).find(sel).get(1)?.focus();
        }
        if (name == "hidden-first") {
          query8(box).find(sel).get(-2)?.focus();
        }
      }, 1);
    });
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lock(msg, showSpinner) {
    TsUtils.lock(query8("#tsg-popup"), msg, showSpinner);
  }
  // any: callback parameter — caller signature varies; TsPopup options accept untyped user payloads at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unlock(speed) {
    TsUtils.unlock(query8("#tsg-popup"), speed);
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
      query8("#tsg-popup").css({
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
      query8("#tsg-popup").css({
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
    query8("#tsg-popup .tsg-message").each((node) => {
      const msg = node;
      const mopt = msg._msg_options;
      const popup = query8("#tsg-popup");
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
      query8(msg).css({
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
  if (query8("#tsg-popup").length > 0 && TsPopup.status != "closing") {
    prom = TsPopup.message(options);
  } else {
    prom = TsPopup.open(options);
  }
  prom["ok"]((event2) => {
    if (typeof event2.detail.self?.close == "function") {
      event2.detail.self.close();
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
  if (query8("#tsg-popup").length > 0 && TsPopup.status != "closing") {
    prom = TsPopup.message(options);
  } else {
    prom = TsPopup.open(options);
  }
  prom.self.off(".confirm").on("action:after.confirm", (event2) => {
    if (typeof event2.detail.self?.close == "function") {
      event2.detail.self.close();
    }
    if (typeof callBack == "function") callBack(event2.detail.action);
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
  if (query8("#tsg-popup").length > 0 && TsPopup.status != "closing") {
    prom = TsPopup.message(options);
  } else {
    prom = TsPopup.open(options);
  }
  if (prom.self.box) {
    prom.self["input"] = query8(prom.self.box).find("#TsPrompt").get(0);
  } else {
    prom.self["input"] = query8("#tsg-popup .tsg-popup-body #TsPrompt").get(0);
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
    const box = event2.detail.box ? event2.detail.box : query8("#tsg-popup .tsg-popup-body").get(0);
    TsUtils.bindEvents(query8(box).find("#TsPrompt"), {
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
    query8(box).find(".tsg-eaction").trigger("keyup");
  }).on("action:after.prompt", (event2) => {
    if (typeof event2.detail.self?.close == "function") {
      event2.detail.self.close();
    }
    if (typeof callBack == "function") callBack(event2.detail.action);
  });
  return prom;
}
var TsPopup = new TsDialog();

// src/tstooltip.ts
var query9 = query;
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
      query9(anchor).off(`.${scope}`).on(`${options.autoShowOn}.${scope}`, (event2) => {
        self.show(overlay.name);
        event2.stopPropagation();
      });
      delete options.autoShowOn;
      options._keep = true;
    }
    if (options.autoHideOn) {
      const scope = "autoHide-" + overlay.name;
      query9(anchor).off(`.${scope}`).on(`${options.autoHideOn}.${scope}`, (event2) => {
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
      query9(ret.overlay.anchor).off(".autoShow-" + ret.overlay.name).off(".autoHide-" + ret.overlay.name);
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
      query9(overlay.box).find(".tsg-overlay-body").attr("style", (options.style || "") + "; " + overlayStyles).removeClass(null).addClass("tsg-overlay-body " + options.class + (options.draggable ? " tsg-draggable" : "")).html(options.html);
      this.resize(overlay.name);
    } else {
      edata = this.trigger("show", { target: name, overlay });
      if (edata.isCancelled === true) return;
      query9("body").append(
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
      overlay.box = query9("#" + TsUtils.escapeId(overlay.id))[0];
      overlay.displayed = true;
      const names = query9(overlay.anchor).data("tooltipName") ?? [];
      names.push(name);
      query9(overlay.anchor).data("tooltipName", names);
      TsUtils.bindEvents(overlay.box, {});
      overlay.tmp.originalCSS = "";
      if (query9(overlay.anchor).length > 0) {
        overlay.tmp.originalCSS = query9(overlay.anchor)[0].style.cssText;
      }
      this.resize(overlay.name);
    }
    if (options.anchorStyle) {
      overlay.anchor.style.cssText += ";" + options.anchorStyle;
    }
    if (options.anchorClass) {
      if (!(options.anchorClass == "tsg-focus" && overlay.anchor == document.body)) {
        query9(overlay.anchor).addClass(options.anchorClass);
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
    query9(overlay.box).show();
    overlay.tmp.observeTooltipResize.observe(overlay.box);
    overlay.tmp.observeAnchorResize.observe(overlay.anchor);
    overlay.tmp.observeAnchorMove.observe(overlay.anchor, { attributes: true });
    _Tooltip.observeRemove.observe(document.body, { subtree: true, childList: true });
    query9(overlay.box).css("opacity", 1).find(".tsg-overlay-body").html(options.html);
    setTimeout(() => {
      query9(overlay.box).css({ "pointer-events": "auto" }).data("ready", "yes");
    }, 100);
    TsUtils.bindEvents(query9(overlay.box).find(".tsg-eaction"), this);
    delete overlay.needsUpdate;
    overlay.box.overlay = overlay;
    query9(overlay.box).off("mousedown.tsg-bringfront").on("mousedown.tsg-bringfront", () => {
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
      query9(queryEl).off(`.${scope}`).on(`scroll.${scope}`, (_event) => {
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
      const $anchor = query9(overlay.anchor);
      const scope = "tooltip-" + overlay.name;
      query9("html").off(`.${scope}`);
      if (options.hideOn.includes("doc-click")) {
        if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
          $anchor.off(`.${scope}-doc`).on(`click.${scope}-doc`, (event2) => {
            event2.stopPropagation();
          });
        }
        query9("html").on(`click.${scope}`, hide);
      }
      if (options.hideOn.includes("tooltip-click")) {
        query9(overlay.box).off(`click.${scope}`).on(`click.${scope}`, hide);
      }
      if (options.hideOn.includes("focus-change") || options.hideOn.includes("blur")) {
        query9("html").on(`focusin.${scope}`, (_e) => {
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
      const names2 = query9(name).data("tooltipName") ?? [];
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
    query9("html").off(`.${scope}`);
    query9(document).off(`.${scope}`);
    overlay.box?.remove();
    overlay.box = null;
    overlay.displayed = false;
    const names = query9(overlay.anchor).data("tooltipName") ?? [];
    const ind = names.indexOf(overlay.name);
    if (ind != -1) names.splice(names.indexOf(overlay.name), 1);
    if (names.length == 0) {
      query9(overlay.anchor).removeData("tooltipName");
    } else {
      query9(overlay.anchor).data("tooltipName", names);
    }
    if (overlay.options.anchorStyle) {
      overlay.anchor.style.cssText = overlay.tmp.originalCSS;
    }
    query9(overlay.anchor).off(`.${scope}`).removeClass(overlay.options.anchorClass);
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
    const qBox = query9(overlay.box).css({
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
      query9(overlay.box).css({ width: "", height: "", scroll: "auto" });
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
  startDrag(event2) {
    if (event2.preventDefault) {
      event2.preventDefault();
    }
    const el = query9(event2.target).closest(".tsg-overlay");
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
    query9(document).off(".tsg-drag").on("selectstart.tsg-drag, dragstart.tsg-drag", (e) => e.preventDefault()).find("body").addClass("tsg-overlay-dragging");
    query9("html").off(".TsColor").on("mousemove.TsColor", mouseMove).on("mouseup.TsColor", mouseUp);
    function mouseUp(_event) {
      query9("html").off(".TsColor");
      query9(document).off("selectstart.tsg-drag");
      query9(document).off("dragstart.tsg-drag");
      query9(document.body).removeClass("tsg-overlay-dragging");
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
        const actions = query9(ret.overlay.box).find(".tsg-eaction");
        TsUtils.bindEvents(actions, this);
        this.initControls(ret.overlay);
      }
    });
    overlay.on("update:after.attach", (_event) => {
      if (ret.overlay?.box) {
        const actions = query9(ret.overlay.box).find(".tsg-eaction");
        TsUtils.bindEvents(actions, this);
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
      this.index = (query9(target).attr("index") ?? "").split(":").map(Number);
      name = query9(target).closest(".tsg-overlay").attr("name");
    }
    const overlay = this.get(name);
    const edata = this.trigger("liveUpdate", { color, target: name, overlay, param: name });
    if (edata.isCancelled === true) return;
    if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName) && overlay.options.updateInput) {
      query9(overlay.anchor).val(color);
    }
    overlay.newColor = color;
    query9(overlay.box).find(".tsg-color.tsg-selected").removeClass("tsg-selected");
    if (target) {
      query9(target).addClass("tsg-selected");
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
      name = query9(name.target).closest(".tsg-overlay").attr("name");
    }
    const overlay = this.get(name);
    const tab = query9(overlay.box).find(`.tsg-color-tab:nth-child(${index})`);
    query9(overlay.box).find(".tsg-color-tab").removeClass("tsg-selected");
    query9(tab).addClass("tsg-selected");
    query9(overlay.box).find(".tsg-tab-content").hide().closest(".tsg-colors").find(".tab-" + index).show();
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
    query9(overlay.box).off(".TsColor").on("contextmenu.TsColor", (event2) => {
      event2.preventDefault();
    }).find("input").off(".TsColor").on("change.TsColor", (event2) => {
      const el = query9(event2.target);
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
    query9(overlay.box).find(".color-original").off(".TsColor").on("click.TsColor", (event2) => {
      const tmp = TsUtils.parseColor(query9(event2.target).css("background-color"));
      if (tmp != null) {
        rgb = tmp;
        hsv = TsUtils.rgb2hsv(rgb);
        setColor(hsv, true);
      }
    });
    const mDown = `${!TsUtils.isMobile ? "mousedown" : "touchstart"}.TsColor`;
    const mUp = `${!TsUtils.isMobile ? "mouseup" : "touchend"}.TsColor`;
    const mMove = `${!TsUtils.isMobile ? "mousemove" : "touchmove"}.TsColor`;
    query9(overlay.box).find(".palette, .rainbow, .alpha").off(".TsColor").on(`${mDown}.TsColor`, mouseDown);
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
      query9(overlay.box).find(".color-preview").css("background-color", "#" + newColor);
      query9(overlay.box).find("input").each((el) => {
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
        query9(overlay.box).find(".color-original").css("background-color", "#" + color3);
        query9(overlay.box).find(".tsg-color.tsg-selected").removeClass("tsg-selected");
        query9(overlay.box).find(`.tsg-colors [name="${color3}"], .tsg-colors [name="${initial2}"]`).addClass("tsg-selected");
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
      const el1 = query9(overlay.box).find(".palette .value1");
      const el2 = query9(overlay.box).find(".rainbow .value2");
      const el3 = query9(overlay.box).find(".alpha .value2");
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
      query9(overlay.box).find(".palette").css("background-image", `linear-gradient(90deg, rgba(${rgb2},0) 0%, rgba(${rgb2},1) 100%)`);
    }
    function mouseDown(event2) {
      const el = query9(this).find(".value1, .value2");
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
      query9("html").off(".TsColor").on(mMove, mouseMove).on(mUp, mouseUp);
    }
    function mouseUp(_event) {
      query9("html").off(".TsColor");
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
      const name = query9(el.get(0).parentNode).attr("name");
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
  async pickAndSelect(name, event2) {
    const color = await this.pickColor();
    if (typeof color == "string" && color.substr(0, 1) == "#" && [7, 9].includes(color.length)) {
      this.addCustomColor(color, name);
      const cnt = query9(event2.target).closest(".tsg-colors-custom");
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
        let search2 = "";
        overlay.selected = overlay.options.selected;
        const index = overlay.anchor.dataset?.selectedIndex;
        if (overlay.options.selected !== false && overlay.options.selected !== -1 || index != null) {
          if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
            search2 = overlay.anchor.value;
            overlay.selected = null;
            if (index != null) {
              overlay.selected = index;
            }
          }
        }
        const actions = query9(ret.overlay.box).find(".tsg-eaction");
        if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
          overlay.tmp._new_search = false;
          query9(overlay.anchor).on("input.search-trigger", () => {
            overlay.tmp._new_search = true;
            query9(overlay.anchor).off("input.search-trigger");
          });
        }
        TsUtils.bindEvents(actions, this);
        this.applyFilter(overlay.name, null, search2, void 0).then((data) => {
          if (!Tooltip.active[overlay.name]?.displayed) {
            return;
          }
          this.getActiveChain(overlay.name, options.items);
          overlay.tmp.searchCount = data.count;
          overlay.tmp.search = data.search;
          if (options.prefilter || search2 !== "") {
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
      query9(overlay.box).find(".tsg-selected").each((el) => {
        el.click();
      });
    };
    overlay.on("hide:after.attach", (_event) => {
      TsTooltip.hide(overlay.name + "-tooltip");
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
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initControls(overlay) {
    let mdown = "mousedown";
    let mclick = "click";
    if (TsUtils.isMobile) {
      mdown = "touchstart";
      mclick = "touchend";
    }
    query9(overlay.box).find(".tsg-menu:not(.tsg-sub-menu)").off(".TsMenu").on("contextmenu.TsMenu", (event2) => {
      event2.preventDefault();
    }).on(`${mdown}.TsMenu`, { delegate: ".tsg-menu-item" }, (event2) => {
      const dt = event2.delegate.dataset;
      const parents = query9(event2.delegate).closest(".tsg-menu").data("parents");
      this.menuDown(overlay, event2, dt.index, parents);
      if (TsUtils.isMobile) {
        event2.preventDefault();
      }
    }).on(`${mclick}.TsMenu`, { delegate: ".tsg-menu-item" }, (event2) => {
      const dt = event2.delegate.dataset;
      const parents = query9(event2.delegate).closest(".tsg-menu").data("parents");
      this.menuClick(overlay, event2, parseInt(dt["index"] ?? "0"), parents);
    }).find(".tsg-menu-item").off(".TsMenu").on("mouseEnter.TsMenu", (event2) => {
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
      const _menu = query9(event2.target).closest(".tsg-menu").get(0);
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
    }).on("mouseLeave.TsMenu", (event2) => {
      const dt = event2.target.dataset;
      const item = overlay.options.items[dt["index"] ?? ""];
      const edata = this.trigger("mouseLeave", { overlay, item, originalEvent: event2 });
      if (edata.isCancelled) {
        return;
      }
      TsTooltip.hide(overlay.name + "-tooltip");
      edata.finish();
    }).find(".menu-help").off(".TsMenu").on("mouseEnter.TsMenu", (event2) => {
      const target = event2.target;
      const dt = target.parentNode?.parentNode;
      const tooltip = overlay.options.items[dt.dataset?.index]?.help;
      if (tooltip) {
        TsTooltip.show({
          name: overlay.name + "-help-tp",
          anchor: event2.target,
          html: tooltip,
          position: "right|left",
          hideOn: ["doc-click"]
        });
      }
    }).on("mouseLeave.TsMenu", (_event) => {
      TsTooltip.hide(overlay.name + "-help-tp");
    });
    if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
      query9(overlay.anchor).off(".TsMenu").on("input.TsMenu", (_event) => {
      }).on("keyup.TsMenu", (event2) => {
        event2._searchType = "filter";
        this.keyUp(overlay, event2);
      });
    }
    if (overlay.options.search) {
      query9(overlay.box).find("#menu-search").off(".TsMenu").on("keyup.TsMenu", (event2) => {
        event2._searchType = "search";
        this.keyUp(overlay, event2);
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
  openSubMenu(event2) {
    const anchor = query9(event2.originalEvent.target).get(0);
    const { overlay } = event2;
    const { items } = overlay.options;
    const mitem = items[event2.index];
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
    query9(event2.target).addClass("expanded");
    TsMenu.show({
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
      // any: cast-to-any for dynamic dispatch; TsTooltip overlay options merge from multiple user sources at runtime
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).hide((_evt) => {
      query9(event2.target).removeClass("expanded");
    });
    setTimeout(() => {
      query9("#w2overlay-" + overlay.name + "-submenu").on("mouseenter", (event3) => {
        event3.target._keepSubOpen = true;
      }).on("mouseleave", (event3) => {
        event3.target._keepSubOpen = false;
      });
    }, 10);
  }
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  closeSubMenu(event2) {
    const { overlay } = event2;
    if (event2.target._keepSubOpen !== true) {
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
    const view = query9(overlay.box).find(".tsg-overlay-body").get(0);
    const search2 = query9(overlay.box).find(".tsg-menu-search, .tsg-menu-top").get(0);
    query9(overlay.box).find(".tsg-menu-item.tsg-selected").removeClass("tsg-selected");
    const el = query9(overlay.box).find(`.tsg-menu-item[index="${overlay.selected}"]`).addClass("tsg-selected").get(0);
    if (el) {
      if (el.offsetTop + el.clientHeight > view.clientHeight + view.scrollTop) {
        el.scrollIntoView({
          behavior: instant ? "instant" : "smooth",
          block: instant ? "center" : "start",
          inline: instant ? "center" : "start"
        });
      }
      if (el.offsetTop < view.scrollTop + (search2 ? search2.clientHeight : 0)) {
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
    const anchor = options?.anchor ?? query9(overlay.box).find(`.tsg-menu-item[index="${overlay.selected}"]`).get(0);
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
    TsTooltip.hide(overlay.name + "-tooltip");
    query9(overlay.box).find(".tsg-no-items").hide();
    query9(overlay.box).find(".tsg-menu-item, .tsg-menu-divider").each((el) => {
      const cur = this.getCurrent(name, el.getAttribute("index"));
      if (cur.item?.hidden) {
        query9(el).hide();
      } else {
        const search2 = overlay.tmp?.["search"];
        if (overlay.options.markSearch) {
          TsUtils.marker(el, search2, { onlyFirst: overlay.options.match == "begins" });
        }
        query9(el).show();
      }
    });
    query9(overlay.box).find(".tsg-sub-menu").each((sub) => {
      const hasItems = query9(sub).find(".tsg-menu-item").get().some((el) => {
        return el.style.display != "none" ? true : false;
      });
      const parent = this.getCurrent(name, sub.dataset?.parent);
      if (parent.item.expanded) {
        if (!hasItems) {
          query9(sub).parent().hide();
        } else {
          query9(sub).parent().show();
        }
      }
    });
    if (overlay.tmp["searchCount"] == 0 || (overlay.options?.items?.length ?? 0) == 0) {
      if (query9(overlay.box).find(".tsg-no-items").length == 0) {
        query9(overlay.box).find(".tsg-menu:not(.tsg-sub-menu)").append(`
                    <div class="tsg-no-items">
                        ${TsUtils.lang(overlay.options.msgNoItems)}
                    </div>`);
      }
      query9(overlay.box).find(".tsg-no-items").show();
    }
  }
  /**
   * Loops through the items and markes item.hidden = true for those that need to be hidden, and item.hidden = false
   * for those that are visible. Return a promise (since items can be on the server) with the number of visible items.
   */
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applyFilter(name, items, search2, debounce2) {
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
    if (search2 == null) {
      if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
        search2 = overlay.anchor.value;
      } else {
        search2 = "";
      }
    }
    if (overlay.tmp["_new_search"] === false) {
      search2 = "";
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
      if (search2.substr(0, len) != remote.hasMore_search) {
        remote.hasMore = true;
      }
    }
    if (items == null && options.url && remote.hasMore && remote.search !== search2) {
      let proceed = true;
      let msg = TsUtils.lang("Loading...");
      if (search2.length < (options.minLength ?? 0) && remote.emptySet !== true) {
        msg = TsUtils.lang("${count} letters or more...", { count: String(options.minLength) });
        proceed = false;
        if (search2 === "") {
          msg = TsUtils.lang(options.msgSearch);
        }
        if ((options.items?.length ?? 0) > 0) {
          this.update(name, []);
          this.applyFilter(name, null, search2);
        }
      }
      query9(overlay.box).find(".tsg-no-items").html(msg);
      remote.search = search2;
      options.items = [];
      overlay.tmp["remote"] = remote;
      if (proceed) {
        this.request(overlay, search2, debounce2).then((remoteItems) => {
          overlay.tmp["_skip_filter"] = true;
          this.update(name, remoteItems);
          delete overlay.tmp["_skip_filter"];
          overlay.tmp["_new_search"] = true;
          this.applyFilter(name, remoteItems, search2).then((data) => {
            this.getActiveChain(overlay.name, options.items);
            overlay.tmp["searchCount"] = data.count;
            overlay.tmp["search"] = data.search;
            if (options.prefilter || search2 !== "") {
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
      edata = this.trigger("search", { search: search2, overlay, prom, resolve, reject });
      if (edata.isCancelled === true) {
        return prom;
      }
    }
    if (items == null) {
      items = overlay.options.items;
    }
    if (options.filter === false) {
      resolve({ count: -1, search: search2 });
      return prom;
    }
    items.forEach((item) => {
      if (options.match == "regex") {
        try {
          const re = new RegExp(search2, "i");
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
          const re = new RegExp(prefix + search2 + suffix, "i");
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
        this.applyFilter(name, item.items, search2).then((data) => {
          const subCount = data.count;
          if (subCount > 0) {
            count += subCount;
            if (item.hidden) item._noSearchInside = true;
            if (search2) item.expanded = true;
            item.hidden = false;
          }
        });
      }
      if (item.hidden !== true) count++;
    });
    resolve({ count, search: search2 });
    edata?.finish();
    return prom;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request(overlay, search2, debounce2) {
    const options = overlay.options;
    const remote = overlay.tmp["remote"];
    let resolve, reject;
    if (options.items.length === 0 && remote.cached !== 0 || remote.cached == options.cacheMax && search2.length > remote.search.length || search2.length >= remote.search.length && search2.substr(0, remote.search.length) !== remote.search || search2.length < remote.search.length) {
      if (remote.controller) {
        remote.controller.abort();
      }
      remote.loading = true;
      clearTimeout(remote.timeout);
      remote.timeout = setTimeout(() => {
        let url = options.url;
        const postData = { search: search2, max: options.cacheMax };
        Object.assign(postData, options.postData);
        const edata = this.trigger("request", {
          search: search2,
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
        }, { caller: this, overlay, search: search2 });
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
            remote.hasMore_search = search2;
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
          remote.search = search2;
          remote.cached = data.records.length == 0 ? -1 : data.records.length;
          remote.lastError = "";
          remote.emptySet = search2 === "" && data.records.length === 0 ? true : false;
          edata2.finish();
          resolve(TsUtils.normMenu(data.records, data));
        }).catch((error) => {
          const edata2 = this.trigger("error", { overlay, search: search2, error });
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
      }, debounce2 ? options.debounce ?? 350 : 0);
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
  menuDown(overlay, event2, index, parents) {
    const options = overlay.options;
    let items = options.items;
    const icon = query9(event2.delegate).find(".tsg-icon");
    const menu = query9(event2.target).closest(".tsg-menu:not(.tsg-sub-menu)");
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
          menu.find(`.tsg-menu-item[index="${(parent ? parent + "-" : "") + ind}"] .tsg-icon`).removeClass("tsg-icon-check").addClass("tsg-icon-empty");
          items2[ind].checked = false;
        }
        if (Array.isArray(other.items)) {
          uncheck(other.items, ind);
        }
      });
    };
    if ((options.type === "check" || options.type === "radio") && item.group !== false && !query9(event2.target).hasClass("menu-remove") && !query9(event2.target).hasClass("menu-help") && !query9(event2.target).closest(".tsg-menu-item").hasClass("has-sub-menu")) {
      item.checked = options.type == "radio" ? true : !item.checked;
      if (item.checked) {
        if (options.type === "radio") {
          query9(event2.target).closest(".tsg-menu").find(".tsg-icon").removeClass("tsg-icon-check").addClass("tsg-icon-empty");
        }
        if (options.type === "check" && item.group != null) {
          uncheck(options.items);
        }
        icon.removeClass("tsg-icon-empty").addClass("tsg-icon-check");
      } else if (options.type === "check") {
        icon.removeClass("tsg-icon-check").addClass("tsg-icon-empty");
      }
    }
    if (!query9(event2.target).hasClass("menu-remove") && !query9(event2.target).hasClass("menu-help")) {
      menu.find(".tsg-menu-item").removeClass("tsg-selected");
      if (!query9(event2.delegate).hasClass("has-sub-menu")) {
        query9(event2.delegate).addClass("tsg-selected");
      }
    }
  }
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuClick(overlay, event2, index, parents) {
    const options = overlay.options;
    let items = options.items;
    const $item = query9(event2.delegate).closest(".tsg-menu-item");
    let keepOpen = options.hideOn.includes("select") ? false : true;
    if (event2.shiftKey || event2.metaKey || event2.ctrlKey) {
      keepOpen = true;
    }
    if (typeof items == "function") {
      items = items({ overlay, index, parents, event: event2 });
    }
    const item = items[index];
    if (!item || item.disabled && !query9(event2.target).hasClass("menu-remove")) {
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
    if (query9(event2.target).hasClass("menu-remove")) {
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
      const name = $item.closest(".tsg-overlay").attr("name");
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
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keyUp(overlay, event2) {
    const options = overlay.options;
    const search2 = event2.target.value;
    let filter = true;
    let refreshIndex = false;
    switch (event2.keyCode) {
      case 46:
      // delete
      case 8: {
        if (search2 === "" && !overlay.displayed) filter = false;
        break;
      }
      case 13: {
        if (!overlay.displayed || !overlay.selected) return;
        const { index, parents } = this.getCurrent(overlay.name);
        event2.delegate = query9(overlay.box).find(".tsg-selected").get(0);
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
          event2.delegate = query9(overlay.box).find(`.tsg-menu-item[index="${index}"]`).get(0);
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
          event2.delegate = query9(overlay.box).find(".tsg-selected").get(0);
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
      this.applyFilter(overlay.name, null, search2, true).then((data) => {
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
      query9(overlay.box).find(".tsg-overlay-body").html(cal.html);
      this.initControls(overlay);
    };
    const checkJump = (event2, dblclick) => {
      query9(event2.target).parent().find(".tsg-jump-month, .tsg-jump-year").removeClass("tsg-selected");
      query9(event2.target).addClass("tsg-selected");
      const dt = /* @__PURE__ */ new Date();
      let { jumpMonth, jumpYear } = overlay.tmp;
      if (dblclick) {
        if (jumpYear == null) jumpYear = dt.getFullYear();
        if (jumpMonth == null) jumpMonth = dt.getMonth() + 1;
      }
      if (jumpMonth && jumpYear) {
        const cal = this.getMonthHTML(options, jumpMonth, jumpYear);
        Object.assign(overlay.tmp, cal);
        query9(overlay.box).find(".tsg-overlay-body").html(cal.html);
        overlay.tmp.jump = false;
        this.initControls(overlay);
      }
    };
    query9(overlay.box).find(".tsg-cal-title").off(".calendar").on("click.calendar", (event2) => {
      if (options.draggable && overlay.tmp?.moved) {
        event2.stopPropagation();
        return;
      }
      Object.assign(overlay.tmp, { jumpYear: null, jumpMonth: null });
      if (overlay.tmp.jump) {
        const { month, year } = overlay.tmp;
        const cal = this.getMonthHTML(options, month, year);
        query9(overlay.box).find(".tsg-overlay-body").html(cal.html);
        overlay.tmp.jump = false;
      } else {
        query9(overlay.box).find(".tsg-overlay-body .tsg-cal-days").replace(this.getYearHTML());
        const el = query9(overlay.box).find(`[name="${overlay.tmp.year}"]`).get(0);
        if (el) el.scrollIntoView(true);
        overlay.tmp.jump = true;
      }
      this.initControls(overlay);
      event2.stopPropagation();
    }).find(".tsg-cal-previous").off(".calendar").on("click.calendar", (event2) => {
      moveMonth(-1);
      event2.stopPropagation();
    }).parent().find(".tsg-cal-next").off(".calendar").on("click.calendar", (event2) => {
      moveMonth(1);
      event2.stopPropagation();
    });
    query9(overlay.box).find(".tsg-cal-now").off(".calendar").on("click.calendar", (_event) => {
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
    query9(overlay.box).off(".calendar").on("contextmenu.calendar", (event2) => {
      event2.preventDefault();
    }).on("click.calendar", { delegate: ".tsg-day.tsg-date" }, (event2) => {
      if (options.type == "datetime") {
        overlay.newDate = query9(event2.target).attr("date");
        query9(overlay.box).find(".tsg-overlay-body").html(this.getHourHTML(overlay.options).html);
        this.initControls(overlay);
      } else {
        overlay.newValue = query9(event2.target).attr("date");
        this.hide(overlay.name);
      }
    }).on("click.calendar", { delegate: ".tsg-jump-month" }, (event2) => {
      overlay.tmp.jumpMonth = parseInt(query9(event2.target).attr("name") ?? "0");
      checkJump(event2);
    }).on("dblclick.calendar", { delegate: ".tsg-jump-month" }, (event2) => {
      overlay.tmp.jumpMonth = parseInt(query9(event2.target).attr("name") ?? "0");
      checkJump(event2, true);
    }).on("click.calendar", { delegate: ".tsg-jump-year" }, (event2) => {
      overlay.tmp.jumpYear = parseInt(query9(event2.target).attr("name") ?? "0");
      checkJump(event2);
    }).on("dblclick.calendar", { delegate: ".tsg-jump-year" }, (event2) => {
      overlay.tmp.jumpYear = parseInt(query9(event2.target).attr("name") ?? "0");
      checkJump(event2, true);
    }).on("click.calendar", { delegate: ".tsg-time.hour" }, (event2) => {
      const hour = Number(query9(event2.target).attr("hour"));
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
        query9(overlay.box).find(".tsg-overlay-body").html(html);
        this.initControls(overlay);
      }
    }).on("click.calendar", { delegate: ".tsg-time.min" }, (event2) => {
      const hour = Math.floor((this.str2min(overlay.newValue) ?? 0) / 60);
      const time = hour * 60 + parseInt(query9(event2.target).attr("min"));
      overlay.newValue = this.min2str(time, options.format);
      this.hide(overlay.name);
    });
    TsUtils.bindEvents(query9(overlay.box).find(".tsg-eaction"), this);
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
          const st = typeof options.start === "string" ? options.start : query9(options.start).val();
          const en = typeof options.end === "string" ? options.end : query9(options.end).val();
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
var TsTooltip = new Tooltip();
var TsMenu = new MenuTooltip();
var TsColor = new ColorTooltip();
var TsDate = new DateTooltip();

// src/tstoolbar.ts
var query10 = query;
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
    this._refresh = ({ effected, resize: resize2, refreshTooltip }) => {
      const options2 = this.last.pendingRefresh;
      options2.ids ??= [];
      options2.ids.push(...effected);
      Object.assign(options2, { resize: resize2, refreshTooltip });
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
    if (typeof this.box == "string") this.box = query10(this.box).get(0);
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
  // any: array of heterogeneous runtime values; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  remove(...args) {
    let effected = 0;
    args.forEach((item) => {
      const it = this.get(item);
      if (!it || String(item).indexOf(":") != -1) return;
      effected++;
      query10(this.box).find("#tb_" + this.name + "_item_" + TsUtils.escapeId(it.id)).remove();
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
        if (sub != null) return sub;
      }
    }
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setCount(id, count, className, style) {
    const btn = query10(this.box).find(`#tb_${this.name}_item_${TsUtils.escapeId(id)} .tsg-tb-count > span`);
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  click(id, event2) {
    const tmp = String(id).split(":");
    const it = this.get(tmp[0]);
    let items = it && it.items ? TsUtils.normMenu.call(this, it.items, it) : [];
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
      items = it && it.items ? TsUtils.normMenu.call(this, it.items, it) : [];
      const btn = "#tb_" + this.name + "_item_" + TsUtils.escapeId(it.id);
      query10(this.box).find(btn).removeClass("down");
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
        query10(this.box).find(btn).addClass("checked");
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
            const el = query10(this.box).find("#tb_" + this.name + "_item_" + TsUtils.escapeId(it.id));
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
              TsColor.show(TsUtils.extend({
                color: it.color
              }, it.overlay, {
                anchor: el[0],
                name: this.name + "-drop",
                data: { item: it, btn }
                // any: cast-to-any for dynamic dispatch; TsToolbar item shape varies by `type` at runtime
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
          query10(this.box).find(btn).addClass("checked");
        } else {
          query10(this.box).find(btn).removeClass("checked");
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
      const scrollBox = query10(this.box).find(`.tsg-tb-line:nth-child(${line}) .tsg-scroll-wrapper`);
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
    if (typeof box == "string") box = query10(box).get(0);
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
    query10(this.box).attr("name", this.name).addClass("tsg-reset tsg-toolbar").html(html);
    if (query10(this.box).length > 0) {
      query10(this.box)[0].style.cssText += this["style"];
    }
    TsUtils.bindEvents(query10(this.box).find(".tsg-tb-line .tsg-eaction"), this);
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
    const btn = query10(this.box).find(selector);
    const html = this.getItemHTML(it);
    this.tooltipHide(id);
    if (it.type == "spacer") {
      query10(this.box).find(`.tsg-tb-line:nth-child(${it.line ?? 1})`).find(".tsg-tb-right").css("width", "auto");
    }
    if (btn.length === 0) {
      const next = parseInt(this.get(id, true)) + 1;
      let $next = query10(this.box).find(`#tb_${this.name}_item_${TsUtils.escapeId(this.items[next] ? this.items[next].id : "--")}`);
      if ($next.length == 0) {
        $next = query10(this.box).find(`.tsg-tb-line:nth-child(${it.line}`).find(".tsg-tb-right").before(html);
      } else {
        $next.after(html);
      }
      TsUtils.bindEvents(query10(this.box).find(`${selector}, ${selector} .tsg-eaction`), this);
    } else {
      query10(this.box).find(selector).replace(query.html(html));
      const newBtn = query10(this.box).find(selector);
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
    query10(this.box).find(".tsg-tb-line").each((el) => {
      const box = query10(el);
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
    if (query10(this.box).find(".tsg-scroll-wrapper").length > 0) {
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
      item.get = function get2(id) {
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
  // any: callback parameter — caller signature varies; TsToolbar item shape varies by `type` at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  change(id, value, dynamic) {
    const it = this.get(id);
    const input = query10(this.box).find("#tb_" + this.name + "_item_" + TsUtils.escapeId(id)).find("input.tsg-toolbar-input");
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
    const el = query10(this.box).find("#tb_" + this.name + "_item_" + TsUtils.escapeId(id)).get(0);
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
          query10(target).addClass("over");
        }
        this.tooltipShow(id);
        break;
      case "Leave":
        if (!["label", "input"].includes(btn.type)) {
          query10(target).removeClass("over down");
        }
        this.tooltipHide(id);
        break;
      case "Down":
        if (!["label", "input"].includes(btn.type)) {
          query10(target).addClass("down");
        }
        break;
      case "Up":
        if (!["label", "input"].includes(btn.type)) {
          query10(target).removeClass("down");
        }
        break;
    }
    edata.finish();
  }
};

// src/tssidebar.ts
var query11 = query;
var TsSidebar = class extends TsBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nodes;
  // any: sidebar node tree has dynamic shape
  // any: targeted-any per typing_policy; TsSidebar node tree shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selected;
  // any: targeted-any per typing_policy; TsSidebar node tree shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  img;
  // any: targeted-any per typing_policy; TsSidebar node tree shape is user-defined at runtime
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
  // any: callback parameter — caller signature varies; TsSidebar node tree shape is user-defined at runtime
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
  // any: callback parameter — caller signature varies; TsSidebar node tree shape is user-defined at runtime
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
  // any: array of heterogeneous runtime values; TsSidebar node tree shape is user-defined at runtime
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
  // any: callback parameter — caller signature varies; TsSidebar node tree shape is user-defined at runtime
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
          TsUtils.extend(parent.nodes[i], node, nodes != null ? { nodes: [] } : {});
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
  // any: callback parameter — caller signature varies; TsSidebar node tree shape is user-defined at runtime
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
    const btn = query11(this.box).find(`#node_${TsUtils.escapeId(id)} .tsg-node-badge`);
    if (btn.length > 0) {
      const $cnt = btn.removeClass(null).addClass(`tsg-node-badge ${options.className ?? "tsg-node-count"}`).text(count);
      $cnt.get(0).style.cssText = options.style || "";
      const item = this.get(id);
      item.count = count;
    } else if (!options.noRepeat) {
      this.set(id, { count });
      options.noRepeat = true;
      queueMicrotask(() => this.setCount(id, count, options));
    }
  }
  // any: callback parameter — caller signature varies; TsSidebar node tree shape is user-defined at runtime
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
        const cmp = TsUtils.naturalCompare(aText, bText);
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
  // any: array of heterogeneous runtime values; TsSidebar node tree shape is user-defined at runtime
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
  // any: array of heterogeneous runtime values; TsSidebar node tree shape is user-defined at runtime
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
  // any: array of heterogeneous runtime values; TsSidebar node tree shape is user-defined at runtime
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
  // any: array of heterogeneous runtime values; TsSidebar node tree shape is user-defined at runtime
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
    const $el = query11(this.box).find("#node_" + TsUtils.escapeId(id));
    $el.addClass("tsg-selected").find(".tsg-icon").addClass("tsg-icon-selected");
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
    query11(this.box).find("#node_" + TsUtils.escapeId(id)).removeClass("tsg-selected").find(".tsg-icon").removeClass("tsg-icon-selected");
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
    query11(this.box).find("#node_" + TsUtils.escapeId(id) + "_sub").hide();
    query11(this.box).find("#node_" + TsUtils.escapeId(id) + " .tsg-expanded").removeClass("tsg-expanded").addClass("tsg-collapsed");
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
    query11(this.box).find("#node_" + TsUtils.escapeId(id) + "_sub").show();
    query11(this.box).find("#node_" + TsUtils.escapeId(id) + " .tsg-collapsed").removeClass("tsg-collapsed").addClass("tsg-expanded");
    nd.expanded = true;
    edata.finish();
    this.refresh(id);
    return true;
  }
  // any: callback parameter — caller signature varies; TsSidebar node tree shape is user-defined at runtime
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
  // any: callback parameter — caller signature varies; TsSidebar node tree shape is user-defined at runtime
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
    const newNode = query11(this.box).find("#node_" + TsUtils.escapeId(id));
    newNode.addClass("tsg-selected").find(".tsg-icon").addClass("tsg-icon-selected");
    setTimeout(() => {
      const edata = this.trigger("click", { target: id, originalEvent: event2, node: nd, object: nd });
      if (edata.isCancelled === true) {
        newNode.removeClass("tsg-selected").find(".tsg-icon").removeClass("tsg-icon-selected");
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
          const info = TsUtils.parseRoute(route);
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
    const $el = query11(el).find(".tsg-node-data");
    TsMenu.show({
      // any: query().get(0) returns Node|Node[]; anchor is always HTMLElement in flat menu context
      anchor: $el.get(0),
      name: this.name + "_flat-menu",
      items,
      // class: 'tsg-dark',
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
    TsTooltip.hide(this.name + "_tooltip");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  focus(event2) {
    const edata = this.trigger("focus", { target: this.name, originalEvent: event2 });
    if (edata.isCancelled === true) return false;
    this.hasFocus = true;
    query11(this.box).find(".tsg-sidebar-body").addClass("tsg-focus");
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
    query11(this.box).find(".tsg-sidebar-body").removeClass("tsg-focus");
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
    const item = query11(this.box).find("#node_" + TsUtils.escapeId(id)).get(0);
    if (!item) {
      return false;
    }
    const div = query11(this.box).find(".tsg-sidebar-body").get(0);
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
      const item = query11(this.box).find("#node_" + TsUtils.escapeId(id)).get(0);
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
      const body = query11(this.box).find(".tsg-sidebar-body");
      if (!mv.ghost) {
        const node = query11(this.box).find(`#node_${TsUtils.escapeId(id)}`);
        mv.offsetY = event2.offsetY;
        mv.target = id;
        const nodeEl = node.get(0);
        mv.pos = { top: nodeEl.offsetTop - 1, left: nodeEl.offsetLeft };
        const clone2 = query11(node.find(".tsg-node-data").get(0).cloneNode(true));
        mv.node = node;
        mv.nodeSub = node.next();
        body.append('<div id="sidebar_' + this.name + '_ghost" class="tsg-node tsg-ghost"></div>');
        query11(this.box).find("#sidebar_" + this.name + "_ghost").append(clone2);
        mv.ghost = query11(this.box).find("#sidebar_" + this.name + "_ghost");
        mv.ghost.css({ display: "none" });
        mv.restore = () => {
          mv.resetReorder();
          this.refresh();
        };
        mv.resetReorder = () => {
          this.last.move = null;
          query11(this.box).find(`#sidebar_${this.name}_ghost`).remove();
          query11(document).off(`.tsg-${this.name}-reorder`);
        };
      }
      query11(document).on(`mousemove.tsg-${this.name}-reorder`, _mouseMove).on(`mouseup.tsg-${this.name}-reorder`, _mouseStop);
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
        mv.node.html("").removeAttr("id", "data-id").addClass("tsg-reorder-empty").css({ height: rect.height + "px" });
        if (mv.node.next().css("display") !== "none") {
          const rect2 = mv.node.next().get(0).getBoundingClientRect();
          mv.node.next().html('<div class="tsg-reorder-empty-sub"></div>').css({ height: rect2.height + "px" });
        }
        mv.ghost.css({ display: "block" });
        edata.finish();
      }
      mv.ghost.css({
        top: mv.pos.top + mv.divY + "px",
        left: 0
      });
      const over = query11(event3.target).closest(".tsg-node, .tsg-node-group");
      const id2 = over.attr("data-id");
      if (query11(event3.target).hasClass("tsg-sidebar-body") && event3.layerY > 5 && !mv.append) {
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
        const el = query11(self.box).find(`#node_${TsUtils.escapeId(id2)}`);
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
    const node = query11(this.box).find("#node_" + TsUtils.escapeId(id));
    const text = node.find(".tsg-node-text");
    const edata = this.trigger("edit", { target: id, el: node, textEl: text });
    if (edata.isCancelled === true) {
      return;
    }
    this.last.renaming = true;
    node.addClass("tsg-editing");
    text.addClass("tsg-focus").css("pointer-events", "all").attr("contenteditable", TsUtils.isFirefox ? "true" : "plaintext-only").on("blur.node-editing", (_event) => {
      setTimeout(_rename, 0);
    }).on("keydown.node-editing", (event2) => {
      const kbdEvent = event2;
      if (kbdEvent.keyCode == 13) _rename(kbdEvent);
      if (kbdEvent.keyCode == 27) _rename(kbdEvent, true);
    });
    text.get(0).focus();
    const original = text.text();
    TsUtils.setCursorPosition(text[0], 0, text.text().length);
    edata.finish();
    return text.get(0);
    function _rename(event2, cancel) {
      const renameTo = text.text();
      node.removeClass("tsg-editing");
      text.removeClass("tsg-focus").css("pointer-events", "none").removeAttr("contenteditable").off(".node-editing");
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
      TsMenu.hide(this.name + "_menu");
      const menuAttach = TsMenu.show({
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
    query11(this.box).attr("name", this.name).addClass("tsg-reset tsg-sidebar").html(`<div>
                <div class="tsg-sidebar-top"></div>
                <input id="sidebar_${this.name}_focus" ${this.tabIndex ? 'tabindex="' + this.tabIndex + '"' : ""}
                    style="position: absolute; top: 0; right: 1px; width: 1px; z-index: -1; opacity: 0"
                    ${TsUtils.isMobile ? "readonly" : ""}/>
                <div class="tsg-sidebar-body"></div>
                <div class="tsg-sidebar-bottom"></div>
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
      const w2obj = TsUi[obj.name];
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
    const flatHTML = `<div class="tsg-flat tsg-flat-${this.flat ? "right" : "left"}" ${this.flatButton == false ? 'style="display: none"' : ""}></div>`;
    if (this["topHTML"] !== "" || flatHTML !== "") {
      query11(this.box).find(".tsg-sidebar-top").html(this["topHTML"] + flatHTML);
      query11(this.box).find(".tsg-sidebar-body").css("top", query11(this.box).find(".tsg-sidebar-top").get(0)?.clientHeight + "px");
      query11(this.box).find(".tsg-flat").off("click").on("click", (_event) => {
        this.goFlat();
      });
    }
    if (this["bottomHTML"] !== "") {
      query11(this.box).find(".tsg-sidebar-bottom").html(this["bottomHTML"]);
      query11(this.box).find(".tsg-sidebar-body").css("bottom", query11(this.box).find(".tsg-sidebar-bottom").get(0)?.clientHeight + "px");
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
      const $el = query11(this.box).find("#node_" + TsUtils.escapeId(nd.id));
      if (nd.group) {
        if (options.text) {
          nd.text = options.text;
          $el.find(".tsg-group-text").replace(typeof nd.text == "function" ? nd.text.call(this, nd) : '<span class="tsg-group-text">' + nd.text + "</span>");
          delete options.text;
        }
        if (options.class) {
          nd.class = options.class;
          level = $el.data("level");
          $el.get(0).className = "tsg-node-group tsg-level-" + level + (nd.class ? " " + nd.class : "");
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
          const $icon = $el.find(".tsg-node-image > span");
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
          $el.find(".tsg-node-badge").html(txt).attr("style", `${style}; ${last?.style ?? ""}`);
          if ($el.find(".tsg-node-badge").length > 0) delete options.count;
        }
        if (options.class && $el.length > 0) {
          nd.class = options.class;
          level = $el.data("level");
          $el[0].className = "tsg-node tsg-level-" + level + (nd.selected ? " tsg-selected" : "") + (nd.disabled ? " tsg-disabled" : "") + (nd.class ? " " + nd.class : "");
          delete options.class;
        }
        if (options.text != null) {
          nd.text = options.text;
          $el.find(".tsg-node-text").html(typeof nd.text == "function" ? nd.text.call(this, nd) : nd.text);
          delete options.text;
        }
        if (options.style && $el.length > 0) {
          const $txt = $el.find(".tsg-node-text");
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
    const body = query11(this.box).find(":scope > div > .tsg-sidebar-body").get(0);
    const { scrollTop, scrollLeft } = body ?? {};
    const time = Date.now();
    const edata = this.trigger("refresh", {
      target: id != null ? id : this.name,
      nodeId: id != null ? id : null,
      fullRefresh: id != null ? false : true
    });
    if (edata.isCancelled === true) return;
    if (this.flatButton == true) {
      query11(this.box).find(".tsg-sidebar-top .tsg-flat").show().removeClass("tsg-flat-left tsg-flat-right").addClass(` tsg-flat-${this.flat ? "right" : "left"}`);
    } else {
      query11(this.box).find(".tsg-sidebar-top .tsg-flat").hide();
    }
    const boxEl2 = query11(this.box).get(0);
    query11(this.box).find(":scope > div").removeClass("tsg-sidebar-flat").addClass(this.flat ? "tsg-sidebar-flat" : "").css({
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
      nodeSubId = ".tsg-sidebar-body";
    } else {
      node = this.get(id);
      if (node == null) return;
      nodeSubId = "#node_" + TsUtils.escapeId(node.id) + "_sub";
    }
    const nodeId = "#node_" + TsUtils.escapeId(node.id);
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
    const scroll2 = {
      top: div?.scrollTop,
      left: div?.scrollLeft
    };
    const cnt = node == this ? query11(this.box).find(":scope > div > .tsg-sidebar-body") : query11(body).find(nodeSubId);
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
      div.scrollTop = scroll2.top ?? 0;
      div.scrollLeft = scroll2.left ?? 0;
    }
    if (!options.recursive) {
      const els = query11(this.box).find(`${nodeId}, ${nodeId} .tsg-eaction, ${nodeSubId} .tsg-eaction`);
      TsUtils.bindEvents(els, this);
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
        let text = TsUtils.lang(typeof nd.text == "function" ? nd.text.call(obj, nd, level) : nd.text);
        if (String(text).substr(0, 5) != "<span") {
          text = `<span class="tsg-group-text">${text}</span>`;
        }
        html = `
                    <div id="node_${nd.id}" data-id="${nd.id}" data-level="${level}" style="${nd.hidden ? "display: none" : ""}"
                        class="tsg-node-group tsg-level-${level} ${nd.class ? nd.class : ""} tsg-eaction"
                        data-click="toggle|${nd.id}"
                        data-contextmenu="contextMenu|${nd.id}|event"
                        data-mouseenter="showPlus|this|inherit"
                        data-mouseleave="showPlus|this|transparent">
                        ${nd.groupShowHide && nd.collapsible ? `<span>${!nd.hidden && nd.expanded ? TsUtils.lang("Hide") : TsUtils.lang("Show")}</span>` : "<span></span>"} ${text}
                    </div>
                    <div class="tsg-node-sub" id="node_${nd.id}_sub" style="${nd.style}; ${!nd.hidden && nd.expanded ? "" : "display: none;"}">
                </div>`;
        if (obj.flat) {
          html = `
                        <div class="tsg-node-group" id="node_${nd.id}" data-id="${nd.id}"><span>&#160;</span></div>
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
                            <div class="tsg-node-image tsg-eaction" style="${obj.icon.style ?? ""}; pointer-events: all"
                                data-mouseEnter="mouseAction|Enter|this|${nd.id}|event|icon"
                                data-mouseLeave="mouseAction|Leave|this|${nd.id}|event|icon"
                                data-click="mouseAction|click|this|${nd.id}|event|icon">
                                    ${text2}
                            </div>
                        `;
          } else {
            image = `
                            <div class="tsg-node-image">
                                <span class="${typeof icon == "function" ? icon.call(obj, nd, level) : icon}"></span>
                            </div>`;
          }
        }
        let expand2 = "";
        let counts = "";
        if (obj["badge"] != null || nd.count != null) {
          let txt = nd.count ?? obj["badge"]?.text;
          const style = obj["badge"]?.style;
          const last = obj.last.badge[nd.id];
          if (typeof txt == "function") txt = txt.call(obj, nd, level);
          if (txt || txt === 0) {
            counts = `
                            <div class="tsg-node-badge tsg-eaction ${nd.count != null ? "tsg-node-count" : ""} ${last?.className ?? ""}"
                                style="${style ?? ""};${last?.style ?? ""}"
                                data-mouseEnter="mouseAction|Enter|this|${nd.id}|event|badge"
                                data-mouseLeave="mouseAction|Leave|this|${nd.id}|event|badge"
                                data-click="mouseAction|click|this|${nd.id}|event|badge"
                            >
                                ${txt}
                            </div>`;
          }
        }
        const classes = ["tsg-node", `tsg-level-${level}`, "tsg-eaction"];
        if (nd.selected) classes.push("tsg-selected");
        if (nd.disabled) classes.push("tsg-disabled");
        if (nd.class) classes.push(nd.class);
        if (nd.collapsible === true) {
          const toggleClasses = ["tsg-sb-toggle", "tsg-eaction", nd.expanded ? "tsg-expanded" : "tsg-collapsed"];
          if (obj["toggleAlign"] == "left") toggleClasses.push("tsg-left-toggle");
          expand2 = `<div class="${toggleClasses.join(" ")}" data-click="toggle|${nd.id}"><span></span></div>`;
          classes.push("tsg-has-children");
        }
        const text = TsUtils.lang(typeof nd.text == "function" ? nd.text.call(obj, nd, level) : nd.text);
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
                        ${obj["handle"].text ? `<div class="tsg-node-handle tsg-eaction" style="width: ${obj["handle"].width}px; ${obj["handle"].style}"
                                    data-mouseEnter="mouseAction|Enter|this|${nd.id}|event|handle"
                                    data-mouseLeave="mouseAction|Leave|this|${nd.id}|event|handle"
                                    data-click="mouseAction|click|this|${nd.id}|event|handle"
                                >
                                   ${typeof obj["handle"].text == "function" ? obj["handle"].text.call(obj, nd, level) ?? "" : obj["handle"].text}
                              </div>` : ""}
                      <div class="tsg-node-data" style="margin-left: ${level * obj["levelPadding"] + nodeOffset + obj["handle"].width}px">
                            ${expand2} ${image} ${counts}
                            <div class="tsg-node-text ${!image ? "no-icon" : ""}" style="${nd.style || ""}">${text}</div>
                       </div>
                    </div>
                    <div class="tsg-node-sub" id="node_${nd.id}_sub" style="${nd.style}; ${!nd.hidden && nd.expanded ? "" : "display: none;"}"></div>`;
        if (obj.flat) {
          html = `
                        <div id="node_${nd.id}" class="${classes.join(" ")} tsg-node-flat" data-id="${nd.id}" style="${nd.hidden ? "display: none;" : ""}"
                            data-click="click|${nd.id}|event"
                            data-dblclick="dblClick|${nd.id}|event"
                            data-contextmenu="contextMenu|${nd.id}|event"
                            data-mouseEnter="mouseAction|Enter|this|${nd.id}|event|tooltip"
                            data-mouseLeave="mouseAction|Leave|this|${nd.id}|event|tooltip"
                        >
                            <div class="tsg-node-data">${image}</div>
                        </div>
                        <div class="tsg-node-sub" id="node_${nd.id}_sub" style="${nd.style}; ${!nd.hidden && nd.expanded ? "" : "display: none;"}"></div>`;
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
      const text = TsUtils.lang(typeof node.text == "function" ? node.text.call(this, node) : node.text);
      let tooltip = text + (node.count != null ? ' - <span class="tsg-node-badge tsg-node-count">' + node.count + "</span>" : "");
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
    const $el = query11(el).find(".tsg-node-data");
    if (text !== "") {
      TsTooltip.show({
        // any: query().get(0) returns Node|Node[]; sidebar node-data element is always HTMLElement
        anchor: $el.get(0),
        name: this.name + "_tooltip",
        html: text,
        position: "right|left"
      });
    } else {
      TsTooltip.hide(this.name + "_tooltip");
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  otherTooltip(el, text) {
    if (text !== "") {
      TsTooltip.show({
        anchor: el,
        name: this.name + "_tooltip",
        html: text,
        position: "top|bottom"
      });
    } else {
      TsTooltip.hide(this.name + "_tooltip");
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
    if (query11(this.box).find(".tsg-sidebar-body").length > 0) {
      this.unmount();
    }
    delete TsUi[this.name];
    edata.finish();
  }
  unmount() {
    super.unmount();
    this.last.observeResize?.disconnect();
  }
  // any: callback parameter — caller signature varies; TsSidebar node tree shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lock(msg, showSpinner) {
    TsUtils.lock(this.box, msg, showSpinner);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unlock(speed) {
    TsUtils.unlock(this.box, speed);
  }
};

// src/tstabs.ts
var query12 = query;
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
    if (typeof this.box == "string") this.box = query12(this.box).get(0);
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
      query12(this.box).find(`#tabs_${this.name}_tab_${TsUtils.escapeId(tab.id)}`).remove();
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
  dragMove(event2) {
    if (!this.last.reordering) return;
    const self = this;
    const info = this.last.moving;
    const tab = this.tabs[info.index];
    const next = _find(info.index, 1);
    const prev = _find(info.index, -1);
    const $el = query12(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(tab.id));
    if (info.divX > 0 && next) {
      const $nextEl = query12(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(next.id));
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
      const $prevEl = query12(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(prev.id));
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
    const el = query12(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(id)).get(0);
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
      query12(this.box).addClass("tsg-tabs-up");
    } else {
      query12(this.box).removeClass("tsg-tabs-up");
    }
    const edata = this.trigger("refresh", { target: id != null ? id : this.name, object: this.get(id) });
    if (edata.isCancelled === true) return;
    if (id == null) {
      for (let i = 0; i < this.tabs.length; i++) {
        this.refresh(this.tabs[i].id);
      }
    } else {
      const selector = "#tabs_" + this.name + "_tab_" + TsUtils.escapeId(id);
      const $tab = query12(this.box).find(selector);
      const tabHTML = this.getTabHTML(id);
      if ($tab.length === 0) {
        if (tabHTML) query12(this.box).find("#tabs_" + this.name + "_right").before(tabHTML);
      } else {
        if (query12(this.box).find(".tab-animate-insert").length == 0) {
          if (tabHTML) $tab.replace(tabHTML);
        }
      }
      TsUtils.bindEvents(query12(this.box).find(`${selector}, ${selector} .tsg-eaction`), this);
    }
    query12(this.box).find("#tabs_" + this.name + "_right").html(this.right);
    edata.finish();
    return Date.now() - time;
  }
  // any: callback parameter — caller signature varies; TsTabs tab item shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render(box) {
    const time = Date.now();
    if (typeof box == "string") box = query12(box).get(0);
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
    query12(this.box).attr("name", this.name).addClass("tsg-reset tsg-tabs").html(html);
    if (query12(this.box).length > 0) {
      query12(this.box)[0].style.cssText += this.style;
    }
    TsUtils.bindEvents(query12(this.box).find(".tsg-eaction"), this);
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
    const $tab = query12(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(id));
    const tabIndex = this.get(id, true);
    const $ghost = query12($tab.get(0).cloneNode(true));
    let edata;
    $ghost.attr("id", "#tabs_" + this.name + "_tab_ghost");
    this.last.moving = {
      index: tabIndex,
      indexFrom: tabIndex,
      $tab,
      $ghost,
      divX: 0,
      left: $tab.get(0).getBoundingClientRect().left,
      parentX: query12(this.box).get(0).getBoundingClientRect().left,
      x: event2.pageX,
      opacity: $tab.css("opacity")
    };
    query12(document).off(".w2uiTabReorder").on("mousemove.w2uiTabReorder", function(event3) {
      const mouseEvent = event3;
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
        query12(self.box).find(".tsg-scroll-wrapper").append($ghost.get(0));
        query12(self.box).find(".tsg-tab-close").hide();
      }
      self.last.moving.divX = mouseEvent.pageX - self.last.moving.x;
      $ghost.css("left", self.last.moving.left - self.last.moving.parentX + self.last.moving.divX + "px");
      self.dragMove(mouseEvent);
    }).on("mouseup.w2uiTabReorder", function() {
      query12(document).off(".w2uiTabReorder");
      $ghost.css({
        "transition": "0.1s",
        "left": self.last.moving.$tab.get(0).getBoundingClientRect().left - self.last.moving.parentX
      });
      query12(self.box).find(".tsg-tab-close").show();
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
      const scrollBox = query12(this.box).find(".tsg-scroll-wrapper");
      const scrollBoxEl = scrollBox.get(0);
      const scrollLeft = scrollBoxEl.scrollLeft;
      const right = scrollBox.find(".tsg-tabs-right").get(0);
      const width1 = scrollBox.parent().get(0).getBoundingClientRect().width;
      const width2 = scrollLeft + right.offsetLeft + right.clientWidth;
      switch (direction) {
        case "left": {
          let scroll2 = scrollLeft - width1 + 50;
          if (scroll2 <= 0) scroll2 = 0;
          scrollBoxEl.scrollTo({ top: 0, left: scroll2, behavior: instant ? "auto" : "smooth" });
          break;
        }
        case "right": {
          let scroll2 = scrollLeft + width1 - 50;
          if (scroll2 >= width2 - width1) scroll2 = width2 - width1;
          scrollBoxEl.scrollTo({ top: 0, left: scroll2, behavior: instant ? "auto" : "smooth" });
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
      const tabEl = query12(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(id)).get(0);
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
      const box = query12(this.box);
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
    if (query12(this.box).find("#tabs_" + this.name + "_right").length > 0) {
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
  click(id, event2) {
    if (event2 && query12(event2.target).hasClass("tsg-tab-close")) {
      return;
    }
    const tab = this.get(id);
    if (tab == null || tab.disabled || this.last.reordering) return false;
    const edata = this.trigger("click", { target: id, tab, object: tab, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    query12(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(this.active)).removeClass("active");
    this.active = tab.id;
    query12(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(this.active)).addClass("active");
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
  // any: callback parameter — caller signature varies; TsTabs tab item shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  animateClose(id) {
    return new Promise((resolve, _reject) => {
      const $tab = query12(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(id));
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
      let $before = query12(this.box).find("#tabs_" + this.name + "_tab_" + TsUtils.escapeId(id));
      const tabHTML = this.getTabHTML(tab.id);
      const $tab = query.html(tabHTML);
      if ($before.length == 0) {
        $before = query12(this.box).find("#tabs_tabs_right");
        $before.before($tab);
        this.resize();
      } else {
        $tab.css({ opacity: 0 });
        query12(this.box).find("#tabs_tabs_right").before($tab.get(0));
        const $tmp = query12(this.box).find("#" + $tab.attr("id"));
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

// src/tslayout.ts
var query13 = query;
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
      if (TsUtils.isPlainObject(panel.toolbar) || Array.isArray(panel.toolbar)) initToolbar2(this, panel.type);
    });
    w2panels.forEach((tab) => {
      if (this.get(tab) != null) return;
      this.panels.push(TsUtils.extend({}, this.panel_template, { type: tab, hidden: tab !== "main", size: 50 }));
    });
    if (typeof this.box == "string") this.box = query13(this.box).get(0);
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
    function initToolbar2(object, panel, toolbar) {
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
  html(panel, data, transition2) {
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
      p.removed({ panel, html: p.html, html_new: data, transition: transition2 || "none" });
      p.removed = null;
    }
    if (panel == "css") {
      query13(this.box).find("#layout_" + this.name + "_panel_css").html("<style>" + data + "</style>");
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
    const edata = this.trigger("change", { target: panel, panel: p, html_new: data, transition: transition2 });
    if (edata.isCancelled === true) {
      promise.cancelled = true;
      return promise;
    }
    const pname = "#layout_" + this.name + "_panel_" + p.type;
    const current = query13(this.box).find(pname + '> [data-role="panel-content"]');
    let panelTop = 0;
    if (current.length > 0) {
      ;
      query13(this.box).find(pname).get(0).scrollTop = 0;
      panelTop = query13(current).css("top");
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
        if (transition2 != null && transition2 !== "") {
          query13(this.box).addClass("animating");
          const div1 = query13(this.box).find(pname + '> [data-role="panel-content"]');
          div1.after('<div class="tsg-panel-content new-panel" data-role="panel-content" style="' + div1[0].style.cssText + '"></div>');
          const div2 = query13(this.box).find(pname + '> [data-role="panel-content"].new-panel');
          div1.css("top", panelTop);
          div2.css("top", panelTop);
          if (typeof data == "object") {
            data.box = div2[0];
            data.render();
          } else {
            div2.hide().html(data);
          }
          let style1, style2;
          switch (transition2) {
            case "slide-left":
              style1 = "left: -" + TsUtils.getSize(query13(this.box), "width") + "px";
              style2 = "left: 0px";
              break;
            case "slide-right":
              style1 = "left: " + TsUtils.getSize(query13(this.box), "width") + "px";
              style2 = "left: 0px";
              break;
            case "slide-down":
              style1 = "top: -" + TsUtils.getSize(query13(this.box), "height") + "px";
              style2 = "top: " + panelTop + "px";
              break;
            case "slide-up":
              style1 = "top: " + TsUtils.getSize(query13(this.box), "height") + "px";
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
            query13(this.box).removeClass("animating");
            div1.remove();
            div2.removeClass("new-panel current");
            query13(this.box).find(pname + '> [data-role="panel-content"]').css({ "cssText": "" });
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
    const box = query13(this.box).find("#layout_" + this.name + "_panel_" + p.type);
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
    const box = query13(this.box).find("#layout_" + this.name + "_panel_" + p.type);
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
  load(panel, url, transition2) {
    return new Promise((resolve, reject) => {
      if ((panel == "css" || this.get(panel) != null) && url != null) {
        fetch(url).then((resp) => resp.text()).then((text) => {
          this.resize();
          resolve(this.html(panel, text, transition2));
        });
      } else {
        reject();
      }
    });
  }
  sizeTo(panel, size, instant) {
    const pan = this.get(panel);
    if (pan == null) return false;
    query13(this.box).find(":scope > div > .tsg-panel").css("transition", instant !== true ? ".2s" : "0s");
    setTimeout(() => {
      this.set(panel, { size });
    }, 1);
    setTimeout(() => {
      query13(this.box).find(":scope > div > .tsg-panel").css("transition", "0s");
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
      query13(this.box).find("#layout_" + this.name + "_panel_" + panel).css({ "opacity": "1" });
      edata.finish();
      this.resize();
    } else {
      query13(this.box).addClass("animating");
      query13(this.box).find("#layout_" + this.name + "_panel_" + panel).css({ "opacity": "0" });
      query13(this.box).find(":scope > div > .tsg-panel").css("transition", ".2s");
      setTimeout(() => {
        this.resize();
      }, 1);
      setTimeout(() => {
        query13(this.box).find("#layout_" + this.name + "_panel_" + panel).css({ "opacity": "1" });
      }, 250);
      setTimeout(() => {
        query13(this.box).find(":scope > div > .tsg-panel").css("transition", "0s");
        query13(this.box).removeClass("animating");
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
      query13(this.box).find("#layout_" + this.name + "_panel_" + panel).css({ "opacity": "0" });
      edata.finish();
      this.resize();
    } else {
      query13(this.box).addClass("animating");
      query13(this.box).find(":scope > div > .tsg-panel").css("transition", ".2s");
      query13(this.box).find("#layout_" + this.name + "_panel_" + panel).css({ "opacity": "0" });
      setTimeout(() => {
        this.resize();
      }, 1);
      setTimeout(() => {
        query13(this.box).find(":scope > div > .tsg-panel").css("transition", "0s");
        query13(this.box).removeClass("animating");
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
    const el = query13(this.box).find("#layout_" + this.name + "_panel_" + panel + '> [data-role="panel-content"]');
    if (el.length != 1) return null;
    return el[0];
  }
  hideToolbar(panel) {
    const pan = this.get(panel);
    if (!pan) return;
    pan.show.toolbar = false;
    query13(this.box).find(`#layout_${this.name}_panel_${panel} > [data-role="panel-toolbar"]`).hide();
    this.resize();
  }
  showToolbar(panel) {
    const pan = this.get(panel);
    if (!pan) return;
    pan.show.toolbar = true;
    query13(this.box).find(`#layout_${this.name}_panel_${panel} > [data-role="panel-toolbar"]`).show();
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
    const tmp = query13(this.box).find(panel + '> [data-role="panel-toolbar"]');
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
    query13(this.box).find("#layout_" + this.name + "_panel_" + panel + '> [data-role="panel-tabs"]').hide();
    this.resize();
  }
  showTabs(panel) {
    const pan = this.get(panel);
    if (!pan) return;
    pan.show.tabs = true;
    query13(this.box).find("#layout_" + this.name + "_panel_" + panel + '> [data-role="panel-tabs"]').show();
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
    const tmp = query13(this.box).find(panel + '> [data-role="panel-tabs"]');
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
    if (typeof box == "string") box = query13(box).get(0);
    const edata = this.trigger("render", { target: this.name, box: box ?? this.box });
    if (edata.isCancelled === true) return;
    if (box != null) {
      this.unmount();
      this.box = box;
    }
    if (!this.box) return false;
    query13(this.box).attr("name", this.name).addClass("tsg-layout").html("<div></div>");
    if (query13(this.box).length > 0) {
      ;
      query13(this.box)[0].style.cssText += this.style;
    }
    for (let p1 = 0; p1 < w2panels.length; p1++) {
      const html = '<div id="layout_' + this.name + "_panel_" + w2panels[p1] + '" class="tsg-panel">    <div class="tsg-panel-title"></div>    <div class="tsg-panel-tabs" data-role="panel-tabs"></div>    <div class="tsg-panel-toolbar" data-role="panel-toolbar"></div>    <div class="tsg-panel-content" data-role="panel-content"></div></div><div id="layout_' + this.name + "_resizer_" + w2panels[p1] + '" class="tsg-resizer"></div>';
      query13(this.box).find(":scope > div").append(html);
    }
    query13(this.box).find(":scope > div").append('<div id="layout_' + this.name + '_panel_css" style="position: absolute; top: 10000px;"></div>');
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
      query13(document).off("mousemove", self.last["events"].mouseMove).on("mousemove", self.last["events"].mouseMove);
      query13(document).off("mouseup", self.last["events"].mouseUp).on("mouseup", self.last["events"].mouseUp);
      self.last["resize"] = {
        type,
        x: evnt.screenX,
        y: evnt.screenY,
        diff_x: 0,
        diff_y: 0,
        value: 0
      };
      w2panels.forEach((panel) => {
        const $tmp = query13(self.el(panel)).find(".tsg-lock");
        if ($tmp.length > 0) {
          $tmp.data("locked", "yes");
        } else {
          self.lock(panel, { opacity: 0 });
        }
      });
      const el = query13(self.box).find("#layout_" + self.name + "_resizer_" + type).get(0);
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
      query13(document).off("mousemove", self.last["events"].mouseMove);
      query13(document).off("mouseup", self.last["events"].mouseUp);
      if (self.last["resize"] == null) return;
      w2panels.forEach((panel) => {
        const $tmp = query13(self.el(panel)).find(".tsg-lock");
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
        const width = TsUtils.getSize(query13(self.box), "width");
        const height = TsUtils.getSize(query13(self.box), "height");
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
      query13(self.box).find("#layout_" + self.name + "_resizer_" + self.last["resize"].type).removeClass(null).addClass("active");
      query13(self.box).find("#layout_" + self.name + "_resizer_" + self.last["resize"].type).removeClass("active");
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
      const p = query13(self.box).find("#layout_" + self.name + "_resizer_" + tmp.type);
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
    if (query13(this.box).find("#layout_" + this.name + "_panel_main").length > 0) {
      this.unmount();
    }
    delete _TsUiRegistry()[this.name];
    edata.finish();
    if (this.last["events"] && this.last["events"].resize) {
      query13(window).off("resize", this.last["events"].resize);
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
      query13(self.box).find(pname).css({ display: p.hidden ? "none" : "block" });
      if (p.resizable) {
        query13(self.box).find(rname).show();
      } else {
        query13(self.box).find(rname).hide();
      }
      if (typeof p.html == "object" && typeof p.html.render === "function") {
        ;
        p.html.box = query13(self.box).find(pname + '> [data-role="panel-content"]')[0];
        setTimeout(() => {
          if (query13(self.box).find(pname + '> [data-role="panel-content"]').length > 0) {
            const $content = query13(self.box).find(pname + '> [data-role="panel-content"]').removeClass(null).removeAttr("name").addClass("tsg-panel-content");
            $content.css("overflow", p.overflow)[0].style.cssText += ";" + p.style;
          }
          if (p.html && typeof p.html.render == "function") {
            ;
            p.html.render();
          }
        }, 1);
      } else {
        if (query13(self.box).find(pname + '> [data-role="panel-content"]').length > 0) {
          const $content = query13(self.box).find(pname + '> [data-role="panel-content"]').removeClass(null).removeAttr("name").addClass("tsg-panel-content");
          $content.html(p.html).css("overflow", p.overflow)[0].style.cssText += ";" + p.style;
        }
      }
      let tmp = query13(self.box).find(pname + '> [data-role="panel-tabs"]');
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
      tmp = query13(self.box).find(pname + '> [data-role="panel-toolbar"]');
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
      tmp = query13(self.box).find(pname + "> .tsg-panel-title");
      if (p.title) {
        ;
        tmp.html(p.title).show();
      } else {
        ;
        tmp.html("").hide();
      }
    } else {
      if (query13(self.box).find("#layout_" + self.name + "_panel_main").length === 0) {
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
    const width = TsUtils.getSize(query13(this.box), "width");
    const height = TsUtils.getSize(query13(this.box), "height");
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
      query13(this.box).find("#layout_" + this.name + "_panel_top").css({
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
        query13(this.box).find("#layout_" + this.name + "_resizer_top").css({
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
          _TsUiRegistry()[self.name].last.events.resizeStart("top", event2);
          edata2.finish();
          return false;
        });
      }
    } else {
      query13(this.box).find("#layout_" + this.name + "_panel_top").hide();
      query13(this.box).find("#layout_" + this.name + "_resizer_top").hide();
    }
    if (pleft != null && pleft.hidden !== true) {
      l = 0;
      t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0);
      w = pleft.sizeCalculated;
      h = height - (stop ? ptop.sizeCalculated + this.padding : 0) - (sbottom ? pbottom.sizeCalculated + this.padding : 0);
      query13(this.box).find("#layout_" + this.name + "_panel_left").css({
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
        query13(this.box).find("#layout_" + this.name + "_resizer_left").css({
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
          _TsUiRegistry()[self.name].last.events.resizeStart("left", event2);
          edata2.finish();
          return false;
        });
      }
    } else {
      query13(this.box).find("#layout_" + this.name + "_panel_left").hide();
      query13(this.box).find("#layout_" + this.name + "_resizer_left").hide();
    }
    if (pright != null && pright.hidden !== true) {
      l = width - pright.sizeCalculated;
      t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0);
      w = pright.sizeCalculated;
      h = height - (stop ? ptop.sizeCalculated + this.padding : 0) - (sbottom ? pbottom.sizeCalculated + this.padding : 0);
      query13(this.box).find("#layout_" + this.name + "_panel_right").css({
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
        query13(this.box).find("#layout_" + this.name + "_resizer_right").css({
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
          _TsUiRegistry()[self.name].last.events.resizeStart("right", event2);
          edata2.finish();
          return false;
        });
      }
    } else {
      query13(this.box).find("#layout_" + this.name + "_panel_right").hide();
      query13(this.box).find("#layout_" + this.name + "_resizer_right").hide();
    }
    if (pbottom != null && pbottom.hidden !== true) {
      l = 0;
      t = height - pbottom.sizeCalculated;
      w = width;
      h = pbottom.sizeCalculated;
      query13(this.box).find("#layout_" + this.name + "_panel_bottom").css({
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
        query13(this.box).find("#layout_" + this.name + "_resizer_bottom").css({
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
          _TsUiRegistry()[self.name].last.events.resizeStart("bottom", event2);
          edata2.finish();
          return false;
        });
      }
    } else {
      query13(this.box).find("#layout_" + this.name + "_panel_bottom").hide();
      query13(this.box).find("#layout_" + this.name + "_resizer_bottom").hide();
    }
    l = 0 + (sleft ? pleft.sizeCalculated + this.padding : 0);
    t = 0 + (stop ? ptop.sizeCalculated + this.padding : 0);
    w = width - (sleft ? pleft.sizeCalculated + this.padding : 0) - (sright ? pright.sizeCalculated + this.padding : 0);
    h = height - (stop ? ptop.sizeCalculated + this.padding : 0) - (sbottom ? pbottom.sizeCalculated + this.padding : 0) - (sprev ? pprev.sizeCalculated + this.padding : 0);
    query13(this.box).find("#layout_" + this.name + "_panel_main").css({
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
      query13(this.box).find("#layout_" + this.name + "_panel_preview").css({
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
        query13(this.box).find("#layout_" + this.name + "_resizer_preview").css({
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
          _TsUiRegistry()[self.name].last.events.resizeStart("preview", event2);
          edata2.finish();
          return false;
        });
      }
    } else {
      query13(this.box).find("#layout_" + this.name + "_panel_preview").hide();
      query13(this.box).find("#layout_" + this.name + "_resizer_preview").hide();
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
          const el = query13(this.box).find(tmp2 + ".tsg-panel-title").css({ top: topHeight + "px", display: "block" });
          topHeight += TsUtils.getSize(el, "height");
        }
        if (pan.show.tabs) {
          const el = query13(this.box).find(tmp2 + '[data-role="panel-tabs"]').css({ top: topHeight + "px", display: "block" });
          topHeight += TsUtils.getSize(el, "height");
        }
        if (pan.show.toolbar) {
          const el = query13(this.box).find(tmp2 + '[data-role="panel-toolbar"]').css({ top: topHeight + "px", display: "block" });
          topHeight += TsUtils.getSize(el, "height");
        }
      }
      query13(this.box).find(tmp2 + '[data-role="panel-content"]').css({
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

// src/grid-columns.ts
function addColumn(grid, before, columns) {
  let added = 0;
  if (columns === void 0) {
    columns = before;
    before = grid.columns.length;
  } else {
    if (typeof before == "string") before = grid.getColumn(before, true);
    if (before == null) before = grid.columns.length;
  }
  if (!Array.isArray(columns)) columns = [columns];
  for (let i = 0; i < columns.length; i++) {
    const col = TsUtils.extend({}, grid.colTemplate, columns[i]);
    grid.columns.splice(before, 0, col);
    if (columns[i].searchable) {
      let stype = columns[i].searchable;
      let attr = "";
      if (columns[i].searchable === true) {
        stype = "text";
        attr = 'size="20"';
      }
      grid.addSearch({ field: columns[i].field, label: columns[i].text, type: stype, attr });
    }
    before++;
    added++;
  }
  grid.refresh();
  return added;
}
function removeColumn(grid, ...fields) {
  let removed = 0;
  for (let a = 0; a < fields.length; a++) {
    const field_a = fields[a];
    for (let r = grid.columns.length - 1; r >= 0; r--) {
      if (grid.columns[r].field == field_a) {
        if (grid.columns[r].searchable) grid.removeSearch(field_a);
        grid.columns.splice(r, 1);
        removed++;
      }
    }
  }
  grid.refresh();
  return removed;
}
function getColumn(grid, field, returnIndex) {
  if (field === void 0) {
    const ret = [];
    for (let i = 0; i < grid.columns.length; i++) ret.push(grid.columns[i].field);
    return ret;
  }
  for (let i = 0; i < grid.columns.length; i++) {
    if (grid.columns[i].field == field) {
      if (returnIndex === true) return i;
      else return grid.columns[i];
    }
  }
  return null;
}
function updateColumn(grid, fields, updates) {
  let effected = 0;
  fields = Array.isArray(fields) ? fields : [fields];
  fields.forEach((colName) => {
    grid.columns.forEach((col) => {
      if (col.field == colName) {
        const _updates = TsUtils.clone(updates);
        Object.keys(_updates).forEach((key) => {
          if (typeof _updates[key] == "function") {
            _updates[key] = _updates[key](col);
          }
          if (col[key] != _updates[key]) effected++;
        });
        TsUtils.extend(col, _updates);
      }
    });
  });
  if (effected > 0) {
    grid.refresh();
  }
  return effected;
}
function toggleColumn(grid, ...fields) {
  return grid.updateColumn(fields, { hidden(col) {
    return !col.hidden;
  } });
}
function showColumn(grid, ...fields) {
  return grid.updateColumn(fields, { hidden: false });
}
function hideColumn(grid, ...fields) {
  return grid.updateColumn(fields, { hidden: true });
}

// src/grid-state.ts
var query14 = query;
function status(grid, msg) {
  if (msg != null) {
    query14(grid.box).find(`#grid_${grid.name}_footer`).find(".tsg-footer-left").html(msg);
  } else {
    let msgLeft = "";
    const sel = grid.getSelection();
    if (sel.length > 0) {
      if (grid.show.statusSelection && sel.length > 1) {
        msgLeft = String(sel.length).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + TsUtils.settings.groupSymbol) + " " + TsUtils.lang("selected");
      }
      if (grid.show.statusRecordID && sel.length == 1) {
        let tmp = sel[0];
        if (typeof tmp == "object") tmp = tmp.recid + ", " + TsUtils.lang("Column") + ": " + tmp.column;
        msgLeft = TsUtils.lang("Record ID") + ": " + tmp + " ";
      }
    }
    query14(grid.box).find("#grid_" + grid.name + "_footer .tsg-footer-left").html(msgLeft);
  }
}
function lock2(grid, msg, showSpinner) {
  const args = [grid.box, msg, showSpinner];
  setTimeout(() => {
    query14(grid.box).find("#grid_" + grid.name + "_empty_msg").remove();
    TsUtils.lock(...args);
  }, 10);
}
function unlock2(grid, speed) {
  setTimeout(() => {
    if (query14(grid.box).find(".tsg-message").hasClass("tsg-closing")) return;
    TsUtils.unlock(grid.box, speed);
  }, 25);
}
function stateSave(grid, returnOnly) {
  const state = {
    // any: state blob is serialized JSON
    columns: [],
    show: TsUtils.clone(grid.show),
    last: {
      search: grid.last.search,
      multi: grid.last.multi,
      logic: grid.last.logic,
      label: grid.last.label,
      field: grid.last.field,
      scrollTop: grid.last.vscroll.scrollTop,
      scrollLeft: grid.last.vscroll.scrollLeft
    },
    sortData: [],
    searchData: []
  };
  let prop_val;
  for (let i = 0; i < grid.columns.length; i++) {
    const col = grid.columns[i];
    const col_save_obj = {};
    Object.keys(grid.stateColProps).forEach((prop, _idx) => {
      if (grid.stateColProps[prop]) {
        if (col[prop] !== void 0) {
          prop_val = col[prop];
        } else {
          prop_val = grid.colTemplate[prop] || null;
        }
        col_save_obj[prop] = prop_val;
      }
    });
    state.columns.push(col_save_obj);
  }
  for (let i = 0; i < grid.sortData.length; i++) state.sortData.push(TsUtils.clone(grid.sortData[i]));
  for (let i = 0; i < grid.searchData.length; i++) state.searchData.push(TsUtils.clone(grid.searchData[i]));
  const edata = grid.trigger("stateSave", { target: grid.name, state });
  if (edata.isCancelled === true) {
    return;
  }
  if (returnOnly !== true) {
    grid.cacheSave("state", state);
  }
  edata.finish();
  return state;
}
function stateRestore(grid, newState) {
  const url = grid.url?.get ?? grid.url;
  if (!newState) {
    newState = grid.cache("state");
  }
  const edata = grid.trigger("stateRestore", { target: grid.name, state: newState });
  if (edata.isCancelled === true) {
    return;
  }
  if (TsUtils.isPlainObject(newState)) {
    TsUtils.extend(grid.show, newState.show ?? {});
    TsUtils.extend(grid.last, newState.last ?? {});
    const sTop = grid.last.vscroll.scrollTop;
    const sLeft = grid.last.vscroll.scrollLeft;
    for (let c = 0; c < newState.columns?.length; c++) {
      const tmp = newState.columns[c];
      const col_index = grid.getColumn(tmp.field, true);
      if (col_index !== null) {
        TsUtils.extend(grid.columns[col_index], tmp);
        if (c !== col_index) grid.columns.splice(c, 0, grid.columns.splice(col_index, 1)[0]);
      }
    }
    grid.sortData.splice(0, grid.sortData.length);
    for (let c = 0; c < newState.sortData?.length; c++) {
      grid.sortData.push(newState.sortData[c]);
    }
    grid.searchData.splice(0, grid.searchData.length);
    for (let c = 0; c < newState.searchData?.length; c++) {
      grid.searchData.push(newState.searchData[c]);
    }
    setTimeout(() => {
      if (!url) {
        if (grid.sortData.length > 0) grid.localSort();
        if (grid.searchData.length > 0) grid.localSearch();
      }
      grid.last.vscroll.scrollTop = sTop;
      grid.last.vscroll.scrollLeft = sLeft;
      grid.refresh();
    }, 1);
    console.log(`INFO (TsUi): state restored for "${grid.name}"`);
  }
  edata.finish();
  return true;
}
function stateReset(grid) {
  grid.stateRestore(grid.last.state);
  grid.cacheSave("state", null);
}
function parseField(grid, obj, field) {
  let val;
  if (grid.nestedFields) {
    val = TsUtils.getNested(obj, field);
  } else {
    val = obj?.[field];
  }
  return val != null ? val : "";
}
function prepareData(grid) {
  const obj = grid;
  for (let r = 0; r < grid.records.length; r++) {
    const rec = grid.records[r];
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
          if (TsUtils.isInt(dt)) dt = parseInt(dt);
          rec[column.field + "_"] = new Date(dt);
        }
      }
      if (["time"].indexOf(column.render) != -1) {
        if (TsUtils.isTime(rec[column.field])) {
          const tmp = TsUtils.isTime(rec[column.field], true);
          const dt = /* @__PURE__ */ new Date();
          dt.setHours(tmp.hours, tmp.minutes, tmp.seconds ? tmp.seconds : 0, 0);
          if (!rec[column.field + "_"]) rec[column.field + "_"] = dt;
        } else {
          let tmp = rec[column.field];
          if (TsUtils.isInt(tmp)) tmp = parseInt(tmp);
          tmp = tmp != null ? new Date(tmp) : /* @__PURE__ */ new Date();
          const dt = /* @__PURE__ */ new Date();
          dt.setHours(tmp.getHours(), tmp.getMinutes(), tmp.getSeconds(), 0);
          if (!rec[column.field + "_"]) rec[column.field + "_"] = dt;
        }
      }
    }
    if (rec.TsUi?.children && rec.TsUi?.expanded !== true) {
      for (let r = 0; r < rec.TsUi.children.length; r++) {
        const subRec = rec.TsUi.children[r];
        prepareRecord(subRec);
      }
    }
  }
}
function nextCell(grid, index, col_ind, editable) {
  const check = col_ind + 1;
  if (check >= grid.columns.length) {
    const nextIdx = grid.nextRow(index);
    return nextIdx == null ? null : grid.nextCell(nextIdx, -1, editable);
  }
  const tmp = grid.records[index]?.TsUi;
  const col = grid.columns[check];
  const span = tmp && tmp["colspan"] && col != null && !isNaN(tmp["colspan"][col.field]) ? parseInt(tmp["colspan"][col.field]) : 1;
  if (col == null) return null;
  if (col && col.hidden || span === 0) return grid.nextCell(index, check, editable);
  if (editable) {
    const edit = grid.getCellEditable(index, check);
    if (edit == null || ["checkbox", "check"].indexOf(edit.type) != -1) {
      return grid.nextCell(index, check, editable);
    }
  }
  return { index, colIndex: check };
}
function prevCell(grid, index, col_ind, editable) {
  const check = col_ind - 1;
  if (check < 0) {
    const prevIdx = grid.prevRow(index);
    return prevIdx == null ? null : grid.prevCell(prevIdx, grid.columns.length, editable);
  }
  if (check < 0) return null;
  const tmp = grid.records[index]?.TsUi;
  const col = grid.columns[check];
  const span = tmp && tmp["colspan"] && col != null && !isNaN(tmp["colspan"][col.field]) ? parseInt(tmp["colspan"][col.field]) : 1;
  if (col == null) return null;
  if (col && col.hidden || span === 0) return grid.prevCell(index, check, editable);
  if (editable) {
    const edit = grid.getCellEditable(index, check);
    if (edit == null || ["checkbox", "check"].indexOf(edit.type) != -1) {
      return grid.prevCell(index, check, editable);
    }
  }
  return { index, colIndex: check };
}
function nextRow(grid, ind, col_ind, numRows) {
  const sids = grid.last.searchIds;
  let ret = null;
  if (numRows == null) numRows = 1;
  if (numRows == -1) {
    return grid.records.length - 1;
  }
  if (ind + numRows < grid.records.length && sids.length === 0 || sids.length > 0 && ind < (sids[sids.length - numRows] ?? 0)) {
    ind += numRows;
    if (sids.length > 0) while (true) {
      if (sids.includes(ind) || ind > grid.records.length) break;
      ind += numRows;
    }
    const tmp = grid.records[ind]?.TsUi;
    const col = col_ind != null ? grid.columns[col_ind] : void 0;
    const span = tmp && tmp["colspan"] && col != null && !isNaN(tmp["colspan"][col.field]) ? parseInt(tmp["colspan"][col.field]) : 1;
    if (span === 0 || tmp?.selectable === false) {
      ret = grid.nextRow(ind, col_ind, numRows);
    } else {
      ret = ind;
    }
  }
  return ret;
}
function prevRow(grid, ind, col_ind, numRows) {
  const sids = grid.last.searchIds;
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
    const tmp = grid.records[ind]?.TsUi;
    const col = col_ind != null ? grid.columns[col_ind] : void 0;
    const span = tmp && tmp["colspan"] && col != null && !isNaN(tmp["colspan"][col.field]) ? parseInt(tmp["colspan"][col.field]) : 1;
    if (span === 0 || tmp?.selectable === false) {
      ret = grid.prevRow(ind, col_ind, numRows);
      if (ret == null) ret = ind;
    } else {
      ret = ind;
    }
  }
  return ret;
}
function selectionSave(grid) {
  grid.last.saved_sel = grid.getSelection();
  return grid.last.saved_sel;
}
function selectionRestore(grid, noRefresh) {
  const time = Date.now();
  grid.last.selection = { indexes: [], columns: {} };
  const sel = grid.last.selection;
  const lst = grid.last.saved_sel;
  if (lst) for (let i = 0; i < lst.length; i++) {
    if (TsUtils.isPlainObject(lst[i])) {
      const tmp = grid.get(lst[i].recid, true);
      if (tmp != null) {
        if (sel.indexes.indexOf(tmp) == -1) sel.indexes.push(tmp);
        if (!sel.columns[tmp]) sel.columns[tmp] = [];
        sel.columns[tmp].push(lst[i].column);
      }
    } else {
      const tmp = grid.get(lst[i], true);
      if (tmp != null) sel.indexes.push(tmp);
    }
  }
  delete grid.last.saved_sel;
  if (noRefresh !== true) grid.refresh();
  return Date.now() - time;
}
function message(grid, options) {
  return TsUtils.message({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    owner: grid,
    // any: TsGrid.lock signature differs from owner.lock type
    box: grid.box,
    after: ".tsg-grid-header"
  }, options);
}
function confirm(grid, options) {
  return TsUtils.confirm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    owner: grid,
    // any: TsGrid.lock signature differs from owner.lock type
    box: grid.box,
    after: ".tsg-grid-header"
  }, options);
}

// src/grid-data.ts
var query15 = query;
function add(grid, record, first) {
  if (!Array.isArray(record)) record = [record];
  let added = 0;
  for (let i = 0; i < record.length; i++) {
    const rec = record[i];
    if (grid.recid != null && rec[grid.recid] != null) {
      rec.recid = rec[grid.recid];
    }
    if (rec.recid == null) {
      console.log("ERROR: Cannot add record without recid. (obj: " + grid.name + ")");
      continue;
    }
    if (rec.TsUi?.summary === true) {
      if (first) grid.summary.unshift(rec);
      else grid.summary.push(rec);
    } else {
      if (first) grid.records.unshift(rec);
      else grid.records.push(rec);
    }
    added++;
  }
  grid.processGroupBy();
  const url = grid.url?.get ?? grid.url;
  if (!url) {
    grid.total = grid.records.length;
    grid.localSort(false, true);
    grid.localSearch();
    const indStart = grid.records.length - record.length;
    const indEnd = indStart + record.length;
    if ((grid.last.vscroll.recIndStart ?? 0) <= indEnd && (grid.last.vscroll.recIndEnd ?? 0) >= indStart) {
      grid.refresh();
    } else {
      query15(grid.box).find("#grid_" + grid.name + "_footer .tsg-footer-right .tsg-total").html(TsUtils.formatNumber(grid.total));
    }
  } else {
    grid.refresh();
  }
  return added;
}
function find(grid, obj, returnIndex, displayedOnly) {
  if (obj == null) obj = {};
  const recs = [];
  let hasDots = false;
  for (const o in obj) if (String(o).indexOf(".") != -1) hasDots = true;
  const start = displayedOnly ? grid.last.vscroll.recIndStart ?? 0 : 0;
  let end = displayedOnly ? (grid.last.vscroll.recIndEnd ?? grid.records.length) + 1 : grid.records.length;
  if (end > grid.records.length) end = grid.records.length;
  for (let i = start; i < end; i++) {
    const rec_i = grid.records[i];
    let match = true;
    for (const o in obj) {
      let val = rec_i[o];
      if (hasDots && String(o).indexOf(".") != -1) val = grid.parseField(rec_i, o);
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
function set(grid, recid, record, noRefresh) {
  if (typeof recid == "object" && recid !== null) {
    noRefresh = record;
    record = recid;
    recid = null;
  }
  if (recid == null) {
    for (let i = 0; i < grid.records.length; i++) {
      TsUtils.extend(grid.records[i], record);
    }
    if (noRefresh !== true) grid.refresh();
  } else {
    const ind = grid.get(recid, true);
    if (ind == null) return false;
    const isSummary = grid.records[ind]?.recid == recid ? false : true;
    if (isSummary) {
      TsUtils.extend(grid.summary[ind], record);
    } else {
      TsUtils.extend(grid.records[ind], record);
    }
    if (noRefresh !== true) grid.refreshRow(recid, ind);
  }
  grid.processGroupBy();
  return true;
}
function replace(grid, recid, record, noRefresh) {
  const ind = grid.get(recid, true);
  if (ind == null) return false;
  const isSummary = grid.records[ind]?.recid == recid ? false : true;
  if (isSummary) {
    grid.summary[ind] = record;
  } else {
    grid.records[ind] = record;
  }
  if (noRefresh !== true) grid.refreshRow(recid, ind);
  grid.processGroupBy();
  return true;
}
function get(grid, recid, returnIndex) {
  if (Array.isArray(recid)) {
    const recs = [];
    for (let i = 0; i < recid.length; i++) {
      const v = grid.get(recid[i], returnIndex);
      if (v !== null)
        recs.push(v);
    }
    return recs;
  } else {
    let idCache = grid.last.idCache;
    if (!idCache) {
      grid.last.idCache = idCache = {};
    }
    let i = idCache[recid];
    if (typeof i === "number") {
      if (i >= 0 && i < grid.records.length && grid.records[i].recid == recid) {
        if (returnIndex === true) return i;
        else return grid.records[i];
      }
      i = ~i;
      if (i >= 0 && i < grid.summary.length && grid.summary[i].recid == recid) {
        if (returnIndex === true) return i;
        else return grid.summary[i];
      }
      grid.last.idCache = idCache = {};
    }
    for (let i2 = 0; i2 < grid.records.length; i2++) {
      if (grid.records[i2].recid == recid) {
        idCache[recid] = i2;
        if (returnIndex === true) return i2;
        else return grid.records[i2];
      }
    }
    for (let i2 = 0; i2 < grid.summary.length; i2++) {
      if (grid.summary[i2].recid == recid) {
        idCache[recid] = ~i2;
        if (returnIndex === true) return i2;
        else return grid.summary[i2];
      }
    }
    return null;
  }
}
function remove(grid, ...recids) {
  let removed = 0;
  for (let a = 0; a < recids.length; a++) {
    for (let r = grid.records.length - 1; r >= 0; r--) {
      if (grid.records[r].recid == recids[a]) {
        grid.records.splice(r, 1);
        removed++;
      }
    }
    for (let r = grid.summary.length - 1; r >= 0; r--) {
      if (grid.summary[r].recid == recids[a]) {
        grid.summary.splice(r, 1);
        removed++;
      }
    }
  }
  const url = grid.url?.get ?? grid.url;
  if (!url) {
    grid.localSort(false, true);
    grid.localSearch();
    grid.total = grid.records.length;
  }
  grid.refresh();
  return removed;
}
function processGroupBy(grid) {
  if (grid.groupBy == null) return;
  const groupBy = grid.groupBy;
  const new_records = [];
  grid.records.forEach((rec) => {
    const group = rec[groupBy.field];
    if (group != null) {
      if (grid.last.groupBy_links[group] == null) {
        const gr = { recid: "group-" + group, group, TsUi: { ...groupBy, children: [] } };
        grid.last.groupBy_links[group] = gr;
        delete gr.TsUi["field"];
        new_records.push(gr);
      }
      rec[groupBy.field] = "";
      grid.last.groupBy_links[group].TsUi.children.push(rec);
    }
  });
  grid.records = new_records;
  if (grid.total !== -1) {
    grid.total = grid.records.length;
  }
}
function localSort(grid, silent, noResetRefresh) {
  const obj = grid;
  const url = grid.url?.get ?? grid.url;
  if (url) {
    console.log("ERROR: grid.localSort can only be used on local data source, grid.url should be empty.");
    return 0;
  }
  if (Object.keys(grid.sortData).length === 0) {
    const os = grid.last.originalSort;
    if (os) {
      grid.records.sort((a, b) => {
        const aInd = os.indexOf(a.recid);
        const bInd = os.indexOf(b.recid);
        return aInd > bInd ? 1 : -1;
      });
    }
    return 0;
  }
  let time = Date.now();
  grid.selectionSave();
  grid.prepareData();
  if (!noResetRefresh) {
    grid.reset();
  }
  for (let i = 0; i < grid.sortData.length; i++) {
    const sortItem = grid.sortData[i];
    const column = grid.getColumn(sortItem.field);
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
  grid.records.sort((a, b) => {
    return compareRecordPaths(a, b);
  });
  cleanupPaths();
  grid.selectionRestore(noResetRefresh);
  time = Date.now() - time;
  if (silent !== true && grid.show.statusSort) {
    setTimeout(() => {
      grid.status(TsUtils.lang("Sorting took ${count} seconds", { count: time / 1e3 }));
    }, 10);
  }
  return time;
  function preparePaths() {
    for (let i = 0; i < obj.records.length; i++) {
      const rec = obj.records[i];
      if (rec.TsUi?.parent_recid != null) {
        rec.TsUi["_path"] = getRecordPath(rec);
      }
    }
  }
  function cleanupPaths() {
    for (let i = 0; i < obj.records.length; i++) {
      const rec = obj.records[i];
      if (rec.TsUi?.parent_recid != null) {
        rec.TsUi["_path"] = null;
      }
    }
  }
  function compareRecordPaths(a, b) {
    if ((!a.TsUi || a.TsUi.parent_recid == null) && (!b.TsUi || b.TsUi.parent_recid == null)) {
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
    if (!rec.TsUi || rec.TsUi.parent_recid == null) return [rec];
    if (rec.TsUi["_path"])
      return rec.TsUi["_path"];
    const subrec = obj.get(rec.TsUi.parent_recid);
    if (!subrec) {
      console.log("ERROR: no parent record: " + rec.TsUi.parent_recid);
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
        if (TsUtils.isPlainObject(aa) && aa.text) aa = aa.text;
        if (TsUtils.isPlainObject(bb) && bb.text) bb = bb.text;
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
        sortMode = TsUtils.naturalCompare;
        break;
      case "i18n":
        sortMode = TsUtils.i18nCompare;
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
function localSearch(grid, silent) {
  const obj = grid;
  const url = grid.url?.get ?? grid.url;
  if (url) {
    console.log("ERROR: grid.localSearch can only be used on local data source, grid.url should be empty.");
    return;
  }
  let time = Date.now();
  const defaultToString = {}.toString;
  const duplicateMap = {};
  grid.total = grid.records.length;
  grid.last.searchIds = [];
  grid.prepareData();
  if (grid.searchData.length > 0 && !url) {
    grid.total = 0;
    for (let i = 0; i < grid.records.length; i++) {
      const rec = grid.records[i];
      const match = searchRecord(rec);
      if (match) {
        if (rec?.TsUi) addParent(rec.TsUi.parent_recid ?? null);
        if (grid.showExtraOnSearch > 0) {
          let before = grid.showExtraOnSearch;
          let after = grid.showExtraOnSearch;
          if (i < before) before = i;
          if (i + after > grid.records.length) after = grid.records.length - i;
          if (before > 0) {
            for (let j = i - before; j < i; j++) {
              if (grid.last.searchIds.indexOf(j) < 0)
                grid.last.searchIds.push(j);
            }
          }
          if (grid.last.searchIds.indexOf(i) < 0) grid.last.searchIds.push(i);
          if (after > 0) {
            for (let j = i + 1; j <= i + after; j++) {
              if (grid.last.searchIds.indexOf(j) < 0) grid.last.searchIds.push(j);
            }
          }
        } else {
          grid.last.searchIds.push(i);
        }
      }
    }
    grid.total = grid.last.searchIds.length;
  }
  time = Date.now() - time;
  if (silent !== true && grid.show.statusSearch) {
    setTimeout(() => {
      grid.status(TsUtils.lang("Search took ${count} seconds", { count: time / 1e3 }));
    }, 10);
  }
  return time;
  function searchRecord(rec) {
    let fl = 0, val1, val2, val3, tmp;
    let orEqual = false;
    for (let j = 0; j < obj.searchData.length; j++) {
      const sdata = obj.searchData[j];
      if (sdata == null) continue;
      let search2 = obj.getSearch(sdata.field);
      if (search2 == null) search2 = { field: sdata.field, type: sdata.type };
      const val1b = rec.TsUi?.["changes"]?.[search2.field] ?? obj.parseField(rec, search2.field);
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
          else if (search2.type == "date") {
            tmp = obj.parseField(rec, search2.field + "_") instanceof Date ? obj.parseField(rec, search2.field + "_") : obj.parseField(rec, search2.field);
            val1 = TsUtils.formatDate(tmp, "yyyy-mm-dd");
            val2 = TsUtils.formatDate(TsUtils.isDate(val2, TsUtils.settings.dateFormat, true), "yyyy-mm-dd");
            if (val1 == val2) fl++;
          } else if (search2.type == "time") {
            tmp = obj.parseField(rec, search2.field + "_") instanceof Date ? obj.parseField(rec, search2.field + "_") : obj.parseField(rec, search2.field);
            val1 = TsUtils.formatTime(tmp, "hh24:mi");
            val2 = TsUtils.formatTime(val2, "hh24:mi");
            if (val1 == val2) fl++;
          } else if (search2.type == "datetime") {
            tmp = obj.parseField(rec, search2.field + "_") instanceof Date ? obj.parseField(rec, search2.field + "_") : obj.parseField(rec, search2.field);
            val1 = TsUtils.formatDateTime(tmp, "yyyy-mm-dd|hh24:mm:ss");
            val2 = TsUtils.formatDateTime(TsUtils.isDateTime(val2, TsUtils.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss");
            if (val1 == val2) fl++;
          }
          break;
        case "is not":
        case "!=":
          if (val1b != sdata["value"] && String(val1b) != sdata["value"]) fl++;
          break;
        case "between":
          if (["int", "float", "money", "currency", "percent"].indexOf(search2.type) != -1) {
            if (parseFloat(obj.parseField(rec, search2.field)) >= parseFloat(val2) && parseFloat(obj.parseField(rec, search2.field)) <= parseFloat(val3)) fl++;
          } else if (search2.type == "date") {
            tmp = obj.parseField(rec, search2.field + "_") instanceof Date ? obj.parseField(rec, search2.field + "_") : obj.parseField(rec, search2.field);
            val1 = TsUtils.isDate(tmp, TsUtils.settings.dateFormat, true);
            val2 = TsUtils.isDate(val2, TsUtils.settings.dateFormat, true);
            val3 = TsUtils.isDate(val3, TsUtils.settings.dateFormat, true);
            if (val3 instanceof Date) val3 = new Date(val3.getTime() + 864e5);
            if (val1 >= val2 && val1 < val3) fl++;
          } else if (search2.type == "time") {
            val1 = obj.parseField(rec, search2.field + "_") instanceof Date ? obj.parseField(rec, search2.field + "_") : obj.parseField(rec, search2.field);
            val2 = TsUtils.isTime(val2, true);
            val3 = TsUtils.isTime(val3, true);
            const t2 = val2;
            const t3 = val3;
            val2 = (/* @__PURE__ */ new Date()).setHours(t2.hours, t2.minutes, t2.seconds ? t2.seconds : 0, 0);
            val3 = (/* @__PURE__ */ new Date()).setHours(t3.hours, t3.minutes, t3.seconds ? t3.seconds : 0, 0);
            if (val1 >= val2 && val1 < val3) fl++;
          } else if (search2.type == "datetime") {
            val1 = obj.parseField(rec, search2.field + "_") instanceof Date ? obj.parseField(rec, search2.field + "_") : obj.parseField(rec, search2.field);
            val2 = TsUtils.isDateTime(val2, TsUtils.settings.datetimeFormat, true);
            val3 = TsUtils.isDateTime(val3, TsUtils.settings.datetimeFormat, true);
            if (val3 instanceof Date) val3 = new Date(val3.getTime() + 864e5);
            if (val1 >= val2 && val1 < val3) fl++;
          }
          break;
        case "<=":
          orEqual = true;
        case "<":
        case "less":
          if (["int", "float", "money", "currency", "percent"].indexOf(search2.type) != -1) {
            val1 = parseFloat(obj.parseField(rec, search2.field));
            val2 = parseFloat(sdata["value"]);
            if (val1 < val2 || orEqual && val1 === val2) fl++;
          } else if (search2.type == "date") {
            tmp = obj.parseField(rec, search2.field + "_") instanceof Date ? obj.parseField(rec, search2.field + "_") : obj.parseField(rec, search2.field);
            val1 = TsUtils.isDate(tmp, TsUtils.settings.dateFormat, true);
            val2 = TsUtils.isDate(val2, TsUtils.settings.dateFormat, true);
            if (val1 < val2 || orEqual && val1 === val2) fl++;
          } else if (search2.type == "time") {
            tmp = obj.parseField(rec, search2.field + "_") instanceof Date ? obj.parseField(rec, search2.field + "_") : obj.parseField(rec, search2.field);
            val1 = TsUtils.formatTime(tmp, "hh24:mi");
            val2 = TsUtils.formatTime(val2, "hh24:mi");
            if (val1 < val2 || orEqual && val1 === val2) fl++;
          } else if (search2.type == "datetime") {
            tmp = obj.parseField(rec, search2.field + "_") instanceof Date ? obj.parseField(rec, search2.field + "_") : obj.parseField(rec, search2.field);
            val1 = TsUtils.formatDateTime(tmp, "yyyy-mm-dd|hh24:mm:ss");
            val2 = TsUtils.formatDateTime(TsUtils.isDateTime(val2, TsUtils.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss");
            if (val1.length == val2.length && (val1 < val2 || orEqual && val1 === val2)) fl++;
          }
          break;
        case ">=":
          orEqual = true;
        case ">":
        case "more":
          if (["int", "float", "money", "currency", "percent"].indexOf(search2.type) != -1) {
            val1 = parseFloat(obj.parseField(rec, search2.field));
            val2 = parseFloat(sdata["value"]);
            if (val1 > val2 || orEqual && val1 === val2) fl++;
          } else if (search2.type == "date") {
            tmp = obj.parseField(rec, search2.field + "_") instanceof Date ? obj.parseField(rec, search2.field + "_") : obj.parseField(rec, search2.field);
            val1 = TsUtils.isDate(tmp, TsUtils.settings.dateFormat, true);
            val2 = TsUtils.isDate(val2, TsUtils.settings.dateFormat, true);
            if (val1 > val2 || orEqual && val1 === val2) fl++;
          } else if (search2.type == "time") {
            tmp = obj.parseField(rec, search2.field + "_") instanceof Date ? obj.parseField(rec, search2.field + "_") : obj.parseField(rec, search2.field);
            val1 = TsUtils.formatTime(tmp, "hh24:mi");
            val2 = TsUtils.formatTime(val2, "hh24:mi");
            if (val1 > val2 || orEqual && val1 === val2) fl++;
          } else if (search2.type == "datetime") {
            tmp = obj.parseField(rec, search2.field + "_") instanceof Date ? obj.parseField(rec, search2.field + "_") : obj.parseField(rec, search2.field);
            val1 = TsUtils.formatDateTime(tmp, "yyyy-mm-dd|hh24:mm:ss");
            val2 = TsUtils.formatDateTime(TsUtils.isDateTime(val2, TsUtils.settings.datetimeFormat, true), "yyyy-mm-dd|hh24:mm:ss");
            if (val1.length == val2.length && (val1 > val2 || orEqual && val1 === val2)) fl++;
          }
          break;
        case "in":
          tmp = sdata["value"];
          if (sdata["svalue"]) tmp = sdata["svalue"];
          if (tmp.indexOf(TsUtils.isFloat(val1b) ? parseFloat(val1b) : val1b) !== -1 || tmp.indexOf(val1) !== -1 && val1 !== "") fl++;
          break;
        case "not in":
          tmp = sdata["value"];
          if (sdata["svalue"]) tmp = sdata["svalue"];
          if (!(tmp.indexOf(TsUtils.isFloat(val1b) ? parseFloat(val1b) : val1b) !== -1 || tmp.indexOf(val1) !== -1 && val1 !== "")) fl++;
          break;
        case "begins":
        case "begins with":
          if (val1.indexOf(val2) === 0) fl++;
          break;
        case "contains":
          if (val1.indexOf(val2) >= 0) fl++;
          break;
        case "null":
          if (obj.parseField(rec, search2.field) == null) fl++;
          break;
        case "not null":
          if (obj.parseField(rec, search2.field) != null) fl++;
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
    if (rec.TsUi?.children && rec.TsUi?.expanded !== true) {
      for (let r = 0; r < rec.TsUi.children.length; r++) {
        const subRec = rec.TsUi.children[r];
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
    if (rec?.TsUi) {
      addParent(rec.TsUi.parent_recid ?? null);
    }
    obj.last.searchIds.push(i);
  }
}
function getRangeData(grid, range, extra) {
  const rec1 = grid.get(range[0].recid, true) ?? 0;
  const rec2 = grid.get(range[1].recid, true) ?? 0;
  const col1 = range[0].column;
  const col2 = range[1].column;
  const res = [];
  if (col1 == col2) {
    for (let r = Math.min(rec1, rec2); r <= Math.max(rec1, rec2); r++) {
      const record = grid.records[r];
      const dt = record[grid.columns[col1].field] || null;
      if (extra !== true) {
        res.push(dt);
      } else {
        res.push({ data: dt, column: col1, index: r, record });
      }
    }
  } else if (rec1 == rec2) {
    const record = grid.records[rec1];
    for (let i = Math.min(col1, col2); i <= Math.max(col1, col2); i++) {
      const dt = record[grid.columns[i].field] || null;
      if (extra !== true) {
        res.push(dt);
      } else {
        res.push({ data: dt, column: i, index: rec1, record });
      }
    }
  } else {
    for (let r = Math.min(rec1, rec2); r <= Math.max(rec1, rec2); r++) {
      const record = grid.records[r];
      const rowData = [];
      res.push(rowData);
      for (let i = Math.min(col1, col2); i <= Math.max(col1, col2); i++) {
        const dt = record[grid.columns[i].field];
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
function addRange(grid, rangesInput) {
  let added = 0, first, last;
  if (grid.selectType == "row") return added;
  const ranges = !Array.isArray(rangesInput) ? [rangesInput] : rangesInput;
  for (let i = 0; i < ranges.length; i++) {
    if (typeof ranges[i] != "object") ranges[i] = { name: "selection" };
    if (ranges[i].name == "selection") {
      if (grid.show.selectionBorder === false) continue;
      const sel = grid.getSelection();
      if (sel.length === 0) {
        grid.removeRange("selection");
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
      for (let j = 0; j < grid.ranges.length; j++) if (grid.ranges[j].name == ranges[i].name) {
        ind = j;
        break;
      }
      if (ind !== false) {
        grid.ranges[ind] = rg;
      } else {
        grid.ranges.push(rg);
      }
      added++;
    }
  }
  grid.refreshRanges();
  return added;
}
function removeRange(grid, ...names) {
  let removed = 0;
  for (let a = 0; a < names.length; a++) {
    const name = names[a];
    query15(grid.box).find("#grid_" + grid.name + "_" + name).remove();
    query15(grid.box).find("#grid_" + grid.name + "_f" + name).remove();
    for (let r = grid.ranges.length - 1; r >= 0; r--) {
      if (grid.ranges[r].name == name) {
        grid.ranges.splice(r, 1);
        removed++;
      }
    }
  }
  return removed;
}
function refreshRanges(grid) {
  if (grid.ranges.length === 0) return;
  const self = grid;
  let range;
  const time = Date.now();
  const rec1 = query15(grid.box).find(`#grid_${grid.name}_frecords`);
  const rec2 = query15(grid.box).find(`#grid_${grid.name}_records`);
  for (let i = 0; i < grid.ranges.length; i++) {
    const rg = grid.ranges[i];
    let first = rg.range[0];
    let last = rg.range[1];
    if (first.index == null) {
      const fi = grid.get(first.recid, true);
      if (fi != null) first.index = fi;
    }
    if (last.index == null) {
      const li = grid.get(last.recid, true);
      if (li != null) last.index = li;
    }
    if (first.index != null && last.index != null && first.index > last.index) {
      const tmp3 = first;
      first = last;
      last = tmp3;
    }
    let td1 = query15(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(first.recid) + ' td[col="' + first.column + '"]');
    let td2 = query15(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(last.recid) + ' td[col="' + last.column + '"]');
    let td1f = query15(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(first.recid) + ' td[col="' + first.column + '"]');
    let td2f = query15(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(last.recid) + ' td[col="' + last.column + '"]');
    let _lastColumn = last.column;
    if (first.column < grid.last.vscroll.colIndStart && last.column > grid.last.vscroll.colIndStart) {
      td1 = query15(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(first.recid) + ' td[col="start"]');
    }
    if (first.column < grid.last.vscroll.colIndEnd && last.column > grid.last.vscroll.colIndEnd) {
      td2 = query15(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(last.recid) + ' td[col="end"]');
      _lastColumn = "end";
    }
    const index_top = parseInt(query15(grid.box).find("#grid_" + grid.name + "_rec_top").next().attr("index"));
    const index_bottom = parseInt(query15(grid.box).find("#grid_" + grid.name + "_rec_bottom").prev().attr("index"));
    const index_ftop = parseInt(query15(grid.box).find("#grid_" + grid.name + "_frec_top").next().attr("index"));
    const index_fbottom = parseInt(query15(grid.box).find("#grid_" + grid.name + "_frec_bottom").prev().attr("index"));
    if (td1.length === 0 && first.index < index_top && last.index > index_top) {
      td1 = query15(grid.box).find("#grid_" + grid.name + "_rec_top").next().find('td[col="' + first.column + '"]');
    }
    if (td2.length === 0 && last.index > index_bottom && first.index < index_bottom) {
      td2 = query15(grid.box).find("#grid_" + grid.name + "_rec_bottom").prev().find('td[col="' + _lastColumn + '"]');
    }
    if (td1f.length === 0 && first.index < index_ftop && last.index > index_ftop) {
      td1f = query15(grid.box).find("#grid_" + grid.name + "_frec_top").next().find('td[col="' + first.column + '"]');
    }
    if (td2f.length === 0 && last.index > index_fbottom && first.index < index_fbottom) {
      td2f = query15(grid.box).find("#grid_" + grid.name + "_frec_bottom").prev().find('td[col="' + last.column + '"]');
    }
    const edit = query15(grid.box).find("#grid_" + grid.name + "_editable");
    const tmp = edit.find(".tsg-input");
    const tmp_ind = tmp.attr("index");
    const tmp1 = grid.records[tmp_ind]?.recid;
    const tmp2 = tmp.attr("column");
    if (rg.name == "selection" && rg.range[0].recid == tmp1 && rg.range[0].column == tmp2) continue;
    range = query15(grid.box).find("#grid_" + grid.name + "_f" + rg.name);
    if (td1f.length > 0 || td2f.length > 0) {
      if (range.length === 0) {
        rec1.append('<div id="grid_' + grid.name + "_f" + rg.name + '" class="tsg-selection" style="' + rg.style + '">' + (rg.name == "selection" && grid.show.selectionResizer ? '<div id="grid_' + grid.name + '_resizer" class="tsg-selection-resizer"></div>' : "") + "</div>");
        range = query15(grid.box).find("#grid_" + grid.name + "_f" + rg.name);
      } else {
        range.attr("style", rg.style);
        range.find(".tsg-selection-resizer").show();
      }
      if (td2f.length === 0) {
        td2f = query15(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(last.recid) + " td:last-child");
        if (td2f.length === 0) td2f = query15(grid.box).find("#grid_" + grid.name + "_frec_bottom td:first-child");
        range.css("border-right", "0px");
        range.find(".tsg-selection-resizer").hide();
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
    range = query15(grid.box).find("#grid_" + grid.name + "_" + rg.name);
    if (td1.length > 0 || td2.length > 0) {
      if (range.length === 0) {
        rec2.append(`
                    <div id="grid_${grid.name}_${rg.name}" class="tsg-selection ${rg.class ?? ""}" style="${rg.style}">
                        ${rg.name == "selection" && grid.show.selectionResizer ? `<div id="grid_${grid.name}_resizer" class="tsg-selection-resizer"></div>` : ""}
                    </div>
                `);
        range = query15(grid.box).find("#grid_" + grid.name + "_" + rg.name);
      } else {
        range.attr("style", rg.style);
      }
      if (td1.length === 0) {
        td1 = query15(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(first.recid) + " td:first-child");
        if (td1.length === 0) td1 = query15(grid.box).find("#grid_" + grid.name + "_rec_top td:first-child");
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
  query15(grid.box).find(".tsg-selection-resizer").off(".resizer").on("mousedown.resizer", mouseStart).on("dblclick.resizer", (event2) => {
    const edata2 = self.trigger("resizerDblClick", { target: self.name, originalEvent: event2 });
    if (edata2.isCancelled === true) return;
    edata2.finish();
  });
  let edata;
  const detail = { target: self.name, originalRange: null, newRange: null };
  const letters = "abcdefghijklmnopqrstuvwxyz";
  return Date.now() - time;
  function mouseStart(event2) {
    const sel = self.getSelectionCells();
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
      originalRange: [TsUtils.clone(first), TsUtils.clone(last)],
      newRange: [TsUtils.clone(first), TsUtils.clone(last)]
    };
    detail.originalName = self.last.move.name;
    detail.originalRange = self.last.move.originalRange;
    query15("body").off(".tsg-" + self.name).on("mousemove.tsg-" + self.name, mouseMove).on("mouseup.tsg-" + self.name, mouseStop);
    event2.preventDefault();
  }
  function mouseMove(event2) {
    const mv = self.last.move;
    if (!mv || mv.type != "expand") return;
    mv.divX = event2.screenX - mv.x;
    mv.divY = event2.screenY - mv.y;
    let column;
    let tmp = event2.target;
    if (tmp.tagName.toUpperCase() != "TD") tmp = query15(tmp).closest("td")[0];
    if (query15(tmp).attr("col") != null) column = parseInt(query15(tmp).attr("col"));
    if (column == null) {
      return;
    }
    tmp = query15(tmp).closest("tr")[0];
    const index = parseInt(query15(tmp).attr("index"));
    const recid = self.records[index]?.recid;
    if (mv.newRange[1].recid == recid && mv.newRange[1].column == column) {
      return;
    }
    const prevNewRange = TsUtils.clone(mv.newRange);
    mv.newRange = [{ recid: mv.recid, index: mv.index, column: mv.column }, { recid, index, column }];
    detail.newName = letters[mv.column] + (mv.index + 1) + ":" + letters[column] + (index + 1);
    detail.newRange = TsUtils.clone(mv.newRange);
    edata = self.trigger("selectionExtend", detail);
    if (edata.isCancelled === true) {
      mv.newRange = prevNewRange;
      detail.newRange = prevNewRange;
      return;
    } else {
      self.addRange({
        name: "selection-expand",
        range: mv.newRange,
        class: "tsg-selection-expand"
      });
    }
  }
  function mouseStop(_event) {
    self.removeRange("selection-expand");
    query15("body").off(".tsg-" + self.name);
    if (self.last.move?.type == "expand" && edata.finish) {
      edata.finish();
    }
    delete self.last.move;
  }
}
function clear(grid, noRefresh) {
  grid.total = 0;
  grid.records = [];
  grid.summary = [];
  grid.last.fetch.offset = 0;
  grid.last.idCache = {};
  grid.last.selection = { indexes: [], columns: {} };
  grid.last.groupBy_links = {};
  grid.reset(true);
  if (!noRefresh) grid.refresh();
}
function reset(grid, noRefresh) {
  grid.last.vscroll.scrollTop = 0;
  grid.last.vscroll.scrollLeft = 0;
  grid.last.vscroll.recIndStart = null;
  grid.last.vscroll.recIndEnd = null;
  query15(grid.box).find(`#grid_${grid.name}_records`).prop("scrollTop", 0);
  if (!noRefresh) grid.refresh();
}
function load(grid, url, callBack) {
  if (url == null) {
    console.log('ERROR: You need to provide url argument when calling .load() method of "' + grid.name + '" object.');
    return new Promise((resolve, reject) => {
      reject();
    });
  }
  grid.clear(true);
  return grid.request("load", {}, url, callBack);
}
function reload(grid, callBack) {
  const url = grid.url?.get ?? grid.url;
  grid.selectionSave();
  if (url) {
    return grid.load(url, () => {
      grid.selectionRestore();
      if (typeof callBack == "function") callBack();
    });
  } else {
    grid.reset(true);
    grid.localSearch();
    grid.selectionRestore();
    if (typeof callBack == "function") callBack({ status: "success" });
    return new Promise((resolve) => {
      resolve();
    });
  }
}
function request(grid, action, postData, url, callBack) {
  const self = grid;
  let resolve, reject;
  const requestProm = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  if (postData == null) postData = {};
  if (!url) url = grid.url;
  if (!url) return new Promise((resolve2, reject2) => {
    reject2();
  });
  if (!TsUtils.isInt(grid.offset)) grid.offset = 0;
  if (!TsUtils.isInt(grid.last.fetch.offset)) grid.last.fetch.offset = 0;
  let edata;
  const params = {
    limit: grid.limit,
    offset: grid.offset + grid.last.fetch.offset,
    searchLogic: grid.last.logic,
    search: grid.searchData.map((search2) => {
      const _search = TsUtils.clone(search2);
      if (grid.searchMap && grid.searchMap[_search.field]) _search.field = grid.searchMap[_search.field];
      return _search;
    }),
    sort: grid.sortData.map((sort2) => {
      const _sort = TsUtils.clone(sort2);
      if (grid.sortMap && grid.sortMap[_sort.field]) _sort.field = grid.sortMap[_sort.field];
      return _sort;
    })
  };
  if (grid.searchData.length === 0) {
    delete params.search;
    delete params.searchLogic;
  }
  if (grid.sortData.length === 0) {
    delete params.sort;
  }
  TsUtils.extend(params, grid.postData);
  TsUtils.extend(params, postData);
  if (action == "delete" || action == "save") {
    delete params.limit;
    delete params.offset;
    params.action = action;
    if (action == "delete") {
      params[grid.recid || "recid"] = grid.getSelection();
    }
  }
  if (action == "load") {
    edata = grid.trigger("request", {
      target: grid.name,
      url,
      postData: params,
      httpMethod: "GET",
      httpHeaders: grid.httpHeaders
    });
    if (edata.isCancelled === true) return new Promise((resolve2, reject2) => {
      reject2();
    });
  } else {
    edata = { detail: {
      url,
      postData: params,
      httpMethod: action == "save" ? "PUT" : "DELETE",
      httpHeaders: grid.httpHeaders
    } };
  }
  if (grid.last.fetch.offset === 0) {
    grid.lock(TsUtils.lang(grid.msgRefresh), true);
  }
  if (grid.last.fetch.controller) try {
    grid.last.fetch.controller.abort();
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
  if (Object.keys(grid.routeData).length > 0) {
    const info = TsUtils.parseRoute(url);
    if (info.keys.length > 0) {
      for (let k = 0; k < info.keys.length; k++) {
        const key_k = info.keys[k];
        if (grid.routeData[key_k.name] == null) continue;
        url = url.replace(new RegExp(":" + key_k.name, "g"), grid.routeData[key_k.name]);
      }
    }
  }
  url = new URL(url, location.href);
  const fetchOptions = TsUtils.prepareParams(url, {
    method: edata.detail.httpMethod,
    headers: edata.detail.httpHeaders,
    body: edata.detail.postData
  }, { dataType: grid.dataType, caller: grid, action });
  Object.assign(grid.last.fetch, {
    action,
    options: fetchOptions,
    controller: new AbortController(),
    start: Date.now(),
    loaded: false
  });
  fetchOptions["signal"] = grid.last.fetch.controller.signal;
  fetch(url, fetchOptions).catch(processError).then((resp) => {
    if (resp == null) return;
    if (resp?.status != 200) {
      processError(resp ?? {});
      return;
    }
    resp.json().catch(processError).then((data) => {
      grid.requestComplete(data ?? {}, action, callBack, resolve, reject);
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
      self.requestComplete({ error: true, message: TsUtils.lang(self.msgHTTPError), response }, action, callBack, resolve, reject);
    }
    edata2.finish();
  }
}
function save(grid, callBack) {
  const changes = grid.getChanges();
  const url = grid.url?.save ?? grid.url;
  const edata = grid.trigger("save", { target: grid.name, changes });
  if (edata.isCancelled === true) return;
  if (url) {
    grid.request(
      "save",
      { "changes": edata.detail["changes"] },
      null,
      (data) => {
        if (!data.error) {
          grid.mergeChanges();
        }
        edata.finish();
        if (typeof callBack == "function") callBack(data);
      }
    );
  } else {
    grid.mergeChanges();
    edata.finish();
  }
}

// src/grid-selection.ts
var query16 = query;
function select(grid, ...selectArgs) {
  if (selectArgs.length === 0) return 0;
  let selected = 0;
  const sel = grid.last.selection;
  if (!grid.multiSelect) grid.selectNone(true);
  let args = selectArgs.slice();
  if (Array.isArray(args[0])) args = args[0];
  args = args.filter((aa) => {
    const recid = aa?.recid ?? aa;
    const index = aa?.index ?? grid.get(recid, true);
    const rec = grid.records[index];
    if (rec?.TsUi?.selectable === false) {
      return false;
    }
    if (typeof aa === "object") {
      aa.index ??= index;
    }
    return true;
  });
  const tmp = { target: grid.name };
  if (args.length == 1) {
    tmp.multiple = false;
    if (TsUtils.isPlainObject(args[0])) {
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
  if (grid.compareSelection(args).select.length == 0) {
    return;
  }
  const edata = grid.trigger("select", tmp);
  if (edata.isCancelled === true) return 0;
  if (grid.selectType == "row") {
    for (let a = 0; a < args.length; a++) {
      const recid = typeof args[a] == "object" ? args[a].recid : args[a];
      const index = grid.get(recid, true);
      if (index == null) continue;
      let recEl1 = null;
      let recEl2 = null;
      if (grid.searchData.length !== 0 || index + 1 >= (grid.last.vscroll.recIndStart ?? 0) && index + 1 <= (grid.last.vscroll.recIndEnd ?? 0)) {
        recEl1 = query16(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(recid));
        recEl2 = query16(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(recid));
      }
      if (grid.selectType == "row") {
        if (sel.indexes.indexOf(index) != -1) continue;
        sel.indexes.push(index);
        if (recEl1 && recEl2) {
          recEl1.addClass("tsg-selected").find(".tsg-col-number").addClass("tsg-row-selected");
          recEl2.addClass("tsg-selected").find(".tsg-col-number").addClass("tsg-row-selected");
          recEl1.find(".tsg-grid-select-check").prop("checked", true);
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
      } else if (TsUtils.isInt(column)) {
        new_sel[recid].push(column);
      } else {
        for (let i = 0; i < grid.columns.length; i++) {
          if (grid.columns[i].hidden) continue;
          new_sel[recid].push(i);
        }
      }
    }
    const col_sel = [];
    for (const recid in new_sel) {
      const index = grid.get(recid, true);
      if (index == null) continue;
      let recEl1 = null;
      let recEl2 = null;
      if (index + 1 >= (grid.last.vscroll.recIndStart ?? 0) && index + 1 <= (grid.last.vscroll.recIndEnd ?? 0)) {
        recEl1 = query16(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(recid));
        recEl2 = query16(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(recid));
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
          recEl1.find("#grid_" + grid.name + "_data_" + index + "_" + col).addClass("tsg-selected");
          recEl1.find(".tsg-col-number").addClass("tsg-row-selected");
          recEl1.find(".tsg-grid-select-check").prop("checked", true);
        }
        if (recEl2) {
          recEl2.find("#grid_" + grid.name + "_data_" + index + "_" + col).addClass("tsg-selected");
          recEl2.find(".tsg-col-number").addClass("tsg-row-selected");
          recEl2.find(".tsg-grid-select-check").prop("checked", true);
        }
        selected++;
      }
      sel.columns[index] = s;
    }
    for (let c = 0; c < col_sel.length; c++) {
      query16(grid.box).find("#grid_" + grid.name + "_column_" + col_sel[c] + " .tsg-col-header").addClass("tsg-col-selected");
    }
  }
  sel.indexes.sort((a, b) => {
    return a - b;
  });
  const areAllSelected = grid.records.length > 0 && sel.indexes.length == grid.records.length, areAllSearchedSelected = sel.indexes.length > 0 && grid.searchData.length !== 0 && sel.indexes.length == grid.last.searchIds.length;
  if (areAllSelected || areAllSearchedSelected) {
    query16(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", true);
  } else {
    query16(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", false);
  }
  grid.status();
  grid.addRange("selection");
  grid.updateToolbar(sel, areAllSelected);
  edata.finish();
  return selected;
}
function unselect(grid, ...unselectArgs) {
  let unselected = 0;
  const sel = grid.last.selection;
  let args = unselectArgs.slice();
  if (Array.isArray(args[0])) args = args[0];
  const tmp = { target: grid.name };
  if (args.length == 1) {
    tmp.multiple = false;
    if (TsUtils.isPlainObject(args[0])) {
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
  if (grid.compareSelection(args).unselect.length == 0) {
    return 0;
  }
  const edata = grid.trigger("select", tmp);
  if (edata.isCancelled === true) return 0;
  for (let a = 0; a < args.length; a++) {
    const recid = typeof args[a] == "object" ? args[a].recid : args[a];
    const record = grid.get(recid);
    if (record == null) continue;
    const index = grid.get(record.recid, true) ?? -1;
    const recEl1 = query16(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(recid));
    const recEl2 = query16(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(recid));
    if (grid.selectType == "row") {
      if (sel.indexes.indexOf(index) == -1) continue;
      sel.indexes.splice(sel.indexes.indexOf(index), 1);
      recEl1.removeClass("tsg-selected tsg-inactive").find(".tsg-col-number").removeClass("tsg-row-selected");
      recEl2.removeClass("tsg-selected tsg-inactive").find(".tsg-col-number").removeClass("tsg-row-selected");
      if (recEl1.length != 0) {
        recEl1[0].style.cssText = "height: " + grid.recordHeight + "px; " + recEl1.attr("custom_style");
        recEl2[0].style.cssText = "height: " + grid.recordHeight + "px; " + recEl2.attr("custom_style");
      }
      recEl1.find(".tsg-grid-select-check").prop("checked", false);
      unselected++;
    } else {
      const col = args[a].column;
      if (!TsUtils.isInt(col)) {
        const cols = [];
        for (let i = 0; i < grid.columns.length; i++) {
          if (grid.columns[i].hidden) continue;
          cols.push({ recid, column: i });
        }
        return grid.unselect(cols);
      }
      const s = sel.columns[index];
      if (!Array.isArray(s) || s.indexOf(col) == -1) continue;
      s.splice(s.indexOf(col), 1);
      query16(grid.box).find(`#grid_${grid.name}_rec_${TsUtils.escapeId(recid)} > td[col="${col}"]`).removeClass("tsg-selected tsg-inactive");
      query16(grid.box).find(`#grid_${grid.name}_frec_${TsUtils.escapeId(recid)} > td[col="${col}"]`).removeClass("tsg-selected tsg-inactive");
      let isColSelected = false;
      let isRowSelected = false;
      const tmp2 = grid.getSelectionCells();
      for (let i = 0; i < tmp2.length; i++) {
        if (tmp2[i].column == col) isColSelected = true;
        if (tmp2[i].recid == recid) isRowSelected = true;
      }
      if (!isColSelected) {
        query16(grid.box).find(`.tsg-grid-columns td[col="${col}"] .tsg-col-header, .tsg-grid-fcolumns td[col="${col}"] .tsg-col-header`).removeClass("tsg-col-selected");
      }
      if (!isRowSelected) {
        query16(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(recid)).find(".tsg-col-number").removeClass("tsg-row-selected");
      }
      unselected++;
      if (s.length === 0) {
        delete sel.columns[index];
        sel.indexes.splice(sel.indexes.indexOf(index), 1);
        recEl1.find(".tsg-grid-select-check").prop("checked", false);
      }
    }
  }
  const areAllSelected = grid.records.length > 0 && sel.indexes.length == grid.records.length, areAllSearchedSelected = sel.indexes.length > 0 && grid.searchData.length !== 0 && sel.indexes.length == grid.last.searchIds.length;
  if (areAllSelected || areAllSearchedSelected) {
    query16(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", true);
  } else {
    query16(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", false);
  }
  grid.status();
  grid.addRange("selection");
  grid.updateToolbar(sel, areAllSelected);
  edata.finish();
  return unselected;
}
function compareSelection(grid, newSel) {
  const select2 = [];
  const unselect2 = [];
  if (grid.selectType == "row") {
    const sel = grid.getSelectionRows();
    newSel.forEach((sel2, ind) => {
      if (typeof sel2 == "object") newSel[ind] = sel2.recid;
    });
    for (let i = 0; i < newSel.length; i++) {
      if (!sel.includes(newSel[i])) {
        select2.push(newSel[i]);
      }
    }
    for (let i = 0; i < newSel.length; i++) {
      if (sel.includes(newSel[i])) {
        unselect2.push(newSel[i]);
      }
    }
  } else {
    const sel = grid.getSelectionCells();
    for (let ns = 0; ns < newSel.length; ns++) {
      let flag = false;
      for (let s = 0; s < sel.length; s++) if (newSel[ns].recid == sel[s].recid && newSel[ns].column == sel[s].column) flag = true;
      if (!flag) select2.push({ recid: newSel[ns].recid, column: newSel[ns].column });
    }
    for (let s = 0; s < sel.length; s++) {
      let flag = false;
      for (let ns = 0; ns < newSel.length; ns++) if (newSel[ns].recid == sel[s].recid && newSel[ns].column == sel[s].column) flag = true;
      if (!flag) unselect2.push({ recid: sel[s].recid, column: sel[s].column });
    }
  }
  return { select: select2, unselect: unselect2 };
}
function selectAll(grid) {
  const time = Date.now();
  if (grid.multiSelect === false) return;
  const url = grid.url?.get ?? grid.url;
  let sel = TsUtils.clone(grid.last.selection);
  const cols = [];
  for (let i = 0; i < grid.columns.length; i++) cols.push(i);
  sel.indexes = [];
  if (!url && grid.searchData.length !== 0) {
    for (let i = 0; i < grid.last.searchIds.length; i++) {
      sel.indexes.push(grid.last.searchIds[i]);
      if (grid.selectType != "row") sel.columns[grid.last.searchIds[i]] = cols.slice();
    }
  } else {
    let buffered = grid.records.length;
    if (grid.searchData.length != 0 && !url) buffered = grid.last.searchIds.length;
    for (let i = 0; i < buffered; i++) {
      sel.indexes.push(i);
      if (grid.selectType != "row") sel.columns[i] = cols.slice();
    }
  }
  const edata = grid.trigger("select", { target: grid.name, multiple: true, all: true, clicked: sel });
  if (edata.isCancelled === true) return;
  grid.last.selection = sel;
  if (grid.selectType == "row") {
    query16(grid.box).find(".tsg-grid-records tr:not(.tsg-empty-record)").addClass("tsg-selected").find(".tsg-col-number").addClass("tsg-row-selected");
    query16(grid.box).find(".tsg-grid-frecords tr:not(.tsg-empty-record)").addClass("tsg-selected").find(".tsg-col-number").addClass("tsg-row-selected");
    query16(grid.box).find("input.tsg-grid-select-check").prop("checked", true);
  } else {
    query16(grid.box).find(".tsg-grid-columns td .tsg-col-header, .tsg-grid-fcolumns td .tsg-col-header").addClass("tsg-col-selected");
    query16(grid.box).find(".tsg-grid-records tr .tsg-col-number").addClass("tsg-row-selected");
    query16(grid.box).find(".tsg-grid-records tr:not(.tsg-empty-record)").find(".tsg-grid-data:not(.tsg-col-select)").addClass("tsg-selected");
    query16(grid.box).find(".tsg-grid-frecords tr .tsg-col-number").addClass("tsg-row-selected");
    query16(grid.box).find(".tsg-grid-frecords tr:not(.tsg-empty-record)").find(".tsg-grid-data:not(.tsg-col-select)").addClass("tsg-selected");
    query16(grid.box).find("input.tsg-grid-select-check").prop("checked", true);
  }
  sel = grid.getSelectionRows(true);
  grid.addRange("selection");
  query16(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", true);
  grid.status();
  grid.updateToolbar({ indexes: sel }, true);
  edata.finish();
  return Date.now() - time;
}
function selectNone(grid, skipEvent) {
  const time = Date.now();
  let edata;
  if (!skipEvent) {
    edata = grid.trigger("select", { target: grid.name, clicked: [] });
    if (edata.isCancelled === true) return;
  }
  const sel = grid.last.selection;
  if (grid.selectType == "row") {
    query16(grid.box).find(".tsg-grid-records tr.tsg-selected").removeClass("tsg-selected tsg-inactive").find(".tsg-col-number").removeClass("tsg-row-selected");
    query16(grid.box).find(".tsg-grid-frecords tr.tsg-selected").removeClass("tsg-selected tsg-inactive").find(".tsg-col-number").removeClass("tsg-row-selected");
    query16(grid.box).find("input.tsg-grid-select-check").prop("checked", false);
  } else {
    query16(grid.box).find(".tsg-grid-columns td .tsg-col-header, .tsg-grid-fcolumns td .tsg-col-header").removeClass("tsg-col-selected");
    query16(grid.box).find(".tsg-grid-records tr .tsg-col-number").removeClass("tsg-row-selected");
    query16(grid.box).find(".tsg-grid-frecords tr .tsg-col-number").removeClass("tsg-row-selected");
    query16(grid.box).find(".tsg-grid-data.tsg-selected").removeClass("tsg-selected tsg-inactive");
    query16(grid.box).find("input.tsg-grid-select-check").prop("checked", false);
  }
  sel.indexes = [];
  sel.columns = {};
  grid.removeRange("selection");
  query16(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", false);
  grid.status();
  grid.updateToolbar(sel, false);
  if (!skipEvent) {
    edata.finish();
  }
  return Date.now() - time;
}
function updateToolbar(grid, sel, _areAllSelected) {
  const obj = grid;
  const cnt = sel && sel.indexes ? sel.indexes.length : 0;
  if (!grid.toolbar.render) {
    return;
  }
  grid.toolbar.items.forEach((item) => {
    _checkItem(item, "");
    if (Array.isArray(item.items)) {
      item.items.forEach((it) => {
        _checkItem(it, item.id + ":");
      });
    }
  });
  if (grid.show.toolbarSave) {
    if (grid.getChanges().length > 0) {
      grid.toolbar.enable("tsg-save");
    } else {
      grid.toolbar.disable("tsg-save");
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
function getSelectionRows(grid, returnIndex) {
  const ret = [];
  const sel = grid.last.selection;
  for (let i = 0; i < sel.indexes.length; i++) {
    const idx = sel.indexes[i];
    if (!grid.records[idx]) continue;
    if (returnIndex === true) ret.push(idx);
    else ret.push(grid.records[idx].recid);
  }
  return ret;
}
function getSelectionCells(grid) {
  const ret = [];
  const sel = grid.last.selection;
  for (let i = 0; i < sel.indexes.length; i++) {
    const idx = sel.indexes[i];
    const cols = sel.columns[idx] ?? [];
    if (!grid.records[idx]) continue;
    for (let j = 0; j < cols.length; j++) {
      ret.push({ recid: grid.records[idx].recid, index: idx, column: cols[j] });
    }
  }
  return ret;
}
function getSelection(grid, returnIndex) {
  return grid.selectType === "row" ? grid.getSelectionRows(returnIndex) : grid.getSelectionCells();
}

// src/tsfield.ts
var query17 = query;
var TsMenu2 = TsMenu;
var TsColor2 = TsColor;
var TsDate2 = TsDate;
var TsTooltip2 = TsTooltip;
var TsField = class extends TsBase {
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
      options = TsUtils.clone(type);
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
    this.options = TsUtils.clone(opts);
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
      console.log("ERROR: Cannot init TsField on empty subject");
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
      console.log("ERROR: TsField could only be applied to INPUT or TEXTAREA.", this.el);
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
            prefix: TsUtils.settings.currencyPrefix,
            suffix: TsUtils.settings.currencySuffix,
            precision: TsUtils.settings.currencyPrecision
          },
          decimalSymbol: TsUtils.settings.decimalSymbol,
          groupSymbol: TsUtils.settings.groupSymbol,
          arrows: false,
          keyboard: true,
          precision: null,
          prefix: "",
          suffix: ""
        };
        this.options = TsUtils.extend({}, defaults, options);
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
        this.options = TsUtils.extend({}, defaults, options);
        options = this.options;
        break;
      }
      case "date": {
        defaults = {
          format: TsUtils.settings.dateFormat,
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
        this.options = TsUtils.extend({ type: "date" }, defaults, options);
        options = this.options;
        if (query17(this.el).attr("placeholder") == null) {
          query17(this.el).attr("placeholder", options.format);
        }
        break;
      }
      case "time": {
        defaults = {
          format: TsUtils.settings.timeFormat,
          keyboard: true,
          autoCorrect: true,
          start: null,
          end: null,
          btnNow: true,
          noMinutes: false
        };
        this.options = TsUtils.extend({ type: "time" }, defaults, options);
        options = this.options;
        if (query17(this.el).attr("placeholder") == null) {
          query17(this.el).attr("placeholder", options.format);
        }
        break;
      }
      case "datetime": {
        defaults = {
          format: TsUtils.settings.dateFormat + "|" + TsUtils.settings.timeFormat,
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
        this.options = TsUtils.extend({ type: "datetime" }, defaults, options);
        options = this.options;
        if (query17(this.el).attr("placeholder") == null) {
          query17(this.el).attr("placeholder", options.placeholder || options.format);
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
          // default comes from TsUtils.settings.dataType
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
        options.items = TsUtils.normMenu.call(this, options.items, options);
        if (this.type === "list") {
          query17(this.el).addClass("tsg-select");
          if (!TsUtils.isPlainObject(options.selected) && Array.isArray(options.items)) {
            options.items.forEach((item) => {
              if (item && item.id === options.selected) {
                options.selected = TsUtils.clone(item);
              }
            });
          }
        }
        options = TsUtils.extend({}, defaults, options);
        const valid = ["is", "begins", "contains", "ends"];
        if (!valid.includes(options.match)) {
          console.log(`ERROR: invalid value "${options.match}" for option.match. It should be one of following: ${valid.join(", ")}.`);
        }
        this.options = options;
        if (!TsUtils.isPlainObject(options.selected)) options.selected = {};
        this.selected = options.selected;
        query17(this.el).attr("autocapitalize", "off").attr("autocomplete", "off").attr("autocorrect", "off").attr("spellcheck", "false");
        if (options.selected.text != null) {
          query17(this.el).val(options.selected.text);
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
        options = TsUtils.extend({}, defaults, options, { suffix: "" });
        if (typeof options.items == "function") {
          options._items_fun = options.items;
        }
        const valid = ["is", "begins", "contains", "ends"];
        if (!valid.includes(options.match)) {
          console.log(`ERROR: invalid value "${options.match}" for option.match. It should be one of following: ${valid.join(", ")}.`);
        }
        options.items = TsUtils.normMenu.call(this, options.items, options);
        options.selected = TsUtils.normMenu.call(this, options.selected, options);
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
        options = TsUtils.extend({}, defaults, options);
        this.options = options;
        if (!Array.isArray(options.selected)) options.selected = [];
        this.selected = options.selected;
        if (query17(this.el).attr("placeholder") == null) {
          query17(this.el).attr("placeholder", TsUtils.lang("Attach files by dragging and dropping or Click to Select"));
        }
        break;
      }
      default: {
        console.log(`ERROR: field type "${this.type}" is not supported.`);
        break;
      }
    }
    const $elInit = query17(this.el);
    $elInit.css("box-sizing", "border-box");
    $elInit.addClass("TsField tsg-input").off(".TsField").on("change.TsField", (event2) => {
      this.change(event2);
    }).on("click.TsField", (event2) => {
      this.click(event2);
    }).on("focus.TsField", (event2) => {
      this.focus(event2);
    }).on("blur.TsField", (event2) => {
      if (this.type !== "list") this.blur(event2);
    }).on("keydown.TsField", (event2) => {
      this.keyDown(event2);
    }).on("keyup.TsField", (event2) => {
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
      ret = query17(this.el).val();
    }
    return ret;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(val, append) {
    if (["list", "enum", "file"].indexOf(this.type) !== -1) {
      const overlay = TsMenu2.get(this.el.id + "_menu");
      overlay?.hide();
      if (this.type !== "list" && append) {
        if (!Array.isArray(this.selected)) this.selected = [];
        this.selected.push(val);
        if (overlay) overlay.options.selected = this.selected;
        query17(this.el).trigger("input").trigger("change");
      } else {
        if (val == null) val = [];
        const it = this.type === "enum" && !Array.isArray(val) ? [val] : val;
        this.selected = it;
        query17(this.el).trigger("input").trigger("change");
      }
      this.refresh();
    } else {
      query17(this.el).val(val);
    }
  }
  setIndex(ind, append) {
    if (["list", "enum"].indexOf(this.type) !== -1) {
      const overlay = TsMenu2.get(this.el.id + "_menu");
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
        query17(this.el).trigger("input").trigger("change");
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
      query17(this.helpers.suffix).find(":scope > div").css("background-color", color);
    }
    if (this.type == "list") {
      if (this.helpers.prefix) query17(this.helpers.prefix).hide();
      if (!this.helpers.search) return Date.now() - time;
      if (this.selected == null && options.icon) {
        options.prefix = `
                    <span class="tsg-icon ${options.icon} "style="cursor: pointer; font-size: 14px;
                        display: inline-block; margin-top: -1px; color: #7F98AD; ${options.iconStyle}">
                    </span>`;
        this.addPrefix();
      } else {
        options.prefix = "";
        this.addPrefix();
      }
      const focus2 = query17(this.helpers.search_focus);
      const icon = query17(focus2.get(0).previousElementSibling);
      focus2.css({ outline: "none" });
      if (focus2.val() === "") {
        focus2.css("opacity", 0);
        icon.css("opacity", 0);
        if (this.selected?.id != null) {
          const text = this.selected.text;
          const ind = this.findItemIndex(options.items, this.selected.id);
          if (text != null) {
            ;
            query17(this.el).val(TsUtils.lang(text)).data({
              selected: text,
              selectedIndex: ind[0]
            });
          }
        } else {
          this.el.value = "";
          query17(this.el).removeData("selected selectedIndex");
        }
      } else {
        focus2.css("opacity", 1);
        icon.css("opacity", 1);
        query17(this.el).val("");
        setTimeout(() => {
          if (this.helpers.prefix) query17(this.helpers.prefix).hide();
          if (options.icon) {
            focus2.css("margin-left", "17px");
            query17(this.helpers.search).find(".tsg-icon-search").addClass("show-search");
          } else {
            focus2.css("margin-left", "0px");
            query17(this.helpers.search).find(".tsg-icon-search").removeClass("show-search");
          }
        }, 1);
      }
      if (query17(this.el).prop("readOnly") || query17(this.el).prop("disabled")) {
        setTimeout(() => {
          if (this.helpers.prefix) query17(this.helpers.prefix).css("opacity", "0.6");
          if (this.helpers.suffix) query17(this.helpers.suffix).css("opacity", "0.6");
        }, 1);
      } else {
        setTimeout(() => {
          if (this.helpers.prefix) query17(this.helpers.prefix).css("opacity", "1");
          if (this.helpers.suffix) query17(this.helpers.suffix).css("opacity", "1");
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
                        ${typeof options.renderItem === "function" ? options.renderItem(it, ind, `<div class="tsg-list-remove" index="${ind}">&#160;&#160;</div>`) : `
                               ${it.icon ? `<span class="tsg-icon ${it.icon}"></span>` : ""}
                               <div class="tsg-list-remove" index="${ind}">&#160;&#160;</div>
                               ${(this.type === "enum" ? it.text : it.name) ?? it.id ?? it}
                               ${it.size ? `<span class="file-size"> - ${TsUtils.formatSize(it.size)}</span>` : ""}
                            `}
                        </div>`;
        });
      }
      const ul = div.find(".tsg-multi-items");
      if (options.style) {
        div.attr("style", div.attr("style") + ";" + options.style);
      }
      query17(this.el).css("z-index", "-1");
      if (query17(this.el).prop("readOnly") || query17(this.el).prop("disabled")) {
        setTimeout(() => {
          div.get(0).scrollTop = 0;
          div.addClass("tsg-readonly").find(".li-item").css("opacity", "0.9");
          div.find(".li-item").parent().find(".li-search").hide().find("input").prop("readOnly", true).closest(".tsg-multi-items").find(".tsg-list-remove").hide();
        }, 1);
      } else {
        setTimeout(() => {
          div.removeClass("tsg-readonly").find(".li-item").css("opacity", "1");
          div.find(".li-item").parent().find(".li-search").show().find("input").prop("readOnly", false).closest(".tsg-multi-items").find(".tsg-list-remove").show();
        }, 1);
      }
      if (this.selected?.length > 0) {
        query17(this.el).attr("placeholder", "");
      }
      div.find(".tsg-enum-placeholder").remove();
      ul.find(".li-item").remove();
      if (html !== "") {
        ul.prepend(html);
      } else if (query17(this.el).attr("placeholder") != null && div.find("input").val() === "") {
        const style = TsUtils.stripSpaces(`
                    padding-top: ${styles["padding-top"]};
                    padding-left: ${styles["padding-left"]};
                    box-sizing: ${styles["box-sizing"]};
                    line-height: ${styles["line-height"]};
                    font-size: ${styles["font-size"]};
                    font-family: ${styles["font-family"]};
                `);
        div.prepend(`<div class="tsg-enum-placeholder" style="${style}">${query17(this.el).attr("placeholder")}</div>`);
      }
      div.off(".w2item").on("scroll.w2item", (event2) => {
        const edata = this.trigger("scroll", { target: this.el, originalEvent: event2 });
        if (edata.isCancelled === true) return;
        TsTooltip2.hide(this.el.id + "_preview");
        edata.finish();
      }).find(".li-item").on("click.w2item", (event2) => {
        const mouseEvent = event2;
        const target = query17(mouseEvent.target).closest(".li-item");
        const index = target.attr("index");
        const item = index != null ? this.selected[Number(index)] : void 0;
        if (query17(target).hasClass("li-search")) return;
        mouseEvent.stopPropagation();
        let edata;
        if (query17(mouseEvent.target).hasClass("tsg-list-remove")) {
          if (query17(this.el).prop("readOnly") || query17(this.el).prop("disabled")) return;
          edata = this.trigger("remove", { target: this.el, originalEvent: mouseEvent, item });
          if (edata.isCancelled === true) return;
          const transfer = new DataTransfer();
          const input = query17(mouseEvent.target).closest(".tsg-list").find("input.file-input").get(0);
          if (input) {
            Array.from(input.files ?? []).filter((f) => f.name != item.name).forEach((f) => transfer.items.add(f));
            input.files = transfer.files;
          }
          if (index != null) this.selected.splice(Number(index), 1);
          query17(this.el).trigger("input").trigger("change");
          query17(mouseEvent.target).remove();
        } else {
          edata = this.trigger("click", { target: this.el, originalEvent: mouseEvent.originalEvent, item });
          if (edata.isCancelled === true) return;
          let preview = item.tooltip;
          if (this.type === "file") {
            if (/image/i.test(item.type)) {
              preview = `
                                    <div class="tsg-file-preview">
                                        <img src="${item.content ? "data:" + item.type + ";base64," + item.content : ""}"
                                            style="max-width: 300px">
                                    </div>`;
            }
            preview += `
                                <div class="tsg-file-info">
                                    <div class="file-caption">${TsUtils.lang("Name")}:</div>
                                    <div class="file-value">${item.name}</div>
                                    <div class="file-caption">${TsUtils.lang("Size")}:</div>
                                    <div class="file-value">${TsUtils.formatSize(item.size)}</div>
                                    <div class="file-caption">${TsUtils.lang("Type")}:</div>
                                    <div class="file-value file-type">${item.type}</div>
                                    <div class="file-caption">${TsUtils.lang("Modified")}:</div>
                                    <div class="file-value">${TsUtils.date(item.modified)}</div>
                                </div>`;
          }
          if (preview) {
            const name = this.el.id + "_preview";
            TsTooltip2.show({
              name,
              anchor: target.get(0),
              html: preview,
              hideOn: ["doc-click"],
              class: ""
            }).show((_event) => {
              const $img = query17(`#w2overlay-${name} img`);
              $img.on("load", function(_event2) {
                const w = this.clientWidth;
                const h = this.clientHeight;
                if (w < 300 && h < 300) return;
                if (w >= h && w > 300) query17(this).css("width", "300px");
                if (w < h && h > 300) query17(this).css("height", "300px");
              }).on("error", function(_event2) {
                this.style.display = "none";
              });
            });
          }
        }
        edata.finish();
      }).on("mouseenter.w2item", (event2) => {
        const mouseEvent = event2;
        const target = query17(mouseEvent.target).closest(".li-item");
        if (query17(target).hasClass("li-search")) return;
        const idx = query17(mouseEvent.target).attr("index");
        const item = idx != null ? this.selected[Number(idx)] : void 0;
        const edata = this.trigger("mouseEnter", { target: this.el, originalEvent: mouseEvent, item });
        if (edata.isCancelled === true) return;
        edata.finish();
      }).on("mouseleave.w2item", (event2) => {
        const mouseEvent = event2;
        const target = query17(mouseEvent.target).closest(".li-item");
        if (query17(target).hasClass("li-search")) return;
        const idx = query17(mouseEvent.target).attr("index");
        const item = idx != null ? this.selected[Number(idx)] : void 0;
        const edata = this.trigger("mouseLeave", { target: this.el, originalEvent: mouseEvent, item });
        if (edata.isCancelled === true) return;
        edata.finish();
      });
      if (this.type === "enum") {
        const search2 = this.helpers.multi?.find("input");
        search2?.css({ width: "15px" });
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
    const focus2 = this.helpers.search;
    const multi = this.helpers.multi;
    const suffix = this.helpers.suffix;
    const prefix = this.helpers.prefix;
    if (focus2) {
      query17(focus2).css("width", width);
    }
    if (multi) {
      query17(multi).css("width", width - parseInt(styles["margin-left"], 10) - parseInt(styles["margin-right"], 10));
    }
    if (suffix) {
      this.addSuffix();
    }
    if (prefix) {
      this.addPrefix();
    }
    const div = this.helpers.multi;
    if (["enum", "file"].includes(this.type) && div) {
      query17(this.el).css("height", "");
      let cntHeight = query17(div).find(":scope div.tsg-multi-items").get(0).clientHeight + 5;
      if (cntHeight < 20) cntHeight = 20;
      if (this.tmp["max-height"] != null && cntHeight > this.tmp["max-height"]) {
        cntHeight = this.tmp["max-height"] ?? cntHeight;
      }
      if (this.tmp["min-height"] != null && cntHeight < this.tmp["min-height"]) {
        cntHeight = this.tmp["min-height"] ?? cntHeight;
      }
      const inpHeight = TsUtils.getSize(this.el, "height") - 2;
      if (inpHeight > cntHeight) cntHeight = inpHeight;
      query17(div).css({
        "height": cntHeight + "px",
        overflow: cntHeight == this.tmp["max-height"] ? "auto" : "hidden"
      });
      query17(div).css("height", cntHeight + "px");
      query17(this.el).css({ "height": cntHeight + "px" });
    }
    this.tmp.current_width = width;
  }
  reset() {
    if (this.tmp != null) {
      query17(this.el).css("height", "");
      ["padding-left", "padding-right", "background-color", "border-color"].forEach((prop) => {
        if (this.tmp && this.tmp["old-" + prop] != null) {
          query17(this.el).css(prop, this.tmp["old-" + prop]);
          delete this.tmp["old-" + prop];
        }
      });
      clearInterval(this.tmp.sizeTimer);
    }
    ;
    query17(this.el).val(this.clean(query17(this.el).val())).removeClass("TsField tsg-input").removeData("selected selectedIndex").off(".TsField");
    Object.keys(this.helpers).forEach((key) => {
      query17(this.helpers[key]).remove();
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
      if (val !== "" && TsUtils.isFloat(val)) val = Number(val);
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
          val = TsUtils.formatNumber(val, options.currency.precision, true);
          if (val !== "") val = options.currency.prefix + val + options.currency.suffix;
          break;
        case "percent":
          val = TsUtils.formatNumber(val, options.precision, true);
          if (val !== "") val += "%";
          break;
        case "float":
          val = TsUtils.formatNumber(val, options.precision, true);
          break;
        case "int":
          val = TsUtils.formatNumber(val, 0, true);
          break;
      }
      const group = 1e3.toLocaleString(TsUtils.settings.locale, { useGrouping: true }).slice(1, 2);
      if (group !== this.options.groupSymbol) {
        val = val.replaceAll(group, this.options.groupSymbol);
      }
    }
    return val;
  }
  change(event2) {
    if (["int", "float", "money", "currency", "percent"].indexOf(this.type) !== -1) {
      const val = query17(this.el).val();
      const new_val = this.format(this.clean(query17(this.el).val()));
      if (val !== "" && val != new_val) {
        query17(this.el).val(new_val);
        event2.stopPropagation();
        event2.preventDefault();
        return false;
      }
    }
    if (this.type === "color") {
      let color = query17(this.el).val();
      if (color.substr(0, 3).toLowerCase() !== "rgb") {
        color = "#" + color;
        const len = query17(this.el).val().length;
        if (len !== 8 && len !== 6 && len !== 3) color = "";
      }
      const next = query17(this.el).get(0).nextElementSibling;
      query17(next).find("div").css("background-color", color);
      if (query17(this.el).hasClass("has-focus")) {
        this.updateOverlay();
      }
    }
    if (["list", "enum", "file"].indexOf(this.type) !== -1) {
      this.refresh();
    }
    if (["date", "time", "datetime"].indexOf(this.type) !== -1) {
      let tmp = parseInt(this.el.value);
      if (TsUtils.isInt(this.el.value) && tmp > 3e3) {
        if (this.type === "time") tmp = TsUtils.formatTime(new Date(tmp), this.options.format);
        if (this.type === "date") tmp = TsUtils.formatDate(new Date(tmp), this.options.format);
        if (this.type === "datetime") tmp = TsUtils.formatDateTime(new Date(tmp), this.options.format);
        query17(this.el).val(String(tmp)).trigger("input").trigger("change");
      }
    }
  }
  click(event2) {
    if (["list", "combo", "enum"].includes(this.type)) {
      if (!query17(this.el).hasClass("has-focus")) {
        this.focus(event2);
      }
      if (this.type == "list" || this.type == "combo") {
        if (!this.tmp.openedOnFocus) {
          const name = this.el.id + "_menu";
          const overlay = TsMenu2.get(name);
          if (overlay?.displayed) {
            TsMenu2.hide(name);
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
      if (event2.showMenu !== false && this.options.openOnFocus !== false && query17(this.el).hasClass("has-focus") && !this.tmp.overlay?.overlay?.displayed) {
        setTimeout(() => {
          this.tmp.openedOnFocus = true;
          this.updateOverlay();
        }, 0);
      }
      return;
    }
    if (["color", "date", "time", "datetime"].indexOf(this.type) !== -1) {
      if (query17(this.el).prop("readOnly") || query17(this.el).prop("disabled")) return;
      this.updateOverlay();
    }
    if (["list", "combo", "enum"].indexOf(this.type) !== -1) {
      if (query17(this.el).prop("readOnly") || query17(this.el).prop("disabled")) {
        query17(this.el).addClass("has-focus");
        return;
      }
      if (typeof this.options._items_fun == "function") {
        ;
        this.options.items = TsUtils.normMenu.call(this, this.options._items_fun, this.options);
      }
      if (this.helpers.search) {
        const search2 = this.helpers.search_focus;
        if (search2) {
          search2.value = "";
          search2.select();
        }
      }
      if (this.type == "enum") {
        const search2 = query17(this.el.previousElementSibling).find(".li-search input").get(0);
        if (document.activeElement !== search2) {
          search2.focus();
        }
      }
      this.resize();
      if (event2.showMenu !== false && this.options.openOnFocus !== false && query17(this.el).hasClass("has-focus") && !this.tmp.overlay?.overlay?.displayed) {
        setTimeout(() => {
          this.tmp.openedOnFocus = true;
          this.updateOverlay();
        }, 0);
      }
    }
    if (this.type == "file") {
      const prev = query17(this.el).get(0).previousElementSibling;
      query17(prev).addClass("has-focus");
    }
    query17(this.el).addClass("has-focus");
  }
  blur(_event) {
    const val = query17(this.el).val().trim();
    query17(this.el).removeClass("has-focus");
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
          query17(this.el).val(newVal).trigger("input").trigger("change");
          if (error) {
            TsTooltip2.show({
              name: this.el.id + "_error",
              anchor: this.el,
              html: error
            });
            setTimeout(() => {
              TsTooltip2.hide(this.el.id + "_error");
            }, 3e3);
          }
        }
      }
    }
    if (["date", "time", "datetime"].includes(this.type) && this.options.autoCorrect) {
      if (val !== "") {
        const check = this.type == "date" ? TsUtils.isDate : this.type == "time" ? TsUtils.isTime : TsUtils.isDateTime;
        if (!TsDate2.inRange(this.el.value, this.options) || !check.bind(TsUtils)(this.el.value, this.options.format)) {
          ;
          query17(this.el).val("").trigger("input").trigger("change");
        }
      }
    }
    if (this.type === "enum") {
      ;
      query17(this.helpers.multi).find("input").val("").css("width", "15px");
    }
    if (this.type == "file") {
      const prev = this.el.previousElementSibling;
      query17(prev).removeClass("has-focus");
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
      if (!options.keyboard || query17(this.el).prop("readOnly") || query17(this.el).prop("disabled")) return;
      val = parseFloat(query17(this.el).val().replace(options.moneyRE, "")) || 0;
      inc = options.step;
      if (event2.ctrlKey || event2.metaKey) inc = options.step * 10;
      switch (key) {
        case 38:
          if (event2.shiftKey) break;
          newValue = val + inc <= options.max || options.max == null ? Number((val + inc).toFixed(12)) : options.max;
          query17(this.el).val(String(newValue)).trigger("input").trigger("change");
          cancel = true;
          break;
        case 40:
          if (event2.shiftKey) break;
          newValue = val - inc >= options.min || options.min == null ? Number((val - inc).toFixed(12)) : options.min;
          query17(this.el).val(String(newValue)).trigger("input").trigger("change");
          cancel = true;
          break;
      }
      if (cancel) {
        event2.preventDefault();
        this.moveCaret2end();
      }
    }
    if (["date", "datetime"].includes(this.type)) {
      if (!options.keyboard || query17(this.el).prop("readOnly") || query17(this.el).prop("disabled")) return;
      const is = (this.type == "date" ? TsUtils.isDate : TsUtils.isDateTime).bind(TsUtils);
      const format = (this.type == "date" ? TsUtils.formatDate : TsUtils.formatDateTime).bind(TsUtils);
      daymil = 24 * 60 * 60 * 1e3;
      inc = 1;
      if (event2.ctrlKey || event2.metaKey) inc = 10;
      dt = is(query17(this.el).val(), options.format, true);
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
          query17(this.el).val(newDT).trigger("input").trigger("change");
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
          query17(this.el).val(newDT).trigger("input").trigger("change");
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
      if (!options.keyboard || query17(this.el).prop("readOnly") || query17(this.el).prop("disabled")) return;
      inc = event2.ctrlKey || event2.metaKey ? 60 : 1;
      val = query17(this.el).val();
      let time = TsDate2.str2min(val) || TsDate2.str2min((/* @__PURE__ */ new Date()).getHours() + ":" + ((/* @__PURE__ */ new Date()).getMinutes() - 1));
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
        query17(this.el).val(TsDate2.min2str(time)).trigger("input").trigger("change");
        this.moveCaret2end();
      }
    }
    if (["list", "enum"].includes(this.type)) {
      switch (key) {
        case 8:
        // delete
        case 46:
          if (this.type == "list") {
            const search2 = query17(this.helpers.search_focus);
            if (search2.val() == "") {
              const edata = this.trigger("remove", { target: this.el, originalEvent: event2, item: this.selected });
              if (edata.isCancelled === true) return;
              this.selected = null;
              TsMenu2.hide(this.el.id + "_menu");
              query17(this.el).val("").trigger("input").trigger("change");
              edata.finish();
            }
          } else {
            const search2 = query17(this.helpers.multi).find("input");
            if (search2.val() == "") {
              const edata = this.trigger("remove", { target: this.el, originalEvent: event2, item: this.selected[this.selected.length - 1] });
              if (edata.isCancelled === true) return;
              TsMenu2.hide(this.el.id + "_menu");
              this.selected.pop();
              const overlay = TsMenu2.get(this.el.id + "_menu");
              if (overlay) overlay.options.selected = this.selected;
              this.refresh();
              edata.finish();
            }
          }
          break;
        case 9:
        // tab key
        case 16:
          TsMenu2.hide(this.el.id + "_menu");
          break;
        case 27:
          TsMenu2.hide(this.el.id + "_menu");
          this.refresh();
          break;
        default: {
        }
      }
    }
  }
  keyUp(event2) {
    if (this.type == "list") {
      const search2 = query17(this.helpers.search_focus);
      if (search2.val() !== "") {
        query17(this.el).attr("placeholder", "");
      } else {
        query17(this.el).attr("placeholder", this.tmp.pholder);
      }
      if (event2.keyCode == 13) {
        setTimeout(() => {
          search2.val("");
          TsMenu2.hide(this.el.id + "_menu");
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
      const search2 = this.helpers.multi?.find("input");
      const styles = getComputedStyle(search2?.get(0));
      const width = TsUtils.getStrWidth(
        search2?.val(),
        `font-family: ${styles["font-family"]}; font-size: ${styles["font-size"]};`,
        void 0
      );
      search2?.css({ width: width + 15 + "px" });
      this.resize();
      if ([8, 46, 9, 16, 27].includes(event2.keyCode)) {
        if (this.tmp.overlay?.overlay?.displayed) {
          TsMenu2.hide(this.el.id + "_menu");
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
      const overlay = TsMenu2.get(this.el.id + "_menu");
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
      if (query17(this.el).prop("readOnly") || query17(this.el).prop("disabled")) return;
      TsColor2.show(TsUtils.extend({
        name: this.el.id + "_color",
        anchor: this.el,
        transparent: options.transparent,
        advanced: options.advanced,
        color: this.el.value,
        liveUpdate: true
      }, this.options)).select((event2) => {
        const color = event2.detail["color"];
        query17(this.el).val(color).trigger("input").trigger("change");
      }).liveUpdate((event2) => {
        const color = event2.detail["color"];
        query17(this.helpers.suffix).find(":scope > div").css("background-color", "#" + color);
      });
    }
    if (["list", "combo", "enum"].includes(this.type)) {
      let el = this.el;
      let input = this.el;
      if (this.type === "enum") {
        el = this.helpers.multi?.get(0) ?? this.el;
        input = query17(el).find("input").get(0) ?? this.el;
      }
      if (this.type === "list") {
        const sel = this.selected;
        if (TsUtils.isPlainObject(sel) && Object.keys(sel).length > 0) {
          const ind = this.findItemIndex(options.items, sel.id);
          if (ind.length > 0) {
            options.index = ind;
          }
        }
        input = this.helpers.search_focus ?? this.el;
      }
      if (query17(this.el).hasClass("has-focus") && !this.el.readOnly && !this.el.disabled) {
        params = TsUtils.extend({}, options, {
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
        this.tmp.overlay = TsMenu2.show(params).select((event2) => {
          if (["list", "combo"].includes(this.type)) {
            this.selected = event2.detail["item"];
            query17(input).val("");
            query17(this.el).val(this.selected.text).trigger("input").trigger("change");
            this.focus({ showMenu: false });
          } else {
            const selected = this.selected;
            const newItem = event2.detail?.["item"];
            if (newItem) {
              const edata = this.trigger("add", { target: this.el, item: newItem, originalEvent: event2 });
              if (edata.isCancelled === true) return;
              if (selected.length >= options.max && options.max > 0) selected.pop();
              delete newItem.hidden;
              selected.push(newItem);
              query17(this.el).trigger("input").trigger("change");
              query17(this.helpers.multi).find("input").val("");
              const overlay = TsMenu2.get(this.el.id + "_menu");
              if (overlay) overlay.options.selected = this.selected;
              edata.finish();
            }
          }
        });
      }
    }
    if (["date", "time", "datetime"].includes(this.type)) {
      if (query17(this.el).prop("readOnly") || query17(this.el).prop("disabled")) return;
      TsDate2.show(TsUtils.extend({
        name: this.el.id + "_date",
        anchor: this.el,
        value: this.el.value
      }, this.options)).select((event2) => {
        const date = event2.detail["date"];
        if (date != null) {
          ;
          query17(this.el).val(date).trigger("input").trigger("change");
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
          isValid = TsUtils.isInt(ch.replace(this.options.numberRE, ""));
        }
        break;
      case "percent":
        ch = ch.replace(/%/g, "");
      // falls through to float
      case "float":
        if (loose && ["-", "", this.options.decimalSymbol, this.options.groupSymbol].includes(ch)) {
          isValid = true;
        } else {
          isValid = TsUtils.isFloat(ch.replace(this.options.numberRE, ""));
        }
        break;
      case "money":
      case "currency":
        if (loose && [
          "-",
          this.options.decimalSymbol,
          this.options.groupSymbol,
          this.options.currency.prefix,
          // any: cast-to-any for dynamic dispatch; TsField instance shape varies by `type` (text/list/date/color/etc) at runtime
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          this.options.currency.suffix
        ].includes(ch)) {
          isValid = true;
        } else {
          isValid = TsUtils.isFloat(ch.replace(this.options.moneyRE, ""));
        }
        break;
      case "bin":
        isValid = TsUtils.isBin(ch);
        break;
      case "color":
      case "hex":
        isValid = TsUtils.isHex(ch);
        break;
      case "alphanumeric":
        isValid = TsUtils.isAlphaNumeric(ch);
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
    if (this.helpers.prefix) query17(this.helpers.prefix).remove();
    query17(this.el).before(`<div class="tsg-field-helper">${this.options.prefix}</div>`);
    const helper = query17(this.el).get(0).previousElementSibling;
    query17(helper).css({
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
    query17(this.el).css("padding-left", helper.clientWidth + "px !important");
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
      if (this.helpers.arrows) query17(this.helpers.arrows).remove();
      query17(this.el).after(
        '<div class="tsg-field-helper" style="border: 1px solid transparent">&#160;    <div class="tsg-field-up" type="up">        <div class="arrow-up" type="up"></div>    </div>    <div class="tsg-field-down" type="down">        <div class="arrow-down" type="down"></div>    </div></div>'
      );
      const arrowHelper = query17(this.el).get(0).nextElementSibling;
      const $arrowHelper = query17(arrowHelper);
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
        if (query17(mouseEvent.target).hasClass("arrow-up")) {
          this.keyDown(mouseEvent, { keyCode: 38 });
        }
        if (query17(mouseEvent.target).hasClass("arrow-down")) {
          this.keyDown(mouseEvent, { keyCode: 40 });
        }
      });
      pr += arrowHelper.clientWidth;
      query17(this.el).css("padding-right", pr + "px !important");
      this.helpers.arrows = arrowHelper;
    }
    if (this.options.suffix !== "") {
      if (this.helpers.suffix) query17(this.helpers.suffix).remove();
      query17(this.el).after(`<div class="tsg-field-helper">${this.options.suffix}</div>`);
      const suffixHelper = query17(this.el).get(0).nextElementSibling;
      query17(suffixHelper).css({
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
      query17(this.el).css("padding-right", suffixHelper.clientWidth + "px !important");
      this.helpers.suffix = suffixHelper;
    }
  }
  // Only used for list
  addSearch() {
    if (this.type !== "list") return;
    if (this.helpers.search) query17(this.helpers.search).remove();
    let tabIndex = parseInt(query17(this.el).attr("tabIndex"));
    if (!isNaN(tabIndex) && tabIndex !== -1) this.tmp["old-tabIndex"] = tabIndex;
    if (this.tmp["old-tabIndex"]) tabIndex = this.tmp["old-tabIndex"];
    if (tabIndex == null || isNaN(tabIndex)) tabIndex = 0;
    let searchId = "";
    if (query17(this.el).attr("id") != null) {
      searchId = 'id="' + query17(this.el).attr("id") + '_search"';
    }
    const html = `
            <div class="tsg-field-helper">
                <span class="tsg-icon tsg-icon-search"></span>
                <input ${searchId} type="text" tabIndex="${tabIndex}" ${query17(this.el).prop("readOnly") ? "readonly" : ""}
                    autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"/>
            </div>`;
    query17(this.el).attr("tabindex", String(-1)).before(html);
    const helper = query17(this.el).get(0).previousElementSibling;
    this.helpers.search = helper;
    this.helpers.search_focus = query17(helper).find("input").get(0);
    const styles = getComputedStyle(this.el);
    const $helperSearch = query17(helper);
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
    query17(helper).find("input").off(".tsg-helper").on("focus.tsg-helper", (event2) => {
      const focusEvent = event2;
      query17(focusEvent.target).val("");
      this.tmp.pholder = query17(this.el).attr("placeholder") ?? "";
      this.focus(focusEvent);
      focusEvent.stopPropagation();
    }).on("blur.tsg-helper", (event2) => {
      const focusEvent = event2;
      query17(focusEvent.target).val("");
      if (this.tmp.pholder != null) query17(this.el).attr("placeholder", this.tmp.pholder);
      this.blur(focusEvent);
      focusEvent.stopPropagation();
    }).on("keydown.tsg-helper", (event2) => {
      this.keyDown(event2);
    }).on("keyup.tsg-helper", (event2) => {
      this.keyUp(event2);
    });
    query17(helper).off(".tsg-helper").on("click.tsg-helper", (_event) => {
      query17(helper).find("input").get(0).focus();
    });
  }
  // Used in enum/file
  addMultiSearch() {
    if (!["enum", "file"].includes(this.type)) {
      return;
    }
    query17(this.helpers.multi).remove();
    let html = "";
    const styles = getComputedStyle(this.el);
    const margin = TsUtils.stripSpaces(`
            margin-top: 0px;
            margin-bottom: 0px;
            margin-left: ${styles["margin-left"]};
            margin-right: ${styles["margin-right"]};
            width: ${TsUtils.getSize(this.el, "width") - parseInt(styles["margin-left"], 10) - parseInt(styles["margin-right"], 10)}px;
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
    if (query17(this.el).attr("id") != null) {
      searchId = `id="${query17(this.el).attr("id")}_search"`;
    }
    let tabIndex = parseInt(query17(this.el).attr("tabIndex"));
    if (!isNaN(tabIndex) && tabIndex !== -1) this.tmp["old-tabIndex"] = tabIndex;
    if (this.tmp["old-tabIndex"]) tabIndex = this.tmp["old-tabIndex"];
    if (tabIndex == null || isNaN(tabIndex)) tabIndex = 0;
    if (this.type === "enum") {
      html = `
            <div class="tsg-field-helper tsg-list" style="${margin}">
                <div class="tsg-multi-items">
                    <div class="li-search">
                        <input ${searchId} type="text" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                            tabindex="${tabIndex}"
                            ${query17(this.el).prop("readOnly") ? "readonly" : ""}
                            ${query17(this.el).prop("disabled") ? "disabled" : ""}>
                    </div>
                </div>
            </div>`;
    }
    if (this.type === "file") {
      html = `
            <div class="tsg-field-helper tsg-list" style="${margin}">
                <div class="tsg-multi-file">
                    <input name="attachment" class="file-input" type="file" tabindex="-1"'
                        style="width: 100%; height: 100%; opacity: 0" title=""
                        ${this.options.max !== 1 ? "multiple" : ""}
                        ${query17(this.el).prop("readOnly") || query17(this.el).prop("disabled") ? "disabled" : ""}
                        ${query17(this.el).attr("accept") ? ' accept="' + query17(this.el).attr("accept") + '"' : ""}>
                </div>
                <div class="tsg-multi-items">
                    <div class="li-search" style="display: none">
                        <input ${searchId} type="text" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                            tabindex="${tabIndex}"
                            ${query17(this.el).prop("readOnly") ? "readonly" : ""}
                            ${query17(this.el).prop("disabled") ? "disabled" : ""}>
                    </div>
                </div>
            </div>`;
    }
    this.tmp["old-background-color"] = styles["background-color"];
    this.tmp["old-border-color"] = styles["border-color"];
    query17(this.el).before(html).css({
      "border-color": "transparent",
      "background-color": "transparent"
    });
    const div = query17(this.el.previousElementSibling);
    this.helpers.multi = div;
    query17(this.el).attr("tabindex", String(-1));
    div.on("mousedown", (event2) => {
      query17(event2.target).addClass("has-focus");
    }).on("mouseup", (event2) => {
      query17(event2.target).removeClass("has-focus");
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
        if (query17(this.el).prop("readOnly") || query17(this.el).prop("disabled")) return;
        this.focus(mouseEvent);
      }).on("dragenter.drag", (_event) => {
        if (query17(this.el).prop("readOnly") || query17(this.el).prop("disabled")) return;
        div.addClass("tsg-file-dragover");
      }).on("dragleave.drag", (_event) => {
        if (query17(this.el).prop("readOnly") || query17(this.el).prop("disabled")) return;
        div.removeClass("tsg-file-dragover");
      }).on("drop.drag", (event2) => {
        const dragEvent = event2;
        if (query17(this.el).prop("readOnly") || query17(this.el).prop("disabled")) return;
        div.removeClass("tsg-file-dragover");
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
          errors.push(TsUtils.lang('The file "${name}" (${size}) is already added.', {
            name: file.name,
            size: String(TsUtils.formatSize(file.size))
          }));
        }
        size += item.size;
        cnt++;
      });
    }
    if (options.maxFileSize !== 0 && newItem.size > options.maxFileSize) {
      errors.push(TsUtils.lang("Maximum file size is ${size}", { size: String(TsUtils.formatSize(options.maxFileSize)) }));
    }
    if (options.maxSize !== 0 && size + newItem.size > options.maxSize) {
      errors.push(TsUtils.lang("Maximum total size is ${size}", { size: String(TsUtils.formatSize(options.maxSize)) }));
    }
    if (options.max !== 0 && cnt >= options.max) {
      errors.push(TsUtils.lang("Maximum number of files is ${count}", { count: options.max }));
    }
    const edata = this.trigger("add", { target: this.el, file: newItem, total: cnt, totalSize: size, errors });
    if (edata.isCancelled === true) return;
    if (errors.length > 0) {
      if (options.showErrors) {
        TsTooltip2.show({
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
        query17(this.el).trigger("input").trigger("change");
        edata.finish();
      };
      reader.readAsDataURL(file);
    } else {
      this.refresh();
      query17(this.el).trigger("input").trigger("change");
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

// src/grid-edit.ts
var query18 = query;
var TsTooltip3 = TsTooltip;
function editField(grid, recid, column, value, event2) {
  const self = grid;
  if (grid.last.inEditMode === true) {
    if (event2 && event2.keyCode == 13) {
      const { index: index2, column: column2, value: value2 } = grid.last._edit;
      grid.editChange({ type: "custom", value: value2 }, index2, column2, event2);
      grid.editDone(index2, column2, event2);
    } else {
      const input2 = query18(grid.box).find("div.tsg-edit-box .tsg-input");
      if (input2.length > 0) {
        if (input2.get(0).tagName == "DIV") {
          input2.text(input2.text() + value);
          TsUtils.setCursorPosition(input2.get(0), input2.text().length);
        } else {
          input2.val(input2.val() + value);
          TsUtils.setCursorPosition(input2.get(0), input2.val().length);
        }
      }
    }
    return;
  }
  const index = grid.get(recid, true);
  if (index == null) return;
  const edit = grid.getCellEditable(index, column);
  if (!edit || ["checkbox", "check"].includes(edit.type)) return;
  const rec = grid.records[index];
  const col = grid.columns[column];
  const prefix = col.frozen === true ? "_f" : "_";
  if (["enum", "file"].indexOf(edit.type) != -1) {
    console.log('ERROR: input types "enum" and "file" are not supported in inline editing.');
    return;
  }
  const edata = grid.trigger("editField", { target: grid.name, recid, column, value, index, originalEvent: event2 });
  if (edata.isCancelled === true) return;
  value = edata.detail["value"];
  grid.last.inEditMode = true;
  grid.last["editColumn"] = column;
  grid.last._edit = { value, index, column, recid };
  grid.selectNone(true);
  grid.select({ recid, column });
  const tr = query18(grid.box).find("#grid_" + grid.name + prefix + "rec_" + TsUtils.escapeId(recid));
  let div = tr.find('[col="' + column + '"] > div');
  grid.last._edit["tr"] = tr;
  grid.last._edit["div"] = div;
  query18(grid.box).find("div.tsg-edit-box").remove();
  if (grid.selectType != "row") {
    query18(grid.box).find("#grid_" + grid.name + prefix + "selection").attr("id", "grid_" + grid.name + "_editable").removeClass("tsg-selection").addClass("tsg-edit-box").prepend('<div style="position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;"></div>').find(".tsg-selection-resizer").remove();
    div = query18(grid.box).find("#grid_" + grid.name + "_editable > div:first-child");
  }
  edit.attr = edit.attr ?? "";
  edit.text = edit.text ?? "";
  edit.style = edit.style ?? "";
  edit.items = edit.items ?? [];
  let val = rec.TsUi?.["changes"]?.[col.field] != null ? TsUtils.stripTags(rec.TsUi["changes"][col.field]) : TsUtils.stripTags(self.parseField(rec, col.field));
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
  if (edit.items.length > 0 && !TsUtils.isPlainObject(edit.items[0])) {
    edit.items = TsUtils.normMenu(edit.items, edit);
  }
  let input;
  const dropTypes = ["date", "time", "datetime", "color", "list", "combo"];
  const styles = getComputedStyle(tr.find('[col="' + column + '"] > div').get(0));
  const font = `font-family: ${styles.getPropertyValue("font-family")}; font-size: ${styles.getPropertyValue("font-size")};`;
  switch (edit.type) {
    case "div": {
      div.addClass("tsg-editable").html(TsUtils.stripSpaces(`<div id="grid_${grid.name}_edit_${recid}_${column}" class="tsg-input tsg-focus"
                    contenteditable autocorrect="off" autocomplete="off" spellcheck="false"
                    style="${font + addStyle + edit.style}"
                    field="${col.field}" recid="${recid}" column="${column}" ${edit.attr}>
                </div>${edit.text}`));
      input = div.find("div.tsg-input").get(0);
      input.innerText = typeof val != "object" ? val : "";
      if (value != null) {
        TsUtils.setCursorPosition(input, input.innerText.length);
      } else {
        TsUtils.setCursorPosition(input, 0, input.innerText.length);
      }
      break;
    }
    default: {
      div.addClass("tsg-editable").html(TsUtils.stripSpaces(`<input id="grid_${grid.name}_edit_${recid}_${column}" class="tsg-input"
                    autocorrect="off" autocomplete="off" spellcheck="false" type="text"
                    style="${font + addStyle + edit.style}"
                    field="${col.field}" recid="${recid}" column="${column}" ${edit.attr}>${edit.text}`));
      input = div.find("input").get(0);
      if (edit.type == "number") {
        val = TsUtils.formatNumber(val);
      }
      if (edit.type == "date") {
        val = TsUtils.formatDate(TsUtils.isDate(val, edit.format, true) || /* @__PURE__ */ new Date(), edit.format);
      }
      input.value = typeof val != "object" ? val : "";
      const doHide = (event3) => {
        const escKey = grid.last._edit?.["escKey"];
        let selected = false;
        const name = query18(input).data("tooltipName");
        if (name && TsTooltip3.get(name[0])?.selected != null) {
          selected = true;
        }
        if (grid.last.inEditMode && !escKey && dropTypes.includes(edit.type) && (event3.detail.overlay.anchor?.id == grid.last._edit?.["input"]?.id || edit.type == "list")) {
          grid.editChange();
          grid.editDone(void 0, void 0, { keyCode: selected ? 13 : 0 });
        }
      };
      new TsField(TsUtils.extend({}, edit, {
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
  Object.assign(grid.last._edit, { input, edit });
  query18(input).off(".tsg-editable").on("blur.tsg-editable", (event3) => {
    if (grid.last.inEditMode) {
      const type = grid.last._edit?.["edit"]?.type;
      const name = query18(input).data("tooltipName");
      const et = event3.target;
      if (name && dropTypes.includes(type) || et?._keepOpen === true) {
        delete et._keepOpen;
        return;
      }
      grid.editChange(input, index, column, event3);
      grid.editDone();
    }
  }).on("mousedown.tsg-editable", (event3) => {
    event3.stopPropagation();
  }).on("click.tsg-editable", (event3) => {
    expand2.call(input, event3);
  }).on("paste.tsg-editable", (event3) => {
    event3.preventDefault();
    const text = event3.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  }).on("keyup.tsg-editable", (event3) => {
    expand2.call(input, event3);
  }).on("keydown.tsg-editable", (event3) => {
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
        const name = query18(input).data("tooltipName");
        if (name && name.length > 0) {
          if (grid.last._edit) grid.last._edit["escKey"] = true;
          TsTooltip3.hide(name[0]);
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
            grid.editChange(input, index, column, event3);
            grid.editDone(index, column, event3);
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
          const name = query18(input).data("tooltipName");
          if (name && TsTooltip3.get(name[0]).selected != null) {
            selected = true;
          }
          if ((!name || !selected) && input._keepOpen !== true) {
            grid.editChange(input, index, column, event3);
            grid.editDone(index, column, event3);
          } else {
            delete input._keepOpen;
          }
          break;
        }
        case 27: {
          if (grid.last._edit) grid.last._edit["escKey"] = false;
          let old = self.parseField(rec, col.field);
          if (rec.TsUi?.["changes"]?.[col.field] != null) old = rec.TsUi["changes"][col.field];
          if (input._prevValue != null) old = input._prevValue;
          if (input.tagName == "DIV") {
            input.innerText = old != null ? old : "";
          } else {
            input.value = old != null ? old : "";
          }
          grid.editDone(index, column, event3);
          setTimeout(() => {
            self.select({ recid, column });
          }, 1);
          break;
        }
      }
      expand2(input);
    }, 1);
  });
  if (input) input._prevValue = prevValue;
  if (edit.type != "list") {
    setTimeout(() => {
      if (!grid.last.inEditMode) return;
      if (input) {
        input.focus();
        clearTimeout(grid.last.kbd_timer ?? void 0);
        input.resize = expand2;
        expand2(input);
      }
    }, 50);
  }
  edata.finish({ input });
  return;
  function expand2(input2) {
    try {
      const styles2 = getComputedStyle(input2);
      const val2 = input2.tagName.toUpperCase() == "DIV" ? input2.innerText : input2.value;
      const editBox = query18(self.box).find("#grid_" + self.name + "_editable").get(0);
      const style = `font-family: ${styles2.getPropertyValue("font-family")}; font-size: ${styles2.getPropertyValue("font-size")}; white-space: no-wrap;`;
      const width = TsUtils.getStrWidth(val2, style);
      if (width + 20 > editBox.clientWidth) {
        query18(editBox).css("width", width + 20 + "px");
      }
    } catch (e) {
    }
  }
}
function editChange(grid, input, index, column, event2) {
  input = input ?? grid.last._edit?.["input"];
  index = index ?? grid.last._edit?.["index"];
  column = column ?? grid.last._edit?.["column"];
  event2 = event2 ?? {};
  const summary = index < 0;
  index = index < 0 ? -index - 1 : index;
  const records = summary ? grid.summary : grid.records;
  const rec = records[index];
  const col = grid.columns[column];
  let new_val = input?.tagName == "DIV" ? input.innerText : input.value;
  const fld = input._w2field;
  if (fld) {
    if (fld.type == "list") {
      new_val = fld.selected;
    }
    if (new_val == null || Object.keys(new_val).length === 0) new_val = "";
    if (!TsUtils.isPlainObject(new_val)) new_val = fld.clean(new_val);
  }
  if (input.type == "checkbox") {
    if (rec.TsUi?.["editable"] === false) input.checked = !input.checked;
    new_val = input.checked;
  }
  const old_val = grid.parseField(rec, col.field);
  const prev_val = rec.TsUi?.["changes"] && rec.TsUi["changes"].hasOwnProperty(col.field) ? rec.TsUi["changes"][col.field] : old_val;
  let edata = {
    target: grid.name,
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
      edata = grid.trigger("change", edata);
      if (edata.isCancelled !== true) {
        if (new_val !== edata.detail.value.new) {
          continue;
        }
        if ((edata.detail.value.new === "" || edata.detail.value.new == null) && (prev_val === "" || prev_val == null)) {
        } else {
          rec.TsUi = rec.TsUi ?? {};
          rec.TsUi["changes"] = rec.TsUi["changes"] ?? {};
          rec.TsUi["changes"][col.field] = edata.detail.value.new;
        }
        edata.finish();
      }
    } else {
      edata = grid.trigger("restore", edata);
      if (edata.isCancelled !== true) {
        if (new_val !== edata.detail.value.new) {
          continue;
        }
        if (rec.TsUi?.["changes"]) {
          delete rec.TsUi["changes"][col.field];
          if (Object.keys(rec.TsUi["changes"]).length === 0) {
            delete rec.TsUi["changes"];
          }
        }
        edata.finish();
      }
    }
    break;
  }
}
function editDone(grid, index, column, event2) {
  index = index ?? grid.last._edit?.["index"];
  column = column ?? grid.last._edit?.["column"];
  event2 = event2 ?? {};
  if (grid.advanceOnEdit && event2.keyCode == 13) {
    const next = event2.shiftKey ? grid.prevRow(index, column, 1) ?? index : grid.nextRow(index, column, 1) ?? index;
    setTimeout(() => {
      if (grid.selectType != "row") {
        grid.selectNone(true);
        grid.select({ recid: grid.records[next].recid, column });
      } else {
        grid.editField(grid.records[next].recid, column, null, event2);
      }
    }, 1);
  }
  const summary = index < 0;
  const cell = query18(grid.last._edit?.["tr"]).find('[col="' + column + '"]');
  const rec = grid.records[index];
  const col = grid.columns[column];
  grid.last.inEditMode = false;
  grid.last._edit = null;
  if (!summary) {
    if (rec.TsUi?.["changes"]?.[col.field] != null) {
      cell.addClass("tsg-changed");
    } else {
      cell.removeClass("tsg-changed");
    }
    cell.replace(grid.getCellHTML(index, column, summary));
  }
  query18(grid.box).find("div.tsg-edit-box").remove();
  grid.updateToolbar();
  setTimeout(() => {
    const input = query18(grid.box).find(`#grid_${grid.name}_focus`).get(0);
    if (document.activeElement !== input && !grid.last.inEditMode) {
      input.focus();
    }
  }, 10);
}

// src/grid-search.ts
var query19 = query;
var TsMenu3 = TsMenu;
var TsTooltip4 = TsTooltip;
function addSearch(grid, before, search2) {
  let added = 0;
  if (search2 === void 0) {
    search2 = before;
    before = grid.searches.length;
  } else {
    if (typeof before == "string") before = grid.getSearch(before, true);
    if (before == null) before = grid.searches.length;
  }
  if (!Array.isArray(search2)) search2 = [search2];
  for (let i = 0; i < search2.length; i++) {
    grid.searches.splice(before, 0, search2[i]);
    before++;
    added++;
  }
  grid.searchClose();
  return added;
}
function removeSearch(grid, ...fields) {
  let removed = 0;
  for (let a = 0; a < fields.length; a++) {
    const field_a = fields[a];
    for (let r = grid.searches.length - 1; r >= 0; r--) {
      if (grid.searches[r].field == field_a) {
        grid.searches.splice(r, 1);
        removed++;
      }
    }
  }
  grid.searchClose();
  return removed;
}
function getSearch(grid, field, returnIndex) {
  if (field === void 0) {
    const ret = [];
    for (let i = 0; i < grid.searches.length; i++) ret.push(grid.searches[i].field);
    return ret;
  }
  for (let i = 0; i < grid.searches.length; i++) {
    if (grid.searches[i].field == field) {
      if (returnIndex === true) return i;
      else return grid.searches[i];
    }
  }
  return null;
}
function toggleSearch(grid, ...fields) {
  let effected = 0;
  for (let a = 0; a < fields.length; a++) {
    const field_a = fields[a];
    for (let r = grid.searches.length - 1; r >= 0; r--) {
      if (grid.searches[r].field == field_a) {
        grid.searches[r].hidden = !grid.searches[r].hidden;
        effected++;
      }
    }
  }
  grid.searchClose();
  return effected;
}
function showSearch(grid, ...fields) {
  let shown = 0;
  for (let a = 0; a < fields.length; a++) {
    const field_a = fields[a];
    for (let r = grid.searches.length - 1; r >= 0; r--) {
      if (grid.searches[r].field == field_a && grid.searches[r].hidden !== false) {
        grid.searches[r].hidden = false;
        shown++;
      }
    }
  }
  grid.searchClose();
  return shown;
}
function hideSearch(grid, ...fields) {
  let hidden = 0;
  for (let a = 0; a < fields.length; a++) {
    const field_a = fields[a];
    for (let r = grid.searches.length - 1; r >= 0; r--) {
      if (grid.searches[r].field == field_a && grid.searches[r].hidden !== true) {
        grid.searches[r].hidden = true;
        hidden++;
      }
    }
  }
  grid.searchClose();
  return hidden;
}
function getSearchData(grid, field) {
  for (let i = 0; i < grid.searchData.length; i++) {
    if (grid.searchData[i].field == field) return grid.searchData[i];
  }
  return null;
}
function search(grid, field, value) {
  const url = grid.url?.get ?? grid.url;
  const searchData = [];
  let last_multi = grid.last.multi;
  let last_logic = grid.last.logic;
  let last_field = grid.last.field;
  let last_search = grid.last.search;
  let hasHiddenSearches = false;
  const overlay = query19(`#w2overlay-${grid.name}-search-overlay`);
  if (value === "") value = null;
  for (let i = 0; i < grid.searches.length; i++) {
    const srch_i = grid.searches[i];
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
    if (grid.multiSearch) {
      field = grid.searchData;
      value = grid.last.logic;
    } else {
      field = grid.last.field;
      value = grid.last.search;
    }
  }
  if (field === void 0 && overlay.length !== 0) {
    grid.focus();
    last_logic = overlay.find(`#grid_${grid.name}_logic`).val();
    last_search = "";
    for (let i = 0; i < grid.searches.length; i++) {
      const srch = grid.searches[i];
      const operator = overlay.find("#grid_" + grid.name + "_operator_" + i).val();
      const field1 = overlay.find("#grid_" + grid.name + "_field_" + i);
      const field2 = overlay.find("#grid_" + grid.name + "_field2_" + i);
      let value1 = field1.val();
      let value2 = field2.val();
      let svalue = null;
      let text = null;
      if (["int", "float", "money", "currency", "percent"].indexOf(srch.type) != -1) {
        const fld1 = field1[0]._w2field;
        const fld2 = field2[0]._w2field;
        if (fld1) value1 = fld1.clean(value1);
        if (fld2) value2 = fld2.clean(value2);
      }
      if (["list", "enum"].indexOf(srch.type) != -1 || ["in", "not in"].indexOf(operator) != -1) {
        value1 = field1[0]._w2field.selected || {};
        if (Array.isArray(value1)) {
          svalue = [];
          for (let j = 0; j < value1.length; j++) {
            svalue.push(TsUtils.isFloat(value1[j].id) ? parseFloat(value1[j].id) : String(value1[j].id).toLowerCase());
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
          field: srch.field,
          type: srch.type,
          operator
        };
        if (operator == "between") {
          TsUtils.extend(tmp, { value: [value1, value2] });
        } else if (operator == "in" && typeof value1 == "string") {
          TsUtils.extend(tmp, { value: value1.split(",") });
        } else if (operator == "not in" && typeof value1 == "string") {
          TsUtils.extend(tmp, { value: value1.split(",") });
        } else {
          TsUtils.extend(tmp, { value: value1 });
        }
        if (svalue) TsUtils.extend(tmp, { svalue });
        if (text) TsUtils.extend(tmp, { text });
        try {
          if (srch.type == "date" && operator == "between") {
            tmp.value[0] = value1;
            tmp.value[1] = value2;
          }
          if (srch.type == "date" && operator == "is") {
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
        if (grid.searches.length > 0) {
          for (let i = 0; i < grid.searches.length; i++) {
            const srch = grid.searches[i];
            if (srch.type == "text" || srch.type == "alphanumeric" && TsUtils.isAlphaNumeric(value) || srch.type == "int" && TsUtils.isInt(value) || srch.type == "float" && TsUtils.isFloat(value) || srch.type == "percent" && TsUtils.isFloat(value) || (srch.type == "hex" || srch.type == "color") && TsUtils.isHex(value) || srch.type == "currency" && TsUtils.isMoney(value) || srch.type == "money" && TsUtils.isMoney(value) || srch.type == "date" && TsUtils.isDate(value) || srch.type == "time" && TsUtils.isTime(value) || srch.type == "datetime" && TsUtils.isDateTime(value) || srch.type == "datetime" && TsUtils.isDate(value) || srch.type == "enum" && TsUtils.isAlphaNumeric(value) || srch.type == "list" && TsUtils.isAlphaNumeric(value)) {
              const def = grid.defaultOperator[grid.operatorsMap[srch.type]];
              const tmp = {
                field: srch.field,
                type: srch.type,
                operator: srch.operator != null ? srch.operator : def,
                value
              };
              if (String(value).trim() != "") searchData.push(tmp);
            }
            if (["int", "float", "money", "currency", "percent"].indexOf(srch.type) != -1) {
              const t = String(value).trim().split("-").map((v) => v.trim()).filter((v) => TsUtils.isFloat(v));
              if (t.length == 2) {
                const tmp = {
                  field: srch.field,
                  type: srch.type,
                  operator: "between",
                  value: [t[0], t[1]]
                };
                searchData.push(tmp);
              }
            }
            if (["list", "enum"].indexOf(srch.type) != -1) {
              const new_values = [];
              if (srch.options == null) srch.options = {};
              if (!Array.isArray(srch.options["items"])) srch.options["items"] = [];
              for (let j = 0; j < srch.options["items"]; j++) {
                const tmp = srch.options["items"][j];
                try {
                  const re = new RegExp(value, "i");
                  if (re.test(tmp)) new_values.push(j);
                  if (tmp.text && re.test(tmp.text)) new_values.push(tmp.id);
                } catch (e) {
                }
              }
              if (new_values.length > 0) {
                const tmp = {
                  field: srch.field,
                  type: srch.type,
                  operator: srch.operator != null ? srch.operator : "in",
                  value: new_values
                };
                searchData.push(tmp);
              }
            }
          }
        } else {
          for (let i = 0; i < grid.columns.length; i++) {
            const tmp = {
              field: grid.columns[i].field,
              type: "text",
              operator: grid.defaultOperator["text"],
              value
            };
            searchData.push(tmp);
          }
        }
        if (searchData.length == 0) {
          const tmp = {
            field: "All",
            type: "text",
            operator: grid.defaultOperator["text"],
            value
          };
          searchData.push(tmp);
        }
      } else {
        const el = overlay.find("#grid_" + grid.name + "_search_all");
        let srch = grid.getSearch(field);
        if (srch == null) srch = { field, type: "text" };
        if (srch.field == field) grid.last.label = srch.label ?? "";
        if (value !== "") {
          let op = grid.defaultOperator[grid.operatorsMap[srch.type]];
          let val = value;
          if (["date", "time", "datetime"].indexOf(srch.type) != -1) op = "is";
          if (["list", "enum"].indexOf(srch.type) != -1) {
            op = "is";
            const tmp2 = el._w2field?.get();
            if (tmp2 && Object.keys(tmp2).length > 0) val = tmp2.id;
            else val = "";
          }
          if (srch.type == "int" && value !== "") {
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
          if (srch.operator != null) op = srch.operator;
          const tmp = {
            field: srch.field,
            type: srch.type,
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
      if (typeof data.value == "number" && data.operator == null) data.operator = grid.defaultOperator["number"];
      if (typeof data.value == "string" && data.operator == null) data.operator = grid.defaultOperator["text"];
      if (Array.isArray(data.value) && data.operator == null) data.operator = grid.defaultOperator["enum"];
      if (TsUtils.isDate(data.value) && data.operator == null) data.operator = grid.defaultOperator["date"];
      searchData.push(data);
    }
  }
  const edata = grid.trigger("search", {
    target: grid.name,
    multi: field === void 0 ? true : false,
    searchField: field ? field : "multi",
    searchValue: field ? value : "multi",
    searchData,
    searchLogic: last_logic
  });
  if (edata.isCancelled === true) return;
  grid.searchData = edata.detail["searchData"];
  grid.last.field = last_field;
  grid.last.search = last_search;
  grid.last.multi = last_multi;
  grid.last.logic = edata.detail["searchLogic"];
  grid.last.vscroll.scrollTop = 0;
  grid.last.vscroll.scrollLeft = 0;
  grid.last.selection.indexes = [];
  grid.last.selection.columns = {};
  grid.searchClose();
  if (url) {
    grid.last.fetch.offset = 0;
    grid.reload();
  } else {
    grid.localSearch();
    grid.refresh();
  }
  edata.finish();
}
function searchOpen(grid, options = {}) {
  if (!grid.box) return;
  if (grid.searches.length === 0) return;
  const edata = grid.trigger("searchOpen", { target: grid.name });
  if (edata.isCancelled === true) {
    return;
  }
  const $btn = query19(grid.toolbar.box).find(".tsg-grid-search-input .tsg-search-drop");
  $btn.addClass("checked");
  TsTooltip4.show({
    name: grid.name + "-search-overlay",
    anchor: query19(grid.box).find("#grid_" + grid.name + "_search_all").get(0),
    position: "bottom|top",
    html: grid.getSearchesHTML(),
    align: "left",
    arrowSize: 12,
    class: "tsg-grid-search-advanced",
    hideOn: ["doc-click"],
    ...options?.overlay ?? {}
  }).then((_event) => {
    grid.initSearches();
    grid.last["search_opened"] = true;
    const overlay = query19(`#w2overlay-${grid.name}-search-overlay`);
    overlay.data("gridName", grid.name).off(".grid-search").on("click.grid-search", (event2) => {
      overlay.find("input, select").each((el) => {
        const names = query19(el).data("tooltipName");
        if (names) names.forEach((name) => {
          TsTooltip4.hide(name);
        });
      });
      console.log(event2.target);
      if (!query19(event2.target).hasClass("tsg-saved-searches")) {
        TsTooltip4.hide(grid.name + "-search-suggest");
      }
    });
    TsUtils.bindEvents(overlay.find("select, input, button"), grid);
    const sfields = query19(`#w2overlay-${grid.name}-search-overlay *[rel=search]`);
    if (sfields.length > 0) sfields[0].focus();
    edata.finish();
  }).hide((_event) => {
    const edata2 = grid.trigger("searchClose", { target: grid.name });
    if (edata2.isCancelled === true) {
      return;
    }
    $btn.removeClass("checked");
    grid.last["search_opened"] = false;
    edata2.finish();
  });
}
function searchClose(grid) {
  TsTooltip4.hide(grid.name + "-search-overlay");
}
function searchFieldTooltip(grid, ind, sd_ind, el) {
  const sf = grid.searches[ind];
  const sd = grid.searchData[sd_ind];
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
        options += `<span class="value">${TsUtils.formatDate(opt)}</span>`;
      });
    }
  } else {
    if (sd.type == "date") {
      val = TsUtils.formatDateTime(val);
    }
  }
  TsTooltip4.hide(grid.name + "-search-props");
  TsTooltip4.show({
    name: grid.name + "-search-props",
    anchor: el,
    class: "tsg-white",
    hideOn: "doc-click",
    html: `
            <div class="tsg-grid-search-single">
                <span class="field">${sf.label ?? ""}</span>
                <span class="operator">${TsUtils.lang(oper)}</span>
                ${Array.isArray(sd.value) ? `${options}` : `<span class="value">${val}</span>`}
                <div class="buttons">
                    <button id="remove" class="tsg-btn">${TsUtils.lang("Remove This Field")}</button>
                </div>
            </div>`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }).then((event2) => {
    query19(event2.detail.overlay.box).find("#remove").on("click", () => {
      grid.searchData.splice(sd_ind, 1);
      grid.reload();
      grid.localSearch();
      TsTooltip4.hide(grid.name + "-search-props");
    });
  });
}
function searchSuggest(grid, imediate, forceHide, anchor) {
  clearTimeout(grid.last.kbd_timer ?? void 0);
  clearTimeout(grid.last["overlay_timer"]);
  grid.searchShowFields(true);
  if (anchor == null) grid.searchClose();
  if (forceHide === true || anchor != null && query19(`#w2overlay-${grid.name}-search-suggest`).length > 0) {
    TsTooltip4.hide(grid.name + "-search-suggest");
    return;
  }
  if (query19(`#w2overlay-${grid.name}-search-suggest`).length > 0) {
    return;
  }
  if (!imediate) {
    grid.last["overlay_timer"] = setTimeout(() => {
      grid.searchSuggest(true);
    }, 100);
    return;
  }
  const el = anchor ?? query19(grid.box).find(`#grid_${grid.name}_search_all`).get(0);
  const searches = [
    ...grid.defaultSearches ?? [],
    ...grid.defaultSearches?.length > 0 && grid.savedSearches?.length > 0 ? ["--"] : [],
    ...grid.savedSearches ?? []
  ];
  if (Array.isArray(searches) && searches.length > 0) {
    TsMenu3.show({
      name: grid.name + "-search-suggest",
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
      const edata = grid.trigger("searchSelect", {
        target: grid.name,
        index: event2.detail.index,
        item: event2.detail.item
      });
      if (edata.isCancelled === true) {
        event2.preventDefault();
        return;
      }
      event2.detail.overlay.hide();
      grid.last.logic = event2.detail.item.logic || "AND";
      grid.last.search = "";
      grid.last.label = "[Multiple Fields]";
      grid.searchData = TsUtils.clone(event2.detail.item.data);
      grid["searchSelected"] = TsUtils.clone(event2.detail.item, { exclude: ["icon", "remove"] });
      grid.reload();
      edata.finish();
    }).remove((event2) => {
      const item = event2.detail.item;
      const edata = grid.trigger("searchRemove", { target: grid.name, index: event2.detail.index, item });
      if (edata.isCancelled === true) {
        event2.preventDefault();
        return;
      }
      queueMicrotask(() => event2.detail.overlay.hide());
      TsTooltip4.hide(grid.name + "-search-overlay");
      grid.confirm(TsUtils.lang('Do you want to delete search "${item}"?', { item: item.text })).yes((evt) => {
        const srch = grid.savedSearches.findIndex((s) => s.id == item.id ? true : false);
        if (srch !== -1) {
          grid.savedSearches.splice(srch, 1);
        }
        grid.cacheSave("searches", grid.savedSearches.map((s) => TsUtils.clone(s, { exclude: ["remove", "icon"] })));
        evt.detail.self.close();
        edata.finish();
      }).no((evt) => {
        evt.detail.self.close();
      });
    });
  }
}
function searchSave(grid) {
  let value = "";
  if (grid["searchSelected"]) {
    value = grid["searchSelected"].text;
  }
  const ind = grid.savedSearches.findIndex((s) => {
    return s.id == grid["searchSelected"]?.id ? true : false;
  });
  const edata = grid.trigger("searchSave", { target: grid.name, saveLocalStorage: true });
  if (edata.isCancelled === true) return;
  grid.message({
    width: 350,
    height: 150,
    body: `<div class="tsg-grid-save-search">
                    <span>${TsUtils.lang(ind != -1 ? "Update Search" : "Save New Search")}</span>
                    <input class="search-name tsg-input" placeholder="${TsUtils.lang("Search name")}">
               </div>`,
    buttons: `
            <button id="grid-search-cancel" class="tsg-btn">${TsUtils.lang("Cancel")}</button>
            <button id="grid-search-save" class="tsg-btn tsg-btn-blue" ${String(value).trim() == "" ? "disabled" : ""}>${TsUtils.lang("Save")}</button>
        `
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  })?.open(async (event2) => {
    query19(event2.detail.box).find("input, button").eq(0).val(value);
    await event2.complete;
    query19(event2.detail.box).find("#grid-search-cancel").on("click", () => {
      grid.message();
    });
    query19(event2.detail.box).find("#grid-search-save").on("click", () => {
      const input = query19(event2.detail.box).find(".tsg-message .search-name");
      const name = input.val();
      if (grid["searchSelected"] && ind != -1) {
        Object.assign(grid.savedSearches[ind], {
          id: name,
          text: name,
          logic: grid.last.logic,
          data: TsUtils.clone(grid.searchData)
        });
      } else {
        grid.savedSearches.push({
          id: name,
          text: name,
          icon: "tsg-icon-search",
          remove: true,
          logic: grid.last.logic,
          data: grid.searchData
        });
      }
      grid.cacheSave("searches", grid.savedSearches.map((s) => TsUtils.clone(s, { exclude: ["remove", "icon"] })));
      grid.message();
      if (grid["searchSelected"]) {
        grid["searchSelected"].text = name;
        query19(grid.box).find(`#grid_${grid.name}_search_name .name-text`).html(name);
      } else {
        grid["searchSelected"] = {
          text: name,
          logic: grid.last.logic,
          data: TsUtils.clone(grid.searchData)
        };
        query19(event2.detail.box).find(`#grid_${grid.name}_search_all`).val(" ").prop("readOnly", true);
        query19(event2.detail.box).find(`#grid_${grid.name}_search_name`).show().find(".name-text").html(name);
      }
      edata.finish({ name });
    });
    await TsUtils.wait(100);
    query19(event2.detail.box).find("input, button").off(".message").on("keydown.message", (evt) => {
      const val = String(query19(event2.detail.box).find(".tsg-message-body input").val()).trim();
      if (evt.keyCode == 13 && val != "") {
        query19(event2.detail.box).find("#grid-search-save").trigger("click");
      }
      if (evt.keyCode == 27) {
        grid.message();
      }
    }).eq(0).on("input.message", (_evt) => {
      const $save = query19(event2.detail.box).closest(".tsg-message").find("#grid-search-save");
      if (String(query19(event2.detail.box).val()).trim() === "") {
        $save.prop("disabled", true);
      } else {
        $save.prop("disabled", false);
      }
    }).get(0).focus();
  });
}
function cache(grid, type) {
  if (TsUtils.hasLocalStorage && grid.useLocalStorage) {
    try {
      const data = JSON.parse(localStorage["TsUi"] || "{}");
      data[grid.stateId || grid.name] ??= {};
      return data[grid.stateId || grid.name][type];
    } catch (e) {
    }
  }
  return null;
}
function cacheSave(grid, type, value) {
  if (TsUtils.hasLocalStorage && grid.useLocalStorage) {
    try {
      const data = JSON.parse(localStorage["TsUi"] || "{}");
      data[grid.stateId || grid.name] ??= {};
      data[grid.stateId || grid.name][type] = value;
      localStorage["TsUi"] = JSON.stringify(data);
      return true;
    } catch (e) {
      delete localStorage["TsUi"];
    }
  }
  return false;
}
function searchReset(grid, noReload) {
  const searchData = [];
  let hasHiddenSearches = false;
  for (let i = 0; i < grid.searches.length; i++) {
    const srch_r = grid.searches[i];
    if (!srch_r.hidden || srch_r.value == null) continue;
    searchData.push({
      field: srch_r.field,
      operator: srch_r.operator || "is",
      type: srch_r.type,
      value: srch_r.value || ""
    });
    hasHiddenSearches = true;
  }
  const edata = grid.trigger("search", { reset: true, target: grid.name, searchData });
  if (edata.isCancelled === true) return;
  const input = query19(grid.box).find("#grid_" + grid.name + "_search_all");
  grid.searchData = edata.detail["searchData"];
  grid["searchSelected"] = null;
  grid.last.search = "";
  grid.last.logic = hasHiddenSearches ? "AND" : grid.last.logic;
  if (grid.multiSearch) {
    input.next().show();
  } else {
    input.next().hide();
  }
  grid.last.multi = false;
  grid.last.fetch.offset = 0;
  grid.last.vscroll.scrollTop = 0;
  grid.last.vscroll.scrollLeft = 0;
  grid.last.selection.indexes = [];
  grid.last.selection.columns = {};
  grid.searchClose();
  const all = input.val("").get(0);
  if (all?._w2field) {
    all._w2field.reset();
  }
  if (!noReload) {
    grid.reload();
  }
  edata.finish();
}
function searchShowFields(grid, forceHide) {
  if (forceHide === true) {
    TsTooltip4.hide(grid.name + "-search-fields");
    return;
  }
  const items = [];
  for (let s = -1; s < grid.searches.length; s++) {
    let srch = grid.searches[s];
    const sField = srch ? srch.field : null;
    const column = sField != null ? grid.getColumn(sField) : null;
    let disabled = false;
    let tooltip = null;
    if (grid.show.searchHiddenMsg == true && s != -1 && (column == null || column.hidden === true && column.hideable !== false)) {
      disabled = true;
      tooltip = TsUtils.lang(`This column ${column == null ? "does not exist" : "is hidden"}`);
    }
    if (s == -1) {
      if (!grid.multiSearch || !grid.show.searchAll) continue;
      srch = { field: "all", label: "All Fields", type: "text" };
    } else {
      if (column != null && column.hideable === false) continue;
      if (srch == null) continue;
      if (srch.hidden === true) {
        tooltip = TsUtils.lang("This column is hidden");
        if (srch["simple"] === false) continue;
      }
    }
    if (srch == null) continue;
    if (srch.label == null && srch["caption"] != null) {
      console.log("NOTICE: grid search.caption property is deprecated, please use search.label. Search ->", srch);
      srch.label = srch["caption"];
    }
    items.push({
      id: srch.field,
      text: TsUtils.lang(srch.label ?? ""),
      search: srch,
      tooltip,
      disabled,
      checked: srch.field == grid.last.field
    });
  }
  TsMenu3.show({
    type: "radio",
    name: grid.name + "-search-fields",
    anchor: query19(grid.box).find("#grid_" + grid.name + "_search_name").parent().find(".tsg-search-down").get(0),
    items,
    align: "none",
    hideOn: ["doc-click", "select"]
  }).select((event2) => {
    grid.searchInitInput(event2.detail.item.search.field);
  });
}
function searchInitInput(grid, field, _value) {
  let srch;
  const el = query19(grid.box).find("#grid_" + grid.name + "_search_all");
  if (field == "all") {
    srch = { field: "all", label: TsUtils.lang("All Fields") };
  } else {
    srch = grid.getSearch(field);
    if (srch == null) return;
  }
  if (grid.last.search != "") {
    grid.last.label = srch.label ?? "";
    grid.search(srch.field, grid.last.search);
  } else {
    grid.last.field = srch.field;
    grid.last.label = srch.label ?? "";
  }
  el.attr("placeholder", TsUtils.lang("Search") + " " + TsUtils.lang(srch.label || srch["caption"] || srch.field, true));
  if (grid["searchSelected"]) {
    query19(grid.box).find(`#grid_${grid.name}_search_all`).val(" ").prop("readOnly", true);
    query19(grid.box).find(`#grid_${grid.name}_search_name`).show().find(".name-text").html(grid["searchSelected"].text);
  } else {
    query19(grid.box).find(`#grid_${grid.name}_search_all`).prop("readOnly", false);
    query19(grid.box).find(`#grid_${grid.name}_search_name`).hide().find(".name-text").html("");
  }
}
function getSearchesHTML(grid) {
  let html = `
        <div class="search-title">
            ${TsUtils.lang("Advanced Search")}
            ${grid.savedSearches?.length > 0 ? `<button class="tsg-btn tsg-saved-searches" data-click="searchSuggest|true|false|this">Saved Searches (${grid.savedSearches?.length ?? 0})</button>` : ""}
            <span class="search-logic" style="${grid.show.searchLogic ? "" : "display: none"}">
                <select id="grid_${grid.name}_logic" class="tsg-input">
                    <option value="AND" ${grid.last.logic == "AND" ? "selected" : ""}>${TsUtils.lang("All")}</option>
                    <option value="OR" ${grid.last.logic == "OR" ? "selected" : ""}>${TsUtils.lang("Any")}</option>
                </select>
            </span>
        </div>
    `;
  const columns = [];
  let col_ind = 0;
  columns.push('<div><table cellspacing="0"><tbody>');
  for (let i = 0; i < grid.searches.length; i++) {
    const s = grid.searches[i];
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
            <select id="grid_${grid.name}_operator_${i}" class="tsg-input" data-change="initOperator|${i}">
                ${grid.getOperators(s.type, s.operators)}
            </select>
        `;
    columns[col_ind] += `<tr>
                    <td class="caption">${TsUtils.lang(s.label ?? s.field) || ""}</td>
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
        columns[col_ind] += `<input rel="search" type="text" id="grid_${grid.name}_field_${i}" name="${s.field}"
                           class="tsg-input" style="${tmpStyle + s.style}" ${s.attr}>`;
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
        columns[col_ind] += `<input id="grid_${grid.name}_field_${i}" name="${s.field}" ${s.attr} rel="search" type="text"
                            class="tsg-input" style="${tmpStyle + s.style}">
                        <span id="grid_${grid.name}_range_${i}" style="display: none">&#160;-&#160;&#160;
                            <input rel="search" type="text" class="tsg-input" style="${tmpStyle + s.style}" id="grid_${grid.name}_field2_${i}" name="${s.field}" ${s.attr}>
                        </span>`;
        break;
      case "select":
        columns[col_ind] += `<select rel="search" class="tsg-input" style="${s.style}" id="grid_${grid.name}_field_${i}"
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
            <button type="button" class="tsg-btn close-btn" data-click="searchClose">${TsUtils.lang("Close")}</button>
            <div style="float: right; display: inline">
                <button type="button" class="tsg-btn" data-click="searchReset">${TsUtils.lang("Reset")}</button>
                <button type="button" class="tsg-btn tsg-btn-blue" data-click="search">${TsUtils.lang("Search")}</button>
            </div>
        </div>
    `;
  return html;
}
function getOperators(grid, type, opers) {
  let operators = grid.operators[grid.operatorsMap[type] ?? ""] || [];
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
    } else if (TsUtils.isPlainObject(oper)) {
      displayText = oper.text;
      operValue = oper.oper;
    }
    if (displayText == null) displayText = oper;
    html += `<option  value="${operValue}">${TsUtils.lang(displayText)}</option>
`;
  });
  return html;
}
function initOperator(grid, ind) {
  let options;
  const srch = grid.searches[ind];
  const sdata = grid.getSearchData(srch.field);
  const overlay = query19(`#w2overlay-${grid.name}-search-overlay`);
  const $rng = overlay.find(`#grid_${grid.name}_range_${ind}`);
  const $fld1 = overlay.find(`#grid_${grid.name}_field_${ind}`);
  const $fld2 = overlay.find(`#grid_${grid.name}_field2_${ind}`);
  const $oper = overlay.find(`#grid_${grid.name}_operator_${ind}`);
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
  switch (srch.type) {
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
        new TsField(srch.type, { el: $fld1[0], ...srch.options });
        new TsField(srch.type, { el: $fld2[0], ...srch.options });
        setTimeout(() => {
          $fld1.trigger("keydown");
          $fld2.trigger("keydown");
        }, 1);
      }
      break;
    case "list":
    case "combo":
    case "enum":
      options = srch.options ?? {};
      if (srch.type == "list") options["selected"] = {};
      if (srch.type == "enum") options["selected"] = [];
      if (sdata) options["selected"] = sdata["value"];
      if (!$fld1[0]._w2field) {
        const fld2 = new TsField(srch.type, {
          el: $fld1[0],
          ...options,
          // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSelect: async (event2) => {
            await event2.complete;
            grid.initSearchLists(srch.field);
          },
          // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onRemove: async (event2) => {
            await event2.complete;
            grid.initSearchLists(srch.field);
          }
        });
        if (sdata && sdata["text"] != null) {
          fld2.set({ id: sdata["value"], text: sdata["text"] });
        }
        srch["_w2field"] = fld2;
      }
      break;
    case "select":
      options = '<option value="">--</option>';
      const searchOpts = srch.options ?? {};
      for (let i = 0; i < searchOpts["items"].length; i++) {
        const si = searchOpts["items"][i];
        if (TsUtils.isPlainObject(searchOpts["items"][i])) {
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
  grid.initSearchLists();
}
function initSearchLists(grid, changedField) {
  const fields = grid.getSearch();
  fields.forEach((field) => {
    const srch = grid.getSearch(field);
    if (srch != null && srch.options?.["parentList"] != null) {
      const parent = grid.getSearch(srch.options["parentList"]);
      if (parent == null) return;
      let values = grid.getSearch(parent.field)?.["_w2field"]?.get();
      if (Array.isArray(values)) {
        values = values.map((vv) => vv.id);
      } else {
        values = values?.id != null ? [values.id] : [];
      }
      srch["_w2field"]?.options?.items?.forEach?.((item) => {
        const parent2 = TsUtils.getNested(item, srch?.options?.["parentField"] ?? "parentId");
        if (parent2 == null) {
          return;
        }
        const possible = TsUtils.clone(Array.isArray(parent2) ? parent2 : [parent2]);
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
      const srch = grid.getSearch(field);
      if (srch != null && srch.options?.["parentList"] == changedField) {
        const fld = srch["_w2field"];
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
function initSearches(grid) {
  const overlay = query19(`#w2overlay-${grid.name}-search-overlay`);
  for (let ind = 0; ind < grid.searches.length; ind++) {
    const srch = grid.searches[ind];
    const sdata = grid.getSearchData(srch.field);
    srch.type = String(srch.type).toLowerCase();
    if (srch.type == "new-column") {
      continue;
    }
    if (typeof srch.options != "object") srch.options = {};
    let operator = srch.operator;
    let operators = [...grid.operators[grid.operatorsMap[srch.type] ?? ""] ?? []];
    if (srch.operators) operators = [...srch.operators];
    if (TsUtils.isPlainObject(operator)) operator = operator.oper;
    operators.forEach((oper, ind2) => {
      if (TsUtils.isPlainObject(oper)) operators[ind2] = oper.oper;
    });
    if (sdata && sdata["operator"]) {
      operator = sdata["operator"];
    }
    const def = grid.defaultOperator[grid.operatorsMap[srch.type] ?? ""];
    if (operators.indexOf(operator) == -1) {
      operator = def;
    }
    overlay.find(`#grid_${grid.name}_operator_${ind}`).val(operator);
    grid.initOperator(ind);
    const $fld1 = overlay.find(`#grid_${grid.name}_field_${ind}`);
    const $fld2 = overlay.find(`#grid_${grid.name}_field2_${ind}`);
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
  overlay.find(".tsg-grid-search-advanced *[rel=search]").on("keypress", (evnt) => {
    if (evnt.keyCode == 13) {
      grid.search();
      TsTooltip4.hide(grid.name + "-search-overlay");
    }
  });
}

// src/grid-interaction.ts
var query20 = query;
var TsMenu4 = TsMenu;
function click(grid, recid, event2) {
  const time = Date.now();
  let column = null;
  if (grid.last.cancelClick == true || event2 && event2.altKey) return;
  if (typeof recid == "object" && recid !== null) {
    column = recid.column;
    recid = recid.recid;
  }
  if (event2 == null) event2 = {};
  if (time - grid.last.click_time < 350 && grid.last.click_recid == recid && event2.type == "click") {
    grid.dblClick(recid, event2);
    return;
  }
  if (grid.last.bubbleEl) {
    grid.last.bubbleEl = null;
  }
  grid.last.click_time = time;
  const last_recid = grid.last.click_recid;
  grid.last.click_recid = recid;
  if (column == null && event2.target) {
    let trg = event2.target;
    if (trg.tagName != "TD") trg = query20(trg).closest("td")[0];
    if (query20(trg).attr("col") != null) column = parseInt(query20(trg).attr("col"));
  }
  const index = grid.get(recid, true);
  const rec = index != null ? grid.records[index] : null;
  if (rec?.TsUi?.selectable === false && (rec?.TsUi?.children?.length ?? 0) > 0) {
    if (!query20(event2.target).hasClass("tsg-show-children")) {
      grid.toggle(recid);
      return;
    }
  }
  const edata = grid.trigger("click", { target: grid.name, recid, column, originalEvent: event2 });
  if (edata.isCancelled === true) return;
  const sel = grid.getSelection();
  query20(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", false);
  const ind = grid.get(recid, true);
  const selectColumns = [];
  grid.last.sel_ind = ind;
  grid.last.sel_col = column;
  grid.last.sel_recid = recid;
  grid.last.sel_type = "click";
  let start = 0, end = 0, t1 = 0, t2 = 0;
  if (event2.shiftKey && sel.length > 0 && grid.multiSelect) {
    const cellSel = sel;
    if (typeof sel[0] === "object" && cellSel[0].recid != null) {
      start = grid.get(cellSel[0].recid, true) ?? 0;
      end = grid.get(recid, true) ?? 0;
      if (column > cellSel[0].column) {
        t1 = cellSel[0].column;
        t2 = column;
      } else {
        t1 = column;
        t2 = cellSel[0].column;
      }
      for (let c = t1; c <= t2; c++) selectColumns.push(c);
    } else {
      start = last_recid != null ? grid.get(last_recid, true) ?? 0 : 0;
      end = grid.get(recid, true) ?? 0;
    }
    const sel_add = [];
    if (start > end) {
      const tmp = start;
      start = end;
      end = tmp;
    }
    const url = grid.url?.get ?? grid.url;
    for (let i = start; i <= end; i++) {
      if (grid.searchData.length > 0 && !url && !grid.last.searchIds.includes(i)) continue;
      if (grid.selectType == "row") {
        sel_add.push(grid.records[i].recid);
      } else {
        for (let sc = 0; sc < selectColumns.length; sc++) {
          sel_add.push({ recid: grid.records[i].recid, column: selectColumns[sc] });
        }
      }
    }
    grid.select(sel_add);
  } else {
    const last = grid.last.selection;
    let flag = last.indexes.indexOf(ind ?? -1) != -1 ? true : false;
    let fselect = false;
    if (query20(event2.target).closest("td").hasClass("tsg-col-select")) fselect = true;
    if ((!event2.ctrlKey && !event2.shiftKey && !event2.metaKey && !fselect || !grid.multiSelect) && !grid["showSelectColumn"]) {
      if (grid.selectType != "row" && !last.columns[ind ?? -1]?.includes(column)) {
        flag = false;
      }
      if (flag === true && sel.length == 1) {
        grid.unselect({ recid, column });
      } else {
        grid.selectNone(true);
        grid.select({ recid, column });
      }
    } else {
      if (grid.selectType != "row") flag = false;
      if (flag === true) {
        grid.unselect({ recid, column });
      } else {
        grid.select({ recid, column });
      }
    }
  }
  grid.status();
  grid.initResize();
  edata.finish();
}
function columnClick(grid, field, event2) {
  if (grid.last.colResizing === true) {
    return;
  }
  let edata = grid.trigger("columnClick", { target: grid.name, field, originalEvent: event2 });
  if (edata.isCancelled === true) return;
  if (grid.selectType == "row") {
    const column = grid.getColumn(field);
    if (column && column.sortable) grid.sort(field, null, event2 && (event2.ctrlKey || event2.metaKey || event2.shiftKey) ? true : false);
    if (edata.detail["field"] == "line-number") {
      if (grid.getSelection().length >= grid.records.length) {
        grid.selectNone();
      } else {
        grid.selectAll();
      }
    }
  } else {
    if (event2.altKey) {
      const column = grid.getColumn(field);
      if (column && column.sortable) grid.sort(field, null, event2 && (event2.ctrlKey || event2.metaKey || event2.shiftKey) ? true : false);
    }
    if (edata.detail["field"] == "line-number") {
      if (grid.getSelection().length >= grid.records.length) {
        grid.selectNone();
      } else {
        grid.selectAll();
      }
    } else {
      if (!event2.shiftKey && !event2.metaKey && !event2.ctrlKey) {
        grid.selectNone(true);
      }
      const tmp = grid.getSelectionCells();
      const column = grid.getColumn(edata.detail["field"], true) ?? 0;
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
      edata = grid.trigger("columnSelect", { target: grid.name, columns: cols });
      if (edata.isCancelled !== true) {
        for (let i = 0; i < grid.records.length; i++) {
          sel.push({ recid: grid.records[i].recid, column: cols });
        }
        grid.select(sel);
      }
      edata.finish();
    }
  }
  edata.finish();
}
function columnDblClick(grid, field, event2) {
  const edata = grid.trigger("columnDblClick", { target: grid.name, field, originalEvent: event2 });
  if (edata.isCancelled === true) return;
  edata.finish();
}
function columnContextMenu(grid, field, event2) {
  const edata = grid.trigger("columnContextMenu", { target: grid.name, field, originalEvent: event2 });
  if (edata.isCancelled === true) return;
  TsMenu4.show({
    type: "check",
    contextMenu: true,
    originalEvent: event2,
    items: grid.initColumnOnOff()
  }).then(() => {
    query20("#w2overlay-context-menu .tsg-grid-skip").off(".tsg-grid").on("click.tsg-grid", (evt) => {
      evt.stopPropagation();
    }).on("keypress", (evt) => {
      if (evt.keyCode == 13) {
        grid.skip(evt.target.value);
        grid.toolbar.click("tsg-column-on-off");
      }
    });
  }).select((event3) => {
    const id = event3.detail.item.id;
    if (["tsg-stateSave", "tsg-stateReset"].includes(id)) {
      grid[id.substring(5)]();
    } else if (id == "tsg-skip") {
    } else {
      grid.columnOnOff(event3, event3.detail.item.id);
    }
    clearTimeout(grid.last.kbd_timer ?? void 0);
  });
  clearTimeout(grid.last.kbd_timer ?? void 0);
  event2.preventDefault();
  edata.finish();
}
function columnAutoSize(grid, colIndex) {
  if (colIndex === void 0) {
    grid.columns.forEach((col2, i) => grid.columnAutoSize(i));
    return;
  }
  const col = grid.columns[colIndex];
  const el = query20(`#grid_${grid.name}_column_${colIndex} .tsg-col-header`)[0];
  if (col["autoResize"] === false || col.hidden === true || !el) {
    return true;
  }
  const style = getComputedStyle(el);
  let maxWidth = TsUtils.getStrWidth(el.innerHTML, `font-family: ${style.fontFamily}; font-size: ${style.fontSize}`, true) + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + 4;
  query20(grid.box).find(`.tsg-grid-records td[col="${colIndex}"] > div`, grid.box).each((el2) => {
    const htmlEl = el2;
    const style2 = getComputedStyle(htmlEl);
    const width = TsUtils.getStrWidth(htmlEl.innerHTML, `font-family: ${style2.fontFamily}; font-size: ${style2.fontSize}`, true) + parseFloat(style2.paddingLeft) + parseFloat(style2.paddingRight) + 4;
    if (maxWidth < width) {
      maxWidth = width;
    }
  });
  const edata = grid.trigger("columnAutoResize", { maxWidth, originalEvent: event, target: grid.name, column: col });
  if (edata.isCancelled === true) {
    return;
  }
  if (maxWidth > 0) {
    if (col.sizeOriginal == null) col.sizeOriginal = col.size ?? "";
    col.size = Math.min(Math.abs(maxWidth), col.max || Infinity) + "px";
    grid.resizeRecords();
    grid.resizeRecords();
    grid.scroll();
  }
  edata.finish();
}
function columnAutoSizeAll(grid) {
  grid.columns.forEach((col, ind) => grid.columnAutoSize(ind));
}
function focus(grid, event2) {
  const edata = grid.trigger("focus", { target: grid.name, originalEvent: event2 });
  if (edata.isCancelled === true) return false;
  grid.hasFocus = true;
  query20(grid.box).removeClass("tsg-inactive").find(".tsg-inactive").removeClass("tsg-inactive");
  setTimeout(() => {
    const txt = query20(grid.box).find(`#grid_${grid.name}_focus`).get(0);
    if (txt && document.activeElement != txt) {
      txt.focus();
    }
  }, 10);
  edata.finish();
}
function blur(grid, event2) {
  const edata = grid.trigger("blur", { target: grid.name, originalEvent: event2 });
  if (edata.isCancelled === true) return false;
  grid.hasFocus = false;
  query20(grid.box).addClass("tsg-inactive").find(".tsg-selected").addClass("tsg-inactive");
  query20(grid.box).find(".tsg-selection").addClass("tsg-inactive");
  edata.finish();
}
function keydown(grid, event2) {
  const obj = grid;
  const url = grid.url?.get ?? grid.url;
  if (obj.keyboard !== true) return;
  const edata = obj.trigger("keydown", { target: obj.name, originalEvent: event2 });
  if (edata.isCancelled === true) return;
  if (query20(grid.box).find(".tsg-message").length > 0) {
    if (event2.keyCode == 27) grid.message();
    return;
  }
  let empty = false;
  const records = query20(obj.box).find("#grid_" + obj.name + "_records");
  const sel = obj.getSelection();
  if (sel.length === 0) empty = true;
  let recid = sel[0] || null;
  let columns = [];
  let recid2 = sel[sel.length - 1];
  const cellSel = sel;
  if (typeof recid == "object" && recid != null) {
    const cellSel2 = sel;
    recid = cellSel2[0].recid;
    columns = [];
    let ii = 0;
    while (true) {
      if (!cellSel2[ii] || cellSel2[ii].recid != recid) break;
      columns.push(cellSel2[ii].column);
      ii++;
    }
    recid2 = cellSel2[cellSel2.length - 1].recid;
  }
  const ind = obj.get(recid, true) ?? -1;
  const ind2 = obj.get(recid2, true) ?? -1;
  const recEL = query20(obj.box).find(`#grid_${obj.name}_rec_${ind >= 0 ? TsUtils.escapeId(obj.records[ind].recid) : "none"}`);
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
      if (grid.selectType == "row" && obj.show.expandColumn === true) {
        if (recEL.length <= 0) break;
        obj.toggle(recid, event2);
        cancel = true;
      } else {
        for (let c = 0; c < grid.columns.length; c++) {
          const edit = grid.getCellEditable(ind, c);
          if (edit) {
            columns.push(c);
            break;
          }
        }
        if (grid.selectType == "row" && grid.last._edit && grid.last._edit["column"]) {
          columns = [grid.last._edit["column"]];
        }
        if (columns.length > 0) {
          obj.editField(recid, columns[0] ?? grid.last["editColumn"], null, event2);
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
      if (TsUtils.isSafari) {
        obj.last.copy_event = obj.copy(false, event2);
        const focus2 = query20(obj.box).find("#grid_" + obj.name + "_focus");
        focus2.val(obj.last.copy_event.detail.text);
        focus2[0].select();
      }
      break;
    }
    case 67: {
      if (event2.metaKey || event2.ctrlKey) {
        if (TsUtils.isSafari) {
          obj.copy(obj.last.copy_event, event2);
        } else {
          obj.last.copy_event = obj.copy(false, event2);
          const focus2 = query20(obj.box).find("#grid_" + obj.name + "_focus");
          focus2.val(obj.last.copy_event.detail.text);
          focus2[0].select();
          obj.copy(obj.last.copy_event, event2);
        }
      }
      break;
    }
    case 88: {
      if (empty) break;
      if (event2.ctrlKey || event2.metaKey) {
        if (TsUtils.isSafari) {
          obj.copy(obj.last.copy_event, event2);
        } else {
          obj.last.copy_event = obj.copy(false, event2);
          const focus2 = query20(obj.box).find("#grid_" + obj.name + "_focus");
          focus2.val(obj.last.copy_event.detail.text);
          focus2[0].select();
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
      const focus2 = query20(obj.box).find("#grid_" + obj.name + "_focus");
      const key2 = focus2.val();
      focus2.val("");
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
      const tmp2 = obj.records[ind].TsUi || {};
      if (tmp2 && tmp2.parent_recid != null && (!Array.isArray(tmp2.children) || tmp2.children.length === 0 || !tmp2.expanded)) {
        obj.unselect(recid);
        obj.collapse(tmp2.parent_recid, event2);
        obj.select(tmp2.parent_recid);
      } else {
        obj.collapse(recid, event2);
      }
    } else {
      const prevCell2 = obj.prevCell(ind, columns[0]);
      let prevCol = prevCell2?.index != ind ? null : prevCell2?.colIndex ?? null;
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
              if (tmp2.indexOf(cellSel[i].recid) == -1) tmp2.push(cellSel[i].recid);
              unSel.push({ recid: cellSel[i].recid, column: columns[columns.length - 1] });
            }
            obj.unselect(unSel);
            obj.scrollIntoView(ind, columns[columns.length - 1], true);
          } else {
            for (let i = 0; i < sel.length; i++) {
              if (tmp2.indexOf(cellSel[i].recid) == -1) tmp2.push(cellSel[i].recid);
              newSel.push({ recid: cellSel[i].recid, column: prevCol });
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
      const nextCell2 = obj.nextCell(ind, columns[columns.length - 1]);
      let nextCol = nextCell2?.index != ind ? null : nextCell2?.colIndex ?? null;
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
              if (tmp2.indexOf(cellSel[i].recid) == -1) tmp2.push(cellSel[i].recid);
              unSel.push({ recid: cellSel[i].recid, column: columns[0] });
            }
            obj.unselect(unSel);
            obj.scrollIntoView(ind, columns[0], true);
          } else {
            for (let i = 0; i < sel.length; i++) {
              if (tmp2.indexOf(cellSel[i].recid) == -1) tmp2.push(cellSel[i].recid);
              newSel.push({ recid: cellSel[i].recid, column: nextCol });
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
    let prev = obj.prevRow(ind, obj.selectType == "row" ? 0 : cellSel[0].column, numRows);
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
    let next = obj.nextRow(ind2, obj.selectType == "row" ? 0 : cellSel[0].column, numRows);
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
          if (cellSel[s].recid == obj.last.sel_recid && cellSel[s].column == obj.last.sel_col) {
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
        const rowSel = sel;
        rowSel.splice(rowSel.indexOf(obj.records[obj.last.sel_ind ?? 0].recid), 1);
        obj.unselect(rowSel);
        return true;
      }
      return false;
    }
  }
}
function scrollIntoView(grid, ind, column, instant, recTop) {
  let buffered = grid.records.length;
  if (grid.searchData.length != 0 && !grid.url) buffered = grid.last.searchIds.length;
  if (buffered === 0) return;
  if (ind == null) {
    const sel = grid.getSelection();
    if (sel.length === 0) return;
    if (TsUtils.isPlainObject(sel[0])) {
      const cellSel = sel;
      ind = cellSel[0].index;
      column = cellSel[0].column;
    } else {
      ind = grid.get(sel[0], true);
    }
  }
  const records = query20(grid.box).find(`#grid_${grid.name}_records`);
  const recWidth = records[0].clientWidth;
  const recHeight = records[0].clientHeight;
  const recSTop = records[0].scrollTop;
  const recSLeft = records[0].scrollLeft;
  const len = grid.last.searchIds.length;
  if (len > 0) ind = grid.last.searchIds.indexOf(ind ?? 0);
  records.css({ "scroll-behavior": instant ? "auto" : "smooth" });
  if (recHeight < grid.recordHeight * (len > 0 ? len : buffered) && records.length > 0) {
    const t1 = Math.floor(recSTop / grid.recordHeight);
    const t2 = t1 + Math.floor(recHeight / grid.recordHeight);
    if (ind == t1) {
      records.prop("scrollTop", recSTop - recHeight / 1.3);
    }
    if (ind == t2) {
      records.prop("scrollTop", recSTop + recHeight / 1.3);
    }
    if ((ind ?? 0) < t1 || (ind ?? 0) > t2) {
      records.prop("scrollTop", ((ind ?? 0) - 1) * grid.recordHeight);
    }
    if (recTop === true) {
      records.prop("scrollTop", (ind ?? 0) * grid.recordHeight);
    }
  }
  if (column != null) {
    let x1 = 0;
    let x2 = 0;
    const sb = TsUtils.scrollBarSize();
    for (let i = 0; i <= column; i++) {
      const col = grid.columns[i];
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
function scrollToColumn(grid, field) {
  if (field == null)
    return;
  let sWidth = 0;
  let found = false;
  for (let i = 0; i < grid.columns.length; i++) {
    const col = grid.columns[i];
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
  grid.last.vscroll.scrollLeft = sWidth + 1;
  grid.scroll();
}
function dblClick(grid, recid, event2) {
  let column = null;
  if (typeof recid == "object" && recid !== null) {
    column = recid.column;
    recid = recid.recid;
  }
  if (event2 == null) event2 = {};
  if (column == null && event2.target) {
    let tmp = event2.target;
    if (tmp.tagName.toUpperCase() != "TD") tmp = query20(tmp).closest("td")[0];
    column = parseInt(query20(tmp).attr("col"));
  }
  const index = grid.get(recid, true);
  const rec = index != null ? grid.records[index] : null;
  const edata = grid.trigger("dblClick", { target: grid.name, recid, column, originalEvent: event2 });
  if (edata.isCancelled === true) return;
  grid.selectNone(true);
  const edit = index != null ? grid.getCellEditable(index, column) : null;
  if (edit) {
    grid.editField(recid, column, null, event2);
  } else {
    grid.select({ recid, column });
    if (grid.show.expandColumn || rec && rec.TsUi && Array.isArray(rec.TsUi.children)) grid.toggle(recid);
  }
  edata.finish();
}
function showContextMenu(grid, event2, options) {
  const { recid, index, column } = options;
  if (grid.last.userSelect == "text") return;
  if (event2 == null) {
    event2 = { offsetX: 0, offsetY: 0, target: query20(grid.box).find(`#grid_${grid.name}_rec_${recid}`)[0] };
  }
  if (event2.offsetX == null) {
    event2.offsetX = event2.layerX - event2.target.offsetLeft;
    event2.offsetY = event2.layerY - event2.target.offsetTop;
  }
  if (grid.selectType == "row") {
    const sel = grid.getSelectionRows();
    if (recid != null && sel.indexOf(recid) == -1) {
      grid.click(recid);
    }
  } else {
    const sel = grid.getSelectionCells();
    let sel_col = false;
    let sel_row = false;
    let sel_cell = false;
    sel.forEach((rec) => {
      if (rec.recid == recid) sel_row = true;
      if (rec.column == column) sel_col = true;
      if (rec.recid == recid && rec.column == column) sel_cell = true;
    });
    if (!sel_row && recid != null && column === null) grid.click({ recid });
    if (!sel_col && recid === null && column != null) grid.columnClick(grid.columns[column].field, event2);
    if (!sel_cell && recid != null && column != null) grid.click({ recid, column });
  }
  const edata = grid.trigger("contextMenu", { target: grid.name, originalEvent: event2, recid, index, column });
  if (edata.isCancelled === true) return;
  if (grid.contextMenu?.length > 0) {
    TsMenu4.show({
      contextMenu: true,
      originalEvent: event2,
      items: grid.contextMenu
    }).select((event3) => {
      clearTimeout(grid.last.kbd_timer ?? void 0);
      grid.contextMenuClick(recid ?? "", column ?? null, event3);
    });
  }
  event2.preventDefault();
  clearTimeout(grid.last.kbd_timer ?? void 0);
  edata.finish();
}
function contextMenuClick(grid, recid, column, event2) {
  const edata = grid.trigger("contextMenuClick", {
    target: grid.name,
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
function toggle(grid, recid, _event) {
  const rec = grid.get(recid);
  if (rec == null) return;
  rec.TsUi = rec.TsUi ?? {};
  if (rec.TsUi.expanded === true) {
    return grid.collapse(recid);
  } else {
    return grid.expand(recid);
  }
}
function expand(grid, recid, noRefresh) {
  const ind = grid.get(recid, true);
  if (ind == null) return false;
  const rec = grid.records[ind];
  rec.TsUi = rec.TsUi ?? {};
  const id = TsUtils.escapeId(recid);
  const children = rec.TsUi.children;
  let edata;
  if (Array.isArray(children)) {
    if (rec.TsUi.expanded === true || children.length === 0) return false;
    edata = grid.trigger("expand", { target: grid.name, recid });
    if (edata.isCancelled === true) return false;
    rec.TsUi.expanded = true;
    rec.TsUi["_copied"] = true;
    children.forEach((child) => {
      child.TsUi = child.TsUi ?? {};
      child.TsUi.parent_recid = rec.recid;
      if (child.TsUi.children == null) child.TsUi.children = [];
    });
    grid.records.splice(ind + 1, 0, ...children);
    if (grid.total !== -1) {
      grid.total += children.length;
    }
    const url = grid.url?.get ?? grid.url;
    if (!url) {
      grid.localSort(true, true);
      if (grid.searchData.length > 0) {
        grid.localSearch(true);
      }
    }
    if (noRefresh !== true) grid.refresh();
    edata.finish();
  } else {
    if (query20(grid.box).find("#grid_" + grid.name + "_rec_" + id + "_expanded_row").length > 0 || grid.show.expandColumn !== true) return false;
    if (rec.TsUi.expanded == "none") return false;
    query20(grid.box).find("#grid_" + grid.name + "_rec_" + id).after(
      `<tr id="grid_${grid.name}_rec_${recid}_expanded_row" class="tsg-expanded-row">
                <td colspan="100" class="tsg-expanded2">
                    <div id="grid_${grid.name}_rec_${recid}_expanded"></div>
                </td>
                <td class="tsg-grid-data-last"></td>
            </tr>`
    );
    query20(grid.box).find("#grid_" + grid.name + "_frec_" + id).after(
      `<tr id="grid_${grid.name}_frec_${recid}_expanded_row" class="tsg-expanded-row">
                ${grid.show.lineNumbers ? '<td class="tsg-col-number"></td>' : ""}
                <td class="tsg-grid-data tsg-expanded1" colspan="100">
                   <div id="grid_${grid.name}_frec_${recid}_expanded"></div>
                </td>
            </tr>`
    );
    edata = grid.trigger("expand", {
      target: grid.name,
      recid,
      box_id: "grid_" + grid.name + "_rec_" + recid + "_expanded",
      fbox_id: "grid_" + grid.name + "_frec_" + recid + "_expanded"
    });
    if (edata.isCancelled === true) {
      query20(grid.box).find("#grid_" + grid.name + "_rec_" + id + "_expanded_row").remove();
      query20(grid.box).find("#grid_" + grid.name + "_frec_" + id + "_expanded_row").remove();
      return false;
    }
    const row1 = query20(grid.box).find("#grid_" + grid.name + "_rec_" + recid + "_expanded");
    const row2 = query20(grid.box).find("#grid_" + grid.name + "_frec_" + recid + "_expanded");
    const innerHeight = row1.find(":scope div:first-child")[0]?.clientHeight ?? 50;
    if (row1[0].clientHeight < innerHeight) {
      row1.css({ height: innerHeight + "px" });
    }
    if (row2[0].clientHeight < innerHeight) {
      row2.css({ height: innerHeight + "px" });
    }
    query20(grid.box).find("#grid_" + grid.name + "_rec_" + id).attr("expanded", "yes").addClass("tsg-expanded");
    query20(grid.box).find("#grid_" + grid.name + "_frec_" + id).attr("expanded", "yes").addClass("tsg-expanded");
    query20(grid.box).find("#grid_" + grid.name + "_cell_" + grid.get(recid, true) + "_expand div").html("-");
    rec.TsUi.expanded = true;
    edata.finish();
    grid.resizeRecords();
  }
  grid.selectNone();
  return true;
}
function collapse(grid, recid, noRefresh) {
  const ind = grid.get(recid, true);
  if (ind == null) return false;
  const rec = grid.records[ind];
  rec.TsUi = rec.TsUi || {};
  const id = TsUtils.escapeId(recid);
  const children = rec.TsUi.children;
  let edata;
  if (Array.isArray(children)) {
    if (rec.TsUi.expanded !== true) return false;
    edata = grid.trigger("collapse", { target: grid.name, recid });
    if (edata.isCancelled === true) return false;
    clearExpanded(rec);
    const stops = [];
    for (let r = rec; r != null; r = r.TsUi?.parent_recid != null ? grid.get(r.TsUi.parent_recid) : null)
      stops.push(r.TsUi?.parent_recid);
    const start = ind + 1;
    let end = start;
    while (true) {
      if (grid.records.length <= end + 1 || grid.records[end + 1].TsUi == null || stops.indexOf(grid.records[end + 1].TsUi.parent_recid) >= 0) {
        break;
      }
      end++;
    }
    grid.records.splice(start, end - start + 1);
    if (grid.total !== -1) {
      grid.total -= end - start + 1;
    }
    const url = grid.url?.get ?? grid.url;
    if (!url) {
      if (grid.searchData.length > 0) {
        grid.localSearch(true);
      }
    }
    if (noRefresh !== true) grid.refresh();
    edata.finish();
  } else {
    if (query20(grid.box).find("#grid_" + grid.name + "_rec_" + id + "_expanded_row").length === 0 || grid.show.expandColumn !== true) return false;
    edata = grid.trigger("collapse", {
      target: grid.name,
      recid,
      box_id: "grid_" + grid.name + "_rec_" + recid + "_expanded",
      fbox_id: "grid_" + grid.name + "_frec_" + recid + "_expanded"
    });
    if (edata.isCancelled === true) return false;
    query20(grid.box).find("#grid_" + grid.name + "_rec_" + id).removeAttr("expanded").removeClass("tsg-expanded");
    query20(grid.box).find("#grid_" + grid.name + "_frec_" + id).removeAttr("expanded").removeClass("tsg-expanded");
    query20(grid.box).find("#grid_" + grid.name + "_cell_" + grid.get(recid, true) + "_expand div").html("+");
    query20(grid.box).find("#grid_" + grid.name + "_rec_" + id + "_expanded").css("height", "0px");
    query20(grid.box).find("#grid_" + grid.name + "_frec_" + id + "_expanded").css("height", "0px");
    setTimeout(() => {
      query20(grid.box).find("#grid_" + grid.name + "_rec_" + id + "_expanded_row").remove();
      query20(grid.box).find("#grid_" + grid.name + "_frec_" + id + "_expanded_row").remove();
      if (rec.TsUi) rec.TsUi.expanded = false;
      edata.finish();
      grid.resizeRecords();
    }, 300);
  }
  grid.selectNone();
  return true;
  function clearExpanded(rec2) {
    rec2.TsUi.expanded = false;
    rec2.TsUi["_copied"] = false;
    for (let i = 0; i < rec2.TsUi.children.length; i++) {
      const subRec = rec2.TsUi.children[i];
      if (subRec.TsUi?.expanded) {
        clearExpanded(subRec);
      }
    }
  }
}
function updateExpanded(grid) {
  let updated = false;
  for (let ind = grid.records.length - 1; ind >= 0; ind--) {
    const rec = grid.records[ind];
    const children = rec.TsUi?.children;
    if (rec.TsUi?.expanded === true && (children?.length ?? 0) > 0 && !rec.TsUi["_copied"]) {
      rec.TsUi["_copied"] = true;
      children.forEach((child) => {
        child.TsUi ??= {};
        child.TsUi.parent_recid = rec.recid;
        child.TsUi.children ??= [];
      });
      grid.records.splice(ind + 1, 0, ...children);
      if (grid.total !== -1) {
        grid.total += children.length;
      }
      updated = true;
    }
  }
  if (updated) {
    const url = grid.url?.get ?? grid.url;
    if (!url) {
      grid.localSort(true, true);
      if (grid.searchData.length > 0) {
        grid.localSearch(true);
      }
    }
  }
}
function sort(grid, field, direction, multiField) {
  const edata = grid.trigger("sort", { target: grid.name, field, direction, multiField });
  if (edata.isCancelled === true) return;
  if (field != null) {
    let sortIndex = grid.sortData.length;
    for (let s = 0; s < grid.sortData.length; s++) {
      if (grid.sortData[s].field == field) {
        sortIndex = s;
        break;
      }
    }
    if (direction == null) {
      direction = grid.sortData[sortIndex]?.direction;
      if (direction == null) {
        if (grid.last.originalSort == null) {
          grid.last.originalSort = grid.records.map((rec) => rec.recid);
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
      grid.sortData = [];
      sortIndex = 0;
    }
    if (direction === "") {
      grid.sortData.splice(sortIndex, 1);
    } else {
      grid.sortData[sortIndex] ??= {};
      Object.assign(grid.sortData[sortIndex], { field, direction });
    }
  } else {
    grid.sortData = [];
  }
  const url = grid.url?.get ?? grid.url;
  if (!url) {
    grid.localSort(false, true);
    if (grid.searchData.length > 0) grid.localSearch(true);
    grid.last.vscroll.scrollTop = 0;
    query20(grid.box).find(`#grid_${grid.name}_records`).prop("scrollTop", 0);
    edata.finish({ direction });
    grid.refresh();
  } else {
    edata.finish({ direction });
    grid.last.fetch.offset = 0;
    grid.reload();
  }
}
function copy(grid, flag, oEvent) {
  if (TsUtils.isPlainObject(flag)) {
    flag.finish();
    return flag.text;
  }
  const sel = grid.getSelection();
  if (sel.length === 0) return "";
  let text = "";
  if (typeof sel[0] == "object") {
    const cellSel = sel;
    let minCol = cellSel[0].column;
    let maxCol = cellSel[0].column;
    const recs = [];
    for (let s = 0; s < cellSel.length; s++) {
      if (cellSel[s].column < minCol) minCol = cellSel[s].column;
      if (cellSel[s].column > maxCol) maxCol = cellSel[s].column;
      if (recs.indexOf(cellSel[s].index) == -1) recs.push(cellSel[s].index);
    }
    recs.sort((a, b) => {
      return a - b;
    });
    for (let r = 0; r < recs.length; r++) {
      const ind = recs[r];
      for (let c = minCol; c <= maxCol; c++) {
        const col = grid.columns[c];
        if (col.hidden === true) continue;
        text += grid.getCellCopy(ind, c) + "	";
      }
      text = text.substr(0, text.length - 1);
      text += "\n";
    }
  } else {
    for (let c = 0; c < grid.columns.length; c++) {
      const col = grid.columns[c];
      if (col.hidden === true) continue;
      let colName = col.text ? col.text : col.field;
      if (col.text && col.text.length < 3 && col.tooltip) colName = col.tooltip;
      text += '"' + TsUtils.stripTags(colName) + '"	';
    }
    text = text.substr(0, text.length - 1);
    text += "\n";
    for (let s = 0; s < sel.length; s++) {
      const ind = grid.get(sel[s], true);
      for (let c = 0; c < grid.columns.length; c++) {
        const col = grid.columns[c];
        if (col.hidden === true) continue;
        text += '"' + grid.getCellCopy(ind, c) + '"	';
      }
      text = text.substr(0, text.length - 1);
      text += "\n";
    }
  }
  text = text.substr(0, text.length - 1);
  let edata;
  if (flag == null) {
    edata = grid.trigger("copy", {
      target: grid.name,
      text,
      cut: oEvent.keyCode == 88 ? true : false,
      originalEvent: oEvent
    });
    if (edata.isCancelled === true) return "";
    text = edata.detail["text"];
    edata.finish();
    return text;
  } else if (flag === false) {
    edata = grid.trigger("copy", {
      target: grid.name,
      text,
      cut: oEvent.keyCode == 88 ? true : false,
      originalEvent: oEvent
    });
    if (edata.isCancelled === true) return "";
    text = edata.detail["text"];
    return edata;
  }
}
function getCellCopy(grid, ind, col_ind) {
  return TsUtils.stripTags(grid.getCellHTML(ind, col_ind));
}
function paste(grid, text, event2) {
  const sel = grid.getSelectionCells();
  let ind = grid.get(sel[0].recid, true) ?? 0;
  const col = sel[0].column;
  const edata = grid.trigger("paste", { target: grid.name, text, index: ind, column: col, originalEvent: event2 });
  if (edata.isCancelled === true) return;
  let pasteText = edata.detail["text"];
  if (grid.selectType == "row" || sel.length === 0) {
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
      const rec = grid.records[ind];
      const cols = [];
      if (rec == null) continue;
      for (let dt = 0; dt < tmp.length; dt++) {
        if (!grid.columns[col + cnt]) continue;
        setCellPaste(rec, grid.columns[col + cnt].field, tmp[dt]);
        cols.push(col + cnt);
        cnt++;
      }
      for (let c = 0; c < cols.length; c++) newSel.push({ recid: rec.recid, column: cols[c] });
      ind++;
    }
    grid.selectNone(true);
    grid.select(newSel);
  } else {
    grid.selectNone(true);
    grid.select([{ recid: grid.records[ind].recid, column: col }]);
  }
  grid.refresh();
  edata.finish();
  function setCellPaste(rec, field, paste2) {
    rec.TsUi = rec.TsUi ?? {};
    rec.TsUi["changes"] = rec.TsUi["changes"] || {};
    rec.TsUi["changes"][field] = paste2;
  }
}

// src/grid-render.ts
var query21 = query;
var TsMenu5 = TsMenu;
var TsTooltip5 = TsTooltip;
function resize(grid) {
  const time = Date.now();
  if (!grid.box || query21(grid.box).attr("name") != grid.name) return;
  const edata = grid.trigger("resize", { target: grid.name });
  if (edata.isCancelled === true) return;
  if (grid.box != null) {
    grid.resizeBoxes();
    grid.resizeRecords();
  }
  edata.finish();
  return Date.now() - time;
}
function update(grid, { cells, fullCellRefresh, ignoreColumns } = {}) {
  const time = Date.now();
  const self = grid;
  if (grid.box == null) return 0;
  if (Array.isArray(cells)) {
    for (let i = 0; i < cells.length; i++) {
      const index = cells[i].index;
      const column = cells[i].column;
      if (index < 0) continue;
      if (index == null || column == null) {
        console.log("ERROR: Wrong argument for grid.update({ cells }), cells should be [{ index: X, column: Y }, ...]");
        continue;
      }
      const rec = grid.records[index] ?? {};
      rec.TsUi = rec.TsUi ?? {};
      rec.TsUi["_update"] = rec.TsUi["_update"] ?? { cells: [] };
      let row1 = rec.TsUi["_update"].row1;
      let row2 = rec.TsUi["_update"].row2;
      if (row1 == null || !row1.isConnected || row2 == null || !row2.isColSelected) {
        row1 = grid.box.querySelector(`#grid_${grid.name}_rec_${TsUtils.escapeId(rec.recid)}`);
        row2 = grid.box.querySelector(`#grid_${grid.name}_frec_${TsUtils.escapeId(rec.recid)}`);
        rec.TsUi["_update"].row1 = row1;
        rec.TsUi["_update"].row2 = row2;
      }
      _update(rec, row1, row2, index, column);
    }
  } else {
    for (let i = (grid.last.vscroll.recIndStart ?? 0) - 1; i <= (grid.last.vscroll.recIndEnd ?? 0); i++) {
      let index = i;
      if (grid.last.searchIds.length > 0) {
        index = grid.last.searchIds[i] ?? i;
      } else {
        index = i;
      }
      const rec = grid.records[index];
      if (index < 0 || rec == null) continue;
      rec.TsUi = rec.TsUi ?? {};
      rec.TsUi["_update"] = rec.TsUi["_update"] ?? { cells: [] };
      let row1 = rec.TsUi["_update"].row1;
      let row2 = rec.TsUi["_update"].row2;
      if (row1 == null || !row1.isConnected || row2 == null || !row2.isColSelected) {
        row1 = grid.box.querySelector(`#grid_${grid.name}_rec_${TsUtils.escapeId(rec.recid)}`);
        row2 = grid.box.querySelector(`#grid_${grid.name}_frec_${TsUtils.escapeId(rec.recid)}`);
        rec.TsUi["_update"].row1 = row1;
        rec.TsUi["_update"].row2 = row2;
      }
      for (let column = 0; column < grid.columns.length; column++) {
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
    let cell = rec.TsUi["_update"].cells[column];
    if (cell == null || !cell.isConnected) {
      cell = self.box.querySelector(`#grid_${self.name}_data_${index}_${column}`);
      rec.TsUi["_update"].cells[column] = cell;
    }
    if (cell == null) return;
    if (fullCellRefresh) {
      query21(cell).replace(self.getCellHTML(index, column, false));
      cell = self.box.querySelector(`#grid_${self.name}_data_${index}_${column}`);
      rec.TsUi["_update"].cells[column] = cell;
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
        const ignore = ["tsg-grid-data"];
        const remove2 = [];
        const add2 = className.split(" ").filter((cl) => !!cl);
        cell.classList.forEach((cl) => {
          if (!ignore.includes(cl)) remove2.push(cl);
        });
        cell.classList.remove(...remove2);
        cell.classList.add(...add2);
      }
    }
    if (self.columns[column]?.style && self.columns[column]?.style != cell.style.cssText) {
      cell.style.cssText = self.columns[column]?.style ?? "";
    }
    if (rec.TsUi.class != null) {
      if (typeof rec.TsUi.class == "string") {
        const ignore = ["tsg-odd", "tsg-even", "tsg-record"];
        const remove2 = [];
        const add2 = rec["TsUi"]["class"].split(" ").filter((cl) => !!cl);
        if (row1 && row2) {
          row1.classList.forEach((cl) => {
            if (!ignore.includes(cl)) remove2.push(cl);
          });
          row1.classList.remove(...remove2);
          row1.classList.add(...add2);
          row2.classList.remove(...remove2);
          row2.classList.add(...add2);
        }
      }
      if (TsUtils.isPlainObject(rec.TsUi.class) && typeof rec.TsUi.class[pcol?.field ?? ""] == "string") {
        const ignore = ["tsg-grid-data"];
        const remove2 = [];
        const add2 = rec["TsUi"]["class"][pcol.field].split(" ").filter((cl) => !!cl);
        cell.classList.forEach((cl) => {
          if (!ignore.includes(cl)) remove2.push(cl);
        });
        cell.classList.remove(...remove2);
        cell.classList.add(...add2);
      }
    }
    if (rec.TsUi.style != null || rec.TsUi.styles != null) {
      if (row1 && row2 && typeof rec.TsUi.style == "string" && row1.style.cssText !== rec.TsUi.style) {
        row1.style.cssText = "height: " + self.recordHeight + "px;" + rec.TsUi.style;
        row1.setAttribute("custom_style", rec.TsUi.style);
        row2.style.cssText = "height: " + self.recordHeight + "px;" + rec.TsUi.style;
        row2.setAttribute("custom_style", rec.TsUi.style);
      }
      if (rec.TsUi.styles == null) {
        rec.TsUi.styles = rec.TsUi.style;
      }
      if (TsUtils.isPlainObject(rec.TsUi.styles) && typeof rec.TsUi.styles[pcol?.field ?? ""] == "string" && cell.style.cssText !== rec.TsUi.styles[pcol?.field ?? ""]) {
        cell.style.cssText = rec.TsUi.styles[pcol.field];
      }
    }
  }
}
function refreshCell(grid, recid, field) {
  const index = grid.get(recid, true);
  const col_ind = grid.getColumn(field, true);
  if (index == null || col_ind == null) return false;
  const isSummary = grid.records[index] && grid.records[index].recid == recid ? false : true;
  const cell = query21(grid.box).find(`${isSummary ? ".tsg-grid-summary " : ""}#grid_${grid.name}_data_${index}_${col_ind}`);
  if (cell.length == 0) return false;
  cell.replace(grid.getCellHTML(index, col_ind, isSummary));
  return true;
}
function refreshRow(grid, recid, ind = null) {
  let tr1 = query21(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(recid));
  let tr2 = query21(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(recid));
  if (tr1.length > 0) {
    if (ind == null) ind = grid.get(recid, true);
    const line = tr1.attr("line");
    const isSummary = grid.records[ind] && grid.records[ind].recid == recid ? false : true;
    const url = grid.url?.get ?? grid.url;
    if (grid.searchData.length > 0 && !url) {
      for (let s = 0; s < grid.last.searchIds.length; s++) if (grid.last.searchIds[s] == ind) ind = s;
    }
    const rec_html = grid.getRecordHTML(ind, line, isSummary);
    tr1.replace(rec_html[0]);
    tr2.replace(rec_html[1]);
    let st = grid.records[ind].TsUi ? grid.records[ind].TsUi["style"] : "";
    if (typeof st == "string") {
      tr1 = query21(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(recid));
      tr2 = query21(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(recid));
      tr1.attr("custom_style", st);
      tr2.attr("custom_style", st);
      if (tr1.hasClass("tsg-selected")) {
        st = st.replace("background-color", "none");
      }
      tr1[0].style.cssText = "height: " + grid.recordHeight + "px;" + st;
      tr2[0].style.cssText = "height: " + grid.recordHeight + "px;" + st;
    }
    if (isSummary) {
      grid.resize();
    }
    return true;
  }
  return false;
}
function refresh(grid) {
  const time = Date.now();
  const url = grid.url?.get ?? grid.url;
  if (grid.total <= 0 && !url && grid.searchData.length === 0) {
    grid.total = grid.records.length;
  }
  if (!grid.box) return;
  const edata = grid.trigger("refresh", { target: grid.name });
  if (edata.isCancelled === true) return;
  if (grid.show.header) {
    query21(grid.box).find(`#grid_${grid.name}_header`).html(TsUtils.lang(grid.header) + "&#160;").show();
  } else {
    query21(grid.box).find(`#grid_${grid.name}_header`).hide();
  }
  if (grid.show.toolbar) {
    query21(grid.box).find("#grid_" + grid.name + "_toolbar").show();
  } else {
    query21(grid.box).find("#grid_" + grid.name + "_toolbar").hide();
  }
  grid.searchClose();
  const getFirstSearchField = () => {
    let tmp = 0;
    while (tmp < grid.searches.length && (grid.searches[tmp].hidden || grid.searches[tmp]["simple"] === false)) {
      tmp++;
    }
    if (tmp >= grid.searches.length) return { field: "", label: "" };
    return grid.searches[tmp];
  };
  if (!grid.multiSearch && grid.last.field == "all") {
    const fld = getFirstSearchField();
    grid.last.field = fld.field;
    grid.last.label = fld.label ?? "";
  }
  if (grid.last.field == "all" && !grid.show.searchAll) {
    grid.last.field = "";
  }
  if (!grid.last.field) {
    if (grid.show.searchAll) {
      grid.last.field = "all";
      grid.last.label = "All Fields";
    } else {
      const fld = getFirstSearchField();
      grid.last.field = fld.field;
      grid.last.label = fld.label ?? "";
    }
  }
  const sInput = query21(grid.box).find("#grid_" + grid.name + "_search_all");
  for (let ss = 0; ss < grid.searches.length; ss++) {
    if (grid.searches[ss].field == grid.last.field) {
      grid.last.label = grid.searches[ss].label ?? "";
    }
  }
  if (grid.last.multi) {
    sInput.attr("placeholder", "[" + TsUtils.lang("Multiple Fields") + "]");
  } else {
    sInput.attr("placeholder", TsUtils.lang("Search") + " " + TsUtils.lang(grid.last.label, true));
  }
  if (sInput.val() != grid.last.search) {
    let val = grid.last.search;
    const tmp = sInput._w2field;
    if (tmp) val = tmp.format(val);
    sInput.val(val);
  }
  grid.refreshSearch();
  grid.refreshBody();
  if (grid.show.footer) {
    query21(grid.box).find(`#grid_${grid.name}_footer`).html(grid.getFooterHTML()).show();
  } else {
    query21(grid.box).find(`#grid_${grid.name}_footer`).hide();
  }
  const sel = grid.last.selection, areAllSelected = grid.records.length > 0 && sel.indexes.length == grid.records.length, areAllSearchedSelected = sel.indexes.length > 0 && grid.searchData.length !== 0 && sel.indexes.length == grid.last.searchIds.length;
  if (areAllSelected || areAllSearchedSelected) {
    query21(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", true);
  } else {
    query21(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", false);
  }
  grid.status();
  const rows = grid.find({ "TsUi.expanded": true }, true, true);
  for (let r = 0; r < rows.length; r++) {
    const tmp = grid.records[rows[r]].TsUi;
    if (tmp && !Array.isArray(tmp.children)) {
      tmp.expanded = false;
    }
  }
  if (grid.markSearch) {
    setTimeout(() => {
      const search2 = [];
      for (let s = 0; s < grid.searchData.length; s++) {
        const sdata = grid.searchData[s];
        const fld = grid.getSearch(sdata.field);
        if (!fld || fld.hidden) continue;
        const ind = grid.getColumn(sdata.field, true);
        search2.push({ field: sdata.field, search: sdata["value"], col: ind });
      }
      if (search2.length > 0) {
        search2.forEach((item) => {
          const el = query21(grid.box).find('td[col="' + item.col + '"]:not(.tsg-head)');
          TsUtils.marker(el, item.search);
        });
      }
    }, 50);
  }
  grid.updateToolbar(grid.last.selection);
  edata.finish();
  grid.resize();
  grid.addRange("selection");
  setTimeout(() => {
    grid.resize();
    grid.scroll();
  }, 1);
  if (grid.reorderColumns && !grid.last.columnDrag) {
    grid.last.columnDrag = grid.initColumnDrag();
  } else if (!grid.reorderColumns && grid.last.columnDrag) {
    grid.last.columnDrag.remove();
  }
  return Date.now() - time;
}
function refreshSearch(grid) {
  if (grid.multiSearch && grid.searchData.length > 0) {
    if (query21(grid.box).find(".tsg-grid-searches").length == 0) {
      query21(grid.box).find(".tsg-grid-toolbar").css("height", grid.last.toolbar_height + 35 + "px").append(`<div id="grid_${grid.name}_searches" class="tsg-grid-searches"></div>`);
    }
    let searches = `
            <span id="grid_${grid.name}_search_logic" class="tsg-grid-search-logic"></span>
            <div class="grid-search-line"></div>`;
    grid.searchData.forEach((sd, sd_ind) => {
      const ind = grid.getSearch(sd.field, true);
      const sf = ind != null ? grid.searches[ind] : null;
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
            dsp1 = TsUtils.formatDate(dsp1);
          }
          if (Number(dsp2) === dsp2) {
            dsp2 = TsUtils.formatDate(dsp2);
          }
          display = `: ${dsp1} - ${dsp2}`;
        } else {
          let dsp = sd.value;
          if (Number(dsp) == dsp) {
            dsp = TsUtils.formatDate(dsp);
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
      searches += `<span class="tsg-action" data-click="searchFieldTooltip|${ind}|${sd_ind}|this">
                ${sf ? sf.label ?? sf.field : sd.field}
                ${display}
                <span class="icon-chevron-down"></span>
            </span>`;
    });
    searches += `
            ${grid.show.searchSave ? `<div class="grid-search-line"></div>
                   <button class="tsg-btn grid-search-btn" data-click="searchSave" type="button">${TsUtils.lang("Save")}</button>
                  ` : ""}
            <button class="tsg-btn grid-search-btn btn-remove" type="button"
                data-click="searchReset">X</button>
        `;
    query21(grid.box).find(`#grid_${grid.name}_searches`).html(searches);
    query21(grid.box).find(`#grid_${grid.name}_search_logic`).html(TsUtils.lang(grid.last.logic == "AND" ? "All" : "Any"));
  } else {
    query21(grid.box).find(".tsg-grid-toolbar").css("height", grid.last.toolbar_height + "px").find(".tsg-grid-searches").remove();
  }
  if (grid["searchSelected"]) {
    query21(grid.box).find(`#grid_${grid.name}_search_all`).val(" ").prop("readOnly", true);
    query21(grid.box).find(`#grid_${grid.name}_search_name`).show().find(".name-text").html(grid["searchSelected"].text);
  } else {
    query21(grid.box).find(`#grid_${grid.name}_search_all`).prop("readOnly", false);
    query21(grid.box).find(`#grid_${grid.name}_search_name`).hide().find(".name-text").html("");
  }
  TsUtils.bindEvents(query21(grid.box).find(`#grid_${grid.name}_searches .tsg-action, #grid_${grid.name}_searches button`), grid);
}
function refreshBody(grid) {
  grid.updateExpanded();
  grid.scroll();
  const recHTML = grid.getRecordsHTML();
  const colHTML = grid.getColumnsHTML();
  const bodyHTML = '<div id="grid_' + grid.name + '_frecords" class="tsg-grid-frecords" style="margin-bottom: ' + (TsUtils.scrollBarSize() - 1) + 'px;">' + recHTML[0] + '</div><div id="grid_' + grid.name + '_records" class="tsg-grid-records">' + recHTML[1] + '</div><div id="grid_' + grid.name + '_scroll1" class="tsg-grid-scroll1" style="height: ' + TsUtils.scrollBarSize() + 'px"></div><div id="grid_' + grid.name + '_fcolumns" class="tsg-grid-fcolumns">    <table><tbody>' + colHTML[0] + '</tbody></table></div><div id="grid_' + grid.name + '_columns" class="tsg-grid-columns">    <table><tbody>' + colHTML[1] + `</tbody></table></div><div class="tsg-intersection-marker" style="display: none; height: ${grid.recordHeight - 5}px">
           <div class="top-marker"></div>
           <div class="bottom-marker"></div>
        </div>`;
  const gridBody = query21(grid.box).find(`#grid_${grid.name}_body`, grid.box).html(bodyHTML);
  const records = query21(grid.box).find(`#grid_${grid.name}_records`, grid.box);
  const frecords = query21(grid.box).find(`#grid_${grid.name}_frecords`, grid.box);
  if (grid.selectType == "row") {
    records.on("mouseover mouseout", { delegate: "tr" }, (event2) => {
      const ind = query21(event2.delegate).attr("index");
      const recid = grid.records[ind]?.recid;
      query21(grid.box).find(`#grid_${grid.name}_frec_${TsUtils.escapeId(recid)}`).toggleClass("tsg-record-hover", event2.type == "mouseover");
    });
    frecords.on("mouseover mouseout", { delegate: "tr" }, (event2) => {
      const ind = query21(event2.delegate).attr("index");
      const recid = grid.records[ind]?.recid;
      query21(grid.box).find(`#grid_${grid.name}_rec_${TsUtils.escapeId(recid)}`).toggleClass("tsg-record-hover", event2.type == "mouseover");
    });
  }
  if (TsUtils.isMobile) {
    records.append(frecords).on("click", { delegate: "tr" }, (event2) => {
      const index = query21(event2.delegate).attr("index");
      const recid = grid.records[index]?.recid;
      grid.click(recid, event2);
    }).on("touchstart", { delegate: "tr" }, (event2) => {
      const index = query21(event2.delegate).attr("index");
      const recid = grid.records[index]?.recid;
      if (grid.last["mobile_touch"] && Date.now() - grid.last["mobile_touch"] < 350) {
        event2.preventDefault();
        grid.dblClick(recid, event2);
      }
      grid.last["mobile_touch"] = Date.now();
      setTimeout(() => grid.last["mobile_touch"] = null, 350);
    }).on("contextmenu", { delegate: "tr" }, (event2) => {
      const index = parseInt(query21(event2.delegate).attr("index"));
      const recid = grid.records[index]?.recid;
      const td = query21(event2.target).closest("td");
      const column = td.attr("col") ? parseInt(td.attr("col")) : void 0;
      const ctxOpts = { index };
      if (recid != null) ctxOpts.recid = recid;
      if (column != null) ctxOpts.column = column;
      grid.showContextMenu(event2, ctxOpts);
    });
  } else {
    records.add(frecords).on("click", { delegate: "tr" }, (event2) => {
      const index = query21(event2.delegate).attr("index");
      const recid = grid.records[index]?.recid;
      if (recid != "-none-" && !grid.last.inEditMode) {
        grid.click(recid, event2);
      }
    }).on("contextmenu", { delegate: "tr" }, (event2) => {
      const index = parseInt(query21(event2.delegate).attr("index"));
      const recid = grid.records[index]?.recid;
      const td = query21(event2.target).closest("td");
      const column = td.attr("col") ? parseInt(td.attr("col")) : void 0;
      const ctxOpts = { index };
      if (recid != null) ctxOpts.recid = recid;
      if (column != null) ctxOpts.column = column;
      grid.showContextMenu(event2, ctxOpts);
    }).on("mouseover", { delegate: "tr" }, (event2) => {
      grid.last["rec_out"] = false;
      const index = query21(event2.delegate).attr("index");
      const recid = grid.records[index]?.recid;
      if (index !== grid.last["rec_over"]) {
        grid.last["rec_over"] = index;
        setTimeout(() => {
          delete grid.last["rec_out"];
          const edata = grid.trigger("mouseEnter", { target: grid.name, originalEvent: event2, index, recid });
          edata.finish();
        });
      }
    }).on("mouseout", { delegate: "tr" }, (event2) => {
      const index = query21(event2.delegate).attr("index");
      const recid = grid.records[index]?.recid;
      grid.last["rec_out"] = true;
      setTimeout(() => {
        const recLeave = () => {
          const edata = grid.trigger("mouseLeave", { target: grid.name, originalEvent: event2, index, recid });
          edata.finish();
        };
        if (index !== grid.last["rec_over"]) {
          recLeave();
        }
        setTimeout(() => {
          if (grid.last["rec_out"]) {
            delete grid.last["rec_out"];
            delete grid.last["rec_over"];
            recLeave();
          }
        });
      });
    });
  }
  gridBody.data("scroll", { lastDelta: 0, lastTime: 0 }).find(".tsg-grid-frecords").on("mousewheel DOMMouseScroll ", (event2) => {
    event2.preventDefault();
    const scroll2 = gridBody.data("scroll");
    const container = gridBody.find(".tsg-grid-records");
    let amount = typeof event2.wheelDelta != "undefined" ? -event2.wheelDelta : event2.detail || event2.deltaY;
    const newScrollTop = container.prop("scrollTop");
    scroll2.lastDelta += amount;
    amount = Math.round(scroll2.lastDelta);
    gridBody.data("scroll", scroll2);
    container.get(0).scroll({ top: newScrollTop + amount, behavior: "smooth" });
  });
  records.off(".body-global").on("scroll.body-global", { delegate: ".tsg-grid-records" }, (event2) => {
    grid.scroll(event2);
  });
  query21(grid.box).find(".tsg-grid-body").off(".body-global").on("click.body-global dblclick.body-global contextmenu.body-global", { delegate: "td.tsg-head" }, (event2) => {
    const col_ind = parseInt(query21(event2.delegate).attr("col"));
    const col = grid.columns[col_ind] ?? { field: String(col_ind) };
    switch (event2.type) {
      case "click":
        grid.columnClick(col.field, event2);
        break;
      case "dblclick":
        grid.columnDblClick(col.field, event2);
        break;
      case "contextmenu":
        if (grid.show.columnMenu) {
          grid.columnContextMenu(col.field, event2);
        } else {
          grid.showContextMenu(event2, { column: col_ind ?? void 0 });
        }
        break;
    }
  }).on("mouseover.body-global", { delegate: ".tsg-col-header" }, (event2) => {
    const col = query21(event2.delegate).parent().attr("col");
    grid.columnTooltipShow(col, event2);
    query21(event2.delegate).off(".tooltip").on("mouseleave.tooltip", () => {
      grid.columnTooltipHide(col, event2);
    });
  }).on("click.body-global", { delegate: "input.tsg-select-all" }, (event2) => {
    if (event2.delegate.checked) {
      grid.selectAll();
    } else {
      grid.selectNone();
    }
    event2.stopPropagation();
    clearTimeout(grid.last.kbd_timer ?? void 0);
  }).on("click.body-global", { delegate: ".tsg-show-children, .tsg-col-expand" }, (event2) => {
    event2.stopPropagation();
    const ind = query21(event2.target).parents("tr").attr("index");
    grid.toggle(grid.records[ind].recid);
  }).on("click.body-global mouseover.body-global", { delegate: ".tsg-info" }, (event2) => {
    const td = query21(event2.delegate).closest("td");
    const tr = td.parent();
    const col = grid.columns[td.attr("col")];
    const isSummary = tr.parents(".tsg-grid-body").hasClass("tsg-grid-summary");
    if (["mouseenter", "mouseover"].includes(col?.["info"]?.showOn?.toLowerCase()) && event2.type == "mouseover") {
      grid.showBubble(parseInt(tr.attr("index")), parseInt(td.attr("col")), isSummary).then(() => {
        query21(event2.delegate).off(".tooltip").on("mouseleave.tooltip", () => {
          TsTooltip5.hide(grid.name + "-bubble");
        });
      });
    } else if (event2.type == "click") {
      TsTooltip5.hide(grid.name + "-bubble");
      grid.showBubble(parseInt(tr.attr("index")), parseInt(td.attr("col")), isSummary);
    }
  }).on("mouseover.body-global", { delegate: ".tsg-clipboard-copy" }, (event2) => {
    if (event2.delegate._tooltipShow) return;
    const td = query21(event2.delegate).parent();
    const tr = td.parent();
    const col = grid.columns[td.attr("col")];
    const isSummary = tr.parents(".tsg-grid-body").hasClass("tsg-grid-summary");
    TsTooltip5.show({
      name: grid.name + "-bubble",
      anchor: event2.delegate,
      html: TsUtils.lang(typeof col?.clipboardCopy == "string" ? col.clipboardCopy : "Copy to clipboard"),
      position: "top|bottom",
      offsetY: -2
    });
    query21(event2.delegate).off(".tooltip").on("mouseleave.tooltip", (_evt) => {
      TsTooltip5.hide(grid.name + "-bubble");
    }).on("click.tooltip", (evt) => {
      evt.stopPropagation();
      TsTooltip5.update(grid.name + "-bubble", TsUtils.lang("Copied"));
      grid.clipboardCopy(tr.attr("index"), td.attr("col"), isSummary);
    });
    event2.delegate._tooltipShow = true;
  }).on("click.body-global", { delegate: ".tsg-editable-checkbox" }, (event2) => {
    const dt = query21(event2.delegate).data();
    grid.editChange.call(grid, event2.delegate, dt.changeind, dt.colind, event2);
    grid.updateToolbar();
  });
  if (grid.records.length === 0 && grid.msgEmpty) {
    query21(grid.box).find(`#grid_${grid.name}_body`).append(`<div id="grid_${grid.name}_empty_msg" class="tsg-grid-empty-msg"><div>${TsUtils.lang(grid.msgEmpty)}</div></div>`);
  } else if (query21(grid.box).find(`#grid_${grid.name}_empty_msg`).length > 0) {
    query21(grid.box).find(`#grid_${grid.name}_empty_msg`).remove();
  }
  if (grid.summary.length > 0) {
    const sumHTML = grid.getSummaryHTML();
    query21(grid.box).find(`#grid_${grid.name}_fsummary`).html(sumHTML?.[0] ?? "").show();
    query21(grid.box).find(`#grid_${grid.name}_summary`).html(sumHTML?.[1] ?? "").show();
  } else {
    query21(grid.box).find(`#grid_${grid.name}_fsummary`).hide();
    query21(grid.box).find(`#grid_${grid.name}_summary`).hide();
  }
}
function destroy(grid) {
  const edata = grid.trigger("destroy", { target: grid.name });
  if (edata.isCancelled === true) return;
  grid.toolbar?.destroy?.();
  if (query21(grid.box).find(`#grid_${grid.name}_body`).length > 0) {
    grid.unmount();
  }
  delete TsUi[grid.name];
  edata.finish();
}
function initColumnOnOff(grid) {
  const items = [
    { id: "line-numbers", text: "Line #", checked: grid.show.lineNumbers }
  ];
  for (let c = 0; c < grid.columns.length; c++) {
    const col = grid.columns[c];
    let text = col.text;
    if (col.hideable === false) continue;
    if (!text && col.tooltip) text = col.tooltip;
    if (!text) text = "- column " + (c + 1) + " -";
    items.push({ id: col.field, text: TsUtils.stripTags(text), checked: !col.hidden });
  }
  const url = grid.url?.get ?? grid.url;
  if (url && grid.show.skipRecords || grid.show.saveRestoreState) {
    items.push({ text: "--" });
  }
  if (grid.show.skipRecords) {
    const skip = TsUtils.lang("Skip") + `<input id="${grid.name}_skip" type="text" class="tsg-input tsg-grid-skip" value="${grid.offset}">` + TsUtils.lang("records");
    items.push({ id: "tsg-skip", text: skip, group: false, icon: "tsg-icon-empty" });
  }
  if (grid.show.saveRestoreState) {
    items.push(
      { id: "tsg-stateSave", text: TsUtils.lang("Save Grid State"), icon: "tsg-icon-empty", group: false },
      { id: "tsg-stateReset", text: TsUtils.lang("Restore Default State"), icon: "tsg-icon-empty", group: false }
    );
  }
  const selected = [];
  items.forEach((item) => {
    item.text = TsUtils.lang(item.text);
    if (item.checked) selected.push(item.id);
  });
  grid.toolbar.set("tsg-column-on-off", { selected, items });
  return items;
}
function initColumnDrag(grid, _box) {
  if (grid.columnGroups && grid.columnGroups.length) {
    throw "Draggable columns are not currently supported with column groups.";
  }
  const self = grid;
  let dragData = {
    pressed: false,
    targetPos: null,
    columnHead: null
  };
  const hasInvalidClass = (target, lastColumn) => {
    const iClass = ["tsg-col-number", "tsg-col-expand", "tsg-col-select"];
    if (lastColumn !== true) iClass.push("tsg-head-last");
    for (let i = 0; i < iClass.length; i++) {
      if (query21(target).closest(".tsg-head").hasClass(iClass[i])) {
        return true;
      }
    }
    return false;
  };
  query21(self.box).off(".colDrag").on("mousedown.colDrag", dragColStart);
  function dragColStart(event2) {
    if (dragData.pressed || dragData["numberPreColumnsPresent"] === 0 || event2.button !== 0) return;
    const preColHeadersSelector = ".tsg-head.tsg-col-number, .tsg-head.tsg-col-expand, .tsg-head.tsg-col-select";
    if (!query21(event2.target).parents().hasClass("tsg-head") || hasInvalidClass(event2.target)) return;
    dragData.pressed = true;
    dragData["initialX"] = event2.pageX;
    dragData["initialY"] = event2.pageY;
    dragData["numberPreColumnsPresent"] = query21(self.box).find(preColHeadersSelector).length;
    const origColumn = dragData.columnHead = query21(event2.target).closest(".tsg-head");
    const origColumnNumber = dragData["originalPos"] = parseInt(origColumn.attr("col"), 10);
    const edata = self.trigger("columnDragStart", { originalEvent: event2, origColumnNumber, target: origColumn[0] });
    if (edata.isCancelled === true) return false;
    const columns = dragData["columns"] = query21(self.box).find(".tsg-head:not(.tsg-head-last)");
    query21(document).on("mouseup.colDrag", dragColEnd);
    query21(document).on("mousemove.colDrag", dragColOver);
    const col = self.columns[dragData["originalPos"]];
    const colText = TsUtils.lang(typeof col.text == "function" ? col.text(col) : col.text);
    dragData["ghost"] = query.html(`<span col="${dragData["originalPos"]}">${colText}</span>`)[0];
    query21(document.body).append(dragData["ghost"]);
    query21(dragData["ghost"]).css({
      display: "none",
      left: event2.pageX,
      top: event2.pageY,
      opacity: 1,
      margin: "3px 0 0 20px",
      padding: "3px",
      "background-color": "white",
      position: "fixed",
      "z-index": 999999
    }).addClass(".tsg-grid-ghost");
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
      const ghosts = query21(self.box).find(".tsg-grid-ghost");
      query21(self.box).find(".tsg-intersection-marker").hide();
      query21(dragData["ghost"]).remove();
      ghosts.remove();
      query21(document).off(".colDrag");
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
      columnConfig.splice(dragData.targetPos, 0, TsUtils.clone(selected));
      columnConfig.splice(columnConfig.indexOf(selected), 1);
    }
    finish();
    self.refresh();
    edata.finish({ targetColumn: (target ?? 1) - 1 });
  }
  function markIntersection(event2) {
    if (query21(event2.target).closest("td").length == 0) {
      return;
    }
    const td = query21(event2.target).closest("td");
    const newPos = td.hasClass("tsg-head-last") ? self.columns.length : parseInt(td.attr("col"));
    if (dragData.targetPos != newPos) {
      const rect1 = query21(self.box).find(".tsg-grid-body").get(0).getBoundingClientRect();
      const rect2 = query21(event2.target).closest("td").get(0).getBoundingClientRect();
      query21(self.box).find(".tsg-intersection-marker").show().css({
        left: rect2.left - rect1.left + "px",
        height: rect2.height + "px"
      });
      dragData.targetPos = newPos;
    }
    return;
  }
  function trackGhost(cursorX, cursorY) {
    query21(dragData["ghost"]).css({
      left: cursorX - 10 + "px",
      top: cursorY - 10 + "px"
    }).show();
  }
  return {
    remove() {
      query21(self.box).off(".colDrag");
      self.last.columnDrag = false;
    }
  };
}
function columnOnOff(grid, event2, field) {
  const edata = grid.trigger("columnOnOff", { target: grid.name, field, originalEvent: event2 });
  if (edata.isCancelled === true) return;
  const rows = grid.find({ "TsUi.expanded": true }, true);
  for (let r = 0; r < rows.length; r++) {
    const tmp = grid.records[r].TsUi;
    if (tmp && !Array.isArray(tmp.children)) {
      grid.records[r].TsUi.expanded = false;
    }
  }
  if (field == "line-numbers") {
    grid.show.lineNumbers = !grid.show.lineNumbers;
    grid.refresh();
  } else {
    const col = grid.getColumn(field);
    if (col != null && col.hidden) {
      grid.showColumn(col.field);
    } else if (col != null) {
      grid.hideColumn(col.field);
    }
  }
  edata.finish();
}
function initToolbar(grid) {
  if (grid.toolbar.render != null) {
    return;
  }
  let tb_items = grid.toolbar.items || [];
  grid.toolbar.items = [];
  grid.toolbar = new TsToolbar(TsUtils.extend({}, grid.toolbar, { name: grid.name + "_toolbar", owner: grid }));
  if (grid.show.toolbarReload) {
    grid.toolbar.items.push(TsUtils.extend({}, grid.buttons["reload"]));
  }
  if (grid.show.toolbarColumns) {
    grid.toolbar.items.push(TsUtils.extend({}, grid.buttons["columns"]));
  }
  if (grid.show.toolbarSearch) {
    const html = `
            <div class="tsg-grid-search-input">
                ${grid.buttons["search"].html}
                <div id="grid_${grid.name}_search_name" class="tsg-grid-search-name">
                    <span class="name-icon tsg-icon-search"></span>
                    <span class="name-text"></span>
                    <span class="name-cross tsg-action" data-click="searchReset">x</span>
                </div>
                <input type="text" id="grid_${grid.name}_search_all" class="tsg-search-all" tabindex="-1"
                    autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                    placeholder="${TsUtils.lang(grid.last.label, true)}" value="${grid.last.search}"
                    data-focus="searchSuggest" data-click="stop"
                >
                <div class="tsg-search-drop tsg-action" data-click="searchOpen"
                        style="${grid.multiSearch ? "" : "display: none"}">
                    <span class="tsg-icon-drop"></span>
                </div>
            </div>`;
    grid.toolbar.items.push({
      id: "tsg-search",
      type: "html",
      html,
      // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onRefresh: async (event2) => {
        await event2.complete;
        const input = query21(grid.box).find(`#grid_${grid.name}_search_all`);
        TsUtils.bindEvents(query21(grid.box).find(`#grid_${grid.name}_search_all, .tsg-action`), grid);
        const slowSearch = TsUtils.debounce((event3) => {
          const val = event3.target.value;
          if (grid.liveSearch && grid.last["liveText"] != val) {
            grid.last["liveText"] = val;
            grid.search(grid.last.field, val);
          }
        }, 250);
        input.on("blur", () => {
          grid.last["liveText"] = "";
        }).on("keyup", (event3) => {
          switch (event3.keyCode) {
            case 40: {
              grid.searchSuggest(true);
              break;
            }
            case 38: {
              grid.searchSuggest(true, true);
              break;
            }
            case 13: {
              TsMenu5.hide(grid.name + "-search-suggest");
              grid.search(grid.last.field, event3.target.value);
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
    if (grid.show.toolbarAdd && !ids.includes(grid.buttons["add"].id)) {
      grid.toolbar.items.push(TsUtils.extend({}, grid.buttons["add"]));
    }
    if (grid.show.toolbarEdit && !ids.includes(grid.buttons["edit"].id)) {
      grid.toolbar.items.push(TsUtils.extend({}, grid.buttons["edit"]));
    }
    if (grid.show.toolbarDelete && !ids.includes(grid.buttons["delete"].id)) {
      grid.toolbar.items.push(TsUtils.extend({}, grid.buttons["delete"]));
    }
    if (grid.show.toolbarSave && !ids.includes(grid.buttons["save"].id)) {
      if (grid.show.toolbarAdd || grid.show.toolbarDelete || grid.show.toolbarEdit) {
        grid.toolbar.items.push({ type: "break", id: "tsg-break2" });
      }
      grid.toolbar.items.push(TsUtils.extend({}, grid.buttons["save"]));
    }
    tb_items = tb_items.map((item) => grid.buttons[item.name] ? TsUtils.extend({}, grid.buttons[item.name], item) : item);
  }
  grid.toolbar.items.push(...tb_items);
  grid.toolbar.on("click", (event2) => {
    const edata = grid.trigger("toolbar", { target: event2.target, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    let edata2;
    switch (event2.detail.item.id) {
      case "tsg-reload":
        edata2 = grid.trigger("reload", { target: grid.name });
        if (edata2.isCancelled === true) return false;
        grid.reload();
        edata2.finish();
        break;
      case "tsg-column-on-off":
        if (event2.detail.subItem) {
          const id = event2.detail.subItem.id;
          if (["tsg-stateSave", "tsg-stateReset"].includes(id)) {
            grid[id.substring(5)]();
          } else if (id == "tsg-skip") {
          } else {
            grid.columnOnOff(event2, event2.detail.subItem.id);
          }
        } else {
          grid.initColumnOnOff();
          setTimeout(() => {
            query21(`#w2overlay-${grid.name}_toolbar-drop .tsg-grid-skip`).off(".tsg-grid").on("click.tsg-grid", (evt) => {
              evt.stopPropagation();
            }).on("keypress", (evt) => {
              if (evt.keyCode == 13) {
                grid.skip(evt.target.value);
                grid.toolbar.click("tsg-column-on-off");
              }
            });
          }, 100);
        }
        break;
      case "tsg-add":
        edata2 = grid.trigger("add", { target: grid.name, recid: null });
        if (edata2.isCancelled === true) return false;
        edata2.finish();
        break;
      case "tsg-edit": {
        const sel = grid.getSelection();
        let recid = null;
        if (sel.length == 1) recid = sel[0];
        edata2 = grid.trigger("edit", { target: grid.name, recid });
        if (edata2.isCancelled === true) return false;
        edata2.finish();
        break;
      }
      case "tsg-delete":
        grid.delete();
        break;
      case "tsg-save":
        grid.save();
        break;
    }
    edata.finish();
  });
  grid.toolbar.on("refresh", (event2) => {
    if (event2.target == "tsg-search") {
      const sd = grid.searchData;
      setTimeout(() => {
        grid.searchInitInput(grid.last.field, sd.length == 1 ? sd[0].value : null);
      }, 1);
    }
  });
}
function initResize(grid) {
  const obj = grid;
  query21(grid.box).find(".tsg-resizer").off(".grid-col-resize").on("click.grid-col-resize", function(event2) {
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
      col: parseInt(query21(this).attr("name"))
      // 'this' is the DOM element
    };
    obj.last.tmp.tds = query21(obj.box).find("#grid_" + obj.name + '_body table tr:first-child td[col="' + obj.last.tmp.col + '"]');
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
      const edata2 = obj.trigger("columnResizeMove", TsUtils.extend(edata.detail, { resizeBy: event3.screenX - obj.last.tmp.gx, originalEvent: event3 }));
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
      query21(document).off(".grid-col-resize");
      obj.resizeRecords();
      obj.scroll();
      edata.finish({ originalEvent: event3 });
      setTimeout(() => {
        obj.last.colResizing = false;
      }, 1);
    };
    query21(document).off(".grid-col-resize").on("mousemove.grid-col-resize", mouseMove).on("mouseup.grid-col-resize", mouseUp);
  }).on("dblclick.grid-col-resize", function(event2) {
    const ind = parseInt(query21(this).attr("name"));
    obj.columnAutoSize(ind);
    event2.stopPropagation();
    event2.preventDefault();
  }).each((el) => {
    const td = query21(el).get(0).parentNode;
    query21(el).css({
      "height": td.clientHeight + "px",
      "margin-left": td.clientWidth - 3 + "px"
    });
  });
}
function resizeBoxes(grid) {
  const header = query21(grid.box).find(`#grid_${grid.name}_header`);
  const toolbar = query21(grid.box).find(`#grid_${grid.name}_toolbar`);
  const fsummary = query21(grid.box).find(`#grid_${grid.name}_fsummary`);
  const summary = query21(grid.box).find(`#grid_${grid.name}_summary`);
  const footer = query21(grid.box).find(`#grid_${grid.name}_footer`);
  const body = query21(grid.box).find(`#grid_${grid.name}_body`);
  if (grid.show.header) {
    header.css({ top: "0px", left: "0px", right: "0px" });
  }
  if (grid.show.toolbar) {
    toolbar.css({
      top: 0 + (grid.show.header ? TsUtils.getSize(header, "height") : 0) + "px",
      left: "0px",
      right: "0px"
    });
  }
  if (grid.summary.length > 0) {
    fsummary.css({
      bottom: 0 + (grid.show.footer ? TsUtils.getSize(footer, "height") : 0) + "px"
    });
    summary.css({
      bottom: 0 + (grid.show.footer ? TsUtils.getSize(footer, "height") : 0) + "px",
      right: "0px"
    });
  }
  if (grid.show.footer) {
    footer.css({ bottom: "0px", left: "0px", right: "0px" });
  }
  body.css({
    top: 0 + (grid.show.header ? TsUtils.getSize(header, "height") : 0) + (grid.show.toolbar ? TsUtils.getSize(toolbar, "height") : 0) + "px",
    bottom: 0 + (grid.show.footer ? TsUtils.getSize(footer, "height") : 0) + (grid.summary.length > 0 ? TsUtils.getSize(summary, "height") : 0) + "px",
    left: "0px",
    right: "0px"
  });
}
function resizeRecords(grid) {
  const obj = grid;
  query21(grid.box).find(".tsg-empty-record").remove();
  const box = query21(grid.box);
  const gridEl = query21(grid.box).find(":scope > div.tsg-grid-box");
  const header = query21(grid.box).find(`#grid_${grid.name}_header`);
  const toolbar = query21(grid.box).find(`#grid_${grid.name}_toolbar`);
  const summary = query21(grid.box).find(`#grid_${grid.name}_summary`);
  const fsummary = query21(grid.box).find(`#grid_${grid.name}_fsummary`);
  const footer = query21(grid.box).find(`#grid_${grid.name}_footer`);
  const body = query21(grid.box).find(`#grid_${grid.name}_body`);
  const columns = query21(grid.box).find(`#grid_${grid.name}_columns`);
  const fcolumns = query21(grid.box).find(`#grid_${grid.name}_fcolumns`);
  const records = query21(grid.box).find(`#grid_${grid.name}_records`);
  const frecords = query21(grid.box).find(`#grid_${grid.name}_frecords`);
  const scroll1 = query21(grid.box).find(`#grid_${grid.name}_scroll1`);
  let lineNumberWidth = String(grid.total).length * 8 + 10;
  if (lineNumberWidth < 34) lineNumberWidth = 34;
  if (grid.lineNumberWidth != null) lineNumberWidth = grid.lineNumberWidth;
  let bodyOverflowX = false;
  let bodyOverflowY = false;
  let sWidth = 0;
  for (let i = 0; i < grid.columns.length; i++) {
    if (grid.columns[i].frozen || grid.columns[i].hidden) continue;
    const cSize = parseInt(grid.columns[i].sizeCalculated ? grid.columns[i].sizeCalculated : String(grid.columns[i].size ?? 0));
    sWidth += cSize;
  }
  if (records[0]?.clientWidth < sWidth) bodyOverflowX = true;
  if (body[0]?.clientHeight - (columns[0]?.clientHeight ?? 0) < (query21(records).find(":scope > table")[0]?.clientHeight ?? 0) + (bodyOverflowX ? TsUtils.scrollBarSize() : 0)) {
    bodyOverflowY = true;
  }
  if (!grid.fixedBody) {
    const bodyHeight = TsUtils.getSize(columns, "height") + TsUtils.getSize(query21(grid.box).find("#grid_" + grid.name + "_records table"), "height") + (bodyOverflowX ? TsUtils.scrollBarSize() : 0);
    const calculatedHeight = bodyHeight + (grid.show.header ? TsUtils.getSize(header, "height") : 0) + (grid.show.toolbar ? TsUtils.getSize(toolbar, "height") : 0) + (summary.css("display") != "none" ? TsUtils.getSize(summary, "height") : 0) + (grid.show.footer ? TsUtils.getSize(footer, "height") : 0);
    gridEl.css("height", calculatedHeight + "px");
    body.css("height", bodyHeight + "px");
    box.css("height", TsUtils.getSize(gridEl, "height") + "px");
  } else {
    const calculatedHeight = gridEl[0]?.clientHeight - (grid.show.header ? TsUtils.getSize(header, "height") : 0) - (grid.show.toolbar ? TsUtils.getSize(toolbar, "height") : 0) - (summary.css("display") != "none" ? TsUtils.getSize(summary, "height") : 0) - (grid.show.footer ? TsUtils.getSize(footer, "height") : 0);
    body.css("height", calculatedHeight + "px");
  }
  let buffered = grid.records.length;
  const url = grid.url?.get ?? grid.url;
  if (grid.searchData.length != 0 && !url) buffered = grid.last.searchIds.length;
  if (!grid.fixedBody) {
    bodyOverflowY = false;
  }
  if (bodyOverflowX || bodyOverflowY) {
    columns.find(":scope > table > tbody > tr:nth-child(1) td.tsg-head-last").css("width", TsUtils.scrollBarSize() + "px").show();
    records.css({
      top: (grid.columnGroups.length > 0 && grid.show.columns ? 1 : 0) + TsUtils.getSize(columns, "height") + "px",
      "-webkit-overflow-scrolling": "touch",
      "overflow-x": bodyOverflowX ? "auto" : "hidden",
      "overflow-y": bodyOverflowY ? "auto" : "hidden"
    });
  } else {
    columns.find(":scope > table > tbody > tr:nth-child(1) td.tsg-head-last").hide();
    records.css({
      top: (grid.columnGroups.length > 0 && grid.show.columns ? 1 : 0) + TsUtils.getSize(columns, "height") + "px",
      overflow: "hidden"
    });
    if (records.length > 0) {
      grid.last.vscroll.scrollTop = 0;
      grid.last.vscroll.scrollLeft = 0;
    }
  }
  if (bodyOverflowX) {
    frecords.css("margin-bottom", TsUtils.scrollBarSize() + "px");
    scroll1.show();
  } else {
    frecords.css("margin-bottom", 0);
    scroll1.hide();
  }
  frecords.css({ overflow: "hidden", top: records.css("top") });
  if (grid.show.emptyRecords && !bodyOverflowY) {
    let max = Math.floor((records[0]?.clientHeight ?? 0) / grid.recordHeight) - 1;
    let leftover = 0;
    if (records[0]) leftover = records[0].scrollHeight - max * grid.recordHeight;
    if (leftover >= grid.recordHeight) {
      leftover -= grid.recordHeight;
      max++;
    }
    if (grid.fixedBody) {
      for (let di = buffered; di < max; di++) {
        addEmptyRow(di, grid.recordHeight, grid);
      }
      addEmptyRow(max, leftover, grid);
    }
  }
  function addEmptyRow(row, height, grid2) {
    let html1 = "";
    let html2 = "";
    let htmlp = "";
    html1 += '<tr class="' + (row % 2 ? "tsg-even" : "tsg-odd") + ' tsg-empty-record" recid="-none-" style="height: ' + height + 'px">';
    html2 += '<tr class="' + (row % 2 ? "tsg-even" : "tsg-odd") + ' tsg-empty-record" recid="-none-" style="height: ' + height + 'px">';
    if (grid2.show.lineNumbers) html1 += '<td class="tsg-col-number"></td>';
    if (grid2.show.selectColumn) html1 += '<td class="tsg-grid-data tsg-col-select"></td>';
    if (grid2.show.expandColumn) html1 += '<td class="tsg-grid-data tsg-col-expand"></td>';
    html2 += '<td class="tsg-grid-data-spacer" col="start" style="border-right: 0"></td>';
    if (grid2.reorderRows) html2 += '<td class="tsg-grid-data tsg-col-order" col="order"></td>';
    for (let j = 0; j < grid2.columns.length; j++) {
      const col = grid2.columns[j];
      if ((col.hidden || j < grid2.last.vscroll.colIndStart || j > grid2.last.vscroll.colIndEnd) && !col.frozen) continue;
      htmlp = '<td class="tsg-grid-data" ' + (col.attr != null ? col.attr : "") + ' col="' + j + '"></td>';
      if (col.frozen) html1 += htmlp;
      else html2 += htmlp;
    }
    html1 += '<td class="tsg-grid-data-last"></td> </tr>';
    html2 += '<td class="tsg-grid-data-last" col="end"></td> </tr>';
    query21(grid2.box).find("#grid_" + grid2.name + "_frecords > table").append(html1);
    query21(grid2.box).find("#grid_" + grid2.name + "_records > table").append(html2);
  }
  let width_box, percent;
  if (body.length > 0) {
    let width_max = parseInt(body[0].clientWidth) - (bodyOverflowY ? TsUtils.scrollBarSize() : 0) - (grid.show.lineNumbers ? lineNumberWidth : 0) - (grid.reorderRows ? 26 : 0) - (grid.show.selectColumn ? 26 : 0) - (grid.show.expandColumn ? 26 : 0) - 1;
    width_box = width_max;
    percent = 0;
    let restart = false;
    for (let i = 0; i < grid.columns.length; i++) {
      const col = grid.columns[i];
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
      grid.refresh();
      return;
    }
    for (let i = 0; i < grid.columns.length; i++) {
      const col = grid.columns[i];
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
      for (let i = 0; i < grid.columns.length; i++) {
        const col = grid.columns[i];
        if (col.hidden) continue;
        if (col.sizeType == "%") {
          col["sizeCorrected"] = Math.round(parseFloat(String(col.size ?? 0)) * 100 * 100 / percent) / 100 + "%";
        }
      }
    }
    for (let i = 0; i < grid.columns.length; i++) {
      const col = grid.columns[i];
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
  for (let i = 0; i < grid.columns.length; i++) {
    const col = grid.columns[i];
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
      const col = grid.columns[i];
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
    columns.find(":scope > table > tbody > tr:nth-child(1) td.tsg-head-last").css("width", TsUtils.scrollBarSize() + "px").show();
  }
  let fwidth = 1;
  if (grid.show.lineNumbers) fwidth += lineNumberWidth;
  if (grid.show.selectColumn) fwidth += 26;
  if (grid.show.expandColumn) fwidth += 26;
  for (let i = 0; i < grid.columns.length; i++) {
    if (grid.columns[i].hidden) continue;
    if (grid.columns[i].frozen) fwidth += parseInt(grid.columns[i].sizeCalculated ?? "0");
  }
  fcolumns.css("width", fwidth + "px");
  frecords.css("width", fwidth + "px");
  fsummary.css("width", fwidth + "px");
  scroll1.css("width", fwidth + "px");
  columns.css({ left: fwidth + "px", "padding-left": "0.5px" });
  records.css({ left: fwidth + "px" });
  summary.css({ left: fwidth + "px" });
  columns.find(":scope > table > tbody > tr:nth-child(1) td").add(fcolumns.find(":scope > table > tbody > tr:nth-child(1) td")).each((el) => {
    if (query21(el).hasClass("tsg-col-number")) {
      query21(el).css("width", lineNumberWidth + "px");
    }
    const ind = query21(el).attr("col");
    if (ind != null) {
      if (ind == "start") {
        let width = 0;
        for (let i = 0; i < (obj.last.vscroll.colIndStart ?? 0); i++) {
          if (!obj.columns[i] || obj.columns[i].frozen || obj.columns[i].hidden) continue;
          width += parseInt(obj.columns[i].sizeCalculated ?? "0");
        }
        query21(el).css("width", width + "px");
      }
      if (obj.columns[ind]) query21(el).css("width", obj.columns[ind].sizeCalculated ?? "");
    }
    if (query21(el).hasClass("tsg-head-last")) {
      if ((obj.last.vscroll.colIndEnd ?? 0) + 1 < obj.columns.length) {
        let width = 0;
        for (let i = (obj.last.vscroll.colIndEnd ?? 0) + 1; i < obj.columns.length; i++) {
          if (!obj.columns[i] || obj.columns[i].frozen || obj.columns[i].hidden) continue;
          width += parseInt(obj.columns[i].sizeCalculated ?? "0");
        }
        query21(el).css("width", width + "px");
      } else {
        query21(el).css("width", TsUtils.scrollBarSize() + (width_diff > 0 && percent === 0 ? width_diff : 0) + "px");
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
    if (query21(el).hasClass("tsg-col-number")) {
      query21(el).css("width", lineNumberWidth + "px");
    }
    const ind = query21(el).attr("col");
    if (ind != null) {
      if (ind == "start") {
        let width = 0;
        for (let i = 0; i < (obj.last.vscroll.colIndStart ?? 0); i++) {
          if (!obj.columns[i] || obj.columns[i].frozen || obj.columns[i].hidden) continue;
          width += parseInt(obj.columns[i].sizeCalculated ?? "0");
        }
        query21(el).css("width", width + "px");
      }
      if (obj.columns[ind]) query21(el).css("width", obj.columns[ind].sizeCalculated ?? "");
    }
    if (query21(el).hasClass("tsg-grid-data-last") && query21(el).parents(".tsg-grid-frecords").length === 0) {
      if ((obj.last.vscroll.colIndEnd ?? 0) + 1 < obj.columns.length) {
        let width = 0;
        for (let i = (obj.last.vscroll.colIndEnd ?? 0) + 1; i < obj.columns.length; i++) {
          if (!obj.columns[i] || obj.columns[i].frozen || obj.columns[i].hidden) continue;
          width += parseInt(obj.columns[i].sizeCalculated ?? "0");
        }
        query21(el).css("width", width + "px");
      } else {
        query21(el).css("width", (width_diff > 0 && percent === 0 ? width_diff : 0) + "px");
      }
    }
  });
  summary.find(":scope > table > tbody > tr:nth-child(1) td").add(fsummary.find(":scope > table > tbody > tr:nth-child(1) td")).each((el) => {
    if (query21(el).hasClass("tsg-col-number")) {
      query21(el).css("width", lineNumberWidth + "px");
    }
    const ind = query21(el).attr("col");
    if (ind != null) {
      if (ind == "start") {
        let width = 0;
        for (let i = 0; i < (obj.last.vscroll.colIndStart ?? 0); i++) {
          if (!obj.columns[i] || obj.columns[i].frozen || obj.columns[i].hidden) continue;
          width += parseInt(obj.columns[i].sizeCalculated ?? "0");
        }
        query21(el).css("width", width + "px");
      }
      if (obj.columns[ind]) query21(el).css("width", obj.columns[ind].sizeCalculated ?? "");
    }
    if (query21(el).hasClass("tsg-grid-data-last") && query21(el).parents(".tsg-grid-frecords").length === 0) {
      query21(el).css("width", TsUtils.scrollBarSize() + (width_diff > 0 && percent === 0 ? width_diff : 0) + "px");
    }
  });
  grid.initResize();
  grid.refreshRanges();
  if ((grid.last.vscroll.scrollTop || grid.last.vscroll.scrollLeft) && records.length > 0) {
    columns.prop("scrollLeft", grid.last.vscroll.scrollLeft);
    records.prop("scrollTop", grid.last.vscroll.scrollTop);
    records.prop("scrollLeft", grid.last.vscroll.scrollLeft);
  }
  columns.css("will-change", "scroll-position");
}
function getColumnsHTML(grid) {
  const self = grid;
  let html1 = "";
  let html2 = "";
  if (grid.show.columnHeaders) {
    if (grid.columnGroups.length > 0) {
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
      html12 += '<td class="tsg-head tsg-col-number" col="line-number">    <div>&#160;</div></td>';
    }
    if (self.show.selectColumn) {
      html12 += '<td class="tsg-head tsg-col-select" col="select">    <div style="height: 25px">&#160;</div></td>';
    }
    if (self.show.expandColumn) {
      html12 += '<td class="tsg-head tsg-col-expand" col="expand">    <div style="height: 25px">&#160;</div></td>';
    }
    let ii = 0;
    html22 += `<td id="grid_${self.name}_column_start" class="tsg-head" col="start" style="border-right: 0"></td>`;
    if (self.reorderRows) {
      html22 += '<td class="tsg-head tsg-col-order" col="order">    <div style="height: 25px">&#160;</div></td>';
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
            if ((self.sortData[si].direction || "").toLowerCase() === "asc") sortStyle = "tsg-sort-up";
            if ((self.sortData[si].direction || "").toLowerCase() === "desc") sortStyle = "tsg-sort-down";
          }
        }
        let resizer = "";
        if (col.resizable !== false) {
          resizer = `<div class="tsg-resizer" name="${ii}"></div>`;
        }
        const text = TsUtils.lang(typeof col.text == "function" ? col.text(col) : col.text);
        tmpf = `<td id="grid_${self.name}_column_${ii}" class="tsg-head ${sortStyle}" col="${ii}"     rowspan="2" colspan="${colspan}">` + resizer + `    <div class="tsg-col-group tsg-col-header ${sortStyle ? "tsg-col-sorted" : ""}">        <div class="${sortStyle}"></div>` + (!text ? "&#160;" : text) + "    </div></td>";
        if (col && col.frozen) html12 += tmpf;
        else html22 += tmpf;
      } else {
        const gText = TsUtils.lang(typeof colg.text == "function" ? colg.text(colg) : colg.text);
        tmpf = `<td id="grid_${self.name}_column_${ii}" class="tsg-head" col="${ii}" colspan="${colspan}">    <div class="tsg-col-group" style="${colg.style ?? ""}">${!gText ? "&#160;" : gText}</div></td>`;
        if (col && col.frozen) html12 += tmpf;
        else html22 += tmpf;
      }
      ii += colg.span;
    }
    html12 += "<td></td></tr>";
    html22 += `<td id="grid_${self.name}_column_end" class="tsg-head" col="end"></td></tr>`;
    return [html12, html22];
  }
  function getColumns(main) {
    let html12 = "<tr>";
    let html22 = "<tr>";
    if (self.show.lineNumbers) {
      html12 += '<td class="tsg-head tsg-col-number" col="line-number">    <div>#</div></td>';
    }
    if (self.show.selectColumn) {
      html12 += `<td class="tsg-head tsg-col-select" col="select">    <div>        <input type="checkbox" id="grid_${self.name}_check_all" class="tsg-select-all" tabindex="-1"            style="${self.multiSelect == false ? "display: none;" : ""}"        >    </div></td>`;
    }
    if (self.show.expandColumn) {
      html12 += '<td class="tsg-head tsg-col-expand" col="expand">    <div>&#160;</div></td>';
    }
    let ii = 0;
    let id = 0;
    let colg;
    html22 += `<td id="grid_${self.name}_column_start" class="tsg-head" col="start" style="border-right: 0"></td>`;
    if (self.reorderRows) {
      html22 += '<td class="tsg-head tsg-col-order" col="order">    <div>&#160;</div></td>';
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
    html12 += '<td class="tsg-head tsg-head-last"><div>&#160;</div></td>';
    html22 += '<td class="tsg-head tsg-head-last" col="end"><div>&#160;</div></td>';
    html12 += "</tr>";
    html22 += "</tr>";
    return [html12, html22];
  }
}
function getColumnCellHTML(grid, i) {
  const col = grid.columns[i];
  if (col == null) return "";
  const reorderCols = grid.reorderColumns && (!grid.columnGroups || !grid.columnGroups.length) ? " tsg-col-reorderable " : "";
  let sortStyle = "";
  for (let si = 0; si < grid.sortData.length; si++) {
    if (grid.sortData[si].field == col.field) {
      if ((grid.sortData[si].direction || "").toLowerCase() === "asc") sortStyle = "tsg-sort-up";
      if ((grid.sortData[si].direction || "").toLowerCase() === "desc") sortStyle = "tsg-sort-down";
    }
  }
  const tmp = grid.last.selection.columns;
  let selected = false;
  for (const t in tmp) {
    for (let si = 0; si < tmp[t].length; si++) {
      if (tmp[t][si] == i) selected = true;
    }
  }
  const text = TsUtils.lang(typeof col.text == "function" ? col.text(col) : col.text);
  const html = '<td id="grid_' + grid.name + "_column_" + i + '" col="' + i + '" class="tsg-head ' + sortStyle + reorderCols + '">' + (col.resizable !== false ? '<div class="tsg-resizer" name="' + i + '"></div>' : "") + '    <div class="tsg-col-header ' + (sortStyle ? "tsg-col-sorted" : "") + " " + (selected ? "tsg-col-selected" : "") + '">        <div class="' + sortStyle + '"></div>' + (!text ? "&#160;" : text) + "    </div></td>";
  return html;
}
function columnTooltipShow(grid, ind, _event) {
  const $el = query21(grid.box).find("#grid_" + grid.name + "_column_" + ind);
  const item = grid.columns[ind];
  const pos = grid.columnTooltip;
  TsTooltip5.show({
    name: grid.name + "-column-tooltip",
    anchor: $el.get(0),
    html: item?.tooltip,
    position: pos
  });
}
function columnTooltipHide(grid, _ind, _event) {
  TsTooltip5.hide(grid.name + "-column-tooltip");
}
function getRecordsHTML(grid) {
  let buffered = grid.records.length;
  const url = grid.url?.get ?? grid.url;
  if (grid.searchData.length != 0 && !url) buffered = grid.last.searchIds.length;
  if (buffered > grid.vs_start) grid.last.vscroll.show_extra = grid.vs_extra;
  else grid.last.vscroll.show_extra = grid.vs_start;
  const records = query21(grid.box).find(`#grid_${grid.name}_records`);
  let limit = Math.floor((records.get(0)?.clientHeight || 0) / grid.recordHeight) + grid.last.vscroll.show_extra + 1;
  if (limit < grid.vs_start) {
    limit = grid.vs_start;
  }
  if (!grid.fixedBody || limit > buffered) limit = buffered;
  let rec_html = grid.getRecordHTML(-1, 0);
  let html1 = "<table><tbody>" + rec_html[0];
  let html2 = "<table><tbody>" + rec_html[1];
  html1 += '<tr id="grid_' + grid.name + '_frec_top" line="top" style="height: 0px">    <td colspan="2000"></td></tr>';
  html2 += '<tr id="grid_' + grid.name + '_rec_top" line="top" style="height: 0px">    <td colspan="2000"></td></tr>';
  for (let i = 0; i < limit; i++) {
    rec_html = grid.getRecordHTML(i, i + 1);
    html1 += rec_html[0];
    html2 += rec_html[1];
  }
  const h2 = (buffered - limit) * grid.recordHeight;
  html1 += '<tr id="grid_' + grid.name + '_frec_bottom" rec="bottom" line="bottom" style="height: ' + h2 + 'px; vertical-align: top">    <td colspan="2000" style="border: 0"></td></tr><tr id="grid_' + grid.name + '_frec_more" style="display: none; ">    <td colspan="2000" class="tsg-load-more"></td></tr></tbody></table>';
  html2 += '<tr id="grid_' + grid.name + '_rec_bottom" rec="bottom" line="bottom" style="height: ' + h2 + 'px; vertical-align: top">    <td colspan="2000" style="border: 0"></td></tr><tr id="grid_' + grid.name + '_rec_more" style="display: none">    <td colspan="2000" class="tsg-load-more"></td></tr></tbody></table>';
  grid.last.vscroll.recIndStart = 0;
  grid.last.vscroll.recIndEnd = limit;
  return [html1, html2];
}
function getSummaryHTML(grid) {
  if (grid.summary.length === 0) return;
  let rec_html = grid.getRecordHTML(-1, 0);
  let html1 = "<table><tbody>" + rec_html[0];
  let html2 = "<table><tbody>" + rec_html[1];
  for (let i = 0; i < grid.summary.length; i++) {
    rec_html = grid.getRecordHTML(i, i + 1, true);
    html1 += rec_html[0];
    html2 += rec_html[1];
  }
  html1 += "</tbody></table>";
  html2 += "</tbody></table>";
  return [html1, html2];
}
function getRecordHTML(grid, ind, lineNum, summary) {
  let tmph = "";
  let rec_html1 = "";
  let rec_html2 = "";
  const sel = grid.last.selection;
  let record;
  if (ind == -1) {
    rec_html1 += '<tr line="0">';
    rec_html2 += '<tr line="0">';
    if (grid.show.lineNumbers) rec_html1 += '<td class="tsg-col-number" style="height: 0px"></td>';
    if (grid.show.selectColumn) rec_html1 += '<td class="tsg-col-select" style="height: 0px"></td>';
    if (grid.show.expandColumn) rec_html1 += '<td class="tsg-col-expand" style="height: 0px"></td>';
    rec_html2 += '<td class="tsg-grid-data tsg-grid-data-spacer" col="start" style="height: 0px; width: 0px"></td>';
    if (grid.reorderRows) rec_html2 += '<td class="tsg-col-order" style="height: 0px"></td>';
    for (let i = 0; i < grid.columns.length; i++) {
      const col = grid.columns[i];
      tmph = '<td class="tsg-grid-data" col="' + i + '" style="height: 0px;"></td>';
      if (col.frozen && !col.hidden) {
        rec_html1 += tmph;
      } else {
        if (col.hidden || i < grid.last.vscroll.colIndStart || i > grid.last.vscroll.colIndEnd) continue;
        rec_html2 += tmph;
      }
    }
    rec_html1 += '<td class="tsg-grid-data-last" style="height: 0px"></td>';
    rec_html2 += '<td class="tsg-grid-data-last" col="end" style="height: 0px"></td>';
    rec_html1 += "</tr>";
    rec_html2 += "</tr>";
    return [rec_html1, rec_html2];
  }
  const url = grid.url?.get ?? grid.url;
  if (summary !== true) {
    if (grid.searchData.length > 0 && !url) {
      if (ind >= grid.last.searchIds.length) return "";
      ind = grid.last.searchIds[ind] ?? ind;
      record = grid.records[ind];
    } else {
      if (ind >= grid.records.length) return "";
      record = grid.records[ind];
    }
  } else {
    if (ind >= grid.summary.length) return "";
    record = grid.summary[ind];
  }
  if (!record) return "";
  if (record.recid == null && grid.recid != null) {
    const rid = grid.parseField(record, grid.recid);
    if (rid != null) record.recid = rid;
  }
  let isRowSelected = false;
  if (sel.indexes.indexOf(ind) != -1) isRowSelected = true;
  let rec_style = record.TsUi ? record.TsUi["style"] : "";
  if (rec_style == null || typeof rec_style != "string") rec_style = "";
  let rec_class = record.TsUi ? record.TsUi["class"] : "";
  if (rec_class == null || typeof rec_class != "string") rec_class = "";
  rec_html1 += '<tr id="grid_' + grid.name + "_frec_" + record.recid + '" recid="' + record.recid + '" line="' + lineNum + '" index="' + ind + '"  class="' + (lineNum % 2 === 0 ? "tsg-even" : "tsg-odd") + " tsg-record " + rec_class + (isRowSelected && grid.selectType == "row" ? " tsg-selected" : "") + (record.TsUi && record.TsUi["editable"] === false ? " tsg-no-edit" : "") + (record.TsUi && record.TsUi.expanded === true ? " tsg-expanded" : "") + '"  style="height: ' + grid.recordHeight + "px; " + (!isRowSelected && rec_style != "" ? rec_style : rec_style.replace("background-color", "none")) + '" ' + (rec_style != "" ? 'custom_style="' + rec_style + '"' : "") + ">";
  rec_html2 += '<tr id="grid_' + grid.name + "_rec_" + record.recid + '" recid="' + record.recid + '" line="' + lineNum + '" index="' + ind + '"  class="' + (lineNum % 2 === 0 ? "tsg-even" : "tsg-odd") + " tsg-record " + rec_class + (isRowSelected && grid.selectType == "row" ? " tsg-selected" : "") + (record.TsUi && record.TsUi["editable"] === false ? " tsg-no-edit" : "") + (record.TsUi && record.TsUi.expanded === true ? " tsg-expanded" : "") + '"  style="height: ' + grid.recordHeight + "px; " + (!isRowSelected && rec_style != "" ? rec_style : rec_style.replace("background-color", "none")) + '" ' + (rec_style != "" ? 'custom_style="' + rec_style + '"' : "") + ">";
  if (grid.show.lineNumbers) {
    rec_html1 += '<td id="grid_' + grid.name + "_cell_" + ind + "_number" + (summary ? "_s" : "") + '"    class="tsg-col-number ' + (isRowSelected ? " tsg-row-selected" : "") + '"' + (grid.reorderRows ? ' style="cursor: move"' : "") + ">" + (summary !== true ? grid.getLineHTML(lineNum) : "") + "</td>";
  }
  if (grid.show.selectColumn) {
    rec_html1 += '<td id="grid_' + grid.name + "_cell_" + ind + "_select" + (summary ? "_s" : "") + '" class="tsg-grid-data tsg-col-select">' + (summary !== true && !(record.TsUi && record.TsUi["hideCheckBox"] === true) ? '    <div>        <input class="tsg-grid-select-check" type="checkbox" tabindex="-1" ' + (isRowSelected ? 'checked="checked"' : "") + ' style="pointer-events: none"/>    </div>' : "") + "</td>";
  }
  if (grid.show.expandColumn) {
    let tmp_img = "";
    if (record.TsUi?.expanded === true) tmp_img = "-";
    else tmp_img = "+";
    if (record.TsUi?.expanded == "none" || !Array.isArray(record.TsUi?.children) || !record.TsUi?.children.length) tmp_img = "+";
    if (record.TsUi?.expanded == "spinner") tmp_img = '<div class="tsg-spinner" style="width: 16px; margin: -2px 2px;"></div>';
    rec_html1 += '<td id="grid_' + grid.name + "_cell_" + ind + "_expand" + (summary ? "_s" : "") + '" class="tsg-grid-data tsg-col-expand">' + (summary !== true ? `<div>${tmp_img}</div>` : "") + "</td>";
  }
  rec_html2 += '<td class="tsg-grid-data-spacer" col="start" style="border-right: 0"></td>';
  if (grid.reorderRows) {
    rec_html2 += '<td id="grid_' + grid.name + "_cell_" + ind + "_order" + (summary ? "_s" : "") + '" class="tsg-grid-data tsg-col-order" col="order">' + (summary !== true ? '<div title="Drag to reorder">&nbsp;</div>' : "") + "</td>";
  }
  let col_ind = 0;
  let col_skip = 0;
  while (true) {
    let col_span = 1;
    const col = grid.columns[col_ind];
    if (col == null) break;
    if (col.hidden) {
      col_ind++;
      if (col_skip > 0) col_skip--;
      continue;
    }
    if (col_skip > 0) {
      col_ind++;
      if (grid.columns[col_ind] == null) break;
      record.TsUi["colspan"][grid.columns[col_ind - 1].field] = 0;
      col_skip--;
      continue;
    } else if (record.TsUi) {
      const tmp1 = record.TsUi["colspan"];
      const tmp2 = grid.columns[col_ind].field;
      if (tmp1 && tmp1[tmp2] === 0) {
        delete tmp1[tmp2];
      }
    }
    if ((col_ind < (grid.last.vscroll.colIndStart ?? 0) || col_ind > (grid.last.vscroll.colIndEnd ?? Infinity)) && !col.frozen) {
      col_ind++;
      continue;
    }
    if (record.TsUi) {
      if (typeof record.TsUi["colspan"] == "object") {
        const span = parseInt(record.TsUi["colspan"][col.field]) || null;
        if (span != null && span > 1) {
          let hcnt = 0;
          for (let i = col_ind; i < col_ind + span; i++) {
            if (i >= grid.columns.length) break;
            if (grid.columns[i].hidden) hcnt++;
          }
          col_span = span - hcnt;
          col_skip = span - 1;
        }
      }
    }
    const rec_cell = grid.getCellHTML(ind, col_ind, summary, col_span);
    if (col.frozen) rec_html1 += rec_cell;
    else rec_html2 += rec_cell;
    col_ind++;
  }
  rec_html1 += '<td class="tsg-grid-data-last"></td>';
  rec_html2 += '<td class="tsg-grid-data-last" col="end"></td>';
  rec_html1 += "</tr>";
  rec_html2 += "</tr>";
  return [rec_html1, rec_html2];
}
function getLineHTML(_grid, lineNum) {
  return "<div>" + lineNum + "</div>";
}
function getCellHTML(grid, ind, col_ind, summary, col_span) {
  const obj = grid;
  const col = grid.columns[col_ind];
  if (col == null) return "";
  const record = summary !== true ? grid.records[ind] : grid.summary[ind];
  let { value, style, className, attr, divAttr, title } = grid.getCellValue(ind, col_ind, summary, true);
  const edit = ind !== -1 ? grid.getCellEditable(ind, col_ind) : "";
  let divStyle = "max-height: " + grid.recordHeight + "px;" + (col.clipboardCopy ? "margin-right: 20px" : "");
  const isChanged = !summary && record?.TsUi?.["changes"] && record.TsUi["changes"][col.field] != null;
  const sel = grid.last.selection;
  let isRowSelected = false;
  let infoBubble = "";
  if (sel.indexes.indexOf(ind) != -1) isRowSelected = true;
  if (col_span == null) {
    if (record?.TsUi?.["colspan"] && record.TsUi["colspan"][col.field]) {
      col_span = record.TsUi["colspan"][col.field];
    } else {
      col_span = 1;
    }
  }
  if (col_ind === grid.hierarchyColumn && Array.isArray(record?.TsUi?.children)) {
    let level = 0;
    let subrec = record.TsUi.parent_recid != null ? grid.get(record.TsUi.parent_recid, true) : null;
    while (true) {
      if (subrec != null) {
        level++;
        const tmp = grid.records[subrec].TsUi;
        if (tmp != null && tmp.parent_recid != null) {
          subrec = grid.get(tmp.parent_recid, true);
        } else {
          break;
        }
      } else {
        break;
      }
    }
    if (record.TsUi.parent_recid) {
      for (let i = 0; i < level; i++) {
        infoBubble += '<span class="tsg-show-children tsg-icon-empty"></span>';
      }
    }
    const className2 = record.TsUi?.children?.length > 0 ? record.TsUi.expanded ? "tsg-icon-collapse" : "tsg-icon-expand" : "tsg-icon-empty";
    if (record.TsUi?.children?.length > 0) {
      infoBubble += `<span class="tsg-show-children ${className2}"></span>`;
    }
  }
  if (col["info"] === true) col["info"] = {};
  if (col["info"] != null) {
    let infoIcon = "tsg-icon-info";
    if (typeof col["info"].icon == "function") {
      infoIcon = col["info"].icon(record, { self: grid, index: ind, colIndex: col_ind, summary: !!summary });
    } else if (typeof col["info"].icon == "object") {
      infoIcon = col["info"].icon[grid.parseField(record, col.field)] || "";
    } else if (typeof col["info"].icon == "string") {
      infoIcon = col["info"].icon;
    }
    let infoStyle = col["info"].style || "";
    if (typeof col["info"].style == "function") {
      infoStyle = col["info"].style(record, { self: grid, index: ind, colIndex: col_ind, summary: !!summary });
    } else if (typeof col["info"].style == "object") {
      infoStyle = col["info"].style[grid.parseField(record, col.field)] || "";
    } else if (typeof col["info"].style == "string") {
      infoStyle = col["info"].style;
    }
    infoBubble += `<span class="tsg-info ${infoIcon}" style="${infoStyle}"></span>`;
  }
  let data = value;
  if (edit && ["checkbox", "check"].indexOf(edit.type) != -1) {
    const changeInd = summary ? -(ind + 1) : ind;
    divStyle += "text-align: center;";
    data = `<input tabindex="-1" type="checkbox" class="tsg-editable-checkbox"
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
  if (record?.TsUi) {
    if (record.TsUi.styles == null) {
      record.TsUi.styles = record.TsUi["style"];
    }
    if (typeof record.TsUi.styles == "object") {
      if (typeof record.TsUi.styles[col_ind] == "string") style += record.TsUi.styles[col_ind] + ";";
      if (typeof record.TsUi.styles[col.field] == "string") style += record.TsUi.styles[col.field] + ";";
    }
    if (typeof record.TsUi["class"] == "object") {
      if (typeof record.TsUi["class"][col_ind] == "string") className += record.TsUi["class"][col_ind] + " ";
      if (typeof record.TsUi["class"][col.field] == "string") className += record.TsUi["class"][col.field] + " ";
    }
  }
  let isCellSelected = false;
  if (isRowSelected && sel.columns[ind]?.includes(col_ind)) isCellSelected = true;
  let clipboardIcon;
  if (col.clipboardCopy) {
    clipboardIcon = '<span class="tsg-clipboard-copy tsg-icon-paste"></span>';
  }
  data = '<td class="tsg-grid-data' + (isCellSelected ? " tsg-selected" : "") + " " + className + (isChanged ? " tsg-changed" : "") + '"    id="grid_' + grid.name + "_data_" + ind + "_" + col_ind + '" col="' + col_ind + '"    style="' + style + (col.style != null ? col.style : "") + '" ' + (col.attr != null ? col.attr : "") + attr + ((col_span ?? 0) > 1 ? 'colspan="' + col_span + '"' : "") + ">" + data + (clipboardIcon && TsUtils.stripTags(data) ? clipboardIcon : "") + "</td>";
  if (ind === -1 && summary === true) {
    data = '<td class="tsg-grid-data" col="' + col_ind + '" style="height: 0px; ' + style + '" ' + ((col_span ?? 0) > 1 ? 'colspan="' + col_span + '"' : "") + "></td>";
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
        title2 = TsUtils.stripTags(String(cellData).replace(/"/g, "''"));
      }
    }
    return title2 != null ? 'title="' + String(title2) + '"' : "";
  }
}
function clipboardCopy(grid, ind, col_ind, summary) {
  const rec = summary ? grid.summary[ind] : grid.records[ind];
  const col = grid.columns[col_ind];
  let txt = col ? grid.parseField(rec, col.field) : "";
  if (col && typeof col.clipboardCopy == "function") {
    txt = col.clipboardCopy(rec, { self: grid, index: ind, colIndex: col_ind, summary: !!summary });
  }
  query21(grid.box).find("#grid_" + grid.name + "_focus").text(txt).get(0).select();
  document.execCommand("copy");
}
function showBubble(grid, ind, col_ind, summary) {
  const info = grid.columns[col_ind]?.["info"];
  if (!info) return;
  let html = "";
  const rec = grid.records[ind];
  const el = query21(grid.box).find(`${summary ? ".tsg-grid-summary" : ""} #grid_${grid.name}_data_${ind}_${col_ind} .tsg-info`);
  if (grid.last.bubbleEl) {
    TsTooltip5.hide(grid.name + "-bubble");
  }
  grid.last.bubbleEl = el;
  if (info.fields == null) {
    info.fields = [];
    for (let i = 0; i < grid.columns.length; i++) {
      const col = grid.columns[i];
      info.fields.push(col.field + (typeof col.render == "string" ? ":" + col.render : ""));
    }
  }
  let fields = info.fields;
  if (typeof fields == "function") {
    fields = fields(rec, { self: grid, index: ind, colIndex: col_ind, summary: !!summary });
  }
  if (typeof info.render == "function") {
    html = info.render(rec, { self: grid, index: ind, colIndex: col_ind, summary: !!summary });
  } else if (Array.isArray(fields)) {
    html = '<table cellpadding="0" cellspacing="0">';
    for (let i = 0; i < fields.length; i++) {
      const tmp = String(fields[i]).split(":");
      if (tmp[0] == "" || tmp[0] == "-" || tmp[0] == "--" || tmp[0] == "---") {
        html += '<tr><td colspan=2><div style="border-top: ' + (tmp[0] == "" ? "0" : "1") + 'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>';
        continue;
      }
      let col = grid.getColumn(tmp[0] ?? "");
      if (col == null) col = { field: tmp[0] ?? "", text: tmp[0] ?? "", caption: tmp[0] };
      let val = col ? grid.parseField(rec, col.field) : "";
      if (rec?.TsUi?.["changes"]?.[col.field] != null) {
        val = rec.TsUi["changes"][col.field];
      }
      if (tmp.length > 1) {
        if (TsUtils.formatters[tmp[1] ?? ""]) {
          const extra = {
            self: grid,
            value: val,
            params: tmp[2] || null,
            field: grid.columns[col_ind].field,
            index: ind,
            colIndex: col_ind
          };
          val = TsUtils.formatters[tmp[1]].call(grid, rec, extra);
        } else {
          console.log('ERROR: TsUtils.formatters["' + tmp[1] + '"] does not exists.');
        }
      }
      if (typeof val == "object" && val.text != null) val = val.text;
      if (info.showEmpty !== true && (val == null || val == "")) continue;
      if (info.maxLength != null && typeof val == "string" && val.length > info.maxLength) val = val.substr(0, info.maxLength) + "...";
      html += "<tr><td>" + col.text + "</td><td>" + ((val === 0 ? "0" : val) || "") + "</td></tr>";
    }
    html += "</table>";
  } else if (TsUtils.isPlainObject(fields)) {
    html = '<table cellpadding="0" cellspacing="0">';
    for (const caption in fields) {
      const fld = fields[caption];
      if (fld == "" || fld == "-" || fld == "--" || fld == "---") {
        html += '<tr><td colspan=2><div style="border-top: ' + (fld == "" ? "0" : "1") + 'px solid #C1BEBE; margin: 6px 0px;"></div></td></tr>';
        continue;
      }
      const tmp = String(fld).split(":");
      let col = grid.getColumn(tmp[0] ?? "");
      if (col == null) col = { field: tmp[0] ?? "", text: tmp[0] ?? "", caption: tmp[0] };
      let val = col ? grid.parseField(rec, col.field) : "";
      if (rec?.TsUi?.["changes"]?.[col.field] != null) {
        val = rec.TsUi["changes"][col.field];
      }
      if (tmp.length > 1) {
        if (TsUtils.formatters[tmp[1] ?? ""]) {
          const extra = {
            self: grid,
            value: val,
            params: tmp[2] || null,
            field: grid.columns[col_ind].field,
            index: ind,
            colIndex: col_ind
          };
          val = TsUtils.formatters[tmp[1]].call(grid, rec, extra);
        } else {
          console.log('ERROR: TsUtils.formatters["' + tmp[1] + '"] does not exists.');
        }
      }
      if (typeof fld == "function") {
        val = fld(rec, { self: grid, index: ind, colIndex: col_ind, summary: !!summary });
      }
      if (val?.text != null) val = val.text;
      if (info.showEmpty !== true && (val == null || val == "")) continue;
      if (info.maxLength != null && typeof val == "string" && val.length > info.maxLength) val = val.substr(0, info.maxLength) + "...";
      html += "<tr><td>" + caption + "</td><td>" + ((val === 0 ? "0" : val) || "") + "</td></tr>";
    }
    html += "</table>";
  }
  return TsTooltip5.show(TsUtils.extend({
    name: grid.name + "-bubble",
    html,
    anchor: el.get(0),
    position: "top|bottom",
    class: "tsg-info-bubble",
    style: "",
    hideOn: ["doc-click"]
  }, info.options ?? {})).hide(() => [
    grid.last.bubbleEl = null
  ]);
}
function getCellEditable(grid, ind, col_ind) {
  const col = grid.columns[col_ind];
  const rec = grid.records[ind];
  if (!rec || !col) return null;
  let edit = rec.TsUi ? rec.TsUi["editable"] : null;
  if (edit === false) return null;
  if (edit == null || edit === true) {
    edit = Object.keys(col["editable"] ?? {}).length > 0 ? col["editable"] : null;
    if (typeof col["editable"] === "function") {
      const value = grid.getCellValue(ind, col_ind, false);
      edit = col["editable"].call(grid, rec, { self: grid, value, index: ind, colIndex: col_ind });
    }
  }
  return edit;
}
function getCellValue(grid, ind, col_ind, summary, extra) {
  const col = grid.columns[col_ind];
  const record = summary !== true ? grid.records[ind] : grid.summary[ind];
  let value = grid.parseField(record, col.field);
  let className = "", style = "", attr = "", divAttr = "";
  let title;
  if (record?.TsUi?.["changes"]?.[col.field] != null) {
    value = record.TsUi["changes"][col.field];
  }
  if (col.render != null && ind !== -1) {
    let render = col.render;
    let params;
    if (typeof render == "string") {
      const tmp = render.toLowerCase().replace("|", ":").split(":");
      let func = TsUtils.formatters[tmp[0] ?? ""];
      if (col["options"] && col["options"].autoFormat === false) {
        func = void 0;
      }
      render = func;
      params = tmp[1];
    }
    if (typeof render == "function" && record != null) {
      let html;
      try {
        html = render.call(grid, record, {
          // any: unified call for both formatter and column render
          self: grid,
          value,
          params,
          field: grid.columns[col_ind].field,
          index: ind,
          colIndex: col_ind,
          summary: !!summary
        });
      } catch (e) {
        throw new Error(`Render function for column "${col.field}" in grid "${grid.name}": -- ` + e.message);
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
function getFooterHTML(_grid) {
  return '<div>    <div class="tsg-footer-left"></div>    <div class="tsg-footer-right"></div>    <div class="tsg-footer-center"></div></div>';
}
function scroll(grid, event2) {
  const obj = grid;
  const url = grid.url?.get ?? grid.url;
  const records = query21(grid.box).find(`#grid_${grid.name}_records`);
  const frecords = query21(grid.box).find(`#grid_${grid.name}_frecords`);
  if (event2) {
    const sTop = event2.target.scrollTop;
    const sLeft = event2.target.scrollLeft;
    grid.last.vscroll.scrollTop = sTop;
    grid.last.vscroll.scrollLeft = sLeft;
    const cols = query21(grid.box).find(`#grid_${grid.name}_columns`)[0];
    const summary = query21(grid.box).find(`#grid_${grid.name}_summary`)[0];
    if (cols) cols.scrollLeft = sLeft;
    if (summary) summary.scrollLeft = sLeft;
    if (frecords[0]) frecords[0].scrollTop = sTop;
  }
  if (grid.last.bubbleEl) {
    TsTooltip5.hide(grid.name + "-bubble");
    grid.last.bubbleEl = null;
  }
  let colStart = null;
  let colEnd = null;
  if (grid.disableCVS || grid.columnGroups.length > 0) {
    colStart = 0;
    colEnd = grid.columns.length - 1;
  } else {
    const sWidth = records.prop("clientWidth");
    let cLeft = 0;
    for (let i = 0; i < grid.columns.length; i++) {
      if (grid.columns[i].frozen || grid.columns[i].hidden) continue;
      const cSize = parseInt(grid.columns[i].sizeCalculated ? grid.columns[i].sizeCalculated : String(grid.columns[i].size ?? 0));
      if (cLeft + cSize + 30 > grid.last.vscroll.scrollLeft && colStart == null) colStart = i;
      if (cLeft + cSize - 30 > grid.last.vscroll.scrollLeft + sWidth && colEnd == null) colEnd = i;
      cLeft += cSize;
    }
    if (colEnd == null) colEnd = grid.columns.length - 1;
  }
  if (colStart != null) {
    if (colStart < 0) colStart = 0;
    if (colEnd < 0) colEnd = 0;
    if (colStart == colEnd) {
      if (colStart > 0) colStart--;
      else colEnd++;
    }
    if (colStart != grid.last.vscroll.colIndStart || colEnd != grid.last.vscroll.colIndEnd) {
      const $box = query21(grid.box);
      const deltaStart = Math.abs(colStart - grid.last.vscroll.colIndStart);
      const deltaEnd = Math.abs(colEnd - grid.last.vscroll.colIndEnd);
      if (deltaStart < 5 && deltaEnd < 5) {
        const $cfirst = $box.find(`.tsg-grid-columns #grid_${grid.name}_column_start`);
        const $clast = $box.find(".tsg-grid-columns .tsg-head-last");
        const $rfirst = $box.find(`#grid_${grid.name}_records .tsg-grid-data-spacer`);
        const $rlast = $box.find(`#grid_${grid.name}_records .tsg-grid-data-last`);
        const $sfirst = $box.find(`#grid_${grid.name}_summary .tsg-grid-data-spacer`);
        const $slast = $box.find(`#grid_${grid.name}_summary .tsg-grid-data-last`);
        if (colStart > grid.last.vscroll.colIndStart) {
          for (let i = grid.last.vscroll.colIndStart; i < colStart; i++) {
            $box.find("#grid_" + grid.name + "_columns #grid_" + grid.name + "_column_" + i).remove();
            $box.find("#grid_" + grid.name + '_records td[col="' + i + '"]').remove();
            $box.find("#grid_" + grid.name + '_summary td[col="' + i + '"]').remove();
          }
        }
        if (colEnd < grid.last.vscroll.colIndEnd) {
          for (let i = grid.last.vscroll.colIndEnd; i > colEnd; i--) {
            $box.find("#grid_" + grid.name + "_columns #grid_" + grid.name + "_column_" + i).remove();
            $box.find("#grid_" + grid.name + '_records td[col="' + i + '"]').remove();
            $box.find("#grid_" + grid.name + '_summary td[col="' + i + '"]').remove();
          }
        }
        if (colStart < grid.last.vscroll.colIndStart) {
          for (let i = (grid.last.vscroll.colIndStart ?? 0) - 1; i >= colStart; i--) {
            if (grid.columns[i] && (grid.columns[i].frozen || grid.columns[i].hidden)) continue;
            $cfirst.after(grid.getColumnCellHTML(i));
            $rfirst.each((el) => {
              const index = query21(el).parent().attr("index");
              let td = '<td class="tsg-grid-data" col="' + i + '" style="height: 0px"></td>';
              if (index != null) td = grid.getCellHTML(parseInt(index), i, false);
              query21(el).after(td);
            });
            $sfirst.each((el) => {
              const index = query21(el).parent().attr("index");
              let td = '<td class="tsg-grid-data" col="' + i + '" style="height: 0px"></td>';
              if (index != null) td = grid.getCellHTML(parseInt(index), i, true);
              query21(el).after(td);
            });
          }
        }
        if (colEnd > grid.last.vscroll.colIndEnd) {
          for (let i = (grid.last.vscroll.colIndEnd ?? 0) + 1; i <= colEnd; i++) {
            if (grid.columns[i] && (grid.columns[i].frozen || grid.columns[i].hidden)) continue;
            $clast.before(grid.getColumnCellHTML(i));
            $rlast.each((el) => {
              const index = query21(el).parent().attr("index");
              let td = '<td class="tsg-grid-data" col="' + i + '" style="height: 0px"></td>';
              if (index != null) td = grid.getCellHTML(parseInt(index), i, false);
              query21(el).before(td);
            });
            $slast.each((el) => {
              const index = query21(el).parent().attr("index") || -1;
              const td = grid.getCellHTML(parseInt(index), i, true);
              query21(el).before(td);
            });
          }
        }
        grid.last.vscroll.colIndStart = colStart;
        grid.last.vscroll.colIndEnd = colEnd;
        grid.resizeRecords();
      } else {
        grid.last.vscroll.colIndStart = colStart;
        grid.last.vscroll.colIndEnd = colEnd;
        const colHTML = grid.getColumnsHTML();
        const recHTML = grid.getRecordsHTML();
        const sumHTML = grid.getSummaryHTML();
        const $columns = $box.find(`#grid_${grid.name}_columns`);
        const $records = $box.find(`#grid_${grid.name}_records`);
        const $frecords = $box.find(`#grid_${grid.name}_frecords`);
        const $summary = $box.find(`#grid_${grid.name}_summary`);
        $columns.find("tbody").html(colHTML[1]);
        $frecords.html(recHTML[0]);
        $records.prepend(recHTML[1]);
        if (sumHTML != null) $summary.html(sumHTML[1]);
        setTimeout(() => {
          $records.find(":scope > table").filter(":not(table:first-child)").remove();
          if ($summary[0]) $summary[0].scrollLeft = grid.last.vscroll.scrollLeft;
        }, 1);
        grid.resizeRecords();
      }
    }
  }
  let buffered = grid.records.length;
  if (buffered > grid.total && grid.total !== -1) buffered = grid.total;
  if (grid.searchData.length != 0 && !url) buffered = grid.last.searchIds.length;
  if (buffered === 0 || records.length === 0 || records.prop("clientHeight") === 0) return;
  if (buffered > grid.vs_start) grid.last.vscroll.show_extra = grid.vs_extra;
  else grid.last.vscroll.show_extra = grid.vs_start;
  let t1 = Math.round(records.prop("scrollTop") / grid.recordHeight + 1);
  let t2 = t1 + (Math.round(records.prop("clientHeight") / grid.recordHeight) - 1);
  if (t1 > buffered) t1 = buffered;
  if (t2 >= buffered - 1) t2 = buffered;
  query21(grid.box).find("#grid_" + grid.name + "_footer .tsg-footer-right").html(
    (grid.show.statusRange ? TsUtils.formatNumber(grid.offset + t1) + "-" + TsUtils.formatNumber(grid.offset + t2) + (grid.total != -1 ? " " + TsUtils.lang("of") + ' <span class="tsg-total">' + TsUtils.formatNumber(grid.total) + "</span>" : "") : "") + (url && grid.show.statusBuffered ? " (" + TsUtils.lang("buffered") + ' <span class="tsg-buffered">' + TsUtils.formatNumber(buffered) + "</span>" + (grid.offset > 0 ? ', skip <span class="tsg-skip">' + TsUtils.formatNumber(grid.offset) : "") + "</span>)" : "")
  );
  if (!url && (!grid.fixedBody || grid.total != -1 && grid.total <= grid.vs_start)) return;
  let start = Math.floor(records.prop("scrollTop") / grid.recordHeight) - grid.last.vscroll.show_extra;
  let end = start + Math.floor(records.prop("clientHeight") / grid.recordHeight) + grid.last.vscroll.show_extra * 2 + 1;
  if (start < 1) start = 1;
  if (end > grid.total && grid.total != -1) end = grid.total;
  const tr1 = records.find("#grid_" + grid.name + "_rec_top");
  const tr2 = records.find("#grid_" + grid.name + "_rec_bottom");
  const tr1f = frecords.find("#grid_" + grid.name + "_frec_top");
  const tr2f = frecords.find("#grid_" + grid.name + "_frec_bottom");
  if (String(tr1.next().prop("id")).indexOf("_expanded_row") != -1) {
    tr1.next().remove();
    tr1f.next().remove();
  }
  if (grid.total > end && String(tr2.prev().prop("id")).indexOf("_expanded_row") != -1) {
    tr2.prev().remove();
    tr2f.prev().remove();
  }
  const first = parseInt(tr1.next().attr("line"));
  const last = parseInt(tr2.prev().attr("line"));
  let tmp, tmp1, tmp2, rec_start, rec_html;
  if (first <= start || first == 1 || grid.last.vscroll.pull_refresh) {
    if (end <= last + grid.last.vscroll.show_extra - 2 && end != grid.total) return;
    grid.last.vscroll.pull_refresh = false;
    while (true) {
      tmp1 = frecords.find("#grid_" + grid.name + "_frec_top").next();
      tmp2 = records.find("#grid_" + grid.name + "_rec_top").next();
      if (tmp2.attr("line") == "bottom") break;
      if (parseInt(tmp2.attr("line")) < start) {
        tmp1.remove();
        tmp2.remove();
      } else {
        break;
      }
    }
    tmp = records.find("#grid_" + grid.name + "_rec_bottom").prev();
    rec_start = tmp.attr("line");
    if (rec_start == "top") rec_start = start;
    for (let i = parseInt(rec_start) + 1; i <= end; i++) {
      if (!grid.records[i - 1]) continue;
      tmp2 = grid.records[i - 1].TsUi;
      if (tmp2 && !Array.isArray(tmp2.children)) {
        tmp2.expanded = false;
      }
      rec_html = grid.getRecordHTML(i - 1, i);
      tr2.before(rec_html[1]);
      tr2f.before(rec_html[0]);
    }
    markSearch();
    setTimeout(() => {
      grid.refreshRanges();
    }, 0);
  } else {
    if (start >= first - grid.last.vscroll.show_extra + 2 && start > 1) return;
    while (true) {
      tmp1 = frecords.find("#grid_" + grid.name + "_frec_bottom").prev();
      tmp2 = records.find("#grid_" + grid.name + "_rec_bottom").prev();
      if (tmp2.attr("line") == "top") break;
      if (parseInt(tmp2.attr("line")) > end) {
        tmp1.remove();
        tmp2.remove();
      } else {
        break;
      }
    }
    tmp = records.find("#grid_" + grid.name + "_rec_top").next();
    rec_start = tmp.attr("line");
    if (rec_start == "bottom") rec_start = end;
    for (let i = parseInt(rec_start) - 1; i >= start; i--) {
      if (!grid.records[i - 1]) continue;
      tmp2 = grid.records[i - 1].TsUi;
      if (tmp2 && !Array.isArray(tmp2.children)) {
        tmp2.expanded = false;
      }
      rec_html = grid.getRecordHTML(i - 1, i);
      tr1.after(rec_html[1]);
      tr1f.after(rec_html[0]);
    }
    markSearch();
    setTimeout(() => {
      grid.refreshRanges();
    }, 0);
  }
  const h1 = (start - 1) * grid.recordHeight;
  let h2 = (buffered - end) * grid.recordHeight;
  if (h2 < 0) h2 = 0;
  tr1.css("height", h1 + "px");
  tr1f.css("height", h1 + "px");
  tr2.css("height", h2 + "px");
  tr2f.css("height", h2 + "px");
  grid.last.vscroll.recIndStart = start;
  grid.last.vscroll.recIndEnd = end;
  const s = Math.floor(records.prop("scrollTop") / grid.recordHeight);
  const e = s + Math.floor(records.prop("clientHeight") / grid.recordHeight);
  if (e + 10 > buffered && grid.last.vscroll.pull_more !== true && (buffered < grid.total - grid.offset || grid.total == -1 && grid.last.fetch.hasMore)) {
    if (grid.autoLoad === true) {
      grid.last.vscroll.pull_more = true;
      grid.last.fetch.offset = (grid.last.fetch.offset ?? 0) + grid.limit;
      grid.request("load");
    }
    const more = query21(grid.box).find("#grid_" + grid.name + "_rec_more, #grid_" + grid.name + "_frec_more");
    more.show().eq(1).off(".load-more").on("click.load-more", function() {
      query21(this).find("td").html('<div><div style="width: 20px; height: 20px;" class="tsg-spinner"></div></div>');
      obj.last.vscroll.pull_more = true;
      obj.last.fetch.offset = (obj.last.fetch.offset ?? 0) + obj.limit;
      obj.request("load");
    }).find("td").html(
      obj.autoLoad ? '<div><div style="width: 20px; height: 20px;" class="tsg-spinner"></div></div>' : '<div style="padding-top: 15px">' + TsUtils.lang("Load ${count} more...", { count: obj.limit }) + "</div>"
    );
  }
  function markSearch() {
    if (!obj.markSearch) return;
    clearTimeout(obj.last.marker_timer ?? void 0);
    obj.last.marker_timer = setTimeout(() => {
      const search2 = [];
      for (let s2 = 0; s2 < obj.searchData.length; s2++) {
        const sdata = obj.searchData[s2];
        const fld = obj.getSearch(sdata.field);
        if (!fld || fld.hidden) continue;
        const ind = obj.getColumn(sdata.field, true);
        search2.push({ field: sdata.field, search: sdata["value"], col: ind });
      }
      if (search2.length > 0) {
        search2.forEach((item) => {
          const el = query21(obj.box).find('td[col="' + item.col + '"]:not(.tsg-head)');
          TsUtils.marker(el, item.search);
        });
      }
    }, 50);
  }
}

// src/tsgrid.ts
var query22 = query;
var TsGrid = class extends TsBase {
  columns;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnGroups;
  // any: column group shapes — span/text/main/style; minimal typing for T5.2
  records;
  summary;
  searches;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toolbar;
  // any: TsToolbar instance or config object
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
    this.recordHeight = TsUtils.settings?.["recordHeight"] ?? 32;
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
      "reload": { type: "button", id: "tsg-reload", icon: "tsg-icon-reload", tooltip: TsUtils.lang("Reload data in the list") },
      "columns": {
        type: "menu-check",
        id: "tsg-column-on-off",
        icon: "tsg-icon-columns",
        tooltip: TsUtils.lang("Show/hide columns"),
        overlay: { align: "none" }
      },
      "search": {
        type: "html",
        id: "tsg-search",
        html: '<div class="tsg-icon tsg-icon-search tsg-search-down tsg-action" data-click="searchShowFields"></div>'
      },
      "add": { type: "button", id: "tsg-add", text: "Add New", tooltip: TsUtils.lang("Add new record"), icon: "tsg-icon-plus" },
      "edit": { type: "button", id: "tsg-edit", text: "Edit", tooltip: TsUtils.lang("Edit selected record"), icon: "tsg-icon-pencil", batch: 1, disabled: true },
      "delete": { type: "button", id: "tsg-delete", text: "Delete", tooltip: TsUtils.lang("Delete selected records"), icon: "tsg-icon-cross", batch: true, disabled: true },
      "save": { type: "button", id: "tsg-save", text: "Save", tooltip: TsUtils.lang("Save changed records"), icon: "tsg-icon-check" }
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
    TsUtils.extend(this, options);
    if (Array.isArray(this.records)) {
      const remove2 = [];
      this.records.forEach((rec, ind) => {
        if (this.recid != null && rec[this.recid] != null) {
          rec.recid = rec[this.recid];
        }
        if (rec.recid == null) {
          console.log("ERROR: Cannot add records without recid. (obj: " + this.name + ")");
        }
        if (rec.TsUi?.summary === true) {
          this.summary.push(rec);
          remove2.push(ind);
        }
      });
      remove2.sort();
      for (let t = remove2.length - 1; t >= 0; t--) {
        this.records.splice(remove2[t], 1);
      }
      this.processGroupBy();
    }
    if (Array.isArray(this.columns)) {
      this.columns.forEach((col, ind) => {
        col = TsUtils.extend({}, this.colTemplate, col);
        this.columns[ind] = col;
        const search2 = col.searchable;
        if (search2 == null || search2 === false || this.getSearch(col.field) != null) return;
        if (TsUtils.isPlainObject(search2)) {
          this.addSearch(TsUtils.extend({ field: col.field, label: col.text, type: "text" }, search2));
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
      this.defaultSearches.forEach((search2, ind) => {
        search2.id = "default-" + ind;
        search2.icon ??= "tsg-icon-search";
      });
    }
    const data = this.cache("searches");
    if (Array.isArray(data)) {
      data.forEach((search2) => {
        this.savedSearches.push({
          id: search2.id ?? "none",
          text: search2.text ?? "none",
          icon: "tsg-icon-search",
          remove: true,
          logic: search2.logic ?? "AND",
          data: search2.data ?? []
        });
      });
    }
    this.initToolbar();
    if (typeof this.box == "string") this.box = query22(this.box).get(0);
    if (this.box) this.render(this.box);
  }
  add(record, first) {
    return add(this, record, first);
  }
  // any: Record<string, any> — dynamic property bag; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  find(obj, returnIndex, displayedOnly) {
    return find(this, obj, returnIndex, displayedOnly);
  }
  // does not delete existing, but overrides on top of it
  // Overload: set(recid, record, noRefresh?) or set(record, noRefresh?) — shifts args when recid is object
  // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set(recid, record, noRefresh) {
    return set(this, recid, record, noRefresh);
  }
  // replaces existing record
  replace(recid, record, noRefresh) {
    return replace(this, recid, record, noRefresh);
  }
  get(recid, returnIndex) {
    return get(this, recid, returnIndex);
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
    return remove(this, ...recids);
  }
  /**
   * If there is a this.groupBy, then process all records with that in mind. It will remember groups in this.last.groupBy_links, that
   * needs to be cleared when record is cleared
   */
  processGroupBy() {
    return processGroupBy(this);
  }
  /** Add one or more columns. If `columns` is omitted, `before` is treated as the column(s) to append. */
  // any: `before` is reassigned inside the body (number | string → number); TS can't narrow post-assignment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addColumn(before, columns) {
    return addColumn(this, before, columns);
  }
  removeColumn(...fields) {
    return removeColumn(this, ...fields);
  }
  getColumn(field, returnIndex) {
    return getColumn(this, field, returnIndex);
  }
  // any: Record<string, any> — dynamic property bag; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateColumn(fields, updates) {
    return updateColumn(this, fields, updates);
  }
  toggleColumn(...fields) {
    return toggleColumn(this, ...fields);
  }
  showColumn(...fields) {
    return showColumn(this, ...fields);
  }
  hideColumn(...fields) {
    return hideColumn(this, ...fields);
  }
  /** Add one or more search fields. If `search` is omitted, `before` is treated as the search(es) to append. */
  // any: `before` is reassigned inside the body (number | string → number); TS can't narrow post-assignment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addSearch(before, search2) {
    return addSearch(this, before, search2);
  }
  removeSearch(...fields) {
    return removeSearch(this, ...fields);
  }
  getSearch(field, returnIndex) {
    return getSearch(this, field, returnIndex);
  }
  toggleSearch(...fields) {
    return toggleSearch(this, ...fields);
  }
  showSearch(...fields) {
    return showSearch(this, ...fields);
  }
  hideSearch(...fields) {
    return hideSearch(this, ...fields);
  }
  // any: Record<string, any> — dynamic property bag; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getSearchData(field) {
    return getSearchData(this, field);
  }
  localSort(silent, noResetRefresh) {
    return localSort(this, silent, noResetRefresh);
  }
  localSearch(silent) {
    return localSearch(this, silent);
  }
  // any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getRangeData(range, extra) {
    return getRangeData(this, range, extra);
  }
  // any: addRange accepts string 'selection' shorthand, single range object, or array of ranges
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addRange(rangesInput) {
    return addRange(this, rangesInput);
  }
  removeRange(...names) {
    return removeRange(this, ...names);
  }
  refreshRanges() {
    return refreshRanges(this);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  select(...selectArgs) {
    return select(this, ...selectArgs);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  unselect(...unselectArgs) {
    return unselect(this, ...unselectArgs);
  }
  // any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compareSelection(newSel) {
    return compareSelection(this, newSel);
  }
  selectAll() {
    return selectAll(this);
  }
  selectNone(skipEvent) {
    return selectNone(this, skipEvent);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateToolbar(sel, _areAllSelected) {
    return updateToolbar(this, sel, _areAllSelected);
  }
  /**
   * Row-mode selection. Returns the recids of selected records, or their indexes
   * when `returnIndex === true`. Unaffected by `selectType === 'cell'` — callers
   * should branch on `this.selectType` and use `getSelectionCells()` for cell mode.
   */
  getSelectionRows(returnIndex) {
    return getSelectionRows(this, returnIndex);
  }
  /**
   * Cell-mode selection. Returns one descriptor per selected cell. `returnIndex`
   * is intentionally not a parameter — it was ignored in cell mode by the legacy
   * `getSelection()` API.
   */
  getSelectionCells() {
    return getSelectionCells(this);
  }
  /**
   * Discriminated-union wrapper. The shape depends on `this.selectType`:
   *   - `'row'`  → `RecId[]` (or `number[]` if `returnIndex === true`)
   *   - `'cell'` → `TsGridCellSelection[]` (`returnIndex` is ignored)
   *
   * Prefer the typed split methods (`getSelectionRows` / `getSelectionCells`)
   * when the caller knows the mode statically. This wrapper is kept for back-
   * compat with the v2.0 API and for callers that genuinely handle both modes.
   */
  getSelection(returnIndex) {
    return getSelection(this, returnIndex);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search(field, value) {
    return search(this, field, value);
  }
  // open advanced search popover
  // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchOpen(options = {}) {
    return searchOpen(this, options);
  }
  searchClose() {
    return searchClose(this);
  }
  // if clicked on a field in the search strip
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchFieldTooltip(ind, sd_ind, el) {
    return searchFieldTooltip(this, ind, sd_ind, el);
  }
  // drop down with save searches
  searchSuggest(imediate, forceHide, anchor) {
    return searchSuggest(this, imediate, forceHide, anchor);
  }
  searchSave() {
    return searchSave(this);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cache(type) {
    return cache(this, type);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cacheSave(type, value) {
    return cacheSave(this, type, value);
  }
  searchReset(noReload) {
    return searchReset(this, noReload);
  }
  searchShowFields(forceHide) {
    return searchShowFields(this, forceHide);
  }
  // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchInitInput(field, _value) {
    return searchInitInput(this, field, _value);
  }
  // clears records and related params
  clear(noRefresh) {
    return clear(this, noRefresh);
  }
  // clears scroll position, selection, ranges
  reset(noRefresh) {
    return reset(this, noRefresh);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  skip(offset, callBack) {
    const url = this.url?.get ?? this.url;
    if (url) {
      this.offset = parseInt(offset);
      if (this.offset > this.total) this.offset = this.total - this.limit;
      if (this.offset < 0 || !TsUtils.isInt(this.offset)) this.offset = 0;
      this.clear(true);
      this.reload(callBack);
    } else {
      console.log("ERROR: grid.skip() can only be called when you have remote data source.");
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  load(url, callBack) {
    return load(this, url, callBack);
  }
  // any: array of heterogeneous runtime values; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reload(callBack) {
    return reload(this, callBack);
  }
  // any: url can be string, { get, save, remove } object, URL instance, or null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request(action, postData, url, callBack) {
    return request(this, action, postData, url, callBack);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestComplete(data, action, callBack, resolve, reject) {
    let error = data.error ?? false;
    if (data.error == null && data.status === "error") error = true;
    this.last.fetch.response = (Date.now() - this.last.fetch.start) / 1e3;
    setTimeout(() => {
      if (this.show.statusResponse) {
        this.status(TsUtils.lang("Server Response ${count} seconds", { count: this.last.fetch.response }));
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
            message: TsUtils.lang(this.msgNotJSON)
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
          query22(this.box).find("#grid_" + this.name + "_rec_more, #grid_" + this.name + "_frec_more").hide();
        }
        if (this.last.fetch.offset === 0) {
          this.records = [];
          this.summary = [];
          this.last.groupBy_links = {};
        } else {
          if (data.total != -1 && parseInt(String(data.total)) != this.total) {
            const grid = this;
            this.message(TsUtils.lang(this.msgNeedReload)).ok(() => {
              delete grid.last.fetch.offset;
              grid.reload();
            });
            return new Promise((resolve2) => {
              resolve2();
            });
          }
        }
        if (TsUtils.isInt(data.total)) this.total = parseInt(data.total);
        if (data.records) {
          data.records.forEach((rec) => {
            if (this.recid) {
              rec.recid = this.parseField(rec, this.recid);
            }
            if (rec.recid == null) {
              rec.recid = "recid-" + this.records.length;
            }
            if (rec.TsUi?.summary === true) {
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
      this.error(TsUtils.lang(data.message || this.msgServerError));
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
  // any: Record<string, any> — dynamic property bag; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getChanges(recordsBase) {
    const changes = [];
    if (typeof recordsBase == "undefined") {
      recordsBase = this.records;
    }
    for (let r = 0; r < recordsBase.length; r++) {
      const rec = recordsBase[r];
      if (rec?.TsUi) {
        if (rec.TsUi["changes"] != null) {
          const obj = {};
          obj[this.recid || "recid"] = rec.recid;
          changes.push(TsUtils.extend(obj, rec.TsUi["changes"]));
        }
        if (rec.TsUi.expanded !== true && rec.TsUi.children && rec.TsUi.children.length) {
          changes.push(...this.getChanges(rec.TsUi.children));
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
        if (record.TsUi) delete record.TsUi["changes"];
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
  // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  save(callBack) {
    return save(this, callBack);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editField(recid, column, value, event2) {
    return editField(this, recid, column, value, event2);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editChange(input, index, column, event2) {
    return editChange(this, input, index, column, event2);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editDone(index, column, event2) {
    return editDone(this, index, column, event2);
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
        text: TsUtils.lang(this.msgDelete, {
          count: recs.length,
          records: TsUtils.lang(recs.length == 1 ? "record" : "records")
        }),
        width: 380,
        height: 170,
        yes_text: TsUtils.lang("Delete"),
        yes_class: "tsg-btn-red",
        no_text: TsUtils.lang("Cancel")
        // any: cast-to-any for dynamic dispatch; TsGrid record/cell shape is user-defined at runtime
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
        const cellRecs = recs;
        for (let r = 0; r < cellRecs.length; r++) {
          const rr = cellRecs[r];
          const fld = this.columns[rr.column].field;
          const ind = this.get(rr.recid, true);
          const rec = ind != null ? this.records[ind] : null;
          if (ind != null && fld != "recid" && rec != null) {
            this.records[ind][fld] = "";
            if (rec.TsUi?.["changes"]) delete rec.TsUi["changes"][fld];
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
    return click(this, recid, event2);
  }
  // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnClick(field, event2) {
    return columnClick(this, field, event2);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnDblClick(field, event2) {
    return columnDblClick(this, field, event2);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnContextMenu(field, event2) {
    return columnContextMenu(this, field, event2);
  }
  // if called w/o arguments, then will resize all columns
  columnAutoSize(colIndex) {
    return columnAutoSize(this, colIndex);
  }
  columnAutoSizeAll() {
    return columnAutoSizeAll(this);
  }
  // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  focus(event2) {
    return focus(this, event2);
  }
  // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blur(event2) {
    return blur(this, event2);
  }
  // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  keydown(event2) {
    return keydown(this, event2);
  }
  scrollIntoView(ind, column, instant, recTop) {
    return scrollIntoView(this, ind, column, instant, recTop);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scrollToColumn(field) {
    return scrollToColumn(this, field);
  }
  // any: recid can be string|number (row select) or {recid, column} object (cell select)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dblClick(recid, event2) {
    return dblClick(this, recid, event2);
  }
  // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showContextMenu(event2, options) {
    return showContextMenu(this, event2, options);
  }
  // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contextMenuClick(recid, column, event2) {
    return contextMenuClick(this, recid, column, event2);
  }
  toggle(recid, _event) {
    return toggle(this, recid, _event);
  }
  /**
   * When record is expaned, then TsUi.children of the record is copied into this.records and this.total is updated. It will
   * also set TsUi._copeid = true, so it would not copy it again.
   *
   * There is also updateExpaned() that is called in this.refresh()
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expand(recid, noRefresh) {
    return expand(this, recid, noRefresh);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  collapse(recid, noRefresh) {
    return collapse(this, recid, noRefresh);
  }
  updateExpanded() {
    return updateExpanded(this);
  }
  sort(field, direction, multiField) {
    return sort(this, field, direction, multiField);
  }
  // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  copy(flag, oEvent) {
    return copy(this, flag, oEvent);
  }
  /**
   * Gets value to be copied to the clipboard
   * @param ind index of the record
   * @param col_ind index of the column
   * @returns the displayed value of the field's record associated with the cell
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCellCopy(ind, col_ind) {
    return getCellCopy(this, ind, col_ind);
  }
  // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paste(text, event2) {
    return paste(this, text, event2);
  }
  // ==================================================
  // --- Common functions
  resize() {
    return resize(this);
  }
  // any: parameter typed any — runtime dispatch by call site; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update({ cells, fullCellRefresh, ignoreColumns } = {}) {
    return update(this, { cells, fullCellRefresh, ignoreColumns });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refreshCell(recid, field) {
    return refreshCell(this, recid, field);
  }
  // any: recid is string|number; field is string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  refreshRow(recid, ind = null) {
    return refreshRow(this, recid, ind);
  }
  // any: recid is string|number; ind is number
  refresh() {
    return refresh(this);
  }
  refreshSearch() {
    return refreshSearch(this);
  }
  refreshBody() {
    return refreshBody(this);
  }
  render(box) {
    const time = Date.now();
    const obj = this;
    if (typeof box == "string") box = query22(box).get(0);
    const edata = this.trigger("render", { target: this.name, box: box ?? this.box });
    if (edata.isCancelled === true) return;
    if (box != null) {
      this.unmount();
      this.box = box;
    }
    if (!this.box) return;
    const url = this.url?.get ?? this.url;
    this.reset(true);
    query22(this.box).attr("name", this.name).addClass("tsg-reset tsg-grid tsg-inactive").html('<div class="tsg-grid-box">    <div id="grid_' + this.name + '_header" class="tsg-grid-header"></div>    <div id="grid_' + this.name + '_toolbar" class="tsg-grid-toolbar"></div>    <div id="grid_' + this.name + '_body" class="tsg-grid-body"></div>    <div id="grid_' + this.name + '_fsummary" class="tsg-grid-body tsg-grid-summary"></div>    <div id="grid_' + this.name + '_summary" class="tsg-grid-body tsg-grid-summary"></div>    <div id="grid_' + this.name + '_footer" class="tsg-grid-footer"></div>    <textarea id="grid_' + this.name + '_focus" class="tsg-grid-focus-input" ' + (this.tabIndex ? 'tabindex="' + this.tabIndex + '"' : "") + (TsUtils.isMobile ? "readonly" : "") + "></textarea></div>");
    if (this.selectType != "row") query22(this.box).addClass("tsg-ss");
    if (query22(this.box).length > 0) query22(this.box)[0].style.cssText += this.style;
    const tb_box = query22(this.box).find(`#grid_${this.name}_toolbar`);
    if (this.toolbar != null) this.toolbar.render(tb_box[0]);
    this.last.toolbar_height = tb_box.prop("offsetHeight");
    if (this.last.field && this.last.field != "all") {
      const sd = this.searchData;
      setTimeout(() => {
        this.searchInitInput(this.last.field, sd.length == 1 ? sd[0].value : null);
      }, 1);
    }
    query22(this.box).find(`#grid_${this.name}_footer`).html(this.getFooterHTML());
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
    query22(this.box).find(`#grid_${this.name}_focus`).on("focus", (_event) => {
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
        TsUi[this.name].paste(items2send, event2);
        event2.preventDefault();
      }
    }).on("keydown", function(event2) {
      ;
      TsUi[obj.name].keydown.call(TsUi[obj.name], event2);
    });
    let edataCol;
    query22(this.box).off("mousedown.mouseStart").on("mousedown.mouseStart", mouseStart);
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
        query22(obj.box).find(".tsg-grid-body").css("user-select", "none");
      }
      if (obj.selectType == "row" && (query22(event2.target).parents().hasClass("tsg-head") || query22(event2.target).hasClass("tsg-head"))) return;
      if (obj.last.move && obj.last.move.type == "expand") return;
      if (event2.altKey) {
        query22(obj.box).find(".tsg-grid-body").css("user-select", "text");
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
          if (tmp.classList && tmp.classList.contains("tsg-grid")) break;
          if (tmp.tagName && tmp.tagName.toUpperCase() == "TD") tmps = true;
          if (tmp.tagName && tmp.tagName.toUpperCase() != "TR" && tmps == true) {
            pos.x += tmp.offsetLeft;
            pos.y += tmp.offsetTop;
          }
          tmp = tmp.parentNode;
        }
        const index = query22(event2.target).parents("tr").attr("index");
        const recid = obj.records[index]?.recid;
        if (obj.selectType == "cell" && !event2.shiftKey) {
          let column1 = parseInt(query22(event2.target).closest("td").attr("col"));
          let column2 = column1;
          if (isNaN(column1)) {
            column1 = 0;
            column2 = obj.columns.length - 1;
          }
          obj.addRange({
            name: "selection-preview",
            range: [{ recid, column: column1 }, { recid, column: column2 }],
            class: "tsg-selection-preview"
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
          column: parseInt(event2.target.tagName.toUpperCase() == "TD" ? query22(event2.target).attr("col") : query22(event2.target).parents("td").attr("col")),
          type: "select",
          ghost: false,
          start: true
        };
        if (obj.last.move.recid == null && obj.records.length > 0) {
          obj.last.move.type = "select-column";
          const column = parseInt(query22(event2.target).closest("td").attr("col"));
          const start = obj.records[0].recid;
          const end = obj.records[obj.records.length - 1].recid;
          obj.addRange({
            name: "selection-preview",
            range: [{ recid: start, column }, { recid: end, column }],
            class: "tsg-selection-preview"
          });
        }
        const target = event2.target;
        const $input = query22(obj.box).find("#grid_" + obj.name + "_focus");
        if (obj.last.move) {
          let sLeft = obj.last.move.focusX;
          let sTop = obj.last.move.focusY;
          const $owner = query22(target).parents("table").parent();
          if ($owner.hasClass("tsg-grid-records") || $owner.hasClass("tsg-grid-frecords") || $owner.hasClass("tsg-grid-columns") || $owner.hasClass("tsg-grid-fcolumns") || $owner.hasClass("tsg-grid-summary")) {
            sLeft = obj.last.move.focusX - query22(obj.box).find("#grid_" + obj.name + "_records").prop("scrollLeft");
            sTop = obj.last.move.focusY - query22(obj.box).find("#grid_" + obj.name + "_records").prop("scrollTop");
          }
          if (query22(target).hasClass("tsg-grid-footer") || query22(target).parents("div.tsg-grid-footer").length > 0) {
            sTop = query22(obj.box).find("#grid_" + obj.name + "_footer").get(0).offsetTop;
          }
          if ($owner.hasClass("tsg-scroll-wrapper") && $owner.parent().hasClass("tsg-toolbar")) {
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
        if (el.tagName.toUpperCase() != "TD") el = query22(el).parents("td")[0];
        if (query22(el).hasClass("tsg-col-number") || query22(el).hasClass("tsg-col-order")) {
          let sel = obj.getSelection();
          if (sel.length > 0 && typeof sel[0] == "object") {
            const cellSel = sel;
            obj.select([...new Set(cellSel.map((r) => r.recid))]);
            sel = [...new Set(obj.getSelectionCells().map((r) => r.recid))];
          }
          if (sel.indexOf(obj.last.move.recid) == -1) {
            obj.selectNone();
            obj.select([obj.last.move.recid]);
            sel = [obj.last.move.recid];
          }
          const new_sel = [];
          const selectExpandedChildren = (recid) => {
            const rec = obj.get(recid);
            if (rec?.TsUi?.children) {
              rec.TsUi.children.forEach((c) => {
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
          const eColor = query22(obj.box).find(".tsg-even.tsg-empty-record").css("background-color");
          const oColor = query22(obj.box).find(".tsg-odd.tsg-empty-record").css("background-color");
          query22(obj.box).find(".tsg-even td").filter(":not(.tsg-col-number)").css("background-color", eColor);
          query22(obj.box).find(".tsg-odd td").filter(":not(.tsg-col-number)").css("background-color", oColor);
          const mv = obj.last.move;
          const recs = query22(obj.box).find(".tsg-grid-records");
          if (!mv["ghost"]) {
            const rows = sel.map((r) => query22(obj.box).find(`#grid_${obj.name}_rec_${r}`));
            const tmp = rows[0].parents("table").find("tr:first-child").get(0).cloneNode(true);
            mv.offsetY = event2.offsetY;
            mv.from = sel;
            mv.pos = { top: rows[0].get(0).offsetTop - 1, left: rows[rows.length - 1].get(0).offsetLeft };
            mv["ghost"] = query22(rows.map((row) => row.get(0).cloneNode(true)));
            mv["ghost"].removeAttr("id");
            mv["ghost"].find("td").css({
              "border-top": "1px solid silver",
              "border-bottom": "1px solid silver"
            });
            rows.forEach((row) => {
              row.find("td").remove();
              row.append(`<td colspan="1000"><div class="tsg-reorder-empty" style="height: ${obj.recordHeight - 2}px"></div></td>`);
            });
            recs.append('<div id="grid_' + obj.name + '_ghost_line" style="position: absolute; z-index: 999999; pointer-events: none; width: 100%;"></div>');
            recs.append('<table id="grid_' + obj.name + '_ghost" style="position: absolute; z-index: 999998; opacity: 0.9; pointer-events: none;"></table>');
            query22(obj.box).find("#grid_" + obj.name + "_ghost").append(tmp).append(mv["ghost"]);
          }
          const ghost = query22(obj.box).find("#grid_" + obj.name + "_ghost");
          ghost.css({
            top: mv.pos.top + "px",
            left: mv.pos.left + "px"
          });
        } else {
          obj.last.move.reorder = false;
        }
      }
      query22(document).on("mousemove.tsg-" + obj.name, mouseMove).on("mouseup.tsg-" + obj.name, mouseStop);
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
        const tmp = query22(event2.target).parents("tr");
        const ind2 = tmp.attr("index");
        let recid2 = obj.records[ind2]?.recid;
        if (recid2 == "-none-" || recid2 == null) recid2 = "bottom";
        if (mv.from.indexOf(recid2) == -1) {
          const row2 = query22(obj.box).find("#grid_" + obj.name + "_rec_" + recid2);
          query22(obj.box).find(".insert-before");
          row2.addClass("insert-before");
          mv.lastY = event2.screenY;
          mv.to = recid2;
          const pos = { top: row2.get(0)?.offsetTop, left: row2.get(0)?.offsetLeft };
          const ghost_line = query22(obj.box).find("#grid_" + obj.name + "_ghost_line");
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
        const ghost = query22(obj.box).find("#grid_" + obj.name + "_ghost");
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
      const ind = event2.target.tagName.toUpperCase() == "TR" ? query22(event2.target).attr("index") : query22(event2.target).parents("tr").attr("index");
      const recid = obj.records[ind]?.recid;
      if (recid == null) {
        if (obj.selectType == "row") return;
        if (obj.last.move && obj.last.move.type == "select") return;
        const col = parseInt(query22(event2.target).parents("td").attr("col"));
        if (isNaN(col)) {
          obj.removeRange("column-selection");
          query22(obj.box).find(".tsg-grid-columns .tsg-col-header, .tsg-grid-fcolumns .tsg-col-header").removeClass("tsg-col-selected");
          query22(obj.box).find(".tsg-col-number").removeClass("tsg-row-selected");
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
                class: "tsg-selection-preview"
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
        let col2 = parseInt(event2.target.tagName.toUpperCase() == "TD" ? query22(event2.target).attr("col") : query22(event2.target).parents("td").attr("col"));
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
            class: "tsg-selection-preview"
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
      if (query22(event2.target).parents().hasClass(".tsg-head") || query22(event2.target).hasClass(".tsg-head")) return;
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
            query22(obj.box).find(`#grid_${obj.name}_columns .tsg-col-header`).removeClass("tsg-col-sorted");
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
      query22(document).off(".tsg-" + obj.name);
    }
    function resetRowReorder() {
      query22(obj.box).find(`#grid_${obj.name}_ghost`).remove();
      query22(obj.box).find(`#grid_${obj.name}_ghost_line`).remove();
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
    return destroy(this);
  }
  // ===========================================
  // --- Internal Functions
  initColumnOnOff() {
    return initColumnOnOff(this);
  }
  // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initColumnDrag(_box) {
    return initColumnDrag(this, _box);
  }
  // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnOnOff(event2, field) {
    return columnOnOff(this, event2, field);
  }
  initToolbar() {
    return initToolbar(this);
  }
  initResize() {
    return initResize(this);
  }
  resizeBoxes() {
    return resizeBoxes(this);
  }
  resizeRecords() {
    return resizeRecords(this);
  }
  getSearchesHTML() {
    return getSearchesHTML(this);
  }
  // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getOperators(type, opers) {
    return getOperators(this, type, opers);
  }
  // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initOperator(ind) {
    return initOperator(this, ind);
  }
  // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initSearchLists(changedField) {
    return initSearchLists(this, changedField);
  }
  initSearches() {
    return initSearches(this);
  }
  getColumnsHTML() {
    return getColumnsHTML(this);
  }
  // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getColumnCellHTML(i) {
    return getColumnCellHTML(this, i);
  }
  // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnTooltipShow(ind, _event) {
    return columnTooltipShow(this, ind, _event);
  }
  // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnTooltipHide(_ind, _event) {
    return columnTooltipHide(this, _ind, _event);
  }
  getRecordsHTML() {
    return getRecordsHTML(this);
  }
  getSummaryHTML() {
    return getSummaryHTML(this);
  }
  // any: targeted-any per typing_policy; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  scroll(event2) {
    return scroll(this, event2);
  }
  getRecordHTML(ind, lineNum, summary) {
    return getRecordHTML(this, ind, lineNum, summary);
  }
  getLineHTML(lineNum) {
    return getLineHTML(this, lineNum);
  }
  getCellHTML(ind, col_ind, summary, col_span) {
    return getCellHTML(this, ind, col_ind, summary, col_span);
  }
  // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  clipboardCopy(ind, col_ind, summary) {
    return clipboardCopy(this, ind, col_ind, summary);
  }
  // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showBubble(ind, col_ind, summary) {
    return showBubble(this, ind, col_ind, summary);
  }
  // return null or the editable object if the given cell is editable
  // any: return type any — caller narrows by code path; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCellEditable(ind, col_ind) {
    return getCellEditable(this, ind, col_ind);
  }
  // any: return type any — caller narrows by code path; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getCellValue(ind, col_ind, summary, extra) {
    return getCellValue(this, ind, col_ind, summary, extra);
  }
  getFooterHTML() {
    return getFooterHTML(this);
  }
  status(msg) {
    return status(this, msg);
  }
  lock(msg, showSpinner) {
    return lock2(this, msg, showSpinner);
  }
  unlock(speed) {
    return unlock2(this, speed);
  }
  // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateSave(returnOnly) {
    return stateSave(this, returnOnly);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateRestore(newState) {
    return stateRestore(this, newState);
  }
  stateReset() {
    return stateReset(this);
  }
  // any: return type any — caller narrows by code path; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parseField(obj, field) {
    return parseField(this, obj, field);
  }
  prepareData() {
    return prepareData(this);
  }
  nextCell(index, col_ind, editable) {
    return nextCell(this, index, col_ind, editable);
  }
  prevCell(index, col_ind, editable) {
    return prevCell(this, index, col_ind, editable);
  }
  nextRow(ind, col_ind, numRows) {
    return nextRow(this, ind, col_ind, numRows);
  }
  prevRow(ind, col_ind, numRows) {
    return prevRow(this, ind, col_ind, numRows);
  }
  selectionSave() {
    return selectionSave(this);
  }
  selectionRestore(noRefresh) {
    return selectionRestore(this, noRefresh);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  message(options) {
    return message(this, options);
  }
  // any: callback parameter — caller signature varies; TsGrid record/cell shape is user-defined at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  confirm(options) {
    return confirm(this, options);
  }
};

// src/tsform.ts
var TsTooltip6 = TsTooltip;
var query23 = query;
var TsForm = class extends TsBase {
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
  // any: Record<string, any> — dynamic property bag; TsForm field schema is user-defined at runtime
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
  // any: TsToolbar instance or config object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tabs;
  // any: TsTabs instance or config object
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
  TsFIELD_TYPES;
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
    this.TsFIELD_TYPES = [
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
    TsUtils.extend(this, options);
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
      TsUtils.extend(this.tabs, { tabs: [] });
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
      TsUtils.extend(this.tabs, tabs);
    }
    TsUtils.extend(this.toolbar, toolbar);
    for (const p in record) {
      if (TsUtils.isPlainObject(record[p])) {
        this.record[p] = TsUtils.clone(record[p]);
      } else {
        this.record[p] = record[p];
      }
    }
    for (const p in original) {
      if (this.original == null) this.original = {};
      if (TsUtils.isPlainObject(original[p])) {
        this.original[p] = TsUtils.clone(original[p]);
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
    if (typeof this.box == "string") this.box = query23(this.box).get(0);
    if (this.box) this.render(this.box);
    function _processFields(fields2) {
      const newFields = [];
      const tabs2 = [];
      if (TsUtils.isPlainObject(fields2)) {
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
            if (TsUtils.isPlainObject(fld.fields)) {
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
              const fld = TsUtils.clone(gfield);
              if (fld.html == null) fld.html = {};
              TsUtils.extend(fld.html, group);
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
          const fld = TsUtils.clone(field);
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
        TsUtils.extend(this.fields[f], obj);
        delete this.fields[f].TsField;
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
    if (value === "" || value == null || Array.isArray(value) && value.length === 0 || TsUtils.isPlainObject(value) && Object.keys(value).length == 0) {
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
        this.original = TsUtils.clone(this.record);
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
      current = field.TsField.clean(current);
    }
    if (["radio"].includes(field.type)) {
      const selected2 = query23(el).closest(".tsg-field-group").find("input:checked").get(0);
      if (selected2) {
        const item = field.options.items[query23(selected2).data("index")];
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
      const selected2 = query23(el).closest(".tsg-field-group").find("input:checked");
      if (selected2.length > 0) {
        selected2.each((node) => {
          const el2 = node;
          const item = field.options.items[query23(el2).data("index")];
          current.push(item.id);
        });
      }
      if (!Array.isArray(previous)) previous = [];
    }
    const selected = field.TsField?.selected;
    if (["list", "enum", "file"].includes(field.type) && selected) {
      const nv = selected;
      const cv = previous;
      if (Array.isArray(nv)) {
        current = [];
        for (let i = 0; i < nv.length; i++) current[i] = TsUtils.clone(nv[i]);
      }
      if (Array.isArray(cv)) {
        previous = [];
        for (let i = 0; i < cv.length; i++) previous[i] = TsUtils.clone(cv[i]);
      }
      if (TsUtils.isPlainObject(nv)) {
        current = TsUtils.clone(nv);
      }
      if (TsUtils.isPlainObject(cv)) {
        previous = TsUtils.clone(cv);
      }
    }
    if (["map", "array"].includes(field.type)) {
      current = field.type == "map" ? {} : [];
      field.$el.parent().find(".tsg-map-field").each((div, _ind) => {
        const key = query23(div).find(".tsg-map.key").val();
        const value = query23(div).find(".tsg-map.value").val();
        if (typeof field.html?.render == "function") {
          current[_ind] ??= {};
          query23(div).find("input, textarea").each((node) => {
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
        const inputs = query23(el).closest(".tsg-field-group").find("input");
        const items = field.options.items;
        items.forEach((it, ind) => {
          const input = inputs.filter(`[data-index="${ind}"]`);
          if (it.id === value) {
            input.prop("checked", true);
          } else {
            input.prop("checked", false);
          }
          if (it.hidden === true) {
            input.closest(".tsg-field-item").hide();
          } else {
            input.closest(".tsg-field-item").show();
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
        const inputs = query23(el).closest("div.tsg-field-group").find("input");
        const items = field.options.items;
        items.forEach((it, ind) => {
          const input = inputs.filter(`[data-index="${ind}"]`);
          input.prop("checked", value.includes(it.id) ? true : false);
          if (it.hidden === true) {
            input.closest(".tsg-field-item").hide();
          } else {
            input.closest(".tsg-field-item").show();
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
            const val = TsUtils.getNested(it, map?.id ?? "id");
            if (val === value) item = it;
          });
        }
        if (item?.id != null && item?.text == null && Array.isArray(field.options?.items)) {
          field.options.items.forEach((it) => {
            const id = TsUtils.getNested(it, map?.id ?? "id");
            if (id === item.id) {
              item.text = TsUtils.getNested(it, map.text ?? "text");
            }
          });
        }
        if (item != value) {
          this.setValue(field.name, item, true);
        }
        if (field.type == "list") {
          field.TsField.selected = item;
          field.TsField.refresh();
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
        field.TsField.selected = items;
        field.TsField.refresh();
        break;
      }
      case "map":
      case "array": {
        if (field.type == "map" && (value == null || !TsUtils.isPlainObject(value))) {
          this.setValue(field.field, {}, true);
          value = this.getValue(field.field);
        }
        if (field.type == "array" && (value == null || !Array.isArray(value))) {
          this.setValue(field.field, [], true);
          value = this.getValue(field.field);
        }
        const container = query23(field.el).parent().find(".tsg-map-container");
        field.el.mapRefresh(value, container);
        break;
      }
      case "div":
      case "custom": {
        query23(el).html(value);
        break;
      }
      case "color": {
        el.value = value ?? "";
        field.TsField.refresh();
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
          const parent = TsUtils.getNested(item, fld.options.parentField ?? "parentId");
          if (parent == null) {
            return;
          }
          const possible = TsUtils.clone(Array.isArray(parent) ? parent : [parent]);
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
    query23(this.box).find(".tsg-group").each((node) => {
      const group = node;
      if (isHidden(query23(group).find(".tsg-field"))) {
        query23(group).hide();
      } else {
        query23(group).show();
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
    const el = query23(this.box).find('.tsg-group-title[data-group="' + TsUtils.base64encode(groupName) + '"]');
    if (el.length === 0) return;
    const el_next = query23(el.prop("nextElementSibling"));
    if (typeof show === "undefined") {
      show = el_next.css("display") == "none";
    }
    if (show) {
      el_next.show();
      el.find("span").addClass("tsg-icon-collapse").removeClass("tsg-icon-expand");
    } else {
      el_next.hide();
      el.find("span").addClass("tsg-icon-expand").removeClass("tsg-icon-collapse");
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
    return TsUtils.message({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      owner: this,
      // any: TsForm has [key:string]:any but TS can't verify lock/unlock signature match
      box: this.box,
      after: ".tsg-form-header"
    }, options);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  confirm(options) {
    return TsUtils.confirm({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      owner: this,
      // any: same as message() above
      box: this.box,
      after: ".tsg-form-header"
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
          errors.push({ field, error: TsUtils.lang("Should be more than ${min}", { min }) });
        }
        if (max != null && val2 != null && val2 > max) {
          errors.push({ field, error: TsUtils.lang("Should be less than ${max}", { max }) });
        }
      }
      switch (field.type) {
        case "alphanumeric":
          if (this.getValue(field.field) && !TsUtils.isAlphaNumeric(this.getValue(field.field))) {
            errors.push({ field, error: TsUtils.lang("Not alpha-numeric") });
          }
          break;
        case "int":
          if (this.getValue(field.field) && !TsUtils.isInt(this.getValue(field.field))) {
            errors.push({ field, error: TsUtils.lang("Not an integer") });
          }
          break;
        case "percent":
        case "float":
          if (this.getValue(field.field) && !TsUtils.isFloat(this.getValue(field.field))) {
            errors.push({ field, error: TsUtils.lang("Not a float") });
          }
          break;
        case "currency":
        case "money":
          if (this.getValue(field.field) && !TsUtils.isMoney(this.getValue(field.field))) {
            errors.push({ field, error: TsUtils.lang("Not in money format") });
          }
          break;
        case "color":
        case "hex":
          if (this.getValue(field.field) && !TsUtils.isHex(this.getValue(field.field))) {
            errors.push({ field, error: TsUtils.lang("Not a hex number") });
          }
          break;
        case "email":
          if (this.getValue(field.field) && !TsUtils.isEmail(this.getValue(field.field))) {
            errors.push({ field, error: TsUtils.lang("Not a valid email") });
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
          if (!field.options.format) field.options.format = TsUtils.settings.dateFormat;
          if (this.getValue(field.field) && !TsUtils.isDate(this.getValue(field.field), field.options.format)) {
            errors.push({ field, error: TsUtils.lang("Not a valid date") + ": " + field.options.format });
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
      if (field.hidden !== true && field.required && !["div", "custom", "html", "empty"].includes(field.type) && (val == null || val === "" || Array.isArray(val) && val.length === 0 || TsUtils.isPlainObject(val) && Object.keys(val).length == 0)) {
        errors.push({ field, error: TsUtils.lang("Required field") });
      }
      if (field.hidden !== true && field.options?.minLength > 0 && !["enum", "list", "combo"].includes(field.type) && (val == null || val.length < field.options.minLength)) {
        errors.push({ field, error: TsUtils.lang(
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
    query23(errors[0].field.$el).parents(".tsg-field").get(0).scrollIntoView({ block: "nearest", inline: "nearest" });
    errors.forEach((error) => {
      const opt = TsUtils.extend({
        anchorClass: "tsg-error",
        class: "tsg-light",
        position: "right|left",
        hideOn: ["input", "tooltip-click"]
      }, error.options);
      if (error.field == null) return;
      let anchor = error.field.el;
      if (error.field.type === "radio") {
        anchor = query23(error.field.el).closest("div").get(0);
      } else if (["enum", "file"].includes(error.field.type)) {
      }
      TsTooltip6.show(TsUtils.extend({
        anchor,
        name: `${this.name}-${error.field.field}-error`,
        html: error.error
      }, opt));
    });
    this.last.errorsShown = true;
    query23(errors[0].field.$el).parents(".tsg-page").off(".hideErrors").on("scroll.hideErrors", (_evt) => {
      if (this.last.errorsShown) {
        this.showErrors();
      }
    });
  }
  hideErrors() {
    this.last.errorsShown = false;
    this.fields.forEach((field) => {
      TsTooltip6.hide(`${this.name}-${field.field}-error`);
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
    const data = TsUtils.clone(this.record);
    this.fields.forEach((fld) => {
      if (fld.type == "columns" || fld.field == null) {
        return;
      }
      if (["list", "combo", "enum"].includes(fld.type)) {
        const tmp = { nestedFields: true, record: data };
        const val = this.getValue.call(tmp, fld.field);
        if (TsUtils.isPlainObject(val) && val.id != null) {
          this.setValue.call(tmp, fld.field, val.id);
        }
        if (Array.isArray(val)) {
          val.forEach((item, ind) => {
            if (TsUtils.isPlainObject(item) && item.id) {
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
    TsUtils.extend(params, this.postData);
    TsUtils.extend(params, postData);
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
    this.lock(TsUtils.lang(this.msgRefresh));
    let url = edata.detail["url"];
    if (typeof url === "object" && url.get) url = url.get;
    if (this.last.fetchCtrl) try {
      this.last.fetchCtrl.abort();
    } catch (_e) {
    }
    if (Object.keys(this.routeData).length != 0) {
      const info = TsUtils.parseRoute(url);
      if (info.keys.length > 0) {
        for (let k = 0; k < info.keys.length; k++) {
          const routeKey = info.keys[k];
          if (routeKey == null || this.routeData[routeKey.name] == null) continue;
          url = url.replace(new RegExp(":" + routeKey.name, "g"), this.routeData[routeKey.name]);
        }
      }
    }
    url = new URL(url, location.href);
    const fetchOptions = TsUtils.prepareParams(url, {
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
          Object.assign(data, { record: TsUtils.clone(data) });
        }
        if (data.error === true) {
          self.error(TsUtils.lang(data.message ?? self.msgServerError));
        } else {
          self.record = TsUtils.clone(data.record);
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
    self.lock(TsUtils.lang(self.msgSaving) + ' <span id="' + self.name + '_progress"></span>');
    const params = {};
    params.action = "save";
    params.recid = self.recid;
    params.name = self.name;
    TsUtils.extend(params, self.postData);
    TsUtils.extend(params, postData);
    params.record = TsUtils.clone(self.saveCleanRecord ? self.getCleanRecord() : self.record);
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
      const info = TsUtils.parseRoute(url);
      if (info.keys.length > 0) {
        for (let k = 0; k < info.keys.length; k++) {
          const routeKey = info.keys[k];
          if (routeKey == null || self.routeData[routeKey.name] == null) continue;
          url = url.replace(new RegExp(":" + routeKey.name, "g"), self.routeData[routeKey.name]);
        }
      }
    }
    url = new URL(url, location.href);
    const fetchOptions = TsUtils.prepareParams(url, {
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
          self.error(TsUtils.lang(data.message ?? self.msgServerError));
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
    TsUtils.lock(this.box, msg, showSpinner);
  }
  unlock(speed) {
    const box = this.box;
    TsUtils.unlock(box, speed);
  }
  lockPage(page, msg, spinner) {
    const $page = query23(this.box).find(".page-" + page);
    if ($page.length) {
      TsUtils.lock($page, msg, spinner);
      return true;
    }
    return false;
  }
  unlockPage(page, speed) {
    const $page = query23(this.box).find(".page-" + page);
    if ($page.length) {
      TsUtils.unlock($page, speed);
      return true;
    }
    return false;
  }
  goto(page) {
    if (this.page === page) return;
    if (page != null) this.page = page;
    if (query23(this.box).data("autoSize") === true) {
      query23(this.box).get(0).clientHeight = 0;
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
      field.html = TsUtils.extend({ label: "", span: 6, attr: "", text: "", style: "", page: 0, column: 0 }, field.html);
      if (page == null) page = field.html.page;
      if (column == null) column = field.html.column;
      let input = `<input id="${field.field}" name="${field.field}" class="tsg-input ${field.html.class ?? ""}" type="text" ${field.html.attr + tabindex_str}>`;
      switch (field.type) {
        case "pass":
        case "password":
          input = input.replace('type="text"', 'type="password"');
          break;
        case "checkbox": {
          input = `
                        <label class="tsg-box-label">
                            <input id="${field.field}" name="${field.field}" class="tsg-input ${field.html.class ?? ""}" type="checkbox" ${field.html.attr + tabindex_str}>
                            <span>${field.html.label}</span>
                        </label>`;
          break;
        }
        case "check":
        case "checks": {
          if (field.options.items == null && field.html.items != null) field.options.items = field.html.items;
          let items = field.options.items;
          input = `<div class="tsg-field-group" ${field.html.attr}>`;
          if (!Array.isArray(items)) items = [];
          if (items.length > 0) {
            items = TsUtils.normMenu.call(this, items, field.options);
          }
          for (let i = 0; i < items.length; i++) {
            input += `
                            <div class="tsg-field-item">
                                <label class="tsg-box-label">
                                    <input id="${field.field + i}" name="${field.field}" class="tsg-input ${field.html.class ?? ""}" type="checkbox"
                                        ${tabindex_str} data-value="${items[i].id}" data-index="${i}">
                                    <span>&#160;${items[i].text}</span>
                                </label>
                            </div>`;
          }
          input += "</div>";
          break;
        }
        case "radio": {
          input = `<div class="tsg-field-group"${field.html.attr}>`;
          if (field.options.items == null && field.html.items != null) field.options.items = field.html.items;
          let items = field.options.items;
          if (!Array.isArray(items)) items = [];
          if (items.length > 0) {
            items = TsUtils.normMenu.call(this, items, field.options);
          }
          for (let i = 0; i < items.length; i++) {
            input += `
                            <div class="tsg-field-item">
                                <label class="tsg-box-label">
                                    <input id="${field.field + i}" name="${field.field}" class="tsg-input ${field.html.class ?? ""}" type="radio"
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
          input = `<select id="${field.field}" name="${field.field}" class="tsg-input ${field.html.class ?? ""}" ${field.html.attr + tabindex_str}>`;
          if (field.options.items == null && field.html.items != null) field.options.items = field.html.items;
          let items = field.options.items;
          if (!Array.isArray(items)) items = [];
          if (items.length > 0) {
            items = TsUtils.normMenu.call(this, items, field.options);
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
                            <div id="${field.field}-tb" class="tsg-form-switch ${field.html.class ?? ""}" ${field.html.attr}></div>
                            <input id="${field.field}" name="${field.field}" ${tabindex_str} class="tsg-input"
                                style="position: absolute; right: 0px; margin-top: -30px; width: 1px; padding: 0; opacity: 0">
                            <span style="position: absolute; margin-top: -2px;">${field.html.text ?? ""}</span>
                        </div>
                        `;
          break;
        }
        case "textarea":
          input = `<textarea id="${field.field}" name="${field.field}" class="tsg-input ${field.html.class ?? ""}" ${field.html.attr + tabindex_str}></textarea>`;
          break;
        case "toggle":
          input = `<input id="${field.field}" name="${field.field}" class="tsg-input tsg-toggle  ${field.html.class ?? ""}"
                                type="checkbox" ${field.html.attr + tabindex_str}>
                            <div><div></div></div>`;
          break;
        case "map":
        case "array":
          field.html.key = field.html.key || {};
          field.html.value = field.html.value || {};
          field.html.tabindex = tabindex;
          field.html.tabindex_str = tabindex_str;
          input = '<span style="float: right">' + (field.html.text || "") + '</span><input id="' + field.field + '" name="' + field.field + '" type="hidden" ' + field.html.attr + tabindex_str + '><div class="tsg-map-container"></div>';
          break;
        case "div":
        case "custom":
          input = `<div id="${field.field}" name="${field.field}" ${field.html.attr + tabindex_str} class="tsg-input ${field.html.class ?? ""}">` + (field && field.html && field.html.html ? field.html.html : "") + "</div>";
          break;
        case "html":
        case "empty":
          input = `<div id="${field.field}" name="${field.field}" ${field.html.attr + tabindex_str} class="tsg-input ${field.html.class ?? ""}">` + (field && field.html ? (field.html.html || "") + (field.html.text || "") : "") + "</div>";
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
          collapsible = '<span class="tsg-icon-collapse" style="width: 15px; display: inline-block; position: relative; top: -2px;"></span>';
        }
        html2 += '\n <div class="tsg-group">\n   <div class="tsg-group-title tsg-eaction" style="' + (field.html.groupTitleStyle || "") + "; " + (collapsible != "" ? "cursor: pointer; user-select: none" : "") + '"' + (collapsible != "" ? 'data-group="' + TsUtils.base64encode(field.html.group) + '"' : "") + (collapsible != "" ? 'data-click="toggleGroup|' + field.html.group + '"' : "") + ">" + collapsible + TsUtils.lang(field.html.group) + '</div>\n   <div class="tsg-group-fields" style="' + (field.html.groupStyle || "") + '">';
        group = field.html.group;
      }
      if (field.type == "columns") {
        html2 += `<div class="tsg-field-columns" style="${field.style ?? ""}">`;
        field.columns.forEach((col) => {
          html2 += `<div style="${col.style}"> ${col.content} </div>`;
        });
        html2 += "</div>";
      } else if (field.html.col_anchor != null) {
        let span = field.html.span != null ? "tsg-span" + field.html.span : "";
        if (field.html.span == -1) span = "tsg-span-none";
        let label = `
                    <label ${span == "none" ? ' style="display: none"' : ""}>
                        ${TsUtils.lang(field.type != "checkbox" ? field.html.label : field.html.text)}
                    </label>`;
        if (!field.html.label) label = "";
        const text = field.type != "array" && field.type != "map" ? TsUtils.lang(field.type != "checkbox" ? field.html.text : "") : "";
        pages[field.html.page].anchors ??= {};
        pages[field.html.page].anchors[field.html.col_anchor] = `
                    <div class="tsg-field ${span}" style="${(field.hidden ? "display: none;" : "") + field.html.style}">
                        ${label}
                        ${["empty", "switch", "radio", "check", "checks"].includes(field.type) ? input : `<div>${input + text}</div>`}
                    </div>`;
      } else if (field.html.anchor != null) {
        const span = field.html.span != null ? "tsg-span" + field.html.span : "tsg-span0";
        let label = TsUtils.lang(field.type != "checkbox" ? field.html.label : field.html.text, true);
        const text = TsUtils.lang(field.type != "checkbox" ? field.html.text : "");
        if (field.html.span == -1) {
          label = `<span style="position: absolute"> <span class="tsg-anchor-span-none tsg-inline-label"> ${label} </span> </span>`;
        } else {
          label = `<span class="tsg-inline-label"> ${label} </span>`;
        }
        pages[field.html.page].anchors ??= {};
        pages[field.html.page].anchors[field.html.anchor] = `
                    <div class="tsg-field tsg-field-inline ${span}" style="${(field.hidden ? "display: none;" : "") + field.html.style}">
                        ${field.type === "empty" || field.type == "switch" ? input : ` <div>
                                    ${label} ${input} ${text}
                                </div>`}
                    </div>`;
      } else {
        let span = field.html.span != null ? "tsg-span" + field.html.span : "";
        if (field.html.span == -1) span = "tsg-span-none";
        let label = `
                    <label ${span == "none" ? ' style="display: none"' : ""}>
                        ${TsUtils.lang(field.type != "checkbox" ? field.html.label : field.html.text)}
                    </label>`;
        if (!field.html.label) label = "";
        const text = field.type != "array" && field.type != "map" ? TsUtils.lang(field.type != "checkbox" ? field.html.text : "") : "";
        html2 += `
                    <div class="tsg-field ${span}" style="${(field.hidden ? "display: none;" : "") + field.html.style}">
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
      buttons += '\n<div class="tsg-buttons">';
      tabindex = this.tabindexBase + this.fields.length + 1;
      for (const a in this.actions) {
        const act = this.actions[a];
        const info = { text: "", style: "", "class": "" };
        if (TsUtils.isPlainObject(act)) {
          if (act.text == null && act.caption != null) {
            console.log("NOTICE: form action.caption property is deprecated, please use action.text. Action ->", act);
            act.text = act.caption;
          }
          if (act.text) info.text = act.text;
          if (act.style) info.style = act.style;
          if (act.class) info.class = act.class;
        } else {
          info.text = a;
          if (["save", "update", "create"].includes(a.toLowerCase())) info.class = "tsg-btn-blue";
          else info.class = "";
        }
        buttons += '\n    <button name="' + a + '" class="tsg-btn ' + info.class + '" style="' + info.style + '" tabindex="' + tabindex + '">' + TsUtils.lang(info.text) + "</button>";
        tabindex++;
      }
      buttons += "\n</div>";
    }
    let html = "";
    for (let p = 0; p < pages.length; p++) {
      html += '<div class="tsg-page page-' + p + '" style="' + (p !== 0 ? "display: none;" : "") + this.pageStyle + '">';
      if (!pages[p]) {
        console.log(`ERROR: Page ${p} does not exist`);
        return false;
      }
      if (pages[p].before) {
        html += pages[p].before;
      }
      html += '<div class="tsg-column-container">';
      Object.keys(pages[p]).sort().forEach((c, _ind) => {
        if (c == String(parseInt(c))) {
          html += '<div class="tsg-column col-' + c + '">' + (pages[p][c] || "") + "\n</div>";
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
    let click2 = act;
    if (TsUtils.isPlainObject(act) && act.onClick) click2 = act.onClick;
    const edata = this.trigger("action", { target: action, action: act, originalEvent: event2 });
    if (edata.isCancelled === true) return;
    if (typeof click2 === "function") click2.call(this, event2);
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAction(action) {
    const ret = query23(this.box).find('.tsg-buttons button[name="' + action + '"]');
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
        const headerHeight2 = self.header !== "" ? TsUtils.getSize(header, "height") : 0;
        const tbHeight2 = Array.isArray(self.toolbar?.items) && self.toolbar?.items?.length > 0 ? TsUtils.getSize(toolbar, "height") : 0;
        const tabsHeight2 = Array.isArray(self.tabs?.tabs) && self.tabs?.tabs?.length > 0 ? TsUtils.getSize(tabs, "height") : 0;
        toolbar.css({ top: headerHeight2 + "px" });
        tabs.css({ top: headerHeight2 + tbHeight2 + "px" });
        page.css({
          top: headerHeight2 + tbHeight2 + tabsHeight2 + "px",
          bottom: (buttons.length > 0 ? TsUtils.getSize(buttons, "height") : 0) + "px"
        });
        return { headerHeight: headerHeight2, tbHeight: tbHeight2, tabsHeight: tabsHeight2 };
      };
      var resizeElements = resizeElements2;
      const header = query23(this.box).find(":scope > div .tsg-form-header");
      const toolbar = query23(this.box).find(":scope > div .tsg-form-toolbar");
      const tabs = query23(this.box).find(":scope > div .tsg-form-tabs");
      const page = query23(this.box).find(":scope > div .tsg-page");
      const dpage = query23(this.box).find(":scope > div .tsg-page.page-" + this.page + " > div");
      const buttons = query23(this.box).find(":scope > div .tsg-buttons");
      const { headerHeight, tbHeight, tabsHeight } = resizeElements2();
      if (this.autosize) {
        const cHeight = query23(this.box).get(0).clientHeight;
        if (cHeight === 0 || query23(this.box).data("autosize") == "yes") {
          query23(this.box).css({
            height: headerHeight + tbHeight + tabsHeight + 15 + (page.length > 0 ? TsUtils.getSize(dpage, "height") : 0) + (buttons.length > 0 ? TsUtils.getSize(buttons, "height") : 0) + "px"
          });
          query23(this.box).data("autosize", "yes");
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
    if (!this.isGenerated || !query23(this.box).html()) return 0;
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
      query23(this.box).find("input, textarea, select").each((node) => {
        const el = node;
        const name = query23(el).attr("name") != null ? query23(el).attr("name") : query23(el).attr("id");
        const field = this.get(name);
        if (field) {
          const div = query23(el).closest(".tsg-page");
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
      query23(this.box).find(".tsg-page").hide();
      query23(this.box).find(".tsg-page.page-" + this.page).show();
      query23(this.box).find(".tsg-form-header").html(TsUtils.lang(this.header));
      if (typeof this.tabs === "object" && Array.isArray(this.tabs.tabs) && this.tabs.tabs.length > 0) {
        query23(this.box).find("#form_" + this.name + "_tabs").show();
        this.tabs.active = this.tabs.tabs[this.page].id;
        this.tabs.refresh();
      } else {
        query23(this.box).find("#form_" + this.name + "_tabs").hide();
      }
      if (typeof this.toolbar === "object" && Array.isArray(this.toolbar.items) && this.toolbar.items.length > 0) {
        query23(this.box).find("#form_" + this.name + "_toolbar").show();
        this.toolbar.refresh();
      } else {
        query23(this.box).find("#form_" + this.name + "_toolbar").hide();
      }
    }
    for (let f = 0; f < fields.length; f++) {
      const fieldIdx = fields[f];
      if (fieldIdx == null) continue;
      const field = this.fields[fieldIdx];
      if (field == null) continue;
      if (field.name == null && field.field != null) field.name = field.field;
      if (field.field == null && field.name != null) field.field = field.name;
      field.$el = query23(this.box).find(`[name='${String(field.name).replace(/\\/g, "\\\\")}']`);
      field.el = field.$el.get(0);
      if (field.el) field.el.id = field.name;
      if (field.TsField) {
        field.TsField.reset();
      }
      field.$el.off(".TsForm").on("change.TsForm", function(event2) {
        const value = self.getFieldValue(field.field);
        if (value == null) return;
        if (["enum", "file"].includes(field.type)) {
          const helper = field.TsField?.helpers?.multi;
          query23(helper).removeClass("tsg-error");
        }
        if (this._previous != null) {
          value.previous = this._previous;
          delete this._previous;
        }
        const edata2 = self.trigger("change", { target: this.name, field: this.name, value, originalEvent: event2 });
        if (edata2.isCancelled === true) return;
        self.setValue(this.name, value.current);
        edata2.finish();
      }).on("input.TsForm", function(event2) {
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
        field.$el.closest(".tsg-field").addClass("tsg-required");
      } else {
        field.$el.closest(".tsg-field").removeClass("tsg-required");
      }
      if (field.disabled != null) {
        if (field.disabled) {
          if (field.$el.data("tabIndex") == null) {
            field.$el.data("tabIndex", field.$el.prop("tabIndex"));
          }
          field.$el.prop("disabled", true).prop("tabIndex", -1).closest(".tsg-field").addClass("tsg-disabled");
        } else {
          field.$el.prop("disabled", false).prop("tabIndex", field.$el.data("tabIndex") ?? field.$el.prop("tabIndex") ?? 0).closest(".tsg-field").removeClass("tsg-disabled");
        }
      }
      let tmp = field.el;
      if (!tmp) tmp = query23(this.box).find("#" + field.field);
      if (field.hidden) {
        query23(tmp).closest(".tsg-field").hide();
      } else {
        query23(tmp).closest(".tsg-field").show();
      }
    }
    query23(this.box).find("button, input[type=button]").each((node) => {
      const el = node;
      query23(el).off("click").on("click", function(event2) {
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
      if (!field.$el.hasClass("tsg-input")) field.$el.addClass("tsg-input");
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
          field.options.items = TsUtils.normMenu.call(this, items ?? [], field.options);
        }
      }
      if (field.type == "switch") {
        if (field.toolbar) {
          ;
          TsUi[this.name + "_" + field.name + "_tb"].destroy();
        }
        field.options?.items?.forEach?.((it) => it.text == null ? it.text = "" : "");
        const items = TsUtils.normMenu.call(this, field.options.items, field.options) ?? [];
        items.forEach((item) => item.type ??= "radio");
        field.toolbar = new TsToolbar({
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
        field.$el.prev().addClass("tsg-form-switch");
        field.toolbar.resize();
        field.$el.off(".form-input").on("focus.form-input", (event2) => {
          const ind = field.toolbar.get(field.$el.val(), true);
          query23(event2.target).prop("_index", ind);
          query23(field.toolbar.box).addClass("tsg-tb-focus");
        }).on("blur.form-input", (event2) => {
          query23(event2.target).removeProp("_index");
          query23(`#${field.name}-tb .tsg-tb-button`).removeClass("over");
          query23(field.toolbar.box).removeClass("tsg-tb-focus");
        }).on("keydown.form-input", (event2) => {
          let ind = query23(event2.target).prop("_index");
          switch (event2.key) {
            case "ArrowLeft": {
              if (ind > 0) ind--;
              query23(`#${field.name}-tb .tsg-tb-button`).removeClass("over").eq(ind).addClass("over");
              query23(event2.target).prop("_index", ind);
              break;
            }
            case "ArrowRight": {
              if (ind < field.toolbar.items.length - 1) ind++;
              query23(`#${field.name}-tb .tsg-tb-button`).removeClass("over").eq(ind).addClass("over");
              query23(event2.target).prop("_index", ind);
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
            query23(`#${field.name}-tb .tsg-tb-button`).removeClass("over");
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
      if (this.TsFIELD_TYPES.includes(field.type)) {
        field.TsField = field.TsField ?? new TsField(TsUtils.extend({}, field.options, { type: field.type }));
        field.TsField.render(field.el);
      }
      if (["map", "array"].includes(field.type)) {
        (function(obj, field2) {
          field2.el.mapAdd = function(field3, div, cnt, empty) {
            const attr = (field3.disabled ? " readOnly " : "") + (field3.html.tabindex_str || "");
            let html = `<input type="text" ${(field3.html.value.attr ?? "") + attr} class="tsg-input ${field3.html.class ?? ""} tsg-map value">${field3.html.value.text || ""}`;
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
              html = `<input type="text" ${(field3.html.key.attr ?? "") + attr} class="tsg-input ${field3.html.class ?? ""} tsg-map key">
                                ${field3.html.key.text || ""}
                            ` + html;
            }
            div.append(`<div class="tsg-map-field" style="margin-bottom: 5px" data-index="${cnt}">${html}</div>`);
            if (typeof field3.html.render == "function") {
              const box = div.find(`[data-index="${cnt}"]`);
              box.find("input, textarea").each((el) => {
                if (query23(el).attr("tabindex") == null) {
                  query23(el).attr("tabindex", field3.html.tabindex);
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
              if (!TsUtils.isPlainObject(map)) map = {};
              if (map._order == null) map._order = Object.keys(map);
              keys = map._order;
            }
            if (field2.type == "array") {
              if (!Array.isArray(map)) map = [];
              keys = map.map((item, ind) => {
                return ind;
              });
            }
            div.find(".tsg-map-field").remove();
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
                $k = fld.find(".tsg-map.key");
                $v = fld.find(".tsg-map.value");
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
              $v = div.find(".tsg-map-field:last-child input:first-child");
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
            const container = query23(field2.el).get(0)?.nextSibling;
            query23(container).off(".mapChange").on("mouseup.mapChange", { delegate: "input, textarea" }, function(event2) {
              if (document.activeElement != event2.target) {
                event2.target.focus();
              }
            }).on("keyup.mapChange", { delegate: "input, textarea" }, function(event2) {
              const kbdEvent = event2;
              const $div = query23(kbdEvent.target).closest(".tsg-map-field");
              const next = $div.get(0).nextElementSibling;
              const prev = $div.get(0).previousElementSibling;
              const className = query23(kbdEvent.target).hasClass("key") ? "key" : "value";
              if (kbdEvent.keyCode == 38 && prev) {
                query23(prev).find(`input.${className}, textarea.${className}, input[name="${kbdEvent.target["name"]}"] textarea[name="${kbdEvent.target["name"]}"]`).get(0)?.select();
                kbdEvent.preventDefault();
              }
              if (kbdEvent.keyCode == 40 && next) {
                ;
                kbdEvent.target.blur();
                const next2 = $div.get(0).nextElementSibling;
                query23(next2).find(`input.${className}, textarea.${className}, input[name="${kbdEvent.target["name"]}"] textarea[name="${kbdEvent.target["name"]}"]`).get(0)?.select();
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
              const fld = query23(event2.target).closest("div.tsg-map-field");
              const cnt2 = fld.data("index");
              const next = fld.get(0).nextElementSibling;
              let isEmpty = true;
              query23(fld).find("input, textarea").each((node) => {
                const el = node;
                if (!["checkbox", "button"].includes(el.type) && el.value != "") isEmpty = false;
              });
              let isNextEmpty = true;
              query23(next).find("input, textarea").each((node) => {
                const el = node;
                if (!["checkbox", "button"].includes(el.type) && el.value != "") isNextEmpty = false;
              });
              if (!isEmpty && !next) {
                field2.el.mapAdd(field2, div, parseInt(cnt2) + 1, true);
              } else if (isEmpty && next && isNextEmpty) {
                query23(next).remove();
              }
            }).on("change.mapChange", { delegate: "input, textarea" }, function(_event) {
              const event2 = _event;
              self.rememberOriginal();
              const _fieldValue = self.getFieldValue(field2.field);
              if (_fieldValue == null) return;
              let { current, previous, original } = _fieldValue;
              const $cnt = query23(event2.target).closest(".tsg-map-container");
              if (typeof field2.html?.render == "function") {
                current = current.filter((kk) => {
                  const val = [...new Set(Object.values(kk).filter((vv) => typeof vv != "boolean"))];
                  return !(val.length == 0 || val.length == 1 && val[0] === "");
                });
              } else if (field2.type == "map") {
                current._order = [];
                $cnt.find(".tsg-map.key").each((node) => {
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
              const cnt2 = query23(event2.target).closest(".tsg-map-container");
              if (field2.type == "array" || lastKey == "tab") {
                cnt2.find("input, textarea").each((node, ind) => {
                  if (node == event2.target) index = ind;
                });
              } else {
                className = query23(event2.target).hasClass("key") ? ".key" : ".value";
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
    if (typeof box == "string") box = query23(box).get(0);
    const edata = this.trigger("render", { target: this.name, box: box ?? this.box });
    if (edata.isCancelled === true) return;
    if (box != null) {
      this.unmount();
      this.box = box;
    }
    if (!this.isGenerated && !this.formHTML) return;
    if (!this.box) return;
    const html = '<div class="tsg-form-box">' + (this.header !== "" ? '<div class="tsg-form-header">' + TsUtils.lang(this.header) + "</div>" : "") + '    <div id="form_' + this.name + '_toolbar" class="tsg-form-toolbar" style="display: none"></div>    <div id="form_' + this.name + '_tabs" class="tsg-form-tabs" style="display: none"></div>' + this.formHTML + "</div>";
    query23(this.box).attr("name", this.name).addClass("tsg-reset tsg-form").html(html);
    if (query23(this.box).length > 0) query23(this.box).get(0).style.cssText += this.style;
    TsUtils.bindEvents(query23(this.box).find(".tsg-eaction"), this);
    if (typeof this.toolbar.render !== "function") {
      this.toolbar = new TsToolbar(TsUtils.extend({}, this.toolbar, { name: this.name + "_toolbar", owner: this }));
      this.toolbar.on("click", function(event2) {
        const edata2 = self.trigger("toolbar", { target: event2.target, originalEvent: event2 });
        if (edata2.isCancelled === true) return;
        edata2.finish();
      });
    }
    if (typeof this.toolbar === "object" && typeof this.toolbar.render === "function") {
      this.toolbar.render(query23(this.box).find("#form_" + this.name + "_toolbar").get(0));
    }
    if (typeof this.tabs.render !== "function") {
      this.tabs = new TsTabs(TsUtils.extend({}, this.tabs, { name: this.name + "_tabs", owner: this, active: this.tabs.active }));
      this.tabs.on("click", function(event2) {
        self.goto(this.get(event2.target, true));
      });
    }
    if (typeof this.tabs === "object" && typeof this.tabs.render === "function") {
      this.tabs.render(query23(this.box).find("#form_" + this.name + "_tabs").get(0));
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
        if (query23(self.box).find("input, select, textarea").length > 0) {
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
    if (query23(this.box).find("#form_" + this.name + "_tabs").length > 0) {
      this.unmount();
    }
    this.last.observeResize?.disconnect();
    delete TsUi[this.name];
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFocus(focus2) {
    if (typeof focus2 === "undefined") {
      focus2 = this.focus;
    }
    let $input;
    if (TsUtils.isInt(focus2)) {
      if (focus2 < 0) {
        return;
      }
      const inputs = query23(this.box).find("div:not(.tsg-field-helper) > input, select, textarea, div > label:nth-child(1) > [type=radio]").filter(":not(.file-input)");
      while (inputs.get(focus2)?.offsetParent == null && inputs.length > focus2) {
        focus2++;
      }
      if (inputs.get(focus2)) {
        $input = query23(inputs.get(focus2));
      }
    } else if (typeof focus2 === "string") {
      $input = query23(this.box).find(`[name='${focus2}']`);
    }
    if ($input?.length > 0) {
      $input.get(0).focus();
    }
    return $input;
  }
};
export {
  Tooltip,
  TsAlert,
  TsBase,
  TsColor,
  TsConfirm,
  TsDate,
  TsDialog,
  TsEvent,
  TsField,
  TsForm,
  TsGrid,
  TsLayout,
  TsLocale,
  TsMenu,
  TsPopup,
  TsPrompt,
  TsSidebar,
  TsTabs,
  TsToolbar,
  TsTooltip,
  TsUi,
  TsUtils,
  query7 as query,
  toSafeEvent
};
/*
 * @author     Lauri Rooden (https://github.com/litejs/natural-compare-lite)
 * @license    MIT License
 */
//# sourceMappingURL=tsgrid-ui.es6.js.map