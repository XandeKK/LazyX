require 'open3'

module MessageHandler
	def self.handler(faye_client, message)
		key = message['data'].keys.first.to_sym
		self.send(key, faye_client, message['data'])
	end

	def self.command_line(faye_client, message)
		out, st = Open3.capture2(message['command_line'])
		out = {command: out}
		self.publish(faye_client, out)
	end

	def self.set_volume(_f, message)
		Open3.capture2("pactl set-sink-volume @DEFAULT_SINK@ #{message['set_volume']}%")
	end

	def self.change_window(_f, message)
		Open3.capture2("wmctrl -a '#{message['change_window']}'")
	end

	def self.close_window(_f, message)
		Open3.capture2("wmctrl -c '#{message['close_window']}'")
	end

	def self.linux_info(faye_client, message)
		out = {
			linux_info: {
				window: {
					current: Open3.capture2("xprop -id $(xprop -root _NET_ACTIVE_WINDOW | cut -d ' ' -f 5) WM_NAME | awk -F '\"' '{print $2}'")[0],
					list: Open3.capture2('wmctrl -l | grep " [01] " | cut -c18-')[0].split("\n"),
					windows: Open3.capture2('wmctrl -d')[0]
				},
				wifi: {
					info: Open3.capture2('iwconfig wlp1s0')[0]
				},
				time: {
					date: Open3.capture2('date +"%d %b %H:%M"')[0]
				},
				audio: {
					simples: Open3.capture2('pactl list sinks | grep \'^[[:space:]]Volume:\' | head -n $(( $SINK + 1 )) | tail -n 1 | sed -e \'s,.* \([0-9][0-9]*\)%.*,\1,\'')[0].to_i,
					complex: Open3.capture2('pactl list sinks | grep "^[[:space:]]Volume:"')[0]
				}
			}
		}
		self.publish(faye_client, out)
	end

	def self.publish(faye_client, message)
		faye_client.publish('/linux', message)
	end
end