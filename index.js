require('dotenv').load({silent: true});

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');

fs.watch('src', function(event, filename) {
  console.log('>> [%s]: %s', event, filename);

  if (filename) {save(filename);}
});

fs.readdir('src', function(err, files) {
  files.forEach(function(f) {
    save(f);
  });
});

var tmpi = 0;
function tmpName() {
  return 'TEMP_' + (tmpi++) + '_' + Date.now();
}

function save(name) {
  var src = path.join(__dirname, 'src', name);
  var tmp = path.join(__dirname, 'dist', tmpName());

  var sha = crypto.createHash('sha1');

  var input = fs.createReadStream(src);
  var output = fs.createWriteStream(tmp);

  input.pipe(output);
  input.on('data', sha.update.bind(sha));
  input.on('end', function() {
    var f = sha.digest('hex') + '.' + name;
    var target = path.join(__dirname, 'dist', f);
    fs.rename(tmp, target);
  });

}
