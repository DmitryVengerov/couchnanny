const fs = require('fs')const git = require('simple-git/promise');global = require('underscore');const config = require('../config.json').repoconst couchdbConf = require('../couchdbConfig.json').couchdbconst nano = require('nano')('http://' + couchdbConf.login + ':' + couchdbConf.password + '@' + couchdbConf.host + ':' + couchdbConf.port + '');let repoDir = config.folderlet remote = config.source;const arr = []function checkRepos() {    if (!fs.existsSync(repoDir)) {        git().clone(remote).then(() => console.log('finished')).catch((err) => console.error('failed: ', err));    }}function _getFile(dataName) {    var db = nano.use(dataName);    var tempObj = {}    var key = dataName;    tempObj[key] = [];    db.list(function(err, body) {        if (!err) {            const testBuf = 0            body.rows.forEach(function(doc) {                db.multipart.get(doc.id, (err, buffer, testBuf) => {                    tempObj[key].push(buffer)                    tempString = JSON.stringify(tempObj)                    fs.writeFile(repoDir + dataName + ".json", (replaceAll(tempString, '_rev', 'rev')), (err) => {                        if (err) throw err                        console.log("done")                    });                })            });        }    });}function replaceAll(str, find, replace) {    return str.replace(new RegExp(find, 'g'), replace);}function initialiseRepo(git) {    return git.init()        .then(() => git.addRemote('origin', remote))}function _commitChanges() {    require('simple-git')('./backuptest/')        .init()        .add('./*')        .commit(Date.now())        .addRemote('master', 'https://github.com/DmitryVengerov/backuptest.git')        .push(['-u', 'origin', 'master'], () => console.log('done'));}function _getAllBases() {    nano.db.list(function(err, body) {        body.forEach(function(db) {            _getFile(db);        });    });}module.exports = function(db) {    //checkRepos();    _getAllBases();    //_getFile('_global_changes')    //_getFile('users');    //_commitChanges();}