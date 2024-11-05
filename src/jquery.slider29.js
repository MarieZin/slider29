export function slider29(type){
    let slider = $(".slider29");
    let sliderLine = createLine(slider);
    let sliderThumb = $(createThumb(sliderLine, type));
    let sliderInput = createValueInput(slider)
    let min = 50;
    let max = 1000;
    let stepSize = 50;

    if(type === 'vertical') {
        sliderLine.addClass('slider29--vertical');
    }

    //создадим линию слайдера
    function createLine(sliderElem) {
        let line = $('<div>', {class: 'slider29__slider'});
        sliderElem.append(line);
        return line;
    }

    // cоздадим кнопку ползунка
    function createThumb(sliderLine, typeSlider){
        let thumb = $('<span>');
        thumb.addClass(typeSlider === 'vertical' ? 'slider29__thumb slider29__thumb--vertical' : 'slider29__thumb')
        sliderLine.append(thumb)
        return thumb;
    }

    // cоздадим инпут с результатом
    function createValueInput(slider) {
        let inputWrapper = $('<div>', {class: "slider29__values"});
        let input = ($('<input>', {class: 'slider29__result'})); 
        inputWrapper.append(input);
        slider.prepend(inputWrapper);
        return input;
    }

    sliderInput.val(min);

    sliderThumb.on("mousedown", function (event){
        let sliderLineCoords = getCoords(sliderLine);
        let sliderThumbCoords = getCoords(sliderThumb);

        // разница в пикселя между координатой начала ползунка и координатой клика
        let shiftClick;
        if(type === 'horizontal') {
            shiftClick = event.pageX - sliderThumbCoords.left;
        }

        if(type === 'vertical') {
            shiftClick = event.pageY - sliderThumbCoords.top;
        }

        $(document).on("mousemove", function (event) {
            let precentStartThumb;

            if(type === 'horizontal') {
                precentStartThumb = ((event.pageX - shiftClick - sliderLineCoords.left) / sliderLineCoords.width) * 100;
            }
            if(type === 'vertical') {
                precentStartThumb = ((event.pageY - shiftClick - sliderLineCoords.top) / (sliderLineCoords.height)) * 100;
            }
            if (precentStartThumb < 0) precentStartThumb = 0;
            if (precentStartThumb > 100) precentStartThumb = 100;

            //Шаг слайдера
            //сколько шагов влезет в заданный диапазон учитывая размер шага
            let stepCount = (max - min) / stepSize;

            //сколько процентов в линии останется для движения за вычетом процента ползунка от линии
            let withPrecent;
            if(type === 'horizontal') {
                withPrecent = 100 - (sliderThumbCoords.width / sliderLineCoords.width * 100);
            }
    
            if(type === 'vertical') {
                withPrecent = 100 - (sliderThumbCoords.height / sliderLineCoords.height * 100);
            }
            
            
            //сколько процентов будет в одном шаге
            let stepPercent = withPrecent / stepCount;

            let stepLeft = Math.round(precentStartThumb / stepPercent) * stepPercent;
            if (stepLeft < 0) stepLeft = 0;
            if (stepLeft > withPrecent) stepLeft = withPrecent;

            if(type === 'horizontal') {
                sliderThumb.css({ left: stepLeft + "%" });
            }
            if(type === 'vertical') {
                sliderThumb.css({ top: stepLeft + "%" });
            }      

            //Расчитаем значение равное шагу слайдера
            let result = ((stepLeft / stepPercent) * stepSize).toFixed();
            result = +result;
            let values = result + min;
            sliderInput.val(values);
        })

        //Остановим движение ползунка
        $(document).on("mouseup", function () {
            $(document).off("mousemove");
        });

        return false;

    })

        //установить ползунок в значение из инпута
    sliderInput.on('change', function(){
        let value = $(this).val();
        
        if (value < min) value = min;
        if (value > max) value = max;

        let sliderLineCoords = getCoords(sliderLine);
        let sliderThumbCoords = getCoords(sliderThumb);

        // сколько шагов в заданном значчении
        const stepCount = Math.ceil(value / stepSize);
        //установить корректное значение в соответствии с шагом
        const validValue = stepCount * stepSize;
        $(this).val(validValue);
        const pixelInOneEd = max / sliderLineCoords.width;
        const pixelInShift = validValue / pixelInOneEd;
        const precentShift = (pixelInShift / sliderLineCoords.width * 100 - (sliderThumbCoords.width / sliderLineCoords.width * 100)) + "%";       
        sliderThumb.css({ left: precentShift});
    })

    function getCoords(elem) {
        //координата левого ребра элемента
        let boxLeft = elem.offset().left;
        //координата правого ребра элемента
        let boxRight = boxLeft + elem.outerWidth();
        //координата верхнего ребра элемента
        let boxTop = elem.offset().top;
        //координата нижнего ребра элемента
        let boxBottom = boxTop + elem.outerHeight();

        return {
            left: boxLeft + window.scrollX,
            width: boxRight - boxLeft,
            top: boxTop + window.scrollY,
            height: boxBottom - boxTop,
        };
    }

}