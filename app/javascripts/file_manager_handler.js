class FileManagerHandler {
	static initialize() {
		FileManager.initializeEvent();
		client.send_message({file_manager: { home: '' }})
	}

	static handler(message) {
		const key = Object.keys(message)[0];
		this[key](message[key]);
	}

	static home(message) {
		FileManager.addFiles(message);
	}

	static get_files(message) {
		FileManager.addFiles(message);
	}

	static search(message) {
		// todo
	}

	static create_file(message) {
		if(message['error']) return;
		FileManager.addFiles(message['files']);
	}

	static create_folder(message) {
		if(message['error']) return;
		FileManager.addFiles(message['files']);
	}

	static move(message) {
		// todo
	}

	static delete_file(message) {
		// todo
	}

	static delete_folder(message) {
		// todo
	}

	static rename(message) {
		// todo
	}
}