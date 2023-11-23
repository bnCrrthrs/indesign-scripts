app.doScript(
  function () {
    if (app.documents.length === 0 || app.activeDocument.pageItems.length === 0) {
      return;
    }

    if (app.activeDocument.selection.length === 0) return alert('Nothing is selected');

    var selectedItems = getSelection(); // returns the story if text is selected

    var currentLayer = selectedItems[0].itemLayer;
    var stackedStories = [];
    var ungrouped = 0;

    var l = selectedItems.length;

    progress('Stacking order...'); //PROG
    progress.set(l); //PROG

    for (var i = 0; i < l; i++) {
      var item = selectedItems[i];
      if (!item.hasOwnProperty('contentType') || item.contentType !== ContentType.TEXT_TYPE) {
        progress.msg(item.constructor.name); //PROG
        moveToTopOfLayer(item);
        progress.increment(); //PROG
      } else {
        stackStory(item);
      }
    }

    progress.close();

    if (ungrouped) {
      var verb = ' group was ';
      var posessive = ' its ';
      if (ungrouped > 1) {
        verb = ' groups were ';
        posessive = ' their ';
      }
      alert(ungrouped + verb + 'ungrouped\nThis may have altered' + posessive + 'appearance');
    }

    ////////////////////////////////////////////

    function ungroup(item) {
      var parent = item.parent;
      if (parent.constructor.name == 'Group') {
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
      if (selection[0].parent.constructor.name === 'Story') {
        var firstFrame = selection[0].parentStory.textContainers[0];
        firstFrame.select(SelectionOptions.REPLACE_WITH);
        return [firstFrame];
      } else {
        return selection;
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
  },
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  'Stack items by selection'
);
