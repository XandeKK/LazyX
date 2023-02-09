require 'bundler'
Bundler.require(:default)
Bundler.require(ENV['APP_ENV']) if ENV['APP_ENV']

$faye = {
	mount: '/faye',
	timeout: 20,
	engine: {
		type: nil,
		local: 'localhost',
		port: 9292
	}
}

require 'sinatra/base'
require_all 'app'