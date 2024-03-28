(function () {
  if (app.documents.length === 0) return;
  var doc = app.activeDocument;
  var links = doc.links;
  if (links.length === 0) return alert("No links found in this document");
  var exampleLink = links.anyItem();
  var successful = 0;
  var failed = 0;

  var folder, files;
  var subfolders = [];

  // + DIALOG

  var window = new Window("dialog", "Relink to folder");
  window.alignChildren = "fill";
  var group = window.add("group");
  var folderBtn = group.add("button", undefined, "Folder...");
  var folderName = group.add("statictext", undefined, "", { truncate: "middle" });
  folderName.text = "Choose folder...";
  folderName.preferredSize = [325, -1];
  var inputSubfolders = group.add("checkbox", undefined, "Search subfolders");
  inputSubfolders.alignment = "right";
  inputSubfolders.enabled = false;
  inputSubfolders.helpTip = "This feature doesn't work yet";

  var panel = window.add("panel");
  panel.alignChildren = "left";
  group = panel.add("group");
  var subGroup = group.add("group");
  subGroup.orientation = "column";
  subGroup.alignChildren = "left";
  subGroup.add("statictext", undefined, "Prepend to filename: ");
  var inputPrepend = subGroup.add("edittext", undefined, "");

  group.add("group");
  subGroup = group.add("group");
  subGroup.orientation = "column";
  subGroup.alignChildren = "left";
  subGroup.add("statictext", undefined, "Append to filename: ");
  var inputAppend = subGroup.add("edittext", undefined, "");

  group.add("group");
  subGroup = group.add("group");
  subGroup.orientation = "column";
  subGroup.alignChildren = "left";
  subGroup.add("statictext", undefined, "Extension: ");
  var inputExtension = subGroup.add("edittext", undefined, "");
  inputExtension.characters = 15;

  group = panel.add("group");
  subGroup = group.add("group");
  subGroup.orientation = "column";
  subGroup.alignChildren = "left";
  subGroup.add("statictext", undefined, "Find in filename: ");
  var inputFind = subGroup.add("edittext", undefined, "");
  group.add("group");
  subGroup = group.add("group");
  subGroup.orientation = "column";
  subGroup.alignChildren = "left";
  subGroup.add("statictext", undefined, "Replace with: ");
  var inputReplace = subGroup.add("edittext", undefined, "");

  group.add("group");
  subGroup = group.add("group");
  subGroup.orientation = "column";
  subGroup.alignChildren = "left";
  var inputRegex = subGroup.add("checkbox", undefined, "Search with regex");
  var superSub = subGroup.add("group");
  var inputGflag = superSub.add("checkbox", undefined, "G flag");
  var inputIflag = superSub.add("checkbox", undefined, "I flag");

  inputPrepend.characters = inputAppend.characters = inputFind.characters = inputReplace.characters = 22;
  inputRegex.preferredSize = inputGflag.preferredSize = inputIflag.preferredSize = [-1, 14];
  group = window.add("group");

  panel = group.add("panel", undefined, "Example");
  panel.preferredSize = [350, -1];
  var exampleText = panel.add("statictext", undefined, exampleLink.name, { truncate: "middle" });
  exampleText.preferredSize = [350, -1];
  subGroup = group.add("group");

  subGroup.alignment = "right";
  subGroup.alignChildren = "right";
  var btnCancel = subGroup.add("button", undefined, "Cancel");
  var btnOK = subGroup.add("button", undefined, "OK");
  btnOK.enabled = false;

  // + DIALOG FUNCTIONS

  inputPrepend.onChanging = function () {
    updateExample();
  };
  inputAppend.onChanging = function () {
    updateExample();
  };
  inputExtension.onChanging = function () {
    updateExample();
  };
  inputFind.onChanging = function () {
    updateExample();
  };
  inputReplace.onChanging = function () {
    updateExample();
  };
  inputRegex.onClick = function () {
    updateExample();
  };
  inputGflag.onClick = function () {
    updateExample();
  };
  inputIflag.onClick = function () {
    updateExample();
  };
  folderBtn.onClick = function () {
    var f = Folder.selectDialog("Select folder");
    if (!f) return;
    folder = f;
    folderName.text = f.fullName;
    btnOK.enabled = true;
  };
  btnOK.onClick = function () {
    window.close(1);
  };
  btnCancel.onClick = function () {
    window.close(0);
  };

  // + CONTINUE WITH THE SCRIPT

  if (window.show() === 0) return;
  files = folder.getFiles();

  for (var i = 0; i < links.length; i++) {
    var link = links[i];
    if (searchFilesForLink(link)) {
      successful++;
    } else {
      failed++;
    }
  }

  alert(successful + " links successfully relinked\n" + failed + " failed to relink");

  // + FUNCTIONS

  function getTargetFileName(fName) {
    // var original = fName.split(/\.(?=[^\.]+$)/);
    // var originalName = original[0];
    // var originalExtension = original[1];
    var original = fName.split(".");
    var originalExtension = original.pop();
    var originalName = original.join(".");
    var pre = inputPrepend.text;
    var app = inputAppend.text;
    var find = inputFind.text;
    var replace = inputReplace.text;
    var ext = inputExtension.text || originalExtension;
    var useRx = inputRegex.value;
    var flags = "";
    if (inputGflag.value) flags += "g";
    if (inputIflag.value) flags += "i";
    if (useRx) {
      find = new RegExp(find, flags);
    }
    var findReplaceName = originalName.replace(find, replace);
    var targetName = pre + findReplaceName + app + "." + ext;
    // if (originalExtension.toLowerCase() === "png") alert(targetName);
    return targetName;
  }

  function updateExample() {
    var example = exampleLink.name;
    var newName = getTargetFileName(example);
    exampleText.text = newName;
  }

  function searchFilesForLink(link) {
    var linkName = link.name;
    var targetName = getTargetFileName(linkName);
    for (var j = 0; j < files.length; j++) {
      var file = files[j];
      // var fileName = file.name; // this worked except for file names with spaces
      var fileName = file.displayName;
      if (targetName !== fileName) continue;
      link.relink(file);
      return true;
    }
    return false;
  }
})();
