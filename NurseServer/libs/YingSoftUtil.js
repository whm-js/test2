'use strict';
const moment = require('moment');

module.exports = {
    ConvertDate: (datepart, d) => {
        let val = (d === null || d === undefined) ? '-' : d;        
        if (!datepart) return val;
        if (datepart === '1900-01-01 00:00:00' || datepart === '1900-01-01') return val;
        if (!moment(datepart).isValid()) return val;
        return moment(datepart).format('YYYY-MM-DD');
    }
};