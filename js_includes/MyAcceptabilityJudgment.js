/* This software is licensed under a BSD license; see the LICENSE file for details. */

$.widget("ui.MyAcceptabilityJudgment", {
    _init: function () {
        this.cssPrefix = 'AcceptabilityJudgment-';//this.options._cssPrefix;
        this.utils = this.options._utils;
        this.finishedCallback = this.options._finishedCallback;

        var opts = {
            options:     this.options,
            triggers:    [1],
            children:    ["MyFlashSentence", {s: this.options.s, timeout: dget(this.options, "timeout", null)},
                          "Question", { q:              this.options.q,
                                        as:             this.options.as,
                                        hasCorrect:     this.options.hasCorrect,
                                        presentAsScale: this.options.presentAsScale,
                                        autoFirstChar:  this.options.presentAsScale ? true : false,
                                        randomOrder:    this.options.randomOrder,
                                        showNumbers:    this.options.showNumbers,
                                        timeout:        this.options.timeout,
                                        instructions:   this.options.instructions,
                                        leftComment:    this.options.leftComment,
                                        rightComment:   this.options.rightComment }],
            manipulators: [
                [1, function(div) { div.find(".Question-question-text").append("YAY!").css('text-align', "center").css('color', 'red'); return div; }]
            ]
        };

        this.element.VBox(opts);

        $(".Question-Question").hide();
        $(".FlashSentence-flashed-sentence").append("<p id='to-be-removed' style='font-style:italic; font-size: small; width: 10.5em; margin-left: auto; margin-right: auto; margin-top: 60px;'>Press space to continue</p>");
    }
});

ibex_controller_set_properties("MyAcceptabilityJudgment",
    { obligatory: ["s", "as"],
      htmlDescription:
          function (opts) {
              var s = ibex_controller_get_property("MyFlashSentence", "htmlDescription")(opts);
              var q = ibex_controller_get_property("Question", "htmlDescription")(opts);
              var p =
                  $(document.createElement("p"))
                  .append($(document.createElement("b"))
                          .append("Q: ")
                          .append($(q)))
                  .append($(document.createElement("br")))
                  .append($(document.createElement("b"))
                          .append("S: "))
                  .append($(s));

              return p;
          }
    }
);
