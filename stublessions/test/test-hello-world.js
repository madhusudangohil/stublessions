const chai = require('chai');
const sinon = require("sinon");
const spies = require("chai-spies");
const expect = chai.expect;
const HelloWorld = require("../HelloWorld");
const https = require("https");
const nock = require("nock");
const stream = require("stream");

describe("hello world test",
    function () {
        it("should call sayHello method",
            function() {
                let hw = new HelloWorld("Madhu");
                let helloSpy = sinon.spy(HelloWorld.prototype, "sayHello");
                console.log(hw.sayHello());
                sinon.assert.calledOnce(helloSpy);
            });

        it("should call remotesayHello method.",
            function(done) {
                let hw = new HelloWorld("Madhu");
                let helloSpy = sinon.spy(HelloWorld.prototype, "sayHelloToRemoteUser");
                hw.sayHelloToRemoteUser(2, function (err, data) {
                    if (err)
                        console.log(err);
                    else {
                        console.log(data);
                    }
                    done();
                    sinon.assert.calledOnce(helloSpy);
                });
                
            });

        
        it("should call nock stub for remotesayHello method.",
            function (done) {
                let expected = {
                    "data": {
                        "id": 2,
                        "first_name": "Amita",
                        "last_name": "Gohil",
                        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"
                    }
                }

                let nk = nock("https://reqres.in")
                    .get("/api/users/2")
                    .reply(200, expected);
                

                let hw = new HelloWorld("Madhu");
                
                hw.sayHelloToRemoteUser(2, function (err, data) {
                    if (err)
                        console.log(err);
                    else {
                        console.log(data);
                        expect(data).to.be.equal('hello Amita');
                    }
                    done();
                    nock.restore();
                });

            });

        it("should call sinon stub for http get method",
            function(done) {
                let expected = {
                    "data": {
                        "id": 2,
                        "first_name": "Madhu",
                        "last_name": "Gohil",
                        "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/josephstein/128.jpg"
                    }
                }
                let stub = sinon.stub(https, 'get');
                var response = new stream.PassThrough();
                response.write(JSON.stringify(expected));
                response.end();

                var request = new stream.PassThrough();

                stub.callsArgWith(1, response)
                    .returns(request);
               

                let hw = new HelloWorld("Madhu");

                hw.sayHelloToRemoteUser(2, function (err, data) {
                    if (err)
                        console.log(err);
                    else {
                        console.log(data);
                        expect(data).to.be.equal('hello Madhu');
                    }
                    done();
                    stub.restore();

                });

            });

        it("should call sayHelloWithPromise method.",
            function () {
                let hw = new HelloWorld("Madhu");
                let helloSpy = sinon.spy(HelloWorld.prototype, "sayHelloWithPromise");
                let helloPromise = hw.sayHelloWithPromise(2);

                return helloPromise.then(r => {
                    expect(r).to.be.equal('hello lucille');
                    sinon.assert.calledOnce(helloSpy);
                });
            });


        it("should call stub helloPromise method.",
            function () {
                let hw = new HelloWorld("Madhu");
                let stub = sinon.stub(HelloWorld.prototype, "helloPromise");
                stub.resolves('hello Madhu');
                let helloPromise = hw.sayHelloWithPromise(2);

                return helloPromise.then(r => {
                    expect(r).to.be.equal('hello Madhu');
                });
            });

    });