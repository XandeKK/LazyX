class FileManagerHandler {
	static initialize() {
		FileManager.initialize();
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
		if(message['error']) {
			Alert.add(message['error'], 'danger', 3000);
			return;
		}
		Alert.add('success', 'success', 2000);
		FileManager.addFiles(message['files']);
	}

	static create_folder(message) {
		if(message['error']) {
			Alert.add(message['error'], 'danger', 3000);
			return;
		}
		Alert.add('success', 'success', 2000);
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