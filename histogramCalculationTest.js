var imageProcessing = imageProcessing();
module("testing HSL to RGB and RGB to HSL");
test("Transform HSL to RGB format", function() {
	var redBlueBorderH = 300;
	var redBlueBorderS = 100;
	var redBlueBorderL = 50;
	var magendaResult = imageProcessing.hsl2rgb({ H: redBlueBorderH, S: redBlueBorderS, L: redBlueBorderL});
	QUnit.close(magendaResult.R, 255, 1, " Magenta: Red color converted fine.");
	QUnit.close(magendaResult.G, 0, 1, "Magenta: Green color converted fine.");
	QUnit.close(magendaResult.B, 255, 1, "Magenta: Blue color converted fine.");
	var whiteResult = imageProcessing.hsl2rgb({ H: redBlueBorderH, S: redBlueBorderS, L: 100});
	QUnit.close(whiteResult.R, 255, 1, "White: Red color converted fine.");
	QUnit.close(whiteResult.G, 255, 1, "White: Green color converted fine.");
	QUnit.close(whiteResult.B, 255, 1, "White: Blue color converted fine.");
	var randomColorResult = imageProcessing.hsl2rgb({H: 303, S: 80, L: 35});
	QUnit.close(randomColorResult.R, 160, 1, "Random Color: Red color converted fine.");
	QUnit.close(randomColorResult.G, 18, 1, "Random Color: Green color converted fine.");
	QUnit.close(randomColorResult.B, 153, 1, "Random Color: Blue color converted fine.");
	var randomColorResult2 = imageProcessing.hsl2rgb({H: 112, S: 80, L: 37});
	QUnit.close(randomColorResult2.R, 39, 1, "Random Color 2: Red color converted fine.");
	QUnit.close(randomColorResult2.G, 170, 1, "Random Color 2: Green color converted fine.");
	QUnit.close(randomColorResult2.B, 19, 1, "Random Color 2: Blue color converted fine.");
});
//test("Transform RGB to HSL fromat", function() {
//	var 
//});
module("testing RgbColor methods");
test("Test equality of two objects", function () {
    
    var imgProc = imageProcessing,
        first = new imgProc.RgbColor(1,2,3),
        second = new imgProc.RgbColor(1,2,3),
        third = new imgProc.RgbColor(4,2,3),
        fourth;
    ok(first.equals(second), "Equal objects are well decided.");
    ok(!first.equals(third), "Unequal objects are well decided.");
    ok(!first.equals(fourth), "Undefined is filtered out.");
    ok(!first.equals(window), "Different types of objects are not equal.");
});
module("Requantifying the image", {
	setup: function() {
		
	}, teardown: function() {
		
	}
});
test("Calculate color section's length", function() {
	var colorSectionLength = imageProcessing.colorSectionLength(3);
	QUnit.close(colorSectionLength, 128, 1, "Color Section is well calculated.");
	colorSectionLength = imageProcessing.colorSectionLength(6);
	QUnit.close(colorSectionLength, 64, 1, "Color Section is well calculated.");
	colorSectionLength = imageProcessing.colorSectionLength(9);
	QUnit.close(colorSectionLength, 32, 1, "Color Section is well calculated.");
	colorSectionLength = imageProcessing.colorSectionLength(12);
	QUnit.close(colorSectionLength, 16, 1, "Color Section is well calculated.");
});
test("Injects colors", function() {
	var green = [0, 255, 0], blue = [0, 0, 255];
	var greenCalculated = imageProcessing.calculateColorNumber(green[0], green[1], green[2]);
	var blueCalculated = imageProcessing.calculateColorNumber(blue[0], blue[1], blue[2]);
	equal(greenCalculated, 255*256, "Color green is Calculated correctly.");
	equal(blueCalculated, 255, "Color blue is Calculated correctly.");
});

