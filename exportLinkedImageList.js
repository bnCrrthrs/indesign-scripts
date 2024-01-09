(function () {
  if (app.documents.length === 0) return;
  var doc = app.activeDocument;

  if (!doc.saved) {
    try {
      doc.save();
    } catch (e) {
      return;
    }
  }

  var fileName = doc.fullName.toString().replace(/\.indd$/i, "-linked-images.txt");
  var file = File(fileName);

  var date = new Date();

  var links = doc.links;

  file.encoding = "UTF-8";
  file.open("w");

  file.writeln(date.toLocaleString());

  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    if (i === 0) alert(link.parent);
    var name = link.name;
    file.writeln(name);
  }
  file.close();
  file.execute();
})();
