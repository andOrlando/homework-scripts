const url = window.location.href

// if we're on the container page we wanna open the subpage in a new tab
if (url.match(/openvellum.ecollege.com/)) {
	alert("opening iframe thingy\nI gotta do this because cross-origin stuff is weird")
	window.open(document.querySelector("iframe").src, "_self")
	throw "stopping"
}
//if we're in overview, 
else if (url.match(/mylab.pearson.com\/Student\/OverviewHomework/)) {
	alert("opening but not in a popup")
	doc = new XMLSerializer().serializeToString(document)
	homeworkId = doc.match(/(?<=homeworkId=)\d+/)[0]
	courseId = doc.match(/(?<=cId=)\d+/)[0]
	window.open( `https://mylab.pearson.com/Student/PlayerHomework.aspx?homeworkId=${homeworkId}&questionId=1&flushed=true&cId=${courseId}&centerwin=yes`)
	throw "stopping"
}
else if (url.match(/mylab.pearson.com\/Student\/PlayerHomework/)) {
	alert("opening iframe thingy\nI gotta do this because cross-origin stuff is weird")
	window.open(document.querySelector("iframe[title='Question Viewer']").src, "_self")
	throw "stopping"
}

//otherwise commence homeworking

//I wanna generate readonly values with getters whenever I can
//this.rref, this.inverse, this.whatever should only be created when accessed
class Matrix {
	constructor(m,n,entries) {
		//m is rows
		this.entries = entries
		this.m = m
		this.n = n
		//readonly thingy for accessors
		this._private = {}
	}

	get matrix() { if (!("matrix" in this._private)) this._private["matrix"] = this.getMatrix(); return this._private["matrix"] }
	getMatrix() { return [...Array(this.m)].map((_,i)=>[...Array(this.n)].map((_,j)=>this.entries[i*this.n+j])) }
	getRow(n) { return [...Array(this.n)].map((_,i)=>this.entries[n*this.n+i])}
	getCol(n) { return [...Array(this.m)].map((_,i)=>this.entries[i*this.n+n]) }
	
	add(other) {
		if (other.m != this.m || other.n != this.n) throw "not the same size"
		return new Matrix(this.m, this.n, this.entries.map((n,i)=>n+other.entries[i]))
	}
	multiply(other) {
		if (this.m != other.n) throw "n rows of first matrix must equal n cols of second matrix"
		const entries = []
		for (var i=0; i<this.m; i++) {
			for (var j=0; j<this.m; j++) {
				//ith row of first matrix dog jth column of second matrix
				const row = this.getRow(i)
				const col = other.getCol(j)
				entries.push((row.map((n,i)=>n*col[i])).reduce((a,b)=>a+b))
			}
		}
		return new Matrix(this.m, this.m, entries)
	}
	scalarMultiply(scalar) { return new Matrix(this.m, this.n, this.entries.map(a=>scalar*a)) }
	concatenateRows(other) {
		if (this.m != other.m) throw "rows must be equal"
		var entries = []
		for (var i=0; i<this.m; i++) entries = entries.concat(this.getRow(i).concat(other.getRow(i)))
		return new Matrix(this.m, this.n + other.n, entries)
	}

	copyToClipboard() {/*TODO*/}

