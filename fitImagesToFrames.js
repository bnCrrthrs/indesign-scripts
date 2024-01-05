(function () {
  if (app.documents.length === 0 || app.activeDocument.pageItems.length === 0) {
    return;
  }

  var doc = app.activeDocument;
  var frames = doc.pageItems;
  var transformationMatrix = app.transformationMatrices.add();
  transformationMatrix = transformationMatrix.rotateMatrix(90);
  if (frames.length > 0 && !confirm("Do you want to fit all graphics to their frames?")) return;
  app.activeWindow.transformReferencePoint = AnchorPoint.CENTER_ANCHOR;

  for (var i = 0, length = frames.length; i < length; i++) {
    var frame = frames[i];
    if (frame.contentType !== ContentType.GRAPHIC_TYPE) continue;

    var img = frame.allGraphics[0];
    img.fit(FitOptions.CENTER_CONTENT);
    img.absoluteRotationAngle = 0;
    img.horizontalScale = img.verticalScale;

    var frameIsPortrait = isPortrait(frame);
    var imgIsPortrait = isPortrait(img);

    if ((frameIsPortrait || imgIsPortrait) && !(frameIsPortrait && imgIsPortrait)) {
      img.transform(CoordinateSpaces.PASTEBOARD_COORDINATES, AnchorPoint.CENTER_ANCHOR, transformationMatrix);
    }
    img.fit(FitOptions.FILL_PROPORTIONALLY);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Helper functions

  function isPortrait(item) {
    var width = getWidth(item);
    var height = getHeight(item);
    return height > width;
  }

  function getWidth(item) {
    return item.geometricBounds[3] - item.geometricBounds[1];
  }

  function getHeight(item) {
    return item.geometricBounds[2] - item.geometricBounds[0];
  }
})();

/* 

// ORIGINAL VERSION

(function () {
  if (app.documents.length === 0 || app.activeDocument.pageItems.length === 0) {
    return;
  }

  var doc = app.activeDocument;
  var frames = doc.pageItems;
  var noFrames = frames.length;

  var transformationMatrix = app.transformationMatrices.add();
  transformationMatrix = transformationMatrix.rotateMatrix(90);

  for (var i = 0; i < noFrames; i++) {
    var frame = frames[i];
    if (frame.contentType !== ContentType.GRAPHIC_TYPE) continue;
    var img = frame.allGraphics[0];

    // START OF NEW BIT

    var xOffset = (frame.geometricBounds[1] + frame.geometricBounds[3]) / 2 - (img.geometricBounds[1] + img.geometricBounds[3]) / 2;
    var yOffset = (frame.geometricBounds[0] + frame.geometricBounds[2]) / 2 - (img.geometricBounds[0] + img.geometricBounds[2]) / 2;

    img.move(undefined, [xOffset,yOffset]);

    // END OF NEW BIT

    var frameIsPortrait = isPortrait(frame);
    var imgIsPortrait = isPortrait(img);

    if ((frameIsPortrait || imgIsPortrait) && !(frameIsPortrait && imgIsPortrait)) {
      img.transform(CoordinateSpaces.PASTEBOARD_COORDINATES, AnchorPoint.CENTER_ANCHOR, transformationMatrix);
    }

    var frameWidth = getWidth(frame);
    var frameHeight = getHeight(frame);
    var imgWidth = getWidth(img);
    var imgHeight = getHeight(img);

    var heightRatio = frameHeight / imgHeight;
    var widthRatio = frameWidth / imgWidth;

    var scaleToFill = Math.max(heightRatio, widthRatio);
    img.horizontalScale *= scaleToFill;
    img.verticalScale *= scaleToFill;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Helper functions

  function isPortrait(item) {
    var width = getWidth(item);
    var height = getHeight(item);
    return height > width;
  }

  function getWidth(item) {
    return item.geometricBounds[3] - item.geometricBounds[1];
  }

  function getHeight(item) {
    return item.geometricBounds[2] - item.geometricBounds[0];
  }
})();
 */
