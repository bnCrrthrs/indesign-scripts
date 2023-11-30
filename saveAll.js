(function () {
  var docs = app.documents;
  if (docs.length < 1) return;
  if (!confirm("Do you want to save all open documents?")) return;
  if (!confirm("Are you sure you want to save ALL open documents?")) return;
  for (var i = 0; i < docs.length; i++) {
    var doc = docs[i];
    try {
      doc.save();
    } catch (error) {
      alert("There was an error:\n" + error);
    }
  }
})();
