import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { CreateSpendingPage } from './create-spending.page';

describe('Tab1Page', () => {
  let component: CreateSpendingPage;
  let fixture: ComponentFixture<CreateSpendingPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateSpendingPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSpendingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
