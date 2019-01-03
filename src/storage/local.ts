import { Storage } from 'storage/interface';

import { injectable } from "inversify";
import "reflect-metadata";

declare const chrome: any;


@injectable()
export class Local implements Storage {
    read = (key: string|number):any => {
        return new Promise((resolve, reject) => {
            if (!key) {
                reject(null);
            }

            chrome.storage.local.get(key, function (obj) {
                resolve(obj[key]);
            });
        });
    };

    write = (obj: Object) => chrome.storage.local.set(obj);
}