(function () {
  if (app.documents.length === 0) return;
  var doc = app.activeDocument;

  var graphics = doc.allGraphics;
  if (!graphics.length) return;

  var folder = Folder.selectDialog();
  if (!folder) return;

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
})();
