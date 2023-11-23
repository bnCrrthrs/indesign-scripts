(function () {
  var windows = app.layoutWindows;
  if (windows.length < 1) return;
  var goTo = prompt('Go to page', '');
  for (var i = 0; i < windows.length; i++) {
    try {
      var window = windows[i];
      var doc = window.parent;
      var page = doc.pages[+goTo - 1];
      window.activePage = page;
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
