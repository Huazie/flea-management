if (!("ace" in window)) {
	window.ace = {}
}

jQuery(function() {
	window.ace.click_event = $.fn.tap ? "tap" : "click"
});

(function(e, c) {
	var d = "multiple" in document.createElement("INPUT");
	var j = "FileList" in window;
	var b = "FileReader" in window;
	var f = function(l, m) {
		var k = this;
		this.settings = e.extend({}, e.fn.ace_file_input.defaults, m);
		this.$element = e(l);
		this.element = l;
		this.disabled = false;
		this.can_reset = true;
		this.$element.on("change.ace_inner_call", function(o, n) {
			if (n === true) {
				return
			}
			return a.call(k)
		});
		this.$element.wrap('<div class="ace-file-input" />');
		this.apply_settings()
	};
	f.error = {
		FILE_LOAD_FAILED : 1,
		IMAGE_LOAD_FAILED : 2,
		THUMBNAIL_FAILED : 3
	};
	f.prototype.apply_settings = function() {
		var l = this;
		var k = !!this.settings.icon_remove;
		this.multi = this.$element.attr("multiple") && d;
		this.well_style = this.settings.style == "well";
		if (this.well_style) {
			this.$element.parent().addClass("ace-file-multiple")
		} else {
			this.$element.parent().removeClass("ace-file-multiple")
		}
		this.$element.parent().find(":not(input[type=file])").remove();
		this.$element.after('<label class="file-label" data-title="' + this.settings.btn_choose
				+ '"><span class="file-name" data-title="' + this.settings.no_file + '">'
				+ (this.settings.no_icon ? '<i class="' + this.settings.no_icon + '"></i>' : "") + "</span></label>"
				+ (k ? '<a class="remove" href="#"><i class="' + this.settings.icon_remove + '"></i></a>' : ""));
		this.$label = this.$element.next();
		this.$label.on("click", function() {
			if (!this.disabled && !l.element.disabled && !l.$element.attr("readonly")) {
				l.$element.click()
			}
		});
		if (k) {
			this.$label.next("a").on(ace.click_event, function() {
				if (!l.can_reset) {
					return false
				}
				var m = true;
				if (l.settings.before_remove) {
					m = l.settings.before_remove.call(l.element)
				}
				if (!m) {
					return false
				}
				return l.reset_input()
			})
		}
		if (this.settings.droppable && j) {
			g.call(this)
		}
	};
	f.prototype.show_file_list = function(k) {
		var n = typeof k === "undefined" ? this.$element.data("ace_input_files") : k;
		if (!n || n.length == 0) {
			return
		}
		if (this.well_style) {
			this.$label.find(".file-name").remove();
			if (!this.settings.btn_change) {
				this.$label.addClass("hide-placeholder")
			}
		}
		this.$label.attr("data-title", this.settings.btn_change).addClass("selected");
		for (var p = 0; p < n.length; p++) {
			var l = typeof n[p] === "string" ? n[p] : e.trim(n[p].name);
			var q = l.lastIndexOf("\\") + 1;
			if (q == 0) {
				q = l.lastIndexOf("/") + 1
			}
			l = l.substr(q);
			var m = "fa-file";
			if ((/\.(jpe?g|png|gif|svg|bmp|tiff?)$/i).test(l)) {
				m = "fa-picture-o"
			} else {
				if ((/\.(mpe?g|flv|mov|avi|swf|mp4|mkv|webm|wmv|3gp)$/i).test(l)) {
					m = "fa-film"
				} else {
					if ((/\.(mp3|ogg|wav|wma|amr|aac)$/i).test(l)) {
						m = "fa-music"
					}
				}
			}
			if (!this.well_style) {
				this.$label.find(".file-name").attr({
					"data-title" : l
				}).find('[class^="fa fa-"]').attr("class", m)
			} else {
				this.$label.append('<span class="file-name" data-title="' + l + '"><i class="' + m + '"></i></span>');
				var r = e.trim(n[p].type);
				var o = b && this.settings.thumbnail
						&& ((r.length > 0 && r.match("image")) || (r.length == 0 && m == "fa-picture-o"));
				if (o) {
					var s = this;
					e.when(i.call(this, n[p])).fail(function(t) {
						if (s.settings.preview_error) {
							s.settings.preview_error.call(s, l, t.code)
						}
					})
				}
			}
		}
		return true
	};
	f.prototype.reset_input = function() {
		this.$label.attr({
			"data-title" : this.settings.btn_choose,
			"class" : "file-label"
		}).find(".file-name:first").attr({
			"data-title" : this.settings.no_file,
			"class" : "file-name"
		}).find('[class^="fa fa-"]').attr("class", this.settings.no_icon).prev("img").remove();
		if (!this.settings.no_icon) {
			this.$label.find('[class^="fa fa-"]').remove()
		}
		this.$label.find(".file-name").not(":first").remove();
		if (this.$element.data("ace_input_files")) {
			this.$element.removeData("ace_input_files");
			this.$element.removeData("ace_input_method")
		}
		this.reset_input_field();
		return false
	};
	f.prototype.reset_input_field = function() {
		this.$element.wrap("<form>").closest("form").get(0).reset();
		this.$element.unwrap()
	};
	f.prototype.enable_reset = function(k) {
		this.can_reset = k
	};
	f.prototype.disable = function() {
		this.disabled = true;
		this.$element.attr("disabled", "disabled").addClass("disabled")
	};
	f.prototype.enable = function() {
		this.disabled = false;
		this.$element.removeAttr("disabled").removeClass("disabled")
	};
	f.prototype.files = function() {
		return e(this).data("ace_input_files") || null
	};
	f.prototype.method = function() {
		return e(this).data("ace_input_method") || ""
	};
	f.prototype.update_settings = function(k) {
		this.settings = e.extend({}, this.settings, k);
		this.apply_settings()
	};
	var g = function() {
		var l = this;
		var k = this.element.parentNode;
		e(k).on("dragenter", function(m) {
			m.preventDefault();
			m.stopPropagation()
		}).on("dragover", function(m) {
			m.preventDefault();
			m.stopPropagation()
		}).on("drop", function(q) {
			q.preventDefault();
			q.stopPropagation();
			var p = q.originalEvent.dataTransfer;
			var o = p.files;
			if (!l.multi && o.length > 1) {
				var n = [];
				n.push(o[0]);
				o = n
			}
			var m = true;
			if (l.settings.before_change) {
				m = l.settings.before_change.call(l.element, o, true)
			}
			if (!m || m.length == 0) {
				return false
			}
			if (m instanceof Array || (j && m instanceof FileList)) {
				o = m
			}
			l.$element.data("ace_input_files", o);
			l.$element.data("ace_input_method", "drop");
			l.show_file_list(o);
			l.$element.triggerHandler("change", [ true ]);
			return true
		})
	};
	var a = function() {
		var l = true;
		if (this.settings.before_change) {
			l = this.settings.before_change.call(this.element, this.element.files || [ this.element.value ], false)
		}
		if (!l || l.length == 0) {
			if (!this.$element.data("ace_input_files")) {
				this.reset_input_field()
			}
			return false
		}
		var m = !j ? null : ((l instanceof Array || l instanceof FileList) ? l : this.element.files);
		this.$element.data("ace_input_method", "select");
		if (m && m.length > 0) {
			this.$element.data("ace_input_files", m)
		} else {
			var k = e.trim(this.element.value);
			if (k && k.length > 0) {
				m = [];
				m.push(k);
				this.$element.data("ace_input_files", m)
			}
		}
		if (!m || m.length == 0) {
			return false
		}
		this.show_file_list(m);
		return true
	};
	var i = function(o) {
		var n = this;
		var l = n.$label.find(".file-name:last");
		var m = new e.Deferred;
		var k = new FileReader();
		k.onload = function(q) {
			l.prepend("<img class='middle' style='display:none;' />");
			var p = l.find("img:last").get(0);
			e(p)
					.one(
							"load",
							function() {
								var t = 50;
								if (n.settings.thumbnail == "large") {
									t = 150
								} else {
									if (n.settings.thumbnail == "fit") {
										t = l.width()
									}
								}
								l.addClass(t > 50 ? "large" : "");
								var s = h(p, t, o.type);
								if (s == null) {
									e(this).remove();
									m.reject({
										code : f.error.THUMBNAIL_FAILED
									});
									return
								}
								var r = s.w, u = s.h;
								if (n.settings.thumbnail == "small") {
									r = u = t
								}
								e(p)
										.css({
											"background-image" : "url(" + s.src + ")",
											width : r,
											height : u
										})
										.data("thumb", s.src)
										.attr(
												{
													src : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg=="
												}).show();
								m.resolve()
							}).one("error", function() {
						l.find("img").remove();
						m.reject({
							code : f.error.IMAGE_LOAD_FAILED
						})
					});
			p.src = q.target.result
		};
		k.onerror = function(p) {
			m.reject({
				code : f.error.FILE_LOAD_FAILED
			})
		};
		k.readAsDataURL(o);
		return m.promise()
	};
	var h = function(n, s, q) {
		var r = n.width, o = n.height;
		if (r > s || o > s) {
			if (r > o) {
				o = parseInt(s / r * o);
				r = s
			} else {
				r = parseInt(s / o * r);
				o = s
			}
		}
		var m;
		try {
			var l = document.createElement("canvas");
			l.width = r;
			l.height = o;
			var k = l.getContext("2d");
			k.drawImage(n, 0, 0, n.width, n.height, 0, 0, r, o);
			m = l.toDataURL()
		} catch (p) {
			m = null
		}
		if (!(/^data\:image\/(png|jpe?g|gif);base64,[0-9A-Za-z\+\/\=]+$/.test(m))) {
			m = null
		}
		if (!m) {
			return null
		}
		return {
			src : m,
			w : r,
			h : o
		}
	};
	e.fn.ace_file_input = function(m, n) {
		var l;
		var k = this.each(function() {
			var q = e(this);
			var p = q.data("ace_file_input");
			var o = typeof m === "object" && m;
			if (!p) {
				q.data("ace_file_input", (p = new f(this, o)))
			}
			if (typeof m === "string") {
				l = p[m](n)
			}
		});
		return (l === c) ? k : l
	};
	e.fn.ace_file_input.defaults = {
		style : false,
		no_file : "No File ...",
		no_icon : "fa-upload",
		btn_choose : "Choose",
		btn_change : "Change",
		icon_remove : "fa-remove",
		droppable : false,
		thumbnail : false,
		before_change : null,
		before_remove : null,
		preview_error : null
	}
})(window.jQuery);

