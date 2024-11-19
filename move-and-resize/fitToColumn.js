// fitToColumn.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// aligns and resizes selected objects to match the column width.
// simply resizes text frames, but rescales other page items.
// ignores anything outside of the page margins

(function () {
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

    // ignore if in margin
    if (
      Math.min(obj.geometricBounds[1], obj.geometricBounds[3]) >= pageRight - marginRight ||
      Math.max(obj.geometricBounds[1], obj.geometricBounds[3]) <= pageLeft + marginLeft
    )
      continue;

    // resize
    if (obj.constructor.name === "TextFrame") {
      obj.geometricBounds = [obj.geometricBounds[0], obj.geometricBounds[1], obj.geometricBounds[2], obj.geometricBounds[1] + colWidth];
    } else {
      var objWidth = Math.abs(obj.geometricBounds[3] - obj.geometricBounds[1]);
      var scaleFactor = colWidth / objWidth;
      obj.horizontalScale = obj.horizontalScale * scaleFactor;
      obj.verticalScale = obj.verticalScale * scaleFactor;
    }

    // move
    var objectX = docZeroPoint + (obj.geometricBounds[1] + obj.geometricBounds[3]) / 2;
    var difference = (((objectX % pageWidth) - marginLeft) % colSpan) - colWidth / 2;
    obj.move(undefined, [-difference, 0]);
  }

  app.activeWindow.transformReferencePoint = originalTransformReferencePoint;
})();

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
