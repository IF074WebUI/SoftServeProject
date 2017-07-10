import { GroupComponent } from './group.component';

describe(`Component: Group Component`, () => {
    let component: GroupComponent;
    let fakeGroupService: any;
    beforeEach(() => {
      fakeGroupService = {

      };
      component = new GroupComponent(null);
    })
    fit(`it should have a button class 'fa fa-calendar'`, () => {

      expect(component.btnClass).toEqual('fa fa-calendar');
    });
    fit(`should set pageNumber to 2`, () => {
      component.ngOnInit();
      component.changePage(2);
      expect(component.pageNumber).toEqual(2);
    });
});
