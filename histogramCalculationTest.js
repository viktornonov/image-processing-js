module( "module", {
  setup: function() {
    var ctx, dw = 20, dh = 20, canvas = document.createElement("canvas");
	$(canvas).attr('id', 'canvas');
	ok(canvas, "canvas is present");
	ok(!!canvas.getContext, "canvas supports 2d context");
	$("body").append(canvas);
	
	
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