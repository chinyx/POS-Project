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
		console.log('this',this);
		for(let ele in data){
			this.pageData[ele]=data[ele];
		}
		this.render();
	}
	this.render=function(){
		console.log('render',this.pageData);
		let data = this.pageData;
		for(let ele in data) {
			let element = $('#'+ele);
			if(element.length === 0){
				console.log(`Element not found for id ${ele}`);
				continue;
			}
			//console.log('element',element);
			if(element.tagName()==='img'){
				element.attr('src',data[ele]);
			} else if(element.tagName() === 'p') {
				element.text(data[ele]);
			}else {
				console.log(`Invalid Tag for Element ${ele}: ${element.tagName()}`);
			}
		}
	}
}
