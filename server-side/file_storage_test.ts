import { PapiClient } from '@pepperi-addons/papi-sdk'
import { Client, Request } from '@pepperi-addons/debug-server'
import TestService from './test.service'
import tester from './tester';

// Test Functions /file_storage_test/CRUDOneFileFromFileStorageTest
export async function CRUDOneFileFromFileStorageTest(Client: Client, Request: Request) {
    const { describe, expect, it, run } = tester();

    const fetch = require("node-fetch");

    const service = new TestService(Client);

    //#region Prerequisites
    //#region CRUD One File Using The File Storage in Base64
    //Get the current (before) files from the File Storage
    let allfilesBeforeAddFromBase64 = await service.getFilesFromStorage();

    //Add a file to the File Storage
    let testDataFileNameFromBase64 = "Test " + Math.floor(Math.random() * 1000000).toString();
    await service.postFilesToStorage(service.createNewTextFileFromBase64(testDataFileNameFromBase64, testDataFileNameFromBase64));

    //Get the current (after) files from the File Storage
    let allfilesAfterBase64 = await service.getFilesFromStorage();

    //Save the created file information
    var fileObjectBase64;
    for (let index = 0; index < allfilesAfterBase64.length; index++) {
        if (allfilesAfterBase64[index].FileName?.toString().startsWith(testDataFileNameFromBase64)) {
            fileObjectBase64 = allfilesAfterBase64[index];
            break;
        }
    }

    //Get the created file content
    var uriFromBase64 = fileObjectBase64.URL;
    var fileContentFromBase64 = await fetch(uriFromBase64)
        .then((response) => response.text());

    //Update the new added file
    var updatedfileObjectBase64 = {};
    Object.assign(updatedfileObjectBase64, fileObjectBase64);
    updatedfileObjectBase64["Description"] = "New description"
    updatedfileObjectBase64["Content"] = Buffer.from('EDCBA').toString('base64'),
        await service.postFilesToStorage(updatedfileObjectBase64);

    //Get the current (after the update) files from the File Storage
    let allfilesAfterBase64Update = await service.getFilesFromStorage();

    let updatedfileObjectBase64NewUrl;
    for (let index = 0; index < allfilesAfterBase64Update.length; index++) {
        if (allfilesAfterBase64Update[index].FileName?.toString().startsWith(testDataFileNameFromBase64)) {
            updatedfileObjectBase64NewUrl = allfilesAfterBase64Update[index];
            break;
        }
    }

    //Get the updated file content
    var updateduriFromBase64 = updatedfileObjectBase64NewUrl.URL;
    var updatedfileContentFromBase64 = await fetch(updateduriFromBase64)
        .then((response) => response.text());

    //#endregion

    //#region CRD One File Using The File Storage using URL
    //Get the current (before) files from the File Storage
    let allfilesBeforeAddFromURL = await service.getFilesFromStorage();

    //Add a file to the File Storage with URL
    let testDataFileNameFromURL = "Test " + Math.floor(Math.random() * 1000000).toString();
    let testDataFileURL = "https://cdn.staging.pepperi.com/30013175/CustomizationFile/9e57eea7-0277-441d-beae-0de365cbdd8b/TestData.txt";
    await service.postFilesToStorage(service.createNewTextFileFromUrl(testDataFileNameFromURL, testDataFileNameFromURL, "", testDataFileURL));

    //Get the current (after) files from the File Storage
    let allfilesAfterURL = await service.getFilesFromStorage();

    //Save the created file information
    let fileObjectURL;
    for (let index = 0; index < allfilesAfterURL.length; index++) {
        if (allfilesAfterURL[index].FileName?.toString().startsWith(testDataFileNameFromURL)) {
            fileObjectURL = allfilesAfterURL[index];
            break;
        }
    }

    //Get the created file content
    var uriFromURL = fileObjectURL.URL;
    var fileContentFromURL = await fetch(uriFromURL)
        .then((response) => response.text());

    //#endregion

    //#region Make sure file uploaded via Base64 when using both Base64 and URL
    //Get the current (before) files from the File Storage
    let allfilesBeforeAddFromURLAndBase64 = await service.getFilesFromStorage();

    //Add a file to the File Storage with URL
    let testDataFileNameFromURLAndBase64 = "Test " + Math.floor(Math.random() * 1000000).toString();
    let testDataFileURLAndBase64 = "https://cdn.staging.pepperi.com/30013175/CustomizationFile/9e57eea7-0277-441d-beae-0de365cbdd8b/TestData.txt";
    let testDataFileURLAndBase64Body = await service.createNewTextFileFromBase64(testDataFileNameFromURLAndBase64, testDataFileNameFromURLAndBase64);
    testDataFileURLAndBase64Body["URL"] = testDataFileURLAndBase64;
    await service.postFilesToStorage(testDataFileURLAndBase64Body);
    //Get the current (after) files from the File Storage
    let allfilesAfterURLAndBase64 = await service.getFilesFromStorage();

    //Save the created file information
    let fileObjectURLAndBase64;
    for (let index = 0; index < allfilesAfterURLAndBase64.length; index++) {
        if (allfilesAfterURLAndBase64[index].FileName?.toString().startsWith(testDataFileNameFromURLAndBase64)) {
            fileObjectURLAndBase64 = allfilesAfterURLAndBase64[index];
            break;
        }
    }

    //Get the created file content
    var uriFromURLAndBase64 = fileObjectURLAndBase64.URL;
    var fileContentFromURLAndBase64 = await fetch(uriFromURLAndBase64)
        .then((response) => response.text());

    //#endregion

    //#endregion Prerequisites

    //#region Tests
    describe('CRUD One File Using The File Storage in Base64', () => {

        it('Create a file in the file storage', () => {
            expect(allfilesBeforeAddFromBase64.length).to.be.equal(allfilesAfterBase64.length - 1);
        });

        it('Read the new added file properties', () => {
            expect(Number(fileObjectBase64.InternalID) > 200000);
            expect(fileObjectBase64.Configuration).to.be.null;
            expect(fileObjectBase64.Content).to.be.null;
            expect(fileObjectBase64.CreationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(fileObjectBase64.Description).to.be.undefined
            expect(fileObjectBase64.FileName).to.be.equal(testDataFileNameFromBase64 + ".txt");
            expect(fileObjectBase64.Hidden).to.be.false;
            expect(fileObjectBase64.IsSync).to.be.false;
            expect(fileObjectBase64.MimeType).to.be.equal("text/plain");
            expect(fileObjectBase64.ModificationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(fileObjectBase64.Title).to.be.equal(testDataFileNameFromBase64);
            expect(fileObjectBase64.URL).to.be.contain(testDataFileNameFromBase64 + ".txt");
        });

        it('Read the new added file content', () => {
            expect(fileContentFromBase64).to.contain("ABCD");
        });

        let UpdatedfileObjectBase64;
        it('Update the new added file', () => {
            for (let index = 0; index < allfilesAfterBase64Update.length; index++) {
                if (allfilesAfterBase64Update[index].FileName?.toString().startsWith(testDataFileNameFromBase64)) {
                    UpdatedfileObjectBase64 = allfilesAfterBase64Update[index];
                    break;
                }
            }
            expect(Number(UpdatedfileObjectBase64.InternalID) == fileObjectBase64.InternalID);
            expect(UpdatedfileObjectBase64.Configuration).to.be.null;
            expect(UpdatedfileObjectBase64.Content).to.be.null;
            expect(UpdatedfileObjectBase64.CreationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(UpdatedfileObjectBase64.Description).to.be.equal("New description");
            expect(UpdatedfileObjectBase64.FileName).to.be.equal(testDataFileNameFromBase64 + ".txt");
            expect(UpdatedfileObjectBase64.Hidden).to.be.false;
            expect(UpdatedfileObjectBase64.IsSync).to.be.false;
            expect(UpdatedfileObjectBase64.MimeType).to.be.equal("text/plain");
            expect(UpdatedfileObjectBase64.ModificationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(UpdatedfileObjectBase64.Title).to.be.equal(testDataFileNameFromBase64);
            expect(UpdatedfileObjectBase64.URL).to.be.contain(testDataFileNameFromBase64 + ".txt");
        });

        it('Read the updated file content', () => {
            expect(updatedfileContentFromBase64).to.contain("EDCBA");
        });

        let allfilesAfterBase64Deleted;

        it('Make sure all clean ups are finished', () => {
            //Make sure all the files are removed in the end of the tests
            TestCleanUp(Client);

            //Get the current (after) files from the File Storage
            allfilesAfterBase64Deleted = service.getFilesFromStorage();
        });

        it('Delete the new file', () => {
            let deletedfileObjectBase64;

            for (let index = 0; index < allfilesAfterBase64Deleted.length; index++) {
                if (allfilesAfterBase64Deleted[index].FileName?.toString().startsWith(testDataFileNameFromURLAndBase64)) {
                    deletedfileObjectBase64 = allfilesAfterBase64Deleted[index];
                    break;
                }
            }
            expect(deletedfileObjectBase64).to.be.undefined
        });
    });

    describe('CRD One File Using The File Storage using URL', () => {

        it('Create a file in the file storage', () => {
            expect(allfilesBeforeAddFromURL.length).to.be.equal(allfilesAfterURL.length - 1);
        });

        it('Read the new added file properties', () => {
            expect(Number(fileObjectURL.InternalID) > 200000);
            expect(fileObjectURL.Configuration).to.be.null;
            expect(fileObjectURL.Content).to.be.null;
            expect(fileObjectURL.CreationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(fileObjectURL.Description).to.be.equal(fileObjectURL.Description);
            expect(fileObjectURL.FileName).to.be.equal(testDataFileNameFromURL + ".txt");
            expect(fileObjectURL.Hidden).to.be.false;
            expect(fileObjectURL.IsSync).to.be.false;
            expect(fileObjectURL.MimeType).to.be.equal("text/plain");
            expect(fileObjectURL.ModificationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(fileObjectURL.Title).to.be.equal(testDataFileNameFromURL);
            expect(fileObjectURL.URL).to.be.contain(testDataFileNameFromURL + ".txt");
        });

        it('Read the new added file content', () => {
            expect(fileContentFromURL).to.contain("Test Data for File Storage");
        });

        let allfilesAfterURLDeleted;

        it('Make sure all clean ups are finished', () => {
            //Make sure all the files are removed in the end of the tests
            TestCleanUp(Client);

            //Get the current (after) files from the File Storage
            allfilesAfterURLDeleted = service.getFilesFromStorage();
        });

        it('Delete the new file', () => {
            let deletedfileObjectURL;

            for (let index = 0; index < allfilesAfterURLDeleted.length; index++) {
                if (allfilesAfterURLDeleted[index].FileName?.toString().startsWith(testDataFileNameFromURL)) {
                    deletedfileObjectURL = allfilesAfterURLDeleted[index];
                    break;
                }
            }
            expect(deletedfileObjectURL).to.be.undefined
        });
    });

    describe('Make sure file uploaded via Base64 when using both Base64 and URL', () => {

        it('Create a file in the file storage', () => {
            expect(allfilesBeforeAddFromURLAndBase64.length).to.be.equal(allfilesAfterURLAndBase64.length - 1);
        });

        it('Read the new added file properties', () => {
            expect(Number(fileObjectURLAndBase64.InternalID) > 200000);
            expect(fileObjectURLAndBase64.Configuration).to.be.null;
            expect(fileObjectURLAndBase64.Content).to.be.null;
            expect(fileObjectURLAndBase64.CreationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(fileObjectURLAndBase64.Description).to.be.equal(fileObjectURLAndBase64.Description);
            expect(fileObjectURLAndBase64.FileName).to.be.equal(testDataFileNameFromURLAndBase64 + ".txt");
            expect(fileObjectURLAndBase64.Hidden).to.be.false;
            expect(fileObjectURLAndBase64.IsSync).to.be.false;
            expect(fileObjectURLAndBase64.MimeType).to.be.equal("text/plain");
            expect(fileObjectURLAndBase64.ModificationDate).to.contain(new Date().toISOString().split("T")[0]);
            expect(fileObjectURLAndBase64.Title).to.be.equal(testDataFileNameFromURLAndBase64);
            expect(fileObjectURLAndBase64.URL).to.be.contain(testDataFileNameFromURLAndBase64 + ".txt");
        });

        it('Read the new added file content', () => {
            expect(fileContentFromURLAndBase64).to.contain("ABCD");
        });

        let allfilesAfterURLAndBase64Deleted;

        it('Make sure all clean ups are finished', () => {
            //Make sure all the files are removed in the end of the tests
            TestCleanUp(Client);

            //Get the current (after) files from the File Storage
            allfilesAfterURLAndBase64Deleted = service.getFilesFromStorage();
        });

        it('Delete the new file', () => {
            let deletedfileObjectURLAndBase64;

            for (let index = 0; index < allfilesAfterURLAndBase64Deleted.length; index++) {
                if (allfilesAfterURLAndBase64Deleted[index].FileName?.toString().startsWith(testDataFileNameFromURLAndBase64)) {
                    deletedfileObjectURLAndBase64 = allfilesAfterURLAndBase64Deleted[index];
                    break;
                }
            }
            expect(deletedfileObjectURLAndBase64).to.be.undefined
        });
    });
    return run();
    //#endregion
}

//Service Functions
//Remove all test files from Files Storage
async function TestCleanUp(Client: Client) {
    const service = new TestService(Client);
    let allfilesObject = await service.getFilesFromStorage();
    let tempBody = {};
    for (let index = 0; index < allfilesObject.length; index++) {
        if (allfilesObject[index].FileName?.toString().startsWith("Test ") &&
            Number(allfilesObject[index].FileName?.toString().split(' ')[1].split('.')[0]) > 1000) {
            tempBody["InternalID"] = allfilesObject[index].InternalID;
            tempBody["Hidden"] = true;
            await service.postFilesToStorage(tempBody);
        }
    }
}

//#region Original experimental function
export async function failTest(Client, Request) {
    var Success = false;
    var Message = "something failed";

    return {
        Success,
        Message
    };
}

export async function passTest(Client, Request) {
    var Success = true;
    var Message = "something successed";

    return {
        Success,
        Message
    };
}

export async function allTests(Client, Request) {
    const results: Object[] = [];
    results.push(await failTest(Client, Request));
    results.push(await passTest(Client, Request));
    return results;
}

export async function getFiles(Client, Request) {
    var Success = true;
    const service = new TestService(Client);
    var Message = await service.getFilesFromStorage();

    return {
        Success,
        Message
    };
}

export async function getFileConfigurationById(Client: Client, Request: Request) {
    var Success = true;
    const service = new TestService(Client);
    var Message = await service.getFileConfigurationByID(286918);

    return {
        Success,
        Message
    };
}

export async function test1(Client: Client, Request: Request) {
    const { describe, expect, it, run } = tester();

    describe('Array', () => {
        describe('#indexOf', () => {
            it('should return -1 when item is not in list', () => {
                expect([1, 2, 3].indexOf(4)).to.be.equal(-1);
            })

            it('should return 1 when item is in list', () => {
                expect([1, 2, 3].indexOf(2)).to.be.equal(1);
            })
        })

        describe('#filter', () => {
            it('should return 2 objects', () => {
                const res = [1, 2, 3].filter(x => x < 3)
                expect(res).to.have.lengthOf(2);
                expect(res[0]).to.be.equal(1);
                expect(res[1]).to.be.equal(2);
            })
        })
    })

    describe('Object', () => {

        const obj = { a: 1, b: '2' };
        describe('#Keys', () => {
            it('should return array of the keys', () => {
                const res = Object.keys(obj);
                expect(res).to.have.lengthOf(2);
            })
        })
    })

    return await run();
}
/*
exports.PassTest = async function (Client, Request) {
    const papiClient = new PapiClient({
        baseURL: Client.BaseURL,
        token: Client.OAuthAccessToken
    });

    const addons = await papiClient.userDefinedTables.find({
       page_size:-1
    });
    console.log(addons);

    const expected = addons.filter(udt => {
        return udt.MapDataExternalID === 'TSAExample'
    }).length;

    const addons2 = await papiClient.userDefinedTables.find({
        where: `MapDataExternalID='TSAExample'`,
        page_size:-1
    });
    console.log(addons2);
    const actual = addons2.length;

    var Success = expected == actual;
    var Message = `${expected} - ${actual}`;

    return {
        Success,
        Message
    };
};
*/

//#endregion Original experimental function