	get rref() { if (!("rref" in this._private)) this._private["rref"] = this.getRref(); return this._private["rref"] }
	getRref() {
		//get matrix
		const matrix = this.getMatrix()

		//keep track of pivots
		var npivots = 0;

		//idk how many pivots there's gonna be
		for (var coln=0; coln<this.n; coln++) {
			//find position of absmax val in column but only for rows below npivots
			const pivotrow = [...Array(this.m-npivots)].map((_,i)=>matrix[i+npivots][coln]).reduce((best,a,i,arr)=>Math.abs(a)>arr[best]?i:best, 0)+npivots

			//if pivot row is greater than rows-1 we've found all the pivots already
			if (pivotrow >= this.m) break

			//get the value
			const val = matrix[pivotrow][coln]

			//if zero, continue
			if (val == 0) continue

			//otherwise swap this row with the npivots'th row
			[matrix[npivots], matrix[pivotrow]] = [matrix[pivotrow], matrix[npivots]]

			//for every row below npivots'th row, row reduce to cancel everything
			for (var rown=0; rown<this.m; rown++) {
				//if it's the row we're operating on we don't care
				if (rown == npivots) continue

				//the value we want to get to zero by subtracting
				const tozero = matrix[rown][coln]

				//get matrix[row][col] to zero by subtracting row we're operating on
				matrix[rown] = matrix[rown].map((a,i)=>a-matrix[npivots][i]/val*tozero)
			}

			//divide row by its pivot
			matrix[npivots] = matrix[npivots].map(a=>a/val)

			//increment number of pivots
			npivots++;
		}

		//create and return the new matrix
		return new Matrix(this.m, this.n, matrix.reduce((a,b)=>a.concat(b)))
	}
	//check
	get solution() { if (!("solution" in this._private)) this._private["solution"] = this.getSolution(); return this._private["solution"] }
	getSolution() {
		//solves matrix by rrefing it and converting that into x_p and x_h
		const rref = this.rref
		const matrix = rref.matrix

		//indices of pivots and free variables
		const pivots = matrix.map(a=>a.indexOf(1)).filter(a=>a!=-1)
		const frees = [...Array(this.n-1)].map((_,i)=>i).filter(a=>pivots.indexOf(a)==-1)

		const lastcol = rref.getCol(rref.n-1).entries()
		const x_p = new Matrix(this.n, 1, [...Array(this.n-1)].map((_,i)=>pivots.includes(i)?lastcol.next().value[1]:0))

		//we find x_h by looking at all the free variable columns
		const x_h = []
		
		//for each free variable column we're going to construct a vector
		for (const free of frees) {
			const entries = []
			const col = rref.getCol(free)
			for (var i=0; i<this.n-1; i++) {
				if (i == free) entries.push(1)
				if (!pivots.includes(i)) entries.push(0)
				else entries.push(col[pivots[i]]*-1)
			}
			x_h.push(new Matrix(this.n-1, 1, entries))
		}

		return [x_p, x_h]
	}
	get kernel() { if (!("kernel" in this._private)) this._private["kernel"] = this.getKernel(); return this._private["kernel"] }
	getKernel() {
		return this.concatenateRows(new Matrix(this.m, 1, [...Array(this.m)].map(()=>0))).solution[1]

	}
	get image() { if (!("image" in this._private)) this._private["image"] = this.getImage(); return this._private["image"] }
	getImage() {
		//image is nonzero rows of matrix
		const rref = this.transpose.rref
		const rows = rref.matrix.filter(row=>row.reduce((a,b)=>a+b)!=0)
		return rows.map(row => new Matrix(rows[0].length, 1, row))
	}
	get determinant() { if (!("determinant" in this._private)) this._private["determinant"] = this.getDeterminant(); return this._private["determinant"] }
	getDeterminant() {
		if (this.m != this.n) throw "matrix must be square"
		if (this.m == 2) return this.entries[0]*this.entries[3]-this.entries[1]*this.entries[2]
		var sum = 0
		//we just use first row and not try to be smart because all the applications
		//are gonna be smaller scale matrices, probably max 5x5
		for (var i=0; i<this.n; i++) {
			var entries = []
			//for each row, append the row with index i deleted
			//skip first row because its our scalar
			for (var j=1; j<this.m; j++) entries = entries.concat(this.getRow(j).filter((_,k)=>i!=k))
			sum += (-1 * i % 2) * new Matrix(this.m-1, this.n-1, entries).getDeterminant() * this.entries[i]
		}
		return sum
	}
	//check
	get inverse() { if (!("inverse" in this._private)) this._private["inverse"] = this.getInverse(); return this._private["inverse"] }
	getInverse() {
		return
	}
	get transpose() { if (!("transpose" in this._private)) this._private["transpose"] = this.getTranspose(); return this._private["transpose"] }
	getTranspose() {
	   return new Matrix(this.n, this.m, [...Array(this.n)].reduce((s,_,i)=>s.concat(this.getCol(i)),[]))
	}

