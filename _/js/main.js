var brain = {
    init: function() {
        var mess = $("#input .share-text").text();
        var matches = mess.match(/(.*)\ (shared)/gi);

        console.log(matches[0]);
    }
};

$(document).ready(function() {
    brain.init();
});
