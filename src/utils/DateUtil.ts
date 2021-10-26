import moment from 'moment';


export default class DateUtil {

  utcFormatSpace(value, spaceType: string) {

    return moment(value).utc().format(`YYYY${spaceType}MM${spaceType}DD`);
  }

  utcFormat(value, format = 'DD/MM/YYYY') {
    return moment(value).utc().format(format);
  }

  dateToUtc(year: number, month: number, day: number) {
    return Date.UTC(year, month - 1, day).toPrecision();
  }

  dateToFormat(day,month,year,format){
    const date=new Date(year, month - 1, day);
    return moment(date).format(format)
  }

}
