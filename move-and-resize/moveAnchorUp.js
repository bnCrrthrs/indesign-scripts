// moveAnchorDown.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// Moves the reference point up in the reference point grid.
// If current reference point is at the top, it moves to the
// bottom and one position left (ie from centre top to bottom left).

// my keyboard shortcut: ctrl + opt + cmd + p

(function () {
  if (app.documents.length === 0) {
    return;
  }
  var window = app.activeWindow;
  var current = window.transformReferencePoint.toString();

  switch (current) {
    case "TOP_LEFT_ANCHOR":
      window.transformReferencePoint = AnchorPoint.BOTTOM_RIGHT_ANCHOR;
      break;
    case "TOP_CENTER_ANCHOR":
      window.transformReferencePoint = AnchorPoint.BOTTOM_LEFT_ANCHOR;
      break;
    case "TOP_RIGHT_ANCHOR":
      window.transformReferencePoint = AnchorPoint.BOTTOM_CENTER_ANCHOR;
      break;
    case "LEFT_CENTER_ANCHOR":
      window.transformReferencePoint = AnchorPoint.TOP_LEFT_ANCHOR;
      break;
    case "CENTER_ANCHOR":
      window.transformReferencePoint = AnchorPoint.TOP_CENTER_ANCHOR;
      break;
    case "RIGHT_CENTER_ANCHOR":
      window.transformReferencePoint = AnchorPoint.TOP_RIGHT_ANCHOR;
      break;
    case "BOTTOM_LEFT_ANCHOR":
      window.transformReferencePoint = AnchorPoint.LEFT_CENTER_ANCHOR;
      break;
    case "BOTTOM_CENTER_ANCHOR":
      window.transformReferencePoint = AnchorPoint.CENTER_ANCHOR;
      break;
    case "BOTTOM_RIGHT_ANCHOR":
      window.transformReferencePoint = AnchorPoint.RIGHT_CENTER_ANCHOR;
      break;
  }
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
