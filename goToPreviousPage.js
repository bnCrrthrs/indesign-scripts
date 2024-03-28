// my keyboard shortcut: shift + fn + ctrl + up

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
      var spread = doc.spreads[spreadIndex - 1];
      window.activeSpread = spread;
      window.zoom(ZoomOptions.SHOW_PASTEBOARD);
    } catch (_) {}
  }
})();
