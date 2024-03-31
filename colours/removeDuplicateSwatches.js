// removeDuplicateSwatches.js
// Copyright (C) 2024 Ben Carruthers

// Finds colours in your swatches panel that have the same
// colour space and colour values, and merges them together.

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
  if (app.documents.length === 0 || app.activeDocument.pageItems.length === 0) {
    return;
  }

  var doc = app.activeDocument;
  var swatches = doc.swatches;
  var deleteCount = 0;
  for (var i = swatches.length - 1; i > 0; i--) {
    var swatchA = swatches[i];
    var matchID = undefined;
    try {
      var aSpace = swatchA.space;
      var aValue = swatchA.colorValue;
      var aID = swatchA.id;
    } catch (_) {
      continue;
    }

    for (var j = 0; j < i; j++) {
      var swatchB = swatches[j];
      try {
        var bSpace = swatchB.space;
        var bValue = swatchB.colorValue;
        var bID = swatchB.id;
      } catch (_) {
        continue;
      }

      if (aID == bID) continue;
      if (aSpace != bSpace) continue;
      if (!equalValues(aValue, bValue)) continue;

      matchID = bID;
      break;
    }

    if (matchID === undefined) {
      setNameAsValue(swatchA);
    } else {
      swatchA.remove(swatches.itemByID(matchID));
      deleteCount++;
    }
  }

  if (deleteCount == 0) {
    alert("No duplicate swatches found");
  } else if (deleteCount == 1) {
    alert("One duplicate swatch removed");
  } else {
    alert(deleteCount + " duplicate swatches removed");
  }

  function equalValues(aValue, bValue) {
    if (aValue.length != bValue.length) return false;
    for (var i = 0; i < aValue.length; i++) {
      if (Math.round(aValue[i]) != Math.round(bValue[i])) return false;
    }
    return true;
  }

  function setNameAsValue(swatch) {
    try {
      var value = swatch.colorValue;
      var space = swatch.space.toString().split("");
      if (value.length !== space.length) return;
      var name = "";

      for (var i = 0; i < value.length; i++) {
        if (i !== 0) name += " ";
        name += space[i] + "=" + Math.round(value[i]);
      }
      swatch.name = name;
    } catch (_) {}
  }
})();
