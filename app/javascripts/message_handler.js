class MessageHandler {
	static handler(message) {
		const key = Object.keys(message)[0];
		this[key](message[key]);
	}

	static linux_info(message) {
		document.getElementById('time').textContent = message['time']['date'];
		WindowLinux.settingWindows(message['window']);
		Audio.settingAudio(message['audio']);
	}

	static file_manager(message) {
		FileManagerHandler.handler(message);
	}
}