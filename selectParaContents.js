(function () {
  if (app.documents.length === 0 || app.selection.length === 0) return;

  // var textFrame;
  var doc = app.activeDocument;
  var selection = doc.selection[0];

  function lastCharIsSpace0() {
    var points = doc.selection[0].insertionPoints;
    var character = points.itemByRange(points.length - 2, points.length - 1).contents.toString();
    return character.match(/\s/);
  }

  function lastCharIsSpace() {
    var characters = doc.selection[0].characters;
    var lastChar = characters.lastItem().contents.toString();
    return lastChar.match(/\s/);
  }

  function removeLastChar() {
    var points = doc.selection[0].insertionPoints;
    if (points.length < 1) return;
    points.itemByRange(0, points.length - 2).select(SelectionOptions.REPLACE_WITH);
  }

  //* HERE"S THE SCRIPT
  if (selection.constructor.name === "TextFrame") {
    var paras = selection.paragraphs;
    var para = paras[0];
    para.select(SelectionOptions.REPLACE_WITH);
    if (lastCharIsSpace()) removeLastChar();
  } else if (selection.constructor.name === "InsertionPoint") {
    selection.paragraphs[0].select(SelectionOptions.ADD_TO);
    var points = doc.selection[0].insertionPoints;
    if (lastCharIsSpace()) removeLastChar();
  } else if (selection.parent.constructor.name === "Story") {
    selection.insertionPoints[0].paragraphs[0].select(SelectionOptions.ADD_TO);
    selection.insertionPoints[selection.insertionPoints.length - 1].paragraphs[0].select(SelectionOptions.ADD_TO);
  }
})();
