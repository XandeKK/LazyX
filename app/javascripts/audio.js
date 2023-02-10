class Audio {
	static settingAudio(audio) {
		this.setVolume(audio['simples']);
	}

	static setVolume(volume) {
		document.getElementById('volume-range').value = volume;

		if (volume <= 0) {
			document.getElementById('volume-muted').classList.remove('hidden');
			document.getElementById('volume-up').classList.add('hidden');
			document.getElementById('volume-normal').classList.add('hidden');
			document.getElementById('volume-down').classList.add('hidden');
		} else if(volume < 35) {
			document.getElementById('volume-normal').classList.remove('hidden');
			document.getElementById('volume-down').classList.add('hidden');
			document.getElementById('volume-muted').classList.add('hidden');
			document.getElementById('volume-up').classList.add('hidden');
		} else if (volume < 75 ) {
			document.getElementById('volume-down').classList.remove('hidden');
			document.getElementById('volume-muted').classList.add('hidden');
			document.getElementById('volume-normal').classList.add('hidden');
			document.getElementById('volume-up').classList.add('hidden');
		} else {
			document.getElementById('volume-up').classList.remove('hidden');
			document.getElementById('volume-muted').classList.add('hidden');
			document.getElementById('volume-normal').classList.add('hidden');
			document.getElementById('volume-down').classList.add('hidden');
		}
	}

	static changeVolume(event) {
		client.send_message({set_volume: event.target.value});
	}

	static addEvent() {
		document.getElementById('volume-range').addEventListener('input', this.changeVolume);
	}
}