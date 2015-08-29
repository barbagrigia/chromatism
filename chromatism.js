function negMod( n, m ) {
	return ((n % m) + m) % m;
}

//////////////////////
// Module Functions //
//////////////////////

function convert( from, to, value ) {
	switch (from){
		case "hex":
			return fromHex( to, value );
			break;
		case "rgb":
			return fromRgb( to, value );
			break;
		case "css-rgb":
			return fromCssRgb( to, value );
			break;
		case "hsl":
			return fromHsl( to, value );
			break;
		case "css-hsl":
			return fromCssHsl( to, value );
			break;
	}
}

function adjacent( mode, deg, amount, colourRef ) {
	var colours = [colourRef];
	if (mode != "hsl") {
		colour = convert( mode, "hsl", colourRef );
	} else {
		colour = {h:colourRef.h, s:colourRef.s, l:colourRef.l};
	}
	for(i=0;i<(amount-2);i++) {
		colour.h = (colour.h + deg) % 360;
		if (mode != "hsl") {
			tempColour = convert( "hsl", mode, colour );
			colours.push(tempColour);
		} else {
			colours.push(colour);
		}
	}
	return colours;
}

function shade( mode, shift, colourRef ) {
	if (mode != "hsl") {
		colour = convert( mode, "hsl", colourRef );
	} else {
		colour = {h:colourRef.h, s:colourRef.s, l:colourRef.l};
	}
	colour.l = colour.l + shift;
	if (colour.l < 0) {
		colour.l = 0;
	} else if (colour.l > 100) {
		colour.l = 100;
	}
	if (mode != "hsl") {
		colour = convert( "hsl", mode, colour );
	}
	return colour;
}

function saturation( mode, shift, colourRef ) {
	if (mode != "hsl") {
		colour = convert( mode, "hsl", colourRef );
	} else {
		colour = {h:colourRef.h, s:colourRef.s, l:colourRef.l};
	}
	colour.s = colour.s + shift;
	if (colour.s < 0) {
		colour.s = 0;
	} else if (colour.s > 100) {
		colour.s = 100;
	}
	if (mode != "hsl") {
		colour = convert( "hsl", mode, colour );
	}
	return colour;
}

function complementary( mode, colourRef ) {
	if (mode != "hsl") {
		colour = convert( mode, "hsl", colourRef );
	} else {
		colour = {h:colourRef.h, s:colourRef.s, l:colourRef.l};
	}
	colour.h = (colour.h + 180) % 360;
	if (mode != "hsl") {
		colour = convert( "hsl", mode, colour );
	}
	return colour;
}

function triad( mode, colourRef ) {
	var colours = [colourRef];
	if (mode != "hsl") {
		colour = convert( mode, "hsl", colourRef );
	} else {
		colour = {h:colourRef.h, s:colourRef.s, l:colourRef.l};
	}
	for(i=0;i<2;i++) {
		colour.h = (colour.h + 120) % 360;
		if (mode != "hsl") {
			tempColour = convert( "hsl", mode, colour );
			colours.push(tempColour);
		} else {
			colours.push(colour);
		}
	}
	return colours;
}

function tetrad( mode, colourRef ) {
	var colours = [colourRef];
	if (mode != "hsl") {
		colour = convert( mode, "hsl", colourRef );
	} else {
		colour = {h:colourRef.h, s:colourRef.s, l:colourRef.l};
	}
	for(i=0;i<3;i++) {
		colour.h = (colour.h + 90) % 360;
		if (mode != "hsl") {
			tempColour = convert( "hsl", mode, colour );
			colours.push(tempColour);
		} else {
			colours.push(colour);
		}
	}
	return colours;
}

function invert( mode, colourRef ) {
	if (mode != "rgb") {
		colour = convert( mode, "rgb", colourRef );
	} else {
		colour = {r:colourRef.r, g:colourRef.g, b:colourRef.b};
	}
	colour.r = negMod((255 - colour.r), 255);
	colour.g = negMod((255 - colour.g), 255);
	colour.b = negMod((255 - colour.b), 255);
	if (mode != "rgb") {
		colour = convert( "rgb", mode, colour );
	}
	return colour;
}

