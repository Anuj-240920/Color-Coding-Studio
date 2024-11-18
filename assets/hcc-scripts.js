/* Initialize Components */
$(document).ready(function () {

    $('#dismiss, .overlay').on('click', function () {
        $('#sidebar').removeClass('active');
        $('.overlay').removeClass('active');
    });

	$(window).resize(function() {
		if ($(this).width() >= 728) {
			let sidebar = document.querySelector("#sidebar");
			sidebar.classList.remove('active');
			$('.overlay').removeClass('active');

            // let header = document.querySelector("#header");
		}
	});

    $('#sidebarCollapse').on('click', function () {
        $('#sidebar').addClass('active');
        $('.overlay').addClass('active');
        $('.collapse.in').toggleClass('in');
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
    });
});

// helper: check if hex value is a color
function isColor(hex) {
	return (/^#[0-9A-F]{6}$/i.test("#"+hex));
}

function alterColorView(hex, name)
{
	$(".side-hex").text(hex);
	let currentColor = tinycolor(hex);
	$(".side-rgb").text(currentColor.toRgbString());
	$(".side-hsl").text(currentColor.toHslString());
	$(".side-hsv").text(currentColor.toHsvString());
	$(".side-name").text((currentColor.toName()) ? currentColor.toName() : "");
	
	if ($(".side-name").is(":empty") && name !== "") {
	    $(".side-name").text(name);
	}
	
	$("#color-view-header").css("border-bottom-color", hex);
	$("#color-view-icon").css("color", hex);
	$("#color-view-example").css("background-color", hex);

}

// on load	
$(function() {
    // highlight active menus
    let url = window.location;
    let el = $('a.nav-link').filter(function() {
        return this.href == url;
    }).parent().addClass("active");
});

/* color picking components */
$(function() {

    let parentMain = document.querySelector('#main-color');
	if (parentMain) {
        let randomColor = tinycolor.random();
		/* Non-popup picker */
		let picker = new Picker({
			parent: parentMain,
			popup: false,
			alpha: false,
			editor: false,
			color: '#' + randomColor.toHex(),
			onChange: function (color) {
				let currentColor = tinycolor(color.hex);
				document.getElementById('color-example').style.backgroundColor = color.rgbaString;
				$("#color-example").data("hex", color.hex.substring(0, 7));
				document.getElementById('color-example-hex').value = color.hex.substring(0, 7);
				document.getElementById('color-example-rgb').innerHTML = color.rgbString;
				document.getElementById('color-example-hsl').innerHTML = color.hslString;
			},
		});

		$("#color-example-hex").keyup(function(){
			if (/^#[0-9A-F]{6}$/i.test($(this).val())) {
				picker.setColor($(this).val());
				alterColorView($(this).val());
			}
		});

	}

	function colorChange(color) {
		var tiny = tinycolor(color);
		var ret = tiny.toHex();
		return ret;
	}
	
	$("#color-search-submit").bind("click", function() {
		window.location = "/hex/" + colorChange($("#color-search").val());
	});

	$('#color-search').keypress(function(e) {
	    if (e.which == '13') {
	    	window.location = "/hex/" + colorChange($("#color-search").val());
	    }

		if (/^#[0-9A-F]{6}$/i.test($(this).val())) {

		}
	});

	// helper: check if color is light
	function isTooLight(hexcolor){
		  var r = parseInt(hexcolor.substr(0,2),16);
		  var g = parseInt(hexcolor.substr(2,2),16);
		  var b = parseInt(hexcolor.substr(4,2),16);
		  var yiq = ((r*299)+(g*587)+(b*114))/1000;
		  return yiq >= 128;
	 }
});