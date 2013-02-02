function imageProcessing() {
    "use strict";
    var totalNumberOfColors = 16777215,
        /**
        *     
        */
        instantiateArray = function (elementsCount) {
            var i = 0, resultArray = [];
            for (i = 0; i < elementsCount; i += 1) {
                resultArray[i] = 0;
            }
            return resultArray;
        },
        /**
        *  Used in calculating RGB to HSL
        *  return the min of three integers.
        */
        findMin = function (r, g, b) {
            if (r < g) {
                if (r < b) { return r; }
            } else {
                if (g < b) { return g; }
            }
            return b;
        },
        /**
        *  Used in calculating RGB to HSV
        *  return the max of three integers.
        */
        findMax = function (r, g, b) {
            if (r > g) {
                if (r > b) { return r; }
            } else {
                if (g > b) { return g; }
            }
            return b;
        },
        publ = {
            /**
            *  returns the decimal equivalent of the hexadecimal number of the 
            *  color.
            */
            calculateColorNumber: function (red, green, blue) {
                return (red * 256 * 256 + green * 256 + blue);
            },
            /**
            *  converts HSL to RGB
            *  @param hslObject object with three properties: 
            *  hue - integer from 0 to 360;
            *  saturation - integer from 0 to 100;
            *  lightness - integer from 0 to 100.
            *  @returns - an object with properties 
            *  R - red - integer from 0 to 255, 
            *  G - green - integer from 0 to 255, 
            *  B - blue - integer from 0 to 255
            */
            hsl2rgb: function (hslObject) {
                var H = hslObject.H / 360,
                    S = hslObject.S / 100,
                    L = hslObject.L / 100,
                    red,
                    green,
                    blue,
                    temp_1,
                    temp_2;

                function hue_2_RGB(v1, v2, vH) {
                    if (vH < 0) { vH += 1; }
                    if (vH > 1) { vH -= 1; }
                    if ((6 * vH) < 1) { return v1 + (v2 - v1) * 6 * vH; }
                    if ((2 * vH) < 1) { return v2; }
                    if ((3 * vH) < 2) {
                        return v1 + (v2 - v1) * ((2 / 3) - vH) * 6;
                    }
                    return v1;
                }

                if (S === 0) { // HSL from 0 to 1
                    red = L * 255;
                    green = L * 255;
                    blue = L * 255;
                } else {
                    if (L < 0.5) {
                        temp_2 = L * (1 + S);
                    } else {
                        temp_2 = (L + S) - (S * L);
                    }
                    temp_1 = 2 * L - temp_2;

                    red = Math.round(
                        255 * hue_2_RGB(temp_1, temp_2, H + (1 / 3))
                    );
                    green = Math.round(255 * hue_2_RGB(temp_1, temp_2, H));
                    blue = Math.round(255 * hue_2_RGB(temp_1, temp_2, H - (1 / 3)));
                }

                return { R: red, G: green, B: blue};
            },
//        rgb2hsl: function (rgbObject) {
//            var min = findMin(rgbObject), max = findMax(rgbObject);
//            var hue = 0, saturation = 0, luminace = (min + max) / 2;
//            if (min != max) {
//                if (L/255 < 0.5) {
//                    
//                }
//            }
//            return {H: hue, S: saturation, L: luminace};
//        },
            /**
            *  Takes the canvas image data and extracts the color info, 
            *  leaving the opacity away.
            *  @param canvas - the HTML5 canvas element.
            */
            extractColorMatrix: function (canvas) {
                var imagedata, i = 0, cmIndex = 0, pixels, colorMatrix,
                    context = canvas.getContext('2d');
                imagedata = context.getImageData(0, 0, canvas.width, canvas.height);
                colorMatrix = [];
                pixels = imagedata.data;
                for (i = 0; i < pixels.length; i += 4) {
                    colorMatrix[cmIndex] = pixels[i];
                    colorMatrix[cmIndex + 1] = pixels[i + 1];
                    colorMatrix[cmIndex + 2] = pixels[i + 2];
                    cmIndex += 3;
                }
                return colorMatrix;
            },
            /**
            * Calculates the length of a color section by the number of bits
            * @param bits - number of bits for all 3 color ingredients.
            * @returns integer with the section length or FALSE if the number of 
            * bits cannot be divided to 3
            */
            colorSectionLength: function (bits) {
                var bitsPerColor = 0, sectionLength = 0;
                if (bits % 3 !== 0 && bits / 3 > 8) {
                    return false;
                }
                bitsPerColor = Math.pow(2, bits / 3);
                sectionLength = 256 / bitsPerColor;
                return Math.round(sectionLength);
            },
            /**
            * Maps the color ingredients values of the real 24-bit color to 
            * central values of a color cluster.
            * @param bits - pow(2, bits) gives the number of 
            * possible values of the new color.
            * @param original - the original color; a 3 item array.
            * @returns color code near to original
            * but equal for a certain amount of colors.
            */
            requantify: function (bits, original) {
                var sectionLength = this.colorSectionLength(bits),
                    previousColorSection = 0,
                    requantifiedColor = [],
                    i = 0,
                    requantifiedIngredient = 0,
                    ingrSection = 0,
                    sectionPosition = Math.round(sectionLength / 2);
                for (i = 0; i < 3; i += 1) {
                    previousColorSection = Math.floor(original[i] / sectionLength);
                    ingrSection = previousColorSection * sectionLength;
                    requantifiedIngredient = ingrSection + sectionPosition;
                    requantifiedColor.push(requantifiedIngredient);
                }
                return requantifiedColor;
            },
            requantifyImage: function (bits, canvas) {
                var matrix = this.extractColorMatrix(canvas),
                    i,
                    matrixLength = matrix.length,
                    originalColor,
                    requantifiedMatrix = [];
                for (i = 0; i < matrixLength; i += 3) {
                    originalColor = [matrix[i], matrix[i + 1], matrix[i + 2]];
                    requantifiedMatrix.push(this.requantify(bits, originalColor));
                }
                return requantifiedMatrix;
            },
            /**
            * Counts the number of occurances for every color in a canvas image.
            * @param canvas - the canvas from where the image is extracted.
            * @param colorCount - the number of colors in the palette for which 
            * the histogram will be calculated.
            * @return a jsStructures.Map object containing all colors as keys 
            * and their occurances as values.
            */
            calculateHistogram: function (canvas, colorCount) {
                var i = 0,
                    colorResolution = Math.round(
                        Math.log(colorCount) / Math.log(2)
                    ),
                    sectionBorders = this.colorSectionLength(colorResolution),
                    calculatedColor = 0,
                    requantified = this.requantifyImage(colorResolution, canvas),
                    reqLength = requantified.length,
                    histogram = new Hashtable(),
                    colorHits = 0;
                for (i = 0; i < reqLength; i += 1) {
                    if (histogram.containsKey(requantified[i])) {
                        colorHits = histogram.get(requantified[i]) + 1;
                        histogram.put(requantified[i], colorHits);
                    } else {
                        histogram.put(requantified[i], 1);
                    }
                }
                return histogram;
            }
        };
    return publ;
}