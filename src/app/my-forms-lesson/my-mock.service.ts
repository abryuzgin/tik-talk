import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface Feature {
  code: string;
  label: string;
  value: boolean;
}

@Injectable({ providedIn: 'root' })
export class MyMockService {
  getAddresses() {
    return of([
      {
        city: 'Москва',
        street: 'Тверская',
        building: 14,
        apartment: 32,
      },
      {
        city: 'Санкт-Петербург',
        street: 'Ленина',
        building: 100,
        apartment: 30,
      },
    ]);
  }

  getFeatures(): Observable<Feature[]> {
    return of([
      {
        code: 'fast',
        label: 'Ускоренная доставка',
        value: false,
      },
      {
        code: 'lift',
        label: 'Подъем на этаж',
        value: false,
      },
      {
        code: 'tuning',
        label: 'Настройка гитары',
        value: false,
      },
    ]);
  }
}
