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
    selection.paragraphs[0].select(SelectionOptions.ADD_TO);
    lastCharIsSpace() && removeLastChar();
  } else if (selection.parent.constructor.name === "Story") {
    var points = selection.insertionPoints;
    var penultimateCharOfPara = points[-1].paragraphs[-1].characters[-2];
    var lastCharOfPara = points[-1].paragraphs[-1].characters[-1];
    var lastCharOfPoints = points.itemByRange(points.length - 2, points.length - 1);

    var selectionEndsBeforeParaBreak = penultimateCharOfPara === lastCharOfPoints;
    var lastCharOfParaIsParaBreak = regexEndOfPara.test(lastCharOfPara.contents.toString());

    selection.insertionPoints[0].paragraphs[0].select(SelectionOptions.ADD_TO);
    selection.insertionPoints[selection.insertionPoints.length - 1].paragraphs[0].select(SelectionOptions.ADD_TO);
    selectionEndsBeforeParaBreak || (lastCharOfParaIsParaBreak && removeLastChar());
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
