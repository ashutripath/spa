import { Router } from './router.js'
import { loadSlides } from './slideLoader.js'

export class Navigator extends HTMLElement {

	constructor() {
		super()

		this._document = document.getElementById("main")

		this._router = new Router()

		this._route = this._router.getRoute()

		this._tab = null

		this.slidesChangedEvent = new CustomEvent("slideschanged", {
			bubbles: true,
			cancelable: false
		})
		this._router.eventSource.addEventListener("routechanged", () => {
			if(this._route !== this._router.getRoute()) {
				this._tab = this._newTab
				this._route = this._router.getRoute()
				if(this._route) {
					const slide = parseInt(this._route) - 1
					this.jumpTo(slide)
				}
			}
		})
	}

	static get observedAttributes() {
		return ["start", "tab"]
	}

	connectedCallback() {
		console.log("connectedCallback")
	}

	async attributeChangedCallback(name, oldValue, newValue) {
		console.log("attributeChangedCallback")
		if(name === "start" || name === "tab") {
			if(oldValue !== newValue) {
				const start = this._document.getAttribute("start")
				const tab = this._document.getAttribute("tab")
				this._slides = await loadSlides(start, tab)
				this._route = this._router.getRoute()
				var slide = 0
				if(this._route) {
					slide = this._tab !== tab ? 0 : parseInt(this._route) - 1
					this._tab = tab
				}
				this.jumpTo(slide);
                this._title = document.querySelectorAll("title")[0];
			}
		}
	}

	get currentIndex() {
		return this._currentIndex
	}

	get currentSlide() {
		return this._slides ? this._slides[this._currentIndex] : null
	}

	get totalSlides() {
		return this._slides ? this._slides.length: 0
	}

	get hasNext() {
		// TODO: Code left
		return this._currentIndex < (this.totalSlides - 1)
	}

	get hasPrevious() {
		return this._currentIndex > 0
	}

	jumpTo(slideIdx) {
		if(slideIdx >= 0 && slideIdx < this.totalSlides) {
			this._currentIndex = slideIdx
			this.innerHTML = ""
			this.appendChild(this.currentSlide.html)
			this._router.setRoute((slideIdx + 1).toString())
			this._route = this._router.getRoute()
			document.title = `${this.currentIndex + 1}/${this.totalSlides}: ${this.currentSlide.title}`
			this.dispatchEvent(this.slidesChangedEvent)
		}
	}

	previous() {
		if(this.hasPrevious) {
			this.jumpTo(this.currentIndex - 1)
		}
	}

	next() {
		if(this.hasNext) {
			this.jumpTo(this.currentIndex + 1)
		}
	}

	getTab() {
		return this._tab
	}

	setTab(tabName) {
		const deck = this._document
		deck.setAttribute("tab", tabName)
	}
}

export const registerDeck = () => customElements.define("slide-deck", Navigator)