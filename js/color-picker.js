PICKER = {
    mouse_inside: false,

    to_hex: function (dec) {
        hex = dec.toString(16);
        return hex.length == 2 ? hex : '0' + hex;
    },

    show: function () {
        var input = $(this);
        var position = input.offset();

        PICKER.$colors  = $('<canvas width="230" height="150" ></canvas>');
        PICKER.$colors.css({
            'position': 'absolute',
            'top': position.top + input.height() + 9,
            'left': position.left-30,
            'cursor': 'crosshair',
            'display': 'none'
        });
        $('body').append(PICKER.$colors.fadeIn());
        PICKER.colorctx = PICKER.$colors[0].getContext('2d');

        PICKER.render();

        PICKER.$colors
            .click(function (e) {
                var new_color = PICKER.get_color(e);
                $(input).css({'background-color': new_color}).val(new_color).trigger('change').removeClass('color-picker-binded');
                PICKER.close();
            })
            .hover(function () {
                PICKER.mouse_inside=true;
            }, function () {
                PICKER.mouse_inside=false;
            });

        $("body").mouseup(function () {
            if (!PICKER.mouse_is_inside) PICKER.close();
        });
    },

    bind_inputs: function () {
        $('input[type="color-picker"]').not('.color-picker-binded').each(function () {
            $(this).click(PICKER.show);
        }).addClass('color-picker-binded');
    },

    close: function () {PICKER.$colors.fadeOut(PICKER.$colors.remove);},

    get_color: function (e) {
        var pos_x = e.pageX - PICKER.$colors.offset().left;
        var pos_y = e.pageY - PICKER.$colors.offset().top;

        data = PICKER.colorctx.getImageData(pos_x, pos_y, 1, 1).data;
        return '#' + PICKER.to_hex(data[0]) + PICKER.to_hex(data[1]) + PICKER.to_hex(data[2]);
    },

    // Build Color palette
    render: function () {
        var gradient = PICKER.colorctx.createLinearGradient(0, 0, PICKER.$colors.width(), 0);

        // Create color gradient
        gradient.addColorStop(0,    "rgb(255,   0,   0)");
        gradient.addColorStop(0.15, "rgb(255,   0, 255)");
        gradient.addColorStop(0.33, "rgb(0,     0, 255)");
        gradient.addColorStop(0.49, "rgb(0,   255, 255)");
        gradient.addColorStop(0.67, "rgb(0,   255,   0)");
        gradient.addColorStop(0.84, "rgb(255, 255,   0)");
        gradient.addColorStop(1,    "rgb(255,   0,   0)");

        // Apply gradient to canvas
        PICKER.colorctx.fillStyle = gradient;
        PICKER.colorctx.fillRect(0, 0, PICKER.colorctx.canvas.width, PICKER.colorctx.canvas.height);

        // Create semi transparent gradient (white -> trans. -> black)
        gradient = PICKER.colorctx.createLinearGradient(0, 0, 0, PICKER.$colors.height());
        gradient.addColorStop(0,   "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.5, "rgba(0,     0,   0, 0)");
        gradient.addColorStop(1,   "rgba(0,     0,   0, 1)");

        // Apply gradient to canvas
        PICKER.colorctx.fillStyle = gradient;
        PICKER.colorctx.fillRect(0, 0, PICKER.colorctx.canvas.width, PICKER.colorctx.canvas.height);
    }
};

PICKER.bind_inputs();

function changeColor()
{
 color=document.getElementById('colorpicker').value; 
}