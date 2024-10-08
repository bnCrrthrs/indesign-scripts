// alignBottomToBaseline.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// Moves the selected object(s) so that the bottom edge –
// or the bottom baseline for text frames – lines up
// with the nearest line on the baseline grid.
// Text frames are also resized to fit the content.

// my keyboard shortcut: opt + cmd + b

app.doScript(
  function () {
    if (app.documents.length === 0 || app.selection.length === 0) return;

    var doc = app.activeDocument;
    var selection = app.selection;
    if (selection[0].parent.constructor.name === "Story") selection = selection[0].parentTextFrames;
    var thisPage = selection[0].parentPage;

    var baselineStart = doc.gridPreferences.baselineStart;
    var baselineDivision = doc.gridPreferences.baselineDivision;
    // var marginTop = doc.marginPreferences.top;
    var marginTop;
    if (!thisPage) {
      marginTop = doc.marginPreferences.top;
    } else {
      marginTop = thisPage.marginPreferences.top;
    }
    var relZeroPoint = doc.gridPreferences.baselineGridRelativeOption;
    if (relZeroPoint === BaselineGridRelativeOption.TOP_OF_MARGIN_OF_BASELINE_GRID_RELATIVE_OPTION) {
      baselineStart += marginTop;
    }
    var docZeroPoint = doc.zeroPoint[1];
    baselineStart -= docZeroPoint;
    var marginOffset = baselineStart % baselineDivision;

    for (var i = 0; i < selection.length; i++) {
      var obj = selection[i];
      if (!obj.hasOwnProperty("geometricBounds")) continue;
      if (obj instanceof TextFrame && obj.contents !== "") {
        var leftEdge = obj.geometricBounds[1];
        var rightEdge = obj.geometricBounds[3];
        obj.fit(FitOptions.FRAME_TO_CONTENT);
        obj.geometricBounds = [obj.geometricBounds[0], leftEdge, obj.geometricBounds[2], rightEdge];
      }
      var objectY = obj.geometricBounds[2];
      if (obj instanceof TextFrame) {
        var insetSpacing = obj.textFramePreferences.insetSpacing;
        if (insetSpacing instanceof Array) objectY -= insetSpacing[2];
        if (typeof insetSpacing === "number") objectY -= insetSpacing;
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

/*
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.
*/
