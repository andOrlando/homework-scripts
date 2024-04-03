setInterval(() => {
	const ansbtn = document.querySelector(".ansbtn")
	const submitbtn = document.getElementById("submitbtn")
	if (ansbtn) { console.log("clicked A"); ansbtn.click() }
	if (submitbtn) { console.log("clicked submit"); submitbtn.click() }
}, 10000)
