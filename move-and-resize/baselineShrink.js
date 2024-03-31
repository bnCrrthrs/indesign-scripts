// baselineShrink.js
// Copyright (C) 2024 Ben Carruthers

// Decreases the height of the selected object(s) by the height
// of the baseline increment setting in the current document.

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
// this will calculate the height of the baselines in your document
// it will then reduce the height of each selected object by that much

// my keyboard shortcut: shift + fn + ctrl + opt + cmd + up

app.doScript(
  function () {
    if (app.documents.length === 0 || app.activeDocument.pageItems.length === 0 || app.selection.length === 0) {
      return;
    }
    var baselineDivision = app.activeDocument.gridPreferences.baselineDivision;

    for (var i = 0; i < app.selection.length; i++) {
      var obj = app.selection[i];
      try {
        obj.geometricBounds = [
          obj.geometricBounds[0],
          obj.geometricBounds[1],
          obj.geometricBounds[2] - baselineDivision,
          obj.geometricBounds[3],
        ];
      } catch (_) {}
    }
  },
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Shrink Height"
);
