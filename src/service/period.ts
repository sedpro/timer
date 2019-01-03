import * as moment from 'moment';
import { injectable, inject } from "inversify";
import { fromEvent } from 'rxjs';
import "reflect-metadata";
const sizzle = require("sizzle");

import { TYPES } from "types";
import { PeriodStorage } from 'storage/period';
import { View } from 'view/view';
import { Lines } from 'view/lines';
import { Last } from 'view/last';
import { Result } from 'view/result';

@injectable()
export class Period {
    // todo: it is used actually as a controller. Extract it, leave here only working with storage
    @inject(TYPES.PeriodStorage) storage: PeriodStorage;
    @inject(TYPES.View) view: View;
    @inject(TYPES.Lines) lines: Lines;
    @inject(TYPES.Last) last: Last;
    @inject(TYPES.Result) result: Result;

    iteratedSum: number;

    paint = async () => {
        await this.renderLines();
        await this.renderLast();
        this.renderResult();
    };

    renderLast = async () => {
        const lastEntry = moment(await this.storage.getLast() * 1000);
        this.last.innerHTML = await this.view.last(lastEntry);
        fromEvent(sizzle('#last > duration'), 'click').subscribe(() => this.saveLast());
        fromEvent(sizzle('#last > img'), 'click').subscribe(() => this.loadOrFlush());
        setTimeout(() => this.renderLast(), 20000);
    };

    renderResult = () => {
        this.result.innerHTML = this.view.result( this.iteratedSum);
        fromEvent(sizzle('#result'), 'click').subscribe(() => this.flush());
    };

    renderLines = async () => {
        this.lines.innerHTML = await this.iteratePeriods();
        const lines = sizzle(':not(#last) > duration');
        if (lines.length > 0) {
            fromEvent(lines, 'click').subscribe(async (e: MouseEvent) => {
                await this.removeLine(e.target as HTMLElement)
            });
        }
    };

    removeLine = async (target: HTMLElement) => {
        const timestamp = parseInt(target.getAttribute('data'));
        let {begins, ends} = await this.storage.getAll();

        for(let i = 0; i < begins.length; i++){
            if (timestamp === begins[i] * 1000) {
                begins.splice(i, 1);
                ends.splice(i, 1);
            }
        }
        this.storage.saveAll(begins, ends);

        await this.paint();
    };

    flush = async () => {
        this.storage.saveAll([], []);
        await this.paint();
        this.storage.saveLast();
    };

    saveLast = async () => {
        this.storage.saveLast();
        await this.paint();
    };

    loadOrFlush = async () => {
        let now = moment();
        let last = moment(await this.storage.getLast() * 1000);
        if (!last.isSame(now, 'd')) {
            await this.flush();
        }

        const {begins, ends} = await this.storage.getAll();

        if (ends[ends.length - 1] === last.unix()) {
            ends[ends.length - 1] = now.unix();
        } else {
            begins.push(last.unix());
            ends.push(now.unix());
        }
        this.storage.saveAll(begins, ends);
        this.storage.saveLast();

        await this.paint();
    };

    private iteratePeriods = async () => {
        const {begins, ends} = await this.storage.getAll();
        this.iteratedSum = 0;
        let html = '';
        for(let i = 0; i < begins.length; i++){
            let begin = moment(begins[i] * 1000);
            let end = moment(ends[i] * 1000);
            let diff = end.diff(begin, 'minutes');
            this.iteratedSum += diff;
            html += this.view.period(begin, end, diff);
        }
        return html;
    };
}