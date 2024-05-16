// exportArticleText.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// Saves a text file of all text contained in an Article
// in the Articles panel. Includes alt - text for images.
// Currently anchored images have their alt - text placed
// at the end of the story they are anchored in.

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
        var chars = item.parentStory.characters;
        for (var k = 0, l = chars.length; k < l; k++) {
          var character = chars[k];
          var contents = character.contents;
          if (typeof contents !== "string") {
            textFile.write(charFromEnum(character));
          } else if (contents.charCodeAt(0) === 65532) {
            for (var m = 0; m < character.allPageItems.length; m++) {
              var pItem = character.allPageItems[m];
              if (!pItem.hasOwnProperty("objectExportOptions")) continue;
              var altText = pItem.objectExportOptions.customAltText;
              if (altText) textFile.write(" [GRAPHIC: " + altText + "] ");
            }
          } else {
            textFile.write(contents);
          }
        }

        /* 
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
        */
      } else {
        // WRITE ALT TEXT IF NOT STORY
        var altText = item.objectExportOptions.customAltText;
        if (altText) textFile.writeln(altText);
      }
      textFile.write("\n");
    }
  }

  textFile.close();
  textFile.execute();

  function charFromEnum(ch) {
    switch (ch.contents) {
      case SpecialCharacters.EM_SPACE:
      case SpecialCharacters.EN_SPACE:
      case SpecialCharacters.FIGURE_SPACE:
      case SpecialCharacters.FIXED_WIDTH_NONBREAKING_SPACE:
      case SpecialCharacters.FLUSH_SPACE:
      case SpecialCharacters.HAIR_SPACE:
      case SpecialCharacters.NONBREAKING_SPACE:
      case SpecialCharacters.PUNCTUATION_SPACE:
      case SpecialCharacters.QUARTER_SPACE:
      case SpecialCharacters.SIXTH_SPACE:
      case SpecialCharacters.THIN_SPACE:
      case SpecialCharacters.THIRD_SPACE:
        return " ";

      case SpecialCharacters.DISCRETIONARY_HYPHEN:
      case SpecialCharacters.DISCRETIONARY_LINE_BREAK:
      case SpecialCharacters.END_NESTED_STYLE:
      case SpecialCharacters.ZERO_WIDTH_JOINER:
      case SpecialCharacters.ZERO_WIDTH_NONJOINER:
        return "";

      case SpecialCharacters.DOUBLE_LEFT_QUOTE:
      case SpecialCharacters.DOUBLE_RIGHT_QUOTE:
      case SpecialCharacters.DOUBLE_STRAIGHT_QUOTE:
      case SpecialCharacters.HEBREW_GERSHAYIM:
        return '"';
      case SpecialCharacters.SINGLE_LEFT_QUOTE:
      case SpecialCharacters.SINGLE_RIGHT_QUOTE:
      case SpecialCharacters.SINGLE_STRAIGHT_QUOTE:
      case SpecialCharacters.HEBREW_GERESH:
        return "'";

      case SpecialCharacters.AUTO_PAGE_NUMBER:
      case SpecialCharacters.NEXT_PAGE_NUMBER:
      case SpecialCharacters.PREVIOUS_PAGE_NUMBER:
        return "[page number ###]";

      case SpecialCharacters.COLUMN_BREAK:
      case SpecialCharacters.FORCED_LINE_BREAK:
      case SpecialCharacters.FRAME_BREAK:
      case SpecialCharacters.EVEN_PAGE_BREAK:
      case SpecialCharacters.ODD_PAGE_BREAK:
      case SpecialCharacters.PAGE_BREAK:
      case SpecialCharacters.SECTION_MARKER:
        return "\n";

      case SpecialCharacters.NONBREAKING_HYPHEN:
      case SpecialCharacters.ARABIC_KASHIDA:
      case SpecialCharacters.HEBREW_MAQAF:
        return "-";

      case SpecialCharacters.EM_DASH:
      case SpecialCharacters.EN_DASH:
        return "\u2013";
      case SpecialCharacters.BULLET_CHARACTER:
        return "\u2022";
      case SpecialCharacters.ARABIC_COMMA:
        return ",";
      case SpecialCharacters.ARABIC_QUESTION_MARK:
        return "?";
      case SpecialCharacters.ARABIC_SEMICOLON:
        return ";";
      case SpecialCharacters.HEBREW_SOF_PASUK:
        return ":";
      case SpecialCharacters.DEGREE_SYMBOL:
        return "\u00B0";
      case SpecialCharacters.DOTTED_CIRCLE:
        return "\u25cc";
      case SpecialCharacters.ELLIPSIS_CHARACTER:
        return "...";

      case SpecialCharacters.INDENT_HERE_TAB:
      case SpecialCharacters.RIGHT_INDENT_TAB:
        return "\t";

      case SpecialCharacters.LEFT_TO_RIGHT_EMBEDDING:
      case SpecialCharacters.LEFT_TO_RIGHT_MARK:
      case SpecialCharacters.LEFT_TO_RIGHT_OVERRIDE:
        return "\u21b1";

      case SpecialCharacters.RIGHT_TO_LEFT_EMBEDDING:
      case SpecialCharacters.RIGHT_TO_LEFT_MARK:
      case SpecialCharacters.RIGHT_TO_LEFT_OVERRIDE:
        return "\u21b0";

      case SpecialCharacters.POP_DIRECTIONAL_FORMATTING:
        return "\u21b3";

      case SpecialCharacters.COPYRIGHT_SYMBOL:
        return "(c)";
      case SpecialCharacters.REGISTERED_TRADEMARK:
        return "(R)";
      case SpecialCharacters.TRADEMARK_SYMBOL:
        return "(TM)";

      case SpecialCharacters.SECTION_SYMBOL:
        return "\u00a7";
      case SpecialCharacters.PARAGRAPH_SYMBOL:
        return "\u00b6";

      case SpecialCharacters.FOOTNOTE_SYMBOL:
        return "[footnote ref #]";

      case SpecialCharacters.TEXT_VARIABLE:
        return variablesFromCh(ch);
    }
  }

  function variablesFromCh(ch) {
    var value = "";
    for (var vI = 0; vI < ch.textVariableInstances.length; vI++) {
      value += ch.textVariableInstances[vI].resultText;
    }
    return value;
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
