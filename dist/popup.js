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

// src/tspopup.ts
var tspopup_exports = {};
__export(tspopup_exports, {
  TsAlert: () => TsAlert,
  TsConfirm: () => TsConfirm,
  TsDialog: () => TsDialog,
  TsPopup: () => TsPopup,
  TsPrompt: () => TsPrompt,
  __test_internals: () => __test_internals
});
module.exports = __toCommonJS(tspopup_exports);

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
    if (name instanceof Event) {
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
    if (this.box instanceof HTMLElement) {
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
var BOX_PATHS = '<path d="M462.286,14.25 C453.333,5.298 442.571,0.822 430,0.822 L46,0.822 C33.429,0.822 22.667,5.298 13.716,14.25 C4.764,23.202 0.287,33.964 0.287,46.535 L0.287,393.963 C0.287,406.535 4.764,417.297 13.716,426.249 C22.667,435.201 33.429,439.677 46,439.677 L430,439.677 C442.572,439.677 453.334,435.202 462.286,426.249 C471.238,417.296 475.714,406.534 475.714,393.963 L475.714,46.535 C475.714,33.964 471.239,23.202 462.286,14.25 Z M440.501,405.25 L35.501,405.25 L35.501,40.25 L440.501,40.25 L440.501,405.25 Z"/>';
var CROSS_PATHS = '<path d="M567.006313,46.872 C572.393313,52.259 575.086312,58.725 575.086312,66.266 C575.086312,73.809 572.393313,80.273 567.006313,85.66 L355.725,281.714 L558.926313,473.71775 C564.313313,479.10675 567.006313,485.57175 567.006313,493.11375 C567.006313,500.65575 564.313313,507.12175 558.926313,512.50875 L520.135312,551.29875 C514.748313,556.68675 508.283313,559.38075 500.740312,559.38075 C493.197313,559.38075 486.732312,556.68675 481.345312,551.29875 L283.144,360.294 L85.66,551.29875 C80.273,556.68575 73.809,559.38075 66.265,559.38075 C58.724,559.38075 52.259,556.68575 46.871,551.29875 L8.081,512.50975 C2.694,507.12075 -0.00200027819,500.65575 -0.00200027819,493.11375 C-0.00200027819,485.57075 2.693,479.10575 8.081,473.71775 L210.564,282.714 L8.079,87.661 C2.691,82.274 -0.00200027819,75.809 -0.00200027819,68.267 C-0.00200027819,60.725 2.692,54.26 8.079,48.872 L46.869,10.082 C52.257,4.695 58.722,1.99999917 66.265,1.99999917 C73.806,1.99999917 80.271,4.693 85.659,10.081 L283.144,210.134 L489.425313,8.08 C494.812313,2.693 501.277313,0 508.820313,0 C516.363313,0 522.828313,2.694 528.215313,8.082 L567.006313,46.872 Z"/>';
var boxIcon = (opts) => _renderSvg("-30 -30 540 482", BOX_PATHS, opts);
var crossIcon = (opts) => _renderSvg("-80 -80 700 700", CROSS_PATHS, opts);

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
      query8(document.body).off(".TsPopup").on("keydown.TsPopup", (event) => {
        this.keydown(event);
      });
    }
    query8(window).on("resize", this.handleResize);
    const tmp = {
      changing: false,
      mvMove,
      mvStop
    };
    query8("#tsg-popup .tsg-popup-title").off("mousedown").on("mousedown", function(event) {
      if (!self.options.maximized) mvStart(event);
    });
    if (options.resizable) {
      query8("#tsg-popup .tsg-popup-resizer").show();
      query8("#tsg-popup .tsg-popup-resizer").off("mousedown").on("mousedown", (event) => {
        mvStart(event, true);
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
  setFocus(focus) {
    const box = query8("#tsg-popup");
    const sel = "input, button, select, textarea, [contentEditable], [tabindex], .tsg-input";
    if (focus != null) {
      const el = isNaN(focus) ? box.find(sel).filter(focus).filter(":not([name=hidden-first])").get(0) : box.find(sel).filter(":not([name=hidden-first])").get(focus);
      el?.focus();
    } else {
      const el = box.find("[name=hidden-first]").get(0);
      if (el) el.focus();
    }
    query8(box).find(sel).off(".keep-focus").on("blur.keep-focus", function(_event) {
      setTimeout(() => {
        const focus2 = document.activeElement;
        const inside = query8(box).find(sel).filter(focus2).length > 0;
        const name = query8(focus2).attr("name");
        if (!inside && focus2 && focus2 !== document.body) {
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
  if (query8("#tsg-popup").length > 0 && TsPopup.status != "closing") {
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
  prom.self.off(".prompt").on("open:after.prompt", (event) => {
    const box = event.detail.box ? event.detail.box : query8("#tsg-popup .tsg-popup-body").get(0);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TsAlert,
  TsConfirm,
  TsDialog,
  TsPopup,
  TsPrompt,
  __test_internals
});
/*
 * @author     Lauri Rooden (https://github.com/litejs/natural-compare-lite)
 * @license    MIT License
 */
//# sourceMappingURL=popup.js.map