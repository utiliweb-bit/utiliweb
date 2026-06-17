/* =========================
   UTILIWEB ENGINE v1
   ZERO SILENT FAILS
========================= */

const UI = {
    el(id) {
        return document.getElementById(id);
    },

    setText(id, value) {
        const el = this.el(id);
        if (!el) {
            console.warn(`[UI] Elemento não encontrado: ${id}`);
            return;
        }
        el.textContent = value;
    },

    setHTML(id, value) {
        const el = this.el(id);
        if (!el) {
            console.warn(`[UI] Elemento não encontrado: ${id}`);
            return;
        }
        el.innerHTML = value;
    },

    show(id) {
        const el = this.el(id);
        if (!el) return;
        el.style.display = "block";
    },

    hide(id) {
        const el = this.el(id);
        if (!el) return;
        el.style.display = "none";
    },

    toggle(id, state) {
        const el = this.el(id);
        if (!el) return;
        el.style.display = state ? "block" : "none";
    },

    value(id) {
        const el = this.el(id);
        return el ? el.value : null;
    }
};

/* =========================
   SAFE EVENT HANDLER
========================= */
function onClick(fn) {
    return function (event) {
        try {
            fn(event);
        } catch (err) {
            console.error("[UI ERROR]", err);
        }
    };
}

/* =========================
   SAFE STORAGE
========================= */
const Store = {
    get(key, fallback = []) {
        try {
            return JSON.parse(localStorage.getItem(key)) || fallback;
        } catch {
            return fallback;
        }
    },

    set(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};
