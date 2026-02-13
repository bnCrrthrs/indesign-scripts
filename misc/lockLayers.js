// lockLayers.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// Locks all layers, or unlocks them if they are all already locked.

// my keyboard shortcut: ctrl + shift + L

app.doScript(
  lockLayers,
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Lock / unlock all layers"
);

function lockLayers() {
  var doc = app.activeDocument;
  if (!doc) return;
  var allLayersLocked = true;

  for (var i = 0; i < doc.layers.length; i++) {
    var layer = doc.layers[i];
    if (layer.locked) continue;
    allLayersLocked = false;
    break;
  }

  for (var i = 0; i < doc.layers.length; i++) {
    var layer = doc.layers[i];
    layer.locked = !allLayersLocked;
  }
}

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
