require_relative 'config/environment'

Faye::WebSocket.load_adapter 'thin'

Application = Faye::RackAdapter.new App, $faye

Application.add_extension(FayeHandler.new)

run Application