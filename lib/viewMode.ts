export type ViewMode = "mobile" | "desktop";

export const VIEW_MODE_STORAGE_KEY = "aifeiler-view-mode-v2";

export const VIEW_MODE_INIT_SCRIPT = `
(function () {
  try {
    var saved = sessionStorage.getItem('${VIEW_MODE_STORAGE_KEY}');
    var mode = saved === 'mobile' || saved === 'desktop'
      ? saved
      : (window.innerWidth >= 768 ? 'desktop' : 'mobile');
    document.documentElement.dataset.viewMode = mode;
  } catch (_) {
    document.documentElement.dataset.viewMode = window.innerWidth >= 768 ? 'desktop' : 'mobile';
  }
})();`;
