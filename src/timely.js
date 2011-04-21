(function(context) {

    context.Timely = function() {
        this.items = [];
    };

    context.Timely.prototype.invoke = function(id, fn, target) {
        if(this._tryGetItemById(id, function(){})){ throw "The id " + id + " is already present"; }
        if(typeof fn !== "function") throw "You must supply an function for the invoke";

        var item = this._buildItem(id, fn, target);
        this._addItemToList(item);

        var self = this;
        return {
            after : function(milliseconds) {
                item.milliseconds = milliseconds;
                self._invoke(item);
            }
        };
    };

    context.Timely.prototype._addItemToList = function(item) {
        this.items.push(item);
    };

    context.Timely.prototype._invoke = function(item) {
        item.handle = context.setTimeout(function() {
            return item.fn.call(item.target);
        }, item.milliseconds);
    };

    context.Timely.prototype.stop = function(id) {
        var item;
        if(this._tryGetItemById(id, function(itemFound){item = itemFound;})){
            this._stop(item);
        }
    };

    context.Timely.prototype._stop = function(item) {
        context.clearTimeout(item.handle);
    };

    context.Timely.prototype.stopAll = function(){
        var items = this.items;
        for (var i = 0,length = items.length; i < length; i++) {
            this._stop(items[i]);
        }
    };

    context.Timely.prototype.restart = function(id) {
        var item;
        if(this._tryGetItemById(id, function(itemFound){item = itemFound;})){
            this._stop(item);
            this._invoke(item);
        }
    };

    context.Timely.prototype._tryGetItemById = function(id, itemFoundCallback) {
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

    context.Timely.prototype._buildItem = function(id, fn, target) {
        return {
            "id": id,
            "fn": fn,
            "target" : target,
            "milliseconds" : null,
            "handle" : null
        };
    };

})(this);




