<?php
include "tapworld.php";



$connect=mysqli_connect('localhost:33065','root','1234m','base-deporte');
$codigoqr=$_POST['username'];
echo'<script> alert("Conecta222 '.$codigoqr.' ")</script>';


if($connect!=null ){
  
  $sql = "SELECT usuario FROM usuario WHERE usuario='hola'";

  $datos = mysqli_query($connect, $sql);
  $arrayDatos = array();

$extraido= mysqli_fetch_array($datos);
echo "- Nombreeeeeeeeee: ".$extraido['usuario']."<br/>";
echo json_encode(array('success' => 1));

}else{
  echo'<script> alert("NO Conetado")</script>';
}
?>
