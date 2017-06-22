import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-form-input-file',
  templateUrl: './form-input-file.component.html',
  styleUrls: ['./form-input-file.component.css']
})
export class FormInputFileComponent {
  config;
  group: FormGroup;
  file_src: string;
  files;
  dataUrl;
  img;

  constructor() {
    this.file_src = '//placehold.it/200';
  }

//   previewFiles(): void {
//
//   var preview = document.querySelector('#preview');
//   var files : File = document.querySelector('input[type=file]').files[0];
// console.log(files);
//   function readAndPreview(file) {
//
//     // Make sure `file.name` matches our extensions criteria
//     if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
//       var reader = new FileReader();
//
//       reader.addEventListener("load", function () {
//         var image = new Image();
//         image.height = 100;
//         image.title = file.name;
//         image.src = this.result;
//         preview.appendChild( image );
//       }, false);
//
//       reader.readAsDataURL(file);
//     }
//
//   }
//
//   if (files) {
//     [].forEach.call(files, readAndPreview);
//   }
//
// }
// //
  imageChange($event): void {
    this.readThis($event.target);
    var preview = document.querySelector('img');

  }

  readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.config.name = myReader.result;
      console.log(this.config.name);
    };
    myReader.readAsDataURL(file);
    this.readAndPreview(file);
  }

  readAndPreview(file) {
    var preview = document.querySelector('#preview');
    // Make sure `file.name` matches our extensions criteria
    if ( /\.(jpe?g|png|gif)$/i.test(file.name) ) {
      var reader = new FileReader();

      reader.addEventListener("load", function () {
        var image = new Image();
        image.height = 100;
        image.title = file.name;
        image.src = this.result;
        preview.appendChild( image );
      }, false);

      reader.readAsDataURL(file);
    }

  }
//
//   //
//   // imageChange(event){
//   //   var input = event.target;
//   //
//   //   var reader = new FileReader();
//   //   reader.onload = function(){
//   //     var dataURL = reader.result;
//   //   };
//   //   reader.readAsDataURL(input.files[0]);
//   //
//   // };
//   //
//   //
//   // resize(img, MAX_WIDTH: number = 500, MAX_HEIGHT: number = 500) {
//   //   let canvas = document.createElement("canvas");
//   //
//   //   let width = img.width;
//   //   let height = img.height;
//   //
//   //   if (width > height) {
//   //     if (width > MAX_WIDTH) {
//   //       height *= MAX_WIDTH / width;
//   //       width = MAX_WIDTH;
//   //     }
//   //   } else {
//   //     if (height > MAX_HEIGHT) {
//   //       width *= MAX_HEIGHT / height;
//   //       height = MAX_HEIGHT;
//   //     }
//   //   }
//   //   canvas.width = width;
//   //   canvas.height = height;
//   //   var ctx = canvas.getContext("2d");
//   //
//   //   ctx.drawImage(img, 0, 0, width, height);
//   //
//   //   this.dataUrl = canvas.toDataURL('image/jpeg');
//   //   // IMPORTANT: 'jpeg' NOT 'jpg'
//   //   //  return this.dataUrl
//   // }
// //
//
//
// // Usage
//  // getDataUri('/logo.png', function(dataUri) {
//   // Do whatever you'd like with the Data URI!
// //});

}

