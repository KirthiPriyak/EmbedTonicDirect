
/**
 * jQuery JW player widget plugin
 * 
 * @ToDo - Change playerKey and fbPixelKey when we move to live
 */

window.onload = function() {
    var parentUrl = parent.document.location.toString();
    var parentUrlArr = parentUrl.split(":");
    var parentProtocol = parentUrlArr[0];
    
    var baseUrl = parentProtocol + '://embed.tonicdirect.com/player';
    //First load jquery and then run the remaining script in jquery load event.
    var script = document.createElement('script');
    script.src = baseUrl + '/js/jquery.js';
    script.onload = function() {
        //Get current script
        var newDivElement = "playerDiv" + Math.floor(1000 + Math.random() * 9000);
        var scripts = document.getElementsByTagName('script');
        var url_repeats = 0;
        
        if (scripts.length == 2){ 
          //Loading in same domain or sub domain
          //We get only two scripts loaded. js file and video url
          currentScriptUrl = (document.currentScript || scripts[scripts.length - 1]).src;
        }
        else
        {
          for (var i = 0; i < scripts.length; ++i) {
            var scriptElem = scripts[i].src;
            if( scriptElem.indexOf("//embed.tonicdirect.com/player/") >= 0){
                if( scriptElem.indexOf("//embed.tonicdirect.com/player/js") >= 0){
                  //do nothing if Js files are getting loaded in tonic direct
                }else{
                  url_repeats ++;
                  //Current Url is video url
                  currentScriptUrl = scriptElem; 
                }
            }//end of if
          }//end of for 
        }//end of else
        
        

        //get parameters from executed js file path.
        var filename = currentScriptUrl.substring(currentScriptUrl.lastIndexOf('/') + 1);
        var fileNameArr = filename.split(".");
        
        var fileArr = fileNameArr[0].split("-");
        var mediaId = fileArr[0];
        var playerId = fileArr[1];
        
        //var newDivElement = "playerDiv_" + fileNameArr[0];
        
        //Create new Div Element to load the player.
        scriptTag = scripts[scripts.length - 1];
        var parentTag = scriptTag.parentNode;
        $(parentTag).append("<div id=" + newDivElement + "><img src=" + baseUrl + "/images/loading.gif /></div>");


        query = window.parent.location.search.substring(1);
        $.ajax({
            url: baseUrl + '/embedjs.php',
            type: 'GET',
            data: {
                'mediaId': mediaId
            },
            dataType: 'text',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With'
            },

            success: function(content) {
                var jsonData = JSON.parse(content);
                //Load JW Player library
                loadDefaultJwplayer(baseUrl,mediaId, jsonData, newDivElement, playerId, parentProtocol);
               // loadPlayerJsLibrary(mediaId, jsonData, newDivElement, playerId, parentProtocol);
               // loadVideo(mediaId, jsonData, newDivElement, playerId, parentProtocol);
            },
            async: true
        });
    };
    document.head.appendChild(script);
    
}

//Embed JW default player library
function loadDefaultJwplayer(baseUrl,mediaId, jsonData, newDivElement, playerId, parentProtocol)
{
    $.ajax({
        url: baseUrl + '/player/jwplayer.js',
        dataType: "script",
        success: function(content) {
          loadPlayerJsLibrary(mediaId, jsonData, newDivElement, playerId, parentProtocol);
        },
        async: true
    });
}

/**
 * Embed JW player library by Player type
 * 
 * @param String playerId - Player Key
 * @returns
 */
function loadPlayerJsLibrary(mediaId, jsonData, newDivElement, playerId, parentProtocol)
{
    $.ajax({
        url: 'https://content.jwplatform.com/libraries/' + playerId + '.js',
        dataType: "script",
        success: function(content) {
          loadVideo(mediaId, jsonData, newDivElement, playerId, parentProtocol);
        },
        async: true
    });
                
}

/**
 * Load Video from server.
 * 
 * @param String mediaId - Video Key
 * @param Object videoMeta - Video metadata as FilePath
 * @returns
 */
function loadVideo(mediaId, videoMeta, newDivElement, playerId, parentProtocol)
{
    var playerKey = '0bVFyK/2KM166btXGWosmhnVya+Ez7YRoUjgZzvF/Y3IXUm6';
    var filePath = parentProtocol + videoMeta.videoFilePath;
    var tags = videoMeta.tags;

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
    
    console.log('ad tag url = '+adTagUrl);
    jwplayer.key = playerKey;
    //Initiate Player instance
    var playerInstance = jwplayer(newDivElement);
    playerInstance.setup({
        file: filePath,
        image: parentProtocol + "://content.jwplatform.com/thumbs/" + mediaId + ".jpg",
        mediaid: mediaId,
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
    fbpixel(mediaId, playerInstance);
    _googleAnalytics(mediaId, playerInstance)
}

//Facebook pixel code 
function fbpixel(mediaId, playerInstance) {
    var fbPixelKey = '1642595269338156';
    //playerInstance.on('firstFrame', function(e, a) {
        fbq('init', fbPixelKey);
       // fbq('track', 'PageView');
        fbq("trackCustom", 'PageView', {mediaid: mediaId});
    //});
     playerInstance.on('play', function(e, a) {
        fbq("trackCustom", e, {mediaid: mediaId});
    });
    playerInstance.on('complete', function(e, a) {
        fbq("trackCustom", e, {mediaid: mediaId});
    });
}

//Google Analytics.
function _googleAnalytics(mediaId, playerInstance) {
    var googleAnalyticsKey = 'UA-93757223-1';
    playerInstance.on('firstFrame', function() {
        ga('create', googleAnalyticsKey, 'auto');
        ga('send', 'pageview', {'dimension1': mediaId});
    });
}