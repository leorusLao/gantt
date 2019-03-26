Window = function() {
	this.url = '';
	this.width = 580;
	this.height = 480;
	this.layer = layer;
	this.title = '窗口';
	this.skin = 'layui-layer-task';
	this.loadJs = [];
	this.loadCss = [];
	this.index;

	if(typeof Window._initialized == "undefined") {
		Window.prototype.init = function() {
			this.initTabs();
			this.initDataGrid();
			this.LoadRely();
			this.initControls();
			this.initEvents();
			this.setData();
		}
		Window.prototype.initControls = function() {
			
		}
		Window.prototype.initEvents = function() {

		}
		Window.prototype.setData = function() {

		}
		Window.prototype.initTabs = function() {
			var tabs = this.get('#win-tabs');
			if(tabs.length>0){
				new WindowTabs(tabs);
			}
		}
		Window.prototype.initDataGrid = function() {
			var grid = this.get('.win-datagrid'),
				len = grid.length;
			if(len>0){
				for(i=0;i<len;i++){
					new WindowDataGrid(grid[i]);
				}
			}
		}
		Window.prototype.LoadRely = function() {
			var body = this.get('body')[0],
				head = this.get('head')[0],
				JSlen = this.loadJs.length,
				CSSlen = this.loadCss.length;
			if(CSSlen>0){
				for(i=0;i<CSSlen;i++){
					var _link = document.createElement('link');
					_link.setAttribute('rel','stylesheet');
					_link.setAttribute('type','text/css');
					_link.setAttribute('href',this.loadCss[i]);
					head.appendChild(_link);
				}
			}	
			if(JSlen>0){
				for(i=0;i<JSlen;i++){
					var _script = document.createElement('script');
					_script.setAttribute('charset','gbk');
					_script.setAttribute('type','text/javascript');
					_script.setAttribute('src',this.loadJs[i]);
					body.appendChild(_script);
				}
			}
		}
		Window.prototype.params = function() {
			var t = this;
			return {
				type: 2,
				title: t.title,
				skin: t.skin,
				area: [t.width + 'px', t.height + 'px'],
				content: t.url,
				resize: false,
				success: function() {
					t.init();
				}
			}
		};
		Window.prototype.startup = function() {
			var params = this.params();
			this.index = this.layer.open(params);
		};
		Window.prototype.close = function() {
			this.layer.close(this.index);
		};
		Window.prototype.get = function(selector) {
			return this.layer.getChildFrame(selector, this.index);
		}

		Window._initialized = true;
	}

}


WindowTabs = function(tab){
	this.tab = tab || null;
	this.tabs = [];
	
	if(typeof WindowTabs._initialized == "undefined") {
		WindowTabs.prototype.init = function() {
			this.initTabs();
			this.render();
		}
		
		WindowTabs.prototype.initTabs = function(){
			var tabs = this.tab.children(),
				len = tabs.length;
				
			for(i=0;i<len;i++){
				this.tabs[i] = {
					'state':0,
					'name':tabs[i].name,
					'title':tabs[i].title,
					'elem':tabs[i]
				};
				if(!i) this.tabs[i].state = 1;
			}
		}
		
		WindowTabs.prototype.render = function(){
			var tabHeader = $('<div></div>'),
				ul = $('<ul></ul>'),
				tabs = this.tabs,
				len = tabs.length,
				that = this;
			tabHeader.addClass('win-tabs-header');
			
			for(i=0; i<len; i++){
				var t = $('<li></li>');
				t.html(tabs[i].title).attr('tab', i);
				if(tabs[i].state)
					t.addClass('active');
				else
					tabs[i].elem.className = 'hidden';
				ul.append(t);
			}
			
			ul.on('click', function(e){ that.Switch(e); });
			
			tabHeader.append(ul);
			this.tab.before(tabHeader);
		}
		
		WindowTabs.prototype.Switch = function(e){
			if(e.target.tagName == "LI"){
				var elem = $(e.target),
				tab = elem.attr('tab');
				elem.addClass('active').siblings().removeClass('active');	
				for(i=0;i<this.tabs.length;i++){
					if(i==tab){
						this.tabs[i].state = 1;
						this.tabs[i].elem.className = '';
					}else{
						this.tabs[i].state = 0;
						this.tabs[i].elem.className = 'hidden';
					}
				}
			}
		}
		
		
		WindowTabs._initialized = true;
	}	
	
	this.init();
}

