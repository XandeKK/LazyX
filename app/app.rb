class App < Sinatra::Base
	set :views, "app/views"
	set :sprockets, Sprockets::Environment.new(root)
  set :assets_prefix, '/assets'
  set :digest_assets, false

	configure :production, :development do
    enable :logging
  end

  configure do
    sprockets.append_path File.join(root, 'assets', 'stylesheets')
    sprockets.append_path File.join(root, 'javascripts')
    sprockets.append_path File.join(root, '..', 'node_modules')
    sprockets.append_path File.join(root, 'assets', 'images')

    Sprockets::Helpers.configure do |config|
      config.environment = sprockets
      config.prefix      = assets_prefix
      config.digest      = digest_assets
      config.public_path = public_folder
      config.debug       = true if development?
    end
  end

  helpers do
    include Sprockets::Helpers
  end

  get "/assets/*" do
    env["PATH_INFO"].sub!("/assets", "")
    settings.sprockets.call(env)
  end

	get '/' do
		erb :'home/index', :layout => :application
	end

  get '/file' do
    attachment params[:file].split('/').last
    file = File.open(params[:file])
    stream do |out|
      file.each_line do |chunk|
        out << chunk
      end
    end
  end

  post '/upload' do
    tempfile = params[:file][:tempfile] 
    filename = params[:file][:filename] 
    path = params[:path]
    if File.exist?("#{path}/#{filename}")
      filename.insert(0, SecureRandom.uuid)
    end
    FileUtils.mv(tempfile.path, "#{path}/#{filename}")
  end
end