//////////////////////////
// Conversion Functions //
//////////////////////////

function fromHex( to, value ) {
	value = value.replace('#','').match(/.{2}/g);
	for (i=0;i<value.length;i++){
		value[i] = parseInt(value[i], 16);
	}
	switch (to){
		case "rgb":
			return {
				r: value[0],
				g: value[1],
				b: value[2]
			};
			break;
		case "css-rgb":
			return "rgb(" + Math.round(value[0]) + "," + Math.round(value[1]) + "," + Math.round(value[2]) + ")";
			break;
		case "hsl":
			var r = value[0] / 255;
			var g = value[1] / 255;
			var b = value[2] / 255;
			var rgbOrdered = [r,g,b].sort();
			var l = ((rgbOrdered[0] + rgbOrdered[2]) / 2) * 100;
			var s, h;
			if (rgbOrdered[0] == rgbOrdered[2]) {
				s = 0;
				h = 0;
			} else {
				if (l >= 50) {
					s = (rgbOrdered[2] - rgbOrdered[0])/((2.0 - rgbOrdered[2]) - rgbOrdered[0]) * 100;
				} else {
					s = (rgbOrdered[2] - rgbOrdered[0])/(rgbOrdered[2] + rgbOrdered[0]) * 100;
				}
				if (rgbOrdered[2] == r) {
					h = ((g-b)/(rgbOrdered[2] - rgbOrdered[0])) * 60;
				} else if (rgbOrdered[2] == g) {
					h = ((2+b-r)/(rgbOrdered[2] - rgbOrdered[0])) * 60;
				} else {
					h = ((4+r-g)/(rgbOrdered[2] - rgbOrdered[0])) * 60;
				}
				if (h < 0) {
					h += 360;
				} else if (h > 360) {
					h = h % 360;
				}
			};
			return {
				h: h,
				s: s,
				l: l
			};
			break;
		case "css-hsl":
			var hsl = convert("rgb", "hsl", {
				r: value[0],
				g: value[1],
				b: value[2]
			});
			return "hsl(" + Math.round(hsl.h) + "," + Math.round(hsl.s) + "%," + Math.round(hsl.l) + "%)";
			break;
	}
}

function fromRgb( to, value ) {
	switch (to){
		case "hex":
			var r = Math.round(value['r']).toString(16);
			if (r.length == 1) r = "0"+r;
			var g = Math.round(value['g']).toString(16);
			if (g.length == 1) g = "0"+g;
			var b = Math.round(value['b']).toString(16);
			if (b.length == 1) b = "0"+b;
			return "#"+r+g+b;
			break;
		case "css-rgb":
			return "rgb(" + Math.round(value['r']) + "," + Math.round(value['g']) + "," + Math.round(value['b']) + ")";
			break;
		case "hsl":
			var r = value['r'] / 255;
			var g = value['g'] / 255;
			var b = value['b'] / 255;
			var rgbOrdered = [r,g,b].sort();
			var l = ((rgbOrdered[0] + rgbOrdered[2]) / 2) * 100;
			var s, h;
			if (rgbOrdered[0] == rgbOrdered[2]) {
				s = 0;
				h = 0;
			} else {
				if (l >= 50) {
					s = ((rgbOrdered[2] - rgbOrdered[0])/((2.0 - rgbOrdered[2]) - rgbOrdered[0])) * 100;
				} else {
					s = ((rgbOrdered[2] - rgbOrdered[0])/(rgbOrdered[2] + rgbOrdered[0])) * 100;
				}
				if (rgbOrdered[2] == r) {
					h = ((g-b)/(rgbOrdered[2] - rgbOrdered[0])) * 60;
				} else if (rgbOrdered[2] == g) {
					h = (2+((b-r)/(rgbOrdered[2] - rgbOrdered[0]))) * 60;
				} else {
					h = (4+((r-g)/(rgbOrdered[2] - rgbOrdered[0]))) * 60;
				}
				if (h < 0) {
					h += 360;
				} else if (h > 360) {
					h = h % 360;
				}
			};
			return {
				h: h,
				s: s,
				l: l
			};
			break;
		case "css-hsl":
			var hsl = convert("rgb", "hsl", value);
			return "hsl(" + Math.round(hsl.h) + "," + Math.round(hsl.s) + "%," + Math.round(hsl.l) + "%)";
			break;
	}
}

