const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

const is_incorrect = question => { const a = question.querySelector(".zb-explanation.has-explanation"); return a == null || a.classList.contains("incorrect") }
function solve_multiple_choice(question) { return new Promise(async resolve => {

	const inputs = question.querySelectorAll("input")
	var index = 0

	while (is_incorrect(question)) {
		inputs[index].click()
		index++
		await wait(500)
	}

	resolve()
})}

function solve_multiple_choices() { return new Promise(async resolve => {

	//find multiple choice things
	const multiple_choice = document.querySelectorAll(".question-set-question.multiple-choice-question.ember-view")

	//promise list
	var promises = []

	//do all multiple choice things
	for (const question of multiple_choice) promises.push(solve_multiple_choice(question))

	await Promise.allSettled(promises)
	console.log("finished multiple choices")
	resolve()

})}

function solve_short_answer(question) { return new Promise(async resolve => {

	//get show answer button
	const show_answer_button = question.querySelector(".zb-button.secondary.show-answer-button")

	//click it twice
	show_answer_button.click()
	show_answer_button.click()

	//wait for it to render
	await wait(500)

	//get answer and entrybox
	const answer = question.querySelector("span.forfeit-answer").innerHTML
		.replace("&gt;", ">")
		.replace("&lt;", "<")
	const entrybox = question.querySelector(".ember-text-area.ember-view.zb-text-area.hide-scrollbar")

	entrybox.value = answer

	//do this to update the internal value in zybooks because it's weird
	entrybox.dispatchEvent(new ClipboardEvent("paste"))

	await wait(500)

	//check answer
	question.querySelector("span.title").click()

	resolve()
})}

function solve_short_answers() { return new Promise(async resolve => { //find short answer things
	const short_answer = document.querySelectorAll(".question-set-question.short-answer-question.ember-view")

	//promise list
	var promises = []

	//enter all short answer values into thing
	for (const question of short_answer) promises.push(solve_short_answer(question))

	await Promise.allSettled(promises)
	console.log("finished short answers")
	resolve()

})}

function solve_draggy_bit(elem) { return new Promise(async resolve => {
	const draggy_bits = elem.querySelectorAll(".draggable-object");
	const buckets = [...elem.querySelectorAll(".term-bucket")]
	//the length of these are all going to be the same I assume

	for (var i=0; i<draggy_bits.length; i++) {
		
		const elem = draggy_bits[i]
		var data_transfer 

		await new Promise(resolve => {
			elem.addEventListener("dragstart", async e => {
				//it doesn't add it instantly for some reason (this listener has higher prio?)
				await wait(100)
				data_transfer = e.dataTransfer
				resolve()
			})
			elem.dispatchEvent(new DragEvent("dragstart", {
				dataTransfer: new DataTransfer(),
				bubbles: true
			}))
		})

		for (const bucket of buckets) {
			
			//drop it in the bucket
			bucket.dispatchEvent(new DragEvent("drop", {
				dataTransfer: data_transfer,
				bubbles: true
			}))

			//wait a bit
			await wait(500)

			//if it's correct, remove bucket from buckets and break
			if (bucket.parentElement.nextElementSibling.classList.contains("correct")) {
				buckets.splice(buckets.indexOf(bucket),1)
				break
			}
		}

	}

	resolve()
})}

function solve_draggy_bits() { return new Promise(async resolve => {
	const elems = document.querySelectorAll(".definition-match-payload");

	const promises = [];

	for (const elem of elems) promises.push(solve_draggy_bit(elem))

	await Promise.allSettled(promises)
	console.log("finished draggy bits")
	resolve()
})}

var already_clicked = []
const get_active_buttons = () => Array.from(document.querySelectorAll(".zb-button.primary.step:not(.step-highlight):not(.disabled)")).filter(a => !already_clicked.includes(a))
const get_n_inactive_buttons = () => document.querySelectorAll(".zb-button.primary.step.disabled").length
const pause_buttons_exist = () => document.querySelector("button[aria-label='Pause']") != null
function run_videos() { return new Promise(async resolve => {

	//click all 2x speeds
	document.querySelectorAll("input[aria-label='2x speed']").forEach(a => a.click())

	//button.span with text Start
	Array.from(document.querySelectorAll("button>span.title")).filter(a => a.innerHTML == "Start").forEach(a => a.click())

	await wait(500)

	//add all first buttons to the already_clicked list so we don't click them again
	document.querySelectorAll(".zb-button.primary.step.step-highlight").forEach(a => already_clicked.push(a))

	//while we still have buttons to click or it's still playng, try to click buttons
	while (get_n_inactive_buttons() > 0 || get_active_buttons().length > 0 || pause_buttons_exist()) {

		//get all buttons
		const buttons = get_active_buttons()

		//click all buttons
		for (const button of buttons) {
			button.click()
			already_clicked.push(button)
		}

		await wait(500)
	}

	console.log("finished videos")
	resolve()
})}

async function do_page() {

	await Promise.allSettled([
		run_videos(),
		solve_short_answers(),
		solve_multiple_choices(),
		solve_draggy_bits()
	])

	console.log("finished everything")

}

(async () => {

	console.log("doing stuff")

	//finisheveryting should be inputted through the bookmark
	if (typeof finisheverything != "undefined" && finisheverything == "yes") do_page()

	//otherwise we just go forever
	else { while (true) {

		//do page
		console.log("doing page")
		await do_page()

		//click new thing
		console.log("clicking thing")
		Array.from(document.querySelectorAll(".ember-view.nav-link"))
			.filter(a => a.querySelector("[aria-label='arrow_downward']"))[0]
			.click()

		//reset stuff
		already_clicked = []

		//wait for it to finish reloading
		while (document.querySelector("div.zb-modal-content") == null) await wait(1000)

		await wait(2000)

		//click the annoying dialog
		document.querySelector("div.zb-modal-content button.zb-button.secondary.raised").click()

	}}

})()
