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
function toSafeEvent(event) {
  if (typeof event !== "object" || event === null) {
    return { type: null, phase: "before", detail: {}, isStopped: false, isCancelled: false };
  }
  const ev = event;
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

export {
  isBin,
  isInt,
  isFloat,
  isMoney,
  isHex,
  isAlphaNumeric,
  isEmail,
  isIpAddress,
  isPlainObject,
  clone,
  extend,
  naturalCompare,
  getNested,
  normMenu,
  encodeParams,
  prepareParams,
  parseRoute,
  debounce,
  wait,
  TsUi,
  checkName,
  query,
  TsEvent,
  toSafeEvent,
  TsBase
};
/*
 * @author     Lauri Rooden (https://github.com/litejs/natural-compare-lite)
 * @license    MIT License
 */
//# sourceMappingURL=chunk-W7JZO7EX.js.map