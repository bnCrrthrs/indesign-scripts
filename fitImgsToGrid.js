var doc = app.activeDocument;
var imgFormats = ["jpg", "png", "psd", "ai", "eps", "pdf", "svg"];
var files = [];

var window = new Window("dialog", "Fit images to grid");
window.alignChildren = "fill";

// dialog
var group = window.add("group");

// choose folder / files
var folderBtn = group.add("button", undefined, "Folder...");
var fileName = group.add("statictext", undefined, "", { truncate: "middle" });
fileName.text = "Choose files...";
fileName.preferredSize = [250, -1];

// choose rows / columns
var panel = window.add("panel", undefined, "Rows and columns");

// ok go
group = window.add("group");
group.alignment = "right";
var btnOK = group.add("button", undefined, "OK");
var btnCancel = group.add("button", undefined, "Cancel");
btnOK.enabled = false;

///////////////////////////////////////////////////////////////////////////////
// functions
folderBtn.onClick = function () {
  var user = new Folder("~/");
  var f = user.selectDlg("Select a folder"); //, isImg, true); // for windows, the second argument should be something like "*.jpg"
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

function isImg(file) {
  var fullName = file.fullName;
  var lowerCaseName = fullName.toLowerCase();

  for (var i = 0; i < imgFormats.length; i++) {
    var regex = new RegExp("." + imgFormats[i] + "$");
    if (lowerCaseName.match(regex)) return true;
  }
  return false;
}

window.show();
