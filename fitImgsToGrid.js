(function () {
  var doc = app.activeDocument;
  var folder;
  var imgFormats = ["jpg", "png", "psd", "ai", "eps", "pdf", "svg", "tiff", "gif", "jpeg", "bmp", "heic"];

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

  //+ Select Files dialog
  var window = new Window("dialog", "Fit images to grid");
  window.alignChildren = "fill";

  // dialog
  var group = window.add("group");

  // choose folder / files
  var folderBtn = group.add("button", undefined, "Folder...");
  var folderName = group.add("statictext", undefined, "", { truncate: "middle" });
  folderName.text = "Choose folder...";
  folderName.preferredSize = [250, -1];

  // choose rows / columns
  //  var panel = window.add("panel", undefined, "Rows and columns");

  // ok go
  group = window.add("group");
  group.alignment = "right";
  var btnOK = group.add("button", undefined, "OK");
  var btnCancel = group.add("button", undefined, "Cancel");
  btnOK.enabled = false;

  //+ Select Files functions
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

  function isImg(file) {
    var fullName = file.fullName;
    var lowerCaseName = fullName.toLowerCase();

    for (var i = 0; i < imgFormats.length; i++) {
      var regex = new RegExp("." + imgFormats[i] + "$");
      if (lowerCaseName.match(regex)) return true;
    }
    return false;
  }

  //+ Do the script
  if (window.show() === 0) return;

  var contents = folder.getFiles(isImg);

  if (contents.length === 0) return alert("No images found in this folder");

  var framesPerPage = rows * cols;
  var frameWidth = (availableWidth - gutter * (cols - 1)) / cols;
  var frameHeight = (availableHeight - gutter * (rows - 1)) / rows;

  for (var i = 0, l = contents.length; i < l; i++) {
    var pageNo = 1 + Math.floor(i / framesPerPage);
    var col = i % cols;
    var row = Math.floor(i / cols) % rows;
    var x = marginLeft + col * frameWidth + col * gutter;
    var y = marginTop + row * frameHeight + row * gutter;
    if (pageNo > doc.pages.length) doc.pages.add();
    var page = doc.pages[pageNo - 1];
    var frame = page.rectangles.add();
    frame.geometricBounds = [y, x, y + frameHeight, x + frameWidth];
    frame.contentType = ContentType.GRAPHIC_TYPE;
    frame.place(contents[i]);
  }
})();
