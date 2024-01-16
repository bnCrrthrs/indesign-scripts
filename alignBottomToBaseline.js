(function () {
  if (app.documents.length === 0 || app.selection.length === 0) return;
  var doc = app.activeDocument;
  var obj = app.selection[0];
  var baselineStart = doc.gridPreferences.baselineStart;
  var baselineDivision = doc.gridPreferences.baselineDivision;
  var marginTop = doc.marginPreferences.top;
  var zeroPoint = doc.gridPreferences.baselineGridRelativeOption;
  if (zeroPoint === BaselineGridRelativeOption.TOP_OF_MARGIN_OF_BASELINE_GRID_RELATIVE_OPTION) {
    baselineStart += marginTop;
  }
  var marginOffset = baselineStart % baselineDivision;

  var objectY = obj.geometricBounds[2];
  var difference = marginOffset - (objectY % baselineDivision);
  obj.move(undefined, [0, difference]);
})();
