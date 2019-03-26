TaskWindow = function(task, project, callback) {
	Window.call(this);
	this.url = bootPATH + './editor/TaskWindow.html';
	this.loadJs = [bootPATH+'libs/wdate/WdatePicker.js'];
	this.loadCss = [bootPATH+'editor/window.css'];
	this.width = 600;
	this.height = 500;
	this.title = 'task edit';
	this.skin = 'layui-layer-task';
	
	this.task = task;
	this.callback = callback;
	this.project = project;
	this.tasks = project.tasks;
	
	this.startup();
}

TaskWindow.prototype = new Window();
TaskWindow.prototype.constructor = TaskWindow;


TaskWindow.prototype.initControls = function(){
	
	this.ok = this.get('#twin_ok');
	this.cancel = this.get('#twin_cancel');
	
	//Code
	this.code = this.get('#twin_code');
	//Name  Milestone
	this.name = this.get('#twin_name');
	this.startIsMilestone = this.get('#twin_startIsMilestone');
	
	//Duration
	this.duration = this.get('#twin_duration');
	
	//Start
	this.start = this.get('#twin_start');
	//End 
	this.end = this.get('#twin_end');
	
	//Status
	this.status = this.get('#twin_status');
	
	//Progress
	this.progress = this.get('#twin_progress');
	
	//Predecessor
	this.addLink = this.get('#twin_linkadd');
	this.delLink = this.get('#twin_linkdel');
	this.PredecessorLink = this.get('#twin_pregrid')[0];
	this.Pre = this.PredecessorLink.obj;
	
	//Note
	this.note = this.get('#twin_note');
	
}

TaskWindow.prototype.initEvents = function() {
	
	var me = this;
	
	//ok
	this.ok.on("click", function (e) {
        var ret = true;
        if (me.callback) ret = me.callback('ok');
        if (ret !== false) {
            me.layer.close(me.index);
        }
    });
    
	//cancel
	this.cancel.on('click', function(){
		me.layer.close(me.index);
	})
	
/////////////////////////////////////////////////////////////////////////
	
	//Duration
	this.duration.on('input', function(){
		me.durationLinkageDate(this, 'duration');
	})
	//Start
	this.start[0].onchange = function(e){
		me.durationLinkageDate(this, 'start');
	}
	//End
	this.end[0].onchange = function(e){
		me.durationLinkageDate(this, 'end');
	}
	
/////////////////////////////////////////////////////////////////////////	
	
	//Predecessor
	this.addLink.on('click', function(){
		var data = me.Pre.getData();
		var link = {
            Type: 1,
            Lag: 0
        };
		if(data.length>0){
			var agg = [[0,1],[2,3]],
				t = [],
				def = [1,3];
			for(var i=0;i<data.length;i++){
				t.push(data[i].Type);
			}
			var iden = me.mutex(agg,t);
			link.Type = def[iden[0]];
		}
		me.Pre.addRow(link);
	})
	
	this.delLink.on("click", function (e) {
        me.Pre.removeSelected();
    });
    
	this.Pre.on("drawcell", function (e) {
		var field = e.field;
		
		if (field == "Name") {
			var data = me.Pre.getData(),
				pre = data[data.length-1];
			if(pre.Id){
				var task = me.project.tasks.filter(function(v){
        			return v.getRow()+1 == pre.Id;
	        	})
				e.value = task[0].id;
				e.cellHtml = task[0].name;
			}
       	}
		
		if (field == "Type") {
            e.cellHtml = me.project.PredecessorLinkType[e.value].name;
       	}
    }, this);
    
    this.Pre.on("cellbeginedit", function (e) {
        var field = e.field;
        
        if (e.field == "Name") {
        	var tasks = [];
        	me.project.tasks.forEach(function(v){
        		if(v.id != me.task.id){
        			tasks.push({"id": v.getRow()+1, "name": v.name});
        		}
        	})
        	tasks.unshift({"id":"", "name":""});
            e.editor.setData(tasks);
        }
        
        if (e.field == "Type") {
        	var data = me.Pre.getData(),
        		LinkType = [];
        	if(data.length>1){
				var agg = [[0,1],[2,3]],
					t = [],
					def = [1,3];
				for(var i=0;i<data.length;i++){
					t.push(data[i].Type);
				}
				var iden = me.mutex(agg,t).shift();
				for(var i=0;i<me.project.PredecessorLinkType.length;i++){
					if(agg[iden].indexOf(me.project.PredecessorLinkType[i].id) > -1){
						LinkType.push(me.project.PredecessorLinkType[i]);
					}
				}
			}else{
				for(var i=0;i<me.project.PredecessorLinkType.length;i++){
					LinkType.push(me.project.PredecessorLinkType[i]);
				}
			}
            e.editor.setData(LinkType);
        }
        
    }, this);
    
    this.Pre.on("cellcommitedit", function (e) {
    	var field = e.field;
    	
    	if (e.field == "Name") {
    		var t = e.getRowCellByField('Id');
    		t.cellHtml = me.Pre.data[e.parentNode.rowIndex]['Id'] = e.value;
        }
    	
    }, this);

	
}

TaskWindow.prototype.setData = function(){
	
	var task = this.task;
	
	//Code
	this.code.val(task.code);
	//Name  Milestone
	this.name.val(task.name);
	this.startIsMilestone[0].checked = task.startIsMilestone;
	//Duration
	this.duration.val(task.duration || 1);
	//Start
	this.start.val(getDateFormat(task.start));
	//End
	this.end.val(getDateFormat(task.end));
	
	//Status
	this.status.val(task.status);
	
	//progress
	this.progress.val(task.progress);
	
	//Predecessor
	this.Pre.setData(task.predecessors);
	
	//Note
	this.note.val(task.note);
	
}

TaskWindow.prototype.getData = function(){
	
	var task = {
		"code": this.code.val(),
		"name": this.name.val(),
		"startIsMilestone": this.startIsMilestone[0].checked,
		"duration": this.duration.val(),
		"start": this.start.val(),
		"end": this.end.val(),
		"status": this.status.val(),
		"progress": this.progress.val(),
		"resources": [],
		"note": this.note.val()
	}
	
	//Predecessor
	var predecessors = this.Pre.getData();
	if(predecessors.length>0){
		task["predecessors"] = predecessors.filter(function(v){
			return v["Id"];
		})
	}
	
	return task;
	
}

//mutex option
TaskWindow.prototype.mutex = function(agg, data){
	
	var iden = [];
	
	var t = data[0];
	for(var i=0;i<agg.length;i++){
		for(var j=0;j<agg[i].length;j++){
			if(t==agg[i][j]) iden.push(i);
		}
	}
	
	return iden;
	
}

//duration and date linkage
TaskWindow.prototype.durationLinkageDate = function(obj, type){
	var duration = this.duration.val(),
		start = this.start.val(),
		end = this.end.val();
		
	var du = recomputeDuration(start, end);
		
	switch(type){
		case 'duration':
			if(duration != du){
				var newEnd = computeEndByDuration(start, duration);
				this.end.val(getDateFormat(newEnd));
			}
			break;
		case 'start':
			var newEnd = computeEndByDuration(start, duration);
			this.end.val(getDateFormat(newEnd));
			break;
		case 'end':
			if(du<1){
				du = 1;
				this.start.val(end);
			}
			this.duration.val(du);
			break;
		default:
			console.log('error');
	}
}