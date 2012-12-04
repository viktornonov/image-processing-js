var imageProcessing = function () {
	"use strict";
	var totalNumberOfColors = 16777215; // FFFFFF
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
		},
		calculateHistogram: function(matrix, colorResolution) {
			var i = 0, sectionBorders = this.calculateColorBorders(colorResolution);
			var histogram = [], injectedColor;
			for (i = 0; i < matrix.length; i += 3) {
				injectedColor = injectColor(matrix[i], matrix[i+1], matrix[i+2]);
				// inject the three values to one and compare with the borders.
			}
		},
		calculateColorBorders: function(sections) {
			var i = 0, sectionBorders = [];
			var sectionLength = totalNumberOfColors / sections;
			var sectionRemainder = totalNumberOfColors % sections;
			for (i = 1; i < sections; i += 1) {
				var sectionBorder = Math.floor(sectionLength * i);
				var addition = sectionRemainder * i;
				if (Math.floor(addition) > 0 && addition % Math.floor(addition) >= 1) {
					sectionBorder += Math.floor(addition);
				}
				sectionBorders.push(sectionBorder);
			}
			return sectionBorders;
		},
		injectColor: function(red, green, blue) {
			return red*256*256 + green*256 + blue;
		}
	};
	return publ;
};