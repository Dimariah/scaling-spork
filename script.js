// elements referencing
const form = document.forms[0];
const inp = document.querySelector('.input');
const UIlist = document.querySelector('.UI-list');
const alert = document.querySelector('.alert');
const listCont = document.querySelector('.listContainer');
const clearAll = document.querySelector('.clr');
const subBtn = document.querySelector('.submit');
let id = localStorage.list ? lastItemID() : 0;
let editFlag = false;
let editItemContent;
let EditID;
// event listeners
form.addEventListener('submit', (e) => {
	e.preventDefault();
	value = inp.value;
	if (value && !editFlag) {
		inp.value = '';
		const item = createItem(value, id);
		UIlist.appendChild(item);
		const rmBtn = item.querySelector('.deleteBtn');
		rmBtn.addEventListener('click', removeItem);
		const editBtn = item.querySelector('.editBtn');
		editBtn.addEventListener('click', editItem);
		showAlert('Item Added', 'greenish');
		addToLocalStorage(value, id++);
		containerDisplay('show');
		limitheight();
	}else if (value && editFlag) {
		editItemContent.textContent = inp.value;
		editLocalStorage(inp.value, EditID);
		showAlert('item modified', 'greenish');
		inp.value = '';
		editFlag = false;
		subBtn.textContent = 'add item';
	}else {
		showAlert('value is empty', 'redish');
	}
});
clearAll.addEventListener('click', removeAllItems);
window.addEventListener('DOMContentLoaded',getLocalStorage);
// functions
function createItem(value, id) {
	const item = document.createElement('li');
	item.setAttribute('data-id',id)
	item.innerHTML = `<div>-<h4 class="value">${value}</h4></div><div><button class="editBtn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.8 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg></button><button class="deleteBtn"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg></button></div>`;
	return item;
}

function showAlert(text, classname) {
	alert.textContent = text;
	alert.classList.add(classname);
	setTimeout(function closeAlert() {
	alert.textContent = '';
	alert.classList.remove(classname);
	}, 1000);
}

function addToLocalStorage(value, id) {
	const list = localStorage.list ? JSON.parse(localStorage.list) : [];
	list.push({id, value});
	localStorage.setItem('list', JSON.stringify(list));
}

function containerDisplay(action) {
	if (action === 'show') {
		listCont.classList.add('show-container');
	}
	if (action === 'hide') {
		listCont.classList.remove('show-container');
	}
}

function removeAllItems() {
	let items = UIlist.childNodes;
	items = nodeToArray(items);
	items.forEach(item => {
		item.remove();
	});
	containerDisplay('hide');
	localStorage.removeItem('list');
	showAlert('all items removed', 'redish');
	id = 0;
	UIlist.classList.remove('scroll');
}

function nodeToArray(nodelist) {
	let arr = [];
	nodelist.forEach(node => {
		arr.push(node);
	})
	return arr;
}

function removeItem(e) {
	const item = e.currentTarget.parentElement.parentElement;
	const localid = item.dataset.id;
	item.remove();
	setHeightToDefault()
	showAlert('item removed', 'redish');
	const itemslength = UIlist.children.length;
	removeFromLocalStorage(localid);
	if (itemslength < 1) {
		containerDisplay('hide');
		localStorage.removeItem('list');
		id = 0;
	}
}

function removeFromLocalStorage(id) {
	let list = JSON.parse(localStorage.list);
	list = list.filter(obj => {
		if (obj.id != id) {
			return obj;
		}
	})
	localStorage.setItem('list', JSON.stringify(list));
}

function editItem(e) {
	const item = e.currentTarget.parentElement.parentElement;
	const editvalue = item.querySelector('.value');
	inp.value = editvalue.textContent;
	const id = item.dataset.id;
	EditID = id;
	subBtn.textContent = 'edit';
	editFlag = true;
	editItemContent = editvalue;
}

function editLocalStorage(value, id) {
	let list = JSON.parse(localStorage.list);
	list = list.map(obj => {
		if(obj.id == id) {
			obj.value = value;
		}
		return obj;
	})
	localStorage.setItem('list', JSON.stringify(list));
}

function getLocalStorage() {
	if (localStorage.list) {
		const list = JSON.parse(localStorage.list);
		list.forEach(obj => {
			const item = createItem(obj.value, obj.id);
			UIlist.appendChild(item);
			containerDisplay('show');
			const rmBtn = item.querySelector('.deleteBtn');
			rmBtn.addEventListener('click', removeItem);
			const editBtn = item.querySelector('.editBtn');
			editBtn.addEventListener('click', editItem);
		});
		limitheight()
	}
}

function limitheight() {
	const UIheight = UIlist.getBoundingClientRect().height;
	console.log(UIheight)	
	if (UIheight > 288) {
		UIlist.classList.add('scroll');
	}
}

function setHeightToDefault() {
	UIlist.classList.remove('scroll');
	limitheight();
}

function lastItemID() {
	const lastid = JSON.parse(localStorage.list)[JSON.parse(localStorage.list).length-1].id+1;
	return lastid;
}