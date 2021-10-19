import { ComponentFixture, fakeAsync, flush, TestBed, tick, waitForAsync} from "@angular/core/testing"
import { ActivatedRoute } from "@angular/router";
import { HeroService } from "../hero.service";
import { HeroDetailComponent } from "./hero-detail.component"
import { Location } from '@angular/common'
import { of } from 'rxjs'
import { FormsModule } from "@angular/forms";

describe('HeroDetailComponent', ()=>{
    let fixture: ComponentFixture<HeroDetailComponent>;
    let mockActivatedRoute, mockHeroService, mockLocation;
    beforeEach(()=>{
        mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
        mockLocation = jasmine.createSpyObj(['back']);
        mockActivatedRoute = {
            snapshot: {paramMap:{get:()=>{  return '3' }}}
        }

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [HeroDetailComponent],
            providers: [
                {provide: ActivatedRoute, useValue: mockActivatedRoute},
                {provide: Location, useValue: mockLocation},
                {provide: HeroService, useValue: mockHeroService},

            ]
        })

        fixture = TestBed.createComponent(HeroDetailComponent);
        mockHeroService.getHero.and.returnValue(of({id: 3, name: 'SuperDude', strength: 100}));
    })

    it('should render the hero name in a h2 tag', ()=>{
        fixture.detectChanges();

        expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERDUDE')
    })

// //probar un service asincrono
//     it('should call update hero when save is called',fakeAsync(()=>{
//         mockHeroService.updateHero.and.returnValue(of({}));
//         fixture.detectChanges();

//         fixture.componentInstance.save();
//         //"adelantas" 250ms del debounce para que se ejecute sin tener que esperar mas tiempo y las pruebas sean mas rapidas
//         // tick(250);
//         //Si no sabes cuanto tiempo se debe de esperar
//         flush();

//         expect(mockHeroService.updateHero).toHaveBeenCalled();
        
//     }))

//probar una promise
    it('should call update hero when save is called', waitForAsync(()=>{
        mockHeroService.updateHero.and.returnValue(of({}));
        fixture.detectChanges();

        fixture.componentInstance.save();
        
        //espera a que se ejecute una promise
        fixture.whenStable().then(()=>{
        
            expect(mockHeroService.updateHero).toHaveBeenCalled();
        
        })

    }))

})