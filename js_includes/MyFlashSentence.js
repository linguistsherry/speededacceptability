/* This software is licensed under a BSD license; see the LICENSE file for details. */

$.widget("ui.MyFlashSentence", {
    _init: function () {
        this.cssPrefix = 'FlashSentence-'//this.options._cssPrefix;
        this.finishedCallback = this.options._finishedCallback;
        this.utils = this.options._utils;

        this.sentence = this.options.s;
        this.timeout = dget(this.options, "timeout", 2000);

        this.sentenceDescType = dget(this.options, "sentenceDescType", "literal");
        assert(this.sentenceDescType == "md5" || this.sentenceDescType == "literal", "Bad value for 'sentenceDescType' option of FlashSentence controller.");
        if (this.sentenceDescType == "md5") {
            var canonicalSentence = this.sentence.split('/\s/').join(' ');
            this.sentenceMD5 = hex_md5(canonicalSentence);
        }
        else {
            this.sentenceMD5 = csv_url_encode(this.options.s);
        }

        this.element.addClass(this.cssPrefix + "flashed-sentence");
        //var words = this.sentence.split(/[,.' ]/);
        var divs = [ ];
        var hdivs = [ ];
        var alreadyAdded;

        var current = "";
        for (var i = 0; i < this.sentence.length; ++i) {
            if (this.sentence.charAt(i) == '[') {
                divs.push($("<span>").text(current));
                current = "";
            }
            else if (this.sentence.charAt(i) == ']') {
                var hd = $("<span>").text(current);
                divs.push(hd);
                hdivs.push(hd);
                current = "";
            }
            else {
                current += this.sentence.charAt(i);
            }
        }
        divs.push(current);

        var doneit = false;
        var lock = false;
        function doit () {
            $("#to-be-removed").remove();
            $(".Question-Question").fadeIn();

            if (lock) return;
            lock = true;
            var initial;
            var add;
            if (doneit) { initial = 25; add = 16; }
            else { initial = 230; add = -8; }
            doneit = ! doneit;
            var rb = initial;
            function d2h2(n) {
                var h = (n).toString(16);
                if (h.length == 1) h = '0' + h;
                return h;
            }
            var tid = setInterval(function () {
                rb += add;
                if (rb < 0) rb = 0;
                if (rb > 255) rb = 255;
                var v = d2h2(rb);
                var col = '#' + v + 'FF' + v;
                for (var i = 0; i < hdivs.length; ++i) hdivs[i].css('background', col);
                if (rb == 0 || rb == 255) {
                    clearInterval(tid);
                    lock = false;
                }
            }, 50);
        }
        this.safeBind($(document), 'keypress', function (e) {
            if (e.which == 32) {
                doit();
                return false;
            }
        });
//        setTimeout(doit, 0.0314*this.sentence.length*1000);
        for (var i = 0; i < divs.length; ++i) {
            this.element.append(divs[i]);
//            this.element.append(document.createTextNode(' '));
        }

        if (this.timeout) {
            var t = this;
            this.utils.setTimeout(function() {
                t.finishedCallback([[["Sentence (or sentence MD5)", t.sentenceMD5]]]);
            }, this.timeout);
        }
        else {
            // Give results without actually finishing.
            if (this.utils.setResults)
                this.utils.setResults([[["Sentence (or sentence MD5)", this.sentenceMD5]]]);
        }
    }
});

ibex_controller_set_properties("MyFlashSentence", {
    obligatory: ["s"],
    htmlDescription: function (opts) {
        return $(document.createElement("div")).text(opts.s)[0];
    }
});
