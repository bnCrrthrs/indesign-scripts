(function () {
  if (app.documents.length === 0) return;
  var doc = app.activeDocument;
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
        var contents = item.parentStory.contents;
        textFile.writeln(contents);
      }
      if (altText) textFile.writeln(altText);
    }
  }

  textFile.close();
  textFile.execute();
})();
