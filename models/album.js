const fs = require('fs');
const path = require('path');

const basePath = 'uploads/';
module.exports =  {
    mkDir: function(name,cb) {
        let path = basePath + name;
        fs.mkdir(path, function(err) {
            if (err) throw new Error(err);
            cb();
        });
    },
    readDir: function(userName, cb) {
        let path = basePath + userName;
        fs.readdir(path, function(err, files) {
            if (err) throw new Error(err);
            cb(files);
        });
    },
    readFile: function(pathName, cb) {
        let path = basePath + pathName;
        fs.readFile(path, function(err, data) {
            if (err) return cb(JSON.stringify({statu: 0}));
            cb(JSON.stringify({statu: 1, data: data}));
        });
    },
    delFile: function(pathName, cb) {
        let path = basePath + pathName;
        fs.unlink(path, function(err) {
            if (err) throw new Error(err);
            cb();
        });
    },
    delDir: function(pathName, cb) {
        let path = basePath + pathName;
        fs.rmdir(path, function(err) {
            if (err) throw new Error(err);
            cb();
        });
    },
    rename: function(oldPath, newPath, cb) {
        oldPath = basePath + oldPath;
        newPath = basePath + newPath;
        fs.rename(oldPath, newPath, function(err) {
            if (err) throw new Error(err);
            cb();
        });
    }
}
