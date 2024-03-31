(function () {
  var doc = app.activeDocument;
  if (!doc) return;
  var file;
  var formatStyles = [
    { name: "Paragraph styles", defaultActive: true, format: ImportFormat.PARAGRAPH_STYLES_FORMAT },
    { name: "Character styles", defaultActive: true, format: ImportFormat.CHARACTER_STYLES_FORMAT },
    { name: "Object styles", defaultActive: false, format: ImportFormat.OBJECT_STYLES_FORMAT },
    { name: "Table/cell styles", defaultActive: false, format: ImportFormat.TABLE_AND_CELL_STYLES_FORMAT },
    { name: "TOC styles", defaultActive: false, format: ImportFormat.TOC_STYLES_FORMAT },
    { name: "Stroke styles", defaultActive: false, format: ImportFormat.STROKE_STYLES_FORMAT },
  ];
  var clashResolution; // GlobalClashResolutionStrategy.LOAD_ALL_WITH_OVERWRITE  // GlobalClashResolutionStrategy.LOAD_ALL_WITH_RENAME

  // WINDOW

  var window = new Window("dialog", "Import styles");
  window.alignChildren = "fill";

  // add File
  var group = window.add("group");
  //group.preferredSize = [300, undefined];

  var fileBtn = group.add("button", undefined, "File...");
  var fileName = group.add("statictext", undefined, "", { truncate: "middle" });
  fileName.text = "Choose a file...";
  fileName.preferredSize = [250, -1];

  // choose import options
  var panel = window.add("panel", undefined, "What to import");
  panel.orientation = "row";
  panel.margins = [10, 25, 10, 20];
  for (var i = 0, l = formatStyles.length; i < l; i++) {
    if (i % 3 === 0) {
      group = panel.add("group");
      group.orientation = "column";
      group.alignChildren = "left";
      var leftMargin = i * 10;
      group.margins = [6 + leftMargin, 10, 6, 0];
      group.preferredSize = [100, undefined];
    }
    var style = formatStyles[i];
    var btn = group.add("checkbox", undefined, style.name);
    style.btn = btn;
    if (style.defaultActive) {
      btn.value = true;
    }
  }

  // choose override options
  panel = window.add("panel", undefined, "How to import");
  panel.margins = [80, 30, 10, 20];
  panel.alignChildren = "left";
  var clashOverride = panel.add("radiobutton", undefined, "Replace existing styles");
  var clashAdd = panel.add("radiobutton", undefined, "Rename imported styles");
  clashOverride.value = true;

  // ok go
  group = window.add("group");
  group.alignment = "right";
  var btnOK = group.add("button", undefined, "OK");
  var btnCancel = group.add("button", undefined, "Cancel");
  btnOK.enabled = false;

  ///////////////////////////////////////////////////////////////////////////////
  // functions
  fileBtn.onClick = function () {
    var f = File.openDialog("Select a file", isInddOrFolder, false); // for windows, the second argument should be something like "*.indd"
    if (!f) return;
    file = f;
    fileName.text = f.name.replace(/%20/g, " ");
    btnOK.enabled = true;
  };

  btnOK.onClick = function () {
    window.close(1);
  };

  btnCancel.onClick = function () {
    window.close(0);
  };

  function isInddOrFolder(file) {
    var fullName = file.fullName;
    return file instanceof Folder || fullName.slice(fullName.length - 4).toLowerCase() === "indd";
  }

  ///////////////////////////////////////////////////////////////////////////////
  // do this

  if (window.show() === 0) return;

  if (clashOverride.value === true) {
    clashResolution = GlobalClashResolutionStrategy.LOAD_ALL_WITH_OVERWRITE;
  } else {
    clashResolution = GlobalClashResolutionStrategy.LOAD_ALL_WITH_RENAME;
  }

  for (var i = 0, l = formatStyles.length; i < l; i++) {
    if (formatStyles[i].btn.value !== true) continue;
    var style = formatStyles[i].format;
    doc.importStyles(style, file, clashResolution);
  }
})();
