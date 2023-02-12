class FileManager {
	static initialize() {
		document.getElementById('open-on-pc').addEventListener('click', this.openOnPc);
		document.getElementById('rename').addEventListener('click', this.rename);
		document.getElementById('dropdown-rename').addEventListener('click', this.setRename);
		document.getElementById('delete').addEventListener('click', this.delete);
		document.getElementById('show-clipboard').addEventListener('click', this.showClipboard);
		document.getElementById('move').addEventListener('click', this.move);
		document.getElementById('add-file').addEventListener('click', this.createFile);
		document.getElementById('add-folder').addEventListener('click', this.createFolder);

		document.getElementById('input-file').addEventListener('keypress', (event)=> {
			if (event.key === "Enter") {
				this.createFile({target: document.getElementById('add-file')});
			}
		});
		document.getElementById('input-folder').addEventListener('keypress', (event)=> {
			if (event.key === "Enter") {
				this.createFolder({target: document.getElementById('add-folder')});
			}
		});
		document.getElementById('input-rename').addEventListener('keypress', (event)=> {
			if (event.key === "Enter") this.rename();
		});
	}

	static addFiles(files) {
		this.clear();
		this.setCurrentPath(files['path']);
		this.addBreadcrumb(files['path']);

		files['files'].forEach((file)=> {
			if (!file['name']) return;

			const filename = file['name'];
			const li = document.createElement('li');
			const button = document.createElement('button');
			const p = document.createElement('p');
 
 			switch(file['type']) {
 			case 'dir': 
				button.innerHTML = '<svg class="w-12 h-12 mx-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M22 8v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7h19a1 1 0 0 1 1 1zm-9.586-3H2V4a1 1 0 0 1 1-1h7.414l2 2z"/></svg>';
				button.addEventListener('dblclick', this.toGo.bind(this, filename));
				break;
			case 'image':
 				button.innerHTML = '<svg class="w-12 h-12 mx-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M5 11.1l2-2 5.5 5.5 3.5-3.5 3 3V5H5v6.1zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm11.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>';
 				button.addEventListener('dblclick', this.downloadFile.bind(this, filename));
 				break;
 			case 'video':
 				button.innerHTML = '<svg class="w-12 h-12 mx-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zm8.622 4.422a.4.4 0 0 0-.622.332v6.506a.4.4 0 0 0 .622.332l4.879-3.252a.4.4 0 0 0 0-.666l-4.88-3.252z"/></svg>';
 				button.addEventListener('dblclick', this.downloadFile.bind(this, filename));
 				break;
 			default:
 				button.innerHTML = '<svg class="w-12 h-12 mx-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M21 9v11.993A1 1 0 0 1 20.007 22H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.447 2 3.998 2H14v6a1 1 0 0 0 1 1h6zm0-2h-5V2.003L21 7z"/></svg>';
 			}

 			button.addEventListener('click', this.selectFile.bind(this, button, filename, file['size']));
 			button.className = 'rounded p-1 hover:bg-zinc-700'
			p.className = 'break-all';
			p.textContent = filename.split('/').at(-1);

			button.appendChild(p);
			li.appendChild(button);
			document.getElementById('files').appendChild(li);
		});
	}

	static addBreadcrumb(path) {
		path = path.split('/');
		const breadcrumb = document.getElementById('breadcrumb');

		for (let i = 0; i < path.length; i++) {
			const li = document.createElement('li');
			const button = document.createElement('button');
			const pathname = path.slice(0, i + 1).join('/');

			li.className = 'inline-flex items-center';
			if (i >= 2) {
				li.innerHTML = '<svg aria-hidden="true" class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>';
			}

			if (i == path.length - 1) {
				button.className = 'inline-flex items-center text-sm font-medium hover:text-gray-300 truncate bg-zinc-500 px-1 rounded';
			} else {
				button.className = 'inline-flex items-center text-sm font-medium hover:text-gray-300 truncate';
			}

			button.textContent = path[i];
			button.addEventListener('click', FileManager.toGo.bind(this, pathname));

			li.appendChild(button);
			breadcrumb.appendChild(li);
		}
	}

	static setCurrentPath(filename) {
		window.current_path = filename;
	}

	static selectFile(button, filename, size) {
		if (window.selected_button) window.selected_button.classList.remove('bg-zinc-600', 'ring-zinc-500', 'ring-2', 'outline-none', 'text-zinc-300');

		window.selected_button = button;
		window.selected_file = filename;
		button.classList.add('bg-zinc-600', 'ring-zinc-500', 'ring-2', 'outline-none', 'text-zinc-300');
		document.getElementById('kebab-file').classList.remove('hidden');
		document.getElementById('property-file').textContent = filename + ' - ' + size;
		document.getElementById('input-rename').value = window.selected_file.split('/').at(-1);
	}

	static clear() {
		document.getElementById('property-file').textContent = '';
		document.getElementById('kebab-file').classList.add('hidden');
		document.getElementById('breadcrumb').innerHTML = '';
		document.getElementById('files').innerHTML = '';
	}

	static downloadFile(filename) {
		window.open(`/file?file=${filename}`, '_blank');
	}

	static toGo(path) {
		client.send_message({file_manager: { get_files: path }})
	}

	static openOnPc() {
		client.send_message({
			file_manager: {
				open_on_pc: window.selected_file
			}
		});
	}

	static rename() {
		const target = document.getElementById('input-rename');
		let to = window.selected_file.split('/')
		to.pop()
		to = `${to.join('/')}/${target.value}`

		client.send_message({
			file_manager: {
				rename: {
					current: window.selected_file,
					to: to,
					path: window.current_path
				}
			}
		});

		target.value = '';
		document.querySelector("#modal-rename").click();
	}

	static delete() {
		client.send_message({
			file_manager: {
				delete: {
					file: window.selected_file,
					path: window.current_path
				}
			}
		});
	}

	static showClipboard() {
		window.file_to_move = window.selected_file;
		document.getElementById('move').classList.remove('hidden');
	}

	static move() {
		client.send_message({
			file_manager: {
				move: {
					target: window.file_to_move,
					destiny: window.current_path
				}
			}
		});
		document.getElementById('move').classList.add('hidden');
	}

	static createFile(event) {
		const file = document.getElementById('input-file');
		client.send_message({
			file_manager: {
				create_file: {
					file: file.value,
					path: window.current_path
				}
			}
		});
		file.value = '';
		document.querySelector("#modal-file").click();
	}

	static createFolder(event) {
		const file = document.getElementById('input-folder');
		client.send_message({
			file_manager: {
				create_folder: {
					file: file.value,
					path: window.current_path
				}
			}
		});
		file.value = '';
		document.querySelector("#modal-folder").click();
	}
}