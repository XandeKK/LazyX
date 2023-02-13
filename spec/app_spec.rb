RSpec.describe App do
	include Rack::Test::Methods
	
	def app
		App
	end

	it "get root" do
    get '/'
    expect(last_response).to be_ok
  end

  it "get a file" do
  	file = Tempfile.new 'file'
  	path = file.path

    get "/file?file=#{path}"

    expect(last_response).to be_ok
    expect(last_response.header['Content-Disposition']).to include(path.split('/').last)
  end

  it "get a asset" do
    get "/assets/tailwind.css"
    expect(last_response).to be_ok
  end
end