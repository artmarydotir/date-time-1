const groupBy = require('lodash.groupby');
const momentG = require('moment');
const momentJ = require('moment-jalaali');
const momentH = require('moment-hijri');

const timezones = require('./timezone');
const calendars = require('./calendar');
const defaultCountry = require('./defaultCountry');
const weekDays = require('./weekDays');
const events = require('./events');

class AasaamDateTime {
  /**
   * @param {Date} date Standard JavaScript Date object
   * @param {('ar'|'az'|'de'|'en'|'es'|'fa'|'fr'|'it'|'ja'|'nl'|'pl'|'pt'|'ru'|'tr'|'ur'|'zh')} lang Supported language
   */
  constructor(date = new Date(), lang = 'fa') {
    if (date instanceof Date) {
      /** @type {Date} */
      this.date = date;
    } else {
      throw new Error('Invalid `Date` Object');
    }

    this.date.setMilliseconds(0);

    if (calendars[lang]) {
      this.lang = lang;
    } else {
      throw new Error('Unsupported `lang`');
    }

    this.changeCountry(defaultCountry[this.lang]);
  }

  /**
   * @param {Date} date Standard JavaScript Date object
   * @return {AasaamDateTime}
   */
  setDate(date) {
    this.date = date;
    this.date.setMilliseconds(0);
    return this;
  }

  /**
   * @returns {Date}
   */
  getDate() {
    return this.date;
  }

  /**
   * @param {Number} hours Hour number
   * @return {AasaamDateTime}
   */
  setHours(hours) {
    this.date.setHours(hours);
    return this;
  }

  /**
   * @param {Number} minutes Minute number
   * @return {AasaamDateTime}
   */
  setMinutes(minutes) {
    this.date.setMinutes(minutes);
    return this;
  }

  /**
   * @param {Number} seconds Second number
   * @return {AasaamDateTime}
   */
  setSeconds(seconds) {
    this.date.setSeconds(seconds);
    return this;
  }

  /**
   * @param {String} country Country ISO 2 code
   */
  changeCountry(country) {
    this.country = country;
    if (weekDays[this.country]) {
      this.weekDays = weekDays[this.country];
    } else {
      this.weekDays = [0, 1, 2, 3, 4, 5, 6];
    }
    return this;
  }

  /**
   * @returns {String}
   */
  getTimeZone() {
    return timezones[this.lang][Intl.DateTimeFormat().resolvedOptions().timeZone];
  }

  /**
   * @param {('gregorian'|'persian'|'islamic')} calendar Calendar type
   * @param {Number} offset Could be negative or positive number
   * @return {AasaamDateTime}
  */
  yearOffset(calendar, offset) {
    if (calendar === 'persian') {
      if (offset >= 0) {
        this.date = momentJ(this.date).add(offset, 'jYear').toDate();
      } else {
        this.date = momentJ(this.date).subtract(offset, 'jYear').toDate();
      }
    } else if (calendar === 'islamic') {
      if (offset >= 0) {
        this.date = momentH(this.date).add(offset, 'iYear').toDate();
      } else {
        this.date = momentH(this.date).subtract(offset, 'iYear').toDate();
      }
    } else if (offset >= 0) {
        this.date = momentG(this.date).add(offset, 'year').toDate();
    } else {
      this.date = momentG(this.date).subtract(offset, 'year').toDate();
    }

    return this;
  }

  /**
   * @param {('gregorian'|'persian'|'islamic')} calendar Calendar type
   * @param {Number} offset Could be negative or positive number
   * @return {AasaamDateTime}
  */
  monthOffset(calendar, offset) {
    if (calendar === 'persian') {
      if (offset >= 0) {
        this.date = momentJ(this.date).add(offset, 'jMonth').toDate();
      } else {
        this.date = momentJ(this.date).subtract(offset, 'jMonth').toDate();
      }
    } else if (calendar === 'islamic') {
      if (offset >= 0) {
        this.date = momentH(this.date).add(offset, 'iMonth').toDate();
      } else {
        this.date = momentH(this.date).subtract(offset, 'iMonth').toDate();
      }
    } else if (offset >= 0) {
        this.date = momentG(this.date).add(offset, 'month').toDate();
    } else {
      this.date = momentG(this.date).subtract(offset, 'month').toDate();
    }

    return this;
  }

