/* This software is licensed under a BSD license; see the LICENSE file for details. */

define_ibex_controller({
name: "MaskedPrime",

jqueryWidget: {
    _init: function () {
        this.cssPrefix = this.options._cssPrefix;
        this.utils = this.options._utils;
        this.finishedCallback = this.options._finishedCallback;

        var self = this;
        var domElem = this.element[0];

        var tn = document.createTextNode("---");
        domElem.appendChild(tn);
        this.state = 'initial';

        var hash = "";
        for (var i = 0; i < this.options.prime.length; ++i)
            hash += "#";

        var primeTime = parseInt(this.options.primeTime);
        var maskTime = parseInt(this.options.maskTime);
        var itemTimeout = parseInt(this.options.itemTimeout);

        var timePresented;

        this.safeBind($(document), 'keydown', function (e) {
            var timePressed = new Date().getTime();

            e.preventDefault();
            if (self.state == 'initial') {
                self.state = 'mask';
                tn.textContent = hash;

                setTimeout(function () {
                    self.state = 'prime';
                    tn.textContent = self.options.prime;
                    setTimeout(function () {
                        self.state = 'item';
                        tn.textContent = self.options.item;
                        timePresented = new Date().getTime();
                        setTimeout(function () {
                            if (self.state != 'complete') {
                                self.state = 'complete';
                                self.finishedCallback([[
                                    ["prime", self.options.prime],
                                    ["item", self.options.item],
                                    ["reaction_time", itemTimeout],
                                    ["timed_out", "timed_out"],
                                    ["answer", ""]
                                ]]);
                            }
                        }, itemTimeout);
                    }, primeTime);
                }, maskTime);

                return true;
            }
            else if (self.state == 'item') {
                var code = e.keyCode;
                var keyPressed = String.fromCharCode(code);

                if (keyPressed.toLowerCase() == self.options.yes.toLowerCase() ||
                    keyPressed.toLowerCase() == self.options.no.toLowerCase()) {
                    self.state = 'complete';
                    self.finishedCallback([[
                        ["prime", self.options.prime],
                        ["item", self.options.item],
                        ["reaction_time", timePressed - timePresented],
                        ["timed_out", "reacted_in_time"],
                        ["answer", keyPressed.toLowerCase() == self.options.yes.toLowerCase() ? "yes" : "no"]
                    ]]);
                }
            }
        });
    }
},

properties: {
    obligatory: ["prime", "maskTime", "primeTime", "itemTimeout", "yes", "no"],
    countsForProgressBar: true,
    htmlDescription: function (opts) {
        return truncateHTML(htmlCodeToDOM(document.createTextNode(opts.html).innerHTML), 100);
    }
}
});
