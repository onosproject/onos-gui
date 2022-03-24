/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */


import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DeviceChangeDetailsComponent } from './device-change-details.component';

describe('DeviceChangeDetailsComponent', () => {
  let component: DeviceChangeDetailsComponent;
  let fixture: ComponentFixture<DeviceChangeDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceChangeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceChangeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
