(function () {
  if (app.documents.length === 0) return;
  var doc = app.activeDocument;
  var stories = doc.stories;
  if (!doc.saved) return;
  if (stories.length < 1) return;
  var txtFileName = doc.fullName.toString().replace(/\.\w+$/, "_TEXT.txt");
  var textFile = new File(txtFileName);

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
