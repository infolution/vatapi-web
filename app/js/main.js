$('#signup').submit(function (e) {
    $('#status').html('Signing up...');

    e.preventDefault();
    var data = $('#signup').serialize();
    var password = $('#password').val();
    var salt = "vatapi";
    var mypbkdf2 = new PBKDF2(password, salt, 1, 64);
    var status_callback = function (percent_done) {
        $('#status').html("Computed " + percent_done + "%");
    };
    var result_callback = function (key) {
        data = data.replace("password=" + password, "password=" + key);
        $('#status').html("The derived key is: " + key);
        $.ajax({
                url: 'http://localhost:3000/signup/',
                data: data,
                success: function (res) {
                    console.log('Response received. ' + res);
                    $('#status').html('Signup finished. Success: ' + res.success);
                },
                dataType: "jsonp",
                jsonp: "callback"

            }
        );
    };
    mypbkdf2.deriveKey(status_callback, result_callback);
});

$('#generateAPIKey').click(function (e) {
    e.preventDefault();
    var data = {clientid: window.sessionStorage.clientid, session: window.sessionStorage.session};
    $.ajax({
            url: 'http://localhost:3000/generateapi/',
            data: data,
            success: function (res) {
                console.log('Response received. ' + res);
                $('#apikey').html(res.apikey);
            },
            dataType: "jsonp",
            jsonp: "callback"

        }
    );
});

$('#login').submit(function (e) {
    $('#status').html('Logging in...');

    e.preventDefault();
    var data = $('#login').serialize();
    var password = $('#password').val();
    var salt = "vatapi";
    var mypbkdf2 = new PBKDF2(password, salt, 1, 64);
    var status_callback = function (percent_done) {
        //$('#status').html("Computed " + percent_done + "%");
    };
    var result_callback = function (key) {
        data = data.replace("password=" + password, "password=" + key);
        //$('#status').html("The derived key is: " + key);
        $.ajax({
                url: 'http://localhost:3000/login/',
                data: data,
                success: function (res) {
                    console.log('Response received. ' + res);
                    window.sessionStorage.clientid = res.clientid;
                    window.sessionStorage.session = res.session;
                    window.location = "/account/"
                },
                dataType: "jsonp",
                jsonp: "callback"

            }
        );
    };
    mypbkdf2.deriveKey(status_callback, result_callback);
});

function loadAccountInfo() {
    var data = {clientid: window.sessionStorage.clientid, session: window.sessionStorage.session};
    if (typeof data.clientid === 'undefined' && typeof data.session === 'undefined') {
        window.location = "/login/";
    } else {
        $.ajax({
                url: 'http://localhost:3000/account/',
                data: data,
                success: function (res) {
                    console.log('Response received. ' + res);

                    $('#company').html(res.name);
                    $('#companyinfo .street-address').html(res.address);
                    $('#companyinfo .locality').html(res.city);
                    $('#companyinfo .zip').html(res.zip);
                    $('#companyinfo .state').html(res.state);
                    if (res.country !== '') {
                        var country = iso.findCountryByCode(res.country);
                        $('#companyinfo .country').html(country.name);
                    }
                    $('#apikey').html(res.apikey);
                    $('#useremail').html(res.email);
                },
                dataType: "jsonp",
                jsonp: "callback"

            }
        );
    }
}

function choosePlan() {
    var hash = window.location.hash;
    if (hash !== "") {
        var chosenPlan = hash.substr(1);
        $('#plan').val(chosenPlan);
        window.location.hash = "";
    }
}

$('#example-calc-btn').click(function (e) {
    $('#example-calc-status').html('Executing Calc method...');

    e.preventDefault();
    var amountcents = ~~($('#example-calc-amount').val() * 100);
    var data = {country: $('#example-calc-country').val(),
        amount: amountcents,
        apikey: '6fpYAyHO0jwNTwoSi1p1L4D8ubVpECPg'
    };

    $.ajax({
            url: 'http://localhost:3000/calc/',
            data: data,
            success: function (res) {
                console.log('Response received. ' + res);
                $('#example-calc-status').html('');
                $('#example-calc-response').html(JSON.stringify(res, null, " ")).each(function(i, e) {hljs.highlightBlock(e)});
            },
            dataType: "jsonp",
            jsonp: "callback"

        }
    );

});

var VATAPI = {
    apiurl: 'http://localhost:3000',
    init: function() {

    },
    bindUIActions: function() {
        s.moreButton.on("click", function() {
            NewsWidget.getMoreArticles(s.numArticles);
        });
    },
}


//App handler
(function () {



    //check session
    var data = {clientid: window.sessionStorage.clientid, session: window.sessionStorage.session};
    if (typeof data.clientid !== 'undefined' && typeof data.session !== 'undefined') {
        $('#loginMenu').html('Logout').click(function (e) {
            e.preventDefault();
            delete window.sessionStorage.clientid;
            delete window.sessionStorage.session;
            $('#loginMenu').off('click');
            window.location = '/';
        });
        var signupBtn = $('#signupMenu');
        signupBtn.html('Account').attr('href', '/account/');


    }

    //Route
    var url = window.location.pathname.split('/')[1];
    if (url.indexOf('account') > -1) {
        loadAccountInfo();
    }
    if (url.indexOf('signup') > -1) {
        choosePlan();
    }
    if (url.indexOf('api') > -1) {
        hljs.initHighlightingOnLoad();
//        Foundation.init();
    }

    //Init foundation
    $(document).foundation();

})();