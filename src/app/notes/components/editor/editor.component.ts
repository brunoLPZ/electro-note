import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input, NgZone, OnChanges, OnDestroy,
  OnInit,
  Output, SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Note} from '../../models/note';
import {NoteService} from '../../services/note-service';
import {ElectronService} from '../../../core/services';
import {NotificationService} from '../../../core/services/electron/notification.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EditorComponent implements OnInit, OnChanges, OnDestroy {

  @Input()
  note!: Note;
  @ViewChild('textArea')
  textArea!: ElementRef<HTMLTextAreaElement>;
  @Output()
  saved: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  edit: EventEmitter<string> = new EventEmitter<string>();
  @Output()
  delete: EventEmitter<Note> = new EventEmitter<Note>();
  edited = false;
  showPreview = true;
  previewFullScreen = false;
  singleMode = false;
  showLinkDialog = false;
  showImageDialog = false;
  showCodeDialog = false;
  screenWidth!: number;

  constructor(private noteService: NoteService, private electronService: ElectronService,
              private zone: NgZone, private notificationService: NotificationService,
              private elementRef: ElementRef) {
    this.electronService.ipcRenderer.on('save', () => {
      this.zone.run(() => this.saveNote());
    });
    this.electronService.ipcRenderer.on('heading', () => {
      this.zone.run(() => this.addHeader(1));
    });
    this.electronService.ipcRenderer.on('bold', () => {
      this.zone.run(() => this.applyTextStyle('bold'));
    });
    this.electronService.ipcRenderer.on('italic', () => {
      this.zone.run(() => this.applyTextStyle('italic'));
    });
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 1050) {
      this.singleMode = true;
    } else {
      this.singleMode = false;
    }
  }

  ngOnInit() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 1050) {
      this.singleMode = true;
    } else {
      this.singleMode = false;
    }
  }

  ngOnDestroy() {
    this.electronService.ipcRenderer.removeAllListeners('save');
  }


  ngOnChanges(changes: SimpleChanges) {
    if (changes.note.previousValue?.uuid !== changes.note.currentValue?.uuid) {
      this.edited = false;
    }
  }

  addHeader(level: number) {
    const textArea = this.textArea.nativeElement;
    let prefix = '';
    for (let i= 0; i < level; i++) {
      prefix += '#';
    }
    const originalStart = textArea.selectionStart;
    // Find first \n or 0 before selectionStart
    let index = textArea.selectionStart;
    if (this.note.content[index] === '\n') {
      index--;
    }
    for (index; index > 0; index--) {
      if (this.note.content[index] === '\n') {
        break;
      }
    }
    if (index > 0) {
      index++;
    }
    if (this.note.content[index] !== '#') {
      if (index === 0) {
        this.note.content = prefix + ' ' + this.note.content;
      } else {
        this.note.content = this.note.content.substring(0, index) + prefix + ' ' + this.note.content.substring(index);
      }
      this.resetCursorPosition(originalStart + prefix.length + 1);
    }
  }

  changeShowPreview() {
    if (this.showPreview) {
      this.showPreview = false;
      this.previewFullScreen = false;
    } else {
      this.showPreview = true;
    }
  }

  applyTextStyle(style: 'bold' | 'italic' | 'line-through') {
    const textArea = this.textArea.nativeElement;
    let decorator;
    switch (style) {
      case 'bold':
        decorator = '**';
        break;
      case 'italic':
        decorator = '*';
        break;
      default:
        decorator = '~';
    }
    if (textArea.selectionStart !== textArea.selectionEnd) {
      this.note.content = this.note.content.substring(0, textArea.selectionStart) +
        decorator +
        this.note.content.substring(textArea.selectionStart, textArea.selectionEnd) +
        decorator +
        this.note.content.substring(textArea.selectionEnd);
    }
    this.resetCursorPosition(textArea.selectionStart + decorator.length * 2 + (textArea.selectionEnd - textArea.selectionStart));
  }

  generateTable() {
    const table =
      '\n| a | b | c |\n' +
      '|---|---|---|\n' +
      '| a | b | c |\n';
    const textArea = this.textArea.nativeElement;
    const originalStart = textArea.selectionStart;
    if (textArea.selectionStart === textArea.selectionEnd) {
      this.note.content = this.note.content.substring(0, textArea.selectionStart) + table
       + this.note.content.substring(textArea.selectionStart);
      this.resetCursorPosition(originalStart + table.length);
    }
  }

  openLinkDialog() {
    this.showLinkDialog = true;
  }

  addLink(link: {title: string; url: string}) {
    this.showLinkDialog = false;
    const position = this.textArea.nativeElement.selectionStart;
    const markdownLink = `[${link.title}](${link.url})`;
    this.note.content = this.note.content.substring(0, position) +
      markdownLink + this.note.content.substring(position);
    this.resetCursorPosition(position + markdownLink.length);
  }

  openImageDialog() {
    this.showImageDialog = true;
  }

  addImage(image: {title: string; url: string}) {
    this.showImageDialog = false;
    const position = this.textArea.nativeElement.selectionStart;
    const markdownImage = `![${image.title}](${image.url})`;
    this.note.content = this.note.content.substring(0, position) +
      markdownImage + this.note.content.substring(position);
    this.resetCursorPosition(position + markdownImage.length);
  }

  openCodeDialog() {
    this.showCodeDialog = true;
  }

  addCode(code: {language: string; code: string}) {
    this.showCodeDialog = false;
    const position = this.textArea.nativeElement.selectionStart;
    const markdownCode = '```' + code.language + '\n' + code.code + '\n```';
    this.note.content = this.note.content.substring(0, position) +
      markdownCode + this.note.content.substring(position);
    this.resetCursorPosition(position + markdownCode.length);
  }

  editNote() {
    if (!this.edited) {
      this.edited = true;
      this.saved.emit(false);
    }
  }

  saveNote() {
    this.noteService.upsertNote(this.note).then((result) => {
      if (result) {
        this.edited = false;
        this.saved.emit(true);
        this.notificationService.showNotification(this.note.title, 'Changes have been saved');
      } else {
        this.notificationService.showNotification('Error', 'Error saving note changes');
      }
    });
  }

  handleTabs(event: Event) {
    event.preventDefault();
    const textArea = event.target as HTMLTextAreaElement;
    const start = textArea.selectionStart;
    const end = textArea.selectionEnd;

    this.note.content = this.note.content.substring(0, start) +
      '  ' + this.note.content.substring(end);

    this.resetCursorPosition(start + 2);
  }

  syncScroll() {
    const textArea = this.textArea.nativeElement;
    const preview = this.elementRef.nativeElement.querySelector('#preview') as HTMLDivElement;

    const proportion = textArea.scrollTop / (textArea.scrollHeight - textArea.clientHeight);

    preview.scrollTop = proportion * (preview.scrollHeight - preview.clientHeight);
  }

  resetCursorPosition(position: number) {
    setTimeout(() => {
      this.textArea.nativeElement.selectionStart = position;
      this.textArea.nativeElement.selectionEnd = this.textArea.nativeElement.selectionStart;
      this.textArea.nativeElement.focus();
    });
  }
}
