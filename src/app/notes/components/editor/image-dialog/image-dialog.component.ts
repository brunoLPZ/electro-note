import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-image-dialog',
  templateUrl: './image-dialog.component.html',
  styleUrls: ['./image-dialog.component.scss']
})
export class ImageDialogComponent implements OnInit, OnDestroy {

  @Input()
  showDialog = false;
  @Output()
  closed: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  saved: EventEmitter<{title: string; url: string}> = new EventEmitter<{title: string; url: string}>();
  image: any;
  formGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    url: new FormControl('', [Validators.required])
  });

  closeListener = (event: KeyboardEvent) => {
    this.closeOnEsc(event);
  };

  ngOnInit() {
    document.addEventListener('keydown', this.closeListener);
  }

  ngOnDestroy() {
    document.removeEventListener('keydown', this.closeListener);
  }

  handleImageUpload(event: any) {
    const file = event.target.files[0];
    this.image = `electronote://${file.path}`;
    this.formGroup.get('url')?.clearValidators();
    this.formGroup.get('url')?.updateValueAndValidity();
  }

  saveImage() {
    if (this.formGroup.value.title && (this.image || this.formGroup.value.url)) {
      this.saved.emit({
        title: this.formGroup.value.title,
        url: this.image || this.formGroup.value.url
      });
      this.image = undefined;
      this.formGroup.patchValue({url: '', title: ''});
    }
  }

  closeOnEsc(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closed.emit();
    }
  }
}
