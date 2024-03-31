// alignLeftColumn.js
// Copyright (C) 2024 Ben Carruthers

// Moves the selected object(s) so that the left edge
// lines up with the nearest page column.

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
// my keyboard shortcut: opt + cmd + n
app.doScript(
  function () {
    if (app.documents.length === 0 || app.selection.length === 0) return;
    var doc = app.activeDocument;
    var selection = app.selection;

    var docZeroPoint = doc.zeroPoint[0];
    var facingPages = doc.documentPreferences.facingPages;

    if (selection[0].parent.constructor.name === "Story") selection = selection[0].parentTextFrames;
    for (var i = 0; i < selection.length; i++) {
      var obj = selection[i];
      var parentPage = obj.parentPage;
      if (!parentPage) continue;
      if (!obj.hasOwnProperty("geometricBounds")) continue;
      var pageWidth = parentPage.bounds[3] - parentPage.bounds[1];
      var marginLeft = parentPage.marginPreferences.left;
      var marginRight = parentPage.marginPreferences.right;
      var colCount = parentPage.marginPreferences.columnCount;
      var colGutter = parentPage.marginPreferences.columnGutter;
      var availableWidth = pageWidth - (marginLeft + marginRight);
      var colWidth = (availableWidth - (colCount - 1) * colGutter) / colCount;
      var colSpan = colWidth + colGutter;
      var halfColGutter = colGutter / 2;

      var objectX = obj.geometricBounds[1] + docZeroPoint;

      if (facingPages && doc.pages[0] !== parentPage) {
        if (parentPage.index === 0) {
          var intermediate = marginLeft;
          marginLeft = marginRight;
          marginRight = intermediate;
        } else {
          marginLeft += pageWidth;
        }
      }
      //* uncomment if you want text with inset spacing to line up with column (might not work any more?)
      // if (obj instanceof TextFrame) {
      //   var insetSpacing = obj.textFramePreferences.insetSpacing;
      //   if (insetSpacing instanceof Array) objectX += insetSpacing[0];
      //   if (typeof insetSpacing === "number") objectX += insetSpacing;
      // }

      var difference = ((objectX - (marginLeft + halfColGutter)) % colSpan) + halfColGutter;
      if (difference > 0.5 * colSpan) difference -= colSpan;
      var newX = objectX - docZeroPoint - difference;
      var pageRightMargin = parentPage.bounds[3] - marginRight;
      if (newX > pageRightMargin) difference += colGutter;
      // difference += docZeroPoint;
      obj.move(undefined, [-difference, 0]);
    }
  },
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Align to Column"
);