(function(a, b) {
	a.fn.ace_spinner = function(c) {
		this.each(function() {
			var f = c.icon_up || "fa fa-chevron-up";
			var j = c.icon_down || "fa fa-chevron-down";
			var h = c.on_sides || false;
			var e = c.btn_up_class || "";
			var g = c.btn_down_class || "";
			var d = c.max || 999;
			d = ("" + d).length;
			a(this).addClass("spinner-input form-control").wrap('<div class="ace-spinner">');
			var k = a(this).closest(".ace-spinner").spinner(c).wrapInner("<div class='input-group'></div>");
			if (h) {
				a(this).before(
						'<div class="spinner-buttons input-group-btn">							<button type="button" class="btn spinner-down btn-xs '
								+ g + '">								<i class="' + j + '"></i>							</button>						</div>').after(
						'<div class="spinner-buttons input-group-btn">							<button type="button" class="btn spinner-up btn-xs '
								+ e + '">								<i class="' + f + '"></i>							</button>						</div>');
				k.addClass("touch-spinner");
				k.css("width", (d * 20 + 40) + "px")
			} else {
				a(this).after(
						'<div class="spinner-buttons input-group-btn">							<button type="button" class="btn spinner-up btn-xs '
								+ e + '">								<i class="' + f
								+ '"></i>							</button>							<button type="button" class="btn spinner-down btn-xs '
								+ g + '">								<i class="' + j + '"></i>							</button>						</div>');
				if ("ontouchend" in document || c.touch_spinner) {
					k.addClass("touch-spinner");
					k.css("width", (d * 20 + 40) + "px")
				} else {
					a(this).next().addClass("btn-group-vertical");
					k.css("width", (d * 20 + 10) + "px")
				}
			}
			a(this).on("mousewheel DOMMouseScroll", function(l) {
				var m = l.originalEvent.detail < 0 || l.originalEvent.wheelDelta > 0 ? 1 : -1;
				k.spinner("step", m > 0);
				k.spinner("triggerChangedEvent");
				return false
			});
			var i = a(this);
			k.on("changed", function() {
				i.trigger("change")
			})
		});
		return this
	}
})(window.jQuery);

