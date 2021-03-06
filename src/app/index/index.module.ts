/* angular components */
import {
  NgModule
} from '@angular/core';
import {
  IndexComponent
} from './index.component';
import {
  IndexFirstPageComponent
} from './components/first-page/first-page.component';
import {
  IndexServicePageComponent
} from './components/service-page/service-page.component';
import {
  IndexCommunityPageComponent
} from './components/community-page/community-page.component';
import {
  IndexTrendingNowPageComponent
} from './components/trending-now-page/trending-now-page.component';
import {
  IndexStickyNavbarComponent
} from './components/sticky-navbar/sticky-navbar.component';
import {
  IndexLeisurePageComponent
} from './components/leisure-page/leisure-page.component';
import {
  IndexFooterComponent
} from './components/footer/footer.component';
import {
  IndexOnResizeActiveDirectiveComponent
} from './directives/on-resize-active';
import {
  SharedModule
} from '../shared/components/shared.module';
import {
  SharedDirectiveModule
} from '../shared/directives/shared-directive.module';
import {
  indexRouting
} from './index-routing.component';
import {
  PeersService
} from '../../services/peers.service';

@NgModule({
  imports : [
    SharedModule,
    SharedDirectiveModule,
    indexRouting,
  ],
  declarations : [
    IndexComponent,
    IndexFirstPageComponent,
    IndexServicePageComponent,
    IndexCommunityPageComponent,
    IndexTrendingNowPageComponent,
    IndexLeisurePageComponent,
    IndexFooterComponent,
    IndexStickyNavbarComponent,
    IndexOnResizeActiveDirectiveComponent
  ],
  exports: []
})
export class IndexModule {}
