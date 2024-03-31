// widthShrink.js
// Copyright (C) 2024 Ben Carruthers

// Decreases the width of the selected object(s)
// by 10 × the keyboard increment

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
// this will calculate 10 times the cursor key increment setting from your preferences
// (this is the distance an object will move if you use SHIFT and the arrow keys)
// it will then reduce the width of each selected object by that much

// my keyboard shortcut: fn + ctrl + opt + cmd + left

app.doScript(
  function () {
    if (app.documents.length === 0 || app.activeDocument.pageItems.length === 0 || app.selection.length === 0) {
      return;
    }

    var keyInc = 10 * app.activeDocument.viewPreferences.cursorKeyIncrement;

    for (var i = 0; i < app.selection.length; i++) {
      var obj = app.selection[i];
      try {
        obj.geometricBounds = [obj.geometricBounds[0], obj.geometricBounds[1], obj.geometricBounds[2], obj.geometricBounds[3] - keyInc];
      } catch (_) {}
    }
  },
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Shrink Width"
);
