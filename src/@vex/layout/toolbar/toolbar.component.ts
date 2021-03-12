import {Component, ElementRef, HostBinding, Input, OnInit} from '@angular/core';
import {LayoutService} from '../../services/layout.service';
import icBookmarks from '@iconify/icons-ic/twotone-bookmarks';
import emojioneUS from '@iconify/icons-emojione/flag-for-flag-united-states';
import emojioneDE from '@iconify/icons-emojione/flag-for-flag-germany';
import icMenu from '@iconify/icons-ic/twotone-menu';
import {ConfigService} from '../../services/config.service';
import {map} from 'rxjs/operators';
import icPersonAdd from '@iconify/icons-ic/twotone-person-add';
import icAssignmentTurnedIn from '@iconify/icons-ic/twotone-assignment-turned-in';
import icBallot from '@iconify/icons-ic/twotone-ballot';
import icDescription from '@iconify/icons-ic/twotone-description';
import icAssignment from '@iconify/icons-ic/twotone-assignment';
import icReceipt from '@iconify/icons-ic/twotone-receipt';
import icDoneAll from '@iconify/icons-ic/twotone-done-all';
import {NavigationService} from '../../services/navigation.service';
import icArrowDropDown from '@iconify/icons-ic/twotone-arrow-drop-down';
import {PopoverService} from '../../components/popover/popover.service';
import {MegaMenuComponent} from '../../components/mega-menu/mega-menu.component';
import icSearch from '@iconify/icons-ic/twotone-search';
import {TranslateService} from '@ngx-translate/core';
import icPersonOutine from '@iconify/icons-ic/outline-person';
import {Router} from "@angular/router";


@Component({
    selector: 'vex-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

    @Input() mobileQuery: boolean;

    @Input()
    @HostBinding('class.shadow-b')
    hasShadow: boolean;

    navigationItems = this.navigationService.items;

    isHorizontalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'horizontal'));
    isVerticalLayout$ = this.configService.config$.pipe(map(config => config.layout === 'vertical'));
    isNavbarInToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'in-toolbar'));
    isNavbarBelowToolbar$ = this.configService.config$.pipe(map(config => config.navbar.position === 'below-toolbar'));

    icPersonAdd = icPersonAdd;
    icAssignmentTurnedIn = icAssignmentTurnedIn;
    icBallot = icBallot;
    icDescription = icDescription;
    icAssignment = icAssignment;
    icReceipt = icReceipt;
    icDoneAll = icDoneAll;
    icPersonOutline = icPersonOutine;
    icArrowDropDown = icArrowDropDown;
    public availableLangs = [{
        name: 'EN',
        code: 'en',
    }, {
        name: 'KZ',
        code: 'kz',
    }, {
        name: 'RU',
        code: 'ru',
    }];
    currentLang = this.availableLangs[0];

    constructor(private layoutService: LayoutService,
                private configService: ConfigService,
                private navigationService: NavigationService,
                public translate: TranslateService,
                private router: Router,
                private popoverService: PopoverService) {
    }

    ngOnInit() {
        this.currentLang = this.availableLangs[0];
    }

    openMegaMenu(origin: ElementRef | HTMLElement) {
        this.popoverService.open({
            content: MegaMenuComponent,
            origin,
            position: [
                {
                    originX: 'start',
                    originY: 'bottom',
                    overlayX: 'start',
                    overlayY: 'top'
                },
                {
                    originX: 'end',
                    originY: 'bottom',
                    overlayX: 'end',
                    overlayY: 'top',
                },
            ]
        });
    }


    setLang(lng) {
      this.currentLang = lng;
      this.translate.use(lng.code);
      this.translate.currentLang = lng.code;

        // console.log('Toolbar')
        // console.log(lng)
        // console.log( this.translate.currentLang)
    }


    getRouteActive() {
        return this.router.url;
    }
}
