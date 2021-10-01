<!DOCTYPE html>

<html>

<head>
    <title>WebGL 2 Example: Occlusion Culling</title>
    <meta charset="utf-8">
    <script src="gl-matrix.js"></script>
    <script src="utils.js"></script>
    <link rel="stylesheet" href="webgl2examples.css">
 
</head>

<body>


<?php

//require 'vendor/autoload.php' ;

$uri="mongodb+srv://miley:7227@cluster0.mp2jo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

$client=new MongoDB\Client($uri);

$collection = $client->base_de_datos->productos;

$result = $collection->insertOne( [ 'item' => 'producto1', 'cantidad' => '200' ] );

echo "Inserted with Object ID '{$result->getInsertedId()}'";

?>
</body>

</html>