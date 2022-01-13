var rackrand = fxrand;
let engine;
rackwidth = document.documentElement.clientWidth;
rackheight = document.documentElement.clientHeight;
upscale_buffers = 3;
fps = 24;
sample_rate = 44100;
background_color = 255;
let p_dark = rackrand();
if (p_dark > 0.5)
	visuals_background_color = 15; //[60, 15, 60];
else
	visuals_background_color = 255;