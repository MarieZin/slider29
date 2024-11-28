import { SliderLine } from "./SliderLine.js";
import { SliderThumb } from "./SliderThumb.js";
import { SliderProgressBar } from "./SliderProgressBar.js";

export class Slider {
    constructor({container, type, orientation, ruler, iconValue}){
        this.minValue = 0;
        this.maxValue = 1000;
        this.stepValue = 50;
        this.stepCount = (this.maxValue - this.minValue) / this.stepValue;
        this.setMinValue = 300;
        this.setMaxValue = 600;
        this.type = type;
        this.orientation = orientation;
        this.iconValue = iconValue;
        this.slider = container;
        this.sliderLine = new SliderLine(container);
        this.thumbs = [];
        this.minMaxvaluesLine;

        // в зависимости от типа создать количество кнопок
        {
            if(type === 'double') {
                this.thumbs.push(new SliderThumb(this.sliderLine.item).addMinClass());
                this.thumbs.push(new SliderThumb(this.sliderLine.item).addMaxClass());
            } else {
                this.thumbs.push(new SliderThumb(this.sliderLine.item));
            }
        }

        this.progressBar = new SliderProgressBar(this.sliderLine.item);
        this.ruler = ruler;
        this.rulerElem;
        this.sliderLinePixelSize;
        this.withPrecent;
        this.stepPercent;
    }


    setSizeProgressbar(){
        if(this.type === 'single') {
            if(this.orientation === 'vertical') {
                let coordsThumbStart = parseInt(this.thumbs[0].item.css('top')) + (this.thumbs[0].item.height() / 2) + 'px';
                this.progressBar.item.css({
                    top: 0,
                    width: '100%',
                    height: coordsThumbStart,
                })
            }

            if(this.orientation === 'horizontal') {
                let coordsThumbStart = parseInt(this.thumbs[0].item.css('left')) + (this.thumbs[0].item.width() / 2) + 'px';
                this.progressBar.item.css({
                    left: 0,
                    height: '100%',
                    width: coordsThumbStart,
                })
            }
        }

        if(this.type === 'double') {
            if(this.orientation === 'vertical') {
                let coordsThumbMin = parseInt(this.thumbs[0].item.css('top')) + (this.thumbs[0].item.height() / 2);
                let coordsThumbMax = parseInt(this.thumbs[1].item.css('top')) + (this.thumbs[1].item.height() / 2);

                this.progressBar.item.css({
                    left: 0,
                    height: coordsThumbMax - coordsThumbMin + 'px',
                    width: '100%',
                    top: coordsThumbMin,
                })
            }

            if(this.orientation === 'horizontal') {
                console.log(this.thumbs)
                let coordsThumbMin = parseInt(this.thumbs[0].item.css('left')) + (this.thumbs[0].item.width() / 2);
                let coordsThumbMax = parseInt(this.thumbs[1].item.css('left')) + (this.thumbs[1].item.width() / 2);

                this.progressBar.item.css({
                    left: coordsThumbMin + 'px',
                    height: '100%',
                    width: coordsThumbMax - coordsThumbMin + 'px',
                })
            }
        }
    }

    setVerticalOrientation() {
        //повернем весь слайдер
        this.slider.addClass('slider29--vertical');

        //повернем линию
        this.sliderLine.item.addClass('slider29__line--vertical');

        //повернем кнопки
        $.each(this.thumbs, function(){
            $(this.item).addClass('slider29__thumb--vertical')
        });

        //повернем линию со значениями
        this.minMaxvaluesLine.addClass('slider29__values--vertical');
        
        //повернем линейку если она есть
        if(this.ruler) {
            this.rulerElem.addClass('slider29__ruler--vertical');
            $.each($('.slider29__mark'), function(){
                $(this).addClass('slider29__mark--vertical');
            })
        }
    }

    //генератор линейки мин и макс
    showMinMaxValue(){
        const valuesHtml = `
            <div class="slider29__values">
                <span class="slider29__value--min">${this.minValue}</span>
                <span class="slider29__value--max">${this.maxValue}</span>
            </div>
        `
        this.slider.prepend(valuesHtml);
        this.minMaxvaluesLine = $('.slider29__values');
    }

    // генератор линейки
    showRuler(){
        this.rulerElem = $('<div class="slider29__ruler"></div>');
        this.rulerElem.css({
            paddingLeft: this.thumbs[0].item.width() / 2 + 'px',
            paddingRight: this.thumbs[0].item.width() / 2 + 'px',
        })
    
        for(let i = this.minValue; i <= this.maxValue; i += this.stepValue) {
            let markElem = $(`<span class="slider29__mark"><span>${i}</span></span>`);
            this.rulerElem.append(markElem);
        }

        this.slider.append(this.rulerElem)
    }

