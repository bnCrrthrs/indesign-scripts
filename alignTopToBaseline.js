app.doScript(
  function () {
    if (app.documents.length === 0 || app.selection.length === 0) return;
    var doc = app.activeDocument;
    var selection = app.selection;
    var baselineStart = doc.gridPreferences.baselineStart;
    var baselineDivision = doc.gridPreferences.baselineDivision;
    var marginTop = doc.marginPreferences.top;
    var zeroPoint = doc.gridPreferences.baselineGridRelativeOption;
    if (zeroPoint === BaselineGridRelativeOption.TOP_OF_MARGIN_OF_BASELINE_GRID_RELATIVE_OPTION) {
      baselineStart += marginTop;
    }
    var marginOffset = baselineStart % baselineDivision;

    if (selection[0].parent.constructor.name === "Story") selection = selection[0].parentTextFrames;
    for (var i = 0; i < selection.length; i++) {
      var obj = selection[i];
      if (!obj.hasOwnProperty("geometricBounds")) continue;
      //      if (obj instanceof TextFrame && obj.contents !== "") obj.fit(FitOptions.FRAME_TO_CONTENT);
      var objectY = obj.geometricBounds[0];
      if (obj instanceof TextFrame && obj.contents !== "") {
        var ascent = Number(obj.lines[0].ascent);
        var inset = obj.textFramePreferences.insetSpacing[0];
        objectY += ascent + inset;
      }
      var difference = marginOffset - (objectY % baselineDivision);
      if (difference / -0.5 > baselineDivision) difference += baselineDivision;
      obj.move(undefined, [0, difference]);
    }
  },
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Align to baseline"
);
