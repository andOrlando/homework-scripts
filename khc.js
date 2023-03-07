//ask for json string input for question data
data = JSON.parse(localStorage.getItem("data") || {})

//sha1 becuase my goddamn tiny hash thing somehow had collisions
const sha1 = async m => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-1',new TextEncoder('utf-8').encode(m)))).map(b=>('00'+b.toString(16)).slice(-2)).join('');

const isresult = !!window.location.href.match("result")

//add a little thing
const input = '<svg class="bennett" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M64 64C28.7 64 0 92.7 0 128V384c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H64zm16 64h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm16 80h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V336c0-8.8 7.2-16 16-16zm80-176c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V144zm16 80h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zM160 336c0-8.8 7.2-16 16-16H400c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V336zM272 128h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zM256 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM368 128h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zM352 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H368c-8.8 0-16-7.2-16-16V240zM464 128h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H464c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16zM448 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H464c-8.8 0-16-7.2-16-16V240zm16 80h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H464c-8.8 0-16-7.2-16-16V336c0-8.8 7.2-16 16-16z"/></svg>'
const check = '<svg class="bennett" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M470.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L192 338.7 425.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
const doublecheck = '<svg class="bennett" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M374.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 178.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160zm96 128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 402.7 86.6 297.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l256-256z"/></svg>'
const copynormal = '<svg class="bennett" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M224 0c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224zM64 160c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H288v64H64V224h64V160H64z"/></svg>'
const copyfancy = '<svg class="bennett" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M128 0C92.7 0 64 28.7 64 64v96h64V64H354.7L384 93.3V160h64V93.3c0-17-6.7-33.3-18.7-45.3L400 18.7C388 6.7 371.7 0 354.7 0H128zM384 352v32 64H128V384 368 352H384zm64 32h32c17.7 0 32-14.3 32-32V256c0-35.3-28.7-64-64-64H64c-35.3 0-64 28.7-64 64v96c0 17.7 14.3 32 32 32H64v64c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V384zM432 248a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>'

document.body.insertAdjacentHTML("beforeend", `
<style>
#bennettc {
  z-index:1;
  position:fixed;
  width:400px;
  height:200px;
  background:#d1bbe5;
  bottom:0;
  left:0;
  font-size:12px;
  font-family:monospace;
  display:flex;
}
#bennettleft {
  width:75px;
  background:#c1a3db;
  display:flex;
  flex-direction:column;
  justify-content:space-around;
  height:100%;
}
svg.bennett {
  height:25px;
  margin:auto;
}
.bennettbutton {
  flex-grow:1;
  transition: 0.2s background;
  display:flex;
  justify-content:center;
  background:#c1a3db;
}
.bennettbutton:hover {
  background:#cab2de;
}
#bennettcopy {
  width:100%;
  height:100%;
  overflow-y:scroll;
  display:flex;
  flex-direction:column-reverse;
}
#bennettleft {
  width:75px;
  background:#8761a8;
  display:flex;
  flex-direction:column;
  justify-content:space-around;
  height:100%;
}
</style>
<div id="bennettc">
  <div id="bennettleft">
    <div class="bennettbutton" onclick="get_new_data()">${input}</div>
    ${isresult ? "" : `<div class="bennettbutton" onclick="logclear();parse_question()">${check}</div>`}
    ${isresult ? "" : `<div class="bennettbutton" onclick="logclear();parse_all()">${doublecheck}</div>`}
    <div class="bennettbutton" onclick="select(JSON.stringify(data))">${copynormal}</div>
    <div class="bennettbutton" onclick="select_fancy()">${copyfancy}</div>
  </div>
  <div id="bennettcopy">cool script<br></div>
</div>`)

const copything = document.getElementById("bennettcopy")

//otherwise we're free to continue as normal
//get current question number as int
const get_question_number = () => document.querySelector(".out_of_number > p").textContent.match(/\d+/)[0]

//get all buttons that show unanswered
const get_buttons = () => [...document.querySelectorAll(".question_link_wrapper > a")]

//cute little wait function
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const log = m => copything.innerHTML += `${m}<br>`
logclear = () => copything.innerHTML = ""

//select the text with formatting
function select(html) {
  copything.innerHTML = html
  var range = document.createRange()
  var nodes = copything.childNodes
  range.setStart(nodes[0], 0)
  range.setEnd(nodes[nodes.length-1], nodes[nodes.length-1].length)
  var sel = getSelection()
  sel.removeAllRanges()
  sel.addRange(range)
}

//select with fancy formatting
select_fancy = () => select(Object.entries(data)
  .sort(([_,a])=>Number(a.title.match(/\d+(?:\.\d+)/)))
  .reverse()
  .map(([_, a])=>`${a.title}<br>${a.desc}<br>${a.ans}<br>`).join(""))

//if it's a result page, parse it as such
//https://umass.khpcontent.com/question-pool-result-page/6658249/909681/2689507/11143191
if (isresult) {
  //this is all in an async function
  (async () => {

    //parse results
    const results = document.querySelectorAll(".assessment_question_result")
  
    for (const result of results) {
      //if they're correct it's true, if they're incorrect it's false
      let correct = result.classList.contains("assessment_question_result_correct")    

      //get title and content
      let parent = result.querySelector("p")
      let title = parent.children[0].textContent
      let desc = parent.nextElementSibling.textContent
      let key = await sha1(title + desc)
    
    
      //if the data already exists, do somethign idk
      if (key in data) continue;

      log(`${key} ${correct+0}`)
    
      //otherwise set the data
      data[key] = {
        "title": title,
        "desc": desc,
        "ans": correct
      }
    }

    // prompt("result", JSON.stringify(data))
    localStorage.setItem("data", JSON.stringify(data))
  
    //break so we don't act as normal

  })()

  
}
//parse the question on the page
async function parse_question() {
  
  //get question box
  let parent = document.querySelector(".questionpool_question_narrative>label")
  let title = parent.querySelector("strong").textContent
  let desc = parent.children[1].textContent
  let key = await sha1(title + desc)
  
  
  let select = document.querySelector("select")
  
  
  //if we already have the correct answer, fill it out
  if (key in data) {
    log(`${key} ${data[key].ans}✓`)
    select.value = data[key].ans+0+""
    select.style.color = "green"
    return
  }
  
  log(key)

  //otherwise fill it out bad
  //pick next answer not already in bad answers
  select.value = "1"
  select.style.color = "red"
 
}

async function parse_all() {
  
  let buttons = get_buttons()

  for(let i=0; i<buttons.length; i++) {
    
    buttons = get_buttons()

    assessmentBubbleClicked(i+1, buttons[i])
    
    await wait(1000)
    
    while (get_question_number() != i+1) {

      log("looking for " + (i+1))
      assessmentBubbleClicked(i+1, buttons[i])
      await wait(500)
    }
    
    parse_question()
    
    await wait(500)
  }
  
  log("finished")
  
  document.getElementById("i_am_finished").click()
  
  await wait(500)
  
  document.querySelector(".ui-dialog-buttonset button").click()
  
}

function get_new_data() {
  let res = prompt("json data, have a + at the beginning if you wanna add it")
  if (!res) return
  
  const add = res.charAt(0) == "+"
  
  if (add) res = res.substring(1)
  
  const newdata = JSON.parse(res)
  
  //if it's not add, it's easy
  if (!add) {
    localStorage.setItem("olddata", JSON.stringify(data))
    localStorage.setItem("data", JSON.stringify(newdata))
    data = newdata
    return
  }
  
  //otherwise add all unique keys
  for (const [key, value] of Object.entries(newdata))
    if (!(key in data)) data[key] = value
  
}
