RSpec.describe MessageHandler do
	let(:faye_client) { double(:faye_client) }

	describe '.handler' do
		it 'call method window' do
			expect(Window).to receive(:handler)

			MessageHandler.handler(faye_client, {data: {window: ''}}.transform_keys(&:to_s))
		end
	end

	describe '.window' do
		it 'handler message of window' do
			expect(Window)
				.to receive(:handler)
				.with({change: 'text editor'})

			MessageHandler.window(faye_client, {window: {change: 'text editor'}}.transform_keys(&:to_s))
		end
	end

	describe '.set_volume' do
		it 'set volume 100%' do
			expect(Open3)
			  .to receive(:capture2)
			  .with('pactl set-sink-volume @DEFAULT_SINK@ 100%')

			MessageHandler.set_volume(faye_client, {set_volume: 100}.transform_keys(&:to_s))
		end
	end

	describe '.file_manager' do
		it 'get home' do
			expect(FileManager)
				.to receive(:handler)
				.with(faye_client, {home: ''})

			MessageHandler.file_manager(faye_client, {file_manager: {home: ''}}.transform_keys(&:to_s))
		end
	end

	describe '.linux_info' do
		# lazy to do this
	end

	describe '.publish' do
		it 'publish a message' do
			expect(faye_client).to receive(:publish)

			MessageHandler.publish(faye_client, 'hello')
		end
	end
end