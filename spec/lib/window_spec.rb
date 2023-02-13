RSpec.describe Window do
	describe '.get_info' do
		it 'return info window' do
			expect(Open3)
			  .to receive(:capture2)
			  .with("xprop -id $(xprop -root _NET_ACTIVE_WINDOW | cut -d ' ' -f 5) WM_NAME | awk -F '\"' '{print $2}'")
			  .and_return(['text editor'])

			expect(Open3)
			  .to receive(:capture2)
			  .with('wmctrl -l | grep " [01] " | cut -c18-')
			  .and_return(["text editor\nfirefox"])

			expect(Open3)
			  .to receive(:capture2)
			  .with('wmctrl -d')
			  .and_return(['Workspace 1'])

			expect(Window.get_info).to eq({
				:current=>"text editor", :list=>["text editor", "firefox"], :windows=>"Workspace 1"
			})
		end
	end

	describe '.handler' do
		it 'call method change' do
			expect(Open3).to receive(:capture2)
			Window.handler({change: 'text editor'})
		end

		it 'call method close' do
			expect(Open3).to receive(:capture2)
			Window.handler({close: 'text editor'})
		end
	end

	describe '.change' do
		it 'change window' do
			expect(Open3)
				.to receive(:capture2)
				.with("wmctrl -a 'text editor'")

			Window.change({change: 'text editor'}.transform_keys(&:to_s))
		end
	end

	describe '.close' do
		it 'close window' do
			expect(Open3)
				.to receive(:capture2)
				.with("wmctrl -c 'text editor'")

			Window.close({close: 'text editor'}.transform_keys(&:to_s))
		end
	end
end