// shrink text box
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// Like alignBottomToBaseline but doesn't align to baseline grid,
// just shrinks box height while (hopefully) preserving position of text on page

// my keyboard shortcut: ctrl + opt + cmd + z

app.doScript(
  shrinkTextBox,
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Shrink text box"
);

// shrinkTextBox
function shrinkTextBox() {
  if (app.documents.length === 0 || app.selection.length === 0) return;

  var doc = app.activeDocument;
  var selection = app.selection;
  if (selection[0].parent.constructor.name === "Story")
    selection = selection[0].parentTextFrames;
  var thisPage = selection[0].parentPage;

  for (var i = 0; i < selection.length; i++) {
    var obj = selection[i];
    if (!obj.hasOwnProperty("geometricBounds")) continue;
    if (obj instanceof TextFrame && obj.contents !== "") {
      var topEdge = obj.geometricBounds[0];
      var leftEdge = obj.geometricBounds[1];
      var bottomEdge = obj.geometricBounds[2];
      var rightEdge = obj.geometricBounds[3];
      // obj.fit(FitOptions.FRAME_TO_CONTENT);
      // not sure why this isn't working
      try {
        obj.fit(FitOptions.FRAME_TO_CONTENT);
      } catch (_) {
        obj.fit(FitOptions.CONTENT_AWARE_FIT);
      }
      var reducedHeightBy = obj.geometricBounds[2] - bottomEdge;
      var bottomAligned =
        obj.textFramePreferences.verticalJustification ===
        VerticalJustification.BOTTOM_ALIGN;
      var centreAligned =
        obj.textFramePreferences.verticalJustification ===
        VerticalJustification.CENTER_ALIGN;
      if (reducedHeightBy && bottomAligned) {
        obj.move(undefined, [0, bottomEdge - obj.geometricBounds[2]]);
      } else if (reducedHeightBy && centreAligned) {
        obj.move(undefined, [0, (bottomEdge - obj.geometricBounds[2]) / 2]);
      }
      obj.geometricBounds = [
        obj.geometricBounds[0],
        leftEdge,
        obj.geometricBounds[2],
        rightEdge,
      ];
    }
    var objectY = obj.geometricBounds[2];
    if (obj instanceof TextFrame) {
      var insetSpacing = obj.textFramePreferences.insetSpacing;
      if (insetSpacing instanceof Array) objectY -= insetSpacing[2];
      if (typeof insetSpacing === "number") objectY -= insetSpacing;
    }
  }
}

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
