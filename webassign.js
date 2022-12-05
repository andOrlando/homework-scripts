class Expression {
	constructor(...children) {
		this.children = children 
	}
}

class Base extends Expression {
	compile() {
		return this.children.reduce((sum, n) => {
			if (typeof n === 'string') return sum + n;
			else return sum + n.compile();
		}, "")
	}
}

class Integral extends Expression {
	compile() {

		const below = this.children[0].compile()
		const above = this.children[1].compile()
		const contents = this.children.length === 3 ? this.children[2].compile() : ""

		return "\\int" +
			(below !== "" ? `_{${below}}` : "") +
			(above !== "" ? `^{${above}}` : "") +
			(contents !== "" ? `{${contents}}` : "")
	}
}
class Exponent extends Expression { compile() { return `^{${this.children[0].compile()}}` } }
class SubScript extends Expression { compile() { return `_${this.children[0].compile()}` } }
class Sqrt extends Expression { compile() { return `\\sqrt{${this.children[0].compile()}}` } }
class Overline extends Expression { compile() { return `\\overline{${this.children[0].compile()}}`} }
class Fraction extends Expression { compile() { return `\\frac{${this.children[0].compile()}}{${this.children[1].compile()}}`} }
class Sine extends Expression { compile() { return `\\sin{${this.children[0].compile()}}` } }
class Cosine extends Expression { compile() { return `\\cos{${this.children[0].compile()}}` } }
class Tangent extends Expression { compile() { return `\\tan{${this.children[0].compile()}}` } }
class LParenthesis extends Expression { compile() { return "("} }
class RParenthesis extends Expression { compile() { return ")"} }
class LSquareBracket extends Expression { compile() { return "[" } }
class RSquareBracket extends Expression { compile() { return "]" } }
class LCurlyBracket extends Expression { compile() { return "\\{" } }
class RCurlyBracket extends Expression { compile() { return "\\}" } }
class Dots extends Expression { compile() { return '\\ldots' }}
class Times extends Expression { compile() { return "*" } }
class Minus extends Expression { compile() { return "-" } }
class Plus extends Expression { compile() { return "+" } }

/**
 * Takes a dom element as an input and recursively parses that element into an expression tree
 * @param {DOMElement} input  
 * @returns {Expression}
 */
