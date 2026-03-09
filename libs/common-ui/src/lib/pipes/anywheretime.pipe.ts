import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

export type DateFormat = 'full' | 'time' | 'time_date' | 'date_only';

@Pipe({
  name: 'formatDate',
  standalone: true,
})
export class AnywhereTimePipe implements PipeTransform {
  transform(
    value: string | Date | null,
    format: DateFormat = 'full',
    customFormat?: string,
  ): string {
    if (value == null) {
      return '-';
    }

    let dateTime: DateTime;
    if (typeof value === 'string') {
      dateTime = DateTime.fromISO(value, { zone: 'utc' }).setZone('local');
    } else {
      dateTime = DateTime.fromJSDate(value).setZone('local');
    }

    if (!dateTime.isValid) {
      return '-';
    }

    switch (format) {
      case 'full':
        return this.getActualTime(dateTime);

      case 'time':
        return dateTime.toFormat('HH:mm');

      case 'time_date':
        return dateTime.toFormat('HH:mm dd.MM.yy');

      case 'date_only':
        return dateTime.toFormat('dd.MM.yyyy');
    }
  }

  private getActualTime(dateTime: DateTime): string {
    const now = DateTime.now();
    const diff = now.diff(dateTime, ['hours', 'minutes', 'seconds']);

    if (diff.minutes < 1) {
      const seconds = Math.floor(diff.seconds);

      if (seconds < 5) {
        return 'только что';
      } else if (seconds < 20) {
        return 'несколько секунд назад';
      } else {
        return 'меньше минуты назад';
      }
    } else if (diff.hours < 1) {
      const minutes = Math.floor(diff.minutes);
      if (minutes === 1) return '1 минуту назад';
      if (minutes < 5) return `${minutes} минуты назад`;
      return `${minutes} минут назад`;
    }

    if (diff.hours < 4) {
      const hours = Math.floor(diff.hours);
      if (hours === 1) return '1 час назад';
      if (hours < 5) return `${hours} часа назад`;
      return `${hours} часов назад`;
    }

    return dateTime.setLocale('ru').toFormat('dd.MM.yyyy HH:mm:ss');
  }
}
