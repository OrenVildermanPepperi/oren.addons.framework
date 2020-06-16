import Mocha, { Suite } from 'mocha';
import { expect } from 'chai';
import fs from 'fs'
import path from 'path'
import Mochawesome from 'mochawesome'

export default function Tester() {
    const mochaDir = '/tmp/mochawesome-results-' + new Date().toISOString().replace(/\.|\:/g, '-');
    const fileName = 'report';
    const mocha = new Mocha({
        reporter: Mochawesome,
        reporterOptions: {
            reportDir: mochaDir,
            reportFilename: fileName,
            html: false,
            consoleReporter: 'none'
        }
    });
    const root = mocha.suite;
    let context: Suite | undefined = root;

    return {
        describe: (name: string, fn: () => any) => {
            const suite = new Mocha.Suite(name);
            context?.addSuite(suite);
            context = suite;
            fn();
            context = suite.parent;
        },

        it: (name: string, fn: Mocha.Func | Mocha.AsyncFunc | undefined) => {
            context?.addTest(new Mocha.Test(name, fn))
        },

        expect: expect,

        run: () => {
            return new Promise((resolve, reject) => {

                const runner = mocha.run((failures) => { }).on('end', () => {
                    // resolve((runner as any).testResults);
                    setTimeout(() => {
                        fs.readFile(path.join(mochaDir, fileName + '.json'), (err, data) => {
                            if (err) {
                                console.error(err);
                                reject(new Error("error reading output file"))
                            }
                            else {
                                resolve(JSON.parse(data.toString()));
                            }
                        })
                    }, 10)
                })
            })
        }
    }
}