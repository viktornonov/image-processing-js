module("Calculating histogram.", {
  setup: function() {
    var canvas, ctx, dw = 20, dh = 20;
	if ($("#canvas").length > 1) {
		$("#canvas").remove();
	} else if ($("#canvas").length === 1) {
		canvas = $("#canvas").get(0);
	} else {
		canvas = document.createElement("canvas"), greenPixelCount = 20*20, redPixelCount = 0, bluePixelCount = 0;
	}
	$(canvas).attr('id', 'canvas');
	ok(canvas, "canvas is present");
	ok(!!canvas.getContext, "canvas supports 2d context");
	if ($("#canvas").length == 0) {
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
    ok( true, "and one extra assert after each test" );
  }
});
test("Extracts colours from canvas", function () {
	var matrix = imageProcessing().extractColorMatrix(canvas);
	notEqual(matrix.length, 0, "A matrix is returned");
	equal((matrix.length % 3), 0, "The matrix is well formed");
	equal(matrix[0], 0, 'Actual value equals expected');
	equal(matrix[1], 255, 'Actual value equals expected');
	equal(matrix[2], 0, 'Actual value equals expected');
	
	equal(matrix[3], 0, 'Actual value equals expected');
	equal(matrix[4], 255, 'Actual value equals expected');
	equal(matrix[5], 0, 'Actual value equals expected');
	
	equal(matrix[matrix.length-3], 0, 'Actual value equals expected');
	equal(matrix[matrix.length-2], 255, 'Actual value equals expected');
	equal(matrix[matrix.length-1], 0, 'Actual value equals expected');
});
test("Calculate color borders", function() {
	var sections = 3, allColorCount = 16777215;
	var colorBorders = imageProcessing().calculateColorBorders(sections);
	equal(colorBorders[0], allColorCount/3, "First third calculated fine.");
	equal(colorBorders[1], (allColorCount/3)*2, "Second third calculated fine.");
});

test("Injects colors", function() {
	var green = [0, 255, 0], blue = [0, 0, 255];
	var greenInjected = imageProcessing().injectColor(green[0], green[1], green[2]);
	var blueInjected = imageProcessing().injectColor(blue[0], blue[1], blue[2]);
	equal(greenInjected, 255*256, "Color green is injected correctly.");
	equal(blueInjected, 255, "Color blue is injected correctly.");
});

test("Calculates histogram properly.", function() {
	var matrix = imageProcessing().extractColorMatrix(canvas);
	var colorResolution = 3, greenIndex = 1;
	var histogram = imageProcessing().calculateHistogram(matrix, colorResolution);
	equal(histogram[greenIndex], greenPixelCount, "Count of green pixel is well calculated.");
	equal(histogram[redIndex], redPixelCount, "Count of red pixel is well calculated.");
	equal(histogram[blueIndex], bluePixelCount, "Count of blue pixel is well calculated.");
});
