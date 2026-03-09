import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'actualTime',
  standalone: true,
})
export class ActualTimePipe implements PipeTransform {
  transform(value: string | Date | null): string {
    if (value == null) {
      return '-';
    }

    let dateTime: DateTime; // 1. Готовим переменную для результата
    if (typeof value === 'string') {
      // 2. Если value - строка
      dateTime = DateTime.fromISO(value, { zone: 'utc' }).setZone('local'); // 3. Создаём из строки как UTC. Конвертируем в локальный пояс
    } else {
      // 4. Иначе (если value не строка)
      dateTime = DateTime.fromJSDate(value).setZone('local'); // 5. Создаём из Date объекта. Устанавливаем локальный пояс
    }

    if (!dateTime.isValid) {
      return '-';
    }

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

// transform(date: string | Date): string {
//   const dateTime = DateTime.fromISO(new Date(date).toISOString());
//   const relative = dateTime.setLocale('ru').toRelative({
//     base: DateTime.now()
//   });
//
//   return relative || 'только что';
