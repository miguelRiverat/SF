import { NgModule } from '@angular/core';
import {
  NbMenuModule,
  NbButtonModule,
  NbCardModule,
  NbProgressBarModule,
  NbTabsetModule,
  NbUserModule,
  NbIconModule,
  NbSelectModule,
  NbSpinnerModule,
  NbListModule,
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { ECommerceModule } from './graphs/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { UploadComponent } from './upload/upload.component';
import { JobsComponent } from './jobs/jobs.component';
import { ExploreComponent } from './explore/explore.component';
import { GenerateComponent } from './generate/generate.component';
import { 
  NgxEchartsModule
} from 'ngx-echarts';
import { VisualComponent } from './visual/visual.component';


@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    NbSelectModule,
    ECommerceModule,
    NgxEchartsModule,
    NbSpinnerModule,
  ],
  declarations: [
    PagesComponent,
    UploadComponent,
    JobsComponent,
    ExploreComponent,
    GenerateComponent,
    VisualComponent,
  ],
})
export class PagesModule {
}
