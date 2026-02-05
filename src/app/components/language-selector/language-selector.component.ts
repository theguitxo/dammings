import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChildren,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter, take } from 'rxjs/operators';
import {
  DialogLanguageDialogData,
  LANGUAGES,
  LangItem,
} from '../../app.models';
import { isMobileDevice } from '../../app.utils';
import { DialogService } from '../../modules/dialog/dialog.service';
import { DialogLanguageSelectorComponent } from './dialog/dialog-language-selector.component';

const LANG_ICON_PATH = 'assets/images/languages/';

@Component({
  selector: 'dammings-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslateModule],
})
export class LanguageSelectorComponent implements OnInit, AfterViewInit {
  @ViewChildren('button') buttons!: QueryList<ElementRef>;

  private readonly translate = inject(TranslateService);
  private readonly renderer = inject(Renderer2);
  private readonly dialog = inject(DialogService);
  private readonly destroyRef = inject(DestroyRef);

  protected langsItems = signal<LangItem[]>([
    {
      code: LANGUAGES.ENGLISH,
      icon: `${LANG_ICON_PATH}english.png`,
      lang: 'language-selector.english',
      selected: false,
    },
    {
      code: LANGUAGES.SPANISH,
      icon: `${LANG_ICON_PATH}spanish.png`,
      lang: 'language-selector.spanish',
      selected: false,
    },
    {
      code: LANGUAGES.CATALAN,
      icon: `${LANG_ICON_PATH}catalan.png`,
      lang: 'language-selector.catalan',
      selected: false,
    },
  ]);

  protected buttonsList!: WritableSignal<ElementRef[]>;
  protected actualButtonIndex!: WritableSignal<number>;
  protected showArrows = signal<boolean>(false);
  protected showPrevArrow = signal<boolean>(false);
  protected showNextArrow = signal<boolean>(false);
  protected showingSelected = signal(false);

  ngOnInit(): void {
    this.showArrows.set(!isMobileDevice());
    this.setSelected();
    this.initOnLangChangeSubscription();
  }

  ngAfterViewInit(): void {
    this.buttonsList = signal(Array.from(this.buttons));
    this.actualButtonIndex = signal(
      this.langsItems()?.findIndex((item) => item.selected) || 0,
    );
    this.setShowArrowValues();
    this.updateButtonsPosition();
    this.setShowSelected();
  }

  protected moveLang(dir: number): void {
    this.actualButtonIndex.update((value) => value + dir);
    this.setShowArrowValues();
    this.updateButtonsPosition();
    this.setSelected();
    this.setShowSelected();
  }

  protected selectLang(event: LangItem): void {
    if (isMobileDevice()) {
      this.openLanguageDialog();
    } else if (!event.selected) {
      this.translate.use(event.code);
    }
  }

  private openLanguageDialog(): void {
    const dialogData: DialogLanguageDialogData = {
      langs: this.langsItems().filter((lang) => !lang.selected),
    };

    const dialogRef = this.dialog.open(DialogLanguageSelectorComponent, {
      data: dialogData,
    });

    dialogRef.afterClosed
      .pipe(
        take(1),
        filter((lang) => !!lang),
      )
      .subscribe((lang: string) => {
        this.translate.use(lang);
      });
  }

  private initOnLangChangeSubscription(): void {
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.setSelected();
        if (isMobileDevice()) {
          this.actualButtonIndex.set(
            this.langsItems().findIndex((item) => item.selected) * -1,
          );
          this.updateButtonsPosition();
        }
        this.setShowSelected();
      });
  }

  private setSelected(): void {
    this.langsItems()?.forEach(
      (item) => (item.selected = item.code === this.translate.currentLang),
    );
  }

  private setShowSelected(): void {
    const indexSelected =
      this.langsItems()?.findIndex((item) => item.selected) || 0;
    this.showingSelected.set(
      Math.abs(this.actualButtonIndex()) === indexSelected,
    );
  }

  private updateButtonsPosition(): void {
    const newLeft = this.actualButtonIndex() * 100;
    this.buttonsList()?.forEach((item) =>
      this.renderer.setStyle(item.nativeElement, 'left', `${newLeft}%`),
    );
  }

  private setShowArrowValues(): void {
    this.showPrevArrow.set(Math.abs(this.actualButtonIndex()) > 0);
    this.showNextArrow.set(
      Math.abs(this.actualButtonIndex()) < this.buttonsList().length - 1,
    );
  }

  protected changeSource(event: Event): void {
    (event.target as HTMLImageElement).src =
      'assets/images/languages/default.png';
  }
}
