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
      if (item.hasOwnProperty("contentType") && item.contentType == ContentType.TEXT_TYPE) {
        var contents = item.parentStory.contents.toString();
        var containedItems = item.parentStory.allPageItems;
        // WRITE STORY
        //////////////////  PREVIOUSLY:
        //////////////////  textFile.writeln(wacify(contents));
        textFile.writeln(contents);

        //GET ANCHORED OBJET ALT TEXT
        for (var k = 0; k < containedItems.length; k++) {
          var containedItem = containedItems[k];
          if (!containedItem.hasOwnProperty("objectExportOptions")) continue;
          var containedAltText = containedItem.objectExportOptions.customAltText;
          if (containedAltText) textFile.writeln(containedAltText);
        }
      } else {
        // WRITE ALT TEXT IF NOT STORY
        var altText = item.objectExportOptions.customAltText;
        if (altText) textFile.writeln(altText);
      }
    }
  }

  textFile.close();
  textFile.execute();

  // function wacify(text) {
  //   return (
  //     text
  //       .replace(/ /g, " ")
  //       .replace(/\n/, " ")
  //       .replace(/ {2,}/g, " ")
  //       .replace(/ +([\n\r])/g, "$1")
  //       .replace(/[\n\r]{2,}/g, "\n")
  //       .replace(/support *[\n\r]+(\d{1,2}%) oppose *[\n\r]+/g, "support, while $1 oppose, ")
  //       .replace(/agree *[\n\r]+(\d{1,2}%) disagree *[\n\r]+/g, "agree, while $1 disagree, ")
  //       .replace(/[\n\r]([£€]?\d+(?:[,\.]\d+)*(?:%|(?: ?\w+?))) ([iy]n) 20(\d\d)/g, " ($1 $2 20$3)")
  //       .replace(/[\n\r]([£€]?\d+(?:[,\.]\d+)*(?:%|(?: ?\w+?))) sa bhliain 20(\d\d)/g, " ($1 sa bhliain 20$2)")
  //       .replace(/(20\d\d) *[\n\r](\d+%) *$/gm, "$2 yn $1")
  //       .replace(/(\w)([\n\r])(\d+%?)([\n\r]|$)/g, "$1: $3 \n") // this one edited out before
  //       .replace(/(0{3})[\n\r]((?:\d|x)+%)([\n\r]|$)/g, "$1 (or $2) \n") // this one edited out before
  //       .replace(/(?<![\?\)] *)[\n\r](\d+%?,?\d*)( *[\n\r])/g, ": $1 \n") // this one edited out before
  //       .replace(/(:[^:\n\r]+): ([^\n\r]+)/g, "$1 or $2") // this one edited out before
  //       .replace(/ [\n\r]/g, "\n") + "\n"
  //   );
  // }
})();
