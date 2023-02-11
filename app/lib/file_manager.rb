require 'fileutils'

module FileManager
	def self.handler(faye_client, message)
		key = message.keys.first.to_sym
		self.send(key, faye_client, message)
	end

	def self.glob(path)
		dirs = {path: path, files: []}
		files_list = []
		files = Dir.glob("#{path}/*")

		files.each do |file|
			property = {
				name: file,
				dir: File.directory?(file),
				path: path,
				image: file.match?(/\.(jpg|jpeg|png|gif)$/),
				video: file.match?(/\.(mkv|mp4|avi)$/),
				executable: File.executable?(file),
				compressed: file.match?(/\.(zip|rar|tar)$/)
			}

			if File.directory?(file)
				dirs[:files].append property
			else
				files_list.append property
			end
		end

		dirs[:files].concat files_list
		dirs
	end

	def self.home(faye, message)
		files = self.glob(Dir.home)
		self.publish(faye, {home: files})
	end

	def self.get_files(faye, message)
		files = self.glob(message['get_files'])
		self.publish(faye, {get_files: files})
	end

	def self.search(faye, message)
		path = message['search']['path']
		file = message['search']['file']
		files = Dir.glob "#{path}/**/*#{file}*"
		self.publish(faye, {search: files})
	end

	def self.create_file(faye, message)
		path = message['create_file']['path']
		file = message['create_file']['file']

		if File.exist? "#{path}/#{file}"
			self.publish(faye, {create_file: :exist})
			return
		end

		begin
			file = File.new "#{path}/#{file}", 'w'
			file.close
			self.publish(faye, {create_file: :success})
		rescue => e
			self.publish(faye, {create_file: {error: e}})
		end
	end

	def self.create_folder(faye, message)
		path = message['create_folder']['path']
		file = message['create_folder']['file']
		begin
			files = Dir.mkdir "#{path}/#{file}"
			self.publish(faye, {create_folder: :success})
		rescue Errno::EEXIST => e
			self.publish(faye, {create_folder: {error: e}})
		end
	end

	def self.move(faye, message)
		target = message['move']['target']
		destiny = message['move']['destiny']
		begin
			FileUtils.mv(target, destiny)
			self.publish(faye, {move: :success})
		rescue => e
			self.publish(faye, {move: {error: e}})
		end
	end

	def self.delete_file(faye, message)
		files = message['delete_file']['files']

		begin
			FileUtils.rm files
			self.publish(faye, {delete_file: :success})
		rescue => e
			self.publish(faye, {delete_file: {error: e}})
		end
	end

	def self.delete_folder(faye, message)
		folders = message['delete_folder']['folders']

		begin
			FileUtils.rm_rf folders
			self.publish(faye, {delete_folder: :success})
		rescue => e
			self.publish(faye, {delete_folder: {error: e}})
		end
	end

	def self.rename(faye, message)
		current = message['rename']['current']
		to = message['rename']['to']

		begin
			FileUtils.mv(current, to)
			self.publish(faye, {rename: :success})
		rescue => e
			self.publish(faye, {rename: {error: e}})
		end
	end

	def self.publish(faye, message)
		faye.publish('/linux', {file_manager: message})
	end
end