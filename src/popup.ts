import "./popup.css";
import { Period } from 'service/period';
import { TYPES } from "types";
import { container } from 'inversify.config';

const period = container.get<Period>(TYPES.Period);

period.paint();
