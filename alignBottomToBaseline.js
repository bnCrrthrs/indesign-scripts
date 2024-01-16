app.doScript(
  function () {
    if (app.documents.length === 0 || app.selection.length === 0) return;
    var doc = app.activeDocument;
    var baselineStart = doc.gridPreferences.baselineStart;
    var baselineDivision = doc.gridPreferences.baselineDivision;
    var marginTop = doc.marginPreferences.top;
    var zeroPoint = doc.gridPreferences.baselineGridRelativeOption;
    if (zeroPoint === BaselineGridRelativeOption.TOP_OF_MARGIN_OF_BASELINE_GRID_RELATIVE_OPTION) {
      baselineStart += marginTop;
    }
    var marginOffset = baselineStart % baselineDivision;
    for (var i = 0; i < app.selection.length; i++) {
      // var obj = app.selection[0];
      var obj = app.selection[i];
      if (!obj.hasOwnProperty("geometricBounds")) continue;
      var objectY = obj.geometricBounds[2];
      var difference = marginOffset - (objectY % baselineDivision);
      obj.move(undefined, [0, difference]);
    }
  },
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Align to baseline"
);
