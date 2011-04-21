(function(window) {

    window.Timely = function() {
        this.items = [];
    };

    window.Timely.prototype._invoke = function(item) {
        item.handle = window.setTimeout(function() {
            return item.fn.call(item.target);
        }, item.milliseconds);
    };

    window.Timely.prototype.stop = function(id) {
        var item;
        if(this._tryGetItemById(id, function(itemFound){item = itemFound;})){
            this._stop(item);
        }
    };

    window.Timely.prototype._stop = function(item) {
        window.clearTimeout(item.handle);
    };

    window.Timely.prototype.stopAll = function(){
        var items = this.items;
        for (var i = 0,length = items.length; i < length; i++) {
            this._stop(items[i]);
        }
    };

    window.Timely.prototype._tryGetItemById = function(id, itemFoundCallback) {
        var items = this.items;
        for (var i = 0,length = items.length; i < length; i++) {
            var item = items[i];
            if (item.id === id) {
                itemFoundCallback(item);
                return true;
            }
        }
        return false;
    };

    window.Timely.prototype.restart = function(id) {
        var item;
        if(this._tryGetItemById(id, function(itemFound){item = itemFound;})){
            this._stop(item);
            this._invoke(item);
        }
    };

    window.Timely.prototype.invoke = function(id, fn, target) {

        if(this._tryGetItemById(id, function(){})){
            throw "The id " + id + " is already present";
        }

        // add check for fn === function
        var item = {
            "id": id,
            "fn": fn,
            "target" : target,
            "milliseconds" : null,
            "handle" : null
        };

        // add check for exsisting
        this.items.push(item);

        var self = this;

        return {
            after : function(milliseconds) {
                item.milliseconds = milliseconds;
                self._invoke(item);
            }
        };
    };


})(this);




