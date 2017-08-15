const assert = require("chai").assert;


describe('testing test', function(){
    it("Testing tests...", function(){
        assert.equal(2+2, 4);
    });
});

describe('type test', function(){ 
    it("Next", function(){
        assert.typeOf('abc', 'string');
    });
});