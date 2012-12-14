var imageProcessing = function () {
	"use strict";
	
	//var ColorCounter = function () {
	//	var 
	//	return {
	//		
	//	}
	//}
	
	var totalNumberOfColors = 16777215; // FFFFFF
	
	var instantiateArray = function(elementsCount) {
		var i = 0, resultArray = [];
		for (i = 0; i < elementsCount; i += 1) {
			resultArray[i] = 0;
		}
		return resultArray;
	}
	
	var findMin = function(r, g, b) {
		if (r < g) {
			if (r < b) return r;
		} else {
			if (g < b) return g;
		}
		return b;
	}
	
	var findMax = function(r, g, b) {
		if (r > g) {
			if (r > b) return r;
		} else {
			if (g > b) return g;
		}
		return b;
	}
	
	
	
	var publ = {
		calculateColorNumber: function(red, green, blue) {
			return (red*256*256 + green*256 + blue);
		},
		hsl2rgb: function(hslObject) {
			var H = hslObject.H / 360,
			S = hslObject.S / 100,
			L = hslObject.L / 100,
			red, green, blue, _1, _2;

			function Hue_2_RGB(v1, v2, vH) {
				if (vH < 0) vH += 1;
				if (vH > 1) vH -= 1;
				if ((6 * vH) < 1) return v1 + (v2 - v1) * 6 * vH;
				if ((2 * vH) < 1) return v2;
				if ((3 * vH) < 2) return v1 + (v2 - v1) * ((2 / 3) - vH) * 6;
				return v1;
			}

			if (S == 0) { // HSL from 0 to 1
				red = L * 255;
				green = L * 255;
				blue = L * 255;
			} else {
				if (L < 0.5) {
				  _2 = L * (1 + S);
				} else {
				  _2 = (L + S) - (S * L);
				}
				_1 = 2 * L - _2;

				red = Math.round(255 * Hue_2_RGB(_1, _2, H + (1 / 3)));
				green = Math.round(255 * Hue_2_RGB(_1, _2, H));
				blue = Math.round(255 * Hue_2_RGB(_1, _2, H - (1 / 3)));
			}

			return { R: red, G: green, B: blue};
		},
//		rgb2hsl: function (rgbObject) {
//			var min = findMin(rgbObject), max = findMax(rgbObject);
//			var hue = 0, saturation = 0, luminace = (min + max) / 2;
//			if (min != max) {
//				if (L/255 < 0.5) {
//					
//				}
//			}
//			return {H: hue, S: saturation, L: luminace};
//		},
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
		colorSectionLength: function(sections) {
			var i = 0;
			if (sections % 3 != 0 && sections / 3 > 8) {
				return false;
			}
			var sectionsPerColor = Math.pow(2, sections / 3),
			sectionLength = 256 / sectionsPerColor;
			return Math.round(sectionLength);
		},
		requantify: function(sections, oldColor) {
			var sectionLength = this.colorSectionLength(sections), 
			previousColorSection = 0, requantifiedColor = [], i = 0, requantifiedIngredient = 0;
			for(i = 0; i < 3; i += 1) {
				previousColorSection = Math.floor(oldColor[i]/sectionLength);
				requantifiedIngredient = previousColorSection*sectionLength + Math.round(sectionLength/2);
				requantifiedColor.push(requantifiedIngredient);
			}
			return requantifiedColor;
		},
		calculateHistogram: function(matrix, colorResolution) {
			var i = 0, k = 0, sectionBorders = this.colorSectionLength(colorResolution);
			var calculatedColor = 0, histogram = instantiateArray(sectionBorders.length + 1);
			for (i = 0; i < matrix.length; i += 3) {
				for (k = 0; k < sectionBorders.length; k += 1) {
					if (sectionBorders[k] > calculatedColor) {
						histogram[k] += 1;
						break;
					}
				}
			}
			return histogram;
		}
	};
	return publ;
};