/**
 * 用于向导的使用
 */
(function(a, b) {
	a.fn.ace_wizard = function(c) {
		this.each(function() {
			var e = a(this);
			e.wizard();
			var d = e.siblings(".wizard-actions").eq(0);
			var f = e.data("wizard");
			f.$prevBtn.remove();
			f.$nextBtn.remove();
			f.$prevBtn = d.find(".btn-prev").eq(0).on(ace.click_event, function() {
				e.wizard("previous")
			}).attr("disabled", "disabled");
			f.$nextBtn = d.find(".btn-next").eq(0).on(ace.click_event, function() {
				e.wizard("next")
			}).removeAttr("disabled");
			f.nextText = f.$nextBtn.text()
		});
		return this
	}
})(window.jQuery);


(function(a, b) {
	a.fn.ace_colorpicker = function(c) {
		var d = a.extend({
			pull_right : false,
			caret : true
		}, c);
		this
				.each(function() {
					var g = a(this);
					var e = "";
					var f = "";
					a(this)
							.hide()
							.find("option")
							.each(
									function() {
										var h = "colorpick-btn";
										if (this.selected) {
											h += " selected";
											f = this.value
										}
										e += '<li><a class="' + h + '" href="#" style="background-color:' + this.value
												+ ';" data-color="' + this.value + '"></a></li>'
									})
							.end()
							.on("change.ace_inner_call", function() {
								a(this).next().find(".btn-colorpicker").css("background-color", this.value)
							})
							.after(
									'<div class="dropdown dropdown-colorpicker"><a data-toggle="dropdown" class="dropdown-toggle" href="#"><span class="btn-colorpicker" style="background-color:'
											+ f
											+ '"></span></a><ul class="dropdown-menu'
											+ (d.caret ? " dropdown-caret" : "")
											+ (d.pull_right ? " pull-right" : "")
											+ '">' + e + "</ul></div>").next().find(".dropdown-menu").on(
									ace.click_event, function(j) {
										var h = a(j.target);
										if (!h.is(".colorpick-btn")) {
											return false
										}
										h.closest("ul").find(".selected").removeClass("selected");
										h.addClass("selected");
										var i = h.data("color");
										g.val(i).change();
										j.preventDefault();
										return true
									})
				});
		return this
	}
})(window.jQuery);

