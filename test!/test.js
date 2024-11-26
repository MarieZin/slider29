class Slider {
    constructor(container){
        this.slider = container;
        this.sliderLine = new SliderLine();
    }

    setSliderLine(){
        this.slider.append(this.sliderLine.sliderLine);
    }
}

class SliderLine {
    constructor(){
        this.sliderLine = $('<div>', {class: 'slider29__line'});
    }
}


const slider = new Slider($(".slider29")).setSliderLine();