  /**
   * @param {('gregorian'|'persian'|'islamic')} calendar Calendar type
   * @param {Number} offset Could be negative or positive number
   * @return {AasaamDateTime}
  */
  dayOffset(calendar, offset) {
    if (calendar === 'persian') {
      if (offset >= 0) {
        this.date = momentJ(this.date).add(offset, 'day').toDate();
      } else {
        this.date = momentJ(this.date).subtract(offset, 'day').toDate();
      }
    } else if (calendar === 'islamic') {
      if (offset >= 0) {
        this.date = momentH(this.date).add(offset, 'day').toDate();
      } else {
        this.date = momentH(this.date).subtract(offset, 'day').toDate();
      }
    } else if (offset >= 0) {
        this.date = momentG(this.date).add(offset, 'day'  ).toDate();
    } else {
      this.date = momentG(this.date).subtract(offset, 'day').toDate();
    }

    return this;
  }

  /**
   * @param {String} fmt
   * @param {String} lang
   */
  format(fmt, lang = null) {
    let l = this.lang;
    if (lang !== null) {
      // @ts-ignore
      l = lang;
    }

    if (fmt.match(/jM|jD|jw|jYY|jgg/gm)) {
      return momentJ(this.date).locale(l).format(fmt);
    }

    if (fmt.match(/iM|iD|iw|iYY|igg/gm)) {
      return momentH(this.date).locale(l).format(fmt);
    }

    return momentG(this.date).locale(l).format(fmt);
  }

  /**
   * @param {String} str String want to parse
   * @param {String} fmt Formatted string of passed
   * @param {('gregorian'|'persian'|'islamic')} calendar Calendar of string date
   * @return {AasaamDateTime}
   */
  parse(str, fmt, calendar) {
    if (calendar === 'persian') {
      this.date = momentJ(str, fmt).toDate();
    } else if (calendar === 'islamic') {
      this.date = momentH(str, fmt).toDate();
    } else {
      this.date = momentG(str, fmt).toDate();
    }

    return this;
  }

  /**
   * @param {('gregorian'|'persian'|'islamic')} calendar Calendar type
   * @param {Number} offset Offset of before and after
   * @return {{name: String, localeName: String, i: Number, date: Date}[]}
   */
  getYearList(calendar, offset = 20) {
    let current;
    if (calendar === 'persian') {
      current = momentJ(this.date).locale('en').format('jYYYY');
    } else if (calendar === 'islamic') {
      current = momentH(this.date).locale('en').format('iYYYY');
    } else {
      current = momentG(this.date).locale('en').format('YYYY');
    }

    const year = parseInt(current, 10);

    const years = [];
    for (let i = year - offset; i <= year + offset; i += 1) {
      let d;
      let f;
      let n;
      let nl;
      if (calendar === 'persian') {
        d = momentJ(this.date).jYear(i).toDate();
        f = parseInt(momentJ(d).locale('en').format('jYYYY'), 10);
        nl = new Intl.NumberFormat('fa', { useGrouping: false }).format(f);
        n = new Intl.NumberFormat(this.lang, { useGrouping: false }).format(f);
      } else if (calendar === 'islamic') {
        d = momentH(this.date).iYear(i).toDate();
        f = parseInt(momentH(d).locale('en').format('iYYYY'), 10);
        nl = new Intl.NumberFormat('ar', { useGrouping: false }).format(f);
        n = new Intl.NumberFormat(this.lang, { useGrouping: false }).format(f);
      } else {
        d = momentG(this.date).year(i).toDate();
        f = parseInt(momentG(d).locale('en').format('YYYY'), 10);
        nl = f.toString();
        n = new Intl.NumberFormat(this.lang, { useGrouping: false }).format(f);
      }
      years.push({
        name: n,
        localeName: nl,
        i: f,
        date: d,
      });
    }
    return years;
  }

