import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DoctorDetailPageRoutingModule } from './doctor-detail-routing.module';

import { DoctorDetailPage } from './doctor-detail.page';
import { FullCalendarModule } from '@fullcalendar/angular';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FullCalendarModule,
    DoctorDetailPageRoutingModule
  ],
  declarations: [DoctorDetailPage]
})
export class DoctorDetailPageModule {}
