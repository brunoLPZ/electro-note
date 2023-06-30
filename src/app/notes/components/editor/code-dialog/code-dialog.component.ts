import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-code-dialog',
  templateUrl: './code-dialog.component.html',
  styleUrls: ['./code-dialog.component.scss']
})
export class CodeDialogComponent implements OnInit, OnDestroy {

  @Input()
  showDialog = false;
  @Output()
  closed: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  saved: EventEmitter<{language: string; code: string}> = new EventEmitter<{language: string; code: string}>();

  supportedLanguages = [
    'bash',
    'c',
    'html',
    'java',
    'javascript',
    'python',
    'typescript'
  ];
  formGroup = new FormGroup({
    language: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required])
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

  saveCode() {
    if (this.formGroup.value.language && this.formGroup.value.code) {
      this.saved.emit({
        language: this.formGroup.value.language,
        code: this.formGroup.value.code
      });
      this.formGroup.patchValue({language: '', code: ''});
    }
  }

  handleTabs(event: Event) {
    event.preventDefault();
    const textArea = event.target as HTMLTextAreaElement;
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;

    textArea.value = textArea.value.substring(0, start) +
      '  ' + textArea.value.substring(end);

    setTimeout(() => {
      textArea.selectionStart = start + 2;
      textArea.selectionEnd = textArea.selectionStart;
    });
  }

  closeOnEsc(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closed.emit();
    }
  }
}
