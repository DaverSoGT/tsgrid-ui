import {
  TsColor,
  TsDate,
  TsMenu,
  TsTooltip
} from "./chunk-T7DFHUXG.js";
import {
  TsUtils
} from "./chunk-4ANPVTBJ.js";
import {
  searchIcon
} from "./chunk-OITJCF5M.js";
import {
  TsBase,
  isHTMLElement,
  query
} from "./chunk-RR7PNBCO.js";

// src/tsfield.ts
var query2 = query;
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
    if (!isHTMLElement(el)) {
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
        if (query2(this.el).attr("placeholder") == null) {
          query2(this.el).attr("placeholder", options.format);
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
        if (query2(this.el).attr("placeholder") == null) {
          query2(this.el).attr("placeholder", options.format);
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
        if (query2(this.el).attr("placeholder") == null) {
          query2(this.el).attr("placeholder", options.placeholder || options.format);
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
          query2(this.el).addClass("tsg-select");
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
        query2(this.el).attr("autocapitalize", "off").attr("autocomplete", "off").attr("autocorrect", "off").attr("spellcheck", "false");
        if (options.selected.text != null) {
          query2(this.el).val(options.selected.text);
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
        if (query2(this.el).attr("placeholder") == null) {
          query2(this.el).attr("placeholder", TsUtils.lang("Attach files by dragging and dropping or Click to Select"));
        }
        break;
      }
      default: {
        console.log(`ERROR: field type "${this.type}" is not supported.`);
        break;
      }
    }
    const $elInit = query2(this.el);
    $elInit.css("box-sizing", "border-box");
    $elInit.addClass("TsField tsg-input").off(".TsField").on("change.TsField", (event) => {
      this.change(event);
    }).on("click.TsField", (event) => {
      this.click(event);
    }).on("focus.TsField", (event) => {
      this.focus(event);
    }).on("blur.TsField", (event) => {
      if (this.type !== "list") this.blur(event);
    }).on("keydown.TsField", (event) => {
      this.keyDown(event);
    }).on("keyup.TsField", (event) => {
      this.keyUp(event);
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
      ret = query2(this.el).val();
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
        query2(this.el).trigger("input").trigger("change");
      } else {
        if (val == null) val = [];
        const it = this.type === "enum" && !Array.isArray(val) ? [val] : val;
        this.selected = it;
        query2(this.el).trigger("input").trigger("change");
      }
      this.refresh();
    } else {
      query2(this.el).val(val);
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
        query2(this.el).trigger("input").trigger("change");
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
      query2(this.helpers.suffix).find(":scope > div").css("background-color", color);
    }
    if (this.type == "list") {
      if (this.helpers.prefix) query2(this.helpers.prefix).hide();
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
      const focus = query2(this.helpers.search_focus);
      const icon = query2(focus.get(0).previousElementSibling);
      focus.css({ outline: "none" });
      if (focus.val() === "") {
        focus.css("opacity", 0);
        icon.css("opacity", 0);
        if (this.selected?.id != null) {
          const text = this.selected.text;
          const ind = this.findItemIndex(options.items, this.selected.id);
          if (text != null) {
            ;
            query2(this.el).val(TsUtils.lang(text)).data({
              selected: text,
              selectedIndex: ind[0]
            });
          }
        } else {
          this.el.value = "";
          query2(this.el).removeData("selected selectedIndex");
        }
      } else {
        focus.css("opacity", 1);
        icon.css("opacity", 1);
        query2(this.el).val("");
        setTimeout(() => {
          if (this.helpers.prefix) query2(this.helpers.prefix).hide();
          if (options.icon) {
            focus.css("margin-left", "17px");
            query2(this.helpers.search).find('[data-icon="search"]').addClass("show-search");
          } else {
            focus.css("margin-left", "0px");
            query2(this.helpers.search).find('[data-icon="search"]').removeClass("show-search");
          }
        }, 1);
      }
      if (query2(this.el).prop("readOnly") || query2(this.el).prop("disabled")) {
        setTimeout(() => {
          if (this.helpers.prefix) query2(this.helpers.prefix).css("opacity", "0.6");
          if (this.helpers.suffix) query2(this.helpers.suffix).css("opacity", "0.6");
        }, 1);
      } else {
        setTimeout(() => {
          if (this.helpers.prefix) query2(this.helpers.prefix).css("opacity", "1");
          if (this.helpers.suffix) query2(this.helpers.suffix).css("opacity", "1");
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
      query2(this.el).css("z-index", "-1");
      if (query2(this.el).prop("readOnly") || query2(this.el).prop("disabled")) {
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
        query2(this.el).attr("placeholder", "");
      }
      div.find(".tsg-enum-placeholder").remove();
      ul.find(".li-item").remove();
      if (html !== "") {
        ul.prepend(html);
      } else if (query2(this.el).attr("placeholder") != null && div.find("input").val() === "") {
        const style = TsUtils.stripSpaces(`
                    padding-top: ${styles["padding-top"]};
                    padding-left: ${styles["padding-left"]};
                    box-sizing: ${styles["box-sizing"]};
                    line-height: ${styles["line-height"]};
                    font-size: ${styles["font-size"]};
                    font-family: ${styles["font-family"]};
                `);
        div.prepend(`<div class="tsg-enum-placeholder" style="${style}">${query2(this.el).attr("placeholder")}</div>`);
      }
      div.off(".w2item").on("scroll.w2item", (event) => {
        const edata = this.trigger("scroll", { target: this.el, originalEvent: event });
        if (edata.isCancelled === true) return;
        TsTooltip2.hide(this.el.id + "_preview");
        edata.finish();
      }).find(".li-item").on("click.w2item", (event) => {
        const mouseEvent = event;
        const target = query2(mouseEvent.target).closest(".li-item");
        const index = target.attr("index");
        const item = index != null ? this.selected[Number(index)] : void 0;
        if (query2(target).hasClass("li-search")) return;
        mouseEvent.stopPropagation();
        let edata;
        if (query2(mouseEvent.target).hasClass("tsg-list-remove")) {
          if (query2(this.el).prop("readOnly") || query2(this.el).prop("disabled")) return;
          edata = this.trigger("remove", { target: this.el, originalEvent: mouseEvent, item });
          if (edata.isCancelled === true) return;
          const transfer = new DataTransfer();
          const input = query2(mouseEvent.target).closest(".tsg-list").find("input.file-input").get(0);
          if (input) {
            Array.from(input.files ?? []).filter((f) => f.name != item.name).forEach((f) => transfer.items.add(f));
            input.files = transfer.files;
          }
          if (index != null) this.selected.splice(Number(index), 1);
          query2(this.el).trigger("input").trigger("change");
          query2(mouseEvent.target).remove();
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
              const $img = query2(`#w2overlay-${name} img`);
              $img.on("load", function(_event2) {
                const w = this.clientWidth;
                const h = this.clientHeight;
                if (w < 300 && h < 300) return;
                if (w >= h && w > 300) query2(this).css("width", "300px");
                if (w < h && h > 300) query2(this).css("height", "300px");
              }).on("error", function(_event2) {
                this.style.display = "none";
              });
            });
          }
        }
        edata.finish();
      }).on("mouseenter.w2item", (event) => {
        const mouseEvent = event;
        const target = query2(mouseEvent.target).closest(".li-item");
        if (query2(target).hasClass("li-search")) return;
        const idx = query2(mouseEvent.target).attr("index");
        const item = idx != null ? this.selected[Number(idx)] : void 0;
        const edata = this.trigger("mouseEnter", { target: this.el, originalEvent: mouseEvent, item });
        if (edata.isCancelled === true) return;
        edata.finish();
      }).on("mouseleave.w2item", (event) => {
        const mouseEvent = event;
        const target = query2(mouseEvent.target).closest(".li-item");
        if (query2(target).hasClass("li-search")) return;
        const idx = query2(mouseEvent.target).attr("index");
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
      query2(focus).css("width", width);
    }
    if (multi) {
      query2(multi).css("width", width - parseInt(styles["margin-left"], 10) - parseInt(styles["margin-right"], 10));
    }
    if (suffix) {
      this.addSuffix();
    }
    if (prefix) {
      this.addPrefix();
    }
    const div = this.helpers.multi;
    if (["enum", "file"].includes(this.type) && div) {
      query2(this.el).css("height", "");
      let cntHeight = query2(div).find(":scope div.tsg-multi-items").get(0).clientHeight + 5;
      if (cntHeight < 20) cntHeight = 20;
      if (this.tmp["max-height"] != null && cntHeight > this.tmp["max-height"]) {
        cntHeight = this.tmp["max-height"] ?? cntHeight;
      }
      if (this.tmp["min-height"] != null && cntHeight < this.tmp["min-height"]) {
        cntHeight = this.tmp["min-height"] ?? cntHeight;
      }
      const inpHeight = TsUtils.getSize(this.el, "height") - 2;
      if (inpHeight > cntHeight) cntHeight = inpHeight;
      query2(div).css({
        "height": cntHeight + "px",
        overflow: cntHeight == this.tmp["max-height"] ? "auto" : "hidden"
      });
      query2(div).css("height", cntHeight + "px");
      query2(this.el).css({ "height": cntHeight + "px" });
    }
    this.tmp.current_width = width;
  }
  reset() {
    if (this.tmp != null) {
      query2(this.el).css("height", "");
      ["padding-left", "padding-right", "background-color", "border-color"].forEach((prop) => {
        if (this.tmp && this.tmp["old-" + prop] != null) {
          query2(this.el).css(prop, this.tmp["old-" + prop]);
          delete this.tmp["old-" + prop];
        }
      });
      clearInterval(this.tmp.sizeTimer);
    }
    ;
    query2(this.el).val(this.clean(query2(this.el).val())).removeClass("TsField tsg-input").removeData("selected selectedIndex").off(".TsField");
    Object.keys(this.helpers).forEach((key) => {
      query2(this.helpers[key]).remove();
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
  change(event) {
    if (["int", "float", "money", "currency", "percent"].indexOf(this.type) !== -1) {
      const val = query2(this.el).val();
      const new_val = this.format(this.clean(query2(this.el).val()));
      if (val !== "" && val != new_val) {
        query2(this.el).val(new_val);
        event.stopPropagation();
        event.preventDefault();
        return false;
      }
    }
    if (this.type === "color") {
      let color = query2(this.el).val();
      if (color.substr(0, 3).toLowerCase() !== "rgb") {
        color = "#" + color;
        const len = query2(this.el).val().length;
        if (len !== 8 && len !== 6 && len !== 3) color = "";
      }
      const next = query2(this.el).get(0).nextElementSibling;
      query2(next).find("div").css("background-color", color);
      if (query2(this.el).hasClass("has-focus")) {
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
        query2(this.el).val(String(tmp)).trigger("input").trigger("change");
      }
    }
  }
  click(event) {
    if (["list", "combo", "enum"].includes(this.type)) {
      if (!query2(this.el).hasClass("has-focus")) {
        this.focus(event);
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
          event.stopPropagation();
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
  focus(event) {
    if (this.type == "list" && document.activeElement == this.el) {
      this.helpers.search_focus?.focus();
      if (event.showMenu !== false && this.options.openOnFocus !== false && query2(this.el).hasClass("has-focus") && !this.tmp.overlay?.overlay?.displayed) {
        setTimeout(() => {
          this.tmp.openedOnFocus = true;
          this.updateOverlay();
        }, 0);
      }
      return;
    }
    if (["color", "date", "time", "datetime"].indexOf(this.type) !== -1) {
      if (query2(this.el).prop("readOnly") || query2(this.el).prop("disabled")) return;
      this.updateOverlay();
    }
    if (["list", "combo", "enum"].indexOf(this.type) !== -1) {
      if (query2(this.el).prop("readOnly") || query2(this.el).prop("disabled")) {
        query2(this.el).addClass("has-focus");
        return;
      }
      if (typeof this.options._items_fun == "function") {
        ;
        this.options.items = TsUtils.normMenu.call(this, this.options._items_fun, this.options);
      }
      if (this.helpers.search) {
        const search = this.helpers.search_focus;
        if (search) {
          search.value = "";
          search.select();
        }
      }
      if (this.type == "enum") {
        const search = query2(this.el.previousElementSibling).find(".li-search input").get(0);
        if (document.activeElement !== search) {
          search.focus();
        }
      }
      this.resize();
      if (event.showMenu !== false && this.options.openOnFocus !== false && query2(this.el).hasClass("has-focus") && !this.tmp.overlay?.overlay?.displayed) {
        setTimeout(() => {
          this.tmp.openedOnFocus = true;
          this.updateOverlay();
        }, 0);
      }
    }
    if (this.type == "file") {
      const prev = query2(this.el).get(0).previousElementSibling;
      query2(prev).addClass("has-focus");
    }
    query2(this.el).addClass("has-focus");
  }
  blur(_event) {
    const val = query2(this.el).val().trim();
    query2(this.el).removeClass("has-focus");
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
          query2(this.el).val(newVal).trigger("input").trigger("change");
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
          query2(this.el).val("").trigger("input").trigger("change");
        }
      }
    }
    if (this.type === "enum") {
      ;
      query2(this.helpers.multi).find("input").val("").css("width", "15px");
    }
    if (this.type == "file") {
      const prev = this.el.previousElementSibling;
      query2(prev).removeClass("has-focus");
    }
    if (this.type === "list") {
      this.el.value = this.selected?.text ?? "";
    }
  }
  keyDown(event, extra) {
    const options = this.options;
    const key = event.keyCode || extra && extra.keyCode;
    let cancel = false;
    let val, inc, daymil, dt, newValue, newDT;
    if (["int", "float", "money", "currency", "percent", "hex", "bin", "color", "alphanumeric"].includes(this.type)) {
      if (!event.metaKey && !event.ctrlKey && !event.altKey) {
        if (!this.isStrValid(event.key ?? "1", true) && // valid & is not arrows, dot, comma, etc keys
        ![9, 8, 13, 27, 37, 38, 39, 40, 46].includes(event.keyCode)) {
          event.preventDefault();
          if (event.stopPropagation) event.stopPropagation();
          else event.cancelBubble = true;
          return false;
        }
      }
    }
    if (["int", "float", "money", "currency", "percent"].includes(this.type)) {
      if (!options.keyboard || query2(this.el).prop("readOnly") || query2(this.el).prop("disabled")) return;
      val = parseFloat(query2(this.el).val().replace(options.moneyRE, "")) || 0;
      inc = options.step;
      if (event.ctrlKey || event.metaKey) inc = options.step * 10;
      switch (key) {
        case 38:
          if (event.shiftKey) break;
          newValue = val + inc <= options.max || options.max == null ? Number((val + inc).toFixed(12)) : options.max;
          query2(this.el).val(String(newValue)).trigger("input").trigger("change");
          cancel = true;
          break;
        case 40:
          if (event.shiftKey) break;
          newValue = val - inc >= options.min || options.min == null ? Number((val - inc).toFixed(12)) : options.min;
          query2(this.el).val(String(newValue)).trigger("input").trigger("change");
          cancel = true;
          break;
      }
      if (cancel) {
        event.preventDefault();
        this.moveCaret2end();
      }
    }
    if (["date", "datetime"].includes(this.type)) {
      if (!options.keyboard || query2(this.el).prop("readOnly") || query2(this.el).prop("disabled")) return;
      const is = (this.type == "date" ? TsUtils.isDate : TsUtils.isDateTime).bind(TsUtils);
      const format = (this.type == "date" ? TsUtils.formatDate : TsUtils.formatDateTime).bind(TsUtils);
      daymil = 24 * 60 * 60 * 1e3;
      inc = 1;
      if (event.ctrlKey || event.metaKey) inc = 10;
      dt = is(query2(this.el).val(), options.format, true);
      if (!dt) {
        dt = /* @__PURE__ */ new Date();
        daymil = 0;
      }
      switch (key) {
        case 38:
          if (event.shiftKey) break;
          if (inc == 10) {
            dt.setMonth(dt.getMonth() + 1);
          } else {
            dt.setTime(dt.getTime() + daymil);
          }
          newDT = format(dt.getTime(), options.format);
          query2(this.el).val(newDT).trigger("input").trigger("change");
          cancel = true;
          break;
        case 40:
          if (event.shiftKey) break;
          if (inc == 10) {
            dt.setMonth(dt.getMonth() - 1);
          } else {
            dt.setTime(dt.getTime() - daymil);
          }
          newDT = format(dt.getTime(), options.format);
          query2(this.el).val(newDT).trigger("input").trigger("change");
          cancel = true;
          break;
      }
      if (cancel) {
        event.preventDefault();
        this.moveCaret2end();
        this.updateOverlay();
      }
    }
    if (this.type === "time") {
      if (!options.keyboard || query2(this.el).prop("readOnly") || query2(this.el).prop("disabled")) return;
      inc = event.ctrlKey || event.metaKey ? 60 : 1;
      val = query2(this.el).val();
      let time = TsDate2.str2min(val) || TsDate2.str2min((/* @__PURE__ */ new Date()).getHours() + ":" + ((/* @__PURE__ */ new Date()).getMinutes() - 1));
      switch (key) {
        case 38:
          if (event.shiftKey) break;
          time += inc;
          cancel = true;
          break;
        case 40:
          if (event.shiftKey) break;
          time -= inc;
          cancel = true;
          break;
      }
      if (cancel) {
        event.preventDefault();
        query2(this.el).val(TsDate2.min2str(time)).trigger("input").trigger("change");
        this.moveCaret2end();
      }
    }
    if (["list", "enum"].includes(this.type)) {
      switch (key) {
        case 8:
        // delete
        case 46:
          if (this.type == "list") {
            const search = query2(this.helpers.search_focus);
            if (search.val() == "") {
              const edata = this.trigger("remove", { target: this.el, originalEvent: event, item: this.selected });
              if (edata.isCancelled === true) return;
              this.selected = null;
              TsMenu2.hide(this.el.id + "_menu");
              query2(this.el).val("").trigger("input").trigger("change");
              edata.finish();
            }
          } else {
            const search = query2(this.helpers.multi).find("input");
            if (search.val() == "") {
              const edata = this.trigger("remove", { target: this.el, originalEvent: event, item: this.selected[this.selected.length - 1] });
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
  keyUp(event) {
    if (this.type == "list") {
      const search = query2(this.helpers.search_focus);
      if (search.val() !== "") {
        query2(this.el).attr("placeholder", "");
      } else {
        query2(this.el).attr("placeholder", this.tmp.pholder);
      }
      if (event.keyCode == 13) {
        setTimeout(() => {
          search.val("");
          TsMenu2.hide(this.el.id + "_menu");
          this.refresh();
        }, 1);
      }
      if ([38, 40].includes(event.keyCode) && !this.tmp.overlay?.overlay?.displayed) {
        this.updateOverlay();
      }
      this.refresh();
    }
    if (this.type == "combo") {
      if (![9, 16, 27].includes(event.keyCode) && this.options.openOnFocus !== true) {
        this.updateOverlay();
      }
      if ([38, 40].includes(event.keyCode) && !this.tmp.overlay?.overlay?.displayed) {
        this.updateOverlay();
      }
    }
    if (this.type == "enum") {
      const search = this.helpers.multi?.find("input");
      const styles = getComputedStyle(search?.get(0));
      const width = TsUtils.getStrWidth(
        search?.val(),
        `font-family: ${styles["font-family"]}; font-size: ${styles["font-size"]};`,
        void 0
      );
      search?.css({ width: width + 15 + "px" });
      this.resize();
      if ([8, 46, 9, 16, 27].includes(event.keyCode)) {
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
      if (query2(this.el).prop("readOnly") || query2(this.el).prop("disabled")) return;
      TsColor2.show(TsUtils.extend({
        name: this.el.id + "_color",
        anchor: this.el,
        transparent: options.transparent,
        advanced: options.advanced,
        color: this.el.value,
        liveUpdate: true
      }, this.options)).select((event) => {
        const color = event.detail["color"];
        query2(this.el).val(color).trigger("input").trigger("change");
      }).liveUpdate((event) => {
        const color = event.detail["color"];
        query2(this.helpers.suffix).find(":scope > div").css("background-color", "#" + color);
      });
    }
    if (["list", "combo", "enum"].includes(this.type)) {
      let el = this.el;
      let input = this.el;
      if (this.type === "enum") {
        el = this.helpers.multi?.get(0) ?? this.el;
        input = query2(el).find("input").get(0) ?? this.el;
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
      if (query2(this.el).hasClass("has-focus") && !this.el.readOnly && !this.el.disabled) {
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
        this.tmp.overlay = TsMenu2.show(params).select((event) => {
          if (["list", "combo"].includes(this.type)) {
            this.selected = event.detail["item"];
            query2(input).val("");
            query2(this.el).val(this.selected.text).trigger("input").trigger("change");
            this.focus({ showMenu: false });
          } else {
            const selected = this.selected;
            const newItem = event.detail?.["item"];
            if (newItem) {
              const edata = this.trigger("add", { target: this.el, item: newItem, originalEvent: event });
              if (edata.isCancelled === true) return;
              if (selected.length >= options.max && options.max > 0) selected.pop();
              delete newItem.hidden;
              selected.push(newItem);
              query2(this.el).trigger("input").trigger("change");
              query2(this.helpers.multi).find("input").val("");
              const overlay = TsMenu2.get(this.el.id + "_menu");
              if (overlay) overlay.options.selected = this.selected;
              edata.finish();
            }
          }
        });
      }
    }
    if (["date", "time", "datetime"].includes(this.type)) {
      if (query2(this.el).prop("readOnly") || query2(this.el).prop("disabled")) return;
      TsDate2.show(TsUtils.extend({
        name: this.el.id + "_date",
        anchor: this.el,
        value: this.el.value
      }, this.options)).select((event) => {
        const date = event.detail["date"];
        if (date != null) {
          ;
          query2(this.el).val(date).trigger("input").trigger("change");
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
    if (this.helpers.prefix) query2(this.helpers.prefix).remove();
    query2(this.el).before(`<div class="tsg-field-helper">${this.options.prefix}</div>`);
    const helper = query2(this.el).get(0).previousElementSibling;
    query2(helper).css({
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
    query2(this.el).css("padding-left", helper.clientWidth + "px !important");
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
      if (this.helpers.arrows) query2(this.helpers.arrows).remove();
      query2(this.el).after(
        '<div class="tsg-field-helper" style="border: 1px solid transparent">&#160;    <div class="tsg-field-up" type="up">        <div class="arrow-up" type="up"></div>    </div>    <div class="tsg-field-down" type="down">        <div class="arrow-down" type="down"></div>    </div></div>'
      );
      const arrowHelper = query2(this.el).get(0).nextElementSibling;
      const $arrowHelper = query2(arrowHelper);
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
      $arrowHelper.on("mousedown", (event) => {
        const mouseEvent = event;
        if (query2(mouseEvent.target).hasClass("arrow-up")) {
          this.keyDown(mouseEvent, { keyCode: 38 });
        }
        if (query2(mouseEvent.target).hasClass("arrow-down")) {
          this.keyDown(mouseEvent, { keyCode: 40 });
        }
      });
      pr += arrowHelper.clientWidth;
      query2(this.el).css("padding-right", pr + "px !important");
      this.helpers.arrows = arrowHelper;
    }
    if (this.options.suffix !== "") {
      if (this.helpers.suffix) query2(this.helpers.suffix).remove();
      query2(this.el).after(`<div class="tsg-field-helper">${this.options.suffix}</div>`);
      const suffixHelper = query2(this.el).get(0).nextElementSibling;
      query2(suffixHelper).css({
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
      query2(this.el).css("padding-right", suffixHelper.clientWidth + "px !important");
      this.helpers.suffix = suffixHelper;
    }
  }
  // Only used for list
  addSearch() {
    if (this.type !== "list") return;
    if (this.helpers.search) query2(this.helpers.search).remove();
    let tabIndex = parseInt(query2(this.el).attr("tabIndex"));
    if (!isNaN(tabIndex) && tabIndex !== -1) this.tmp["old-tabIndex"] = tabIndex;
    if (this.tmp["old-tabIndex"]) tabIndex = this.tmp["old-tabIndex"];
    if (tabIndex == null || isNaN(tabIndex)) tabIndex = 0;
    let searchId = "";
    if (query2(this.el).attr("id") != null) {
      searchId = 'id="' + query2(this.el).attr("id") + '_search"';
    }
    const html = `
            <div class="tsg-field-helper">
                <span class="tsg-icon" data-icon="search">${searchIcon()}</span>
                <input ${searchId} type="text" tabIndex="${tabIndex}" ${query2(this.el).prop("readOnly") ? "readonly" : ""}
                    autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"/>
            </div>`;
    query2(this.el).attr("tabindex", String(-1)).before(html);
    const helper = query2(this.el).get(0).previousElementSibling;
    this.helpers.search = helper;
    this.helpers.search_focus = query2(helper).find("input").get(0);
    const styles = getComputedStyle(this.el);
    const $helperSearch = query2(helper);
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
    query2(helper).find("input").off(".tsg-helper").on("focus.tsg-helper", (event) => {
      const focusEvent = event;
      query2(focusEvent.target).val("");
      this.tmp.pholder = query2(this.el).attr("placeholder") ?? "";
      this.focus(focusEvent);
      focusEvent.stopPropagation();
    }).on("blur.tsg-helper", (event) => {
      const focusEvent = event;
      query2(focusEvent.target).val("");
      if (this.tmp.pholder != null) query2(this.el).attr("placeholder", this.tmp.pholder);
      this.blur(focusEvent);
      focusEvent.stopPropagation();
    }).on("keydown.tsg-helper", (event) => {
      this.keyDown(event);
    }).on("keyup.tsg-helper", (event) => {
      this.keyUp(event);
    });
    query2(helper).off(".tsg-helper").on("click.tsg-helper", (_event) => {
      query2(helper).find("input").get(0).focus();
    });
  }
  // Used in enum/file
  addMultiSearch() {
    if (!["enum", "file"].includes(this.type)) {
      return;
    }
    query2(this.helpers.multi).remove();
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
    if (query2(this.el).attr("id") != null) {
      searchId = `id="${query2(this.el).attr("id")}_search"`;
    }
    let tabIndex = parseInt(query2(this.el).attr("tabIndex"));
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
                            ${query2(this.el).prop("readOnly") ? "readonly" : ""}
                            ${query2(this.el).prop("disabled") ? "disabled" : ""}>
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
                        ${query2(this.el).prop("readOnly") || query2(this.el).prop("disabled") ? "disabled" : ""}
                        ${query2(this.el).attr("accept") ? ' accept="' + query2(this.el).attr("accept") + '"' : ""}>
                </div>
                <div class="tsg-multi-items">
                    <div class="li-search" style="display: none">
                        <input ${searchId} type="text" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false"
                            tabindex="${tabIndex}"
                            ${query2(this.el).prop("readOnly") ? "readonly" : ""}
                            ${query2(this.el).prop("disabled") ? "disabled" : ""}>
                    </div>
                </div>
            </div>`;
    }
    this.tmp["old-background-color"] = styles["background-color"];
    this.tmp["old-border-color"] = styles["border-color"];
    query2(this.el).before(html).css({
      "border-color": "transparent",
      "background-color": "transparent"
    });
    const div = query2(this.el.previousElementSibling);
    this.helpers.multi = div;
    query2(this.el).attr("tabindex", String(-1));
    div.on("mousedown", (event) => {
      query2(event.target).addClass("has-focus");
    }).on("mouseup", (event) => {
      query2(event.target).removeClass("has-focus");
    }).on("click", (event) => {
      this.focus(event);
      this.updateOverlay();
    });
    div.find("input:not(.file-input)").on("click", (event) => {
      this.click(event);
    }).on("focus", (event) => {
      this.focus(event);
    }).on("blur", (event) => {
      this.blur(event);
    }).on("keydown", (event) => {
      this.keyDown(event);
    }).on("keyup", (event) => {
      this.keyUp(event);
    });
    if (this.type === "file") {
      div.find("input.file-input").off(".drag").on("click.drag", (event) => {
        const mouseEvent = event;
        mouseEvent.stopPropagation();
        if (query2(this.el).prop("readOnly") || query2(this.el).prop("disabled")) return;
        this.focus(mouseEvent);
      }).on("dragenter.drag", (_event) => {
        if (query2(this.el).prop("readOnly") || query2(this.el).prop("disabled")) return;
        div.addClass("tsg-file-dragover");
      }).on("dragleave.drag", (_event) => {
        if (query2(this.el).prop("readOnly") || query2(this.el).prop("disabled")) return;
        div.removeClass("tsg-file-dragover");
      }).on("drop.drag", (event) => {
        const dragEvent = event;
        if (query2(this.el).prop("readOnly") || query2(this.el).prop("disabled")) return;
        div.removeClass("tsg-file-dragover");
        const files = Array.from(dragEvent.dataTransfer?.files ?? []);
        files.forEach((file) => {
          this.addFile(file);
        });
        this.focus(dragEvent);
        dragEvent.preventDefault();
        dragEvent.stopPropagation();
      }).on("dragover.drag", (event) => {
        const dragEvent = event;
        dragEvent.preventDefault();
        dragEvent.stopPropagation();
      }).on("change.drag", (event) => {
        const target = event.target;
        if (target.files != null) {
          Array.from(target.files).forEach((file) => {
            this.addFile(file);
          });
        }
        this.focus(event);
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
      reader.onload = (event) => {
        const fl = event.target?.result ?? "";
        const ind = fl.indexOf(",");
        newItem.content = fl.substr(ind + 1);
        this.refresh();
        query2(this.el).trigger("input").trigger("change");
        edata.finish();
      };
      reader.readAsDataURL(file);
    } else {
      this.refresh();
      query2(this.el).trigger("input").trigger("change");
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

export {
  TsField
};
//# sourceMappingURL=chunk-ZOUDF767.js.map