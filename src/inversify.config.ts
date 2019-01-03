import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from 'types';
import { Local } from 'storage/local';
import { PeriodStorage } from 'storage/period';
import { Storage } from 'storage/interface';
import { View } from 'view/view';
import { Lines } from 'view/lines';
import { Last } from 'view/last';
import { Result } from 'view/result';
import { Period } from 'service/period';



const container = new Container();

container.bind<Storage>(TYPES.Storage).to(Local);
container.bind<PeriodStorage>(TYPES.PeriodStorage).to(PeriodStorage);
container.bind<Period>(TYPES.Period).to(Period);
container.bind<View>(TYPES.View).to(View);
container.bind<Last>(TYPES.Last).toConstantValue(document.getElementById('last'));
container.bind<Result>(TYPES.Result).toConstantValue(document.getElementById('result'));
container.bind<Lines>(TYPES.Lines).toConstantValue(document.getElementById('lines'));

export { container };