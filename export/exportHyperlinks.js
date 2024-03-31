// exportHyperlinks.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// Saves a csv file containing info on all the web links
// in your document, including the page the link appears on,
// the linked text, and the destination URLs.

(function () {
  if (app.documents.length === 0) return;
  var doc = app.activeDocument;
  var links = doc.hyperlinks;

  if (!links.length) return alert("No hyperlinks in document");

  var path = "";
  if (doc.saved) {
    path = doc.filePath.toString();
  } else {
    path = "~/Desktop";
  }
  var newFile = new File(path + "/hyperlinks.csv");

  newFile.open("w");
  newFile.writeln(getCleanString(["Page", "Content", "Destination", "Accessibility text"]));

  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    if (link.destination.constructor.name !== "HyperlinkURLDestination") continue;
    var url = link.destination.destinationURL;
    var source = link.source;
    var sourceType = source.constructor.name.toString();
    if (sourceType === "HyperlinkTextSource") {
      var page = source.sourceText.parentTextFrames[0].parentPage.name;
      var sourceContent = source.sourceText.contents;
    } else if (sourceType === "HyperlinkPageItemSource") {
      var item = source.sourcePageItem;
      var page = item.parentPage.name;
      var sourceContent = item.constructor.name;
    } else {
      continue;
    }
    // alert("Page: " + page + " ... content: " + sourceContent);
    var string = getCleanString([page, sourceContent, url]);
    newFile.writeln(string);
  }

  newFile.close();
  newFile.encoding = "UTF-8";

  function getCleanString(arr) {
    var cleanList = [];
    var quote = '"';
    var comma = "%2c";
    for (var i = 0; i < arr.length; i++) {
      var str = arr[i];
      if (str.match(/^http/)) {
        var cleanStr = str.replace(/,/g, comma); // replace commas with %2c symbol in urls
      } else {
        var cleanStr = quote + str.replace(/"/g, "'") + quote; //replace double quotes with singles in everything else, and wrap in double quotes to escape commas
      }
      cleanList.push(cleanStr);
    }
    var cleanStr = cleanList.join(",");
    return cleanStr;
  }

  if (confirm("Finished\nDo you want to open the file?")) newFile.execute();
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
