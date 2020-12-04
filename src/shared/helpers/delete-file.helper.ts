import * as fs from 'fs';

export const deleteFile = async (path) => {
  console.log(path);

  await fs.unlinkSync(path);
};
