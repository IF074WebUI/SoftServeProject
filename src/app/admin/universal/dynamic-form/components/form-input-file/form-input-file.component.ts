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
  file_src:string;
  files;
  constructor() {
    this.file_src = "//placehold.it/200"
  }
  imageChange(event){
    var input = event.target;

    var reader = new FileReader();
    reader.onload = function(){
      var dataURL = reader.result;
    };
    reader.readAsDataURL(input.files[0]);

  };


  resize (img, MAX_WIDTH:number = 500, MAX_HEIGHT:number = 500){
    var canvas = document.createElement("canvas");


    var width = img.width;
    var height = img.height;

    if (width > height) {
      if (width > MAX_WIDTH) {
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH;
      }
    } else {
      if (height > MAX_HEIGHT) {
        width *= MAX_HEIGHT / height;
        height = MAX_HEIGHT;
      }
    }
    canvas.width = width;
    canvas.height = height;
    var ctx = canvas.getContext("2d");

    ctx.drawImage(img, 0, 0, width, height);

    var dataUrl = canvas.toDataURL('image/jpeg');
    // IMPORTANT: 'jpeg' NOT 'jpg'
    return dataUrl
  }
}
