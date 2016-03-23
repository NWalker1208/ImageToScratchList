var _validFileExtensions = [".jpg", ".jpeg", ".bmp", ".gif", ".png"];    
function Validate(file) {
	var sFileName = file.value.substr(file.value.lastIndexOf('\\') + 1);
	if (sFileName.length > 0) {
		var blnValid = false;
		for (var j = 0; j < _validFileExtensions.length; j++) {
			var sCurExtension = _validFileExtensions[j];
			if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
				blnValid = true;
				break;
			}
		}
		
		if (!blnValid) {
			alert("Sorry, " + sFileName + " is an invalid image, allowed file types are: " + _validFileExtensions.join(", "));
			return false;
		}
	}
  
    return true;
}

var Width;
var Height;

function pick(evt) {
	if (Validate(evt)) {
		var tgt = evt.target || window.event.srcElement,
			files = tgt.files;

		// FileReader support
		if (FileReader && files && files.length) {
			var fr = new FileReader();
			fr.onload = function () {
				var image = document.getElementById('image');
				image.src = fr.result;
				Width = image.width;
				Height = image.height;
				if (Math.max(Width, Height) > 300) {
					var scale = 300 / Math.max(Width, Height);
					image.width *= scale;
				}
			}
			fr.readAsDataURL(files[0]);
		} else {
			// fallback -- perhaps submit the input to an iframe and temporarily store
			// them on the server until the user's session ends.
		}
	} else {
		evt.value = "";
		document.getElementById('image').src = '';
		/*document.getElementById('progress').value = 0;*/
	}
}

function copyToClipboard(text) {
	window.prompt("Copy to clipboard: Ctrl+C, Enter", text);
}

function argbToRGB(r,g,b) {
    return /*('0' + a.toString(16)).substr(-2) + */('0' + r.toString(16)).substr(-2) + ('0' + g.toString(16)).substr(-2) + ('0' + b.toString(16)).substr(-2);
}

function download(filename, text) {
	var element = document.createElement('a');
	if (!encodeURIComponent) {
		console.log('No download capability!');
		window.alert('Sorry, we are unable to download the text file to your computer');
		return false;
	}
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	element.setAttribute('download', filename);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

function imgToColor(image) {
	if (image.src != '' && image.width > 0) {
		/*var progress = document.getElementById('progress');
		progress.value = 0;*/
		
		image.crossOrigin = "Anonymous";
		var canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;
		
		ctx = canvas.getContext('2d')
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0,0, image.width,image.height)
		ctx.drawImage(image, 0, 0, Width, Height, 0, 0, image.width, image.height);
		
		var pixelData = ctx.getImageData(0, 0, image.width, image.height).data;
		var pixels = [];
		
		console.log('Getting pixels...');
		/*progress.max = pixelData.length/4;*/
		for (var i = 0; i < pixelData.length; i += 4) {
			pixels.push(argbToRGB(/*pixelData[i+3], */pixelData[i], pixelData[i+1], pixelData[i+2]));
			/*progress.value++;*/
		}
		
		var pixStr;
		
		if (pixels.length > 2000) {
			pixStr = image.width.toString() + "\n" + pixels.join('\n');
			
			window.alert('This image is too big to use the clipboard. Please select a location to save a text file instead.');
			
			console.log('Preparing download...');
			download('image.txt', pixStr);
		} else {
			pixStr = image.width.toString() + ';' + pixels.join('');
			
			copyToClipboard(pixStr);
		}
	} else {
		window.alert('Please select an image.');
	}
}

