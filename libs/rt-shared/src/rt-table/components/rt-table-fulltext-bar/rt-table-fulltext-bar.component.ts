import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'lib-rt-table-fulltext-bar',
  templateUrl: './rt-table-fulltext-bar.component.html',
  styleUrls: ['./rt-table-fulltext-bar.component.scss'],
})
export class RtTableFulltextBarComponent implements OnInit {
  fulltextSearch: FormControl = new FormControl<string>('');

  @Output() fulltextSearchEvent: EventEmitter<string> =
    new EventEmitter<string>();

  ngOnInit(): void {
    this.fulltextSearch.valueChanges
      .pipe(debounceTime(800))
      .subscribe((text: string) => {
        this.fulltextSearchEvent.emit(text);
      });
  }

  @Input()
  set value(text: string) {
    this.fulltextSearch.setValue(text);
  }
}
