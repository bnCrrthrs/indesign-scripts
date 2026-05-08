// connect text frames by y position

app.doScript(
  function () {
    var doc = app.activeDocument;
    if (!doc) return;
    var sel = doc.selection;
    var list = [];

    for (var i = sel.length - 1; i >= 0; i--) {
      var item = sel[i];
      if (item.constructor.name !== "TextFrame") {
        item.select(SelectionOptions.REMOVE_FROM);
      } else {
        list.push(item);
      }
    }

    if (list.length < 2) return;

    var sortedList = mergeSort(list);

    app.findGrepPreferences = NothingEnum.nothing;
    app.changeGrepPreferences = NothingEnum.nothing;

    for (var i = 1; i < list.length; i++) {
      var frameA = sortedList[i - 1];
      var frameB = sortedList[i];

      var storyA = frameA.parentStory;
      var storyB = frameB.parentStory;

      if (storyA === storyB) continue;

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
  "Connect text frames by Y position"
);

function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  var mid = Math.floor(arr.length / 2);
  var a = mergeSort(arr.slice(0, mid));
  var b = mergeSort(arr.slice(mid));
  return merge(a, b);
}

function merge(a, b) {
  var result = [];
  var ai = 0;
  var bi = 0;
  while (ai < a.length && bi < b.length) {
    if (aHigherThanB(a[ai], b[bi])) {
      result.push(a[ai]);
      ai++;
    } else {
      result.push(b[bi]);
      bi++;
    }
  }
  for (var i = ai; i < a.length; i++) result.push(a[i]);
  for (var i = bi; i < b.length; i++) result.push(b[i]);
  return result;
}

function aHigherThanB(a, b) {
  if (aboutEqual(a.geometricBounds[0], b.geometricBounds[0])) return aLefterThanB(a, b);
  return a.geometricBounds[0] <= b.geometricBounds[0];
}

function aLefterThanB(a, b) {
  return a.geometricBounds[1] < b.geometricBounds[1];
}

function aboutEqual(a, b) {
  return Math.abs(a - b) < 0.0005;
}

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
