import {
  UIRouterModule,
  UIRouter,
  Transition,
  StateService,
  Ng2StateDeclaration,
} from '@uirouter/angular';
import { LostPagesComponent } from './lost-pages/lost-pages.component';
import { TabsComponent } from './tabs/tabs.component';
import { BasicFunctionsService } from './services/basic-functions.service';
import { logincheck } from './resolveFun';
import { environment } from '../environments/environment';
import { LoginComponent } from './login/login.component';
const state: Ng2StateDeclaration[] = [
  {
    name: 'home',
    url: '/home',
    component: TabsComponent,
    resolve: [
      {
        token: 'person',
        deps: [Transition, StateService, BasicFunctionsService],
        resolveFn: logincheck,
      },
    ],
  },
  {
    name: '404',
    url: '/lostPgae',
    component: LostPagesComponent,
    resolve: [
      {
        token: 'person',
        deps: [Transition, StateService, BasicFunctionsService],
        resolveFn: (traL: Transition) => {
          console.log(traL.from());
          console.log(traL.to());
          console.log(traL);
          return true;
        },
      },
    ],
  },
  {
    name: 'default',
    url: '',
    redirectTo: 'home',
  },
  {
    name: 'login',
    url: '/login',
    component: LoginComponent,
  },
];
const defaultConfigFun = (router: UIRouter, statess: StateService) => {
  router.urlService.rules.initial({ state: 'home' });
  router.urlService.rules.otherwise({ state: '404' });
};
export const Routes = UIRouterModule.forRoot({
  states: state,
  useHash: true,
  config: defaultConfigFun,
});
