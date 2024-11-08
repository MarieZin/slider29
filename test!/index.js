// function Clock({ template }) {
  
//     let timer;
  
//     function render() {
//       let date = new Date();
  
//       let hours = date.getHours();
//       if (hours < 10) hours = '0' + hours;
  
//       let mins = date.getMinutes();
//       if (mins < 10) mins = '0' + mins;
  
//       let secs = date.getSeconds();
//       if (secs < 10) secs = '0' + secs;
  
//       let output = template
//         .replace('h', hours)
//         .replace('m', mins)
//         .replace('s', secs);
  
//       console.log(output);
//     }
  
//     this.stop = function() {
//       clearInterval(timer);
//     };
  
//     this.start = function() {
//       render();
//       timer = setInterval(render, 1000);
//     };
  
//   }
  
//   let clock = new Clock({template: 'h:m:s'});
//   clock.start();


  class NewClock {
    timer;

      constructor({template}){
        this.stop = function() {
            learInterval(this.timer);
        };
        
        this.start = function() {
            this.render();
            this.timer = setInterval(this.render, 1000);
        };

        this.render = function() {
          let date = new Date();
      
          let hours = date.getHours();
          if (hours < 10) hours = '0' + hours;
      
          let mins = date.getMinutes();
          if (mins < 10) mins = '0' + mins;
      
          let secs = date.getSeconds();
          if (secs < 10) secs = '0' + secs;
      
          let output = template
            .replace('h', hours)
            .replace('m', mins)
            .replace('s', secs);
      
          console.log(output);
        }
      }
  }


  let clock = new NewClock({template: 'h:m:s'});
  clock.start();