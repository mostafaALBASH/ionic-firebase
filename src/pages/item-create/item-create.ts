import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { storage } from 'firebase';
import { Camera } from '@ionic-native/camera';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-item-create',
    templateUrl: 'item-create.html',
    providers: [
      Camera
    ]
})
export class ItemCreatePage {
 // @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;
  imgsrc: any;
  form: FormGroup;
  //, public camera: Camera
  constructor(public camera: Camera, public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder, public afDatabase: AngularFireDatabase) {
    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      about: ['']
   
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {

  }
  
  getPicture() {

      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 500,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        targetHeight: 500
      }).then((data) => {
        const pic = storage().ref('/picture').child('qw')
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
        const src = ('data:image/jpg;base64,' + data);
        pic.putString(src, 'data_url')
        
      }, (err) => {
        alert('Unable to take photo');
      })
    
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    console.log('dd', this.form)
    this.afDatabase.database.ref('/items').push({
      about: this.form.value.about,
      profilePic: 'https://assets.academy.com/mgen/65/20082765.jpg?wid=250&hei=250',
      name: this.form.value.name
    })
    if (!this.form.valid) { return; }
    this.viewCtrl.dismiss(this.form.value);
  }
}
