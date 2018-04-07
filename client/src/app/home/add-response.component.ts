import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {Response} from './response.component';

@Component({
    selector: 'app-add-response.component',
    templateUrl: 'add-response.component.html',
})

export class AddResponseComponent {

    constructor(
        public dialogRef: MatDialogRef<AddResponseComponent>,
        @Inject(MAT_DIALOG_DATA) public data: {response: Response}) {
    }

    public userEmail = localStorage.getItem('email');

    onNoClick(): void {
        this.dialogRef.close();
    }
}