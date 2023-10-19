let url = window.location.href

let script

if (url.match(/openvellum.ecollege.com/) || url.match(/mylab.pearson.com/)) script = "mymathlab"
else if (url.match(/webassign.net/)) script = "webassign"
else if (url.match(/learn.zybooks.com/)) script = "zybooks"
else if (url.match(/app.perusall.com/)) script = "perusall"
else if (url.match(/khpcontent.com/)) script = "khc"
else if (url.match(/classquestion.com/)) script = "classquestion"

if (script == undefined) console.log(`no script found for ${url}`)
else {
  console.log(`running ${script} script`)
  fetch(`https://raw.githubusercontent.com/andOrlando/homework-scripts/main/${script}.js`).then(a=>a.text()).then(eval)
}
