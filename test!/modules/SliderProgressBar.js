export class SliderProgressBar {
    constructor(sliderLine){
        this.item = $('<span>', {class: 'slider29__progressbar'});
        sliderLine.prepend(this.item);
    }
}