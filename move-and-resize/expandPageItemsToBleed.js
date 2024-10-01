// expandPageItemsToBleed.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// Looks for page items near the edge of the current page and expands them to
// the page bleed. (Also has the effect of cropping things at the bleed lines).

// Applies only to selected items if a selection is made, or to all items on
// the current page if no selection is made.

// If one of the items contains text it will ask whether text items should be
// ignored, because resizing them can adjust the flow of text across frames.

// The variable 'tolerance' determines how close to the edge of the page an
// item needs to be in order to be expanded. When set to 1, anything within
// 1mm of the edge of the page will get expanded. Adjust the value to affect
// page items closer or further from the edge.

// my keyboard shortcut: ctrl + opt + cmd + E

app.doScript(
  function () {
    var tolerance = 1;
    var window = app.activeWindow;
    if (!window) return;
    var spread = window.activeSpread;
    if (!spread) return;
    var doc = app.activeDocument;
    if (!doc) return;

    var oldUnitsH = doc.viewPreferences.horizontalMeasurementUnits;
    var oldUnitsV = doc.viewPreferences.verticalMeasurementUnits;
    doc.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.MILLIMETERS;
    doc.viewPreferences.verticalMeasurementUnits = MeasurementUnits.MILLIMETERS;

    var problemItems = 0;
    var ignoreTextFrames = undefined;

    var selectionExists = app.selection.length !== 0 && app.selection[0].parent.constructor.name !== "Story";

    for (var p = 0; p < spread.pages.length; p++) {
      var page = spread.pages[p];
      var items = [];

      if (!selectionExists) {
        items = page.pageItems;
      } else {
        for (var s = 0; s < app.selection.length; s++) {
          var selItem = app.selection[s];
          if (selItem.parentPage === page) items.push(selItem);
        }
      }

      var pageTop = page.bounds[0];
      var pageLeft = page.bounds[1];
      var pageBottom = page.bounds[2];
      var pageRight = page.bounds[3];

      var bleedTop = pageTop - document.documentPreferences.documentBleedTopOffset;
      var bleedLeft = pageLeft - document.documentPreferences.documentBleedInsideOrLeftOffset;
      var bleedBottom = pageBottom + document.documentPreferences.documentBleedBottomOffset;
      var bleedRight = pageRight + document.documentPreferences.documentBleedOutsideOrRightOffset;

      for (var i = 0, l = items.length; i < l; i++) {
        var item = items[i];
        var isTexty = item.hasOwnProperty("texts");
        if (!item.visible) continue;
        if (isTexty && ignoreTextFrames) continue;

        var adjusted = false;

        var top = item.geometricBounds[0];
        var left = item.geometricBounds[1];
        var bottom = item.geometricBounds[2];
        var right = item.geometricBounds[3];

        if (top - tolerance <= pageTop) {
          top = bleedTop;
          adjusted = true;
        }
        if (left - tolerance <= pageLeft) {
          left = bleedLeft;
          adjusted = true;
        }
        if (bottom + tolerance >= pageBottom) {
          bottom = bleedBottom;
          adjusted = true;
        }
        if (right + tolerance >= pageRight) {
          right = bleedRight;
          adjusted = true;
        }

        if (!adjusted) continue;

        if (isTexty && ignoreTextFrames === undefined) {
          ignoreTextFrames = confirm("Do you want to skip text frames?");
          if (ignoreTextFrames) continue;
        }

        var isLocked = item.locked;
        item.locked = false;

        try {
          item.geometricBounds = [top, left, bottom, right];
        } catch (_) {
          app.select(item, SelectionOptions.ADD_TO);
          problemItems++;
        }
        item.locked = isLocked;
      }
    }

    doc.viewPreferences.horizontalMeasurementUnits = oldUnitsH;
    doc.viewPreferences.verticalMeasurementUnits = oldUnitsV;
    if (problemItems) alert(problemItems + " tricky items on this page");
  },
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Expand page items to bleed"
);

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
