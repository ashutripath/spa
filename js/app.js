import { registerDeck } from "./navigator.js"
import { registerControls } from "./controls.js"
import { registerHeader } from "./header.js"

const app = async () => {
	registerDeck()
	registerHeader()
	registerControls()
}

document.addEventListener("DOMContentLoaded", app)