function parse(input) {
	if (!input) return new Base("");

	//parse out text node radicals because its weird
	if (input.nodeType === Node.TEXT_NODE && input.textContent === "√") {
		//the next node is going to be the overline or I just parse it as text
		// console.log("saw root")
		const next = input.nextSibling
		// console.log("next: ", input.nextSibling)

		//if next isn't a span with an overline then it's not an actual radical 
		if (!next || next.nodeName !== "SPAN" || next.style.textDecoration !== "overline") {
			// console.log(next, next.nodeName, next.style.textDecoration)
			return new Base("√")
		}

		//otherwise we're going to ignore it for now and it'll be a special case for radicands
		return new Base()
	}

	//if simple expression, try to parse out certain strings
	if (input.nodeType === Node.TEXT_NODE) {

		//TODO: do sines and cosines
		//TODO: add more greek letters as necessary
		const text = input.textContent
			.trim()
			.replaceAll(/𝜃/g, "\\theta ")
			.replaceAll(/𝜋/g, "\\pi ")
			.replaceAll(/𝜎/g, "\\sigma ")
			.replaceAll(/≤/g, "\\leq ")
			.replaceAll(/≥/g, "\\geq ");

		return new Base(text);
	}

	//if it's not a text node it's gotta be a element node
	
	//exponents normally with sup
	if (input.nodeName === "SUP") {
		const exponent = new Base();
		for (const child of input.childNodes)
			exponent.children.push(parse(child));

		return new Exponent(exponent);
	}

	if (input.nodeName === 'SUB') {
		const sub = new Base();
		for (const child of input.childNodes) {
			sub.children.push(parse(child));
		}
		return new SubScript(sub);
	}

	//atypical exponents with span with vertical-align: top and defined font-size
	if (input.nodeName === "SPAN" && input.style.verticalAlign === "top" && input.style.fontSize !== "") {
		const exponent = new Base();
		for (const child of input.childNodes)
			exponent.children.push(parse(child));

		return new Exponent(exponent);

	}

	if (input.nodeName === 'SPAN' && input.style.textDecoration === 'overline') {
		const under = new Base();
		for (const child of input.childNodes) {
			under.children.push(parse(child));
		}
		return new Overline(under);
	}
		
	//do integral
	if (input.nodeName == "TABLE" && input.classList.contains("watexintcomplex")) {

		const aboveblock = new Base();
		for (const child of input.querySelector("td.watexintaboveblock").childNodes) {
			aboveblock.children.push(parse(child));
		}

		const belowblock = new Base();
		for (const child of input.querySelector("td.watexintbelowblock").childNodes) {
			belowblock.children.push(parse(child));
		}

		const content = new Base();
		if (input.querySelector("td.watexintcontent") !== null) {
			for (const child of input.querySelector("td.watexintcontent").childNodes) {
				content.children.push(parse(child));
			}
		}

		return new Integral(
			belowblock,
			aboveblock,
			content
		)
	}

	//do fraction
	if (input.nodeName == "TABLE" && input.classList.contains("watexfraction")) {
		
		const numerator = new Base();
		for (const child of input.querySelector("td.watexnumerator").childNodes) {
			numerator.children.push(parse(child));
		}

		const denominator = new Base();
		for (const child of input.querySelector("td.watexdenominator").childNodes) {
			denominator.children.push(parse(child));
		}

		return new Fraction(
			numerator,
			denominator
		)
	}

	//do sqrt
	if (input.nodeName === "TABLE" && input.classList.contains("watexsqrt")) {
		const radicand = new Base();
		for (const child of input.querySelector("td.watexsqrtradicand").childNodes) {
			radicand.children.push(parse(child))
		}

		return new Sqrt(radicand)
	}

	if (input.nodeName === "SPAN" && input.style.textDecoration === "overline" &&
		input.previousSibling && input.previousSibling.nodeType === Node.TEXT_NODE && input.previousSibling.textContent === "√") {

		const radicand = new Base();
		for (const child of input.childNodes) {
			radicand.children.push(parse(child))
		}

		return new Sqrt(radicand)
	}
		

	//do large parenthesis/brackets/stuff
	if (input.nodeName === "TABLE" && input.classList.contains("watexparenleft")) {
		if (input.querySelector("td.watexparenbracket")) return new LSquareBracket()
		else return new LParenthesis()
	}

	if (input.nodeName === "TABLE" && input.classList.contains("watexparenright")) {
		if (input.querySelector("td.watexparenbracket")) return new RSquareBracket()
		else return new RParenthesis()
	}

	if (input.nodeName === 'IMG' && /.*ldots.gif/.test(input.src)) {
		return new Dots();
	}

	//otherwise call parse on all of its children
	const base = new Base()
	for (const child of input.childNodes) {
		base.children.push(parse(child));
	}
	return base
}

for (const [question, latex] of [...document.querySelectorAll("div.watexline")].map(e => [e, parse(e)])) {
	const div = document.createElement("div")
	div.style.display = "grid"
	
	const button = document.createElement("div")
	button.style.position = "absolute"
	button.style.opacity = 0
	button.style.right = "0%"
	button.style.width = "20px"
	button.style.height = "20px"
	button.style.backgroundColor = "white"
	button.style.border = "1px solid gray"
	button.style.borderRadius = "2px"
	button.style.transition = "opacity 0.1s"
	button.style.cursor = 'copy';

	question.parentNode.replaceChild(div, question)
	div.appendChild(question)
	div.appendChild(button)

	console.log(question)
	console.log(button)

	let [hquestion, hbutton] = [false, false]
	const setopacity = () => { button.style.opacity = hquestion || hbutton ? 1 : 0 }

	question.addEventListener("mouseenter", () => { hquestion = true; setopacity() })
	question.addEventListener("mouseleave", () => { hquestion = false; setopacity() })
	button.addEventListener("mouseenter", () => { hbutton = true; setopacity() })
	button.addEventListener("mouseleave", () => { hbutton = false; setopacity() })

	button.addEventListener("click", () => {
		window.navigator.clipboard.writeText(latex.compile());
	})
}
