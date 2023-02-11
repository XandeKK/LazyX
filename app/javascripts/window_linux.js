class WindowLinux {
	static settingWindows(_window) {
		this.setCurrentWindow(_window['current']);
		this.setWindowsList(_window['list']);
	}

	static setCurrentWindow(current_window) {
		document.getElementById('current-window').textContent = current_window;
	}

	static setWindowsList(windows) {
		const main = document.getElementById('windows-list');
		main.innerHTML = '';
		windows.forEach((elem)=> {
			const li = document.createElement('li');
			const button = document.createElement('button');
			const button_close = document.createElement('button');

			li.className = 'flex gap-1 items-center'

			button.textContent = elem;
			button.className = 'px-2 py-1 truncate text-ellipsis overflow-hidden w-full';

			button_close.innerHTML = '<svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>'

			button.addEventListener('click', this.changeWindow.bind(this, elem));
			button_close.addEventListener('click', this.closeWindow.bind(this, elem))

			li.appendChild(button);
			li.appendChild(button_close);
			main.appendChild(li);
		});
	}

	static changeWindow(elem) {
		client.send_message({window: { change: elem }});
	}

	static closeWindow(elem) {
		client.send_message({window: { close: elem }});
	}
}