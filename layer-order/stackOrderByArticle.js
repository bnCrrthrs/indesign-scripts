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
      return alert('You have nothing in your articles');
    }

    var selectedLayer = getSelection();
    if (!selectedLayer || !selectedLayer.isValid) return;
    selectedLayer.locked = false;
    selectedLayer.visible = true;
    app.generalPreferences.ungroupRemembersLayers = false;

    progress('Preparing...');
    progress.set(articles.length);

    for (var i = 0; i < articles.length; i++) {
      var article = articles[i];
      progress.msg(article.name);
      var members = article.articleMembers;
      progress.smSet(members.length);

      for (var j = 0; j < members.length; j++) {
        var item = members[j].itemRef;
        if (item.hasOwnProperty('contentType') && item.contentType == ContentType.TEXT_TYPE) {
          moveStoryToFrontOfselectedLayer(item);
        } else {
          moveToFrontOfselectedLayer(item);
        }
        progress.smInc();
      }
    }
    progress.close();

    if (ungroupCount) {
      var verb = ' group was ';
      var posessive = ' its ';
      if (ungroupCount > 1) {
        verb = ' groups were ';
        posessive = ' their ';
      }
      alert(ungroupCount + verb + 'ungrouped\nThis may have altered' + posessive + 'appearance');
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
      if (parent.constructor.name == 'Group') {
        ungroup(parent);
        parent.ungroup();
        ungroupCount++;
      }
    }

    ////////////////////////////////////////////////////////////////////////////////////

    function getSelection() {
      var window = new Window('dialog', 'Choose a layer');
      var warning = window.add('statictext', undefined, 'Save your document before proceeding!');
      warning.preferredSize = [350, -1];
      warning.helpTip = "When you click OK, all article elements will be moved to the layer you select, and stacked according to the order they appear in the articles panel. This may affect the appearance of the document, as some elements may be moved in front of others. Some groups may be ungrouped. It's highly recommended that you save your document before proceeding.";
      var panel = window.add('panel');
      panel.alignChildren = 'left';
      var group = panel.add('group');
      group.add('statictext', undefined, 'Select destination layer...');
      group = panel.add('group');
      var layerList = layers.everyItem().name;
      layerList.unshift('Move to a new layer');
      var dropdown = group.add('dropdownlist', undefined, layerList);
      dropdown.preferredSize = [350, undefined];
      dropdown.selection = 0;
      group = window.add('group');
      var btnOK = group.add('button', undefined, 'OK');
      var btnCancel = group.add('button', undefined, 'Cancel');

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
      var window = new Window('palette', 'Progress', undefined, { closeButton: false });
      var text = window.add('statictext', undefined, msg);
      var bar = window.add('progressbar');
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
        text.text = 'Processing ' + msg;
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
  'Stack items by article'
);
