require 'fileutils'
require 'timeout'

module FileManager
	def self.handler(faye_client, message)
		key = message.keys.first.to_sym
		self.send(key, faye_client, message)
	end

	def self.glob(path)
		filenames = Dir.glob("#{path}/*")
		dirs = {path: path, files: []}
		files = []

		filenames.each do |file|
			property = {
				name: file,
				path: path,
				size: Open3.capture2("du -sh '#{file}'")[0].split("\t").first
			}

			if File.directory?(file)
				property[:type] = 'dir'
				dirs[:files].append(property)
			elsif file.match?(/\.(jpg|jpeg|png|gif)$/)
				property[:type] = 'image'
				files.append(property)
			elsif file.match?(/\.(mkv|mp4|avi)$/)
				property[:type] = 'video'
				files.append(property)
			else
				property[:type] = 'unknow'
				files.append(property)
			end
		end

		dirs[:files].concat files
		return dirs
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
			self.publish(faye, {create_file: {error: 'file exists'}})
			return
		end

		begin
			file = File.new "#{path}/#{file}", 'w'
			file.close
			files = self.glob(path)
			self.publish(faye, {create_file: {files: files}})
		rescue => e
			self.publish(faye, {create_file: {error: e}})
		end
	end

	def self.create_folder(faye, message)
		path = message['create_folder']['path']
		file = message['create_folder']['file']
		begin
			Dir.mkdir "#{path}/#{file}"
			files = self.glob(path)
			self.publish(faye, {create_folder: {files: files}})
		rescue Errno::EEXIST => e
			self.publish(faye, {create_folder: {error: e}})
		end
	end

	def self.open_on_pc(faye, message)
		system "xdg-open #{message['open_on_pc']} || #{message['open_on_pc']}"
	end

	def self.move(faye, message)
		target = message['move']['target']
		destiny = message['move']['destiny']
		
		begin
			FileUtils.mv(target, destiny)
			files = self.glob(destiny)
			self.publish(faye, {move: {files: files}})
		rescue => e
			self.publish(faye, {move: {error: e}})
		end
	end

	def self.delete(faye, message)
		file = message['delete']['file']
		path = message['delete']['path']

		begin
			FileUtils.rm_rf file
			files = self.glob(path)
			self.publish(faye, {delete: {files: files}})
		rescue => e
			self.publish(faye, {delete: {error: e}})
		end
	end

	def self.rename(faye, message)
		current = message['rename']['current']
		to = message['rename']['to']
		path = message['rename']['path']

		begin
			FileUtils.mv(current, to)
			files = self.glob(path)
			self.publish(faye, {rename: {files: files}})
		rescue => e
			self.publish(faye, {rename: {error: e}})
		end
	end

	def self.publish(faye, message)
		faye.publish('/linux', {file_manager: message})
	end
end