// unassignEmptyTextFrames.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// Looks at all text frames in the document that have no content
// and are not threaded, and sets their content type to 'unassigned'.

app.doScript(
  function () {
    if (!app.documents.length || !app.activeDocument.selection.length) return;
    var selection = app.activeDocument.selection;

    for (var i = 0, l = selection.length; i < l; i++) {
      var item = selection[i];
      if (!(item instanceof TextFrame)) continue;
      if (item.nextTextFrame || item.previousTextFrame || item.parentStory.contents !== "") continue;
      //    if (item.parentStory.contents != "") continue;
      //    if (item.parentStory !== "") continue;

      item.contentType = ContentType.UNASSIGNED;
    }
  },
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Unassign empty text frames"
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
