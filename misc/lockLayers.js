// lockLayers.js
// Copyright (C) 2024 Ben Carruthers
// Licensed under the terms of the GNU GPL v3. More details below.

// If objects are selected, all /other/ layers get locked.
// If no objects are selected, /all/ layers get locked.
// If all layers are already locked, they all get unlocked.

// my keyboard shortcut: ctrl + shift + L

app.doScript(
  lockLayers,
  ScriptLanguage.JAVASCRIPT,
  void 0,
  UndoModes.ENTIRE_SCRIPT,
  "Lock / unlock all layers"
);

function allLayersLocked() {
  var doc = app.activeDocument;
  for (var i = 0; i < doc.layers.length; i++) {
    if (!doc.layers[i].locked) return false;
  }
  return true;
}

function lockAllLayers(bool) {
  var doc = app.activeDocument;
  for (var i = 0; i < doc.layers.length; i++) {
    doc.layers[i].locked = bool;
  }
}

function pushToSet(set, item) {
  for (var i = 0; i < set.length; i++) {
    if (set[i] === item) return;
  }
  set.push(item);
}

function lockLayers() {
  var doc = app.activeDocument;
  if (!doc) return;
  if (allLayersLocked()) return lockAllLayers(false);
  if (!doc.selection.length) return lockAllLayers(true);

  var selectedLayers = [];
  for (var i = 0; i < doc.selection.length; i++) {
    var item;
    if (doc.selection[i].parent.constructor.name === "Story") {
      for (var j = 0; j < doc.selection[i].parentTextFrames.length; j++) {
        pushToSet(
          selectedLayers,
          doc.selection[i].parentTextFrames[j].itemLayer
        );
      }
    } else {
      pushToSet(selectedLayers, doc.selection[i].itemLayer);
    }
  }

  lockAllLayers(true);
  for (var i = 0; i < selectedLayers.length; i++) {
    selectedLayers[i].locked = false;
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
