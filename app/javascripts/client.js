class Client {
	constructor() {
		this.client = new Faye.Client('/faye');
		this.client.subscribe('/linux', this.handler.bind(this))
		this.client.addExtension({
			outgoing: this.outgoing.bind(this)
		});
	}

	outgoing(message, callback) {
		message.read = true;
		callback(message);
	}

	send_message(data) {
		this.client.publish(this.channel, data);
	}

	handler(message) {
		MessageHandler.handler(message);
	}
}