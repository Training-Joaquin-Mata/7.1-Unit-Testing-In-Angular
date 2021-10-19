import { Component, Directive, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroService } from "../hero.service";
import { HeroesComponent } from "./heroes.component";
import { of } from 'rxjs';
import { Hero } from "../hero";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";

@Directive({
    selector:'[routerLink]',
    host: { '(click)': 'onClick()' }
})
export class RouterLinkDirectiveStub{
    
    @Input('routerLink') linkParams: any;
    navigateTo: any = null;

    onClick(){
        this.navigateTo = this.linkParams;
    }
}

describe('HerosComponent DeepTest', ()=>{
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    beforeEach(()=>{
        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
        HEROES=[
            {id: 1, name: 'SpiderDude', strength: 8},
            {id: 2, name: 'WonderfulWoman', strength: 24},
            {id: 3, name: 'SuperDude', strength: 55}
        ]
        TestBed.configureTestingModule({
            declarations:[
                HeroesComponent, 
                HeroComponent, 
                RouterLinkDirectiveStub
            ],
            providers:[{provide: HeroService, useValue: mockHeroService}],
           // schemas: [NO_ERRORS_SCHEMA]
        })
        fixture = TestBed.createComponent(HeroesComponent);    
    });

    it('should render each hero as a HeroComponent', ()=>{
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        //run ngOnInit
        fixture.detectChanges();

        const heroComponentsDEs= fixture.debugElement.queryAll(By.directive(HeroComponent))
        expect(heroComponentsDEs.length).toBe(3);
        for(let i=0; i<heroComponentsDEs.length; i++){
        expect(heroComponentsDEs[i].componentInstance.hero).toEqual(HEROES[i])
        }
    })

    //para hacer el test de un event dentro del DOM
    it('should call heroService.deleteHero when the hero Component´s delete button is clicked', ()=>{
        spyOn(fixture.componentInstance, 'delete');

        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        fixture.detectChanges();
        
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
     
            //Con este codigo se llama a la accion de presionar el boton 
            // heroComponents[0].query(By.css('button')).triggerEventHandler('click', {stopPropagation: ()=>{}});

            //Con el codigo de aqui es como si se hiciera el llamado a que se ejecute lo que pasa cuando se presiona el boton
            // (<HeroComponent>heroComponents[0].componentInstance).delete.emit(undefined);
            
            //con esto se hace un trigger al delete del child
            heroComponents[0].triggerEventHandler('delete', null)
            expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0])
    })

    //probar un elemento con text input

    it('should add a new hero to the hero list when the add button is clicked', ()=>{
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        
        const name = "Mr. Ice"
        mockHeroService.addHero.and.returnValue(of({id:5, name: name, strength: 4}));
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];
        inputElement.value = name;
        addButton.triggerEventHandler('click', null);

        fixture.detectChanges();

        const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
        expect(heroText).toContain(name);
    })

    //test routerlink

    it('should have the correct route for the first hero', ()=>{
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();
        
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

        let routerLink = heroComponents[0].query(By.directive(RouterLinkDirectiveStub)).injector.get(RouterLinkDirectiveStub);

        heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

        expect(routerLink.navigateTo).toBe('/detail/1');
    })

})