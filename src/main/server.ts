import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import { AppInsights } from './app-insights/app-insights';

// App Insights needs to be enabled as early as possible as it monitors other libraries as well
AppInsights.enable();
const port: string = process.env.PORT || '3000';
