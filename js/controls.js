class Controls extends HTMLElement {
	
	constructor() {
		super()

		this._controlRef = null

		this._deck = null
	}

	async connectedCallback() {
		const response = await fetch("./templates/controls.html")
		const template = await response.text()
		this.innerHtml = ""
		const host = document.createElement("div")
		host.innerHTML = template
		this.appendChild(host)
		this._controlRef = {
			first: document.getElementById("ctrlFirst"),
			prev: document.getElementById("ctrlPrevious"),
			next: document.getElementById("ctrlNext"),
			last: document.getElementById("ctrlLast"),
			pos: document.getElementById("position")
		}
		this._controlRef.first.addEventListener("click", () => this._deck.jumpTo(0))
		this._controlRef.prev.addEventListener("click", () => this._deck.previous())
		this._controlRef.next.addEventListener("click", () => this._deck.next())
		this._controlRef.last.addEventListener("click", () => this._deck.jumpTo(this._deck.totalSlides - 1))
		this.refreshState()
	}

	static get observedAttributes() {
		return ["deck"]
	}

	async attributeChangedCallback(attrName, oldValue, newValue) {
		if (attrName === "deck") {
			if (oldValue !== newValue) {
				this._deck = document.getElementById(newValue)
				this._deck.addEventListener("slideschanged", () => this.refreshState())
			}
		}
	}

	refreshState() {
		if (this._controlRef == null) {
			return
		}
		const prev = this._deck.hasPrevious
		const next = this._deck.hasNext
		if(!prev) {
			this._controlRef.first.classList.add("disabled")
		} else {
			this._controlRef.first.classList.remove("disabled")
		}
		if(!prev) {
			this._controlRef.prev.classList.add("disabled")
		} else {
			this._controlRef.prev.classList.remove("disabled")
		}

		if(!next) {
			this._controlRef.next.classList.add("disabled")
		} else {
			this._controlRef.next.classList.remove("disabled")
		}

		if(this._deck.currentIndex === (this._deck.totalSlides - 1)) {
			this._controlRef.last.classList.add("disabled")
		} else {
			this._controlRef.last.classList.remove("disabled")
		}
		this._controlRef.pos.innerText = `${this._deck.currentIndex + 1} / ${this._deck.totalSlides}`;
	}
}

export const registerControls = () => customElements.define("slide-controls", Controls)
