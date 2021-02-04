/**
 * VanillaTableJs v1.0.0
 */
class VanillaTableJs {
	#class_name = 'vanilla-table';
	#chars = 'abcdef0123456789';
	#container;
	#current_page = 0;
	#data = [];
	#fixed;
	#fixed_head;
	#fixed_body;
	#flexible;
	#flexible_head;
	#flexible_body;
	#id;
	#settings = {
		border: true,
		debug: false,
		fixed_columns: [],
		items_per_page: 50,
		rounded_corner: true,
		search_input_placeholder: 'Search...',
		title: ''
	};
	#table;
	#timestamp;

	/**
	 * Constructor
	 * @param {Element, string} arg
	 * @param {Array}           data
	 * @param {object}          options
	 */
	constructor (arg, data = [], options = {}) {
		switch (typeof arg) {
			case 'string':
				if (
					arg.replace(/\s+/g, '').length
					&& document.querySelector(arg)
				) {
					this.#container = document.querySelector(arg);
				} else {
					throw new Error('A string must be a valid query selector');
				}
				break;
			case 'object':
				if (
					arg.constructor.toString().indexOf('HTML') > -1
					&& arg.constructor.toString().indexOf('Element') > -1
				) {
					this.#container = arg
				} else {
					throw new Error('An object must be a valid DOM element');
				}
			default:
				throw new Error('Either a query selector or an element of the container is required');
		}

		// Validate data
		if (typeof data !== 'object' || data.constructor !== Array || !data.length) {
			throw new Error('Data must be an array and not empty');
		}
		this.#data = data;

		// Parse and validate options
		this.#parseOptions(options);

		// Initialise the data table
		this.reset();
	}

	#getPageData () {
		return this.#data.splice(this.#current_page * this.#settings.items_per_page, this.#settings.items_per_page);
	}

	#renderCell () {

	}

	#renderColumn () {

	}

	#renderHead () {
		let data = this.#data[0];
		this.#flexible_head.innerHTML = '';
		for (let key in data) {
			let value = data[key];
			if (this.#settings.fixed_columns.indexOf(key) > -1) {
				let head = document.createElement('div');
				head.classList.add(this.#class_name + '-head');
				head.innerHTML = `<div class="${this.#class_name}-wrapper">` +
						`<div class="${this.#class_name}-search-set">` +
							`<div class="${this.#class_name}-wrapper">` +
								`<input type="text" class="${this.#class_name}-input">` +
							`</div>` +
						`</div>` +
						`<div class="${this.#class_name}-filter-group">` +
							`<div class="${this.#class_name}-filter-set">` +
							`</div>` +
						`</div>` +
					`</div>`;

				this.#flexible_head.appendChild(head);
			}
		}
	}

	#renderRow () {

	}

	#renderFixedColumns () {

		return this;
	}

	#renderFlexibleColumns () {
		this.#renderHead();
		return this;
	}

	#renderLayout () {
		let layout = document.createElement('div'),
			fixed = document.createElement('div'),
			fixed_head = document.createElement('div'),
			fixed_body = document.createElement('div'),
			flexible = document.createElement('div'),
			flexible_head = document.createElement('div'),
			flexible_body = document.createElement('div');

		layout.classList.add(this.#class_name + '-layout');
		fixed.classList.add(this.#class_name + '-fixed');
		fixed_head.classList.add(this.#class_name + '-fixed-head');
		fixed_body.classList.add(this.#class_name + '-fixed-body');
		flexible.classList.add(this.#class_name + '-flexible');
		flexible_head.classList.add(this.#class_name + '-flexible-head');
		flexible_body.classList.add(this.#class_name + '-flexible-body');

		this.#fixed = fixed;
		this.#fixed_head = fixed_head;
		this.#fixed_body = fixed_body;
		this.#flexible = flexible;
		this.#flexible_head = flexible_head;
		this.#flexible_body = flexible_body;

		fixed.appendChild(fixed_head);
		fixed.appendChild(fixed_body);
		flexible.appendChild(flexible_head);
		flexible.appendChild(flexible_body);
		layout.appendChild(fixed);
		layout.appendChild(flexible);
		this.#table.appendChild(layout);
		return this;
	}

	#createElement (tag_name, options) {
		let _this = this,
			el = document.createElement(tag_name);
		if (typeof options === 'object' && Object.keys(options).length) {
			for (let key in options) {
				let value = options[key];
				switch (key) {
					case 'attributes':
						if (typeof value === 'object' && value.constructor === Object) {
							for (let sub_key in value) {
								el.setAttribute(sub_key, value[sub_key]);
							}
						}
						break;
					case 'child':
						if (typeof value === 'string') {
							el.appendChild(this.#createElement(value));
						}
						if (typeof value === 'object' && value.constructor === Object) {
							el.appendChild(this.#createElement(Object.keys(value)[0], Object.values(value)[0]));
						}
						break;
					case 'children':
						if (typeof value === 'object' && value.constructor === Array && value.length) {
							value.forEach(each => {
								if (typeof each === 'string') {
									el.appendChild(this.#createElement(each));
								}
								if (typeof each === 'object' && each.constructor === Object) {
									el.appendChild(this.#createElement(Object.keys(each)[0], Object.values(each)[0]));
								}
							});
						}
						break;
					case 'class':
						switch (typeof value) {
							case 'string':
								value.trim().split(/[\s\,\;]+/g).forEach(each => {
									el.classList.add(each);
								});
								break;
							case 'object':
								if (value.constructor === Array) {
									value.forEach(each => {
										el.classList.add(each);
									});
								}
								break;
						}
						break;
					case 'events':
						if (typeof value === 'object' && value.constructor === Object) {
							for (let sub_key in value) {
								el.addEventListener(sub_key, function (e) {
									value[sub_key](e, el, _this);
								});
							}
						}
						break;
					case 'html':
						if (typeof value === 'string') el.innerHTML = value;
						break;
					case 'styles':
						if (typeof value === 'object' && value.constructor === Object) {
							for (let sub_key in value) {
								el.style.setProperty(sub_key, value[sub_key]);
							}
						}
						break;
					case 'text':
						if (typeof value === 'string') el.innerText = value;
						break;
				}
			}
		}
		return el;
	}

	#renderFrame () {
		let table = this.#createElement('div', {
			class: this.#class_name,
			attributes: {'data-id': this.#id},
			styles: {'--rounded-corner': this.#settings.rounded_corner ? '3px' : '0'},
			children: [
				{
					'div': {
						class: this.#class_name + '-title',
						child: {
							'div': {
								class: this.#class_name + '-text',
								text: this.#settings.title
							}
						}
					}
				},
				{
					'div': {
						class: this.#class_name + '-search',
						children: [
							{
								'input': {
									class: this.#class_name + '-input',
									attributes: {
										'placeholder': this.#settings.search_input_placeholder,
										'type': 'text'
									},
									events: {
										'input': function (e, self, vt) {
											console.log(e, self, vt);
										}
									}
								}
							},
							{
								'i': {
									class: this.#class_name + '-clear-search-input',
									events: {
										'click': function (e, self, vt) {
											vt.resetGlobalSearch();
										}
									}
								}
							}
						]
					}
				}
			]
		});
		this.#container.appendChild(table);
		this.#table = table;

		return this;
	}

	reset () {
		// Clear the container
		this.#container.innerHTML = '';

		// Generate ID
		if (!this.#id) {
			this.#id = this.#class_name + '-';
			for (let i = 0; i < 16; i++) {
				this.#id += this.#chars[Math.floor(Math.random() * this.#chars.length)];
			}
		}

		// Build a table
		this.#renderFrame();
	}

	resetGlobalSearch () {
		this.#table.querySelector('.vanilla-table-title  .vanilla-table-input').value = '';
	}

	#parseOptions (options) {
		if (typeof options === 'object' && Object.keys(options).length) {
			for (let key in options) {
				let value = options[key];
				switch (key) {
					case 'border':
					case 'debug':
					case 'rounded_corner':
						if (typeof value === 'boolean') this.#settings[key] = value;
						break;
					case 'items_per_page':
						if (parseInt(value) > 0) this.#settings[key] = value;
						break;
					case 'search_input_placeholder':
					case 'title':
						if (typeof value === 'string' && value.trim().length) this.#settings[key] = value;
						break;
					case 'fixed_columns':
						if (
							typeof value === 'object'
							&& value.constructor === Array
							&& value.length
							&& value.every(each => typeof each === 'string' && each.trim().length)
						) {
							this.#settings[key] = value;
						}
						break;
				}
			}
		}
	}

	search () {

	}
}