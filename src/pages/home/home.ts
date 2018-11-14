import { Component } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import { IonicPage, ModalController, NavController, ActionSheetController } from 'ionic-angular';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [Firebase]
})

export class HomePage {

  searchQuery: string = '';
  items: any[];
  songs: any;


  constructor(private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, public actionSheetCtrl: ActionSheetController,public navController: NavController, public firebase: Firebase, public afDatabase: AngularFireDatabase, public modalCtrl: ModalController) {
    this.initializeItems();
    
  }
  //public presentActionSheet() {
  //  let actionSheet = this.actionSheetCtrl.create({
  //    title: 'Select Image Source',
  //    buttons: [
  //      {
  //        text: 'Load from Library',
  //        handler: () => {
  //          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
  //        }
  //      },
  //      {
  //        text: 'Use Camera',
  //        handler: () => {
  //          this.takePicture(this.camera.PictureSourceType.CAMERA);
  //        }
  //      },
  //      {
  //        text: 'Cancel',
  //        role: 'cancel'
  //      }
  //    ]
  //  });
  //  actionSheet.present();
  //}
  //// Create a new name for the image
  //private createFileName() {
  //  var d = new Date(),
  //    n = d.getTime(),
  //    newFileName = n + ".jpg";
  //  return newFileName;
  //}
  //private copyFileToLocalDir(namePath, currentName, newFileName) {
  //  this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
  //    this.lastImage = newFileName;
  //  }
  //}
  //public takePicture(sourceType) {
  //  // Create options for the Camera Dialog
  //  var options = {
  //    quality: 100,
  //    sourceType: sourceType,
  //    saveToPhotoAlbum: false,
  //    correctOrientation: true
  //  };

  //  // Get the data of an image
  //  this.camera.getPicture(options).then((imagePath) => {
  //    // Special handling for Android library
  //    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
  //      this.filePath.resolveNativePath(imagePath)
  //        .then(filePath => {
  //          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
  //          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
  //          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
  //        });
  //    } else {
  //      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
  //      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
  //      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
  //    }
  //  }
  //};
  

  initializeItems() {
   this.afDatabase.list('/items').valueChanges().subscribe(data => {
     this.items=data;
     console.log('data', data);
     
   });
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  openItem(item: any) {
    console.log(item);
    this.navController.push('ItemDetailPage', {
      item: item
    });
  }

  addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
     /* if (item) {
        this.items.add(item);
      }*/
    })
    addModal.present();
    
  }
  

}
