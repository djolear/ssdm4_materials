<?php
// the $_POST[] array will contain the passed in filename and data
// the directory "data" is writable by the server (chmod 777)
$filename = "data/".$_POST['filename'];
$data = $_POST['filedata'];
// write the file to disk
file_put_contents($filename, $data);
?>

//And this is the JavaScript piece function 

saveData(filename, filedata, callback, error_callback){
  $.ajax({
     type: 'post',
     cache: false,
     url: 'https://web.stanford.edu/~djolear/cgi-bin/save_data.php',
     data: {filename: filename, filedata: filedata},
     success: callback,
     error: error_callback
  });
}