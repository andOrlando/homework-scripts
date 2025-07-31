chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id) return;
    
    let url = tab.url
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
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: [`${script}.js`]
        });
    }
});
