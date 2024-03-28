// my keyboard shortcut: shift + fn + ctrl + down

(function () {
  var windows = app.layoutWindows;
  var activeWindow = app.activeWindow;
  if (windows.length < 1 || !activeWindow.isValid || activeWindow.constructor.name !== "LayoutWindow") return;
  var currentPage = activeWindow.activePage;
  if (!currentPage) return;
  var spreadIndex = currentPage.parent.index;
  for (var i = 0; i < windows.length; i++) {
    try {
      var window = windows[i];
      var doc = window.parent;
      var spread = doc.spreads[spreadIndex + 1];
      window.activeSpread = spread;
      window.zoom(ZoomOptions.SHOW_PASTEBOARD);
    } catch (_) {}
  }
})();

/*
    // zoom options:
ZoomOptions.ACTUAL_SIZE
ZoomOptions.FIT_PAGE
ZoomOptions.FIT_SPREAD
ZoomOptions.SHOW_PASTEBOARD
ZoomOptions.ZOOM_IN
ZoomOptions.ZOOM_OUT
*/
