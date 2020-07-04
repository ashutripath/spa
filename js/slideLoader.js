import { Slide } from './slide.js'
import { Navigator } from "./navigator.js"

async function loadSlide(slideName, tab) {
	const response = await fetch(`./slides/${tab}/${slideName}.html`)
	const slide = await response.text()
	return new Slide(slide)
}

export async function loadSlides(start, tab) {
	var next = start
	const slides = []
	const cycle = {}
	while (next) {
		if (!cycle[next]) {
			cycle[next] = true
			const nextSlide = await loadSlide(next, tab)
			slides.push(nextSlide)
			next = nextSlide.nextSlide
		}
		else {
			break
		}
	}
	return slides
}