import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { StyleClassModule } from 'primeng/styleclass';
import { DividerModule } from 'primeng/divider';
import { ChartModule } from 'primeng/chart';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { FieldsetModule } from 'primeng/fieldset';
import { DetailsComponent } from './details.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        LandingRoutingModule,
        DividerModule,
        StyleClassModule,
        ChartModule,
        PanelModule,
        RatingModule,
        FieldsetModule,
        ButtonModule
    ],
    declarations: [LandingComponent, DetailsComponent]
})
export class LandingModule { }
