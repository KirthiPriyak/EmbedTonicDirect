
/**
 * jQuery JW player widget plugin
 * 
 * @ToDo - Change playerKey and fbPixelKey when we move to live
 */
(function($) {
    var playerKey = '0bVFyK/2KM166btXGWosmhnVya+Ez7YRoUjgZzvF/Y3IXUm6';
    var fbPixelKey = '1642595269338156';
    var googleAnalyticsKey = 'UA-93757223-1';
    var baseUrl = 'https://embed.tonicdirect.com/player';
    $.fn.playerWidget = function(videoFilePath, mediaId, tags, playerId) {
        $.ajax({
            url: baseUrl + '/player/jwplayer.js',
            dataType: "script",
            async: false
        });
        jwplayer.key = playerKey;
        var playerInstance = jwplayer("playerDiv");
        _initialize();
        function _initialize() {
            _set_interface();
            _start();
            _fbpixel();
            _googleAnalytics();
            return false;
        }

        function _start() {
            //Set Advertising Tag url with custom parameters.
            var tagsnew = tags.replace(/\+/g, '%20');
            var decodeTags = decodeURIComponent(tagsnew);
            var custparams = "tag=" + decodeTags + "&playerid=" + playerId;
            var custTags = encodeURIComponent(custparams);
            //page url 
            var currentUrl = window.location.href;
            //Correlator
            var today = new Date();
            var timestampNow = today.getTime();
            var adTagUrl = "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/254583669/StandardPre-Roll&ciu_szs=300x250&cust_params=" + custTags + "&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&url="+currentUrl+"&correlator="+timestampNow
            //Initiate player.
            playerInstance.setup({
                file: videoFilePath,
                mediaid: mediaId,
                image: "https://content.jwplatform.com/thumbs/" + mediaId + ".jpg",
                width: '100%',
                aspectratio: "16:9",
                advertising: {
                    client: "vast",
                    schedule: {
                        adbreak1: {
                            offset: "pre",
                            tag: adTagUrl
                        }
                    }
                }
            });
        }

        function _set_interface() {
            // $('body').append('<div id="myElement"></div>');
        }

        //Facebook pixel code 
        function _fbpixel() {
           // playerInstance.on('firstFrame', function(e, a) {
                fbq('init', fbPixelKey);
               // fbq('track', 'PageView');
                fbq("trackCustom", 'PageView', {mediaid: mediaId});
           // });
              playerInstance.on('play', function(e, a) {
                fbq("trackCustom", e, {mediaid: mediaId});
            });
            playerInstance.on('complete', function(x, a) {
                fbq("trackCustom", x, {mediaid: mediaId});
            });
        }
        
        //Google Analytics.
        function _googleAnalytics() {
            playerInstance.on('firstFrame', function() {
                ga('create', googleAnalyticsKey, 'auto');
                ga('send', 'pageview', {'dimension1': mediaId});
            });
        }
    };
})(jQuery);