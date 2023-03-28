let url = window.location.href

if (url.match(/openvellum.ecollege.com/) || url.match(/mylab.pearson.com/))
  fetch("https://raw.githubusercontent.com/andOrlando/homework-scripts/main/mymathlab.js").then(a=>a.text()).then(eval)

else if (url.match(/webassign.net/))
  fetch("https://raw.githubusercontent.com/andOrlando/homework-scripts/main/webassign.js").then(a=>a.text()).then(eval)

else if (url.match(/learn.zybooks.com/))
  fetch("https://raw.githubusercontent.com/andOrlando/homework-scripts/main/zybooks.js").then(a=>a.text()).then(eval)

else if (url.match(/app.perusall.com/))
  fetch("https://raw.githubusercontent.com/andOrlando/homework-scripts/main/perusall.js").then(a=>a.text()).then(eval)

else if (url.match(/khpcontent.com/))
  fetch("https://raw.githubusercontent.com/andOrlando/homework-scripts/main/khc.js").then(a=>a.text()).then(eval)
