import { SliderLine } from "./SliderLine.js";
import { SliderThumb } from "./SliderThumb.js";
import { SliderProgressBar } from "./SliderProgressBar.js";

class View {
    constructor({container, type, orientation, ruler, iconValue, minValue, maxValue}){
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.type = type;
        this.orientation = orientation;
        this.iconValue = iconValue;
        this.slider = container;
        this.sliderLine;
        this.thumbs = [];
        this.minMaxvaluesLine;
        this.progressBar;
        this.ruler = ruler;
        this.rulerElem;
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

    init(){
        //создать линию
        this.sliderLine = new SliderLine(this.slider);

        // в зависимости от типа создать количество кнопок
        {
            if(this.type === 'double') {
                this.thumbs.push(new SliderThumb(this.sliderLine.item).addMinClass());
                this.thumbs.push(new SliderThumb(this.sliderLine.item).addMaxClass());
            } else {
                this.thumbs.push(new SliderThumb(this.sliderLine.item));
            }
        }

        // создать прогрессбар
        this.progressBar = new SliderProgressBar(this.sliderLine.item);

        // установить размер прогрессбара
        this.setSizeProgressbar();
    }
}

class Controller {
    constructor({container, type, orientation, ruler, iconValue, minValue, maxValue}) {
        this.view = new View({
            container,
            type,
            orientation,
            ruler,
            iconValue,
            minValue,
            maxValue,
        });

        this.view.init();
        this.model = new Model();
        this.sliderLinePixelSize = this.sliderLine.item.outerWidth();

        for(let thumb of this.view.thumbs) {
            thumb.item.on('mousedown', this.clickOnThumb.bind(this))
        }
    } 

    clickOnThumb(event){
        //получим все необходимые координаты
        let lineThumbCoords = this.model.getCoords(this.view.sliderLine.item);
        let minThumbCoords = this.model.getCoords(this.view.thumbs[0].item);  
        let maxThumbCoords = this.view.thumbs[1] ? this.model.getCoords(this.view.thumbs[1].item) : null;
        //текущая кнопка
        let currenThumb = $(event.target);
        let currentThumbCoords = this.model.getCoords(currenThumb);

        //на скольких процентах сейчас находится кнопка макисмума
        let maxThumbPrecentStart;
        if(this.view.orientation === 'horizontal') {
            if (maxThumbCoords) {
                maxThumbPrecentStart = (maxThumbCoords.left - lineThumbCoords.left) / sliderLinePixelSize * 100;
            }
        }
        if(this.view.orientation === 'vertical') {
            if (maxThumbCoords) {
                maxThumbPrecentStart = (maxThumbCoords.top - lineThumbCoords.top) / sliderLinePixelSize * 100;
            }
        }

        //на скольких процентах сейчас находится кнопка минимума
        let minThumbPrecentStart
        if(this.view.orientation === 'horizontal') {
            minThumbPrecentStart = (minThumbCoords.left - lineThumbCoords.left) / sliderLinePixelSize * 100;
        }
        if(this.view.orientation === 'vertical') {
            minThumbPrecentStart = (minThumbCoords.top - lineThumbCoords.top) / sliderLinePixelSize * 100;
        }

        //получить смещение клика
        let shiftThumbCoords = this.model.differenceClickAndStartThumb(currentThumbCoords);


        $(document).on("mousemove", function (event) {
            // на скольких процентах от ширины линии находится курсор
            let precentStartThumb = this.model.coordsThumbPrecent(event, shiftThumbCoords, lineThumbCoords);
            
            
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


            if(this.view.orientation === 'horizontal') {
                currenThumb.css({ left: stepLeft + "%" });
            }
            if(this.view.orientation === 'vertical') {
                currenThumb.css({ top: stepLeft + "%" });
            } 

            //обновить сайдбар
            this.view.setSizeProgressbar()

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

class Model {

    //генератор координат элементов
    getCoords(elem) {
        let boxLeft = elem.offset().left;
        let boxRight = boxLeft + elem.outerWidth();
        let boxTop = elem.offset().top;
        let boxBottom = boxTop + elem.outerHeight();

        return {
            left: boxLeft + window.scrollX,
            width: boxRight - boxLeft,
            top: boxTop + window.scrollY,
            height: boxBottom - boxTop,
        };
    }

    // смещение клика в пикселях
    differenceClickAndStartThumb(thumbCoords){
        let shiftClick;
        if(this.view.orientation === 'horizontal') {
            shiftClick = event.pageX - thumbCoords.left;
        }

        if(this.view.orientation === 'vertical') {
            shiftClick = event.pageY - thumbCoords.top;
        }
        return shiftClick;
    }

    //на скольких процентах от ширины линии находится ползунок
    coordsThumbPrecent(event, shiftClick, sliderLineCoords){
        let precentStartThumb;

        if(this.orientation === 'horizontal') {
            precentStartThumb = ((event.pageX - shiftClick - sliderLineCoords.left) / sliderLineCoords.width) * 100;
        }
        if(this.orientation === 'vertical') {
            precentStartThumb = ((event.pageY - shiftClick - sliderLineCoords.top) / sliderLineCoords.height) * 100;
        }
        if (precentStartThumb < 0) precentStartThumb = 0;
        if (precentStartThumb > 100) precentStartThumb = 100;

        return precentStartThumb;
    }
}

const newSlider = new Controller({
    container: $('.slider29'),
    type: 'double',
    orientation: 'horizontal',
    ruler: true,
    iconValue: true,
    maxValue: 0,
    maxValue: 300,
});