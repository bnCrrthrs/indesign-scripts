// stackOrderByArticle.js
// Copyright (C) 2024 Ben Carruthers

// Asks you to select an existing layer, or create a new one.
// Then works through each item in each article in your articles panel,
// sequentially moving each item to the top of the selected layer.
// When the script has completed, everything in the articles panel
// is in the same layer, with the first item in the panel at the
// bottom of that selection, and the last item at the top.

// If the item is a threaded text frame, each text frame in the story
// is moved sequentially to the top of the layer, so the reading order
// of stories is also preserved.

// One difficulty is with grouped items: if an article item is grouped
// with other items, that item can't be moved to the top of the layer
// by itself. In this situation the script will ungroup the group before
// moving the item to the top of the layer. If this happens the script
// will produce an alert as to how many groups have been ungrouped.

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

    var doc = app.activeDocument;
    var layers = doc.layers;
    var articles = doc.articles;
    var ungroupCount = 0;
    var remembersLayers = app.generalPreferences.ungroupRemembersLayers;

    if (articles.length < 1 || articles.everyItem().articleMembers.length < 1) {
      return alert("You have nothing in your articles");
    }

    var selectedLayer = getSelection();
    if (!selectedLayer || !selectedLayer.isValid) return;
    selectedLayer.locked = false;
    selectedLayer.visible = true;
    app.generalPreferences.ungroupRemembersLayers = false;

    progress("Preparing...");
    progress.set(articles.length);

    for (var i = 0; i < articles.length; i++) {
      var article = articles[i];
      progress.msg(article.name);
      var members = article.articleMembers;
      progress.smSet(members.length);

      for (var j = 0; j < members.length; j++) {
        var item = members[j].itemRef;
        if (item.hasOwnProperty("contentType") && item.contentType == ContentType.TEXT_TYPE) {
          moveStoryToFrontOfselectedLayer(item);
        } else {
          moveToFrontOfselectedLayer(item);
        }
        progress.smInc();
      }
    }
    progress.close();

    if (ungroupCount) {
      var verb = " group was ";
      var posessive = " its ";
      if (ungroupCount > 1) {
        verb = " groups were ";
        posessive = " their ";
      }
      alert(ungroupCount + verb + "ungrouped\nThis may have altered" + posessive + "appearance");
    }

    app.generalPreferences.ungroupRemembersLayers = remembersLayers;

    ////////////////////////////////////////////////////////////////////////////////////

    function moveStoryToFrontOfselectedLayer(storyElement) {
      var story = storyElement.parentStory;
      for (var i = 0; i < story.textContainers.length; i++) {
        moveToFrontOfselectedLayer(story.textContainers[i]);
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////

    function moveToFrontOfselectedLayer(item) {
      if (!item.isValid) return;
      ungroup(item); // recursively ungroups if item is part of a group (not if it is a group)
      var currentLayer = item.itemLayer;
      var currentLayerLocked = currentLayer.locked;
      if (currentLayerLocked) {
        currentLayer.locked = false;
      }
      item.locked = false;
      item.itemLayer = selectedLayer;
      item.bringToFront();
      if (currentLayerLocked) {
        currentLayer.locked = true;
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////

    function ungroup(item) {
      var parent = item.parent;
      if (parent.constructor.name == "Group") {
        ungroup(parent);
        parent.ungroup();
        ungroupCount++;
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////

    function getSelection() {
      var window = new Window("dialog", "Choose a layer");
      var warning = window.add("statictext", undefined, "Save your document before proceeding!");
      warning.preferredSize = [350, -1];
      warning.helpTip =
        "When you click OK, all article elements will be moved to the layer you select, and stacked according to the order they appear in the articles panel. This may affect the appearance of the document, as some elements may be moved in front of others. Some groups may be ungrouped. It's highly recommended that you save your document before proceeding.";
      var panel = window.add("panel");
      panel.alignChildren = "left";
      var group = panel.add("group");
      group.add("statictext", undefined, "Select destination layer...");
      group = panel.add("group");
      var layerList = layers.everyItem().name;
      layerList.unshift("Move to a new layer");
      var dropdown = group.add("dropdownlist", undefined, layerList);
      dropdown.preferredSize = [350, undefined];
      dropdown.selection = 0;
      group = window.add("group");
      var btnOK = group.add("button", undefined, "OK");
      var btnCancel = group.add("button", undefined, "Cancel");

      btnOK.onClick = function () {
        window.close(dropdown.selection.index);
      };

      btnCancel.onClick = function () {
        window.close(-1);
      };

      var result = window.show();

      if (result === -1) return null;

      if (result === 0) {
        var newLayer = doc.layers.add();
        newLayer.move(LocationOptions.AT_BEGINNING);
        return newLayer;
      } else {
        var selectedLayerName = layerList[result];
        return layers.itemByName(selectedLayerName);
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

    ////////////////////////////////////////////////////////////////////////////////////
  },
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Stack items by article"
);
