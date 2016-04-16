var fileHelper = function() {
    var fileSystem;

    var getFileSystem = function (success, fail) {
        if (fileSystem) {
            if(success) success(fileSystem);
            return;
        }
        var onSuccess = function(fs) {
            fileSystem = fs;
            if (success) success(fs);
        };
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, fail);
    };

    document.addEventListener("deviceready", getFileSystem);

    var properties = {
        createFile: function (filePath, success, fail) {
            getFileSystem(function(fs) {
                fs.root.getFile(filePath, { create: true, exclusive: false }, success, fail);
            }, fail);
        },

        createDirectory: function (path, success, fail) {
            getFileSystem(function(fs) {
                fs.root.getDirectory(path, { create: true, exclusive: false }, success, fail);
            }, fail);
            
        },

        getFile: function (filePath, success, fail) {
            getFileSystem(function(fs) {
                var gotFileEntry = function (fileEntry) {
                    fileEntry.file(success, fail);
                };
                fs.root.getFile(filePath, { create: true, exclusive: false }, gotFileEntry, fail);
            }, fail);
        },

        readFileAsText: function(file, getResult) {
            var reader = new FileReader();
            if (getResult) {
                reader.onloadend = function(evt) {
                    getResult(evt.target.result);
                };
            }
            reader.readAsText(file);
        },

        writeTextToFile: function (filePath, content, success, fail) {
            getFileSystem(function(fs) {
                var gotFileEntry = function (fileEntry) {
                    fileEntry.createWriter(function (writer) {
                        if (success) {
                            writer.onwrite = function (evt) {
                                success(evt);
                            };
                        }
                        writer.seek(writer.length);
                        writer.write(content);
                    }, fail);
                };
                fs.root.getFile(filePath, { create: true, exclusive: false }, gotFileEntry, fail);
            }, fail);
        }
    };

    return properties;
}();