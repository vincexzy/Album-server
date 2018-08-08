const fs = require('fs');

const messagePath = 'lib/messageBoard.json';
module.exports = {
    creat: function(message, callback) {
        message = JSON.stringify(message) + '/';
        fs.appendFile(messagePath, message, (err) => {
            if (err) throw err;
            callback();
        });
    },
    getMessageAll: function(callback) {
        fs.readFile(messagePath, 'utf8', (err, data) => {
            if (err) throw err;
            let messageArr = data.split('/');
            messageArr.pop();
            callback(messageArr);
        });
    },
    removeMessage: function(id, cb) {
        fs.readFile(messagePath, 'utf8', (err, data) => {
            if (err) throw err;
            let messageArr = data.split('/');
            messageArr.pop();

            for(let i = 0, max = messageArr.length; i < max; i++) {
                let item = JSON.parse(messageArr[i]);
                if (item.id == id) {
                    messageArr.splice(i,1);
                    break;
                }
            }
            let newMessages = messageArr.join('/') + '/';
            fs.writeFile(messagePath, newMessages, function(err) {
                if (err) throw err;
                cb();
            });
        });
    }
}
