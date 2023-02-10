//= require flowbite/dist/flowbite.min.js
//= require_tree .

const client = new Client();
Audio.addEvent();

setInterval(()=> {client.send_message({'linux_info': ''})}, 1000);