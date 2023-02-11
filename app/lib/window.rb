module Window
	def self.get_info
		{
			current: Open3.capture2("xprop -id $(xprop -root _NET_ACTIVE_WINDOW | cut -d ' ' -f 5) WM_NAME | awk -F '\"' '{print $2}'")[0],
			list: Open3.capture2('wmctrl -l | grep " [01] " | cut -c18-')[0].split("\n"),
			windows: Open3.capture2('wmctrl -d')[0]
		}
	end

	def self.handler message
		key = message.keys.first.to_sym
		self.send(key, message)
	end

	def self.change(window)
		Open3.capture2("wmctrl -a '#{window['change']}'")
	end

	def self.close(window)
		Open3.capture2("wmctrl -c '#{window['close']}'")
	end
end