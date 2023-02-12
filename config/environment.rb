require 'bundler'
Bundler.require(:default)
Bundler.require(ENV['APP_ENV']) if ENV['APP_ENV']

$faye = {
	mount: '/faye',
	timeout: 20
}

require 'sinatra/base'
require_all 'app'