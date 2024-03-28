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
