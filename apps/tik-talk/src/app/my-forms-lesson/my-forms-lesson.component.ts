import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  FormRecord,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MyMockService } from './my-mock.service';
import { MaskitoDirective } from '@maskito/angular';
import type { MaskitoOptions } from '@maskito/core';
import phoneMask from './maskito.phone';
import innMask from './maskito.inn';

enum ReceiverType {
  PERSON = 'PERSON',
  LEGAL = 'LEGAL',
}

enum GuitarBrand {
  ESP = 'ESP',
  FENDER = 'FENDER',
  GIBSON = 'GIBSON',
  IBANEZ = 'IBANEZ',
}

enum EspModel {
  ARROW = 'ARROW',
  BLACK = 'BLACK',
  EX = 'EX',
  VIPER = 'VIPER',
  PHOENIX = 'PHOENIX',
}

enum GibsonModel {
  LESPAUL = 'LESPAUL',
  EXPLORER = 'EXPLORER',
  FLYINGV = 'FLYINGV',
  FIREBIRD = 'FIREBIRD',
}

enum FenderModel {
  CUSTOMSHOP = 'CUSTOMSHOP',
  ULTRA = 'ULTRA',
  PERFORMER = 'PERFORMER',
  PLAYER = 'PLAYER',
}

enum IbanezModel {
  RG = 'RG',
  S = 'S',
  AZ = 'AZ',
  AXION = 'AXION',
  SIGNATURE = 'SIGNATURE',
}

interface Address {
  city?: string;
  street?: string;
  building?: number;
  apartment?: number;
  phone?: number;
}

function getAddressForm(initialValue: Address = {}) {
  return new FormGroup({
    city: new FormControl<string>(initialValue.city ?? ''),
    street: new FormControl<string>(initialValue.street ?? ''),
    building: new FormControl<number | null>(initialValue.building ?? null),
    apartment: new FormControl<number | null>(initialValue.apartment ?? null),
    phone: new FormControl<number | null>(initialValue.phone ?? null),
  });
}

function validateDateRange({
  fromControlName,
  toControlName,
}: {
  fromControlName: string;
  toControlName: string;
}) {
  return (control: AbstractControl) => {
    const fromControl = control.get(fromControlName);
    const toControl = control.get(toControlName);

    if (!fromControl || !toControl) return null;

    const fromDate = new Date(fromControl.value);
    const toDate = new Date(toControl.value);

    if (fromDate && toDate && fromDate > toDate) {
      toControl.setErrors({
        dateRange: { message: 'Дата начала не может быть позднее конца' },
      });
      return {
        dateRange: { message: 'Дата начала не может быть позднее конца' },
      };
    }

    return null;
  };
}

class Feature {
  label: string | undefined;
}

@Component({
  selector: 'app-my-forms-lesson',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaskitoDirective],
  templateUrl: './my-forms-lesson.component.html',
  styleUrl: './my-forms-lesson.component.scss',
})
export class MyFormsLessonComponent {
  readonly phoneMask: MaskitoOptions = phoneMask;
  readonly innMask: MaskitoOptions = innMask;

  ReceiverType = ReceiverType;
  GuitarBrand = GuitarBrand;
  EspModel = EspModel;
  GibsonModel = GibsonModel;
  FenderModel = FenderModel;
  IbanezModel = IbanezModel;

  guitarBrands = [
    { value: GuitarBrand.ESP, label: 'ESP LTD' },
    { value: GuitarBrand.GIBSON, label: 'Gibson' },
    { value: GuitarBrand.FENDER, label: 'Fender' },
    { value: GuitarBrand.IBANEZ, label: 'Ibanez' },
  ];

  espModels = [
    { value: EspModel.ARROW, label: 'LTD Arrow' },
    { value: EspModel.BLACK, label: 'LTD Black Metal' },
    { value: EspModel.EX, label: 'LTD EX' },
    { value: EspModel.VIPER, label: 'LTD Viper' },
    { value: EspModel.PHOENIX, label: 'LTD Phoenix' },
  ];

  mockService = inject(MyMockService);
  features: Feature[] = [];

  form = new FormGroup({
    type: new FormControl<string>(''),
    name: new FormControl<string>('', Validators.required),
    inn: new FormControl<string>(''),
    lastName: new FormControl<string>('', Validators.required),
    guitarBrand: new FormControl<string>(''),
    guitarSeries: new FormControl<string>(''),
    addresses: new FormArray([getAddressForm()]),
    feature: new FormRecord({}),
    dateRange: new FormGroup(
      {
        from: new FormControl<string>(''),
        to: new FormControl<string>(''),
      },
      validateDateRange({ fromControlName: 'from', toControlName: 'to' }),
    ),
  });

  constructor() {
    this.mockService
      .getAddresses()
      .pipe(takeUntilDestroyed())
      .subscribe((addrs) => {
        // while(this.form.controls.addresses.controls.length > 0) {
        //   this.form.controls.addresses.removeAt(0);
        // }

        this.form.controls.addresses.clear();

        for (const addr of addrs) {
          this.form.controls.addresses.push(getAddressForm(addr));
        }
        // this.form.controls.addresses.setControl(1, getAddressForm())
        // console.log(this.form.controls.addresses.at(0))
      });

    this.mockService
      .getFeatures()
      .pipe(takeUntilDestroyed())
      .subscribe((features) => {
        this.features = features;

        for (const feature of features) {
          this.form.controls.feature.addControl(
            feature.code,
            new FormControl(feature.value),
          );
        }
      });

    this.form.controls.type.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe((val) => {
        this.form.controls.inn.clearValidators();

        if (val === ReceiverType.LEGAL) {
          this.form.controls.inn.setValidators([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ]);
        }
      });

    this.form.controls.guitarBrand.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.form.controls.guitarSeries.setValue('');

        // if (val === ReceiverType.ESP) {
        //   this.form.controls.brand.setValidators([Validators.required]);
        // }
      });
  }

  onSubmit(event: SubmitEvent) {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) return;

    console.log(this.form.valid);
    console.log(this.form.value);
  }

  addAddress() {
    // this.form.controls.addresses.push(getAddressForm())
    this.form.controls.addresses.insert(0, getAddressForm());
  }

  deleteAddress(index: number) {
    this.form.controls.addresses.removeAt(index, { emitEvent: false });
  }

  sort = () => 0;
}
