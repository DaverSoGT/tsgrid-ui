import {
  TsLocale
} from "./chunk-IYF3Q7GX.js";
import {
  TsBase,
  checkName,
  clone,
  debounce,
  encodeParams,
  extend,
  getNested,
  isAlphaNumeric,
  isBin,
  isEmail,
  isFloat,
  isHex,
  isInt,
  isIpAddress,
  isMoney,
  isPlainObject,
  naturalCompare,
  normMenu,
  parseRoute,
  prepareParams,
  query,
  wait
} from "./chunk-W7JZO7EX.js";

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
        query3(where).find("#tsg-notify .tsg-notify-link").on("click", (event) => {
          const value = query3(event.target).attr("value") ?? "";
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

// src/tsutils-message.ts
var query4 = query;
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
    const msgs = query4(where?.box).find(".tsg-message");
    if (msgs.length == 0) return;
    msgBase = msgs.get(0)["_msg_options"] || {};
    if (typeof msgBase?.close == "function") {
      msgBase.close();
    }
  };
  const closeComplete = (options2) => {
    const msgBoxEl = options2["box"];
    const focus = msgBoxEl?.["_msg_prevFocus"];
    if (query4(where.box).find(".tsg-message").length <= 1) {
      if (where.owner) {
        where.owner.unlock?.(where.param, 150);
      } else {
        deps.unlock(where.box, 150);
      }
    } else {
      query4(where.box).find(`#tsg-message-${where.owner?.name}-${options2["msgIndex"] - 1}`).css("z-index", "1500");
    }
    if (focus) {
      const msg = query4(focus).closest(".tsg-message");
      if (msg.length > 0) {
        const opt = msg.get(0)["_msg_options"];
        opt["setFocus"](focus);
      } else {
        focus.focus();
      }
    } else {
      if (typeof where.owner?.focus == "function") where.owner.focus();
    }
    query4(options2["box"]).remove();
    if (options2["msgIndex"] === 0) {
      const tmp = options2["tmp"];
      head.css("z-index", tmp.zIndex);
      query4(where.box).css("overflow", tmp.overflow);
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
    deps.bindEvents(query4(msgOpts["box"]).find(".tsg-eaction"), msgOpts);
    const detail = event["detail"];
    query4(detail["box"]).find("button, input, textarea, [name=hidden-first]").off(".message").on("keydown.message", function(evt) {
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
  let styles = getComputedStyle(query4(where.box).get(0));
  const pWidth = parseFloat(styles.width);
  const pHeight = parseFloat(styles.height);
  let titleHeight = 0;
  if (query4(where.after).length > 0) {
    styles = getComputedStyle(query4(where.after).get(0));
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
  const head = query4(where.box).find(where.after);
  if (!msgBase.tmp) {
    msgBase.tmp = {
      zIndex: String(head.css("z-index")),
      overflow: styles.overflow
    };
  }
  if (msgBase.html === "" && msgBase.body === "" && msgBase.buttons === "") {
    removeLast();
  } else {
    msgBase.msgIndex = query4(where.box).find(".tsg-message").length;
    if (msgBase.msgIndex === 0 && typeof deps.lock == "function") {
      query4(where.box).css("overflow", "hidden");
      if (where.owner) {
        ;
        where.owner.lock?.(where.param);
      } else {
        deps.lock(where.box);
      }
    }
    query4(where.box).find(".tsg-message").css("z-index", "1390");
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
    if (query4(where.after).length > 0) {
      query4(where.box).find(where.after).after(content);
    } else {
      query4(where.box).prepend(content);
    }
    msgBase.box = query4(where.box).find(`#tsg-message-${where.owner?.name}-${msgBase.msgIndex}`)[0];
    deps.bindEvents(msgBase.box, deps.self);
    query4(msgBase.box).addClass("animating");
    msgBase.box["_msg_options"] = msgBase;
    msgBase.box["_msg_prevFocus"] = document.activeElement;
    setTimeout(() => {
      edata = msgOpts["trigger"]("open", { target: deps.ownerName, box: msgBase.box, self: msgBase });
      const edataR = edata;
      if (edataR["isCancelled"] === true) {
        query4(where.box).find(`#tsg-message-${where.owner?.name}-${msgBase.msgIndex}`).remove();
        if (msgBase.msgIndex === 0) {
          head.css("z-index", msgBase.tmp.zIndex);
          query4(where.box).css("overflow", msgBase.tmp.overflow);
        }
        return;
      }
      query4(msgBase.box).css({
        transition: "0.3s",
        transform: "translateY(0px)"
      });
    }, 0);
    openTimer = setTimeout(() => {
      query4(where.box).find(`#tsg-message-${where.owner?.name}-${msgBase.msgIndex}`).removeClass("animating").css({ "transition": "0s" });
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
    if (query4(msgBase.box).hasClass("animating")) {
      clearTimeout(closeTimer);
      closeComplete(msgOpts);
      return;
    }
    query4(msgBase.box).addClass("tsg-closing animating").css({
      "transition": "0.15s",
      "transform": "translateY(-" + msgBase.height + "px)"
    });
    if ((msgBase.msgIndex ?? 0) !== 0) {
      query4(where.box).find(`#tsg-message-${where.owner?.name}-${(msgBase.msgIndex ?? 1) - 1}`).css("z-index", "1499");
    }
    closeTimer = setTimeout(() => {
      closeComplete(msgOpts);
    }, 150);
  };
  msgBase.setFocus = (focus) => {
    const cnt = query4(where.box).find(".tsg-message").length - 1;
    const box = query4(where.box).find(`#tsg-message-${where.owner?.name}-${cnt}`);
    const sel = "input, button, select, textarea, [contentEditable], .tsg-input";
    if (focus != null) {
      const el = typeof focus === "string" ? box.find(sel).filter(focus).get(0) : box.find(sel).get(focus);
      el?.focus();
    } else {
      box.find("[name=hidden-first]").get(0)?.focus();
    }
    query4(where.box).find(".tsg-message").find(sel + ",[name=hidden-first],[name=hidden-last]").off(".keep-focus");
    query4(box).find(sel + ",[name=hidden-first],[name=hidden-last]").on("blur.keep-focus", function(_event) {
      setTimeout(() => {
        const focus2 = document.activeElement;
        const inside = focus2 != null && query4(box).find(sel).filter(focus2).length > 0;
        const name = query4(focus2).attr("name");
        if (!inside && focus2 && focus2 !== document.body) {
          query4(box).find(sel).get(0)?.focus();
        }
        if (name == "hidden-last") {
          query4(box).find(sel).get(0)?.focus();
        }
        if (name == "hidden-first") {
          query4(box).find(sel).get(-1)?.focus();
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
      (d?.["self"])["input"] = query4(d?.["box"]).find("#TsPrompt").get(0);
      query4(d?.["box"]).find("#TsPrompt").on("keydown", (evt) => {
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
var query5 = query;
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
        query5(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: translate3d(0, 0, 0)";
          divOld.style.cssText += "transition: " + time + "s; transform: translate3d(-" + width + "px, 0, 0)";
        }, 1);
        break;
      case "slide-right":
        divOld.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)";
        divNew.style.cssText += "overflow: hidden; transform: translate3d(-" + width + "px, 0, 0)";
        query5(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: translate3d(0px, 0, 0)";
          divOld.style.cssText += "transition: " + time + "s; transform: translate3d(" + width + "px, 0, 0)";
        }, 1);
        break;
      case "slide-down":
        divOld.style.cssText += "overflow: hidden; z-index: 1; transform: translate3d(0, 0, 0)";
        divNew.style.cssText += "overflow: hidden; z-index: 0; transform: translate3d(0, 0, 0)";
        query5(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: translate3d(0, 0, 0)";
          divOld.style.cssText += "transition: " + time + "s; transform: translate3d(0, " + height + "px, 0)";
        }, 1);
        break;
      case "slide-up":
        divOld.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)";
        divNew.style.cssText += "overflow: hidden; transform: translate3d(0, " + height + "px, 0)";
        query5(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: translate3d(0, 0, 0)";
          divOld.style.cssText += "transition: " + time + "s; transform: translate3d(0, 0, 0)";
        }, 1);
        break;
      case "flip-left":
        divOld.style.cssText += "overflow: hidden; transform: rotateY(0deg)";
        divNew.style.cssText += "overflow: hidden; transform: rotateY(-180deg)";
        query5(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: rotateY(0deg)";
          divOld.style.cssText += "transition: " + time + "s; transform: rotateY(180deg)";
        }, 1);
        break;
      case "flip-right":
        divOld.style.cssText += "overflow: hidden; transform: rotateY(0deg)";
        divNew.style.cssText += "overflow: hidden; transform: rotateY(180deg)";
        query5(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: rotateY(0deg)";
          divOld.style.cssText += "transition: " + time + "s; transform: rotateY(-180deg)";
        }, 1);
        break;
      case "flip-down":
        divOld.style.cssText += "overflow: hidden; transform: rotateX(0deg)";
        divNew.style.cssText += "overflow: hidden; transform: rotateX(180deg)";
        query5(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: rotateX(0deg)";
          divOld.style.cssText += "transition: " + time + "s; transform: rotateX(-180deg)";
        }, 1);
        break;
      case "flip-up":
        divOld.style.cssText += "overflow: hidden; transform: rotateX(0deg)";
        divNew.style.cssText += "overflow: hidden; transform: rotateX(-180deg)";
        query5(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: rotateX(0deg)";
          divOld.style.cssText += "transition: " + time + "s; transform: rotateX(180deg)";
        }, 1);
        break;
      case "pop-in":
        divOld.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)";
        divNew.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(.8); opacity: 0;";
        query5(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; transform: scale(1); opacity: 1;";
          divOld.style.cssText += "transition: " + time + "s;";
        }, 1);
        break;
      case "pop-out":
        divOld.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); transform: scale(1); opacity: 1;";
        divNew.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0); opacity: 0;";
        query5(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; opacity: 1;";
          divOld.style.cssText += "transition: " + time + "s; transform: scale(1.7); opacity: 0;";
        }, 1);
        break;
      default:
        divOld.style.cssText += "overflow: hidden; transform: translate3d(0, 0, 0)";
        divNew.style.cssText += "overflow: hidden; translate3d(0, 0, 0); opacity: 0;";
        query5(divNew).show();
        setTimeout(() => {
          divNew.style.cssText += "transition: " + time + "s; opacity: 1;";
          divOld.style.cssText += "transition: " + time + "s";
        }, 1);
        break;
    }
    setTimeout(() => {
      if (type === "slide-down") {
        query5(divOld).css("z-index", "1019");
        query5(divNew).css("z-index", "1020");
      }
      if (divNew) {
        ;
        query5(divNew).css({ "opacity": "1" }).css({ "transition": "", "transform": "" });
      }
      if (divOld) {
        ;
        query5(divOld).css({ "opacity": "1" }).css({ "transition": "", "transform": "" });
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
  const el = query5(boxSel).get(0);
  const pWidth = el.scrollWidth;
  const pHeight = el.scrollHeight;
  let style = `height: ${pHeight}px; width: ${pWidth}px`;
  if (el.tagName == "BODY") {
    style = "position: fixed; right: 0; bottom: 0;";
  }
  query5(boxSel).prepend(
    `<div class="tsg-lock" style="${style}"></div><div class="tsg-lock-msg"></div>`
  );
  const $lock = query5(boxSel).find(".tsg-lock");
  const $mess = query5(boxSel).find(".tsg-lock-msg");
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
    query5(boxSel).find(".tsg-lock").css({
      transition: (speed ?? 0) / 1e3 + "s",
      opacity: 0
    });
    const _box = query5(boxSel).get(0);
    clearTimeout(_box["_prevUnlock"]);
    _box["_prevUnlock"] = setTimeout(() => {
      query5(boxSel).find(".tsg-lock").remove();
    }, speed);
    query5(boxSel).find(".tsg-lock-msg").remove();
  } else {
    query5(boxSel).find(".tsg-lock").remove();
    query5(boxSel).find(".tsg-lock-msg").remove();
  }
}
function getSize(el, type) {
  const $el = query5(el);
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
  let div = query5("body > #_tmp_width");
  if (div.length === 0) {
    query5("body").append('<div id="_tmp_width" style="position: absolute; top: -9000px;"></div>');
    div = query5("body > #_tmp_width");
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
  query5(normalizedSelector).each((el) => {
    const actions = query5(el).data();
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
      query5(el).off(name + ".TsUtils-bind").on(name + ".TsUtils-bind", function(event) {
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
var query6 = query;
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
    query6("body").append(html);
    this.tmp["scrollBarSize"] = 100 - query6("#_scrollbar_width > div")[0].clientWidth;
    query6("#_scrollbar_width").remove();
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
        let tmp = String(query6(input.childNodes[i]).text());
        if (input.childNodes[i].tagName) {
          tmp = String(query6(input.childNodes[i]).html());
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

export {
  query6 as query,
  TsUtils
};
//# sourceMappingURL=chunk-ZDPL4SCT.js.map