require 'open3'

module MessageHandler
	def self.handler(faye_client, message)
		key = message['data'].keys.first.to_sym
		begin
			self.send(key, faye_client, message['data'])
		rescue => e
			self.publish({error: e})
		end
	end

	def self.set_volume(_f, message)
		Open3.capture2("pactl set-sink-volume @DEFAULT_SINK@ #{message['set_volume']}%")
	end

	def self.window(_f, message)
		Window.handler message['window']
	end

	def self.file_manager(faye_client, message)
		FileManager.handler(faye_client, message['file_manager'])
	end

	def self.linux_info(faye_client, message)
		out = {
			linux_info: {
				window: Window.get_info,
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