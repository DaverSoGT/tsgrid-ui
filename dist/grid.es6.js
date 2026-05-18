import {
  TsField
} from "./chunks/chunk-JZZ46ENR.js";
import {
  TsToolbar
} from "./chunks/chunk-FARLMTWL.js";
import {
  TsMenu,
  TsTooltip
} from "./chunks/chunk-E2ZPN7PC.js";
import "./chunks/chunk-EQK6JAHT.js";
import {
  checkIcon,
  chevronDownIcon,
  collapseIcon,
  columnsIcon,
  crossIcon,
  dropIcon,
  emptyIcon,
  expandIcon,
  infoIcon,
  pasteIcon,
  pencilIcon,
  plusIcon,
  reloadIcon,
  searchIcon
} from "./chunks/chunk-OITJCF5M.js";
import {
  TsUtils
} from "./chunks/chunk-ZDPL4SCT.js";
import "./chunks/chunk-IYF3Q7GX.js";
import {
  TsBase,
  TsUi,
  query
} from "./chunks/chunk-W7JZO7EX.js";

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
var query2 = query;
function status(grid, msg) {
  if (msg != null) {
    query2(grid.box).find(`#grid_${grid.name}_footer`).find(".tsg-footer-left").html(msg);
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
    query2(grid.box).find("#grid_" + grid.name + "_footer .tsg-footer-left").html(msgLeft);
  }
}
function lock(grid, msg, showSpinner) {
  const args = [grid.box, msg, showSpinner];
  setTimeout(() => {
    query2(grid.box).find("#grid_" + grid.name + "_empty_msg").remove();
    TsUtils.lock(...args);
  }, 10);
}
function unlock(grid, speed) {
  setTimeout(() => {
    if (query2(grid.box).find(".tsg-message").hasClass("tsg-closing")) return;
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
var query3 = query;
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
      query3(grid.box).find("#grid_" + grid.name + "_footer .tsg-footer-right .tsg-total").html(TsUtils.formatNumber(grid.total));
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
    query3(grid.box).find("#grid_" + grid.name + "_" + name).remove();
    query3(grid.box).find("#grid_" + grid.name + "_f" + name).remove();
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
  const rec1 = query3(grid.box).find(`#grid_${grid.name}_frecords`);
  const rec2 = query3(grid.box).find(`#grid_${grid.name}_records`);
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
    let td1 = query3(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(first.recid) + ' td[col="' + first.column + '"]');
    let td2 = query3(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(last.recid) + ' td[col="' + last.column + '"]');
    let td1f = query3(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(first.recid) + ' td[col="' + first.column + '"]');
    let td2f = query3(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(last.recid) + ' td[col="' + last.column + '"]');
    let _lastColumn = last.column;
    if (first.column < grid.last.vscroll.colIndStart && last.column > grid.last.vscroll.colIndStart) {
      td1 = query3(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(first.recid) + ' td[col="start"]');
    }
    if (first.column < grid.last.vscroll.colIndEnd && last.column > grid.last.vscroll.colIndEnd) {
      td2 = query3(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(last.recid) + ' td[col="end"]');
      _lastColumn = "end";
    }
    const index_top = parseInt(query3(grid.box).find("#grid_" + grid.name + "_rec_top").next().attr("index"));
    const index_bottom = parseInt(query3(grid.box).find("#grid_" + grid.name + "_rec_bottom").prev().attr("index"));
    const index_ftop = parseInt(query3(grid.box).find("#grid_" + grid.name + "_frec_top").next().attr("index"));
    const index_fbottom = parseInt(query3(grid.box).find("#grid_" + grid.name + "_frec_bottom").prev().attr("index"));
    if (td1.length === 0 && first.index < index_top && last.index > index_top) {
      td1 = query3(grid.box).find("#grid_" + grid.name + "_rec_top").next().find('td[col="' + first.column + '"]');
    }
    if (td2.length === 0 && last.index > index_bottom && first.index < index_bottom) {
      td2 = query3(grid.box).find("#grid_" + grid.name + "_rec_bottom").prev().find('td[col="' + _lastColumn + '"]');
    }
    if (td1f.length === 0 && first.index < index_ftop && last.index > index_ftop) {
      td1f = query3(grid.box).find("#grid_" + grid.name + "_frec_top").next().find('td[col="' + first.column + '"]');
    }
    if (td2f.length === 0 && last.index > index_fbottom && first.index < index_fbottom) {
      td2f = query3(grid.box).find("#grid_" + grid.name + "_frec_bottom").prev().find('td[col="' + last.column + '"]');
    }
    const edit = query3(grid.box).find("#grid_" + grid.name + "_editable");
    const tmp = edit.find(".tsg-input");
    const tmp_ind = tmp.attr("index");
    const tmp1 = grid.records[tmp_ind]?.recid;
    const tmp2 = tmp.attr("column");
    if (rg.name == "selection" && rg.range[0].recid == tmp1 && rg.range[0].column == tmp2) continue;
    range = query3(grid.box).find("#grid_" + grid.name + "_f" + rg.name);
    if (td1f.length > 0 || td2f.length > 0) {
      if (range.length === 0) {
        rec1.append('<div id="grid_' + grid.name + "_f" + rg.name + '" class="tsg-selection" style="' + rg.style + '">' + (rg.name == "selection" && grid.show.selectionResizer ? '<div id="grid_' + grid.name + '_resizer" class="tsg-selection-resizer"></div>' : "") + "</div>");
        range = query3(grid.box).find("#grid_" + grid.name + "_f" + rg.name);
      } else {
        range.attr("style", rg.style);
        range.find(".tsg-selection-resizer").show();
      }
      if (td2f.length === 0) {
        td2f = query3(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(last.recid) + " td:last-child");
        if (td2f.length === 0) td2f = query3(grid.box).find("#grid_" + grid.name + "_frec_bottom td:first-child");
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
    range = query3(grid.box).find("#grid_" + grid.name + "_" + rg.name);
    if (td1.length > 0 || td2.length > 0) {
      if (range.length === 0) {
        rec2.append(`
                    <div id="grid_${grid.name}_${rg.name}" class="tsg-selection ${rg.class ?? ""}" style="${rg.style}">
                        ${rg.name == "selection" && grid.show.selectionResizer ? `<div id="grid_${grid.name}_resizer" class="tsg-selection-resizer"></div>` : ""}
                    </div>
                `);
        range = query3(grid.box).find("#grid_" + grid.name + "_" + rg.name);
      } else {
        range.attr("style", rg.style);
      }
      if (td1.length === 0) {
        td1 = query3(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(first.recid) + " td:first-child");
        if (td1.length === 0) td1 = query3(grid.box).find("#grid_" + grid.name + "_rec_top td:first-child");
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
  query3(grid.box).find(".tsg-selection-resizer").off(".resizer").on("mousedown.resizer", mouseStart).on("dblclick.resizer", (event2) => {
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
    query3("body").off(".tsg-" + self.name).on("mousemove.tsg-" + self.name, mouseMove).on("mouseup.tsg-" + self.name, mouseStop);
    event2.preventDefault();
  }
  function mouseMove(event2) {
    const mv = self.last.move;
    if (!mv || mv.type != "expand") return;
    mv.divX = event2.screenX - mv.x;
    mv.divY = event2.screenY - mv.y;
    let column;
    let tmp = event2.target;
    if (tmp.tagName.toUpperCase() != "TD") tmp = query3(tmp).closest("td")[0];
    if (query3(tmp).attr("col") != null) column = parseInt(query3(tmp).attr("col"));
    if (column == null) {
      return;
    }
    tmp = query3(tmp).closest("tr")[0];
    const index = parseInt(query3(tmp).attr("index"));
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
    query3("body").off(".tsg-" + self.name);
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
  query3(grid.box).find(`#grid_${grid.name}_records`).prop("scrollTop", 0);
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
var query4 = query;
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
        recEl1 = query4(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(recid));
        recEl2 = query4(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(recid));
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
        recEl1 = query4(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(recid));
        recEl2 = query4(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(recid));
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
      query4(grid.box).find("#grid_" + grid.name + "_column_" + col_sel[c] + " .tsg-col-header").addClass("tsg-col-selected");
    }
  }
  sel.indexes.sort((a, b) => {
    return a - b;
  });
  const areAllSelected = grid.records.length > 0 && sel.indexes.length == grid.records.length, areAllSearchedSelected = sel.indexes.length > 0 && grid.searchData.length !== 0 && sel.indexes.length == grid.last.searchIds.length;
  if (areAllSelected || areAllSearchedSelected) {
    query4(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", true);
  } else {
    query4(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", false);
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
    const recEl1 = query4(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(recid));
    const recEl2 = query4(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(recid));
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
      query4(grid.box).find(`#grid_${grid.name}_rec_${TsUtils.escapeId(recid)} > td[col="${col}"]`).removeClass("tsg-selected tsg-inactive");
      query4(grid.box).find(`#grid_${grid.name}_frec_${TsUtils.escapeId(recid)} > td[col="${col}"]`).removeClass("tsg-selected tsg-inactive");
      let isColSelected = false;
      let isRowSelected = false;
      const tmp2 = grid.getSelectionCells();
      for (let i = 0; i < tmp2.length; i++) {
        if (tmp2[i].column == col) isColSelected = true;
        if (tmp2[i].recid == recid) isRowSelected = true;
      }
      if (!isColSelected) {
        query4(grid.box).find(`.tsg-grid-columns td[col="${col}"] .tsg-col-header, .tsg-grid-fcolumns td[col="${col}"] .tsg-col-header`).removeClass("tsg-col-selected");
      }
      if (!isRowSelected) {
        query4(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(recid)).find(".tsg-col-number").removeClass("tsg-row-selected");
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
    query4(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", true);
  } else {
    query4(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", false);
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
    query4(grid.box).find(".tsg-grid-records tr:not(.tsg-empty-record)").addClass("tsg-selected").find(".tsg-col-number").addClass("tsg-row-selected");
    query4(grid.box).find(".tsg-grid-frecords tr:not(.tsg-empty-record)").addClass("tsg-selected").find(".tsg-col-number").addClass("tsg-row-selected");
    query4(grid.box).find("input.tsg-grid-select-check").prop("checked", true);
  } else {
    query4(grid.box).find(".tsg-grid-columns td .tsg-col-header, .tsg-grid-fcolumns td .tsg-col-header").addClass("tsg-col-selected");
    query4(grid.box).find(".tsg-grid-records tr .tsg-col-number").addClass("tsg-row-selected");
    query4(grid.box).find(".tsg-grid-records tr:not(.tsg-empty-record)").find(".tsg-grid-data:not(.tsg-col-select)").addClass("tsg-selected");
    query4(grid.box).find(".tsg-grid-frecords tr .tsg-col-number").addClass("tsg-row-selected");
    query4(grid.box).find(".tsg-grid-frecords tr:not(.tsg-empty-record)").find(".tsg-grid-data:not(.tsg-col-select)").addClass("tsg-selected");
    query4(grid.box).find("input.tsg-grid-select-check").prop("checked", true);
  }
  sel = grid.getSelectionRows(true);
  grid.addRange("selection");
  query4(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", true);
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
    query4(grid.box).find(".tsg-grid-records tr.tsg-selected").removeClass("tsg-selected tsg-inactive").find(".tsg-col-number").removeClass("tsg-row-selected");
    query4(grid.box).find(".tsg-grid-frecords tr.tsg-selected").removeClass("tsg-selected tsg-inactive").find(".tsg-col-number").removeClass("tsg-row-selected");
    query4(grid.box).find("input.tsg-grid-select-check").prop("checked", false);
  } else {
    query4(grid.box).find(".tsg-grid-columns td .tsg-col-header, .tsg-grid-fcolumns td .tsg-col-header").removeClass("tsg-col-selected");
    query4(grid.box).find(".tsg-grid-records tr .tsg-col-number").removeClass("tsg-row-selected");
    query4(grid.box).find(".tsg-grid-frecords tr .tsg-col-number").removeClass("tsg-row-selected");
    query4(grid.box).find(".tsg-grid-data.tsg-selected").removeClass("tsg-selected tsg-inactive");
    query4(grid.box).find("input.tsg-grid-select-check").prop("checked", false);
  }
  sel.indexes = [];
  sel.columns = {};
  grid.removeRange("selection");
  query4(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", false);
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

// src/grid-edit.ts
var query5 = query;
var TsTooltip2 = TsTooltip;
function editField(grid, recid, column, value, event2) {
  const self = grid;
  if (grid.last.inEditMode === true) {
    if (event2 && event2.keyCode == 13) {
      const { index: index2, column: column2, value: value2 } = grid.last._edit;
      grid.editChange({ type: "custom", value: value2 }, index2, column2, event2);
      grid.editDone(index2, column2, event2);
    } else {
      const input2 = query5(grid.box).find("div.tsg-edit-box .tsg-input");
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
  const tr = query5(grid.box).find("#grid_" + grid.name + prefix + "rec_" + TsUtils.escapeId(recid));
  let div = tr.find('[col="' + column + '"] > div');
  grid.last._edit["tr"] = tr;
  grid.last._edit["div"] = div;
  query5(grid.box).find("div.tsg-edit-box").remove();
  if (grid.selectType != "row") {
    query5(grid.box).find("#grid_" + grid.name + prefix + "selection").attr("id", "grid_" + grid.name + "_editable").removeClass("tsg-selection").addClass("tsg-edit-box").prepend('<div style="position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px;"></div>').find(".tsg-selection-resizer").remove();
    div = query5(grid.box).find("#grid_" + grid.name + "_editable > div:first-child");
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
        const name = query5(input).data("tooltipName");
        if (name && TsTooltip2.get(name[0])?.selected != null) {
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
  query5(input).off(".tsg-editable").on("blur.tsg-editable", (event3) => {
    if (grid.last.inEditMode) {
      const type = grid.last._edit?.["edit"]?.type;
      const name = query5(input).data("tooltipName");
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
        const name = query5(input).data("tooltipName");
        if (name && name.length > 0) {
          if (grid.last._edit) grid.last._edit["escKey"] = true;
          TsTooltip2.hide(name[0]);
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
          const name = query5(input).data("tooltipName");
          if (name && TsTooltip2.get(name[0]).selected != null) {
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
      const editBox = query5(self.box).find("#grid_" + self.name + "_editable").get(0);
      const style = `font-family: ${styles2.getPropertyValue("font-family")}; font-size: ${styles2.getPropertyValue("font-size")}; white-space: no-wrap;`;
      const width = TsUtils.getStrWidth(val2, style);
      if (width + 20 > editBox.clientWidth) {
        query5(editBox).css("width", width + 20 + "px");
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
  const cell = query5(grid.last._edit?.["tr"]).find('[col="' + column + '"]');
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
  query5(grid.box).find("div.tsg-edit-box").remove();
  grid.updateToolbar();
  setTimeout(() => {
    const input = query5(grid.box).find(`#grid_${grid.name}_focus`).get(0);
    if (document.activeElement !== input && !grid.last.inEditMode) {
      input.focus();
    }
  }, 10);
}

// src/grid-search.ts
var query6 = query;
var TsMenu2 = TsMenu;
var TsTooltip3 = TsTooltip;
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
  const overlay = query6(`#w2overlay-${grid.name}-search-overlay`);
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
  const $btn = query6(grid.toolbar.box).find(".tsg-grid-search-input .tsg-search-drop");
  $btn.addClass("checked");
  TsTooltip3.show({
    name: grid.name + "-search-overlay",
    anchor: query6(grid.box).find("#grid_" + grid.name + "_search_all").get(0),
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
    const overlay = query6(`#w2overlay-${grid.name}-search-overlay`);
    overlay.data("gridName", grid.name).off(".grid-search").on("click.grid-search", (event2) => {
      overlay.find("input, select").each((el) => {
        const names = query6(el).data("tooltipName");
        if (names) names.forEach((name) => {
          TsTooltip3.hide(name);
        });
      });
      console.log(event2.target);
      if (!query6(event2.target).hasClass("tsg-saved-searches")) {
        TsTooltip3.hide(grid.name + "-search-suggest");
      }
    });
    TsUtils.bindEvents(overlay.find("select, input, button"), grid);
    const sfields = query6(`#w2overlay-${grid.name}-search-overlay *[rel=search]`);
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
  TsTooltip3.hide(grid.name + "-search-overlay");
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
  TsTooltip3.hide(grid.name + "-search-props");
  TsTooltip3.show({
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
    query6(event2.detail.overlay.box).find("#remove").on("click", () => {
      grid.searchData.splice(sd_ind, 1);
      grid.reload();
      grid.localSearch();
      TsTooltip3.hide(grid.name + "-search-props");
    });
  });
}
function searchSuggest(grid, imediate, forceHide, anchor) {
  clearTimeout(grid.last.kbd_timer ?? void 0);
  clearTimeout(grid.last["overlay_timer"]);
  grid.searchShowFields(true);
  if (anchor == null) grid.searchClose();
  if (forceHide === true || anchor != null && query6(`#w2overlay-${grid.name}-search-suggest`).length > 0) {
    TsTooltip3.hide(grid.name + "-search-suggest");
    return;
  }
  if (query6(`#w2overlay-${grid.name}-search-suggest`).length > 0) {
    return;
  }
  if (!imediate) {
    grid.last["overlay_timer"] = setTimeout(() => {
      grid.searchSuggest(true);
    }, 100);
    return;
  }
  const el = anchor ?? query6(grid.box).find(`#grid_${grid.name}_search_all`).get(0);
  const searches = [
    ...grid.defaultSearches ?? [],
    ...grid.defaultSearches?.length > 0 && grid.savedSearches?.length > 0 ? ["--"] : [],
    ...grid.savedSearches ?? []
  ];
  if (Array.isArray(searches) && searches.length > 0) {
    TsMenu2.show({
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
      TsTooltip3.hide(grid.name + "-search-overlay");
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
    query6(event2.detail.box).find("input, button").eq(0).val(value);
    await event2.complete;
    query6(event2.detail.box).find("#grid-search-cancel").on("click", () => {
      grid.message();
    });
    query6(event2.detail.box).find("#grid-search-save").on("click", () => {
      const input = query6(event2.detail.box).find(".tsg-message .search-name");
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
          icon: searchIcon(),
          remove: true,
          logic: grid.last.logic,
          data: grid.searchData
        });
      }
      grid.cacheSave("searches", grid.savedSearches.map((s) => TsUtils.clone(s, { exclude: ["remove", "icon"] })));
      grid.message();
      if (grid["searchSelected"]) {
        grid["searchSelected"].text = name;
        query6(grid.box).find(`#grid_${grid.name}_search_name .name-text`).html(name);
      } else {
        grid["searchSelected"] = {
          text: name,
          logic: grid.last.logic,
          data: TsUtils.clone(grid.searchData)
        };
        query6(event2.detail.box).find(`#grid_${grid.name}_search_all`).val(" ").prop("readOnly", true);
        query6(event2.detail.box).find(`#grid_${grid.name}_search_name`).show().find(".name-text").html(name);
      }
      edata.finish({ name });
    });
    await TsUtils.wait(100);
    query6(event2.detail.box).find("input, button").off(".message").on("keydown.message", (evt) => {
      const val = String(query6(event2.detail.box).find(".tsg-message-body input").val()).trim();
      if (evt.keyCode == 13 && val != "") {
        query6(event2.detail.box).find("#grid-search-save").trigger("click");
      }
      if (evt.keyCode == 27) {
        grid.message();
      }
    }).eq(0).on("input.message", (_evt) => {
      const $save = query6(event2.detail.box).closest(".tsg-message").find("#grid-search-save");
      if (String(query6(event2.detail.box).val()).trim() === "") {
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
  const input = query6(grid.box).find("#grid_" + grid.name + "_search_all");
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
    TsTooltip3.hide(grid.name + "-search-fields");
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
  TsMenu2.show({
    type: "radio",
    name: grid.name + "-search-fields",
    anchor: query6(grid.box).find("#grid_" + grid.name + "_search_name").parent().find(".tsg-search-down").get(0),
    items,
    align: "none",
    hideOn: ["doc-click", "select"]
  }).select((event2) => {
    grid.searchInitInput(event2.detail.item.search.field);
  });
}
function searchInitInput(grid, field, _value) {
  let srch;
  const el = query6(grid.box).find("#grid_" + grid.name + "_search_all");
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
    query6(grid.box).find(`#grid_${grid.name}_search_all`).val(" ").prop("readOnly", true);
    query6(grid.box).find(`#grid_${grid.name}_search_name`).show().find(".name-text").html(grid["searchSelected"].text);
  } else {
    query6(grid.box).find(`#grid_${grid.name}_search_all`).prop("readOnly", false);
    query6(grid.box).find(`#grid_${grid.name}_search_name`).hide().find(".name-text").html("");
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
  const overlay = query6(`#w2overlay-${grid.name}-search-overlay`);
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
  const overlay = query6(`#w2overlay-${grid.name}-search-overlay`);
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
      TsTooltip3.hide(grid.name + "-search-overlay");
    }
  });
}

// src/grid-interaction.ts
var query7 = query;
var TsMenu3 = TsMenu;
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
    if (trg.tagName != "TD") trg = query7(trg).closest("td")[0];
    if (query7(trg).attr("col") != null) column = parseInt(query7(trg).attr("col"));
  }
  const index = grid.get(recid, true);
  const rec = index != null ? grid.records[index] : null;
  if (rec?.TsUi?.selectable === false && (rec?.TsUi?.children?.length ?? 0) > 0) {
    if (!query7(event2.target).hasClass("tsg-show-children")) {
      grid.toggle(recid);
      return;
    }
  }
  const edata = grid.trigger("click", { target: grid.name, recid, column, originalEvent: event2 });
  if (edata.isCancelled === true) return;
  const sel = grid.getSelection();
  query7(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", false);
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
    if (query7(event2.target).closest("td").hasClass("tsg-col-select")) fselect = true;
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
  TsMenu3.show({
    type: "check",
    contextMenu: true,
    originalEvent: event2,
    items: grid.initColumnOnOff()
  }).then(() => {
    query7("#w2overlay-context-menu .tsg-grid-skip").off(".tsg-grid").on("click.tsg-grid", (evt) => {
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
  const el = query7(`#grid_${grid.name}_column_${colIndex} .tsg-col-header`)[0];
  if (col["autoResize"] === false || col.hidden === true || !el) {
    return true;
  }
  const style = getComputedStyle(el);
  let maxWidth = TsUtils.getStrWidth(el.innerHTML, `font-family: ${style.fontFamily}; font-size: ${style.fontSize}`, true) + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight) + 4;
  query7(grid.box).find(`.tsg-grid-records td[col="${colIndex}"] > div`, grid.box).each((el2) => {
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
  query7(grid.box).removeClass("tsg-inactive").find(".tsg-inactive").removeClass("tsg-inactive");
  setTimeout(() => {
    const txt = query7(grid.box).find(`#grid_${grid.name}_focus`).get(0);
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
  query7(grid.box).addClass("tsg-inactive").find(".tsg-selected").addClass("tsg-inactive");
  query7(grid.box).find(".tsg-selection").addClass("tsg-inactive");
  edata.finish();
}
function keydown(grid, event2) {
  const obj = grid;
  const url = grid.url?.get ?? grid.url;
  if (obj.keyboard !== true) return;
  const edata = obj.trigger("keydown", { target: obj.name, originalEvent: event2 });
  if (edata.isCancelled === true) return;
  if (query7(grid.box).find(".tsg-message").length > 0) {
    if (event2.keyCode == 27) grid.message();
    return;
  }
  let empty = false;
  const records = query7(obj.box).find("#grid_" + obj.name + "_records");
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
  const recEL = query7(obj.box).find(`#grid_${obj.name}_rec_${ind >= 0 ? TsUtils.escapeId(obj.records[ind].recid) : "none"}`);
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
        const focus2 = query7(obj.box).find("#grid_" + obj.name + "_focus");
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
          const focus2 = query7(obj.box).find("#grid_" + obj.name + "_focus");
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
          const focus2 = query7(obj.box).find("#grid_" + obj.name + "_focus");
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
      const focus2 = query7(obj.box).find("#grid_" + obj.name + "_focus");
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
  const records = query7(grid.box).find(`#grid_${grid.name}_records`);
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
    if (tmp.tagName.toUpperCase() != "TD") tmp = query7(tmp).closest("td")[0];
    column = parseInt(query7(tmp).attr("col"));
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
    event2 = { offsetX: 0, offsetY: 0, target: query7(grid.box).find(`#grid_${grid.name}_rec_${recid}`)[0] };
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
    TsMenu3.show({
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
    if (query7(grid.box).find("#grid_" + grid.name + "_rec_" + id + "_expanded_row").length > 0 || grid.show.expandColumn !== true) return false;
    if (rec.TsUi.expanded == "none") return false;
    query7(grid.box).find("#grid_" + grid.name + "_rec_" + id).after(
      `<tr id="grid_${grid.name}_rec_${recid}_expanded_row" class="tsg-expanded-row">
                <td colspan="100" class="tsg-expanded2">
                    <div id="grid_${grid.name}_rec_${recid}_expanded"></div>
                </td>
                <td class="tsg-grid-data-last"></td>
            </tr>`
    );
    query7(grid.box).find("#grid_" + grid.name + "_frec_" + id).after(
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
      query7(grid.box).find("#grid_" + grid.name + "_rec_" + id + "_expanded_row").remove();
      query7(grid.box).find("#grid_" + grid.name + "_frec_" + id + "_expanded_row").remove();
      return false;
    }
    const row1 = query7(grid.box).find("#grid_" + grid.name + "_rec_" + recid + "_expanded");
    const row2 = query7(grid.box).find("#grid_" + grid.name + "_frec_" + recid + "_expanded");
    const innerHeight = row1.find(":scope div:first-child")[0]?.clientHeight ?? 50;
    if (row1[0].clientHeight < innerHeight) {
      row1.css({ height: innerHeight + "px" });
    }
    if (row2[0].clientHeight < innerHeight) {
      row2.css({ height: innerHeight + "px" });
    }
    query7(grid.box).find("#grid_" + grid.name + "_rec_" + id).attr("expanded", "yes").addClass("tsg-expanded");
    query7(grid.box).find("#grid_" + grid.name + "_frec_" + id).attr("expanded", "yes").addClass("tsg-expanded");
    query7(grid.box).find("#grid_" + grid.name + "_cell_" + grid.get(recid, true) + "_expand div").html("-");
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
    if (query7(grid.box).find("#grid_" + grid.name + "_rec_" + id + "_expanded_row").length === 0 || grid.show.expandColumn !== true) return false;
    edata = grid.trigger("collapse", {
      target: grid.name,
      recid,
      box_id: "grid_" + grid.name + "_rec_" + recid + "_expanded",
      fbox_id: "grid_" + grid.name + "_frec_" + recid + "_expanded"
    });
    if (edata.isCancelled === true) return false;
    query7(grid.box).find("#grid_" + grid.name + "_rec_" + id).removeAttr("expanded").removeClass("tsg-expanded");
    query7(grid.box).find("#grid_" + grid.name + "_frec_" + id).removeAttr("expanded").removeClass("tsg-expanded");
    query7(grid.box).find("#grid_" + grid.name + "_cell_" + grid.get(recid, true) + "_expand div").html("+");
    query7(grid.box).find("#grid_" + grid.name + "_rec_" + id + "_expanded").css("height", "0px");
    query7(grid.box).find("#grid_" + grid.name + "_frec_" + id + "_expanded").css("height", "0px");
    setTimeout(() => {
      query7(grid.box).find("#grid_" + grid.name + "_rec_" + id + "_expanded_row").remove();
      query7(grid.box).find("#grid_" + grid.name + "_frec_" + id + "_expanded_row").remove();
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
    query7(grid.box).find(`#grid_${grid.name}_records`).prop("scrollTop", 0);
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
var query8 = query;
var TsMenu4 = TsMenu;
var TsTooltip4 = TsTooltip;
function resize(grid) {
  const time = Date.now();
  if (!grid.box || query8(grid.box).attr("name") != grid.name) return;
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
      query8(cell).replace(self.getCellHTML(index, column, false));
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
  const cell = query8(grid.box).find(`${isSummary ? ".tsg-grid-summary " : ""}#grid_${grid.name}_data_${index}_${col_ind}`);
  if (cell.length == 0) return false;
  cell.replace(grid.getCellHTML(index, col_ind, isSummary));
  return true;
}
function refreshRow(grid, recid, ind = null) {
  let tr1 = query8(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(recid));
  let tr2 = query8(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(recid));
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
      tr1 = query8(grid.box).find("#grid_" + grid.name + "_frec_" + TsUtils.escapeId(recid));
      tr2 = query8(grid.box).find("#grid_" + grid.name + "_rec_" + TsUtils.escapeId(recid));
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
    query8(grid.box).find(`#grid_${grid.name}_header`).html(TsUtils.lang(grid.header) + "&#160;").show();
  } else {
    query8(grid.box).find(`#grid_${grid.name}_header`).hide();
  }
  if (grid.show.toolbar) {
    query8(grid.box).find("#grid_" + grid.name + "_toolbar").show();
  } else {
    query8(grid.box).find("#grid_" + grid.name + "_toolbar").hide();
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
  const sInput = query8(grid.box).find("#grid_" + grid.name + "_search_all");
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
    query8(grid.box).find(`#grid_${grid.name}_footer`).html(grid.getFooterHTML()).show();
  } else {
    query8(grid.box).find(`#grid_${grid.name}_footer`).hide();
  }
  const sel = grid.last.selection, areAllSelected = grid.records.length > 0 && sel.indexes.length == grid.records.length, areAllSearchedSelected = sel.indexes.length > 0 && grid.searchData.length !== 0 && sel.indexes.length == grid.last.searchIds.length;
  if (areAllSelected || areAllSearchedSelected) {
    query8(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", true);
  } else {
    query8(grid.box).find("#grid_" + grid.name + "_check_all").prop("checked", false);
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
          const el = query8(grid.box).find('td[col="' + item.col + '"]:not(.tsg-head)');
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
    if (query8(grid.box).find(".tsg-grid-searches").length == 0) {
      query8(grid.box).find(".tsg-grid-toolbar").css("height", grid.last.toolbar_height + 35 + "px").append(`<div id="grid_${grid.name}_searches" class="tsg-grid-searches"></div>`);
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
                <span class="tsg-icon">${chevronDownIcon()}</span>
            </span>`;
    });
    searches += `
            ${grid.show.searchSave ? `<div class="grid-search-line"></div>
                   <button class="tsg-btn grid-search-btn" data-click="searchSave" type="button">${TsUtils.lang("Save")}</button>
                  ` : ""}
            <button class="tsg-btn grid-search-btn btn-remove" type="button"
                data-click="searchReset">X</button>
        `;
    query8(grid.box).find(`#grid_${grid.name}_searches`).html(searches);
    query8(grid.box).find(`#grid_${grid.name}_search_logic`).html(TsUtils.lang(grid.last.logic == "AND" ? "All" : "Any"));
  } else {
    query8(grid.box).find(".tsg-grid-toolbar").css("height", grid.last.toolbar_height + "px").find(".tsg-grid-searches").remove();
  }
  if (grid["searchSelected"]) {
    query8(grid.box).find(`#grid_${grid.name}_search_all`).val(" ").prop("readOnly", true);
    query8(grid.box).find(`#grid_${grid.name}_search_name`).show().find(".name-text").html(grid["searchSelected"].text);
  } else {
    query8(grid.box).find(`#grid_${grid.name}_search_all`).prop("readOnly", false);
    query8(grid.box).find(`#grid_${grid.name}_search_name`).hide().find(".name-text").html("");
  }
  TsUtils.bindEvents(query8(grid.box).find(`#grid_${grid.name}_searches .tsg-action, #grid_${grid.name}_searches button`), grid);
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
  const gridBody = query8(grid.box).find(`#grid_${grid.name}_body`, grid.box).html(bodyHTML);
  const records = query8(grid.box).find(`#grid_${grid.name}_records`, grid.box);
  const frecords = query8(grid.box).find(`#grid_${grid.name}_frecords`, grid.box);
  if (grid.selectType == "row") {
    records.on("mouseover mouseout", { delegate: "tr" }, (event2) => {
      const ind = query8(event2.delegate).attr("index");
      const recid = grid.records[ind]?.recid;
      query8(grid.box).find(`#grid_${grid.name}_frec_${TsUtils.escapeId(recid)}`).toggleClass("tsg-record-hover", event2.type == "mouseover");
    });
    frecords.on("mouseover mouseout", { delegate: "tr" }, (event2) => {
      const ind = query8(event2.delegate).attr("index");
      const recid = grid.records[ind]?.recid;
      query8(grid.box).find(`#grid_${grid.name}_rec_${TsUtils.escapeId(recid)}`).toggleClass("tsg-record-hover", event2.type == "mouseover");
    });
  }
  if (TsUtils.isMobile) {
    records.append(frecords).on("click", { delegate: "tr" }, (event2) => {
      const index = query8(event2.delegate).attr("index");
      const recid = grid.records[index]?.recid;
      grid.click(recid, event2);
    }).on("touchstart", { delegate: "tr" }, (event2) => {
      const index = query8(event2.delegate).attr("index");
      const recid = grid.records[index]?.recid;
      if (grid.last["mobile_touch"] && Date.now() - grid.last["mobile_touch"] < 350) {
        event2.preventDefault();
        grid.dblClick(recid, event2);
      }
      grid.last["mobile_touch"] = Date.now();
      setTimeout(() => grid.last["mobile_touch"] = null, 350);
    }).on("contextmenu", { delegate: "tr" }, (event2) => {
      const index = parseInt(query8(event2.delegate).attr("index"));
      const recid = grid.records[index]?.recid;
      const td = query8(event2.target).closest("td");
      const column = td.attr("col") ? parseInt(td.attr("col")) : void 0;
      const ctxOpts = { index };
      if (recid != null) ctxOpts.recid = recid;
      if (column != null) ctxOpts.column = column;
      grid.showContextMenu(event2, ctxOpts);
    });
  } else {
    records.add(frecords).on("click", { delegate: "tr" }, (event2) => {
      const index = query8(event2.delegate).attr("index");
      const recid = grid.records[index]?.recid;
      if (recid != "-none-" && !grid.last.inEditMode) {
        grid.click(recid, event2);
      }
    }).on("contextmenu", { delegate: "tr" }, (event2) => {
      const index = parseInt(query8(event2.delegate).attr("index"));
      const recid = grid.records[index]?.recid;
      const td = query8(event2.target).closest("td");
      const column = td.attr("col") ? parseInt(td.attr("col")) : void 0;
      const ctxOpts = { index };
      if (recid != null) ctxOpts.recid = recid;
      if (column != null) ctxOpts.column = column;
      grid.showContextMenu(event2, ctxOpts);
    }).on("mouseover", { delegate: "tr" }, (event2) => {
      grid.last["rec_out"] = false;
      const index = query8(event2.delegate).attr("index");
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
      const index = query8(event2.delegate).attr("index");
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
  query8(grid.box).find(".tsg-grid-body").off(".body-global").on("click.body-global dblclick.body-global contextmenu.body-global", { delegate: "td.tsg-head" }, (event2) => {
    const col_ind = parseInt(query8(event2.delegate).attr("col"));
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
    const col = query8(event2.delegate).parent().attr("col");
    grid.columnTooltipShow(col, event2);
    query8(event2.delegate).off(".tooltip").on("mouseleave.tooltip", () => {
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
    const ind = query8(event2.target).parents("tr").attr("index");
    grid.toggle(grid.records[ind].recid);
  }).on("click.body-global mouseover.body-global", { delegate: ".tsg-info" }, (event2) => {
    const td = query8(event2.delegate).closest("td");
    const tr = td.parent();
    const col = grid.columns[td.attr("col")];
    const isSummary = tr.parents(".tsg-grid-body").hasClass("tsg-grid-summary");
    if (["mouseenter", "mouseover"].includes(col?.["info"]?.showOn?.toLowerCase()) && event2.type == "mouseover") {
      grid.showBubble(parseInt(tr.attr("index")), parseInt(td.attr("col")), isSummary).then(() => {
        query8(event2.delegate).off(".tooltip").on("mouseleave.tooltip", () => {
          TsTooltip4.hide(grid.name + "-bubble");
        });
      });
    } else if (event2.type == "click") {
      TsTooltip4.hide(grid.name + "-bubble");
      grid.showBubble(parseInt(tr.attr("index")), parseInt(td.attr("col")), isSummary);
    }
  }).on("mouseover.body-global", { delegate: ".tsg-clipboard-copy" }, (event2) => {
    if (event2.delegate._tooltipShow) return;
    const td = query8(event2.delegate).parent();
    const tr = td.parent();
    const col = grid.columns[td.attr("col")];
    const isSummary = tr.parents(".tsg-grid-body").hasClass("tsg-grid-summary");
    TsTooltip4.show({
      name: grid.name + "-bubble",
      anchor: event2.delegate,
      html: TsUtils.lang(typeof col?.clipboardCopy == "string" ? col.clipboardCopy : "Copy to clipboard"),
      position: "top|bottom",
      offsetY: -2
    });
    query8(event2.delegate).off(".tooltip").on("mouseleave.tooltip", (_evt) => {
      TsTooltip4.hide(grid.name + "-bubble");
    }).on("click.tooltip", (evt) => {
      evt.stopPropagation();
      TsTooltip4.update(grid.name + "-bubble", TsUtils.lang("Copied"));
      grid.clipboardCopy(tr.attr("index"), td.attr("col"), isSummary);
    });
    event2.delegate._tooltipShow = true;
  }).on("click.body-global", { delegate: ".tsg-editable-checkbox" }, (event2) => {
    const dt = query8(event2.delegate).data();
    grid.editChange.call(grid, event2.delegate, dt.changeind, dt.colind, event2);
    grid.updateToolbar();
  });
  if (grid.records.length === 0 && grid.msgEmpty) {
    query8(grid.box).find(`#grid_${grid.name}_body`).append(`<div id="grid_${grid.name}_empty_msg" class="tsg-grid-empty-msg"><div>${TsUtils.lang(grid.msgEmpty)}</div></div>`);
  } else if (query8(grid.box).find(`#grid_${grid.name}_empty_msg`).length > 0) {
    query8(grid.box).find(`#grid_${grid.name}_empty_msg`).remove();
  }
  if (grid.summary.length > 0) {
    const sumHTML = grid.getSummaryHTML();
    query8(grid.box).find(`#grid_${grid.name}_fsummary`).html(sumHTML?.[0] ?? "").show();
    query8(grid.box).find(`#grid_${grid.name}_summary`).html(sumHTML?.[1] ?? "").show();
  } else {
    query8(grid.box).find(`#grid_${grid.name}_fsummary`).hide();
    query8(grid.box).find(`#grid_${grid.name}_summary`).hide();
  }
}
function destroy(grid) {
  const edata = grid.trigger("destroy", { target: grid.name });
  if (edata.isCancelled === true) return;
  grid.toolbar?.destroy?.();
  if (query8(grid.box).find(`#grid_${grid.name}_body`).length > 0) {
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
    items.push({ id: "tsg-skip", text: skip, group: false, icon: emptyIcon() });
  }
  if (grid.show.saveRestoreState) {
    items.push(
      { id: "tsg-stateSave", text: TsUtils.lang("Save Grid State"), icon: emptyIcon(), group: false },
      { id: "tsg-stateReset", text: TsUtils.lang("Restore Default State"), icon: emptyIcon(), group: false }
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
      if (query8(target).closest(".tsg-head").hasClass(iClass[i])) {
        return true;
      }
    }
    return false;
  };
  query8(self.box).off(".colDrag").on("mousedown.colDrag", dragColStart);
  function dragColStart(event2) {
    if (dragData.pressed || dragData["numberPreColumnsPresent"] === 0 || event2.button !== 0) return;
    const preColHeadersSelector = ".tsg-head.tsg-col-number, .tsg-head.tsg-col-expand, .tsg-head.tsg-col-select";
    if (!query8(event2.target).parents().hasClass("tsg-head") || hasInvalidClass(event2.target)) return;
    dragData.pressed = true;
    dragData["initialX"] = event2.pageX;
    dragData["initialY"] = event2.pageY;
    dragData["numberPreColumnsPresent"] = query8(self.box).find(preColHeadersSelector).length;
    const origColumn = dragData.columnHead = query8(event2.target).closest(".tsg-head");
    const origColumnNumber = dragData["originalPos"] = parseInt(origColumn.attr("col"), 10);
    const edata = self.trigger("columnDragStart", { originalEvent: event2, origColumnNumber, target: origColumn[0] });
    if (edata.isCancelled === true) return false;
    const columns = dragData["columns"] = query8(self.box).find(".tsg-head:not(.tsg-head-last)");
    query8(document).on("mouseup.colDrag", dragColEnd);
    query8(document).on("mousemove.colDrag", dragColOver);
    const col = self.columns[dragData["originalPos"]];
    const colText = TsUtils.lang(typeof col.text == "function" ? col.text(col) : col.text);
    dragData["ghost"] = query.html(`<span col="${dragData["originalPos"]}">${colText}</span>`)[0];
    query8(document.body).append(dragData["ghost"]);
    query8(dragData["ghost"]).css({
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
      const ghosts = query8(self.box).find(".tsg-grid-ghost");
      query8(self.box).find(".tsg-intersection-marker").hide();
      query8(dragData["ghost"]).remove();
      ghosts.remove();
      query8(document).off(".colDrag");
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
    if (query8(event2.target).closest("td").length == 0) {
      return;
    }
    const td = query8(event2.target).closest("td");
    const newPos = td.hasClass("tsg-head-last") ? self.columns.length : parseInt(td.attr("col"));
    if (dragData.targetPos != newPos) {
      const rect1 = query8(self.box).find(".tsg-grid-body").get(0).getBoundingClientRect();
      const rect2 = query8(event2.target).closest("td").get(0).getBoundingClientRect();
      query8(self.box).find(".tsg-intersection-marker").show().css({
        left: rect2.left - rect1.left + "px",
        height: rect2.height + "px"
      });
      dragData.targetPos = newPos;
    }
    return;
  }
  function trackGhost(cursorX, cursorY) {
    query8(dragData["ghost"]).css({
      left: cursorX - 10 + "px",
      top: cursorY - 10 + "px"
    }).show();
  }
  return {
    remove() {
      query8(self.box).off(".colDrag");
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
                    <span class="name-icon tsg-icon">${searchIcon()}</span>
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
                    <span class="tsg-icon">${dropIcon()}</span>
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
        const input = query8(grid.box).find(`#grid_${grid.name}_search_all`);
        TsUtils.bindEvents(query8(grid.box).find(`#grid_${grid.name}_search_all, .tsg-action`), grid);
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
              TsMenu4.hide(grid.name + "-search-suggest");
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
            query8(`#w2overlay-${grid.name}_toolbar-drop .tsg-grid-skip`).off(".tsg-grid").on("click.tsg-grid", (evt) => {
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
  query8(grid.box).find(".tsg-resizer").off(".grid-col-resize").on("click.grid-col-resize", function(event2) {
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
      col: parseInt(query8(this).attr("name"))
      // 'this' is the DOM element
    };
    obj.last.tmp.tds = query8(obj.box).find("#grid_" + obj.name + '_body table tr:first-child td[col="' + obj.last.tmp.col + '"]');
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
      query8(document).off(".grid-col-resize");
      obj.resizeRecords();
      obj.scroll();
      edata.finish({ originalEvent: event3 });
      setTimeout(() => {
        obj.last.colResizing = false;
      }, 1);
    };
    query8(document).off(".grid-col-resize").on("mousemove.grid-col-resize", mouseMove).on("mouseup.grid-col-resize", mouseUp);
  }).on("dblclick.grid-col-resize", function(event2) {
    const ind = parseInt(query8(this).attr("name"));
    obj.columnAutoSize(ind);
    event2.stopPropagation();
    event2.preventDefault();
  }).each((el) => {
    const td = query8(el).get(0).parentNode;
    query8(el).css({
      "height": td.clientHeight + "px",
      "margin-left": td.clientWidth - 3 + "px"
    });
  });
}
function resizeBoxes(grid) {
  const header = query8(grid.box).find(`#grid_${grid.name}_header`);
  const toolbar = query8(grid.box).find(`#grid_${grid.name}_toolbar`);
  const fsummary = query8(grid.box).find(`#grid_${grid.name}_fsummary`);
  const summary = query8(grid.box).find(`#grid_${grid.name}_summary`);
  const footer = query8(grid.box).find(`#grid_${grid.name}_footer`);
  const body = query8(grid.box).find(`#grid_${grid.name}_body`);
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
  query8(grid.box).find(".tsg-empty-record").remove();
  const box = query8(grid.box);
  const gridEl = query8(grid.box).find(":scope > div.tsg-grid-box");
  const header = query8(grid.box).find(`#grid_${grid.name}_header`);
  const toolbar = query8(grid.box).find(`#grid_${grid.name}_toolbar`);
  const summary = query8(grid.box).find(`#grid_${grid.name}_summary`);
  const fsummary = query8(grid.box).find(`#grid_${grid.name}_fsummary`);
  const footer = query8(grid.box).find(`#grid_${grid.name}_footer`);
  const body = query8(grid.box).find(`#grid_${grid.name}_body`);
  const columns = query8(grid.box).find(`#grid_${grid.name}_columns`);
  const fcolumns = query8(grid.box).find(`#grid_${grid.name}_fcolumns`);
  const records = query8(grid.box).find(`#grid_${grid.name}_records`);
  const frecords = query8(grid.box).find(`#grid_${grid.name}_frecords`);
  const scroll1 = query8(grid.box).find(`#grid_${grid.name}_scroll1`);
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
  if (body[0]?.clientHeight - (columns[0]?.clientHeight ?? 0) < (query8(records).find(":scope > table")[0]?.clientHeight ?? 0) + (bodyOverflowX ? TsUtils.scrollBarSize() : 0)) {
    bodyOverflowY = true;
  }
  if (!grid.fixedBody) {
    const bodyHeight = TsUtils.getSize(columns, "height") + TsUtils.getSize(query8(grid.box).find("#grid_" + grid.name + "_records table"), "height") + (bodyOverflowX ? TsUtils.scrollBarSize() : 0);
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
    query8(grid2.box).find("#grid_" + grid2.name + "_frecords > table").append(html1);
    query8(grid2.box).find("#grid_" + grid2.name + "_records > table").append(html2);
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
    if (query8(el).hasClass("tsg-col-number")) {
      query8(el).css("width", lineNumberWidth + "px");
    }
    const ind = query8(el).attr("col");
    if (ind != null) {
      if (ind == "start") {
        let width = 0;
        for (let i = 0; i < (obj.last.vscroll.colIndStart ?? 0); i++) {
          if (!obj.columns[i] || obj.columns[i].frozen || obj.columns[i].hidden) continue;
          width += parseInt(obj.columns[i].sizeCalculated ?? "0");
        }
        query8(el).css("width", width + "px");
      }
      if (obj.columns[ind]) query8(el).css("width", obj.columns[ind].sizeCalculated ?? "");
    }
    if (query8(el).hasClass("tsg-head-last")) {
      if ((obj.last.vscroll.colIndEnd ?? 0) + 1 < obj.columns.length) {
        let width = 0;
        for (let i = (obj.last.vscroll.colIndEnd ?? 0) + 1; i < obj.columns.length; i++) {
          if (!obj.columns[i] || obj.columns[i].frozen || obj.columns[i].hidden) continue;
          width += parseInt(obj.columns[i].sizeCalculated ?? "0");
        }
        query8(el).css("width", width + "px");
      } else {
        query8(el).css("width", TsUtils.scrollBarSize() + (width_diff > 0 && percent === 0 ? width_diff : 0) + "px");
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
    if (query8(el).hasClass("tsg-col-number")) {
      query8(el).css("width", lineNumberWidth + "px");
    }
    const ind = query8(el).attr("col");
    if (ind != null) {
      if (ind == "start") {
        let width = 0;
        for (let i = 0; i < (obj.last.vscroll.colIndStart ?? 0); i++) {
          if (!obj.columns[i] || obj.columns[i].frozen || obj.columns[i].hidden) continue;
          width += parseInt(obj.columns[i].sizeCalculated ?? "0");
        }
        query8(el).css("width", width + "px");
      }
      if (obj.columns[ind]) query8(el).css("width", obj.columns[ind].sizeCalculated ?? "");
    }
    if (query8(el).hasClass("tsg-grid-data-last") && query8(el).parents(".tsg-grid-frecords").length === 0) {
      if ((obj.last.vscroll.colIndEnd ?? 0) + 1 < obj.columns.length) {
        let width = 0;
        for (let i = (obj.last.vscroll.colIndEnd ?? 0) + 1; i < obj.columns.length; i++) {
          if (!obj.columns[i] || obj.columns[i].frozen || obj.columns[i].hidden) continue;
          width += parseInt(obj.columns[i].sizeCalculated ?? "0");
        }
        query8(el).css("width", width + "px");
      } else {
        query8(el).css("width", (width_diff > 0 && percent === 0 ? width_diff : 0) + "px");
      }
    }
  });
  summary.find(":scope > table > tbody > tr:nth-child(1) td").add(fsummary.find(":scope > table > tbody > tr:nth-child(1) td")).each((el) => {
    if (query8(el).hasClass("tsg-col-number")) {
      query8(el).css("width", lineNumberWidth + "px");
    }
    const ind = query8(el).attr("col");
    if (ind != null) {
      if (ind == "start") {
        let width = 0;
        for (let i = 0; i < (obj.last.vscroll.colIndStart ?? 0); i++) {
          if (!obj.columns[i] || obj.columns[i].frozen || obj.columns[i].hidden) continue;
          width += parseInt(obj.columns[i].sizeCalculated ?? "0");
        }
        query8(el).css("width", width + "px");
      }
      if (obj.columns[ind]) query8(el).css("width", obj.columns[ind].sizeCalculated ?? "");
    }
    if (query8(el).hasClass("tsg-grid-data-last") && query8(el).parents(".tsg-grid-frecords").length === 0) {
      query8(el).css("width", TsUtils.scrollBarSize() + (width_diff > 0 && percent === 0 ? width_diff : 0) + "px");
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
  const $el = query8(grid.box).find("#grid_" + grid.name + "_column_" + ind);
  const item = grid.columns[ind];
  const pos = grid.columnTooltip;
  TsTooltip4.show({
    name: grid.name + "-column-tooltip",
    anchor: $el.get(0),
    html: item?.tooltip,
    position: pos
  });
}
function columnTooltipHide(grid, _ind, _event) {
  TsTooltip4.hide(grid.name + "-column-tooltip");
}
function getRecordsHTML(grid) {
  let buffered = grid.records.length;
  const url = grid.url?.get ?? grid.url;
  if (grid.searchData.length != 0 && !url) buffered = grid.last.searchIds.length;
  if (buffered > grid.vs_start) grid.last.vscroll.show_extra = grid.vs_extra;
  else grid.last.vscroll.show_extra = grid.vs_start;
  const records = query8(grid.box).find(`#grid_${grid.name}_records`);
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
        infoBubble += `<span class="tsg-show-children tsg-icon">${emptyIcon()}</span>`;
      }
    }
    if (record.TsUi?.children?.length > 0) {
      const expandCollapseIcon = record.TsUi.expanded ? collapseIcon() : expandIcon();
      infoBubble += `<span class="tsg-show-children tsg-icon">${expandCollapseIcon}</span>`;
    }
  }
  if (col["info"] === true) col["info"] = {};
  if (col["info"] != null) {
    let infoIconContent = infoIcon();
    if (typeof col["info"].icon == "function") {
      infoIconContent = col["info"].icon(record, { self: grid, index: ind, colIndex: col_ind, summary: !!summary });
    } else if (typeof col["info"].icon == "object") {
      infoIconContent = col["info"].icon[grid.parseField(record, col.field)] || "";
    } else if (typeof col["info"].icon == "string") {
      infoIconContent = col["info"].icon;
    }
    let infoStyle = col["info"].style || "";
    if (typeof col["info"].style == "function") {
      infoStyle = col["info"].style(record, { self: grid, index: ind, colIndex: col_ind, summary: !!summary });
    } else if (typeof col["info"].style == "object") {
      infoStyle = col["info"].style[grid.parseField(record, col.field)] || "";
    } else if (typeof col["info"].style == "string") {
      infoStyle = col["info"].style;
    }
    const infoIconHtml = String(infoIconContent).trim().startsWith("<") ? `<span class="tsg-info" style="${infoStyle}">${infoIconContent}</span>` : `<span class="tsg-info ${infoIconContent}" style="${infoStyle}"></span>`;
    infoBubble += infoIconHtml;
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
    clipboardIcon = `<span class="tsg-clipboard-copy tsg-icon">${pasteIcon()}</span>`;
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
  query8(grid.box).find("#grid_" + grid.name + "_focus").text(txt).get(0).select();
  document.execCommand("copy");
}
function showBubble(grid, ind, col_ind, summary) {
  const info = grid.columns[col_ind]?.["info"];
  if (!info) return;
  let html = "";
  const rec = grid.records[ind];
  const el = query8(grid.box).find(`${summary ? ".tsg-grid-summary" : ""} #grid_${grid.name}_data_${ind}_${col_ind} .tsg-info`);
  if (grid.last.bubbleEl) {
    TsTooltip4.hide(grid.name + "-bubble");
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
  return TsTooltip4.show(TsUtils.extend({
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
  const records = query8(grid.box).find(`#grid_${grid.name}_records`);
  const frecords = query8(grid.box).find(`#grid_${grid.name}_frecords`);
  if (event2) {
    const sTop = event2.target.scrollTop;
    const sLeft = event2.target.scrollLeft;
    grid.last.vscroll.scrollTop = sTop;
    grid.last.vscroll.scrollLeft = sLeft;
    const cols = query8(grid.box).find(`#grid_${grid.name}_columns`)[0];
    const summary = query8(grid.box).find(`#grid_${grid.name}_summary`)[0];
    if (cols) cols.scrollLeft = sLeft;
    if (summary) summary.scrollLeft = sLeft;
    if (frecords[0]) frecords[0].scrollTop = sTop;
  }
  if (grid.last.bubbleEl) {
    TsTooltip4.hide(grid.name + "-bubble");
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
      const $box = query8(grid.box);
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
              const index = query8(el).parent().attr("index");
              let td = '<td class="tsg-grid-data" col="' + i + '" style="height: 0px"></td>';
              if (index != null) td = grid.getCellHTML(parseInt(index), i, false);
              query8(el).after(td);
            });
            $sfirst.each((el) => {
              const index = query8(el).parent().attr("index");
              let td = '<td class="tsg-grid-data" col="' + i + '" style="height: 0px"></td>';
              if (index != null) td = grid.getCellHTML(parseInt(index), i, true);
              query8(el).after(td);
            });
          }
        }
        if (colEnd > grid.last.vscroll.colIndEnd) {
          for (let i = (grid.last.vscroll.colIndEnd ?? 0) + 1; i <= colEnd; i++) {
            if (grid.columns[i] && (grid.columns[i].frozen || grid.columns[i].hidden)) continue;
            $clast.before(grid.getColumnCellHTML(i));
            $rlast.each((el) => {
              const index = query8(el).parent().attr("index");
              let td = '<td class="tsg-grid-data" col="' + i + '" style="height: 0px"></td>';
              if (index != null) td = grid.getCellHTML(parseInt(index), i, false);
              query8(el).before(td);
            });
            $slast.each((el) => {
              const index = query8(el).parent().attr("index") || -1;
              const td = grid.getCellHTML(parseInt(index), i, true);
              query8(el).before(td);
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
  query8(grid.box).find("#grid_" + grid.name + "_footer .tsg-footer-right").html(
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
    const more = query8(grid.box).find("#grid_" + grid.name + "_rec_more, #grid_" + grid.name + "_frec_more");
    more.show().eq(1).off(".load-more").on("click.load-more", function() {
      query8(this).find("td").html('<div><div style="width: 20px; height: 20px;" class="tsg-spinner"></div></div>');
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
          const el = query8(obj.box).find('td[col="' + item.col + '"]:not(.tsg-head)');
          TsUtils.marker(el, item.search);
        });
      }
    }, 50);
  }
}

// src/tsgrid.ts
var query9 = query;
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
      "reload": { type: "button", id: "tsg-reload", icon: reloadIcon(), tooltip: TsUtils.lang("Reload data in the list") },
      "columns": {
        type: "menu-check",
        id: "tsg-column-on-off",
        icon: columnsIcon(),
        tooltip: TsUtils.lang("Show/hide columns"),
        overlay: { align: "none" }
      },
      "search": {
        type: "html",
        id: "tsg-search",
        html: `<div class="tsg-icon tsg-search-down tsg-action" data-click="searchShowFields">${searchIcon()}</div>`
      },
      "add": { type: "button", id: "tsg-add", text: "Add New", tooltip: TsUtils.lang("Add new record"), icon: plusIcon() },
      "edit": { type: "button", id: "tsg-edit", text: "Edit", tooltip: TsUtils.lang("Edit selected record"), icon: pencilIcon(), batch: 1, disabled: true },
      "delete": { type: "button", id: "tsg-delete", text: "Delete", tooltip: TsUtils.lang("Delete selected records"), icon: crossIcon(), batch: true, disabled: true },
      "save": { type: "button", id: "tsg-save", text: "Save", tooltip: TsUtils.lang("Save changed records"), icon: checkIcon() }
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
        search2.icon ??= searchIcon();
      });
    }
    const data = this.cache("searches");
    if (Array.isArray(data)) {
      data.forEach((search2) => {
        this.savedSearches.push({
          id: search2.id ?? "none",
          text: search2.text ?? "none",
          icon: searchIcon(),
          remove: true,
          logic: search2.logic ?? "AND",
          data: search2.data ?? []
        });
      });
    }
    this.initToolbar();
    if (typeof this.box == "string") this.box = query9(this.box).get(0);
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
          query9(this.box).find("#grid_" + this.name + "_rec_more, #grid_" + this.name + "_frec_more").hide();
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
    query9(this.box).attr("name", this.name).addClass("tsg-reset tsg-grid tsg-inactive").html('<div class="tsg-grid-box">    <div id="grid_' + this.name + '_header" class="tsg-grid-header"></div>    <div id="grid_' + this.name + '_toolbar" class="tsg-grid-toolbar"></div>    <div id="grid_' + this.name + '_body" class="tsg-grid-body"></div>    <div id="grid_' + this.name + '_fsummary" class="tsg-grid-body tsg-grid-summary"></div>    <div id="grid_' + this.name + '_summary" class="tsg-grid-body tsg-grid-summary"></div>    <div id="grid_' + this.name + '_footer" class="tsg-grid-footer"></div>    <textarea id="grid_' + this.name + '_focus" class="tsg-grid-focus-input" ' + (this.tabIndex ? 'tabindex="' + this.tabIndex + '"' : "") + (TsUtils.isMobile ? "readonly" : "") + "></textarea></div>");
    if (this.selectType != "row") query9(this.box).addClass("tsg-ss");
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
        TsUi[this.name].paste(items2send, event2);
        event2.preventDefault();
      }
    }).on("keydown", function(event2) {
      ;
      TsUi[obj.name].keydown.call(TsUi[obj.name], event2);
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
        query9(obj.box).find(".tsg-grid-body").css("user-select", "none");
      }
      if (obj.selectType == "row" && (query9(event2.target).parents().hasClass("tsg-head") || query9(event2.target).hasClass("tsg-head"))) return;
      if (obj.last.move && obj.last.move.type == "expand") return;
      if (event2.altKey) {
        query9(obj.box).find(".tsg-grid-body").css("user-select", "text");
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
            class: "tsg-selection-preview"
          });
        }
        const target = event2.target;
        const $input = query9(obj.box).find("#grid_" + obj.name + "_focus");
        if (obj.last.move) {
          let sLeft = obj.last.move.focusX;
          let sTop = obj.last.move.focusY;
          const $owner = query9(target).parents("table").parent();
          if ($owner.hasClass("tsg-grid-records") || $owner.hasClass("tsg-grid-frecords") || $owner.hasClass("tsg-grid-columns") || $owner.hasClass("tsg-grid-fcolumns") || $owner.hasClass("tsg-grid-summary")) {
            sLeft = obj.last.move.focusX - query9(obj.box).find("#grid_" + obj.name + "_records").prop("scrollLeft");
            sTop = obj.last.move.focusY - query9(obj.box).find("#grid_" + obj.name + "_records").prop("scrollTop");
          }
          if (query9(target).hasClass("tsg-grid-footer") || query9(target).parents("div.tsg-grid-footer").length > 0) {
            sTop = query9(obj.box).find("#grid_" + obj.name + "_footer").get(0).offsetTop;
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
        if (el.tagName.toUpperCase() != "TD") el = query9(el).parents("td")[0];
        if (query9(el).hasClass("tsg-col-number") || query9(el).hasClass("tsg-col-order")) {
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
          const eColor = query9(obj.box).find(".tsg-even.tsg-empty-record").css("background-color");
          const oColor = query9(obj.box).find(".tsg-odd.tsg-empty-record").css("background-color");
          query9(obj.box).find(".tsg-even td").filter(":not(.tsg-col-number)").css("background-color", eColor);
          query9(obj.box).find(".tsg-odd td").filter(":not(.tsg-col-number)").css("background-color", oColor);
          const mv = obj.last.move;
          const recs = query9(obj.box).find(".tsg-grid-records");
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
              row.append(`<td colspan="1000"><div class="tsg-reorder-empty" style="height: ${obj.recordHeight - 2}px"></div></td>`);
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
      query9(document).on("mousemove.tsg-" + obj.name, mouseMove).on("mouseup.tsg-" + obj.name, mouseStop);
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
          query9(obj.box).find(".tsg-grid-columns .tsg-col-header, .tsg-grid-fcolumns .tsg-col-header").removeClass("tsg-col-selected");
          query9(obj.box).find(".tsg-col-number").removeClass("tsg-row-selected");
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
      if (query9(event2.target).parents().hasClass(".tsg-head") || query9(event2.target).hasClass(".tsg-head")) return;
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
            query9(obj.box).find(`#grid_${obj.name}_columns .tsg-col-header`).removeClass("tsg-col-sorted");
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
      query9(document).off(".tsg-" + obj.name);
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
    return lock(this, msg, showSpinner);
  }
  unlock(speed) {
    return unlock(this, speed);
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
export {
  TsGrid
};
//# sourceMappingURL=grid.es6.js.map