// filterSelectedTextFrames.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// Filters the current selection to include only text frames.

// my keyboard shortcut: ctrl + opt + cmd + t

(function () {
  if (!app.selection.length || app.selection[0].parent.constructor.name === "Story") return;
  for (var i = app.selection.length - 1; i >= 0; i--) {
    var item = app.selection[i];
    if (item instanceof TextFrame) continue;
    item.select(SelectionOptions.REMOVE_FROM);
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
