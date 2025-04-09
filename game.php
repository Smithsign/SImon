<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $score = intval($_POST['score']);
  $file = 'scores.txt';
  $entry = "Score: $score at " . date('Y-m-d H:i:s') . PHP_EOL;
  file_put_contents($file, $entry, FILE_APPEND);
  echo 'Score saved!';
}
?>
