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
		console.log('render',page.pageData);
		let data = page.pageData;
		for(let ele in data) {
			let $element = $('#'+ele);
			console.log('element',$element);
			if($element.length === 0){
				console.log(`Element not found for id ${ele}`);
				let re = RegExp(`{${ele}}`,'g');
				$(`:not("[name=templateRow]") :contains("{${ele}}")`).each(function(){
					let _parent = this;
					if(_parent.children.length===0){
						_parent.innerText=_parent.innerText.replace(re,data[ele]);
						console.log('parent',_parent);
						console.log('page',_page);
						_page.variables[ele]=_parent;				
					}
				});
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
					console.log('dataRow',$dataRow[0]);
					for(let replace in l){
						let re = RegExp(`{${replace}}`,'g')
						$dataRow.html($dataRow.html().replace(re,l[replace]));
					}
					$tbody.append($dataRow);
				});
				$tbody.append($clone);
			} else {
				let re = RegExp(`{${ele}}`,'g')
				$(':not("[name=templateRow]")').each(function(){
					$(this).text($(this).text().replace(re,data[ele]));
				});
			}
		}
	};
	this.variables={};
}
