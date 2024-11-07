// shufflePositions.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// Swaps positions of two or more selected page items.
// Sensitive to reference point: eg bottom-right ref point will preserve bottom-right coordinates of swapped items

app.doScript(shufflePositionsFunction, ScriptLanguage.JAVASCRIPT, void 0, UndoModes.ENTIRE_SCRIPT, "Shuffle positions");

function shufflePositionsFunction() {
  if (app.documents.length === 0) return;

  var mySelection = [];
  for (var i = app.selection.length - 1; i >= 0; i--) {
    if (app.selection[i].hasOwnProperty("geometricBounds")) {
      mySelection.push(app.selection[i]);
    }
  }

  if (mySelection.length < 2) return;

  var temp1;
  var temp2 = mySelection[0].geometricBounds;
  // geometricBounds: y1,x1,y2,x2;

  // Each item first moves to the required position to align with top left corner,
  // then moves by a certain amount to left/centre/right align and top/centre/bottom align.
  // The move-by amount is determined by the target item's width/height minus current item's width/height
  // This would align bottom right. But the anchorOffsetMap and offsetMultiplier multiplies arrange to
  // multiply these values by 0, 0.5 or 1 depending on the currently selected anchor point, to
  // adjust for top/left/centre aligning.

  var anchorOffsetMap = {
    TOP_LEFT_ANCHOR: [0, 0],
    TOP_CENTER_ANCHOR: [0.5, 0],
    TOP_RIGHT_ANCHOR: [1, 0],
    LEFT_CENTER_ANCHOR: [0, 0.5],
    CENTER_ANCHOR: [0.5, 0.5],
    RIGHT_CENTER_ANCHOR: [1, 0.5],
    BOTTOM_LEFT_ANCHOR: [0, 1],
    BOTTOM_CENTER_ANCHOR: [0.5, 1],
    BOTTOM_RIGHT_ANCHOR: [1, 1],
  };

  var offsetMultiplier = anchorOffsetMap[app.activeWindow.transformReferencePoint.toString()];

  function getOffset(arr) {
    var offsetX = (arr[3] - arr[1]) * offsetMultiplier[0];
    var offsetY = (arr[2] - arr[0]) * offsetMultiplier[1];
    return [offsetX, offsetY];
  }

  for (var i = mySelection.length - 1; i >= 0; i--) {
    var item = mySelection[i];
    temp1 = temp2;
    temp2 = item.geometricBounds;
    var thisOffset = getOffset(temp2);
    var thatOffset = getOffset(temp1);
    item.move([temp1[1], temp1[0]]);
    item.move(undefined, [thatOffset[0] - thisOffset[0], thatOffset[1] - thisOffset[1]]);
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
