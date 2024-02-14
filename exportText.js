(function () {
  if (app.documents.length === 0) return;
  var doc = app.activeDocument;
  if (!doc.saved) return;
  var pages = doc.pages;
  var errorPages = [];

  var txtFileName = doc.fullName.toString().replace(/\.\w+$/, "_TEXT.txt");
  var textFile = new File(txtFileName);
  textFile.encoding = "UTF-8";

  textFile.open("w");
  textFile.writeln(doc.name);
  for (var i = 0, l = doc.name.length; i < l; i++) {
    textFile.write("=");
  }
  textFile.writeln("\n\n");

  for (var i = 0; i < pages.length; i++) {
    var page = pages[i];
    var frames = page.textFrames;
    var displayPage = "Page " + (i + 1);

    textFile.writeln("\n" + displayPage + "\n------------------------------------------");

    for (var j = frames.length - 1; j >= 0; j--) {
      var frame = frames[j];
      if (!frame.visible) continue;
      if (!frame.itemLayer.visible) continue;
      var contents = frame.contents.toString();
      if (!textFile.writeln(contents)) errorPages.push(displayPage);
    }
  }

  textFile.close();
  if (errorPages.length > 0) alert("Error writing to the following pages: \n" + errorPages.join("\n"));
  textFile.execute();
})();

/*

//This version would just export all stories, hidden or not, not sorted by page
(function () {
  if (app.documents.length === 0) return;
  var doc = app.activeDocument;
  var stories = doc.stories;
  if (!doc.saved) return;
  if (stories.length < 1) return;
  var txtFileName = doc.fullName.toString().replace(/\.\w+$/, "_TEXT.txt");
  var textFile = new File(txtFileName);
  textFile.encoding = "UTF-8";

  textFile.open("w");

  for (var i = 0; i < stories.length; i++) {
    var story = stories[i];
    var text = story.contents.replace(/ /g, " ");
    textFile.writeln(text);
    textFile.writeln("\n");
  }

  textFile.close();
  textFile.execute();
})();

*/
