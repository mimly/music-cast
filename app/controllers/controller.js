const host = '192.168.1.2';
const root = '/YamahaExtendedControl/v1';
const URL = `http://${host}${root}`;

// **************************************
const Secure = require('../modules/secure');
const secure = new Secure(`http://${host}/YamahaExtendedControl`);
// **************************************

const Dist = require('../modules/dist');
const dist = new Dist(URL);

const Main = require('../modules/main');
const main = new Main(URL);

const Netusb = require('../modules/netusb');
const netusb = new Netusb(URL);

const System = require('../modules/system');
const system = new System(URL);


const fileSystemModule = require("tns-core-modules/file-system");

export default class Controller {

    constructor() {
        this.file = fileSystemModule.knownFolders.temp().getFile('cachedFileList.json');
    }

    async loadFromFile() {
        try {
            let response = await this.file.readText();
            return JSON.parse(response);
        } catch (err) {
            alert("ERROR: " + err.message);
            return err;
        }
    }

    async saveToFile(cachedFileList) {
        try {
            let response = await this.file.writeText(JSON.stringify(cachedFileList));
            return response;
        } catch (err) {
            alert("ERROR: " + err.message);
            return err;
        }
    }

    async exists() {
        return await fileSystemModule.File.exists(this.file.path);
    }

    async empty() {
        return await this.file.size === 0;
    }

    async traverser(list_info, cachedFileList, depth) {
        if (depth > 0) {
            depth = depth - 1;
            for (let f of list_info) {
                if (this.isDirectory(f)) {
                    let response = await this.cd(f['id']);
                    response = await this.ls();
                    cachedFileList.push(response);
                    await this.traverser(response['list_info'], cachedFileList, depth);
                    await this.pwd();
                    await this.cd$$();
                    await this.pwd();
                }
            }
        }
    }

    async traverseFull() {
        await this.powerOFF();
        await this.powerON();
        let cachedFileList = [];

        let response = await this.ls();
        cachedFileList.push(response);

        await this.traverser(response['list_info'], cachedFileList, 13);

        this.saveToFile(cachedFileList).then(response => {
            alert("Saved!")
        });
    }

    async traverseNormal() {
        await this.powerOFF();
        await this.powerON();
        let cachedFileList = [];

        let response = await this.ls();
        cachedFileList.push(response);

        let indexes = [0,0,0,3,6];
        for (let i of indexes) {
            response = await this.cd(i);
            response = await this.ls();
            cachedFileList.push(response);
        }

        await this.traverser(response['list_info'], cachedFileList, 7);

        this.saveToFile(cachedFileList).then(response => {
            alert("Saved!")
        });
    }

    async traverseShallow() {
        await this.powerOFF();
        await this.powerON();
        let cachedFileList = [];

        let response = await this.ls();
        cachedFileList.push(response);

        let indexes = [0,0,0,3,6];
        for (let i of indexes) {
            response = await this.cd(i);
            response = await this.ls();
            cachedFileList.push(response);
        }

        this.saveToFile(cachedFileList).then(response => {
            alert("Saved!");
        });
    }

    isParentDirectory(file) {
        return file.attribute === 89;
    }

    isDirectory(file) {
        return file.attribute === 125829122 || file.attribute === 125829138 || file.attribute === 2;
    }

    isFile(file) {
        return file.attribute === 125829124 || file.attribute === 0;
    }

    isSoundFile(file) {
        return file.attribute === 125829124 || file.attribute === 125829140;
    }



    async isON() {
        let response = await main.getStatus();
        return response['response_code'] === 0 && response['power'] === 'on';
    };

    async powerON() {
        let response = await main.setPower('on');
        return response['response_code'] === 0;
    };

    async powerOFF() {
        let response = await main.setPower('standby');
        return response['response_code'] === 0;
    };

    async powerToggle() {
        let response = false;
        if (await this.isON()) {
            response = await this.powerOFF();
        } else {
            response = await this.powerON();
        }
        return response['response_code'] === 0;
    };

