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
