// fitToColumn.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// aligns to the column, and (tries to) resize to best fit the column span
// simply resizes text frames, but rescales other page items.
// ignores anything outside of the page margins

app.doScript(
  function () {
    if (app.documents.length === 0 || app.selection.length === 0) return;
    var doc = app.activeDocument;
    var selection = app.selection;

    var originalTransformReferencePoint = app.activeWindow.transformReferencePoint;
    app.activeWindow.transformReferencePoint = AnchorPoint.CENTER_ANCHOR;

    var docZeroPoint = doc.zeroPoint[0];
    var facingPages = doc.documentPreferences.facingPages;

    if (selection[0].parent.constructor.name === "Story") selection = selection[0].parentTextFrames;

    for (var i = 0; i < selection.length; i++) {
      var obj = selection[i];
      var parentPage = obj.parentPage;
      if (!parentPage) continue;
      if (!obj.hasOwnProperty("geometricBounds")) continue;

      var pageLeft = parentPage.bounds[1];
      var pageRight = parentPage.bounds[3];
      var pageWidth = pageRight - pageLeft;
      var marginLeft = parentPage.marginPreferences.left;
      var marginRight = parentPage.marginPreferences.right;
      var colCount = parentPage.marginPreferences.columnCount;
      var colGutter = parentPage.marginPreferences.columnGutter;
      var availableWidth = pageWidth - (marginLeft + marginRight);
      var colWidth = (availableWidth - (colCount - 1) * colGutter) / colCount;
      var colSpan = colWidth + colGutter;

      // might need this if margin left ≠ margin right and object is on right page of spread?

      // if (facingPages && doc.pages[0] !== parentPage && parentPage.index === 0) {
      //   var intermediate = marginLeft;
      //   marginLeft = marginRight;
      //   marginRight = intermediate;
      // }

      // ignore if in margin
      if (
        Math.min(obj.geometricBounds[1], obj.geometricBounds[3]) >= pageRight - marginRight ||
        Math.max(obj.geometricBounds[1], obj.geometricBounds[3]) <= pageLeft + marginLeft
      )
        continue;

      var top = obj.geometricBounds[0];
      var left = obj.geometricBounds[1];
      var bottom = obj.geometricBounds[2];
      var right = obj.geometricBounds[3];
      var objWidth = Math.abs(right - left);

      // relative to page (rather than spread)
      // note this causes problems if object spans multiple pages!
      var relLeft = left % pageWidth;
      var relRight = right % pageWidth;
      var pageOffset = parentPage.index * pageWidth;

      var newLeft = pageOffset + marginLeft + Math.round((relLeft - marginLeft) / colSpan) * colSpan;
      var newRight = pageOffset + marginLeft + Math.ceil((relRight - marginLeft) / colSpan) * colSpan - colGutter;
      var newWidth = Math.abs(newRight - newLeft);

      var scale = newWidth / objWidth;

      if (obj.constructor.name === "TextFrame") {
        obj.geometricBounds = [top, newLeft, bottom, newRight];
      } else {
        obj.horizontalScale = obj.horizontalScale * scale;
        obj.verticalScale = obj.verticalScale * scale;
        obj.move([newLeft, top]);
      }
    }

    app.activeWindow.transformReferencePoint = originalTransformReferencePoint;
  },
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Fit to closest column"
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
