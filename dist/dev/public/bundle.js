
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
	'use strict';

	/** @module binding */

	class Binding$2 {

		/**
		 * @param {object} properties
		 */
		constructor(properties) {
			this._identifier = {};
			this._properties = {...properties};
			this._parent = null;
			this._root = null;
			this._model = null;
			this._children = [];
			this._listeners = [];
		}

		/**
		 * @return {object}
		 */
		get identifier() {
			return this._identifier
		}

		/**
		 * @return {object}
		 */
		get properties() {
			return this._properties
		}

		/**
		 * @return {Node}
		 */
		get root() {
			return this._root
		}

		/**
		 * @type {object}
		 */
		get model() {
			return this._model
		}

		/**
		 * @param  {string}   eventName
		 * @param  {Function} callback
		 * @returns {Listener}
		 */
		listen(observable, eventName, callback) {
			const listener = observable.listen(eventName, callback);
			this._listeners.push(listener);
			return listener
		}

		run(model, properties) {
			properties.binding._parent = this;
			this._children.push(properties.binding);
			properties.binding._properties = {
				...this.properties,
				...properties.binding.properties
			};
			Core$2.run(model, { parentNode: this.root, ...properties });
		}

		remove() {
			const listeners = this._listeners.slice();
			for(const listener of listeners) {
				listener.remove();
			}
			const children = this._children.slice();
			for(const child of children) {
				child.remove();
			}
			if(this._parent !== null) {
				this._parent._children = this._parent._children.filter(child => child !== this);
			}
			this.root.remove();
		}

		/**
			* @abstract
			*/
		onCreated() {

		}

		/**
			* @abstract
			*/
		async onRendered() {

		}

	}

	/** @module core */

	/**
	 * @memberof module:core
	 */
	class Core$2 {

		static PROPERTIES = [
			"tagName",
			"children",
			"identifier",
			"model",
			"binding",
			"properties"
		]
		/**
			* @readonly
			* @enum {number}
			*/
		static METHOD = {
			APPEND_CHILD: "APPEND_CHILD",
			INSERT_BEFORE: "INSERT_BEFORE",
			REPLACE_NODE: "REPLACE_NODE",
			WRAP_NODE: "WRAP_NODE",
			PREPEND: "PREPEND",
		}

		/**
			* @param {Object}  model
			* @param {Object}  properties
			* @param {Element} properties.parentNode
			* @param {number}  [properties.method=METHOD.APPEND_CHILD]
			* @param {Binding} [properties.binding=Binding]
			*/
		static run(model, { parentNode, method = Core$2.METHOD.APPEND_CHILD, binding = new Binding$2() } = {}) {
			const node = Core$2.createNode(parentNode, model, binding);
			binding._root = node;
			binding._model = model;
			binding.onCreated();
			if (method === Core$2.METHOD.APPEND_CHILD) {
				parentNode.appendChild(node);
			} else if (method === Core$2.METHOD.INSERT_BEFORE) {
				parentNode.parentNode.insertBefore(node, parentNode);
			} else if (method === Core$2.METHOD.REPLACE_NODE) {
				parentNode.replaceWith(node);
			} else if (method === Core$2.METHOD.WRAP_NODE) {
				node.appendChild(parentNode.cloneNode(true));
				parentNode.replaceWith(node);
			} else if (method === Core$2.METHOD.PREPEND) {
				parentNode.prepend(node);
			}
			binding.onRendered();
		}

		/**
			* @ignore
			* @param   {Object} Node
			* @param   {Object} model
			* @param   {Object} Binding
			* @returns {Node}
			*/
		static createNode(parentNode, model, binding) {
			const { tagName, children = [] } = model;
			const node = parentNode.ownerDocument.createElement(tagName);
			Object.keys(model).filter(property => Core$2.PROPERTIES.includes(property) === false).forEach(function(property) {
				node[property] = model[property];
			});
			for (const child of children) {
				if(Object.prototype.hasOwnProperty.call(child, "model") === true) {
					let childBinding;
					if(Object.prototype.hasOwnProperty.call(child, "binding") === true) {
						childBinding = new child.binding({...binding.properties, ...child.properties});
						if(Object.prototype.hasOwnProperty.call(child, "identifier") === true) {
							binding.identifier[child.identifier] = childBinding;
						}
					}
					binding.run(child.model, { parentNode: node, binding: childBinding });
				} else {
					const childNode = Core$2.createNode(parentNode, child, binding);
					node.appendChild(childNode);
				}
			}
			if(Object.prototype.hasOwnProperty.call(model, "identifier") === true) {
				binding.identifier[model.identifier] = node;
			}
			return node
		}

	}

	var PlayerModel = {
		tagName: "div",
		className: "player show",
		children: [
			{
				tagName: "div",
				identifier: "cloak",
				className: "cloak"
			},
			{
				tagName: "div",
				className: "controls",
				identifier: "controls",
				children: [
					{
						tagName: "button",
						identifier: "pipButton",
						textContent: "↙️"
					},
					{
						tagName: "button",
						identifier: "lightButton",
						textContent: "💡"
					}
				]
			},
			{
				tagName: "div",
				identifier: "media",
				className: "media",
				children: [
					{
						tagName: "div",
						className: "overlay"
					}
				]
			}
		]
	};

	/** @module binding */

	class Binding$1 {

		/**
		 * @param {object} properties
		 */
		constructor(properties) {
			this._identifier = {};
			this._properties = {...properties};
			this._parent = null;
			this._root = null;
			this._model = null;
			this._children = [];
			this._listeners = [];
		}

		/**
		 * @return {object}
		 */
		get identifier() {
			return this._identifier
		}

		/**
		 * @return {object}
		 */
		get properties() {
			return this._properties
		}

		/**
		 * @return {Node}
		 */
		get root() {
			return this._root
		}

		/**
		 * @type {object}
		 */
		get model() {
			return this._model
		}

		/**
		 * @param  {string}   eventName
		 * @param  {Function} callback
		 * @returns {Listener}
		 */
		listen(observable, eventName, callback) {
			const listener = observable.listen(eventName, callback);
			this._listeners.push(listener);
			return listener
		}

		run(model, properties) {
			properties.binding._parent = this;
			this._children.push(properties.binding);
			properties.binding._properties = {
				...this.properties,
				...properties.binding.properties
			};
			Core$1.run(model, { parentNode: this.root, ...properties });
		}

		remove() {
			const listeners = this._listeners.slice();
			for(const listener of listeners) {
				listener.remove();
			}
			const children = this._children.slice();
			for(const child of children) {
				child.remove();
			}
			if(this._parent !== null) {
				this._parent._children = this._parent._children.filter(child => child !== this);
			}
			this.root.remove();
		}

		/**
			* @abstract
			*/
		onCreated() {

		}

		/**
			* @abstract
			*/
		async onRendered() {

		}

	}

	/** @module core */

	/**
	 * @memberof module:core
	 */
	class Core$1 {

		static PROPERTIES = [
			"tagName",
			"children",
			"identifier",
			"model",
			"binding",
			"properties"
		]
		/**
			* @readonly
			* @enum {number}
			*/
		static METHOD = {
			APPEND_CHILD: "APPEND_CHILD",
			INSERT_BEFORE: "INSERT_BEFORE",
			REPLACE_NODE: "REPLACE_NODE",
			WRAP_NODE: "WRAP_NODE",
			PREPEND: "PREPEND",
		}

		/**
			* @param {Object}  model
			* @param {Object}  properties
			* @param {Element} properties.parentNode
			* @param {number}  [properties.method=METHOD.APPEND_CHILD]
			* @param {Binding} [properties.binding=Binding]
			*/
		static run(model, { parentNode, method = Core$1.METHOD.APPEND_CHILD, binding = new Binding$1() } = {}) {
			const node = Core$1.createNode(parentNode, model, binding);
			binding._root = node;
			binding._model = model;
			binding.onCreated();
			if (method === Core$1.METHOD.APPEND_CHILD) {
				parentNode.appendChild(node);
			} else if (method === Core$1.METHOD.INSERT_BEFORE) {
				parentNode.parentNode.insertBefore(node, parentNode);
			} else if (method === Core$1.METHOD.REPLACE_NODE) {
				parentNode.replaceWith(node);
			} else if (method === Core$1.METHOD.WRAP_NODE) {
				node.appendChild(parentNode.cloneNode(true));
				parentNode.replaceWith(node);
			} else if (method === Core$1.METHOD.PREPEND) {
				parentNode.prepend(node);
			}
			binding.onRendered();
		}

		/**
			* @ignore
			* @param   {Object} Node
			* @param   {Object} model
			* @param   {Object} Binding
			* @returns {Node}
			*/
		static createNode(parentNode, model, binding) {
			const { tagName, children = [] } = model;
			const node = parentNode.ownerDocument.createElement(tagName);
			Object.keys(model).filter(property => Core$1.PROPERTIES.includes(property) === false).forEach(function(property) {
				node[property] = model[property];
			});
			for (const child of children) {
				if(Object.prototype.hasOwnProperty.call(child, "model") === true) {
					let childBinding;
					if(Object.prototype.hasOwnProperty.call(child, "binding") === true) {
						childBinding = new child.binding({...binding.properties, ...child.properties});
						if(Object.prototype.hasOwnProperty.call(child, "identifier") === true) {
							binding.identifier[child.identifier] = childBinding;
						}
					}
					binding.run(child.model, { parentNode: node, binding: childBinding });
				} else {
					const childNode = Core$1.createNode(parentNode, child, binding);
					node.appendChild(childNode);
				}
			}
			if(Object.prototype.hasOwnProperty.call(model, "identifier") === true) {
				binding.identifier[model.identifier] = node;
			}
			return node
		}

	}

	/** @module listener */

	/**
	 * @memberof module:listener
	 */
	class Listener {

		/**
		 * @param   {Observable}   observable
		 * @param   {string}       eventName
		 * @param   {Function}     callback
		 */
		constructor(observable, eventName, callback) {
			this._observable = observable;
			this._eventName = eventName;
			this._callback = callback;
		}

		/**
		 * Remove listener
		 */
		remove() {
			this._observable.removeListener(this);
		}

		/**
		 * @readonly
		 * @type {string}
		 */
		get eventName() {
			return this._eventName
		}

		/**
		 * @readonly
		 * @type {Function}
		 */
		get callback() {
			return this._callback
		}


	}

	/** @module observable */

	/**
	 * @memberof module:observable
	 */
	class Observable {

		constructor() {
			this._listeners = {};
		}

		/**
		 * @param  {string}   eventName
		 * @param  {Function} callback
		 * @returns {Listener}
		 */
		listen(eventName, callback) {
			if(!Array.isArray(this._listeners[eventName])) {
				this._listeners[eventName] = [];
			}
			const listener = new Listener(this, eventName, callback);
			this._listeners[eventName].push(listener);
			return listener
		}

		/**
		 * @param  {Listener} listener
		 */
		removeListener(listener) {
			this._listeners[listener.eventName] = this._listeners[listener.eventName].filter(listener_ => listener_ !== listener);
		}

		/**
		 * @param  {string} eventName
		 * @param  {*} 			args
		 */
		emit(eventName, args) {
			if(Array.isArray(this._listeners[eventName])) {
				for (const listener of this._listeners[eventName]) {
					listener.callback(args);
				}
			}
		}

	}

	var HOTKEYS$2 = {
		27: "fullscreen disable",
		70: "fullscreen toggle",
		84: "light toggle"
	};

	class PlayerBinding extends Binding$1 {

		onCreated() {

			const { player, model, binding } = this.properties;

			this._hotkeys = { ...HOTKEYS$2 };

			this.listen(player, "hotkeys add", data => {
				this._hotkeys = { ...this._hotkeys, ...data };
			});

			this.listen(player, "pip toggle", () => {
				this.root.classList.toggle("minimized");
				if(this.root.classList.contains("minimized")) {
					this.identifier.pipButton.textContent = "↖️";
					this.identifier.lightButton.style.display = "none";
				} else {
					this.identifier.pipButton.textContent = "↙️";
					this.identifier.lightButton.style.display = "";
				}
			});

			this.listen(player, "light toggle", () => this.identifier.cloak.classList.toggle("off"));

			this.listen(player, "error", () => {
				this.identifier.media.classList.remove("loading");
				this.identifier.media.classList.add("error");
			});

			this.listen(player, "loading", () => {
				this.identifier.media.classList.remove("error");
				this.identifier.media.classList.add("loading");
			});

			this.listen(player, "fullscreen toggle", () => {
				if (document.fullscreenElement !== null) {
					document.exitFullscreen();
				} else {
					this.root.requestFullscreen();
				}
			});

			this.listen(player, "fullscreen disable", () => {
				if (document.fullscreenElement !== null) {
					document.exitFullscreen();
				}
			});

			this.identifier.pipButton.addEventListener("click", () => {
				player.emit("pip toggle");
			});

			this.identifier.lightButton.addEventListener("click", () => {
				player.emit("light toggle");
			});

			this.root.ownerDocument.addEventListener('fullscreenchange', () => {
				if (document.fullscreenElement !== null) {
					this.root.classList.add("fullscreen");
				} else {
					this.root.classList.remove("fullscreen");
				}
			});

			this.root.ownerDocument.defaultView.addEventListener("keydown", event => {
				if (Object.hasOwnProperty.call(this._hotkeys, event.keyCode)) {
					player.emit(this._hotkeys[event.keyCode]);
				}
			});

			this.run(model, { parentNode: this.identifier.media, binding });
		}

	}

	class Player extends Observable {

		constructor() {
			super();
		}

	}

	var StreamingModel = {
		tagName: "div",
		className: "streaming"
	};

	/** @module binding */

	class Binding {

		/**
		 * @param {object} properties
		 */
		constructor(properties) {
			this._identifier = {};
			this._properties = {...properties};
			this._parent = null;
			this._root = null;
			this._model = null;
			this._children = [];
			this._listeners = [];
		}

		/**
		 * @return {object}
		 */
		get identifier() {
			return this._identifier
		}

		/**
		 * @return {object}
		 */
		get properties() {
			return this._properties
		}

		/**
		 * @return {Node}
		 */
		get root() {
			return this._root
		}

		/**
		 * @type {object}
		 */
		get model() {
			return this._model
		}

		/**
		 * @param  {string}   eventName
		 * @param  {Function} callback
		 * @returns {Listener}
		 */
		listen(observable, eventName, callback) {
			const listener = observable.listen(eventName, callback);
			this._listeners.push(listener);
			return listener
		}

		run(model, properties) {
			properties.binding._parent = this;
			this._children.push(properties.binding);
			properties.binding._properties = {
				...this.properties,
				...properties.binding.properties
			};
			Core.run(model, { parentNode: this.root, ...properties });
		}

		remove() {
			const listeners = this._listeners.slice();
			for(const listener of listeners) {
				listener.remove();
			}
			const children = this._children.slice();
			for(const child of children) {
				child.remove();
			}
			if(this._parent !== null) {
				this._parent._children = this._parent._children.filter(child => child !== this);
			}
			this.root.remove();
		}

		/**
			* @abstract
			*/
		onCreated() {

		}

		/**
			* @abstract
			*/
		async onRendered() {

		}

	}

	/** @module core */

	/**
	 * @memberof module:core
	 */
	class Core {

		static PROPERTIES = [
			"tagName",
			"children",
			"identifier",
			"model",
			"binding",
			"properties"
		]
		/**
			* @readonly
			* @enum {number}
			*/
		static METHOD = {
			APPEND_CHILD: "APPEND_CHILD",
			INSERT_BEFORE: "INSERT_BEFORE",
			REPLACE_NODE: "REPLACE_NODE",
			WRAP_NODE: "WRAP_NODE",
			PREPEND: "PREPEND",
		}

		/**
			* @param {Object}  model
			* @param {Object}  properties
			* @param {Element} properties.parentNode
			* @param {number}  [properties.method=METHOD.APPEND_CHILD]
			* @param {Binding} [properties.binding=Binding]
			*/
		static run(model, { parentNode, method = Core.METHOD.APPEND_CHILD, binding = new Binding() } = {}) {
			const node = Core.createNode(parentNode, model, binding);
			binding._root = node;
			binding._model = model;
			binding.onCreated();
			if (method === Core.METHOD.APPEND_CHILD) {
				parentNode.appendChild(node);
			} else if (method === Core.METHOD.INSERT_BEFORE) {
				parentNode.parentNode.insertBefore(node, parentNode);
			} else if (method === Core.METHOD.REPLACE_NODE) {
				parentNode.replaceWith(node);
			} else if (method === Core.METHOD.WRAP_NODE) {
				node.appendChild(parentNode.cloneNode(true));
				parentNode.replaceWith(node);
			} else if (method === Core.METHOD.PREPEND) {
				parentNode.prepend(node);
			}
			binding.onRendered();
		}

		/**
			* @ignore
			* @param   {Object} Node
			* @param   {Object} model
			* @param   {Object} Binding
			* @returns {Node}
			*/
		static createNode(parentNode, model, binding) {
			const { tagName, children = [] } = model;
			const node = parentNode.ownerDocument.createElement(tagName);
			Object.keys(model).filter(property => Core.PROPERTIES.includes(property) === false).forEach(function(property) {
				node[property] = model[property];
			});
			for (const child of children) {
				if(Object.prototype.hasOwnProperty.call(child, "model") === true) {
					let childBinding;
					if(Object.prototype.hasOwnProperty.call(child, "binding") === true) {
						childBinding = new child.binding({...binding.properties, ...child.properties});
						if(Object.prototype.hasOwnProperty.call(child, "identifier") === true) {
							binding.identifier[child.identifier] = childBinding;
						}
					}
					binding.run(child.model, { parentNode: node, binding: childBinding });
				} else {
					const childNode = Core.createNode(parentNode, child, binding);
					node.appendChild(childNode);
				}
			}
			if(Object.prototype.hasOwnProperty.call(model, "identifier") === true) {
				binding.identifier[model.identifier] = node;
			}
			return node
		}

	}

	var HOTKEYS$1 = {
		75: "playback toggle",
		67: "hud show",
		32: "playback toggle",
		74: "video skip backward",
		37: "video skip backward",
		38: "video speed increase",
		39: "video skip forward",
		76: "video skip forward",
		40: "video speed decrease",
		77: "video volume toggle",
	};

	var VideoModel = {
		tagName: "video"
	};

	var TimeModel = data => ({
		tagName: "div",
		className: "time-display",
		textContent: data.text
	});

	const pad = function(number, length) {
		let paddedNumber = "";
		for (let i = 0; i < length - number.toString().length; i++) {
			paddedNumber = paddedNumber.concat("0");
		}
		paddedNumber = paddedNumber.concat(number);
		return paddedNumber
	};

	const secondsToHours = function(seconds) {
		seconds = seconds || 0;
		let hours = Math.floor(seconds / 3600);
		seconds = seconds % 3600;
		let minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds % 60);
		return (hours > 0 ? (pad(hours, 2) + ":") : "").concat(pad(minutes, 2)).concat(":" + pad(seconds, 2))
	};

	class TimeBinding extends Binding {

		onCreated() {

			const { player } = this.properties;

			this.listen(player, "video timeupdate", data => {
				this.root.textContent = `${secondsToHours(data.currentTime)} / ${secondsToHours(data.duration)}`;
			});

			this.listen(player, "video durationchange", data => {
				this.root.textContent = `${secondsToHours(data.currentTime)} / ${secondsToHours(data.duration)}`;
			});

		}

	}

	var SeekbarModel = {
		tagName: "div",
		className: "seekbar",
		children: [
			{
				tagName: "input",
				identifier: "timeline",
				type: "range",
				value: 0,
				min: 0,
				step: "any"
			}
		]
	};

	const COLOR_CURRENT$1 = "#111";
	const COLOR_BUFFERED = "#131313";
	const COLOR_HOVER$1 = "hsla(0, 0% ,20%, 0.5)";

	class SeekbarBinding extends Binding {

		repaint() {
			const buffer = this.buffered;
			for (let i = buffer.length; i--;) {
				if (this.currentTime >= buffer.start(i) && this.currentTime <= buffer.end(i)) {
					const percents = {
						currentTime: (this.currentTime * 100) / this.duration,
						bufferStart: (buffer.start(i) * 100) / this.duration,
						bufferEnd: (buffer.end(i) * 100) / this.duration
					};
					if (this.offsetX !== null) {
						percents.cursorTime = (this.offsetX * 100) / this.identifier.timeline.offsetWidth;
						if (percents.cursorTime < percents.currentTime) {
							this.identifier.timeline.style.background = `linear-gradient(90deg, ${COLOR_CURRENT$1}, ${COLOR_CURRENT$1} ${percents.cursorTime}%, ${COLOR_HOVER$1} ${percents.cursorTime}%, ${COLOR_HOVER$1} ${percents.currentTime}%, ${COLOR_BUFFERED} ${percents.currentTime}%, ${COLOR_BUFFERED} ${percents.bufferEnd}%, transparent ${percents.bufferEnd}%, transparent 100%`;
						} else {
							this.identifier.timeline.style.background = `linear-gradient(90deg, ${COLOR_CURRENT$1}, ${COLOR_CURRENT$1} ${percents.currentTime}%, ${COLOR_BUFFERED} ${percents.currentTime}%, ${COLOR_BUFFERED} ${percents.bufferEnd}%, ${COLOR_HOVER$1} ${percents.bufferEnd}%, ${COLOR_HOVER$1} ${percents.cursorTime}%, transparent ${percents.cursorTime}%, transparent 100%`;
						}
					} else {
						this.identifier.timeline.style.background = `linear-gradient(90deg, ${COLOR_CURRENT$1}, ${COLOR_CURRENT$1} ${percents.currentTime}%, ${COLOR_BUFFERED} ${percents.currentTime}%, ${COLOR_BUFFERED} ${percents.bufferEnd}%, transparent ${percents.bufferEnd}%, transparent 100%`;
					}
					break
				}
			}
		}

		setTime(offsetX) {
			let percent = (offsetX * 100) / this.identifier.timeline.offsetWidth;
			let time = (this.identifier.timeline.max * percent) / 100;
			if (time > this.duration) {
				time = this.duration;
			} else if (time < 0) {
				time = 0;
			}
			this.properties.player.emit("video time set", time);
		}

		onCreated() {

			const { player } = this.properties;

			let _mousedown = false;

			this.offsetX = null;
			this.currentTime = 0;
			this.duration = 0;
			this.buffered = 0;

			this.listen(player, "video loadeddata", () => {
				this.repaint();
			});

			this.listen(player, "video timeupdate", data => {
				this.currentTime = data.currentTime;
				this.identifier.timeline.value = data.currentTime;
				this.repaint();
			});

			this.listen(player, "video durationchange", data => {
				this.duration = data.duration;
				this.identifier.timeline.max = data.duration;
				this.repaint();
			});

			this.listen(player, "video seeked", data => {
				this.buffered = data;
			});

			this.identifier.timeline.addEventListener("click", (event) => {
				this.setTime(event.offsetX);
			});

			this.identifier.timeline.addEventListener("mousedown", () => {
				_mousedown = true;
			});

			this.identifier.timeline.addEventListener("mouseout", () => {
				this.offsetX = null;
				this.repaint();
			});

			this.identifier.timeline.addEventListener("mousemove", (event) => {
				if (_mousedown === true) {
					this.setTime(event.offsetX);
				}
				this.offsetX = event.offsetX;
				this.repaint();
			});

			this.identifier.timeline.addEventListener("mouseup", () => {
				_mousedown = false;
			});

		}

	}

	var VolumebarModel = {
		tagName: "input",
		className: "volume_slider",
		type: "range",
		min: 0,
		value: 0,
		max: 1,
		step: "any"
	};

	const COLOR_CURRENT = "#111";
	const COLOR_HOVER = "hsla(0, 0% ,20%, 0.5)";

	class VolumebarBinding extends Binding {

		repaint(data) {
			if (data.muted === true || data.volume === 0) {
				this.root.style.background = "";
			} else {
				this.root.style.background = `linear-gradient(90deg, ${COLOR_CURRENT}, ${COLOR_CURRENT} ${data.volume * 100}%, transparent 0%)`;
			}
		}

		onCreated() {

			const { player } = this.properties;

			let _mousedown = false;
			let _muted = false;
			let _volume = 1;

			this.listen(player, "video volumechange", data => {
				this.root.value = data.volume;
				_volume = data.volume;
				_muted = data.muted;
				this.repaint(data);
			});

			this.listen(player, "video loadeddata", data => {
				this.root.value = data.volume;
				_volume = data.volume;
				_muted = data.muted;
				this.repaint(data);
			});

			this.listen(player, "volume set", (offsetX) => {
				const percent = (offsetX * 100) / this.root.offsetWidth;
				let volume = (this.root.max * percent) / 100;
				if (volume > 1) {
					volume = 1;
				} else if (volume < 0) {
					volume = 0;
				}
				player.emit("video volume set", volume);
				if (volume > 0 && _muted === true) {
					player.emit("video mute set", false);
				}
			});

			this.root.addEventListener("click", (event) => {
				player.emit("volume set", event.offsetX);
			});

			this.root.addEventListener("mousedown", () => {
				_mousedown = true;
			});

			this.root.addEventListener("mouseup", () => {
				_mousedown = false;
			});

			this.root.addEventListener("mouseout", () => {
				this.repaint({ volume: _volume, muted: _muted });
			});

			this.root.addEventListener("mousemove", (event) => {
				if (_mousedown === true) {
					player.emit("volume set", event.offsetX); // TODO
				}

				const currentPercent = (_volume * 100) / 1;
				const hoverPercent = (event.offsetX * 100) / this.root.offsetWidth;

				if (_muted === true || _volume === 0) {
					this.root.style.background = `linear-gradient(90deg, ${COLOR_HOVER} ${hoverPercent}%, ${COLOR_HOVER} ${hoverPercent}%, transparent ${hoverPercent}%, transparent 100%`;
				} else if (hoverPercent < currentPercent) {
					this.root.style.background = `linear-gradient(90deg, ${COLOR_CURRENT}, ${COLOR_CURRENT} ${hoverPercent}%, ${COLOR_HOVER} ${hoverPercent}%, ${COLOR_HOVER} ${currentPercent}%, transparent ${currentPercent}%, transparent 100%`;
				} else {
					this.root.style.background = `linear-gradient(90deg, ${COLOR_CURRENT}, ${COLOR_CURRENT} ${currentPercent}%, ${COLOR_HOVER} ${currentPercent}%, ${COLOR_HOVER} ${hoverPercent}%, transparent ${hoverPercent}%, transparent 100%`;
				}
			});

		}

	}

	var HudModel = {
		tagName: "div",
		className: "video_hud",
		children: [
			{
				tagName: "button",
				textContent: "▶️",
				identifier: "play",
				title: "Play/Pause"
			},
			{
				model: SeekbarModel,
				binding: SeekbarBinding
			},
			{
				model: TimeModel({ text: "00:00 / 00:00" }),
				binding: TimeBinding
			},
			{
				tagName: "button",
				identifier: "mute",
				textContent: "🔊",
				title: "Toggle volume"
			},
			{
				model: VolumebarModel,
				binding: VolumebarBinding
			},
			{
				tagName: "button",
				identifier: "screenshot",
				textContent: "📷",
				title: "Take a screenshot"
			},
			{
				tagName: "button",
				textContent: "🖵",
				identifier: "fullscreen",
				title: "Toggle fullscreen"
			}
		]
	};

	class VideoBinding extends Binding {

		onCreated() {

			const { player } = this.properties;

			this.listen(player, "screenshot", () => {
				const canvas = document.createElement("canvas");
				canvas.width = this.root.videoWidth;
				canvas.height = this.root.videoHeight;
				const ctx = canvas.getContext("2d");
				ctx.drawImage(this.root, 0, 0, canvas.width, canvas.height);
				const dataURI = canvas.toDataURL("image/png");
				const link = document.createElement("a");
				link.href = dataURI;
				const date = new Date();
				link.download = `screenshot-mediaplayer-${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}.png`;
				link.click();
			});

			this.listen(player, "video time set", data => {
				this.root.currentTime = data;
			});

			this.listen(player, "video skip backward", () => {
				if (this.root.currentTime - 10 >= 0) {
					this.root.currentTime -= this.root.duration / 10;
				} else {
					this.root.currentTime = 0;
				}
			});

			this.listen(player, "video skip forward", () => {
				if (this.root.currentTime + (this.root.duration / 10) <= this.root.duration) {
					this.root.currentTime += this.root.duration / 10;
				} else {
					this.root.currentTime = this.root.duration;
				}
			});

			this.listen(player, "video speed increase", () => {
				this.root.playbackRate += 0.5;
			});

			this.listen(player, "video speed decrease", () => {
				this.root.playbackRate -= 0.5;
			});

			this.listen(player, "media url set", data => {
				this.root.src = data;
			});

			this.listen(player, "video playback toggle", () => {
				if (this.root.paused === true) {
					this.root.play();
				} else {
					this.root.pause();
				}
			});

			this.listen(player, "video volume toggle", () => {
				this.root.muted = !this.root.muted;
			});

			this.listen(player, "video volume set", data => {
				this.root.volume = data;
			});

			this.listen(player, "video mute set", data => {
				this.root.muted = data;
			});

			this.root.addEventListener("click", () => {
				player.emit("video playback toggle");
			});

			this.root.addEventListener("ended", () => {
				player.emit("media next");
			});

			this.root.addEventListener("error", (event) => {
				console.log(event);
			});

			this.root.addEventListener("dblclick", () => {
				player.emit("fullscreen toggle");
			});

			this.root.addEventListener("durationchange", () => {
				console.log("durationchange");
				player.emit("video durationchange", { duration: this.root.duration, currentTime: this.root.currentTime });
			});

			this.root.addEventListener("loadeddata", () => {
				console.log("loadeddata");
				player.emit("video loadeddata", { duration: this.root.duration, volume: this.root.volume, muted: this.root.muted, src: this.root.src, currentTime: this.root.currentTime });
			});

			this.root.addEventListener("loadedmetadata", () => {
				console.log("loadedmetadata");
				player.emit("hud show");
			});

			this.root.addEventListener("loadstart", () => {
				console.log("loadstart");
			});

			this.root.addEventListener("pause", () => {
				player.emit("video pause");
			});

			this.root.addEventListener("play", () => {
				player.emit("video play");
			});

			this.root.addEventListener("progress", () => {
				player.emit("video progress");
			});

			this.root.addEventListener("seeked", () => {
				player.emit("video seeked", this.root.buffered);
			});

			this.root.addEventListener("seeking", () => {
				player.emit("video seeking");
			});

			this.root.addEventListener("timeupdate", () => {
				player.emit("video timeupdate", {
					currentTime: this.root.currentTime,
					duration: this.root.duration
				});
			});

			this.root.addEventListener("volumechange", () => {
				player.emit("video volumechange", {
					volume: this.root.volume,
					muted: this.root.muted
				});
			});

		}

	}

	class HudBinding extends Binding {

		hide() {
			clearTimeout(this.hideTimeout);
			if (this.paused === false) {
				this.root.classList.add("hidden");
			}
		}

		show() {
			clearTimeout(this.hideTimeout);
			this.root.classList.remove("hidden");
			this.hideTimeout = setTimeout(() => this.hide(), 3000);
		}

		onCreated() {

			const { player } = this.properties;

			let _mouseover = false;

			this.hideTimeout = null;
			this.paused = false;

			this.listen(player, "hud hide", () => {
				this.hide();
			});

			this.listen(player, "hud show", () => {
				this.show();
			});

			this.listen(player, "video volumechange", data => {
				if (data.muted === true || data.volume === 0) {
					this.identifier.mute.textContent = "🔇";
				} else if (data.volume < 1 / 3) {
					this.identifier.mute.textContent = "🔈";
				} else if (data.volume < 1 / 2) {
					this.identifier.mute.textContent = "🔉";
				} else {
					this.identifier.mute.textContent = "🔊";
				}
			});

			this.listen(player, "video pause", () => {
				this.paused = true;
				this.identifier.play.textContent = "▶️";
				this.show();
			});

			this.listen(player, "video play", () => {
				this.paused = false;
				this.identifier.play.textContent = "⏸️";
				if (_mouseover === false) {
					this.hide();
				}
			});

			this.root.addEventListener("mouseover", () => {
				_mouseover = true;
				this.show();
			});

			this.root.addEventListener("mouseout", () => {
				_mouseover = false;
				if (this.paused === false) {
					this.hide();
				}
			});

			this.identifier.fullscreen.addEventListener("click", () => {
				player.emit("fullscreen toggle");
			});

			this.identifier.play.addEventListener("click", () => {
				player.emit("video playback toggle");
			});

			this.identifier.mute.addEventListener("click", () => {
				player.emit("video volume toggle");
			});

			this.identifier.screenshot.addEventListener("click", () => {
				player.emit("screenshot");
			});

		}

	}

	class StreamingBinding extends Binding {

		onCreated() {

			const { player, hotkeys } = this.properties;

			let _paused = false;
			let _lastX;
			let _lastY;

			this.listen(player, "video pause", () => {
				_paused = true;
			});

			this.listen(player, "video play", () => {
				_paused = false;
			});

			this.listen(player, "hud hide", () => {
				if (_paused === false) {
					this.root.classList.add("hide-cursor");
				}
			});

			this.listen(player, "hud show", () => {
				this.root.classList.remove("hide-cursor");
			});

			this.listen(player, "video seeked", () => {
				this.root.className = "media";
			});

			this.listen(player, "video seeking", () => {
				this.root.className = "media buffering";
			});

			this.root.addEventListener("mousemove", function(event) {
				if (_paused === false && (typeof _lastX === "undefined" || (_lastX !== event.x || _lastY !== event.y))) {
					player.emit("hud show");
				}
				_lastY = event.y;
				_lastX = event.x;
			});

			player.emit("hotkeys add", { ...HOTKEYS$1, ...hotkeys });

			this.run(VideoModel, { parentNode: this.root, binding: new VideoBinding({ player }) });
			this.run(HudModel, { parentNode: this.root, binding: new HudBinding({ player }) });

		}

	}

	var HOTKEYS = {

	};

	window.addEventListener("load", async function() {

		const player = new Player();

		Core$2.run(PlayerModel, {
			parentNode: document.body,
			binding: new PlayerBinding({
				player,
				hotkeys: HOTKEYS,
				model: StreamingModel,
				binding: new StreamingBinding({ player })
			})
		});

		player.emit("media url set", "./resource/trailer.mp4");

	});

}());
//# sourceMappingURL=bundle.js.map
