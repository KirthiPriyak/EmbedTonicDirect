<script src="https://embed.tonicdirect.com/player/js/jquery.js"></script>
<script src="https://embed.tonicdirect.com/player/js/embediframe-min.js"></script>
<?php
include 'config.php';
//Get VideoKey/MediaId from Url.
//$mediaId = 'g4MECH9b';// Static video from sample tonic direct
$params = $_GET['param1'];
$paramsArr = explode('-', $params);
$mediaId = $paramsArr[0];
$playerId = $paramsArr[1];

//Include Api files and services.
require_once('botr/api.php');
$jwbotrapi = new BotrAPI(APIKEY, APISECRETVALUE);

//Set video params.
$videoParams = array('video_key' => $mediaId);
$response = $jwbotrapi->call("/videos/conversions/list", $videoParams);
$pathArr = $response['conversions'][4]['link'];
$videoFilePath = "https://" . $pathArr['address'] . $pathArr['path'];


$videoApiResponse = $jwbotrapi->call("/videos/show", $videoParams);
$tags = urlencode(str_replace(', ', ',', $videoApiResponse['video']['tags']));
?>
<!-- Add Player library .. -->

<script>
    $(function() {
        $('#playerDiv').playerWidget('<?php echo $videoFilePath; ?>', '<?php echo $mediaId; ?>', '<?php echo $tags; ?>', '<?php echo $playerId; ?>');
    });
</script>
<!--<script src="https://content.jwplatform.com/libraries/<?php //echo $playerId; ?>.js"></script>-->
<div id="playerDiv"></div>