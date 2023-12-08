(function () {
  if (app.documents.length === 0 || app.selection.length === 0) return;

  var textFrame;
  var selection = app.activeDocument.selection[0];

  if (selection.parent.constructor.name === "Story") {
    textFrame = selection.parentTextFrames[0];
  } else if (selection.constructor.name !== "TextFrame") {
    return;
  } else {
    textFrame = selection;
  }

  var l = textFrame.characters.length;
  textFrame.insertionPoints.itemByRange(0, l).select();
})();
