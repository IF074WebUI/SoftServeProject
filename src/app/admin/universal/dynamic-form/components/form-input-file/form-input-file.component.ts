import {Component, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-form-input-file',
  templateUrl: './form-input-file.component.html',
  styleUrls: ['./form-input-file.component.scss']
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

  imageChange($event): void {
    this.readThis($event.target);
    var preview = document.querySelector('img');
  }

  readThis(inputValue: any): void {
    const file: File = inputValue.files[0];
    const myReader: FileReader = new FileReader();

    myReader.onloadend = (e) => {
      let string = myReader.result;
      this.group.controls['photo'].setValue(string);

      //  this.config.name = myReader.result;
     // console.log(this.group.controls[this.config.name + 1].value);
    };
    myReader.readAsDataURL(file);
    this.readAndPreview(file);
  }

  readAndPreview(file) {
    var preview = document.querySelector('#preview');
    // Make sure `file.name` matches our extensions criteria
    if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
      var reader = new FileReader();

      reader.addEventListener("load", function () {
        var image = new Image();
        image.height = 100;
        image.title = file.name;
        image.src = this.result;
        preview.appendChild(image);
      }, false);

      reader.readAsDataURL(file);
    }

  }

}