test("Requantifies the colors", function() {
	var strangeGreen = [0, 107, 87], strangeBlue = [0, 33, 128], strangeRed = [211, 127, 0];
	var requantifiedGreen = imageProcessing.requantify(3, strangeGreen),
	requantifiedBlue = imageProcessing.requantify(3, strangeBlue),
	requantifiedRed = imageProcessing.requantify(3, strangeRed);
	
	equal(requantifiedGreen[0], 64, "First Color: Red is requantified well with 3 bits");
	equal(requantifiedGreen[1], 64, "First Color: Green is requantified well with 3 bits");
	equal(requantifiedGreen[2], 64, "First Color: Blue is requantified well with 3 bits");
	equal(requantifiedBlue[0], 64, "Second Color: Red is requantified well with 3 bits");
	equal(requantifiedBlue[1], 64, "Second Color: Green is requantified well with 3 bits");
	equal(requantifiedBlue[2], 192, "Second Color: Blue is requantified well with 3 bits");
	equal(requantifiedRed[0], 192, "Third Color: Red is requantified well with 3 bits");
	equal(requantifiedRed[1], 64, "Third Color: Green is requantified well with 3 bits");
	equal(requantifiedRed[2], 64, "Third Color: Blue is requantified well with 3 bits");
	
	requantifiedGreen = imageProcessing.requantify(6, strangeGreen),
	requantifiedBlue = imageProcessing.requantify(6, strangeBlue),
	requantifiedRed = imageProcessing.requantify(6, strangeRed);
		
	equal(requantifiedGreen[0], 32, "First Color: Red is requantified well with 6 bits");
	equal(requantifiedGreen[1], 96, "First Color: Green is requantified well with 6 bits");
	equal(requantifiedGreen[2], 96, "First Color: Blue is requantified well with 6 bits");
	equal(requantifiedBlue[0], 32, "Second Color: Red is requantified well with 6 bits");
	equal(requantifiedBlue[1], 32, "Second Color: Green is requantified well with 6 bits");
	equal(requantifiedBlue[2], 160, "Second Color: Blue is requantified well with 6 bits");
	equal(requantifiedRed[0], 224, "Third Color: Red is requantified well with 6 bits");
	equal(requantifiedRed[1], 96, "Third Color: Green is requantified well with 6 bits");
	equal(requantifiedRed[2], 32, "Third Color: Blue is requantified well with 6 bits");
});
module("Calculating histogram.", {
  setup: function() {
    var canvas, ctx, dw = 20, dh = 20,
	greenPixelCount = 20*20, redPixelCount = 0, bluePixelCount = 0
	if ($("#canvas").length > 1) {
		$("#canvas").remove();
	} else if ($("#canvas").length === 1) {
		canvas = $("#canvas").get(0);
	} else {
		canvas = document.createElement("canvas");
	}
	$(canvas).attr('id', 'canvas');
	ok(canvas, "canvas is present");
	ok(!!canvas.getContext, "canvas supports 2d context");
	if ($("#canvas").length === 0) {
		$("body").append(canvas);
	}
	canvas.height=dh;
	canvas.width=dw;
	ctx = canvas.getContext('2d');
	ok(!!ctx.fillStyle, "Context has fillStyle property.");
	ctx.fillStyle="#00FF00";
	ok(!!ctx.fill, "Context has fill method.");
	ctx.fill();
	ok(!!ctx.fillRect, 'Context supports Filling rectangle');
	ctx.fillRect(0, 0, dw, dh);
	ok(!!ctx.getImageData, 'Context has getImageData() method');
  }, teardown: function() {
	$("#canvas").remove();
    ok( true, "and one extra assert after each test" );
  }
});
test("Extracts colours from canvas", function () {
	var matrix = imageProcessing.extractColorMatrix(canvas);
	notEqual(matrix.length, 0, "A matrix is returned");
    var firstElem = matrix[0],
        secondElem = matrix[1],
        lastElem = matrix[matrix.length-1];
	equal(firstElem.red, 0, 'Actual value equals expected');
	equal(firstElem.green, 255, 'Actual value equals expected');
	equal(firstElem.blue, 0, 'Actual value equals expected');
	
	equal(secondElem.red, 0, 'Actual value equals expected');
	equal(secondElem.green, 255, 'Actual value equals expected');
	equal(secondElem.blue, 0, 'Actual value equals expected');
	
	equal(lastElem.red, 0, 'Actual value equals expected');
	equal(lastElem.green, 255, 'Actual value equals expected');
	equal(lastElem.blue, 0, 'Actual value equals expected');
});
test("Calculates histogram properly.", function() {
	var histogram = imageProcessing.calculateHistogram(canvas, 8),
        keys = histogram.keys(),
        values = histogram.values();
	equal(keys.length, 1, "There's appropriate number of colors in the calculated histogram.");
	equal(keys[0], [64, 192, 64], "There's appropriate number of colors in the calculated histogram.");
    equal(histogram.values()[0], greenPixelCount, "Appropriate number of green pixels was calculated.");
});
