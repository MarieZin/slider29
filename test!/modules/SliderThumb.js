export class SliderThumb {
    constructor(sliderLine){
        this.item = $('<span>', {class: 'slider29__thumb'});
        sliderLine.append(this.item);
    }

    addMinClass(){
        this.item.addClass('slider29__thumb--min');
        return this;
    }

    addMaxClass(){
        this.item.addClass('slider29__thumb--max');
        return this;
    }
}