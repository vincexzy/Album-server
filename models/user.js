const fs = require('fs');

const userPath = 'lib/user.json';
module.exports = {
    creat: function(user, callback) {
        let userS = JSON.stringify(user) + '/';
        fs.appendFile(userPath, userS, (err) => {
            if (err) throw err;
            callback();
        });
    },
    getUserByName: function(name, callback) {
        fs.readFile(userPath, 'utf8', (err, data) => {
            if (err) throw err;
            let userArr = data.split('/');
            userArr.pop();
            for (let user of userArr) {
                user = JSON.parse(user);
                if (user['name'] == name) {
                    callback(user);
                    return;
                }
            }
            callback(-1);
        });
    },
    getUserByNameSync: function(name) {
        let data = fs.readFileSync(userPath, 'utf8');
        if (!data) throw err;
        let userArr = data.split('/');
        userArr.pop();
        for (let user of userArr) {
            user = JSON.parse(user);
            if (user['name'] == name) {
                return user;
            }
        }
    }
}