    //генератор координат элементов
    getCoords(elem) {
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
    getPrecentFromUnits(units) {
        return ((this.sliderLinePixelSize - this.thumbs[0].item.width()) / this.maxValue * units) / this.sliderLinePixelSize * 100 + "%";
    }

    differenceClickAndStartThumb(thumbCoords){
        let shiftClick;
        if(this.orientation === 'horizontal') {
            shiftClick = event.pageX - thumbCoords.left;
        }

        if(this.orientation === 'vertical') {
            shiftClick = event.pageY - thumbCoords.top;
        }
        return shiftClick;
    }

    //на скольких процентах от ширины линии находится ползунок
    coordsThumbPrecent(event, shiftClick, sliderLineCoords){
        let precentStartThumb;

        if(this.view.orientation === 'horizontal') {
            precentStartThumb = ((event.pageX - shiftClick - sliderLineCoords.left) / sliderLineCoords.width) * 100;
        }
        if(this.view.orientation === 'vertical') {
            precentStartThumb = ((event.pageY - shiftClick - sliderLineCoords.top) / sliderLineCoords.height) * 100;
        }
        if (precentStartThumb < 0) precentStartThumb = 0;
        if (precentStartThumb > 100) precentStartThumb = 100;

        return precentStartThumb;
    }

    init(){
        this.showMinMaxValue();

        // если нужна линейка, добавить линейку 
        {
            if(this.ruler) {
                this.showRuler();
            }
        }

        //если задана вертикальная ориентация - установить вертикальную ориентацию
        {
            if(this.orientation === 'vertical') {
                this.setVerticalOrientation();
            }
        }

        this.sliderLinePixelSize = this.sliderLine.item.outerWidth();

        //высчитать сколько процентов останется доступно для движенния ползунка
        {
            if(this.orientation === 'horizontal') {
                this.withPrecent = 100 - (this.thumbs[0].item.width() / this.sliderLine.item.width() * 100);
            }
        
            if(this.orientation === 'vertical') {
                this.withPrecent = 100 - (this.thumbs[0].item.height() / this.sliderLine.item.height() * 100);
            }
        }

        // если нужны флажки - установить в них начальные значения
        {
            if(this.iconValue) {
                this.thumbs[0].item.attr('data-value', this.setMinValue);

                if(this.type === 'double') {
                    this.thumbs[1].item.attr('data-value', this.setMaxValue);
                }
            }
        }

        //сколько процентов будет в одном шаге
        this.stepPercent = this.withPrecent / this.stepCount;

        //если заданы начальные значения - установить ползунок в начальные значения
        {
            if(this.orientation === 'horizontal') {
                if(this.setMinValue) {
                    this.thumbs[0].item.css({ left: this.getPrecentFromUnits(this.setMinValue)});
                }
                if(this.type === 'double' && this.setMaxValue){
                    this.thumbs[1].item.css({ left: this.getPrecentFromUnits(this.setMaxValue)});
                }
            }
            
            if(this.orientation === 'vertical') {
                if(this.setMinValue) {
                    this.thumbs[0].item.css({ top: this.getPrecentFromUnits(this.setMinValue)});
                }
                if(this.type === 'double' && this.setMaxValue){
                    this.thumbs[1].item.css({ top: this.getPrecentFromUnits(this.setMaxValue)});
                }
            }
        }

        this.setSizeProgressbar();

        this.sliderLine.item.on('click', (event)=>{
            let sliderLineCoords = this.getCoords(this.sliderLine.item);

            if(this.orientation === 'horizontal') {
                // на скольких пикселях от линии произошел клик
                let pixelClick = event.clientX - sliderLineCoords.left;

                //на скольких процентах от линии произошел клик
                let pixelClickPrecent= pixelClick / this.sliderLinePixelSize * 100;

                //прировнять проценты клика к шагу
                let stepLeft = Math.round(pixelClickPrecent / this.stepPercent) * this.stepPercent;

                if(this.type === 'single') {
                    this.thumbs[0].item.css({ left: stepLeft + "%" });
                    this.setSizeProgressbar();
                }
                if(this.type === 'double') {
                    const minPrecent = parseInt(document.querySelector('.slider29__thumb--min').style.left);
                    const maxPrecent = parseInt(document.querySelector('.slider29__thumb--max').style.left);
                    const middlePrecent = minPrecent + ((maxPrecent - minPrecent) / 2);

                    if(pixelClickPrecent < middlePrecent) {
                        this.thumbs[0].item.css({ left: stepLeft + "%" });
                    } else {
                        this.thumbs[1].item.css({ left: stepLeft + "%" });
                    }
                    this.setSizeProgressbar();
                }
            }
            
            if(this.orientation === 'vertical') {
                // на скольких пикселях от линии произошел клик
                let pixelClick = event.clientY - sliderLineCoords.top;

                //на скольких процентах от линии произошел клик
                let pixelClickPrecent= pixelClick / sliderLinePixelSize * 100;

                //прировнять проценты клика к шагу
                let stepTop = Math.round(pixelClickPrecent / stepPercent) * stepPercent;

                if(this.type === 'single') {
                    this.thumbs[0].item.css({ top: stepTop + "%" });
                    this.setProgressbar();
                }

                if(this.type === 'double') {
                    const minPrecent = parseInt(document.querySelector('.slider29__thumb--min').style.top);
                    const maxPrecent = parseInt(document.querySelector('.slider29__thumb--max').style.top);
                    const middlePrecent = minPrecent + ((maxPrecent - minPrecent) / 2);

                    if(pixelClickPrecent < middlePrecent) {
                        this.thumbs[0].item.css({ top: stepTop + "%" });
                    } else {
                        this.thumbs[1].item.css({ top: stepTop + "%" });
                    }
                    this.setProgressbar();
                }

            }
        });



        $.each(thumbs, function(){
            $(this).on('mousedown', clickOnThumb);
        })
    }
}   



