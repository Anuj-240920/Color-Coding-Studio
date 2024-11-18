/* Initialize Components */

/**************************************
 * JQuery Dropper
 **************************************/
(function($) {
    $.fn.dropper = function(settings) {
        var config = {};
        if (settings) $.extend(config, settings);
        $('body').append("<div id='hover-square' style='width:25px; height: 25px; border-radius: 12px; border: 1px solid #000; display:none'> </div>");
        this.each(function(i) {
            if(this.tagName !== "IMG") {
                return this;
            };
            $(this).bind('load readystatechange', function(e) {
                var w = $(this).width();
                var h = $(this).height();
                var imgElement = $(this)[0];
                var containerElement = ($(this).parent())[0];
                var canvasElement = document.createElement('canvas');
                canvasElement.id = "img-canvas";
                canvasElement.width = w;
                canvasElement.height = h;
                containerElement.insertBefore(canvasElement,imgElement);
                try {
                    var canvasContext = canvasElement.getContext('2d');

                    var x = 0;
                    var y = 0;
                    var width = w;
                    var height = h;
                    var imageObj = new Image();

                    imageObj.onload = function() {
                        canvasContext.drawImage(imageObj, x, y, width, height);
                    };
                    imageObj.src = $(this)[0].src;
                }
                catch(e) {
                    return this;
                }
                $(this).hide();
                $(canvasElement).mousemove(function(e) {

                    var pos = findPos(this);
                    var x = e.pageX - pos.x;
                    var y = e.pageY - pos.y;
                    var coord = "x=" + x + ", y=" + y;
                    var c = canvasContext;
                    var p = c.getImageData(x, y, 1, 1).data;
                    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);

                    $('#hover-square').css({
                        'background-color': hex,
                        'position': 'absolute',
                        'top': e.pageY-25,
                        'left': e.pageX+15
                    }).show();

                })
                    .mouseout(function(e){
                        $('#hover-square').hide();
                    })
                    .click(function(e){

                        var pos = findPos(this);
                        var x = e.pageX - pos.x;
                        var y = e.pageY - pos.y;
                        var coord = "x=" + x + ", y=" + y;
                        var c = canvasContext;
                        var p = c.getImageData(x, y, 1, 1).data;
                        var hex = ""+("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);

                        if ($("#chosen-color-palette > div").length >= 12) {
                            $("#chosen-color-palette > div:last").remove();
                        }

                        let tinyC = tinycolor(hex);
                        let rgb = tinyC.toRgbString();

                        let newColor = '<div class="col-xs-6 col-sm-4 col-md-4 col-lg-4 col-xl-4">' +
                            '<div class="color color-sel" style="cursor: pointer; margin-bottom: 10px; border-radius: 5px;  border: 1px solid grey;" data-hex="#'+hex+'">' +
                            '<div class="color-inner" style="padding: 4px; border-radius: 5px; border: 3px solid #'+hex+'; border-top: 26px solid #'+hex+'; text-align: center;">' +
                            '<span class="color-id"><strong>#'+hex+'</strong></span><br>' +'<span class="color-rgb"><small>'+rgb+'</small></span><br>'+
                            '</div>' +
                            '</div>' +
                            '</div>';

                        $("#chosen-color-palette").prepend(newColor);
                        alterColorView('#'+hex);

                        return false;
                    });
            });

            var src = this.src;
            this.src = '#';
            this.src = src;
            return this;
        });
        function findPos(obj) {
            var curleft = 0, curtop = 0;
            if (obj.offsetParent) {
                do {
                    curleft += obj.offsetLeft;
                    curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
                return { x: curleft, y: curtop };
            }
            return undefined;
        }
        function rgbToHex(r, g, b) {
            if (r > 255 || g > 255 || b > 255)
                throw "Invalid color component";
            return ((r << 16) | (g << 8) | b).toString(16);
        }
    };
})(jQuery);

/**************************************
 * Color from Image Functionality
 **************************************/

$(function() {

	// init
	setTimeout(function() 
	{
		if ($('#selected-image-platform').length > 0) {
			selectImage();
		}
	}, 1000);

    let dropAreaElement = document.getElementById("image-drop-area");
    if (dropAreaElement) {
        dropAreaElement.addEventListener("dragover", change, false);
        dropAreaElement.addEventListener("dragleave", change_back, false);
        dropAreaElement.addEventListener("drop", change_back, false);

        function change() {
            dropAreaElement.style.backgroundColor = '#5f9ea0';
        };

        function change_back() {
            dropAreaElement.style.backgroundColor = 'transparent';
        };
    }

	function selectImage()
	{
    	getPaletteColors();
    	$('#selected-image').dropper();
	}
	
	function selectFirstImage()
	{
    	setTimeout(function() {
    		$('#dragged-images img.added-image:first').click();
    	}, 1000);
	}
	
	// browser
    $('#browseFile').click(function() {
        $(this).next('input[type="file"]').trigger('click');
        
        $('.added-image').click();
        return false;
    });

    $('#image-drop-area').click(function() {
        $('#browseFile').click();
    });
    
    $('#input-image-url').change(function() {
    	
    	if ($(this).val().match(/\.(jpeg|jpg|gif|png)$/) == null) {
    		return false;
    	}
    	
    	if ( ! $(this).val().match("(http|ftp|https)://[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?")) {
    		alert("here");
    		return false;
    	}
    	
    	$('#dragged-images').prepend($('<img width="80" class="added-image" src="'+$(this).val()+'" />'));
        return false;
    });
    
    $('body').on('click', '.added-image', function() {
    	
    	if ($(this).attr('src') != $('#selected-image').attr('src'))
    	{
    		$('#no-images-info').hide();
	    	$('#selected-image-platform').html("");
	    	$('#selected-image-platform').prepend($('<img id="selected-image" src="'+$(this).attr('src')+'" />'));
	    	getPaletteColors();
	    	$('#selected-image').dropper({});
		}
    });
    
    function getPaletteColors()
    {
    	setTimeout(function() 
        {
            var colorThief = new ColorThief();
            var sourceImg = document.getElementById('selected-image');
            var color = colorThief.getColor(sourceImg);
            var selectedPalette = colorThief.getPalette(sourceImg, 5);

            $("#common-color-palette").html("");
            for (let i = 0; i < selectedPalette.length; i++) {
                selectedPalette[i] = rgbToHex(selectedPalette[i][0],selectedPalette[i][1],selectedPalette[i][2]);
            }

            let randomColorHex = selectedPalette[Math.floor(Math.random() * selectedPalette.length)];
            alterColorView("#"+randomColorHex);

            // add dominant color
            hexColor = rgbToHex(color[0], color[1], color[2]);
            selectedPalette.unshift(hexColor);

            $.each(selectedPalette, function(i) {

                let tinyC = tinycolor(selectedPalette[i]);
                let rgb = tinyC.toRgbString();

                let newColor = '<div class="col-xs-6 col-sm-4 col-md-4 col-lg-4 col-xl-4">' +
                    '<div class="color color-sel" style="cursor: pointer; margin-bottom: 10px; border-radius: 5px;  border: 1px solid grey;" data-hex="#'+selectedPalette[i]+'">' +
                    '<div class="color-inner" style="padding: 4px; border-radius: 5px; border: 3px solid #'+selectedPalette[i]+'; border-top: 26px solid #'+selectedPalette[i]+'; text-align: center;">' +
                    '<span class="color-id"><strong>#'+selectedPalette[i]+'</strong></span><br>' +'<span class="color-rgb"><small>'+rgb+'</small></span><br>'+
                    '</div>' +
                    '</div>' +
                    '</div>';

                $("#common-color-palette").append(newColor);
            });
            return false;
        }, 200);
    }
    
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return ""+componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function readURL(input) {
        if (input.files && input.files[0]) {

        	var file = input.files[0];
            var imageType = /image.*/;

            if (file.type.match(imageType)) {

                var reader = new FileReader();

                if ($('#dragged-images > img').length >= 2) {
                    $('#dragged-images > img:last').remove();
                }

                var $draggedImages = $('#dragged-images');

                reader.onload = function (e) {
                     $draggedImages.prepend($('<img width="80" class="added-image" src="'+e.target.result+'" />'));
                }

                reader.readAsDataURL(input.files[0]);
                selectFirstImage();
            }
        }
    }

    $("#upload-document-image").change(function(){
        readURL(this);
    });
    
	// if first image, add it
    $('#image-drop-area').show();
    var $dropZone = $('#image-drop-area');
    var handleDragEnter = function(event){
      return false;
    };
    var handleDragLeave = function(event){
      return false;
    };
    var handleDragOver = function(event){
      return false;
    };
    var handleDrop = function(event){
      handleFiles(event.originalEvent.dataTransfer.files);
      return false;
    };
    $dropZone
      .on('dragenter', handleDragEnter)
      .on('dragleave', handleDragLeave)
      .on('dragover', handleDragOver)
      .on('drop', handleDrop);
  
	
    function handleFiles(files) {
        var $draggedImages = $('#dragged-images');
        var imageType      = /image.*/;
        var fileCount      = files.length;

        for (var i = 0; i < fileCount; i++) {
          var file = files[i];

          if (file.type.match(imageType)) {
            var reader = new FileReader();
            reader.onload = function(event) {
                imageInfo = { images: [
                    {'class': 'dropped-image', file: event.target.result}
                  ]};

                if ($('#dragged-images > img').length >= 2) {
                    $('#dragged-images > img:last').remove();
                }

                $draggedImages.prepend($('<img width="130" class="added-image" src="'+event.target.result+'" />'));

                var $imageSection = $draggedImages.find('.image-section').first();
                var $image        = $('.dropped-image .target-image');

                // Must wait for image to load in DOM, not just load from FileReader
                $image.on('load', function() {
                  showColorsForImage($image, $imageSection);
                });
              };
            reader.readAsDataURL(file);

            selectFirstImage();
          } else {
            alert('File must be a supported image type.');
          }
        }
    }
});