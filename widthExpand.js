// this will calculate 10 times the cursor key increment setting from your preferences
// (this is the distance an object will move if you use SHIFT and the arrow keys)
// it will then increase the width of each selected object by that much

// my keyboard shortcut: fn + ctrl + opt + cmd + right

app.doScript(
  function () {
    if (app.documents.length === 0 || app.activeDocument.pageItems.length === 0 || app.selection.length === 0) {
      return;
    }

    var keyInc = 10 * app.activeDocument.viewPreferences.cursorKeyIncrement;
    //thanks to this link : https://indisnip.wordpress.com/2010/07/29/change-cursor-key-keyboard-increment/

    for (var i = 0; i < app.selection.length; i++) {
      var obj = app.selection[i];
      try {
        obj.geometricBounds = [obj.geometricBounds[0], obj.geometricBounds[1], obj.geometricBounds[2], obj.geometricBounds[3] + keyInc];
      } catch (_) {}
    }
  },
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Expand Width"
);
