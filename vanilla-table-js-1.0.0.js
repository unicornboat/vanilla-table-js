/**
 * VanillaTableJs v1.0.0
 */
class VanillaTableJs {
	#container;

	#isString () {}

	constructor (el) {
		switch (typeof el) {
			case 'string':
				if (
					el.replace(/\s+/g, '').length
					&& document.querySelector(el)
				) {
					this.#container = document.querySelector(el);
				} else {
					throw new Error('A string must be a valid query selector');
				}
				break;
			case 'object':
				if (
					el.constructor.toString().indexOf('HTML') > -1
					&& el.constructor.toString().indexOf('Element') > -1
				) {
					this.#container = el;
				} else {
					throw new Error('An object must be a valid DOM element');
				}
			default:
				throw new Error('Either a query selector or an element of the container is required');
		}
	}
}