//JUST WACI
// my keyboard shortcut: ctrl + opt + cmd + down

(function () {
  if (app.documents.length == 0 || app.selection.length == 0) return;

  var originalObjects = [];
  var nextObjects = [];

  //THIS FOR LOOP JUST FOR WACI
  //NORMALLY JUST USE app.selection RATHER THAN originalObjects ARRAY
  for (var i = app.selection.length - 1; i >= 0; i--) {
    var obj = app.selection[i];

    if (obj instanceof TextFrame && /%/.test(obj.texts[0].contents)) {
      originalObjects.push(obj);
    } else if (!(obj instanceof TextFrame) && Math.round(obj.geometricBounds[3] - obj.geometricBounds[1]) < 40) {
      originalObjects.push(obj);
    }
  }

  for (var i = originalObjects.length - 1; i >= 0; i--) {
    var obj = originalObjects[i];

    // THIS IS A STUPID BIT JUST FOR WACI
    var layerItems = obj.itemLayer.allPageItems;
    for (var j = 0, l = layerItems.length; j < l; j++) {
      if (layerItems[j] == obj) {
        if (!(layerItems[j] instanceof TextFrame)) {
          // for (var k = j - 1; k >= 0; k--) {
          //   if (Math.round(layerItems[k].geometricBounds[3] - layerItems[k].geometricBounds[1]) < 40) {
          //     nextObjects.push(layerItems[k]);
          //     break;
          //   }
          // }
          nextObjects.push(layerItems[j - 1]);
        } else {
          for (var k = j - 1; k >= 0; k--) {
            if (/%/.test(layerItems[k].texts[0].contents)) {
              nextObjects.push(layerItems[k]);
              break;
            }
          }
        }
        break;
      }
    }
  }

  for (var i = app.selection.length - 1; i >= 0; i--) {
    var obj = app.selection[i];
    obj.select(SelectionOptions.REMOVE_FROM);
  }

  for (var i = nextObjects.length - 1; i >= 0; i--) {
    try {
      nextObjects[i].select(SelectionOptions.ADD_TO);
    } catch (_) {}
  }
})();

/*

//THIS IS GOOD 
(function () {
  if (app.documents.length == 0 || app.selection.length == 0) return;

  var originalObjects = [];
  var nextObjects = [];

  //THIS FOR LOOP JUST FOR WACI
  //NORMALLY JUST USE app.selection RATHER THAN originalObjects ARRAY
  for (var i = app.selection.length - 1; i >= 0; i--) {
    var obj = app.selection[i];

    if (obj instanceof TextFrame && /%/.test(obj.texts[0].contents)) {
      originalObjects.push(obj);
    } else if (!(obj instanceof TextFrame) && Math.round(obj.geometricBounds[3] - obj.geometricBounds[1]) < 40) {
      originalObjects.push(obj);
    }
  }

  for (var i = originalObjects.length - 1; i >= 0; i--) {
    var obj = originalObjects[i];

    var ind = obj.index;
    var layerItems = obj.itemLayer.allPageItems;
    for (var j = 0, l = layerItems.length; j < l; j++) {
      if (layerItems[j] == obj) {
        nextObjects.push(layerItems[j - 1]);
        break;
      }
    }
  }

  for (var i = app.selection.length - 1; i >= 0; i--) {
    var obj = app.selection[i];
    obj.select(SelectionOptions.REMOVE_FROM);
  }

  for (var i = nextObjects.length - 1; i >= 0; i--) {
    try {
      nextObjects[i].select(SelectionOptions.ADD_TO);
    } catch (_) {}
  }
})();
*/

/*
// JUST WACI 
// USING INVOKE

(function () {
  if (app.documents.length == 0 || app.selection.length == 0) return;

  var originalObjects = [];
  var nextObjects = [];

  for (var i = app.selection.length - 1; i >= 0; i--) {
    var obj = app.selection[i];
    if (obj instanceof TextFrame && /%/.test(obj.texts[0].contents)) {
      originalObjects.push(obj);
    } else if (!(obj instanceof TextFrame) && Math.round(obj.geometricBounds[3] - obj.geometricBounds[1]) < 40) {
      originalObjects.push(obj);
    }
  }

  for (var i = originalObjects.length - 1; i >= 0; i--) {
    var obj = originalObjects[i];
    obj.select(SelectionOptions.REPLACE_WITH);
    app.menuActions.itemByID(11287).invoke();
    var nextObj = app.selection[0];
    nextObjects.push(nextObj);
  }

  for (var i = app.selection.length - 1; i >= 0; i--) {
    var obj = app.selection[i];
    obj.select(SelectionOptions.REMOVE_FROM);
  }

  for (var i = nextObjects.length - 1; i >= 0; i--) {
    nextObjects[i].select(SelectionOptions.ADD_TO);
  }
})();

*/

//REGULAR
// (function () {
//   if (app.documents.length == 0 || app.selection.length == 0) return;

//   var originalObjects = [];
//   var nextObjects = [];

//   for (var i = app.selection.length - 1; i >= 0; i--) {
//     var obj = app.selection[i];
//     originalObjects.push(obj);
//   }

//   for (var i = originalObjects.length - 1; i >= 0; i--) {
//     var obj = originalObjects[i];
//     obj.select(SelectionOptions.REPLACE_WITH);
//     app.menuActions.itemByID(11287).invoke();
//     var nextObj = app.selection[0];
//     nextObjects.push(nextObj);
//   }

//   for (var i = app.selection.length - 1; i >= 0; i--) {
//     var obj = app.selection[i];
//     obj.select(SelectionOptions.REMOVE_FROM);
//   }

//   for (var i = nextObjects.length - 1; i >= 0; i--) {
//     nextObjects[i].select(SelectionOptions.ADD_TO);
//   }
// })();
