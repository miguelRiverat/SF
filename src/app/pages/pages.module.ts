import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
//import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
//import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { UploadComponent } from './upload/upload.component';
import { JobsComponent } from './jobs/jobs.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    //DashboardModule,
    ECommerceModule,
//    MiscellaneousModule,
  ],
  declarations: [
    PagesComponent,
    UploadComponent,
    JobsComponent,
  ],
})
export class PagesModule {
}
