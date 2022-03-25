/*
 * SPDX-FileCopyrightText: 2020-present Open Networking Foundation <info@opennetworking.org>
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringValueComponent } from './string-value.component';

describe('StringValueComponent', () => {
  let component: StringValueComponent;
  let fixture: ComponentFixture<StringValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
