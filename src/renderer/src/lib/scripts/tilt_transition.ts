import { linear } from "svelte/easing";

/**
 * Animates the opacity of an element from 0 to the current opacity for `in` transitions and from the current opacity to 0 for `out` transitions.
 *
 * @param {Element} node
 * @param {FadeParams} [params]
 * @returns {TransitionConfig}
 */
export function tilt(node, { delay = 0, duration = 400, easing = linear } = {}) {
	const o = +getComputedStyle(node).opacity;
	return {
    delay,
		duration,
		easing,
		css: (t) =>
      `transform: skewX(-${12*(Math.sin(Math.PI*t*.95))}deg);
      opacity: ${o*4*Math.pow((t-.5), 2)}`
	};
}
