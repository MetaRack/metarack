var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function App() {

	var modalp5 = '';
	var list = [];
	var mod = null;
	var prev_value = '';
	var is_cleaned = false;

	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = engine.module_keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var key = _step.value;

			list.push({ value: key, name: key });
		}
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	var modalSketch = function modalSketch(sketch) {

		sketch.setup = function () {
			var cnv = sketch.createCanvas(rackwidth, rackheight);
			sketch.background(0, 0, 0, 0);
			cnv.position(400, 100);
		};

		sketch.draw = function () {
			sketch.background(0, 0, 0, 0);
			if (mod != null && mod.cbf != null) {
				if (!is_cleaned) {
					modalp5.fill(255);
					modalp5.noStroke();
					modalp5.rect(0, 0, 1000, 1000);
					is_cleaned = true;
				}
				proxy_draw(mod, mod.x, mod.y);
			} else {
				modalp5.fill(255);
				modalp5.noStroke();
				modalp5.rect(0, 0, 1000, 1000);
			}
		};
	};

	proxy_draw = function (_proxy_draw) {
		function proxy_draw(_x, _x2, _x3) {
			return _proxy_draw.apply(this, arguments);
		}

		proxy_draw.toString = function () {
			return _proxy_draw.toString();
		};

		return proxy_draw;
	}(function (_mod, x, y) {
		if (_mod.cbf != null) {
			modalp5.image(_mod.cbf, (x + _mod.gparent.x - mod.x) * 3, (y + _mod.gparent.y - mod.y) * 3, _mod.w * 3, _mod.h * 3);
		}
		if (_mod.dbf != null) {
			modalp5.image(_mod.dbf, (x + _mod.gparent.x - mod.x) * 3, (y + _mod.gparent.y - mod.y) * 3, _mod.w * 3, _mod.h * 3);
		}
		if (_mod.sbf != null) {
			modalp5.image(_mod.sbf, (x + _mod.gparent.x - mod.x) * 3, (y + _mod.gparent.y - mod.y) * 3, _mod.w * 3, _mod.h * 3);
		}
		if (_mod.gchildren.length > 0) {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;

			try {
				for (var _iterator2 = _mod.gchildren[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var iter = _step2.value;

					proxy_draw(iter, iter.x + _mod.gparent.x, iter.y + _mod.gparent.y);
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		}
	});

	var _React$useState = React.useState(false),
	    _React$useState2 = _slicedToArray(_React$useState, 2),
	    flag = _React$useState2[0],
	    setFlag = _React$useState2[1];

	handleOpenModal = function handleOpenModal() {
		setFlag(true);
	};

	ensureBufIsSet = function ensureBufIsSet() {
		return new Promise(waitForBuf);

		function waitForBuf(resolve) {
			if (mod.cbf != null) {
				resolve(true);console.log('heh');
			}
		}
	};

	handleClick = function handleClick(event) {
		if (mod != null) engine.remove_module(mod);
		mod = new engine.module_registry[event.target.value]();
		is_cleaned = false;
		if (event.target.value == prev_value) handleChange();
		prev_value = event.target.value;
	};

	handleCloseModal = function handleCloseModal() {
		setFlag(false);
		modalp5.clear();
	};

	handleCloseModalByButton = function handleCloseModalByButton() {
		setFlag(false);
		modalp5.clear();
		if (mod != null) engine.remove_module(mod);
	};

	handleChange = function handleChange() {
		modalp5.clear();
		handleCloseModal();
	};

	setp5 = function setp5() {
		modalp5 = new p5(modalSketch, document.getElementById('modalp5sketch'));
	};

	return React.createElement(
		'div',
		null,
		React.createElement(
			'button',
			{ onClick: handleOpenModal },
			'Add module'
		),
		React.createElement(
			ReactModal,
			{
				isOpen: flag,
				onAfterOpen: setp5
			},
			React.createElement(
				'div',
				{ id: 'modalp5sketch' },
				React.createElement(
					'button',
					{ onClick: handleCloseModalByButton },
					'Close'
				),
				React.createElement(
					'div',
					{ 'class': 'select select--multiple' },
					React.createElement(
						'select',
						{ id: 'multi-select', multiple: true, style: { height: "600px", width: "300px" } },
						list.map(function (list) {
							return React.createElement(
								'option',
								{ value: list.value, onClick: handleClick },
								list.name
							);
						})
					),
					React.createElement('span', { 'class': 'focus' })
				)
			)
		)
	);
}