WindowDataGrid = function(grid){
	this.grid = grid || null;
	this.data = [];
	this.columns = [];
	this.header;
	this.hTable;
	this.body;
	this.bTable;
	
	if(typeof WindowDataGrid._initialized == "undefined") {
		
		WindowDataGrid.prototype.init = function() {
			this.getColumns();
			
			this.header = this.createPart('header');
			this.hTable = this.createTable();
			this.body = this.createPart('body');
			this.bTable = this.createTable();
			
			this.initHeader();
			this.initBody();
			
			this.initEvent();
			
			this.grid.obj = this;
		}
		
		WindowDataGrid.prototype.addRow = function(obj) {
			this.addDataRow(obj);
			
			var tr = document.createElement('tr'),
				columns = this.columns,
				len = columns.length;
			
			for(var i=0;i<len;i++){
				var td = this.createCell(columns[i], obj);
				tr.appendChild(td);
			}
			
			this.bTable.appendChild(tr);
			
		}
		
		WindowDataGrid.prototype.addDataRow = function(obj) {
			this.data.push(obj);
		}
		
		WindowDataGrid.prototype.removeDataRow = function(index) {
			this.data.splice(index, 1);
		}
		
		WindowDataGrid.prototype.setData = function(data) {
			var me = this;
			me.cleanData();
			if(Array.isArray(data)){
				if(data.length>0){
					data.forEach(function(v){
						me.addRow(v);
					})
				}
			}
		}
		
		WindowDataGrid.prototype.getData = function() {
			return this.data;
		}
		
		WindowDataGrid.prototype.removeSelected = function() {
			var rows = this.bTable.children,
				len = rows.length;
			for(var i=0;i<len;i++){
				if(typeof rows[i]!='undefined' && rows[i].className == 'win-grid-row-selected'){
					this.removeDataRow(i);
					this.bTable.removeChild(rows[i]);
				}
			}
		}
		
		WindowDataGrid.prototype.createCell = function(col, obj) {
			var me = this,
				td = document.createElement('td'),
				cellHtml = document.createElement('span');
				
			td.field = col.field;
			td.width = col.width;
			
			td.appendChild(cellHtml);
			
			td.getRowCellByField = function(field){
				var cells = siblings(this),
					len = cells.length;
				if(len>0){
					for(var i=0;i<len;i++){
						if(cells[i].field==field)
							return cells[i];
					}
				}
				return false;
			}
			
			if(!col.editor){
				var div = document.createElement('div');
				td.appendChild(div);
				td.cellHtml = cellHtml.innerText = div.innerText = !isEmpty(obj[col.field]) ? obj[col.field] : '';
				registerObserver(td, 'cellHtml', function(){
					cellHtml.innerText = div.innerText = td.cellHtml;
				});
			}else{
				var type = col.editor.type;
				switch(type){
					case 'textbox':
						var input = document.createElement('input');
						input.type = 'text';
						td.appendChild(input);
						td.value = td.cellHtml = input.value = cellHtml.innerText = !isEmpty(obj[col.field]) ? obj[col.field] : '';
						registerObserver(td, 'cellHtml', function(){
							td.value = input.value = cellHtml.innerText = td.cellHtml;
						});
						input.addEventListener('input', function(){
							td.value = cellHtml.innerText = td.cellHtml = this.value;
							me.emit('cellcommitedit', td);
						})
						break;
					case 'spinner':
						var input = document.createElement('input');
						input.type = 'number';
						td.appendChild(input);
						td.value = td.cellHtml = input.value = cellHtml.innerText = !isEmpty(obj[col.field]) ? obj[col.field] : '';
						registerObserver(td, 'cellHtml', function(){
							td.value = input.value = cellHtml.innerText = td.cellHtml;
						});
						input.addEventListener('input', function(){
							td.value = cellHtml.innerText = td.cellHtml = this.value;
							me.emit('cellcommitedit', td);
						})
						break;
					case 'combobox':
						var select = document.createElement('select');
						td.appendChild(select);
						td.value = !isEmpty(obj[col.field]) ? obj[col.field] : '';
						select.setData = function(data){
							var len = data.length;
							this.options.length=0;
							for(var i=0;i<len;i++){
								var op = new Option(data[i].name, data[i].id);
								if(data[i].id==td.value) op.selected = true;
								this.add(op);
							}
						}
						select.addEventListener('change', function(){
							var index = this.selectedIndex;
							td.cellHtml = this.options[index].text;
							td.value = this.value;
							me.emit('cellcommitedit', td);
						})
						
						td.editor = select;
						
						registerObserver(td, 'cellHtml', function(){
							cellHtml.innerText = td.cellHtml;
						});
						break;
					default:
						
				}
				
			}
			
			me.emit('drawcell', td);
			
			return td;
			
		}
		
		WindowDataGrid.prototype.createPart = function(type) {
			var o = {
				'header': 'win-grid-header',
				'body': 'win-grid-body'
			};
			var div = document.createElement('div');
			div.className = o[type];
			return div;
		}
		
		WindowDataGrid.prototype.createTable = function() {
			var table = document.createElement('table');
			table.border = 0;
			table.cellSpacing = 0;
			table.cellPadding = 0;
			return table;
		}
		
		WindowDataGrid.prototype.initHeader = function() {
			var tr = document.createElement('tr'),
				columns = this.columns,
				len = columns.length;
			
			for(var i=0;i<len;i++){
				var th = document.createElement('th');
				th.width = columns[i].width;
				th.innerText = columns[i].name;
				tr.appendChild(th);
			}
			
			this.hTable.appendChild(tr);
			
			this.header.appendChild(this.hTable);
			this.grid.appendChild(this.header);
		}
		
		WindowDataGrid.prototype.initBody = function() {
			this.body.appendChild(this.bTable);
			this.grid.appendChild(this.body);
		}
		
		WindowDataGrid.prototype.getColumns = function() {
			var columns = this.grid.children[0].children,
				len = columns.length;
				
			for(var i=0;i<len;i++){
				this.columns[i] = {
					"field": columns[i].getAttribute('field'),
					"name": columns[i].innerText,
					"width": columns[i].getAttribute('width'),
					"editor": columns[i].getAttribute('editor')
				};
				if(this.columns[i].editor){
					this.columns[i].editor = eval("("+ this.columns[i].editor +")");
				}
			}
			
			this.clean();
		}
		
		WindowDataGrid.prototype.clean = function() {
			this.grid.innerHTML = '';
		}
		
		WindowDataGrid.prototype.cleanData = function(){
			this.data = [];
			this.bTable.innerHTML = '';
		}
		
		WindowDataGrid.prototype.initEvent = function() {
			var me = this;
			
			this.on('drawcell',function(){});
			
			this.on('cellbeginedit',function(){});
			
			this.on('cellcommitedit',function(e){
				me.data[e.parentNode.rowIndex][e.field] = e.value;
			});
			
			this.bTable.addEventListener('click', function(e){
				var elem = e.target || e.srcElement,
					tar;
				if(elem.tagName=='TD'){
					tar = elem;
				}else{
					tar = elem.parentNode;
				}
				me.switchFocus(tar);
				me.emit('cellbeginedit', tar);
			})
		}
		
		WindowDataGrid.prototype.switchFocus = function(elem) {
			var d = siblings(elem),
				r = siblings(elem.parentNode);
			elem.className = 'win-grid-cell-selected';
			elem.parentNode.className = 'win-grid-row-selected';
			for(var i=0;i<d.length;i++){
				d[i].className = '';
			}
			for(var i=0;i<r.length;i++){
				r[i].className = '';
				var rd = r[i].children;
				for(var j=0;j<rd.length;j++) {
					rd[j].className = '';
				}
			}
		}
		
		WindowDataGrid.prototype.on = function(eventName, callback) {
			if(!this.handles){
	            //this.handles={};
	            Object.defineProperty(this, "handles", {
	                value: {},
	                enumerable: false,
	                configurable: true,
	                writable: true
	            })
	        }
	       	
	        if(!this.handles[eventName]){
	            this.handles[eventName]=[];
	        }
	        this.handles[eventName].push(callback);
		}
		
		WindowDataGrid.prototype.emit = function(eventName) {
			if(this.handles[arguments[0]]){
	            for(var i=0;i<this.handles[arguments[0]].length;i++){
	               this.handles[arguments[0]][i](arguments[1]);
	            }
	        }
		}
		
		WindowDataGrid._initialized = true;
	}	
	
	this.init();
}


function siblings(elm) {
	var a = [];
	var p = elm.parentNode.children;
	for(var i =0,pl= p.length;i<pl;i++) {
		if(p[i] !== elm) a.push(p[i]);
	}
	return a;
}

function isEmpty(obj){
    if(typeof obj == "undefined" || obj == null || obj === ""){
        return true;
    }else{
        return false;
    }
}

/*
 * 注册观察者
 */
function registerObserver(obj, param, func){
    // 定义观察者
    Object.defineProperty(obj, param, {
        enumerable: true,
        configurable: true,
        get: function() {
            return param;
        },
        set: function(val) {
            //调用处理函数
            param = val;
            func(val);
        }
    });
}