    async checkAudioQuality() {
        let response = await main.getStatus();
        return response['response_code'] === 0 && response['link_control'] === 'standard' && response['link_audio_quality'] === 'uncompressed';
    };

    async changeInput(input='server') {
        let response = await main.prepareInputChange(input);
        if (response['response_code'] === 0) {
            response = await main.setInput(input, 'autoplay_disabled');
        }
        return response['response_code'] === 0;
    };




    async playFile(index) {
        let response = await netusb.setListControl('play', index);
        return response['response_code'] === 0;
    };

    async $(index) {
        return await this.playFile(index);
    }

    async changeDirectory(index) {
        let response = await netusb.setListControl('select', index);
        return response['response_code'] === 0;
    };

    async cd(index) {
        return await this.changeDirectory(index);
    }

    async changeDirectoryBack() {
        let response = await netusb.setListControl('return');
        return response['response_code'] === 0;
    };

    async cd$$() {
        return await this.changeDirectoryBack();
    }

    async listFiles() {
        let response = await netusb.getListInfo('server', 0, 8);
        // alert(JSON.stringify(response));
        if (response['response_code'] !== 0) {
            // await this.listFiles();
            return response['response_code'] === 0;
        }

        let max_line = response['max_line'];
        let menu_layer = response['menu_layer'];
        let menu_name = response['menu_name'];

        let fileList = response['list_info'];
        for (let i=8; i < response['max_line']; i += 8) {
            response = await netusb.getListInfo('server', i, 8);
            // alert(JSON.stringify(response));
            if (response['response_code'] !== 0) {
                // await this.listFiles();
                return response['response_code'];
            }

            fileList = fileList.concat(response['list_info']);
        }

        // for (let i = 0; i < fileList.length; ++i) {
        //     fileList[i]['id'] = i;
        // }
        fileList.forEach((file, i) => file['id'] = i );
        fileList.unshift({ id: fileList.length, text: "../", attribute: 89 });

        console.log(fileList);
        return response['response_code'] === 0 && { max_line: max_line, menu_layer: menu_layer, menu_name: menu_name, list_info: fileList };
    };

    async ls() {
        return await this.listFiles();
    }

    async currentDirectory() {
        let response = await netusb.getListInfo('server', 0, 8);
        let max_line = response['max_line'];
        let menu_layer = response['menu_layer'];
        let menu_name = response['menu_name'];
        console.log("PWD: " + JSON.stringify({ max_line: max_line, menu_layer: menu_layer, menu_name: menu_name }));
        return response['response_code'] === 0 && { max_line: max_line, menu_layer: menu_layer, menu_name: menu_name };
    };

    async pwd() {
        return await this.currentDirectory();
    }




    async increaseVolume() {
        let volume = await this.getVolume();
        let response = await main.setVolume(volume + 4); // +2dB
        return response['response_code'] === 0;
    };

    async decreaseVolume() {
        let volume = await this.getVolume();
        let response = await main.setVolume(volume - 4); // -2dB
        return response['response_code'] === 0;
    };

    async getVolume() {
        let response = await main.getStatus();
        return response['response_code'] === 0 && response['volume'];
    };

    async isMuted() {
        let response = await main.getStatus();
        return response['response_code'] === 0 && response['mute'];
    };

    async muteON() {
        let response = await main.setMute(true);
        return response['response_code'] === 0;
    };

    async muteOFF() {
        let response = await main.setMute(false);
        return response['response_code'] === 0;
    };

    async muteToggle() {
        let response = false;
        if (await this.isMuted()) {
            response = await this.muteOFF();
        } else {
            response = await this.muteON();
        }
        return response;
    }

    async play() {
        let response = await netusb.setPlayback('play');
        return response['response_code'] === 0;
    };

    async pause() {
        let response = await netusb.setPlayback('pause');
        return response['response_code'] === 0;
    };

    async stop() {
        let response = await netusb.setPlayback('stop');
        return response['response_code'] === 0;
    };

    async next() {
        let response = await netusb.setPlayback('next');
        return response['response_code'] === 0;
    };

    async previous() {
        let response = await netusb.setPlayback('previous');
        return response['response_code'] === 0;
    };

};