	toString() { return [...Array(this.m)].reduce((s,_,i)=>s+[...Array(this.n)].reduce((s,_,j)=>s+this.entries[i*this.n+j]+"\t","")+(i!=this.m-1?"\n":""),"") }
}

//add the console
document.body.insertAdjacentHTML("beforeend", '<div id="bennettc" style="z-index:1;position:absolute;width:400px;height:200px;background:#e6fff0;bottom:0;left:0;font-size:12px;font-family:monospace;"><input id="bennettin" style="width:400px;height:30px;" autocomplete="off"><div id="bennettl" style="display:flex;flex-direction:column-reverse;color:black;overflow-y:scroll;height:170px;"></div></div>')

const container = document.querySelector("#bennettc")
const input = document.querySelector("#bennettin")
const log = document.querySelector("#bennettl")
const out = m => log.insertAdjacentHTML("beforeend", m.toString().replaceAll("\n","<br>").replaceAll("\t","&emsp;") + "<br>")
input.addEventListener("keyup", event => {
	if(event.key !== "Enter") return

	//special commands
	//toggle shrinks/unshrinks it
	if (input.value == "toggle") container.style.height = container.style.height == "30px" ? "200px" : "30px"
	//recompile redefines all matricies as new ones on this screen
	else if (input.value == "recompile") compileMatrices()
	else if (input.value == "clear") log.innerHTML = ""

	else {
		out(`${input.value} ->`)
		try { out(eval(input.value)) }
		catch (err) { out(err.message) }
	}

	input.value = ""
	event.preventDefault()
})

const valsrxp = /(?<=(?:(?:Matrix|Table).* )\d\w*? Row \d\w*? Column )(?:negative )?\d+(?=.*End(?:Matrix|Table))/g;
const dimsrxp = /(\d+) By (\d+) (?:Matrix|Table)/;
const assignrxp = /(?:Upper)?(?:Bold)? ([a-zA-Z])(?: (\d+))?/

function getAssign(elem) {
	var prev = elem.previousSibling

	//if prev is null lets break here
	if (prev == null) return null;

	//if the directly previous element isn't equals, we don't care
	if (prev.ariaLabel != "equals") return null;

	//now we try to aquire the value of the previous thing
	//there's two possibilities that I know of: it can be a normal and subscript pair or it can be an equation
	prev = prev.previousSibling

	//eaasier of the two is equation so lets do that
	//check if ariaLabel exists, then if we match at all, then if we match the entire thing
	if (prev.ariaLabel && (label=prev.ariaLabel.match(assignrxp)) != null && label[0] == prev.ariaLabel) return label.slice(1).join("")

	//otherwise if the first ones class contains "subscript" we'll take it and keep going
	//if it doesn't just use the first one
	var res = prev.innerHTML

	//if the first one isn't either fSuperscript or fNormal_1 return
	if (!prev.classList.contains("fSubscript") && !prev.classList.contains("fNormal_1")) return null

	if (prev.classList.contains("fSubscript") && prev.previousSibling.classList.contains("fNormal_1")) res = prev.previousSibling.innerHTML + res
	return res
}

function compileMatrices() {
	out("called recompile")
	const elems = document.querySelector("iframe").contentWindow.document.querySelectorAll("span.equation[aria-label~='Matrix'],span.equation[aria-label~='Table']")
	out(`found ${elems.length} matrices`)
	var randommatrixindex = 0
	const all = []
	for (const elem of elems) {
		const string = elem.ariaLabel

		const entries = [...string.matchAll(valsrxp)].map(a=>a[0].replace("negative ","-")/1)
		const [m,n] = [...string.match(dimsrxp)].slice(1).map(a=>a/1) //dimensions

		//create the actual matrix
		const matrix = new Matrix(m,n,entries)

		//get what it's assigned to by checking its value
		const assign = getAssign(elem) || `matrix${randommatrixindex++}`
		
		window[assign] = matrix
		all.push([assign, matrix])
	}
	for (const [a,m] of all) out(`defined ${a}:\n${m.toString()}`)
}
