import { Navigator } from "./navigator.js"

class Header extends HTMLElement {

	constructor() {
		super()

		this._tabsRef = null

		this._navigator = new Navigator()
	}

	async connectedCallback() {
		const response = await fetch('./templates/header.html')
		const template = await response.text()
		this.innerHTML = ""
		const host = document.createElement("div")
		host.innerHTML = template
		this.appendChild(host)
		this._tabsRef = {
			universe: document.getElementById("universe"),
			meditation: document.getElementById("meditation")
		}
		this._tabsRef.universe.addEventListener("click", () =>  this._navigator.setTab("universe"))
		this._tabsRef.meditation.addEventListener("click", () => this._navigator.setTab("meditation"))
	}
}

export const registerHeader = () => customElements.define("header-tabs", Header)