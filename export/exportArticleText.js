// exportArticleText.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// Saves a text file of all text contained in an Article in the articles
// panel. Includes alt-text for images, footnotes and endnotes, and markdown style headings.

(function () {
  if (app.documents.length === 0) return;
  var doc = app.activeDocument;
  if (!doc.saved) return;
  var articles = doc.articles;
  if (!articles.length) return;

  var al = articles.length;
  progress("Exporting...");
  progress.setArt(al);

  var currentItemIsEndnoteFrame = false;
  var containedEndnotes;
  var currentEndnote;
  var endnoteRefCounter = 1;
  var endnoteContentCounter = 1;
  var buffer = "";

  var footnoteSeparator = new RegExp(
    "^." +
      document.footnoteOptions.separatorText
        .toString()
        .replace(/([\.\+\*\)])/g, "\\$1")
        .replace("\t", "\\t")
  );

  var txtFileName = doc.fullName.toString().replace(/\.\w+$/, "_ARTICLE-TEXT.txt");
  var textFile = new File(txtFileName);
  textFile.encoding = "UTF-8";

  textFile.open("w");
  textFile.writeln(doc.name);

  for (var i = 0, l = doc.name.length; i < l; i++) {
    buffer += "=";
  }
  buffer += "\n\n";
  textFile.write(buffer);

  // + LOOP OVER ARTICLES
  for (var ai = 0; ai < al; ai++) {
    var article = articles[ai];
    var members = article.articleMembers;
    var ml = members.length;
    progress.setMem(ml);
    textFile.writeln("");

    // + LOOP OVER ARTICLE MEMBERS
    for (var mi = 0; mi < ml; mi++) {
      var item = members[mi].itemRef;
      containedEndnotes = 0;

      // + FOR TEXT ARTICLE MEMBERS
      if (item.hasOwnProperty("contentType") && item.contentType == ContentType.TEXT_TYPE) {
        var story = item.parentStory;
        var paras = story.paragraphs;
        var pl = paras.length;
        progress.setParas(pl);

        currentItemIsEndnoteFrame = item instanceof EndnoteTextFrame;
        containedEndnotes = story.endnotes.length;
        currentEndnote = 0;

        // + LOOP OVER PARAGRAPHS
        for (var pi = 0; pi < pl; pi++) {
          var para = paras[pi];
          // var isHeader = false;
          var prequel = "\n";
          var sequel = "\n";
          var isList = false;
          var listLevel = 0;

          // Add hashes to headings
          var styleExpMap = para.appliedParagraphStyle.styleExportTagMaps;
          if (styleExpMap.length) {
            var tag = styleExpMap[0].exportTag;
            if (tag == "Artefact") {
              progress.inc();
              continue;
            }
            if (tag.match(/^h\d$/i)) {
              // isHeader = true;
              prequel += "\n";
              var hLevel = +tag[1];
              for (var hlI = 0; hlI < hLevel; hlI++) {
                prequel += "#";
              }
              for (var uI = 0, uL = para.contents.toString().replace(/^\s/g, "").replace(/\s$/g, "").length + hLevel + 1; uI < uL; uI++) {
                sequel += "=";
              }
              prequel += " ";
              sequel += "\n";
            }
          }

          // check for special chars
          var allCharsAreStrings = true;
          buffer = "";
          for (var ci = 0, cl = para.characters.length; ci < cl; ci++) {
            if (typeof para.characters[ci] !== "string") {
              allCharsAreStrings = false;
              break;
            }
          }

          // write para contents
          if (allCharsAreStrings) {
            textFile.write(prequel + para.contents + sequel);
          } else {
            for (var ci = 0, cl = para.characters.length; ci < cl; ci++) {
              var character = para.characters[ci];
              var contents = character.contents;
              if (typeof contents !== "string") {
                var result = charFromEnum(character);
                if (typeof result === "object") {
                  buffer += result.refs;
                  sequel += result.notes;
                } else {
                  buffer += result;
                }
                // buffer += charFromEnum(character);
                // textFile.write(charFromEnum(character));
              } else if (contents.charCodeAt(0) === 65532) {
                for (var m = 0; m < character.allPageItems.length; m++) {
                  var pItem = character.allPageItems[m];
                  if (!pItem.hasOwnProperty("objectExportOptions")) continue;
                  var altText = pItem.objectExportOptions.customAltText;
                  if (altText) buffer += "[Graphic: " + altText + "]";
                }
              } else {
                buffer += contents;
              }
            }
            textFile.write(prequel + buffer + sequel);
          }
          progress.inc();
        }
      } else {
        // + FOR NON-TEXT ARTICLE MEMBERS
        var altText = item.objectExportOptions.customAltText;
        if (altText) textFile.write("[Graphic: " + altText + "]");
        progress.inc();
      }
      textFile.write("\n");
    }
  }

  textFile.close();
  progress.close();
  textFile.execute();

  // * HELPER FUNCTIONS

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
        return getFootnoteOrEndnote(ch); //

      case SpecialCharacters.TEXT_VARIABLE:
        return variablesFromCh(ch);

      default:
        return "\ufffd";
    }
  }

  function variablesFromCh(ch) {
    var value = "";
    for (var vI = 0; vI < ch.textVariableInstances.length; vI++) {
      value += ch.textVariableInstances[vI].resultText;
    }
    return value;
  }

  function getFootnoteOrEndnote(ch) {
    var refAcc = "";
    var noteAcc = "";
    for (var i = 0, l = ch.footnotes.length; i < l; i++) {
      var noteIndex = ch.footnotes[i].index + 1;
      refAcc += "[Footnote ref " + noteIndex + "]";

      noteAcc +=
        "[Footnote " +
        noteIndex +
        ": " +
        ch.footnotes[i].contents
          .toString()
          .replace(footnoteSeparator, "")
          .replace(/[^\S\r\n]+/g, " ")
          .replace(/\s+$/, "") +
        "]";
    }

    if (!refAcc && containedEndnotes > currentEndnote) {
      currentEndnote++;
      refAcc += "[Endnote " + endnoteRefCounter++ + "]";
    } else if (!refAcc && currentItemIsEndnoteFrame) {
      refAcc += endnoteContentCounter++;
    }

    return { refs: refAcc, notes: noteAcc ? "\n" + noteAcc + "\n" : "" };
  }

  function progress(msg) {
    var window = new Window("palette", "Progress", undefined, { closeButton: false });
    var text = window.add("statictext", undefined, msg);
    var bar = window.add("progressbar");
    var artLength;
    var memLength;
    var paraLength;
    var step;
    text.preferredSize = [450, -1];
    bar.preferredSize = [450, -1];

    progress.close = function () {
      window.close();
    };

    progress.setArt = function (arts) {
      bar.value = 0;
      bar.minvalue = 0;
      bar.maxvalue = arts;
      artLength = arts;
    };

    progress.setMem = function (mems) {
      memLength = mems;
      step = Math.min(1 / mems, 1);
    };

    progress.setParas = function (paras) {
      paraLength = paras;
      step = Math.min(artLength / memLength / paras, 1);
    };

    progress.resetMem = function () {
      step = Math.min(1 / memLength, 1);
    };

    progress.inc = function () {
      bar.value += step;
      window.update();
    };

    window.show();
    window.update();
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
