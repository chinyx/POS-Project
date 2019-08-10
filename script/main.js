document.write('<script type="text/javascript" src="script/underscore-min.js"></script>');

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
		console.log('setData',data);
		for(let ele in data){
			this.pageData[ele]=data[ele];
		}
		this.render();
	};
	this.getData = function(){
		return this.pageData;
	};
	this.render=function(){
		console.log('render',this.pageData);
		let data = this.pageData;
		for(let ele in data) {
			let $element = $('#'+ele);
			console.log('element',$element);
			if($element.length === 0){
				console.log(`Element not found for id ${ele}`);
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
				$element.text(data[ele]);
			}
		}
	}
}
