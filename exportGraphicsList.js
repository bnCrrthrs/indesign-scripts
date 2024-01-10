(function () {
  if (app.documents.length === 0) return;
  var doc = app.activeDocument;

  if (!doc.saved) {
    try {
      if (!confirm("You must save before proceeding\nDo you want to continue?")) return;
      doc.save();
    } catch (e) {
      return;
    }
  }

  var format = getFormat();
  if (!format) return;

  var graphics = doc.allGraphics;

  var fileName = doc.fullName.toString().replace(/\.indd$/i, "-linked-images.") + format;
  var file = File(fileName);
  file.encoding = "UTF-8";
  file.open("w");
  if (format === "csv") file.writeln("Page,Folder,File,Format,Full Path");

  for (var i = 0; i < graphics.length; i++) {
    var graphic = graphics[i];
    if (!graphic.itemLayer.visible || !graphic.parent.visible || !graphic.visible) continue;

    if (format === "txt") {
      writeTxt(graphic, file);
    } else {
      writeCsv(graphic, file);
    }
  }

  file.close();
  file.execute();

  //+ FUNCTIONS

  function writeTxt(graphic, targetFile) {
    var linkName = graphic.itemLink.name;
    targetFile.writeln(linkName);
  }

  function writeCsv(graphic, targetFile) {
    var link = graphic.itemLink;
    var name = link.name;
    var uri = link.linkResourceURI;
    var parent = uri.match(/[^\/]*(?=\/[^\/]*$)/)[0];
    var displayParent = parent.replace(/%20/g, " ");
    var pageNo = graphic.parentPage.name;
    var type = link.linkType;
    targetFile.writeln(pageNo + "," + displayParent + "," + name + "," + type + "," + uri);
  }

  function getFormat() {
    var format;
    var window = new Window("dialog", "Choose export format");
    window.alignChildren = "fill";
    var group = window.add("group");
    var panel = group.add("panel");
    panel.alignChildren = "left";
    panel.add("statictext", undefined, "Choose 'Text' to export a simple list of file names");
    panel.add("statictext", undefined, "Choose 'CSV' to export page numbers and parent folder");
    group = window.add("group");
    group.alignment = "middle";
    var txtBtn = group.add("button", undefined, "Text");
    var csvBtn = group.add("button", undefined, "CSV");
    var cancelBtn = group.add("button", undefined, "Cancel");

    txtBtn.onClick = function () {
      format = "txt";
      window.close(1);
    };
    csvBtn.onClick = function () {
      format = "csv";
      window.close(1);
    };
    cancelBtn.onClick = function () {
      window.close(0);
    };
    if (window.show() === 0) return false;
    return format;
  }
})();
