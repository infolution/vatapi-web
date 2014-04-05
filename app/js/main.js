$('#free').submit(function (e) {
    $('#status').html('Preparing download...');
    e.preventDefault();
//    var w = window.open("application/x-download");
//    var hiddenIFrameID = 'hiddenDownloader',
//        iframe = document.getElementById(hiddenIFrameID);
//    if (iframe === null) {
//        iframe = document.createElement('iframe');
//        iframe.id = hiddenIFrameID;
//        iframe.style.display = 'none';
//        document.body.appendChild(iframe);
//    }


    $.ajax({
            url: '/cgi-bin/saveuser.pl',
            type: 'post',
            data: $('#free').serialize(),
//            datatype:"json",
            success: function (res) {
                console.log('Response received. ' + res);
                $('#status').html('Download started');
//                $('#url').html('<h1><a href="'+res.url+'">' + res.url + '</a></h1>');
                window.location = "/cgi-bin/download.pl";
            }

        }
    );
});