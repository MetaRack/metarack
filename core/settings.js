var rackrand = fxrand;
let engine;
rackwidth = document.documentElement.clientWidth;
rackheight = document.documentElement.clientHeight;
upscale_buffers = 3;
fps = 24;
sample_rate = 44100;
background_color = 255;

daytime = 'day'
if (rackrand() > 0.5)
	daytime = 'night'

day_palette = [
	[255, 255, 255],
	[230, 255, 230],
	[255, 230, 230],
	[220, 235, 255],
]

night_palette = [
	[15, 15, 15],
	[15, 15, 40],
	[40, 15, 40],
	[15, 40, 30],
	[40, 40, 20]
]

if (daytime == 'day')
	visuals_background_color = day_palette[Math.floor(rackrand() * day_palette.length)]//[220, 235, 255];
if (daytime == 'night')
	visuals_background_color = night_palette[Math.floor(rackrand() * night_palette.length)]

visuals_negative_color = [255 - visuals_background_color[0], 255 - visuals_background_color[1], 255 - visuals_background_color[2]];