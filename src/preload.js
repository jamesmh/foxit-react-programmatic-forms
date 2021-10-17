import preloadJrWorker from '@foxitsoftware/foxit-pdf-sdk-for-web-library/lib/preload-jr-worker';
import {
    licenseKey,
    licenseSN
} from './licenseKey';

const libPath = "/foxit-lib/";

window.readyWorker = preloadJrWorker({
    workerPath: libPath,
    enginePath: libPath + '/jr-engine/gsdk',
    fontPath: 'https://webpdf.foxitsoftware.com/webfonts/',
    licenseSN,
    licenseKey,
});