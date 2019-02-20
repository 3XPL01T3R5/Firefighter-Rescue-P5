var curves = [], id = 1, blockSize = 40, halfBlockSize = blockSize / 2, quarterBlockSize = blockSize/4, eighthBlockSize = blockSize / 8;
var initialX = 1, initialY = 0;


var dirToOrientation = {
    'up': Block.ORIENTATION_VERTICAL,
    'down': Block.ORIENTATION_VERTICAL,
    'right': Block.ORIENTATION_HORIZONTAL,
    'left': Block.ORIENTATION_HORIZONTAL
};
