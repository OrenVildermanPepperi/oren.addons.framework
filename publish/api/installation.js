'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var install = async (Client, Request) => {
    return {success:true,resultObject:{}}
};
var uninstall = async (Client, Request) => {
    return {success:true,resultObject:{}}
};
var upgrade = async (Client, Request) => {
    return {success:true,resultObject:{}}
};
var downgrade = async (Client, Request) => {
    return {success:true,resultObject:{}}
};

var installation = {
	install: install,
	uninstall: uninstall,
	upgrade: upgrade,
	downgrade: downgrade
};

exports.default = installation;
exports.downgrade = downgrade;
exports.install = install;
exports.uninstall = uninstall;
exports.upgrade = upgrade;
