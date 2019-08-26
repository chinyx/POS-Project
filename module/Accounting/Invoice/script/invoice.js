const page = new Page();
const getData = function(){
	return page.getData();
};
const setData = function(data){
	return page.setData(data);
};
function addLine(){
	let description=$('#descriptionInput').val();
	let qty=parseFloat($('#qtyInput').val());
	let uom=$('#uomInput').val();
	let unitPrice=parseFloat($('#unitPriceInput').val());
	let discount=parseFloat($('#discountInput').val());
	let data=getData();
	let qtyTotal=parseFloat(data.qtyTotal?data.qtyTotal:0);
	let discountTotal=parseFloat(data.discountTotal?data.discountTotal:0);
	let amountTotal=parseFloat(data.amountTotal?data.amountTotal:0);
	if(!data.lines){
		data.lines=[];
		data.qtyTotal=0;
		data.discountTotal=0;
		data.amountTotal=0;
	}
	let seq=data.lines.length+1;
	let amount=qty*(unitPrice-discount);
	console.log('unitPrice',unitPrice);
	data.lines.push({
		seq:seq,
		description:description,
		qty:qty,
		uom:uom,
		unitPrice:unitPrice.toFixed(2),
		discount:discount.toFixed(2),
		amount:amount.toFixed(2),
	});
	data.qtyTotal=(qtyTotal+qty).toFixed(2);
	data.discountTotal=(discountTotal+(qty*discount)).toFixed(2);
	data.amountTotal=(amountTotal+amount).toFixed(2);
	setData();
	$('#itemForm').modal('hide');
}

$(document).ready(()=>{
	page.onload();
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
			});
		}
		file.openFileToUrl(callback);
	});

	$('.infoInput').change((e)=>{
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
	});

	$('#itemModal').on('shown.bs.modal',function(){
		$('#descriptionInput').focus();
	});
	$('#itemForm').on('keydown',function(e){
		console.log('shift:',e.shiftKey,'key',e.key);
		if(!e.shiftKey && e.key === 'Enter'){
			addLine();
		}
	})
});



