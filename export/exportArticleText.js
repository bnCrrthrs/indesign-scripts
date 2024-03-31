// exportArticleText.js
// Copyright (C) 2024 Ben Carruthers

// Saves a text file of all text contained in an Article
// in the Articles panel. Includes alt - text for images.
// Currently anchored images have their alt - text placed
// at the end of the story they are anchored in.

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
})();
