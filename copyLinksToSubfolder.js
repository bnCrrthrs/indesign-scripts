(function () {
  if (app.documents.length === 0) return;
  var doc = app.activeDocument;

  var graphics = doc.allGraphics;
  if (!graphics.length) return;

  var folder, extensionsToCopy;
  if (!setOptions()) return;
  // = Folder.selectDialog();
  //  if (!folder) return;

  var processedLinkNames = [];
  var copied = 0;
  var failed = 0;

  for (var i = 0; i < graphics.length; i++) {
    var graphic = graphics[i];
    var link = graphic.itemLink;

    if (
      !graphic ||
      !link ||
      !graphic.isValid ||
      !link.isValid ||
      link.status === LinkStatus.LINK_MISSING ||
      link.status === LinkStatus.LINK_INACCESSIBLE ||
      link.status === LinkStatus.LINK_EMBEDDED ||
      !graphic.itemLayer.visible ||
      !graphic.parent.visible ||
      !graphic.visible
    )
      continue;
    var processed = false;
    for (var j = 0; j < processedLinkNames.length; j++) {
      if (processedLinkNames[j] === link.name) {
        processed = true;
        break;
      }
    }

    if (processed) continue;

    var target = File(folder.fsName + "/" + link.name);

    var validExtension = false;
    var thisExtension = link.name.toLowerCase().match(/\w+$/).toString();

    for (var k = 0; k < extensionsToCopy.length; k++) {
      if (extensionsToCopy[k] !== thisExtension) {
        continue;
      }
      validExtension = true;
      break;
    }

    if (!validExtension) continue;

    try {
      link.copyLink(target, "bc", true);
      processedLinkNames.push(link.name);
      copied++;
    } catch (_) {
      failed++;
    }
  }

  var successMsg = copied + " files copied";
  var failedMsg = "";
  if (failed) {
    failedMsg = "\n" + failed + " failed";
  }

  alert(successMsg + failedMsg);

  //* FUNCTIONS

  function setOptions() {
    var selectedFolder;
    var selectedExtensions = [];
    var rasterTypes = ["jpg", "png", "tiff", "gif", "jpeg", "bmp", "heic"];
    var vectorTypes = ["ai", "eps", "svg"];
    var psdTypes = ["psd"];
    var pdfTypes = ["pdf"];

    var window = new Window("dialog", "Copy Links to Subfolder");
    window.alignChildren = "fill";

    // dialog
    var group = window.add("group");

    // choose folder
    var folderBtn = group.add("button", undefined, "Folder...");
    var folderName = group.add("statictext", undefined, "", { truncate: "middle" });
    folderName.text = "Choose folder...";
    folderName.preferredSize = [250, -1];

    // choose types
    var panel = window.add("panel", undefined, "Which file types to copy");
    panel.orientation = "row";
    var group = panel.add("group");
    group.margins = [10, 10, 10, 2];
    group.orientation = "column";
    group.alignChildren = "left";
    var raster = group.add("checkbox", undefined, "Raster images");
    var vector = group.add("checkbox", undefined, "Vector images");
    group = panel.add("group");
    group.margins = [10, 10, 10, 2];
    group.orientation = "column";
    group.alignChildren = "left";
    var psd = group.add("checkbox", undefined, "PSDs");
    var pdf = group.add("checkbox", undefined, "PDFs");
    raster.value = vector.value = psd.value = pdf.value = true;

    group = window.add("group");
    group.alignment = "right";
    var btnCancel = group.add("button", undefined, "Cancel");
    var btnOK = group.add("button", undefined, "OK");
    btnOK.enabled = false;

    //+
    folderBtn.onClick = function () {
      var f = Folder.selectDialog("Select folder");
      if (!f) return;
      selectedFolder = f;
      folderName.text = f.fullName;
      btnOK.enabled = true;
    };

    btnCancel.onClick = function () {
      window.close(0);
    };

    btnOK.onClick = function () {
      window.close(1);
    };

    if (window.show() === 0) return false;
    folder = selectedFolder;
    if (raster.value) selectedExtensions = selectedExtensions.concat(rasterTypes);
    if (vector.value) selectedExtensions = selectedExtensions.concat(vectorTypes);
    if (psd.value) selectedExtensions = selectedExtensions.concat(psdTypes);
    if (pdf.value) selectedExtensions = selectedExtensions.concat(pdfTypes);
    extensionsToCopy = selectedExtensions;
    return true;
  }
})();
