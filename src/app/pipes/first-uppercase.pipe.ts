import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'firstuppercase',
  standalone: true
})
export class FirstUpperCasePipe implements PipeTransform {
  transform(value: string): string {
    return `${value.slice(0, 1).toLocaleUpperCase()}${value.slice(1)}`;
  }
}
