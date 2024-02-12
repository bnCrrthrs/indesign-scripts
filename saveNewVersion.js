(function () {
  if (app.documents.length < 1) return;
  var doc = app.activeDocument;

  if (!doc.saved) {
    try {
      doc.save();
    } catch (_) {}
    return;
  }

  var date = new Date();
  var year = date.getFullYear().toString().slice(2);
  var month = ("0" + (date.getMonth() + 1)).slice(-2);
  var day = ("0" + date.getDate()).slice(-2);

  var dateName = year + month + day;

  var currentName = doc.name.replace(/^\d+/, "");
  var currentPath = doc.filePath;

  var currentApp = currentName.match(/(\d+)(\D*)\.indd$/);
  var rxCurrentApp = new RegExp(currentApp[0] + "$");
  var coreName = currentName.replace(rxCurrentApp, "").replace(/\s/g, "%20");
  var currentVersion = currentApp[1];
  var newVersion = +currentVersion + 1;
  var append = currentApp[2];

  var newName = dateName + coreName + newVersion + append + ".indd";
  var newPath = currentPath + "/" + newName;

  var newFile = new File(newPath);

  var newDoc = doc.save(newFile);

  if (newDoc.isValid) return alert("Successfully saved \n" + newDoc.name);
  return alert("Problem saving");
})();
