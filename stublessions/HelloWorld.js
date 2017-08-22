const https = require("https");
class HelloWorld {

    constructor(name) {
        this.name = name;
    }
    sayHello() {
        return `hello ${this.name}`;
    }

    sayHelloToRemoteUser(id, callback) {

        const options = {
            hostname: 'reqres.in',
            path:'/api/users/2'
        }
        https.get(options,
            function(res) {
                let body = [];
                res.on('data',
                    function(chunk) {
                        body.push(chunk);
                    });

                res.on('end',
                    function() {
                        body = JSON.parse(Buffer.concat(body).toString());
                        callback(null, `hello ${body.data.first_name}`);
                    });
            }).on("error", function(s) {
            callback(s);
        });
    }


    sayHelloWithPromise(id) {

        const options = {
            hostname: 'reqres.in',
            path: `/api/users/${id}`
        }
        console.log(options);
        return this.helloPromise(options);
    }

    helloPromise(options) {
        let promise = new Promise(function (resolve, reject) {
            https.get(options,
                function (res) {
                    let body = [];
                    res.on('data',
                        function (chunk) {
                            body.push(chunk);
                        });

                    res.on('end',
                        function () {
                            body = JSON.parse(Buffer.concat(body).toString());
                            resolve(`hello ${body.data.first_name}`);
                        });
                }).on("error", function (s) {
                    reject(s);
                });
        });

        return promise;
    }
}

module.exports = HelloWorld;