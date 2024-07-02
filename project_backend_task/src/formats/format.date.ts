import { format, parse } from 'date-fns';

export class formatDate {
  formatForDatabase = (date: string): string => {
    return format(parse(date, 'dd/MM/yyyy', new Date()), 'yyyy-MM-dd');
  };

  formatForDisplay = (date: Date | string): string => {
    if (typeof date === 'string') {
      new Date(date);
    }
    return format(date, 'dd/MM/yyyy');
  };
}