function fromCssRgb( to, value ) {
	value = value.replace(/(rgb\(|\))/g,'').split(",");
	for (i=0;i<value.length;i++){
		value[i] = parseInt(value[i]);
	}
	switch (to){
		case "hex":
			var r = Math.round(value[0]).toString(16);
			if (r.length == 1) r = "0"+r;
			var g = Math.round(value[1]).toString(16);
			if (g.length == 1) g = "0"+g;
			var b = Math.round(value[2]).toString(16);
			if (b.length == 1) b = "0"+b;
			return "#"+r+g+b;
			break;
		case "rgb":
			return {
				r: value[0],
				g: value[1],
				b: value[2]
			};
			break;
		case "hsl":
			var r = value[0] / 255;
			var g = value[1] / 255;
			var b = value[2] / 255;
			var rgbOrdered = [r,g,b].sort();
			var l = ((rgbOrdered[0] + rgbOrdered[2]) / 2) * 100;
			var s, h;
			if (rgbOrdered[0] == rgbOrdered[2]) {
				s = 0;
				h = 0;
			} else {
				if (l >= 50) {
					s = ((rgbOrdered[2] - rgbOrdered[0])/(2.0 - rgbOrdered[2] - rgbOrdered[0])) * 100;
				} else {
					s = ((rgbOrdered[2] - rgbOrdered[0])/(rgbOrdered[2] + rgbOrdered[0])) * 100;
				}
				if (rgbOrdered[2] == r) {
					h = ((g-b)/(rgbOrdered[2] - rgbOrdered[0])) * 60;
				} else if (rgbOrdered[2] == g) {
					h = (2+((b-r)/(rgbOrdered[2] - rgbOrdered[0]))) * 60;
				} else {
					h = (4+((r-g)/(rgbOrdered[2] - rgbOrdered[0]))) * 60;
				}
				if (h < 0) {
					h += 360;
				} else if (h > 360) {
					h = h % 360;
				}
			};
			return {
				h: h,
				s: s,
				l: l
			};
			break;
		case "css-hsl":
			var hsl = convert("rgb", "hsl", {
				r: value[0],
				g: value[1],
				b: value[2]
			});
			return "hsl(" + Math.round(hsl.h) + "," + Math.round(hsl.s) + "%," + Math.round(hsl.l) + "%)";
			break;
	}
}

function fromHsl( to, value ) {
	switch (to){
		case "hex":
			var rgb = convert("hsl", "rgb", value);
			return convert("rgb", "hex", rgb);
			break;
		case "rgb":
			if (value.s == 0) {
				var grey = (value.l / 100) * 255;
				return {
					r: grey,
					g: grey,
					b: grey
				}
			} else {
				if (value.l >= 50) {
					tempOne = ((value.l/100) + (value.s/100)) - ((value.l/100) * (value.s/100));
				} else {
					tempOne = (value.l/100) * (1 + (value.s/100));
				}
				tempTwo = (2 * (value.l/100)) - tempOne;
				tempHue = value.h / 360;
				tempR = (tempHue + 0.333) % 1;
				tempG = tempHue;
				tempB = negMod((tempHue - 0.333), 1);
				var r,g,b;
				if ((6 * tempR) < 1) {
					r = tempTwo + ((tempOne - tempTwo) * 6 * tempR);
				} else if ((2 * tempR) < 1) {
					r = tempOne;
				} else if ((3 * tempR) < 2) {
					r = tempTwo + ((tempOne - tempTwo) * ((0.666 - tempR) * 6));
				} else {
					r = tempTwo;
				}
				if ((6 * tempG) < 1) {
					g = tempTwo + ((tempOne - tempTwo) * 6 * tempG);
				} else if ((2 * tempG) < 1) {
					g = tempOne;
				} else if ((3 * tempG) < 2) {
					g = tempTwo + ((tempOne - tempTwo) * ((0.666 - tempG) * 6));
				} else {
					g = tempTwo;
				}
				if ((6 * tempB) < 1) {
					b = tempTwo + ((tempOne - tempTwo) * 6 * tempB);
				} else if ((2 * tempB) < 1) {
					b = tempOne;
				} else if ((3 * tempB) < 2) {
					b = tempTwo + ((tempOne - tempTwo) * ((0.666 - tempB) * 6));
				} else {
					b = tempTwo;
				}
				return {
					r: r * 255,
					g: g * 255,
					b: b * 255
				}
			}
			break;
		case "css-rgb":
			var rgb = convert("hsl", "rgb", value);
			return "rgb(" + Math.round(rgb.r) + "," + Math.round(rgb.g) + "," + Math.round(rgb.b) + ")";
			break;
		case "css-hsl":
			return "hsl(" + Math.round(value.h) + "," + Math.round(value.s) + "%," + Math.round(value.l) + "%)";
			break;
	}
}

