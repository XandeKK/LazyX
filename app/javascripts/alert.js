class Alert {
	static div_colors = {
		'info': 'text-blue-700 bg-blue-100 border-blue-500 dark:text-blue-400 blue',
		'danger': 'text-red-700 bg-red-100 border-red-500 dark:text-red-400 red',
		'success': 'text-green-700 bg-green-100 border-green-500 dark:text-green-400 green',
		'warning': 'text-yellow-700 bg-yellow-100 border-yellow-500 dark:text-yellow-400 yellow'
	}
	static button_colors = {
		'info': 'bg-blue-100 text-blue-500 dark:text-blue-300 focus:ring-blue-400 hover:bg-blue-200 blue',
		'danger': 'bg-red-100 text-red-500 dark:text-red-300 focus:ring-red-400 hover:bg-red-200 red',
		'success': 'bg-green-100 text-green-500 dark:text-green-300 focus:ring-green-400 hover:bg-green-200 green',
		'warning': 'bg-yellow-100 text-yellow-500 dark:text-yellow-300 focus:ring-yellow-400 hover:bg-yellow-200 yellow'
	}
	static options = {
	  transition: 'transition-opacity',
	  duration: 1000,
	  timing: 'ease-out',
	  onHide: (context, target) => {
	  	setTimeout(()=> {target.remove();}, 200)
	  }
	};
	static body_div = [
	  `<svg class="flex-shrink-0 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">`,
	    `<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>`,
	  `</svg>`,
	].join('');
	static body_button = [
	  `<span class="sr-only">Dismiss</span>`,
	  `<svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">`,
	    `<path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>`,
	  `</svg>`
	].join('');

	static add(message, level='info', timeout=8000, parent='alerts') {
		const div = document.createElement('div');
		const div_message = document.createElement('div');
		const button_dismiss = document.createElement('dismiss');

		// div.id = `alert-${Random.generate_uuid()}`;
		div.className = `${this.div_colors[level]} flex w-64 md:w-96 p-4 border-t-4 dark:bg-gray-800`
		div.role = 'alert';

		div_message.className = 'ml-3 text-sm font-medium';
		div_message.innerHTML = message;

		button_dismiss.type = 'button';
		button_dismiss.className = `${this.button_colors[level]} ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex h-8 w-8 dark:bg-gray-800 dark:hover:bg-gray-700 cursor-pointer`;
		button_dismiss.ariaLabel = 'Close';
		
		button_dismiss.innerHTML = this.body_button;
		div.innerHTML = this.body_div;
		div.appendChild(div_message);
		div.appendChild(button_dismiss);

		document.getElementById(parent).appendChild(div);

		const dismiss = new Dismiss(div, button_dismiss, this.options);
		setTimeout(()=> {dismiss.hide();}, timeout)
	}
}