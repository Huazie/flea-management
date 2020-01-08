(function(b, c) {
	var a = function(e, d) {
		this.$element = b(e);
		this.options = b.extend({}, b.fn.spinner.defaults, d);
		this.$input = this.$element.find(".spinner-input");
		this.$element.on("keyup", this.$input, b.proxy(this.change, this));
		if (this.options.hold) {
			this.$element.on("mousedown", ".spinner-up", b.proxy(function() {
				this.startSpin(true)
			}, this));
			this.$element.on("mouseup", ".spinner-up, .spinner-down", b.proxy(this.stopSpin, this));
			this.$element.on("mouseout", ".spinner-up, .spinner-down", b.proxy(this.stopSpin, this));
			this.$element.on("mousedown", ".spinner-down", b.proxy(function() {
				this.startSpin(false)
			}, this))
		} else {
			this.$element.on("click", ".spinner-up", b.proxy(function() {
				this.step(true)
			}, this));
			this.$element.on("click", ".spinner-down", b.proxy(function() {
				this.step(false)
			}, this))
		}
		this.switches = {
			count : 1,
			enabled : true
		};
		if (this.options.speed === "medium") {
			this.switches.speed = 300
		} else {
			if (this.options.speed === "fast") {
				this.switches.speed = 100
			} else {
				this.switches.speed = 500
			}
		}
		this.lastValue = null;
		this.render();
		if (this.options.disabled) {
			this.disable()
		}
	};
	a.prototype = {
		constructor : a,
		render : function() {
			this.$input.val(this.options.value);
			this.$input.attr("maxlength", (this.options.max + "").split("").length)
		},
		change : function() {
			var d = this.$input.val();
			if (d / 1) {
				this.options.value = d / 1
			} else {
				d = d.replace(/[^0-9]/g, "");
				this.$input.val(d);
				this.options.value = d / 1
			}
			this.triggerChangedEvent()
		},
		stopSpin : function() {
			clearTimeout(this.switches.timeout);
			this.switches.count = 1;
			this.triggerChangedEvent()
		},
		triggerChangedEvent : function() {
			var d = this.value();
			if (d === this.lastValue) {
				return
			}
			this.lastValue = d;
			this.$element.trigger("changed", d);
			this.$element.trigger("change")
		},
		startSpin : function(d) {
			if (!this.options.disabled) {
				var e = this.switches.count;
				if (e === 1) {
					this.step(d);
					e = 1
				} else {
					if (e < 3) {
						e = 1.5
					} else {
						if (e < 8) {
							e = 2.5
						} else {
							e = 4
						}
					}
				}
				this.switches.timeout = setTimeout(b.proxy(function() {
					this.iterator(d)
				}, this), this.switches.speed / e);
				this.switches.count++
			}
		},
		iterator : function(d) {
			this.step(d);
			this.startSpin(d)
		},
		step : function(e) {
			var g = this.options.value;
			var f = e ? this.options.max : this.options.min;
			if ((e ? g < f : g > f)) {
				var d = g + (e ? 1 : -1) * this.options.step;
				if (e ? d > f : d < f) {
					this.value(f)
				} else {
					this.value(d)
				}
			}
		},
		value : function(d) {
			if (!isNaN(parseFloat(d)) && isFinite(d)) {
				d = parseFloat(d);
				this.options.value = d;
				this.$input.val(d);
				return this
			} else {
				return this.options.value
			}
		},
		disable : function() {
			this.options.disabled = true;
			this.$input.attr("disabled", "");
			this.$element.find("button").addClass("disabled")
		},
		enable : function() {
			this.options.disabled = false;
			this.$input.removeAttr("disabled");
			this.$element.find("button").removeClass("disabled")
		}
	};
	b.fn.spinner = function(e, g) {
		var f;
		var d = this.each(function() {
			var j = b(this);
			var i = j.data("spinner");
			var h = typeof e === "object" && e;
			if (!i) {
				j.data("spinner", (i = new a(this, h)))
			}
			if (typeof e === "string") {
				f = i[e](g)
			}
		});
		return (f === c) ? d : f
	};
	b.fn.spinner.defaults = {
		value : 1,
		min : 1,
		max : 999,
		step : 1,
		hold : true,
		speed : "medium",
		disabled : false
	};
	b.fn.spinner.Constructor = a;
	b(function() {
		b("body").on("mousedown.spinner.data-api", ".spinner", function(f) {
			var d = b(this);
			if (d.data("spinner")) {
				return
			}
			d.spinner(d.data())
		})
	})
})(window.jQuery);