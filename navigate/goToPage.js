// goToPage.js
// Copyright (C) 2024 Ben Carruthers

// Prompts you for a page number, and navigates to that page
// for each open document where possible.

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
// my keyboard shortcut: ctrl + opt + cmd + j

(function () {
  var windows = app.layoutWindows;
  if (windows.length < 1) return;
  var goTo = prompt("Go to page", "");
  for (var i = 0; i < windows.length; i++) {
    try {
      var window = windows[i];
      var doc = window.parent;
      var page = doc.pages[+goTo - 1];
      window.activePage = page;
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
