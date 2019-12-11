/* eslint-env jest */

process.env.NODE_ICU_DATA = 'node_modules/full-icu';
require('full-icu');

const AasaamDateTime = require('../lib/AasaamDateTime');

describe('AasaamDateTime', () => {

  it('t1', () => {
    let ad;

    expect(() => {
      // @ts-ignore
      ad = new AasaamDateTime(new Date(), 'zz');
    }).toThrow(Error);

    expect(() => {
      // @ts-ignore
      ad = new AasaamDateTime(1, 'ff');
    }).toThrow(Error);


    ad = new AasaamDateTime();

    ad.format('jYYYY jMM jDD');
    ad.format('iYYYY iMM iDD');
    ad.format('YYYY MM DD');

    ['ar', 'en', 'fa'].forEach((l) => {

      let f = ad.format('jYYYY jMM jDD', l);
      ad.parse(f, 'jYYYY jMM jDD', 'persian');
      f = ad.format('iYYYY iMM iDD', l);
      ad.parse(f, 'iYYYY iMM iDD', 'islamic');
      f = ad.format('YYYY MM DD', l);
      ad.parse(f, 'YYYY MM DD', 'gregorian');

      // @ts-ignore
      ad = new AasaamDateTime(new Date(), l);
      ad.getTimeZone();
      ['persian', 'islamic', 'gregorian'].forEach((cal) => {
        ad.yearOffset(cal, 1);
        ad.yearOffset(cal, -1);
        ad.yearOffset(cal, 0);
        ad.monthOffset(cal, 1);
        ad.monthOffset(cal, -1);
        ad.monthOffset(cal, 0);
        ad.dayOffset(cal, 1);
        ad.dayOffset(cal, -1);
        ad.dayOffset(cal, 0);
        ad.getYearList(cal);
        ad.getMonthList(cal);
        ad.getMonthDays();
        ad.getMonthTable();
        ['persian', 'islamic', 'gregorian'].forEach((cal2) => {
          ['persian', 'islamic', 'gregorian'].forEach((cal3) => {
            ad.getMonthDays([cal, cal2, cal3]);
            ad.getMonthTable([cal, cal2], cal3);
          });

        });
      });
      ad.setDate(ad.getDate());
      ad.setHours(ad.getDate().getHours());
      ad.setMinutes(ad.getDate().getMinutes());
      ad.setSeconds(ad.getDate().getSeconds());
    });
  });
});
