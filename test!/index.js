function slider29(orientation, type, ruler, iconValue){
    let slider = $(".slider29");
    let sliderLine = createSliderLine();
    let sliderLinePixelSize = sliderLine.outerWidth();
    let progressbar = createProgressbar();
    let thumbs = [];
    const minValue = 0;
    const maxValue = 1000;
    const stepValue = 50;
    let stepCount = (maxValue - minValue) / stepValue;
    const setMinValue = 300;
    const setMaxValue = 600;
    let minMaxvaluesLine;
    let rulerElem;
    //сколько есть процентов для движения в линии за вычетом ширины ползунка
    let withPrecent;
    //сколько процентов будет в одном шаге
    let stepPercent;

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

    //генератор прогрессбара
    function createProgressbar(){
        let progressbar = $('<span>');
        progressbar.addClass('slider29__progressbar')
        sliderLine.append(progressbar);
        return progressbar;
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
        minMaxvaluesLine.addClass('slider29__values--vertical');
        
        //повернем линейку если она есть
        if(ruler) {
            rulerElem.addClass('slider29__ruler--vertical');
            $.each($('.slider29__mark'), function(){
                $(this).addClass('slider29__mark--vertical');
            })
        }
    }

    //генератор линейки мин и макс
    function showMinMaxValue(){
        const valuesHtml = `
            <div class="slider29__values">
                <span class="slider29__value--min">${minValue}</span>
                <span class="slider29__value--max">${maxValue}</span>
            </div>
        `
        slider.prepend(valuesHtml);
        minMaxvaluesLine = $('.slider29__values');
    }

    // генератор линейки
    function showRuler(){
        rulerElem = $('<div class="slider29__ruler"></div>');
        rulerElem.css({
            paddingLeft: thumbs[0].width() / 2 + 'px',
            paddingRight: thumbs[0].width() / 2 + 'px',
        })
    
        for(let i = minValue; i <= maxValue; i += stepValue) {
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

    //получить из заданной единицы смещение в процентах
    function getPrecentFromUnits(units) {
        return ((sliderLinePixelSize - thumbs[0].width()) / maxValue * units) / sliderLinePixelSize * 100 + "%";
    }

    // генератор размера сайдбара
    function setProgressbar(){
        if(type === 'single') {
            if(orientation === 'vertical') {
                let coordsThumbStart = parseInt(thumbs[0].css('top')) + (thumbs[0].height() / 2) + 'px';
                progressbar.css({
                    top: 0,
                    width: '100%',
                    height: coordsThumbStart,
                })
            }

            if(orientation === 'horizontal') {
                let coordsThumbStart = parseInt(thumbs[0].css('left')) + (thumbs[0].width() / 2) + 'px';
                progressbar.css({
                    left: 0,
                    height: '100%',
                    width: coordsThumbStart,
                })
            }
        }

        if(type === 'double') {
            if(orientation === 'vertical') {
                let coordsThumbMin = parseInt(thumbs[0].css('top')) + (thumbs[0].height() / 2);
                let coordsThumbMax = parseInt(thumbs[1].css('top')) + (thumbs[1].height() / 2);

                progressbar.css({
                    left: 0,
                    height: coordsThumbMax - coordsThumbMin + 'px',
                    width: '100%',
                    top: coordsThumbMin,
                })
            }

            if(orientation === 'horizontal') {
                let coordsThumbMin = parseInt(thumbs[0].css('left')) + (thumbs[0].width() / 2);
                let coordsThumbMax = parseInt(thumbs[1].css('left')) + (thumbs[1].width() / 2);

                progressbar.css({
                    left: coordsThumbMin + 'px',
                    height: '100%',
                    width: coordsThumbMax - coordsThumbMin + 'px',
                })
            }
        }
    }
// --------------------------------------------------------------------------------------
    //---------------БЛОК СОЗДАНИЯ ВНЕШНОСТИ СЛАЙДЕРА
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

        //высчитать сколько процентов останется доступно для движенния ползунка
        {
            if(orientation === 'horizontal') {
                withPrecent = 100 - (thumbs[0].width() / sliderLine.width() * 100);
            }
        
            if(orientation === 'vertical') {
                withPrecent = 100 - (thumbs[0].height() / sliderLine.height() * 100);
            }
        }

        // если нужны флажки - установить в них начальные значения
        {
            if(iconValue) {
                thumbs[0].attr('data-value', setMinValue);

                if(type === 'double') {
                    thumbs[1].attr('data-value', setMaxValue);
                }
            }
        }
        
        //сколько процентов будет в одном шаге
        stepPercent = withPrecent / stepCount;


        //если заданы начальные значения - установить ползунок в начальные значения
        {
            if(orientation === 'horizontal') {
                if(setMinValue) {
                    thumbs[0].css({ left: getPrecentFromUnits(setMinValue)});
                }
                if(type === 'double' && setMaxValue){
                    thumbs[1].css({ left: getPrecentFromUnits(setMaxValue)});
                }
            }
            
            if(orientation === 'vertical') {
                if(setMinValue) {
                    thumbs[0].css({ top: getPrecentFromUnits(setMinValue)});
                }
                if(type === 'double' && setMaxValue){
                    thumbs[1].css({ top: getPrecentFromUnits(setMaxValue)});
                }
            }
        }

        //создать сайдбар
        setProgressbar()
    } 
    
// --------------------------------------------------------------------------------------
    //-----------------БЛОК СОЗДАНИЯ ПОВЕДЕНИЯ СЛАЙДЕРА
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

        //клик по полосе
        sliderLine.on('click', function(event){
            let sliderLineCoords = getCoords(sliderLine);

            if(orientation === 'horizontal') {
                // на скольких пикселях от линии произошел клик
                let pixelClick = event.clientX - sliderLineCoords.left;

                //на скольких процентах от линии произошел клик
                let pixelClickPrecent= pixelClick / sliderLinePixelSize * 100;

                //прировнять проценты клика к шагу
                let stepLeft = Math.round(pixelClickPrecent / stepPercent) * stepPercent;

                if(type === 'single') {
                    thumbs[0].css({ left: stepLeft + "%" });
                    setProgressbar();
                }
                if(type === 'double') {
                    const minPrecent = parseInt(document.querySelector('.slider29__thumb--min').style.left);
                    const maxPrecent = parseInt(document.querySelector('.slider29__thumb--max').style.left);
                    const middlePrecent = minPrecent + ((maxPrecent - minPrecent) / 2);

                    if(pixelClickPrecent < middlePrecent) {
                        thumbs[0].css({ left: stepLeft + "%" });
                    } else {
                        thumbs[1].css({ left: stepLeft + "%" });
                    }
                    setProgressbar();
                }
            }
            
            if(orientation === 'vertical') {
                // на скольких пикселях от линии произошел клик
                let pixelClick = event.clientY - sliderLineCoords.top;
                console.log(sliderLineCoords.top)

                //на скольких процентах от линии произошел клик
                let pixelClickPrecent= pixelClick / sliderLinePixelSize * 100;

                //прировнять проценты клика к шагу
                let stepTop = Math.round(pixelClickPrecent / stepPercent) * stepPercent;

                if(type === 'single') {
                    thumbs[0].css({ top: stepTop + "%" });
                    setProgressbar();
                }

                if(type === 'double') {
                    const minPrecent = parseInt(document.querySelector('.slider29__thumb--min').style.top);
                    const maxPrecent = parseInt(document.querySelector('.slider29__thumb--max').style.top);
                    const middlePrecent = minPrecent + ((maxPrecent - minPrecent) / 2);

                    if(pixelClickPrecent < middlePrecent) {
                        thumbs[0].css({ top: stepTop + "%" });
                    } else {
                        thumbs[1].css({ top: stepTop + "%" });
                    }
                    setProgressbar();
                }

            }
        })


        //клик по значению на линейке
        $.each($('.slider29__mark'), function(){
            $(this).on('click', function(){
                if(orientation === 'horizontal') {
                    if(type === 'single') {
                        thumbs[0].css({ left: getPrecentFromUnits(this.textContent)});
                        setProgressbar();
                    }
                }
                if(orientation === 'vertical') {
                    if(type === 'single') {
                        thumbs[0].css({ top: getPrecentFromUnits(this.textContent)});
                        setProgressbar();
                    }
                }
            })
        })


        $.each(thumbs, function(){
            $(this).on('mousedown', clickOnThumb);
        })

        function clickOnThumb(event){
            //получим все необходимые координаты
            let lineThumbCoords = getCoords(sliderLine);
            let minThumbCoords = getCoords(thumbs[0]);  
            let maxThumbCoords = thumbs[1] ? getCoords(thumbs[1]) : null;
            //текущая кнопка
            let currenThumb = $(event.target);
            let currentThumbCoords = getCoords(currenThumb);

            //на скольких процентах сейчас находится кнопка макисмума
            let maxThumbPrecentStart;
            if(orientation === 'horizontal') {
                if (maxThumbCoords) {
                    maxThumbPrecentStart = (maxThumbCoords.left - lineThumbCoords.left) / sliderLinePixelSize * 100;
                }
            }
            if(orientation === 'vertical') {
                if (maxThumbCoords) {
                    maxThumbPrecentStart = (maxThumbCoords.top - lineThumbCoords.top) / sliderLinePixelSize * 100;
                }
            }

            //на скольких процентах сейчас находится кнопка минимума
            let minThumbPrecentStart
            if(orientation === 'horizontal') {
                minThumbPrecentStart = (minThumbCoords.left - lineThumbCoords.left) / sliderLinePixelSize * 100;
            }
            if(orientation === 'vertical') {
                minThumbPrecentStart = (minThumbCoords.top - lineThumbCoords.top) / sliderLinePixelSize * 100;
            }

            //получить смещение клика
            let shiftThumbCoords = differenceClickAndStartThumb(currentThumbCoords);


            $(document).on("mousemove", function (event) {
                // на скольких процентах от ширины линии находится курсор
                let precentStartThumb = coordsThumbPrecent(event, shiftThumbCoords, lineThumbCoords);
                
                
                //прировнять процент смещения к шагу
                let stepLeft = Math.round(precentStartThumb / stepPercent) * stepPercent;

                // валидация значения
                if (stepLeft < 0) stepLeft = 0;
                if (stepLeft > withPrecent) stepLeft = withPrecent;

                if(currenThumb.hasClass('slider29__thumb--min') && stepLeft>= maxThumbPrecentStart - stepPercent) {
                    stepLeft = maxThumbPrecentStart - stepPercent;
                }

                if(currenThumb.hasClass('slider29__thumb--max') && stepLeft <= minThumbPrecentStart + stepPercent) {
                    stepLeft = minThumbPrecentStart + stepPercent;
                }


                if(orientation === 'horizontal') {
                    currenThumb.css({ left: stepLeft + "%" });
                }
                if(orientation === 'vertical') {
                    currenThumb.css({ top: stepLeft + "%" });
                } 

                //обновить сайдбар
                setProgressbar()

                //получить значение слайдера
                function getValue(){
                    let result = ((stepLeft / stepPercent) * stepValue).toFixed();
                    result = +result;
                    let values = result + minValue;
                    return values;
                }

                //отправить значение в ползунок
                currenThumb.attr('data-value', getValue())
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
// ruler: true / false
// icon-value: true / false

slider29('horizontal', 'single', true, true);