// my keyboard shortcut: ctrl + opt + cmd + s

(function () {
  var docs = app.documents;
  var saved = 0;
  if (docs.length < 1) return;
  if (!confirm("Do you want to save all open documents?")) return;
  for (var i = 0; i < docs.length; i++) {
    var doc = docs[i];
    try {
      doc.save();
      saved++;
    } catch (_) {}
  }
  var problems = docs.length - saved;
  if (problems > 0) alert("Problem with " + problems + " document(s)");
})();
