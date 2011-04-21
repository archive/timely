describe("Timely Specifications", function() {

    describe("when setting a timer for a function", function() {
        var someObject;
        var timely;

        beforeEach(function() {
            var SomeObject = function(){};
            SomeObject.prototype.someFunction = jasmine.createSpy();

            someObject = new SomeObject();
            timely = new Timely();
        });

        it("the function should be called when the timer expires", function() {
            runs(function() {
                timely.invoke("123", someObject.someFunction, someObject).after(5);
            });

            waits(10);

            runs(function(){
                expect(someObject.someFunction).toHaveBeenCalled();
            });
        });

        it("the function should only be called once", function() {
            runs(function() {
                timely.invoke("123", someObject.someFunction, someObject).after(5);
            });

            waits(10);

            runs(function(){
                expect(someObject.someFunction.callCount).toBe(1);
            });
        });

        it("it should be possible to stop the timer", function() {
            runs(function() {
                timely.invoke("123", someObject.someFunction, someObject).after(10);
            });

            waits(5);

            runs(function() {
                timely.stop("123");
            });

            waits(10);

            runs(function() {
                expect(someObject.someFunction).not.toHaveBeenCalled();
            });
        });

        it("it should be possible to restart the timer", function() {
            runs(function() {
                timely.invoke("123", someObject.someFunction, someObject).after(10);
            });

            waits(5);

            runs(function() {
                timely.restart("123");
            });

            waits(5);

            runs(function() {
                expect(someObject.someFunction).not.toHaveBeenCalled();
            });

            waits(15);

            runs(function() {
                expect(someObject.someFunction).toHaveBeenCalled();
            });
        });
    });
});