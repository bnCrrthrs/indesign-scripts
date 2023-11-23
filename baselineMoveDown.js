// this will calculate the height of the baselines in your document
// it will then move each selected object down by that distance

app.doScript(
  function () {
    if (app.documents.length === 0 || app.activeDocument.pageItems.length === 0 || app.selection.length === 0) {
      return;
    }

    var baseline = app.activeDocument.gridPreferences.baselineDivision;

    for (var i = 0; i < app.selection.length; i++) {
      var obj = app.selection[i];
      try {
        obj.move(undefined, [0, baseline]);
      } catch (_) {}
    }
  },
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  'Move Down'
);
