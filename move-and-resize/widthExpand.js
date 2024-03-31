// widthExpand.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// Increases the width of the selected object(s)
// by 10 × the keyboard increment.

// my keyboard shortcut: fn + ctrl + opt + cmd + right

app.doScript(
  function () {
    if (app.documents.length === 0 || app.activeDocument.pageItems.length === 0 || app.selection.length === 0) {
      return;
    }

    var keyInc = 10 * app.activeDocument.viewPreferences.cursorKeyIncrement;
    //thanks to this link : https://indisnip.wordpress.com/2010/07/29/change-cursor-key-keyboard-increment/

    for (var i = 0; i < app.selection.length; i++) {
      var obj = app.selection[i];
      try {
        obj.geometricBounds = [obj.geometricBounds[0], obj.geometricBounds[1], obj.geometricBounds[2], obj.geometricBounds[3] + keyInc];
      } catch (_) {}
    }
  },
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Expand Width"
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
