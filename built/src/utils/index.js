"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDates = exports.truncateContent = exports.getJustDate = exports.formatDate = void 0;
// @ts-nocheck
const formatDate = () => {
    const newDate = new Date();
    return newDate;
};
exports.formatDate = formatDate;
const getJustDate = (fullDate) => new Date(fullDate.toDateString());
exports.getJustDate = getJustDate;
const truncateContent = (content, maxLength = 20) => {
    const { length } = content;
    if (length >= maxLength) {
        return `${content.substring(0, maxLength)}...`;
    }
    return content;
};
exports.truncateContent = truncateContent;
// eslint-disable-next-line no-extend-native
Date.prototype.addDays = (days) => {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};
const getDates = (startDate, stopDate) => {
    const dateArray = [];
    let currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date(currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
};
exports.getDates = getDates;
