import * as fs from 'fs';
import * as path from 'path';

export const createDirectoryByPath = async (inputPath) => {
  let dirs = inputPath.split('/');
  let root = `${dirs[0]}/`;
  dirs = dirs.splice(1);

  for (const dir in dirs) {
    const status = searchDirectory(root, dirs[dir]);
    if (!status) {
      createDirectory(root, dirs[dir]);
      root = path.join(root, dirs[dir]);
    }
  }
};

function createDirectory(dir, createDirectory) {
  const target = path.join(dir, createDirectory);
  fs.mkdir(target, '0755', function (err) {
    if (err) {
      return false;
    }
    return true;
  });
}

function searchDirectory(dir, target) {
  fs.readdir(dir, function (err, files) {
    if (err) {
      throw err;
    }
    files.forEach(function (file) {
      if (file === target) {
        fs.stat(path.join(dir, file), function (err, stats) {
          if (!stats.isDirectory()) {
            createDirectory(dir, target);
          }
        });
      }
    });
  });
  return false;
}