/**
 * <p> 通用树 </p>
 *
 * @param a
 * @param b
 */
(function (a, b) {
	a.fn.ace_tree = function (d, callback) {
		var c = {
			"open-icon": "fa-folder-open",
			"close-icon": "fa-folder",
			selectable: true,
			"selected-icon": "fa-check",
			"unselected-icon": "dot-circle-o"
		};
		c = a.extend({}, c, d);
		this.each(function () {
			var e = a(this);
			e.removeData("tree");
			Huazie.tpl.loadTpl(TplUrlMap.get("tree"), function () {
				Huazie.tpl.loadTemp(e, "#tpl_common_tree", c);
				e.addClass(c.selectable === true ? "tree-selectable" : "tree-unselectable");
				e.tree(c);
				if (callback) {
					callback();
				}
			});
		});
		return this
	}
})(window.jQuery);

(function(a, b) {
	a.fn.ace_wysiwyg = function(c, h) {
		var d = a.extend({
			speech_button : true,
			wysiwyg : {}
		}, c);
		var e = [ "#ac725e", "#d06b64", "#f83a22", "#fa573c", "#ff7537", "#ffad46", "#42d692", "#16a765", "#7bd148",
				"#b3dc6c", "#fbe983", "#fad165", "#92e1c0", "#9fe1e7", "#9fc6e7", "#4986e7", "#9a9cff", "#b99aff",
				"#c2c2c2", "#cabdbf", "#cca6ac", "#f691b2", "#cd74e6", "#a47ae2", "#444444" ];
		var g = {
			font : {
				values : [ "Arial", "Courier", "Comic Sans MS", "Helvetica", "Open Sans", "Tahoma", "Verdana" ],
				icon : "fa fa-font",
				title : "Font"
			},
			fontSize : {
				values : {
					5 : "Huge",
					3 : "Normal",
					1 : "Small"
				},
				icon : "fa fa-text-height",
				title : "Font Size"
			},
			bold : {
				icon : "fa fa-bold",
				title : "Bold (Ctrl/Cmd+B)"
			},
			italic : {
				icon : "fa fa-italic",
				title : "Italic (Ctrl/Cmd+I)"
			},
			strikethrough : {
				icon : "fa fa-strikethrough",
				title : "Strikethrough"
			},
			underline : {
				icon : "fa fa-underline",
				title : "Underline"
			},
			insertunorderedlist : {
				icon : "fa fa-list-ul",
				title : "Bullet list"
			},
			insertorderedlist : {
				icon : "fa fa-list-ol",
				title : "Number list"
			},
			outdent : {
				icon : "fa fa-outdent",
				title : "Reduce indent (Shift+Tab)"
			},
			indent : {
				icon : "fa fa-indent",
				title : "Indent (Tab)"
			},
			justifyleft : {
				icon : "fa fa-align-left",
				title : "Align Left (Ctrl/Cmd+L)"
			},
			justifycenter : {
				icon : "fa fa-align-center",
				title : "Center (Ctrl/Cmd+E)"
			},
			justifyright : {
				icon : "fa fa-align-right",
				title : "Align Right (Ctrl/Cmd+R)"
			},
			justifyfull : {
				icon : "fa fa-align-justify",
				title : "Justify (Ctrl/Cmd+J)"
			},
			createLink : {
				icon : "fa fa-link",
				title : "Hyperlink",
				button_text : "Add",
				placeholder : "URL",
				button_class : "btn-primary"
			},
			unlink : {
				icon : "fa fa-unlink",
				title : "Remove Hyperlink"
			},
			insertImage : {
				icon : "fa fa-picture-o",
				title : "Insert picture",
				button_text : '<i class="fa fa-file"></i> Choose Image &hellip;',
				placeholder : "Image URL",
				button_insert : "Insert",
				button_class : "btn-success",
				button_insert_class : "btn-primary",
				choose_file : true
			},
			foreColor : {
				values : e,
				title : "Change Color"
			},
			backColor : {
				values : e,
				title : "Change Background Color"
			},
			undo : {
				icon : "fa fa-undo",
				title : "Undo (Ctrl/Cmd+Z)"
			},
			redo : {
				icon : "fa fa-repeat",
				title : "Redo (Ctrl/Cmd+Y)"
			},
			viewSource : {
				icon : "fa fa-code",
				title : "View Source"
			}
		};
		var f = d.toolbar
				|| [ "font", null, "fontSize", null, "bold", "italic", "strikethrough", "underline", null,
						"insertunorderedlist", "insertorderedlist", "outdent", "indent", null, "justifyleft",
						"justifycenter", "justifyright", "justifyfull", null, "createLink", "unlink", null,
						"insertImage", null, "foreColor", null, "undo", "redo", null, "viewSource" ];
		this
				.each(function() {
					var r = ' <div class="wysiwyg-toolbar btn-toolbar center"> <div class="btn-group"> ';
					for ( var n in f) {
						if (f.hasOwnProperty(n)) {
							var p = f[n];
							if (p === null) {
								r += ' </div> <div class="btn-group"> ';
								continue
							}
							if (typeof p == "string" && p in g) {
								p = g[p];
								p.name = f[n]
							} else {
								if (typeof p == "object" && p.name in g) {
									p = a.extend(g[p.name], p)
								} else {
									continue
								}
							}
							var q = "className" in p ? p.className : "";
							switch (p.name) {
							case "font":
								r += ' <a class="btn btn-sm ' + q + ' dropdown-toggle" data-toggle="dropdown" title="'
										+ p.title + '"><i class="' + p.icon
										+ '"></i><i class="fa fa-angle-down icon-on-right"></i></a> ';
								r += ' <ul class="dropdown-menu dropdown-light">';
								for ( var j in p.values) {
									if (p.values.hasOwnProperty(j)) {
										r += ' <li><a data-edit="fontName ' + p.values[j] + '" style="font-family:\''
												+ p.values[j] + "'\">" + p.values[j] + "</a></li> "
									}
								}
								r += " </ul>";
								break;
							case "fontSize":
								r += ' <a class="btn btn-sm ' + q + ' dropdown-toggle" data-toggle="dropdown" title="'
										+ p.title + '"><i class="' + p.icon
										+ '"></i>&nbsp;<i class="fa fa-angle-down icon-on-right"></i></a> ';
								r += ' <ul class="dropdown-menu dropdown-light"> ';
								for ( var t in p.values) {
									if (p.values.hasOwnProperty(t)) {
										r += ' <li><a data-edit="fontSize ' + t + '"><font size="' + t + '">'
												+ p.values[t] + "</font></a></li> "
									}
								}
								r += " </ul> ";
								break;
							case "createLink":
								r += ' <div class="inline position-relative"> <a class="btn btn-sm ' + q
										+ ' dropdown-toggle" data-toggle="dropdown" title="' + p.title + '"><i class="'
										+ p.icon + '"></i></a> ';
								r += ' <div class="dropdown-menu dropdown-caret pull-right">							<div class="input-group">								<input class="form-control" placeholder="'
										+ p.placeholder
										+ '" type="text" data-edit="'
										+ p.name
										+ '" />								<span class="input-group-btn">									<button class="btn btn-sm '
										+ p.button_class
										+ '" type="button">'
										+ p.button_text
										+ "</button>								</span>							</div>						</div> </div>";
								break;
							case "insertImage":
								r += ' <div class="inline position-relative"> <a class="btn btn-sm ' + q
										+ ' dropdown-toggle" data-toggle="dropdown" title="' + p.title + '"><i class="'
										+ p.icon + '"></i></a> ';
								r += ' <div class="dropdown-menu dropdown-caret pull-right">							<div class="input-group">								<input class="form-control" placeholder="'
										+ p.placeholder
										+ '" type="text" data-edit="'
										+ p.name
										+ '" />								<span class="input-group-btn">									<button class="btn btn-sm '
										+ p.button_insert_class
										+ '" type="button">'
										+ p.button_insert
										+ "</button>								</span>							</div>";
								if (p.choose_file && "FileReader" in window) {
									r += '<div class="space-2"></div>							 <div class="center">								<button class="btn btn-sm '
											+ p.button_class
											+ ' wysiwyg-choose-file" type="button">'
											+ p.button_text
											+ '</button>								<input type="file" data-edit="'
											+ p.name
											+ '" />							  </div>'
								}
								r += " </div> </div>";
								break;
							case "foreColor":
							case "backColor":
								r += ' <select class="hide wysiwyg_colorpicker" title="' + p.title + '"> ';
								for ( var m in p.values) {
									r += ' <option value="' + p.values[m] + '">' + p.values[m] + "</option> "
								}
								r += " </select> ";
								r += ' <input style="display:none;" disabled class="hide" type="text" data-edit="'
										+ p.name + '" /> ';
								break;
							case "viewSource":
								r += ' <a class="btn btn-sm ' + q + '" data-view="source" title="' + p.title
										+ '"><i class="' + p.icon + '"></i></a> ';
								break;
							default:
								r += ' <a class="btn btn-sm ' + q + '" data-edit="' + p.name + '" title="' + p.title
										+ '"><i class="' + p.icon + '"></i></a> ';
								break
							}
						}
					}
					r += " </div> </div> ";
					if (d.toolbar_place) {
						r = d.toolbar_place.call(this, r)
					} else {
						r = a(this).before(r).prev()
					}
					r.find("a[title]").tooltip({
						animation : false,
						container : "body"
					});
					r.find(".dropdown-menu input:not([type=file])").on(ace.click_event, function() {
						return false
					}).on("change", function() {
						a(this).closest(".dropdown-menu").siblings(".dropdown-toggle").dropdown("toggle")
					}).on("keydown", function(u) {
						if (u.which == 27) {
							this.value = "";
							a(this).change()
						}
					});
					r.find("input[type=file]").prev().on(ace.click_event, function(u) {
						a(this).next().click()
					});
					r.find(".wysiwyg_colorpicker").each(function() {
						a(this).ace_colorpicker({
							pull_right : true
						}).change(function() {
							a(this).nextAll("input").eq(0).val(this.value).change()
						}).next().find(".btn-colorpicker").tooltip({
							title : this.title,
							animation : false,
							container : "body"
						})
					});
					var k;
					if (d.speech_button && "onwebkitspeechchange" in (k = document.createElement("input"))) {
						var i = a(this).offset();
						r.append(k);
						a(k).attr({
							type : "text",
							"data-edit" : "inserttext",
							"x-webkit-speech" : ""
						}).addClass("wysiwyg-speech-input").css({
							position : "absolute"
						}).offset({
							top : i.top,
							left : i.left + a(this).innerWidth() - 35
						})
					} else {
						k = null
					}
					var s = a(this);
					var l = false;
					r.find("a[data-view=source]").on("click", function(v) {
						v.preventDefault();
						if (!l) {
							a("<textarea />").css({
								width : s.outerWidth(),
								height : s.outerHeight()
							}).val(s.html()).insertAfter(s);
							s.hide();
							a(this).addClass("active")
						} else {
							var u = s.next();
							s.html(u.val()).show();
							u.remove();
							a(this).removeClass("active")
						}
						l = !l
					});
					var o = a.extend({}, {
						activeToolbarClass : "active",
						toolbarSelector : r
					}, d.wysiwyg || {});
					a(this).wysiwyg(o)
				});
		return this
	}
})(window.jQuery);