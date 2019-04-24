<template>
    <Page>
        <ActionBar :title="this.title">
            <StackLayout orientation="horizontal">
                <TextView :class="titleClass"
                          v-model="this.title"
                          editable="false"
                          @focus="onFocus"
                          @blur="onBlur">
                </TextView>
                <ActivityIndicator color="maroon" :busy="this.isLoading"></ActivityIndicator>
                <Switch :checked="this.status" @checkedChange="onCheckedChange"></Switch>
            </StackLayout>
        </ActionBar>
        <StackLayout orientation="vertical" backgroundColor="#3c495e">
            <SearchBar hint="Music is the key..." v-model:text="searchPhrase"></SearchBar>

            <ScrollView class="file-list" orientation="vertical">
                <StackLayout orientation="vertical">
                    <Button class="file-list-entry"
                            v-for="file in this.files"
                            v-show="isMatched(file)"
                            :key="file.id"
                            :text="file.text"
                            :style="getColor(file)"
                            textWrap="true"
                            @tap="onFileTap(file)">
                    </Button>
                </StackLayout>
            </ScrollView>

            <ScrollView class="button-list" orientation="horizontal">
                <StackLayout orientation="horizontal">
                    <Button class="button-list-entry"
                            v-for="button in this.buttons"
                            :text="button.text"
                            :key="button.id"
                            @tap="onControllerTap(button.callback)">
                    </Button>
                </StackLayout>
            </ScrollView>
        </StackLayout>
    </Page>
</template>

<script>
    import Controller from '../controllers/controller';
    const controller = new Controller();

    export default {
        data() {
            return {
                title: "Music-Cast",
                titleClass: "title-default",
                status: false,
                searchPhrase: '',
                files: [],
                cachedFiles: [],
                currentDirectory: { max_line: 1, menu_layer: 0, menu_name: "SERVER" },
                isLoading: false,
                buttons: [
                    {id: 0, text: "ON", callback: () => controller.powerON()},
                    {id: 1, text: "OFF", callback: () => controller.powerOFF()},
                    {id: 2, text: "+", callback: () => controller.increaseVolume()},
                    {id: 3, text: "-", callback: () => controller.decreaseVolume()},
                    {id: 4, text: "M", callback: () => controller.muteToggle()},
                    {id: 5, text: "PREV", callback: () => controller.previous()},
                    {id: 6, text: "PAUSE", callback: () => controller.pause()},
                    {id: 7, text: "PLAY", callback: () => controller.play()},
                    {id: 8, text: "STOP", callback: () => controller.stop()},
                    {id: 9, text: "NEXT", callback: () => controller.next()},
                    {id: 10, text: "TRAVERSE FULL", callback: () => controller.traverseFull()},
                    {id: 11, text: "TRAVERSE NORMAL", callback: () => controller.traverseNormal()},
                    {id: 12, text: "TRAVERSE SHALLOW", callback: () => controller.traverseShallow()},
                ],
                temp: undefined,
            }
        },
        created: async function () {
            this.status = await controller.isON();

            if ( await controller.exists() && !(await controller.empty()) ) {
                controller.loadFromFile()
                    .then(response => {
                        this.cachedFiles = response;
                        console.log("Content loaded from file successfully!");
                    }).catch(err => {
                    console.log("ERROR " + err.message);
                });
            }
        },
        mounted: async function () {
            alert("mounted");
            this.currentDirectory = await controller.pwd();
        },
        watch: {
            currentDirectory: async function (cDir) {
                // alert("Watch triggered...");
                let ls = this.cachedFiles.find(function (ls) {
                    return ls['menu_layer'] === cDir.menu_layer && ls['menu_name'] === cDir.menu_name;
                });

                if (ls === undefined) {
                    // alert("Listing NOT found in cached files...");
                    ls = await controller.ls();
                    if (ls !== false) {
                        this.cachedFiles.push(ls);
                        this.files = ls['list_info'];
                    }
                } else {
                    // alert("Listing found in cached files...");
                    this.files = ls['list_info'];
                }

                // reset the search field
                this.searchPhrase = "";
            }
        },
        methods: {
            onFocus: function () {
                // reset the search field
                this.searchPhrase = "";
                this.titleClass = "title-menu";
                this.temp = JSON.parse(JSON.stringify(this.files));
                this.files = this.buttons;
            },
            onBlur: function () {
                this.titleClass = "title-default";
                this.files = JSON.parse(JSON.stringify(this.temp));
                this.temp = undefined;
            },
            onCheckedChange: async function () {
                await controller.powerToggle();
            },
            onFileTap: async function (file) {
                let response = false;

                // set activity indicator to busy
                this.isLoading = true;

                if (controller.isParentDirectory(file)) {
                    response = await controller.cd$$();
                    this.currentDirectory = await controller.pwd();
                } else if (controller.isDirectory(file)) {
                    response = await controller.cd(file.id);
                    this.currentDirectory = await controller.pwd();
                } else if (controller.isSoundFile(file)) {
                    response = await controller.$(file.id);
                } else if (file.callback) {
                    response = await file.callback();
                } else {
                    alert("Unable to play!");
                }

                // set activity indicator to free again
                this.isLoading = false;

                return response;
            },
            onControllerTap: function (callback) {
                return callback();
            },
            getColor: function (file) {
                if (controller.isParentDirectory(file) || controller.isDirectory(file)) {
                    return { color: 'white', fontWeight: 'bold' };
                } else if (controller.isSoundFile(file)) {
                    return { color: 'indianred', fontWeight: 'bold' };
                } else if (file.callback) {
                    return { color: 'cornflowerblue', fontWeight: 'bold' };
                } else {
                    return { color: 'lightgray' };
                }
            },
            isMatched: function (file) {
                return (file.text.toUpperCase()).includes(this.searchPhrase.toUpperCase());
            },
        },
        // destroyed: async function () {
        //     await controller.saveToFile(this.cachedFiles);
        // }
    }
</script>

<style src="../components/Home.css" scoped></style>
