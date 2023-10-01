import {
  AfterViewInit, ChangeDetectionStrategy,
  Component, DestroyRef, ElementRef,
  OnInit, QueryList, Renderer2,
  ViewChildren, inject
} from "@angular/core";
import { TranslateModule, TranslateService } from "@ngx-translate/core";
import { LANGUAGES } from "../../app.models";
import { CommonModule } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

interface LangItem {
  code: LANGUAGES;
  icon: string;
  lang: string;
  selected: boolean;
}

const LANG_ICON_PATH = 'assets/images/languages/';

@Component({
  selector: 'dammings-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TranslateModule]
})
export class LanguageSelectorComponent implements OnInit, AfterViewInit {
  @ViewChildren('button') buttons!: QueryList<ElementRef>;

  destroyRef = inject(DestroyRef);

  langsItems: LangItem[] = [
    {
      code: LANGUAGES.ENGLISH,
      icon: `${LANG_ICON_PATH}english.png`,
      lang: 'language-selector.english',
      selected: false
    },
    {
      code: LANGUAGES.SPANISH,
      icon: `${LANG_ICON_PATH}spanish.png`,
      lang: 'language-selector.spanish',
      selected: false
    },
    {
      code: LANGUAGES.CATALAN,
      icon: `${LANG_ICON_PATH}catalan.png`,
      lang: 'language-selector.catalan',
      selected: false
    }
  ];
  buttonsList!: ElementRef[];
  actualButtonIndex!: number;
  showPrevArrow!: boolean;
  showNextArrow!: boolean;
  showSelected!: boolean;

  constructor(
    private translate: TranslateService,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.setSelected();
    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
      this.setSelected();
      this.setShowSelected();
    })

  }

  ngAfterViewInit(): void {
    this.buttonsList = Array.from(this.buttons);
    this.actualButtonIndex = this.langsItems?.findIndex(item => item.selected) || 0;
    this.setShowArrowValues();
    this.updateButtonsPosition();
    this.setShowSelected();
  }

  moveLang(dir: number): void {
    this.actualButtonIndex += dir;
    this.setShowArrowValues();
    this.updateButtonsPosition();
    this.setSelected();
    this.setShowSelected();
  }

  selectLang(event: LangItem): void {
    if (!event.selected) {
      this.translate.use(event.code);
    }
  }

  private setSelected(): void {
    this.langsItems?.forEach(item => item.selected = item.code === this.translate.currentLang);
  }

  private setShowSelected(): void {
    const indexSelected = this.langsItems?.findIndex(item => item.selected) || 0;
    this.showSelected = Math.abs(this.actualButtonIndex) === indexSelected;
  }

  private updateButtonsPosition(): void {
    const newLeft = this.actualButtonIndex * 100;
    this.buttonsList?.forEach(item => this.renderer.setStyle(item.nativeElement, 'left', `${newLeft}%`));
  }

  private setShowArrowValues(): void {
    this.showPrevArrow = Math.abs(this.actualButtonIndex) > 0;
    this.showNextArrow = Math.abs(this.actualButtonIndex) < this.buttonsList.length - 1;
  }
}
