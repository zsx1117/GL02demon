"use strict";

var fs = require('fs');
var Q = require('q');
const readline = require('readline');
var userList = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// var user =[
//     {
//         "name":"admin",
//         "pwd":1,
//         "authen":1
//     },
//     {
//         "name":"in1",
//         "pwd":1,
//         "authen":2
//     }];

function getUserList () {
    var deferred = Q.defer();
    fs.readFile('./userlist.json', function (err, data) {
        if (err) {
            if (err.code === "ENOENT") {
                console.error('User data base does not exist');
                return;
            }
            deferred.reject(err);
        } else {
            userList = JSON.parse(data);
            deferred.resolve(userList);
        }
    });
    return deferred.promise;
}

function writeUserList(){
    fs.writeFile('./userlist.json', JSON.stringify(userList),function (err) {
        if (err){
            console.log(err);
        }else{
            console.log("JSON has been saved");
            outPutUserList();
        }
    });
}


function choseFunction(){
    rl.question('Chose function: \n1. Show all\n2. Add user\n3. Delete user\nOthers Exit.\n',(answer)=>
    {
        switch (answer){
            case '1':
                outPutUserList();
                choseFunction();
                break;
            case '2':
                //addNewUser().then(choseFunction).fail(console.error);
                addNewUser2().then(function (data) {
                    return getPwd2(data)
                }).then(function (data) {
                    return getAuth2(data)
                }).then(writeUserList);
                break;
            case '3':
                deleteUser();
                choseFunction();
                break;
            default:
                break;
        }
    });
}

function main(){

}

function outPutUserList(){
    userList.forEach(function (user) {
        console.log("name: "+user.name+" password: "+user.pwd+" type: "+ (user.authen == 1 ? "intervenant" : "bénéficiaire"));
    });
}




function test(){
    outPutUserList();
    addNewUser();
}

function deleteUser(){
    let flag = false;
    rl.question("Input user name to delete: \n",function(answer){
        for(let i in userList){
            if (userList[i].name == answer){
                flag=true;
                userList.splice(i,1);
                break;
            }
        }
        if (!flag){
            console.log("Can not find this user!");
            return;
        }
        writeUserList();
    });
}


function addNewUser() {
    let userNew = {};
    let flag = true;
    var deferred = Q.defer();
    rl.question('Input user name: \n',function (answer)
    {
        userList.forEach(function (user) {
            if (user.name == answer) {
                console.log("This name has been used!");
                flag = false;
                deferred.resolve(true);
                return deferred.promise;
            }
        });
        if (flag) {
            userNew.name = answer;
            console.log("SUCCESS");
            getPwd(userNew,deferred);
        }
        deferred.resolve(true);
    });
    return deferred.promise;
}

function addNewUser2() {
    let userNew = {};
    let flag = true;
    var deferred = Q.defer();
    rl.question('Input user name: \n',function (answer)
    {
        userList.forEach(function (user) {
            if (user.name == answer) {
                console.log("This name has been used!");
                flag = false;
                deferred.resolve(false);
                return deferred.promise;
            }
        });
        if (flag) {
            userNew.name = answer;
            console.log("SUCCESS");
            deferred.resolve(userNew);
        }
    });
    return deferred.promise;
}

function getPwd2(userNew){
    var deferred = Q.defer();
    if(userNew){
        rl.question('Input user password: \n',(answer)=>
        {
            userNew.pwd = answer;
            console.log("SUCCESS");
            deferred.resolve(userNew);
        });
    }
    else{
        deferred.resolve(false);
    }
    return deferred.promise;
}



function getPwd(userNew,deferred){
    rl.question('Input user password: \n',(answer)=>
    {
        userNew.pwd = answer;
        console.log("SUCCESS");
        getAuth(userNew,deferred);
    });
}

function getAuth2(userNew){
    var deferred = Q.defer();
    if (userNew){
        rl.question('Input user type: 1 is intervenant, 2 is bénéficiaire, the others are exit: \n',(answer)=>
        {
            if (answer != '1' && answer != '2'){
                console.log("Exit");
                deferred.resolve(false);
            }else{
                userNew.authen = answer;
                console.log("SUCCESS");
                userList.push(userNew);
                deferred.resolve(true);
            }
        });
    }
    else{
        deferred.resolve(false);
    }
    return deferred.promise;
}

function getAuth(userNew,deferred){
    rl.question('Input user type: 1 is intervenant, 2 is bénéficiaire, the others are exit: \n',(answer)=>
    {
        if (answer != '1' && answer != '2'){
        console.log("Exit");
        deferred.resolve(true);
        return deferred.promise;
    }
    userNew.authen = answer;
    console.log("SUCCESS");
    userList.push(userNew);
    writeUserList();
});
}
//getUserList().then(test).fail(console.error);
getUserList().then(function(){choseFunction()}).fail(console.error);