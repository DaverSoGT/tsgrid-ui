import {
  TsField
} from "./chunk-26XP2XU3.js";
import {
  TsTabs
} from "./chunk-OMLGN735.js";
import {
  TsToolbar
} from "./chunk-HFFXB5H2.js";
import {
  TsTooltip
} from "./chunk-OFASTA2A.js";
import {
  TsUtils
} from "./chunk-3NYH6545.js";
import {
  TsBase,
  TsUi,
  query
} from "./chunk-DXZJHS4M.js";

// src/tsform.ts
var TsTooltip2 = TsTooltip;
var query2 = query;
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
    if (typeof this.box == "string") this.box = query2(this.box).get(0);
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
      const selected2 = query2(el).closest(".tsg-field-group").find("input:checked").get(0);
      if (selected2) {
        const item = field.options.items[query2(selected2).data("index")];
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
      const selected2 = query2(el).closest(".tsg-field-group").find("input:checked");
      if (selected2.length > 0) {
        selected2.each((node) => {
          const el2 = node;
          const item = field.options.items[query2(el2).data("index")];
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
        const key = query2(div).find(".tsg-map.key").val();
        const value = query2(div).find(".tsg-map.value").val();
        if (typeof field.html?.render == "function") {
          current[_ind] ??= {};
          query2(div).find("input, textarea").each((node) => {
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
        const inputs = query2(el).closest(".tsg-field-group").find("input");
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
        const inputs = query2(el).closest("div.tsg-field-group").find("input");
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
        const container = query2(field.el).parent().find(".tsg-map-container");
        field.el.mapRefresh(value, container);
        break;
      }
      case "div":
      case "custom": {
        query2(el).html(value);
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
    query2(this.box).find(".tsg-group").each((node) => {
      const group = node;
      if (isHidden(query2(group).find(".tsg-field"))) {
        query2(group).hide();
      } else {
        query2(group).show();
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
    const el = query2(this.box).find('.tsg-group-title[data-group="' + TsUtils.base64encode(groupName) + '"]');
    if (el.length === 0) return;
    const el_next = query2(el.prop("nextElementSibling"));
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
    query2(errors[0].field.$el).parents(".tsg-field").get(0).scrollIntoView({ block: "nearest", inline: "nearest" });
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
        anchor = query2(error.field.el).closest("div").get(0);
      } else if (["enum", "file"].includes(error.field.type)) {
      }
      TsTooltip2.show(TsUtils.extend({
        anchor,
        name: `${this.name}-${error.field.field}-error`,
        html: error.error
      }, opt));
    });
    this.last.errorsShown = true;
    query2(errors[0].field.$el).parents(".tsg-page").off(".hideErrors").on("scroll.hideErrors", (_evt) => {
      if (this.last.errorsShown) {
        this.showErrors();
      }
    });
  }
  hideErrors() {
    this.last.errorsShown = false;
    this.fields.forEach((field) => {
      TsTooltip2.hide(`${this.name}-${field.field}-error`);
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
    const $page = query2(this.box).find(".page-" + page);
    if ($page.length) {
      TsUtils.lock($page, msg, spinner);
      return true;
    }
    return false;
  }
  unlockPage(page, speed) {
    const $page = query2(this.box).find(".page-" + page);
    if ($page.length) {
      TsUtils.unlock($page, speed);
      return true;
    }
    return false;
  }
  goto(page) {
    if (this.page === page) return;
    if (page != null) this.page = page;
    if (query2(this.box).data("autoSize") === true) {
      query2(this.box).get(0).clientHeight = 0;
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
  action(action, event) {
    const act = this.actions[action];
    let click = act;
    if (TsUtils.isPlainObject(act) && act.onClick) click = act.onClick;
    const edata = this.trigger("action", { target: action, action: act, originalEvent: event });
    if (edata.isCancelled === true) return;
    if (typeof click === "function") click.call(this, event);
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAction(action) {
    const ret = query2(this.box).find('.tsg-buttons button[name="' + action + '"]');
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
      const header = query2(this.box).find(":scope > div .tsg-form-header");
      const toolbar = query2(this.box).find(":scope > div .tsg-form-toolbar");
      const tabs = query2(this.box).find(":scope > div .tsg-form-tabs");
      const page = query2(this.box).find(":scope > div .tsg-page");
      const dpage = query2(this.box).find(":scope > div .tsg-page.page-" + this.page + " > div");
      const buttons = query2(this.box).find(":scope > div .tsg-buttons");
      const { headerHeight, tbHeight, tabsHeight } = resizeElements2();
      if (this.autosize) {
        const cHeight = query2(this.box).get(0).clientHeight;
        if (cHeight === 0 || query2(this.box).data("autosize") == "yes") {
          query2(this.box).css({
            height: headerHeight + tbHeight + tabsHeight + 15 + (page.length > 0 ? TsUtils.getSize(dpage, "height") : 0) + (buttons.length > 0 ? TsUtils.getSize(buttons, "height") : 0) + "px"
          });
          query2(this.box).data("autosize", "yes");
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
    if (!this.isGenerated || !query2(this.box).html()) return 0;
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
      query2(this.box).find("input, textarea, select").each((node) => {
        const el = node;
        const name = query2(el).attr("name") != null ? query2(el).attr("name") : query2(el).attr("id");
        const field = this.get(name);
        if (field) {
          const div = query2(el).closest(".tsg-page");
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
      query2(this.box).find(".tsg-page").hide();
      query2(this.box).find(".tsg-page.page-" + this.page).show();
      query2(this.box).find(".tsg-form-header").html(TsUtils.lang(this.header));
      if (typeof this.tabs === "object" && Array.isArray(this.tabs.tabs) && this.tabs.tabs.length > 0) {
        query2(this.box).find("#form_" + this.name + "_tabs").show();
        this.tabs.active = this.tabs.tabs[this.page].id;
        this.tabs.refresh();
      } else {
        query2(this.box).find("#form_" + this.name + "_tabs").hide();
      }
      if (typeof this.toolbar === "object" && Array.isArray(this.toolbar.items) && this.toolbar.items.length > 0) {
        query2(this.box).find("#form_" + this.name + "_toolbar").show();
        this.toolbar.refresh();
      } else {
        query2(this.box).find("#form_" + this.name + "_toolbar").hide();
      }
    }
    for (let f = 0; f < fields.length; f++) {
      const fieldIdx = fields[f];
      if (fieldIdx == null) continue;
      const field = this.fields[fieldIdx];
      if (field == null) continue;
      if (field.name == null && field.field != null) field.name = field.field;
      if (field.field == null && field.name != null) field.field = field.name;
      field.$el = query2(this.box).find(`[name='${String(field.name).replace(/\\/g, "\\\\")}']`);
      field.el = field.$el.get(0);
      if (field.el) field.el.id = field.name;
      if (field.TsField) {
        field.TsField.reset();
      }
      field.$el.off(".TsForm").on("change.TsForm", function(event) {
        const value = self.getFieldValue(field.field);
        if (value == null) return;
        if (["enum", "file"].includes(field.type)) {
          const helper = field.TsField?.helpers?.multi;
          query2(helper).removeClass("tsg-error");
        }
        if (this._previous != null) {
          value.previous = this._previous;
          delete this._previous;
        }
        const edata2 = self.trigger("change", { target: this.name, field: this.name, value, originalEvent: event });
        if (edata2.isCancelled === true) return;
        self.setValue(this.name, value.current);
        edata2.finish();
      }).on("input.TsForm", function(event) {
        self.rememberOriginal();
        const value = self.getFieldValue(field.field);
        if (value == null) return;
        if (this._previous == null) {
          this._previous = value.previous;
        }
        const edata2 = self.trigger("input", { target: self.name, field, value, originalEvent: event });
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
      if (!tmp) tmp = query2(this.box).find("#" + field.field);
      if (field.hidden) {
        query2(tmp).closest(".tsg-field").hide();
      } else {
        query2(tmp).closest(".tsg-field").show();
      }
    }
    query2(this.box).find("button, input[type=button]").each((node) => {
      const el = node;
      query2(el).off("click").on("click", function(event) {
        let action = this.value;
        if (this.id) action = this.id;
        if (this["name"]) action = this["name"];
        self.action(action, event);
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
          onClick(event) {
            self.rememberOriginal();
            const value = self.getFieldValue(field.name);
            if (value == null) return;
            value.current = event.detail["item"].id;
            const edata2 = self.trigger("change", { target: field.name, field: field.name, value, originalEvent: event });
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
        field.$el.off(".form-input").on("focus.form-input", (event) => {
          const ind = field.toolbar.get(field.$el.val(), true);
          query2(event.target).prop("_index", ind);
          query2(field.toolbar.box).addClass("tsg-tb-focus");
        }).on("blur.form-input", (event) => {
          query2(event.target).removeProp("_index");
          query2(`#${field.name}-tb .tsg-tb-button`).removeClass("over");
          query2(field.toolbar.box).removeClass("tsg-tb-focus");
        }).on("keydown.form-input", (event) => {
          let ind = query2(event.target).prop("_index");
          switch (event.key) {
            case "ArrowLeft": {
              if (ind > 0) ind--;
              query2(`#${field.name}-tb .tsg-tb-button`).removeClass("over").eq(ind).addClass("over");
              query2(event.target).prop("_index", ind);
              break;
            }
            case "ArrowRight": {
              if (ind < field.toolbar.items.length - 1) ind++;
              query2(`#${field.name}-tb .tsg-tb-button`).removeClass("over").eq(ind).addClass("over");
              query2(event.target).prop("_index", ind);
              break;
            }
          }
          if (event.keyCode == 32 || event.keyCode == 13) {
            self.rememberOriginal();
            const value = self.getFieldValue(field.name);
            if (value == null) return;
            const tbItem = field.toolbar.items[ind];
            value.current = tbItem?.id;
            const edata2 = self.trigger("change", { target: field.name, field: field.name, value, originalEvent: event });
            if (edata2.isCancelled === true) {
              return;
            }
            self.record[field.name] = value.current;
            self.setFieldValue(field.name, value.current);
            edata2.finish();
            query2(`#${field.name}-tb .tsg-tb-button`).removeClass("over");
          }
          if (!event.metaKey && !event.ctrlKey && event.keyCode != 9) {
            event.preventDefault();
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
                if (query2(el).attr("tabindex") == null) {
                  query2(el).attr("tabindex", field3.html.tabindex);
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
            const container = query2(field2.el).get(0)?.nextSibling;
            query2(container).off(".mapChange").on("mouseup.mapChange", { delegate: "input, textarea" }, function(event) {
              if (document.activeElement != event.target) {
                event.target.focus();
              }
            }).on("keyup.mapChange", { delegate: "input, textarea" }, function(event) {
              const kbdEvent = event;
              const $div = query2(kbdEvent.target).closest(".tsg-map-field");
              const next = $div.get(0).nextElementSibling;
              const prev = $div.get(0).previousElementSibling;
              const className = query2(kbdEvent.target).hasClass("key") ? "key" : "value";
              if (kbdEvent.keyCode == 38 && prev) {
                query2(prev).find(`input.${className}, textarea.${className}, input[name="${kbdEvent.target["name"]}"] textarea[name="${kbdEvent.target["name"]}"]`).get(0)?.select();
                kbdEvent.preventDefault();
              }
              if (kbdEvent.keyCode == 40 && next) {
                ;
                kbdEvent.target.blur();
                const next2 = $div.get(0).nextElementSibling;
                query2(next2).find(`input.${className}, textarea.${className}, input[name="${kbdEvent.target["name"]}"] textarea[name="${kbdEvent.target["name"]}"]`).get(0)?.select();
                kbdEvent.preventDefault();
              }
            }).on("keydown.mapChange", { delegate: "input, textarea" }, function(_event) {
              const event = _event;
              lastKey = null;
              if (event.keyCode == 9) {
                lastKey = "tab";
              }
              if (event.keyCode == 13) {
                lastKey = "enter";
              }
              if (event.keyCode == 38 || event.keyCode == 40) {
                lastKey = event.keyCode == 38 ? "up" : "down";
                event.preventDefault();
              }
            }).on("input.mapChange", { delegate: "input, textarea" }, function(event) {
              const fld = query2(event.target).closest("div.tsg-map-field");
              const cnt2 = fld.data("index");
              const next = fld.get(0).nextElementSibling;
              let isEmpty = true;
              query2(fld).find("input, textarea").each((node) => {
                const el = node;
                if (!["checkbox", "button"].includes(el.type) && el.value != "") isEmpty = false;
              });
              let isNextEmpty = true;
              query2(next).find("input, textarea").each((node) => {
                const el = node;
                if (!["checkbox", "button"].includes(el.type) && el.value != "") isNextEmpty = false;
              });
              if (!isEmpty && !next) {
                field2.el.mapAdd(field2, div, parseInt(cnt2) + 1, true);
              } else if (isEmpty && next && isNextEmpty) {
                query2(next).remove();
              }
            }).on("change.mapChange", { delegate: "input, textarea" }, function(_event) {
              const event = _event;
              self.rememberOriginal();
              const _fieldValue = self.getFieldValue(field2.field);
              if (_fieldValue == null) return;
              let { current, previous, original } = _fieldValue;
              const $cnt = query2(event.target).closest(".tsg-map-container");
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
                originalEvent: event,
                value: { current, previous, original }
              });
              if (edata2.isCancelled === true) {
                return;
              }
              let index;
              let className = "";
              const cnt2 = query2(event.target).closest(".tsg-map-container");
              if (field2.type == "array" || lastKey == "tab") {
                cnt2.find("input, textarea").each((node, ind) => {
                  if (node == event.target) index = ind;
                });
              } else {
                className = query2(event.target).hasClass("key") ? ".key" : ".value";
                cnt2.find("input" + className + ", textarea" + className).each((node, ind) => {
                  if (node == event.target) index = ind;
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
                  el = cnt2.find("input, textarea").get(safeIdx + (event.shiftKey ? -1 : 1));
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
    if (typeof box == "string") box = query2(box).get(0);
    const edata = this.trigger("render", { target: this.name, box: box ?? this.box });
    if (edata.isCancelled === true) return;
    if (box != null) {
      this.unmount();
      this.box = box;
    }
    if (!this.isGenerated && !this.formHTML) return;
    if (!this.box) return;
    const html = '<div class="tsg-form-box">' + (this.header !== "" ? '<div class="tsg-form-header">' + TsUtils.lang(this.header) + "</div>" : "") + '    <div id="form_' + this.name + '_toolbar" class="tsg-form-toolbar" style="display: none"></div>    <div id="form_' + this.name + '_tabs" class="tsg-form-tabs" style="display: none"></div>' + this.formHTML + "</div>";
    query2(this.box).attr("name", this.name).addClass("tsg-reset tsg-form").html(html);
    if (query2(this.box).length > 0) query2(this.box).get(0).style.cssText += this.style;
    TsUtils.bindEvents(query2(this.box).find(".tsg-eaction"), this);
    if (typeof this.toolbar.render !== "function") {
      this.toolbar = new TsToolbar(TsUtils.extend({}, this.toolbar, { name: this.name + "_toolbar", owner: this }));
      this.toolbar.on("click", function(event) {
        const edata2 = self.trigger("toolbar", { target: event.target, originalEvent: event });
        if (edata2.isCancelled === true) return;
        edata2.finish();
      });
    }
    if (typeof this.toolbar === "object" && typeof this.toolbar.render === "function") {
      this.toolbar.render(query2(this.box).find("#form_" + this.name + "_toolbar").get(0));
    }
    if (typeof this.tabs.render !== "function") {
      this.tabs = new TsTabs(TsUtils.extend({}, this.tabs, { name: this.name + "_tabs", owner: this, active: this.tabs.active }));
      this.tabs.on("click", function(event) {
        self.goto(this.get(event.target, true));
      });
    }
    if (typeof this.tabs === "object" && typeof this.tabs.render === "function") {
      this.tabs.render(query2(this.box).find("#form_" + this.name + "_tabs").get(0));
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
        if (query2(self.box).find("input, select, textarea").length > 0) {
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
    if (query2(this.box).find("#form_" + this.name + "_tabs").length > 0) {
      this.unmount();
    }
    this.last.observeResize?.disconnect();
    delete TsUi[this.name];
    edata.finish();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFocus(focus) {
    if (typeof focus === "undefined") {
      focus = this.focus;
    }
    let $input;
    if (TsUtils.isInt(focus)) {
      if (focus < 0) {
        return;
      }
      const inputs = query2(this.box).find("div:not(.tsg-field-helper) > input, select, textarea, div > label:nth-child(1) > [type=radio]").filter(":not(.file-input)");
      while (inputs.get(focus)?.offsetParent == null && inputs.length > focus) {
        focus++;
      }
      if (inputs.get(focus)) {
        $input = query2(inputs.get(focus));
      }
    } else if (typeof focus === "string") {
      $input = query2(this.box).find(`[name='${focus}']`);
    }
    if ($input?.length > 0) {
      $input.get(0).focus();
    }
    return $input;
  }
};

export {
  TsForm
};
//# sourceMappingURL=chunk-GQAFAXR6.js.map