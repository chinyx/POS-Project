const page = new Page();
const getData = function(){
	return page.getData();
}
const setData = function(data){
	return page.setData(data);
}

$('#headerImage').on('dblclick',async (e)=> {
	let file = new openFile();
	const callback = (url)=>{
		if(!url){
			alert('Invalid File');
			return;
		}
		console.log('url',url);
		setData({
			headerImage:{src:url}
		})
	}
	file.openFileToUrl(callback);
})

$('.input').change((e)=>{
	let id = $(e.target).attr('id');
	let val = e.target.value;
	if(!id) console.error(`Element with id "${id}" not found`);
	let val_id = id.replace('Input','Value');
	let data = {};
	data[val_id]=val;
	setData(data);
});

$(document).keydown(function(e){
	if(e.ctrlKey && e.key === 'i'){
		$('#itemForm').modal('show');
	}
})

$('#itemModal').on('shown.bs.modal',function(){
	$('#descriptionInput').focus();
})
	