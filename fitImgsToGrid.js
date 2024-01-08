(function () {
  var doc = app.activeDocument;
  var folder;
  var imgFormats = ["jpg", "png", "psd", "ai", "eps", "pdf", "svg", "tiff", "gif", "jpeg", "bmp", "heic", "pdf"];
  var contents = [];
  var recur;

  var marginTop = doc.marginPreferences.top;
  var marginRight = doc.marginPreferences.right;
  var marginBottom = doc.marginPreferences.bottom;
  var marginLeft = doc.marginPreferences.left;
  var gutter = doc.marginPreferences.columnGutter;
  var pageWidth = doc.documentPreferences.pageWidth;
  var pageHeight = doc.documentPreferences.pageHeight;
  var availableWidth = pageWidth - (marginLeft + marginRight);
  var availableHeight = pageHeight - (marginBottom + marginTop);
  var rows = 4;
  var cols = 2;
  var maxRows, maxCols;
  var facingPages = doc.documentPreferences.facingPages;

  if (availableWidth <= 0) {
    availableWidth = pageWidth;
    marginLeft = 0;
  }
  if (availableHeight <= 0) {
    availableHeight = pageHeight;
    marginTop = 0;
  }

  if (gutter === 0) {
    maxRows = Math.floor(availableHeight);
    maxCols = Math.floor(availableWidth);
  } else {
    maxRows = Math.floor(availableHeight / gutter);
    maxCols = Math.floor(availableWidth / gutter);
  }

  //+ Select Folder dialog
  var window = new Window("dialog", "Fit images to grid");
  window.alignChildren = "fill";

  // dialog
  var group = window.add("group");

  // choose folder
  var folderBtn = group.add("button", undefined, "Folder...");
  var folderName = group.add("statictext", undefined, "", { truncate: "middle" });
  folderName.text = "Choose folder...";
  folderName.preferredSize = [250, -1];

  // input rows & columns
  var panel = window.add("panel", undefined, "Grid layout");
  group = panel.add("group");

  group.add("statictext", undefined, "Columns: ");
  var colInput = group.add("edittext", undefined, "2");

  group.add("statictext", undefined, "Rows: ");
  var rowInput = group.add("edittext", undefined, "4");

  colInput.helpTip = "Maximum: " + maxCols;
  colInput.characters = rowInput.characters = 4;
  rowInput.helpTip = "Maximum: " + maxRows;

  // recursive
  group = window.add("group");
  var btnRecur = group.add("checkbox", undefined, "Include subfolders");

  // ok & cancel buttons
  group = window.add("group");
  group.alignment = "right";
  var btnOK = group.add("button", undefined, "OK");
  var btnCancel = group.add("button", undefined, "Cancel");
  btnOK.enabled = false;

  //+ Dialog functions
  folderBtn.onClick = function () {
    //    var user = new Folder("~/");
    //    var f = user.selectDlg("Select folder"); //Dialog("Select files", isImg, true); // for windows, the second argument should be something like "*.jpg"
    var f = Folder.selectDialog("Select folder"); //Dialog("Select files", isImg, true); // for windows, the second argument should be something like "*.jpg"
    if (!f) return;
    folder = f;
    folderName.text = f.fullName; //.replace(/%20/g, " ");
    btnOK.enabled = true;
  };

  btnOK.onClick = function () {
    window.close(1);
  };

  btnCancel.onClick = function () {
    window.close(0);
  };

  colInput.onChange = function () {
    var naturalNum = getNaturalNum(colInput.text);
    if (!naturalNum || naturalNum > maxCols) {
      colInput.text = cols;
    } else {
      cols = colInput.text = naturalNum;
    }
  };

  rowInput.onChange = function () {
    var naturalNum = getNaturalNum(rowInput.text);
    if (!naturalNum || naturalNum > maxRows) {
      rowInput.text = rows;
    } else {
      rows = rowInput.text = naturalNum;
    }
  };

  function getNaturalNum(text) {
    var value = Number(text);
    if (!value || value < 0.5) return false;
    return Math.round(value);
  }

  function isImg(file) {
    var fullName = file.fullName;
    var lowerCaseName = fullName.toLowerCase();

    for (var i = 0; i < imgFormats.length; i++) {
      var regex = new RegExp("." + imgFormats[i] + "$");
      if (lowerCaseName.match(regex)) return true;
    }
    return false;
  }

  function isFolder(file) {
    return file instanceof Folder;
  }

  function pushImgsToArray(folder, progSteps) {
    var folderContents = folder.getFiles();
    var length = folderContents.length;
    var step = progSteps / length;
    for (var i = 0; i < length; i++) {
      var file = folderContents[i];
      if (recur && isFolder(file)) {
        pushImgsToArray(file, step);
        continue;
      } else if (isImg(file)) {
        contents.push(file);
      }
      progress.increment(step);
    }
  }

  function getX(col, pageNo) {
    var indent = col * frameWidth + col * gutter;
    if (!facingPages || pageNo === 1) {
      return indent + marginLeft;
    } else if (pageNo % 2) {
      return indent + marginLeft + pageWidth;
    } else {
      return indent + marginRight;
    }
  }

  function progress(msg) {
    var progWindow = new Window("palette", "Progress", undefined, { closeButton: false });
    var text = progWindow.add("statictext", undefined, msg);
    var bar = progWindow.add("progressbar");
    text.preferredSize = [450, -1];
    bar.preferredSize = [450, -1];

    progress.close = function () {
      progWindow.close();
    };

    progress.increment = function (inc) {
      bar.value += inc;
    };

    progress.msg = function (msg) {
      text.text = msg;
      progWindow.update();
    };

    progress.set = function (steps) {
      bar.value = 0;
      bar.minvalue = 0;
      bar.maxvalue = steps;
    };

    progWindow.show();
    progWindow.update();
  }

  //+ Do the script
  if (window.show() === 0) return;

  rows = Number(rowInput.text) || rows;
  cols = Number(colInput.text) || cols;
  recur = btnRecur.value;

  progress("Collecting images...");
  progress.set(100);
  pushImgsToArray(folder, 100);

  if (contents.length === 0) {
    alert("No images found in this folder");
    progress.close();
    return;
  }
  var imagesFound = contents.length;
  progress.msg("Placing images...");
  progress.set(imagesFound);

  var framesPerPage = rows * cols;
  var frameWidth = (availableWidth - gutter * (cols - 1)) / cols;
  var frameHeight = (availableHeight - gutter * (rows - 1)) / rows;

  for (var i = 0; i < imagesFound; i++) {
    var pageNo = 1 + Math.floor(i / framesPerPage);
    var col = i % cols;
    var row = Math.floor(i / cols) % rows;
    var x = getX(col, pageNo);
    var y = marginTop + row * frameHeight + row * gutter;
    if (pageNo > doc.pages.length) doc.pages.add();
    var page = doc.pages[pageNo - 1];
    var frame = page.rectangles.add();
    frame.geometricBounds = [y, x, y + frameHeight, x + frameWidth];
    frame.contentType = ContentType.GRAPHIC_TYPE;
    frame.place(contents[i]);
    progress.increment(1);
  }
  progress.close();
})();
