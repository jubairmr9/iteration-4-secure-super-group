import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {contact} from "./contact";
import {ContactService} from "./contact.service";
import {MatDialog} from "@angular/material/dialog";
import {AddContactComponent} from "./add-contact.component";
import {EditContactComponent} from "./edit-contact.component";
import {MatButtonToggleChange} from '@angular/material';

@Component({
    selector: 'contact-component',
    templateUrl: 'contact.component.html',
    styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit{
    // These are public so that tests can reference them (.spec.ts)
    public contact: contact[];
    public filteredContact: contact[];
    public userID: string = localStorage.getItem('userID');

    // These are the target values used in searching.
    // We should rename them to make that clearer.
    public contactName: string;
    public selectedContact: contact;

    private highlightedID: {'$oid': string} = { '$oid': '' };


    // Inject the ResourcesListService into this component.
    constructor(public contactService: ContactService, public dialog: MatDialog) {

    }
    isHighlighted(contact: contact): boolean {
        return contact._id['$oid'] === this.highlightedID['$oid'];
    }

    openDialog(): void {
        const newContact: contact = {_id: '', name: '', email: '', phone: '', userID: this.userID, favorite : false};
        const dialogRef = this.dialog.open(AddContactComponent, {
            width: '500px',
            data: { contact: newContact }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.contactService.addContact(result).subscribe(
                addContactResult => {
                    this.highlightedID = addContactResult;
                    this.refreshContact();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error adding the contacts.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }



    //trying


    openDialogSelect(): void {
        const newContact: contact = {_id: '', name: '', email: '', phone: '', userID:this.userID, favorite: false};
        const dialogRef = this.dialog.open(AddContactComponent, {
            width: '500px',
            data: { contact: newContact }
        });

        dialogRef.afterClosed().subscribe(result => {
            if(result != null) {
                this.selectedContact = result;
            }
        });
    }


    openDialogReview(_id: string, name : string, email : string, phone : string, favorite : boolean): void {
        const editContact: contact = {_id: _id, name: name, email: email, phone: phone, userID: this.userID, favorite: favorite};

        const dialogRef = this.dialog.open(EditContactComponent, {
            width: '500px',
            data: { contact: editContact }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.contactService.editContact(result).subscribe(
                editContactResult => {
                    this.refreshContact();
                },
                err => {
                    // This should probably be turned into some sort of meaningful response.
                    console.log('There was an error editing the contact.');
                    console.log('The error was ' + JSON.stringify(err));
                });
        });
    }

    deleteContact(_id: string){
        this.contactService.deleteContact(_id).subscribe(
            contact => {
                this.refreshContact();
                this.loadService();
            },
            err => {
                console.log(err);
                this.refreshContact();
                this.loadService();
            }
        );
    }

    loadService(): void {
        this.contactService.getContact('').subscribe(
            contact => {
                this.contact = contact;
                this.filteredContact = this.contact;
            },
            err => {
                console.log(err);
            }
        );
    }

    public filterContact(searchName): contact[] {

        this.filteredContact = this.contact;

        // Filter by name
        if (searchName != null) {
            searchName = searchName.toLocaleLowerCase();

            this.filteredContact = this.filteredContact.filter(contact => {
                return !searchName || contact.name.toLowerCase().indexOf(searchName) !== -1;
            });
        }
        return this.filteredContact;
    }

    /**
     * Starts an asynchronous operation to update the resources list
     *
     */
    refreshContact(): Observable<contact[]> {
        // Get Resources returns an Observable, basically a "promise" that
        // we will get the data from the server.
        //
        // Subscribe waits until the data is fully downloaded, then
        // performs an action on it (the first lambda)

        const contactListObservable: Observable<contact[]> = this.contactService.getContact();
        contactListObservable.subscribe(
            contact => {
                this.contact = contact;
                this.filterContact(this.contactName);
            },
            err => {
                console.log(err);
            });
        return contactListObservable;
    }

    public changeValue(contact : contact): void{
        console.log(contact.favorite);
        let fav : boolean = false;
        if(contact.favorite == false){
            fav = true;
        }
        else{
            fav = false
        }
        const updatedContact: contact = {_id: contact._id['$oid'], name: contact.name, email: contact.email, phone: contact.phone, userID: this.userID, favorite: fav};
        this.contactService.editContact(updatedContact).subscribe(
            editGoalResult => {
                this.highlightedID = editGoalResult;
                this.refreshContact();
            },
            err => {
                console.log('There was an error editing the contact.');
                console.log('The error was ' + JSON.stringify(err));
            });
    }


    ngOnInit(): void {
        this.refreshContact();
    }
}
