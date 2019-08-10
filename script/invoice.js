const page = new Page();
$('#headerImage').on('dblclick',async (e)=> {
	let file = new openFile();
	const callback = (url)=>{
		if(!url){
			alert('Invalid File');
			return;
		}
		console.log('url',url);
		page.setData({
			headerImage:url
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
	page.setData(data);
});