import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessService {

  public debug_size_before: string[] = [];
 public debug_size_after: string[] = [];
 public file_srcs: string[] = [];
 imgpath: string;

  constructor() { }


  readFile(file, reader, callback) {
    reader.onload = () => {
      callback(reader.result);
      // console.log(reader.result);
    };
    reader.readAsDataURL(file);
  }

  file(files, index = 0) {
    const reader = new FileReader();
    // If there is a file
    if (index in files) {
      // Start reading this file
      this.readFile(files[index], reader, (result) => {
        // Create an img element and add the image file data to it
        const img = document.createElement('img');
        img.src = result;
        // Send this img to the resize function (and wait for callback)
        this.resize(img, 250, 250, (resized_jpeg, before, after) => {
          // For debugging (size in bytes before and after)
          this.debug_size_before.push(before);
          this.debug_size_after.push(after);
          // Add the resized jpeg img source to a list for preview
          // This is also the file you want to upload. (either as a
          // base64 string or img.src = resized_jpeg if you prefer a file).
          this.file_srcs.push(resized_jpeg);
          this.imgpath =  resized_jpeg;
          // Read the next file;
          // this.readFiles(files, index + 1);
        });
      });
    }

    return this.imgpath;
  }

  resize(img, MAX_WIDTH: number, MAX_HEIGHT: number, callback) {
    // This will wait until the img is loaded before calling this function
    return img.onload = () => {
      // Get the images current width and height
      let width = img.width;
      let height = img.height;
      // Set the WxH to fit the Max values (but maintain proportions)
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
      // create a canvas object
      const canvas = document.createElement('canvas');
      // Set the canvas to the new calculated dimensions
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      // Get this encoded as a jpeg
      // IMPORTANT: 'jpeg' NOT 'jpg'
      const dataUrl = canvas.toDataURL('image/jpeg');
      // callback with the results
      callback(dataUrl, img.src.length, dataUrl.length);
    };
  }
}
