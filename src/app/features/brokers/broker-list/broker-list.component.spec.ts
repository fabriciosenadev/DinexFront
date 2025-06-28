import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerListComponent } from './broker-list.component';

describe('BrokerListComponent', () => {
  let component: BrokerListComponent;
  let fixture: ComponentFixture<BrokerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrokerListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrokerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
