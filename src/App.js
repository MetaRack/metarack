function App() {

	let modalp5 = '';
	var list = [];
	let mod = null;
	let prev_value = '';
	let is_cleaned = false;

    for (let key of engine.module_keys) {
      list.push ({value: key, name: key});
    }

	const modalSketch = (sketch) => {

		sketch.setup = () => {
			let cnv = sketch.createCanvas(rackwidth, rackheight);
			sketch.background(0, 0, 0, 0);
		    cnv.position(400, 100);
		};

		sketch.draw = () => {
		    sketch.background(0, 0, 0, 0);
		    if ((mod != null) && (mod.cbf != null)) {
		    	if (!is_cleaned) {
		    		modalp5.fill(255);
			    	modalp5.noStroke();
			    	modalp5.rect(0, 0, 1000, 1000);
			    	is_cleaned = true;
		    	}
		    	proxy_draw(mod, mod.x, mod.y);
		    }
		    else {
		    	modalp5.fill(255);
		    	modalp5.noStroke();
		    	modalp5.rect(0, 0, 1000, 1000);
		    }
		};
	};

	proxy_draw = (_mod, x, y) => {
		if (_mod.cbf != null) {
			modalp5.image(_mod.cbf, (x + _mod.gparent.x - mod.x)*3, (y + _mod.gparent.y - mod.y)*3, _mod.w*3, _mod.h*3);
		}
		if (_mod.dbf != null) {
			modalp5.image(_mod.dbf, (x + _mod.gparent.x - mod.x)*3, (y + _mod.gparent.y - mod.y)*3, _mod.w*3, _mod.h*3);
		}
		if (_mod.sbf != null) {
			modalp5.image(_mod.sbf, (x + _mod.gparent.x - mod.x)*3, (y + _mod.gparent.y - mod.y)*3, _mod.w*3, _mod.h*3);
		}
		if (_mod.gchildren.length > 0) {
			for (let iter of _mod.gchildren) {
				proxy_draw(iter, iter.x + _mod.gparent.x, iter.y + _mod.gparent.y);
		    }
		}
	}

	const [flag, setFlag] = React.useState(false);

    handleOpenModal = () => {
		setFlag(true);
	}

	ensureBufIsSet = () => {
		return new Promise(waitForBuf);

		function waitForBuf(resolve) {
    		if (mod.cbf != null) {resolve(true); console.log('heh')}
		}
	}

	handleClick = (event) => {
		if (mod != null) engine.remove_module(mod);
		mod = new engine.module_registry[event.target.value]();
		is_cleaned = false;
		if (event.target.value == prev_value) handleChange();
		prev_value = event.target.value;
	}
	  
	handleCloseModal = () => {
		setFlag(false);
		modalp5.clear();
	}

	handleCloseModalByButton = () => {
		setFlag(false);
		modalp5.clear();
		if (mod != null) engine.remove_module(mod);
	}

	handleChange = () => {
		modalp5.clear();
        handleCloseModal();
	}

	setp5 = () => {
		modalp5 = new p5(modalSketch, document.getElementById('modalp5sketch'));
	}

	return (
		<div>
			<button onClick={handleOpenModal}>New Module</button>
			<ReactModal 
	           isOpen={flag}
	           onAfterOpen={setp5}
	        >
	        	<div id='modalp5sketch'>
			   		<button onClick = {handleCloseModalByButton}>Close</button>
			        <div class="select select--multiple">
					  <select id="multi-select" multiple style={{height: "600px", width:"300px"}}>
			                {list.map(list => 
			                  <option value = {list.value} onClick={handleClick}>
			                    {list.name}
			                  </option>
			                )}
					  </select>
					  <span class="focus"></span>
					</div>
			     </div>
			</ReactModal>
		</div>
	);
}