// expandPageItemsToBleed.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// looks at all the items on the current page and if they're closer than 1mm to the edge of the page (or beyond)
// expands them all the way to the bleed. (Also has the effect of cropping things at the bleed lines)
// If an item contains text, it will check to confirm whether text items should be ignored.

// ! ACTUALLY moves items if they're 1 unit, not 1mm 
// ! TODO change this to set unit prefs to mm
// ! TODO also set to not treat empty texty items as texty?

app.doScript(
  function () {
    var tolerance = 1;
    var window = app.activeWindow;
    if (!window) return;
    var page = window.activePage;
    if (!page) return;

    var items = page.pageItems;

    var pageTop = page.bounds[0];
    var pageLeft = page.bounds[1];
    var pageBottom = page.bounds[2];
    var pageRight = page.bounds[3];

    var bleedTop = pageTop - document.documentPreferences.documentBleedTopOffset;
    var bleedLeft = pageLeft - document.documentPreferences.documentBleedInsideOrLeftOffset;
    var bleedBottom = pageBottom + document.documentPreferences.documentBleedBottomOffset;
    var bleedRight = pageRight + document.documentPreferences.documentBleedOutsideOrRightOffset;

    var problemItems = 0;
    var ignoreTextFrames = undefined;

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
