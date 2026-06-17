(function () {
  "use strict";

  function $(id) {
    return document.getElementById(id);
  }

  function val(id) {
    const el = $(id);
    return el ? el.value : "";
  }

  function num(id) {
    return parseFloat(val(id)) || 0;
  }

  function text(id, value) {
    const el = $(id);
    if (el) el.textContent = value;
  }

  function html(id, value) {
    const el = $(id);
    if (el) el.innerHTML = value;
  }

  function show(id) {
    const el = $(id);
    if (el) el && (el.style.display = "block");
  }

  function hide(id) {
    const el = $(id);
    el && (el.style.display = "none");
  }

  function onReady(fn) {
    document.addEventListener("DOMContentLoaded", fn);
  }

  function copy(value) {
    return navigator.clipboard.writeText(value || "");
  }

  window.UtiliWeb = {
    $,
    val,
    num,
    text,
    html,
    show,
    hide,
    onReady,
    copy
  };

})();
