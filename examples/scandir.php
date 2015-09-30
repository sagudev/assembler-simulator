<?php
  /* taken from: https://github.com/eladkarako/download.eladkarako.com */

  $path = '.';
  $files = [];
  $handle = @opendir('./' . $path . '/');

  while ($file = @readdir($handle)) {
    if (($tmp = strlen($file) - 4) >= 0 && strpos($file, ".txt", $tmp) !== FALSE) {
      $comment = substr(fgets(fopen($file, 'r')), 2);
      if (strpos($comment, 'HIDE') === FALSE) {
        array_push($files, $file . '|' . $comment);
      }
    }
  }
  @closedir($handle);
  sort($files); //uksort($files, "strnatcasecmp");

  $files = json_encode($files);

  unset($handle,$ext,$file,$path);
?>
<?php echo $files; ?>
