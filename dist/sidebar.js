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

// src/tssidebar.ts
var tssidebar_exports = {};
__export(tssidebar_exports, {
  TsSidebar: () => TsSidebar
});
module.exports = __toCommonJS(tssidebar_exports);

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
function isDOMNode(val) {
  return typeof Node !== "undefined" && val instanceof Node;
}
function isDOMEvent(val) {
  return typeof Event !== "undefined" && val instanceof Event;
}
function isHTMLElement(val) {
  return typeof HTMLElement !== "undefined" && val instanceof HTMLElement;
}
function isDOMWindow(val) {
  return typeof Window !== "undefined" && val instanceof Window;
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
    if (obj instanceof Function && !opts.functions || isDOMNode(obj) && !opts.elements || isDOMEvent(obj) && !opts.events) {
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
  } else if (isDOMNode(target) || isDOMEvent(target)) {
    throw new Error("HTML elmenents and events cannot be extended");
  } else if (target && typeof target == "object" && source != null) {
    if (typeof source != "object") {
      throw new Error("Object can be extended with other objects only.");
    }
    Object.keys(source).forEach((key) => {
      if (target[key] != null && typeof target[key] == "object" && source[key] != null && typeof source[key] == "object") {
        const src = clone(source[key]);
        if (isDOMNode(target[key]) || isDOMEvent(target[key])) {
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
  } catch (event) {
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
    } else if (isDOMNode(selector) || isDOMWindow(selector)) {
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
    } else if (isDOMNode(html)) {
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
      const event = parts[0] ?? "";
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
        this._save(node, "events", [{ event, scope, callback: cb, options }]);
        node.addEventListener(event, cb, options);
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
      const event = offParts[0] ?? "";
      const scope = offParts[1];
      this.each((node) => {
        if (Array.isArray(node._mQuery?.events)) {
          for (let i = node._mQuery.events.length - 1; i >= 0; i--) {
            const evt = node._mQuery.events[i];
            if (!evt) continue;
            if (scope == null || scope === "") {
              if ((evt.event == event || event === "") && (evt.callback == callback || callback == null)) {
                node.removeEventListener(evt.event, evt.callback, evt.options);
                node._mQuery.events.splice(i, 1);
              }
            } else {
              if ((evt.event == event || event === "") && evt.scope == scope) {
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
    let event;
    const mevent = ["click", "dblclick", "mousedown", "mouseup", "mousemove"];
    const kevent = ["keydown", "keyup", "keypress"];
    if (isDOMEvent(name)) {
      event = name;
    } else if (mevent.includes(name)) {
      event = new MouseEvent(name, options);
    } else if (kevent.includes(name)) {
      event = new KeyboardEvent(name, options);
    } else {
      event = new Event(name, options);
    }
    this.each((node) => {
      node.dispatchEvent(event);
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
    if (isHTMLElement(html)) {
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

// src/tsbase.ts
var query2 = query;
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
      edata = this.activeEvents.find((event) => {
        if (event.type == edata.type && event.target == edata.target) {
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
    const remove = [];
    if (isHTMLElement(this.box)) {
      this.box.classList.forEach((cl) => {
        if (cl.startsWith("tsg-")) remove.push(cl);
      });
    }
    query2(this.box).off().removeClass(remove).removeAttr("name").html("");
    this.box = null;
    edata.finish();
  }
};

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
var query3 = query;
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
    query3(el).each((el2) => {
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

// src/icons.ts
function _escapeAttr(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function _renderSvg(viewBox, paths, opts) {
  const fill = opts?.color ? _escapeAttr(opts.color) : "currentColor";
  let attrs = `xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="${fill}"`;
  if (opts?.label && opts.label.length > 0) {
    attrs += ` role="img" aria-label="${_escapeAttr(opts.label)}"`;
  } else {
    attrs += ' aria-hidden="true"';
  }
  if (opts?.class) {
    attrs += ` class="${_escapeAttr(opts.class)}"`;
  }
  if (opts?.size !== void 0) {
    attrs += ` width="${opts.size}" height="${opts.size}"`;
  }
  return `<svg ${attrs}>${paths}</svg>`;
}
var CHECK_PATHS = '<polygon points="416 0 192 238 49 101 0 149 192 341 466 51"/>';
var COLORS_PATHS = '<path d="M81.382 153.549c-10.829-8.96-27.059-7.424-36.045 3.379l-32.691 39.399c-8.96 10.829-7.449 27.085 3.354 36.019l201.933 167.475-97.459-213.863-39.091-32.41zM179.533 68.685l-46.592 21.222c-12.775 5.837-18.483 21.12-12.672 33.894l108.8 238.72 5.453-234.982-21.043-46.183c-5.888-12.8-21.145-18.509-33.946-12.672zM363.801 73.907c0.333-14.080-10.931-25.856-24.986-26.189l-51.2-1.178c-14.055-0.333-25.831 10.931-26.163 24.986l-6.119 262.221 107.264-209.075 1.203-50.765zM491.289 98.227l-45.543-23.373c-12.519-6.4-28.058-1.408-34.483 11.111l-163.609 318.873c-6.425 12.519-1.434 28.058 11.11 34.483l45.543 23.373c12.519 6.425 28.032 1.433 34.457-11.085l163.609-318.873c6.425-12.57 1.433-28.083-11.085-34.509zM327.654 417.101c-6.451 12.595-21.888 17.562-34.457 11.111-12.595-6.451-17.536-21.863-11.085-34.457s21.863-17.536 34.457-11.085c12.595 6.425 17.536 21.863 11.085 34.432z"/>';
var CROSS_PATHS = '<path d="M567.006313,46.872 C572.393313,52.259 575.086312,58.725 575.086312,66.266 C575.086312,73.809 572.393313,80.273 567.006313,85.66 L355.725,281.714 L558.926313,473.71775 C564.313313,479.10675 567.006313,485.57175 567.006313,493.11375 C567.006313,500.65575 564.313313,507.12175 558.926313,512.50875 L520.135312,551.29875 C514.748313,556.68675 508.283313,559.38075 500.740312,559.38075 C493.197313,559.38075 486.732312,556.68675 481.345312,551.29875 L283.144,360.294 L85.66,551.29875 C80.273,556.68575 73.809,559.38075 66.265,559.38075 C58.724,559.38075 52.259,556.68575 46.871,551.29875 L8.081,512.50975 C2.694,507.12075 -0.00200027819,500.65575 -0.00200027819,493.11375 C-0.00200027819,485.57075 2.693,479.10575 8.081,473.71775 L210.564,282.714 L8.079,87.661 C2.691,82.274 -0.00200027819,75.809 -0.00200027819,68.267 C-0.00200027819,60.725 2.692,54.26 8.079,48.872 L46.869,10.082 C52.257,4.695 58.722,1.99999917 66.265,1.99999917 C73.806,1.99999917 80.271,4.693 85.659,10.081 L283.144,210.134 L489.425313,8.08 C494.812313,2.693 501.277313,0 508.820313,0 C516.363313,0 522.828313,2.694 528.215313,8.082 L567.006313,46.872 Z"/>';
var EMPTY_PATHS = "";
var EYE_DROPPER_PATHS = '<path d="M246.627 9.373c-12.497-12.496-32.758-12.496-45.255 0l-43.029 43.029-30.343-30.343-33.941 33.941 26.606 26.606-118.029 118.029c-2.012 2.012-2.867 4.739-2.575 7.364h-0.061v40c0 4.418 3.582 8 8 8h40c0 0 0.666 0 1 0 2.303 0 4.606-0.879 6.364-2.636l118.029-118.030 26.607 26.607 33.941-33.941-30.343-30.343 43.030-43.029c12.497-12.497 12.497-32.758 0-45.255zM43.273 240h-27.273v-27.273l117.394-117.393 27.272 27.272-117.393 117.394z"/>';
var SEARCH_PATHS = '<path d="M496.131 435.698l-121.276-103.147c-12.537-11.283-25.945-16.463-36.776-15.963 28.628-33.534 45.921-77.039 45.921-124.588 0-106.039-85.961-192-192-192-106.038 0-192 85.961-192 192 0 106.039 85.961 192 192 192 47.549 0 91.054-17.293 124.588-45.922-0.5 10.831 4.68 24.239 15.963 36.776l103.147 121.276c17.661 19.623 46.511 21.277 64.11 3.678s15.946-46.449-3.677-64.11zM192 320c-70.692 0-128-57.308-128-128s57.308-128 128-128 128 57.308 128 128-57.307 128-128 128z"/>';
var SETTINGS_PATHS = '<path d="M224 64v-8c0-13.2-10.8-24-24-24h-80c-13.2 0-24 10.8-24 24v8h-96v64h96v8c0 13.2 10.8 24 24 24h80c13.2 0 24-10.8 24-24v-8h288v-64h-288zM128 128v-64h64v64h-64zM416 216c0-13.2-10.8-24-24-24h-80c-13.2 0-24 10.8-24 24v8h-288v64h288v8c0 13.2 10.8 24 24 24h80c13.2 0 24-10.8 24-24v-8h96v-64h-96v-8zM320 288v-64h64v64h-64zM224 376c0-13.2-10.8-24-24-24h-80c-13.2 0-24 10.8-24 24v8h-96v64h96v8c0 13.2 10.8 24 24 24h80c13.2 0 24-10.8 24-24v-8h288v-64h-288v-8zM128 448v-64h64v64h-64z"/>';
var checkIcon = (opts) => _renderSvg("-30 -30 562 412", CHECK_PATHS, opts);
var colorsIcon = (opts) => _renderSvg("0 0 470 470", COLORS_PATHS, opts);
var crossIcon = (opts) => _renderSvg("-80 -80 700 700", CROSS_PATHS, opts);
var emptyIcon = (opts) => _renderSvg("-49.5 140.5 512 512", EMPTY_PATHS, opts);
var eyeDropperIcon = (opts) => _renderSvg("0 0 256 256", EYE_DROPPER_PATHS, opts);
var searchIcon = (opts) => _renderSvg("0 0 512 512", SEARCH_PATHS, opts);
var settingsIcon = (opts) => _renderSvg("0 0 512 512", SETTINGS_PATHS, opts);

// src/tsutils-notify.ts
var query4 = query;
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
      query4(deps.tmpSlot["notify_where"]).find("#tsg-notify").remove();
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
                            <span class="tsg-notify-close">${crossIcon({ label: "Close", size: 16 })}</span>
                        </div>
                    </div>`;
      query4(where).append(html);
      query4(where).find("#tsg-notify").find(".tsg-notify-close").on("click", (_event) => {
        query4(where).find("#tsg-notify").remove();
        resolve();
      });
      if (opts["actions"]) {
        query4(where).find("#tsg-notify .tsg-notify-link").on("click", (event) => {
          const value = query4(event.target).attr("value") ?? "";
          opts["actions"][value]();
          query4(where).find("#tsg-notify").remove();
          resolve();
        });
      }
      if (opts["timeout"] > 0) {
        deps.tmpSlot["notify_timer"] = setTimeout(() => {
          query4(where).find("#tsg-notify").remove();
          resolve();
        }, opts["timeout"]);
      }
    }
  });
}

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
    const focus = msgBoxEl?.["_msg_prevFocus"];
    if (query5(where.box).find(".tsg-message").length <= 1) {
      if (where.owner) {
        where.owner.unlock?.(where.param, 150);
      } else {
        deps.unlock(where.box, 150);
      }
    } else {
      query5(where.box).find(`#tsg-message-${where.owner?.name}-${options2["msgIndex"] - 1}`).css("z-index", "1500");
    }
    if (focus) {
      const msg = query5(focus).closest(".tsg-message");
      if (msg.length > 0) {
        const opt = msg.get(0)["_msg_options"];
        opt["setFocus"](focus);
      } else {
        focus.focus();
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
  msgOpts["on"]("open", (event) => {
    deps.bindEvents(query5(msgOpts["box"]).find(".tsg-eaction"), msgOpts);
    const detail = event["detail"];
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
    msgBase.actions = { Ok(event) {
      event["detail"]?.["self"]?.["close"]?.();
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
        msgOpts["on"]("action.buttons", (event) => {
          const detail = event["detail"];
          const act = String(detail["action"]);
          const target = (act[0] ?? "").toLowerCase() + act.substr(1).replace(/\s+/g, "");
          if (target == btnAction) callBack(event);
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
  msgBase.action = (action, event) => {
    let click = msgBase.actions?.[action];
    if (click instanceof Object && click["onClick"]) click = click["onClick"];
    const edata2 = msgOpts["trigger"]("action", {
      target: deps.ownerName,
      action,
      self: msgBase,
      originalEvent: event,
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
  msgBase.setFocus = (focus) => {
    const cnt = query5(where.box).find(".tsg-message").length - 1;
    const box = query5(where.box).find(`#tsg-message-${where.owner?.name}-${cnt}`);
    const sel = "input, button, select, textarea, [contentEditable], .tsg-input";
    if (focus != null) {
      const el = typeof focus === "string" ? box.find(sel).filter(focus).get(0) : box.find(sel).get(focus);
      el?.focus();
    } else {
      box.find("[name=hidden-first]").get(0)?.focus();
    }
    query5(where.box).find(".tsg-message").find(sel + ",[name=hidden-first],[name=hidden-last]").off(".keep-focus");
    query5(box).find(sel + ",[name=hidden-first],[name=hidden-last]").on("blur.keep-focus", function(_event) {
      setTimeout(() => {
        const focus2 = document.activeElement;
        const inside = focus2 != null && query5(box).find(sel).filter(focus2).length > 0;
        const name = query5(focus2).attr("name");
        if (!inside && focus2 && focus2 !== document.body) {
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
    prom.action((event) => {
      const d = event["detail"];
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
    prom.action((event) => {
      const d = event["detail"];
      const self = d?.["self"];
      self?.["close"]?.();
    }).then((event) => {
      const d = event["detail"];
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
  if (isDOMNode(box?.[0])) {
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
  }).on("mousewheel", function(event) {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }
  });
}
function unlock(box, speed) {
  if (box == null) return;
  const prevBox = box;
  clearTimeout(prevBox["_prevUnlock"]);
  let boxSel = box;
  if (isDOMNode(box?.[0])) {
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
  if (isDOMNode(selectorR?.[0])) {
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
      query6(el).off(name + ".TsUtils-bind").on(name + ".TsUtils-bind", function(event) {
        switch (method) {
          case "alert":
            alert(params[0]);
            break;
          case "stop":
            event.stopPropagation();
            break;
          case "prevent":
            event.preventDefault();
            break;
          case "stopPrevent":
            event.stopPropagation();
            event.preventDefault();
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
                  return event;
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
function _date(dateStr, settings, deps) {
  if (dateStr === "" || dateStr == null || typeof dateStr === "object" && !dateStr.getMonth) return "";
  let d1 = new Date(dateStr);
  if (isInt(dateStr)) d1 = new Date(Number(dateStr));
  if (String(d1) === "Invalid Date") return "";
  const months = settings.shortmonths;
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
  if (dd1 === dd3) dsp = deps.lang("Yesterday");
  return '<span title="' + dd1 + " " + time2 + '">' + dsp + "</span>";
}

// src/tsutils-locale.ts
async function _locale(locale, keepPhrases, noMerge, settings, deps) {
  if (Array.isArray(locale)) {
    let mergedSettings = deps.extend({}, { ...settings, phrases: {} });
    const localeArr = locale.map(
      (f) => f.length === 5 ? "locale/" + f.toLowerCase() + ".json" : f
    );
    const proms = [];
    const files = {};
    localeArr.forEach((file) => {
      proms.push(_locale(file, true, false, mergedSettings, deps));
    });
    const res = await Promise.allSettled(proms);
    res.forEach((r) => {
      if (r.status === "fulfilled" && r.value.kind === "load") {
        files[r.value.file] = r.value.data;
      }
    });
    localeArr.forEach((file) => {
      mergedSettings = deps.extend({}, mergedSettings, files[file] ?? {});
    });
    return { kind: "void", settings: mergedSettings };
  }
  if (!locale) locale = "en-us";
  if (typeof locale === "object") {
    const mergedSettings = deps.extend({}, settings, TsLocale, locale);
    return { kind: "merge", settings: mergedSettings };
  }
  let localeStr = locale;
  if (localeStr.length === 5) {
    localeStr = "locale/" + localeStr.toLowerCase() + ".json";
  }
  try {
    const res = await deps.fetch(localeStr, { method: "GET" });
    const data = await res.json();
    if (noMerge !== true) {
      if (keepPhrases) {
        const newSettings = deps.extend({}, settings, data);
        return { kind: "load", file: localeStr, data, settings: newSettings };
      } else {
        const phrasesCleared = { ...settings, phrases: {} };
        const newSettings = deps.extend({}, phrasesCleared, TsLocale, data);
        return { kind: "load", file: localeStr, data, settings: newSettings };
      }
    }
    return { kind: "load", file: localeStr, data };
  } catch (err) {
    console.log("ERROR: Cannot load locale " + localeStr);
    throw err;
  }
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
    return _date(dateStr, this.settings, { lang: this.lang.bind(this) });
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
    const deps = {
      extend: this.extend.bind(this),
      fetch: globalThis.fetch.bind(globalThis)
    };
    return _locale(locale, keepPhrases, noMerge, this.settings, deps).then((result) => {
      if (result.settings) this.settings = result.settings;
      return result.kind === "load" ? { file: result.file, data: result.data } : void 0;
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

// src/lazy-singleton.ts
function lazySingleton(factory, protoRef) {
  let _impl = null;
  const materialize = () => _impl ??= factory();
  return new Proxy({}, {
    get(_t, prop, receiver) {
      return Reflect.get(materialize(), prop, receiver);
    },
    set(_t, prop, value, _receiver) {
      return Reflect.set(materialize(), prop, value, materialize());
    },
    has(_t, prop) {
      return Reflect.has(materialize(), prop);
    },
    ownKeys() {
      return Reflect.ownKeys(materialize());
    },
    getOwnPropertyDescriptor(_t, prop) {
      return Reflect.getOwnPropertyDescriptor(materialize(), prop);
    },
    defineProperty(_t, prop, desc) {
      return Reflect.defineProperty(materialize(), prop, desc);
    },
    getPrototypeOf() {
      return protoRef.prototype;
    }
  });
}

// src/tstooltip.ts
var query8 = query;
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
      query8(anchor).off(`.${scope}`).on(`${options.autoShowOn}.${scope}`, (event) => {
        self.show(overlay.name);
        event.stopPropagation();
      });
      delete options.autoShowOn;
      options._keep = true;
    }
    if (options.autoHideOn) {
      const scope = "autoHide-" + overlay.name;
      query8(anchor).off(`.${scope}`).on(`${options.autoHideOn}.${scope}`, (event) => {
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
    if (isHTMLElement(name) || name instanceof Object) {
      let options2 = name;
      if (isHTMLElement(name)) {
        options2 = extraOptions || {};
        options2.anchor = name;
      }
      const ret = this.attach(options2);
      ret.overlay.tmp.hidden = false;
      query8(ret.overlay.anchor).off(".autoShow-" + ret.overlay.name).off(".autoHide-" + ret.overlay.name);
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
      query8(overlay.box).find(".tsg-overlay-body").attr("style", (options.style || "") + "; " + overlayStyles).removeClass(null).addClass("tsg-overlay-body " + options.class + (options.draggable ? " tsg-draggable" : "")).html(options.html);
      this.resize(overlay.name);
    } else {
      edata = this.trigger("show", { target: name, overlay });
      if (edata.isCancelled === true) return;
      query8("body").append(
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
      overlay.box = query8("#" + TsUtils.escapeId(overlay.id))[0];
      overlay.displayed = true;
      const names = query8(overlay.anchor).data("tooltipName") ?? [];
      names.push(name);
      query8(overlay.anchor).data("tooltipName", names);
      TsUtils.bindEvents(overlay.box, {});
      overlay.tmp.originalCSS = "";
      if (query8(overlay.anchor).length > 0) {
        overlay.tmp.originalCSS = query8(overlay.anchor)[0].style.cssText;
      }
      this.resize(overlay.name);
    }
    if (options.anchorStyle) {
      overlay.anchor.style.cssText += ";" + options.anchorStyle;
    }
    if (options.anchorClass) {
      if (!(options.anchorClass == "tsg-focus" && overlay.anchor == document.body)) {
        query8(overlay.anchor).addClass(options.anchorClass);
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
    query8(overlay.box).show();
    overlay.tmp.observeTooltipResize.observe(overlay.box);
    overlay.tmp.observeAnchorResize.observe(overlay.anchor);
    overlay.tmp.observeAnchorMove.observe(overlay.anchor, { attributes: true });
    _Tooltip.observeRemove.observe(document.body, { subtree: true, childList: true });
    query8(overlay.box).css("opacity", 1).find(".tsg-overlay-body").html(options.html);
    setTimeout(() => {
      query8(overlay.box).css({ "pointer-events": "auto" }).data("ready", "yes");
    }, 100);
    TsUtils.bindEvents(query8(overlay.box).find(".tsg-eaction"), this);
    delete overlay.needsUpdate;
    overlay.box.overlay = overlay;
    query8(overlay.box).off("mousedown.tsg-bringfront").on("mousedown.tsg-bringfront", () => {
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
      query8(queryEl).off(`.${scope}`).on(`scroll.${scope}`, (_event) => {
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
      const $anchor = query8(overlay.anchor);
      const scope = "tooltip-" + overlay.name;
      query8("html").off(`.${scope}`);
      if (options.hideOn.includes("doc-click")) {
        if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
          $anchor.off(`.${scope}-doc`).on(`click.${scope}-doc`, (event) => {
            event.stopPropagation();
          });
        }
        query8("html").on(`click.${scope}`, hide);
      }
      if (options.hideOn.includes("tooltip-click")) {
        query8(overlay.box).off(`click.${scope}`).on(`click.${scope}`, hide);
      }
      if (options.hideOn.includes("focus-change") || options.hideOn.includes("blur")) {
        query8("html").on(`focusin.${scope}`, (_e) => {
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
    if (isHTMLElement(name)) {
      const names2 = query8(name).data("tooltipName") ?? [];
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
    query8("html").off(`.${scope}`);
    query8(document).off(`.${scope}`);
    overlay.box?.remove();
    overlay.box = null;
    overlay.displayed = false;
    const names = query8(overlay.anchor).data("tooltipName") ?? [];
    const ind = names.indexOf(overlay.name);
    if (ind != -1) names.splice(names.indexOf(overlay.name), 1);
    if (names.length == 0) {
      query8(overlay.anchor).removeData("tooltipName");
    } else {
      query8(overlay.anchor).data("tooltipName", names);
    }
    if (overlay.options.anchorStyle) {
      overlay.anchor.style.cssText = overlay.tmp.originalCSS;
    }
    query8(overlay.anchor).off(`.${scope}`).removeClass(overlay.options.anchorClass);
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
    const qBox = query8(overlay.box).css({
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
      query8(overlay.box).css({ width: "", height: "", scroll: "auto" });
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
    const el = query8(event.target).closest(".tsg-overlay");
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
    query8(document).off(".tsg-drag").on("selectstart.tsg-drag, dragstart.tsg-drag", (e) => e.preventDefault()).find("body").addClass("tsg-overlay-dragging");
    query8("html").off(".TsColor").on("mousemove.TsColor", mouseMove).on("mouseup.TsColor", mouseUp);
    function mouseUp(_event) {
      query8("html").off(".TsColor");
      query8(document).off("selectstart.tsg-drag");
      query8(document).off("dragstart.tsg-drag");
      query8(document.body).removeClass("tsg-overlay-dragging");
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
        const actions = query8(ret.overlay.box).find(".tsg-eaction");
        TsUtils.bindEvents(actions, this);
        this.initControls(ret.overlay);
      }
    });
    overlay.on("update:after.attach", (_event) => {
      if (ret.overlay?.box) {
        const actions = query8(ret.overlay.box).find(".tsg-eaction");
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
      this.index = (query8(target).attr("index") ?? "").split(":").map(Number);
      name = query8(target).closest(".tsg-overlay").attr("name");
    }
    const overlay = this.get(name);
    const edata = this.trigger("liveUpdate", { color, target: name, overlay, param: name });
    if (edata.isCancelled === true) return;
    if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName) && overlay.options.updateInput) {
      query8(overlay.anchor).val(color);
    }
    overlay.newColor = color;
    query8(overlay.box).find(".tsg-color.tsg-selected").removeClass("tsg-selected");
    if (target) {
      query8(target).addClass("tsg-selected");
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
      name = query8(name.target).closest(".tsg-overlay").attr("name");
    }
    const overlay = this.get(name);
    const tab = query8(overlay.box).find(`.tsg-color-tab:nth-child(${index})`);
    query8(overlay.box).find(".tsg-color-tab").removeClass("tsg-selected");
    query8(tab).addClass("tsg-selected");
    query8(overlay.box).find(".tsg-tab-content").hide().closest(".tsg-colors").find(".tab-" + index).show();
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
                        <span class="tsg-icon">${eyeDropperIcon({ label: "Eye dropper" })}</span>
                    </div>
                </div>
            </div>`;
    html += `
            <div class="tsg-color-tabs">
                <div class="tsg-color-tab tsg-selected tsg-eaction" data-click="tabClick|1|event|this"><span class="tsg-icon">${colorsIcon({ label: "Colors" })}</span></div>
                <div class="tsg-color-tab tsg-eaction" data-click="tabClick|2|event|this"><span class="tsg-icon">${settingsIcon({ label: "Settings" })}</span></div>
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
                    <span class="tsg-icon">${eyeDropperIcon({ label: "Eye dropper" })}</span>
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
    query8(overlay.box).off(".TsColor").on("contextmenu.TsColor", (event) => {
      event.preventDefault();
    }).find("input").off(".TsColor").on("change.TsColor", (event) => {
      const el = query8(event.target);
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
    query8(overlay.box).find(".color-original").off(".TsColor").on("click.TsColor", (event) => {
      const tmp = TsUtils.parseColor(query8(event.target).css("background-color"));
      if (tmp != null) {
        rgb = tmp;
        hsv = TsUtils.rgb2hsv(rgb);
        setColor(hsv, true);
      }
    });
    const mDown = `${!TsUtils.isMobile ? "mousedown" : "touchstart"}.TsColor`;
    const mUp = `${!TsUtils.isMobile ? "mouseup" : "touchend"}.TsColor`;
    const mMove = `${!TsUtils.isMobile ? "mousemove" : "touchmove"}.TsColor`;
    query8(overlay.box).find(".palette, .rainbow, .alpha").off(".TsColor").on(`${mDown}.TsColor`, mouseDown);
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
      query8(overlay.box).find(".color-preview").css("background-color", "#" + newColor);
      query8(overlay.box).find("input").each((el) => {
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
        query8(overlay.box).find(".color-original").css("background-color", "#" + color3);
        query8(overlay.box).find(".tsg-color.tsg-selected").removeClass("tsg-selected");
        query8(overlay.box).find(`.tsg-colors [name="${color3}"], .tsg-colors [name="${initial2}"]`).addClass("tsg-selected");
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
      const el1 = query8(overlay.box).find(".palette .value1");
      const el2 = query8(overlay.box).find(".rainbow .value2");
      const el3 = query8(overlay.box).find(".alpha .value2");
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
      query8(overlay.box).find(".palette").css("background-image", `linear-gradient(90deg, rgba(${rgb2},0) 0%, rgba(${rgb2},1) 100%)`);
    }
    function mouseDown(event) {
      const el = query8(this).find(".value1, .value2");
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
      query8("html").off(".TsColor").on(mMove, mouseMove).on(mUp, mouseUp);
    }
    function mouseUp(_event) {
      query8("html").off(".TsColor");
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
      const name = query8(el.get(0).parentNode).attr("name");
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
      const cnt = query8(event.target).closest(".tsg-colors-custom");
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
        const actions = query8(ret.overlay.box).find(".tsg-eaction");
        if (["INPUT", "TEXTAREA"].includes(overlay.anchor.tagName)) {
          overlay.tmp._new_search = false;
          query8(overlay.anchor).on("input.search-trigger", () => {
            overlay.tmp._new_search = true;
            query8(overlay.anchor).off("input.search-trigger");
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
      query8(overlay.box).find(".tsg-selected").each((el) => {
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
    query8(overlay.box).find(".tsg-menu:not(.tsg-sub-menu)").off(".TsMenu").on("contextmenu.TsMenu", (event) => {
      event.preventDefault();
    }).on(`${mdown}.TsMenu`, { delegate: ".tsg-menu-item" }, (event) => {
      const dt = event.delegate.dataset;
      const parents = query8(event.delegate).closest(".tsg-menu").data("parents");
      this.menuDown(overlay, event, dt.index, parents);
      if (TsUtils.isMobile) {
        event.preventDefault();
      }
    }).on(`${mclick}.TsMenu`, { delegate: ".tsg-menu-item" }, (event) => {
      const dt = event.delegate.dataset;
      const parents = query8(event.delegate).closest(".tsg-menu").data("parents");
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
      const _menu = query8(event.target).closest(".tsg-menu").get(0);
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
      query8(overlay.anchor).off(".TsMenu").on("input.TsMenu", (_event) => {
      }).on("keyup.TsMenu", (event) => {
        event._searchType = "filter";
        this.keyUp(overlay, event);
      });
    }
    if (overlay.options.search) {
      query8(overlay.box).find("#menu-search").off(".TsMenu").on("keyup.TsMenu", (event) => {
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
                    <span class="tsg-icon">${searchIcon({ label: "Search" })}</span>
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
        if (mitem.checked === true) icon = checkIcon();
        else icon = emptyIcon();
      }
      if (mitem.hidden !== true) {
        let txt = mitem.text;
        let icon_dsp = "";
        if (typeof options.render === "function") txt = options.render(mitem, options);
        if (typeof txt == "function") txt = txt(mitem, options);
        if (icon) {
          const first = String(icon).trim().slice(0, 1);
          if (first == "#") {
            icon = `<span class="tsg-icon" style="background-color: ${icon}">${emptyIcon()}</span>`;
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
    const anchor = query8(event.originalEvent.target).get(0);
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
    query8(event.target).addClass("expanded");
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
      query8(event.target).removeClass("expanded");
    });
    setTimeout(() => {
      query8("#w2overlay-" + overlay.name + "-submenu").on("mouseenter", (event2) => {
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
    const view = query8(overlay.box).find(".tsg-overlay-body").get(0);
    const search = query8(overlay.box).find(".tsg-menu-search, .tsg-menu-top").get(0);
    query8(overlay.box).find(".tsg-menu-item.tsg-selected").removeClass("tsg-selected");
    const el = query8(overlay.box).find(`.tsg-menu-item[index="${overlay.selected}"]`).addClass("tsg-selected").get(0);
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
    const anchor = options?.anchor ?? query8(overlay.box).find(`.tsg-menu-item[index="${overlay.selected}"]`).get(0);
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
    query8(overlay.box).find(".tsg-no-items").hide();
    query8(overlay.box).find(".tsg-menu-item, .tsg-menu-divider").each((el) => {
      const cur = this.getCurrent(name, el.getAttribute("index"));
      if (cur.item?.hidden) {
        query8(el).hide();
      } else {
        const search = overlay.tmp?.["search"];
        if (overlay.options.markSearch) {
          TsUtils.marker(el, search, { onlyFirst: overlay.options.match == "begins" });
        }
        query8(el).show();
      }
    });
    query8(overlay.box).find(".tsg-sub-menu").each((sub) => {
      const hasItems = query8(sub).find(".tsg-menu-item").get().some((el) => {
        return el.style.display != "none" ? true : false;
      });
      const parent = this.getCurrent(name, sub.dataset?.parent);
      if (parent.item.expanded) {
        if (!hasItems) {
          query8(sub).parent().hide();
        } else {
          query8(sub).parent().show();
        }
      }
    });
    if (overlay.tmp["searchCount"] == 0 || (overlay.options?.items?.length ?? 0) == 0) {
      if (query8(overlay.box).find(".tsg-no-items").length == 0) {
        query8(overlay.box).find(".tsg-menu:not(.tsg-sub-menu)").append(`
                    <div class="tsg-no-items">
                        ${TsUtils.lang(overlay.options.msgNoItems)}
                    </div>`);
      }
      query8(overlay.box).find(".tsg-no-items").show();
    }
  }
  /**
   * Loops through the items and markes item.hidden = true for those that need to be hidden, and item.hidden = false
   * for those that are visible. Return a promise (since items can be on the server) with the number of visible items.
   */
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  applyFilter(name, items, search, debounce2) {
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
      query8(overlay.box).find(".tsg-no-items").html(msg);
      remote.search = search;
      options.items = [];
      overlay.tmp["remote"] = remote;
      if (proceed) {
        this.request(overlay, search, debounce2).then((remoteItems) => {
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
  request(overlay, search, debounce2) {
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
  menuDown(overlay, event, index, parents) {
    const options = overlay.options;
    let items = options.items;
    const icon = query8(event.delegate).find(".tsg-icon");
    const menu = query8(event.target).closest(".tsg-menu:not(.tsg-sub-menu)");
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
          menu.find(`.tsg-menu-item[index="${(parent ? parent + "-" : "") + ind}"] .tsg-icon`).html(emptyIcon());
          items2[ind].checked = false;
        }
        if (Array.isArray(other.items)) {
          uncheck(other.items, ind);
        }
      });
    };
    if ((options.type === "check" || options.type === "radio") && item.group !== false && !query8(event.target).hasClass("menu-remove") && !query8(event.target).hasClass("menu-help") && !query8(event.target).closest(".tsg-menu-item").hasClass("has-sub-menu")) {
      item.checked = options.type == "radio" ? true : !item.checked;
      if (item.checked) {
        if (options.type === "radio") {
          query8(event.target).closest(".tsg-menu").find(".tsg-icon").html(emptyIcon());
        }
        if (options.type === "check" && item.group != null) {
          uncheck(options.items);
        }
        icon.html(checkIcon());
      } else if (options.type === "check") {
        icon.html(emptyIcon());
      }
    }
    if (!query8(event.target).hasClass("menu-remove") && !query8(event.target).hasClass("menu-help")) {
      menu.find(".tsg-menu-item").removeClass("tsg-selected");
      if (!query8(event.delegate).hasClass("has-sub-menu")) {
        query8(event.delegate).addClass("tsg-selected");
      }
    }
  }
  // any: callback parameter — caller signature varies; TsTooltip overlay options merge from multiple user sources at runtime
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  menuClick(overlay, event, index, parents) {
    const options = overlay.options;
    let items = options.items;
    const $item = query8(event.delegate).closest(".tsg-menu-item");
    let keepOpen = options.hideOn.includes("select") ? false : true;
    if (event.shiftKey || event.metaKey || event.ctrlKey) {
      keepOpen = true;
    }
    if (typeof items == "function") {
      items = items({ overlay, index, parents, event });
    }
    const item = items[index];
    if (!item || item.disabled && !query8(event.target).hasClass("menu-remove")) {
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
    if (query8(event.target).hasClass("menu-remove")) {
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
        event.delegate = query8(overlay.box).find(".tsg-selected").get(0);
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
          event.delegate = query8(overlay.box).find(`.tsg-menu-item[index="${index}"]`).get(0);
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
          event.delegate = query8(overlay.box).find(".tsg-selected").get(0);
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
      query8(overlay.box).find(".tsg-overlay-body").html(cal.html);
      this.initControls(overlay);
    };
    const checkJump = (event, dblclick) => {
      query8(event.target).parent().find(".tsg-jump-month, .tsg-jump-year").removeClass("tsg-selected");
      query8(event.target).addClass("tsg-selected");
      const dt = /* @__PURE__ */ new Date();
      let { jumpMonth, jumpYear } = overlay.tmp;
      if (dblclick) {
        if (jumpYear == null) jumpYear = dt.getFullYear();
        if (jumpMonth == null) jumpMonth = dt.getMonth() + 1;
      }
      if (jumpMonth && jumpYear) {
        const cal = this.getMonthHTML(options, jumpMonth, jumpYear);
        Object.assign(overlay.tmp, cal);
        query8(overlay.box).find(".tsg-overlay-body").html(cal.html);
        overlay.tmp.jump = false;
        this.initControls(overlay);
      }
    };
    query8(overlay.box).find(".tsg-cal-title").off(".calendar").on("click.calendar", (event) => {
      if (options.draggable && overlay.tmp?.moved) {
        event.stopPropagation();
        return;
      }
      Object.assign(overlay.tmp, { jumpYear: null, jumpMonth: null });
      if (overlay.tmp.jump) {
        const { month, year } = overlay.tmp;
        const cal = this.getMonthHTML(options, month, year);
        query8(overlay.box).find(".tsg-overlay-body").html(cal.html);
        overlay.tmp.jump = false;
      } else {
        query8(overlay.box).find(".tsg-overlay-body .tsg-cal-days").replace(this.getYearHTML());
        const el = query8(overlay.box).find(`[name="${overlay.tmp.year}"]`).get(0);
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
    query8(overlay.box).find(".tsg-cal-now").off(".calendar").on("click.calendar", (_event) => {
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
    query8(overlay.box).off(".calendar").on("contextmenu.calendar", (event) => {
      event.preventDefault();
    }).on("click.calendar", { delegate: ".tsg-day.tsg-date" }, (event) => {
      if (options.type == "datetime") {
        overlay.newDate = query8(event.target).attr("date");
        query8(overlay.box).find(".tsg-overlay-body").html(this.getHourHTML(overlay.options).html);
        this.initControls(overlay);
      } else {
        overlay.newValue = query8(event.target).attr("date");
        this.hide(overlay.name);
      }
    }).on("click.calendar", { delegate: ".tsg-jump-month" }, (event) => {
      overlay.tmp.jumpMonth = parseInt(query8(event.target).attr("name") ?? "0");
      checkJump(event);
    }).on("dblclick.calendar", { delegate: ".tsg-jump-month" }, (event) => {
      overlay.tmp.jumpMonth = parseInt(query8(event.target).attr("name") ?? "0");
      checkJump(event, true);
    }).on("click.calendar", { delegate: ".tsg-jump-year" }, (event) => {
      overlay.tmp.jumpYear = parseInt(query8(event.target).attr("name") ?? "0");
      checkJump(event);
    }).on("dblclick.calendar", { delegate: ".tsg-jump-year" }, (event) => {
      overlay.tmp.jumpYear = parseInt(query8(event.target).attr("name") ?? "0");
      checkJump(event, true);
    }).on("click.calendar", { delegate: ".tsg-time.hour" }, (event) => {
      const hour = Number(query8(event.target).attr("hour"));
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
        query8(overlay.box).find(".tsg-overlay-body").html(html);
        this.initControls(overlay);
      }
    }).on("click.calendar", { delegate: ".tsg-time.min" }, (event) => {
      const hour = Math.floor((this.str2min(overlay.newValue) ?? 0) / 60);
      const time = hour * 60 + parseInt(query8(event.target).attr("min"));
      overlay.newValue = this.min2str(time, options.format);
      this.hide(overlay.name);
    });
    TsUtils.bindEvents(query8(overlay.box).find(".tsg-eaction"), this);
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
          const st = typeof options.start === "string" ? options.start : query8(options.start).val();
          const en = typeof options.end === "string" ? options.end : query8(options.end).val();
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

// src/tssidebar.ts
var query9 = query;
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
    if (typeof this.box == "string") this.box = query9(this.box).get(0);
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
    const btn = query9(this.box).find(`#node_${TsUtils.escapeId(id)} .tsg-node-badge`);
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
    const $el = query9(this.box).find("#node_" + TsUtils.escapeId(id));
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
    query9(this.box).find("#node_" + TsUtils.escapeId(id)).removeClass("tsg-selected").find(".tsg-icon").removeClass("tsg-icon-selected");
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
    query9(this.box).find("#node_" + TsUtils.escapeId(id) + "_sub").hide();
    query9(this.box).find("#node_" + TsUtils.escapeId(id) + " .tsg-expanded").removeClass("tsg-expanded").addClass("tsg-collapsed");
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
    query9(this.box).find("#node_" + TsUtils.escapeId(id) + "_sub").show();
    query9(this.box).find("#node_" + TsUtils.escapeId(id) + " .tsg-collapsed").removeClass("tsg-collapsed").addClass("tsg-expanded");
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
  click(id, event) {
    const nd = this.get(id);
    if (nd == null) return;
    if (nd.disabled || nd.group) {
      const edata = this.trigger("click", { target: id, originalEvent: event, node: nd, object: nd });
      edata.finish();
      return;
    }
    const newNode = query9(this.box).find("#node_" + TsUtils.escapeId(id));
    newNode.addClass("tsg-selected").find(".tsg-icon").addClass("tsg-icon-selected");
    setTimeout(() => {
      const edata = this.trigger("click", { target: id, originalEvent: event, node: nd, object: nd });
      if (edata.isCancelled === true) {
        newNode.removeClass("tsg-selected").find(".tsg-icon").removeClass("tsg-icon-selected");
        return;
      }
      if (this.multi) {
        const mev = event;
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
    const $el = query9(el).find(".tsg-node-data");
    TsMenu.show({
      // any: query().get(0) returns Node|Node[]; anchor is always HTMLElement in flat menu context
      anchor: $el.get(0),
      name: this.name + "_flat-menu",
      items,
      // class: 'tsg-dark',
      position: "right|left",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSelect(event) {
        self.unselect();
        self.click(event.detail.item.id, event.detail.originalEvent);
      },
      onHide(_event) {
        self.unselect();
      }
    });
    TsTooltip.hide(this.name + "_tooltip");
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  focus(event) {
    const edata = this.trigger("focus", { target: this.name, originalEvent: event });
    if (edata.isCancelled === true) return false;
    this.hasFocus = true;
    query9(this.box).find(".tsg-sidebar-body").addClass("tsg-focus");
    setTimeout(() => {
      const input = query9(this.box).find("#sidebar_" + this.name + "_focus").get(0);
      if (document.activeElement != input) input.focus();
    }, 10);
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  blur(event) {
    const edata = this.trigger("blur", { target: this.name, originalEvent: event });
    if (edata.isCancelled === true) return false;
    this.hasFocus = false;
    query9(this.box).find(".tsg-sidebar-body").removeClass("tsg-focus");
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
  keydown(event) {
    const self = this;
    const first = Array.isArray(this.selected) ? this.selected[0] : this.selected;
    let nd = this.get(first);
    if (this.keyboard !== true) return;
    if (!nd) nd = this.nodes[0] ?? null;
    if (event.keyCode == 27) {
      const mv = this.last.move;
      if (mv?.reorder && mv?.moved) {
        mv.restore();
        return;
      }
    }
    const edata = this.trigger("keydown", { target: this.name, originalEvent: event });
    if (edata.isCancelled === true) return;
    if (event.keyCode == 13 || event.keyCode == 32) {
      if (event.keyCode == 13 && this.editable && !event.ctrlKey && !event.metaKey) {
        this.edit(first);
      } else {
        if (nd.nodes.length > 0) {
          this.toggle(first);
        }
      }
    }
    if (event.keyCode == 37) {
      if (nd.nodes.length > 0 && nd.expanded) {
        this.collapse(first);
      } else {
        selectNode(nd.parent);
        if (!nd.parent.group) this.collapse(nd.parent.id);
      }
    }
    if (event.keyCode == 39) {
      if ((nd.nodes.length > 0 || nd.plus) && !nd.expanded) this.expand(first);
    }
    if (event.keyCode == 38) {
      if (this.get(first) == null) {
        selectNode(this.nodes[0] || null);
      } else {
        selectNode(neighbor(nd, this.prev));
      }
    }
    if (event.keyCode == 40) {
      if (this.get(first) == null) {
        selectNode(this.nodes[0] || null);
      } else {
        selectNode(neighbor(nd, this.next));
      }
    }
    if ([13, 32, 37, 38, 39, 40].includes(event.keyCode)) {
      if (event.preventDefault) event.preventDefault();
      if (event.stopPropagation) event.stopPropagation();
    }
    edata.finish();
    function selectNode(node, event2) {
      if (node != null && !node.hidden && !node.disabled && !node.group) {
        self.click(node.id, event2);
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
    const item = query9(this.box).find("#node_" + TsUtils.escapeId(id)).get(0);
    if (!item) {
      return false;
    }
    const div = query9(this.box).find(".tsg-sidebar-body").get(0);
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
      const item = query9(this.box).find("#node_" + TsUtils.escapeId(id)).get(0);
      if (item) item.scrollIntoView({ block: "center", inline: "center", behavior: instant ? "auto" : "smooth" });
      setTimeout(() => {
        this.resize();
        resolve();
      }, instant ? 0 : 500);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dblClick(id, event) {
    const nd = this.get(id);
    const edata = this.trigger("dblClick", { target: id, originalEvent: event, object: nd });
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
  mouseDown(id, event) {
    const self = this;
    if (this.reorder) {
      this.last.move = {
        x: event.screenX,
        y: event.screenY,
        divX: 0,
        divY: 0,
        reorder: true,
        moved: false
      };
      const mv = this.last.move;
      const body = query9(this.box).find(".tsg-sidebar-body");
      if (!mv.ghost) {
        const node = query9(this.box).find(`#node_${TsUtils.escapeId(id)}`);
        mv.offsetY = event.offsetY;
        mv.target = id;
        const nodeEl = node.get(0);
        mv.pos = { top: nodeEl.offsetTop - 1, left: nodeEl.offsetLeft };
        const clone2 = query9(node.find(".tsg-node-data").get(0).cloneNode(true));
        mv.node = node;
        mv.nodeSub = node.next();
        body.append('<div id="sidebar_' + this.name + '_ghost" class="tsg-node tsg-ghost"></div>');
        query9(this.box).find("#sidebar_" + this.name + "_ghost").append(clone2);
        mv.ghost = query9(this.box).find("#sidebar_" + this.name + "_ghost");
        mv.ghost.css({ display: "none" });
        mv.restore = () => {
          mv.resetReorder();
          this.refresh();
        };
        mv.resetReorder = () => {
          this.last.move = null;
          query9(this.box).find(`#sidebar_${this.name}_ghost`).remove();
          query9(document).off(`.tsg-${this.name}-reorder`);
        };
      }
      query9(document).on(`mousemove.tsg-${this.name}-reorder`, _mouseMove).on(`mouseup.tsg-${this.name}-reorder`, _mouseStop);
    }
    function _mouseMove(event2) {
      if (!event2.target.tagName) {
        return;
      }
      const mv = self.last.move;
      mv.divX = event2.screenX - mv.x;
      mv.divY = event2.screenY - mv.y;
      if (Math.abs(mv.divX) <= 1 && Math.abs(mv.divY) <= 1) return;
      if (self.reorder == true && mv.reorder && !mv.moved) {
        const edata = self.trigger("dragStart", { target: mv.target, moved: true, node: self.get(mv.target), mv, originalEvent: event2 });
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
      const over = query9(event2.target).closest(".tsg-node, .tsg-node-group");
      const id2 = over.attr("data-id");
      if (query9(event2.target).hasClass("tsg-sidebar-body") && event2.layerY > 5 && !mv.append) {
        const edata = self.trigger("dragOver", { target: mv.target, append: true, mv, originalEvent: event2 });
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
        const edata = self.trigger("dragOver", { target: mv.target, moveBefore: id2, mv, originalEvent: event2 });
        if (edata.isCancelled === true) {
          return;
        }
        const el = query9(self.box).find(`#node_${TsUtils.escapeId(id2)}`);
        el.before(mv.node);
        el.before(mv.nodeSub);
        edata.finish();
      }
    }
    function _mouseStop(event2) {
      const mv = self.last.move;
      mv.resetReorder();
      if (mv.moved) {
        if (mv.moveBefore != null && mv.target != mv.moveBefore || mv.append) {
          const edata = self.trigger("reorder", { target: mv.target, moveBefore: mv.moveBefore, append: mv.append, originalEvent: event2 });
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
    const node = query9(this.box).find("#node_" + TsUtils.escapeId(id));
    const text = node.find(".tsg-node-text");
    const edata = this.trigger("edit", { target: id, el: node, textEl: text });
    if (edata.isCancelled === true) {
      return;
    }
    this.last.renaming = true;
    node.addClass("tsg-editing");
    text.addClass("tsg-focus").css("pointer-events", "all").attr("contenteditable", TsUtils.isFirefox ? "true" : "plaintext-only").on("blur.node-editing", (_event) => {
      setTimeout(_rename, 0);
    }).on("keydown.node-editing", (event) => {
      const kbdEvent = event;
      if (kbdEvent.keyCode == 13) _rename(kbdEvent);
      if (kbdEvent.keyCode == 27) _rename(kbdEvent, true);
    });
    text.get(0).focus();
    const original = text.text();
    TsUtils.setCursorPosition(text[0], 0, text.text().length);
    edata.finish();
    return text.get(0);
    function _rename(event, cancel) {
      const renameTo = text.text();
      node.removeClass("tsg-editing");
      text.removeClass("tsg-focus").css("pointer-events", "none").removeAttr("contenteditable").off(".node-editing");
      if (!cancel && self.last.renaming && original !== renameTo) {
        const edata2 = self.trigger("rename", { target: id, text_previous: original, text_new: renameTo, originalEvent: event });
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
  contextMenu(id, event) {
    const nd = this.get(id);
    if (Array.isArray(this.selected)) {
      if (!this.selected.includes(id)) this.click(id);
    } else {
      if (id != this.selected) this.click(id);
    }
    const edata = this.trigger("contextMenu", { target: id, originalEvent: event, object: nd, allowOnDisabled: false });
    if (edata.isCancelled === true) return;
    if (nd.disabled && !edata.detail["allowOnDisabled"]) return;
    if (this["menu"].length > 0) {
      TsMenu.hide(this.name + "_menu");
      const menuAttach = TsMenu.show({
        name: this.name + "_menu",
        anchor: document.body,
        contextMenu: true,
        items: this["menu"],
        originalEvent: event
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      });
      menuAttach?.select?.((evt) => {
        this.menuClick(id, evt.detail);
      });
    }
    if (event.preventDefault) event.preventDefault();
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
    if (typeof box == "string") box = query9(box).get(0);
    const edata = this.trigger("render", { target: this.name, box: box ?? this.box });
    if (edata.isCancelled === true) return;
    if (box != null) {
      this.unmount();
      this.box = box;
    }
    if (!this.box) return;
    query9(this.box).attr("name", this.name).addClass("tsg-reset tsg-sidebar").html(`<div>
                <div class="tsg-sidebar-top"></div>
                <input id="sidebar_${this.name}_focus" ${this.tabIndex ? 'tabindex="' + this.tabIndex + '"' : ""}
                    style="position: absolute; top: 0; right: 1px; width: 1px; z-index: -1; opacity: 0"
                    ${TsUtils.isMobile ? "readonly" : ""}/>
                <div class="tsg-sidebar-body"></div>
                <div class="tsg-sidebar-bottom"></div>
            </div>`);
    const boxEl3 = query9(this.box).get(0);
    const rect = boxEl3.getBoundingClientRect();
    query9(this.box).find(":scope > div").css({
      width: rect.width + "px",
      height: rect.height + "px"
    });
    boxEl3.style.cssText += this.style;
    let kbd_timer;
    query9(this.box).find("#sidebar_" + this.name + "_focus").on("focus", function(event) {
      clearTimeout(kbd_timer);
      if (!obj.hasFocus) obj.focus(event);
    }).on("blur", function(event) {
      kbd_timer = setTimeout(() => {
        if (obj.hasFocus) {
          obj.blur(event);
        }
      }, 100);
    }).on("keydown", function(event) {
      const w2obj = TsUi[obj.name];
      w2obj?.keydown?.call(w2obj, event);
    });
    query9(this.box).off("mousedown").on("mousedown", function(event) {
      setTimeout(() => {
        if (["INPUT", "TEXTAREA", "SELECT"].indexOf(event.target?.tagName?.toUpperCase()) == -1) {
          const $input = query9(obj.box).find("#sidebar_" + obj.name + "_focus");
          const inputEl = $input.get(0);
          if (document.activeElement != inputEl && $input.length > 0) {
            inputEl?.focus();
          }
        }
      }, 1);
    });
    const flatHTML = `<div class="tsg-flat tsg-flat-${this.flat ? "right" : "left"}" ${this.flatButton == false ? 'style="display: none"' : ""}></div>`;
    if (this["topHTML"] !== "" || flatHTML !== "") {
      query9(this.box).find(".tsg-sidebar-top").html(this["topHTML"] + flatHTML);
      query9(this.box).find(".tsg-sidebar-body").css("top", query9(this.box).find(".tsg-sidebar-top").get(0)?.clientHeight + "px");
      query9(this.box).find(".tsg-flat").off("click").on("click", (_event) => {
        this.goFlat();
      });
    }
    if (this["bottomHTML"] !== "") {
      query9(this.box).find(".tsg-sidebar-bottom").html(this["bottomHTML"]);
      query9(this.box).find(".tsg-sidebar-body").css("bottom", query9(this.box).find(".tsg-sidebar-bottom").get(0)?.clientHeight + "px");
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
      const $el = query9(this.box).find("#node_" + TsUtils.escapeId(nd.id));
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
    const body = query9(this.box).find(":scope > div > .tsg-sidebar-body").get(0);
    const { scrollTop, scrollLeft } = body ?? {};
    const time = Date.now();
    const edata = this.trigger("refresh", {
      target: id != null ? id : this.name,
      nodeId: id != null ? id : null,
      fullRefresh: id != null ? false : true
    });
    if (edata.isCancelled === true) return;
    if (this.flatButton == true) {
      query9(this.box).find(".tsg-sidebar-top .tsg-flat").show().removeClass("tsg-flat-left tsg-flat-right").addClass(` tsg-flat-${this.flat ? "right" : "left"}`);
    } else {
      query9(this.box).find(".tsg-sidebar-top .tsg-flat").hide();
    }
    const boxEl2 = query9(this.box).get(0);
    query9(this.box).find(":scope > div").removeClass("tsg-sidebar-flat").addClass(this.flat ? "tsg-sidebar-flat" : "").css({
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
      query9(this.box).find(nodeId).before('<div id="sidebar_' + this.name + '_tmp"></div>');
      query9(this.box).find(nodeId).remove();
      query9(this.box).find(nodeSubId).remove();
      query9(this.box).find("#sidebar_" + this.name + "_tmp").before(nodeHTML);
      query9(this.box).find("#sidebar_" + this.name + "_tmp").remove();
    }
    const div = query9(this.box).find(":scope > div").get(0);
    const scroll = {
      top: div?.scrollTop,
      left: div?.scrollLeft
    };
    const cnt = node == this ? query9(this.box).find(":scope > div > .tsg-sidebar-body") : query9(body).find(nodeSubId);
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
      const els = query9(this.box).find(`${nodeId}, ${nodeId} .tsg-eaction, ${nodeSubId} .tsg-eaction`);
      TsUtils.bindEvents(els, this);
      query9(body).prop({ scrollLeft, scrollTop });
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
        let expand = "";
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
          expand = `<div class="${toggleClasses.join(" ")}" data-click="toggle|${nd.id}"><span></span></div>`;
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
                            ${expand} ${image} ${counts}
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
  mouseAction(action, anchor, nodeId, event, type) {
    let edata;
    const node = this.get(nodeId);
    if (type == null) {
      edata = this.trigger("mouse" + action, { target: node.id, node, originalEvent: event });
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
          onClick.call(this, node, event);
        }
      } else {
        let tooltip = this["handle"].tooltip;
        if (typeof tooltip == "function") {
          tooltip = tooltip.call(this, node, event);
        }
        if (action == "Leave") tooltip = "";
        this.otherTooltip(anchor, tooltip);
      }
    }
    if (type == "icon") {
      if (action == "click") {
        const onClick = this.icon.onClick;
        if (typeof onClick == "function") {
          onClick.call(this, node, event);
        }
      } else {
        let tooltip = this.icon.tooltip;
        if (typeof tooltip == "function") {
          tooltip = tooltip.call(this, node, event);
        }
        if (action == "Leave") tooltip = "";
        this.otherTooltip(anchor, tooltip);
      }
    }
    if (type == "badge") {
      if (action == "click") {
        const onClick = this["badge"]?.onClick;
        if (typeof onClick == "function") {
          onClick.call(this, node, event);
        }
      } else {
        let tooltip = this["badge"]?.tooltip;
        if (typeof tooltip == "function") {
          tooltip = tooltip.call(this, node, event);
        }
        if (action == "Leave") tooltip = "";
        this.otherTooltip(anchor, tooltip);
      }
    }
    edata?.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip(el, text) {
    const $el = query9(el).find(".tsg-node-data");
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
    query9(el).find("span:nth-child(1)").css("color", color);
  }
  resize() {
    const time = Date.now();
    const edata = this.trigger("resize", { target: this.name });
    if (edata.isCancelled === true) return;
    if (this.box != null) {
      const boxEl = query9(this.box).get(0);
      const rect = boxEl.getBoundingClientRect();
      query9(this.box).css("overflow", "hidden");
      query9(this.box).find(":scope > div").css({
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
    if (query9(this.box).find(".tsg-sidebar-body").length > 0) {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TsSidebar
});
/*
 * @author     Lauri Rooden (https://github.com/litejs/natural-compare-lite)
 * @license    MIT License
 */
//# sourceMappingURL=sidebar.js.map