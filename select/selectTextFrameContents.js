// selectTextFrameContents.js
// Copyright (C) 2024 Ben Carruthers

// Selects the entire contents of a selected text frame, excluding
// the last character if it's a space (this allows you to replace
// the contents without merging with the subsequent paragraph).

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
// my keyboard shortcut: opt + esc

(function () {
  if (app.documents.length === 0 || app.selection.length === 0) return;

  var textFrame;
  var selection = app.activeDocument.selection[0];

  if (selection.parent.constructor.name === "Story") {
    textFrame = selection.parentTextFrames[0];
  } else if (
    selection.parent.constructor.name === "Endnote" ||
    selection.parent.constructor.name === "Footnote" ||
    selection.parent.constructor.name === "Cell"
  ) {
    textFrame = selection.parent;
  } else if (
    selection.constructor.name === "TextFrame" ||
    selection.constructor.name === "EndnoteTextFrame" ||
    selection.constructor.name === "Cell"
  ) {
    textFrame = selection;
  } else {
    return;
  }
  try {
    var l = textFrame.characters.length;
    var lastChar = textFrame.insertionPoints.itemByRange(l - 1, l).contents.toString();
    var space = 0;
    if (lastChar.match(/\s/g)) {
      space = 1;
    }
    textFrame.insertionPoints.itemByRange(0, l - space).select();
  } catch (_) {}
})();
