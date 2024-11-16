function slider29(orientation, type, input, ruler){
    let slider = $(".slider29");
    let sliderLine = createSliderLine();
    let sidebar = createSidebar();
    let inputsLine;
    let thumbs = [];
    let inputs = [];
    const minValue = 0;
    const maxValue = 1000;
    const stepValue = 1;
    let stepCount = (maxValue - minValue) / stepValue;
    let valuesLine;
    let rulerElem;

    //генератор линии
    function createSliderLine(){
        let line = $('<div>', {class: 'slider29__line'});
        slider.append(line);
        return line;
    }

    //генератор кнопки
    function createThumb(){
        let thumb = $('<span>');
        thumb.addClass('slider29__thumb')
        sliderLine.append(thumb);
        return thumb;
    }

    //генератор сайдбара
    function createSidebar(){
        let sidebar = $('<span>');
        sidebar.addClass('slider29__sidebar')
        sliderLine.append(sidebar);
        return sidebar;
    }

    //генератор инпута
    function createInput() {
        let input = ($('<input>', {class: 'slider29__input'})); 
        return input;
    }

    // генератор вертикальной ориентации
    function setVerticalOrientation() {
        //повернем весь слайдер
        slider.addClass('slider29--vertical');

        //повернем линию
        sliderLine.addClass('slider29__line--vertical');

        //повернем кнопки
        $.each(thumbs, function(){
            $(this).addClass('slider29__thumb--vertical')
        });

        //повернем линию со значениями
        valuesLine.addClass('slider29__values--vertical');
        
        //повернем линейку если она есть
        if(ruler) {
            rulerElem.addClass('slider29__ruler--vertical');
            $.each($('.slider29__mark'), function(){
                $(this).addClass('slider29__mark--vertical');
            })
        }
    }

    //генератор мин и макс
    function showMinMaxValue(){
        const valuesHtml = `
            <div class="slider29__values">
                <span class="slider29__value--min">${minValue}</span>
                <span class="slider29__value--max">${maxValue}</span>
            </div>
        `
        slider.prepend(valuesHtml);
        valuesLine = $('.slider29__values');
    }

    // генератор линейки
    function showRuler(){
        rulerElem = $('<div class="slider29__ruler"></div>');
    
        for(let i = minValue; i <= maxValue; i += 50) {
            let markElem = $(`<span class="slider29__mark"><span>${i}</span></span>`);

            rulerElem.append(markElem);
        }

        slider.append(rulerElem)
    }

    //генератор координат элементов
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
// --------------------------------------------------------------------------------------
    //БЛОК СОЗДАНИЯ ВНЕШНОСТИ СЛАЙДЕРА
    {
        // в зависимости от типа создать количество кнопок
        {
            if(type === 'double') {
                thumbs.push(createThumb().addClass('slider29__thumb--min'));
                thumbs.push(createThumb().addClass('slider29__thumb--max'));
            } else {
                thumbs.push(createThumb());
            }
        }

        //показать мин и макс на слайдере
        {
            showMinMaxValue()
        }

        // если заказаны инпуты, то создать в соответствии с количеством позунков
        {
            if(input) {
                // создать оболочку для инпут
                inputsLine = $('<div>', {class: "slider29__inputs"});
                slider.prepend(inputsLine);

                if(type === 'double') {
                    const inputMin = createInput().addClass('slider29__input--min')
                    inputs.push(inputMin);
                    inputsLine.append(inputMin);

                    const inputMax = createInput().addClass('slider29__input--max')
                    inputs.push(inputMax);
                    inputsLine.append(inputMax);

                } else {
                    const input = createInput();
                    inputs.push(input);
                    inputsLine.append(input);
                }
            }
        }

        // если нужна линейка, добавить линейку 
        {
            if(ruler) {
                showRuler()
            }
        }

        //если задана вертикальная ориентация - установить вертикальную ориентацию
        {
            if(orientation === 'vertical') {
                setVerticalOrientation();
            }
        }
    } 
    
// --------------------------------------------------------------------------------------
    //БЛОК СОЗДАНИЯ ПОВЕДЕНИЯ СЛАЙДЕРА
    {
        // смещение клика в пикселях
        function differenceClickAndStartThumb(thumbCoords){
            let shiftClick;
            if(orientation === 'horizontal') {
                shiftClick = event.pageX - thumbCoords.left;
            }

            if(orientation === 'vertical') {
                shiftClick = event.pageY - thumbCoords.top;
            }
            return shiftClick;
        }

        //на скольких процентах от ширины линии находится ползунок
        function coordsThumbPrecent(event, shiftClick, sliderLineCoords){
            let precentStartThumb;

            if(orientation === 'horizontal') {
                precentStartThumb = ((event.pageX - shiftClick - sliderLineCoords.left) / sliderLineCoords.width) * 100;
            }
            if(orientation === 'vertical') {
                precentStartThumb = ((event.pageY - shiftClick - sliderLineCoords.top) / sliderLineCoords.height) * 100;
            }
            if (precentStartThumb < 0) precentStartThumb = 0;
            if (precentStartThumb > 100) precentStartThumb = 100;

            return precentStartThumb;
        }


        $.each(thumbs, function(){
            $(this).on('mousedown', clickOnThumb);
        })

        function clickOnThumb(event){
            //получим все необходимые координаты
            let lineThumbCoords = getCoords(sliderLine);
            let minThumbCoords = getCoords(thumbs[0]);  
            let maxThumbCoords = thumbs[1] ? getCoords(thumbs[1]) : null;
            let currentThumbCoords = getCoords($(event.target));

            //текущая кнопка
            let currenThumb = $(event.target);

            //на скольких процентах сейчас находится кнопка макисмума
            const maxThumbPrecentStart = (maxThumbCoords.left - lineThumbCoords.left) / lineThumbCoords.width * 100;

            //получить смещение клика
            let shiftThumbCoords = differenceClickAndStartThumb(currentThumbCoords);

            //до скольки процентов максимум может двигаться ползунок
            let withPrecent;
            if(orientation === 'horizontal') {
                withPrecent = 100 - (currentThumbCoords.width / lineThumbCoords.width * 100);
            }
    
            if(orientation === 'vertical') {
                withPrecent = 100 - (currentThumbCoords.height / lineThumbCoords.height * 100);
            }

            //сколько процентов будет в одном шаге
            let stepPercent = withPrecent / stepCount;


            $(document).on("mousemove", function (event) {
                // на скольких процентах от ширины линии находится курсор
                let precentStartThumb = coordsThumbPrecent(event, shiftThumbCoords, lineThumbCoords);
                
                
                //прировнять процент смещения к шагу
                let stepLeft = Math.round(precentStartThumb / stepPercent) * stepPercent;

                if (stepLeft < 0) stepLeft = 0;
                if (stepLeft > withPrecent) stepLeft = withPrecent;

                if(orientation === 'horizontal') {
                    currenThumb.css({ left: stepLeft + "%" });
                }
                if(orientation === 'vertical') {
                    currenThumb.css({ top: stepLeft + "%" });
                } 

                //положение сайдбара
                sidebar.css({
                    left: thumbs[0].css('left') + (minThumbCoords.width / 2),
                    width: parseInt($(thumbs[1]).css('left')) - parseInt(thumbs[0].css('left')) + 'px',
                });
            })

            $(document).on("mouseup", function () {
                $(document).off("mousemove");
            });
    
            return false;
        }
    }
}


// orientation : 'horizontal' / 'vertical' 
// type: 'single' / 'double'
// input: true /false
// ruler: true / false


slider29('horizontal', 'double', false, true);