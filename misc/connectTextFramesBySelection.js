// clearPasteBoard.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// connects text frames in the order they were selected

// my keyboard shortcut: ctrl + opt + cmd + c

app.doScript(
  function () {
    var doc = app.activeDocument;
    if (!doc) return;
    var sel = doc.selection;

    for (var i = sel.length - 1; i >= 0; i--) {
      var item = sel[i];
      if (item.constructor.name !== "TextFrame") {
        item.select(SelectionOptions.REMOVE_FROM);
      }
    }

    if (sel.length < 2) return;

    app.findGrepPreferences = NothingEnum.nothing;
    app.changeGrepPreferences = NothingEnum.nothing;

    for (var i = 1; i < sel.length; i++) {
      var frameA = sel[i - 1];
      var frameB = sel[i];

      var storyA = frameA.parentStory;
      var storyB = frameB.parentStory;

      if (storyA === storyB) continue;

      // app.findGrepPreferences.findWhat = "\\S(?:(?:\\n|\\r)\\s?)*\\z";
      // app.findGrepPreferences.findWhat = "(\\S)(?:(?:\\n|\\r)\\s?)*\\z";
      // app.changeGrepPreferences.changeTo = "$0\r";
      // storyA.changeGrep();

      // remove trailing spaces
      app.findGrepPreferences.findWhat = "((\\n|\\r)\\s?)+\\z";
      app.changeGrepPreferences.changeTo = "";
      storyA.changeGrep();

      // add final paragraph break
      app.findGrepPreferences.findWhat = "\\z";
      app.changeGrepPreferences.changeTo = "\r";
      storyA.changeGrep();

      var inFrame = frameB.startTextFrame;
      var outFrame = frameA.endTextFrame;

      outFrame.nextTextFrame = inFrame;
    }

    //Clear the find/change text preferences.
    app.findGrepPreferences = NothingEnum.nothing;
    app.changeGrepPreferences = NothingEnum.nothing;
  },
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Connect text frames"
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
