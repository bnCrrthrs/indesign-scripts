(function () {
  if (app.documents.length === 0) return;
  var openAfter = confirm("Do you want to open the text files?");
  var n = 0;
  for (var d = 0; d < app.documents.length; d++) {
    var doc = app.documents[d];
    expArtTxt(doc);
  }
  alert("Saved " + n + " text files");

  function expArtTxt(doc) {
    if (!doc.saved) return;
    var articles = doc.articles;
    if (!articles.length) return;

    var txtFileName = doc.fullName.toString().replace(/\.\w+$/, "_ARTICLE-TEXT.txt");
    var textFile = new File(txtFileName);
    textFile.encoding = "UTF-8";

    textFile.open("w");
    textFile.writeln(doc.name);
    for (var i = 0, l = doc.name.length; i < l; i++) {
      textFile.write("=");
    }
    textFile.writeln("\n\n");

    for (var i = 0; i < articles.length; i++) {
      var article = articles[i];
      var members = article.articleMembers;
      textFile.writeln("");
      for (var j = 0; j < members.length; j++) {
        var item = members[j].itemRef;
        var altText = item.objectExportOptions.customAltText;
        if (item.hasOwnProperty("contentType") && item.contentType == ContentType.TEXT_TYPE) {
          var contents = item.parentStory.contents.replace(/ /g, " "); //replaces nbsp with normal space
          textFile.writeln(contents);
        }
        if (altText) textFile.writeln(altText);
      }
    }

    textFile.close();
    if (openAfter) textFile.execute();
    n++;
  }
})();
