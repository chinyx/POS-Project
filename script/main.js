//document.write('<script type="text/javascript" src="script/underscore-min.js"></script>');

jQuery.fn.tagName=function() {
	return this.prop('tagName').toLowerCase();
}


function openFile(){
	this.url=null;
	this.openFileToUrl=function(callback){
		console.log(callback);
		let fileInput = document.createElement("input");
		this.fileInput = fileInput;
		fileInput.type = "file";
		console.log('fileInput',fileInput);
		$(fileInput).change((e)=>{
				let file = e.target.files[0];
				console.log("file: ",file);
				let reader = new FileReader();
				console.log('reader',reader);
				reader.onload = function(readerEvent){
					callback(URL.createObjectURL(file));
				};
				reader.readAsDataURL(file);
			})
		fileInput.click();
	}
	this.getUrl=function(){
		return this.waitForDialog().then((url)=>{
			console.log('getUrl',url);
			this.url=url;
			return url;
		});
	}
}


function Page(){
	this.onload=function(){
		const _page = this;
		_page.loadVar();
		let ctx = {};
		for(let variable in _page.variables){
			let v = variable.match(/{([^}]*)}/);
			ctx[v[1]]='';
		};
		_page.setVar(ctx);
	}
	this.pageData = {};
	this.setData = function(data){
		const _page = this;
		console.log('setData',data);
		for(let ele in data){
			_page.pageData[ele]=data[ele];
		}
		_page.render();
	};
	this.getData = function(){
		const _page = this;
		return _page.pageData;
	};
	this.render= function(){
		const _page = this;
		console.log('render',_page.pageData);
		let data = _page.pageData;
		for(let ele in data) {
			let $element = $('#'+ele);
			//console.log('element',$element);
			if($element.length === 0){
				console.log(`Element not found for id ${ele}`);
				let ctx = {};
				ctx[ele]=data[ele];
				_page.setVar(ctx);
				continue;
			}
			if($element.tagName()==='img'){
				for (let attr in data[ele]){
					$element.attr(attr,data[ele][attr]);
				}
			} else if($element.tagName() === 'table'){
				const $templateRow = $element.find('[name=templateRow]');
				if(!$templateRow || $templateRow.length === 0) {
					alert(`Template Row not Found for Table: #${ele}`);
				}
				console.log('template Row',$templateRow);
				const $clone = $templateRow.clone();
				const $tbody = $element.find('tbody');
				$tbody.empty();
				let lines = data[ele];
				_.forEach(lines,l=>{
					let $dataRow = $clone.clone();
					$dataRow.attr('name','dataRow');
					$dataRow.removeClass('d-none d-print-none');
					console.log('dataRow',$dataRow[0]);
					for(let replace in l){
						let re = RegExp(`{${replace}}`,'g')
						$dataRow.html($dataRow.html().replace(re,l[replace]));
					}
					$tbody.append($dataRow);
				});
				$tbody.append($clone);
			} else {
				_page.setVar({ele:data[ele]});
			}
		}
	};
	this.variables={};
	this.setVar = function(ctx){
		console.log('setVar',ctx);
		const _page = this;
		for(variable in ctx){
			let elements = _page.variables[`{${variable}}`];
			if(elements){
				elements.forEach(ele=>{
					let re = RegExp(`{${variable}}`,'g')
					ele.element.innerText = ele.value.replace(re,ctx[variable]);
				})	
			}
		}
	}
	this.loadVar = function(){
		const _page = this;
		let templateRowsArray = [];
		let $templateRows = $('[name=templateRow]');
		$templateRows.each(function(){
			let parent = $(this).parent();
			let child = $(this);
			templateRowsArray.push({parent:parent,child:child});
			$(this).detach();
		});
		//console.log('templateRows',templateRowsArray);
		$(`:not("[name=templateRow]") :contains("{")`).each(function(){
			let _parent = this;
			if(_parent.children.length===0 && $(_parent).tagName()!=='script'){
				let elements=_parent.innerText.match(/{([^}]*)}/g);
				if(elements && elements.length != 0) {
					elements.forEach(o=>{
						if(!_page.variables[o])_page.variables[o]=[];
						_page.variables[o].push({element:_parent,value:_parent.innerText});
					})
				}
			}
		});
		templateRowsArray.forEach(function(e){
			e.child.appendTo(e.parent);
		});
		console.log('loadVar',_page.variables);
	}
}
