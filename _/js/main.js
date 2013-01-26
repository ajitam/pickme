var parse = {
    FBshare: function() {
        var mess = $("#input .share-text").val();
        if(mess.length == 0) { return false; }
        var matches = mess.match(/(.*)\ (shared)/gi);

        for (var i = 0; i < matches.length; i++) {
            matches[i] = matches[i].replace("shared","");
            matches[i] = matches[i].replace(/^\s+|\s+$/g,"");
        }

        $("#input .share-text").val('');
        $("button.facebook-btn").text('Got it!');
        setTimeout(function() {$("button.facebook-btn").text('Do the magic, again!');}, 1000);
        return matches;
    },

    commaSeparated: function() {
        var mess = $("#input .comma-text").val();
        if(mess.length == 0) { return false; }
        var matches = mess.split(",");

        for (var i = 0; i < matches.length; i++) {
            matches[i] = matches[i].replace(/^\s+|\s+$/g,"");
        }

        $("#input .comma-text").val('');
        $("button.comma-btn").text('Got it!');
        setTimeout(function() {$("button.comma-btn").text('Do the magic, again!');}, 1000);
        return matches;
    },

    extra_add: function() {
        var mess = $("#output #add input").val();
        if(mess.length == 0) { return false; }
        var matches = mess.split(",");

        for (var i = 0; i < matches.length; i++) {
            matches[i] = matches[i].replace(/^\s+|\s+$/g,"");
        }

        $("#output #add input").val('');
        $("button.add-btn").text('Got it!');
        setTimeout(function() {$("button.add-btn").text('Add, again!');}, 1000);
        return matches;
    }
};

var build = {
    list: function(database) {
        // Clear list
        $("#output .list li").remove();

        // Build list
        for (var i = 0; i < database.length; i++) {
            $("#output .list").append('<li data-id="'+i+'" data-name="'+database[i]+'">'+database[i]+'</li>');
        }

        // Set counter
        $("#output .count").text(database.length);

        // Show proceed button if database is > 0
        if (database.length > 0) {
            $("#output .content").slideDown();
        } else {
            $("#output .content").slideUp();
        };

        $("#output .list li").on(
        "mouseenter", function() {
            //$(this).text('delete?');
            $(this).css('background-color', 'rgba(200, 0, 0, 0.2)');
        });

        $("#output .list li").on(
        "mouseleave", function() {
            $(this).css('background-color', 'rgba(0, 0, 0, 0.2)');
        });

        // Click - delete
        $("#output .list li").on(
        "click", function() {
            database.splice($(this).attr('data-id'), 1);
            build.list(database);

        });
    },

    pickList: function(database, pick_array) {

        help.shuffle(database);

        // Clear list
        $("#result .pick-list li").remove();

        //pick_array = [];

        var i = 0;
        var timer = setInterval(function(){
            if(i < database.length) {
                $("#result .pick-list").append('<li data-id="'+i+'" data-name="'+database[i]+'">'+database[i]+'</li>');
                pick_array.push(i);
                i++;
            } else {
                window.clearInterval(timer);
                $("#result button.pick-btn").show();
            }
            
        },100);

    }
};

var help = {
    randomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    shuffle: function(in_array) {
    var len = in_array.length;
    var i = len;
        while (i--) {
            var p = parseInt(Math.random()*len);
            var t = in_array[i];
            in_array[i] = in_array[p];
            in_array[p] = t;
        }
    },
    
    scrollTo: function(indicator) {
    $('html, body').delay(100).animate({
        scrollTop: $(indicator).offset().top+"px"
        }, 300);
    },

    pick: function(database, pick_array) {
        help.shuffle(pick_array);
        var i = 0;
        var timer = setInterval(function(){
            if(i < database.length-1) {
                $("#result .pick-list li[data-id='"+pick_array[i]+"']").css('opacity', '0.2');
                i++;
            } else {
                window.clearInterval(timer);
                $("#result .pick-list li[data-id='"+pick_array[i]+"']").css('background-color', 'rgba(200, 0, 0, 0.8)');
                setTimeout(function() {
                    $("#result button.reload-btn").show();
                }, 500);
            }
            
        },200);
    }
};

$(document).ready(function() {
    // Create the almighty database
    var database = new Array();
    var pick_array = new Array();
    
    // Manage all .hide-switch classes
    $(".hide-switch").hide().removeClass("hide-switch");

    // Buttons triggers
    $("button.facebook-btn").click(function(evn) {
        evn.preventDefault();

        var tmp_array = [];
        tmp_array = parse.FBshare();
        for (var i = 0; i < tmp_array.length; i++) {
            database.push(tmp_array[i]);
        }

        // Better safe than sorry
        tmp_array = [];

        build.list(database);
        //console.log(database);

    });

    $("button.comma-btn").click(function(evn) {
        evn.preventDefault();
        var tmp_array = [];
        tmp_array = parse.commaSeparated();
        for (var i = 0; i < tmp_array.length; i++) {
            if(tmp_array[i] != "") {
                database.push(tmp_array[i]);
            }
        }

        // Better safe than sorry
        tmp_array = [];

        build.list(database);
       // console.log(database);

    });

    $("#add").submit(function(evn) {
        evn.preventDefault();
        var tmp_array = [];
        tmp_array = parse.extra_add();
        for (var i = 0; i < tmp_array.length; i++) {
            if(tmp_array[i] != "") {
                database.push(tmp_array[i]);
            }
        }

        // Better safe than sorry
        tmp_array = [];

        build.list(database);
        //console.log(database);

    });

    $("button.pick-btn").click(function(evn) {
        evn.preventDefault();
        $("#result button.pick-btn").hide();

        // Lets do this shot!
        help.pick(database, pick_array);

    });

    $("button.dummy-btn").click(function(evn) {
        evn.preventDefault();
        $("#input .comma-text").val($("#dummy").text());
    });

    $("button.reload-btn").click(function() {
        location.reload();
    });

    $("#output button.proceed-btn").click(function() {
        // So user can't submit twice
        $(this).hide();
        //$("#input .content, #output .content").slideUp();
        $("#result .content").css('min-height', '500px');
        $("#result .content").slideDown();

        help.scrollTo("#result");

        setTimeout(function() {build.pickList(database, pick_array)}, 1000);
    });
});
