import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroService } from "../hero.service";
import { HeroesComponent } from "./heroes.component";
import { of } from 'rxjs';
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";

describe('HerosComponent ShallowTest', ()=>{
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    @Component({
        selector: 'app-hero',
        template: `
        <div> </div> 
        `
    })
   class FakeHeroComponent{
        @Input() hero: Hero;
        //@Output() delete = new EventEmitter();
    }

    beforeEach(()=>{
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
        HEROES=[
            {id: 1, name: 'SpiderDude', strength: 8},
            {id: 2, name: 'WonderfulWoman', strength: 24},
            {id: 3, name: 'SuperDude', strength: 55}
        ]
        TestBed.configureTestingModule({
            declarations:[HeroesComponent, FakeHeroComponent],
            providers:[{provide: HeroService, useValue: mockHeroService}],
            // schemas:[NO_ERRORS_SCHEMA]
        })
        fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should set heroes correctly from the service', ()=>{
        mockHeroService.getHeroes.and.returnValue(of(HEROES))
        fixture.detectChanges();

        expect(fixture.componentInstance.heroes.length).toBe(3);
    })

    it('should create one li for each hero', ()=>{
        mockHeroService.getHeroes.and.returnValue(of(HEROES))
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);
    })
})