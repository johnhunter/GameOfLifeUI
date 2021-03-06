var automation = (function Automation(){
	var triggerCellUpdate = function(){};
	var triggerCellCreate = function(){};
	
	var size = 48;

	function init(){
		var world = [];
		createCellCollection(world);
		makeCellsAware(world);
		startTime(world);
	}

	function startTime(world){
		setInterval(function(){
			iterate(world);
		},100);
	}

	function boundLeft(index){
		var mod = index % size;
		return mod === (size-1) ? -1 : index;
	}

	function boundRight(index){
		var mod = index % size;
		return mod === 0 ? -1 : index;
	}

	function makeCellsAware(world){
		world.forEach(function(cell, index){
			cell.environment = [
				world[ boundLeft(index-1) ],
				world[ boundLeft(index-size-1) ],
				world[ index-size ],
				world[ boundRight(index-size+1) ],
				world[ boundRight(index+1) ],
				world[ boundRight(index+size+1) ],
				world[ index+size ],
				world[ boundLeft(index+size-1) ]
			];
		});
	}

	function createCellCollection(world){
		var i = 0;
		var worldSize = size*size;
		var cell;
		for (;i++<worldSize;){
			cell = createCell( Math.random()*100%6 > 2 );
			triggerCellCreate(cell, i);
			world.push(cell);
		}
	}

	function createCell(life){
		return {
			willLive: false,
			alive: life
		};
	}

	function iterate(world){
		chooseLife(world);
		invokeChoice(world);
	}

	function chooseLife(world){
		world.forEach(function(cell){
			var neighbors = getNeighbors(cell);

			if(cell.alive && neighbors < 2){
				cell.willLive = false;
				return;
			}

			if(cell.alive && (neighbors === 2 || neighbors === 3)){
				cell.willLive = true;
				return;
			}

			if(cell.alive && (neighbors > 3)){
				cell.willLive = false;
				return;
			}

			if (!cell.alive && neighbors === 3){
				cell.willLive = true;
				return;
			}
			
			cell.willLive = false;
		});
	}

	function invokeChoice(world){
		world.forEach(function(cell, index){
			var isStateChanged = cell.alive !== cell.willLive;
			cell.alive = cell.willLive;
			triggerCellUpdate(cell, index);
		});
	}

	function getNeighbors(cell){
		var neighbors = 0;
		cell.environment.forEach(function(cell){
			if(cell && cell.alive){
				neighbors++;
			}
		});
		return neighbors;
	}

	return {
		onCellUpdate: function(callback){
			triggerCellUpdate = callback;
		},
		onCellCreate: function(callback){
			triggerCellCreate = callback;
		},
		size: function(){
			return size;
		},
		start: init
	};
}());