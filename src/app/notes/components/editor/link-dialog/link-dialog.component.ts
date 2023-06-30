import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-link-dialog',
  templateUrl: './link-dialog.component.html',
  styleUrls: ['./link-dialog.component.scss']
})
export class LinkDialogComponent implements OnInit, OnDestroy {

  @Input()
  showDialog = false;
  @Output()
  closed: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  saved: EventEmitter<{title: string; url: string}> = new EventEmitter<{title: string; url: string}>();
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
  saveLink() {
    if (this.formGroup.value.url && this.formGroup.value.title) {
      this.saved.emit({
        url: this.formGroup.value.url,
        title: this.formGroup.value.title
      });
      this.formGroup.patchValue({url: '', title: ''});
    }
  }

  closeOnEsc(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closed.emit();
    }
  }
}
