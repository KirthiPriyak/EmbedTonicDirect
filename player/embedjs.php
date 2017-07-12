<?php
header('Access-Control-Allow-Origin: *'); 
header('ccess-Control-Allow-Methods: GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS'); 
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
header("Content-Type: text/plain; charset=utf-8");
//Get VideoKey/MediaId from Url.
$mediaId = $_GET['mediaId'];
include 'config.php';
//Include Api files and services.
require_once('botr/api.php');
$jwbotrapi = new BotrAPI(APIKEY, APISECRETVALUE);

//Set video params.
$videoParams = array('video_key' => $mediaId);
$response = $jwbotrapi->call("/videos/conversions/list", $videoParams);
$pathArr = $response['conversions'][4]['link'];
$videoFilePath = "://" . $pathArr['address'] . $pathArr['path'];

$videoApiResponse = $jwbotrapi->call("/videos/show", $videoParams);
$tags = urlencode(str_replace(', ',',',$videoApiResponse['video']['tags']));
$dataArr = array('videoFilePath' => $videoFilePath, 'tags' => $tags);
echo json_encode($dataArr);
?>