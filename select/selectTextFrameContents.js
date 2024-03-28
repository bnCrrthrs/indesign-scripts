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
