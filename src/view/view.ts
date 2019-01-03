import { injectable } from "inversify";
import "reflect-metadata";
import * as moment from 'moment';


@injectable()
export class View {

    format = (m) => m.format('HH:mm');

    line = (a, b, diff) => {
        const d = `<duration data="${a}">${this.duration(diff)}</duration>`;
        return `${this.format(a)} - ${this.format(b)} = ${d}`;
    };

    period = (a, b, diff) => `<line>${this.line(a, b, diff)}</line>`;

    last = async (begin) => {
        let end = moment();
        const line = this.line(begin, end, end.diff(begin, 'minutes'));
        return `<div id="last">${line} <img src="images/add.png"/></div>`;
    };

    duration = (minutesCount: number): string => {
        let duration = moment.duration(minutesCount, 'minutes');
        let hours = duration.hours();
        let minutes = duration.minutes();
        let res = '';
        if (hours) {
            res += `${hours} ${hours === 1 ? ' hour ' : ' hours '}`;
        }
        res += `${minutes} ${minutes === 1 ? ' minute ' : ' minutes '}`;
        return res;
    };

    result = (minutes) => `<result>${this.duration(minutes)}</result>`;
}
