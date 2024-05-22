(function ($) {
    "use strict"

    //Number formatting
    var sliderFormat = document.getElementById('slider-format');
    console.log('creates');
    noUiSlider.create(sliderFormat, {
        start: [1000],
        step: 1000,
        range: {
            'min': [50],
            'max': [1000000]
        },
        ariaFormat: wNumb({
            decimals: 0
        }),
        format: wNumb({
            decimals: 3,
            thousand: '.',
            suffix: ' (sms)'
        })
    });
    var inputFormat = document.getElementById('input-format');
    sliderFormat.noUiSlider.on('update', function (values, handle) {
        inputFormat.value = values[handle];
    });

    inputFormat.addEventListener('change', function () {
        sliderFormat.noUiSlider.set(this.value);
    });
    //Number formatting ^





})(jQuery);