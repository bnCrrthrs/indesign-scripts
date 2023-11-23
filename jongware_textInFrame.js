// from Jongware:
//https://creativepro.com/topic/keyboard-shortcut-to-for-edit-text-of-selected-frame/#post-14324135

(function () {
  if (app.documents.length == 0) return;

  if (app.selection.length != 0) {
    insertCursor();
  } else {
    selectFirstTextFrame();
  }

  function selectFirstTextFrame() {
    try {
      var window = app.activeWindow;
      var page = window.activePage;
      var allFrames = page.textFrames;

      for (var i = allFrames.length - 1; i >= 0; i--) {
        var frame = allFrames[i];
        var layer = frame.itemLayer;
        if (layer.locked || frame.locked || !layer.visible || !frame.visible) continue;
        frame.select(SelectionOptions.REPLACE_WITH);
        break;
      }
    } catch (_) {
      // beep beep
    }
  }

  function insertCursor() {
    try {
      app.selection[0].texts[0].insertionPoints[0].select();
    } catch (_) {
      selectFirstTextFrame();
    }
  }
})();

// ORIGINAL FROM JONGWARE:
/*
  try {
    app.selection[0].texts[0].insertionPoints[0].select();
  } catch (_) {
    // beep beep
  }
*/

// SELECTING ALL TEXT IN FRAME WOULD BE:
/*
  try {
    app.selection[0].texts[0].select();
  } catch (_)
  {
    // beep beep
  }
*/
