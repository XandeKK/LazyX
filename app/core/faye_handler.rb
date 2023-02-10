class FayeHandler
	def initialize
		@faye_client = Faye::Client.new('http://localhost:4789/faye')
	end

	def incoming(message, callback)
    callback.call(message)

		if message['read'] && message['data']
			MessageHandler.handler(@faye_client, message)
		end
  end
end