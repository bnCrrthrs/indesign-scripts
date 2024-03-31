// selectParaContents.js
// Copyright (C) 2024 Ben Carruthers

// Executing once when a text frame is selected will place the cursor
// at the start of the text frame.

// Executing again will select the entire paragraph excluding the
// paragraph break at the end (this allows you replace the paragraph
// contents without merging with the subsequent paragraph).

// Executing again will add the paragraph break to the selection,
// and executing again will add the subsequent paragraph.

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
// my keyboard shortcut: cmd + esc

(function () {
  if (app.documents.length === 0) return;

  var doc = app.activeDocument;
  var selection = doc.selection[0];
  var regexEndOfPara = /\r|\n/;

  if (!selection) {
    selectFirstTextFrame();
  } else if (selection.constructor.name === "TextFrame") {
    insertCursor();
  } else if (selection.constructor.name === "InsertionPoint") {
    if (selection.paragraphs.length === 0) return;
    var paraLength = selection.paragraphs[0].characters.length;
    selection.paragraphs[0].select(SelectionOptions.ADD_TO);
    paraLength > 1 && lastCharIsSpace() && removeLastChar();
  } else if (selection.parent.constructor.name === "Story") {
    var points = selection.insertionPoints;
    var thisPara = points[-1].paragraphs[-1];
    if (!thisPara.isValid) return;
    var paraLength = thisPara.characters.length;
    var penultimateCharOfPara = thisPara.characters[-2];
    var lastCharOfPara = thisPara.characters[-1];
    var lastCharOfPoints = points.itemByRange(points.length - 2, points.length - 1);

    var selectionEndsBeforeParaBreak = penultimateCharOfPara === lastCharOfPoints;
    var lastCharOfParaIsParaBreak = regexEndOfPara.test(lastCharOfPara.contents.toString());

    selection.insertionPoints[0].paragraphs[0].select(SelectionOptions.ADD_TO);
    selection.insertionPoints[selection.insertionPoints.length - 1].paragraphs[0].select(SelectionOptions.ADD_TO);
    selectionEndsBeforeParaBreak || (paraLength > 1 && lastCharOfParaIsParaBreak && removeLastChar());
  } else {
    try {
      insertCursor();
    } catch (_) {
      selectFirstTextFrame();
    }
  }

  function lastCharIsSpace() {
    var characters = doc.selection[0].characters;
    var lastChar = characters.lastItem().contents.toString();
    return regexEndOfPara.test(lastChar);
  }

  function removeLastChar() {
    var points = doc.selection[0].insertionPoints;
    if (points.length < 1) return;
    points.itemByRange(0, points.length - 2).select(SelectionOptions.REPLACE_WITH);
  }

  function insertCursor() {
    try {
      app.selection[0].texts[0].insertionPoints[0].select();
    } catch (_) {
      selectFirstTextFrame();
    }
  }

  function selectFirstTextFrame() {
    try {
      var window = app.activeWindow;
      var page = window.activePage;
      var allFrames = page.textFrames;

      for (var i = allFrames.length - 1; i >= 0; i--) {
        var frame = allFrames[i];
        var layer = frame.itemLayer;
        if (layer.locked || frame.locked || !layer.visible || !frame.visible) continue;
        frame.select(SelectionOptions.REPLACE_WITH);
        break;
      }
    } catch (_) {
      // beep beep
    }
  }
})();
