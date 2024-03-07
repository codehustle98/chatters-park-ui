import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name:'searchList'
})
export class SearchListPipe implements PipeTransform{

  transform(value: any, args: any,field?:any): any {
    if(!value)
      return null;
    if(!args)
      return value;

    return value.filter((item:any) => item[field].toLowerCase().includes(args.toLowerCase()))
  }

}
