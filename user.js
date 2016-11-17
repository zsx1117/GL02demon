var fs = require('fs');
var Q = require('Q');
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
    console.log("2");
    fs.writeFile('./userlist.json', JSON.stringify(userList),function (err) {
        if (err){
            console.log(err);
        }else{
            console.log(userList);
            console.log("JSON has been saved");
        }
    });
}

function outPutUserList(){
    userList.forEach(function (user) {
        console.log("name: "+user.name+" password: "+user.pwd+" type: "+ (user.authen == 1 ? "intervenant" : "bénéficiaire"));
    });
}


function choseFunction(){
    outPutUserList();
    addNewUser();
}

function deleteUser(){
    let flag = false;
    rl.question("Input user name to delete: \n",function(answer){
        userList.forEach(function (user) {
            if (user.name == answer) {
                flag = true;
                return;
            }
        });
    });
}


function addNewUser() {
    let userNew = new Object();
    let flag = true;
    console.log(userList);
    rl.question('Input user name: \n',function (answer)
    {
        userList.forEach(function (user) {
            if (user.name == answer) {
                console.log("This name has been used!");
                flag = false;
                return;
            }
        });
        if (flag) {
            userNew.name = answer;
            console.log("SUCCESS");
            getPwd(userNew);
        }
    });
}

function getPwd(userNew){
    rl.question('Input user password: \n',(answer)=>
    {
        userNew.pwd = answer;
    console.log("SUCCESS");
    getAuth(userNew);
});
}

function getAuth(userNew){
    rl.question('Input user type: 1 is intervenant, 2 is bénéficiaire, the others are exit: \n',(answer)=>
    {
        if (answer != '1' && answer != '2'){
        console.log("Exit");
        return;
    }
    userNew.authen = answer;
    console.log("SUCCESS");
    userList.push(userNew);
    writeUserList();
});
}

console.log("2");
getUserList().then(choseFunction).fail(console.error);
