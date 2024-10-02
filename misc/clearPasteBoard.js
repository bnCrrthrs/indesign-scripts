// clearPasteBoard.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// Deletes any page item whose parent page is null

app.doScript(cleanPasteBoard, ScriptLanguage.JAVASCRIPT, void 0, UndoModes.ENTIRE_SCRIPT, "Clean paste board");

function cleanPasteBoard() {
  var doc = app.activeDocument;
  if (!doc) return;

  var items = doc.allPageItems;
  var count = 0;

  for (var i = items.length - 1; i >= 0; i--) {
    var item = items[i];
    if (!item.isValid) continue;
    var parent = item.parentPage;
    if (parent !== null) continue;
    item.remove();
    count++;
  }

  if (count) alert(count + " items deleted");
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
