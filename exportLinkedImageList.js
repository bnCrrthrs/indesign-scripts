(function () {
  if (app.documents.length === 0 || app.activeDocument.pageItems.length === 0) {
    return;
  }

  var doc = app.activeDocument;
  var folder = Folder.selectDialog("Where to save the list to");
  var fileName = "linked-images.txt";
  var file = new File(folder + fileName);

  var links = doc.links;

  file.encoding = "UTF-8";
  file.open("w");

  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    var name = link.name;
    //    var path = link.filePath;
    file.writeln(name);
  }
  file.close();
  alert("Finished");
})();
