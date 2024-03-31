// goToNextPage.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// Navigates to the next page of the current document,
// and all other open documents to the equivalent page.

// my keyboard shortcut: shift + fn + ctrl + down

(function () {
  var windows = app.layoutWindows;
  var activeWindow = app.activeWindow;
  if (windows.length < 1 || !activeWindow.isValid || activeWindow.constructor.name !== "LayoutWindow") return;
  var currentPage = activeWindow.activePage;
  if (!currentPage) return;
  var spreadIndex = currentPage.parent.index;
  for (var i = 0; i < windows.length; i++) {
    try {
      var window = windows[i];
      var doc = window.parent;
      var spread = doc.spreads[spreadIndex + 1];
      window.activeSpread = spread;
      window.zoom(ZoomOptions.SHOW_PASTEBOARD);
    } catch (_) {}
  }
})();

/*
    // zoom options:
ZoomOptions.ACTUAL_SIZE
ZoomOptions.FIT_PAGE
ZoomOptions.FIT_SPREAD
ZoomOptions.SHOW_PASTEBOARD
ZoomOptions.ZOOM_IN
ZoomOptions.ZOOM_OUT
*/

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