function fromCssHsl( to, value ) {
	value = value.replace(/(hsl\(|\)|%)/g,'').split(",");
	for (i=0;i<value.length;i++){
		value[i] = parseInt(value[i]);
	}
	switch (to) {
		case "hex":
			var rgb = convert("hsl", "rgb", {
				h: value[0],
				s: value[1],
				l: value[2]
			});
			return convert("rgb", "hex", rgb);
			break;
		case "rgb":
			if (value[1] == 0) {
				var grey = (value[2] / 100) * 255;
				return {
					r: grey,
					g: grey,
					b: grey
				}
			} else {
				if (value[2] >= 50) {
					tempOne = ((value[2]/100) + (value[1]/100)) - ((value[2]/100) * (value[1]/100));
				} else {
					tempOne = (value[2]/100) * (1 + (value[1]/100));
				}
				tempTwo = (2 * (value[2]/100)) - tempOne;
				tempHue = value[0] / 360;
				tempR = (tempHue + 0.333) % 1;
				tempG = tempHue;
				tempB = negMod((tempHue - 0.333), 1);
				var r,g,b;
				if ((6 * tempR) < 1) {
					r = tempTwo + ((tempOne - tempTwo) * 6 * tempR);
				} else if ((2 * tempR) < 1) {
					r = tempOne;
				} else if ((3 * tempR) < 2) {
					r = tempTwo + ((tempOne - tempTwo) * ((0.666 - tempR) * 6));
				} else {
					r = tempTwo;
				}
				if ((6 * tempG) < 1) {
					g = tempTwo + ((tempOne - tempTwo) * 6 * tempG);
				} else if ((2 * tempG) < 1) {
					g = tempOne;
				} else if ((3 * tempG) < 2) {
					g = tempTwo + ((tempOne - tempTwo) * ((0.666 - tempG) * 6));
				} else {
					g = tempTwo;
				}
				if ((6 * tempB) < 1) {
					b = tempTwo + ((tempOne - tempTwo) * 6 * tempB);
				} else if ((2 * tempB) < 1) {
					b = tempOne;
				} else if ((3 * tempB) < 2) {
					b = tempTwo + ((tempOne - tempTwo) * ((0.666 - tempB) * 6));
				} else {
					b = tempTwo;
				}
				return {
					r: r * 255,
					g: g * 255,
					b: b * 255
				}
			}
			break;
		case "css-rgb":
			var rgb = convert("hsl", "rgb", {
				h: value[0],
				s: value[1],
				l: value[2]
			});
			return "rgb(" + Math.round(rgb.r) + "," + Math.round(rgb.g) + "," + Math.round(rgb.b) + ")";
			break;
		case "hsl":
			return {
				h: value[0],
				s: value[1],
				l: value[2]
			};
			break;
	}
}

module.exports = {
	convert: convert,
	complementary: complementary,
	triad: triad,
	tetrad: tetrad,
	invert: invert,
	adjacent: adjacent,
	shade: shade,
	saturation: saturation
}