var imageProcessing = function () {
	"use strict";
	var publ = {
		extractColorMatrix: function (canvas) {
			var imagedata, i = 0, cmIndex = 0, pixels, colorMatrix;
			var context = canvas.getContext('2d');
			imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
			colorMatrix = [];
			pixels = imagedata.data;
			for (i = 0; i < pixels.length; i+=4) {
				colorMatrix[cmIndex] = pixels[i];
				colorMatrix[cmIndex+1] = pixels[i+1];
				colorMatrix[cmIndex+2] = pixels[i+2];
				cmIndex+=3;
			}
			return colorMatrix;
		}
	};
	return publ;
};