  /**
   * @param {('gregorian'|'persian'|'islamic')} calendar Calendar type
   * @return {{name: String, localeName: String, i: Number, date: Date}[]}
   */
  getMonthList(calendar) {
    const monthList = [];
    for (let i = 0; i <= 11; i += 1) {
      let d;
      let n;
      let nl;
      if (calendar === 'persian') {
        d = momentJ(this.date).jMonth(i).toDate();
        nl = calendars[this.lang].persian[i];
        n = calendars.fa.persian[i];
      } else if (calendar === 'islamic') {
        d = momentH(this.date).iMonth(i).toDate();
        nl = calendars[this.lang].islamic[i];
        n = calendars.ar.islamic[i];
      } else  {
        d = momentG(this.date).month(i).toDate();
        nl = calendars[this.lang].gregorian[i];
        n = calendars.en.gregorian[i];
      }
      monthList.push({
        name: n,
        localeName: nl,
        i,
        date: d,
      });
    }
    return monthList;
  }

  /**
   * @param {('gregorian'|'persian'|'islamic')[]} display Display order of calendars, first will be primary and rest of them will be alternative calendars
   * @return {{calendar: String, days: {name: String, localeName: String, alt: Array, eventKeys: Array, i: Number, localeDate: String, localeTime: String, weekSeq: Number, w: Number, date: Date, events: Array[Object], dateOnly: Date}[]}}
   */
  // eslint-disable-next-line sonarjs/cognitive-complexity
  getMonthDays(display = []) {
    let displayOrder = ['gregorian'];
    if (this.lang === 'fa') {
      displayOrder = ['persian', 'gregorian', 'islamic'];
    } else if (this.lang === 'ar') {
      displayOrder = ['gregorian', 'islamic'];
    }
    if (display.length !== 0) {
      displayOrder = display;
    }

    const calendar = displayOrder.shift();

    let start;
    let daysInMonth;
    if (calendar === 'persian') {
      start = momentJ(this.date).startOf('jMonth');
      const y = parseInt(start.locale('en').format('jYYYY'), 10);
      const m = parseInt(start.locale('en').format('jM'), 10);
      daysInMonth = momentJ.jDaysInMonth(y, m - 1);
    } else if (calendar === 'islamic') {
      start = momentH(this.date).startOf('iMonth');
      const y = parseInt(start.locale('en').format('iYYYY'), 10);
      const m = parseInt(start.locale('en').format('iM'), 10);
      daysInMonth = momentH.iDaysInMonth(y, m - 1);
    } else {
      start = momentG(this.date).startOf('month');
      daysInMonth = start.daysInMonth();
    }

    const days = [];
    const [weekStart] = this.weekDays;
    let weekSeq = 0;
    for (let i = 1; i <= daysInMonth; i += 1) {
      const eventKeys = [];
      const alt = [];
      let mom;
      let nl;
      let localeDate;
      let n;
      if (calendar === 'persian') {
        mom = momentJ(this.date).jDate(i);

        const mn = mom.locale('en').format('jMM');

        localeDate = `${mom.locale('en').format('jYYYY')}-${mn}-${mom.locale('en').format('jDD')}`;

        eventKeys.push(`p${mn}${i.toString().padStart(2, '0')}`);

        nl = new Intl.NumberFormat('fa', { useGrouping: false }).format(i);
        n = new Intl.NumberFormat(this.lang, { useGrouping: false }).format(i);
      } else if (calendar === 'islamic') {
        mom = momentH(this.date).iDate(i);

        const mn = mom.locale('en').format('iMM');

        localeDate = `${mom.locale('en').format('iYYYY')}-${mn}-${mom.locale('en').format('iDD')}`;

        eventKeys.push(`i${mn}${i.toString().padStart(2, '0')}`);

        nl = new Intl.NumberFormat('ar', { useGrouping: false }).format(i);
        n = new Intl.NumberFormat(this.lang, { useGrouping: false }).format(i);
      } else  {
        mom = momentG(this.date).date(i);

        const mn = mom.locale('en').format('MM');

        localeDate = `${mom.locale('en').format('YYYY')}-${mn}-${mom.locale('en').format('DD')}`;

        eventKeys.push(`g${mn}${i.toString().padStart(2, '0')}`);

        nl = new Intl.NumberFormat('en', { useGrouping: false }).format(i);
        n = new Intl.NumberFormat(this.lang, { useGrouping: false }).format(i);
      }

      const d = mom.toDate();

      const dayEvent = [];
      eventKeys.forEach((ek) => {
        if (events[ek]) {
          events[ek].forEach((e) => {
            dayEvent.push(e);
          });
        }
      });

      if (d.getDay() === weekStart) {
        weekSeq += 1;
      }

      displayOrder.forEach((c) => {
        let dd;
        let dnl;
        let dn;
        let mn;
        let mnm;
        let mnml;
        let cal;
        if (c === 'persian') {
          dd = parseInt(momentJ(d).locale('en').format('jD'), 10);
          mn = parseInt(momentJ(d).locale('en').format('jM'), 10);

          mnm = calendars[this.lang].persian[mn - 1];
          mnml = calendars.fa.persian[mn - 1];

          cal = 'persian';
          eventKeys.push(`p${mn.toString().padEnd(2, '0')}${dd.toString().padEnd(2, '0')}`);

          dnl = new Intl.NumberFormat('fa', { useGrouping: false }).format(dd);
          dn = new Intl.NumberFormat(this.lang, { useGrouping: false }).format(dd);
        } else if (c === 'islamic') {
          dd = parseInt(momentH(d).locale('en').format('iD'), 10);
          mn = parseInt(momentH(d).locale('en').format('iM'), 10);

          mnm = calendars[this.lang].islamic[mn - 1];
          mnml = calendars.ar.islamic[mn - 1];

          cal = 'islamic';
          eventKeys.push(`i${mn.toString().padEnd(2, '0')}${dd.toString().padEnd(2, '0')}`);

          dnl = new Intl.NumberFormat('ar', { useGrouping: false }).format(dd);
          dn = new Intl.NumberFormat(this.lang, { useGrouping: false }).format(dd);
        } else {
          dd = parseInt(momentG(d).locale('en').format('D'), 10);
          mn = parseInt(momentH(d).locale('en').format('M'), 10);

          mnm = calendars[this.lang].gregorian[mn - 1];
          mnml = calendars.en.gregorian[mn - 1];

          cal = 'gregorian';
          eventKeys.push(`g${mn.toString().padEnd(2, '0')}${dd.toString().padEnd(2, '0')}`);

          dnl = new Intl.NumberFormat('en', { useGrouping: false }).format(dd);
          dn = new Intl.NumberFormat(this.lang, { useGrouping: false }).format(dd);
        }
        alt.push({
          day: dn,
          localeDay: dnl,
          month: mnm,
          localeMonth: mnml,
          calendar: cal,
        });
      });
      const dateOnly = new Date(d);
      dateOnly.setUTCHours(12, 0, 0, 0);
      days.push({
        name: n,
        localeName: nl,
        eventKeys,
        alt,
        i,
        w: d.getDay(),
        weekSeq,
        localeDate,
        localeTime: `${localeDate} ${[
          d.getUTCHours().toString().padStart(2, '0'),
          d.getUTCMinutes().toString().padStart(2, '0'),
          d.getUTCSeconds().toString().padStart(2, '0'),
        ].join(':')}`,
        date: d,
        events: dayEvent,
        dateOnly,
      });
    }

    return {
      calendar,
      days,
    };
  }

  /**
   * @param {('gregorian'|'persian'|'islamic')[]} reqCalendars Requested calendars
   */
  getMonthTable(reqCalendars = []) {
    const wdLocale = [];
    this.weekDays.forEach((wn) => {
      wdLocale.push(({
        wide: calendars[this.lang].week[wn],
        narrow: calendars[this.lang].weekNarrow[wn],
      }));
    });

    const { calendar, days } = this.getMonthDays(reqCalendars);

    const weeksDayList = groupBy(days, (e) => e.weekSeq);

    const r = [];
    Object.values(weeksDayList).forEach((weeks) => {
      /** @type {Array[Object]} */
      const w = [false, false, false, false, false, false, false];
      weeks.forEach((day) => {
        const i = this.weekDays.indexOf(day.date.getDay());
        w.splice(i, 1, {
          name: day.name,
          localeName: day.localeName,
          alt: day.alt,
          date: day.date,
          dateOnly: day.dateOnly,
          localeDate: day.localeDate,
          localeTime: day.localeTime,
          events: day.events,
        });
      });
      r.push(w);
    });

    return {
      calendar,
      calendarName: calendars[this.lang][calendar],
      head: wdLocale,
      weeks: r,
    };
  }
}

module.exports = AasaamDateTime;
