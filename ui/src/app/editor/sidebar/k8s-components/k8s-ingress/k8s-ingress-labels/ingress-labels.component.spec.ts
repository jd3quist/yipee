import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';

import { IngressLabelsComponent } from './ingress-labels.component';
import { CustomValidators } from '../../../../../shared/validators/custom-validators.validators';
import { EditorService } from '../../../../editor.service';
import { K8sFile } from '../../../../../models/k8s/K8sFile';

describe('IngressLabelsComponent', () => {
  let component: IngressLabelsComponent;
  let fixture: ComponentFixture<IngressLabelsComponent>;

  const flat = {
    'ingress': [
      {
        'id': 'acf86b34-8399-4e6c-9098-f4b5e33b186a',
        'metadata':
        {
          'name': 'name1',
          'annotations':
          {
            'annoname': 'annovalue'
          },
          'labels':
          {
            'labelname': 'labelvalue'
          }
        },
        'spec':
        {
          'tls':
            [{
              hosts:
                [
                  'host23'
                ],
              secretName: 'secretName'
            }],
          'backend':
          {
            'service-id': '-- Select a service --',
            'servicePort': 0
          },
          'rules':
            [{
              'host': 'host1',
              'http':
              {
                'paths':
                  [{
                    'path': 'path1',
                    'backend':
                    {
                      'service-id': '-- Select a service --',
                      'servicePort': 0
                    }
                  }]
              }
            }]
        },
        'type': 'ingress'
      }

    ]
  };

  class MockEditorService {
    k8sFile: K8sFile = new K8sFile();

    reportInvalidForm(volumeId, isInavalid) {

    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [ NO_ERRORS_SCHEMA ],
      declarations: [ IngressLabelsComponent ],
      providers: [
        FormBuilder,
        { provide: EditorService, useClass: MockEditorService }
       ]
    })
    .compileComponents();
  }));

  beforeEach( inject([FormBuilder, EditorService], (formBuilder: FormBuilder, editorService: EditorService) => {
    fixture = TestBed.createComponent(IngressLabelsComponent);
    component = fixture.componentInstance;
    component.form = formBuilder.group({
      name: [{ value: 'name1', disabled: false }, [
        Validators.required,
        CustomValidators.maxLength253,
        CustomValidators.lowercaseAlphaNumericDashPeriod,
        CustomValidators.startsWithDash,
        CustomValidators.endsWithDash,
        CustomValidators.startsWithPeriod,
        CustomValidators.endsWithPeriod,
        CustomValidators.duplicateK8sNameValidator(editorService, 'ingress')
      ]],
      description: [{ value: 'a description', disabled: false }, [ /* add validations */]],
      labels: formBuilder.array([
        formBuilder.group({
          key: [{ value: 'key1', disabled: false }, [
            Validators.required,
            CustomValidators.lowercaseAlphaNumericDashPeriodSlash,
            CustomValidators.containsDoublePeriod,
            CustomValidators.containsDoubleDash
          ]],
          value: [{ value: 'value1', disabled: false }, [
            Validators.required
          ]],
          id: [{ value: '5678', disabled: true }]
        })
      ]),
      annotations: formBuilder.array([
        formBuilder.group({
          key: [{ value: 'key1', disabled: false }, [
            Validators.required,
            CustomValidators.lowercaseAlphaNumericDashPeriodSlash,
            CustomValidators.containsDoublePeriod,
            CustomValidators.containsDoubleDash
          ]],
          value: [{ value: 'value1', disabled: false }, [
            Validators.required
          ]],
          id: [{ value: '1234', disabled: true }]
        })
      ]),
      backend_service_id: [{ value: '-- Select a service --', disabled: false }, [
        Validators.required,
        CustomValidators.containsSelectAService
      ]],
      backend_service_port: [{ value: '9999', disabled: false }, [
        Validators.required,
        CustomValidators.numericPortRangeIncludesZero
      ]],
      tls: formBuilder.array([]),
      rule: formBuilder.array([])
      /* NOTE: YOU ADD MORE FORM FIELDS HERE, COMMENTING SECTIONS */
    });


    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get labels when labels is called', () => {
    const currentLabels = component.labels;
    expect(currentLabels.length).toEqual(1);
  });

  it('should emit a true value when addAnnotation is called', () => {
    component.addLabel.subscribe ((value: boolean) => {
      expect(value).toBeDefined();
      expect(value).toEqual(true);
    });
    component.handleAddLabel();
  });

  it('should emit an index value when removeAnnotation is called', () => {
    component.removeLabel.subscribe ((value: number) => {
      expect(value).toBeDefined();
      expect(value).toEqual(67);
    });
    component.handleRemoveLabel(67);
  });

});
