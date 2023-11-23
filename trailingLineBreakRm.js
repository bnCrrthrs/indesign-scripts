(function () {
  if (app.documents.length === 0 || app.activeDocument.pageItems.length === 0 || app.activeDocument.selection.length === 0) {
    return;
  }

  var sel = getSelection();
  var processedStories = [];

  /////////////////////////////////////////////////////////////////////////////

  // find change thanks to cybernetic.nomad
  // https://stackoverflow.com/questions/51638632/indesign-script-search-and-replace

  //Clear the find/change text preferences.
  app.findGrepPreferences = NothingEnum.nothing;
  app.changeGrepPreferences = NothingEnum.nothing;

  //   //Set the GREP find options (adjust to taste)
  //   app.findChangeGrepOptions.includeFootnotes = false;
  //   app.findChangeGrepOptions.includeHiddenLayers = false;
  //   app.findChangeGrepOptions.includeLockedLayersForFind = false;
  //   app.findChangeGrepOptions.includeLockedStoriesForFind = false;
  //   app.findChangeGrepOptions.includeMasterPages = true;

  //Look for the pattern and change to
  app.findGrepPreferences.findWhat = "((\\n|\\r)\\s?)+\\z";
  app.changeGrepPreferences.changeTo = "";
  //  myDocument.changeGrep();

  /////////////////////////////////////////////////////////////////////////////

  for (var i = 0, l = sel.length; i < l; i++) {
    var item = sel[i];
    if (!(item instanceof TextFrame)) continue;
    var story = item.parentStory;
    var alreadyProcessed = false;
    for (var j = 0, k = processedStories.length; j < k; j++) {
      if (processedStories[j] === story) {
        alreadyProcessed = true;
        break;
      }
    }
    if (alreadyProcessed) continue;
    processedStories.push(story);
    story.changeGrep();
  }

  //Clear the find/change text preferences.
  app.findGrepPreferences = NothingEnum.nothing;
  app.changeGrepPreferences = NothingEnum.nothing;

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
})();
