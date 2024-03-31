// exportGraphicsList.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// Gives you the option of whether to export a text file
// containing a simple list of the image links in your
// indesign document, or a csv file containing details like
// the page the image appears on, the image format, file path etc.

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
  if (format === "csv") file.writeln("Page,Folder,File,Format,Full Path, Author, Copyright Notice, Creator");

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
    var name = wrapInQuotes(link.name);
    var uri = link.linkResourceURI;
    var parent = uri.match(/[^\/]*(?=\/[^\/]*$)/)[0];
    var displayParent = wrapInQuotes(parent.replace(/%20/g, " "));
    // TODO there's probably a better fix for this?
    try {
      var pageNo = graphic.parentPage.name;
    } catch (_) {
      var pageNo = "Pasteboard";
    }
    var type = wrapInQuotes(link.linkType);
    var author = wrapInQuotes(link.linkXmp.author);
    var copyrightNotice = wrapInQuotes(link.linkXmp.copyrightNotice);
    var creator = wrapInQuotes(link.linkXmp.creator);
    targetFile.writeln(
      pageNo + "," + displayParent + "," + name + "," + type + "," + uri + "," + author + "," + copyrightNotice + "," + creator
    );
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

  function wrapInQuotes(string) {
    return '"' + string + '"';
  }
})();

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
