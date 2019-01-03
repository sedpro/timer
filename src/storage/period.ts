import * as moment from 'moment';
import { Storage } from 'storage/interface';

import { injectable, inject } from "inversify";
import "reflect-metadata";
import { TYPES } from "types";


@injectable()
export class PeriodStorage {
    @inject(TYPES.Storage) storage: Storage;

    getAll = async () => {
        return {
            begins: await this.storage.read('begins') as number[],
            ends: await this.storage.read('ends') as number[],
        }
    };

    getLast = async () => await this.storage.read('last') as number;

    saveLast = () => this.storage.write({last: moment().unix()});

    saveAll = (begins, ends) => this.storage.write({begins: begins, ends: ends});
}