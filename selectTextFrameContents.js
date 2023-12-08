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
    textFrame.insertionPoints.itemByRange(0, l).select();
  } catch (_) {}
})();
