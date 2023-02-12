class FileManager {
	static initializeEvent() {
		document.getElementById('add-file').addEventListener('click', this.createFile);
		document.getElementById('add-folder').addEventListener('click', this.createFolder);
		document.getElementById('input-file').addEventListener('keypress', (event)=> {
			if (event.key === "Enter") {
				this.createFile({target: document.getElementById('add-file')});
			}
		});
		document.getElementById('input-folder').addEventListener('keypress', (event)=> {
			if (event.key === "Enter") {
				this.createFolver({target: document.getElementById('add-folder')});
			}
		});

	}

	static addFiles(files) {
		this.clear();
		this.updateInfo(files['path']);

		const breadcrumb = document.getElementById('breadcrumb');
		const files_element = document.getElementById('files');
		const path = files['path'].split('/');
		files = files['files'];

		this.addBreadcrumb(path);

		files.forEach((file)=> {
			if (!file['name']) return;
			const name = file['name'];
			const li = document.createElement('li');
			const button = document.createElement('button');
			const p = document.createElement('p');
 
 			if (file['dir']) {
			 button.innerHTML = '<svg class="w-12 h-12 mx-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M22 8v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7h19a1 1 0 0 1 1 1zm-9.586-3H2V4a1 1 0 0 1 1-1h7.414l2 2z"/></svg>';
			 button.addEventListener('dblclick', this.toGo.bind(this, file['name']));
 			} else if (file['image']) {
 				button.innerHTML = '<svg class="w-12 h-12 mx-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M5 11.1l2-2 5.5 5.5 3.5-3.5 3 3V5H5v6.1zM4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm11.5 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/></svg>';
 				button.addEventListener('dblclick', this.downloadFile.bind(this, file['name']));
 			} else if (file['video']) {
 				button.innerHTML = '<svg class="w-12 h-12 mx-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M2 3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H2.992A.993.993 0 0 1 2 20.007V3.993zm8.622 4.422a.4.4 0 0 0-.622.332v6.506a.4.4 0 0 0 .622.332l4.879-3.252a.4.4 0 0 0 0-.666l-4.88-3.252z"/></svg>';
 				button.addEventListener('dblclick', this.downloadFile.bind(this, file['name']));
 			} else if (file['compressed']) {
 				button.innerHTML = '<svg class="w-12 h-12 mx-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M21 5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2H16v2h2V5h3zm-3 8h-2v2h-2v3h4v-5zm-2-2h-2v2h2v-2zm2-2h-2v2h2V9zm-2-2h-2v2h2V7z"/></svg>';
 			} else { // file
 				button.innerHTML = '<svg class="w-12 h-12 mx-auto" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0z"/><path d="M21 9v11.993A1 1 0 0 1 20.007 22H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.447 2 3.998 2H14v6a1 1 0 0 0 1 1h6zm0-2h-5V2.003L21 7z"/></svg>';
 			}

 			button.addEventListener('click', this.showProperty.bind(this, file['name']));
 			button.className = 'rounded p-1 hover:bg-zinc-700 focus:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-500'
			p.className = 'break-all';
			p.textContent = name.split('/').at(-1);

			button.appendChild(p);
			li.appendChild(button);

			files_element.appendChild(li);
		});
	}

	static addBreadcrumb(path) {
		for (var i = 0; i < path.length; i++) {
			const li = document.createElement('li');
			const button = document.createElement('button');
			const pathname = path.slice(0, i + 1).join('/');

			li.className = 'inline-flex items-center';
			if (i >= 2) {
				li.innerHTML = '<svg aria-hidden="true" class="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path></svg>';
			}

			button.className = 'inline-flex items-center text-sm font-medium hover:text-gray-300 truncate';
			button.textContent = path[i];

			button.addEventListener('click', FileManager.toGo.bind(this, pathname));

			li.appendChild(button);
			breadcrumb.appendChild(li);
		}
	}

	static downloadFile(name) {
		window.open(`/file?file=${name}`, '_blank');
	}

	static toGo(path) {
		client.send_message({file_manager: { get_files: path }})
	}

	static showProperty(name) {

	}

	static updateInfo(name) {
		document.getElementById('add-file').setAttribute('path', name);
		document.getElementById('add-folder').setAttribute('path', name);
	}

	static createFile(event) {
		const path = event.target.getAttribute('path');
		const file = document.getElementById('input-file');
		client.send_message({
			file_manager: {
				create_file: {
					file: file.value,
					path: path
				}
			}
		});
		file.value = '';
		document.querySelector("#modal-file").click()
	}

	static createFolder(event) {
		const path = event.target.getAttribute('path');
		const file = document.getElementById('input-folder');
		client.send_message({
			file_manager: {
				create_folder: {
					file: file.value,
					path: path
				}
			}
		});
		file.value = '';
		document.querySelector("#modal-folder").click()
	}

	static clear() {
		document.getElementById('breadcrumb').innerHTML = '';
		document.getElementById('files').innerHTML = '';
	}
}