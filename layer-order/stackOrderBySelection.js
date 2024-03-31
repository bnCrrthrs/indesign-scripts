// stackOrderBySelection.js
// Copyright (C) 2024 Ben Carruthers

// Looks at the selected page items, then sequentially moves each
// to the top of the layer of the first item in the selection.

// When the selected item is a threaded text frame, each text frame
// in the story is moved sequentially to the top of the layer.
// This starts with the first text frame in the story,
// regardless of which frame was selected.

// If multiple text frames from the same story are selected,
// the collection will only be processed for the first frame
// selected – subsequent selected frames from the same story
// will be ignored.

// When an item that's part of a group is selected,
// the group is ungrouped and the item is moved.

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
app.doScript(
  function () {
    if (app.documents.length === 0 || app.activeDocument.pageItems.length === 0) {
      return;
    }

    if (app.activeDocument.selection.length === 0) return alert("Nothing is selected");

    var selectedItems = getSelection(); // returns the story if text is selected

    var currentLayer = selectedItems[0].itemLayer;
    var stackedStories = [];
    var ungrouped = 0;

    var l = selectedItems.length;

    progress("Stacking order..."); //PROG
    progress.set(l); //PROG

    for (var i = 0; i < l; i++) {
      var item = selectedItems[i];
      if (!item.hasOwnProperty("contentType") || item.contentType !== ContentType.TEXT_TYPE) {
        progress.msg(item.constructor.name); //PROG
        moveToTopOfLayer(item);
        progress.increment(); //PROG
      } else {
        stackStory(item);
      }
    }

    progress.close();

    if (ungrouped) {
      var verb = " group was ";
      var posessive = " its ";
      if (ungrouped > 1) {
        verb = " groups were ";
        posessive = " their ";
      }
      alert(ungrouped + verb + "ungrouped\nThis may have altered" + posessive + "appearance");
    }

    ////////////////////////////////////////////

    function ungroup(item) {
      var parent = item.parent;
      if (parent.constructor.name == "Group") {
        ungroup(parent);
        parent.ungroup();
        ungrouped++;
      }
    }

    function moveToTopOfLayer(item) {
      if (!item.isValid) return;
      ungroup(item); // recursively ungroups if item is part of a group (not if it is a group)
      var thisItemLayer = item.itemLayer;
      var thisItemLayerLocked = thisItemLayer.locked;
      if (thisItemLayerLocked) {
        thisItemLayer.locked = false;
      }
      item.locked = false;
      item.itemLayer = currentLayer;
      item.bringToFront();

      if (thisItemLayerLocked) {
        thisItemLayer.locked = true;
      }
    }

    function stackStory(item) {
      progress.msg(item.constructor.name); //PROG
      var story = item.parentStory;
      if (story.textContainers.length === 1) {
        moveToTopOfLayer(item);
        progress.increment(); //PROG
        return;
      }
      for (var k = 0, l = stackedStories.length; k < l; k++) {
        if (stackedStories[k] === story) {
          progress.increment(); //PROG
          return;
        }
      }
      stackedStories.push(story);

      var m = story.textContainers.length;
      progress.smSet(m); //PROG

      for (var j = 0; j < m; j++) {
        moveToTopOfLayer(story.textContainers[j]);
        progress.smInc(); //PROG
      }
    }

    function getSelection() {
      var selection = app.activeDocument.selection;
      if (selection[0].parent.constructor.name === "Story") {
        var firstFrame = selection[0].parentStory.textContainers[0];
        firstFrame.select(SelectionOptions.REPLACE_WITH);
        return [firstFrame];
      } else {
        return selection;
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////

    function progress(msg) {
      var window = new Window("palette", "Progress", undefined, { closeButton: false });
      var text = window.add("statictext", undefined, msg);
      var bar = window.add("progressbar");
      var smStep;
      text.preferredSize = [450, -1];
      bar.preferredSize = [450, -1];

      progress.close = function () {
        window.close();
      };

      progress.increment = function () {
        bar.value++;
      };

      progress.msg = function (msg) {
        text.text = "Processing " + msg;
        window.update();
      };

      progress.set = function (steps) {
        bar.value = 0;
        bar.minvalue = 0;
        bar.maxvalue = steps;
      };

      progress.smSet = function (steps) {
        var inc = 1 / steps;
        smStep = Math.min(inc, 1);
      };

      progress.smInc = function () {
        bar.value += smStep;
      };

      window.show();
      window.update();
    }
  },
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Stack items by selection"
);
