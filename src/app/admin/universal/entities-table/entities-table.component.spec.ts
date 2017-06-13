import {ComponentFixture, TestBed} from "@angular/core/testing";
import {Component, DebugElement} from "@angular/core";
import {EntitiesTableComponent} from "./entities-table.component";
import {By} from "@angular/platform-browser";

fdescribe('AlertComponent', () => {
  let fixture : ComponentFixture<HostComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostComponent, EntitiesTableComponent],
    });
  });

  fit('Компонент повинен бути визначений', () => {
    const template = '<dtester-entities-table></dtester-entities-table>';
    fixture = createHostComponent(template);
    expect(fixture.componentInstance).toBeDefined();
  });

    fit('Компонент має емітити сутність при натисненні кнопки видалення', function () {
      const template = `<dtester-entities-table [entities]="ent"></dtester-entities-table>`;
      fixture = createHostComponent(template);
      const tableComponent = fixture.debugElement.query(By.directive(EntitiesTableComponent)) as DebugElement;
      const delEle = tableComponent.query(By.css('.btn-danger')) as DebugElement;
      let $event;
      tableComponent.componentInstance.deleteEntity.subscribe(val => $event = val);
      delEle.triggerEventHandler('click', null);
      expect($event.name).toEqual('Вася');
      expect($event.code).toEqual('12345');
    });

});

@Component({ selector: 'host-for-test', template: '' })
class HostComponent {
  ent = [
    {name: 'Вася', code: '12345'},
    {name: 'Микола', code: '54321'}
  ];
}
function createHostComponent( template : string ) : ComponentFixture<HostComponent> {
  TestBed.overrideComponent(HostComponent, { set: { template: template } });
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  return fixture as ComponentFixture<HostComponent>;
}
