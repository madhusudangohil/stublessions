# stublessions
What are stubs?
Test stubs are functions (spies) with pre-programmed behavior.
1) Stubs can be either anonymous, or wrap existing functions
var stub = sinon.stub();
2) When wrapping an existing function with a stub, the original function is not called.
var stub = sinon.stub(object, "method");
3) Stubs all the object’s methods.
var stub = sinon.stub(obj);

Note: It’s usually better practice to stub individual methods.



